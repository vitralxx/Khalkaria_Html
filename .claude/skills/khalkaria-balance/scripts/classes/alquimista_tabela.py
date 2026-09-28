"""Tabela de itens alquímicos do Notion × CSV do Bazar.

Uso: python3 alquimista_tabela.py <dump do notion-fetch da página Alquimista> [--escrever]
Lê a "Tabela de itens alquímicos" (nível pela linha vermelha "Nível N"), compara Reagentes e CD com o CSV
(references/bazar-v26.csv, itens com Tipo de Craft = Alquimia) e, com --escrever, regrava
references/alquimista-notion.json ({nome: {nivel, reagentes, cd}}).
"""
import csv, json, os, re, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
REF = os.path.normpath(os.path.join(AQUI, '..', '..', 'references'))
dump = open(sys.argv[1], encoding='utf-8').read()
i = dump.index('Tabela de itens alquímicos'); j = dump.index('</table>', i)
tab = {}; nivel = None
for tr in re.findall(r'<tr[^>]*>(.*?)</tr>', dump[i:j], re.S):
    tds = [re.sub(r'<[^>]+>|\*', '', t).strip() for t in re.findall(r'<td>(.*?)</td>', tr, re.S)]
    m = re.match(r'Nível (\d)', tds[0])
    if m: nivel = int(m.group(1)); continue
    if not tds[2].isdigit(): continue          # cabeçalho e sub-seções
    tab[tds[0]] = {'nivel': nivel, 'reagentes': int(tds[2]), 'cd': int(tds[3])}
csvi = {}
for r in csv.DictReader(open(os.path.join(REF, 'bazar-v26.csv'), encoding='utf-8')):
    if r['Tipo de Craft'] == 'Alquimia':
        m = re.match(r'(\d+)x Reagente', r['Ingredientes'])
        csvi[r['Nome']] = {'reagentes': int(m.group(1)) if m else None, 'cd': int(r['CD de Craft']) if r['CD de Craft'].isdigit() else None}
print('tabela:', len(tab), '| CSV (Alquimia):', len(csvi))
print('só na tabela:', sorted(set(tab) - set(csvi)))
print('só no CSV:', sorted(set(csvi) - set(tab)))
dif = {n: (tab[n]['reagentes'], tab[n]['cd'], csvi[n]['reagentes'], csvi[n]['cd']) for n in set(tab) & set(csvi)
       if (tab[n]['reagentes'], tab[n]['cd']) != (csvi[n]['reagentes'], csvi[n]['cd'])}
print('Reagentes/CD diferentes (tabela R, CD × CSV R, CD):', dif or 'nenhum')
if '--escrever' in sys.argv:
    json.dump(tab, open(os.path.join(REF, 'alquimista-notion.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('alquimista-notion.json regravado')
