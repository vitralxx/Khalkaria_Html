# Raças (7) — Notion `3a66e3a4…a11c8a24` + `data/racas/*.json`
(Lobisomem ignorado por instrução do Pedro.)

## Base
| Raça | Atributos | Movimento | Subdivisões |
|---|---|---|---|
| Humano | **+1 em dois atributos** | 9 m | Simples, Estudioso, Rebelde, Popular |
| Anão | +2 CON, −1 DES | 7,5 m | Krichama, Caxon |
| Dryad | +2 DES/CON, −1 SAB | 10,5 m | Florescura, Cascaferro |
| Gruto | +2 FOR/CON, −1 INT | 9 m | Rokhan, Skal'ri |
| Corrompido | +2 INT/SAB, −1 CON | 9 m | Tocado, Alterado, Consumido |
| Autômato | +2 INT, −1 SAB | 9 m | Tecnologias Tier 1–5 |
| Inseto | varia | 7,5 / 9 / 10,5 m | Besouro, Louva-a-Deus, Barata |

## 🔴 Interações duras com o Bazar (leia antes de precificar qualquer consumível)
1. **Autômato: "Poções e Elixires não funcionam em você."** Cura maior exige o item **Kit de Manutenção**.
   → Toda a categoria de poções/elixires é **letra morta para uma raça inteira**. O Kit de Manutenção
   precisa existir no Bazar com paridade de poder, ou o Autômato é estruturalmente punido.
2. **Três fontes são imunes a Envenenamento**: Anão, Gruto e Inseto(Barata). O Autômato é imune a
   **todos os efeitos biológicos** (Sangramento, Envenenamento, doenças).
   → Venenos, Antídotos e o efeito **Dilacerar** (Sangramento) perdem valor contra ~40% das raças.
   Itens de veneno não devem ser precificados como se sempre funcionassem.
3. **Autômato é vulnerável (2×) a dano Elemental.** Itens que causem dano elemental ao portador
   custam o dobro para ele.
4. **Anão Krichama: "durante um descanso longo pode melhorar uma arma de nível 1 para nível 2
   (1 arma por descanso longo)."** → Concede de graça o que um item de upgrade de arma venderia.
   Qualquer item do Bazar que suba nível de arma compete diretamente com isto.

## 🔑 Régua canônica de raridade → poder (Tecnologias do Autômato)
Esta é a **única tabela do sistema que amarra raridade a efeito mecânico explícito**. Use como
referência normativa ao julgar se um item do Bazar está na raridade certa.

| Raridade | Tecnologias e o que entregam |
|---|---|
| **Incomum** | *Sensor de Proximidade* — **não pode ser surpreendido** (imunidade a Desprevenido) · *Fibra de Carbono* — **+1 Evasão** · *Suspensões Lubrificadas* — **+3 m de movimento** |
| **Exótico** | *Sistema de Reconhecimento de Ameaças* — **+1 ao atacar criaturas hostis e pode rolar Atacar com INT** · *Núcleo-Duplo* — **ao chegar a 0 de vida, fica com 1** (quebra; conserto CD 15 por descanso longo) · *Braço Balístico* — **Distância Simples integrada**, não desarmável, usa Munição de Fogo |
| **Luxária** | *Lâmina Retrátil* — **arma marcial leve +1 integrada**, saca com **ação livre** · *Capacitores de Energia* — 1 ação: **+1d6 de dano por 3 rodadas**, ao final **recebe 2d4 Elemental** (dobrado pela vulnerabilidade do Autômato) · *Auto-Reparador* — **cria 1 Kit de Manutenção por descanso longo** |
| Não comprável | Visão Térmica (Treinado Percepção) · Acabamento Refinado (Treinado Furtividade) · Biblioteca (Treinado Conhecimento) · Módulo de Linguagem · Scanner de Condição (1 ação: vê % de vida, evasão e habilidades usadas) · Backup (memórias importáveis em novo corpo) |

**Leitura:** um **Incomum** entrega +1 Evasão *ou* +3 m *ou* uma imunidade situacional — nunca os três.
Um **Exótico** entrega +1 ao atacar **com** uma troca de atributo, ou um salva-vidas 1×/descanso longo.
Um **Luxária** entrega uma arma inteira, ou +1d6 por 3 rodadas **com custo real embutido**.
🔑 **Note que o único buff de dano puro da lista (Luxária) vem com dano de retorno.** É o padrão
canônico: amplificação de dano em raridade alta **paga um preço**.

Aquisição: d100 ao entrar em loja — 1-79 nada · 80-89 uma tech · 90-99 duas · 100 três.

## Traços por raça (o que compete com itens)
**Anão** — Visão no escuro 18 m · 1×/descanso longo Fortitude com vantagem · descansa em 4 h ·
**imune a Envenenamento** · **Treinado em Armas Marciais E Armas à Distância**.
· *Krichama*: Ofício(Ferraria), **Ae 5 contra Fogo**, conserta e sobe arma nv1→nv2 por descanso longo.
· *Caxon*: Ofício(Engenharia), **Ar 3 Natural**, não pode ser movido contra a vontade (salvo Fort CD 20),
  em cavernas +1,5 m e **+1 em todas as perícias**.

**Autômato** — imune a biológicos, **vulnerável 2× a Elemental**, come sucata, poções não funcionam.

**Corrompido** — sente magia em 9 m · **conjura 2 magias nv1 sem foco** (Vontade CD 12, 1d4 mental na falha) ·
Sussurros 1×/descanso curto · **−2 em interação social** (exceto Intimidação).

**Dryad** — **Ar 2 Natural** · **recupera 1d4 de Saúde por turno em combate sob o sol** ·
*Amado* (1 ação, 9 m, Vontade vs sua CD ou **Enfeitiçado**).
· *Florescura*: Treinado em Místico, ilusão menor sem foco, **1 magia nv1 sem foco**.
· *Cascaferro*: Treinado em Movimento e **Armas Marciais**, **+1 Ar e +1 Evasão**.

**Gruto** — visão no escuro perfeita · vantagem em Movimento/Crime/Intimidação/Sobrevivência contra
Dryads e criaturas predáveis · **imune a Envenenamento** · +1d6 de Saúde em descansos longos.
· *Rokhan*: **+10 Saúde máxima**, Ar 1, Treinado Fortitude/Intimidação.
· *Skal'ri*: **+5 Éter máximo**, +1,5 m, Treinado Vontade/Enganação.

**Humano** — *Persistência Humana*: ao **falhar em qualquer teste**, role 1d4 e some.
**Usos: 1 + Mod.SAB por descanso longo.** (O traço racial mais genérico e mais flexível do sistema.)
· Simples: Sobrevivência, **+1 de comodidade de descanso** · Estudioso: Conhecimento, +1 idioma, Hipótese ·
Rebelde: Movimento/Intimidação, 1×/descanso longo +1d4 em ataque falho · Popular: 1 social, 1×/descanso longo vantagem social.

**Inseto** — escala paredes com todos os membros · comunica-se com insetos · **−2 social** (exceto Intimidação).
· *Besouro* (+2 CON −1 INT, 7,5 m, Fortitude/Defender): **Ar 2**, escolhe um dano atípico e ganha
  **Ar(3)** contra ele (trocável em descanso curto), **manobras +2 Movimento**.
· *Louva-a-Deus* (+2 SAB −1 CON, 9 m, Vontade/Iniciativa): visão perfeita no escuro, voa 1,5 m/rodada,
  🔑 **garra 1×/combate, 1d6+DES perfurante, NUNCA sofre PMA**.
· *Barata* (+2 DES −1 SAB, 10,5 m, Furtividade/Crime): **a 0 de vida recupera 1** (1×/descanso longo),
  **+1d4 de vida por rodada enquanto escondido**, **esconde-se com 2 ações em vez de 3**,
  imune a Envenenamento.

## Padrões de referência úteis
- **+1 Evasão** aparece como Incomum (tech) e como metade de um pacote de variante racial (Cascaferro).
- **Ar natural** varia 1 (Rokhan) → 2 (Dryad, Besouro) → 3 (Caxon). **Ar 3 é o teto racial.**
- **Ae 5 contra um tipo** (Krichama/Fogo) é o teto de resistência específica racial.
- **"A 0 de vida fica com 1"** aparece em Exótico (Núcleo-Duplo, quebra) e em raça (Barata,
  1×/descanso longo). É um efeito de raridade **Exótica** quando vendido.
- **Anular PMA** existe como traço racial, mas travado em **1×/combate e 1d6** (Louva-a-Deus).
