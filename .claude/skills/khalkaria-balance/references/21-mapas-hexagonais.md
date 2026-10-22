# Mapas hexagonais de Kharavel: procedimento e regras (proposta, 2026-10-22)

Pedido do Pedro: separar o continente em 9 mapas regionais de grade hexagonal.
- A cor do hexágono define a região, e as cores vizinhas aparecem nas bordas.
- Ruas, trilhas e rios fazem parte do design: os rios servem para bloquear ou para navegar.
- Cada hexágono em que o grupo **para** ativa um efeito aleatório, que preenche onde não há conteúdo preparado.
- Os 9 mapas juntos têm de formar o continente de novo.
- Khaskavel e Revavena ficam fora das regiões, com mapas próprios que não são hexagonais.
- A conexão com a Jornada do Sistema fica para depois.

**Status:** proposta minha. Tudo aqui é adição de regra e precisa do aceite do Pedro (CLAUDE.md §1).

## 0. As 9 regiões (legenda do mapa do Pedro)

| Região | Cor da legenda | Marcos visíveis no mapa |
|---|---|---|
| Emaranhado de Raízes | magenta | a Grande Árvore |
| Bosque Corrompido | vermelho | Vilarejo Skarv |
| Cinturão Silencioso | ciano | Revavena fica dentro do contorno, mas é cidade com mapa próprio |
| **Bacia Acidentada** | cinza | o lago central, o Castelo em Ruínas |
| Deserto do Abismo | roxo | a cratera, O Oasis |
| Terras Livres | amarelo-oliva | Kurian |
| Cordilheira Cristalina | azul | a cordilheira |
| Costas Rochosas | verde | Minas dos Krichama |
| Ermo das Cinzas | preto | a fortaleza do sudeste |

Fora das regiões: **Khaskavel** (noroeste) e **Revavena** (nordeste). O Templo da Profecia fica na junção do
Emaranhado, do Bosque e do Cinturão: a qual região ele pertence é ponto aberto (§6).

⚠️ O CSV do Bazar conhece 8 regiões e não tem a **Bacia Acidentada**. Isso fica sinalizado: o CSV é do Pedro.

## 1. O princípio: uma grade, nove recortes

**Nunca desenhar 9 grades independentes.** Grades desenhadas separadamente não encaixam: cada uma tem uma origem,
o tamanho do hex varia meio milímetro e as bordas desalinham.

O procedimento é ao contrário:
1. Uma **grade mestra** única cobre o continente inteiro, com coordenada global.
2. Cada hex recebe uma região, um terreno e as vias.
3. Os 9 mapas são **recortes** da grade mestra.

Como todo hex tem uma coordenada só, juntar os 9 mapas refaz o continente por construção. A conferência é por
conjunto, não a olho.

## 2. Procedimento de criação

### Passo 1 — Grade mestra sobre o mapa original
- Use a arte **original em alta resolução** (a imagem enviada é uma captura de 1156 × 935).
- Escolha a orientação e o tamanho (§4, decisões 1 e 2) e sobreponha **uma** grade no continente inteiro, incluindo
  o mar da orla.
- **Coordenada global de 4 dígitos, coluna e linha** (`CCLL`, por exemplo `1407`), como nos hexcrawls clássicos. Ela
  é legível na mesa e não muda de um mapa regional para outro.

### Passo 2 — Classificar cada hex
Cada hex recebe 4 campos:
- **região:** a que cobre mais da metade do hex. No empate, vale a região do **centro** do hex. Hex de mar fica
  `mar`; hex da área de uma cidade fica `cidade:<nome>`.
- **terreno:** planície, floresta, colina, montanha, pântano, deserto, lago, costa…; ele dá o custo de movimento (§3).
- **vias:** estrada, trilha e rio que passam pelo hex, com as direções de saída (os lados do hex por onde a via sai).
- **conteúdo fixo** (opcional): marco, cidade, masmorra ou o que o Pedro preparar.

### Passo 3 — Traçar as vias na grade
- **Estradas, trilhas e rios passam pelo centro dos hexes**, de centro a centro. Copiar o traçado da arte fica
  simples, e as três vias ficam na mesma lógica. A alternativa (rios na borda) está na decisão 3.
- Uma via que cruza a fronteira entre regiões vira um **ponto de passagem** com código (`BC-03` = 3ª passagem entre
  Bosque Corrompido e Cinturão Silencioso). O código aparece **nos dois** mapas.
- Lagos e mar são hexes de água: só se navega com embarcação.

### Passo 4 — Recortar os 9 mapas
Cada mapa regional tem:
- todos os hexes da região, com a cor da região;
- **uma orla de 1 hex** em volta, com a cor da região vizinha (a decisão 5 discute 2 hexes). A orla mostra as cores
  vizinhas e os pontos de passagem;
- a coordenada global impressa em cada hex.

Dois mapas vizinhos se sobrepõem exatamente na orla. Para montar o continente, sobrepõem-se os hexes de mesma
coordenada.

### Passo 5 — Conferência (por conjunto, como no resto do projeto)
1. Os hexes de terra de todas as regiões, mais os hexes de cidade, dão o total de terra da grade mestra.
2. Nenhum hex está em duas regiões (conferido por contagem de repetidos).
3. Todo ponto de passagem aparece nos dois mapas, com a mesma coordenada.
4. Toda via é contínua: cada hex de via tem uma saída que casa com a entrada do hex vizinho.
5. O hex de orla de um mapa tem a mesma cor e as mesmas vias que o hex correspondente no mapa vizinho.

### Ferramenta (opcional)
A grade mestra pode virar um arquivo de dados (`kharavel-hex.json`, um registro por hex), no espírito da Rota 1.
Um script lê o arquivo, desenha os 9 recortes com orla e cores e roda as 5 conferências. O Pedro pinta só a grade
mestra; os 9 mapas saem gerados e sempre encaixam.

## 3. Regras de exploração (proposta)

### Escala
Proponho fixar a escala pela mesa, não por quilômetro:
- **1 hex = meio dia de caminhada sem via, em terreno aberto.**
- O dia de viagem tem **2 períodos** (manhã e tarde) e termina no acampamento (descanso longo).

### Movimento por período

| Como o grupo anda | Hexes por período |
|---|---|
| Fora de via, terreno aberto | 1 |
| Fora de via, terreno difícil (floresta densa, montanha, pântano) | ½: 1 hex a cada 2 períodos |
| Trilha | 2 |
| Estrada | 3 |
| Rio, de barco, a favor da correnteza | 4 |
| Rio, de barco, contra a correnteza | 2 |

As estradas e trilhas puxam o grupo para os caminhos que o Pedro já preparou. É a previsibilidade que ele quer.

### Rios: bloquear ou navegar
- **Atravessar** um hex de rio fora de ponte ou vau custa o período e pede um teste de *Movimento* contra a CD do rio
  (riacho 10, rio 15, rio grande 20).
  - Na falha, o grupo atravessa mesmo assim, mas cada um perde 1d6 de Stamina e há risco de molhar ou perder uma
    bugiganga (a critério do mestre).
- **Navegar** exige uma embarcação e segue os hexes de rio com o movimento da tabela.

### A parada e o evento
- **O grupo para** no fim de cada período, no acampamento, ou quando decide parar num hex (explorar, descansar,
  esperar).
- **Cada parada rola 1 evento** no hex onde o grupo está.
  - Se o hex tem conteúdo fixo, ele toma o lugar da rolagem na primeira parada ali.
- O acampamento é uma parada como as outras. O resultado de combate nela é a emboscada que o Sistema já prevê no
  descanso: quem vigia tira o *Desprevenido*.

**A rolagem:** `1d20 + via − (Hostilidade / 5) + 2`.
- O bônus de via é +2 na estrada, +1 na trilha e 0 fora de via.
- A Hostilidade é a da região ou do hex, nos degraus 0/5/10/15/20 do Sistema (Jornada).

A tabela é ordenada: quanto menor o resultado, pior. Assim, um número só ajusta o perigo.

| Resultado | Evento | O que é |
|---|---|---|
| ≤ 3 | Combate grave | encontro da região acima do CR do grupo, ou emboscada |
| 4–6 | Combate | encontro da região no CR do grupo |
| 7–8 | Perigo | teste da região contra CD 10 + Hostilidade/2 (Fortitude no Deserto, Reflexos na Cordilheira…); na falha, perde 1d6 + Hostilidade/5 de Saúde ou Stamina |
| 9–10 | Clima ou terreno | o próximo período custa o dobro, ou −1d4 Stamina para todos |
| 11–12 | Rastro | pista que leva a conteúdo preparado ou a uma ameaça próxima |
| 13–14 | Viajante | NPC: informação, pedido de ajuda, troca |
| 15 | Comerciante ambulante | regra de Comerciantes, nível 1, categoria sorteada |
| 16–17 | Descoberta | Material da região (raridade sorteada) ou recurso de sobrevivência |
| 18–19 | Abrigo | o próximo descanso da parada sobe 1 nível de comodidade |
| 20+ | Achado | segredo, item ou lugar raro da região |

**Frequência de combate por parada** (resultados ≤ 6):

| Hostilidade | Estrada | Trilha | Fora de via |
|---|---|---|---|
| 0 | 10% | 15% | 20% |
| 10 | 20% | 25% | 30% |
| 20 | 30% | 35% | 40% |

Com 3 paradas por dia (2 períodos e o acampamento), uma região de Hostilidade 10 dá de 0,6 a 0,9 combate por dia.
Isso cabe no ritmo de 1 descanso longo e 2 curtos por dia. Ir pela estrada é mais seguro **e** cobre mais hexes por
parada.

**Cada região tem a sua tabela.** O esqueleto acima é igual para todas, e só o conteúdo muda (os encontros, o teste
do perigo, os materiais).

### Hex conhecido
Um hex já visitado e com o conteúdo fixo resolvido passa a "conhecido": a próxima parada nele soma +2. Isso conversa
com o Desbravador do Batedor ("jornadas já percorridas") e com a Hostilidade 0–5 da Jornada ("locais conhecidos").

### Conexão futura com a Jornada (só o gancho)
A **Jornada** resolve o deslocamento de um trecho entre paradas: o teste do grupo e a consequência do d100. O
**evento** resolve a parada. Para isso basta guardar a Hostilidade no hex desde já.

## 4. Decisões para o Pedro (a recomendação vem primeiro)

1. **Tamanho do hex** (estimativa a partir da captura, com cerca de 60% de terra):

   | Colunas no continente | Hexes de terra | Por região, em média |
   |---|---|---|
   | ~20 | ~200 | ~23 |
   | **~30 (recomendado)** | **~450** | **~50** |
   | ~40 | ~800 | ~90 |

   Com 30 colunas, a região pequena (Cordilheira) fica com ~25 hexes e a grande (Terras Livres, Deserto) com ~80. Dá
   para preparar a rede de vias e deixar o resto para a tabela.
2. **Orientação:** hex de topo chato, com colunas verticais e coordenada `CCLL`, ou de topo pontudo?
3. **Rios no centro do hex** (recomendado: mesma lógica das estradas, fácil de copiar da arte) ou **na borda** (mais
   fiel ao "bloquear", mas é preciso desenhar cada borda nos dois mapas vizinhos)?
4. **Escala:** "1 hex = meio dia de caminhada" e 2 períodos por dia?
5. **Orla de 1 hex** (recomendado) ou de 2?
6. **Gatilho:** evento a cada parada, com o acampamento contando como parada?
7. **Fórmula do evento:** `1d20 + via − Hostilidade/5 + 2` com a tabela ordenada, ou uma tabela por faixa de
   Hostilidade?
8. **Templo da Profecia:** a que região pertence? Ou é marco de fronteira, um hex de conteúdo fixo sem região?
9. **Ferramenta:** o Pedro pinta a grade mestra numa ferramenta de hex e eu gero os 9 recortes e as conferências por
   script? Ou ele desenha os 9 à mão com a grade mestra como molde?

## 5. Interações com o que já existe (para não duplicar)
- **Mapa do Batedor:** cobre 1000 m², muito menor que um hex. Funciona *dentro* de um hex, na cena, e não muda a
  grade.
- **Colecionador de Horizontes** (Cartógrafo): o "1º mapa de cada região de Kharavel" agora tem teto conhecido, as
  9 regiões da §0.
- **Acampamento** (Cartógrafo) e o resultado "Abrigo" da tabela sobem a comodidade do mesmo jeito. As fontes
  diferentes somam, até Luxuoso.
- **Comerciantes:** o comerciante ambulante usa a regra existente (nível 1, estoque 250).
