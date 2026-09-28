# Revisão 2 do 16-log-tecnicas (2026-09-28): segunda leva de respostas do Pedro (D118–D123).
# Fonte: references/17-respostas-T-e-sync.md §1b. Tudo o que diz "gravado" foi conferido por fetch no Notion.
# Camada por cima da Revisão 1: o build16 guarda o status anterior em statusRev1.

DATA = '2026-09-28'

# (tema, resposta do Pedro verbatim, decisão)
RESP2 = [
 ('Cartucho Arcano', 'Mínimo 1 no cartucho', 'D118'),
 ('Caçador', 'caçador só possui 1 arma à distância. Pensar no futuro adicionar itens mais únicos nas origens.', 'D119 + ideia futura'),
 ('Coragem Líquida', 'Coragem líquida é a cada 5 combates, você ganha +1 movimento.', 'D120'),
 ('Média da raridade', 'Média de raridade ok, bote no changelog a possiblidade de fazer uma função de comerciante no site html, simplfica para a sessão eu poder abrir uma loja na hora e mostrar aos jogadores na tela.', 'D121 + pedido ao site'),
 ('Condições mentais', 'Condições mentais: condições mentais (Enfeitiçado, Amedrontado, Confuso, Atordoado)', 'D122'),
 ('As Vozes', 'As vozes é só o 1 natural no dado', 'a confirmar: qual dado'),
 ('Conjuração sem Místico', 'conjuração sem treinado em místico é possível só quando a técnica explicita, fora isso é sempre com treinamento em místico e foco místico.', 'D123'),
]

GRAV = 'Gravado no Notion (2026-09-28): '

REV2 = {
 'alquimista-cartucho-arcano-2': ('resolvido', 'D118. ' + GRAV + '"Custo de Criação: Reagentes iguais ao custo base de Éter da magia (mínimo 1)". O cartucho de truque custa 1 Reagente, CD 10.'),
 'origem-cacador-itens': ('resolvido', 'D119: o Caçador tem só 1 arma à distância. ' + GRAV + 'a linha "1 Arma Distância Simples" saiu; ficou "1 Arma à Distância (1 Equipamento)". Itens mais únicos nas origens ficam como ideia para o futuro.'),
 'espadachim-coragem-liquida': ('resolvido', 'D120: a cada 5 combates vitoriosos sob Bêbado, +1 permanente na perícia Movimento (máx. +5). É o que o Notion já diz; nada a gravar.'),
 'corrompido-as-vozes': ('pedroDecide', 'O Pedro respondeu "é só o 1 natural no dado". Falta confirmar qual dado: só o d20 de testes e ataques, ou qualquer dado, dano incluso, como o Notion diz hoje ("em qualquer dado"). Até lá a ficha segue o Notion.'),
 'corrompido-receptaculo-natural': ('resolvido', 'D123: o traço dispensa só o foco ("sem um foco designado"); o Treinado em Místico continua exigido. A leitura antiga (o traço vencia o requisito de Místico) caiu. ' + GRAV + 'Magias e Sistema, "Conjurar sem ser Treinado em Místico ou sem o Foco só é possível quando a classe, raça ou origem que dá a magia diz isso explicitamente."'),
 'origem-cultista': ('resolvido', 'D123: "consegue canalizar… através de um foco" não dispensa nada; exige Treinado em Místico e foco. O Cultista que treinou Religião só conjura as 2 magias quando for Treinado em Místico. A leitura antiga caiu.'),
 'origem-soldado': ('resolvido', 'D122. ' + GRAV + 'topo da página Condições, "Condições mentais: Enfeitiçado, Amedrontado, Confuso e Atordoado." O Veterano usa essa lista.'),
}

# Fora dos achados, no mesmo dia
EXTRA = [
 'D76 na tabela do Alquimista: a escada de poção já estava no CSV, e a tabela da classe no Notion ainda tinha os dados antigos. ' + GRAV + 'Poção de Cura Maior 5d8+Int (era 4d8), Poção de Vigor Maior 3d8 (era 2d6), Poção de Cura Suprema 8d10+Int (era 6d8), Poção de Vigor Suprema 5d10 (era 3d8). Comparação por script: nenhuma outra divergência de dado, CD ou Reagente entre a tabela e o CSV.',
 'Pedido ao agente de HTML: registrar no CHANGELOG do site a ideia da função de comerciante (texto pronto no 17-respostas-T-e-sync.md §3.4).',
]

ABERTAS2 = [
 ('As Vozes', '"só o 1 natural no dado": só o d20 (testes e ataques) ou qualquer dado, inclusive dano? Hoje o Notion diz "em qualquer dado"; num ataque de 4d6, 52% das rolagens têm um 1.'),
 ('Tabela do Alquimista', '21 itens de Alquimia do CSV (Obtenção "Alquimista") não estão na tabela da classe: bebidas, venenos novos, Elíxires de Éter, Poção de Vigor Moderada, Elixir da Expurgação e outros. Entram na tabela, ou ela fica só com as fórmulas fundamentais? E o nome: "Lágrima do Tempo" na classe, "Lágrimas do Tempo" no CSV.'),
 ('D99 "quase toda"', 'ao pé da letra, passam a 1 vez por turno: Destruir, Barreira Instintiva, Sangue por Aço, Passo Afiado, Trêbado, Golpe Sequencial e as passivas com efeito de ação livre (Passo do Vento do Artilheiro, Ponto Fraco, Resistência Adaptável). Alguma é exceção?'),
 ('Lote anterior', 'L14, L35, L39.'),
 ('Batedor', 'rework inteiro, depois o log do novo Batedor.'),
]
