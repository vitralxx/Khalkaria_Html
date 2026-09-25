# Batedor — diagnóstico antes do rework

Página viva: Notion `8706e3a4-01d9-823a-91fd-81f689a6fbe7` (Sistema Khalkaria / Classes).
Queixa do Pedro: *"é a classe mais antiga do sistema e simplesmente tem classes que fazem tudo
melhor, ninguém vai pegar ela."*

## Estado atual (do Notion, verbatim)

```
Saúde   10 + (4 × Nível) + (Mod.CON × Nível)      Vitalidade 4
Stamina  8 + (7 × Nível) + (Mod.FOR|DES × Nível)  Vigor      7
Éter     6 + (4 × Nível) + (Mod.INT|SAB × Nível)  Ressonância 4
CD      10 + Mod.DES + Mod.SAB
Treinado: Armas à Distância · Sobrevivência · Percepção
          + (1 + Mod.INT) entre Crime, Religião, Iniciativa, Medicina, Furtividade
Recurso de classe: Instinto (teto 5)
Ramos: Cartógrafo (exploração) · Trambiqueiro (dinheiro/social) · Sem-Nome (furtividade/assassinato)
```

## 🔴 Problema 1 — O Instinto é matematicamente inutilizável

A regra de perda: *"Ao falhar qualquer perícia → = 0 Instinto"*. **Atacar é perícia.**

| | |
|---|---|
| Acertar os 3 ataques do turno (60/35/10) | **2,1%** |
| Errar pelo menos um → Instinto zera | **97,9%** |
| Com 1 ataque/turno (arma de 2–3 ações) | zera em **40%** dos turnos |

Ganho máximo: 2 por rodada (1 perícia + 1 acerto), 3 com esquiva. Custos: 2 · 3 · 4 · 5. Teto 5.
Chegar a 5 exige ~3 rodadas **sem nenhuma falha de perícia**:

```
com 3 ataques/turno:  0,0009%
com 1 ataque/turno:     21,6%
```

**O recurso zera por acaso, não por escolha.** As habilidades de 4 e 5 (Golpe Instinto, Instinto
Reativo) são, na prática, inalcançáveis para quem ataca. Um Batedor que **não** ataca acumula
melhor — o incentivo está invertido.

## 🔴 Problema 2 — Status idênticos ao Artilheiro

Pelo deck do patch, os coeficientes são `Batedor 4/7/4` e **`Artilheiro 4/7/4`**. Mesmos status,
mesma família de arma (à distância), e o Artilheiro é desenhado para combate. O Batedor é o
Artilheiro trocando dano por exploração — e exploração não ganha combate.

## 🔴 Problema 3 — 5 de 15 técnicas servem em combate

Exploração/social: Passo Ciente · Caçador · Líder · Terreno Ideal · Língua Prateada · Curioso · Saque
Combate: Oportunista · Armadilha Tática · Fantasma · Mãos Rápidas · Sigiloso (+ Atento, defensiva)

Emboscada exige 10 minutos de preparação prévia — não é técnica de combate, é de planejamento.

## 🟠 Problema 4 — Não tem característica de classe que puxe o resto

O Espadachim ganhou a **Marca do Duelo** e quase toda técnica dele passou a funcionar contra ela.
O Teurgo tem as **Escolas**. O Alquimista tem os **reagentes**. O Batedor tem o Instinto, que não
funciona — então as técnicas dele não conversam entre si.

## 🟡 Observações menores

- **Mãos Rápidas** (reduz PMA em 2, 2 Stamina, Reação) encosta no **Presságio**, o truque de
  Abjuração que ignora a PMA inteira. Vale comparar antes de mexer.
- **Saque** e o **Olho no Lance** (Trambiqueiro Tier 2, +20% de Sins) foram desenhados antes do
  nerf de economia dos comerciantes por nível (D6).
- **Homem de Negócios** (Marca do Trambiqueiro) tem o texto cortado no Notion:
  *"Você possui um disturbio de mat"*.
- **Golpe Instinto** diz *"Reduz a margem de crítico do seu próximo ataque em 3 (17-20)"* — pelo
  patch, crítico agora é só em 20 natural e margem de ameaça expande a faixa. O texto usa a
  terminologia antiga.

## Eixos possíveis para o rework (a decidir com o Pedro)

1. **Consertar o Instinto** — tirar "falhar perícia" da lista de perda, ou trocar perda total por
   perda parcial. É a correção mínima que torna a classe jogável.
2. **Separar do Artilheiro** — mudar os coeficientes ou a identidade de arma.
3. **Dar uma característica de classe** no molde da Marca do Duelo, que faça as técnicas
   conversarem.
4. **Trazer a exploração para dentro do combate** — o que a classe sabe fazer (terreno, rastro,
   armadilha, posição) virar vantagem tática em luta, em vez de utilidade fora dela.


---

# DECISÃO E PRÓXIMO PASSO  ·  2026-09-25

**Escopo aprovado: 3 — rework completo** (D79). E ele é o **protótipo da infraestrutura de
classe**: o que sair daqui vira régua para Vigário, Vampiro, Necromante, Xamã, e para as raças e
origens novas. Cada número precisa vir com a regra que o gerou.

## O que eu ainda preciso ler antes de propor

1. **As outras 6 classes clássicas** no Notion, para montar a tabela comparativa de técnicas —
   quantas servem em combate, quanto custam, e o que cada recurso de classe faz.
   `Classes` = `3a66e3a4-01d9-809b-8ece-ec1f30be9fd2`
2. **O Artilheiro em particular** — é quem sobrepõe o Batedor (4/7/4, arma à distância).
3. **A página raiz Sistema Khalkaria** `2b76e3a4-…` — regra de ação, reação, furtividade e
   terreno, que é onde o Batedor deveria ganhar tração.

## Réguas que já tenho e valem aqui

- **DPR canônico:** 1 ação (3 ataques 60/35/10) = `1,20D + 1,05·mod` · 2–3 ações (1 ataque) =
  `0,65D + 0,60·mod`. Referência nv5 = 18–25. Saúde mediana nv5 ≈ 55.
- **Orçamento de coeficiente:** toda classe distribui **15 pontos** entre Vitalidade, Vigor e
  Ressonância. Batedor e Artilheiro estão os dois em `4/7/4`.
- **Fórmula de status:** `base + (coeficiente × Nível) + (Mod × Nível)`.
- **PMA:** −5 cumulativo, contado **por alvo** (D29).
- **Evasão passiva = 10 + Mod.DES** em todas as classes (D20).

## A pergunta de desenho que abre o rework

O Batedor sabe fazer coisas que **nenhuma outra classe faz** — ler terreno, preparar emboscada,
mapear, andar sem ativar armadilha. O problema é que tudo isso vale **fora** do combate, e combate
é onde a comparação entre classes acontece.

**O rework tem que trazer a exploração para dentro da luta:** terreno, rastro, posição e preparação
virando vantagem tática em combate, e não utilidade de viagem. Se isso der certo, o Batedor deixa
de ser "Artilheiro pior" e passa a ser a classe que **escolhe onde a luta acontece**.

---

# MÉTODO DE VALIDAÇÃO  ·  simulador vs. subagente

Pergunta do Pedro: adotar subagentes que **joguem o RPG de verdade**, cientes das regras, testando
classe contra classe? Resposta: **boa ideia, escopo errado.** As duas metades se separam limpo.

## Por que subagente NÃO serve para número

1. **LLM é mau escriturário.** Um combate de 5 rodadas com 2 combatentes tem ~60 mutações de
   estado (Stamina, PMA por alvo, condição expirando, Ar reduzindo dano, reação já gasta). O erro
   acumula em silêncio e o agente reporta o resultado com a mesma confiança de sempre.
2. **O resultado não é auditável.** "Batedor perde 7 de 10" não é falseável. Isso viola a §6 do
   protocolo — *não confiar em lista digitada à mão, extrair por script, comparar por conjunto* —
   que existe justamente porque conferência no olho já falhou aqui (a carta duplicada do Limiar).
3. **Agente não joga como jogador.** Ou otimiza, ou escolhe por sabor. Balanceamento precisa do
   jogador **mediano**, que é nenhum dos dois.
4. **A superfície de regra é cara.** 22 perícias, 30 condições, PMA por alvo, 3 ações, Ar/Ae,
   12 tipos de dano, intensidade, modulação, 3 status. Cada agente nasce frio e re-deriva tudo.

## O caso que decide a questão: o Instinto

O bug saiu de **uma conta**: `0,60 × 0,35 × 0,10 = 2,1%`. Dez combates simulados por agente teriam
produzido a sensação *"o Instinto vive zerando"* — nunca o **97,9%**, que é o que vira decisão.

## `simulador.py` — a peça a construir

Determinístico, 10 mil iterações, reprodutível, auditável. Mesmo princípio do `auditor.py`.
**E é a infraestrutura que a D79 pede:** recebendo a classe como dado (JSON), serve igual para
Vigário, Vampiro, Necromante e Xamã — muda o coeficiente, roda a matriz de confronto inteira.

Ele precisa modelar, no mínimo: 3 ações/turno · PMA −5 por alvo (D29) · 60/35/10 · crítico só em
20 natural + margem de ameaça · Ar e Ae · Stamina/Éter como recurso que acaba · condições com
expiração · reação disputada (Defender × habilidade de classe).

## Onde subagente É melhor que script e melhor que eu

Simulação não responde: a técnica é **divertida**? dá **trabalho de anotar** na mesa? um **advogado
de regras** torce o texto? a **fantasia** se sustenta? Isso é leitura de linguagem.

Um agente com uma técnica e a instrução **"ache o exploit"** é barato, tem entregável claro, e pega
o tipo de coisa que número nenhum pega — como a *Leitura de Batalha* do Espadachim, que o Pedro
matou não por ser forte, mas por ser impossível de trackear com 10 inimigos.

## A divisão

| O que validar | Ferramenta |
|---|---|
| Número, confronto, atrito de recurso, DPR, sobrevivência | **`simulador.py`** |
| Exploit, ambiguidade de texto, carga de tracking, fantasia | **subagente lendo o texto** |

---

# Rodada 1 do rework (2026-09-25) — a espinha, antes das técnicas

Fontes lidas hoje, verbatim: páginas **Batedor** `8706e3a4` e **Artilheiro** `d896e3a4`.

## Teste de sobreposição Batedor × Artilheiro (primeira régua reutilizável da D79)

Método: comparar eixo por eixo o que as duas classes **entregam na mesa**, não o nome das coisas.

| Eixo | Batedor | Artilheiro | Sobreposição |
|---|---|---|---|
| Coeficientes | 4/7/4 | 4/7/4 | **total** |
| CD | 10 + DES + SAB | 10 + DES + SAB | **total** |
| Arma treinada | À Distância | À Distância | **total** |
| Atributos recomendados | DES, SAB, INT | DES, SAB, (INT ou CON) | quase total |
| Perícias iniciais | Sobrevivência, Percepção | Atacar, Percepção | Percepção |
| Lista de escolha | Crime, Religião, Iniciativa, Medicina, Furtividade | Furtividade, Iniciativa, Ofício(Eng.), Investigação, Movimento | Furtividade, Iniciativa |
| Não ser Desprevenido | *Atento* (sempre) | *Sentidos Aguçados* (por quem vê) | parcial |
| Ataque escondido | *Oportunista* +1d8 · *Golpe Sombrio* +1d6 | *Tiro Camuflado*: crítico ao acertar | **o Artilheiro faz melhor** |
| Rastreio | *Caçador* | *Marca no Alvo* (direção até 1 km) | parcial |
| Ramo furtivo | Sem-Nome (Furtividade e Assassinato) | Predador (Flechas e Furtividade) | **alta** |
| Veneno | *Cobra* (Sem-Nome T2, cria) | *Projétil Envenenado* (Vendaval T2, aplica) | alta |
| Recurso | Instinto (quebrado) | Concentração (funciona; bug do teto, C15) | — |

**Conclusão:** o Artilheiro já entrega a fantasia de combate do Batedor (distância + furtividade +
rastreio) com um recurso que funciona. O que só o Batedor tem é **Cartógrafo** (mapas) e
**Trambiqueiro** (dinheiro/social) — os dois fora de combate. O rework precisa dar ao Batedor um
**papel de combate que o Artilheiro não tem**, e não um Artilheiro melhor.

**O papel livre no sistema:** ninguém controla o **campo**. O Artilheiro é atacante à distância, o
Espadachim é duelista, o Brutalista aguenta, o Monge se move, o Teurgo conjura, o Alquimista
abastece. Ninguém protege o grupo pela **posição** nem impede emboscada. O melhor conteúdo de
combate do Batedor já faz isso, e está **enterrado no Tier 2 do Cartógrafo, atrás de 5 minutos
de preparo**: *Desenhar Mapa de Combate* ("Você e seus aliados não podem ser Desprevenidos"),
*Coordenação*, *Ponto Cego*, *Reposicionar*.

## Régua de recurso de classe (segunda régua reutilizável da D79)

Tirada dos três recursos que funcionam:

| Recurso | Ganha com | Perde com | Teto | Enche em |
|---|---|---|---|---|
| Fluxo (Monge) | agir: acerto 2×, esquiva, condição, mover | fim do combate | 5 | ~2 rodadas |
| Brutalidade | levar 5+ de dano de uma fonte | fim do combate | 5 | ~2–3 |
| Concentração | acerto +1, crítico +2, mirar +2, parado +1 | dano −1, mover −1, falhar resistência −2, aliado cai −3 | 3 + SAB | ~2 |
| **Instinto (hoje)** | perícia, acerto, esquiva | **tudo** ao falhar qualquer perícia, Atordoado, Desorientado, Desprevenido, dano > ½ | 5 | **nunca** (0,0009%) |

- **R1.** O ganho vem do que a classe **quer** fazer.
- **R2.** Falha de dado nunca zera o recurso. Zerar só vem de fim de cena ou de falha tática clara.
- **R3.** O teto se alcança em 2–3 rodadas de jogo normal, com probabilidade ≥ 50% — **medida por
  conta ou simulação**, não por impressão.
- **R4.** Nenhum gasto acima do teto mais baixo possível (lição do C15, Concentração).
- **R5.** No máximo 1 ganho por gatilho por rodada — a mesa conta ≤ 3 eventos por rodada.
- **R6.** Se a classe tem um jeito de chegar preparada, a vantagem de preparo tem que aparecer no
  número.

## Proposta (a decidir com o Pedro)

**P1. Papel:** tático de campo. Lê o terreno, impede emboscada, posiciona e protege o grupo, e
expõe o alvo para o atacante do grupo. Continua atirando, mas não compete em dano com o Artilheiro.

**P2. Característica de classe — Mapa de Combate** (sai do Cartógrafo T2 e vira da classe, nível 1):
- O combate começa **mapeado** se você observou o local por ao menos 1 minuto antes da luta, ou se
  tem o *Mapa de Exploração* da região.
- Em combate, você mapeia com **1 Ação e 2 Stamina**. Sem teste de manutenção: o *Mapa Mental*
  atual pede Percepção CD 15 toda rodada, que é o mesmo defeito do Instinto (perder o recurso no dado).
- Com o campo mapeado: **você e seus aliados não podem ficar Desprevenidos**, e você ganha +1
  Instinto no início de cada turno seu.
- Tracking: **um estado sim/não por combate.** O menor custo de mesa possível.

**P3. Instinto novo:**
- Máx. 5. Começa cenas de exploração com 0; ao começar um combate, **mantém** o que tinha (R6).
- Ganha, cada um no máx. 1× por rodada: **Leitura** (+1 no início do turno, com o campo mapeado) ·
  **Acerto** (+1) · **Esquiva** (+1 quando um ataque contra você erra) · **Perícia** (+1 ao suceder
  numa perícia que não seja Atacar nem Defender; fora de combate, 1× por perícia por cena).
- Perde: **Desprevenido zera** (o batedor foi surpreendido: é falha tática, não de dado) ·
  dano > ½ da Saúde máxima de uma vez: **perde metade** · fim da cena, ou 10 min fora de combate
  sem ganhar: zera.
- **Sai:** zerar ao falhar perícia, ao ficar Atordoado e ao ficar Desorientado (*Desorientado* é
  piso Ordinário da D33 — toda arma contundente aplica por 2 Stamina; zerar o recurso inteiro com a
  condição mais barata do jogo é punição desproporcional).

Simulação (`batedor-sim-instinto.py`, 200 mil combates, sem gastar no caminho), **P(chegar a 5)**:

| Situação | rodada 2 | rodada 3 | rodada 4 |
|---|---|---|---|
| **Hoje**, 3 ataques por turno | ~0% | 0,0009% | — |
| Mapeado, começa com 0, 3 ataques | 26% | **88%** | 98% |
| Mapeado, começa com 2 (veio da exploração) | **92%** | 99% | 100% |
| Sem mapa, começa com 0 | 0,3% | 8% | 32% |
| Mapeado, arma de 1 ataque (Atacar 2) | 18% | 77% | 96% |

O mapa é o motor (88% contra 8%), e a arma quase não importa (88% contra 77%): o recurso não
depende de o Batedor ser atacante.

**P4. Gastos de Instinto** (a tabela da classe, refeita):

| Habilidade | Custo | Efeito | Ação | De onde vem |
|---|---|---|---|---|
| Pressentimento | X | +X em qualquer perícia em que você é ao menos Treinado | Ação Livre | mantém |
| Cuidado! | 2 | Um aliado a até 9 m que você vê, alvo de um ataque, soma +2 à Evasão contra ele | Reação | substitui *Sexto Sentido* (+2 Evasão só em você) |
| Primeiro a Ver | 3 | Ao rolar Iniciativa, você e um aliado rolam com vantagem | Ação Livre | substitui *Segundo Fôlego* (re-rolar a própria Iniciativa) |
| Brecha | 4 | Uma criatura no campo mapeado que se moveu nesta rodada fica *Exposta* | 1 Ação | é o *Ponto Cego* do Cartógrafo T2, promovido; substitui *Golpe Instinto* |
| Instinto Reativo | 5 | Você pode usar sua Reação mesmo que já a tenha gastado nesta rodada | Ação Livre | mantém |

Âncora de preço da *Brecha*: a modulação **Marcar** (Destruição, +5 Éter) deixa o alvo *Exposto*
**se acertar**. A Brecha custa 4 de 5 Instinto + 1 Ação e exige que o alvo tenha se movido.
*Golpe Instinto* sai porque é ruim, não por tema: 1 Ação + 4 Instinto para +15% de chance de
crítico num ataque rende ~1,6 de dano.

**P5. Coeficientes: 5/6/4** (combinação que nenhuma classe usa). +1 Vitalidade porque o batedor vai
na frente e é o primeiro a levar a emboscada; −1 Vigor porque o Instinto passa a carregar parte da
economia que era da Stamina.

**P6. Separar o Sem-Nome do Predador:** Sem-Nome vira **curta distância** — as técnicas dele já
puxam para lá (*Finta* a 1,5 m, *Sussurro Final* exige morte corpo a corpo, *Golpe Sombrio*
"não pode ser retaliado", que só importa corpo a corpo). O Predador fica com o tiro escondido.

## Achados de passagem

- 🔴 **Colisão de nome:** *Ponto Cego* é técnica do Cartógrafo (T2) **e** truque de Conhecimento
  (Nível 1, D68). Um dos dois precisa trocar. Se a Brecha (P4) for aceita, resolve do lado do Batedor.
- 🔴 **Ocultar-se está desatualizada:** diz *"pode se esconder com 1 ação ao em vez de 2"*, mas a
  página Sistema diz que esconder-se custa **3 ações** (*"rolando a perícia de Furtividade com 3
  ações"*). A carta *Sombras* do Limiar já usa a forma certa: *"gasta −1 ação para se esconder (mín. 1)"*.
- 🟠 **Cobra** (Sem-Nome T2) **cria** venenos; a D72 travou veneno na Alquimia. Técnica de classe
  não é craft, então não é contradição direta, mas pisa na família que acabamos de dar ao Alquimista.
- 🟠 **D87 muda a régua de DPR:** +2 atributos por nível leva o atributo principal a +5/+7 no nível
  5; o modelo foi calibrado com +3. Recalibrar **antes** de medir as técnicas.

## Próximo passo

Esperar o veredito do Pedro em P1–P6 e as concepções dele. Depois: recalibrar o DPR (D87) →
orçamento de técnica → as 15 técnicas uma a uma, no formato `Nome | texto exato | proposta`.
