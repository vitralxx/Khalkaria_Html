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


if __name__ == '__main__':
    unittest.main()
