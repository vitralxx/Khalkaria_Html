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
  9. Guarda-fio: os 3 blocos decididos D80–D82 (modificador, vantagem/
     desvantagem, custo mínimo de magia) continuam em data/sistema.json

Uso:
  python validar.py [repo_root]
  python validar.py . --skip-roundtrip
Saída: exit 0 = tudo OK; exit 1 = há falhas.
"""
import os, re, sys, json, glob, shutil, filecmp, subprocess, tempfile
import shell
from html.parser import HTMLParser

TOOLS = os.path.dirname(os.path.abspath(__file__))
ROOT = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else os.path.dirname(TOOLS)
FLAGS = {a for a in sys.argv[1:] if a.startswith('--')}
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
        'meta', 'param', 'source', 'track', 'wbr'}

# páginas geradas por gerador -> script que as produz (para o round-trip)
GERADORES = ['gerar_sistema.py', 'gerar_magias.py', 'gerar_condicoes.py', 'gerar_limiar.py',
             'gerar_classes.py', 'gerar_racas.py', 'gerar_origens.py']
# O Bazar entra no build padrão, mas não no round-trip: o gerador dele lê o CSV
# e grava data/bazar.json na raiz do repo (não recebe repo_root), então
# regenerá-lo aqui sobrescreveria o artefato real. A integridade do bazar.json
# é checada em checa_bazar_inv().
FORA_ROUNDTRIP = {'pages/bazar.html'}

falhas = []


def rel(p):
    return os.path.relpath(p, ROOT).replace(os.sep, '/')


def paginas():
    fs = sorted(glob.glob(os.path.join(ROOT, 'pages', '**', '*.html'), recursive=True))
    idx = os.path.join(ROOT, 'index.html')
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

        ids = re.findall(r'\bid="([^"]+)"', h)
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


# Blocos que o Pedro decidiu (D80–D82) e gravou na página Sistema do Notion; a
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
        'A única exceção é a magia de Nível 1 conjurada em intensidade Normal e sem modulação, que custa 0 Éter.',
        'Magias de Nível 1 não possuem a intensidade Contida.',
    ],
}


def checa_blocos_sistema(root=None):
    """[9] Guarda-fio: os blocos D80–D82 do Sistema (snapshot por frase)."""
    root = root or ROOT
    print('[9] Guarda-fio dos blocos D80–D82 (data/sistema.json)')
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


def checa_roundtrip():
    print('[5] Round-trip data/*.json -> pages/*.html')
    tmp = tempfile.mkdtemp(prefix='khalkaria_rt_')
    try:
        for d in ('data', 'templates'):
            shutil.copytree(os.path.join(ROOT, d), os.path.join(tmp, d))
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
        if divergiu:
            falhas.append('roundtrip')
        else:
            print(f'  OK     {n_ok} páginas idênticas ao gerado a partir do JSON')
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
    if '--skip-roundtrip' not in FLAGS:
        checa_roundtrip()
    print()
    if falhas:
        print(f'RESULTADO: {len(set(falhas))} item(ns) com falha.')
        sys.exit(1)
    print('RESULTADO: tudo OK.')
