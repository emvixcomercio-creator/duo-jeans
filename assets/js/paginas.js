/* ============================================================
   DUO JEANS — COMPORTAMENTO DAS PÁGINAS
   Catálogo, página de produto e favoritos.
   ============================================================ */

/* ============================================================
   CATÁLOGO
   ============================================================ */
const PaginaCatalogo = {

  filtros: { categorias: [], modelagens: [], tamanhos: [], precoMax: null, ordem: 'novidade' },

  iniciar() {
    /* Categoria vinda do menu: produtos.html?c=calcas */
    const c = U.param('c');
    const busca = U.param('q');

    if (busca) PaginaCatalogo.filtros.busca = busca;

    if (c === 'novidades' || c === 'promocoes') {
      PaginaCatalogo.filtros.categoria = c;
    } else if (c) {
      PaginaCatalogo.filtros.categorias = [c];
    }

    PaginaCatalogo.montarFiltros();
    PaginaCatalogo.tituloPagina(c, busca);
    PaginaCatalogo.aplicar();
    PaginaCatalogo.ligarEventos();
  },

  tituloPagina(c, busca) {
    const titulos = {
      novidades: ['Novidades', 'As peças que acabaram de chegar na Duo.'],
      promocoes: ['Sale', 'Peças selecionadas com preço especial, enquanto durarem.'],
      calcas:    ['Calças', 'Wide leg, flare, mom, reta e skinny — a modelagem que veste o seu jeito.'],
      shorts:    ['Shorts', 'Cintura alta e caimento confortável para os dias quentes.'],
      saias:     ['Saias', 'Midi, curta e evasê, em lavagens que combinam com tudo.'],
      jaquetas:  ['Jaquetas', 'A peça que fecha o look — jaquetas e camisas de jeans.'],
      macaquinhos: ['Macaquinhos', 'Uma peça só que já resolve o look inteiro.']
    };
    const t = busca ? ['Busca', 'Resultados para “' + busca + '”.']
                    : (titulos[c] || ['Coleção', CONFIG.loja.conceito]);

    const elT = document.querySelector('[data-titulo-pagina]');
    const elS = document.querySelector('[data-sub-pagina]');
    const elM = document.querySelector('[data-migalha-atual]');
    if (elT) elT.textContent = t[0];
    if (elS) elS.textContent = t[1];
    if (elM) elM.textContent = t[0];
    document.title = t[0] + ' · Duo Jeans';
  },

  montarFiltros() {
    const alvo = document.querySelector('[data-filtros]');
    if (!alvo) return;

    const f = PaginaCatalogo.filtros;
    const contar = (fn) => PRODUTOS.filter(fn).length;

    const grupo = (titulo, conteudo) =>
      '<div class="filtro-grupo"><div class="filtro-titulo">' + titulo + '</div>' + conteudo + '</div>';

    const categorias = CATEGORIAS.filter(c => c.id !== 'novidades').map(c =>
      '<label class="filtro-opcao"><input type="checkbox" data-filtro="categorias" value="' + c.id + '"' +
      (f.categorias.includes(c.id) ? ' checked' : '') + '>' + c.nome +
      '<span class="qtd">' + contar(p => p.categoria === c.id) + '</span></label>').join('');

    const modelagens = Catalogo.modelagens().map(m =>
      '<label class="filtro-opcao"><input type="checkbox" data-filtro="modelagens" value="' + U.esc(m) + '"' +
      (f.modelagens.includes(m) ? ' checked' : '') + '>' + U.esc(m) +
      '<span class="qtd">' + contar(p => p.modelagem === m) + '</span></label>').join('');

    const tamanhos = Catalogo.tamanhos().map(t =>
      '<button class="chip-tam' + (f.tamanhos.includes(t) ? ' ativo' : '') +
      '" data-filtro-tam="' + U.esc(t) + '">' + U.esc(t) + '</button>').join('');

    const maiorPreco = Math.ceil(Math.max(...PRODUTOS.map(p => p.preco)) / 10) * 10;

    alvo.innerHTML =
      grupo('Categoria', '<div class="filtro-lista">' + categorias + '</div>') +
      grupo('Modelagem', '<div class="filtro-lista">' + modelagens + '</div>') +
      grupo('Tamanho',   '<div class="filtro-tamanhos">' + tamanhos + '</div>') +
      grupo('Preço até <span data-valor-preco>' + U.dinheiro(maiorPreco) + '</span>',
        '<input type="range" min="100" max="' + maiorPreco + '" step="10" value="' + maiorPreco +
        '" data-filtro-preco style="width:100%;accent-color:var(--marinho)">') +
      '<div class="filtro-grupo"><button class="btn btn-contorno btn-p btn-bloco" data-limpar-filtros>Limpar filtros</button></div>';
  },

  aplicar() {
    const f = PaginaCatalogo.filtros;
    const lista = Catalogo.listar(f);

    Catalogo.renderizar('[data-grade]', lista);

    const cont = document.querySelector('[data-contagem]');
    if (cont) cont.innerHTML = '<strong>' + lista.length + '</strong> ' +
      (lista.length === 1 ? 'peça encontrada' : 'peças encontradas');

    if (!lista.length) {
      document.querySelector('[data-grade]').innerHTML =
        '<div class="vazio" style="grid-column:1/-1">' + ICONES.busca +
        '<h3 class="titulo t-sm mb-2">Nenhuma peça com esses filtros</h3>' +
        '<p class="mb-3">Tente ajustar a modelagem ou o tamanho.</p>' +
        '<button class="btn btn-contorno btn-p" data-limpar-filtros>Limpar filtros</button></div>';
    }

    PaginaCatalogo.mostrarTags();
  },

  mostrarTags() {
    const alvo = document.querySelector('[data-tags]');
    if (!alvo) return;
    const f = PaginaCatalogo.filtros;
    const tags = [];

    f.categorias.forEach(c => tags.push(['categorias', c, Catalogo.nomeCategoria(c)]));
    f.modelagens.forEach(m => tags.push(['modelagens', m, m]));
    f.tamanhos.forEach(t => tags.push(['tamanhos', t, 'Tam ' + t]));

    alvo.innerHTML = tags.map(([tipo, valor, rotulo]) =>
      '<span class="tag-ativa">' + U.esc(rotulo) +
      '<button data-tirar-tag="' + tipo + '" data-valor="' + U.esc(valor) + '" aria-label="Remover filtro">×</button></span>'
    ).join('');
  },

  ligarEventos() {
    document.addEventListener('change', (e) => {
      const cb = e.target.closest('[data-filtro]');
      if (cb) {
        const tipo = cb.dataset.filtro;
        const lista = PaginaCatalogo.filtros[tipo];
        const i = lista.indexOf(cb.value);
        if (cb.checked && i === -1) lista.push(cb.value);
        if (!cb.checked && i > -1) lista.splice(i, 1);
        delete PaginaCatalogo.filtros.categoria;   // filtro manual substitui o do menu
        PaginaCatalogo.aplicar();
      }

      const ordem = e.target.closest('[data-ordem]');
      if (ordem) {
        PaginaCatalogo.filtros.ordem = ordem.value;
        PaginaCatalogo.aplicar();
      }
    });

    document.addEventListener('input', (e) => {
      const faixa = e.target.closest('[data-filtro-preco]');
      if (faixa) {
        PaginaCatalogo.filtros.precoMax = Number(faixa.value);
        document.querySelector('[data-valor-preco]').textContent = U.dinheiro(faixa.value);
        PaginaCatalogo.aplicar();
      }
    });

    document.addEventListener('click', (e) => {
      const tam = e.target.closest('[data-filtro-tam]');
      if (tam) {
        const v = tam.dataset.filtroTam;
        const lista = PaginaCatalogo.filtros.tamanhos;
        const i = lista.indexOf(v);
        if (i > -1) lista.splice(i, 1); else lista.push(v);
        tam.classList.toggle('ativo');
        PaginaCatalogo.aplicar();
        return;
      }

      const tirar = e.target.closest('[data-tirarTag], [data-tirar-tag]');
      if (tirar) {
        const tipo = tirar.dataset.tirarTag;
        const lista = PaginaCatalogo.filtros[tipo];
        const i = lista.indexOf(tirar.dataset.valor);
        if (i > -1) lista.splice(i, 1);
        PaginaCatalogo.montarFiltros();
        PaginaCatalogo.aplicar();
        return;
      }

      if (e.target.closest('[data-limpar-filtros]')) {
        PaginaCatalogo.filtros = { categorias: [], modelagens: [], tamanhos: [], precoMax: null, ordem: 'novidade' };
        PaginaCatalogo.montarFiltros();
        PaginaCatalogo.aplicar();
        return;
      }

      if (e.target.closest('[data-abrir-filtros]')) {
        document.querySelector('.filtros').classList.add('aberto');
        Painel.cortina(true);
      }
    });
  }
};

/* ============================================================
   PÁGINA DE PRODUTO
   ============================================================ */
const PaginaProduto = {

  produto: null,
  tamanho: null,
  qtd: 1,

  iniciar() {
    const id = U.param('id');
    PaginaProduto.produto = id ? Catalogo.achar(id) : null;

    if (!PaginaProduto.produto) {
      document.querySelector('[data-produto]').innerHTML =
        '<div class="vazio">' + ICONES.info +
        '<h2 class="titulo t-md mb-3">Peça não encontrada</h2>' +
        '<p class="mb-3">Talvez ela tenha esgotado ou saído da coleção.</p>' +
        '<a href="produtos.html" class="btn btn-principal">Ver a coleção</a></div>';
      return;
    }

    PaginaProduto.montar();
    PaginaProduto.ligarEventos();
  },

  montar() {
    const p = PaginaProduto.produto;
    document.title = p.nome + ' · Duo Jeans';

    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', p.descricao.slice(0, 155));

    /* Migalhas */
    const mig = document.querySelector('[data-migalhas]');
    if (mig) mig.innerHTML =
      '<a href="index.html">Início</a><span>/</span>' +
      '<a href="produtos.html?c=' + U.esc(p.categoria) + '">' + Catalogo.nomeCategoria(p.categoria) + '</a>' +
      '<span>/</span><span aria-current="page">' + U.esc(p.nome) + '</span>';

    /* Galeria */
    const imgs = (p.imagens && p.imagens.length ? p.imagens : [U.placeholder]);
    document.querySelector('[data-galeria]').innerHTML =
      '<div class="galeria-miniaturas">' +
        imgs.map((src, i) =>
          '<button class="miniatura' + (i === 0 ? ' ativa' : '') + '" data-troca-foto="' + U.esc(src) + '">' +
          '<img src="' + U.esc(src) + '" alt="" onerror="' + U.imgFallback + '"></button>').join('') +
      '</div>' +
      '<div class="galeria-principal">' +
        '<img src="' + U.esc(imgs[0]) + '" alt="' + U.esc(p.nome) + '" data-foto-grande onerror="' + U.imgFallback + '">' +
      '</div>';

    /* Informações */
    const parc = U.parcelas(p.preco);
    const esgotados = (p.esgotados || []).map(String);
    const desconto = p.precoDe ? Math.round((1 - p.preco / p.precoDe) * 100) : 0;

    document.querySelector('[data-info]').innerHTML =
      '<p class="antetitulo" style="margin-bottom:.4rem">' + U.esc(p.modelagem) + ' · ' + U.esc(p.lavagem) + '</p>' +
      '<h1 class="produto-titulo">' + U.esc(p.nome) + '</h1>' +

      '<div class="produto-precos">' +
        '<span class="produto-preco">' + U.dinheiro(p.preco) + '</span>' +
        (p.precoDe ? '<span class="produto-preco-de">' + U.dinheiro(p.precoDe) + '</span>' : '') +
        (desconto ? '<span class="economia">' + desconto + '% OFF</span>' : '') +
      '</div>' +
      '<div class="produto-pagamento">' +
        'Em até <strong>' + parc.n + 'x de ' + U.dinheiro(parc.valor) + '</strong> sem juros<br>' +
        '<span class="destaque-pix">' + U.dinheiro(U.precoPix(p.preco)) + ' à vista no Pix</span>' +
      '</div>' +

      '<div class="bloco-opcao">' +
        '<div class="bloco-opcao-topo">' +
          '<span class="rotulo" style="margin:0">Tamanho</span>' +
          '<button class="link-linha" style="font-size:.64rem" data-guia-medidas>Guia de medidas</button>' +
        '</div>' +
        '<div class="tamanhos-lista">' +
          p.tamanhos.map(t => {
            const esg = esgotados.includes(String(t));
            return '<button class="tam-btn' + (esg ? ' esgotado' : '') + '" data-tamanho="' + U.esc(t) + '"' +
                   (esg ? ' disabled title="Esgotado"' : '') + '>' + U.esc(t) + '</button>';
          }).join('') +
        '</div>' +
        '<p class="erro-campo" data-erro-tamanho style="display:none">Escolha um tamanho para continuar.</p>' +
      '</div>' +

      '<div class="bloco-opcao">' +
        '<span class="rotulo">Quantidade</span>' +
        '<div class="qtd-controle">' +
          '<button data-qtd-menos aria-label="Diminuir">−</button>' +
          '<span data-qtd-valor>1</span>' +
          '<button data-qtd-mais aria-label="Aumentar">+</button>' +
        '</div>' +
      '</div>' +

      '<div class="produto-acoes">' +
        '<button class="btn btn-principal btn-g btn-bloco" data-comprar>Adicionar à sacola</button>' +
        '<button class="btn btn-contorno btn-bloco" data-favorito="' + U.esc(p.id) + '">' +
          (Favoritos.tem(p.id) ? 'Salvo nos favoritos' : 'Salvar nos favoritos') + '</button>' +
      '</div>' +

      '<div class="confianca-produto">' +
        PaginaProduto.confianca(ICONES.cadeado, 'Compra 100% segura',
          'Pagamento processado em ambiente certificado. Seus dados de cartão não passam pela loja.') +
        PaginaProduto.confianca(ICONES.troca, 'Primeira troca por nossa conta',
          'Você tem 7 dias corridos após receber para trocar o tamanho.') +
        PaginaProduto.confianca(ICONES.caminhao, 'Enviamos para todo o Brasil',
          'Frete grátis acima de ' + U.dinheiro(CONFIG.frete.gratisAcima) + '. ' + CONFIG.frete.prazoTexto + '.') +
      '</div>' +

      '<div class="calculo-frete">' +
        '<span class="rotulo">Calcular frete e prazo</span>' +
        '<div class="frete-form">' +
          '<input type="text" class="entrada" placeholder="00000-000" data-mascara="cep" data-cep-produto inputmode="numeric">' +
          '<button class="btn btn-contorno btn-p" data-calcular-frete>Calcular</button>' +
        '</div>' +
        '<div class="frete-resultado oculto" data-frete-resultado></div>' +
      '</div>' +

      '<div class="acordeao">' +
        PaginaProduto.acordeao('Descrição', U.esc(p.descricao)) +
        PaginaProduto.acordeao('Detalhes e composição',
          '<ul style="margin:0 0 .8rem 1.1rem;list-style:disc">' +
          (p.detalhes || []).map(d => '<li>' + U.esc(d) + '</li>').join('') + '</ul>' +
          '<strong>Composição:</strong> ' + U.esc(p.composicao) + '<br>' +
          '<strong>Cuidados:</strong> ' + U.esc(p.cuidados)) +
        PaginaProduto.acordeao('Entrega e trocas',
          CONFIG.frete.prazoTexto.charAt(0).toUpperCase() + CONFIG.frete.prazoTexto.slice(1) + '. ' +
          U.esc(CONFIG.trocas)) +
      '</div>';

    /* Você também pode gostar */
    const relacionados = PRODUTOS
      .filter(x => x.id !== p.id && (x.categoria === p.categoria || x.modelagem === p.modelagem))
      .slice(0, 4);
    if (relacionados.length) {
      Catalogo.renderizar('[data-relacionados]', relacionados);
    } else {
      document.querySelector('[data-secao-relacionados]')?.classList.add('oculto');
    }
  },

  confianca(icone, titulo, texto) {
    return '<div class="confianca-item">' + icone +
      '<div><strong>' + titulo + '</strong><br>' + texto + '</div></div>';
  },

  acordeao(titulo, corpo) {
    return '<div class="acordeao-item">' +
      '<button class="acordeao-btn" aria-expanded="false">' + U.esc(titulo) + '<span class="mais"></span></button>' +
      '<div class="acordeao-corpo"><div><p>' + corpo + '</p></div></div></div>';
  },

  ligarEventos() {
    document.addEventListener('click', async (e) => {

      const mini = e.target.closest('[data-troca-foto]');
      if (mini) {
        document.querySelector('[data-foto-grande]').src = mini.dataset.trocaFoto;
        document.querySelectorAll('.miniatura').forEach(m => m.classList.remove('ativa'));
        mini.classList.add('ativa');
        return;
      }

      const tam = e.target.closest('[data-tamanho]');
      if (tam && !tam.disabled) {
        PaginaProduto.tamanho = tam.dataset.tamanho;
        document.querySelectorAll('[data-tamanho]').forEach(t => t.classList.remove('ativo'));
        tam.classList.add('ativo');
        document.querySelector('[data-erro-tamanho]').style.display = 'none';
        return;
      }

      if (e.target.closest('[data-qtd-mais]')) {
        PaginaProduto.qtd = Math.min(10, PaginaProduto.qtd + 1);
        document.querySelector('[data-qtd-valor]').textContent = PaginaProduto.qtd;
        return;
      }
      if (e.target.closest('[data-qtd-menos]')) {
        PaginaProduto.qtd = Math.max(1, PaginaProduto.qtd - 1);
        document.querySelector('[data-qtd-valor]').textContent = PaginaProduto.qtd;
        return;
      }

      if (e.target.closest('[data-comprar]')) {
        if (!PaginaProduto.tamanho) {
          document.querySelector('[data-erro-tamanho]').style.display = 'block';
          document.querySelector('.tamanhos-lista').scrollIntoView({ block: 'center', behavior: 'smooth' });
          return;
        }
        Sacola.adicionar(PaginaProduto.produto.id, PaginaProduto.tamanho, PaginaProduto.qtd);
        return;
      }

      if (e.target.closest('[data-calcular-frete]')) {
        const campo = document.querySelector('[data-cep-produto]');
        const alvo = document.querySelector('[data-frete-resultado]');
        const f = Frete.calcular(campo.value);
        alvo.classList.remove('oculto', 'erro');
        if (!f) {
          alvo.classList.add('erro');
          alvo.textContent = 'CEP inválido ou fora da nossa área de entrega.';
          return;
        }
        const gratis = PaginaProduto.produto.preco >= CONFIG.frete.gratisAcima;
        alvo.innerHTML = '<strong>' + U.esc(f.regiao) + '</strong> · ' +
          (gratis ? 'Frete grátis' : U.dinheiro(f.valor)) + ' · ' + U.esc(f.prazo) +
          (gratis ? '' : '<br><span style="font-size:.74rem">Frete grátis em pedidos acima de ' +
            U.dinheiro(CONFIG.frete.gratisAcima) + '.</span>');
      }
    });
  }
};

/* ============================================================
   FAVORITOS
   ============================================================ */
const PaginaFavoritos = {
  iniciar() {
    const ids = Favoritos.lista();
    const lista = PRODUTOS.filter(p => ids.includes(p.id));
    const alvo = document.querySelector('[data-grade]');
    if (!alvo) return;

    if (!lista.length) {
      alvo.innerHTML =
        '<div class="vazio" style="grid-column:1/-1">' + ICONES.coracao +
        '<h3 class="titulo t-sm mb-2">Você ainda não salvou nenhuma peça</h3>' +
        '<p class="mb-3">Toque no coração das peças que quiser guardar para depois.</p>' +
        '<a href="produtos.html" class="btn btn-principal btn-p">Ver a coleção</a></div>';
      return;
    }
    Catalogo.renderizar('[data-grade]', lista);
    const c = document.querySelector('[data-contagem]');
    if (c) c.innerHTML = '<strong>' + lista.length + '</strong> ' +
      (lista.length === 1 ? 'peça salva' : 'peças salvas');
  }
};

/* ============================================================
   HOME
   ============================================================ */
const PaginaInicial = {
  iniciar() {
    const destaques = PRODUTOS.filter(p => p.destaque).slice(0, 8);
    Catalogo.renderizar('[data-destaques]', destaques.slice(0, 4));

    const novidades = PRODUTOS.filter(p => p.novidade).slice(0, 4);
    Catalogo.renderizar('[data-novidades]', novidades.length ? novidades : destaques.slice(4, 8));

    /* Faixa de categorias */
    const cats = document.querySelector('[data-categorias]');
    if (cats) cats.innerHTML = CATEGORIAS.map(c =>
      '<a class="cat-item revela" href="produtos.html?c=' + c.id + '">' +
      ICONES[c.icone] + '<span>' + c.nome + '</span></a>').join('');

    Animacao.observar(document);
  }
};
