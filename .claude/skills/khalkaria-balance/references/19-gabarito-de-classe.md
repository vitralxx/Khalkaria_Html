# 19 — Gabarito de classe: a estrutura de criação de classes

Origem: a **D79**. O rework do Batedor é o protótipo da infraestrutura de classe, e cada decisão dele precisa
virar régua reutilizável. Este gabarito foi tirado das 6 classes que funcionam (páginas do Notion lidas em
2026-09-28) e aplicado no Batedor (`18-batedor-rework.md`).

Serve para Vigário, Vampiro, Necromante e Xamã. Com adaptação, serve também para raças e origens.

**Status: proposta**, junto com a do Batedor. Os números saem de script e dizem de onde vieram; as regras
de texto são decisões já gravadas (D57, D97–D101, D126, L29).

---

## 1. Ordem de trabalho

1. **Papel numa frase**, mais o que nenhuma outra classe faz. O teste de sobreposição (§7) vem **antes** de
   escrever a primeira técnica.
2. **Números de base** (§3): coeficientes, CD, treinamento.
3. **Características de classe** (§4). Se houver recurso, ele passa pela régua R1–R7 (§5) com simulação.
4. **15 técnicas gerais** dentro do orçamento (§6).
5. **3 ramos** (§8): 2 marcas, 3 T1, 2 T2, 1 ultimate cada.
6. **Validação** (§10): nomes, preço, simulação, leitura de exploit, sobreposição.
7. **Proposta ao Pedro**, com a origem de cada texto:
   - [Pedro]: texto do Pedro, sem mudança de regra;
   - [Pedro, ajustado]: texto do Pedro, com mudança de regra;
   - [nova]: criação minha.

   O Notion só entra depois do aceite. Por fim, fetch, diff e log para o agente de HTML.

---

## 2. Esqueleto da página (ordem do Notion)

1. `**Status:**` (🟢 Pronto / em revisão).
2. Colunas: imagem | lore (2–4 frases, na voz do Pedro) + `# Progressão`. A tabela de progressão é igual em
   todas as classes:

   | Level | Conteúdo |
   |---|---|
   | 1 | 4 Técnicas |
   | 2 | 5 Técnicas, Técnica de Ramo(Tier 1) |
   | 3 | 6 Técnicas, 1 Marca |
   | 4 | 7 Técnicas, Técnica de Ramo(Tier 1, 2), 2 Marcas |
   | 5 | 8 Técnicas, Técnica de Ramo(Tier 1, 2 e 3), 3 Marcas |

3. Colunas:
   - `# Status iniciais:` com Saúde, Stamina, Éter, Evasão Ativa (Reação) e Evasão Passiva;
   - `# Treinamento:`;
   - Atributos Recomendados, Play Style, CD.
4. Características de classe, cada uma com cabeçalho próprio (`# Marca do Duelo:`). Cada uma tem um
   parágrafo de fantasia e depois a regra.
5. `# Técnicas:`. Primeiro a frase padrão: *"Toda classe possui técnicas, você pode reatribuí-las
   livremente ao realizar um descanso longo, respeitando o limite de pontos."* e *"Você possui
   3 Técnicas + Nível"*. Depois, a tabela `Técnica | Descrição | Custo | Ação` com 15 linhas.
6. Recurso de classe, se houver. Vem nesta ordem:
   - fantasia;
   - como começa;
   - como <u>ganha</u>;
   - como <u>perde</u>;
   - tabela de gastos `Hab. | Custo | Descrição | Ação`;
   - **Máximo**.
7. `# Ramos:`. Primeiro o texto padrão, verbatim do Pedro, igual nas 7 classes:
   - *"Os ramos são caminhos, características únicas do seu personagem, diferente das técnicas, são
     irreversíveis."*;
   - Marcas de Ramo moldam a PERSONALIDADE;
   - Técnicas de Ramo definem o ESTILO DE AGIR;
   - *"É extremamente aceitável que você misture os 3 ramos."*;
   - "3 Marcas · 6 Técnicas de Ramo: 3 no Tier 1 (nível 2), 2 no Tier 2 (nível 4) e 1 Ultimate no
     Tier 3 (nível 5)".

   Depois, os 3 ramos. Cada um tem cor azul, verde ou vermelha, o formato "Ramo do X (Tema e Tema)" e
   1 parágrafo de lore.
8. `# Marcas de Ramo`: 2 por ramo.
9. `# Técnicas de Ramo`: `### Tier 1` (3 por ramo), `### Tier 2` (2 por ramo) e `### Tier 3` (frase
   padrão e 1 ultimate por ramo).

---

## 3. Números de base

**Coeficientes (orçamento fechado de 15 pontos).** Vitalidade, Vigor e Ressonância entram em
`Saúde = 10 + (V × Nível) + (Mod.CON × Nível)`, `Stamina = 8 + (G × Nível) + (Mod.FOR|DES × Nível)` e
`Éter = 6 + (R × Nível) + (Mod.INT|SAB × Nível)`. São coeficientes, não status (D19).

| Classe | V/G/R | Perfil |
|---|---|---|
| Brutalista | 8/4/3 | tanque |
| Espadachim | 6/6/3 | duelista |
| Monge | 5/5/5 | equilibrado |
| **Batedor (proposta)** | **5/6/4** | tático de campo |
| Alquimista | 4/6/5 | suporte de recurso |
| Artilheiro | 4/7/4 | dano à distância |
| Teurgo | 3/3/9 | conjurador |

**Regra: cada classe tem o seu trio.** Se duas classes dividem o trio, dividem também a curva de
sobrevivência e de recurso, e aí só o papel as separa (foi o erro do Batedor 4/7/4).

As faixas em uso vão de 3 a 8 em Vitalidade, de 3 a 7 em Vigor e de 3 a 9 em Ressonância. Dentro delas
sobram **17 trios livres**; exemplos: 7/4/4, 6/5/4, 6/4/5, 5/7/3, 4/5/6, 3/6/6 e 3/4/8.

**CD** = 10 + dois modificadores de atributo, os que a classe usa.

| CD | Classes |
|---|---|
| FOR + CON | Brutalista |
| (DES ou FOR) + CON | Espadachim |
| INT + SAB | Teurgo |
| INT + DES | Alquimista |
| DES + SAB | Monge, Artilheiro, Batedor |

A CD não precisa ser única: ela não define papel.

**Treinamento:**
- 1 categoria de arma (Marciais, À Distância, Místicas) ou nenhuma, como o Brutalista e o Alquimista.
- 2–3 perícias fixas.
- (1 + Mod. INT) perícias de uma lista de 5–7.
- Uma perícia fixa da classe não deve repetir a perícia de treinamento do 1º T1 de um ramo. Se repetir,
  o ramo sobe a perícia para Experiente, e isso é aceitável.

**Evasão:** igual em todas as classes (D20). Passiva = 10 + Mod.DES; Ativa = + dado de Defender (PD8).

---

## 4. Características de classe

**Formato:** 1 ou 2 características.

| Formato | Classes |
|---|---|
| 1 traço + 1 mecânica | Espadachim (Proficiência com Espadas + Marca do Duelo), Monge (Arma Humana + Fluxo), Batedor proposto (Mapa de Combate + Instinto) |
| Só 1 | Brutalista (Brutalidade), Teurgo (Escolas do Primórdio), Alquimista (Bolsa de Reagentes), Artilheiro (Concentração) |

**A característica é o que puxa as técnicas.** Técnicas gerais que citam a característica (script em §10):

| Classe | Citam a característica |
|---|---|
| Teurgo | 13 |
| Monge | 11 |
| Alquimista | 11 |
| Artilheiro | 10 |
| Espadachim | 7 |
| Brutalista | 1 |

A exceção é o Brutalista: a Brutalidade é passiva e as técnicas conversam com o corpo a corpo em geral.
**Alvo: 7–13 das 15.** O Batedor proposto tem 9, mais 2 indiretas.

**Escala por nível** quando a característica dá bônus fixo. A Marca do Duelo dá +1/+2/+3 nos níveis 1, 3
e 5; a Proficiência com Espadas ignora Ar igual ao nível.

**Carga de mesa.** Prefira um estado sim/não (Marca ativa, campo mapeado) ou um contador único com teto
baixo. O Pedro já matou técnica boa por ser impossível de acompanhar com 10 inimigos (*Leitura de
Batalha*).

---

## 5. Régua de recurso de classe (R1–R7)

Tirada dos recursos que funcionam e do que quebrou o Instinto (`13` §Rodada 1):

| Recurso | Ganha com | Perde com | Teto | Enche em |
|---|---|---|---|---|
| Fluxo (Monge) | acerto 2×, esquiva, condição, mover | dano que zera, 1 rodada sem ganhar, fim do combate (L23) | 5 | ~2 rodadas |
| Brutalidade | levar 5+ de dano de uma fonte | fim do combate | 5 | ~2–3 |
| Concentração (Artilheiro) | acerto +1, crítico +2, mirar +2, parado +1 | dano −1, mover −1, falhar resistência −2, aliado cai −3 | 3 + SAB | ~2 |
| **Instinto proposto** | mapa +1 por turno, acerto, esquiva, perícia (fora Atacar e Defender) | Desprevenido zera; dano > ½ tira metade; 10 min sem ganhar zera | 5 | 52–90% até a R3 |

- **R1.** O ganho vem do que a classe **quer** fazer.
- **R2.** Falha de dado nunca zera o recurso. Zerar só vem de fim de cena ou de falha tática clara, como
  ser surpreendido.
- **R3.** O teto se alcança em 2–3 rodadas de jogo normal, com probabilidade ≥ 50%. Isso se mede por
  conta ou simulação, não por impressão.
- **R4.** Nenhum gasto acima do teto mais baixo possível. É a lição da Concentração: com SAB 12 o teto é 4,
  e as técnicas de 5 e 6 ficam inalcançáveis.
- **R5.** No máximo 1 ganho por gatilho por rodada. A mesa conta ≤ 3–4 eventos por rodada.
- **R6.** Se a classe tem um jeito de chegar preparada, a vantagem do preparo aparece no número. O Instinto
  que vem da exploração, por exemplo, leva a R2 de 30% para 93%.
- **R7.** **O recurso é fechado.** Nenhum item, carta ou outra classe gera o recurso de uma classe. A carta
  rara usa só recursos universais (CLAUDE.md §9), e o item replica a *mecânica* de classe (D60), não o
  *contador*.

**O texto diz se o custo é gasto ou requisito.** Os dois modelos existem:
- **gasto:** Instinto, Reagentes, Stamina;
- **requisito, sem gastar:** o Fluxo — *"ao ser exigido fluxo em qualquer técnica este 'custo' é apenas
  o requisito e não é gasto"*.

A Concentração não dizia qual era, e isso virou o achado C15. Toda classe nova escreve o seu na
característica.

**Como medir:** Monte Carlo com semente fixa e 200 mil combates. O modelo está em
`references/batedor-sim-instinto-rework.py`. Ele mede:
- P(teto) por rodada;
- sensibilidade ao parâmetro mais incerto;
- usos por combate do gasto mais forte.

As taxas de acerto são as do modelo: 60/35/10.

---

## 6. Orçamento das 15 técnicas gerais

Script: `scripts/classes/orcamento_tecnicas.py`, sobre `scripts/classes/estrutura_classes.json` (extraído
do Notion em 2026-09-28).

| Classe | Passiva | 1 Ação | Ação Livre | Reação | 2+ ações | Fora de combate |
|---|---|---|---|---|---|---|
| Espadachim | 4 | 3 | 4 | 2 | 1 | 1 |
| Brutalista | 7 | 5 | 1 | 1 | 1 | 0 |
| Teurgo | 7 | 3 | 2 | 0 | 1 | 2 |
| Monge | 8 | 3 | 2 | 2 | 0 | 0 |
| Alquimista | 7 | 5 | 0 | 1 | 0 | 2 |
| Artilheiro | 5 | 7 | 0 | 2 | 1 | 0 |
| **Média** | **6,3** | **4,3** | **1,5** | **1,3** | **0,7** | **0,8** |
| Batedor proposto | 6 (+1 "Passiva ou 1 Ação") | 4 | 2 | 1 | 0 | 1 |

**Custo em Stamina** (média, faixa):

| Tipo | Média | Faixa |
|---|---|---|
| 1 Ação | 2,9 | 2–5 |
| Ação Livre | 3,4 | 2–5 |
| Reação | 3,4 | 2–5 |
| 2+ ações | 3,5 | 3–5 |
| Fora de combate | 4,0 | 2–5 |

Passiva normalmente não custa. Passiva com custo é custo por uso (G12).

**Regras de bolso:**
- **≥ 10 das 15 usáveis em combate.** Pelo menos 2 de exploração ou social; toda classe tem as suas
  (*Pedra de Amolar*, *Linguagem Estranha*, *Artesão de Munição*).
- **7–13 conversam com a característica** (§4).
- **Custo ≤ 5 Stamina** numa técnica geral. Acima disso é Tier 2, ultimate ou "1 vez por descanso longo".
- **Passiva forte precisa de condição escrita**, como *Limiar da Morte* (≤ 50% Saúde) ou *Silêncio
  Interior* (5 Fluxo).
- **Nenhuma técnica geral dá +1 Ação.** O sistema tem 3 fontes em 259 habilidades, todas travadas.
- **Âncoras de preço** (`05-classes.md` e a régua da skill):

  | Efeito | Preço de referência |
  |---|---|
  | +1d6 de dano | ~2 Stamina (*Destruir*) |
  | Suavizar a PMA para −3 | 5 Stamina |
  | Anular a PMA | 2 Ações + 5 Stamina |
  | +2 Ar | 1 Ação + 3 Stamina + contrapartida |
  | *Exposto* | 1 Ação + 4–5 Stamina, ou +5 Éter se acertar |
  | Modificador econômico | ≤ 10% |
  | Buff de +3 para o grupo | ultimate |

---

## 7. Teste de sobreposição (antes de escrever técnica)

**Método:** comparar, eixo por eixo, o que as classes **entregam na mesa**, não o nome das coisas. O
veredito por eixo é total, alta, parcial, baixa ou nenhuma.

| Eixo | Pergunta |
|---|---|
| Coeficientes | o trio é único? |
| CD | informativo; pode repetir |
| Arma treinada | mesma categoria? |
| Papel | quem mais faz isso? |
| Recurso | enche com o quê, gasta em quê? |
| Defesa contra surpresa | quem protege quem de ficar *Desprevenido*? |
| Ataque escondido | à distância ou corpo a corpo? |
| Rastreio / informação | sobre criatura ou sobre terreno? |
| Ramo com o mesmo tema | (Sem-Nome × Predador foi o caso) |
| Condição assinatura | quem gera *Exposto*, *Atordoado*…? |

**Regra:** não pode haver "total" ao mesmo tempo em coeficientes, arma **e** papel com outra classe. Foi o
que fez o Batedor de hoje virar "Artilheiro pior". A resolução é dar um papel que a outra classe não
cobre, não fazer a mesma coisa melhor.

**Papéis ocupados hoje:**

| Classe | Papel |
|---|---|
| Espadachim | duelista (retaliação, Marca) |
| Brutalista | tanque; o ramo General comanda |
| Teurgo | conjurador |
| Monge | mobilidade e defesa (Fluxo) |
| Alquimista | recurso e item |
| Artilheiro | dano à distância |
| Batedor (proposta) | terreno e informação (campo mapeado, anti-emboscada, *Exposto* por movimento) |

Ainda livres para as classes novas: cura dedicada, invocação ou controle de mortos, maldição, forma
animal.

---

## 8. Ramos

**Ramo:** 1 tema em dois eixos, "(Tema e Tema)", mais 1 parágrafo de lore. Os três ramos cobrem estilos
diferentes: o Batedor tem campo, furtividade e social; o Artilheiro tem arremesso, pólvora e arco.

**Marcas (2 por ramo).** Formato:
- nome sublinhado;
- `> *"citação"*`;
- 1 linha de personalidade;
- 2 bullets.

Ao menos uma é **marca de progressão**, com a fórmula verbatim: *"Para cada N <feito do ramo>, ganha +1
permanente em <perícia>.<br>Ao chegar em +5, essa habilidade fica supérflua."* O feito é algo que o
ramo faz em jogo, como jornadas de Hostilidade 10+, mortes escondido ou combates com 6+ Concentração. A
outra é uma **marca de traço**: efeito pequeno, narrativo ou de nicho.

Toda marca que dá recurso ou atributo precisa de teto (o *Colecionador de Horizontes* não tinha).

**Tier 1 (3 por ramo, nível 2):**
1. **1ª técnica, passiva de treinamento**, com a fórmula verbatim: *"Você se torna Treinado em X. Se já for
   Treinado, se torna Experiente e assim por diante."* Depois vem o efeito-assinatura do ramo. Exemplos:
   *Mãos Velozes*, *Presença da Pólvora*, *Olho do Arqueiro*, *Veterano de Guerra*.
2. Uma ativa de combate, de 1 Ação ou Ação Livre, custando 2–3 Stamina.
3. Uma técnica de estilo: a fantasia do ramo, dentro ou fora de combate.

**Tier 2 (2 por ramo, nível 4):** o poder de meio de campanha. Pode ser uma passiva forte com condição, ou
uma ativa de 1–2 Ações custando 3–5 Stamina, às vezes com gasto de recurso. Exemplos: *Inimigo Mortal*,
*Execução*, *Formação de Combate*.

**Tier 3 (1 ultimate por ramo, nível 5)**, no formato das 6 classes:
- **Cabeçalho:** `Nome (N Ações, 5 Stamina[, 5 <recurso>], Ultimate)`. Ações de 1 a 3; Stamina de 5 a 10.
- **Frase do tier:** "O Tier 3 provê Ultimates, que só podem ser utilizadas 1 vez por descanso longo."
- **Citação:** `> *"…"*`.
- **`Ativação:`** o que acontece, a duração (1 minuto, 3 rodadas ou até o fim do combate) e os benefícios
  em bullets.
- **`O Custo:`** obrigatório. Opções:
  - perder 1d6–2d6 de Éter;
  - Exaustão 1;
  - perder todo o recurso;
  - uma restrição durante o efeito ("não pode atacar", "não pode critar contra alvos não marcados");
  - uma consequência narrativa.
- **Requisito:** só o Cartógrafo escreve o seu ("deve ter ao menos Cartógrafo Tier 1 ou 2"); as outras
  classes deixam implícito. Recomendo escrever nos três ramos de toda classe nova.

---

## 9. Convenções de texto (o que o Log de Técnicas já pegou)

**Frequência e ações**
- A notação é **"1 vez por descanso longo"** ou **"1x/Descanso Longo"**. Também existem 1x/sessão,
  1x/semana e 1x/campanha. Nunca "1 vez por dia" (L29).
- **Ação livre:** 1 vez por turno, salvo o texto dizer outra coisa (D99). No custo variável, escolhe-se
  quanto pagar dentro desse uso, até o limite do texto (D126).
- **Reação** é para gatilho fora do seu turno. Técnica que se usa no próprio turno não é Reação (foi o
  caso da *Mãos Rápidas*). Esta é recomendação minha: o Sistema só diz que "reações servem para
  regras/habilidades específicas".

**Ataque e dano**
- **PMA:** vale em todo ataque, inclusive de técnica, salvo o texto dizer o contrário (D100). N ataques
  "como 1 ação" pagam juntos o Atacar(n) da arma (D101).
- **Retaliação** que não gasta reação preserva a reação (D98).
- **CD:** escrever "contra sua CD" (D57).
- **Crítico:** escrever "Margem de Ameaça +N", nunca "margem de crítico". O crítico dobra os dados da arma,
  inclusive os impressos nela (D97). Dado de técnica não dobra.
- **Laço de crítico:** um efeito "ao critar" que aplica *Exposto* precisa de trava, porque *Exposto* gera
  crítico. Use "com 20 natural" ou "1 vez por alvo" (caso do *Terror*).

**Condições e estados**
- **Condições:** em itálico e com o nome exato da página Condições.
- *Marcado* e *Escondido* não são condições (PD17). Técnica que cria um estado define a duração e como ele
  sai.
- **Não existe regra de flanco nem de cobertura.** A técnica que quiser usar precisa definir a regra no
  próprio texto.

**Alcance, tempo e grupo**
- **Alcance** em metros, múltiplos de 1,5.
- **Duração** em rodadas ou minutos: 1 minuto = 10 rodadas (D90).
- **Efeito de grupo:** "aliados que possam te ouvir" ou "que possam te ver". Os sinais do Batedor são
  silenciosos, por isso usam "ver".

**Nomes**
- **Únicos no sistema inteiro:** classes, raças, origens, magias, cartas do Limiar, itens do Bazar.
- Conferir com o script (§10). Colisões já encontradas: 3 "Investida", "Ponto Cego", "Oportunista",
  "Sexto Sentido", "Caçador"; e "Brecha", que por pouco não entrou no Batedor.

**Economia e ofícios**
- **Modificador de preço ou de Sins:** ≤ 10%.
- **Sins criados por morte ou por cena:** evitar (D6).
- **Técnica que fabrica item** respeita os ofícios: Ferraria, Engenharia, Alquimia e Sobrevivência (D36,
  D73). Veneno é Alquimia (D72).

**Texto do Pedro:** lore, citações e parágrafos de fantasia ficam verbatim. Mudança de regra é cirúrgica,
na frase que muda.

---

## 10. Validação (checklist)

1. **Colisão de nome:** `python3 scripts/classes/nomes_index.py "Nome 1" "Nome 2" …`. Cruza `data/*.json`,
   o CSV do Bazar e as 7 classes do Notion; se receber dumps, cruza também o Sistema e as Magias.
2. **Orçamento:** `python3 scripts/classes/orcamento_tecnicas.py` e a tabela de mix da classe nova ao lado.
3. **Recurso:** simulação (R3), com o parâmetro incerto variando e os usos por combate do gasto mais forte.
4. **Preço:** cada técnica nova ou mudada ganha uma linha "entrega / âncora no sistema"
   (`18` §7.3 é o modelo).
5. **Exploit e carga de mesa:** leitura adversarial de cada técnica. Pode ser um subagente com a instrução
   "ache o exploit", nunca com a de "jogue o combate" (`13` §Método).
6. **Sobreposição** com as 7 classes (§7).
7. **Verbatim:** diff por script entre o texto proposto e o do Notion, para provar que só mudou o que
   está declarado (`18` §4 foi conferido assim).
8. **Depois do aceite:**
   - Notion com `update_content` e `old_str` exato, em blocos pequenos;
   - fetch;
   - `scripts/log-tecnicas/ndiff.py` contra o retrato de antes;
   - log para o agente de HTML no `17` §3;
   - contrato `ficha-digital-regras.json` numa revisão nova, se a ficha mudar.

---

## 11. Para as raças e origens (adaptação)

- **Raça:** traço + tecnologia/sub-raça no lugar das características. Não tem ramos; a régua de
  raridade→poder das Tecnologias do Autômato está em `04-racas.md`.
- **Origem:** perícias + item + Sins iniciais. A âncora está em `03-origens.md`: mediana 12 Sins. A ideia
  do Pedro (D119) é ter itens mais únicos nas origens.
- **Valem igual:** as convenções de texto (§9), a checagem de nome (§10.1) e o teste de sobreposição (§7)
  contra raças e origens já existentes.
