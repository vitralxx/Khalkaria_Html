# Arquitetura do repositório — Khalkaria_Html

Mapa técnico do site. Complementa o `CLAUDE.md` (que define o protocolo);
este documento descreve **como o repositório está montado** e onde estão as
dívidas restantes. Mantido pelo agente de desenvolvimento web.

---

## 1. Fluxo de dados

```
Notion (fonte da verdade)
   │  notion-fetch (MCP, só o agente chama)
   ▼
notion_cache/<slug>.new.md           snapshot bruto
   │  tools/sync_notion.py report     diff normalizado .base vs .new
   │  tools/sync_notion.py cobertura  Notion atual x página gerada
   ▼
data/*.json                           conteúdo mecânico estruturado
   │  tools/build.py
   │    fase 1: geradores   data + templates -> pages/*.html
   │    fase 2: shell       navegação única, boot da nav, nav.js, tokens.css, webp,
   │                        âncoras estáveis, ?v= nos assets
   ▼
pages/*.html                          ARTEFATO — nunca editar à mão
   │  tools/validar.py
   ▼
GitHub Pages
```

`pages/*.html` é saída de build. Edição manual é sobrescrita no próximo
`build.py`, e o `validar.py` acusa (teste de round-trip).

## 2. O que o GitHub Pages serve

Só isto vai para o navegador:

```
index.html   css/   js/   images/*.webp   pages/   data/bazar.json
```

`data/bazar.json` é o único JSON lido em runtime. Na `bazar.html` o `bazar.js`
baixa e entrega à Ficha por `KF.catalogo(ITENS)` (um fetch só). Fora dela, o
`ficha.js` faz um fetch preguiçoso único quando precisa: busca do drawer, card
de item a decorar ou entrada do inventário ainda sem `inv` (migrada da v1).
Todo o resto — `tools/`, `templates/`, `data/*.json`, `partials/`,
`notion_cache/`, o CSV, os `.md` — é build-time e não afeta o site publicado.
Os `.png` continuam no repo porque são a **fonte** das imagens; o que é
servido são os `.webp` gerados a partir deles.

## 3. Árvore

```
index.html                     landing (HTML manual)
partials/sidebar.html          FONTE ÚNICA da navegação do site (markup + sprite nv-*)
partials/head-boot.html        <script data-nav-boot> que o shell põe antes de </head>
                               (estado da nav e html[data-movimento] antes do paint)
partials/glifos.html           sprite g-* (UI da ficha, moldura de raízes, 21 ramos);
                               INERTE até a F2, quando o shell passa a injetá-lo

tools/build.py                 orquestrador: geradores + shell + validação
tools/validar.py               integridade estrutural (método §6 do CLAUDE.md)
tools/shell.py                 fase 2: navegação, webp, âncoras determinísticas
tools/sync_notion.py           motor de diff de snapshots do Notion
tools/gerar_<pagina>.py        geradores JSON -> HTML (7)
tools/gerar_webp.py            reencode das imagens
tools/gerar_bazar.py           gerador do Bazar (CSV -> bazar.json com `inv` + página)
tools/gerar_catalogo.py        data/*.json -> data/catalogo/<tipo>.json (F1a) + data/pericias.json
                               (F1e), artefatos; `--relatorio` (o build passa) imprime os
                               formatos encontrados por conjunto
tools/normaliza.py             leitura da F1e: ações/intensidades/sustentada/porIntensidade das
                               magias, req e custo do Limiar, as 24 perícias (tabelas fechadas:
                               formato novo derruba o build)
tools/kf_marca.py              marcação entidade -> ficha comum aos geradores (F1a)
tools/blocos.py                blocos classe/raca/origem (F1b): marcadores {{classe.…}},
                               leitura do verbatim (V/G/R, slugs, ids); `python tools/blocos.py`
                               regrava os derivados depois de editar um texto; F1e(c): parágrafo
                               dos ramos, cabeçalhos de tier e grupo/ramo/tier/custoTexto de cada
                               card de classe (ramo por 2 fontes: posição no template e corpo).
                               custoTexto é o texto sem tags do custo do cabeçalho; nos cards
                               gerais do Espadachim (.technique-cost, um <span> por custo) o
                               separador ' · ' é derivado, não do Notion, e a ordem é a da fonte
tools/alias_ids.json           ids do contrato do balanceamento fora da convenção -> id do site
tools/componentes-baseline.json piso da contagem de cada classe CSS de componente por
                               página de classe (checagem [componentes] do validar)
tools/testes/                  testes node do motor KhInv (*.test.js, fixtures/);
                               index.js deixa `node --test tools/testes` rodar no Node 22+;
                               test_*.py: checagens do validar (unittest, no build)
tools/estilo/                  conferência de estilo computado (captura no navegador; §6): servidor.py,
                               captura.js, rodar.html, roteiro.json, diff.py, revisado.json;
                               cascata declarada: cascata.js/.html, cascata_diff.py,
                               regras.html, pares.py
tools/testes/estilo/antes/     linha de base do estilo computado (52 capturas .json.gz)
tools/testes/estilo/depois/    captura do CSS atual + _css.txt (hash do css/**); o validar
                               [estilo] compara com antes/ e com o css/** de agora
tools/extrair_css.py           refatoração pontual de CSS (não é build)
tools/migrar_sistema.py        migração pontual do Sistema (já rodada)
tools/migrar_f1b.py            migração pontual template -> blocos da F1b (já rodada;
                               registro de como cada campo foi extraído)
tools/migrar_f1b_correcao.py   idem, correção da F1b: Progressão, regra de técnicas,
                               requisito de card e status no vocabulário (já rodada)
tools/migrar_f1e.py            idem, F1e(c): parágrafo dos ramos e cabeçalhos de tier (já rodada)
tools/pendentes_balanceamento.json  regras perguntadas ao balanceamento, sem resposta
                               (id, rodada, pergunta, campos): selo PENDENTE (balanceamento)
tools/sync_balanceamento.py    F1d: entrega do balanceamento (git show da branch dele) ->
                               privado/balanceamento/ (verbatim, gitignored) + data/balanceamento/
                               (projeção publicada sem rara oculta) + fonte.json (commit de origem).
                               Manual: rodar quando o balanceamento entregar; depois build.py
tools/gerar_efeitos.py         F1d: data/balanceamento + bazar.json -> data/efeitos.json (artefato)
tools/alvos_destino.json       F1d: vocabulário fechado dos efeitos (26 famílias de alvo ->
                               alvo do site + destino campo|lembrete|adiado; ops, quando, status,
                               condicao, opcionais, duração, treino)
tools/efeitos_excecoes.json    F1d: defeitos de parse conhecidos do arquivo de efeitos (viram
                               lembrete; AVISO até a errata, FALHA quando ficam obsoletos)
tools/checa_efeitos.py         F1d: checagens [balanceamento], [efeitos] e [vhelor] do validar

css/tokens.css                 tokens do site (camada base; o shell o põe antes do style.css):
                               escalas --esp/--raio/--dur/--z, --recurso-*, --classe-*,
                               --ramo-<c>-<r>, --rar-*, promovidos do Bazar
css/style.css                  design system: declara as @layer (§5), paleta :root, reset,
                               layout, globais
css/classes.css                componentes das 7 páginas de classe (camada paginas)
css/racas.css                  componentes das 7 páginas de raça (camada paginas)
css/bazar.css                  só a página do Bazar (camada paginas; --bz-* são aliases
                               dos tokens do site)
js/main.js                     splash, smooth scroll, fade-in
                               + auto-injeta ficha.js em todas as páginas
js/nav.js                      navegação lateral: trilho de 64px, atalho \, dica,
                               grupos recolhíveis, menu mobile (injetado pelo shell
                               em TODAS as páginas, inclusive o Bazar)
js/utils.js                    sidebar direita (índice, recentes, busca)
js/ficha.js                    Ficha Interativa: no topo o motor PURO KhInv
                               (carga, migração, reconciliação, export de armas;
                               sem DOM, testável no node), depois o drawer, o
                               estado v2 e a API window.KF (§8)
js/bazar.js                    núcleo do Bazar: catálogo, filtros, Bancada
js/bazar-cartao.js             pop-up do card (BZ.cartao)       ┐ módulos do Bazar v3,
js/bazar-receita.js            painel de receita (BZ.receita)   │ registrados em window.BZ e
js/bazar-inventario.js         inventário em 2 colunas          │ carregados depois do bazar.js,
                               (BZ.inventario)                  ┘ todos com ?v={{VER}}

data/*.json                    sistema, magias, condicoes, limiar, origens,
                               racas, bazar
data/classes/*.json            7 classes: bloco `classe` (F1b) + cards (com grupo/ramo/tier/
                               custoTexto derivados, F1e)
data/racas/*.json              7 raças: bloco `raca` (F1b) + cards
data/ficha.schema.json         contrato da ficha 2.0 + projeção Bestiário
data/catalogo/<tipo>.json      ARTEFATO (gerar_catalogo.py): {id, tipo, nome sem emoji,
                               icone, resumo, campos do tipo} por entidade; raras só
                               id/nome/categoria/req/reqTexto. O item usa o data/bazar.json.
                               O resumo MANTÉM o texto dos .sep que o CSS esconde ("Lobo: ",
                               ":", ";"): é verbatim do Notion (útil para busca e cópia). A
                               especificação da F1e pedia tirar; decisão em aberto com o Pedro
data/pericias.json             ARTEFATO (gerar_catalogo.py, F1e): as 24 perícias {slug, nome, prof,
                               atributos, modo fixo|maior|arma|dado, dadoPorBonus do Defender} e os
                               graus; fonte única para a F1d e o schema v3
data/balanceamento/            F1d: projeção PUBLICADA (D3) da entrega do balanceamento
                               (regras-ficha, efeitos-itens, overrides, marcas-vhelor) sem nada
                               de carta rara oculta (D11/D33) e com o texto das Marcas da Vhelor
                               só em marcas-vhelor.json; fonte.json = ref, commit, sha256 do
                               verbatim e cada corte. Só muda pelo tools/sync_balanceamento.py
data/efeitos.json              ARTEFATO (gerar_efeitos.py, F1d): {porId: item -> quando, slot,
                               acumulaCopia, usos, mods[] no formato Mod do site, arma?,
                               consumo?, requisito, lembretes, texto, status} para os 612 itens
                               com efeito; nenhuma página lê ainda
data/Bazar_Khalkaria_v26.csv   fonte do Bazar: conteúdo do Pedro, só muda com
                               aprovação dele (gerador, CSS, JS e template do
                               Bazar são do agente desde 2026-09-24)
templates/bazar.template.html  scaffold do Bazar ({{VER}}, {{VOCAB}}…)

templates/                     scaffold + <style> por página
pages/                         artefato gerado (+ classes/criacao manuais)
images/                        .png fonte + .webp servido
notion_cache/                  snapshots (git-ignorado, exceto pages.json)
```

## 4. Cobertura do pipeline

| Página | Gerador | JSON |
|---|---|---|
| sistema, magias, condicoes, limiar, origens | sim | sim |
| racas + 7 subpáginas | sim | sim |
| 7 classes | sim | sim |
| bazar | `gerar_bazar.py` (CSV) | sim |
| **index.html, classes.html, criacao.html** | **não** | **não** |

20 páginas fecham round-trip byte-a-byte. 3 ainda são HTML manual — mas todas
recebem a fase 2 (navegação, webp, âncoras e versão dos assets), então nenhuma
fica de fora do shell comum.

**Versão dos assets.** O `shell.py` põe `?v=<8 hex do sha1 de js/*.js + css/*.css>`
em todo `<script src>`/`<link href>` local das 24 páginas, e o `js/main.js` repassa
a mesma versão ao `ficha.js` que injeta. O GitHub Pages manda cache de 10 min: sem
isso, depois de um deploy o navegador servia um `ficha.js` antigo nas páginas fora
do Bazar. O `bazar.json` é buscado com `?v=<hash do arquivo>` (`BZ_VOCAB.dados`).

**Navegação lateral.** Markup só em `partials/sidebar.html`; o shell a copia para
as 24 páginas, reescreve os `href` (que têm de ser o 1º atributo do `<a>`) e marca
o link atual com `.active` + `aria-current="page"`. Também injeta
`partials/head-boot.html` antes de `</head>`, `js/nav.js` antes de `</body>` e o
`<link data-tokens>` do `css/tokens.css` logo antes do `style.css` (tudo antes do
`?v=`, que os dois também ganham). O `nav.js` é separado do `main.js`
porque o Bazar não carrega `main.js` (que injetaria o `ficha.js` pela segunda vez).

- **Largura:** a única variável que o layout lê é `--nav-w` (`style.css`):
  `--nav-w-aberta` 280px ou `--nav-w-trilho` 64px quando `html[data-nav="trilho"]`,
  só com a viewport em ≥901px. `--sidebar-width` é alias legado. Proibido
  transform/filter/contain/will-change na `.sidebar` do desktop.
- **Estado:** localStorage `khalkaria_nav` = `{v:1, trilho, fechados:["racas"|"classes"]}`,
  sempre em try/catch. O boot do `<head>` aplica o estado no `<html>` antes do
  primeiro paint (sem pisca entre páginas); o evento `storage` sincroniza as abas.
- **Atalho `\`** (tecla própria no ABNT2) alterna o trilho; ignorado em campo de
  texto, com Ctrl/Alt/Meta, dentro da Ficha e no mobile. Esc só é consumido com a
  dica ou o menu mobile abertos, para não engolir o Esc do Bazar e da Ficha.
- **Movimento reduzido** (opção do visitante): botão "Reduzir movimento" no rodapé
  da nav (`.nav-mov`, `aria-pressed`). localStorage `khalkaria_movimento` =
  `reduzido`|`normal`; sem a chave, segue o `prefers-reduced-motion` do sistema.
  O boot do `<head>` põe `html[data-movimento]` antes do paint; o `*{…!important}`
  que zera transições e animações está no `reset` do `style.css` (vence tudo, CSS
  sem camada inclusive) e a `@media` só vale sem o atributo (script não rodou). JS
  que anima lê o atributo: `nav.js`, `bazar-inventario.js`, rolagem suave do
  `main.js`/`utils.js` e a árvore do Limiar.
- **Foco de teclado** (site todo): `:where(a,button,input,select,textarea,summary,
  [tabindex]):focus-visible` na `base`, contorno âmbar 2px + halo parado
  `--foco-anel` (`tokens.css`); o foco próprio de cada componente continua valendo.
- **Grupos** Raças e Classes recolhem pelo cabeçalho (`html[data-nav-fechados]`);
  o grupo da página atual nunca fecha.
- **Dica** do trilho: um `#nav-dica` fixed no `<body>`, z 105 (acima da nav,
  abaixo da receita do Bazar, do cartão e da Ficha).

## 5. Convenção de CSS

Ordem de carga e responsabilidade de cada camada:

0. `css/tokens.css` — tokens do site (F1c). Declara a ordem das `@layer` também,
   porque carrega primeiro.
1. `css/style.css` — design system. Paleta `:root`, layout da aplicação,
   componentes usados em todo o site. É o que se edita para mudar a cara do site.
2. `css/classes.css` / `css/racas.css` — componentes que existem só nessas
   famílias de página (`.class-hero`, `.raca-header`…), iguais em todas elas.
3. `<style>` inline da página — **apenas o que é dela**. Nas classes, os tokens
   `--ramo-*` de cor, que são a identidade visual de cada uma.

Uma regra idêntica em 2+ páginas pertence a (2), não ao inline. `tools/extrair_css.py`
faz essa extração respeitando o cascade.

**Camadas (F1c).** `style.css` abre com
`@layer reset, base, layout, componentes, paginas, estados;` (precedência crescente):

| Camada | O que tem |
|---|---|
| `reset` | `box-sizing`/margem zero, barra de rolagem, movimento reduzido do site (`*{…!important}`) |
| `base` | tokens (`css/tokens.css`) e paleta `:root`, `html`/`body`, tipografia e tabela por elemento |
| `layout` | a moldura: `.app-container`, `.main-content`, `.right-bar`, botão do menu mobile |
| `componentes` | a nav (com o trilho), cards, badges, splash, tabela compacta, blocos de classe/raça genéricos e do Sistema, itens da right-bar, utilitários, `a:hover` |
| `paginas` | `classes.css`, `racas.css`, `bazar.css`, a landing do index |
| `estados` | sobreposições de estado (hoje: movimento reduzido da nav) |

Regras da migração, todas medidas com `tools/estilo/` (diff 0):
- **CSS sem camada vence qualquer camada.** Os `<style>` dos templates e o CSS que o
  `ficha.js` injeta ficam fora de camada de propósito até a F7.
- **A camada vence a especificidade.** Regra que ganhava de outra por especificidade
  tem de ficar na camada do rival (ou acima): por isso a nav é `componentes` e o
  `a:hover` (0,1,1, contra os links de classe da nav, da right-bar e do Sistema) fica
  lá; `tr:last-child td` e `tr:hover td` ficam **sem camada**, porque vencem o `td`
  dos `<style>` de template; a `@media (max-width: 900px)` é repartida pela camada de
  cada regra que ela sobrepõe. Nenhuma regra mudou de ordem dentro da camada.
- **Pontes** (fim do `style.css`, sem camada): reafirmam o que uma regra em camada
  ganhava de um `<style>` de template (hoje só o sublinhado do `a:hover` nos cards-link
  de `racas.html` e `criacao.html`); no fim do `bazar.css`, o cursor dos cards e
  linhas do Bazar contra o `.kf-draggable` que o `ficha.js` injeta sem camada.
  (O `*{…!important}` de movimento reduzido saiu daqui: virou opção do site, no
  `reset`.) Saem quando o CSS de template e o da Ficha entrarem em camada (F2/F7).
- **`!important` inverte:** o de `reset` vence o de todas as outras camadas; o de
  uma camada vence o `!important` sem camada.
- **Aprovados pelo Pedro depois da F1c** (2026-09): o `:focus-visible` global
  (âmbar, 2px e halo `--foco-anel`, na `base`; campos de texto casam
  `:focus-visible` também no clique) e o movimento reduzido global, agora como
  opção do visitante (`html[data-movimento]`, `*{…!important}` no `reset`).
- Token novo não troca valor: as páginas passam a ler `--recurso-*`, `--classe-*` e
  `--ramo-*` na F7. Já ligados (valor idêntico): `--z-*` da nav, dica, right-bar e
  Bazar, e os `--bz-*`.

`.sep` (`css/classes.css`, `display: none`) guarda texto verbatim do Notion que o
componente já mostra de outro jeito: a vírgula entre chips de stats, o `:` de um
título, o prefixo `Lobo:` dentro do card do Lobo. O texto fica no DOM (a
normalização do §6 e o `sync_notion.py cobertura` o enxergam) e sai da tela.

## 6. Comandos

```bash
python tools/build.py                  # gera tudo (Bazar incluso) + testes do motor + valida
python tools/build.py magias racas     # alvos específicos
python tools/build.py --no-check       # sem validar
                                       # (--bazar ainda é aceito, mas é no-op)
python tools/validar.py                # só valida
python tools/validar.py . --atualizar-componentes
                                       # regrava o piso de componentes (queda legítima)
python tools/gerar_webp.py --force     # reencoda todas as imagens
python tools/sync_notion.py status     # snapshots do Notion disponíveis
python tools/sync_notion.py report     # diff: o que mudou no Notion
python tools/sync_notion.py accept     # promove .new -> .base
python tools/sync_notion.py cobertura  # trechos do Notion que o site não publica
                                       # (o report só compara Notion com Notion:
                                       # resumo ou omissão antiga no site passa calado)
```

`validar.py` checa: tags balanceadas, âncoras `#x` com destino (também
`outra.html#x`: o id tem de existir na página de destino), IDs duplicados,
links/assets locais existentes, round-trip JSON→HTML, consistência das
24 sidebars (página sem `<nav class="sidebar">` é FALHA; e em cada página 1 boot,
1 `nav.js`, 1 `aria-current`, todo glifo `nv-*` com `<symbol>` e todo `.nav-link`
com `.nav-rot`), as 5 frases de peso
do Sistema que o motor de carga codifica (guarda-fio contra o Notion mudar a
regra por baixo), `inv` em todo item do `data/bazar.json` e os 3 blocos
decididos D80–D82 no `data/sistema.json` (modificador, vantagem/desvantagem,
custo mínimo de magia), por frase verbatim do Notion, e o id de todo card de
classe (`data/classes/*.json`) = `<classe>-` + slug do nome, sem duplicata.
Desde a F1a também: `[ids]` (id de entidade único no site; `data-kf-*` dos cards
== catálogo por conjunto — 646 entradas em 14 tipos, mais os 727 itens do Bazar —
e == ids dos JSON de raças, origens e classes lidos direto, sem a tabela
classe -> tipo; todo card marcado, menos o `<a>` do índice, abre com o par
`.ent-add` + `.ent-alca`, ambos `hidden`; alvos do `alias_ids.json` existem), `[fragmentos]` (`pagina.html#id` e
`bazar.html#item/<id>` com destino) e `[glifos]` (sprite íntegro, um glifo por
`--ramo-*`, todo `<use href="#g-*">` com símbolo). O round-trip regenera também
o `data/catalogo/` e o `data/pericias.json`.

**`[componentes]`.** O sync verbatim de 2026-09-26 trocou cards de companheiro,
tabelas d100, sub-habilidades, stats de ser/constructo, seções de patrono e
effect-list por `<ul><li>` genérico, e nada acusou. Agora cada classe CSS listada
em `tools/componentes-baseline.json` tem um piso por página de classe e por card
(`data-kf-id`, contado no card mais interno): se a contagem cair, o build falha.
O piso por card pega o componente que sai de um card e aparece em outro com o
total da página igual. Ao recopiar texto do Notion, o texto novo entra
DENTRO do componente. Se o Notion tirou o conteúdo que o componente embrulhava,
confira e rode `validar.py . --atualizar-componentes`, dizendo no commit o que saiu.

**Marcação entidade -> ficha (F1a).** Todo card de entidade sai do gerador com
`data-kf-tipo`, `data-kf-id` (= id do JSON) e `data-prever="tipo:id"`, e com o
`<button class="ent-add" hidden>` e a alça `.ent-alca` como primeiros filhos
(inertes até a F4; primeiros filhos para não mexer nos `p:last-child`). Exceções:
o preview `<a class="raca-card">` do índice não leva botão (botão dentro de link
é HTML inválido) e o Bazar, renderizado no `js/bazar.js`, não leva `data-prever`
no card (lá o `data-prever` é o gatilho do cartão, no nome, com o id puro);
o `marcacao-bazar.test.js` roda o render do card e da linha da Lista sobre o
`data/bazar.json` inteiro. Card que não é entidade (regra da página) só existe
pela allowlist `NAO_ENTIDADE` do `tools/kf_marca.py` (`rule-box`, `warning`):
classe CSS fora do mapa e fora dela derruba o build.

**Card do Bazar (2026-09, "heráldica").** Lei de cor: cor forte só na raridade
(filete no topo, moldura `--moldura`, brilho `--rbr`, medalhão `.bz-med` com a
gema `.bz-gema`, rótulo `.item-rar` em `--rtx`); o matiz de calor só na marca
`.calor` da Região (o mesmo `--r`/número da trilha de filtro); âmbar só para
interação e para o aviso "difícil". Chips numa fileira, uma forma por família
(`tokens.css`, `--chip-*`): `.tag-cat` selo de canto vivo com glifo, `.tag-arq`
fio de aço, `.tag-of` pílula de cobre com a CD (`.item-cd`) num selo. Tags em
texto (`.item-tags`), rodapé em tabela (Valor, CR, Espaço). A Lista usa as
mesmas peças (`medHTML`, `rarHTML`, `regHTML`, `catHTML`, `ofHTML` no
`bazar.js`); o painel de receita e o pop-up usam `.tag-cat`/`.tag-arq` e mantêm
o `.tag-rar` em caixa. **Escala** P/M/G/GG: radiogroup `#bz-escala` na barra
(setas, atalhos `-` e `=`/`+`), `E.escala` em `khalkaria_bazar_estado` (não vai
para a ficha), aplicada em `#bz-registro[data-escala]` como `--col` (mínimo da
coluna), `--k` (fator do texto; o card é todo em `em`) e `--linhas` (efeito);
trocar de passo é só CSS. O "+ inventário" do `ficha.js` não escala (CSS dele
fica fora de camada com `font-size` fixo).

**Blocos de classe, raça e origem (F1b).** O que antes só existia no scaffold
do template (CD, treinamento, fórmulas de Saúde/Stamina/Éter, recurso de classe
com o medidor, Marca do Duelo, Escolas, Arma Humana, os 95 Itens Alquímicos, os
ramos, a tabela de Progressão, a regra de técnicas e o requisito solto de card; stat-box, perícias, dados físicos, tecnologias e as 15+15 corrupções das
raças; Sins, treinamento, itens iniciais e habilidade das origens) vive em
`data/`: `classe` em `data/classes/<c>.json`, `raca` em `data/racas/<r>.json` e
`origem` em cada card de `data/origens.json`. O template (o corpo do card, nas
origens) mostra cada texto por um marcador `{{classe.cd.texto}}`; o gerador troca
pelo valor verbatim (`tools/blocos.py preenche`) e derruba o build se o campo
faltar; o `[blocos]` também exige que todo campo verbatim tenha o seu
marcador (texto literal no template com o campo órfão no JSON é FALHA). Ao lado do verbatim ficam os **derivados** que a ficha consome (V/G/R,
atributos com "ou", perícias como slug, escolhas, metros, Ar natural, ids das
sub-entidades, `itemId` do Bazar nos itens iniciais, e nos medidores `min`,
`inicio` e `recarga` só do que a frase do texto declara): o `[blocos]` recalcula e
FALHA se divergirem (`python tools/blocos.py` regrava). O que o Notion não diz
fica `null` + `status` do vocabulário do plano §3.2: `pedroDecide` (recurso do
Espadachim e do Teurgo) ou `pendente` + `pergunta` (técnica de raça); `min`,
`inicio` e `recarga` omissos de medidor ficam `null` cobertos por uma pergunta de
`tools/pendentes_balanceamento.json` (FALHA se não houver).
`[conteudo×contrato]` compara V/G/R, CD, perícias e armas iniciais, recurso
(ids nos dois sentidos, máximo, mínimo, início, recarga, gastos), Marca do Duelo,
movimento, Ar natural e corrupção máxima por nível com o contrato do
balanceamento (lido da branch dele por `git show`, ou `KH_CONTRATO=<arquivo>`) e
só AVISA: quem decide a divergência é o Pedro.

**Efeitos de item (F1d).** O verbatim do balanceamento nunca entra no git:
`tools/sync_balanceamento.py` o copia para `privado/balanceamento/` e publica em
`data/balanceamento/` a projeção sem rara oculta (objeto `rara:true`, fonte/id/chave
de rara saem; a frase que cita o nome de uma rara fora de nome ou texto do Bazar
vira o marcador fixo `[trecho sobre carta rara oculta]`, e a chave fica). O
`[balanceamento]` FALHA com rara na projeção ou `privado/` rastreado e, com o
privado local, refaz a projeção e compara byte a byte, com o fim de linha fora da
comparação (o `core.autocrlf` reescreve a projeção com CRLF no checkout; sem o
privado, AVISO).
`gerar_efeitos.py` compila `data/efeitos.json` pelo `tools/alvos_destino.json`
(alvo, op, quando, status, recarga, condicao ou opcional fora da lista derruba o
build) e o round-trip o compara. O `[efeitos]` confere o arquivo do balanceamento
contra o `bazar.json` e o CSV (partição dos 727, nome/categoria/raridade, verbatim
== coluna Efeito, capacidade/acumula/empilhável/armadura contra o `inv`, armas
re-extraídas do texto, dano extra com qualificador, Mods íntegros); os defeitos de
parse conhecidos ficam em `tools/efeitos_excecoes.json`. O `[vhelor]` exige as 7
Marcas iguais ao texto do Pedro (03 §3.1) e numa fonte só.

Os índices "Navegação Rápida" de Condições e Sistema saem do gerador
(`{{IDX_<categoria>}}` no template): um link por card/subseção, na ordem do
JSON. No Sistema o rótulo é `indice` (curto, opcional) ou `nome` da subseção.

`gerar_bazar.py` falha (código 1, nada gravado) quando uma frase de inventário
do CSV não casa com o esperado, quando há colisão de id, ingrediente fora do
catálogo ou quando `data/condicoes.json` perde os cards de Sobrepeso. Contagem
diferente da registrada em `ESPERADO` é só AVISO. O `?v=` final dos assets é o da
fase 2 do shell (hash de todos os js/css); o `{{VER}}` do template é só o valor
inicial, sobrescrito por ela.

Com `node` no PATH e a pasta `tools/testes/`, o build roda `node --test` nos
`*.test.js` dela; teste vermelho derruba o build. Sem `node`, imprime "testes
do motor pulados". À mão: `node --test tools/testes` (ou
`node --test "tools/testes/*.test.js"`). Teste novo só precisa se chamar
`tools/testes/*.test.js`.

### Conferência de estilo computado (`tools/estilo/`)

Para mudança de CSS que **não pode** mexer no visual (F1c: tokens, camadas,
arquivos novos). Compara o `getComputedStyle` de todo elemento das páginas antes
e depois. A captura precisa de navegador; a comparação roda no build.

**Portão (`[estilo]` no `validar.py`).** `antes/` e `depois/` são versionados.
O `servidor.py` grava em `<rótulo>/_css.txt` o hash do `css/**` a cada captura; o
build FALHA se o `css/**` de agora não bate com o `depois/_css.txt` (CSS mudou sem
recaptura) ou se `diff.py antes depois --revisado` sobra diferença. Mudou CSS:
rodar o roteiro com `?rotulo=depois` e commitar `depois/` junto do CSS. O hash
cobre só `css/**`: o CSS que o `ficha.js` injeta e os `<style>` de template não
entram (recapturar à mão quando mexer neles).

```bash
python tools/estilo/servidor.py        # serve o repo em 127.0.0.1:8898 (sem cache) e grava
                                       # POST /__captura?rotulo=R&nome=N em
                                       # tools/testes/estilo/R/N.json.gz
# no navegador: http://127.0.0.1:8898/tools/estilo/rodar.html?rotulo=depois
#   (?so=bazar filtra pelo nome; progresso em window.__estilo = {feito,total,fim,erros})
python tools/estilo/diff.py antes depois --revisado tools/estilo/revisado.json
                                       # 0 = idêntico (ou só diferenças revisadas); 1 = sobrou
                                       # --max 0 lista tudo; --resumo só contagens; --so bazar
```

- **Roteiro** (`roteiro.json`): as 24 páginas em dois estados — `nav-aberta`
  (1366×900, nav aberta, ficha fechada) e `trilho-ficha` (1920×1080, nav em trilho
  por `khalkaria_nav`, drawer aberto por `khalkaria_ficha_open=1`) — mais o Bazar
  em `inv-painel`, `inv-trilho`, `inv-amplo` (`khalkaria_bazar_estado.inv`) e
  `receita` (`#item/item-lanca-venenosa`), todos em 1920×1080: 52 capturas.
  Antes de cada uma o `localStorage` é limpo e recebe só as chaves do estado
  (sempre `khalkaria_splash_seen=1`).
- **`rodar.html`** abre cada página num `<iframe>` do tamanho do estado: o
  viewport é o do iframe, não o da janela, então o painel do navegador pode estar
  minimizado ou de qualquer tamanho.
- **`captura.js`** espera o load + `minimo` ms (600; 2000 no Bazar), o seletor
  `esperar`, as fontes, as imagens (lazy vira eager) e o DOM ficar 800 ms sem
  mutação; força `content-visibility: visible` (os cards do Bazar usam `auto`,
  que num painel oculto ou longe da viewport sai com o tamanho intrínseco: assim a
  captura não depende do painel estar à vista); termina as transições, para as
  animações CSS infinitas e o SMIL no tempo 0; percorre `<html>`, `<body>` e todos os descendentes do body (visíveis
  e ocultos, sem script/style/template) e grava ~75 propriedades computadas +
  `width`/`height`, e `::before`/`::after` (content, display, color, fundo,
  width, height) quando têm `content`. Caminho estável de cada elemento:
  `tag#id.classes:n` (n = posição entre irmãos da mesma tag). Formato
  `kh-estilo/1` comprimido (dicionário de valores e de linhas de estilo
  repetidas) e gzip com mtime 0: as 52 capturas somam ~1 MB e entram no git.
  Também serve colada no console: `await KhEstilo.capturar(window, {rotulo, nome})`.
- **Voláteis:** propriedade que um script da página anima quadro a quadro não é
  comparável. `porPagina.<p>.volateis` no roteiro grava `(volátil)` no lugar do
  valor. Hoje só `transform` dos `.transition-tree path` do Limiar (`animateTree()`).
- **`revisado.json`:** diferenças intencionais, cada uma com `pagina`, `caminho`,
  `prop` (globs), `antes`/`depois` opcionais e `motivo` obrigatório. Regra que
  não casa com nada sai como aviso.
- **Determinismo:** a linha de base foi capturada duas vezes (`antes`, `antes2`)
  com `diff.py antes antes2` = 0 diferenças. Só `antes/` fica no git.
- Não cobre: `:hover`/`:focus` (nada tem foco nem mouse em cima), pseudo-elementos
  de barra de rolagem (`::-webkit-scrollbar`), `::marker`/`::placeholder`,
  propriedades customizadas (`--*`) por si (só pelo efeito nas propriedades
  reais), nem lotes do Bazar além do primeiro (a rolagem infinita não é disparada).

**Cascata declarada** (complemento, feito na F1c): o `diff.py` não vê `:hover`,
`:focus`, outras larguras, `prefers-reduced-motion` nem classes de estado que o JS
ainda não pôs. Dois instrumentos cobrem isso:

```bash
# vencedor DECLARADO por elemento x propriedade: :hover/:focus/:active ligados,
# roteiro + 1000/800/390 px, passada normal e com reduced-motion
#   http://127.0.0.1:8898/tools/estilo/cascata.html?rotulo=cascata-depois  (window.__cascata)
python tools/estilo/cascata_diff.py <cascata-antes> tools/testes/estilo/cascata-depois
# todas as regras de cada página, todas as @media (window.__regras)
#   http://127.0.0.1:8898/tools/estilo/regras.html?rotulo=regras-depois
python tools/estilo/pares.py tools/testes/estilo/regras-depois tools/testes/estilo/cascata-depois [--estrito]
```

- `cascata_diff.py` compara duas rodadas; o "antes" é o commit anterior, servido
  de um `git worktree` noutra porta (`servidor.py --porta 8897`). Na F1c sobraram
  só o `z-index` escrito como `var()` (mesmo valor) e o movimento reduzido global.
- `pares.py` é estático: acha pares cuja vencedora muda com `@layer` e que podem
  casar o mesmo elemento capturado (ancestrais conferidos; classe que só o JS põe
  conta como curinga). Na F1c sobraram as 3 pontes documentadas e falsos positivos
  de id.

## 7. Dívidas restantes

1. **`index.html`, `classes.html`, `criacao.html`** ainda são HTML manual.
   São páginas pequenas e de navegação, não de conteúdo canônico — prioridade
   baixa, mas o padrão já está pronto (ver `tools/migrar_sistema.py`).
2. ~~**Manifesto do Notion incompleto**~~ — **resolvido em 2026-09-22.** O
   `notion_cache/pages.json` cobre as 42 páginas da árvore: índices de `racas`,
   `classes` e o template de ficha, mais as 19 origens. O diff automático
   (`sync_notion.py report`) agora cobre tudo. A raça **Lobisomem** fica de
   fora por decisão do Pedro (é oculta) e está registrada na chave `_ignorar`
   do manifesto, para que a ausência não pareça esquecimento numa varredura
   futura.
3. **`js/ficha.js` injeta o próprio CSS** (`injectCSS`, ~50 linhas, e desde o
   Bazar v3 também `injectCSSInventario`, o bloco `#kf-css-inv` do inventário
   do drawer). Funciona, mas deixa a ficha fora do design system (cores em hex,
   sem tokens) — mover os dois para `css/ficha.css`.
4. ~~**Raças não estão na navegação.**~~ Resolvido: a nav lista as 7 raças e as
   7 classes, em grupos recolhíveis.
5. **Restam ~120 KB de CSS inline** nos templates de classe e raça. É CSS
   legitimamente por página (cores de ramo interligadas às regras), mas parte
   dele viraria variação de token se o design system crescesse.
6. **Emoji no drawer da Ficha.** O botão lateral (`📋 FICHA`) e o do export
   Bestiário (`🐲`) ainda são emoji; a UI nova do inventário não usa nenhum.
   Trocar por SVG junto com o item 3.
7. **Schema × código em `tecnicas`/`grimorio`.** O `ficha.schema.json` descreve
   objetos (`gerais/ramo/…`, `nivel1..4`); o `ficha.js` grava arrays planos.
   Idem `derivados` (schema, e o `x-bestiary` lê `derivados.evasao`) ×
   `derivadosManuais` (código). Fora do Bazar v3: fica para quando a ficha
   ganhar as páginas 2 e 5 da ficha física.
8. **22 perícias na Ficha × 24 canônicas.** `PERICIAS` no `ficha.js` e o schema
   ainda têm um `Ofício(X)` genérico; o CLAUDE.md §2 tem Ofício(Engenharia),
   (Ferraria) e (Alquimia). O export segue com um `prof_craft` só (decidido).
9. **Busca do drawer varre o `bazar.json` inteiro** (~654 KB, efeito incluso) a
   cada tecla, sem índice nem normalização de acento. Na `bazar.html` o
   combobox do inventário substitui; nas outras páginas, indexar nome e
   categoria sem acento.

## 8. Contrato da Ficha Interativa

`js/ficha.js` + `data/ficha.schema.json`. Persistência em `localStorage`
(`khalkaria_ficha`) com re-hidratação por página — **não** é SPA.
Dois exports: nativo (`.khalkaria.json`, superset) e projeção Bestiário
(`.bestiario.json`, `type:"npc"`, mapeamento `prof_*` no CLAUDE.md §5).
Cards viram arrastáveis pela tabela `MAPA` em `ficha.js` — ao criar um novo
tipo de card de conteúdo, registrar o seletor lá.

**Estrutura do arquivo.** Um IIFE só. No topo, `KhInv` (motor puro); no node
o arquivo exporta só ele (`module.exports`) e para ali, e é isso que os testes
de `tools/testes/` carregam. No navegador vira `window.KhInv`, e o resto monta
estado, drawer e `window.KF`. A `KF` existe no fim do corpo síncrono, antes do
`init()`: todo mutador que redesenha testa `if (body)`.

**Ficha v2** (`schemaVersion:'2.0'`, `rev`, `salvoEm`, `exportadoEm`,
`migradoEm`). Inventário = `{sins, bugigangas[], equipamentos[]}` de entradas
com `uid` (`$defs/entradaInventario` no schema). Regras de carga do CSV chegam
em `item.inv` do `bazar.json`; o que o jogador marca (qtd, Item Empilhável,
Equipado, Sintonizado, coluna) fica na entrada.

**Migração 1.0 → 2.0.** `KhInv.migrarV1` (idempotente) roda no `load`, no
import, no `storage` e no `pageshow`: junta `armas`/`equipamentos`/`bugigangas`/
`materiais`, re-roteia pela coluna canônica, funde duplicatas e apaga `armas` e
`materiais` (de novo depois do `deepMerge`). Só no `load`, e só se a chave ainda
não existir, o JSON cru vai para `khalkaria_ficha_v1_backup` (nunca
sobrescrito). A página que migrou mostra um toast de 8s. As entradas migradas
ficam com `inv:null` até o catálogo chegar (`KhInv.reconciliar`).

**API `window.KF`** (`versao:'2'`, congelada). Leituras devolvem cópia:
`inventario()`, `carga()`, `projetar(item,{qtd,coluna})`, `quantidadePorId()`,
`tenho(id)`, `atributo(k)`, `migradoEm()`, `exportadoEm()`. Escrita — todo
mutador faz sincroniza → snapshot de desfazer → aplica → `commit` (grava na
hora, `rev++`, redesenha o drawer, emite): `adicionar(item|{avulso,nome},
{qtd,coluna})`, `quantidade(uid,n)`, `alternar(uid,'empilhavel'|'equipado'|
'sintonizado')`, `trocar(uid,campo,uids)`, `mover(uid,coluna)`, `remover(uid)`,
`definirSins(n)`, `lote(fn)`, `desfazer()`/`podeDesfazer()` (20 passos, em
memória, por página). Integração: `catalogo(array)`, `abrir(secao)`,
`exportar()`, `somenteLeitura()`. Passar de um limite (1 Armadura Pesada, 2 Leves, 3 sintonizados)
devolve `{ok:false, conflito}` e não muda nada.

**Eventos** (`CustomEvent` em `document`): `kf:pronta` `{versao:'2'}`, uma vez;
`kf:mudou` `{partes:['inventario'|'atributos'|'sins'|'tudo'], origem:'local'|
'drawer'|'outra-aba'|'import'|'reset'|'reconciliacao'|'desfazer', op, uid}`.
Sincronia entre abas por `storage` + `pageshow` + `visibilitychange` (adota o
storage quando o `rev` de lá é maior); campos digitados do drawer têm debounce
de 200ms com flush em `pagehide`.

**Guarda contra aba velha (v2.1).** A string gravada continua `'2.0'`. Se o
marcador `khalkaria_ficha_dono` vale `'v3'` (no load, no evento `storage` ou
conferido a cada gravação), a ficha fica só-leitura: faixa "Ficha migrada para
a v3. Recarregue a página." com "Baixar ficha v3 (.json)" (conteúdo cru de
`khalkaria_ficha_v3`) e "Voltar a usar a v2" (apaga só o marcador); nenhuma
escrita no storage (nem backup, nem `khalkaria_ficha_open`, nem pelo Bazar: os
mutadores devolvem `{ok:false, erro:'somente-leitura'}`, `null` ou `false`). A
troca de modo emite `kf:mudou` `{partes:['tudo'], origem:'dono'}`. A mera
existência de `khalkaria_ficha_v3` não trava nada. `importJSON` recusa
`schemaVersion >= 3`. Testes: `tools/testes/guarda-v3.test.js`.

**`data-kf-ignorar`.** O `MutationObserver` que redecora os cards ignora
mudanças dentro de `[data-kf-ignorar]`, e `decorarBazar` não decora card ali
dentro. Hoje têm o atributo `#kf-drawer` e `#kf-toast`; toda superfície do
Bazar que redesenha a cada `kf:mudou` (inventário, painel, pop-up) também deve
ter, senão cada redesenho agenda um `decorar()` inútil.

**Drawer, seção Inventário.** Sins (não pesa), Peso total, selo de condição com
link para `condicoes.html#sobrepeso-leve|extremo`, as duas réguas, a busca, a
dropZone (roteia pela coluna canônica) e as duas listas por `uid` com
[− n +], ☐ Item Empilhável, ☐ Equipado e ×. Na `bazar.html`
(`body[data-bazar]`) a seção nasce recolhida, porque o inventário completo está
na página.
