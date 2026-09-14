#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Shell comum das páginas: navegação única + âncoras determinísticas.

Roda como fase 2 do build, DEPOIS dos geradores de conteúdo, sobre todas as
páginas (inclusive as que ainda são HTML manual e o Bazar). É idempotente:
reaplicar não muda o resultado.

  1. SIDEBAR  — substitui o bloco <nav class="sidebar">…</nav> (ou o marcador
     <!--SIDEBAR-->) pelo conteúdo de partials/sidebar.html, com os href
     reescritos para o caminho relativo da página e .active na página atual.
     Fonte única: partials/sidebar.html. Não editar a nav dentro das páginas.

  2. WEBP     — <img src="…png"> passa a apontar para o .webp gerado por
     tools/gerar_webp.py, quando ele existe. Os templates seguem escrevendo
     .png (a fonte que o Pedro substitui à mão).

  3. ÂNCORAS   — dá a cada <h2>/<h3> do .main-content um id derivado do texto
     (slug estável: "Custo Base" -> id="custo-base"). Substitui os sec-0/sec-1
     que o js/utils.js inventava em runtime, que mudavam de alvo a cada
     reordenação e não existiam no HTML servido (CLAUDE.md §10).
     Títulos que já têm id são preservados; colisões ganham sufixo -2, -3…
"""
import os, re, sys, unicodedata

TOOLS = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(TOOLS)

RE_NAV = re.compile(r'[ \t]*<nav class="sidebar">.*?</nav>', re.S)
RE_MARCADOR = re.compile(r'[ \t]*<!--SIDEBAR-->')
RE_MAIN = re.compile(r'<main class="main-content[^"]*">.*?</main>', re.S)
RE_TITULO = re.compile(r'<(h[23])(\s[^>]*)?>(.*?)</\1>', re.S)


def slugify(txt):
    """Texto visível de um título -> slug ASCII estável."""
    txt = re.sub(r'<[^>]+>', ' ', txt)                       # tira tags internas
    txt = unicodedata.normalize('NFKD', txt)
    txt = ''.join(c for c in txt if not unicodedata.combining(c))
    txt = ''.join(c for c in txt if unicodedata.category(c)[0] in 'LN' or c in ' -_')
    txt = re.sub(r'[\s_]+', '-', txt.strip().lower())
    txt = re.sub(r'-{2,}', '-', txt).strip('-')
    return txt


def carrega_sidebar():
    bruto = open(os.path.join(RAIZ, 'partials', 'sidebar.html'),
                 encoding='utf-8', newline='').read()
    return RE_NAV.search(bruto).group(0)


def sidebar_para(pagina_rel, modelo):
    """Renderiza a nav para uma página (caminho relativo à raiz do repo)."""
    base = os.path.dirname(pagina_rel)

    def refaz(m):
        href, resto = m.group(1), m.group(2)
        rel = os.path.relpath(href, base).replace(os.sep, '/') if base else href
        ativo = os.path.normpath(href) == os.path.normpath(pagina_rel)
        if ativo and 'nav-link' in resto and 'active' not in resto:
            resto = resto.replace('class="nav-link', 'class="nav-link active', 1)
        elif not ativo:
            resto = resto.replace('nav-link active', 'nav-link')
        return f'<a href="{rel}"{resto}'

    return re.sub(r'<a href="([^"]+)"([^>]*)', refaz, modelo)


def aplica_sidebar(html, pagina_rel, modelo):
    nav = sidebar_para(pagina_rel, modelo)
    if RE_NAV.search(html):
        return RE_NAV.sub(lambda _: nav, html, count=1)
    if RE_MARCADOR.search(html):
        return RE_MARCADOR.sub(lambda _: nav, html, count=1)
    return html


def aplica_ancoras(html):
    """Injeta id= determinístico nos h2/h3 do conteúdo principal."""
    m = RE_MAIN.search(html)
    if not m:
        return html
    usados = set(re.findall(r'\bid="([^"]+)"', html))
    secao = ['']   # último h2 visto: dá escopo aos h3 ("Tier 1" -> "ramo-X-tier-1")

    def marca(t):
        tag, attrs, corpo = t.group(1), t.group(2) or '', t.group(3)
        base = slugify(corpo)
        if tag == 'h2':
            secao[0] = base
        if 'id=' in attrs or not base:
            return t.group(0)
        if tag == 'h3' and secao[0] and not base.startswith(secao[0]):
            base = f'{secao[0]}-{base}'
        sl, n = base, 2
        while sl in usados:
            sl = f'{base}-{n}'
            n += 1
        usados.add(sl)
        return f'<{tag} id="{sl}"{attrs}>{corpo}</{tag}>'

    return html[:m.start()] + RE_TITULO.sub(marca, m.group(0)) + html[m.end():]


RE_IMG = re.compile(r'(<img\b[^>]*\bsrc=")([^"]+\.(?:png|jpg|jpeg))(")', re.I)


def aplica_webp(html, pagina_rel):
    """Aponta cada <img> para o .webp equivalente, quando ele existe.

    Os templates continuam escrevendo .png (a fonte); a troca é de build. Se
    uma imagem ainda não tem .webp gerado, o .png é mantido — nada quebra.
    """
    base = os.path.dirname(os.path.join(RAIZ, pagina_rel))

    def troca(m):
        webp = os.path.splitext(m.group(2))[0] + '.webp'
        return m.group(1) + webp + m.group(3) if os.path.exists(
            os.path.normpath(os.path.join(base, webp))) else m.group(0)

    return RE_IMG.sub(troca, html)


def paginas(raiz):
    fs = []
    for dirpath, _, nomes in os.walk(os.path.join(raiz, 'pages')):
        fs += [os.path.join(dirpath, n) for n in nomes if n.endswith('.html')]
    idx = os.path.join(raiz, 'index.html')
    if os.path.exists(idx):
        fs.append(idx)
    return sorted(fs)


def aplicar(raiz=RAIZ, verboso=True):
    modelo = carrega_sidebar()
    n_nav = n_anc = 0
    for f in paginas(raiz):
        rel = os.path.relpath(f, raiz).replace(os.sep, '/')
        antes = open(f, encoding='utf-8', newline='').read()
        depois = aplica_webp(aplica_ancoras(aplica_sidebar(antes, rel, modelo)), rel)
        if depois != antes:
            open(f, 'w', encoding='utf-8', newline='').write(depois)
            n_nav += 1
        n_anc += len(re.findall(r'<h[23] id="', depois))
    if verboso:
        print(f'    shell aplicado: {len(paginas(raiz))} páginas '
              f'({n_nav} alteradas, {n_anc} âncoras estáveis)')
    return n_nav


if __name__ == '__main__':
    aplicar(sys.argv[1] if len(sys.argv) > 1 else RAIZ)
