#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Normalização de dado da F1e (plano §3.2/§4): leitura, por script, dos campos
que o JSON de conteúdo guarda como texto verbatim. Quem usa é o
tools/gerar_catalogo.py; o JSON de conteúdo NÃO é reescrito.

Regra de trabalho: só o que o texto diz. Formato que nenhuma regra daqui
reconhece derruba o build (tabela fechada: acrescente a forma nova aqui, com
teste em tools/testes/test_normaliza_f1e.py). O que o texto deixa em aberto
fica None e aparece no relatório do gerar_catalogo, nunca é preenchido.

  magias: acoes, intensidadesPermitidas, sustentada/sustentacao, rótulo canônico
          de cada stat e stats[].porIntensidade (decomposição sem perda:
          `modelo` + `series` refaz o valor verbatim, conferido aqui);
  Limiar: req "CON 14+, DES 20+" -> [{attr, min}]; custo do Abismo -> {dor, sentido};
  perícias: data/pericias.json (Sistema do Notion + ficha física + decisões).
"""
import re

from kf_marca import texto

INTENSIDADES = ['contida', 'normal', 'forcada', 'transbordante']
NOME_INTENSIDADE = {'Contida': 'contida', 'Normal': 'normal', 'Forçada': 'forcada',
                    'Transbordante': 'transbordante'}


# ------------------------------------------------------------------ rótulos
# caracteristica verbatim -> (chave, rótulo canônico). Variantes de grafia do
# Notion convergem para a forma mais usada ("Trade-Off" 11x, "Resistência" 21x).
ROTULOS = {
    'Ação': ('acao', 'Ação'), 'Ações': ('acao', 'Ação'),
    'Alcance': ('alcance', 'Alcance'), 'Distância': ('distancia', 'Distância'),
    'Alvo': ('alvo', 'Alvo'), 'Alvos': ('alvo', 'Alvo'), 'Alvo(s)': ('alvo', 'Alvo'),
    'Área': ('area', 'Área'), 'Raio': ('raio', 'Raio'),
    'Duração': ('duracao', 'Duração'),
    'Resistência': ('resistencia', 'Resistência'), 'Resist.': ('resistencia', 'Resistência'),
    'Efeito': ('efeito', 'Efeito'), 'Dano': ('dano', 'Dano'), 'Cura': ('cura', 'Cura'),
    'Trade-Off': ('tradeoff', 'Trade-Off'), 'Trade-off': ('tradeoff', 'Trade-Off'),
    'Intensidade': ('intensidade', 'Intensidade'), 'Gatilho': ('gatilho', 'Gatilho'),
    'Requisito': ('requisito', 'Requisito'), 'Custo': ('custo', 'Custo'),
    'Custo por Rodada': ('custoPorRodada', 'Custo por Rodada'),
    'Invocada': ('invocada', 'Invocada'), 'Presas': ('presas', 'Presas'),
    'Saúde do Painel': ('saudeDoPainel', 'Saúde do Painel'),
    'Saúde da Barreira': ('saudeDaBarreira', 'Saúde da Barreira'),
    'Raios p/Rodada': ('raiosPorRodada', 'Raios p/Rodada'),
    'Dano Inicial': ('danoInicial', 'Dano Inicial'), 'Dano (Aura)': ('danoAura', 'Dano (Aura)'),
    'Progressão': ('progressao', 'Progressão'), 'Contágio': ('contagio', 'Contágio'),
}


def rotulo(caracteristica):
    if caracteristica not in ROTULOS:
        raise ValueError(f'característica de magia sem rótulo canônico: {caracteristica!r} (normaliza.ROTULOS)')
    return ROTULOS[caracteristica]


# ------------------------------------------------------------------ ações
FORMATOS_ACAO = [
    ('acoes', re.compile(r'^(\d+) [Aa]ç(?:ão|ões)$'), lambda m: {'n': int(m.group(1))}),
    ('acoesEmRodadas', re.compile(r'^(\d+) Ações \((\d+) Rodadas\)$'),
     lambda m: {'n': int(m.group(1)), 'rodadas': int(m.group(2))}),
    ('reacao', re.compile(r'^Reação$'), lambda m: {}),
    ('livre', re.compile(r'^Ação Livre$'), lambda m: {}),
    ('minutos', re.compile(r'^(\d+) [Mm]inutos?$'), lambda m: {'minutos': int(m.group(1))}),
    ('descansoLongo', re.compile(r'^(\d+) Descanso Longo$'), lambda m: {'descansos': int(m.group(1))}),
]


def acoes(valor):
    """'2 Ações' -> {texto, formato:'acoes', n:2}; formato fora da tabela derruba."""
    t = texto(valor)
    for fmt, r, faz in FORMATOS_ACAO:
        m = r.match(t)
        if m:
            return {'texto': valor, 'formato': fmt, **faz(m)}
    raise ValueError(f'ação de magia ilegível: {valor!r} (normaliza.FORMATOS_ACAO)')


# ------------------------------------------------------------------ intensidades
# Valor verbatim do stat "Intensidade" -> intensidades permitidas.
RESTRICAO_INTENSIDADE = {
    'Apenas Normal': ['normal'],
    'Apenas Transbordante': ['transbordante'],
    'Transbordante': ['transbordante'],
    'Normal ou Acima': ['normal', 'forcada', 'transbordante'],
}


def intensidades_permitidas(nivel, stats):
    """Nível 1 não tem Contida (custa 0 na Normal; texto da página de Magias);
    o stat "Intensidade" restringe. Devolve (lista, texto verbatim|None)."""
    base = INTENSIDADES[1:] if nivel == 1 else list(INTENSIDADES)
    txt = [s['valor'] for s in stats if s['caracteristica'] == 'Intensidade']
    if len(txt) > 1:
        raise ValueError(f'magia com {len(txt)} stats "Intensidade"')
    if not txt:
        return base, None
    if txt[0] not in RESTRICAO_INTENSIDADE:
        raise ValueError(f'restrição de intensidade ilegível: {txt[0]!r} (normaliza.RESTRICAO_INTENSIDADE)')
    perm = RESTRICAO_INTENSIDADE[txt[0]]
    if not set(perm) <= set(base):
        raise ValueError(f'restrição {txt[0]!r} fora das intensidades do nível {nivel}')
    return perm, txt[0]


# ------------------------------------------------------------------ barras
# Uma alternativa da série "a / b / c": número (com vírgula decimal e sinal),
# dado, percentual, horas coladas ("6h") ou a palavra que substitui o número.
TOKEN = r'(?:[+\-−]?\d+(?:,\d+)?(?:d\d+|%|h)?|Toque|Pessoal)'
RE_SERIE = re.compile(rf'(?<![\w,.+\-−]){TOKEN}(?: / {TOKEN})+(?![\w%])')
PALAVRAS = ('Toque', 'Pessoal')
# Alternativa completa quando a série não tem prefixo/sufixo comum ("10 minutos / 1 hora / 8 horas")
RE_SEGMENTO = re.compile(r'^(?:Toque|Pessoal|\d+(?:,\d+)? (?:m|h|min|minutos?|horas?))$')
RE_ROTULADO = re.compile(r'^(Contida|Normal|Forçada|Transbordante): (.+)$')


def _forma(tok):
    if tok in PALAVRAS:
        return 'palavra'
    if re.fullmatch(r'\d+d\d+', tok):
        return 'dado'
    if tok.endswith('%'):
        return 'pct'
    if tok.endswith('h'):
        return 'h'
    return 'numero'


def decompoe(valor):
    """valor verbatim -> (formato, modelo, series) com modelo.format(*[' / '.join(s)]) == valor.

    formatos: 'barras' (1 série), 'barras-multiplas', 'segmentos' (cada ' / ' é um
    valor completo), 'rotulado' ("Normal: x · Forçada: y"), 'sem-barras' e
    'irregular' (tem barra, mas nenhuma leitura fecha: fica sem porIntensidade)."""
    segs = valor.split(' · ')
    if any(RE_ROTULADO.match(s) for s in segs):
        return 'rotulado', None, None
    if ' / ' not in valor:
        return 'sem-barras', None, None
    series, partes, pos = [], [], 0
    for m in RE_SERIE.finditer(valor):
        toks = m.group(0).split(' / ')
        formas = {_forma(t) for t in toks} - {'palavra'}
        if len(formas) > 1:
            series = None
            break
        partes.append(valor[pos:m.start()].replace('{', '{{').replace('}', '}}') + '{%d}' % len(series))
        series.append(toks)
        pos = m.end()
    if series:
        modelo = ''.join(partes) + valor[pos:].replace('{', '{{').replace('}', '}}')
        resto = re.sub(r'\{\d+\}', '', modelo)
        if ' / ' not in resto and len({len(s) for s in series}) == 1:
            if modelo.format(*[' / '.join(s) for s in series]) != valor:
                raise AssertionError(f'decomposição com perda: {valor!r}')
            return ('barras' if len(series) == 1 else 'barras-multiplas'), modelo, series
    partes = valor.split(' / ')
    if all(RE_SEGMENTO.match(p) for p in partes):
        return 'segmentos', '{0}', [partes]
    return 'irregular', None, None


def por_intensidade(valor, permitidas):
    """-> (formato, porIntensidade|None, extra) para um stat. `extra` diz como as
    alternativas casaram com as intensidades: 'direto' (uma por intensidade),
    'regra-3-barras' (CLAUDE.md §6: 3 valores num nível de 4 intensidades ->
    repete o 1º na Contida) ou o motivo de não haver leitura."""
    fmt, modelo, series = decompoe(valor)
    if fmt == 'rotulado':
        return fmt, *_rotulado(valor, permitidas)
    if fmt in ('sem-barras', 'irregular'):
        return fmt, None, fmt
    n = len(series[0])
    if n == len(permitidas):
        casamento, idx = 'direto', list(range(n))
    elif n == 3 and permitidas == INTENSIDADES:
        casamento, idx = 'regra-3-barras', [0, 0, 1, 2]
    else:
        return fmt, None, f'{n} valores para {len(permitidas)} intensidades'
    out = {}
    for k, i in zip(permitidas, idx):
        toks = [s[i] for s in series]
        if fmt == 'barras' and toks[0] in PALAVRAS and modelo in ('{0} m',):
            out[k] = toks[0]           # "Toque / Toque / 3 / 4,5 m": o "m" é das distâncias
        else:
            out[k] = modelo.format(*toks)
    return fmt, out, casamento


def _rotulado(valor, permitidas):
    """'Remove Em Chamas · Forçada: também … · Transbordante: também …': cada rótulo
    vai para a sua intensidade; um único segmento sem rótulo, no início, é o da
    única intensidade permitida que sobrou (verbatim, sem somar o "também")."""
    segs = valor.split(' · ')
    out, livres = {}, []
    for s in segs:
        m = RE_ROTULADO.match(s)
        if m:
            k = NOME_INTENSIDADE[m.group(1)]
            if k not in permitidas or k in out:
                return None, f'rótulo {m.group(1)} fora das intensidades permitidas ou repetido'
            out[k] = m.group(2)
        else:
            livres.append(s)
    faltam = [k for k in permitidas if k not in out]
    if len(livres) == 1 and segs[0] == livres[0] and len(faltam) == 1:
        out[faltam[0]] = livres[0]
        return {k: out[k] for k in permitidas}, 'rotulo+base'
    if not livres and not faltam:
        return {k: out[k] for k in permitidas}, 'rotulo'
    return None, f'{len(livres)} segmento(s) sem rótulo e {len(faltam)} intensidade(s) sem valor'


# ------------------------------------------------------------------ sustentada
RE_SUSTENTADA = re.compile(r'Magia Sustentada')


def sustentacao(s):
    """(sustentada, sustentacao|None). D16 (Pedro): o custo por turno é o da
    canalização, salvo o que a magia escrever. Aqui: `custoPorTurno` fica
    'canalizacao' e as frases verbatim que falam do pagamento vão em `textos`;
    `adicional` é o stat "Custo por Rodada" (o que o texto soma além disso)."""
    fontes = [s['descricao']] + [st['valor'] for st in s['stats']]
    if not any(RE_SUSTENTADA.search(f) for f in fontes):
        return False, None
    frases = []
    for f in fontes:
        for fr in re.split(r'(?<=[.;)])\s+|<br>', f):
            if re.search(r'pague|cobra|custo', fr, re.I) and fr not in frases:
                frases.append(fr.strip())
    adicional = [st['valor'] for st in s['stats'] if st['caracteristica'] == 'Custo por Rodada']
    return True, {'custoPorTurno': 'canalizacao', 'adicional': adicional[0] if adicional else None,
                  'textos': frases}


# ------------------------------------------------------------------ Limiar
ATRIBUTOS = ('FOR', 'DES', 'CON', 'INT', 'SAB')


def req_limiar(req):
    """'CON 14+, DES 20+' -> [{attr:'CON', min:14}, …]; sem requisito -> []."""
    if req is None:
        return []
    out = []
    for p in req.split(', '):
        m = re.fullmatch(r'(FOR|DES|CON|INT|SAB) (\d+)\+', p.strip())
        if not m:
            raise ValueError(f'requisito de carta ilegível: {req!r}')
        out.append({'attr': m.group(1), 'min': int(m.group(2))})
    if len({r['attr'] for r in out}) != len(out):
        raise ValueError(f'requisito de carta com atributo repetido: {req!r}')
    return out


SENTIDO_ABISMO = {'gain': 'ganha', 'spend': 'gasta'}


def custo_abismo(custo, tipo):
    """('+3 Dor', 'gain') -> {dor: 3, sentido: 'ganha'}; ('3 Dor', 'spend') -> gasta.
    O sinal do texto tem de concordar com o tipo do card."""
    m = re.fullmatch(r'(\+?)(\d+) Dor', texto(custo))
    if not m or tipo not in SENTIDO_ABISMO:
        raise ValueError(f'custo do Abismo ilegível: {custo!r} ({tipo!r})')
    if bool(m.group(1)) != (tipo == 'gain'):
        raise ValueError(f'custo do Abismo {custo!r} com sinal que contradiz o tipo {tipo!r}')
    return {'dor': int(m.group(2)), 'sentido': SENTIDO_ABISMO[tipo]}


# ------------------------------------------------------------------ perícias
# As 24 perícias, na ordem do CLAUDE.md §2 (fonte da lista: ficha física +
# confirmação do Pedro em 2026-09-24/-25) e o prof_* do Bestiário (CLAUDE.md §5:
# as três de Ofício exportam o mesmo prof_craft).
PERICIAS = [
    ('Atacar', 'prof_attack'), ('Defender', 'prof_defend'), ('Movimento', 'prof_movement'),
    ('Fortitude', 'prof_fortitude'), ('Vontade', 'prof_will'), ('Reflexos', 'prof_reflexes'),
    ('Percepção', 'prof_perception'), ('Sobrevivência', 'prof_survival'),
    ('Furtividade', 'prof_stealth'), ('Crime', 'prof_crime'), ('Iniciativa', 'prof_initiative'),
    ('Conhecimento', 'prof_knowledge'), ('Medicina', 'prof_medicine'),
    ('Investigação', 'prof_investigation'), ('Religião', 'prof_religion'), ('Místico', 'prof_mystic'),
    ('Convencimento', 'prof_persuasion'), ('Intimidação', 'prof_intimidation'),
    ('Intuição', 'prof_insight'), ('Enganação', 'prof_deception'), ('Motivar', 'prof_motivate'),
    ('Ofício(Engenharia)', 'prof_craft'), ('Ofício(Ferraria)', 'prof_craft'),
    ('Ofício(Alquimia)', 'prof_craft'),
]
# Nome da ficha física (03-respostas-pedro.md §4) -> nome canônico
NOME_FICHA_FISICA = {'Convencer': 'Convencimento', 'Intimidar': 'Intimidação', 'Enganar': 'Enganação'}
ATTR_NOME = {'força': 'FOR', 'for': 'FOR', 'destreza': 'DES', 'des': 'DES', 'constituição': 'CON',
             'con': 'CON', 'inteligência': 'INT', 'int': 'INT', 'sabedoria': 'SAB', 'sab': 'SAB'}


def atributos_de(t):
    """'1d20+(Força ou Destreza)' / 'Des ou Int' / 'Des/Con' / 'Sabedoria' -> ['FOR', 'DES']."""
    t = re.sub(r'^1d20\+', '', texto(t)).strip('() ')
    if not t:
        return []
    out = []
    for a in re.split(r'\s+ou\s+|\s*/\s*', t):
        k = a.strip().lower()
        if k not in ATTR_NOME:
            raise ValueError(f'atributo de perícia ilegível: {a!r} em {t!r}')
        out.append(ATTR_NOME[k])
    return out


def sistema_pericias(sistema):
    """Da página Sistema (data/sistema.json): {nome: texto 'Dado + Mod.'} das duas
    tabelas de Perícias, a escala de proficiência e o dado do Defender por grau."""
    htmls = {}

    def anda(o):
        if isinstance(o, dict):
            for v in o.values():
                anda(v)
        elif isinstance(o, list):
            for v in o:
                anda(v)
        elif isinstance(o, str):
            for sid in ('pericias', 'proficiencia'):
                if f'<div class="subsection" id="{sid}">' in o:
                    htmls[sid] = o
    anda(sistema)
    if set(htmls) != {'pericias', 'proficiencia'}:
        raise ValueError(f'Sistema sem as subseções de perícias/proficiência: {sorted(htmls)}')
    per = htmls['pericias']
    tab, soc = per.split('<h4>Interação Social</h4>', 1)
    dado = {}
    for nome, cel in re.findall(r'<td><strong>(.*?)</strong></td>\s*<td>.*?</td>\s*<td>(.*?)</td>', tab, re.S):
        dado[nome] = re.search(r'<code>(.*?)</code>', cel).group(1)
    for nome, attr in re.findall(r'<td><strong>(.*?)</strong></td>\s*<td><code>(.*?)</code></td>', soc, re.S):
        dado[nome] = attr
    prof = htmls['proficiencia']
    graus = [{'bonus': int(b), 'nome': n} for b, n in
             re.findall(r'<span class="bonus">\+(\d+)</span> (\w+)</div>', prof)]
    m = re.search(r'<tr>((?:<th>\w+</th>)+)</tr>\s*</thead>\s*<tbody>\s*<tr>((?:<td>[^<]+</td>)+)</tr>', prof)
    cab = re.findall(r'<th>(\w+)</th>', m.group(1))
    val = re.findall(r'<td>([^<]+)</td>', m.group(2))
    defender = dict(zip(cab, val))
    if [g['nome'] for g in graus] != cab or len(cab) != len(val):
        raise ValueError(f'escala de proficiência {graus} x tabela do Defender {cab}/{val}')
    return dado, graus, defender


def ficha_fisica_pericias(md):
    """'Atacar (For), Defender (Des/Con), … Ofício ( )' do 03-respostas-pedro.md §4."""
    m = re.search(r'perícias em duas colunas.*?caixa de total:(.*?)· Recurso de Classe', md, re.S)
    if not m:
        raise ValueError('03-respostas-pedro.md: lista de perícias da ficha física não encontrada')
    out = {}
    for nome, attr in re.findall(r'([A-ZÀ-Ú][\wçãéíóúâêô]+) \(([^)]*)\)', m.group(1)):
        out[NOME_FICHA_FISICA.get(nome, nome)] = attr.strip()
    return out


def pericias(sistema, md, slugify):
    """Lista das 24 perícias + relatório de divergências (Sistema x ficha física)."""
    dado, graus, defender = sistema_pericias(sistema)
    fisica = ficha_fisica_pericias(md)
    sist = {n.replace(' ', ''): v for n, v in dado.items()}
    out, diverg = [], []
    for nome, prof in PERICIAS:
        e = {'slug': slugify(nome.replace('(', ' (')), 'nome': nome, 'prof': prof}
        ts = sist.get(nome)
        tf = fisica.get(nome) if not nome.startswith('Ofício') else fisica.get('Ofício')
        if nome == 'Defender':
            # D8a/D8b (Pedro): só o dado; o Mod. Destreza já está na Evasão passiva
            if ts is None or not ts.startswith(' / '.join(defender.values())):
                raise ValueError(f'Defender: Sistema {ts!r} x tabela de graus {defender}')
            e.update({'atributos': [], 'modo': 'dado',
                      'dadoPorBonus': {str(g['bonus']): defender[g['nome']] for g in graus}})
        else:
            if ts is None and nome != 'Ofício(Alquimia)':
                raise ValueError(f'perícia {nome} fora do Sistema')
            # Ofício(Alquimia): CLAUDE.md §2 ("todas 1d20+Inteligência"), Pedro 2026-09-24
            attrs = atributos_de(ts) if ts is not None else ['INT']
            modo = 'fixo' if len(attrs) == 1 else ('arma' if nome == 'Atacar' else 'maior')
            e.update({'atributos': attrs, 'modo': modo})
            if modo == 'maior':
                e['trocavel'] = True      # D7 (Pedro): "Maior mas com escolha de mudar"
        e['textoSistema'] = ts
        e['fichaFisica'] = tf
        if tf and sorted(atributos_de(tf)) != sorted(e['atributos']):
            diverg.append((nome, ts, tf))
        out.append(e)
    return out, graus, diverg
