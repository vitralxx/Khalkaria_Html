# -*- coding: utf-8 -*-
"""Testes da F1b: tools/blocos.py (marcadores e leitura do verbatim) e as
checagens [blocos] e [conteudo×contrato] do tools/validar.py."""
import copy, io, json, os, re, shutil, sys, tempfile, unittest, warnings
from contextlib import redirect_stdout

TOOLS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAIZ = os.path.dirname(TOOLS)
sys.path.insert(0, TOOLS)
_argv, sys.argv = sys.argv, sys.argv[:1]      # o validar lê a raiz do argv
import validar                                 # noqa: E402
import blocos                                  # noqa: E402
sys.argv = _argv


class Marcadores(unittest.TestCase):
    def test_preenche_caminho_com_indice(self):
        b = {'status': {'saude': '10 + (5 × Nível)'}, 'ganhos': [{'texto': 'a'}, {'texto': '<b>b</b>'}]}
        t = '<code>{{classe.status.saude}}</code><li>{{classe.ganhos.1.texto}}</li>'
        self.assertEqual(blocos.preenche(t, 'classe', b), '<code>10 + (5 × Nível)</code><li><b>b</b></li>')

    def test_campo_ausente_derruba(self):
        with self.assertRaises(SystemExit):
            blocos.preenche('{{classe.cd.texto}}', 'classe', {})

    def test_campo_que_nao_e_texto_derruba(self):
        with self.assertRaises(SystemExit):
            blocos.preenche('{{classe.V}}', 'classe', {'V': 5})

    def test_marcador_de_outro_bloco_derruba(self):
        with self.assertRaises(SystemExit):
            blocos.preenche('{{raca.nome}}', 'classe', {'nome': 'x'})

    def test_poe_cria_listas_e_dicts(self):
        b = {}
        blocos.poe(b, 'recurso.medidores.0.max', '5')
        self.assertEqual(b, {'recurso': {'medidores': [{'max': '5'}]}})


class Leitura(unittest.TestCase):
    def test_treino_com_ou_arma_e_escolha_livre(self):
        self.assertEqual(blocos.treino('Intuição ou Conhecimento, 1 Perícia à sua escolha, Armas Marciais'), [
            {'tipo': 'pericia', 'quantidade': 1, 'opcoes': ['intuicao', 'conhecimento']},
            {'tipo': 'pericia', 'quantidade': 1, 'opcoes': 'qualquer'},
            {'tipo': 'arma', 'quantidade': 1, 'opcoes': ['armas-marciais']}])

    def test_oficio_sem_espaco_e_vertente_social(self):
        self.assertEqual(blocos.pericias_de('Ofício(Ferraria)'), ['oficio-ferraria'])
        self.assertEqual(blocos.pericias_de('Interação Social(Intimidação)'), ['intimidacao'])
        self.assertEqual(blocos.pericias_de('Interação Social (Qualquer)'), blocos.INTERACAO_SOCIAL)
        self.assertEqual(blocos.pericias_de('Ofício (Qualquer)'), blocos.OFICIOS)
        with self.assertRaises(ValueError):
            blocos.pericias_de('Carisma')

    def test_cd_com_escolha_e_abreviado(self):
        self.assertEqual(blocos.cd('10 + (Destreza ou Força) + Constituição'),
                         {'base': 10, 'termos': [['DES', 'FOR'], ['CON']]})
        self.assertEqual(blocos.cd('10 + Des + Sab'), {'base': 10, 'termos': [['DES'], ['SAB']]})

    def test_coeficiente_da_formula(self):
        self.assertEqual(blocos.coeficiente('8 + (7 × Nível) + (Mod.FOR OU Mod.DES × Nível)'), 7)

    def test_bonus_de_raca(self):
        self.assertEqual(blocos.bonus_atributos('+2 Destreza ou Constituição, -1 Sabedoria'),
                         [{'valor': 2, 'opcoes': ['DES', 'CON']}, {'valor': -1, 'opcoes': ['SAB']}])
        self.assertEqual(blocos.bonus_atributos('+1 em dois atributos.'),
                         [{'valor': 1, 'quantidade': 2, 'opcoes': 'qualquer'}])
        self.assertIsNone(blocos.bonus_atributos('Varia por Subespécie'))

    def test_metros(self):
        self.assertEqual((blocos.metros('7,5 metros'), blocos.metros('10,5m'), blocos.metros('Varia')),
                         (7.5, 10.5, None))

    def test_item_inicial_so_casa_nome_exato_do_bazar(self):
        bazar = {'Bolsa de Couro': 'item-bolsa-de-couro'}
        it = blocos.item_inicial('1 <a href="bazar.html?item=Bolsa de Couro" class="item-link">Bolsa de Couro</a>'
                                 ' (1 Bugiganga) — Quando equipada, +2 Espaços de Bugiganga', bazar)
        self.assertEqual(it, {'nome': 'Bolsa de Couro', 'quantidade': 1, 'slot': '1 Bugiganga',
                              'nota': 'Quando equipada, +2 Espaços de Bugiganga', 'itemId': 'item-bolsa-de-couro'})
        self.assertIsNone(blocos.item_inicial('2 Bolsas de Couro (2 Bugigangas)', bazar)['itemId'])

    def test_vertentes_sociais_sao_as_do_sistema(self):
        """INTERACAO_SOCIAL é a tabela de vertentes da página Sistema, não uma lista digitada."""
        s = json.dumps(json.load(open(os.path.join(RAIZ, 'data', 'sistema.json'), encoding='utf-8')), ensure_ascii=False)
        i = s.index('Interação social possui 5 ramos')
        tabela = s[i:s.index('</table>', i)]
        linhas = re.findall(r'<tr>\s*(?:\\r\\n\s*)*<td>(.*?)</td>', tabela.replace('\\"', '"'))
        self.assertEqual([blocos.slugify(x) for x in linhas], blocos.INTERACAO_SOCIAL)


class Contrato(unittest.TestCase):
    CLASSE = {'V': 5, 'G': 5, 'R': 5, 'cd': {'texto': '10 + Mod. Destreza + Mod. Sabedoria', 'base': 10,
                                             'termos': [['DES'], ['SAB']]},
              'treinamento': {'fixo': {'termos': [
                  {'tipo': 'arma', 'quantidade': 1, 'opcoes': ['armas-marciais']},
                  {'tipo': 'pericia', 'quantidade': 1, 'opcoes': ['movimento']}]}},
              'recurso': {'id': 'fluxo', 'medidores': [{'id': 'fluxo', 'nome': 'Fluxo', 'max': '5'}]}}
    K = {'classes': {'monge': {'V': 5, 'G': 5, 'R': 5, 'cd': {'formula': '10 + mod.DES + mod.SAB'},
                               'armaInicial': 'Marciais', 'periciasIniciais': ['movimento'],
                               'recursos': [{'id': 'fluxo', 'max': '5'}]}},
         'derivados': {'movimento': {'basePorRaca': {'dryad': 10.5}},
                       'armadura': {'arNaturalPorRaca': {'dryad': 2, 'dryad-variante': 3}}}}
    RACA = {'movimento': {'metros': 10.5}, 'caracteristicas': ['dryad-pele'],
            'arNatural': [{'fonte': 'dryad-pele', 'valor': 2}, {'fonte': 'dryad-cascaferro', 'valor': 1}]}

    def dados(self, classe=None, raca=None):
        return {'classes': {'monge': classe or copy.deepcopy(self.CLASSE)},
                'racas': {'dryad': (raca or copy.deepcopy(self.RACA), [])},
                'alias': {'dryad-variante': 'dryad-cascaferro'}}

    def test_igual_nao_avisa(self):
        self.assertEqual(validar.compara_contrato(self.dados(), self.K), [])

    def test_vgr_cd_e_pericias_divergentes_avisam(self):
        c = copy.deepcopy(self.CLASSE)
        c['V'] = 6
        c['cd']['termos'] = [['DES'], ['CON']]
        c['treinamento']['fixo']['termos'][1]['opcoes'] = ['atacar']
        av = ' | '.join(validar.compara_contrato(self.dados(classe=c), self.K))
        self.assertIn('V site 6 x contrato 5', av)
        self.assertIn('CD site', av)
        self.assertIn('perícias iniciais', av)

    def test_maximo_do_recurso_normalizado(self):
        k = copy.deepcopy(self.K)
        k['classes']['monge']['recursos'][0]['max'] = '(nivel * 3) + mod.INT'
        c = copy.deepcopy(self.CLASSE)
        c['recurso']['medidores'][0]['max'] = '(Nível × 3) + Mod.Inteligência'
        self.assertEqual(validar.compara_contrato(self.dados(classe=c), k), [])
        c['recurso']['medidores'][0]['max'] = '(Nível × 2) + Mod.Inteligência'
        self.assertTrue(any('máximo de fluxo' in a for a in validar.compara_contrato(self.dados(classe=c), k)))

    def test_recurso_pendente_avisa(self):
        c = copy.deepcopy(self.CLASSE)
        c['recurso'] = {'id': None, 'status': 'PENDENTE PEDRO'}
        av = validar.compara_contrato(self.dados(classe=c), self.K)
        self.assertTrue(any('PENDENTE PEDRO' in a for a in av))

    def test_movimento_e_ar_natural(self):
        r = copy.deepcopy(self.RACA)
        r['movimento']['metros'] = 9
        r['arNatural'][1]['valor'] = 2
        av = ' | '.join(validar.compara_contrato(self.dados(raca=r), self.K))
        self.assertIn('movimento site 9 x contrato 10.5', av)
        self.assertIn('Ar natural dryad-cascaferro: site 4 x contrato 3', av)


class Blocos(unittest.TestCase):
    """[blocos] sobre uma cópia de data/ + templates/ do repo."""

    def setUp(self):
        warnings.simplefilter('ignore', ResourceWarning)
        self.raiz = tempfile.mkdtemp(prefix='kh_f1b_')
        for d in ('data', 'templates'):
            shutil.copytree(os.path.join(RAIZ, d), os.path.join(self.raiz, d))
        validar.falhas.clear()

    def tearDown(self):
        shutil.rmtree(self.raiz, ignore_errors=True)
        validar.falhas.clear()

    def roda(self):
        with redirect_stdout(io.StringIO()) as out:
            validar.checa_blocos(self.raiz)
        return out.getvalue()

    def test_repo_atual_passa(self):
        saida = self.roda()
        self.assertNotIn('blocos', validar.falhas, saida)

    def test_derivado_fora_de_sincronia_falha(self):
        f = os.path.join(self.raiz, 'data', 'classes', 'monge.json')
        d = json.load(open(f, encoding='utf-8'))
        d['classe']['status']['saude'] = d['classe']['status']['saude'].replace('(5 ×', '(6 ×')
        json.dump(d, open(f, 'w', encoding='utf-8'), ensure_ascii=False)
        saida = self.roda()
        self.assertIn('blocos', validar.falhas)
        self.assertIn('classe monge: V = 5, o verbatim dá 6', saida)
        blocos.regrava(self.raiz)                      # o conserto que a mensagem pede
        validar.falhas.clear()
        self.roda()
        self.assertNotIn('blocos', validar.falhas)

    def test_id_de_bloco_repetido_falha(self):
        f = os.path.join(self.raiz, 'data', 'racas', 'corrompido.json')
        d = json.load(open(f, encoding='utf-8'))
        itens = d['raca']['corrupcao']['adversidades']['itens']
        itens[1]['nome'] = itens[0]['nome']
        itens[1]['id'] = itens[0]['id']
        json.dump(d, open(f, 'w', encoding='utf-8'), ensure_ascii=False)
        saida = self.roda()
        self.assertIn('blocos', validar.falhas)
        self.assertIn('id repetido nos blocos', saida)


if __name__ == '__main__':
    unittest.main()
