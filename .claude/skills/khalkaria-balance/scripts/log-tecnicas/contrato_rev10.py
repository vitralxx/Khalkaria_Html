"""Contrato regras-ficha/1.1, rev. 9 -> rev. 10: terceira leva de respostas do Pedro (2026-09-28), D124–D126.

Fonte: references/17-respostas-T-e-sync.md §1c. Tudo gravado no Notion e conferido por fetch no mesmo dia.
Roda uma vez sobre a rev. 9; recusa rodar de novo. Grava com json.dumps(indent=2, ensure_ascii=False), sem
newline final. Não cita nome de carta rara.
"""
import json, os

AQUI = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(AQUI, '..', '..', 'references', 'ficha-digital-regras.json')
d = json.load(open(P, encoding='utf-8'))

def req(c, msg):
    if not c: raise SystemExit('falhou: ' + msg)

req(d['geradoEm'].startswith('2026-09-28 (rev. 9'), 'esperava a rev. 9')

def depois(obj, chave, novos):
    itens = list(obj.items()); obj.clear()
    for k, v in itens:
        obj[k] = v
        if k == chave: obj.update(novos)
    req(chave in obj, 'chave ' + chave)

d['geradoEm'] = ('2026-09-28 (rev. 10: ação livre de custo variável, D126; ver 17-respostas-T-e-sync.md §1c. '
                 + d['geradoEm'][len('2026-09-28 ('):])

t = d['turno']
t['acaoLivreTecnicaNota'] += (' D126: não há exceção entre as técnicas de ação livre das classes (Destruir, Barreira Instintiva, '
                              'Sangue por Aço, Passo Afiado, Trêbado, Golpe Sequencial): todas 1 vez por turno; o custo variável se '
                              'escolhe dentro desse único uso.')
depois(t, 'acaoLivreTecnicaNota', {
    'acaoLivreCustoVariavel': {
        'regra': 'Numa técnica de custo variável, você escolhe quanto pagar nesse uso, até o limite que o texto der.',
        'status': 'canonico',
        'fonte': ('D126 (Pedro: "Barreira instintiva você continua gastando 1 ação livre e pode ganhar quanto quiser do benefício '
                  'gastando mais stamina, as outras devem ter o mesmo conceito."), notion-sistema > Sua Rodada (gravado em 2026-09-28)'),
        'casos': [
            {'fonte': 'teurgo-barreira-instintiva', 'custo': '1 Éter por 1d4 de dano reduzido', 'teto': 'Éter gasto = Nível', 'status': 'canonico'},
            {'fonte': 'brutalista-destruir', 'custo': '2 Stamina por +1d6 de dano', 'teto': 'dados adicionais = Nível', 'status': 'canonico'},
            {'fonte': 'espadachim-sangue-por-aco', 'custo': '2 Saúde por 1 Stamina de uma técnica', 'teto': 'o custo da técnica paga', 'status': 'decisao',
             'nota': 'Leitura minha: 1 uso por turno cobre o pagamento de uma técnica; nesse uso você escolhe quanto do custo paga com Saúde.'},
        ]}})

s = json.dumps(d, ensure_ascii=False, indent=2)
req('Santu' not in s and 'Sangria Precisa' not in s, 'cita a rara')
open(P, 'w', encoding='utf-8').write(s)
print('rev. 10 gravada:', len(s), 'bytes')
