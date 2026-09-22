# Referências da régua de balanceamento

## Por onde começar

1. **`09-decisoes-pedro.md`** — **leia primeiro, é a lei.** Todos os parâmetros de decisão do Pedro,
   organizados por assunto. Tem precedência sobre qualquer outro arquivo e sobre qualquer inferência.
2. **`auditor.py`** — a régua executável. Nada de conferir lista no olho.
   `armas · craft · precos · ingredientes · lacunas · travas · economia · dump <cat> · novidades`
3. O reference da categoria que você for revisar.

## Estado do Bazar

`references/bazar-v26.csv` — **722 itens, 723 linhas, 29 colunas.**
⚠️ **O cabeçalho está no MEIO do arquivo (linha 599)**, não na primeira nem na última: linhas novas
foram acrescentadas depois dele. `auditor.load()` já trata isso.

| Categoria | Itens | Receitas |
|---|---|---|
| Consumível | 235 | 106/235 |
| Arma | 181 | 181/181 |
| Bugiganga | 64 | 64/64 |
| Item Mágico | 61 | 0/61 |
| Armadura | 50 | 50/50 |
| Lixo | 48 | 0/48 |
| Material | 37 | 0/37 |
| Munição | 36 | 36/36 |
| Escudo | 10 | 9/10 |

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
| **`12-magias-nivel1.md`** | **As 20 magias de Nível 1**, formato de tabela do Notion | fechado com o Pedro |
| `magias-nivel1.json` | as mesmas 20 como dado (Rota 1) | gerado |
| `magias-nivel1-gerador.py` | guarda as 20 e **valida antes de emitir**: 5 por escola, nomes únicos, modulações da escola certa, barras de exatamente 3 valores, nenhuma menção a Contida | — |
| `prompt-slides-magias.md` | prompt pronto para o Claude Design: 8 slides (M1–M8) | — |
| `prompt-slides-17-24.md` | prompt pronto para o Claude Design: a seção do Bazar | — |
| `02-condicoes.md` | 30 condições ordenadas por impacto em combate | Notion `3a66e3a4…ceef0b25` |
| `03-origens.md` | 17 origens + Sins iniciais (âncora de preço) | Notion `3a66e3a4…cb77002a` |
| `04-racas.md` | 7 raças + régua raridade→poder das Tecnologias do Autômato | `data/racas/*.json` |
| `05-classes.md` | 7 classes, orçamento de 15 pontos, régua de preço canônica | `data/classes/*.json` |
| `06-magias.md` | 80 magias, escala de dano | `data/magias.json` |
| `07-limiar.md` | 170 cartas, âncoras de preço | `data/limiar.json` |
| `08-divergencias.md` | Divergências pendentes de decisão | cruzamento Notion × repo × CSV |
| `10-novidades-bazar.md` | Itens novos, para o Pedro mostrar aos jogadores | **gerado** por `auditor.py novidades` |
| `11-progressao-craft.md` | Árvores de craft e progressão de arquétipo de item | análise |
| `alquimista-notion.json` | Nível, reagentes e CD dos 95 itens alquímicos | Notion `eac6e3a4…` |
| `novidades.json` | Curadoria do que entra no `10-` | manual |

⚠️ **Arquivos desatualizados conhecidos:** `03-origens.md` tem a versão antiga da origem Caçador
(a atual está no D7) e não tem as origens novas Lenhador/Mineiro/Alfaiate.
`05-classes.md` já foi corrigido quanto ao Municiador (D36).
