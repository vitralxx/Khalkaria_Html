"""Contrato regras-ficha/1.1, rev. 7 -> rev. 8: respostas do Pedro às T1–T19 (D98–D117).

Fonte das decisões: references/17-respostas-T-e-sync.md §1. Todas já gravadas no Notion (2026-09-28).
Roda uma vez sobre a rev. 7; recusa rodar de novo (confere o geradoEm).
Grava com json.dumps(indent=2, ensure_ascii=False), sem newline final, como as revisões anteriores.
Não cita nome de carta rara (o sync do site apaga frases que citam rara oculta).
"""
import json, os

AQUI = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(AQUI, '..', '..', 'references', 'ficha-digital-regras.json')
d = json.load(open(P, encoding='utf-8'))

def req(c, msg):
    if not c: raise SystemExit('falhou: ' + msg)

req(d['geradoEm'].startswith('2026-09-27 (rev. 7'), 'esperava a rev. 7')
NS = 'notion-sistema 2b76e3a4, gravado em 2026-09-28 (diff conferido)'

def depois(obj, chave, novos):
    """Insere os pares de `novos` logo depois de `chave`, mantendo a ordem do dict."""
    itens = list(obj.items()); obj.clear()
    for k, v in itens:
        obj[k] = v
        if k == chave: obj.update(novos)
    req(chave in obj, 'chave ' + chave)

d['geradoEm'] = ('2026-09-28 (rev. 8: respostas do Pedro às T1–T19, D98–D117, gravadas no Notion; ver 17-respostas-T-e-sync.md. '
                 + d['geradoEm'][len('2026-09-27 ('):])
d['_numeracao'] = d['_numeracao'].replace(
    'Tn = pergunta aberta ao Pedro no mesmo arquivo.',
    'Tn = pergunta ao Pedro no mesmo arquivo; as respostas (D98–D117) estão em 17-respostas-T-e-sync.md.')
req('17-respostas' in d['_numeracao'], '_numeracao')

# ---------------- turno: D98, D99, D100, D101, T11a, desarmado
t = d['turno']
t['acaoLivreFonte'] = (NS + ' > Sua Rodada: "Ações livres não têm limite por turno, mas cada técnica usada como ação livre '
                       'só pode ser usada 1 vez por turno, salvo quando o texto dela diz outra coisa." (PD18 + D99)')
depois(t, 'acaoLivreFonte', {
    'acaoLivreTecnicaMaxPorTurno': 1,
    'acaoLivreTecnicaStatus': 'canonico',
    'acaoLivreTecnicaFonte': 'D99 (Pedro, T1: "Quase toda técnica de ação livre só pode ser utilizada 1x/turno."), ' + NS + ' > Sua Rodada',
    'acaoLivreTecnicaNota': ('Conta por técnica: técnicas diferentes de ação livre podem ser usadas no mesmo turno, uma vez cada. '
                             '"Por turno" é cada turno, inclusive o de outra criatura: técnica com gatilho fora do seu turno '
                             '(Parry Perfeito, Passo Afiado) pode ser usada 1 vez em cada turno inimigo. Texto da técnica que diz '
                             'outra coisa prevalece (Cadeia de Golpes: "até 2 vezes por turno"). Substitui a leitura G2 do '
                             '16-log-tecnicas.'),
})
t['reacaoNota'] = (t['reacaoNota'] + ' D98: técnica que permite retaliar sem gastar reação preserva a reação, que pode ser usada '
                   'de novo como reação.')
depois(t, 'reacaoNota', {
    'retaliacaoSemGastarReacao': {
        'preservaReacao': True,
        'status': 'canonico',
        'fonte': 'D98 (Pedro, T1), ' + NS + ' > Sua Rodada',
        'verbatim': 'Técnicas que permitem retaliar sem gastar reação preservam a reação: ela pode ser usada de novo como reação.',
        'exemplos': ['espadachim-parry-perfeito', 'espadachim-guardar-a-lamina', 'espadachim-inimigo-mortal', 'espadachim-sentenca-final'],
    }})
req(t['pmaNota'].endswith('O nome "PMA" ainda não está definido no Sistema (pergunta T5).'), 'pmaNota')
t['pmaNota'] = t['pmaNota'].replace('O nome "PMA" ainda não está definido no Sistema (pergunta T5).',
                                    'Nome e regra estão no Sistema > Atacar desde 2026-09-28 (D29 + D100).')
t['pmaEmTecnicaStatus'] = 'canonico'
depois(t, 'pmaEmTecnicaStatus', {
    'pmaEmTecnicaFonte': ('D100 (Pedro, T1: "Pma sempre vale exceto quando a técnica diz o contrário."), ' + NS +
                          ' > Atacar: "vale em todo ataque, inclusive de técnica, salvo quando a técnica diz o contrário"'),
    'multiAtaqueComoUmaAcao': {
        'custo': 'custoAtacarDaArma',
        'regra': 'Técnicas que fazem vários ataques "como 1 ação" pagam, juntos, o custo de ataque da arma (Atacar(n)).',
        'exemplos': ['espadachim-lamina-rapida', 'espadachim-massacre', 'artilheiro-rajada-de-tiros'],
        'efeitoNaFicha': 'Rajada de Tiros com arma de fogo (Atacar(2)) custa 2 ações; Lâmina Rápida com Pesada custa 2, com Pesada Brutal 3.',
        'status': 'canonico',
        'fonte': 'D101 (Pedro, T2: "Faz sentido, pode ser."), ' + NS + ' > Atacar',
    }})
depois(t, 'conjuracoesFonte', {
    'conjuracoesExcecoes': [
        {'fonte': 'teurgo-encadeamento', 'regra': 'uma segunda magia no mesmo turno, se puder pagar as ações; Éter adicional = ações dela; 3 Stamina a cada uso',
         'status': 'canonico', 'origem': 'T11a (Pedro: "resto ok"), notion-teurgo > Encadeamento, gravado em 2026-09-28'},
        {'fonte': 'teurgo-receptaculo-perfeito', 'regra': 'durante a ultimate: mais de uma magia por rodada',
         'status': 'canonico', 'origem': 'notion-teurgo > Receptáculo Perfeito'},
    ]})
t['custoDeAcao']['desarmado'] = {'custo': 1, 'ver': 'dano.desarmado', 'status': 'canonico', 'fonte': 'T12e, ' + NS + ' > Armas'}

# ---------------- dano: ataque desarmado base (T12e)
dn = d['dano']
dn['atributoPorArma']['desarmado'] = 'DES'
dn['acertoPorArma']['desarmado'] = 'atacar'
depois(dn, 'acertoPorArma', {
    'desarmado': {
        'dado': '1d4', 'tipo': 'contundente', 'acoes': 1, 'atributoAcerto': 'DES', 'atributoDano': 'DES',
        'status': 'canonico', 'fonte': 'T12e (Pedro: "Ok"), ' + NS,
        'verbatim': 'Desarmado: 1d4 de dano Contundente. O acerto usa a perícia atacar com Mod. de Destreza, dano dá +Mod. de Destreza. Custa 1 ação.',
        'substituicoes': [{'fonte': 'monge-arma-humana', 'dado': '1d8', 'status': 'canonico',
                           'verbatim': 'Seus ataques desarmados causam 1d8 de dano (Ao invés de 1d4).'}],
    }})

# ---------------- magia: D103
it = d['magia']['intensidadeSubidaPorTecnica']
for k in ('pergunta', 'provisorio'): it.pop(k, None)
it['status'] = 'canonico'
it['fonte'] = ('D103 (Pedro, T4: "Ok."), notion-sistema e notion-magias > Transbordante: "Quando uma técnica sobe a intensidade, '
               'você paga a intensidade que declarou e não rola o teste de Vontade." (gravado em 2026-09-28)')

# ---------------- classes: D102, D105, D110
esp = d['classes']['espadachim']
esp['recursoDeClasse'] = {
    'status': 'canonico', 'contador': False, 'tipo': 'caracteristicas',
    'itens': ['Proficiência com Espadas', 'Marca do Duelo'],
    'fonte': 'D105 (Pedro, T6: "o do espadachim é proficiência com espadas e marca do duelo")',
    'nota': 'Não é contador: a ficha não mostra contador livre. A Marca do Duelo já está em estados.'}
esp['espada'] = {
    'definicao': 'arma corpo a corpo que causa dano Cortante',
    'status': 'canonico',
    'fonte': 'D102 (Pedro, T3), notion-espadachim > Proficiência com Espadas: "espada (arma corpo a corpo que causa dano Cortante)" (gravado em 2026-09-28)',
    'usadoPor': ['Proficiência com Espadas', 'Pedra de Amolar']}
teu = d['classes']['teurgo']
teu['recursoDeClasse'] = {
    'status': 'canonico', 'contador': False, 'tipo': 'caracteristicas',
    'itens': ['Escolas do Primórdio'],
    'fonte': 'D105 (Pedro, T6: "o teurgo são as escolas do primórdio")',
    'nota': '2 escolas no nível 1, +1 no 3, +2 no 5 (Primordial exige nível 5); cada escola pede o Foco dela. O contador é o Éter.'}
flx = d['classes']['monge']['recursos'][0]
req(flx['id'] == 'fluxo', 'fluxo')
e1, e2 = flx['excecoes'][1], flx['excecoes'][2]
req(e1['fonte'] == 'monge-fluxo-invertido' and e2['fonte'].startswith('monge-insurgencia'), 'exceções do Fluxo')
for e in (e1, e2):
    for k in ('pergunta', 'provisorio'): e.pop(k, None)
    e['status'] = 'canonico'
e1['origem'] = 'D110 (T12a), notion-monge > Fluxo Invertido: "+1 Fluxo ao receber dano (em vez de perder todo o Fluxo)" (gravado em 2026-09-28)'
e2['origem'] = ('D110 (T12b), notion-monge > Fluxo: "Você não pode perder fluxo de nenhuma outra forma, exceto quando o texto de uma '
                'técnica diz que você perde Fluxo." (gravado em 2026-09-28)')

# ---------------- recursos: D117
r = d['recursos']
r['atributoCuraItemMotivo'] = ('L08 e D117, Pedro (T19): "Sempre usa a int de quem fabricou a poção, ela fica gravada com aquele '
                               'modificador. Poção comprada soma media da raridade." O item guarda o Mod.INT de quem o fez; '
                               'item comprado, sem fabricante, usa a média da raridade.')
r['atributoCuraItemPorTipo'] = {'pocao': 'fabricante', 'elixir': 'fabricante', 'kit': 'fabricante'}
r['atributoCuraItemStatusPorTipo'] = {'pocao': 'canonico', 'elixir': 'canonico', 'kit': 'canonico'}
r['atributoCuraItemSemFabricante'] = 'mediaDaRaridade'
depois(r, 'atributoCuraItemSemFabricante', {
    'atributoCuraItemFonte': (NS + ' > Status > Regras dos status: "+Int de poções, elixires e kits é a Inteligência de quem '
                              'fabricou o item, que fica gravada nele. Item comprado soma a média da raridade."'),
    'atributoCuraItemMediaDaRaridade': {
        'ordinario': 1, 'incomum': 2, 'exotico': 3, 'luxaria': 4,
        'status': 'pedroDecide', 'pergunta': 'tabela da "média da raridade" (17-respostas-T-e-sync.md §2)',
        'provisorio': 'a ficha usa esta proposta até o Pedro responder'},
})

# ---------------- condições mentais (T16d): pergunta devolvida
tx = d['taxonomiaDeCondicao']
n = [i for i, x in enumerate(tx['mentalNotas']) if 'Confirmação pedida ao Pedro (T16)' in x]
req(len(n) == 1, 'mentalNotas T16')
tx['mentalNotas'][n[0]] = tx['mentalNotas'][n[0]].replace(
    'Confirmação pedida ao Pedro (T16).',
    'O Pedro perguntou onde está a lista (T16d, 2026-09-28); a resposta e a pergunta de qual lista vale estão no 17-respostas-T-e-sync.md.')

# ---------------- progressão de ataques: Rajada (D101)
for m in d['derivados']['progressaoDeAtaques']['modificadoresConhecidos']:
    if m['fonte'] == 'artilheiro-rajada-de-tiros':
        m['custo'] = 'Atacar(n) da arma de fogo (D101; 2 ações com as armas de fogo do Bazar), 3 Stamina'
        break
else:
    req(False, 'rajada')

# ---------------- pendências do Notion: Cartucho (T13a)
for p in d['pendenciasNotion']:
    if p.get('n') == 19:
        p['status'] += ('; L18 gravado em 2026-09-27. Fórmula do Cartucho reescrita em 2026-09-28 (T13a): Reagentes e CD pelo custo '
                        'base de Éter; Nível 5 exige Foco Primordial. Aberto: cartucho de truque sai com 0 Reagentes (mínimo 1?)')
        break
else:
    req(False, 'pendência 19')

# ---------------- nota antiga com nome e efeito de carta rara (condição Sangramento)
sg = d['condicoes'][7]
req(sg['nota'].endswith(' Sangria Precisa (rara) troca o dado para d6: Xd6.'), 'nota do Sangramento')
sg['nota'] = sg['nota'][:-len(' Sangria Precisa (rara) troca o dado para d6: Xd6.')]

s = json.dumps(d, ensure_ascii=False, indent=2)
req('Santu' not in s and 'Sangria Precisa' not in s, 'cita a rara')
open(P, 'w', encoding='utf-8').write(s)
print('rev. 8 gravada:', len(s), 'bytes')
