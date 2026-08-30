# -*- coding: utf-8 -*-
"""
DUO JEANS - trocar o endereco do site em todos os arquivos de uma vez.

Quando a loja mudar de endereco (por exemplo do GitHub Pages para o
dominio proprio), rode:

    python trocar-dominio.py https://duojeans.com.br

Isso atualiza o link que aparece no preview do WhatsApp e do Instagram
(og:url e og:image), o canonical de cada pagina, o sitemap.xml e o
robots.txt. Sem isso, o preview continua apontando para o endereco antigo.

Rode "python trocar-dominio.py" sozinho para so ver qual e o endereco atual.
"""
import glob
import io
import re
import sys

ARQUIVOS = sorted(glob.glob('*.html')) + ['sitemap.xml', 'robots.txt']

# Qualquer endereco absoluto que aponte para a propria loja.
PADRAO = re.compile(
    r'https://(?:emvixcomercio-creator\.github\.io/duo-jeans|'
    r'duojeans\.com\.br|www\.duojeans\.com\.br|'
    r'[a-z0-9-]+\.netlify\.app)'
)


def endereco_atual():
    for nome in ARQUIVOS:
        try:
            with io.open(nome, encoding='utf-8') as f:
                achado = PADRAO.search(f.read())
        except IOError:
            continue
        if achado:
            return achado.group(0)
    return None


def trocar(novo):
    novo = novo.rstrip('/')
    if not novo.startswith('https://'):
        sys.exit('ERRO: o endereco precisa comecar com https://  (recebi: %s)' % novo)

    total = 0
    for nome in ARQUIVOS:
        try:
            with io.open(nome, encoding='utf-8') as f:
                texto = f.read()
        except IOError:
            continue

        trocado, quantos = PADRAO.subn(novo, texto)
        if quantos:
            with io.open(nome, 'w', encoding='utf-8', newline='') as f:
                f.write(trocado)
            print('  %-20s %d troca(s)' % (nome, quantos))
            total += quantos

    if not total:
        sys.exit('Nada foi trocado. O site ja usa esse endereco?')

    print('\nPronto: %d troca(s). Agora publique:' % total)
    print('  git add -A && git commit -m "Novo endereco do site" && git push origin master')
    print('\nDepois limpe o cache do preview do WhatsApp e do Facebook em:')
    print('  https://developers.facebook.com/tools/debug/')


if __name__ == '__main__':
    atual = endereco_atual()
    if len(sys.argv) < 2:
        print('Endereco atual do site: %s' % (atual or '(nenhum encontrado)'))
        print('\nPara trocar:  python trocar-dominio.py https://duojeans.com.br')
    else:
        print('Trocando %s  ->  %s\n' % (atual or '?', sys.argv[1].rstrip('/')))
        trocar(sys.argv[1])
