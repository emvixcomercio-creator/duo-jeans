# CONTINUA — estado do projeto Duo Jeans

> Documento de passagem para continuar em outro chat.
> Cole este arquivo no começo da conversa nova.

---

## ▶ ONDE PARAMOS — 30/08/2026

Tudo commitado e publicado. Último commit: `715a6cb`.
Nada pela metade, nada quebrado. O site no ar segue funcionando normalmente.

**Feito nesta sessão:**
1. Preview de compartilhamento (WhatsApp/Instagram) — capa própria + meta tags
2. Painel da loja em `/admin` — a cliente edita sem abrir arquivo
3. Migração para o Netlify preparada e testada

**O próximo passo depende do cliente, não de código:**

| Passo | Quem |
|---|---|
| Registrar domínio no registro.br | cliente |
| Criar conta Netlify e importar o repositório | cliente |
| Travar limite de gastos no Netlify | cliente |
| Ligar OAuth do GitHub (faz o painel autenticar) | cliente |
| Token do Mercado Pago na variável de ambiente | cliente |
| Rodar `trocar-dominio.py` e conferir tudo no ar | eu |

Guia completo e na ordem certa: **seção 2 do `LEIA-ME.md`**.

> Não precisa esperar o domínio para criar o site no Netlify. Fazendo 2.1 a 2.4, a
> loja já funciona de verdade no endereço `.netlify.app` — com pagamento e painel —
> e o domínio entra depois sem retrabalho.

**Duas coisas hoje só funcionam depois do Netlify:**
- O painel `/admin` abre, mas o login falha (precisa do OAuth)
- Cartão e boleto (a função de pagamento não roda no GitHub Pages)

---

## Onde tudo está

| O quê | Onde |
|---|---|
| Pasta do projeto | `c:\Users\PC\Desktop\DUO JEAN` |
| Site no ar | https://emvixcomercio-creator.github.io/duo-jeans/ |
| Repositório | https://github.com/emvixcomercio-creator/duo-jeans (público, branch `master`) |
| Conta GitHub | `emvixcomercio-creator` (Emvix), `gh` já autenticado na máquina |
| Manual de operação | `LEIA-ME.md` |
| Conferência das fotos | `conferencia.html` (uso interno, fora do menu e do Google) |

Publicar mudanças: `git add -A && git commit -m "..." && git push origin master`.
O GitHub Pages republica sozinho em ~1 minuto.

Rodar local: `python -m http.server 8765` e abrir `http://127.0.0.1:8765`.
Abrir o `index.html` direto no navegador **não funciona bem**.

---

## O que é o projeto

Loja online de jeans feminino, construída do zero com a identidade da marca tirada do
manual que o cliente forneceu (pasta `imagem/`):

- **Tipografia:** Cinzel (títulos) + Montserrat (texto) + Parisienne (acento manuscrito)
- **Cores:** marinho `#0F2137`, dourado `#B99653`, tan `#C9B191`, creme `#F4EDE3`, champanhe `#F3E5CB`
- **Logo:** DUO em Cinzel marinho + JEANS dourado espaçado entre filetes; monograma D|J
- **Tagline:** "Seu jeans. Seu jeito." · **Conceito:** "Denim feminino, essência atemporal."
- **Instagram:** @duojeans_

Site estático (HTML/CSS/JS puro, sem framework), pensado para receber tráfego do Instagram
no celular.

---

## Catálogo

**40 produtos montados a partir de 74 fotos** que o cliente entregou na pasta `catálogo/`.

| Categoria | Produtos |
|---|---|
| Calças | 20 |
| Shorts (inclui bermudas) | 13 |
| Saias | 5 |
| Jaquetas (camisa jeans) | 1 |
| Macaquinhos | 1 |

9 em destaque na home, 19 marcados como novidade.

As fotos originais foram **agrupadas por peça** (frente/costas/ângulos do mesmo produto),
recortadas em 3x4 e otimizadas: 29 MB → 6,7 MB. Ficam em `assets/img/produtos/`.

> ⚠️ **Pendência aberta:** o agrupamento das fotos foi inferência minha a partir da
> roupa e do look de cada foto. O cliente ainda **não confirmou** se está tudo certo.
> A página `conferencia.html` existe para isso: mostra cada produto com suas fotos e o
> nome do arquivo original. A dúvida específica é a **Calça Wide Leg Bicolor Manu**, que
> juntou 3 fotos — a terceira pode ser outra lavagem em vez da mesma peça.

A pasta `catálogo/` (29 MB de originais) está no `.gitignore`: não vai para o site.

---

## Como o site funciona

### Páginas
`index.html` · `produtos.html` (catálogo com filtros) · `produto.html` · `checkout.html`
· `pedido.html` · `favoritos.html` · `marca.html` · `ajuda.html` · `seguranca.html`
· `privacidade.html` · `termos.html` · `conferencia.html`

### Dados da loja (editados pelo painel em `/admin`)
- `dados/produtos.json` — as 40 peças
- `dados/loja.json` — frete, cupons e roleta
- `assets/img/produtos/` — as fotos

### Arquivos que só o dono edita, na mão
- `assets/js/config.js` — identidade da loja e **pagamento** (fora do painel de propósito)

### Arquivos de código (normalmente não se mexe)
- `assets/js/loja.js` — cabeçalho, rodapé, sacola, catálogo, utilidades, ícones SVG
- `assets/js/paginas.js` — comportamento do catálogo, produto, favoritos e home
- `assets/js/checkout.js` — checkout em 3 passos e página do pedido
- `assets/js/pix.js` — gerador de BR Code (Pix) e codificador de QR próprio
- `assets/js/roleta.js` — roleta de prêmios
- `assets/js/dados.js` — carrega os JSON antes da loja montar a tela
- `admin/config.yml` — os campos do painel
- `netlify/functions/criar-pagamento.js` — cria a cobrança no gateway (roda no servidor)
- `trocar-dominio.py` — troca o endereço do site em todos os arquivos de uma vez

---

## O link compartilhado (preview do WhatsApp e do Instagram)

Como o tráfego vem do Instagram, o cartão que aparece ao colar o link importa tanto
quanto a home. Estado atual:

- Capa própria da marca em `assets/img/og-capa.jpg` — 1200×630, 80 KB, gerada a partir
  do logotipo (Cinzel + filetes dourados) com a foto do hero à direita.
- `canonical` + Open Graph + Twitter Card nas **8 páginas públicas**.
  `checkout`, `pedido`, `favoritos` e `conferencia` seguem sem preview e com `noindex`.
- `sitemap.xml` e `robots.txt` apontam para o endereço que existe de verdade. Antes
  apontavam para `duojeans.com.br`, que ainda **não foi registrado** — o Google falharia
  ao ler o sitemap.

> ⚠️ O preview exige URL **absoluta**, então o endereço está escrito dentro de cada
> arquivo. Ao mudar de endereço (Netlify ou domínio próprio) rode
> `python trocar-dominio.py https://novo-endereco` — troca tudo de uma vez.
> Depois limpe o cache em <https://developers.facebook.com/tools/debug/>, senão o
> WhatsApp mostra a capa antiga por dias.

**Limitação conhecida:** compartilhar uma peça específica (`produto.html?id=...`) mostra
a capa genérica da loja, não a foto da peça. O robô que monta o preview não executa
JavaScript, e o produto só é carregado pelo JS. Resolver exige gerar uma página estática
por produto (40 arquivos, script de build) ou uma função no Netlify. **Não foi feito** —
decidir se vale.

---

## Painel da loja (`/admin`)

A cliente edita a loja por formulário, sem abrir arquivo. Usa **Decap CMS 3.15.1**
(CDN jsdelivr), backend GitHub, `publish_mode: simple` — salva direto no `master`.

**O que mudou por baixo:** o catálogo e as regras de venda saíram do código e viraram
dados. `PRODUTOS` não é mais um `const` em `produtos.js`; vem de `dados/produtos.json`
via `fetch`. `CONFIG.frete`, `CONFIG.cupons` e `CONFIG.roleta` vêm de `dados/loja.json`.
Quem faz isso é `assets/js/dados.js`, e o boot da loja e da roleta agora espera
`Dados.pronto()` antes de montar a tela.

A função de pagamento lê os **mesmos** JSON (antes ela avaliava o `produtos.js` como
código). Isso preserva a proteção de preço: testado de novo depois da mudança — pedido
com preço adulterado para R$ 1,00 foi cobrado R$ 256,40.

**No JSON os cupons são lista** (`[{codigo, tipo, valor, descricao}]`), porque o painel
não edita bem objeto de chave variável. O carregador converte para o objeto por código
que o resto do código espera. A função de pagamento faz a mesma conversão.

> ⚠️ **O painel ainda não funciona.** O login do GitHub precisa de um provedor OAuth,
> que o **Netlify** oferece pronto. No GitHub Pages a tela abre mas o login falha.
> Passo a passo na seção 5.4 do `LEIA-ME.md`. É mais um motivo para migrar.

> ⚠️ **Cuidado ao mexer no `admin/config.yml`:** o painel reescreve o arquivo inteiro
> ao salvar. Campo que existe no JSON e não está declarado no `config.yml` **é apagado**.
> Conferí campo a campo: hoje a cobertura está completa. Se acrescentar campo no JSON,
> declare no painel também.

**Armadilha de rascunho:** o Decap guarda rascunho no navegador. Um rascunho vazio preso
faz o painel abrir com tudo em branco — e publicar assim apaga o conteúdo bom. Perdi um
tempo com isso no teste. Está documentado na seção 5.5 do `LEIA-ME.md`.

**Testado:** painel lê as 40 peças, campos em português, categoria correta; salvamento
gravou no arquivo e a **única** diferença foi o campo alterado — cupons, fatias, faixas
de frete e objetos aninhados preservados; a loja leu o valor novo.

---

## Pagamento

**Cartão, Pix e boleto**, todos fechados dentro do site. O cliente foi explícito: pedido
por WhatsApp "não passa credibilidade". O WhatsApp ficou só como botão de atendimento.

Dois modos, em `config.js` → `pagamento.provedor`:

- **`'mercadopago'` (atual)** — checkout completo. A cliente paga na tela do Mercado Pago.
  **Falta ativar:** criar a variável de ambiente `MERCADOPAGO_ACCESS_TOKEN` no Netlify.
  Enquanto não ativar, o botão de pagamento mostra "O pagamento ainda não está ativo
  nesta versão do site" (no GitHub Pages a função serverless não existe).
- **`'pix'`** — modo provisório sem servidor. Gera o Pix copia-e-cola e o QR na hora.
  Funciona hoje, só precisa preencher `pagamento.pix.chave`.

O Pix foi validado: CRC conferido contra o valor oficial `29B1` do padrão CRC-16/CCITT-FALSE,
em duas implementações independentes.

### O ponto crítico de segurança
`netlify/functions/criar-pagamento.js` **recalcula o preço no servidor** a partir do
catálogo. O valor que o navegador manda é ignorado. Testado: enviei um pedido com preço
adulterado para R$ 1,00 e o servidor cobrou os R$ 289,90 corretos. Também recusa tamanho
esgotado e quantidade absurda.

---

## Migração para o Netlify — preparada, falta executar

Tudo do lado do código está pronto e testado. O que falta depende de conta:
registrar o domínio e criar o site no Netlify. Guia completo na seção 2 do `LEIA-ME.md`.

**Por que o Netlify virou obrigatório** (não é mais só melhoria):
1. A função de pagamento não roda no GitHub Pages — sem cartão nem boleto
2. Os cabeçalhos de segurança do `netlify.toml` são ignorados pelo Pages
3. O login do painel `/admin` precisa do OAuth do GitHub, que o Netlify oferece pronto

**Verificado com o Netlify CLI, rodando a função no runtime real:**
- O pacote da função contém `dados/produtos.json`, `dados/loja.json` e
  `assets/js/config.js` — o `included_files` funciona. Conferi o conteúdo do bundle
  em `.netlify/functions-serve/`, porque rodando local a função acharia os arquivos
  pelo diretório do projeto de qualquer jeito: passar no teste local **não** provaria
  o empacotamento.
- GET responde 405, tamanho inválido 400, quantidade absurda 400.

**Três correições feitas no `netlify.toml`:**
- Cache das fotos era 30 dias. Fazia sentido quando foto nova sempre tinha nome novo;
  agora o painel envia foto, e reenviar uma corrigida com o mesmo nome deixaria a
  cliente vendo a antiga por um mês. Passou para 1 dia.
- Havia um redirect fixo `http://duojeans.com.br` — domínio que não existe, regra que
  não fazia nada, e que o `trocar-dominio.py` **não** pegaria (o padrão só casa
  `https://`). Removido: o Netlify já força HTTPS sozinho.
- O `LEIA-ME` mandava publicar **arrastando a pasta**. Isso quebraria o painel: ele
  grava no repositório, então o site precisa estar **conectado ao GitHub** para
  receber as mudanças. Reescrito.

**Ordem sugerida:** domínio no registro.br → site no Netlify conectado ao repositório
→ travar limite de gastos → OAuth do GitHub → token do Mercado Pago →
`trocar-dominio.py` → desligar o GitHub Pages.

---

## Roleta de prêmios

Abre sozinha 6 segundos depois que a cliente entra, **uma vez por pessoa**, e nunca no
checkout. Pede o e-mail (captura de lead) e entrega um cupom que **aplica sozinho no
carrinho**, válido por 24h.

- Painel em **champanhe** — o cliente achou o fundo marinho "masculinizado demais".
  A roleta em si continua marinho e creme, isso foi aprovado.
- **12 fatias, só desconto e frete grátis.** Ecobag, chaveiro e brinde surpresa foram
  removidos a pedido do cliente.

| Prêmio | Chance |
|---|---|
| 5% OFF | 37,2% |
| 10% OFF | 28,5% |
| Frete grátis | 24,1% |
| 15% OFF | 8,8% |
| 20% OFF | 1,5% |

**O sorteio é real.** A roleta gira até parar exatamente na fatia sorteada — verificado nas
12 fatias, uma a uma, e reconferido depois de mexer na animação. Nenhuma fatia é
"não ganhou". Se for mexer nisso, mantenha essa honestidade.

O código já sabe lidar com cupom do tipo `brinde` (não abate valor, aparece como
"Cortesia" no resumo do pedido), caso queiram voltar com brindes depois.

> **Para testar a roleta:** ela só aparece **uma vez por navegador**. Depois da primeira
> vez fica gravada a chave `duo_roleta` e ela nunca mais abre naquele navegador — por
> isso "entrei no site e a roleta não apareceu" quase sempre é isso, não um defeito.
> Para ver de novo: abra uma **aba anônima**, ou rode no console (F12)
> `localStorage.removeItem('duo_roleta')` e recarregue.
> Verificado no site no ar em 30/08/2026: abre normalmente em navegador limpo.

---

## Segurança implementada

| Proteção | Onde |
|---|---|
| Preço recalculado no servidor | `netlify/functions/criar-pagamento.js` |
| Cartão nunca passa pelo site (checkout hospedado) | Mercado Pago |
| CSP, HSTS, X-Frame-Options, Referrer-Policy | `netlify.toml` e `_headers` |
| Escape de HTML em todo dado renderizado | `U.esc()` em `loja.js` |
| Token do gateway só em variável de ambiente | nunca no código |
| Páginas de LGPD, termos e compra segura | `privacidade.html`, `termos.html`, `seguranca.html` |
| Sem cookie de rastreamento | só localStorage para sacola e favoritos |

**Atenção ao cache:** `netlify.toml` tem cache longo só para `/assets/img/*`. JS, CSS e HTML
usam `max-age=0, must-revalidate` de propósito — o dono edita `produtos.js` direto, e cache
longo faria a cliente ver preço velho por semanas. Já foi bug uma vez; não reverta.

---

## O que ainda falta

### Bloqueia a venda
- [ ] **Preencher os dados reais em `config.js`** — CNPJ, endereço, e-mail, WhatsApp,
      Instagram, domínio. Estão com valores de exemplo (`00.000.000/0001-00`,
      `5511999999999`). Loja sem CNPJ visível derruba a credibilidade, que é justamente
      a preocupação principal do cliente.
- [ ] **Ativar o gateway** — token do Mercado Pago na variável de ambiente do Netlify
      (passo a passo na seção 3 do `LEIA-ME.md`). Sem isso, cartão e boleto não funcionam.
- [ ] **Conferir preços e estoque.** Os preços (R$ 149,90 a R$ 289,90) foram estimados por
      mim para peças plausíveis — o cliente precisa revisar peça por peça. O campo
      `esgotados` está vazio em todos os produtos.

### Depende de confirmação do cliente
- [ ] **Validar `conferencia.html`** — o agrupamento das 74 fotos em 40 produtos.
- [ ] **Nomes dos produtos** — inventei nomes femininos (Milena, Antonella, Olívia...).
      Podem ser trocados livremente em `produtos.js`.
- [ ] **20% OFF na roleta** — 1,5% de chance, mas em 100 visitantes uma ou duas ganham.
      Confirmar se a margem aguenta.

### Melhorias possíveis (nada urgente)
- Formspree em `config.js` → `pedidos.endpointEmail`, para receber cada pedido por e-mail.
- Seção de avaliações de clientes (não criei: seria inventar depoimento falso).
- Preview por produto no WhatsApp (ver "O link compartilhado" acima).

---

## Decisões já tomadas — não refazer sem perguntar

1. **Sem pedido por WhatsApp.** O cliente rejeitou explicitamente: "não passa credibilidade".
2. **Cartão + Pix + boleto**, não só Pix. O cliente confirmou que o gateway é necessário.
3. **Painel da roleta em champanhe**, roleta em marinho. Já validado com o cliente.
4. **Roleta só com desconto e frete grátis.** Brindes foram removidos a pedido.
5. **A palavra "denim" está correta** e vem do manual da própria marca. O cliente perguntou;
   foi explicado que é o nome do tecido.
6. **Repositório público** — escolha do cliente, é o que permite GitHub Pages gratuito.

---

## Referências que guiaram o layout

Padrões copiados de e-commerces de jeans já validados no Brasil (Damyller e Colcci):
barra de aviso com frete e parcelamento, faixa de 4 benefícios sob o header, filtro por
modelagem, feed #MeuJeansDuo, FAQ na home e rodapé institucional com CNPJ.

---

## Como testei

Tudo foi verificado no navegador de verdade (Playwright), não só por leitura de código:
fluxo completo de compra, validação de CPF com dígito verificador, busca de CEP no ViaCEP,
cálculo de frete, cupom, geração e validação do Pix, tentativa de fraude de preço,
responsividade no celular (390px) e as 12 fatias da roleta.

Bugs achados e corrigidos nesse processo: cache longo no catálogo, valor do Pix
desatualizado ao aplicar cupom, chips de tamanho posicionados fora da foto, menu
sobrepondo o logo, arte com texto usada como foto de fundo, giro da roleta que ficava
parado na segunda metade, e a roleta abrindo duas vezes.
