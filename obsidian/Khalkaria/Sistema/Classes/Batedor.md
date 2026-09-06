---
tipo: classe
status: canon-notion
spoiler: publico
era: atemporal
aliases: [Batedor, Explorador, Ranger]
fonte_notion: [8706e3a401d9823a91fd81f689a6fbe7, 3a66e3a401d9809b8eceec1f30be9fd2]
ultima_sync: 2026-09-05
tags: [khalkaria/sistema, khalkaria/sistema/classes]
---

# Batedor

**Resumo.** Classe de exploração, controle de terreno e furtividade (🧭, Notion 🟢 Pronto, ed. 2026-08-12). Recurso de classe = **Instinto** (0–5), acumulado ao suceder em perícias, acertar e esquivar, e zerado por dano pesado, condições debilitantes, falha em perícia ou 10 minutos de inércia. Único a começar treinado em Armas à Distância + Sobrevivência + Percepção. Perfil do índice: Combate ★★☆☆☆ · Controle ★★★★☆ · Exploração ★★★★★ · Místico ★☆☆☆☆ · Tecnologia ★☆☆☆☆.

## Cânone (Notion)

### Prosa de abertura
> Desde pequeno, você era curioso… curioso demais para o gosto dos adultos. Onde outros enxergavam perigo, você enxergava caminhos. Onde todos recuavam, você avançava — não por coragem ingênua, mas por um instinto silencioso que sempre te guiou através da mata fechada, dos becos tortuosos e dos territórios proibidos.

### Progressão
| Level | Conteúdo |
|---|---|
| 1 | 4 Técnicas |
| 2 | 5 Técnicas, Técnica de Ramo(Tier 1) |
| 3 | 6 Técnicas, 1 Marca |
| 4 | 7 Técnicas, Técnica de Ramo(Tier 1, 2), 2 Marcas |
| 5 | 8 Técnicas, Técnica de Ramo(Tier 1, 2 e 3), 3 Marcas |

### Status iniciais
- **Saúde:** `10 + (4 × Nível) + (Mod.CON × Nível)`
- **Stamina:** `8 + (7 × Nível) + (Mod.FOR OU Mod.DES × Nível)`
- **Éter:** `6 + (4 × Nível) + (Mod.INT OU Mod.SAB × Nível)`
- **Evasão Ativa (Reação):** 10 + Mod. Destreza + Treinamento em *Defender*
- **Evasão Passiva (Sem reação):** 10 + Mod. Destreza

### Treinamento
Você começa treinado em: **Armas à Distância, Sobrevivência, Percepção**
Além disso, você pode escolher **(1 + Mod. Inteligência)** Perícias para ser treinado dentre as seguintes: Crime, Religião, Iniciativa, Medicina, Furtividade

- **Atributos Recomendados:** Destreza, Sabedoria e Inteligência
- **Play Style:** Exploração, Controle de Terreno e Furtividade
- **CD:** 10 + Mod. Destreza + Mod. Sabedoria

### Instinto (recurso de classe)
> **Instinto** é a manifestação mecânica da sua atenção aguçada e experiência como explorador. Quanto mais você observa, investiga e interage com o ambiente, mais afiado fica seu sexto sentido — até o momento onde você age antes mesmo do perigo se manifestar.

- Você começa cenas de exploração ou cenas de combate com **0 de Instinto**, *contudo*, se estiver em uma cena de exploração e começar um combate pode sustentar seu **Instinto**.
- **Ganha Instinto:**
  - *Perícia:* Ao suceder em qualquer perícia → **+1 Instinto** (Máx. 2x por rodada, Máx. 1x/perícia a cada cena)
  - *Acerto:* Ao acertar qualquer inimigo → **+1 Instinto** (Máx 1x/rodada)
  - *Esquiva:* Ao esquivar de qualquer ataque → **+1 Instinto** (Máx 1x/rodada)
- **Perde TODO o Instinto:**
  - *Dano:* Ao receber dano maior que metade da sua vida máxima de qualquer fonte → **= 0 Instinto**
  - *Condição:* Ao ficar Atordoado, Desorientado ou Desprevenido → **= 0 Instinto**
  - *Perícia:* Ao falhar qualquer perícia → **= 0 Instinto**
  - *Tempo:* Ao ficar 10 minutos sem ganhar instinto → **= 0 Instinto**

| Hab. de Instinto | Custo | Descrição | Ação |
|---|---|---|---|
| Pressentimento | X | Adicione +X a qualquer perícia ao menos treinada. | Ação Livre |
| Sexto Sentido | 2 | Adicione +2 à sua evasão durante esse turno. | Ação Livre |
| Segundo Fôlego | 3 | Você pode rolar novamente sua Iniciativa e usar o novo resultado (se preferir). | Ação Livre |
| Golpe Instinto | 4 | Reduz a margem de crítico do seu próximo ataque em 3 (17-20). | 1 Ação |
| Instinto Reativo | 5 | Você pode usar sua Reação mesmo que já a tenha gastado nesta rodada. | Ação Livre |

**Máximo: 5 Instinto**

### Técnicas gerais
> Você possui **3 Técnicas + Nível**, reatribuíveis em descanso longo.

| Técnica | Descrição | Custo | Ação |
|---|---|---|---|
| Atento | Você é imune a condição *Desprevenido*. | — | Passiva |
| Passo Ciente | Você não ativa armadilhas de quaisquer tipo e ignora terreno difícil. | n/a | Passiva |
| Caçador | Você consegue distinguir peso, número da pegada, velocidade e direção de criaturas vendo rastros passivamente. | n/a | Passiva |
| Líder | Você possui a habilidade de memorizar caminhos e traçar trajetos eficientes. Você soma naturalmente +1 ao sucesso do grupo em jornadas já percorridas. Adicionalmente, ao rolar *Sobrevivência* em jornadas possui +5. | n/a | Passiva |
| Terreno Ideal | Você tem facilidade em se adaptar a um ambiente, e enquanto estiver nele recebe os seguintes benefícios: +2 em testes de Sobrevivência; +2 em testes de Percepção; Pode gastar uma ação para rolar estes testes com vantagem. Terrenos: (Urbano, Natural, Naval, Subterrâneo) Pode escolher 1 no nível 1, 2 no nível 3 e 3 no nível 5. | 3 Stamina | Passiva ou 1 Ação |
| Língua Prateada | Treinado em Interação Social(Convencimento). Adicionalmente, ao suceder em um teste de *Interação Social(Convencimento)* contra um comerciante garante 25% de desconto em um item. | 2 Stamina | 1 Ação |
| Oportunista | Seu próximo ataque causa +1d8 de dano se o alvo estiver *Desprevenido*. | 2 Stamina | 1 Ação |
| Curioso | Ao realizar um teste de *Percepção* ou *Investigação* adicione 1d4+Destreza. | 2 Stamina | 1 Ação |
| Emboscada | Pode preparar um local previamente com armadilhas e distrações rolando um teste de *Sobrevivência* ou *Furtividade*: Ao lutar em um ambiente preparado, se o inimigo falhar em um teste de *percepção* contra seu teste, você e seus aliados recebem +2 em Atacar durante todo o combate e os inimigos ficam Desprevenidos na primeira rodada do combate. | 5 Stamina | 10 Minutos |
| Armadilha Tática | Rapidamente configura uma armadilha no chão, rolando um teste de *Furtividade* ou *Sobrevivência* e atribuindo o resultado a ela. Quando um inimigo passar por cima ele deve superar a *Furtividade* ou *Sobrevivência* da armadilha rolando *Percepção* ou recebe 2d6+Mod. Destreza de dano Perfurante e fica *Enraizado* por 1 rodada. | 3 Stamina | 1 Ações |
| Fantasma | Ao ser atacado e optar por se **defender**, pode somar seu treinamento de **Furtividade** na perícia. | 2 Stamina | Ação Livre |
| Mãos Rápidas | Você reduz sua penalidade por ataques consecutivos em -2 durante esse turno. Ou seja, de -5 para -3 e -10 para -8. | 2 Stamina | Reação |
| Sigiloso | Ao atacar estando furtivo, pode gastar sua reação para continuar furtivo ao suceder em um teste de furtividade contra a percepção do alvo atacado. | 3 Stamina | Reação |
| Saque | Ao eliminar uma criatura, pode saqueá-la, ganhando 1d4 + (Nível * 2) de Sins. | n/a | Reação |
| Ocultar-se | Ao estar fora da linha de visão de todas as criaturas da cena, pode se esconder com 1 ação ao em vez de 2. | 2 Stamina | 1 Ação |

### Ramos
> Ao longo da criação do seu personagem você escolherá: 3 Marcas; 6 Técnicas de Ramo (3 no Tier 1, 2 no Tier 2, 1 no Tier 3 — ver Conflitos).

- **Ramo do Cartógrafo** (azul — Exploração e Sobrevivência) — *Estar em um local desconhecido é o que te cativa e mapeá-lo é como você expressa sua arte. Você vive pela emoção de descobrir coisas novas e suas aventuras te trouxeram ensinamentos de sobrevivência valiosos.*
- **Ramo do Trambiqueiro** (verde — Dinheiro e Interação Social) — *Viajar o mundo custa caro e você faz questão de pagar esse preço. Ao longo de suas aventuras você sempre esteve de olho em bugigangas compráveis, a lábia de comerciante, veio naturalmente após isso.*
- **Ramo do Sem-Nome** (vermelho — Furtividade e Assassinato) — *Ninguém lembra do seu rosto e é assim como você prefere. O capuz caiu sobre sua cabeça pela primeira vez para se proteger do sol, mas, com o tempo, tornou-se algo maior: um abrigo, um disfarce, uma segunda pele.*

### Marcas de Ramo
**Marcas do Cartógrafo**
- **Colecionador de Horizontes** — *"Cada paisagem nova te renova por dentro e relembra sua aspiração."* Você anseia por novos lugares e busca ativamente explorar o desconhecido.
  - Ao mapear um lugar significativo pela primeira vez (Cidade, Ruína, Bioma…) Recupera 2 de Stamina e ganha 1 de Stamina máxima.
  - O lugar deve possuir características únicas que você nunca mapeou antes, por exemplo: o subúrbio de uma cidade e a área rural dessa mesma cidade, apesar de terem uma paisagem diferente, contam como um único lugar por serem próximos e possuírem elementos geográficos parecidos.
- **Cicatrizes da Jornada** — *"Cada ferida conta uma história. Cada história te ensinou a sobreviver."* Você possui cicatrizes que reforçam suas histórias de viagem.
  - Para cada Jornada de Hostilidade 10+ que você completou, ganha +1 permanente em Sobrevivência. Ao chegar em +5, essa habilidade fica supérflua.
  - Ao falhar em um teste de Sobrevivência, pode escolher perder 2d6 de Stamina para transformar em sucesso.

**Marcas do Sem-Nome**
- **Coleção de Últimos Suspiros** — *"Você se lembra de cada um. Não dos rostos - dos sons que fizeram ao partir."* Você sente prazer em assassinar criaturas sem que elas te reconheçam.
  - Para cada 5 criaturas que você matou enquanto estava *Escondido*, ganha +1 permanente em Furtividade. Ao chegar em +5, essa habilidade fica supérflua.
  - Ao matar uma criatura sem ser detectado, recupera 1 de Stamina.
- **Sussurro Final** — *"O sussurro final é sempre o mais verdadeiro."* Você sabe interrogar pessoas como ninguém.
  - Você fica treinado em Interação social(Convencimento).
  - Ao matar uma criatura em combate corpo a corpo, pode fazer uma pergunta que ela responde com verdade antes de morrer. A resposta é breve (uma frase) e literal.

**Marcas do Trambiqueiro**
- **Homem de Negócios** — *"Moedas acabam. Favores rendem juros eternos."* Você possui um distúrbio de mat… **[frase truncada no Notion]**
  - Para cada 5 negociações bem-sucedidas que resultaram em vantagem significativa, ganha +1 permanente em Interação Social(Convencimento). Ao chegar em +5, essa habilidade fica supérflua.
  - Ao ajudar alguém de forma significativa, pode declarar que a pessoa "te deve uma". O mestre registra. Você pode cobrar depois.
- **O Palpite** — *"Você nem sempre acerta, mas eles não sabem disso."*
  - Ao passar ao menos 1 minuto analisando uma criatura, pode diagnosticar um segredo dela. Esse segredo possui 50% de chance de ser verdade e você não sabe disso.
  - Ao rolar um teste de interação social(qualquer) contra ela pode utilizar esse segredo como ferramenta, caso seja verdade você rola o teste com vantagem, caso seja mentira você rola com desvantagem.

### Técnicas de Ramo — Tier 1 (nível 2)
**Cartógrafo**
- **Desenhar Mapa de Exploração** (Descanso Curto, 5 Stamina) — Desenhe um *Mapa de Exploração*. Você pode mapear locais previamente transitados, até um tamanho máximo de até 1 quilômetro quadrado. O *Mapa de Exploração* é um item de raridade **Incomum**. Ao estar com o *item: Mapa de Exploração* você recebe os seguintes benefícios ao estar no local do mapa: Tem conhecimento geral da geografia da área; +5 em *Sobrevivência* enquanto na região do mapa.
- **Artista Apaixonado** (Passiva) — Os mapas que você fabrica contam como mercadoria Incomum.
- **Escapista** (3 Ações, 5 Stamina) — Você nunca foi acostumado a batalhar, na verdade planejar uma rota de fuga é sua especialidade. Ao possuir um mapa da região em que está batalhando, pode fugir e guiar outros a fugirem do combate sem uma cena de perseguição ao suceder em um teste de Sobrevivência (CD 15).

**Sem-Nome**
- **Golpe Sombrio** (1 Ação, 2 Stamina) — Enquanto estiver *Escondido*, seu próximo ataque: Ignora 1 de *Evasão*; +1d6 de Dano; Não pode ser retaliado.
- **Finta** (1 Ação, 2 Stamina) — Escolha um alvo em até 1,5 m: Enganação vs Percepção. Sucesso: alvo fica *Desorientado* por 1 rodada.
- **Olhar de Brecha** (Passiva) — Você detecta instantes onde inimigos abaixam guarda ou se distraem. Você recebe vantagem no primeiro teste de *Furtividade* do combate. Adicionalmente, se já estiver escondido no primeiro turno de combate, recebe +2 em *Iniciativa*.

**Trambiqueiro**
- **Bens Diversos** (1 Ação, 5 Stamina) — Você busca na sua mochila por um objeto que possa te ajudar na realização de um teste de perícia qualquer, role um d100: **1:** Você machuca sua mão recebendo 1d6 de dano cortante ao tentar buscar na sua mochila. Como isso foi parar aí? · **2-19:** objeto qualquer, não ajuda em quase nada. · **20-39:** +1 na perícia. · **40-59:** +2 na perícia. · **60-79:** +3 na perícia. · **80-99:** +5 na perícia. · **100:** objeto perfeito que soluciona e te faz suceder instantaneamente na perícia.
- **Agiota** (3 Ações, 10 Stamina) — Você pode tentar convencer uma criatura que consiga te entender a aceitar um empréstimo (monetário ou de bens), voltando para cobrá-la 1 dia depois. Ao escolher um alvo, você rola *Interação Social(Convencimento)* vs *Vontade*, caso suceda você pode escolher quanto dinheiro oferece a criatura recebendo 20% de lucro no dia seguinte se o alvo possuir o dinheiro. Caso o alvo não consiga pagar ele fica *Endividado*. Você possui +5 em testes de Interação Social(Convencimento) contra criaturas endividadas e estas são muito mais suscetíveis a seguirem suas ordens ao falharem em testes de Vontade contra você em uma tentativa de quitarem suas dívidas.
- **Cara de Pau** (1 Ação, 3 Stamina) — Você pode rolar *Interação Social(Convencimento)* com 1 nível de treinamento a mais.

### Técnicas de Ramo — Tier 2 (nível 4)
**Cartógrafo**
- **Desenhar Mapa de Combate** (5 Minutos, 3 Stamina) — Você desenha um mapa tático, analisando altitude, tipos de terreno e hostilidades em um espaço de até 300 metros quadrados. Ao estar em um local mapeado por você:
  - Você e seus aliados não podem ser *Desprevenidos*
  - Pode usar *Coordenação* (Reação, 3 Stamina): Orienta você ou um aliado em até 9 metros que esteja prestes a rolar um teste de Movimento, Defender ou Atacar. Somando +2 à rolagem.
  - Pode usar *Ponto Cego* (1 Ação, 4 Stamina): Expõe uma falha de posicionamento de um alvo que tenha se movido nesta rodada dentro do mapa, o alvo fica *Exposto*.
  - Pode usar *Reposicionar* (1 Ação, 3 Stamina): Escolha um aliado, podendo ser você, em até 9 m. Ele pode se mover até 4,5 m como uma ação livre sem provocar ataques de oportunidade.
- **Mapa Mental** (1 Ação, 2 Stamina) — Você mentaliza o esboço de um mapa tático, ganhando seus benefícios nesta rodada. No início de cada rodada após essa, faça um teste de percepção (CD 15) para manter-se concentrado no mapa. Em caso de falha, você perde os benefícios.

**Sem-Nome**
- **Cobra** (Descanso Curto ou 1 Ação, 2 Stamina) — Pode criar venenos potentes e imbuir eles nas suas armas. Você pode criar até 2 venenos por descanso curto e 5 venenos por descanso longo. Gastando 5 **Sins** por veneno. Você pode adicionar o veneno a uma arma ou munição com 1 ação. A criatura que entrar em contato com o veneno deve suceder em um teste de Fortitude ou ficar *Envenenada*.
- **Terror** (Passiva) — Ao acertar um crítico, o alvo fica *Exposto.*

**Trambiqueiro**
- **Conexões Duvidosas** (1 Ação, 3 Stamina) — Você já ouviu falar de muita gente e possivelmente elas te devem algo, ou você que deve… Role um teste de *interação social(Convencimento)* CD 20, porém pode ser dificultado dependendo da localização. Só pode ser utilizado 1 vez por localização, porém pode ser usado em diferentes áreas em uma cidade grande.
  - **Falha crítica:** O contato existe, mas te odeia. Ele ativamente trabalha contra você enquanto estiver na cidade.
  - **Falha:** O contato existe, mas você deve algo a ele. Ele só ajuda se você quitar a dívida primeiro (favor, dinheiro ou serviço).
  - **Sucesso:** O contato existe e te deve um favor menor: informação local, desconto em uma compra, esconderijo por uma noite, ou apresentação a alguém importante.
  - **Sucesso Crítico:** O contato te deve um favor maior: acesso a área restrita, item raro por preço justo, aliado temporário para uma missão, ou perdão de uma dívida/crime menor.
- **Olho no Lance** (1 ação, 3 stamina ou passiva)
  - **Passiva:** Você automaticamente sabe o valor de um item ao examiná-lo. Recebe 20% a mais de **Sins** de todas as fontes. Ou seja, quando saquear 10 **Sins**, recebe 12. Quando vender um item por 300 **Sins** recebe 360 **Sins**. Isso não se aplica a itens já saqueados e repassados a você, apenas quando estiver vasculhando. Por exemplo, não faz sentido alguém te entregar 10 Sins e você magicamente receber 12.
  - **Ação:** *Revirar* (máx. 1x/cena) — Ao vasculhar uma sala que pode possuir itens valiosos, pode revirá-la com mais cuidado. Role investigação (CD 15): **Falha Crítica:** Ativa uma armadilha. Recebe 1 de dano e não encontra nada. **Falha:** Não encontra nada além do óbvio. **Sucesso:** Encontra algo de valor que outros ignorariam. 2d10 **Sins** em itens vendáveis. **Sucesso Crítico:** Encontra um saco de **Sins**, contendo 2d10 **Sins**.

### Técnicas de Ramo — Tier 3 · Ultimates (nível 5)
> O Tier 3 provê ultimates, que só podem ser utilizadas 1 vez por dia.

**Cartógrafo** — Requisito: deve ter ao menos Cartógrafo Tier 1 ou 2. *"Minha arte, pode descobrir todos os segredos."*
- **Senhor das Linhas** (1 Ação, 5 Stamina, Ultimate)
  > Você sente uma energia primordial emanar de sua caneta ao guiá-la por um papel, suas movimentações revelam informações extraordinárias. Você não sabe de onde vem esse poder, mas utiliza-o como se fosse seu. Você acaba de desenhar uma obra-prima, um mapa com informações impossíveis de compreender, mas você entende tudo, perfeitamente:
  - **Onisciência:** Você sente um calafrio, quase que sobrenatural: Sua mão é guiada pelo mapa por uma força maior expondo a posição de todas as criaturas em até 60 metros. Você conhece a localização de todas as criaturas em até 60 metros. Incluindo criaturas invisíveis, escondidas… Você sabe a intenção de movimento/ataque de cada criatura em um raio de 60 metros. Não pode ser flanqueado.
  - **Comandante de Campo:** Essa energia te faz raciocinar extremamente rápido, nesse estado, você consegue identificar estratégias e movimentações que outros não conseguem:
    - *"Ali!"* (1 Ação): Um aliado em até 12 m pode se mover até 6 m como reação, sem ataques de oportunidade.
    - *"Abaixa"* (1 Ação): Um aliado em até 12 m ganha +4 Evasão contra o próximo ataque que receber.
    - *"Agora!"* (2 Ações): Todos os aliados em até 12 m ganham +2 atacar e +1d6 no próximo ataque.
  - **Manipular Mapa:** Esse mapa parece ter influência real em seus arredores, e você sente que consegue controlá-lo. Ao usar qualquer uma das seguintes habilidades, faça um teste de *Vontade* (CD 15); ao falhar você perde 1d6 de Éter:
    - *Criar Armadilha* (1 Ação): Declare um ponto em até 12 m de você, a primeira criatura que pisar recebe 3d6 dano e deve passar em um teste de Movimento ou fica *Enraizada* por 1 rodada.
    - *Tremor Localizado* (1 Ação): Todos os inimigos em até 9 m de você sentem o chão tremer, eles devem passar em um teste de Movimento ou ficam *Desorientados.*
    - *Fuga Instantânea* (3 Ações): Você descobre uma rota de fuga perfeita, se ela não existir o seu mapa esculpe um caminho à força para que você e seus aliados consigam fugir da batalha.
  - **O Custo:** Ao fim do combate, sua ultimate cessa e seu mapa da região utilizada é desintegrado, virando pó rapidamente. Perca 2d6 de Éter. Você sente que roubou magia, de onde não devia.

**Sem-Nome** — *"Eles morrerão antes de entender o que você é"*
- **Silêncio** (1 Ação, 5 Stamina, Ultimate)
  - Escolha uma criatura em sua visão por rodada, ela recebe *Marcada à Morte 1*; essa condição soma ao ser aplicada novamente, ficando *Marcada à Morte 2*, por exemplo:
    - Você sabe a localização de todas as criaturas marcadas por você e a saúde exata delas.
    - Você tem +1 em todos os testes contra uma criatura *Marcada à Morte*. Acumulável, ou seja, *Marcada à Morte 2* te fornece +2 em todos os testes.
    - Seus ataques ignoram 1 de evasão contra criaturas *Marcadas à Morte.* Acumulável, ou seja, *Marcada à Morte 2* te faz ignorar 2 de evasão.
    - Você tem +1 dado de dano ao critar contra uma criatura *Marcada à Morte*. Acumulável, ou seja, *Marcada à Morte 2* te dá +2 dados.
    - Alvos marcados ficam *Expostos*, porém ainda remove a condição ao atacar.
    - Ao acertar um ataque furtivo, o ataque automaticamente é crítico.
  - **O Custo:** Você não pode critar contra alvos não marcados. Você fica obcecado por todos seus alvos marcados e para desistir de matá-los, deve fazer um teste de *Vontade* (CD 20) para se controlar. Você perde 1d6 de Éter.

**Trambiqueiro** — *"Todo mundo tem um preço."*
- **Suborno Irrecusável** (2 Ações, 5 Stamina, Ultimate) — *"Vamos ser razoáveis aqui. Quanto vai custar pra você olhar pro outro lado?"*
  - Escolha uma criatura inteligente que possa te entender e que não seja diretamente leal a algo maior que dinheiro (fanatismo religioso, amor verdadeiro, honra inabalável). Role *Interação Social(Convencimento)* com +5 vs Vontade do alvo:
    - **Falha Crítica:** O alvo fica enfurecido com a tentativa. +2 Atacar contra você até o fim do combate.
    - **Falha:** O alvo hesita, ficando *Atordoado* por 1 rodada enquanto considera a proposta.
    - **Sucesso:** O alvo muda de lado até o fim do combate/cena.
    - **Sucesso Crítico:** O alvo muda de lado permanentemente (ou até você traí-lo). Ele luta por você, fornece informações, abre portas…
  - **O Custo:** Se perceber que foi manipulada, a criatura tenta te atacar. Perca 1d6 de Éter.
- **Esquemas** (Ação Livre, 5 Stamina, Ultimate) — *"Ah, isso? Eu já tinha pensado nisso."*
  - A qualquer momento você pode declarar uma preparação que fez e preparou previamente, antes da cena atual. Exemplo: *"Eu já tinha subornado um dos guardas. Ele deixa a porta dos fundos aberta."* / *"Eu escondi armas naquela sala ontem à noite."* / *"Eu contratei mercenários. Eles chegam agora."*
  - Role um teste de *Interação Social(Convencimento)*, a CD varia dependendo da viabilidade da preparação proposta. Se suceder isso realmente aconteceu, se não algo do seu plano deu errado.
  - **O Custo:** Seus pecados estão sendo observados. Perca 1d6 de Éter.

## Segundo o Pedro (2026-09-05)
- **B11:** ramos são **3 técnicas Tier 1 · 2 Tier 2 · 1 ultimate Tier 3**, desbloqueadas nos níveis **2, 4 e 5**. O texto "6 Técnicas de Ramo, 3 por Tier" está errado.
- **B16:** *"Interação social(x) era a norma para referenciar as perícias sociais, mas hoje foram individualizadas; interação social hoje só se refere ao grupo das perícias de interação."* → ler **Interação Social(Convencimento) = [[Atributos e Perícias|Convencimento]]**.
- **B12:** *Endividado* e *Escondido* "foram criadas especificamente para uso unitário nessas técnicas… depois fazemos a revisão nas condições" — não são condições canônicas ainda.
- **B2:** munição — "1 unidade por combate inteiro, daí você pode seguir atirando até o fim do combate. Sem munição você não pode usar armas à distância durante todo o combate." Relevante porque o Batedor começa treinado em **Armas à Distância**.
- **A5/A9:** [[Azgar Sandgale]] é o Batedor da [[Equipe desfloreio]]; o "Batedor de [[Kirkushav Drekar]]" morto em [[Ossyria]] foi derrotado por **[[Terk Sandgale]]**, não por Azgar.

## Relações
- **Pertence a** → [[Sistema]]
- **Recurso de classe** → Instinto (0–5)
- **Recursos gerais** → Saúde · Stamina · [[Éter]]
- **Ramos** → Cartógrafo (exploração/sobrevivência) · Trambiqueiro (dinheiro/interação social) · Sem-Nome (furtividade/assassinato)
- **Perícias iniciais** → Armas à Distância, [[Atributos e Perícias|Sobrevivência]], [[Atributos e Perícias|Percepção]]; escolhe entre [[Atributos e Perícias|Crime]], [[Atributos e Perícias|Religião]], [[Atributos e Perícias|Iniciativa]], [[Atributos e Perícias|Medicina]], [[Atributos e Perícias|Furtividade]]
- **Economia** → [[Sins]] (Saque, Olho no Lance, Agiota, Cobra) · [[O Bazar]]
- **Condições que usa** → [[Condições|Desprevenido]], [[Condições|Exposto]], [[Condições|Enraizado]], [[Condições|Desorientado]], [[Condições|Atordoado]], [[Condições|Envenenamento]]
- **PJ que a usa** → [[Azgar Sandgale]] (Batedor da [[Equipe desfloreio]], de [[Ossyria]])
- **Colisões de nome** → *Oportunista* (também no [[Espadachim]]) · *Terror* (também no [[Monge]], como "O Terror")
- **Regra de jornada** → Líder e Cicatrizes da Jornada dependem da regra de **Jornada** e do valor de Hostilidade ([[Sistema]])

## Conflitos e pendências
1. **Trambiqueiro tem 2 ultimates** (Suborno Irrecusável + Esquemas); todos os outros 20 ramos do sistema têm 1. Erro ou escolha? **Pendência aberta.** (Digest B §15)
2. **Homem de Negócios**: frase truncada no Notion — *"Você possui um disturbio de mat"*. Completar. **Pendência aberta.** (Digest B §16)
3. **Ocultar-se**: "esconder com 1 ação ao em vez de **2**" × Sistema/Furtividade, que define esconder-se com **3 ações**. Qual é a base? **Pendência aberta.** (Digest B §25)
4. **Perícias legadas** "Interação Social(Convencimento)" → Convencimento (B16); corrigir no Notion.
5. **"6 Técnicas de Ramo, 3 por Tier"** × Progressão 3/2/1 — resolvido por B11; corrigir no Notion.
6. **Condições sem definição canônica**: *Endividado* (Agiota), *Escondido* (Golpe Sombrio, Coleção de Últimos Suspiros), *Marcada à Morte X* (definida inline só na ultimate Silêncio). B12 adia a revisão.
7. **Cicatrizes da Jornada** repete verbatim a epígrafe de *Imortal* ([[Brutalista]]): "Cada ferida conta uma história. Cada história te ensinou a sobreviver." Copiar-colar? (Digest B §17)
8. **Marcas com "+1 permanente"** até +5 × escala canônica de perícia +2/+4/+6/+8. Como se somam? **Pendência aberta (mesma do [[Espadachim]]).**
9. **Progressão em linha única** no Notion (tabela achatada) — formatação, não conteúdo.

## Fonte
- Notion: Batedor `8706e3a401d9823a91fd81f689a6fbe7` (ed. 2026-08-12, 🟢 Pronto) · Classes `3a66e3a401d9809b8eceec1f30be9fd2`
- Raw: `docs/memoria/notion_raw/classe_batedor.md`, `classe_index.md`
- Digest: `docs/memoria/digests/B_classes.md` §2, INCONSISTÊNCIAS 14, 15, 16, 17, 18, 21, 25 · Respostas: A5, A9, B2, B11, B12, B16
