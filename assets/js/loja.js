/* ============================================================
   DUO JEANS — NÚCLEO DA LOJA
   Cabeçalho, rodapé, sacola, catálogo e utilidades.
   Você normalmente NÃO precisa editar este arquivo.
   ============================================================ */

/* ============================================================
   ÍCONES (SVG embutido — nada é carregado de fora)
   ============================================================ */
const ICONES = {
  calca:   '<svg viewBox="0 0 40 56" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M7 3h26l1 12-2 38h-9l-2-27-2 27H10L8 15z"/><path d="M7 9h26M20 15v11"/></svg>',
  short:   '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M7 3h26l1 10-1 24h-9l-4-16-4 16H7L6 13z"/><path d="M6 9h28"/></svg>',
  saia:    '<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M11 3h22l2 8-3 30H12L9 11z"/><path d="M9 9h26M17 13l-2 26M27 13l2 26"/></svg>',
  jaqueta: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M18 4l6 5 6-5 9 5 3 13-5 2v20H15V24l-5-2 3-13z"/><path d="M24 9v35M18 4l6 5M30 4l-6 5"/><circle cx="20" cy="30" r="1.1"/><circle cx="20" cy="36" r="1.1"/></svg>',
  macacao: '<svg viewBox="0 0 44 52" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M14 4l-2 8v10h20V12l-2-8"/><path d="M12 22h20l2 12-3 14h-8l-1-11-1 11h-8l-3-14z"/><path d="M14 4v6M30 4v6"/><circle cx="17" cy="27" r="1"/><circle cx="27" cy="27" r="1"/></svg>',
  estrela: '<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M22 4l5.6 11.8 12.4 1.8-9 9 2.2 12.9L22 33.4 10.8 39.5 13 26.6l-9-9 12.4-1.8z"/></svg>',

  sacola:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h12l1.5 5.5V21a1 1 0 01-1 1H5.5a1 1 0 01-1-1V7.5z"/><path d="M4.5 7.5h15M9 11a3 3 0 006 0"/></svg>',
  busca:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
  coracao: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0112 6.6a4.7 4.7 0 018.5 2.6c0 5.8-8.5 11.3-8.5 11.3z"/></svg>',
  usuario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',
  menu:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  x:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  esq:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  dir:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',

  cadeado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/><circle cx="12" cy="15.5" r="1.4"/></svg>',
  escudo:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5l8 3v6c0 5-3.4 8.9-8 10-4.6-1.1-8-5-8-10v-6z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/></svg>',
  caminhao:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h11v10H2zM13 9h4.5l3.5 3.5V16h-8z"/><circle cx="6" cy="18.5" r="1.8"/><circle cx="17" cy="18.5" r="1.8"/></svg>',
  troca:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9a8 8 0 0113.6-4.6L21 8"/><path d="M21 4v4.5h-4.5"/><path d="M21 15a8 8 0 01-13.6 4.6L3 16"/><path d="M3 20v-4.5h4.5"/></svg>',
  cartao:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/></svg>',
  check:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.6v.6"/></svg>',
  copiar:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/></svg>',
  presente:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="1.5"/><path d="M3 12.5h18M12 8v13"/><path d="M12 8S10.5 3.5 8 4.2 8.5 8 12 8zM12 8s1.5-4.5 4-3.8S15.5 8 12 8z"/></svg>',

  instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>',
  whatsapp:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9.9 9.9 0 00-8.5 15L2 22l5.2-1.4A9.9 9.9 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1112 20zm4.5-5.9c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.5 6.5 0 01-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5a1 1 0 00-.7.3A3 3 0 006 12.3a5.2 5.2 0 001.1 2.6 11.9 11.9 0 004.5 4 5 5 0 002.3.4 2.7 2.7 0 001.8-1.3 2.2 2.2 0 00.2-1.3c-.1-.1-.2-.2-.4-.3z"/></svg>',
  email:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M3 6.5l9 6.5 9-6.5"/></svg>',
  filtro:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 6h18M6 12h12M10 18h4"/></svg>',
  sacolaVazia:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M6 2h12l1.5 5.5V21a1 1 0 01-1 1H5.5a1 1 0 01-1-1V7.5z"/><path d="M4.5 7.5h15M9 11a3 3 0 006 0"/></svg>'
};

/* ============================================================
   UTILIDADES
   ============================================================ */
const U = {
  /* Formata como moeda brasileira: 289.9 -> "R$ 289,90" */
  dinheiro(v) {
    return (Number(v) || 0).toLocaleString('pt-BR', {
      style: 'currency', currency: 'BRL'
    });
  },

  /* Escapa HTML. Tudo que vem de dado passa por aqui antes de
     virar HTML — é o que impede injeção de script na página. */
  esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  /* Parâmetro da URL */
  param(nome) {
    return new URLSearchParams(location.search).get(nome);
  },

  /* localStorage à prova de navegador com armazenamento bloqueado */
  ler(chave, padrao) {
    try {
      const v = localStorage.getItem(chave);
      return v ? JSON.parse(v) : padrao;
    } catch (e) { return padrao; }
  },
  salvar(chave, valor) {
    try { localStorage.setItem(chave, JSON.stringify(valor)); }
    catch (e) { /* modo anônimo ou storage cheio — segue sem persistir */ }
  },

  /* Imagem de reserva enquanto não há foto do produto */
  placeholder: 'assets/img/placeholder.svg',
  imgFallback: 'this.onerror=null;this.src=\'assets/img/placeholder.svg\'',

  /* Parcelamento exibido */
  parcelas(valor) {
    const cfg = CONFIG.pagamento.mercadopago;
    let n = cfg.parcelas;
    while (n > 1 && valor / n < cfg.parcelaMinima) n--;
    return { n, valor: valor / n };
  },

  precoPix(valor) {
    return valor * (1 - (CONFIG.pagamento.pix.desconto || 0));
  },

  soDigitos(t) { return String(t || '').replace(/\D/g, ''); },

  /* Validações de formulário */
  validaEmail(v) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(String(v).trim()); },
  validaCEP(v)   { return U.soDigitos(v).length === 8; },
  validaTel(v)   { const d = U.soDigitos(v); return d.length === 10 || d.length === 11; },
  validaCPF(v) {
    const c = U.soDigitos(v);
    if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
    let s = 0;
    for (let i = 0; i < 9; i++) s += +c[i] * (10 - i);
    let d1 = (s * 10) % 11; if (d1 === 10) d1 = 0;
    if (d1 !== +c[9]) return false;
    s = 0;
    for (let i = 0; i < 10; i++) s += +c[i] * (11 - i);
    let d2 = (s * 10) % 11; if (d2 === 10) d2 = 0;
    return d2 === +c[10];
  },

  /* Máscaras */
  mascaraTel(v) {
    const d = U.soDigitos(v).slice(0, 11);
    if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/[-\s()]+$/, '');
    return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/[-\s()]+$/, '');
  },
  mascaraCEP(v) {
    const d = U.soDigitos(v).slice(0, 8);
    return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d;
  },
  mascaraCPF(v) {
    const d = U.soDigitos(v).slice(0, 11);
    return d.replace(/(\d{3})(\d{0,3})(\d{0,3})(\d{0,2})/, (m, a, b, c, e) =>
      a + (b ? '.' + b : '') + (c ? '.' + c : '') + (e ? '-' + e : ''));
  },

  aplicarMascaras(escopo) {
    (escopo || document).querySelectorAll('[data-mascara]').forEach(el => {
      if (el._mascarado) return;
      el._mascarado = true;
      const tipo = el.dataset.mascara;
      el.addEventListener('input', () => {
        const f = { tel: U.mascaraTel, cep: U.mascaraCEP, cpf: U.mascaraCPF }[tipo];
        if (f) el.value = f(el.value);
      });
    });
  }
};

/* ============================================================
   AVISOS FLUTUANTES
   ============================================================ */
const Aviso = {
  mostrar(texto, tipo) {
    let caixa = document.querySelector('.avisos');
    if (!caixa) {
      caixa = document.createElement('div');
      caixa.className = 'avisos';
      document.body.appendChild(caixa);
    }
    const t = document.createElement('div');
    t.className = 'toast ' + (tipo || 'sucesso');
    t.innerHTML = (tipo === 'erro' ? ICONES.info : ICONES.check) +
                  '<span>' + U.esc(texto) + '</span>';
    caixa.appendChild(t);
    setTimeout(() => {
      t.classList.add('saindo');
      setTimeout(() => t.remove(), 320);
    }, 3200);
  },
  erro(t) { Aviso.mostrar(t, 'erro'); }
};

/* ============================================================
   PRODUTOS
   ============================================================ */
const Catalogo = {
  achar(id) { return PRODUTOS.find(p => p.id === id); },

  nomeCategoria(id) {
    const c = CATEGORIAS.find(c => c.id === id);
    return c ? c.nome : id;
  },

  listar(filtros) {
    const f = filtros || {};
    let lista = PRODUTOS.slice();

    if (f.categoria === 'novidades')      lista = lista.filter(p => p.novidade);
    else if (f.categoria === 'promocoes') lista = lista.filter(p => p.precoDe);
    else if (f.categoria)                 lista = lista.filter(p => p.categoria === f.categoria);

    if (f.categorias && f.categorias.length)
      lista = lista.filter(p => f.categorias.includes(p.categoria));

    if (f.modelagens && f.modelagens.length)
      lista = lista.filter(p => f.modelagens.includes(p.modelagem));

    if (f.tamanhos && f.tamanhos.length)
      lista = lista.filter(p => p.tamanhos.some(t =>
        f.tamanhos.includes(String(t)) && !(p.esgotados || []).map(String).includes(String(t))));

    if (f.precoMax) lista = lista.filter(p => p.preco <= f.precoMax);

    if (f.busca) {
      const b = f.busca.toLowerCase().trim();
      lista = lista.filter(p =>
        (p.nome + ' ' + p.modelagem + ' ' + p.lavagem + ' ' + Catalogo.nomeCategoria(p.categoria))
          .toLowerCase().includes(b));
    }

    switch (f.ordem) {
      case 'menor':    lista.sort((a, b) => a.preco - b.preco); break;
      case 'maior':    lista.sort((a, b) => b.preco - a.preco); break;
      case 'nome':     lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')); break;
      case 'novidade': lista.sort((a, b) => (b.novidade ? 1 : 0) - (a.novidade ? 1 : 0)); break;
      default: break;
    }
    return lista;
  },

  modelagens() {
    return [...new Set(PRODUTOS.map(p => p.modelagem))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  },
  tamanhos() {
    const s = new Set();
    PRODUTOS.forEach(p => p.tamanhos.forEach(t => s.add(String(t))));
    return [...s].sort((a, b) => (isNaN(a) || isNaN(b)) ? a.localeCompare(b) : a - b);
  },

  /* HTML de um card de produto */
  card(p) {
    const img1 = U.esc(p.imagens && p.imagens[0] ? p.imagens[0] : U.placeholder);
    const img2 = U.esc(p.imagens && p.imagens[1] ? p.imagens[1] : (p.imagens && p.imagens[0]) || U.placeholder);
    const parc = U.parcelas(p.preco);
    const esgotados = (p.esgotados || []).map(String);
    const desconto = p.precoDe ? Math.round((1 - p.preco / p.precoDe) * 100) : 0;

    return '' +
    '<article class="card revela">' +
      '<div class="card-midia">' +
      '<a class="card-foto" href="produto.html?id=' + U.esc(p.id) + '" aria-label="' + U.esc(p.nome) + '">' +
        (p.badge ? '<span class="selo ' + (p.novidade ? 'dourado' : '') + '">' + U.esc(p.badge) + '</span>' : '') +
        (desconto ? '<span class="selo desconto">-' + desconto + '%</span>' : '') +
        '<img class="foto-1" src="' + img1 + '" alt="' + U.esc(p.nome) + '" loading="lazy" onerror="' + U.imgFallback + '">' +
        '<img class="foto-2" src="' + img2 + '" alt="" loading="lazy" aria-hidden="true" onerror="' + U.imgFallback + '">' +
      '</a>' +
      '<button class="btn-favorito' + (Favoritos.tem(p.id) ? ' ativo' : '') + '" data-favorito="' + U.esc(p.id) + '" aria-label="Favoritar">' + ICONES.coracao + '</button>' +
      '<div class="card-tamanhos">' +
        p.tamanhos.map(t => {
          const esg = esgotados.includes(String(t));
          return '<button class="card-tam' + (esg ? ' esgotado' : '') + '"' +
                 (esg ? ' disabled aria-label="Tamanho ' + U.esc(t) + ' esgotado"'
                      : ' data-add="' + U.esc(p.id) + '" data-tam="' + U.esc(t) + '"') +
                 '>' + U.esc(t) + '</button>';
        }).join('') +
      '</div>' +
      '</div>' +
      '<div class="card-info">' +
        '<div class="card-cat">' + U.esc(p.modelagem) + ' · ' + U.esc(p.lavagem) + '</div>' +
        '<h3 class="card-nome"><a href="produto.html?id=' + U.esc(p.id) + '">' + U.esc(p.nome) + '</a></h3>' +
        '<div class="card-precos">' +
          '<span class="preco">' + U.dinheiro(p.preco) + '</span>' +
          (p.precoDe ? '<span class="preco-de">' + U.dinheiro(p.precoDe) + '</span>' : '') +
        '</div>' +
        '<div class="card-parcela">' + parc.n + 'x de ' + U.dinheiro(parc.valor) + ' sem juros</div>' +
        (CONFIG.pagamento.pix.desconto
          ? '<div class="card-pix">' + U.dinheiro(U.precoPix(p.preco)) + ' no Pix</div>' : '') +
      '</div>' +
    '</article>';
  },

  /* Preenche um container com uma lista de produtos */
  renderizar(seletor, lista) {
    const el = document.querySelector(seletor);
    if (!el) return;
    el.innerHTML = lista.map(Catalogo.card).join('');
    Animacao.observar(el);
  }
};

/* ============================================================
   FAVORITOS
   ============================================================ */
const Favoritos = {
  chave: 'duo_favoritos',
  lista() { return U.ler(Favoritos.chave, []); },
  tem(id) { return Favoritos.lista().includes(id); },
  alternar(id) {
    const l = Favoritos.lista();
    const i = l.indexOf(id);
    if (i > -1) { l.splice(i, 1); Aviso.mostrar('Removido dos favoritos'); }
    else        { l.push(id);     Aviso.mostrar('Adicionado aos favoritos'); }
    U.salvar(Favoritos.chave, l);
    document.querySelectorAll('[data-favorito="' + id + '"]')
      .forEach(b => b.classList.toggle('ativo', Favoritos.tem(id)));
    Favoritos.atualizarContador();
  },
  atualizarContador() {
    const c = document.querySelector('[data-contador-favoritos]');
    if (!c) return;
    const n = Favoritos.lista().length;
    c.textContent = n;
    c.classList.toggle('ativo', n > 0);
  }
};

/* ============================================================
   SACOLA (carrinho)
   ============================================================ */
const Sacola = {
  chave: 'duo_sacola',

  itens() { return U.ler(Sacola.chave, []); },

  gravar(itens) {
    U.salvar(Sacola.chave, itens);
    Sacola.atualizar();
  },

  adicionar(id, tamanho, qtd) {
    const p = Catalogo.achar(id);
    if (!p) return;
    if (!tamanho) { Aviso.erro('Escolha um tamanho'); return; }
    if ((p.esgotados || []).map(String).includes(String(tamanho))) {
      Aviso.erro('Tamanho esgotado'); return;
    }
    const itens = Sacola.itens();
    const chave = id + '|' + tamanho;
    const ja = itens.find(i => i.chave === chave);
    if (ja) ja.qtd += (qtd || 1);
    else itens.push({ chave, id, tamanho: String(tamanho), qtd: qtd || 1 });
    Sacola.gravar(itens);
    Aviso.mostrar(p.nome + ' · tam ' + tamanho + ' na sacola');
    Sacola.abrir();
  },

  mudarQtd(chave, delta) {
    const itens = Sacola.itens();
    const it = itens.find(i => i.chave === chave);
    if (!it) return;
    it.qtd += delta;
    if (it.qtd < 1) return Sacola.remover(chave);
    Sacola.gravar(itens);
  },

  remover(chave) {
    Sacola.gravar(Sacola.itens().filter(i => i.chave !== chave));
  },

  limpar() { Sacola.gravar([]); },

  /* Junta o item guardado com os dados do produto */
  detalhado() {
    return Sacola.itens().map(i => {
      const p = Catalogo.achar(i.id);
      if (!p) return null;
      return {
        chave: i.chave, id: i.id, tamanho: i.tamanho, qtd: i.qtd,
        nome: p.nome, preco: p.preco, modelagem: p.modelagem,
        imagem: (p.imagens && p.imagens[0]) || U.placeholder,
        subtotal: p.preco * i.qtd
      };
    }).filter(Boolean);
  },

  totais(opcoes) {
    const o = opcoes || {};
    const itens = Sacola.detalhado();
    const subtotal = itens.reduce((s, i) => s + i.subtotal, 0);
    const qtd = itens.reduce((s, i) => s + i.qtd, 0);

    let desconto = 0, freteGratisCupom = false, brinde = null;
    if (o.cupom) {
      const c = CONFIG.cupons[o.cupom];
      if (c && c.tipo === 'percentual') desconto = subtotal * c.valor;
      if (c && c.tipo === 'frete') freteGratisCupom = true;
      /* Brinde não abate valor: entra como item de cortesia no pedido */
      if (c && c.tipo === 'brinde') brinde = c.descricao;
    }

    const baseFrete = subtotal - desconto;
    let frete = o.frete == null ? 0 : o.frete;
    const gratisPorValor = CONFIG.frete.gratisAcima > 0 && baseFrete >= CONFIG.frete.gratisAcima;
    if (gratisPorValor || freteGratisCupom || o.retirada) frete = 0;

    const total = Math.max(0, baseFrete + frete);
    const descPix = CONFIG.pagamento.pix.desconto || 0;

    return {
      itens, qtd, subtotal, desconto, frete, total, brinde,
      freteGratis: gratisPorValor || freteGratisCupom,
      totalPix: total * (1 - descPix),
      economiaPix: total * descPix,
      faltaFreteGratis: Math.max(0, CONFIG.frete.gratisAcima - baseFrete)
    };
  },

  /* --- Interface --- */
  atualizar() {
    const t = Sacola.totais();

    document.querySelectorAll('[data-contador-sacola]').forEach(c => {
      c.textContent = t.qtd;
      c.classList.toggle('ativo', t.qtd > 0);
    });

    const lista = document.querySelector('[data-sacola-itens]');
    if (lista) {
      if (!t.itens.length) {
        lista.innerHTML =
          '<div class="vazio">' + ICONES.sacolaVazia +
          '<p class="mb-3">Sua sacola está vazia.</p>' +
          '<a href="produtos.html" class="btn btn-principal btn-p">Ver a coleção</a></div>';
      } else {
        lista.innerHTML = t.itens.map(i =>
          '<div class="item-sacola">' +
            '<img src="' + U.esc(i.imagem) + '" alt="" onerror="' + U.imgFallback + '">' +
            '<div>' +
              '<div class="item-nome">' + U.esc(i.nome) + '</div>' +
              '<div class="item-meta">Tamanho ' + U.esc(i.tamanho) + ' · ' + U.esc(i.modelagem) + '</div>' +
              '<div class="item-linha-final">' +
                '<div class="item-qtd">' +
                  '<button data-qtd="' + U.esc(i.chave) + '" data-delta="-1" aria-label="Diminuir">−</button>' +
                  '<span>' + i.qtd + '</span>' +
                  '<button data-qtd="' + U.esc(i.chave) + '" data-delta="1" aria-label="Aumentar">+</button>' +
                '</div>' +
                '<div class="item-preco">' + U.dinheiro(i.subtotal) + '</div>' +
              '</div>' +
              '<button class="item-remover" data-remover="' + U.esc(i.chave) + '">Remover</button>' +
            '</div>' +
          '</div>').join('');
      }
    }

    const rodape = document.querySelector('[data-sacola-rodape]');
    if (rodape) rodape.classList.toggle('oculto', !t.itens.length);

    const sub = document.querySelector('[data-sacola-subtotal]');
    if (sub) sub.textContent = U.dinheiro(t.subtotal);

    const barra = document.querySelector('[data-barra-frete]');
    if (barra) {
      if (t.faltaFreteGratis > 0 && t.itens.length) {
        barra.classList.remove('oculto');
        barra.querySelector('p').innerHTML =
          'Faltam <strong>' + U.dinheiro(t.faltaFreteGratis) + '</strong> para o frete grátis';
        barra.querySelector('.barra-preenchida').style.width =
          Math.min(100, (t.subtotal / CONFIG.frete.gratisAcima) * 100) + '%';
      } else if (t.itens.length) {
        barra.classList.remove('oculto');
        barra.querySelector('p').innerHTML = '<strong>Você ganhou frete grátis.</strong>';
        barra.querySelector('.barra-preenchida').style.width = '100%';
      } else {
        barra.classList.add('oculto');
      }
    }

    document.dispatchEvent(new CustomEvent('sacola:mudou', { detail: t }));
  },

  abrir() {
    const s = document.querySelector('.sacola');
    if (!s) return;
    s.classList.add('aberta');
    Painel.cortina(true);
    document.body.classList.add('travado');
  },
  fechar() {
    const s = document.querySelector('.sacola');
    if (s) s.classList.remove('aberta');
    Painel.cortina(false);
    document.body.classList.remove('travado');
  }
};

/* ============================================================
   PAINÉIS (cortina, menu, busca)
   ============================================================ */
const Painel = {
  cortina(mostrar) {
    let c = document.querySelector('.cortina');
    if (!c) {
      c = document.createElement('div');
      c.className = 'cortina';
      c.addEventListener('click', Painel.fecharTudo);
      document.body.appendChild(c);
    }
    requestAnimationFrame(() => c.classList.toggle('ativa', !!mostrar));
  },

  fecharTudo() {
    document.querySelector('.sacola')?.classList.remove('aberta');
    document.querySelector('.menu-movel')?.classList.remove('aberto');
    document.querySelector('.painel-busca')?.classList.remove('aberto');
    document.querySelector('.filtros')?.classList.remove('aberto');
    Painel.cortina(false);
    document.body.classList.remove('travado');
  },

  menu() {
    document.querySelector('.menu-movel')?.classList.add('aberto');
    Painel.cortina(true);
    document.body.classList.add('travado');
  },

  busca() {
    const p = document.querySelector('.painel-busca');
    if (!p) return;
    p.classList.add('aberto');
    Painel.cortina(true);
    setTimeout(() => p.querySelector('input')?.focus(), 260);
  }
};

/* ============================================================
   MODAL
   ============================================================ */
const Modal = {
  abrir(titulo, htmlInterno) {
    let m = document.querySelector('.modal');
    if (!m) {
      m = document.createElement('div');
      m.className = 'modal';
      m.innerHTML = '<div class="modal-fundo"></div><div class="modal-caixa">' +
        '<button class="modal-fechar" aria-label="Fechar">' + ICONES.x + '</button>' +
        '<div class="modal-conteudo"></div></div>';
      document.body.appendChild(m);
      m.querySelector('.modal-fundo').addEventListener('click', Modal.fechar);
      m.querySelector('.modal-fechar').addEventListener('click', Modal.fechar);
    }
    m.querySelector('.modal-conteudo').innerHTML =
      '<h2 class="titulo t-md" style="padding-right:2rem">' + U.esc(titulo) + '</h2>' +
      '<div class="filete"></div>' + htmlInterno;
    requestAnimationFrame(() => m.classList.add('aberto'));
    document.body.classList.add('travado');
  },
  fechar() {
    document.querySelector('.modal')?.classList.remove('aberto');
    document.body.classList.remove('travado');
  }
};

/* ============================================================
   FRETE
   ============================================================ */
const Frete = {
  calcular(cep) {
    const d = U.soDigitos(cep);
    if (d.length !== 8) return null;
    const faixa = CONFIG.frete.tabela.find(f => f.digitos.includes(d[0]));
    if (!faixa) return null;
    return { regiao: faixa.nome, valor: faixa.valor, prazo: faixa.prazo };
  },

  /* Consulta o endereço no ViaCEP (serviço público dos Correios).
     Só envia o CEP — nenhum dado pessoal sai daqui. */
  async endereco(cep) {
    const d = U.soDigitos(cep);
    if (d.length !== 8) return null;
    try {
      const r = await fetch('https://viacep.com.br/ws/' + d + '/json/');
      if (!r.ok) return null;
      const j = await r.json();
      return j.erro ? null : j;
    } catch (e) { return null; }
  }
};

/* ============================================================
   ANIMAÇÃO DE ENTRADA
   ============================================================ */
const Animacao = {
  obs: null,
  iniciar() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.revela').forEach(e => e.classList.add('visivel'));
      return;
    }
    Animacao.obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visivel'), i * 55);
          Animacao.obs.unobserve(e.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px' });
    Animacao.observar(document);
  },
  observar(raiz) {
    if (!Animacao.obs) return;
    (raiz || document).querySelectorAll('.revela:not(.visivel)')
      .forEach(e => Animacao.obs.observe(e));
  }
};

/* ============================================================
   ESTRUTURA DA PÁGINA (cabeçalho, rodapé, sacola)
   ============================================================ */
const Layout = {
  marca(classe) {
    return '<span class="marca ' + (classe || '') + '">' +
             '<span class="marca-duo">DUO</span>' +
             '<span class="marca-jeans">JEANS</span>' +
           '</span>';
  },

  montar() {
    const pagina = document.body.dataset.pagina || '';
    const ativo = (p) => pagina === p ? ' aria-current="page"' : '';

    /* ---- Aviso do topo ---- */
    const aviso = '<div class="aviso-topo">' + U.esc(CONFIG.avisoTopo) + '</div>';

    /* ---- Cabeçalho ---- */
    const cabecalho =
    '<header class="cabecalho">' +
      '<div class="container cabecalho-linha">' +
        '<button class="icone-btn btn-menu" data-abrir="menu" aria-label="Abrir menu">' + ICONES.menu + '</button>' +
        '<a href="index.html" class="marca-link" aria-label="Duo Jeans — página inicial">' + Layout.marca() + '</a>' +
        '<nav class="nav-principal">' +
          '<a href="produtos.html?c=novidades"' + ativo('novidades') + '>Novidades</a>' +
          '<a href="produtos.html?c=calcas"' + ativo('calcas') + '>Calças</a>' +
          '<a href="produtos.html?c=shorts"' + ativo('shorts') + '>Shorts</a>' +
          '<a href="produtos.html?c=saias"' + ativo('saias') + '>Saias</a>' +
          '<a href="produtos.html?c=jaquetas"' + ativo('jaquetas') + '>Jaquetas</a>' +
          '<a href="produtos.html?c=macaquinhos"' + ativo('macaquinhos') + '>Macaquinhos</a>' +
          '<a href="produtos.html?c=promocoes" class="destaque-sale">Sale</a>' +
        '</nav>' +
        '<div class="acoes-cabecalho">' +
          '<button class="icone-btn" data-abrir="busca" aria-label="Buscar">' + ICONES.busca + '</button>' +
          '<a class="icone-btn" href="favoritos.html" aria-label="Favoritos">' + ICONES.coracao +
            '<span class="contador" data-contador-favoritos>0</span></a>' +
          '<button class="icone-btn" data-abrir="sacola" aria-label="Abrir sacola">' + ICONES.sacola +
            '<span class="contador" data-contador-sacola>0</span></button>' +
        '</div>' +
      '</div>' +
    '</header>';

    /* ---- Faixa de benefícios ---- */
    const beneficios =
    '<div class="faixa-beneficios">' +
      '<div class="container">' +
        '<div class="beneficios-grade">' +
          Layout.beneficio(ICONES.caminhao, 'Frete grátis',
            'Nas compras acima de ' + U.dinheiro(CONFIG.frete.gratisAcima)) +
          Layout.beneficio(ICONES.cartao, 'Até ' + CONFIG.pagamento.mercadopago.parcelas + 'x sem juros',
            'Ou 5% de desconto no Pix') +
          Layout.beneficio(ICONES.troca, 'Primeira troca grátis',
            'Você tem 7 dias para trocar') +
          Layout.beneficio(ICONES.cadeado, 'Compra 100% segura',
            'Site protegido e dados criptografados') +
        '</div>' +
      '</div>' +
    '</div>';

    /* ---- Menu lateral ---- */
    const menuMovel =
    '<aside class="menu-movel" aria-label="Menu">' +
      '<div class="menu-movel-topo">' + Layout.marca() +
        '<button class="icone-btn" data-fechar aria-label="Fechar menu">' + ICONES.x + '</button>' +
      '</div>' +
      '<nav>' +
        '<a href="produtos.html?c=novidades">Novidades</a>' +
        '<a href="produtos.html?c=calcas">Calças</a>' +
        '<a href="produtos.html?c=shorts">Shorts</a>' +
        '<a href="produtos.html?c=saias">Saias</a>' +
        '<a href="produtos.html?c=jaquetas">Jaquetas</a>' +
        '<a href="produtos.html?c=macaquinhos">Macaquinhos</a>' +
        '<a href="produtos.html?c=promocoes">Sale</a>' +
        '<a href="produtos.html">Ver tudo</a>' +
        '<a href="marca.html">A Duo</a>' +
        '<a href="favoritos.html">Favoritos</a>' +
        '<a href="ajuda.html">Ajuda e trocas</a>' +
        '<a href="seguranca.html">Compra segura</a>' +
      '</nav>' +
      '<div class="menu-movel-rodape">' +
        '<div class="legenda mb-2">Atendimento</div>' +
        '<p>' + U.esc(CONFIG.loja.atendimento) + '</p>' +
        '<p class="mt-1"><a href="mailto:' + U.esc(CONFIG.loja.email) + '">' + U.esc(CONFIG.loja.email) + '</a></p>' +
      '</div>' +
    '</aside>';

    /* ---- Busca ---- */
    const busca =
    '<div class="painel-busca">' +
      '<div class="container">' +
        '<div class="busca-caixa">' +
          ICONES.busca +
          '<input type="search" placeholder="Buscar por modelagem, peça ou lavagem…" data-busca aria-label="Buscar produtos">' +
          '<button class="icone-btn" data-fechar aria-label="Fechar busca">' + ICONES.x + '</button>' +
        '</div>' +
        '<div class="grade-produtos busca-resultados" data-busca-resultados></div>' +
      '</div>' +
    '</div>';

    /* ---- Sacola lateral ---- */
    const sacola =
    '<aside class="sacola" aria-label="Sacola de compras">' +
      '<div class="sacola-topo">' +
        '<h2>Sua sacola</h2>' +
        '<button class="icone-btn" data-fechar aria-label="Fechar sacola">' + ICONES.x + '</button>' +
      '</div>' +
      '<div class="sacola-itens" data-sacola-itens></div>' +
      '<div class="sacola-rodape oculto" data-sacola-rodape>' +
        '<div class="barra-frete-gratis oculto" data-barra-frete>' +
          '<p></p><div class="barra-trilho"><div class="barra-preenchida" style="width:0"></div></div>' +
        '</div>' +
        '<div class="resumo-linha total"><span>Subtotal</span><span data-sacola-subtotal>R$ 0,00</span></div>' +
        '<p class="legenda mb-3" style="text-transform:none;letter-spacing:0;font-size:.72rem">Frete e descontos calculados no checkout.</p>' +
        '<a href="checkout.html" class="btn btn-principal btn-bloco">Finalizar compra</a>' +
        '<button class="btn btn-contorno btn-bloco btn-p mt-2" data-fechar>Continuar comprando</button>' +
        '<div class="faixa-segura mt-3">' + ICONES.cadeado +
          '<div><strong>Ambiente seguro</strong>Seus dados são protegidos por criptografia.</div>' +
        '</div>' +
      '</div>' +
    '</aside>';

    /* ---- Rodapé ---- */
    const ano = new Date().getFullYear();
    const rodape =
    '<footer class="rodape">' +
      '<div class="container">' +
        '<div class="rodape-grade">' +
          '<div class="rodape-sobre">' +
            Layout.marca('clara') +
            '<p>' + U.esc(CONFIG.loja.conceito) + ' Peças selecionadas para destacar quem você é.</p>' +
            '<div class="redes">' +
              '<a class="rede" href="' + CONFIG.instagramLink + '" target="_blank" rel="noopener" aria-label="Instagram">' + ICONES.instagram + '</a>' +
              '<a class="rede" href="' + CONFIG.whatsappLink('Olá! Tenho uma dúvida sobre a Duo Jeans.') + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + ICONES.whatsapp + '</a>' +
              '<a class="rede" href="mailto:' + U.esc(CONFIG.loja.email) + '" aria-label="E-mail">' + ICONES.email + '</a>' +
            '</div>' +
          '</div>' +
          '<div><h4>Comprar</h4><ul class="rodape-links">' +
            '<li><a href="produtos.html?c=novidades">Novidades</a></li>' +
            '<li><a href="produtos.html?c=calcas">Calças</a></li>' +
            '<li><a href="produtos.html?c=shorts">Shorts</a></li>' +
            '<li><a href="produtos.html?c=saias">Saias</a></li>' +
            '<li><a href="produtos.html?c=jaquetas">Jaquetas</a></li>' +
            '<li><a href="produtos.html?c=macaquinhos">Macaquinhos</a></li>' +
            '<li><a href="produtos.html?c=promocoes">Sale</a></li>' +
          '</ul></div>' +
          '<div><h4>Ajuda</h4><ul class="rodape-links">' +
            '<li><a href="ajuda.html#entrega">Prazos e entrega</a></li>' +
            '<li><a href="ajuda.html#trocas">Trocas e devoluções</a></li>' +
            '<li><a href="ajuda.html#pagamento">Formas de pagamento</a></li>' +
            '<li><a href="ajuda.html#medidas">Guia de medidas</a></li>' +
            '<li><a href="ajuda.html">Perguntas frequentes</a></li>' +
          '</ul></div>' +
          '<div><h4>Institucional</h4><ul class="rodape-links">' +
            '<li><a href="marca.html">Sobre a Duo</a></li>' +
            '<li><a href="seguranca.html">Compra segura</a></li>' +
            '<li><a href="privacidade.html">Política de privacidade</a></li>' +
            '<li><a href="termos.html">Termos de uso</a></li>' +
            '<li><a href="' + CONFIG.whatsappLink('Olá! Preciso de ajuda.') + '" target="_blank" rel="noopener">Fale conosco</a></li>' +
          '</ul></div>' +
        '</div>' +

        '<div class="rodape-selos">' +
          '<div class="bloco-selos">' +
            '<h5>Formas de pagamento</h5>' +
            '<div class="selos-linha">' +
              '<span class="bandeira pix">PIX</span>' +
              '<span class="bandeira">VISA</span>' +
              '<span class="bandeira">MASTER</span>' +
              '<span class="bandeira">ELO</span>' +
              '<span class="bandeira">AMEX</span>' +
              '<span class="bandeira">HIPER</span>' +
              '<span class="bandeira">BOLETO</span>' +
            '</div>' +
          '</div>' +
          '<div class="bloco-selos">' +
            '<h5>Segurança</h5>' +
            '<div class="selos-linha">' +
              '<span class="selo-seguranca">' + ICONES.cadeado +
                '<span><strong>Site seguro</strong><span>Certificado SSL</span></span></span>' +
              '<span class="selo-seguranca">' + ICONES.escudo +
                '<span><strong>Dados protegidos</strong><span>Conforme a LGPD</span></span></span>' +
            '</div>' +
          '</div>' +
          '<div class="bloco-selos">' +
            '<h5>Atendimento</h5>' +
            '<p style="font-size:.74rem;line-height:1.7;color:rgba(244,237,227,.62)">' +
              U.esc(CONFIG.loja.atendimento) + '<br>' +
              '<a href="mailto:' + U.esc(CONFIG.loja.email) + '">' + U.esc(CONFIG.loja.email) + '</a>' +
            '</p>' +
          '</div>' +
        '</div>' +

        '<div class="rodape-base">' +
          '<span>© ' + ano + ' ' + U.esc(CONFIG.loja.nome) + '. Todos os direitos reservados.</span>' +
          '<span>CNPJ ' + U.esc(CONFIG.loja.cnpj) + ' · ' + U.esc(CONFIG.loja.cidade) + '/' + U.esc(CONFIG.loja.uf) + '</span>' +
        '</div>' +
      '</div>' +
    '</footer>';

    /* ---- Botão de atendimento ---- */
    const ajuda =
      '<a class="btn-ajuda" href="' + CONFIG.whatsappLink('Olá! Estou no site da Duo Jeans e tenho uma dúvida.') +
      '" target="_blank" rel="noopener">' + ICONES.whatsapp + '<span>Atendimento</span></a>';

    /* ---- Injeta na página ---- */
    const topo = document.querySelector('[data-layout-topo]');
    if (topo) topo.innerHTML = aviso + cabecalho +
      (document.body.dataset.beneficios !== 'nao' ? beneficios : '');

    const base = document.querySelector('[data-layout-base]');
    if (base) base.innerHTML = rodape;

    document.body.insertAdjacentHTML('beforeend', menuMovel + busca + sacola + ajuda);
  },

  beneficio(icone, titulo, texto) {
    return '<div class="beneficio">' + icone +
      '<div><div class="beneficio-titulo">' + titulo + '</div>' +
      '<div class="beneficio-texto">' + texto + '</div></div></div>';
  }
};

/* ============================================================
   EVENTOS GLOBAIS
   ============================================================ */
function ligarEventos() {

  document.addEventListener('click', (e) => {
    const alvo = (s) => e.target.closest(s);

    if (alvo('[data-abrir="menu"]'))   { Painel.menu();   return; }
    if (alvo('[data-abrir="busca"]'))  { Painel.busca();  return; }
    if (alvo('[data-abrir="sacola"]')) { Sacola.abrir();  return; }
    if (alvo('[data-fechar]'))         { Painel.fecharTudo(); return; }

    const fav = alvo('[data-favorito]');
    if (fav) { Favoritos.alternar(fav.dataset.favorito); return; }

    const add = alvo('[data-add]');
    if (add) { Sacola.adicionar(add.dataset.add, add.dataset.tam, 1); return; }

    const qtd = alvo('[data-qtd]');
    if (qtd) { Sacola.mudarQtd(qtd.dataset.qtd, Number(qtd.dataset.delta)); return; }

    const rem = alvo('[data-remover]');
    if (rem) { Sacola.remover(rem.dataset.remover); return; }

    const acc = alvo('.acordeao-btn');
    if (acc) {
      const item = acc.closest('.acordeao-item');
      const aberto = item.classList.contains('aberto');
      item.parentElement.querySelectorAll('.acordeao-item').forEach(i => i.classList.remove('aberto'));
      item.classList.toggle('aberto', !aberto);
      acc.setAttribute('aria-expanded', String(!aberto));
      return;
    }

    const medidas = alvo('[data-guia-medidas]');
    if (medidas) { abrirGuiaMedidas(); return; }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { Painel.fecharTudo(); Modal.fechar(); }
  });

  /* Busca ao vivo */
  const campoBusca = document.querySelector('[data-busca]');
  if (campoBusca) {
    let t;
    campoBusca.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const termo = campoBusca.value.trim();
        const alvo = document.querySelector('[data-busca-resultados]');
        if (!termo) { alvo.innerHTML = ''; return; }
        const r = Catalogo.listar({ busca: termo }).slice(0, 8);
        alvo.innerHTML = r.length
          ? r.map(Catalogo.card).join('')
          : '<p class="texto-suave" style="grid-column:1/-1;padding:1.5rem 0">Nenhuma peça encontrada para “' + U.esc(termo) + '”.</p>';
        alvo.querySelectorAll('.revela').forEach(el => el.classList.add('visivel'));
      }, 180);
    });
  }

  /* Sombra do cabeçalho ao rolar */
  const cab = document.querySelector('.cabecalho');
  if (cab) {
    const aoRolar = () => cab.classList.toggle('rolado', window.scrollY > 8);
    window.addEventListener('scroll', aoRolar, { passive: true });
    aoRolar();
  }
}

/* Guia de medidas */
function abrirGuiaMedidas() {
  const tabela = (t) =>
    '<h3 class="legenda mt-4 mb-2">' + U.esc(t.titulo) + '</h3>' +
    '<table class="tabela-medidas"><thead><tr>' +
      t.colunas.map(c => '<th>' + U.esc(c) + '</th>').join('') +
    '</tr></thead><tbody>' +
      t.linhas.map(l => '<tr>' + l.map(c => '<td>' + U.esc(c) + '</td>').join('') + '</tr>').join('') +
    '</tbody></table>';

  Modal.abrir('Guia de medidas',
    '<p class="chamada">Meça sobre a pele, com a fita paralela ao chão e sem apertar.</p>' +
    tabela(MEDIDAS.numerico) + tabela(MEDIDAS.letra) +
    '<div class="cartao-destaque mt-4"><p><strong>Dica da Duo:</strong> ' + U.esc(MEDIDAS.dica) + '</p></div>');
}

/* ============================================================
   INÍCIO
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  Layout.montar();
  ligarEventos();
  Sacola.atualizar();
  Favoritos.atualizarContador();
  Animacao.iniciar();
  U.aplicarMascaras();
  if (typeof aoCarregarPagina === 'function') aoCarregarPagina();
});
