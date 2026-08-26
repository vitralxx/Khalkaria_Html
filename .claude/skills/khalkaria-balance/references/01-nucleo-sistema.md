# Núcleo do Sistema — extraído do Notion `2b76e3a4…` (Sistema Khalkaria)

Fonte: Notion, fetch 2026-08-26. Tudo aqui é **canônico**. Onde diverge do briefing do Pedro ou
do CLAUDE.md, está marcado 🔴 e listado em `08-divergencias.md`.

## Atributos e perícias
- FOR, DES, CON, INT, SAB — faixa 8–18. Mod = (attr − 10)/2. Sem Carisma.
- Criação: 4d6 drop lowest, 5 vezes; pode mover 1 ponto entre atributos. Ordem: raça → classe → origem.
- Proficiência: **+0 Leigo → +2 Treinado → +4 Experiente → +6 Mestre → +8 Lendário**.
- 🔑 **Stacking de proficiência:** "ao possuir duas habilidades que te fornecem 'Treinado em Atacar'
  você se torna Experiente nesta." Nenhuma fonte concede um degrau nomeado acima de Treinado —
  elas empilham. **Consequência para o Bazar: um item que dá "Treinado em X" vale +2 para quem é
  Leigo e +2 adicionais para quem já é Treinado (vira Experiente). Não é um efeito de valor fixo.**

### Atributo de cada perícia (22)
Atacar FOR|DES · Defender (dado, ver abaixo) · Movimento FOR|DES · Fortitude CON · Vontade SAB ·
Reflexos DES · Percepção SAB · Sobrevivência SAB · Furtividade DES · Crime DES · Iniciativa DES ·
Conhecimento INT · Medicina INT · Investigação INT · Religião SAB · Místico INT ·
Convencimento DES|INT · Intimidação CON|FOR · Intuição SAB · Enganação DES|INT · Motivar SAB ·
Ofício(X) = 1d20+X (não pode ser usado sem treinar).

### 🔴 Defender é a exceção — escala por DADO, não por modificador
| Leigo | Treinado | Experiente | Mestre | Lendário |
|---|---|---|---|---|
| 1d6 | 1d8 | 1d10 | 1d12 | 2d8 |

Resolve a contradição A.9#1 da Régua: **não existe "1d10 + Mod.Destreza" fixo**. A Evasão Ativa é
`Evasão passiva + dado de Defender` (o `pages/sistema.html` do repo está desatualizado).

## Economia de turno
3 ações + 1 reação. Mover 1 ação (máx. 1×/turno) · Pular 2 ações (1/3 do Movimento) ·
Acelerar 1 ação (+3 m) · Atacar (custo da arma) · **Defender 1 ação → +2 Defender até o próximo turno** ·
Conjurar 1–3 ações · Técnica 1–3 ações.

**PMA:** "ataques consecutivos somam −5 a cada ataque no mesmo turno."

## 🔑 Retaliação — texto canônico
Ao atacar, se o alvo **ainda tiver reação**, ele escolhe rolar **Atacar** ou **Defender**:

- **Atacar (retaliar):** se o alvo ultrapassar o seu valor, ele te ataca com a arma que empunha
  **e também recebe o seu dano**. Crítico do alvo → nega seu dano e ainda retalia.
  Falha crítica do alvo → seu ataque contra ele é crítico.
- **Defender:** soma o dado de Defender à evasão contra **todos os ataques do agressor nesta rodada**.
- **Empate: o atacante ganha.**
- 🔑 "Enquanto estiver sendo alvo dos seus ataques durante o seu turno, a criatura pode escolher
  reagir a **cada um deles**. Ao final do seu turno, ela considera a reação gasta."
  → **Confirma: 3 ataques abrem até 3 retaliações.** A reação só é consumida no fim do turno.
- **Não se pode retaliar à distância.** *Alcançar* impede a retaliação do próximo ataque.

Ataque de oportunidade: sair de 1,5 m de uma criatura permite que ela gaste a reação para atacar.

## Dano e defesa
- Dano = dados da arma + Mod. do atributo da arma. **Crítico (20 nat) = dobro de dados + mod.**
- Corpo a corpo Pesado → FOR (acerto e dano). Leve → DES. À distância → DES.
  **Armas místicas → perícia Místico; dano +Mod. INT ou SAB.**
- **Armadura (Ar):** reduz dano *ordinário* por constante fixa.
- **Armadura Específica (Ae):** reduz dano *atípico* por constante fixa. Formato `Ae(Tipo, N)`.
- **Resistência = metade. Vulnerabilidade = dobro.**

### Tipos de dano (agrupamento canônico do Notion)
| Ordinário | Atípico | Outros |
|---|---|---|
| Cortante, Contundente, Perfurante | Elemental (Fogo; Frio; 🔴Gelo) · Biológico (Veneno; Ácido; Psíquico) · Místico (Radiante; Trovejante; Necrótico) | Força, Primordial |

🔴 O Notion lista "Fogo; Frio; Gelo" — Frio e Gelo são o mesmo. O CLAUDE.md e o site usam
**Elétrico** nesse slot, e a superfície "Molhado" do próprio Notion diz
*"vulnerável a dano Elemental(Eletricidade)"*. Erro de digitação no Notion; o correto é Elétrico.

## Limites de equipamento — travas duras para o Bazar
- **Armadura Pesada: no máximo 1 equipada.** (Equipamento Pesado — dá Ar e habilidades únicas.)
- **Armadura Leve: no máximo 2 equipadas.** (Dá Ae e passivas diversas.)
- **Item Mágico: no máximo 3 sintonizados**, trocáveis a cada descanso longo. Não são fabricáveis.
- **Escudo:** off-hand, combina com qualquer arma; aumenta a perícia Defender ao reagir.
- **Nível de arma: "Você só pode se beneficiar das melhorias de 1 arma equipada."**

## Inventário
- Equipamentos: **2 + Mod.FOR** (mín. 1). Itens **equipados não contam**.
- Bugigangas: **10 + Mod.FOR** (mín. 1).
- 🔴 Munições contam como **1 bugiganga** (o Notion não diz "20 = 1 slot"; o CLAUDE.md diz).
  Regra geral do Notion: "Itens leves contam como 1 bugiganga a cada 10 unidades."
- Sins não pesam. Mochilas aumentam o limite.
- Sobrepeso: acima do máx. mas < dobro → *Sobrepeso Leve*; ≥ dobro → *Sobrepeso Extremo*.

## Armas — tabela canônica
Requisito não atendido → **nega o efeito da arma E dá desvantagem ao atacar**.

| Arma | Dado | Attr | Dano | Efeito | Ações | Req. |
|---|---|---|---|---|---|---|
| **LEVES** | | | | | | DES ≥ 12 |
| Leve Cortante | 1d6 | DES | Cortante | Dilacerar | Atacar(1), Arremessar(1) | — |
| Leve Perfurante | 1d6 | DES | Perfurante | Alcançar | Atacar(1), Arremessar(1) | — |
| Leve Contundente | 1d6 | DES | Contundente | Desorientar | Atacar(1), Arremessar(1) | — |
| Leve Ágil | 1d8 | DES | Cort/Perf/Cont | Executar | Atacar(1) | DES ≥ 14 |
| **PESADAS** | | | | | | FOR ≥ 12 |
| Pesada Cortante | 1d12 | FOR | Cortante | Dilacerar | Atacar(2) | — |
| Pesada Perfurante | 1d12 | FOR | Perfurante | Alcançar | Atacar(2) | — |
| Pesada Contundente | 1d12 | FOR | Contundente | Desorientar | Atacar(2) | — |
| Pesada Brutal | 2d12 | FOR | Cort/Perf/Cont | Executar | Atacar(3) | FOR ≥ 14 |
| **MARCIAIS** | | | | | | Treinado em Armas Marciais |
| Marcial Pesada | 2d10 | FOR | Contundente | Desorientar, 1×/turno sem Stamina | Atacar(2) | — |
| Marcial Longa | 2d10 | FOR | Perfurante | Alcançar, 1×/turno sem Stamina | Atacar(2) | — |
| Marcial Precisa | 1d8 | DES | Cortante | Executar, 1×/turno sem Stamina | Atacar(1) | — |
| Marcial Versátil | 1d8 | DES | Cort/Perf/Cont | Dilacerar, 1×/turno sem Stamina | Atacar(1) | — |
| **À DISTÂNCIA** | | | | | | Treinamento à Distância |
| Distância Simples | 1d6 | DES | Perfurante | Dilacerar | Atacar(1) | — |
| Distância Pesada | 1d12 | DES | Perfurante | Executar | Atacar(2) | — |
| Arremesso | 1d8 | DES | Perfurante | Dilacerar | Atacar(1) | DES ≥ 14 |
| **MÍSTICAS** | | | | | | INT ≥ 12 |
| Foco de Abjuração/Destruição/Conhecimento/Alteração | — | — | — | permite castar a escola | — | — |
| Foco Primordial | — | — | — | permite castar magias Primordiais (**nível 4**) | — | Experiente em Místico |

🔴 O Notion **não tem coluna de Alcance**. Os valores 18 m / 18 m / 9 m do briefing não estão no
Notion — precisam ser confirmados pelo Pedro antes de virar base de cálculo.

### Efeitos de arma (ação livre, gasta Stamina, aplica ao próximo ataque)
| Efeito | Descrição | Stamina |
|---|---|---|
| Dilacerar | próximo ataque aplica Sangramento 1 no acerto | 2 |
| Alcançar | próximo ataque +1,5 m de Alcance e **não pode ser retaliado** | 2 |
| Desorientar | próximo ataque aplica Desorientado no acerto | 2 |
| Executar | próximo ataque tem **+1 dado de dano** | 3 |

### Nível de arma
Armas (+1/+2/+3): **+N dados de dano e +N ao atacar**.
Focos (+1/+2/+3): **+N Místico e +5N Éter máximo**.
Só se beneficia de 1 arma equipada.

### Munição — 🔴 muito mais forte do que parece
"Armas à distância requerem **1 munição para serem usadas pelo combate inteiro**. A munição é
descontada **por combate**." E: "Utilizar uma munição especial no combate concede seu efeito
**durante todo o combate, em cada ataque** da arma à distância."
→ **Munição especial não é consumível por tiro. É um buff de cena por 1 unidade.**
Tipos: Distância Simples → Flecha/Virote · Distância Pesada → Munição de Fogo · Arremesso → Conjunto de Arremesso.

## Tamanho
Miúdo → Pequeno → Médio → Grande → Gigantesco. Testes físicos disputados: ±2 por degrau de diferença
(Médio vs Gigantesco = −4; Gigantesco vs Miúdo = +8).
Ataque natural (Soco): Miúdo Mod.FOR · Pequeno 1d3 · Médio 1d4 · Grande 1d6 · Gigantesco 1d8 (+Mod.FOR).

## Manobras
- **Empurrar** — Movimento × Fortitude → empurra 3 m + 1,5 m por 5 pontos sobrepujantes, alvo fica Caído.
- **Desarmar** — Movimento × Movimento → derruba a arma.
- **Agarrar** — Movimento × Movimento → **Atacar contra o alvo +2, alvo −2 ao Atacar, alvo Enraizado.**

## Economia de Sins e raridade (base de precificação do Bazar)
| Raridade | Sins | Média | CD Fabricação | Nível p/ fabricar |
|---|---|---|---|---|
| Lixo | 1d8+2 | 6,5 | — | — |
| Ordinário | 2d10+10 | 21 | 10 | 1 |
| Incomum | 4d10+45 | 67 | 13 | 2 |
| Exótico | 5d12+180 | 212,5 | 16 | 3 |
| Luxária | 6d20+620 | 683 | 20 | 4 |

Salto entre faixas: ×3,2 → ×3,2 → ×3,2. **A escala de preço é geométrica com razão ~3,2.**
Crafting: descanso longo, 1 item, Ofício(Ferraria) p/ equipamentos e Ofício(Engenharia) p/ itens.
Sucatear devolve **metade** dos ingredientes.

Comerciantes: Sucateiro(compra tudo) · Fornecedor(Materiais) · Artesão(Bugigangas) ·
Ferreiro(Equipamentos) · Boticário(Consumíveis) · Artificer(Itens Mágicos).
Nível 1/2/3 → estoque 100/250/500 Sins, venda a 50%/66%/75%.

## Descanso
- **Longo (1×/dia):** 8 h, recupera **Xd8 de 2 status à escolha**, X = comodidade 1–5
  (Precário→Luxuoso). Exige luz e **alimento por jogador** — quem não come não recupera.
  Ao ar livre: Sobrevivência <15/15-19/20-24/25-29/30+ define a comodidade.
- **Curto (2×/dia):** 30 min, **2d6 de 2 status**, + 1 ação de descanso:
  Tratar Ferimentos (Medicina CD 15, +1d6 Saúde) · Meditar (Vontade CD 15, +1d6 Éter) ·
  Relaxar (+1d6 Stamina) · **Comer Refeição (requer item Comida, +2d6 de qualquer status)**.

## Sobrevivência, sanidade, estresse
- Sem comer 1×/dia → *Desnutrido 1*; cada noite +1; **cada ponto reduz a Saúde máxima em 10**; 0 = morte.
- 1 dia sem descansar é tolerado; o segundo → *Exausto 1*.
- **Fé/Sanidade:** cenas tristes/aterrorizantes/sobrenaturais podem exigir Vontade; falha reduz Éter.
  Ver um aliado morrer: Vontade CD 20 ou **−2d6+3 Éter**.
- **Estresse:** atacar um aliado (mesmo errando) dá +1 estresse aos dois. Descanso curto libera 1;
  longo libera tudo. **Cada ponto liberado custa 1d6 de Stamina e Éter.**

## Progressão (níveis 1–5)
| Nv | Benefícios |
|---|---|
| 1 | 4 Técnicas de Classe, Características de Raça, 1 Habilidade de Origem |
| 2 | 5 Técnicas, Técnicas Tier 1, +4 Pontos do Limiar |
| 3 | 6 Técnicas, 1 Marca de Classe, +4 Pontos do Limiar |
| 4 | 7 Técnicas, Técnicas Tier 2, 2 Marcas, +4 Pontos do Limiar |
| 5 | 8 Técnicas, Técnicas Tier 3, 3 Marcas, +4 Pontos do Limiar |

**Total de Pontos do Limiar do nv1 ao nv5 = 16.** Cinco eixos de poder: Classe, Raça, Origem, Limiar, Bazar.
XP por Dc: 1/4→2 · 1/2→5 · 1→10 · 2→25 · 3→50 · 4→100 · 5→200.
Nível: 2=150 · 3=400 · 4=1000 · 5=2000 XP.

## Magia
Exige: **Treinado em Místico** + ter aprendido a magia + **Foco da escola equipado**.
**Só 1 Foco por vez** — trocar de escola exige reequipar. Acerto usa **Místico**; dano +Mod. INT|SAB.
Custo base: nv1 = 2 · nv2 = 4 · nv3 = 6 · **nv4 = 8 Éter (requer Foco Primordial)**.

### Intensidade
| Tipo | Contida (−2 Éter) | Normal | Forçada (+2) | Transbordante (+4) |
|---|---|---|---|---|
| Dano / Cura | −1 dado | base | +1 dado | +2 dados |
| Buff/Debuff | metade da duração | base | dobro da duração | dobro + 2× intensidade |
| Área | metade | base | +50% raio | dobro do raio |
| Alcance | metade | base | +50% | dobro |
| Conhecimento | vaga | base | detalhada | completa |
| Invocação | criatura fraca | base | criatura forte | forte + duração |
| Teste de Resistência | −2 CD | base | +2 CD | +4 CD |

**Transbordante tem risco:** Vontade CD 15 ou o cast falha e você perde **o dobro** do Éter gasto.

### 🔑 Modulações (ausentes do CLAUDE.md e do briefing — eixo de poder inteiro)
**Destruição:** Fragmentar +3 (+1 alvo, dano pela metade) · Alterar +3 (muda tipo de dano) ·
**Carregar +3 (ignora 2 de Evasão / +2 CD)** · **Marcar +5 (alvo fica *Exposto* ao acertar)**
**Abjuração:** Ancorar +2 (não pode ser Dissipado) · Socializar +4 (+1 alvo) ·
Refletir +3 (ao bloquear, redireciona metade do dano ao agressor) ·
🔴 **Acelerar +5 Éter — "Diminui o custo de ação em 1. 3→2→1→Reação→Ação Livre"**
**Alteração:** Insistir +5 (dobro de duração) · Inversão +2 (inverte o efeito) ·
Contagiar +3 (+1 alvo) · Alcançar +3 (dobra alcance)
**Conhecimento:** Compartilhar +1 · Exigir +2 · Projetar +2 · Gravar +3

🔴 **Acelerar é o maior multiplicador de economia de ação do sistema** e é comprável com Éter,
sem limite de uso declarado. Qualquer item do Bazar que reduza custo de Éter interage com isto.

## Outras subsistemas relevantes a itens
- **Jornada:** hostilidade 0/5/10/15/20; acumular `3+(host/5)` pontos; falha → tabela d100 de perda
  de Saúde/Stamina. Itens que dão bônus em Sobrevivência/Percepção/Motivar atuam aqui.
- **Superfícies:** Terreno Difícil (dobro de movimento) · Escorregadia (Reflexos CD 15 ou Caído) ·
  Em Chamas (Fortitude CD 15 ou Em Chamas) · Grama Alta (vantagem em Furtividade) ·
  Molhado (vulnerável a Elétrico).
- **Furtividade:** esconder-se custa **3 ações**; atacar escondido conta o alvo como *Desprevenido*;
  atacar revela imediatamente.
- **Perseguição:** Movimento CD 15 até 3 sucessos ou 3 fracassos.
- **Khan Sins:** jogo de aposta; mesas Rua/Taverna/Khan com multiplicador ×1,5/×2/×3.
- **Idiomas:** Comum, Skalia, Khazadun, Natural, Abissal, Esquecido.
