#!/usr/bin/env python3
"""Tabela de efeitos por gatilho (tabela-efeitos/1): o que cada um dos 727 itens do Bazar muda na ficha.

Pedido do Pedro (via agente de HTML, 2026-10-19): "uma estrutura inteligente que tem como base uma tabela
exclusiva que infere quais são as alterações na ficha a partir de cada item".

Entrada: os blocos do ficha-efeitos-gerador.py (itens, armas, consumo, semEfeitoNaFicha) + a curadoria
(ficha-efeitos-tabela-curadoria.json), que transforma em Mod todo lembrete que mexe em número de campo.
Saída: os blocos 'tabela', 'cobertura' e 'tabelaVocabulario' do ficha-efeitos-itens.json.

Regra de método (a mesma do gerador): cada lembrete cai em exatamente um destino:
  Mod (curadoria) | lembrete com natureza (alvo, regra, utilidade, sabor, estrutural).
A construção PARA se sobrar lembrete sem natureza, se um lembrete fora de 'alvo' trouxer número de campo
(regex do checa_efeitos.py do site + a do gerador), se a curadoria citar lembrete que não existe, ou se a
conta dos 727 não fechar.
Uso: chamado pelo gerador (--escrever). Sozinho: python3 ficha-efeitos-tabela.py (só relatório).
"""
import collections, copy, json, os, re

AQUI = os.path.dirname(os.path.abspath(__file__))
CURADORIA = os.path.join(AQUI, 'ficha-efeitos-tabela-curadoria.json')

GATILHOS = ['carregar', 'equipar', 'sintonizar', 'consumir', 'usar']
SLOTS = ['arma', 'armaduraPesada', 'armaduraLeve', 'escudo']
APLICA = ['sempre', 'situacional', 'evento', 'critico']
PARA = ['portador', 'quemRecebe', 'aliados']
NATUREZAS = ['alvo', 'regra', 'utilidade', 'sabor', 'estrutural']

# regex do site (tools/checa_efeitos.py, [6]) + a do gerador: número de campo da ficha
CAMPOS = (r'Ar|Ae|Éter|Saúde|Stamina|Evasão|Movimento|Força|Destreza|Constituição|Inteligência|Sabedoria|'
          r'Atacar|Defender|Fortitude|Vontade|Reflexos|Percepção|Sobrevivência|Furtividade|Crime|'
          r'Iniciativa|Conhecimento|Medicina|Investigação|Religião|Místico|Convencimento|Intimidação|'
          r'Intuição|Enganação|Motivar|Ofício')
RE_CAMPO_SITE = re.compile(r'[+\-−]\s?\d+(?:[.,]\d+)?\s*(?:m\s+(?:de\s+)?)?(?:em\s+)?(?:testes\s+de\s+)?(?:'
                           + CAMPOS + r')\b')
RE_CAMPO_MEU = re.compile(r'(Evasão|Saúde máxima|Stamina máxima|Éter máximo|\bAr \d|Ae\(|margem de ameaça|'
                          r'Multiplicador|\+\d+ Ação|[+\-−]\d+(?:,\d+)? ?m de movimento|recupera|cura \d|'
                          r'Recupera|[+\-−]\d+ (?:em )?(?:' + CAMPOS + r'))', re.I)

# lembrete que é uma habilidade ativável (vira gatilho 'usar')
RE_ATIVAVEL = re.compile(r'^(Com \d+ aç(?:ão|ões)|Como (?:ação livre|reação|1 ação|\d+ ações)|\d+x (?:por|/)\s*\w+.*?:'
                         r'|Ao ativar|Habilidade:)')
RE_PREFIXO_USOS = re.compile(r'^(\d+)x (?:por|/)\s*(descanso longo|descanso curto|combate|cena)\s*[:,]\s*')
RE_ACAO = [(re.compile(r'\bcomo reação\b|^Como reação|\(reação\)', re.I), 'reacao'),
           (re.compile(r'\bcomo ação livre\b|^Como ação livre', re.I), 0),
           (re.compile(r'^Com (\d+) aç|\bcomo (\d+) aç|^Como (\d+) aç|\((\d+) ação\)', re.I), None)]

# natureza por regra (o que não casar e não estiver na curadoria derruba a construção)
REGRAS_NATUREZA = [
    ('estrutural', r'^(\d+ usos?(?: por descanso longo)?|\d+x ?(?:por|/) ?(?:descanso longo|descanso curto|combate|'
                   r'cena|turno|Descanso Longo|alvo por rodada)|1x/alvo por rodada|Recarrega em descanso longo|'
                   r'Requer .+|Empilhável.*|Item único|Sintonizar-se com esse item leva \d+ Descansos Longos|1 alvo|'
                   r'1 ataque(?: ou ingestão)?|Ingerid[oa](?:/inalado| ou inalado)?|Aplicar em criatura ou objeto|'
                   r'Colocar em estrutura ou objeto|Munição básica para .+|Duração \d+ turnos|1 uso|'
                   r'Kit de Manutenção de Autômatos|Pode ser usada como material .+|Não consome munição|'
                   r'Requer repouso|Só pode ser bebido enquanto você estiver Bêbado)$'),
    ('alvo', r'^(Crítico|Arremesso|Fort(?:itude)? (?:ou|para|nega)|Reflexos? (?:ou|para)|Vontade (?:ou|nega)|Nuvem|'
             r'Área de|Flash|\d+d\d+|Atacantes|Cria (?:nuvem|zona|superfície)|Criaturas? |Alvo |O alvo|Inimigos |'
             r'Ao acertar,? (?:alvos|uma|um alvo)|Ao acertar ataques|Ao acertar o mesmo|Ao acertar um alvo a|'
             r'Ao atingir|Ao aplicar|Ao consumir Exposto|Ao reduzir uma criatura a 0 de Saúde, todas|Acertar 3|'
             r'Cada (?:acerto|ataque)|Seus ataques contra uma criatura Exposta|Ataques desta arma contra|'
             r'Alvos Desorientados|Ao conjurar uma magia de Abjuração|Suas magias de Destruição de alvo único|'
             r'Puxa|Drena|Salta para|Queima|Impede cura|Cura é impossível|Reduz cura|Ignora Resistência a Fogo|'
             r'Ignora 1 de Armadura|Ignora toda Armadura$|\d+m de área|Pode ser usado como armadilha|'
             r'Tudo é empurrado|Destrói|Contra alvo de metal|Dissolve|Desintegra|Reverte|Ao injetar|'
             r'25% de chance|Arremesso)'),
]
REGRAS_NATUREZA = [(n, re.compile(rx)) for n, rx in REGRAS_NATUREZA]


class Falha(Exception):
    pass


def natureza_por_regra(txt):
    for n, rx in REGRAS_NATUREZA:
        if rx.search(txt):
            return n
    return None


def acoes_de(txt):
    for rx, v in RE_ACAO:
        m = rx.search(txt)
        if m:
            if v is None:
                return int(next(g for g in m.groups() if g))
            return v
    return None


def recarga(s):
    s = s.lower()
    return {'descanso longo': 'longo', 'descanso curto': 'curto'}.get(s, s)


ATTR = {'Força': 'FOR', 'Destreza': 'DES', 'Constituição': 'CON', 'Inteligência': 'INT', 'Sabedoria': 'SAB'}
GRAUS = ['Leigo', 'Treinado', 'Experiente', 'Mestre', 'Lendário']
TREINO = {'Treinado em Armas Marciais': 'armas-marciais', 'Treinamento À Distância': 'armas-a-distancia'}


def requisito_estruturado(txt):
    """'Inteligência ≥ 12 e Treinado em Místico' -> [{attr,min}, {pericia,grau}] (mesma leitura do site)."""
    if txt in TREINO:
        return [{'treino': TREINO[txt]}]
    out = []
    for parte in txt.split(' e '):
        m = re.fullmatch(r'(\w+) ≥ (\d+)', parte)
        if m and m.group(1) in ATTR:
            out.append({'attr': ATTR[m.group(1)], 'min': int(m.group(2))})
            continue
        m = re.fullmatch(r'(\w+) em (.+)', parte)
        if m and m.group(1) in GRAUS:
            import unicodedata
            sl = re.sub(r'[^a-z0-9]+', '-', unicodedata.normalize('NFKD', m.group(2)).encode('ascii', 'ignore').decode().lower()).strip('-')
            out.append({'pericia': sl, 'grau': GRAUS.index(m.group(1))})
            continue
        raise Falha(f'requisito sem leitura: {txt!r} (parte {parte!r})')
    return out


# ---------------------------------------------------------------- Mod
def mod_novo(m, para, acumula=True, status=None):
    """Mod do formato 1.1 -> Mod da tabela: sempre alvo, op, valor, duracao, acumula, aplica, para."""
    out = {'alvo': m['alvo'], 'op': m['op'], 'valor': m.get('valor'), 'duracao': m.get('duracao'),
           'acumula': m.get('acumula', acumula), 'aplica': m.get('aplica', 'sempre'), 'para': m.get('para', para)}
    for k, v in m.items():
        if k not in out and k not in ('ativacao', '_leitura'):
            out[k] = v
    cond = out.get('condicao')
    if cond in ('reacaoDefender', 'investida', 'descansoAoArLivre') and out['aplica'] == 'sempre':
        out['aplica'] = 'situacional'
    if status and 'status' not in out:
        out['status'] = status
    return out


def checa_mod(m, onde):
    for k in ('alvo', 'op', 'valor', 'duracao', 'acumula', 'aplica', 'para'):
        if k not in m:
            raise Falha(f'{onde}: Mod sem {k}: {m}')
    if m['aplica'] not in APLICA:
        raise Falha(f'{onde}: aplica {m["aplica"]!r}')
    if m['para'] not in PARA:
        raise Falha(f'{onde}: para {m["para"]!r}')
    if m['aplica'] == 'situacional' and not (m.get('situacao') or m.get('condicao')):
        raise Falha(f'{onde}: Mod situacional sem situacao')
    if m['aplica'] == 'evento' and not m.get('evento'):
        raise Falha(f'{onde}: Mod de evento sem evento')


# ---------------------------------------------------------------- construção
def construir(rows, out, iid, usos_de):
    cur = json.load(open(CURADORIA, encoding='utf-8'))
    cl = cur['lembretes']
    nat_cur = {(nid, t): n for n, por in cur['naturezas'].items() for nid, ts in por.items() for t in ts}
    usados_nat = set()
    usados = collections.defaultdict(set)
    tabela = {}
    sem = set(out['semEfeitoNaFicha'])
    marcas = out['marcasVhelor']

    def classifica(nid, txt, onde):
        """-> (lembrete_ou_None, curadoria_ou_None)."""
        c = cl.get(nid, {}).get(txt)
        if c is not None:
            usados[nid].add(txt)
            if any(k in c for k in ('mods', 'aplicaCondicao', 'removeCondicao', 'conjura')) and 'resto' not in c \
                    and 'natureza' not in c:
                return None, c
            nat = c.get('natureza') or natureza_por_regra(c.get('resto', txt))
            if nat is None:
                raise Falha(f'{nid} ({onde}): curadoria sem natureza para "{txt}"')
            return {'texto': c.get('resto', txt), 'natureza': nat}, c
        nat = nat_cur.get((nid, txt))
        if nat:
            usados_nat.add((nid, txt))
        else:
            nat = natureza_por_regra(txt)
        if nat is None:
            raise Falha(f'{nid} ({onde}): lembrete sem natureza nem curadoria: "{txt}"')
        return {'texto': txt, 'natureza': nat}, None

    def aplica_cur(alvo, c, para):
        for m in c.get('mods', []):
            alvo.setdefault('mods', []).append(mod_novo(m, para, status=m.get('status', 'decisao')))
        for k in ('aplicaCondicao', 'removeCondicao'):
            if k in c:
                alvo.setdefault(k, []).extend(c[k])
        if 'conjura' in c:
            alvo['conjura'] = c['conjura']

    def habilidade(nid, txt, base_usos, requer, verbatim, para):
        """Lembrete ativável -> habilidade do gatilho 'usar'."""
        h = {'texto': txt, 'requer': requer, 'acoes': acoes_de(txt), 'usos': None, 'mods': [], 'lembretes': []}
        m = RE_PREFIXO_USOS.match(txt)
        if m:
            h['usos'] = {'n': int(m.group(1)), 'recarga': recarga(m.group(2))}
        elif base_usos:
            h['usos'] = base_usos
        lem, c = classifica(nid, txt, 'usar')
        if c:
            aplica_cur(h, c, para)
            for k in ('acoes', 'usos', 'duracao'):
                if k in c:
                    h[k] = c[k]
        if lem:
            h['lembretes'].append(lem)
        return h

    id_por_nome = {r['Nome']: iid(r['Nome']) for r in rows}
    for r in rows:
        nid = iid(r['Nome'])
        cat, e = r['Categoria'], r['Efeito']
        it, ar, co = out['itens'].get(nid), out['armas'].get(nid), out['consumo'].get(nid)
        linha = {'nome': r['Nome'], 'categoria': cat, 'raridade': r['Raridade'], 'gatilhos': {},
                 'acumulaCopia': True, 'status': 'canonico'}
        st = [b['status'] for b in (it, ar, co) if b]
        if nid in sem:
            motivo = {'Lixo': 'lixo', 'Material': 'material'}.get(cat, 'utilitario')
            linha['semEfeito'] = {'motivo': motivo,
                                  'texto': None if motivo != 'utilitario' else e}
            linha['acumulaCopia'] = None
            tabela[nid] = linha
            continue

        acumula_mod = True
        if it and it.get('acumula') is False:
            if it.get('acumulaSentido') == 'fontes':
                acumula_mod = False
            else:
                linha['acumulaCopia'] = False

        base_usos = usos_de(e)
        if re.search(r'Recarrega em descanso longo', e) and base_usos and base_usos['recarga'] is None:
            base_usos = {'n': base_usos['n'], 'recarga': 'longo'}
        g = linha['gatilhos']

        # ---- base: equipar / sintonizar / carregar
        if ar or (it and it['quando'] in ('equipado', 'sintonizado', 'carregado')):
            if ar:
                chave, slot, para = 'equipar', 'arma', 'portador'
            elif it['quando'] == 'equipado':
                chave, slot, para = 'equipar', it['slot'], 'portador'
            elif it['quando'] == 'sintonizado':
                chave, slot, para = 'sintonizar', None, 'portador'
            else:
                chave, slot, para = 'carregar', None, 'portador'
            base = {'mods': [], 'lembretes': []}
            if slot:
                base['slot'] = slot
            if chave == 'sintonizar':
                base['descansos'] = it.get('sintoniaDescansos') or 1
            if ar:
                a = {k: v for k, v in ar.items() if k not in ('nome', 'status', 'lembretes', 'propriedades')}
                if a.get('municao'):
                    a['municao'] = id_por_nome[a['municao']]
                if a.get('requisito'):
                    a['requisitoTexto'] = a['requisito']
                    a['requisito'] = requisito_estruturado(a['requisito'])
                base['arma'] = a
                if a.get('arquetipo') == 'mistica':
                    base['foco'] = True
            requer = chave if chave != 'carregar' else None
            usar = []
            mods_base = (it or {}).get('modificadores', [])
            for m in mods_base:
                if 'ativacao' in m:
                    at = m['ativacao']
                    usar.append({'texto': it.get('verbatim'), 'requer': requer, 'acoes': at.get('acao'),
                                 'usos': {'n': at['usos'], 'recarga': at['recarga']} if at.get('usos') else None,
                                 'mods': [mod_novo(m, 'portador', acumula_mod, it['status'])], 'lembretes': []})
                else:
                    base['mods'].append(mod_novo(m, para, acumula_mod, it['status']))
            for k in ('compativel', 'requisito'):
                if it and it.get(k):
                    base[k] = it[k]
            lems = list((it or {}).get('lembretes', [])) + [l for l in (ar or {}).get('lembretes', [])
                                                             if l not in (it or {}).get('lembretes', [])]
            n_ativ = sum(1 for l in lems if RE_ATIVAVEL.match(l))
            for l in lems:
                if RE_ATIVAVEL.match(l) or (cl.get(nid, {}).get(l, {}).get('gatilho') == 'usar'):
                    usar.append(habilidade(nid, l, base_usos if n_ativ <= 1 else None, requer, e, para))
                    continue
                lem, c = classifica(nid, l, chave)
                if c:
                    aplica_cur(base, c, para)
                if lem:
                    base['lembretes'].append(lem)
            g[chave] = base
            if usar:
                g['usar'] = usar

        # ---- munição, bugiganga ativada e consumíveis
        elif it and it['quando'] == 'municaoAtiva':
            base = {'consome': {'unidades': 1, 'por': 'cena de combate'}, 'duracao': '1 cena',
                    'compativel': it.get('compativel'), 'mods': [], 'lembretes': []}
            for m in it['modificadores']:
                base['mods'].append(mod_novo(m, 'portador', acumula_mod, it['status']))
            for l in it.get('lembretes', []):
                lem, c = classifica(nid, l, 'consumir')
                if c:
                    aplica_cur(base, c, 'portador')
                if lem:
                    base['lembretes'].append(lem)
            g['consumir'] = base
        elif it and it['quando'] == 'ativado':
            u = it.get('usos') or base_usos
            if u and re.search(r'Recarrega em descanso longo', e):
                u = {'n': u['n'], 'recarga': 'longo'}
            chave = 'consumir' if (u and u['recarga'] is None) else 'usar'
            h = {'texto': e, 'requer': None, 'acoes': acoes_de(e), 'usos': u, 'mods': [], 'lembretes': []}
            if chave == 'consumir':
                h = {'consome': {'cargas': u['n']}, 'acoes': acoes_de(e), 'duracao': it.get('duracao'),
                     'mods': [], 'lembretes': []}
            for m in it['modificadores']:
                mm = dict(m)
                at = mm.pop('ativacao', None)
                if at and at.get('acao') is not None:
                    h['acoes'] = at['acao']
                h['mods'].append(mod_novo(mm, 'portador', acumula_mod, it['status']))
            for l in it.get('lembretes', []):
                lem, c = classifica(nid, l, chave)
                if c:
                    aplica_cur(h, c, 'portador')
                    for k in ('acoes', 'usos', 'duracao'):
                        if k in c:
                            h[k] = c[k]
                if lem:
                    h['lembretes'].append(lem)
            g[chave] = h if chave == 'consumir' else [h]
        elif co:
            h = {'consome': {'unidades': 1}, 'acoes': co['acoes'], 'duracao': co['duracao'], 'usos': co['usos'],
                 'mods': [mod_novo(m, 'quemRecebe', True, co['status']) for m in co['efeito']],
                 'aplicaCondicao': copy.deepcopy(co['aplicaCondicao']),
                 'removeCondicao': [co['removeCondicao']] if co['removeCondicao'] else [],
                 'conjura': co['conjura'], 'alimento': co['alimento'], 'lembretes': []}
            for k in ('avisoRaca', 'soParaRaca', 'gera', 'requisito'):
                if k in co:
                    h[k] = co[k]
            if 'marcaVhelor' in co and co['marcaVhelor']['soma']:
                mv = co['marcaVhelor']
                m = {'alvo': 'marcaVhelor', 'op': 'soma', 'valor': mv['soma'], 'duracao': None, 'acumula': True,
                     'aplica': 'sempre', 'para': 'quemRecebe', 'permanente': True, 'status': mv['status']}
                if mv.get('funcionaAteMarca'):
                    m['enquanto'] = f'marcaVhelor<={mv["funcionaAteMarca"]}'
                h['mods'].append(m)
            for l in co.get('lembretes', []):
                lem, c = classifica(nid, l, 'consumir')
                if c:
                    aplica_cur(h, c, 'quemRecebe')
                    for k in ('acoes', 'duracao', 'requisito'):
                        if k in c:
                            h[k] = c[k]
                if lem:
                    h['lembretes'].append(lem)
            g['consumir'] = h
        else:
            raise Falha(f'{nid}: item sem bloco nem "sem efeito"')

        # requisito de Marca (Talismã da Seiva)
        if it and isinstance(it.get('requisito'), dict) and 'marcaVhelorMin' in it['requisito']:
            for k in ('sintonizar', 'equipar', 'carregar'):
                if k in g:
                    g[k]['requisito'] = it['requisito']
        # status: o pior entre os blocos e a curadoria
        if nid in usados:
            st.append('decisao')
        ordem = ['canonico', 'aprovado', 'decisao', 'pendente']
        linha['status'] = max(st, key=ordem.index) if st else 'canonico'
        tabela[nid] = linha

    # linhas: ajustes de item inteiro (requisito, pendência)
    for nid, aj in cur.get('linhas', {}).items():
        if nid.startswith('_'):
            continue
        if nid not in tabela:
            raise Falha(f'curadoria.linhas: id inexistente {nid}')
        for k, v in aj.items():
            if k == 'gatilhos':
                for gk, gv in v.items():
                    alvo = tabela[nid]['gatilhos'][gk]
                    alvo = alvo[0] if isinstance(alvo, list) else alvo
                    alvo.update(gv)
            else:
                tabela[nid][k] = v

    # curadoria que não achou lembrete = erro (texto mudou no CSV)
    for nid, d in cl.items():
        if nid.startswith('_'):
            continue
        sobra = set(d) - usados.get(nid, set())
        if sobra:
            raise Falha(f'curadoria cita lembrete que não existe em {nid}: {sorted(sobra)}')
    sobra = set(nat_cur) - usados_nat
    if sobra:
        raise Falha(f'curadoria.naturezas cita lembrete que não existe: {sorted(sobra)}')

    valida(tabela)
    return tabela, cobertura(tabela, marcas), vocabulario()


def mods_de(linha):
    for gk, gv in linha['gatilhos'].items():
        for h in (gv if isinstance(gv, list) else [gv]):
            for m in h.get('mods', []):
                yield gk, m


def lembretes_de(linha):
    for gk, gv in linha['gatilhos'].items():
        for h in (gv if isinstance(gv, list) else [gv]):
            for l in h.get('lembretes', []):
                yield gk, l


def valida(tabela):
    erros = []
    for nid, l in tabela.items():
        if not l['gatilhos'] and 'semEfeito' not in l:
            erros.append(f'{nid}: sem gatilho e sem "semEfeito"')
        for gk in l['gatilhos']:
            if gk not in GATILHOS:
                erros.append(f'{nid}: gatilho {gk!r}')
        if 'equipar' in l['gatilhos'] and l['gatilhos']['equipar'].get('slot') not in SLOTS:
            erros.append(f'{nid}: slot {l["gatilhos"]["equipar"].get("slot")!r}')
        for gk, m in mods_de(l):
            try:
                checa_mod(m, f'{nid}.{gk}')
            except Falha as e:
                erros.append(str(e))
        for gk, lem in lembretes_de(l):
            if lem['natureza'] not in NATUREZAS:
                erros.append(f'{nid}: natureza {lem["natureza"]!r}')
            if lem['natureza'] != 'alvo' and (RE_CAMPO_SITE.search(lem['texto'])):
                erros.append(f'{nid}: lembrete "{lem["texto"]}" ({lem["natureza"]}) traz número de campo')
    if erros:
        raise Falha('\n'.join(erros))


def cobertura(tabela, marcas):
    por_gat = collections.Counter()
    por_cat = collections.defaultdict(collections.Counter)
    por_slot = collections.Counter()
    sem = collections.Counter()
    aplica, para, alvos = collections.Counter(), collections.Counter(), collections.Counter()
    nat = collections.Counter()
    alvo_com_numero = []
    n_mods = 0
    for nid, l in tabela.items():
        cat = l['categoria']
        if 'semEfeito' in l:
            por_gat['semEfeito'] += 1
            por_cat[cat]['semEfeito'] += 1
            sem[l['semEfeito']['motivo']] += 1
        for gk, gv in l['gatilhos'].items():
            por_gat[gk] += 1
            por_cat[cat][gk] += 1
            if gk == 'equipar':
                por_slot[gv['slot']] += 1
        for gk, m in mods_de(l):
            n_mods += 1
            aplica[m['aplica']] += 1
            para[m['para']] += 1
            alvos[m['alvo'].split('.')[0]] += 1
        for gk, lem in lembretes_de(l):
            nat[lem['natureza']] += 1
            if lem['natureza'] == 'alvo' and RE_CAMPO_SITE.search(lem['texto']):
                alvo_com_numero.append(f'{nid}: {lem["texto"]}')
    com_efeito = sum(1 for l in tabela.values() if 'semEfeito' not in l)
    return {
        'itens': len(tabela),
        'conta': f'{com_efeito} com gatilho + {por_gat["semEfeito"]} sem efeito = {len(tabela)}',
        'porGatilho': {k: por_gat[k] for k in GATILHOS + ['semEfeito']},
        'porGatilhoNota': 'itens com pelo menos um efeito naquele gatilho; um item pode ter mais de um (ex.: arma que '
                          'se equipa e tem habilidade de usar)',
        'porSlot': {k: por_slot[k] for k in SLOTS},
        'porCategoria': {c: dict(sorted(v.items())) for c, v in sorted(por_cat.items())},
        'semEfeito': dict(sem),
        'mods': {'total': n_mods, 'porAplica': dict(aplica), 'porPara': dict(para),
                 'porFamiliaDeAlvo': dict(sorted(alvos.items()))},
        'lembretes': {'total': sum(nat.values()), 'porNatureza': {k: nat[k] for k in NATUREZAS}},
        'lembretesComNumeroDeCampo': {
            'foraDeAlvo': 0,
            'deAlvo': len(alvo_com_numero),
            'deAlvoNota': 'número que vale para OUTRA criatura (inimigo atingido, criaturas na área): não é campo da '
                          'ficha de quem usa',
            'listaDeAlvo': alvo_com_numero},
        'vhelor': {'somam': sorted(i for i, g in marcas['gatilhos'].items() if g['soma'] > 0),
                   'tiram': sorted(i for i, g in marcas['gatilhos'].items() if g['soma'] < 0),
                   'zero': sorted(i for i, g in marcas['gatilhos'].items() if g['soma'] == 0),
                   'requisito': sorted(marcas['requisitos'])},
    }


def vocabulario():
    return {
        'schemaVersion': 'tabela-efeitos/1',
        'linha': "{nome, categoria, raridade, gatilhos:{<gatilho>: ...}, acumulaCopia, status} ou, para os 116 sem "
                 "efeito, gatilhos:{} + semEfeito:{motivo, texto}",
        'gatilhos': {
            'carregar': 'vale enquanto o item está no inventário. {mods, lembretes}',
            'equipar': "vale enquanto equipado. {slot, mods, lembretes, arma?, foco?, requisito?}. slot ∈ arma | "
                       "armaduraPesada | armaduraLeve | escudo. Foco Místico usa o slot da arma (foco:true); só 1 arma "
                       "dá melhorias; 1 Armadura Pesada, 2 Leves",
            'sintonizar': 'Item Mágico: vale enquanto sintonizado, máx. 3, troca no descanso longo. {descansos, mods, '
                          'lembretes, requisito?}. descansos = descansos longos para sintonizar (Coroa de Kha e '
                          'Amuleto de Malkhor: 2)',
            'consumir': "o item (ou 1 unidade/carga) sai do inventário. {consome, acoes, duracao, mods, aplicaCondicao, "
                        "removeCondicao, conjura, alimento, usos?, lembretes, avisoRaca?, soParaRaca?, requisito?}. "
                        "consome = {unidades:1} | {unidades:1, por:'cena de combate'} (munição) | {cargas:n} (kit com n "
                        "usos: o item some na última). Mods com para:'quemRecebe' valem em quem recebe o item (você ou "
                        "outra criatura, regra do Sistema)",
            'usar': "LISTA de habilidades de um item que fica: {texto, requer, acoes, usos, mods, aplicaCondicao?, "
                    "removeCondicao?, conjura?, lembretes}. requer = o gatilho que precisa valer antes "
                    "('sintonizar', 'equipar' ou null). usos = {n, recarga} ou null (sem limite)",
        },
        'mod': "{alvo, op, valor, duracao, acumula, aplica, para} sempre presentes; opcionais: situacao (texto, com "
               "aplica 'situacional'), evento (texto, com aplica 'evento'), enquanto (estado que a ficha confere "
               "sozinha), tipo (tipo de dano), ataques (n de ataques), escolha, excecao, cobre, alcance, area, nota, "
               "leitura, permanente, status",
        'aplica': {
            'sempre': 'a ficha soma direto enquanto o gatilho vale (e o enquanto, se houver)',
            'situacional': 'bônus condicional: a ficha mostra ao lado do campo e o jogador liga quando a situação vale',
            'evento': 'efeito instantâneo quando o evento acontece (botão): cura ao derrubar, +Ar ao levar dano',
            'critico': 'só no crítico (linha de ataque)',
        },
        'para': {'portador': 'quem tem o item', 'quemRecebe': 'quem consome ou recebe o consumível',
                 'aliados': 'aliados no alcance; a ficha do aliado aplica (o portador entra só se o texto disser)'},
        'acumula': "true | false (não acumula com outras fontes) | 'maior' (vale só o maior). acumulaCopia (na "
                   "linha): false = não acumula com outra cópia do mesmo item; null = item sem efeito",
        'arma': "equipar.arma: municao = id do item de munição; requisito = lista [{attr,min} | {pericia,grau} | "
                "{treino}] e requisitoTexto = o texto do CSV",
        'duracao': "null = enquanto o gatilho vale. '<n> min|h|cena|rodada|rodadas|turno|turnos' | 'proximoCombate' | "
                   "'fimDoCombate' | 'descansoLongo' (até o próximo) | 'proximoDescansoLongo' (vale no próximo)",
        'valor': "inteiro | dado ou fórmula em texto ('2d6', '2d4+mod.INT', 'saude.max/2', 'danoCausado/2') | "
                 "booleano (op fixa) | {ate:n} = o jogador escolhe de 0 até n",
        'enquanto': "'condicao:<id>' | 'saudeAbaixoDaMetade' | 'portadorNaoCaido' | 'marcaVhelor<=n'",
        'alvosNovos': {
            '_nota': 'alvos que a tabela usa e o arquivo 1.1 não tinha; o site decide se vira campo ou lembrete com número',
            'ataque.danoFixo': 'dano fixo somado ao ataque',
            'ataque.danoMaximo': 'o ataque causa dano máximo nos dados (op fixa true)',
            'ataque.dados': '+n dados da arma',
            'ataque.multiplicadorCritico': '+n no multiplicador de crítico',
            'ataque.alcance': 'alcance do ataque em m (op fixa)',
            'ataque.ignoraAe': 'ignora Armadura Específica',
            'ataque.efeitoChassi.stamina': 'custo de Stamina do efeito da arma (Executar, Alcançar…)',
            'ataque.efeitoChassi.alcance': 'alcance extra do Alcançar, em m',
            'dano.porDado': '+n por dado de dano de um tipo (tipo no Mod)',
            'desarmado.dano': 'dado do ataque desarmado (op fixa) e tipo',
            'desarmado.danoExtra': 'dado extra no ataque desarmado',
            'magia.dadosDano': '+n dados de dano em magias (situacao diz quais)',
            'magia.custoEter': 'custo de Éter da magia (op fixa 0 = sem gastar Éter)',
            'sentido.visaoNoEscuro | sentido.verInvisivel | sentido.visaoVerdadeira | sentido.verIlusoesSimples':
                'sentidos; valor em m (op maximo) ou true',
            'resistirCondicao.<id>': 'vantagem (op vantagem) para resistir a uma condição',
            'descanso.longoDados': 'dados extras no próximo descanso longo (escolha do status)',
            'limiar.maos': 'mãos de cartas do Limiar',
            'marcaVhelor': 'contador de Marcas da Vhelor (0 a 7). A seção das Marcas fica OCULTA na ficha até o '
                           'contador passar de 0 pela primeira vez',
            'acao.sacarItem': 'custo em ações de sacar ou guardar item',
            'salto': 'distância de salto (op soma em m, op multiplica)',
        },
        'naturezaDosLembretes': {
            'alvo': 'efeito em outra criatura (inimigo atingido, área, teste do alvo): não é campo da ficha',
            'regra': 'regra de mesa sobre o portador sem número de campo (escalar, respirar, não ser retaliado)',
            'utilidade': 'ferramenta de exploração ou narrativa',
            'sabor': 'descrição sem efeito',
            'estrutural': 'já está na estrutura (usos, requisito, empilhável, sintonia de 2 descansos)',
        },
    }


if __name__ == '__main__':
    import importlib.util
    spec = importlib.util.spec_from_file_location('ger', os.path.join(AQUI, 'ficha-efeitos-gerador.py'))
    ger = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(ger)
    rows, out = ger.main()
    tab, cob, _ = construir(rows, out, ger.iid, ger.usos_de)
    print(json.dumps(cob, ensure_ascii=False, indent=1))
