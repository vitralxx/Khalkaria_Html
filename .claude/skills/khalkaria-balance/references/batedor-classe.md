# Batedor — a classe inteira (cópia de auditoria)

Esta é a classe como ela vai para o Notion, pronta para o Pedro auditar. O porquê de cada escolha, os números e o histórico estão no `18-batedor-rework.md`.

**Origem:** `[Pedro]` texto dele · `[Pedro, ajustado]` texto dele com mudança · `[nova]` criação minha, precisa de aceite.

**Estado (2026-10-14):** cabeçalho, características e técnicas gerais estão fechados e no Notion. Os ramos são proposta. As marcas e o Tier 1 têm os textos do Pedro, e o Tier 2 está em revisão. As ultimates ficam por último.

---

## Em auditoria

**Mudou nesta rodada (textos seus):**
- **Mapa Estratégico:** só perícia em que você seja ao menos Treinado.
- **Cleptomaníaco:** a vantagem para furtar passa a ser 1x/descanso longo.
- **Ataque Furtivo:** "dano adicional". Isso resolve o "ao acertar".
- **Tier 2 do Ladrão:** Cobra e Marca da Morte.
- **Tier 2 do Pecador:** Comprar Dor e Comprar Proteção.

**Proposto por mim (Cartógrafo):**
- **Acampamento** no lugar do Campo Minado. Funciona sozinho.
- **Tier 2:** 4 candidatas novas (A–D). As opiniões e os números estão na resposta da rodada (`18` §5.0c).

**Para decidir:** veja a resposta da rodada (`18` §5.0c). Os tetos sugeridos são:
- Comprar Dor: 25 × Nível Sins;
- Comprar Proteção: 12 × Nível Sins;
- Bolso Cheio e Pecar: teto de +Nível.

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

**Cartografia** (Passiva) `[Pedro]`
- Você se torna Treinado em *Sobrevivência*. Se já for Treinado, se torna Experiente e assim por diante.
- Ao desenhar um mapa de uma região inédita, você recebe uma quantidade de dados igual ao seu nível (d6 no nível 1, d8 no nível 3 e d10 no nível 5), que você pode adicionar em qualquer rolagem de perícia como ação livre enquanto estiver na área do mapa.

**Mapa Estratégico** (1 Ação, 3 Stamina) `[Pedro]`
Você pode gastar 1 ação e 3 de Stamina para desenhar um Mapa Estratégico; ao fazer isso, escolha uma perícia em que você seja ao menos Treinado. O mapa vira um item consumível que pode ser utilizado como ação livre para adicionar +2 (+4 no nível 3 e +6 no nível 5) na perícia escolhida quando uma criatura rolar ela.

**Acampamento** (Passiva) `[nova, no lugar do Campo Minado]`
Ao descansar na área de um mapa seu, você escolhe o melhor lugar: o descanso longo do grupo sobe 1 nível de comodidade (máximo Luxuoso), e o descanso curto recupera 3d6 em vez de 2d6.

### Tier 2 (em escolha: 2 de 4, refeitas)

**A. Orientação** (Reação, 3 Stamina) `[nova]`
Na área de um mapa seu, quando você ou um aliado a até 9 m for rolar uma perícia, some 1d6 à rolagem (1d8 a partir do nível 5).

**B. Rota Segura** (Passiva) `[nova]`
Na área de um mapa seu, você e aliados a até 9 m de você não provocam ataques de oportunidade ao usar a ação de Mover.

**C. Passo em Falso** (1 Ação, 4 Stamina) `[nova]`
Na área de um mapa seu, escolha uma criatura a até 18 m. Ela faz *Reflexos* contra sua CD; se falhar, pisa onde você sabia que o chão cedia e fica *Desprevenida* até o início do seu próximo turno.

**D. Vanguarda** (Passiva) `[nova]`
Num combate que começa na área de um mapa seu, você e aliados a até 9 m de você rolam *Iniciativa* com vantagem e têm +3 m de Movimento na primeira rodada.

### Tier 3 (por último)

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

**Cruel** `[Pedro]` (ex-Coleção de Últimos Suspiros)
> *"Você se lembra de cada um. Não dos rostos - dos sons que fizeram ao partir."*

Você sente prazer em assassinar criaturas sem que elas te reconheçam.
- Para cada 5 criaturas que você matou enquanto estava *Escondido*, ganha +1 permanente em Furtividade. Ao chegar em +5, essa habilidade fica supérflua.
- Ao atacar uma criatura *Exposta*, adicione *Sangramento 1* a ela.

**Cleptomaníaco** `[Pedro]` (ex-Sussurro Final)
> *"Você deseja obter as coisas mais proibidas, esse impulso sombrio te faz furtar recorrentemente."*

Você pratica furtos de vez em quando.
- Você se torna Treinado em *Crime*. Se já for Treinado, se torna Experiente e assim por diante.
- Você tem vantagem ao realizar uma rolagem de *Crime* para furtar alguém. 1x/descanso longo.

### Tier 1

**Ataque Furtivo** (Passiva) `[Pedro]`
- Você se torna Treinado em *Furtividade*. Se já for Treinado, se torna Experiente e assim por diante.
- Ao atacar uma criatura *Desprevenida*, ela recebe 2d6 de dano adicional (4d6 no nível 3 e 6d6 no nível 5) e perde a reação.

**Assassinato** (Reação, 3 Stamina) `[Pedro]`
Imediatamente após deixar uma criatura com 0 de Saúde, você pode gastar sua reação para mover-se até seu Movimento e rolar um teste de *Furtividade* para esconder-se.

**Mão Leve** (1 Ação, 3 Stamina) `[Pedro]`
Você pode realizar um teste de *Crime* contra a *Percepção* de uma criatura a até 1,5 m e roubar até 2d12 Sins dela. No entanto, você não gera Sins caso a criatura não os tenha: você só pode roubar de criaturas que tenham Sins.

### Tier 2 `[Pedro]`

**Cobra** (1 Ação, 5 Stamina) `[Pedro]`
Você sempre guarda algum veneno em seus bolsos: rapidamente, você pode imbuir sua arma equipada com 1 Ação e 5 Stamina, mesmo sem venenos no seu inventário. Arma: +1d6 Veneno por 3 ataques. Fortitude ou *Envenenamento*.

**Marca da Morte** (Passiva) `[Pedro]`
Quando envenenada, sua presa raramente escapa de você. Ao atacar uma criatura com a condição *Envenenamento*, você tem +3 Margem de Ameaça no ataque.

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
> *"A quantidade de Sins nos seus bolsos alivia seus pecados."*

Você possui um distúrbio de acúmulo de dinheiro, Sins nunca são demais.
- Para cada milhar de Sins que você possui no seu inventário, você ganha +1 permanente em *Convencimento*. Ao chegar em +5, essa habilidade fica supérflua.
- Você consegue vender qualquer categoria de item para qualquer tipo de comerciante.

**Viciado em Khan** `[nova, aceita]`
> *"A casa sempre ganha. E você sempre é a casa."*

Você não resiste a uma mesa de apostas.
- Em mesas de Khan Sins, você tem vantagem no teste de *Crime* para roubar, e a mesa tem desvantagem para te roubar.
- Ao ser desafiado para uma aposta, faça *Vontade* (CD 15) ou aceite.

### Tier 1

**Bolso Cheio** (Passiva) `[Pedro]`
- Você se torna Treinado em *Convencimento*. Se já for Treinado, se torna Experiente e assim por diante.
- O dinheiro fala por você. A cada 250 Sins no bolso, você tem +1 em *Convencimento*, *Enganação*, *Intimidação*, *Intuição*, *Motivar* e no dano de cada acerto seu.
- Ao cair a 0 de Saúde, metade dos seus Sins se espalha pelo chão a até 1,5 m de você, causando dano de Força equivalente à quantidade de Sins derrubada. Qualquer criatura pode recolhê-los com 1 ação.

**Pecar** (Ação Livre, 2 Stamina) `[Pedro]`
Antes de rolar qualquer perícia treinada, receba +1 a cada (10 × Nível) Sins consumidos. As moedas são dissipadas do Plano Material.

**Pechincha** (Passiva) `[Pedro]`
Os Mapas que você desenha valem 1 raridade acima. Adicionalmente, você recupera metade dos Sins ao subir um comerciante de nível.

### Tier 2 `[Pedro]`

**Comprar Dor** (Ação Livre, 3 Stamina) `[Pedro]`
Ao acertar um ataque, como ação livre, consuma até (50 × Nível) Sins para causar 1 de dano de Força a cada 5 Sins gastos.

**Comprar Proteção** (Reação, 5 Stamina) `[Pedro]`
Ao estar prestes a receber dano de qualquer tipo, como reação, consuma até (20 × Nível) Sins para bloquear 1 ponto de dano a cada 3 Sins gastos.

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
