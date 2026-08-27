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

## D13 — Cobertura obrigatória de armas únicas 🆕
"Lacunas são inaceitáveis, vamos fazer questão de que todos os tipos de armas únicas tenham a
mesma quantidade em cada raridade: **Incomum 2, Exótico 2, Luxária 1**."
→ 15 chassis × 5 = **75 armas únicas**. Hoje existem 28. **Faltam 47.**

## D14 — Escada de payload por raridade (derivada do estilo do Pedro) 🆕
Normalizada por ele no lote 3 (LEVES):
| Raridade | Dado extra | Forma do efeito |
|---|---|---|
| **Incomum** | **+1d4** | `Crítico: <teste> ou <condição>` |
| **Exótico** | **+1d6** | efeito elaborado (condicional, escolha, dreno, respingo) |
| **Luxária** | **+1d8** | `Como 1 ação/reação, <efeito>, 3x/Descanso Longo` |
Gatilho padrão é **Crítico**, não "Ao acertar" (~7× mais frequente — foi corrigido na Lança Venenosa).
Frequência substitui custo de recurso (ver D10: itens não cobram Stamina).

## D15 — Identidade de chassi orienta o payload da arma única 🆕
O efeito único deve amplificar o **efeito de arma do chassi**, não fugir dele:
Dilacerar (Sangramento) → hemorragia, corte, corrosão de armadura ·
Alcançar (sem retaliação) → negação de reação e de Evasão Ativa ·
Desorientar (−2 Atacar/Defender, buff de party) → concussão, som, área ·
Executar (+1 dado) → duelo, aposta, multiplicador.

## D16 — 🔑 Toda condição aplicada por item deve declarar quando expira
"Existem condições que descrevem precisamente quando elas expiram. Sangramento sai com ataque,
Envenenamento expira ao suceder Fortitude. **Algumas condições não seguem esse padrão!** Lento por
exemplo não tem condição de expiração. E nem Surdo. Então explicite quando essa condição expira."
→ Ao escrever item que aplica condição, **sempre** incluir a expiração no texto do item.
Padrão adotado: `até o fim da próxima rodada` (alinhado com *Atordoado*, a única condição
temporizada do cânone).

### 🔴 16 condições do Notion não têm regra de expiração
`Desorientado` · `Lento X` · `Confuso` · `Enjoado` · `Cego` · `Surdo` · `Enraizado` ·
`Amedrontado` · `Bêbado` · `Paralisado` · `Inconsciente` · `Desprevenido` · `Oco` ·
`Desnutrido X` · `Sobrepeso Leve` · `Sobrepeso Extremo`
**A mais grave é `Desorientado`** — é um dos 4 efeitos de arma canônicos (Desorientar, 2 Stamina)
e não diz quanto dura. Toda arma Contundente do Bazar depende disso.
**Pendente de decisão do Pedro no nível de sistema, não do Bazar.**

## D17 — Estilo de nomenclatura (aprendido nas correções do lote 3)
O Pedro renomeia para o **objeto físico correto**, não para o efeito:
Espada→Adaga/Cimitarra/Foice Curta conforme o chassi ser leve; Estilete→Raízes; Faca→Adagas Duplas.
Nome descreve **a arma**, o payload descreve o efeito. Evitar nomes que só repitam o elemento.

## Lote 3 (LEVES) — CONCLUÍDO
9 armas revisadas + **11 criadas**. Os 4 chassis leves estão em 2/2/1.
Novas: Lâmina Corrosiva · Agulha do Vazio · Maça do Ecoante · Punhal de Mármore ·
Manoplas Elétricas · Martelo do Juízo · Badalo de Kharavel · Florete Instável ·
Lâmina do Duelista · Fio Dissonante · Fragmento Primordial.

## D18 — Fragmento Primordial fica sem trava (aprovado)
"Vamos deixar a Leve Ágil como está, é pra ser muito forte. Fragmento do Primórdio, que é o plano
onde os deuses vivem."
→ DPR 24,75 com exposição 0 permanente é o teto deliberado do sistema. **Não é bug.**
A lore sustenta: arma feita do plano divino não paga o imposto de retaliação do plano material.
