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
   ▼
data/*.json                           conteúdo mecânico estruturado
   │  tools/build.py
   │    fase 1: geradores   data + templates -> pages/*.html
   │    fase 2: shell       navegação única, webp, âncoras estáveis
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
partials/sidebar.html          FONTE ÚNICA da navegação do site

tools/build.py                 orquestrador: geradores + shell + validação
tools/validar.py               integridade estrutural (método §6 do CLAUDE.md)
tools/shell.py                 fase 2: navegação, webp, âncoras determinísticas
tools/sync_notion.py           motor de diff de snapshots do Notion
tools/gerar_<pagina>.py        geradores JSON -> HTML (7)
tools/gerar_webp.py            reencode das imagens
tools/gerar_bazar.py           gerador do Bazar (CSV -> bazar.json com `inv` + página)
tools/testes/                  testes node do motor KhInv (*.test.js, fixtures/);
                               index.js deixa `node --test tools/testes` rodar no Node 22+
tools/extrair_css.py           refatoração pontual de CSS (não é build)
tools/migrar_sistema.py        migração pontual do Sistema (já rodada)

css/style.css                  design system: tokens :root, layout, globais
css/classes.css                componentes das 7 páginas de classe
css/racas.css                  componentes das 7 páginas de raça
css/bazar.css                  só a página do Bazar (tokens --bz-* no :root dele)
js/main.js                     splash, menu mobile, smooth scroll, fade-in
                               + auto-injeta ficha.js em todas as páginas
js/utils.js                    sidebar direita (índice, recentes, busca)
js/ficha.js                    Ficha Interativa: no topo o motor PURO KhInv
                               (carga, migração, reconciliação, export de armas;
                               sem DOM, testável no node), depois o drawer, o
                               estado v2 e a API window.KF (§8)
js/bazar.js                    núcleo do Bazar: catálogo, filtros, Bancada
js/bazar-cartao.js             pop-up do card            ┐ Bazar v3, entram nas
js/bazar-receita.js            painel de receita         │ próximas etapas; o build
js/bazar-inventario.js         inventário em 2 colunas   ┘ já os inclui no {{VER}}

data/*.json                    sistema, magias, condicoes, limiar, origens,
                               racas, bazar
data/classes/*.json            7 classes
data/racas/*.json              7 raças
data/ficha.schema.json         contrato da ficha 2.0 + projeção Bestiário
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
recebem a fase 2 (navegação, webp, âncoras), então nenhuma fica de fora do
shell comum.

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
```

`validar.py` checa: tags balanceadas, âncoras `#x` com destino, IDs duplicados,
links/assets locais existentes, round-trip JSON→HTML, consistência das
24 sidebars (página sem `<nav class="sidebar">` é FALHA), as 5 frases de peso
do Sistema que o motor de carga codifica (guarda-fio contra o Notion mudar a
regra por baixo) e `inv` em todo item do `data/bazar.json`.

`gerar_bazar.py` falha (código 1, nada gravado) quando uma frase de inventário
do CSV não casa com o esperado, quando há colisão de id, ingrediente fora do
catálogo ou quando `data/condicoes.json` perde os cards de Sobrepeso. Contagem
diferente da registrada em `ESPERADO` é só AVISO. `{{VER}}` no template vira o
hash dos assets do Bazar (cache-bust do `?v=`).

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
4. **Raças não estão na navegação.** A sidebar lista as 7 classes mas não as
   7 raças; chega-se nelas só pela página `racas.html`. Assimetria de UX.
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
`exportar()`. Passar de um limite (1 Armadura Pesada, 2 Leves, 3 sintonizados)
devolve `{ok:false, conflito}` e não muda nada.

**Eventos** (`CustomEvent` em `document`): `kf:pronta` `{versao:'2'}`, uma vez;
`kf:mudou` `{partes:['inventario'|'atributos'|'sins'|'tudo'], origem:'local'|
'drawer'|'outra-aba'|'import'|'reset'|'reconciliacao'|'desfazer', op, uid}`.
Sincronia entre abas por `storage` + `pageshow` + `visibilitychange` (adota o
storage quando o `rev` de lá é maior); campos digitados do drawer têm debounce
de 200ms com flush em `pagehide`.

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
