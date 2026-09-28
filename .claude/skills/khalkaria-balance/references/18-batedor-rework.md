# 18 — Rework do Batedor (proposta para aprovação)

**Status: PROPOSTA.** Nada disto está no Notion. Vai ao Notion só depois do aceite do Pedro. Em seguida, sai
o log do novo Batedor para o agente de HTML, com diff contra `batedor-notion-antes-do-rework.txt` (§10).

Pedido do Pedro (2026-09-28, verbatim): *"Rework do Batedor, vamos corrigi-lo, criando duas novas
características de classe que irão substituir as atuais, vamos criar as 15 técnicas gerais e os 3 ramos
refinados com técnicas modernas, tudo isso pavimentando a estrutura de criação de classes futuras."*

A estrutura de criação de classes está em **`19-gabarito-de-classe.md`**. Este arquivo é o Batedor feito por ela.
Diagnóstico de partida: `13-batedor-diagnostico.md`. Texto de hoje: `batedor-notion-antes-do-rework.txt`.

**Origem de cada texto:**
- **[Pedro]**: texto do Notion sem mudança de regra. Pode ter correção de digitação, listada.
- **[Pedro, ajustado]**: texto do Notion com mudança de regra. A mudança vem descrita logo abaixo.
- **[nova]**: criação minha. Precisa de aceite.

---

## 1. O Batedor numa tela

**Papel: o tático de campo.** O Batedor escolhe onde a luta acontece:
- lê o terreno antes de todos;
- impede que o grupo seja pego de surpresa;
- move os aliados pelo campo;
- expõe o inimigo que pisa em falso.

Ele continua atirando, mas não disputa dano com o Artilheiro.

| | Hoje | Proposta |
|---|---|---|
| Características de classe | Instinto, que zera em 97,9% dos turnos de quem ataca | **Mapa de Combate** + **Instinto** refeito |
| Coeficientes | 4/7/4, iguais aos do Artilheiro | **5/6/4**, que nenhuma classe usa |
| Técnicas gerais usáveis em combate | 5 de 15 | 13 de 15 |
| Técnicas gerais ligadas à característica | 0 | 9, mais 2 indiretas |
| P(Instinto chega a 5 até a 3ª rodada) | 0,0009% | 52–90% com o campo mapeado |
| Ramos | Cartógrafo e Trambiqueiro fora de combate; Sem-Nome repete o Predador | Cartógrafo manda no campo; Sem-Nome luta a curta distância; Trambiqueiro fica social, com 1 ultimate |

**A ideia central.** O melhor conteúdo de combate do Batedor já existia, mas preso no Tier 2 do Cartógrafo e atrás de 5 minutos de preparo:
- *Desenhar Mapa de Combate*: "Você e seus aliados não podem ser Desprevenidos";
- *Coordenação*;
- *Ponto Cego*;
- *Reposicionar*;
- *Mapa Mental*.

O rework promove esse núcleo a característica de classe, de nível 1. O Instinto passa a encher com o mapa.

---

## 2. Cabeçalho da página

**Status iniciais** [Pedro, ajustado: coeficientes 4/7/4 → 5/6/4]
- Saúde: `10 + (5 × Nível) + (Mod.CON × Nível)`
- Stamina: `8 + (6 × Nível) + (Mod.FOR OU Mod.DES × Nível)`
- Éter: `6 + (4 × Nível) + (Mod.INT OU Mod.SAB × Nível)`
- Evasão Ativa (Reação): 10 + Mod. Destreza + Dado de Defender
- Evasão Passiva (Sem reação): 10 + Mod. Destreza

Por que 5/6/4:
- **+1 Vitalidade:** o batedor vai na frente e é o primeiro a levar a emboscada.
- **−1 Vigor:** o Instinto passa a carregar parte da economia que era da Stamina.

No nível 5, com CON +1 e DES +3, isso dá 40 de Saúde e 53 de Stamina (hoje: 35 e 58).

**Treinamento** [Pedro, ajustado: +2 opções na lista, em negrito]

Você começa treinado em Armas à Distância, Sobrevivência e Percepção. Além disso, você pode escolher (1 + Mod. Inteligência) perícias para ser treinado dentre as seguintes:
- Crime
- Religião
- Iniciativa
- Medicina
- Furtividade
- **Movimento**
- **Investigação**

Movimento e Investigação servem o novo papel: ler rastros e cenas, andar pelo campo. As outras cinco ficam.

**Atributos Recomendados, Play Style e CD** [Pedro, sem mudança]
- Atributos: Destreza, Sabedoria e Inteligência.
- Play Style: Exploração, Controle de Terreno e Furtividade. O rework cumpre exatamente esse texto.
- CD: 10 + Mod. Destreza + Mod. Sabedoria.

**Progressão** [Pedro, sem mudança]: 4/5/6/7/8 Técnicas; Ramo T1 no 2, T2 no 4, T3 no 5; Marcas no 3, 4 e 5.

---

## 3. Características de classe

### Mapa de Combate [nova]

Junta duas técnicas do Cartógrafo, ambas do Pedro: *Desenhar Mapa de Combate* e *Mapa Mental*.

> O Batedor analisa altitude, tipos de terreno e hostilidades do local e monta um mapa tático na cabeça.
> Ele sabe de onde o perigo vai surgir antes de o perigo se mostrar.

O campo de um combate fica **mapeado** em dois casos:
- desde o início do combate, se você observou o local por ao menos 1 minuto antes da luta, ou se tem o *Mapa de Exploração* da região;
- em combate, gastando 1 Ação e 2 Stamina.

Com o campo mapeado, enquanto você estiver consciente:
- Você e seus aliados que possam te ouvir não podem ficar *Desprevenidos*.
- No início de cada turno seu, você ganha +1 **Instinto**.

O campo continua mapeado até o fim do combate. Se a luta se mudar para um local que você não mapeou, ele deixa de estar mapeado.

*Notas, que não vão ao Notion:*
- A frase de abertura reaproveita as palavras do *Desenhar Mapa de Combate* ("analisando altitude, tipos de terreno e hostilidades"). O "1 Ação e 2 Stamina" é o custo do *Mapa Mental*.
- **Sai o teste de Percepção CD 15 a cada rodada** do Mapa Mental. Perder o mapa no dado é o mesmo defeito que quebrou o Instinto (régua R2).
- **Carga de anotação:** um estado sim/não por combate, o menor custo de mesa possível.
- "Não podem ficar Desprevenidos": um aliado que já estava Desprevenido deixa de estar quando o campo é mapeado. Mapear no meio de uma emboscada acorda o grupo.
- **O custo de poder.** Hoje, proteger o grupo de ficar Desprevenido custa Tier 2 + 5 minutos + 3 Stamina. Passa a ser nível 1, com 1 minuto de observação ou 1 Ação + 2 Stamina em combate. É o maior ganho de poder da proposta, e é de propósito: é a razão de a classe existir.
- **O contrapeso:** o mapa não protege do que acontece antes dele. Uma emboscada num lugar que ninguém observou pega o grupo, salvo se o Batedor tiver *Vigia* ou *Atento*.

### Instinto [Pedro, ajustado]

O parágrafo de abertura é do Pedro, verbatim:

> **Instinto** é a manifestação mecânica da sua atenção aguçada e experiência como explorador. Quanto mais você
> observa, investiga e interage com o ambiente, mais afiado fica seu sexto sentido — até o momento onde você age
> antes mesmo do perigo se manifestar.

- Você começa cenas de exploração ou cenas de combate com 0 de **Instinto**, *contudo*, se estiver em uma cena de exploração e começar um combate pode sustentar seu **Instinto**. [Pedro]
- Você <u>ganha</u> **Instinto** das seguintes maneiras, cada uma no máximo 1 vez por rodada:
  - Mapa: no início do seu turno, com o campo mapeado → +1 Instinto
  - Acerto: ao acertar qualquer inimigo → +1 Instinto
  - Esquiva: ao esquivar de qualquer ataque → +1 Instinto
  - Perícia: ao suceder em qualquer perícia, exceto Atacar e Defender → +1 Instinto. Fora de combate, no máximo 1 vez por perícia a cada cena.
- Você <u>perde</u> **Instinto** das seguintes maneiras:
  - Surpresa: ao ficar *Desprevenido* → = 0 Instinto
  - Dano: ao receber, de uma só fonte, dano maior que metade da sua Saúde máxima → perde metade do seu Instinto, arredondando para cima
  - Tempo: ao ficar 10 minutos sem ganhar Instinto → = 0 Instinto
- Você pode gastar seu Instinto para ganhar os seguintes benefícios. O Instinto gasto sai do total:

| Hab. de Instinto | Custo | Descrição | Ação |
|---|---|---|---|
| Pressentimento | X | Adicione +X a qualquer perícia ao menos treinada, depois de rolar o dado. | Ação Livre |
| Olhos nas Costas | 2 | Ao ser alvo de um ataque, adicione +2 à sua Evasão até o fim do turno do atacante. | Ação Livre |
| Segundo Fôlego | 3 | Você ou um aliado que possa te ouvir rola novamente a Iniciativa e usa o novo resultado (se preferir). | Ação Livre |
| Passo em Falso | 4 | Com o campo mapeado, uma criatura que você vê e que se moveu desde o fim do seu último turno fica *Exposta*. | 1 Ação |
| Instinto Reativo | 5 | Você pode usar sua Reação mesmo que já a tenha gastado nesta rodada. | Ação Livre |

- **Máximo: 5 Instinto**

**O que muda em relação a hoje, e por quê**

Ganhos:
- **Perícia:** o limite cai de "Máx. 2x por rodada" para 1 vez por rodada (régua R5). Atacar e Defender deixam de contar, porque já contam como Acerto e Esquiva; sem isso, um acerto daria 2.
- **Nova fonte, Mapa (+1 por turno).** É o motor da classe. Sem mapa, a chance de chegar a 5 até a 3ª rodada cai de 52–90% para 6–11% (§7.1).

Perdas:
- **Saem** "falhar qualquer perícia", *Atordoado* e *Desorientado*:
  - Atacar é perícia, então "falhar qualquer perícia" zerava o Instinto em 97,9% dos turnos de quem ataca.
  - *Desorientado* é piso Ordinário (D33): qualquer arma contundente aplica por 2 Stamina.
  - *Desprevenido* fica, porque ser surpreendido é falha tática, não falha de dado (régua R2).
- **Dano maior que metade da Saúde:** deixa de zerar e passa a tirar metade.

Gastos:
- **"utilizar" → "gastar":** o custo é gasto, não requisito. Hoje o texto não diz, e o Fluxo do Monge
  usa o outro modelo (`19` §5).
- **Pressentimento:** ganha "depois de rolar o dado". Hoje o texto não diz quando se declara.
- **Sexto Sentido → Olhos nas Costas:**
  - o nome *Sexto Sentido* já é de uma carta do Limiar (SAB 16+, "1x/combate (reação)…");
  - "durante esse turno" não dizia de quem era o turno. Agora é o turno do atacante.
- **Segundo Fôlego:** ganha "ou um aliado". Hoje só re-rola a Iniciativa do próprio Batedor.
- **Golpe Instinto sai.**
  - O texto usa o termo antigo, "margem de crítico".
  - Rende pouco: +15% de chance de crítico num ataque dá ~1,6 de dano, por 1 Ação + 4 Instinto.
- **Passo em Falso entra no lugar.** É o *Ponto Cego* do antigo Desenhar Mapa de Combate, que custava 1 Ação e 4 Stamina, agora pago em Instinto.
  - O nome *Ponto Cego* já é de um truque de Conhecimento (D68).
  - Em Stamina, o Ponto Cego dava para repetir ~10 vezes por combate. Em Instinto, sai ~1 vez a cada combate de 4 rodadas (§7.1).

---

## 4. Técnicas gerais (15)

Frase de abertura da seção, verbatim [Pedro]: "Toda classe possui técnicas, você pode reatribuí-las livremente ao realizar um descanso longo, respeitando o limite de pontos. Você possui 3 Técnicas + Nível"

| Técnica | Descrição | Custo | Ação |
|---|---|---|---|
| Atento | Você é imune à condição *Desprevenido*. | — | Passiva |
| Passo Ciente | Você não ativa armadilhas de qualquer tipo e ignora terreno difícil. Com o campo mapeado, aliados que possam te ouvir também ignoram terreno difícil. | — | Passiva |
| Leitor de Rastros | Você consegue distinguir peso, número da pegada, velocidade e direção de criaturas vendo rastros passivamente. | — | Passiva |
| Líder | Você possui a habilidade de memorizar caminhos e traçar trajetos eficientes. Você soma naturalmente +1 ao sucesso do grupo em jornadas já percorridas. Adicionalmente, ao rolar *Sobrevivência* em jornadas possui +5. | — | Passiva |
| Vigia | Ao Vigiar numa Jornada ou ficar de guarda num descanso, você soma +2 no teste de *Percepção*. Se um combate começar enquanto você vigia, o campo já começa mapeado. | — | Passiva |
| Sinais | Você pode usar *Pressentimento* num teste de um aliado que possa te ver, em vez de num teste seu, desde que você seja ao menos treinado na perícia. | — | Passiva |
| Terreno Ideal | Você tem facilidade em se adaptar a um ambiente, e enquanto estiver nele recebe os seguintes benefícios:<br>+2 em testes de Sobrevivência<br>+2 em testes de Percepção<br>Pode gastar uma ação para rolar estes testes com vantagem.<br>Em seu terreno ideal, mapear o campo em combate custa uma ação livre em vez de 1 Ação.<br><br>Terrenos: (Urbano, Natural, Naval, Subterrâneo)<br>Pode escolher 1 no nível 1, 2 no nível 3 e 3 no nível 5. | 3 Stamina | Passiva ou 1 Ação |
| Armadilha Tática | Rapidamente configura uma armadilha no chão, rolando um teste de *Furtividade* ou *Sobrevivência* e atribuindo o resultado a ela. Quando um inimigo passar por cima ele deve superar a *Furtividade* ou *Sobrevivência* da armadilha rolando *Percepção* ou recebe 2d6+Mod. Destreza de dano Perfurante e fica *Enraizado* por 1 rodada. Com o campo mapeado, a *Percepção* contra a armadilha tem desvantagem. Você mantém até (Nível) armadilhas montadas; ao montar mais uma, a mais antiga se desfaz. | 3 Stamina | 1 Ação |
| Reposicionar | Com o campo mapeado, escolha um aliado, podendo ser você, em até 9 m. Ele pode se mover até 4,5 m como uma ação livre sem provocar ataques de oportunidade. | 3 Stamina | 1 Ação |
| Ocultar-se | Ao estar fora da linha de visão de todas as criaturas da cena, pode se esconder com 1 ação em vez de 3. | 2 Stamina | 1 Ação |
| Varredura | Com o campo mapeado, role *Percepção* contra a *Furtividade* de cada criatura escondida em até 18 m. As que você superar deixam de estar escondidas para você e para os aliados que possam te ouvir. | 2 Stamina | 1 Ação |
| Tocaia | Seu próximo ataque causa +1d8 de dano se o alvo estiver *Desprevenido* ou *Exposto*. | 2 Stamina | Ação Livre |
| Fantasma | Ao ser atacado e optar por se **defender**, pode somar seu treinamento de **Furtividade** na perícia. | 2 Stamina | Ação Livre |
| Por Aqui! | Com o campo mapeado, quando um aliado que possa te ouvir se afastar de uma criatura, ele não provoca ataque de oportunidade dela. | 2 Stamina | Reação |
| Emboscada | Pode preparar um local previamente com armadilhas e distrações rolando um teste de *Sobrevivência* ou *Furtividade*: Ao lutar em um ambiente preparado, se o inimigo falhar em um teste de *Percepção* contra seu teste, você e seus aliados recebem +2 em Atacar durante todo o combate e os inimigos ficam *Desprevenidos* na primeira rodada do combate. Um combate no local preparado começa com o campo mapeado. | 5 Stamina | 10 Minutos |

### Origem e mudança de cada técnica

**Do Pedro, sem mudança de regra:**
- **Atento.**
- **Líder.**
- **Fantasma.**
- **Leitor de Rastros.** É a *Caçador*, com o mesmo texto e outro nome: *Caçador* já é nome de origem.

**Do Pedro, com ajuste:**
- **Passo Ciente:** + "com o campo mapeado, aliados… também ignoram terreno difícil".
- **Terreno Ideal:** + mapear como ação livre no terreno ideal.
- **Armadilha Tática:**
  - desvantagem na Percepção com o campo mapeado;
  - teto de (Nível) armadilhas montadas, porque hoje não há limite;
  - "1 Ações" → "1 Ação".
- **Emboscada:** + a frase final "Um combate no local preparado começa com o campo mapeado." O resto é o texto do Pedro, verbatim.
- **Ocultar-se:** "em vez de 2" → "em vez de 3". O Sistema diz que esconder-se custa 3 ações; a carta *Sombras* do Limiar já usa essa conta.
- **Tocaia.** É a *Oportunista*:
  - o nome já é de técnica do Espadachim;
  - 1 Ação vira Ação Livre, senão rende o mesmo que um ataque a mais;
  - o gatilho ganha "ou *Exposto*", que liga a técnica ao Passo em Falso.
- **Reposicionar.** É a sub-habilidade do antigo Desenhar Mapa de Combate, com o texto do Pedro e o mesmo requisito, "com o campo mapeado".

**Novas, minhas:** Vigia, Sinais, Varredura, Por Aqui!.

**Digitação:**
- "de quaisquer tipo" → "de qualquer tipo";
- "numero" → "número";
- "imune a condição D*esprevenido*" → "imune à condição *Desprevenido*";
- "ao em vez de" → "em vez de";
- custo "n/a" → "—", como nas outras classes.

Conferido por script, contra o retrato de hoje: fora o que está listado acima, o texto não muda.

**Mix das 15, contra a média das outras 6 classes (§7.2):**

| Tipo | Batedor | Média das 6 |
|---|---|---|
| Passivas | 6 | 6,3 |
| Passiva ou 1 Ação | 1 | — |
| 1 Ação | 4 | 4,3 |
| Ação Livre | 2 | 1,5 |
| Reação | 1 | 1,3 |
| Fora de combate | 1 | 0,8 |
| 2+ ações | 0 | 0,7 |

**Ligação com as características:**
- **9 citam o mapa ou o Instinto:** Passo Ciente, Vigia, Sinais, Terreno Ideal, Armadilha Tática, Reposicionar, Varredura, Por Aqui!, Emboscada.
- **2 indiretas:**
  - Atento protege o Instinto, porque impede a perda por *Desprevenido*.
  - Tocaia cobra o *Exposto* que o Passo em Falso cria.

**Fora de combate:** Leitor de Rastros e Líder. Vigia, Terreno Ideal e Emboscada fazem ponte: são exploração que vira vantagem no combate.

---

## 5. Ramos

O texto de abertura dos Ramos e as três descrições ficam como estão [Pedro]:
- os parágrafos "Os ramos são caminhos…";
- as cores;
- as descrições do Cartógrafo, do Trambiqueiro e do Sem-Nome.

### 5.1 Marcas de Ramo

**Cartógrafo**

*Colecionador de Horizontes* [Pedro, ajustado: teto]
- No 1º bullet, depois de "Recupera 2 de Stamina e ganha 1 de Stamina máxima.", entra: "Ao chegar em +5 de Stamina máxima por esta marca, essa parte fica supérflua."
- Motivo: hoje não há teto.
- Régua: +10 de um recurso máximo permanente é o preço de 1 carta universal do Limiar.
- O "+5… fica supérflua" segue o padrão das marcas de progressão.

*Cicatrizes da Jornada* [Pedro, sem mudança]. Já está no padrão de marca de progressão.

**Sem-Nome**
- *Coleção de Últimos Suspiros* [Pedro, sem mudança].
- *Sussurro Final* [Pedro, sem mudança].

**Trambiqueiro**
- *Homem de Negócios* [Pedro]. A frase de personalidade está cortada no Notion: "Você possui um disturbio de mat". **Falta o Pedro completar.** Os dois bullets ficam.
- *O Palpite* [Pedro, sem mudança].

### 5.2 Tier 1

Padrão das outras classes: a 1ª técnica do T1 é passiva e dá treinamento — "Você se torna Treinado em X. Se já for Treinado, se torna Experiente e assim por diante." Cada ramo do Batedor ganha a sua, fundida numa passiva que já existia.

**Cartógrafo**

- **Artista Apaixonado (Passiva)** [Pedro, ajustado: + treinamento]
  - Você se torna Treinado em *Sobrevivência*. Se já for Treinado, se torna Experiente e assim por diante.
  - Os mapas que você fabrica contam como mercadoria Incomum.
- **Desenhar Mapa de Exploração (Descanso Curto, 5 Stamina)** [Pedro, ajustado: o bullet vazio do Notion vira o 3º benefício]
  - Texto do Pedro sem mudança até os benefícios: "Tem conhecimento geral da geografia da área." e "+5 em Sobrevivência enquanto na região do mapa."
  - Entra o 3º: "Um combate na região do mapa começa com o campo mapeado."
- **Escapista (3 Ações, 5 Stamina)** [Pedro, ajustado]
  - "Ao possuir um mapa da região em que está batalhando" → "Ao possuir um mapa da região em que está batalhando, ou com o campo mapeado,". O resto fica.

**Sem-Nome** (curta distância: ver decisão 8 em §9)

- **Olhar de Brecha (Passiva)** [Pedro, ajustado: + treinamento]
  - Você se torna Treinado em *Furtividade*. Se já for Treinado, se torna Experiente e assim por diante.
  - Você detecta instantes onde inimigos abaixam guarda ou se distraem. Você recebe vantagem no primeiro teste de *Furtividade* do combate. Adicionalmente, se já estiver escondido no primeiro turno de combate, recebe +2 em *Iniciativa*.
- **Golpe Sombrio (Ação Livre, 2 Stamina)** [Pedro, ajustado: 1 Ação → Ação Livre; "corpo a corpo"]
  - Enquanto estiver *Escondido*, seu próximo ataque corpo a corpo: Ignora 1 de *Evasão*; +1d6 de Dano; Não pode ser retaliado.
  - *Por quê:* como 1 Ação, a técnica come um ataque de quem usa arma leve, e o bônus não cobre o que se perde.
- **Finta (1 Ação, 2 Stamina)** [Pedro, ajustado]
  - Escolha um alvo em até 1,5 m: Enganação vs Percepção. Sucesso: alvo fica *Desorientado* por 1 rodada e não pode retaliar seus ataques até o fim do seu turno.
  - *Por quê:* o risco do Sem-Nome corpo a corpo é a retaliação. Hoje a Finta dá só *Desorientado*, que qualquer arma contundente aplica por 2 Stamina. O ganho vira "atacar sem resposta pelo resto do turno", como o *Alcançar*.

**Trambiqueiro**

- **Língua Prateada (Passiva)** [Pedro, ajustado: vem das técnicas gerais]
  - Você se torna Treinado em *Convencimento*. Se já for Treinado, se torna Experiente e assim por diante.
  - Você sabe o valor de um item ao examiná-lo.
  - Ao suceder em um teste de *Convencimento* contra um comerciante, garante 10% de desconto em um item.
  - *Por quê:*
    - o texto do Pedro já começava com "Treinado em Convencimento";
    - absorve a *Cara de Pau* ("rolar Convencimento com 1 nível de treinamento a mais");
    - absorve a avaliação de valor do *Olho no Lance*;
    - o desconto cai de 25% para 10%, o teto de modificador econômico (Mercador, *Felizardo*).
- **Bens Diversos (1 Ação, 5 Stamina)** [Pedro, sem mudança]
- **Agiota (3 Ações, 10 Stamina)** [Pedro, ajustado: "20% de lucro" → "10% de lucro"]
  - Mesmo teto de modificador econômico. Decisão 12, em §9.

### 5.3 Tier 2

**Cartógrafo**

As duas técnicas do T2 de hoje subiram para a classe (Mapa de Combate). O ramo ganha duas no lugar.

- **Coordenação (Ação Livre, 3 Stamina)** [Pedro, ajustado]
  - Era sub-habilidade do Desenhar Mapa de Combate e ganha lugar próprio.
  - Com o campo mapeado, orienta você ou um aliado em até 9 metros que esteja prestes a rolar um teste de *Movimento*, *Defender* ou *Atacar*, somando +2 à rolagem. 1 vez por rodada.
  - *Por quê:* hoje é Reação, e aí disputa a única reação do Batedor com Defender, Por Aqui! e Instinto Reativo. Como Ação Livre 1 vez por rodada, vale o Tier 2.
  - *Taxa:* +2 numa rolagem ≈ 1 de dano por 3 Stamina, abaixo do *Destruir*.
- **Traçar Rota (1 Ação, 3 Stamina)** [nova]
  - Com o campo mapeado, trace uma rota de até 9 m. Até o início do seu próximo turno, você e seus aliados que se moverem pela rota ignoram terreno difícil e não provocam ataques de oportunidade.
  - *Régua:*
    - *Comando Tático* (General): 1 aliado se move sem oportunidade, por 1 Ação + 2 Stamina.
    - *Campo de Batalha* (ultimate do General): o grupo se move como ação livre, sem oportunidade, por 1 minuto.
    - Traçar Rota fica no meio: o grupo, 1 turno, uma faixa de 9 m.

**Sem-Nome**

- **Cobra (Descanso Curto ou 1 Ação, 2 Stamina)** [Pedro, ajustado: escreve a D116 e a D57]
  - Texto do Pedro, com duas mudanças:
    - "deve suceder em um teste de Fortitude ou ficar Envenenada" → "deve suceder em um teste de Fortitude contra sua CD ou ficar *Envenenada*";
    - entra no fim: "A dose dura até o primeiro acerto."
  - A tensão com a D72 é pergunta: decisão 9, em §9.
- **Terror (Passiva)** [Pedro, ajustado]
  - Ao acertar um crítico com 20 natural, o alvo fica *Exposto*.
  - *Por quê:* hoje o texto fecha um laço infinito. O crítico deixa *Exposto*, o próximo acerto contra *Exposto* é crítico e deixa *Exposto* de novo, e assim todo acerto depois do primeiro crítico vira crítico.
  - Com "20 natural", o crítico que veio do *Exposto* não reabre o laço. A ideia do Pedro, crítico que expõe, fica.

**Trambiqueiro**

- **Conexões Duvidosas (1 Ação, 3 Stamina)** [Pedro, sem mudança]
- **Esquemas (Ação Livre, 5 Stamina, 1 vez por descanso longo)** [Pedro, ajustado: era a 2ª ultimate]
  - Texto e "O Custo" do Pedro. Só o cabeçalho muda: sai "Ultimate", entra "1 vez por descanso longo".
  - *Por quê:* o Trambiqueiro tem duas ultimates, e o padrão é uma por ramo. Decisão 11, em §9.

### 5.4 Tier 3

Frase do tier [Pedro, ajustado]: "O Tier 3 provê Ultimates, que só podem ser utilizadas 1 vez por descanso longo."
- Hoje o Batedor diz "1 vez por dia".
- A notação oficial é "1x/Descanso Longo" (L29). As outras classes já foram trocadas.

**Senhor das Linhas (1 Ação, 5 Stamina, Ultimate)** [Pedro, ajustado]. O texto fica; mudam três coisas:
1. **Sai "Não pode ser flanqueado."** O Sistema não tem regra de flanco.
2. **Criar Armadilha:** "recebe 3d6 dano" → "recebe 3d6 de dano Perfurante". Hoje não tem tipo de dano; Perfurante é o da *Armadilha Tática*.
3. **Formato:** "Ativação:" antes de "Você sente uma energia primordial…" e "O custo:" → "O Custo:", como nas outras classes.

**Silêncio (1 Ação, 5 Stamina, Ultimate)** [Pedro, ajustado]
1. "Escolha uma criatura em sua visão por rodada" → "Até o fim do combate, 1 vez por rodada como ação livre, escolha uma criatura em sua visão". O texto não dizia a duração nem a ação.
2. "Marcado à Morte" → "Marcada à Morte" em todo o texto (digitação).
3. "Ativação:" no formato das outras classes.

**Suborno Irrecusável (2 Ações, 5 Stamina, Ultimate)** [Pedro, sem mudança de regra]
- Só entra o rótulo "Ativação:". É a ultimate única do Trambiqueiro (decisão 11).

---

## 6. De → para: o destino de cada item de hoje

| Hoje | Destino | Por quê |
|---|---|---|
| Instinto (característica) | Instinto refeito (§3) | Zerava em 97,9% dos turnos de quem ataca |
| — | Mapa de Combate (característica nova) | Promove o núcleo do T2 do Cartógrafo |
| Atento, Líder, Fantasma | ficam | — |
| Passo Ciente, Terreno Ideal, Armadilha Tática, Emboscada | ficam, ajustadas | Passam a ler o campo mapeado |
| Caçador | Leitor de Rastros | Nome de origem |
| Oportunista | Tocaia | Nome do Espadachim; 1 Ação → Ação Livre |
| Ocultar-se | fica, corrigida (2 → 3) | O Sistema diz 3 ações |
| Língua Prateada | Trambiqueiro T1 | É a técnica de treinamento do ramo; 25% → 10% |
| Curioso | **sai** | O Pressentimento faz o mesmo e melhor |
| Mãos Rápidas | **sai** | Detalhe abaixo |
| Sigiloso | **sai** | Detalhe abaixo |
| Saque | **sai** | Cria Sins a cada morte: 1d4 + 2×Nível, ~12 no nível 5 (D6) |
| Pressentimento, Instinto Reativo | ficam | Pressentimento ganha o momento da declaração |
| Sexto Sentido | Olhos nas Costas | Nome de carta do Limiar; turno do atacante |
| Segundo Fôlego | fica, + "ou um aliado" | Papel de apoio |
| Golpe Instinto | **sai** → Passo em Falso | Termo antigo; ~1,6 de dano por 1 Ação + 4 Instinto |
| Desenhar Mapa de Combate (Cartógrafo T2) | vira a característica Mapa de Combate | — |
| Mapa Mental (Cartógrafo T2) | absorvido pela característica | Mesmo custo, sem o teste por rodada |
| Coordenação (sub-habilidade) | Cartógrafo T2 | Reação → Ação Livre 1x/rodada |
| Ponto Cego (sub-habilidade) | Passo em Falso (Instinto 4) | Nome do truque de Conhecimento |
| Reposicionar (sub-habilidade) | técnica geral | — |
| — | Traçar Rota (Cartógrafo T2) | Vaga aberta no T2 |
| Desenhar Mapa de Exploração, Escapista | ficam, ajustadas | Ligam ao campo mapeado |
| Artista Apaixonado, Olhar de Brecha | ficam, + treinamento | 1º T1 no padrão |
| Golpe Sombrio, Finta | ficam, ajustadas | Curta distância; exposição |
| Cobra | fica, texto da D116 e da D57 | D72 é pergunta |
| Terror | fica, só no 20 natural | Laço infinito de crítico |
| Cara de Pau | absorvida pela Língua Prateada | Mesmo efeito, permanente |
| Olho no Lance | **sai**; a avaliação vai para a Língua Prateada | +20% de Sins passa do teto de 10% |
| Esquemas | T3 → T2, 1x/descanso longo | 1 ultimate por ramo |
| Senhor das Linhas, Silêncio, Suborno Irrecusável | ultimates, ajustadas | Formato; sem flanco; duração |
| Colecionador de Horizontes | fica, com teto | Sem teto hoje |
| Homem de Negócios | fica; texto cortado | Pedro completa |

**Mãos Rápidas.** Reduz a PMA em −2 por 2 Stamina, mas é uma Reação usada no próprio turno, o que briga com Por Aqui! e Instinto Reativo. Também repete a *Oportunista* do Espadachim (PMA −3 por 5 Stamina) e o *Presságio*.

**Sigiloso.** O ataque escondido conta como feito contra *Desprevenido*, logo sai crítico se acertar. Voltar a se esconder com a reação dá dois ataques escondidos por turno, dois críticos. Além disso, o tiro escondido já é do Predador.

---

## 7. Números

### 7.1 Instinto: a régua R3 (`batedor-sim-instinto-rework.py`, 200 mil combates, semente fixa)

Parâmetros:
- **Esquiva (ao menos 1 ataque contra você erra na rodada):** 25%. A sensibilidade foi medida com 10% e 40%.
- **Perícia (fora Atacar e Defender) em combate:** 5% por rodada.
- **Golpe acima de metade da Saúde:** 3% por rodada.
- **Acertos:** 60/35/10 com Atacar(1); 60 com Atacar(2).

P(Instinto chega a 5 até a rodada N), sem gastar no caminho:

| Situação | R1 | R2 | **R3** | R4 | R5 |
|---|---|---|---|---|---|
| **Hoje**, 3 ataques por turno | — | ~0% | **0,0009%** | — | — |
| Atacar(1), campo mapeado desde o início, começa com 0 | 0% | 30,5% | **89,7%** | 98,5% | 99,8% |
| Atacar(1), mapeado desde o início, começa com 2 (vem da exploração) | 21,6% | 92,8% | **98,7%** | 99,8% | 100% |
| Atacar(1), mapeia no turno 1 (1 Ação), começa com 0 | 0% | 5,6% | **68,5%** | 95,7% | 99,4% |
| Atacar(2), mapeado desde o início, começa com 0 | 0% | 21,5% | **79,5%** | 96,6% | 99,4% |
| Atacar(2), mapeia no turno 1, começa com 0 | 0% | 3,7% | **52,0%** | 90,1% | 98,3% |
| Atacar(1), sem mapa | 0% | 0,4% | **10,5%** | 38,2% | 66,0% |
| Atacar(2), sem mapa | 0% | 0,3% | **6,1%** | 22,7% | 44,7% |

Sensibilidade à esquiva (Atacar(1), mapeia no turno 1): 10% → 55,6% na R3; 40% → 78,5% na R3.

**Leitura:**
- **R3 passa em todos os casos com mapa**, de 52% a 99% na 3ª rodada.
- **Sem mapa, não passa**, e é de propósito: o mapa é o motor. A arma importa pouco.
- **Preparar-se aparece no número (R6):** começar com 2 do Instinto da exploração leva a R2 de 30% para 93%.

**Passo em Falso** (4 Instinto), gastando sempre que der, num combate de 4 rodadas. Em 70% das rodadas há um alvo que se moveu.

| Situação | Média de usos | 0 usos | 1 uso | 2+ usos |
|---|---|---|---|---|
| Atacar(1), mapeado desde o início | 1,04 | 9% | 77% | 14% |
| Atacar(1), mapeia no turno 1 | 0,87 | 16% | 80% | 3% |
| Atacar(2), mapeia no turno 1 | 0,81 | 21% | 77% | 2% |
| Atacar(1), sem mapa | 0,26 | 74% | 26% | 0% |

**~1 *Exposto* por combate.** É o limite que segura o rocket tag: hoje o *Ponto Cego* pago em Stamina dava ~10.

Os outros usos do Instinto competem com o Passo em Falso: guardar 5 para o Instinto Reativo, ou gastar 2 no Olhos nas Costas.

### 7.2 Orçamento (`scripts/classes/orcamento_tecnicas.py`)

As 15 técnicas batem com o mix médio das outras 6 classes (tabela em §4).

Custo em Stamina, Batedor contra as 6 (média e faixa):

| Tipo | Batedor | As 6 |
|---|---|---|
| 1 Ação | 2,5 (2–3) | 2,9 (2–5) |
| Ação Livre | 2 | 3,4 (2–5) |
| Reação | 2 | 3,4 (2–5) |

As técnicas do Batedor saem mais baratas porque a força dele está no Instinto, não na Stamina. Isso bate com o Vigor 6.

### 7.3 Preço das técnicas novas e mudadas, contra a régua

| Técnica | Entrega | Âncora no sistema |
|---|---|---|
| Tocaia | +1d8, condicional, por 2 Stamina | *Destruir*: +1d6 por 2 Stamina, sem condição. Se o alvo está *Exposto*, o acerto já é crítico; o +1d8 não dobra (vem de fora da arma, D97) |
| Passo em Falso | *Exposto*, sem rolagem, por 1 Ação + 4 Instinto; ~1 por combate | *Ponto Cego* (o original): 1 Ação + 4 Stamina, sem teto. *Brecha* (Espadachim): 1 Ação + 5 Stamina, só depois de acertar. *Marcar*: +5 Éter, se acertar |
| Por Aqui! | 1 aliado sai sem ataque de oportunidade, por Reação + 2 Stamina | *Batida Tática* (Artilheiro): 1 Ação + 2 Stamina, só para si. *Passo do Vento* (Monge): 3 Fluxo, passivo |
| Varredura | Acelera a disputa de Furtividade que a regra já faz toda rodada e divide o achado com o grupo | *Leitura de Combate* (General) dá informação de 1 criatura por 1 Ação + 2 Stamina |
| Sinais | Redireciona um gasto de Instinto para um aliado. Custo zero porque o Instinto já paga | — |
| Vigia | +2 Percepção só na vigia; o combate da vigia começa mapeado | *Veterano de Guerra* (General T1, passiva): não Desprevenido + Iniciativa |
| Traçar Rota | O grupo se move sem ataque de oportunidade por 1 turno, numa faixa de 9 m | Entre *Comando Tático* (1 aliado) e *Campo de Batalha* (ultimate, 1 minuto) |
| Coordenação | +2 numa rolagem, 1 vez por rodada, por 3 Stamina | Taxa baixa: ≈1 de dano por 3 Stamina |
| Armadilha Tática | Ganha teto de (Nível) armadilhas; com mapa, desvantagem para notar | *Armadilha de Pregos* (Bazar, Incomum): 2d6 Perfurante, reutilizável |

**Rocket tag:**
- **Três fontes de *Exposto*:** Passo em Falso (~1 por combate), Terror (só no 20 natural, 5% dos ataques) e *Emboscada* (primeira rodada, texto do Pedro).
- **O laço do Terror fecha.**
- **Nenhuma fonte amplia margem de ameaça.**

---

## 8. Teste de sobreposição

### 8.1 Batedor × Artilheiro (revisado; o de antes está no `13` §Rodada 1)

| Eixo | Batedor novo | Artilheiro | Sobreposição |
|---|---|---|---|
| Coeficientes | 5/6/4 | 4/7/4 | **baixa** (era total) |
| CD | 10 + DES + SAB | 10 + DES + SAB | total (3 classes usam; não define papel) |
| Arma treinada | À Distância | À Distância | total |
| Papel | controle de campo e apoio | dano à distância | **nenhuma** |
| Recurso | Instinto: enche com o mapa, gasta em apoio (Exposto para o grupo, reação extra) | Concentração: enche atirando, gasta em dano próprio | **baixa** |
| Não ser Desprevenido | o grupo inteiro, com o campo mapeado | só ele, por quem ele vê | **baixa** |
| Ataque escondido | Sem-Nome corpo a corpo: *Golpe Sombrio*, *Finta* | Predador à distância: *Tiro Camuflado*, *Tiro Predador* | **baixa** (era alta) |
| Veneno | *Cobra* (cria e aplica na arma) | *Projétil Envenenado* (munição) | parcial |
| Rastreio | *Leitor de Rastros* | *Marca no Alvo* | parcial |

### 8.2 Batedor × General (ramo do Brutalista), o outro tático do sistema

| Eixo | Batedor | General | Sobreposição |
|---|---|---|---|
| Não ser Desprevenido | o grupo, com o campo mapeado | só ele (*Veterano de Guerra*) | parcial |
| Mover aliados | *Reposicionar* 4,5 m (mapa) · *Por Aqui!* · *Traçar Rota* | *Comando Tático*: movimento inteiro como reação, ou ataque +2, ou Defender +4 | parcial |
| Bônus de grupo | *Coordenação* +2 numa rolagem; *Exposto* por Passo em Falso | *Formação*: +Atacar / +dano; *Campo de Batalha* +3 | **baixa** |
| Informação | onde estão os escondidos (*Varredura*) | como está uma criatura (*Leitura de Combate*) | **baixa** |
| Iniciativa | *Segundo Fôlego* (re-rola, ele ou 1 aliado) | +2 aos aliados no 1º turno | parcial |

**Separação:**
- **O General manda:** dá ordens, e o aliado age, ataca, se defende melhor.
- **O Batedor lê o terreno:** ninguém é surpreendido, o grupo anda pelo campo, o inimigo que se move fica exposto.

Um grupo com os dois não tem técnica redundante.

---

## 9. Decisões para o Pedro (responda por número)

1. **Papel e as duas características** (§1, §3): tático de campo, com Mapa de Combate + Instinto refeito. Recomendo aceitar. É o que dá identidade de combate à classe.
2. **Coeficientes 5/6/4** (§2). Recomendo.
3. **Lista de perícias** + Movimento e Investigação (§2). Opcional.
4. **Pressentimento "depois de rolar o dado"** (§3). Recomendo. Hoje o texto não diz quando se declara.
5. **Renomes forçados por colisão:**
   - Sexto Sentido → *Olhos nas Costas* (carta do Limiar SAB 16+);
   - Oportunista → *Tocaia* (Espadachim);
   - Ponto Cego → *Passo em Falso* (truque);
   - Caçador → *Leitor de Rastros* (origem).
   Os nomes são sugestão minha; se preferir outros, só dizer.
6. **Segundo Fôlego "ou um aliado"** (§3). Recomendo.
7. **As 4 técnicas gerais novas** (Vigia, Sinais, Varredura, Por Aqui!) e as **4 que saem** (Curioso, Mãos Rápidas, Sigiloso, Saque) (§4, §6).
8. **Sem-Nome de curta distância** (Golpe Sombrio "corpo a corpo"). Separa o Sem-Nome do Predador do Artilheiro. Recomendo.
9. **Cobra × D72.** A Cobra cria veneno próprio: é técnica, não item do Bazar. A D72 travou os *itens* de veneno na Alquimia.
   - Recomendo manter a Cobra como está, só com a D116 e a D57 escritas. Você já confirmou a leitura dela na D116.
   - A alternativa respeita a D72 ao pé da letra: a Cobra vira "aplicar veneno comprado custa ação livre, + Fortitude contra sua CD ou *Envenenado*".
10. **Terror só no 20 natural** (§5.3). Corrige o laço infinito. Recomendo.
11. **Uma ultimate no Trambiqueiro.**
    - Recomendo: **Suborno Irrecusável** fica ultimate, porque é a que muda o combate. **Esquemas** desce para o T2 como "1 vez por descanso longo". Saem *Olho no Lance* e *Cara de Pau*, absorvidos pela Língua Prateada.
    - Alternativa: Esquemas fica ultimate e Suborno desce para o T2.
    - Ou você mantém as duas, e o Trambiqueiro fica como exceção ao padrão.
12. **Economia no teto de 10%:** Língua Prateada 25% → 10%; Agiota 20% → 10%; saem o +20% de Sins do Olho no Lance e o Saque.
13. **Homem de Negócios:** falta o fim da frase "Você possui um disturbio de mat…".
14. **Colecionador de Horizontes com teto de +5 de Stamina máxima.** Pode ser +10, que é o preço de uma carta universal do Limiar.
15. **Senhor das Linhas:** sai "Não pode ser flanqueado", porque não há regra de flanco; a armadilha do *Criar Armadilha* passa a causar dano Perfurante.
16. **Opcional, criação minha: uma técnica de combate no Trambiqueiro**, no lugar do Agiota.
    - Texto: **Olha Ali! (1 Ação, 2 Stamina)**: "Role *Enganação* contra a *Percepção* de uma criatura que possa te ouvir. Sucesso: até o fim da rodada, ela não pode retaliar o próximo ataque de um aliado seu."
    - Só se você quiser o Trambiqueiro também no combate. Sem ela, o combate dele vem do kit da classe.

---

## 10. Depois do aceite

1. Gravar no Notion (`8706e3a4…`), com `update_content` e `old_str` exato, em blocos por seção:
   - Status iniciais;
   - Treinamento;
   - a característica nova antes de "# Técnicas:";
   - tabela de técnicas;
   - Instinto;
   - Marcas;
   - Tier 1, Tier 2 e Tier 3.
2. Conferir cada bloco por fetch.
3. Rodar o diff contra o retrato de antes: `python3 scripts/log-tecnicas/ndiff.py references/batedor-notion-antes-do-rework.txt <dump novo>`.
4. **Log do novo Batedor para o agente de HTML** no `17` §3, com a tabela de §6 como índice do que mudou.
5. Para a ficha digital: contrato rev. 11 no bloco `classes.batedor`. O rascunho abaixo fica aqui até o aceite:
   - `V/G/R 5/6/4`;
   - um estado de combate `campoMapeado` (sim/não);
   - o Instinto com ganhos e perdas novos;
   - os gastos por id.
6. A `log-tecnicas-respostas.json` tem 5 achados do Batedor em `pedroDecide` (Revisão 3). Eles se fecham com o log.

```json
"batedor": {
  "V": 5, "G": 6, "R": 4,
  "estados": [{"id": "campoMapeado", "tipo": "booleano", "escopo": "combate",
               "liga": ["observou 1 min antes", "Mapa de Exploração da região", "1 Ação + 2 Stamina", "Vigia", "Emboscada", "Terreno Ideal (ação livre)"],
               "efeitos": ["grupo que te ouve: imune a Desprevenido", "+1 Instinto no início do seu turno"]}],
  "recursos": [{"id": "instinto", "max": 5,
                "ganhos": [{"gatilho": "inicioDoTurno", "requer": "campoMapeado", "valor": 1},
                           {"gatilho": "acerto", "valor": 1, "limite": {"n": 1, "por": "novaRodada"}},
                           {"gatilho": "esquiva", "valor": 1, "limite": {"n": 1, "por": "novaRodada"}},
                           {"gatilho": "sucessoEmPericia", "exceto": ["atacar", "defender"], "valor": 1,
                            "limite": {"n": 1, "por": "novaRodada"}, "limite2": {"n": 1, "por": "cena", "escopo": "porPericia"}}],
                "perdas": [{"gatilho": "condicao:desprevenido", "efeito": "zera"},
                           {"gatilho": "danoMaiorQueMetadeDaVidaMax", "efeito": "perdeMetadeArredondandoParaCima"},
                           {"gatilho": "10minSemGanhar", "efeito": "zera"}],
                "gastos": {"pressentimento": "X", "olhos-nas-costas": 2, "segundo-folego": 3, "passo-em-falso": 4, "instinto-reativo": 5}}]
}
```
