# Arquitetura do repositório — Khalkaria_Html

Mapa técnico do site. Complementa o `CLAUDE.md` (que define o protocolo);
este documento descreve **como o repositório está montado hoje** e onde estão
as dívidas estruturais. Mantido pelo agente de desenvolvimento web.

---

## 1. Fluxo de dados

```
Notion (fonte da verdade)
   │  notion-fetch (MCP, só o agente chama)
   ▼
notion_cache/<slug>.new.md          snapshot bruto
   │  sync_notion.py report          diff normalizado .base vs .new
   ▼
data/*.json                          conteúdo mecânico estruturado
   │  build.py  →  gerar_*.py + templates/*.template.html
   ▼
pages/*.html                         ARTEFATO — nunca editar à mão
   │  validar.py
   ▼
GitHub Pages
```

`pages/*.html` é saída de build. Qualquer edição manual é sobrescrita no próximo
`build.py` e o `validar.py` acusa (`round-trip`).

## 2. Árvore

```
index.html                  landing (HTML manual)
build.py                    orquestrador: roda todos os geradores + valida
validar.py                  integridade estrutural (método §6 do CLAUDE.md)
sync_notion.py              motor de diff de snapshots do Notion
gerar_<pagina>.py           6 geradores JSON -> HTML
gerar_bazar.py              gerador do Bazar (escopo do Pedro, fora do build padrão)
Bazar_Khalkaria_v25.csv     fonte do Bazar (escopo do Pedro)

css/style.css               design system: tokens :root, layout, componentes
js/main.js                  splash, menu mobile, smooth scroll, fade-in
                            + auto-injeta ficha.js em todas as páginas
js/utils.js                 sidebar direita (índice, recentes, busca no Bazar)
js/ficha.js                 Ficha Interativa (drawer, DnD, export/import, Bestiário)

data/*.json                 magias, condicoes, limiar, origens, racas, bazar
data/classes/*.json         7 classes
data/racas/*.json           7 raças
data/ficha.schema.json      contrato da ficha + projeção Bestiário (x-bestiary)

templates/                  scaffold + <style> por página, placeholders {{CARD_n}}
pages/                      artefato gerado (+ sistema/classes/criacao manuais)
images/                     arte (41 MB — ver dívida #3)
notion_cache/               snapshots do Notion (git-ignorado, exceto pages.json)
```

## 3. Cobertura do pipeline

| Página | Gerador | JSON | Situação |
|---|---|---|---|
| magias, condicoes, limiar, origens | sim | sim | migrado |
| racas + 7 subpáginas | sim | sim | migrado |
| 7 classes | sim | sim | migrado |
| bazar | gerar_bazar.py | sim | escopo do Pedro |
| **sistema** (123 KB) | **não** | **não** | **HTML manual** |
| **classes.html, criacao.html, index.html** | **não** | **não** | **HTML manual** |

19 páginas fecham round-trip byte-a-byte. 4 ainda são editadas à mão.

## 4. Comandos

```bash
python build.py                  # gera tudo (menos Bazar) + valida
python build.py --bazar          # inclui o Bazar
python build.py magias racas     # alvos específicos
python validar.py .              # só valida
python sync_notion.py status     # snapshots do Notion disponíveis
python sync_notion.py report     # diff: o que mudou no Notion
python sync_notion.py accept     # promove .new -> .base (novo baseline)
```

`validar.py` checa: tags balanceadas, âncoras `#x` com destino, IDs duplicados,
links/assets locais existentes, round-trip JSON→HTML e consistência das 24 sidebars.

## 5. Dívidas estruturais conhecidas

1. **Sidebar duplicada em 24 páginas** (18 links cada). Hoje consistentes — o
   `validar.py` passa a acusar quando divergirem. Toda mudança de navegação
   exige editar 24 arquivos (12 templates + 4 páginas manuais + o resto via build).
2. **~59 KB de CSS inline duplicado** entre páginas; 111 regras repetidas em 2–7
   páginas (o bloco `.class-hero/.quick-stats/.formula-grid` está 7×). Além disso
   11 seletores existem **ao mesmo tempo** em `css/style.css` e inline — o inline
   vence, o que torna `style.css` enganoso.
3. **Imagens: 41 MB.** `landing.png` 10,2 MB, `teurgo.png` 7,3 MB,
   `alquimista.png` 7,2 MB. `espadachim_triptych.png` é cópia byte-a-byte de
   `espadachim.png` e não é referenciada por nenhuma página.
4. **IDs de âncora voláteis.** `js/utils.js` gera `sec-N` por índice em runtime
   para 100% dos 260 títulos `h2/h3`. Não existem no HTML servido: link
   compartilhado quebra quando a página muda de ordem.
5. **`js/ficha.js` injeta o próprio CSS** (`injectCSS`, ~50 linhas) em vez de usar
   `css/`. Dificulta ajustar a ficha junto do design system.
6. **`pages/sistema.html`** (123 KB, maior página do site) fora do pipeline JSON.
7. **Manifesto do Notion incompleto**: faltam `racas` (índice) e as 17 origens
   como páginas próprias — há 17 `.new.md` em `notion_cache/origens/` sem UUID
   correspondente em `pages.json`.

## 6. Contrato da Ficha Interativa

`js/ficha.js` + `data/ficha.schema.json`. Persistência em `localStorage`
(`khalkaria_ficha`) com re-hidratação por página — **não** é SPA.
Dois exports: nativo (`.khalkaria.json`, superset) e projeção Bestiário
(`.bestiario.json`, `type:"npc"`, mapeamento `prof_*` no CLAUDE.md §5).
Cards viram arrastáveis pela tabela `MAPA` em `ficha.js` — ao criar um novo tipo
de card de conteúdo, registrar o seletor lá.
