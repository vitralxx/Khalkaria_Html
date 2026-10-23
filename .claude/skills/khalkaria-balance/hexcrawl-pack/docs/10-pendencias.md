# 10 · Pendências

Quando o Pedro responder, atualize **esta tabela** e `01-regras.md`, e troque a constante no código. Nunca preencha
uma pendência por conta própria.

## 1. Perguntas ao Pedro (a recomendação vem primeiro)
| # | Pergunta | Recomendação | Afeta |
|---|---|---|---|
| P1 | O hex passa a ser de **topo chato**? Os tiles do kit são de topo chato. | Sim. A arte manda, e a imagem 2 de expectativa também é de topo chato | tudo; F1 |
| P2 | Ao **explorar**, o restante do dia cai até o limiar do período seguinte? Ex.: manhã com 7,5 m de 9 vira tarde com 6 m. | Sim. Assim o relógio e o movimento andam juntos | F4 |
| P3 | **Só explorar rola** a tabela do hex? Virar o período andando não rola nada, e o descanso só traz a emboscada do Sistema, por decisão do mestre. | Sim | F4 |
| P4 | Raio de visão da **Montanha**: 3 (da lista confirmada) ou 4 ("+3" sobre o padrão 1)? | 3 | F5 |
| P5 | As **duas versões do mapa**: a ilusão do Oásis aparece para os jogadores até eles descobrirem o Abismo, ou é só referência? | Se aparece, o app ganha uma "camada de ilusão": tipo e tile alternativos nos hexes afetados, mostrados aos jogadores até o mestre revelar | F3, F5 |
| P6 | **Materiais:** aprova os até 4 por região (`mundo.json`)? E a regra do sítio: ele oferece os Materiais da região que listam o tipo do hex, e cada personagem escolhe um e rola? | Sim | F6 |
| P7 | As peças **verdes** da folha de vias são **trilha**? | Estrada e trilha desenhadas por código: a estrada em cinza, a trilha em terra. As verdes ficam de alternativa | F1 |
| P8 | **Ermo:** areia e rochas com tinta cinza e dessaturada (cinzas)? E o tile **laranja listrado** é plantação? | Sim nos dois. O laranja vira variante de Campos perto de assentamento | F1 |
| P9 | A **Jornada** rola no **fim do dia**, antes do descanso, com a maior H dos hexes em que o grupo entrou? Se o dia terminar num especial de conflito, a consequência não se aplica (D156)? | Sim | F4 |
| P10 | A **Bacia Acidentada** não tem itens nem Materiais no CSV do Bazar. O comerciante dela usa os itens do mesmo CR (Emaranhado e Costas)? | Sim, até o CSV ganhar a Bacia | F6 |
| P11 | **Comerciante ambulante:** 2d4 itens, com teto de raridade pelo CR (1 Ordinário, 2 Incomum, 3 Exótico, 4+ Luxária)? | Sim | F6 |
| P12 | **Raio de visão na Água** (embarcado): 1? | 1 | F5 |
| P13 | **Barcos:** cada barco tem um orçamento diário em metros, a 1,5 m por aresta de rio ou hex de Água? Quais barcos existem, e com que velocidade? ("Barco grande, 9 hexes" seriam 13,5 m.) | Sim; a lista é do Pedro | F4, F6 |
| P14 | **Nome do repositório** novo. | `khalkaria-hexcrawl` | início |
| P15 | Na **travessia de rio**, o H da CD é o **maior** entre os dois hexes da aresta? | Sim. O rio é o mesmo dos dois lados, e muito rio é fronteira | F4 |

## 2. Decisões tomadas pelo agente de balanceamento (revisáveis)
- A tecnologia (`02-arquitetura.md`).
- O que o tooltip dos jogadores mostra (`05-interface.md` §4).
- A janela dos jogadores sem HUD por padrão.
- Os valores iniciais de tinta e os pesos de variante (`06-arte.md`).
- Os estilos de rio, via, ponte e penhasco.
- O peso de preferência por ponte na busca de rota. Não é regra (`04-motor-de-regras.md` §2.1).
- A semente da montagem por hex.

## 3. Conteúdo que só o Pedro aprova
| Conteúdo | Quantidade | Estado |
|---|---|---|
| Textos das consequências da Jornada | 9 regiões × 7 faixas | arquivos criados, textos vazios (`status: "a escrever"`) |
| Tabelas globais de eventos | ~12 comuns, ~15 notáveis e ~5 raros por região | por fazer |
| Vilas e masmorras pré-feitas (especiais) | algumas por região | por fazer |
| Posição e texto dos especiais da arte | Templo da Profecia, Vilarejo Skarv, Castelo em Ruínas, O Oásis, Kurtam, Minas dos Krichama, a fortaleza do Ermo | posição na F3 |
| Barcos e velocidades | lista | P13 |
| Token do grupo e ícones de marca | arte | substituto por código até lá |

## 4. Do lado do Notion e do site (não é tarefa do app)
- O CSV do Bazar ainda conhece só 8 regiões: falta a Bacia Acidentada.
- As regras do hexcrawl ainda não estão no Notion. Quando o Pedro quiser publicá-las, o agente de balanceamento
  redige a seção a partir de `01-regras.md`.
