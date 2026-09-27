# -*- coding: utf-8 -*-
"""Testes do [artefato-js] (F2a): js/ficha.js = concat(js/ficha/ORDEM).

Cada caso monta um js/ficha/ mínimo num diretório temporário.
"""
import io, os, shutil, sys, tempfile, unittest, warnings
from contextlib import redirect_stdout

TOOLS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, TOOLS)
_argv, sys.argv = sys.argv, sys.argv[:1]      # o validar lê a raiz do argv
import validar                                 # noqa: E402
import ficha_js                                # noqa: E402
sys.argv = _argv


class ArtefatoJs(unittest.TestCase):
    def setUp(self):
        warnings.simplefilter('ignore', ResourceWarning)
        self.raiz = tempfile.mkdtemp(prefix='kh_f2a_')
        validar.falhas.clear()
        self.escreve('js/ficha/ORDEM', '# comentário\na.js\n\nb.js\n')
        self.escreve('js/ficha/a.js', '(function(){ var a = 1; })();\n')
        self.escreve('js/ficha/b.js', '(function(){ var b = 2; })();')

    def tearDown(self):
        shutil.rmtree(self.raiz, ignore_errors=True)
        validar.falhas.clear()

    def escreve(self, rel, txt):
        p = os.path.join(self.raiz, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        open(p, 'w', encoding='utf-8', newline='').write(txt)

    def roda(self):
        out = io.StringIO()
        with redirect_stdout(out):
            validar.checa_artefato_js(self.raiz)
        return out.getvalue()

    def test_gravado_confere_e_ordem(self):
        self.assertTrue(ficha_js.grava(self.raiz))
        self.assertFalse(ficha_js.grava(self.raiz), 'regravar sem mudança não mexe')
        art = open(os.path.join(self.raiz, 'js', 'ficha.js'), encoding='utf-8').read()
        self.assertTrue(art.startswith('/* js/ficha.js — ARTEFATO gerado — não editar.'))
        self.assertLess(art.index('var a = 1'), art.index('var b = 2'))
        self.assertIn('OK', self.roda())
        self.assertEqual(validar.falhas, [])

    def test_crlf_nao_conta(self):
        ficha_js.grava(self.raiz)
        p = os.path.join(self.raiz, 'js', 'ficha.js')
        txt = open(p, encoding='utf-8', newline='').read()
        open(p, 'w', encoding='utf-8', newline='').write(txt.replace('\n', '\r\n'))
        self.roda()
        self.assertEqual(validar.falhas, [])

    def test_artefato_editado_a_mao_falha(self):
        ficha_js.grava(self.raiz)
        p = os.path.join(self.raiz, 'js', 'ficha.js')
        open(p, 'a', encoding='utf-8').write('// editado à mão\n')
        self.assertIn('FALHA', self.roda())
        self.assertEqual(validar.falhas, ['artefato-js'])

    def test_fonte_mudou_sem_build_falha(self):
        ficha_js.grava(self.raiz)
        self.escreve('js/ficha/b.js', '(function(){ var b = 3; })();\n')
        self.roda()
        self.assertEqual(validar.falhas, ['artefato-js'])

    def test_fonte_fora_do_ordem_falha(self):
        ficha_js.grava(self.raiz)
        self.escreve('js/ficha/c.js', '// órfã\n')
        self.assertIn('fora do ORDEM', self.roda())
        self.assertEqual(validar.falhas, ['artefato-js'])

    def test_ordem_invalido(self):
        self.escreve('js/ficha/ORDEM', 'a.js\na.js\nb.js\n')
        with self.assertRaises(ValueError):
            ficha_js.ordem(self.raiz)
        self.escreve('js/ficha/ORDEM', 'a.js\nnao-existe.js\nb.js\n')
        with self.assertRaises(ValueError):
            ficha_js.ordem(self.raiz)

    def test_sem_artefato_falha(self):
        self.roda()
        self.assertEqual(validar.falhas, ['artefato-js'])


if __name__ == '__main__':
    unittest.main()
