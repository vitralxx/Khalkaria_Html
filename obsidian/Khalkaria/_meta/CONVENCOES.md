# Convenções do vault Khalkaria

Vault = esta pasta (`obsidian/Khalkaria/`). Abrir no Obsidian como vault. Fonte da verdade: **respostas do Pedro** (`docs/memoria/respostas_pedro_2026-09-05.md`) > **Notion** (`docs/memoria/notion_raw/`) > site. Nunca inventar lore; lacunas viram "Pendências".

## Estrutura de pastas
```
Khalkaria.md                         hub raiz (MOC)
_meta/                               CONVENCOES, Perguntas Abertas, Log de Sincronização
Cosmologia/                          Cosmologia.md (MOC) · Deuses/ · Planos/ · Entidades/ (O Limiar, O Sonhador, Éter, A Plenitude)
Continentes/                         Continentes.md (MOC)
  Kharavel/                          Kharavel.md (MOC) · Regiões/ (9) · Locais/ (cidades, templo, castelo, abismo, oásis, sublocais de Khaskavel)
                                     · Facções/ · Seres/NPCs/ · A Vhelor/ (árvore, substâncias, Marca, Câmaras)
  Volkrest/  Mordval/  Aether/  Ossyria/
Campanha/                            Linha do Tempo · Sessão 0 · Equipe desfloreio (MOC) · Personagens/ (5 PJs) · Campanha 1 — Arco (GM)
Sistema/                             Sistema.md (MOC) · Regras/ · Magia/ · Classes/ · Raças/ · Origens/ · Condições.md · O Limiar (cartas).md
```

## Nome de arquivo = nome da nota = alvo do wikilink
- Nome canônico em PT-BR com acentos e maiúsculas naturais: `Vytália.md`, `Vanguarda Serafélia.md`, `Império de Ferro.md`, `Castelo de Kirkushav.md`, `Sinikko Kiriam (original).md`, `Sinikko Kiriam (clone).md`, `Sinikko Kiriam (PJ).md`.
- **Nomes únicos em todo o vault** (Obsidian resolve `[[Nome]]` sem caminho). Se colidir (ex.: técnica "Passo do Vento" em duas classes), prefixar: `Passo do Vento (Monge)`.
- Grafia oficial (Pedro): Vytália · Vanguarda Serafélia · Império de Ferro · Vanguarda do Ferro · Runa Skorn · Luxária · Acólito · Exaustão · Sangramento · Envenenamento · Castelo de Kirkushav · Etérico. Variantes vão em `aliases`.
- Links sempre `[[Nome]]` ou `[[Nome|texto]]`. Não usar caminhos. Um link por entidade mencionada, na primeira ocorrência de cada seção.

## Frontmatter obrigatório
```yaml
---
tipo: deus | plano | entidade | era | continente | regiao | cidade | local | faccao | npc | pj | raca | classe | origem | escola | regra | condicao | evento | item | conceito | moc
status: canon-pedro | canon-notion | rascunho-notion | proposto | conflito
spoiler: gm | publico          # TODA lore = gm. Sistema = publico (exceto Lobisomem = gm).
era: atemporal | pre-sessao0 | sessao0 | intervalo | campanha
continente: Kharavel           # omitir se não se aplica
aliases: []                    # grafias alternativas, epítetos, nomes antigos
fonte_notion: <uuid ou lista>  # página(s) de origem; "pedro-2026-09-05" quando só das respostas
ultima_sync: 2026-09-05
tags: [khalkaria/<pasta-em-minusculas>]
---
```

## Corpo — seções fixas, nesta ordem (omitir vazias exceto Relações)
1. `# Nome` + 1 parágrafo de **Resumo** (sem spoiler óbvio na 1ª linha se `spoiler: gm`? Não: todo o vault é GM; escrever direto).
2. `## Cânone (Notion)` — texto do Notion, **verbatim ou quase**, preservando vocabulário do Pedro. Regras mecânicas sempre verbatim.
3. `## Segundo o Pedro (2026-09-05)` — o que veio das respostas, citando a letra (A2, B3…). Prevalece sobre o Notion.
4. `## Relações` — bullets `- **Papel** → [[Alvo]]` (ex.: `- **Criador** → [[Malkhor]]`, `- **Fica em** → [[Bosque Corrompido]]`, `- **Inimigo de** → [[Vytália]]`). É o que constrói o grafo: seja generoso e preciso.
5. `## Linha do tempo` — bullets `- **−27** (Sessão 0): …` / `- **0** (campanha): …` quando houver eventos.
6. `## Conflitos e pendências` — cada divergência com os dois lados citados e a pergunta correspondente (E1…E15 ou nova).
7. `## Fonte` — uuid(s) do Notion, arquivo raw, digest.

## Regras
- Datas relativas: **−27 anos = Sessão 0**, **0 = início da campanha**. Kirkushav 66 → 93+.
- Mapas: posições em `docs/memoria/mapas/LEIA-ME_mapas.md`. Toda nota de região/local declara vizinhos e o que contém.
- Nada de conteúdo do Bazar `Lore/Notas` (não-canônico).
- Lobisomem: nota existe, `spoiler: gm`, marcada "raça secreta".
- Site (`pages/`, `data/`) não é fonte.
