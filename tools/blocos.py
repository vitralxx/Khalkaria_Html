#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Blocos estruturados de classe, raça e origem (F1b).

Cada entidade ganha um bloco em data/ com duas espécies de campo:

  * VERBATIM: texto copiado por script do HTML publicado (tools/migrar_f1b.py),
    com a marcação inline que tinha (<strong>, <em>…). O template (classes e
    raças) ou o corpo do card (origens) mostra o campo por um marcador
    {{classe.cd.texto}}, {{raca.movimento.texto}}, {{origem.sins}}. Mudou o
    Notion, muda-se o campo no JSON; o HTML sai do gerador.
  * DERIVADO: lido dos campos verbatim por estas funções (V/G/R da fórmula,
    perícias como slug, atributos com "ou", ids…). É o que a ficha consome.
    O validar.py recalcula e FALHA se o JSON divergir: rode
        python tools/blocos.py
    para regravar os derivados depois de editar um verbatim.

Nada aqui inventa regra: o que o texto não diz fica None/ausente e o que ainda
não existe no Notion fica com status do vocabulário do plano (§3.2):
`pedroDecide` (recurso do Espadachim e do Teurgo) ou `pendente` com a
`pergunta` feita ao balanceamento (técnica de raça). Campo derivado que sai
None porque o texto é omisso (mínimo, início e recarga dos medidores) tem de
estar coberto por uma pergunta de tools/pendentes_balanceamento.json.
"""
import glob, json, os, re, sys

TOOLS = os.path.dirname(os.path.abspath(__file__))
if TOOLS not in sys.path:
    sys.path.insert(0, TOOLS)
from kf_marca import texto, EMOJI   # noqa: E402
from shell import slugify           # noqa: E402

RAIZ = os.path.dirname(TOOLS)
CLASSES = ['espadachim', 'monge', 'batedor', 'alquimista', 'teurgo', 'artilheiro', 'brutalista']
RACAS = ['humano', 'anao', 'dryad', 'gruto', 'corrompido', 'automato', 'inseto']

# ------------------------------------------------------------------ marcadores
RE_MARCA = re.compile(r'\{\{(classe|raca|origem)((?:\.[A-Za-z0-9_]+)+)\}\}')


def _passo(p):
    return int(p) if p.isdigit() else p


def pega(bloco, caminho):
    v = bloco
    for p in caminho.split('.'):
        v = v[_passo(p)]
    return v


def poe(bloco, caminho, valor):
    partes = [_passo(p) for p in caminho.split('.')]
    v = bloco
    for p, prox in zip(partes, partes[1:]):
        vazio = [] if isinstance(prox, int) else {}
        if isinstance(p, int):
            while len(v) <= p:
                v.append(None)
            if v[p] is None:
                v[p] = vazio
        else:
            v.setdefault(p, vazio)
        v = v[p]
    p = partes[-1]
    if isinstance(p, int):
        while len(v) <= p:
            v.append(None)
    v[p] = valor


def preenche(txt, ns, bloco, onde=''):
    """Troca os {{ns.caminho}} de `txt` pelo valor do bloco. Marcador sem campo,
    campo que não é texto ou marcador de outro namespace derrubam o gerador."""
    def troca(m):
        if m.group(1) != ns:
            raise SystemExit(f'blocos: {onde}: marcador de outro bloco: {m.group(0)}')
        try:
            v = pega(bloco, m.group(2)[1:])
        except (KeyError, IndexError, TypeError):
            raise SystemExit(f'blocos: {onde}: {m.group(0)} sem campo no JSON')
        if not isinstance(v, str):
            raise SystemExit(f'blocos: {onde}: {m.group(0)} não é texto ({type(v).__name__})')
        return v
    return RE_MARCA.sub(troca, txt)


def marcadores(txt):
    return [m.group(1) + m.group(2) for m in RE_MARCA.finditer(txt)]


# ------------------------------------------------------------------ vocabulário
# Status que um bloco pode gravar (subconjunto do mapa de status do plano §3.2).
STATUS_BLOCO = ('pedroDecide', 'pendente')
# As 24 perícias (CLAUDE.md §2; slug = id do contrato do balanceamento).
PERICIAS = ['Atacar', 'Defender', 'Movimento', 'Fortitude', 'Vontade', 'Reflexos', 'Percepção',
            'Sobrevivência', 'Furtividade', 'Crime', 'Iniciativa', 'Conhecimento', 'Medicina',
            'Investigação', 'Religião', 'Místico', 'Convencimento', 'Intimidação', 'Intuição',
            'Enganação', 'Motivar', 'Ofício (Engenharia)', 'Ofício (Ferraria)', 'Ofício (Alquimia)']
SLUG_PERICIA = {slugify(p): slugify(p) for p in PERICIAS}
# Sistema > Perícias > Interação Social: "possui 5 ramos" (tabela de vertentes).
INTERACAO_SOCIAL = ['convencimento', 'intimidacao', 'intuicao', 'enganacao', 'motivar']
# Ofício(X) virou as 3 perícias concretas (CLAUDE.md §2).
OFICIOS = ['oficio-engenharia', 'oficio-ferraria', 'oficio-alquimia']

ATRIBUTO = {'força': 'FOR', 'for': 'FOR', 'destreza': 'DES', 'des': 'DES',
            'constituição': 'CON', 'con': 'CON', 'inteligência': 'INT', 'int': 'INT',
            'sabedoria': 'SAB', 'sab': 'SAB'}


def _limpo(h):
    return texto(h).strip()


def atributo(nome):
    n = re.sub(r'^mod\.\s*', '', nome.strip().lower())
    if n not in ATRIBUTO:
        raise ValueError(f'atributo desconhecido: {nome!r}')
    return ATRIBUTO[n]


def pericias_de(nome):
    """Um nome de perícia do texto -> lista de slugs, ou 'qualquer'."""
    n = re.sub(r'\s*\(\s*', ' (', nome.strip()).strip().rstrip('.')
    if n.lower() == 'qualquer':
        return 'qualquer'
    m = re.fullmatch(r'Interação Social \((.+)\)', n)
    if m:
        if m.group(1).lower() == 'qualquer':
            return list(INTERACAO_SOCIAL)
        s = slugify(m.group(1))
        if s not in INTERACAO_SOCIAL:
            raise ValueError(f'vertente de Interação Social desconhecida: {nome!r}')
        return [s]
    if re.fullmatch(r'Ofício \(Qualquer\)', n, re.I):
        return list(OFICIOS)
    s = slugify(n)
    if s not in SLUG_PERICIA:
        raise ValueError(f'perícia desconhecida: {nome!r}')
    return [s]


def termo_treino(t):
    """'Sobrevivência ou Percepção' / 'Armas à Distância' / '1 Perícia à sua escolha'."""
    t = t.strip().rstrip('.')
    qtd = 1
    m = re.match(r'^\+?(\d+)\s+(.*)$', t)
    if m:
        qtd, t = int(m.group(1)), m.group(2)
    alts = [a.strip() for a in re.split(r'\s+ou\s+', t)]
    if all(a.startswith('Armas') for a in alts):
        return {'tipo': 'arma', 'quantidade': qtd, 'opcoes': [slugify(a) for a in alts]}
    if re.fullmatch(r'Perícia à sua escolha', t):
        return {'tipo': 'pericia', 'quantidade': qtd, 'opcoes': 'qualquer'}
    opcoes = []
    for a in alts:
        p = pericias_de(a)
        if p == 'qualquer':
            return {'tipo': 'pericia', 'quantidade': qtd, 'opcoes': 'qualquer'}
        opcoes += [x for x in p if x not in opcoes]
    return {'tipo': 'pericia', 'quantidade': qtd, 'opcoes': opcoes}


def treino(h):
    """'Armas Marciais, Movimento, Atacar' -> lista de termos (cada vírgula é um)."""
    return [termo_treino(t) for t in _limpo(h).split(', ')]


def lista_pericias(h):
    """'Vontade, Defender, Iniciativa' -> slugs, na ordem."""
    out = []
    for t in _limpo(h).split(', '):
        out += pericias_de(t)
    return out


def atributos_chave(h):
    """'Des, Sab, Int/Con' -> [['DES'], ['SAB'], ['INT', 'CON']]."""
    return [[atributo(a) for a in re.split(r'\s*/\s*|\s+ou\s+', t)] for t in _limpo(h).split(', ')]


def cd(h):
    """'10 + (Destreza ou Força) + Constituição' -> {base: 10, termos: [[DES, FOR], [CON]]}."""
    partes = [p.strip() for p in _limpo(h).split(' + ')]
    if not partes[0].isdigit():
        raise ValueError(f'CD sem base numérica: {h!r}')
    return {'base': int(partes[0]),
            'termos': [[atributo(a) for a in re.split(r'\s+ou\s+', p.strip('()'))] for p in partes[1:]]}


def quantidade_escolha(h):
    """'1 + Mod. Inteligência' / '1 + Mod.Int' -> {base: 1, atributo: 'INT'}."""
    m = re.fullmatch(r'(\d+) \+ Mod\. ?(\w+)', _limpo(h))
    if not m:
        raise ValueError(f'quantidade de escolha ilegível: {h!r}')
    return {'base': int(m.group(1)), 'atributo': atributo(m.group(2))}


def coeficiente(formula):
    """'10 + (6 × Nível) + (Mod.CON × Nível)' -> 6 (Vitalidade/Vigor/Ressonância)."""
    m = re.match(r'^\d+ \+ \((\d+) × Nível\)', _limpo(formula))
    if not m:
        raise ValueError(f'fórmula sem coeficiente: {formula!r}')
    return int(m.group(1))


def bonus_atributos(h):
    """'+2 Destreza ou Constituição, -1 Sabedoria' -> [{valor, opcoes}];
    '+1 em dois atributos.' -> [{valor: 1, quantidade: 2, opcoes: 'qualquer'}];
    'Varia por Subespécie' -> None."""
    t = _limpo(h)
    if t.startswith('Varia'):
        return None
    m = re.fullmatch(r'\+(\d+) em (um|dois|três) atributos?\.?', t)
    if m:
        return [{'valor': int(m.group(1)), 'quantidade': {'um': 1, 'dois': 2, 'três': 3}[m.group(2)],
                 'opcoes': 'qualquer'}]
    out = []
    for p in t.split(', '):
        m = re.fullmatch(r'([+-]\d+) (.+?)\.?', p.strip())
        if not m:
            raise ValueError(f'bônus de atributo ilegível: {p!r}')
        out.append({'valor': int(m.group(1)), 'opcoes': [atributo(a) for a in re.split(r'\s+ou\s+', m.group(2))]})
    return out


def metros(h):
    """'7,5 metros' / '10,5m' -> 7.5 / 10.5; 'Varia' -> None."""
    t = _limpo(h)
    if t.startswith('Varia'):
        return None
    m = re.fullmatch(r'(\d+(?:,\d+)?)\s*(?:m|metros)', t)
    if not m:
        raise ValueError(f'movimento ilegível: {h!r}')
    v = float(m.group(1).replace(',', '.'))
    return int(v) if v.is_integer() else v


def pericias_raca(h):
    """'Fortitude ou Ofício (Qualquer)' / '1 Interação Social (Qualquer)' / '+1 Qualquer'."""
    t = termo_treino(_limpo(h))
    return {'quantidade': t['quantidade'], 'opcoes': t['opcoes']}


def escala_marca_duelo(h):
    """'+1 Atacar e +1 Defender. No nível 3, +2… No nível 5, +3…' -> [{nivel, atacar, defender}]."""
    t = _limpo(h)
    out = []
    for m in re.finditer(r'(?:(?:No nível (\d+), )|^Contra o alvo marcado você tem )'
                         r'([+-]\d+) Atacar e ([+-]\d+) Defender', t):
        out.append({'nivel': int(m.group(1) or 1), 'atacar': int(m.group(2)), 'defender': int(m.group(3))})
    if not out:
        raise ValueError(f'escala da Marca do Duelo ilegível: {h!r}')
    return out


def escala_escolas(h):
    """'2 Escolas de magia no nível 1, +1 no nível 3 e +2 no nível 5' -> [{nivel, valor}] (verbatim, sem somar)."""
    t = _limpo(h)
    m = re.search(r'(\d+) Escolas de magia no nível (\d+)', t)
    if not m:
        raise ValueError(f'escala das escolas ilegível: {h!r}')
    out = [{'nivel': int(m.group(2)), 'valor': m.group(1)}]
    out += [{'nivel': int(n), 'valor': v} for v, n in re.findall(r'([+-]\d+) no nível (\d+)', t)]
    return out


# ------------------------------------------------------------------ medidores
# Início e recarga do medidor de recurso de classe: só o que o texto DECLARA,
# com a frase casada inteira (sem ela, None; nada de assumir 0 ou "descanso").
INICIO_QUANDO = {'todo combate': 'inicioCombate',
                 'cenas de exploração ou cenas de combate': 'inicioCena'}
RE_INICIO = re.compile(r'Você começa (.+?) com (\d+) de ')
RE_RECARGA = [
    (re.compile(r'^Você recupera todos os \w+ em um descanso longo'),
     lambda m: {'evento': 'descansoLongo', 'valor': 'max'}),
    (re.compile(r'^Você pode (.+?) como sua ação de descanso curto, recuperando (\S+) de \w+'),
     lambda m: {'evento': 'descansoCurto', 'acao': m.group(1), 'formula': m.group(2)}),
    (re.compile(r'^Você perde toda sua \w+ ao fim do combate\.$'),
     lambda m: {'evento': 'fimCombate', 'valor': 0}),
    (re.compile(r'^Ao fim do combate, (se .+?), você perde todo seu \w+\.$'),
     lambda m: {'evento': 'fimCombate', 'valor': 0, 'condicao': m.group(1)}),
]


def _textos_recurso(rec):
    """(caminho, texto limpo) de cada string verbatim do recurso, fora medidores e habilidades."""
    def anda(v, cam):
        if isinstance(v, str):
            yield cam, _limpo(v)
        elif isinstance(v, list):
            for i, x in enumerate(v):
                yield from anda(x, f'{cam}.{i}')
        elif isinstance(v, dict):
            for k, x in v.items():
                yield from anda(x, f'{cam}.{k}')
    for k, v in rec.items():
        if k not in ('id', 'nome', 'status', 'nota', 'medidores', 'habilidades'):
            yield from anda(v, f'recurso.{k}')


def inicio_medidor(rec):
    """'Você começa todo combate com 0 de Fluxo' -> {evento, quando, valor, fonte}; None se omisso."""
    achados = []
    for cam, t in _textos_recurso(rec):
        for m in RE_INICIO.finditer(t):
            if m.group(1) not in INICIO_QUANDO:
                raise ValueError(f'início de medidor ilegível: {m.group(0)!r} ({cam})')
            achados.append({'evento': INICIO_QUANDO[m.group(1)], 'quando': m.group(1),
                            'valor': int(m.group(2)), 'fonte': cam})
    if len(achados) > 1:
        raise ValueError(f'medidor com {len(achados)} frases de início: {[a["fonte"] for a in achados]}')
    return achados[0] if achados else None


def recarga_medidor(rec):
    """Frases de recarga/zeragem por evento -> [{evento, valor|acao+formula, condicao?, fonte}]; None se omisso."""
    out = []
    for cam, t in _textos_recurso(rec):
        for r, faz in RE_RECARGA:
            m = r.search(t)
            if m:
                out.append(faz(m) | {'fonte': cam})
    return out or None


# ------------------------------------------------------------------ Ar natural
RE_AR = [re.compile(r'Ar (\d+) Natural'), re.compile(r'(\d+) de Armadura \(Ar\) Natural'),
         re.compile(r'^(\+\d+) Armadura \(Ar\) Natural'), re.compile(r'^(\d+) Armadura \(Ar\)$')]


def ar_natural(card):
    """Ar natural declarado no corpo de um card (li ou p): [valor, soma?] ou None."""
    for pedaco in re.findall(r'<(?:li|p)>(.*?)</(?:li|p)>', card['corpo'], re.S):
        t = _limpo(pedaco).rstrip('.')
        for r in RE_AR:
            m = r.search(t)
            if m:
                return {'fonte': card['id'], 'valor': int(m.group(1)), 'soma': m.group(1).startswith('+')}
    return None


# ------------------------------------------------------------------ derivados
def _classe_css(opentag):
    m = re.search(r'class="([^"]+)"', opentag)
    return m.group(1).split() if m else []


def deriva_classe(nome, b, cards=None, tpl=None):
    """[(caminho, valor)] derivados do bloco `classe` (verbatim -> estrutura)."""
    d = [('id', f'classe-{nome}'),
         ('atributosChave.lista', atributos_chave(b['atributosChave']['texto']))]
    c = cd(b['cd']['texto'])
    d += [('cd.base', c['base']), ('cd.termos', c['termos'])]
    d += [('treinamento.fixo.termos', treino(b['treinamento']['fixo']['texto'])),
          ('treinamento.escolha.numero', quantidade_escolha(b['treinamento']['escolha']['quantidade'])),
          ('treinamento.escolha.opcoes', lista_pericias(b['treinamento']['escolha']['opcoesTexto']))]
    d += [('V', coeficiente(b['status']['saude'])), ('G', coeficiente(b['status']['stamina'])),
          ('R', coeficiente(b['status']['eter']))]
    rec = b.get('recurso') or {}
    if rec.get('nome'):
        rid = slugify(rec['nome'])
        d += [('recurso.id', rid)]
        ini, rec_ = inicio_medidor(rec), recarga_medidor(rec)
        for i, _ in enumerate(rec.get('medidores', [])):
            d += [(f'recurso.medidores.{i}.id', rid), (f'recurso.medidores.{i}.nome', _limpo(rec['nome'])),
                  (f'recurso.medidores.{i}.min', None),      # nenhum texto declara (pergunta ao balanceamento)
                  (f'recurso.medidores.{i}.inicio', ini), (f'recurso.medidores.{i}.recarga', rec_)]
        for i, h in enumerate(rec.get('habilidades', [])):
            d += [(f'recurso.habilidades.{i}.id', f'{nome}-{slugify(h["nome"])}')]
    for i, f in enumerate(b.get('caracteristicas', [])):
        d += [(f'caracteristicas.{i}.id', f'{nome}-{slugify(f["nome"])}')]
        if f.get('escalaDe') == 'marca-do-duelo':
            d += [(f'caracteristicas.{i}.escala', escala_marca_duelo(f['itens'][1]))]
        if f.get('escalaDe') == 'escolas':
            d += [(f'caracteristicas.{i}.escala', escala_escolas(f['texto'][1]))]
    for i, r in enumerate(b.get('ramos', [])):
        d += [(f'ramos.{i}.id', f'{nome}-{slugify(r["nome"])}')]
    # F1e(c): parágrafo dos ramos -> {marcas, tecnicas, porTier}; cabeçalhos de tier
    regra = ramos_regra(b['ramosTexto']) if b.get('ramosTexto') else None
    if regra is not None:
        d += [('ramosRegra', regra)]
    for i, t in enumerate(b.get('tiers', [])):
        cab = tier_cabecalho(t)
        if regra is not None and cab['nivel'] is not None:
            nv = next((p['nivel'] for p in regra['porTier'] if p['tier'] == cab['tier']), None)
            if nv != cab['nivel']:
                raise ValueError(f'{nome}: tier {cab["tier"]} no nível {cab["nivel"]} pelo cabeçalho '
                                 f'e {nv} pelo parágrafo dos ramos')
        d += [(f'tiers.{i}.{k}', v) for k, v in cab.items()]
    if b.get('requisitosDeCard') and tpl is not None:
        # o card é o primeiro {{CARD_n}} depois do marcador do requisito, no template
        for i, _ in enumerate(b['requisitosDeCard']):
            depois = tpl.split('{{classe.requisitosDeCard.%d.texto}}' % i, 1)
            m = re.search(r'\{\{CARD_(\d+)\}\}', depois[1]) if len(depois) == 2 else None
            if not m:
                raise ValueError(f'requisito {i} sem card depois do marcador no template de {nome}')
            d += [(f'requisitosDeCard.{i}.card', cards[int(m.group(1))]['id'])]
    for i, nv in enumerate(b.get('itensAlquimicos', [])):
        for j, cat in enumerate(nv['categorias']):
            for k, it in enumerate(cat['itens']):
                d += [(f'itensAlquimicos.{i}.categorias.{j}.itens.{k}.id', f'{nome}-{slugify(it["nome"])}')]
    return d


# ------------------------------------------------------------------ F1e(c): ramos e tiers
RE_REGRA_RAMOS = re.compile(r'(\d+) Marcas e (\d+) Técnicas de Ramo \((.+?)\)')
RE_REGRA_TIER = re.compile(r'^(?:e )?(\d+) (Ultimate )?no Tier (\d+), (?:ao chegar ao|no) nível (\d+)$')


def ramos_regra(paragrafos):
    """'… 3 Marcas e 6 Técnicas de Ramo (3 no Tier 1, ao chegar ao nível 2; 2 no
    Tier 2, no nível 4; e 1 Ultimate no Tier 3, no nível 5)' -> {marcas, tecnicas,
    porTier:[{tier, quantidade, nivel, ultimate}]}. Só a frase casada inteira."""
    achados = [m for p in paragrafos for m in RE_REGRA_RAMOS.finditer(_limpo(p))]
    if len(achados) != 1:
        raise ValueError(f'parágrafo dos ramos: {len(achados)} frase(s) de regra (esperado 1)')
    m = achados[0]
    por = []
    for item in m.group(3).split('; '):
        t = RE_REGRA_TIER.match(item.strip())
        if not t:
            raise ValueError(f'parágrafo dos ramos: tier ilegível {item!r}')
        por.append({'tier': int(t.group(3)), 'quantidade': int(t.group(1)), 'nivel': int(t.group(4)),
                    'ultimate': bool(t.group(2))})
    if sum(p['quantidade'] for p in por) != int(m.group(2)):
        raise ValueError(f'parágrafo dos ramos: {m.group(2)} técnicas, mas os tiers somam '
                         f'{sum(p["quantidade"] for p in por)}')
    return {'marcas': int(m.group(1)), 'tecnicas': int(m.group(2)), 'porTier': por}


def tier_cabecalho(t):
    """{'titulo': 'Tier 3 — Ultimates', 'badge': 'Nível 5 • 1x/Dia'} ou {'badge': 'TIER 1'}
    -> {tier, nivel, usos}; o que o cabeçalho não diz fica None."""
    tit = _limpo(t.get('titulo') or '')
    badge = _limpo(t.get('badge') or '')
    m = re.match(r'^Tier (\d+)\b', tit, re.I) or re.fullmatch(r'TIER (\d+)', badge)
    if not m:
        raise ValueError(f'cabeçalho de tier sem número: {t!r}')
    nv = re.fullmatch(r'Nível (\d+)\+?(?: • (.+))?', badge)
    if not nv and not re.fullmatch(r'TIER \d+', badge):
        raise ValueError(f'selo de tier ilegível: {badge!r}')
    return {'tier': int(m.group(1)), 'nivel': int(nv.group(1)) if nv else None,
            'usos': nv.group(2) if nv else None}


# Grupo de cada card de classe pelo tipo (classe CSS do card)
GRUPO_CARD = {'technique-card': 'geral', 'tier-technique': 'ramo', 'tech-card': 'ramo',
              'marca-card': 'marca', 'ultimate-card': 'ultimate'}
# Custo no cabeçalho do card: um e só um destes por card (o nome do padrão diz o formato)
CUSTO_CARD = [
    ('technique-cost', re.compile(r'<div class="technique-cost">(.*?)</div>', re.S)),
    ('meta', re.compile(r'<p class="meta">(.*?)</p>', re.S)),
    ('tech-meta', re.compile(r'<span class="tech-meta">(.*?)</span>', re.S)),
    ('cost', re.compile(r'<span class="cost">(.*?)</span>', re.S)),
    ('ultimate', re.compile(r'<span class="ultimate-badge">ULTIMATE</span>\s*<span[^>]*>(.*?)</span>', re.S)),
]
RE_RAMO_CORPO = re.compile(r'<div class="(?:marca|tech-card|ultimate)-header ([\w-]+)">')
RE_TOK_TPL = re.compile(r'<(/?)(div|h3|h4)\b([^>]*)>|\{\{CARD_(\d+)\}\}|\{\{classe\.tiers\.(\d+)\.\w+\}\}')


def custo_card(corpo):
    """Texto do custo no cabeçalho do card (verbatim sem tags); None na marca.
    O .technique-cost do Espadachim tem um <span> por custo: vão unidos por ' · ',
    o separador que o próprio Espadachim usa no .meta dos cards de tier."""
    achados = [(k, m) for k, r in CUSTO_CARD for m in r.finditer(corpo)]
    if len(achados) > 1:
        raise ValueError(f'card com {len(achados)} custos no cabeçalho: {[k for k, _ in achados]}')
    if not achados:
        return None
    k, m = achados[0]
    if k == 'technique-cost':
        return ' · '.join(_limpo(s) for s in re.findall(r'<span[^>]*>(.*?)</span>', m.group(1), re.S))
    return _limpo(m.group(1))


def _nome_curto_ramo(nome):
    """'🥊 Ramo do Punho' -> 'Punho' (o que os títulos 'Marcas do Punho' / '🥊 Punho' repetem)."""
    limpo = re.sub(r'\s+', ' ', EMOJI.sub('', _limpo(nome))).strip()
    return re.sub(r'^Ramo d[aoe]s? ', '', limpo)


def contexto_cards(tpl, ramos):
    """{n: {'ramo': chave|None, 'tier': índice em classe.tiers|None}} de cada {{CARD_n}}
    pela posição no template: ancestral .ramo-section.ramo-<chave> (Espadachim) ou o
    último título com var(--ramo-<chave>) na mesma seção; tier = o .tier-section que
    contém o card, pelo marcador {{classe.tiers.K…}} do seu cabeçalho."""
    curtos = {r['chave']: _nome_curto_ramo(r['nome']) for r in ramos}
    pilha, titulo, out = [], None, {}
    for m in RE_TOK_TPL.finditer(tpl):
        fecha, tag, attrs, card, tier = m.groups()
        if tag == 'div':
            if fecha:
                if not pilha:
                    raise ValueError('template: </div> sem abertura')
                saiu = pilha.pop()
                if 'tier-section' in saiu['cls']:
                    titulo = None
            else:
                cls = (re.search(r'class="([^"]*)"', attrs) or [None, ''])[1].split()
                pilha.append({'cls': cls, 'tier': None})
                if 'tier-section' in cls or 'section-divider' in cls:
                    titulo = None
        elif tag in ('h3', 'h4') and not fecha:
            v = re.search(r'var\(--ramo-([\w-]+)\)', attrs)
            if v:
                fim = tpl.index(f'</{tag}>', m.end())
                if v.group(1) not in curtos:
                    raise ValueError(f'template: título com var(--ramo-{v.group(1)}) fora dos ramos')
                if curtos[v.group(1)] not in _limpo(tpl[m.end():fim]):
                    raise ValueError(f'template: título {tpl[m.end():fim]!r} com a cor do ramo '
                                     f'{v.group(1)} e sem o nome "{curtos[v.group(1)]}"')
                titulo = v.group(1)
        elif tier is not None:
            ts = next((f for f in reversed(pilha) if 'tier-section' in f['cls']), None)
            if ts is None:
                raise ValueError(f'template: marcador de tier {tier} fora de .tier-section')
            if ts['tier'] not in (None, int(tier)):
                raise ValueError(f'template: .tier-section com os tiers {ts["tier"]} e {tier}')
            ts['tier'] = int(tier)
        elif card is not None:
            anc = [c[len('ramo-'):] for f in pilha if 'ramo-section' in f['cls']
                   for c in f['cls'] if c.startswith('ramo-') and c != 'ramo-section']
            if len(anc) > 1 or (anc and titulo and anc[0] != titulo):
                raise ValueError(f'template: CARD_{card} com ramos {anc} e título {titulo}')
            ts = next((f for f in reversed(pilha) if 'tier-section' in f['cls']), None)
            if ts is not None and ts['tier'] is None:
                raise ValueError(f'template: CARD_{card} num .tier-section sem cabeçalho de tier')
            out[int(card)] = {'ramo': anc[0] if anc else titulo, 'tier': ts['tier'] if ts else None}
    return out


def deriva_cards_classe(nome, b, cards, tpl):
    """[(caminho a partir do doc, valor)]: grupo/ramo/tier/custoTexto de cada card.
    Duas fontes para o ramo (posição no template e classe do cabeçalho no corpo):
    divergindo, ou faltando onde o grupo exige, derruba o build."""
    ctx = contexto_cards(tpl, b['ramos'])
    ids = {r['chave']: r['id'] for r in b['ramos']}
    tiers = [tier_cabecalho(t)['tier'] for t in b.get('tiers', [])]
    if sorted(ctx) != list(range(len(cards))):
        raise ValueError(f'{nome}: {len(cards)} cards e {len(ctx)} marcadores {{{{CARD_n}}}} no template')
    d = []
    for i, c in enumerate(cards):
        grupo = GRUPO_CARD.get(c['tipo'])
        if grupo is None:
            raise ValueError(f'{nome}: card {c["id"]} com tipo {c["tipo"]!r} fora de GRUPO_CARD')
        corpo = RE_RAMO_CORPO.findall(c['corpo'])
        fontes_ramo = set(corpo) | ({ctx[i]['ramo']} if ctx[i]['ramo'] else set())
        if len(corpo) > 1 or len(fontes_ramo) > 1:
            raise ValueError(f'{nome}: card {c["id"]} com ramos divergentes {sorted(fontes_ramo)}')
        ramo = next(iter(fontes_ramo), None)
        if ramo is not None and ramo not in ids:
            raise ValueError(f'{nome}: card {c["id"]} no ramo {ramo!r}, fora de classe.ramos')
        tier = tiers[ctx[i]['tier']] if ctx[i]['tier'] is not None else None
        esperado = {'geral': (False, None), 'marca': (True, None), 'ramo': (True, (1, 2)),
                    'ultimate': (True, (3,))}[grupo]
        if (ramo is not None) != esperado[0] or (tier is None) != (esperado[1] is None) \
                or (tier is not None and tier not in esperado[1]):
            raise ValueError(f'{nome}: card {c["id"]} ({grupo}) com ramo {ramo} e tier {tier}')
        d += [(f'cards.{i}.grupo', grupo), (f'cards.{i}.ramo', ids.get(ramo)),
              (f'cards.{i}.tier', tier), (f'cards.{i}.custoTexto', custo_card(c['corpo']))]
    return d


def _ids_tipo(cards, css):
    return [c['id'] for c in cards if css in _classe_css(c['opentag'])]


def _stats_card(corpo):
    """<div class="label">X</div><div class="value">Y</div> de um card -> {X: Y}."""
    return dict(re.findall(r'<div class="label">([^<]*)</div>\s*<div class="value">(.*?)</div>', corpo, re.S))


def _fisico_card(corpo):
    m = re.search(r'<div class="(?:variant|subspecie)-physical">(.*?)</div>', corpo, re.S)
    if not m:
        return None
    return {k.lower(): v.strip() for k, v in
            re.findall(r'<strong>(Vida|Altura|Peso):</strong>\s*(.*?)\s*(?=·|$)', m.group(1).strip(), re.S)}


def deriva_raca(nome, b, cards, tpl):
    d = [('id', f'raca-{nome}')]
    for k in ('atributos', 'alternativo'):
        if k in b:
            d += [(f'{k}.bonus', bonus_atributos(b[k]['texto']))]
    d += [('movimento.metros', metros(b['movimento']['texto']))]
    if 'idiomas' in b:
        d += [('idiomas.lista', _limpo(b['idiomas']['texto']).split(', '))]
    d += [('pericias.escolhas', [pericias_raca(p['texto']) for p in b['pericias']['itens']])]
    d += [('caracteristicas', _ids_tipo(cards, 'trait-card'))]
    if 'variantes' in b:
        ids = _ids_tipo(cards, 'variant-card') + _ids_tipo(cards, 'subspecie-card')
        d += [('variantes.ids', ids)]
        fis = {c['id']: _fisico_card(c['corpo']) for c in cards if c['id'] in ids}
        d += [('variantes.fisico', {k: v for k, v in fis.items() if v})]
        subs = []
        for c in cards:
            if 'subspecie-card' in _classe_css(c['opentag']):
                s = _stats_card(c['corpo'])
                subs.append({'id': c['id'], 'atributos': {'texto': s['Atributos'], 'bonus': bonus_atributos(s['Atributos'])},
                             'movimento': {'texto': s['Movimento'], 'metros': metros(s['Movimento'])},
                             'pericias': {'texto': s['Perícia'], 'escolha': pericias_raca(s['Perícia'])}})
        if subs:
            d += [('variantes.subespecies', subs)]
    d += [('arNatural', [a for a in (ar_natural(c) for c in cards) if a])]
    if 'tecnologias' in b:
        # tiers: os tech-card entre um tier-header e o seguinte, na ordem do template
        # (o rule-box que fecha a página não é tech-card e sai pelo filtro)
        pedacos = re.split(r'\{\{raca\.tecnologias\.tiers\.\d+\.titulo\}\}', tpl)[1:]
        for i, p in enumerate(pedacos):
            idx = [int(n) for n in re.findall(r'\{\{CARD_(\d+)\}\}', p)]
            d += [(f'tecnologias.tiers.{i}.ids',
                   [cards[n]['id'] for n in idx if 'tech-card' in _classe_css(cards[n]['opentag'])])]
    if 'corrupcao' in b:
        for g in ('poderes', 'adversidades'):
            for i, it in enumerate(b['corrupcao'][g]['itens']):
                d += [(f'corrupcao.{g}.itens.{i}.id', f'{nome}-{slugify(it["nome"])}')]
    return d


def _nomes_bazar(raiz):
    try:
        return {i['nome']: i['id'] for i in json.load(open(os.path.join(raiz, 'data', 'bazar.json'), encoding='utf-8'))}
    except (OSError, ValueError, KeyError, TypeError):
        return {}


def item_inicial(h, bazar):
    """'1 <a …>Bolsa de Couro</a> (1 Bugiganga) — Quando equipada, …'
    -> {nome, quantidade, slot, nota, itemId}. itemId só quando o nome (do link
    para o Bazar, ou o texto do item) é exatamente o nome de um item do
    data/bazar.json; senão None (nada de casar por aproximação)."""
    t = _limpo(h)
    m = re.fullmatch(r'(?:(\d+)\s+)?(.*?)(?:\s+\(([^()]*)\))?(?:\s+—\s+(.*))?', t)
    qtd, nome, slot, nota = m.groups()
    a = re.search(r'<a [^>]*>(.*?)</a>', h)
    alvo = _limpo(a.group(1)) if a else nome
    return {'nome': nome, 'quantidade': int(qtd) if qtd else None, 'slot': slot, 'nota': nota,
            'itemId': bazar.get(alvo)}


def deriva_origem(card, b, bazar):
    d = [('treinamento.termos', treino(b['treinamento']['texto']))]
    for i, it in enumerate(b['itensIniciais']):
        for k, v in item_inicial(it['texto'], bazar).items():
            d += [(f'itensIniciais.{i}.{k}', v)]
    d += [('habilidade.id', f'{card["id"]}-{slugify(b["habilidade"]["nome"])}')]
    return d


# ------------------------------------------------------------------ varredura
def _ler(p):
    return json.load(open(p, encoding='utf-8'))


def _grava(p, doc):
    with open(p, 'w', encoding='utf-8', newline='\n') as fh:
        json.dump(doc, fh, ensure_ascii=False, indent=2)


def fontes(raiz=None):
    """Itera (rotulo, arquivo, doc, bloco, derivados()) de todos os blocos."""
    raiz = raiz or RAIZ
    for c in CLASSES:
        f = os.path.join(raiz, 'data', 'classes', f'{c}.json')
        doc = _ler(f)
        tpl = open(os.path.join(raiz, 'templates', 'classes', f'{c}.template.html'), encoding='utf-8').read()
        yield f'classe {c}', f, doc, doc['classe'], (lambda c=c, doc=doc, tpl=tpl: deriva_classe(c, doc['classe'], doc['cards'], tpl))
    for r in RACAS:
        f = os.path.join(raiz, 'data', 'racas', f'{r}.json')
        doc = _ler(f)
        tpl = open(os.path.join(raiz, 'templates', 'racas', f'{r}.template.html'), encoding='utf-8').read()
        yield f'raça {r}', f, doc, doc['raca'], (lambda r=r, doc=doc, tpl=tpl: deriva_raca(r, doc['raca'], doc['cards'], tpl))
    f = os.path.join(raiz, 'data', 'origens.json')
    doc = _ler(f)
    bazar = _nomes_bazar(raiz)
    for card in doc['cards']:
        yield f'origem {card["id"]}', f, doc, card['origem'], (lambda card=card: deriva_origem(card, card['origem'], bazar))


def fontes_cards(raiz=None):
    """Itera (rotulo, arquivo, doc, derivados()) dos cards de classe (F1e(c)); os
    caminhos dos derivados partem do doc (cards.N.grupo…), não do bloco."""
    raiz = raiz or RAIZ
    for c in CLASSES:
        f = os.path.join(raiz, 'data', 'classes', f'{c}.json')
        doc = _ler(f)
        tpl = open(os.path.join(raiz, 'templates', 'classes', f'{c}.template.html'), encoding='utf-8').read()
        yield f'cards {c}', f, doc, (lambda c=c, doc=doc, tpl=tpl: deriva_cards_classe(c, doc['classe'], doc['cards'], tpl))


def _todas(raiz):
    for rot, f, doc, bloco, der in fontes(raiz):
        yield rot, f, doc, bloco, der
    for rot, f, doc, der in fontes_cards(raiz):
        yield rot, f, doc, doc, der


def divergencias(raiz=None):
    """[(rotulo, caminho, no_json, calculado)] dos derivados fora de sincronia."""
    out = []
    for rot, _, _, bloco, der in _todas(raiz):
        for cam, v in der():
            try:
                atual = pega(bloco, cam)
            except (KeyError, IndexError, TypeError):
                atual = '<ausente>'
            if atual != v:
                out.append((rot, cam, atual, v))
    return out


def regrava(raiz=None):
    """Recalcula e grava os derivados de todos os blocos (e, depois, dos cards de classe)."""
    arquivos = set()
    for grupo in (fontes, fontes_cards):
        docs = {}
        for t in grupo(raiz):
            f, doc, der = t[1], t[2], t[-1]
            alvo = t[3] if grupo is fontes else doc
            for cam, v in der():
                poe(alvo, cam, v)
            docs[f] = doc
        for f, doc in docs.items():
            _grava(f, doc)
        arquivos |= set(docs)
    return len(arquivos)


if __name__ == '__main__':
    try:
        sys.stdout.reconfigure(errors='replace')
    except (AttributeError, ValueError):
        pass
    n = regrava(sys.argv[1] if len(sys.argv) > 1 else None)
    print(f'blocos: derivados regravados em {n} arquivos')
