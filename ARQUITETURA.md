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

`data/bazar.json` é o único JSON lido em runtime (a Ficha usa para buscar
itens). Todo o resto — `tools/`, `templates/`, `data/*.json`, `partials/`,
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
tools/gerar_bazar.py           gerador do Bazar (escopo do Pedro)
tools/extrair_css.py           refatoração pontual de CSS (não é build)
tools/migrar_sistema.py        migração pontual do Sistema (já rodada)

css/style.css                  design system: tokens :root, layout, globais
css/classes.css                componentes das 7 páginas de classe
css/racas.css                  componentes das 7 páginas de raça
js/main.js                     splash, menu mobile, smooth scroll, fade-in
                               + auto-injeta ficha.js em todas as páginas
js/utils.js                    sidebar direita (índice, recentes, busca)
js/ficha.js                    Ficha Interativa (drawer, DnD, export, Bestiário)

data/*.json                    sistema, magias, condicoes, limiar, origens,
                               racas, bazar
data/classes/*.json            7 classes
data/racas/*.json              7 raças
data/ficha.schema.json         contrato da ficha + projeção Bestiário
data/Bazar_Khalkaria_v25.csv   fonte do Bazar (escopo do Pedro)

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
python tools/build.py                  # gera tudo (menos Bazar) + valida
python tools/build.py --bazar          # inclui o Bazar
python tools/build.py magias racas     # alvos específicos
python tools/build.py --no-check       # sem validar
python tools/validar.py                # só valida
python tools/gerar_webp.py --force     # reencoda todas as imagens
python tools/sync_notion.py status     # snapshots do Notion disponíveis
python tools/sync_notion.py report     # diff: o que mudou no Notion
python tools/sync_notion.py accept     # promove .new -> .base
```

`validar.py` checa: tags balanceadas, âncoras `#x` com destino, IDs duplicados,
links/assets locais existentes, round-trip JSON→HTML e consistência das
24 sidebars.

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
3. **`js/ficha.js` injeta o próprio CSS** (`injectCSS`, ~50 linhas). Funciona,
   mas deixa a ficha fora do design system — mover para `css/ficha.css`.
4. **Raças não estão na navegação.** A sidebar lista as 7 classes mas não as
   7 raças; chega-se nelas só pela página `racas.html`. Assimetria de UX.
5. **Restam ~120 KB de CSS inline** nos templates de classe e raça. É CSS
   legitimamente por página (cores de ramo interligadas às regras), mas parte
   dele viraria variação de token se o design system crescesse.

## 8. Contrato da Ficha Interativa

`js/ficha.js` + `data/ficha.schema.json`. Persistência em `localStorage`
(`khalkaria_ficha`) com re-hidratação por página — **não** é SPA.
Dois exports: nativo (`.khalkaria.json`, superset) e projeção Bestiário
(`.bestiario.json`, `type:"npc"`, mapeamento `prof_*` no CLAUDE.md §5).
Cards viram arrastáveis pela tabela `MAPA` em `ficha.js` — ao criar um novo
tipo de card de conteúdo, registrar o seletor lá.
