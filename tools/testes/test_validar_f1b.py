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
            'arNatural': [{'fonte': 'dryad-pele', 'valor': 2, 'soma': False},
                          {'fonte': 'dryad-cascaferro', 'valor': 1, 'soma': True}]}

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
        c['recurso'] = {'id': None, 'status': 'pedroDecide'}
        av = validar.compara_contrato(self.dados(classe=c), self.K)
        self.assertTrue(any('pedroDecide' in a for a in av))

    def test_movimento_e_ar_natural(self):
        r = copy.deepcopy(self.RACA)
        r['movimento']['metros'] = 9
        r['arNatural'][1]['valor'] = 2
        av = ' | '.join(validar.compara_contrato(self.dados(raca=r), self.K))
        self.assertIn('movimento site 9 x contrato 10.5', av)
        self.assertIn('Ar natural dryad-cascaferro: site 4 x contrato 3', av)

    def test_ar_da_variante_absoluto_nao_soma_a_base(self):
        """'N Armadura (Ar)' (soma False) é o valor da variante, não base + N."""
        r = copy.deepcopy(self.RACA)
        r['arNatural'][1] = {'fonte': 'dryad-cascaferro', 'valor': 3, 'soma': False}
        self.assertEqual(validar.compara_contrato(self.dados(raca=r), self.K), [])
        r['arNatural'][1]['soma'] = True
        self.assertTrue(any('site 5 x contrato 3' in a for a in validar.compara_contrato(self.dados(raca=r), self.K)))

    def test_recurso_a_mais_no_contrato_avisa(self):
        k = copy.deepcopy(self.K)
        k['classes']['monge']['recursos'].append({'id': 'y', 'max': '3'})
        av = validar.compara_contrato(self.dados(), k)
        self.assertTrue(any('recurso "y" no contrato' in a for a in av), av)

    def test_corrupcao_maxima_por_nivel(self):
        k = copy.deepcopy(self.K)
        k['progressao'] = {'corrupcaoMax': {'1': 2, '5': 20}}
        r = copy.deepcopy(self.RACA)
        r['corrupcao'] = {'maximoPorNivel': [{'nivel': '1', 'maximo': '2'}, {'nivel': '5', 'maximo': '20'}]}
        self.assertEqual(validar.compara_contrato(self.dados(raca=r), k), [])
        k['progressao']['corrupcaoMax']['5'] = 99
        av = validar.compara_contrato(self.dados(raca=r), k)
        self.assertTrue(any('corrupção máxima por nível' in a for a in av), av)

    def test_inicio_e_recarga_do_medidor(self):
        k = copy.deepcopy(self.K)
        k['classes']['monge']['recursos'][0].update(
            {'inicio': {'evento': 'inicioCombate', 'valor': 0}, 'zeraEm': ['fimCombate', 'falhaEmPericia'],
             'recupera': [{'evento': 'descansoCurto', 'formula': '1d4+nivel'}]})
        c = copy.deepcopy(self.CLASSE)
        c['recurso']['medidores'][0].update(
            {'min': None, 'inicio': {'evento': 'inicioCombate', 'valor': 0},
             'recarga': [{'evento': 'fimCombate', 'valor': 0}, {'evento': 'descansoCurto', 'formula': '1d4+Nível'}]})
        self.assertEqual(validar.compara_contrato(self.dados(classe=c), k), [])
        c['recurso']['medidores'][0]['inicio'] = None
        c['recurso']['medidores'][0]['recarga'] = None
        av = ' | '.join(validar.compara_contrato(self.dados(classe=c), k))
        self.assertIn('início de fluxo site não declarado', av)
        self.assertIn('recarga de fluxo site não declarada', av)


class Blocos(unittest.TestCase):
    """[blocos] sobre uma cópia de data/ + templates/ do repo."""

    def setUp(self):
        warnings.simplefilter('ignore', ResourceWarning)
        self.raiz = tempfile.mkdtemp(prefix='kh_f1b_')
        for d in ('data', 'templates'):
            shutil.copytree(os.path.join(RAIZ, d), os.path.join(self.raiz, d))
        os.makedirs(os.path.join(self.raiz, 'tools'))
        shutil.copy(os.path.join(RAIZ, validar.PENDENTES_BAL), os.path.join(self.raiz, validar.PENDENTES_BAL))
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

    def _json(self, *cam):
        f = os.path.join(self.raiz, *cam)
        return f, json.load(open(f, encoding='utf-8'))

    def _grava(self, f, d):
        json.dump(d, open(f, 'w', encoding='utf-8'), ensure_ascii=False)

    def test_campo_verbatim_trocado_por_literal_no_template_falha(self):
        """O caso da revisão: o template passa a trazer o texto literal, o JSON diverge
        (e os derivados até concordam com ele); a página continua dizendo 8."""
        ft = os.path.join(self.raiz, 'templates', 'classes', 'brutalista.template.html')
        t = open(ft, encoding='utf-8').read()
        self.assertEqual(t.count('{{classe.status.saude}}'), 1)
        open(ft, 'w', encoding='utf-8', newline='\n').write(
            t.replace('{{classe.status.saude}}', '10 + (8 × Nível) + (Mod.CON × Nível)'))
        f, d = self._json('data', 'classes', 'brutalista.json')
        d['classe']['status']['saude'] = '10 + (4 × Nível) + (Mod.CON × Nível)'
        self._grava(f, d)
        blocos.regrava(self.raiz)
        saida = self.roda()
        self.assertIn('blocos', validar.falhas)
        self.assertIn("classe brutalista: campo(s) verbatim sem marcador", saida)
        self.assertIn('status.saude', saida)

    def test_marcador_sem_campo_verbatim_falha(self):
        sem, orfao = validar.cobertura_marcadores({'cd': {'texto': 'x'}}, [], '{{classe.cd.texto}}{{classe.V}}', 'classe')
        self.assertEqual((sem, orfao), ([], ['V']))

    def test_raca_sem_fisico_falha(self):
        f, d = self._json('data', 'racas', 'inseto.json')
        self.assertEqual(len(d['raca']['variantes']['fisico']), 3)   # as 3 subespécies
        del d['raca']['variantes']['fisico']['inseto-barata']
        self.assertEqual(validar.checa_fisico('raça inseto', d['raca']),
                         ["raça inseto: sem vida/altura/peso na raça nem em toda variante (faltam ['inseto-barata'])"])

    def test_status_fora_do_vocabulario_falha(self):
        f, d = self._json('data', 'racas', 'anao.json')
        d['raca']['tecnica']['status'] = 'PENDENTE'
        self._grava(f, d)
        saida = self.roda()
        self.assertIn('blocos', validar.falhas)
        self.assertIn("tecnica.status = 'PENDENTE' fora do vocabulário", saida)

    def test_pendente_sem_pergunta_conhecida_falha(self):
        f, d = self._json('data', 'racas', 'anao.json')
        d['raca']['tecnica']['pergunta'] = 'nao-existe'
        self._grava(f, d)
        saida = self.roda()
        self.assertIn('blocos', validar.falhas)
        self.assertIn("pendente sem pergunta", saida)

    def test_medidor_omisso_sem_pergunta_falha(self):
        f, d = self._json(validar.PENDENTES_BAL)
        d['itens'] = [i for i in d['itens'] if i['id'] != 'medidor-minimo']
        self._grava(f, d)
        saida = self.roda()
        self.assertIn('blocos', validar.falhas)
        self.assertIn('classe monge: recurso.medidores.0.min = None', saida)

    def test_pergunta_sem_uso_avisa(self):
        f, d = self._json(validar.PENDENTES_BAL)
        d['itens'].append({'id': 'respondida', 'rodada': 5, 'pergunta': 'x', 'campos': ['classe nada: y']})
        self._grava(f, d)
        saida = self.roda()
        self.assertNotIn('blocos', validar.falhas, saida)
        self.assertIn('AVISO  pergunta respondida (rodada 5) sem campo pendente', saida)


class Medidores(unittest.TestCase):
    def test_inicio_e_recarga_so_do_que_o_texto_declara(self):
        rec = {'texto': ['Momentum. Você começa todo combate com <strong>0 de Fluxo</strong>, você ganha…'],
               'regras': ['Ao fim do combate, se passar 1 rodada sem ganhar Fluxo, você perde todo seu Fluxo.'],
               'recarga': [{'rotulo': 'x', 'texto': 'Você pode <em>Buscar Reagentes</em> como sua ação de '
                                                     'descanso curto, recuperando 1d4+Nível de reagentes.'}]}
        self.assertEqual(blocos.inicio_medidor(rec), {'evento': 'inicioCombate', 'quando': 'todo combate',
                                                      'valor': 0, 'fonte': 'recurso.texto.0'})
        self.assertEqual(blocos.recarga_medidor(rec), [
            {'evento': 'fimCombate', 'valor': 0, 'condicao': 'se passar 1 rodada sem ganhar Fluxo',
             'fonte': 'recurso.regras.0'},
            {'evento': 'descansoCurto', 'acao': 'Buscar Reagentes', 'formula': '1d4+Nível',
             'fonte': 'recurso.recarga.0.texto'}])
        self.assertIsNone(blocos.inicio_medidor({'texto': ['Nada declarado.']}))
        self.assertIsNone(blocos.recarga_medidor({'texto': ['Nada declarado.']}))

    def test_inicio_com_ocasiao_desconhecida_derruba(self):
        with self.assertRaises(ValueError):
            blocos.inicio_medidor({'texto': ['Você começa cada descanso com 2 de Fúria.']})

    def test_fisico_da_subespecie(self):
        corpo = ('<div class="subspecie-physical">\n <strong>Vida:</strong> 50-80 anos · '
                 '<strong>Altura:</strong> 1,60m - 2,40m · <strong>Peso:</strong> 80kg - 120kg\n</div>')
        self.assertEqual(blocos._fisico_card(corpo), {'vida': '50-80 anos', 'altura': '1,60m - 2,40m',
                                                      'peso': '80kg - 120kg'})


if __name__ == '__main__':
    unittest.main()
