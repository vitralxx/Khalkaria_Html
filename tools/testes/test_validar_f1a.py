# -*- coding: utf-8 -*-
"""Testes das checagens [ids], [fragmentos] e [glifos] do tools/validar.py (F1a).

Cada caso monta um repo mínimo num diretório temporário e roda a checagem
sobre ele. Roda no build (python -m unittest) depois dos testes node.
"""
import io, json, os, shutil, sys, tempfile, unittest, warnings
from contextlib import redirect_stdout

TOOLS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, TOOLS)
_argv, sys.argv = sys.argv, sys.argv[:1]      # o validar lê a raiz do argv
import validar                                 # noqa: E402
sys.argv = _argv

CTL = ('<button type="button" class="ent-add" hidden aria-keyshortcuts="A" aria-label="Levar para a ficha: X">'
       '</button><span class="ent-alca" hidden aria-hidden="true"></span>')
CARD = '<div class="spell-card" data-kf-tipo="magia" data-kf-id="magia-x" data-prever="magia:magia-x">' + CTL + '<h4>X</h4></div>'
SPRITE = ('<svg class="kh-glifos"><symbol id="g-levar" viewBox="0 0 24 24"><path d="M0 0"></path></symbol>'
          '<symbol id="g-ramo-guarda" viewBox="0 0 24 24"><path d="M0 0"></path></symbol></svg>')


class Repo(unittest.TestCase):
    def setUp(self):
        warnings.simplefilter('ignore', ResourceWarning)   # open().read() do validar
        self.raiz = tempfile.mkdtemp(prefix='kh_f1a_')
        validar.falhas.clear()
        self.escreve('data/catalogo/magia.json', json.dumps(
            {'schema': 'catalogo/1', 'tipo': 'magia', 'total': 1,
             'entradas': [{'id': 'magia-x', 'tipo': 'magia', 'nome': 'X'}]}))
        self.escreve('data/bazar.json', json.dumps([{'id': 'item-a', 'nome': 'A'}]))
        self.escreve('tools/alias_ids.json', json.dumps({'alias': {'x-antigo': 'magia-x'}, 'semEntidade': {}}))
        self.escreve('js/bazar.js', "' data-kf-tipo=\"item\" data-kf-id=\"'")
        self.escreve('partials/glifos.html', SPRITE)
        self.escreve('templates/classes/c.template.html', '<style>:root{--ramo-guarda:#fff;--ramo-guarda-dark:#000;}</style>')

    def tearDown(self):
        shutil.rmtree(self.raiz, ignore_errors=True)

    def escreve(self, rel, txt):
        p = os.path.join(self.raiz, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, 'w', encoding='utf-8') as fh:
            fh.write(txt)

    def roda(self, checa):
        validar.falhas.clear()
        with redirect_stdout(io.StringIO()) as out:
            checa(self.raiz)
        return list(validar.falhas), out.getvalue()


class TestIds(Repo):
    def test_ok(self):
        self.escreve('pages/magias.html', CARD)
        self.assertEqual(self.roda(validar.checa_ids)[0], [])

    def test_card_faltando_no_dom(self):
        self.escreve('pages/magias.html', '<div class="spell-card"><h4>X</h4></div>')
        f, out = self.roda(validar.checa_ids)
        self.assertEqual(f, ['ids'])
        self.assertIn('magia:magia-x', out)

    def test_card_fora_do_catalogo_e_repetido(self):
        self.escreve('pages/magias.html', CARD + CARD.replace('magia-x', 'magia-y'))
        f, out = self.roda(validar.checa_ids)
        self.assertEqual(f, ['ids'])
        self.assertIn('magia:magia-y', out)
        self.escreve('pages/magias.html', CARD + CARD)
        self.assertIn('repetido', self.roda(validar.checa_ids)[1])

    def test_botao_sem_hidden(self):
        self.escreve('pages/magias.html', CARD.replace('class="ent-add" hidden', 'class="ent-add"'))
        f, out = self.roda(validar.checa_ids)
        self.assertEqual(f, ['ids'])
        self.assertIn('sem hidden', out)

    def test_prever_errado(self):
        self.escreve('pages/magias.html', CARD.replace('data-prever="magia:magia-x"', 'data-prever="magia-x"'))
        self.assertIn('data-prever', self.roda(validar.checa_ids)[1])

    def test_id_repetido_entre_catalogo_e_bazar(self):
        self.escreve('pages/magias.html', CARD)
        self.escreve('data/bazar.json', json.dumps([{'id': 'magia-x', 'nome': 'X'}]))
        self.assertIn('repetido no site', self.roda(validar.checa_ids)[1])

    def test_controles_fora_do_card(self):
        # E3: par movido para fora do card (a contagem total continua batendo)
        self.escreve('pages/magias.html', CARD.replace(CTL, '') + '<main>' + CTL + '</main>')
        f, out = self.roda(validar.checa_ids)
        self.assertEqual(f, ['ids'])
        self.assertIn('primeiros filhos', out)

    def test_controles_trocados_de_card(self):
        # E4: par tirado do 1º card e duplicado no 2º
        dois = CARD.replace(CTL, '') + CARD.replace('magia-x', 'magia-y').replace(CTL, CTL + CTL)
        self.escreve('data/catalogo/magia.json', json.dumps(
            {'schema': 'catalogo/1', 'tipo': 'magia', 'total': 2,
             'entradas': [{'id': 'magia-x', 'tipo': 'magia', 'nome': 'X'},
                          {'id': 'magia-y', 'tipo': 'magia', 'nome': 'Y'}]}))
        self.escreve('pages/magias.html', dois)
        self.assertIn('magia:magia-x', self.roda(validar.checa_ids)[1])

    def test_card_do_json_sumido_do_dom_e_do_catalogo(self):
        # traço com classe CSS trocada: some da página E do catálogo; o JSON acusa
        self.escreve('pages/magias.html', CARD)
        self.escreve('data/racas/humano.json', json.dumps({'cards': [
            {'id': 'humano-regra', 'opentag': '<div class="rule-box">'},
            {'id': 'humano-traco', 'opentag': '<div class="traco-card">'}]}))
        self.escreve('pages/racas/humano.html', '<div class="traco-card"><h4>T</h4></div>')
        f, out = self.roda(validar.checa_ids)
        self.assertEqual(f, ['ids'])
        self.assertIn('humano-traco', out)
        self.assertNotIn('humano-regra', out)   # rule-box é NAO_ENTIDADE

    def test_alias(self):
        self.escreve('pages/magias.html', CARD)
        self.escreve('tools/alias_ids.json', json.dumps({'alias': {'velho': 'nao-existe'}}))
        self.assertIn('não é id do site', self.roda(validar.checa_ids)[1])
        self.escreve('tools/alias_ids.json', json.dumps({'alias': {'magia-x': 'magia-x'}}))
        self.assertIn('alias sobrando', self.roda(validar.checa_ids)[1])
        self.escreve('tools/alias_ids.json', json.dumps({'alias': {}, 'semEntidade': {'acao-x': 'motivo'}}))
        f, out = self.roda(validar.checa_ids)
        self.assertEqual(f, [])                 # semEntidade é AVISO, não FALHA
        self.assertIn('AVISO', out)


class TestFragmentos(Repo):
    def test_ok_e_quebrado(self):
        self.escreve('pages/b.html', '<h2 id="alvo">T</h2>')
        self.escreve('pages/a.html', '<a href="b.html#alvo">ok</a>')
        self.assertEqual(self.roda(validar.checa_fragmentos)[0], [])
        self.escreve('pages/a.html', '<a href="b.html#sumiu">x</a>')
        self.assertEqual(self.roda(validar.checa_fragmentos)[0], ['fragmentos'])

    def test_data_kf_id_nao_e_id(self):
        self.escreve('pages/b.html', CARD)
        self.escreve('pages/a.html', '<a href="b.html#magia-x">x</a>')
        self.assertEqual(self.roda(validar.checa_fragmentos)[0], ['fragmentos'])

    def test_rota_do_bazar(self):
        self.escreve('pages/bazar.html', '<main></main>')
        self.escreve('pages/a.html', '<a href="bazar.html#item/item-a">ok</a>')
        self.assertEqual(self.roda(validar.checa_fragmentos)[0], [])
        self.escreve('pages/a.html', '<a href="bazar.html#item/item-zz">x</a>')
        self.assertEqual(self.roda(validar.checa_fragmentos)[0], ['fragmentos'])


class TestGlifos(Repo):
    def test_ok(self):
        self.escreve('pages/a.html', SPRITE + '<svg><use href="#g-levar"></use></svg>')
        self.assertEqual(self.roda(validar.checa_glifos)[0], [])

    def test_use_sem_symbol_na_pagina(self):
        self.escreve('pages/a.html', '<svg><use href="#g-levar"></use></svg>')
        self.assertEqual(self.roda(validar.checa_glifos)[0], ['glifos'])

    def test_js_com_glifo_inexistente(self):
        self.escreve('js/x.js', "'<svg><use href=\"#g-nao-existe\"></use></svg>'")
        self.assertIn('g-nao-existe', self.roda(validar.checa_glifos)[1])

    def test_sprite_quebrado(self):
        self.escreve('partials/glifos.html', SPRITE.replace(' viewBox="0 0 24 24"', '', 1))
        self.assertIn('sem viewBox', self.roda(validar.checa_glifos)[1])
        self.escreve('partials/glifos.html', SPRITE.replace('g-levar', 'g-ramo-guarda'))
        self.assertIn('duplicados', self.roda(validar.checa_glifos)[1])

    def test_ramo_com_hifen(self):
        self.escreve('templates/classes/d.template.html',
                     '<style>:root{--ramo-sem-nome:#fff;--ramo-sem-nome-dark:#000;}</style>')
        self.assertIn("'sem-nome'", self.roda(validar.checa_glifos)[1])

    def test_ramo_sem_glifo(self):
        self.escreve('templates/classes/d.template.html', '<style>:root{--ramo-novo:#fff;}</style>')
        self.assertIn('ramo sem glifo', self.roda(validar.checa_glifos)[1])


class TestKfMarca(unittest.TestCase):
    def test_classe_fora_do_mapa_derruba(self):
        import kf_marca
        m = kf_marca.TIPO_POR_CLASSE_CSS_RACA
        self.assertEqual(kf_marca.tipo_do_opentag('<div class="trait-card">', m), 'traco')
        self.assertIsNone(kf_marca.tipo_do_opentag('<div class="rule-box">', m))
        with self.assertRaises(SystemExit):
            kf_marca.tipo_do_opentag('<div class="traco-card">', m)


if __name__ == '__main__':
    unittest.main()
