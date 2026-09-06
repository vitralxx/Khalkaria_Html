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

**Resumo.** O dano de um ataque é **dado da arma + Mod. do atributo da arma**; o crítico dobra os dados (não o modificador). A defesa tem duas camadas: **Evasão** (passiva, determinada pela classe; ativa quando se gasta a reação para somar o dado de *Defender*) e **redução de dano** — **Armadura (Ar)** contra dano ordinário, **Armadura Específica Ae(Tipo, Quant.)** contra dano atípico. **Resistência** corta o dano pela metade; **Vulnerabilidade** o dobra.

## Cânone (Notion)

### Dano
> - **Dano ao Atacar:** Dano da arma + Mod. Atributo da arma;
> - **Dano Crítico:** Role o dobro de dados da arma + Mod. Atributo da arma;
> - **Margem de Ameaça:** Denota a faixa ao rolar um d20 onde seu ataque é considerado um crítico, por padrão, é apenas ao rolar 20.
> - **Multiplicador de Crítico:** Denota quão o multiplicador do crítico de uma arma, por padrão, é o dobro

### Ataque
> - **Corpo a Corpo Pesado:** O acerto usa a perícia **atacar** com Mod. de Força, dano dá +Mod. de Força.
> - **Corpo a Corpo Leve:** O acerto usa a perícia **atacar** com Mod. de Destreza, dano dá +Mod. de Destreza.
> - **À Distância:** O acerto usa a perícia ***atacar***, *com Mod. de Destreza*, dano dá +Mod. de Destreza.
> - **Armas Místicas:** Quando a magia exige um ataque, o acerto usa a perícia ***místico***, dano dá +Mod. de Inteligência/Sabedoria

### Defesa
> - **Evasão** — Determinada pela sua classe, define se você desvia/resiste o dano quando alvo de um ataque.
>     - **Evasão Passiva** — É sua evasão natural. Quando alvo de um ataque, se sua evasão for maior que a rolagem de ataque você desvia/resiste o ataque.
>     - **Evasão ativa** — Quando alvo de um ataque, você pode gastar sua reação para somar o dado da perícia ***defender*** (conforme seu treinamento) à sua evasão contra todos os ataques do agressor neste turno.
> - **Armadura(Ar)** — Reduz dano *ordinário* em uma constante fixa
> - **Armadura Específica(Ae)** — Reduz dano *atípico* em uma constante fixa. Ae(Tipo de dano, Quant. de resist.) é o formato padrão. Ex.: Ae(Místico, 2), ao receber 10 de dano místico, recebe apenas 8.
> - **Resistência e Vulnerabilidade:** Resistência a um dano específico o reduz sempre a metade. Vulnerabilidade a um dano específico sempre o dobra.
> - **Armaduras Pesadas e Leves** — Você pode equipar apenas 1 Armadura pesada, ela geralmente define seu traje e arquétipo. Você pode equipar até 2 Armaduras Leves, elas geralmente proveem Ae e Passivas diversas.

A tabela de tipos de dano da raiz está reproduzida e corrigida em [[Tipos de Dano]].

## Segundo o Pedro (2026-09-05)
- **B1** — a lista definitiva de dano é **12 tipos em 4 categorias**: *"Ordinários(Corante, Perfurante Contundente), Elementais(Fogo, Frio Elétrico), Biológicos(Veneno, Ácido, Psíquico), Místico(Radiante, Trovejante, Necrótico, Força e Primordial)."* "Gelo" na raiz é erro. Detalhes em [[Tipos de Dano]].

## Relações
- **Faz parte de** → [[Sistema]]
- **Usado em** → [[Combate]]
- **Tipos e categorias** → [[Tipos de Dano]]
- **Dados e efeitos de arma** → [[Armas e Munição]]
- **Armaduras e escudos comprados em** → [[O Bazar]]
- **Evasão e recursos por classe** → [[Espadachim]], [[Batedor]], [[Brutalista]], [[Teurgo]], [[Monge]], [[Alquimista]], [[Artilheiro]]
- **Dano místico vem de** → [[Regras de Magia]]

## Conflitos e pendências
- **Evasão.** A raiz diz só "Determinada pela sua classe". O `CLAUDE.md`, o site e o Bestiário usam **10 + Mod. DES em todas as classes** (passiva), com a ativa somando o dado de Defender. Falta a fórmula escrita no Notion.
- **Dano "Biológico" como tipo.** *Sangramento*, *Envenenamento* e *Morrendo* (em [[Condições]]) causam "dano Biológico", mas na raiz **Biológico é categoria** (Veneno/Ácido/Psíquico), não tipo — logo `Ae(Biológico, X)` é indefinido.
- **Ae de subtipos ordinários.** Cartas do Limiar e magias falam em resistência a "Dano Ordinário (Contundente, Perfurante, Cortante)"; a raiz trata Ordinário como bloco único reduzido por Ar. Conferir se Ae aceita subtipo ordinário.

## Fonte
Notion `2b76e3a401d980c0ab7bc27a342f4ee1` (Dano, Ataque e Defesa). Raw: `docs/memoria/notion_raw/sistema_root.md`. Digest: `A_sistema.md` §1.7, §3.24.
