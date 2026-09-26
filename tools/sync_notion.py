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
  cobertura [slug] Notion atual x página gerada: trechos do Notion que o site não
                  publica (resumo, omissão, divergência antiga). Rodar em TODO sync,
                  junto com o report: o report só compara Notion com Notion.
"""
import sys, os, re, json, difflib

TOOLS = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(TOOLS)
CACHE = os.path.join(ROOT, 'notion_cache')
PAGES = {k: v for k, v in json.load(open(os.path.join(CACHE, 'pages.json'), encoding='utf-8')).items()
         if not k.startswith('_')}

def path(slug, kind):
    """Caminho do snapshot. Layout canônico = subpasta (notion_cache/classes/monge.new.md).
    Aceita o layout antigo achatado (classes__monge.new.md) se já existir em disco,
    para não invalidar baselines gravados antes da padronização."""
    sub = os.path.join(CACHE, *slug.split('/')) + f'.{kind}.md'
    flat = os.path.join(CACHE, slug.replace('/', '__') + f'.{kind}.md')
    if not os.path.exists(sub) and os.path.exists(flat):
        return flat
    os.makedirs(os.path.dirname(sub), exist_ok=True)
    return sub

def norm(t):
    """Normaliza p/ diff estável: tira o que muda a cada busca sem o conteúdo ter
    mudado — timestamp, URLs S3, o verbo da ferramenta MCP, metadados de ícone e
    variação tipográfica de aspas. Preserva integralmente texto e valores."""
    t = re.sub(r'as of \d{4}-\d\d-\d\dT[0-9:.\-]+Z?', 'as of <ts>', t)
    t = t.replace('\\n', '\n').replace('\\t', ' ').replace('\\"', '"')
    t = re.sub(r'https://prod-files-secure\.s3[^\s")]+', '<img-s3>', t)
    # o preâmbulo já veio como 'view' e como 'fetch' conforme a versão do MCP
    t = re.sub(r'(Here is the result of )"\w+"', r'\1"<op>"', t)
    # <iconMetadata> passou a ser emitido em 2026; é metadado, não conteúdo
    t = re.sub(r'<iconMetadata>.*?</iconMetadata>\s*', '', t, flags=re.S)
    # aspas/apóstrofos curvos vs retos não são divergência (CLAUDE.md §6)
    t = t.translate(str.maketrans({'‘': "'", '’': "'", '“': '"', '”': '"'}))
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

# ---------------------------------------------------------------------------
# cobertura: Notion atual x SITE (não snapshot x snapshot).
# O `report` só enxerga o que mudou no Notion entre duas buscas; texto que o site
# já tinha resumido, omitido ou deixado para trás passa calado. Aqui cada linha,
# célula e sentença do snapshot mais recente tem de aparecer na página gerada.
# ---------------------------------------------------------------------------
import html as _html

def pagina(slug):
    """slug do manifesto -> página gerada que publica aquele conteúdo."""
    topo, _, sub = slug.partition('/')
    if topo in ('origens',):
        return os.path.join(ROOT, 'pages', 'origens.html')
    if topo == 'criacao':
        return os.path.join(ROOT, 'pages', 'criacao.html')
    if sub:
        return os.path.join(ROOT, 'pages', topo, sub + '.html')
    return os.path.join(ROOT, 'pages', topo + '.html')

# Blocos do Notion que o site NÃO publica por decisão registrada.
FORA = {
    # D11/D33: efeito de carta rara só entra pelo script de revelação.
    # O "Resumo" diz FOR 14+ e o catálogo diz 16+ (CLAUDE.md §9): vale o catálogo.
    'limiar': [(r'^## ⭐ Cartas Raras', r'^## <span underline="true">O Abismo')],
}

def _nz(s):
    s = _html.unescape(s)
    s = s.translate(str.maketrans({'‘': "'", '’': "'", '“': '"', '”': '"', ' ': ' ', '−': '-'}))
    s = re.sub(r'<[^>]+>', ' ', s)
    s = s.replace('\\', '').replace('*', '').replace('`', '')
    s = re.sub(r'\s+', ' ', s).strip().lower()
    # vírgula entra aqui porque o espaço depois dela não é conteúdo: chip de stats
    # (<span>Médio</span><span class="sep">,</span><span>15 HP</span>) vira
    # "Médio , 15 HP" ao trocar tag por espaço, e o Notion escreve "Médio,15 HP"
    s = re.sub(r'\s*([()+×/=,])\s*', r'\1', s)
    s = re.sub(r'(\d)\s+m\b', r'\1m', s)
    return re.sub(r'\s+([.,;:)])', r'\1', s)

_ABREV = r'(?<!mod\.)(?<!max\.)(?<!máx\.)(?<!ex\.)(?<!min\.)'

def fragmentos(slug):
    p = path(slug, 'new')
    if not os.path.exists(p):
        p = path(slug, 'base')
    t = open(p, encoding='utf-8').read()
    t = t.replace('\\n', '\n').replace('\\t', '\t').replace('\\"', '"')
    t = t.split('<content>', 1)[-1]
    for ini, fim in FORA.get(slug, []):
        t = re.sub(ini + r'.*?(?=' + fim + ')', '', t, flags=re.S | re.M)
    t = re.sub(r'<(td|/td|tr[^>]*|/tr|br|summary|/summary|details|/details|li|/li|p|/p)>', '\n', t)
    t = re.sub(r'<[^>]+>', ' ', t)
    out = []
    for linha in t.split('\n'):
        linha = re.sub(r'^[#>\-\s]+', '', linha.strip())
        linha = re.sub(r'!?\[([^\]]*)\]\([^)]*\)', r'\1', linha)
        linha = re.sub(r'^`?Modulações aplicáveis:\s*', '', linha)   # o site dá rótulo próprio à lista
        if len(linha) < 25 or linha.startswith('$') or linha.endswith(':'):
            continue          # títulos, rótulos e fórmulas LaTeX (o site as reescreve em <code>)
        out.append(linha)
    return out

def cmd_cobertura(slug=None):
    alvos = [slug] if slug else [s for s in PAGES if os.path.exists(path(s, 'new')) or os.path.exists(path(s, 'base'))]
    total = 0
    for s in alvos:
        pg = pagina(s)
        if not os.path.exists(pg):
            print(f'\n=== {s}: página {os.path.relpath(pg, ROOT)} não existe ===')
            continue
        site = open(pg, encoding='utf-8').read()
        site = _nz(re.sub(r'<script.*?</script>|<style.*?</style>', ' ', site, flags=re.S))
        faltam = []
        for f in fragmentos(s):
            nf = _nz(f)
            if nf in site:
                continue
            sents = [x for x in re.split(_ABREV + r'(?<=[.!?])\s+', nf) if len(x) >= 25]
            ruins = [x for x in sents if x not in site]
            if ruins:
                faltam.append((f, ruins))
        total += len(faltam)
        if faltam:
            print(f'\n=== {s}: {len(faltam)} trecho(s) do Notion fora de {os.path.relpath(pg, ROOT)} ===')
            for f, ruins in faltam:
                print('  -', f[:220])
    print(f'\n---\nTrechos do Notion sem correspondência no site: {total}'
          '\n(abreviação de estilo também aparece aqui; divergência é mudança de número ou regra)')

if __name__ == '__main__':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        pass
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'report'
    arg = sys.argv[2] if len(sys.argv) > 2 else None
    {'status': cmd_status, 'seed': cmd_seed, 'report': cmd_report,
     'accept': lambda: cmd_accept(arg),
     'cobertura': lambda: cmd_cobertura(arg)}.get(cmd, cmd_report)()
