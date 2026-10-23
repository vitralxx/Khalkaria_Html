# 06 · Arte

Toda a arte é **pixel art** do Pedro. Ele não quer ilustração nova; ele quer o kit dele bem usado. Rios, vias, orla,
ponte e penhasco são **desenhados por código** na mesma linguagem visual.

> **Licença.** As folhas de tiles, vias e UI são assets do Pedro: mantenha o repositório **privado** e não os
> redistribua. A DungeonFont é CC0.

## 1. As folhas
| Arquivo | Conteúdo |
|---|---|
| `assets/tiles/terreno.png` | 256 × 288: 8 colunas × 6 linhas de células 32 × 48; 41 células com arte |
| `assets/tiles/vias.png` | 256 × 240: 8 × 5 células; 22 peças de via (11 cinza e 11 verdes) |
| `assets/tiles/atlas.json` | O que é cada célula e qual tile cada tipo usa. Gerado por `referencia/gera_atlas.py`, validado por `schemas/atlas.schema.json` |
| `assets/ui/paletas/01.png`–`18.png` | Kit de UI: o mesmo layout (320 × 256) em 18 paletas |
| `assets/ui/molde-branco.png` | O mesmo layout em branco, para tingir com qualquer cor |
| `assets/ui/_recortes-automaticos.png` | Tentativa de recorte automático; não confiável (§6) |
| `assets/fontes/` | DungeonFont original, DungeonFont-PT e o script que a gera |
| `arte/referencia/` | o continente com legenda e as 2 imagens de expectativa do Pedro |

**Geometria do tile** (medida nas imagens):
- A face do hex tem 32 × 28 e começa em y = 18 da célula.
- Os 2 px de baixo são a espessura (borda marrom `#914504` e `#af5211`).
- Os 18 px de cima são folga: montanha, árvore e torre sobem até 17 px acima da face (`acimaDaFace` no atlas).
- A **silhueta é simétrica**: espelhar na horizontal não muda nenhum pixel do contorno (medido). O espelho é seguro.

## 2. O que cada tile é (`atlas.json`, confirmado na D159)
| Linha | Conteúdo |
|---|---|
| 0 | campos, floresta, floresta densa, colinas, serra com pinheiros, pico nevado, água rasa, água funda |
| 1 | vila verde, vila de terra, castelo, plantação, floresta com clareira, pântano, campos claros, campos floridos |
| 2 (neve) | campos, floresta, floresta densa, colinas, serra com pinheiros, água com gelo, vila, fortaleza |
| 3 (deserto) | areia, areia com rochas, dunas, meseta, oásis, acampamento, vila, palácio |
| 4 | árvore gigante; 3 *props* sem hex (rocha com musgo, cristal, minério); 2 portos sobre água; farol; torre sombria |
| 5 | ruínas |

**Tipo × bioma → variantes (com peso):**

| Tipo | Verde | Neve | Deserto |
|---|---|---|---|
| campos | campos-verde 6, campos-claro 2, campos-floridos 2 | campos-neve | areia |
| floresta | floresta-verde 3, floresta-clareira 1 | floresta-neve | floresta-verde |
| floresta-densa | floresta-densa-verde | floresta-densa-neve | floresta-densa-verde |
| colinas | colinas-verde | colinas-neve | areia-rochas |
| montanha | montanha-pico 3, serra-pinheiros-verde 1 | serra-pinheiros-neve 2, montanha-pico 1 | meseta |
| pantano | pantano | pantano | pantano |
| deserto | areia 3, dunas 2 | areia 3, dunas 2 | areia 3, dunas 2 |
| ermo | areia 2, areia-rochas 1, com a tinta cinza dessaturada do Ermo | idem | idem |
| agua | rasa ou funda pela regra da §4 | gelo (rasa), funda | rasa ou funda |
| litoral | campos do bioma + orla por código (§4) | idem | idem |

- O bioma vem da região: Cordilheira é neve; Deserto e Ermo são deserto; o resto é verde.
- **Plantação** `[Pedro]`: Campos vizinho de um assentamento (especial ou evento marcado) soma `plantacao` (peso 3)
  às variantes (`atlas.json > pertoDeAssentamento`).
- Os especiais usam os tiles de `uso: "assentamento"` e `"especial"`, escolhidos no carimbo.

## 3. Repetição
O mesmo tile repetido em 500 hexes cansa a vista. As ferramentas, em ordem de prioridade:
1. **Variante sorteada de forma estável** pelo id do hex: um hash, como o FNV-1a de `"<mundo>:<hex>"`, ponderado
   pelos pesos do atlas. Se `hexes.json` tiver `variante`, ela manda.
2. **Espelho horizontal** sorteado pelo mesmo hash, só nos tiles com `espelhavel: true` (terreno e variantes).
3. **Brilho com jitter** de ±3%, multiplicando por um cinza quase branco.
4. **Força da tinta com ruído de baixa frequência:** ±0,04, num ruído de valor com período de ~6 hexes. A região não
   fica chapada.
5. **Floresta com via:** use a variante `floresta-clareira`. A estrada não passa por cima das copas.

Não gire os tiles: a perspectiva é fixa.

## 4. Cor por região, água e litoral
- **Tinta** (`mundo.json > regioes[].tinta`):

  `c' = mix(c, cor, forca)`; depois `c'' = mix(c', luminância(c'), dessaturar)`.
  - A força é integral em terreno e variante. Em água, assentamento e especial, vale a metade, para eles manterem a
    identidade.
  - Os valores iniciais (0,18; Deserto 0,15; Ermo cinza 0,30 com dessaturação 0,45) são ponto de partida. O Pedro
    aprova com o controle ao vivo do editor.
- **Assar na carga:** cada par (tile, região) vira uma textura, e a paleta fica exata (`02-arquitetura.md` §4).
- **Água:**
  - hex de água com vizinho de terra usa a rasa (`#18aee4`); no bioma neve, a de gelo;
  - os demais hexes de água usam a funda (`#0b589e`).
- **Litoral:** o tile de campos do bioma e, por código, nas arestas que encostam em água:
  - uma faixa de areia de 2 px (paleta da `areia`);
  - espuma em pontilhado (`#29c0f6`).

## 5. Rios, vias, ponte e penhasco, por código
A folha `vias.png` só tem peças que ligam as **diagonais** (NE, SE, SO, NO): não há N e S, nem pontas. Isso foi medido
e está em `atlas.json > vias.pecas`. Por isso **as vias são desenhadas por código** `[Pedro]`, e a folha serve de
referência de estilo e de paleta. A paleta verde da folha não é usada.

**Rio** (o Pedro quer *"bonitos com alguma transição de sobreposição"*)
- **Traçado.** Para cada aresta do rio, um segmento entre os 2 vértices. Arestas seguidas dividem vértice, então o
  traçado é contínuo pelas bordas dos hexes.
- **Sinuosidade.** O ponto médio de cada aresta é deslocado ±2 px na perpendicular, por sorteio estável. O traçado é
  suavizado com Chaikin em 2 passes.
- **Raster a 1x, sem antialias.** A largura depende do tamanho: riacho 2 px, rio 3 px, rio grande 5 px.
- **Cores dos tiles de água:**
  - corpo `#18aee4`;
  - margem de 1 px `#0b589e`;
  - brilhos esparsos `#29c0f6`.
- **Sobreposição.** O rio invade as duas faces vizinhas. Por fora da margem, 1 px de pontilhado 50% mistura a margem
  com o tile.
  - **Na foz**, o rio alarga em 2 arestas e se funde à água, sem margem na junção.
  - **Na confluência**, não há tampa.
- **Profundidade.** O segmento fica entre o hex de cima e o de baixo: z = profundidade do hex de baixo − 0,5. Assim, a
  copa e o pico do hex da frente cobrem o rio.

**Estrada: tijolo cinza** `[Pedro]`
O Pedro quer: *"não pode ser textura plana, tem que ser bonita com definição e variação"*.
- **Traçado.** Em cada hex da via, uma curva do meio da aresta de entrada até o meio da aresta de saída, com controle
  no centro (quadrática). As pontas terminam no centro.
- **Textura ao longo da curva.** Rasterize a 1x. Para cada pixel da faixa (5 px), calcule:
  - `u`, o comprimento de arco até o ponto mais próximo do traçado;
  - `v`, a distância lateral com sinal.

  A cor sai de uma função de tijolo em `(u, v)`, e assim os tijolos acompanham a curva.
  - Fileiras de tijolos de 2–3 × 1 px, deslocadas meia peça a cada fileira, com junta de 1 px em `#414141`.
  - Cada tijolo sorteia um tom estável entre `#61584f` e `#6e665d`, ±1 degrau de brilho.
  - De 5 a 10% dos tijolos ganham musgo (`#29701f`, `#278219`) ou ficam faltando, mostrando a terra.
  - Meio-fio de 1 px mais claro nas duas bordas, com falhas ocasionais.
- **Profundidade:** logo acima do tile do próprio hex.

**Trilha: cavada no terreno** `[Pedro]`
O Pedro quer: *"as trilhas carvam um caminho no terreno"*. Não é uma linha pintada por cima.
- **Máscara.** Uma faixa de 2–3 px ao longo do mesmo traçado, com borda irregular (±1 px de ruído estável).
- **Cavar.**
  - Os pixels do tile sob a máscara escurecem ~25% e puxam para a terra (`#914504`, `#af5211`).
  - A borda de cima ganha 1 px de sombra; a de baixo, 1 px de luz. Lê como um sulco.
  - Pedrinhas e tufos esparsos na borda.
- **É assado** na textura do hex, junto com a tinta. Em floresta com trilha, use a variante `floresta-clareira`.
- **Por fases:** uma faixa escurecida simples na F1; o sulco completo na F7.

**Ponte e penhasco**
- **Ponte:** tábuas perpendiculares à aresta, 6 × 4 px, em marrom da espessura, desenhadas sobre o rio.
- **Penhasco:** uma linha de rocha de 2 px na aresta, com sombra de 1 px do **lado baixo**. O lado alto é o mais claro.

## 6. Kit de UI
- São 18 paletas do mesmo layout: molduras, faixas (*ribbons*), estandartes, botões e caixas.
- **O recorte automático falha** porque os sprites se encostam (veja `_recortes-automaticos.png`).
  - Monte `assets/ui/atlas-ui.json` à mão: `{nome, x, y, w, h, nineSlice: [t, r, b, l]}`, inspecionando a folha com
    zoom.
  - **O layout é o mesmo nas 18 paletas**, então um atlas serve para todas.
- **Paleta por região** (`mundo.json > regioes[].paletaUI`):

  | Região | Paleta |
  |---|---|
  | Bosque | 10 |
  | Cinturão | 06 |
  | Emaranhado | 04 |
  | Bacia | 09 |
  | Costas | 15 |
  | Terras Livres | 01 |
  | Cordilheira | 08 |
  | Deserto | 12 |
  | Ermo | 17 |

  A 13 (pergaminho) é a neutra, para menus.
- **No CSS:** `border-image` com `image-rendering: pixelated` e espessura em múltiplos do zoom.

## 7. Fonte
- **DungeonFont** (CC0), de pixel: 1 pixel da fonte = **60 unidades**, com `unitsPerEm` 1024 e origem deslocada 20
  unidades.
  - Maiúsculas: 10 px; x-height: 5 px; descendente: 4 px.
- **DungeonFont-PT:** a original não tem ã, õ, Ã e Õ. `gera_fonte_pt.py` copia o til do ñ e do Ñ, centra como o
  circunflexo e prende à grade.
- **Ainda faltam:** `→` (usado no rótulo "→ Para [região]"), `–`, `—`, `…`, `•`, `·`, `×`, `°`, `º`, `ª`, `±`, `≤`,
  `≥`, `÷`.
- **Recomendação: fonte bitmap.** Gere uma (BMFont ou JSON + PNG) a partir do TTF, 1 px por pixel da fonte:
  - tamanho 1024/60 ≈ 17,067 px;
  - rasterização sem antialias (modo 1-bit);
  - avanço = largura do glifo + 1 px.

  Desenhe os glifos que faltam direto no gerador, como bitmaps de pixel. Depois, aplique zoom inteiro com *nearest*.
  O texto fica tão nítido quanto os tiles.

## 8. Ordem das camadas (de baixo para cima)
1. Referência (só no editor).
2. Tiles, ordenados por profundidade. Rios e vias entram nessa ordem (§5).
3. Orla do litoral.
4. Pontes e penhascos.
5. Bordas de região (só no mestre) e de território.
6. Marcas de evento e ícones de especial.
7. Rótulos: coordenada e "→ Para [região]".
8. Token do grupo.
9. Névoa (na janela dos jogadores; no editor, só como prévia).
10. Seleção, pincéis e tooltip.

## 9. Arte que falta
Para cada peça, faça um substituto simples por código e pergunte ao Pedro:
- token do grupo;
- ícones das marcas (ruína, assentamento, covil, achado, abrigo);
- ícones dos especiais que não têm tile.

Os *props* da linha 4 (rocha, cristal, minério) servem de marcador de sítio de extração.
