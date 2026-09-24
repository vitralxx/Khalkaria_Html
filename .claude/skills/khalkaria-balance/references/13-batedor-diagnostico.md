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
