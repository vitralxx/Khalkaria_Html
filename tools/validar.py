#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Validador estrutural do site Khalkaria — método §6 do CLAUDE.md automatizado.

Não valida CONTEÚDO canônico (isso é a sincronização com o Notion). Valida a
integridade do artefato HTML, que é o que quebra em silêncio:

  1. Stack de tags balanceado (html.parser)
  2. Âncoras href="#x" -> existe id="x" na mesma página
  3. IDs duplicados
  4. Links e assets locais (href/src) apontando para arquivo existente
  5. Round-trip: regenerar de data/*.json bate byte-a-byte com pages/*.html
     (prova que nenhum HTML gerado foi editado à mão — CLAUDE.md §4/§10)
  6. Sidebar: todas as páginas com o mesmo conjunto de links de navegação;
     página sem <nav class="sidebar"> é FALHA. E o contrato da nav: 1 boot no
     <head>, 1 js/nav.js, 1 aria-current="page", todo glifo nv-* com seu
     <symbol> e todo .nav-link com rótulo .nav-rot (o trilho o esconde por clip)
  7. Guarda-fio: as 5 frases de peso do Sistema que o motor de carga codifica
  8. data/bazar.json é ARRAY e todo item traz `inv`
  9. Guarda-fio: os blocos decididos D80–D82 (modificador, vantagem/
     desvantagem, custo mínimo de magia), D8b/D8c (reação Defender, Evasão
     Ativa) e D30 (faixa 8–18) continuam em data/sistema.json
 10. Id de card de classe = '<classe>-' + slug do nome, sem duplicata
 [ids]        F1a: id de entidade único no site todo; data-kf-tipo/-id de cada
              card das páginas == catálogo (data/catalogo/*.json) por conjunto,
              data-prever = tipo:id, botão .ent-add/.ent-alca nascendo hidden;
              tools/alias_ids.json aponta só para id existente
 [fragmentos] link para outra página (pagina.html#x): o id x existe lá; rota
              do Bazar (bazar.html#item/<id>): o id existe no data/bazar.json
 [glifos]     sprite partials/glifos.html íntegro (g-*, viewBox, sem
              duplicata, um glifo por ramo --ramo-*) e todo <use href="#g-*">
              de página ou de js/*.js com o seu <symbol>
 [componentes] contagem das classes CSS de componente (companion-card,
              d100-table, sub-ability...) em cada pages/classes/*.html >= o
              tools/componentes-baseline.json. Um sync que troque componente
              por <ul> genérico derruba o build; queda legítima (o Notion tirou
              o conteúdo) só passa regravando o baseline de propósito

Uso:
  python validar.py [repo_root]
  python validar.py . --skip-roundtrip
  python validar.py . --atualizar-componentes   # regrava o baseline e valida
Saída: exit 0 = tudo OK; exit 1 = há falhas.
"""
import os, re, sys, json, glob, shutil, filecmp, subprocess, tempfile
import shell
from kf_marca import NAO_ENTIDADE
from html.parser import HTMLParser

TOOLS = os.path.dirname(os.path.abspath(__file__))
ROOT = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else os.path.dirname(TOOLS)
FLAGS = {a for a in sys.argv[1:] if a.startswith('--')}
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
        'meta', 'param', 'source', 'track', 'wbr'}

# páginas geradas por gerador -> script que as produz (para o round-trip)
GERADORES = ['gerar_sistema.py', 'gerar_magias.py', 'gerar_condicoes.py', 'gerar_limiar.py',
             'gerar_classes.py', 'gerar_racas.py', 'gerar_origens.py', 'gerar_catalogo.py']
# O Bazar entra no build padrão, mas não no round-trip: o gerador dele lê o CSV
# e grava data/bazar.json na raiz do repo (não recebe repo_root), então
# regenerá-lo aqui sobrescreveria o artefato real. A integridade do bazar.json
# é checada em checa_bazar_inv().
FORA_ROUNDTRIP = {'pages/bazar.html'}

falhas = []


def rel(p, root=None):
    try:
        return os.path.relpath(p, root or ROOT).replace(os.sep, '/')
    except ValueError:                      # outro drive no Windows (testes em %TEMP%)
        return p.replace(os.sep, '/')


def paginas(root=None):
    root = root or ROOT
    fs = sorted(glob.glob(os.path.join(root, 'pages', '**', '*.html'), recursive=True))
    idx = os.path.join(root, 'index.html')
    if os.path.exists(idx):
        fs.append(idx)
    return fs


class Stack(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.pilha, self.erros = [], []

    def handle_starttag(self, tag, attrs):
        if tag not in VOID:
            self.pilha.append((tag, self.getpos()))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.pilha:
            self.erros.append(f'</{tag}> sem abertura na linha {self.getpos()[0]}')
            return
        if self.pilha[-1][0] == tag:
            self.pilha.pop()
            return
        for i in range(len(self.pilha) - 1, -1, -1):
            if self.pilha[i][0] == tag:
                for t, pos in self.pilha[i + 1:]:
                    self.erros.append(f'<{t}> aberta na linha {pos[0]} nunca fechada')
                del self.pilha[i:]
                return
        self.erros.append(f'</{tag}> órfã na linha {self.getpos()[0]}')


def checa_html():
    print('[1-4] Integridade do HTML')
    for f in paginas():
        h = open(f, encoding='utf-8').read()
        probs = []

        p = Stack(); p.feed(h)
        probs += p.erros + [f'<{t}> aberta na linha {pos[0]} nunca fechada'
                            for t, pos in p.pilha]

        ids = re.findall(r'(?<![\w-])id="([^"]+)"', h)
        dup = sorted({i for i in ids if ids.count(i) > 1})
        if dup:
            probs.append(f'ids duplicados: {dup}')

        quebradas = sorted({a for a in re.findall(r'href="#([^"]+)"', h)
                            if a and a not in set(ids)})
        if quebradas:
            probs.append(f'âncoras sem destino: {quebradas}')

        base = os.path.dirname(f)
        faltando = set()
        for url in re.findall(r'(?:href|src)="([^"]+)"', h):
            if url.startswith(('http', 'mailto:', 'data:', '//', '#')):
                continue
            alvo = url.split('#')[0].split('?')[0]
            if alvo and not os.path.exists(os.path.normpath(os.path.join(base, alvo))):
                faltando.add(url)
        if faltando:
            probs.append(f'links/assets inexistentes: {sorted(faltando)}')

        if probs:
            falhas.append(rel(f))
            print(f'  FALHA  {rel(f)}')
            for x in probs:
                print(f'         - {x}')
    if not falhas:
        print(f'  OK     {len(paginas())} páginas íntegras')


def checa_nav_pagina(h, nav):
    """Contrato da nav (shell.py passos 1, 6 e 7) numa página já montada."""
    probs = []
    for marca, oque in (('data-nav-boot', 'boot da nav no <head>'),
                        ('data-nav-js', '<script> do js/nav.js')):
        n = h.count(marca)
        if n != 1:
            probs.append(f'{n}× {oque} (esperado 1)')
    n = nav.count('aria-current="page"')
    if n != 1:
        probs.append(f'{n}× aria-current="page" na nav (esperado 1)')
    simbolos = set(re.findall(r'<symbol id="([^"]+)"', h))
    sem = sorted({u for u in re.findall(r'<use href="#(nv-[^"]+)"', nav) if u not in simbolos})
    if sem:
        probs.append(f'glifos sem <symbol>: {sem}')
    for a in re.findall(r'<a href="[^"]+"[^>]*class="nav-link[^"]*"[^>]*>.*?</a>', nav, re.S):
        rot = re.search(r'<span class="nav-rot">([^<]*)</span>', a)
        if not (rot and rot.group(1).strip()):
            probs.append(f'link sem rótulo .nav-rot: {re.sub(r"<[^>]+>", "", a).strip()[:40]!r}')
    return probs


def checa_sidebar():
    print('[6] Consistência da navegação (sidebar)')
    conjuntos = {}
    for f in paginas():
        h = open(f, encoding='utf-8').read()
        m = re.search(r'<nav class="sidebar".*?</nav>', h, re.S)
        if not m:
            # página publicada sem navegação = gerador rodou fora do build.py
            falhas.append(f'sidebar:{rel(f)}')
            print(f'  FALHA  {rel(f)}: sem <nav class="sidebar"> (rode python tools/build.py)')
            continue
        # normaliza: resolve o href para caminho absoluto no repo (o prefixo
        # relativo muda por profundidade) e ignora a classe .active
        probs = checa_nav_pagina(h, m.group(0))
        if probs:
            falhas.append(f'nav:{rel(f)}')
            for x in probs:
                print(f'  FALHA  {rel(f)}: {x}')
        base = os.path.dirname(f)
        links = set()
        for href, txt in re.findall(r'<a href="([^"]+)"[^>]*>(.*?)</a>', m.group(0), re.S):
            alvo = os.path.normpath(os.path.join(base, href.split('#')[0]))
            links.add((rel(alvo), re.sub(r'\s+', ' ', txt).strip()))
        conjuntos[rel(f)] = links
    if not conjuntos:
        return
    ref = max(conjuntos.values(), key=len)
    divergentes = {k: v for k, v in conjuntos.items() if v != ref}
    if divergentes:
        falhas.append('sidebar')
        for k, v in divergentes.items():
            print(f'  FALHA  {k}: falta {sorted(x[1] for x in ref - v)} | extra {sorted(x[1] for x in v - ref)}')
    else:
        print(f'  OK     {len(conjuntos)} sidebars com os mesmos {len(ref)} links')


# Regras de peso que o motor de carga (KhInv, js/ficha.js) implementa. Se o
# Notion reescrever qualquer uma, o sync muda data/sistema.json e esta checagem
# acusa: é o aviso de que o motor e os testes precisam ser revistos junto.
FRASES_INVENTARIO = [
    '2+Mod. Força (Min. 1) Equipamentos, itens equipados não contam',
    '10+Mod. Força (Min. 1) Bugigangas',
    'Itens leves contam como 1 bugiganga a cada 10 unidades',
    'Acima do peso máximo, porém menos que o dobro',
    'Igual ou mais que o dobro do peso máximo',
]


def _textos_html(o):
    """Todos os campos "html" de um JSON, em ordem de documento."""
    if isinstance(o, dict):
        for k, v in o.items():
            if k == 'html' and isinstance(v, str):
                yield v
            else:
                yield from _textos_html(v)
    elif isinstance(o, list):
        for v in o:
            yield from _textos_html(v)


def checa_regras_inventario(root=None):
    """[7] Guarda-fio: as 5 frases do Sistema que o motor de carga codifica."""
    root = root or ROOT
    print('[7] Guarda-fio das regras de inventário (data/sistema.json)')
    f = os.path.join(root, 'data', 'sistema.json')
    try:
        dados = json.load(open(f, encoding='utf-8'))
    except (OSError, ValueError) as e:
        falhas.append('regras-inventario')
        print(f'  FALHA  data/sistema.json ilegível: {e}')
        return
    texto = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', ' '.join(_textos_html(dados))))
    faltam = [fr for fr in FRASES_INVENTARIO if fr not in texto]
    if faltam:
        falhas.append('regras-inventario')
        for fr in faltam:
            print(f'  FALHA  frase sumiu do Sistema: "{fr}" (o motor de carga precisa ser revisto)')
    else:
        print(f'  OK     {len(FRASES_INVENTARIO)} frases de peso presentes')


# Blocos que o Pedro decidiu (D80–D82, D8b/D8c, D30) e gravou na página Sistema do Notion; a
# ficha (motor de regras) conta com eles. Se um sync apagar ou reescrever algum,
# o build falha e o motor tem de ser revisto junto. Frases verbatim do Notion.
BLOCOS_SISTEMA = {
    'D80 modificador de atributo': [
        'Modificador de Atributo:',
        'Subtraia 10 do atributo e divida por 2, arredondando para baixo',
    ],
    'D81 vantagem/desvantagem': [
        'Vantagem: Role 2d20 e use o maior resultado.',
        'Desvantagem: Role 2d20 e use o menor resultado.',
        'Vantagem e desvantagem não se acumulam',
        'elas se anulam e você rola normalmente',
        'Crítico e falha crítica valem para o dado que você usou.',
        'que usa dado próprio, role esse dado duas vezes',
    ],
    'D82 custo mínimo de magia': [
        'toda conjuração custa no mínimo 1 Éter',
        'As exceções são a magia de Nível 1 conjurada em intensidade Normal e sem modulação e as Magias Pactuadas do Teurgo conjuradas em intensidade Contida, que custam 0 Éter.',
        'Magias de Nível 1 não possuem a intensidade Contida.',
    ],
    'D8b/D8c reação Defender e Evasão Ativa': [
        'Soma o dado da perícia Defender à sua evasão contra todos os ataques do agressor neste turno.',
        'Ataques de outros agressores continuam contra a sua Evasão Passiva.',
        'O dado não soma atributo: a Destreza já está na Evasão Passiva.',
    ],
    'D30 faixa 8-18 na criação': [
        'Se a soma de uma rolagem der menos de 8, role os 4 dados novamente: por isso cada valor fica entre 8 e 18.',
    ],
}


def checa_blocos_sistema(root=None):
    """[9] Guarda-fio: os blocos decididos do Sistema (snapshot por frase)."""
    root = root or ROOT
    print('[9] Guarda-fio dos blocos decididos (data/sistema.json)')
    f = os.path.join(root, 'data', 'sistema.json')
    try:
        dados = json.load(open(f, encoding='utf-8'))
    except (OSError, ValueError) as e:
        falhas.append('blocos-sistema')
        print(f'  FALHA  data/sistema.json ilegível: {e}')
        return
    texto = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', ' '.join(_textos_html(dados))))
    texto = re.sub(r' ([:.,])', r'\1', texto)   # "<strong>X</strong>:" vira "X :" ao tirar as tags
    ruins = 0
    for bloco, frases in BLOCOS_SISTEMA.items():
        faltam = [fr for fr in frases if fr not in texto]
        for fr in faltam:
            print(f'  FALHA  {bloco}: frase sumiu: "{fr}"')
        ruins += bool(faltam)
    if ruins:
        falhas.append('blocos-sistema')
    else:
        print(f'  OK     {len(BLOCOS_SISTEMA)} blocos presentes')


def checa_ids_classes(root=None):
    """[10] Id de card de classe = '<classe>-' + slug do nome (sem emoji), único.

    O id é o que a ficha vai guardar (convenção `<classe>-*`): derivado do nome,
    estável entre builds, nunca herdado de um nome antigo do card."""
    root = root or ROOT
    print('[10] Ids dos cards de classe (data/classes/*.json)')
    vistos, ruins = {}, []
    arquivos = sorted(glob.glob(os.path.join(root, 'data', 'classes', '*.json')))
    for f in arquivos:
        classe = os.path.basename(f)[:-5]
        try:
            cards = json.load(open(f, encoding='utf-8'))['cards']
        except (OSError, ValueError, KeyError) as e:
            ruins.append(f'{rel(f)} ilegível: {e}')
            continue
        for c in cards:
            esperado = f'{classe}-{shell.slugify(c.get("nome", ""))}'
            if c.get('id') != esperado:
                ruins.append(f'{classe}: "{c.get("nome")}" tem id {c.get("id")!r}, esperado {esperado!r}')
            if c.get('id') in vistos:
                ruins.append(f'id duplicado {c.get("id")!r} ({vistos[c["id"]]} e {classe})')
            vistos[c.get('id')] = classe
    if ruins:
        falhas.append('ids-classes')
        for r in ruins:
            print(f'  FALHA  {r}')
    else:
        print(f'  OK     {len(vistos)} ids derivados do nome, sem duplicata')


# ---------------------------------------------------------------- F1a
RE_ID = re.compile(r'(?<![\w-])id="([^"]+)"')


def _catalogo(root):
    """{(tipo, id)} de data/catalogo/*.json; devolve (entradas, problemas)."""
    ents, probs = [], []
    for f in sorted(glob.glob(os.path.join(root, 'data', 'catalogo', '*.json'))):
        try:
            doc = json.load(open(f, encoding='utf-8'))
        except (OSError, ValueError) as e:
            probs.append(f'{rel(f, root)} ilegível: {e}')
            continue
        for e in doc.get('entradas', []):
            ents.append((e.get('tipo'), e.get('id')))
    if not ents:
        probs.append('data/catalogo/ vazio (rode python tools/build.py)')
    return ents, probs


def _ids_bazar(root):
    try:
        return [i['id'] for i in json.load(open(os.path.join(root, 'data', 'bazar.json'), encoding='utf-8'))]
    except (OSError, ValueError, KeyError, TypeError):
        return []


def _attr(tag, nome):
    m = re.search(r'\s' + re.escape(nome) + r'="([^"]*)"', tag)
    return m.group(1) if m else None


# Par de controles que abre todo card marcado (menos o <a> do índice de raças)
RE_CONTROLES = re.compile(r'<button type="button" class="ent-add" hidden [^>]*></button>'
                          r'<span class="ent-alca" hidden [^>]*></span>')
# Fontes com {cards:[{id, opentag}]}: data/<x>.json -> pages/<x>.html
FONTES_CARDS = ('racas', 'racas/*', 'origens', 'classes/*')


def _ids_json(root):
    """{pagina_rel: {ids}} lido direto dos JSON de conteúdo, sem a tabela de
    classe -> tipo dos geradores: todo card é entidade, menos NAO_ENTIDADE."""
    out, probs = {}, []
    for padrao in FONTES_CARDS:
        for f in sorted(glob.glob(os.path.join(root, 'data', padrao + '.json'))):
            r = os.path.relpath(f, os.path.join(root, 'data')).replace(os.sep, '/')[:-5]
            try:
                cards = json.load(open(f, encoding='utf-8'))['cards']
            except (OSError, ValueError, KeyError) as e:
                probs.append(f'{rel(f, root)} ilegível: {e}')
                continue
            ids = set()
            for c in cards:
                m = re.search(r'class="([^"]+)"', c.get('opentag', ''))
                if NAO_ENTIDADE.isdisjoint(m.group(1).split() if m else []):
                    ids.add(c.get('id'))
            out[f'pages/{r}.html'] = ids
    return out, probs


def checa_ids(root=None):
    """[ids] Unicidade global, DOM x catálogo por conjunto, controles hidden, alias."""
    root = root or ROOT
    print('[ids] Entidades: data-kf-* das páginas x data/catalogo, alias_ids.json')
    from collections import Counter
    ruins, avisos = [], []
    ents, probs = _catalogo(root)
    ruins += probs
    bazar = _ids_bazar(root)
    todos = Counter([i for _, i in ents] + bazar)
    dup = sorted(i for i, n in todos.items() if n > 1)
    if dup:
        ruins.append(f'id de entidade repetido no site: {dup[:10]}')
    esperado = set(ents)
    por_json, probs = _ids_json(root)
    ruins += probs

    dom = Counter()
    for f in paginas(root):
        pr = os.path.relpath(f, root).replace(os.sep, '/')
        if pr == 'pages/bazar.html':          # nasce no js/bazar.js
            continue
        h = open(f, encoding='utf-8').read()
        n_cards = n_link = 0
        ids_pag, sem_par = set(), []
        for m in re.finditer(r'<[a-z][a-z0-9]*\s[^>]*\bdata-kf-id="[^"]*"[^>]*>', h):
            tag = m.group(0)
            tipo, id_, prever = _attr(tag, 'data-kf-tipo'), _attr(tag, 'data-kf-id'), _attr(tag, 'data-prever')
            dom[(tipo, id_)] += 1
            ids_pag.add(id_)
            if prever != f'{tipo}:{id_}':
                ruins.append(f'{rel(f, root)}: data-prever="{prever}" em {tipo}:{id_} (esperado "{tipo}:{id_}")')
            if tag.startswith('<a '):
                n_link += 1                   # preview do índice de raças: sem botão dentro de link
            elif not RE_CONTROLES.match(h, m.end()):
                sem_par.append(f'{tipo}:{id_}')   # botão + alça são os PRIMEIROS filhos do card
            n_cards += 1
        if sem_par:
            ruins.append(f'{rel(f, root)}: card sem .ent-add + .ent-alca como primeiros filhos: {sem_par[:10]}')
        if pr in por_json:                    # contra o JSON de conteúdo, não só contra o catálogo
            faltam = sorted(por_json[pr] - ids_pag)
            sobram = sorted(ids_pag - por_json[pr])
            if faltam:
                ruins.append(f'{rel(f, root)}: card do JSON sem data-kf-id na página: {faltam[:10]}')
            if sobram:
                ruins.append(f'{rel(f, root)}: data-kf-id sem card no JSON: {sobram[:10]}')
        for cls in ('ent-add', 'ent-alca'):
            tags = re.findall(r'<[a-z]+\s[^>]*class="' + cls + r'"[^>]*>', h)
            if len(tags) != n_cards - n_link:
                ruins.append(f'{rel(f, root)}: {len(tags)} .{cls} para {n_cards - n_link} cards')
            soltos = [t for t in tags if not re.search(r'\shidden[\s>]', t)]
            if soltos:
                ruins.append(f'{rel(f, root)}: {len(soltos)} .{cls} sem hidden (só a F4 os mostra)')
    rep = sorted(f'{t}:{i}' for (t, i), n in dom.items() if n > 1)
    if rep:
        ruins.append(f'card repetido nas páginas: {rep[:10]}')
    so_json = sorted(f'{t}:{i}' for t, i in esperado - set(dom))
    so_dom = sorted(f'{t}:{i}' for t, i in set(dom) - esperado)
    if so_json:
        ruins.append(f'só no catálogo (card sem data-kf-id): {so_json[:10]}{" …" if len(so_json) > 10 else ""}')
    if so_dom:
        ruins.append(f'só nas páginas (data-kf-id sem entrada no catálogo): {so_dom[:10]}')
    js = os.path.join(root, 'js', 'bazar.js')
    if os.path.exists(js) and 'data-kf-tipo="item"' not in open(js, encoding='utf-8').read():
        ruins.append('js/bazar.js: card do Bazar sem data-kf-tipo="item"')

    f = os.path.join(root, 'tools', 'alias_ids.json')
    try:
        al = json.load(open(f, encoding='utf-8'))
        for k, v in al.get('alias', {}).items():
            if v not in todos:
                ruins.append(f'alias_ids.json: {k!r} -> {v!r}, que não é id do site')
            if k in todos:
                ruins.append(f'alias_ids.json: {k!r} já é id do site (alias sobrando)')
        for k, motivo in al.get('semEntidade', {}).items():
            if k in todos:
                ruins.append(f'alias_ids.json: {k!r} em semEntidade mas já é id do site')
            avisos.append(f'contrato sem entidade no site: {k} ({motivo})')
    except (OSError, ValueError) as e:
        ruins.append(f'tools/alias_ids.json ilegível: {e}')

    for a in avisos:
        print(f'  AVISO  {a}')
    if ruins:
        falhas.append('ids')
        for r in ruins:
            print(f'  FALHA  {r}')
    else:
        print(f'  OK     {len(todos)} ids únicos ({len(bazar)} do Bazar); '
              f'{sum(dom.values())} cards == catálogo; alias ok')


def checa_fragmentos(root=None):
    """[fragmentos] Link entre páginas com #id aponta para id que existe lá."""
    root = root or ROOT
    print('[fragmentos] Links entre páginas com #fragmento')
    pags = paginas(root)
    ids = {os.path.normpath(f): set(RE_ID.findall(open(f, encoding='utf-8').read())) for f in pags}
    bazar = set(_ids_bazar(root))
    ruins, n = [], 0
    for f in pags:
        h = open(f, encoding='utf-8').read()
        base = os.path.dirname(f)
        for arq, frag in re.findall(r'href="([^"#?:]+\.html)(?:\?[^"#]*)?#([^"]+)"', h):
            n += 1
            alvo = os.path.normpath(os.path.join(base, arq))
            if '/' in frag:                   # rota do JS: bazar.html#item/<id>
                tipo, _, id_ = frag.partition('/')
                if os.path.basename(alvo) == 'bazar.html' and tipo == 'item' and id_ not in bazar:
                    ruins.append(f'{rel(f, root)}: {arq}#{frag} (item fora do data/bazar.json)')
                continue
            if alvo not in ids:
                continue                      # arquivo inexistente é do [1-4]
            if frag not in ids[alvo]:
                ruins.append(f'{rel(f, root)}: {arq}#{frag}')
    if ruins:
        falhas.append('fragmentos')
        for r in sorted(set(ruins)):
            print(f'  FALHA  âncora sem destino em outra página: {r}')
    else:
        print(f'  OK     {n} links com fragmento, todos com destino')


def checa_glifos(root=None):
    """[glifos] Sprite g-* íntegro e todo <use href="#g-*"> com o seu <symbol>."""
    root = root or ROOT
    print('[glifos] Sprite partials/glifos.html e usos de #g-*')
    ruins = []
    f = os.path.join(root, 'partials', 'glifos.html')
    try:
        sprite = open(f, encoding='utf-8').read()
    except OSError as e:
        falhas.append('glifos')
        print(f'  FALHA  partials/glifos.html ilegível: {e}')
        return
    p = Stack(); p.feed(sprite)
    ruins += [f'glifos.html: {x}' for x in p.erros + [f'<{t}> aberta na linha {pos[0]} nunca fechada'
                                                     for t, pos in p.pilha]]
    simbolos = re.findall(r'<symbol\s[^>]*>', sprite)
    ids = [_attr(s, 'id') for s in simbolos]
    for s, i in zip(simbolos, ids):
        if not (i and re.fullmatch(r'g-[a-z0-9]+(?:-[a-z0-9]+)*', i)):
            ruins.append(f'glifos.html: símbolo com id fora do padrão g-*: {i!r}')
        if not _attr(s, 'viewBox'):
            ruins.append(f'glifos.html: {i} sem viewBox')
    from collections import Counter
    dup = sorted(i for i, n in Counter(ids).items() if n > 1)
    if dup:
        ruins.append(f'glifos.html: símbolos duplicados: {dup}')
    no_sprite = set(ids)

    # um glifo por ramo: o mesmo slug do token --ramo-<r> das páginas de classe
    ramos = set()
    for t in glob.glob(os.path.join(root, 'templates', 'classes', '*.template.html')):
        ramos |= {re.sub(r'-dark$', '', r) for r in
                  re.findall(r'--ramo-([a-z0-9]+(?:-[a-z0-9]+)*)\s*:', open(t, encoding='utf-8').read())}
    g_ramos = {i[len('g-ramo-'):] for i in no_sprite if i.startswith('g-ramo-')}
    if ramos - g_ramos:
        ruins.append(f'ramo sem glifo: {sorted(ramos - g_ramos)}')
    if g_ramos - ramos:
        ruins.append(f'glifo de ramo sem ramo: {sorted(g_ramos - ramos)}')

    n_usos = 0
    for pg in paginas(root):
        h = open(pg, encoding='utf-8').read()
        na_pagina = set(re.findall(r'<symbol id="(g-[^"]+)"', h))
        usos = set(re.findall(r'<use href="#(g-[^"]+)"', h))
        n_usos += len(usos)
        if usos - na_pagina:
            ruins.append(f'{rel(pg, root)}: <use> sem <symbol> na página: {sorted(usos - na_pagina)}')
    for js in sorted(glob.glob(os.path.join(root, 'js', '**', '*.js'), recursive=True)):
        usos = set(re.findall(r'href=\\?["\']#(g-[a-z0-9-]+)', open(js, encoding='utf-8').read()))
        n_usos += len(usos)
        if usos - no_sprite:
            ruins.append(f'{rel(js, root)}: glifo sem <symbol> no sprite: {sorted(usos - no_sprite)}')
    if ruins:
        falhas.append('glifos')
        for r in ruins:
            print(f'  FALHA  {r}')
    else:
        print(f'  OK     {len(ids)} símbolos ({len(g_ramos)} ramos); {n_usos} usos de #g-* com símbolo')


def checa_bazar_inv(root=None):
    """[8] Todo item do data/bazar.json traz o campo inv (contrato do inventário)."""
    root = root or ROOT
    print('[8] data/bazar.json: campo inv em todo item')
    f = os.path.join(root, 'data', 'bazar.json')
    try:
        itens = json.load(open(f, encoding='utf-8'))
    except (OSError, ValueError) as e:
        falhas.append('bazar-inv')
        print(f'  FALHA  data/bazar.json ilegível: {e}')
        return
    if not isinstance(itens, list):
        falhas.append('bazar-inv')
        print('  FALHA  data/bazar.json deixou de ser ARRAY (contrato do js/ficha.js)')
        return
    sem = [i.get('nome', '?') if isinstance(i, dict) else repr(i)[:40]
           for i in itens if not (isinstance(i, dict) and isinstance(i.get('inv'), dict)
                                  and i['inv'].get('slot') in ('equipamento', 'bugiganga'))]
    if sem:
        falhas.append('bazar-inv')
        print(f'  FALHA  {len(sem)} item(ns) sem inv válido: {sem[:8]}{" …" if len(sem) > 8 else ""}')
    else:
        print(f'  OK     {len(itens)} itens com inv')


# ---------------------------------------------------------------- componentes
BASELINE_COMPONENTES = 'tools/componentes-baseline.json'
RE_CLASSE = re.compile(r'(?<![\w-])class="([^"]*)"')


def _paginas_classe(root):
    return sorted(rel(p, root) for p in glob.glob(os.path.join(root, 'pages', 'classes', '*.html')))


def conta_componentes(html, classes):
    """{classe: nº de elementos com ela} para as classes pedidas."""
    cont = dict.fromkeys(classes, 0)
    for m in RE_CLASSE.finditer(html):
        for k in m.group(1).split():
            if k in cont:
                cont[k] += 1
    return cont


def _le_baseline(root):
    base = json.load(open(os.path.join(root, BASELINE_COMPONENTES), encoding='utf-8'))
    classes, pags = base['classes'], base['paginas']
    if not isinstance(classes, list) or not isinstance(pags, dict):
        raise ValueError('"classes" tem de ser lista e "paginas" objeto')
    return base, classes, pags


def atualiza_componentes(root=None):
    """Regrava as contagens do baseline a partir das páginas atuais (lista de
    classes mantida). É o "de propósito": rodar só depois de conferir que a queda
    vem do Notion, e dizer no commit qual conteúdo saiu."""
    root = root or ROOT
    base, classes, _ = _le_baseline(root)
    pags = {}
    for pg in _paginas_classe(root):
        cont = conta_componentes(open(os.path.join(root, pg), encoding='utf-8').read(), classes)
        pags[pg] = {k: n for k, n in cont.items() if n}
    base['paginas'] = pags
    with open(os.path.join(root, BASELINE_COMPONENTES), 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(json.dumps(base, ensure_ascii=False, indent=2) + '\n')
    print(f'  baseline regravado: {BASELINE_COMPONENTES} ({len(pags)} páginas)')


def checa_componentes(root=None):
    """[componentes] Classe CSS de componente não cai sem o baseline mudar."""
    root = root or ROOT
    print(f'[componentes] Classes de componente em pages/classes x {BASELINE_COMPONENTES}')
    try:
        _, classes, pags = _le_baseline(root)
    except (OSError, ValueError, KeyError) as e:
        falhas.append('componentes')
        print(f'  FALHA  {BASELINE_COMPONENTES} ilegível: {e}')
        return
    ruins, subiu, n = [], [], 0
    for pg in sorted(set(pags) | set(_paginas_classe(root))):
        if pg not in pags:
            ruins.append(f'{pg}: página sem linha no baseline')
            continue
        fora = sorted(set(pags[pg]) - set(classes))
        if fora:
            ruins.append(f'{pg}: {fora} no baseline mas fora da lista "classes"')
        caminho = os.path.join(root, pg)
        if not os.path.exists(caminho):
            ruins.append(f'{pg}: está no baseline e não existe')
            continue
        cont = conta_componentes(open(caminho, encoding='utf-8').read(), classes)
        for k in classes:
            esp = pags[pg].get(k, 0)
            if cont[k] < esp:
                ruins.append(f'{pg}: .{k} caiu de {esp} para {cont[k]}')
            elif cont[k] > esp:
                subiu.append(f'{pg}: .{k} {esp} -> {cont[k]}')
        n += 1
    if ruins:
        falhas.append('componentes')
        for r in ruins:
            print(f'  FALHA  {r}')
        print('         componente virou lista genérica? Restaure no data/classes/*.json. Se o Notion\n'
              '         tirou o conteúdo, rode validar.py . --atualizar-componentes e diga no commit.')
    else:
        print(f'  OK     {n} páginas, {len(classes)} classes, nenhuma abaixo do baseline')
    for s in subiu:
        print(f'  AVISO  {s} (acima do baseline: --atualizar-componentes fixa o novo piso)')


def checa_roundtrip():
    print('[5] Round-trip data/*.json -> pages/*.html')
    tmp = tempfile.mkdtemp(prefix='khalkaria_rt_')
    try:
        for d in ('data', 'templates'):
            shutil.copytree(os.path.join(ROOT, d), os.path.join(tmp, d))
        # o catálogo é artefato: nasce do zero no tmp, sem herdar o do repo
        shutil.rmtree(os.path.join(tmp, 'data', 'catalogo'), ignore_errors=True)
        for d in ('pages/classes', 'pages/racas'):
            os.makedirs(os.path.join(tmp, d), exist_ok=True)
        for g in GERADORES:
            r = subprocess.run([sys.executable, os.path.join(TOOLS, g), tmp],
                               capture_output=True, text=True, encoding='utf-8')
            if r.returncode:
                falhas.append(g)
                print(f'  FALHA  {g}: {(r.stderr or "").strip()[:200]}')
        shell.aplicar(tmp, verboso=False)   # fase 2 também no round-trip
        n_ok = divergiu = 0
        for f in sorted(glob.glob(os.path.join(tmp, 'pages', '**', '*.html'), recursive=True)):
            alvo = os.path.join(ROOT, os.path.relpath(f, tmp))
            nome = os.path.relpath(alvo, ROOT).replace(os.sep, '/')
            if nome in FORA_ROUNDTRIP:
                continue
            if not os.path.exists(alvo):
                print(f'  FALHA  {nome}: gerado mas ausente em pages/')
                divergiu += 1
            elif filecmp.cmp(f, alvo, shallow=False):
                n_ok += 1
            else:
                print(f'  FALHA  {nome}: HTML difere do JSON (editado à mão? rode build.py)')
                divergiu += 1
        cat_ok = 0
        gerados = {os.path.basename(x) for x in glob.glob(os.path.join(tmp, 'data', 'catalogo', '*.json'))}
        no_repo = {os.path.basename(x) for x in glob.glob(os.path.join(ROOT, 'data', 'catalogo', '*.json'))}
        for nome in sorted(gerados | no_repo):
            a, b = os.path.join(tmp, 'data', 'catalogo', nome), os.path.join(ROOT, 'data', 'catalogo', nome)
            if nome not in gerados or nome not in no_repo or not filecmp.cmp(a, b, shallow=False):
                print(f'  FALHA  data/catalogo/{nome}: difere do gerado (editado à mão? rode build.py)')
                divergiu += 1
            else:
                cat_ok += 1
        if divergiu:
            falhas.append('roundtrip')
        else:
            print(f'  OK     {n_ok} páginas e {cat_ok} catálogos idênticos ao gerado a partir do JSON')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    checa_html()
    print()
    checa_sidebar()
    print()
    checa_regras_inventario()
    print()
    checa_bazar_inv()
    print()
    checa_blocos_sistema()
    print()
    checa_ids_classes()
    print()
    checa_ids()
    print()
    checa_fragmentos()
    print()
    checa_glifos()
    print()
    if '--atualizar-componentes' in FLAGS:
        atualiza_componentes()
    checa_componentes()
    print()
    if '--skip-roundtrip' not in FLAGS:
        checa_roundtrip()
    print()
    if falhas:
        print(f'RESULTADO: {len(set(falhas))} item(ns) com falha.')
        sys.exit(1)
    print('RESULTADO: tudo OK.')
