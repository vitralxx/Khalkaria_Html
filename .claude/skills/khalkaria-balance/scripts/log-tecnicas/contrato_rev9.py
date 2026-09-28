"""Contrato regras-ficha/1.1, rev. 8 -> rev. 9: segunda leva de respostas do Pedro (2026-09-28), D118–D123.

Fonte: references/17-respostas-T-e-sync.md §1b. Tudo gravado no Notion e conferido por fetch no mesmo dia.
Roda uma vez sobre a rev. 8; recusa rodar de novo. Grava com json.dumps(indent=2, ensure_ascii=False), sem
newline final. Não cita nome de carta rara (o sync do site troca a frase por um marcador).
"""
import json, os

AQUI = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(AQUI, '..', '..', 'references', 'ficha-digital-regras.json')
d = json.load(open(P, encoding='utf-8'))

def req(c, msg):
    if not c: raise SystemExit('falhou: ' + msg)

req(d['geradoEm'].startswith('2026-09-28 (rev. 8'), 'esperava a rev. 8')
G = 'gravado em 2026-09-28 (diff conferido)'

def depois(obj, chave, novos):
    itens = list(obj.items()); obj.clear()
    for k, v in itens:
        obj[k] = v
        if k == chave: obj.update(novos)
    req(chave in obj, 'chave ' + chave)

d['geradoEm'] = ('2026-09-28 (rev. 9: segunda leva de respostas do Pedro, D118–D123: média da raridade, condições mentais, '
                 'requisitos de conjuração; ver 17-respostas-T-e-sync.md §1b. ' + d['geradoEm'][len('2026-09-28 ('):])

# ---------------- D121: média da raridade
r = d['recursos']
mr = r['atributoCuraItemMediaDaRaridade']
for k in ('pergunta', 'provisorio'): mr.pop(k, None)
mr['status'] = 'canonico'
mr['fonte'] = 'D121 (Pedro: "Média de raridade ok"), notion-sistema > Status > Regras dos status (' + G + ')'
mr['cobre'] = 'as 11 poções, elixires e kits com +Int do Bazar são Ordinário, Incomum, Exótico ou Luxária'
velho = 'Item comprado soma a média da raridade."'
req(r['atributoCuraItemFonte'].endswith(velho), 'atributoCuraItemFonte')
r['atributoCuraItemFonte'] = (r['atributoCuraItemFonte'][:-len(velho)] +
    'Item comprado soma a média da raridade: Ordinário +1, Incomum +2, Exótico +3, Luxária +4." (D117 + D121)')

# ---------------- D122: condições mentais
tx = d['taxonomiaDeCondicao']
req(tx['mental'] == ['enfeiticado', 'amedrontado', 'confuso', 'atordoado'], 'lista mental')
tx['mentalStatus'] = 'canonico'
tx['mentalFonte'] = ('D122 (Pedro: "condições mentais (Enfeitiçado, Amedrontado, Confuso, Atordoado)"), notion-condicoes > topo: '
                     '"Condições mentais: Enfeitiçado, Amedrontado, Confuso e Atordoado." (' + G + '). Antes a única lista escrita '
                     'estava no texto de uma carta rara do Limiar.')
notas = tx['mentalNotas']
req(notas[0].startswith('Oco conta como mental por implicação'), 'nota do Oco')
notas[0] = ('Oco não é condição mental (D122). O "exceto Oco" do pacto da Grande Árvore (Teurgo, "remove alguma condição mental, '
            'exceto Oco") fica redundante; não muda nada.')
i = [n for n, x in enumerate(notas) if x.startswith('O grupoUI "mentais" do site')]
req(len(i) == 1, 'nota do grupoUI')
notas[i[0]] = ('O grupoUI "mentais" do site (Confuso, Amedrontado, Descontrolado, Enfeitiçado, Bêbado) é agrupamento de interface '
               'e não bate com a lista canônica: tem Descontrolado e Bêbado, não tem Atordoado. Imunidade, vantagem e remoção de '
               '"condição mental" (Veterano, Grande Árvore, Monge Ápatico) consultam a tag, não o grupo. Alinhar o grupo é decisão do site.')
atord = [n for n, x in enumerate(notas) if x.startswith('Atordoado está nas DUAS listas')]
req(len(atord) == 1, 'nota do Atordoado')
notas[atord[0]] = notas[atord[0]].replace('(mental na lista do Limiar,', '(mental pela D122,')

# ---------------- D123: requisitos de conjuração
rq = d['magia']['requisitos']
rq['regra'] = 'Treinado em Místico + Foco da escola equipado'
rq['motivo'] = ('P42 - "avisar", não "bloquear" (PD1: todo campo é editável). A leitura antiga ("Cultista e Corrompido conjuram SEM o '
                'gate") caiu com a D123: só o texto que dá a magia dispensa um requisito, e só o que ele disser.')
depois(rq, 'regra', {
    'dispensa': {
        'regra': 'Conjurar sem ser Treinado em Místico ou sem o Foco só é possível quando a classe, raça ou origem que dá a magia diz isso explicitamente.',
        'status': 'canonico',
        'fonte': 'D123 (Pedro: "conjuração sem treinado em místico é possível só quando a técnica explicita, fora isso é sempre com '
                 'treinamento em místico e foco místico"), notion-magias > Regras de Magia e notion-sistema > Magia (' + G + ')',
        'casos': [
            {'fonte': 'corrompido-receptaculo-natural', 'dispensa': ['foco'], 'exige': ['treinadoMistico'], 'status': 'canonico',
             'verbatim': 'Você pode conjurar duas magias de nível 1 de qualquer escola sem um foco designado, mas ao fazer isso rola Vontade (CD 12), recebendo 1d4 de dano Psíquico em caso de falha.'},
            {'fonte': 'origem-cultista', 'dispensa': [], 'exige': ['treinadoMistico', 'foco'], 'status': 'canonico',
             'nota': 'O Cultista treina Religião ou Místico: com Religião, não conjura as 2 magias até ser Treinado em Místico por outra fonte.',
             'verbatim': 'Você conhece e consegue canalizar 2 magias de nível 1 de qualquer escola, porém deve canalizá-las através de um foco.'},
            {'fonte': 'alquimista-cartucho-arcano', 'dispensa': ['treinadoMistico', 'foco'], 'status': 'decisao',
             'nota': 'Leitura minha: "qualquer criatura pode conjurar" é dispensa explícita para quem USA o cartucho. Quem cria rola Místico.',
             'verbatim': 'Qualquer criatura pode conjurar a magia infundida no cartucho, porém usa seus atributos como base dos CDs e ataques da magia respeitando, também, o custo de ações da magia.'},
        ]}})

# ---------------- D118: Cartucho, mínimo 1
for p in d['pendenciasNotion']:
    if p.get('n') == 19:
        velho = '. Aberto: cartucho de truque sai com 0 Reagentes (mínimo 1?)'
        req(p['status'].endswith(velho), 'status da pendência 19')
        p['status'] = p['status'][:-len(velho)] + '; "(mínimo 1)" nos Reagentes gravado no mesmo dia (D118).'
        break
else:
    req(False, 'pendência 19')

s = json.dumps(d, ensure_ascii=False, indent=2)
req('Santu' not in s and 'Sangria Precisa' not in s, 'cita a rara')
open(P, 'w', encoding='utf-8').write(s)
print('rev. 9 gravada:', len(s), 'bytes')
