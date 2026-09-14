# Changelog — Khalkaria_Html

Versionamento semântico. Cada versão é uma tag git.

## v1.4 — 2026-09-14

Reorganização estrutural do repositório. Nenhuma mudança de conteúdo canônico:
o texto visível das páginas é idêntico ao da v1.3, com as exceções anotadas.

### Corrigido
- `<div class="hero-content">` nunca fechada nos templates de **alquimista,
  batedor e monge** — `.quick-stats` vazava do hero em 3 das 7 classes.
- `</main>` e `</div>` ausentes no template de **origens**.
- Índice de **Condições** apontava para `#embriagado`, id inexistente. A
  condição chama-se **Bêbado**; link e rótulo corrigidos.
- `sync_notion.py` procurava os snapshots achatados (`classes__monge.md`)
  enquanto eles vivem em subpasta (`classes/monge.md`): **14 dos 20 slugs**
  estavam invisíveis para o motor de diff, incluindo as 7 classes e as 7 raças.
- CSV do Bazar com a linha de cabeçalho no fim do arquivo (efeito de uma
  reordenação), o que quebrava o `csv.DictReader` com `KeyError: 'Nome'`.
- `gerar_bazar.py` gravava por padrão em `site_v24/Khalkaria_Html-main/`,
  caminho legado da v24. Agora grava em `pages/bazar.html`.
- Regenerar o Bazar propagou uma edição do CSV que ainda não estava no
  artefato: **Punho de Mundarak** passa de "ignoram Ae" para "esse dano
  ignora Ar".

### Mudado
- **Raiz organizada.** Os 10 scripts foram para `tools/`, o CSV do Bazar para
  `data/`. Removidos `site_v24/` e `preview.txt`.
- **Navegação em fonte única.** `partials/sidebar.html` define a nav; o build
  a reaplica nas 24 páginas com os caminhos relativos e o link ativo corretos.
  Antes eram 25 cópias (24 páginas + uma embutida no `gerar_bazar.py`).
- **Âncoras determinísticas.** Cada h2/h3 recebe no build um id derivado do
  texto (`#custo-base-por-nivel`), com escopo do h2 para os h3. Substitui os
  `sec-0/sec-1` que o `utils.js` inventava em runtime e que mudavam de alvo a
  cada reordenação. **Links para seções internas mudaram de endereço.**
- **CSS em camadas.** `css/style.css` (design system) → `css/classes.css` e
  `css/racas.css` (componentes por família) → `<style>` inline só com o que é
  da página. 713 linhas saíram dos templates.
- **Imagens em WebP.** Acervo servido de 38,9 MB para 7,9 MB (80% menor);
  `landing.png` de 10,2 MB para 0,85 MB. Os PNG seguem como fonte.
- **Sistema entra no pipeline JSON** (`data/sistema.json`, 7 categorias e 37
  subseções endereçáveis). Era a maior página editada à mão.

### Adicionado
- `tools/build.py` — um comando gera e valida o site inteiro.
- `tools/validar.py` — automatiza o método §6: tags balanceadas, âncoras com
  destino, IDs únicos, links/assets existentes, round-trip JSON→HTML e
  consistência das sidebars.
- `ARQUITETURA.md` — mapa técnico do repo.

### Removido
- `images/espadachim_triptych.png`, cópia byte-a-byte de `espadachim.png` sem
  referência em nenhuma página.

### Verificação
- `tools/validar.py`: 24 páginas íntegras, 24 sidebars consistentes, 20 páginas
  fechando round-trip byte-a-byte.
- Navegador, 24 páginas: 0 imagem quebrada, 0 âncora sem destino, 0 erro de
  console, ficha presente em todas.
- CSS: estilo computado de ~25 mil elementos comparado antes/depois da
  refatoração — 0 divergências.
