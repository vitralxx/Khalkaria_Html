# 02 · Arquitetura

## 1. Decisão
O Pedro deixou a escolha com o agente de balanceamento (*"mas você que sabe"*). O que ele quer:
- UI refinada e sensação de roguelike;
- sensação de app de desktop, com customização extrema;
- duas janelas, mestre e jogadores, com a dos jogadores num segundo monitor;
- unificar, mais tarde, com o Bestiário (Flask + SQLite) e com o site de regras (estático, GitHub Pages).

**Recomendação: núcleo em Python, servidor local e interface web, abertos em janelas nativas.**

| Peça | Escolha | Por quê |
|---|---|---|
| Núcleo de regras | Python 3.12, puro, testado | Já existe: é `referencia/hexcrawl_ref`, com 45 testes e 248 vetores |
| Servidor local | FastAPI + uvicorn | Serve a API, o WebSocket e o frontend. Mais tarde, pode hospedar o Bestiário também |
| Janelas | **pywebview** (≥ 5) | Janelas nativas sem barra de navegador. Abre as janelas *Mestre* e *Jogadores*; a dos jogadores vai para o 2º monitor (`webview.screens`), em tela cheia |
| Mapa | TypeScript + **PixiJS v8** (WebGL) | Sprites, filtros e render textures. Escala *nearest* e zoom inteiro para pixel art nítida |
| Painéis | **Svelte 5** | Leve, reativo e bom para uma UI caprichada |
| Estilo | CSS com `border-image` (9-slice) | As molduras saem do kit de UI do Pedro, com `image-rendering: pixelated` |
| Build | Vite | Em dev, faz proxy para o FastAPI. Em produção, `web/dist` é servido pelo FastAPI |
| Distribuição | `python -m hexcrawl`; depois PyInstaller (pasta única) | Um comando para o Pedro, e um `.exe` quando estabilizar |

**O mesmo frontend roda num navegador comum** (`python -m hexcrawl --navegador`). É isso que mantém a porta aberta
para unificar com o site e o Bestiário.

**Alternativas descartadas**
- **Godot:** 2D excelente, mas fora do ecossistema Python e web, e a unificação vira reescrita.
- **Electron ou Tauri:** pesados, ou em outra linguagem; o pywebview dá o mesmo resultado em Python.
- **PySide6:** editor 2D bom, mas UI refinada custa mais.
- **App só no navegador, sem Python:** salvar arquivos fica preso à File System Access API, e o núcleo teria de ser
  portado inteiro.

## 2. Estrutura do repositório (proposta)
```
khalkaria-hexcrawl/
  CLAUDE.md  INICIO.md  README.md  pyproject.toml  .gitignore
  docs/                  regras, arquitetura, dados, interface, arte, geografia, fases, pendências
  schemas/               JSON Schema de cada arquivo de dados
  dados/
    kharavel/mundo/      mundo.json, hexes.json, arestas.json, rios.json, vias.json, territorios.json,
                         eventos/<regiao>.json, consequencias/<regiao>.json
    kharavel/campanha/   estado.json (muda a cada sessão)
    exemplo/             mundo pequeno e válido (12 x 9), usado nos testes
  assets/                tiles (terreno.png, vias.png, atlas.json), ui (paletas, molde), fontes
  arte/referencia/       mapas do continente (versões reduzidas no git; originais fora)
  hexcrawl/              pacote Python do app
    __main__.py          python -m hexcrawl [--navegador] [--mundo kharavel]
    nucleo/              hexmath, regras, tabela, visao, validador (promovidos de referencia/)
    dados/               carga, gravação atômica, schema, migração por schemaVersion
    rota/                caminho mais barato (A*), com vias, rios e penhascos
    sessao/              estado da campanha, ações, diário, desfazer
    servidor/            FastAPI: REST, WebSocket, projeção dos jogadores
    janelas.py           pywebview: Mestre e Jogadores
  web/                   frontend (Vite + TS + Pixi + Svelte)
    src/hex/             porte TS da geometria, testado contra testes/vetores-regras.json
    src/mapa/            camadas Pixi, tinta, névoa, rios e vias por código
    src/ui/              painéis, tooltip, inspetor, diário, molduras
  ferramentas/           scripts: reduzir referência, amostrar a grade, gerar atlas
  testes/                vetores-regras.json (contrato entre linguagens)
  tests/                 pytest
```

- **`referencia/` vira `hexcrawl/nucleo/` na F0**, por `git mv`. Não duplique: o núcleo é um só.
- `testes/vetores-regras.json` continua sendo o contrato. O Python e o porte TS passam pelos mesmos vetores.

## 3. Fluxo de dados
```
dados/*.json ──carga+schema──▶ núcleo (Python) ◀── ações do mestre (REST)
                                  │
                       estado da campanha (autoridade única)
                                  │
              ┌──── WebSocket ────┴──── WebSocket ────┐
         janela Mestre                        janela Jogadores
         (mundo inteiro)                (só a projeção dos jogadores)
```
- **O servidor é a autoridade.** As janelas só desenham e mandam intenções: "andar até 0712", "explorar",
  "registrar a Jornada", "pintar 0712 de floresta".
- **Projeção dos jogadores, montada no servidor.** A janela dos jogadores nunca recebe o mundo inteiro. Ela recebe:
  - o token;
  - os hexes vistos, com tipo, tile, vias, rios e marcas;
  - quais estão visíveis agora;
  - o que foi revelado em cada hex (nome, ícone, `textoJogadores`).

  Tabela, Hostilidade, eventos não revelados e `textoMestre` não saem do servidor. Há um teste de vazamento para isso
  (`05-interface.md` §6).
- **Rolagens com semente.** O estado guarda a `semente`. Cada rolagem vai para o `diario` com o valor sorteado, e o
  mestre pode desfazer.
- **Gravação atômica:** grava num arquivo temporário e renomeia. Há autosave, e o editor tem pilha de desfazer.
- **Mundo e campanha separados:** reiniciar a campanha não toca no mapa.

## 4. Desempenho
- 30 × 26 = 780 hexes, cerca de 1.000 sprites: trivial para o Pixi.
- **A tinta da região é assada na carga.** Cada par (tile, região) vira uma textura num canvas: 41 tiles × 9 regiões.
  O custo em tempo de execução é zero e a paleta fica exata. Mexer no controle de tinta re-assa só aquela região.
- O terreno fica num container estático (`cacheAsTexture`) e só é refeito quando o mapa muda.
- A névoa é uma camada própria, atualizada só nos hexes que mudaram de estado.

## 5. Pixel art nítida
- Desenhe o mundo a 1x (tile 32 × 48) e aplique zoom inteiro (2x a 6x).
- Use `TextureStyle.defaultOptions.scaleMode = 'nearest'` e `roundPixels: true`.
- No CSS, use `image-rendering: pixelated`. A fonte é a DungeonFont-PT em tamanhos múltiplos da grade dela.
- **Ordem de desenho por profundidade:** tiles altos (montanha, árvore gigante) cobrem o vizinho de trás. Ordene pelo
  y do centro do hex (`hexmath.profundidade`). Detalhes em `06-arte.md`.

## 6. Qualidade
- **pytest:** núcleo, dados, rota, sessão, servidor e o teste de vazamento da projeção.
- **vitest:** o porte TS da geometria contra os vetores.
- **Playwright:** capturas das duas janelas para conferir a renderização. Chromium já vem instalado no ambiente de
  nuvem do Claude Code.
- **CI no GitHub Actions:** pytest, vitest, validador dos dados e schemas.
