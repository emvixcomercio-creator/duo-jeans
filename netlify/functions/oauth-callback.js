/* ============================================================
   DUO JEANS — LOGIN DO PAINEL (passo 2 de 2)
   ------------------------------------------------------------
   Recebe a pessoa de volta do GitHub e entrega o acesso ao painel.

   O GitHub devolve um "code" de uso único. Trocamos esse code por
   um token, usando o nosso segredo — que NUNCA sai do servidor.
   Depois devolvemos uma página que passa o token para a janela do
   painel e se fecha.

   Precisa das variáveis de ambiente:
     GITHUB_OAUTH_CLIENT_ID
     GITHUB_OAUTH_CLIENT_SECRET
   ============================================================ */

/* Lê um cookie específico do cabeçalho. */
function lerCookie(cabecalho, nome) {
  if (!cabecalho) return null;
  const achado = cabecalho.split(';')
    .map((p) => p.trim())
    .find((p) => p.indexOf(nome + '=') === 0);
  return achado ? achado.slice(nome.length + 1) : null;
}

/* Escapa para poder embutir com segurança dentro do <script>. */
function paraJs(valor) {
  return JSON.stringify(valor).replace(/</g, '\\u003c');
}

/* A página que o painel espera receber na janela de login.
   O Decap conversa por postMessage: primeiro avisamos que estamos
   autorizando, ele responde, e aí mandamos o resultado. */
function paginaResposta(tipo, conteudo) {
  const mensagem = 'authorization:github:' + tipo + ':' + JSON.stringify(conteudo);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Entrando no painel...</title>
<style>
  body{margin:0;height:100vh;display:grid;place-items:center;background:#F4EDE3;
       font:400 15px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;color:#0F2137}
  .caixa{text-align:center;padding:2rem}
  .marca{font-family:Georgia,serif;font-size:1.6rem;letter-spacing:.16em;margin-bottom:.4rem}
  .aviso{color:#5C6C7E;font-size:.9rem}
  .erro{color:#B4453C}
</style>
</head>
<body>
  <div class="caixa">
    <div class="marca">DUO JEANS</div>
    <p class="aviso${tipo === 'error' ? ' erro' : ''}">${
      tipo === 'success'
        ? 'Tudo certo. Pode fechar esta janela.'
        : 'Não foi possível entrar. Feche esta janela e tente de novo.'
    }</p>
  </div>
<script>
(function () {
  var mensagem = ${paraJs(mensagem)};

  function responder(e) {
    /* Só respondemos para a janela que nos abriu. */
    if (!window.opener) return;
    window.opener.postMessage(mensagem, e.origin);
    window.removeEventListener('message', responder, false);
    setTimeout(function () { window.close(); }, 800);
  }

  window.addEventListener('message', responder, false);

  if (window.opener) {
    window.opener.postMessage('authorizing:github', '*');
  }
})();
</script>
</body>
</html>`;
}

function responder(tipo, conteudo) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      /* A janela precisa conversar com a página do painel que a abriu. */
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      /* Apaga o cookie do state: serviu, acabou. */
      'Set-Cookie': 'duo_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'
    },
    body: paginaResposta(tipo, conteudo)
  };
}

exports.handler = async (event) => {
  const q = event.queryStringParameters || {};

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return responder('error', {
      message: 'Login do painel não configurado no servidor.'
    });
  }

  /* O GitHub avisa aqui quando a pessoa clica em "cancelar". */
  if (q.error) {
    return responder('error', { message: q.error_description || q.error });
  }

  if (!q.code) {
    return responder('error', { message: 'O GitHub não devolveu o código de acesso.' });
  }

  /* Confere o state contra o cookie que a outra função gravou. */
  const esperado = lerCookie(event.headers.cookie, 'duo_oauth_state');
  if (!esperado || !q.state || q.state !== esperado) {
    return responder('error', {
      message: 'Pedido de login inválido ou expirado. Tente novamente.'
    });
  }

  try {
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'duo-jeans-painel'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: q.code
      })
    });

    const dados = await r.json();

    if (!r.ok || dados.error || !dados.access_token) {
      return responder('error', {
        message: dados.error_description || dados.error || 'O GitHub recusou a troca do código.'
      });
    }

    return responder('success', {
      token: dados.access_token,
      provider: 'github'
    });
  } catch (e) {
    return responder('error', { message: 'Falha ao falar com o GitHub: ' + e.message });
  }
};
