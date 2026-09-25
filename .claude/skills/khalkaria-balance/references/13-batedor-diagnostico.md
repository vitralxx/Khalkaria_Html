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
