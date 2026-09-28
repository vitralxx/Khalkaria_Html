"""Orçamento de técnica geral: mix de tipos de ação e custos nas 6 classes (sem o Batedor).
Entrada: estrutura_classes.json (extraído das páginas de classe do Notion, 2026-09-28).
Classifica cada técnica pela coluna Ação e tira o custo em Stamina da coluna Custo."""
import json, re, os, statistics as st, collections
AQUI = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(AQUI, 'estrutura_classes.json'), encoding='utf-8'))
CL = ['espadachim', 'brutalista', 'teurgo', 'monge', 'alquimista', 'artilheiro']
def tipo(acao, custo):
    a = acao.lower()
    if 'reação' in a or 'reacao' in a: return 'reação'
    if 'livre' in a: return 'ação livre'
    if re.search(r'descanso|minuto|min\.', a): return 'fora de combate'
    if re.search(r'[23] ações|2 ações|\+1 ação', a): return '2+ ações'
    if '1 ação' in a or '1 ações' in a: return '1 ação'
    if 'passiva' in a: return 'passiva'
    return 'outro:' + acao
def stamina(custo):
    m = re.search(r'(\d+)\+?\s*Stamina', custo)
    return int(m.group(1)) if m else None
tab = collections.OrderedDict(); custos = collections.defaultdict(list)
for c in CL:
    cnt = collections.Counter()
    for t in d[c]['tecnicas']:
        k = tipo(t['acao'], t['custo']); cnt[k] += 1
        s = stamina(t['custo'])
        if s is not None: custos[k].append(s)
    tab[c] = cnt
tipos = ['passiva', '1 ação', 'ação livre', 'reação', '2+ ações', 'fora de combate']
print(f'{"classe":12s}' + ''.join(f'{x:>16s}' for x in tipos) + '   total')
for c, cnt in tab.items():
    print(f'{c:12s}' + ''.join(f'{cnt.get(x,0):16d}' for x in tipos) + f'   {sum(cnt.values())}')
print(f'{"média":12s}' + ''.join(f'{st.mean([tab[c].get(x,0) for c in CL]):16.1f}' for x in tipos))
print('\nCusto em Stamina por tipo (média · faixa · n)')
for k in tipos:
    v = custos.get(k, [])
    if v: print(f'  {k:16s} {st.mean(v):4.1f} · {min(v)}–{max(v)} · n={len(v)}')

# Quantas das 15 conversam com a característica de classe (palavra-chave no texto, no custo ou na ação)
CHAVE = {'espadachim': r'Marca do Duelo|espada',
         'brutalista': r'Brutalidade',
         'teurgo': r'magia|Éter|conjur|escola',
         'monge': r'Fluxo|desarmad',
         'alquimista': r'alquímic|Reagente|poç|óleo',
         'artilheiro': r'Concentração'}
print('\nTécnicas gerais que conversam com a característica de classe')
for c in CL:
    n = [t['nome'] for t in d[c]['tecnicas'] if re.search(CHAVE[c], t['texto'] + ' ' + t['custo'] + ' ' + t['acao'], re.I)]
    print(f'  {c:12s} {len(n):2d}/15  ({CHAVE[c]})')
