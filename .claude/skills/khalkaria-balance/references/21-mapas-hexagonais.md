# Mapas hexagonais de Kharavel: regras e catálogo de hexes (rodada 2, 2026-10-22)

Pedido do Pedro: separar o continente em 9 mapas regionais de grade hexagonal.
- A cor do hexágono define a região.
- Ruas, trilhas e rios têm propósito de design.
- Todo hex em que o grupo para tem algo.
- Os 9 mapas juntos refazem o continente.
- Khaskavel e Revavena ficam fora das regiões, com mapas próprios que não são hexagonais.

**Objetivo do Pedro:** *"fazer os jogadores visualizarem melhor por onde eles podem ir, o mapa como é gerado por ia,
não tem caminhos e game design intencional, isso que eu quero mudar, cada rio e estrada terá um proposito em levar
os jogadores mais perto de objetivos."*

**Origem de cada parte:** `[Pedro]` decidido por ele · `[proposta]` minha, precisa de aceite.

---

## 0. As 9 regiões `[Pedro]`

| Região | Cor da legenda | Marcos no mapa |
|---|---|---|
| Emaranhado de Raízes | magenta | a Grande Árvore |
| Bosque Corrompido | vermelho | Vilarejo Skarv, **Templo da Profecia** |
| Cinturão Silencioso | ciano | (Revavena dentro do contorno, mas é cidade) |
| Bacia Acidentada | cinza | o lago central, o Castelo em Ruínas |
| Deserto do Abismo | roxo | a cratera, O Oasis |
| Terras Livres | amarelo-oliva | Kurian |
| Cordilheira Cristalina | azul | a cordilheira |
| Costas Rochosas | verde | Minas dos Krichama |
| Ermo das Cinzas | preto | a fortaleza do sudeste |

⚠️ O CSV do Bazar conhece 8 regiões e não tem a Bacia Acidentada.

## 1. A grade

- **30 colunas** de hex **de topo pontudo**, com coordenada em cada hex `[Pedro]`.
- Na mesa, a coordenada global vira `CCLL` (coluna e linha). Uma grade mestra cobre o continente, e os 9 mapas são
  recortes dela `[proposta, rodada 1]`.
- **Gerar os 9 mapas por programa** `[Pedro]`: *"antes vamos definir o esqueleto e todos os hex possíveis, assim,
  basta pegar a arte de cada hex e gerar o mapa, 450 hexes não da pra fazer na mão."*
  - Uma arte por tipo de hex (§4) basta.
  - A cor da região entra como tinta ou contorno do hex, não como arte nova.
  - Com isso, os ~450 hexes saem de uns 15 tipos de arte.

## 2. Movimento `[Pedro, com a tabela de custo proposta]`

**Orçamento do dia = o menor Movimento do grupo, em metros.** O dia de viagem tem 16 h. Cada hex cobra um custo, e o
grupo anda enquanto o orçamento paga.
- Fora de via, o custo é o do terreno (tabela da §4).
- **Trilha: 3 m.**
- **Estrada: 1,5 m.**

Exemplo do Pedro, com Movimento de 9 m: 2 hexes por dia em terreno aberto (4,5 m cada), 3 em trilha e 6 em estrada.

`[proposta]` Três complementos para a conta fechar sempre:
- **A via manda no custo.** Estrada custa 1,5 m e trilha 3 m em qualquer terreno, porque a via existe para isso. O
  terreno só vale fora de via. O Pedro pode mudar o custo de um hex específico.
- **A sobra do orçamento se perde** no fim do dia.
- **Hex mais caro que o orçamento inteiro** (ex.: Montanha de 9 m para um grupo de 6 m) **leva 2 dias.**
- **Navegação:**
  - A embarcação tem velocidade própria (o Pedro sugeriu ~9 numa embarcação grande).
  - Um **trecho** é uma aresta de rio ou um hex de água (lago, mar).
  - A velocidade é dada em trechos por dia.

## 3. Rios, paradas, Jornada e eventos

### Rios `[Pedro]`
- **Rios passam pelas arestas** e bloqueiam o caminho.
- **Estradas e trilhas passam pelo centro** e saem perpendiculares às arestas.
- **Atravessar fora de ponte:** cada um rola *Movimento* contra CD 10, 15 ou 20, conforme o rio. **Quem falha recebe
  2d6+3 de dano e é levado 1d6 hexes rio abaixo.**

`[proposta]` Toda estrada ou trilha que cruza um rio tem **ponte** naquela aresta. Assim, a ponte é um ponto de
controle de design: é por ali que o grupo passa.

### Parada `[Pedro]`
O grupo para no fim de cada período, no acampamento, ou quando escolhe parar. Um hex com conteúdo preparado
substitui a rolagem na primeira visita.

`[proposta]` Com o orçamento por metros, o **fim de período** acontece no primeiro hex em que o gasto acumulado do
dia chega à metade do orçamento.

### Jornada e eventos adversos `[Pedro]`
- O **teste de Jornada** (Sistema) decide se há complicação no trecho.
- **O que muda é a tabela de consequências.** Ela deixa de ser "dano em Saúde e Stamina" genérico e vira **uma
  tabela d100 por região**, criativa, com eventos adversos temáticos e preestabelecidos.
- A consequência se resolve **ao parar**, a menos que o hex seja um hex de conflito.
- A emboscada no descanso continua como está.

`[proposta]` A Hostilidade do trecho é a maior entre os hexes atravessados. A região dá o padrão, e o hex pode ter a
sua.

### Orçamento de severidade das tabelas regionais `[proposta: régua de balanceamento]`
As 7 faixas da tabela atual ficam com a **mesma probabilidade** e o **mesmo peso**. Muda só o conteúdo. Assim, o
perigo de uma Jornada fracassada não muda de região para região; muda só a história.

| d100 | Faixa | Custo-base atual (em cada membro) | O evento temático tem de custar |
|---|---|---|---|
| 1 | Catástrofe | 4d6+H de Saúde e Stamina | o mesmo, mais uma consequência que dura até o descanso longo |
| 2–19 | Grave | 2d8+H de Saúde e Stamina | ≈ o mesmo |
| 20–39 | Sério | 2d6+H de Saúde e Stamina | ≈ o mesmo |
| 40–59 | Moderado | 1d6+H de Stamina | ≈ o mesmo |
| 60–79 | Leve | 1d4+H de Stamina | ≈ o mesmo |
| 80–99 | Mínimo | H de Stamina | ≈ o mesmo |
| 100 | Escapa | nada | nada (pode haver um ganho pequeno temático) |

**Regras de troca, para o evento criativo caber na faixa:**
- **O termo "+H" fica sempre.** É ele que faz a região hostil machucar mais.
- **Até metade do custo-base pode virar efeito no lugar de dano:** uma condição até o fim do dia, perda de tempo
  (meio orçamento do dia seguinte), um item consumível perdido ou um membro separado do grupo.
- **Câmbio:** 2 de Saúde = 1 de Stamina; 1 de Éter ≈ 1 de Stamina (régua do sistema).

### Hexes: o que há em cada um `[Pedro]`
- A maioria é **neutra**: na primeira parada, rola-se **d100 na tabela do tipo de hex**, e o resultado **fica
  definido para sempre**.
- O evento sorteado **sai da tabela** para os outros hexes.
- O **hex de recurso** sempre deixa extrair um recurso disponível na região.
- Os **hexes personalizados** dão riqueza ao mapa.

**Ordem na parada** `[proposta]`:
1. A consequência da Jornada, se o grupo falhou (salvo hex de conflito).
2. O conteúdo do hex: rolar a tabela, se o hex ainda não foi definido, ou aplicar o que ele já é.

## 4. Catálogo de hexes gerais `[proposta]`

### 4.1 Terrenos neutros (rolam d100 na primeira parada)
O custo é em metros, a pé e fora de via. A coluna "Regiões" diz onde o tipo domina; a arte mostra em quais regiões
ele aparece.

| # | Tipo | Custo | Regiões | O que cobre |
|---|---|---|---|---|
| T1 | **Campos** | 4,5 | Terras Livres, Cinturão, Bosque | planície, pradaria, plantação, estepe |
| T2 | **Floresta** | 6 | Cinturão, Bosque, Terras Livres, Costas | mata aberta, bosque comum |
| T3 | **Mata Fechada** | 7,5 | Bosque Corrompido, Emaranhado | floresta densa, corrompida, de raízes gigantes |
| T4 | **Colinas** | 6 | Costas Rochosas, Bacia, Cinturão | morros, pedregal, terreno acidentado |
| T5 | **Montanha** | 9 | Cordilheira | encosta, pico, neve, cristal |
| T6 | **Alagado** | 7,5 | Bacia Acidentada, Bosque | pântano, charco, várzea, margem de lago |
| T7 | **Areal** | 6 | Deserto do Abismo | dunas, deserto, chão de cânion |
| T8 | **Ermo** | 4,5 | Ermo das Cinzas, Deserto | cinzas, terra morta, árido, escória |
| T9 | **Litoral** | 4,5 | todas as costas | praia, costão, falésia, mangue |

São 9 tipos e 9 tabelas d100. A tabela é do **tipo**, não da região. Cada entrada traz um **encaixe regional**, para
uma tabela servir a qualquer região com o tema certo. Exemplo de Floresta:
- "Covil de [fera da região]";
- "Árvore marcada por [facção da região]";
- "[Material da região] exposto".

**Faixas de cada tabela d100:**

| Faixa | O que tem | Repete? |
|---|---|---|
| **Comuns** (cerca de 60%) | paisagem sem nada; trilha de caça; água potável; ervas comuns; marcas de passagem | **sim**: nunca saem da tabela, porque a maioria dos ~450 hexes cai aqui |
| **Notáveis** (cerca de 30%) | clareira de descanso (+1 comodidade); ninho ou covil (combate ao parar); ruína pequena; viajante acampado; carcaça com loot; mirante (revela os hexes vizinhos) | **não**: saem da tabela daquela região |
| **Raros** (cerca de 10%) | achado (item Incomum+); segredo ou lore; entrada de masmorra; fenômeno místico | **não**: saem da tabela daquela região |

Se a rolagem cair numa entrada que já saiu, vale a próxima entrada livre abaixo.

### 4.2 Hexes especiais (definidos à mão, não rolam)

| # | Tipo | Custo | O que faz |
|---|---|---|---|
| E1 | **Recurso** | terreno | extrai 1 Material da região (§5, decisão 4); a arte é o terreno com o marcador do recurso |
| E2 | **Povoado** | 4,5 | vila, posto ou acampamento nômade: comerciante, descanso no mínimo Normal, rumores; em geral numa estrada |
| E3 | **Marco** | terreno | os marcos do Pedro: Templo da Profecia, Grande Árvore, Castelo em Ruínas, O Oasis, Kurian, Minas dos Krichama… |
| E4 | **Covil** | terreno | **hex de conflito**: combate ou masmorra garantidos; a consequência da Jornada não se aplica aqui |
| E5 | **Refúgio** | terreno | abrigo seguro (caverna, ruína firme, santuário): descanso sem emboscada |
| E6 | **Portão** | 4,5 | entrada de Khaskavel ou Revavena, que levam ao mapa próprio de cada cidade |

### 4.3 Água (não se anda; navega-se)

| # | Tipo | O que é |
|---|---|---|
| A1 | **Lago** | a Bacia Acidentada; ilhas são hexes de terreno dentro dele |
| A2 | **Mar** | a orla do continente |

### 4.4 Arestas (não são hex: correm nas bordas)

| Aresta | Efeito |
|---|---|
| **Rio** | bloqueia; atravessa com *Movimento* contra CD 10/15/20 ou pela ponte; navega-se com embarcação |
| **Ponte** | aresta de rio onde a via cruza; atravessa sem teste |
| **Penhasco** `[proposta]` | bloqueia como o rio, mas não se navega; sobe-se com *Movimento* (escalar) contra CD 15/20 ou pela trilha. Desenha as paredes da cratera do Deserto e as encostas da Cordilheira |

**Arte necessária:** 9 terrenos + 6 especiais (o especial usa o terreno de base com um ícone por cima) + 2 de água +
3 arestas. São cerca de 20 peças, mais a tinta de 9 cores.

## 5. Gramática das vias `[proposta]`
É o que dá intenção ao mapa:
- **A rede é um grafo.** Os nós são os hexes especiais (Povoado, Marco, Portão, Recurso, Covil, Refúgio). As vias são
  as ligações entre eles.
- **Estrada** liga Povoado, Portão e Marco grande entre si, e cruza fronteiras de região (é o eixo da campanha).
- **Trilha** sai de uma estrada e leva a 1 objetivo: Recurso, Covil, Refúgio ou Marco menor.
- **Rio** bloqueia e força a ponte. Ao mesmo tempo, liga lago e mar a um Povoado, e quem tem barco atalha.
- **Penhasco** fecha uma área e deixa 1 ou 2 entradas.
- **Regra de desenho:**
  - todo hex especial fica a até 2 hexes de uma via;
  - toda via termina num especial ou numa fronteira;
  - não há via que não leve a nada.

## 6. Decisões para o Pedro (a recomendação vem primeiro)

1. **"Sai da tabela": em que escopo?**
   - Recomendação: por região, e só para as faixas Notáveis e Raras.
   - As Comuns repetem, senão uma tabela de 100 se esgota em ~30 hexes do mesmo tipo.
2. **Tabela d100 por tipo de hex**, com encaixe regional (9 tabelas), **ou por tipo × região** (até 81 tabelas)?
3. **Rio, na falha:** quem é levado sai **na mesma margem de onde partiu**, 1d6 hexes rio abaixo. Se o rio deságua
   antes disso, sai na foz. Atravessar não custa metros extras: a CD é o custo.
4. **Hex de Recurso:**
   - 1 extração por personagem por dia;
   - teste de *Sobrevivência* (ou do Ofício do material) contra a CD de craft da raridade (10/13/16/20);
   - 1 unidade de um Material da tabela da região.
   - Sem limite, ele vira fonte infinita de Sins. O teto natural seria o estoque do Fornecedor (250/500/1000 por
     dia).
5. **Cores das regiões vizinhas:** quando falei de "orla", não era o litoral. Era o anel de hexes da região vizinha
   que aparece na borda de cada mapa regional, com a cor dela. Você descreveu isso: *"aparecem nos mapas adjacentes
   nas bordas"*. **Mostro 1 anel de hexes vizinhos** em cada mapa (recomendado, porque é o que mostra as cores e as
   vias que continuam), ou nenhum?
6. **A via manda no custo?** Estrada 1,5 m e trilha 3 m em qualquer terreno, inclusive na Montanha.
7. **Penhasco** como aresta que bloqueia, para desenhar a cratera e a cordilheira?
8. **Navegação** em trechos (1 aresta de rio ou 1 hex de água) por dia, e as embarcações como itens do Bazar, com a
   velocidade no texto?
9. **Fim de período** = o primeiro hex em que o gasto do dia chega à metade do orçamento?
