---
tipo: regra
status: canon-notion
spoiler: publico
era: atemporal
aliases: [Ficha, Ficha de Personagem, Template de Ficha, Criação, Grimório]
fonte_notion: [3a66e3a401d9806681b8f403c4700b11, 4e66e3a401d9832b97b4017bc00ff2c2, 2b76e3a401d980c0ab7bc27a342f4ee1]
ultima_sync: 2026-09-05
tags: [khalkaria/sistema, khalkaria/sistema/regras]
---

# Criação de Personagem

**Resumo.** Cria-se um personagem em duas etapas: **rolar atributos** (4d6, retire o pior, 5 vezes; realocação de 1 ponto permitida) e **escolher raça, classe e origem, nesta ordem**. A ficha física tem 5 blocos — identidade, atributos e perícias, recursos e armadura, equipamento, técnicas/marcas, cartas do [[O Limiar|Limiar]] e Grimório (só para [[Teurgo|teurgos]]).

## Cânone (Notion)

### Passo a passo (raiz)
> 1. Role 4d6, retire o pior, some e anote o valor. Faça isso 5 vezes, e distribua os valores dentre seus atributos. Você pode retirar 1 ponto de um atributo e adicionar a outro.
> 2. Escolha sua raça, classe e origem, nesta ordem.

A página "Criação de Personagem" (status 🟡 Em desenvolvimento) contém **apenas** o link para a subpágina Template.

### Template - Ficha de Personagem (🟢 Pronto)
- **Informações Básicas** — Nome do Personagem / Jogador / Raça / Classe / Origem / Nível / XP / Sins
- **Atributos** — Força (FOR) · Destreza (DES) · Constituição (CON) · Inteligência (INT) · Sabedoria (SAB), com colunas Valor e Modificador
- **Perícias** — tabelas com colunas +2 / +4 / +6 / +8 / Total:
  - *Perícias de Combate:* Atacar (For) · Defender (Des/Con) · Movimento (For/Des)
  - *Perícias de Resistência:* Fortitude (Con) · Vontade (Sab) · Reflexos (Des)
  - *Perícias de Exploração:* Percepção (Sab) · Sobrevivência (Sab) · Furtividade (Des) · Crime (Des)
  - *Perícias Sociais:* Iniciativa (Des) · Conhecimento (Int) · Medicina (Int) · Investigação (Int) · Religião (Sab) · Místico (Int) · Conhecer (Des/Int) · Intimidar (For/Sab) · Intuição (Sab) · Enganar (Des/Int) · Motivar (Sab) · Ofícios
- **Recursos** — Saúde, Stamina e Éter (Atual/Máximo)
- **Armadura** — 12 tipos: Ordinário · Ácido · Fogo · Gelo · Elétrico · Trovejante · Veneno · Necrótico · Radiante · Psíquico · Força · Primordial
- **Equipamentos** (8 linhas) e **Bugigangas** (6 linhas)
- **Técnicas e Marcas** — Técnicas Gerais (6) · Técnicas de Ramo Tier 1 / Tier 2 / Tier 3 (3 cada) · Técnicas Diversas (3) · Marcas (3)
- **Cartas do Limiar** — Carta 1 … Carta 11
- **Grimório (Para Teurgos)** — Níveis 1 a 4, colunas Nome / Ação / Alvo / Resist / Alcance / Duração (4 linhas cada)
- **História**

## Segundo o Pedro (2026-09-05)
- **B16** — no Template, "Conhecer", "Intimidar", "Enganar" e "Ofícios" são grafias antigas de **Convencimento**, **Intimidação**, **Enganação** e **Ofício(X)** ([[Atributos e Perícias]]).
- **B5** — a linha "Cartas do Limiar 1…11" bate com a faixa de **5–11 cartas ao nível 5**.
- **B8** — o Grimório ainda não tem nível 0: *"Eu criarei +20 magias nvl 0 que atuaram como truques que não custam éter pros teurgos nvl 1, que atualmente não tem magias."*
- **B1** — a lista de Armadura do Template deve trocar **Gelo** por **Frio** ([[Tipos de Dano]]).

## Relações
- **Faz parte de** → [[Sistema]]
- **Etapa 1** → [[Atributos e Perícias]] · **Etapa 2** → raça ([[Humano]], [[Anão]], [[Dryad]], [[Autômato]], [[Gruto]], [[Inseto]], [[Corrompido]]), classe ([[Espadachim]], [[Batedor]], [[Brutalista]], [[Teurgo]], [[Monge]], [[Alquimista]], [[Artilheiro]]) e [[Origens]]
- **Preenche** → [[Inventário e Peso]], [[Tipos de Dano]] (armadura), [[O Limiar (cartas)]], [[Regras de Magia]] (Grimório)
- **Evolui por** → [[Progressão]]
- **Exportada para** → app Bestiário Khalkaria (`type: "npc"`, colunas `prof_*`)

## Conflitos e pendências
- **Agrupamento errado:** Iniciativa, Conhecimento, Medicina, Investigação, Religião e Místico estão sob "Perícias Sociais" no Template.
- **Nomes e atributos de perícia divergem da raiz** (ver [[Atributos e Perícias]] → Conflitos). Raiz vence (B6/B16).
- **"Gelo" na tabela de Armadura** deve virar **Frio** (B1).
- **A página "Criação de Personagem" está vazia** (🟡): só link para o Template. Deveria conter o passo a passo, hoje só na raiz.
- **Sins iniciais** não constam em lugar nenhum das páginas de sistema.

## Fonte
Notion `3a66e3a401d9806681b8f403c4700b11` (Criação de Personagem), `4e66e3a401d9832b97b4017bc00ff2c2` (Template - Ficha de Personagem), `2b76e3a401d980c0ab7bc27a342f4ee1` (Atributos Iniciais). Raw: `criacao_de_personagem.md`, `template_ficha_de_personagem.md`, `sistema_root.md`. Digest: `A_sistema.md` §1.23.
