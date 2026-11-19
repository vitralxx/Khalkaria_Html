"""Levanta toda menção de bônus em perícia, Evasão e CD nos dados do site (`main`).

Uso: git archive origin/main data | tar -x -C <dir>; python3 -I stack_pericias.py <dir>/data <saida.json>
Resultado: as fontes com o trecho (técnicas, marcas, ultimates, raças, origens, Limiar, magias) e os mods de item.
A classificação (permanente, por uso, de grupo) é manual: ver `26-stack-de-pericias.md` na memória.
"""
"""
import json, re, sys, collections, unicodedata

D = sys.argv[1]
OUT = sys.argv[2]


def sem_acento(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')


def limpa(t):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', t or '')).strip()


PERICIAS = {
    'atacar': r'atacar|acerto|acertar',
    'defender': r'defender',
    'movimento': r'movimento',
    'fortitude': r'fortitude',
    'vontade': r'vontade',
    'reflexos': r'reflexos?',
    'percepcao': r'percepcao',
    'sobrevivencia': r'sobrevivencia',
    'furtividade': r'furtividade',
    'crime': r'crime',
    'iniciativa': r'iniciativa',
    'conhecimento': r'conhecimento',
    'medicina': r'medicina',
    'investigacao': r'investigacao',
    'religiao': r'religiao',
    'mistico': r'mistico',
    'convencimento': r'convencimento',
    'intimidacao': r'intimidacao',
    'intuicao': r'intuicao',
    'enganacao': r'enganacao',
    'motivar': r'motivar',
    'oficio': r'oficio',
    'TODOS': r'todos os (?:seus )?testes|todas as (?:suas )?pericias|qualquer teste',
    'GRUPO': r'testes? fisicos?|testes? mentais?|testes? de resistencia|pericias? sociais?|interacao social|testes? de (?:forca|destreza|constituicao|inteligencia|sabedoria)',
    'evasao': r'evasao',
    'CD': r'\bcd\b(?! \d)',
}
PER_ALT = '|'.join(f'(?P<{k}>{v})' for k, v in PERICIAS.items())
LIGA = r'\s*(?:(?:de|em|no|na|nos|nas|ao|a|para|à|sua|seu|suas|seus|o|os|testes?|rolagens?|acerto|valor|bonus)\s+){0,4}'
NUM = r'(?P<num>[+\-−]\s?\d+(?:d\d+)?)'
PADROES = [
    ('num', re.compile(NUM + LIGA + r'(?:' + PER_ALT + r')\b', re.I)),
    ('num_pos', re.compile(r'(?:' + PER_ALT + r')\s*(?:\(\w+\))?\s*' + NUM + r'\b', re.I)),
    ('treino', re.compile(r'(?:treinad[oa]s?|treinamento|experiente|mestre|lendari[oa])\s*(?:\d+\s*)?(?:nivel de treinamento\s*)?(?:em|no|na|nos|nas)\s+(?P<lista>[^.;:]{0,90})', re.I)),
    ('vantagem', re.compile(r'(?<!des)vantagem\s*(?:em|no|na|nos|nas|ao|para)\s+(?P<lista>[^.;]{0,70})', re.I)),
    ('soma_dado', re.compile(r'(?:rolar|role|soma[r]?|adicion\w*)\s+(?:um\s+)?(?P<num>\d?d\d+)\s+(?:e\s+)?(?:somar|soma|adicionar|ao|a|no|em)\s+(?:o\s+|um\s+|seu\s+)?(?:resultado|teste|rolagem)', re.I)),
]


def achar(txt):
    base = sem_acento(txt)
    hits = []
    for nome, rx in PADROES:
        for m in rx.finditer(base):
            gd = m.groupdict()
            pers = [k for k in PERICIAS if gd.get(k)]
            if nome in ('treino', 'vantagem'):
                lista = gd['lista']
                pers = [k for k, v in PERICIAS.items() if re.search(r'\b(?:' + v + r')\b', lista, re.I)]
                if not pers:
                    continue
            a, b = max(0, m.start() - 70), min(len(base), m.end() + 70)
            hits.append({'padrao': nome, 'pericias': pers, 'num': gd.get('num'), 'trecho': txt[a:b]})
    return hits


fontes = []


def add(tipo, id_, nome, texto, **meta):
    fontes.append({'tipo': tipo, 'id': id_, 'nome': nome, 'texto': limpa(texto), **meta})


for t in ['tecnica', 'marca', 'ultimate', 'origem', 'traco', 'tecnologia', 'variante', 'subespecie',
          'corrupcao', 'carta', 'beneficio', 'dor', 'magia', 'raca']:
    for e in json.load(open(f'{D}/catalogo/{t}.json'))['entradas']:
        meta = {k: e.get(k) for k in ('classe', 'ramo', 'tier', 'grupo', 'custoTexto', 'raca', 'categoria', 'reqTexto', 'nivel', 'escola') if e.get(k) is not None}
        txt = e.get('resumo') or ''
        if t == 'magia':
            txt += ' ' + json.dumps(e.get('stats'), ensure_ascii=False) + ' ' + json.dumps(e.get('modulacoes'), ensure_ascii=False)
        add(t, e['id'], e['nome'], txt, **meta)

# características de classe (fora do catálogo de técnicas?)
import glob, os
for f in sorted(glob.glob(f'{D}/classes/*.json')):
    c = json.load(open(f))['classe']
    for k in ('caracteristicas', 'recurso'):
        v = c.get(k)
        if v:
            add('classe-' + k, c['id'] + '-' + k, c['nome'], json.dumps(v, ensure_ascii=False), classe=c['id'])

# itens: mods estruturados
ef = json.load(open(f'{D}/efeitos.json'))['porId']
ALVOS_ITEM = re.compile(r'^(pericia\.|todosOsTestes|testes\.|evasao|atributo\.|permiteSemTreino|ataque\.bonusAtacar)')
itens = []
for iid, e in ef.items():
    mods = list(e.get('mods') or [])
    cons = (e.get('consumo') or {}).get('mods') or []
    for origem, lst in (('equip', mods), ('consumo', cons)):
        for m in lst:
            alvo = m.get('alvo') or m.get('target') or ''
            if ALVOS_ITEM.search(alvo):
                itens.append({'id': iid, 'via': origem, 'mod': m, 'quando': e.get('quando'), 'slot': e.get('slot'),
                              'usos': e.get('usos'), 'duracao': e.get('duracao'), 'texto': e.get('texto')})

res = {'fontes': [], 'itens': itens}
for f in fontes:
    h = achar(f['texto'])
    if h:
        res['fontes'].append({**{k: v for k, v in f.items() if k != 'texto'}, 'hits': h, 'texto': f['texto']})

json.dump(res, open(OUT, 'w'), ensure_ascii=False, indent=1)
cont = collections.Counter(f['tipo'] for f in res['fontes'])
print('fontes com menção:', len(res['fontes']), dict(cont))
print('mods de item:', len(itens), collections.Counter(i['mod'].get('alvo') for i in itens).most_common(40))
