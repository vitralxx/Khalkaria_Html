# 10 · Pendências

Quando o Pedro responder, atualize **esta lista** e `01-regras.md`, e troque a constante no código. Nunca preencha
uma pendência por conta própria.

## 1. Perguntas abertas (a recomendação vem primeiro)
| # | Pergunta | Recomendação | Afeta |
|---|---|---|---|
| P16 | **Detalhes da Jornada por parada** (D159). (a) O H é o maior entre os hexes em que o grupo entrou desde a última parada; sem movimento, o do hex atual? (b) Um passo que encerra dois períodos de uma vez é uma parada só, ou seja, uma Jornada? (c) O texto da consequência vem da região do hex que deu o H? (d) O *"sempre se aplica ao parar"* derruba a exceção do hex de conflito (D156)? | Sim nas quatro | F4 |
| P17 | **A região da ilusão** (o Oásis): nome, rank, CR, H, tinta, materiais, tabela de eventos e consequências. É uma 10ª região, alternativa ao Deserto do Abismo. | O Pedro define. Até lá, ela não existe nos dados | F3, F6 |
| P18 | **Velocidade dos barcos.** Com os custos da D159, o barco nunca anda mais rápido que estrada. No rio, avançar 1 hex de distância custa 2 arestas: Galeão 3 m (= trilha), Fragata 6 m, Canoa 9 m (mais lenta que Campos a pé). A D156 dizia "a navegação é a mais rápida". Era isso? | Confirmar. Se a ideia era o barco correr mais no rio, cobre por hex de distância (2 arestas pelo preço de 1): o Galeão empata com a estrada no rio e no lago | F4 |

## 2. Respondidas (D159, 2026-10-23)
| # | Resposta do Pedro |
|---|---|
| P1 | Topo chato: **sim** |
| P2 | Explorar leva o restante ao limiar seguinte: **sim** |
| P3 | Só explorar rola a tabela: **sim**, mas no fim do movimento o grupo explora o hex onde está e só então descansa |
| P4 | Montanha 3, **configurável no app** |
| P5 | As regiões são **camadas** que ligam e desligam; a ilusão e o Abismo são duas regiões, e o mestre alterna |
| P6 | Os 4 materiais por região e a regra do sítio: **sim** |
| P7 | **Estrada de tijolo cinza** com definição e variação; **trilha cavada** no terreno |
| P8 | Ermo com areia e rochas tingidas: **sim**; o laranja listrado é **plantação**: **sim** |
| P9 | **Jornada a cada parada, uma vez por período** (fim de período ou explorar); o app **lembra e nunca rola** pelos jogadores |
| P10 | Bacia: provisoriamente, os itens do mesmo CR (Emaranhado e Costas). O ideal é a Bacia entrar como região no Bazar |
| P11 | Comerciante com 2d4 itens e teto pelo CR: **sim** |
| P12 | Embarcado num rio: só os hexes da aresta; num hex de Água, visão 2 |
| P13 | Galeão, Fragata e Canoa: 1,5, 3 e 4,5 m por aresta e por hex de Água, no orçamento do grupo |
| P14 | Repositório: `vitralxx/khalkaria_hexcrawl` |
| P15 | CD do rio com o maior H dos dois hexes: **sim** |

## 3. Observação de balanceamento (do agente de balanceamento)
**A Jornada por parada pesa mais que a de uma vez por dia.**
- Num grupo médio (guia +6, os outros +4), a chance de falhar é ~31% em H5, ~48% em H10, ~65% em H15 e ~79% em H20.
- A perda esperada por Jornada, por pessoa, é de ~1,6 de Saúde e ~2,9 de Stamina em H5. Em H10, ~3,4 e ~6,8. Em H20,
  ~8,7 e ~19.
- Um dia de Campos tem 2 paradas, e um dia de trilha tem 3. Em H10, isso dá de ~7 a ~10 de Saúde e de ~14 a ~20 de
  Stamina por pessoa por dia.
- O descanso ao ar livre devolve 1d8 a 3d8 por status.

Não é pedido de mudança: é para observar na mesa.

## 4. Decisões tomadas pelo agente de balanceamento (revisáveis)
- A tecnologia (`02-arquitetura.md`).
- O que o tooltip dos jogadores mostra (`05-interface.md` §4).
- A janela dos jogadores sem HUD por padrão.
- Os valores iniciais de tinta e os pesos de variante (`06-arte.md`).
- Os estilos de rio, ponte e penhasco.
- O peso de preferência por ponte na busca de rota. Não é regra (`04-motor-de-regras.md` §2.1).
- A semente da montagem por hex.
- Embarcar e desembarcar sem custo, num dos 2 hexes da aresta.
- Num par alternativo, ligar um lado desliga o outro, por padrão.

## 5. Conteúdo que só o Pedro aprova
| Conteúdo | Quantidade | Estado |
|---|---|---|
| Textos das consequências da Jornada | 9 regiões × 7 faixas | arquivos criados, textos vazios (`status: "a escrever"`) |
| Tabelas globais de eventos | ~12 comuns, ~15 notáveis e ~5 raros por região | por fazer |
| Vilas e masmorras pré-feitas (especiais) | algumas por região | por fazer |
| Posição e texto dos especiais da arte | Templo da Profecia, Vilarejo Skarv, Castelo em Ruínas, O Oásis, Kurtam, Minas dos Krichama, a fortaleza do Ermo | posição na F3 |
| A região da ilusão | 1 região alternativa | P17 |
| Token do grupo e ícones de marca | arte | substituto por código até lá |

## 6. Do lado do Notion e do Bazar (não é tarefa do app)
- **Bacia no Bazar:** o CSV ainda conhece só 8 regiões. O Pedro e o agente de balanceamento decidem quais itens e
  Materiais ganham a Bacia. Até lá, o app usa o pool do CR 2.
- As regras do hexcrawl ainda não estão no Notion. Quando o Pedro quiser publicá-las, o agente de balanceamento
  redige a seção a partir de `01-regras.md`.
