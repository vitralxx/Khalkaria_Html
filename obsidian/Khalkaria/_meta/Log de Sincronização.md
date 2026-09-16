---
tipo: moc
status: canon-pedro
spoiler: gm
era: atemporal
aliases: [Sync Log]
fonte_notion: pedro-2026-09-05
ultima_sync: 2026-09-06
tags: [khalkaria/meta]
---
# Log de Sincronização

## 2026-09-06 — carga inicial do vault
**Origem:** varredura completa do Notion em 2026-09-04 (`docs/memoria/notion_raw/`, 60 páginas; levantamento A–F) + respostas do Pedro de 2026-09-05 (`docs/memoria/respostas_pedro_2026-09-05.md`), que **prevalecem** sobre o Notion + os 3 mapas (`docs/memoria/mapas/`).

**Verificação por conjunto** (método do CLAUDE.md §6): 168/168 cartas do Limiar, 80/80 magias verbatim, 28/28 condições, 17/17 origens, 8 raças, 7 classes, 9 regiões, 7 deuses, 5 continentes.

**Correções aplicadas ao Notion no mesmo ciclo:** 19 páginas, 88 edições, 21 comentários — registro em `docs/memoria/log_notion.md`.

**O que ficou de fora:**
- 5 correções na página raiz *Sistema Khalkaria* (API do Notion recusa edições: ícone legado num callout).
- Os 3 PNGs dos mapas (só a descrição textual está versionada).
- 61 perguntas em [[Perguntas Abertas]] aguardando o Pedro.

**Regra daqui em diante:** toda página nova de lore nasce no vault **e** no Notion. Em divergência, vale o Notion — exceto onde `docs/memoria/respostas_pedro_2026-09-05.md` disser o contrário.

## 2026-09-15 — base afirmativa, índice e protocolo

**O que mudou de método.** As notas deixaram de discutir dúvida no meio do texto. A base agora afirma o que é canônico; o que falta decidir vive só em [[Perguntas Abertas]], e cada nota cita apenas os números em `## Em aberto`. Motivo: 733 incertezas espalhadas por 160 notas — quase cinco por nota — faziam qualquer leitor hesitar onde não precisava.

**Consolidação.** As 733 viraram 217 perguntas novas, agrupadas por tema e fundidas quando eram a mesma dúvida em notas diferentes. O registro tem hoje 322 entradas, com as doze que mais destravam listadas no topo.

**Links.** Passaram a valer só por relação real no mundo. Foram removidas arestas nascidas de coincidência — a mais citada ligava um general humano ao deus da morte porque os dois nomes levam apóstrofo.

**Índice.** [[Índice]] passa a listar as 160 entidades com tipo, pasta, aliases e uma linha de identificação, mais os centros do grafo. É por onde se começa qualquer busca.

**Protocolo.** `scripts/vault.py` com `check`, `index` e `report`. O `check` roda antes de todo commit e reprova link sem destino, frontmatter fora do contrato, seção errada, vocabulário de processo no corpo, link por coincidência e dúvida sem número. Auditorias datadas ficam em `docs/memoria/auditorias/`.

**Porta de entrada.** `docs/COMECE_AQUI.md` declara a função do agente — worldbuilding criativo, leitura de padrões e proposta de ligações — antes de qualquer coisa operacional.
