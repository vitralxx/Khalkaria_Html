# 18 — Rework do Batedor (proposta, rodada 4)

**Status: NO NOTION EM PARTE (D143, 2026-09-30).** A pedido do Pedro, para mostrar a um jogador, a página já tem:
- o cabeçalho (§1);
- o Mapa e o Pontapé no lugar do Instinto (§2, §3);
- as 15 técnicas com os textos da §4, incluindo as 6 com ponto aberto (§6);
- os nomes novos dos ramos: Pecador e Ladrão.

O resto ficou como estava: o conteúdo dos ramos (marcas e Tier 1–3) e o status "🟢 Pronto". Conferido por fetch e diff contra `batedor-notion-antes-do-rework.txt`. O log está no `17` §3.1.

**Histórico:**
- Rodada 1: commit `a4ea40f`. Mapa de Combate + Instinto refeito.
- Rodada 2: commit `07c3d18`. Com as decisões do Pedro; 3 opções para a 2ª característica.
- Rodada 3: commit `53c7cb0`. Características fechadas; 15 técnicas propostas.
- As lições que o Pedro deu no caminho estão no `19-gabarito-de-classe.md` §12.

**Fechado:** cabeçalho, as 2 características, o item Mapa e 9 das 15 técnicas. **Aberto:** 6 pontos das técnicas (§6). **Depois:** os 3 ramos (§5).

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

> *"Próxima rodada, quando fecharmos as técnicas vamos para os ramos."*

---

## 1. Cabeçalho [Pedro, fechado]

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

## 2. Característica 1 — Mapa [Pedro, fechado]

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

## 3. Característica 2 — Pontapé [Pedro, fechado]

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

## 4. Técnicas gerais (15), rodada 4: textos do Pedro

**9 fechadas.** 6 têm um ponto aberto, listado em §6. Os textos são do Pedro (2026-09-29). Só corrigi a referência a "Terreno Traiçoeiro", que agora se chama Sabotar Terreno, e a gramática de "Defina um quadrado… vira".

| Técnica | Descrição | Custo | Ação | Estado |
|---|---|---|---|---|
| Desbravador | Você possui a habilidade de memorizar caminhos e traçar trajetos eficientes. Você soma naturalmente +1 ao sucesso do grupo em jornadas já percorridas. Adicionalmente, ao rolar *Sobrevivência* em jornadas possui +5. | — | Passiva | fechada |
| Surpresa! | Na área de um mapa seu, na primeira rodada do combate, criaturas que ainda não agiram contam como *Desprevenidas* contra os seus ataques. | — | Passiva | fechada (ex-Dianteira) |
| Varredura | Uma vez por turno, o seu primeiro acerto contra uma criatura na área representada no seu mapa causa +1d6 de dano. Na área de um mapa seu, criaturas escondidas a até 9 m que se moverem deixam de estar escondidas para você. | — | Passiva | fechada |
| Bote | Depois de um Pontapé, o seu próximo ataque tem +1 Margem de Ameaça; se o ataque for corpo a corpo, ele não pode ser retaliado. | — | Passiva | fechada |
| Estudo de Campo | Ao criar um mapa, você pode escolher levar 10 minutos (ao invés de 1 minuto) para estudar o campo. Enquanto na área desse mapa, você tem +2 em Atacar e ignora terreno difícil. | — | Passiva | fechada |
| Armadilha Tática | Rapidamente configura uma armadilha no chão, rolando um teste de *Furtividade* ou *Sobrevivência* e atribuindo o resultado a ela. Quando um inimigo de tamanho Médio ou menor passar por cima ele deve superar a *Furtividade* ou *Sobrevivência* da armadilha rolando *Percepção* ou recebe (Nível + 1)d6 + Mod. Destreza de dano Perfurante e fica *Enraizado* por 1 rodada. Criaturas Grandes ou maiores recebem o dano, mas não ficam *Enraizadas*. Na área de um mapa seu, você pode montá-la em qualquer ponto pelo qual passou com o Pontapé neste turno, e a *Percepção* contra ela tem desvantagem. Você mantém até (Nível) armadilhas montadas; ao montar mais uma, a mais antiga se desfaz. | 3 Stamina | 1 Ação | fechada |
| Sabotar Terreno | Na área de um mapa seu, você afrouxa pedras, derrama água, álcool ou espalha cascalho num ponto que conhece: um quadrado de 4,5 m de lado a até 9 m de você vira Terreno Difícil, Escorregadio, Em Chamas ou Molhado (*Superfícies*) até o fim do combate. Você mantém até (Nível) áreas assim. | 5 Stamina | 1 Ação | **aberta: CD e ação (§6.3)** |
| Por Aqui! | Na área de um mapa seu, escolha uma criatura a até 18 m que possa te ver ou ouvir. Ela faz *Vontade* contra sua CD; se falhar, no próximo turno dela, ela gasta todo o movimento em uma direção escolhida por você, pelo caminho mais curto. A criatura que falha nessa resistência imediatamente falha os testes da Armadilha Tática e do Sabotar Terreno. | 3 Stamina | 1 Ação | **aberta: 3 pontos de regra (§6.4)** |
| Ocultar-se | Ao estar fora da linha de visão de todas as criaturas da cena, pode se esconder com 1 ação em vez de 3. | 2 Stamina | 1 Ação | fechada |
| Rasteira | Durante o Pontapé, ao passar a até 1,5 m de uma criatura de tamanho igual ou menor que o seu, role *Movimento* contra o *Movimento* dela: se vencer, ela recebe (Nível)d4 de dano de Força e fica *Caída*. | 3 Stamina | Ação Livre | **aberta: tipo de dano (§6.2)** |
| Rasgar o Mapa | Rasgue o mapa da área em que você está: até o fim do combate, o seu Pontapé não custa Stamina e, durante esse combate, você pode utilizar as técnicas que exigem que você esteja na área do mapa. O mapa é destruído e sai do inventário. | 1 Mapa | 1 Ação | **aberta: contrapartida (§6.5)** |
| Rolamento | Na área de um mapa seu, ao ser alvo de um ataque, some +1 à sua Evasão contra esse ataque para cada 2 Stamina gastos (máximo = Nível). | 2+ Stamina | Ação Livre | fechada |
| Fantasma | Ao realizar testes de *Crime* ou *Furtividade*, pode gastar 2 de Stamina para adicionar +1 na perícia, com limite máximo no aumento da perícia igual ao seu nível. Adicionalmente, ao ser atacado e optar por se **defender**, pode somar seu treinamento de **Furtividade** na perícia. | 2+ Stamina | Ação Livre | **aberta: custo da 2ª parte (§6.6)** |
| *(nome a trocar)* | Na área de um mapa seu, quando uma criatura hostil terminar um movimento a até 1,5 m de você, você pode se mover até 3 m sem provocar ataques de oportunidade. | 2 Stamina | Reação | **aberta: nome (§6.1)** |
| Emboscada | Pode preparar um local previamente com armadilhas e distrações rolando um teste de *Sobrevivência* ou *Furtividade*: Ao lutar em um ambiente preparado, se o inimigo falhar em um teste de *Percepção* contra seu teste, você e seus aliados recebem +2 em Atacar durante todo o combate e os inimigos ficam *Desprevenidos* na primeira rodada do combate. | 5 Stamina | 10 Minutos | fechada |

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

**Rasteira:** (Nível)d4 de dano, com ~50% na disputa de Movimento:

| Nível | Dano | Esperado |
|---|---|---|
| 1 | 2,5 | 1,2 |
| 5 | 12,5 | 6,2 |

Além do dano, em 50% dos turnos o alvo fica *Caído*: não retalia, defende com −2 e gasta 1 ação para levantar. No nível 5 passa da taxa do *Destruir* (3 Stamina ≈ 5,25 de dano). Tolerável num gatilho de ação livre que exige o Pontapé e tamanho igual ou menor. O tipo de dano muda a conta (§6.2).

**Sabotar Terreno:** Em Chamas pede Fortitude a cada 3 m, ou a criatura fica *Em Chamas* (1d6 de fogo por turno até gastar 1 ação). Com a Por Aqui!, a falha é automática. Combo de 1 Ação + 5 Stamina e 1 Ação + 3 Stamina, é o armadilheiro pago.

### Builds (o Pedro confirmou as 3)

| Build | Para quem |
|---|---|
| À distância | serve aos 3 ramos |
| Corpo a corpo leve | o Ladrão é melhor, porque a Furtividade aumenta o Defender (Fantasma) |
| Armadilheiro / estratégico | é a especialização do Cartógrafo |

---

## 5. Ramos — direção do Pedro (a desenhar depois das técnicas)

Nomes: **Cartógrafo**, **Ladrão** (ex-Sem-Nome) e **Pecador** (ex-Trambiqueiro).

**Regras fixas de todos os ramos** (Pedro, rodada 3):
- **1ª técnica do T1:** dá treinamento em 1 perícia, mais um efeito adicional, muitas vezes o principal do ramo.
- **Marcas:** uma por ramo dá +5 em 1 perícia, 1 ponto por vez, por uma condição específica, mais 1 efeito menor.
- **T2:** explora uma vertente compatível com os outros ramos, *"e isso em todos os ramos entre sí"*.

**Cartógrafo:** sobrevivência e exploração; mais poder pelos mapas, dentro e fora do combate.
- Recebe o *Terreno Ideal* ("reserva isso de um jeito melhor pro cartógrafo").
- Candidata: mapear em combate. É a saída para a luta que começa sem mapa, e fica exclusiva dele. Para os outros ramos, continua valendo a punição.

**Ladrão:** furtividade e ataque furtivo.
- O T1 tem o **Ataque Furtivo**, a peça central do ramo.
- O bônus precisa valer nos 2–3 ataques das armas leves, ser equilibrado, sem matemática complexa, e funcionar à distância. Hoje o *Golpe Sombrio* custa 1 Ação e pune a arma leve.
- Outra técnica essencial: facilitar o esconder-se pela perícia Furtividade.
- Nome: "Ladrão" aparece dentro de *Dedos de Ladrão* (carta do Limiar) e *Dedal do Ladrão* (item). É colisão parcial, sem conflito.

**Pecador:** tudo o que deseja são Sins.
- Técnicas de obter dinheiro e de obter itens pelas regras dos comerciantes.
- **Quantidade de Sins vira limiar de execução.** Cuidado: o *Finalizar* do Brutalista já mata quem está com Saúde ≤ Brutalidade. A do Pecador precisa ser diferente.
- Nada de técnica que infere lore. Nas palavras do Pedro: *"o mestre te mostra os próximos 3 turnos da criatura, você conhece 1 contato criminal próximo"*. O que vale são *"técnicas mecânicas pontuais que se traduzam para o roleplay"*. Vai ser trabalhado individualmente.

---

## 6. Pontos abertos das técnicas (responda por número)

1. **Nome da reação de 3 m.** "Batida Tática" já é técnica geral do Artilheiro (2 Stamina, 1 Ação: se move sem perder Concentração e sem ataque de oportunidade). Sugestões livres: *Recuo* (o nome da rodada 3), *Recuo Tático* ou *Passo Atrás*.
2. **Rasteira, "dano de Força".** Força é um dos tipos atípicos: o Ar (armadura) não reduz, e ele fica fora do Ae(Todos) (D89). Um chute ou uma rasteira seria **Contundente**, que o Ar reduz. Recomendo Contundente; com Força, a Rasteira ignora armadura.
3. **Sabotar Terreno:**
   - **CD.** A tabela de Superfícies usa CD 15 fixa, e a D57 diz que a CD é sempre a do portador. Recomendo "contra sua CD" (10 + DES + SAB ou INT: ~15 no nível 1, ~20 no nível 5), senão a superfície fica fraca no nível 5.
   - **Ação.** Assumi 1 Ação, como era a Terreno Traiçoeiro. Confirma?
4. **Por Aqui!:**
   - **(a) Qual movimento é gasto.** Proponho: ela usa a ação de Mover.
   - **(b) Ataque de oportunidade.** É ela quem se move, então provoca, como qualquer movimento. Confirma?
   - **(c) "Direção" com "caminho mais curto".** Na mesa, as duas coisas brigam. Proponho "até um ponto escolhido por você, pelo caminho mais curto".
   - **(d) "Falha os testes da Armadilha e do Sabotar Terreno".** Até quando? Proponho "durante esse movimento".
5. **Rasgar o Mapa, contrapartida.** Hoje, depois do combate, basta desenhar outro. Duas opções; recomendo a A:
   - **A. A perda dura além da luta.** "Até o próximo descanso longo, você não consegue desenhar outro mapa dessa área."
     - Ficção: *"Você decora as rotas e rasga o mapa: o lugar fica na sua cabeça até o fim da luta, depois as lembranças se embaralham."*
     - Custo: o resto daquela área fica sem mapa até descansar.
   - **B. Limite de uso.** "1x/descanso longo". Mais simples, mas a ficção continua sem explicar por quê.
6. **Fantasma:**
   - A 2ª parte (somar Furtividade no Defender) ainda custa 2 Stamina, como hoje, ou fica passiva?
   - As duas partes são Ação Livre 1x/turno (D99)?

---

## 7. Depois de fechar os 6 pontos

1. Os 3 ramos, um por vez, começando pelo que o Pedro escolher (o Pecador ele quer trabalhar individualmente).
2. Proposta final da classe inteira.
3. Notion, com fetch.
4. `ndiff.py` contra o retrato de antes.
5. Log do novo Batedor no `17` §3.
6. Contrato rev. 11, bloco `classes.batedor`:
   - `V/G/R 3/8/4`;
   - CD com escolha;
   - estado "na área de um mapa seu";
   - Pontapé com 1x/rodada;
   - sai o recurso `instinto`.
