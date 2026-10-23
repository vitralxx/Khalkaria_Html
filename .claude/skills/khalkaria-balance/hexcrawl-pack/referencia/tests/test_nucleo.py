"""Testes do núcleo de referência. Rode na pasta referencia/: python -m pytest -q"""
import os
import random
import sys
from fractions import Fraction

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from hexcrawl_ref import hexmath as hm  # noqa: E402
from hexcrawl_ref import regras as rg  # noqa: E402
from hexcrawl_ref import tabela as tb  # noqa: E402
from hexcrawl_ref import visao  # noqa: E402
from hexcrawl_ref import validador  # noqa: E402

PACK = os.path.join(os.path.dirname(__file__), '..', '..')
C, L = 30, 26


# ---------------------------------------------------------------- hexmath
def test_ids_e_conversoes_ida_e_volta():
    for c in range(1, C + 1):
        for l in range(1, L + 1):
            h = hm.id_de(c, l)
            assert hm.col_lin(h) == (c, l)
            assert hm.de_axial(*hm.axial(h)) == h


@pytest.mark.parametrize('h,d,esperado', [
    ('0101', 'SE', '0201'), ('0201', 'S', '0202'), ('0102', 'NE', '0201'), ('0201', 'SO', '0102'),
    ('0201', 'NO', '0101'), ('0505', 'N', '0504'), ('0505', 'S', '0506'),
])
def test_vizinhos_conhecidos(h, d, esperado):
    assert hm.vizinho(h, d) == esperado


def test_vizinhanca_simetrica_e_direcao():
    for c in range(1, C + 1):
        for l in range(1, L + 1):
            h = hm.id_de(c, l)
            for d, v in hm.vizinhos(h, C, L).items():
                assert hm.vizinho(v, hm.OPOSTA[d]) == h
                assert hm.direcao_entre(h, v) == d
                assert hm.distancia(h, v) == 1


def test_aresta_canonica_e_vertices_compartilhados():
    assert hm.chave_aresta('0201', 'SO') == hm.chave_aresta('0102', 'NE') == '0102:NE'
    for c in range(1, C + 1):
        for l in range(1, L + 1):
            h = hm.id_de(c, l)
            for d, v in hm.vizinhos(h, C, L).items():
                a = set(hm.extremos_aresta_px(h, d))
                b = set(hm.extremos_aresta_px(v, hm.OPOSTA[d]))
                assert a == b, (h, d)


def test_alcance_e_linha():
    assert len(hm.alcance('1010', 1, C, L)) == 7
    assert len(hm.alcance('1010', 2, C, L)) == 19
    assert len(hm.alcance('1010', 3, C, L)) == 37
    ln = hm.linha('0101', '0907')
    assert len(ln) == hm.distancia('0101', '0907') + 1
    assert all(hm.distancia(a, b) == 1 for a, b in zip(ln, ln[1:]))


def test_geometria_da_arte():
    assert hm.origem_face('0101') == (0, 0)
    assert hm.origem_face('0201') == (24, 14)       # coluna par (1-based) desce 14 px
    assert hm.origem_face('0102') == (0, 28)
    assert hm.centro_px('0101') == (16, 14)
    assert hm.origem_celula('0101') == (0, -18)     # a célula 32x48 começa 18 px acima da face


# ---------------------------------------------------------------- movimento e relógio do dia
@pytest.mark.parametrize('r,p', [(9, 'manha'), (7.5, 'manha'), (6, 'tarde'), (4.5, 'tarde'), (3, 'noite'),
                                 (1.5, 'noite'), (0, 'descanso')])
def test_periodos_com_9m(r, p):
    assert rg.periodo(r, 9) == p


def test_exemplos_do_pedro_com_9m():
    # Campos: 2 hexes
    d = rg.novo_dia(9)
    rg.entrar(d, 'a', 4.5); assert d.periodo == 'tarde'
    rg.entrar(d, 'b', 4.5); assert d.periodo == 'descanso'
    # Trilha: 3 hexes
    d = rg.novo_dia(9)
    for i, p in enumerate(('tarde', 'noite', 'descanso')):
        rg.entrar(d, str(i), rg.custo_do_passo(6, 'trilha')); assert d.periodo == p
    # Estrada: 6 hexes
    d = rg.novo_dia(9)
    for i in range(6):
        assert rg.pode_entrar(d, rg.CUSTO_ESTRADA)
        rg.entrar(d, str(i), rg.CUSTO_ESTRADA)
    assert d.periodo == 'descanso' and not rg.pode_entrar(d, rg.CUSTO_ESTRADA)


def test_explorar_pula_periodo():
    d = rg.novo_dia(9); rg.explorar(d, 'x'); assert (d.periodo, d.restante) == ('tarde', 6)
    d = rg.novo_dia(9); rg.entrar(d, 'a', 1.5); rg.explorar(d, 'x'); assert (d.periodo, d.restante) == ('tarde', 6)
    d = rg.novo_dia(9); rg.entrar(d, 'a', 4.5); rg.explorar(d, 'x'); assert (d.periodo, d.restante) == ('noite', 3)
    d = rg.novo_dia(9); rg.entrar(d, 'a', 7.5); rg.explorar(d, 'x'); assert d.periodo == 'descanso'


def test_hex_mais_caro_que_o_orcamento():
    d = rg.novo_dia(6)
    assert rg.pode_entrar(d, 9)                 # de manhã, com o orçamento cheio
    rg.entrar(d, 'montanha', 9)
    assert d.periodo == 'descanso' and d.divida == 3
    d2 = rg.novo_dia(6, d.divida)
    assert d2.restante == 3 and d2.periodo == 'tarde'
    d3 = rg.novo_dia(6); rg.entrar(d3, 'a', 1.5)
    assert not rg.pode_entrar(d3, 9)            # sem o orçamento cheio, não começa


def test_contas_exatas_em_fracao():
    d = rg.novo_dia(7.5)
    assert d.orcamento * 2 / 3 == Fraction(5) and d.orcamento / 3 == Fraction(5, 2)


# ---------------------------------------------------------------- Jornada, rio, extração, descanso
def test_jornada():
    assert [rg.meta_jornada(h) for h in (5, 10, 15, 20)] == [4, 5, 6, 7]
    assert rg.hostilidade_do_dia([]) is None and rg.hostilidade_do_dia([5, 15, 10]) == 15
    assert rg.pontos_da_acao(15, True) == 2 and rg.pontos_da_acao(20, True) == 3
    assert rg.pontos_da_acao(14, False) == 0 and rg.pontos_da_acao(19, False) == 1


@pytest.mark.parametrize('d100,saude,stamina', [
    (1, '4d6+10', '4d6+10'), (2, '2d8+10', '2d8+10'), (39, '2d6+10', '2d6+10'), (40, None, '1d6+10'),
    (79, None, '1d4+10'), (85, None, '10'), (100, None, None)])
def test_consequencias(d100, saude, stamina):
    c = rg.consequencia(d100, 10)
    assert (c['saude'], c['stamina']) == (saude, stamina)


def test_rio_extracao_descanso():
    assert [rg.cd_rio(h) for h in (5, 10, 15, 20)] == [12, 15, 17, 20]
    assert rg.unidades_extraidas(9, 'Ordinário') == 0
    assert rg.unidades_extraidas(12, 'Ordinário') == 1
    assert rg.unidades_extraidas(15, 'Ordinário') == 2
    assert rg.unidades_extraidas(25, 'Luxária') == 2
    assert rg.fator_extracao(0) == 1 and rg.fator_extracao(2) == 0.25
    assert [rg.comodidade_ao_ar_livre(x) for x in (14, 15, 22, 27, 31)] == [1, 2, 3, 4, 5]
    assert rg.comodidade_ao_ar_livre(31, bonus=1) == 5 and rg.comodidade_ao_ar_livre(22, bonus=1) == 4


# ---------------------------------------------------------------- tabelas
def _pool():
    cats = ['extracao', 'combate', 'interacao', 'comerciante', 'abrigo', 'ruina', 'assentamento', 'covil', 'achado']
    out = []
    for i in range(30):
        rar = 'comum' if i % 3 == 0 else 'notavel' if i % 3 == 1 else 'raro'
        cat = cats[i % len(cats)]
        if cat == 'abrigo':
            rar = 'comum'
        out.append({'id': f'r-{i:02d}', 'categoria': cat, 'raridade': rar,
                    'polaridade': ('favoravel', 'neutro', 'adverso')[i % 3],
                    'tipos': ['campos'] if i % 5 else ['floresta'], 'marca': cat == 'abrigo' or rar != 'comum'})
    return out


MONTAGEM = {'entradas': [8, 12], 'mistura': {'favoravel': 0.33, 'neutro': 0.34, 'adverso': 0.33},
            'variacao': 0.10, 'pesos': {'comum': 5, 'notavel': 3, 'raro': 1}}


def test_montagem_deterministica_e_filtrada():
    pool = _pool()
    a = tb.montar_tabela(pool, 'campos', MONTAGEM, random.Random(7))
    b = tb.montar_tabela(pool, 'campos', MONTAGEM, random.Random(7))
    assert a == b and 8 <= len(a) <= 12
    por_id = {e['id']: e for e in pool}
    assert all('campos' in por_id[x['evento']]['tipos'] for x in a)
    c = tb.montar_tabela(pool, 'campos', MONTAGEM, random.Random(7), consumidos={a[0]['evento']})
    assert a[0]['evento'] not in {x['evento'] for x in c}


def test_mistura_extrema():
    pool = _pool()
    so_adverso = dict(MONTAGEM, mistura={'favoravel': 0, 'neutro': 0, 'adverso': 1}, variacao=0)
    t = tb.montar_tabela(pool, 'campos', so_adverso, random.Random(1))
    por_id = {e['id']: e for e in pool}
    adversos = [e for e in pool if e['polaridade'] == 'adverso' and 'campos' in e['tipos']]
    assert sum(por_id[x['evento']]['polaridade'] == 'adverso' for x in t) == min(len(t), len(adversos))


def test_faixas_cobrem_1_a_100():
    pool = _pool()
    por_id = {e['id']: e for e in pool}
    for s in range(20):
        t = tb.montar_tabela(pool, 'campos', MONTAGEM, random.Random(s))
        f = tb.faixas_d100(t, por_id)
        assert f[0]['de'] == 1 and f[-1]['ate'] == 100
        assert all(x['ate'] >= x['de'] for x in f)
        assert all(b['de'] == a['ate'] + 1 for a, b in zip(f, f[1:]))


def test_vies_da_extracao_encolhe_a_faixa():
    pool = [{'id': 'x', 'categoria': 'extracao', 'raridade': 'comum', 'polaridade': 'favoravel', 'tipos': ['campos']},
            {'id': 'y', 'categoria': 'combate', 'raridade': 'comum', 'polaridade': 'adverso', 'tipos': ['campos']}]
    por_id = {e['id']: e for e in pool}
    t = [{'evento': 'x', 'peso': 5}, {'evento': 'y', 'peso': 5}]
    tam = lambda k: next(f['ate'] - f['de'] + 1 for f in tb.faixas_d100(t, por_id, k) if f['evento'] == 'x')
    assert tam(0) == 50 and tam(1) < tam(0) and tam(2) < tam(1)


def test_aplicar_resultado():
    pool = _pool()
    por_id = {e['id']: e for e in pool}
    notavel = next(e for e in pool if e['raridade'] == 'notavel')
    comum = next(e for e in pool if e['raridade'] == 'comum' and not e['marca'])
    abrigo = next(e for e in pool if e['categoria'] == 'abrigo')
    estado = {'tabelas': {'0101': {'entradas': [{'evento': notavel['id'], 'peso': 3}, {'evento': comum['id'], 'peso': 5}]},
                          '0202': {'entradas': [{'evento': notavel['id'], 'peso': 3}]}}}
    tb.aplicar_resultado(notavel['id'], '0101', por_id, estado)
    assert estado['definidos']['0101'] == notavel['id'] and notavel['id'] in estado['consumidos']
    assert all(notavel['id'] not in [x['evento'] for x in t['entradas']] for t in estado['tabelas'].values())
    tb.aplicar_resultado(comum['id'], '0303', por_id, estado)
    assert '0303' not in estado['definidos'] and estado['revelados']['0303'] == [comum['id']]
    tb.aplicar_resultado(abrigo['id'], '0404', por_id, estado)
    assert estado['definidos']['0404'] == abrigo['id'] and abrigo['id'] not in estado['consumidos']
    assert not tb.pode_rolar('0101', estado, {}) and tb.pode_rolar('0303', estado, {})
    assert not tb.pode_rolar('0505', estado, {'especial': {'id': 'x'}})


# ---------------------------------------------------------------- visão
def test_visao_raio_e_penhasco():
    assert len(visao.visiveis('1010', 1, C, L, {})) == 7
    assert visao.visiveis('1010', 0, C, L, {}) == {'1010'}
    alto = hm.vizinho('1010', 'N')
    pen = {hm.chave_aresta('1010', 'N'): alto}
    assert alto not in visao.visiveis('1010', 1, C, L, pen)       # de baixo, o penhasco tapa
    assert '1010' in visao.visiveis(alto, 1, C, L, pen)            # do alto, enxerga
    assert visao.estado_nevoa('a', {'a'}, set()) == 'visto'
    assert visao.estado_nevoa('a', set(), {'a'}) == 'visivel'
    assert visao.estado_nevoa('a', set(), set()) == 'oculto'


# ---------------------------------------------------------------- mundo de exemplo
def test_mundo_de_exemplo_valido():
    m = validador.carregar(os.path.join(PACK, 'dados', 'exemplo', 'mundo'))
    falhas, avisos, resumo = validador.validar(m)
    assert falhas == [], falhas
    assert resumo['hexes'] == 12 * 9


def test_validador_pega_erros():
    import copy
    base = validador.carregar(os.path.join(PACK, 'dados', 'exemplo', 'mundo'))
    def falhas_com(mexe):
        m = copy.deepcopy(base); mexe(m); return validador.validar(m)[0]
    assert any('[via]' in f and 'vizinhos' in f for f in falhas_com(
        lambda m: m['vias']['vias'][0]['hexes'].insert(1, '0909')))
    assert any('não encosta na anterior' in f for f in falhas_com(
        lambda m: m['rios']['rios'][0]['arestas'].insert(1, '0303:NE')))
    assert any('ladoAlto' in f for f in falhas_com(
        lambda m: next(a for a in m['arestas']['arestas'] if a['tipo'] == 'penhasco').update(ladoAlto='0101')))
    assert any('não é aresta de rio' in f for f in falhas_com(
        lambda m: m['arestas']['arestas'].append({'aresta': '0303:N', 'tipo': 'ponte'})))
    assert any('exatamente um' in f for f in falhas_com(
        lambda m: m['hexes']['hexes'][30].update(regiao=None, cidade=None)))
