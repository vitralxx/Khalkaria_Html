# -*- coding: utf-8 -*-
"""Testes da checagem [componentes] do tools/validar.py.

O sync do Notion de 2026-09-26 trocou cards de companheiro, tabelas d100,
sub-habilidades e stats de constructo por <ul><li> genérico sem nenhum teste
cair. A checagem compara a contagem das classes CSS de componente com o
tools/componentes-baseline.json; aqui ela é quebrada de propósito para provar
que derruba o build.
"""
import io, json, os, shutil, sys, tempfile, unittest, warnings
from contextlib import redirect_stdout

TOOLS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAIZ = os.path.dirname(TOOLS)
sys.path.insert(0, TOOLS)
_argv, sys.argv = sys.argv, sys.argv[:1]      # o validar lê a raiz do argv
import validar                                 # noqa: E402
sys.argv = _argv

CARD = '<div class="companion-card"><h5>Lobo</h5><div class="companion-stats"><span>15 HP</span></div></div>'


class Base(unittest.TestCase):
    def setUp(self):
        warnings.simplefilter('ignore', ResourceWarning)   # open().read() do validar
        self.raiz = tempfile.mkdtemp(prefix='kh_comp_')
        validar.falhas.clear()

    def tearDown(self):
        shutil.rmtree(self.raiz, ignore_errors=True)
        validar.falhas.clear()

    def escreve(self, rel, txt):
        p = os.path.join(self.raiz, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, 'w', encoding='utf-8') as fh:
            fh.write(txt)

    def le(self, rel):
        with open(os.path.join(self.raiz, rel), encoding='utf-8') as fh:
            return fh.read()

    def roda(self, checa=None):
        validar.falhas.clear()
        with redirect_stdout(io.StringIO()) as out:
            (checa or validar.checa_componentes)(self.raiz)
        return list(validar.falhas), out.getvalue()


class TestSintetico(Base):
    def setUp(self):
        super().setUp()
        self.escreve(validar.BASELINE_COMPONENTES, json.dumps({
            'classes': ['companion-card', 'companion-stats'],
            'paginas': {'pages/classes/monge.html': {'companion-card': 2, 'companion-stats': 2}}}))
        self.escreve('pages/classes/monge.html', CARD * 2)

    def test_ok(self):
        self.assertEqual(self.roda()[0], [])

    def test_queda_derruba(self):
        self.escreve('pages/classes/monge.html', CARD + '<ul><li>Lobo: 15 HP</li></ul>')
        f, out = self.roda()
        self.assertEqual(f, ['componentes'])
        self.assertIn('.companion-card caiu de 2 para 1', out)
        self.assertIn('.companion-stats caiu de 2 para 1', out)

    def test_subir_so_avisa(self):
        self.escreve('pages/classes/monge.html', CARD * 3)
        f, out = self.roda()
        self.assertEqual(f, [])
        self.assertIn('AVISO', out)

    def test_atributo_parecido_nao_conta(self):
        # data-class= e classe com sufixo não são o componente
        self.escreve('pages/classes/monge.html',
                     CARD + '<div data-class="companion-card" class="companion-card-x companion-stats"></div>')
        f, out = self.roda()
        self.assertEqual(f, ['componentes'])
        self.assertIn('.companion-card caiu de 2 para 1', out)

    def test_pagina_nova_sem_baseline(self):
        self.escreve('pages/classes/nova.html', CARD)
        f, out = self.roda()
        self.assertEqual(f, ['componentes'])
        self.assertIn('pages/classes/nova.html: página sem linha no baseline', out)

    def test_pagina_do_baseline_sumiu(self):
        os.remove(os.path.join(self.raiz, 'pages/classes/monge.html'))
        f, out = self.roda()
        self.assertEqual(f, ['componentes'])
        self.assertIn('não existe', out)

    def test_baseline_ausente(self):
        os.remove(os.path.join(self.raiz, validar.BASELINE_COMPONENTES))
        f, out = self.roda()
        self.assertEqual(f, ['componentes'])
        self.assertIn('ilegível', out)

    def test_classe_fora_da_lista(self):
        self.escreve(validar.BASELINE_COMPONENTES, json.dumps({
            'classes': ['companion-card'],
            'paginas': {'pages/classes/monge.html': {'companion-card': 2, 'companion-stats': 2}}}))
        f, out = self.roda()
        self.assertEqual(f, ['componentes'])
        self.assertIn('fora da lista "classes"', out)

    def test_atualizar_de_proposito(self):
        # queda legítima: só passa depois de regravar o baseline
        self.escreve('pages/classes/monge.html', CARD)
        self.assertEqual(self.roda()[0], ['componentes'])
        self.roda(validar.atualiza_componentes)
        base = json.loads(self.le(validar.BASELINE_COMPONENTES))
        self.assertEqual(base['paginas']['pages/classes/monge.html'],
                         {'companion-card': 1, 'companion-stats': 1})
        self.assertEqual(base['classes'], ['companion-card', 'companion-stats'])
        self.assertEqual(self.roda()[0], [])


def _card(cid, miolo):
    return f'<div class="tech-card" data-kf-id="{cid}"><h4>{cid}</h4>{miolo}</div>'


CUSTO = '<div class="ultimate-cost"><h5>Preço</h5><p>x</p></div>'


class TestPorCard(Base):
    """O total da página fecha, mas o componente mudou de card: tem de falhar."""

    def setUp(self):
        super().setUp()
        self.escreve(validar.BASELINE_COMPONENTES, json.dumps({
            'classes': ['tech-card', 'ultimate-cost'], 'paginas': {}}))
        self.pagina(_card('a', CUSTO) + _card('b', CUSTO))
        self.roda(validar.atualiza_componentes)

    def pagina(self, html):
        self.escreve('pages/classes/teurgo.html', '<div>' + html + '</div>')

    def test_ok(self):
        self.assertEqual(self.roda()[0], [])
        base = json.loads(self.le(validar.BASELINE_COMPONENTES))
        self.assertEqual(base['cards']['pages/classes/teurgo.html'],
                         {'a': {'tech-card': 1, 'ultimate-cost': 1},
                          'b': {'tech-card': 1, 'ultimate-cost': 1}})

    def test_componente_muda_de_card(self):
        # página continua com 2 .ultimate-cost; o de "a" virou <ul> e "b" ganhou outro
        self.pagina(_card('a', '<ul><li>Preço: x</li></ul>') + _card('b', CUSTO * 2))
        f, out = self.roda()
        self.assertEqual(f, ['componentes'])
        self.assertIn('card a: .ultimate-cost caiu de 1 para 0', out)
        self.assertNotIn('.ultimate-cost caiu de 2', out)      # a página não acusa

    def test_card_sumiu(self):
        self.pagina(_card('b', CUSTO * 2) + '<div class="tech-card">sem id</div>')
        f, out = self.roda()
        self.assertEqual(f, ['componentes'])
        self.assertIn('card a sumiu', out)

    def test_card_aninhado_conta_no_mais_interno(self):
        html = ('<div class="tech-card" data-kf-id="fora"><br><img src="x">'
                + _card('dentro', CUSTO) + CUSTO + '</div>')
        self.assertEqual(validar.conta_por_card(html, ['tech-card', 'ultimate-cost']),
                         {'dentro': {'tech-card': 1, 'ultimate-cost': 1},
                          'fora': {'tech-card': 1, 'ultimate-cost': 1}})


class TestRepoReal(Base):
    """Baseline e páginas reais copiados; quebra de propósito o que o sync quebrou."""

    def setUp(self):
        super().setUp()
        os.makedirs(os.path.join(self.raiz, 'tools'))
        shutil.copy(os.path.join(RAIZ, validar.BASELINE_COMPONENTES),
                    os.path.join(self.raiz, validar.BASELINE_COMPONENTES))
        shutil.copytree(os.path.join(RAIZ, 'pages', 'classes'), os.path.join(self.raiz, 'pages', 'classes'))

    def quebra(self, pagina, velho, novo):
        rel = f'pages/classes/{pagina}.html'
        html = self.le(rel)
        self.assertIn(velho, html)
        self.escreve(rel, html.replace(velho, novo, 1))

    def test_repo_real_passa(self):
        self.assertEqual(self.roda()[0], [])

    def test_companheiro_vira_lista(self):
        self.quebra('monge', 'class="companion-card"', 'class="x"')
        f, out = self.roda()
        self.assertEqual(f, ['componentes'])
        self.assertIn('pages/classes/monge.html: .companion-card caiu', out)

    def test_d100_vira_lista(self):
        self.quebra('batedor', '<table class="d100-table">', '<table>')
        f, out = self.roda()
        self.assertEqual(f, ['componentes'])
        self.assertIn('pages/classes/batedor.html: .d100-table caiu', out)

    def test_sub_habilidade_some(self):
        self.quebra('teurgo', 'class="sub-ability"', 'class="y"')
        self.assertIn('.sub-ability caiu', self.roda()[1])

    def test_custo_do_receptaculo_muda_de_card(self):
        # o que a revisão de 0f4d4f9 achou: O Custo do Receptáculo vira lista e a
        # Manifestação ganha um .ultimate-cost a mais; o total da página não muda
        self.quebra('teurgo', '<div class="ultimate-cost"><h5>💀 Receptáculo Instável</h5>',
                    '<div><h5>💀 Receptáculo Instável</h5>')
        self.quebra('teurgo', '<div class="ultimate-cost"><h5>💀 O Preço</h5>',
                    '<div class="ultimate-cost"><h5>💀 O Preço</h5><div class="ultimate-cost"></div>')
        f, out = self.roda()
        self.assertEqual(f, ['componentes'])
        self.assertIn('card teurgo-receptaculo-perfeito: .ultimate-cost caiu de 1 para 0', out)
        self.assertNotIn('teurgo.html: .ultimate-cost caiu', out)

    def test_estrutura_de_tier_vira_lista(self):
        self.quebra('monge', 'class="tier-section"', 'class="z"')
        self.assertIn('pages/classes/monge.html: .tier-section caiu', self.roda()[1])


if __name__ == '__main__':
    unittest.main()
