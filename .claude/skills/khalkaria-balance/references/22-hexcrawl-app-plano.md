# Aplicação de hexcrawl de Kharavel: plano para o agente programador (2026-10-22)

O que é: uma ferramenta do mestre para preparar e rodar a exploração de Kharavel em grade hexagonal. Ela faz quatro
coisas:
- **edita** o mapa: um tilemap com pincéis;
- **guarda** os hexes e as tabelas de eventos;
- **calcula** a jornada sozinha;
- **mostra** aos jogadores um mapa com névoa.

**As regras estão em `21-mapas-hexagonais.md` e mandam sobre este plano.** Quando um número daqui divergir do `21`,
vale o `21`. O app não inventa regra: o que não está no `21` volta ao Pedro.

Princípios do Pedro: *"Visual, organização e interface elegante é prioridade."* Os dados ficam numa estrutura (JSON
ou SQL) que um agente consiga preencher (*"delegar a modelagem da geografia inicial [...] para o agente"*).

---

## 1. Funcionalidades

### 1.1 Editor (preparação, só o mestre)
| Ferramenta | O que faz |
|---|---|
| Camada de referência | mostra a arte original do continente, semitransparente, sob a grade. É a régua para preservar a geografia |
| Pincel de terreno | pinta o tipo de hex (10 tipos) e troca o ícone |
| Pincel de região | pinta a região, que dá a cor e a textura do solo; tem preenchimento por área |
| Carimbo de especial | põe um hex especial: marco, vila pré-feita, portão de cidade |
| **Pincel de via, ancorado no centro** | arrasta-se de hex em hex; a estrada ou trilha passa pelos centros e sai perpendicular à aresta |
| **Pincel de aresta** | rio, ponte (só sobre aresta de rio cortada por via) e penhasco (com o lado alto marcado) |
| **Pincel de borda** | contorna o território de uma cidade pelas bordas dos hexes |
| Inspetor do hex | tipo, região, custo e Hostilidade próprios, especial, notas, a tabela do hex (revisar e travar) |
| Desfazer/refazer, camadas liga/desliga, zoom e arraste | o básico de editor |
| Conferência ao vivo | as validações da §3.4 rodam a cada mudança e listam os problemas |

### 1.2 Conteúdo (preparação)
- Cadastro das regiões: cor do solo, rank, Hostilidade, parâmetros de montagem.
- A tabela de consequências de cada região: os textos das 7 faixas.
- A tabela global de eventos de cada região.
- A montagem das tabelas dos hexes (§5.3 do `21`), com semente, e a revisão e trava de cada uma.

### 1.3 Sessão (o mestre na mesa)
- **O grupo:** posição, membros, menor Movimento, embarcação contratada (se houver).
- **Planejar a rota:** o mestre clica no destino ou desenha o caminho, e o app calcula:
  - o custo de cada hex;
  - os dias de viagem;
  - os 3 períodos de cada dia e onde caem as paradas;
  - as travessias de rio e a CD de cada uma;
  - a Hostilidade do dia e a meta da Jornada.
- **Avançar:** o app move o grupo e, em cada parada:
  1. lembra a Jornada do dia e rola o d100 de consequência, se o grupo falhou;
  2. rola a tabela do hex;
  3. marca o mapa, se o evento for notável ou raro.
- **Comerciante ambulante:** gera a lista de itens com preço rolado.
- **Extração:** viés do dia e cálculo de unidades.
- **Descanso:** fecha o dia, zera o viés de extração, lembra a vigia (emboscada) e calcula a comodidade ao ar livre.
- **Diário:** registro de tudo o que foi rolado, com data de jogo.

### 1.4 Tela dos jogadores
- Uma segunda janela para a TV ou o segundo monitor, sincronizada ao vivo.
- Mostra só o que o grupo avistou: textura, ícone, vias, arestas e marcas.
- Mostra a posição do grupo.
- **Nunca** mostra tabela, Hostilidade nem o hex oculto.

## 2. Arquitetura recomendada

**Recomendação: aplicação local em Python com interface no navegador.**
- **Backend em Python (FastAPI):**
  - o motor de regras, puro e testado;
  - a leitura e gravação dos JSON e a validação;
  - o WebSocket que sincroniza a tela dos jogadores.
- **Frontend em TypeScript**, com **PixiJS** (WebGL) para o tilemap e HTML/CSS para os painéis.
  - A interface elegante sai mais fácil em HTML/CSS do que em widgets de desktop.
  - A tela dos jogadores é só outra janela do navegador.
- Roda com `python -m hexcrawl`, que abre o navegador.
- Fica no mesmo ecossistema do Bestiário (Flask) e do site.

Alternativas, se o Pedro preferir:
- **PySide6 (Qt), tudo em Python, desktop:** a `QGraphicsScene` é ótima para editores 2D, mas deixar a interface
  elegante dá mais trabalho.
- **Godot:** tem tilemap hexagonal e névoa prontos, mas é GDScript, fora do Python.

**Repositório separado** (sugestão: `khalkaria-hexcrawl`). O app não entra no repositório do site.

### 2.1 Módulos
| Módulo | Conteúdo |
|---|---|
| `hexmath` | coordenadas (offset odd-r ↔ axial ↔ cubo), vizinhos, as 6 direções do hex pontudo, arestas canônicas, distância, linha (visão), centro e cantos em pixels. Referência: *Red Blob Games, Hexagonal Grids* |
| `dados` | modelos, carga e gravação dos JSON, JSON Schema, conferências (§3.4), migração por `schemaVersion` |
| `regras` | funções puras da §4, com semente; cada exemplo do `21` vira teste |
| `rota` | Dijkstra/A\* sobre o custo dos hexes, respeitando as arestas: penhasco bloqueia; rio permite, mas marca a travessia; ponte é livre |
| `visao` | raio de visão por tipo, linha de visão e penhasco com lado alto |
| `sessao` | estado da campanha, diário, avanço de tempo |
| `integracoes` | CSV do Bazar, Bestiário, ficha do site (§6) |
| `web` | API, WebSocket, frontend |

### 2.2 Ordem das camadas no desenho (de baixo para cima)
1. Referência (só no editor)
2. Solo do tile: textura com a cor da região
3. Relevo e ícone do tipo de hex
4. Especiais e marcas de evento
5. Vias: estrada (linha cheia) e trilha (tracejada), curvas suaves de centro a meio da aresta
6. Arestas: rio (traço com leve sinuosidade gerada), ponte, penhasco
7. Bordas de região e de território
8. Rótulos: coordenada e "→ Para [região]" no anel vizinho
9. Grupo
10. Névoa (só na tela dos jogadores; no editor, é opcional e semitransparente)
11. Seleção e ferramentas

## 3. Modelo de dados (JSON como fonte)

**Recomendação: JSON como fonte**, validado por JSON Schema e versionado no git. Um agente escreve e confere JSON
com facilidade, e o git mostra cada mudança. SQLite só faria sentido como cache, e com ~600 hexes não precisa.

A pasta `mundo/` guarda o que é **preparado**; ela muda pouco. A pasta `campanha/` guarda o **estado do jogo**; ela
muda a cada sessão. Assim, reiniciar uma campanha não toca no mapa.

### 3.1 Coordenadas e identificadores
- O id do hex é `CCLL`, com coluna e linha de 2 dígitos em offset **odd-r** (pontudo, linhas ímpares deslocadas). Ex.:
  `"0712"`. É o mesmo rótulo que aparece no mapa.
- Por dentro, o app converte para axial ou cubo nas contas.
- Direções do hex pontudo: `L`, `NE`, `NO`, `O`, `SO`, `SE` (leste, nordeste, noroeste, oeste, sudoeste, sudeste).
- **Aresta canônica:** cada aresta pertence a um hex só, pela direção `L`, `NE` ou `NO`. A aresta `O` de `0712` é a
  `L` do vizinho a oeste. Isso evita registrar a mesma aresta duas vezes.

### 3.2 `mundo/`
**`mundo.json`**
```json
{
  "schemaVersion": "hexcrawl-mundo/1",
  "grade": {"orientacao": "pontuda", "offset": "odd-r", "colunas": 30, "linhas": 35,
            "referencia": {"arquivo": "arte/kharavel.png", "origemPx": [0, 0], "larguraHexPx": 64}},
  "tipos": [{"id": "campos", "nome": "Campos", "custo": 4.5, "icone": "campos", "visao": 1}],
  "regioes": [{"id": "bacia-acidentada", "nome": "Bacia Acidentada", "rank": 4, "cr": "2",
               "hostilidade": 10, "corSolo": "#8c8c88", "corBorda": "#bdbdbd",
               "montagem": {"entradas": [8, 12], "mistura": {"favoravel": 0.33, "neutro": 0.34, "adverso": 0.33},
                            "variacao": 0.10, "pesos": {"comum": 10, "notavel": 3, "raro": 1}}}],
  "cidades": [{"id": "khaskavel", "nome": "Khaskavel", "mapaProprio": "cidades/khaskavel"}]
}
```

**`hexes.json`**: um registro por hex.
```json
{"id": "0712", "regiao": "bacia-acidentada", "cidade": null, "tipo": "pantano",
 "custo": null, "hostilidade": null, "variante": 2,
 "especial": null, "notas": ""}
```
- `custo` e `hostilidade` são `null` quando valem o do tipo e o da região.
- `especial`, quando há, é `{"id", "nome", "icone", "textoMestre", "textoJogadores", "conflito": true|false}`.
  `conflito` liga a exceção da Jornada.

**`arestas.json`**
```json
{"hex": "0712", "dir": "NE", "tipo": "rio", "rio": "rio-das-cinzas"}
{"hex": "0712", "dir": "L", "tipo": "penhasco", "ladoAlto": "0712"}
```
A ponte é um rio com `"ponte": true` na mesma aresta.

**`rios.json`**: `{"id", "nome", "arestas": [...]}`, com as arestas **em ordem, da nascente à foz**. A ordem é o que
permite o "1d6 hexes rio abaixo".

**`vias.json`**: `{"id", "tipo": "estrada"|"trilha", "nome", "hexes": ["0712", "0812", ...]}`. Os hexes seguidos têm
de ser vizinhos.

**`territorios.json`**: `{"id", "nome", "cor", "hexes": [...]}`. A borda se desenha em volta do conjunto.

**`eventos/<regiao>.json`**: a tabela global de eventos da região.
```json
{"id": "bacia-ruina-afogada", "nome": "Torre Afogada", "categoria": "ruina",
 "raridade": "notavel", "polaridade": "neutro", "tipos": ["pantano", "litoral"],
 "icone": "ruina", "textoMestre": "...", "textoJogadores": "...",
 "mecanica": {"masmorra": "torre-afogada"}, "travaNarrativa": false}
```
A `mecanica` muda conforme a categoria:
- combate: `{"cr", "criaturas": [ids do Bestiário]}`;
- extração: `{"materiais": [nomes do Bazar]}`;
- comerciante: `{"nivel": 1, "raridadeMax"}`;
- assentamento: `{"servicos", "comerciantes", "sideQuests"}`;
- covil: `{"faccao", "cr"}`.

**`consequencias/<regiao>.json`**: as 7 faixas com o texto da região. Os números **não** vêm deste arquivo: o
motor usa os do Sistema (`21` §4.2), e o arquivo só traz o texto.

### 3.3 `campanha/estado.json`
```json
{"schemaVersion": "hexcrawl-campanha/1", "semente": 12345,
 "tempo": {"dia": 3, "periodo": "tarde"},
 "grupo": {"hex": "0712", "membros": [{"nome": "...", "movimento": 9}], "embarcacao": null},
 "nevoa": {"0712": "visitado", "0812": "avistado"},
 "tabelas": {"0712": {"entradas": [{"evento": "bacia-ruina-afogada", "peso": 3}], "travada": true}},
 "hexDefinido": {"0915": "bacia-ruina-afogada"},
 "consumidos": ["bacia-ruina-afogada"],
 "extracoesNoDia": 1,
 "diario": [{"dia": 3, "periodo": "manha", "hex": "0712", "tipo": "jornada", "d100": 42, "texto": "..."}]}
```

### 3.4 Conferências (o validador roda no editor e no CI)
1. Todo hex de terra tem região ou cidade. Nenhum hex tem as duas, e nenhum tem tipo `agua` com região de terra sem
   ser lago.
2. Toda via é contínua (hexes vizinhos) e termina num especial, numa cidade ou numa fronteira de região (gramática
   das vias).
3. Toda via que cruza uma aresta de rio tem ponte ali.
4. Os rios são contínuos: arestas seguidas compartilham um canto, e a foz fica no mar ou no lago.
5. Todo penhasco tem `ladoAlto` igual a um dos dois hexes da aresta.
6. Os ids de evento são únicos na região. Todo evento cita tipos de hex que existem, e a mecânica cita ids que existem
   (Bestiário, Bazar).
7. Contagem por região e por tipo, com o relatório "hexes sem tabela possível": o tipo do hex não tem nenhum evento
   na região.

## 4. Motor de regras (funções puras, todas com teste)

| Função | Regra (`21`) |
|---|---|
| `custo(hex, via)` | via manda: estrada 1,5, trilha 3; senão o custo do hex ou do tipo |
| `orcamento(grupo)` | o menor Movimento; com embarcação, o barco anda pelas arestas a 1,5 m cada |
| `plano(caminho, orcamento)` | divide por dia; períodos a 1/3 e 2/3 do gasto; 1 parada por hex; hex mais caro que o orçamento leva 2 dias |
| `hostilidade_do_dia(hexes)` | a maior do dia |
| `meta_jornada(H)` | 3 + H/5 |
| `consequencia(regiao, d100, H)` | a faixa e o dano com +H (no 100, nada) |
| `cd_rio(H)` | 10 + H/2 |
| `montar_tabela(hex, regiao, semente)` | filtro por tipo, 8–12 entradas, mistura ± variação, pesos 10/3/1 |
| `rolar_hex(hex, estado)` | d100 sobre os pesos; notável ou raro: marca, consome e recalcula todas as tabelas da região |
| `peso_extracao(k)` | peso × 0,5ᵏ; o descanso zera k |
| `unidades(resultado, cd)` | 1 + ⌊(resultado − CD)/5⌋; 0 na falha |
| `comerciante(regiao, semente)` | itens do Bazar da região, raridade até o teto do rank, preço rolado na faixa |
| `visao(hex)` | raio por tipo, linha de visão, penhasco |

**Rolagens com semente e diário.** Toda rolagem vai para o diário com o valor sorteado, para o mestre poder refazer
ou desfazer.

## 5. Geografia inicial (o que pode ir para um agente)

O objetivo é preencher `hexes.json`, `rios.json` e um rascunho de `vias.json` a partir da arte do continente, sem
desenhar 600 hexes à mão.
1. **Arte original:** a captura não serve. As duas artes do Pedro (90 MB) podem vir pelo Google Drive (há conector
   nesta sessão) ou por Git LFS no repositório novo.
2. **Calibração:** fixa a origem e a largura do hex sobre a arte (`grade.referencia`), de modo que 30 colunas cubram o
   continente.
3. **Amostragem automática por hex:** separa água de terra pela cor e sugere o tipo por cor e textura (agrupamento com
   alguns hexes marcados à mão como exemplo). Cada sugestão sai com um grau de confiança.
4. **Regiões:** o Pedro pinta com o pincel de região sobre a referência. Com o preenchimento por área, são minutos.
   O agente pode adiantar um rascunho pelos contornos coloridos da arte.
5. **Rios e vias:** o agente traça um rascunho seguindo a arte. **O desenho final das vias é do Pedro**, porque é ali
   que está o game design.
6. **Revisão no editor:** a lista de baixa confiança e as conferências da §3.4.

Um agente de visão sozinho erra demais numa grade de 600 hexes. O caminho é script mais revisão.

## 6. Integrações
| Fonte | Uso | Observação |
|---|---|---|
| CSV do Bazar (do Pedro) | Materiais por região (extração) e itens do comerciante ambulante | a coluna `Obtenção` traz "Drop CR X · Região · Loja"; **não há itens da Bacia Acidentada** |
| Bestiário (Flask + SQLite) | criaturas dos combates, por CR | falta saber se a criatura tem região; senão, a lista vai no evento |
| Ficha do site (export JSON) | importar o grupo: Movimento e perícias para a Jornada | fase posterior |

## 7. Arte
**Recomendação: tile em 2 camadas.**
- A **textura de solo** recebe a cor da região. São 9 cores sobre poucas texturas-base.
- O **relevo ou ícone do tipo** é uma arte fixa, com 2 ou 3 variantes por tipo para não repetir.

Isso cobre "a cor do solo é a região" e "o tipo é o ícone do custo" com cerca de 30 peças, contra ~90 se cada tipo
tivesse arte por região. A imagem 2 do Pedro (tiles com borda em relevo) é a referência de estilo.

**Especificação:**
- hex pontudo de 256 px de largura (≈296 px de altura);
- PNG ou WebP com transparência;
- ícones em SVG;
- pontes e penhascos nas 3 direções canônicas, espelhados para as outras 3.

**Peças:**
- solo: 9 cores sobre 3 ou 4 texturas-base;
- relevo: 10 tipos com 2–3 variantes;
- ícones: especiais e marcas de evento (ruína, assentamento, covil, mirante, achado);
- portões de cidade;
- grupo.

## 8. Fases (cada uma com critério de pronto)
| Fase | Entrega | Pronto quando |
|---|---|---|
| F0 Fundação | repositório, JSON Schema, validador, `hexmath` com testes, exemplos | os testes de vizinho, aresta, linha e conversão passam; um mapa de exemplo de 3 regiões valida |
| F1 Visualizador | desenha `mundo/` com as camadas, zoom e arraste, inspetor de leitura, referência de fundo | o mapa de exemplo aparece igual ao esboço |
| F2 Editor | todos os pincéis, desfazer, gravação, conferência ao vivo | o Pedro desenha uma região inteira sem tocar no JSON |
| F3 Geografia | pipeline da §5 e o continente revisado | as 7 conferências passam; os 9 recortes com anel vizinho se juntam no continente |
| F4 Regras | o motor da §4 com testes | cada exemplo do `21` vira teste e passa |
| F5 Sessão | painel do mestre, diário, tela dos jogadores com névoa ao vivo | uma sessão de teste roda 3 dias de viagem só pelo app |
| F6 Conteúdo | as tabelas das 9 regiões, as consequências e as integrações | toda região monta tabela para todos os tipos de hex dela |
| F7 Arte | os tiles texturizados e o polimento | aprovação visual do Pedro |

F0 a F2 não dependem de nenhuma decisão de regra aberta. Dá para começar já.

## 9. Conteúdo a produzir (autoria, fora do código)
- **Por região:**
  - os textos das 7 faixas de consequência;
  - ~12 comuns, ~15 notáveis e ~5 raros na tabela global;
  - as vilas e masmorras pré-feitas.
- **Ordem de grandeza:** cerca de 300 eventos. Um agente de conteúdo pode rascunhar, e o Pedro aprova (regra do
  projeto: conteúdo criativo precisa de aceite).

## 10. Riscos
- **Escopo:** o editor puxa funcionalidade sem fim. As fases e os critérios de pronto seguram.
- **Arte inconsistente** entre os tiles: as 2 camadas e uma paleta fechada por região ajudam.
- **Regra no código sem fonte:** todo número sai do `21`. O que faltar volta ao Pedro, nunca é preenchido pelo agente.
- **Tabela esgotada:** quando os notáveis e raros acabam, uma região só rola comuns. O relatório da §3.4 avisa.

## 11. Decisões para o Pedro (a recomendação vem primeiro)
1. **Tecnologia:** app local Python (FastAPI) com interface no navegador (TypeScript + PixiJS), ou desktop em PySide6,
   ou Godot?
2. **Repositório separado** para o app?
3. **JSON como fonte** (SQLite só como cache, se precisar)?
4. **Arte em 2 camadas** (solo com a cor da região + relevo do tipo)?
5. **Como mandar as duas artes de 90 MB:** Google Drive (consigo ler por aqui) ou Git LFS?
6. **Bestiário:** as criaturas têm região cadastrada? Se não, os combates listam as criaturas no próprio evento.
