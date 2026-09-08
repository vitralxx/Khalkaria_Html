---
tipo: moc
status: canon-pedro
spoiler: gm
era: atemporal
aliases: [Convenções, Contrato do vault]
fonte_notion: pedro-2026-09-05, pedro-2026-09-07
ultima_sync: 2026-09-07
tags: [khalkaria/meta]
---
# Convenções do vault Khalkaria

Vault = esta pasta. Este é o **banco vitalício** de Khalkaria: nada se omite, nada se resume por economia. O que não couber numa nota ganha nota própria.

## Regra de voz (a mais importante)

**O corpo de uma nota é escrito como enciclopédia do mundo, não como relatório de trabalho.**

Vocabulário de processo — códigos de resposta (`A5`, `B12`), `digest`, `raw`, `verbatim`, `Notion`, `uuid`, nomes de arquivo, "sincronizado", "o Pedro disse" — **não aparece no corpo**. Ele vive em exatamente dois lugares: o **frontmatter** e a seção **Procedência**, no rodapé.

Quando a nota precisa marcar que algo veio do mestre e não do texto antigo, escreva no idioma do mundo e deixe a referência para a Procedência:

- ❌ `Kirkushav planejava matar os Sandgale (A9). **B2:** munições gastam 1 por combate.`
- ✅ `Kirkushav planejava matar os Sandgale por terem sobrevivido a Ossyria.` (a origem vai em Procedência)

**Lore não explica regra.** Uma nota de personagem nunca descreve o consumo de munição, custo de Éter ou escala de perícia — ela **linka** para [[Armas e Munição]], [[Regras de Magia]], [[Atributos e Perícias]]. O inverso também vale: nota de regra não conta história, só cita e linka.

**Nomenclatura:** **PC** (personagem de jogador) e **NPC**. Nunca "PJ".

## Estrutura de pastas
```
Khalkaria.md                         hub raiz
_meta/                               Convenções · Perguntas Abertas · Log de Sincronização
Cosmologia/                          Deuses/ · Planos/ · Entidades/ (O Limiar, O Sonhador) · Conceitos/ (Éter, A Plenitude)
Continentes/
  Kharavel/                          Regiões/ (9) · Locais/ · Facções/ · Seres/NPCs/ · A Vhelor/
  Volkrest/  Mordval/  Aether/  Ossyria/
Campanha/                            Linha do Tempo · Sessão 0 · Equipe desfloreio · Personagens/ (os 5 PCs) · Campanha 1 — Arco
Sistema/                             Regras/ · Magia/ · Classes/ · Raças/ · Origens/ · Condições · O Limiar (cartas)
```

## Nome de arquivo = nome da nota = alvo do wikilink
- PT-BR com acentos: `Vytália.md`, `Vanguarda Serafélia.md`, `Castelo de Kirkushav.md`, `Sinikko Kiriam (original).md`.
- **Nomes únicos em todo o vault.** Colisão → sufixo entre parênteses: `Caçador (origem)` × `Caçador (técnica)`.
- Grafia oficial: Vytália · Vanguarda Serafélia · Império de Ferro · Vanguarda do Ferro · Runa Skorn · Luxária · Acólito · Exaustão · Sangramento · Envenenamento · Castelo de Kirkushav · Etérico. Variantes e nomes antigos vão em `aliases`.
- Links sempre `[[Nome]]` ou `[[Nome|texto]]`, jamais caminho. Linke toda entidade citada.

## Frontmatter
```yaml
---
tipo: deus | plano | entidade | conceito | substancia | fenomeno | era | continente | regiao | cidade | local | faccao | npc | pc | raca | classe | origem | escola | regra | condicao | evento | item | moc
status: canon-pedro | canon-notion | rascunho | proposto | conflito
spoiler: gm | publico          # toda lore é gm; regras de Sistema são publico (exceto Lobisomem)
era: atemporal | plenitude | pre-sessao0 | sessao0 | intervalo | campanha
continente: Kharavel           # quando se aplica
aliases: []
fonte_notion: <uuid(s)> | pedro-<data>
ultima_sync: AAAA-MM-DD
tags: [khalkaria/<area>]
---
```

## Corpo — ordem das seções
1. `# Nome` e um **Resumo** de um parágrafo.
2. **Seções temáticas próprias da nota** — títulos que fazem sentido no mundo: *História*, *Natureza*, *Geografia*, *Governo*, *Doutrina*, *O que há dentro*, *Como a chamam*. Texto do mestre preservado palavra por palavra, em citação quando for prosa autoral. Nunca intitule uma seção com a fonte.
3. `## Ficha` — **somente quando existir**. Nem todo ser tem ficha; ausência não é lacuna.
4. `## Relações` — bullets `- **Papel** → [[Alvo]]`. É o que desenha o grafo: seja generoso.
5. `## Linha do tempo` — quando houver eventos datados.
6. `## Pontas soltas` — o que ainda não foi decidido, com as versões em conflito e a pergunta correspondente em [[Perguntas Abertas]].
7. `## Procedência` — **único lugar** para páginas de origem, códigos de resposta do mestre, arquivos e datas.

## Datação
Ver [[Linha do Tempo]]. Marco zero = **a Queda da Plenitude**. Eventos da campanha também aceitam marcação relativa: `Sessão 0` e `campanha` (27 anos depois).

## Fontes e prioridade
Palavra do mestre > páginas do Notion > site. O site nunca é fonte. Conteúdo da coluna de notas do Bazar não é canônico. Nada se inventa: lacuna vira **Ponta solta** e pergunta numerada.
