# 15 — Ficha digital, rodada 3: resposta ao agente de HTML

Data: 2026-09-26. Responde à mensagem "Rodada 3 da ficha digital", que partiu das respostas do Pedro em
`docs/ficha-digital/03-respostas-pedro.md` (main, 703f665).

**Numeração, para não colidir:** `Dn` é decisão da memória do balanceamento (`09-decisoes-pedro.md`).
`PDn` é a decisão n do plano (`docs/ficha-digital/02-plano.md`), respondida pelo Pedro. `Ln` é item do
lote de revisão da seção E. Exemplo do problema que isso evita: D22 é Margem de Ameaça; PD22 é Ae(Todos).

**Arquivos desta entrega** (todos em `references/`; os três JSON mantêm o nome, PD3):

| Arquivo | Versão | O que mudou |
|---|---|---|
| `ficha-digital-regras.json` | `regras-ficha/1.1` | PD1–PD31 aplicadas; 25 campos continuam abertos (lote, seção E) |
| `ficha-efeitos-itens.json` | `efeitos-itens/1.1` | PD21–PD26; novo bloco `marcasVhelor` |
| `marcas-vhelor.json` | `marcas-vhelor/1.0` | **novo.** Fonte única das 7 Marcas; o gerador copia para o bloco |
| `ficha-efeitos-gerador.py`, `ficha-efeitos-overrides.json` | — | geram a 1.1; saída reproduzível byte a byte |
| `bazar-v26.csv` (e a cópia da raiz) | — | PD26b nas minhas cópias (ver F) |

---

## 0. O que ler primeiro

1. **Notion gravado e conferido** em 11 páginas: Condições, Sistema, Magias, O Limiar e as 7 classes.
   O log com antes e depois, verbatim, está na seção A. Ficaram de fora, de propósito, os itens
   Notion × Notion (L16, L18–L21), que esperam o Pedro.
2. **Três correções minhas**, que mudam o contrato:
   - **Lento X é intensidade, não duração.** Eu tinha "provado" o contrário na P27. O próprio Notion
     desmente: *Bomba Temporal* diz "Lento 2 (-2 Ação/turno, -6 m movimento…)", e *Fusão Primal* diz
     "Lento 1, por 1 rodada", com a duração à parte. O contrato agora escala por X (−3 m e −1 ação por
     ponto) e o texto do card vai no lote (L10).
   - **A lista de "condições mentais" existe.** Está na rara *Santuário Intocável*: "condições
     mentais (Enfeitiçado, Amedrontado, Confuso, Atordoado)". Eu tinha dito que nunca foi escrita.
   - **Intimidação: a divergência era no outro lugar.** A tabela de perícias do Notion diz
     `1d20+(Constituição ou Força)`, igual à ficha A4. A página que destoa é o *Template - Ficha de
     Personagem* (For/Sab). Ver C3.
3. **A Investida está fechada** (o Pedro respondeu hoje: conta como Mover, não provoca ataque de
   oportunidade, quem intercepta leva o ataque) e foi para o Notion. Sobra uma questão de balanço
   com arma pesada (L13).

---

## A. Notion — o que foi gravado

Método: `update_content` só grava se o trecho antigo casar exatamente; depois, fetch e diff da página
inteira. Nas quatro páginas grandes o diff mostrou só as linhas abaixo. Nas classes, a troca é de uma
linha e a API confirmou cada uma.

### A.1 Condições (`3a66e3a4…0b25`) — PD14b, PD17, PD31, D83, D86

| Card | Antes | Depois |
|---|---|---|
| Sangramento X | "Se o alvo puder sangrar, qualquer ataque contra ele causa +1d4 de dano Biológico. Ao acertar um ataque em um alvo com essa condição, ela reduz em 1." | "Se o alvo puder sangrar, qualquer ataque contra ele causa +Xd4 de dano Biológico, sendo X o seu Sangramento atual. Ao acertar um ataque em um alvo com essa condição, ela reduz em 1. Por exemplo: um alvo com Sangramento 3 recebe +3d4 no próximo acerto e fica com Sangramento 2." + "Se o acerto também aplicar Sangramento, o dano e a redução acontecem antes da nova aplicação." |
| Envenenamento | "1d6 de dano Biológico por rodada até o fim do efeito." | "1d6 de dano Biológico no início de cada turno seu, até o fim do efeito." |
| Em Chamas | "…no inicio de cada turno, até apagar o fogo com 1 ação." | "…no início de cada turno seu, até apagar o fogo com 1 ação." |
| Morrendo | "Você recebe 10% da sua vida máxima de dano biológico por rodada, ao ultrapassar metade…" | "Você recebe 10% da sua vida máxima de dano biológico no início de cada turno seu. Esse dano não pode ser reduzido por Armadura, Armadura Específica ou Resistência. Ao ultrapassar metade da sua vida máxima em negativos, você morre." |
| Morrendo (fórmula e estabilizar) | "Dano/Rodada"; "negando o dano por rodada" | "Dano/Turno"; "negando o dano por turno" |
| Desnutrido X | — | nova linha: "Você ganha 1 de Desnutrido para cada dia em que descansou sem se alimentar (consumir 1 item do tipo Comida) ou sem luz de fogueira ou outra fonte." |
| Exaurido | "Você não pode rolar perícias, encerra ao realizar qualquer tipo de descanso." | "Você não pode rolar perícias." + "Encerra quando sua Stamina volta a ficar acima de 0." |
| Oco | "Ao alcançar metade do seu éter máximo…" | "Ao ultrapassar metade…" + nova linha "Encerra quando seu Éter volta a ficar acima de 0." |
| **Agarrado** (card novo, depois de Enraizado) | — | "Você está dominado por uma criatura. / Ataques contra você possuem +2 em Atacar. / Você recebe -2 ao Atacar. / Você fica *Enraizado* até se livrar do agarrão." (os 3 efeitos da manobra Agarrar, nada novo) |

### A.2 Sistema Khalkaria (`2b76e3a4`) — PD8, PD18, PD30, PD31a, PD17b, D85, D88

| Onde | Antes | Depois |
|---|---|---|
| Criação de Personagem, passo 1 | "…anote o valor dos 5 resultados.<br>Distribua…" | "…anote o valor dos 5 resultados.<br>Se a soma de uma rolagem der menos de 8, role os 4 dados novamente: por isso cada valor fica entre 8 e 18.<br>Distribua…" |
| Tabela de perícias, Ofício(Ferraria) | "…para fabricar uma Bugiganga." (texto da Engenharia) | "…para fabricar um Equipamento (Arma, Armadura ou Escudo)." |
| Sua Rodada, reação Defender | "…contra todos os ataques do agressor nesta rodada." | "…neste turno." |
| Sua Rodada | "*Conjurar magia* (1-3 ações)" | "*Conjurar magia* (1-3 ações), no máximo 1 magia conjurada por turno." + nova linha "*Usar item consumível* (1 ação) → em você ou em outra criatura. Se o item for arremessado, siga o que ele diz." |
| Sua Rodada | — | nova linha, no fim da lista: "Ações livres não têm limite por turno." |
| Defesa, Evasão ativa | "…à sua evasão contra todos os ataques do agressor neste turno." | + "Ataques de outros agressores continuam contra a sua Evasão Passiva. O dado não soma atributo: a Destreza já está na Evasão Passiva." |
| Defesa, Armadura(Ar) | — | nova linha: "O Ar de fontes diferentes se soma (por exemplo, o Ar natural da raça e o Ar da armadura)." |
| Manobras, Investida | (texto do Pedro, intacto) | + "A Investida conta como a sua ação de *Mover* do turno. Ultrapassar inimigos durante a Investida não provoca ataques de oportunidade." (respostas do Pedro de hoje) |
| Necessidades de Sobrevivência | "A cada noite sem comer, a *desnutrição* aumenta em 1…" | "A cada noite em que descansar sem comer ou sem luz de fogueira ou outra fonte, a *desnutrição* aumenta em 1…" |

### A.3 Magias (`3a66e3a4…9fcb`) — PD31b, PD31d

| Magia | Antes | Depois |
|---|---|---|
| Pele de Pedra (tabela) | "Ae (Ordinário): 2 / 5 / 7 / 10" | "Ar: 2 / 5 / 7 / 10" |
| Pele de Pedra (descrição) | "A criatura ganha Armadura Específica contra dano Ordinário" | "A criatura ganha Armadura (Ar) contra dano Ordinário" |
| Dissipar Magia (tabela) | "Encerra magias de Nível 2 ou menor automaticamente" | "…Nível 3 ou menor…" |
| Dissipar Magia (descrição) | "Magias de nível 2 ou menor são automaticamente dissipadas." | "…nível 3 ou menor…" |

Resíduo da D68: Teurgo (3 blocos), Cultista, Corrompido e *Desejo Sombrio* já estavam corrigidos.
Achei um resíduo novo, que **não** gravei (L18).

### A.4 O Limiar (`3a66e3a4…f676`) — PD13

| Onde | Antes | Depois |
|---|---|---|
| Custo das cartas | "- 4ª carta: **4 Pontos do Limiar**" / "- …" | "- 4ª carta: **4 Pontos do Limiar**" / "- 5ª carta: **5 Pontos do Limiar**" |
| 6ª carta | "6ª carta (+2 Atributo): Sempre custa **2 Pontos do Limiar**" | + ", mesmo sendo a primeira carta escolhida, e só pode ser escolhida 1 vez por mão. Os 2 pontos podem ser distribuídos entre dois atributos." |

O "5-11 cartas" → "4-12" o Pedro já tinha corrigido. A página também mudou por conta dele: o
catálogo tem agora **127 cartas (8 universais, 12 por atributo, 59 raras)**. O CLAUDE.md §9 ainda diz
170/129/10 universais.

### A.5 As 7 classes — PD8b

"Evasão Ativa (Reação): 10 + Mod. Destreza + Treinamento em Defender" → "…+ Dado de Defender", em
Espadachim, Batedor e Teurgo; em Monge, Alquimista, Brutalista e Artilheiro, com *Defender* em itálico
como estava. A Evasão Passiva ("10 + Mod. Destreza") já estava igual nas 7.

### A.6 Não gravado, e por quê

- **Template - Ficha de Personagem**, Intimidação (For/Sab): Notion contra Notion. Espera o Pedro (L21).
- **PD15 (Saúde temporária), PD16 (sustentada), D90 (tempo):** não há frase no Notion para corrigir;
  seria texto novo. Estão aprovados no contrato e vão como proposta no lote (L41, L42, L17).
- **PD12 (Abismo para qualquer jogador):** a página já não restringe; nada a mudar.

---

## B. Arquivo de efeitos (`efeitos-itens/1.1`)

Contagem igual à 1.0: itens 214 · armas 181 · consumo 243 · semEfeitoNaFicha 115 · naoParseado 0; a
conta fecha nos 727. Rodar o gerador duas vezes dá o mesmo arquivo (sha256 `59a707d7a8831968…`).

- **PD21 — Grevas Trovejantes:** o lembrete virou modificador:
  `{"alvo":"ataque.danoExtra","op":"soma","valor":"1d6","condicao":"investida"}`. `condicao:"investida"`
  = só nos ataques feitos durante a manobra. Status canônico: a manobra está no Notion.
- **PD22 — Ae(Todos):** todo modificador `ae.todos` ganhou o campo `cobre`, com a lista final. Nos três
  itens (Capa Defensiva, Anel do Baluarte, Capa do Vazio) ela é: fogo, frio, elétrico, veneno, ácido,
  psíquico, radiante, trovejante, necrótico. Os 3 Ordinários ficam fora: são do Ar.
- **PD23 — Autômato:** o texto da raça é mais largo que a pergunta. Verbatim: *"Possui mecanismo de
  automanutenção(cura ao descansar), mas para cura maior deve ser consertado com item Kit de
  Manutenção. Poções e Elixires não funcionam em você."* Então o aviso (`avisoRaca.automato`, modo
  `confirmar`) está em **toda Poção e todo Elixir** (24, cânone), não só nos de cura. Mais 6 curas que
  não são poção nem elixir (Bandagem Encharcada, Erva Medicinal, Aguardente de Raiz, Café Preto, Seiva
  da Vhelor, Kit de Trauma) levam o aviso como leitura minha (`status:"decisao"`): a raça pede Kit de
  Manutenção para "cura maior". Os 4 Kits continuam `soParaRaca:"automato"`.
- **PD24:** as duas leituras ratificadas saem com `status:"aprovado"` (atributo nu = valor de atributo;
  "Envenenado" = Envenenamento).
- **PD25 — Anel do Esgrimista:** `requisito:{"arma":"leve"}`. O efeito continua lembrete, porque a
  interação com o Sangramento novo tem uma pergunta aberta (L37).
- **PD26a — Marcas da Vhelor:**
  - Texto das 7 marcas, verbatim do Pedro, só em `marcas-vhelor.json`. O gerador copia para o bloco
    `marcasVhelor` e liga os itens:
    - `marcaVhelor.soma`: +1 em Folha Amarela, Seiva da Vhelor e Casca de Raiz; 0 na Semente;
      −1 no Elixir da Expurgão, com `funcionaAteMarca: 4`.
    - Talismã da Seiva: `requisito.marcaVhelorMin: 2`.
  - Os efeitos por marca são cumulativos: na Marca 4 valem as Marcas 1 a 4.

    | Marca | Efeito na ficha |
    |---|---|
    | 2 | `eter.max −10` permanente; teste de Vontade todo amanhecer. A CD é "crescente" e não está escrita: fica com o mestre. |
    | 3 | estado manual `abstinencia`: −2 em todas as rolagens e Desorientado enquanto durar |
    | 4 | −5 em `tag.social`, com a leitura "contra não-corrompidos", que vem do parêntese |
    | 5 | teste de Vontade em stress ou combate; na falha, Descontrolado 1 |
    | 7 | estado final: alerta, sem travar a ficha |

  - As frases de marca saíram dos lembretes dos itens.
  - Para mudar uma marca depois, edite `marcas-vhelor.json` e rode o gerador.
- **PD26b:** aplicada nas minhas duas cópias do CSV (ver F). O índice `empilhaveis` já tinha 87, porque
  lê a coluna `Efeito`.
- **PD5a:** o contrato registra `export.profFormato: "grau"` (0–4). **PD5b:** `estadoSessao` só no
  export nativo.
- **PD3:** mesmos nomes de arquivo; subi o `schemaVersion` dos dois JSON.

---

## C. Dúvidas de regra

### C1 — Técnicas: descanso curto ou longo? · **PEDRO DECIDE (L22)**

O Notion diz **longo**, nas 7 páginas de classe, com a mesma frase: *"Toda classe possui técnicas,
você pode reatribuí-las livremente ao realizar um descanso longo, respeitando o limite de pontos."* A
nota do Pedro diz curto: *"as técnicas das classes que são alteráveis em descansos curtos"*. Não
escolho em silêncio: o contrato fica com `descansoLongo` (o Notion) e marca `pedroDecide`.

- Vale só para as técnicas gerais. Técnicas de Ramo e Marcas são irreversíveis: *"Os ramos são
  caminhos, características únicas do seu personagem, diferente das técnicas, são irreversíveis."*
- A única troca por descanso curto que achei é a das tecnologias do Autômato: *"Pode substituir
  tecnologias em descansos curtos."*

### C2 — Defender (Des/Con) na ficha física

O "(Des/Con)" não tem fonte: é resíduo da ficha A4. Na tabela de perícias do Sistema, Defender é
`1d6/1d8/1d10/1d12/2d8`, sem atributo, e o Sistema agora diz *"O dado não soma atributo"*.

Não existe teste de Defender isolado, contra CD. Defender é sempre um dado **somado a outra coisa**:

- à sua Evasão: Evasão Ativa, e a opção "Defender" da retaliação, que é a mesma regra;
- a um teste de Reflexos (*Corpo Escorregadio*: "somar sua pericia Defender em qualquer teste de
  Reflexos");
- à Evasão de um aliado (*Muralha de Aço*, rara).

Bônus planos (a ação Defender +2, Invisível +5, Caído −2, *Fantasma* do Batedor somando o treino de
Furtividade) somam na rolagem desse dado.

Mostre `Defender: 1d8 (Treinado)`, sem atributo. Existe uma contradição no Notion, que vai para o Pedro:
o Brutalista (*Muralha Viva*) diz *"O treinamento da sua pericia Defender aumenta de 3 em 3. (Ao invés
de 2 em 2)"*, que é da época em que Defender era bônus (L19).

### C3 — Intimidação · **Con/For, canônico**

A tabela de perícias do Notion diz `1d20+(Constituição ou Força)`, igual à ficha A4 ("Intimidar
(Con/For)"). A página que destoa é o Template da ficha (`4e66e3a4`): "Intimidação (For/Sab)". É Notion
contra Notion, então não corrigi: o Pedro dá o ok (L21). O contrato já está em Con/For e `canonico`.

### C4 — Nos "X/Y", algum não pode trocar? · **Nenhum**

O Notion não trava nenhum. Todos saem com o **maior** por padrão e podem ser trocados à mão (PD7,
`trocavel: true` no contrato).

| Campo | Texto do Notion |
|---|---|
| Movimento | `1d20+Força ou Destreza`, "tanto de maneira bruta como de maneira ágil" |
| Convencimento, Enganação | `1d20+(Destreza ou Inteligência)` |
| Intimidação | `1d20+(Constituição ou Força)` |
| Stamina | `(Mod.FOR OU Mod.DES × Nível)` |
| Éter | `(Mod.INT OU Mod.SAB × Nível)` |
| CD do Espadachim | `10 + (Destreza ou Força) + Constituição` |

Duas observações:

- **Atacar não é X/Y**, e não deve ter a troca. Quem define o atributo é a arma. Sistema, Ataque: *"Corpo a
  Corpo Pesado: … Mod. de Força"; "Corpo a Corpo Leve: … Mod. de Destreza"; "À Distância: … Mod. de
  Destreza"; "Armas Místicas: … usa a perícia místico"*. Exceção escrita: a tecnologia *Sistema de
  Reconhecimento de Ameaças* do Autômato "pode rolar Atacar com Inteligência".
- Nos máximos (Stamina e Éter), o maior é sempre o melhor, então a troca só serve de ajuste manual. Mas
  atributo temporário muda o maior (Elixir do Crescimento, Mutagênico, Exaustão 4), e com ele o
  máximo. O que acontece com o valor atual nesse caso está no lote (L06).

### C5 — Assistente de criação e subida de nível

**Progressão**: a tabela é igual nas 7 classes, e as contagens vêm do bloco "Ao longo da criação…",
também igual nas 7.

| Nível | Técnicas gerais (3 + Nível) | Técnicas de Ramo | Marcas (total) | Limiar | Atributo |
|---|---|---|---|---|---|
| 1 | 4 | — | — | — | criação (8–18) |
| 2 | 5 | **3 do Tier 1** | — | mão + 4 pontos | +2 |
| 3 | 6 | — | 1 | mão + 4 pontos | +2 |
| 4 | 7 | **2 do Tier 2** | 2 | mão + 4 pontos | +2 |
| 5 | 8 | **1 do Tier 3** | 3 | mão + 4 pontos | +2 |

Verbatim: *"Ao longo da criação do seu personagem você escolherá: 3 Marcas; 6 Técnicas de Ramo: 3 no
Tier 1 (nível 2), 2 no Tier 2 (nível 4) e 1 Ultimate no Tier 3 (nível 5)"*. A tabela de Progressão diz
"Técnica de Ramo(Tier 1, 2)" no nível 4, e eu leio isso como os tiers que você *tem*, não como escolha
livre entre eles: as contagens vêm da frase acima.

- **Ramo:** não existe o passo "escolher o ramo".
  - Cada técnica e cada Marca é escolhida sozinha, de qualquer ramo: *"É extremamente aceitável que
    você misture os 3 ramos."* A tela multi-opção do Pedro é por tier, com os 3 ramos lado a lado.
  - Escolheu, não troca mais (irreversível).
  - Único requisito de build escrito nas 7 classes: *Senhor das Linhas* (Batedor, T3 Cartógrafo),
    "deve ter ao menos Cartógrafo Tier 1 ou 2".
  - T3 são ultimates, 1x por dia.
- **Marcas:** 6 opções por classe (2 por ramo); você escolhe 3 no total, uma nos níveis 3, 4 e 5.
- **Teurgo:**
  - **Escolas:** "2 Escolas de magia no nível 1, +1 no nível 3 e +2 no nível 5". São 5 no nível 5,
    porque a lista tem 5: Abjuração, Destruição, Conhecimento, Alteração e **Primordial**, que
    "(Requer nível 5)". O CLAUDE.md §2 lista só 4.
  - **Magias no nível 1:** "Escolha 1+MOD. INT ou SAB, magias de nível 1 no primeiro nível."
  - **Do nível 2 em diante:** as três técnicas de grimório do Tier 1 dizem "substitui a fórmula nível 1
    de magias disponíveis". *Grimório Arcano*: 3 + Mod.INT. *Canalizador Inato*: 2 + Mod.SAB,
    permanentes. *Magias Pactuadas*: 1 + Mod.INT. As três dão +1 por nível seguinte e acesso a magias
    de nível ≤ o seu.
  - **Lacuna:** um Teurgo que não pega nenhuma das três não tem regra do nível 2 em diante (L14).
- **Raça** (§2 do Pedro): atributos, movimento, perícias, dados físicos, características e a técnica de
  raça. Se ela é fixa ou escolhida **depende da raça**, e não há regra geral. Humano escolhe 1 de 4
  Estilos de Vida; Autômato escolhe o ajuste de atributo (+2 INT −1 SAB, ou +2 CON −1 INT) e 2
  tecnologias Tier 1.
- **Origem:** itens iniciais, técnicas ou habilidade de origem, treinamento e Sins (o Cultista mostra a
  estrutura).
- Os dados por raça e por origem vêm do **parser do bloco C**, próxima entrega.
- **Subida:** o `checklistDeNivel` do contrato continua valendo. Além da tabela: +2 atributo (Bênção),
  mão do Limiar (5 cartas + a especial), 4 pontos por nível, custos grátis/2/3/4/5, e a 6ª sempre 2.
  Escalas por classe que a ficha recalcula:

  | Classe | Escala |
  |---|---|
  | Espadachim | Marca do Duelo +1/+2/+3 nos níveis 1/3/5 |
  | Batedor | Terreno Ideal 1/2/3 nos níveis 1/3/5 |
  | Brutalista | Frenesi 1x/2x por descanso longo nos níveis 1/3 |
  | Alquimista | Reagentes `(Nível × 3) + Mod.INT` |
  | Teurgo | escolas nos níveis 3 e 5 |
- **"Cuidado com as 4 técnicas do limiar, isso é só a partir do nível 2":** não há outra regra. As
  duas leituras dão a mesma implementação: no nível 1, 4 técnicas gerais da classe (3 + Nível) e
  **nenhuma** carta ou ponto do Limiar; o Limiar abre no nível 2 ("A Cada Nível (2, 3, 4, 5)").

**Duas curiosidades para a tela de classe:**

- O Alquimista lista Ofício(Alquimia) no treino fixo **e** na lista de escolha. Pela regra de
  empilhar, escolher de novo faz Experiente.
- Alquimista e Brutalista não listam categoria de arma no treino inicial.

### C6 — Rolador da Mesa: a expressão do ataque

```
rolagem  = d20            (vantagem/desvantagem: 2d20, fica o maior/menor; não acumulam; se anulam)
         + 2 × grau(Atacar)
         + mod(atributo DA ARMA)   Pesado FOR · Leve DES · Distância DES · Mística: rola Místico
         + PMA                     −5 por ataque anterior NO MESMO ALVO neste turno (D29)
         + modificadores           condições, técnicas; Artilheiro: "Sempre adicione sua concentração"
acerta   se rolagem ≥ Evasão do alvo            "Em caso de empate, o atacante sempre ganha."
crítico  se o dado USADO ≥ margem de ameaça (padrão 20; itens e cartas ampliam)
falha crítica se o dado usado = 1               (Abismo "Perdedor": 1–2)
dano     = dados da arma × multiplicador (padrão 2, só no crítico) + mod(atributo) + extras
           extras NÃO dobram: Sangramento, técnica, óleo (o dado impresso na própria arma: L36)
no alvo  = imunidade → resistência/vulnerabilidade → Ar (só Ordinário) e Ae → arredonda p/ baixo → mín. 0
```

O que não sai sozinho do contrato:

- **Retaliação.** O alvo com reação escolhe:
  - **Atacar** — disputa: "Caso o alvo ultrapasse seu valor, ele te ataca com a arma que estiver
    empunhando". Se ele crita, nega seu dano; se ele falha criticamente, seu ataque é crítico.
  - **Defender** — soma o dado à Evasão contra todos os seus ataques do turno.
  - Ataque à distância não é retaliado.
  - A Mesa precisa do botão "o alvo reagiu?".
- **Exposto:** o primeiro acerto é crítico e remove a condição.
- **Sangramento:** no acerto, +Xd4 e depois X−1. Se o acerto também aplica, consome antes.
- **PMA:** o Pedro quer display, não contador por alvo. Com rolador, basta a Mesa perguntar "mesmo
  alvo?" a cada ataque, já marcado por padrão.
- **Investida na Mesa:** 2 ações, conta como Mover, um ataque por inimigo ultrapassado, mais o do
  interceptador. Todo ataque dela é num alvo diferente, então pela D29 nenhum leva PMA (L13).
- **Entrada manual:** a Mesa aceita o número do dado físico, como o Pedro pediu para os atributos
  (PD30).

---

## D. Escopo (bloco C)

Entendido. Sai do automático tudo que é técnica de classe que mexe em PMA, cura etc.; o campo
editável cobre. A próxima entrega do balanceamento é o **parser do bloco C** nesta ordem:

1. raças;
2. origens;
3. cartas do Limiar: nome e requisito das raras; o efeito das raras só com o script de revelação (PD11);
4. técnicas de classe, por último, depois do rework do Batedor.

Mesma regra de método: extração por gramática, conjunto contra o Notion, zero perda silenciosa.

---

## E. Lote PD20 — para o Pedro revisar de uma vez

Três partes. Na **Parte 1** basta "aceito tudo" ou a lista do que recusa: são regras que a ficha já
usa, cada uma com o texto que eu gravaria no Notion. As **Partes 2 e 3** pedem uma decisão.

### Parte 1 — aceite ou recuse (texto proposto para o Notion)

| L | Regra | Texto proposto | Onde |
|---|---|---|---|
| L01 | Gasto sem saldo | "Você não pode gastar Stamina ou Éter que não tem." | Sistema > Status |
| L02 | Ordem de cálculo dos máximos | base → coeficiente × nível → mod × nível → bônus fixos → bônus rolados → percentuais → reduções permanentes → condições → piso 0. *Só na ficha, sem texto no Notion.* | — |
| L04 | Stamina temporária | Mesma regra da Saúde temporária (L41). | Sistema > Status |
| L06 | Máximo que muda | "Se um máximo diminuir, o valor atual acompanha até o novo máximo (nunca abaixo de 0 por isso). Se aumentar, o atual sobe o mesmo tanto." | Sistema > Status |
| L08 | Cura | "A cura não passa do máximo. O '+Int' de poções e kits usa a Inteligência de quem usa o item." | Sistema > Status |
| L09 | Bônus rolado de máximo | "Bônus de máximo com dado (ex.: '+2d6+8 Stamina máxima') são rolados uma vez, ao receber a fonte, e o valor fica anotado." | Limiar, abaixo do catálogo |
| L10 | **Lento X** (card) | "−3 m de Movimento e −1 Ação para cada ponto de X." | Condições > Lento |
| L11 | Atordoado | "−2 Ações e −2 de Evasão até o início do seu próximo turno." (hoje: "-2 Ações e Evasão até a próxima rodada") | Condições |
| L12 | Exaustão 4 | "Seus atributos (o valor, não o modificador) caem pela metade, arredondando para baixo, e seus máximos são recalculados." | Condições |
| L17 | Tempo (D90) | "1 ação equivale a 2 segundos; um turno, 3 ações, são 6 segundos. Ações fora desta lista custam o que o mestre decidir na hora." | Sistema > Sua Rodada |
| L23 | Fluxo do Monge | Trocar "Ao fim do combate, se passar 1 rodada sem ganhar Fluxo ou receber dano, você perde todo seu Fluxo." por "Ao fim do combate, você perde todo o seu Fluxo." (o combate já começa em 0, e "fora de combate" usa as técnicas com 1 minuto de preparo) | Monge |
| L24 | Ação Defender | "A ação Defender não acumula com ela mesma." | Sistema > Sua Rodada |
| L25 | Ordem do Movimento | "Efeitos que fixam o Movimento (Caído 1,5 m, Enraizado 0 m) vencem somas e multiplicações; se dois fixam, vale o menor. O resultado arredonda para baixo, em múltiplos de 1,5 m." | Sistema |
| L26 | Ae do mesmo tipo | "Ae do mesmo tipo vinda de fontes diferentes se soma, como o Ar." | Sistema > Defesa |
| L27 | Empilhar condições | "Condições diferentes somam seus efeitos. A mesma condição aplicada de novo renova a duração; se ela tiver X, os X se somam." | Condições, topo |
| L28 | Transbordante | "O Éter utilizado é o custo total que você pagou, com modulações. A perda pode deixar seu Éter negativo." | Magias > Intensidade |
| L29 | Recarga "por dia" | "Usos '1x por dia' voltam no descanso longo. '1x por sessão', 'por semana' e 'por campanha' são marcados à mão." | Sistema > Descanso |
| L30 | Descanso longo sem comida | "Quem não se alimenta não recupera status nesse descanso; o resto do descanso vale normalmente (fim do dia, Exaustão, usos por dia)." | Sistema > Descanso |
| L31 | Rolagem do descanso | "Role Xd8 separadamente para cada um dos 2 status." | Sistema > Descanso |
| L32 | Dano mínimo | "Depois das reduções, o dano pode chegar a 0: não há dano mínimo." | Sistema > Dano |
| L33 | Imunidade | "Imunidade a um tipo de dano: o dano desse tipo é 0." | Sistema > Dano |
| L34 | Dano por categoria | "Dano escrito por categoria (ex.: 'dano Biológico') só é reduzido por Ae da categoria ou Ae(Todos), não por Ae de um tipo dela." | Sistema > Defesa |
| L41 | Saúde temporária (PD15) | "Saúde temporária não soma com outra (fica a maior), é gasta antes da Saúde e some no descanso longo." | Sistema > Status |
| L42 | Sustentada (PD16) | "Você só pode sustentar 1 magia por vez. O custo por turno é o que a magia diz; se não disser, é o custo da canalização." | Magias |
| L45 | "Evasão: Determinada pela sua classe" | "Evasão Passiva: 10 + Mod. Destreza, igual para todas as classes." | Sistema > Defesa |

### Parte 2 — preciso de uma decisão sua

| L | Pergunta | Minha recomendação |
|---|---|---|
| L03 | **Stamina negativa.** Você escreveu "sai dos negativos nos 2 status Stamina e Éter". Então a Stamina pode ficar negativa? Só por perda involuntária (ex.: *Exigente*, "−1 Stamina e Éter" ao falhar), como o Éter? Tem piso? | Sim, só por perda involuntária, sem piso, Exaurido enquanto ≤ 0 |
| L05 | **Como o Desnutrido diminui?** A PD17 respondeu como sobe. | Comer num descanso longo com luz tira 1, como a Exaustão |
| L07 | **A 6ª carta ocupa lugar na fila de custo?** Se você pega a grátis e a +2 Atributo, a próxima custa 2 ou 3? | Não ocupa (custa 2 à parte, a fila segue) |
| L13 | **Investida × arma pesada e PMA.** "Realiza 1 ação:Atacar" dá um ataque por inimigo mesmo com arma de Atacar(2) ou Atacar(3), e a Pesada Brutal gasta 2 ações em vez de 3. Ataques esperados: com 50% na disputa, 1 / 1,5 / 1,75 contra 1 / 2 / 3 inimigos em linha; com 70%, 1 / 1,7 / 2,19. Pela D29 (PMA por alvo), nenhum leva −5. | Manter: exige alinhamento e custa o Mover. Se incomodar, a arma pesada ataca só o primeiro alvo |
| L14 | **Teurgo sem técnica de grimório:** do nível 2 em diante, quantas magias? | Fica com 1 + Mod (a fórmula do nível 1) até pegar uma das três |
| L15 | **Magias Pactuadas × custo mínimo.** A técnica diz "Contida, o custo é 0 de éter (Ao invés de 1)"; o Sistema agora diz "mínimo 1, mesmo após reduções de técnicas". | A técnica é exceção escrita de propósito: manter o 0 e citar a exceção no Sistema |
| L22 | **Técnicas gerais: descanso curto ou longo?** (C1) | O Notion diz longo em 7 páginas; se for curto, eu gravo |
| L35 | **Morrendo, o resto.** (a) A cura soma a partir do negativo (−8 + 10 = +2)? (b) O texto diz "ou ser **atacado** novamente"; a ficha usa "acertado". (c) "Vida máxima" = a máxima atual, com Desnutrido e Exaustão. | Sim; "acertado" (um erro não deveria desfazer 2 ações + Medicina CD 20); sim |
| L36 | **Crítico e o dado impresso na arma** (ex.: arma com "+1d6 de Fogo" no próprio texto): dobra? | Dobra o que é da arma; não dobra óleo, técnica nem Sangramento |
| L37 | **Anel do Esgrimista com Sangramento +Xd4:** "consumir todos os acúmulos de uma só vez" dá Xd4 uma vez, ou a soma dos acertos que eles dariam? | Xd4 uma vez e zera |
| L38 | **"Elixir da Expurgão"**: nome de propósito ou "Expurgação"? Se mudar, o id do item muda. | Perguntar só |
| L39 | **Semente da Vhelor:** "te transforma em um ser pecaminoso" é a Marca 7 ou outra coisa? | Fica lembrete até você dizer |
| L40 | **Pele de Pedra agora é Ar e soma com armadura** (D85): Ar 10 na intensidade máxima + armadura Luxária Ar 8 = Ar 18. | Confirmar que soma: dura 3–5 rodadas e custa Éter, o que segura. Se não, "não soma com o Ar da armadura" |
| L43 | **Cultista:** "1 Pergaminho de Conhecimento nvl 1" é anterior à renumeração (D68)? Hoje nível 1 é truque. | Perguntar só |

### Parte 3 — Notion contra Notion (não gravei nenhum)

| L | Um lugar diz | Outro lugar diz |
|---|---|---|
| L16 | Limiar, cabeçalhos das tabelas e "Atributo Alto": **16+** | Limiar, bloco Resumo: "Força: 12 cartas (FOR 14+)", idem para os outros |
| L18 | Teurgo (corrigido): magias "iguais ou abaixo do seu nível" | Alquimista, *Cartucho Arcano*: "1 magia + Mod. Inteligência(min. 1) do seu **(nível-1)** ou menor" — mesmo resíduo da D68 |
| L19 | Sistema: Defender "aumenta o dado… em vez de adicionar modificadores" | Brutalista, *Muralha Viva*: "O treinamento da sua pericia Defender aumenta de 3 em 3. (Ao invés de 2 em 2)" |
| L20 | Sistema > Manobras: **Investida** (a manobra nova) | Brutalista, técnica geral **Investida** (2 Ações, 3 Stamina, Fortitude ou (Nível)d6+FOR e Caído); e o *Titã* do Alquimista tem uma ação "Investida". Mesmo nome, três regras. |
| L21 | Sistema e ficha A4: Intimidação Con/For | Template - Ficha de Personagem: "Intimidação (For/Sab)" |

---

## F. Pendências na main (para o agente de HTML)

- **CSV** (`data/Bazar_Khalkaria_v26.csv`), quatro edições aprovadas que ainda não estão na main:
  - **D89, Anel do Baluarte:** "[Leve] Ae(Todos, 3), (Exceto: Força e Primordial)." A main ainda diz
    "[Leve] Ae(Todos, 3)." — **esta não estava na sua lista**;
  - **D91, Erva Medicinal:** "Saude" → "Saúde";
  - **PD26b, Casca de Raiz e Seiva da Vhelor:** "Empilhável: pesa 1 bugiganga a cada 10 unidades." no
    fim do `Efeito_Jogador`.

  As três já estão nas minhas cópias (`references/bazar-v26.csv` e a da raiz da branch).
- **CLAUDE.md**, fatos que mudaram:
  - Limiar com 127 cartas (8 universais), não 170/129/10;
  - Teurgo com 5 escolas (Primordial no nível 5);
  - Lento X = intensidade;
  - Evasão Ativa = 10 + Mod.DES + dado de Defender;
  - condições mentais = Enfeitiçado, Amedrontado, Confuso, Atordoado.
- **`data/*.json` do site**: Condições, Sistema, Magias e Limiar mudaram hoje no Notion. Os snapshots
  precisam ser regerados.
- **`data/balanceamento/`** (PD3): copie `marcas-vhelor.json` junto com os outros três.
