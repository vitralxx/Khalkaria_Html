# 18 — Rework do Batedor (proposta, rodada 3)

**Status: PROPOSTA.** Nada disto está no Notion. A classe vai ao Notion inteira, depois do aceite das 15 técnicas e dos 3 ramos. Gravar pela metade deixaria a página citando o Instinto. Depois do Notion sai o log do novo Batedor para o agente de HTML (diff contra `batedor-notion-antes-do-rework.txt`).

**Histórico:**
- Rodada 1: commit `a4ea40f`. Mapa de Combate + Instinto refeito.
- Rodada 2: commit `07c3d18`. Com as decisões do Pedro; 3 opções para a 2ª característica.
- As lições que o Pedro deu no caminho estão no `19-gabarito-de-classe.md` §12.

**Fechado:** cabeçalho, as 2 características e o item Mapa. **Em proposta:** as 15 técnicas gerais (§4). **Depois:** os 3 ramos (§5).

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

## 4. Técnicas gerais (15), rodada 3

Critérios, tirados do retorno do Pedro à rodada 2 (`19` §12):
- **Classe individual:** nada de técnica de suporte.
- **Nada que duplique a característica:** o Atento deixava o Mapa obsoleto.
- **Nada estreito:** cada vaga tem de valer na maioria das sessões.
- **Nada que premie ficar parado,** que é o contrário do Pontapé.
- **Dano que escala com o nível.**
- **Regra de tamanho** em efeito que prende ou derruba.
- **O efeito tem de fazer sentido na ficção.**
- **Quase tudo passa pela área do mapa ou pelo Pontapé.** Sem mapa, o Batedor é fraco, e é de propósito: é a punição que o Pedro pediu.

| Técnica | Descrição | Custo | Ação |
|---|---|---|---|
| Desbravador | Você possui a habilidade de memorizar caminhos e traçar trajetos eficientes. Você soma naturalmente +1 ao sucesso do grupo em jornadas já percorridas. Adicionalmente, ao rolar *Sobrevivência* em jornadas possui +5. | — | Passiva |
| Dianteira | Na área de um mapa seu, na primeira rodada do combate, criaturas que ainda não agiram contam como *Desprevenidas* contra os seus ataques. | — | Passiva |
| Varredura | Na área de um mapa seu, criaturas escondidas a até 9 m que se moverem deixam de estar escondidas para você. Uma vez por turno, o seu primeiro acerto contra uma criatura que se moveu desde o fim do seu último turno causa +1d6 de dano. | — | Passiva |
| Bote | Depois de um Pontapé, o seu primeiro ataque corpo a corpo no turno não pode ser retaliado. | — | Passiva |
| Estudo de Campo | Se você levar 10 minutos para desenhar um mapa, em vez de 1, na área dele o seu Pontapé custa 2 Stamina. | — | Passiva |
| Armadilha Tática | Rapidamente configura uma armadilha no chão, rolando um teste de *Furtividade* ou *Sobrevivência* e atribuindo o resultado a ela. Quando um inimigo de tamanho Médio ou menor passar por cima ele deve superar a *Furtividade* ou *Sobrevivência* da armadilha rolando *Percepção* ou recebe (Nível + 1)d6 + Mod. Destreza de dano Perfurante e fica *Enraizado* por 1 rodada. Criaturas Grandes ou maiores recebem o dano, mas não ficam *Enraizadas*. Na área de um mapa seu, você pode montá-la em qualquer ponto pelo qual passou com o Pontapé neste turno, e a *Percepção* contra ela tem desvantagem. Você mantém até (Nível) armadilhas montadas; ao montar mais uma, a mais antiga se desfaz. | 3 Stamina | 1 Ação |
| Terreno Traiçoeiro | Na área de um mapa seu, você afrouxa pedras, derrama água ou espalha cascalho num ponto que conhece: um quadrado de 3 m a até 9 m de você vira Terreno Difícil ou Escorregadio (*Superfícies*) até o fim do combate. Você mantém até (Nível) áreas assim. | 3 Stamina | 1 Ação |
| Por Aqui! | Na área de um mapa seu, escolha uma criatura a até 18 m que possa te ver ou ouvir. Ela faz *Vontade* contra sua CD; se falhar, no próximo turno dela, todo movimento que fizer tem de ser na sua direção, pelo caminho mais curto. | 2 Stamina | 1 Ação |
| Ocultar-se | Ao estar fora da linha de visão de todas as criaturas da cena, pode se esconder com 1 ação em vez de 3. | 2 Stamina | 1 Ação |
| Rasteira | Durante o Pontapé, ao passar a até 1,5 m de uma criatura de tamanho igual ou menor que o seu, role *Movimento* contra o *Movimento* dela: se vencer, ela fica *Caída*. | 3 Stamina | Ação Livre |
| Rasgar o Mapa | Rasgue o mapa da área em que você está: até o fim do combate, o seu Pontapé não custa Stamina. O mapa é destruído e sai do inventário. | 1 Mapa | Ação Livre |
| Rolamento | Na área de um mapa seu, ao ser alvo de um ataque, some +1 à sua Evasão contra esse ataque para cada 2 Stamina gastos (máximo = Nível). | 2+ Stamina | Ação Livre |
| Fantasma | Ao ser atacado e optar por se **defender**, pode somar seu treinamento de **Furtividade** na perícia. | 2 Stamina | Ação Livre |
| Recuo | Na área de um mapa seu, quando uma criatura hostil terminar um movimento a até 1,5 m de você, você pode se mover até 3 m sem provocar ataques de oportunidade. | 2 Stamina | Reação |
| Emboscada | Pode preparar um local previamente com armadilhas e distrações rolando um teste de *Sobrevivência* ou *Furtividade*: Ao lutar em um ambiente preparado, se o inimigo falhar em um teste de *Percepção* contra seu teste, você e seus aliados recebem +2 em Atacar durante todo o combate e os inimigos ficam *Desprevenidos* na primeira rodada do combate. | 5 Stamina | 10 Minutos |

### O que aconteceu com cada técnica da rodada 2

| Rodada 2 | Retorno do Pedro | Rodada 3 |
|---|---|---|
| Atento | "deixa o mapa obsoleto" | **sai**. No lugar, **Dianteira**: o mapa dá vantagem em Iniciativa, e a Dianteira transforma agir primeiro em vantagem de ataque |
| Passo Ciente | "específico… poderia ser descartada" | **sai** |
| Leitor de Rastros | "não é necessária" | **sai** |
| Líder | → "Desbravador" | **Desbravador**, texto verbatim |
| Terreno Ideal | "reserva… pro cartógrafo" | **sai** das gerais; vai para o Cartógrafo (§5) |
| Armadilha Tática | tamanho, escalar com nível, conexão | **fica, refeita:** Médio ou menor fica *Enraizado*; dano (Nível + 1)d6 + DES (2d6 no nível 1, como hoje; 6d6 no nível 5); monta no caminho do Pontapé |
| Reposicionar | "suporte… descarta" | **sai** |
| Mirante | "incentiva o playstyle contrário do pontapé" | **sai** |
| Varredura | "revelar, mas não como peça central" | **fica, refeita:** a peça central é +1d6 no 1º acerto contra quem se moveu; revelar quem se move é o efeito secundário |
| Ocultar-se | "perfeito" | fica |
| Rasgar o Mapa | "não faz sentido no roleplay. Porém pode deixar" | fica. Proposta de ficção na decisão 3 |
| Rolamento | "gostei" | fica |
| Fantasma | "pode manter" | fica |
| Por Aqui! | "ruim… mas gostei do nome" | **o nome fica, a regra é nova:** atrair um inimigo para o caminho das suas armadilhas |
| Emboscada | "pode deixar" | fica |

**Novas:** Dianteira, Bote, Estudo de Campo, Terreno Traiçoeiro, Rasteira, Recuo, e a regra nova da Por Aqui!.

### Números e âncoras das novas

| Técnica | Entrega | Âncora no sistema |
|---|---|---|
| Dianteira | 1ª rodada: sem reação do alvo, e o 1º acerto em cada um é crítico. Só contra quem ainda não agiu | *Emboscada*: todos os inimigos *Desprevenidos* na 1ª rodada, para o grupo, com 10 min de preparo. A Dianteira é só para você e só contra quem ainda não agiu |
| Varredura | +1d6 uma vez por turno, ≈ +2,1 de dano por turno | *Mãos Velozes* (T1 do Artilheiro): +2 de dano por ataque com arma de fogo |
| Bote | 1 ataque sem retaliação por turno, preso ao Pontapé | *Alcançar* (efeito de arma): 2 Stamina por 1 ataque sem retaliação. Aqui quem paga é o Pontapé |
| Estudo de Campo | Pontapé de 3 → 2 Stamina, na área de um mapa feito com calma | Régua R6: preparar-se aparece no número |
| Armadilha | 10 de dano no nível 1 e 26 no nível 5, se pisarem e falharem na Percepção (~50%) | *Atropelar* (Brutalista): (Nível)d6 + FOR e *Caído*, por 2 Ações + 3 Stamina |
| Terreno Traiçoeiro | Usa as *Superfícies* do Sistema: Difícil custa o dobro de Movimento; Escorregadia pede Reflexo CD 15 a cada 3 m ou *Caído* | Nenhuma técnica cria superfície hoje. É o "Combate Estratégico" do Play Style |
| Por Aqui! | Vontade contra CD; se falhar, o próximo movimento dele é na sua direção | *Provocar* (Brutalista): Vontade, ou te ataca no próximo turno, por 1 Ação + 2 Stamina |
| Rasteira | *Caído* por disputa de Movimento: não retalia, defende com −2, anda 1,5 m, gasta 1 ação para levantar | A manobra *Empurrar* também derruba. A Rasteira é mais barata em ação e paga em Stamina e tamanho |
| Recuo | Sai 3 m sem ataque de oportunidade. Para te alcançar de novo, o inimigo gasta 1 ação em Acelerar | *Passo Afiado* (Espadachim): 1,5 m quando te erram, por 2 Stamina |

**Rocket tag:**
- O único *Exposto* novo é o da Dianteira: 1ª rodada, 1º acerto em cada criatura que ainda não agiu. É o "pico" que o Pedro quer para quem chega com o mapa pronto.
- Não amplia margem de ameaça e não dá ataque a mais.

**Mix:**

| Tipo | Batedor | Média das 6 classes |
|---|---|---|
| Passivas | 5 | 6,3 |
| 1 Ação | 4 | 4,3 |
| Ação Livre | 4 | 1,5 |
| Reação | 1 | 1,3 |
| Fora de combate | 1 | 0,8 |

As 4 de ação livre disparam em momentos certos: durante o Pontapé (Rasteira), ao ser atacado (Rolamento, Fantasma) ou 1 vez por combate (Rasgar o Mapa).

**Ligação com o mapa ou o Pontapé:** 11 das 15. Não dependem dele Desbravador, Ocultar-se, Fantasma e Emboscada; a Armadilha funciona sem mapa, mas rende mais com ele.

**Builds:**

| Build | Técnicas |
|---|---|
| À distância | Pontapé, Varredura, Dianteira, Recuo, Armadilha, Terreno Traiçoeiro |
| Corpo a corpo leve (multi-ataque frágil) | Pontapé, Bote, Rasteira, Rolamento, Dianteira |
| Armadilheiro / estratégico | Armadilha, Terreno Traiçoeiro, Por Aqui!, Emboscada |

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

## 6. Decisões para o Pedro (responda por número)

1. **As 15 técnicas.** Aprova, corta ou troca? Em especial as novas:
   - Dianteira: *Desprevenido* na 1ª rodada contra quem ainda não agiu;
   - Varredura refeita;
   - Bote;
   - Estudo de Campo;
   - Terreno Traiçoeiro;
   - Rasteira;
   - Recuo;
   - a regra nova da Por Aqui!.
2. **Armadilha Tática:** dano (Nível + 1)d6 + DES, e Médio ou menor fica preso? É 2d6 no nível 1, como hoje, e 6d6 no nível 5.
3. **Rasgar o Mapa, ficção:** proponho a frase "Você decora as rotas e larga o mapa na luta: agora o caminho está na sua cabeça". Ou trocar o nome para *Decorar o Mapa*.
4. **Mapear em combate** como técnica exclusiva do Cartógrafo (junto com o Terreno Ideal)?

---

## 7. Depois do aceite das técnicas

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
