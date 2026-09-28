# Referências da régua de balanceamento

## Por onde começar

1. **`09-decisoes-pedro.md`** — **leia primeiro, é a lei.** Todos os parâmetros de decisão do Pedro,
   organizados por assunto. Tem precedência sobre qualquer outro arquivo e sobre qualquer inferência.
2. **`auditor.py`** — a régua executável. Nada de conferir lista no olho.
   `armas · craft · precos · ingredientes · lacunas · travas · economia · dump <cat> · novidades`
3. O reference da categoria que você for revisar.

## Estado do Bazar

`references/bazar-v26.csv` — **727 itens + 1 linha de cabeçalho, 29 colunas.**
✅ **Cabeçalho na linha 1.** Antes estava na linha 606 e a linha 1 era um item, o que quebrava
`csv.DictReader` e o gerador. `Bazar_Khalkaria_v26.csv` na raiz é o export para o gerador.

| Categoria | Itens | Receitas |
|---|---|---|
| Consumível | 239 | 126 |
| Arma | 181 | 181 |
| Bugiganga | 65 | 64 |
| Item Mágico | 61 | 0 |
| Armadura | 50 | 50 |
| Lixo | 48 | 0 |
| Munição | 36 | 36 |
| Material | 35 | 0 |
| Escudo | 10 | 9 |
| Material, Consumível | 2 | 0 |

**Lixo, Material, Pergaminho, Sobrevivência e Único/Quest não entram na conta de receita.

**Lixo e Material não entram na conta de receita** — lixo não se fabrica e material se extrai.
Sobre o que é fabricável: **446 de 637, 70%**. O que falta é Consumível (em revisão) e
Item Mágico (adiado de propósito, D37).

**Colunas:** Nome · Categoria · Raridade · Efeito · Efeito_Jogador · Valor (Sins) · Obtenção ·
Tipo de Craft · Ingredientes · Tags · Lore/Notas · **CD de Craft** · (17 colunas vazias de reserva).

`Bazar_Khalkaria_v25.csv` na raiz do repo é do Pedro e **não é editado pelo agente**.

## Arquivos

| Arquivo | Conteúdo | Origem |
|---|---|---|
| **`09-decisoes-pedro.md`** | **Os parâmetros. Lei.** | conversa com o Pedro |
| `01-nucleo-sistema.md` | Regras centrais: perícias, retaliação, dano/defesa, armas, inventário, magia | Notion `2b76e3a4…` |
| **`13-batedor-diagnostico.md`** | Diagnóstico do Batedor + decisão de escopo + Rodada 1 (P1–P6). A proposta completa está no `18` | análise + Notion `8706e3a4…` |
| **`14-ficha-digital.md`** | **Resposta ao agente de HTML:** arbitragem das 21 contradições e das 59 perguntas da ficha digital, com o que precisa ir ao Notion | Notion `2b76e3a4…` + D1–D79 |
| **`15-ficha-rodada3.md`** | **Rodada 3 da ficha:** log do Notion gravado (antes/depois), respostas C1–C6, **lote PD20 de revisão (L01–L45)** e pendências da main | Notion + `03-respostas-pedro.md` |
| **`16-log-tecnicas.md`** | **Resposta ao Log de Técnicas:** 15 princípios de leitura (G1–G15), 19 perguntas ao Pedro com recomendação (T1–T19), o lote L aplicado no Notion e a resposta a cada um dos 110 achados do balanceamento. **Revisões 1, 2 e 3 (2026-09-28):** respostas do Pedro, §R, §R2 e §R3 | artefato do agente de HTML + Notion |
| **`17-respostas-T-e-sync.md`** | **Ponto de retomada:** respostas do Pedro às T1–T19 (D98–D117) e às levas seguintes (D118–D126), o que já foi gravado no Notion, o que falta e o **log de sincronização do Notion** para o agente de HTML | conversa com o Pedro + Notion |
| **`18-batedor-rework.md`** | **Proposta do rework do Batedor, rodada 2** (esperando aceite). Contém: decisões do Pedro (3/8/4, treinamento, CD, característica Mapa); 3 opções para a 2ª característica; 15 técnicas em torno do mapa; direção dos 3 ramos; **10 decisões**. A rodada 1 está no commit `a4ea40f` | Notion `8706e3a4…` + D79, D131–D133 |
| **`19-gabarito-de-classe.md`** | **Estrutura de criação de classes** (D79). Contém: esqueleto da página; coeficientes; R1–R7; orçamento das 15 técnicas; ramos e ultimates; convenções de texto; checklist de validação | as 6 classes do Notion, 2026-09-28 |
| `batedor-notion-antes-do-rework.txt` | Retrato da página do Batedor no Notion antes do rework (base do diff para o log do novo Batedor) | Notion `8706e3a4…`, 2026-09-28 |
| `batedor-sim-instinto-rework.py` | Monte Carlo do Instinto proposto (semente fixa); modelo de simulação para recurso de classe. O `batedor-sim-instinto.py` é a versão da Rodada 1 (`13`) | — |
| `log-tecnicas-respostas.json` | as mesmas respostas como dado (gerador: `scripts/log-tecnicas/build16.py`) (`log-tecnicas-respostas/1`): uma entrada por id de achado, com status, princípio e pergunta | gerado |
| `ficha-digital-regras.json` | as mesmas regras como dado, no contrato `regras-ficha/1.1` — cada regra com `status` (canônico / aprovado / decisão / pedroDecide / pendente) | gerado |
| **`ficha-efeitos-itens.json`** | **O que cada um dos 727 itens do Bazar muda na ficha** (pedido 2 do agente de HTML, bloco B): itens · armas · consumo · semEfeito, conta fechada | gerado |
| `ficha-efeitos-gerador.py` · `ficha-efeitos-overrides.json` | gerador com gramática fechada por frase + detector de falso negativo; exceções revisadas à mão | — |
| `marcas-vhelor.json` | **fonte única das 7 Marcas da Vhelor** (texto do Pedro, gatilhos por item, efeitos por marca); o gerador copia para o bloco `marcasVhelor` | Pedro (PD26a) |
| **`12-magias-nivel1.md`** | **As 20 magias de Nível 1**, formato de tabela do Notion | fechado com o Pedro |
| `magias-nivel1.json` | as mesmas 20 como dado (Rota 1) | gerado |
| `magias-nivel1-gerador.py` | guarda as 20 e **valida antes de emitir**: 5 por escola, nomes únicos, modulações da escola certa, barras de exatamente 3 valores, nenhuma menção a Contida | — |
| `prompt-slides-magias.md` | prompt pronto para o Claude Design: 8 slides (M1–M8) | — |
| `prompt-slides-17-24.md` | prompt pronto para o Claude Design: a seção do Bazar | — |
| `02-condicoes.md` | 30 condições ordenadas por impacto em combate | Notion `3a66e3a4…ceef0b25` |
| `03-origens.md` | 17 origens + Sins iniciais (âncora de preço). ⚠️ **Superado** (2026-09-27): diverge do site; vale `data/origens.json` | Notion `3a66e3a4…cb77002a` |
| `04-racas.md` | 7 raças + régua raridade→poder das Tecnologias do Autômato. ⚠️ **Superado** (2026-09-27): diverge do site; vale `data/racas/*.json` | `data/racas/*.json` |
| `05-classes.md` | 7 classes, orçamento de 15 pontos, régua de preço canônica | `data/classes/*.json` |
| `06-magias.md` | 80 magias, escala de dano | `data/magias.json` |
| `07-limiar.md` | 170 cartas, âncoras de preço | `data/limiar.json` |
| `08-divergencias.md` | Divergências pendentes de decisão | cruzamento Notion × repo × CSV |
| `10-novidades-bazar.md` | Itens novos, para o Pedro mostrar aos jogadores | **gerado** por `auditor.py novidades` |
| `11-progressao-craft.md` | Árvores de craft e progressão de arquétipo de item | análise |
| `alquimista-notion.json` | Nível, reagentes e CD dos 114 itens da tabela do Alquimista. Regerado da página em 2026-09-28 por `scripts/classes/alquimista_tabela.py`, que também compara com o CSV | Notion `eac6e3a4…` |
| `novidades.json` | Curadoria do que entra no `10-` | manual |
| `../scripts/classes/` | `nomes_index.py` (colisão de nome), `orcamento_tecnicas.py` (mix e custo das 15 técnicas), `estrutura_classes.py` + `.json` (as 7 classes extraídas do Notion) e `alquimista_tabela.py` (tabela do Alquimista × CSV) | `19` §10 |

⚠️ **Arquivos desatualizados conhecidos:** `03-origens.md` tem a versão antiga da origem Caçador
(a atual está no D7) e não tem as origens novas Lenhador/Mineiro/Alfaiate.
`05-classes.md` já foi corrigido quanto ao Municiador (D36).
