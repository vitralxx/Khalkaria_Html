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
  6. Sidebar: todas as páginas com o mesmo conjunto de links de navegação

Uso:
  python validar.py [repo_root]
  python validar.py . --skip-roundtrip
Saída: exit 0 = tudo OK; exit 1 = há falhas.
"""
import os, re, sys, glob, shutil, filecmp, subprocess, tempfile
import shell
from html.parser import HTMLParser

TOOLS = os.path.dirname(os.path.abspath(__file__))
ROOT = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else os.path.dirname(TOOLS)
FLAGS = {a for a in sys.argv[1:] if a.startswith('--')}
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
        'meta', 'param', 'source', 'track', 'wbr'}

# páginas geradas por gerador -> script que as produz (para o round-trip)
GERADORES = ['gerar_magias.py', 'gerar_condicoes.py', 'gerar_limiar.py',
             'gerar_classes.py', 'gerar_racas.py', 'gerar_origens.py']
# o Bazar é mantido pelo Pedro fora deste fluxo (CLAUDE.md §3)
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


def checa_sidebar():
    print('[6] Consistência da navegação (sidebar)')
    conjuntos = {}
    for f in paginas():
        h = open(f, encoding='utf-8').read()
        m = re.search(r'<nav class="sidebar".*?</nav>', h, re.S)
        if not m:
            print(f'  AVISO  {rel(f)}: sem <nav class="sidebar">')
            continue
        # normaliza: resolve o href para caminho absoluto no repo (o prefixo
        # relativo muda por profundidade) e ignora a classe .active
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
    if '--skip-roundtrip' not in FLAGS:
        checa_roundtrip()
    print()
    if falhas:
        print(f'RESULTADO: {len(set(falhas))} item(ns) com falha.')
        sys.exit(1)
    print('RESULTADO: tudo OK.')
