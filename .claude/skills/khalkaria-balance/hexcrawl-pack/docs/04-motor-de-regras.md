# 04 · Motor de regras

As regras estão em `01-regras.md`. Este documento diz **como** elas viram código.

## 1. Núcleo de referência
`referencia/hexcrawl_ref/` é uma **especificação executável**. São funções puras em Python, sem dependência, escritas
pelo agente de balanceamento:

| Módulo | Conteúdo |
|---|---|
| `hexmath` | ids `CCLL`, offset ↔ axial ↔ cubo, vizinhos, direção entre hexes, distância, alcance, linha (visão), arestas canônicas, geometria em pixel, profundidade |
| `regras` | custo do passo e custo embarcado; relógio do dia e paradas (`novo_dia`, `pode_entrar`, `entrar`, `andar`, `explorar`, `encerrar_dia`, `periodos_encerrados`, `fechar_parada`); Jornada; consequências; rio; extração; comodidade; preço rolado |
| `tabela` | montagem da tabela do hex, pesos efetivos, faixas do d100, rolagem, aplicação do resultado, `pode_rolar` |
| `visao` | raio por tipo, hexes visíveis com penhasco, visão embarcado no rio (`visiveis_na_aresta`), estado da névoa |
| `camadas` | mapa em jogo a partir da base e das camadas alternativas (`compor`); chave de estado `CCLL@camada` |
| `validador` | as conferências de `03-dados.md` §5 |

**Garantias**
- `referencia/tests/test_nucleo.py`: 45 testes, incluindo os testes negativos do validador.
- `testes/vetores-regras.json`: 248 casos de entrada → saída, válidos para qualquer linguagem. São gerados por
  `referencia/gera_vetores.py`.
  - O grupo `montagemPython` depende do `random.Random` do Python e só vale para o backend.

Na F0, o núcleo é **promovido** a `hexcrawl/nucleo/`. O app pode refatorar à vontade, desde que os testes e os
vetores continuem passando. Se um vetor parecer errado, **pergunte antes de mudar**: ele é a regra.

## 2. O que o app acrescenta

### 2.1 Rota (`hexcrawl/rota`)
- **A\*** sobre o mapa em jogo, que é a composição das camadas ligadas.
- O custo de cada passo é o `custo_do_passo` (`01-regras.md` §2.5): a via só manda quando o passo a segue.
- **Penhasco** bloqueia a passagem.
- **Rio sem ponte** não custa metros, mas exige teste. O planejador soma um **peso de preferência** só na busca (por
  exemplo, +6) para preferir pontes.
  - Esse peso **não é regra**. O plano mostra a travessia e a CD, e o mestre pode forçar o caminho.
- **Embarcado:** o grafo é o das arestas do rio (vértice a vértice) e dos hexes de Água, com
  `custo_embarcado(barco, na_agua)`.
- **Hex de cidade** é atravessável como o tipo dele. Entrar no mapa da cidade é decisão do mestre, fora do app.
- **Heurística:** distância × 1,5, o menor custo possível. É admissível.

### 2.2 Plano de viagem (pré-visualização)
O mestre escolhe um destino e o app **simula** o relógio do dia (`01-regras.md` §3.3). Para cada passo, ele mostra:
- o custo, o restante e o período;
- **onde caem as paradas**, com a Jornada de cada uma e o H dela;
- onde o dia acaba (explorar e descansar);
- as travessias de rio, com a CD.

A simulação usa as mesmas funções do avanço real:
- se `pode_entrar` é falso, o dia fecha e o seguinte começa com `novo_dia(orcamento, divida)`;
- a dívida passa adiante.

### 2.3 Ações da sessão (`hexcrawl/sessao`)
Cada ação é uma transição do `estado.json`. Ela grava no `diario` e guarda um instantâneo para **desfazer**.

| Ação | Efeito |
|---|---|
| `andar(hex)` | Confere `pode_entrar` e aplica `regras.andar`. Recalcula a visão e soma aos `vistos`. Cruzou rio sem ponte? Abre a travessia (§2.5). Encerrou período? **Parada** (§2.4). Acabou o movimento? **Fim do dia** (§2.4) |
| `explorar()` | **Parada**: lembra a Jornada. Se `pode_rolar`, monta a tabela do hex (se ainda não houver), rola o d100 com o viés de extração e aplica o resultado. Depois aplica `regras.explorar`, que pula o período. **Explorar um hex que não rola também pula o período.** Se o período virou fim do dia, vai ao descanso, sem explorar de novo |
| `encerrar_dia()` | O mestre fecha o dia onde o grupo está: o mesmo protocolo do fim do movimento |
| `embarcar(barco)` / `desembarcar(hex)` | Troca o grafo de movimento e o custo pelo da embarcação. O orçamento continua o do grupo (`01-regras.md` §3.2) |
| `extrair(personagem, material, resultado)` | Recebe o resultado do teste e calcula `unidades_extraidas`. Cada personagem extrai uma vez por sítio |
| `gerar_comerciante()` | Estoque e preços (§2.8) |
| `ligar_camada(regiao, sim_ou_nao)` | Liga ou desliga uma camada no estado da campanha. Recompõe o mapa nas duas janelas. Num par alternativo, ligar um lado desliga o outro, por padrão |
| `mover_grupo(hex)` | Ajuste manual do mestre, sem custo, como o arrasto do rio ou um teleporte |

### 2.4 Paradas e fim do dia
- **Parada** acontece quando um passo encerra período, quando o grupo explora e quando o movimento acaba
  (`regras.andar` devolve `encerrados`, `parada` e `fimDoDia`).
- Em toda parada:
  1. `fechar_parada` devolve o trecho.
  2. O H da parada é `hostilidade_da_parada(Hs do trecho, H do hex atual)` `[P16]`.
  3. O app mostra o **lembrete da Jornada** (§2.6).
- **Fim do dia:**
  1. Lembrete da Jornada da última parada.
  2. Se `explorouAqui` for falso, o grupo explora o hex: rola a tabela, se o hex rolar.
  3. Descanso (§2.7) e `novo_dia` com a dívida.
- **Todo lembrete pode ser dispensado pelo mestre.** O app nunca trava a mesa.

### 2.5 Travessia de rio
1. Mostra a CD do rio: `cd_rio` com o **maior H** entre os dois hexes da aresta.
2. Para cada membro, **o app pede o resultado do teste**. Ele não rola: os jogadores rolam.
3. Para quem falha, o dano (`dano_falha_rio`, 2d6+3) e o arrasto (`arrasto_rio`: 1d6 hexes, ou seja, 2 arestas por
   hex rio abaixo) são dados do mestre:
   - o app rola, ou recebe o resultado do dado físico;
   - ele sugere o hex de saída, e o mestre confirma ou move.
4. O token do grupo fica onde o mestre decidir. Grupo separado é com a mesa.

### 2.6 Jornada (uma por parada)
1. O app mostra o lembrete: *"Jornada: escolham as ações e rolem."*, com o H e a meta (`meta_jornada(H)`).
2. O mestre informa a ação e o resultado de cada membro, ou só o total de pontos. O app soma com `pontos_da_acao`.
3. Se o grupo não bateu a meta, o app pede o **d100 que o grupo rolou** e mostra:
   - a faixa e as fórmulas de `consequencia(d100, H)`;
   - o texto da região.
4. O dano é dado do mestre: o app rola ou recebe o resultado. Tudo vai para o diário. O app não aplica dano em ficha.

### 2.7 Descanso
1. O app pede o maior resultado de *Sobrevivência* do grupo.
2. Calcula `comodidade_ao_ar_livre(resultado, bonus)`, com bônus 1 se o hex tem Abrigo marcado.
3. Mostra o X do Xd8.
4. Mostra o lembrete da emboscada e pergunta quem vigia. O Sistema não dá chance de emboscada (`01-regras.md` §3.4).
5. Zera `extracoesNoDia`. O dia avança e o período volta a manhã.

### 2.8 Comerciante ambulante
- Lê o CSV do Bazar, que é do Pedro e só para leitura, filtrando pela região na coluna `Obtenção`.
  - A Bacia usa o pool do CR 2: Emaranhado e Costas.
- Sorteia 2d4 itens com teto de raridade pelo CR.
- Rola o preço de cada item (`preco_rolado`) e mostra o estoque de 250 Sins.

### 2.9 Montagem, sementes e camadas
- A tabela de cada hex é montada **quando ele é explorado pela primeira vez**.
  - Ou antes, em lote, pelo botão "montar tabelas da região", para o mestre revisar e travar.
- A semente da montagem é estável: `random.Random(f"{semente}:montagem:{chave}")`, sendo `chave` a do estado
  (`CCLL` ou `CCLL@camada`). Mesma campanha, mesmas tabelas.
- As rolagens da sessão não precisam ser reproduzíveis: o valor sorteado vai para o diário, e desfazer restaura o
  instantâneo.
- **Remontar** uma tabela não travada é ação do mestre.
- Quando um notável ou raro sai, `aplicar_resultado` o tira de todas as tabelas já montadas.
- **Tudo o que é por hex usa a chave de estado da camada** (`camadas.compor` dá `_chave`). A névoa usa só `CCLL`.

## 3. Números que são proposta
Estes valores ficam em constantes nomeadas, e não espalhados pelo código, até o Pedro responder em
`10-pendencias.md`:
- P16: o H da parada; uma Jornada por parada quando um passo encerra dois períodos; o texto da consequência; o hex de
  conflito;
- embarcar e desembarcar sem custo.
