# Ficha como hub: plano (02)

> Parte da base (rascunho 02: 5 leituras do repo e um sintetizador), das 15 críticas de completude já verificadas, do contrato `regras-ficha` **revisão 3** do balanceamento (`b1b8919`, idêntico ao `scratchpad/bal/regras.json`) e do `ficha-efeitos-itens.json` que o balanceamento acabou de entregar (727 itens).
> Precedência: decisões do Pedro de 2026-09-25 > Notion > seção "Revisão 2/3" do `14.md` (14.md:9-69) > corpo do `14.md` e do `regras.json`. Do corpo do 14.md o site **não lê**: os "dois pisos" (C06 e o piso de P38/P39, substituídos pela D82), a conta "16 pontos = 6 cartas" do P46 e o `pmaPorAlvo` do P55. A tabela base do P38, a ordem do P39 (× antes de −, `decisao`), o "avisar, não bloquear" do P46 e o essencial/opcional do P55 continuam valendo com o status que têm.
> Convenção: `regras.json:N` é o contrato rev. 3; `efeitos-itens.json:N` é o arquivo de efeitos; `base.md:N` é o rascunho 02.

---

## 0. O que mudou desde a base

**Resolvido (sai do §8):**

| Tema | Como ficou | Fonte |
|---|---|---|
| Modificador | `floor((attr−10)/2)`, tabela de 4–5 (−3) a 24–25 (+7), canônico e já no Notion. O código já faz `floor` (`js/ficha.js:43, 775`) | D80, `regras.json:57-76` |
| Vantagem/desvantagem | 2d20 maior/menor, não acumulam, se anulam; o crítico vale **só no dado usado**; o Defender rola o próprio dado 2× | D81, `regras.json:1348-1390` |
| Custo mínimo de magia | 1 Éter em toda conjuração, depois das reduções. A única de custo 0 é Nível 1 + Normal + sem modulação. Substitui os "dois pisos" (Contida mín. 1 + piso final 0) | D82, `regras.json:2346-2380, 2472-2498` |
| Nível 1 sem Contida | Verbatim do Notion (`contidaExisteNoNivel1:false`) | `regras.json:2311-2312` |
| Sangramento | `+Xd4` por acerto; cada acerto tira 1 | D83 (aprovado, falta Notion) |
| Estresse | Liberação obrigatória; o saldo negativo é a punição | D84 (aprovado, falta Notion) |
| Ar | Racial + armadura **somam, sem teto** | D85 (aprovado, falta Notion) |
| Morrendo | O tique não é mitigável | D86 (aprovado, falta Notion) |
| +2 atributos por nível | Canônico (Limiar, "Distribua esses 2 pontos como quiser"), níveis 2–5, +8 no nível 5; 6ª carta opcional "+2 Atributo Adicional" por 2 pontos | D87, `regras.json:77-89, 3073, 3144-3148` |
| Faixa de atributo | Em jogo não há teto escrito e o Abismo desce abaixo de 8. A faixa "8–18 na criação" vem do CLAUDE.md §2 e do contrato (sem fonte citada), **não do Notion**: o Sistema só dá o método (4d6 ×5, descarta o menor, mover 1 ponto, `data/sistema.json:17`), e `index.html:158` diz "8-20". Vai ao Pedro (D30) | `regras.json:41-48` |
| Pontos do Limiar | 4 por nível (2–5), custo crescente **por mão** (grátis, 2, 3, 4, …), pontos acumulam, 4 cartas grátis na campanha | `regras.json:3062-3091` |
| PMA | Só display da progressão de ataques ("1º +7 · 2º +2 · 3º −3"), sem contador por alvo e sem "zerar" em evento | Pedro; `regras.json:922-1038, 3157, 3191` |
| Empilhável | 10 unidades = 1 de peso, para a **propriedade inteira** (munição incluída) | Pedro; `regras.json:902-908` |
| Efeitos de itens | Entregues: 214 itens, 181 armas, 243 consumo, 115 sem efeito, 0 não parseados; ids 727/727 contra `data/bazar.json`. As marcas **[EFX]** da base caem | `14.md:17-34` |

**Críticas adotadas** (numeração da `critica.md`): 3 (guarda real contra aba velha), 4 (backup baixável, ajuste ciente do default, `migradoTotal`), 5 (nova F1b de conteúdo), 6 (F5b para usos de técnica), 7 (atributo da arma sai do arquivo de efeitos, não de tabela manual), 8 (template, gerador e item de nav da ficha), 9 (`componentes.css` na F2), 10 (emoji separado no catálogo), 11 (`prof_craft` e `craft_attr`), 12 (cache na entrada; só o export Bestiário espera o catálogo, o nativo nunca depende de rede), 13 (schema v3 na F3), 15 (F1 dividida em marcação e cascata). A 2 entra corrigida: grade de **14 tipos** (é o que o próprio site e o Notion dizem) e Evasão Ativa canônica. A 1 e a 14 foram resolvidas pela rev. 3; a correção da 14 ("Nv2 Contida com −1 = 0") ficou obsoleta: pela D82 dá 1.

**Achados novos que entram no plano:**
- O índice `empilhaveis` do balanceamento tem 87; o site tem 85. A diferença são Casca de Raiz e Seiva da Vhelor, que são 2 dos 7 itens da D26: o `Efeito` (mestre) diz "Empilhável" e o `Efeito_Jogador` não (`tools/gerar_bazar.py:284` lê o texto exibido; `ESPERADO` em `:135`). Ler a propriedade do `Efeito` escolheria em silêncio um lado de Efeito × Efeito_Jogador; fica 85 com AVISO nominal até a D26.
- O arquivo de efeitos lê a coluna `Efeito` (mestre) e expõe a mecânica escondida de 7 itens da Vhelor/Sonhador. **Mas esse texto já está no ar:** `data/Bazar_Khalkaria_v26.csv` (colunas `Efeito` e `Lore/Notas`) é versionado e servido pelo Pages (GET `…/Khalkaria_Html/data/Bazar_Khalkaria_v26.csv` → 200, 222 KB); o repo não tem `_config.yml` nem `.nojekyll`, e `tools/` também responde 200. O que publicar é a D32; o `data/efeitos.json` nunca carrega esse texto (F1d).
- O vocabulário do `regras.json` e o do arquivo de efeitos não batem entre si. O site normaliza no build, com tabela de alias fechada (§3.2).
- `data/sistema.json` está fora de sincronia com o Notion: faltam os 3 blocos de D80–D82 e a Evasão Ativa ainda diz "1d10+mod. Destreza" (`data/sistema.json:79`). Sync na F0.

---

## 1. Objetivo

1. A **ficha é o hub principal do site**. Tudo que tem regra vai para ela: magia, técnica, marca, ultimate, carta do Limiar, dor e benefício do Abismo, condição, raça, variante, origem, classe e item. Leva-se por botão, arrasto (por alça) ou atalho.
2. **Todo número derivado é calculado e mostra a conta**: modificadores, máximos, Evasão, CD, Movimento, Ar/Ae, carga, custo de magia e progressão de ataques. Cada termo da conta traz fonte e status; o que não é canônico aparece com selo.
3. **Itens mudam os campos reais** conforme o estado (carregado, equipado, sintonizado, munição ativa, ativado, consumido), no mesmo padrão que a Mochila já usa para a capacidade.
4. Continua sem SPA: drawer persistente, localStorage, re-hidratação no load, **Export/Import JSON obrigatório**. O Bazar não trava por dinheiro; o Limiar não sorteia.
5. Todas as páginas passam para a linguagem do Bazar v3: mesmos componentes, glifos SVG, tokens e o mesmo protocolo de "levar para a ficha".

---

## 2. Estado atual

| Peça | Onde | Veredito |
|---|---|---|
| Motor de carga `KhInv` (puro, 46 testes) | `js/ficha.js:17-458`, `tools/testes/carga.test.js` | **Reaproveitar** como módulo. Falta `armaComBeneficio:1` (`regras.json:913`). Detecta Empilhável pelo texto do `efeito` (`ficha.js:26, 35`); passa a ler `inv.empilhavel` (F0) |
| Gravação/sync v2 (rev, eco, storage/pageshow/visibility, quota) | `ficha.js:596-656` | **Reaproveitar**. `grava()` já trata QuotaExceeded com toast (`:596-605`) |
| Migração v1→v2 | `ficha.js:368` (`eraV1 = schemaVersion !== '2.0'`), `load()` regrava com rev++ (`:569-570`), `importJSON` sem guarda de versão (`:1632-1648`) | **Blindar** na F0 (§7) |
| `guardaBackup` | `ficha.js:465, 552-555`: só grava se a chave v1 não existe; sem UI de download | **Substituir** por backup baixável na F3 |
| `muta`/`lote`/`desfazer` (20 passos, só inventário, em memória) | `ficha.js:661-735` | **Generalizar**: várias partes, log persistente |
| API `window.KF` v2, eventos `kf:pronta`/`kf:mudou` | `ficha.js:1727-1752` | **Manter** a assinatura (o Bazar depende) e **estender** |
| Capacidade de mochila (`inv.capacidade`, `acumula`) | `gerar_bazar.py:121-186`, `ficha.js:149-166, 1188-1197` | **Protótipo** do padrão de efeitos; valores batem com o arquivo de efeitos |
| Pop-up, filtros em trilha, busca, toast com Desfazer, painel | `bazar-cartao.js`, `bazar.js`, `bazar-inventario.js:42-75`, `bazar-receita.js` | **Extrair** para `kh-ui.js` (cerca de 40% do JS do Bazar) |
| Harness de teste (vm + DOM falso, sem motor de CSS; sem Playwright/Puppeteer no repo) | `tools/testes/*.test.js` (95 testes hoje: 46 carga, 15 estado, 3 export, 21 do Bazar, 10 da nav), `build.py:56-120` | **Reaproveitar** |
| Estado v2: meta em texto livre, **22 perícias** com `oficio` genérico, bônus guardado, `derivadosManuais`, listas `{id,tipo,nome,descricao}` | `ficha.js:476-488, 519-535` | **Reescrever** (v3) |
| Resistências | `RESIST` com 12 tipos e `ordinario`, só R/I/ae (`ficha.js:493-495, 533`) | **Reescrever**: 14 tipos + categorias + Todos, camadas R/I/V/Ae |
| Derivados (Evasão, CD, Movimento, máximos) | digitados (`ficha.js:1093-1125`); `novaFicha` grava 0 nos máximos, evasão, cd e armadura e 9 no movimento (`:519-535`) | **Reescrever** com `KhRegras` + `KhEfeitos` |
| DnD: `MAPA` com 14 seletores, nome raspado do DOM, id `slug(nome)` | `ficha.js:1499-1604`; `textoLimpo` só remove `.kf-addbtn` (`:1502`) | **Reescrever**: os geradores emitem os ids |
| UI do drawer (11 seções, `<span onclick>`, sem `inert`) | `ficha.js:935-1469` | **Reescrever**; blocos de inventário são referência |
| CSS da ficha injetado por JS, hex, z-index 99998-100000 | `ficha.js:823-932` | **Mover** para `css/ficha.css` |
| Export Bestiário (`dado:''`, atributo sempre `'Força'`) | `ficha.js:433-445, 441, 1655-1678`, fixture `bestiario-armas-esperado.json` | **Corrigir**; a fixture congela o bug |
| `data/ficha.schema.json` | 6 divergências com o código; nada valida contra ele; 22 perícias, magia até nível 4 | **Reescrever** como v3 (F3) |
| Conteúdo de classe/raça/origem | `data/classes/*.json` só tem nome + cards HTML; V/G/R, CD, perícias iniciais e Evasão estão no template (ex.: `monge.template.html:575-606`); Corrompido com 4 traits no JSON e 15+15 no template (`corrompido.template.html:126-170`); movimento só em HTML | **Extrair** para `data/` na F1b |
| `data/sistema.json` | sem os blocos D80–D82; `:79` Evasão Ativa "1d10+mod. Destreza"; `:439` "−2 Éter (mín. 1)" | **Sincronizar** na F0 |
| Contrato e efeitos do balanceamento | `scratchpad/bal/regras.json` (rev. 3), `efeitos-itens.json`, `efeitos-overrides.json`, `efeitos-gerador.py` | **Integrar** verbatim em pasta que o Pages não publica (D3) e compilar |

---

## 3. Arquitetura-alvo

```
data/*.json ──gerar_*.py──► pages/*.html   (cards com data-kf-tipo/-id, data-prever, <button class="ent-add">)
   │   (F1b: blocos classe/raca/origem estruturados, verbatim, round-trip)
   ├─gerar_catalogo.py──► data/catalogo/{magias,condicoes,limiar,classes,racas,origens}.json   (lazy, versão por KH_V, nome sem emoji + campo icone; F1e normaliza)
   ├─gerar_regras_ficha.py ◄─ <balanceamento>/regras.json (verbatim) ─► js/ficha/00-regras-dados.js (AST + status + alias, vai no bundle)
   ├─gerar_efeitos.py      ◄─ <balanceamento>/ficha-efeitos-itens.json (verbatim) + bazar.json + condicoes.json + magias.json
   │                                                          ─► data/efeitos.json (Mods achatados, 612 ids)
   └─gerar_ficha.py ──► pages/ficha.html   (templates/ficha.template.html)
   (<balanceamento> = pasta fora do que o Pages publica, D3/D32)
                                      │
navegador:  kh-ui.js ─┬─ KhPrever · KhTeclas · KhFiltros · KhBusca · KhToast · KhPainel
                      └─ KhLevar (alça/botão/atalho) ──► KF.levar({tipo,id})
            ficha.js (ARTEFATO = concat de js/ficha/*.js) = kh-inv · kh-regras · kh-efeitos · kh-estado · kh-catalogo · ui-*
               estado v3 ─► KhEfeitos.coletar ─► KhRegras.avaliar ─► {valor, termos[]} ─► componente "conta"
```

### 3.1 Módulos JS

Sem ESM e sem SPA; o Bazar exige `KF` síncrono. Fontes em `js/ficha/*.js`; cada arquivo é uma IIFE que registra `raiz.KhX` e usa `module.exports` para o `node:test`, sem `return` de topo que corte o bundle. O `tools/build.py` concatena em `js/ficha.js`, na ordem do manifesto explícito `js/ficha/ORDEM` (alfabética poria `kh-estado` antes de `kh-inv`), com o cabeçalho `// ARTEFATO: editar js/ficha/*.js`; o `validar.py` confere `js/ficha.js == concat(ORDEM)`.

**Síncrono de verdade:** as regras compiladas entram no bundle (`js/ficha/00-regras-dados.js`), não em fetch. Cada entrada guarda `mods` (snapshot dos Mods do catálogo e de `data/efeitos.json`) e `versaoCatalogo`, como `e.inv` hoje (`ficha.js:406-430`); `KF.carga()`, `derivados()` e as minirréguas do trilho calculam síncronos sobre o snapshot e reconciliam quando o catálogo chega. Cache de `derivados()` por `rev + versaoRegras + versaoCatalogo`; se a reconciliação mudar um número, emite `kf:mudou{partes:['derivados']}`. A v3 **não** usa MutationObserver (hoje `ficha.js:1697-1708` re-decora o documento a cada re-render dos 727 cards): delegação em `document` para `.ent-add`/`.ent-alca`, e o Bazar chama `KF.decorar(raiz)` depois de cada render. Teste: fixture com catálogo indisponível dá derivados iguais aos do snapshot.

**Ordem do build** (hoje não definida): conteúdo → bazar → efeitos → regras_ficha → catálogo → ficha → concat de `js/ficha.js` → shell → testes → validar. O concat vem antes do shell porque o `?v=` lê o artefato.

| Módulo | Responsabilidade | Puro? |
|---|---|---|
| `kh-inv.js` | `KhInv` como hoje; na F6 o bônus de capacidade passa a vir do `KhEfeitos` | sim |
| `kh-regras.js` | `(estado, regrasCompiladas, conteudo, mods) → {valor, termos:[{rotulo, fonte, op, valor, ativo, motivo, status}]}`. Avalia a AST sem `eval`. Ordens: `movimento.ordem`, `recursos.ordemMaximo`, `magia.ordemCusto` (6 etapas, D82). Resolvedor de teste (D81): devolve normal/vantagem/desvantagem com a trilha das fontes | sim |
| `kh-efeitos.js` | Coleta Mods de raça/variante, origem, classe (do `data/`, F1b), cartas, técnicas, condições ativas, itens (pelo `quando`), permanentes e ajuste manual. Resolve `acumula` (entre fontes, no Mod), `acumulaCopia` (na entrada do item) e `escolha`. Cada Mod carrega a fonte | sim |
| `kh-estado.js` | Estado v3, `novaFicha`, migração `v1→v2→v3`, gravação, sync, `commit`/`lote`, log de desfazer em várias partes (formato abaixo), guarda contra a v2 | bordas no storage |
| `kh-catalogo.js` | Resolve `{tipo,id}` por fetch preguiçoso de `data/catalogo/*.json`, `data/efeitos.json` e, só se preciso, `bazar.json`, sempre com `?v=` de `window.KH_V`. `garantir(tipos, timeout)` só para o export Bestiário. Reconcilia o snapshot da entrada e marca órfão (padrão de `ficha.js:408-430, 764-772`) | cache |
| `ui-drawer`, `ui-nucleo`, `ui-tecnicas`, `ui-cartas`, `ui-inventario` (componente único, também usado pelo Bazar), `ui-grimorio`, `ui-mesa` | Render; todo derivado usa o componente "conta" | não |
| `js/kh-ui.js` (fora do bundle; o shell injeta antes do primeiro `<script src>` local, seja `ficha.js` ou `main.js`: o Bazar não carrega `main.js`, `pages/bazar.html:369-373`) | `KhPrever` (motor do `bazar-cartao.js`, `data-prever="tipo:id"`), `KhTeclas` (registro único de atalhos e camadas de Esc, integra o `\` do `nav.js`), `KhFiltros`, `KhBusca`, `KhToast`, `KhPainel`, `KhLevar` | — |

**API `KF` v3.** Contrato fechado: os 23 membros de `ficha.js:1727-1751` (`versao, inventario, carga, projetar, quantidadePorId, tenho, atributo, migradoEm, exportadoEm, nome, adicionar, quantidade, alternar, trocar, mover, remover, definirSins, lote, desfazer, podeDesfazer, catalogo, abrir, exportar`) com a semântica preservada, guardados por `tools/testes/kf-contrato.test.js` (carrega o artefato no vm e roda os fluxos do Bazar com as fixtures v2). Pontos que mudariam em silêncio:
- `versao:'3'` e `bazar.js:179` (hoje `k.versao === '2'`, senão `renderSemKF`) passam a `>=2` **no mesmo commit**, junto com o teste de contrato;
- `desfazer()` sem argumento continua só-inventário (o toast e o Ctrl+Z do Bazar, `bazar-inventario.js:662`); a Mesa usa `desfazer({partes})`;
- `abrir()` mantém os aliases `inventario` e `atributos` (`bazar-inventario.js:813, 934-935`; `bazar-receita.js:589`), mesmo com as seções reescritas;
- `exportar()` devolve Promise; o Bazar (`bazar-inventario.js:936`) trata a espera.

Novos:
- `levar(ref, opcoes)`, `remover(ref|uid)`, `tem(ref)`, `decorar(raiz)`;
- `derivados()` com cache por `rev + versaoRegras + versaoCatalogo`;
- `aplicarCondicao(id, {x, duracao})`, `recurso(nome, delta)`, `evento(nome)`, `fuiAcertado()`;
- `usar(uid)`, `ativar(uid)`;
- `REGRAS`, `colunaCanonica`, `pesoTexto` (o Bazar para de ler `window.KhInv`).

`kf:mudou.partes` ganha `identidade|atributos|pericias|recursos|condicoes|entidades|sessao`. Todo consumidor segue "existe `window.KF`? senão escuta `kf:pronta`" (`bazar-inventario.js:1211-1215`).

**Log de desfazer** (hoje: snapshots JSON inteiros do inventário, em memória, `ficha.js:503, 661`, zerados a cada sync entre abas, `:646`):
- chave própria `khalkaria_ficha_v3_log`; cada passo é um patch inverso por parte `{rev, partes, antes}`, nunca snapshot inteiro;
- teto de 20 passos **e** 256 KB (a quota de 5 MB é por origem, e `vitralxx.github.io` é compartilhada por todos os projetos Pages do usuário);
- desfaz só se `ficha.rev === topo.rev`; senão avisa "outra aba mudou a ficha";
- não vai no export;
- em QuotaExceeded: apaga primeiro o log, depois `khalkaria_ficha_v1_backup`, nunca a ficha.

### 3.2 Dados e normalização

**Nos cards** (`gerar_magias`, `_condicoes`, `_limiar`, `_classes`, `_racas`, `_origens`; o Bazar já tem `data-id`):
- `data-kf-tipo`, `data-kf-id` (= id do JSON, verbatim), `data-prever="tipo:id"`;
- `<button class="ent-add" aria-keyshortcuts="A" aria-label="Levar para a ficha">`, **`hidden` até a F4** e sem texto visível;
- alça `.ent-alca` em vez do card inteiro arrastável.

**Tipos:** `magia | tecnica | marca | ultimate | traco | variante | subespecie | tecnologia | corrupcao | origem | raca | classe | carta | dor | beneficio | condicao | item`. Chave única na ficha: `tipo:id`.

**Convenção de id** (publicar ao balanceamento): `magia-*`, `<classe>-*`, `classe-<c>`, `raca-<r>`, `<raca>-*`, `origem-*`, `limiar-*`, `abismo-*`, condição sem prefixo (`morrendo`), `item-<slug>` (727, `gerar_bazar.py:66-68`). O contrato ainda usa ids fora dela (`abismo:lenda-viva` em `regras.json:937` contra `abismo-esquiva-lendaria` em `:671`; `anao-variante`, `dryad-variante`, `gruto-rokhan`, `inseto-besouro` em `:835-841`; `batedor-sexto-sentido` em `:684`; `skalri`, `suspensoes-lubrificadas`, `passo-tremulo`, `escudo`, `acao-acelerar` em `:750-778`). O site resolve com **tabela de alias de id** em `tools/alias_ids.json`, validada por conjunto; id desconhecido derruba o build.

**Namespace de alvo do site** (proposto ao balanceamento; o `gerar_regras_ficha.py` e o `gerar_efeitos.py` aplicam a mesma tabela fechada, `tools/alias_alvos.json`):

| Do balanceamento | No site |
|---|---|
| `saude.max`, `recurso.saude.max` | `recurso.saude.max` |
| `eter.max`, `recurso.eter` | `recurso.eter.max` |
| `stamina.atual`, `saude.atual`, `eter.atual` | `recurso.<r>.atual` |
| `saude.temporaria` | `recurso.saude.temporaria` (sem regra geral, D15) |
| `evasao` (condições), `evasao.passiva` (itens) | `evasao.passiva` (a Ativa deriva dela) |
| recargas `longo`, `curto`, `combate`, `cena` | eventos `descansoLongo`, `descansoCurto`, `fimCombate`, `fimCombate\|fimCena` (`regras.json:2504`) |
| `resistencia`/`imunidade`/`atributo` sem sufixo com `escolha` | alvo com sufixo resolvido pela escolha guardada na entrada |

Alvo fora da tabela, op fora do vocabulário ou status fora do mapa **derrubam o build**.

**Destino de cada alvo** (`tools/alvos_destino.json`, F1d): cada uma das 26 famílias de `alvos` do arquivo de efeitos leva a `{campo}`, `{lembrete}` ou `{adiado:fase}`; o `checa_efeitos` dá FALHA para alvo de `data/efeitos.json` sem entrada. Os valores do opcional `condicao` (`reacaoDefender`, `emCombate`, `foraDeCombate`, `descansoAoArLivre`) entram no mesmo arquivo, em vocabulário fechado. Destinos que hoje faltavam: `testes.<ATTR>` soma em toda perícia daquele atributo, com trilha; `classe.V/G/R` (Coroa de Kha) entra como termo do coeficiente em `recursos.ordemMaximo`; `permiteSemTreino.<pericia>` libera grau 0 com a `penalidade`; `tamanho`, `dano.corpoACorpo` e `descanso.comodidade` ficam como lembrete com selo até terem campo; `recipiente.bugigangas` adiado (D10).

**Mapa de status → selo** (o contrato tem canonico 36, decisao 27, pedroDecide 10, aprovado 4, pendente 3, mais 6 fora da legenda, 9 em blocos de pendência e 2 numéricos). Contagem sobre `status` e chaves `*Status` (ex.: `dadoSomaAtributoStatus`); o compilador lê só valores string; `descanso.*.recupera.status` (`regras.json:2655, 2730`) é contagem, e `pendenciasNotion`/`baixaDePendencia` são metadado, fora da conta:

| Status | Na conta |
|---|---|
| `canonico`, `canonicoParcial` | sem selo |
| `decidido: D80\|D81\|D82 · gravado no Notion…` (`regras.json:3291, 3298, 3305`), `JA REGISTRADA no Notion…` (`:3418, 3423`) | canônico, sem selo |
| `aprovado`; `decidido: D83\|D84\|D85\|D86` (`:3312-3333`) | entra no número com selo "decisão do Pedro, falta Notion" (a legenda em `regras.json:10` diz "sem uso", mas 4 campos usam: `:827, 1411, 1611, 2821`) |
| `decisao`, `pedroDecide`, `pendente`, `decisaoDoSite` (`:2181`) | selo **PENDENTE PEDRO** |
| `canonico-mas-em-rework` (`:383`), `canonico-com-bug-conhecido` (`:600`) | aviso de classe |
| `emDesenho` (`:613`) | nunca publicado |
| string livre `parcial: …` (`:1038`) | `canonicoParcial` + nota "lista incompleta" |
| qualquer outro | FALHA de build |

**Catálogo** `data/catalogo/<tipo>.json`: por entidade `{id, tipo, nome (sem emoji), icone, resumo, <campos do tipo>, efeitos:[Mod], status}`. O emoji do dado (`origens.json` ×19 nos nomes, `limiar.json` 127 chaves `icon`; as outras 127 ocorrências são a string `"icon"` nos arrays `ordem`) vai para `icone` sem tocar no JSON de conteúdo; teste: nenhum `nome` com codepoint de emoji.

**`data/efeitos.json`** (F1d): `{schemaVersion:'efeitos/1', fonte:{shaBalanceamento, shaBazar}, porId:{'item-x':{quando, slot, acumulaCopia, usos, sintoniaDescansos, duracao, mods[], arma?, consumo?, lembretes[], texto, status}}}`, só para os 612 ids com algo (os 115 de `semEfeitoNaFicha` ficam fora). `texto` é sempre o `bazar.efeito` (já é o do jogador); o `verbatim` do balanceamento (coluna `Efeito`) **nunca** entra. Sem HTML; fica fora do round-trip de páginas, mas entra na checagem `[artefato-json]`.

**Checagens novas no `validar.py`:**
- `[ids]`: unicidade global; `id == prefixo+slug(nome)` com tabela de alias explícita (3 ids congelados do Limiar e os ids corrigidos das classes); `data-kf-id` do DOM contra o JSON, por conjunto.
- `[fragmentos]`: link entre páginas com `#id` existente (pega `condicoes.html#exausto`).
- `[glifos]`: todo `<use href="#g-*">` tem símbolo.
- `[artefato-js]`: `js/ficha.js == concat(js/ficha/ORDEM)`.
- `[artefato-json]`: regenera `data/catalogo/*`, `data/efeitos.json` e `js/ficha/00-regras-dados.js` numa cópia e compara byte a byte (o round-trip de hoje só cobre `pages/*.html`, `validar.py:256-290`).
- `[conteudo×contrato]`: valores de conteúdo do contrato (`regras.classes` V/G/R em `:439`, `basePorRaca` em `:720`, perícias iniciais) contra `data/`; divergência = AVISO ao Pedro, nunca correção.
- `checa_efeitos` (9 checagens, F1d): ver a F1d no §7.

### 3.3 CSS

`@layer reset, base, layout, componentes, paginas, estados` no topo de `style.css`. Os `<style>` inline dos 19 templates ficam fora de camada durante a migração (vencem por construção), e isso é medido, não suposto (F1c). Do `reduced-motion`, só o bloco `*{…!important}` vai para `reset` (`bazar.css:1924-1930`, `style.css:436-442`); as sobreposições por componente sem `!important` (`bazar.css:1912-1922`: `transform:none` no hover, `animation:none`, `stroke-dashoffset:0`, `opacity:0`) ficam na camada do próprio componente ou em `estados`, senão perdem para qualquer camada posterior e o hover volta a se mexer.

| Arquivo | Conteúdo | Fase |
|---|---|---|
| `css/tokens.css` (ou topo do `style.css`) | Promove de `bazar.css:10-63`: `--mono`, `--painel`, `--sombra-*`, `--mola`, `--cantos`, `--tem/--leve/--extremo/--extremo-vivo`, `--rar-*`; apaga 5 duplicatas; escalas `--esp-*`, `--raio-*`, `--dur-*`, `--z-*` (sticky 30, lista 40, rightbar 50, nav 100, dica 105, painel-esq 110, ficha 120, popover 400, toast 500, splash 900); `--recurso-saude/stamina/eter`, `--esq-w`, `--dir-w` | F1c |
| `css/componentes.css` | Mínimo na F2: conta (de `.bz-col-conta`, `bazar.css:948-957`), selo (inclui status e gatilhos `quando`), régua, botão, stepper, alvo de soltura, toast, popover, `.ent`/`.ent-add`. Depois: chip, rótulo com fio, tabela v3, caixa de regra, trilha de filtros | F2, cresce na F7 |
| `css/ficha.css` | Drawer, trilho de 48px, `pages/ficha.html`; extingue `injectCSS` e `injectCSSInventario` | F2 |
| `css/paginas/*.css` | Destino dos `<style>` dos templates, uma família por entrega | F7 |

O shell injeta tokens, componentes, ficha, `kh-ui.js` e o sprite `partials/glifos.html` em todas as páginas, com `?v=`. Duas lacunas do shell a fechar junto: o `versao_assets` só lê o primeiro nível de `js/` e `css/` (`shell.py:157-167`), então `css/paginas/*.css` não mudaria o `?v=` → hash recursivo de `js/**` e `css/**` (exceto `js/ficha/`, que já entra pelo artefato); e o shell só versiona `<script src>`/`<link href>` (`shell.py:150-154`), então JSON buscado em runtime ficaria sem versão → o head-boot recebe `window.KH_V={"catalogo/magias":"<sha8>",…}` e o `KhCatalogo` usa em toda URL de `data/`. O `.main-content` lê `--esq-w` e `--dir-w`; o `head-boot` aplica `html[data-ficha=aberta|trilho]` antes da pintura.

---

## 4. Contrato "entidade → ficha"

**Ref de transporte** (drag, botão, atalho, import):

```json
{"v":1,"tipo":"magia","id":"magia-dardo-arcano"}
```

MIME `application/x-khalkaria-ref`; o `text/plain` leva só o nome. Continuam aceitos o `{_bazar:true,item}` e o `application/x-kf-uid` interno do Bazar.

**Entrada guardada:** `{uid, tipo, id, estado:{…por tipo}, cache:{nome, versaoCatalogo, resumo?}, mods:[…snapshot], adicionadoEm, nivelAquisicao?}`.
- O `cache` e o snapshot `mods` são preenchidos ao levar e atualizados na reconciliação com o catálogo; o conteúdo exibido vem do catálogo quando ele está carregado. Entrada cujo id sumiu vira órfã e nunca é apagada.
- **O export nativo nunca depende de rede** (é o backup obrigatório, CLAUDE.md §10; hoje sai síncrono da memória, `ficha.js:1613-1617`): grava o estado e o `cache`/`mods` que cada entrada já tem. Só o export Bestiário faz `await KhCatalogo.garantir(tipos)` com timeout e, se não resolver, aborta com toast "catálogo indisponível", sem exportar vazio. O import aceita o `cache` para os órfãos.

**`Mod` do site** (forma única; os geradores convertem os pelo menos 6 formatos do contrato e o envelope por item do arquivo de efeitos):

```json
{"alvo":"capacidade.bugigangas","op":"soma","valor":3,"quando":"carregado","acumula":true,
 "duracao":null,"fonte":{"tipo":"item","id":"item-mochila-reforcada"},"status":"canonico", "...opcionais": {}}
```
(o "não acumula com outra cópia" da Mochila Reforçada vai em `acumulaCopia:false` no envelope do item em `data/efeitos.json`, não no Mod.)

- `op`: vocabulário do contrato (`regras.json:2549-2561`: `soma|multiplica|fixa|minimo|maximo|vantagem|desvantagem|falhaAuto|semAcao|semReacao|lembrete`) **mais `escolha`** (7 Mods do arquivo de efeitos; a escolha fica em `estado.escolhas` da entrada).
- `quando` de item: `carregado | equipado | sintonizado | municaoAtiva | ativado` (no lugar do `emUso` da base). `consumido` não é `quando`: é o bloco `consumo` disparado por `KF.usar`. `quando` de entidade: `permanente | escolhido | ativo`.
- `acumula` (no Mod, entre fontes): `true | false | 'maior'`. `acumulaCopia` (bool, na entrada do item): cópia do mesmo id soma ou não, mesma semântica de `inv.acumula` no `KhInv` (`ficha.js:161`). Fontes diferentes somam: Ar sem teto (D85), camadas de Ae somam, Mochila Reforçada + do Contrabandista somam (CLAUDE.md §2).
- **O `acumula:false` do arquivo tem 2 sentidos** (6 itens; `acumulaCopia` não existe lá). O `efeitos-gerador.py:427-428` grava `false` para duas frases diferentes, e o `gerar_efeitos.py` separa pelo `verbatim`: "outra cópia deste mesmo item" → `acumulaCopia:false` na entrada (Bolsa de Couro, Mochila Reforçada, Mochila do Contrabandista, Bolsa Dimensional; `efeitos-itens.json:297, 1191, 2700, 4175`) e Mods com `acumula:true`; "Não acumula com outras fontes" → `acumula:false` no Mod (Anel das Brasas, `:1374`); sem frase (Saco de Dormir, `false` por override, `efeitos-overrides.json:23`) → AVISO até o balanceamento dizer qual dos dois é.
- No arquivo de efeitos, `quando` e `status` estão no item e não no Mod; o `gerar_efeitos.py` propaga `quando`, `status` e o `acumula` já separado (acima) e põe `fonte={tipo:'item', id}`. O `verbatim` **não** propaga (é a coluna do mestre). `consumo.efeito` vira `mods`.
- Opcionais suportados (16 no arquivo): `condicao` (ex.: `reacaoDefender` nos 10 escudos, soma só no dado da reação), `duracao` (8 formatos: 1 rodada, 3 rodadas, 3 turnos, 1 min, 10 min, 1 h, 1 cena, `proximoCombate`), `tipo`, `escolha`, `ataques`, `excecao`, `momento` (`inicioTurno`), `ativacao {usos, recarga, acao}`, `enquanto` (`condicao:bebado`), `permanente`, `leitura`, `penalidade`, `contaPeso`, `requerTeste`, `rolar` (`rolaUmaVez`), `todos`. Opcional desconhecido: FALHA.
- Valor em texto (dados, `+mod.INT`, `'eter.max'`, `-(2d6+2)`) é resolvido por pop-over "rolei __" ou por referência; nunca por `eval`.
- Mod com status ≠ canônico aparece na conta com selo (§3.2) e nunca entra calado.

| Tipo | Estado por entrada | Campos que a ficha usa | Mods vêm de |
|---|---|---|---|
| `magia` | `{intensidade?}` | nível 1-5, escola, custoBase, ações, alcance, duração, sustentada, intensidades permitidas (Nv1 sem Contida), `stats[].porIntensidade`, modulações, trade-off (normalizados na F1e; hoje `data/magias.json` só tem strings) | `regras.magia` (`tabelaCusto`, `ordemCusto`, `custoMinimo`) |
| `tecnica` / `marca` / `ultimate` | `{usos?:{n, recarga, gastos}}` | classe, grupo, ramo, tier, custoTexto (F1e; hoje `data/classes/*.json` só tem id/tipo/nome/corpo) | **bloco C do balanceamento (P44), não entregue**. Até lá, usos são campo manual (F5) e custo/recarga não são inventados |
| `carta` | `{nivelAquisicao, posicaoNaMao, efeitoRevelado?}` | categoria, `req:[{attr,min}]` (F1e), efeito (raras: D11) | `derivados.*.modificadores` (ex.: `limiar-sombra-dancante`); 6ª carta alimenta os pontos de atributo (D13) |
| `dor` / `beneficio` | `{nivelAquisicao}` | `custo:{dor,sentido}` (F1e) | — (D12) |
| `condicao` | `{x, duracaoTurnosSeus, fonte?}` | grupo, tags, `x{tipo,inicial,decrementa}` | `regras.condicoes[].efeitos`, **filtrado pelas 29 de `data/condicoes.json`**; `agarrado` e `marcado` (`pedroDecide`, `regras.json:2123, 2130`) não viram condição genérica até a D17; `marcada-a-morte` é canônica e fica como lembrete na ultimate Silêncio (`:2135-2140`) |
| `raca` / `variante` / `subespecie` | `identidade.raca/variante`, `{escolhas}` | atributos com "ou", movimento base, idiomas, perícias, Ar natural | bloco `raca` em `data/` (F1b); efeitos de raça no bloco C |
| `origem` | `identidade.origem`, `{escolhas, itensImportados}` | sins (fórmula só exibida), treinamento, `itensIniciais[]{id\|avulso,qtd}`, habilidade | bloco `origem` em `data/` (F1b) |
| `classe` | `identidade.classe` + `ramo` | V/G/R, CD, atributos-chave, treinamento (fixo + 1+Mod.INT), recurso, features | bloco `classe` em `data/` (F1b); `regras.classes` só como checagem cruzada |
| `item` | entrada `KhInv` + `{equipado, sintonizado, ativo, escolhas, usosGastos, emUso, temporarios[]}` | `bazar.json` (slot, peso, empilhável, armadura) + `data/efeitos.json` | `data/efeitos.json` por `item-<slug>` |

Soltar raça, origem ou classe preenche a identidade por id e abre o checklist de escolhas (atributo "ou", perícias, variante, arma inicial, itens da origem). A ficha **avisa, não bloqueia** (`regras.progressao.validacoes`).

---

## 5. A ficha

**Dois formatos, um estado:**
- `pages/ficha.html` (gerada de `templates/ficha.template.html` por `tools/gerar_ficha.py`, com item "Ficha" em `partials/sidebar.html`): tela cheia, abas das 5 páginas da ficha física + Mesa.
- **Drawer docked à direita** em todas as páginas (D1): aberto com 380px (460px a partir de 1800px), empurra o conteúdo e esconde a right-bar; fechado vira trilho de 48px com glifo e minirréguas de Saúde/Stamina/Éter; acende em qualquer `dragstart` e abre com mola no `dragenter`. Mostra resumo, Mesa e alvo de soltura.

| Seção | Conteúdo |
|---|---|
| **1. Núcleo** | Identidade por id + nível/XP. **Atributos** = base + distribuição por nível `{n:{attr:pts}}` + 6ªs cartas + fontes (itens, permanentes); contador "pontos por distribuir" = 2×(nível−1) + 2×(6ªs cartas) − distribuídos, só aviso (o termo das 6ªs cartas sai com selo até a D13(c)); aviso de faixa no modo criação só depois da D30; em jogo sem teto. **24 perícias** (com Ofício Engenharia/Ferraria/Alquimia) com grau 0-4 e total com trilha; Religião → SAB; os "X ou Y" (Movimento, Convencimento, Enganação, Intimidação) calculam `maior` com selo até a D7. Defender como dado (1d6…2d8). Recursos atuais/máx. **Evasão** Passiva = 10 + DES + fontes; **Ativa = Passiva + dado de Defender, gastando a reação** (canônico, `regras.json:630`; o termo "sem atributo no dado" leva selo, `:638`, D8); com vantagem, "maior de 2× dado". CD; Movimento na ordem do P18 (aceita ±1,5); Ar = Σ racial + Σ `ar` de itens equipados/sintonizados, sem teto (D85). **Resistências: 14 tipos** (Ordinário expansível em Cortante/Contundente/Perfurante) + linhas de categoria (Elemental, Biológico, Místico) e Todos, cada uma com R/I/V/Ae e exceções; a pertença de tipo a categoria vem de `data/sistema.json` (`tipos-dano`). Imunidade a condição (29 ids). Idiomas |
| **2. Técnicas & Marcas** | Gerais, de Ramo por Tier 1-3, Marcas, Ultimates, Diversas (traços, variante, tecnologias do Autômato, poderes/adversidades do Corrompido, habilidade de origem). Contagem 3+nível avisada. Usos como contador genérico |
| **3. Cartas, Lore & Outros** | Cartas com req ok/aviso, nível e posição na mão; **saldo do Limiar = 4×(nível−1) − Σ custo(posição na mão daquele nível)**, custos grátis/2/3/4 e 5ª PENDENTE (D13), 6ª = 2; queimar é registro informativo, sem sorteio; o texto "5–11 cartas" só aparece verbatim, sem validar. Abismo e saldo de Dor (D12). História. Outros |
| **4. Inventário** | Componente único do Bazar (Sintonizado incluso, máx. 3), Sins editável, parcelas de efeito por item na conta, Usar/Ativar, munição em uso, limites de slot (1 armadura pesada, 2 leves, escudo, `armaComBeneficio:1`) |
| **5. Grimório** | Níveis 1-5, filtro por escola. **Custo = (Nv1 ∧ Normal ∧ sem modulação) ? 0 : max(1, (base + intensidade + Σ modulações) × multiplicadores − descontos)**; o piso 1 e a exceção do Nv1 são canônicos (D82); a ordem × antes de − (P39, `ordemCustoMotivo`) é `decisao` e sai com selo PENDENTE PEDRO; Nv1 não oferece Contida; Nv5 exige Foco Primordial. Valor de cada stat na intensidade escolhida. Aviso de Treinado em Místico + Foco da escola equipado |
| **Mesa** (aba + faixa no drawer) | Recursos com ±. **`acoes` como derivado com trilha** (turno 3; Atordoado −2, Lento −1, Confuso −1, Lenda Viva +1; alvo `acoes` de 2 itens). Condições ativas com X e duração em turnos seus. Eventos: `inicioCombate`, **`inicioTurno`**, `fimTurno`, `fimCombate`, `descansoCurto`, `descansoLongo`, `novoDia` e a ação **"fui acertado"** (evento `aoSerAcertado`, o nome que o contrato já usa em `regras.json:1410, 1585, 1600`). Progressão de ataques por arma: "Atacar (Adaga) +7 = +3 DES +4 prof → 1º +7 · 2º +2 · 3º −3", com linha = total + (i−1)×pma e n = floor(ações / `armas[].acoes`) (1 leve/marcial DES/distância simples, 2 pesada/marcial FOR/distância pesada, 3 brutal; focos místicos sem linha); n com selo (decisão). Linha de rolagem com o rolador desligado: "1d20+7 · desvantagem (Cego) · crítico só no dado usado", com `margemAmeaca` e `multiplicadorCritico` da arma. Log de desfazer (formato no §3.1). Linha de mesa copiável (`regras.json:3278-3283`) |

**Eventos da Mesa:**
- `inicioTurno`: tique de Morrendo = floor(0,1 × Saúde máx efetiva), biológico, **ignorando Ar, Ae e Resistência** (D86; o resto de `morte.morrendo`, `regras.json:2966-2981`, sai com selo). O momento do tique de Morrendo é `decisao` (`regras.json:2975-2977`) e leva selo. Mesmo evento para `regeneracao.saude` e para Em Chamas/Envenenamento. A divergência do tique é **do próprio Notion**: Em Chamas diz "no início de cada turno" (`data/condicoes.json:139`), Envenenamento (`:134`) e Morrendo (`:9`) dizem "por rodada"; o contrato põe os dois em `novaRodada` (`regras.json:3224-3229`). Até a D31, Em Chamas sai em `inicioTurno` (verbatim) e Envenenamento em `inicioTurno` com selo PENDENTE PEDRO.
- "fui acertado": com Sangramento X, mostra "+Xd4 biológico" e faz X−1, removendo em 0 (D83, selo "falta Notion"; a página Condições ainda diz +1d4). Se o mesmo acerto aplica Sangramento, a ordem é PENDENTE (D14). A Sangria Precisa (d6) é do atacante: lembrete.
- `inicioCombate`: desconta 1 da munição em uso de cada arma de distância equipada.
- `descansoCurto`/`descansoLongo`: recupera primeiro e libera estresse depois, **sem opção de pular** (D84): curto −1 por 1d6 Stamina + 1d6 Éter; longo tudo, por ponto; sem teto de estresse. O longo confere luz e alimento pelos índices `fonteDeLuz` (9) e `alimento` (4). Tudo com desfazer.

**Automático × lembrete** (`regras.automacao`, ajustado pelo Pedro):

| Automático, com trilha | Lembrete ou botão | Nunca automático |
|---|---|---|
| modificadores e máximos; Evasão Passiva, CD, Ar/Ae, capacidade; Movimento; penalidade de condição em perícia (após a D9; antes, termo inativo "lembrete"); custo de magia; desconto de custo (com desfazer); rolagem de descanso (o contrato pede "automatico, com desfazer", `regras.json:3195`; a ficha deixa o jogador digitar, rolador desligado, por coerência com o resto da Mesa, com nota ao balanceamento, §10); efeitos de item pelo `quando`; `pma −2` com arma de arremesso da passiva `artilheiro-maos-velozes` (única automática das 12); progressão de ataques só como display | ganho de recurso de classe (botão); aplicar/remover condição (o jogador aplica, a ficha calcula); as outras 11 fontes de pma (na linha da arma); consumível só com lembrete (baixa 1 e mostra o texto do jogador); Marcada à Morte | estados finais (morte etc.): só alerta |

`rastrear.essencial` entra com `progressaoDeAtaques` (`regras.json:3157`), sem contador por alvo. Os opcionais (temporários gerais, ações do turno, sustentados, iniciativa) ficam para depois da F5.

**Export:**
- **Nativo** `*.khalkaria.json` v3 (`schemaVersion '3.0'`), com `cache` por entrada e `estadoSessao`.
- **Bestiário** `type:"npc"`: máximos e derivados calculados; `weapons[]` com `armas[id].{dados, tipo, atributo, acerto}` e status; `abilities[]` com custo; `prof_*` como bônus (0-8), como hoje, até a D5; **`prof_craft` = maior bônus entre Ferraria, Engenharia e Alquimia**, `craft_attr: "intelligence"` (chave em inglês, como `schema:102` e `ficha.js:1664`); `resistances`/`immunities` em CSV. `estadoSessao` (P59) **não** vai no Bestiário até a D5.

---

## 6. Refino das páginas (por família)

| Família | Muda |
|---|---|
| **Bazar (referência)** | F0: `ESPERADO['empilhavel']` fica 85 (`gerar_bazar.py:135`), com AVISO nominal de Casca de Raiz e Seiva da Vhelor (pendentes da D26); o gerador continua lendo o texto exibido. F2: extrai `KhFiltros`, `KhBusca` e `KhPainel` para o `kh-ui.js`; consome `kh-ui.js`, `componentes.css`, tokens; somem as duplicatas (`contaCapacidade`, `motivoPeso`, `textoConflito`, MSGs, `condInfo`); para de ler `window.KhInv`; sai o `{{VER}}` redundante (`gerar_bazar.py:241-254`). F6: o inventário da mesa vira o componente único do drawer; com a ficha aberta vai para o trilho (D2); pop-up e receita exibem Mods e lembretes de `data/efeitos.json` (nunca texto de mestre) |
| **Magias** | `data-kf-*` + `id`; `<button>` nos disclosures (hoje `div onclick`). A normalização do dado (`acoes` em 13 formatos, intensidades, sustentada, `stats[].porIntensidade`, 31 rótulos com sinônimos) é da F1e; aqui só o visual. Filtros em trilha (nível, escola, ação, sustentada, trade-off), glifo de escola, hover de condição (12 grafias), estado "no grimório". CSS inline (84 linhas) → `paginas/magias.css`. O texto de custo passa a refletir o bloco "Custo mínimo" do Notion (sync na F0; `templates/magias.template.html:156`) |
| **Condições** | Tipo `condicao` (botão "Aplicar"). Índice gerado (falta Descontrolado: 28/29). Âncoras do corpo como `condicoes.html#id`. Efeitos, X e tags do contrato por id. `KhPrever` de condição no site todo (Sistema 20 links, Limiar 15, Magias 19, técnicas 152 `<em>`). O card de Sangramento segue o Notion (+1d4) até o Pedro gravar a D83 |
| **Limiar** | `data-kf-*` (corrige `carta-*`/`dor-*` → `limiar-*`/`abismo-*`); `req`/`custo` estruturados vêm da F1e; destaque derivado do custo no gerador (sai o `style` do JSON); `icon` → glifo por categoria (D29). Contagens e regras de pontos geradas. Filtro "elegível com meus atributos" (avisa). Desambiguar "Devorador de Almas" (rara × benefício). Animações infinitas: D28 |
| **Sistema** | F0: sync com o Notion (3 blocos de D80–D82; Evasão Ativa; custo mínimo); os 6 callouts que o balanceamento trocou por emoji mantêm o ícone do site (glifo, não emoji). F7: busca no índice, índice gerado (faltam `fe-sanidade` e `estresse`), hover de condição, `#exausto → #exaustao`. Só é levável o acionável (idiomas, manobras, ações da rodada, efeitos de arma). HTML cru no JSON (380 tags): remodelar por último |
| **Classes (7)** | Bloco `classe` em `data/` (F1b); o gerador escreve o `.formula-card` a partir dele (a Evasão depende da D8). Metadado por card (grupo, ramo, tier, custoTexto das 5 marcações) vem da F1e. Ids corrigidos (7 velhos no Espadachim, `monge-transcendencia` duplicado). Template único dirigido pelo dado (D27), CSS em `classes.css` + `[data-classe]` (cerca de 105 KB inline hoje). 278 emoji → glifos |
| **Raças (7 + índice)** | Bloco `raca` (F1b). O card do índice passa a ser gerado do stat-box (a divergência do Anão fica sinalizada, §9). Ids raciais alinhados à convenção (`raca-*`, `<raca>-*`) |
| **Origens** | Bloco `origem` (F1b). Colisão de id card × h3 (`academico-2`). 19 `onclick` inline e 97 emoji. `bazar.html?item=Nome` (25, mortos) → `#item/<id>` resolvido no build, FALHA para "Garrafa de Rum Forte". Soltar a origem oferece importar os itens iniciais |
| **criacao / index / classes.html** | Gerados, com contagens do dado. Correções factuais: 19 origens; 100 magias em 5 níveis; atributos pelo método do Sistema verbatim (4d6 ×5, descarta o menor; mover 1 ponto, `data/sistema.json:17`) e +2 por nível; a faixa 8–18 (`pages/criacao.html:264`, CLAUDE.md §2) × 8–20 (`index.html:158`) × Notion sem faixa fica como está até a D30; técnicas 4-8 (3+nível); +4 Pontos do Limiar por nível; recursos Instinto/Brutalidade; ramos do Alquimista (Artificer, Bombardeiro, Boticário). A Criação vira porta do modo criação (D4) |

---

## 7. Fases de entrega

Regra geral: cada fase é publicável sozinha, com `python tools/build.py` verde, todos os testes verdes (95 hoje, mais os novos), push e conferência no GitHub Pages. Commits atômicos; mudança de gerador vai sem mudança de conteúdo no mesmo commit. **Reverter o deploy de qualquer fase não pode deixar ficha em só-leitura nem perder edição; a reversão é testada antes do push.**

| Fase | Resumo | Depende de fase | Depende de decisão |
|---|---|---|---|
| F0 | Correções, guarda da v2.1, sync do Sistema, `_config.yml` | — | D32 (só o CSV no `exclude`) |
| F1a | Marcação e catálogo, sem CSS | F0 | — |
| F1b | Conteúdo estruturado de classe/raça/origem | F0 | — |
| F1c | Tokens + `@layer` + reduced-motion/foco | F0 | — |
| F1d | Efeitos compilados (só dado) | F0 | D3 |
| F1e | Normalização de dado (magias, Limiar, técnicas, perícias) | F0 | — |
| F2 | Modularização + `componentes.css` + `kh-ui.js` | F1a, F1c | — |
| F3 | Estado v3 + motor, em modo sombra | F1b, F1e, F2 | nenhuma trava (selos) |
| F4 | Hub, protocolo, `pages/ficha.html`, migração real | F1a, F3 | D1, D2 |
| F5 | Mesa | F4, F1d | D10, D17 (a–c), D31 (tique); D9 para o automático |
| F5b | Usos de técnica automáticos | F5 | bloco C (§10) |
| F6 | Efeitos de itens na ficha | F4, F1d | D26 (só os 7 itens) |
| F7 | Refino de páginas por família | F1a, F1b, F1c, F1e, F2; os itens interativos ("Aplicar", "no grimório", "na ficha") só depois da F4/F5, `hidden` até lá como o `.ent-add` | D27, D28, D29 |

F7 corre em paralelo a F3–F6. F1a, F1b, F1c, F1d e F1e correm em paralelo entre si.

### F0 · Correções, guarda e sync (v2.1)

**Entrega:**
- **Guarda contra aba velha:** `SCHEMA_VERSION` continua `'2.0'` no storage (a string nunca muda). A v2.1 ouve `storage` também para o marcador `khalkaria_ficha_dono`; se ele valer `'v3'` no load ou chegar no evento, entra em só-leitura com a faixa "ficha migrada para a v3, recarregue" e dois botões: "Baixar ficha v3 (.json)" e "Voltar a usar a v2" (apaga só o marcador). A mera existência de `khalkaria_ficha_v3` não trava nada. `importJSON` recusa `schemaVersion >= 3` com toast.
- **`_config.yml`** (o repo não tem nenhum e o Pages roda Jekyll): `exclude` com os caminhos que só o build lê: `tools/`, `templates/`, `notion_cache/`, `docs/`, a pasta do balanceamento (D3) e, se a D32 disser sim, `data/Bazar_Khalkaria_v26.csv` (o build lê local; nada no `js/` busca o CSV). Não toca no conteúdo do CSV.
- **Sync do Sistema** (Notion `2b76e3a4`): os 3 blocos novos (modificador; vantagem/desvantagem com crítico; custo mínimo + "Nível 1 sem Contida") entram em `data/sistema.json`; `sistema.json:79` passa a "Passiva + dado de Defender"; `:439` passa ao texto do custo mínimo. Os 6 ícones de callout que viraram emoji no Notion não entram como emoji na UI.
- **Magias Nv1:** já sem Contida (`templates/magias.template.html:222`; `data/magias.json` com 3 faixas no Nível 1, ex. "1d4 / 2d4 / 3d4 Fogo"); nada a mudar. Só a nota do CLAUDE.md §6 depende da D6.
- **Empilhável:** `ESPERADO['empilhavel']` fica 85, com AVISO nominal de Casca de Raiz e Seiva da Vhelor (D26); o `gerar_bazar.py` continua lendo o texto exibido; `KhInv` passa a ler `inv.empilhavel` e não o texto.
- Religião → SAB (`ficha.js:484`, `schema:86`). `#exausto → #exaustao`. Índices de Condições e Sistema gerados. Ids do Espadachim e do Monge. Fatos velhos de index/classes/criacao (§6). Hotfix do `MAPA` (36 marcas sem botão, 18 ultimates com nome errado).
- Schema v2 mínimo: `ae` em resistências (`schema:125-141`), Religião `x-attr 'sab'`, munição 10:1 (`schema:146`).
- Export Bestiário: sem fonte, `atributo:''` em vez de `'Força'` fixo (`ficha.js:441`); fixture atualizada. Sem tabela manual de atributo por arma.

**Pronto quando:** nada visual muda além das correções; os caminhos do `exclude` respondem 404 no ar; a v2.1 está no ar **antes** de qualquer v3.
**Testes:** carga/ficha-estado/export verdes; recusa de import `3.0`; só-leitura quando `khalkaria_ficha_dono='v3'` aparece (no load e por evento) e volta ao normal ao apagar o marcador; empilháveis: 85 por conjunto + 2 pendentes da D26 contra o índice do balanceamento (87); build falha se `sistema.json` não tiver os 3 blocos (snapshot).

### F1a · Marcação e catálogo (sem CSS)

**Entrega:** `data-kf-tipo/-id`, `data-prever` e `<button class="ent-add" hidden aria-label>` em todos os geradores; `.ent-alca`; `textoLimpo` passa a ignorar `.ent-add`; sprite `partials/glifos.html` (inerte até ser usado); `gerar_catalogo.py` (nome sem emoji, `icone` separado); `tools/alias_ids.json`; checagens `[ids]`, `[fragmentos]`, `[glifos]`; convenção de id publicada ao balanceamento.
**Pronto quando:** diff de CSS = 0; `data-kf-id` 100% contra o JSON por conjunto; nenhum `nome` de catálogo com emoji; o nome levado pela v2 a partir de um card novo é igual ao de antes.
**Testes:** validar `[ids]`/`[fragmentos]`/`[glifos]`; teste do `textoLimpo` com `.ent-add`; teste de emoji no catálogo.

### F1b · Conteúdo estruturado (sem visual)

**Entrega:** extração **por script**, verbatim, para `data/`:
- bloco `classe`: V/G/R, CD, treinamento, recurso, features (Instinto, Fluxo, Marca do Duelo, os 94 Itens Alquímicos);
- bloco `raca`: atributos com "ou", movimento, idiomas, perícias, variantes, Ar natural, limite do Autômato "2 + mod. Constituição", os 15+15 do Corrompido com id;
- bloco `origem`: sins, treinamento, `itensIniciais`, habilidade.
Os templates passam a ler esses blocos. `[conteudo×contrato]` no `validar.py`.
**Pronto quando:** round-trip byte a byte das 20 páginas migradas; set-diff de entidades por página = ∅; divergências contra o contrato listadas como AVISO (Monge, Anão etc., §9), nunca "corrigidas".
**Testes:** round-trip; set-diff; `Counter` de duplicatas nos ids novos.

### F1c · Cascata (tokens + `@layer`)

**Entrega:** tokens promovidos, `@layer`, reduced-motion e foco globais, escala de z-index.
**Pronto quando:** diff do `getComputedStyle` nas 24 páginas (antes × depois) = 0 fora de uma lista revisada, começando pelo Bazar; conferido no ar por família. Os 16 `!important` do `bazar.css` e os 2 do `style.css` revistos um a um (em camada, a precedência deles se inverte).
**Ferramenta:** o harness `node --test` não tem motor de CSS e o repo não tem Playwright/Puppeteer. `tools/estilo/captura.js` roda no navegador real (painel do Browser ou Chrome) e grava `tools/testes/estilo/<pagina>.<estado>.json` nos estados: 1366 e 1920 px; drawer fechado, trilho e aberto; `:hover`/`:focus-visible` forçados nos componentes; disclosures abertos; `prefers-reduced-motion: reduce`. A captura é passo manual declarado no "Pronto quando"; o build só compara os snapshots versionados.
**Testes:** comparação dos snapshots de estilo versionados.

### F1d · Efeitos compilados (só dado)

**Entrega:** `ficha-efeitos-itens.json` e `ficha-efeitos-overrides.json` verbatim na pasta do balanceamento fora do que o Pages publica (D3); `tools/gerar_efeitos.py` na lista `ALVOS` do `build.py` (`:25-35`) logo depois de `bazar` (não confundir com a `GERADORES` do round-trip, `validar.py:37`); `data/efeitos.json`; `tools/alvos_destino.json` (§3.2); `checa_efeitos`:
1. conjunto: ids == 727 do `bazar.json`; partição itens∪armas∪consumo∪sem = 727; `sem ∩ outros = ∅`; `armas ∩ itens` só nos 26 focos; `naoParseado` vazio (AVISO se não);
2. catálogo: nome/categoria/raridade iguais; `verbatim` == coluna `Efeito` do CSV da main, célula a célula (FALHA); sha diferente = AVISO (o do balanceamento é `af8357e5e95a113d`, o da main `486135f89663983f`; só Ingredientes difere, 109/109 pela normalização aprovada em `a36ef3e`);
3. vocabulário fechado (alvo pela tabela de alias e com destino em `alvos_destino.json`, op, `quando`, status, recarga, tipo, valores de `condicao`, perícia ∈ 24 slugs de `data/pericias.json` (F1e), condição ∈ `condicoes.json` (16/16), `conjura` ∈ `magias.json` (100/100), `municao` e `gera` apontando para ids existentes);
4. cruzada de inventário: `capacidade.*` == `inv.capacidade`, recipiente, `acumulaCopia` == `inv.acumula`, `empilhaveis` == `{inv.empilhavel}` ∪ os 2 pendentes da D26, slot de armadura (50/50);
5. armas: dados, atributo e ações re-extraídos do texto (151/151); todo "+ NdX Tipo <qualificador>" exige condição ou lembrete;
6. lembrete com número de campo de ficha: AVISO listado (hoje 33, 1 real);
7. **spoiler**: nenhum texto só do `Efeito` nos 7 itens com `Efeito_Jogador` em `data/efeitos.json` (FALHA); os Mods desses 7 ficam fora até a D26 (se a D32 aceitar o texto de mestre como público, esta checagem sai);
8. contagens registradas como AVISO (214/181/243/115/0, 369 Mods, 94 alvos);
9. integridade de Mod (`soma/fixa` com valor, `escolha` com `escolha{}`, `ataques`/`duracao` em formato conhecido).
Os 4 defeitos de parse conhecidos (Bastão de Karmath `efeitos-itens.json:7262`, Machado da Fúria `:7659`, Adaga Dimensional `:6765`, Foco do Vidente `:653`/`:6504`) viram **lembrete** no `data/efeitos.json` (nenhum número incerto é aplicado) e ficam numa lista explícita de exceção que volta a FALHA quando a errata chegar. `municao` vira id (`item-virotes-flechas`, `item-municao-de-fogo`, `item-conjunto-de-arremesso`); `requisito` vira `{attr,min} | {treino} | {pericia,grau}`; lembretes de armas e itens se unem nos focos.
**Pronto quando:** build verde com as 9 checagens; `data/efeitos.json` publicado; nenhuma página muda.
**Testes:** fixtures do gerador (Mochila, Gambeson `ae.cortante`, Escudo `reacaoDefender`, Mutagênico Maior `escolha`, Flechas Elétricas `municaoAtiva`, Seiva ausente dos Mods; os 2 sentidos de `acumula:false`: Mochila Reforçada → `acumulaCopia:false`, Anel das Brasas → Mod `acumula:false`, Saco de Dormir → AVISO).

### F1e · Normalização de dado (sem visual)

**Entrega:** o que F3/F4 consomem e hoje só existe como string. Por script, com relatório por conjunto, sem reescrever o JSON de conteúdo:
- **(a) Magias:** `acoes`, `intensidadesPermitidas` (Nv1 sem Contida), `sustentada`, `stats[].porIntensidade` e rótulo canônico, emitidos pelo `gerar_catalogo.py` em `data/catalogo/magias.json` (hoje `data/magias.json` só tem strings, ex.: Alcance "4,5 / 6 / 9 m").
- **(b) Limiar:** `req:[{attr,min}]` e `custo:{dor,sentido}` no catálogo (hoje `req` "INT 16+", `custo` "6 Dor").
- **(c) Classes:** `grupo/ramo/tier/custoTexto` por card, extraídos por script do template para `data/classes/*.json`, com round-trip byte a byte.
- **(d) Perícias:** `data/pericias.json` (24 slugs + atributo), fonte única da checagem 3 da F1d e do schema v3.
**Pronto quando:** relatórios por conjunto sem sobra; round-trip das classes byte a byte; nenhuma página muda.
**Testes:** set-diff por entidade; `Counter` de duplicatas; um fixture por formato de `acoes`.

### F2 · Modularização e componentes

**Entrega:** `js/ficha/*.js` + `js/ficha/ORDEM` + concatenação e `[artefato-js]`; hash recursivo e `KH_V` no shell (§3.3); `KhInv` extraído; `css/ficha.css` no lugar do CSS injetado (mesmo visual); `componentes.css` mínimo extraído do `bazar.css`, consumido pelo Bazar; z-index na escala; `back-to-top` lendo `--dir-w`; `kh-ui.js` com `KhPrever`/`KhTeclas`/`KhToast` e também `KhFiltros`/`KhBusca`/`KhPainel` extraídos do `bazar.js` (o Bazar passa a consumi-los; `filtros-bazar.test.js` e `ordenacao-bazar.test.js` como guarda); CLAUDE.md §3/§4 e ARQUITETURA.md §3/§4 marcando `js/ficha.js` e `js/ficha/00-regras-dados.js` como artefatos e a pasta do balanceamento (D3) como "não editar".
**Pronto quando:** Bazar e drawer idênticos pelos snapshots de estilo (F1c); nenhum `injectCSS`.
**Testes:** todos (95 hoje) + `KhPrever`, `alvoRetorno`, `[artefato-js]`, `kf-contrato.test.js` (§3.1).

### F3 · Estado v3 e motor

**Entrega:**
- **Modo sombra:** a v3 lê `khalkaria_ficha`, migra e calcula em memória e mostra as contas, **sem criar** `khalkaria_ficha_v3` nem o marcador; as edições continuam na v2. Reverter a F3 no ar não deixa ninguém em só-leitura.
- A partir da F4 (ou por clique em "Migrar"): chave `khalkaria_ficha_v3` e marcador `khalkaria_ficha_dono='v3'`; nunca grava em `khalkaria_ficha`. Import único da v2 guardando `{revV2, salvoEmV2}`; `importadoDaV2` e o marcador só são gravados **depois** de o `setItem` da v3 dar certo; se falhar (QuotaExceeded), continua na v2 com toast. Em load/storage/pageshow, se a v2 andou, oferece "reimportar alterações da v2" (sem merge silencioso), e antes de reimportar baixa automaticamente o `.khalkaria.json` da v3. Botão persistente "Baixar ficha v2 (.khalkaria.json)" no aviso de migração e em Ajustes; a chave v2 fica intacta.
- Migração: campo vira "ajuste manual" visível só se for diferente do default de `novaFicha` (0 nos máximos/evasão/cd/armadura, 9 no movimento) **e** diferente do calculado. Atributo migra como `base` com `migradoTotal:true` e `nivelMigrado`; pontos por distribuir contam só níveis acima do migrado; cartas "+2 Atributo" migradas não reaplicam o Mod. `ordinario` da v2 vira os 3 tipos. Ids antigos (`tecnica-*`, `carta-*`, `traço-*`…) re-associados por nome+tipo+classe; ambíguo vira órfão.
- `data/ficha.schema.json` v3 (24 perícias grau 0-4, 14 tipos, entradas ref + cache, magia 1-5, `'3.0'`), validado no harness node (`tools/testes`) com validador mínimo próprio (não há `jsonschema` no ambiente; nada de pip silencioso).
- `gerar_regras_ficha.py` → `js/ficha/00-regras-dados.js` (AST, status, alias; no bundle, §3.1). `KhRegras` com mapa de status, resolvedor de teste (D81), custo de magia (D82), atributos (D87), Limiar por mão, Ar (D85), Evasão. `KhEfeitos` com fontes do `data/` (F1b), `derivados.*.modificadores` e capacidade migrada de `inv.capacidade`; condições implementadas atrás de uma chave, como termo inativo "lembrete" até a D9.
- UI nova no drawer atual, só com glifos.
**Pronto quando:** uma ficha v2 real migra sem perda (em memória); cada derivado mostra a conta; nenhum termo não canônico aparece sem selo; reverter a F3 no ar deixa a v2.1 funcionando normal.
**Testes:** `KhRegras` por fórmula (C12, P18, `ordemMaximo`; Dryad com Sobrepeso Leve = 4,5; Caído + Enraizado = 0, conferidos contra a Revisão 2/3 antes de virar teste); custo: Nv2 Contida = 1, Truque Forçado + Canalização Eficiente = 1, Truque Normal + Escola Visceral = 0, Nv2 Contida com −1 de desconto = 1; vantagem+desvantagem = normal, 2 V = 1 V, crítico no dado mantido; atributo com `migradoTotal`; `KhEfeitos` (ordem, trilha, acumula, acumulaCopia); migração 2→3 com fixtures reais; aba v2 gravando depois do import; `setItem` lançando QuotaExceeded na migração e no commit; duas abas desfazendo (a segunda recebe o aviso); derivados com catálogo indisponível == snapshot; FALHA de build com status desconhecido.
**Depende:** F1b, F1e, F2. D7 e D8 não travam: saem com selo.

### F4 · Hub e protocolo

**Entrega:** `KhLevar` (alça, botão, atalho, MIME próprio); `.ent-add` visível; levar raça/classe/origem/condição como identidade/estado; `templates/ficha.template.html` + `tools/gerar_ficha.py` (em `build.py` e no round-trip do `validar.py`) + item "Ficha" em `partials/sidebar.html`; drawer docked, slot `--dir-w`, trilho de 48px, `head-boot` com o estado da ficha; hover de entidade em todas as páginas; estado "na ficha" nos cards; entradas com `cache` e `mods`; migração real (chave v3 + marcador, §F3); export Bestiário com `garantir`.
**Pronto quando:** toda entidade das 7 famílias (incluindo Corrompido e features, graças à F1b) é levável com o id certo; sem salto de layout entre páginas; export nativo sai completo sem rede; export Bestiário com fetch falho aborta com aviso.
**Testes:** roteamento por tipo, compat `{_bazar}`, dedup `tipo:id`, export nativo com fetch falho sai completo, export Bestiário com fetch falho aborta, import com órfão usando `cache`, reverter a F4 (v2.1 + "Voltar a usar a v2").
**Depende:** D1, D2.

### F5 · Mesa

**Entrega:** recursos atuais; condições com X e duração; eventos (§5) com `inicioTurno` e "fui acertado"; `acoes` derivado; progressão de ataques (display, `custoAtacar` de `data/efeitos.json`); usos por recarga como **contador genérico** em qualquer entrada ("usos N / recarga ∈ enum P43", `regras.json:2500`), zerado pelos eventos; munição em uso por arma de distância equipada, pareada pelo arquétipo (`gerar_bazar.py:108-111`); descansos com estresse obrigatório; exaustão, desnutrido, Marca do Duelo; log de desfazer multi-parte (§3.1); linha de mesa; `estadoSessao` no export nativo.
**Pronto quando:** uma rodada de combate simulada fecha só com a ficha (atacar com progressão, ser acertado com Sangramento, Morrendo no início do turno, fim do combate, descanso curto).
**Testes:** log/desfazer multi-parte; eventos por `regras.eventos`; tique de Morrendo ignorando Ar/Ae/R; Sangramento X→X−1→remove; n de ataques com Atordoado; munição −1 no `inicioCombate`; descanso sem pular estresse.
**Depende:** F4, F1d; D10, D17 (a–c), D31 (tique); D9 para o automático das condições.

### F5b · Usos de técnica automáticos

**Entrega:** preenche usos, recarga e custo de técnica a partir do bloco C (P44).
**Pronto quando:** toda técnica com recarga no dado chega com o contador preenchido; nenhum valor inventado.
**Depende:** bloco C do balanceamento.

### F6 · Efeitos de itens na ficha

**Entrega:** `quando` resolvido no `KhEfeitos` (carregado, equipado com limites de slot, sintonizado máx. 3 com troca no descanso longo e `sintoniaDescansos` 2 na Coroa de Kha e no Amuleto de Malkhor, `municaoAtiva` casada por `compativel`, ativado); `KF.usar`/`ativar` com pop-over "rolei __", efeitos temporários com as 8 durações e fim manual, permanentes com trilha, aplicar/remover condição (escolha de lista, `tag:fisica`, `qualquer`, `todas`), `conjura` abrindo a magia, `gera` criando entrada, aviso de `soParaRaca`; `livre()` não funde entrada ativa ou com usos; `armaComBeneficio`; capacidade migra para os Mods e o `KhInv` lê do `KhEfeitos` (o `validar` mantém `efeitos == inv.capacidade` até a migração, FALHA se divergir); export `weapons[]` completo (fixture atualizada).
**Pronto quando:** Mochila, armaduras (Ar/Ae), escudos, consumíveis e armas refletem nos campos com trilha; nenhum número entra duas vezes.
**Testes:** um fixture por op, `quando`, opcional e família de alvo (26), com os exemplos reais da F1d; Reforçada + Contrabandista = +8 bugigangas e +1 equipamento; 2 Reforçadas = +3/+1 com aviso de cópia; usar + desfazer; weapons Bestiário; capacidade sem contagem dupla.
**Depende:** F4, F1d; D26 só para os 7 itens.

### F7 · Refino de páginas

**Entrega:** uma família por entrega: Condições → Magias → Classes → Raças → Limiar → Origens → Sistema → index/criacao/classes.html (§6).
**Pronto quando:** zero `<style>` no template da família, zero emoji como ícone, filtros/busca/hover conforme o Bazar.
**Testes:** round-trip byte a byte do conteúdo; set-diff de entidades por página; snapshots de estilo das outras famílias sem diff.
**Depende:** F1e para o dado; F4/F5 para "Aplicar", "no grimório" e "na ficha" (ficam `hidden` até lá); D27, D28, D29.

---

## 8. Decisões para o Pedro (só as abertas)

**Arquitetura e escopo**
- **D1. Formato do hub** (trava F4). Recomendo `pages/ficha.html` em tela cheia (5 abas + Mesa) e o drawer docked que empurra (380/460px), com trilho de 48px quando fechado; a right-bar some com a ficha aberta. *Motivo:* 420px em overlay não comportam Técnicas por Tier + Grimório + Limiar, e o overlay cobre a origem do arrasto.
- **D2. Bazar com a ficha aberta** (trava F4/F6). Recomendo o inventário da mesa ir para o trilho. *Motivo:* lado a lado o registro cai para cerca de 473px em 1366 (abaixo do mínimo dos filtros); em trilho fica com cerca de 785px, e os dois painéis mostram o mesmo inventário.
- **D3. Arquivos do balanceamento no repo** (trava F1d). Recomendo guardar os 3 arquivos (contrato, efeitos, overrides) verbatim numa pasta que o Pages **não** publica: `data/balanceamento/` listada no `exclude` do `_config.yml` (F0), ou, sem `_config.yml`, `_balanceamento/` na raiz (o Jekyll ignora pastas com `_`; conferir no ar). Regra própria: só muda por commit vindo do balanceamento (o CSV continua exigindo aprovação sua). O site compila só `data/efeitos.json` e `js/ficha/00-regras-dados.js`; o `.py` gerador fica no branch deles. *Motivo:* o arquivo de efeitos traz a coluna do mestre dos 7 itens da D26 (`efeitos-itens.json:3372, 13320, 14591, 15615`); fundir no `bazar.json` (670 KB) ou copiar para a entrada deixa dado velho fora do Bazar.
- **D4. Criação como assistente dentro da ficha** (trava a porta da Criação na F7). Atributos (4d6 ×5, descarta o menor, e mover 1 ponto entre atributos, como no Sistema, `data/sistema.json:17`; o jogador digita ou usa o rolador opcional) → Raça → Classe → Origem → 4 técnicas (3 + nível). **Sem carta do Limiar**: a 1ª mão só abre no nível 2 (`limiar.template.html:700`, "A Cada Nível (2, 3, 4, 5)"; `regras.json:3064-3069`). Recomendo sim. *Motivo:* é o caminho natural para o hub; é adição criativa, por isso pede o ok. Não conflita com o "sem sorteio" do Limiar.
- **D5. Export Bestiário.** (a) `prof_*` é bônus (0-8, como sai hoje) ou grau (0-4)? Recomendo manter bônus até o app confirmar. (b) `estadoSessao` (P59) vai no Bestiário? Recomendo não: só no nativo. *Motivo:* o CLAUDE.md §5 descarta o que é só-ficha, e o P59 é decisão do balanceamento, não do Pedro.
- **D6. Atualizar o CLAUDE.md** (§2 e §6). §2: manter "Contida (−2, mín. 1)" (confirmado hoje, `dffed90`, e continua verdadeiro) e **acrescentar** "toda conjuração custa no mínimo 1 Éter; única exceção Nv1 Normal sem modulação; Nv1 não tem Contida" (D82); Resistências em **14 tipos** (C18/D67; os itens já usam `ae.cortante/contundente/perfurante`). §6: a regra das 3 barras não vale no Nível 1. Recomendo sim. *Motivo:* são correções factuais contra o Notion, mas mudam o protocolo do agente.

**Regras**
- **D7. "X ou Y" = maior?** Stamina (FOR/DES, `regras.json:109`), Éter (INT/SAB, `:125`), CD do Espadachim, Movimento, Convencimento, Enganação e Intimidação; e Intimidação é CON/FOR (tabela) ou FOR/SAB (ficha física, `:1236`)? Recomendo `maior` em todos, e confirmar a dupla da Intimidação no Notion. *Motivo:* não há respec e `maior` não guarda estado. Até lá o motor calcula `maior` com selo.
- **D8. Evasão Ativa.** A fórmula é canônica (Passiva + dado de Defender). Falta: o dado soma atributo? (pendência n=14); ok para trocar as 7 `.formula-card` ("10 + Mod.Des + Prof.Defender", ex.: `monge.template.html:600`) e o "Evasão: determinada pela sua classe"; "neste turno" ou "nesta rodada"? Recomendo sem atributo, trocar os cards pelo bloco `classe` e "neste turno do agressor" (verbatim da seção Defesa, `regras.json:636`, e recomendação do balanceamento, `:644`). *Motivo:* o Notion Sistema diz só "soma o dado da perícia Defender"; as páginas de classe podem ser contradição Notion × Notion, e por isso vêm a você.
- **D9. Condições ativas nos números** (trava o automático das condições, F3/F5). Recomendo automático com detalhamento, exceto as de julgamento do mestre (`regras.json:3190`). *Motivo:* o jogador aplica, a ficha só calcula, e a trilha mostra cada termo.
- **D10. Escopo da Mesa v1** (trava F5). Recomendo usos por recarga (contador genérico) e munição em uso na 1ª versão; Bolsa Dimensional (recipiente) depois. *Motivo:* são "essencial" no contrato.
- **D11. Efeito das 59 raras.** Recomendo manter a decisão de design (CLAUDE.md §9: raras como ícone + requisito + nome): nada de efeito de rara em `data/`. A entrada da carta na ficha ganha um campo livre "efeito revelado pelo mestre" (estado local, vai no export nativo). Alternativa, que exige sua ordem: trazer o efeito verbatim do Notion para `data/limiar.json` e exibir só na ficha, sabendo que o JSON é público. *Motivo:* o bloco C também não trouxe efeito das raras, e o contrato diz que ele "tem que vir do Notion primeiro" (`regras.json:2589, 3439`).
- **D12. Abismo/Dor.** Só o Corrompido ou todos? Recomendo contador de saldo com aviso, sem trava.
- **D13. Limiar.** (a) A 5ª carta da mão custa 5? O contrato diz "…" e o template "seguem a sequência" (`limiar.template.html:708-715`). (b) "5–11 cartas" não sai da regra (a conta dá de 4 a 12): corrigir o texto ou explicar. (c) A 6ª carta "+2 Atributo Adicional" são 2 pontos livres (como a Bênção) ou +2 num atributo só? Recomendo 5, revisar o texto para "4–12" (ou dizer de onde vem o 5–11) e 2 pontos livres. *Motivo:* até lá a ficha marca a 5ª como PENDENTE e não assume valor.
- **D14. Sangramento e as decisões fora do Notion.** (a) Num acerto que também aplica Sangramento, consome antes ou aplica antes? Recomendo consumir antes (pendência n=20). (b) Gravar D83–D86 no Notion (o card de Sangramento ainda diz +1d4). *Motivo:* sem isso a página Condições e a ficha mostram números diferentes; a ficha usa selo "falta Notion".
- **D15. Saúde temporária** (`recursos.temporario` pedroDecide, `regras.json:258-275`; os itens usam `saude.temporaria`). Recomendo: não soma com outra temporária (fica a maior), gasta primeiro, some no descanso longo. *Motivo:* sem regra geral o item não tem como ser aplicado; até lá o termo sai com selo.
- **D16. Magia sustentada.** Máximo de 1 ativa (pedroDecide)? Custo fora de combate "a cada 30 min" (Sinapsia Coletiva, `magias.json:2547`) sem fonte geral. Recomendo 1 ativa e pedir a regra do fora de combate ao Notion antes de automatizar. *Motivo:* sustentada fica fora do essencial da Mesa v1.
- **D17. Condições em aberto** (trava F5). (a) Exposto é concedido uma vez ou é contínuo? (b) Como o Desnutrido diminui? (c) Saída de Exaurido/Oco, e "ultrapassar" × "alcançar" metade em Morrendo/Oco (pendência n=17: `morteEm` usa `<`, `regras.json:102, 1408`; `perdePersonagemEm` usa `<=`, `:136, 1471`; o alerta da F5 depende disso; o balanceamento recomenda "ultrapassar" nos dois). (d) Qual é a lista das "condições mentais" (n=11; `tags.mental: null`, `:2192`; citadas pelo Teurgo e pelo Veterano)? (e) Agarrado: o balanceamento recomenda promover com os 3 efeitos já canônicos da manobra Agarrar (Atacar +2 contra o alvo, alvo −2 ao Atacar, alvo Enraizado; `:2124-2125`), nada inventado. Marcado: não promover (pisa na Marca do Duelo). Recomendo seguir o balanceamento nos dois. *Motivo:* sem isso o contador de X não sabe quando cair, e a F6 usa tag de condição.
- **D18. Economia de ações.** Existe "1 cast por turno" (Projétil)? Existe limite de ação livre? Quantas ações custa usar um consumível (null em 141)? Recomendo, para o consumível, a proposta do balanceamento: 1 ação em si, 1 ação em outro, arremesso segue o item. *Motivo:* a Mesa desconta ações; sem regra, mostra "?".
- **D19. Stamina em reserva** nas passivas com custo (P45, pedroDecide). Recomendo reserva visível como "comprometida" no recurso. *Motivo:* evita máximo aparente falso.
- **D20. Os 27 campos `decisao` do contrato** (ordem do Movimento P18, dano mínimo 0, imunidade zera, Transbordante, n da progressão de ataques…). Recomendo o Pedro revisar em lote e gravar no Notion. *Motivo:* só assim perdem o selo PENDENTE.

**Itens (pendências do arquivo de efeitos, `efeitos-itens.json:76-118`)**
- **D21. Grevas Trovejantes:** "a manobra Investida concede +1d6"; não existe Investida (as manobras são Empurrar, Desarmar, Agarrar). O que o item quer dizer? Até lá: lembrete.
- **D22. Ae(Todos):** Capa Defensiva e Capa do Vazio excluem Força e Primordial; o Anel do Baluarte não. E cobre os 3 Ordinários? Recomendo a proposta do balanceamento: os 11 atípicos, sem Força nem Primordial, nos três itens. *Motivo:* D63 diz que Ae é de dano atípico e o Ordinário é do Ar.
- **D23. Cura em Autômato:** bloquear ou avisar poção de cura? Recomendo avisar. *Motivo:* a ficha avisa, não bloqueia (`regras.progressao.validacoes`). Os 4 Kits de Manutenção já vêm `soParaRaca:'automato'`.
- **D24. Ratificar 2 leituras:** "+2 Força/Destreza" sem "testes de" = valor de atributo (Cinturão do Colosso, Elixires do Crescimento e do Encolhimento); "Envenenado" = condição Envenenamento. Recomendo ratificar as duas.
- **D25. Correções no CSV** (exigem aprovação): "Saude" → "Saúde" na Erva Medicinal; "Armas Leves." no início do Anel do Esgrimista é requisito ou sobra? Recomendo corrigir a grafia e ler como requisito se for isso.
- **D26. Os 7 itens com texto próprio do jogador** (Casca de Raiz, Seiva da Vhelor, Elixir da Expurgação, Talismã da Seiva, Folha Amarela, Semente da Vhelor, Pétala do Sonhador). A ficha aplica a mecânica escondida (números, Marca da Vhelor como contador) ou só mostra o texto do jogador? E Casca de Raiz e Seiva da Vhelor são Empilháveis para o jogador? (o `Efeito` diz que sim, o `Efeito_Jogador` não fala; se sim, acrescentar "Empilhável: pesa 1 bugiganga a cada 10 unidades." ao `Efeito_Jogador`, no CSV, com sua aprovação). Recomendo só o texto do jogador, nenhum Mod no `data/efeitos.json`, e sim ao Empilhável explícito. *Motivo:* a pergunta é de desenho (a ficha aplica ou não a mecânica escondida), não de sigilo: o CSV em `data/` já expõe a coluna `Efeito` dos 7 no site publicado. Tirar isso do ar é a D32.

**Visual (antes da F7)**
- **D27. Layout das classes.** Recomendo por ramo (modelo do Espadachim: marcas, T1, T2, T3). *Motivo:* espelha a decisão de build.
- **D28. Lei de cor do Bazar v3 no site todo:** paleta única de recursos (Saúde vermelho, Stamina verde, Éter roxo), `--text-muted` #8a8580 (AA) e animações infinitas do Limiar trocadas por textura estática. Recomendo sim nos quatro.
- **D29. Emoji guardado no dado** (`limiar.json` icon, `origens.json` nomes). Vem do Notion? Se vier, o JSON fica verbatim e só o gerador mapeia para glifo (o catálogo já separa desde a F1a). Se não vier, separar em campo `icone` e limpar o nome no JSON, o que exige aprovação.

**Novas (revisão final)**
- **D30. Faixa de atributo na criação.** O Notion (Sistema > Criação de Personagem, `data/sistema.json:17`) não dá faixa: 4d6 ×5 descartando o menor dá 3–18, e mover 1 ponto pode passar de 18 ou cair abaixo de 3. `pages/criacao.html:264` e o CLAUDE.md §2 dizem 8–18; `index.html:158` diz 8–20. Recomendo gravar no Notion a faixa que vale (se for 8–18, a ficha avisa fora dela no modo criação) e corrigir a página que discordar. *Motivo:* hoje são duas páginas manuais contra um Notion mudo; a ficha não avisa nada até a resposta.
- **D31. Correções do Notion que o contrato lista em aberto.** (a) Ofício(Ferraria) está com o texto da Engenharia (n=15, `regras.json:1296, 3378`). (b) Pele de Pedra usa Ae(Ordinário) e deveria ser Ar (n=18, `:3396`). (c) Tique de dano: Em Chamas "no início de cada turno" × Envenenamento e Morrendo "por rodada" (Condições, `data/condicoes.json:9, 134, 139`). (d) Resíduo da renumeração D68 (n=19: Dissipar Magia, Teurgo ×3, Cultista, Corrompido, Desejo Sombrio). Recomendo corrigir (a), (b) e (d) no Notion como o balanceamento propõe e, em (c), padronizar "no início de cada turno" (do afetado) para os três. *Motivo:* a ficha calcula o tique, o Ar e o Ofício; até lá saem com selo PENDENTE PEDRO.
- **D32. Texto de mestre no ar.** O `data/Bazar_Khalkaria_v26.csv` (colunas `Efeito` e `Lore/Notas`) é servido pelo Pages hoje (200, 222 KB), assim como `tools/`. Recomendo um `_config.yml` com `exclude` do CSV e das pastas que só o build lê (F0; o CSV fica intocado e o build lê local). Alternativas: aceitar que o texto é público (a checagem 7 da F1d sai) ou tirar o CSV de `data/`. *Motivo:* sem isso, a D26 e a checagem de spoiler protegem um texto que qualquer um já baixa.

---

## 9. Riscos e divergências

**Riscos técnicos**
- **Aba velha gravando depois do import:** uma aba v2 aberta antes do deploy (ou com HTML em cache) continua gravando em `khalkaria_ficha` e a edição se perde calada. Mitigação: só-leitura na v2.1 ao ver `khalkaria_ficha_v3` e comparação `{revV2, salvoEmV2}` na v3 (F0/F3).
- **Quebra do Bazar:** `bazar.js` e `bazar-inventario.js` (mais de 2200 linhas) dependem de `KF` v2 síncrono, de `kf:mudou.partes` e de `window.KhInv`. Mitigação: contrato fechado dos 23 membros, `desfazer()`/`abrir()`/`versao` preservados e `kf-contrato.test.js` (§3.1).
- **Números mudando em silêncio** ao automatizar. Mitigação: ajuste manual migrado visível, ciente do default.
- **Fórmula não canônica publicada:** o contrato mistura 11 status. Mitigação: mapa fechado de selo e FALHA com status desconhecido.
- **Contagem dupla** de capacidade na transição (`inv.capacidade` do Bazar e Mods do arquivo). Mitigação: fonte única por fase e checagem cruzada até a F6.
- **Perdas silenciosas de parse** ("naoParseado 0" esconde 4). Mitigação: viram lembrete + regra de qualificador no `checa_efeitos`.
- **Vocabulário divergente** entre os dois arquivos do balanceamento. Mitigação: alias fechado; errata ao balanceamento.
- **Spoiler:** o arquivo de efeitos usa a coluna do mestre, e **o CSV em `data/` já é público** (colunas `Efeito` e `Lore/Notas`, 200 no ar). Mitigação: `texto` sempre do jogador, `verbatim` nunca propagado, FALHA de spoiler, `_config.yml` (D32), D26.
- **Export dependente de fetch:** o nativo nunca depende de rede; só o Bestiário usa `garantir` e aborta com aviso.
- **Quota do localStorage** (5 MB por origem, compartilhada por todos os projetos em `vitralxx.github.io`) com v1_backup + v2 intacta + v3 + log. Mitigação: log por patch com teto de 256 KB e ordem de descarte (§3.1).
- **Ids:** hoje ninguém consome ids de classe, raça e origem; corrigir é barato **agora**. Depois da F3, toda renomeação exige migração. Homônimos: Oportunista (Batedor/Espadachim), Passo do Vento (Artilheiro/Monge).
- **Carga async:** `kf:pronta` dispara uma vez; o índice "Nesta página" (`utils.js`) pode capturar texto do botão dentro do h3 da `.origem-card` (verificar na F1a).
- **`@layer`:** CSS sem camada vence as camadas; `!important` em camada inverte a ordem (16 no `bazar.css`, 2 no `style.css`); 19 templates com `<style>` inline. Mitigação: F1c isolada e medida.
- **Custo do `MutationObserver` global** (14 seletores, `ficha.js:1697-1708`, re-decora a cada re-render dos 727 cards do Bazar). Mitigação: a v3 não usa observer; delegação em `document` e `KF.decorar(raiz)` chamado pelo Bazar (§3.1).
- **Derivados errados até o fetch voltar** (o trilho mostra minirréguas em toda página; `KF.carga()` é lido síncrono pelo Bazar). Mitigação: regras no bundle, snapshot `mods` por entrada, cache com `versaoCatalogo` (§3.1).
- **Reverter uma fase no ar:** sem cuidado, reverter a F3/F4 deixaria jogadores em só-leitura. Mitigação: marcador `khalkaria_ficha_dono`, modo sombra na F3, "Voltar a usar a v2" (§7).
- **Asset e JSON sem versão:** subpastas de `css/` e JSON buscado em runtime não mudam o `?v=` hoje (`shell.py:150-167`). Mitigação: hash recursivo e `KH_V` (§3.3).
- **Migrar conteúdo preso em template** (Alquimista, Corrompido, features) pode alterar texto canônico. Só por script, com round-trip byte a byte (F1b).
- **CSV defasado no branch do balanceamento:** a próxima entrega de CSV pode desfazer as 109 receitas normalizadas (`a36ef3e`); o `gerar_bazar.py:93-96` esconde isso ao normalizar na leitura. Mitigação: sha em AVISO e errata (§10).
- **Escopo:** o hub trava o refino se não seguir as fases; F1a/F1c/F2 destravam os dois.

**Para o Pedro saber**
- **O balanceamento trocou 6 ícones de callout por emoji na página Sistema do Notion** (Dinheiro, Superfícies, Furtividade, Perseguição, Khan Sins, Magias), porque a API recusava os ícones legados ao gravar D80–D82 (`14.md:11-15`). O site não importa esses emoji como ícone.
- D83–D86 estão aprovadas mas **não estão no Notion**; a ficha mostra esses números com selo "falta Notion".

**Divergências Notion × site × contrato (sinalizar, não escolher)**
- Evasão Ativa: 7 páginas de classe com "10 + Mod.Des + Prof.Defender" contra o Sistema (D8); `data/sistema.json:79` e `pages/sistema.html:462` fora de sincronia com o próprio snapshot (corrige na F0).
- Sangramento: card do Notion/site "+1d4" contra D83 "+Xd4".
- Tique de dano: Em Chamas "no início de cada turno" (`data/condicoes.json:139`) contra Envenenamento (`:134`) e Morrendo (`:9`) "por rodada" (Notion Condições); o contrato põe os dois em `novaRodada` (`regras.json:3224-3229`) e o Morrendo em início de turno como `decisao` (`:2975-2977`) (D31).
- Condições mentais: citadas pelo Teurgo e pelo Veterano, nunca listadas (n=11, `regras.json:3354`; `tags.mental: null`, `:2192`) (D17d).
- Ofício(Ferraria) com o texto da Engenharia no Notion (n=15, `:3378`; C11 `:1296`) (D31).
- "Ultrapassar" (Morrendo, `<`) × "alcançar" (Oco, `<=`) metade (n=17, `:3390`; `:102/1408` × `:136/1471`) (D17c).
- Pele de Pedra com Ae(Ordinário) onde deveria ser Ar (n=18, `:3396`) (D31).
- Resíduo da renumeração de magia D68 (n=19, `:3402`) (D31).
- Faixa de atributo: 8–18 (`criacao.html`, CLAUDE.md §2) × 8–20 (`index.html:158`) × Notion sem faixa (D30).
- Texto de mestre: o CSV em `data/` já é público (D32).
- Limiar: "5–11 cartas" contra a conta (4–12); custo da 5ª carta "…" (D13).
- Monge: perícias iniciais "Movimento, Atacar" (`monge.template.html:577`) contra `[movimento, vontade]` no contrato.
- Anão: "−1 Des" (`racas.json`) contra "−1 Inteligência" (`anao.template.html:47`). Corrompido: "Graus: Tocado, Alterado, Consumido" só no índice.
- Transbordante: "falha no cast e perde o dobro" (`sistema.json:439`) contra "perde o dobro" (`magias.template.html:159`).
- Sustentada: "a cada turno" (Armadura de Espinhos, `magias.json:2208`) contra "a cada rodada" (Refúgio dos Perdidos, `magias.json:2243`).
- Santuário Menor, Invocar Tempestade e Contramedida (níveis 2, 3 e 4) com 3 valores: a regra das 3 barras vale, mas conferir no Notion. Éter Residual e Magias Pactuadas estão em `orfasDeContida`.
- CD sem "Mod." em Brutalista, Espadachim e Artilheiro (P16). Vidente "Interação Social (Intuição)" contra a tag `social` sem Intuição.
- Ofício(Alquimia) falta na tabela de Perícias do Notion e do site (23 linhas), mas é canônica (CLAUDE.md §2).
- CLAUDE.md §2 diz 12 tipos de resistência; o site (`tipos-dano`), o Notion e o contrato (`regras.json:2940`) dizem 14 (D6).
- Grevas Trovejantes citam manobra inexistente (D21); Ae(Todos) inconsistente entre 3 itens (D22).
- Itens Alquímicos: 93/94 existem no Bazar e os 94 CDs batem, mas a redação diverge em 76 e "Lágrima do Tempo" não está no CSV.
- Modulações nos níveis 2-5 sem lista: valem as 4 da escola? Não há regra escrita.
- O exemplo da progressão no contrato ("Atacar +5, Mod +2", `regras.json:925`) usa bônus fora da escala +2/+4/+6/+8.
- Schema defasado: magia máx. 4 e custo 2/4/6/8, `cartaLimiar.categoria` com enum `constituicao…` contra os ids `con/int/sab`, 22 perícias (resolve na F3).

---

## 10. Pedido ao balanceamento

Enviar em paralelo, sem depender do Pedro (exceto onde indicado):

1. **Bloco C** (raças, origens, Limiar, passivas de classe), parado até o rework do Batedor (`14.md:36-37`; `regras.json:2586` `itens._vazio`). Trava a F5b e os Mods de raça/origem/carta/técnica na F3–F4.
2. **Metadado de técnica (P44):** por card, `{grupo, ramo, tier, custo:{recurso, valor}, recarga ∈ enum P43, usos}`, com os ids do site. Contagem a fechar: 274 cards no site contra os "~259" do 14.md (`regras.json:2587`).
3. **Convenção de id** (§3.2) e alias dos ids fora dela (`abismo:lenda-viva`, `anao-variante`, `dryad-variante`, `gruto-rokhan`, `inseto-besouro`, `batedor-sexto-sentido`, `skalri`, `suspensoes-lubrificadas`, `passo-tremulo`, `escudo`, `acao-acelerar`).
4. **Forma única de Mod e namespace único** nos dois arquivos: um só nome por alvo (`recurso.saude.max`, `evasao.passiva`…), `quando`/`acumula`/`status` por Mod, `escolha` no vocabulário de ops, recargas com os nomes dos eventos, ordem das ops.
5. **Eventos:** acrescentar `inicioTurno` ao bloco `eventos` (`:3217-3257`; já está em `vocabulario.eventos`, `:2565`) e usar `aoSerAcertado` (o nome que o contrato já usa, `:1410, 1585, 1600`) como evento "fui acertado"; `novaRodada` × `inicioTurno` para Em Chamas e Envenenamento depende da D31(c). Nota: a ficha deixa o jogador digitar a rolagem de descanso (rolador desligado), contra o "automatico, com desfazer" de `:3195`.
6. **Erratas do arquivo de efeitos:**
   - 4 perdas de parse: Bastão de Karmath (condição "contra Teurgos, Corrompidos e Mortos-Vivos"), Machado da Fúria ("1x/alvo"), Adaga Dimensional (+1d6 de tipo variável), Foco do Vidente (+2 Investigação e Conhecimento incondicional, zerado em `efeitos-gerador.py:524`); a regex de `efeitos-gerador.py:283-284, 296` descarta o qualificador;
   - `municao` como id, não nome; `requisito` estruturado; `propriedades` é campo morto (vazio nas 181);
   - `geradoEm` fixo em data futura (`efeitos-gerador.py:605`);
   - `acumula:false` com 2 sentidos (cópia × outras fontes, `efeitos-gerador.py:427-428`): um campo para cada sentido; e dizer qual vale no Saco de Dormir (override sem frase);
   - nos 7 itens com `Efeito_Jogador`, marcar a mecânica como de mestre (o site não publica, D26);
   - rebasear `references/bazar-v26.csv` no CSV da main (109 receitas normalizadas em `a36ef3e`).
7. **Erratas do contrato:**
   - legenda `_status.aprovado` diz "sem uso" (`:10`), mas 4 campos usam; 6 status fora da legenda (§3.2);
   - textos velhos: `fonteItemStatus` "pendente" (`:824`), `posso_entregar` n=1 oferecendo Ar/Ae (`:3429`), `pendenciasNotion` n=3 ainda descrevendo os "dois pisos" (`:3302`);
   - exemplo da progressão com bônus fora da escala (`:925`);
   - custo da 5ª carta da mão como "…" (depende da D13);
   - fonte da sustentação "a cada 30 min" (`foraCombatePendente`, `:2443-2444`);
   - o corpo do 14.md ainda descreve o modelo antigo: marcar como substituídos só os trechos que a Revisão 2 trocou (os "dois pisos" de C06/P38/P39, a conta "16 pontos = 6 cartas" do P46, o `pmaPorAlvo` do P55); a tabela base do P38, a ordem do P39 e o resto do P46/P55 continuam valendo;
   - status fora da legenda: `decidido: Dnn…`, `JA REGISTRADA no Notion…` (`:3291-3333, 3418, 3423`) e o `recupera.status` numérico (`:2655, 2730`), que é contagem e deveria ter outro nome.
8. **Não pedir de novo** (já atendido na rev. 2/3): PMA como display, +2 por nível, D80–D82 canônicos, Limiar por mão, alvos `capacidade.*`/`ar`/`ae.*`, Ar/Ae parseados, dado e família de arma.
