# -*- coding: utf-8 -*-
"""tools/gerar_usos.py: o leitor dos limites de uso. Nada some calado.

Roda sobre o data/usos.json e o data/catalogo/ do repo (que o build regenera).
"""
import glob
import json
import os
import re
import sys
import unittest

TOOLS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAIZ = os.path.dirname(TOOLS)
sys.path.insert(0, TOOLS)
import gerar_usos  # noqa: E402

PERIODOS = {'turno', 'rodada', 'cena', 'combate', 'curto', 'longo', 'dia'}
PADRAO_USO = re.compile(r'\d+\s*x\s*/|vez(?:es)?\s+por|usos?:|usos?\s+por', re.I)


def ler(rel):
    with open(os.path.join(RAIZ, rel), encoding='utf-8') as f:
        return json.load(f)


class Usos(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.doc = ler('data/usos.json')
        cls.cat = {}
        for f in sorted(glob.glob(os.path.join(RAIZ, 'data', 'catalogo', '*.json'))):
            for e in ler(os.path.relpath(f, RAIZ))['entradas']:
                cls.cat[e['id']] = e

    def textos(self, i):
        e = self.cat[i]
        return [e.get(c) or '' for c in ('nome', 'custoTexto', 'resumo')]

    def test_esquema(self):
        self.assertEqual(self.doc['schema'], 'usos/1')
        for i, r in self.doc['porId'].items():
            self.assertIn(r['periodo'], PERIODOS, i)
            self.assertEqual(r['tipo'], self.cat[i]['tipo'], i)
            self.assertTrue(r['max']['termos'], i)
            for t in r['max']['termos']:
                self.assertIn(set(t), ({'const'}, {'nivel'}, {'mod', 'fator'}), i)
                if 'mod' in t:
                    self.assertIn(t['mod'], ('FOR', 'DES', 'CON', 'INT', 'SAB'), i)

    def test_trecho_e_substring_exata(self):
        for i, r in self.doc['porId'].items():
            self.assertTrue(any(r['trecho'] in t for t in self.textos(i)), f'{i}: {r["trecho"]!r}')
        for x in self.doc['naoParseados']:
            self.assertTrue(x['trecho'] and x['motivo'], x['id'])
            for tr in x.get('trechos', [x['trecho']]):
                self.assertTrue(any(tr in t for t in self.textos(x['id'])), f'{x["id"]}: {tr!r}')

    def test_ids_no_catalogo(self):
        for i in self.doc['porId']:
            self.assertIn(i, self.cat)
        for x in self.doc['naoParseados']:
            self.assertIn(x['id'], self.cat)
            self.assertEqual(x['tipo'], self.cat[x['id']]['tipo'])

    def test_sem_duplicata(self):
        ids = [x['id'] for x in self.doc['naoParseados']]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertFalse(set(ids) & set(self.doc['porId']), 'id em porId e em naoParseados')
        fora = [x['id'] for x in self.doc['foraDoCatalogo']]
        self.assertEqual(len(fora), len(set(fora)))

    def test_portao_nada_some_calado(self):
        """Todo texto que cita limite de uso está em porId ou em naoParseados."""
        lidos = set(self.doc['porId']) | {x['id'] for x in self.doc['naoParseados']}
        sumiram = [i for i in self.cat if any(PADRAO_USO.search(t) for t in self.textos(i)) and i not in lidos]
        self.assertEqual(sumiram, [], 'texto com padrão de uso fora de porId/naoParseados')

    def test_41_tecnicas_do_log(self):
        log = ler('docs/ficha-digital/log-tecnicas.json')['tecnicas']
        com_recarga = [t['id'] for t in log if t['recarga']['status'] != 'semRecarga']
        self.assertGreaterEqual(len(com_recarga), 41)
        lidos = set(self.doc['porId']) | {x['id'] for x in self.doc['naoParseados']}
        fora = {x['id'] for x in self.doc['foraDoCatalogo']}
        faltam = []
        for i in com_recarga:
            if i.startswith('origem-') and i not in self.cat:     # habilidade de origem: mora no card da origem
                i = '-'.join(i.split('-')[:2])
            if i not in lidos and i not in fora:
                faltam.append(i)
        self.assertEqual(faltam, [])

    def test_fora_do_catalogo_traz_trecho_do_texto(self):
        for x in self.doc['foraDoCatalogo']:
            self.assertNotIn(x['id'], self.cat)
            classe = x['classe']
            d = ler(f'data/classes/{classe}.json')
            junto = ' '.join(gerar_usos.textos_recurso(d['classe']['recurso']))
            for tr in x['trechos']:
                self.assertIn(tr, junto, x['id'])

    def test_arquivo_confere_com_o_gerado(self):
        doc, _ = gerar_usos.gerar(RAIZ)
        self.assertEqual(doc, self.doc, 'data/usos.json desatualizado: rode tools/build.py')

    # ---- casos concretos de fórmula e de recusa
    def test_persistencia_humana_formula_com_mod(self):
        r = self.doc['porId']['humano-persistencia-humana']
        self.assertEqual(r['periodo'], 'longo')
        self.assertEqual(r['max']['termos'], [{'const': 1}, {'mod': 'SAB', 'fator': 1}])
        self.assertEqual(r['max']['texto'], '1+mod. Sabedoria')
        self.assertEqual(r['trecho'], 'Usos: 1+mod. Sabedoria/descanso longo')

    def test_notacoes_simples(self):
        casos = {
            'espadachim-sentenca-final': ('longo', 1),   # custoTexto "... · 1x/Descanso Longo"
            'espadachim-trebado': ('longo', 3),          # "(3x/descanso longo)"
            'alquimista-constructo-de-combate': ('curto', 2),
            'brutalista-comando-tatico': ('rodada', 2),  # "2 vezes por rodada"
            'brutalista-hoje-nao': ('longo', 1),         # "Uma vez por descanso longo"
            'monge-insurgencia': ('turno', 1),
            'batedor-olho-no-lance': ('cena', 1),
        }
        for i, esperado in casos.items():
            r = self.doc['porId'][i]
            self.assertEqual((r['periodo'], r['max']['termos']), (esperado[0], [{'const': esperado[1]}]), i)

    def test_recusas(self):
        nao = {x['id'] for x in self.doc['naoParseados']}
        for i in ('brutalista-frenesi',            # "no nível 2 e 2 vezes no nível 4"
                  'batedor-conexoes-duvidosas',    # "por localização"
                  'artilheiro-projetil-envenenado',  # "1x/Alvo"
                  'brutalista-fortaleza-de-aco',   # "número de vezes igual ao mod. (mínimo 1)"
                  'limiar-vidente'):               # "1x/sessão"
            self.assertIn(i, nao)

    # ---- o leitor, isolado
    def test_le_formula(self):
        f = gerar_usos.le_formula
        self.assertEqual(f('Nível+3'), [{'nivel': 1}, {'const': 3}])
        self.assertEqual(f('1 + Mod. Des'), [{'const': 1}, {'mod': 'DES', 'fator': 1}])
        self.assertEqual(f('2+mod.Con'), [{'const': 2}, {'mod': 'CON', 'fator': 1}])
        self.assertEqual(f('Mod. Sab'), [{'mod': 'SAB', 'fator': 1}])
        self.assertEqual(f('2x Mod. Int'), [{'mod': 'INT', 'fator': 2}])
        self.assertIsNone(f('metade do nível'))
        self.assertIsNone(f('Mod. Carisma'))

    def test_acha_isolado(self):
        l, n = gerar_usos.acha('Gaste 2 Stamina. (Usos: Nível+3/descanso curto)')
        self.assertEqual((l[0]['periodo'], l[0]['max']['termos']), ('curto', [{'nivel': 1}, {'const': 3}]))
        l, n = gerar_usos.acha('Pode usar uma vez por alvo.')
        self.assertEqual(l, [])
        self.assertEqual(len(n), 1)
        l, n = gerar_usos.acha('Usos: metade do nível/descanso longo')
        self.assertEqual(l, [])
        self.assertIn('fórmula', n[0]['motivo'])
        l, n = gerar_usos.acha('Fora disso, 2 ações por turno e 1 magia por turno.')
        self.assertEqual((l, n), ([], []))


if __name__ == '__main__':
    unittest.main()
