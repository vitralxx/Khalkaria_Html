---
tipo: regra
status: canon-notion
spoiler: publico
era: atemporal
aliases: [Evasão, Armadura, Ar, Ae, Armadura Específica, Resistência, Vulnerabilidade, Crítico, Margem de Ameaça]
fonte_notion: 2b76e3a401d980c0ab7bc27a342f4ee1
ultima_sync: 2026-09-05
tags: [khalkaria/sistema, khalkaria/sistema/regras]
---

# Dano, Ataque e Defesa

**Resumo.** O dano de um ataque é **dado da arma + Mod. do atributo da arma**; o crítico dobra os dados, não o modificador. A defesa tem duas camadas: **Evasão** (passiva, determinada pela classe; ativa quando se gasta a reação para somar o dado de *Defender*) e **redução de dano** — **Armadura (Ar)** contra dano ordinário, **Armadura Específica Ae(Tipo, Quant.)** contra dano atípico. **Resistência** corta o dano pela metade; **Vulnerabilidade** o dobra.

## Dano

> - **Dano ao Atacar:** Dano da arma + Mod. Atributo da arma;
> - **Dano Crítico:** Role o dobro de dados da arma + Mod. Atributo da arma;
> - **Margem de Ameaça:** Denota a faixa ao rolar um d20 onde seu ataque é considerado um crítico, por padrão, é apenas ao rolar 20.
> - **Multiplicador de Crítico:** Denota quão o multiplicador do crítico de uma arma, por padrão, é o dobro

## Ataque

> - **Corpo a Corpo Pesado:** O acerto usa a perícia **atacar** com Mod. de Força, dano dá +Mod. de Força.
> - **Corpo a Corpo Leve:** O acerto usa a perícia **atacar** com Mod. de Destreza, dano dá +Mod. de Destreza.
> - **À Distância:** O acerto usa a perícia ***atacar***, *com Mod. de Destreza*, dano dá +Mod. de Destreza.
> - **Armas Místicas:** Quando a magia exige um ataque, o acerto usa a perícia ***místico***, dano dá +Mod. de Inteligência/Sabedoria

## Defesa

> - **Evasão** — Determinada pela sua classe, define se você desvia/resiste o dano quando alvo de um ataque.
>     - **Evasão Passiva** — É sua evasão natural. Quando alvo de um ataque, se sua evasão for maior que a rolagem de ataque você desvia/resiste o ataque.
>     - **Evasão ativa** — Quando alvo de um ataque, você pode gastar sua reação para somar o dado da perícia ***defender*** (conforme seu treinamento) à sua evasão contra todos os ataques do agressor neste turno.
> - **Armadura(Ar)** — Reduz dano *ordinário* em uma constante fixa
> - **Armadura Específica(Ae)** — Reduz dano *atípico* em uma constante fixa. Ae(Tipo de dano, Quant. de resist.) é o formato padrão. Ex.: Ae(Místico, 2), ao receber 10 de dano místico, recebe apenas 8.
> - **Resistência e Vulnerabilidade:** Resistência a um dano específico o reduz sempre a metade. Vulnerabilidade a um dano específico sempre o dobra.
> - **Armaduras Pesadas e Leves** — Você pode equipar apenas 1 Armadura pesada, ela geralmente define seu traje e arquétipo. Você pode equipar até 2 Armaduras Leves, elas geralmente proveem Ae e Passivas diversas.

Na prática, a Evasão passiva de todas as classes é **10 + Mod. Destreza**, e o treinamento em Defender só entra pela Evasão ativa — a fórmula, porém, não está escrita em nenhuma página de regra (ver Pontas soltas).

## Tipos de dano

O que é ordinário, o que é atípico e quais são os doze tipos está em [[Tipos de Dano]]. Ordinário é reduzido por **Ar**; todo o resto por **Ae** do tipo correspondente.

## Relações
- **Faz parte de** → [[Sistema]]
- **Usado em** → [[Combate]]
- **Tipos e categorias** → [[Tipos de Dano]]
- **Dados e efeitos de arma** → [[Armas e Munição]]
- **Armaduras e escudos comprados em** → [[O Bazar]] · **ocupam espaço em** → [[Inventário e Peso]]
- **Evasão e recursos por classe** → [[Espadachim]], [[Batedor]], [[Brutalista]], [[Teurgo]], [[Monge]], [[Alquimista]], [[Artilheiro]]
- **Dano místico vem de** → [[Regras de Magia]]
- **Resistências anotadas na ficha** → [[Criação de Personagem]]

## Pontas soltas
- **A fórmula da Evasão nunca foi escrita.** As regras dizem só "Determinada pela sua classe"; a prática é `10 + Mod. Destreza` para todas. [[Perguntas Abertas]] E40.
- **Dano "Biológico" tratado como tipo.** *Sangramento*, *Envenenamento* e *Morrendo* ([[Condições]]) causam "dano Biológico", mas Biológico é **categoria** (Veneno, Ácido, Psíquico) — logo `Ae(Biológico, X)` não tem alvo definido. O mesmo vale para "Místico". [[Perguntas Abertas]] E43.
- **Ae de subtipo ordinário.** Cartas e magias falam em resistência a "Dano Ordinário (Contundente, Perfurante, Cortante)", mas as regras tratam Ordinário como bloco único reduzido por Ar. Falta dizer se Ae aceita subtipo ordinário.
- **Bônus condicionais de Evasão** (FLUXO do [[Monge]], Concentração do [[Artilheiro]], efeitos de carta) somam sobre a passiva sem limite escrito. [[Perguntas Abertas]] E83.

## Procedência
- Notion `2b76e3a401d980c0ab7bc27a342f4ee1` — Dano, Ataque e Defesa.
- Respostas do mestre 2026-09-05: **B1** (os 12 tipos de dano em 4 categorias; "Gelo" é erro).
- `docs/memoria/notion_raw/sistema_root.md`; digest `A_sistema.md` §1.7, §3.24.
- Revisão de redação: 2026-09-07.
