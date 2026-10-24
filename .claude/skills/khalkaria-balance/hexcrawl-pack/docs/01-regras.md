# 01 · Regras do hexcrawl (normativo)

Este documento é a **regra** que o app implementa. Ele consolida as rodadas de decisão do Pedro (D156 a D159) com o
texto canônico do **Sistema** no Notion. O texto verbatim do Sistema está em `09-sistema-khalkaria.md`.

**Marcas de origem**
- `[Pedro]`: decidido pelo Pedro.
- `[Sistema]`: texto canônico do Notion.
- `[proposta Pn]`: proposta do agente de balanceamento, ainda sem confirmação. O número aponta para a pergunta em
  `10-pendencias.md`.

**Hierarquia**
- Se este documento divergir do Notion, **vale o Notion**: sinalize ao Pedro antes de mexer no código.
- Se faltar um número aqui, **pergunte**. O app nunca inventa regra.
- **Os números ficam em dados configuráveis no app** `[Pedro]`: `mundo.json` e o painel de configuração. Toda
  `[proposta]` fica isolada numa constante ou numa opção. Assim, a resposta do Pedro troca um valor, e não a
  arquitetura.
- **O app nunca rola os dados dos jogadores** `[Pedro]`. Ele lembra a mesa de rolar e recebe o resultado (§8).

---

## 1. Regiões

### 1.1 As 9 regiões `[Pedro]`
A escala de dificuldade vem do CR de drop dos Materiais no Bazar. A Hostilidade (H) é a do Sistema (0/5/10/15/20).

| Rank | Região | id | CR | H | Cor da legenda |
|---|---|---|---|---|---|
| 1 | Bosque Corrompido | `bosque-corrompido` | 1 | 5 | `#8c0000` |
| 2 | Cinturão Silencioso | `cinturao-silencioso` | 1 | 5 | `#008b8c` |
| 3 | Emaranhado de Raízes | `emaranhado-de-raizes` | 2 | 10 | `#8d008c` |
| 4 | Bacia Acidentada | `bacia-acidentada` | 2 | 10 | `#8c8c8c` |
| 5 | Costas Rochosas | `costas-rochosas` | 2 | 10 | `#008d00` |
| 6 | Terras Livres | `terras-livres` | 3 | 15 | `#8d8c00` |
| 7 | Cordilheira Cristalina | `cordilheira-cristalina` | 3 | 15 | `#00008d` |
| 8 | Deserto do Abismo | `deserto-do-abismo` | 4+ | 20 | `#392a5c` |
| 9 | Ermo das Cinzas | `ermo-das-cinzas` | 4+ | 20 | `#000000` |

- **Fora das regiões:** Khaskavel e Revavena. As duas cidades têm mapas próprios, que não são hexagonais e ficam
  fora do app. No hexcrawl, os hexes delas são da cidade, e não de uma região.
- O Templo da Profecia fica no Bosque Corrompido `[Pedro]`.

### 1.2 O que cada região guarda `[Pedro]`
- A cor do solo, que vira a tinta dos tiles (`06-arte.md`).
- A tabela de consequências da Jornada (§4.2).
- A tabela global de eventos (§5).
- Os parâmetros de montagem das tabelas dos hexes (§5.3).
- Até **4 Materiais** extraíveis (§5.4).

### 1.3 Camadas `[Pedro, D159]`
- As regiões se juntam para formar o mapa todo **como camadas**. **Cada camada liga e desliga.**
- **Região alternativa:** uma camada que ocupa as células de outra região enquanto está ligada. O uso que motivou a
  regra é a **ilusão do Oásis** sobre o Deserto do Abismo: o mestre liga a ilusão e, quando chegar a hora, desliga
  e mostra o Abismo.
  - Os dados da região da ilusão (nome, H, CR, tinta, tabelas) ainda não existem `[P17]`.
- **No editor**, ligar e desligar é só visualização.
- **Na sessão**, as camadas ligadas são o mapa em jogo, nas duas janelas.
  - O estado das camadas é da campanha: a ilusão vale até o mestre desligá-la.
  - Uma região da base desligada sai do mapa: não aparece nem pode ser atravessada.
- A névoa é por **lugar**. Um hex visto sob a ilusão continua visto quando a ilusão cai, e passa a mostrar o que é
  de verdade.
- Tabelas, marcas e revelações são **por camada**. A ilusão tem as dela e o Abismo tem as dele.

## 2. Grade, tipos e arestas

### 2.1 Grade
- Uma grade só para o continente inteiro.
- **Hex de topo chato** `[Pedro]`, layout *odd-q*: as colunas de índice ímpar (contando de 0), ou seja, as **pares
  no rótulo** (02, 04…), descem meio hex. As convenções completas estão em `03-dados.md`.
- **Coordenada visível** em cada hex `[Pedro]`, no formato `CCLL` (coluna e linha, 1-based, 2 dígitos cada).
- **Tamanho:** 30 colunas é o ponto de partida. O Pedro quer **testar vários tamanhos** `[Pedro]` antes de traçar
  vias e rios (`07-geografia.md`).
- **Anel vizinho** `[Pedro]`: a vista de uma região mostra 1 anel de hexes das regiões vizinhas, com o rótulo
  "→ Para [região]".

### 2.2 Os 10 tipos de hex `[Pedro]`
O tipo dá o **ícone**, o custo e o raio de visão. A cor do solo vem da região. **Custo e visão são configuráveis no
app** `[Pedro]`.

| Tipo | id | Custo fora de via | Raio de visão (§6) |
|---|---|---|---|
| Campos | `campos` | 4,5 m | 1 |
| Floresta | `floresta` | 6 m | 1 |
| Floresta Densa | `floresta-densa` | 7,5 m | 0 |
| Colinas | `colinas` | 6 m | 2 |
| Montanha | `montanha` | 9 m | 3 |
| Pântano | `pantano` | 7,5 m | 1 |
| Deserto | `deserto` | 6 m | 1 |
| Ermo | `ermo` | 4,5 m | 1 |
| Água | `agua` | o da embarcação (§3.2) | 2 |
| Litoral | `litoral` | 4,5 m | 2 |

O mestre pode mudar o custo e a Hostilidade de qualquer hex `[Pedro]`. No dado, `null` quer dizer "o do tipo" ou
"o da região".

### 2.3 Hexes neutros e especiais `[Pedro]`
- **Neutro:** tem tabela de eventos (§5). É a maioria.
- **Especial:** não tem tabela. Tem um propósito narrativo fixo, sem sorteio. Exemplos: os marcos do Pedro, as vilas
  pré-feitas, os portões das cidades.

### 2.4 Arestas `[Pedro]`
| Aresta | Regra |
|---|---|
| **Rio** | Bloqueia. Atravessar fora de ponte é um teste **individual** de *Movimento* contra a **CD 10 + ⌊H/2⌋**, com o **maior H entre os dois hexes da aresta**. Quem falha recebe **2d6+3** de dano e é levado **1d6 hexes rio abaixo**; o mestre decide onde a pessoa sai. A travessia não custa metros. |
| **Ponte** | Travessia segura, sem teste. Só existe sobre aresta de rio. |
| **Penhasco** | Bloqueia a passagem. Visto do lado baixo, tapa a visão; do lado alto, a visão desce (§6). |

- Com H 5/10/15/20, a CD do rio fica em 12/15/17/20.
- **Hex sem H** (mar, cidade): a CD usa o H do outro hex da aresta. Se nenhum dos dois tem H, o app não mostra
  CD, e o mestre decide.
- **Arrasto rio abaixo:** o rio guarda as arestas em ordem, da nascente à foz. O app sugere o ponto de saída
  andando **2 arestas por hex** a partir da aresta da travessia. O mestre confirma ou move.

### 2.5 Vias e territórios `[Pedro]`
- **Estrada** (tijolo cinza) e **trilha** (cavada no terreno) passam pelo centro do hex e saem pelo meio da aresta.
  A arte está em `06-arte.md` §5.
- **A via manda no custo:** estrada 1,5 m e trilha 3 m, em qualquer terreno. Os dois valores ficam em
  `mundo.json > vias`, configuráveis.
  - Isso só vale no passo que **segue a via**: os dois hexes do passo são seguidos na mesma via.
  - Atravessar uma via não dá o desconto.
  - Se duas vias ligam os mesmos dois hexes (ex.: uma estrada e uma trilha), vale a mais barata.
- **Território de cidade:** um contorno pelas bordas dos hexes, pintado com o pincel de borda.
- **Propósito:** cada rio e cada estrada levam os jogadores para mais perto de um objetivo `[Pedro]`. A conferência
  avisa quando uma via termina sem levar a um especial, a uma cidade ou a uma fronteira.

## 3. Movimento e tempo

### 3.1 Orçamento do dia `[Pedro]`
- O orçamento é **o menor Movimento do grupo, em metros**, e cobre 16 h de viagem.
  - Exemplo com 9 m: 2 hexes de Campos, 3 de trilha ou 6 de estrada.
- Entrar num hex custa o custo do passo (§2.5).
- **A sobra se perde** no fim do dia.
- **Hex mais caro que o orçamento inteiro** (ex.: Montanha 9 m com orçamento 7,5 m):
  - só se entra nele com o orçamento cheio;
  - o que passar vira **dívida** descontada do dia seguinte.

### 3.2 Navegação `[Pedro, D159]`
- **A embarcação é um serviço:** contrata-se, e ela não vai para o inventário.
- **O orçamento continua o do grupo.** A embarcação define o custo de cada passo:

  | Embarcação | Por aresta de rio | Por hex de Água |
  |---|---|---|
  | Galeão | 1,5 m | 1,5 m |
  | Fragata | 3 m | 3 m |
  | Canoa | 4,5 m | 4,5 m |

- No rio, o barco anda **pelas arestas**. Avançar 1 hex de distância custa 2 arestas.
- Ficam em `mundo.json > embarcacoes`, configuráveis.
- `[proposta]` Embarcar e desembarcar acontecem num dos 2 hexes da aresta onde o barco está, sem custo. Explorar
  exige estar num hex.

### 3.3 O relógio do dia e as paradas `[Pedro, D158 e D159]`
O dia começa **de manhã**, com o orçamento cheio (menos a dívida, se houver). O período sai do **restante** do dia:

| Restante | Período |
|---|---|
| mais de 2/3 do orçamento | manhã |
| mais de 1/3 | tarde |
| mais de 0 | noite |
| 0 | fim do movimento |

- **Andar** gasta o custo do passo. Com 9 m, o grupo entra na tarde ao chegar a 6 m e na noite ao chegar a 3 m.
- **Explorar** o hex atual pula **um período na hora**: manhã → tarde → noite → fim do dia ali.
  - O restante cai para o limiar do período seguinte: 2/3 se era manhã, 1/3 se era tarde, 0 se era noite
    `[Pedro]`.
- **Paradas.** O grupo para num hex quando:
  1. **um período termina** andando;
  2. **decide explorar** o hex;
  3. **o movimento do dia acaba.**
- **Fim do movimento** `[Pedro]`: o grupo **explora o hex em que está e só então descansa**. Se já o explorou desde
  que chegou nele (por exemplo, explorou à noite), não explora de novo.
- **O mestre pode encerrar o dia** onde o grupo está, por exemplo numa vila. Vale o protocolo do fim do movimento.
- **O que acontece em cada parada:**

  | Parada | Jornada (§4) | Tabela do hex (§5.6) | Descanso (§3.4) |
  |---|---|---|---|
  | fim de período andando | lembra | — | — |
  | explorar | lembra | rola, se o hex rolar | se o período virou fim do dia |
  | fim do movimento | lembra | explora e rola, se ainda não explorou | sim |

- Todo lembrete pode ser **dispensado pelo mestre**. O app lembra; quem decide é a mesa.

A implementação de referência está em `referencia/hexcrawl_ref/regras.py` (`andar`, `explorar`, `encerrar_dia`,
`periodos_encerrados`, `fechar_parada`). Os roteiros testados estão em `testes/vetores-regras.json`
(`roteirosDoDia`).

### 3.4 Descanso `[Sistema + Pedro]`
- O descanso longo encerra o dia; vale no máximo um por dia `[Sistema]`.
- **Comodidade ao ar livre** `[Sistema]`: todos rolam *Sobrevivência*, e vale o **maior** resultado do grupo.

  | Maior Sobrevivência | Comodidade |
  |---|---|
  | menos de 15 | 1, Precário |
  | 15–19 | 2, Ruim |
  | 20–24 | 3, Normal |
  | 25–29 | 4, Bom |
  | 30 ou mais | 5, Luxuoso |

- **Recuperação** `[Sistema]`: cada jogador recupera **Xd8** em 2 status à escolha, sendo X a comodidade.
  - Exige fonte de luz e alimento.
  - O app só **mostra** o X; a ficha de cada um não está no app.
- **Abrigo** `[Pedro]`: descansar num hex com Abrigo marcado sobe 1 nível de comodidade, até o máximo de 5. Como o
  grupo explora o hex antes de descansar, um Abrigo achado nessa exploração já vale para a noite.
- **Emboscada** `[Sistema]`: em ambiente hostil, o grupo pode ser emboscado enquanto descansa e começa o combate
  *Desprevenido*. Quem fica de vigia tira a penalidade.
  - O Sistema não dá uma chance de emboscada. Por isso o app **lembra** a regra e pergunta quem vigia, mas não
    sorteia a emboscada.
- O descanso longo **zera o contador de extração** (§5.4).

## 4. Jornada `[Sistema + Pedro]`

### 4.1 O teste
- **A Jornada se aplica sempre ao parar num hex, uma vez por período** `[Pedro, D159]`:
  - no fim de cada período;
  - ou quando o grupo decide explorar um hex.

  Isso substitui o "1 teste por dia" da D158.
- **O app lembra os jogadores de rolar e nunca rola por eles** `[Pedro]`. Ele recebe a ação e o resultado de cada um
  (ou só o total de pontos) e faz a conta.
- `[proposta P16]` O **H da Jornada** é o maior entre os hexes em que o grupo entrou desde a última parada. Sem
  movimento, vale o H do hex atual.
- `[proposta P16]` Um passo que encerra **dois períodos de uma vez** (ex.: de 7,5 m para 3 m com orçamento 9) é
  **uma parada só**, e portanto uma Jornada.
- Cada membro escolhe uma ação `[Sistema]`. Todas têm CD 15:

  | Ação | Perícia | Sucesso | A cada 5 acima da CD |
  |---|---|---|---|
  | Guiar (no máximo 1) | Sobrevivência | +2 | +1 |
  | Motivar | Motivar | +1 | +1 |
  | Vigiar | Percepção | +1 | +1 |
  | Outros | a perícia aproximada | +1 | +1 |

- **Meta:** 3 + H/5 pontos. Dá 4, 5, 6 e 7 pontos em H 5, 10, 15 e 20.
- Quem bate a meta chega sem complicações. Quem não bate rola **d100** na tabela de consequências.
  - **O grupo rola o d100** `[Sistema]`; o app pede o número.

### 4.2 Consequências `[Sistema + Pedro]`
- **Uma tabela d100 por região** `[Pedro]`. As faixas e os danos são os do Sistema.
- O que muda por região é o **texto temático** de cada faixa (o que causou o dano).
- É só dano em Saúde e Stamina: **sem condições**, e sempre com **+H**, salvo no 100.

| d100 | Cada integrante perde |
|---|---|
| 1 | 4d6+H de Saúde e de Stamina |
| 2–19 | 2d8+H de Saúde e de Stamina |
| 20–39 | 2d6+H de Saúde e de Stamina |
| 40–59 | 1d6+H de Stamina |
| 60–79 | 1d4+H de Stamina |
| 80–99 | H de Stamina |
| 100 | nada: o grupo evita todas as consequências |

- `[proposta P16]` O texto vem da região do hex que deu o H da parada. No empate, vale o hex da parada.
- `[proposta P16]` O *"sempre se aplica ao parar"* da D159 derruba a exceção do hex de conflito da D156.
- O app mostra a faixa, o texto e a fórmula do dano de cada integrante. Quem aplica na ficha é a mesa.

## 5. Tabelas de eventos dos hexes `[Pedro]`

### 5.1 Princípio
- Cada região tem uma **tabela global de eventos**.
- Cada hex neutro **monta a sua** a partir dela, com eventos favoráveis e adversos em proporção variável.
- A tabela do hex é **oculta aos jogadores**.
- A tabela é por região, não por tipo de hex. Assim a região garante eventos exclusivos dela e deixa de fora os que
  destoam.

### 5.2 Categorias `[Pedro, D158]`
| Categoria | id | Raridade típica | Marca o hex? |
|---|---|---|---|
| Sítio de extração | `extracao` | comum | não |
| Combate (criaturas de Kharavel) | `combate` | comum | não |
| Interação (NPC hostil, neutro ou amigável) | `interacao` | comum | não |
| Comerciante ambulante | `comerciante` | comum | não |
| **Abrigo**: o descanso no hex sobe 1 nível de comodidade | `abrigo` | comum | **sim**: o abrigo fica lá |
| Ruína (masmorra pré-feita) | `ruina` | notável | sim |
| Assentamento (serviços, taverna, side quest) | `assentamento` | notável | sim |
| Covil (inclui assentamento de facção hostil) | `covil` | notável | sim |
| Achado (lore, item, segredo; costuma morar em especial) | `achado` | raro | sim |

- **Mirante não é evento** `[Pedro]`: virou regra de terreno, o raio de visão por tipo (§6).
- **Nenhum evento trava a narrativa principal** `[Pedro]`. Quase sempre é lore local; a exceção possível são os mais
  raros.
- Combates descrevem as criaturas no próprio evento: o app **não** integra com o Bestiário `[Pedro]`.

### 5.3 Montagem da tabela do hex
1. **Filtra** a tabela global da região pelo tipo do hex. Cada evento lista os tipos em que pode aparecer.
2. **Sorteia de 8 a 12 entradas**, respeitando a mistura de polaridade pelo rank da região, com ±10% de variação por
   hex `[Pedro]`:

   | Rank | Favorável | Neutro | Adverso |
   |---|---|---|---|
   | 1–2 | 40% | 35% | 25% |
   | 3–5 | 33% | 34% | 33% |
   | 6–7 | 27% | 33% | 40% |
   | 8–9 | 20% | 30% | 50% |

   Se faltar candidato numa polaridade, a sobra vai para as outras, a começar pela de maior peso na mistura.
3. **Peso por raridade: comum 5, notável 3, raro 1** `[Pedro]`.
   - A tabela guarda **pesos**, e não faixas.
   - As faixas do d100 saem dos pesos na hora, pelo maior resto, com **piso de 1 número por entrada**.
   - Assim, tirar uma entrada só recalcula as faixas.
4. O evento consumido em qualquer lugar sai da montagem.
5. O mestre pode **revisar e travar** a tabela de cada hex antes da sessão.
6. A montagem usa um gerador com semente: mesma semente, mesmas tabelas.

### 5.4 Extração `[Pedro]`
- **No máximo 4 Materiais por região**, para a extração não virar *grind*. A lista aprovada está em
  `dados/kharavel/mundo/mundo.json`.
- **O sítio oferece os Materiais da região que listam o tipo do hex.** Cada personagem escolhe um e rola.
- **Viés:** depois de cada sítio de extração, a chance de outro cai exponencialmente.
  - O peso da categoria é multiplicado por **0,5ᵏ**, sendo k os sítios desde o último descanso longo.
  - O descanso zera o k.
- **Quantidade:**
  - A CD de *Sobrevivência* é a CD de Fabricação da raridade: 10 Ordinário, 13 Incomum, 16 Exótico, 20 Luxária.
  - O sucesso rende **1 + ⌊(resultado − CD)/5⌋ unidades**; a falha rende 0.
  - Cada personagem extrai uma vez por sítio.
- Ficam fora da extração: Reagente Alquímico e os 4 Materiais únicos de quest (lista em `mundo.json`,
  `foraDaExtracao`).

### 5.5 Comerciante ambulante `[Sistema + Pedro]`
- Segue a regra de Comerciantes do Sistema:
  - nível 1;
  - 250 Sins de estoque;
  - preço **rolado** na faixa da raridade:

    | Raridade | Preço |
    |---|---|
    | Ordinário | 2d10+10 |
    | Incomum | 4d10+45 |
    | Exótico | 5d12+180 |
    | Luxária | 6d20+620 |

- Os itens saem do CSV do Bazar, filtrados pela região (coluna `Obtenção`). O CSV é do Pedro: o app só lê.
- São **2d4 itens**, com teto de raridade pelo CR da região: CR 1 Ordinário, CR 2 Incomum, CR 3 Exótico, CR 4+
  Luxária `[Pedro]`.
- **Bacia Acidentada:** provisoriamente usa os itens do mesmo CR (Emaranhado e Costas) `[Pedro]`.
  - O ideal é a Bacia entrar como região no Bazar. Isso é trabalho do Pedro com o agente de balanceamento, no CSV.

### 5.6 Quando o hex rola `[Pedro]`
- **Só explorar rola a tabela do hex**, e só se o hex:
  - não for especial;
  - não tiver **nada marcado**.
- Virar o período andando não rola a tabela. No fim do movimento, o grupo explora o hex onde está (§3.3).
- **Notável ou raro:**
  - marca o hex para sempre (ele "vira" aquele lugar);
  - sai de **todas** as tabelas do mundo;
  - não rola mais.
- **Comum:**
  - continua nas tabelas e não marca o hex;
  - **explorar o hex de novo rola de novo**.
- **Comum com marca** (o Abrigo): marca o hex, mas não sai das tabelas. Como o hex fica marcado, ele não rola mais.
- Tudo o que sai fica em `revelados` do hex: é o que os jogadores já viram ali (§6).
- **A tabela do hex é oculta**, então quem rola é o mestre: o app rola, ou o mestre digita o resultado do dado físico
  (§8).

## 6. Névoa e visão `[Pedro]`

### 6.1 Visão
- O raio de visão sai do **tipo do hex onde o grupo está** e é **configurável no app**:
  - 1 por padrão;
  - 2 em Colinas e Litoral;
  - 3 em Montanha;
  - 0 em Floresta Densa (só o próprio hex).
- **Embarcado** `[Pedro, D159]`:
  - **num rio**, o grupo vê **só os 2 hexes da aresta** onde a embarcação está. Cada aresta percorrida revela os
    seus;
  - **num hex de Água**, o raio é 2.
- Um hex no raio é visível se a linha reta até ele **não sobe um penhasco do lado baixo para o alto**.

### 6.2 Os 3 estados de cada hex na tela dos jogadores
| Estado | Quando | Como aparece |
|---|---|---|
| **oculto** | nunca esteve no campo de visão | **preto**, e **sem a grade** |
| **visto** | já esteve, mas está fora do alcance agora | **cinza**: o que foi visto, sem cor |
| **visível** | está no campo de visão agora | **vívido** |

- A névoa não volta a ficar preta: o hex que saiu de perto fica cinza.
- Nos hexes visitados, os jogadores veem **só o que foi rolado ali**. *"Hex iguais ficam mais previsíveis assim."*
- A tabela do hex, a Hostilidade e os eventos não revelados **nunca** chegam à tela dos jogadores.

### 6.3 Penhasco e camadas
- **Penhasco:** do lado baixo, tapa a visão; do lado alto, a névoa se revela para baixo.
- **Camadas** (§1.3): os jogadores veem o mapa das camadas ligadas. A ilusão aparece como se fosse a verdade.

## 7. Fora do escopo do app
- Mapas internos de Khaskavel e Revavena.
- Ficha de personagem: a mesa aplica dano e recursos na ficha do site.
- Bestiário `[Pedro]`.
- Regras de combate.

## 8. Quem rola o quê `[Pedro, D159]`
| Rolagem | Quem rola | O app |
|---|---|---|
| Testes da Jornada, d100 da consequência ("o grupo rola"), travessia de rio, Sobrevivência da extração e do acampamento | **os jogadores** | lembra e recebe o resultado; **nunca rola** |
| Tabela do hex (oculta), dano das consequências e do rio, arrasto do rio, quantidade e preço dos itens do comerciante | **o mestre** | rola por ele, ou recebe o resultado do dado físico. A escolha é uma opção do mestre |
