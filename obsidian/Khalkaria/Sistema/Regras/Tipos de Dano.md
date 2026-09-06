---
tipo: regra
status: canon-pedro
spoiler: publico
era: atemporal
aliases: [Tipos de Dano, Dano Ordinário, Dano Elemental, Dano Biológico, Dano Místico, Cortante, Perfurante, Contundente, Fogo, Frio, Elétrico, Veneno, Ácido, Psíquico, Radiante, Trovejante, Necrótico, Força, Dano Primordial]
fonte_notion: [2b76e3a401d980c0ab7bc27a342f4ee1, 4e66e3a401d9832b97b4017bc00ff2c2, pedro-2026-09-05]
ultima_sync: 2026-09-05
tags: [khalkaria/sistema, khalkaria/sistema/regras]
---

# Tipos de Dano

**Resumo.** **12 tipos de dano em 4 categorias** (resposta B1 do Pedro, cânone atual): **Ordinários** (Cortante, Perfurante, Contundente) — reduzidos por Armadura (Ar); **Elementais** (Fogo, Frio, Elétrico); **Biológicos** (Veneno, Ácido, Psíquico); **Místicos** (Radiante, Trovejante, Necrótico, **Força** e **Primordial**). Tudo que não é Ordinário é *atípico* e reduzido por Armadura Específica Ae(Tipo, Quant.). **"Gelo" na raiz do Notion é erro** — o tipo é **Frio**.

## Segundo o Pedro (2026-09-05)

**B1 (integral):**
> Ordinários(Corante, Perfurante Contundente), Elementais(Fogo, Frio Elétrico), Biológicos(Veneno, Ácido, Psíquico), Místico(Radiante, Trovejante, Necrótico, Força e Primordial). Dano de força é gravidade geralmente e oriundo dos deuses. Dano primordial é energia vazada do Plano Primordial ou o Primórdio, extremamente rara e a mais poderosa, é a substância que faz constitui a sutentação do universo.

| Categoria | Tipos | Notas |
|---|---|---|
| **Ordinários** | Cortante · Perfurante · Contundente | Reduzidos por **Ar** (Armadura). São os subtipos ordinários citados por cartas e magias ("Dano Ordinário (Contundente, Perfurante, Cortante)"). |
| **Elementais** | Fogo · Frio · Elétrico | "Gelo" (raiz) e "Eletricidade" (Superfícies) são grafias antigas de **Frio** e **Elétrico**. |
| **Biológicos** | Veneno · Ácido · Psíquico | *Sangramento*, *Envenenamento* e *Morrendo* dizem causar "dano Biológico" — categoria usada como se fosse tipo (ver Conflitos). |
| **Místicos** | Radiante · Trovejante · Necrótico · **Força** · **Primordial** | **Força** = gravidade, geralmente oriundo dos [[Cosmologia|deuses]]. **Primordial** = energia vazada do [[Primórdio]], extremamente rara e a mais poderosa, "a substância que constitui a sustentação do universo". |

Consequências mecânicas: quase toda resistência de item ou carta exclui **Força e Primordial** ("Exceto: Força e Primordial"), justamente porque são os dois tipos divinos/primordiais.

## Cânone (Notion) — versão desatualizada

Raiz "Sistema Khalkaria", seção *Dano, Ataque e Defesa*:

| Ordinário | Atípico | Outros |
|---|---|---|
| Cortante | Elemental (Fogo ; Frio ; Gelo) | Força |
| Contundente | Biológico (Veneno ; Ácido ; Psíquico) | Primordial |
| Perfurante | Místico (Radiante ; Trovejante ; Necrótico) | |

Template de Ficha, seção *Armadura* (12 linhas): Ordinário · Ácido · Fogo · **Gelo** · Elétrico · Trovejante · Veneno · Necrótico · Radiante · Psíquico · Força · Primordial — usa "Gelo" **e** "Elétrico", e **não** lista "Frio".

## Relações
- **Faz parte de** → [[Sistema]]
- **Aplicado por** → [[Armas e Munição]], [[Regras de Magia]], [[Condições]]
- **Reduzido por** → [[Dano, Ataque e Defesa]] (Ar, Ae, Resistência, Vulnerabilidade)
- **Dano Primordial vem de** → [[Primórdio]] · via [[Primordial]] (magias de nível 4) e [[Éter]]
- **Dano de Força associado a** → [[Cosmologia|deuses]]
- **Resistências e imunidades na ficha** → [[Criação de Personagem]]
- **Cartas que escolhem tipo de dano** → [[O Limiar (cartas)]] (Resistência Arcana, Escamas de Dragão, Corrente Elemental, Lenda Monge)

## Conflitos e pendências
- **"Gelo" × "Frio".** Raiz lista Fogo/Frio/**Gelo** (duplicado, sem Elétrico); Template lista **Gelo** e Elétrico sem Frio; magias usam **Frio** (*Toque Gélido*, *Lança de Gelo*). **B1 fixa Frio** — corrigir raiz, Template e as cartas do Limiar que dizem "Gelo".
- **Categoria usada como tipo.** *Sangramento X*, *Envenenamento* e *Morrendo* causam "dano Biológico"; **Biológico é categoria**, então `Ae(Biológico, X)` é indefinido. Escolher um tipo (Veneno?) ou formalizar Ae de categoria.
- **Ae de subtipo ordinário.** Regras tratam Ordinário como bloco reduzido por Ar, mas cartas dão "Resistência a Dano Ordinário (Contundente, Perfurante, Cortante)". Conferir se Ae aceita subtipo.
- **"Místico" como tipo de dano** aparece em magias (*Limiar Perfurante* "2d10 Místico"; *Disparo Veloz* "1d12 Místico"; *Reversão Umbral* "reflete como Místico") e no exemplo da raiz `Ae(Místico, 2)`, mas **Místico é categoria**, não tipo. Pendência.

## Fonte
Notion `2b76e3a401d980c0ab7bc27a342f4ee1` (Dano, Ataque e Defesa) e `4e66e3a401d9832b97b4017bc00ff2c2` (Template de Ficha). Raw: `docs/memoria/notion_raw/sistema_root.md`, `template_ficha_de_personagem.md`. Digest: `A_sistema.md` §1.7, §3.2, §3.24. Resposta do Pedro **B1**.
