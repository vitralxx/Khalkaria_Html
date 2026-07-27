#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Motor de diff de snapshots do Notion — economia de tokens na sincronização.

Buscar do Notion exige a ferramenta MCP `notion-fetch` (só o Claude chama). Este
script NÃO busca — ele COMPARA. Fluxo recorrente:

  1. Claude busca cada página e salva em  notion_cache/<slug>.new.md
  2. python sync_notion.py report     -> mostra só as páginas que MUDARAM + hunks
     (páginas iguais = custo ~0; páginas sem .base = seed automático do baseline)
  3. Claude aplica as mudanças em data/*.json e roda os geradores
  4. python sync_notion.py accept     -> promove todos os .new -> .base (novo baseline)

Comandos:
  status   quais slugs têm .base / .new
  seed     copia .new -> .base para quem ainda não tem baseline (sem diff)
  report   diff normalizado .base vs .new (só mudanças). Novos viram baseline.
  accept [slug]   promove .new -> .base (todos, ou um slug)
"""
import sys, os, re, json, difflib

ROOT = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(ROOT, 'notion_cache')
PAGES = {k: v for k, v in json.load(open(os.path.join(CACHE, 'pages.json'), encoding='utf-8')).items()
         if not k.startswith('_')}

def path(slug, kind):
    p = os.path.join(CACHE, slug.replace('/', '__') + f'.{kind}.md')
    return p

def norm(t):
    """Normaliza p/ diff estável: remove timestamp do fetch e URLs de imagem S3
    (que mudam a cada busca), colapsa espaços. Preserva o texto/valores."""
    t = re.sub(r'as of \d{4}-\d\d-\d\dT[0-9:.\-]+Z?', 'as of <ts>', t)
    t = t.replace('\\n', '\n').replace('\\t', ' ').replace('\\"', '"')
    t = re.sub(r'https://prod-files-secure\.s3[^\s")]+', '<img-s3>', t)
    t = re.sub(r'[ \t]+', ' ', t)
    return '\n'.join(l.strip() for l in t.splitlines() if l.strip())

def read(slug, kind):
    p = path(slug, kind)
    return norm(open(p, encoding='utf-8').read()) if os.path.exists(p) else None

def cmd_status():
    for slug in PAGES:
        b = 'base' if os.path.exists(path(slug, 'base')) else '  —  '
        n = 'new'  if os.path.exists(path(slug, 'new'))  else ' — '
        print(f'  [{b}] [{n}]  {slug}')

def cmd_seed():
    for slug in PAGES:
        if os.path.exists(path(slug, 'new')) and not os.path.exists(path(slug, 'base')):
            open(path(slug, 'base'), 'w', encoding='utf-8').write(open(path(slug, 'new'), encoding='utf-8').read())
            print('seed baseline:', slug)

def cmd_report():
    mudou = 0
    for slug in PAGES:
        base, new = read(slug, 'base'), read(slug, 'new')
        if new is None:
            continue
        if base is None:
            open(path(slug, 'base'), 'w', encoding='utf-8').write(open(path(slug, 'new'), encoding='utf-8').read())
            print(f'\n=== {slug}: baseline criado (1ª vez, sem diff) ===')
            continue
        if base == new:
            continue
        mudou += 1
        diff = difflib.unified_diff(base.splitlines(), new.splitlines(),
                                    fromfile=f'{slug}.base', tofile=f'{slug}.new', lineterm='', n=1)
        hunks = [l for l in diff if l and l[0] in '+-@' and not l.startswith(('+++', '---'))]
        print(f'\n=== {slug}: MUDOU ({len([h for h in hunks if h[0] in "+-"])} linhas) ===')
        print('\n'.join(hunks))
    print(f'\n---\nPáginas com .new: {sum(os.path.exists(path(s,"new")) for s in PAGES)} | mudaram: {mudou}')

def cmd_accept(slug=None):
    alvos = [slug] if slug else list(PAGES)
    for s in alvos:
        if os.path.exists(path(s, 'new')):
            open(path(s, 'base'), 'w', encoding='utf-8').write(open(path(s, 'new'), encoding='utf-8').read())
            print('baseline atualizado:', s)

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'report'
    {'status': cmd_status, 'seed': cmd_seed, 'report': cmd_report,
     'accept': lambda: cmd_accept(sys.argv[2] if len(sys.argv) > 2 else None)}.get(cmd, cmd_report)()
