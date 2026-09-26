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
   │    fase 2: shell       navegação única, boot da nav, nav.js, webp, âncoras
   │                        estáveis, ?v= nos assets
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
partials/glifos.html           sprite g-* (UI da ficha, moldura de raízes, 21 ramos);
                               INERTE até a F2, quando o shell passa a injetá-lo

tools/build.py                 orquestrador: geradores + shell + validação
tools/validar.py               integridade estrutural (método §6 do CLAUDE.md)
tools/shell.py                 fase 2: navegação, webp, âncoras determinísticas
tools/sync_notion.py           motor de diff de snapshots do Notion
tools/gerar_<pagina>.py        geradores JSON -> HTML (7)
tools/gerar_webp.py            reencode das imagens
tools/gerar_bazar.py           gerador do Bazar (CSV -> bazar.json com `inv` + página)
tools/gerar_catalogo.py        data/*.json -> data/catalogo/<tipo>.json (F1a, artefato)
tools/kf_marca.py              marcação entidade -> ficha comum aos geradores (F1a)
tools/alias_ids.json           ids do contrato do balanceamento fora da convenção -> id do site
tools/testes/                  testes node do motor KhInv (*.test.js, fixtures/);
                               index.js deixa `node --test tools/testes` rodar no Node 22+;
                               test_*.py: checagens do validar (unittest, no build)
tools/extrair_css.py           refatoração pontual de CSS (não é build)
tools/migrar_sistema.py        migração pontual do Sistema (já rodada)

css/style.css                  design system: tokens :root, layout, globais
css/classes.css                componentes das 7 páginas de classe
css/racas.css                  componentes das 7 páginas de raça
css/bazar.css                  só a página do Bazar (tokens --bz-* no :root dele)
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
data/classes/*.json            7 classes
data/racas/*.json              7 raças
data/ficha.schema.json         contrato da ficha 2.0 + projeção Bestiário
data/catalogo/<tipo>.json      ARTEFATO (gerar_catalogo.py): {id, tipo, nome sem emoji,
                               icone, resumo, campos do tipo} por entidade; raras só
                               id/nome/categoria/req. O item usa o data/bazar.json
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
`partials/head-boot.html` antes de `</head>` e `js/nav.js` antes de `</body>`
(antes do `?v=`, que o `nav.js` também ganha). O `nav.js` é separado do `main.js`
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
- **Grupos** Raças e Classes recolhem pelo cabeçalho (`html[data-nav-fechados]`);
  o grupo da página atual nunca fecha.
- **Dica** do trilho: um `#nav-dica` fixed no `<body>`, z 105 (acima da nav,
  abaixo da receita do Bazar, do cartão e da Ficha).

## 5. Convenção de CSS

Ordem de carga e responsabilidade de cada camada:

1. `css/style.css` — design system. Tokens `:root`, layout da aplicação,
   componentes usados em todo o site. É o que se edita para mudar a cara do site.
2. `css/classes.css` / `css/racas.css` — componentes que existem só nessas
   famílias de página (`.class-hero`, `.raca-header`…), iguais em todas elas.
3. `<style>` inline da página — **apenas o que é dela**. Nas classes, os tokens
   `--ramo-*` de cor, que são a identidade visual de cada uma.

Uma regra idêntica em 2+ páginas pertence a (2), não ao inline. `tools/extrair_css.py`
faz essa extração respeitando o cascade.

## 6. Comandos

```bash
python tools/build.py                  # gera tudo (Bazar incluso) + testes do motor + valida
python tools/build.py magias racas     # alvos específicos
python tools/build.py --no-check       # sem validar
                                       # (--bazar ainda é aceito, mas é no-op)
python tools/validar.py                # só valida
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
o `data/catalogo/`.

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
