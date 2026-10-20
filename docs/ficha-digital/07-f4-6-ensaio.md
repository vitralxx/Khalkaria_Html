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
- **Idiomas e imunidade a condição aparecem sempre no Ensaio** (fora dele, só com 1 ou mais), para marcar a primeira. As Marcas da Vhelor também apareciam; desde a revisão de 2026-10-19 (abaixo) ficam ocultas em todo modo até haver 1. Idiomas é um campo só, separado por vírgula; imunidade, uma caixa por condição do catálogo dentro de um `<details>`.
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

### Como ficou (§4, 2026-10-19)

Código: `js/ficha/kh-levar.js` (`KhLevar`; puras: `refDoCard`, `payloadRef`, `lerRef`, `refDoV2`, `levar`, `chaves`, `faltaEscolher`, `bestiario`, `garantir`; interface: `ligar`, `criarExport`, `exportarBestiario`), no `js/ficha/ORDEM` entre o `kh-editor.js` e o drawer; `js/ficha/kh-ficha-drawer.js` (liga o KhLevar, aceita soltar com o Ensaio: `levavel`, `soltaEnsaio`, `avisoEnsaio(c, aceita)`; o export em `#fd-gaveta-kbe`), `js/ficha-pagina.js` (o export em `#fp-kbe`) e o fim do `css/ficha-ensaio.css`. Testes: `tools/testes/levar.test.js` (17: as puras e a interface, com o armazenamento espião), mais `ensaio.test.js`, `ficha-drawer.test.js` e `regras.test.js` acertados (o drawer agora aceita com o Ensaio; o ORDEM tem o kh-levar.js). Suíte: 448 testes.

- **Com o Ensaio**, o botão "Levar" e a alça aparecem em todo card marcado pelo build (os 7 tipos de card do site: técnica e família, magia, carta e Abismo, item do Bazar, raça, origem, condição; também a linha da tabela do Bazar). Ao sair (e no `pageshow` do bfcache), voltam ao que o build deixou: `hidden`, vazios, o `aria-label` original. O Bazar redesenha os cards a cada filtro: um `MutationObserver` (só com o Ensaio) os acerta de novo.
- **Cada levar é um passo do Desfazer** da ficha ("Levar: Centelha (Grimório)"), e o recado (no pé, acima da faixa, `role="status"`) tem Desfazer, que só age se o topo do log ainda é aquele passo.
- **O card que já está na ficha do ensaio** mostra "Na ficha" (verde, com o `aria-label` dizendo); clicar de novo avisa e não muda nada.
- **Soltar no drawer com o Ensaio** leva para a ficha do ensaio: a ref do MIME, o item do Bazar (`{_bazar:true,item}`, também do painel de receita) ou o card da v2.1 (pelo nome, só se for único). O aviso diz "Solte para levar … à ficha do ensaio (a sua ficha não muda)" e, depois, o resultado.
- **Export do Bestiário:** "Exportar para o Bestiário" na página (entre o seletor e a barra de edição) e no cabeçalho do drawer. Carrega o catálogo inteiro (os dados do motor, que já estavam carregados, e o `data/bazar.json`); com qualquer arquivo faltando, diz quais e não baixa nada. O arquivo é `<nome>.bestiario.json`, com as chaves do export da v2.1 e os valores do motor (a Saúde máx. ajustada sai ajustada).

Escolhas a revisar com o Pedro:
- **O "+ ficha" da v2.1 continua nos cards com o Ensaio** (o `ficha-v2.js` não muda), e ele grava na ficha atual. O card fica com os dois: "Levar" (ensaio) e "+ ficha" (a sua ficha). Esconder o da v2.1 durante o Ensaio é uma linha de CSS no `ficha-ensaio.css`, se ele quiser.
- **Item repetido soma na mesma linha** (+1, como o "+" do Bazar) em vez de só avisar: não duplica a linha, mas muda a quantidade. O aviso diz "agora são N".
- **Variante e subespécie também vão para a identidade.** A de outra raça é recusada ("leve a raça antes"); sem raça na ficha, a raça vem junto.
- **Classe não tem card no site** (nenhuma página marca `data-kf-tipo="classe"`): o levar sabe recebê-la (pela ref), mas na prática a classe se escolhe no seletor da página da ficha.
- **Bestiário:** `prof_craft` é o maior dos três Ofícios e `craft_attr` é sempre `intelligence` (os três são INT); `abilities` são as técnicas (com Marcas, ultimates, traços, tecnologias e corrupções) e as magias, com o resumo do catálogo; cartas, raça e classe ficam só na ficha, como na v2.1. O `armor_specific` (Ae) continua, como na v2.1.
- **Onde ficam os controles:** no canto de cima, à direita do card (o título contorna); no card do Bazar, o botão é a 1ª linha e a alça fica no canto esquerdo. Precisa do olho dele no navegador.
- **A tecla A** vale com e sem Shift, com o foco no botão ou no card (o do Bazar é focável).

### Revisão do Pedro e auditoria (2026-10-19)

Base: as respostas do Pedro no `03 §10` (prints da página no Ensaio) e os defeitos médios e baixos da auditoria `08 §B`. Tudo atrás da prévia; a ficha atual (v2.1) e as chaves dos jogadores não mudam.

Código: `tools/gerar_regras_ficha.py` (`ST_ESCOLHA_MAIOR`, `st_escolha`, `ROTULO_GRAU_SITE`) e o artefato `js/ficha/00-regras-dados.js`; `js/ficha/kh-regras.js` (a escolha sobe pela conta: `motivoEscolha`, `escolhaDoNo`; o `no.escolha` da CD, Stamina e Éter); `js/ficha/kh-edicao.js` (`periciasAttr.<id>`, `escolha.attr.*`, `identidade.subespecie`, `migracao.oficio`, `attrsEscolha`, `restos`, `mudancaRestos`, `pendenciaOficio`; a variante e o ramo sem id pelo nome); `js/ficha/kh-ficha-abas.js` (`edAttr`, `selVariante`, as duas colunas do Núcleo, a Vhelor); `js/ficha/kh-editor.js` (a barra espera o botão soltar; "Remover o que era de…"; `logLimpo`); `js/ficha/kh-estado.js` (`SEGMENTOS_PROIBIDOS`, `logLimpo`); `js/ficha/kh-levar.js` (o aviso do `logLimpo`); `data/ficha.schema.json` (`passoLog.required` com `depois`); `css/ficha-pagina.css`, `css/ficha-drawer.css` e `css/ficha-ensaio.css`. Testes: `tools/testes/revisao-ficha.test.js` (13), mais `ensaio.test.js` (+1, a interface), `edicao.test.js`, `regras.test.js`, `conta.test.js`, `previa.test.js` e `test_regras_ficha.py` acertados. Suíte: 463 testes. Os dois ouros (`previa-render` e `ficha-pagina-render`) foram regravados depois de conferido o diff: só o selo de decisão que saiu (perícias de dois atributos, Stamina, Éter, CD do Espadachim), a dica nova, "Lendário" e a Capacidade na coluna das perícias.

1. **A escolha do maior atributo** (Movimento, Convencimento, Intimidação, Enganação; a CD do Espadachim; Stamina e Éter) não tem mais selo: o contrato ainda traz `modoEscolhaStatus: "aprovado"`, e o gerador põe `canonico` no nó da escolha, citando o `03 §10`. A dica de cada número diz "usa o maior entre Mod.FOR e Mod.DES" ou, trocado, "usa Mod.FOR (escolhido)"; a sigla da perícia leva o mesmo `title`.
   - **No Ensaio,** a sigla vira um seletor pequeno: "maior (DES)" (o padrão, que diz qual é o maior agora), FOR, DES. Nas 4 perícias grava `periciasAttr.<id>` (o padrão apaga a chave); na Stamina, no Éter e na CD com escolha grava o `identidade.escolhas` inteiro (as chaves `attr.cd` e `attr.recurso.<r>` têm ponto). A CD sem escolha (as outras 6 classes) não tem seletor. Cada troca é um passo do Desfazer. O motor já lia as duas chaves: o schema não mudou.
2. **Variante:** no Inseto, o box chama-se Subespécie e o seletor tem Besouro, Louva-a-Deus e Barata (`identidade.subespecie`). O motor já usava a subespécie (atributos e Movimento): escolhida, o aviso "Inseto: os atributos variam por subespécie…" sai. Autômato e Corrompido mostram "<raça> não tem variante", sem seletor (se a ficha guardar uma variante, o seletor aparece para tirá-la). Trocar a raça tira a subespécie de outra raça, como a variante.
3. **Núcleo em duas colunas:** Perícias e, embaixo, a Capacidade | Recursos e, embaixo, Evasão, CD e Movimento. Numa coluna só (até 1180 px) e no drawer a ordem é a de antes, pelo CSS (`display: contents` nas colunas e `order` nos blocos).
4. **Armadura e Resistência:** a 1ª coluna da tabela tem no mínimo a largura do nome mais longo (`minmax(max-content, 1fr)`), e cada categoria, no mínimo 19rem na página (antes 13,5rem: a 1366 px, com 4 categorias por linha, "Contundente" passava por cima do R). Dentro da linha do tipo, o "calc." do ajuste e a marca de aviso não aparecem (não cabem numa coluna de 1,7rem): o número ajustado segue em âmbar, e o calculado e o aviso ficam na dica e na tela Ajustes. No drawer, a mesma 1ª coluna.
5. **Marcas da Vhelor:** ocultas em todo modo, também no Ensaio, até haver 1 marca. Com 1 ou mais, o bloco aparece (no Ensaio, com − e +). O "Ajustar" não as oferece (são estado); o ganho por item vem na F6.
6. **"Lendário"** com acento na legenda das perícias e no `title`/`aria-label` dos círculos: o gerador troca o rótulo do contrato ("Lendario").
7. **Auditoria §B:**
   - (a) **Desfazer depois de digitar:** o `change` do campo dispara no apertar do botão Desfazer, e a barra era trocada ali, engolindo o clique. Agora, com o botão do mouse apertado, a barra só se redesenha depois de soltar, e Desfazer e Refazer agem pelo log de agora (não pelo `aria-disabled` da barra ainda por redesenhar): o 1º clique desfaz o que acabou de ser digitado. Pelo teclado (Tab), a barra redesenha na hora, como antes.
   - (b) **Trocar raça ou classe** avisa o que ficou da anterior: técnicas, marcas e ultimates da classe; traços, tecnologias e corrupções da raça; a escolha de atributo da raça; o Recurso de Classe (atual e nome). Nada sai calado. A mensagem traz o botão "Remover o que era de <anterior>": um passo só, desfazível, calculado de novo pela ficha de agora (se a raça/classe voltou a ser a anterior, "Nada a remover"). A órfã (sem par no catálogo) nunca entra.
   - (c) **A pendência do Ofício(X):** no Ensaio, a nota das perícias tem "O grau vai para [Ofício(Engenharia) | Ofício(Ferraria) | Ofício(Alquimia)]": aplica o grau e fecha a pendência, num passo (Desfazer volta os dois). Se o Ofício escolhido tinha outro grau, avisa.
   - (d) `__proto__`, `prototype` e `constructor` são recusados em qualquer segmento do caminho (`caminhoEditavel`, e o `poeCaminho` não escreve); o passo forjado no log é descartado.
   - (e) A variante e o ramo sem id (o texto da v2) saem na troca quando o NOME é o de uma de outra raça/classe; o texto que não está no catálogo fica. Quando a limpeza por falta de espaço apaga o desfazer da ficha ativa, o `editar` e o desfazer devolvem `logLimpo`, e a barra (e o recado do Levar) avisa: "Faltou espaço: para gravar, o histórico de desfazer desta ficha foi apagado". O schema exige `depois` no `passoLog`.

Escolhas a revisar com o Pedro:
- **As duas colunas do Núcleo seguem a altura de cada bloco:** a Capacidade fica embaixo das Perícias, e Evasão, CD e Movimento embaixo dos Recursos. Lado a lado exatamente quando as Perícias têm a altura dos Recursos (a 1920 px, perícias em 2 colunas). Abaixo de 1400 px as perícias ficam numa coluna e a Capacidade desce mais. Uma grade que alinhe as linhas deixaria um vão embaixo dos Recursos.
- **O box do Inseto chama-se "Subespécie"** (o termo da página da raça), no lugar de "Variante".
- **"Remover o que era de…" também tira a escolha de atributo da raça** (as chaves `raca.*` de `identidade.escolhas`), que senão valeria para a raça nova, e zera o Recurso de Classe (atual 0, sem nome).
- **"calc." e a marca de aviso saem da tabela de resistências** (só dela), para não cobrir a coluna vizinha.

## 5. O que fica para depois

- **F4.7, virada (só com o ok do Pedro):** ligar o armazém real, a migração e a gravação dupla (`v3-dupla`), mais a KF `versao '3'` e o Bazar aceitando `>= 2`. Antes disso, uma nova revisão adversária da F4.2.
- **F4b:** Bazar com a ficha aberta, empurrando o conteúdo, com filtros "cabe" e "posso usar".
- **F4c:** assistente de criação e subida de nível (M3).
- **FC:** Comerciantes e papéis, depois da F4. A rodada 6 continua sem resposta do balanceamento.
- **F5, F6 e F7.**
- **Batedor:** sincronizar quando os ramos fecharem. Hoje está na rodada 8 do balanceamento.

## F4.6f · Corrupção e tecnologias (como ficou)

Pergunta do Pedro (03 §10): a tabela de corrupção do Corrompido e os itens acopláveis do Autômato estão na ficha? Agora estão, no Ensaio (atrás da prévia).

- **A corrupção virou entidade** (tipo `corrupcao`, da convenção do plano §3.2). O `tools/gerar_racas.py` marca as 30 linhas da tabela (15 poderes e 15 adversidades) com o id do bloco da raça (`data/racas/corrompido.json`, `raca.corrupcao`), na ordem dele; nome fora da ordem derruba o build. O `<tr>` leva `data-kf-tipo`, `data-kf-id` e `data-prever`; os controles inertes (`.ent-add`, `.ent-alca`, `hidden`) abrem a 1ª célula, porque um botão não pode ser filho de `<tr>`. No HTML gerado, só isso muda (só na página do Corrompido; nas outras, o `?v=` dos assets). O round-trip fecha.
- **Catálogo:** `data/catalogo/corrupcao.json` (30: `raca`, `grupo` poder|adversidade, `custo` inteiro, `custoTexto` verbatim, `resumo` = efeito). A tecnologia ganhou `tier` e `tierTexto` (dos `raca.tecnologias.tiers` do Autômato). A prévia baixa o arquivo novo (`KhPrevia.CATALOGOS`). O `KhEstado.entradasDeCatalogo` e o `KhFichaAbas.contexto` põem cada `tipo:id` uma vez só: o catálogo primeiro, o bloco da raça só como reserva.
- **Portões:** o `[ids]` aceita os controles na 1ª célula da linha e confere as linhas da página contra o bloco da raça, por conjunto. O `[blocos]` passou a exigir as corrupções no catálogo `corrupcao`, o mesmo conjunto do bloco; as outras sub-entidades seguem fora do catálogo.
- **Contrato:** `passo-tremulo` saiu de `semEntidade` e virou alias de `corrompido-passo-tremulo` (`tools/alias_ids.json`). O AVISO do build sumiu, e o motor aplica os −3 m de Movimento quando a adversidade está na ficha.
- **Ficha nova, aba Técnicas & Marcas** (onde o plano põe as corrupções e as tecnologias, pág. 2 do A4), depois de Técnicas Diversas:
  - **Corrompido:** bloco "Corrupção", com cada poder e adversidade da ficha (Poder ou Adversidade, "Custo −1" ou "Custo +1", o efeito inteiro), a **soma dos custos** e o **máximo do nível** (verbatim da tabela). Só mostra os números, sem aviso nem trava (D12). Não há graus (Tocado, Alterado, Consumido) no dado.
  - **Autômato:** bloco "Tecnologias acopladas", com o Tier de cada uma, na ordem dos tiers, e a nota verbatim (2 tecnologias de Tier 1 no início, o limite "2 + mod. Constituição", a troca em descanso curto).
  - Outras raças: nada muda. A corrupção e a tecnologia que estiverem na ficha seguem em Diversas, como antes.
- **Levar:** a linha da tabela vai pelo clique, pela tecla A e pelo arrasto da alça até o drawer. Repetida avisa e não duplica; o Desfazer do recado tira. O destino é a aba Técnicas, e o render a põe no bloco da raça. A v2.1 segue decorando a tabela pelo `decorarCorrupcao`: o `textoLimpo` já tirava `.ent-add` e `.ent-alca`, então nome, custo, tipo e id ficam os de antes.
- **Testes:** `tools/testes/corrupcao-tecnologia.test.js` cobre a marcação (conjunto igual ao bloco), o catálogo, a v2.1 decorando as 30 linhas e os blocos só na raça certa. No `levar.test.js` está o levar no Ensaio, com o armazenamento espião (clique, tecla, arrasto, repetida, Desfazer e o −3 m do Passo Trêmulo). No `marcacao-f1a.test.js`, os controles na 1ª célula.

Para o Pedro:
- A **soma dos custos** não é comparada com o máximo, e não há aviso. A convenção de sinal está em aberto no log (T, "A Corrupção (convenção de sinal)"), e não está decidido se o teto vale para o gasto em poderes ou para o saldo. O contrato pede `validacoes.corrupcaoMaxima: "avisar"`, mas não diz contra quê.
- O plano (02, aba 3) também cita um contador da Corrupção em Cartas, Lore & Outros. Aqui ele fica no bloco da aba Técnicas, junto das linhas. Se preferir, dá para mudar de lugar.
- A tabela não tem **graus** (Tocado, Alterado, Consumido). Se eles existirem no Notion, faltam no dado.

## Selo "novo" nas abas (como ficou, 2026-10-20)

Pedido do Pedro: "quando adicionar qualquer coisa na ficha, marque como novo para o player a aba em que se encontra, isso com tudo." Vale no Ensaio, atrás da prévia.

- **O que marca:** tudo o que o KhLevar leva para a ficha do ensaio, por clique, tecla A, arrasto ou soltar no drawer. Isso inclui técnica, Marca, ultimate, traço, tecnologia, corrupção, magia, carta, Dor, benefício, item, identidade (raça, classe, origem, variante, subespécie) e condição. A aba de destino (`KhLevar.ABA`) ganha o selo "novo" com o contador, na página e no drawer (no drawer, só o número, porque as abas são estreitas). Item que soma na mesma linha conta uma vez, e a repetida não marca.
- **Destaque:** a entrada nova fica com `[data-ke-novo]` (contorno âmbar) dentro da aba: o card, a carta, a magia, a linha do inventário ou o campo da identidade. A condição ativa ainda não tem desenho na ficha nova, então leva só o selo do Núcleo.
- **Quando some:** o selo some ao abrir a aba. Se a aba já está à vista (a aberta na página, ou a do drawer aberto), ele nem aparece. O destaque fica até o jogador sair da aba depois de ver. Desfazer a adição (o recado, o desfazer da ficha, a remoção) tira a marca: a entrada que saiu da ficha sai da lista.
- **Leitor de tela:** o selo é `aria-hidden`, e o nome da aba vira "Técnicas & Marcas, 2 novos". O nome original volta quando o selo some.
- **Estado:** `khalkaria_ensaio:ke_novos` no sessionStorage (`{v:1, fichas:{<id>:{<aba>:{itens, visto}}}}`), por ficha do ensaio. Sobrevive à troca de página na mesma aba, e "Sair do ensaio" o apaga com o resto. Sem o Ensaio, nada aparece e nada é lido nem gravado.
- **Código:** `js/ficha/kh-levar.js` (as puras `chaveNovo`, `marcaNovo`, `abreNovos`, `saiNovos`, `podaNovos`, `contaNovos`; no DOM, `pintaNovos`, `abaAberta`, `registraVista`). A página (`js/ficha-pagina.js`) e o drawer (`js/ficha/kh-ficha-drawer.js`) chamam `pintaNovos` depois de redesenhar e `abaAberta` no `aoSelecionar`. O CSS fica em `css/ficha-ensaio.css`.
- **Testes:** `tools/testes/levar.test.js`, com as puras e a interface (7 tipos levados, contador, `aria-label`, destaque, Desfazer, abrir e sair da aba, a página da ficha noutra janela com o mesmo sessionStorage, sair do ensaio), usando o armazenamento espião.

Para o Pedro: o destaque some quando o jogador sai da aba depois de vê-la. Se preferir que ele dure até o fim da sessão, é uma linha.
