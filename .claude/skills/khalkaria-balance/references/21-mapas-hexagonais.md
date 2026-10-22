# Hexcrawl de Kharavel: regras (rodada 3, 2026-10-22)

Regras que a aplicação de hexcrawl implementa. O plano da aplicação está no `22-hexcrawl-app-plano.md`.

**Origem:** `[Pedro]` decidido por ele · `[proposta]` minha, precisa de aceite · `[Sistema]` texto canônico do Notion.

**Objetivo do Pedro:** *"fazer os jogadores visualizarem melhor por onde eles podem ir [...] cada rio e estrada terá
um proposito em levar os jogadores mais perto de objetivos."*

---

## 1. Regiões

### 1.1 As 9 regiões e a escala de dificuldade
A escala vem do CR de drop dos Materiais no CSV do Bazar (`Obtenção`). A Bacia entra como a 4ª mais fácil `[Pedro]`.

| # | Região | CR (Bazar) | Hostilidade-base `[proposta]` | Cor |
|---|---|---|---|---|
| 1 | Bosque Corrompido | 1 | 5 | vermelho |
| 2 | Cinturão Silencioso | 1 | 5 | ciano |
| 3 | Emaranhado de Raízes | 2 | 10 | magenta |
| 4 | **Bacia Acidentada** | 2 `[Pedro: 4ª]` | 10 | cinza |
| 5 | Costas Rochosas | 2 | 10 | verde |
| 6 | Terras Livres | 3 | 15 | amarelo-oliva |
| 7 | Cordilheira Cristalina | 3 | 15 | azul |
| 8 | Deserto do Abismo | 4+ | 20 | roxo |
| 9 | Ermo das Cinzas | 4+ | 20 | preto |

- A ordem dentro de cada CR é leitura minha.
- ⚠️ O CSV do Bazar não tem itens nem Materiais da Bacia Acidentada.
- Fora das regiões: **Khaskavel** e **Revavena**, com mapas próprios que não são hexagonais.
- O **Templo da Profecia** fica no Bosque Corrompido `[Pedro]`.

### 1.2 Cada região guarda `[Pedro]`
- a **cor do solo**, que vai na textura dos tiles dela;
- a **tabela de consequências da Jornada** (§4);
- a **tabela global de eventos**, de onde os hexes montam as suas (§5);
- os **parâmetros de montagem** dessas tabelas, conforme a dificuldade (§5.3).

## 2. Grade e hexes

### 2.1 Grade
- **30 colunas**, hex **de topo pontudo**, com coordenada em cada hex `[Pedro]`.
- A coordenada é global: o continente é uma grade só, e as regiões são recortes dela.
- Pela estimativa da captura, 30 colunas de topo pontudo dão **~600 hexes de terra** (a conta de 450 era para topo
  chato). O Pedro sugeriu "talvez diminuir a quantidade total de hexes": 24 colunas dão ~380 (§7, decisão 1).
- **Anel vizinho** `[Pedro]`: cada mapa regional mostra 1 anel de hexes da região vizinha, com o texto
  "→ Para [região]".

### 2.2 Tipos de hex gerais `[Pedro]`
O tipo **não define a cor do tile**: ele define o **ícone**, que mostra quanto custa andar. A cor e a textura do solo
vêm da região.

| # | Tipo | Custo (fora de via) |
|---|---|---|
| 1 | Campos | 4,5 m |
| 2 | Floresta | 6 m |
| 3 | Floresta Densa | 7,5 m |
| 4 | Colinas | 6 m |
| 5 | Montanha | 9 m |
| 6 | Pântano | 7,5 m |
| 7 | Deserto | 6 m |
| 8 | Ermo | 4,5 m |
| 9 | Água | 1,5 m, só com embarcação |
| 10 | Litoral | 4,5 m |

### 2.3 Hexes neutros e especiais `[Pedro]`
- **Neutro:** tem tabela de eventos (§5). É a maioria.
- **Especial:** não tem tabela. Serve a um propósito narrativo predefinido, sem aleatoriedade. Exemplos: os marcos do
  Pedro, as vilas pré-feitas fixas e os portões das cidades.

### 2.4 Arestas `[Pedro]`
| Aresta | Regra |
|---|---|
| **Rio** | Bloqueia. Atravessar sem ponte é teste **individual** de *Movimento*, com CD que escala com a Hostilidade. Quem falha recebe **2d6+3** de dano e é levado **1d6 hexes rio abaixo**; o mestre decide onde ele sai. Atravessar não custa metros extras. |
| **Ponte** | Travessia segura. Fica perpendicular ao rio, entre 2 hexes. |
| **Penhasco** | Bloqueia a passagem. Um lado bloqueia a visão; do outro, a névoa se revela. |

`[proposta]` **CD do rio = 10 + Hostilidade/2.** Dá 10, 15 e 20 em Hostilidade 0, 10 e 20, os mesmos valores da
rodada anterior.

### 2.5 Vias e territórios `[Pedro]`
- **Estrada** e **trilha** passam pelo centro do hex e saem perpendiculares às arestas.
- **A via manda no custo:** estrada 1,5 m e trilha 3 m em qualquer terreno.
- **Território de cidade:** um contorno nas bordas dos hexes, pintado com um pincel de borda.

## 3. Movimento e tempo

### 3.1 Orçamento do dia `[Pedro]`
- O orçamento do dia é **o menor Movimento do grupo, em metros**, para 16 h de viagem.
- Cada hex cobra o custo do tipo, ou o da via.
- O mestre pode mudar o custo de qualquer hex.
- Exemplo com 9 m: 2 hexes de Campos, 3 de trilha ou 6 de estrada.

`[proposta, aceita na rodada 2]`
- A sobra do orçamento se perde no fim do dia.
- Um hex mais caro que o orçamento inteiro leva 2 dias.

### 3.2 Navegação `[Pedro]`
- **Embarcação é serviço**: contrata-se, e ela não vai para o inventário.
- O barco anda **pelas arestas do rio, a 1,5 m cada**, o que dá 2 movimentos por hex. Hex de Água custa 1,5 m.

### 3.3 Períodos e paradas
- **Períodos** `[Pedro]`: manhã, tarde e noite.
- **Gatilho** `[proposta]`: cada período fecha quando o gasto acumulado do dia passa de 1/3 e de 2/3 do orçamento. O fim
  da noite é o acampamento (descanso longo, 8 h).
- **Uma parada por hex, no máximo.** Se dois fins de período caem no mesmo hex, vale uma parada.
- **Paradas** `[Pedro]`: fim de período, acampamento, ou quando o grupo escolhe parar.
- O conteúdo preparado de um hex substitui a rolagem na primeira visita.
- **Na parada** (ordem):
  1. Resolve-se a consequência da Jornada, se houver, a menos que o hex seja de conflito.
  2. Rola-se a tabela do hex (§5).
- **Emboscada no descanso** `[Sistema]`: continua como está. Quem fica de vigia tira o *Desprevenido*.

## 4. Jornada `[Sistema + Pedro]`

### 4.1 O teste
- O teste acontece **na locomoção, não ao pisar no hex** `[Pedro]`.
- As ações e as CDs são as do Sistema:
  - Guiar (no máximo 1): *Sobrevivência* CD 15, +2 ao sucesso do grupo, +1 a cada 5 pontos acima;
  - Motivar, Vigiar e Outros: CD 15, +1, +1 a cada 5 pontos acima.
- A meta é 3 + Hostilidade/5 pontos.

`[proposta]` **1 teste de Jornada por dia de viagem**, com a maior Hostilidade dos hexes andados no dia. Um teste por
período (3 por dia) dobraria ou triplicaria o desgaste.
- Chance de fracasso (simulação, grupo de 5; bônus do guia / dos outros):

  | Hostilidade | +4 / +2 | +6 / +4 | +8 / +6 |
  |---|---|---|---|
  | 5 | 52% | 31% | 14% |
  | 10 | 70% | 48% | 25% |
  | 15 | 85% | 65% | 39% |
  | 20 | 93% | 79% | 54% |
- Conta em Hostilidade 10, grupo médio (+6 / +4): o fracasso fica perto de 50%.
- A faixa média de dano é 2d6+10 ≈ 17 de Saúde e de Stamina.
- Com 3 testes por dia, o grupo perderia ~25 de Saúde por dia só de desgaste.

### 4.2 Consequências `[Pedro]`
- **Uma tabela d100 por região.**
- É o desgaste contínuo da região: só dano de Saúde e Stamina, **sem condições**.
- **Sempre com o "+Hostilidade", salvo no 100**, que livra o grupo.
- Os números ficam os do Sistema. O que muda por região é o **texto temático** de cada faixa (o que causou o dano).

| d100 | Dano em cada integrante |
|---|---|
| 1 | 4d6 + H de Saúde e Stamina |
| 2–19 | 2d8 + H de Saúde e Stamina |
| 20–39 | 2d6 + H de Saúde e Stamina |
| 40–59 | 1d6 + H de Stamina |
| 60–79 | 1d4 + H de Stamina |
| 80–99 | H de Stamina |
| 100 | evita todas as consequências |

(As "7 faixas" da rodada anterior eram estas 7 linhas do d100, não as regiões.)

## 5. Tabelas de eventos dos hexes `[Pedro]`

### 5.1 Princípio
- Cada região tem uma **tabela global de eventos**.
- Cada hex neutro monta **a sua tabela** a partir dela, com eventos adversos e favoráveis **nem sempre na mesma
  proporção**.
- A tabela do hex é **oculta aos jogadores**.
- A região garante eventos exclusivos dela e segrega os que destoam. Por isso, a tabela global é por região, e não
  por tipo de hex.

### 5.2 Categorias de evento
| Categoria | Raridade típica | Marca o mapa? |
|---|---|---|
| Sítio de extração de materiais | comum | não |
| Combate (criaturas de Kharavel) | comum | não |
| Encontro de interação (NPC hostil, neutro ou amigável da região) | comum | não |
| Comerciante ambulante (estoque aleatório, mostrado no app) | comum | não |
| Ruína (masmorra pré-feita) | notável | **sim** |
| Assentamento (serviços, comerciantes, taverna, side quest; vilas pré-feitas, algumas por região) | notável | **sim** |
| Covil (inclui assentamento de facção hostil) | notável | **sim** |
| `[proposta]` Abrigo (o próximo descanso sobe 1 nível de comodidade) | comum | não |
| `[proposta]` Mirante (revela a névoa num raio maior) | notável | sim |
| `[proposta]` Achado (lore, item, segredo) | raro | sim |

**Regras de raridade** `[Pedro]`:
- **Notáveis e raros** saem de **todas** as tabelas da região quando sorteados e ficam marcados no mapa para sempre.
  Em geral são estruturas mais trabalhadas.
- **Comuns** continuam nas tabelas e não marcam o mapa.
- **Nenhum evento trava a narrativa principal**: quase sempre é lore local e isolada. A exceção possível são os mais
  raros.

### 5.3 Montagem da tabela do hex `[proposta]`
1. **Filtra** a tabela global da região pelo **tipo do hex**: cada evento lista os tipos em que pode aparecer.
2. **Sorteia de 8 a 12 entradas**, respeitando a **mistura de polaridade da região**, com ±10% de variação por hex:

   | Rank da região | Favorável | Neutro | Adverso |
   |---|---|---|---|
   | 1–2 | 40% | 35% | 25% |
   | 3–5 | 33% | 34% | 33% |
   | 6–7 | 27% | 33% | 40% |
   | 8–9 | 20% | 30% | 50% |

3. **Peso por raridade:** comum 10, notável 3, raro 1. A tabela é guardada como pesos, e as faixas do d100 saem deles
   na hora.
4. Quando um notável ou raro sai, ele some de todas as tabelas, e as faixas se recalculam.
5. O mestre pode **revisar e travar** a tabela de cada hex antes da sessão. É a verificação manual que o Pedro quer
   para a coerência.

### 5.4 Extração de recursos `[Pedro]`
- **Viés da rolagem:** depois que um sítio de extração sai no dia, a chance de outro cai **exponencialmente**.
  `[proposta]` O peso da categoria é multiplicado por **0,5ᵏ**, onde k é o número de sítios do dia. A função
  **Descanso** (longo) zera o k.
- **Quantidade** `[Pedro: depende do sucesso em Sobrevivência e da raridade]`. `[proposta]`
  - CD de *Sobrevivência* = a CD de craft da raridade do Material: 10 Ordinário, 13 Incomum, 16 Exótico, 20 Luxária.
  - Unidades = 1 + ⌊(resultado − CD) / 5⌋ no sucesso, e 0 na falha.
  - Cada personagem extrai uma vez por sítio.
- O Material sai da lista da região, que vem do CSV do Bazar (`Obtenção` com o nome da região).

### 5.5 Comerciante ambulante `[Sistema + proposta]`
- Usa a regra de Comerciantes: nível 1, estoque de 250 Sins, preço **rolado** na faixa da raridade.
- O estoque é aleatório e sai dos itens do Bazar daquela região. A raridade tem um teto pelo rank da região
  `[proposta]`.

## 6. Névoa e visão

- **Névoa** `[Pedro]`: o mapa não começa revelado. A tabela de eventos é sempre oculta.
- **Penhasco:** um lado bloqueia a visão; do outro, a névoa se revela.
- `[proposta]` Cada hex tem 3 estados:
  - **oculto:** só névoa;
  - **avistado:** textura, ícone, vias e arestas;
  - **visitado:** o hex já foi rolado e, se o evento foi notável ou raro, ganha a marca.
- `[proposta]` **Raio de visão** a partir do hex do grupo, medido em linha reta: 1 hex como padrão; 2 em Colinas e
  Litoral; 3 em Montanha; 0 em Floresta Densa (só o próprio hex). O penhasco corta a linha de visão vista do lado
  baixo.

## 7. Decisões para o Pedro (a recomendação vem primeiro)

1. **Tamanho:** manter 30 colunas (~600 hexes) ou ir a 24 (~380)?
2. **Escala de dificuldade:** a ordem dentro de cada CR e a Hostilidade-base de 5/10/15/20 por CR (§1.1) estão certas?
3. **1 teste de Jornada por dia** (recomendado), ou 1 por período?
4. **O que a névoa mostra:** os 3 estados da §6? Ou o hex sob névoa já mostra textura e ícone, e a névoa esconde só as
   vias, os rios e o recorte do litoral?
5. **Raio de visão** por tipo de hex (§6)?
6. **Hex comum re-rola** a cada parada nova ali? E o hex que ganhou um notável **vira** aquele lugar, sem rolar
   mais?
7. **Montagem:** de 8 a 12 entradas por hex, a mistura por rank e os pesos 10/3/1 (§5.3)?
