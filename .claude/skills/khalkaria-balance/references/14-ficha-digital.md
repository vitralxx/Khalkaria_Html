# Ficha digital — resposta do balanceamento ao agente de HTML

**Pedido:** `docs/ficha-digital/01-pedido-ao-balanceamento.md`, branch `ficha-digital-pedido`.
**Resposta:** este arquivo + `ficha-digital-regras.json`.
**Data:** 2026-09-25. **Canal aprovado pelo Pedro.**

---

## Revisão 4 (2026-09-26) — o que mudou depois das respostas do Pedro

**Duas células do CSV do Bazar mudaram, com aprovação explícita do Pedro.** Aplique as mesmas duas
no `data/Bazar_Khalkaria_v26.csv` da main (o resto do arquivo é idêntico):

| Item | Coluna | Antes | Depois |
|---|---|---|---|
| Anel do Baluarte | Efeito | `[Leve] Ae(Todos, 3).` | `[Leve] Ae(Todos, 3), (Exceto: Força e Primordial).` |
| Erva Medicinal | Efeito | `... 1d4+2 de Saude. ...` | `... 1d4+2 de Saúde. ...` |

`ficha-efeitos-itens.json` já foi regenerado com as duas.

**Tempo (D90), novo bloco `tempo` no contrato:** 1 ação = 2 segundos; 3 ações = 6 segundos =
1 turno. Derivado: 1 minuto = 10 rodadas — use para converter duração em minutos. **Ação não
definida (inclusive usar consumível sem custo escrito): o mestre decide na hora.** Na ficha,
`acoes: null` significa isso; não trave nem sugira número.

**Manobra nova (D88): Investida.** O texto entra na página Sistema, seção *Manobras*, quando o Pedro
fechar três pontos. Aviso aqui quando entrar.

---

## Revisão 3 (2026-09-26) — Notion gravado + Pedido 2 (efeitos dos itens)

**D80, D81 e D82 agora estão no Notion** (página Sistema `2b76e3a4`), com o texto que está no
`ficha-digital-regras.json` como `verbatim`. Status passou a `canonico`. Para destravar a API,
troquei 6 ícones de callout que ela não aceita mais por emoji: Dinheiro 💰, Superfícies ⛰️,
Furtividade 👁️, Perseguição 🏃, Khan Sins 🃏, Magias 🪄. O diff da página antes/depois confirma:
3 blocos adicionados, 6 ícones trocados, nada mais.

**Pedido 2, bloco B — entregue:** `ficha-efeitos-itens.json` (+ `ficha-efeitos-gerador.py` e
`ficha-efeitos-overrides.json`, que o geram).
- Os 727 ids, chave `'item-' + slug(nome)`, 0 colisões. **A conta fecha** contra o
  `data/Bazar_Khalkaria_v26.csv` da main (a coluna Efeito é idêntica à minha; só *Ingredientes*
  difere, em 109 itens, pela normalização de reagentes do site).
- `itens` 214 · `armas` 181 · `consumo` 243 · `semEfeitoNaFicha` 115 · `naoParseado` **0**.
- 369 modificadores/efeitos, todos com alvo declarado em `alvos` e op em `soma|fixa|escolha`.
  609 entradas `canonico` (gramática fechada sobre o CSV) e 29 `decisao` (revisadas à mão).
- Índices para o assistente de descanso e o inventário: `fonteDeLuz` (9), `alimento` (4),
  `empilhaveis` (87).
- Método: toda frase de todo Efeito cai em modificador, lembrete, estrutural ou sabor. Um
  detector sinaliza lembrete que carrega número de campo de ficha ou verbo de cura. Os 20 que
  sobraram são lembretes legítimos: valem para aliados ou inimigos, ou dependem de distância, luz
  ou alvo escolhido.
- **7 pendências** no próprio arquivo (`pendencias`). As que precisam do Pedro: manobra
  "Investida" inexistente (*Grevas Trovejantes*); `Ae(Todos)` com exceção em dois itens e sem
  exceção no *Anel do Baluarte*; custo de ação para usar consumível não definido no Sistema;
  grafia "Saude" na *Erva Medicinal*; poção de cura em Autômato.

**Bloco C (raças, origens, Limiar, passivas de classe): não comecei.** O Pedro priorizou o rework
do Batedor, e o C é o parser do P44, que é um trabalho grande. Vem depois da rodada do Batedor.

---

## Revisão 2 (2026-09-25) — decisões do Pedro. **Onde conflitar com o resto do arquivo, vale esta seção.**

| Tema | Decisão | Código |
|---|---|---|
| Modificador de atributo | `floor((attr − 10)/2)`, tabela de 4–5 (−3) a 24–25 (+7) | D80 |
| Vantagem / desvantagem | 2d20 maior/menor, não acumulam, se anulam, **crítico vale para o dado usado**, Defender rola o próprio dado 2× | D81 |
| Custo mínimo de magia | **1 Éter para toda conjuração**, mesmo após reduções. Única de custo 0: Nível 1, Normal, sem modulação. **Substitui o modelo de "dois pisos"** que eu propus em C06/P38/P39 | D82 |
| Sangramento X | `+Xd4` por acerto, cada acerto remove 1 | D83 |
| Estresse | fica como está; liberação obrigatória; o saldo negativo no descanso é a punição funcionando | D84 |
| Ar | soma racial + armadura, sem teto | D85 |
| Morrendo | tique não mitigável | D86 |
| **+2 atributos por nível** | canônico (Limiar, *Bênção Imediata dos Atributos*), +8 no nível 5 | D87 |
| PMA na ficha | **display da progressão de ataques**, sem contador por alvo | Pedro, via agente de HTML |

**Status no Notion:** D80–D82 ainda **não** estão na página Sistema. Tentei gravar pela API e ela
recusou a página inteira por causa de ícones de callout legados (`money_yellow`, `mountain_yellow`).
Nada foi gravado. O Pedro disse que já entrou; o fetch de hoje ainda mostra a página editada por
último em 22/09, sem os blocos. No JSON esses três estão como `"aprovado"` até o fetch confirmar.

**Três correções minhas da revisão 1:**
1. **P46 — o Limiar NÃO "fecha exato em 16 pontos / 6 cartas".** O custo crescente é **por mão, a
   cada nível**: são 4 cartas grátis na campanha. O Limiar diz *"5-11 Cartas do Limiar escolhidas"*.
2. **P02 — "os atributos só mudam pela carta +2 do Limiar" está errado.** Todo nível dá +2 (D87). A
   recomendação `maior` continua, pelo outro motivo: não guarda estado.
3. **P24 — `criticoComUm20` saiu.** Com desvantagem, um 20 no dado descartado não crita.

**C16 — *Marcada à Morte X* está definida:** dentro da ultimate *Silêncio* do Batedor (Sem-Nome,
Tier 3). É estado de classe e acumula ao ser reaplicada. Não promover a condição genérica. O
Batedor está em rework (D79), então pode mudar.

---

## 0. Como ler esta resposta

Cada resposta leva um selo:

| Selo | Significa |
|---|---|
| **CANÔNICO** | Está escrito no Notion ou numa decisão registrada (`09-decisoes-pedro.md`). Pode ir para o site. |
| **DECISÃO** | Eu arbitrei agora, com justificativa. **Precisa ser escrita no Notion pelo Pedro antes de virar regra de mesa.** |
| **PEDRO DECIDE** | Não é minha alçada. Dou a recomendação e o motivo; a escolha é dele. |
| **LACUNA** | O cânone não responde e eu não invento. Vai `null` + `pendente` no JSON. |

**Nada aqui é canônico só porque eu escrevi.** O contrato JSON carrega `status` em toda regra
exatamente por isso.

### Conferência que eu fiz antes de responder

Busquei no Notion `2b76e3a4` (Sistema Khalkaria, fetch de hoje) em vez de recitar de memória.
Três coisas mudaram em relação ao que o pedido assume:

1. 🟢 **A tabela de custo de magia JÁ ESTÁ atualizada no Notion**, com os 5 níveis:
   *"Magias Nível 1: 0 Éter · Nível 2: 2 · Nível 3: 4 · Nível 4: 6 · Nível 5: 8 (requer Foco Primordial)"*.
   O `data/ficha.schema.json` com 4 níveis é que está velho. Resolve o C05 sem depender de decisão.
2. 🟢 **"Margem de Ameaça" e "Multiplicador de Crítico" já estão registrados no Notion**
   (eram pendências minhas, D22 e D31 — dou baixa nelas):
   *"Margem de Ameaça: Denota a faixa ao rolar um d20 onde seu ataque é considerado um crítico,
   por padrão, é apenas ao rolar 20."* · *"Multiplicador de Crítico: Denota quão o multiplicador
   do crítico de uma arma, por padrão, é o dobro"*.
3. 🔴 **O `-2 Éter (mín. 1)` da Contida NÃO EXISTE no Notion.** A tabela de Intensidade diz
   apenas `Contida | -2 Éter | Efeito Reduzido`. O "mín. 1" é invenção do lado do site.
   Isso muda o C06 de "contradição entre fontes" para "regra que o site criou sozinho" — e,
   como você vai ver, ela **precisa** existir, só que não é canônica ainda.

E duas que confirmam lacuna de verdade, não falta de busca minha:

- **O modificador de atributo não está em lugar nenhum do Notion.** A seção *Atributos Iniciais*
  só lista os 5 atributos e o 4d6-drop-lowest. C13 é lacuna real.
- **"Vantagem" e "desvantagem" não têm regra geral.** Zero ocorrências de `2d20` na página
  Sistema. Só aparecem como efeito ("role com vantagem"), nunca definidas.

---

## 1. As cinco coisas que mais importam nesta resposta

Se você ler só isto, leia isto:

1. **Evasão Ativa é `Evasão Passiva + rolagem do dado de Defender`, gastando a reação.** O Notion
   é inequívoco e recente. As páginas de classe (`10 + Mod.Des + Prof.Defender`) e o
   `sistema.json` (`1d10 + Mod.Destreza`) estão os dois desatualizados. **E o dado de Defender não
   soma atributo nenhum** — somar Mod.DES ali contaria a Destreza duas vezes, porque a Evasão
   Passiva já é `10 + Mod.DES`.
2. **O contador mais valioso que a ficha pode ter não está em destaque no seu pedido: a PMA.**
   −5 cumulativo **por alvo** (D29), zerando ao trocar de alvo. É a regra que a mesa mais erra e
   a que a ficha acerta de graça. Eu a colocaria como essencial antes de metade da sua lista.
3. **A Contida precisa de piso 1, e o custo final precisa de piso 0.** São dois pisos diferentes,
   em etapas diferentes do cálculo. Sem o piso 1, uma magia de Nível 2 Contida custa 0 Éter e
   torna os 20 truques de Nível 1 obsoletos no dia em que entrarem. Detalhe em **C06/P38/P39**.
4. **Três cláusulas do conteúdo são texto morto e eu consigo provar.** O reset "1 rodada sem
   ganhar Fluxo" nunca dispara (mover já dá Fluxo). O `Ae(Ordinário)` não existe (é `Ar`). O
   "mín. 1" da Contida nunca se aplica no Nível 1 (truque não tem Contida). Não modele o que não
   roda.
5. **Não peça ao jogador para rastrear o que é compartilhado.** A rodada é do mestre. A ficha
   conta *os turnos dela*, e as durações são expressas em turnos do próprio personagem. Ficha que
   tem contador de rodada própria dessincroniza, e clock dessincronizado é pior que clock nenhum.

---

## 2. Contradições — arbitragem (C01–C21)

### C01 — Evasão Ativa / reação Defender · **CANÔNICO**

Vale a redação do Notion, seção **Defesa**, página `2b76e3a4`, verbatim:

> - **Evasão Passiva**
>   - É sua evasão natural. Quando alvo de um ataque, se sua evasão for maior que a rolagem de
>     ataque você desvia/resiste o ataque.
> - **Evasão ativa**
>   - Quando alvo de um ataque, você pode gastar sua reação para somar o dado da perícia
>     *defender* (conforme seu treinamento) à sua evasão contra todos os ataques do agressor
>     neste turno.

Portanto:

```
evasaoPassiva = 10 + mod.DES                      (número, sempre visível)
evasaoAtiva   = evasaoPassiva + dadoDefender()    (rolagem, custa a reação)
```

- A redação `10 + Mod.Des + Prof.Defender` das páginas de classe é **anterior** à regra do dado.
  Não tem como ser verdadeira e a de dado também: `Prof.Defender` como número fixo só existe num
  mundo em que Defender escala por modificador, e ele não escala.
- O `1d10 + Mod.Destreza` do `sistema.json` é o erro mais antigo: chumba o dado do Experiente
  **e** soma Destreza, que a Evasão Passiva já contém.
- 🔑 **O dado de Defender entra sozinho, sem modificador.** Não está escrito com essas palavras,
  mas está implícito na estrutura: a Passiva já carrega `Mod.DES`, e a Ativa é "somar o dado
  **à sua evasão**". Somar Mod.DES no dado seria contá-lo duas vezes. **DECISÃO**, precisa de uma
  linha no Notion.
- ⚠️ **O Notion se contradiz consigo mesmo em uma palavra.** A seção *Defesa* diz "neste **turno**";
  a seção *Sua Rodada* diz "nesta **rodada**". Como o escopo já está preso a um agressor, a
  diferença só aparece se o mesmo agressor atacar fora do próprio turno (retaliação, ataque de
  oportunidade). Recomendo **"neste turno do agressor"** e uma correção de palavra no Notion.
  **PEDRO DECIDE**, impacto baixo.

### C02 — `Prof.Defender` como número × Defender como dado · **CANÔNICO**

Defender é dado, e o Notion diz por quê, verbatim:

> ### Defender:
> A perícia defender possui uma regra especial que nenhuma outra perícia tem.
> Seus treinamentos aumentam o seu tipo de dado ao rolar a perícia progressivamente. Então, na
> proficiência: ***Leigo*** a perícia utiliza um 1d6, porém treinamentos posteriores aumentam o
> dado da perícia em vez de adicionarem modificadores.

| Leigo | Treinado | Experiente | Mestre | Lendário |
|---|---|---|---|---|
| 1d6 | 1d8 | 1d10 | 1d12 | 2d8 |

**Modelo de dado que eu recomendo:** a ficha guarda o **grau** (0–4) por perícia, não o bônus.
Para 23 perícias ela renderiza `+2×grau`; para Defender renderiza o dado. Isso concilia a ficha
física (que mostra caixas +2/+4/+6/+8 em tudo, inclusive Defender) com a regra, sem precisar de
um campo especial: a caixa marcada é o grau, e a ficha traduz. A impressão "+2/+4/+6/+8" em
Defender é artefato de diagramação da ficha física.

**E Defender não usa `(Des/Con)`.** O dado substitui o atributo inteiro. Ver C01.

### C03 — Atributo de perícia: ficha física × sistema.json · **CANÔNICO + PEDRO DECIDE**

**Atacar — resolvido, e não é escolha do jogador.** O Notion, seção *Ataque*:

> - **Corpo a Corpo Pesado:** O acerto usa a perícia **atacar** com Mod. de Força, dano dá +Mod. de Força.
> - **Corpo a Corpo Leve:** [...] +Mod. de Destreza.
> - **Armas Místicas:** Quando a magia exige um ataque, o acerto usa a perícia ***místico***,
>   dano dá +Mod. de Inteligência/Sabedoria

Ou seja: `Atacar (Força ou Destreza)` na tabela de perícias é a **união** dos casos, não uma
escolha. **A arma decide.** O `(For)` da ficha física é simplificação de impressão.
→ `modo: "porArma"`.

**Intimidação — divergência real.** Ficha física `(For/Sab)` × tabela de perícias `(Con ou For)`.
**PEDRO DECIDE.** Recomendo **CON ou FOR** (a tabela de perícias), por carga de atributo: SAB já
carrega Vontade, Percepção, Sobrevivência, Religião, Intuição e Motivar — seis perícias. CON
carrega só Fortitude. E Khalkaria não tem Carisma de propósito: as sociais estão espalhadas em
DES/INT (Convencimento, Enganação), FOR/CON (Intimidação) e SAB (Motivar). Isso é desenho, não
acidente — mover Intimidação para SAB junta sete perícias num atributo e esvazia CON.

### C04 — Religião: SAB ou INT · **CANÔNICO — SAB**

Notion, tabela de perícias, verbatim:

> | Religião | Define seus conhecimentos sobre religião e a cosmologia. | 1d20+Sabedoria |

`js/ficha.js` e `data/ficha.schema.json` (`x-attr: 'int'`) estão errados. Correção factual contra
o Notion — pode aplicar direto, não precisa de decisão.

### C05 — Níveis de magia · **CANÔNICO — 5 níveis, 0/2/4/6/8**

Notion, hoje, verbatim:

> **Custo Base:**
> - Magias Nível 1: 0 Éter
> - Magias Nível 2: 2 Éter
> - Magias Nível 3: 4 Éter
> - Magias Nível 4: 6 Éter
> - Magias Nível 5: 8 Éter (requer Foco Primordial)

Isso é o **D68** já aplicado: todas as magias antigas subiram um nível e o novo Nível 1 são os 20
truques (ver `12-magias-nivel1.md`). O schema da ficha com `nivel1..4` e `2/4/6/8` é pré-shift.
O layout físico "Grimório · magias por nível 1–4" também.

⚠️ **Não sincronize o grimório a partir de página de classe sem conferir.** A renumeração ainda
tem resíduo em blocos que o Pedro vai ajustar: *Dissipar Magia* ("Nível 2 ou menor" → 3), a regra
de acesso do Teurgo em 3 blocos, a origem **Cultista** e a raça **Corrompido** ("magias de nível
0" → nível 1), e o *Desejo Sombrio* do Abismo ("nível 1-4" → 1-5). Lista completa em
`09-decisoes-pedro.md` §8.

### C06 — Contida "mín. 1" · 🔴 **A regra do site não existe no Notion — e mesmo assim é necessária**

O Notion diz só `Contida | -2 Éter | Efeito Reduzido`. O `(mín. 1)` é do `data/sistema.json`.

Mas repare no que acontece se ele não existir. **Nível 1 não tem Contida** (D68: três barras, não
quatro). Então o "mín. 1" só pode incidir em **um** lugar em todo o sistema: Nível 2 Contida,
`2 − 2 = 0`.

E aí está o problema, com número:

| Opção | Nv2 Contida | Consequência |
|---|---|---|
| **sem piso** | 0 Éter | Uma magia de Nível 2 com −1 dado custa o mesmo que um truque de Nível 1 em potência plena. Um truque de Destruição tem teto de **1d4** (D68); uma magia de Nível 2 com um dado a menos fica em torno de **1d6**. O tier inteiro de truques que acabamos de desenhar nasce obsoleto. |
| **piso 1** | 1 Éter | Conjuração gratuita continua sendo a identidade exclusiva do Nível 1. |

→ **Recomendo piso 1 na Contida.** **PEDRO DECIDE**, e precisa virar linha no Notion, porque hoje
o site aplica uma regra que o cânone não tem.

→ E é preciso um **segundo piso, separado**: o **custo final nunca desce abaixo de 0**. Sem ele,
*Canalização Eficiente* (−1 Éter, Teurgo) leva um truque Normal a custo negativo. Os dois pisos
agem em etapas diferentes e não se substituem — ver **P39**.

### C07 — Custo de ação para conjurar · **CANÔNICO**

Notion, *Sua Rodada*: `- *Conjurar magia* (1-3 ações)`. Isso é o **envelope**; quem manda é o
campo `Ação` de cada magia (`stats[Ação]`). O "simples (1 ação) / complexa (2-3 ações)" do
`sistema.json` é glosa antiga e não corresponde a nenhum campo do dado.
→ A ficha lê a magia, nunca o envelope.

### C08 — Blocos do Notion ausentes do `sistema.json` · **CANÔNICO, é buraco de sync**

Conferi os quatro hoje no Notion. Todos existem, verbatim:

- `- *Pular* (2 Ações) → Pula 1/3 do seu Movimento`
- `Você não pode retaliar à distância.`
- As definições de Evasão Passiva e Ativa (transcritas no C01).
- `**Armas Místicas** — Quando a magia exige um ataque, o acerto usa a perícia ***místico***, dano dá +Mod. de Inteligência/Sabedoria`

Não é contradição: é o `sistema.json` atrasado. Sincronizar.

### C09 — Tabela de falha da Jornada · **CANÔNICO — vale o Notion**

`4d6 / 2d8 / 2d6 / 1d6 / 1d4`. ⚠️ Não é diferença cosmética: a primeira faixa vai de média 7
(`2d6`) para média 14 (`4d6`) — **dobra**. Se alguma coisa no site foi calibrada contra a tabela
antiga, recalibre.

### C10 — Munição · **CANÔNICO — o CLAUDE.md está errado nos dois pontos**

Já resolvido em **D2** e na divergência **A1** (`08-divergencias.md`), confirmado pelo Pedro em
2026-08-26:

- **Gasto: 1 munição do tipo da arma por cena de combate**, não por disparo. E munição especial
  dá o efeito **em todos os ataques da cena** — é buff de cena, não consumível de tiro.
- **Peso: 10 unidades = 1 bugiganga** (D5: *"pesa 1 bugiganga a cada 10 unidades"*, regra geral de
  item leve do Notion). O CSV está certo; o `20 = 1 slot` do CLAUDE.md §2 é que está errado.

→ Corrigir o CLAUDE.md. O `REGRAS.PILHA=10` marcado como "pendente: munição" no `js/ficha.js`
pode sair de pendente: está certo.

### C11 — 22 × 24 perícias · **CANÔNICO — são 24**

O genérico `Ofício(X)` deixou de existir. São três perícias concretas:
`Ofício(Ferraria)`, `Ofício(Engenharia)`, `Ofício(Alquimia)` — todas `1d20 + Mod.INT`, todas
inutilizáveis sem treino (Notion: *"Você não pode utilizar essa perícia sem tê-la treinada"*,
que é a mesma regra da **D48**).

🔴 **A descrição de Ferraria no Notion está errada** — diz "fabricar uma Bugiganga", que é o texto
da Engenharia copiado. O escopo correto é a **D36**:

```
Ofício(Ferraria)    → EQUIPAMENTOS : Arma · Armadura · Escudo
Ofício(Engenharia)  → BUGIGANGAS   : Bugiganga · Munição · Item Mágico
Ofício(Alquimia)    → Consumíveis alquímicos  (D51: exclusiva do Alquimista)
```

→ Pendência do Pedro no Notion. O site pode usar a D36 desde já: é correção factual.

### C12 — CD de classe sem "Mod." · **CANÔNICO — é sempre o modificador**

Não é ambiguidade real. Atributos vão de 8 a 18; `10 + Força + Constituição` num Brutalista de
FOR 16 / CON 14 daria **CD 40** contra um d20. A única leitura possível é `10 + 3 + 2 = 15`.
Vale para Brutalista, Espadachim e a linha `10 + Des + Sab` do template do Artilheiro — esta
última é literalmente a mesma coisa que o Notion escreve por extenso.

| Classe | CD |
|---|---|
| Espadachim | `10 + maior(mod.DES, mod.FOR) + mod.CON` |
| Batedor | `10 + mod.DES + mod.SAB` |
| Monge | `10 + mod.DES + mod.SAB` |
| Brutalista | `10 + mod.FOR + mod.CON` |
| Teurgo | `10 + mod.INT + mod.SAB` |
| Alquimista | `10 + mod.INT + mod.DES` |
| Artilheiro | `10 + mod.DES + mod.SAB` |

**CD única: sim.** **D57** — *"A CD é sempre a do portador, sem exceção."* Magia, técnica e item
usam a mesma. `Contra-Mágica Instintiva +1` e `Estudo Intenso +2` somam nela.

### C13 — Modificador de atributo · 🔴 **LACUNA REAL — não está no Notion**

Conferi hoje. A seção *Atributos Iniciais* traz só a lista dos 5 atributos e a criação
(4d6, retira o pior, 5 vezes, move 1 ponto). **Não há fórmula de modificador em lugar nenhum da
página Sistema.** A única fonte do sistema inteiro é o CLAUDE.md, que não é canônico.

→ **PEDRO DECIDE**, e é a lacuna mais grave da lista: **tudo** que é derivado depende dela.
Recomendo `floor((atributo − 10) / 2)`, que é o que o `js/ficha.js` já faz:

| 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 |
|---|---|---|---|---|---|---|---|---|---|---|
| −1 | −1 | 0 | 0 | +1 | +1 | +2 | +2 | +3 | +3 | +4 |

Com `floor`, o valor ímpar é "morto" (9 vale o mesmo que 8). É o comportamento padrão de d20 e é
o que a regra de criação já pressupõe ao permitir mover 1 ponto entre atributos — essa regra só
faz sentido se o ímpar for desperdício. **Precisa de um bloco no Notion**, não de uma linha no
CLAUDE.md.

### C14 — "ultrapassar" (Morrendo) × "alcançar" (Oco) · **PEDRO DECIDE, impacto baixo**

Leitura literal: Morrendo mata em `Saúde < −máx/2` (estritamente além); Oco entrega o personagem
em `Éter ≤ −máx/2` (ao atingir).

Não vejo intenção: são frases escritas em momentos diferentes. Recomendo **padronizar em
"ao ultrapassar"** nos dois, porque desfecho definitivo merece exigir um ponto a mais, e não
acontecer no empate. Uma palavra em cada card.

### C15 — Concentração máx `3 + Mod.SAB` × técnicas de 5 e 6 · 🔴 **Bug de desenho, não de sync**

Isto é exatamente o mesmo padrão do bug do Instinto que eu achei no Batedor: **um recurso cujo
teto não alcança os próprios gastadores.**

| SAB | Mod | Máx de Concentração | *Foco Absoluto* (5) | *Paciência Inabalável* (6+) |
|---|---|---|---|---|
| 12 | +1 | 4 | ❌ inalcançável | ❌ |
| 14 | +2 | 5 | ✅ no talo | ❌ |
| 16 | +3 | 6 | ✅ | ✅ no talo |
| 18 | +4 | 7 | ✅ | ✅ |

Um Artilheiro de SAB 12 tem duas técnicas que **nunca** pode usar. Não é gate de build — é armadilha,
porque nada na página avisa.

**Para a ficha, agora:** máx = `3 + mod.SAB`, e a técnica acima do teto aparece **desabilitada com
o motivo escrito** ("requer 5 Conc.; seu máximo é 4"). Não esconda e não bloqueie em silêncio.

**Para o sistema:** entra na fila do rework de classe — é a "régua de recurso de classe" que a
**D79** já manda produzir. Vou tratar junto com o Instinto.

### C16 — Nomes de condição · **DECISÃO (aliases) + PEDRO DECIDE (as novas)**

Aliases, mesma condição com grafia diferente — o catálogo manda e o site carrega `aliases[]`:

| Alias no conteúdo | Id do catálogo |
|---|---|
| Embriagado | `bebado` |
| Exausto N | `exaustao` nível N |
| Envenenado | `envenenamento` |

Usadas no conteúdo e **fora** do catálogo:

- **Agarrado** — na verdade já está definida, só não como card. A manobra *Agarrar* diz:
  *"Atacar contra o alvo +2, alvo −2 ao Atacar, alvo Enraizado."* → **Recomendo promover a card**
  com esses três efeitos exatos. Nada de novo precisa ser inventado.
- **Marcado** ("+2 Atacar contra ele") — **PEDRO DECIDE.** Parece a *Marca do Duelo* do Espadachim
  generalizada. Se virar condição genérica, pisa na identidade da classe (é o único estado que o
  Espadachim tem). Minha recomendação é **não** promover: deixar como estado de classe.
- **Marcada à Morte X** — **PEDRO DECIDE**, não tenho o texto.

**Três que NÃO são condição** e não devem entrar no rastreador:

- **Terreno Difícil** — é *superfície* (Notion, seção Superfícies: dobro de movimento). Pertence ao
  ambiente, não ao personagem.
- **Vulnerável** — é camada da grade de dano (Vulnerabilidade ×2), não condição.
- **Dissipado** — é estado de um efeito mágico, não da criatura.

### C17 / C34 — Taxonomia de condição · **DECISÃO: são dois eixos, não um**

O site agrupa em críticas / combate / movimento / mentais / físicas / sensoriais. Isso é
**agrupamento de interface** e é bom — não mexa.

A lista do Limiar é outra coisa: é a **tag mecânica** que uma imunidade consulta.

> "condições físicas" = Embriagado, Sangramento, Lento, Atordoado, Paralisado, Desorientado,
> Enjoado, Envenenamento

→ **Modele os dois campos separados:** `grupoUI` (os 6 do site) e `tags[]` (mecânicas). Fundir os
dois é o erro: um serve para achar o card, o outro para decidir se a condição pega.

🔴 **"Condições mentais" é citada pelo Teurgo e pelo Veterano e nunca foi listada.** **PEDRO DECIDE.**
Minha proposta, pela leitura dos efeitos: `Confuso · Amedrontado · Descontrolado · Enfeitiçado ·
Adormecido`. Bêbado fica fora porque o Limiar já a colocou entre as físicas.

### C18 — Dano por categoria × grade de 12 tipos · **CANÔNICO (D63/D67) — a grade precisa crescer**

A taxonomia fechada é 4 categorias sobre **14 tipos**:

| Categoria | Tipos |
|---|---|
| **Ordinário** | Cortante · Contundente · Perfurante |
| **Elemental** | Fogo · Frio · Elétrico |
| **Biológico** | Veneno · Ácido · Psíquico |
| **Místico** | Radiante · Trovejante · Necrótico · Força · Primordial |

A grade atual tem 12 porque colapsa os três ordinários em uma linha "Ordinário". Mas a **D63**
garante que `Ae(Cortante, 5)` existe, então os três precisam de linha própria.

**`Ar` não é linha da grade.** É um escalar à parte que reduz a categoria Ordinário inteira de uma
vez. **`Ae(Ordinário, N)` não existe — é `Ar N`** (D67). Se o parser encontrar isso em algum item,
é erro de escrita, não uma variante.

🟡 **"Gelo" × "Frio":** a ficha física usa Gelo, o sistema usa Frio. São o mesmo tipo (o Notion
chegou a listar `Fogo; Frio; Gelo` na mesma linha, o que é o próprio erro se denunciando). Vale
**Frio**, com `gelo` como alias.

### C19 — `Ae(5, todos)` da Carne de Pedra · **DECISÃO: a ordem está invertida; o valor, deixe**

O formato canônico é `Ae(Tipo, N)` e o próprio Notion exemplifica com categoria:
*"Ex.: Ae(Místico, 2), ao receber 10 de dano místico, recebe apenas 8."*
→ `Ae(5, todos)` deve ler-se **`Ae(Todos, 5)`**.

Sobre o **5**: na escada da D67, `Ae(Todos)` vale 1 no Incomum, 2 no Exótico e 3 no Luxária. Cinco
está acima do teto de item. Mas se Carne de Pedra é carta rara do Limiar, a **D8** diz que carta
rara é absurda de propósito e é o teto legítimo. → **Corrija a ordem, não toque no número**, e
sinalize ao Pedro.

### C20 — Reset do Fluxo · **DECISÃO: a segunda cláusula é texto morto**

> "Ao fim do combate, se passar 1 rodada sem ganhar Fluxo ou receber dano, você perde todo seu Fluxo"

Dá para provar que a cláusula da rodada nunca dispara, usando a própria lista de ganhos do Monge:

| Ganho de Fluxo | Frequência |
|---|---|
| acerto corpo a corpo | até 2×/rodada |
| esquivar ou bloquear | 1×/rodada |
| aplicar condição | — |
| **mover-se** | **1×/rodada** |

**Mover-se dá Fluxo.** Um Monge que não ganha Fluxo numa rodada é um Monge que não atacou, não
esquivou, não aplicou condição **e não andou** — e ainda assim não levou dano. Isso é um turno
em que o jogador passou a vez.

→ `zeraEm: ["fimCombate"]`, e só. Recomendo ao Pedro reescrever a frase como
*"Fora de combate, você perde todo o Fluxo após 1 rodada sem ganhá-lo nem receber dano"* — ou
simplesmente apagar a segunda metade, porque o `fimCombate` já faz o trabalho.

### C21 — Schema × código · **é seu, mas um ponto é bug**

Fica com você, como você mesmo disse. Registro um só:

🔴 **`resistencias` com `additionalProperties: false` sem `ae`, enquanto o código grava `ae`.**
Isso não é estilo: todo import validado vai **descartar o Ae em silêncio**. E a grade vai crescer
de 12 para 14 tipos (C18) de qualquer forma, então é hora de mexer.

---

## 3. Respostas (P01–P59)

### Recursos

**P01 — V/G/R · CANÔNICO · ok.**

Confere, e há uma propriedade que vale conhecer: **toda classe distribui exatamente 15 pontos**.
É orçamento fechado (D19), não coincidência — se uma classe nova não somar 15, é bug.

| Classe | V | G | R | Σ |
|---|---|---|---|---|
| Brutalista | 8 | 4 | 3 | 15 |
| Espadachim | 6 | 6 | 3 | 15 |
| Monge | 5 | 5 | 5 | 15 |
| Alquimista | 4 | 6 | 5 | 15 |
| **Artilheiro** | **4** | **7** | **4** | 15 |
| **Batedor** | **4** | **7** | **4** | 15 |
| Teurgo | 3 | 3 | 9 | 15 |

Bases **10 / 8 / 6** valem para as sete, sem exceção.

⚠️ Batedor e Artilheiro têm **coeficientes idênticos** e a mesma família de arma. Isso é um dos
quatro problemas que o rework do Batedor (D79) tem que resolver. Se você guardar V/G/R por classe
num objeto, vai ser fácil trocar quando eu fechar o rework.

📌 **Classe em desenho, para você já reservar lugar:** Vampiro (D24) = **6 / 5 / 4**,
CD `10 + maior(mod.FOR, mod.DES) + mod.INT`.

**P02 — `maior` · PEDRO DECIDE.**

Recomendo `maior` para `mod.FOR|mod.DES` (Stamina) e `mod.INT|mod.SAB` (Éter).

Motivo: `escolhaFixa` cria uma armadilha sem saída. Khalkaria não tem regra de respec, os
atributos só se movem pela carta `+2 Atributo` do Limiar, e a escolha seria feita no nível 1 —
antes de o jogador saber o que a classe faz. Um jogador que escolhe errado carrega o erro cinco
níveis. `maior` dá o mesmo resultado para quem escolheria certo e não pune quem não sabia.

Bônus: `maior` não guarda estado, então não tem como dessincronizar na ficha.

**P03 — Pipeline do máximo · DECISÃO.**

```
1. base                       10 / 8 / 6
2. + coeficiente × nivel      V/G/R  (aqui entra Escravo: V+1 — ver P05)
3. + mod × nivel              escolha(mod.A, mod.B)
4. + bônus fixos              Rokhan +10 Saúde, Skal'ri +5 Éter, Andarilho +10 Stamina,
                              Sangue Morto +5/+5, Difusão de Éter −10,
                              Vigor Místico +5 × nivel
5. + bônus rolados            valor guardado por fonte (ver P04)
6. × percentuais              Sacrifício Vivo ×0,5
7. − reduções permanentes     Armadura de Kha −8 Éter, Vytália −1/−2/−3,
                              Selo do Oblívio (atributo), Exigente (acumulado),
                              Cometa do Mártir (acumulado)
8. − reduções por condição    Desnutrido −10 × X
9. floor, depois max(0, …)
```

**Arredondamento: `floor`, uma vez, no fim.** Só a etapa 6 produz fração; arredondar no meio
acumula erro sem ganhar nada.

**Por que percentual (6) antes de redução permanente (7):** *Sacrifício Vivo* corta pela metade o
máximo que você **teria**; *Armadura de Kha* é uma dívida fixa de 8 Éter. Se a dívida viesse antes
da metade, ela custaria efetivamente só 4 — a carta de trade-off ficaria **mais barata** para quem
pegou a carta mais punitiva. Inverte o incentivo.

**Por que condição por último (8):** é reversível. A ficha precisa poder tirar Desnutrido sem
refazer a história inteira do personagem.

**P04 — `rolaUmaVez` · DECISÃO, com duas exceções que não são rolagem.**

| Fonte | Modo |
|---|---|
| Reservas Profundas `+2d6+8` Stamina | `rolaUmaVez` |
| Poço Arcano `+2d6+8` Éter | `rolaUmaVez` |
| Sangue Espesso `+2d10+5` Saúde | `rolaUmaVez` |
| Pulmões Titânicos `+3d12+8` Saúde | `rolaUmaVez` |
| **Cometa do Mártir `−1d6` Éter máx** | **`rolaPorUso`, acumula** |
| **Exigente `−1` ao falhar criticamente** | **`acumuladorPorEvento`, não é rolagem** |

Guarde o **valor rolado**, não a fórmula — senão o máximo muda toda vez que a ficha recarrega.

As duas últimas não são bônus de máximo: são **dívidas que crescem durante a campanha**. O Cometa
é trade-off de magia de Nível 5, cobrado a cada conjuração; Exigente dispara em falha crítica.
Modele-as como uma lista de lançamentos com data, não como um número — o jogador vai querer saber
de onde veio.

**P05 — `V+1` e `+5×nivel` · CANÔNICO (D19).**

- **Escravo "+1 Vitalidade" → `V + 1`.** Vitalidade **é** o coeficiente (D19: *"Vitalidade/Vigor/
  Ressonância são COEFICIENTES, não status"*). Então é +1 Saúde por nível: +1 no nível 1, +5 no
  nível 5. É por isso que o termo existe — se fosse +1 fixo a origem teria escrito "+1 Saúde".
- **Vigor Místico "+5 Saúde por nível" → `+5 × nivel`.** No nível 5, +25.

⚠️ Vale notar a escala: a corrupção dá **cinco vezes** o que a origem dá (+25 contra +5 no nível 5).
Não vou mexer — corrupção do Corrompido costuma ter contrapartida —, mas registro para o Pedro.

**P06 — `{ aoReduzirMax: 'corta', aoAumentarMax: 'somaDiferenca' }` · DECISÃO.**

- **Reduziu:** `atual = min(atual, novoMax)`. Sem isso a ficha exibe estado ilegal.
- **Aumentou:** `atual += (novoMax − velhoMax)`. É o comportamento certo no level-up (você ganha o
  ponto de vida na hora) e o único que não é explorável: `enche` transformaria subir de nível numa
  cura total grátis; `mantem` puniria quem sobe de nível no meio da masmorra.
- Bônus: a simetria faz o Desnutrido funcionar sozinho. Comer devolve exatamente o que a fome
  tirou, sem regra extra.

🔴 **Cuidado com uma interação que só aparece quando você implementa:** Exaustão 4 divide os
atributos pela metade (P28), o que derruba CON, o que derruba a Saúde máxima, o que sob `corta`
fatia a Saúde atual. Se `corta` pudesse empurrar o personagem abaixo de `−máx/2`, **a Exaustão 4
mataria na hora**, sem dano nenhum. → **`corta` grampeia em `max(0, novoMax)`.** Morte só vem de
dano, nunca de recálculo de máximo. Esse grampo é obrigatório.

**P07 — Limites por recurso · CANÔNICO + DECISÃO.**

| Recurso | Mínimo | Gasto voluntário sem saldo | Por quê |
|---|---|---|---|
| **Saúde** | `−floor(max/2)` → morte | n/a | Notion: *"morre ao passar de −50% da vida máx"* |
| **Stamina** | **0** | **proibido** | Nada no cânone descreve Stamina negativa. *Exaurido* (0 Stamina, "não pode rolar perícias") **é** o piso punitivo. Permitir negativo cria recurso infinito sem consequência escrita. |
| **Éter** | `−floor(max/2)` → o personagem vai para o mestre | **proibido** | *Oco* diz explicitamente *"Não canaliza magias"* |

🔑 **A distinção que importa e que o pedido não separa: gasto voluntário × perda involuntária.**

- **Voluntário** (conjurar, usar técnica) trava em 0.
- **Involuntário** atravessa o 0 e vai a negativo. São só três fontes, todas escritas:
  o −5 de Éter do próprio *Oco* a cada perícia falha, o dobro de Éter da falha do **Transbordante**,
  e o dano que leva a Saúde a negativo.

Sem essa separação, o *Oco* é impossível de modelar: ele descreve um personagem operando em Éter
negativo, mas proíbe conjurar. As duas coisas só convivem se o gasto e a perda tiverem regras
diferentes.

**P08 — Temporários · 🔴 LACUNA REAL + DECISÃO.**

Busquei "temporár" na página Sistema: **zero ocorrências**. Saúde temporária existe só como efeito
solto de item e de técnica, sem regra geral. É lacuna de verdade.

Recomendação (**PEDRO DECIDE**):

```
recursos        : ["saude", "stamina"]      (não existe Éter temporário no conteúdo)
consumidoAntes  : true
acumula         : "maior"
expira          : ["duracaoPropria", "descansoLongo", "fimCombate"]
```

**`maior`, não `soma`.** As fontes já são grandes: Monge/Alquimista `+20 Saúde` e `+10 Stamina`,
companheiros com 20/25/35. Somar duas delas num personagem de ~55 de Saúde no nível 5 mais que
dobra a vida efetiva por um combate.

🔑 **Já existe o modelo certo no sistema, e recomendo o Pedro generalizar a partir dele:**
o **Sangue** do Vampiro (D24) é Saúde temporária acima do máximo, com **teto explícito**
`5 + (3 × Nível)`. Pool nomeado com teto declarado é o desenho que funciona. Se a regra geral de
temporários nascer com a forma do Sangue, o Vampiro entra sem caso especial.

**P09 — `{ curaPassaMax: false, atributoCuraItem: 'usuario' }` · DECISÃO.**

- Cura não passa do máximo. Nada no cânone abre exceção, e quem quer ultrapassar usa temporário —
  é para isso que temporário existe.
- **O `+Int` é de quem usa o item, não de quem recebe.** É a leitura que funciona nos dois casos:
  a Poção de Cura que você bebe (usuário = alvo) e o Kit de Trauma que você aplica no aliado
  caído — que **não pode** usar o Int do inconsciente. Efeito colateral bom: um personagem focado
  em INT vira um curandeiro melhor, o que casa com Medicina ser perícia de INT.

### Recurso de classe

**P10 — Tabela confirmada, e a estrutura precisa ser mais geral que "um por classe".**

| Classe | Recurso | Máximo | Início |
|---|---|---|---|
| Monge | Fluxo | 5 | 0 a cada combate |
| Batedor | Instinto | 5 | 0 a cada cena |
| Brutalista | Brutalidade | 5 | 0 a cada combate |
| Artilheiro | Concentração | `3 + mod.SAB` | 0 a cada combate |
| Alquimista | Reagentes | `(nivel × 3) + mod.INT` | cheio |
| Espadachim | *Marca do Duelo* (estado, 1 alvo) | — | — |
| Teurgo | — (só Éter e Escolas) | — | — |

**Sobre os contadores extras que você listou: sim, e não são exceção — são a regra.**
Venenos do Cobra (2/curto, 5/longo), companheiro com Saúde própria, estoque oculto do Alquimista
`(Nível × 3) + (2 × Mod.INT)`. Todos são **contadores que pertencem a uma técnica**, não à classe.

→ Modele **dois níveis**: `classes.<id>.recursos[]` (o principal, que a classe inteira usa) e
`itens.<id>.contador` (o que uma técnica específica traz consigo). Assim Vigário, Vampiro,
Necromante e Xamã caem no molde sem você mexer no schema de novo — que é exatamente o que a
**D79** manda o rework do Batedor produzir.

**P11 — `gasto` × `requisito` · CANÔNICO onde há texto, DECISÃO no resto.**

| Recurso | Modo | Fonte |
|---|---|---|
| **Fluxo** | `requisito` | o próprio texto: *"o custo em técnicas é apenas requisito, não é gasto"* |
| **Brutalidade** | `gasto` | *"Gastar tudo recupera xd4 Stamina"* |
| **Reagentes** | `gasto` | consumo de fabricação |
| **Instinto** | `gasto` | a lista tem custos escalonados (2/3/4/5), o que só faz sentido gastando |
| **Concentração** | **misto → por técnica** | ver abaixo |

**A Concentração é o caso difícil e merece cuidado.** Ela *"soma sempre ao ataque"* — é um bônus
permanente enquanto você a tem. Mas *Tiro na Cabeça* fala em *"ponto de Concentração gasto"*.
Um recurso que buffa passivamente **e** é gasto é desenho forte (você escolhe entre mirar melhor
ou disparar o truque), mas **cada técnica tem que declarar qual dos dois faz**. Hoje não declaram.

→ **Para a ficha:** `requisito` como padrão, `gasto` quando o texto disser "gasta".
→ **Para o sistema:** entra na mesma fila do C15. É item do rework.

**E a regra que vale para todos:** **nunca bloqueie a técnica cujo custo passa do máximo.** Mostre
desabilitada, com o motivo. Ver C15.

**P12 — `['fimCombate']` · DECISÃO.** Ver C20: a segunda cláusula não dispara.

**P13 — `botaoLivre` com limite assistido · DECISÃO.**

Nem um nem outro puro. O botão `+1` **conhece** o limite e fica apagado quando o limite se esgotou,
mas o jogador sempre pode forçar.

Motivo: os gatilhos são adjudicados na mesa, não calculados. "Aplicar condição" dá Fluxo — o mestre
é quem diz se aquilo contou. "Sucesso em perícia, 1× por perícia por cena" exige que a ficha saiba
quais perícias você já usou nesta cena, o que só funciona se ela vir *todas* as suas rolagens.
Trava dura aqui transforma a ficha em adversário do mestre.

Limite assistido dá 90% do valor (o jogador não esquece que já usou) sem nenhum dos custos.

### Derivados

**P14 — Evasão Ativa.** Ver **C01**. Fórmula:

```
evasaoPassiva : "10 + mod.DES"                    fonte: Notion 2b76e3a4 › Defesa › Evasão Passiva
evasaoAtiva   : "evasaoPassiva + dado(defender)"  fonte: Notion 2b76e3a4 › Defesa › Evasão ativa
custo         : 1 reação
escopo        : todos os ataques daquele agressor naquele turno
dadoDefender  : ["1d6","1d8","1d10","1d12","2d8"] por grau — sem modificador de atributo
```

**D20** fecha o resto: **Evasão Passiva é `10 + Mod.DES` nas sete classes.** Os valores diferentes
por classe que algumas páginas ainda mostram (Monge 15, Batedor 12, Alquimista 12, Artilheiro 11)
estão desatualizados e o Pedro já tem a correção na fila.

**P15 — `{ alvo: 'pericia.defender', valor: +2, duracao: 'inicioProximoTurnoProprio', acumula: false }` · CANÔNICO + DECISÃO.**

O Notion escreve *"Defender (1 ação) → +2 Defender até seu próximo turno"*. O alvo é a **perícia**
(a rolagem), não a Evasão. Somar direto na Evasão seria um buff incondicional; somar na rolagem só
vale se você realmente gastar a reação defendendo.

`acumula: false` é **DECISÃO** — nada diz. Recomendo não acumular, e recomendo por um motivo que
vale a pena o Pedro olhar: **essa ação já é fraca.** Você gasta 1 das suas 3 ações, no seu turno,
para melhorar em +2 uma reação que talvez nem aconteça (depende de alguém te atacar antes do seu
próximo turno). Deixar acumular convidaria a gastar 2 ou 3 ações nisso, o que é pior ainda. Melhor
fechar a porta do que deixar a armadilha aberta.

**P16 — CD.** Ver **C12** para a tabela. `modoEscolha: "maior"` no Espadachim (mesmo argumento do
P02). `cdUnica: true` por **D57**.

**P17 — `floor((attr − 10) / 2)`.** Ver **C13**. 🔴 **Sem referência no Notion — é a lacuna mais
grave da lista.** Precisa de bloco novo, não de linha no CLAUDE.md.

**P18 — Ordem do Movimento · DECISÃO.**

```
1. base da raça                  Anão 7,5 · Humano/Autômato/Corrompido/Gruto 9 · Dryad 10,5
                                 Inseto: Besouro 7,5 · Louva-a-Deus 9 · Barata 10,5
2. + somas fixas                 Skal'ri +1,5 · Suspensões +3 · Pernas Incansáveis +3
                                 Passos do Vento +3 · Acelerar +3 · Lento −3 · Passo Trêmulo −3
3. × multiplicadores             Sobrepeso Leve ×½ · Exaustão 3 ×½ · Sem Membro ×½ · Explosão ×2
                                 (multiplicam entre si)
4. = fixos                       Caído 1,5 · Sobrepeso Extremo 1,5 · Enraizado 0 · Exaustão 4 = 0
                                 → vence o MENOR fixo, e ele sobrescreve tudo acima
5. max(0, …)
6. arredonda para baixo ao múltiplo de 1,5 m
```

- **Fixo vence tudo** e, entre fixos, vale o menor. É a única regra não arbitrária quando alguém
  está Caído (=1,5) e Enraizado (=0) ao mesmo tempo.
- **O arredondamento é necessário**, não cosmético: todos os valores base e somas são múltiplos de
  1,5, mas `10,5 × ½ = 5,25` não é. Uma Dryad com Sobrepeso Leve produz a única fração do sistema.
  Arredondar para baixo (4,5) mantém a grade limpa. **PEDRO DECIDE**, impacto baixo.

**P19 — Armadura · CANÔNICO + LACUNA de estrutura de dado + um número que ele precisa ver.**

**De onde vem o Ar:** o CSV não tem coluna — o valor está **dentro do texto de `Efeito`**, na forma
`Ar N` e `Ae(Tipo, N)`. A gramática é fechada e conhecida (D63/D64/D67), então dá para extrair com
confiança. **Eu posso te entregar isso parseado**, com Ar e Ae em coluna própria para as 50
armaduras e os 10 escudos — é o CSV do Bazar, que é meu. Diz se quer que eu rode essa passada.

| Pergunta | Resposta | Selo |
|---|---|---|
| Ar de raça acumula com Ar de armadura? | **soma** (leitura literal; nada diz o contrário) | PEDRO DECIDE |
| Teto de Ar | **nenhum escrito** | LACUNA |
| `Ae` do mesmo tipo de fontes diferentes | **soma** | DECISÃO |
| Armadura ou escudo mexe na Evasão? | **não** (D66: *"Sem +Evasão em armadura"*) | CANÔNICO |

🔴 **O número que o Pedro precisa ver antes de decidir o teto.** Se Ar soma, o pior caso realista é
um **Anão Caxon (Ar 3 natural) com armadura Pesada Luxária (Ar 8, teto da D64) = Ar 11**:

| Atacante nv5 | Dano por acerto | Passa com Ar 11 | Redução |
|---|---|---|---|
| Leve Cortante 1d6 + DES+4, sem `+N` | ~7,5 | **0** | **100%** |
| Leve Cortante +2 (3d6) + DES+4 | ~14,5 | 3,5 | 76% |
| Pesada Brutal +2 (4d12) + FOR+4 | ~30 | 19 | 37% |

Ou seja: **Ar 11 torna o arquétipo de arma leve sem upgrade literalmente incapaz de causar dano.**
O que segura hoje é a **D42** (Incomum ignora 3 · Exótico ignora todo o Ar · Luxária ignora Ar e Ae)
e o limite de 1 armadura Pesada equipada. Pode ser suficiente. Mas é a maior pilha defensiva do
sistema e merece uma decisão explícita, não um silêncio.

Recomendo: **soma, com teto 10**, ou **`maior(Ar natural, Ar de armadura)`** se o Pedro preferir
que couro de dragão e pele de anão não se somem. Eu inclino para o teto, porque `maior` faz o Ar
racial do Anão virar letra morta no momento em que ele veste qualquer armadura Incomum.

### Perícias e testes

**P20 — Tabela de perícias.**

| Perícia | Atributos | Modo | Selo |
|---|---|---|---|
| Atacar | FOR, DES | **`porArma`** | CANÔNICO (ver C03) |
| Movimento | FOR, DES | `maior` | DECISÃO |
| Convencimento | DES, INT | `maior` | DECISÃO |
| Enganação | DES, INT | `maior` | DECISÃO |
| Intimidação | CON, FOR | `maior` | PEDRO DECIDE (ver C03) |
| **Religião** | **SAB** | — | **CANÔNICO** (ver C04) |
| Defender | — (dado) | — | CANÔNICO |

O resto segue a tabela do Notion sem divergência.

**P21 — As 3 de Ofício · CANÔNICO.**

| Perícia | Rolagem | Descrição curta |
|---|---|---|
| Ofício(Ferraria) | `1d20 + Mod.INT` | Fabricar **equipamentos**: Arma, Armadura e Escudo. |
| Ofício(Engenharia) | `1d20 + Mod.INT` | Fabricar **bugigangas**: Bugiganga, Munição e Item Mágico. |
| Ofício(Alquimia) | `1d20 + Mod.INT` | Fabricar **consumíveis alquímicos**. Exclusiva do Alquimista (D51). |

As três **exigem treino** (D48 + Notion). Item alquímico continua **comprável por qualquer um** —
o que é exclusivo é fabricar, não possuir.

**O 4º ofício não é perícia de Ofício.** **D73:** *Sobrevivência* é o quarto caminho de obtenção, e
**não tem receita** — o teste **é** a obtenção (`Obtenção = Sobrevivência CD N · <Região>`). Cobre
comida, água, ervas e colheita. A ficha não precisa de campo novo: já tem Sobrevivência.

**P22 — Tags por perícia · DECISÃO.**

| Tag | Perícias | Quem consulta |
|---|---|---|
| **`fisica`** | Atacar, **Defender**, Movimento, Fortitude, Reflexos, Furtividade, Crime, Iniciativa, Intimidação | Sobrepeso Leve (−2), Envenenamento (−2), Exaustão 1 (desvantagem), Desnutrido (desvantagem), Sobrepeso Extremo (desvantagem) |
| **`social`** | Convencimento, Intimidação, Enganação, Motivar | Enfeitiçado (−5 contra quem enfeitiçou) |
| **`resistencia`** | Fortitude, Vontade, Reflexos | Inconsciente e Paralisado ("toda resistência falha automaticamente") |

Três observações que evitam bug:

1. **A tag `fisica` é derivada do atributo base** (FOR/DES/CON), que é como as condições escrevem:
   *"−2 em perícias de FOR/DES/CON"*. Mas **Defender não tem atributo** (é dado puro). Entra na
   tag por decisão explícita — é a coisa mais física do jogo e ficar de fora seria acidente.
2. **Intimidação está em duas tags.** Não é erro: ela é social por função e física por atributo.
   Tag é lista, não enum.
3. **Defender NÃO é `resistencia`.** É defesa ativa. A diferença importa: Paralisado falha
   automaticamente em toda resistência, mas nem chega a rolar Defender (não tem reação).

**P23 — `manual` agora, `calculada` como meta · DECISÃO de escopo.**

Calcular exige dado estruturado de 259 habilidades de classe, 168 cartas do Limiar, 7 raças e 19
origens, tudo em prosa, mais a regra de empilhamento (*"duas fontes de Treinado fazem Experiente"*).
É o mesmo trabalho do **P44** — ver lá.

**Meio-termo que entrega quase tudo por quase nada:** o select continua manual, mas ao lado dele a
ficha lista **as fontes da build do jogador que mencionam treinamento**, como checklist.
"Sua origem Acólito concede Treinado em Armas Marciais · Sua técnica X concede Treinado em Atacar".
O jogador aplica. Isso resolve o problema real (esquecer uma concessão) sem precisar de parser
confiável.

**P24 — Vantagem e desvantagem · 🔴 LACUNA REAL.**

Busquei `2d20` na página Sistema: **zero ocorrências**. A mecânica é usada por seis condições, por
superfícies (Grama Alta), por arma sem requisito e pela ação *Esforçar-se* — e **nunca é definida**.
A única definição do repo inteiro é uma carta do Limiar.

**PEDRO DECIDE.** Recomendação:

```
vantagem        : "2d20, fica com o maior"
desvantagem     : "2d20, fica com o menor"
cancelam        : true    — uma de cada se anula
acumulam        : false   — duas iguais continuam 2d20
criticoComUm20  : true    — 20 natural em qualquer um dos dados crita
aplicaDefender  : true    — mas rolando o DADO DE DEFENDER duas vezes, não 2d20
```

- **`cancelam: true, acumulam: false`** é o par que mantém a mesa jogável. Seis condições dão
  desvantagem; se acumulassem, um personagem Cego + Exausto 1 + com arma sem requisito rolaria
  4d20 pegando o menor. Contar pilha é trabalho que ninguém faz direito.
- 🔑 **`aplicaDefender` tem uma sutileza:** Defender não usa d20. Vantagem em Defender significa
  **rolar o dado de Defender duas vezes** (2×1d10 para um Experiente, fica com o maior), não 2d20.
  Se isso não ficar escrito, alguém vai implementar 2d20 em Defender.

**P25 — Crítico e falha · CANÔNICO, com um alerta de colisão de termo.**

Notion, verbatim:

> **Em ordem de regra, quase todas as rolagens utilizam o d20.**
> **Crítico**: Se tirar 20 no dado você críta. (Margem de Ameaça pode aumentar os resultados em que você críta)
> **Falha Crítica**: Se tirar 1 no dado você falha criticamente.
> - Margem de Ameaça: Denota a faixa ao rolar um d20 onde seu ataque é considerado um crítico, por padrão, é apenas ao rolar 20.
> - Multiplicador de Crítico: Denota quão o multiplicador do crítico de uma arma, por padrão, é o dobro
> - **Dano Crítico:** Role o dobro de dados **da arma** + Mod. Atributo da arma;

```
natural20Pericia : "critico"        — não é "sucesso automático"; é crítico
natural1Pericia  : "falhaCritica"
margemPorArma    : true             (padrão 20)
multiplicadorPorArma : true         (padrão ×2)
criticoDobra     : "dadosArma"      — só os dados da arma
```

🔑 **"Crítico" ≠ "sucesso automático".** A regra diz que você *crita*, e o que criticar significa
depende do contexto. Em ataque, dobra os dados. Em fabricação, devolve um material. Não assuma
sucesso automático em perícia — o Notion não diz isso.

🔴 **Colisão de termo que vai te morder:** **crítico tem duas definições no sistema.**

| Onde | Como se determina |
|---|---|
| Regra geral | 20 natural / 1 natural no d20 |
| **Fabricação (D49)** | **margem de ±10 sobre a CD** — *"ficar 10 ou mais abaixo da CD"* / *"superar a CD em 10 ou mais"* |

A ficha **não pode** ter uma função `ehCritico()` única. Fabricação usa a margem; todo o resto usa
o dado natural. E a **D52** acrescenta um terceiro caso: *Alquimia perde os reagentes em qualquer
falha*, crítica ou não.

E o **Bêbado** adiciona um quarto: *"Ao rolar um 2 natural em qualquer teste, considere como uma
falha crítica."* Então a faixa de falha crítica também é modificável, não só a de crítico.

🔑 **`criticoDobra: "dadosArma"`** é o que o texto diz, e é importante: o `+1d4` do Sangramento e
os dados extras de técnica **não** dobram. É também a premissa do modelo de DPR canônico (o
coeficiente 1,20 = 1,05 acertos + 0,15 de dados extras do crítico) — se dobrasse tudo, a régua de
preço do Bazar inteira estaria errada.

### Condições

**P26 — `{ entreCondicoes: 'soma', mesmaCondicao: 'renovaDuracao' | 'somaX' }` · DECISÃO.**

- Condições **diferentes** somam. Bêbado −2 Atacar + Desorientado −2 Atacar = **−4**. Nada no
  cânone sugere "vale a maior", e as condições vêm de fontes deliberadamente diferentes.
- A **mesma** condição reaplicada: se tem X, `somaX`; se não tem, **renova a duração** e não
  empilha o efeito.

⚠️ **O canto afiado, para o Pedro saber que existe.** As penalidades não têm teto. Um personagem
Bêbado + Desorientado + Envenenado + com Sobrepeso Leve rola **Atacar −8**, e ainda com desvantagem
se estiver com Exaustão 1. Contra uma Evasão típica de 13–14, isso é acerto quase impossível.

É a leitura literal e eu não vou inventar um teto. Mas é o lugar onde a espiral da morte mora, e
a ficha vai deixar isso visível pela primeira vez — o que é bom, porque hoje ninguém soma.

**P27 — O X de cada condição · DECISÃO, com uma que precisa mesmo do Pedro.**

| Condição | X é | Inicial | Decrementa | Efeito por X |
|---|---|---|---|---|
| **Lento X** | **duração (rodadas)** | da fonte | fim da rodada | fixo: −3 m e −1 Ação |
| **Descontrolado X** | duração (rodadas) | da fonte | fim da rodada | fixo |
| **Desnutrido X** | **intensidade** | 1 | ver abaixo 🔴 | −10 × X de Saúde máxima |
| **Exaustão 1–5** | nível (não é X) | 1 | descanso longo (−1) | escada própria |
| **Sangramento X** | **pilha** | 1 | ao ser acertado (−1) | ver abaixo 🔴 |

**Lento X = duração, e dá para provar.** O efeito escrito é *"−3 m Movimento, −1 Ação"*, sem X
nenhum. Se X fosse intensidade, Lento 3 seria −9 m e **−3 Ações** — ou seja, o turno inteiro, que
é mais forte que *Paralisado*. Uma condição de Classe S não se esconde sem aviso numa condição de
movimento. X só pode ser duração.

🔴 **Sangramento X — preciso do Pedro, e a diferença é grande.**

O card diz *"qualquer ataque contra ele causa +1d4 Biológico"*. Lido ao pé da letra, o X é só
quantos acertos a marca sobrevive, e chegar a Sangramento 5 não dá **nada** a mais que Sangramento 1.

Mas a **D29** registra o princípio do Pedro sobre essa condição:

> subir de nível de Sangramento é genuinamente difícil porque **todo ataque que acerta remove 1
> marca**, o setup pode ser amplificado *e sabotado* por aliados, e **proeza difícil merece dano
> absurdo**

"Proeza difícil merece dano absurdo" só faz sentido se o dano **escalar**. Com `+1d4` fixo, não há
proeza nenhuma — acumular marcas é puro desperdício.

| Leitura | Sangramento 3, alvo levando 3 acertos na rodada |
|---|---|
| `+1d4` fixo | +7,5 de dano na rodada |
| **`+X d4`** | +22,5 na rodada, e cai para Sangramento 0 |

→ **Recomendo `+X d4`**, coerente com a D29, e **o card precisa ser reescrito** para dizer isso.
**PEDRO DECIDE** — é a decisão de maior impacto em DPR desta lista inteira.

🔴 **Desnutrido — como diminui não está escrito em lugar nenhum.** O card diz que sobe +1 por noite
sem comer e que *"ao chegar a 0 você morre"* (a Saúde máxima chegando a 0, com −10 por ponto).
**Nada diz como baixar.** Recomendo: **comer num descanso longo remove 1**, espelhando a Exaustão.
**PEDRO DECIDE.**

**P28 — Exaustão · DECISÃO + um grampo obrigatório.**

```
cumulativa    : true
metadeAtributo: "atributo"    — divide o ATRIBUTO, não o modificador
arred         : "floor"
recalculaMax  : true
```

- **Cumulativa**: "Descanso longo remove 1" só faz sentido numa escada.
- **Divide o atributo**, porque é o que o texto diz (*"atributos reduzidos pela metade"*), e porque
  dividir o modificador seria quase inócuo. FOR 16 → 8 → mod **−1**. É devastador, e devia ser:
  Exaustão 4 é um degrau da morte.
- **`recalculaMax: true`** com todo o efeito dominó: CON cai → Saúde máxima cai → CD cai → Evasão
  cai (DES) → Movimento também já é 0 pela própria Exaustão 4.

🔴 **O grampo, de novo (é o mesmo do P06 e é obrigatório):** a queda de CON derruba a Saúde máxima
pela metade; sob `aoReduzirMax: 'corta'` isso fatia a Saúde atual. **Sem grampear em
`max(0, novoMax)`, a Exaustão 4 pode empurrar o personagem abaixo de `−máx/2` e matar na hora,
sem dano nenhum.** Morte vem de dano, nunca de recálculo.

**Exaustão 2, "causa metade do dano":** aplica no dano **final**, depois de dados e modificadores,
com `floor`. É o dano que você causa, não o que recebe.

**P29 — Atordoado · DECISÃO.**

```
efeitos : [ {alvo:"acoes", op:"soma", valor:-2},
            {alvo:"evasao", op:"soma", valor:-2} ]
duracao : {ate: "inicioProximoTurnoAfetado"}
```

- **−2 Ações e −2 Evasão**, não "perde a Evasão". O `−2` distribui sobre os dois. Perder a Evasão
  inteira colocaria Atordoado acima de *Paralisado*, e o próprio site já lê `−2` (a lista de
  modificadores de Evasão traz "Atordoado e Enjoado −2").
- **A duração conta a partir do afetado, não da rodada.** "Até a próxima rodada" lido como "até o
  contador de rodada virar" faria Atordoado durar quase nada em quem age por último na iniciativa
  e um turno inteiro em quem age primeiro — mesma condição, preço diferente por sorte de iniciativa.
  A **D32** já abriu o precedente com *Desorientado dura 1 turno*. Mesma forma aqui.

**P30 — Duração padrão · CANÔNICO (D16) + pendência já registrada.**

A **D16** responde: *"Toda condição aplicada por item declara quando expira. Padrão: até o fim da
próxima rodada."*

→ `duracaoPadrao: "daFonte"`, e quando a fonte cala, **"até o fim da próxima rodada"**.

E a lista da sua P30 é quase exatamente a lista de pendência que eu já tenho aberta na D16 —
**11 condições sem regra de expiração no cânone**: `Lento X · Cego · Surdo · Enraizado ·
Amedrontado · Bêbado · Paralisado · Inconsciente · Oco · Desnutrido X · Sobrepeso Leve/Extremo`.
Está na fila do Pedro. Três já saíram: Desorientado (1 turno, D32), Confuso (ganhou "gaste 1 ação
para se livrar") e Desprevenido (vem de Furtividade e acaba com ela).

**P31 — `derivadas`, com Exposto como exceção · DECISÃO.**

```
Morrendo     ⇒ Inconsciente          derivada
Desprevenido ⇒ Exposto               SEPARADA
Paralisado   ⇒ Exposto               SEPARADA
Adormecido   ⇒ Exposto + Inconsciente  Exposto separada, Inconsciente derivada
```

**Por que Exposto tem que ser separada.** Exposto tem gatilho de remoção próprio:
*"O primeiro ataque que acertar essa criatura é crítico. Remove ao acertar."* Se ela fosse derivada
de Paralisado, seria **reaplicada continuamente** enquanto o alvo estivesse paralisado — e então
**todo ataque contra um paralisado seria crítico**. Isso é muito além de "morte funcional".

→ Regra: **Exposto é concedida uma vez, ao entrar no estado, e é consumida pelo primeiro acerto.**
O alvo continua Paralisado e deixa de estar Exposto. **PEDRO DECIDE**, mas a alternativa não é
jogável.

**P32 — Entrada e saída das críticas · DECISÃO, com um buraco real a tapar.**

| Condição | Entra | Sai |
|---|---|---|
| Morrendo | `saude <= 0` | `saude > 0` (curado até vida positiva) |
| Inconsciente | derivada de Morrendo | com ela |
| **Exaurido** | `stamina == 0` | **`stamina > 0`** |
| **Oco** | `eter <= 0` | **`eter > 0`** |

🔴 **A leitura literal de Exaurido tem um buraco.** O card diz *"Encerra em qualquer descanso"*.
Mas o descanso recupera **2 status à escolha**. Se o jogador escolher Saúde e Éter, ele sai do
descanso com **0 de Stamina e sem Exaurido** — e o gatilho de entrada (*"ao reduzir a 0"*) não
dispara de novo, porque ele já está em 0 e não vai "reduzir". Resultado: 0 de Stamina, sem
penalidade, para sempre.

→ **Recomendo `sai: stamina > 0`**, tratando "encerra em qualquer descanso" como o modo normal de
sair, não como a condição de saída. Mesma forma para Oco. **PEDRO DECIDE.**

**Sobre o `<` × `≤`:** ver **C14**. Recomendo padronizar nos dois.

**P33 — Lista fechada.** Ver **C16**. Resumo: **29 cards + aliases**, três promoções a escrever
(`Agarrado` — que já tem efeito definido na manobra —, `Marcado` e `Marcada à Morte X`) e três
que **não** entram (`Terreno Difícil` é superfície, `Vulnerável` é camada da grade de dano,
`Dissipado` é estado de magia).

**P34 — Taxonomia.** Ver **C17/C34**. Dois eixos separados: `grupoUI` (os 6 do site) e `tags[]`
(mecânicas, do Limiar). A lista de "condições mentais" não existe e precisa do Pedro.

**P35 — Sim, dobra · CANÔNICO + DECISÃO de ordem.**

*Desnutrido* — *"Você gasta o dobro de Stamina para tudo"* — é multiplicador global. A ficha aplica
sozinha.

**Multiplicadores globais de custo que existem hoje:**

| Fonte | Alvo | Fator |
|---|---|---|
| Desnutrido | Stamina | ×2 |
| Mente Fraca | Éter | ×2 (+100%) |

**Ordem:** `custoFinal = max(piso, (base + ajustes fixos) × Π multiplicadores)`, com `floor`.
Como os dois atingem recursos diferentes, hoje não interagem. Mas a ordem precisa estar escrita
para quando um terceiro aparecer.

### Ações e turno

**P36 — Ações, reações, livres e casts.**

```
acoes                : 3        CANÔNICO
reacoes              : 1        CANÔNICO, + bônus (Esquiva Lendária +1)
moverMaxPorTurno     : 1        CANÔNICO
penalidadeConsecutiva: -5       CANÔNICO — e conte POR ALVO (D29)
acaoLivreMax         : null     LACUNA — recomendo não criar limite
conjuracoesPorTurno  : null     LACUNA — ver abaixo
escopo               : "turno"
```

**Ação Livre:** não existe na lista de *Sua Rodada*; a palavra só aparece dentro da modulação
*Acelerar* (`3→2→1→Reação→Ação Livre`). **Recomendo não inventar limite numérico.** O sistema já
limita ação livre pelo **recurso**: *Sangue por Aço* custa Saúde, *Oportunista* 5 Stamina,
*Presságio* Éter, os efeitos de arma 2–3 Stamina. O recurso é o contador. Criar um teto de "N
ações livres por turno" adiciona uma regra nova para resolver um problema que já está resolvido.

🔴 **"1 cast por turno" — regra fantasma.** A magia *Projétil* diz que **ignora** essa regra, e a
regra **não existe na página Sistema**. Uma magia referenciando uma regra inexistente é buraco de
cânone, não detalhe. **PEDRO DECIDE**, e eu acho que a regra provavelmente existe e caiu: sem ela,
3 ações viram 3 truques de Nível 1 a 0 Éter cada. Fiz a conta, e é menos assustador do que parece
(3× Centelha no nível 5 = 3d4 automáticos ≈ **7,5 por turno, para sempre, de graça**, contra a
referência de DPR de 18–25) — é um piso infinito, não um pico. Mas piso infinito é exatamente o
tipo de coisa que corrói um sistema de atrito, e *Projétil* achou que valia mencionar.

**Reação extra:** `reacoesMax = 1 + bônus`. Com a regra de retaliação (*"a criatura pode escolher
reagir a cada um deles; ao final do seu turno, ela considera a reação gasta"*), uma reação já cobre
**todos** os ataques de **um** agressor. A segunda reação, portanto, serve para **um segundo
agressor** — não para mais ataques do mesmo.

**P37 — `{ descontoPor: 'combate', unidadesPorSlot: 10 }` · CANÔNICO.** Ver **C10**.

Sim: **botão "Iniciar combate" desconta 1 munição** do tipo equipado. E lembre que munição
especial é **buff de cena**: o efeito vale em todos os ataques até o fim do combate, por 1 unidade.
É a mecânica mais subestimada do Bazar.

### Magia

**P38 — Tabela nível × intensidade · CANÔNICO (base) + DECISÃO (piso).**

| Nível | Contida | Normal | Forçada | Transbordante |
|---|---|---|---|---|
| **1** | **não existe** | **0** | 2 | 4 |
| 2 | **1** (piso) | 2 | 4 | 6 |
| 3 | 2 | 4 | 6 | 8 |
| 4 | 4 | 6 | 8 | 10 |
| 5 | 6 | 8 | 10 | 12 |

- **Nível 1 não tem Contida** (D68). São **três barras** nas descrições dos truques, não quatro.
  ⚠️ Isso quebra a "regra das 3 barras" do CLAUDE.md §6, que manda expandir 3 valores para 4
  repetindo o primeiro. **Para o Nível 1 isso está errado** — a coluna Contida não deve existir.
- **Nível 2 Contida = 1** pelo piso. Ver **C06** para o porquê.
- 🔵 Duas habilidades ficam órfãs porque dependem de Contida: *Éter Residual* e *Magias Pactuadas*
  ("Contida = 0 éter"). Continuam funcionando do Nível 2 para cima; só nunca disparam em truque.
  O jogador vai perguntar — vale uma nota na página.

**P39 — Ordem do custo de Éter · DECISÃO.**

```
1. base por nível                      0 / 2 / 4 / 6 / 8
2. + intensidade                       −2 / 0 / +2 / +4
3. PISO DA CONTIDA = 1                 ← só incide aqui, e só no Nível 2
4. + soma das modulações               D69: truque paga preço cheio
5. × multiplicadores                   Mente Fraca ×2
6. − descontos fixos                   Escola Visceral −2 · Patrono O Limiar −1 (abjuração)
                                       Canalização Eficiente −1 por 2 Stamina
7. PISO FINAL = 0                       max(0, …)
```

```
minimoAplicaEm : { contida: "parcela(base+intensidade)", final: "total" }
modulacoesNiveis : [1,2,3,4,5]
```

**Por que desconto depois de multiplicador (6 depois de 5):** se o desconto viesse antes, a *Mente
Fraca* dobraria um custo já descontado — e cada ponto de desconto valeria **o dobro** justamente
para quem carrega a maldição. Desconto é dinheiro no bolso do jogador; aplica por último, o mais
perto possível da carteira.

**Sobre as modulações em truque:** **D69** — *"modulação em truque mantém o preço cheio.
Modulação não é pra early game."* Um *Fragmentar* (+3) num truque de 0 Éter custa 3, enquanto a
magia de Nível 2 inteira custa 2. É intencional.

**P40 — `{ base: 'custoTotal', podeNegativar: true }` · DECISÃO.**

*"perde o dobro de éter utilizado"* — **utilizado** é o que você de fato pagou, modulações
incluídas. E sim, pode ir a negativo: é perda **involuntária** (ver P07), da mesma família do −5
do *Oco*.

⚠️ **O número, para o Pedro ver o tamanho da aposta.** Um Teurgo de nível 5 com INT 16:
Éter máximo `6 + 9×5 + 3×5 = 66`.

| Conjuração | Custo | Perda na falha |
|---|---|---|
| Nível 5 Transbordante, sem modulação | 12 | 24 (36% do pool) |
| Nível 5 Transbordante + 2 modulações (+8) | 20 | **40 (61% do pool)** |

Perder 61% do Éter máximo num teste de Vontade CD 15 é brutal — mas é uma aposta que o jogador
escolhe fazer, e a magia é a mais forte do sistema. Registro para ele ver, não para mudar.

**P41 — Sustentada · DECISÃO + LACUNA parcial.**

```
custoPorTurno : "total"     — "o mesmo éter do custo da conjuração", ou seja, o que você pagou
maxAtivas     : 1           — DECISÃO, ver abaixo
foraCombate   : null        — LACUNA, não tenho fonte para "a cada 30 min"
```

A frase da *Sinapsia Coletiva* — *"Conjurar outra magia sustentada … dissipa"* — está escrita de
forma **geral**, dentro de uma magia específica. Recomendo lê-la como regra geral (`maxAtivas: 1`),
porque é o guarda-corpo padrão contra empilhar buffs e porque a alternativa (cada magia sustentada
declarar o seu) significa que hoje **nenhuma** declara. **PEDRO DECIDE.**

O "a cada 30 min fora de combate" não está em nenhuma fonte que eu tenha. Deixo `null`.

**P42 — `{ niveis: 5, custos: [0,2,4,6,8], validarRequisito: 'avisar' }` · CANÔNICO.**

Confirmado direto do Notion hoje (ver seção 0). O schema de 4 níveis é pré-D68.

**`avisar`, não `bloquear`.** O requisito canônico é *Treinado em Místico + Foco da escola
equipado*, mas há builds legítimas que furam: a origem **Cultista** concede 2 magias de Nível 1 e
a raça **Corrompido** também, **sem** exigir o gate. Bloquear quebraria essas duas.

⚠️ **E o aviso tem que ser por Foco, não só por treino:** só se pode empunhar **1 Foco por vez**
(Notion). Um Teurgo com quatro escolas aprendidas só pode conjurar a da escola equipada. Isso é
bom material de aviso na ficha e ninguém lembra na mesa.

### Técnicas, cartas e usos

**P43 — Vocabulário de recarga · CANÔNICO onde há fonte, DECISÃO no resto.**

| Recarga | Zera em | Selo |
|---|---|---|
| `turno` | `fimTurno` | — |
| `rodada` | `novaRodada` | — |
| `combate` | `fimCombate` | — |
| **`cena`** | `fimCombate` **ou** `fimCena` (botão do mestre) | DECISÃO |
| `curto` | `descansoCurto` | CANÔNICO |
| `longo` | `descansoLongo` | CANÔNICO |
| **`dia`** | `descansoLongo` | **CANÔNICO** |
| `sessao` · `semana` · `campanha` · `porLocalizacao` | `manual` | DECISÃO |

**`1x/Dia` volta no descanso longo, e isso é canônico**, não inferência. O Notion diz:
*"O grupo pode fazer até dois descansos curtos e **um descanso longo que finaliza o dia**."*
O descanso longo **é** a virada do dia.

→ Mas **mantenha `dia` e `longo` como enums separados**, porque o inverso não é verdade: um dia
pode passar **sem** descanso longo (é assim que se ganha Exaustão — *"1 dia sem descansar é
tolerado; o segundo → Exausto 1"*). O evento `novoDia` existe sozinho.

**`cena` ≠ `combate`.** Munição gasta "por cena de combate" (D2), e aí coincidem. Mas o Instinto
do Batedor tem *"1× por perícia por cena"*, que cobre perícia fora de combate. Uma cena pode
conter a aproximação furtiva, a negociação e a briga. → Recarrega no fim do combate **ou** quando o
mestre declarar fim de cena.

**`rodada` ≠ `turno`.** "2×/rodada" (Fluxo) conta também os ganhos que acontecem no turno dos
outros — esquivar, ser acertado. "1×/turno" é só o seu. Não unifique.

**P44 — Custo e uso estruturados de cada item · não vou digitar isso à mão, e vou explicar por quê.**

O que você está pedindo são ~259 habilidades de classe + 168 cartas do Limiar + traços de 7 raças
+ 19 origens. Eu **não** vou transcrever isso manualmente, e a razão está no meu próprio protocolo
de verificação: lista digitada à mão a partir do Notion **já falhou** neste projeto — foi assim que
uma carta duplicada do Limiar passou por conferência visual e só apareceu numa comparação por
conjunto. Entregar 450 linhas de custo digitadas por mim seria entregar um dado que eu mesmo não
confiaria.

**O que eu entrego agora** (está no JSON, bloco `vocabulario`): a **gramática**, que é a parte que
só o balanceamento pode definir.

```
custoTipo : "fixo" | "variavel" | "percentual" | "porUnidade" | "reserva" | "requisito"
recurso   : "stamina" | "eter" | "saude" | "reagentes" | "fluxo" | "instinto"
          | "brutalidade" | "concentracao" | "usos"
acoes     : 0 (livre) | 1 | 2 | 3 | "reacao" | "passiva"
recarga   : enum do P43
op        : soma | multiplica | fixa | minimo | maximo | vantagem | desvantagem
          | falhaAuto | semAcao | semReacao | lembrete
```

**O que eu proponho fazer em seguida**, se o Pedro topar: rodar um **parser** sobre
`data/classes/*.json` e `data/limiar.json` com essa gramática, e **validar por conjunto** — toda
habilidade tem que cair em exatamente um `custoTipo`, e o relatório lista as que não caíram, que
são as que precisam de decisão humana. É o mesmo método que usei para fechar o Bazar em 727 itens
com zero erro. As que sobrarem eu levo ao Pedro em lote, no formato que ele já usa
(`Nome | Custo exato | leitura`).

⚠️ **E um aviso sobre as 59 cartas raras:** o `data/limiar.json` **não guarda o efeito delas** —
só nome e requisito. Isso é decisão de design do site (as raras aparecem como ícone + requisito +
nome), mas significa que o parser não tem o que parsear. Para essas, o efeito tem que vir do Notion
primeiro.

**P45 — Passivas com custo · DECISÃO, e é uma leitura que muda o jogo.**

*"Ponto Fraco: 5 Stamina Passiva"* · *"Encadeamento: Passiva • 3 Stamina"* · *"Tese Arcana: Passiva,
2 Stamina"*.

Três leituras possíveis, e só uma faz "passiva" e "custo" significarem algo juntos:

| Leitura | Problema |
|---|---|
| cobra uma vez ao ativar | então não é passiva, é uma ativação que dura o combate |
| cobra por turno | 5 Stamina/turno inviabiliza a técnica |
| **reserva: a Stamina fica comprometida enquanto a passiva está ligada** | nenhum |

→ **Recomendo `custoTipo: "reserva"`**: enquanto a passiva estiver ativa, a Stamina máxima
efetiva do personagem cai naquele valor, e volta ao desligar. É o desenho em que "passiva com
custo" quer dizer *você paga carregando menos combustível*, que é elegante e trackável.
**PEDRO DECIDE** — é interpretação minha, não cânone.

**Custos variáveis:**

| Forma | Tratamento |
|---|---|
| `"2+ Stamina"` | `variavel(min: 2, max: null)` — campo de valor |
| `"X Stamina"` | `variavel(min: 1, max: null)` |
| `"1-5 Éter"` | `variavel(min: 1, max: 5)` — slider |
| `"50% Éter"` | `percentual(0.5, base: "maximo")` — **do máximo**, não do atual; do atual seria paradoxo de Zenão, nunca chega a zero |
| `"5 Stamina/Item"` | `porUnidade(5)` — pergunta a quantidade |

**Momento do desconto:** na confirmação do "usar", com **desfazer** disponível (P58).

**P46 — Tudo `avisar`, nada `bloquear` · DECISÃO.**

| Validação | Regra exata | Ação |
|---|---|---|
| Pontos do Limiar | 4 por nível nos níveis 2–5 = **16 no total**; **por mão**: 1ª carta grátis, depois 2, 3, 4…; a 6ª (+2 Atributo) custa sempre 2; pontos não gastos acumulam | `avisar` |
| Dor do Abismo | gasto ≤ ganho | `avisar` |
| Corrupção por nível | 1:2 · 2:5 · 3:9 · 4:14 · 5:20 | `avisar` |
| Técnicas | `3 + Nível` | `avisar` |
| Tiers | Tier 1 no nv2, Tier 2 no nv4, Tier 3 no nv5 | `avisar` |
| Marcas | 1 no nv3, 2 no nv4, 3 no nv5 | `avisar` |

~~Conta "16 pontos = 6 cartas" removida: estava errada. Ver Revisão 2 no topo.~~

**Por que `avisar` e nunca `bloquear`:** o mestre concede exceções (uma quest, uma carta do Abismo,
um acordo de mesa), e uma ficha que recusa uma build que o mestre autorizou é uma ficha que o
jogador abandona. Aviso claro e persistente resolve o problema real (build inválida por engano)
sem criar o problema novo.

### Descanso

**P47 — Descanso, mecânica da rolagem · CANÔNICO + DECISÃO.**

Notion, verbatim:

> **Descanso Longo (Max. 1 por dia)** — O grupo dorme por no mínimo 8 horas, e recupera Xd8 de 2
> Status a escolha de cada jogador, sendo X o nível de comodidade do descanso.
> **!!** É necessário uma fonte de luz e alimento para cada Jogador. Quem não se alimenta, não se recupera.
>
> **Descanso Curto (Max. 2 por dia)** — O grupo descansa por no mínimo 30 minutos em um lugar
> seguro, e recupera 2d6 de 2 Status a escolha de cada jogador.

```
modo            : "umaPorStatus"        DECISÃO
statusElegiveis : ["saude","stamina","eter"]
acaoSoma        : true
comerStatus     : 1
```

- **Uma rolagem por status.** Mecanicamente é quase indiferente (o valor esperado é o mesmo; muda
  só a variância), mas é como toda mesa lê e remove uma correlação artificial entre dois recursos
  independentes.
- **`statusElegiveis` são os 3 universais**, não o recurso de classe. Fluxo, Brutalidade e
  Concentração **começam em 0 por desenho** — "recuperar" não faz sentido. Reagentes têm regra
  própria (longo devolve todos; curto tem *Buscar Reagentes: 1d4+Nível*).
- **A ação de descanso soma em cima dos 2d6.** É o benefício de escolher bem a ação, e falhar no
  teste (Medicina ou Vontade CD 15) anula **só a ação**, nunca os 2d6.
- **"Comer Refeição: +2d6 de qualquer status"** vai para **1 status** à escolha. "Qualquer" está
  qualificando *qual*, não *quantos*.

**P48 — O que cada descanso faz · DECISÃO, com um número que o Pedro precisa ver.**

**Descanso Curto** (máx. 2/dia, 30 min, lugar seguro):
```
1. +2d6 em 2 status à escolha (rolagem por status)
2. + ação de descanso, se passar no teste:
     Tratar Ferimentos (Medicina CD 15) +1d6 Saúde
     Meditar (Vontade CD 15)            +1d6 Éter
     Relaxar                            +1d6 Stamina
     Comer Refeição (exige Comida)      +2d6 de 1 status
3. Alquimista: Buscar Reagentes 1d4+Nível
4. libera 1 ponto de estresse (opcional — ver abaixo), custando 1d6 Stamina e 1d6 Éter
5. recarrega usos de recarga "curto"
6. encerra Exaurido / Oco se o recurso voltar a > 0
NÃO remove Exaustão. NÃO zera o recurso de classe (ele já zera no fim do combate).
```

**Descanso Longo** (máx. 1/dia, 8 h, **finaliza o dia**):
```
0. exige fonte de luz + 1 alimento por jogador
   "Quem não se alimenta, não se recupera" → corta o Xd8 de quem não comeu.
     Recomendo que corte SÓ a recuperação de status, não o resto (o dia vira igual,
     os usos de "dia" recarregam, a Exaustão baixa). DECISÃO.
1. +Xd8 em 2 status à escolha, X = comodidade 1–5
     ao ar livre: maior Sobrevivência do grupo — <15 / 15-19 / 20-24 / 25-29 / 30+
2. −1 Exaustão
3. libera TODO o estresse, a 1d6 Stamina + 1d6 Éter POR PONTO (opcional — ver abaixo)
4. Reagentes ao máximo
5. recarrega usos "longo" e "dia"
6. redistribui as técnicas gerais ("3 + Nível", reatribuíveis no longo)
7. troca os 3 itens sintonizados
8. 1 tentativa de fabricação (Ferraria/Engenharia) como ação de descanso
9. zera o contador de descansos curtos e avança o dia
```

**Ordem: recuperar primeiro, liberar estresse depois.** Você não pode cobrar um custo que o
personagem ainda não tem.

🔴 **O número que precisa de decisão: o descanso longo pode te deixar pior.**

Com 5 pontos de estresse, a liberação custa **5d6 Stamina + 5d6 Éter ≈ 17,5 de cada**. Um Descanso
Normal (X=3) devolve `3d8 ≈ 13,5` em dois status.

```
Descanso Normal, 5 de estresse:
  recupera  13,5 Stamina + 13,5 Éter
  paga      17,5 Stamina + 17,5 Éter
  saldo     −4 Stamina, −4 Éter   ← e você dormiu 8 horas
```

→ **Recomendo que a liberação de estresse seja OPCIONAL, com o jogador escolhendo quantos pontos
soltar.** **PEDRO DECIDE.** Se for obrigatória, o sistema tem um estado em que descansar é
estritamente pior do que não descansar, e jogador nenhum vai descansar com estresse alto —
o que inverte a função da mecânica.

**P49 — Contadores do dia.**

```
viraDia      : "descansoLongo"        CANÔNICO ("um descanso longo que finaliza o dia")
zeraCurtos   : true, no longo
curtoExigeComida : false              CANÔNICO (só "um lugar seguro")
curtoExigeLuz    : false
estresseMax  : null                   LACUNA
sanidade     : "manual"               LACUNA parcial
```

- **Estresse não tem teto escrito.** Não vou inventar um. Observo que ele **se autolimita na
  prática**, porque o custo de liberação cresce linearmente (ver P48) — passado certo ponto o
  jogador simplesmente não consegue pagar. Se o Pedro quiser um teto, esse é o argumento para
  colocá-lo onde o custo ainda é pagável.
- **Fé/Sanidade é do mestre.** O cânone tem **uma** linha numérica: *ver um aliado morrer → Vontade
  CD 20 ou −2d6+3 Éter*. Use-a como referência visível ao lado de um campo de perda manual. Não
  construa tabela que não existe.

### Dano e mitigação

**P50 — Pipeline de mitigação · DECISÃO.**

```
0. Imunidade ao tipo?        → dano = 0, encerra aqui
1. dano bruto                 dados + mod  (crítico: dobro dos DADOS DA ARMA + mod)
2. Vulnerabilidade ×2  /  Resistência ÷2   (se as duas, cancelam)
3. − Ar          se o tipo for Ordinário (Cortante/Contundente/Perfurante)
   − Ae(tipo) − Ae(categoria) − Ae(Todos)   somando as camadas que se aplicam
4. floor
5. max(0, …)
```

**Por que Resistência antes de Ar:** resistência é propriedade de *como o dano te afeta*; Ar é
*o que ele tem que atravessar*. Metade depois da subtração faria a armadura render o dobro para
quem já é resistente — dois descontos no mesmo eixo. E a ordem inversa produz valores negativos no
meio do cálculo, que depois precisam de grampo. Esta ordem só precisa do grampo no fim.

```
arred     : "floor", uma vez, na etapa 4
minimo    : 0                    DECISÃO
imunidade : "zera"               DECISÃO — não está definida em lugar nenhum
```

**`minimo: 0`, não 1.** O cânone descreve Ar como *"reduz dano ordinário em uma constante fixa"*,
sem piso. E a **D42** (`Incomum ignora 3 · Exótico ignora todo o Ar · Luxária ignora Ar e Ae`)
existe **porque** Ar pode zerar — é a contrajogada. Piso de 1 esvaziaria essa escada inteira.

**Imunidade nunca foi definida no Notion.** "Zera" é a única leitura, mas é `decisao` no JSON.

**P51 — Dano por categoria · DECISÃO, com uma interação que só aparece implementando.**

Mapa categoria → tipos: ver **C18**.

**Regra de qual Ae se aplica ao dano genérico de categoria** (o Morrendo, o Sangramento e o
Envenenamento causam "dano Biológico", sem tipo):

| O personagem tem | Reduz dano "Biológico" genérico? |
|---|---|
| `Ae(Veneno, 5)` | **não** — é tipo específico |
| `Ae(Biológico, 4)` | **sim** |
| `Ae(Todos, 2)` | **sim** |

É a regra que faz a escada da D67 significar alguma coisa: pagar por abrangência tem que comprar
abrangência.

🔴 **Mas veja a consequência, que é grave:** o tique do **Morrendo** é dano Biológico igual a 10%
da vida máxima. Um personagem com `Ae(Biológico, 4)` e 55 de Saúde máxima levaria `5 − 4 = 1` por
rodada. **O relógio da morte praticamente desliga.**

→ **Recomendo que o dano de Morrendo não seja mitigável.** Não é um ataque, é o corpo falhando —
Ar e Ae são armadura, e não há o que blindar. **PEDRO DECIDE**, mas sem isso um item de Ae
Biológico vira quase-imortalidade, que não é o que ele foi precificado para ser.

**Camadas da grade:** `R` (½) · `I` (0) · `V` (×2) · `Ae` (constante por tipo) · `Ae` por categoria
· `Ae(Todos)`. **`Ar` fica fora da grade**, como escalar próprio da categoria Ordinário.

### Morte e limites

**P52 — Morrendo · DECISÃO.**

```
tick             : "floor(recurso.saude.max * 0.1)"
arred            : "floor"                        (55 máx → 5 por rodada)
momento          : "inicioTurnoAfetado"
mitigavel        : false                          ← ver P51
curaDoNegativo   : true                           (−8 + 10 = +2)
desestabilizaSeErrar : false                      (só ao SER ACERTADO)
vidaMaxRef       : "reduzida"
```

- **Início do turno do afetado**, alinhado com *Em Chamas* (*"no início de cada turno"*) e dando
  aos aliados a rodada inteira para agir antes do próximo tique.
- **Cura soma a partir do negativo.** É o que faz a remoção canônica (*"ser curado até vida
  positiva"*) significar alguma coisa. Se a cura partisse de 0, todo Morrendo seria removível por
  1 ponto de cura.
- **"Ser atacado novamente" → recomendo ler como "ser acertado".** Um erro não causa nada, e
  desfazer 2 ações + Medicina CD 20 num ataque que errou é um swing enorme decidido por um dado que
  o médico não pode influenciar. **PEDRO DECIDE**, o texto diz "atacado".
- **`vidaMaxRef: "reduzida"`** — existe **uma** Saúde máxima, a efetiva (já com Desnutrido e
  Exaustão). Duas referências de "máximo" no mesmo card é como nascem bugs.

**P53 — `alertar` em tudo, `travar` em nada · DECISÃO.**

| Estado | Ficha |
|---|---|
| Exaustão 5 | banner permanente, edição livre |
| Desnutrido até Saúde máx 0 | banner permanente, edição livre |
| Saúde < −½ máx | banner permanente, edição livre |
| Éter ≤ −½ máx (vai para o mestre) | banner permanente, edição livre |

O mestre reverte desfecho. A ressurreição existe (**D74**: 1× por personagem, e um revive bloqueia
qualquer próximo). Uma ficha que se tranca sozinha num estado que o mestre pode desfazer é uma
ficha que o jogador vai contornar exportando o JSON e editando na mão — pior para todo mundo.

Banner que não dá para ignorar, tudo editável.

**P54 — `autoNivel: false` · DECISÃO.**

A ficha **avisa** quando o XP cruza 150 / 400 / 1000 / 2000. Quem concede nível é o mestre — XP em
Khalkaria vem por Dc derrotado, e o mestre pode segurar a subida por razão de arco.

| Item do level-up | Automático? |
|---|---|
| Saúde / Stamina / Éter máximos | ✅ recalcula |
| Reagentes máximos (`nivel×3 + mod.INT`) | ✅ |
| Marca do Duelo (nv3 +2/+2, nv5 +3/+3) | ✅ |
| Contagem de técnicas (`3 + Nível`) | ✅ conta, ❌ escolhe |
| Destravar Tier (1→nv2, 2→nv4, 3→nv5) | ✅ sinaliza |
| Contagem de Marcas (nv3/4/5 → 1/2/3) | ✅ conta, ❌ escolhe |
| +4 Pontos do Limiar | ✅ |
| Escolas do Teurgo (2/3/5) | ✅ sinaliza, vem da página da classe |
| Corrupção máxima (2/5/9/14/20) | ✅ atualiza o teto |

🔴 **Um item da sua lista eu não consigo confirmar: "+2 pontos de atributo" por nível.**
A tabela de Progressão do Notion não menciona ganho de atributo por nível. O único `+2 Atributo`
que eu conheço é **a 6ª carta do Limiar**, que custa 2 pontos fixos. Se o site está concedendo +2
de atributo a cada nível a partir de outra fonte, **me diga qual é** — ou é regra que eu não
conheço, ou é coisa que entrou por engano e está inflando todos os derivados do sistema.

### UX de mesa

**P55 — O que rastrear · minha opinião de mesa, que foi o que você pediu.**

O princípio que eu usaria para cortar: **rastreie o que é privado e determinístico; não rastreie o
que é compartilhado e negociado.** O que só depende dos números do personagem, a ficha acerta
sempre. O que depende do que o mestre decidiu, a ficha só pode palpitar — e palpite errado com cara
de autoridade é pior que campo vazio.

**ESSENCIAL** — a ficha digital não se justifica sem isto:

| | Por quê |
|---|---|
| `saudeAtual` `staminaAtual` `eterAtual` | é o produto |
| `recursoClasse` | é a decisão turno a turno da classe inteira |
| **`pmaPorAlvo`** | **o item mais subestimado da sua lista.** −5 cumulativo **por alvo**, zerando ao trocar de alvo (D29). É a regra que a mesa mais erra, é puramente determinística e é a que mais muda um número. Se eu pudesse automatizar **uma** coisa só, seria esta. |
| `condicoesAtivas` com X e duração | muda mais números do que qualquer outra coisa, e é o que mais se esquece |
| `usosPorRecarga` | "eu já usei o *Hoje Não* hoje?" é a discussão nº 1 de mesa |
| `municao` | um número, gasto por cena, invisível até faltar |
| `descansosDoDia` | orçamento duro de 2 curtos / 1 longo, e o longo vira o dia |
| `exaustao` · `desnutrido` | mexem no **máximo**, que cascateia em tudo |
| `estresse` | não existe em lugar nenhum fora da ficha, e cobra caro no descanso |
| `marcaDoDuelo` | 1 alvo, e é o motor inteiro do Espadachim |

**OPCIONAL** — bom, mas a mesa sobrevive sem:

| | Ressalva |
|---|---|
| `temporarios` | real, mas raro — e sem regra geral ainda (P08) |
| `acoesReacaoDoTurno` | ótimo para jogador novo. **Como display, nunca como trava** |
| `efeitosSustentados` | poucas magias, mas caro de esquecer: cobra Éter todo turno |
| `iniciativaDaCena` | o número do próprio jogador basta; a ordem é do mestre |

**RUÍDO** — eu não construiria:

| | Por quê |
|---|---|
| **`rodadaAtual` como contador do jogador** | **A rodada é do mestre.** Cinco fichas com contador próprio vão dessincronizar na primeira vez que alguém perder um turno, e clock dessincronizado é pior que clock nenhum. → Faça a ficha contar **os turnos dela** e expresse toda duração em "turnos seus". Aí é autoconsistente e não precisa de estado compartilhado. |
| enforcement de ação | ver acima: display sim, trava não |

**P56 — Automático × lembrete · por categoria.**

Regra de corte: **automatize o que deriva de um número que a ficha já tem; não automatize o que
deriva de um julgamento na mesa.**

| Categoria | Modo |
|---|---|
| Modificadores, máximos, Evasão passiva, CD, capacidade de carga | **automático** |
| Movimento efetivo com condições | **automático** |
| Penalidade de condição sobre perícia | **automático no total, com detalhamento visível** |
| PMA | **automático** (por alvo) |
| Desconto de custo ao usar técnica/magia | **automático, com desfazer** |
| Ganho de recurso de classe | **lembrete + botão** — o gatilho é adjudicado |
| Aplicar/remover condição | **lembrete** — quem aplica é o mestre |
| Rolagem de descanso | **automático, com desfazer** |
| Estados finais (morte, personagem para o mestre) | **alerta, nunca automático** |

🔑 **Uma regra de interface que vale mais que a decisão automático/lembrete:** **todo número
derivado precisa mostrar de onde veio.** Um jogador que vê `Atacar +5` sem explicação não confia;
um que vê `+3 DES +4 prof −2 Desorientado` confia e ainda aprende o sistema. Automação sem
rastreabilidade gera desconfiança, e ficha em que ninguém confia volta para o papel.

**P57 — `roladorOpcional`, desligado por padrão, construído por último · minha recomendação.**

Três razões, em ordem de peso:

1. **O valor está em dizer o que rolar, não em rolar.** Uma linha
   `Atacar: 1d20 +7 · PMA −5 neste alvo · desvantagem (Cego)` entrega 90% do benefício por 10% do
   trabalho — e funciona com dado físico na mão. Montar a expressão é onde a ficha é insubstituível;
   sortear um número não é.
2. **Rolador cria um problema que dado físico não tem: confiança.** "Tirei 20" com dado na mesa é
   fato público. Com rolador, é alegação. Não vale a pena importar isso para uma mesa que já rola
   dado.
3. **Khalkaria é tátil de propósito.** O Limiar é mão de cartas. O Abismo é barganha. Tirar o dado
   da mão do jogador anda contra a estética do sistema.

Se for construído: precisa de **histórico** e de uma **linha copiável** para o chat do grupo, senão
não serve para nada disputável.

**P58 — Eventos de mesa · tabela de botões.**

| Botão | Dispara |
|---|---|
| **Iniciar combate** | recurso de classe → valor inicial (0) · desconta 1 munição do tipo equipado · zera PMA · reseta usos "combate" · marca reação disponível |
| **Nova rodada** | reseta a reação · tique de *Em Chamas* e *Envenenamento* · decrementa condições de duração em rodadas · cobra Éter das magias sustentadas · reseta limites "por rodada" |
| **Fim do meu turno** | zera a PMA de todos os alvos · expira efeitos "até o fim do seu turno" · marca a reação como gasta |
| **Fim de combate** | zera Fluxo, Brutalidade, Concentração · reseta usos "combate" · expira temporários de combate · limpa condições com fim em combate |
| **Fim de cena** | reseta usos "cena" · zera Instinto · limpa a munição da cena |
| **Descanso curto** | assistente do P48 |
| **Descanso longo** | assistente do P48 + avança o dia |
| **Novo dia** (sem descansar) | reseta usos "dia" · **não** recupera status · avisa sobre Exaustão no 2º dia sem descanso |

**`logComDesfazer: true` — essencial, não opcional.** Clique errado em "Descanso Longo" é
irrecuperável sem log, porque ele consome o dia, rola recuperação, baixa Exaustão e cobra estresse
de uma vez. Dano e gasto de recurso também: a mesa corrige o tempo todo ("não, o ataque errou").
Guarde os últimos ~20 eventos com desfazer.

**P59 — Export · DECISÃO.**

```
exportarEstado : true, em bloco SEPARADO
campos         : [ saude.atual, stamina.atual, eter.atual,
                   recursoClasse.{nome,atual}, condicoes[], temporarios,
                   exaustao, desnutrido, evasaoPassiva, ar, ae[], movimentoEfetivo ]
```

Manda os dois, mas em blocos distintos: a build no formato `npc` que o Bestiário já aceita, e o
estado num `estadoSessao` à parte. Como o import é tolerante e filtra chave desconhecida, o
Bestiário ignora o bloco novo até querer usá-lo — e quando quiser, já está lá.

**E sim, o mestre precisa de resumo.** O que um mestre pergunta em combate é sempre a mesma coisa:

```
Saúde 34/55 · Evasão 14 · Ar 3 · Ae(Fogo 5) · Movimento 4,5 m
Condições: Sangramento 2, Desorientado
```

Uma "linha de mesa" somente-leitura, copiável, resolve isso sem precisar que o Bestiário mude nada.

---

## 4. O que precisa ir para o Notion antes de entrar no site

Ordenado por impacto. Tudo aqui está marcado `"status": "decisao"` no JSON — o site pode
implementar, mas a regra só existe de verdade quando o Pedro escrever.

| # | O quê | Por quê |
|---|---|---|
| 1 | **Modificador de atributo** — `floor((attr − 10)/2)` | 🔴 Não está em lugar nenhum. **Todo** derivado depende dela. |
| 2 | **Vantagem e desvantagem** — regra geral | 🔴 Usada por 6 condições, superfícies e armas sem requisito. Nunca definida. |
| 3 | **Piso da Contida (1) e piso do custo final (0)** | Sem o primeiro, o tier de truques nasce obsoleto. Sem o segundo, existe custo negativo. |
| 4 | **Sangramento X escala ou não** | Maior impacto em DPR da lista. A D29 diz que deve escalar; o card diz que não. |
| 5 | **Ae/Ar acumulam? Tem teto?** | Ar 11 zera o arquétipo de arma leve sem upgrade. |
| 6 | **Dano de Morrendo é mitigável?** | Se for, `Ae(Biológico)` desliga o relógio da morte. |
| 7 | **Liberação de estresse é opcional?** | Se obrigatória, descansar com 5 de estresse é pior que não descansar. |
| 8 | **Exposto derivado de Paralisado** — concede uma vez, não continuamente | A leitura contínua faz todo ataque contra paralisado ser crítico. |
| 9 | **Saída de Exaurido e Oco** = recurso > 0 | A leitura literal permite ficar em 0 de Stamina sem penalidade para sempre. |
| 10 | **Como o Desnutrido diminui** | Só existe a regra de subir. |
| 11 | **Lista das "condições mentais"** | Citada pelo Teurgo e pelo Veterano, nunca escrita. |
| 12 | **Promover *Agarrado* a condição** | O efeito já existe na manobra *Agarrar*; só falta o card. |
| 13 | **"1 cast por turno" existe?** | *Projétil* diz que ignora uma regra que não está escrita. |
| 14 | **O dado de Defender não soma atributo** | Uma linha, evita contar Destreza duas vezes. |
| 15 | **Descrição do Ofício(Ferraria)** está com o texto da Engenharia | Correção de copiar-colar. |
| 16 | **Intimidação: CON/FOR ou FOR/SAB?** | Ficha física e tabela de perícias discordam. |
| 17 | Padronizar `ultrapassar`/`alcançar` em Morrendo e Oco | Uma palavra em cada card. |
| 18 | *Pele de Pedra* usa `Ae(Ordinário)` — é **`Ar`** | Já era pendência (D67). |
| 19 | Resíduo da renumeração de magia (D68) | *Dissipar Magia*, Teurgo ×3, Cultista, Corrompido, *Desejo Sombrio*. |

**Baixa em duas pendências antigas minhas:** *Margem de Ameaça* (D22) e *Multiplicador de Crítico*
(D31) **já estão registradas no Notion**. Conferi hoje.

---

## 5. O que eu ainda posso entregar

Em ordem do que eu acho mais útil:

1. **Ar e Ae parseados por item** (50 armaduras + 10 escudos + itens mágicos), em coluna própria,
   a partir do CSV do Bazar. É meu arquivo e a gramática é fechada (D63/D64/D67). Resolve o **P19**
   por completo. → **Me diz e eu rodo.**
2. **O bloco `itens` do P44**, via parser + validação por conjunto sobre `data/classes/*.json` e
   `data/limiar.json`, com relatório das habilidades que não caírem na gramática para o Pedro
   decidir em lote. **Não vou digitar à mão** — ver P44.
3. **Revisão do desenho de recurso de classe** (Instinto e Concentração), que é a **D79** e já está
   em andamento no rework do Batedor. Quando fechar, a "régua de recurso de classe" vira o molde
   de Vigário, Vampiro, Necromante e Xamã — e o `classes.<id>.recursos[]` deste contrato deve ser
   o formato de saída dela.
4. **Os números que faltam para decidir**, se o Pedro quiser ver antes de escolher: o teto de Ar,
   o custo real do estresse por comodidade de descanso, e o DPR do Sangramento nas duas leituras.

---

**Método.** Tudo que está marcado CANÔNICO foi conferido hoje contra o Notion `2b76e3a4`, por
busca no conteúdo — não de memória. Já errei exatamente assim neste projeto: um script meu acusou
`Ae(Biológico)` de inválido porque checou contra uma lista que eu tinha digitado de cabeça em vez
de ler a página *Tipos de Dano*. A lição ficou: **ler a referência, não recitá-la.**
