# O Limiar — 170 cartas (`data/limiar.json`)
Catálogo 129 = Universais 10 + FOR/DES/CON/INT/SAB 12 cada (60) + **Raras 59**.
Abismo = 18 Dores + 23 Benefícios. Confere com o CLAUDE.md §9.

**Orçamento: +4 pontos por nível, do 2 ao 5 → 16 pontos na campanha inteira.**
🔴 O custo em pontos de cada carta **não está no repo** (nenhum campo `custo` preenchido).
Necessário buscar no Notion antes de qualquer cálculo fino de troca item↔carta.
🔴 **As 59 cartas raras estão no repo apenas como nome + requisito, sem efeito** — decisão de
design existente do site. Para avaliar interação item↔carta rara é preciso ler o Notion.

## 🔑 ÂNCORAS DE PREÇO — o que 1 carta do Limiar entrega
Esta é a comparação mais direta que existe para julgar um item do Bazar: as duas são "eixos de
progressão opcional". Se um item entrega mais que uma carta, ele está caro demais em poder.

### Universais (sem requisito de atributo) — a linha-base
| Carta | Efeito |
|---|---|
| Reservas Profundas | **+10 Stamina máxima permanente** |
| Poço Arcano | **+10 Éter máximo permanente** |
| Sangue Espesso | **+2d10+5 Saúde máxima permanente** (≈ +16) |
| Pernas Incansáveis | **+3 m de movimento permanente** (+1,5 m no Acelerar) |
| Marca do Guerreiro | +1 nível de treinamento em **Atacar** (= +2) |
| Postura de Ferro | +1 nível em **Defender** (sobe o dado) |
| Olhos de Águia / Reflexos Aguçados | **+2 níveis** (= +4) em Percepção / Iniciativa |
| Alma Resiliente | +1 nível em Fortitude, Vontade **e** Reflexos |
| Treinamento Focado | +1 nível em **2 perícias à escolha** |

→ **Linha-base de uma carta universal: +10 de um recurso, ou +3 m, ou +2 em uma perícia-chave.**
Compare com a régua de raridade do Autômato: **+1 Evasão / +3 m = Incomum.** Coerente.

### Cartas de atributo (requisito 16+) — mais fortes
As que mais importam para julgar itens:
| Carta | Efeito | Por que importa ao Bazar |
|---|---|---|
| **Carne de Pedra** (CON) | **Reduz todo dano recebido em 5** (mín. 1) | Teto de mitigação plana. Um item com **Ar 5** iguala uma carta travada em CON 16+. |
| **Escamas Reativas** (CON) | **10 de Ae** ao último tipo atípico recebido | Teto de resistência específica. |
| **Músculos de Ogro** (FOR) | **+5 de dano permanente** corpo a corpo | Teto de dano plano. |
| **Lâmina Fantasma** (DES) | **Crítico em 19–20** (e +1 se já ampliado) | Único ampliador de margem sem condição — e é carta travada em DES 16+. |
| **Paciência** (DES) | Após atacar, **+2 Atacar pelo resto da rodada, cumulativo até +6** | **Contra-PMA parcial.** No 3º ataque a PMA −10 vira −6. |
| **Terceiro Olho** (DES) | 2 acertos à distância no mesmo alvo → **outro ataque como ação livre** | Ação extra condicional, e é carta de atributo. |
| **Mente Tática** (INT) | **Pague 5 Stamina → +1 nível de treinamento na perícia. Cumulativo.** | 🔑 **Preço canônico de proficiência: 5 Stamina = +2.** |
| **Estudo Intenso** (INT) | **+2 no CD de classe** + 1 nível numa perícia | Teto de CD. |
| **Bestiário** (INT) | Contra criatura conhecida: ignora 3 de Armadura, +1d6 de dano e **+2 Atacar para todos os aliados em 18 m** | Buff de party de carta de atributo. |
| **Felizardo** (INT) | **+10% de Sins de todas as fontes** + 10 em d100 de saque | Mesma magnitude do Mercador. **Teto de modificador econômico = 10%.** |
| **Olhos do Oráculo** (SAB) | **Não pode ser Desprevenido** + 2 níveis em Percepção + vê invisíveis | Imunidade a condição Classe S. |
| **Santuário Espiritual** (SAB) | Aliados em 9 m: **+3 em todos os testes de resistência**, imunes a Amedrontado/Enfeitiçado | Buff de party permanente. |
| **Mãos Abençoadas** (SAB) | 1 ação, Medicina CD 12: cura **3d6+SAB**, até 3 aliados por descanso longo | Cura fora do Alquimista. |
| **Coração Imortal** (CON) | **1×/campanha**: a 0 de Saúde, volta com 50% da máxima | Note a trava: **1×/campanha**, não por dia. |
| **Pulmões Titânicos** (CON) | +3d12+8 Saúde máxima (≈ +27) | Teto de Saúde permanente. |

### Raras (59) — requisitos de 16 a 24+ em atributos
Ex.: *Colossus Primordial* FOR 22+ · *Velocista Umbral* DES 24+ · *Organismo Mutagênico* CON 22+ ·
*Assassino Fantasma* / *Lâminas Dançantes* DES 22+ INT 16+ · *O Mestre* INT 20+ SAB 20+ ·
*Duas Mangas* INT 22+ DES 16+ (**Teurgo apenas**).
Como atributos começam em 8–18, requisitos de 20+ exigem crescimento — são cartas de fim de campanha.
**Regra do CLAUDE.md §9: cartas raras usam apenas recursos universais** (Stamina, Éter, HP, Reações,
Ações, CD de classe), nunca recursos travados por classe como FLUXO. **A mesma regra vale para itens.**

## 🔑 Intenção de design (D8 — Pedro)
"As cartas raras, principalmente as de requisitos mais específicos e difíceis, são muito fortes.
**Mas esse é o design, poder absurdo.**"
→ **Carta rara forte não é bug.** É o teto legítimo do sistema. O que permanece verdadeiro é que
um **item comprável e acumulável** não deve igualar uma carta travada atrás de atributo 16–24+,
porque o item não paga o mesmo gate. Compare sempre *com o gate*, não só com o efeito.
Todas as cartas e seus custos em pontos **estão no Notion**.

## Como usar o Limiar ao julgar um item
1. **Um item não deveria superar uma carta universal sem custo.** Carta universal é um dos 16 pontos
   da campanha inteira; um item é comprável e acumulável.
2. **Se o item iguala uma carta de atributo (req 16+), ele deve ser Exótico ou Luxária** e, de
   preferência, carregar requisito ou custo próprio.
3. **Cuidado com empilhamento.** Nada impede um jogador de ter *Carne de Pedra* (−5 dano),
   Ar de armadura pesada, Ar natural racial (até 3) e um item de Ar. **Mitigação plana empilha
   multiplicativamente contra dano baixo** e é o caminho mais rápido para um PJ invulnerável a
   criaturas de CR baixo. É o eixo que mais precisa de teto no Bazar.
