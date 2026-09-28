#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Regras compiladas da ficha (F3b): contrato do balanceamento + blocos do site
-> js/ficha/00-regras-dados.js (window.KhRegrasDados).

É DADO, sem eval: cada fórmula do contrato vira AST ({t:'num'|'ref'|'op'|'neg'|
'fn'|'esc'|'dado'}), e cada nó da AST leva o status (st) e a fonte (fo) da regra
de onde saiu. O KhRegras (js/ficha/kh-regras.js) avalia essa AST; nada aqui
executa texto.

Entradas (todas de data/, nenhuma de rede):
  data/balanceamento/ficha-digital-regras.json   contrato regras-ficha (projeção publicada)
  data/classes/*.json, data/racas/*.json         blocos classe/raca (Notion verbatim, F1b)
  data/pericias.json, data/condicoes.json        24 perícias e 30 condições do site
  data/magias.json                               nível/escola/intensidades (custo síncrono)
  data/sistema.json                              frases que confirmam regra sem status no contrato
  tools/alias_ids.json                           ids do contrato fora da convenção do site
  tools/pendentes_balanceamento.json             perguntas em voo (selo PENDENTE (balanceamento))

Status (plano §3.2): canonico e canonicoParcial ('parcial: …') sem selo;
aprovado e decisao = "decisão do Pedro, falta Notion"; pedroDecide, pendente e
decisaoDoSite = PENDENTE PEDRO; canonico-mas-em-rework = aviso de classe;
emDesenho nunca entra. Regra do contrato SEM campo status ("nada aqui é
canônico só porque está escrito") herda o status do ancestral; sem nenhum, só
vira canônica se um bloco do site (Notion verbatim) confirmar o mesmo valor
(CONFIRMACOES, conferido aqui); senão sai 'semStatus', com selo PENDENTE
(balanceamento). Status fora do vocabulário DERRUBA o build.

ARTEFATO: o validar.py regenera numa cópia e compara byte a byte; o build
roda este gerador antes de concatenar o js/ficha.js.

Uso: python tools/gerar_regras_ficha.py [repo_root]
"""
import glob, hashlib, json, os, re, sys

TOOLS = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, TOOLS)
import normaliza  # noqa: E402
from kf_marca import separa_icone  # noqa: E402

RAIZ = os.path.dirname(TOOLS)
REPO = next((a for a in sys.argv[1:] if not a.startswith('--')), RAIZ)
SAIDA = os.path.join(REPO, 'js', 'ficha', '00-regras-dados.js')
SCHEMA = 'regras-dados/1'

ATRIBUTOS = ['FOR', 'DES', 'CON', 'INT', 'SAB']
CLASSES = ['espadachim', 'batedor', 'brutalista', 'teurgo', 'monge', 'alquimista', 'artilheiro']
RACAS = ['humano', 'anao', 'dryad', 'automato', 'gruto', 'inseto', 'corrompido']
ESCOLAS = ('destruicao', 'abjuracao', 'alteracao', 'conhecimento')
INTENSIDADES = ['contida', 'normal', 'forcada', 'transbordante']

# status do contrato -> categoria de selo (o KhRegras só lê esta tabela)
SELO = {
    'canonico': None, 'canonicoParcial': None,
    'aprovado': 'decisaoPedro', 'decisao': 'decisaoPedro',
    'pedroDecide': 'pendentePedro', 'pendente': 'pendentePedro', 'decisaoDoSite': 'pendentePedro',
    'pendenteBalanceamento': 'pendenteBalanceamento', 'semStatus': 'pendenteBalanceamento',
    'canonico-mas-em-rework': 'avisoClasse',
    'ajuste': 'ajuste',
}
ROTULO_SELO = {
    'decisaoPedro': 'decisão do Pedro, falta Notion',
    'pendentePedro': 'PENDENTE PEDRO',
    'pendenteBalanceamento': 'PENDENTE (balanceamento)',
    'avisoClasse': 'classe em rework',
    'ajuste': 'ajuste manual',
}
# do mais firme ao menos firme: o nó leva o pior status dos termos ativos
ORDEM_STATUS = ['canonico', 'canonicoParcial', 'aprovado', 'decisao', 'canonico-mas-em-rework',
                'decisaoDoSite', 'pedroDecide', 'pendente', 'pendenteBalanceamento', 'semStatus']
VOCAB = set(SELO) - {'ajuste'} | {'emDesenho'}
# alvo do contrato -> namespace do site (plano §3.2, tools/alvos_destino.json)
ALVO_ALIAS = {'evasao': 'evasao.passiva'}
# listas de log do contrato (histórico de gravação no Notion, não são regra)
FORA_DA_VALIDACAO = {'pendenciasNotion', 'baixaDePendencia'}


class Falha(Exception):
    pass


def ler(*p):
    return json.load(open(os.path.join(REPO, *p), encoding='utf-8'))


def ler_tools(n):
    return json.load(open(os.path.join(TOOLS, n), encoding='utf-8'))


# ---------------------------------------------------------------- status
def normaliza_status(s, onde):
    if not isinstance(s, str):
        raise Falha(f'status não textual em {onde}: {s!r}')
    if s.startswith('parcial:'):
        return 'canonicoParcial'
    if s not in VOCAB:
        raise Falha(f'status desconhecido em {onde}: {s!r} (vocabulário: {sorted(VOCAB)} ou "parcial: …")')
    return s


def valida_status(o, cam='', fora=FORA_DA_VALIDACAO):
    """Todo 'status' e '<campo>Status' do contrato tem de estar no vocabulário."""
    if isinstance(o, dict):
        for k, v in o.items():
            if k in fora and not cam:
                continue
            c = f'{cam}.{k}' if cam else k
            if (k == 'status' or k.endswith('Status')) and isinstance(v, str):
                normaliza_status(v, c)
            valida_status(v, c, fora)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            valida_status(v, f'{cam}[{i}]', fora)


def status_em(raiz, cam):
    """Status de uma regra pelo caminho (lista de chaves): '<chave>Status' no pai,
    'status' no próprio nó ou o do ancestral mais próximo. None se não houver."""
    nos = [raiz]
    for k in cam:
        nos.append(nos[-1][k])
    folha = cam[-1] if cam else None
    pai = nos[-2] if len(nos) > 1 else None
    if isinstance(folha, str) and isinstance(pai, dict) and isinstance(pai.get(folha + 'Status'), str):
        return normaliza_status(pai[folha + 'Status'], '.'.join(map(str, cam)))
    for no, i in zip(reversed(nos), range(len(nos) - 1, -1, -1)):
        if isinstance(no, dict) and isinstance(no.get('status'), str):
            return normaliza_status(no['status'], '.'.join(map(str, cam[:i])) or '(raiz)')
    return None


def cam_str(cam):
    return '.'.join(str(c) for c in cam)


# ---------------------------------------------------------------- fórmulas -> AST
REFS = ({'attr', 'nivel', 'X', 'classe.V', 'classe.G', 'classe.R', 'recurso.saude.max',
         'recurso.eter.max', 'recurso.stamina.max', 'evasao.passiva'}
        | {f'mod.{a}' for a in ATRIBUTOS})
FUNCOES = {'floor', 'max', 'min', 'escolha', 'dado'}
TOKEN = re.compile(r'\s*(?:(\d+(?:\.\d+)?)|([A-Za-z_][A-Za-z0-9_.]*)|(\S))')


def tokens(txt):
    out, pos = [], 0
    txt = txt.strip()
    while pos < len(txt):
        m = TOKEN.match(txt, pos)
        if not m or m.end() == pos:
            raise Falha(f'fórmula ilegível: {txt!r}')
        num, ident, sim = m.groups()
        pos = m.end()
        if num is not None:
            out.append(('num', float(num) if '.' in num else int(num)))
        elif ident is not None:
            out.append(('id', ident))
        elif sim is not None:
            if sim not in '+-*/(),':
                raise Falha(f'símbolo {sim!r} fora da gramática em {txt!r}')
            out.append(('s', sim))
    return out


class Parser:
    """expr := termo (('+'|'-') termo)* ; termo := unario (('*'|'/') unario)* ;
    unario := '-' unario | primario ; primario := num | ref | fn '(' args ')' | '(' expr ')'"""

    def __init__(self, txt, st, fo, st_escolha=None, fo_escolha=None):
        self.txt, self.t, self.i = txt, tokens(txt), 0
        self.st, self.fo = st, fo
        self.st_esc, self.fo_esc = st_escolha or st, fo_escolha or fo

    def no(self, **kw):
        kw.setdefault('st', self.st)
        kw.setdefault('fo', self.fo)
        return kw

    def olha(self):
        return self.t[self.i] if self.i < len(self.t) else (None, None)

    def come(self, tipo=None, val=None):
        tk = self.olha()
        if tk[0] is None or (tipo and tk[0] != tipo) or (val is not None and tk[1] != val):
            raise Falha(f'fórmula {self.txt!r}: esperava {val or tipo}, veio {tk[1]!r}')
        self.i += 1
        return tk

    def tudo(self):
        e = self.expr()
        if self.i != len(self.t):
            raise Falha(f'fórmula {self.txt!r}: sobrou {self.t[self.i:]}')
        return e

    def expr(self):
        a = self.termo()
        while self.olha() in (('s', '+'), ('s', '-')):
            op = self.come()[1]
            a = self.no(t='op', op=op, a=a, b=self.termo())
        return a

    def termo(self):
        a = self.unario()
        while self.olha() in (('s', '*'), ('s', '/')):
            op = self.come()[1]
            a = self.no(t='op', op=op, a=a, b=self.unario())
        return a

    def unario(self):
        if self.olha() == ('s', '-'):
            self.come()
            return self.no(t='neg', a=self.unario())
        return self.primario()

    def primario(self):
        tipo, v = self.olha()
        if tipo == 'num':
            self.come()
            return self.no(t='num', v=v)
        if tipo == 's' and v == '(':
            self.come()
            e = self.expr()
            self.come('s', ')')
            return e
        if tipo == 'id':
            self.come()
            if self.olha() == ('s', '('):
                if v not in FUNCOES:
                    raise Falha(f'função {v!r} fora da gramática em {self.txt!r}')
                self.come()
                if v == 'dado':
                    per = self.come('id')[1]
                    self.come('s', ')')
                    return self.no(t='dado', pericia=per)
                args = [self.expr()]
                while self.olha() == ('s', ','):
                    self.come()
                    args.append(self.expr())
                self.come('s', ')')
                if v == 'escolha':
                    return self.no(t='esc', args=args, modo='maior', st=self.st_esc, fo=self.fo_esc)
                return self.no(t='fn', fn=v, args=args)
            if v not in REFS:
                raise Falha(f'referência {v!r} fora do vocabulário em {self.txt!r}')
            return self.no(t='ref', ref=v)
        raise Falha(f'fórmula {self.txt!r}: token inesperado {v!r}')


def ast(txt, st, fo, **kw):
    if isinstance(txt, (int, float)):
        txt = str(txt)
    return Parser(txt, st, fo, **kw).tudo()


def avalia(no, amb):
    """Avaliador Python (só para conferir o contrato contra os blocos aqui)."""
    t = no['t']
    if t == 'num':
        return no['v']
    if t == 'ref':
        return amb[no['ref']]
    if t == 'neg':
        return -avalia(no['a'], amb)
    if t == 'op':
        a, b = avalia(no['a'], amb), avalia(no['b'], amb)
        op = no['op']
        return a + b if op == '+' else a - b if op == '-' else a * b if op == '*' else a / b
    if t == 'esc':
        return max(avalia(x, amb) for x in no['args'])
    if t == 'fn':
        v = [avalia(x, amb) for x in no['args']]
        return {'floor': lambda: __import__('math').floor(v[0]), 'max': lambda: max(v),
                'min': lambda: min(v)}[no['fn']]()
    raise Falha(f'nó {t} sem avaliação')


AMBIENTES = [dict({'nivel': n, 'classe.V': 4, 'classe.G': 6, 'classe.R': 5},
                  **{f'mod.{a}': m for a, m in zip(ATRIBUTOS, ms)})
             for n, ms in [(1, (0, 1, 2, 3, 4)), (3, (4, -1, 2, 0, 1)), (5, (-2, 3, 0, 5, 2))]]


def mesmo_valor(a, b, ambs=AMBIENTES):
    return all(abs(avalia(a, x) - avalia(b, x)) < 1e-9 for x in ambs)


# texto de bloco (Notion verbatim) -> fórmula da gramática, só para conferir
NOME_ATTR = {'força': 'FOR', 'forca': 'FOR', 'destreza': 'DES', 'des': 'DES', 'constituição': 'CON',
             'constituicao': 'CON', 'con': 'CON', 'inteligência': 'INT', 'inteligencia': 'INT', 'int': 'INT',
             'sabedoria': 'SAB', 'sab': 'SAB', 'for': 'FOR'}


def formula_de_bloco(txt):
    s = txt.replace('×', '*').replace('Nível', 'nivel').replace('−', '-')
    s = re.sub(r'\[?\s*Mod\.\s*(\w+)\s+OU\s+Mod\.\s*(\w+)\s*\]?',
               lambda m: f'escolha(mod.{NOME_ATTR[m.group(1).lower()]},mod.{NOME_ATTR[m.group(2).lower()]})', s)
    s = re.sub(r'Mod\.\s*(\w+)', lambda m: f'mod.{NOME_ATTR[m.group(1).lower()]}', s)
    return s


# ---------------------------------------------------------------- confirmações
def texto_sistema(sistema):
    partes = []

    def anda(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k == 'html' and isinstance(v, str):
                    partes.append(v)
                else:
                    anda(v)
        elif isinstance(o, list):
            for v in o:
                anda(v)
    anda(sistema)
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', ' '.join(partes)))


# regra do contrato sem status -> frase do Sistema (Notion verbatim) que a confirma
CONFIRMA_SISTEMA = {
    ('derivados', 'inventario', 'equipamentos'): '2+Mod. Força (Min. 1) Equipamentos',
    ('derivados', 'inventario', 'bugigangas'): '10+Mod. Força (Min. 1) Bugigangas',
    ('turno',): 'Você possui 3 ações e 1 reação por turno',
}


# ---------------------------------------------------------------- compilação
class Compilador:
    def __init__(self):
        self.c = ler('data', 'balanceamento', 'ficha-digital-regras.json')
        self.classes = {os.path.basename(p)[:-5]: json.load(open(p, encoding='utf-8'))['classe']
                        for p in sorted(glob.glob(os.path.join(REPO, 'data', 'classes', '*.json')))}
        arqs = {os.path.basename(p)[:-5]: json.load(open(p, encoding='utf-8'))
                for p in sorted(glob.glob(os.path.join(REPO, 'data', 'racas', '*.json')))}
        self.racas = {k: v['raca'] for k, v in arqs.items()}
        # nome (sem emoji) de cada card de raça: traço, variante, subespécie
        self.nomes_raca = {c['id']: separa_icone(c.get('nome') or '')[1]
                           for v in arqs.values() for c in v.get('cards') or [] if c.get('id')}
        self.pericias = ler('data', 'pericias.json')
        self.condicoes_site = ler('data', 'condicoes.json')
        self.magias = ler('data', 'magias.json')
        self.sistema = texto_sistema(ler('data', 'sistema.json'))
        self.alias = ler_tools('alias_ids.json')
        self.pendentes = ler_tools('pendentes_balanceamento.json')
        self.avisos = []
        self.nao_resolvidos = []
        self.ids_site = self._ids_site()

    # status de um caminho do contrato, com o fallback das confirmações
    def st(self, *cam):
        s = status_em(self.c, list(cam))
        if s is None and tuple(cam) in CONFIRMA_SISTEMA:
            frase = CONFIRMA_SISTEMA[tuple(cam)]
            if frase not in self.sistema:
                raise Falha(f'{cam_str(cam)}: a frase que confirma a regra sumiu do Sistema: "{frase}"')
            return 'canonico'
        return s or 'semStatus'

    def fo(self, *cam):
        return 'contrato:' + cam_str(cam)

    def _ids_site(self):
        ids = set()
        for p in glob.glob(os.path.join(REPO, 'data', 'catalogo', '*.json')):
            for e in json.load(open(p, encoding='utf-8')).get('entradas', []):
                ids.add(e['id'])
        for r in self.racas.values():
            ids.add(r['id'])
            for k in ('ids',):
                ids.update((r.get('variantes') or {}).get(k) or [])
            for a in r.get('arNatural') or []:
                ids.add(a['fonte'])
            corr = r.get('corrupcao') or {}
            for k in ('poderes', 'adversidades'):
                ids.update(x['id'] for x in (corr.get(k) or {}).get('itens', []) if isinstance(x, dict))
        for c in self.classes.values():
            ids.add(c['id'])
            for r in c.get('ramos') or []:
                ids.add(r['id'])
        return ids

    def id_site(self, id_contrato, onde):
        """id do contrato -> id do site (alias), ou None (listado como não resolvido)."""
        if id_contrato.startswith('condicao:'):
            return id_contrato
        if id_contrato in self.alias['alias']:
            return self.alias['alias'][id_contrato]
        if id_contrato in self.ids_site:
            return id_contrato
        motivo = self.alias.get('semEntidade', {}).get(id_contrato) or 'id fora do catálogo do site'
        self.nao_resolvidos.append({'id': id_contrato, 'onde': onde, 'motivo': motivo})
        return None

    # ---------------- atributos e perícias
    def atributos(self):
        a = self.c['atributos']
        return {
            'lista': a['lista'],
            'mod': {'ast': ast(a['modificador']['formula'], self.st('atributos', 'modificador'),
                               self.fo('atributos', 'modificador', 'formula')),
                    'st': self.st('atributos', 'modificador'), 'fo': self.fo('atributos', 'modificador')},
            'porNivel': {'pontos': a['ganhoPorNivel']['pontos'], 'niveis': a['ganhoPorNivel']['niveis'],
                         'st': self.st('atributos', 'ganhoPorNivel'), 'fo': self.fo('atributos', 'ganhoPorNivel')},
            'faixaAbsoluta': a['faixa']['absoluta'],
            'nomes': {'FOR': 'Força', 'DES': 'Destreza', 'CON': 'Constituição', 'INT': 'Inteligência',
                      'SAB': 'Sabedoria'},
        }

    def pericias_(self):
        site = {p['slug']: p for p in self.pericias['pericias']}
        contrato = self.c['pericias']
        ids_c = [p['id'] for p in contrato]
        if set(ids_c) != set(site) or len(ids_c) != 24:
            raise Falha(f'perícias: contrato x data/pericias.json por conjunto: só contrato '
                        f'{sorted(set(ids_c) - set(site))}, só site {sorted(set(site) - set(ids_c))}')
        modo_site = {'fixo': 'fixo', 'maior': 'maior', 'arma': 'porArma', 'dado': 'dado'}
        out = []
        for i, p in enumerate(contrato):
            s = site[p['id']]
            modo_c = p.get('modo') or ('dado' if p.get('dadoPorGrau') else 'fixo')
            if modo_site[s['modo']] != modo_c or sorted(s['atributos']) != sorted(p['atributos']):
                raise Falha(f'perícia {p["id"]}: contrato ({modo_c}, {p["atributos"]}) x data/pericias.json '
                            f'({s["modo"]}, {s["atributos"]})')
            st = status_em(self.c, ['pericias', i]) or 'canonico'   # confirmada por data/pericias.json
            fo = self.fo('pericias', i) if status_em(self.c, ['pericias', i]) else 'data/pericias.json'
            x = {'id': p['id'], 'nome': s['nome'], 'atributos': p['atributos'], 'modo': modo_c,
                 'tags': p.get('tags') or [], 'st': st, 'fo': fo}
            if modo_c == 'maior':
                x['stEscolha'] = 'aprovado'          # D7/PD7: 'maior' com troca (trocavelFonte)
                x['foEscolha'] = 'contrato:pericias.' + p['id'] + '.trocavelFonte (PD7)'
            if p.get('dadoPorGrau'):
                x['dadoPorGrau'] = p['dadoPorGrau']
            if p.get('exigeTreino'):
                x['exigeTreino'] = True
            out.append(x)
        prof = self.c['proficiencia']
        return out, {'bonus': prof['graus'], 'rotulos': prof['rotulos'], 'st': self.st('proficiencia'),
                     'fo': self.fo('proficiencia')}

    # ---------------- recursos e classes
    def recursos(self):
        r = self.c['recursos']
        out = {}
        for nome in ('saude', 'stamina', 'eter'):
            b = r[nome]
            st = status_em(self.c, ['recursos', nome]) or self.st_por_blocos(nome, b['max'])
            fo = self.fo('recursos', nome, 'max')
            st_esc = normaliza_status(b['modoEscolhaStatus'], nome) if b.get('modoEscolhaStatus') else st
            out[nome] = {'max': ast(b['max'], st, fo, st_escolha=st_esc,
                                    fo_escolha=self.fo('recursos', nome, 'modoEscolha')),
                         'st': st, 'fo': fo, 'trocavel': bool(b.get('modoEscolhaTrocavel'))}
        out['ordemMaximo'] = [e['etapa'] for e in r['ordemMaximo']]
        out['ordemSt'] = normaliza_status(r['ordemMaximoStatus'], 'recursos.ordemMaximoStatus')
        out['ordemFo'] = self.fo('recursos', 'ordemMaximo')
        out['base'] = r['ordemMaximo'][0]['valor']
        out['temporario'] = {'acumula': r['temporario']['acumula'], 'recursos': r['temporario']['recursos'],
                             'st': self.st('recursos', 'temporario'), 'fo': self.fo('recursos', 'temporario')}
        bon = r['bonusRolados']
        out['bonusRolados'] = {k: {kk: v[kk] for kk in ('recurso', 'dado', 'valor', 'modo') if kk in v}
                               for k, v in bon['fontes'].items()}
        return out

    def st_por_blocos(self, recurso, formula):
        """Recurso sem status no contrato: canônico se as 7 páginas de classe
        (blocos, Notion verbatim) dão a mesma fórmula com o V/G/R de cada uma."""
        coef = {'saude': 'V', 'stamina': 'G', 'eter': 'R'}[recurso]
        a = ast(formula, 'x', 'x')
        for chave, cl in self.classes.items():
            txt = (cl.get('status') or {}).get(recurso)
            if not txt:
                return 'semStatus'
            b = ast(formula_de_bloco(txt), 'x', 'x')
            ambs = [dict(x, **{'classe.' + coef: cl[coef]}) for x in AMBIENTES]
            if not mesmo_valor(a, b, ambs):
                self.avisos.append(f'recursos.{recurso}.max x data/classes/{chave}.json ({txt}): divergem')
                return 'semStatus'
        return 'canonico'

    def classes_(self):
        out = {}
        for chave in CLASSES:
            cc = self.c['classes'][chave]
            b = self.classes[chave]
            if (cc['V'], cc['G'], cc['R']) != (b['V'], b['G'], b['R']):
                raise Falha(f'classe {chave}: V/G/R do contrato {cc["V"], cc["G"], cc["R"]} x bloco '
                            f'{b["V"], b["G"], b["R"]}')
            st_vgr = status_em(self.c, ['classes', chave]) or 'canonico'   # confirmado pelo bloco
            cd = cc['cd']
            st_cd = status_em(self.c, ['classes', chave, 'cd']) or None
            cd_ast = ast(cd['formula'], 'x', 'x')
            termos = ' + '.join(f'escolha(mod.{t[0]},mod.{t[1]})' if len(t) > 1 else f'mod.{t[0]}'
                                for t in b['cd']['termos'])
            cd_bloco = ast(f'{b["cd"]["base"]} + {termos}', 'x', 'x')
            if not mesmo_valor(cd_ast, cd_bloco):
                raise Falha(f'classe {chave}: CD do contrato ({cd["formula"]}) x bloco ({b["cd"]["texto"]})')
            st_cd = st_cd or 'canonico'
            st_esc = normaliza_status(cd['modoEscolhaStatus'], chave) if cd.get('modoEscolhaStatus') else st_cd
            x = {'id': b['id'], 'nome': b['nome'], 'V': cc['V'], 'G': cc['G'], 'R': cc['R'],
                 'st': st_vgr, 'fo': 'data/classes/' + chave + '.json',
                 'cd': {'ast': ast(cd['formula'], st_cd, self.fo('classes', chave, 'cd', 'formula'),
                                   st_escolha=st_esc, fo_escolha=self.fo('classes', chave, 'cd', 'modoEscolha')),
                        'texto': b['cd']['texto'], 'st': st_cd, 'fo': self.fo('classes', chave, 'cd')},
                 'medidores': [], 'recursoDeClasse': None}
            med_b = {m['id']: m for m in (b.get('recurso') or {}).get('medidores') or []}
            for i, rc in enumerate(cc.get('recursos') or []):
                st_m = status_em(self.c, ['classes', chave, 'recursos', i])
                mb = med_b.get(rc['id'])
                if mb is None:
                    raise Falha(f'classe {chave}: medidor {rc["id"]} do contrato sem par no bloco')
                if not mesmo_valor(ast(rc['max'], 'x', 'x'), ast(formula_de_bloco(mb['max']), 'x', 'x')):
                    raise Falha(f'classe {chave}: máximo de {rc["id"]} ({rc["max"]}) x bloco ({mb["max"]})')
                st_m = st_m or 'canonico'            # confirmado pelo bloco
                x['medidores'].append({'id': rc['id'], 'nome': rc['nome'],
                                       'max': ast(rc['max'], st_m, self.fo('classes', chave, 'recursos', i, 'max')),
                                       'st': st_m, 'fo': self.fo('classes', chave, 'recursos', i)})
            if set(med_b) != {m['id'] for m in x['medidores']}:
                raise Falha(f'classe {chave}: medidores do bloco {sorted(med_b)} x contrato')
            if cc.get('recursoDeClasse'):
                rdc = cc['recursoDeClasse']
                x['recursoDeClasse'] = {'st': normaliza_status(rdc['status'], chave + '.recursoDeClasse'),
                                        'pergunta': rdc.get('pergunta'), 'nota': rdc.get('nota'),
                                        'fo': self.fo('classes', chave, 'recursoDeClasse')}
            out[chave] = x
        return out

    # ---------------- derivados
    def mods_de_lista(self, lista, alvo, op, cam, extra=None):
        """Lista do contrato [{fonte, valor, ...}] -> Mods por id do site."""
        out = []
        for i, m in enumerate(lista):
            fid = self.id_site(m['fonte'], cam_str(cam))
            if fid is None:
                continue
            st = status_em(self.c, list(cam) + [i]) or 'semStatus'
            mod = {'fonte': fid, 'alvo': alvo, 'op': op, 'valor': m['valor'], 'st': st,
                   'fo': self.fo(*cam, i)}
            for k in ('nivel', 'duracao', 'extra', 'condicao', 'escopo', 'nota'):
                if k in m:
                    mod[k] = m[k]
            if extra:
                mod.update(extra)
            out.append(mod)
        return out

    def derivados(self, condicoes):
        d = self.c['derivados']
        ev = d['evasao']
        mods = []
        mods += self.mods_de_lista(ev['modificadores'], 'evasao.passiva', 'soma', ('derivados', 'evasao', 'modificadores'))
        mods += self.mods_de_lista(d['cd']['modificadores'], 'cd', 'soma', ('derivados', 'cd', 'modificadores'))
        mv = d['movimento']
        mods += self.mods_de_lista(mv['somas'], 'movimento', 'soma', ('derivados', 'movimento', 'somas'))
        mods += self.mods_de_lista(mv['multiplicacoes'], 'movimento', 'multiplica', ('derivados', 'movimento', 'multiplicacoes'))
        mods += self.mods_de_lista(mv['fixos'], 'movimento', 'fixa', ('derivados', 'movimento', 'fixos'))
        pa = d['progressaoDeAtaques']
        for i, m in enumerate(pa['modificadoresConhecidos']):
            fid = self.id_site(m['fonte'], 'derivados.progressaoDeAtaques.modificadoresConhecidos')
            if fid is None:
                continue
            x = {'fonte': fid, 'alvo': 'pma', 'op': m['op'], 'valor': m['valor'],
                 'st': normaliza_status(pa['status'], 'progressaoDeAtaques'),
                 'fo': self.fo('derivados', 'progressaoDeAtaques', 'modificadoresConhecidos', i)}
            for k in ('escopo', 'condicao', 'custo'):
                if k in m:
                    x[k] = m[k]
            mods.append(x)
        # 'nRecalculaCom': "abismo:lenda-viva (+1 acao)"; as condições já estão nos efeitos delas
        for i, txt in enumerate(pa['nRecalculaCom']):
            m = re.match(r'^([a-z]+:[a-z-]+) \(([+-]?\d+)(?: ac(?:ao|oes))?\)$', txt)
            if not m:
                raise Falha(f'progressaoDeAtaques.nRecalculaCom ilegível: {txt!r}')
            if m.group(1).startswith('condicao:'):
                continue
            fid = self.id_site(m.group(1), 'derivados.progressaoDeAtaques.nRecalculaCom')
            if fid:
                mods.append({'fonte': fid, 'alvo': 'acoes', 'op': 'soma', 'valor': int(m.group(2)),
                             'st': normaliza_status(pa['status'], 'progressaoDeAtaques'),
                             'fo': self.fo('derivados', 'progressaoDeAtaques', 'nRecalculaCom', i)})
        # os 'condicao:<id>' destas listas repetem os efeitos da própria condição:
        # confere que a condição cobre o alvo e tira daqui (senão contaria duas vezes)
        fontes, dup = {}, []
        for m in mods:
            if m['fonte'].startswith('condicao:'):
                cid = m['fonte'].split(':', 1)[1]
                cond = condicoes.get(cid)
                efs = list(cond['efeitos']) if cond else []
                for lst in (cond or {}).get('niveis', {}).values():
                    efs += lst
                if not any(e['alvo'] == m['alvo'] and e['op'] == m['op'] for e in efs):
                    raise Falha(f'{m["fo"]}: {m["fonte"]} ({m["alvo"]} {m["op"]}) sem o efeito na condição')
                dup.append(m['fo'])
                continue
            fontes.setdefault(m['fonte'], []).append(m)
        mv_base = {}
        for k, v in mv['basePorRaca'].items():
            mv_base[k] = v
        return {
            'evasao': {'passiva': {'ast': ast(ev['passiva'], normaliza_status(ev['passivaStatus'], 'evasao'),
                                              self.fo('derivados', 'evasao', 'passiva')),
                                   'st': normaliza_status(ev['passivaStatus'], 'evasao'),
                                   'fo': self.fo('derivados', 'evasao', 'passiva')},
                       'ativa': {'ast': ast(ev['ativa']['formula'], self.st('derivados', 'evasao', 'ativa'),
                                            self.fo('derivados', 'evasao', 'ativa')),
                                 'st': self.st('derivados', 'evasao', 'ativa'), 'fo': self.fo('derivados', 'evasao', 'ativa'),
                                 'dadoSomaAtributo': ev['ativa']['dadoSomaAtributo']},
                       'porArmadura': ev['porArmaduraOuEscudo']['valor']},
            'cd': {'st': self.st('derivados', 'cd'), 'fo': self.fo('derivados', 'cd')},
            'movimento': {'basePorRaca': mv_base, 'ordem': mv['ordem'], 'passo': mv['passo'], 'piso': mv['piso'],
                          'entreFixosVence': mv['entreFixosVence'], 'st': self.st('derivados', 'movimento'),
                          'fo': self.fo('derivados', 'movimento')},
            'inventario': {
                'equipamentos': ast(d['inventario']['equipamentos'], self.st('derivados', 'inventario', 'equipamentos'),
                                    self.fo('derivados', 'inventario', 'equipamentos')),
                'bugigangas': ast(d['inventario']['bugigangas'], self.st('derivados', 'inventario', 'bugigangas'),
                                  self.fo('derivados', 'inventario', 'bugigangas')),
                'sobrepeso': d['inventario']['sobrepeso'],
                'st': self.st('derivados', 'inventario', 'bugigangas'), 'fo': self.fo('derivados', 'inventario')},
            'progressao': {'st': normaliza_status(pa['status'], 'progressaoDeAtaques'),
                           'fo': self.fo('derivados', 'progressaoDeAtaques'),
                           'modsSt': normaliza_status(pa['modificadoresStatus'], 'progressaoDeAtaques.modificadoresStatus')},
        }, fontes, dup

    # ---------------- condições
    def valor_efeito(self, v, st, fo):
        """número | AST (X, recurso.*) | {t:'dado'} | texto (lembrete)."""
        if isinstance(v, (bool, int, float)) or v is None:
            return v
        s = v.strip()
        m = re.match(r'^(X|\d+)\s*d\s*(\d+)$', s)
        if m:
            n = m.group(1)
            return {'t': 'rolagem', 'n': n if n == 'X' else int(n), 'faces': int(m.group(2)), 'st': st, 'fo': fo}
        try:
            return ast(s, st, fo)
        except Falha:
            return s       # texto (ex.: "2 natural conta como falha critica")

    def condicoes(self):
        ids_site = [cd['id'] for cat in self.condicoes_site['categorias'] for cd in cat['cards']]
        nomes = {cd['id']: cd['nome'] for cat in self.condicoes_site['categorias'] for cd in cat['cards']}
        out = {}
        for i, c in enumerate(self.c['condicoes']):
            if c['id'] not in nomes:
                continue          # Marcado, Marcada à Morte: não são condição do site (PD17)
            st = status_em(self.c, ['condicoes', i]) or 'semStatus'
            fo = self.fo('condicoes', c['id'])

            def efs(lista, base_cam):
                r = []
                for j, e in enumerate(lista):
                    ste = status_em(self.c, list(base_cam) + [j]) or st
                    foe = fo + '.' + cam_str(base_cam[2:] + [j])
                    x = {'alvo': ALVO_ALIAS.get(e['alvo'], e['alvo']), 'op': e['op'], 'st': ste, 'fo': foe}
                    if 'valor' in e:
                        x['valor'] = self.valor_efeito(e['valor'], ste, foe)
                    for k in ('tipoDano', 'momento', 'gatilho', 'escopo', 'nota', 'mitigavel', 'escalaComX'):
                        if k in e:
                            x[k] = e[k]
                    r.append(x)
                return r
            x = {'id': c['id'], 'nome': nomes[c['id']], 'tags': c.get('tags') or [], 'st': st, 'fo': fo,
                 'efeitos': efs(c.get('efeitos') or [], ['condicoes', i, 'efeitos'])}
            if c.get('niveis'):
                x['niveis'] = {k: efs(v, ['condicoes', i, 'niveis', k]) for k, v in c['niveis'].items()}
                x['cumulativa'] = bool(c.get('cumulativa'))
            if c.get('x'):
                xx = c['x']
                x['x'] = {k: xx[k] for k in ('tipo', 'inicial', 'max', 'inicialPadrao') if k in xx}
                if xx.get('padraoStatus'):
                    x['x']['stPadrao'] = normaliza_status(xx['padraoStatus'], c['id'] + '.x')
            if c.get('implica'):
                modos = c.get('implicaModo') or ''
                imp = []
                for alvo in c['implica']:
                    m = re.search(alvo + r':(\w+)', modos)
                    imp.append({'id': alvo, 'modo': m.group(1) if m else modos})
                x['implica'] = imp
            if c.get('entra'):
                x['entra'] = c['entra']
            out[c['id']] = x
        faltam = sorted(set(ids_site) - set(out))
        if faltam:
            raise Falha(f'condições do site sem entrada no contrato: {faltam}')
        e = self.c['empilhamento']
        emp = {k: e[k] for k in ('entreCondicoes', 'mesmaCondicao', 'mesmaCondicaoComX')}
        emp.update({'st': self.st('empilhamento'), 'fo': self.fo('empilhamento')})
        return out, emp

    # ---------------- raças
    def racas_(self):
        mv = self.c['derivados']['movimento']['basePorRaca']
        ar_c = self.c['derivados']['armadura']['arNaturalPorRaca']
        out = {}
        for chave in RACAS:
            r = self.racas[chave]
            x = {'id': r['id'], 'nome': r['nome'], 'st': 'canonico', 'fo': 'data/racas/' + chave + '.json',
                 'movimento': (r.get('movimento') or {}).get('metros'),
                 'atributos': (r.get('atributos') or {}).get('bonus'),
                 'alternativo': (r.get('alternativo') or {}).get('bonus'),
                 'variantes': list((r.get('variantes') or {}).get('ids') or []),
                 'arNatural': [dict(a, nome=self.nomes_raca.get(a['fonte'], a['fonte'])) for a in r.get('arNatural') or []],
                 'nomes': {i: self.nomes_raca[i] for i in (r.get('variantes') or {}).get('ids') or [] if i in self.nomes_raca},
                 'subespecies': {}}
            for s in (r.get('variantes') or {}).get('subespecies') or []:
                x['subespecies'][s['id']] = {'movimento': (s.get('movimento') or {}).get('metros'),
                                             'atributos': (s.get('atributos') or {}).get('bonus')}
            # movimento do bloco x contrato (basePorRaca)
            c = mv.get(chave)
            if isinstance(c, dict):
                for sub, v in c.items():
                    sid = f'{chave}-{sub}'
                    if x['subespecies'].get(sid, {}).get('movimento') != v:
                        raise Falha(f'movimento {sid}: contrato {v} x bloco {x["subespecies"].get(sid)}')
            elif c != x['movimento']:
                raise Falha(f'movimento {chave}: contrato {c} x bloco {x["movimento"]}')
            out[chave] = x
        # Ar natural do contrato x blocos (pelo alias)
        blocos = {a['fonte']: a['valor'] for r in out.values() for a in r['arNatural']}
        raca_id = {'raca-' + k: k for k in out}
        for k, v in ar_c.items():
            sid = self.alias['alias'].get(k, k)
            if sid in blocos:
                total = blocos[sid]
            elif sid in RACAS:
                total = sum(a['valor'] for a in out[sid]['arNatural'] if a['fonte'] not in out[sid]['variantes'])
            else:
                raise Falha(f'arNaturalPorRaca.{k}: sem par nos blocos de raça')
            # 'dryad-variante' = 3 no contrato é o TOTAL (Pele de Casca 2 + Cascaferro +1)
            soma = next((a for r in out.values() for a in r['arNatural'] if a['fonte'] == sid), None)
            if soma and soma.get('soma'):
                raca = next(r for r in out.values() if soma in r['arNatural'])
                total = sum(a['valor'] for a in raca['arNatural'] if a['fonte'] not in raca['variantes']) + soma['valor']
            if total != v:
                raise Falha(f'arNaturalPorRaca.{k} = {v} x blocos = {total}')
        del raca_id
        return out

    # ---------------- magia
    def magia(self):
        m = self.c['magia']
        base = {}
        for n in range(1, 6):
            for esc in ESCOLAS:
                for s in self.magias[f'nivel{n}'][esc]:
                    perm, _ = normaliza.intensidades_permitidas(s['nivel'], s['stats'], s['descricao'])
                    base[s['id']] = {'nivel': s['nivel'], 'escola': s['escola'], 'intensidades': perm}
                    if s['custoBase'] != m['custoBase'][s['nivel'] - 1]:
                        raise Falha(f'{s["id"]}: custoBase {s["custoBase"]} x contrato {m["custoBase"][s["nivel"] - 1]}')
        # a tabela do contrato tem de sair da conta (base + intensidade, piso 1 fora das exceções)
        for nv, linha in m['tabelaCusto'].items():
            for it, v in linha.items():
                if int(nv) == 1 and it == 'contida':
                    if v is not None:
                        raise Falha('tabelaCusto: Nível 1 Contida deveria ser null')
                    continue
                conta = m['custoBase'][int(nv) - 1] + m['intensidade'][it]
                esperado = conta if (int(nv) == 1 and it == 'normal') else max(m['custoMinimo']['valor'], conta)
                if v != esperado:
                    raise Falha(f'tabelaCusto {nv}/{it} = {v} x conta {esperado}')
        mult = []
        for i, f in enumerate(self.c['multiplicadoresGlobaisDeCusto']['fontes']):
            fid = self.id_site(f['id'], 'multiplicadoresGlobaisDeCusto')
            if fid:
                mult.append({'fonte': fid, 'alvo': f['alvo'], 'fator': f['fator'],
                             'st': normaliza_status(f['status'], f['id']),
                             'fo': self.fo('multiplicadoresGlobaisDeCusto', 'fontes', i)})
        sub = m['intensidadeSubidaPorTecnica']
        return {
            'custoBase': m['custoBase'], 'intensidade': m['intensidade'], 'ordem': INTENSIDADES,
            'nivel1SemContida': not m['contidaExisteNoNivel1'],
            'st': self.st('magia'), 'fo': self.fo('magia'),
            'custoMinimo': {'valor': m['custoMinimo']['valor'], 'excecoes': m['custoMinimo']['excecoes'],
                            'st': self.st('magia', 'custoMinimo'), 'fo': self.fo('magia', 'custoMinimo')},
            'ordemCusto': [e['op'] for e in m['ordemCusto']],
            'modulacoes': m['modulacoes'], 'modulacaoEmTruquePrecoCheio': m['modulacaoEmTruquePrecoCheio'],
            'focoPrimordial': {'nivel': m['focoPrimordial']['destravaNivel'], 'requisito': m['focoPrimordial']['requisito']},
            'requisitos': {'validar': m['requisitos']['validar'], 'regra': m['requisitos']['regra'],
                           'st': normaliza_status(m['requisitos']['validarStatus'], 'magia.requisitos')},
            'sustentada': {'maxAtivas': m['sustentada']['maxAtivas'],
                           'st': normaliza_status(m['sustentada']['maxAtivasStatus'], 'magia.sustentada')},
            'subidaPorTecnica': {'st': normaliza_status(sub['status'], 'intensidadeSubidaPorTecnica'),
                                 'pergunta': sub.get('pergunta')},
            'multiplicadores': mult,
            'porId': base,
        }

    # ---------------- defesa, turno, limiar, morte, testes
    def defesa(self):
        dn = self.c['dano']
        ar = self.c['derivados']['armadura']
        cats = {k: v for k, v in dn['categorias'].items()}
        return {
            'categorias': cats, 'totalDeTipos': dn['totalDeTipos'],
            'categoriasFo': self.fo('dano', 'categorias'),
            'aeTodos': {'cobre': ar['aeTodos']['cobre'], 'st': self.st('derivados', 'armadura', 'aeTodos'),
                        'fo': self.fo('derivados', 'armadura', 'aeTodos')},
            'aeCategoria': {'st': self.st('derivados', 'armadura', 'aeCategoria'),
                            'fo': self.fo('derivados', 'armadura', 'aeCategoria')},
            'aeMesmoTipo': {'modo': ar['aeMesmoTipo'], 'st': self.st('derivados', 'armadura', 'aeMesmoTipo'),
                            'fo': self.fo('derivados', 'armadura', 'aeMesmoTipo')},
            'arNatural': {'acumula': ar['acumulaNatural'], 'st': self.st('derivados', 'armadura', 'acumulaNatural'),
                          'fo': self.fo('derivados', 'armadura', 'acumulaNatural')},
        }

    def turno(self):
        t = self.c['turno']
        return {'acoes': t['acoes'], 'reacoes': t['reacoes'], 'pma': t['penalidadeAtaqueConsecutivo'],
                'pmaSt': normaliza_status(t['pmaStatus'], 'turno.pma'), 'fo': self.fo('turno'),
                'st': self.st('turno'), 'conjuracoes': t['conjuracoesPorTurno']}

    def limiar(self):
        li = self.c['progressao']['limiar']
        custos = [0 if c == 'gratis' else c for c in li['porMao']['custoDasCartas']]
        return {'pontosPorNivel': li['pontosPorNivel'], 'niveis': li['niveis'], 'custoPorPosicao': custos,
                'especial': li['porMao']['sextaCarta']['custo'], 'st': self.st('progressao', 'limiar'),
                'fo': self.fo('progressao', 'limiar')}

    def morte(self):
        mo = self.c['morte']['morrendo']
        return {'tique': ast(mo['tick'], self.st('morte', 'morrendo'), self.fo('morte', 'morrendo', 'tick')),
                'st': self.st('morte', 'morrendo'), 'fo': self.fo('morte', 'morrendo'),
                'mitigavel': mo['mitigavel']}

    def testes(self):
        t = self.c['testes']
        return {'cancelam': t['cancelam'], 'acumulam': t['acumulam'], 'aplicaDefender': t['aplicaDefender'],
                'criticoNoDadoUsado': t['criticoNoDadoUsado'], 'st': self.st('testes'), 'fo': self.fo('testes')}

    # ---------------- tudo
    def compila(self):
        valida_status(self.c)
        for p in glob.glob(os.path.join(REPO, 'data', 'classes', '*.json')) + glob.glob(os.path.join(REPO, 'data', 'racas', '*.json')):
            valida_status(json.load(open(p, encoding='utf-8')), fora=set())
        pericias, graus = self.pericias_()
        condicoes, empilhamento = self.condicoes()
        derivados, fontes, dup = self.derivados(condicoes)
        dados = {
            'schema': SCHEMA,
            'contrato': {'schemaVersion': self.c['schemaVersion'], 'rev': self.c['geradoEm'].split(':')[0]},
            'selos': SELO, 'rotulosSelo': ROTULO_SELO, 'ordemStatus': ORDEM_STATUS,
            'atributos': self.atributos(),
            'pericias': pericias, 'graus': graus,
            'recursos': self.recursos(),
            'classes': self.classes_(),
            'racas': self.racas_(),
            'derivados': derivados,
            'condicoes': condicoes, 'empilhamento': empilhamento,
            'fontes': fontes,
            'magia': self.magia(),
            'defesa': self.defesa(),
            'turno': self.turno(),
            'limiar': self.limiar(),
            'morte': self.morte(),
            'testes': self.testes(),
            'pendentesBalanceamento': [i['id'] for i in self.pendentes['itens']],
            'naoResolvidos': sorted(self.nao_resolvidos, key=lambda x: (x['onde'], x['id'])),
            'duplicadosDeCondicao': sorted(dup),
        }
        # nenhum emDesenho entra
        if 'emDesenho' in json.dumps(dados, ensure_ascii=False):
            raise Falha('regra emDesenho vazou para o artefato')
        corpo = json.dumps(dados, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
        dados['versao'] = self.c['schemaVersion'] + '+' + hashlib.sha256(corpo.encode('utf-8')).hexdigest()[:12]
        return dados


CABECALHO = '''/* js/ficha/00-regras-dados.js — ARTEFATO gerado por tools/gerar_regras_ficha.py — não editar.
 * Regras compiladas da ficha (F3b): contrato regras-ficha + blocos do site, como
 * DADO. Fórmulas em AST (sem eval), cada nó com status (st) e fonte (fo). O
 * KhRegras (kh-regras.js) avalia. No navegador vira window.KhRegrasDados; no
 * node, carregado sozinho, exporta por module.exports (no artefato js/ficha.js
 * o kh-inv.js sobrescreve o export, como antes).
 */
'''


def js(dados):
    # uma chave de topo por linha (diff legível), valor compacto (tamanho: vai no js/ficha.js)
    corpo = '{\n' + ',\n'.join('    ' + json.dumps(k, ensure_ascii=False) + ': ' +
                               json.dumps(dados[k], ensure_ascii=False, sort_keys=True, separators=(',', ':'))
                               for k in sorted(dados)) + '\n  }'
    return (CABECALHO + '(function (raiz) {\n  \'use strict\';\n  var DADOS = ' + corpo + ';\n'
            '  if (typeof module === \'object\' && module && module.exports) {\n'
            '    if (!Object.keys(module.exports).length) module.exports = DADOS;\n'
            '    return;\n  }\n'
            '  raiz.KhRegrasDados = DADOS;\n'
            '})(typeof window !== \'undefined\' ? window : this);\n')


def main():
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except (AttributeError, ValueError):
        pass
    try:
        comp = Compilador()
        dados = comp.compila()
    except Falha as e:
        print(f'FALHA  gerar_regras_ficha: {e}')
        sys.exit(1)
    txt = js(dados)
    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    atual = open(SAIDA, encoding='utf-8', newline='').read() if os.path.isfile(SAIDA) else None
    if atual is None or atual.replace('\r\n', '\n') != txt:
        open(SAIDA, 'w', encoding='utf-8', newline='\n').write(txt)
        estado = 'regravado'
    else:
        estado = 'já confere'
    sem = sum(1 for _ in re.finditer(r'"st": "semStatus"', txt))
    print(f'js/ficha/00-regras-dados.js {estado} ({dados["versao"]}; {len(dados["pericias"])} perícias, '
          f'{len(dados["condicoes"])} condições, {len(dados["magia"]["porId"])} magias, '
          f'{sum(len(v) for v in dados["fontes"].values())} Mods por fonte)')
    for a in comp.avisos:
        print(f'AVISO  {a}')
    for n in dados['naoResolvidos']:
        print(f'AVISO  id do contrato sem entidade no site: {n["id"]} ({n["onde"]}): {n["motivo"]}')
    if sem:
        print(f'AVISO  {sem} nó(s) de regra sem status no contrato (semStatus -> selo PENDENTE (balanceamento))')


if __name__ == '__main__':
    main()
