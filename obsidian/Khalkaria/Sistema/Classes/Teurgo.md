---
tipo: classe
status: canon-notion
spoiler: publico
era: atemporal
aliases: [Teurgo, Teurgos, Conjurador, Feiticeiro]
fonte_notion: [caa6e3a401d98330bae281511750d407, 3a66e3a401d9809b8eceec1f30be9fd2]
ultima_sync: 2026-09-05
tags: [khalkaria/sistema, khalkaria/sistema/classes]
---

# Teurgo

**Resumo.** Única classe conjuradora do sistema (🪄, Notion 🟢 Pronto, ed. 2026-08-05). Maior progressão de [[Éter]] (`+9/nível`) e a menor de Saúde (`+3/nível`). Não tem um "recurso de classe" separado: seu recurso **é** o Éter, gasto para abrir a ponte do [[Plano Místico]] para o [[Plano Material]] através de [[O Limiar]]. Especializa-se em **Escolas do Primórdio** — 2 no nível 1, 3 no nível 3, 5 no nível 5 — cada uma exigindo um **Foco** próprio. Perfil do índice: Combate ★★☆☆☆ · Controle ★★★☆☆ · Exploração ★★☆☆☆ · Místico ★★★★★ · Tecnologia ★★☆☆☆.

## Cânone (Notion)

### Prosa de abertura
> Enquanto outros confiam no aço e na carne, você aprendeu a ouvir o sussurro do outro lado. As forças primordiais fluem através de você — não porque você as comanda, mas porque elas *permitem* que você as canalize. Alguns chamam isso de magia. Outros, de loucura. Você chama de estudo.
> A verdade é que ninguém sabe de onde vem o poder que você manipula. Os textos antigos falam de deuses, de planos além da percepção mortal, de uma Grande Árvore que conecta todos os mundos. Você leu esses textos. Você questionou cada linha. E quanto mais aprende, mais percebe que as respostas geram apenas mais perguntas.
> O Éter que você manipula cobra seu preço. Cada conjuração é um diálogo com algo que você não compreende — e que talvez não devesse compreender. Mas você continua. Porque o conhecimento, mesmo o proibido, é a única luz na escuridão.

### Progressão
| Level | Conteúdo |
|---|---|
| 1 | 4 Técnicas, 2 Escolas do Primórdio |
| 2 | 5 Técnicas, Técnica de Ramo(Tier 1) |
| 3 | 6 Técnicas, 1 Marca, 3 Escolas do Primórdio |
| 4 | 7 Técnicas, Técnica de Ramo(Tier 1, 2), 2 Marcas |
| 5 | 8 Técnicas, Técnica de Ramo(Tier 1, 2 e 3), 3 Marcas, 5 Escolas do Primórdio |

### Status iniciais
- **Saúde:** `10 + (3 × Nível) + (Mod.CON × Nível)`
- **Stamina:** `8 + (3 × Nível) + (Mod.FOR OU Mod.DES × Nível)`
- **Éter:** `6 + (9 × Nível) + (Mod.INT OU Mod.SAB × Nível)`
- **Evasão Ativa (Reação):** 10 + Mod. Destreza + Treinamento em *Defender*
- **Evasão Passiva (Sem reação):** 10 + Mod. Destreza

### Treinamento
Você começa treinado em: **Armas Místicas, Místico, Conhecimento**
Além disso, você pode escolher **(1 + Mod. Inteligência)** Perícias para ser treinado dentre as seguintes: Religião, Vontade, Percepção, Medicina, Investigação

- **Atributos Recomendados:** Inteligência, Sabedoria e Constituição.
- **Play Style:** Contato com as Forças Primordiais, Conjuração Versátil e Combate a Distância.
- **CD:** 10 + Mod. Inteligência + Mod. Sabedoria

### Escolas do Primórdio
> O Teurgo não domina toda a magia — ele se especializa em **Escolas** que representam diferentes manifestações das forças primordiais. Cada escola requer um **Foco** específico para ser conjurada.
> Você estudou 2 Escolas, +1 no nível 3 e +2 no nível 5.
> Escolha 1+MOD. INT ou SAB magias de nível 1 no primeiro nível.

| Escolas | Definição |
|---|---|
| [[Abjuração]] | Proteção, banimento, anulação. |
| [[Destruição]] | Dano, destruição, elementos. |
| [[Conhecimento]] | Adivinhação, detecção, comunicação. |
| [[Alteração]] | Transformação, manipulação, enganação. |
| [[Primordial]] | Magia selvagem e bruta, intenção incompreendida. (Requer nível 5) |

### Técnicas gerais
> Você possui **3 Técnicas + Nível**, reatribuíveis em descanso longo.

| Técnica | Descrição | Custo | Ação |
|---|---|---|---|
| Éter Residual | Ao conjurar uma magia contida e seu custo final for ≤1, adicione uma modulação grátis. | — | Passiva |
| Reserva Oculta | Ao chegar a 0 de Éter, pode conjurar magias pagando em Saúde. (2:1) Ou seja, 2 Saúde = 1 Éter. | — | Passiva |
| Foco Duplo | Você pode empunhar dois focos ao mesmo tempo, alternando escolas sem trocar de equipamento. | — | Passiva |
| Força Primordial | Suas magias de dano ignoram 1 de Ae. Adicionalmente, suas magias causam 1 de dano Primordial adicional. | — | Passiva |
| Transbordar Controlado | Ao usar intensidade Transbordante, rola vontade com +2. | — | Passiva |
| Linguagem Estranha | Você consegue entender de maneira básica e leiga, o idioma Abissal. | — | Passiva |
| Encadeamento | Ao conjurar uma magia, pode conjurar outra magia se puder pagar pelas ações. A segunda magia custa Éter adicional igual ao número de ações dela. | 3 Stamina | Passiva |
| Respiração Primordial | Você medita brevemente, restaurando suas forças. Recuperando (nível)d4 Éter. Max. 1x/Descanso Curto. | — | 5 Minutos |
| Imbuir Magia | Pode preparar uma magia em um objeto gastando o éter de antemão, designando um gatilho de ativação específico, como: impacto, proximidade, ativação remota… Você pode ativar a magia a qualquer momento com uma reação. | 5 Stamina | 1 Minuto |
| Canalização Eficiente | Reduza o custo de uma magia em 1 Éter. | 2 Stamina | Ação Livre |
| Sentir Magia | Você sente a presença de magia ou efeitos primordiais em até 9 m. Porém não consegue diagnosticar nenhuma característica, apenas fica ciente de sua presença. | 2 Stamina | 1 Ação |
| Conjuração Furtiva | Você pode conjurar magias de forma silenciosa, sem componente verbal, sonoro e visual. Role um teste de *Furtividade* vs. *Percepção* ou *Místico* das criaturas que podem perceber a magia. Se o alvo receber qualquer tipo de dano ele instantaneamente percebe a magia. | 2 Stamina | 1 Ação |
| Marca do Primórdio | Ao acertar uma criatura com uma magia de dano, pode marcá-la. Caso ela falhe em um teste de *Vontade* contra sua CD, magias de dano recebem +1 dado de dano contra essa criatura. No início de cada turno, a criatura rola novamente. | 3 Stamina | 1 Ação |
| Concentração | Pode canalizar uma magia com 1 ação adicional, adiciona +1 dado de dano ou uma modulação grátis. | 3 Stamina | +1 Ação |
| Barreira Instintiva | Ao receber dano, pode gastar Éter como ação livre para reduzir dano. 1 Éter = 1d4 de dano reduzido, 2 Éter = 2d4 de dano reduzido… (Max. Éter gasto = Nível) | 1-5 Éter | Ação Livre |

### Ramos
> 3 Marcas; 6 Técnicas de Ramo (3 no Tier 1, 2 no Tier 2, 1 no Tier 3 — ver Conflitos).

- **Ramo do Acadêmico** (azul — Conhecimento e Equilíbrio mental) — *A magia nunca foi mistério para você — foi problema a ser resolvido. Enquanto outros temem o desconhecido, você o disseca, cataloga e domina. Cada fenômeno tem uma explicação. Cada força segue regras. Seus grimórios estão cheios de anotações, teoremas e correções. O que chamam de milagre, você chama de ciência ainda não compreendida.*
- **Ramo do Receptáculo** (verde — Natureza mística e caótica) — *Você não escolheu a magia. Ela escolheu você. Desde jovem, as forças primordiais sussurram no limite da sua percepção — vozes sem forma, visões sem contexto, poder sem explicação. Você aprendeu a se abrir, a se esvaziar, a deixar que o outro lado flua através de você. É perigoso. É intoxicante. E você não consegue mais parar.*
- **Ramo do Arauto** (vermelho — Rituais prolongados e pactos) — *O poder verdadeiro não é tomado — é negociado. Você entendeu isso cedo. Através de rituais meticulosos, círculos perfeitamente traçados e palavras pronunciadas na ordem exata, você firma acordos com forças que outros nem sabem que existem. Cada pacto tem um preço. Cada cerimônia deixa uma marca. Mas o que você recebe em troca… vale cada cicatriz.*

### Marcas de Ramo
**Marcas do Acadêmico**
- **O Duelista** — *"O duelo arcano é xadrez. Você sempre pensa três jogadas à frente."*
  - Você tem +2 em Místico, Vontade e Reflexo contra outros Teurgos ou criaturas que conjuram magias.
  - Ao acertar um Teurgo ou conjurador com uma magia de dano, você rouba 1d6 de Éter dele.
- **Colecionador de Teoremas** — *"Cada magia estudada é uma peça do quebra-cabeça. Você está montando o mapa do universo."*
  - Para cada 5 magias diferentes que você presenciou sendo conjuradas e anotou em seu grimório, ganha +1 permanente em Místico. Ao chegar em +5, essa habilidade fica supérflua.
  - Ao suceder em um teste de místico para identificar corretamente uma magia (escola, nível e efeito), recupera 1 de Stamina.

**Marcas do Receptáculo**
- **Cicatrizes do Fluxo** — *"O poder que corre nas suas veias deixa marcas permanentes."*
  - Para cada 5 magias que você conjurou com Intensidade Transbordante com sucesso, ganha +1 permanente em Vontade. Ao chegar em +5, essa habilidade fica supérflua.
  - Ao falhar no teste de Vontade de uma magia Transbordante, você ainda conjura a magia porém na sua versão contida, então recupera 1 de Stamina.
- **Casca Rachada** — *"Às vezes, o melhor a se fazer é deixar transbordar."*
  - Você pode ficar *Oco* como uma ação, isso significa que você perde todo seu éter, que fica em 0.
  - Ao estar *Oco*, seu limite máximo de éter negativo dobra, além disso, você tem +2 de *Vontade* enquanto nessa condição.

**Marcas do Arauto**
- **Devoto** (Requer Arauto Tier 1) — *"Sua fé no pacto é absoluta. Seu patrono recompensa devoção."*
  - Para cada 3 vezes que você cumpriu uma exigência do Preço do Pacto do seu Patrono (Barganha Primordial), ganha +1 permanente em Místico. Ao chegar em +5, essa habilidade fica supérflua.
  - Adicionalmente, você ganha 50% mais da recompensa ao cumprir uma barganha primordial.
- **Porta-Voz** — *"Você não fala com entidades. Você fala POR elas."*
  - Você pode servir como canal de comunicação para seu Patrono — ele pode falar através de você (com sua permissão).
  - +2 em interação social(Intimidação) quando invoca o nome/autoridade do seu Patrono.
  - Uma vez por descanso longo: Pode fazer uma pergunta direta ao seu Patrono.

### Técnicas de Ramo — Tier 1 (nível 2)
**Acadêmico**
- **Grimório Arcano** (Passiva) — Você possui um livro onde armazena grande parte do seu conhecimento arcano, lá estão seus estudos junto com suas magias conhecidas. Escolha **3+Mod. Inteligência** magias em escolas que você é especializado e +1 para cada nível subsequente. Você só pode escolher magias iguais ou abaixo do seu (nível − 1). Você pode estudar e reordenar suas magias em um descanso longo.
- **Tese Arcana** (Passiva, 4 Stamina) — Escolha uma magia que você conhece. Ela se torna sua Tese. Você pode trocar a magia escolhida em um descanso longo. Ao canalizar essa magia, escolha entre gastar 2 de Stamina ou não: Ao gastar 4 de Stamina, essa magia possui uma modulação grátis e sua intensidade é de 1 nível acima. Ao castar sem gastar 4 de Stamina, ela custa −1 Éter. **[custo contraditório no Notion — ver Conflitos]**
- **Recuperação Primordial** (3 Ações, x Stamina) — Você gasta 3 ações para revitalizar sua relação com as **forças materializantes**. Você compra pontos de Éter gastando pontos de Stamina, com uma proporção de 2:1. Ou seja, 2 de Stamina = 1 Éter.

**Receptáculo**
- **Canalizador Inato** (Passiva) — Você possui magias gravadas em sua essência, compartilhadas pelas **forças materializantes** que atuam da sua essência. Escolha **2+Mod. Sabedoria** magias em escolas que você é especializado e +1 para cada nível subsequente. Você só pode escolher magias iguais ou abaixo do seu (nível − 1). Essas magias são permanentes e não podem ser trocadas. Ao conjurar qualquer magia com intensidade Forçada, seu custo adicional é de +1 (em vez de +2).
- **Natureza Caótica** (Passiva) — Ao conjurar qualquer magia, role 1d6: **1:** Você perde +1d4 de Éter e a magia perde 1 de intensidade; se a intensidade for contida, a magia falha. **2-5:** A magia é canalizada. **6:** A magia ganha +1 de intensidade; se a intensidade for transbordante, ganha +1 dado de efeito (Cura, Dano) ou +50% de duração/área.
- **Canalização Visceral** (Passiva) — Pode conjurar qualquer magia sem o Foco apropriado, mas ao fazer isso: Recebe dano primordial em Saúde igual ao nível da magia × 2. Este dano não pode ser reduzido por Armaduras ou Resistências.

**Arauto**
- **Patrono Primordial** (Passiva) — *"Você firmou um pacto com algo além da compreensão mortal. Ele te deu poder. Ele espera algo em troca."* Escolha uma entidade primordial como seu Patrono. Esta escolha é permanente e define sua relação com o místico.
  - **A Grande Árvore** — *A Grande Árvore sussurra para aqueles que se aproximam. Sua voz é gentil, maternal até. Ela oferece alívio, clareza, poder. Ela só quer ajudar. Ela só quer que você floresça.*
    - *Benefícios:* Suas magias de alteração sempre têm intensidade +1. Uma vez por descanso longo, pode beber *Seiva*: recupera 1d6 de Éter e remove alguma condição mental, exceto *Oco*. Você sente a presença de seres malignos e usuários de seiva em até 18 m.
    - *Preço do pacto:* Defenda a Grande Árvore de quem quer destruí-la a todo custo. Propague a todo momento os benefícios do uso de *Seiva*.
  - **O Trancafiado** — *No fundo do Abismo, onde as almas pecadoras são aprisionadas para a eternidade, algo mais antigo também foi selado. Ele não é uma alma — ele estava lá antes das almas chegarem. Os séculos o enlouqueceram, ou talvez ele sempre foi assim. Ele odeia sua prisão. Ele odeia os Deuses que o trancaram. E ele sussurra através das correntes para qualquer um que ouça.*
    - *Benefícios:* Suas magias de destruição causam +2 de dano base. Uma vez por descanso longo, pode emprestar um pouco da fúria do seu patrono: Sua próxima magia tem dano dobrado, mas você recebe metade do dano causado em dano Primordial. Você pode ver e falar com mortos que se foram até 1 hora atrás.
    - *Preço do Pacto:* Que você tente ativamente descobrir informações sobre o abismo e como abri-lo. Que você mate almas pecadoras. Que você espalhe a causa do Trancafiado. Que você se oponha a todos os deuses.
  - **O Limiar** — *Entre o plano material e o plano místico existe um portão. E no portão existe um guardião. Ele não é bom nem mau — ele é a fronteira. Ele decide o que passa e o que fica. Teurgos que canalizam demais às vezes o sentem observando. Alguns dizem que é um Deus. Outros dizem que é algo que os Deuses criaram para manter a ordem. Talvez ele seja o portão em si.*
    - *Benefícios:* Suas magias de abjuração custam −1 Éter. Uma vez por descanso longo, pode invocar a autoridade do Limiar: Como uma reação, anule completamente uma magia ou efeito mágico de nível igual ou abaixo do seu, antes dela ser canalizada ou após sua materialização. Você sabe instintivamente quando algo cruza entre os planos em até 30 m (invocações, possessões, portais).
    - *Preço do Pacto:* Que você não permita canalização desnecessária de magia. Que você puna teurgos ou criaturas que exponham a existência do plano místico. Que você proteja o plano místico a todo custo.
- **Magias Pactuadas** (Passiva) — Você negociou com seres primordiais temidos por outros, eles te fornecem uma fração de sua essência, por um custo: Escolha **1+Mod. Inteligência** magias em escolas que você é especializado e +1 para cada nível subsequente. Você só pode escolher magias iguais ou abaixo do seu (nível − 1). Para trocar ou adquirir uma nova magia pactuada: Requer um ritual de ao menos 1 hora. Requer pagamento de preço (definido pelo seu pacto): Componentes raros, Sins, Sacrifício, Acordos. Ao conjurar uma Magia Pactuada em Intensidade Contida, o custo é 0 de Éter (ao invés de 1).
- **Barganha Primordial** (1 Ação) — Uma vez por descanso longo, pode invocar as forças primordiais e propor uma barganha: Declare o que você quer: Recuperar 1d6 de Éter / Próxima magia ganha uma modulação grátis / Uma informação sobre algo místico/oculto / Outro benefício… As forças declaram um preço pelo seu pedido: Perda de Saúde, Stamina ou Éter / Componente material ou Sins / Tarefa a ser cumprida futuramente / Outro preço…

### Técnicas de Ramo — Tier 2 (nível 4)
**Acadêmico**
- **Maestria Arcana** (Passiva) — Escolha uma escola do primórdio que você é especializado. Você se torna mestre nela. Magias desta escola: Custam −1 Éter. O custo de Éter das modulações dessa escola é reduzido em 1. Pode trocar a escola escolhida em um descanso longo.
- **Eterno Aprendiz** (Reação, 5 Stamina) — Ao presenciar uma magia sendo conjurada por outra criatura, pode estudá-la rapidamente, aprendendo-a posteriormente. Ao estudar a magia você sabe exatamente qual magia é, sua intensidade e modulações. Ganha +2 em testes de resistência ou para dissipar a magia. Se você for especializado na escola dessa magia, anote ela. Em um descanso longo você pode tentar aprendê-la, rolando um teste de místico (CD 15 + Nível da Magia × 2). Você só pode aprender 1 magia por descanso longo.

**Receptáculo**
- **Surto Primordial** (Ação Livre, 2 Stamina) — Declare antes de conjurar uma magia: A magia é canalizada com intensidade transbordante sem custo adicional de Éter. Porém, o teste de Vontade é CD 18 (ao invés de 15).
- **Êxtase Destrutivo** (Passiva)
  - **Ao ter 50% de Éter ou abaixo:** *Destruição:* +1d6 de dano. *Abjuração:* +50% de Efeito (cura, escudo) ou Duração. *Alteração:* +1 alvo adicional ou +50% de Duração. *Conhecimento:* +50% de Alcance/Área ou 1 modulação grátis.
  - **Ao ter 0 de Éter ou abaixo:** *Destruição:* +2d6 de dano e ignoram 2 de Armadura. *Abjuração:* +100% de Efeito ou Duração e não podem ser dissipadas. *Alteração:* +100% de Duração e afetam +2 alvos adicionais. *Conhecimento:* Alcance/Área dobrado e você pode fazer 1 pergunta adicional ao mestre sobre o que detectou.

**Arauto**
- **Ritual** (10 minutos, 5 Stamina) — Você pode ritualizar uma magia, aumentando a duração de seus efeitos para 1 hora e alvos para todos que estiverem presentes no ritual, independente de sua duração original ou alvos máximos. O custo de Éter é pago normalmente. O efeito dura por 1 hora ou até você estar *Oco* ou *Morrendo.* Você pode sustentar apenas 1 Ritual por vez.
- **Invocar Ser** (2 Ações, 3 Stamina) — Você invoca uma criatura mística, que te obedece e parece não pertencer a este plano. Se você possui um patrono, escolha a criatura respectiva dele, caso contrário, escolha a genérica.

| Patrono | Ser | Saúde | Evasão | Ataque | Dano | Habilidade | Movimento |
|---|---|---|---|---|---|---|---|
| A Grande Árvore | **Grutto** — *uma pequena árvore, porém com casca resistente, ela possui folhas jovens amarelas* | 15+(nível×2) | 12+Mod. INT | 1d20+Mod. SAB | 1d6+Mod. INT (Primordial) | *Seiva Dourada:* 1d20+Mod. SAB contra Reflexo de todos os alvos em até 3 m. Alvos que falharem recebem 1d10+Mod. INT de dano Biológico. | 6 m |
| O Trancafiado | **Mortto** — *uma alma sombria sem forma ou vontade, esse espectro é errático e parece estar furioso a todo momento* | 10+(nível×2) | 10+Mod. INT | 1d20+Mod. SAB | 1d8+Mod. INT (Primordial) | *Atormentar:* 1d20+Mod. SAB contra Vontade de um alvo; caso ele falhe, ataques contra esse alvo têm +1 dano. | 9 m |
| O Limiar | **Terro** — *um cavaleiro guardião, porta um grande escudo que é quase do mesmo tamanho dele* | 20+(nível×2) | 14+Mod. INT | 1d20+Mod. SAB | 1d4+Mod. INT (Primordial) | *Chamar Atenção:* 1d20+Mod. SAB contra Vontade de um alvo; caso ele falhe, é obrigado a atacar Terro na próxima rodada pelo menos 1 vez. | 6 m |
| Genérico | **Crikko** — *um ser místico pequeno aleatório aparece* | 10+(nível×2) | 10+Mod. INT | 1d20+Mod. SAB | 1d6+Mod. INT (Primordial) | — | 7,5 m |

> O Ser age no seu turno ao seu comando, porém possui apenas 2 ações. Se Movimentar, Atacar ou Utilizar uma Habilidade gasta 1 ação. O Ser dura 10 minutos, até você dispensá-lo ou ser destruído, e após isso é dissipado. Você pode invocar 1 ser no nível 4 e 2 seres no nível 5. **Ao ser destruído, você recebe 1d4 de dano Primordial.**

### Técnicas de Ramo — Tier 3 · Ultimates (nível 5)
> O Tier 3 provê ultimates, que só podem ser utilizadas 1 vez por dia.

**Acadêmico** — *"O místico, eu conheço-o melhor que eu mesmo."*
- **Teorema Absoluto** (X, 5 Stamina, Ultimate) — Você atinge a compreensão perfeita das forças primordiais. Por um breve momento, você não apenas entende a magia — você a controla absolutamente. Ao ativar escolha uma das ações a seguir:
  - **Conjuração Impecável** (1 Ação): Sua próxima magia é canalizada perfeitamente, com total equilíbrio: Intensidade Transbordante, sem custo ou teste de vontade adicional. Todas as modulações da escola custam 0 de Éter. Se for uma magia de dano, ela dá o máximo de dano possível. Se for uma magia de suporte, ela dá o máximo de cura/escudo possível ou tem o dobro de duração e não pode ser dissipada. Se for uma magia de controle, que exija um teste de resistência, o alvo rola com desvantagem. Se for uma magia de conhecimento, você recebe todo o conhecimento que o plano místico possui.
  - **Anulação Suprema** (Reação): Escolha uma magia sendo conjurada por outra criatura, como uma reação: O efeito é completamente anulado, independente do nível da magia. Se for um efeito constante ou artefato mágico é suprimido por 1 hora. Se for uma criatura invocada ela é banida instantaneamente. O conjurador alvo fica *desorientado* por 1 rodada.
  - **Roubo Arcano** (Reação): Escolha uma magia sendo conjurada por outra criatura, como uma reação: Você canaliza exatamente a mesma magia como uma reação. Escolha novos alvos, intensidade e modulações. Você paga a diferença de Éter se decidir aumentar.

**Receptáculo** — *"Eu sou o portal. A ponte. O Receptáculo Perfeito."*
- **Receptáculo Perfeito** (3 Ações, 5 Stamina, Ultimate) — Você se abre completamente para as forças do outro lado. Por um momento, você não é mais você — você é um canal puro para o primórdio. O poder é avassalador. O custo é real.
  - **Ao ativar:** Você entra em estado de Receptáculo Perfeito por 3 rodadas, a partir da próxima rodada. Perca imediatamente 2d6 de Éter.
  - **Energia Pura:** Todas as suas magias têm intensidade +1. Nova intensidade: *Transbordante+*, adicione +1 dado de efeito além do efeito transbordante.
  - **Canalização Infinita:** Ao conjurar uma magia, conjure outra de graça com intensidade Normal. Você pode conjurar magias mesmo estando *Oco*.
  - **Receptáculo Instável:** Você está no ápice do seu poder e ele é extremamente custoso sobre seu corpo. No início de cada turno, role 1d6: **1-2:** Você perde 1d6 de Éter. **3-6:** Você consegue conter a intensa magia dentro do seu corpo.
  - **O Custo:** Ao decidir finalizar a Ultimate, ou ao fim das 3 rodadas — *caso você esteja Oco:* Role um teste de Vontade (CD 15); em caso de falha você recebe 2d8+5 de dano Primordial. Caso você entre em estado *Morrendo* após receber esse dano, você morre instantaneamente e explode em energia causando 4d10+15 de dano Primordial a todos os alvos em até 9 m. Em caso de sucesso ou não entrar em estado *Morrendo*, você fica com 0 de Éter e *Exausto* até o fim do combate. *Caso contrário:* Você fica *exausto* até o fim do combate.

**Arauto** — *"O Pacto final está selado. Presenciem, meu patrono."*
- **Manifestação do Patrono** (3 Ações, 5 Stamina, Ultimate) — Você invoca uma fração verdadeira do seu patrono, a entidade com quem você firmou um pacto. O mundo treme, enquanto seu patrono se materializa. **Se você não tem Patrono:** Você invoca uma manifestação genérica do primórdio — caótica, poderosa, mas imprevisível (use o patrono Genérico abaixo).
  - **A Grande Árvore** — *A Grande Árvore se manifesta através de você. Raízes colossais irrompem do chão, galhos cobrem o céu, e a seiva dourada inunda a área.* **Área:** 12 m de raio centrado em você. **Duração:** 3 Rodadas. **Efeitos Instantâneos:** Aliados na Área: Imunes a condições mentais; Inimigos na Área: Terreno Difícil; Todos os aliados na área são curados em 3d8 + Mod. Inteligência de Saúde; Todos os aliados na área têm todas as condições removidas (exceto *Oco*); Todos os inimigos na área devem passar em Fortitude CD 18 ou ficam *Enraizados* e *Envenenados*. **Efeitos Contínuos:** Aliados na área regeneram 1d8 de Saúde no início de cada turno; Aliados na área: +2 em todos os testes; Inimigos na área: Terreno difícil, −2 em todos os testes. **O Preço:** Alucinações da Seiva parecem te direcionar para algum lugar, a Árvore clama pela sua presença, retirando seus poderes ao desobedecer as alucinações.
  - **O Trancafiado** — *O Abismo se abre. Por um momento, as correntes que prendem o Trancafiado enfraquecem, e sua fúria transborda para o mundo material.* **Área:** Toda criatura em até 18 m que você possa ver. **Duração:** Instantâneo + 3 rodadas de efeitos contínuos. **Efeitos Instantâneos:** Uma fissura dimensional se abre. Todos os inimigos na área recebem 4d10 + Mod. Inteligência de dano Primordial; Criaturas reduzidas a 0 de Saúde têm suas almas arrastadas para o Abismo (não podem ser ressuscitadas por meios normais); Todas as criaturas (aliados e inimigos) devem passar em Vontade CD 18 ou ficam *Amedrontadas* por 1 rodada. **Efeitos Contínuos:** Escolha 1 criatura em até 18 m: Ela deve passar em Reflexo CD 15 ou fica *Enraizada* pelas correntes do abismo. Criaturas *Enraizadas* pelas correntes recebem 2d6 de dano Primordial por turno. **O Preço:** O Trancafiado te sussurra a localização exata do abismo, você não tem mais desculpas, deve libertá-lo ou perderá seus poderes.
  - **O Limiar** — *O Guardião do Portão se manifesta. Uma figura impossível de luz e sombra surge, e por um momento, as leis da magia são reescritas.* **Área:** 12 m de raio centrado em você. **Duração:** 1 Rodada. **Efeitos Instantâneos:** Todas as magias ativas na área são anuladas instantaneamente, sem exceção; Todas as criaturas invocadas ou conjuradas na área são banidas permanentemente; Nenhuma criatura na área (a não ser você e aliados) pode conjurar magias por 2 rodadas; Escolha até 3 criaturas na área. Cada uma deve passar em Vontade CD 20: *Falha:* A criatura é *Banida* para o espaço entre planos por até 1 minuto. *Falha Crítica:* A criatura é *Banida* permanentemente. **Efeitos Contínuos:** Até o fim do combate, as criaturas escolhidas ao canalizar magias devem suceder em um teste de vontade (CD 20) ou falhar na canalização. **O Preço:** O Limiar exige que você o auxilie em breve, ajudando-o a equilibrar o plano místico. A localização de um portal para o plano místico é sussurrada nos seus ouvidos. Ao negar seu destino, seus poderes vão se esvaindo.
  - **Genérico** — *Para Teurgos sem Patrono definido. O primórdio puro se manifesta — caótico, devastador, imprevisível.* **Área:** 12 m de raio centrado em você. **Duração:** Instantâneo + efeito caótico. **Efeitos Instantâneos:** Explosão de energia primordial: Todas as criaturas na área (exceto você) recebem 4d8 + Mod. Inteligência de dano Primordial, *Fortitude* CD 15 reduz à metade. **Efeito Caótico (1d6):** 1. **Distorção Temporal:** Você ganha 2 ações adicionais neste turno. 2. **Drenagem:** Você recupera Éter igual a metade do dano total causado. 3. **Instabilidade:** A área se torna terreno difícil por 1 minuto (1d6 dano Primordial para quem entrar). 4. **Ressonância:** Sua próxima magia é automaticamente Transbordante sem custo. 5. **Colapso:** Todas as criaturas na área ficam *Cegas* e *Surdas* por 1 rodada. 6. **Tiro no Pé:** O efeito também te atinge — você recebe metade do dano causado, mas recupera toda sua Stamina.

## Segundo o Pedro (2026-09-05)
- **B10:** *"É verdade, essa técnica deveria citar que a regra de não canalização de [[Condições|Oco]] não se aplica, porém só quando canalizando com saúde."* → **Reserva Oculta abre exceção à condição Oco exclusivamente enquanto o Teurgo paga com Saúde (2:1).** Redação a corrigir no Notion.
- **B10 (Tese Arcana):** *"Tese arcana é uma técnica de ramo esquisita, depois eu ajusto."* → o conflito 2 vs 4 Stamina fica **em aberto por decisão do Pedro**.
- **B11:** ramos = **3 Tier 1 · 2 Tier 2 · 1 ultimate Tier 3** (níveis 2/4/5); o "3 por Tier" do Notion está errado.
- **B4:** *"Normalmente, você só pode canalizar 1 magia por turno; o disparo veloz é possivelmente a única magia do sistema que ignora isso."* → limita Encadeamento, Canalização Infinita e Teorema Absoluto na prática de mesa.
- **B8:** *"Eu criarei +20 magias nvl 0 que atuarão como truques que não custam éter pros teurgos nvl 1, que atualmente não têm magias."* → o nível 1 do Teurgo hoje é magro por design conhecido; nível 0 **a criar**.
- **B13:** *"Tabela do notion manda sempre"* — em qualquer divergência entre a tabela de uma magia e sua descrição, vale a tabela ([[Regras de Magia]]).
- **A2 (Velúria):** *"A deusa [[Velúria]] é dona do plano místico, criou o éter e o limiar. […] Teurgos utilizam do éter que é uma substância mágica capaz de romper a barreira do limiar e trazer essa energia para o plano material."*
- **A14 ("forças materializantes"):** *"Essa é a definição antiga para o Limiar e o Éter."* → onde as técnicas dizem "forças materializantes" (Recuperação Primordial, Canalizador Inato), leia-se **[[O Limiar]] + [[Éter]]**. *"Todo ser possui uma certa quantidade de éter em seu corpo… O éter age como uma chave para o plano místico, chamando sempre mais éter do que o que foi gasto… O limiar é uma entidade criada por Velúria para agir como mediador nessa extração… ele não permite que um teurgo sugue excessivamente o plano místico por éter."*
- **B1:** dano **Primordial** = *"energia vazada do Plano Primordial ou o Primórdio, extremamente rara e a mais poderosa, é a substância que constitui a sustentação do universo"* — é o tipo que quase toda técnica de custo do Teurgo usa.
- **B3 (Abissal):** *"o abismo é uma região de Kharavel que aprisiona a figura material do deus da morte [[Osh'Kar]] […] naturalmente as criaturas abissais começaram a se comunicar entre si, e assim veio o idioma abissal"* — contexto de *Linguagem Estranha* e do patrono **O Trancafiado**.
- **B16:** "interação social(Intimidação)" (Porta-Voz) → [[Atributos e Perícias|Intimidação]].

## Relações
- **Pertence a** → [[Sistema]]
- **Recurso central** → [[Éter]] (maior progressão do sistema, +9/nível) · Saúde e Stamina mínimas
- **Escolas** → [[Destruição]] · [[Abjuração]] · [[Alteração]] · [[Conhecimento]] · [[Primordial]] (requer nível 5) — regras em [[Regras de Magia]]
- **Cosmologia** → canaliza do [[Plano Místico]] para o [[Plano Material]] através de [[O Limiar]]; Éter e Limiar são criações de [[Velúria]] (A2); dano Primordial vaza do [[Primórdio]] (B1)
- **Patronos possíveis (Arauto)** → **A Grande Árvore** = [[A Vhelor]] (bebe [[Seiva]]) · **O Trancafiado** = entidade selada em [[O Abismo]] (ver Conflitos) · **O Limiar** = [[O Limiar]]
- **Ramos** → Acadêmico (conhecimento/equilíbrio) · Receptáculo (natureza caótica) · Arauto (rituais/pactos)
- **Perícias iniciais** → Armas Místicas, [[Atributos e Perícias|Místico]], [[Atributos e Perícias|Conhecimento]]; escolhe entre [[Atributos e Perícias|Religião]], [[Atributos e Perícias|Vontade]], [[Atributos e Perícias|Percepção]], [[Atributos e Perícias|Medicina]], [[Atributos e Perícias|Investigação]]
- **Idiomas** → entende [[Abissal]] de forma leiga (Linguagem Estranha)
- **Condições que usa** → [[Condições|Oco]], [[Condições|Exaustão]], [[Condições|Morrendo]], [[Condições|Enraizado]], [[Condições|Envenenamento]], [[Condições|Amedrontado]], [[Condições|Cego]], [[Condições|Surdo]], [[Condições|Desorientado]]
- **NPCs teurgos** → [[Kheyos]] (teurgo mortal, A7) · [[Lorrain Kiriam]] (mãe de [[Sinikko Kiriam (original)]]) · [[Sinikko Kiriam (PJ)]]
- **Raça com afinidade** → [[Gruto]] linhagem Skal'ri (+5 Éter máximo)
- **Economia** → [[Sins]] (preço de Magias Pactuadas e Barganha Primordial) · [[O Bazar]] (Focos)

## Conflitos e pendências
1. **Reserva Oculta × condição *Oco*** — "Ao chegar a 0 de Éter, pode conjurar magias pagando em Saúde" × Oco: "Você não consegue canalizar magias". **Resolvido por B10**: a exceção vale, **mas só ao pagar com Saúde**. Falta escrever isso no Notion. (Digest B §8)
2. **Tese Arcana — 2 ou 4 Stamina?** Cabeçalho "Passiva, 4 Stamina", corpo "escolha entre gastar **2** de Stamina ou não: Ao gastar **4** de Stamina…". Pedro (B10): *"depois eu ajusto"* — **pendência aberta, decisão do Pedro**. (Digest B §7)
3. **Listas de magias conhecidas somam ou substituem?** Nível 1 dá "1+Mod. INT ou SAB magias de nível 1"; Grimório Arcano (T1) dá "3+Mod. INT", Canalizador Inato "2+Mod. SAB", Magias Pactuadas "1+Mod. INT". Pedro respondeu *"Não entendi a última pergunta"* (B10) — **pendência aberta, reformular a pergunta**. (Digest B §20)
4. **"6 Técnicas de Ramo, 3 por Tier"** × Progressão 3/2/1 — resolvido por B11; corrigir no Notion. (Digest B §1)
5. **Quem é O Trancafiado?** O texto diz "algo mais antigo… estava lá antes das almas chegarem" e "odeia os Deuses que o trancaram". Pedro (B3) diz que [[O Abismo]] aprisiona a **figura material de [[Osh'Kar]]**, orquestrada por [[Velúria]] e [[Vytália]]. São a mesma entidade, ou o Trancafiado é uma segunda coisa selada no mesmo lugar? **Pendência aberta (nova).**
6. **Condição *Banida/Banido*** (Manifestação do Patrono — O Limiar) não existe em [[Condições]]; magias.md usa "Vontade ou Banido" 1x, também sem definição. B12 adia a padronização.
7. **Escola Primordial** existe (5 escolas, a 5ª requer nível 5) e o `CLAUDE.md` §2 já foi atualizado; a lista antiga de 4 escolas está obsoleta, não o Notion. (Digest B §19)
8. **Marcas com "+1 permanente"** até +5 × escala canônica de perícia +2/+4/+6/+8; **Devoto** ainda usa contador "cada 3" em vez de "cada 5". (Digest B §21)
9. **Magia Sustentada** — Pedro (B4): *"normalmente está descrito a quantidade de éter que você gasta por turno para continuar canalizando a magia, mas é um pouco old essas definições."* Afeta Ritual e Imbuir Magia. **Pendência aberta.**
10. **"Dano Biológico" sem subtipo** (Seiva Dourada do Grutto) — B1 define Biológicos como Veneno/Ácido/Psíquico; qual deles? **Pendência aberta (nova).**

## Fonte
- Notion: Teurgo `caa6e3a401d98330bae281511750d407` (ed. 2026-08-05, 🟢 Pronto) · Classes `3a66e3a401d9809b8eceec1f30be9fd2`
- Raw: `docs/memoria/notion_raw/classe_teurgo.md`, `classe_index.md`, `magias.md`, `condicoes.md`
- Digest: `docs/memoria/digests/B_classes.md` §4, INCONSISTÊNCIAS 1, 7, 8, 19, 20, 21 · Respostas: A2, A7, A14, B1, B3, B4, B8, B10, B11, B12, B13, B16
