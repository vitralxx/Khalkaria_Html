# Batedor — a classe inteira (cópia de auditoria)

Esta é a classe como ela vai para o Notion, pronta para o Pedro auditar. O porquê de cada escolha, os números e o histórico estão no `18-batedor-rework.md`.

**Origem:** `[Pedro]` texto dele · `[Pedro, ajustado]` texto dele com mudança · `[nova]` criação minha, precisa de aceite.

**Estado (2026-10-09):** cabeçalho, características e técnicas gerais estão fechados e no Notion. Os ramos são proposta; marcas e Tier 1 estão com os textos do Pedro, e agora o foco é o Tier 2 dos três. As ultimates ficam por último.

---

## Em auditoria

**Mudou nesta rodada:**
- **Pechincha** (seu texto) entra no lugar do Atravessador: o mapa vale 1 raridade acima, e você recupera metade dos Sins ao subir um comerciante de nível. Subir do nível 1 para o 2 passa a custar 125 Sins líquidos. Para empatar com a margem ganha, bastam ~780 Sins de loot vendido, metade dos ~1.560 de antes.

**Tier 2: 4 candidatas por ramo, escolha 2.** Os números são do nível 4, com arma leve (2d6 + 4) e Ataque Furtivo de 4d6, 1x/turno. O turno-base, sem nada, dá 12,6 de dano.

*Cartógrafo* (recomendo A + C)
- **A. Gatilho Remoto:**
  - armadilheiro; casa com o Campo Minado, que monta as armadilhas de graça;
  - cada disparo dá ~15–18 de dano esperado ((4 + 1)d6 + DES ≈ 21,5, vencendo a Percepção em ~70–85%), mais *Enraizado*, pela reação e 3 Stamina;
  - vertente Ladrão: o *Enraizado* liga a Arapuca.
- **B. Esconderijos:**
  - o grupo se esconde em combate, e cada ataque escondido é crítico no 1º acerto, sem reação do alvo;
  - vertente Ladrão: esconder-se deixa o alvo *Desprevenido*, o que liga o Ataque Furtivo.
- **C. Guia de Campo:**
  - leva a Cartografia ao grupo, que é o seu "pra party através dos mapas";
  - no nível 4, são 4d8 por lugar novo, agora para todos;
  - estende uma regra que já existe (lição 22).
- **D. Território Hostil:** estrategista. A Rasteira passa de ~50% para ~60%, e o Escorregadio pega mais. O custo de mesa é o mestre aplicar −2 aos inimigos na área.

*Ladrão* (recomendo A + C)
- **A. Finta:**
  - é a sua Finta, agora dando *Desprevenido* em vez de *Desorientado*;
  - liga o Ataque Furtivo sem se esconder: 17,9 de dano por turno, contra 12,6 (55% de vencer a disputa);
  - é a peça do Ladrão de corpo a corpo.
- **B. Sigiloso:**
  - a sua técnica geral antiga: depois de atacar escondido, continua escondido;
  - começar todo turno escondido dá 24,8; voltar a se esconder com 1 ação dá 23,4;
  - o valor está em não precisar sair da linha de visão;
  - disputa a reação com o Assassinato.
- **C. Arapuca:**
  - refeita: o *Enraizado* pela armadilha conta como *Desprevenido* no 1º ataque do turno;
  - vertente Cartógrafo: Campo Minado + Gatilho Remoto viram alvos do Ataque Furtivo.
- **D. Cobra:**
  - a sua, ajustada (contra sua CD, *Envenenamento*, dura até o 1º acerto);
  - vertente Pecador: o veneno custa Sins.

*Pecador* (recomendo A + B)
- **A. Isca de Ouro:**
  - Sins como limiar de execução: no nível 4, até 40 Sins executam até 20 de Saúde;
  - vertente Ladrão: *Desprevenida* liga o Ataque Furtivo;
  - **depende do 1x/turno do Ataque Furtivo:** sem ele, todos os acertos do turno somariam os dados.
- **B. Penitência:**
  - é o "consome Sins em troca de dano" que você pediu, com o destino das moedas que você deu ao Pecar;
  - 40 Sins + 2 Stamina dão 22,3 de dano por turno, contra 12,6;
  - o *Destruir* do Brutalista dá os mesmos 4d6 por 8 Stamina;
  - cada Sin gasto baixa o Bolso Cheio, então guardar e gastar puxam em sentidos opostos.
- **C. Preço da Vida:** comprar a própria vida, 1x/descanso longo, por 80 Sins no nível 4.
- **D. Informante:**
  - compra o mapa em vez de desenhar; ele conta como desenhado por você e dispara a Cartografia, o Campo Minado e a Pechincha;
  - vertente Cartógrafo; sozinho, é fraco.

**Ainda abertos do Tier 1** (rodada 8, pontos 1–15): o "Ótimo" vale como aceite das propostas? Se valer, eu aplico:
- Cartografia: "lugar" em vez de "região", validade dos dados e uso só nas suas rolagens;
- Cartografia e Mapa Estratégico: "a qualquer momento, 1x/rodada";
- Mapa Estratégico: estoque até (Nível) mapas, que se desfazem no descanso longo, não se vendem, e quem carrega usa;
- Cruel: "ao acertar";
- Ataque Furtivo: "ao acertar", 1x/turno e metade dos dados na pesada;
- Assassinato: sem ataque de oportunidade;
- Homem de Negócios: conta o pico de Sins;
- tetos de +Nível no Bolso Cheio e no Pecar;
- dano de Força do Bolso Cheio: 1d6 a cada 100 Sins (máximo Nível d6).

Também seguem abertos:
- a 9ª região;
- "região" no Rasgar o Mapa;
- o Cicatrizes rolar de novo (espaço do Xamã);
- se a Armadilha Tática some ao disparar.

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
Você pode gastar 1 ação e 3 de Stamina para desenhar um Mapa Estratégico; ao fazer isso, escolha uma perícia qualquer. O mapa vira um item consumível que pode ser utilizado como ação livre para adicionar +2 (+4 no nível 3 e +6 no nível 5) na perícia escolhida quando uma criatura rolar ela.

**Campo Minado** (Passiva) `[nova]`
Ao desenhar um mapa, você pode montar até (Nível) armadilhas na área dele, sem gastar ações nem Stamina. Elas funcionam como as da Armadilha Tática e contam no seu limite de armadilhas montadas.

### Tier 2 (em escolha: 2 de 4)

**A. Gatilho Remoto** (Reação, 3 Stamina) `[nova]`
Na área de um mapa seu, quando uma criatura terminar um movimento a até 3 m de uma Armadilha Tática sua, você pode dispará-la: a criatura faz o teste de *Percepção* contra a armadilha como se tivesse passado por cima dela. A armadilha disparada se desfaz.

**B. Esconderijos** (Passiva) `[nova]`
Na área de um mapa seu, no início do combate, aponte até (Nível) esconderijos: pontos de 1,5 m que o seu mapa registrou. Você ou um aliado que esteja num esconderijo pode se esconder com 1 ação, mesmo no campo de visão de criaturas cientes dele: role *Furtividade* contra a *Percepção* de cada criatura que o vê. Cada esconderijo serve uma vez por combate.

**C. Guia de Campo** (Passiva) `[nova]`
Requisito: Cartografia. Os dados da Cartografia também podem ser somados às rolagens de aliados a até 9 m de você, na área do mapa.

**D. Território Hostil** (Passiva) `[nova]`
Na área de um mapa seu, criaturas hostis têm −2 em *Movimento* e *Reflexos*: você sabe onde o chão cede, e elas não.

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
- Você tem vantagem ao realizar uma rolagem de *Crime* para furtar alguém.

### Tier 1

**Ataque Furtivo** (Passiva) `[Pedro]`
- Você se torna Treinado em *Furtividade*. Se já for Treinado, se torna Experiente e assim por diante.
- Ao atacar uma criatura *Desprevenida*, ela recebe 2d6 de dano (4d6 no nível 3 e 6d6 no nível 5) e perde a reação.

**Assassinato** (Reação, 3 Stamina) `[Pedro]`
Imediatamente após deixar uma criatura com 0 de Saúde, você pode gastar sua reação para mover-se até seu Movimento e rolar um teste de *Furtividade* para esconder-se.

**Mão Leve** (1 Ação, 3 Stamina) `[Pedro]`
Você pode realizar um teste de *Crime* contra a *Percepção* de uma criatura a até 1,5 m e roubar até 2d12 Sins dela. No entanto, você não gera Sins caso a criatura não os tenha: você só pode roubar de criaturas que tenham Sins.

### Tier 2 (em escolha: 2 de 4)

**A. Finta** (1 Ação, 3 Stamina) `[Pedro, ajustado: era Tier 1, dava Desorientado]`
Escolha um alvo em até 1,5 m: *Enganação* vs *Percepção*. Sucesso: o alvo fica *Desprevenido* contra o seu próximo ataque neste turno.

**B. Sigiloso** (Reação, 3 Stamina) `[Pedro, da técnica geral antiga]`
Ao atacar estando escondido, pode gastar sua reação para continuar escondido ao suceder em um teste de *Furtividade* contra a *Percepção* do alvo atacado.

**C. Arapuca** (Passiva) `[nova, refeita para o Ataque Furtivo novo]`
Uma criatura *Enraizada* por uma Armadilha Tática sua conta como *Desprevenida* contra o seu primeiro ataque em cada turno.

**D. Cobra** (Descanso Curto ou 1 Ação, 2 Stamina) `[Pedro, ajustado]`
Pode criar venenos potentes e imbuí-los nas suas armas. Você pode criar até 2 venenos por descanso curto e 5 venenos por descanso longo, gastando 5 Sins por veneno. Você pode adicionar o veneno a uma arma ou munição com 1 ação; **o veneno dura até o primeiro acerto**. A criatura que entrar em contato com o veneno deve suceder em um teste de Fortitude **contra sua CD** ou ficar com ***Envenenamento***.

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

### Tier 2 (em escolha: 2 de 4)

**A. Isca de Ouro** (1 Ação, 3 Stamina) `[nova]`
Arremesse até (10 × Nível) Sins aos pés de uma criatura a até 9 m que dê valor a dinheiro. Ela faz *Vontade* contra sua CD. Se falhar, recolhe as moedas e fica *Desprevenida* até o início do próximo turno dela. Se resistir, as moedas ficam no chão. A criatura que recolheu seus Sins fica em dívida com você: quando um ataque seu a deixar com Saúde igual ou menor que metade dos Sins que ela recolheu, ela cai a 0. As moedas continuam com ela; saqueie-a para recuperá-las.

**B. Penitência** (Ação Livre, 2 Stamina) `[nova]`
Ao acertar um ataque, consuma Sins: o acerto causa +1d6 de dano a cada 10 Sins consumidos (máximo Nível d6). As moedas são dissipadas do Plano Material.

**C. Preço da Vida** (Reação, 3 Stamina) `[nova]`
Quando o ataque de uma criatura que dê valor a dinheiro for te reduzir a 0 de Saúde, ofereça a ela (20 × Nível) Sins. Ela faz *Vontade* contra sua CD. Se falhar, aceita: você fica com 1 de Saúde, e as moedas ficam com ela. 1x/descanso longo.

**D. Informante** (Passiva) `[nova]`
Num lugar habitado, você pode pagar (10 × Nível) Sins a quem conhece a área: em 1 minuto, você recebe o Mapa do lugar sem gastar Stamina, e ele conta como desenhado por você. As moedas ficam com o informante.

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
