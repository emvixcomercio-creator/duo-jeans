# Duo Jeans — manual da loja

Site de vendas construído com a identidade da marca: Cinzel + Montserrat, marinho `#0F2137`,
dourado `#B99653` e creme `#F4EDE3`.

---

## 1. Antes de tudo: o painel

**O dia a dia da loja se faz pelo painel, sem abrir arquivo nenhum:**

```
https://seu-site/admin
```

Lá você muda preço, marca tamanho esgotado, cadastra peça nova com foto e ajusta
frete, cupons e roleta — tudo em formulário, sem risco de quebrar o site com uma
vírgula fora do lugar. Passo a passo na **seção 5**.

Se precisar mexer por baixo do pano, os arquivos são estes:

| Arquivo | Para que serve | Quem edita |
|---|---|---|
| `dados/produtos.json` | O catálogo: peças, preços, fotos, esgotados | **o painel** |
| `dados/loja.json` | Frete, cupons e roleta | **o painel** |
| `assets/img/produtos/` | As fotos das peças | o painel, ao enviar foto |
| `assets/js/config.js` | Nome, CNPJ, contato e **pagamento** | você, na mão |

> O `config.js` ficou de fora do painel de propósito: é onde mora a configuração do
> gateway de pagamento. Quem edita a vitrine não precisa — nem deve — encostar nisso.

---

## 1.1. Sobre a pasta `catálogo/`

São as **fotos originais** da sessão (29 MB). O site **não usa** essa pasta — ele usa as
versões otimizadas em `assets/img/produtos/`, já cortadas em 3x4 e leves para o celular.

Guarde a pasta original como backup. Ela está no `.gitignore`, então **não vai para o
site** — nem precisa, e economiza 29 MB em cada publicação.

---

## 2. Publicar no Netlify

Hoje a loja está no GitHub Pages, que só entrega arquivos. Ele **não** roda a função
de pagamento, **não** aplica os cabeçalhos de segurança e **não** autentica o painel.
No Netlify as três coisas funcionam, no plano grátis.

> ⚠️ **Não publique arrastando a pasta.** O painel salva as mudanças no repositório
> do GitHub — se o site não estiver **conectado ao repositório**, a loja nunca recebe
> o que a cliente editar. Tem que ser pelo caminho abaixo.

### 2.1. Conectar o site

1. Crie a conta em [netlify.com](https://netlify.com) — entre **com o GitHub**, fica mais simples
2. **Add new site** → **Import an existing project** → **GitHub**
3. Escolha o repositório `emvixcomercio-creator/duo-jeans`
4. Nas opções de build, deixe assim:
   - **Branch to deploy:** `master`
   - **Build command:** *(vazio)*
   - **Publish directory:** `.`

   O `netlify.toml` do projeto já diz o resto. Não precisa preencher mais nada.
5. **Deploy site**

Em um ou dois minutos o site sai no ar num endereço tipo
`https://algum-nome.netlify.app`. Você pode renomear em **Site configuration** →
**Change site name**.

### 2.2. Trave o limite de gastos

Antes de qualquer outra coisa: **Billing** → deixe o limite em zero / sem cartão.

No plano grátis, um pico de tráfego fora do normal pode gerar cobrança. Com o limite
travado, no pior caso o site sai do ar por um tempo — em vez de virar fatura.

### 2.3. Ligue o painel

Já está ligado — o login é hospedado no próprio site. Detalhes na seção 5.4.

### 2.4. Ligue o pagamento

Crie a variável `MERCADOPAGO_ACCESS_TOKEN` em **Site configuration** →
**Environment variables**. Passo a passo na seção 3.

### 2.5. Aponte o domínio

1. Registre o domínio no [registro.br](https://registro.br) (o oficial do `.com.br`)
2. No Netlify: **Domain management** → **Add a domain**
3. Siga as instruções de DNS que ele mostrar
4. Ligue o **Force HTTPS** (o certificado sai de graça e sozinho)
5. No seu computador, rode:

   ```bash
   python trocar-dominio.py https://seudominio.com.br
   git add -A && git commit -m "Novo endereco do site" && git push
   ```

   Isso acerta o preview do WhatsApp, o `sitemap.xml` e o `robots.txt`.
   Sem esse passo, o cartão do link continua apontando para o endereço antigo.

6. Em `config.js`, troque o campo `dominio`

### 2.6. Confira que deu certo

- [ ] A loja abre e mostra as 40 peças
- [ ] `seu-site/admin` pede login do GitHub e **entra**
- [ ] Uma compra de teste chega até a tela do Mercado Pago (seção 3)
- [ ] O cadeado do navegador aparece (HTTPS)

### 2.7. E o link antigo do GitHub Pages?

Ele continua no ar mostrando a mesma loja, o que confunde o Google e divide a
reputação do site. Depois que o Netlify estiver funcionando, desligue o Pages:
no GitHub, **Settings** → **Pages** → em **Source**, escolha **None**.

---

## 3. Ativando cartão e boleto

Pix já funciona sem servidor. **Cartão e boleto precisam do gateway** — é ele que
processa o pagamento sem que o número do cartão passe pelo seu site.

1. Crie a conta em [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers).
2. Em **Suas integrações → Credenciais de produção**, copie o **Access Token**
   (começa com `APP_USR-`).
3. No Netlify: **Site configuration → Environment variables → Add a variable**
   - Key: `MERCADOPAGO_ACCESS_TOKEN`
   - Value: cole o token
4. Em `config.js`, confirme que está assim:
   ```js
   provedor: 'mercadopago',
   ```
5. **Deploys → Trigger deploy → Clear cache and deploy site.** Variável de ambiente
   nova só vale no deploy seguinte — sem esse passo o botão continua dizendo que o
   pagamento não está ativo.

Pronto: cartão em até 3x, Pix e boleto.

**Nunca coloque o Access Token dentro de `config.js`.** Ele vive só na variável de
ambiente do servidor — se ficar no site, qualquer pessoa consegue copiar.

### Testando antes de vender de verdade
Use as **credenciais de teste** do Mercado Pago (token que começa com `TEST-`).
A função detecta sozinha e usa o ambiente de sandbox.

### Enquanto o gateway não está pronto
Em `config.js`, mude para `provedor: 'pix'` e preencha `pagamento.pix.chave`.
A loja passa a gerar o Pix copia-e-cola e o QR Code na hora, e você confere o
pagamento na sua conta. Cartão e boleto ficam ocultos até você ativar o gateway.

---

## 4. Receber aviso de cada pedido por e-mail

1. Crie um formulário grátis em [formspree.io](https://formspree.io).
2. Copie a URL que ele gera (`https://formspree.io/f/xxxxxxx`).
3. Cole em `config.js`:
   ```js
   pedidos: { endpointEmail: 'https://formspree.io/f/xxxxxxx', ... }
   ```

Com o Mercado Pago ativo você já recebe a notificação dele também — este é um aviso extra,
com o resumo do pedido e o endereço de entrega.

---

## 5. Mexendo no catálogo (pelo painel)

Entre em `https://seu-site/admin` e clique em **Entrar com o GitHub**.

> **Antes de funcionar:** o painel só abre depois que o site estiver no **Netlify**
> e o login do GitHub estiver ligado lá. Veja a seção 5.4.

### 5.1. Mudar preço, promoção ou esgotado

1. **Catálogo** → **Peças da loja**
2. Ache a peça na lista (aparece como *nome — preço*) e clique na setinha para abrir
3. Mude o que precisar:
   - **Preço de venda** — use ponto nos centavos: `269.90`
   - **Preço antigo, riscado** — só preencha em promoção; vazio = sem promoção
   - **Tamanhos esgotados** — ficam riscados e não podem ser comprados
4. **Publicar** → **Publicar agora**

A loja atualiza em cerca de um minuto.

### 5.2. Cadastrar uma peça nova

1. **Catálogo** → **Peças da loja** → botão **Adicionar peça** (no fim da lista)
2. Preencha os campos. Atenção a dois:
   - **Código (id)** — só letras minúsculas, números e hífen, ex.: `cargo-milena`.
     Precisa ser único e **não deve mudar depois de publicado**: é ele que forma o
     link da peça. Se mudar, quem salvou o link antigo cai numa página que não existe.
   - **Fotos** — envie pelo próprio painel. Use fotos **em pé, na proporção 3x4**
     (ex.: 1000×1333 px). A primeira é a da vitrine; a segunda aparece quando a
     cliente passa o mouse.
3. **Publicar agora**

### 5.3. Tirar uma peça do ar

Abra a peça e clique no **×** do bloco dela, ou marque todos os tamanhos como
esgotados se for coisa temporária.

### 5.4. Como o login do painel funciona

**Já está ligado e funcionando.** Você entra em `duojeans.com.br/admin` com a sua
conta do GitHub.

O login é hospedado no próprio site, em duas funções
(`netlify/functions/oauth-auth.js` e `oauth-callback.js`). Não depende de nenhum
serviço de terceiro além do próprio GitHub.

Peguei esse caminho porque o atalho do Netlify (instalar um "provedor OAuth" no
painel deles) some e muda de lugar a cada reforma da interface.

**Para dar acesso a outra pessoa** — a cliente, por exemplo:

1. Ela cria uma conta grátis no [github.com](https://github.com)
2. No repositório: **Settings** → **Collaborators** → **Add people**
3. Pronto — ela entra em `duojeans.com.br/admin` com a conta dela

**Se um dia precisar trocar as chaves:** elas ficam em
[github.com/settings/developers](https://github.com/settings/developers) →
**Duo Jeans Painel**, e são lidas das variáveis `GITHUB_OAUTH_CLIENT_ID` e
`GITHUB_OAUTH_CLIENT_SECRET` no Netlify.

### 5.5. Se o painel abrir com os campos vazios

O painel guarda rascunho no navegador. Se um rascunho vazio ficar preso, os campos
aparecem em branco mesmo com os dados salvos no lugar certo — **não publique assim**,
ou o rascunho vazio sobrescreve o conteúdo bom.

Para resolver: feche a aba, abra o painel de novo e, se o navegador perguntar
*"Um backup local foi recuperado"*, responda **não**. Em último caso, abra o painel
numa janela anônima.

---

## 6. Frete e cupons

No painel: **Frete, cupons e roleta** → **Regras de venda**.

**Frete**
- **Frete grátis a partir de** — use 0 para desligar
- **Valor por região** — valor e prazo por região, definidos pelo 1º dígito do CEP

O site consulta o **ViaCEP** para preencher o endereço sozinho, e usa essa tabela para
calcular o valor. Ajuste com o que você realmente paga nos Correios.

**Cupons** — já vêm cinco prontos: `DUO5`, `DUO10`, `PRIMEIRA`, `DUO20` e `FRETEDUO`.

Ao criar um cupom, o campo **Valor** confunde: para desconto em porcentagem use
**decimal** — `0.10` é 10%, `0.15` é 15%. Para frete grátis use `1`. Para brinde, `0`.

---

## 6.1. Roleta de prêmios

A roleta abre sozinha 6 segundos depois que a cliente entra, **uma vez por pessoa**, e
nunca durante o checkout. Ela pede o e-mail (vira sua lista de contatos) e entrega um
cupom que **aplica sozinho no carrinho**, válido por 24 horas.

Tudo fica em `config.js`, no bloco `roleta`:

```js
roleta: {
  ativo: true,              // false desliga a roleta
  segundosParaAbrir: 6,     // demora para aparecer
  pedirEmail: true,         // false deixa girar sem e-mail
  validadeHoras: 24,        // por quanto tempo o prêmio vale

  premios: [
    { rotulo: '5% OFF', cupom: 'DUO5', peso: 16 },
    ...
  ]
}
```

### Como funciona o sorteio
O **peso** define a chance de cada fatia. Peso maior sai mais vezes. Com a configuração
atual, as chances reais são:

| Prêmio | Chance |
|---|---|
| 5% OFF | 37,2% |
| 10% OFF | 28,5% |
| Frete grátis | 24,1% |
| 15% OFF | 8,8% |
| 20% OFF | 1,5% |

O sorteio é **de verdade**: a roleta gira até parar exatamente na fatia sorteada, e todo
cupom que ela entrega funciona. Não existe fatia de "não ganhou".

### Brindes, se um dia você quiser dar
A roleta hoje só entrega desconto e frete grátis. O site já sabe lidar com brinde: crie
um cupom do tipo **Brinde** e inclua numa fatia. Ele não abate valor — aparece no resumo
do pedido como **cortesia**, para você separar e mandar junto.

### Mudar os prêmios
No painel: **Frete, cupons e roleta** → **Roleta de prêmios** → **Fatias da roleta**.

O campo **Cupom que ela ganha** precisa ser um código que existe na lista de cupons —
senão a fatia não entrega nada. Para trocar o desconto, mexa no cupom, não na fatia.

O número de fatias é livre: 8, 10 ou 12 funcionam bem. Acima de 14 o texto começa a ficar
apertado. Rótulos curtos ("10% OFF") ficam melhores que longos.

---

## 7. O que já está feito de segurança

Isso é o que sustenta a credibilidade da loja:

| Proteção | O que faz |
|---|---|
| **HTTPS + SSL** | Automático no Netlify. Tudo que a cliente digita trafega criptografado. |
| **Checkout hospedado** | O cartão é digitado na tela do Mercado Pago. O número nunca passa pelo seu site. |
| **Preço validado no servidor** | A função recalcula o total pelo catálogo. Se alguém adulterar o preço no navegador, a cobrança sai correta mesmo assim. |
| **Validação de estoque** | O servidor recusa pedido de tamanho esgotado ou quantidade absurda. |
| **CSP** | Bloqueia scripts de origem desconhecida — protege contra roubo de dados por script injetado. |
| **HSTS** | Obriga HTTPS sempre, mesmo se alguém digitar `http://`. |
| **X-Frame-Options** | Impede que clonem sua loja dentro de um site falso. |
| **Escape de HTML** | Todo texto é escapado antes de virar página, contra injeção de código. |
| **Token fora do site** | A chave do gateway vive só na variável de ambiente do servidor. |
| **LGPD** | Política de privacidade real, sem cookie de rastreamento. |

### O que ainda depende de você
- [ ] Preencher **CNPJ, endereço, e-mail e WhatsApp** reais em `config.js` — loja sem CNPJ visível derruba a confiança na hora.
- [ ] Criar um e-mail no seu domínio (`contato@duojeans.com.br`) em vez de Gmail.
- [ ] Cadastrar a loja no **Reclame Aqui** e responder rápido.
- [ ] Deixar o Instagram ativo e com link para o site na bio.

---

## 8. As páginas do site

| Arquivo | Página |
|---|---|
| `index.html` | Início |
| `produtos.html` | Catálogo com filtros |
| `produto.html` | Página da peça |
| `checkout.html` | Fechamento do pedido em 3 passos |
| `pedido.html` | Confirmação e Pix |
| `favoritos.html` | Peças salvas |
| `marca.html` | A Duo |
| `ajuda.html` | Central de ajuda, trocas, medidas |
| `seguranca.html` | Compra segura |
| `privacidade.html` | Política de privacidade (LGPD) |
| `termos.html` | Termos de uso |
| `conferencia.html` | **Uso interno** — conferir o agrupamento das fotos |

---

## 9. Divulgação no Instagram

O endereço da loja hoje é:

```
https://emvixcomercio-creator.github.io/duo-jeans/
```

O link da bio deve apontar para páginas específicas, não sempre para a home
(troque a parte de cima pelo endereço acima):

- Coleção completa → `/produtos.html`
- Novidades → `/produtos.html?c=novidades`
- Só calças → `/produtos.html?c=calcas`
- Promoções → `/produtos.html?c=promocoes`
- Uma peça específica → `/produto.html?id=cargo-milena`

Nos stories de uma peça, use o link direto dela: a cliente cai na página certa e
compra em dois toques, em vez de ter que procurar no catálogo.

### Como o link aparece quando alguém compartilha

Ao colar o link no WhatsApp, no Direct ou no Facebook, aparece um cartão com a
capa da marca, o nome da loja e uma frase. Essa capa é o arquivo
`assets/img/og-capa.jpg` (1200 × 630 px).

Para trocar a capa, substitua esse arquivo mantendo **o mesmo nome e o mesmo
tamanho**. Depois de publicar, limpe o cache do preview em
<https://developers.facebook.com/tools/debug/> — senão o WhatsApp continua
mostrando a capa antiga por dias.

> **Atenção:** ao compartilhar o link de **uma peça específica**
> (`/produto.html?id=...`), o cartão mostra a capa geral da loja, e não a foto
> daquela peça. Isso é uma limitação de site estático: o robô que monta o
> preview não executa JavaScript, então ele não chega a saber qual peça é.
> O link funciona normalmente para a cliente — só a miniatura fica genérica.

### Trocar o domínio

O preview do WhatsApp exige endereço **absoluto** (começando com `https://`).
Por isso o endereço da loja está escrito dentro de cada página, do `sitemap.xml`
e do `robots.txt`. Quando a loja mudar de endereço, não saia editando arquivo por
arquivo — rode:

```bash
python trocar-dominio.py https://duojeans.com.br
```

O script troca tudo de uma vez e mostra o que mudou. Rodando sem nada depois do
nome, ele só informa qual é o endereço atual:

```bash
python trocar-dominio.py
```

Depois publique normalmente (`git add -A && git commit -m "..." && git push`) e
limpe o cache do preview no link do Facebook citado acima.

---

## 10. Rodando no seu computador

Abrir o `index.html` direto no navegador **não funciona bem** (o navegador bloqueia
alguns recursos). Rode um servidor local:

```bash
# com Python (já instalado no seu PC)
python -m http.server 8000
```

Depois abra `http://localhost:8000`.
