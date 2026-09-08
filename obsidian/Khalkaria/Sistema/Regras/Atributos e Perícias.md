---
tipo: regra
status: canon-pedro
spoiler: publico
era: atemporal
aliases: [Perícias, Atributos, Proficiência, Treinamento, Defender, Ofício, Status, Saúde, Stamina]
fonte_notion: [2b76e3a401d980c0ab7bc27a342f4ee1, 4e66e3a401d9832b97b4017bc00ff2c2]
ultima_sync: 2026-09-05
tags: [khalkaria/sistema, khalkaria/sistema/regras]
---

# Atributos e Perícias

**Resumo.** Khalkaria tem **5 atributos** (Força, Destreza, Constituição, Inteligência, Sabedoria; 8–18) — **não existe Carisma**. Quase toda rolagem é 1d20 + Mod. do atributo + **proficiência** na perícia, numa escala de cinco degraus (**+0 Leigo → +2 Treinado → +4 Experiente → +6 Mestre → +8 Lendário**). São **22 perícias**, e **Defender** é a única exceção do sistema: o treinamento aumenta o *dado* (1d6 → 2d8) em vez de somar modificador. Todo personagem carrega ainda três status universais definidos pela classe: **Saúde**, **Stamina** e **[[Éter]]**.

## Atributos

> - Força 8-18
> - Destreza 8-18
> - Constituição 8-18
> - Inteligência 8-18
> - Sabedoria 8-18

Os valores são rolados na abertura da ficha e a raça, a classe e a origem entram depois — o passo a passo está em [[Criação de Personagem]]. De cada atributo sai o **modificador** que soma em todas as rolagens; a fórmula praticada é `(Atributo − 10) / 2`, ainda não escrita em nenhuma página de regra (ver Pontas soltas).

## Status

> Sua classe determina os valores dentre estes 3 status universais:
> - **Saúde:** Condição física. Ao reduzir a 0 ou menos, você recebe a condição *Morrendo.*
> - **Stamina:** Vigor perante o cansaço eminente. Pericias e habilidades utilizam Stamina. Ao reduzir a 0, fica *Exaurido*.
> - **Éter:** Energia primordial que todo ser tem. Define sua sanidade e energia espiritual. Ao reduzir a 0 ou menos fica *Oco.*

Os três estados terminais estão descritos em [[Condições]]. Além destes, cada classe pode ter um **Recurso de Classe** próprio — o FLUXO do [[Monge]], a Concentração do [[Artilheiro]] — descrito na página da classe, não aqui.

## Rolagens

> **Em ordem de regra, quase todas as rolagens utilizam o d20.**
> **Crítico**: Se tirar 20 no dado você críta.
> **Falha Crítica**: Se tirar 1 no dado você falha criticamente.

## Proficiência

> Ao rolar uma perícia soma-se seu nível de proficiência nela, variando entre:
> **+0 Leigo → +2 Treinado → +4 Experiente → +6 Mestre → +8 Lendário**
> Proficiência é ganha progressivamente por sua classe, raça, cartas do Limiar ou Npcs.
> Você nunca recebera uma habilidade que diga "Experiente em Atacar". Mas ao possuir duas habilidades que te fornecem "Treinado em Atacar" você se torna experiente nesta.

As fontes de proficiência são, portanto, a classe, a raça, as cartas de [[O Limiar]] e o ensino de NPCs — o ganho por nível está em [[Progressão]].

## As 22 perícias

| Perícia | Descrição | Dado + Mod. Atributo |
|---|---|---|
| Atacar | Define sua habilidade de acertar um alvo de maneira destrutiva. | 1d20+Força ou Destreza |
| Defender* | Define sua habilidade de evasão/resistência a ataques. | 1d6/1d8/1d10/1d12/2d8 |
| Movimento | Define quão bem você consegue movimentar o seu corpo tanto de maneira bruta como de maneira ágil. | 1d20+(Força ou Destreza) |
| Fortitude | Define sua habilidade de superar condições físicas como cansaço, envenenamento… | 1d20+Constituição |
| Vontade | Define o controle e poder sobre sua mente. | 1d20+Sabedoria |
| Reflexos | Define sua habilidade de reação e de desviar de ameaças. | 1d20+Destreza |
| Percepção | Define sua habilidade de perceber seus arredores ou detalhes. | 1d20+Sabedoria |
| Sobrevivência | Define quão bem você lida com a natureza. | 1d20+Sabedoria |
| Furtividade | Define quão bem você consegue se ocultar da percepção dos outros. | 1d20+Destreza |
| Crime | Define quão bem você consegue furtar criaturas, arrombar portas ou destruir evidências. | 1d20+Destreza |
| Iniciativa | Define sua velocidade de discernimento e decisão perante o perigo eminente. | 1d20+Destreza |
| Conhecimento | Define seu repertório intelectual e habilidade lógica. | 1d20+Inteligência |
| Medicina | Define seus conhecimentos médicos | 1d20+Inteligência |
| Investigação | Define sua habilidade de vasculhar e encontrar coisas. | 1d20+Inteligência |
| Religião | Define seus conhecimentos sobre religião. | 1d20+Sabedoria |
| Místico | Define seu conhecimento e poder perante as forças primordiais. | 1d20+Inteligência |
| Convencimento | Habilidade de diplomacia/persuasão contra uma criatura | 1d20+(Destreza ou Inteligência) |
| Intimidação | Habilidade de infligir medo/respeito em uma criatura | 1d20+(Constituição ou Força) |
| Intuição | Habilidade de ler as intenções/sentimentos de uma criatura | 1d20+Sabedoria |
| Enganação | Habilidade de enganar uma criatura | 1d20+(Destreza ou Inteligência) |
| Motivar | Habilidade de mudar os sentimentos de uma criatura | 1d20+Sabedoria |
| Ofício(X) | Esse teste pode ser usado para realizar testes específicos de profissão, como forjar algo, artesanato ou outros testes que exigem uma especialização bastante específica. Você não pode usar esse teste sem tê-lo treinado. | 1d20+X |

**Convencimento, Intimidação, Intuição, Enganação e Motivar** formam o grupo das perícias de **interação social** — o termo nomeia o grupo, nunca uma perícia isolada.

## Defender

> A perícia defender possui uma regra especial que nenhuma outra perícia tem. Seus treinamentos aumentam o seu tipo de dado ao rolar a perícia progressivamente. Então, na proficiência ***Leigo*** a perícia utiliza um 1d6, porém treinamentos posteriores aumentam o dado da perícia em vez de adicionarem modificadores.

| Leigo | Treinado | Experiente | Mestre | Lendário |
|---|---|---|---|---|
| 1d6 | 1d8 | 1d10 | 1d12 | 2d8 |

Como o dado entra na defesa está em [[Dano, Ataque e Defesa]] (Evasão ativa) e [[Combate]] (reação).

## Grafias antigas

Fichas e páginas velhas ainda trazem nomes que não são perícias distintas, apenas escritas antigas das 22 acima:

| Grafia antiga | Perícia |
|---|---|
| Conhecer | Convencimento |
| Intimidar | Intimidação |
| Enganar | Enganação |
| Reflexo | Reflexos |
| Ofícios | Ofício(X) |
| Interação Social(X) | a perícia social específica — "interação social" hoje só nomeia o grupo |

A ficha impressa também anota atributos que divergem das regras acima; onde houver conflito, valem as regras:

| Na ficha | Nas regras |
|---|---|
| Atacar (For) | Atacar (Força **ou** Destreza) |
| Defender (Des/Con), com colunas +2/+4/+6/+8 | Defender rola dado (1d6 → 2d8), sem modificador |
| Movimento (For/Des) | Movimento (Força ou Destreza) — iguais |
| Conhecer (Des/Int) | Convencimento (Destreza ou Inteligência) |
| Intimidar (For/Sab) | Intimidação (Constituição ou Força) |
| Enganar (Des/Int) | Enganação (Destreza ou Inteligência) |

## Relações
- **Faz parte de** → [[Sistema]]
- **Alimenta** → [[Progressão]] (proficiência ganha por nível), [[Combate]], [[Dano, Ataque e Defesa]]
- **Fonte de proficiência** → classe, raça, [[O Limiar (cartas)]], NPCs
- **Perícia Místico é requisito de** → [[Regras de Magia]]
- **Ofício(X) é requisito de** → [[O Bazar]] (fabricação)
- **Estados terminais em** → [[Condições]] (*Morrendo*, *Exaurido*, *Oco*)
- **Éter é o recurso descrito em** → [[Éter]]
- **Preenchida na ficha** → [[Criação de Personagem]]
- **Testada em viagem** → [[Jornada]] · **em fuga** → [[Superfícies e Furtividade]] · **em aposta** → [[Khan Sins]]

## Pontas soltas
- **A fórmula do modificador nunca foi escrita.** `(Atributo − 10) / 2` é o que se usa na prática, mas nenhuma página de regra a registra. [[Perguntas Abertas]] E40.
- **Evasão.** As regras dizem apenas "Evasão — Determinada pela sua classe"; na prática vale `10 + Mod. Destreza` para todas as classes. Registrado em [[Dano, Ataque e Defesa]]. [[Perguntas Abertas]] E40.
- **Convencimento e Enganação usam Destreza** — herança de um sistema sem Carisma ou escolha deliberada? [[Perguntas Abertas]] E48.
- **Agrupamento das perícias na ficha.** Iniciativa, Conhecimento, Medicina, Investigação, Religião e Místico aparecem sob "Perícias Sociais"; pertencem a exploração e conhecimento.
- **Marcas de classe** dão "+1 permanente" em perícia até +5, escala que não bate com os degraus +2/+4/+6/+8. [[Perguntas Abertas]] E63.

## Procedência
- Notion `2b76e3a401d980c0ab7bc27a342f4ee1` — Sistema Khalkaria: Atributos Iniciais, Status, Perícias, Proficiência, Defender.
- Notion `4e66e3a401d9832b97b4017bc00ff2c2` — Template - Ficha de Personagem (grafias antigas, agrupamento).
- Respostas do mestre 2026-09-05: **B6** (Atacar por Força ou Destreza), **B16** (grafias antigas e uso de "interação social").
- `docs/memoria/notion_raw/sistema_root.md`, `template_ficha_de_personagem.md`; digest `A_sistema.md` §1.1–1.3, §3.3–3.5.
- Correções pendentes na fonte: nomes e agrupamento de perícias no Template de Ficha.
- Revisão de redação: 2026-09-07.
