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
   - O gancho do Ensaio já está: com `KhEnsaio.ligado()`, o desvio não acontece (o soltar no ensaio chega na F4.6c).
2. **Dica de fórmula.**
   - Os limites são a caixa de padding (sem a barra de rolagem, que cortava 2,5 px à direita em toda conta do drawer) cortada pela janela.
   - **Escolha a revisar com o Pedro:** fora do fluxo (no drawer), quando a dica não cabe na rolagem em nenhum lado, ela usa a altura da janela, inteira, por cima do cabeçalho do drawer, antes de ganhar altura máxima. Só sem lugar nem na janela ela é truncada. Truncar escondia a fórmula, que é o que a dica mostra.
   - Ao rolar a caixa (ou a página), a dica fora do fluxo segue a conta.
3. **Tabelas largas.**
   - Quem rola é a **caixa da tabela** (o pai dela, `:has(> table)`), como os 4 wrappers `overflow-x: auto` que o Sistema já tem. A tabela não vira `display: block`: assim, as que cabem encolheriam até o conteúdo e perderiam a largura de 100%.
   - A vertical dessa caixa fica `hidden`, para não nascer barra de 1 px por arredondamento. O script confere que nenhuma caixa esconde conteúdo na vertical.
   - Vale em toda largura com o drawer aberto. A 1440 px, as duas tabelas que passavam para o padding do conteúdo (sem chegar ao drawer) agora rolam na caixa.

Números (fixture `ficha-v2-sintetica.json`; antes = `bee169f`):

| Prova | Antes | Depois |
|---|---|---|
| Dicas, 1366×768 e 1920×1080, drawer e página (552 contas, 1556 aberturas) | 530 cortadas, todas no drawer (2,5 px pela barra de rolagem) | 0 |
| Dicas, drawer a 1366×600 e 1280×520 (extra) | 552 cortadas (11 no topo, até 66 px) | 0 (11 passam por cima do cabeçalho) |
| Dicas, página a 1280×520 (extra) | 3 cortadas pela janela | 3 com altura máxima (a janela não tem lugar) |
| Transbordo, 24 páginas × 1366 e 1440 px | 32 elementos em 2 casos (Magias e Sistema a 1366, até +48,8 px) | 0 (19 caixas rolam, todas com barra; nenhuma recorta na vertical) |

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
