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

  /* ============================================================
     FRETE, CUPONS E ROLETA — agora em dados/loja.json
     ------------------------------------------------------------
     Esses três blocos saíram daqui. Quem edita é o painel em
     /admin, que grava em  dados/loja.json.

     Se precisar mexer na mão, edite aquele arquivo — não volte
     a escrever aqui, ou o painel sobrescreve na próxima vez.
     ============================================================ */

  /* ---------- TEXTOS ---------- */
  avisoTopo: 'FRETE GRÁTIS ACIMA DE R$ 399 · ATÉ 3X SEM JUROS · 5% OFF NO PIX',

  trocas: 'Primeira troca por conta da Duo. Você tem 7 dias corridos após o recebimento para solicitar, com a peça sem uso e com a etiqueta.'
};

/* Não edite daqui para baixo ------------------------------- */
CONFIG.whatsappLink = (texto) =>
  'https://wa.me/' + CONFIG.loja.whatsapp +
  (texto ? '?text=' + encodeURIComponent(texto) : '');
CONFIG.instagramLink = 'https://instagram.com/' + CONFIG.loja.instagram;
