# Batedor — a classe inteira (cópia de auditoria)

Esta é a classe como ela vai para o Notion, pronta para o Pedro auditar. O porquê de cada escolha, os números e o histórico estão no `18-batedor-rework.md`.

**Origem:** `[Pedro]` texto dele · `[Pedro, ajustado]` texto dele com mudança · `[nova]` criação minha, precisa de aceite.

**Estado (2026-10-09):** cabeçalho, características e técnicas gerais estão fechados e no Notion. Os ramos são proposta, trabalhados ramo por ramo; agora, as marcas e o Tier 1 dos três. Tier 2 e ultimates vêm depois.

---

## Em auditoria

**Mudou nesta rodada (textos seus):**
- **Cartógrafo, Tier 1:** entram Cartografia e Mapa Estratégico; saem Região Ideal, Mapa Tático e Arte.
- **Ladrão:**
  - marcas: Cruel (ex-Coleção de Últimos Suspiros) e Cleptomaníaco (ex-Sussurro Final);
  - Tier 1: Ataque Furtivo, Assassinato e Mão Leve.
- **Pecador:**
  - marcas: Homem de Negócios refeita (a frase cortada foi completada) e Viciado em Khan aceito;
  - Tier 1: Bolso Cheio e Pecar.

**As duas técnicas que você pediu:**

**Campo Minado** (Passiva) `[nova]`, 3ª técnica do Tier 1 do Cartógrafo
Ao desenhar um mapa, você pode montar até (Nível) armadilhas na área dele, sem gastar ações nem Stamina. Elas funcionam como as da Armadilha Tática e contam no seu limite de armadilhas montadas.
- **Por quê:** segue o molde da Cartografia (desenhar o mapa gera um recurso), entrega o armadilheiro que você deu ao Cartógrafo e premia quem prepara o terreno.
- **Números:**
  - nível 2: 2 armadilhas de ~13,5 de dano (3d6 + DES) com *Enraizado*;
  - nível 5: 5 armadilhas de ~26 (6d6 + DES).
  - Custam só o mapa (1 minuto, 5 Stamina). Montadas uma a uma, seriam 1 Ação + 3 Stamina cada.
- **Conversa com:** a Por Aqui!, que puxa o inimigo por cima delas.

**Atravessador** (Passiva) `[nova]`, no lugar do Olho no Lance
Os Mapas que você desenha valem 1 raridade acima, e você pode vender cada um 2 vezes: o original e uma cópia com erros que o comprador só descobre tarde demais.
- **Por que amarra a classe:** fecha o ciclo que você deu ao Batedor, *"converter achados de exploração em poder de combate"*.
  - O Batedor desenha o Mapa.
  - O Pecador vende o Mapa duas vezes e ganha Sins.
  - Os Sins viram bônus (Bolso Cheio) ou são gastos (Pecar).
  - É também o teste da característica: o Cartógrafo amplia o mapa, o Ladrão se move nele e o Pecador o vende.
- **Números:**
  - por lugar novo, a venda passa de ~10–16 Sins (1 venda, Ordinário) para ~67–100 (2 vendas, Incomum), conforme o nível do comerciante;
  - com 2 lugares novos por sessão, são ~130–200 Sins;
  - para comparar, a origem Caçador rende ~50–67 Sins por dia.
- **Limite:** a venda passa de 1x para 2x por área. O teto continua sendo o estoque do comerciante.
- **Alternativa de combate:** *Chuva de Moedas*. Durante o Pontapé, você espalha (5 × Nível) Sins no chão e uma criatura do caminho fica *Desorientada*, se falhar em *Vontade* contra sua CD.

**Para decidir:**

*Cartógrafo*
1. **Cartografia, "região inédita":** é um lugar nunca mapeado ou uma das 9 regiões de Kharavel? Recomendo "lugar". Com "região", os dados viriam poucas vezes na campanha, e só valeriam dentro de um mapa de ~32 m.
2. **Cartografia, validade:** proposta: "os dados que sobrarem somem ao desenhar outro mapa ou no descanso longo". Assim fica 1 conjunto de dados por vez, fácil de anotar.
3. **Cartografia:** os dados valem só nas suas rolagens? Recomendo que sim; o Mapa Estratégico já é a peça do grupo.
4. **"Ação livre" na Cartografia e no Mapa Estratégico:** a ação livre é no seu turno, mas Defender, Reflexos, Fortitude e Vontade costumam ser rolados no turno do inimigo. Proposta: "a qualquer momento, 1x/rodada".
5. **Mapa Estratégico, estoque:** fora de combate, cada mapa custa 3 Stamina, e o descanso devolve a Stamina. Dá para estocar dezenas.
   - Proposta: "você mantém até (Nível) Mapas Estratégicos; eles se desfazem no seu descanso longo e não podem ser vendidos".
   - Proposta: quem carrega o mapa o usa (você pode dar a um aliado).
6. **Mapa Estratégico, preço:** no nível 5, dá +6 por 3 Stamina; o Fantasma dá +5 por 10 Stamina. Com o teto do ponto 5, aceito.

*Ladrão*
7. **Cruel:** "ao atacar uma criatura Exposta" → "ao acertar". O *Exposto* só sai no acerto; com "ao atacar", cada erro somaria mais Sangramento.
8. **Ataque Furtivo:** "ao atacar" → "ao acertar", e "1x/turno". Sem o 1x/turno, a Surpresa!, a Emboscada e a Isca de Ouro deixam o alvo *Desprevenido* o turno inteiro, e todo acerto soma os dados (no nível 5, 45,7 contra 36,2 de dano por turno).
9. **Ataque Furtivo, pesada × leve:** você pediu para equilibrar a pesada, e o bônus fixo favorece a pesada, porque o crítico do *Exposto* dobra o d12.
   - No nível 5, se escondendo todo turno: pesada 39,0 × leve 34,1.
   - Um único acerto escondido de pesada dá ~65 de dano; a Saúde mediana de um PJ no nível 5 é ~55.
   - Proposta: com arma de 2 ou 3 ações, metade dos dados (1d6, 2d6 e 3d6). Fica pesada 32,7 × leve 34,1.
10. **Assassinato:**
    - O "esconder-se" vale à vista de quem te conhece? Pela regra do Sistema, não, e o movimento serve para sair da linha de visão.
    - O movimento provoca ataque de oportunidade? Proposta: não, como no Pontapé.
    - Usar a reação no próprio turno custa o Defender e a retaliação até o seu próximo turno. É um bom contrapeso.

*Pecador*
11. **Homem de Negócios:**
    - "Para cada milhar que você possui" conta o pico ou o saldo atual? Proposta: "na primeira vez que tiver 1000, 2000, 3000… Sins ao mesmo tempo".
    - Escala: 1000 Sins é mais que um item Luxária (~683), e o +5 pede 5000 de uma vez.
12. **Homem de Negócios, vender qualquer categoria a qualquer comerciante:** isso anula a D6 (quem compra não é quem vende) para o Pecador. Aceito como poder do ramo; a loja do site precisa prever a exceção.
13. **Bolso Cheio sem teto:** com o banco do grupo, 2000 Sins dão +8 nas 5 perícias sociais e +8 de dano por acerto. Proposta: máximo +Nível.
14. **Bolso Cheio, dano de Força:**
    - Em quem? Com 1000 Sins, caem 500, e o dano é 500.
    - Proposta: 1d6 de dano de Força a cada 100 Sins derrubados (máximo Nível d6), nas criaturas a até 1,5 m.
15. **Pecar sem teto:** no nível 5, 250 Sins dão +5 numa rolagem, e 500 dão +10. Proposta: máximo +Nível, como o Fantasma.

*Para o Tier 2*
16. **Ataque Furtivo novo:** a Arapuca (Ladrão) e a Isca de Ouro (Pecador) foram escritas para o Ataque Furtivo antigo. Reviso as duas junto com o Tier 2.
17. **Seguem abertos:**
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

### Tier 2 (depois)

Candidatas da rodada 7, para escolher 2:

**A. Gatilho Remoto** (Reação, 3 Stamina) `[nova]`
Na área de um mapa seu, quando uma criatura terminar um movimento a até 3 m de uma Armadilha Tática sua, você pode dispará-la: a criatura faz o teste de *Percepção* contra a armadilha como se tivesse passado por cima dela. A armadilha disparada se desfaz.
- **Papel:** armadilheiro (você deu essa build ao Cartógrafo). A armadilha deixa de depender de o inimigo pisar nela.
- **Vertente Ladrão:** a criatura *Enraizada* pela armadilha vira alvo do Ataque Furtivo (Arapuca).
- **Números:** no nível 4, a armadilha dá (4 + 1)d6 + DES ≈ 21,5 e vence a Percepção em ~70–85% das vezes. Dá ~15–18 de dano esperado, mais *Enraizado*, pela reação e 3 Stamina. Um turno inteiro de arma leve preparada dá ~23,5.
- **Limite:** é a reação da rodada, e ela disputa com Margem de Segurança, Defender e retaliação.

**B. Esconderijos** (Passiva) `[nova]`
Na área de um mapa seu, no início do combate, aponte até (Nível) esconderijos: pontos de 1,5 m que o seu mapa registrou. Você ou um aliado que esteja num esconderijo pode se esconder com 1 ação, mesmo no campo de visão de criaturas cientes dele: role *Furtividade* contra a *Percepção* de cada criatura que o vê. Cada esconderijo serve uma vez por combate.
- **Papel:** o grupo passa a usar a regra de Furtividade em combate. Atacar escondido deixa o alvo *Desprevenido*: o 1º acerto é crítico e ele não reage.
- **Vertente Ladrão:** combina com o Ataque Furtivo, o Assassinato e a marca Cruel.
- **Números:** cada ataque escondido vale ~+4 de dano com arma leve no nível 4 e não pode ser retaliado. São até 4 usos por combate no nível 4.
- **Limite:** cada esconderijo serve 1 vez por combate; o teto é o número de esconderijos.

**C. Território Hostil** (Passiva) `[nova]`
Na área de um mapa seu, criaturas hostis têm −2 em *Movimento* e *Reflexos*: você sabe onde o chão cede, e elas não.
- **Papel:** estrategista. O mapa vira vantagem do grupo sem pôr mais um número na ficha do Batedor.
- **Conversa com:** a Rasteira e as manobras (Movimento contra Movimento), o Escorregadio do Sabotar Terreno (Reflexos) e a Perseguição (inimigos perseguindo com −2).
- **Números:** a Rasteira passa de ~50% para ~60% de sucesso.
- **Custo de mesa:** o mestre aplica −2 a todos os inimigos dentro da área.

**D. Rotas Conhecidas** (Passiva) `[nova]`
Em jornadas dentro de uma região de Kharavel em que você tenha os mapas de 3 lugares diferentes significativos, a Hostilidade conta como 5 a menos para o grupo (mínimo 0).
- **Papel:** exploração. É o "mapear Kharavel continuamente" também nas jornadas.
- **Números:** com Hostilidade 10 → 5, o grupo precisa de 4 pontos em vez de 5, e a falha custa 5 a menos de Saúde e Stamina por pessoa.
- **Sobreposição:** o Desbravador (geral) já dá +1 e +5 em jornadas já percorridas. As duas somam.

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

### Tier 2 (depois; rever com o Ataque Furtivo novo)

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

**Atravessador** (Passiva) `[nova, no lugar do Olho no Lance]`
Os Mapas que você desenha valem 1 raridade acima, e você pode vender cada um 2 vezes: o original e uma cópia com erros que o comprador só descobre tarde demais.

### Tier 2 (depois; rever com o Ataque Furtivo novo)

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
