# Khalkaria Hexcrawl: protocolo do agente programador

Você escreve o app de **hexcrawl** de Kharavel, o continente do RPG **Khalkaria** (d20 autoral, PT-BR). O
**Pedro** é o autor do sistema e o mestre da mesa. Ele é quem decide.

---

## 1. Regras invioláveis
- **Regra do jogo:**
  - `docs/01-regras.md` é **normativo**;
  - acima dele está o **Notion** (página *Sistema Khalkaria*), com os trechos que importam em
    `docs/09-sistema-khalkaria.md`;
  - se os dois divergirem, ou se o Notion contradisser o Notion, **sinalize ao Pedro antes de escrever código**;
  - nunca escolha em silêncio.
- **Nunca invente regra nem número.** O que faltar vira pergunta em `docs/10-pendencias.md`. Toda `[proposta]` fica
  numa constante nomeada, fácil de trocar.
- **Números de regra são dados configuráveis** (`mundo.json`, painel de configuração), nunca fixos no código.
- **O app nunca rola os dados dos jogadores.** Ele lembra a mesa de rolar e recebe o resultado. Os dados do mestre o
  app rola ou recebe digitados (`docs/01-regras.md` §8).
- **Conteúdo criativo** (textos de evento, consequências, nomes, lore):
  - você pode **rascunhar**, sempre com `status: "rascunho"`;
  - só o Pedro aprova;
  - edição em texto do Pedro é cirúrgica: preserve o vocabulário e as imagens dele.
- **Segredo do mestre nunca chega à janela dos jogadores.** A projeção é montada no servidor, e o teste de
  vazamento é obrigatório (`docs/05-interface.md` §6).
- **Dados:**
  - JSON validado por `schemas/`;
  - nunca grave um mundo com FALHA do validador;
  - mudança incompatível sobe o `schemaVersion` e ganha migração com teste.
- **O núcleo de regras é especificação executável** (`referencia/`, depois `hexcrawl/nucleo/`):
  - os testes e `testes/vetores-regras.json` ficam sempre verdes;
  - se um vetor parecer errado, **pergunte**, não "conserte".
- **Fora de escopo:**
  - o CSV do Bazar, que é do Pedro (o app só lê);
  - o site de regras;
  - o Bestiário;
  - os mapas internos de Khaskavel e Revavena.
- **Assets do Pedro:**
  - o repositório é privado;
  - não redistribua os tiles nem o kit de UI;
  - os mapas originais (~50 MB) ficam fora do git.

## 2. Comunicação
- PT-BR, direto e tecnicamente preciso.
- **Economia de tokens:** respostas enxutas, sem preâmbulo e sem repetir o que já foi dito.
- Crítica construtiva é bem-vinda: proponha, questione e sinalize antes de implementar.
- Pergunte em **lista numerada**, com a recomendação primeiro. O Pedro responde por número, e uma correção dele num
  ponto vale para o projeto inteiro.
- **O agente de balanceamento** mantém as regras do hexcrawl e escreveu este pack.
  - Ele vive no repositório do site (`vitralxx/Khalkaria_Html`, branch `claude/khalkaria-bazar-balance-lsdfic`,
    pasta `.claude/skills/khalkaria-balance/`).
  - **Não há canal direto:** o Pedro faz a ponte. Dúvida de regra vira uma pergunta curta e numerada para ele levar.

## 3. Mapa dos documentos
| Arquivo | Para quê |
|---|---|
| `docs/00-visao.md` | o que o app é, os princípios do Pedro, o glossário |
| `docs/01-regras.md` | **as regras** (normativo) |
| `docs/02-arquitetura.md` | Python + FastAPI + pywebview + PixiJS + Svelte; estrutura do repositório; fluxo de dados |
| `docs/03-dados.md` | arquivos, convenções de hex e aresta, campanha, conferências |
| `docs/04-motor-de-regras.md` | núcleo de referência, rota, ações da sessão |
| `docs/05-interface.md` | editor, sessão, tooltip, janela dos jogadores, névoa |
| `docs/06-arte.md` | tiles, tinta, repetição, rios e vias por código, kit de UI, fonte |
| `docs/07-geografia.md` | da arte do Pedro à grade; o teste de tamanhos |
| `docs/08-fases.md` | fases F0–F7 com critério de pronto |
| `docs/09-sistema-khalkaria.md` | trechos verbatim do Sistema |
| `docs/10-pendencias.md` | perguntas abertas (P16–P18), respostas já dadas, observações e conteúdo do Pedro |

## 4. Referência rápida
- **Grade:** topo chato, *odd-q*, id `CCLL` (1-based). Direções N, NE, SE, S, SO, NO; arestas canônicas N, NE e SE.
  Tile 32 × 48, face 32 × 28 em y = 18.
- **9 regiões**, com H 5/5/10/10/10/15/15/20/20 em ordem de rank.
- **As regiões são camadas** que ligam e desligam. Uma região alternativa (a ilusão do Oásis) ocupa as células de
  outra. O estado por hex usa a chave `CCLL@camada`; a névoa é por lugar.
- **10 tipos** (custo em m; raio de visão):

  | Tipo | Custo | Visão |
  |---|---|---|
  | Campos | 4,5 | 1 |
  | Floresta | 6 | 1 |
  | Floresta Densa | 7,5 | 0 |
  | Colinas | 6 | 2 |
  | Montanha | 9 | 3 |
  | Pântano | 7,5 | 1 |
  | Deserto | 6 | 1 |
  | Ermo | 4,5 | 1 |
  | Água | o do barco | 2 |
  | Litoral | 4,5 | 2 |

- **Vias:** estrada 1,5 m e trilha 3 m, só no passo que segue a via.
- **Barcos** (orçamento do grupo): Galeão 1,5 m, Fragata 3 m e Canoa 4,5 m, por aresta de rio e por hex de Água.
- **Rio:** CD 10 + ⌊H/2⌋, com o maior H dos dois hexes; na falha, 2d6+3 e 1d6 hexes rio abaixo.
- **Dia:** o orçamento é o menor Movimento. A manhã vai até 2/3, a tarde até 1/3, a noite até 0.
  - Explorar pula um período.
  - **Paradas:** fim de período andando, explorar e fim do movimento.
  - No fim do movimento, o grupo explora o hex e só então descansa.
- **Jornada:** a cada parada, uma vez por período, com meta 3 + H/5. Na falha, d100 da região (o grupo rola): só
  dano, +H salvo no 100.
- **Tabelas:** 8–12 entradas por hex, mistura de polaridade por rank, pesos 5/3/1, d100 pelo maior resto com piso 1.
  - Notável e raro marcam o hex e saem de todas as tabelas.
  - Comum re-rola se o hex não estiver marcado.
  - O Abrigo marca o hex.
- **Extração:** no máximo 4 Materiais por região; peso × 0,5ᵏ, zerado pelo descanso; CD 10/13/16/20; unidades
  1 + ⌊(r − CD)/5⌋.
- **Visão:** pelo tipo, configurável. Embarcado num rio, só os 2 hexes da aresta; num hex de Água, raio 2.
- **Névoa:** oculto (preto, sem grade), visto (cinza), visível (vívido).

## 5. Método de trabalho
- **Fase a fase** (`docs/08-fases.md`). Não comece a próxima com a anterior vermelha.
- **Antes de cada commit:** pytest, vitest, o validador dos dados e os schemas. Em mudança visual, uma captura
  Playwright.
- **Confira por programa, não a olho.** Compare conjuntos (`set`), conte, procure duplicatas (`Counter`). O projeto
  aprendeu isso na marra: uma carta duplicada passou numa conferência manual.
- **Commits atômicos**, com mensagem descritiva em PT-BR. Nada de identificador de modelo em commit, código ou doc.
- **Fim de cada entrega:** um resumo curto das mudanças e a lista do que depende do Pedro.

## 6. Não fazer
- Não inventar regra, número nem conteúdo canônico. Não preencher lacuna em silêncio.
- Não mandar à janela dos jogadores nada além da projeção dos jogadores.
- Não usar `localStorage` como persistência: a fonte é o JSON em disco.
- Não editar o CSV do Bazar.
- Não commitar os mapas originais nem `node_modules`, `dist` ou `__pycache__`.
- Não girar tiles nem suavizar a pixel art: zoom inteiro, *nearest*.
- Não usar ids por índice: ids estáveis e legíveis (`CCLL`, kebab-case).
