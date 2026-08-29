/* ============================================================
   DUO JEANS — CRIAÇÃO DA COBRANÇA (Mercado Pago)
   ------------------------------------------------------------
   Esta função roda no SERVIDOR, não no navegador da cliente.

   POR QUE ELA EXISTE (segurança):
   1. O token da sua conta Mercado Pago fica aqui, fora do site.
      Se ficasse no navegador, qualquer pessoa poderia copiá-lo.
   2. O preço é recalculado aqui, a partir do catálogo. O valor
      que o navegador envia é ignorado. Sem isso, alguém poderia
      abrir o console do navegador, trocar 289,90 por 1,00 e
      fechar o pedido.
   3. Dados de cartão nunca passam por aqui nem pelo site — a
      cliente digita direto na tela do Mercado Pago.

   COMO ATIVAR: veja LEIA-ME.md, seção "Ativando cartão e boleto".
   ============================================================ */

const fs = require('fs');
const path = require('path');

/* ------------------------------------------------------------
   Carrega catálogo e configuração dos mesmos arquivos que o
   site usa, para não existir duas listas de preço diferentes.
   ------------------------------------------------------------ */
let CATALOGO = null;
let CONFIGURACAO = null;

function carregarDados() {
  if (CATALOGO && CONFIGURACAO) return;

  const raiz = process.env.LAMBDA_TASK_ROOT || process.cwd();
  const ler = (arquivo) => {
    for (const base of [raiz, process.cwd(), path.join(__dirname, '../..')]) {
      const p = path.join(base, arquivo);
      if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8');
    }
    throw new Error('Arquivo não encontrado: ' + arquivo);
  };

  const src = ler('assets/js/produtos.js') + '\n' + ler('assets/js/config.js') +
              '\nreturn { PRODUTOS: PRODUTOS, CONFIG: CONFIG };';
  const resultado = new Function(src)();
  CATALOGO = resultado.PRODUTOS;
  CONFIGURACAO = resultado.CONFIG;
}

/* ------------------------------------------------------------
   Utilidades
   ------------------------------------------------------------ */
const cent = (v) => Math.round(Number(v) * 100);
const real = (c) => Math.round(c) / 100;

function responder(status, corpo) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    },
    body: JSON.stringify(corpo)
  };
}

/* Tira caracteres de controle e sinais de marcacao antes de
   repassar qualquer texto adiante. */
function limpar(texto, max) {
  let saida = '';
  const bruto = String(texto == null ? '' : texto);
  for (const ch of bruto) {
    const c = ch.codePointAt(0);
    if (c < 32 || c === 127) continue;
    if (ch === '<' || ch === '>') continue;
    saida += ch;
  }
  return saida.trim().slice(0, max || 120);
}

/* ------------------------------------------------------------
   Frete calculado no servidor, pela mesma tabela do site
   ------------------------------------------------------------ */
function calcularFrete(cep, baseCentavos, cupom) {
  const cfg = CONFIGURACAO.frete;
  const c = CONFIGURACAO.cupons[cupom];
  if (c && c.tipo === 'frete') return 0;
  if (cfg.gratisAcima > 0 && baseCentavos >= cent(cfg.gratisAcima)) return 0;

  const d = String(cep || '').replace(/\D/g, '');
  if (d.length !== 8) return null;
  const faixa = cfg.tabela.find(f => f.digitos.includes(d[0]));
  return faixa ? cent(faixa.valor) : null;
}

/* ============================================================
   HANDLER
   ============================================================ */
exports.handler = async (event) => {

  if (event.httpMethod === 'OPTIONS') return responder(204, {});
  if (event.httpMethod !== 'POST') {
    return responder(405, { erro: 'Método não permitido.' });
  }

  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) {
    return responder(500, {
      erro: 'Gateway não configurado.',
      detalhe: 'Falta a variável de ambiente MERCADOPAGO_ACCESS_TOKEN.'
    });
  }

  let entrada;
  try {
    entrada = JSON.parse(event.body || '{}');
  } catch (e) {
    return responder(400, { erro: 'Requisição inválida.' });
  }

  try {
    carregarDados();
  } catch (e) {
    return responder(500, { erro: 'Não foi possível carregar o catálogo.' });
  }

  /* ---------- 1. Valida e RE-PRECIFICA os itens ---------- */
  const itensEntrada = Array.isArray(entrada.itens) ? entrada.itens : [];
  if (!itensEntrada.length || itensEntrada.length > 40) {
    return responder(400, { erro: 'Sacola inválida.' });
  }

  const itens = [];
  let subtotal = 0;

  for (const bruto of itensEntrada) {
    const produto = CATALOGO.find(p => p.id === bruto.id);
    if (!produto) {
      return responder(400, { erro: 'Produto indisponível: ' + limpar(bruto.id, 40) });
    }

    const tamanho = String(bruto.tamanho);
    const tamanhosValidos = produto.tamanhos.map(String);
    const esgotados = (produto.esgotados || []).map(String);

    if (!tamanhosValidos.includes(tamanho)) {
      return responder(400, { erro: 'Tamanho inválido para ' + produto.nome });
    }
    if (esgotados.includes(tamanho)) {
      return responder(409, { erro: produto.nome + ' está esgotado no tamanho ' + tamanho });
    }

    const qtd = Math.floor(Number(bruto.qtd));
    if (!Number.isFinite(qtd) || qtd < 1 || qtd > 10) {
      return responder(400, { erro: 'Quantidade inválida.' });
    }

    /* O preço vem do catálogo do servidor — nunca do navegador */
    const precoCentavos = cent(produto.preco);
    subtotal += precoCentavos * qtd;

    itens.push({
      id: produto.id,
      titulo: produto.nome + ' — Tam ' + tamanho,
      qtd,
      precoCentavos
    });
  }

  /* ---------- 2. Cupom ---------- */
  const codigoCupom = limpar(entrada.cupom, 24).toUpperCase();
  const cupom = codigoCupom ? CONFIGURACAO.cupons[codigoCupom] : null;
  let desconto = 0;
  if (cupom && cupom.tipo === 'percentual') {
    desconto = Math.round(subtotal * cupom.valor);
  }

  /* ---------- 3. Desconto do Pix ---------- */
  const metodo = ['cartao', 'pix', 'boleto'].includes(entrada.metodo) ? entrada.metodo : 'cartao';
  if (metodo === 'pix' && CONFIGURACAO.pagamento.pix.desconto) {
    desconto += Math.round((subtotal - desconto) * CONFIGURACAO.pagamento.pix.desconto);
  }

  const baseComDesconto = subtotal - desconto;
  if (baseComDesconto < 100) {
    return responder(400, { erro: 'Valor do pedido inválido.' });
  }

  /* ---------- 4. Frete ---------- */
  const entrega = entrada.entrega || {};
  let frete = 0;
  if (entrega.tipo !== 'retirada') {
    frete = calcularFrete(entrega.cep, baseComDesconto, codigoCupom);
    if (frete === null) {
      return responder(400, { erro: 'Não entregamos neste CEP.' });
    }
  }

  /* ---------- 5. Distribui o desconto nos itens ----------
     O Mercado Pago cobra a soma dos itens, então o desconto
     precisa entrar no preço unitário. O último item absorve a
     diferença de arredondamento para o total fechar exato.   */
  const fator = baseComDesconto / subtotal;
  let acumulado = 0;
  const itensMP = itens.map((it, i) => {
    let unitario;
    if (i === itens.length - 1) {
      unitario = Math.round((baseComDesconto - acumulado) / it.qtd);
    } else {
      unitario = Math.round(it.precoCentavos * fator);
      acumulado += unitario * it.qtd;
    }
    return {
      id: it.id,
      title: it.titulo,
      quantity: it.qtd,
      unit_price: real(unitario),
      currency_id: 'BRL'
    };
  });

  /* ---------- 6. Métodos de pagamento aceitos ---------- */
  const excluir = [];
  if (metodo === 'pix')    excluir.push({ id: 'credit_card' }, { id: 'debit_card' }, { id: 'ticket' });
  if (metodo === 'boleto') excluir.push({ id: 'credit_card' }, { id: 'debit_card' }, { id: 'bank_transfer' });
  if (metodo === 'cartao') excluir.push({ id: 'ticket' });

  /* ---------- 7. Monta a preferência ---------- */
  const origem = event.headers.origin ||
                 (event.headers.host ? 'https://' + event.headers.host : '') ||
                 process.env.URL || '';

  const cliente = entrada.cliente || {};
  const numero = limpar(entrada.numero, 24) || ('DUO' + Date.now().toString(36).toUpperCase());
  const cpf = String(cliente.cpf || '').replace(/\D/g, '');
  const telefone = String(cliente.telefone || '').replace(/\D/g, '');

  const preferencia = {
    external_reference: numero,
    items: itensMP,
    payer: {
      name: limpar(cliente.nome, 80),
      email: limpar(cliente.email, 120),
      identification: cpf.length === 11 ? { type: 'CPF', number: cpf } : undefined,
      phone: telefone.length >= 10
        ? { area_code: telefone.slice(0, 2), number: telefone.slice(2) }
        : undefined,
      address: entrega.tipo !== 'retirada' ? {
        zip_code: String(entrega.cep || '').replace(/\D/g, ''),
        street_name: limpar(entrega.rua, 80),
        street_number: limpar(entrega.numero, 10)
      } : undefined
    },
    shipments: {
      mode: 'not_specified',
      cost: real(frete),
      receiver_address: entrega.tipo !== 'retirada' ? {
        zip_code: String(entrega.cep || '').replace(/\D/g, ''),
        street_name: limpar(entrega.rua, 80),
        street_number: limpar(entrega.numero, 10),
        city_name: limpar(entrega.cidade, 60),
        state_name: limpar(entrega.uf, 2)
      } : undefined
    },
    payment_methods: {
      excluded_payment_types: excluir,
      installments: CONFIGURACAO.pagamento.mercadopago.parcelas
    },
    back_urls: {
      success: origem + '/pedido.html?n=' + encodeURIComponent(numero) + '&status=aprovado',
      pending: origem + '/pedido.html?n=' + encodeURIComponent(numero) + '&status=pendente',
      failure: origem + '/checkout.html?erro=1'
    },
    auto_return: 'approved',
    statement_descriptor: 'DUOJEANS',
    binary_mode: false
  };

  /* ---------- 8. Chama o Mercado Pago ---------- */
  try {
    const resposta = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': numero
      },
      body: JSON.stringify(preferencia)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      console.error('Mercado Pago recusou:', JSON.stringify(dados));
      return responder(502, { erro: 'O pagamento não pôde ser aberto. Tente novamente.' });
    }

    const producao = token.startsWith('APP_USR');

    /* O valor cobrado é a soma exata das linhas enviadas ao
       gateway — é ele que devolvemos, não o valor teórico. */
    const cobrado = itensMP.reduce(
      (s, i) => s + Math.round(i.unit_price * 100) * i.quantity, 0) + frete;

    return responder(200, {
      url: producao ? dados.init_point : dados.sandbox_init_point,
      pedido: numero,
      total: real(cobrado)
    });

  } catch (e) {
    console.error('Falha ao criar cobrança:', e);
    return responder(502, { erro: 'Não conseguimos falar com o meio de pagamento.' });
  }
};
