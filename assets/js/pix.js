/* ============================================================
   DUO JEANS — PIX
   ------------------------------------------------------------
   Gera o código "Pix Copia e Cola" (padrão EMV/BR Code do Banco
   Central) e desenha o QR Code dentro da própria página.

   IMPORTANTE PARA A SEGURANÇA: nada aqui sai do navegador da
   cliente. O código do pagamento não é enviado para nenhum
   servidor de terceiros para virar imagem — é desenhado aqui.
   ============================================================ */

/* ============================================================
   1. BR CODE (Pix Copia e Cola)
   ============================================================ */
const Pix = {

  /* Monta um campo no formato EMV: ID + tamanho + valor */
  campo(id, valor) {
    const v = String(valor);
    return id + String(v.length).padStart(2, '0') + v;
  },

  /* Remove acentos e caracteres não aceitos pelo padrão */
  limpar(texto, tamanho) {
    return String(texto || '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^A-Za-z0-9 $%*+\-./:]/g, '')
      .trim()
      .slice(0, tamanho)
      .toUpperCase();
  },

  /* CRC16-CCITT (FALSE) — exigido no fim do BR Code */
  crc16(texto) {
    let crc = 0xFFFF;
    for (let i = 0; i < texto.length; i++) {
      crc ^= texto.charCodeAt(i) << 8;
      for (let b = 0; b < 8; b++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
        crc &= 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  },

  /* Gera o código completo.
     dados = { chave, nome, cidade, valor, identificador } */
  gerar(dados) {
    const chave = String(dados.chave || '').trim();
    const nome   = Pix.limpar(dados.nome, 25)   || 'LOJA';
    const cidade = Pix.limpar(dados.cidade, 15) || 'BRASIL';
    const txid   = Pix.limpar(dados.identificador, 25).replace(/[^A-Z0-9]/g, '') || '***';
    const valor  = Number(dados.valor || 0).toFixed(2);

    const conta =
      Pix.campo('00', 'BR.GOV.BCB.PIX') +
      Pix.campo('01', chave);

    let carga =
      Pix.campo('00', '01') +                       // versão do payload
      Pix.campo('01', '12') +                       // 12 = uso único
      Pix.campo('26', conta) +                      // conta do recebedor
      Pix.campo('52', '0000') +                     // categoria do comerciante
      Pix.campo('53', '986') +                      // moeda: real
      Pix.campo('54', valor) +                      // valor
      Pix.campo('58', 'BR') +                       // país
      Pix.campo('59', nome) +                       // recebedor
      Pix.campo('60', cidade) +                     // cidade
      Pix.campo('62', Pix.campo('05', txid));       // identificador do pedido

    carga += '6304';
    return carga + Pix.crc16(carga);
  },

  /* Verifica se a chave configurada parece válida antes de cobrar */
  chaveValida(chave) {
    const c = String(chave || '').trim();
    if (!c || c === '00000000000') return false;
    const digitos = c.replace(/\D/g, '');
    if (/^[0-9]{11}$/.test(digitos) && c === digitos) return true;          // CPF
    if (/^[0-9]{14}$/.test(digitos) && c === digitos) return true;          // CNPJ
    if (/^\+55[0-9]{10,11}$/.test(c)) return true;                          // telefone
    if (/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(c)) return true;               // e-mail
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(c)) return true; // aleatória
    return false;
  }
};


/* ============================================================
   2. QR CODE
   ------------------------------------------------------------
   Codificador próprio, modo byte, correção de erro nível M.
   Cobre versões 1 a 15, suficiente para qualquer código Pix.
   ============================================================ */
const QR = (function () {

  /* --- Aritmética de Galois (GF 256) --- */
  const EXP = new Array(256), LOG = new Array(256);
  (function () {
    for (let i = 0; i < 8; i++) EXP[i] = 1 << i;
    for (let i = 8; i < 256; i++)
      EXP[i] = EXP[i - 4] ^ EXP[i - 5] ^ EXP[i - 6] ^ EXP[i - 8];
    for (let i = 0; i < 255; i++) LOG[EXP[i]] = i;
  })();

  const gexp = (n) => { while (n < 0) n += 255; while (n >= 256) n -= 255; return EXP[n]; };
  const glog = (n) => LOG[n];

  function polMultiplicar(a, b) {
    const r = new Array(a.length + b.length - 1).fill(0);
    for (let i = 0; i < a.length; i++)
      for (let j = 0; j < b.length; j++)
        r[i + j] ^= gexp(glog(a[i]) + glog(b[j]));
    return r;
  }

  function polResto(num, div) {
    let n = num.slice();
    while (n.length - div.length >= 0 && n[0] !== 0) {
      const razao = glog(n[0]) - glog(div[0]);
      for (let i = 0; i < div.length; i++)
        n[i] ^= gexp(glog(div[i]) + razao);
      while (n.length && n[0] === 0) n.shift();
    }
    return n;
  }

  function polinomioCorrecao(grau) {
    let p = [1];
    for (let i = 0; i < grau; i++) p = polMultiplicar(p, [1, gexp(i)]);
    return p;
  }

  /* --- Blocos de correção, nível M, versões 1 a 15 ---
     [qtdBlocos, totalBytes, bytesDeDados, (repete)] */
  const BLOCOS = [
    [1, 26, 16],
    [1, 44, 28],
    [1, 70, 44],
    [2, 50, 32],
    [2, 64, 40],
    [4, 43, 27],
    [4, 49, 31],
    [2, 60, 38, 2, 61, 39],
    [3, 58, 36, 2, 59, 37],
    [4, 69, 43, 1, 70, 44],
    [1, 80, 50, 4, 81, 51],
    [6, 58, 36, 2, 59, 37],
    [8, 59, 37, 1, 60, 38],
    [4, 64, 40, 5, 65, 41],
    [5, 65, 41, 5, 66, 42]
  ];

  /* Posição dos padrões de alinhamento por versão */
  const ALINHAMENTO = [
    [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
    [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50],
    [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66],
    [6, 26, 48, 70]
  ];

  const G15 = 0b10100110111;
  const G18 = 0b1111100100101;
  const G15_MASCARA = 0b101010000010010;

  function bits(n) { let b = 0; while (n !== 0) { b++; n >>>= 1; } return b; }

  function infoBCH(dados) {
    let d = dados << 10;
    while (bits(d) - bits(G15) >= 0) d ^= G15 << (bits(d) - bits(G15));
    return ((dados << 10) | d) ^ G15_MASCARA;
  }

  function versaoBCH(dados) {
    let d = dados << 12;
    while (bits(d) - bits(G18) >= 0) d ^= G18 << (bits(d) - bits(G18));
    return (dados << 12) | d;
  }

  function mascara(padrao, i, j) {
    switch (padrao) {
      case 0: return (i + j) % 2 === 0;
      case 1: return i % 2 === 0;
      case 2: return j % 3 === 0;
      case 3: return (i + j) % 3 === 0;
      case 4: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
      case 5: return (i * j) % 2 + (i * j) % 3 === 0;
      case 6: return ((i * j) % 2 + (i * j) % 3) % 2 === 0;
      case 7: return ((i * j) % 3 + (i + j) % 2) % 2 === 0;
    }
    return false;
  }

  /* Penalidade — escolhe a máscara que gera o QR mais legível */
  function penalidade(m, n) {
    let p = 0;

    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++) {
        let iguais = -1;
        const cor = m[r][c];
        for (let dr = -1; dr <= 1; dr++) {
          if (r + dr < 0 || r + dr >= n) continue;
          for (let dc = -1; dc <= 1; dc++) {
            if (c + dc < 0 || c + dc >= n) continue;
            if (dr === 0 && dc === 0) continue;
            if (cor === m[r + dr][c + dc]) iguais++;
          }
        }
        if (iguais > 5) p += 3 + iguais - 5;
      }

    for (let r = 0; r < n - 1; r++)
      for (let c = 0; c < n - 1; c++) {
        let s = 0;
        if (m[r][c]) s++;
        if (m[r + 1][c]) s++;
        if (m[r][c + 1]) s++;
        if (m[r + 1][c + 1]) s++;
        if (s === 0 || s === 4) p += 3;
      }

    for (let r = 0; r < n; r++)
      for (let c = 0; c < n - 6; c++)
        if (m[r][c] && !m[r][c+1] && m[r][c+2] && m[r][c+3] && m[r][c+4] && !m[r][c+5] && m[r][c+6]) p += 40;

    for (let c = 0; c < n; c++)
      for (let r = 0; r < n - 6; r++)
        if (m[r][c] && !m[r+1][c] && m[r+2][c] && m[r+3][c] && m[r+4][c] && !m[r+5][c] && m[r+6][c]) p += 40;

    let escuros = 0;
    for (let c = 0; c < n; c++)
      for (let r = 0; r < n; r++) if (m[r][c]) escuros++;
    p += Math.abs(100 * escuros / (n * n) - 50) / 5 * 10;

    return p;
  }

  /* Buffer de bits */
  function Buffer() { this.b = []; this.tam = 0; }
  Buffer.prototype.push = function (bit) {
    const i = Math.floor(this.tam / 8);
    if (this.b.length <= i) this.b.push(0);
    if (bit) this.b[i] |= 0x80 >>> (this.tam % 8);
    this.tam++;
  };
  Buffer.prototype.put = function (n, len) {
    for (let i = 0; i < len; i++) this.push(((n >>> (len - i - 1)) & 1) === 1);
  };

  /* Monta os dados finais com correção de erro */
  function criarBytes(buffer, blocos) {
    let deslocDados = 0, deslocCorr = 0, maxDados = 0, maxCorr = 0;
    const dados = [], corr = [];

    for (let r = 0; r < blocos.length; r++) {
      const totalD = blocos[r].dados, totalC = blocos[r].total - totalD;
      maxDados = Math.max(maxDados, totalD);
      maxCorr  = Math.max(maxCorr, totalC);

      dados[r] = new Array(totalD);
      for (let i = 0; i < totalD; i++) dados[r][i] = 0xff & buffer.b[i + deslocDados];
      deslocDados += totalD;

      const pol = polinomioCorrecao(totalC);
      const bruto = dados[r].concat(new Array(pol.length - 1).fill(0));
      const resto = polResto(bruto, pol);

      corr[r] = new Array(pol.length - 1);
      for (let i = 0; i < corr[r].length; i++) {
        const idx = i + resto.length - corr[r].length;
        corr[r][i] = idx >= 0 ? resto[idx] : 0;
      }
      deslocCorr += totalC;
    }

    let total = 0;
    blocos.forEach(b => total += b.total);
    const saida = new Array(total);
    let k = 0;
    for (let i = 0; i < maxDados; i++)
      for (let r = 0; r < blocos.length; r++)
        if (i < dados[r].length) saida[k++] = dados[r][i];
    for (let i = 0; i < maxCorr; i++)
      for (let r = 0; r < blocos.length; r++)
        if (i < corr[r].length) saida[k++] = corr[r][i];
    return saida;
  }

  /* Constrói a matriz do QR */
  function construir(texto) {
    /* Converte para bytes UTF-8 */
    const bytes = [];
    for (const ch of unescape(encodeURIComponent(texto))) bytes.push(ch.charCodeAt(0));

    /* Escolhe a menor versão que comporta o conteúdo */
    let versao = 0, blocos = null;
    for (let v = 1; v <= BLOCOS.length; v++) {
      const linha = BLOCOS[v - 1];
      const lista = [];
      for (let i = 0; i < linha.length; i += 3)
        for (let j = 0; j < linha[i]; j++)
          lista.push({ total: linha[i + 1], dados: linha[i + 2] });
      const capacidade = lista.reduce((s, b) => s + b.dados, 0);
      const cabecalho = 4 + (v < 10 ? 8 : 16);
      if (bytes.length * 8 + cabecalho <= capacidade * 8) { versao = v; blocos = lista; break; }
    }
    if (!versao) throw new Error('Conteúdo grande demais para o QR Code');

    /* Bits de dados */
    const buf = new Buffer();
    buf.put(4, 4);                                   // modo byte
    buf.put(bytes.length, versao < 10 ? 8 : 16);     // tamanho
    bytes.forEach(b => buf.put(b, 8));

    const capacidadeBits = blocos.reduce((s, b) => s + b.dados, 0) * 8;
    if (buf.tam + 4 <= capacidadeBits) buf.put(0, 4);
    while (buf.tam % 8 !== 0) buf.push(false);
    while (buf.b.length < capacidadeBits / 8) {
      buf.b.push(0xEC);
      if (buf.b.length < capacidadeBits / 8) buf.b.push(0x11);
    }

    const dados = criarBytes(buf, blocos);
    const n = versao * 4 + 17;

    let melhor = null, melhorNota = Infinity;

    for (let padrao = 0; padrao < 8; padrao++) {
      const m = Array.from({ length: n }, () => new Array(n).fill(null));

      /* Padrões de posição (os três quadrados dos cantos) */
      [[0, 0], [n - 7, 0], [0, n - 7]].forEach(([lr, lc]) => {
        for (let r = -1; r <= 7; r++)
          for (let c = -1; c <= 7; c++) {
            if (lr + r < 0 || lr + r >= n || lc + c < 0 || lc + c >= n) continue;
            m[lr + r][lc + c] =
              (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
              (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
              (r >= 2 && r <= 4 && c >= 2 && c <= 4);
          }
      });

      /* Padrões de alinhamento */
      const pos = ALINHAMENTO[versao - 1];
      for (let i = 0; i < pos.length; i++)
        for (let j = 0; j < pos.length; j++) {
          const lr = pos[i], lc = pos[j];
          if (m[lr][lc] !== null) continue;
          for (let r = -2; r <= 2; r++)
            for (let c = -2; c <= 2; c++)
              m[lr + r][lc + c] =
                r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0);
        }

      /* Linhas de sincronismo */
      for (let r = 8; r < n - 8; r++) if (m[r][6] === null) m[r][6] = r % 2 === 0;
      for (let c = 8; c < n - 8; c++) if (m[6][c] === null) m[6][c] = c % 2 === 0;

      /* Informação de formato (nível M = 0b00) */
      const info = infoBCH((0b00 << 3) | padrao);
      for (let i = 0; i < 15; i++) {
        const bit = ((info >> i) & 1) === 1;
        if (i < 6) m[i][8] = bit;
        else if (i < 8) m[i + 1][8] = bit;
        else m[n - 15 + i][8] = bit;

        if (i < 8) m[8][n - i - 1] = bit;
        else if (i < 9) m[8][15 - i - 1 + 1] = bit;
        else m[8][15 - i - 1] = bit;
      }
      m[n - 8][8] = true;

      /* Informação de versão (a partir da versão 7) */
      if (versao >= 7) {
        const v = versaoBCH(versao);
        for (let i = 0; i < 18; i++) {
          const bit = ((v >> i) & 1) === 1;
          m[Math.floor(i / 3)][i % 3 + n - 8 - 3] = bit;
          m[i % 3 + n - 8 - 3][Math.floor(i / 3)] = bit;
        }
      }

      /* Distribui os dados em ziguezague */
      let inc = -1, linha = n - 1, bitIdx = 7, byteIdx = 0;
      for (let col = n - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        for (;;) {
          for (let c = 0; c < 2; c++) {
            if (m[linha][col - c] === null) {
              let escuro = false;
              if (byteIdx < dados.length)
                escuro = ((dados[byteIdx] >>> bitIdx) & 1) === 1;
              if (mascara(padrao, linha, col - c)) escuro = !escuro;
              m[linha][col - c] = escuro;
              bitIdx--;
              if (bitIdx === -1) { byteIdx++; bitIdx = 7; }
            }
          }
          linha += inc;
          if (linha < 0 || n <= linha) { linha -= inc; inc = -inc; break; }
        }
      }

      const nota = penalidade(m, n);
      if (nota < melhorNota) { melhorNota = nota; melhor = m; }
    }

    return { modulos: melhor, tamanho: n };
  }

  /* Desenha o QR em um elemento da página */
  function desenhar(destino, texto, opcoes) {
    const o = opcoes || {};
    const corEscura = o.escuro || '#0F2137';
    const corClara  = o.claro  || '#FFFFFF';
    const { modulos, tamanho } = construir(texto);

    const margem = 2;
    const total = tamanho + margem * 2;
    let caminho = '';
    for (let r = 0; r < tamanho; r++)
      for (let c = 0; c < tamanho; c++)
        if (modulos[r][c]) caminho += 'M' + (c + margem) + ',' + (r + margem) + 'h1v1h-1z';

    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + total + ' ' + total + '" ' +
      'shape-rendering="crispEdges" role="img" aria-label="QR Code do pagamento Pix">' +
      '<rect width="' + total + '" height="' + total + '" fill="' + corClara + '"/>' +
      '<path d="' + caminho + '" fill="' + corEscura + '"/></svg>';

    const el = typeof destino === 'string' ? document.querySelector(destino) : destino;
    if (el) el.innerHTML = svg;
    return svg;
  }

  return { construir, desenhar };
})();
