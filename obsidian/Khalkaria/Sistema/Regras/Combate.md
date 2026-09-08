---
tipo: regra
status: canon-pedro
spoiler: publico
era: atemporal
aliases: [Rodada, Turno, Ações, Reação, Retaliação, Retaliar, Ataque de oportunidade]
fonte_notion: 2b76e3a401d980c0ab7bc27a342f4ee1
ultima_sync: 2026-09-05
tags: [khalkaria/sistema, khalkaria/sistema/regras]
---

# Combate

**Resumo.** O combate abre com um teste de **Iniciativa**. Cada personagem tem **3 ações e 1 reação por turno**. A assinatura do sistema é a **retaliação**: atacar alguém que ainda tem reação é se expor — o alvo escolhe **Atacar** (revidar) ou **Defender** (somar o dado de Defender à Evasão). Ataques consecutivos no mesmo turno acumulam **−5** cada.

## Iniciativa

> Iniciando um combate todos rolam a perícia *Iniciativa*, ordenando quem joga primeiro.

## Sua rodada

> Você possui 3 ações e uma reação por turno, alguns exemplos dentre as listadas abaixo:
> - *Mover* (1 ação) (Max. 1 Vez por turno)
> - *Pular* (2 Ações) → Pula 1/3 do seu Movimento
> - Acelerar (1 ação) → +3 m de movimento nesta rodada.
> - *Atacar* (Depende da arma), ataques consecutivos somam −5 a cada ataque no mesmo turno.
> - *Defender* (1 ação) → +2 Defender até seu próximo turno.
> - *Defender* fora do seu turno (Reação) → Soma o dado da perícia *Defender* à sua evasão contra todos os ataques do agressor nesta rodada.
> - *Conjurar magia* (1-3 ações)
> - *Técnica Específica* (1–3 ações)
> - *Outro* (1-3 ações), dependendo de sua dificuldade ou demora para executar
> - Reações servem para regras/habilidades específicas

## Atacar e retaliar

> Ao atacar alguém você sempre se coloca em risco, sendo potencialmente *Retaliado*, tenha isso em mente.
> 1. Role a perícia *Atacar*. Se seu alvo ainda tiver uma reação, ele possui 2 opções: Rolar a perícia **Atacar** ou **Defender** →
>     1. **Atacar:** O alvo tenta te *retaliar*: Caso o alvo ultrapasse seu valor, ele te ataca com a arma que estiver empunhando, também recebendo seu dano.
>        !!Caso ele acerte criticamente, ele nega seu dano, ainda sim, te retaliando.
>        !!Caso ele falhe criticamente, seu ataque contra ele é critico.
>        Você não pode retaliar à distância.
>     2. **Defender:** O alvo tenta se defender: O alvo adiciona a rolagem da pericia *Defender* a sua *evasão*. Caso o atacante role abaixo da *evasão* do alvo, o alvo esquiva/bloqueia.
>
> Enquanto estiver sendo alvo dos seus ataques durante o seu turno, a criatura pode escolher reagir (Atacar ou Defender) a cada um deles. Ao final do seu turno, ela considera a reação gasta e não pode mais usá-la até o início do próximo.
> Em caso de empate, o atacante sempre ganha.

O cálculo do dano, da Evasão e das reduções está em [[Dano, Ataque e Defesa]]; as manobras não-letais em [[Manobras e Tamanho]].

## Ataques de oportunidade

> Ao estar a 1,5 m de uma criatura e se afastar dela, ela pode gastar sua reação para realizar um ataque de oportunidade contra você.

## Conjurar em combate

Canaliza-se **uma magia por turno** — o *Disparo Veloz* é possivelmente a única magia do sistema que ignora esse limite. O custo em ações, o custo de [[Éter]] e as intensidades estão em [[Regras de Magia]].

## Munição

Uma unidade de munição cobre o **combate inteiro**; sem munição, a arma à distância não funciona durante todo o combate. Detalhes em [[Armas e Munição]].

## Relações
- **Faz parte de** → [[Sistema]]
- **Usa** → [[Atributos e Perícias]] (Iniciativa, Atacar, Defender, Movimento)
- **Detalha dano e defesa em** → [[Dano, Ataque e Defesa]]
- **Manobras em** → [[Manobras e Tamanho]]
- **Aplica** → [[Condições]] (*Desprevenido*, *Caído*, *Exposto*…)
- **Armas e efeitos por Stamina** → [[Armas e Munição]]
- **Conjuração** → [[Regras de Magia]]
- **Fuga do combate** → [[Superfícies e Furtividade]] (Perseguição)
- **Terreno da cena** → [[Superfícies e Furtividade]]

## Pontas soltas
- **"Defender (1 ação) → +2 Defender"** é o único bônus numérico fixo numa perícia que rola dado: soma ao resultado do dado ou direto à Evasão?
- **O limite de uma magia por turno** vale como regra geral, mas nas páginas de magia ele só aparece como exceção do *Disparo Veloz* ("ignora a regra de 1 cast por turno").

## Procedência
- Notion `2b76e3a401d980c0ab7bc27a342f4ee1` — Combate: Sua Rodada, Atacando, Ataques de oportunidade.
- Respostas do mestre 2026-09-05: **B4** (1 magia por turno; exceção do Disparo Veloz), **B2** (munição por combate).
- `docs/memoria/notion_raw/sistema_root.md`; levantamento A_sistema.md` §1.6.
- Correção pendente na fonte: escrever o limite de 1 magia por turno nas regras de magia.
- Revisão de redação: 2026-09-07.
