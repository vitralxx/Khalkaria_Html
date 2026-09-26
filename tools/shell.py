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
     O id de título é sempre recalculado; colisões ganham sufixo -2, -3…

  4. VERSÃO    — todo <script src> e <link href> LOCAL (js/, css/) ganha
     ?v=<hash do conteúdo de js/*.js e css/*.css>. O GitHub Pages manda cache de
     10 min e, sem versão na URL, o navegador servia um ficha.js ANTIGO nas
     páginas fora do Bazar depois de um deploy (a window.KF sumia). O js/main.js
     repassa a mesma versão ao ficha.js que ele injeta.

  5. TOTAIS    — <span data-bazar-total> recebe a contagem de data/bazar.json.

  6. BOOT      — partials/head-boot.html (<script data-nav-boot>) antes de
     </head>: aplica o estado salvo da nav (trilho, grupos fechados) no <html>
     antes do primeiro paint, sem piscar.

  7. NAV.JS    — <script src="…js/nav.js" data-nav-js> antes de </body> em
     todas as páginas (inclusive o Bazar, que não carrega main.js).

  A nav marcada: o link da página atual ganha .active E aria-current="page".
  Os passos 6 e 7 rodam antes do 4, para o nav.js receber ?v= também.
"""
import hashlib, os, re, sys, unicodedata

TOOLS = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(TOOLS)

RE_NAV = re.compile(r'[ \t]*<nav class="sidebar"[^>]*>.*?</nav>', re.S)
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
        # o modelo nunca traz .active nem aria-current; o logo (sem nav-link)
        # nunca ganha aria-current, então a página tem exatamente um
        resto = resto.replace(' aria-current="page"', '').replace('nav-link active', 'nav-link')
        if ativo and 'nav-link' in resto:
            resto = resto.replace('class="nav-link', 'aria-current="page" class="nav-link active', 1)
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
    # O id de h2/h3 pertence ao build: é sempre recalculado, nunca preservado.
    # Se fosse preservado, uma página já construída congelaria ids de uma regra
    # antiga enquanto as regeneradas usariam a nova — foi o que aconteceu com
    # sistema.html antes de ele virar artefato. Nenhum h2/h3 do site tem id
    # escrito à mão, então não há o que proteger.
    corpo_main = RE_TITULO.sub(lambda t: re.sub(r'\s+id="[^"]*"', '', t.group(0), count=1),
                               m.group(0))
    usados = set(re.findall(r'(?<![\w-])id="([^"]+)"', html[:m.start()] + corpo_main + html[m.end():]))
    secao = ['']   # último h2 visto: dá escopo aos h3 ("Tier 1" -> "ramo-X-tier-1")

    def marca(t):
        tag, attrs, corpo = t.group(1), t.group(2) or '', t.group(3)
        base = slugify(corpo)
        if tag == 'h2':
            secao[0] = base
        if not base:
            return t.group(0)
        if tag == 'h3' and secao[0] and not base.startswith(secao[0]):
            base = f'{secao[0]}-{base}'
        sl, n = base, 2
        while sl in usados:
            sl = f'{base}-{n}'
            n += 1
        usados.add(sl)
        return f'<{tag} id="{sl}"{attrs}>{corpo}</{tag}>'

    return html[:m.start()] + RE_TITULO.sub(marca, corpo_main) + html[m.end():]


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


RE_ASSET = re.compile(
    r'(<(?:script\b[^>]*\bsrc|link\b[^>]*\bhref)=")'        # abertura até o valor
    r'((?:\.\./)*(?:js|css)/[^"?#]+\.(?:js|css))'           # só caminho LOCAL relativo
    r'(?:\?v=[^"#]*)?'                                       # versão anterior, se houver
    r'(")', re.I)


def versao_assets(raiz=RAIZ):
    """8 hex do sha1 de js/*.js + css/*.css, com CRLF normalizado para LF (o
    mesmo commit dá a mesma versão em qualquer checkout)."""
    h = hashlib.sha1()
    for pasta, ext in (('js', '.js'), ('css', '.css')):
        base = os.path.join(raiz, pasta)
        for nome in sorted(os.listdir(base)) if os.path.isdir(base) else []:
            if nome.endswith(ext):
                h.update(nome.encode('utf-8'))
                h.update(open(os.path.join(base, nome), 'rb').read().replace(b'\r\n', b'\n'))
    return h.hexdigest()[:8]


def aplica_versao(html, versao):
    return RE_ASSET.sub(lambda m: m.group(1) + m.group(2) + '?v=' + versao + m.group(3), html)


# 5. TOTAIS — números que vêm dos dados, nunca digitados: <span data-bazar-total>
#    recebe a contagem do data/bazar.json (o index.html dizia "581 itens" com 727).
RE_TOTAL_BAZAR = re.compile(r'(<span data-bazar-total>)[^<]*(</span>)')


def total_bazar(raiz=RAIZ):
    import json
    p = os.path.join(raiz, 'data', 'bazar.json')
    try:
        return len(json.load(open(p, encoding='utf-8')))
    except (OSError, ValueError):
        return None


def aplica_totais(html, total):
    if total is None:
        return html
    return RE_TOTAL_BAZAR.sub(lambda m: m.group(1) + str(total) + m.group(2), html)


# 6. BOOT DA NAV — partials/head-boot.html antes de </head>: lê o estado salvo
#    (trilho, grupos fechados) e marca o <html> ANTES do primeiro paint. Sem
#    ele a nav piscaria aberta a cada troca de página com o trilho salvo.
RE_BOOT = re.compile(r'[ \t]*<script data-nav-boot>.*?</script>\n?', re.S)


def carrega_boot():
    return open(os.path.join(RAIZ, 'partials', 'head-boot.html'),
                encoding='utf-8', newline='').read().strip()


def aplica_boot(html, boot):
    html = RE_BOOT.sub('', html)
    return html.replace('</head>', f'    {boot}\n</head>', 1)


# 7. NAV.JS — js/nav.js antes de </body> em TODAS as páginas (recolher, grupos,
#    dica, atalho e menu mobile). Fica fora do main.js porque o Bazar não carrega
#    main.js (que injetaria o ficha.js uma segunda vez).
RE_NAVJS = re.compile(r'[ \t]*<script src="[^"]*js/nav\.js[^"]*" data-nav-js></script>\n?')


def aplica_navjs(html, pagina_rel):
    prefixo = '../' * pagina_rel.count('/')
    html = RE_NAVJS.sub('', html)
    return html.replace('</body>',
                        f'    <script src="{prefixo}js/nav.js" data-nav-js></script>\n</body>', 1)


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
    boot = carrega_boot()
    # a versão vem SEMPRE dos assets do repo real (o round-trip do validar.py
    # roda numa cópia temporária sem js/ e css/, e precisa dar o mesmo hash)
    versao = versao_assets(RAIZ)
    total = total_bazar(RAIZ)
    n_nav = n_anc = n_ver = 0
    for f in paginas(raiz):
        rel = os.path.relpath(f, raiz).replace(os.sep, '/')
        antes = open(f, encoding='utf-8', newline='').read()
        depois = aplica_webp(aplica_ancoras(aplica_sidebar(antes, rel, modelo)), rel)
        # boot e nav.js ANTES da versão, para o nav.js ganhar ?v= também
        depois = aplica_navjs(aplica_boot(depois, boot), rel)
        depois = aplica_totais(aplica_versao(depois, versao), total)
        n_ver += len(RE_ASSET.findall(depois))
        if depois != antes:
            open(f, 'w', encoding='utf-8', newline='').write(depois)
            n_nav += 1
        n_anc += len(re.findall(r'<h[23] id="', depois))
    if verboso:
        print(f'    shell aplicado: {len(paginas(raiz))} páginas '
              f'({n_nav} alteradas, {n_anc} âncoras estáveis, {n_ver} assets em ?v={versao})')
    return n_nav


if __name__ == '__main__':
    aplicar(sys.argv[1] if len(sys.argv) > 1 else RAIZ)
