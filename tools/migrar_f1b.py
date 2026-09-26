#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Migração F1b (uma vez só): conteúdo de classe/raça/origem preso no template
-> blocos `classe`/`raca`/`origem` em data/, verbatim, por script.

Cada campo é localizado por uma expressão que tem de casar EXATAMENTE uma vez
(ou um número conferido de vezes, nas listas); o trecho casado vai para o JSON
sem nenhuma alteração e, no template (ou no corpo do card de origem), vira o
marcador {{classe.caminho}}. Antes de gravar, o script confere que
blocos.preenche(novo) == antigo, byte a byte, arquivo por arquivo. Os campos
derivados (V/G/R, slugs, ids…) saem de tools/blocos.py.

Já migrado (template com marcador {{classe.…}}) o script se recusa a rodar:
fica no repo como registro de como cada campo foi extraído.

Uso: python tools/migrar_f1b.py [repo_root]
"""
import json, os, re, sys

TOOLS = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, TOOLS)
import blocos                                   # noqa: E402
from blocos import poe, preenche, CLASSES, RACAS  # noqa: E402

RAIZ = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(TOOLS)


class Ex:
    """Extrator: acumula (início, fim, caminho) e o valor verbatim no bloco."""

    def __init__(self, t, onde):
        self.t, self.onde, self.subs, self.b = t, onde, [], {}

    def _casa(self, padrao, reg=None, n=1):
        a, z = reg or (0, len(self.t))
        ms = list(re.compile(padrao, re.S).finditer(self.t, a, z))
        if n is not None and len(ms) != n:
            raise SystemExit(f'{self.onde}: {padrao[:90]!r} casou {len(ms)}x (esperado {n})')
        return ms

    def regiao(self, padrao, reg=None):
        m = self._casa(padrao, reg)[0]
        return m.start(), m.end()

    def marca(self, cam, a, z):
        self.subs.append((a, z, cam))
        poe(self.b, cam, self.t[a:z])

    def um(self, cam, padrao, reg=None):
        m = self._casa(padrao, reg)[0]
        self.marca(cam, m.start(1), m.end(1))
        return m

    def lista(self, pref, padrao, reg, n, so_valor=()):
        """n casamentos; grupo sem nome -> pref.i; grupos nomeados -> pref.i.nome.
        Grupos em `so_valor` vão para o JSON sem virar marcador (ex.: classe CSS)."""
        ms = self._casa(padrao, reg, n)
        for i, m in enumerate(ms):
            nomes = list(m.re.groupindex)
            if not nomes:
                self.marca(f'{pref}.{i}', m.start(1), m.end(1))
            for g in nomes:
                if g in so_valor:
                    poe(self.b, f'{pref}.{i}.{g}', m.group(g))
                else:
                    self.marca(f'{pref}.{i}.{g}', m.start(g), m.end(g))
        return ms

    def aplica(self, ns):
        subs = sorted(self.subs)
        for (a, z, c1), (a2, _, c2) in zip(subs, subs[1:]):
            if z > a2:
                raise SystemExit(f'{self.onde}: {c1} e {c2} se sobrepõem')
        t = self.t
        for a, z, cam in reversed(subs):
            t = t[:a] + '{{' + ns + '.' + cam + '}}' + t[z:]
        if preenche(t, ns, self.b, self.onde) != self.t:
            raise SystemExit(f'{self.onde}: round-trip do marcador falhou')
        return t


# ------------------------------------------------------------------ classes
def classe_comum(ex, nome):
    ex.um('nome', r'<h1 class="class-title">(.*?)</h1>')
    ex.um('atributosChave.texto', r'<div class="label">Atributos</div>\s*<div class="value">(.*?)</div>')
    ex.um('cd.texto', r'<div class="label">CD</div>\s*<div class="value">(.*?)</div>')
    ex.um('estilo', r'<div class="label">Estilo</div>\s*<div class="value">(.*?)</div>')
    if nome == 'espadachim':
        ex.um('treinamento.fixo.texto', r'Treinamentos Iniciais</h4>\s*<p[^>]*>(.*?)</p>')
        ex.um('treinamento.escolha.quantidade', r'\+ Escolha \((.*?)\) dentre:')
        ex.um('treinamento.escolha.opcoesTexto', r'\) dentre: (.*?)\n')
    else:
        ex.um('treinamento.fixo.texto', r'<strong>Você começa treinado em:</strong> (.*?)</p>')
        ex.um('treinamento.escolha.quantidade', r'<strong>Escolha \((.*?)\) perícias:</strong>')
        ex.um('treinamento.escolha.opcoesTexto', r'\) perícias:</strong> (.*?)</p>')
    for k, rot in (('saude', 'Saúde'), ('stamina', 'Stamina'), ('eter', 'Éter'),
                   ('evasaoAtiva', 'Evasão Ativa'), ('evasaoPassiva', 'Evasão Passiva')):
        ex.um(f'status.{k}', rf'<h4>\S+ {rot}</h4>\s*<code>(.*?)</code>')
    if nome == 'espadachim':
        ex.lista('ramos', r'<div class="ramo-section ramo-(?P<chave>[\w-]+)">\s*<div class="ramo-header">\s*'
                          r'<h3>(?P<nome>.*?)</h3>\s*<p>(?P<descricao>.*?)</p>', None, 3, so_valor=('chave',))
    else:
        ex.lista('ramos', r'<div class="ramo-card (?P<chave>[\w-]+)">\s*<h3>(?P<nome>.*?)</h3>\s*'
                          r'<div class="subtitle">(?P<subtitulo>.*?)</div>\s*<p>(?P<descricao>.*?)</p>',
                 None, 3, so_valor=('chave',))


PENDENTE_RECURSO = {
    'id': None, 'nome': None, 'status': 'PENDENTE PEDRO',
    'nota': ('Pedro, 2026-09-26 (docs/ficha-digital/03-respostas-pedro.md): "Tem sim, teurgo também. '
             'Todas têm." O nome e a mecânica ainda não estão no Notion nem no contrato do '
             'balanceamento: campo em aberto, não inventar.')}


def espadachim(ex):
    ex.b['recurso'] = dict(PENDENTE_RECURSO)
    r = ex.regiao(r'<!-- TREINAMENTO -->\s*<div class="proficiency-box">.*?</div>')
    ex.um('caracteristicas.0.nome', r'<h3>(.*?)</h3>', r)
    ex.lista('caracteristicas.0.texto', r'<p>(.*?)</p>', r, 1)
    r = ex.regiao(r'<!-- MARCA DO DUELO -->\s*<div class="proficiency-box">.*?</div>')
    ex.um('caracteristicas.1.nome', r'<h3>(.*?)</h3>', r)
    ex.lista('caracteristicas.1.texto', r'<p>(.*?)</p>', r, 1)
    ex.lista('caracteristicas.1.itens', r'<li>(.*?)</li>', r, 4)
    ex.b['caracteristicas'][1]['escalaDe'] = 'marca-do-duelo'


def teurgo(ex):
    ex.b['recurso'] = dict(PENDENTE_RECURSO)
    r = ex.regiao(r'<div class="escolas-box">.*?<!-- TÉCNICAS -->')
    ex.um('caracteristicas.0.nome', r'<h3>(.*?)</h3>', r)
    ex.um('caracteristicas.0.texto.0', r'<p style="color: var\(--text-secondary\); margin-bottom: 1rem;">\s*(.*?)\s*</p>', r)
    ex.um('caracteristicas.0.texto.1', r'<p style="color: var\(--gold-light\); margin-bottom: 1rem;">\s*<strong>(.*?)</strong>', r)
    ex.um('caracteristicas.0.magiasIniciais', r'<p><strong>Magias Disponíveis:</strong> (.*?)</p>', r)
    ex.lista('caracteristicas.0.escolas', r'<div class="escola-item">\s*<strong>(?P<nome>.*?)</strong>\s*'
                                          r'<span>(?P<descricao>.*?)</span>', r, 5)
    ex.b['caracteristicas'][0]['escalaDe'] = 'escolas'


def monge(ex):
    r = ex.regiao(r'<div class="trait-box">.*?</div>')
    ex.um('caracteristicas.0.nome', r'<h3>(.*?)</h3>', r)
    ex.lista('caracteristicas.0.texto', r'<p style="[^"]*">\s*(.*?)\s*</p>', r, 2)
    r = ex.regiao(r'<!-- FLUXO -->.*?<!-- TÉCNICAS -->')
    ex.um('recurso.nome', r'<h3>🌀 Sistema de (.*?)</h3>', r)
    ex.lista('recurso.texto', r'<p style="color: var\(--text-secondary\); margin-bottom: 1rem;">\s*(.*?)\s*</p>', r, 1)
    ex.lista('recurso.ganhos', r'<div class="fluxo-item">\s*<strong>(?P<rotulo>.*?)</strong><br>\s*'
                               r'<span>(?P<texto>.*?)</span>', r, 4)
    ex.lista('recurso.regras', r'<li>(?!<strong>Máximo)(.*?)</li>', r, 3)
    ex.um('recurso.medidores.0.max', r'<li><strong>Máximo: (.*?)</strong></li>', r)


def batedor(ex):
    r = ex.regiao(r'<!-- INSTINTO -->.*?<!-- RAMOS -->')
    ex.um('recurso.nome', r'<h2>🎯 (.*?)</h2>', r)
    ex.lista('recurso.texto', r'<p>(<strong>Instinto</strong> é a manifestação.*?)</p>', r, 1)
    uls = ex._casa(r'<ul style="[^"]*">.*?</ul>', r, 3)
    ex.lista('recurso.inicio', r'<li>(.*?)</li>', uls[0].span(), 1)
    ex.lista('recurso.ganhos', r'<li>(.*?)</li>', uls[1].span(), 3)
    ex.lista('recurso.perdas', r'<li>(.*?)</li>', uls[2].span(), 4)
    tb = ex.regiao(r'<tbody>.*?</tbody>', r)
    td = r'<td style="[^"]*">'
    ex.lista('recurso.habilidades', rf'<tr>{td}(?P<nome>.*?)</td>{td}(?P<custo>.*?)</td>{td}(?P<descricao>.*?)</td>'
                                    rf'{td}(?P<acao>.*?)</td></tr>', tb, 5)
    ex.um('recurso.medidores.0.max', r'>Máximo: (\S+) Instinto</div>', r)


def brutalista(ex):
    r = ex.regiao(r'<!-- BRUTALIDADE -->.*?<h2>🌿 Ramos</h2>')
    ex.um('recurso.nome', r'<h2>⚡ (.*?)</h2>', r)
    ex.lista('recurso.texto', r'<p style="font-style:italic;[^"]*">(.*?)</p>', r, 1)
    uls = ex._casa(r'<ul style="[^"]*">.*?</ul>', r, 3)
    ex.lista('recurso.ganhos', r'<li>(.*?)</li>', uls[0].span(), 1)
    ex.lista('recurso.efeitoPassivo', r'<li>(.*?)</li>', uls[1].span(), 1)
    ex.lista('recurso.gastoAtivo', r'<li>(.*?)</li>', uls[2].span(), 1)
    ex.um('recurso.medidores.0.max', r'>Máximo: (\S+) Brutalidade</div>', r)
    ex.lista('recurso.perdas', r'color:var\(--text-muted\);">(Você perde toda sua brutalidade[^<]*)</div>', r, 1)


def artilheiro(ex):
    r = ex.regiao(r'<div class="concentracao-box">.*?<h2>⚡ Técnicas</h2>')
    ex.um('recurso.nome', r'<h3>🎯 Sistema de (.*?)</h3>', r)
    ex.lista('recurso.texto', r'<h3>[^<]*</h3>\s*<p style="[^"]*">(.*?)</p>', r, 1)
    ex.um('recurso.medidores.0.max', r'<strong>Concentração máxima: (.*?)</strong>', r)
    itens = ex._casa(r'<div class="concentracao-item">.*?</ul>', r, 2)
    ex.um('recurso.ganhosIntro', r'<p style="[^"]*">(.*?)</p>', itens[0].span())
    ex.lista('recurso.ganhos', r'<li>(.*?)</li>', itens[0].span(), 3)
    ex.um('recurso.perdasIntro', r'<p style="[^"]*">(.*?)</p>', itens[1].span())
    ex.lista('recurso.perdas', r'<li>(.*?)</li>', itens[1].span(), 4)
    fim = (itens[1].end(), r[1])
    ex.lista('recurso.regras', r'<p style="color: var\(--text-secondary\);(?: margin-top: 1rem;)?">(.*?)</p>', fim, 2)


def alquimista(ex):
    r = ex.regiao(r'<div class="reagentes-box">.*?<!-- TÉCNICAS -->')
    ex.um('recurso.nome', r'<h3>🧪 Sistema de (.*?)</h3>', r)
    ex.lista('recurso.texto', r'<p style="color: var\(--text-secondary\); margin-bottom: 1rem;">\s*(.*?)\s*</p>', r, 2)
    ex.um('recurso.medidores.0.max', r'<strong>📦 Máximo:</strong><br>\s*<span style="[^"]*">(.*?)</span>', r)
    ex.lista('recurso.recarga', r'<div class="reagentes-item">\s*<strong>(?P<rotulo>(?!📦).*?)</strong><br>\s*'
                                r'<span style="[^"]*">(?P<texto>.*?)</span>', r, 2)
    ex.um('recurso.regrasTitulo', r'font-family: var\(--font-heading\); margin-bottom: 0\.5rem;">(.*?)</p>', r)
    ex.lista('recurso.regras', r'<li>(.*?)</li>', r, 5)
    # Itens Alquímicos: nível (h4 + faixa de CD) > categoria (category-row) > item
    r = ex.regiao(r'<!-- TABELA DE ITENS ALQUÍMICOS -->.*?<!-- RAMOS -->')
    cab = ex._casa(r'<div class="alchemy-level-header">\s*<h4>(?P<nome>.*?)</h4>\s*'
                   r'<span class="cd-range">(?P<cd>.*?)</span>', r, None)
    total = 0
    for i, m in enumerate(cab):
        ex.marca(f'itensAlquimicos.{i}.nome', m.start('nome'), m.end('nome'))
        ex.marca(f'itensAlquimicos.{i}.faixaCd', m.start('cd'), m.end('cd'))
        nv = (m.end(), cab[i + 1].start() if i + 1 < len(cab) else r[1])
        cats = ex._casa(r'<tr class="category-row"><td colspan="4">(.*?)</td></tr>', nv, None)
        for j, c in enumerate(cats):
            ex.marca(f'itensAlquimicos.{i}.categorias.{j}.nome', c.start(1), c.end(1))
            reg = (c.end(), cats[j + 1].start() if j + 1 < len(cats) else nv[1])
            its = ex._casa(r'<tr>\s*<td class="item-name">(?P<nome>.*?)</td>\s*<td>(?P<efeito>.*?)</td>\s*'
                           r'<td class="reagent-col">(?P<reagentes>.*?)</td>\s*<td class="cd-col">(?P<cd>.*?)</td>\s*</tr>',
                           reg, None)
            if not its:
                raise SystemExit(f'alquimista: categoria {c.group(1)!r} sem item')
            for k, it in enumerate(its):
                for g in ('nome', 'efeito', 'reagentes', 'cd'):
                    ex.marca(f'itensAlquimicos.{i}.categorias.{j}.itens.{k}.{g}', it.start(g), it.end(g))
            total += len(its)
    # nenhuma linha de item fora do que foi lido
    if total != len(ex._casa(r'<td class="item-name">', r, None)):
        raise SystemExit('alquimista: linha de item alquímico fora de categoria')
    return total


ESPECIFICO = {'espadachim': espadachim, 'teurgo': teurgo, 'monge': monge, 'batedor': batedor,
              'brutalista': brutalista, 'artilheiro': artilheiro, 'alquimista': alquimista}

ORDEM_CLASSE = ['id', 'nome', 'atributosChave', 'cd', 'estilo', 'treinamento', 'status', 'V', 'G', 'R',
                'recurso', 'caracteristicas', 'ramos', 'itensAlquimicos']


def ordena(b, ordem):
    return {k: b[k] for k in ordem if k in b} | {k: v for k, v in b.items() if k not in ordem}


def migra_classe(nome):
    ft = os.path.join(RAIZ, 'templates', 'classes', f'{nome}.template.html')
    fj = os.path.join(RAIZ, 'data', 'classes', f'{nome}.json')
    tpl = open(ft, encoding='utf-8').read()
    ex = Ex(tpl, f'classe {nome}')
    classe_comum(ex, nome)
    extra = ESPECIFICO[nome](ex)
    doc = json.load(open(fj, encoding='utf-8'))
    for cam, v in blocos.deriva_classe(nome, ex.b, doc['cards'], tpl):
        poe(ex.b, cam, v)
    novo = ex.aplica('classe')
    doc = {'classe': ordena(ex.b, ORDEM_CLASSE), 'cards': doc['cards']}
    return ft, novo, fj, doc, f'{len(ex.subs)} campos' + (f', {extra} itens alquímicos' if extra else '')


# ------------------------------------------------------------------ raças
ORDEM_RACA = ['id', 'nome', 'atributos', 'alternativo', 'movimento', 'idiomas', 'pericias', 'vida',
              'altura', 'peso', 'caracteristicas', 'tecnica', 'variantes', 'arNatural', 'tecnologias', 'corrupcao']
PENDENTE_TECNICA = {
    'id': None, 'status': 'PENDENTE',
    'nota': ('Pedro (03-respostas-pedro.md §2): a raça dá "1 técnica de raça". A página não '
             'distingue qual característica é a técnica: pergunta ao balanceamento, não inventar.')}


def migra_raca(nome):
    ft = os.path.join(RAIZ, 'templates', 'racas', f'{nome}.template.html')
    fj = os.path.join(RAIZ, 'data', 'racas', f'{nome}.json')
    tpl = open(ft, encoding='utf-8').read()
    ex = Ex(tpl, f'raça {nome}')
    ex.um('nome', r'<div class="raca-info">\s*<h1>(.*?)</h1>')
    sb = r'<div class="label">{}</div>\s*<div class="value">(.*?)</div>'
    ex.um('atributos.texto', sb.format('Atributos'))
    if '>Alternativo<' in tpl:
        ex.um('alternativo.texto', sb.format('Alternativo'))
    ex.um('movimento.texto', sb.format('Movimento'))
    if '>Idiomas<' in tpl:
        ex.um('idiomas.texto', sb.format('Idiomas'))
    if '>Perícia</div>' in tpl:                       # Inseto, Autômato: perícia no stat-box
        ex.um('pericias.itens.0.texto', sb.format('Perícia'))
    else:
        r = ex.regiao(r'Perícias de Raça</h3>\s*<div class="content-card">.*?</div>')
        if '<ul>' in tpl[r[0]:r[1]]:
            ex.lista('pericias.itens', r'<li>(?P<texto>.*?)</li>', r, None)
        else:
            ex.lista('pericias.itens', r'<p>(?P<texto>.*?)</p>', r, 1)
    for k, rot in (('vida', 'Vida'), ('altura', 'Altura'), ('peso', 'Peso')):
        if f'<strong>{rot}:</strong>' in tpl:
            ex.um(k, rf'<span><strong>{rot}:</strong> (.*?)</span>')
    ex.b['tecnica'] = dict(PENDENTE_TECNICA)
    if nome in ('humano', 'anao', 'dryad', 'gruto', 'inseto'):
        m = ex.um('variantes.titulo', r'<div class="variant-section">\s*<h3>(.*?)</h3>')
        intro = re.compile(r'\s*<p style="[^"]*">(.*?)</p>', re.S).match(tpl, m.end())
        if intro:
            ex.marca('variantes.intro', intro.start(1), intro.end(1))
    if nome == 'automato':
        r = ex.regiao(r'<div class="variant-section">.*$')
        ex.um('tecnologias.titulo', r'<h3>(.*?)</h3>', r)
        ex.um('tecnologias.iniciais', r'<p style="[^"]*"><strong>(.*?)</strong> Limite', r)
        ex.um('tecnologias.limite', r'Limite de tecnologias equipadas: <strong>(.*?)</strong>', r)
        ex.um('tecnologias.substituicao', r'<p style="color: var\(--text-muted\); margin-bottom: 1rem;">(.*?)</p>', r)
        ex.lista('tecnologias.tiers', r'<div class="tier-header">(?P<titulo>.*?)</div>', r, 5)
    if nome == 'corrompido':
        r = ex.regiao(r'<div class="variant-section">.*$')
        ex.um('corrupcao.titulo', r'<h3>(.*?)</h3>', r)
        ex.um('corrupcao.intro', r'<p class="corrupcao-intro">(.*?)</p>', r)
        tm = ex.regiao(r'<table class="corr-max">.*?</table>', r)
        ex.lista('corrupcao.maximoPorNivel', r'<tr><td>(?P<nivel>.*?)</td><td>(?P<maximo>.*?)</td></tr>', tm, 5)
        for g, css in (('poderes', 'poder'), ('adversidades', 'adv')):
            rb = ex.regiao(rf'<div class="corr-block {css}">.*?</table>', r)
            ex.um(f'corrupcao.{g}.titulo', r'<span class="dot"></span>(.*?)</div>', rb)
            ex.lista(f'corrupcao.{g}.itens', r'<tr><td>(?P<nome>[^<]*)</td><td>(?P<efeito>.*?)</td>'
                                             r'<td><span class="corr-cost \w+">(?P<custo>.*?)</span></td></tr>', rb, 15)
    doc = json.load(open(fj, encoding='utf-8'))
    for cam, v in blocos.deriva_raca(nome, ex.b, doc['cards'], ex.aplica('raca')):
        poe(ex.b, cam, v)
    novo = ex.aplica('raca')
    doc = {'source': doc['source'], 'raca': ordena(ex.b, ORDEM_RACA), 'cards': doc['cards']}
    return ft, novo, fj, doc, f'{len(ex.subs)} campos'


# ------------------------------------------------------------------ origens
ORDEM_ORIGEM = ['sins', 'treinamento', 'itensIniciais', 'habilidade']


def migra_origens():
    fj = os.path.join(RAIZ, 'data', 'origens.json')
    doc = json.load(open(fj, encoding='utf-8'))
    bazar = blocos._nomes_bazar(RAIZ)
    n = 0
    for card in doc['cards']:
        ex = Ex(card['corpo'], card['id'])
        ex.um('sins', r'<span class="origem-sins">💰 (.*?)</span>')
        ex.um('treinamento.texto', r'Treinamento</h4>\s*<p>(.*?)</p>')
        r = ex.regiao(r'Itens Iniciais</h4>\s*<ul>.*?</ul>')
        if ex.t.count('<ul', r[0] + 1, r[1]) != 1:
            raise SystemExit(f'{card["id"]}: lista de itens aninhada')
        ex.lista('itensIniciais', r'<li>(?P<texto>.*?)</li>', r, None)
        m = ex._casa(r'<div class="habilidade-box">\s*<h4>(?P<nome>.*?)</h4>\s*(?P<texto>.*?)\s*</div>\s*</div>\s*$')[0]
        for g in ('nome', 'texto'):
            ex.marca(f'habilidade.{g}', m.start(g), m.end(g))
        for cam, v in blocos.deriva_origem(card, ex.b, bazar):
            poe(ex.b, cam, v)
        card['corpo'] = ex.aplica('origem')
        card['origem'] = ordena(ex.b, ORDEM_ORIGEM)
        n += len(ex.subs)
    return fj, doc, n


def main():
    for c in CLASSES:
        if '{{classe.' in open(os.path.join(RAIZ, 'templates', 'classes', f'{c}.template.html'), encoding='utf-8').read():
            raise SystemExit('migrar_f1b: já migrado (template com {{classe.…}}). Edite data/ e rode build.py.')
    saidas = []
    for c in CLASSES:
        ft, novo, fj, doc, info = migra_classe(c)
        saidas.append((ft, novo, fj, doc))
        print(f'classe {c}: {info}')
    for r in RACAS:
        ft, novo, fj, doc, info = migra_raca(r)
        saidas.append((ft, novo, fj, doc))
        print(f'raça {r}: {info}')
    fj, doc, n = migra_origens()
    print(f'origens: {len(doc["cards"])} cards, {n} campos')
    for ft, novo, fj2, d in saidas:
        with open(ft, 'w', encoding='utf-8', newline='\n') as fh:
            fh.write(novo)
        blocos._grava(fj2, d)
    blocos._grava(fj, doc)


if __name__ == '__main__':
    try:
        sys.stdout.reconfigure(errors='replace')
    except (AttributeError, ValueError):
        pass
    main()
