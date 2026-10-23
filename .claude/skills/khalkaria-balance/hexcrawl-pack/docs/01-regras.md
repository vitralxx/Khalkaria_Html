# 01 · Regras do hexcrawl (normativo)

Este documento é a **regra** que o app implementa. Ele consolida as rodadas de decisão do Pedro (D156, D157, D158)
com o texto canônico do **Sistema** no Notion. O texto verbatim do Sistema está em `09-sistema-khalkaria.md`.

**Marcas de origem**
- `[Pedro]`: decidido pelo Pedro.
- `[Sistema]`: texto canônico do Notion.
- `[proposta Pn]`: proposta do agente de balanceamento, ainda sem confirmação. O número aponta para a pergunta em
  `10-pendencias.md`.

**Hierarquia**
- Se este documento divergir do Notion, **vale o Notion**: sinalize ao Pedro antes de mexer no código.
- Se faltar um número aqui, **pergunte**. O app nunca inventa regra.
- Toda `[proposta]` fica isolada no código, numa constante ou numa opção. Assim, a resposta do Pedro troca um valor,
  e não a arquitetura.

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

- A ordem e a Hostilidade 5/10/15/20 estão confirmadas `[Pedro]`.
- **Fora das regiões:** Khaskavel e Revavena. As duas cidades têm mapas próprios, que não são hexagonais e ficam
  fora do app. No hexcrawl, os hexes delas são da cidade, e não de uma região.
- O Templo da Profecia fica no Bosque Corrompido `[Pedro]`.

### 1.2 O que cada região guarda `[Pedro]`
- A cor do solo, que vira a tinta dos tiles (ver `06-arte.md`).
- A tabela de consequências da Jornada (§4.2).
- A tabela global de eventos (§5).
- Os parâmetros de montagem das tabelas dos hexes (§5.3).
- Até **4 Materiais** extraíveis (§5.4).

## 2. Grade, tipos e arestas

### 2.1 Grade
- Uma grade só para o continente inteiro. As regiões são recortes dela.
- **Hex de topo chato** `[proposta P1]`. O Pedro tinha pedido topo pontudo, mas os tiles dele são de topo chato. O
  layout é *odd-q*: as colunas de índice ímpar (contando de 0), ou seja, as **pares no rótulo** (02, 04…), descem
  meio hex. As convenções completas estão em `03-dados.md`.
- **Coordenada visível** em cada hex `[Pedro]`, no formato `CCLL` (coluna e linha, 1-based, 2 dígitos cada).
- **Tamanho:** 30 colunas é o ponto de partida. O Pedro quer **testar vários tamanhos** `[Pedro]` antes de traçar
  vias e rios (ver `07-geografia.md`).
- **Anel vizinho** `[Pedro]`: a vista de uma região mostra 1 anel de hexes das regiões vizinhas, com o rótulo
  "→ Para [região]".

### 2.2 Os 10 tipos de hex `[Pedro]`
O tipo dá o **ícone** e o custo. A cor do solo vem da região.

| Tipo | id | Custo fora de via | Raio de visão (§6) |
|---|---|---|---|
| Campos | `campos` | 4,5 m | 1 |
| Floresta | `floresta` | 6 m | 1 |
| Floresta Densa | `floresta-densa` | 7,5 m | 0 |
| Colinas | `colinas` | 6 m | 2 |
| Montanha | `montanha` | 9 m | 3 `[P4]` |
| Pântano | `pantano` | 7,5 m | 1 |
| Deserto | `deserto` | 6 m | 1 |
| Ermo | `ermo` | 4,5 m | 1 |
| Água | `agua` | 1,5 m, só com embarcação | 1 `[P12]` |
| Litoral | `litoral` | 4,5 m | 2 |

O mestre pode mudar o custo e a Hostilidade de qualquer hex `[Pedro]`. No dado, `null` quer dizer "o do tipo" ou
"o da região".

### 2.3 Hexes neutros e especiais `[Pedro]`
- **Neutro:** tem tabela de eventos (§5). É a maioria.
- **Especial:** não tem tabela. Tem um propósito narrativo fixo, sem sorteio. Exemplos: os marcos do Pedro, as vilas
  pré-feitas, os portões das cidades.
- Um especial pode ser **de conflito**: aí a consequência da Jornada não se resolve nele (§4.2).

### 2.4 Arestas `[Pedro]`
| Aresta | Regra |
|---|---|
| **Rio** | Bloqueia. Atravessar fora de ponte é um teste **individual** de *Movimento* contra a **CD 10 + ⌊H/2⌋** `[Pedro: aprovada]`. Quem falha recebe **2d6+3** de dano e é levado **1d6 hexes rio abaixo**; o mestre decide onde a pessoa sai. A travessia não custa metros. |
| **Ponte** | Travessia segura, sem teste. Só existe sobre aresta de rio. |
| **Penhasco** | Bloqueia a passagem. Visto do lado baixo, tapa a visão; do lado alto, a visão desce (§6). |

- Com H 5/10/15/20, a CD do rio fica em 12/15/17/20.
- `[proposta P15]` O H vale o **maior** entre os dois hexes da aresta. O rio é o mesmo dos dois lados, e muito rio
  é fronteira de região.
- **Arrasto rio abaixo:** o rio guarda as arestas em ordem, da nascente à foz. O app sugere o ponto de saída
  andando **2 arestas por hex** a partir da aresta da travessia. O mestre confirma ou move.

### 2.5 Vias e territórios `[Pedro]`
- **Estrada** e **trilha** passam pelo centro do hex e saem pelo meio da aresta.
- **A via manda no custo:** estrada 1,5 m e trilha 3 m, em qualquer terreno.
  - Isso só vale no passo que **segue a via**: os dois hexes do passo são seguidos na mesma via.
  - Atravessar uma via não dá o desconto.
- **Território de cidade:** um contorno pelas bordas dos hexes, pintado com o pincel de borda.
- **Propósito:** cada rio e cada estrada levam os jogadores para mais perto de um objetivo `[Pedro]`. Por isso a
  conferência avisa quando uma via termina sem levar a um especial, a uma cidade ou a uma fronteira.

## 3. Movimento e tempo

### 3.1 Orçamento do dia `[Pedro]`
- O orçamento é **o menor Movimento do grupo, em metros**, e cobre 16 h de viagem.
  - Exemplo com 9 m: 2 hexes de Campos, 3 de trilha ou 6 de estrada.
- Entrar num hex custa o custo do passo (§2.5).
- **A sobra se perde** no fim do dia.
- **Hex mais caro que o orçamento inteiro** (ex.: Montanha 9 m com orçamento 7,5 m):
  - só se entra nele com o orçamento cheio;
  - o que passar vira **dívida** descontada do dia seguinte.

  Isso é o "leva 2 dias" já aceito.

### 3.2 Navegação `[Pedro]`
- **A embarcação é um serviço:** contrata-se, e ela não vai para o inventário.
- Embarcado, o barco anda **pelas arestas do rio a 1,5 m cada** (2 arestas por hex) e por **hexes de Água a 1,5 m**
  cada.
- Cada barco tem a sua velocidade `[Pedro]`. `[proposta P13]` A velocidade é o orçamento diário do barco, em metros,
  e substitui o do grupo enquanto ele está embarcado.

### 3.3 O relógio do dia `[Pedro, D158]`
O dia começa **de manhã**, com o orçamento cheio (menos a dívida, se houver). O período sai do **restante** do dia:

| Restante | Período |
|---|---|
| mais de 2/3 do orçamento | manhã |
| mais de 1/3 | tarde |
| mais de 0 | noite |
| 0 | descanso, **no hex onde o grupo está** |

- **Andar** gasta o custo do passo. Com 9 m, o grupo entra na tarde ao chegar a 6 m e na noite ao chegar a 3 m.
- **Explorar** o hex atual pula **um período na hora**: manhã → tarde → noite → descanso forçado ali.
  - `[proposta P2]` O restante cai para o limiar do período seguinte: 2/3 se era manhã, 1/3 se era tarde, 0 se era
    noite.
  - Um hex explorado à noite força o descanso nele.
- **Acampar antes da hora:** o grupo pode encerrar o dia onde está. O restante vai a 0.
- O app guarda os hexes em que o grupo **entrou** no dia (`andados`, para a Jornada) e os que **explorou**
  (`explorados`).

A implementação de referência está em `referencia/hexcrawl_ref/regras.py` (`novo_dia`, `pode_entrar`, `entrar`,
`explorar`, `acampar`, `periodo`). Os roteiros testados estão em `testes/vetores-regras.json` (`roteirosDoDia`).

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
  - A ficha de cada um não está no app: ele só **mostra** o X.
- **Abrigo** `[Pedro]`: descansar num hex com Abrigo marcado sobe 1 nível de comodidade, até o máximo de 5.
- **Emboscada** `[Sistema]`: em ambiente hostil, o grupo pode ser emboscado enquanto descansa e começa o combate
  *Desprevenido*. Quem fica de vigia tira a penalidade.
  - O Sistema não dá uma chance de emboscada. Por isso o app **lembra** a regra e pergunta quem vigia, mas não
    sorteia a emboscada.
  - Se o mestre decidir que houve emboscada, ele escolhe ou rola um combate da região.
- O descanso longo **zera o contador de extração** (§5.4).

## 4. Jornada `[Sistema + Pedro]`

### 4.1 O teste
- **1 teste de Jornada por dia de viagem** `[Pedro]`.
  - O H do teste é a **maior Hostilidade entre os hexes em que o grupo entrou no dia**.
  - Se o grupo não andou, não há teste.
- `[proposta P9]` O app pede o teste **no fim do dia**, antes do descanso, quando já sabe todos os hexes do dia.
- Cada membro escolhe uma ação `[Sistema]`. Todas têm CD 15:

  | Ação | Perícia | Sucesso | A cada 5 acima da CD |
  |---|---|---|---|
  | Guiar (no máximo 1) | Sobrevivência | +2 | +1 |
  | Motivar | Motivar | +1 | +1 |
  | Vigiar | Percepção | +1 | +1 |
  | Outros | a perícia aproximada | +1 | +1 |

- **Meta:** 3 + H/5 pontos. Dá 4, 5, 6 e 7 pontos em H 5, 10, 15 e 20.
- Quem bate a meta chega sem complicações. Quem não bate rola **d100** na tabela de consequências da região.

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

- **Hex de conflito** `[Pedro, D156]`: se o grupo termina o dia num especial de conflito, a consequência não se
  resolve ali.
- O app rola o d100 e **mostra o dano por integrante**. Quem aplica na ficha é a mesa.

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
   hex `[Pedro: aceito]`:

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
5. O mestre pode **revisar e travar** a tabela de cada hex antes da sessão. É a conferência de coerência que o Pedro
   quer.
6. A montagem usa um gerador com semente: mesma semente, mesmas tabelas.

### 5.4 Extração `[Pedro + proposta]`
- **No máximo 4 Materiais por região** `[Pedro]`, para a extração não virar *grind*. A proposta de quais são está
  em `dados/kharavel/mundo/mundo.json` (`materiaisStatus: "proposta"`) `[P6]`.
- **Viés:** depois de cada sítio de extração no dia, a chance de outro cai exponencialmente `[Pedro]`.
  - O peso da categoria é multiplicado por **0,5ᵏ**, sendo k os sítios desde o último descanso longo.
  - O descanso zera o k.
- **Quantidade** `[Pedro: depende da Sobrevivência e da raridade]`:
  - A CD de *Sobrevivência* é a CD de craft da raridade: 10 Ordinário, 13 Incomum, 16 Exótico, 20 Luxária.
  - O sucesso rende **1 + ⌊(resultado − CD)/5⌋ unidades**; a falha rende 0.
  - Cada personagem extrai uma vez por sítio.
- `[proposta P6]` O sítio oferece os Materiais da região que listam o tipo do hex. Cada personagem escolhe um e rola.
- Ficam fora da extração: Reagente Alquímico e os 4 Materiais únicos de quest (lista em `mundo.json`,
  `foraDaExtracao`).

### 5.5 Comerciante ambulante `[Sistema + proposta]`
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
- `[proposta P11]` São 2d4 itens, com teto de raridade pelo CR da região: CR 1 Ordinário, CR 2 Incomum, CR 3
  Exótico, CR 4+ Luxária.
- `[proposta P10]` A Bacia Acidentada não tem itens no CSV. O comerciante dela usa os itens do mesmo CR (Emaranhado e
  Costas).

### 5.6 Quando o hex rola `[Pedro, D158]`
- O hex rola a tabela **quando o grupo decide explorá-lo**, e só se:
  - não for especial;
  - não tiver **nada marcado**.
- `[proposta P3]` Só explorar rola a tabela. Virar o período andando não rola nada.
- **Notável ou raro:**
  - marca o hex para sempre (ele "vira" aquele lugar);
  - sai de **todas** as tabelas do mundo;
  - não rola mais.
- **Comum:**
  - continua nas tabelas e não marca o hex;
  - **explorar o hex de novo rola de novo** `[Pedro]`.
- **Comum com marca** (o Abrigo): marca o hex, mas não sai das tabelas. Como o hex fica marcado, ele não rola mais.
- Tudo o que sai fica em `revelados` do hex: é o que os jogadores já viram ali (§6).

## 6. Névoa e visão `[Pedro, D158]`

### 6.1 Visão
- O raio de visão sai do **tipo do hex onde o grupo está**:
  - 1 por padrão;
  - 2 em Colinas e Litoral;
  - 3 em Montanha `[P4]`;
  - 0 em Floresta Densa (só o próprio hex).
- Um hex no raio é visível se a linha reta até ele **não sobe um penhasco do lado baixo para o alto**.

### 6.2 Os 3 estados de cada hex na tela dos jogadores
| Estado | Quando | Como aparece |
|---|---|---|
| **oculto** | nunca esteve no campo de visão | **preto**, e **sem a grade** |
| **visto** | já esteve, mas está fora do alcance agora | **cinza**: o que foi visto, sem cor |
| **visível** | está no campo de visão agora | **vívido** |

- A névoa não volta a ficar preta: o hex que saiu de perto fica cinza `[Pedro]`.
- Nos hexes visitados, os jogadores veem **só o que foi rolado ali** `[Pedro]`. *"Hex iguais ficam mais previsíveis
  assim."*
- A tabela do hex, a Hostilidade e os eventos não revelados **nunca** chegam à tela dos jogadores.

### 6.3 Penhasco e duas versões do mapa
- **Penhasco:** do lado baixo, tapa a visão; do lado alto, a névoa se revela para baixo.
- **Duas versões do continente** `[Pedro]`:
  - "Kharavel Versão 2 abismo OFICIAL" é o continente verdadeiro;
  - "Kharavel Versão 2" é a **ilusão do Oásis**.

  Como a ilusão aparece no app está em aberto `[P5]`.

## 7. Fora do escopo do app
- Mapas internos de Khaskavel e Revavena.
- Ficha de personagem: a mesa aplica dano e recursos na ficha do site.
- Bestiário `[Pedro]`.
- Regras de combate.
