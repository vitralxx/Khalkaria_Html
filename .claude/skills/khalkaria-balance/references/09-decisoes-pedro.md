# Log de decisões do Pedro
Registro vivo. **Tem precedência sobre qualquer inferência minha.** Atualizar a cada rodada.

## D1 — Armas: o Notion sobrescreve o CSV ✅
"Tem seções no notion que sobrescrevem certos itens no bazar como a tabela de armas, que é a
verdadeira pelo notion nesse caso." → **Os 5 chassis divergentes vão convergir para o Notion.**
"A maioria das armas estão desatualizadas."

## D2 — Munição: por CENA de combate ✅
"Você gasta 1 munição do tipo respectivo da arma à distância por cena de combate, você não precisa
gastar munições individuais. As munições no bazar adicionam efeitos a arma, ataque em área, mais
dano por disparo, sim é um buff de cena por 1 item, por isso eles devem ser balanceados
adequadamente." → O "20 munições = 1 slot" do CLAUDE.md está **errado**.

## D3 — Alcance das armas à distância é canônico ✅
**Distância Simples 18 m · Distância Pesada 18 m · Arremesso 9 m.**
"Pode adicionar na descrição desses tipos de armas."

## D4 — Toda arma declara seu efeito no texto ✅
"Adicione esse efeito nas marciais e leve em consideração que as outras armas também devem ter
explicitado seus efeitos nas descrições."
→ Marciais levam também: **"1x/turno não custa Stamina"**.

## D5 — Cláusula "empilháveis" 🆕
"Existe também a cláusula empilháveis, não para armas, porém serve pra itens muito leves como
**munições e lixo**." → Aplicar ao revisar Munição e Lixo. (Casa com a regra do Notion:
"Itens leves contam como 1 bugiganga a cada 10 unidades.")

## D6 — Economia de comerciantes: alterações aprovadas 🆕
| Campo | Antes (Notion) | **Decidido** |
|---|---|---|
| Estoque nv1 / nv2 / nv3 | 100 / 250 / 500 | **250 / 500 / 1000** |
| Reposição | 1d / 2d / 3d | **1 dia fixo para todos** |
| Margem de venda | 50% / 66% / 75% | mantida |
| Custo de upgrade | 250 / 500 | **em revisão** — Pedro considera baixar, porque são **6 categorias de comerciante** e o custo total de subir todos é proibitivo |

**Resolve o furo do Luxária:** estoque nv3 de 1000 > média Luxária de 683. ✅
**Resolve a inversão de reposição:** timer fixo não pune mais quem vende em lotes pequenos. ✅
**Mantido de propósito:** comerciante que compra ≠ comerciante que vende.
"É intencional, faz os jogadores ponderarem em quem investir, mesmo naqueles npcs que eles não
gostam, cria tensão e narrativa."
**Enquadramento correto do upgrade:** não é decisão econômica, é **acesso + RP** — libera itens
novos, quests, e "denota o custo real de viver na economia de Khalkaria".

## D7 — Origem Caçador reformulada 🆕
Substitui o texto antigo ("Sobrevivência ≥ 15 → 2 Comidas + 1 item incomum vendável"):
> Você usa sua **ação de descanso longo** para caçar e deve suceder em **Sobrevivência CD 15**.
> Ao suceder, ganha **1d4 item:Comida** e **1d4 item:Couro de Caça**.

**Couro de Caça** = material **Ordinário**, serve para crafting **e** venda.
→ Renda cai de ~50 Sins/dia para ~2,5 × 21 ≈ **52 Sins/dia brutos em material Ordinário**, mas
agora **custa a ação de descanso** (compete com Ferraria/Engenharia/Tratar Ferimentos) e entra na
cadeia de crafting em vez de virar Sins direto. Integrado ao sistema de comerciantes.
⚠️ **Verificar se "Couro de Caça" existe na categoria Material do CSV.**

## D8 — Cartas do Limiar: poder absurdo é o design ✅
"TODAS as cartas do limiar estão no notion, elas mudam drasticamente o sistema quando são usadas,
pois as cartas raras, principalmente as de requisitos mais específicos e difíceis, são muito
fortes. **Mas esse é o design, poder absurdo.**"
→ **Não tratar carta rara forte como bug.** Ao comparar item × carta, a carta rara é o teto
*legítimo*. O que continua valendo: um **item comprável e acumulável** não deve igualar uma carta
travada atrás de requisito de atributo alto, porque item não tem o mesmo gate.
Custos em pontos das cartas: **estão no Notion**, buscar quando precisar.

## D9 — Preços em Sins já estão certos ✅
"Eu já tinha ajeitado os sins dos itens em outra sessão."
Confirmado pelo auditor: **0 de 582 itens fora da faixa**. A raridade é a única alavanca de preço.

## Ordem de revisão aprovada
Arma (genéricas → focos → únicas) → Munição → Escudo → Armadura → Item Mágico → Consumível →
Bugiganga → Lixo. **Material: não tocar.**
Protocolo: lotes de ~12–15 itens; imprimo Nome | Raridade | Descrição EXATA; Pedro opina em lista
numerada; **correção num item se aplica à família inteira**.

---

## D10 — 🔑 Itens não cobram Stamina
"Geralmente, eu não cobro Stamina em itens, pelo custo de Sins ou ingredientes."
→ **O custo de um item é o preço de aquisição (Sins/ingredientes), não recurso por uso.**
Exceção que não é exceção: os **efeitos de arma** (Dilacerar/Alcançar/Desorientar 2, Executar 3)
custam Stamina porque são **regra do sistema**, não do item.
→ Ao precificar item, a alavanca é **raridade + frequência de uso** (1x/combate, 1x/descanso longo),
nunca "gasta N Stamina".

## D11 — Teto de dano por acerto é permissível no topo
Sobre o Martelo de Mundarak (Pesada Brutal +3, 5d12+3, máx. 63 / 126 no crítico):
"Essa arma é o ápice do poder por ataque individual, Pesada Brutal +3 com arma única Luxária,
é permissível que ela seja poderosa." → **Não tratar como bug.**

## D12 — Focos Primordiais são +3 por natureza
"Os focos primordiais são lategame lvl 5 apenas, então não faz sentido serem menor que Luxária,
então naturalmente são armas +3." → Não existe Primordial +1/+2. Correto por design.

## Lotes concluídos
- **Lote 1 (15 armas genéricas base → 118 armas):** aplicado. 53 reescritas, 35 já corretas.
  15/15 chassis conformes ao Notion.
- **Lote 2 (30 focos místicos):** aplicado. Normalizados para
  `Foco Místico (Escola). Permite canalizar... +N Místico, +5N Éter máximo.
  Requisito: Inteligência ≥ 12 e {Treinado|Experiente} em Místico. <efeito único>`
  Correções: Primordiais passam a exigir **Experiente**; Véu de Velúria +20 → **+15 Éter**;
  6 efeitos únicos reescritos pelo Pedro (Égide, Estilhaço, Premonição, Baluarte, Demiurgo,
  Inquebrável).
