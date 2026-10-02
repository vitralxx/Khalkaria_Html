# F4.3 e F4.5: página da ficha e abas reordenáveis (especificação, 2026-10-02)

Base: plano `02-plano.md` (M1, M2, §F4 e a tabela de fatias), respostas do Pedro `03 §4` (campos do A4) e `03 §9`, e o mapeamento do código de 2026-10-02.

## Regras que valem para as duas fatias

- **Escondida até a virada** (`03 §9`): o item de navegação e a página só aparecem com a prévia ligada, isto é, `localStorage.khalkaria_ficha_previa === '1'`, ou `?ficha=v3` na URL, que já liga a prévia.
- **Só leitura.** A página lê a ficha v2 pelo `KhEstado.sombra` e calcula pelo motor v3. Ela não grava nenhuma chave de ficha. As únicas escritas permitidas são a preferência de ordem das abas (F4.5) e a da aba aberta.
- **Todo número com a conta** (tooltip de fórmula): usar o `KhConta` (F4.1) com um prefixo próprio, `fp`, para não colidir com os ids `kf3-` da prévia, que pode estar aberta na mesma página.
- **Fonte × artefato:**
  - `pages/ficha.html` é gerada de `templates/ficha.template.html` por `tools/gerar_ficha.py`. Entra no `tools/build.py` e no round-trip do `tools/validar.py` (lista GERADORES), senão o round-trip a pula calado.
  - O JS da página vai em `js/ficha-pagina.js`, só nesta página, carregado depois do `js/ficha.js` síncrono, como faz o Bazar. O CSS vai em `css/ficha-pagina.css`, em `@layer paginas`.
- **Navegação:**
  - Item "Ficha" no `partials/sidebar.html`, com glifo `nv-ficha` no sprite, marcado `data-so-previa`.
  - O `partials/head-boot.html` passa a marcar `html[data-ficha-previa]` quando a prévia está ligada, por chave ou por `?ficha=v3`, antes do primeiro desenho, para a página não piscar.
  - Uma regra em `css/componentes.css` esconde `[data-so-previa]` sem essa marca.
  - Os testes do boot (`tools/testes/nav.test.js`) seguem valendo: leitura em try/catch e comparação com `'1'`.
- **Sem a prévia, abrindo `pages/ficha.html` direto:** a página mostra um aviso curto ("A ficha nova está em preparação. Por enquanto, use a ficha atual, no botão FICHA da lateral.") e não carrega catálogo.
- **Portões:**
  - `[6]` da nav: link, um `aria-current` por página e glifo com símbolo.
  - `[ids]`: não escrever `id` em h2/h3.
  - `[estilo]`: o item novo da nav entra em todas as capturas. Recapturar e registrar em `tools/estilo/revisado.json` com o motivo ("item Ficha oculto sem a prévia"). O diff visível tem de ser zero sem a prévia.

## F4.3 · Página da ficha (5 abas do A4)

Topo da página:
- seletor de ficha, desabilitado até a virada, mostrando só a ficha atual;
- nome, raça, classe, nível e origem;
- o aviso "Ficha nova em prévia: só leitura. Para editar, use a ficha atual (FICHA)", com o botão que abre o drawer da v2.1.

**1. Núcleo** (A4 pág. 1). Os números vêm todos do motor, com a conta:
- identidade (Nível, XP, Nome, Jogador, Raça, Classe, Origem);
- 5 atributos, cada um com Total e Mod., e ilustração de traço;
- 24 perícias, cada uma com 4 círculos de grau (0–4), o atributo usado e o total;
- recursos com atual e máximo: Saúde, Stamina, Éter e recurso de classe (medidor ou "sem contador", D105), com as cores de recurso dos tokens (Saúde vermelho, Stamina amarelo, Éter verde e roxo);
- derivados: Evasão Passiva e Ativa, CD, Movimento, Ações e Sins;
- capacidade de Equipamentos e de Bugigangas, com régua e o estado de Sobrepeso;
- Armadura e resistências: Ar, Ae por categoria e a tabela de 14 tipos R/I/V/Ae/Redução;
- Marcas da Vhelor, só se houver 1 ou mais.

**2. Técnicas & Marcas** (pág. 2), a partir das entradas migradas da ficha. Cada técnica é resolvida no catálogo pelo id ou pelo nome, conforme a migração.
- **Grupos:** Técnicas Gerais, Técnicas de Ramo (Tier 1, 2 e 3), Marcas, Ultimates e Diversas. Diversas reúne traços, variante, tecnologias, corrupções e técnica de origem.
- **Card:** nome, ação e custo (o `custoTexto` do catálogo) e o texto.
- **Órfãs:** entrada sem catálogo aparece com o texto salvo e a marca "órfã".
- **Tier ou Marca acima do nível:** a moldura mostra o nível que destrava (D34).

**3. Cartas, Lore & Outros** (pág. 3):
- 11 molduras de carta (4+4+3), cada uma com o requisito ok ou aviso;
- saldo do Limiar (nó `limiar.saldo`, com a conta);
- carta rara não revelada: ícone, requisito e nome, nunca o efeito;
- História e Outros.

**4. O Bazar** (pág. 4): o mesmo inventário da ficha, só leitura:
- Bugigangas;
- Equipamentos: Pesados (2), Leves (3), Armas e Outros (3);
- Materiais por raridade;
- marcas de Sintonizado (máx. 3) e Equipado;
- Sins e carga.

**5. Grimório** (pág. 5): magias por nível (1–5), cada uma com Nome, Ação, Alvo, Resist., Alcance e Duração e o custo nas intensidades com a conta (Nv1 sem Contida, Nv5 com Foco Primordial).

**Visual:**
- ver o Bazar e as respostas do Pedro: títulos em `--font-gothic`, rótulos em Cinzel e corpo em Crimson Text;
- moldura com raízes em SVG, no padrão do Bazar, sem raster;
- ícones do A4 de `tools/artefatos/saida/pag1` e `icones/` (Stamina amarela e Éter verde/roxo já recoloridos) copiados para `images/ficha/` com nomes limpos (`saude.png`, `stamina.png`, `eter.png`, `movimento.png`, `sins.png`, `evasao.png`, `armadura.png`, `cd.png`, `forca.png`…), em tamanho de uso (até 256 px). O build gera o WebP.

**Testes:**
- estrutura das 5 abas por conjunto contra o `03 §4`;
- todo número com conta e tooltip;
- nenhuma escrita de chave de ficha (storage falso);
- sem a prévia, o aviso aparece e o catálogo não é buscado;
- `nav.test.js` com a marca nova.

## F4.5 · Abas reordenáveis (por navegador)

- **Lista de abas:** `role=tablist` com tabindex móvel. Setas trocam de aba; **Alt+← / Alt+→** movem a aba de lugar, com atalho registrado no `KhTeclas`. O atalho só age quando a aba tem foco de teclado (`:focus-visible`): depois de um clique, Alt+← continua sendo o Voltar do navegador. Também dá para arrastar com o mouse (pointer events; o arrasto tem limiar para não brigar com o clique).
- **Ordem guardada:** `localStorage.khalkaria_ficha_abas`, uma lista de ids de aba. É compartilhada com o drawer da F4.4 e vale para todas as fichas do navegador. Não vai no export. Lista inválida ou incompleta volta à ordem do A4 e acrescenta as abas novas no fim.
- **"Ordem do A4":** botão que restaura a ordem.
- **Aba aberta:** `sessionStorage.khalkaria_ficha_aba`.
- **Movimento reduzido:** respeita `html[data-movimento=reduzido]`.
- **Testes:**
  - mover pelo teclado e pelo arrasto simulado;
  - persistência;
  - lista corrompida no storage;
  - restaurar;
  - acessibilidade: `aria-selected`, `aria-controls` e foco.
