# -*- coding: utf-8 -*-
"""gerar_bazar.aplica_renomeados: data/bazar-renomeados.json -> idsAntigos/nomesAntigos.

Nome corrigido no CSV muda o id (slug do nome). O mapa {antigo: {novo, ...}}
põe o id e o nome antigos no item atual; o que não fecha é FALHA do gerador
(nada gravado): antigo que voltou a ser id do catálogo, novo inexistente, ciclo.
"""
import json, os, shutil, sys, tempfile, unittest

TOOLS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, TOOLS)
import gerar_bazar as gb                  # noqa: E402


def itens(*ids):
    return [{'id': i, 'nome': i.replace('item-', '').title()} for i in ids]


class TestRenomeados(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix='kh_ren_')

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def mapa(self, m):
        p = os.path.join(self.tmp, 'ren.json')
        with open(p, 'w', encoding='utf-8') as f:
            json.dump({'renomeados': m}, f, ensure_ascii=False)
        return p

    def test_simples_e_encadeado(self):
        it = itens('item-c', 'item-x')
        p = self.mapa({'item-a': {'novo': 'item-b', 'nomeAntigo': 'A'},
                       'item-b': {'novo': 'item-c', 'nomeAntigo': 'B'}})
        self.assertEqual(gb.aplica_renomeados(it, p), [])
        self.assertEqual(sorted(it[0]['idsAntigos']), ['item-a', 'item-b'])
        self.assertEqual(sorted(it[0]['nomesAntigos']), ['A', 'B'])
        self.assertNotIn('idsAntigos', it[1])
        self.assertNotIn('nomesAntigos', it[1])

    def test_falhas(self):
        self.assertTrue(gb.aplica_renomeados(itens('item-a', 'item-b'), self.mapa({'item-a': {'novo': 'item-b'}})))
        self.assertTrue(gb.aplica_renomeados(itens('item-z'), self.mapa({'item-a': {'novo': 'item-b'}})))
        self.assertTrue(gb.aplica_renomeados(itens('item-z'), self.mapa({'item-a': {'novo': 'item-b'},
                                                                         'item-b': {'novo': 'item-a'}})))
        self.assertTrue(gb.aplica_renomeados(itens('item-z'), self.mapa({'item-a': {}})))

    def test_mapa_real_fecha_com_o_csv(self):
        with open(os.path.join(os.path.dirname(TOOLS), 'data', 'bazar.json'), encoding='utf-8') as f:
            b = json.load(f)
        el = next(x for x in b if x['id'] == 'item-elixir-da-expurgacao')
        self.assertEqual(el['nome'], 'Elixir da Expurgação')
        self.assertEqual(el['idsAntigos'], ['item-elixir-da-expurgao'])
        self.assertFalse(any(x['id'] == 'item-elixir-da-expurgao' for x in b))


if __name__ == '__main__':
    unittest.main()
