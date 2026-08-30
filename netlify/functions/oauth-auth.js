/* ============================================================
   DUO JEANS — LOGIN DO PAINEL (passo 1 de 2)
   ------------------------------------------------------------
   Manda a pessoa para o GitHub pedir permissão.

   O painel em /admin chama esta função quando alguém clica em
   "Entrar com o GitHub". Ela não decide nada: só monta a URL do
   GitHub com o nosso Client ID e redireciona.

   Quem recebe a resposta do GitHub é a outra função,
   oauth-callback.js.

   Precisa da variável de ambiente:
     GITHUB_OAUTH_CLIENT_ID
   ============================================================ */

const crypto = require('crypto');

/* O endereço para onde o GitHub devolve a pessoa depois de aprovar.
   Precisa ser IDÊNTICO ao cadastrado no OAuth App do GitHub. */
function enderecoDeRetorno(event) {
  const host = event.headers['x-forwarded-host'] || event.headers.host;
  return 'https://' + host + '/oauth/callback';
}

exports.handler = async (event) => {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;

  if (!clientId) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        erro: 'Login do painel não configurado.',
        detalhe: 'Falta a variável de ambiente GITHUB_OAUTH_CLIENT_ID.'
      })
    };
  }

  /* O "state" protege contra alguém forjar o retorno do GitHub:
     geramos um valor aleatório agora, guardamos num cookie, e a
     outra função confere se voltou o mesmo. */
  const state = crypto.randomBytes(16).toString('hex');

  /* O painel pede o escopo que precisa; 'repo' é o padrão do Decap
     e é o que permite gravar o catálogo no repositório. */
  const escopo = (event.queryStringParameters || {}).scope || 'repo';

  const url = 'https://github.com/login/oauth/authorize'
    + '?client_id=' + encodeURIComponent(clientId)
    + '&redirect_uri=' + encodeURIComponent(enderecoDeRetorno(event))
    + '&scope=' + encodeURIComponent(escopo)
    + '&state=' + state;

  return {
    statusCode: 302,
    headers: {
      Location: url,
      /* HttpOnly: o JavaScript da página não lê. Lax: sobrevive ao
         retorno do GitHub. 10 minutos é tempo de sobra para logar. */
      'Set-Cookie': 'duo_oauth_state=' + state
        + '; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600',
      'Cache-Control': 'no-store'
    },
    body: ''
  };
};
