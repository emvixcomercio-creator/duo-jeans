/* ============================================================
   DUO JEANS — GUIA DE MEDIDAS E CATEGORIAS
   ------------------------------------------------------------
   ⚠️  AS PEÇAS NÃO ESTÃO MAIS AQUI.

   O catálogo agora fica em  dados/produtos.json  e é editado
   pelo painel em /admin — formulário com campo para preço,
   tamanhos esgotados e fotos, sem risco de quebrar o site com
   uma vírgula fora do lugar.

   Este arquivo guarda só o que não muda no dia a dia:
   o guia de medidas e a lista de categorias.
   ============================================================ */

/* ============================================================
   TABELA DE MEDIDAS (abre no botão "Guia de medidas")
   ============================================================ */
const MEDIDAS = {
  numerico: {
    titulo: 'Calças, shorts, bermudas e saias',
    colunas: ['Tamanho', 'Cintura (cm)', 'Quadril (cm)'],
    linhas: [
      ['36', '64 – 68', '90 – 94'],
      ['38', '68 – 72', '94 – 98'],
      ['40', '72 – 76', '98 – 102'],
      ['42', '76 – 82', '102 – 107'],
      ['44', '82 – 88', '107 – 112']
    ]
  },
  letra: {
    titulo: 'Camisas e macaquinhos',
    colunas: ['Tamanho', 'Busto (cm)', 'Cintura (cm)'],
    linhas: [
      ['P',  '86 – 92',   '64 – 70'],
      ['M',  '92 – 98',   '70 – 76'],
      ['G',  '98 – 106',  '76 – 84'],
      ['GG', '106 – 114', '84 – 92']
    ]
  },
  dica: 'Na dúvida entre dois tamanhos, escolha o maior nas modelagens wide leg, cargo e balloon, e o menor nas retas e flare.'
};

/* ============================================================
   CATEGORIAS — menu, faixa de ícones da home e filtros
   ============================================================ */
const CATEGORIAS = [
  { id: 'calcas',      nome: 'Calças',      icone: 'calca'   },
  { id: 'shorts',      nome: 'Shorts',      icone: 'short'   },
  { id: 'saias',       nome: 'Saias',       icone: 'saia'    },
  { id: 'jaquetas',    nome: 'Jaquetas',    icone: 'jaqueta' },
  { id: 'macaquinhos', nome: 'Macaquinhos', icone: 'macacao' },
  { id: 'novidades',   nome: 'Novidades',   icone: 'estrela' }
];
