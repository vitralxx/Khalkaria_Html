# Divergências pendentes de decisão do Pedro
Levantadas na construção da régua (Notion, repo e CSV v26 cruzados em 2026-08-26).
**Nada aqui foi alterado — são sinalizações, conforme a regra de nunca escolher em silêncio.**

## A. Notion × briefing do Pedro

### A1. 🔴 Munição — duas regras incompatíveis
- **Notion (Sistema → Armas):** "Armas à distância requerem **1 munição para serem usadas pelo
  combate inteiro**. A munição é descontada **por combate**." E em O Bazar: munição especial
  "concede seu efeito **durante todo o combate, em cada ataque**".
- **Notion (Inventário):** "munições (Flechas e etc) contam como **1 bugiganga**".
- **CLAUDE.md e briefing:** "**20 munições = 1 slot**", "consomem munição" (por tiro, implícito).

**Impacto:** se munição é por combate, munição especial é um **buff de cena inteira por 1 unidade** —
ordem de grandeza mais forte do que um consumível por tiro, e muda a precificação das 23 munições
do Bazar. **Precisa de decisão antes de revisar a categoria Munição.**

### A2. 🔴 Alcance das armas à distância não existe no Notion
O briefing usa Distância Simples 18 m, Distância Pesada 18 m, Arremesso 9 m.
**A tabela de armas do Notion não tem coluna de Alcance.** Não é canônico até o Pedro confirmar.

### A3. 🔴 Tipo de dano elemental: "Gelo" vs "Elétrico"
O Notion lista `Elemental (Fogo ; Frio ; Gelo)` — **Frio e Gelo são a mesma coisa**.
Evidência de que o correto é **Elétrico**: a superfície "Molhado" do próprio Notion diz
*"vulnerável a dano Elemental(Eletricidade)"*; a magia **Raio Elétrico** causa dano Elétrico;
o CLAUDE.md e o site listam Elétrico. **Parece erro de digitação no Notion.**

### A4. Contradição do "Defender" — **RESOLVIDA pelo Notion**
A Régua v0.2 (A.9 #1) apontava conflito entre `sistema.html` ("1d10 + Mod.Destreza") e as páginas de
classe. **O Notion é inequívoco:** Defender escala por **dado** — 1d6/1d8/1d10/1d12/2d8 por nível de
proficiência — e a Evasão Ativa é `Evasão + dado de Defender`.
→ **`pages/sistema.html` do repo está desatualizado** e deve ser corrigido contra o Notion.

### A5. Retaliação — **CONFIRMADA e mais forte do que a Régua v0.1 supunha**
O Notion confirma explicitamente: *"Enquanto estiver sendo alvo dos seus ataques durante o seu turno,
a criatura pode escolher reagir a cada um deles. Ao final do seu turno, ela considera a reação gasta."*
→ **3 ataques abrem 3 retaliações.** Confirma o briefing do Pedro.
Detalhe que o briefing não menciona: ao retaliar, **o alvo também recebe o dano do seu ataque**;
crítico dele nega seu dano; falha crítica dele torna seu ataque crítico.

### A6. Modulações de magia ausentes do CLAUDE.md e do briefing
16 modulações canônicas (4 por escola) — um eixo de poder inteiro. A mais relevante:
**Acelerar (Abjuração, +5 Éter) reduz o custo de ação da magia em 1** (3→2→1→Reação→Ação Livre).
É o único desconto de ação comprável do sistema, **sem limite de uso declarado**.

### A7. "4 escolas" vs Foco Primordial
CLAUDE.md diz 4 escolas. O Notion lista um **5º foco — Foco Primordial** (req. Experiente em
Místico), que **destrava as magias de nível 4**. Não é uma 5ª escola: é o portão do nível 4.
Vale registrar no CLAUDE.md para não parecer contradição.

## B. CSV v26 × tabela de armas do Notion — **a descalibração que o Pedro relatou**

Auditado programaticamente. **5 dos 15 chassis de arma divergem do Notion**, afetando **28 dos 118
itens da categoria Arma** (as bases, todos os `+1/+2/+3` e as armas únicas construídas sobre elas).
`+N` somando dados **não** é divergência — é a regra de nível de arma.

| Chassi | Notion | CSV v26 | DPR nv1 (Notion → CSV) | Δ |
|---|---|---|---|---|
| **Marcial Pesada** | 2d10 / Atacar(2) | 1d10 / Atacar(2) | 8,95 → 5,38 | **−40%** |
| **Marcial Precisa** | 1d8 / **Atacar(1)** | 1d10 / **Atacar(2)** | 8,55 → 5,38 | **−37%** e **troca de arquétipo** |
| **Pesada Brutal** | **2d12** / Atacar(3) | 2d8 / Atacar(3) | 10,25 → 7,65 | **−25%** |
| **Marcial Longa** | 2d10 / **Atacar(2)** | 1d8 / **Atacar(1)** | 8,95 → 8,55 | −4% mas **troca de arquétipo** |
| **Distância Simples** | 1d6 | 1d8 | 7,35 → 8,55 | **+16%** |

### Por que as duas trocas de arquétipo são mais graves que os números
- **Marcial Precisa** no Notion é a marcial **leve de 1 ação** (DES, Executar grátis) — o chassi
  marcial do arquétipo de múltiplos ataques. No CSV virou **Atacar(2)**, o que a joga no balde das
  pesadas e **deixa o arquétipo marcial-ágil sem representante**.
- **Marcial Longa** no Notion é a **única corpo a corpo com exposição zero permanente**: Atacar(2)
  significa 1 ataque por turno, e o Alcançar grátis 1×/turno cobre exatamente esse ataque.
  No CSV virou **Atacar(1)/1d8** — 3 ataques por turno com só o primeiro protegido, o que **destrói
  a propriedade que justifica a arma** e ainda a transforma numa leve de FOR.

**Itens afetados (28):** todas as `Arma <Chassi>` e `+1/+2/+3` desses 5 chassis, mais as únicas
*Marreta Volkrestiana*, *Martelo de Mundarak*, *Lâmina de Hyven*, *Lâmina de Vytália*,
*Lança de Casca-Seiva*, *Grilhões de Osh'Kar*, *Arco Elétrico*, *Arco do Vento*.

**Decisão necessária do Pedro:** o CSV converge para o Notion, ou o Notion foi reescrito e o CSV é
que está certo? O briefing diz que "a tabela de armas foi reescrita", o que sugere que **o Notion é
a versão nova e o CSV ficou para trás** — mas isso precisa ser confirmado, não presumido.

## C. Lacunas de dados
- 🔴 **Efeito das 59 cartas raras do Limiar não está no repo** (só nome + requisito) — decisão de
  design existente do site. Para avaliar interação item↔carta rara é preciso buscar no Notion.
- 🔴 **Custo em pontos das cartas do Limiar não está no repo** (nenhum campo `custo` preenchido).
  Sem isso não dá para converter "1 carta" em "N pontos" de forma exata.
- O `notion_cache/` estava sem baseline; só `sistema` foi materializado nesta sessão.
