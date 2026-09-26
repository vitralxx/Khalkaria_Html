#!/usr/bin/env python3
"""Gera ficha-efeitos-itens.json: o que cada item do Bazar muda na ficha.

Regra de método: cada FRASE do Efeito cai em exatamente um destino:
  modificador (gramática fechada) | lembrete (julgamento de mesa) | estrutural | sabor.
Nenhuma frase some. O relatório lista as frases que viraram lembrete mas carregam
um número de campo de ficha: são os candidatos a falso negativo, revisados à mão
e resolvidos em OVERRIDES (status 'decisao').
Uso: python3 ficha-efeitos-gerador.py [--relatorio]
"""
import csv, json, re, sys, unicodedata, collections, hashlib, os

AQUI = os.path.dirname(os.path.abspath(__file__))
CSV = os.path.join(AQUI, 'bazar-v26.csv')
SAIDA = os.path.join(AQUI, 'ficha-efeitos-itens.json')
MARCAS = os.path.join(AQUI, 'marcas-vhelor.json')

def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')
def iid(nome): return 'item-' + slug(nome)
def num(s): return float(s.replace(',', '.')) if ',' in s else int(s)
def sinal(s): return s.replace('−', '-')

# ---------------------------------------------------------------- vocabulário
PERICIAS = {
 'Atacar':'atacar','Defender':'defender','Movimento':'movimento','Fortitude':'fortitude',
 'Vontade':'vontade','Reflexos':'reflexos','Reflexo':'reflexos','Percepção':'percepcao',
 'Sobrevivência':'sobrevivencia','Furtividade':'furtividade','Crime':'crime',
 'Iniciativa':'iniciativa','Conhecimento':'conhecimento','Medicina':'medicina',
 'Investigação':'investigacao','Religião':'religiao','Místico':'mistico',
 'Convencimento':'convencimento','Intimidação':'intimidacao','Intuição':'intuicao',
 'Enganação':'enganacao','Motivar':'motivar','Ofício(Engenharia)':'oficio-engenharia',
 'Ofício(Ferraria)':'oficio-ferraria','Ofício(Alquimia)':'oficio-alquimia'}
PER_RE = '|'.join(sorted((re.escape(k) for k in PERICIAS), key=len, reverse=True))
ATRIB = {'Força':'FOR','Destreza':'DES','Constituição':'CON','Inteligência':'INT','Sabedoria':'SAB'}
ATR_RE = '|'.join(ATRIB)
TIPOS = {'Cortante':'cortante','Contundente':'contundente','Perfurante':'perfurante','Fogo':'fogo',
 'Frio':'frio','Elétrico':'eletrico','Eletricidade':'eletrico','Veneno':'veneno','Ácido':'acido',
 'Psíquico':'psiquico','Radiante':'radiante','Trovejante':'trovejante','Necrótico':'necrotico',
 'Força':'forca','Primordial':'primordial'}
DANO_ATAQUE = {**TIPOS, 'Bio':'biologico','Biológico':'biologico'}
CATEG = {'Ordinário':'ordinario','Elemental':'elemental','Biológico':'biologico','Místico':'mistico','Todos':'todos'}
CAT_TIPOS = {'ordinario':['cortante','contundente','perfurante'],'elemental':['fogo','frio','eletrico'],
 'biologico':['veneno','acido','psiquico'],'mistico':['radiante','trovejante','necrotico','forca','primordial']}
# PD22: Ae(Todos) = os 11 atípicos (menos a exceção do item); os 3 Ordinários são do Ar
ATIPICOS = ['fogo','frio','eletrico','veneno','acido','psiquico','radiante','trovejante','necrotico','forca','primordial']
AUTOMATO_TXT = ('Raça Autômato (Notion): "Possui mecanismo de automanutenção(cura ao descansar), mas para cura maior '
                'deve ser consertado com item Kit de Manutenção. Poções e Elixires não funcionam em você."')
CONDICOES = {'Morrendo':'morrendo','Inconsciente':'inconsciente','Exaurido':'exaurido','Oco':'oco',
 'Exaustão':'exaustao','Exausto':'exaustao','Desnutrido':'desnutrido','Exposto':'exposto',
 'Sangramento':'sangramento','Atordoado':'atordoado','Desorientado':'desorientado','Caído':'caido',
 'Desprevenido':'desprevenido','Lento':'lento','Enraizado':'enraizado','Confuso':'confuso',
 'Amedrontado':'amedrontado','Descontrolado':'descontrolado','Enfeitiçado':'enfeiticado',
 'Bêbado':'bebado','Embriagado':'bebado','Envenenamento':'envenenamento','Envenenado':'envenenamento',
 'Em Chamas':'em-chamas','Enjoado':'enjoado','Paralisado':'paralisado','Adormecido':'adormecido',
 'Cego':'cego','Surdo':'surdo','Invisível':'invisivel','Agarrado':'agarrado'}

def lista_nomes(txt):
    """'Fogo, Frio e Elétrico' -> ['Fogo','Frio','Elétrico']"""
    return [p.strip() for p in re.split(r',\s*|\s+e\s+|\s+ou\s+', txt) if p.strip()]

def excecoes(txt):
    m = re.search(r'[Ee]xceto:?\s*([^)]+)', txt) or re.search(r'dano de (.+?) não entram', txt)
    if not m: return []
    return [TIPOS[n] for n in lista_nomes(m.group(1)) if n in TIPOS]

# ---------------------------------------------------------------- frases
QUALIF = re.compile(r'\s*(?:,\s*)?(?:permanente(?: enquanto (?:vestid[oa]s?|equipad[oa]))?|enquanto (?:vestid[oa]s?|equipad[oa]|sintonizad[oa]|usad[oa]|no inventário))\s*$')
SABOR = re.compile(r'^(Sem penalidade|Sem bônus|Item único|Consumível|Passiva|Botas|Vendor trash|'
                   r'Leve como tecido|Runa gravada na placa|Gasto após o uso|Reutilizável|Enquanto sintonizado|Sem bônus de atributo)$', re.I)
EMPILHA = re.compile(r'^Empilhável: pesa 1 bugiganga a cada 10 unidades$')

def frases(txt):
    txt = txt.strip()
    partes = re.split(r'(?<=[.!])\s+(?=[A-ZÀ-Ú0-9+\-−(\[])', txt)
    out = []
    for p in partes:
        p = p.strip().rstrip('.').strip()
        if not p: continue
        # "Enquanto sintonizado: a; b; c"
        m = re.match(r'^(Enquanto sintonizado):\s*(.+)$', p)
        if m:
            out += [x.strip() for x in m.group(2).split(';') if x.strip()]
            continue
        out.append(p)
    return out

SUF_DUR = re.compile(r'\s+(?:por|durante)\s+(\d+)\s+(cena|rodadas?|turnos?|min|minutos?|h|horas?)$|\s+(no próximo combate)$')
def clausula(c):
    """Uma cláusula limpa -> lista de modificadores; None se não for gramática fechada.
    Sufixos de duração ('por 1 cena', 'por 1 rodada', 'no próximo combate') viram 'duracao' no modificador."""
    c = QUALIF.sub('', c.strip()).strip().rstrip('.')
    dur = None
    m = SUF_DUR.search(c)
    if m:
        dur = 'proximoCombate' if m.group(3) else f"{m.group(1)} {m.group(2).rstrip('s') if m.group(2) not in ('min',) else 'min'}"
        c = c[:m.start()].strip()
    r = _clausula(c)
    if r is not None and dur:
        for x in r: x['duracao'] = dur
    return r

def _clausula(c):
    c = re.sub(r'^(Acolchoado):\s*', '', c)      # rótulo sem condição
    m = re.fullmatch(r'Ar (\d+)', c) or re.fullmatch(r'\+(\d+) Armadura\(Ar\)(?: natural)?', c)
    if m: return [{'alvo':'ar','op':'soma','valor':int(m.group(1))}]
    m = re.fullmatch(r'Ae\(\s*([^,]+?)\s*,\s*(\d+)\s*\)(.*)', c)
    if m:
        alvo_nome, n, cauda = m.group(1), int(m.group(2)), m.group(3)
        if alvo_nome in TIPOS: alvo = 'ae.' + TIPOS[alvo_nome]
        elif alvo_nome in CATEG: alvo = 'ae.' + CATEG[alvo_nome]
        else: return None
        if cauda.strip() and not excecoes(cauda): return None
        mod = {'alvo':alvo,'op':'soma','valor':n}
        ex = excecoes(cauda)
        if ex: mod['excecao'] = ex
        return [mod]
    m = re.fullmatch(r'Resistência a (?:dano )?(.+)', c)
    if m:
        alvo = m.group(1)
        mm = re.fullmatch(r'Místico \((.+)\)', alvo)
        if mm:
            dentro = mm.group(1)
            if dentro.lower().startswith('exceto'):
                tipos = [t for t in CAT_TIPOS['mistico'] if t not in excecoes(dentro)]
            else:
                tipos = [TIPOS[n] for n in lista_nomes(dentro) if n in TIPOS]
            return [{'alvo':'resistencia.'+t,'op':'fixa','valor':True} for t in tipos]
        nomes = lista_nomes(alvo)
        if all(n in TIPOS for n in nomes):
            return [{'alvo':'resistencia.'+TIPOS[n],'op':'fixa','valor':True} for n in nomes]
        return None
    m = re.fullmatch(r'Imun(?:e|idade) a (.+)', c)
    if m:
        nomes = lista_nomes(m.group(1)); mods = []
        for n in nomes:
            if n in CONDICOES: mods.append({'alvo':'imunidade.condicao.'+CONDICOES[n],'op':'fixa','valor':True})
            elif n in TIPOS: mods.append({'alvo':'imunidade.'+TIPOS[n],'op':'fixa','valor':True})
            else: return None
        return mods
    m = re.fullmatch(r'Vulnerável a (.+)', c)
    if m:
        nomes = lista_nomes(m.group(1))
        if all(n in TIPOS for n in nomes):
            return [{'alvo':'vulnerabilidade.'+TIPOS[n],'op':'fixa','valor':True} for n in nomes]
        return None
    if re.fullmatch(r'Não pode ser (?:pego )?Desprevenido', c):
        return [{'alvo':'imunidade.condicao.desprevenido','op':'fixa','valor':True}]
    m = re.fullmatch(r'([+\-−])\s*(\d+(?:,\d+)?)\s*m\s+(?:de\s+)?Movimento', c)
    if m: return [{'alvo':'movimento','op':'soma','valor':num(sinal(m.group(1))+m.group(2))}]
    m = re.fullmatch(r'([+\-−]\d+)\s+(?:em\s+)?(?:testes\s+de\s+)?(' + PER_RE + r')', c)
    if m: return [{'alvo':'pericia.'+PERICIAS[m.group(2)],'op':'soma','valor':int(sinal(m.group(1)))}]
    m = re.fullmatch(r'([+\-−]\d+)\s+(?:em\s+)?(' + ATR_RE + r')', c)
    if m: return [{'alvo':'atributo.'+ATRIB[m.group(2)],'op':'soma','valor':int(sinal(m.group(1))),'_leitura':'atributo nu'}]
    m = re.fullmatch(r'\+(\d+)\s+(?:em\s+)?testes\s+de\s+(' + ATR_RE + r')', c)
    if m: return [{'alvo':'testes.'+ATRIB[m.group(2)],'op':'soma','valor':int(m.group(1))}]
    m = re.fullmatch(r'\+(\d+) em (?:todos|TODOS) os atributos', c)
    if m: return [{'alvo':'atributo.'+a,'op':'soma','valor':int(m.group(1))} for a in ATRIB.values()]
    m = re.fullmatch(r'\+(\d+) em Vitalidade, Vigor e Ressonância', c)
    if m: return [{'alvo':'classe.'+k,'op':'soma','valor':int(m.group(1))} for k in 'VGR']
    m = re.fullmatch(r'([+\-−]\d+)\s+(?:de\s+)?(Saúde|Stamina|Éter) máxim[oa]', c)
    if m:
        r = {'Saúde':'saude','Stamina':'stamina','Éter':'eter'}[m.group(2)]
        return [{'alvo':r+'.max','op':'soma','valor':int(sinal(m.group(1)))}]
    m = re.fullmatch(r'\+(\d+)\s+(?:de\s+)?Saúde temporária', c)
    if m: return [{'alvo':'saude.temporaria','op':'soma','valor':int(m.group(1))}]
    m = re.fullmatch(r'([+\-−]\d+)\s+Evasão', c)
    if m: return [{'alvo':'evasao.passiva','op':'soma','valor':int(sinal(m.group(1)))}]
    m = re.fullmatch(r'\+(\d+) margem de ameaça', c)
    if m: return [{'alvo':'margemAmeaca','op':'soma','valor':int(m.group(1))}]
    m = re.fullmatch(r'\+(\d+) Bugigangas? e \+(\d+) Equipamentos? de capacidade', c)
    if m: return [{'alvo':'capacidade.bugigangas','op':'soma','valor':int(m.group(1))},
                  {'alvo':'capacidade.equipamentos','op':'soma','valor':int(m.group(2))}]
    m = re.fullmatch(r'\+(\d+) Bugigangas? de capacidade', c) or re.fullmatch(r'Adiciona \+(\d+) de capacidade de bugigangas', c)
    if m: return [{'alvo':'capacidade.bugigangas','op':'soma','valor':int(m.group(1))}]
    m = re.fullmatch(r'Permite testes de Ofício\((\w+)\) sem treinamento e \+(\d+) Ofício\((\w+)\)', c)
    if m:
        p = PERICIAS['Ofício(%s)' % m.group(1)]
        return [{'alvo':'permiteSemTreino.'+p,'op':'fixa','valor':True},
                {'alvo':'pericia.'+PERICIAS['Ofício(%s)' % m.group(3)],'op':'soma','valor':int(m.group(2))}]
    m = re.fullmatch(r'\+(\d+) Defender ao usar a reação Defender', c)
    if m: return [{'alvo':'pericia.defender','op':'soma','valor':int(m.group(1)),'condicao':'reacaoDefender'}]
    m = re.fullmatch(r'\+(\d+) Místico, \+(\d+) Éter máximo', c)
    if m: return [{'alvo':'pericia.mistico','op':'soma','valor':int(m.group(1))},
                  {'alvo':'eter.max','op':'soma','valor':int(m.group(2))}]
    m = re.fullmatch(r'\+(\d+) dano corpo a corpo', c)
    if m: return [{'alvo':'dano.corpoACorpo','op':'soma','valor':int(m.group(1))}]
    m = re.fullmatch(r'(?:Cura|Regenera) (\d+) de Saúde por turno(?: (em combate|fora de combate))?', c)
    if m:
        x = {'alvo':'regeneracao.saude','op':'soma','valor':int(m.group(1)),'momento':'inicioTurno'}
        if m.group(2): x['condicao'] = 'emCombate' if m.group(2) == 'em combate' else 'foraDeCombate'
        return [x]
    m = re.fullmatch(r'([+\-−]\d+) (?:em )?(' + PER_RE + r')/(' + PER_RE + r')', c)
    if m: return [{'alvo':'pericia.'+PERICIAS[g],'op':'soma','valor':int(sinal(m.group(1)))} for g in (m.group(2), m.group(3))]
    return None

ATIV = re.compile(r'^(\d+)x por (descanso longo|descanso curto|combate|cena):\s*(.+)$')
def frase_mods(f):
    """Frase inteira: tenta como uma cláusula; senão divide por vírgula e exige que TODAS casem.
    Prefixo 'Nx por <recarga>:' vira 'ativacao' no modificador (o item continua no mesmo estado)."""
    m = ATIV.match(f)
    if m:
        corpo = m.group(3); acao = None
        mm = re.search(r'\s+como (ação livre|1 ação|reação)', corpo)
        if mm:
            acao = {'ação livre':0,'1 ação':1,'reação':'reacao'}[mm.group(1)]
            corpo = (corpo[:mm.start()] + corpo[mm.end():]).strip()
        r = frase_mods(corpo)
        if r is not None:
            rec = {'descanso longo':'longo','descanso curto':'curto'}.get(m.group(2), m.group(2))
            for x in r: x['ativacao'] = {'usos':int(m.group(1)),'recarga':rec,'acao':acao}
        return r
    r = clausula(f)
    if r is not None: return r
    partes = [p for p in re.split(r',\s+(?=[+\-−A-ZÀ-Ú])|\.\s+', f) if p.strip()]
    if len(partes) > 1:
        tot = []
        for p in partes:
            x = clausula(p)
            if x is None: return None
            tot += x
        return tot
    return None

CAMPO_FICHA = re.compile(r'(Evasão|Saúde máxima|Stamina máxima|Éter máximo|\bAr \d|Armadura\(Ar\)|Ae\(|Resistência a|'
                         r'Imun|Vulnerável|\d\s*m\s+(?:de\s+)?Movimento|margem de ameaça|Multiplicador|'
                         r'[+\-−]\d+\s+(?:em\s+)?(?:testes\s+de\s+)?(?:' + PER_RE + '|' + ATR_RE + r')\b|'
                         r'Saúde temporária|capacidade|\+\d+ Ação|atributo)', re.I)

def usos_de(txt):
    m = re.search(r'(\d+)x\s*(?:por|/)\s*(descanso longo|descanso curto|combate|cena|Combate|Descanso Longo|Curto|Longo)', txt)
    if m:
        rec = m.group(2).lower()
        rec = {'descanso longo':'longo','longo':'longo','descanso curto':'curto','curto':'curto'}.get(rec, rec)
        return {'n':int(m.group(1)),'recarga':rec}
    m = re.search(r'(\d+) usos? por descanso longo', txt)
    if m: return {'n':int(m.group(1)),'recarga':'longo'}
    m = re.search(r'(\d+) usos?\b', txt)
    if m: return {'n':int(m.group(1)),'recarga':None}
    return None

def duracao_de(txt):
    m = re.search(r'(?:Dura(?:ção)?\s+|por\s+|durante\s+)?(\d+)\s*(min|minutos?|h\b|hora|horas|rodadas?|turnos?)\b', txt)
    if not m: return None
    u = m.group(2)
    u = {'min':'min','minuto':'min','minutos':'min','h':'h','hora':'h','horas':'h'}.get(u, u.rstrip('s') if u.endswith('s') else u)
    return f"{m.group(1)} {u}"

# ---------------------------------------------------------------- armas
CHASSI = re.compile(r'^(?P<chassi>Leve (?:Cortante|Perfurante|Contundente|Ágil)|Pesada (?:Cortante|Perfurante|Contundente|Brutal)|'
                    r'Marcial (?:Pesada|Longa|Precisa|Versátil)|Distância (?:Simples|Pesada)|Arremesso)(?: \+(?P<nivel>\d))?\.\s+'
                    r'(?P<dados>\d+d\d+) (?P<tipos>[^()]+?) \((?P<attr>Força|Destreza)\)\.\s+'
                    r'(?:\+(?P<bonus>\d) em Atacar\.\s+)?Atacar\((?P<acoes>\d)\)(?:, Arremessar\((?P<arr>\d)\))?\.\s*')
ARQ = {'Leve':'leve','Pesada':'pesada','Marcial':'marcial','Distância':'distancia','Arremesso':'distancia'}
MUNICAO_POR_CHASSI = {'Distância Simples':'Virotes/Flechas','Distância Pesada':'Munição de Fogo','Arremesso':'Conjunto de Arremesso'}

def parse_arma(r):
    e = r['Efeito']; nid = iid(r['Nome'])
    if e.startswith('Foco Místico'):
        m = re.match(r'Foco Místico \(([^)]+)\)', e)
        a = {'nome':r['Nome'],'arquetipo':'mistica','escola':m.group(1),'dados':None,'tipo':None,
             'atributo':None,'acerto':'mistico','acoes':None,'margemAmeaca':20,'multiplicadorCritico':2,
             'municao':None,'propriedades':[],'status':'canonico',
             'nota':'Foco não ataca: permite conjurar a escola. Quando a magia exige ataque, o acerto usa Místico e o dano soma Mod. INT ou SAB.'}
        req = re.search(r'Requisito: ([^.]+)\.', e)
        a['requisito'] = req.group(1) if req else None
        a['lembretes'] = [f for f in frases(e) if not re.match(r'(Foco Místico|Permite canalizar|Sem bônus|\+\d+ Místico, \+\d+ Éter máximo|Requisito: )', f)]
        resto = e
        return a, resto
    m = CHASSI.match(e)
    if not m: return None, e
    ch = m.group('chassi')
    tipos = [TIPOS[t] for t in lista_nomes(m.group('tipos')) if t in TIPOS]
    a = {'nome':r['Nome'],'chassi':ch,'nivel':int(m.group('nivel') or 0),'arquetipo':ARQ[ch.split()[0]],
         'dados':m.group('dados'),'tipo':tipos if len(tipos)>1 else (tipos[0] if tipos else m.group('tipos')),
         'tipoEscolha': len(tipos)>1,'atributo':ATRIB[m.group('attr')],'acerto':'atacar',
         'bonusAtacar':int(m.group('bonus') or 0),'acoes':int(m.group('acoes')),
         'arremessar':int(m.group('arr')) if m.group('arr') else None,
         'margemAmeaca':20,'multiplicadorCritico':2,'municao':None,'alcance':None,
         'danoExtra':[],'efeitoChassi':None,'propriedades':[],'status':'canonico'}
    resto = e[m.end():]
    mm = re.search(r'Alcance (\d+(?:,\d+)?) m', resto)
    if mm: a['alcance'] = num(mm.group(1))
    mm = re.search(r'Consome 1 munição \(([^)]+)\) por cena de combate', resto)
    if mm: a['municao'] = mm.group(1)
    elif ch in MUNICAO_POR_CHASSI: a['municao'] = MUNICAO_POR_CHASSI[ch]
    for mm in re.finditer(r'(?:^|\.\s+)\+ (\d+d\d+) ([A-ZÀ-Ú][a-zà-ú]+)', resto):
        a['danoExtra'].append({'dados':mm.group(1),'tipo':TIPOS.get(mm.group(2), mm.group(2))})
    mm = re.search(r'Efeito: (Dilacerar|Alcançar|Desorientar|Executar) \((\d) Stamina\)', resto)
    if mm: a['efeitoChassi'] = {'nome':mm.group(1),'stamina':int(mm.group(2)),
                                'gratis1xTurno':'1x/turno não custa Stamina' in resto}
    if re.search(r'(?:^|\.\s+)\+1 margem de ameaça\.', ' '+resto) and not re.search(r'Se [^.]*\+1 margem de ameaça', resto):
        a['margemAmeaca'] = 19
    if re.search(r'Crítico: \+1 Multiplicador de Crítico', resto):
        a['multiplicadorCritico'] = 3
    req = re.search(r'Requisito: ([^.]+)\.', resto)
    a['requisito'] = req.group(1) if req else None
    lemb = []
    for f in frases(resto):
        if re.match(r'(Alcance \d|Consome 1 munição|\+ \d+d\d+ |Efeito: |1x/turno não custa Stamina|Requisito: |\+1 margem de ameaça$|Crítico: \+1 Multiplicador)', f):
            continue
        lemb.append(f)
    a['lembretes'] = lemb
    return a, resto

# ---------------------------------------------------------------- consumíveis
def parse_consumivel(r):
    e = r['Efeito']; c = {'nome':r['Nome'],'categoria':r['Categoria'],'raridade':r['Raridade'],
         'efeito':[],'aplicaCondicao':[],'removeCondicao':None,'conjura':None,'alimento':False,
         'usos':usos_de(e),'duracao':None,'acoes':None,'lembretes':[],'status':'canonico','verbatim':e}
    m = re.fullmatch(r'1 uso: conjura (.+) \(magia de ([^,]+), Nível (\d)\)\.', e)
    if m:
        c['conjura'] = {'magia':m.group(1),'escola':m.group(2),'nivel':int(m.group(3))}
        c['acoes'] = 'daMagia'; c['usos'] = {'n':1,'recarga':None}
        return c
    enquanto = None
    for f in frases(e):
        if EMPILHA.fullmatch(f) or SABOR.fullmatch(f): continue
        if re.search(r'Necessária para descanso longo|substitui Comida|Refeição completa|Sacia como refeição', f):
            c['alimento'] = True
        m = re.fullmatch(r'Recupera (\S+?) de (Saúde|Stamina|Éter)(?: e (\S+?) de (Saúde|Stamina|Éter))?(?: e remove (.+))?', f) \
            or re.fullmatch(r'Recupera (\S+?) de (Saúde) e (Stamina)()(?: e remove (.+))?', f)
        if m:
            g = m.groups()
            recs = {'Saúde':'saude','Stamina':'stamina','Éter':'eter'}
            if g[3] == '' and g[2] == 'Stamina':   # "X de Saúde e Stamina"
                c['efeito'] += [{'alvo':'saude.atual','op':'soma','valor':g[0].replace('Int','mod.INT')},
                                {'alvo':'stamina.atual','op':'soma','valor':g[0].replace('Int','mod.INT')}]
            else:
                c['efeito'].append({'alvo':recs[g[1]]+'.atual','op':'soma','valor':g[0].replace('Int','mod.INT')})
                if g[2]: c['efeito'].append({'alvo':recs[g[3]]+'.atual','op':'soma','valor':g[2].replace('Int','mod.INT')})
            if g[4]: c['removeCondicao'] = remove_lista(g[4])
            continue
        m = re.fullmatch(r'(?:(?:Aplicado|Aplica) em arma|Arma):\s*(.+)', f) or re.fullmatch(r'(\+\d+d\d+ (?:Bio|Biológico) por \d+ ataques)', f)
        if m:
            x = arma_buff(m.group(1))
            if x is not None:
                c['efeito'] += x; continue
        m = re.fullmatch(r'Remove (\w+) e recupera (\S+) de Saúde e Stamina', f)
        if m:
            c['removeCondicao'] = remove_lista(m.group(1))
            v = m.group(2).replace('Int','mod.INT')
            c['efeito'] += [{'alvo':'saude.atual','op':'soma','valor':v},{'alvo':'stamina.atual','op':'soma','valor':v}]
            continue
        m = re.fullmatch(r'Remove (\d+) níve(?:l|is) de Exaustão', f)
        if m:
            c['efeito'].append({'alvo':'condicao.exaustao','op':'soma','valor':-int(m.group(1))}); continue
        m = re.fullmatch(r'Você fica (Bêbado) até o (fim da cena|próximo descanso longo)(?: e não pode removê-lo por meio nenhum)?', f)
        if m:
            c['aplicaCondicao'].append({'id':'bebado','duracao':'fimCena' if 'cena' in m.group(2) else 'descansoLongo',
                                        'removivel':'não pode removê-lo' not in f})
            continue
        m = re.fullmatch(r'Enquanto (?:estiver Bêbado|durar), (?:você tem |você é )?(.+)', f)
        if m:
            corpo = m.group(1)
            corpo = re.sub(r'^\+(\d+) em (\w+) e (\w+)$', r'+\1 \2, +\1 \3', corpo)
            x = frase_mods(corpo)
            if x is None:
                mm = re.fullmatch(r'imune a (.+)', corpo)
                if mm: x = clausula('Imune a ' + mm.group(1))
            if x is None and re.fullmatch(r'\+1 Ação por rodada', corpo): x = [{'alvo':'acoes','op':'soma','valor':1}]
            if x is not None:
                for mod in x: mod['enquanto'] = 'condicao:bebado'
                c['efeito'] += x; continue
        m = re.fullmatch(r'(?:Retira a condição|Remove(?: a condição)?) (.+?)(?: como 1 ação)?', f)
        if m and not re.search(r'\d', m.group(1)) and 'Marca' not in m.group(1):
            c['removeCondicao'] = remove_lista(m.group(1))
            if 'como 1 ação' in f: c['acoes'] = 1
            continue
        d = duracao_de(f)
        x = frase_mods(re.sub(r'\.?\s*(?:(?:Dura(?:ção)?|por)\s+)?\d+\s*(?:min|h|hora|horas)\b\.?$', '', f).rstrip('. '))
        if x is not None:
            for mod in x:
                if d: mod['duracao'] = d
            c['efeito'] += x
            if d: c['duracao'] = d
            continue
        if re.fullmatch(r'(?:Dura(?:ção)?\s+)?\d+\s*(?:min|h|hora|horas)', f):
            c['duracao'] = duracao_de(f); continue
        c['lembretes'].append(f)
    if c['duracao']:
        for mod in c['efeito']:
            if 'duracao' not in mod and not mod.get('alvo','').endswith('.atual'): mod['duracao'] = c['duracao']
    return c

def arma_buff(txt):
    """'+1d6 Fogo nos próximos 3 ataques' | '+1d4 Veneno no próximo ataque (1 uso)' | 'ignora 3 de Armadura por 3 ataques'
    | '+1 Atacar no próximo combate' -> modificadores de ataque da arma empunhada."""
    t = txt.strip().rstrip('.')
    m = re.fullmatch(r'\+(\d+d\d+) ([A-ZÀ-Ú][a-zà-ú]+) (?:no próximo ataque|nos próximos (\d+) ataques|por (\d+) ataques)(?: \(1 uso\))?', t)
    if m and m.group(2) in DANO_ATAQUE:
        n = int(m.group(3) or m.group(4) or 1)
        return [{'alvo':'ataque.danoExtra','op':'soma','valor':m.group(1),'tipo':DANO_ATAQUE[m.group(2)],'ataques':n}]
    m = re.fullmatch(r'ignora (\d+) de Armadura por (\d+) ataques', t)
    if m: return [{'alvo':'ataque.ignoraAr','op':'soma','valor':int(m.group(1)),'ataques':int(m.group(2))}]
    m = re.fullmatch(r'\+(\d+) Atacar no próximo combate', t)
    if m: return [{'alvo':'ataque.bonusAtacar','op':'soma','valor':int(m.group(1)),'duracao':'proximoCombate'}]
    return None

def remove_lista(txt):
    txt = txt.strip()
    if re.fullmatch(r'1 condição à escolha', txt): return {'condicoes':[],'escolha':1,'de':'qualquer'}
    if re.fullmatch(r'até 1 condição física', txt): return {'condicoes':[],'escolha':1,'de':'tag:fisica'}
    if re.fullmatch(r'todas as condições, incluindo mágicas', txt): return {'condicoes':[],'todas':True,'incluiMagicas':True}
    nao_magico = bool(re.search(r'não-mágico$', txt))
    txt = re.sub(r'\s+não-mágico$', '', txt)
    nomes = lista_nomes(txt)
    ids = [CONDICOES[n] for n in nomes if n in CONDICOES]
    escolha = ' ou ' in txt
    out = {'condicoes':ids,'escolha':1 if escolha else None}
    if nao_magico: out['soNaoMagico'] = True
    if len(ids) != len(nomes): out['outros'] = [n for n in nomes if n not in CONDICOES]
    return out

# ---------------------------------------------------------------- itens (equipáveis, bugigangas, munição)
def parse_generico(r, quando, slot=None):
    e = r['Efeito']
    it = {'nome':r['Nome'],'categoria':r['Categoria'],'raridade':r['Raridade'],'quando':quando,'slot':slot,
          'modificadores':[],'usos':None,'duracao':None,'acumula':True,'lembretes':[],'status':'canonico','verbatim':e}
    corpo = e
    if r['Categoria'] == 'Armadura':
        m = re.match(r'\[(Pesada|Leve)\]\s*', e)
        it['slot'] = 'armaduraPesada' if m.group(1) == 'Pesada' else 'armaduraLeve'
        corpo = e[m.end():]
    if r['Categoria'] == 'Munição':
        m = re.match(r'\[([^\]]+)\]\s*', e)
        it['compativel'] = m.group(1) if m else None
        corpo = e[m.end():] if m else e
    for f in frases(corpo):
        if EMPILHA.fullmatch(f) or SABOR.fullmatch(f): continue
        if 'O efeito não acumula com outra cópia deste mesmo item' in f or f == 'Não acumula com outras fontes':
            it['acumula'] = False; continue
        if r['Categoria'] == 'Munição':
            m = re.fullmatch(r'\+(\d+d\d+) ([A-ZÀ-Ú][a-zà-ú]+)(?: no acerto)?', f)
            if m and m.group(2) in TIPOS:
                it['modificadores'].append({'alvo':'ataque.danoExtra','op':'soma','valor':m.group(1),'tipo':TIPOS[m.group(2)]}); continue
            m = re.fullmatch(r'Ignora (\d+|toda) (?:de )?Armadura\(Ar\)(?: no acerto)?', f)
            if m: it['modificadores'].append({'alvo':'ataque.ignoraAr','op':'soma' if m.group(1)!='toda' else 'fixa',
                                              'valor':int(m.group(1)) if m.group(1)!='toda' else 'todo'}); continue
        x = frase_mods(f)
        if x is not None:
            it['modificadores'] += x; continue
        it['lembretes'].append(f)
    u = usos_de(e)
    if u: it['usos'] = u
    return it


CONVENCOES = {
 'chave': "id = 'item-' + slug(nome); slug = NFKD->ASCII, minúsculas, [^a-z0-9]+ -> '-', sem hífen nas pontas. 727 ids, 0 colisões.",
 'conta': 'itens ∪ armas ∪ consumo ∪ semEfeitoNaFicha ∪ naoParseado = os 727 ids. Um item pode estar em mais de um bloco (arma com efeito de ficha está em armas e itens; foco idem).',
 'quando': {'carregado':'vale enquanto está no inventário (bugiganga passiva, D54; mochilas)',
            'equipado':'vale enquanto equipado: armadura (1 Pesada, 2 Leves), escudo, arma ou foco (só 1 arma dá melhorias)',
            'sintonizado':'Item Mágico: vale enquanto sintonizado, máx. 3, troca no descanso longo (regra do Sistema). Vale para os 61, mesmo quando o texto diz "enquanto vestido"',
            'ativado':'o efeito liga ao usar (kits, itens com usos por descanso)',
            'municaoAtiva':'munição escolhida no início do combate: o efeito vale em todos os ataques da arma compatível até o fim do combate (D2, D41)'},
 'status': {'canonico':'saiu da gramática fechada sobre o texto do CSV, que é a fonte do Bazar',
            'aprovado':'leitura decidida pelo Pedro (rodada 3: PD21-PD26 de docs/ficha-digital/03-respostas-pedro.md)',
            'decisao':'leitura minha, revisada à mão (ficha-efeitos-overrides.json ou leitura "atributo nu")',
            'pendente':'depende do Pedro'},
 'modificador': "{alvo, op, valor} + opcionais: duracao ('10 min', '1 cena', '1 rodada', 'proximoCombate'), condicao (texto curto), enquanto ('condicao:bebado'), ativacao {usos, recarga, acao}, excecao [tipos], momento ('inicioTurno'), ataques (n de ataques que o efeito dura), tipo (tipo de dano), leitura, permanente, rolar, requerTeste, penalidade",
 'op': {'soma':'soma ao valor','fixa':'fixa o valor (booleanos: tem ou não tem)','escolha':'o jogador escolhe ao usar/vestir; ver campo escolha'},
 'lembretes': 'frases que dependem de julgamento de mesa (aliados, alvo escolhido, distância, luz, gatilho de combate). Viram texto, nunca número.',
 'usos': "{n, recarga}: recarga = 'longo' | 'curto' | 'combate' | 'cena' | null (uso único ou total de cargas)",
 'acoesDeConsumivel': "null quando o texto não diz = o mestre decide na hora (D90). Referência de tempo: 1 ação = 2 segundos; 3 ações = 6 segundos = 1 turno.",
 'indices': {'empilhaveis':'têm a propriedade Empilhável: 10 unidades = 1 de peso','fonteDeLuz':'servem de fonte de luz para o descanso longo','alimento':'servem de alimento para o descanso longo'},
 'maisInt': "'+Int' em cura de item = mod.INT de quem USA o item (regras-ficha P09)",
 'avisoRaca': "{<raca>: {modo:'confirmar', texto}}: a ficha avisa com pop-up de confirmação e deixa aplicar (PD23). Hoje só 'automato'.",
 'soParaRaca': "o item só funciona nessa raça (Kits de Manutenção: 'automato')",
 'marcaVhelor': "{soma, funcionaAteMarca?}: quanto o item move o contador de Marcas da Vhelor ao ser consumido. Textos e efeitos das 7 marcas no bloco 'marcasVhelor' (fonte única: marcas-vhelor.json)",
 'requisito': "{arma:'leve'} ou {marcaVhelorMin:n}: o item só funciona se a condição valer; a ficha avisa, não bloqueia",
}
ALVOS = {
 'imunidade.condicao.<id>':'imune a uma condição (id do catálogo de condições). Diferente de imunidade.<tipo>, que é a tipo de dano',
 'imunidade.<tipo>':'imune a um tipo de dano (os 14 da D67)',
 'resistencia.<tipo>':'Resistência (metade) a um tipo de dano',
 'vulnerabilidade.<tipo>':'Vulnerabilidade (dobro) a um tipo de dano',
 'ae.<tipo|categoria|todos>':"Armadura Específica. 'todos' = os 11 tipos atípicos menos a 'excecao'; nunca os 3 Ordinários, que são do Ar (PD22). O campo 'cobre' traz a lista final",
 'ar':'Armadura (reduz dano Ordinário). Soma com o Ar racial, sem teto (D85)',
 'pericia.<id>':"as 24 perícias. Em escudo, condicao='reacaoDefender': soma na rolagem do dado de Defender quando usa a reação",
 'testes.<FOR|DES|CON|INT|SAB>':'bônus em todo teste que usa esse atributo',
 'atributo.<FOR|DES|CON|INT|SAB>':'valor do atributo (o modificador sai dele)',
 'classe.<V|G|R>':'coeficientes de Vitalidade, Vigor e Ressonância (Coroa de Kha)',
 'saude.max | stamina.max | eter.max':'máximos',
 'saude.atual | stamina.atual | eter.atual':'valor atual (consumíveis). valor pode ser fórmula: "2d4+mod.INT", ou "eter.max" com op fixa',
 'saude.temporaria':'Saúde temporária',
 'regeneracao.saude':"cura por turno; momento='inicioTurno'; condicao 'emCombate'/'foraDeCombate'",
 'evasao.passiva':'Evasão (a Ativa herda, porque é Passiva + dado)',
 'movimento':'metros',
 'acoes':'ações por turno',
 'tamanho':'categoria de tamanho (+1/-1)',
 'margemAmeaca':'na arma, só quando incondicional (Kali, Martelo Trovejante)',
 'dano.corpoACorpo':'dano somado a ataques corpo a corpo',
 'ataque.danoExtra | ataque.ignoraAr | ataque.bonusAtacar':"linha de ataque da arma empunhada; 'ataques' = quantos ataques o efeito dura; condicao 'investida' = só nos ataques da manobra Investida",
 'capacidade.bugigangas | capacidade.equipamentos':'capacidade de carga',
 'recipiente.bugigangas':'recipiente com capacidade própria; contaPeso=false',
 'permiteSemTreino.<pericia>':'libera a perícia sem treino (Ofícios); pode ter penalidade',
 'descanso.comodidade':'nível de comodidade do descanso (condicao descansoAoArLivre)',
 'condicao.exaustao':'nível de Exaustão (op soma, valor negativo remove)',
}
PENDENCIAS = [
 {'n':1,'item':'Grevas Trovejantes','o':"'A manobra Investida concede +1d6 de dano.' Virou ataque.danoExtra 1d6 com condicao 'investida'. A manobra existe no Notion (Sistema > Manobras, D88).",'status':'resolvido (PD21)'},
 {'n':2,'item':'Ae(Todos)','o':"Os três itens com Ae(Todos) cobrem os 11 atípicos menos Força e Primordial, e nunca os 3 Ordinários (campo 'cobre').",'status':'resolvido (PD22)'},
 {'n':3,'item':'Cinturão do Colosso, Elixir do Crescimento, Elixir do Encolhimento','o':"'+2 Força' / '+2 Destreza' sem 'testes de' = valor de atributo.",'status':'aprovado (PD24)'},
 {'n':4,'item':'Consumíveis','o':"O Sistema agora diz: 'Usar item consumível (1 ação) → em você ou em outra criatura. Se o item for arremessado, siga o que ele diz.' (PD18). 'acoes: null' no item = vale essa regra.",'status':'resolvido (PD18)'},
 {'n':5,'item':'Erva Medicinal','o':"Corrigido no CSV: 'Saude' -> 'Saúde' (D91).",'status':'resolvido (D91)'},
 {'n':6,'item':'Poções, Elixires e outras curas em Autômato','o':"Avisar com pop-up de confirmação (avisoRaca). A raça diz 'Poções e Elixires não funcionam em você': vale para TODA poção e elixir, não só as de cura.",'status':'resolvido (PD23)'},
 {'n':7,'item':'Armadura do Pantaneiro, Antídoto Universal, Chá de Ervas Amargas','o':"'Envenenado' = condição Envenenamento.",'status':'aprovado (PD24)'},
 {'n':8,'item':'Anel do Esgrimista','o':"'Armas Leves.' virou requisito (PD25). Aberto: com o Sangramento em +Xd4 (D83), 'consumir todos os acúmulos de uma só vez' dá Xd4 uma vez, ou a soma de todos os acertos que eles dariam (Xd4 + (X-1)d4 + ... )? Recomendo Xd4 uma vez e zerar.",'status':'pendente: Pedro'},
 {'n':9,'item':'Elixir da Expurgão','o':"Nome de propósito ou 'Expurgação'? Se mudar, o id muda (item-elixir-da-expurgao -> item-elixir-da-expurgacao) e marcas-vhelor.json acompanha.",'status':'pendente: Pedro'},
 {'n':10,'item':'Semente da Vhelor','o':"'Consumi-la instantaneamente te transforma em um ser pecaminoso': é a Marca 7 (Sucumbência) ou outra coisa? Fica lembrete.",'status':'pendente: Pedro'},
]

# ---------------------------------------------------------------- overrides (revisão manual, status 'decisao')
OVERRIDES_PATH = os.path.join(AQUI, 'ficha-efeitos-overrides.json')

def main():
    rows = list(csv.DictReader(open(CSV, encoding='utf-8')))
    ov = json.load(open(OVERRIDES_PATH, encoding='utf-8')) if os.path.exists(OVERRIDES_PATH) else {}
    out = {'itens':{},'armas':{},'consumo':{},'semEfeitoNaFicha':[],'naoParseado':[],
           'empilhaveis':[],'fonteDeLuz':[],'alimento':[]}
    for r in rows:
        nid = iid(r['Nome']); cat = r['Categoria']; e = r['Efeito']
        if 'Empilhável' in e: out['empilhaveis'].append(nid)
        if cat == 'Lixo' or cat == 'Material':
            out['semEfeitoNaFicha'].append(nid); continue
        if cat == 'Arma':
            a, resto = parse_arma(r)
            if a is None: out['naoParseado'].append({'id':nid,'nome':r['Nome'],'motivo':'chassi fora da gramática'}); continue
            out['armas'][nid] = a
            it = parse_generico({**r, 'Efeito': re.sub(r'Requisito: [^.]+\.', '', resto)}, 'equipado', 'foco' if a['arquetipo']=='mistica' else 'arma')
            it['verbatim'] = e
            # só guarda o bloco itens da arma se ela mexe em campo de ficha
            it['modificadores'] = [m for m in it['modificadores'] if m['alvo'] != 'margemAmeaca']
            if it['modificadores']:
                it['lembretes'] = []
                out['itens'][nid] = it
            continue
        if cat in ('Consumível', 'Material, Consumível'):
            c = parse_consumivel(r)
            out['consumo'][nid] = c
            if c['alimento']: out['alimento'].append(nid)
            continue
        if cat == 'Armadura':  it = parse_generico(r, 'equipado')
        elif cat == 'Escudo':  it = parse_generico(r, 'equipado', 'escudo')
        elif cat == 'Item Mágico': it = parse_generico(r, 'sintonizado', 'sintonia')
        elif cat == 'Munição': it = parse_generico(r, 'municaoAtiva', 'municao')
        elif cat == 'Bugiganga':
            passiva = re.search(r'enquanto no inventário|de capacidade|capacidade de bugigangas', e)
            it = parse_generico(r, 'carregado' if passiva else 'ativado')
        else:
            out['naoParseado'].append({'id':nid,'nome':r['Nome'],'motivo':'categoria desconhecida: '+cat}); continue
        if re.search(r'\b[Ll]uz\b|ilumina|emite luz|Luz (?:fraca|brilhante)', e) and cat in ('Bugiganga','Consumível','Item Mágico','Escudo'):
            out['fonteDeLuz'].append(nid)
        if not it['modificadores'] and cat == 'Bugiganga' and not it['usos'] and nid not in ov:
            out['semEfeitoNaFicha'].append(nid); continue
        out['itens'][nid] = it
    # fontes de luz entre consumíveis
    for nid, c in out['consumo'].items():
        if re.search(r'emite luz|Luz brilhante|luz brilhante', c['verbatim']): out['fonteDeLuz'].append(nid)
    # bugiganga sem número mas com lembrete de campo de ficha: vai para itens (o jogador precisa ver)
    nomes = {iid(r['Nome']): r for r in rows}
    for nid in list(out['semEfeitoNaFicha']):
        r = nomes[nid]
        if r['Categoria'] == 'Bugiganga' and CAMPO_FICHA.search(r['Efeito']) and nid not in ov:
            quando = 'carregado' if 'enquanto no inventário' in r['Efeito'] else 'ativado'
            it = parse_generico(r, quando); it['status'] = 'canonico'
            out['itens'][nid] = it; out['semEfeitoNaFicha'].remove(nid)
    # leitura "atributo nu" vira decisão explícita
    for x in out['itens'].values():
        for m in x['modificadores']:
            if m.pop('_leitura', None):
                m['leitura'] = 'valor de atributo, não bônus em teste (ratificado na PD24)'; x['status'] = 'aprovado'
    # overrides manuais
    usados = set()
    for nid, o in ov.items():
        if nid.startswith('_'): continue
        if nid not in nomes: raise SystemExit(f'override para id inexistente: {nid}')
        o = dict(o); bloco = o.pop('_bloco'); usados.add(nid)
        base = out[bloco].get(nid)
        if base is None:
            # veio de outro bloco (ex.: semEfeito ou itens -> consumo)
            for b in ('itens', 'consumo'):
                if b != bloco and nid in out[b]: out[b].pop(nid)
            base = {}
        for k in ('_adicionarModificadores', '_adicionarEfeito'):
            if k in o: base.setdefault('modificadores' if 'Modific' in k else 'efeito', []).extend(o.pop(k))
        if '_removerLembretes' in o:
            rm = set(o.pop('_removerLembretes'))
            base['lembretes'] = [l for l in base.get('lembretes', []) if l not in rm]
        if '_merge' in o:
            mg = o.pop('_merge')
            extra = mg.pop('lembretesExtra', [])
            base.update(mg); base['lembretes'] = base.get('lembretes', []) + extra
        base.update(o); base['status'] = o.get('status', 'decisao')
        out[bloco][nid] = base
        if nid in out['semEfeitoNaFicha']: out['semEfeitoNaFicha'].remove(nid)
    # PD22: Ae(Todos) explicita os tipos cobertos
    for bloco in ('itens', 'consumo'):
        for x in out[bloco].values():
            for m in x.get('modificadores', []) + x.get('efeito', []):
                if m.get('alvo') == 'ae.todos':
                    m['cobre'] = [t for t in ATIPICOS if t not in m.get('excecao', [])]
    # PD23: Autômato. Poção e Elixir: cânone da raça. Outra cura de Saúde: leitura minha ('cura maior' só com Kit)
    for nid, c in out['consumo'].items():
        if c.get('soParaRaca') == 'automato': continue
        cura = any(e.get('alvo') == 'saude.atual' and e.get('op') == 'soma' for e in c.get('efeito', []))
        if re.match(r'(Poção|Poções|Elixir)\b', c['nome']):
            c['avisoRaca'] = {'automato': {'modo': 'confirmar', 'status': 'canonico', 'fonte': 'PD23 + página da raça', 'texto': AUTOMATO_TXT}}
        elif cura:
            c['avisoRaca'] = {'automato': {'modo': 'confirmar', 'status': 'decisao', 'fonte': 'PD23', 'texto': AUTOMATO_TXT,
                                           'leitura': 'não é Poção nem Elixir, mas é cura; a raça pede Kit de Manutenção para cura maior. O mestre confirma.'}}
    # PD26a: Marcas da Vhelor, fonte única em marcas-vhelor.json
    mv = json.load(open(MARCAS, encoding='utf-8'))
    subst = set(mv['substituiLembretes'])
    for nid, g in list(mv['gatilhos'].items()) + list(mv['requisitos'].items()):
        bloco = 'consumo' if nid in out['consumo'] else 'itens'
        if nid not in out[bloco]: raise SystemExit(f'marcas-vhelor: id inexistente {nid}')
        x = out[bloco][nid]
        if nid in mv['gatilhos']:
            x['marcaVhelor'] = {k: v for k, v in g.items() if k != 'fonte'} | {'status': 'aprovado', 'fonte': 'PD26a'}
        else:
            x['requisito'] = {'marcaVhelorMin': g['marcaMin'], 'status': 'aprovado', 'fonte': 'PD26a'}
        x['lembretes'] = [l for l in x.get('lembretes', []) if l not in subst]
    out['marcasVhelor'] = mv
    return rows, out

if __name__ == '__main__':
    rows, out = main()
    todos = {iid(r['Nome']) for r in rows}
    cob = set(out['itens']) | set(out['armas']) | set(out['consumo']) | set(out['semEfeitoNaFicha']) | {x['id'] for x in out['naoParseado']}
    print(f"itens {len(out['itens'])} · armas {len(out['armas'])} · consumo {len(out['consumo'])} · "
          f"semEfeito {len(out['semEfeitoNaFicha'])} · naoParseado {len(out['naoParseado'])}")
    print("conta fecha:", cob == todos, "| faltam:", sorted(todos - cob)[:10], "| sobram:", sorted(cob - todos)[:10])
    if '--relatorio' in sys.argv:
        print("\n== lembretes com número de campo de ficha (candidatos a falso negativo) ==")
        for bloco in ('itens','consumo'):
            for nid, x in out[bloco].items():
                for l in x.get('lembretes', []):
                    if CAMPO_FICHA.search(l): print(f"  [{bloco}] {x['nome']}: {l}")
    if '--escrever' in sys.argv:
        sha = hashlib.sha256(open(CSV,'rb').read()).hexdigest()[:16]
        final = {
          'schemaVersion': 'efeitos-itens/1.1',
          'geradoEm': '2026-09-26 (rev. 3: rodada 3 — PD21 Grevas, PD22 Ae(Todos), PD23 Autômato, PD24, PD25, PD26a Marcas da Vhelor)',
          'geradoPor': 'ficha-efeitos-gerador.py + ficha-efeitos-overrides.json (branch claude/khalkaria-bazar-balance-lsdfic)',
          'fonte': {'csv': 'references/bazar-v26.csv (= data/Bazar_Khalkaria_v26.csv na main: coluna Efeito idêntica nos 727; só Ingredientes difere, em 109)',
                    'sha256_16': sha, 'itens': len(rows)},
          'contagem': {k: len(out[k]) for k in ('itens','armas','consumo','semEfeitoNaFicha','naoParseado')},
          'convencoes': CONVENCOES, 'alvos': ALVOS, 'pendencias': PENDENCIAS,
          'marcasVhelor': out['marcasVhelor'],
          **{k: out[k] for k in ('itens','armas','consumo','semEfeitoNaFicha','naoParseado','empilhaveis','fonteDeLuz','alimento')}}
        json.dump(final, open(SAIDA,'w',encoding='utf-8'), ensure_ascii=False, indent=1)
        print('escrito:', SAIDA)
