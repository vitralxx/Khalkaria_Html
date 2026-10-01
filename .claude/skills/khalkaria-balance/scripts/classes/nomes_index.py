"""Colisão de nome: todo nome novo de técnica, marca, magia ou item precisa ser único no sistema inteiro.

Uso (da raiz do repo ou de qualquer lugar):
    python3 .claude/skills/khalkaria-balance/scripts/classes/nomes_index.py "Passo em Falso" "Tocaia"
    python3 ... nomes_index.py --dumps <pasta> "Nome"     # soma dumps do Notion (Sistema, Magias, classes)

Fontes: data/*.json, data/classes/*.json, data/racas/*.json (site), o CSV do Bazar (references/bazar-v26.csv),
estrutura_classes.json (as 7 classes do Notion) e, com --dumps, os nomes em negrito, itálico e célula de tabela
de cada .txt da pasta. Compara sem acento e sem caixa. "COLIDE" = nome igual; "parcial" = o nome aparece dentro
de outro (ex.: "Rastreador" em "Rastreador Sobrenatural").
"""
import json, glob, csv, re, unicodedata, sys, os

AQUI = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.normpath(os.path.join(AQUI, '..', '..'))
REPO = os.path.normpath(os.path.join(SKILL, '..', '..', '..'))

def norm(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9 ]+', ' ', s).strip()

idx = {}
def add(nome, onde):
    if isinstance(nome, str) and nome.strip():
        idx.setdefault(norm(nome), set()).add(onde)

def walk(o, onde):
    if isinstance(o, dict):
        for k, v in o.items():
            if k in ('nome', 'name', 'titulo') and isinstance(v, str): add(v, onde)
            walk(v, onde)
    elif isinstance(o, list):
        for v in o: walk(v, onde)

args = sys.argv[1:]
dumps = None
if args[:1] == ['--dumps']:
    dumps, args = args[1], args[2:]

for f in glob.glob(os.path.join(REPO, 'data', '*.json')) + glob.glob(os.path.join(REPO, 'data', 'classes', '*.json')) \
        + glob.glob(os.path.join(REPO, 'data', 'racas', '*.json')):
    if f.endswith('bazar.json') or f.endswith('schema.json'): continue
    walk(json.load(open(f, encoding='utf-8')), os.path.basename(f))
for row in csv.DictReader(open(os.path.join(SKILL, 'references', 'bazar-v26.csv'), encoding='utf-8')):
    add(row['Nome'], 'bazar')
# As 20 magias de Nível 1 (D68) ainda não estão em data/magias.json.
walk(json.load(open(os.path.join(SKILL, 'references', 'magias-nivel1.json'), encoding='utf-8')), 'magias-nivel1')
d = json.load(open(os.path.join(AQUI, 'estrutura_classes.json'), encoding='utf-8'))
for c, v in d.items():
    for t in v['tecnicas']: add(t['nome'], c + ':tecnica')
    for tier, lst in v['tiers'].items():
        for t in lst: add(t['nome'], f'{c}:T{tier}:{t["ramo"]}')
    for m in v['marcas']: add(m['nome'], c + ':marca')
if dumps:
    for f in glob.glob(os.path.join(dumps, '*.txt')):
        txt = open(f, encoding='utf-8').read(); b = os.path.basename(f)
        for m in re.findall(r'<span underline="true">([^<]{3,60})</span>', txt): add(re.sub(r'\s*\(.*$', '', m), b + ':sub')
        for m in re.findall(r'\*\*([^*]{3,40})\*\*', txt): add(m, b + ':negrito')
        for m in re.findall(r'<td>([^<]{3,40})</td>', txt): add(m, b + ':td')

if not args:
    print(len(idx), 'nomes no índice'); sys.exit(0)
for q in args:
    n = norm(q)
    if n in idx:
        print(f'{q!r}: COLIDE {sorted(idx[n])}')
        continue
    part = {k: sorted(v)[:3] for k, v in idx.items() if n in k.split() or (len(n) > 5 and n in k)}
    print(f'{q!r}:', ('parcial ' + str(dict(list(part.items())[:6]))) if part else 'livre')
