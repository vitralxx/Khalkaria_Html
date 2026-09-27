# -*- coding: utf-8 -*-
"""Testes da F1e: tools/normaliza.py (magias, Limiar, perícias), a leitura de
ramo/tier/custo dos cards de classe (tools/blocos.py) e o artefato
data/pericias.json. Um fixture por formato de `acoes` (plano, F1e)."""
import json, os, sys, unittest

TOOLS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAIZ = os.path.dirname(TOOLS)
sys.path.insert(0, TOOLS)
import normaliza                               # noqa: E402
import blocos                                  # noqa: E402

def _json(*partes):
    with open(os.path.join(RAIZ, *partes), encoding='utf-8') as fh:
        return json.load(fh)


T4 = normaliza.INTENSIDADES
T3 = T4[1:]


class Acoes(unittest.TestCase):
    CASOS = [
        ('1 Ação', {'formato': 'acoes', 'n': 1}),
        ('3 ações', {'formato': 'acoes', 'n': 3}),
        ('6 Ações (2 Rodadas)', {'formato': 'acoesEmRodadas', 'n': 6, 'rodadas': 2}),
        ('Reação', {'formato': 'reacao'}),
        ('Ação Livre', {'formato': 'livre'}),
        ('10 minutos', {'formato': 'minutos', 'minutos': 10}),
        ('1 Minuto', {'formato': 'minutos', 'minutos': 1}),
        ('1 Descanso Longo', {'formato': 'descansoLongo', 'descansos': 1}),
    ]

    def test_um_fixture_por_formato(self):
        self.assertEqual({f for f, _, _ in normaliza.FORMATOS_ACAO}, {c[1]['formato'] for c in self.CASOS})
        for v, esperado in self.CASOS:
            self.assertEqual(normaliza.acoes(v), {'texto': v, **esperado}, v)

    def test_formato_desconhecido_derruba(self):
        with self.assertRaises(ValueError):
            normaliza.acoes('Meia Ação')


class Intensidades(unittest.TestCase):
    def test_nivel1_sem_contida(self):
        self.assertEqual(normaliza.intensidades_permitidas(1, []), (T3, None))
        self.assertEqual(normaliza.intensidades_permitidas(3, []), (T4, None))

    def test_restricao_do_stat(self):
        st = [{'caracteristica': 'Intensidade', 'valor': 'Normal ou Acima'}]
        self.assertEqual(normaliza.intensidades_permitidas(5, st), (T3, 'Normal ou Acima'))
        st = [{'caracteristica': 'Intensidade', 'valor': 'Apenas Normal'}]
        self.assertEqual(normaliza.intensidades_permitidas(1, st)[0], ['normal'])

    def test_restricao_desconhecida_derruba(self):
        with self.assertRaises(ValueError):
            normaliza.intensidades_permitidas(2, [{'caracteristica': 'Intensidade', 'valor': 'Quase Normal'}])

    def test_restricao_da_descricao(self):
        d = 'Toca. Essa magia só pode ser canalizada na <strong>Intensidade:</strong> <em>Normal</em> ou acima.'
        self.assertEqual(normaliza.intensidades_permitidas(2, [], d),
                         (T3, 'Essa magia só pode ser canalizada na Intensidade: Normal ou acima'))
        d = 'Requisito: Deve canalizar com intensidade: Transbordante'
        self.assertEqual(normaliza.intensidades_permitidas(4, [], d)[0], ['transbordante'])
        d = 'Esta magia só pode ser conjurada na intensidade <strong>Normal</strong>.'
        self.assertEqual(normaliza.intensidades_permitidas(2, [], d)[0], ['normal'])

    def test_frase_condicional_nao_restringe(self):
        d = 'Na intensidade Contida, o morto só responde sim ou não.'
        self.assertEqual(normaliza.intensidades_permitidas(4, [], d), (T4, None))

    def test_stat_e_descricao_que_divergem_derrubam(self):
        st = [{'caracteristica': 'Intensidade', 'valor': 'Apenas Transbordante'}]
        with self.assertRaises(ValueError):
            normaliza.intensidades_permitidas(5, st, 'Essa magia só pode ser canalizada na Intensidade: Normal')
        d = 'Essa magia só pode ser canalizada na Intensidade: Transbordante'
        self.assertEqual(normaliza.intensidades_permitidas(5, st, d), (['transbordante'], 'Apenas Transbordante'))

    def test_frase_fora_da_tabela_derruba(self):
        with self.assertRaises(ValueError):
            normaliza.intensidades_permitidas(3, [], 'Só pode ser usada apenas na intensidade Forçada.')

    # Magias sem stat "Intensidade" cuja descrição restringe (achadas por script; revisão da F1e)
    SO_DESCRICAO = {
        'magia-santuario-menor': T3, 'magia-contramedida': T3,
        'magia-reversao-umbral': ['transbordante'],
        **{i: ['normal'] for i in (
            'magia-mao-magica', 'magia-lingua-mistica', 'magia-entender-ser', 'magia-dissipar-magia',
            'magia-aumentar-diminuir-criatura', 'magia-translocacao-arcana', 'magia-impulso-instintivo',
            'magia-disparo-veloz', 'magia-xadrez')},
    }

    def test_catalogo_restricao_da_descricao(self):
        es = {e['id']: e for e in _json('data', 'catalogo', 'magia.json')['entradas']}
        for i, perm in self.SO_DESCRICAO.items():
            self.assertEqual(es[i]['intensidadesPermitidas'], perm, i)
            self.assertIn(es[i]['intensidadeTexto'], es[i]['resumo'], i)
            for st in es[i]['stats']:
                self.assertNotIn('contida', st['porIntensidade'] or {}, (i, st['caracteristica']))
        # só a Invocar Tempestade segue na regra das 3 barras
        r3 = {(e['id'], st['caracteristica']) for e in es.values() for st in e['stats']
              if st['leitura'] == 'regra-3-barras'}
        self.assertEqual({i for i, _ in r3}, {'magia-invocar-tempestade'})


class PorIntensidade(unittest.TestCase):
    def test_barras_nivel1(self):
        fmt, por, lei = normaliza.por_intensidade('1d4 / 2d4 / 3d4 Fogo', T3)
        self.assertEqual((fmt, lei), ('barras', 'direto'))
        self.assertEqual(por, {'normal': '1d4 Fogo', 'forcada': '2d4 Fogo', 'transbordante': '3d4 Fogo'})

    def test_palavra_sem_unidade(self):
        _, por, _ = normaliza.por_intensidade('Toque / Toque / 3 / 4,5 m', T4)
        self.assertEqual(por, {'contida': 'Toque', 'normal': 'Toque', 'forcada': '3 m', 'transbordante': '4,5 m'})

    def test_barras_multiplas(self):
        fmt, por, _ = normaliza.por_intensidade('1 / 2 / 3 / 4 criaturas em até 0 / 1,5 / 3 / 4,5 m entre si', T4)
        self.assertEqual(fmt, 'barras-multiplas')
        self.assertEqual(por['forcada'], '3 criaturas em até 3 m entre si')

    def test_segmentos(self):
        fmt, por, _ = normaliza.por_intensidade('10 minutos / 1 hora / 8 horas', T3)
        self.assertEqual((fmt, por['transbordante']), ('segmentos', '8 horas'))

    def test_regra_das_3_barras(self):
        fmt, por, lei = normaliza.por_intensidade('9 / 13,5 / 18 m', T4)
        self.assertEqual(lei, 'regra-3-barras')
        self.assertEqual(por, {'contida': '9 m', 'normal': '9 m', 'forcada': '13,5 m', 'transbordante': '18 m'})

    def test_rotulado_com_base(self):
        v = 'Remove Em Chamas · Forçada: também Enjoado ou Desorientado · Transbordante: também Amedrontado'
        fmt, por, lei = normaliza.por_intensidade(v, T3)
        self.assertEqual((fmt, lei), ('rotulado', 'rotulo+base'))
        self.assertEqual(por['normal'], 'Remove Em Chamas')

    def test_irregular_fica_sem_leitura(self):
        for v in ('12 h / 1 / 2 / 3 Dias', '1 cadáver morto há no máximo 1h / 6h / 24h / 7 dias'):
            self.assertEqual(normaliza.por_intensidade(v, T4), ('irregular', None, 'irregular'), v)

    def test_contagem_que_nao_fecha(self):
        fmt, por, lei = normaliza.por_intensidade('1 / 2 / 3 / 4', T3)
        self.assertIsNone(por)
        self.assertIn('4 valores para 3', lei)

    def test_decomposicao_sem_perda_nas_magias(self):
        d = _json('data', 'magias.json')
        n = 0
        for nv in (v for k, v in d.items() if k.startswith('nivel')):
            for esc in nv.values():
                for s in esc:
                    for st in s['stats']:
                        fmt, modelo, series = normaliza.decompoe(st['valor'])
                        if modelo is not None:
                            self.assertEqual(modelo.format(*[' / '.join(x) for x in series]), st['valor'])
                            n += 1
        self.assertGreater(n, 100)


class Rotulos(unittest.TestCase):
    def test_variantes_convergem(self):
        self.assertEqual(normaliza.rotulo('Resist.'), ('resistencia', 'Resistência'))
        self.assertEqual(normaliza.rotulo('Trade-off'), normaliza.rotulo('Trade-Off'))
        self.assertEqual(normaliza.rotulo('Alvo(s)')[0], 'alvo')

    def test_desconhecido_derruba(self):
        with self.assertRaises(ValueError):
            normaliza.rotulo('Carisma')


class Sustentada(unittest.TestCase):
    def test_adicional_do_custo_por_rodada(self):
        s = {'descricao': 'X. Magia Sustentada: a cada rodada ativa, pague os éter no seu turno.',
             'stats': [{'caracteristica': 'Custo por Rodada', 'valor': 'Perde 1d10 de Éter'}]}
        sust, sus = normaliza.sustentacao(s)
        self.assertTrue(sust)
        self.assertEqual((sus['custoPorTurno'], sus['adicional']), ('canalizacao', 'Perde 1d10 de Éter'))

    def test_nao_sustentada(self):
        self.assertEqual(normaliza.sustentacao({'descricao': 'Nada.', 'stats': []}), (False, None))


class Limiar(unittest.TestCase):
    def test_req(self):
        self.assertEqual(normaliza.req_limiar('CON 14+, DES 20+'),
                         [{'attr': 'CON', 'min': 14}, {'attr': 'DES', 'min': 20}])
        self.assertEqual(normaliza.req_limiar(None), [])
        with self.assertRaises(ValueError):
            normaliza.req_limiar('CAR 14+')

    def test_custo_abismo(self):
        self.assertEqual(normaliza.custo_abismo('+3 Dor', 'gain'), {'dor': 3, 'sentido': 'ganha'})
        self.assertEqual(normaliza.custo_abismo('7 Dor', 'spend'), {'dor': 7, 'sentido': 'gasta'})
        with self.assertRaises(ValueError):
            normaliza.custo_abismo('+3 Dor', 'spend')


class CardsDeClasse(unittest.TestCase):
    RAMOS = [{'id': 'x-ramo-do-punho', 'chave': 'punho', 'nome': '🥊 Ramo do Punho'},
             {'id': 'x-ramo-do-vazio', 'chave': 'vazio', 'nome': '🌑 Ramo do Vazio'}]
    TPL = ('<div class="techniques-grid">{{CARD_0}}</div>'
           '<h3 style="color: var(--ramo-punho);">Marcas do Punho</h3>{{CARD_1}}'
           '<div class="tier-section"><div class="tier-header"><h3>{{classe.tiers.0.titulo}}</h3></div>'
           '<h4 style="color: var(--ramo-vazio);">🌑 Vazio</h4><div class="tech-grid">{{CARD_2}}</div></div>'
           '<div class="tier-section"><div class="tier-header"><h3>{{classe.tiers.1.titulo}}</h3></div>'
           '{{CARD_3}}</div>')
    CARDS = [
        {'id': 'x-a', 'tipo': 'technique-card', 'corpo': '<h4>A</h4><span class="tech-meta">Passiva</span>'},
        {'id': 'x-b', 'tipo': 'marca-card', 'corpo': '<div class="marca-header punho"><h4>B</h4></div>'},
        {'id': 'x-c', 'tipo': 'tech-card', 'corpo': '<div class="tech-card-header vazio"><h4>C</h4>'
                                                    '<span class="cost">1 Ação, 2 Stamina</span></div>'},
        {'id': 'x-d', 'tipo': 'ultimate-card', 'corpo': '<div class="ultimate-header punho"><h4>D</h4><div>'
                                                        '<span class="ultimate-badge">ULTIMATE</span>'
                                                        '<span style="x">3 Ações</span></div></div>'},
    ]
    BLOCO = {'ramos': RAMOS, 'tiers': [{'titulo': 'Tier 1', 'badge': 'Nível 2+'},
                                       {'titulo': 'Tier 3 — Ultimates', 'badge': 'Nível 5 • 1x/Dia'}]}

    def deriva(self, cards=None, tpl=None):
        return dict(blocos.deriva_cards_classe('x', self.BLOCO, cards or self.CARDS, tpl or self.TPL))

    def test_grupo_ramo_tier_custo(self):
        d = self.deriva()
        self.assertEqual([d[f'cards.{i}.grupo'] for i in range(4)], ['geral', 'marca', 'ramo', 'ultimate'])
        self.assertEqual([d[f'cards.{i}.ramo'] for i in range(4)],
                         [None, 'x-ramo-do-punho', 'x-ramo-do-vazio', 'x-ramo-do-punho'])
        self.assertEqual([d[f'cards.{i}.tier'] for i in range(4)], [None, None, 1, 3])
        self.assertEqual([d[f'cards.{i}.custoTexto'] for i in range(4)],
                         ['Passiva', None, '1 Ação, 2 Stamina', '3 Ações'])

    def test_ramo_divergente_derruba(self):
        cards = [dict(c) for c in self.CARDS]
        cards[2]['corpo'] = cards[2]['corpo'].replace('header vazio', 'header punho')
        with self.assertRaises(ValueError):
            self.deriva(cards)

    def test_titulo_sem_o_nome_do_ramo_derruba(self):
        with self.assertRaises(ValueError):
            self.deriva(tpl=self.TPL.replace('🌑 Vazio</h4>', '🌑 Punho</h4>'))

    def test_technique_cost_do_espadachim(self):
        corpo = ('<div class="technique-header"><h4>x1</h4><div class="technique-cost">'
                 '<span class="stamina">5 Stamina</span><span class="action">2 Ações</span></div></div>')
        self.assertEqual(blocos.custo_card(corpo), '5 Stamina · 2 Ações')

    def test_ramos_regra_e_tier(self):
        p = ('Você escolherá: <strong>3 Marcas</strong> e <strong>6 Técnicas de Ramo</strong> (3 no Tier 1, '
             'ao chegar ao nível 2; 2 no Tier 2, no nível 4; e 1 Ultimate no Tier 3, no nível 5).')
        r = blocos.ramos_regra([p])
        self.assertEqual((r['marcas'], r['tecnicas']), (3, 6))
        self.assertEqual([(t['tier'], t['quantidade'], t['nivel'], t['ultimate']) for t in r['porTier']],
                         [(1, 3, 2, False), (2, 2, 4, False), (3, 1, 5, True)])
        self.assertEqual(blocos.tier_cabecalho({'badge': 'TIER 2'}), {'tier': 2, 'nivel': None, 'usos': None})
        self.assertEqual(blocos.tier_cabecalho({'titulo': 'Tier 3 — Ultimates', 'badge': 'Nível 5 • 1x/Dia'}),
                         {'tier': 3, 'nivel': 5, 'usos': '1x/Dia'})


class PericiasArtefato(unittest.TestCase):
    def test_24_pericias_e_decisoes(self):
        d = _json('data', 'pericias.json')
        ps = {p['slug']: p for p in d['pericias']}
        self.assertEqual(len(d['pericias']), 24)
        self.assertEqual(set(ps), set(blocos.SLUG_PERICIA))
        self.assertEqual(ps['defender']['modo'], 'dado')
        self.assertEqual(ps['defender']['atributos'], [])
        self.assertEqual(ps['defender']['dadoPorBonus'], {'0': '1d6', '2': '1d8', '4': '1d10', '6': '1d12', '8': '2d8'})
        self.assertEqual((ps['atacar']['modo'], ps['atacar']['atributos']), ('arma', ['FOR', 'DES']))
        for s in ('movimento', 'convencimento', 'intimidacao', 'enganacao'):
            self.assertEqual((ps[s]['modo'], ps[s]['trocavel'], len(ps[s]['atributos'])), ('maior', True, 2), s)
        self.assertEqual(ps['oficio-alquimia']['atributos'], ['INT'])
        self.assertEqual([g['bonus'] for g in d['graus']], [0, 2, 4, 6, 8])


if __name__ == '__main__':
    unittest.main()
