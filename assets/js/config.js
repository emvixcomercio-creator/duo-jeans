/* ============================================================
   DUO JEANS — CONFIGURAÇÃO DA LOJA
   ------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar para colocar
   a loja no ar. Troque os valores marcados com  <<< TROCAR
   ============================================================ */

const CONFIG = {

  /* ---------- DADOS DA LOJA ---------- */
  loja: {
    nome: 'Duo Jeans',
    slogan: 'Seu jeans. Seu jeito.',
    conceito: 'Denim feminino, essência atemporal.',
    dominio: 'duojeans.com.br',                    // <<< TROCAR

    instagram: 'duojeans_',                        // <<< TROCAR (sem @)
    email: 'contato@duojeans.com.br',              // <<< TROCAR
    cidade: 'São Paulo',                           // <<< TROCAR
    uf: 'SP',                                      // <<< TROCAR
    cnpj: '00.000.000/0001-00',                    // <<< TROCAR

    // WhatsApp usado APENAS para atendimento e dúvidas.
    // A compra é finalizada dentro do site.
    // Formato: 55 + DDD + número, só dígitos.        <<< TROCAR
    whatsapp: '5511999999999',
    atendimento: 'Seg a Sex, 9h às 18h · Sáb, 9h às 13h'
  },

  /* ============================================================
     PAGAMENTO
     ------------------------------------------------------------
     provedor: 'mercadopago'  → checkout completo e automático.
               O cliente paga cartão, Pix ou boleto na tela segura
               do Mercado Pago e você recebe a confirmação sozinho.
               Exige publicar a função em netlify/functions/
               (passo a passo no LEIA-ME.md).

     provedor: 'pix'          → modo provisório, funciona HOJE sem
               servidor nenhum. Gera o Pix copia-e-cola e o QR Code
               na hora. Você confere o pagamento na sua conta.
     ============================================================ */
  pagamento: {
    provedor: 'mercadopago',   // <<< use 'pix' se quiser vender antes de ativar o gateway

    // --- Mercado Pago ---
    mercadopago: {
      endpoint: '/.netlify/functions/criar-pagamento',
      parcelas: 3,          // parcelas sem juros oferecidas
      parcelaMinima: 30     // valor mínimo de cada parcela (R$)
    },

    // --- Pix direto (modo provisório) ---
    pix: {
      // Sua chave Pix: CPF/CNPJ (só números), e-mail,
      // telefone (+5511...) ou chave aleatória.      <<< TROCAR
      chave: '00000000000',

      // Nome do recebedor como está no banco.
      // Máx. 25 caracteres, sem acentos.              <<< TROCAR
      nomeRecebedor: 'DUO JEANS',

      // Cidade do recebedor. Máx. 15 caracteres, sem acentos.
      cidade: 'SAO PAULO',                           // <<< TROCAR

      // Desconto de quem paga no Pix (0.05 = 5%). Use 0 para desligar.
      desconto: 0.05,

      // Minutos que o cliente tem para pagar antes do pedido expirar.
      validadeMinutos: 30
    }
  },

  /* ============================================================
     PARA ONDE VÃO OS PEDIDOS
     ------------------------------------------------------------
     Cole aqui a URL de um formulário Formspree (plano grátis) para
     receber cada pedido novo por e-mail. Deixe vazio para desligar.
     Passo a passo no LEIA-ME.md.
     ============================================================ */
  pedidos: {
    endpointEmail: '',                             // ex.: https://formspree.io/f/xxxxxxx
    prefixoNumero: 'DUO'
  },

  /* ---------- ENTREGA ---------- */
  frete: {
    gratisAcima: 399,          // frete grátis a partir deste valor (0 = desligado)
    prazoTexto: '3 a 8 dias úteis após a confirmação do pagamento',

    // Tabela por região (definida pelo 1º dígito do CEP).
    // Ajuste com os valores que você realmente paga nos Correios.
    tabela: [
      { nome: 'Sudeste',      digitos: ['0','1','2','3'], valor: 24.90, prazo: '3 a 5 dias úteis' },
      { nome: 'Sul',          digitos: ['8','9'],         valor: 32.90, prazo: '4 a 7 dias úteis' },
      { nome: 'Centro-Oeste', digitos: ['7'],             valor: 36.90, prazo: '5 a 8 dias úteis' },
      { nome: 'Nordeste',     digitos: ['4','5','6'],     valor: 39.90, prazo: '6 a 10 dias úteis' }
    ],

    retirada: {
      ativo: true,
      texto: 'Retirada em mãos',
      detalhe: 'Combinamos o ponto de encontro depois da confirmação do pagamento.'
    }
  },

  /* ---------- CUPONS DE DESCONTO ---------- */
  cupons: {
    'DUO10':    { tipo: 'percentual', valor: 0.10, descricao: '10% de desconto' },
    'PRIMEIRA': { tipo: 'percentual', valor: 0.15, descricao: '15% na primeira compra' },
    'FRETEDUO': { tipo: 'frete',      valor: 1,    descricao: 'Frete grátis' }
  },

  /* ---------- TEXTOS ---------- */
  avisoTopo: 'FRETE GRÁTIS ACIMA DE R$ 399 · ATÉ 3X SEM JUROS · 5% OFF NO PIX',

  trocas: 'Primeira troca por conta da Duo. Você tem 7 dias corridos após o recebimento para solicitar, com a peça sem uso e com a etiqueta.'
};

/* Não edite daqui para baixo ------------------------------- */
CONFIG.whatsappLink = (texto) =>
  'https://wa.me/' + CONFIG.loja.whatsapp +
  (texto ? '?text=' + encodeURIComponent(texto) : '');
CONFIG.instagramLink = 'https://instagram.com/' + CONFIG.loja.instagram;
