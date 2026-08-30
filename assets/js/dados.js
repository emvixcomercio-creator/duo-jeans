/* ============================================================
   DUO JEANS — CARREGADOR DOS DADOS DA LOJA
   ------------------------------------------------------------
   O catálogo e as regras de venda ficam em arquivos de dados,
   não em código:

     dados/produtos.json  → as peças
     dados/loja.json      → frete, cupons e roleta

   São esses os arquivos que o painel em /admin edita. Este
   carregador lê os dois antes da loja montar a tela, e encaixa
   o conteúdo onde o resto do código espera encontrar.

   Não edite os JSON na mão se puder usar o painel: ele valida
   os campos e evita erro de vírgula que derruba a loja.
   ============================================================ */

const Dados = {

  _promessa: null,

  /* Carrega uma vez só, mesmo que várias partes peçam. */
  pronto() {
    return Dados._promessa || (Dados._promessa = Dados.carregar());
  },

  buscar(caminho) {
    return fetch(caminho, { cache: 'no-cache' }).then(r => {
      if (!r.ok) throw new Error(caminho + ' respondeu ' + r.status);
      return r.json();
    });
  },

  carregar() {
    return Promise.all([
      Dados.buscar('dados/produtos.json'),
      Dados.buscar('dados/loja.json')
    ])
    .then(([produtos, loja]) => {
      window.PRODUTOS = (produtos && Array.isArray(produtos.produtos)) ? produtos.produtos : [];

      CONFIG.frete  = loja.frete;
      CONFIG.roleta = loja.roleta;

      /* No arquivo os cupons são uma lista (o painel edita melhor assim).
         O resto do código procura por código: CONFIG.cupons['DUO10']. */
      CONFIG.cupons = {};
      (loja.cupons || []).forEach(c => {
        if (!c || !c.codigo) return;
        CONFIG.cupons[String(c.codigo).trim().toUpperCase()] = {
          tipo: c.tipo,
          valor: c.valor,
          descricao: c.descricao
        };
      });
    })
    .catch(erro => {
      /* Sem os dados não há loja. Melhor avisar do que mostrar
         uma vitrine vazia como se estivesse tudo certo. */
      console.error('[Duo Jeans] Falha ao carregar os dados da loja:', erro);
      window.PRODUTOS = window.PRODUTOS || [];
      Dados.avisarFalha();
    });
  },

  avisarFalha() {
    const aviso = document.createElement('div');
    aviso.setAttribute('role', 'alert');
    aviso.style.cssText =
      'position:fixed;left:0;right:0;bottom:0;z-index:9999;padding:14px 18px;' +
      'background:#B4453C;color:#fff;font:500 14px/1.5 system-ui,sans-serif;text-align:center';
    aviso.textContent =
      'Não conseguimos carregar o catálogo agora. Recarregue a página em instantes.';
    const por = () => document.body && document.body.appendChild(aviso);
    if (document.body) por(); else document.addEventListener('DOMContentLoaded', por);
  }
};
