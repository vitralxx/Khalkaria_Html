# Referências da régua de balanceamento

## Por onde começar

1. **`09-decisoes-pedro.md`** — **leia primeiro, é a lei.** Todos os parâmetros de decisão do Pedro,
   organizados por assunto. Tem precedência sobre qualquer outro arquivo e sobre qualquer inferência.
2. **`auditor.py`** — a régua executável. Nada de conferir lista no olho.
   `armas · craft · precos · ingredientes · lacunas · travas · economia · dump <cat> · novidades`
3. O reference da categoria que você for revisar.

## Estado do Bazar

`references/bazar-v26.csv` — **699 itens, 700 linhas, 29 colunas.**
⚠️ **O cabeçalho está no MEIO do arquivo (linha 581)**, não na primeira nem na última: linhas novas
foram acrescentadas depois dele. `auditor.load()` já trata isso.

| Categoria | Itens |
|---|---|
| Consumível | 214 |
| Arma | 181 |
| Bugiganga | 67 |
| Item Mágico | 61 |
| Lixo | 48 |
| Armadura | 45 |
| Material | 37 |
| Munição | 36 |
| Escudo | 10 |

**Colunas:** Nome · Categoria · Raridade · Efeito · Efeito_Jogador · Valor (Sins) · Obtenção ·
Tipo de Craft · Ingredientes · Tags · Lore/Notas · **CD de Craft** · (17 colunas vazias de reserva).

`Bazar_Khalkaria_v25.csv` na raiz do repo é do Pedro e **não é editado pelo agente**.

## Arquivos

| Arquivo | Conteúdo | Origem |
|---|---|---|
| **`09-decisoes-pedro.md`** | **Os parâmetros. Lei.** | conversa com o Pedro |
| `01-nucleo-sistema.md` | Regras centrais: perícias, retaliação, dano/defesa, armas, inventário, magia | Notion `2b76e3a4…` |
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
