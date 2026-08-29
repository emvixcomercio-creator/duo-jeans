/* ============================================================
   DUO JEANS — CHECKOUT
   ------------------------------------------------------------
   Fluxo em 3 passos: Identificação → Entrega → Pagamento.

   SEGURANÇA — como o dinheiro trafega:
   • Cartão e boleto vão para o Mercado Pago, em ambiente próprio
     dele. Nenhum número de cartão passa por este site, nem é
     guardado aqui. É o mesmo modelo usado pelas grandes lojas.
   • O valor do pedido é recalculado NO SERVIDOR a partir dos
     códigos dos produtos. O preço enviado pelo navegador nunca
     é aceito — isso impede que alguém altere o total pelo
     console e compre por R$ 1,00.
   ============================================================ */

const Checkout = {

  passo: 1,
  estado: {
    cliente: {},
    entrega: { tipo: 'entrega' },
    frete: null,
    cupom: null,
    metodo: 'cartao'
  },

  /* ---------------------------------------------------------
     INÍCIO
     --------------------------------------------------------- */
  iniciar() {
    if (!Sacola.itens().length) {
      Checkout.sacolaVazia();
      return;
    }
    Checkout.montarPagamentos();
    Checkout.ligarEventos();
    Checkout.atualizarResumo();
    Checkout.irPara(1);
  },

  sacolaVazia() {
    document.querySelector('[data-checkout]').innerHTML =
      '<div class="vazio">' + ICONES.sacolaVazia +
      '<h2 class="titulo t-md mb-3">Sua sacola está vazia</h2>' +
      '<p class="chamada mb-3" style="margin-inline:auto">Escolha suas peças e volte para finalizar.</p>' +
      '<a href="produtos.html" class="btn btn-principal">Ver a coleção</a></div>';
    document.querySelector('[data-resumo-coluna]')?.classList.add('oculto');
    document.querySelector('.passos')?.classList.add('oculto');
  },

  /* ---------------------------------------------------------
     NAVEGAÇÃO ENTRE OS PASSOS
     --------------------------------------------------------- */
  irPara(n) {
    Checkout.passo = n;
    document.querySelectorAll('[data-painel-passo]').forEach(p => {
      p.classList.toggle('oculto', Number(p.dataset.painelPasso) !== n);
    });
    document.querySelectorAll('.passo').forEach(p => {
      const i = Number(p.dataset.passo);
      p.classList.toggle('ativo', i === n);
      p.classList.toggle('feito', i < n);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  /* ---------------------------------------------------------
     VALIDAÇÃO
     --------------------------------------------------------- */
  erro(campo, mensagem) {
    const c = document.querySelector('[name="' + campo + '"]')?.closest('.campo');
    if (!c) return;
    c.classList.add('tem-erro');
    const e = c.querySelector('.erro-campo');
    if (e) e.textContent = mensagem;
  },

  limparErros(painel) {
    painel.querySelectorAll('.campo.tem-erro').forEach(c => c.classList.remove('tem-erro'));
  },

  valor(nome) {
    const el = document.querySelector('[name="' + nome + '"]');
    return el ? el.value.trim() : '';
  },

  validarPasso1() {
    const p = document.querySelector('[data-painel-passo="1"]');
    Checkout.limparErros(p);
    let ok = true;

    const nome = Checkout.valor('nome');
    const email = Checkout.valor('email');
    const cpf = Checkout.valor('cpf');
    const tel = Checkout.valor('telefone');

    if (nome.split(' ').filter(Boolean).length < 2) {
      Checkout.erro('nome', 'Informe seu nome completo.'); ok = false;
    }
    if (!U.validaEmail(email)) {
      Checkout.erro('email', 'Informe um e-mail válido.'); ok = false;
    }
    if (!U.validaCPF(cpf)) {
      Checkout.erro('cpf', 'CPF inválido. Confira os números.'); ok = false;
    }
    if (!U.validaTel(tel)) {
      Checkout.erro('telefone', 'Informe o telefone com DDD.'); ok = false;
    }

    if (ok) Checkout.estado.cliente = { nome, email, cpf, telefone: tel };
    return ok;
  },

  validarPasso2() {
    const p = document.querySelector('[data-painel-passo="2"]');
    Checkout.limparErros(p);

    if (Checkout.estado.entrega.tipo === 'retirada') {
      Checkout.estado.frete = { valor: 0, prazo: CONFIG.frete.retirada.detalhe, regiao: 'Retirada' };
      return true;
    }

    let ok = true;
    const cep = Checkout.valor('cep');
    const rua = Checkout.valor('rua');
    const numero = Checkout.valor('numero');
    const bairro = Checkout.valor('bairro');
    const cidade = Checkout.valor('cidade');
    const uf = Checkout.valor('uf');

    if (!U.validaCEP(cep)) { Checkout.erro('cep', 'CEP inválido.'); ok = false; }
    if (!rua)    { Checkout.erro('rua', 'Informe a rua.'); ok = false; }
    if (!numero) { Checkout.erro('numero', 'Informe o número.'); ok = false; }
    if (!bairro) { Checkout.erro('bairro', 'Informe o bairro.'); ok = false; }
    if (!cidade) { Checkout.erro('cidade', 'Informe a cidade.'); ok = false; }
    if (!uf)     { Checkout.erro('uf', 'UF.'); ok = false; }

    if (!Checkout.estado.frete && ok) {
      const f = Frete.calcular(cep);
      if (!f) { Checkout.erro('cep', 'Não entregamos neste CEP. Fale com a gente.'); ok = false; }
      else Checkout.estado.frete = f;
    }

    if (ok) {
      Checkout.estado.entrega = {
        tipo: 'entrega', cep, rua, numero, bairro, cidade, uf,
        complemento: Checkout.valor('complemento'),
        referencia: Checkout.valor('referencia')
      };
    }
    return ok;
  },

  /* ---------------------------------------------------------
     FRETE
     --------------------------------------------------------- */
  async buscarCEP(cep) {
    const aviso = document.querySelector('[data-cep-status]');
    if (!U.validaCEP(cep)) return;

    if (aviso) aviso.textContent = 'Buscando endereço…';

    const end = await Frete.endereco(cep);
    const f = Frete.calcular(cep);

    if (end) {
      const set = (n, v) => {
        const el = document.querySelector('[name="' + n + '"]');
        if (el && v) el.value = v;
      };
      set('rua', end.logradouro);
      set('bairro', end.bairro);
      set('cidade', end.localidade);
      set('uf', end.uf);
      document.querySelector('[name="numero"]')?.focus();
    }

    if (f) {
      Checkout.estado.frete = f;
      if (aviso) {
        const t = Sacola.totais({ cupom: Checkout.estado.cupom });
        const gratis = t.subtotal - t.desconto >= CONFIG.frete.gratisAcima;
        aviso.innerHTML = gratis
          ? '<strong>Frete grátis</strong> para ' + U.esc(f.regiao) + ' · ' + U.esc(f.prazo)
          : U.esc(f.regiao) + ' · ' + U.dinheiro(f.valor) + ' · ' + U.esc(f.prazo);
      }
    } else if (aviso) {
      aviso.textContent = 'Não conseguimos calcular o frete para este CEP.';
    }
    Checkout.atualizarResumo();
    Checkout.montarPagamentos();
  },

  /* ---------------------------------------------------------
     CUPOM
     --------------------------------------------------------- */
  aplicarCupom() {
    const el = document.querySelector('[name="cupom"]');
    const codigo = (el.value || '').trim().toUpperCase();
    if (!codigo) return;

    if (!CONFIG.cupons[codigo]) {
      Aviso.erro('Cupom inválido ou expirado.');
      return;
    }
    Checkout.estado.cupom = codigo;
    Aviso.mostrar('Cupom aplicado: ' + CONFIG.cupons[codigo].descricao);
    Checkout.atualizarResumo();
    Checkout.montarPagamentos();   // os valores por forma de pagamento mudaram
  },

  /* ---------------------------------------------------------
     FORMAS DE PAGAMENTO
     --------------------------------------------------------- */
  montarPagamentos() {
    const alvo = document.querySelector('[data-metodos]');
    if (!alvo) return;

    const t = Checkout.totais();
    const parc = U.parcelas(t.total);
    const usaMP = CONFIG.pagamento.provedor === 'mercadopago';

    const opcao = (id, titulo, desc, tag, icone) =>
      '<label class="opcao-radio' + (Checkout.estado.metodo === id ? ' selecionada' : '') + '" data-metodo="' + id + '">' +
        '<input type="radio" name="metodo" value="' + id + '"' +
          (Checkout.estado.metodo === id ? ' checked' : '') + '>' +
        '<div class="opcao-corpo">' +
          '<div class="opcao-titulo"><span>' + titulo +
            (tag ? '<span class="opcao-tag">' + tag + '</span>' : '') + '</span>' + (icone || '') + '</div>' +
          '<div class="opcao-desc">' + desc + '</div>' +
        '</div>' +
      '</label>';

    let html = '';

    if (usaMP) {
      html += opcao('cartao', 'Cartão de crédito', 'Em até ' + parc.n + 'x de ' +
        U.dinheiro(parc.valor) + ' sem juros. Visa, Mastercard, Elo, Amex e Hipercard.', null);
    }

    html += opcao('pix', 'Pix',
      'Aprovação na hora. Você paga ' + U.dinheiro(t.totalPix) + ' e economiza ' +
      U.dinheiro(t.economiaPix) + '.',
      (CONFIG.pagamento.pix.desconto ? Math.round(CONFIG.pagamento.pix.desconto * 100) + '% off' : null));

    if (usaMP) {
      html += opcao('boleto', 'Boleto bancário',
        'Compensação em até 3 dias úteis. O pedido é separado após o pagamento.', null);
    }

    alvo.innerHTML = html;

    if (!usaMP) {
      alvo.insertAdjacentHTML('beforeend',
        '<div class="cartao-destaque"><p style="font-size:.82rem;margin:0">' +
        '<strong>Cartão e boleto:</strong> ative o gateway de pagamento para liberar essas opções. ' +
        'O passo a passo está no arquivo LEIA-ME.md, seção “Ativando cartão e boleto”.</p></div>');
    }
  },

  /* ---------------------------------------------------------
     RESUMO
     --------------------------------------------------------- */
  totais() {
    return Sacola.totais({
      cupom: Checkout.estado.cupom,
      frete: Checkout.estado.frete ? Checkout.estado.frete.valor : null,
      retirada: Checkout.estado.entrega.tipo === 'retirada'
    });
  },

  atualizarResumo() {
    const t = Checkout.totais();
    const alvo = document.querySelector('[data-resumo]');
    if (!alvo) return;

    const itens = t.itens.map(i =>
      '<div class="resumo-item">' +
        '<img src="' + U.esc(i.imagem) + '" alt="" onerror="' + U.imgFallback + '">' +
        '<div><div class="resumo-item-nome">' + U.esc(i.nome) + '</div>' +
        '<div class="resumo-item-meta">Tam ' + U.esc(i.tamanho) + ' · Qtd ' + i.qtd + '</div></div>' +
        '<div class="item-preco">' + U.dinheiro(i.subtotal) + '</div>' +
      '</div>').join('');

    const linha = (rot, val, classe) =>
      '<div class="resumo-linha' + (classe ? ' ' + classe : '') + '"><span>' + rot + '</span><span>' + val + '</span></div>';

    let corpo = '<div class="resumo-itens">' + itens + '</div>';
    corpo += linha('Subtotal', U.dinheiro(t.subtotal));
    if (t.desconto > 0)
      corpo += linha('Cupom ' + U.esc(Checkout.estado.cupom), '− ' + U.dinheiro(t.desconto), 'verde');
    corpo += linha('Entrega',
      Checkout.estado.entrega.tipo === 'retirada' ? '<span class="verde">Retirada</span>'
      : (!Checkout.estado.frete ? '<span class="texto-suave">calcular</span>'
        : (t.frete === 0 ? '<span class="verde">Grátis</span>' : U.dinheiro(t.frete))));
    corpo += linha('Total', U.dinheiro(t.total), 'total');

    if (Checkout.estado.metodo === 'pix' && t.economiaPix > 0) {
      corpo += '<div class="resumo-linha verde" style="margin-top:.5rem">' +
        '<span>No Pix</span><span>' + U.dinheiro(t.totalPix) + '</span></div>';
    } else {
      const p = U.parcelas(t.total);
      corpo += '<p class="legenda mt-2" style="text-transform:none;letter-spacing:0;font-size:.74rem">' +
        'ou ' + p.n + 'x de ' + U.dinheiro(p.valor) + ' sem juros</p>';
    }

    alvo.innerHTML = corpo;
  },

  /* ---------------------------------------------------------
     FINALIZAR
     --------------------------------------------------------- */
  async finalizar(botao) {
    const t = Checkout.totais();
    if (!t.itens.length) return;

    if (Checkout.estado.entrega.tipo === 'entrega' && !Checkout.estado.frete) {
      Aviso.erro('Calcule o frete antes de finalizar.');
      Checkout.irPara(2);
      return;
    }

    const original = botao.innerHTML;
    botao.disabled = true;
    botao.innerHTML = 'Processando…';

    const pedido = {
      numero: Checkout.gerarNumero(),
      data: new Date().toISOString(),
      cliente: Checkout.estado.cliente,
      entrega: Checkout.estado.entrega,
      frete: Checkout.estado.frete,
      cupom: Checkout.estado.cupom,
      metodo: Checkout.estado.metodo,
      /* Só o essencial vai para o servidor. Os preços são
         recalculados lá a partir destes códigos. */
      itens: t.itens.map(i => ({ id: i.id, tamanho: i.tamanho, qtd: i.qtd, nome: i.nome, preco: i.preco })),
      subtotal: t.subtotal,
      desconto: t.desconto,
      valorFrete: t.frete,
      total: Checkout.estado.metodo === 'pix' ? t.totalPix : t.total
    };

    try {
      const usaMP = CONFIG.pagamento.provedor === 'mercadopago';

      if (usaMP) {
        const r = await fetch(CONFIG.pagamento.mercadopago.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            numero: pedido.numero,
            metodo: pedido.metodo,
            cupom: pedido.cupom,
            itens: pedido.itens.map(i => ({ id: i.id, tamanho: i.tamanho, qtd: i.qtd })),
            entrega: pedido.entrega,
            cliente: pedido.cliente
          })
        });

        if (!r.ok) throw new Error('gateway');
        const dados = await r.json();
        if (!dados.url) throw new Error('gateway');

        Checkout.guardar(pedido);
        Checkout.notificar(pedido);
        location.href = dados.url;      // vai para o ambiente seguro do gateway
        return;
      }

      /* Modo Pix direto (sem gateway) */
      if (!Pix.chaveValida(CONFIG.pagamento.pix.chave)) {
        throw new Error('pix-nao-configurado');
      }
      pedido.pix = Pix.gerar({
        chave: CONFIG.pagamento.pix.chave,
        nome: CONFIG.pagamento.pix.nomeRecebedor,
        cidade: CONFIG.pagamento.pix.cidade,
        valor: pedido.total,
        identificador: pedido.numero
      });
      Checkout.guardar(pedido);
      Checkout.notificar(pedido);
      Sacola.limpar();
      location.href = 'pedido.html?n=' + encodeURIComponent(pedido.numero);

    } catch (e) {
      botao.disabled = false;
      botao.innerHTML = original;
      if (e.message === 'pix-nao-configurado') {
        Aviso.erro('Pagamento ainda não configurado. Confira a chave Pix em config.js.');
      } else {
        Aviso.erro('Não conseguimos abrir o pagamento. Tente novamente em instantes.');
      }
    }
  },

  gerarNumero() {
    const d = new Date();
    const base = d.getTime().toString(36).toUpperCase().slice(-6);
    return (CONFIG.pedidos.prefixoNumero || 'DUO') + base;
  },

  guardar(pedido) {
    U.salvar('duo_pedido_' + pedido.numero, pedido);
    U.salvar('duo_ultimo_pedido', pedido.numero);
  },

  /* Envia o pedido para o e-mail da loja, se configurado */
  notificar(pedido) {
    const url = CONFIG.pedidos.endpointEmail;
    if (!url) return;
    const corpo = {
      _subject: 'Novo pedido ' + pedido.numero + ' — Duo Jeans',
      pedido: pedido.numero,
      cliente: pedido.cliente.nome,
      email: pedido.cliente.email,
      telefone: pedido.cliente.telefone,
      pagamento: pedido.metodo,
      total: U.dinheiro(pedido.total),
      itens: pedido.itens.map(i => i.nome + ' | tam ' + i.tamanho + ' | ' + i.qtd + 'un').join('\n'),
      entrega: pedido.entrega.tipo === 'retirada' ? 'Retirada' :
        [pedido.entrega.rua, pedido.entrega.numero, pedido.entrega.complemento,
         pedido.entrega.bairro, pedido.entrega.cidade + '/' + pedido.entrega.uf,
         'CEP ' + pedido.entrega.cep].filter(Boolean).join(', ')
    };
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(corpo)
    }).catch(() => { /* não bloqueia a compra se o aviso falhar */ });
  },

  /* ---------------------------------------------------------
     EVENTOS
     --------------------------------------------------------- */
  ligarEventos() {
    document.addEventListener('click', (e) => {

      const continuar = e.target.closest('[data-continuar]');
      if (continuar) {
        const destino = Number(continuar.dataset.continuar);
        if (destino === 2 && !Checkout.validarPasso1()) return;
        if (destino === 3 && !Checkout.validarPasso2()) return;
        if (destino === 3) Checkout.montarPagamentos();
        Checkout.atualizarResumo();
        Checkout.irPara(destino);
        return;
      }

      const voltar = e.target.closest('[data-voltar]');
      if (voltar) { Checkout.irPara(Number(voltar.dataset.voltar)); return; }

      if (e.target.closest('[data-aplicar-cupom]')) { Checkout.aplicarCupom(); return; }

      const passo = e.target.closest('.passo');
      if (passo && Number(passo.dataset.passo) < Checkout.passo) {
        Checkout.irPara(Number(passo.dataset.passo));
        return;
      }

      const fin = e.target.closest('[data-finalizar]');
      if (fin) { Checkout.finalizar(fin); return; }
    });

    document.addEventListener('change', (e) => {

      if (e.target.name === 'metodo') {
        Checkout.estado.metodo = e.target.value;
        document.querySelectorAll('[data-metodo]').forEach(l =>
          l.classList.toggle('selecionada', l.dataset.metodo === e.target.value));
        Checkout.atualizarResumo();
      }

      if (e.target.name === 'tipoEntrega') {
        Checkout.estado.entrega.tipo = e.target.value;
        document.querySelector('[data-campos-entrega]')
          ?.classList.toggle('oculto', e.target.value === 'retirada');
        document.querySelectorAll('[data-tipo-entrega]').forEach(l =>
          l.classList.toggle('selecionada', l.dataset.tipoEntrega === e.target.value));
        if (e.target.value === 'retirada') Checkout.estado.frete = { valor: 0, prazo: '', regiao: 'Retirada' };
        Checkout.atualizarResumo();
        Checkout.montarPagamentos();
      }
    });

    /* CEP: busca o endereço assim que completa 8 dígitos */
    const cep = document.querySelector('[name="cep"]');
    if (cep) {
      cep.addEventListener('input', () => {
        if (U.soDigitos(cep.value).length === 8) Checkout.buscarCEP(cep.value);
      });
    }

    /* Limpa o erro assim que a cliente corrige o campo */
    document.addEventListener('input', (e) => {
      e.target.closest('.campo.tem-erro')?.classList.remove('tem-erro');
    });

    document.addEventListener('sacola:mudou', () => {
      if (!Sacola.itens().length) Checkout.sacolaVazia();
      else Checkout.atualizarResumo();
    });
  }
};

/* ============================================================
   PÁGINA DE CONFIRMAÇÃO DO PEDIDO
   ============================================================ */
const PaginaPedido = {

  iniciar() {
    const numero = U.param('n') || U.ler('duo_ultimo_pedido', null);
    const pedido = numero ? U.ler('duo_pedido_' + numero, null) : null;
    const alvo = document.querySelector('[data-pedido]');
    if (!alvo) return;

    if (!pedido) {
      alvo.innerHTML =
        '<div class="vazio">' + ICONES.info +
        '<h2 class="titulo t-md mb-3">Pedido não encontrado</h2>' +
        '<p class="chamada mb-3" style="margin-inline:auto">' +
        'Não localizamos este pedido neste navegador. Se você já pagou, ' +
        'fique tranquila: o comprovante foi enviado para o seu e-mail.</p>' +
        '<a href="produtos.html" class="btn btn-principal">Voltar à loja</a></div>';
      return;
    }

    const nomeMetodo = { pix: 'Pix', cartao: 'Cartão de crédito', boleto: 'Boleto bancário' }[pedido.metodo] || pedido.metodo;

    let html =
      '<div class="confirmacao">' +
        '<div class="icone-sucesso">' + ICONES.check + '</div>' +
        '<p class="antetitulo">Pedido registrado</p>' +
        '<h1 class="titulo t-lg">Obrigada pela sua compra</h1>' +
        '<div class="numero-pedido">' + U.esc(pedido.numero) + '</div>' +
        '<p class="chamada" style="margin-inline:auto">' +
          'Enviamos os detalhes para <strong>' + U.esc(pedido.cliente.email) + '</strong>. ' +
          'Forma de pagamento: <strong>' + U.esc(nomeMetodo) + '</strong>.' +
        '</p>';

    /* Pix direto: mostra o QR e o código para copiar */
    if (pedido.pix) {
      html +=
        '<div class="painel pix-caixa mt-4" style="max-width:520px;margin-inline:auto;text-align:center">' +
          '<h2 class="painel-titulo">Pague com Pix para confirmar</h2>' +
          '<p class="chamada" style="margin-inline:auto">Abra o app do seu banco, escolha Pix ' +
          'e leia o código abaixo. A confirmação é imediata.</p>' +
          '<div class="pix-qr" data-qr></div>' +
          '<div style="font-size:1.3rem;font-weight:600;color:var(--marinho)">' + U.dinheiro(pedido.total) + '</div>' +
          '<div class="pix-codigo">' +
            '<input type="text" readonly value="' + U.esc(pedido.pix) + '" data-pix-codigo aria-label="Código Pix copia e cola">' +
            '<button class="btn btn-principal btn-p" data-copiar-pix>Copiar</button>' +
          '</div>' +
          '<p class="legenda mt-3" style="text-transform:none;letter-spacing:0">' +
          'Depois de pagar, é só aguardar — confirmamos e separamos seu pedido.</p>' +
        '</div>';
    }

    /* Linha do tempo do pedido */
    const etapas = [
      ['Pedido recebido', 'Recebemos seu pedido e reservamos as peças.'],
      [pedido.metodo === 'pix' ? 'Pagamento via Pix' : 'Pagamento em análise',
       pedido.metodo === 'boleto' ? 'O boleto compensa em até 3 dias úteis.'
       : 'Assim que o pagamento for confirmado, avisamos por e-mail.'],
      ['Separação e envio', 'Preparamos com cuidado e postamos em até 2 dias úteis.'],
      ['A caminho', CONFIG.frete.prazoTexto]
    ];

    html += '<div class="linha-tempo">' +
      etapas.map((e, i) =>
        '<div class="etapa' + (i === 0 ? ' atual' : '') + '">' +
          '<div class="etapa-bola">' + (i === 0 ? ICONES.check : (i + 1)) + '</div>' +
          '<div><h4>' + U.esc(e[0]) + '</h4><p>' + U.esc(e[1]) + '</p></div>' +
        '</div>').join('') +
      '</div>';

    html +=
      '<div class="mt-4" style="display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap">' +
        '<a href="produtos.html" class="btn btn-contorno">Continuar comprando</a>' +
        '<a class="btn btn-principal" target="_blank" rel="noopener" href="' +
          CONFIG.whatsappLink('Olá! Fiz o pedido ' + pedido.numero + ' no site e queria acompanhar.') +
          '">Falar com o atendimento</a>' +
      '</div>' +
    '</div>';

    alvo.innerHTML = html;

    if (pedido.pix) {
      try { QR.desenhar('[data-qr]', pedido.pix); }
      catch (e) {
        document.querySelector('[data-qr]').innerHTML =
          '<p class="legenda" style="padding:1rem;text-transform:none">Use o código copia e cola abaixo.</p>';
      }
      document.querySelector('[data-copiar-pix]')?.addEventListener('click', async (ev) => {
        const campo = document.querySelector('[data-pix-codigo]');
        try {
          await navigator.clipboard.writeText(campo.value);
        } catch (err) {
          campo.select();
          document.execCommand('copy');
        }
        ev.target.textContent = 'Copiado';
        Aviso.mostrar('Código Pix copiado');
        setTimeout(() => { ev.target.textContent = 'Copiar'; }, 2200);
      });
    }
  }
};
