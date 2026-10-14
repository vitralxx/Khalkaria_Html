# Correções do drawer e F4.6 · edição da ficha nova em modo Ensaio (especificação, 2026-10-09)

Base:
- plano `02` (M1, M2, §3.1, §F4 e a tabela de fatias);
- respostas do Pedro no `03 §9`;
- especificações `05-f4-pagina.md` e `06-f4-drawer.md`;
- pedido do Pedro em 2026-10-09: "corrija os 3 detalhes. pode seguir com o planejamento".

## 0. Correções do drawer (os 3 detalhes)

1. **Soltar técnica ou magia.** Hoje o aviso manda soltar no botão FICHA, mas esse botão (`#kf-toggle`) não aceita soltar.
   - **Correção:** o drawer descobre o tipo da carta já no `dragstart`, pelo card de origem: `.item-card` é item do Bazar; `[data-kf-tipo]` ou `.kf-draggable` é outra entidade.
     - Item do Bazar no `dragenter`: abre o drawer novo, como já faz hoje.
     - Outra entidade no `dragenter`: abre a ficha atual (`KF.abrir(secao)`, na seção do tipo: técnicas, grimório ou cartas). As zonas de soltar dela aparecem sob o cursor, e a carta é solta lá.
   - **O aviso passa a dizer** o que acontece: "A ficha atual abriu: solte a técnica nela."
   - **Com o Ensaio ligado** (§1), qualquer entidade vai para a ficha do ensaio, e esse desvio não acontece.
   - **A v2.1 não muda:** só o drawer novo, que só existe com a prévia.
2. **Dica de fórmula cortada** no topo da área que rola dentro do drawer.
   - **Causa:** o `KhRedesenho.encaixa` escolhe abrir para cima ou para baixo pela janela, e não pela caixa que rola.
   - **Correção:** a escolha passa a usar os limites da caixa (`.fd-gaveta-rolagem` no drawer, `#fp` na página).
     - Se a dica não couber em nenhum dos lados, ela vai para o lado com mais espaço e ganha altura máxima.
     - Se a caixa corta pelo `overflow`, a dica é posicionada fora do fluxo (`position: fixed`, calculada do retângulo da conta), para não ser cortada.
   - **Prova:** com um script, a 1366×768 e a 1920×1080, abrir a dica de toda conta das 5 abas, no drawer e na página. Nenhuma pode ficar cortada pela caixa nem pela janela.
3. **Tabelas largas passando por baixo do drawer aberto** a 1366 px com a navegação aberta.
   - **Correção:** com o drawer aberto (`html[data-ficha3="aberto"]`), nenhum elemento do `.main-content` pode passar da borda direita do conteúdo. O elemento largo (tabela, grade) rola na horizontal dentro da própria caixa, com a barra visível.
   - **A preferência de navegação do jogador não é mudada.** Recolher a navegação sozinho foi descartado: é a escolha dele.
   - **Regras em `css/style.css`, `@layer layout`,** guardadas pela marca. Sem a prévia, o `[estilo]` continua com diferença zero.
   - **Prova:** com um script nas 24 páginas, a 1366 e a 1440 px, com a navegação aberta e o drawer aberto, nenhum elemento pode ter `right` maior que a borda do `.main-content`.

### Como ficou (§0, 2026-10-09)

Código: `js/ficha/kh-ficha-drawer.js` (`leCarta`, `avisoAbriu`, `avisoRecusa`, a nota), `js/ficha/kh-redesenho.js` (`planoDica`, `limites`, `recorta`, `reencaixa`), `js/ficha-pagina.js` (reencaixa ao rolar), `css/ficha-drawer.css` (`.fd-gaveta-nota`), `css/style.css` (a regra da tabela). Testes: `tools/testes/ficha-drawer.test.js` e `tools/testes/kh-redesenho.test.js`. Provas no navegador: `tools/testes/navegador/dicas-conta.js` e `tools/testes/navegador/transborda-drawer.js` (instruções no topo de cada um).

1. **Soltar técnica ou magia.**
   - O aviso não cabe dentro do drawer novo: com a ficha atual aberta por cima ele fica coberto (e no trilho, escondido). A frase sai numa **nota fora da folha**, à esquerda do drawer v2.1 (`#fd-gaveta-nota`, `role="status"`), e some 6 s depois do fim do arrasto.
   - A seção vem do `_campo` do arrasto da v2.1 (o MAPA dela); sem ele, do `data-kf-tipo` do card; sem os dois, técnicas. **Raça e condição** não têm zona de soltar na ficha atual: o drawer abre, não aceita e diz "A ficha atual não recebe a raça por arrasto: preencha à mão, na ficha atual (FICHA)."
   - O gancho do Ensaio já está: com `KhEnsaio.ligado()`, o desvio não acontece (o soltar no ensaio chega na F4.6c; até lá o drawer recusa e diz isso, revisão da F4.6a).
2. **Dica de fórmula.**
   - Os limites são a caixa de padding (sem a barra de rolagem, que cortava 2,5 px à direita em toda conta do drawer) cortada pela janela.
   - **Escolha a revisar com o Pedro:** fora do fluxo (no drawer), quando a dica não cabe na rolagem em nenhum lado, ela usa a altura da janela, inteira, por cima do cabeçalho do drawer, antes de ganhar altura máxima. Só sem lugar nem na janela ela é truncada. Truncar escondia a fórmula, que é o que a dica mostra.
   - Ao rolar a caixa (ou a página), a dica fora do fluxo segue a conta.
3. **Tabelas largas** (refeito na revisão de 2026-10-10).
   - Quem rola é a **própria tabela**, e só a que é mais larga que a caixa. Com o drawer aberto, nas páginas empurradas (não no Bazar), o `kh-ficha-drawer.js` (`marcaLargas`) marca com `data-fd-larga` cada tabela do `.main-content` cuja borda direita passa da caixa de conteúdo (a do pai e a do `.main-content`). O `css/style.css` (`@layer layout`) faz `display: block; max-width: 100%; overflow-x: auto` só nelas: a barra fica colada no pé da tabela.
   - As que cabem não mudam (ficam `display: table`, com a largura cheia). O pai não ganha `overflow`: o bullet de um `<li>` com tabela (Batedor, Teurgo) fica, e as margens continuam colapsando (a página não salta na vertical).
   - Reavalia ao abrir e ao recolher (na hora), no `ResizeObserver` do `.main-content` (janela, fontes, aba ou `<details>` que abre) e quando a nav troca (`html[data-nav]`). Ao recolher, a marca sai.
   - Uma tabela dentro de um dos 13 wrappers `overflow-x: auto` do Sistema que passa da caixa dele também é marcada: rola ela mesma, e a barra deixa de ficar 1rem abaixo da tabela (a margem dela dentro do wrapper). Sem o drawer aberto, os wrappers rolam como antes.
   - O `overflow-x` leva `!important`: a `.progression-table` do Espadachim tem `overflow: hidden` sem camada, que venceria a regra da camada.
   - A vertical da tabela marcada fica `hidden`, para não nascer barra de 1 px por arredondamento.
   - **A nota** (item 1) fica à esquerda do **mais largo** dos dois drawers, pelas larguras reais (`direitaNota`). A 1800 px ou mais, este tem 460 px e o v2.1, 420: antes ela cobria 28 px da faixa deste.

Números (fixture `ficha-v2-sintetica.json`; antes = `bee169f`):

| Prova | Antes | Depois |
|---|---|---|
| Dicas, 1366×768 e 1920×1080, drawer e página (552 contas, 1556 aberturas) | 530 cortadas, todas no drawer (2,5 px pela barra de rolagem) | 0 |
| Dicas, drawer a 1366×600 e 1280×520 (extra) | 552 cortadas (11 no topo, até 66 px) | 0 (11 passam por cima do cabeçalho) |
| Dicas, página a 1280×520 (extra) | 3 cortadas pela janela | 3 com altura máxima (a janela não tem lugar) |
| Transbordo, 24 páginas × 1366 e 1440 px | 32 elementos em 2 casos (Magias e Sistema a 1366, até +48,8 px) | 0 (19 caixas rolam, todas com barra; nenhuma recorta na vertical) |
| Revisão (2026-10-10), as mesmas 48 medições: quem rola | o cartão inteiro (Magias "Intensidade", Sistema "Khan Sins"), barra ~850 px abaixo do cabeçalho da tabela | 17 tabelas marcadas, todas rolam elas mesmas, barra a 0 px da última linha; 0 que cabem mudaram |
| Revisão: bullet de `<li>` com tabela | 5 sumiam (4 no Batedor, 1 no Teurgo) | 0 recortados (14 `<li>` com tabela medidos) |
| Revisão: altura do `.main-content`, aberto x recolhido na mesma largura | Magias +66 px, Alquimista +72, Corrompido +48 (margens sem colapsar) | 0 px além das barras horizontais, nas 48 |
| Revisão: a nota a 1920 px | 28 px por cima da faixa do drawer novo | 12 px à esquerda dele (e 12 px do v2.1 a 1366) |

## 1. A lógica do Ensaio

O problema:
- as telas de escrita da ficha nova (seletor, edição, ajuste, levar) precisam ser vistas e testadas pelo Pedro antes da virada;
- até a virada, nada pode gravar nas chaves da ficha dos jogadores (`khalkaria_ficha`, `khalkaria_fichas_v3`, `khalkaria_ficha_v3:*`, `khalkaria_ficha_dono`).

A solução é o **modo Ensaio**:
- o armazém v3, que já existe e é testado (`KhEstado.armazem`), roda sobre um **adaptador de armazenamento** que grava no `sessionStorage` da aba, com prefixo `khalkaria_ensaio:`;
- as chaves de verdade nunca são tocadas;
- a ficha do ensaio vale enquanto a aba estiver aberta, em todas as páginas dessa aba, então dá para ir à página de uma classe e levar técnicas;
- fechar a aba ou "Sair do ensaio" apaga tudo.

Funcionamento:
- **Quem vê:** só quem ligou a prévia (`?ficha=v3`). Para os jogadores nada muda.
- **Entrar:** botão "Ensaiar edição" na página da ficha e no drawer.
  - Na primeira vez, o ensaio nasce com uma ficha migrada **em memória** da ficha atual (`migrarV2paraV3`). Sem ficha atual, nasce uma ficha em branco.
- **Faixa fixa** enquanto o ensaio está ligado: "Ensaio: nada aqui é salvo na sua ficha. Tudo some ao fechar a aba." Ela tem "Exportar ensaio" (baixa um pacote `fichas/1`) e "Sair do ensaio".
- **Leitura:** com o ensaio ligado, a página e o drawer leem a ficha ativa do ensaio (`armazem.ler`) e calculam pelo motor. Sem ele, continuam lendo a sombra da ficha atual, como hoje.
- **Por que isso prepara a virada:** na F4.7, a mesma interface passa a usar o armazém real (`localStorage` com `gravarComProjecao`). Muda só o armazenamento por baixo, e o que o Pedro aprovou no ensaio é o que vai ao ar.

Módulo: `js/ficha/kh-ensaio.js` (`window.KhEnsaio`) cuida do adaptador, do ligado/desligado (`sessionStorage.khalkaria_ensaio_ligado`), do armazém, de entrar e sair (sair apaga só as chaves com o prefixo) e do evento `kh:ensaio` com as partes mudadas.

## 2. F4.6a · Ensaio e seletor de fichas

O seletor de fichas fica no topo da página e no cabeçalho do drawer, e só funciona no ensaio. Fora dele, o seletor fica como hoje: desabilitado, mostrando a ficha atual.
- **Lista:** nome, classe, nível e data de cada ficha. Trocar de ficha redesenha a página e o drawer.
- **Criar:** pede o nome e cria uma ficha em branco. O assistente de criação (M3) vem na F4c.
- **Duplicar:** id novo e "(cópia)" no nome.
- **Excluir:** confirmação em dois passos. Antes, baixa o export da ficha e pede que o jogador confirme que salvou (revisão da F4.2: o export não pode contar como feito sem confirmação).
- **Exportar:** esta ficha (`<nome>.khalkaria.json`) ou todas (`khalkaria-fichas.json`, `fichas/1`).
- **Importar:** ficha única ou pacote. Com id repetido, pergunta se atualiza (com export antes) ou faz cópia.
- **Uso do espaço:** mostra quanto está ocupado. Em QuotaExceeded, avisa e oferece "Exportar todas".

Testes:
- um armazenamento espião sobre o `localStorage` e o `sessionStorage` mostra que nada é escrito fora do prefixo, em nenhum fluxo;
- ciclo inteiro: criar, trocar, duplicar, excluir, importar e exportar;
- "Sair do ensaio" apaga só o prefixo;
- sem a prévia, nada aparece;
- o ouro da página e o do `KhPrevia.render` ficam intactos (o modo sombra não muda).

### Como ficou (§1 e §2, 2026-10-10)

Código: `js/ficha/kh-ensaio.js` (`KhEnsaio`: adaptador `prefixado`, `ligado`, `armazem`, `entrar`, `sair`, `calcular`, `uso`, `exportarEnsaio`, `emitir`), `js/ficha/kh-seletor.js` (`KhSeletor`: `criar`, o seletor; `ligarFaixa`, a faixa), `js/ficha-pagina.js` e `js/ficha/kh-ficha-drawer.js` (o botão, a leitura do ensaio, o lugar do seletor), `css/ficha-ensaio.css` (injetado só com o Ensaio) e o `.fd-gaveta-ke`/`.fd-gaveta-ensaiar` no `css/ficha-drawer.css`. Testes: `tools/testes/ensaio.test.js` (22, com o armazenamento espião em todos os fluxos da interface).

- Logo ao entrar, a página desenha a ficha do ensaio byte a byte igual à sombra (contas, topo e as 5 abas; o teste compara). Os avisos de entrada órfã da migração voltam pela própria ficha; os de identidade sem par, não (a ficha só guarda o nome).
- Com o Ensaio, o topo da página perde o seletor desabilitado e o aviso de só-leitura (com "Abrir a ficha atual" e "Sair da prévia"); o seletor de fichas fica acima do topo. No drawer, o seletor (compacto) ocupa o lugar do aviso.

Escolhas a revisar com o Pedro:
- **"Sair do ensaio" pede confirmação** ("Sair apaga as N fichas do ensaio desta aba"), com "Exportar ensaio" ao lado. Por isso "Sair da prévia" some com o Ensaio ligado: um clique nele apagaria o ensaio sem pergunta. Sem o Ensaio, "Sair da prévia" apaga o que tiver sobrado do prefixo.
- **Importar com id repetido → "Atualizar"** usa os mesmos dois passos do Excluir (baixar o export da que vai ser substituída e marcar "Salvei"). A especificação pede "com export antes"; a confirmação vem da revisão da F4.2.
- **"Exportar ensaio" baixa `khalkaria-ensaio.json`** (o mesmo pacote `fichas/1` do "Exportar todas", que segue `khalkaria-fichas.json`), para não se confundir com um export da ficha real.
- **Criar sem nome** cria "Ficha nova".
- **A faixa** fica no pé da janela, entre a nav e o drawer (à esquerda do drawer aberto também quando ele fica por cima: no Bazar e abaixo de 1100 px); o `html[data-ensaio]` reserva 3,5rem no pé da página e sobe o voltar ao topo.
- **Soltar no drawer com o Ensaio** (revisão de 2026-10-13): o drawer não aceita nada, nem o item do Bazar. Antes, o item ia para a ficha atual (`KF.adicionar`), contra a faixa ("nada aqui é salvo na sua ficha"). O aviso diz o que acontece: "Ensaio: levar a técnica para a ficha do ensaio chega na F4.6c. Soltar aqui não guarda nada, nem na sua ficha." (`avisoEnsaio`; com o item, o nome dele). Levar para a ficha do ensaio é a F4.6c.

### Revisão da F4.6a (2026-10-13)

Código: `js/ficha/kh-seletor.js` (`bloqueiaSaidaPrevia`, `pedirSaida` da faixa, o `pageshow`, a guarda das ações), `js/ficha/kh-ficha-drawer.js` (`avisoEnsaio`; sai o `AVISO_SO_LEITURA`), `js/ficha-pagina.js` e `css/ficha-ensaio.css`. Testes: `tools/testes/ensaio.test.js` (+3, com o espião também sobre a ficha atual falsa) e `tools/testes/ficha-drawer.test.js`.

1. **Página velha do bfcache** (Voltar no Chrome e no Firefox): ela voltava como estava, com "Sair da prévia" à vista e o ensaio já ligado por outra página da aba, e um clique apagava as fichas sem a confirmação.
   - A faixa ouve o `pageshow` (só com `persisted`) e emite o `kh:ensaio` com as 3 partes: a página, o drawer, os seletores e a faixa se acertam pelo estado de agora.
   - "Sair da prévia" confere o ensaio na hora do clique. Ligado, não apaga nada: a página se acerta, e a faixa abre a confirmação de "Sair do ensaio", com o porquê ("O ensaio está ligado nesta aba: saia dele antes de sair da prévia.") e o foco em "Continuar no ensaio".
   - "Ensaiar edição" com o ensaio já ligado não cria ficha: emite o evento, e a página se acerta.
   - As ações do seletor conferem o ensaio na hora: numa página velha que ainda mostra o ensaio depois de ele sair, a ação não grava, e o seletor some.
2. **Soltar no drawer com o Ensaio:** ver o item acima, em "Escolhas a revisar".
3. **A mensagem do seletor ao sair do ensaio:** sai junto (e o diálogo também). Antes, ficava à vista sobre uma ficha que não existe mais ("Importada e aberta: …").
4. **Arrastar técnica ou magia com o Ensaio:** o aviso não manda mais ao botão FICHA (que não aceita soltar) nem fala em "só leitura". Também sem o Ensaio, se o `KF.abrir` falhar, o aviso diz "abra pelo botão FICHA e arraste a técnica de novo".
5. **Botão principal desligado** ("Excluir de vez" e "Atualizar de vez" antes de "Salvei"): ganhou fundo próprio (`--bg-tertiary`, texto em 4,7:1). Antes ficava o âmbar do `.forte` com o texto apagado (1,37:1). A borda âmbar escura, tracejada, mostra qual é o principal.

## 3. F4.6b · Edição: campos, ajuste manual (M2) e desfazer

- **Toda alteração passa pelo armazém** (`gravar`), com um log por ficha para desfazer e refazer:
  - teto de 20 passos e 256 KB;
  - desfaz só o topo;
  - recusa se outra aba mudou a ficha.
- **Atalhos:** Ctrl+Z e Ctrl+Y no `KhTeclas`, fora de campo de texto, mais botões Desfazer e Refazer.
- **Campos de estado** editáveis direto na página:
  - nome, jogador, nível e XP;
  - raça, classe, origem, variante e ramo, por seletor do catálogo;
  - atributos base, graus das 24 perícias (clicando nos círculos) e recursos atuais;
  - Sins, idiomas, imunidades, Marcas da Vhelor, História e Outros;
  - no drawer, só os recursos atuais e Sins, com stepper.
- **Ajuste manual** em todo número ajustável (`KhEstado.PADRAO_AJUSTE`):
  - **pop-over "Ajustar":** Valor fixo (padrão) ou Diferença, Motivo e Remover;
  - **"Temporário" fica desabilitado,** com a nota "expira na Mesa (F5)", porque a expiração ainda não existe;
  - **exibição:** o número ajustado mostra calculado × ajustado e o aviso "o calculado mudou de X para Y";
  - **tela "Ajustes":** lista todos, com remoção em lote.
- **Números que não aceitam ajuste** (carga, Redução, tique de Morrendo, Stamina disponível) mostram a conta e o motivo de não serem ajustáveis.
- **Testes:**
  - editar, desfazer e refazer cada tipo de campo;
  - ajuste fixo e de diferença, propagando aos dependentes;
  - "o calculado mudou";
  - remover em lote;
  - o validador recusa ajuste em `recurso.*.atual`;
  - o log no teto.

### Como ficou (§3, 2026-10-14)

Código: `js/ficha/kh-edicao.js` (`KhEdicao`, puro: `campo`, `mudancas`, `passo`, `grauClicado`, `opcoesRef`, `montaAjuste`, `mudancaAjuste`, `mudancaRemover`, `motivoNaoAjuste`), `js/ficha/kh-editor.js` (`KhEditor`: a barra, o pop-over, a tela Ajustes, os atalhos), `js/ficha/kh-estado.js` (`armazem.editar`, `desfazer`, `refazer`, `estadoLog`; o log em `khalkaria_ficha_v3_log:<id>`, que no Ensaio leva o prefixo), `js/ficha/kh-ficha-abas.js` (`paineis(res, {editar})`), `js/ficha/kh-conta.js` (`{editar}`: o número ajustável vira botão), `js/ficha-pagina.js` (`#fp-ked`), `js/ficha/kh-ficha-drawer.js` (`#fd-gaveta-ked`), `data/ficha.schema.json` (`logDesfazer` com `refazer` e o `passoLog`) e o fim do `css/ficha-ensaio.css` (injetado só com o Ensaio). Testes: `tools/testes/edicao.test.js` (9: as puras, o log, o teto, a recusa, os ajustes, o validador, o HTML) e `tools/testes/ensaio.test.js` (+4: a interface na página e no drawer, a ORDEM e o CSS, com o armazenamento espião). Suíte: 431 testes.

- **Um passo = uma gravação.** Cada `change` (ao sair do campo, Tab ou Enter), clique num círculo, − ou +, ajuste aplicado ou remoção em lote é um passo do log, com o rótulo que o botão mostra ("Desfazer: Saúde atual: 19").
- **Sem o Ensaio**, a página e o drawer continuam só leitura e o HTML é o mesmo, byte a byte (o ouro da página e o do `KhPrevia.render` passam sem mudança). Ctrl+Z e Ctrl+Y não são tomados (o `preventDefault` não acontece).
- **No navegador** (1366×768, fixture sintética): editar o nome (e o Tab leva o foco ao Jogador, que fica depois do redesenho), clicar o 2º círculo de Reflexos (+3 → +7), ajustar a CD para 17 com motivo (o pop-over abre embaixo do número, e o foco volta a ele ao aplicar), Ctrl+Z duas vezes, Refazer pelo botão, Ctrl+Y; Ctrl+Z dentro do campo Jogador desfaz só o texto do campo. No drawer (Sistema), + na Saúde e Ctrl+Z com o foco nele. Nada fora do prefixo; o que foi posto para o teste foi limpo.

Escolhas a revisar com o Pedro:
- **"Outra aba mudou a ficha" é por caminho.** O passo só é recusado se um dos caminhos que ele mudou não está mais como ele deixou (a impressão do valor). Outra aba que mudou outro campo não trava o desfazer deste. Se o caminho voltar ao valor que o passo deixou, o passo vale de novo. Recusado, nada muda, e o botão fica desligado com o porquê.
- **O teto vale para cada pilha** (20 no desfazer e 20 no refazer) e 256 KB no log todo; sai o passo mais velho. Uma edição nova esvazia o refazer. Se o storage recusar o log, a edição fica e o log é apagado, com o aviso "Gravado, mas sem desfazer".
- **O círculo de grau:** clicar o círculo *i* põe o grau *i*; clicar o último aceso baixa um (grau 2, clique no 2º: grau 1). Cada círculo é um botão de 20×24 px a 24 px de centro a centro (WCAG 2.5.8), então a fileira de perícias fica mais larga só no Ensaio.
- **Trocar a raça tira a variante (e a subespécie) de outra raça, e trocar a classe tira o ramo de outra classe,** no mesmo passo, com o aviso. O nome que veio da ficha atual sem par no catálogo fica como a opção "(sem par no catálogo)" até o jogador escolher outra.
- **Atributo base da ficha migrada:** ela guarda o total digitado na ficha atual (`migradoTotal`, a nota do bloco diz isso); editar a base muda o total direto.
- **Marcas da Vhelor, idiomas e imunidade a condição aparecem sempre no Ensaio** (fora dele, só com 1 ou mais), para marcar a primeira. Idiomas é um campo só, separado por vírgula; imunidade, uma caixa por condição do catálogo dentro de um `<details>`.
- **Valor fixo guarda o calculado da hora** (`calculadoEm`), e é dele que sai o "o calculado mudou de X para Y". Diferença não guarda (acompanha o calculado). "Aplicar" de novo guarda o calculado de agora e o aviso sai.
- **No drawer** não há "Ajustar" nem a tela Ajustes: os números dele ficam só leitura (a especificação dá ao drawer só recursos atuais e Sins). Ctrl+Z vale lá só com o foco dentro dele.
- **No Grimório,** só o custo da intensidade marcada aceita ajuste (é o nó `magia.<id>.custo`); as outras dizem por quê na dica.
- **Desfazer e Refazer desligados usam `aria-disabled`** (não `disabled`): o clique diz por que ("Nada a desfazer", "a ficha mudou depois de …").
- **Página velha** (o Ensaio saiu em outra página da aba e esta veio do bfcache): o clique num controle não grava, e a página se acerta (a barra e os controles somem), como o seletor da F4.6a.

## 4. F4.6c · Levar para a ficha (KhLevar) e export do Bestiário

- **Com o ensaio ligado:**
  - os botões `.ent-add` dos cards (hoje `hidden`, gerados pelo build) aparecem, porque o JS tira o `hidden`. O HTML gerado não muda, e o portão `[ids]` segue igual;
  - a alça `.ent-alca` arrasta;
  - a tecla A leva o card focado;
  - o arrasto carrega o tipo MIME `application/x-khalkaria-ref` com `{v:1, tipo, id}`, mais `text/plain` só com o nome.
- **Destinos na ficha ativa do ensaio:**
  - técnica, marca e ultimate vão para Técnicas;
  - magia vai para o Grimório;
  - carta vai para Cartas (rara sem efeito);
  - item do Bazar vai para o inventário;
  - raça, classe e origem preenchem a identidade e abrem a lista do que falta escolher (avisa, não bloqueia);
  - condição vai para as condições ativas.
- **Regras:** entrada repetida (mesmo tipo e id) avisa e não duplica. Entrada cujo id sumiu do catálogo vira órfã e nunca é apagada. O card mostra "na ficha".
- **Formatos que continuam valendo:** `{_bazar:true,item}` e `application/x-kf-uid` (Bazar).
- **Sem o ensaio:** tudo como hoje, com a ficha atual e o "+ ficha".
- **Export do Bestiário da ficha v3:** antes, carrega o catálogo inteiro (`garantir`). Se a rede falhar, aborta com aviso e não baixa um arquivo pela metade.
- **Testes:**
  - levar cada um dos 7 tipos, pelo clique, pela tecla e pelo arrasto;
  - repetida;
  - órfã;
  - sem o ensaio nada muda;
  - Bestiário com o fetch falhando.

## 5. O que fica para depois

- **F4.7, virada (só com o ok do Pedro):** ligar o armazém real, a migração e a gravação dupla (`v3-dupla`), mais a KF `versao '3'` e o Bazar aceitando `>= 2`. Antes disso, uma nova revisão adversária da F4.2.
- **F4b:** Bazar com a ficha aberta, empurrando o conteúdo, com filtros "cabe" e "posso usar".
- **F4c:** assistente de criação e subida de nível (M3).
- **FC:** Comerciantes e papéis, depois da F4. A rodada 6 continua sem resposta do balanceamento.
- **F5, F6 e F7.**
- **Batedor:** sincronizar quando os ramos fecharem. Hoje está na rodada 8 do balanceamento.
