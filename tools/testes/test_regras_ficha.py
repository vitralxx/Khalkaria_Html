# -*- coding: utf-8 -*-
"""tools/gerar_regras_ficha.py (F3b): contrato + blocos -> js/ficha/00-regras-dados.js.

Cada caso copia data/ para um diretório temporário, mexe no contrato e roda o
gerador lá (o artefato do repo não é tocado).
"""
import json, os, shutil, subprocess, sys, tempfile, unittest

TOOLS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAIZ = os.path.dirname(TOOLS)
CONTRATO = os.path.join('data', 'balanceamento', 'ficha-digital-regras.json')
ENV = dict(os.environ, PYTHONIOENCODING='utf-8')


class GerarRegrasFicha(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.base = tempfile.mkdtemp(prefix='kh_f3b_')
        shutil.copytree(os.path.join(RAIZ, 'data'), os.path.join(cls.base, 'data'))

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.base, ignore_errors=True)

    def setUp(self):
        self.raiz = tempfile.mkdtemp(prefix='kh_f3b_c_')
        shutil.copytree(os.path.join(self.base, 'data'), os.path.join(self.raiz, 'data'))

    def tearDown(self):
        shutil.rmtree(self.raiz, ignore_errors=True)

    def contrato(self, muda):
        p = os.path.join(self.raiz, CONTRATO)
        with open(p, encoding='utf-8') as fh:
            c = json.load(fh)
        muda(c)
        with open(p, 'w', encoding='utf-8') as fh:
            json.dump(c, fh, ensure_ascii=False, indent=1)

    def roda(self):
        r = subprocess.run([sys.executable, os.path.join(TOOLS, 'gerar_regras_ficha.py'), self.raiz],
                           capture_output=True, text=True, encoding='utf-8', env=ENV)
        return r.returncode, (r.stdout or '') + (r.stderr or '')

    def artefato(self, raiz):
        with open(os.path.join(raiz, 'js', 'ficha', '00-regras-dados.js'), encoding='utf-8') as fh:
            return fh.read()

    def test_mesmo_artefato_do_repo(self):
        cod, out = self.roda()
        self.assertEqual(cod, 0, out)
        self.assertEqual(self.artefato(self.raiz), self.artefato(RAIZ).replace('\r\n', '\n'))

    def test_status_desconhecido_derruba(self):
        self.contrato(lambda c: c['derivados']['evasao'].__setitem__('passivaStatus', 'quaseCanonico'))
        cod, out = self.roda()
        self.assertEqual(cod, 1)
        self.assertIn('status desconhecido', out)
        self.assertIn('quaseCanonico', out)
        self.assertFalse(os.path.exists(os.path.join(self.raiz, 'js', 'ficha', '00-regras-dados.js')))

    def test_status_desconhecido_em_condicao_derruba(self):
        self.contrato(lambda c: c['condicoes'][0].__setitem__('status', 'talvez'))
        cod, out = self.roda()
        self.assertEqual(cod, 1)
        self.assertIn("'talvez'", out)

    def test_log_de_pendencias_do_notion_nao_e_regra(self):
        # pendenciasNotion carrega texto livre ("gravado no Notion…"): fica de fora da validação
        self.contrato(lambda c: c['pendenciasNotion'][0].__setitem__('status', 'qualquer texto'))
        cod, out = self.roda()
        self.assertEqual(cod, 0, out)

    def test_formula_fora_da_gramatica_derruba(self):
        self.contrato(lambda c: c['recursos']['saude'].__setitem__('max', '10 + classe.V*nivel + carisma'))
        cod, out = self.roda()
        self.assertEqual(cod, 1)
        self.assertIn("referência 'carisma'", out)

    def test_contrato_x_bloco_divergente_derruba(self):
        self.contrato(lambda c: c['classes']['monge'].__setitem__('V', 6))
        cod, out = self.roda()
        self.assertEqual(cod, 1)
        self.assertIn('V/G/R', out)

    def test_sem_status_vira_semStatus_e_bloco_confirma(self):
        cod, out = self.roda()
        self.assertEqual(cod, 0, out)
        txt = self.artefato(self.raiz)
        ini = txt.index('var DADOS = ') + len('var DADOS = ')
        fim = txt.index(';\n  if (typeof module')
        d = json.loads(txt[ini:fim])
        self.assertEqual(d['condicoes']['caido']['st'], 'semStatus')           # sem status no contrato
        self.assertEqual(d['derivados']['inventario']['st'], 'canonico')       # confirmado pela frase do Sistema
        self.assertEqual(d['recursos']['stamina']['st'], 'canonico')           # confirmado pelas 7 páginas de classe
        self.assertEqual(d['recursos']['stamina']['max']['b']['a']['st'], 'aprovado')  # escolha 'maior' (PD7)
        self.assertIn('semStatus', d['selos'])


if __name__ == '__main__':
    unittest.main()
