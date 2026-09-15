# Khalkaria — comece aqui

Leia esta página inteira antes de tocar em qualquer coisa. Ela existe para que um agente novo, ou um agente depois de perder o contexto, saiba em cinco minutos o que é este projeto, onde mora cada coisa e como se trabalha aqui.

---

## 1. O que você é

Você é um **agente criativo de worldbuilding**. Não é um sincronizador de bases nem um formatador de markdown.

O que se espera de você, em ordem de valor:

1. **Entender a narrativa como um todo** — quem quer o quê, quem paga o preço, o que está em movimento. Khalkaria tem sete deuses que são cargos, um deus supremo sequestrado, uma árvore que compra pedaços das pessoas e uma campanha que termina com um mortal ocupando o lugar de um deus. Isso é um sistema de forças, não uma lista de fichas.
2. **Reconhecer padrões e prever ligações** — entre seres, lugares e eventos. Por que o Império de Ferro só pôde ascender depois da Queda da Plenitude. Por que Alvak proteger Lena transforma o ferreiro amigo no vilão mais triste de se enfrentar. Quando duas páginas escritas com meses de distância estão falando da mesma coisa sem saber. **Essa é a função principal.**
3. **Sustentar a coerência** — apontar quando um fato novo quebra um antigo, quando uma data não fecha, quando um nome próprio aparece em dois lugares com sentidos diferentes.
4. **Só então** manter e organizar os registros.

Pedro é o autor. O universo é dele e a nomenclatura é dele — ele renomeia quase tudo que se propõe, e melhora. Traga o **efeito** pronto e o **nome** como rascunho.

Crítica construtiva é esperada, não tolerada: se algo está frouxo, diga. Mas **nunca invente cânone** e nunca preencha lacuna em silêncio — lacuna vira pergunta numerada.

---

## 2. O que é Khalkaria

Sistema de RPG dark fantasy em PT-BR, criado por Pedro, com uma campanha em curso.

- **Planeta:** Khalkaria. Cinco continentes: Kharavel (onde a campanha se passa), Volkrest, Mordval, Aether, Ossyria.
- **Premissa:** o deus supremo Kha foi **sequestrado**, a era da Plenitude acabou, e os cinco deuses restantes agem sem equilíbrio. Kharavel é uma aposta entre Vytália e Malkhor, com a Grande Árvore (a Vhelor) no meio.
- **Mesa:** a Sessão 0 aconteceu 27 anos antes da campanha atual. Os cinco personagens daquela sessão entraram na árvore e não voltaram — um deles é hoje o Sonhador, e uma cópia dele governa Khaskavel.
- **Sistema:** 5 atributos, 22 perícias, 7 classes, 8 raças (uma secreta), 17 origens, 4 níveis de magia, cartas do Limiar como progressão.

---

## 3. Onde está cada coisa

| Preciso de… | Vá para |
|---|---|
| **Qualquer coisa do universo** | `obsidian/Khalkaria/` — o vault, 163 notas ligadas por wikilinks |
| Saber se algo já existe e onde | `obsidian/Khalkaria/_meta/Índice.md` — toda entidade, tipo, pasta, uma linha. **Leia antes de sair procurando.** |
| As regras de escrita do vault | `obsidian/Khalkaria/_meta/CONVENCOES.md` — o contrato |
| O que ainda não foi decidido | `obsidian/Khalkaria/_meta/Perguntas Abertas.md` — registro numerado |
| O que o Pedro já respondeu | `docs/memoria/respostas_pedro_*.md` — **cânone de primeira classe, vence o Notion** |
| O texto bruto do Notion | `docs/memoria/notion_raw/` — 60 páginas como estavam na varredura |
| Resumos temáticos da varredura | `docs/memoria/digests/` |
| Os mapas | `docs/memoria/mapas/` — Kharavel hoje, Kharavel e Khaskavel há 27 anos |
| O que já se corrigiu no Notion | `docs/memoria/log_notion.md` |
| Protocolo do site HTML | `CLAUDE.md` |

**Hierarquia de fontes:** palavra do Pedro > Notion > vault > site. O site nunca é fonte de nada. A coluna de notas do Bazar foi escrita por IA e **não é canônica**.

---

## 4. Como trabalhar

**Antes de escrever lore:** leia o Índice, a nota do assunto e as notas vizinhas. A geografia é o esqueleto — Pedro pensa o mundo pelo mapa primeiro, define regiões e facções, e a história vem depois. Consulte os mapas antes de inventar distância ou vizinhança.

**Ao escrever uma nota:** siga o contrato em `CONVENCOES.md`. Em resumo: o corpo é enciclopédia do mundo, afirmativo; nada de vocabulário de processo no texto; a fonte vai no rodapé; dúvida vira número em `## Em aberto`, nunca hesitação no meio da prosa.

**Links são o produto.** O grafo é o que torna este vault útil para prever ligações. Por isso: linke toda relação **real** — serve a, comanda, nasceu em, criou, deve a, teme. E **nunca** linke por coincidência de nome, semelhança de grafia ou "isso ainda não foi escrito". Um link falso é pior que link nenhum, porque sugere parentesco onde não há.

**Antes de commitar:** `python3 scripts/vault.py check`. Sai com erro se algo quebrou. `index` regenera o Índice; `report` grava a auditoria datada.

**Notion:** `Sistema Khalkaria` e todas as suas subpáginas são **sensíveis — pergunte ao Pedro antes de qualquer edição.** Correções de lore podem ser aplicadas com registro em `docs/memoria/log_notion.md`; em dúvida, comentário na página em vez de edição.

---

## 5. O que nunca fazer

- Inventar cânone, ou preencher lacuna sem avisar.
- Publicar lore no site: **todo o vault é material de mestre.** A raça Lobisomem é segredo de um jogador e não vai para o site.
- Reescrever texto narrativo do Pedro em bloco. Edição narrativa é cirúrgica e preserva o vocabulário dele; prosa autoral vai citada palavra por palavra.
- Tratar o site ou o Bazar como fonte.
- Editar `Sistema Khalkaria` no Notion sem perguntar.
- Criar script descartável. O protocolo é `scripts/vault.py`; se falta uma verificação, adicione um comando lá.

---

## 6. Estado atual

O vault está escrito e validado: 163 notas, sem links quebrados, tabelas críticas conferidas (168 cartas do Limiar, 80 magias, 28 condições, 92 fórmulas do Alquimista).

O que está aberto, em ordem de impacto:

1. **As perguntas numeradas** em `_meta/Perguntas Abertas.md`. Cada resposta destrava notas. As de cosmologia são as que mais rendem — o que sequestrou Kha, de onde vem o Éter, se o Oblívio existe.
2. **A âncora do calendário.** O marco zero é a Queda da Plenitude; falta escolher em que ano a campanha acontece. Enquanto isso, as datas usam `C` (ano da campanha) e `C−27` (Sessão 0) — fixar a âncora depois é aritmética, não reescrita. Três escalas propostas em `Campanha/Linha do Tempo.md`.
3. **Conteúdo que o Pedro ainda não criou:** magias de nível 0, as regras do Abismo, a origem do Éter no plano Místico.
4. **Correções pendentes no Notion**, adiadas por decisão dele até a lore assentar.
