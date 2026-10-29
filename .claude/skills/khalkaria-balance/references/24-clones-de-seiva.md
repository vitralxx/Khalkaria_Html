# Clones de Seiva: modelo de chefe CR 4 (2026-10-29, D162)

**Pedido do Pedro:** na campanha 1, Malkhor replica os 5 integrantes da equipe desfloreio como **clones de seiva**,
e os PCs precisam derrotar cada um. Cada clone é um **chefe CR 4**. O Vorn Drekar é o primeiro e serve de molde.

**Status:**
- Mecânica: proposta do agente de balanceamento, a confirmar com o Pedro.
- Lore novo (aparência, falas, "eco"): **rascunho**.

**Fontes do lore (Notion):**
- *Malkhor*, o Deus do Pecado: a Grande Árvore é sua única criação em Kharavel.
- *Hadran Vorgil*, gancho 1: *"boss clone de Vorn Drekar em alguma região"*.
- *Substâncias da Grande Árvore*: a seiva regenera ferimentos; a palidez é a "assinatura visual de toda corrupção
  por substâncias de Malkhor".
- O *Sinikko clone* já existe no canon.

## 1. Régua dos PCs de nível 4 (com fonte)
| Número | Valor | Fonte |
|---|---|---|
| Saúde = 10 + X×Nv + Mod.CON×Nv | nível 4 com CON +2: Brutalista 50, Espadachim 42, Monge 38, Alquimista/Artilheiro/Batedor 34, Teurgo 30 (**média 37**) | `05-classes.md` (orçamento de 15 pontos) |
| Saúde extra do Limiar | +16 (Sangue Espesso) a +27 (Pulmões Titânicos) por carta; 12 pontos de Limiar até o nível 4 | `07-limiar.md` |
| Evasão Passiva | **10 + Mod.DES** em todas as classes, ou seja, **12 a 14**. Armadura não dá Evasão (D66) | Notion Sistema > Defesa; `ficha-digital-regras.json` (D20) |
| Evasão Ativa | Passiva + dado de Defender: Treinado 1d8, Experiente 1d10 | `01-nucleo-sistema.md` |
| Atacar | Mod +4 + Experiente +4 + arma +1 = **+9**; o Pedro diz +10 ou mais ("muito fortes") | regra de perícia + Nível de Armas do Notion (+N ao atacar) |
| DPR do grupo de 5 contra Evasão 12 e Ar 4 | **60 a 90 por rodada**: tanque ~18, duelista ~18, atirador ~14, conjurador ~12, alquimista ~12 | **Estimativa** pelo modelo de DPR do agente; não há fichas dos PCs da campanha 1 |

## 2. A receita: membro da equipe desfloreio → clone CR 4
1. **Herda da ficha da Sessão 0:**
   - os atributos (capados em 22);
   - **a arma assinatura**, com o nível de arma pela regra atual (+N dados e +N Atacar);
   - **2 ou 3 técnicas que definem a pessoa**: as que mudam a luta, não os números passivos.
   - **Não herda cartas raras do Limiar nem itens.** Elas multiplicam e quebram o chefe; o Colossus Primordial do
     Vorn daria +4d6, ignorar toda a Armadura e +10 de Ar.
2. **Atualiza para a regra atual:** a ficha da Sessão 0 está velha. Vale o Notion de hoje (classe, arma, Evasão).
3. **A seiva acrescenta (traço comum, `Corpo de Seiva`):**
   - regenera 10 de Saúde por turno;
   - imune a Envenenado e Amedrontado;
   - Éter 0 (sem alma);
   - aparência pálida com veios dourados.
4. **A fraqueza comum: Fogo.**
   - É vulnerável (dobro de dano).
   - O Fogo suprime a regeneração até o fim do próximo turno do clone.
   - Um crítico de Fogo também tira 1 ação.
   - Tem precedente nas criaturas de Malkhor do Bestiário (Dragão de Raízes, Orc da Floresta).
   - Dá ao grupo um objetivo de preparo: comprar munição de fogo, bombas, magia de fogo.
5. **Esqueleto de chefe:**
   - 1 turno por rodada, 3 ações, 1 reação (regra do Sistema, sem turno extra);
   - **Colosso de Seiva:** efeitos que tiram ações tiram no máximo 1 por turno, para o chefe não ser travado por
     Atordoado;
   - **regra de alvo legível** (para o Vorn, Ódio Cego): dá ao grupo a janela de proteger os frágeis.
6. **Três fases:**
   - Fase 1, a pessoa (100% a 51%);
   - Fase 2, o pecado (50% ou menos): mais dano, com a contrapartida de perder defesa e regeneração;
   - Fase 3, o último fôlego (1×, a 0): o grupo tem uma rodada para terminar.
7. **Toda vantagem forte traz a contrapartida escrita** (gramática do sistema).

## 3. Orçamentos do clone CR 4
| Item | Orçamento | Porquê |
|---|---|---|
| Saúde | **220 a 260** (Vorn: 240) | 60 a 90 de DPR do grupo dão 3 a 4 rodadas, contando a regeneração da fase 1 e a fase 2 sem Ar |
| Evasão | 12 a 13 | O grupo acerta ~90%; o chefe tem de ser atingido para a luta andar |
| Ar | 3 a 4, e cai a 0 na fase 2 | Ar alto anula grupos de muitos ataques: cada ponto custa ~8 de dano por rodada |
| Atacar | +12 (Pedro: no mínimo +10) | 95% contra a Passiva; 68% a 82% contra a Ativa |
| Golpe principal | média ~32, crítico ~58 | Assusta. Derruba um PC de Saúde ≤ 30 (ver §4.2), por isso a regra de alvo é obrigatória |
| Contragolpe | média ~22 | Pune arma leve sem derrubar sozinho um PC de Saúde 34 ou mais |
| Dano do chefe por rodada | ~45 a 60 | Contra ~200 de Saúde do grupo: **risco de TPK real (CR 4)**, mas não em menos de 3 rodadas |
| CD das técnicas | 15 | CD padrão do Sistema; o Bestiário usa 14 (CR 3) e 16 (CR 8) |
| Stamina | ~40 | ~8 técnicas de 3 Stamina e um Ignorar Dor |

## 4. Exemplo resolvido: Vorn Drekar, Clone de Seiva
JSON em `../bestiario/vorn-clone-de-seiva.json`, validado contra o import do Bestiário v10 (`23-bestiario-v10.md`).

**Ficha:**
- Grande, Corrompido. FOR 22, DES 14, CON 20.
- Saúde 240, Evasão 12, Ar 4, Stamina 40.
- Atacar Experiente (+4) + FOR (+6) + arma (+2) = **+12**.
- **Manoplas de Ferro +2** (Pesada Brutal): 2d12 + 2 dados = **4d12+6**, Atacar(3), Executar; Bruto ignora 2 de Ar.

**O que foi herdado da ficha da Sessão 0, e o que ficou de fora:**

| Herdado | Como entra no clone |
|---|---|
| Manoplas | a arma, pela regra atual |
| Investida | o golpe em área e a resposta a quem atira de longe |
| Gancho | arma o contragolpe com Atordoado |
| Retaliação Selvagem | o contragolpe |
| Fúria Sanguinária | +3 de dano na fase 2 |
| Frenesi | a fase 2 |
| Ignorar Dor | a fase 3 |
| Bruto, Casca Grossa (Ar 4) | passivas |
| Inabalável e Veterano | dentro do Colosso de Seiva |
| Contador de Corpos | só narrativa |

- **Ficaram de fora:** Músculos de Ogro (+5 de dano), Berserker Imortal (dano dobrado a 25%), Colossus Primordial,
  Vício em Sangue e Contador de Corpos (+5 Atacar). Cada um empurrava a luta para o rocket tag.
- Destruir também ficou de fora, para simplificar a mesa.

### 4.1 Acerto (Atacar +12; fase 2 +14)
| Evasão do PC | Passiva | Defender Treinado (1d8) | Defender Experiente (1d10) |
|---|---|---|---|
| 12 | 95% | 82% (fase 2: 89%) | 77% (fase 2: 84%) |
| 13 | 95% | 78% (fase 2: 86%) | 72% (fase 2: 81%) |
| 14 | 95% | 72% (fase 2: 82%) | 68% (fase 2: 77%) |

### 4.2 Chance de derrubar um PC de Saúde cheia com 1 golpe (Evasão 13, Passiva)
| Saúde do PC (Ar) | Derruba | Só no crítico | Com Executar |
|---|---|---|---|
| 26 (0) | 79% | 5% | 91% |
| 30 (1) | 62% | 5% | 84% |
| 34 (1) | 43% | 5% | 71% |
| 42 (2) | 13% | 5% | 37% |
| 54 (4) | 3% | 3% | 6% |

**Leitura:**
- Contra o tanque, ou contra quem fica com Saúde 42 ou mais, o golpe assusta mas não mata.
- Contra conjuradores de Saúde ≤ 34 é letal. É isso que o **Ódio Cego** controla: no 1º turno o clone ataca o mais
  próximo, e depois quem mais o feriu. O grupo decide quem leva o golpe.
- Se os frágeis do grupo do Pedro tiverem Saúde ≤ 30 e jogarem colados no chefe, tire o Executar da fase 1.

### 4.3 Retaliação
- Na disputa, o contragolpe (+14) vence um PC de +9 em 70% das vezes, um de +10 em 66% e um de +11 em 62%. Na fase 2
  (+16), vence 77%, 74% e 70%.
- O dano proposto é 2d12+6+1d6, média 22,5. Ele derruba um PC de Saúde 26 em 29% das vezes e um de Saúde 34 em 1%.
- **O canônico** (as manoplas inteiras, 4d12+6+1d6) teria média 35,5 e derrubaria um PC de Saúde 34 em 61% das
  vezes. É por isso que o contragolpe sai reduzido.
- **Uma arma leve que ataca 3 vezes** abre 3 disputas: em média ~44 de dano, se o PC insistir.
  - É o preço de arma leve contra um alvo que sobrevive. O PC vê cada contragolpe antes do ataque seguinte e pode
    parar.
  - **As ferramentas do grupo:** atacar à distância (sem retaliação); Alcançar (o próximo ataque não é retaliado);
    deixar o alvo Caído ou Desprevenido; ou atacar depois que o tanque consumiu a reação dele na rodada.

### 4.4 Investida
- 4d6+6, média 20, em todos os alvos da linha, com Fortitude CD 15. A chance de falhar é 60% com Fortitude +2 e 40%
  com +6.
- Ela deixa os alvos Caídos e armam o Gancho (1 ação restante).

### 4.5 Duração (Saúde 240)
| DPR do grupo | Fase 1 (regenera 10) | Fase 2 (sem Ar, sem regeneração) | Total |
|---|---|---|---|
| 60 | 2,4 rodadas | 1,3 | **~4,0 rodadas** |
| 75 | 1,8 rodadas | 1,1 | **~3,3 rodadas** |
| 90 | 1,5 rodadas | 1,0 | **~2,8 rodadas** |

A fase 3 (Ignorar Dor) acrescenta ~0,3 de rodada. Se o grupo terminar em menos de 3 rodadas, suba a Saúde para
280.

### 4.6 Dano do clone por rodada (Evasão 13, Passiva)
- O golpe principal sozinho rende ~31,7 por rodada.
- Com o contragolpe:

  | Disputas de retaliação | Dano por rodada |
  |---|---|
  | 1 | ~46,6 |
  | 2 | ~61,4 |
  | 3 | ~76,2 |

- Em 3 a 4 rodadas, isso dá ~140 a 200 contra ~200 de Saúde do grupo. **CR 4 = risco de TPK** (CLAUDE.md §2), como
  pede a escala do Pedro.
- A regra de alvo e a Retaliação, que o grupo controla, são o que separa a vitória do TPK.

As contas foram feitas por script, com distribuição exata dos dados (não por amostragem). O código está no
scratchpad da sessão, `vorn_contas.py`, e é fácil de refazer.

## 5. Checklist para os próximos clones (os outros 4 da equipe desfloreio)
Os nomes estão em *Sessão 0 / Os 5 escolhidos* no Notion. O **Sinikko clone** já existe no canon como líder do Culto
(NPC vivo). Se ele é o mesmo clone de seiva desta série, é pendência para o Pedro.

- [ ] Ficha da Sessão 0 lida no Notion; regras atuais conferidas (classe, arma, magia).
- [ ] Arma pela regra atual (+N dados e +N Atacar). No Bestiário, `level: "0"` com os dados somados (§4 do `23`).
- [ ] No máximo 3 técnicas herdadas, cada uma com papel na luta. Nenhuma carta rara, nenhum item.
- [ ] O traço `Corpo de Seiva` e a fraqueza a Fogo, iguais em todos.
- [ ] O `Colosso de Seiva` (anti-trava de ação) e uma regra de alvo legível.
- [ ] Três fases, com contrapartida escrita na fase 2.
- [ ] Saúde de 220 a 260, Evasão 12 a 13, Ar de 3 a 4 (0 na fase 2), Atacar ≥ +10.
- [ ] Golpe principal: média ≤ ~32. Conferir a chance de derrubar PCs de Saúde 30, 34 e 42.
- [ ] Contragolpe: média ≤ ~23.
- [ ] Duração de 3 a 4 rodadas contra DPR de 60 a 90.
- [ ] O JSON validado contra o import (0 chaves ignoradas).
- [ ] Todo texto narrativo novo marcado **[RASCUNHO — aprovar]**.
- [ ] Conjurador (Sinikko, Teurgo): em vez do golpe único, a magia de maior nível do clone. Os mesmos orçamentos de
  dano (área ≤ ~20 por alvo), com Éter 0 trocado por "a seiva paga o Éter" e a contrapartida de Saúde por conjuração.
  **Proposta, a decidir quando chegar a vez dele.**
