# Classes (7) — `data/classes/*.json` + `pages/classes/*.html` (sync do Notion)
259 habilidades varridas: 105 técnicas gerais, 90 de ramo/tier, 42 marcas, 22 ultimates.

## Orçamento fechado de 15 pontos — confirmado
| Classe | Saúde/nv | Stamina/nv | Éter/nv | Soma | Evasão base | Saúde+Evasão |
|---|---|---|---|---|---|---|
| Brutalista | 8 | 4 | 3 | 15 | 10 | 18 |
| Espadachim | 6 | 6 | 3 | 15 | 10 | 16 |
| Monge | 5 | 5 | 5 | 15 | **15** | **20** 🚩 |
| Alquimista | 4 | 6 | 5 | 15 | 12 | 16 |
| Artilheiro | 4 | 7 | 4 | 15 | 11 | 15 |
| Batedor | 4 | 7 | 4 | 15 | 12 | 16 |
| Teurgo | 3 | 3 | 9 | 15 | 10 | 13 |

`Saúde = 10 + (X×Nv) + (Mod.CON×Nv)` · `Stamina = 8 + (Y×Nv) + (Mod.FOR|DES×Nv)` ·
`Éter = 6 + (Z×Nv) + (Mod.INT|SAB×Nv)`. **Monge é outlier em defesa (+4 acima do tanque).**

## Treinamento inicial — quem pode usar o quê (trava de arma do Bazar)
| Classe | Categoria de arma | Perícias iniciais | Recurso próprio |
|---|---|---|---|
| Espadachim | **Marciais** | Atacar, Defender | Marca do Duelo |
| Monge | **Marciais** | Movimento, Vontade | **Fluxo** |
| Batedor | **À Distância** | Sobrevivência, Percepção | — |
| Artilheiro | **À Distância** | Atacar, Percepção | **Concentração** |
| Teurgo | **Místicas** | Místico, Conhecimento | Éter |
| Brutalista | **nenhuma** | Fortitude, Atacar | — |
| Alquimista | **nenhuma** | Ofício(Alquimia), Conhecimento | **Reagentes** |
Todas escolhem +(1 + Mod.INT) perícias de uma lista.

🔑 **Brutalista e Alquimista não recebem categoria de arma** → dependem de Leves/Pesadas
(que só exigem atributo). Um item do Bazar que conceda "Treinado em Armas Marciais/À Distância"
vale desproporcionalmente para esses dois e é redundante para quem já tem.
Outras fontes de acesso: **Acólito** e **Dryad Cascaferro** → Marciais; **Andarilho** → À Distância;
**Anão** → Marciais **E** À Distância.
Ofícios canônicos: Ferraria, Engenharia, Alquimia, **Municiador** (Artilheiro).

## 🔑 RÉGUA DE PREÇO — o que o sistema cobra por cada efeito
Esta é a tabela mais importante para julgar item do Bazar. Todos os valores são canônicos.

### Anular PMA — o efeito mais forte do sistema
| Fonte | Custo | Entrega |
|---|---|---|
| Espadachim *Oportunista* | **5 Stamina**, ação livre | PMA vira −3 na rodada |
| Artilheiro *Tiro Duplo* | 1 Ação + 3 Stamina + 2 Conc. | **1 ataque** sem PMA |
| Artilheiro *Rajada de Tiros* | 1 Ação + 3 Stamina | **2 ataques** sem PMA, até 2 alvos |
| Artilheiro *Vendaval de Aço* | **2 Ações + 5 Stamina** | **3 ataques** sem PMA |
| Monge *Golpe Sequencial* | Ação livre + 5 Stamina + 1 Fluxo | 1 ataque desarmado extra sem PMA |
| Inseto Louva-a-Deus | racial, **1×/combate** | 1 ataque 1d6 sem PMA |

→ **Preço canônico de anular PMA por um turno: 5 Stamina + 2 ações, ou 5 Stamina como ação livre
para apenas suavizar para −3.** Nenhuma fonte anula PMA de graça e permanentemente.

### 🔴 "+1 Ação" — praticamente não existe
Só 3 fontes em 259 habilidades, todas com trava severa:
- Espadachim *Adrenalina Sanguínea* — passiva, **só ao matar a Marca do Duelo**
- Monge *Transcendência* — **ULTIMATE**, 3 Ações + 5 Stamina + 5 Fluxo, 1×/dia, 5 rodadas
- Magia: modulação **Acelerar (+5 Éter)** reduz o custo de ação da magia em 1 (não dá ação nova)

→ **Qualquer item do Bazar que conceda ação extra sem trava está acima de tudo que o sistema
oferece.** Trate "+1 Ação" como efeito de raridade Luxária com uso 1×/dia, no mínimo.

### Dano extra — a escada canônica
| Efeito | Custo | Fonte |
|---|---|---|
| +1d6 por 2 Stamina (máx = Nível) | 2 Stamina/dado, ação livre, no acerto | Brutalista *Destruir* |
| +1 dado de dano até o fim do combate | **3 Ações + 3 Stamina + não pode Defender + descontrolado, 1×/descanso longo** | Brutalista *Frenesi* |
| +1d6 por 3 rodadas | 1 ação + **2d4 de retorno** (dobrado por vulnerabilidade) | Autômato *Capacitores*, **Luxária** |
| +2d6 | passivo mas **condicional** (< metade da vida) | Espadachim *Carne Rasgada* |
| +3d6 | 1 Ação + 3 Stamina, **erro → Exposto** | Espadachim *Golpe Torto* |
| +3d6 por 3 rodadas | **ULTIMATE** 1 Ação + 5 Stamina, **pré-req < 25% HP**, 1×/dia | Brutalista *Despertar A Besta* |
| +4d6 | ação livre, **erro → 2d6 Primordial + Exposto** | Espadachim *Dobrar a Aposta* |

→ **Taxa canônica: ~2 Stamina por 1d6.** E **"+1 dado de dano da arma" permanente é mais caro que
uma técnica 1×/descanso longo que consome o turno inteiro** (Frenesi). Item que dê +1 dado de arma
de forma permanente e sem custo está fora da régua — lembrando que **armas com mais dados base
escalam pior**, então o mesmo "+1 dado" vale muito mais numa arma 1d6 do que numa 2d12.

### Defesa
| Efeito | Custo | Fonte |
|---|---|---|
| +2 Ar Natural | **1 Ação + 3 Stamina + não pode se mover + −2 Atacar** | Brutalista *Postura Defensiva* |
| +2 Ar Natural | passivo, **só abaixo de metade da vida** | Brutalista *Imortal* (marca) |
| +2 Evasão **e** +2 Atacar | 1 Ação + item Álcool + condição **Bêbado** (2 nat = falha crítica, −2 em 6 perícias) | Espadachim *Beber até Cair* |
| Reduzir 1d4 de dano | **1 Éter** (máx. Éter gasto = Nível) | Teurgo *Barreira Instintiva* |
| +1 Evasão | — | **Incomum** (tech Autômato) |
| Ar 3 natural | — | teto racial (Anão Caxon) |

→ **1 Éter ≈ 2,5 de dano prevenido. 2 Stamina ≈ 3,5 de dano causado.**

### Conversões e economia de recurso
- **2 Saúde = 1 Stamina** (Espadachim *Sangue por Aço*, ação livre) — taxa canônica de conversão.
- **−1 Éter no custo de uma magia = 2 Stamina** (Teurgo *Canalização Eficiente*, ação livre).
- Cura de emergência 1×/descanso longo a ≤25% HP: **2d8+Mod.CON Saúde + 1d8+Mod.FOR Stamina**
  (Brutalista *Hoje Não*).

### Margem de crítico — rara e sempre condicional
Só *Precisão Letal* (Monge, 19–20, **apenas desarmado**) e *Sorte do Bêbado* (Espadachim, +1 em
tudo, mas **só Bêbado e com desvantagem em todos os testes de resistência**).
→ Item que amplie margem de crítico sem condição é um **multiplicador de rocket tag**; trate como
o efeito mais perigoso que um item pode ter, porque interage com o crítico "dobro de dados".

### Ultimates — formato canônico
**1 Ação (ou 2–3) + 5 Stamina + 1×/dia**, e vários trazem "⚠️ O Custo" explícito
(perder 2d10 de Éter, receber o dano acumulado depois). Party-wide +3 em Atacar/Defender por 1
minuto é *Campo de Batalha*, um ULTIMATE de 3 ações. **Buff de +3 para a party inteira = topo
absoluto da escala.**

## Padrões estruturais que a régua precisa respeitar
1. **Escalonamento de proficiência é o idioma padrão**: "Você se torna Treinado em X (se já for,
   Experiente, e assim por diante)". Aparece em técnicas de tier de várias classes.
2. **Retaliação é um eixo de classe inteiro** (Espadachim): *Guardar a Lâmina*, *Inimigo Mortal*
   (retalia 2× sem gastar reação), *Parry Perfeito*, *Contra-guarda* (retaliação crítica),
   *Duelista Intocável* (ignora todo Ar ao retaliar). **Itens que mexam em retaliação pisam no
   território exclusivo do Espadachim.**
3. **Negar a reação do alvo é poder de classe** (*Quebrar Postura*). Item que faça isso remove
   retaliação e defesa ativa de uma vez — dois eixos por um preço.
4. **Todo buff forte tem contrapartida escrita.** Frenesi não defende. Golpe Torto expõe.
   Beber até Cair embriaga. Despertar A Besta exige estar quase morto.
   **Item forte sem contrapartida é a assinatura de um item desbalanceado neste sistema.**
5. **Recursos de classe (Fluxo, Concentração, Reagentes) são fechados.** Item que gere recurso de
   classe alheio quebra a identidade da classe — a nota do CLAUDE.md sobre cartas raras
   ("apenas recursos universais, nunca FLUXO") vale igual para itens do Bazar.
