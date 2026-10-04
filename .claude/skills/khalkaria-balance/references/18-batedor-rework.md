# 18 — Rework do Batedor (rodada 6: os ramos)

**Status:**
- **No Notion** (D143 e D144, conferido por fetch e diff):
  - o cabeçalho (§1);
  - o Mapa e o Pontapé (§2, §3);
  - as 15 técnicas, todas fechadas (§4);
  - os nomes Pecador e Ladrão.
- **Proposta, nada no Notion:** os 3 ramos (§5). Na página, o conteúdo dos ramos ainda é o antigo e o status ainda diz "🟢 Pronto".
- Os logs para o agente de HTML estão no `17` §3.1. O agente espera o rework fechar para refazer a ficha do Batedor.
- **A classe inteira, pronta para auditar, está em `batedor-classe.md`.** Este arquivo guarda o porquê, os números e o histórico. A página de leitura (Artifact) foi descontinuada a pedido do Pedro (D148).

**Histórico:**
- Rodada 1: commit `a4ea40f`. Mapa de Combate + Instinto refeito.
- Rodada 2: commit `07c3d18`. Com as decisões do Pedro; 3 opções para a 2ª característica.
- Rodada 3: commit `53c7cb0`. Características fechadas; 15 técnicas propostas.
- Rodada 4: commit `1ff08e4`. Os textos do Pedro nas técnicas e 6 pontos abertos. Depois, o commit `a128457` registrou a ida ao Notion em parte (D143).
- Rodada 5: commit `ec2493e`. Os 6 pontos fechados (D144) e a proposta dos ramos.
- Rodada 6 (este arquivo): o Pedro reescreveu 4 peças do Cartógrafo e pediu para refazer o Mapa Tático (D147).
- As lições que o Pedro deu no caminho estão no `19-gabarito-de-classe.md` §12.

**Origem de cada texto:**
- **[Pedro]**: texto dele.
- **[Pedro, ajustado]**: texto dele, com a mudança descrita.
- **[nova]**: criação minha, precisa de aceite.

---

## 0. O que o Pedro decidiu (verbatim)

**Rodada 2** (2026-09-28):

> *"eu quero o batedor com muita Stamina, então 3/8/4, meu conceito é que seja uma classe que suporte builds à distância,
> corpo a corpo fragil multi-ataque, converter achados de exploração em poder de combate"*

> *"Quero punir o jogador batedor que não espera a luta, ser pego desprevenido pro batedor é a pior opção, estar com o mapa
> em prontidão para o combate é o pico."*

**Rodada 3** (2026-09-29):

> *"Característica de classe, mapa custa 5 Stamina para ilustrar."*

Sobre os 5 pontos do Mapa:
1. *"Ponha 9 m."*
2. *"Isso é implícito, nem precisa colocar. Vende-lo perde o efeito. A coisa importante é definir venda 1x/ área."*
3. *"Pode por essa referência."*
4. *"Boa, pode adicionar."*
5. *"É empilhável."*

> *"Vamos de Atalho, renomeado para Pontapé."* (texto dele em §3) — *"Ótimo!"*

**Rodada 4** (2026-09-29): o Pedro reescreveu as técnicas; os textos dele estão em §4.

> *"As 3 builds diagnosticadas estão corretas! à distância serve pros 3 ramos, Corpo a Corpo leve o ladrão deve ser
> melhor por conseguir depender da furtividade para aumentar defender. e Armadilheiro / Estratégico o cartógrafo se
> especializa."*

**Rodada 5** (2026-10-01), os 6 pontos:
1. *"Batida tática -> "Margem de Segurança""*
2. *"Pode trocar para dano contundente."*
3. *"Utilizar o cd normal dos terrenos faz essa técnica obsoleta no nível 4+, então tem que escalar com a cd do batedor. 2 Ações
   parece melhor do que 1 para essa técnica."*
4. *"Sim, a criatura utiliza 1 ação de movimento para se locomover em linha reta, e vamos trocar, ao invés de uma direção
   escolhida pelo batedor, a criatura anda em direção ao batedor. Faz sentido, porque o batedor é um alvo valioso, pouca vida,
   qualquer inimigo inteligente gostaria de golpeá-lo, o batedor utiliza isso brincando com o perigo para fazer o inimigo cair
   em suas armadilhas. A falha automática só dura enquanto a criatura se move até o batedor."*
5. Rasgar o Mapa: *"até o fim do combate, o seu Pontapé não custa Stamina, pode ser utilizado 2x/Turno e, durante esse
   combate, você pode utilizar as técnicas que exigem que você esteja na área do mapa."* + *"Traumas de batalha não te
   permitem desenhar o mapa dessa região novamente."*
6. *"melhor adicionar a perícia defender na lista de perícias que podem receber aumento de +1 a cada +2 stamina"*

**Rodada 5**, a direção dos ramos está em §5, no começo de cada ramo.

---

## 1. Cabeçalho [Pedro, fechado, no Notion]

**Status iniciais:**
- Saúde: `10 + (3 × Nível) + (Mod.CON × Nível)`
- Stamina: `8 + (8 × Nível) + (Mod.FOR OU Mod.DES × Nível)`
- Éter: `6 + (4 × Nível) + (Mod.INT OU Mod.SAB × Nível)`
- Evasão Ativa (Reação): 10 + Mod. Destreza + Dado de Defender
- Evasão Passiva (Sem reação): 10 + Mod. Destreza

**Treinamento:** Armas à Distância, Sobrevivência e Percepção. Além disso, (1 + Mod. Inteligência) perícias dentre: Iniciativa, Furtividade, Atacar, Investigação, Religião, Crime e Reflexos.

**Atributos Recomendados:** Destreza, Sabedoria e Inteligência.

**Play Style:** Exploração, Combate Estratégico e Mobilidade.

**CD:** 10 + Mod. Destreza + (Mod. Sabedoria ou Inteligência).

**Números** (CON +1; DES +3 no nível 1 e +5 no nível 5):

| Nível | Saúde | Stamina |
|---|---|---|
| 1 | 14 | 19 |
| 5 | 30 | 73 |

---

## 2. Característica 1 — Mapa [Pedro, fechado, no Notion]

> **Mapa.** Em 1 minuto, gastando 5 Stamina, a partir dos seus arredores, você ilustra um mapa da área, contendo tipo de
> terreno, hostilidades do local e informações gerais sobre a área em até 1000 m² (cerca de duas quadras de tênis: um
> quadrado de ~32 m de lado, ou 21 × 21 quadrados de 1,5 m).
> - Enquanto na área de um mapa fabricado por você:
>   - Você e aliados a até 9 m não podem ficar *Desprevenidos*.
>   - Você tem vantagem em *Iniciativa*.
> - A cada mapa desenhado, nomeie-o com o nome do local e adicione 1 item: Mapa no inventário.
> - Venda: 1x/área. Partes de um mesmo lugar (bairros de uma cidade, trechos de uma floresta) contam como o mesmo lugar.

**O que entrou:**
- 5 Stamina;
- 9 m;
- o quadrado de ~32 m;
- a venda 1x/área, com a definição de lugar do *Colecionador de Horizontes*.

O "precisa estar com você" ficou implícito, como o Pedro quis: vender o mapa tira o efeito.

**Item Mapa no CSV (duas cópias; efeitos rev. 10):**

`Mapa | Bugiganga | Ordinário | Mapa de uma área de até 1000 m² (~32 × 32 m), com tipo de terreno, hostilidades e informações gerais do local. Leva o nome do local. Venda 1x/área: partes de um mesmo lugar (bairros de uma cidade, trechos de uma floresta) contam como o mesmo lugar. Empilhável: pesa 1 bugiganga a cada 10 unidades. | 2d10+10 | Batedor · Loja | Não-craftável | Exploração`

A frase de empilhável é a mesma dos outros 88 itens empilháveis, e o arquivo de efeitos põe o Mapa em `empilhaveis`.

---

## 3. Característica 2 — Pontapé [Pedro, fechado, no Notion]

> **Pontapé (3 Stamina, Ação Livre).** No seu turno, enquanto estiver na área de um mapa seu, você se move até o seu
> Movimento sem provocar ataques de oportunidade e tem +2 de Evasão até o início do seu próximo turno. Depois de utilizar
> o Pontapé, a sua PMA volta a zero. 1x/rodada.

Números da rodada 2 (Atacar(1), 1d6 + 3, contra um alvo só):

| Turno | Acertos | DPR |
|---|---|---|
| Parado, 3 ataques | 1,05 | 7,4 |
| Mover + 2 ataques | 0,95 | 6,5 |
| Ataque, **Pontapé**, 2 ataques | **1,55** | **10,6** |

- **Defesa:** +2 de Evasão corta 15–18% do dano recebido.
- **Custo:** 3 Stamina por turno. Dá 6 turnos no nível 1 e 24 no nível 5.

---

## 4. Técnicas gerais (15): fechadas e no Notion

**As 15 estão fechadas.** As 9 da rodada 4 e as 6 que o Pedro fechou em 2026-10-01 (D144) estão no Notion, com os textos abaixo. Conferido por fetch e diff.

| Técnica | Descrição | Custo | Ação |
|---|---|---|---|
| Desbravador | Você possui a habilidade de memorizar caminhos e traçar trajetos eficientes. Você soma naturalmente +1 ao sucesso do grupo em jornadas já percorridas. Adicionalmente, ao rolar *Sobrevivência* em jornadas possui +5. | — | Passiva |
| Surpresa! | Na área de um mapa seu, na primeira rodada do combate, criaturas que ainda não agiram contam como *Desprevenidas* contra os seus ataques. | — | Passiva |
| Varredura | Uma vez por turno, o seu primeiro acerto contra uma criatura na área representada no seu mapa causa +1d6 de dano. Na área de um mapa seu, criaturas escondidas a até 9 m que se moverem deixam de estar escondidas para você. | — | Passiva |
| Bote | Depois de um Pontapé, o seu próximo ataque tem +1 Margem de Ameaça; se o ataque for corpo a corpo, ele não pode ser retaliado. | — | Passiva |
| Estudo de Campo | Ao criar um mapa, você pode escolher levar 10 minutos (ao invés de 1 minuto) para estudar o campo. Enquanto na área desse mapa, você tem +2 em Atacar e ignora terreno difícil. | — | Passiva |
| Armadilha Tática | Rapidamente configura uma armadilha no chão, rolando um teste de *Furtividade* ou *Sobrevivência* e atribuindo o resultado a ela. Quando um inimigo de tamanho Médio ou menor passar por cima ele deve superar a *Furtividade* ou *Sobrevivência* da armadilha rolando *Percepção* ou recebe (Nível + 1)d6 + Mod. Destreza de dano Perfurante e fica *Enraizado* por 1 rodada. Criaturas Grandes ou maiores recebem o dano, mas não ficam *Enraizadas*. Na área de um mapa seu, você pode montá-la em qualquer ponto pelo qual passou com o Pontapé neste turno, e a *Percepção* contra ela tem desvantagem. Você mantém até (Nível) armadilhas montadas; ao montar mais uma, a mais antiga se desfaz. | 3 Stamina | 1 Ação |
| Sabotar Terreno | Na área de um mapa seu, você afrouxa pedras, derrama água, álcool ou espalha cascalho num ponto que conhece: um quadrado de 4,5 m de lado a até 9 m de você vira Terreno Difícil, Escorregadio, Em Chamas ou Molhado (*Superfícies*) até o fim do combate. Os testes dessas superfícies são contra sua CD, no lugar da CD 15. Você mantém até (Nível) áreas assim. | 5 Stamina | **2 Ações** |
| Por Aqui! | Na área de um mapa seu, escolha uma criatura a até 18 m que possa te ver ou ouvir. Ela faz *Vontade* contra sua CD; se falhar, no próximo turno dela, ela utiliza 1 ação de movimento para se locomover em linha reta em direção a você. Enquanto se move até você, ela falha automaticamente nos testes da Armadilha Tática e do Sabotar Terreno. | 3 Stamina | 1 Ação |
| Ocultar-se | Ao estar fora da linha de visão de todas as criaturas da cena, pode se esconder com 1 ação em vez de 3. | 2 Stamina | 1 Ação |
| Rasteira | Durante o Pontapé, ao passar a até 1,5 m de uma criatura de tamanho igual ou menor que o seu, role *Movimento* contra o *Movimento* dela: se vencer, ela recebe (Nível)d4 de dano **Contundente** e fica *Caída*. | 3 Stamina | Ação Livre |
| Rasgar o Mapa | Rasgue o mapa da área em que você está: até o fim do combate, o seu Pontapé não custa Stamina, **pode ser utilizado 2x/Turno** e, durante esse combate, você pode utilizar as técnicas que exigem que você esteja na área do mapa. O mapa é destruído e sai do inventário. **Traumas de batalha não te permitem desenhar o mapa dessa região novamente.** | 1 Mapa | 1 Ação |
| Rolamento | Na área de um mapa seu, ao ser alvo de um ataque, some +1 à sua Evasão contra esse ataque para cada 2 Stamina gastos (máximo = Nível). | 2+ Stamina | Ação Livre |
| Fantasma | Ao realizar testes de *Crime*, *Furtividade* ou *Defender*, pode gastar 2 de Stamina para adicionar +1 na perícia, com limite máximo no aumento da perícia igual ao seu nível. | 2+ Stamina | Ação Livre |
| **Margem de Segurança** (ex-Batida Tática) | Na área de um mapa seu, quando uma criatura hostil terminar um movimento a até 1,5 m de você, você pode se mover até 3 m sem provocar ataques de oportunidade. | 2 Stamina | Reação |
| Emboscada | Pode preparar um local previamente com armadilhas e distrações rolando um teste de *Sobrevivência* ou *Furtividade*: Ao lutar em um ambiente preparado, se o inimigo falhar em um teste de *Percepção* contra seu teste, você e seus aliados recebem +2 em Atacar durante todo o combate e os inimigos ficam *Desprevenidos* na primeira rodada do combate. | 5 Stamina | 10 Minutos |

**Em negrito:** o que mudou em 2026-10-01. No Por Aqui!, a regra de movimento foi reescrita com as palavras do Pedro. O ataque de oportunidade segue a regra geral: quem se move provoca.

### Números com os textos do Pedro

**O Batedor preparado** (arma leve 1d6 + 3, nível 1, contra um alvo só):

| Turno | Dano por turno |
|---|---|
| Parado, sem mapa | 7,4 |
| Pontapé | 10,6 |
| Pontapé + Bote (+1 Margem de Ameaça num ataque) | 10,8 |
| + Varredura (+1d6 no 1º acerto) | 13,9 |
| + Estudo de Campo (+2 em Atacar) | **16,1** |

O Batedor que chega com o mapa estudado bate 2,2× o que bate sem mapa. É o "pico" pedido: *"estar com o mapa em prontidão para o combate é o pico"*.
- Em termos absolutos, o bônus pesa mais no nível 1. No nível 5, o *Destruir* do Brutalista já soma até 5d6 (17,5) num acerto.
- O peso maior do pacote está no +2 em Atacar do Estudo de Campo. Se quiser segurar o pico, é o número a mexer: +1 em vez de +2.

**Bote:** +1 Margem de Ameaça num ataque por turno é +5% de crítico, ~0,2 de dano por turno. Pequeno. O valor está no "não pode ser retaliado" do corpo a corpo.

**Rasteira:** (Nível)d4 de dano Contundente, com ~50% na disputa de Movimento. Por ser Contundente, a armadura (Ar) reduz.

| Nível | Dano | Esperado |
|---|---|---|
| 1 | 2,5 | 1,2 |
| 5 | 12,5 | 6,2 |

Além do dano, em 50% dos turnos o alvo fica *Caído*: não retalia, defende com −2 e gasta 1 ação para levantar.

**Sabotar Terreno + Por Aqui!:** o combo do armadilheiro pago.
- Custo: 2 Ações + 5 Stamina, mais 1 Ação + 3 Stamina. É o turno inteiro.
- A superfície usa a CD do Batedor (~15 no nível 1, ~20 no nível 5). Em Chamas pede Fortitude a cada 3 m, ou a criatura fica *Em Chamas*.
- Quem falha na Por Aqui! vem andando em linha reta até o Batedor e falha automaticamente nas armadilhas e superfícies do caminho.
- Quando ela termina o movimento a 1,5 m, a Margem de Segurança tira o Batedor dali (3 m, 2 Stamina). É o *"brincando com o perigo"* do Pedro.

### Builds (o Pedro confirmou as 3)

| Build | Para quem |
|---|---|
| À distância | serve aos 3 ramos |
| Corpo a corpo leve | o Ladrão é melhor (§5.2: o Ataque Furtivo tira a retaliação do turno) |
| Armadilheiro / estratégico | é a especialização do Cartógrafo (§5.1: Mapa de Combate) |

---

## 5. Ramos — proposta (rodada 5)

**Regras fixas de todos os ramos** (Pedro, rodada 3):
- **1ª técnica do T1:** dá treinamento em 1 perícia, mais um efeito adicional, muitas vezes o principal do ramo.
- **Marcas:** uma por ramo dá +5 em 1 perícia, 1 ponto por vez, por uma condição específica, mais 1 efeito menor.
- **T2:** explora uma vertente compatível com os outros ramos, *"e isso em todos os ramos entre sí"*.

**Regras novas** (Pedro, 2026-10-01), aplicadas aos três ramos:
- **No T1, uma das 3 técnicas é ativa e custa Stamina.** *"Recomendo, sempre uma das 3 técnicas de tier 1 ser ativa com custo de Stamina."*
- **Poucas passivas, cada uma com um número só.** *"Tem que tomar cuidado pra não estacar passivas e o jogador se perder no meio de tantos benefícios."*
- **Toda moeda gasta tem destino na ficção.** *"de alguma forma as moedas não podem simplesmente sumir, deve ter alguma explicação na lore para elas estarem sendo consumidas."*

**Formato de cada ramo:** 2 marcas, 3 técnicas no T1, 2 no T2 e 1 ultimate (19 §8). Todos os nomes novos passaram no `nomes_index.py`. "Lastro" colidia com uma magia de Nível 1 e virou "Bolso Cheio".

**Como os T2 conversam entre os ramos:**

| De | Para | Técnica |
|---|---|---|
| Cartógrafo | Pecador | Artista Apaixonado: o mapa vale mais |
| Ladrão | Cartógrafo | Arapuca: preso na armadilha vira alvo do Ataque Furtivo |
| Ladrão | Pecador | Cobra: o veneno custa Sins |
| Pecador | Ladrão | Isca de Ouro: *Desprevenida* liga o Ataque Furtivo |
| Pecador | todos | Preço da Vida: o Batedor tem a Saúde do Teurgo |

### 5.1 Cartógrafo (Exploração e Sobrevivência)

**Direção do Pedro (2026-10-01):**

> *"para o cartógrafo, eu quero focar principalmente em aumento de perícia passivo, individual e pra party através dos mapas.
> Tem que tomar cuidado pra não estacar passivas e o jogador se perder no meio de tantos benefícios. Recomendo, sempre uma das
> 3 técnicas de tier 1 ser ativa com custo de Stamina. Treinamento em sobrevivência e terreno ideal deve ser remodelado, hoje o
> worldmap de Kharavel tem 9 regiões, seria interessante ver o cartógrafo se beneficiar individualmente de mapear kharavel
> continuamente de alguma maneira."*

**Rodada 6 (2026-10-02): o Pedro reescreveu 4 peças (D147).** Os textos estão no `batedor-classe.md`.
- **Colecionador de Horizontes:** *"Ao desenhar um mapa pela primeira vez numa região de Kharavel, após escolher essa
  marca, recupere 4d6+(Mod. Int ou Mod. Sab) de Stamina e receba +1d4 de Stamina máxima."* O teto vem das 9 regiões:
  até +9d4 (média 22,5). A ficha guarda cada 1d4 rolado.
- **Cicatrizes da Jornada:** *"no efeito menor adicional, está mais pra um efeito forte"*. Antes, pagar 2d6 de Stamina
  transformava a falha em sucesso. Agora é *"Ao falhar em sobrevivência, você pode gastar 5 de Stamina para rolar a perícia
  novamente. 1x/descanso longo."*
- **Região Ideal** (ex-Terreno Ideal): o treino em Sobrevivência fica.
  - A região vale *"enquanto você tiver os mapas de 3 lugares diferentes significativos dela"*. Vender o mapa tira o
    efeito, o que cria uma tensão com a Arte, que valoriza o mapa.
  - Dá +2 em Atacar, Percepção, Investigação, Furtividade e Movimento.
- **Arte** (ex-Legenda): a lista passa a ser Percepção, Investigação, Iniciativa, Furtividade e Movimento. No nível 4, os
  mapas sobem 1 raridade. Com isso, a Arte absorve o Artista Apaixonado, e a vaga do T2 fica livre.
- **Mapa Tático** (ex-Croqui): *"achei essa técnica esquisita, quando o batedor joga correto e faz o mapa previamente, essa
  técnica o pune, sendo literalmente inútil. Refazer"*. Foi refeita (abaixo).

**Rodada 7 (2026-10-04, D149):**
- O Pedro aceitou o Mapa Tático refeito e deu a escala: +1, +2 a partir do nível 3 e +3 a partir do nível 5. A Arte ganhou a mesma escala, e a raridade dos mapas sobe já no nível 3.
- **Tier 2 do zero:** *"Tier 2, faremos do zero, sugira 4 técnicas. Vamos ramo por ramo, começando pelo cartografo, ultimate vamos por último."*
- Saem o Mapa de Combate e o Escapista. As 4 candidatas, com papel, números e limite, estão no `batedor-classe.md` ("Em auditoria"):
  - A. Gatilho Remoto: armadilheiro;
  - B. Esconderijos: furtividade para o grupo, vertente Ladrão;
  - C. Território Hostil: estrategista;
  - D. Rotas Conhecidas: exploração.
- Recomendação: A + B. A Gatilho Remoto entrega a build de armadilheiro (D142). Os Esconderijos são a vertente compatível com outro ramo que o gabarito pede no T2.
- **Achado:** a Armadilha Tática não diz se a armadilha some depois de disparada. A Gatilho Remoto depende disso; foi ao Pedro.
- **Mapa Tático no nível 5:** +3 numa perícia para o grupo. O *Campo de Batalha* (ultimate do General) dá +3 em Atacar, Defender e resistências ao mesmo tempo, mais extras. O Mapa Tático fica bem abaixo da ultimate.

**Mapa Tático refeito** (1 Ação, 3 Stamina) [nova]:
- O efeito principal serve a quem já tem mapa. É uma legenda de combate para o grupo: +1 numa perícia entre Defender,
  Reflexos, Fortitude e Vontade (+2 no nível 4), até o fim do combate.
- Sem mapa, o rascunho também cria a área (o quadrado de 18 m). É a saída exclusiva do Cartógrafo para a luta que começa
  sem mapa.
- **Por que defesa e resistência, e não Atacar:** o Cartógrafo já pode somar +2 de Atacar da Região Ideal e +2 do Estudo
  de Campo. Com Defender, o bônus só vale quando o aliado usa a reação para se defender. As resistências (Reflexos,
  Fortitude, Vontade) protegem de magia, veneno e medo.
- **Alternativa:** +1 de Evasão para o grupo, no lugar da perícia. É mais forte, porque vale contra todo ataque, e por
  isso não escala no nível 4.
- **O custo do despreparo:** quem chega sem mapa paga 1 Ação + 3 Stamina e perdeu a vantagem em Iniciativa e a proteção
  contra *Desprevenido* do início da luta. Se quiser punir mais, a criação da área pode custar 2 Ações.

**T2, a vaga do Artista Apaixonado:** proposta, o *Escapista* do Pedro [Pedro, ajustado].
- "Ao possuir um mapa da região em que está batalhando" vira "na área de um mapa seu".
- A CD 15 fixa vira disputa: Sobrevivência contra a maior Percepção entre os inimigos (lições 19 e 20).
- É uma fuga do grupo inteiro, compatível com qualquer ramo.

**Região Ideal, +2 em Atacar:** é o bônus que mais pesa.

| Batedor nível 2, arma leve, turno com Pontapé, no mapa | Sem a Região Ideal | Com a Região Ideal |
|---|---|---|
| Pacote das gerais (Estudo de Campo +2) | 16,1 | 18,1 |
| Ladrão escondido + Estudo de Campo | 24,8 | 28,3 |

Proposta: o Atacar da Região Ideal não soma com o do Estudo de Campo. Assim, ele vale onde o Batedor não estudou o campo.

**Cicatrizes, rolar de novo:** alterar o d20 (rerrolar) é o espaço reservado ao Xamã (19 §4, Pedro em 2026-09-28). Aqui
é 1x/descanso longo e só em Sobrevivência. Fica como pergunta ao Pedro, sem mudar o texto.

**Saem do Cartógrafo** (rodada 5, confirmado pelo Pedro ao reescrever):
- *Desenhar Mapa de Exploração*: a Região Ideal assume a ideia.
- *Artista Apaixonado*: absorvido pela Arte.
- *Mapa Mental*: virou o Mapa Tático.
- Do *Desenhar Mapa de Combate* saem o mapa de 300 m², a proteção contra *Desprevenido*, o *Ponto Cego* e o
  *Reposicionar*. Fica a Coordenação, no Mapa de Combate.

**Senhor das Linhas:** os 4 ajustes da rodada 5 continuam propostos:
- sai "Não pode ser flanqueado";
- a Criar Armadilha passa a dar (Nível + 1)d6 + DES;
- as CDs de Movimento passam a ser "contra sua CD";
- a frase do Tier 3 vira "1 vez por descanso longo".

### 5.2 Ladrão (Furtividade e Assassinato)

**Direção do Pedro (2026-10-01):**

> *"para o ladrão, eu quero que o ataque furtivo seja flexivel para ser utilizado para armas leves, pesadas e à distância. Mas
> temos que balancear o uso de armas pesadas nessa técnica. Uma das técnicas essenciais além do treinamento em Furtividade ou
> crime é encontrar algum facilitador para furtividade, já que ocultar-se(técnica geral) cobre grande parte dos problemas de
> utilizar furtividade frequentemente em combate, custo 3 ações -> 1 ação. Sugiro além de um amplificador mais amplo dessa
> mecânica, uma condição de combate que quanto atingida permite o ladrão a entrar em furtividade imediatamente após a sequência
> de ataques. Outra técnica interessante seria um buff na perícia crime, lembrando em não ir muito pro roleplay e se manter
> essencialmente nas mecânicas do sistema."*

**A regra de Furtividade do Sistema** (a base do ramo):
- Esconder-se custa 3 ações e pede estar fora do campo de visão de quem está ciente de você.
- Atacar escondido conta o alvo como *Desprevenido*: ele não reage e fica *Exposto*, então o 1º acerto é crítico.
- Atacar revela você ao alvo.

**Resumo:**

| Onde | Técnica | Origem | O que faz |
|---|---|---|---|
| Marca | Coleção de Últimos Suspiros | [Pedro] | marca de progressão (Furtividade) |
| Marca | Sussurro Final | [Pedro] | marca de traço |
| T1 | Ataque Furtivo | [nova] | treino em Furtividade ou Crime; sem reação no turno e +1d6 por acerto |
| T1 | Sumir | [nova] | **ativa:** esconder-se à vista depois dos ataques, com condição |
| T1 | Mão Leve | [nova] | **ativa:** Crime para desarmar e furtar em combate |
| T2 | Cobra | [Pedro, ajustado] | vertente Pecador (o veneno custa Sins) e à distância |
| T2 | Arapuca | [nova] | vertente Cartógrafo: preso na armadilha vira alvo do Ataque Furtivo |
| T3 | Silêncio | [Pedro, ajustes] | ultimate atual, com duração |

**Saem do Ladrão:**
- *Golpe Sombrio*: o Pedro apontou que pune a arma leve (lição 11).
- *Finta*: o Desorientar das armas contundentes e o Sumir cobrem a ideia. Pode voltar no lugar da Mão Leve.
- *Olhar de Brecha*: o Mapa já dá vantagem em Iniciativa, e o Sumir resolve a furtividade em combate.
- *Terror*: com o Ataque Furtivo, o ataque escondido já é crítico, e o Terror devolveria o *Exposto* a cada crítico, um crítico atrás do outro. Se quiser manter, só com 20 natural (ponto 6 abaixo).

#### Marcas
**Coleção de Últimos Suspiros** [Pedro] e **Sussurro Final** [Pedro] ficam como estão. A primeira já é a marca de progressão no formato do gabarito (+1 em Furtividade a cada 5 mortes escondido, até +5).

#### Tier 1

**Ataque Furtivo** (Passiva) [nova, no lugar do Golpe Sombrio]
- Você se torna Treinado em *Furtividade* ou em *Crime*, à sua escolha. Se já for Treinado, se torna Experiente e assim por diante.
- Quando você ataca uma criatura que não te percebeu, ou que está *Desprevenida*, até o fim do seu turno ela não pode reagir aos seus ataques, e cada acerto seu contra ela causa +1d6 de dano.

*Notas:*
- **Vale para leve, pesada e à distância.** O bônus é por acerto, então rende mais nos 2–3 ataques da leve e menos no ataque único da pesada. É o equilíbrio da pesada que o Pedro pediu.
- O 1º ataque escondido já é crítico pela regra do Sistema. O +1d6 é dado de técnica e não dobra.
- **O texto diz "não pode reagir", não "continua Desprevenida".** *Desprevenido* inclui *Exposto*, e aí todo acerto do turno viraria crítico.
- **"Ou que está Desprevenida"** liga o Ataque Furtivo na Surpresa! e na Emboscada (1ª rodada) e na Isca de Ouro do Pecador. É o jogo de emboscada do Batedor.
- **Corpo a corpo leve:** a arma leve abre 3 retaliações por turno; com o Ataque Furtivo, nenhuma. É por isso que o Ladrão é o melhor ramo para essa build (D142).

**Sumir** (Ação Livre, 2 Stamina) [nova]

Depois do seu último ataque do turno, se uma criatura que você atacou neste turno estiver *Desorientada* ou *Caída*, ou tiver caído a 0 de Saúde, você pode se esconder sem gastar ações, mesmo no campo de visão de criaturas cientes de você: role *Furtividade* contra a *Percepção* de cada criatura que te vê.

*Notas:*
- **É o amplificador e a condição de combate que o Pedro pediu.** A regra de Furtividade proíbe se esconder à vista de quem já te conhece; o Sumir abre essa porta quando o alvo cai, tropeça ou se desorienta.
- **Gatilhos que a classe já tem:** o Desorientar das armas contundentes, a Rasteira (*Caída*) e o Empurrar (*Caído*).
- **O loop:** atacar escondido, derrubar ou desorientar, Sumir. O turno seguinte começa escondido.

**Mão Leve** (1 Ação, 2 Stamina) [nova]

Escolha uma criatura a até 1,5 m e role *Crime* contra a *Percepção* dela. Se vencer, escolha um:
- desarmá-la, como a manobra Desarmar, e ficar com a arma;
- pegar 1 consumível que ela carregue (poção, munição, veneno).

Se ela não te percebeu, você continua escondido dela.

*Por quê:* é o reforço de Crime em mecânica de sistema. A manobra Desarmar existe (Movimento contra Movimento, a arma cai no chão); aqui é Crime contra Percepção, e a arma fica com você.

#### Tier 2

**Cobra** (Descanso Curto ou 1 Ação, 2 Stamina) [Pedro, ajustado]: o texto do Pedro, com 3 mudanças.
1. "deve suceder em um teste de Fortitude" → "Fortitude contra sua CD" (D57).
2. "ficar Envenenada" → "ficar com *Envenenamento*", o nome da página Condições.
3. Frase nova: "O veneno dura até o primeiro acerto." A munição é gasta por combate. Sem o limite, uma flecha envenenada envenenaria todos os disparos da luta.

*Vertente Pecador:* o veneno custa 5 Sins, e as moedas pagam os ingredientes. Serve também ao Ladrão à distância.

**Arapuca** (Passiva) [nova]

Uma criatura *Enraizada* por uma Armadilha Tática sua conta, para o seu Ataque Furtivo, como se não tivesse te percebido.

*Vertente Cartógrafo:* a Por Aqui! puxa a criatura, a armadilha prende e o Ladrão mata. O Ataque Furtivo vem sem se esconder, mas sem o crítico do *Exposto*, que só vem de atacar escondido.

#### Tier 3

**Silêncio** (1 Ação, 5 Stamina, Ultimate) [Pedro, ajustes pontuais]: o texto do Pedro fica, com 3 pontos.
1. **Duração:** o texto não diz. Proposta: "até o fim do combate".
2. *"Ao acertar um ataque furtivo, o ataque automaticamente é crítico"*: com o Ataque Furtivo, isso vale para todos os acertos do turno contra o alvo marcado (ponto 7 abaixo).
3. Frase do Tier 3 (L29).

#### Números

Ataque Furtivo, nível 2 (dano esperado por turno contra um alvo; modelo 60/35/10; script `scripts/classes/ataque_furtivo.py`):

| Turno | Leve 1d6 + 3 (3 ataques) | Pesada 1d12 + 3 (1 ataque) |
|---|---|---|
| Sem esconder, sem mapa | 7,3 | 6,0 |
| Escondido, só a regra do Sistema | 9,3 | 9,6 |
| + Ataque Furtivo | 12,9 | 11,7 |
| + Varredura (mapa) | 15,6 | 13,8 |
| + Estudo de Campo (+2 Atacar) | **19,3** | **16,1** |
| Loop: atacar e se esconder de novo no mesmo turno | 17,0 (2 ataques + Sumir ou Ocultar-se) | 16,1 (a ação que sobra esconde) |

- **Exposição:** a leve escondida sem o Ataque Furtivo abre 2 retaliações por turno; com ele, nenhuma.
- **Leve × pesada:** escondida, só pela regra, a pesada bate mais (9,6 × 9,3), porque o crítico dobra o d12. O bônus por acerto inverte isso: no pacote completo, a leve fica 20% acima. É o "balancear a pesada".
- **À distância simples:** igual à leve, sem exposição em nenhum caso. **Brutal (Atacar 3):** não sobra ação para se esconder no mesmo turno, então ataca escondida um turno sim, um não.
- **Escala:** o +1d6 é fixo. O ataque escondido escala sozinho, porque o crítico dobra os dados da arma, e eles sobem com o nível da arma. No nível 4, com o pacote completo, a leve faz 23,5 sem o Ataque Furtivo, 28,2 com +1d6 e 32,9 com +2d6 (ponto 5 abaixo).

#### Leitura de exploit
- **Sumir + Desorientar:** custa 4 Stamina por turno. Depende de acertar (60%) e de vencer a Percepção de cada criatura que te vê.
- **Sumir em grupo de lacaios:** mata um, some, mata outro. É o assassino que o ramo promete. Contra um chefe sozinho, só vale se ele cair ou se desorientar.
- **Mão Leve contra humanoide armado:** sem arma, ele luta com o ataque natural (1d4 no tamanho Médio). Contra feras, a técnica não serve; é a troca.
- **Silêncio + Ataque Furtivo:** crítico em todos os acertos do turno contra o alvo marcado. É ultimate, 1x/descanso longo.

### 5.3 Pecador (Dinheiro e Interação Social)

**Direção do Pedro (2026-10-01):**

> *"para o pecador, temos uma encruzilhada de possibilidades aqui. O que eu vejo ele melhor fazendo é adquirir sins, e da forma
> mais suja possível, uma técnica que o faça ser o banco do grupo, ou seja ele ganha vários buffs que escalam com a quantidade
> de sins no bolso dele. Outra técnica possível, seria um facilitador para adquirir e encontrar sins, algo parecido com a técnica
> de origem do criminoso. Para fechar, uma técnica ativa que consome sins em troca de talvez dano ou aumento em perícias
> coniventes ao ramo. Porém, de alguma forma as moedas não podem simplesmente sumir, deve ter alguma explicação na lore para elas
> estarem sendo consumidas."*

Das rodadas anteriores: *"Trambiqueiro dá mais dano com base na quantidade de sins no inventário"*; Sins como limiar de execução; nada de técnica que infere lore (lição 12).

**Resumo:**

| Onde | Técnica | Origem | O que faz |
|---|---|---|---|
| Marca | Homem de Negócios | [Pedro] | marca de progressão (Convencimento) |
| Marca | Viciado em Khan | [nova, no lugar do O Palpite] | marca de traço; Khan Sins |
| T1 | Bolso Cheio | [nova] | treino em Enganação ou Convencimento; **o banco do grupo** |
| T1 | Molhar a Mão | [nova] | **ativa que consome Sins:** suborno dá vantagem |
| T1 | Olho no Lance | [Pedro, remodelado; do T2] | **facilitador**, no molde do Criminoso |
| T2 | Isca de Ouro | [nova] | vertente Ladrão; **Sins como limiar de execução** |
| T2 | Preço da Vida | [nova] | comprar a própria vida |
| T3 | Suborno Irrecusável | [Pedro, ajustado] | agora custa Sins |

**Saem do Pecador:**
- *Bens Diversos*: é uma tabela d100.
- *Agiota*: custa 10 Stamina e depende de o alvo ter dinheiro no dia seguinte.
- *Cara de Pau*: o Bolso Cheio e o Molhar a Mão cobrem o Convencimento.
- *Conexões Duvidosas*: infere lore (lição 12).
- *Esquemas*: infere lore e é a 2ª ultimate do ramo (o gabarito pede 1). Pode ficar no lugar do Suborno.

**Para onde vão as moedas:**

| Técnica | Destino dos Sins |
|---|---|
| Bolso Cheio | não gasta; ao cair a 0, metade se espalha pelo chão |
| Molhar a Mão | ficam com quem você subornou |
| Isca de Ouro | ficam com a criatura; voltam se você a saquear |
| Preço da Vida | ficam com quem ia te matar |
| Suborno Irrecusável | ficam com a criatura subornada |
| Cobra (Ladrão) | pagam os ingredientes do veneno |

#### Marcas

**Homem de Negócios** [Pedro]: fica; é a marca de progressão (+1 em Convencimento a cada 5 negociações, até +5). A linha de personalidade está cortada no Notion: *"Você possui um disturbio de mat"*. O texto é do Pedro; precisa ser completado por ele.

**Viciado em Khan** [nova, no lugar do O Palpite; opcional]
> *"A casa sempre ganha. E você sempre é a casa."*

Você não resiste a uma mesa de apostas.
- Em mesas de Khan Sins, você tem vantagem no teste de *Crime* para roubar, e a mesa tem desvantagem para te roubar.
- Ao ser desafiado para uma aposta, faça *Vontade* (CD 15) ou aceite.

*Por quê:* o Palpite pede ao mestre que invente um segredo da criatura, e o Pedro não quer inferência de lore no Pecador (lição 12). O Khan Sins é regra do Sistema, com teste de Crime para roubar.

#### Tier 1

**Bolso Cheio** (Passiva) [nova]
- Você se torna Treinado em *Enganação* ou em *Convencimento*, à sua escolha. Se já for Treinado, se torna Experiente e assim por diante.
- O dinheiro fala por você. Com 50 Sins ou mais no bolso, você tem +1 em *Convencimento*, *Enganação* e no dano de cada acerto; com 200 ou mais, +2; com 700 ou mais, +3.
- Ao cair a 0 de Saúde, metade dos seus Sins se espalha pelo chão a até 1,5 m de você. Qualquer criatura pode recolhê-los com 1 ação.

*Notas:*
- **É o "banco do grupo":** quem guarda o dinheiro da mesa é o Pecador, e isso o deixa mais forte. A contrapartida é o dinheiro de todos no chão se ele cair.
- As faixas seguem a escala do Bazar: Incomum ~67, Exótico ~212, Luxária ~683.
- A ficha calcula o bônus pelo contador de Sins.
- **Gastar e guardar puxam em sentidos opostos:** cada Sin gasto nas outras técnicas pode baixar a faixa.

**Molhar a Mão** (Ação Livre, 2 Stamina) [nova]

Antes de rolar *Convencimento*, *Enganação* ou *Crime*, entregue (10 × Nível) Sins à criatura do teste, ou a quem testemunharia o seu crime: você rola com vantagem. As moedas ficam com quem as recebeu.

*Por quê:* é a ativa que consome Sins em troca de aumento em perícia conivente. As moedas têm destino: o bolso de quem foi comprado. O preço é de 20 Sins no nível 2 e de 50 no nível 5.

**Olho no Lance** (Passiva) [Pedro, remodelado; do T2 para o T1]
- Você sabe o valor de qualquer item ao examiná-lo.
- Você pode gastar 2 de Stamina para rolar com um treinamento a mais os testes de Khan Sins (a perícia da mesa, ou *Crime* para roubar) e os de *Investigação* ao vasculhar um lugar atrás de itens de valor.

*Mudanças:*
- **Saem os "+20% de Sins de todas as fontes":** o teto de modificador econômico é 10%, e a origem Mercador já tem os 10%.
- **Sai o *Revirar*** (2d10 Sins por cena): a D6 manda evitar Sins criados por cena.
- **Entra o treinamento a mais por 2 Stamina**, o mesmo molde do *Ilegal* do Criminoso. É o *"algo parecido com a técnica de origem do criminoso"*.

#### Tier 2

**Isca de Ouro** (1 Ação, 3 Stamina) [nova]

Arremesse até (10 × Nível) Sins aos pés de uma criatura a até 9 m que dê valor a dinheiro. Ela faz *Vontade* contra sua CD. Se falhar, recolhe as moedas e fica *Desprevenida* até o início do próximo turno dela. Se resistir, as moedas ficam no chão.

A criatura que recolheu seus Sins fica em dívida com você: quando um ataque seu a deixar com Saúde igual ou menor que metade dos Sins que ela recolheu, ela cai a 0. As moedas continuam com ela; saqueie-a para recuperá-las.

*Notas:*
- **É o Sins como limiar de execução.** É diferente do *Finalizar* (Saúde ≤ Brutalidade, até 5): o limiar é comprado, vale para um alvo só e só se ele pegou o dinheiro.
- **Teto:** até 20 de Saúde no nível 4 (40 Sins) e até 25 no nível 5 (50 Sins).
- **O risco:** se a criatura fugir, o dinheiro foi junto.
- **Vertente Ladrão:** *Desprevenida* liga o Ataque Furtivo.

**Preço da Vida** (Reação, 3 Stamina) [nova]

Quando o ataque de uma criatura que dê valor a dinheiro for te reduzir a 0 de Saúde, ofereça a ela (20 × Nível) Sins. Ela faz *Vontade* contra sua CD. Se falhar, aceita: você fica com 1 de Saúde, e as moedas ficam com ela. 1x/descanso longo.

*Notas:*
- O Batedor tem a Saúde do Teurgo, então a técnica serve a qualquer build.
- **Âncora:** "a 0 de vida, fica com 1" custa um item Exótico, ou 1x/campanha no Limiar. Aqui é 1x/descanso longo, mas custa Sins (80 no nível 4, 100 no nível 5), pede a resistência e só funciona contra quem quer dinheiro.

#### Tier 3

**Suborno Irrecusável** (2 Ações, 5 Stamina, Ultimate) [Pedro, ajustado]: o texto do Pedro fica, com 2 mudanças.
1. **Frase nova antes da rolagem:** "Ofereça (20 × Nível) Sins à criatura; as moedas ficam com ela." Um suborno sem dinheiro não fechava com o resto do ramo.
2. Frase do Tier 3 (L29).

#### Números

| Técnica | Valor |
|---|---|
| Bolso Cheio | com arma leve, cada +1 no dano vale ~+1,2 por turno: +3 dá ~+3,6 |
| Molhar a Mão | vantagem ≈ +3,3 num d20, por 20 a 50 Sins |
| Isca de Ouro | *Desprevenida* = crítico no próximo acerto de qualquer um e sem reação; a execução vai até 25 de Saúde no nível 5 |
| Preço da Vida | 1 queda evitada por descanso longo, por 80 a 100 Sins |

#### Leitura de exploit
- **Bolso Cheio:** o grupo põe todo o dinheiro no Pecador antes do combate. É exatamente o banco que o Pedro pediu; o risco é esse dinheiro no chão se ele cair.
- **Viciado em Khan + Olho no Lance:** a mesa Khan não tem teto e paga ×3. Com vantagem para roubar, vira uma fonte de Sins. O teto é do mestre: *"cada mesa através de Kharavel pode modificar"* as regras.
- **"Criatura que dê valor a dinheiro"** (Isca de Ouro, Preço da Vida): exclui feras e mortos-vivos sem mente. Cabe ao mestre decidir caso a caso.

### 5.4 Pontos para o Pedro (responda por número)

1. **As 9 regiões.** O CSV conhece 8: Cinturão Silencioso, Terras Livres, Emaranhado de Raízes, Cordilheira Cristalina, Costas Rochosas, Deserto do Abismo, Bosque Corrompido e Ermo das Cinzas. Qual é a 9ª? A ficha vai precisar da lista para contar as regiões do Cartógrafo.
2. **"Região" no Rasgar o Mapa.** Se o Cartógrafo passar a usar "região de Kharavel", a frase *"não te permitem desenhar o mapa dessa região novamente"* pode ser lida como a região inteira. Sugestão: "desse lugar", a unidade do Mapa.
3. ~~Terreno Ideal~~ **Respondido (D147):** virou Região Ideal, com +2 em Atacar, Percepção, Investigação, Furtividade e Movimento.
4. ~~Artista Apaixonado no T2~~ **Respondido (D147):** a Arte absorveu o Artista. Para a vaga, proposta: Escapista (§5.1).
5. **Ataque Furtivo:** +1d6 fixo (recomendo), ou +2d6 a partir do nível 4?
6. **Terror:** sai, ou fica só "com 20 natural"?
7. **Silêncio + Ataque Furtivo:** crítico em todos os acertos do turno contra o alvo marcado. É a intenção?
8. **O Palpite → Viciado em Khan?**
9. **Isca de Ouro:** limiar de execução = metade dos Sins (até 25 de Saúde no nível 5). Se quiser segurar, ¼.
10. **Esquemas sai?** Ou fica no lugar do Suborno Irrecusável?
11. **Homem de Negócios:** completar a frase cortada.

---

## 6. Pontos das técnicas: fechados (D144, 2026-10-01)

Os 6 pontos da rodada 4 foram fechados pelo Pedro e gravados no Notion (§4, em negrito):
1. **Batida Tática → Margem de Segurança.** O nome passou no script de colisão.
2. **Rasteira:** dano Contundente.
3. **Sabotar Terreno:** contra a CD do Batedor (*"tem que escalar com a cd do batedor"*) e 2 Ações.
4. **Por Aqui!:** a criatura usa 1 ação de movimento e anda em linha reta até o Batedor. A falha automática só dura enquanto ela se move até ele.
5. **Rasgar o Mapa:** Pontapé grátis e 2x/turno até o fim do combate; *"Traumas de batalha não te permitem desenhar o mapa dessa região novamente."* (veja o ponto 2 de §5.4).
6. **Fantasma:** Defender entrou na lista (+1 a cada 2 Stamina); saiu a 2ª parte (Furtividade no Defender).

---

## 7. Próximos passos

1. O Pedro responde os ramos (§5.4).
2. Proposta final dos 3 ramos.
3. Notion: os ramos, a frase do Tier 3 e o status. Depois, fetch e `ndiff.py` contra o retrato.
4. Log no `17` §3.
5. Contrato rev. 11, bloco `classes.batedor`. O agente de HTML espera esse bloco para refazer a ficha do Batedor.
   - `V/G/R 3/8/4` e a CD com escolha;
   - o estado "na área de um mapa seu" e o Pontapé 1x/rodada;
   - sai o recurso `instinto`;
   - os contadores dos ramos: as regiões mapeadas (Cartógrafo) e a faixa do Bolso Cheio, tirada do contador de Sins (Pecador).
