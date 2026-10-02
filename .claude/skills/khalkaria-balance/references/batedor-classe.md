# Batedor — a classe inteira (cópia de auditoria)

Esta é a classe como ela vai para o Notion, pronta para o Pedro auditar. O porquê de cada escolha, os números e o histórico estão no `18-batedor-rework.md`.

**Origem:** `[Pedro]` texto dele · `[Pedro, ajustado]` texto dele com mudança · `[nova]` criação minha, precisa de aceite.

**Estado (2026-10-02):** cabeçalho, características e técnicas gerais estão fechados e no Notion. Os ramos são proposta.

---

## Em auditoria

**Mudou nesta rodada (Cartógrafo, textos do Pedro):** Colecionador de Horizontes, Cicatrizes da Jornada, Região Ideal (ex-Terreno Ideal) e Arte (ex-Legenda). A Arte absorveu o Artista Apaixonado.

**Para decidir:**
1. **Mapa Tático, refeito.** Agora serve a quem já tem mapa: dá uma legenda de combate ao grupo. Sem mapa, o rascunho também cria a área. Alternativa: +1 de Evasão para o grupo, no lugar da perícia.
2. **Região Ideal, +2 em Atacar.** Somado ao Estudo de Campo, dá +4. O Batedor preparado vai de 16,1 para 18,1 de dano por turno (+12%), e o Ladrão escondido de 24,8 para 28,3. Proposta: "não soma com o Estudo de Campo".
3. **Cicatrizes da Jornada:** rolar de novo altera o d20, e você reservou isso ao Xamã (2026-09-28). Aqui é 1x/descanso longo e só em Sobrevivência. Confirma a exceção?
4. **T2 do Cartógrafo:** a vaga do Artista Apaixonado ficou livre. Proposta: o seu Escapista, com a CD 15 trocada por uma disputa.
5. **"Região" no Rasgar o Mapa:** com Região Ideal e Colecionador falando de regiões de Kharavel, *"dessa região"* pode ser lida como a região inteira. Sugestão: "desse lugar".
6. **As 9 regiões:** o CSV conhece 8 (Cinturão Silencioso, Terras Livres, Emaranhado de Raízes, Cordilheira Cristalina, Costas Rochosas, Deserto do Abismo, Bosque Corrompido e Ermo das Cinzas). Qual é a 9ª?
7. **Ladrão e Pecador:** continuam como na rodada 5, com as perguntas 5 a 11 do `18` §5.4.

---

## Cabeçalho `[Pedro]`

**Status iniciais**
- Saúde: `10 + (3 × Nível) + (Mod.CON × Nível)`
- Stamina: `8 + (8 × Nível) + (Mod.FOR OU Mod.DES × Nível)`
- Éter: `6 + (4 × Nível) + (Mod.INT OU Mod.SAB × Nível)`
- Evasão Ativa (Reação): 10 + Mod. Destreza + Dado de Defender
- Evasão Passiva (Sem reação): 10 + Mod. Destreza

**Treinamento:** Armas à Distância, Sobrevivência e Percepção. Além disso, (1 + Mod. Inteligência) perícias dentre: Iniciativa, Furtividade, Atacar, Investigação, Religião, Crime e Reflexos.

**Atributos Recomendados:** Destreza, Sabedoria e Inteligência. **Play Style:** Exploração, Combate Estratégico e Mobilidade. **CD:** 10 + Mod. Destreza + (Mod. Sabedoria ou Inteligência).

---

## Características de classe `[Pedro]`

**Mapa.** Em 1 minuto, gastando 5 Stamina, a partir dos seus arredores, você ilustra um mapa da área, contendo tipo de terreno, hostilidades do local e informações gerais sobre a área em até 1000 m² (cerca de duas quadras de tênis: um quadrado de ~32 m de lado, ou 21 × 21 quadrados de 1,5 m).
- Enquanto na área de um mapa fabricado por você:
  - Você e aliados a até 9 m não podem ficar *Desprevenidos*.
  - Você tem vantagem em *Iniciativa*.
- A cada mapa desenhado, nomeie-o com o nome do local e adicione 1 item: Mapa no inventário.
- Venda: 1x/área. Partes de um mesmo lugar (bairros de uma cidade, trechos de uma floresta) contam como o mesmo lugar.

**Pontapé (3 Stamina, Ação Livre).** No seu turno, enquanto estiver na área de um mapa seu, você se move até o seu Movimento sem provocar ataques de oportunidade e tem +2 de Evasão até o início do seu próximo turno. Depois de utilizar o Pontapé, a sua PMA volta a zero. 1x/rodada.

---

## Técnicas gerais (15) `[Pedro]`

| Técnica | Descrição | Custo | Ação |
|---|---|---|---|
| Desbravador | Você possui a habilidade de memorizar caminhos e traçar trajetos eficientes. Você soma naturalmente +1 ao sucesso do grupo em jornadas já percorridas. Adicionalmente, ao rolar *Sobrevivência* em jornadas possui +5. | — | Passiva |
| Surpresa! | Na área de um mapa seu, na primeira rodada do combate, criaturas que ainda não agiram contam como *Desprevenidas* contra os seus ataques. | — | Passiva |
| Varredura | Uma vez por turno, o seu primeiro acerto contra uma criatura na área representada no seu mapa causa +1d6 de dano. Na área de um mapa seu, criaturas escondidas a até 9 m que se moverem deixam de estar escondidas para você. | — | Passiva |
| Bote | Depois de um Pontapé, o seu próximo ataque tem +1 Margem de Ameaça; se o ataque for corpo a corpo, ele não pode ser retaliado. | — | Passiva |
| Estudo de Campo | Ao criar um mapa, você pode escolher levar 10 minutos (ao invés de 1 minuto) para estudar o campo. Enquanto na área desse mapa, você tem +2 em Atacar e ignora terreno difícil. | — | Passiva |
| Armadilha Tática | Rapidamente configura uma armadilha no chão, rolando um teste de *Furtividade* ou *Sobrevivência* e atribuindo o resultado a ela. Quando um inimigo de tamanho Médio ou menor passar por cima ele deve superar a *Furtividade* ou *Sobrevivência* da armadilha rolando *Percepção* ou recebe (Nível + 1)d6 + Mod. Destreza de dano Perfurante e fica *Enraizado* por 1 rodada. Criaturas Grandes ou maiores recebem o dano, mas não ficam *Enraizadas*. Na área de um mapa seu, você pode montá-la em qualquer ponto pelo qual passou com o Pontapé neste turno, e a *Percepção* contra ela tem desvantagem. Você mantém até (Nível) armadilhas montadas; ao montar mais uma, a mais antiga se desfaz. | 3 Stamina | 1 Ação |
| Sabotar Terreno | Na área de um mapa seu, você afrouxa pedras, derrama água, álcool ou espalha cascalho num ponto que conhece: um quadrado de 4,5 m de lado a até 9 m de você vira Terreno Difícil, Escorregadio, Em Chamas ou Molhado (*Superfícies*) até o fim do combate. Os testes dessas superfícies são contra sua CD, no lugar da CD 15. Você mantém até (Nível) áreas assim. | 5 Stamina | 2 Ações |
| Por Aqui! | Na área de um mapa seu, escolha uma criatura a até 18 m que possa te ver ou ouvir. Ela faz *Vontade* contra sua CD; se falhar, no próximo turno dela, ela utiliza 1 ação de movimento para se locomover em linha reta em direção a você. Enquanto se move até você, ela falha automaticamente nos testes da Armadilha Tática e do Sabotar Terreno. | 3 Stamina | 1 Ação |
| Ocultar-se | Ao estar fora da linha de visão de todas as criaturas da cena, pode se esconder com 1 ação em vez de 3. | 2 Stamina | 1 Ação |
| Rasteira | Durante o Pontapé, ao passar a até 1,5 m de uma criatura de tamanho igual ou menor que o seu, role *Movimento* contra o *Movimento* dela: se vencer, ela recebe (Nível)d4 de dano Contundente e fica *Caída*. | 3 Stamina | Ação Livre |
| Rasgar o Mapa | Rasgue o mapa da área em que você está: até o fim do combate, o seu Pontapé não custa Stamina, pode ser utilizado 2x/Turno e, durante esse combate, você pode utilizar as técnicas que exigem que você esteja na área do mapa. O mapa é destruído e sai do inventário. Traumas de batalha não te permitem desenhar o mapa dessa região novamente. | 1 Mapa | 1 Ação |
| Rolamento | Na área de um mapa seu, ao ser alvo de um ataque, some +1 à sua Evasão contra esse ataque para cada 2 Stamina gastos (máximo = Nível). | 2+ Stamina | Ação Livre |
| Fantasma | Ao realizar testes de *Crime*, *Furtividade* ou *Defender*, pode gastar 2 de Stamina para adicionar +1 na perícia, com limite máximo no aumento da perícia igual ao seu nível. | 2+ Stamina | Ação Livre |
| Margem de Segurança | Na área de um mapa seu, quando uma criatura hostil terminar um movimento a até 1,5 m de você, você pode se mover até 3 m sem provocar ataques de oportunidade. | 2 Stamina | Reação |
| Emboscada | Pode preparar um local previamente com armadilhas e distrações rolando um teste de *Sobrevivência* ou *Furtividade*: Ao lutar em um ambiente preparado, se o inimigo falhar em um teste de *Percepção* contra seu teste, você e seus aliados recebem +2 em Atacar durante todo o combate e os inimigos ficam *Desprevenidos* na primeira rodada do combate. | 5 Stamina | 10 Minutos |

---

## Ramos `[Pedro]`

Os ramos são caminhos, características únicas do seu personagem, diferente das técnicas, são irreversíveis. Você possui **Marcas de Ramo**, que construiu ao longo da sua vida, moldando sua PERSONALIDADE. Você possui **Técnicas de Ramo**, que aprendeu ao longo do seu treinamento definindo seu ESTILO DE AGIR. É extremamente aceitável que você misture os 3 ramos.

Ao longo da criação do seu personagem você escolherá: 3 Marcas · 6 Técnicas de Ramo: 3 no Tier 1 (nível 2), 2 no Tier 2 (nível 4) e 1 Ultimate no Tier 3 (nível 5).

**Tier 3:** O Tier 3 provê ultimates, que só podem ser utilizadas 1 vez por descanso longo. `[Pedro, ajustado: era "1 vez por dia"]`

---

## 🔵 Cartógrafo (Exploração e Sobrevivência)

*Estar em um local desconhecido é o que te cativa e mapeá-lo é como você expressa sua arte. Você vive pela emoção de descobrir coisas novas e suas aventuras te trouxeram ensinamentos de sobrevivência valiosos.*

### Marcas

**Colecionador de Horizontes** `[Pedro]`
> *"Cada paisagem nova te renova por dentro e relembra sua aspiração."*

Você anseia por novos lugares e busca ativamente explorar o desconhecido.
- Ao desenhar um mapa pela primeira vez numa região de Kharavel, após escolher essa marca, recupere 4d6 + (Mod. Int ou Mod. Sab) de Stamina e receba +1d4 de Stamina máxima.

**Cicatrizes da Jornada** `[Pedro]`
> *"Cada ferida conta uma história. Cada história te ensinou a sobreviver."*

Você possui cicatrizes que reforçam suas histórias de viagem.
- Para cada Jornada de Hostilidade 10+ que você completou, ganha +1 permanente em Sobrevivência. Ao chegar em +5, essa habilidade fica supérflua.
- Ao falhar em Sobrevivência, você pode gastar 5 de Stamina para rolar a perícia novamente. 1x/descanso longo.

### Tier 1

**Região Ideal** (Passiva) `[Pedro]`
- Você se torna Treinado em *Sobrevivência*. Se já for Treinado, se torna Experiente e assim por diante.
- Você tem facilidade em se adaptar às regiões que desenhou: uma região de Kharavel vira seu terreno ideal enquanto você tiver os mapas de 3 lugares diferentes significativos dela. No seu terreno ideal, você tem +2 em *Atacar*, *Percepção*, *Investigação*, *Furtividade* e *Movimento*.

**Mapa Tático** (1 Ação, 3 Stamina) `[nova, refeita a pedido do Pedro]`
Em combate, você rabisca as posições da luta e escreve no mapa uma legenda de combate: escolha 1 perícia entre *Defender*, *Reflexos*, *Fortitude* e *Vontade*. Até o fim do combate, na área de um mapa seu, você e aliados a até 9 m de você têm +1 nessa perícia (+2 a partir do nível 4). Se você não estiver na área de um mapa seu, o rascunho cria uma: um quadrado de 18 m de lado centrado em você conta como a área de um mapa seu até o fim do combate. O rascunho não vira o item Mapa e não conta como mapa desenhado (Região Ideal, Colecionador de Horizontes).

**Arte** (Passiva) `[Pedro]`
Ao desenhar um mapa ou um mapa tático: escolha 1 perícia entre *Percepção*, *Investigação*, *Iniciativa*, *Furtividade* e *Movimento*. Na área desse mapa, você e aliados a até 9 m de você têm +1 nessa perícia (+2 a partir do nível 4). Mapas diferentes não se somam. Adicionalmente, no nível 4, os seus mapas são de 1 raridade acima.

### Tier 2

**Mapa de Combate** (Passiva) `[Pedro, ajustado]`
Seus mapas também são mapas de combate. Na área de um mapa seu:
- Você mantém até (2 × Nível) Armadilhas Táticas e até (2 × Nível) áreas do Sabotar Terreno.
- Pode usar *Coordenação* (Reação, 3 Stamina): orienta você ou um aliado em até 9 metros que esteja prestes a rolar um teste de *Movimento*, *Defender* ou *Atacar*, somando +2 à rolagem.

**Escapista** (3 Ações, 5 Stamina) `[Pedro, ajustado]`
Você nunca foi acostumado a batalhar, na verdade planejar uma rota de fuga é sua especialidade. Na área de um mapa seu, pode fugir e guiar outros a fugirem do combate sem uma cena de perseguição ao vencer um teste de *Sobrevivência* contra a maior *Percepção* entre os inimigos.

### Tier 3

> *"Minha arte, pode descobrir todos os segredos."*

Requisito: deve ter ao menos Cartógrafo Tier 1 ou 2.

**Senhor das Linhas** (1 Ação, 5 Stamina, Ultimate) `[Pedro, ajustado]`
Você sente uma energia primordial emanar de sua caneta ao guiá-la por um papel, suas movimentações revelam informações extraordinárias. Você não sabe de onde vem esse poder, mas utiliza-o como se fosse seu. Você acaba de desenhar uma obra-prima, um mapa com informações impossíveis de compreender, mas você entende tudo, perfeitamente:
- **Onisciência:** Você sente um calafrio, quase que sobrenatural:
  - Sua mão é guiada pelo mapa por uma força maior expondo a posição de todas as criaturas em até 60 metros. Você conhece a localização de todas as criaturas em até 60 metros, incluindo criaturas invisíveis, escondidas…
  - Você sabe a intenção de movimento/ataque de cada criatura em um raio de 60 metros.
- **Comandante de Campo:** Essa energia te faz raciocinar extremamente rápido, nesse estado, você consegue identificar estratégias e movimentações que outros não conseguem:
  - "Ali!" (1 Ação): Um aliado em até 12 m pode se mover até 6 m como reação, sem ataques de oportunidade.
  - "Abaixa" (1 Ação): Um aliado em até 12 m ganha +4 Evasão contra o próximo ataque que receber.
  - "Agora!" (2 Ações): Todos os aliados em até 12 m ganham +2 Atacar e +1d6 no próximo ataque.
- **Manipular Mapa:** Esse mapa parece ter influência real em seus arredores, e você sente que consegue controlá-lo. Ao usar qualquer uma das seguintes habilidades, faça um teste de *Vontade* (CD 15); ao falhar, você perde 1d6 de Éter:
  - Criar Armadilha (1 Ação): Declare um ponto em até 12 m de você; a primeira criatura que pisar recebe **(Nível + 1)d6 + Mod. Destreza** de dano e deve passar em um teste de Movimento **contra sua CD** ou fica *Enraizada* por 1 rodada.
  - Tremor Localizado (1 Ação): Todos os inimigos em até 9 m de você sentem o chão tremer; eles devem passar em um teste de Movimento **contra sua CD** ou ficam *Desorientados*.
  - Fuga Instantânea (3 Ações): Você descobre uma rota de fuga perfeita; se ela não existir, o seu mapa esculpe um caminho à força para que você e seus aliados consigam fugir da batalha.
- **O Custo:**
  - Ao fim do combate, sua ultimate cessa e seu mapa da região utilizada é desintegrado, virando pó rapidamente.
  - Perca 2d6 de Éter.
  - Você sente que roubou magia, de onde não devia.

*Ajustes:* saiu "Não pode ser flanqueado" (o sistema não tem regra de flanco); em negrito, o dano da Criar Armadilha (era 3d6) e as CDs.

---

## 🔴 Ladrão (Furtividade e Assassinato)

*Ninguém lembra do seu rosto e é assim como você prefere. O capuz caiu sobre sua cabeça pela primeira vez para se proteger do sol, mas, com o tempo, tornou-se algo maior: um abrigo, um disfarce, uma segunda pele.*

### Marcas

**Coleção de Últimos Suspiros** `[Pedro]`
> *"Você se lembra de cada um. Não dos rostos - dos sons que fizeram ao partir."*

Você sente prazer em assassinar criaturas sem que elas te reconheçam.
- Para cada 5 criaturas que você matou enquanto estava *Escondido*, ganha +1 permanente em Furtividade. Ao chegar em +5, essa habilidade fica supérflua.
- Ao matar uma criatura sem ser detectado, recupera 1 de Stamina.

**Sussurro Final** `[Pedro]`
> *"O sussurro final é sempre o mais verdadeiro."*

Você sabe interrogar pessoas como ninguém.
- Você fica treinado em Convencimento.
- Ao matar uma criatura em combate corpo a corpo, pode fazer uma pergunta que ela responde com verdade antes de morrer. A resposta é breve (uma frase) e literal.

### Tier 1

**Ataque Furtivo** (Passiva) `[nova]`
- Você se torna Treinado em *Furtividade* ou em *Crime*, à sua escolha. Se já for Treinado, se torna Experiente e assim por diante.
- Quando você ataca uma criatura que não te percebeu, ou que está *Desprevenida*, até o fim do seu turno ela não pode reagir aos seus ataques, e cada acerto seu contra ela causa +1d6 de dano.

**Sumir** (Ação Livre, 2 Stamina) `[nova]`
Depois do seu último ataque do turno, se uma criatura que você atacou neste turno estiver *Desorientada* ou *Caída*, ou tiver caído a 0 de Saúde, você pode se esconder sem gastar ações, mesmo no campo de visão de criaturas cientes de você: role *Furtividade* contra a *Percepção* de cada criatura que te vê.

**Mão Leve** (1 Ação, 2 Stamina) `[nova]`
Escolha uma criatura a até 1,5 m e role *Crime* contra a *Percepção* dela. Se vencer, escolha um: desarmá-la, como a manobra Desarmar, e ficar com a arma; ou pegar 1 consumível que ela carregue (poção, munição, veneno). Se ela não te percebeu, você continua escondido dela.

### Tier 2

**Cobra** (Descanso Curto ou 1 Ação, 2 Stamina) `[Pedro, ajustado]`
Pode criar venenos potentes e imbuí-los nas suas armas. Você pode criar até 2 venenos por descanso curto e 5 venenos por descanso longo, gastando 5 Sins por veneno. Você pode adicionar o veneno a uma arma ou munição com 1 ação; **o veneno dura até o primeiro acerto**. A criatura que entrar em contato com o veneno deve suceder em um teste de Fortitude **contra sua CD** ou ficar com ***Envenenamento***.

**Arapuca** (Passiva) `[nova]`
Uma criatura *Enraizada* por uma Armadilha Tática sua conta, para o seu Ataque Furtivo, como se não tivesse te percebido.

### Tier 3

> *"Eles morrerão antes de entender o que você é."*

**Silêncio** (1 Ação, 5 Stamina, Ultimate) `[Pedro, ajustado]`
**Até o fim do combate**, escolha uma criatura em sua visão por rodada; ela recebe *Marcada à Morte 1*. Essa condição soma ao ser aplicada novamente, ficando *Marcada à Morte 2*, por exemplo:
- Você sabe a localização de todas as criaturas marcadas por você e a saúde exata delas.
- Você tem +1 em todos os testes contra uma criatura *Marcada à Morte*. Acumulável, ou seja, *Marcada à Morte 2* te fornece +2 em todos os testes.
- Seus ataques ignoram 1 de Evasão contra criaturas *Marcadas à Morte*. Acumulável, ou seja, *Marcada à Morte 2* te faz ignorar 2 de Evasão.
- Você tem +1 dado de dano ao critar contra uma criatura *Marcada à Morte*. Acumulável, ou seja, *Marcada à Morte 2* te dá +2 dados.
- Alvos marcados ficam *Expostos*, porém ainda remove a condição ao atacar.
- Ao acertar um ataque furtivo, o ataque automaticamente é crítico.
- **O Custo:**
  - Você não pode critar contra alvos não marcados.
  - Você fica obcecado por todos os seus alvos marcados e, para desistir de matá-los, deve fazer um teste de *Vontade* (CD 20) para se controlar.
  - Você perde 1d6 de Éter.

---

## 🟢 Pecador (Dinheiro e Interação Social)

*Viajar o mundo custa caro e você faz questão de pagar esse preço. Ao longo de suas aventuras você sempre esteve de olho em bugigangas compráveis, a lábia de comerciante, veio naturalmente após isso.*

### Marcas

**Homem de Negócios** `[Pedro]`
> *"Moedas acabam. Favores rendem juros eternos."*

Você possui um disturbio de mat… `[frase cortada no Notion: completar]`
- Para cada 5 negociações bem-sucedidas que resultaram em vantagem significativa, ganha +1 permanente em Convencimento. Ao chegar em +5, essa habilidade fica supérflua.
- Ao ajudar alguém de forma significativa, pode declarar que a pessoa "te deve uma". O mestre registra. Você pode cobrar depois.

**Viciado em Khan** `[nova, no lugar do O Palpite]`
> *"A casa sempre ganha. E você sempre é a casa."*

Você não resiste a uma mesa de apostas.
- Em mesas de Khan Sins, você tem vantagem no teste de *Crime* para roubar, e a mesa tem desvantagem para te roubar.
- Ao ser desafiado para uma aposta, faça *Vontade* (CD 15) ou aceite.

### Tier 1

**Bolso Cheio** (Passiva) `[nova]`
- Você se torna Treinado em *Enganação* ou em *Convencimento*, à sua escolha. Se já for Treinado, se torna Experiente e assim por diante.
- O dinheiro fala por você. Com 50 Sins ou mais no bolso, você tem +1 em *Convencimento*, *Enganação* e no dano de cada acerto; com 200 ou mais, +2; com 700 ou mais, +3.
- Ao cair a 0 de Saúde, metade dos seus Sins se espalha pelo chão a até 1,5 m de você. Qualquer criatura pode recolhê-los com 1 ação.

**Molhar a Mão** (Ação Livre, 2 Stamina) `[nova]`
Antes de rolar *Convencimento*, *Enganação* ou *Crime*, entregue (10 × Nível) Sins à criatura do teste, ou a quem testemunharia o seu crime: você rola com vantagem. As moedas ficam com quem as recebeu.

**Olho no Lance** (Passiva) `[Pedro, ajustado]`
- Você sabe o valor de qualquer item ao examiná-lo.
- Você pode gastar 2 de Stamina para rolar com um treinamento a mais os testes de Khan Sins (a perícia da mesa, ou *Crime* para roubar) e os de *Investigação* ao vasculhar um lugar atrás de itens de valor.

### Tier 2

**Isca de Ouro** (1 Ação, 3 Stamina) `[nova]`
Arremesse até (10 × Nível) Sins aos pés de uma criatura a até 9 m que dê valor a dinheiro. Ela faz *Vontade* contra sua CD. Se falhar, recolhe as moedas e fica *Desprevenida* até o início do próximo turno dela. Se resistir, as moedas ficam no chão. A criatura que recolheu seus Sins fica em dívida com você: quando um ataque seu a deixar com Saúde igual ou menor que metade dos Sins que ela recolheu, ela cai a 0. As moedas continuam com ela; saqueie-a para recuperá-las.

**Preço da Vida** (Reação, 3 Stamina) `[nova]`
Quando o ataque de uma criatura que dê valor a dinheiro for te reduzir a 0 de Saúde, ofereça a ela (20 × Nível) Sins. Ela faz *Vontade* contra sua CD. Se falhar, aceita: você fica com 1 de Saúde, e as moedas ficam com ela. 1x/descanso longo.

### Tier 3

> *"Todo mundo tem um preço."*

**Suborno Irrecusável** (2 Ações, 5 Stamina, Ultimate) `[Pedro, ajustado]`
*"Vamos ser razoáveis aqui. Quanto vai custar pra você olhar pro outro lado?"*
- Escolha uma criatura inteligente que possa te entender e que não seja diretamente leal a algo maior que dinheiro (fanatismo religioso, amor verdadeiro, honra inabalável). **Ofereça (20 × Nível) Sins à criatura; as moedas ficam com ela.** Role *Convencimento* com +5 vs *Vontade* do alvo:
  - Falha Crítica: O alvo fica enfurecido com a tentativa. +2 Atacar contra você até o fim do combate.
  - Falha: O alvo hesita, ficando *Atordoado* por 1 rodada enquanto considera a proposta.
  - Sucesso: O alvo muda de lado até o fim do combate/cena.
  - Sucesso Crítico: O alvo muda de lado permanentemente (ou até você traí-lo). Ele luta por você, fornece informações, abre portas…
- **O Custo:**
  - Se perceber que foi manipulada, a criatura tenta te atacar.
  - Perca 1d6 de Éter.
