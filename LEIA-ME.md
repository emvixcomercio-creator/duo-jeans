# Duo Jeans — manual da loja

Site de vendas construído com a identidade da marca: Cinzel + Montserrat, marinho `#0F2137`,
dourado `#B99653` e creme `#F4EDE3`.

---

## 1. Antes de tudo: os 3 arquivos que você edita

Todo o resto do site funciona sozinho. Você só precisa mexer nestes:

| Arquivo | Para que serve |
|---|---|
| `assets/js/config.js` | Dados da loja, pagamento, frete, cupons |
| `assets/js/produtos.js` | O catálogo: peças, preços, fotos, estoque |
| `assets/img/produtos/` | As fotos das peças |

---

## 1.1. Sobre a pasta `catálogo/`

São as **fotos originais** da sessão (29 MB). O site **não usa** essa pasta — ele usa as
versões otimizadas em `assets/img/produtos/`, já cortadas em 3x4 e leves para o celular.

Guarde a pasta original como backup, mas **não precisa subir para o site**. Se estiver
publicando por arrastar-e-soltar no Netlify, tire a pasta antes para o envio ficar rápido.

---

## 2. Colocar no ar em 10 minutos (grátis)

1. Crie uma conta em [netlify.com](https://netlify.com).
2. Arraste a pasta inteira `DUO JEAN` para a área de deploy do Netlify.
3. Pronto — o site já está no ar com HTTPS e certificado SSL automático.
4. Em **Domain settings**, aponte o seu domínio (ex.: `duojeans.com.br`).

Depois, em `config.js`, troque o campo `dominio` para o seu domínio real.

> O arquivo `netlify.toml` já vai junto e aplica sozinho todos os cabeçalhos de
> segurança (HSTS, CSP, proteção contra clickjacking).

---

## 3. Ativando cartão e boleto

Pix já funciona sem servidor. **Cartão e boleto precisam do gateway** — é ele que
processa o pagamento sem que o número do cartão passe pelo seu site.

1. Crie a conta em [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers).
2. Em **Suas integrações → Credenciais de produção**, copie o **Access Token**
   (começa com `APP_USR-`).
3. No Netlify: **Site settings → Environment variables → Add a variable**
   - Key: `MERCADOPAGO_ACCESS_TOKEN`
   - Value: cole o token
4. Em `config.js`, confirme que está assim:
   ```js
   provedor: 'mercadopago',
   ```
5. Refaça o deploy. Pronto: cartão em até 3x, Pix e boleto.

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

## 5. Mexendo no catálogo

### Mudar preço, promoção ou estoque
Abra `assets/js/produtos.js` e ache a peça:

```js
{
  id: "cargo-milena",
  nome: "Calça Cargo Milena",
  preco: 269.90,          // preço de venda
  precoDe: 319.90,        // preço riscado — apague esta linha se não houver promoção
  tamanhos: [36, 38, 40, 42, 44],
  esgotados: [36, 44],    // ficam riscados e não podem ser comprados
  novidade: true,         // aparece em "Novidades"
  destaque: true,         // aparece na página inicial
  badge: "Mais vendida",  // selo na foto
  ...
}
```

### Cadastrar uma peça nova
1. Salve as fotos em `assets/img/produtos/` na proporção **3x4** (ex.: 1000x1333 px).
2. Copie um bloco `{ ... }` inteiro e cole no fim da lista.
3. Troque o `id` (único, sem espaço nem acento), o nome, o preço e o caminho das fotos.

A primeira foto é a da vitrine; a segunda é a que aparece quando a cliente passa o mouse.

### Tirar uma peça do ar
Apague o bloco dela, ou marque todos os tamanhos como esgotados.

---

## 6. Frete e cupons

Em `config.js`:

```js
frete: {
  gratisAcima: 399,     // frete grátis a partir deste valor
  tabela: [ ... ]       // valor e prazo por região, pelo 1º dígito do CEP
}
```

O site consulta o **ViaCEP** para preencher o endereço sozinho, e usa a sua tabela
para calcular o valor. Ajuste os valores com o que você realmente paga nos Correios.

Cupons ficam logo abaixo, em `cupons`. Já vêm três prontos: `DUO10`, `PRIMEIRA` e `FRETEDUO`.

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

O link da bio deve apontar para páginas específicas, não sempre para a home:

- Coleção completa → `duojeans.com.br/produtos.html`
- Novidades → `duojeans.com.br/produtos.html?c=novidades`
- Só calças → `duojeans.com.br/produtos.html?c=calcas`
- Promoções → `duojeans.com.br/produtos.html?c=promocoes`
- Uma peça específica → `duojeans.com.br/produto.html?id=cargo-milena`

Nos stories de uma peça, use o link direto dela: a cliente cai na página certa e
compra em dois toques, em vez de ter que procurar no catálogo.

---

## 10. Rodando no seu computador

Abrir o `index.html` direto no navegador **não funciona bem** (o navegador bloqueia
alguns recursos). Rode um servidor local:

```bash
# com Python (já instalado no seu PC)
python -m http.server 8000
```

Depois abra `http://localhost:8000`.
