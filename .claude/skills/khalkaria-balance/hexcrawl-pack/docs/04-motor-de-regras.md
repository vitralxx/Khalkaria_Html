# 04 · Motor de regras

As regras estão em `01-regras.md`. Este documento diz **como** elas viram código.

## 1. Núcleo de referência
`referencia/hexcrawl_ref/` é uma **especificação executável**. São funções puras em Python, sem dependência, escritas
pelo agente de balanceamento:

| Módulo | Conteúdo |
|---|---|
| `hexmath` | ids `CCLL`, offset ↔ axial ↔ cubo, vizinhos, direção entre hexes, distância, alcance, linha (visão), arestas canônicas, geometria em pixel, profundidade |
| `regras` | custo do passo, relógio do dia (`novo_dia`, `pode_entrar`, `entrar`, `explorar`, `acampar`, `periodo`), Jornada, consequências, rio, extração, comodidade, preço rolado |
| `tabela` | montagem da tabela do hex, pesos efetivos, faixas do d100, rolagem, aplicação do resultado, `pode_rolar` |
| `visao` | raio por tipo, hexes visíveis com penhasco, estado da névoa |
| `validador` | as conferências de `03-dados.md` §5 |

**Garantias**
- `referencia/tests/test_nucleo.py`: 40 testes, incluindo os testes negativos do validador.
- `testes/vetores-regras.json`: 216 casos de entrada → saída, válidos para qualquer linguagem. São gerados por
  `referencia/gera_vetores.py`.
  - O grupo `montagemPython` depende do `random.Random` do Python e só vale para o backend.

Na F0, o núcleo é **promovido** a `hexcrawl/nucleo/`. O app pode refatorar à vontade, desde que os testes e os
vetores continuem passando. Se um vetor parecer errado, **pergunte antes de mudar**: ele é a regra.

## 2. O que o app acrescenta

### 2.1 Rota (`hexcrawl/rota`)
- **A\*** sobre a grade. O custo de cada passo é o `custo_do_passo` (`01-regras.md` §2.5): a via só manda quando o
  passo a segue.
- **Penhasco** bloqueia a passagem.
- **Rio sem ponte** não custa metros, mas exige teste. O planejador soma um **peso de preferência** só na busca (por
  exemplo, +6) para preferir pontes.
  - Esse peso **não é regra**. O plano mostra a travessia e a CD, e o mestre pode forçar o caminho.
- **Água** só é atravessável com embarcação.
- **Hex de cidade** é atravessável como o tipo dele. Entrar no mapa da cidade é decisão do mestre, fora do app.
- **Heurística:** distância × 1,5, o menor custo possível. É admissível.

### 2.2 Plano de viagem (pré-visualização)
O mestre escolhe um destino e o app **simula** o relógio do dia (`01-regras.md` §3.3). Para cada passo, ele mostra:
- o custo, o restante e o período;
- onde o dia acaba e onde o grupo descansaria;
- as travessias de rio, com a CD;
- o H do dia e a meta da Jornada.

A simulação usa as mesmas funções do avanço real:
- se `pode_entrar` é falso, o dia fecha e o seguinte começa com `novo_dia(orcamento, divida)`;
- a dívida passa adiante.

### 2.3 Ações da sessão (`hexcrawl/sessao`)
Cada ação é uma transição do `estado.json`. Ela grava no `diario` e guarda um instantâneo para **desfazer**.

| Ação | Efeito |
|---|---|
| `andar(hex)` | Confere `pode_entrar`. Aplica `entrar`, recalcula a visão, soma aos `vistos` e avisa se o período virou. Cruzou rio sem ponte? Abre a travessia (§2.4). Restante chegou a 0? Chama `fechar_dia` |
| `explorar()` | Se `pode_rolar`, monta a tabela do hex (se ainda não houver), rola o d100 com o viés de extração e aplica o resultado. Depois aplica `regras.explorar`, que pula o período. **Explorar um hex que não rola também pula o período**: o grupo gastou o tempo ali |
| `acampar()` | O dia acaba onde o grupo está; chama `fechar_dia` |
| `fechar_dia()` | Jornada (§2.5), se o grupo andou. Depois o descanso (§2.6) e `novo_dia` com a dívida |
| `extrair(personagem, material, resultado)` | `unidades_extraidas`; cada personagem extrai uma vez por sítio |
| `gerar_comerciante()` | Estoque e preços (§2.7) |
| `embarcar(barco)` / `desembarcar()` | Troca o orçamento pelo do barco e libera rio e Água (`01-regras.md` §3.2) |
| `mover_grupo(hex)` | Ajuste manual do mestre, sem custo, como o arrasto do rio ou um teleporte |

### 2.4 Travessia de rio
1. Mostra a CD do rio (`cd_rio` sobre o H da aresta, `[P15]`).
2. Para cada membro, o mestre digita o resultado do teste ou pede ao app para rolar com o bônus informado.
3. Para quem falha, o app rola o dano (`dano_falha_rio`, 2d6+3) e o arrasto (`arrasto_rio`: 1d6 hexes, ou seja,
   2 arestas por hex rio abaixo). Ele sugere o hex de saída, e o mestre confirma ou move.
4. O token do grupo fica onde o mestre decidir. Grupo separado é com a mesa.

### 2.5 Jornada (uma vez por dia)
1. O H do dia é o `hostilidade_do_dia` dos `andados`. O H de cada hex é o do hex ou o da região.
2. A meta é `meta_jornada(H)`.
3. O mestre informa a ação e o resultado de cada membro (ou só o total de pontos). O app soma com `pontos_da_acao`.
4. Se o grupo não bateu a meta e não terminou o dia em especial de conflito, o app rola o d100:
   - pega a faixa e as fórmulas de `consequencia(d100, H)`;
   - pega o texto da região;
   - rola o dano de cada integrante.
5. Tudo vai para o diário. O app não aplica dano em ficha.

### 2.6 Descanso
1. O mestre informa o maior resultado de *Sobrevivência*.
2. O app calcula `comodidade_ao_ar_livre(resultado, bonus)`, com bônus 1 se o hex tem Abrigo marcado.
3. Mostra o X do Xd8.
4. Mostra o lembrete da emboscada e pergunta quem vigia. O Sistema não dá chance de emboscada (`01-regras.md` §3.4).
5. Zera `extracoesNoDia`. O dia avança e o período volta a manhã.

### 2.7 Comerciante ambulante
- Lê o CSV do Bazar, que é do Pedro e só para leitura, filtrando pela região na coluna `Obtenção`.
- Sorteia a quantidade e aplica o teto de raridade `[P10, P11]`.
- Rola o preço de cada item (`preco_rolado`) e mostra o estoque de 250 Sins.

### 2.8 Montagem e sementes
- A tabela de cada hex é montada **quando ele é explorado pela primeira vez**.
  - Ou antes, em lote, pelo botão "montar tabelas da região", para o mestre revisar e travar.
- A semente da montagem é estável: `random.Random(f"{semente}:montagem:{hex}")`. Mesma campanha, mesmas tabelas.
- As rolagens da sessão não precisam ser reproduzíveis: o valor sorteado vai para o diário, e desfazer restaura o
  instantâneo.
- **Remontar** uma tabela não travada é ação do mestre.
- Quando um notável ou raro sai, `aplicar_resultado` o tira de todas as tabelas já montadas.

## 3. Números que são proposta
Estes valores ficam em constantes nomeadas, e não espalhados pelo código, até o Pedro responder em
`10-pendencias.md`:
- P2: explorar leva o restante ao limiar seguinte;
- P4: raio da Montanha;
- P6: regra do sítio de extração;
- P9: Jornada no fim do dia;
- P10 e P11: comerciante;
- P12: raio na Água;
- P13: orçamento do barco;
- P15: H do rio.
