# Changelog — Khalkaria_Html

Versionamento semântico. Cada versão é uma tag git.

## v1.6 — 2026-09-25 · Filtros em trilha e navegação recolhível

### Mudado
- **Filtros do Bazar:** as cinco linhas — Categoria, Raridade, Ofício, Região e
  Arquétipo — seguem agora o formato de trilha aprovado na Região: segmentos
  iguais numa fileira, com glifo, contagem e nome. A cor só aparece onde é dado
  (raridade com as cores fixas, região com o calor 1→8); o resto usa âmbar
  neutro. O Arquétipo mostra os 22 itens agrupados por família, sem o "+14".
- **Navegação lateral redesenhada:** glifos SVG gravados no lugar dos emojis,
  raízes preto-sobre-preto, grupos Raças e Classes recolhíveis e link atual
  marcado com `aria-current`.
- **Navegação recolhível:** um trilho de 64 px com dica em cada ícone, pelo
  botão ou pela tecla `\`. O estado fica lembrado entre páginas e é aplicado
  no `<head>`, antes do primeiro desenho, então a página não pisca aberta. No
  Bazar, o registro ganha espaço (644 → 860 px em 1366).
- O menu do celular passou para `js/nav.js` e agora também existe no Bazar.
- O card do Bazar no Início mostra a contagem real de itens, preenchida pelo
  build (dizia 581).

## v1.5 — 2026-09-25 · Bazar v3 e inventário da Ficha

### Adicionado
- **Painel de receita à esquerda.** Clicar num item abre a receita num painel
  que cobre a navegação: medalhão, "Guardar" com a projeção de carga ("vira
  Sobrepeso Leve"), ingredientes com arte, "tenho x/n" e onde achar cada um,
  cadeia de fabricação inteira, "Entra em N receitas" e ficha técnica.
  Histórico ‹ › com `[` `]`, link direto `#item/<id>`.
- **Pop-up do card no hover** em todo ingrediente, degrau, uso, migalha, linha
  do inventário, opção do "Guardar item…" e na coluna Nome da Lista.
- **Inventário no Bazar**, em duas colunas — Bugigangas e Equipamentos —, que É
  o inventário da Ficha (mesmo estado, sincronizado com o drawer e entre abas).
  Peso total, réguas de carga até 2× o máximo, Sobrepeso Leve/Extremo com o
  texto da condição, caixa "Item Empilhável" (10 unidades = 1 de peso, marcada
  pelo registro), Equipado (não pesa; 1 Armadura Pesada e 2 Leves),
  Sintonizado (até 3), bolsas e mochilas somando capacidade, stepper, mover
  entre colunas, remover com Desfazer (Ctrl+Z). Adiciona por "+ inventário",
  arrastando, pelo painel ou pelo campo "Guardar item…" ("11 flecha").
  Modos painel, trilho (Shift+I) e amplo.
- **"Fecha com o inventário"**, no lugar da Mochila de texto livre: mostra o que
  o que você carrega fecha, e "Quase fecha · falta um ingrediente" com o que
  falta e onde achar.
- **Motor de carga** (`KhInv`, dentro do `js/ficha.js`) com 80 testes
  (`node --test`), e guarda-fio no validador que falha o build se as frases de
  peso do Sistema mudarem no Notion.
- Arte dos 32 materiais, conferida pelo Pedro.

### Mudado
- **Ficha 2.0.** O inventário passa de 4 listas para 2 colunas. A migração é
  automática, idempotente e guarda antes um backup em
  `localStorage.khalkaria_ficha_v1_backup`. Duplicatas se fundem, armaduras e
  materiais passam a pesar.
- **Export do Bestiário:** armaduras deixam de sair em `weapons[]` (um
  `indexOf('arma')` casava com "Armadura").
- Filtros: raridade desligada é neutra; regiões viram uma trilha de perigo numa
  linha só. A Lista alinha e o cabeçalho gruda sob a barra.
- Raças na navegação; catálogo v26 (727 itens).

### Corrigido
- Cache pós-deploy: todo JS/CSS local das 24 páginas sai com `?v=<hash>`. Antes,
  o navegador servia um `ficha.js` antigo fora do Bazar depois de um deploy.
- 14 defeitos confirmados por revisão adversarial, entre eles: XSS por ficha
  importada, ping-pong infinito entre duas abas com catálogos diferentes, e
  Equipado/Sintonizado valendo para a pilha inteira em vez de por unidade.

### Pendente com o Pedro
Munição 10:1 (CSV) × 20:1 (CLAUDE.md §2); limites Pesada/Leve independentes;
mochilas diferentes somando; Sintonizado sem efeito no peso; arma empilhável
(Estilhaços do Abismo) em Bugigangas. Todas com padrão aplicado numa constante.

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
