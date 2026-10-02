#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Gerador da página da ficha (F4.3): templates/ficha.template.html -> pages/ficha.html
# NÃO editar pages/ficha.html à mão: é artefato (a fase 2, tools/shell.py, põe a
# navegação, o boot, o kh-ui.js, o nav.js e o ?v= de cada asset).
#
# A página não tem conteúdo canônico próprio: tudo o que ela mostra vem da ficha
# do jogador (localStorage), calculado no navegador pelo motor (js/ficha.js) e
# desenhado pelo js/ficha-pagina.js. O gerador só confere o contrato do template
# antes de gravar, para uma edição dele não quebrar a página em silêncio:
#   - o marcador <!--SIDEBAR--> (a nav vem do partials/sidebar.html);
#   - o contêiner #fp com data-kf-ignorar e o aviso [data-sem-previa];
#   - js/ficha.js antes de js/ficha-pagina.js (o da página usa o KhPrevia, o
#     KhRegras, o KhConta e a KF), sem js/main.js (que injetaria o ficha.js de novo);
#   - css/ficha-pagina.css.
# Uso: python gerar_ficha.py [repo_root]
import os, re, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = sys.argv[1] if len(sys.argv) > 1 else RAIZ
TPL = os.path.join(REPO, 'templates', 'ficha.template.html')
OUT = os.path.join(REPO, 'pages', 'ficha.html')


def confere(page):
    probs = []
    if '<!--SIDEBAR-->' not in page:
        probs.append('sem o marcador <!--SIDEBAR-->')
    if not re.search(r'<div class="fp" id="fp" data-kf-ignorar>', page):
        probs.append('sem <div class="fp" id="fp" data-kf-ignorar>')
    if 'data-sem-previa' not in page:
        probs.append('sem o aviso [data-sem-previa]')
    scripts = re.findall(r'<script src="\.\./js/([^"?]+)', page)
    if scripts != ['ficha.js', 'ficha-pagina.js']:
        probs.append(f'scripts locais {scripts} (esperado ficha.js e depois ficha-pagina.js, sem main.js)')
    if '../css/ficha-pagina.css' not in page:
        probs.append('sem o <link> do css/ficha-pagina.css')
    if '{{' in page:
        probs.append('placeholder {{…}} sem preencher')
    return probs


def main():
    page = open(TPL, encoding='utf-8', newline='').read()
    probs = confere(page)
    if probs:
        raise SystemExit('templates/ficha.template.html: ' + '; '.join(probs))
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, 'w', encoding='utf-8', newline='').write(page)
    print(f'ficha.html gerado (casca da F4.3; o conteúdo é desenhado no navegador) -> {OUT}')


if __name__ == '__main__':
    main()
