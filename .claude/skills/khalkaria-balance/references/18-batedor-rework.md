# 18 — Rework do Batedor (proposta, rodada 2)

**Status: PROPOSTA.** Nada disto está no Notion.
- Vai ao Notion só com o aceite do Pedro.
- Depois do Notion, sai o log do novo Batedor para o agente de HTML, com diff contra `batedor-notion-antes-do-rework.txt`.
- A **rodada 1** (Mapa de Combate + Instinto refeito) está no commit `a4ea40f`. O Pedro trocou a direção; o que dela sobrevive está marcado aqui.

Base: `19-gabarito-de-classe.md` (estrutura), `13-batedor-diagnostico.md` (diagnóstico) e o texto de hoje.

**Origem de cada texto:**
- **[Pedro]**: texto dele, sem mudança de regra.
- **[Pedro, ajustado]**: texto dele, com a mudança descrita.
- **[nova]**: criação minha, precisa de aceite.

---

## 0. O que o Pedro decidiu (2026-09-28, verbatim)

> *"Na verdade eu quero o batedor com muita Stamina, então 3/8/4, meu conceito é que seja uma classe que suporte
> builds à distância, corpo a corpo fragil multi-ataque, converter achados de exploração em poder de combate
> (Trambiqueiro dá mais dano com base na quantidade de sins no inventário)."*

> *"Quero punir o jogador batedor que não espera a luta, ser pego desprevenido pro batedor é a pior opção, estar com
> o mapa em prontidão para o combate é o pico."*

> *"Agora, para a segunda característica de classe, estou pensando em algo mais forte do que o instinto que não
> exija tanto tracking e sem tabelas. Hoje a técnica prevista pro xama já altera d20's, então isso está reservado.
> Preciso de algo que dê mobilidade e a defesa que o batedor pede com o nerf em vitalidade."*

**Intenções dos ramos:**
1. **Cartógrafo:** sobrevivência e exploração. Ganha mais poder pelos mapas, em combate e fora dele.
2. **Ladino mais bem polido:** ágil, com mais bônus em Crime e Furtividade, e formas de acompanhar os outros ramos.
3. **Trambiqueiro:** gira em torno dos Sins e da interação social. A proficiência em combate depende do tamanho da carteira, e o foco é negócios.

**Técnicas gerais:** *"quero que rodem mais ao redor do mapa e façam sentido com a nova característica."*

**Instinto:** sai. No lugar dele entra uma 2ª característica, ainda em aberto (§3).

---

## 1. Cabeçalho [Pedro]

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

*Notas minhas (não vão ao Notion):*
- **O que 3/8/4 dá em números** (CON +1; DES +3 no nível 1 e +5 no nível 5, D87):

  | Nível | Saúde | Stamina |
  |---|---|---|
  | 1 | 14 | 19 |
  | 3 | 22 | 44 |
  | 5 | 30 | 73 |

  - A Saúde é igual à do Teurgo (3/3/9), a mais baixa do sistema.
  - A Stamina é a maior do sistema; o Artilheiro, com Vigor 7, chega a 68.
  - Um golpe de Pesada Brutal (2d12+5 ≈ 18) tira 60% da Saúde de um Batedor de nível 5. A 2ª característica precisa pagar essa fragilidade (§3).
- **O trio 3/8/4 é único.** A faixa de Vigor sobe para 3–8.
- **CD com "ou":** segue a PD7 ("maior, mas com escolha de mudar"), a mesma regra dos outros "X ou Y" da ficha.
- **Lista com 7 opções:** as outras classes têm 5. O Pedro já disse que vai ajustá-las depois; fica pendente no `17` §2.

---

## 2. Característica 1 — Mapa [Pedro, com 5 pontos para fechar]

Texto do Pedro. Só corrigi "Você ganha tem vantagem".

> Em 1 minuto, a partir dos seus arredores, você ilustra um mapa da área, contendo tipo de terreno, hostilidades do
> local e informações gerais sobre a área em até 1000 m² (cerca de duas quadras de tênis).
> - Enquanto na área de um mapa fabricado por você:
>   - Você e aliados próximos não podem ficar *Desprevenidos*.
>   - Você tem vantagem em *Iniciativa*.
> - A cada mapa desenhado, nomeie-o com o nome do local e adicione 1 item: Mapa no inventário.

**Pontos para fechar** (proposta minha em cada um):

1. **"Aliados próximos"** é vago na mesa. Proponho "aliados que possam te ouvir", o padrão das técnicas de grupo; ou "a até 9 m".
2. **O mapa precisa estar com você?** Proponho que sim: "com o mapa no inventário".
   - Isso cria a escolha que o Pedro quer: vender o mapa rende Sins, mas o Batedor perde o bônus naquela área.
   - Se vender, pode redesenhar para usar, mas a cópia nova não vende de novo (ponto 4).
3. **Tamanho.** 1000 m² é um quadrado de ~32 m de lado, ~21 × 21 quadrados de 1,5 m. Proponho escrever os dois, porque a mesa mede em quadrados.
   - Uma quadra de tênis com a área de volta tem ~670 m², então "duas quadras" dá ~1340 m². O "cerca de" cobre a diferença.
4. **Limite de farm.** Proponho: **"Cada lugar rende 1 mapa com valor de venda. Partes de um mesmo lugar (bairros de uma cidade, trechos de uma floresta) contam como o mesmo lugar."**
   - É a definição de "lugar" do próprio *Colecionador de Horizontes*.
   - Sem essa regra, o jogador desenha 30 recortes de 1000 m² da mesma cidade e vende os 30.
   - A frase já entrou no item do CSV (abaixo); sai se o Pedro não quiser.
5. **Peso.** Pela regra geral, cada Mapa ocupa 1 bugiganga. Se for leve demais para isso, "10 mapas = 1 bugiganga", como a munição especial (D112).

**Item Mapa no Bazar: FEITO.** Nas duas cópias do CSV, 727 itens:

`Mapa | Bugiganga | Ordinário | Mapa de uma área de até 1000 m², com tipo de terreno, hostilidades e informações gerais do local. Leva o nome do local. Cada lugar rende 1 mapa com valor de venda. | 2d10+10 | Batedor · Loja | Não-craftável | Exploração`

O arquivo de efeitos foi para a rev. 9; o Mapa não mexe em número de ficha.

**A punição que o Pedro quer já sai das regras:**
- **O mapa leva 1 minuto.** Numa luta que começa sem mapa, não dá para desenhar no meio (1 minuto = 10 rodadas).
- **Fora da área:** sem mapa, o Batedor não tem proteção contra *Desprevenido*, não tem vantagem em Iniciativa e não usa a 2ª característica (§3).
- **Técnicas de saída:** duas técnicas abrem exceção, pagando o turno inteiro: *Terreno Ideal* e *Atento* (§4).

---

## 3. Característica 2 — três opções

Os requisitos, nas palavras do Pedro:
- mais forte que o Instinto;
- pouco tracking;
- sem tabela;
- não mexe no d20 (reservado ao Xamã);
- dá mobilidade e defesa;
- dá "mais ações de ataque de alguma forma elegante";
- funciona na área do mapa.

### A. Atalho (recomendada)

> **Atalho (3 Stamina, Ação Livre).** Na área de um mapa seu, 1 vez por turno, você se move até o seu Movimento sem
> provocar ataques de oportunidade e tem +2 de Evasão até o início do seu próximo turno. Depois desse movimento,
> a sua PMA volta a zero.

**Como cumpre cada pedido:**
- **Mobilidade:** o Atalho é um segundo movimento no turno, fora da ação de Mover (que continua 1 vez por turno), e sem ataque de oportunidade.
- **Defesa:** +2 de Evasão tira 10 pontos percentuais de cada ataque inimigo, ou seja, 15–18% do dano recebido. Somado a não levar ataque de oportunidade, dá para bater e sair.
- **"Mais ações de ataque", sem dar +1 Ação** (o efeito mais caro do sistema, 3 fontes travadas em 259 habilidades):
  - A ação que iria para Mover vai para Atacar.
  - A PMA zerada torna útil o ataque depois do movimento. É o golpe "de outro ângulo".

**Números** (Atacar(1), 1d6 + 3, contra um alvo só; a PMA é por alvo, D29):

| Turno | Acertos | DPR |
|---|---|---|
| Parado, 3 ataques | 1,05 | 7,4 |
| Mover + 2 ataques (sem mapa) | 0,95 | 6,5 |
| Ataque, **Atalho**, 2 ataques | **1,55** | **10,6** |

- Contra um alvo só, o ganho é de +43% sobre o turno parado e +63% sobre o turno em que precisa se mover.
- Contra alvos diferentes a PMA já zera (D29), e o Atalho vira só mobilidade e defesa.
- Com arma de 2 ações o ganho é mobilidade: o movimento é grátis e sobra 1 ação.

**Stamina:** 3 por turno. No nível 1 (19 de Stamina) dá 6 turnos; no nível 5 (73), 24 turnos. É onde o Vigor 8 vai.

**Âncoras de preço:**

| Referência | O que dá | Custo |
|---|---|---|
| *Oportunista* (Espadachim) | PMA −3 na rodada | 5 Stamina |
| *Tiro Duplo* (Artilheiro) | 1 ataque sem PMA | 1 Ação + 3 Stamina + 2 Concentração |
| *Passo do Vento* (Monge) | sem ataque de oportunidade | 3 Fluxo |
| *Campo de Batalha* (ultimate do General) | mover como ação livre, sem oportunidade, 1 minuto | ultimate |

O Atalho junta os três efeitos, mas só na área do mapa e 1 vez por turno. É a peça de poder da classe e o que paga a Saúde 3.

**Tracking:** nenhum contador. "Usei neste turno?" já é regra geral (D99), e o +2 de Evasão dura como o Defender de 1 ação.

**Rocket tag:** não gera *Exposto* nem mexe no crítico. O risco de retaliação continua: o ladino corpo a corpo ataca 3 vezes e abre 3 retaliações, que é o "frágil multi-ataque" pedido.

### B. Esquiva de Batedor (só defesa)

> **Esquiva de Batedor (2+ Stamina, Ação Livre).** Na área de um mapa seu, ao ser alvo de um ataque, some +1 à sua
> Evasão contra esse ataque para cada 2 Stamina gastos (máximo = Nível). Se o ataque errar, você pode se mover 1,5 m
> sem provocar ataques de oportunidade.

- É a *Barreira Instintiva* do Teurgo em Stamina (D126: custo variável dentro do uso).
- Defende bem e usa o Vigor 8, mas não dá "mais ações de ataque" e dá pouca mobilidade.

### C. Embalo (movimento vira defesa e dano)

> **Embalo (Passiva).** Na área de um mapa seu, se você se moveu ao menos 3 m neste turno, até o início do seu próximo
> turno você tem +2 de Evasão e o seu primeiro acerto no turno causa +1d6 de dano.

- Não gasta recurso e tem tracking mínimo.
- Separa bem o Batedor do Artilheiro, que quer ficar parado para a Concentração.
- Não dá mobilidade (só premia quem se move) nem ataque a mais. A Stamina 8 fica sem destino na característica.

### Comparação

| | A. Atalho | B. Esquiva | C. Embalo |
|---|---|---|---|
| Mobilidade | ✔ 2º movimento, sem oportunidade | pouca (1,5 m) | não (só premia) |
| Defesa | ✔ +2 Evasão | ✔✔ até +Nível | ✔ +2 Evasão |
| Mais ataques | ✔ ação livre + PMA zera | ✘ | ✘ (+1d6) |
| Tracking | 1 por turno | 1 por ataque | "andei 3 m?" |
| Usa a Stamina 8 | ✔ | ✔ | ✘ |

**Recomendo A.** Se o Pedro quiser mais defesa, a B vira técnica geral (a *Rolamento*, em §4, já é ela).

---

## 4. Técnicas gerais (15), em torno do mapa

Escritas assumindo a opção **A** (Atalho). Só *Rasgar o Mapa* depende dela; com a B ou a C, ela troca.

| Técnica | Descrição | Custo | Ação |
|---|---|---|---|
| Atento | Você é imune à condição *Desprevenido*. | — | Passiva |
| Passo Ciente | Você não ativa armadilhas de qualquer tipo e ignora terreno difícil. Na área de um mapa seu, aliados que possam te ouvir também ignoram terreno difícil. | — | Passiva |
| Leitor de Rastros | Você consegue distinguir peso, número da pegada, velocidade e direção de criaturas vendo rastros passivamente. | — | Passiva |
| Líder | Você possui a habilidade de memorizar caminhos e traçar trajetos eficientes. Você soma naturalmente +1 ao sucesso do grupo em jornadas já percorridas. Adicionalmente, ao rolar *Sobrevivência* em jornadas possui +5. | — | Passiva |
| Terreno Ideal | Você tem facilidade em se adaptar a um ambiente, e enquanto estiver nele recebe os seguintes benefícios:<br>+2 em testes de Sobrevivência<br>+2 em testes de Percepção<br>Pode gastar uma ação para rolar estes testes com vantagem.<br>Em seu terreno ideal, você desenha um mapa com 3 Ações em vez de 1 minuto.<br><br>Terrenos: (Urbano, Natural, Naval, Subterrâneo)<br>Pode escolher 1 no nível 1, 2 no nível 3 e 3 no nível 5. | 3 Stamina | Passiva ou 1 Ação |
| Armadilha Tática | Rapidamente configura uma armadilha no chão, rolando um teste de *Furtividade* ou *Sobrevivência* e atribuindo o resultado a ela. Quando um inimigo passar por cima ele deve superar a *Furtividade* ou *Sobrevivência* da armadilha rolando *Percepção* ou recebe 2d6+Mod. Destreza de dano Perfurante e fica *Enraizado* por 1 rodada. Na área de um mapa seu, a *Percepção* contra a armadilha tem desvantagem. Você mantém até (Nível) armadilhas montadas; ao montar mais uma, a mais antiga se desfaz. | 3 Stamina | 1 Ação |
| Reposicionar | Na área de um mapa seu, escolha um aliado, podendo ser você, em até 9 m. Ele pode se mover até 4,5 m como uma ação livre sem provocar ataques de oportunidade. | 3 Stamina | 1 Ação |
| Mirante | Na área de um mapa seu, marque o espaço de 1,5 m em que você está. Enquanto ficar nele, seus ataques à distância têm +2 em Atacar e você tem +2 de Evasão contra ataques à distância (não soma com a Evasão do Atalho). Sair do espaço encerra o efeito. | 3 Stamina | 1 Ação |
| Varredura | Na área de um mapa seu, role *Percepção* contra a *Furtividade* de cada criatura escondida em até 18 m. As que você superar deixam de estar escondidas para você e para os aliados que possam te ouvir. | 2 Stamina | 1 Ação |
| Ocultar-se | Ao estar fora da linha de visão de todas as criaturas da cena, pode se esconder com 1 ação em vez de 3. | 2 Stamina | 1 Ação |
| Rasgar o Mapa | Rasgue o mapa da área em que você está: até o fim do combate, o seu *Atalho* não custa Stamina. O mapa é destruído e sai do inventário. | 1 Mapa | Ação Livre |
| Rolamento | Na área de um mapa seu, ao ser alvo de um ataque, some +1 à sua Evasão contra esse ataque para cada 2 Stamina gastos (máximo = Nível). | 2+ Stamina | Ação Livre |
| Fantasma | Ao ser atacado e optar por se **defender**, pode somar seu treinamento de **Furtividade** na perícia. | 2 Stamina | Ação Livre |
| Por Aqui! | Na área de um mapa seu, quando um aliado que possa te ouvir se afastar de uma criatura, ele não provoca ataque de oportunidade dela. | 2 Stamina | Reação |
| Emboscada | Pode preparar um local previamente com armadilhas e distrações rolando um teste de *Sobrevivência* ou *Furtividade*: Ao lutar em um ambiente preparado, se o inimigo falhar em um teste de *Percepção* contra seu teste, você e seus aliados recebem +2 em Atacar durante todo o combate e os inimigos ficam *Desprevenidos* na primeira rodada do combate. | 5 Stamina | 10 Minutos |

### Origem de cada técnica

**Do Pedro, sem mudança de regra:**
- Atento, Líder, Fantasma e Emboscada, verbatim.
- **Leitor de Rastros:** é a *Caçador*, com outro nome, porque *Caçador* já é nome de origem.

**Do Pedro, com ajuste:**
- **Passo Ciente:** + aliados, na área do mapa.
- **Terreno Ideal:** + desenhar o mapa com 3 Ações no terreno ideal. É a saída cara para a luta que começa sem mapa: custa o turno inteiro, e só vale nos terrenos escolhidos.
- **Armadilha Tática:** + desvantagem na área do mapa e um teto de (Nível) armadilhas. Hoje não há limite.
- **Ocultar-se:** "em vez de 2" → "em vez de 3". O Sistema diz que esconder-se custa 3 ações.
- **Reposicionar:** era sub-habilidade do antigo *Desenhar Mapa de Combate*. O texto é do Pedro; o requisito passa a ser a área do mapa.

**Da rodada 1:** Varredura e Por Aqui!, agora ligadas à área do mapa.

**Novas:**
- **Mirante:** para a build à distância. Âncora: *O Próximo* (Brutalista) dá +2 Atacar contra 1 alvo pelo combate todo, por 1 Ação + 3 Stamina.
- **Rasgar o Mapa:** transforma o que a exploração achou em poder de combate. Queima um item que valia Sins e o bônus daquela área daqui em diante.
- **Rolamento:** a opção B como técnica, a defesa extra de quem quiser.

**Digitação:** "quaisquer tipo" → "qualquer tipo"; "numero" → "número"; "imune a condição" → "imune à condição"; "ao em vez de" → "em vez de"; custo "n/a" → "—".

**Mix:**

| Tipo | Batedor | Média das 6 classes (`19` §6) |
|---|---|---|
| Passivas | 4 (+1 "Passiva ou 1 Ação") | 6,3 |
| 1 Ação | 5 | 4,3 |
| Ação Livre | 3 | 1,5 |
| Reação | 1 | 1,3 |
| Fora de combate | 1 | 0,8 |

As ativas ficam acima da média de propósito: é a classe com mais Stamina.

**Ligação com as características:**
- **9 dependem da área do mapa:** Passo Ciente, Terreno Ideal, Armadilha, Reposicionar, Mirante, Varredura, Rasgar o Mapa, Rolamento e Por Aqui!.
- **Atento é a exceção de propósito:** protege quem foi pego sem mapa.

**Saem:**
- da lista de hoje:
  - **Curioso:** +1d4+DES em Percepção ou Investigação por 1 Ação. É fraco e não se liga ao mapa;
  - **Mãos Rápidas:** é Reação usada no próprio turno;
  - **Sigiloso:** fazia dois críticos escondidos por turno;
  - **Saque:** cria Sins a cada morte (D6);
  - **Oportunista:** vira *Tocaia* e vai para o ladino (§5);
  - **Língua Prateada:** vai para o Trambiqueiro (§5).
- da rodada 1: Vigia (o próprio Mapa cobre o acampamento) e Sinais (dependia do Instinto).

---

## 5. Ramos — direção

O texto completo vem depois da escolha da 2ª característica, porque os ramos são construídos em cima dela. Aqui vão o conceito, os ganchos e as perguntas.

### Cartógrafo — o mapa como poder

- **Marcas:**
  - *Colecionador de Horizontes* [Pedro]. Agora dispara com o item Mapa. Continua precisando de teto: +5 de Stamina máxima.
  - *Cicatrizes da Jornada* [Pedro].
- **T1:**
  - Passiva de treinamento em Sobrevivência.
  - *Desenhar Mapa de Exploração* [Pedro]: o mapa de região, de 1 km². Com ele, toda luta naquela região conta como área de um mapa seu. É o "sempre pronto" do Cartógrafo.
  - *Reconhecimento* [nova]: 1 minuto de instrução com o mapa, e os aliados que estudaram também têm vantagem em Iniciativa na área.
  - *Escapista* [Pedro].
- **T2:** *Coordenação* [Pedro, do antigo Mapa de Combate] e *Traçar Rota* [rodada 1].
- **T3:** *Senhor das Linhas* [Pedro]. Sai "Não pode ser flanqueado"; a armadilha causa dano Perfurante.
- ⚠️ **Artista Apaixonado** ("mapas contam como mercadoria Incomum") é exatamente a passiva que o Pedro reservou ao Trambiqueiro. Proponho mudar para lá.

### Sem-Nome — o ladino polido

- **Treinamento:** Crime ou Furtividade (qual das duas?).
- **Técnicas que puxam o Atalho:**
  - esconder-se logo depois de um Atalho;
  - *Tocaia* (ex-*Oportunista*: +1d8 contra *Desprevenido* ou *Exposto*);
  - *Golpe Sombrio* [Pedro];
  - *Finta* [Pedro, + sem retaliação no turno].
- **"Formas de acompanhar os outros ramos"** — leio como pontes com os outros dois. Confirma?
  - *Bater Carteira* (Crime): furta Sins em combate ou fora dele, e isso enche a carteira do Trambiqueiro.
  - *Olho de Ladrão*: ao mapear, acha passagem ou esconderijo que vira atalho no mapa.
- **Terror [Pedro]:** só no 20 natural, para fechar o laço de crítico.

### Trambiqueiro — a carteira é a arma

- **Núcleo, T1 [nova]:** *Bolso Cheio*: "+1 de dano por X Sins que você carrega, máximo +Nível". Duas coisas a calibrar:
  - **X, que depende de quantos Sins o grupo tem nos níveis 1, 3 e 5.** Pergunta ao Pedro.
    - X = 50 dá +5 no nível 5 com 250 Sins.
    - X = 100 dá +5 com 500 Sins.
    - Âncora: +5 de dano corpo a corpo permanente é carta rara do Limiar (FOR 16+). Com teto = Nível, só chega lá no nível 5 e custa guardar dinheiro em vez de comprar equipamento.
  - **O grupo pode passar os Sins para ele ("o banco do grupo").**
    - Proponho aceitar como escolha do grupo, porque o dinheiro parado nele não vira item.
    - Se não quiser, a regra vira "só contam Sins que você mesmo ganhou", e isso é tracking.
- **Mapa Valioso [nova]:** a passiva que sobe a raridade do Mapa (ex-*Artista Apaixonado*). Incomum no T1 e Exótico no T2? Com o limite de 1 venda por lugar, a renda depende de explorar lugar novo.
- **Do Pedro:** Língua Prateada (treinamento em Convencimento + desconto de 10%), Agiota, Conexões Duvidosas, Suborno Irrecusável e Esquemas.
  - Sobra uma técnica além das vagas, como na rodada 1: uma ultimate só.
  - Gancho novo: gastar Sins baixa o dano. O Suborno pode passar a custar Sins.

---

## 6. Decisões para o Pedro (responda por número)

1. **2ª característica:** A (Atalho, recomendada), B (Esquiva) ou C (Embalo)? E o custo do Atalho, 3 Stamina ou 2?
2. **Mapa, "aliados próximos":** "que possam te ouvir" ou "a até 9 m"?
3. **Mapa, benefício só com o mapa no inventário** (vender tira o bônus)?
4. **Mapa, limite de farm:** "cada lugar rende 1 mapa com valor de venda", com a definição de lugar do Colecionador. Já está no CSV.
5. **Mapa, tamanho em quadrados e peso:** escrever "~32 × 32 m (21 × 21 quadrados)"? E o peso, 1 por bugiganga ou 10 por bugiganga?
6. **As 15 técnicas de §4**, em especial as 3 novas (Mirante, Rasgar o Mapa, Rolamento) e a saída pelo *Terreno Ideal*: desenhar o mapa com 3 Ações.
7. **Artista Apaixonado → Trambiqueiro**, como a passiva de raridade do Mapa.
8. **Ladino:** treinamento em Crime ou em Furtividade? E "acompanhar os outros ramos" são as pontes com Sins e mapas?
9. **Trambiqueiro:** quantos Sins um grupo costuma ter nos níveis 1, 3 e 5? É isso que calibra o *Bolso Cheio*. O "banco do grupo" é permitido?
10. **Nomes da rodada 1 que ficam:** Leitor de Rastros (ex-Caçador) e Tocaia (ex-Oportunista).

---

## 7. Depois do aceite

1. Escrever os 3 ramos inteiros, no padrão do `19` §8.
2. Proposta final.
3. Notion (`8706e3a4…`), com `update_content` em blocos, e fetch.
4. `scripts/log-tecnicas/ndiff.py` contra o retrato de antes.
5. Log do novo Batedor no `17` §3.
6. Contrato rev. 11, bloco `classes.batedor`: `V/G/R 3/8/4`, a CD com escolha, o estado "na área de um mapa seu" e a 2ª característica. O recurso `instinto` sai.
7. Os 5 achados do Batedor em `pedroDecide` se fecham com o log.
