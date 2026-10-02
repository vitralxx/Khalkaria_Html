# F4.4 · Drawer da ficha nova à direita, empurrando o conteúdo (especificação, 2026-10-02)

Base:
- respostas do Pedro no `03 §9`: drawer só na ficha nova e atrás da prévia; trilho de 48 px com mini barras; abas reordenáveis por navegador;
- plano `02` (M1, §F4);
- mapeamento do drawer v2.1 de 2026-10-02;
- a página da ficha (F4.3, `05-f4-pagina.md`).

## Regras

- **Só com a prévia ligada** (`html[data-ficha-previa]`, marcado pelo `head-boot`). Sem a prévia, nenhuma página muda: o `[estilo]` tem de dar diferença zero no `antes/depois`, e só o carimbo do `css/**` pede recaptura.
- **Só leitura até a virada.** O drawer mostra a ficha nova calculada da ficha atual, como a página. Editar continua na ficha atual (v2.1), que segue abrindo por cima (overlay, `#kf-drawer`), e o contrato `window.KF` e os ids `#kf-drawer`, `[data-kf-ignorar]` e `.kf-addbtn` não mudam.
- **Substitui o painel flutuante da prévia** (`#kf3-previa`, `kh-previa.js`). Com a prévia ligada, o drawer docked é a forma de ver a ficha nova fora da página da ficha. O snapshot de ouro do `KhPrevia.render` não muda: a função de render fica, e só o painel sai.

## Layout, sem salto

- **Estado do drawer:** `localStorage.khalkaria_ficha3_dock`, que vale `'aberto'` ou `'trilho'` (padrão `'trilho'`).
- **Boot:** o `partials/head-boot.html` marca `html[data-ficha3="aberto"|"trilho"]` antes do primeiro desenho, e SÓ com a prévia ligada. Leituras em try/catch; os testes do boot (`tools/testes/nav.test.js`) cobrem o caso.
- **Tokens:** em `css/tokens.css`, `--ficha3-w` com 380 px (460 px a partir de 1800 px) e `--ficha3-trilho` com 48 px. Não se reaproveita o `--dir-w`, que hoje vale 240 px e é o da right-bar.
- **Regras de empurrar:** ficam em `css/style.css`, na `@layer layout`, guardadas pelo atributo, para que sem ele nada mude. Nunca no `css/ficha.css`, que não tem camada e venceria tudo.
  - `html[data-ficha3="aberto"] .main-content { margin-right: var(--ficha3-w) }`;
  - `html[data-ficha3="trilho"] .main-content { margin-right: var(--ficha3-trilho) }`;
  - a right-bar (240 px, `js/utils.js`) some com o drawer presente.
- **Reserva antes do JS:** o espaço do drawer tem um fundo de reserva em CSS desde o boot, para não abrir uma faixa vazia até o script montar.
- **Bazar:** não empurra até a F4b. No Bazar o drawer abre por cima, e o trilho fica sobre a calha de 40 px que o Bazar já reserva para a aba FICHA. A regra do Bazar exclui o empurrar pelo seletor da página.
- **Larguras pequenas:** abaixo de 1100 px o drawer aberto volta a ser overlay. Mobile não é prioridade (CLAUDE.md §5).
- **Convivência:**
  - a aba FICHA da v2.1 (`#kf-toggle`) e o botão de voltar ao topo deslocam para a esquerda do trilho ou do drawer;
  - o pop-up do `KhPrever` usa o `xPreferido` para não abrir embaixo do drawer;
  - o drawer v2.1 aberto fica por cima do v3, porque é onde se edita.

## Conteúdo

- **Cabeçalho:** nome da ficha, nível, raça e classe, e os botões:
  - "Abrir a página da ficha" (`pages/ficha.html`);
  - "Editar na ficha atual" (`KF.abrir()`);
  - recolher ao trilho.
- **Abas:** as mesmas 5 abas da página, na mesma ordem guardada (`KhAbas` com `khalkaria_ficha_abas`, sincronizada com a página). Densidade compacta para 380 px.
- **Render das abas:** o MESMO da página (sem cópia). Os renderizadores de aba saem de `js/ficha-pagina.js` para um módulo do bundle (`js/ficha/kh-ficha-abas.js`, `window.KhFichaAbas`), usado pela página e pelo drawer com uma opção de densidade. Os testes da página continuam passando.
- **Estilo:** o CSS do drawer (conteúdo, abas, densidade) é injetado pelo script só com a prévia, como o `css/ficha-previa.css` é hoje. Só as regras de empurrar e de reserva vão no `style.css`.
- **Conta:** todo número com a conta (`KhConta`, prefixo `fd`). A dica fica dentro do drawer, sem cortar.
- **Trilho fechado** (48 px):
  - mini barras verticais de Saúde, Stamina e Éter, atual sobre máximo, nas cores de recurso dos tokens e com a conta no foco ou no hover;
  - um botão para abrir;
  - antes de os dados carregarem, as barras ficam vazias.
- **Arrastar:**
  - no `dragstart` de um card (`.kf-draggable`, `[data-kf-tipo]`, item do Bazar), o trilho acende;
  - no `dragenter` sobre o trilho, o drawer abre;
  - ao soltar no drawer: item do Bazar (`{_bazar:true,item}`) vai para a ficha atual por `KF.adicionar`, que é o inventário compartilhado. Qualquer outra entidade mostra o aviso "A ficha nova ainda é só leitura: solte na ficha atual (botão FICHA) para levar técnicas e magias", sem perder o arrasto.
- **Atualização:** redesenha em `kf:mudou`, ao digitar no `#kf-drawer` e em `storage` da `khalkaria_ficha`, com debounce, e preserva foco e rolagem (o mesmo `trocaHTML` da página).
- **Teclado:**
  - Esc recolhe o drawer (camadaEsc do `KhTeclas`);
  - o foco vai para o drawer ao abrir pelo botão;
  - o drawer leva `[data-kf-ignorar]`, para o MutationObserver da v2.1 não decorar o que está dentro dele.

## Testes

- Boot: marca certa com e sem a prévia, e storage bloqueado.
- Sem a prévia: nenhum elemento do drawer, nenhum fetch, nenhuma escrita, e nenhum seletor de empurrar casa.
- Com a prévia:
  - trilho, abrir e recolher, com a preferência gravada só em `khalkaria_ficha3_dock`;
  - a ordem das abas compartilhada com a página.
- Arrastar: acende, abre, o item do Bazar vai ao `KF.adicionar` e o resto dá o aviso.
- Bazar: o conteúdo não é empurrado.
- O render das abas igual entre a página e o drawer, a menos da densidade.
- `kf-contrato` e o ouro da prévia intactos.
