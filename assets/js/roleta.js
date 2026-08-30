/* ============================================================
   DUO JEANS — ROLETA DE PRÊMIOS
   ------------------------------------------------------------
   Aparece uma vez por visitante, alguns segundos depois que ela
   entra no site. Nunca durante o checkout.

   COMO O SORTEIO FUNCIONA (importante):
   O resultado é sorteado de verdade, com o peso de cada fatia
   definido em config.js. A roleta gira até parar exatamente na
   fatia sorteada — a animação mostra o resultado real, não o
   contrário. Todas as fatias dão um prêmio que a cliente recebe
   de fato: o cupom é válido e aplica sozinho no checkout.

   Para desligar: em config.js, roleta.ativo = false
   ============================================================ */

const Roleta = {

  chave: 'duo_roleta',
  girando: false,
  premioSorteado: null,

  /* ---------------------------------------------------------
     Prêmio já ganho e ainda válido
     --------------------------------------------------------- */
  premioAtivo() {
    const g = U.ler(Roleta.chave, null);
    if (!g || !g.cupom) return null;
    if (g.expira && Date.now() > g.expira) return null;
    return g;
  },

  jaGirou() {
    return !!U.ler(Roleta.chave, null);
  },

  /* ---------------------------------------------------------
     Sorteio ponderado
     --------------------------------------------------------- */
  sortear(premios) {
    const total = premios.reduce((s, p) => s + (p.peso || 1), 0);
    let r = Math.random() * total;
    for (let i = 0; i < premios.length; i++) {
      r -= (premios[i].peso || 1);
      if (r <= 0) return i;
    }
    return premios.length - 1;
  },

  /* ---------------------------------------------------------
     Desenho da roleta em SVG
     --------------------------------------------------------- */
  desenhar(premios) {
    const n = premios.length;
    const fatia = 360 / n;
    const cx = 100, cy = 100, r = 95;
    const ponto = (ang, raio) => {
      const a = (ang - 90) * Math.PI / 180;
      return [cx + raio * Math.cos(a), cy + raio * Math.sin(a)];
    };

    let fatias = '', textos = '';
    for (let i = 0; i < n; i++) {
      const a1 = i * fatia, a2 = (i + 1) * fatia;
      const [x1, y1] = ponto(a1, r);
      const [x2, y2] = ponto(a2, r);
      const grande = fatia > 180 ? 1 : 0;
      const cor = i % 2 === 0 ? 'var(--marinho)' : '#FFFDF8';
      fatias += '<path d="M' + cx + ',' + cy + ' L' + x1.toFixed(2) + ',' + y1.toFixed(2) +
                ' A' + r + ',' + r + ' 0 ' + grande + ',1 ' + x2.toFixed(2) + ',' + y2.toFixed(2) + ' Z" ' +
                'fill="' + cor + '" stroke="#C9A461" stroke-width="0.7"/>';

      /* O rótulo corre no sentido do raio (do miolo para a borda),
         que é onde cabe texto longo tipo "FRETE GRÁTIS".
         O texto é centrado no meio da fatia e girado em torno de si
         mesmo; na metade de baixo ele leva 180° a mais, senão sairia
         de cabeça para baixo. */
      const meio = a1 + fatia / 2;
      const corTexto = i % 2 === 0 ? '#F7EFE2' : '#0F2137';
      const rotulo = premios[i].rotulo || '';
      const tamanho = rotulo.length > 10 ? 7.5 : (rotulo.length > 7 ? 8.5 : 10);

      const [tx, ty] = ponto(meio, 60);
      const giro = meio > 180 ? meio + 90 : meio - 90;

      textos += '<text x="' + tx.toFixed(2) + '" y="' + (ty + tamanho / 3).toFixed(2) + '" ' +
                'text-anchor="middle" ' +
                'transform="rotate(' + giro.toFixed(2) + ' ' + tx.toFixed(2) + ' ' + ty.toFixed(2) + ')" ' +
                'fill="' + corTexto + '" font-size="' + tamanho + '" font-weight="600" ' +
                'letter-spacing="0.3" font-family="Montserrat, sans-serif">' +
                U.esc(rotulo) + '</text>';
    }

    return '' +
      '<svg viewBox="0 0 200 200" class="roleta-svg" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="99" fill="#B08843"/>' +
        '<circle cx="100" cy="100" r="96.5" fill="#D8B36A"/>' +
        fatias + textos +
        '<circle cx="100" cy="100" r="19" fill="var(--marinho)" stroke="#B99653" stroke-width="1.6"/>' +
        '<text x="100" y="104" text-anchor="middle" fill="#B99653" font-size="13" ' +
          'font-family="Cinzel, serif" letter-spacing="0.5">D|J</text>' +
      '</svg>';
  },

  /* ---------------------------------------------------------
     Monta e abre
     --------------------------------------------------------- */
  abrir() {
    /* Nunca abre duas ao mesmo tempo */
    if (document.querySelector('.roleta')) return;

    const cfg = CONFIG.roleta;
    const premios = cfg.premios;
    if (!premios || !premios.length) return;

    const caixa = document.createElement('div');
    caixa.className = 'roleta';
    caixa.setAttribute('role', 'dialog');
    caixa.setAttribute('aria-modal', 'true');
    caixa.setAttribute('aria-label', 'Roleta de prêmios da Duo Jeans');

    caixa.innerHTML =
      '<div class="roleta-fundo" data-roleta-fechar></div>' +
      '<div class="roleta-caixa">' +
        '<button class="roleta-fechar" data-roleta-fechar aria-label="Fechar">' + ICONES.x + '</button>' +

        '<div class="roleta-disco-area">' +
          '<span class="roleta-seta" aria-hidden="true"></span>' +
          '<div class="roleta-disco" data-disco>' + Roleta.desenhar(premios) + '</div>' +
        '</div>' +

        '<div class="roleta-lado">' +
          '<div data-roleta-passo="convite">' +
            '<span class="marca"><span class="marca-duo">DUO</span><span class="marca-jeans">JEANS</span></span>' +
            '<p class="antetitulo mt-3">Só para você</p>' +
            '<h2 class="titulo t-lg">Gire e ganhe</h2>' +
            '<div class="filete"></div>' +
            '<p class="roleta-texto">Um desconto para estrear a sua primeira compra na Duo. ' +
              'Todas as fatias premiam — é só girar.</p>' +
            (cfg.pedirEmail
              ? '<div class="campo mt-3">' +
                  '<label for="roleta-email">Seu e-mail</label>' +
                  '<input class="entrada roleta-entrada" id="roleta-email" type="email" ' +
                    'placeholder="voce@email.com" autocomplete="email">' +
                  '<span class="erro-campo" data-roleta-erro></span>' +
                '</div>'
              : '') +
            '<button class="btn btn-principal btn-bloco btn-g mt-2" data-girar>Girar a roleta</button>' +
            '<button class="roleta-dispensar" data-roleta-fechar>Agora não, obrigada</button>' +
            (cfg.pedirEmail
              ? '<p class="roleta-aviso">Usamos seu e-mail só para enviar novidades da Duo. ' +
                'Você pode sair da lista quando quiser.</p>'
              : '') +
          '</div>' +

          '<div class="oculto" data-roleta-passo="resultado">' +
            '<span class="marca"><span class="marca-duo">DUO</span><span class="marca-jeans">JEANS</span></span>' +
            '<p class="antetitulo mt-3">Você ganhou</p>' +
            '<h2 class="titulo t-lg" data-premio-rotulo></h2>' +
            '<div class="filete"></div>' +
            '<p class="roleta-texto" data-premio-desc></p>' +
            '<div class="roleta-cupom">' +
              '<span data-premio-cupom></span>' +
              '<button data-copiar-cupom>Copiar</button>' +
            '</div>' +
            '<p class="roleta-validade" data-premio-validade></p>' +
            '<a href="produtos.html" class="btn btn-principal btn-bloco btn-g mt-3">Usar agora</a>' +
            '<button class="roleta-dispensar" data-roleta-fechar>Continuar navegando</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(caixa);
    document.body.classList.add('travado');
    requestAnimationFrame(() => caixa.classList.add('aberta'));

    Roleta.ligarEventos(caixa, premios);
  },

  /* ---------------------------------------------------------
     Eventos
     --------------------------------------------------------- */
  ligarEventos(caixa, premios) {
    const fechar = () => {
      if (Roleta.girando) return;              // não fecha no meio do giro
      caixa.classList.remove('aberta');
      document.body.classList.remove('travado');
      setTimeout(() => caixa.remove(), 320);
      /* Quem fechou sem girar também não vê de novo nesta visita */
      if (!Roleta.jaGirou()) U.salvar(Roleta.chave, { girou: false, quando: Date.now() });
    };

    caixa.addEventListener('click', (e) => {
      if (e.target.closest('[data-roleta-fechar]')) { fechar(); return; }
      if (e.target.closest('[data-girar]'))         { Roleta.girar(caixa, premios); return; }
      if (e.target.closest('[data-copiar-cupom]'))  { Roleta.copiar(e.target); return; }
    });

    caixa.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(); });

    const email = caixa.querySelector('#roleta-email');
    if (email) {
      email.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); Roleta.girar(caixa, premios); }
      });
      setTimeout(() => email.focus(), 420);
    }
  },

  /* ---------------------------------------------------------
     Gira
     --------------------------------------------------------- */
  girar(caixa, premios) {
    if (Roleta.girando) return;

    const cfg = CONFIG.roleta;
    const campo = caixa.querySelector('#roleta-email');

    if (cfg.pedirEmail) {
      const valor = (campo.value || '').trim();
      const erro = caixa.querySelector('[data-roleta-erro]');
      if (!U.validaEmail(valor)) {
        campo.closest('.campo').classList.add('tem-erro');
        erro.textContent = 'Informe um e-mail válido para girar.';
        campo.focus();
        return;
      }
      campo.closest('.campo').classList.remove('tem-erro');
      Roleta.guardarEmail(valor);
    }

    /* 1. Sorteia de verdade */
    const i = Roleta.sortear(premios);
    const premio = premios[i];
    Roleta.premioSorteado = premio;

    /* 2. Gira até parar na fatia sorteada */
    const fatia = 360 / premios.length;
    const centro = i * fatia + fatia / 2;
    const folga = (Math.random() - 0.5) * fatia * 0.6;   // não para sempre no meio exato
    const voltas = 7;
    const anguloFinal = voltas * 360 - centro + folga;

    const disco = caixa.querySelector('[data-disco]');
    const botao = caixa.querySelector('[data-girar]');
    Roleta.girando = true;
    botao.disabled = true;
    botao.textContent = 'Girando…';
    caixa.classList.add('rodando');

    requestAnimationFrame(() => {
      disco.style.transform = 'rotate(' + anguloFinal.toFixed(2) + 'deg)';
    });

    setTimeout(() => {
      Roleta.girando = false;
      caixa.classList.remove('rodando');
      Roleta.mostrarResultado(caixa, premio);
    }, 5150);
  },

  /* ---------------------------------------------------------
     Resultado
     --------------------------------------------------------- */
  mostrarResultado(caixa, premio) {
    const cupom = CONFIG.cupons[premio.cupom];
    const horas = CONFIG.roleta.validadeHoras || 24;
    const expira = Date.now() + horas * 3600 * 1000;

    U.salvar(Roleta.chave, {
      girou: true,
      quando: Date.now(),
      cupom: premio.cupom,
      rotulo: premio.rotulo,
      expira: expira
    });

    caixa.querySelector('[data-roleta-passo="convite"]').classList.add('oculto');
    const painel = caixa.querySelector('[data-roleta-passo="resultado"]');
    painel.classList.remove('oculto');

    caixa.querySelector('[data-premio-rotulo]').textContent = premio.rotulo;
    caixa.querySelector('[data-premio-desc]').textContent =
      cupom ? cupom.descricao + '. O cupom já entra sozinho no seu carrinho.' : '';
    caixa.querySelector('[data-premio-cupom]').textContent = premio.cupom;
    caixa.querySelector('[data-premio-validade]').textContent =
      'Válido por ' + horas + ' horas.';

    Aviso.mostrar('Prêmio garantido: ' + premio.rotulo);
  },

  copiar(botao) {
    const codigo = botao.parentElement.querySelector('span').textContent;
    const feito = () => {
      botao.textContent = 'Copiado';
      setTimeout(() => { botao.textContent = 'Copiar'; }, 2000);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(codigo).then(feito).catch(feito);
    } else { feito(); }
  },

  /* ---------------------------------------------------------
     E-mail capturado
     --------------------------------------------------------- */
  guardarEmail(email) {
    U.salvar('duo_email', email);
    const url = CONFIG.pedidos.endpointEmail;
    if (!url) return;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ _subject: 'Novo e-mail pela roleta — Duo Jeans', email: email })
    }).catch(() => { /* não atrapalha o giro se o envio falhar */ });
  },

  /* ---------------------------------------------------------
     Início
     --------------------------------------------------------- */
  iniciar() {
    const cfg = CONFIG.roleta;
    if (!cfg || !cfg.ativo) return;

    /* Nunca durante a compra */
    const pagina = document.body.dataset.pagina || '';
    if (['checkout', 'pedido', 'conferencia'].includes(pagina)) return;

    if (Roleta.jaGirou()) return;

    /* Respeita quem pediu menos animação */
    const espera = (cfg.segundosParaAbrir || 6) * 1000;
    setTimeout(() => {
      if (!document.querySelector('.roleta') && !document.body.classList.contains('travado')) {
        Roleta.abrir();
      }
    }, espera);
  }
};

document.addEventListener('DOMContentLoaded', () => setTimeout(Roleta.iniciar, 300));
