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
     (prova que nenhum HTML gerado foi editado à mão — CLAUDE.md §4/§10); o
     mesmo para data/catalogo, data/pericias.json, data/efeitos.json e as
     regras compiladas da ficha (js/ficha/00-regras-dados.js, F3b)
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
 [blocos]     F1b: blocos classe/raca/origem de data/ com os derivados (V/G/R,
              slugs, ids…) iguais ao que o verbatim dá (tools/blocos.py), ids de
              sub-entidade únicos e fora do catálogo, 15+15 corrupções sem repetir;
              todo campo verbatim com o seu marcador no template (ou no corpo do
              card, nas origens) e todo marcador com o seu campo; status só do
              vocabulário (pedroDecide | pendente + pergunta de
              tools/pendentes_balanceamento.json), e todo mínimo/início/recarga
              de medidor que o texto não declara coberto por uma pergunta;
              vida/altura/peso em toda raça (na raça ou em cada variante)
 [conteudo×contrato] V/G/R, CD, perícias/armas iniciais, recurso de classe
              (ids nos dois sentidos, máximo, mínimo, início, recarga), movimento,
              Ar natural e corrupção máxima x contrato do balanceamento (branch dele,
              ou KH_CONTRATO=<arquivo>): divergência é AVISO, nunca corrigida
 [componentes] contagem das classes CSS de componente (companion-card,
              d100-table, sub-ability...) em cada pages/classes/*.html >= o
              tools/componentes-baseline.json, por página e por card
              (data-kf-id). Um sync que troque componente por <ul> genérico,
              ou o mude de card, derruba o build; queda legítima (o Notion tirou
              o conteúdo) só passa regravando o baseline de propósito
 [balanceamento] F1d: data/balanceamento/ é a projeção publicada da entrega do
              balanceamento sem rara oculta (D3, D11/D33); com o privado local,
              refeita byte a byte (tools/checa_efeitos.py)
 [efeitos]    F1d: data/balanceamento/ficha-efeitos-itens.json x bazar.json/CSV
              e data/efeitos.json: conjunto, catálogo, vocabulário fechado
              (tools/alvos_destino.json), inventário, armas, lembretes,
              contagens, integridade de Mod (tools/checa_efeitos.py)
 [vhelor]     F1d: as 7 Marcas da Vhelor iguais ao texto do Pedro e numa fonte só
 [artefato-js] F2a: js/ficha.js é exatamente a concatenação de js/ficha/*.js na
              ordem de js/ficha/ORDEM (tools/ficha_js.py); fonte fora do
              manifesto, arquivo ausente ou repetido também é FALHA

Uso:
  python validar.py [repo_root]
  python validar.py . --skip-roundtrip
  python validar.py . --atualizar-componentes   # regrava o baseline e valida
Saída: exit 0 = tudo OK; exit 1 = há falhas.
"""
import os, re, sys, json, glob, shutil, filecmp, subprocess, tempfile
import shell, blocos, checa_efeitos, ficha_js
from kf_marca import NAO_ENTIDADE
from html.parser import HTMLParser

TOOLS = os.path.dirname(os.path.abspath(__file__))
ROOT = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else os.path.dirname(TOOLS)
FLAGS = {a for a in sys.argv[1:] if a.startswith('--')}
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
        'meta', 'param', 'source', 'track', 'wbr'}

# páginas geradas por gerador -> script que as produz (para o round-trip)
GERADORES = ['gerar_sistema.py', 'gerar_magias.py', 'gerar_condicoes.py', 'gerar_limiar.py',
             'gerar_classes.py', 'gerar_racas.py', 'gerar_origens.py', 'gerar_ficha.py', 'gerar_efeitos.py',
             'gerar_catalogo.py', 'gerar_regras_ficha.py']
# O Bazar entra no build padrão, mas não no round-trip: o gerador dele lê o CSV
# e grava data/bazar.json na raiz do repo (não recebe repo_root), então
# regenerá-lo aqui sobrescreveria o artefato real. A integridade do bazar.json
# é checada em checa_bazar_inv().
FORA_ROUNDTRIP = {'pages/bazar.html'}
# data/ (e js/) que um gerador escreve (fora de data/catalogo/): nasce do zero no round-trip.
# js/ficha/00-regras-dados.js (F3b) vem do gerar_regras_ficha.py, que lê o data/pericias.json
# do gerar_catalogo.py: por isso roda depois dele na lista GERADORES.
ARTEFATOS_DATA = ['data/pericias.json', 'data/efeitos.json', 'js/ficha/00-regras-dados.js']
FONTES_DOCS = ['docs/ficha-digital/03-respostas-pedro.md']

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
    """Contrato da nav (shell.py passos 1 e 6 a 11) numa página já montada."""
    probs = []
    for marca, oque in (('data-nav-boot', 'boot da nav no <head>'),
                        ('data-nav-js', '<script> do js/nav.js'),
                        ('data-tokens', '<link> do css/tokens.css'),
                        ('data-ficha-css', '<link> do css/ficha.css'),
                        ('data-kh-ui', '<script> do js/kh-ui.js'),
                        ('data-componentes', '<link> do css/componentes.css')):
        n = h.count(marca)
        if n != 1:
            probs.append(f'{n}× {oque} (esperado 1)')
    # o kh-ui.js (KhTeclas/KhPrever/KhToast) é síncrono e vem antes de todo script local
    locais = re.findall(r'<script src="(?:\.\./)*js/([^"?]+)', h)
    if locais and locais[0] != 'kh-ui.js':
        probs.append(f'primeiro <script src> local é {locais[0]} (esperado kh-ui.js)')
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


# ---------------------------------------------------------------- F1b
def _ids_de_bloco(root):
    """{id: onde} das sub-entidades com id dentro dos blocos (recurso, características,
    ramos, itens alquímicos, corrupções, habilidades de origem) + lista de repetidos."""
    vistos, rep = {}, []

    def anota(i, onde):
        if i in vistos:
            rep.append(f'{i} ({vistos[i]} e {onde})')
        vistos[i] = onde
    for rot, _, _, b, _ in blocos.fontes(root):
        rec = b.get('recurso') or {}
        for h in rec.get('habilidades', []):
            anota(h['id'], f'{rot} recurso')
        for chave in ('caracteristicas', 'ramos'):
            for x in b.get(chave, []) if isinstance(b.get(chave), list) else []:
                if isinstance(x, dict):
                    anota(x['id'], f'{rot} {chave}')
        for nv in b.get('itensAlquimicos', []):
            for cat in nv['categorias']:
                for it in cat['itens']:
                    anota(it['id'], f'{rot} itensAlquimicos')
        for g in ('poderes', 'adversidades'):
            for it in (b.get('corrupcao') or {}).get(g, {}).get('itens', []):
                anota(it['id'], f'{rot} corrupcao.{g}')
        if 'habilidade' in b:
            anota(b['habilidade']['id'], f'{rot} habilidade')
    return vistos, rep


PENDENTES_BAL = 'tools/pendentes_balanceamento.json'
# Folhas de texto do bloco que não são verbatim de marcador: a classe CSS do ramo
# (vai no atributo class do template) e o seletor da escala derivada.
SEM_MARCADOR = [re.compile(r'^ramos\.\d+\.chave$'), re.compile(r'^caracteristicas\.\d+\.escalaDe$')]
META_STATUS = ('status', 'nota', 'pergunta')
RE_MEDIDOR_OMISSO = re.compile(r'^recurso\.medidores\.\d+\.(min|inicio|recarga)$')


def _folhas_texto(v, cam=''):
    """Caminhos das folhas str do bloco; status/nota/pergunta de um dict com status
    do vocabulário são metadado (não aparecem na página) e ficam de fora."""
    if isinstance(v, dict):
        meta = v.get('status') in blocos.STATUS_BLOCO
        for k, x in v.items():
            if meta and k in META_STATUS:
                continue
            yield from _folhas_texto(x, f'{cam}.{k}' if cam else k)
    elif isinstance(v, list):
        for i, x in enumerate(v):
            yield from _folhas_texto(x, f'{cam}.{i}' if cam else str(i))
    elif isinstance(v, str):
        yield cam


def cobertura_marcadores(bloco, derivados, txt, ns):
    """(folhas verbatim sem marcador, marcadores sem folha verbatim) de um bloco.
    Derivado não conta: ele sai do verbatim, não da página."""
    dcam = [c for c, _ in derivados]
    folhas = {f for f in _folhas_texto(bloco)
              if not any(f == d or f.startswith(d + '.') for d in dcam)
              and not any(r.match(f) for r in SEM_MARCADOR)}
    marc = {m[len(ns) + 1:] for m in blocos.marcadores(txt)}
    return sorted(folhas - marc), sorted(marc - folhas)


def _texto_do_bloco(root, rot, doc, b):
    """(texto com os marcadores, namespace) do bloco: template ou corpo do card."""
    tipo, nome = rot.split(' ', 1)
    if tipo == 'origem':
        return next(c['corpo'] for c in doc['cards'] if c.get('origem') is b), 'origem'
    pasta, ns = ('classes', 'classe') if tipo == 'classe' else ('racas', 'raca')
    return open(os.path.join(root, 'templates', pasta, f'{nome}.template.html'), encoding='utf-8').read(), ns


def _status_do_bloco(v, cam=''):
    """(caminho, dict) de todo dict do bloco com 'status' texto (o `status` da
    classe, com as fórmulas de Saúde/Stamina/Éter, é um dict e não conta)."""
    if isinstance(v, dict):
        if isinstance(v.get('status'), str):
            yield cam, v
        for k, x in v.items():
            yield from _status_do_bloco(x, f'{cam}.{k}' if cam else k)
    elif isinstance(v, list):
        for i, x in enumerate(v):
            yield from _status_do_bloco(x, f'{cam}.{i}' if cam else str(i))


def carrega_pendentes(root):
    d = json.load(open(os.path.join(root, PENDENTES_BAL), encoding='utf-8'))
    return {i['id']: i for i in d['itens']}


def checa_pendentes(fontes, pendentes):
    """(ruins, avisos): status fora do vocabulário, pendente sem pergunta conhecida,
    medidor omisso sem pergunta que o cubra, pergunta que nada usa."""
    import fnmatch
    ruins, usadas = [], set()
    for rot, _, _, b, der in fontes:
        for cam, d in _status_do_bloco(b):
            if d['status'] not in blocos.STATUS_BLOCO:
                ruins.append(f'{rot}: {cam}.status = {d["status"]!r} fora do vocabulário '
                             f'{list(blocos.STATUS_BLOCO)} (plano §3.2)')
            elif d['status'] == 'pendente':
                if d.get('pergunta') not in pendentes:
                    ruins.append(f'{rot}: {cam} pendente sem pergunta de {PENDENTES_BAL} ({d.get("pergunta")!r})')
                else:
                    usadas.add(d['pergunta'])
        for cam, v in der():
            if v is None and RE_MEDIDOR_OMISSO.match(cam):
                quem = [i for i, p in pendentes.items()
                        if any(fnmatch.fnmatchcase(f'{rot}: {cam}', c) for c in p.get('campos', []))]
                if not quem:
                    ruins.append(f'{rot}: {cam} = None (o texto não declara) sem pergunta em {PENDENTES_BAL}')
                usadas.update(quem)
    avisos = [f'pergunta {i} (rodada {p.get("rodada")}) sem campo pendente: respondida? tire de {PENDENTES_BAL}'
              for i, p in sorted(pendentes.items()) if i not in usadas]
    return ruins, avisos


def checa_fisico(rot, b):
    """Vida/altura/peso: na raça, ou em cada variante/subespécie (variantes.fisico)."""
    campos = ('vida', 'altura', 'peso')
    if all(b.get(k) for k in campos):
        return []
    var = b.get('variantes') or {}
    fis = var.get('fisico') or {}
    faltam = [i for i in var.get('ids', []) if not all((fis.get(i) or {}).get(k) for k in campos)]
    if not var.get('ids') or faltam:
        return [f'{rot}: sem vida/altura/peso na raça nem em toda variante (faltam {faltam or "variantes"})']
    return []


def checa_blocos(root=None):
    """[blocos] F1b: derivados em sincronia com o verbatim, ids das sub-entidades
    únicos e fora do catálogo, id da raça == catálogo, contagens por Counter.
    F1e(c): inclui o grupo/ramo/tier/custoTexto de cada card de classe (blocos.fontes_cards)."""
    root = root or ROOT
    print('[blocos] Blocos classe/raca/origem (data/): derivados, ids, contagens')
    from collections import Counter
    ruins = []
    try:
        div = blocos.divergencias(root)
        ids, rep = _ids_de_bloco(root)
        fontes = list(blocos.fontes(root))
    except (OSError, ValueError, KeyError, TypeError) as e:
        falhas.append('blocos')
        print(f'  FALHA  blocos ilegíveis: {e!r}')
        return
    for rot, cam, atual, calc in div[:15]:
        ruins.append(f'{rot}: {cam} = {json.dumps(atual, ensure_ascii=False)[:80]}, '
                     f'o verbatim dá {json.dumps(calc, ensure_ascii=False)[:80]} (rode python tools/blocos.py)')
    ruins += [f'id repetido nos blocos: {r}' for r in rep]
    ents, _ = _catalogo(root)
    no_site = {i for _, i in ents} | set(_ids_bazar(root))
    colide = sorted(set(ids) & no_site)
    if colide:
        ruins.append(f'id de bloco que já é entidade do catálogo/Bazar: {colide[:10]}')
    racas_cat = {i for t, i in ents if t == 'raca'}
    n_cor = n_alq = n_marc = 0
    for rot, _, doc, b, der in fontes:
        txt, ns = _texto_do_bloco(root, rot, doc, b)
        sem, orfao = cobertura_marcadores(b, der(), txt, ns)
        n_marc += len(blocos.marcadores(txt))
        if sem:
            ruins.append(f'{rot}: campo(s) verbatim sem marcador {{{{{ns}.…}}}} na página: {sem[:6]}'
                         f' (texto literal no template? o JSON diverge da página em silêncio)')
        if orfao:
            ruins.append(f'{rot}: marcador(es) sem campo verbatim no bloco: {orfao[:6]}')
        if rot.startswith('raça'):
            ruins += checa_fisico(rot, b)
        if rot.startswith('raça') and b['id'] not in racas_cat:
            ruins.append(f'{rot}: id {b["id"]} fora do catálogo de raças')
        if 'corrupcao' in b:
            for g in ('poderes', 'adversidades'):
                nomes = [it['nome'] for it in b['corrupcao'][g]['itens']]
                dup = [n for n, k in Counter(nomes).items() if k > 1]
                if dup:
                    ruins.append(f'{rot}: {g} repetidos {dup}')
                n_cor += len(nomes)
        for nv in b.get('itensAlquimicos', []):
            n_alq += sum(len(c['itens']) for c in nv['categorias'])
    try:
        pend = carrega_pendentes(root)
    except (OSError, ValueError, KeyError, TypeError) as e:
        pend = None
        ruins.append(f'{PENDENTES_BAL} ilegível: {e!r}')
    avisos = []
    if pend is not None:
        r2, avisos = checa_pendentes(fontes, pend)
        ruins += r2
    for a in avisos:
        print(f'  AVISO  {a}')
    if ruins:
        falhas.append('blocos')
        for r in ruins:
            print(f'  FALHA  {r}')
    else:
        n_cards = sum(len(doc['cards']) for _, _, doc, _ in blocos.fontes_cards(root))
        print(f'  OK     {len(fontes)} blocos e {n_cards} cards de classe (grupo/ramo/tier/custoTexto), '
              f'derivados em sincronia; {len(ids)} ids de sub-entidade '
              f'únicos ({n_alq} itens alquímicos, {n_cor} corrupções); {n_marc} marcadores == campos '
              f'verbatim; {len(pend)} pergunta(s) ao balanceamento cobrindo os pendentes')


CONTRATO_REF = 'origin/claude/khalkaria-bazar-balance-lsdfic'
CONTRATO_ARQ = '.claude/skills/khalkaria-balance/references/ficha-digital-regras.json'


def carrega_contrato(root=None):
    """Contrato do balanceamento (ficha-digital-regras.json) direto da branch dele;
    KH_CONTRATO=<arquivo> usa um arquivo local. (None, motivo) se não der."""
    local = os.environ.get('KH_CONTRATO')
    try:
        if local:
            return json.load(open(local, encoding='utf-8')), local
        r = subprocess.run(['git', '-C', root or ROOT, 'show', f'{CONTRATO_REF}:{CONTRATO_ARQ}'],
                           capture_output=True, encoding='utf-8', errors='replace',
                           env=dict(os.environ, MSYS_NO_PATHCONV='1'))
        if r.returncode:
            return None, (r.stderr or '').strip()[:160]
        return json.loads(r.stdout), f'{CONTRATO_REF} ({json.loads(r.stdout).get("schemaVersion")})'
    except (OSError, ValueError) as e:
        return None, repr(e)


def _cd_contrato(formula):
    """'10 + escolha(mod.DES,mod.FOR) + mod.CON' -> (10, [{DES, FOR}, {CON}])."""
    partes = [p.strip() for p in formula.split(' + ')]
    termos = []
    for p in partes[1:]:
        termos.append(frozenset(re.findall(r'mod\.([A-Z]{3})', p)))
    return int(partes[0]), sorted(termos, key=sorted)


def _formula_norm(f):
    """Normaliza fórmula de máximo para comparar site x contrato:
    '(Nível × 3) + Mod.Inteligência' e '(nivel * 3) + mod.INT' -> '(nivel*3)+mod.INT'."""
    import unicodedata
    t = unicodedata.normalize('NFKD', f)
    t = ''.join(c for c in t if not unicodedata.combining(c)).replace('×', '*')
    t = re.sub(r'mod\.\s*([A-Za-z]+)', lambda m: 'mod.' + blocos.atributo(
        unicodedata.normalize('NFC', {'forca': 'força', 'constituicao': 'constituição',
                                      'inteligencia': 'inteligência'}.get(m.group(1).lower(), m.group(1)))),
               t, flags=re.I)
    return re.sub(r'\s+', '', re.sub(r'(?i)nivel', 'nivel', t))


EVENTOS_RECARGA = ('fimCombate', 'fimCena', 'descansoLongo', 'descansoCurto',
                   'aoReceberDano', 'rodadaSemGanhar')


def _compara_medidor(c, rid, med, kr):
    """Mínimo, início e recarga por evento do medidor (site) x contrato
    (min, inicio, zeraEm ∩ eventos, recupera). None no site = texto omisso."""
    av = []
    if 'min' in kr and med.get('min') != kr['min']:
        av.append(f'classe {c}: mínimo de {rid} site {med.get("min")} x contrato {kr["min"]}')
    si, ki = med.get('inicio'), kr.get('inicio')
    if (si and (si['evento'], si['valor'])) != (ki and (ki.get('evento'), ki.get('valor'))):
        av.append(f'classe {c}: início de {rid} site '
                  f'{(si["evento"], si["valor"]) if si else "não declarado"} x contrato '
                  f'{(ki.get("evento"), ki.get("valor")) if ki else "nenhum"}')

    def chave(e):
        v = e.get('formula', e.get('valor'))
        return e['evento'], _formula_norm(v) if isinstance(v, str) and v != 'max' else str(v)
    site = sorted(chave(e) for e in med.get('recarga') or [])
    kont = sorted([(z, '0') for z in kr.get('zeraEm', []) if z in EVENTOS_RECARGA] +
                  [chave(e) for e in kr.get('recupera', [])])
    if site != kont:
        av.append(f'classe {c}: recarga de {rid} site {site or "não declarada"} x contrato {kont or "nenhuma"}')
    for e in med.get('recarga') or []:
        if e.get('condicao'):
            av.append(f'classe {c}: {rid} zera em {e["evento"]} só "{e["condicao"]}" no site;'
                      f' o contrato não modela a condição')
    return av


def compara_contrato(dados, contrato):
    """Divergências (lista de str) entre os blocos do site e o contrato. Nunca corrige:
    quem decide é o Pedro. `dados` = {'classes': {c: bloco}, 'racas': {r: (bloco, cards)}}."""
    av = []
    cls = contrato.get('classes', {})
    for c, b in sorted(dados.get('classes', {}).items()):
        k = cls.get(c)
        if not isinstance(k, dict):
            av.append(f'classe {c}: sem entrada no contrato')
            continue
        for x in ('V', 'G', 'R'):
            if k.get(x) != b.get(x):
                av.append(f'classe {c}: {x} site {b.get(x)} x contrato {k.get(x)}')
        if 'cd' in k:
            base, termos = _cd_contrato(k['cd']['formula'])
            site = sorted((frozenset(t) for t in b['cd']['termos']), key=sorted)
            if base != b['cd']['base'] or termos != site:
                av.append(f'classe {c}: CD site "{b["cd"]["texto"]}" x contrato "{k["cd"]["formula"]}"')
        fixo = b['treinamento']['fixo']['termos']
        per = {o for t in fixo if t['tipo'] == 'pericia' and isinstance(t['opcoes'], list) for o in t['opcoes']}
        if 'periciasIniciais' in k and set(k['periciasIniciais']) != per:
            av.append(f'classe {c}: perícias iniciais site {sorted(per)} x contrato {sorted(k["periciasIniciais"])}')
        if 'armaInicial' in k:
            armas = sorted(o for t in fixo if t['tipo'] == 'arma' for o in t['opcoes'])
            esperado = [shell.slugify('Armas ' + k['armaInicial'])] if k['armaInicial'] else []
            if armas != esperado:
                av.append(f'classe {c}: armas iniciais site {armas} x contrato {k["armaInicial"]!r}')
        rec = b.get('recurso') or {}
        krec = {r['id']: r for r in k.get('recursos', [])}
        srec = {rec['id']} if rec.get('id') else set()
        if not srec:
            av.append(f'classe {c}: recurso de classe {rec.get("status", "ausente")} no site'
                      f' (Pedro: "Todas têm"); contrato: {sorted(krec) or "nenhum"}')
        for x in sorted(srec - set(krec)):
            av.append(f'classe {c}: recurso "{x}" no site, contrato tem {sorted(krec) or "nenhum"}')
        for x in sorted(set(krec) - srec) if srec else []:
            av.append(f'classe {c}: recurso "{x}" no contrato, o site não tem (site: {sorted(srec)})')
        for rid in sorted(srec & set(krec)):
            kr = krec[rid]
            med = rec['medidores'][0] if rec.get('medidores') else {}
            smax = med.get('max')
            if smax is None or _formula_norm(smax) != _formula_norm(str(kr.get('max'))):
                av.append(f'classe {c}: máximo de {rec["id"]} site "{smax}" x contrato "{kr.get("max")}"')
            av += _compara_medidor(c, rid, med, kr)
            if 'gastos' in kr:
                site = {h['id'][len(c) + 1:]: blocos.texto(h['custo']) for h in rec.get('habilidades', [])}
                kg = {i: str(v) for i, v in kr['gastos'].items()}
                if site != kg:
                    av.append(f'classe {c}: gastos de {rec["id"]} site {site} x contrato {kg}')
        for e in k.get('estados', []):
            car = {f['id'][len(c) + 1:]: f for f in b.get('caracteristicas', [])}
            if e['id'] not in car:
                av.append(f'classe {c}: estado "{e["id"]}" do contrato sem característica no site')
            elif 'bonus' in e and 'escala' in car[e['id']]:
                site = {str(x['nivel']): f'{x["atacar"]:+d}/{x["defender"]:+d}' for x in car[e['id']]['escala']}
                if site != e['bonus']:
                    av.append(f'classe {c}: escala de {e["id"]} site {site} x contrato {e["bonus"]}')
    for c in sorted(set(k for k in cls if not k.startswith('_')) - set(dados.get('classes', {}))):
        av.append(f'classe {c}: no contrato, sem bloco no site')

    der = contrato.get('derivados', {})
    base_mov = der.get('movimento', {}).get('basePorRaca', {})
    ar_k = der.get('armadura', {}).get('arNaturalPorRaca', {})
    alias = dados.get('alias', {})
    ar_site = {}
    for r, (b, cards) in sorted(dados.get('racas', {}).items()):
        km = base_mov.get(r)
        if isinstance(km, dict):
            subs = {s['id']: s['movimento']['metros'] for s in b.get('variantes', {}).get('subespecies', [])}
            for sub, v in km.items():
                if subs.get(f'{r}-{sub}') != v:
                    av.append(f'raça {r}-{sub}: movimento site {subs.get(f"{r}-{sub}")} x contrato {v}')
        elif km != b['movimento']['metros']:
            av.append(f'raça {r}: movimento site {b["movimento"]["metros"]} x contrato {km}')
        base = sum(a['valor'] for a in b.get('arNatural', []) if a['fonte'] in b.get('caracteristicas', []))
        if base:
            ar_site[r] = base
        for a in b.get('arNatural', []):
            if a['fonte'] not in b.get('caracteristicas', []):
                # "+N" soma à base da raça; "N" (soma False) é o valor da variante
                ar_site[a['fonte']] = base + a['valor'] if a['soma'] else a['valor']
        cmax = contrato.get('progressao', {}).get('corrupcaoMax')
        if 'corrupcao' in b:
            site = {int(x['nivel']): int(x['maximo']) for x in b['corrupcao'].get('maximoPorNivel', [])}
            kont = {int(n): v for n, v in (cmax or {}).items()}
            if site != kont:
                av.append(f'raça {r}: corrupção máxima por nível site {site} x contrato {kont or "nenhuma"}')
    if contrato.get('progressao', {}).get('corrupcaoMax') and not any(
            'corrupcao' in b for b, _ in dados.get('racas', {}).values()):
        av.append('corrupção máxima por nível no contrato, nenhuma raça do site com tabela de corrupção')
    ar_contrato = {alias.get(k, k): v for k, v in ar_k.items()}
    for k in sorted(set(ar_site) | set(ar_contrato)):
        if ar_site.get(k) != ar_contrato.get(k):
            av.append(f'Ar natural {k}: site {ar_site.get(k)} x contrato {ar_contrato.get(k)}')
    return av


def checa_conteudo_contrato(root=None):
    """[conteudo×contrato] V/G/R, CD, perícias e armas iniciais, recurso de classe
    (conjunto de ids nos dois sentidos, máximo, mínimo, início, recarga, gastos),
    Marca do Duelo, movimento, Ar natural e corrupção máxima por nível: site x
    contrato do balanceamento. Divergência é AVISO ao Pedro, nunca corrigida aqui."""
    root = root or ROOT
    print('[conteudo×contrato] Blocos de data/ x contrato do balanceamento')
    contrato, origem = carrega_contrato(root)
    if contrato is None:
        print(f'  AVISO  contrato indisponível ({origem}): comparação pulada')
        return
    try:
        dados = {'classes': {}, 'racas': {}}
        for rot, _, doc, b, _ in blocos.fontes(root):
            if rot.startswith('classe'):
                dados['classes'][rot.split()[1]] = b
            elif rot.startswith('raça'):
                dados['racas'][rot.split()[1]] = (b, doc['cards'])
        try:
            dados['alias'] = json.load(open(os.path.join(root, 'tools', 'alias_ids.json'), encoding='utf-8'))['alias']
        except (OSError, ValueError, KeyError):
            dados['alias'] = {}
        av = compara_contrato(dados, contrato)
    except (OSError, ValueError, KeyError, TypeError) as e:
        print(f'  AVISO  comparação interrompida: {e!r}')
        return
    for a in av:
        print(f'  AVISO  {a}')
    print(f'  OK     {len(dados["classes"])} classes e {len(dados["racas"])} raças comparadas com '
          f'{origem}: {len(av)} divergência(s) para o Pedro')


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


class _PorCard(HTMLParser):
    """Conta as classes pedidas por card: cada elemento vai para o card
    (data-kf-id) mais interno que o contém, inclusive ele mesmo."""

    def __init__(self, classes):
        super().__init__(convert_charrefs=True)
        self.classes = set(classes)
        self.pilha = []          # (tag, id do card aberto nela ou None)
        self.cont = {}

    def _card(self):
        for _, cid in reversed(self.pilha):
            if cid:
                return cid
        return None

    def _conta(self, attrs, cid):
        cid = cid or self._card()
        if not cid:
            return
        for k in (dict(attrs).get('class') or '').split():
            if k in self.classes:
                d = self.cont.setdefault(cid, {})
                d[k] = d.get(k, 0) + 1

    def handle_starttag(self, tag, attrs):
        cid = dict(attrs).get('data-kf-id')
        self._conta(attrs, cid)
        if tag not in VOID:
            self.pilha.append((tag, cid))

    def handle_startendtag(self, tag, attrs):
        self._conta(attrs, dict(attrs).get('data-kf-id'))

    def handle_endtag(self, tag):
        for i in range(len(self.pilha) - 1, -1, -1):
            if self.pilha[i][0] == tag:
                del self.pilha[i:]
                return


def conta_por_card(html, classes):
    """{data-kf-id: {classe: n}} — pega componente que muda de card sem mudar a
    contagem da página (o .ultimate-cost do Receptáculo que virou <ul> enquanto a
    Manifestação ganhava dois)."""
    p = _PorCard(classes)
    p.feed(html)
    p.close()
    return {c: dict(sorted(v.items())) for c, v in sorted(p.cont.items())}


def _le_baseline(root):
    base = json.load(open(os.path.join(root, BASELINE_COMPONENTES), encoding='utf-8'))
    classes, pags, cards = base['classes'], base['paginas'], base.get('cards', {})
    if not isinstance(classes, list) or not isinstance(pags, dict) or not isinstance(cards, dict):
        raise ValueError('"classes" tem de ser lista e "paginas"/"cards" objeto')
    return base, classes, pags, cards


def _grava_baseline(root, base):
    """JSON com indent 2, mas um card por linha (senão são milhares de linhas)."""
    base = dict(base)
    cards = base.pop('cards', {})
    txt = json.dumps(base, ensure_ascii=False, indent=2)
    if cards:
        blocos = []
        for pg, por in cards.items():
            linhas = ',\n'.join(f'      {json.dumps(c, ensure_ascii=False)}: '
                                f'{json.dumps(v, ensure_ascii=False)}' for c, v in por.items())
            blocos.append(f'    {json.dumps(pg)}: {{\n{linhas}\n    }}')
        txt = txt[:-2] + ',\n  "cards": {\n' + ',\n'.join(blocos) + '\n  }\n}'
    with open(os.path.join(root, BASELINE_COMPONENTES), 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(txt + '\n')


def atualiza_componentes(root=None):
    """Regrava as contagens do baseline a partir das páginas atuais (lista de
    classes mantida). É o "de propósito": rodar só depois de conferir que a queda
    vem do Notion, e dizer no commit qual conteúdo saiu."""
    root = root or ROOT
    base, classes, _, _ = _le_baseline(root)
    pags, cards = {}, {}
    for pg in _paginas_classe(root):
        html = open(os.path.join(root, pg), encoding='utf-8').read()
        cont = conta_componentes(html, classes)
        pags[pg] = {k: n for k, n in cont.items() if n}
        cards[pg] = conta_por_card(html, classes)
    base['paginas'] = pags
    base['cards'] = cards
    _grava_baseline(root, base)
    print(f'  baseline regravado: {BASELINE_COMPONENTES} ({len(pags)} páginas, '
          f'{sum(len(v) for v in cards.values())} cards)')


def checa_componentes(root=None):
    """[componentes] Classe CSS de componente não cai sem o baseline mudar."""
    root = root or ROOT
    print(f'[componentes] Classes de componente em pages/classes x {BASELINE_COMPONENTES}')
    try:
        _, classes, pags, cards = _le_baseline(root)
    except (OSError, ValueError, KeyError) as e:
        falhas.append('componentes')
        print(f'  FALHA  {BASELINE_COMPONENTES} ilegível: {e}')
        return
    ruins, subiu, n, nc = [], [], 0, 0
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
        html = open(caminho, encoding='utf-8').read()
        cont = conta_componentes(html, classes)
        for k in classes:
            esp = pags[pg].get(k, 0)
            if cont[k] < esp:
                ruins.append(f'{pg}: .{k} caiu de {esp} para {cont[k]}')
            elif cont[k] > esp:
                subiu.append(f'{pg}: .{k} {esp} -> {cont[k]}')
        n += 1
        # por card: o total da página fecha mesmo quando um componente sai de um
        # card e aparece em outro
        agora = conta_por_card(html, classes)
        for cid, esperado in cards.get(pg, {}).items():
            nc += 1
            if cid not in agora:
                ruins.append(f'{pg}: card {cid} sumiu (tinha {esperado})')
                continue
            for k, esp in esperado.items():
                if k not in classes:
                    ruins.append(f'{pg}: card {cid}: .{k} fora da lista "classes"')
                elif agora[cid].get(k, 0) < esp:
                    ruins.append(f'{pg}: card {cid}: .{k} caiu de {esp} para {agora[cid].get(k, 0)}')
    if ruins:
        falhas.append('componentes')
        for r in ruins:
            print(f'  FALHA  {r}')
        print('         componente virou lista genérica? Restaure no data/classes/*.json. Se o Notion\n'
              '         tirou o conteúdo, rode validar.py . --atualizar-componentes e diga no commit.')
    else:
        print(f'  OK     {n} páginas, {nc} cards, {len(classes)} classes, nenhuma abaixo do baseline')
    for s in subiu:
        print(f'  AVISO  {s} (acima do baseline: --atualizar-componentes fixa o novo piso)')


# ---------------------------------------------------------------- F1d
def _imprime(rot, r):
    for x in r.falhas:
        print(f'  FALHA  {x}')
    for x in r.avisos:
        print(f'  AVISO  {x}')
    for x in r.ok:
        print(f'  OK     {x}')
    if r.falhas:
        falhas.append(rot)


def checa_balanceamento(root=None):
    print('[balanceamento] data/balanceamento/: projeção publicada, sem rara oculta')
    _imprime('balanceamento', checa_efeitos.checa_balanceamento(root or ROOT))


def checa_efeitos_itens(root=None):
    print('[efeitos] Efeitos de item: arquivo do balanceamento x Bazar x data/efeitos.json')
    _imprime('efeitos', checa_efeitos.checa_efeitos(root or ROOT))


def checa_vhelor(root=None):
    print('[vhelor] Marcas da Vhelor (data/balanceamento/marcas-vhelor.json)')
    _imprime('vhelor', checa_efeitos.checa_vhelor(root or ROOT))


def checa_estilo(root=None):
    """Portão da F1c (plano §F1c): o par de capturas de estilo computado
    antes/depois está versionado; aqui só se compara, o build não tem motor de
    CSS para capturar. FALHA se (1) o css/** mudou depois da última captura
    'depois' (carimbo _css.txt que o servidor.py grava) ou (2) o diff.py acha
    diferença fora do tools/estilo/revisado.json."""
    print('[estilo] Estilo computado: par antes/depois (tools/testes/estilo/) x css/**')
    root = root or ROOT
    est = os.path.join(root, 'tools', 'estilo')
    base = os.path.join(root, 'tools', 'testes', 'estilo')
    sys.path.insert(0, est)
    try:
        import diff as estilo_diff
    finally:
        sys.path.remove(est)
    probs = []
    carimbo = os.path.join(base, 'depois', estilo_diff.CARIMBO)
    if not os.path.isfile(carimbo):
        probs.append('tools/testes/estilo/depois/ sem _css.txt: rode o roteiro '
                     '(tools/estilo/servidor.py + rodar.html?rotulo=depois)')
    else:
        gravado = open(carimbo, encoding='utf-8').read().strip()
        agora = estilo_diff.hash_css(root)
        if gravado != agora:
            probs.append(f'css/** mudou depois da captura "depois" ({gravado} -> {agora}): '
                         f'recapture (rodar.html?rotulo=depois) e commite o par com o CSS')
    if not probs:
        r = subprocess.run([sys.executable, os.path.join(est, 'diff.py'), 'antes', 'depois',
                            '--revisado', os.path.join(est, 'revisado.json'), '--resumo'],
                           cwd=root, capture_output=True, text=True, encoding='utf-8', errors='replace')
        linhas = [l for l in r.stdout.splitlines() if l.strip()]
        resumo = next((l for l in reversed(linhas) if l.startswith('RESUMO')), r.stderr.strip()[-200:])
        if r.returncode != 0:
            probs.append(f'diff.py antes x depois: {resumo}')
            probs += ['  ' + l for l in linhas if l.startswith(('[DIF]', '[FALTA]'))][:10]
        else:
            print(f'  OK     {resumo[len("RESUMO: "):]} (carimbo do css/** confere)')
    for x in probs:
        print(f'  FALHA  {x}')
    if probs:
        falhas.append('estilo')


def checa_artefato_js(root=None):
    """[artefato-js] F2a: js/ficha.js == concat(js/ficha/ORDEM). CRLF x LF não
    conta (checkout antigo com core.autocrlf)."""
    print('[artefato-js] js/ficha.js x concatenação de js/ficha/*.js (js/ficha/ORDEM)')
    root = root or ROOT
    probs = ficha_js.confere(root)
    for x in probs:
        print(f'  FALHA  {x}')
    if probs:
        falhas.append('artefato-js')
    else:
        print(f'  OK     js/ficha.js = {" + ".join(ficha_js.ordem(root))} (artefato; fonte em js/ficha/)')


def checa_roundtrip():
    print('[5] Round-trip data/*.json -> pages/*.html')
    tmp = tempfile.mkdtemp(prefix='khalkaria_rt_')
    try:
        for d in ('data', 'templates'):
            shutil.copytree(os.path.join(ROOT, d), os.path.join(tmp, d))
        for f in FONTES_DOCS:            # fonte de gerador fora de data/ (ficha física das perícias)
            os.makedirs(os.path.dirname(os.path.join(tmp, f)), exist_ok=True)
            shutil.copy2(os.path.join(ROOT, f), os.path.join(tmp, f))
        # o catálogo é artefato: nasce do zero no tmp, sem herdar o do repo
        shutil.rmtree(os.path.join(tmp, 'data', 'catalogo'), ignore_errors=True)
        for art in ARTEFATOS_DATA:
            if os.path.exists(os.path.join(tmp, art)):
                os.remove(os.path.join(tmp, art))
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
        for art in ARTEFATOS_DATA:
            a, b = os.path.join(tmp, art), os.path.join(ROOT, art)
            if not (os.path.exists(a) and os.path.exists(b) and filecmp.cmp(a, b, shallow=False)):
                print(f'  FALHA  {art}: difere do gerado (editado à mão? rode build.py)')
                divergiu += 1
            else:
                cat_ok += 1
        if divergiu:
            falhas.append('roundtrip')
        else:
            print(f'  OK     {n_ok} páginas e {cat_ok} catálogos (data/catalogo + {", ".join(ARTEFATOS_DATA)}) '
                  f'idênticos ao gerado a partir do JSON')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    # saída em pipe/arquivo no Windows vem em cp1252 e as mensagens têm '∪', '∩', '→'...
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except (AttributeError, ValueError):
        pass
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
    checa_artefato_js()
    print()
    checa_blocos()
    print()
    checa_conteudo_contrato()
    print()
    checa_balanceamento()
    print()
    checa_efeitos_itens()
    print()
    checa_vhelor()
    print()
    checa_estilo()
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
