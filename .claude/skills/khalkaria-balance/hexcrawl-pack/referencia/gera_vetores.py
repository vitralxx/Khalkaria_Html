"""Gera testes/vetores-regras.json a partir do núcleo de referência.

Os vetores valem para qualquer linguagem: entrada -> saída esperada. A exceção é "montagemPython", que
depende do gerador random.Random do Python e só vale para um backend em Python.
Uso: python referencia/gera_vetores.py <pasta-do-pack>
"""
import json
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hexcrawl_ref import hexmath as hm  # noqa: E402
from hexcrawl_ref import regras as rg  # noqa: E402
from hexcrawl_ref import tabela as tb  # noqa: E402
from hexcrawl_ref import visao  # noqa: E402

PACK = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..')
num = lambda f: float(f) if f is not None else None

v = {'schemaVersion': 'hexcrawl-vetores/1',
     '_doc': 'Gerado por referencia/gera_vetores.py a partir de referencia/hexcrawl_ref. Não editar à mão.'}

# hexmath
hexes = ['0101', '0201', '0102', '0505', '1010', '3026']
v['vizinhos'] = [{'hex': h, 'dir': d, 'esperado': hm.vizinho(h, d)} for h in hexes for d in hm.DIRECOES]
v['arestaCanonica'] = [{'hex': h, 'dir': d, 'esperado': hm.chave_aresta(h, d)}
                       for h in ('0505', '0606', '1010') for d in hm.DIRECOES]
v['extremosAresta'] = [{'hex': h, 'dir': d, 'esperado': [list(p) for p in hm.extremos_aresta_px(h, d)]}
                       for h in ('0101', '0201', '0505') for d in hm.DIRECOES]
v['geometria'] = [{'hex': h, 'origemFace': list(hm.origem_face(h)), 'centro': list(hm.centro_px(h)),
                   'origemCelula': list(hm.origem_celula(h))} for h in hexes]
v['distancia'] = [{'a': a, 'b': b, 'esperado': hm.distancia(a, b)}
                  for a, b in (('0101', '0301'), ('0101', '0907'), ('1010', '1014'), ('0505', '1203'))]
v['linha'] = [{'a': a, 'b': b, 'esperado': hm.linha(a, b)} for a, b in (('0101', '0907'), ('1010', '1504'))]
v['alcance'] = [{'hex': '1010', 'raio': r, 'colunas': 30, 'linhas': 26, 'quantos': len(hm.alcance('1010', r, 30, 26))}
                for r in (0, 1, 2, 3)]

# relógio do dia
v['periodo'] = [{'restante': r, 'orcamento': b, 'esperado': rg.periodo(r, b)}
                for b in (9, 7.5, 10.5) for r in (b, b - 1.5, b * 2 / 3, b / 3, 1.5, 0)]


def roteiro(orcamento, passos, divida=0):
    """Cada passo registra o relógio e o protocolo de paradas (docs/01 §3.3 e §4.1)."""
    d = rg.novo_dia(orcamento, divida)
    saida = []
    for p in passos:
        antes = d.periodo
        if p[0] == 'entrar':
            ok = rg.pode_entrar(d, p[1])
            if ok:
                r = rg.andar(d, 'x', p[1])
            else:
                r = {'encerrados': [], 'parada': False, 'fimDoDia': False}
            saida.append({'acao': 'entrar', 'custo': p[1], 'pode': ok, 'restante': num(d.restante),
                          'periodo': d.periodo, 'divida': num(d.divida), **r})
        elif p[0] == 'explorar':
            rg.explorar(d, 'x')
            saida.append({'acao': 'explorar', 'restante': num(d.restante), 'periodo': d.periodo,
                          'encerrados': rg.periodos_encerrados(antes, d.periodo), 'parada': True,
                          'fimDoDia': d.periodo == 'descanso'})
        elif p[0] == 'encerrar':
            rg.encerrar_dia(d)
            saida.append({'acao': 'encerrar', 'restante': num(d.restante), 'periodo': d.periodo,
                          'encerrados': rg.periodos_encerrados(antes, d.periodo), 'parada': True,
                          'fimDoDia': True})
    return {'orcamento': orcamento, 'dividaInicial': divida, 'passos': saida}


v['roteirosDoDia'] = [
    roteiro(9, [('entrar', 4.5), ('entrar', 4.5)]),
    roteiro(9, [('entrar', 3), ('entrar', 3), ('entrar', 3)]),
    roteiro(9, [('entrar', 1.5)] * 7),
    roteiro(9, [('explorar',), ('entrar', 4.5), ('explorar',)]),
    roteiro(9, [('entrar', 6), ('entrar', 6), ('explorar',)]),
    roteiro(6, [('entrar', 9)]),
    roteiro(6, [('entrar', 1.5), ('entrar', 9)]),
    roteiro(6, [('entrar', 4.5)], divida=3),
    roteiro(10.5, [('entrar', 7.5), ('encerrar',)]),
    roteiro(9, [('entrar', 1.5), ('entrar', 1.5), ('entrar', 1.5), ('explorar',), ('entrar', 1.5), ('entrar', 1.5)]),
]
v['periodosEncerrados'] = [{'antes': a, 'depois': b, 'esperado': rg.periodos_encerrados(a, b)}
                           for a in rg.ORDEM_DO_DIA for b in rg.ORDEM_DO_DIA]
v['hostilidadeDaParada'] = [{'trecho': tr, 'hexAtual': h, 'esperado': rg.hostilidade_da_parada(tr, h)}
                            for tr, h in (([], 10), ([5], 10), ([5, 15, 10], 5), ([20, 20], 0))]
v['custoDoPasso'] = [{'custoHex': c, 'via': via, 'esperado': num(rg.custo_do_passo(c, via))}
                     for c in (4.5, 9) for via in (None, 'estrada', 'trilha')]

# embarcações (custos do mundo de Kharavel)
mundo_kh = json.load(open(os.path.join(PACK, 'dados', 'kharavel', 'mundo', 'mundo.json'), encoding='utf-8'))
v['custoEmbarcado'] = [{'embarcacao': b['id'], 'naAgua': agua, 'esperado': num(rg.custo_embarcado(b, agua))}
                       for b in mundo_kh['embarcacoes'] for agua in (False, True)]

# Jornada, rio, extração, descanso, consequências
v['metaJornada'] = [{'hostilidade': h, 'esperado': rg.meta_jornada(h)} for h in (0, 5, 10, 15, 20)]
v['pontosDaAcao'] = [{'resultado': r, 'guiar': g, 'esperado': rg.pontos_da_acao(r, g)}
                     for r in (14, 15, 19, 20, 25, 31) for g in (True, False)]
v['consequencia'] = [{'d100': d, 'hostilidade': h, 'esperado': rg.consequencia(d, h)}
                     for h in (5, 20) for d in (1, 2, 19, 20, 39, 40, 59, 60, 79, 80, 99, 100)]
v['cdRio'] = [{'hostilidade': h, 'esperado': rg.cd_rio(h)} for h in (5, 10, 15, 20)]
v['unidadesExtraidas'] = [{'resultado': r, 'raridade': rar, 'esperado': rg.unidades_extraidas(r, rar)}
                          for rar in rg.CD_POR_RARIDADE for r in (9, 13, 16, 20, 21, 26, 30)]
v['comodidade'] = [{'melhorSobrevivencia': r, 'bonus': b, 'esperado': rg.comodidade_ao_ar_livre(r, b)}
                   for r in (10, 15, 19, 20, 25, 30, 35) for b in (0, 1)]

# tabelas
eventos = [{'id': f'e{i}', 'categoria': c, 'raridade': rar, 'polaridade': pol, 'tipos': ['campos']}
           for i, (c, rar, pol) in enumerate([
               ('extracao', 'comum', 'favoravel'), ('combate', 'comum', 'adverso'), ('interacao', 'comum', 'neutro'),
               ('ruina', 'notavel', 'neutro'), ('covil', 'notavel', 'adverso'), ('achado', 'raro', 'favoravel')])]
por_id = {e['id']: e for e in eventos}
tabela = [{'evento': e['id'], 'peso': tb.PESOS_PADRAO[e['raridade']]} for e in eventos]
v['faixasD100'] = {'eventos': eventos, 'tabela': tabela,
                   'casos': [{'extracoesNoDia': k, 'esperado': tb.faixas_d100(tabela, por_id, k)} for k in (0, 1, 3)]}
montagem = {'entradas': [8, 12], 'mistura': {'favoravel': 0.33, 'neutro': 0.34, 'adverso': 0.33},
            'variacao': 0.10, 'pesos': tb.PESOS_PADRAO}
pool = [{'id': f'p{i:02d}', 'categoria': 'combate', 'raridade': ('comum', 'notavel', 'raro')[i % 3],
         'polaridade': ('favoravel', 'neutro', 'adverso')[(i // 3) % 3], 'tipos': ['campos', 'floresta']}
        for i in range(27)]
v['montagemPython'] = {'_doc': 'só vale com random.Random(semente) do Python', 'pool': pool, 'montagem': montagem,
                       'casos': [{'semente': s, 'tipo': 'campos',
                                  'esperado': tb.montar_tabela(pool, 'campos', montagem, random.Random(s))}
                                 for s in (1, 2, 3)]}

# visão
pen = {hm.chave_aresta('1010', 'N'): hm.vizinho('1010', 'N')}
v['visao'] = [
    {'origem': '1010', 'raio': 1, 'penhascos': {}, 'esperado': sorted(visao.visiveis('1010', 1, 30, 26, {}))},
    {'origem': '1010', 'raio': 1, 'penhascos': pen, 'esperado': sorted(visao.visiveis('1010', 1, 30, 26, pen))},
    {'origem': '1009', 'raio': 1, 'penhascos': pen, 'esperado': sorted(visao.visiveis('1009', 1, 30, 26, pen))},
    {'origem': '1010', 'raio': 2, 'penhascos': pen, 'esperado': sorted(visao.visiveis('1010', 2, 30, 26, pen))},
]
v['visaoNaAresta'] = [{'aresta': k, 'colunas': 30, 'linhas': 26, 'esperado': sorted(visao.visiveis_na_aresta(k, 30, 26))}
                      for k in ('1010:N', '1010:NE', '1010:SE', '0101:N', '3026:SE')]

saida = os.path.join(PACK, 'testes', 'vetores-regras.json')
with open(saida, 'w', encoding='utf-8', newline='\n') as fh:
    json.dump(v, fh, ensure_ascii=False, indent=1)
    fh.write('\n')
print('ok', saida, sum(len(x) if isinstance(x, list) else 1 for x in v.values()), 'grupos/casos')
