# -*- coding: utf-8 -*-
"""Testes da F1d: tools/sync_balanceamento.py (projeção sem raras),
tools/gerar_efeitos.py (compilação) e as checagens [balanceamento], [efeitos]
e [vhelor] (tools/checa_efeitos.py).

Os fixtures do plano (§7 F1d) são itens reais do data/efeitos.json: Mochila
Reforçada, Gambeson (Ae), Escudo de Ferro (reacaoDefender), Mutagênico Maior
(escolha), Flechas Elétricas (municaoAtiva), os 2 sentidos de acumula:false e o
Saco de Dormir (AVISO). As checagens rodam também sobre uma cópia de data/ num
diretório temporário, estragada de propósito.
"""
import copy, json, os, shutil, sys, tempfile, unittest, warnings

TOOLS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAIZ = os.path.dirname(TOOLS)
sys.path.insert(0, TOOLS)
import gerar_efeitos as ge            # noqa: E402
import sync_balanceamento as sb       # noqa: E402
import checa_efeitos as ce            # noqa: E402

EFEITOS = json.load(open(os.path.join(RAIZ, 'data', 'efeitos.json'), encoding='utf-8'))['porId']
VOC = ge.Vocab(json.load(open(ge.DESTINO, encoding='utf-8')))
RECARGAS = {'longo': 'descansoLongo', 'curto': 'descansoCurto', 'combate': 'fimCombate', 'cena': 'fimCombate|fimCena'}


def mods(id_):
    return EFEITOS[id_]['mods']


class Fixtures(unittest.TestCase):
    def test_mochila_capacidade_e_copia(self):
        e = EFEITOS['item-mochila-reforcada']
        self.assertEqual(e['quando'], 'carregado')
        self.assertIs(e['acumulaCopia'], False)
        self.assertEqual({(m['alvo'], m['valor']) for m in e['mods']},
                         {('capacidade.bugigangas', 3), ('capacidade.equipamentos', 1)})
        self.assertTrue(all(m['acumula'] is True for m in e['mods']))

    def test_gambeson_ae_e_namespace(self):
        alvos = {m['alvo'] for m in mods('item-gambeson')}
        self.assertIn('ae.contundente', alvos)
        self.assertEqual(EFEITOS['item-gambeson']['slot'], 'armaduraPesada')
        self.assertIn('recurso.eter.max', {m['alvo'] for m in mods('item-foco-do-vidente')})

    def test_escudo_reacao_defender(self):
        m = [m for m in mods('item-escudo-de-ferro') if m['alvo'] == 'pericia.defender'][0]
        self.assertEqual((m['condicao'], m['valor'], m['quando']), ('reacaoDefender', 1, 'equipado'))

    def test_mutagenico_maior_escolha_no_consumo(self):
        e = EFEITOS['item-mutagenico-maior']
        self.assertEqual(e['mods'], [])
        m = e['consumo']['mods'][0]
        self.assertEqual((m['alvo'], m['op'], m['quando']), ('atributo', 'escolha', 'consumido'))
        self.assertNotIn('valor', m)
        self.assertEqual(m['escolha']['bonus'], {'n': 1, 'valor': 6})

    def test_flechas_eletricas_municao_ativa(self):
        e = EFEITOS['item-flechas-eletricas']
        self.assertEqual((e['quando'], e['slot'], e['compativel']), ('municaoAtiva', 'municao', 'Distância Simples'))
        self.assertEqual(e['mods'][0]['tipo'], 'eletrico')

    def test_dois_sentidos_de_acumula_false(self):
        self.assertEqual(ge.sentido_acumula({'acumula': False, 'verbatim': 'X. O efeito não acumula com outra cópia deste mesmo item.'}), 'copia')
        self.assertEqual(ge.sentido_acumula({'acumula': False, 'verbatim': 'X. Não acumula com outras fontes.'}), 'fontes')
        self.assertEqual(ge.sentido_acumula({'acumula': False, 'verbatim': 'Eleva a qualidade.'}), 'indefinido')
        self.assertEqual(ge.sentido_acumula({'acumula': True, 'verbatim': ''}), 'nenhum')
        self.assertIs(EFEITOS['item-bolsa-de-couro']['acumulaCopia'], False)
        self.assertIs(EFEITOS['item-anel-das-brasas']['acumulaCopia'], True)      # "outras fontes": não é cópia

    def test_saco_de_dormir_indefinido_vira_aviso(self):
        e = EFEITOS['item-saco-de-dormir']
        self.assertIsNone(e['acumulaCopia'])
        self.assertIsNone(e['mods'][0]['acumula'])
        r = ce.checa_efeitos(RAIZ)
        self.assertTrue(any('item-saco-de-dormir' in a and 'sentido' in a for a in r.avisos))

    def test_municao_e_requisito(self):
        a = EFEITOS['item-arma-arremesso']
        self.assertEqual(a['arma']['municao'], 'item-conjunto-de-arremesso')
        self.assertEqual(a['requisito'], [{'attr': 'DES', 'min': 14}])
        self.assertEqual(EFEITOS['item-foco-do-vidente']['requisito'], [{'attr': 'INT', 'min': 12}, {'pericia': 'mistico', 'grau': 1}])
        self.assertEqual(EFEITOS['item-bastao-de-karmath']['requisito'], [{'treino': 'armas-marciais'}])

    def test_excecao_vira_lembrete_e_sai_do_automatico(self):
        e = EFEITOS['item-bastao-de-karmath']
        self.assertEqual(e['arma']['danoExtra'], [])
        self.assertIn('+ 1d6 Radiante contra Teurgos, Corrompidos e Mortos-Vivos', e['lembretes'])

    def test_texto_e_do_bazar_e_marca_so_como_gatilho(self):
        bazar = {x['id']: x for x in json.load(open(os.path.join(RAIZ, 'data', 'bazar.json'), encoding='utf-8'))}
        self.assertTrue(all(e['texto'] == bazar[i]['efeito'] for i, e in EFEITOS.items()))
        self.assertEqual(EFEITOS['item-folha-amarela']['consumo']['marcaVhelor']['soma'], 1)
        self.assertEqual(len(EFEITOS), 612)


class Vocabulario(unittest.TestCase):
    def test_alias_de_alvo(self):
        self.assertEqual(VOC.alvo('saude.max')[1], 'recurso.saude.max')
        self.assertEqual(VOC.alvo('stamina.atual')[1], 'recurso.stamina.atual')
        self.assertEqual(VOC.alvo('saude.temporaria')[1], 'recurso.saude.temporaria')
        self.assertEqual(VOC.alvo('ae.todos')[1], 'ae.todos')
        self.assertEqual(VOC.alvo('recipiente.bugigangas')[2], {'adiado': 'F6'})

    def test_alvo_desconhecido_derruba(self):
        with self.assertRaises(ge.Falha):
            VOC.alvo('sorte.max')
        with self.assertRaises(ge.Falha):
            VOC.alvo('ae.madeira')

    def test_sem_sufixo_so_com_escolha_ou_todos(self):
        self.assertEqual(VOC.alvo('atributo', {'op': 'escolha'})[1], 'atributo')
        with self.assertRaises(ge.Falha):
            VOC.alvo('atributo', {'op': 'soma'})

    def test_mod_com_opcional_op_ou_condicao_desconhecida_derruba(self):
        base = {'alvo': 'ar', 'op': 'soma', 'valor': 1}
        for ruim in ({'sorte': 1}, {'op': 'dobra'}, {'condicao': 'luaCheia'}, {'duracao': '2 dias'}):
            with self.assertRaises(ge.Falha):
                ge.compila_mod(dict(base, **ruim), 'item-x', 'equipado', True, 'canonico', VOC, RECARGAS)

    def test_recarga_vira_evento(self):
        m = ge.compila_mod({'alvo': 'ar', 'op': 'soma', 'valor': 1, 'ativacao': {'usos': 1, 'recarga': 'curto', 'acao': 1}},
                           'item-x', 'equipado', True, 'canonico', VOC, RECARGAS)
        self.assertEqual(m['ativacao']['recarga'], 'descansoCurto')
        self.assertEqual(ge.usos({'n': 1, 'recarga': 'cena'}, RECARGAS), {'n': 1, 'recarga': 'fimCombate|fimCena'})
        with self.assertRaises(ge.Falha):
            ge.usos({'n': 1, 'recarga': 'lua'}, RECARGAS)

    def test_requisito_sem_leitura_derruba(self):
        self.assertEqual(ge.requisito_texto('Inteligência ≥ 12 e Experiente em Místico', VOC),
                         [{'attr': 'INT', 'min': 12}, {'pericia': 'mistico', 'grau': 2}])
        with self.assertRaises(ge.Falha):
            ge.requisito_texto('Carisma ≥ 12', VOC)


class Projecao(unittest.TestCase):
    RARAS = {'limiar-sangria-precisa': 'Sangria Precisa', 'limiar-o-mestre': 'O Mestre',
             'limiar-lamina-eterea': 'Lâmina Etérea'}
    PUBLICO = (['Lâmina Etérea', 'Tinta do Destino'], ['Escreva um evento. O Mestre rola os dados.'])

    def projeta(self, regras, efeitos=None, marcas=None):
        marcas = marcas or {'marcas': [{'n': 1, 'texto': 't'}]}
        efeitos = efeitos or {'itens': {}, 'marcasVhelor': marcas}
        v = {sb.MARCAS: json.dumps(marcas).encode(), sb.EFEITOS: json.dumps(efeitos).encode(),
             'ficha-digital-regras.json': json.dumps(regras, ensure_ascii=False).encode('utf-8')}
        out, tirados = sb.projeta(v, self.RARAS, self.PUBLICO)
        return {a: json.loads(b) for a, b in out.items()}, tirados

    def test_tira_rara_true_fonte_chave_e_frase(self):
        regras = {'lista': [{'fonte': 'x', 'v': 1}, {'fonte': 'y', 'rara': True}, {'fonte': 'limiar-o-mestre'}],
                  'nota': 'Primeira frase. Sangria Precisa (rara) troca o dado.', 'so': 'A rara Sangria Precisa faz tudo.',
                  'limiar-sangria-precisa': {'a': 1}, 'nulo': None}
        out, tirados = self.projeta(regras)
        r = out['ficha-digital-regras.json']
        self.assertEqual(r, {'lista': [{'fonte': 'x', 'v': 1}], 'nota': 'Primeira frase. ' + sb.MARCADOR,
                             'so': sb.MARCADOR, 'nulo': None})
        self.assertEqual(len([t for t in tirados if t[0] == 'ficha-digital-regras.json']), 5)

    def test_frase_citada_vira_marcador_e_chave_fica(self):
        regras = {'status': 'resolvido: está na rara Sangria Precisa.',
                  'nota': 'A Sangria Precisa troca. Sangria Precisa de novo. Fica esta. Sangria Precisa no fim.'}
        r = self.projeta(regras)[0]['ficha-digital-regras.json']
        self.assertEqual(r['status'], sb.MARCADOR)
        self.assertEqual(r['nota'], f'{sb.MARCADOR} Fica esta. {sb.MARCADOR}')

    def test_nome_de_item_e_texto_do_bazar_nao_contam(self):
        regras = {'a': 'A Lâmina Etérea corta.', 'b': 'Escreva um evento. O Mestre rola os dados.'}
        out, _ = self.projeta(regras)
        self.assertEqual(out['ficha-digital-regras.json'], regras)

    def test_marcas_numa_fonte_so(self):
        out, tirados = self.projeta({})
        self.assertEqual(out[sb.EFEITOS]['marcasVhelor'], {'_fonte': sb.MARCAS})
        with self.assertRaises(SystemExit):
            self.projeta({}, efeitos={'marcasVhelor': {'marcas': []}}, marcas={'marcas': [{'n': 1}]})

    def test_projecao_publicada_sem_rara(self):
        r = ce.checa_balanceamento(RAIZ)
        self.assertEqual(r.falhas, [])
        regras = json.load(open(os.path.join(RAIZ, 'data', 'balanceamento', 'ficha-digital-regras.json'), encoding='utf-8'))
        self.assertNotIn('"rara": true', json.dumps(regras))


class ChecagensEmCopia(unittest.TestCase):
    """Roda [balanceamento], [efeitos] e [vhelor] numa cópia estragada de data/."""

    def setUp(self):
        warnings.simplefilter('ignore', ResourceWarning)
        self.raiz = tempfile.mkdtemp(prefix='kh_f1d_')
        shutil.copytree(os.path.join(RAIZ, 'data'), os.path.join(self.raiz, 'data'))
        os.makedirs(os.path.join(self.raiz, 'docs', 'ficha-digital'))
        shutil.copy2(os.path.join(RAIZ, 'docs', 'ficha-digital', '03-respostas-pedro.md'),
                     os.path.join(self.raiz, 'docs', 'ficha-digital'))

    def tearDown(self):
        shutil.rmtree(self.raiz, ignore_errors=True)

    def edita(self, rel, fn):
        p = os.path.join(self.raiz, *rel.split('/'))
        d = json.load(open(p, encoding='utf-8'))
        fn(d)                       # edita no lugar (o retorno é ignorado)
        json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False)

    def test_copia_limpa_passa(self):
        for f in (ce.checa_balanceamento, ce.checa_efeitos, ce.checa_vhelor):
            self.assertEqual(f(self.raiz).falhas, [], f.__name__)

    def copia_privado(self):
        priv = os.path.join(RAIZ, sb.PRIVADO)
        if not all(os.path.exists(os.path.join(priv, a)) for a in sb.ARQUIVOS):
            self.skipTest('privado/balanceamento ausente (rode tools/sync_balanceamento.py)')
        shutil.copytree(priv, os.path.join(self.raiz, sb.PRIVADO))

    def test_projecao_com_crlf_passa(self):
        # core.autocrlf=true sem .gitattributes: o checkout grava a projeção com CRLF
        self.copia_privado()
        for a in sb.ARQUIVOS:
            p = os.path.join(self.raiz, 'data', 'balanceamento', a)
            b = open(p, 'rb').read()
            open(p, 'wb').write(b.replace(b'\n', b'\r\n'))
        r = ce.checa_balanceamento(self.raiz)
        self.assertEqual(r.falhas, [])
        self.assertTrue(any('projeção refeita do privado idêntica' in x for x in r.ok))

    def test_projecao_editada_falha_sem_ok(self):
        self.copia_privado()
        self.edita('data/balanceamento/ficha-digital-regras.json', lambda d: d.update(extra=1))
        r = ce.checa_balanceamento(self.raiz)
        self.assertTrue(any('projeção publicada difere' in x for x in r.falhas))
        self.assertFalse(any('projeção refeita do privado idêntica' in x for x in r.ok))

    def test_item_sem_verbatim_falha(self):
        self.edita('data/balanceamento/ficha-efeitos-itens.json',
                   lambda d: d['itens']['item-armadura-de-couro'].pop('verbatim'))
        r = ce.checa_efeitos(self.raiz)
        self.assertTrue(any('item-armadura-de-couro: sem verbatim' in x for x in r.falhas))

    def test_rara_na_projecao_falha(self):
        self.edita('data/balanceamento/ficha-digital-regras.json',
                   lambda d: d['derivados']['progressaoDeAtaques']['modificadoresConhecidos'].append(
                       {'fonte': 'limiar-carnificina', 'rara': True}))
        self.assertTrue(any('rara oculta' in x for x in ce.checa_balanceamento(self.raiz).falhas))

    def test_alvo_fora_do_vocabulario_falha(self):
        def estraga(d):
            d['itens']['item-gambeson']['modificadores'].append({'alvo': 'sorte.max', 'op': 'soma', 'valor': 1})
        self.edita('data/balanceamento/ficha-efeitos-itens.json', estraga)
        self.assertTrue(any('sorte.max' in x for x in ce.checa_efeitos(self.raiz).falhas))

    def test_verbatim_diferente_do_csv_falha(self):
        self.edita('data/balanceamento/ficha-efeitos-itens.json',
                   lambda d: d['itens']['item-gambeson'].update(verbatim='[Pesada] Ar 9.'))
        self.assertTrue(any('item-gambeson: verbatim' in x for x in ce.checa_efeitos(self.raiz).falhas))

    def test_particao_incompleta_falha(self):
        self.edita('data/balanceamento/ficha-efeitos-itens.json', lambda d: d['semEfeitoNaFicha'].pop())
        self.assertTrue(any('[1] partição' in x for x in ce.checa_efeitos(self.raiz).falhas))

    def test_capacidade_cruzada_falha(self):
        def estraga(b):
            for x in b:
                if x['id'] == 'item-mochila-reforcada':
                    x['inv']['capacidade'] = {'bug': 4, 'equip': 1}
        self.edita('data/bazar.json', estraga)
        self.assertTrue(any('[4] capacidade' in x for x in ce.checa_efeitos(self.raiz).falhas))

    def test_excecao_obsoleta_falha_e_defeito_novo_falha(self):
        def errata(d):
            d['armas']['item-machado-da-furia']['danoExtra'][0]['condicao'] = '1x/alvo'
        self.edita('data/balanceamento/ficha-efeitos-itens.json', errata)
        f = ce.checa_efeitos(self.raiz).falhas
        self.assertTrue(any('exceção obsoleta item-machado-da-furia' in x for x in f))

    def test_mod_ruim_na_saida_falha(self):
        self.edita('data/efeitos.json', lambda d: d['porId']['item-gambeson']['mods'][0].update(fonte={'tipo': 'item', 'id': 'item-x'}))
        self.assertTrue(any('[8] item-gambeson' in x for x in ce.checa_efeitos(self.raiz).falhas))

    def test_marca_diferente_do_pedro_falha(self):
        self.edita('data/balanceamento/marcas-vhelor.json', lambda d: d['marcas'][1].update(texto='−20 de Éter máximo.'))
        self.assertTrue(any('marca 2' in x for x in ce.checa_vhelor(self.raiz).falhas))

    def test_marca_sem_buraco(self):
        self.edita('data/balanceamento/marcas-vhelor.json', lambda d: d['marcas'].pop(3))
        self.assertTrue(any('1..7' in x for x in ce.checa_vhelor(self.raiz).falhas))

    def test_texto_de_marca_repetido_falha(self):
        mv = json.load(open(os.path.join(self.raiz, 'data', 'balanceamento', 'marcas-vhelor.json'), encoding='utf-8'))
        self.edita('data/balanceamento/ficha-efeitos-itens.json', lambda d: d.update(marcasVhelor=copy.deepcopy(mv)))
        self.assertTrue(any('fonte única' in x for x in ce.checa_vhelor(self.raiz).falhas))
        self.assertTrue(any('marcasVhelor' in x for x in ce.checa_balanceamento(self.raiz).falhas))


if __name__ == '__main__':
    unittest.main()
