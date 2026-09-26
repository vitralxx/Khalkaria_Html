# -*- coding: utf-8 -*-
"""Testes do `sync_notion.py cobertura`: o normalizador tira o espaço depois da
vírgula (o chip de stats o cria na fronteira de tag), mas o limiar de 25
caracteres é medido ANTES disso. Na 0f4d4f9 era medido depois, e
"3 Stamina, 5 Concentração" (25) virava "3 stamina,5 concentração" (24): a
sentença saía do filtro e o trecho contava como coberto sem estar no site.
"""
import io, os, shutil, sys, tempfile, unittest, warnings
from contextlib import redirect_stdout

TOOLS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, TOOLS)
import sync_notion                      # noqa: E402


class TestCobertura(unittest.TestCase):
    def setUp(self):
        warnings.simplefilter('ignore', ResourceWarning)   # open().read() do sync_notion
        self.tmp = tempfile.mkdtemp(prefix='kh_cob_')
        self._frag, self._pag, self._root = sync_notion.fragmentos, sync_notion.pagina, sync_notion.ROOT
        sync_notion.ROOT = self.tmp          # relpath do relatório: mesmo disco da página

    def tearDown(self):
        sync_notion.fragmentos, sync_notion.pagina, sync_notion.ROOT = self._frag, self._pag, self._root
        shutil.rmtree(self.tmp, ignore_errors=True)

    def faltam(self, fragmentos, site):
        p = os.path.join(self.tmp, 'pg.html')
        with open(p, 'w', encoding='utf-8') as fh:
            fh.write(site)
        sync_notion.fragmentos = lambda s: fragmentos
        sync_notion.pagina = lambda s: p
        with redirect_stdout(io.StringIO()) as out:
            sync_notion.cmd_cobertura('teste')
        return int(out.getvalue().rsplit('sem correspondência no site: ', 1)[1].split()[0])

    def test_virgula_de_chip_casa(self):
        site = ('<div class="companion-stats"><span>Médio</span><span class="sep">,</span>'
                '<span>15 HP</span><span class="sep">,</span><span>Evasão 13</span></div>')
        self.assertEqual(self.faltam(['Médio,15 HP, Evasão 13'], site), 0)

    def test_limiar_antes_da_virgula(self):
        # o site diz "5 Conc."; o Notion, "5 Concentração": tem de aparecer
        self.assertEqual(self.faltam(['3 Stamina, 5 Concentração'], '<p>3 Stamina, 5 Conc.</p>'), 1)

    def test_texto_igual_passa(self):
        self.assertEqual(self.faltam(['3 Stamina, 5 Concentração'], '<p>3 Stamina, 5 Concentração</p>'), 0)

    def test_nz_padrao_tira_espaco_da_virgula(self):
        self.assertEqual(sync_notion._nz('Médio , 15 HP'), 'médio,15 hp')
        self.assertEqual(sync_notion._nz('Médio , 15 HP', virgula=False), 'médio, 15 hp')


if __name__ == '__main__':
    unittest.main()
