# Referências da régua de balanceamento

| Arquivo | Conteúdo | Origem |
|---|---|---|
| `01-nucleo-sistema.md` | Regras centrais: perícias, retaliação, dano/defesa, armas, inventário, magia, economia de Sins | Notion `2b76e3a4…` (fetch 2026-08-26) |
| `02-condicoes.md` | 30 condições ordenadas por impacto em combate | Notion `3a66e3a4…ceef0b25` |
| `03-origens.md` | 17 origens + **Sins iniciais** (âncora de preço) | Notion `3a66e3a4…cb77002a` + `data/origens.json` |
| `04-racas.md` | 7 raças + **régua raridade→poder das Tecnologias do Autômato** | `data/racas/*.json` |
| `05-classes.md` | 7 classes, orçamento de 15 pontos, **régua de preço canônica** (259 habilidades varridas) | `data/classes/*.json` + `pages/classes/*.html` |
| `06-magias.md` | 80 magias, escala de dano, custo dos nível 4 | `data/magias.json` |
| `07-limiar.md` | 170 cartas, âncoras de preço das cartas universais e de atributo | `data/limiar.json` |
| `08-divergencias.md` | **Divergências pendentes de decisão do Pedro** | cruzamento Notion × repo × CSV |
| `bazar-v26.csv` | Cópia de trabalho do Bazar (582 itens) — **fonte da verdade do Bazar** | anexo do Pedro |

`bazar-v26.csv` é cópia de trabalho para análise. O `Bazar_Khalkaria_v25.csv` na raiz do repo
continua sendo do Pedro e não é editado pelo agente.
Colunas do CSV: Nome · Categoria · Raridade · Efeito · Efeito_Jogador · Valor (Sins) · Obtenção ·
Tipo de Craft · Ingredientes · Tags · Lore/Notas. **O cabeçalho está na última linha (582).**
