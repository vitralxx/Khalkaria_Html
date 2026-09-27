#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Log de técnicas: inventário de tudo que o jogador leva para a ficha, com
checagens mecânicas contra as regras atuais.

Pedido do Pedro (L19, docs/ficha-digital/03-respostas-pedro.md §6): "preciso de
um log de todas as técnicas do sistema e se elas estão funcionando na ficha
interativa ou não".

SÓ LÊ o repositório e grava docs/ficha-digital/log-tecnicas.json. Determinístico,
sem rede. Não corrige texto canônico: aponta o trecho verbatim e a regra atual
com a fonte; a correção é do Pedro / balanceamento.

Entradas (uma por técnica):
  - data/classes/*.json  cards (geral, ramo T1/T2/T3, marca, ultimate)
  - data/classes/*.json  bloco `classe`: características e recurso/medidores
  - data/racas/*.json    características, variantes, subespécies, tecnologias,
                         poderes e adversidades da Corrupção
  - data/origens.json    habilidade de cada origem

Checagens:
  1 levavel     data-kf-id na página gerada + entrada no catálogo + botão
                .kf-addbtn da ficha v2.1 (emula MAPA/decorar/textoLimpo do
                js/ficha.js sobre o HTML gerado) com nome == nome do catálogo
  2 custo       parse de ações/recurso/valor do custoTexto no vocabulário do
                contrato (data/balanceamento/ficha-digital-regras.json)
  3 recarga     notação de uso por período (L29)
  4 referencias condições, magias, itens, perícias e tipos de dano citados
  5 obsoletas   tools/regras_obsoletas.json (tabela versionada)
  6 automacao   hoje tudo manual (decisão do Pedro); `numeros` = campos citados

Uso:  python tools/log_tecnicas.py [--saida caminho.json] [--resumo]
"""
import argparse
import html as htmlmod
import json
import re
import sys
import unicodedata
from collections import Counter, OrderedDict
from html.parser import HTMLParser
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / 'docs' / 'ficha-digital' / 'log-tecnicas.json'
SCHEMA = 'log-tecnicas/1'


def ler_json(rel):
    with open(RAIZ / rel, encoding='utf-8') as f:
        return json.load(f)


def sem_acento(s):
    return ''.join(c for c in unicodedata.normalize('NFKD', s) if not unicodedata.combining(c))


def chave(s):
    """Forma de comparação: sem acento, minúscula, espaço simples."""
    return re.sub(r'\s+', ' ', sem_acento(s).lower()).strip()


def texto_puro(h):
    """Normalizador do CLAUDE.md §6, com entidades decodificadas."""
    if not h:
        return ''
    t = re.sub(r'<[^>]+>', ' ', h)
    return re.sub(r'\s+', ' ', htmlmod.unescape(t)).strip()


# =================================================================== mini DOM
# O suficiente para emular querySelector/textContent do js/ficha.js sobre o
# HTML gerado: seletor simples (tag, .classe, tag.classe) e descendente ("a b").

VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
        'meta', 'source', 'track', 'wbr'}


class No:
    __slots__ = ('tag', 'attrs', 'filhos', 'pai', 'classes')

    def __init__(self, tag, attrs, pai):
        self.tag = tag
        self.attrs = attrs
        self.filhos = []
        self.pai = pai
        self.classes = set((attrs.get('class') or '').split())

    def descendentes(self):
        pilha = list(reversed(self.filhos))
        while pilha:
            n = pilha.pop()
            if isinstance(n, No):
                yield n
                pilha.extend(reversed(n.filhos))

    def texto(self, remover=None):
        partes = []

        def anda(n):
            for f in n.filhos:
                if isinstance(f, str):
                    partes.append(f)
                elif remover is None or not remover(f):
                    anda(f)
        anda(self)
        return ''.join(partes)


class Arvore(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.raiz = No('#doc', {}, None)
        self.atual = self.raiz

    def handle_starttag(self, tag, attrs):
        n = No(tag, {k: (v or '') for k, v in attrs}, self.atual)
        self.atual.filhos.append(n)
        if tag not in VOID:
            self.atual = n

    def handle_startendtag(self, tag, attrs):
        self.atual.filhos.append(No(tag, {k: (v or '') for k, v in attrs}, self.atual))

    def handle_endtag(self, tag):
        n = self.atual
        while n is not None and n.tag != tag:
            n = n.pai
        if n is not None and n.pai is not None:
            self.atual = n.pai

    def handle_data(self, d):
        self.atual.filhos.append(d)


def arvore(caminho):
    p = Arvore()
    p.feed(caminho.read_text(encoding='utf-8'))
    p.close()
    return p.raiz


def _casa_simples(n, sel):
    m = re.fullmatch(r'([a-z0-9]*)((?:\.[\w-]+)*)', sel)
    if not m:
        raise ValueError(f'seletor fora do subconjunto emulado: {sel!r}')
    tag, cls = m.group(1), [c for c in m.group(2).split('.') if c]
    if tag and n.tag != tag:
        return False
    return all(c in n.classes for c in cls)


def _casa(n, seletor):
    partes = seletor.split()
    if not _casa_simples(n, partes[-1]):
        return False
    a = n.pai
    for sel in reversed(partes[:-1]):          # ancestral em qualquer altura
        while a is not None and not (a.tag != '#doc' and _casa_simples(a, sel)):
            a = a.pai
        if a is None:
            return False
        a = a.pai
    return True


def seleciona(raiz, seletor):
    return [n for n in raiz.descendentes() if _casa(n, seletor)]


def q1(card, sels):
    """js/ficha.js q1: primeira lista de seletores que acha alguém, em ordem."""
    for s in sels.split(','):
        s = s.strip()
        for n in card.descendentes():
            if _casa(n, s):
                return n
    return None


# js/ficha.js textoLimpo: remove ícones/botões/svg, tira emoji, "+ ficha" e espaços
_REMOVE_CLS = {'icon', 'cat-icon', 'category-icon', 'toggle-icon', 'kf-addbtn',
               'ent-add', 'ent-alca', 'spell-dot', 'spell-toggle'}
_EMOJI = re.compile('[%s-%s%s-%s%s-%s%s-%s%s-%s]' % tuple(map(chr, (
    0x1F000, 0x1FAFF, 0x2600, 0x27BF, 0x2B00, 0x2BFF, 0x2190, 0x21FF, 0xFE00, 0xFE0F))))


def texto_limpo(n):
    if n is None:
        return ''
    t = n.texto(lambda f: f.tag == 'svg' or bool(f.classes & _REMOVE_CLS))
    t = _EMOJI.sub('', t)
    t = re.sub(r'\+\s*ficha', '', t)
    return re.sub(r'\s+', ' ', t).strip()


# =================================================================== ficha v2.1
def mapa_ficha():
    """Lê o MAPA do js/ficha.js (não copia: se o JS mudar, o log acompanha)."""
    js = (RAIZ / 'js' / 'ficha.js').read_text(encoding='utf-8')
    m = re.search(r'var MAPA = \[(.*?)\];', js, re.S)
    if not m:
        raise SystemExit('js/ficha.js: MAPA não encontrado')
    linhas = re.findall(r"\[\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*\]", m.group(1))
    if not linhas:
        raise SystemExit('js/ficha.js: MAPA vazio')
    tem_corr = "querySelectorAll('.corr-table tr')" in js
    return linhas, tem_corr


def carrega_ficha(raiz):
    """A página carrega a ficha? (direto, ou via js/main.js, que injeta ficha.js)."""
    for n in seleciona(raiz, 'script'):
        src = n.attrs.get('src', '')
        if re.search(r'(^|/)js/(ficha|main)\.js(\?|$)', src):
            return True
    return False


def decorar(raiz, mapa, tem_corr):
    """Emula decorar() + decorarCorrupcao(): devolve os botões que a v2.1 poria."""
    marcado = set()
    botoes = []
    for sel, campo, tipo, sel_nome in mapa:
        for card in seleciona(raiz, sel):
            if id(card) in marcado:
                continue
            nome = texto_limpo(q1(card, sel_nome))
            if not nome:
                continue
            marcado.add(id(card))
            botoes.append({'kfId': card.attrs.get('data-kf-id'), 'seletor': sel, 'campo': campo,
                           'tipo': tipo, 'nome': nome})
    if tem_corr:
        for tr in seleciona(raiz, '.corr-table tr'):
            tds = [f for f in tr.filhos if isinstance(f, No) and f.tag == 'td']
            if len(tds) < 2:
                continue
            nome = texto_limpo(tds[0])
            if not nome:
                continue
            custo = texto_limpo(tds[2]) if len(tds) > 2 else ''
            a = tr.pai
            while a is not None and 'corr-block' not in a.classes:
                a = a.pai
            tipo = 'adversidade' if (a is not None and 'adv' in a.classes) else 'corrupção'
            botoes.append({'kfId': None, 'seletor': '.corr-table tr', 'campo': 'tecnicas', 'tipo': tipo,
                           'nome': nome + (' (' + custo + ')' if custo else ''), 'nomeBase': nome})
    return botoes


# =================================================================== inventário
CLASSES = ['espadachim', 'batedor', 'brutalista', 'teurgo', 'monge', 'alquimista', 'artilheiro']
RACAS = ['humano', 'anao', 'dryad', 'automato', 'gruto', 'inseto', 'corrompido']

TIPO_CARD_RACA = {'trait-card': ('caracteristica-de-raca', 'traco'),
                  'variant-card': ('variante', 'variante'),
                  'subspecie-card': ('subespecie', 'subespecie'),
                  'tech-card': ('tecnologia', 'tecnologia')}


def _limpa_nome(nome):
    return re.sub(r'\s+', ' ', _EMOJI.sub('', texto_puro(nome))).strip()


def _texto_lista(v):
    """Folhas de texto de um bloco (lista/dict/str), em ordem, como HTML."""
    out = []
    if isinstance(v, str):
        out.append(v)
    elif isinstance(v, list):
        for x in v:
            out.extend(_texto_lista(x))
    elif isinstance(v, dict):
        for k, x in v.items():
            if k in ('id', 'fonte', 'evento', 'escalaDe', 'status'):
                continue
            out.extend(_texto_lista(x))
    return out


def _custo_do_html(corpo):
    """custo impresso no card (.cost / .meta / .technique-cost), quando o JSON não tem."""
    m = re.search(r'<(?:span|p|div)[^>]*class="(?:cost|meta|technique-cost|tech-cost)"[^>]*>(.*?)</(?:span|p|div)>',
                  corpo or '', re.S)
    return texto_puro(m.group(1)) if m else None


def inventario():
    ent = []
    for c in CLASSES:
        d = ler_json(f'data/classes/{c}.json')
        fonte = f'data/classes/{c}.json'
        for card in d['cards']:
            ent.append({'id': card['id'], 'nome': card['nome'], 'fonte': fonte, 'origem': 'classe',
                        'dono': c, 'tipo': {'marca': 'marca', 'ultimate': 'ultimate'}.get(card['grupo'], 'tecnica'),
                        'grupo': card['grupo'], 'ramo': card['ramo'], 'tier': card['tier'],
                        'custoTexto': card['custoTexto'], 'cardClasse': card['tipo'],
                        'pagina': f'pages/classes/{c}.html', 'html': card['corpo']})
        cl = d['classe']
        for car in cl.get('caracteristicas') or []:
            ent.append({'id': car['id'], 'nome': _limpa_nome(car['nome']), 'fonte': fonte + ' > classe.caracteristicas',
                        'origem': 'classe', 'dono': c, 'tipo': 'caracteristica-de-classe', 'grupo': 'classe',
                        'ramo': None, 'tier': None, 'custoTexto': None, 'cardClasse': None,
                        'pagina': f'pages/classes/{c}.html', 'html': '<br>'.join(_texto_lista(car))})
        r = cl.get('recurso') or {}
        rid = r.get('id')
        ent.append({'id': f'{c}-recurso-{rid}' if rid else f'{c}-recurso', 'nome': r.get('nome') or '(recurso de classe sem nome)',
                    'fonte': fonte + ' > classe.recurso', 'origem': 'classe', 'dono': c, 'tipo': 'recurso-de-classe',
                    'grupo': 'classe', 'ramo': None, 'tier': None, 'custoTexto': None, 'cardClasse': None,
                    'pagina': f'pages/classes/{c}.html',
                    'html': '<br>'.join(_texto_lista({k: v for k, v in r.items() if k not in ('medidores', 'nota')})),
                    'medidores': r.get('medidores'), 'statusFonte': r.get('status'), 'notaFonte': r.get('nota')})
    for rc in RACAS:
        d = ler_json(f'data/racas/{rc}.json')
        fonte = f'data/racas/{rc}.json'
        for card in d['cards']:
            if card['tipo'] not in TIPO_CARD_RACA:
                continue                                # rule-box etc.: regra, não entidade
            tipo, _ = TIPO_CARD_RACA[card['tipo']]
            ent.append({'id': card['id'], 'nome': _limpa_nome(card['nome']), 'fonte': fonte, 'origem': 'raca',
                        'dono': rc, 'tipo': tipo, 'grupo': 'raca', 'ramo': None, 'tier': None,
                        'custoTexto': _custo_do_html(card['corpo']), 'cardClasse': card['tipo'],
                        'pagina': f'pages/racas/{rc}.html', 'html': card['corpo']})
        corr = d['raca'].get('corrupcao')
        if corr:
            for bloco, tipo in (('poderes', 'corrupcao-poder'), ('adversidades', 'corrupcao-adversidade')):
                for it in corr[bloco]['itens']:
                    ent.append({'id': it['id'], 'nome': it['nome'], 'fonte': fonte + f' > raca.corrupcao.{bloco}',
                                'origem': 'raca', 'dono': rc, 'tipo': tipo, 'grupo': 'corrupcao', 'ramo': None,
                                'tier': None, 'custoTexto': it['custo'], 'cardClasse': None,
                                'pagina': f'pages/racas/{rc}.html', 'html': it['efeito']})
    for card in ler_json('data/origens.json')['cards']:
        h = card['origem'].get('habilidade')
        if not h:
            continue
        ent.append({'id': h['id'], 'nome': _limpa_nome(h['nome']), 'fonte': 'data/origens.json', 'origem': 'origem',
                    'dono': card['id'], 'tipo': 'habilidade-de-origem', 'grupo': 'origem', 'ramo': None, 'tier': None,
                    'custoTexto': None, 'cardClasse': None, 'pagina': 'pages/origens.html', 'html': h['texto'],
                    'origemNome': _limpa_nome(card['nome'])})
    return ent


# =================================================================== vocabulário
def texto_blocos(h):
    """Texto puro com os blocos separados por ' | ' (li, p, br, div, h*): um
    padrão não atravessa item de lista."""
    if not h:
        return ''
    t = re.sub(r'(?i)<\s*(?:br|/li|/p|/div|/h[1-6]|/ul|/tr|/td)\b[^>]*>', ' | ', h)
    return texto_puro(t)


def _formas(nome):
    """Flexões de gênero/número de um nome de condição ('Enraizado' -> Enraizada/os/as)."""
    base = chave(nome)
    out = {base}
    ult = base.split(' ')
    w = ult[0]
    resto = ' '.join(ult[1:])
    variantes = {w}
    if w.endswith('o'):
        variantes |= {w[:-1] + 'a', w + 's', w[:-1] + 'as'}
    elif w.endswith('e'):
        variantes |= {w + 's'}
    elif w.endswith('l'):
        variantes |= {w[:-1] + 'is'}
    for v in variantes:
        out.add((v + ' ' + resto).strip())
    return out


class Vocabulario:
    def __init__(self):
        self.regras = ler_json('data/balanceamento/ficha-digital-regras.json')
        # condições: as 30 de data/condicoes.json (via catálogo, que lê o mesmo arquivo)
        self.condicoes = {}
        for e in ler_json('data/catalogo/condicao.json')['entradas']:
            base = re.sub(r'\s+(?:X|N|\d+-\d+)$', '', e['nome'])
            for f in _formas(base):
                self.condicoes[f] = e['nome']
        for alias, alvo in (('Embriagado', 'Bêbado'), ('Exausto', 'Exaustão 1-5'),
                            ('Envenenado', 'Envenenamento'), ('Caído', 'Caído')):
            for f in _formas(alias):
                self.condicoes.setdefault(f, [v for v in self.condicoes.values() if chave(v).startswith(chave(alvo).split(' ')[0])][0])
        # estados que NÃO são condição (contrato + decisões): citá-los não é erro, exceto Marcado
        self.estados = OrderedDict([
            ('marcado', ('alerta', 'Marcado não é condição: o efeito mora na fonte que aplica (D17/PD17: "não promover Marcado").')),
            ('marcada a morte', ('ok', 'Estado de classe do Batedor (Silêncio), não condição genérica (contrato condicoes.marcada-a-morte).')),
            ('marcado a morte', ('ok', 'Estado de classe do Batedor (Silêncio), não condição genérica (contrato condicoes.marcada-a-morte).')),
            ('escondido', ('ok', 'Estado de Furtividade do Sistema, não condição (data/sistema.json > Furtividade).')),
            ('vulneravel', ('ok', 'Camada da grade de dano, não condição (contrato condicoesNaoSaoCondicao).')),
            ('terreno dificil', ('ok', 'Superfície, não condição (contrato condicoesNaoSaoCondicao).')),
            ('dissipado', ('ok', 'Estado de efeito mágico, não condição (contrato condicoesNaoSaoCondicao).')),
        ])
        self.magias = {e['nome']: e['id'] for e in ler_json('data/catalogo/magia.json')['entradas']}
        self.pericias = [p['nome'] for p in ler_json('data/pericias.json')['pericias']]
        self.pericias_ch = {chave(p): p for p in self.pericias}
        for p in self.pericias:                       # "Ofício (Ferraria)" com espaço é estilo
            if '(' in p:
                self.pericias_ch[chave(p.replace('(', ' ('))] = p
        # itens do Bazar: nome sem o parêntese de embalagem ("Tocha (x2)", "Comida (1 porção)")
        self.itens = {}
        for it in ler_json('data/bazar.json'):
            n = re.sub(r'\s*\([^)]*\)$', '', it['nome']).strip()
            self.itens.setdefault(chave(n), it['nome'])
            self.itens.setdefault(chave(it['nome']), it['nome'])
        cat = self.regras['dano']['categorias']
        self.tipos = {t for ts in cat.values() for t in ts}
        self.categorias = set(cat)
        self.aliases_tipo = dict(self.regras['dano']['aliasesDeTipo'])
        # nome de item do Bazar que é também recurso/tipo de dano/perícia/condição ("Éter" e
        # "Eletricidade" são Materiais): no texto de técnica quase sempre é o outro sentido
        self.nao_item = ({'eter', 'stamina', 'saude', 'reagentes', 'fluxo', 'sins', 'vida'} | set(self.aliases_tipo)
                         | self.tipos | self.categorias | set(self.pericias_ch) | set(self.condicoes))
        self.recargas = self.regras['recargas']
        self.vocab = self.regras['vocabulario']
        self.custo_em_tecnicas = {}
        for cid, c in self.regras['classes'].items():
            if isinstance(c, dict):
                for r in c.get('recursos') or []:
                    self.custo_em_tecnicas[r['id']] = (r.get('custoEmTecnicas'), cid)

    def condicao(self, termo):
        k = chave(re.sub(r'\s+(?:\d+|X)$', '', termo.strip(' .,:;!?')))
        return self.condicoes.get(k)

    def tipo_dano(self, termo):
        k = chave(termo)
        k = self.aliases_tipo.get(k, k)
        if k in self.tipos:
            return 'tipo'
        if k in self.categorias or k in ('atipico', 'atipicos', 'todos'):
            return 'categoria'
        return None


# =================================================================== 1 levável
def checa_levavel(e, pag, catalogo):
    kf = pag['kfIds']
    cat = catalogo.get(e['id'] if e['tipo'] != 'habilidade-de-origem' else e['dono'])
    notas = []
    if e['tipo'] == 'habilidade-de-origem':
        # vai junto com o card da origem (um botão por origem, não por habilidade)
        b = pag['porKf'].get(e['dono'])
        r = {'kfId': e['dono'] in kf, 'catalogo': cat is not None, 'botaoV21': b is not None and pag['ficha'],
             'nomeV21': b['nome'] if b else None, 'nomeCatalogo': cat['nome'] if cat else None,
             'tipoV21': b['tipo'] if b else None, 'via': e['dono']}
        notas.append('Leva junto com a origem inteira (card .origem-card); a habilidade não tem botão nem id próprio.')
        ok_nome = b is not None and cat is not None and b['nome'] == cat['nome']
        status = 'parcial' if (r['kfId'] and r['catalogo'] and r['botaoV21'] and ok_nome) else 'nao'
    elif e['tipo'].startswith('corrupcao-'):
        b = pag['porNomeCorr'].get(e['nome'])
        r = {'kfId': False, 'catalogo': cat is not None, 'botaoV21': b is not None and pag['ficha'],
             'nomeV21': b['nome'] if b else None, 'nomeCatalogo': cat['nome'] if cat else None,
             'tipoV21': b['tipo'] if b else None}
        notas.append('Linha da tabela de Corrupção: a v2.1 põe botão pela tabela (.corr-table tr), mas não há data-kf-id nem entrada no catálogo; o nome levado inclui o custo.')
        status = 'parcial' if r['botaoV21'] else 'nao'
    elif e['tipo'] in ('caracteristica-de-classe', 'recurso-de-classe'):
        r = {'kfId': e['id'] in kf, 'catalogo': cat is not None, 'botaoV21': False,
             'nomeV21': None, 'nomeCatalogo': cat['nome'] if cat else None, 'tipoV21': None}
        notas.append('Bloco da classe (fora dos cards): a v2.1 não tem seletor no MAPA para ele.')
        status = 'nao'
    else:
        b = pag['porKf'].get(e['id'])
        r = {'kfId': e['id'] in kf, 'catalogo': cat is not None, 'botaoV21': b is not None and pag['ficha'],
             'nomeV21': b['nome'] if b else None, 'nomeCatalogo': cat['nome'] if cat else None,
             'tipoV21': b['tipo'] if b else None}
        cat_tipo = TIPO_CARD_RACA[e['cardClasse']][1] if e['origem'] == 'raca' else e['tipo']
        erro = []
        if cat is not None and cat['tipo'] != cat_tipo:
            erro.append(f"catálogo tem tipo {cat['tipo']!r}, esperado {cat_tipo!r}")
        if b and cat and b['nome'] != cat['nome']:
            erro.append(f"nome que a v2.1 levaria ({b['nome']!r}) difere do catálogo ({cat['nome']!r})")
        notas.extend(erro)
        # tipo gravado diferente não impede levar (vai para o mesmo campo 'tecnicas'): só nota
        if b and cat and b['tipo'] != cat['tipo'] and not (b['tipo'] == 'traço' and cat['tipo'] == 'traco') \
                and not (b['tipo'] == 'subespécie' and cat['tipo'] == 'subespecie'):
            notas.append(f"a v2.1 grava tipo {b['tipo']!r} (seletor {b['seletor']}); o catálogo diz {cat['tipo']!r}. "
                         f"Leva para o campo técnicas do mesmo jeito.")
        tudo = r['kfId'] and r['catalogo'] and r['botaoV21'] and b and cat and b['nome'] == cat['nome']
        status = 'ok' if tudo and not erro else ('parcial' if r['botaoV21'] or r['kfId'] else 'nao')
        if not pag['ficha']:
            notas.append('a página não carrega js/ficha.js nem js/main.js')
    r['status'] = status
    r['notas'] = notas
    return r


# =================================================================== 2 custo
_REC = {'stamina': 'stamina', 'éter': 'eter', 'eter': 'eter', 'saúde': 'saude', 'saude': 'saude',
        'reagentes': 'reagentes', 'fluxo': 'fluxo', 'conc.': 'concentracao', 'conc': 'concentracao',
        'concentração': 'concentracao', 'brutalidade': 'brutalidade', 'instinto': 'instinto'}
_T_ACAO = [
    ('acaoLivre', re.compile(r'Ação Livre', re.I)),
    ('acaoExtra', re.compile(r'\+\s*(\d+)\s*Aç(?:ão|ões)', re.I)),
    ('acoesFaixa', re.compile(r'(\d+)\s*-\s*(\d+)\s*Aç(?:ão|ões)', re.I)),
    ('acoesX', re.compile(r'\bX\s*Aç(?:ão|ões)', re.I)),
    ('acoes', re.compile(r'(\d+)\s*Aç(?:ão|ões)', re.I)),
    ('reacao', re.compile(r'Reação', re.I)),
    ('passiva', re.compile(r'Passiva', re.I)),
    ('tempo', re.compile(r'(\d+)\s*(Min(?:uto)?s?|minutos?)\b', re.I)),
    ('descansoCurto', re.compile(r'Descanso Curto', re.I)),
]
_T_REC = re.compile(r'(\d+\s*%|\d+\s*-\s*\d+|\d+\s*\+|\d+|X)\s*(Stamina|Éter|Eter|Saúde|Saude|Reagentes|Fluxo|Conc\.?|Concentração|Brutalidade|Instinto)(\s*/\s*Item)?', re.I)
_T_USOS = re.compile(r'(\d+)\s*x\s*/\s*(Descanso Longo|Descanso Curto|Dia|Sess[aã]o|Semana|Campanha|Combate|Cena|Turno|Rodada)', re.I)
_T_ITEM = re.compile(r'(\d+)\s*Item\s*:\s*([^•·,]+)', re.I)
_SEP = re.compile(r'^[\s•·,/+]*(?:ou[\s•·,/+]*)*$', re.I)


def checa_custo(e, voc):
    ct = e['custoTexto']
    if ct is None:
        motivo = {'marca': 'Marca não tem custo impresso.',
                  'habilidade-de-origem': 'Habilidade de origem sem linha de custo.',
                  'caracteristica-de-classe': 'Característica de classe sem linha de custo.',
                  'recurso-de-classe': 'É o próprio recurso (medidor).'}.get(e['tipo'], 'Sem linha de custo impressa.')
        return {'status': 'naoSeAplica', 'nota': motivo}
    if e['tipo'].startswith('corrupcao-'):
        return {'status': 'naoSeAplica', 'texto': ct,
                'nota': 'Custo de criação em pontos de Corrupção (tabela do Corrompido), não custo de uso em jogo.',
                'pontosCorrupcao': int(ct.replace('+', ''))}
    usado = [False] * len(ct)
    acoes, recursos, extras, fora = [], [], [], []

    def marca(m):
        if any(usado[m.start():m.end()]):
            return False
        for i in range(m.start(), m.end()):
            usado[i] = True
        return True

    for m in _T_USOS.finditer(ct):
        if marca(m):
            recursos.append({'recurso': 'usos', 'custoTipo': 'fixo', 'valor': int(m.group(1)),
                             'recarga': m.group(2), 'texto': m.group(0)})
    for m in _T_ITEM.finditer(ct):
        if marca(m):
            fora.append({'item': m.group(2).strip(), 'quantidade': int(m.group(1)), 'texto': m.group(0),
                         'nota': 'item como custo: fora do vocabulário de recurso do contrato'})
    for m in _T_REC.finditer(ct):
        if not marca(m):
            continue
        v, nome, por_item = m.group(1).replace(' ', ''), m.group(2), m.group(3)
        rid = _REC[nome.lower()]
        if por_item:
            tipo, val = 'porUnidade', {'valor': int(v)}
        elif v.endswith('%'):
            tipo, val = 'percentual', {'fator': int(v[:-1]) / 100, 'base': 'maximo'}
        elif v == 'X':
            tipo, val = 'variavel', {'min': None, 'max': None}
        elif v.endswith('+'):
            tipo, val = 'variavel', {'min': int(v[:-1]), 'max': None}
        elif '-' in v:
            a, b = v.split('-')
            tipo, val = 'variavel', {'min': int(a), 'max': int(b)}
        else:
            tipo, val = 'fixo', {'valor': int(v)}
        item = {'recurso': rid, 'custoTipo': tipo, **val, 'texto': m.group(0)}
        regra = voc.custo_em_tecnicas.get(rid)
        if regra:
            item['emTecnicas'] = regra[0] if regra[0] != 'porTecnica' else 'porTecnica (padrão requisito)'
            item['emTecnicasFonte'] = f'contrato classes.{regra[1]}.recursos[{rid}].custoEmTecnicas'
        recursos.append(item)
    for rot, rx in _T_ACAO:
        for m in rx.finditer(ct):
            if not marca(m):
                continue
            if rot == 'acaoLivre':
                acoes.append(0)
            elif rot == 'acoes':
                acoes.append(int(m.group(1)))
            elif rot == 'reacao':
                acoes.append('reacao')
            elif rot == 'passiva':
                acoes.append('passiva')
            elif rot == 'acoesFaixa':
                acoes.append({'min': int(m.group(1)), 'max': int(m.group(2))})
            elif rot == 'acoesX':
                acoes.append({'min': None, 'max': None})
            elif rot == 'acaoExtra':
                extras.append({'acaoExtra': int(m.group(1)), 'texto': m.group(0),
                               'nota': 'ação a mais sobre outra ação (ex.: no ataque): fora do vocabulário de ações'})
            elif rot == 'tempo':
                extras.append({'tempoMinutos': int(m.group(1)), 'texto': m.group(0),
                               'nota': 'tempo, não ações (D90: 1 minuto = 10 rodadas)'})
            elif rot == 'descansoCurto':
                extras.append({'tempo': 'descansoCurto', 'texto': m.group(0),
                               'nota': 'usada como ação de descanso curto'})
    sobra = ''.join(ch for ch, u in zip(ct, usado) if not u)
    sobra_ok = bool(_SEP.match(sobra))
    # Passiva + Stamina = reserva (P45), interpretação com o Pedro
    if 'passiva' in acoes:
        for r in recursos:
            if r['recurso'] == 'stamina':
                r['custoTipoAlternativo'] = 'reserva'
                r['reservaStatus'] = 'pedroDecide'
                r['reservaFonte'] = 'contrato vocabulario.custoTipoDetalhe.reserva (P45)'
    vocab_acoes = set(voc.vocab['acoes'])
    acoes_ok = all(isinstance(a, dict) or a in vocab_acoes for a in acoes)
    rec_ok = all(r['recurso'] in voc.vocab['recurso'] and r['custoTipo'] in voc.vocab['custoTipo'] for r in recursos)
    achou = bool(acoes or recursos or extras or fora)
    if not achou:
        status = 'nao'
    elif sobra_ok and acoes_ok and rec_ok and not extras and not fora and acoes:
        status = 'ok'
    else:
        status = 'parcial'
    out = {'status': status, 'texto': ct, 'acoes': acoes, 'recursos': recursos}
    if extras:
        out['foraDoVocabulario'] = extras
    if fora:
        out['itens'] = fora
    if not sobra_ok:
        out['sobra'] = re.sub(r'\s+', ' ', sobra).strip()
    if achou and not acoes:
        out.setdefault('notas', []).append('sem tipo de ação reconhecido')
    if len(acoes) > 1:
        out.setdefault('notas', []).append('alternativas de ação (o jogador escolhe)')
    return out


# =================================================================== 3 recarga
_UNID = [
    ('descanso longo', 'longo'), ('descanso curto', 'curto'), ('dia', 'dia'), ('sessao', 'sessao'),
    ('sessão', 'sessao'), ('semana', 'semana'), ('campanha', 'campanha'), ('combate', 'combate'),
    ('cena', 'cena'), ('turno', 'turno'), ('rodada', 'rodada'), ('localizacao', 'porLocalizacao'),
    ('localização', 'porLocalizacao'), ('pericia', 'cena'), ('perícia', 'cena'),
]
_UNID_RX = '|'.join(re.escape(u) for u, _ in _UNID)
_R_BARRA = re.compile(r'(\d+|X)\s*x\s*/\s*(' + _UNID_RX + r')', re.I)
_R_PROSA = re.compile(r'(\d+|uma|duas|tr[eê]s|X)\s*(?:x|vez(?:es)?)\s+(?:por|a cada|ao|/)\s+(' + _UNID_RX + r')', re.I)
_R_USOS = re.compile(r'[Uu]sos?\s*:\s*([^)|]*?)\s*/\s*(' + _UNID_RX + r')', re.I)
_R_POR_DIA = re.compile(r'\bpor\s+dia\b|/\s*dia\b', re.I)


def checa_recarga(e, voc):
    fontes = [('custoTexto', e['custoTexto'] or ''), ('nome', e['nome']), ('texto', texto_blocos(e['html']))]
    achados, vistos = [], set()
    for onde, t in fontes:
        for rx, forma in ((_R_BARRA, 'barra'), (_R_USOS, 'usos'), (_R_PROSA, 'prosa')):
            for m in rx.finditer(t):
                if any(o == onde and s <= m.start() < f for o, s, f in vistos):
                    continue
                vistos.add((onde, m.start(), m.end()))
                unid = dict((chave(u), v) for u, v in _UNID)[chave(m.group(2))]
                ev = voc.recargas.get(unid)
                a = {'onde': onde, 'texto': m.group(0), 'forma': forma, 'periodo': unid, 'evento': ev}
                if unid == 'dia':
                    a['status'] = 'alerta'
                    a['nota'] = 'notação antiga: a oficial é "1x/Descanso Longo" (L29); a ficha trata como descansoLongo'
                elif forma == 'barra':
                    a['status'] = 'ok'
                else:
                    a['status'] = 'ok'
                    a['nota'] = 'reconhecida (prosa ou "Usos:"); a notação das técnicas é "Nx/Período" (L29)'
                if ev == 'manual':
                    a['nota'] = (a.get('nota', '') + ' marcada à mão (contrato recargas)').strip()
                achados.append(a)
        for m in _R_POR_DIA.finditer(t):
            if any(o == onde and s <= m.start() < f for o, s, f in vistos):
                continue
            vistos.add((onde, m.start(), m.end()))
            achados.append({'onde': onde, 'texto': m.group(0), 'forma': 'porDia', 'periodo': 'dia',
                            'evento': voc.recargas.get('dia'), 'status': 'alerta',
                            'nota': 'notação antiga "por dia": a oficial é "1x/Descanso Longo" (L29)'})
    # o card impresso repete a linha de custo/nome no corpo: não conta duas vezes
    ja = {chave(a['texto']) for a in achados if a['onde'] != 'texto'}
    achados = [a for a in achados if a['onde'] != 'texto' or chave(a['texto']) not in ja]
    if not achados:
        return {'status': 'semRecarga', 'achados': []}
    st = 'alerta' if any(a['status'] == 'alerta' for a in achados) else 'ok'
    return {'status': st, 'achados': achados}


# =================================================================== 4 referências
# Termos em itálico/negrito que não são referência a condição/perícia/magia/item
# nem estado: nomes de técnica, manobra, rótulo de bloco, termo de classe. Lista
# fechada e versionada aqui; termo novo desconhecido aparece como "naoClassificado"
# (informação), nunca como erro.
_CONTEXTO_CONDICAO = re.compile(
    r'(?:\bfic(?:a|am|ar|ando)|\btorna-se|\bse torna|\bdeix(?:a|ando)|\bcondi[cç](?:ão|ões)|\bimunes?\s+a|'
    r'\brecebe(?:m)?|\bganha(?:m)?|\bremove(?:r)?|\bsob)\s+(?:a\s+|o\s+|as\s+|os\s+|condi[cç]ão\s+)?'
    r'([A-ZÀ-Ú][a-zà-ú]+(?:\s+(?:[àa]\s+)?[A-ZÀ-Ú][a-zà-ú]+)?(?:\s+(?:\d+|X))?)')
_DANO_CTX = re.compile(r'\bdanos?\s+(?:de\s+|do\s+tipo\s+)?([A-ZÀ-Úa-zà-ú]+)|\d+d\d+\s*(?:\+\s*[\w.]+\s*)?\(([A-ZÀ-Ú][a-zà-ú]+)\)|'
                       r'\bResist[eê]ncia\s+a\s+(?:dano\s+)?([A-ZÀ-Ú][a-zà-ú]+)|\bA[er]\s*\(\s*([^),]+)')
_PALAVRAS_DANO_NAO_TIPO = {'adicional', 'extra', 'total', 'maximo', 'minimo', 'base', 'critico', 'dobrado', 'original',
                           'causado', 'recebido', 'reduzido', 'em', 'que', 'por', 'e', 'a', 'o', 'ao', 'na', 'no', 'da',
                           'do', 'se', 'ou', 'uma', 'um', 'nao', 'contra', 'maior', 'possivel', 'escolhido', 'especifico',
                           'divididos', 'queda', 'ele', 'ignoram', 'recebem', 'protegendo', 'igual', 'normal', 'sofrido',
                           'dos', 'das', 'de', 'aos', 'nos', 'nas', 'sera', 'for', 'fisico', 'fisicos', 'magico',
                           'armadura especifica', 'tipo'}
_PERICIA_CTX = re.compile(r'(?:\btestes?\s+de|\bTreinad[oa]\s+em|\btreinamento\s+(?:na\s+per[ií]cia\s+|em\s+)|'
                          r'\bper[ií]cia\s+|\brola(?:r)?\s+)([A-ZÀ-Ú][a-zà-ú]+(?:\s*\([A-ZÀ-Úa-zà-ú]+\))?)')
# "Interação Social" é o grupo das 5 perícias sociais (data/sistema.json > Interação Social);
# "Jornada" e "resistência" são tipos de teste do Sistema, não perícia.
_NAO_PERICIA = {'resistencia', 'jornada', 'qualquer', 'ataque', 'dano', 'arremesso', 'interacao'}


def _em_termos(h):
    out = []
    for m in re.finditer(r'<(em|strong)>(.*?)</\1>', h or '', re.S):
        t = texto_puro(m.group(2)).strip(' .,:;!?()"“”')
        if t and len(t) <= 40:
            out.append(t)
    return out


def checa_referencias(e, voc):
    h = e['html'] or ''
    t = texto_blocos(h) + ' | ' + (e['custoTexto'] or '')
    tk = ' ' + chave(t) + ' '
    alertas, info = [], []

    # --- condições citadas (existentes) e candidatas a condição fora da lista
    cond = set()
    for k, nome in voc.condicoes.items():
        if re.search(r'(?<![a-z])' + re.escape(k) + r'(?![a-z])', tk):
            cond.add(nome)
    candidatos = set(_em_termos(h))
    for m in _CONTEXTO_CONDICAO.finditer(t):
        candidatos.add(m.group(1))
    for m in re.finditer(r'\bMarcad[oa]s?\b(?!\s+[àa]\s+[Mm]orte)', t):   # "fica permanentemente Marcado"
        candidatos.add(m.group(0))
    desconhecidas, estados = [], []
    for c in sorted(candidatos):
        ck = chave(re.sub(r'\s+(?:\d+|X)$', '', c))
        est = None
        for pref, v in sorted(voc.estados.items(), key=lambda kv: -len(kv[0])):   # "marcado a morte" antes de "marcado"
            if ck == pref or ck.startswith(pref + ' ') or re.sub(r's\b', '', ck) == pref or ck.rstrip('as') == pref.rstrip('o'):
                est = (pref, v)
                break
        if est:
            estados.append({'termo': c, 'estado': est[0], 'status': est[1][0], 'nota': est[1][1]})
            continue
        if voc.condicao(c):
            cond.add(voc.condicao(c))
            continue
        # só adjetivo/particípio de uma palavra entra como candidato a condição
        if re.fullmatch(r'[A-ZÀ-Úa-zà-ú]+(?:ad[oa]s?|id[oa]s?)(?:\s+\d+)?', c) \
                and ck not in voc.pericias_ch and voc.tipo_dano(c) is None and c not in voc.magias \
                and ck not in _NAO_CONDICAO:
            desconhecidas.append(c)
    for s in estados:
        if s['status'] == 'alerta':
            alertas.append({'tipo': 'naoECondicao', 'termo': s['termo'], 'nota': s['nota'], 'fonte': 'D17 / PD17'})
    for c in desconhecidas:
        alertas.append({'tipo': 'condicaoInexistente', 'termo': c, 'severidade': 'revisar',
                        'nota': 'escrito como estado/condição, mas não está entre as 30 de data/condicoes.json'})

    # --- magias
    magias = sorted(n for n in voc.magias if re.search(r'(?<![\wÀ-ú])' + re.escape(n) + r'(?![\wÀ-ú])', t))
    for m in re.finditer(r'\bmagias?\s+(?:chamada\s+)?[“"]([^”"]+)[”"]', t):
        if m.group(1) not in voc.magias:
            alertas.append({'tipo': 'magiaInexistente', 'termo': m.group(1), 'nota': 'não está em data/magias.json'})

    # --- itens do Bazar: citados (existentes) e "item:X" que não existe
    itens = set()
    for m in re.finditer(r'(?<![\wÀ-ú])(\d+\s+)?([A-ZÀ-Ú][\wÀ-ú\'’-]*(?:\s+(?:de|da|do|dos|das|e)?\s*[A-ZÀ-Ú][\wÀ-ú\'’-]*){0,3})', t):
        frase = m.group(2)
        palavras = frase.split()
        for n in range(len(palavras), 0, -1):
            cand = ' '.join(palavras[:n])
            if cand.lower() in ('de', 'da', 'do'):
                continue
            ks = [chave(cand),
                  chave(' '.join(re.sub(r'(?<=[a-zà-ú]{3})s$', '', w) for w in cand.split())),    # Madeiras Nobres
                  chave(' '.join(re.sub(r'(?<=[a-zà-ú]{3})es$', '', w) for w in cand.split()))]   # Couros -> Couro já acima
            if ks[0] in voc.nao_item:
                break
            hit = next((voc.itens[k] for k in ks if k in voc.itens), None)
            if hit and (len(cand) >= 5 or m.group(1)):
                itens.add(hit)
                break
    for m in re.finditer(r'\b[Ii]tem\s*:\s*([A-ZÀ-Ú][\wÀ-ú]*(?:\s+(?:de|da|do)?\s*[A-ZÀ-Ú][\wÀ-ú]*)*)', t):
        n = m.group(1).strip()
        k = chave(n)
        if k not in voc.itens and not any(x.startswith(k + ' ') for x in voc.itens):
            alertas.append({'tipo': 'itemInexistente', 'termo': n, 'nota': 'citado como item:X, mas não está em data/bazar.json'})
        elif k in voc.itens:
            itens.add(voc.itens[k])

    # --- perícias: citadas e "teste de X" / "Treinado em X" com X fora das 24
    pericias = sorted({p for kp, p in voc.pericias_ch.items()
                       if re.search(r'(?<![a-z])' + re.escape(kp) + r'(?![a-z])', tk)})
    for m in _PERICIA_CTX.finditer(t):
        x = m.group(1)
        k = chave(x)
        if k in voc.pericias_ch or k.split(' ')[0] in voc.pericias_ch or voc.condicao(x) or k in _NAO_PERICIA \
                or voc.tipo_dano(x):
            continue
        if re.match(r'of[ií]cio', k):
            continue                                  # regra oficio-generico cuida
        alertas.append({'tipo': 'periciaInexistente', 'termo': x, 'trecho': m.group(0), 'severidade': 'revisar',
                        'nota': 'escrito como perícia, mas não está entre as 24 de data/pericias.json'})

    # --- tipos de dano
    tipos, ae = set(), []
    for m in _DANO_CTX.finditer(t):
        g = next(x for x in m.groups() if x)
        if m.group(4) is not None:                    # Ae(...) / Ar(...)
            alvo = g.strip()
            if re.fullmatch(r'\d+|X|Armadura(?: Espec[ií]fica)?', alvo, re.I):
                continue
            k = voc.tipo_dano(alvo)
            ae.append(alvo)
            if k is None:
                alertas.append({'tipo': 'tipoDeDanoInexistente', 'termo': alvo, 'trecho': m.group(0),
                                'nota': 'Ae(...) com tipo fora dos 14 tipos + 4 categorias + Todos'})
            else:
                tipos.add(chave(alvo))
            continue
        k = chave(g)
        if k in _PALAVRAS_DANO_NAO_TIPO:
            continue
        cls = voc.tipo_dano(g)
        if cls:
            tipos.add(voc.aliases_tipo.get(k, k))
        elif g[0].isupper() and len(g) > 3:
            info.append({'tipo': 'danoNaoClassificado', 'termo': g, 'trecho': m.group(0)})
    unicos, vistos = [], set()
    for a in alertas:
        k = (a['tipo'], a['termo'])
        if k not in vistos:
            vistos.add(k)
            unicos.append(a)
    alertas = unicos
    return {
        'status': 'alerta' if alertas else 'ok',
        'condicoes': sorted(cond), 'estadosNaoCondicao': estados, 'magias': magias, 'itens': sorted(itens),
        'pericias': pericias, 'tiposDeDano': sorted(tipos), 'alertas': alertas, 'info': info,
    }


_NAO_CONDICAO = {
    # particípios/adjetivos que aparecem em itálico ou após "fica" e NÃO são condição
    'treinado', 'experiente', 'superflua', 'corajoso', 'obcecado', 'enfurecido', 'endividado', 'provocados',
    'provocado', 'irritado', 'coberta', 'coberto', 'ciente', 'indisponivel', 'inutilizavel', 'imune', 'imunes',
    'imovel', 'parado', 'banida', 'banido', 'ativas', 'ativo', 'precisos', 'mestre',
    'treinamento', 'vida', 'forcada',             # grau de treino; "Vida: N anos"; intensidade de magia
}


# =================================================================== 5 obsoletas
def carrega_obsoletas():
    d = ler_json('tools/regras_obsoletas.json')
    regras = []
    for r in d['regras']:
        r = dict(r)
        r['_rx'] = re.compile(r['padrao'])
        r['_ex'] = re.compile(r['exceto']) if r.get('exceto') else None
        regras.append(r)
    return d['versao'], regras


def checa_obsoletas(e, regras):
    campos = {'texto': texto_blocos(e['html']), 'custo': e['custoTexto'] or '', 'nome': e['nome']}
    achados, vistos = [], set()
    for r in regras:
        alvos = ['custo', 'nome', 'texto'] if r['campo'] == 'tudo' else [r['campo']]
        for c in alvos:
            t = campos[c]
            for m in r['_rx'].finditer(t):
                # trecho verbatim = o bloco (li/p/linha) inteiro onde casou
                ini = t.rfind(' | ', 0, m.start())
                fim = t.find(' | ', m.end())
                trecho = t[ini + 3 if ini >= 0 else 0: fim if fim >= 0 else len(t)].strip(' |')
                if r['_ex'] and r['_ex'].search(trecho):
                    continue
                # um achado por regra e bloco; o card impresso repete o custo no corpo: não conta duas vezes
                k = (r['id'], chave(trecho)) if c == 'texto' else (r['id'], chave(m.group(0)))
                if c == 'texto' and (r['id'], chave(m.group(0))) in vistos and chave(m.group(0)) in chave(campos['custo']):
                    continue
                if k in vistos:
                    continue
                vistos.add(k)
                achados.append({'regra': r['id'], 'severidade': r['severidade'], 'campo': c,
                                'casou': m.group(0), 'trechoVerbatim': trecho,
                                'regraAtual': r['regraAtual'], 'fonte': r['fonte']})
    sev = {a['severidade'] for a in achados}
    status = 'obsoleto' if 'obsoleto' in sev else ('revisar' if 'revisar' in sev else 'ok')
    return {'status': status, 'achados': achados}


# =================================================================== 6 automação
_CAMPOS_NUM = (
    r'Margem de Ameaça|Armadura\s*\(Ar\)(?:\s*Natural)?|Armadura|Evasão|Movimento|Iniciativa|'
    r'Stamina(?:\s+(?:Máxima|Temporária|máxima|temporária))?|Éter(?:\s+(?:Máximo|máximo))?|'
    r'Saúde(?:\s+(?:Máxima|Temporária|máxima|temporária))?|Vida(?:\s+máxima)?|Vitalidade|CD|dados?\s+de\s+dano|de\s+dano|dano|'
    r'Força|Destreza|Constituição|Inteligência|Sabedoria|FOR|DES|CON|INT|SAB|Ações?|Reaç(?:ão|ões)|'
    r'Ae\s*\([^)]*\)|Ar\b|atacar|defender'
)


def numeros(e, voc):
    t = texto_blocos(e['html'])
    per = '|'.join(re.escape(p) for p in sorted(voc.pericias, key=len, reverse=True))
    rx = re.compile(r'([+\-−]\s?\d+(?:d\d+)?(?:\s*m)?)\s*(?:de\s+|em\s+|no\s+|na\s+|ao\s+|à\s+)?(' + per + '|' + _CAMPOS_NUM + r')',
                    re.I)
    out, vistos = [], set()
    for m in rx.finditer(t):
        campo = re.sub(r'\s+', ' ', m.group(2)).strip()
        campo_n = next((p for p in voc.pericias if chave(p) == chave(campo)), campo)
        k = (m.group(1).replace(' ', ''), campo_n)
        if k in vistos:
            continue
        vistos.add(k)
        a = max(0, m.start() - 40)
        out.append({'valor': k[0].replace('−', '-'), 'campo': campo_n,
                    'trecho': t[a:min(len(t), m.end() + 30)].strip()})
    return out


AUTOMACAO_FONTE = ('docs/ficha-digital/03-respostas-pedro.md §1: técnica de classe fica manual; todo campo da '
                   'ficha é editável à mão, com o ajuste marcado e removível')


def checa_automacao(e, voc):
    return {'status': 'manual', 'numeros': numeros(e, voc)}


# =================================================================== montagem
def catalogo_por_id():
    out = {}
    for p in sorted((RAIZ / 'data' / 'catalogo').glob('*.json')):
        with open(p, encoding='utf-8') as f:
            for e in json.load(f)['entradas']:
                out[e['id']] = e
    return out


def paginas(entradas, mapa, tem_corr):
    out = {}
    for pg in sorted({e['pagina'] for e in entradas}):
        raiz = arvore(RAIZ / pg)
        botoes = decorar(raiz, mapa, tem_corr)
        out[pg] = {
            'ficha': carrega_ficha(raiz),
            'kfIds': {n.attrs['data-kf-id'] for n in raiz.descendentes() if n.attrs.get('data-kf-id')},
            'porKf': {b['kfId']: b for b in botoes if b['kfId']},
            'porNomeCorr': {b['nomeBase']: b for b in botoes if b.get('nomeBase')},
        }
    return out


def _alerta_geral(r):
    """Uma técnica está 'ok' quando nenhuma checagem acusa problema."""
    motivos = []
    if r['levavel']['status'] != 'ok':
        motivos.append('levavel:' + r['levavel']['status'])
    if r['custo']['status'] in ('parcial', 'nao'):
        motivos.append('custo:' + r['custo']['status'])
    if r['recarga']['status'] == 'alerta':
        motivos.append('recarga:alerta')
    if r['referencias']['status'] == 'alerta':
        motivos.append('referencias:alerta')
    if r['obsoletas']['status'] in ('obsoleto', 'revisar'):
        motivos.append('obsoletas:' + r['obsoletas']['status'])
    return motivos


def gerar():
    voc = Vocabulario()
    versao_obs, regras_obs = carrega_obsoletas()
    mapa, tem_corr = mapa_ficha()
    ent = inventario()
    ids = Counter(e['id'] for e in ent)
    dup = sorted(i for i, n in ids.items() if n > 1)
    if dup:
        raise SystemExit(f'id repetido no inventário: {dup}')
    cat = catalogo_por_id()
    pags = paginas(ent, mapa, tem_corr)
    tecnicas = []
    for e in ent:
        r = OrderedDict()
        for k in ('id', 'nome', 'fonte', 'tipo', 'grupo', 'ramo', 'tier', 'custoTexto'):
            r[k] = e[k]
        r['dono'] = e['dono']
        r['pagina'] = e['pagina']
        if e.get('statusFonte'):
            r['statusFonte'] = e['statusFonte']
            r['notaFonte'] = e.get('notaFonte')
        if e.get('medidores') is not None:
            r['medidores'] = [{'id': m['id'], 'nome': m['nome'], 'max': m.get('max'), 'min': m.get('min')}
                              for m in e['medidores']]
        r['levavel'] = checa_levavel(e, pags[e['pagina']], cat)
        r['custo'] = checa_custo(e, voc)
        r['recarga'] = checa_recarga(e, voc)
        r['referencias'] = checa_referencias(e, voc)
        r['obsoletas'] = checa_obsoletas(e, regras_obs)
        r['automacao'] = checa_automacao(e, voc)
        motivos = _alerta_geral(r)
        r['status'] = 'alerta' if motivos else 'ok'
        r['motivos'] = motivos
        tecnicas.append(r)
    return OrderedDict([
        ('schema', SCHEMA),
        ('_doc', 'Gerado por tools/log_tecnicas.py (só leitura do repo; determinístico). Uma entrada por técnica '
                 'que o jogador leva para a ficha. Checagens: levavel (data-kf-id + catálogo + botão .kf-addbtn da ficha '
                 'v2.1, nome == catálogo), custo (vocabulário do contrato), recarga (L29), referencias (condições, '
                 'magias, itens, perícias, tipos de dano), obsoletas (tools/regras_obsoletas.json), automacao (hoje '
                 'manual; numeros = campos citados). Não corrige texto canônico: aponta trecho verbatim + regra atual + fonte.'),
        ('fontes', OrderedDict([
            ('regrasAtuais', ['docs/ficha-digital/03-respostas-pedro.md',
                              '09-decisoes-pedro.md D80-D97 (branch claude/khalkaria-bazar-balance-lsdfic)',
                              'data/sistema.json', 'data/condicoes.json', 'data/magias.json', 'data/pericias.json',
                              'data/bazar.json',
                              f"data/balanceamento/ficha-digital-regras.json ({voc.regras['schemaVersion']})"]),
            ('tecnicas', ['data/classes/*.json', 'data/racas/*.json', 'data/origens.json']),
            ('ficha', 'js/ficha.js (MAPA, decorar, decorarCorrupcao, textoLimpo) sobre pages/**/*.html'),
            ('regrasObsoletas', f'tools/regras_obsoletas.json (versao {versao_obs})'),
            ('automacao', AUTOMACAO_FONTE),
        ])),
        ('notasDeMetodo', [
            'status da técnica: "alerta" quando alguma checagem acusa (levavel != ok, custo parcial/nao, recarga alerta, '
            'referencias alerta, obsoletas obsoleto/revisar); o campo motivos lista quais.',
            'levavel "parcial": a v2.1 leva, mas não como entidade própria (habilidade de origem vai com o card da origem; '
            'Corrupção vai pela linha da tabela, sem id nem catálogo). "nao": bloco da classe, sem seletor no MAPA.',
            'referencias.condicoes/magias/itens/pericias são casamento por nome (informação): pode haver homônimo '
            '(ex.: a sub-habilidade "Ponto Cego" do Batedor casa com a magia Ponto Cego). Só os alertas são problema.',
            'obsoletas severidade "info" (defender-bonus-plano, investida-citada) não conta como alerta.',
            'automacao "manual" em todas: a ficha não automatiza técnica (Pedro, 03-respostas-pedro.md §1); numeros '
            'lista os valores de campo que a técnica cita, para edição à mão.',
        ]),
        ('foraDoEscopo', [
            'data/classes/alquimista.json classe.itensAlquimicos (receitas de item, não técnica)',
            'data/racas/automato.json rule-box "Achar Tecnologias em Lojas" (regra, não entidade)',
            'Técnica de raça ("1 técnica de raça", 03-respostas-pedro.md §2): raca.tecnica.status = pendente nas 7 raças; '
            'a página não diz qual característica é a técnica',
        ]),
        ('resumo', resumo(tecnicas)),
        ('tecnicas', tecnicas),
    ])


def resumo(tecnicas):
    por_fonte = OrderedDict()
    for t in tecnicas:
        f = t['fonte'].split(' > ')[0]
        s = por_fonte.setdefault(f, OrderedDict([('total', 0), ('ok', 0), ('alerta', 0),
                                                 ('levavel', Counter()), ('custo', Counter()), ('recarga', Counter()),
                                                 ('referencias', Counter()), ('obsoletas', Counter())]))
        s['total'] += 1
        s[t['status']] += 1
        for k in ('levavel', 'custo', 'recarga', 'referencias', 'obsoletas'):
            s[k][t[k]['status']] += 1
    for s in por_fonte.values():
        for k in ('levavel', 'custo', 'recarga', 'referencias', 'obsoletas'):
            s[k] = OrderedDict(sorted(s[k].items()))
    geral = OrderedDict([('total', len(tecnicas)),
                         ('ok', sum(t['status'] == 'ok' for t in tecnicas)),
                         ('alerta', sum(t['status'] == 'alerta' for t in tecnicas))])
    for k in ('levavel', 'custo', 'recarga', 'referencias', 'obsoletas'):
        geral[k] = OrderedDict(sorted(Counter(t[k]['status'] for t in tecnicas).items()))
    geral['porTipo'] = OrderedDict(sorted(Counter(t['tipo'] for t in tecnicas).items()))
    geral['automacao'] = OrderedDict(sorted(Counter(t['automacao']['status'] for t in tecnicas).items()))
    regras = Counter(a['regra'] for t in tecnicas for a in t['obsoletas']['achados'])
    geral['obsoletasPorRegra'] = OrderedDict(sorted(regras.items()))
    alertas_ref = Counter(a['tipo'] for t in tecnicas for a in t['referencias']['alertas'])
    geral['referenciasPorTipo'] = OrderedDict(sorted(alertas_ref.items()))
    return OrderedDict([('geral', geral), ('porFonte', por_fonte)])


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--saida', default=str(SAIDA))
    ap.add_argument('--resumo', action='store_true', help='imprime o resumo geral')
    a = ap.parse_args(argv)
    doc = gerar()
    saida = Path(a.saida)
    saida.parent.mkdir(parents=True, exist_ok=True)
    with open(saida, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(doc, f, ensure_ascii=False, indent=1)
        f.write('\n')
    g = doc['resumo']['geral']
    print(f"{saida.relative_to(RAIZ) if saida.is_relative_to(RAIZ) else saida}: {g['total']} técnicas, "
          f"{g['ok']} ok, {g['alerta']} com alerta")
    if a.resumo:
        print(json.dumps(doc['resumo'], ensure_ascii=False, indent=1))
    return 0


if __name__ == '__main__':
    sys.exit(main())
