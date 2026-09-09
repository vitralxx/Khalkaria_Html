# Progressão de craft — arquétipos de item

Fonte: `auditor.py ingredientes` sobre `bazar-v26.csv` (646 itens, 231 receitas, 28 materiais).

---

## 1. As duas árvores mapeiam o inventário 1:1

```
Ofício(Ferraria)    →  EQUIPAMENTOS  →  Arma 181 · Armadura 45 · Escudo 10
Ofício(Engenharia)  →  BUGIGANGAS    →  Bugiganga 65 · Munição 23 · Consumível 185 · Item Mágico 61
```

A infraestrutura já existe. ⚠️ **Divergência:** o CSV usa um terceiro tipo de craft,
**Alquimia**, em 74 consumíveis. Ou `Ofício(Alquimia)` é uma perícia à parte, ou esses 74
deveriam ser Engenharia. **Pendente de decisão.**

---

## 2. As 5 escadas de matéria (completas)

| Matéria | Ordinário | Incomum | Exótico | Luxária |
|---|---|---|---|---|
| **Metal** | Barra de Ferro | Aço Temperado | Liga Rúnica | Liga Primordial |
| **Madeira** | Madeira Comum | Madeira Nobre | Madeira Mística | Madeira da Vhelor |
| **Couro** | Couro de Caça | Couro Refinado | Couro Bestial | Pele de Dragão |
| **Mecânica** | Peça Mecânica | Engrenagem | Mecanismo Arcano | Coração Mecânico |
| **Tecido** | Tecido Resistente | Fibra Sintética | Trama Etérea | Fio do Destino |

**A regra "1 tipo por raridade" já vale para essas 5.** 20 dos 28 materiais.

### Os outros 8
| Material | Rar. | Papel |
|---|---|---|
| **Kali** | Exó | Metal de linha própria. Não é escada — é atalho temático (15 armas). |
| **Reagente Alquímico (x1)** | Ord | Insumo da Alquimia. **Escada truncada: só existe o Ordinário.** |
| **Gema Bruta** | Ord | "Valor decorativo/comercial." Utilitário, não ingrediente — por design. |
| **Lenha Seca** | Ord | "Fogueira completa de acampamento." Utilitário, não ingrediente. |
| **Areia Temporal** | Lux | Quest. → *Lágrimas do Tempo* (Alquimista Nv5) |
| **Coração da Árvore** | Lux | Quest. → *Elixir da Imortalidade* (Alquimista Nv5) |
| **Grilhões do Abismo** | Lux | Quest. → *Bomba do Vazio* (Alquimista Nv5) |
| **Sangue Primordial** | Lux | Quest. → *Soro do Homúnculo* (Alquimista Nv5) |

🔴 **Os 4 itens de Alquimista Nv5 não existem no Bazar.** O reagente existe, o produto não.

---

## 3. O buraco: a Alquimia não tem escada

75 consumíveis craftáveis, **todos feitos do mesmo Reagente Alquímico Ordinário**.
A raridade só muda a quantidade:

| Raridade do consumível | Receita | Custo em matéria | Valor do item |
|---|---|---|---|
| Incomum | `2x Reagente Alquímico` | 42 Sins | 67 Sins |
| Exótico | `3x Reagente Alquímico` | 63 Sins | 212 Sins |
| Luxária | `5x Reagente Alquímico` | 105 Sins | 683 Sins |

Um Luxária custa **15% do próprio valor** em matéria, e a matéria é a mais barata do jogo.
Compare com Bugiganga, que escala certo: Peça → Engrenagem → Mecanismo Arcano → Coração Mecânico.

**Consumível é a maior categoria do Bazar (185 itens) e a única sem progressão de material.**

Outros vazios: **Munição para no Incomum** (0 receitas Exóticas/Luxárias) ·
**Item Mágico tem 0 receitas em 61 itens** · **Armadura 12/45** · **76 armas únicas sem receita**.

---

## 4. A regra dos 2 ingredientes: estrutural + funcional

`1x item da raridade anterior  +  1x MATÉRIA ESTRUTURAL  +  1x MATÉRIA FUNCIONAL`

Slot 1 é **o que o item é**. Slot 2 é **o que o item faz**. Cada item passa a consumir duas
escadas, o que dobra o consumo sem dobrar o custo por tier (os dois ingredientes são do mesmo tier).

| Arquétipo | Estrutural | Funcional | Leitura |
|---|---|---|---|
| Arma Leve / Pesada / Marcial Pesada, Precisa, Versátil | Metal | Couro | lâmina + empunhadura |
| Arma Marcial Longa | Madeira | Metal | haste + ponta |
| Arma Distância Simples · Arremesso | Madeira | Tecido | corpo + corda/fixação |
| Arma Distância Pesada | Metal | Mecânica | cano + mecanismo |
| Armadura Leve | Couro | Tecido | corpo + costura |
| Armadura Pesada | Metal | Couro | placas + forro |
| Escudo | Metal *ou* Madeira | Couro | face + alças |
| Bugiganga | Mecânica | Tecido | mecanismo + acabamento |
| Munição | Metal | Mecânica | projétil + carga |
| Consumível | **Reagente** | matéria temática | base + agente |
| Item Mágico | **Reagente** | Tecido | base + condutor |
| Foco Místico | ❓ | ❓ | **pendente** — ver §6 |

---

## 5. Diagrama de progressão — continuidade de playstyle

O jogador escolhe o **chassi** no nível 1 e nunca troca de arquétipo. As trilhas:

```
UMA CADEIA DE ARMA  (o mesmo desenho se repete nos 15 chassis)

   ORDINÁRIO            INCOMUM              EXÓTICO             LUXÁRIA
   ─────────────────────────────────────────────────────────────────────────────
   Arma <Chassi> ─────→ +1 ────────────────→ +2 ───────────────→ +3
        │                │                    │                   │      trilha genérica
        │                │                    │                   │
        │      linhagem  ├─→ Única Inc A ───→ Única Exó A ──┐     │
        │        A / B   └─→ Única Inc B ───→ Única Exó B ──┴───→ Única Lux
        │                                                                trilha de playstyle
        └─── + 2x Kali ──────────────────→ Kali <Chassi>
                                                                 linha fechada (sem Luxária)
```

**Regras da cadeia:**
- Sobe-se a trilha genérica com material puro; migra-se para a de playstyle a qualquer tier.
- **Não se volta.** Uma única não destila de volta em genérica.
- Cada chassi tem **2 linhagens** de única (2 Inc → 2 Exó → 1 Lux, que converge as duas)
  **+ a linha Kali**, que sai direto da genérica e não sobe além do Exótico.
- ⚠️ **O pareamento linhagem A/B por chassi ainda não existe** — as 2 Incomuns e as 2 Exóticas
  de cada chassi precisam ser casadas por tema. É passagem item a item, em lotes.

```
ARMADURA  (famílias no texto: Leve 18 · Pesada 27)

   Armadura Leve ──→ +1 ──→ +2 ──→ +3        couro estrutural + tecido funcional
   Armadura Pesada ─→ +1 ──→ +2 ──→ +3       metal estrutural + couro funcional
       └─ únicas por família, mesma lógica de linhagem das armas

ESCUDO  (10 itens, todos genéricos — não há únicas)

   Escudo de Madeira ─┐
                      ├─→ Reforçado ──→ Rúnico ──→ Primordial
   Escudo de Ferro ───┘
```

```
BUGIGANGAS · Ofício(Engenharia)

   Bugiganga  Peça Mecânica → Engrenagem → Mecanismo Arcano → Coração Mecânico   ✅ escada ok
   Munição    Peça Mecânica → Engrenagem → ❌ falta          → ❌ falta
   Consumível Reagente ────→ ❌ falta ──→ ❌ falta           → ❌ falta
   Item Mágico ❌ categoria inteira sem receita
```

---

## 6. Decisões pendentes do Pedro

1. **Ofício(Alquimia) é uma terceira perícia** ou os 74 consumíveis viram Engenharia?
2. **Nomear os 3 tiers que faltam da escada do Reagente** (Incomum, Exótico, Luxária).
   O Luxária precisa ser *farmável* — Sangue Primordial é Único/Quest e não serve de insumo comum.
3. **Foco Místico (30 itens, 0 receitas):** qual escada? Gema Bruta está marcada como
   decorativa; ou ela vira ingrediente e ganha uma escada de gema, ou os focos usam
   Madeira Mística + Trama Etérea.
4. **Criar os 4 itens de Alquimista Nv5** que os reagentes de quest fabricam?
5. **Pareamento de linhagem** das únicas por chassi — confirmar que a migração genérica→única
   é permitida em qualquer tier.
