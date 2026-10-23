# 03 · Dados

O JSON é a fonte, validado por JSON Schema (`schemas/`) e versionado no git. Um agente escreve e confere JSON com
facilidade, e o diff do git mostra cada mudança. Não há banco: com ~800 hexes, não precisa.

## 1. Pastas
```
dados/<mundo>/mundo/        o que é PREPARADO; muda pouco
  mundo.json                grade, tipos, regiões, cidades, materiais
  hexes.json                um registro por célula da grade
  arestas.json              pontes e penhascos
  rios.json                 rios: arestas em ordem, da nascente à foz
  vias.json                 estradas e trilhas
  territorios.json          contornos de cidade
  eventos/<regiao>.json     tabela global de eventos da região
  consequencias/<regiao>.json  textos das 7 faixas da Jornada
  camadas/<regiao>.json     hexes de uma região alternativa (ex.: a ilusão do Oásis)
dados/<mundo>/campanha/     o ESTADO do jogo; muda a cada sessão
  estado.json
```
- `dados/exemplo/` é um mundo pequeno (12 × 9) e válido, que usa todos os recursos do formato, inclusive uma camada
  alternativa (`exemplo-miragem`). Ele é gerado por `referencia/gera_exemplo.py` e serve de fixture dos testes. Tudo
  nele tem `"exemplo": true`.
- `dados/kharavel/mundo/` tem, por ora, só `mundo.json` e `consequencias/`. O resto sai da geografia inicial
  (`07-geografia.md`).

## 2. Convenções
| Item | Convenção |
|---|---|
| Hex | Topo chato, offset *odd-q*. A coluna de índice 0-based ímpar (rótulo par: 02, 04…) desce meio hex |
| Id do hex | `CCLL`: coluna e linha 1-based, 2 dígitos cada. `"0712"` é a coluna 7, linha 12. É o mesmo rótulo do mapa |
| Direções | `N`, `NE`, `SE`, `S`, `SO`, `NO` |
| Aresta canônica | Cada hex é dono das arestas `N`, `NE` e `SE`. A chave é `"CCLL:DIR"`: a aresta `S` de `0712` é guardada como `0713:N` |
| Contas | Axial (q, r) e cúbica (q, r, s), como em *Red Blob Games, Hexagonal Grids* |
| Ids de coisas | kebab-case ASCII: `bacia-acidentada`, `rio-das-cinzas` |
| Metros | Múltiplos de 1,5. O núcleo usa `Fraction` para a conta ser exata |
| Nulos | `null` em `custo` e `hostilidade` do hex quer dizer "o do tipo" e "o da região" |

**Geometria em pixel, na arte a 1x** (`hexcrawl_ref/hexmath.py`):
- Face do hex: 32 × 28 px, lado de 16 px. Vértices `(8,0) (24,0) (32,14) (24,28) (8,28) (0,14)`.
- Passo de 24 px por coluna e 28 px por linha; a coluna de índice ímpar desce 14 px.
- **Célula** da folha de tiles: 32 × 48. A face começa em y = 18 dentro da célula. Os 18 px de cima são folga para
  sprites altos, e os 2 px de baixo são a espessura do tile.
- Os vértices caem sempre em coordenada inteira e servem de **id de vértice**. É assim que se confere se duas arestas
  de rio se encostam.

## 3. Arquivos do mundo

### `mundo.json`
- **`grade`**:
  - `orientacao: "chato"`, `offset: "odd-q"`, `colunas`, `linhas`;
  - `referencia`: os mapas do Pedro e a calibração (origem e escala sobre a arte). Ver `07-geografia.md`.
- **`tipos[]`**: `id`, `nome`, `custo` (m), `visao` (raio), `soEmbarcacao`.
  - A Água tem `custo: null` e `soEmbarcacao: true`: o custo vem da embarcação.
- **`embarcacoes[]`**: `id`, `nome`, `custoAresta` (m por aresta de rio), `custoAgua` (m por hex de Água).
  - Galeão 1,5/1,5; Fragata 3/3; Canoa 4,5/4,5.
- **`regioes[]`**:
  - `id`, `nome`, `rank`, `cr`, `hostilidade`;
  - `cor` (legenda do mapa) e `tinta` (`cor`, `forca`, `dessaturar`);
  - `bioma` (`verde` | `neve` | `deserto`) e `paletaUI` (o kit de UI, `"01"`–`"18"`);
  - `montagem` (`entradas`, `mistura`, `variacao`, `pesos`);
  - `materiais[]` (no máximo 4: `nome`, `raridade`, `familia`, `tipos`) e `materiaisStatus` (`proposta` |
    `aprovado`);
  - `alternativaDe` (só nas regiões alternativas: a região da base cujas células ela ocupa) e `ativaPorPadrao`.
- **`cidades[]`**: `id`, `nome`, `mapaProprio`.
- **`foraDaExtracao`**: os Materiais que nunca saem de sítio de extração.

### `hexes.json`
```json
{"id": "0505", "tipo": "campos", "regiao": "exemplo-campos", "cidade": null,
 "custo": null, "hostilidade": null, "variante": null, "especial": null, "notas": ""}
```
- Terra tem **região ou cidade, exatamente uma das duas**.
- Água não pertence a cidade. Lago e mar são `tipo: "agua"`, com ou sem região.
- **`variante`**:
  - `null`: o tile sai de um sorteio estável pelo id do hex (`06-arte.md` §3);
  - um número: fixa o índice na lista de variantes do tipo e do bioma.
- **`especial`**: `{"id", "nome", "icone", "categoria", "conflito", "textoMestre", "textoJogadores"}`.
  - As categorias são `marco`, `assentamento`, `ruina`, `covil`, `refugio`, `portao` e `achado`.
  - `conflito: true` liga a exceção da Jornada.

### `camadas/<regiao>.json`
```json
{"schemaVersion": "hexcrawl-hexes/1", "camada": "exemplo-miragem",
 "hexes": [{"id": "0808", "tipo": "floresta", "regiao": "exemplo-miragem", "cidade": null, ...}]}
```
- Tem o mesmo formato de `hexes.json`, mais o campo `camada`.
- Só cobre as células que a região alternativa ocupa. Todo registro tem `regiao` igual à camada.
- O mapa em jogo é composto por `hexcrawl_ref/camadas.py` (`compor`):
  - a região da base desligada sai;
  - a camada alternativa ligada entra por cima.

### `arestas.json`
```json
{"aresta": "0905:SE", "tipo": "ponte"}
{"aresta": "1105:N", "tipo": "penhasco", "ladoAlto": "1104"}
```
- Os rios não ficam aqui (ficam em `rios.json`). A ponte só pode estar sobre aresta de rio.

### `rios.json`
- Formato: `{"id", "nome", "tamanho": "riacho"|"rio"|"rio-grande", "arestas": ["0902:SE", "0903:NE", ...]}`.
- As arestas ficam **em ordem, da nascente à foz**. A ordem dá o "rio abaixo" do arrasto.
- Arestas seguidas compartilham um vértice.
- A foz encosta em água ou em outro rio (confluência).

### `vias.json`
- Formato: `{"id", "tipo": "estrada"|"trilha", "nome", "hexes": ["0404", "0504", ...]}`.
- Os hexes seguidos são vizinhos.
- Uma via termina num especial, numa cidade ou numa fronteira de região. Se não terminar, a conferência avisa.

### `territorios.json`
- Formato: `{"id", "nome", "cor", "cidade", "hexes": [...]}`.
- A borda é desenhada em volta do conjunto.

### `eventos/<regiao>.json`
```json
{"schemaVersion": "hexcrawl-eventos/1", "regiao": "bacia-acidentada", "status": "rascunho",
 "eventos": [{"id": "bacia-torre-afogada", "nome": "Torre Afogada", "categoria": "ruina",
              "raridade": "notavel", "polaridade": "neutro", "tipos": ["pantano", "litoral"],
              "marca": true, "icone": "ruinas", "textoMestre": "...", "textoJogadores": "...",
              "mecanica": {}, "travaNarrativa": false}]}
```
- Os **ids de evento são únicos no mundo inteiro**. O prefixo da região evita colisão.
- `marca`: notável e raro marcam sempre. Um comum só marca com `true` (o Abrigo).
- `mecanica`, por categoria:

  | Categoria | `mecanica` |
  |---|---|
  | `extracao` | `{"materiais": "auto"}` (os da região que listam o tipo do hex) ou uma lista de nomes |
  | `combate` | `{"cr", "criaturas": [texto livre]}`; sem Bestiário |
  | `comerciante` | `{"nivel": 1, "quantidade": "2d4", "raridadeMax"}` |
  | `abrigo` | `{"comodidade": 1}` |
  | `assentamento` | `{"servicos", "comerciantes", "sideQuests"}` |
  | `covil` | `{"faccao", "cr"}` |
  | `ruina` | `{"masmorra"}` |

- `status`: `rascunho` (escrito por agente) ou `aprovado` (aceito pelo Pedro).

### `consequencias/<regiao>.json`
- São as 7 faixas, `{"de", "ate", "texto"}`, iguais às do Sistema.
- **Os números não vêm deste arquivo:** o motor usa os do Sistema (`01-regras.md` §4.2). O arquivo só traz o texto
  temático.

## 4. `campanha/estado.json`
| Campo | Conteúdo |
|---|---|
| `semente` | semente das rolagens e das montagens |
| `tempo` | `{"dia", "periodo"}` |
| `grupo` | `{"hex", "aresta", "membros": [{"nome", "movimento"}], "embarcacao": null \| {"id", "nome"}}`. `aresta` é a aresta de rio onde o barco está |
| `dia` | `{"orcamento", "restante", "divida", "andados", "trecho", "explorados", "explorouAqui"}`. `trecho` são os hexes desde a última parada (H da Jornada) |
| `camadas` | `{"<regiao>": true \| false}`: camadas ligadas e desligadas. Sem chave, vale `ativaPorPadrao` |
| `vistos` | hexes que já estiveram no campo de visão (a névoa preta sai). "Visível agora" é recalculado, não salvo |
| `tabelas` | `{"CCLL": {"entradas": [{"evento", "peso"}], "travada"}}`: só os hexes já montados. Num hex de camada alternativa, a chave é `"CCLL@<camada>"` (vale para `definidos` e `revelados` também) |
| `definidos` | `{"CCLL": evento}`: hexes marcados (notável, raro ou Abrigo) |
| `revelados` | `{"CCLL": [eventos]}`: o que os jogadores já viram em cada hex |
| `consumidos` | notáveis e raros que já saíram |
| `extracoesNoDia` | o k do viés de extração; o descanso zera |
| `diario` | `[{"dia", "periodo", "hex", "tipo", "texto", "rolagem"}]` |

## 5. Conferências (`hexcrawl_ref/validador.py`)
**FALHA** impede salvar ou publicar. **AVISO** só informa.

| # | Conferência | Nível |
|---|---|---|
| 1 | A grade tem um registro por célula; os ids não se repetem | falha |
| 2 | O tipo, a região e a cidade existem; a terra tem região ou cidade (exatamente uma); a água não tem cidade | falha |
| 3 | A via é de tipo válido, tem 2 hexes ou mais, e os hexes seguidos são vizinhos | falha |
| 4 | A via termina em especial, em cidade ou em fronteira | aviso |
| 5 | O rio está dentro da grade, sem aresta repetida, com arestas seguidas encostando num vértice | falha |
| 6 | A foz encosta em água ou em outro rio | aviso |
| 7 | A ponte está só sobre rio; o penhasco tem `ladoAlto` válido; nenhuma aresta é rio e penhasco ao mesmo tempo | falha |
| 8 | Via que cruza rio sem ponte | aviso (vau proposital?) |
| 9 | Os hexes dos territórios existem | falha |
| 10 | Os ids de evento são únicos no mundo; categoria, raridade, polaridade e tipos são válidos | falha |
| 11 | Hex neutro sem nenhum evento possível na região | aviso |
| 12 | As faixas de consequência são iguais às do Sistema | falha |
| 13 | A região alternativa aponta para uma região da base; a base não usa região alternativa | falha |
| 14 | O arquivo de camada é de uma região alternativa; os hexes dele existem, não se repetem, têm tipo válido e `regiao` igual à camada | falha |
| 15 | O hex da camada cobre uma célula de outra região que não a `alternativaDe` | aviso |
| 16 | Os ids de embarcação não se repetem; o tipo só de embarcação não tem custo próprio | falha / aviso |

- Uso: `python -m hexcrawl_ref.validador dados/exemplo/mundo`. O resumo traz a contagem por tipo e por região.
- No app, o validador roda **ao vivo no editor** e no CI.

## 6. Versão e migração
- Todo arquivo tem `schemaVersion` (`hexcrawl-mundo/1`, `hexcrawl-hexes/1`...).
- Mudança incompatível sobe a versão e ganha uma função de migração em `hexcrawl/dados/migracao.py`, com teste.
- Os arquivos são gravados com `indent=1`, `ensure_ascii=False`, `\n` no fim e chaves em ordem estável. Assim, o diff
  do git fica legível.
