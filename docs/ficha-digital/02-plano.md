# Ficha como hub: plano (02, rev. 2026-09-26)

> Parte da base (rascunho 02), das 15 críticas de completude verificadas, do contrato `regras-ficha` **revisão 3** do balanceamento (`b1b8919`, idêntico ao `scratchpad/bal/regras.json`), do `ficha-efeitos-itens.json` (727 itens), das **respostas do Pedro de 2026-09-26** (`03-respostas-pedro.md`) e das quatro respostas do mesmo dia às perguntas que estavam abertas no §8 (D33–D36, §0.1).
> Precedência: respostas do Pedro de 2026-09-26 (`03`) > decisões de 2026-09-25 > Notion > seção "Revisão 2/3" do `14.md` (14.md:9-69) > corpo do `14.md` e do `regras.json`. Do corpo do 14.md o site **não lê**: os "dois pisos" (C06 e o piso de P38/P39, substituídos pela D82), a conta "16 pontos = 6 cartas" do P46 e o `pmaPorAlvo` do P55.
> **Regra de trabalho (Pedro):** a ficha é feita lado a lado com o agente de balanceamento. Regra que o contrato não fecha é **perguntada a ele** e sai com selo **PENDENTE (balanceamento)** até a resposta; nunca é assumida. Decisão de desenho ou de conteúdo novo vai ao Pedro (selo PENDENTE PEDRO).
> Convenção: `regras.json:N` é o contrato rev. 3; `efeitos-itens.json:N` é o arquivo de efeitos; `03 §N` é o arquivo de respostas.

---

## 0. O que mudou

### 0.1 Respondido pelo Pedro em 2026-09-26

D33–D36 são as quatro perguntas que estavam abertas no §8, respondidas no mesmo dia; os ids são deste plano (não estão no `03`).

| Id | Resposta | Entra em |
|---|---|---|
| D32 | Tudo público ("meus jogadores não vão ver"). Sai o `_config.yml` e a checagem de spoiler | F0, F1d |
| D3 | JSON do balanceamento em `data/balanceamento/`, **publicada**. `docs/` já organizado (pedido, plano, respostas) | F1d |
| D1 | Página própria da ficha + drawer que empurra, com **modo Mesa**; **todo campo editável à mão**, inclusive os calculados | M1, M2 |
| D2 | Inventário vai para o trilho, num **modo especial organizado** | M4 |
| D4 | Assistente de criação passo a passo, com rolador, retornável a qualquer passo; sem Limiar no nível 1 | M3 |
| D30 | 8–18: soma < 8 rola de novo; entrada manual permitida; gravar no Notion | M3, F0 (`index.html:158`) |
| D31 | Corrigir tudo no Notion; tique no **início do turno do afetado** | F5 |
| D5 | (a) `prof_*` em **grau** (o Bestiário importa menos); (b) `estadoSessao` só no nativo | F0 (export), M1 |
| D6 | Atualizar o CLAUDE.md nos três pontos (custo mínimo/Nv1 sem Contida, 14 tipos, 3 barras fora do Nv1) | commit próprio, junto da F0 |
| D7 | `maior` em todos, **com escolha de mudar**: seletor nas 4 duplas `maior` do contrato (Movimento, Convencimento, Intimidação, Enganação); Atacar segue `porArma` | F3 (`escolhaAttr`) |
| D8 | Ativa = 10 + Mod.DES + **dado** de Defender (o dado não soma atributo); vale só contra o alvo que te atacou, no turno dele | F0 (7 classes), F5 |
| D9 | Condições nos números: automático com detalhamento ("auditável on the go") | F3, F5 |
| D10 | Mesa modular pelo inventário: ações possíveis, condições que empilham, perícias, ataques, magias e dano; CSS organizado e estiloso | M1 |
| D11 | Raras sem efeito no site + campo livre; script que revela **uma** carta quando o jogador a pega ("oculto até o script rodar e comitar"): revelada mostra o efeito, na página do Limiar e na ficha | M6 |
| D12 | Contador de saldo com aviso, sem trava. Abismo é de todos; o Corrompido tem tabela de corrupção própria | M1, F1b |
| D13 | (a) 5ª carta custa 5; (b) texto "4–12"; (c) 6ª carta = 2 pontos livres, **sempre** 2 pontos do Limiar (mesmo sendo a 1ª), 1 por mão, repartidos entre até dois atributos | M3 |
| D14 | (a) Sangramento consome antes de aplicar; (b) gravar D83–D86 no Notion agora | F5; rodada 3 |
| D15 | Saúde temporária: não soma (fica a maior), gasta primeiro, some no descanso longo | F3 |
| D16 | 1 sustentada ativa; custo por turno = o escrito na magia, senão o Éter da canalização | F3, F5 |
| D17 | Exposto sai ao ser acertado; Desnutrido por dia descansado sem comer (1 comida) ou sem luz; Exaurido/Oco saem ao deixar os negativos; promover Agarrado; não promover Marcado; "ultrapassar" nos dois. **(b) sem resposta:** a nota diz como se ganha Desnutrido, não como diminui (`regras.json:1549` `decrementa: null`) | F5 ((b) e (d): §8) |
| D18 | 1 magia conjurada por turno; ações livres infinitas; consumível 1 ação em si, 1 em outro, arremesso segue o item | F5 |
| D19 | Reserva de Stamina visível como "comprometida", removível e auditável | F3 |
| D20 | Os 27 `decisao` aprovados e gravados em lote (inclui `empilhamento`, `regras.json:2204-2210`) | §3.2 (selo), rodada 3 |
| D21 | A manobra Investida **já está no Notion** ("passou a existir agora") | sync do Sistema (§6), F1d |
| D22 | Ae(Todos) = os 11 atípicos, sem Força nem Primordial, nos três itens | rodada 3 |
| D23 | Cura em Autômato: avisar, com pop-up de confirmação | F6 |
| D24 | Ratificadas as duas leituras | rodada 3 |
| D25 | Corrigir "Saude" e ler "Armas Leves." como requisito (**edição do CSV fica com o Pedro**, §8) | CSV |
| D26a | Aplicar a mecânica; Marcas da Vhelor com texto num arquivo de dado | M5 |
| D26b | Empilhável explícito no CSV (**edição fica com o Pedro**, §8) | CSV, F0 (`ESPERADO`) |
| D27 | Página de classe por ramo, texto do Pedro (`03 §3.2`) | M7 |
| D28 | Lei de cor nos quatro (paleta de recurso: **Saúde vermelho, Stamina amarelo, Éter verde e roxo**, corrigida pelo Pedro depois das fotos), **mantendo a animação do Limiar** | F1c, M7 |
| D29 | Emoji vem do Notion: JSON verbatim, o gerador mapeia para glifo | F1a |
| D33 | Raras vazadas em branches públicas: **oculto só no site**. O GitHub Pages só serve a `main`; páginas e JSON do site ficam sem efeito de rara até o `tools/revelar_carta.py` revelar a carta; as branches ficam como estão. A varredura de branches do `[raras]` é AVISO, nunca FALHA; o pedido "raras fora do git público" saiu da rodada 4 antes do envio | M6, F1f, §10 |
| D34 | Tiers no nível 1: **à vista, travados**. Na criação, a tela por ramo mostra os 3 tiers e as Marcas já no nível 1, travados, cada um com o nível que destrava (T1 nv2, Marca nv3, T2 e 2ª Marca nv4, T3 e 3ª Marca nv5); as escolhas acontecem na subida de nível. Vale o contrato | M3 |
| D35 | A nota sobre o Limiar no nível 2 era das cartas, não de técnicas: "era cuidado com as draw de cartas do limiar, isso só acontece a partir do nível 2, toda mão você tem 1 carta grátis e pode gastar pontos do limiar ou queimar 1 carta, conforme as regras no notion." A página do Limiar já tem a regra de queimar (`templates/limiar.template.html:717`). Nenhuma carta no nível 1 | M3, M1 (aba 3) |
| D36 | **Várias fichas por navegador, com seletor**: índice de personagens + uma chave por ficha, ficha ativa lembrada; seletor no drawer e na página; o assistente cria ficha **nova**; a v2 migra como uma ficha do índice; Export/Import por ficha e "exportar todas"; uso da quota visível; sessão e log por ficha | §3.1, M1, M3, F3, F4, F4c |

### 0.2 Já resolvido na rev. 3 (continua valendo)

| Tema | Como ficou | Fonte |
|---|---|---|
| Modificador | `floor((attr−10)/2)`, canônico e no Notion | D80, `regras.json:57-76` |
| Vantagem/desvantagem | 2d20 maior/menor, não acumulam, se anulam; crítico **só no dado usado**; o Defender rola o próprio dado 2× | D81, `regras.json:1348-1390` |
| Custo mínimo de magia | 1 Éter em toda conjuração; a única de custo 0 é Nv1 + Normal + sem modulação; Nv1 sem Contida | D82, `regras.json:2311, 2346-2380` |
| D83–D86 | Sangramento `+Xd4` com −1 por acerto; estresse obrigatório; Ar racial + armadura sem teto; tique de Morrendo não mitigável. Selo "falta Notion" até a rodada 3 gravar (D14b) | `regras.json:3312-3333` |
| +2 atributos por nível | Níveis 2–5, +8 no nível 5 | D87 |
| Pontos do Limiar | 4 por nível (2–5), custo por mão grátis/2/3/4/5 (D13a), pontos acumulam | `regras.json:3062-3091` |
| PMA | Só display da progressão ("1º +7 · 2º +2 · 3º −3"), sem contador por alvo | `regras.json:922-1038` |
| Empilhável | 10 unidades = 1 de peso, propriedade inteira | `regras.json:902-908` |
| Contagens por nível | nv1 = 4 técnicas, sem tier e sem Marca; nv2 destrava Tier 1; nv3 1 Marca; nv4 Tier 2 e 2 Marcas; nv5 Tier 3 e 3 Marcas; técnicas = 3 + nível; tudo **avisa**, nada bloqueia (`validacoes.bloquear: []`); na criação, tiers e Marcas à vista e travados (D34) | `regras.json:3021-3053, 3092-3100, 3102-3136`; bate com `teurgo.template.html` ("4 Técnicas, 2 Escolas" no nv1) |
| Escolas do Teurgo | 2 / 3 / 5 (nv1 / nv3 / nv5) | `regras.json:3136`, `teurgo.template.html:681` |
| Efeitos de itens | 214 itens, 181 armas, 243 consumo, 115 sem efeito, 0 não parseados; ids 727/727 | `14.md:17-34` |

**Críticas adotadas** (numeração da `critica.md`): 2 (corrigida: 14 tipos, Evasão Ativa canônica), 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15. A 1 e a 14 foram resolvidas pela rev. 3.

### 0.3 Rodada 3 com o balanceamento (em voo)

Enviada; o site trabalha em paralelo e usa selo **PENDENTE (balanceamento)** no que depende dela.
- **Gravações no Notion:** D14b, D20, D30, D31, D17, D15, D16, D18, D13, D8, D12. A D21 **já está no Notion** (Pedro): o balanceamento só confere.
- **Arquivo de efeitos:** D21 (Investida), D22, D23, D24, D25, D26a (Marcas da Vhelor), D26b, D5a.
- **Dúvidas:** (1) técnicas reatribuíveis no descanso **curto** (Pedro, `03 §2`) × **longo** (`regras.json:3054`); (2) para que serve o "Des/Con" do Defender na ficha física; (3) ~~Intimidação Con/For~~ **caiu**: `sistema.json` ("Con ou For"), contrato (`[CON, FOR]`, `:1236-1240`) e ficha física concordam; (4) ~~quais "X/Y" podem trocar~~ **caiu**: a D7 cobre as 4 duplas `maior`, e Atacar segue `porArma`; (5) regras do assistente e da subida: o contrato já fecha as contagens (§0.2); da dúvida 5 só importa a faixa depois de "mover 1 ponto"; (6) expressão canônica do rolador. **Avisar o balanceamento** que a 3, a 4 e o grosso da 5 caíram.

### 0.4 Achados que continuam

- Empilháveis: o índice do balanceamento tem 87, o site 85. A diferença (Casca de Raiz, Seiva da Vhelor) fecha quando o Pedro editar o CSV (D26b); até lá `ESPERADO['empilhavel']` fica 85 com AVISO nominal.
- O vocabulário do `regras.json` e o do arquivo de efeitos não batem; o site normaliza no build com alias fechado (§3.2).
- `data/sistema.json` fora de sincronia com o Notion (D80–D82, Evasão Ativa em `:79`): a F0 em curso resolve.
- **Contradição nova:** o D17 do Pedro fala em "sair dos negativos" de Stamina **e** Éter; o contrato proíbe gasto sem saldo (`regras.json:114, 127`, `decisao` P07, que entrou no lote da D20) e só descreve Éter negativo por perda involuntária. São duas respostas do Pedro em choque: o balanceamento propõe a leitura na rodada 4 (§10) e ela volta ao Pedro antes de virar regra; até lá, selo PENDENTE (balanceamento).
- O `empilhamento` do contrato (`regras.json:2204-2210`: entre condições soma, mesma condição renova duração, com X soma X) é `decisao` e entrou no lote da D20; o Pedro ainda confirmou que "algumas stackam, sangramento por exemplo". Aplica-se inteiro, com selo "decisão do Pedro, falta Notion".

---

## 1. Objetivo

1. A **ficha é o hub do site**: tudo que tem regra vai para ela (magia, técnica, marca, ultimate, carta, dor e benefício, condição, raça, variante, origem, classe, item), por botão, arrasto (alça) ou atalho.
2. **Todo número derivado é calculado e mostra a conta**, com fonte e status por termo; o não canônico aparece com selo.
3. **Todo campo é editável à mão**, inclusive os calculados: o ajuste fica marcado, removível e auditável, e a conta continua visível (M2).
4. **Itens mudam os campos reais** pelo estado (carregado, equipado, sintonizado, munição ativa, ativado, consumido).
5. **Modo Mesa**: a ficha joga — ações possíveis pelo inventário, rolagens com a expressão visível, condições e log com desfazer (M1).
6. **Assistente de criação** e **subida de nível** passo a passo (M3).
7. Continua sem SPA: drawer persistente, localStorage com **várias fichas por navegador** e seletor (D36), re-hidratação, **Export/Import JSON obrigatório** (por ficha e de todas). O Bazar não trava por dinheiro; o Limiar não sorteia.
8. Todas as páginas na linguagem do Bazar v3, com a lei de cor (D28) e as páginas de classe novas (D27).

---

## 2. Estado atual

| Peça | Onde | Veredito |
|---|---|---|
| Motor de carga `KhInv` (46 testes) | `js/ficha.js:17-458`, `tools/testes/carga.test.js` | **Reaproveitar**. Falta `armaComBeneficio:1` (`regras.json:913`); lê `inv.empilhavel` a partir da F0 |
| Gravação/sync v2 | `ficha.js:596-656` | **Reaproveitar** (QuotaExceeded com toast em `:596-605`) |
| Migração v1→v2, `importJSON` sem guarda | `ficha.js:368, 569-570, 1632-1648` | **Blindar** na F0 (em curso) |
| `guardaBackup` | `ficha.js:465, 552-555` | **Substituir** por backup baixável na F3 |
| `muta`/`lote`/`desfazer` (20 passos, só inventário) | `ficha.js:661-735` | **Generalizar**: várias partes, log persistente |
| API `window.KF` v2, `kf:pronta`/`kf:mudou` | `ficha.js:1727-1752` | **Manter** a assinatura e **estender** |
| Capacidade de mochila | `gerar_bazar.py:121-186`, `ficha.js:149-166` | **Protótipo** do padrão de efeitos |
| Pop-up, filtros, busca, toast, painel do Bazar | `bazar-cartao.js`, `bazar.js`, `bazar-inventario.js`, `bazar-receita.js` | **Extrair** para `kh-ui.js` |
| Harness de teste (vm + DOM falso, sem motor de CSS) | `tools/testes/*.test.js` (95 hoje), `build.py:56-120` | **Reaproveitar** |
| Estado v2 (22 perícias, bônus guardado, `derivadosManuais`) | `ficha.js:476-488, 519-535` | **Reescrever** (v3); `derivadosManuais` vira `ajustes` (M2) |
| Resistências (12 tipos, R/I/ae) | `ficha.js:493-495, 533` | **Reescrever**: 14 tipos + categorias + Todos, camadas R/I/V/Ae |
| Derivados digitados | `ficha.js:1093-1125` | **Reescrever** com `KhRegras` + `KhEfeitos` |
| DnD por `MAPA` e nome raspado | `ficha.js:1499-1604` | Hotfix na F0; **reescrever** na F4 (ids dos geradores) |
| UI do drawer, CSS injetado | `ficha.js:823-1469` | **Reescrever**; CSS para `css/ficha.css` |
| Export Bestiário | `ficha.js:433-445, 1655-1678` | F0 corrige atributo e passa `prof_*` a grau (D5a) |
| `data/ficha.schema.json` | 6 divergências com o código | F0 mínimo; v3 na F3 |
| Conteúdo de classe/raça/origem | só HTML nos templates | **Extrair** para `data/` na F1b |
| Contrato e efeitos do balanceamento | `scratchpad/bal/` | **Integrar** verbatim em `data/balanceamento/` (D3) |
| Ficha física A4 (5 páginas) | enviada pelo Pedro (`03 §4`) | **Referência de campos e layout**; não tem estresse nem magia Nv5 |

**F0 em curso (outro agente):** guarda v2.1, sync do Sistema, Religião→SAB, hotfix do `MAPA`, schema v2 mínimo, export com `prof_*` em grau, `KhInv` por `inv.empilhavel`, índices gerados, ids de classe, fatos das páginas manuais, Evasão nas 7 classes.

---

## 3. Arquitetura-alvo

```
data/*.json ──gerar_*.py──► pages/*.html   (cards com data-kf-tipo/-id, data-prever, <button class="ent-add">)
   │   (F1b: blocos classe/raca/origem estruturados, verbatim, round-trip)
   ├─gerar_catalogo.py──► data/catalogo/{magias,condicoes,limiar,classes,racas,origens,pericias}.json
   ├─gerar_regras_ficha.py ◄─ data/balanceamento/regras.json (projeção sem raras; verbatim em privado/balanceamento/) ─► js/ficha/00-regras-dados.js
   ├─gerar_efeitos.py      ◄─ data/balanceamento/ficha-efeitos-itens.json + bazar.json + condicoes.json + magias.json
   │                                                          ─► data/efeitos.json
   ├─data/vhelor.json (texto das 7 Marcas, M5) ─► catálogo
   └─gerar_ficha.py ──► pages/ficha.html   (templates/ficha.template.html)

privado/limiar-raras.json (GITIGNORED, do Notion) ──tools/revelar_carta.py <id>──► data/limiar.json (1 carta)

navegador:  kh-ui.js ─┬─ KhPrever · KhTeclas · KhFiltros · KhBusca · KhToast · KhPainel · KhLevar
                      └─ KhDados (rolador puro)
            ficha.js (ARTEFATO = concat de js/ficha/*.js) = kh-inv · kh-regras · kh-efeitos · kh-ajustes · kh-estado · kh-catalogo · ui-*
               estado v3 ─► KhEfeitos.coletar ─► KhRegras.avaliar(ajustes) ─► {valor, calculado, ajuste, termos[]} por nó ─► componente "conta"
               (o ajuste é o último termo de cada nó, aplicado antes que os dependentes o leiam)
```

### 3.1 Módulos JS

Sem ESM e sem SPA; o Bazar exige `KF` síncrono. Fontes em `js/ficha/*.js`, cada um uma IIFE que registra `raiz.KhX` e exporta por `module.exports` para o `node:test`. O `tools/build.py` concatena em `js/ficha.js` na ordem do manifesto `js/ficha/ORDEM`, com cabeçalho `// ARTEFATO: editar js/ficha/*.js`; o `validar.py` confere `js/ficha.js == concat(ORDEM)`.

**Síncrono de verdade:** as regras compiladas entram no bundle (`js/ficha/00-regras-dados.js`). Cada entrada guarda `mods` (snapshot) e `versaoCatalogo`; `KF.carga()`, `derivados()` e as minirréguas calculam síncronos sobre o snapshot e reconciliam quando o catálogo chega (se mudar um número, `kf:mudou{partes:['derivados']}`). Cache de `derivados()` por `fichaId + rev + versaoRegras + versaoCatalogo`. Sem MutationObserver: delegação em `document` e `KF.decorar(raiz)` chamado pelo Bazar.

**Ordem do build:** conteúdo → bazar → efeitos → regras_ficha → catálogo → ficha → concat de `js/ficha.js` → shell → testes → validar.

| Módulo | Responsabilidade | Puro? |
|---|---|---|
| `kh-inv.js` | `KhInv` como hoje; na F6 o bônus de capacidade vem do `KhEfeitos` | sim |
| `kh-regras.js` | `(estado, regras, conteudo, mods) → {valor, termos:[{rotulo, fonte, op, valor, ativo, motivo, status}]}`; AST sem `eval`; ordens `movimento.ordem`, `recursos.ordemMaximo`, `magia.ordemCusto` (D82); resolvedor de teste (D81); `escolhaAttr` do D7 | sim |
| `kh-efeitos.js` | Coleta Mods de raça/variante, origem, classe, cartas, técnicas, condições ativas, itens (pelo `quando`), permanentes (Marcas da Vhelor); resolve `acumula`, `acumulaCopia`, `escolha`; cada Mod carrega a fonte | sim |
| `kh-ajustes.js` | `aplicar(caminho, valorCalculado)`: chamado pelo `KhRegras` ao fechar cada nó do grafo (ordem topológica), antes dos dependentes; recusa caminho de estado (M2) | sim |
| `kh-dados.js` (no `kh-ui.js`) | Rolador: parse de expressão (`NdX`, `+k`, `kh1`/`kl1` para vantagem, `4d6dl1`, "rola de novo se < 8"), RNG injetável (`crypto.getRandomValues` no navegador, semente nos testes), resultado com cada dado | sim |
| `kh-estado.js` | Estado v3, `novaFicha`, migração `v1→v2→v3`, gravação, sync, `commit`/`lote`, log de desfazer multi-parte, guarda contra a v2; índice de fichas e ficha ativa (D36: criar, trocar, duplicar, excluir, uso da quota) | bordas no storage |
| `kh-catalogo.js` | Fetch preguiçoso de `data/catalogo/*.json` e `data/efeitos.json` com `?v=` de `window.KH_V`; `garantir(tipos, timeout)` só para o export Bestiário; reconcilia e marca órfão | cache |
| `ui-drawer`, `ui-pagina`, `ui-nucleo`, `ui-tecnicas`, `ui-cartas`, `ui-inventario` (componente único, também no Bazar), `ui-grimorio`, `ui-mesa`, `ui-criacao`, `ui-nivel`, `ui-vhelor` | Render; todo derivado usa o componente "conta" com edição (M2) | não |
| `js/kh-ui.js` (fora do bundle; o shell injeta antes do primeiro `<script src>` local) | `KhPrever`, `KhTeclas`, `KhFiltros`, `KhBusca`, `KhToast`, `KhPainel`, `KhLevar`, `KhDados` | — |

**API `KF` v3.** Contrato fechado: os 23 membros de `ficha.js:1727-1751` com a semântica preservada, guardados por `tools/testes/kf-contrato.test.js`. Pontos sensíveis: `versao:'3'` e `bazar.js:179` passam a `>=2` no mesmo commit; `desfazer()` sem argumento continua só-inventário (a Mesa usa `desfazer({partes})`); `abrir()` mantém os aliases `inventario` e `atributos`; `exportar()` devolve Promise. Os 23 membros agem sobre a **ficha ativa da aba** (D36).

Novos: `levar(ref, opcoes)`, `remover(ref|uid)`, `tem(ref)`, `decorar(raiz)`, `derivados()`, `ajustar(caminho, ajuste)`, `desajustar(caminho)`, `rolar(expressao, contexto)`, `aplicarCondicao(id, {x, duracao})`, `recurso(nome, delta)`, `evento(nome)`, `fuiAtacado(agressor)`, `fuiAcertado()`, `usar(uid)`, `ativar(uid)`, `modo('ficha'|'mesa')`, `fichas()`, `trocar(id)`, `criarFicha(dados)`, `duplicar(id)`, `excluir(id)`, `exportarTodas()`, `REGRAS`, `colunaCanonica`, `pesoTexto`.

`kf:mudou.partes` ganha `identidade|atributos|pericias|recursos|condicoes|entidades|ajustes|sessao|ficha` (`ficha` = troca da ficha ativa: drawer, página e Bazar re-renderizam tudo).

**Armazenamento (D36: várias fichas, com seletor).**
- **Índice** `khalkaria_fichas_v3`: `{schema:'fichas/1', ultimaAtiva, projecaoV2?, fichas:[{id, nome, classe, nivel, atualizadoEm}]}`. É vitrine do seletor: a fonte é a ficha, e a linha dela no índice é atualizada na mesma gravação.
- **Uma chave por ficha** `khalkaria_ficha_v3:<id>`; o id é aleatório, gerado na criação, e fica em `ficha.id`.
- **Ficha ativa:** por aba, em `sessionStorage` (`khalkaria_ficha_ativa`), para que trocar numa aba não arraste as outras; a última escolhida fica em `ultimaAtiva` e é a que abre numa aba nova.
- **Seletor** no drawer e na página da ficha: lista com nome, classe, nível e data; **Criar** (abre o assistente, M3), **Trocar**, **Duplicar** (id novo, nome "(cópia)", sem log nem sessão), **Excluir** (confirmação e export automático do `.khalkaria.json` antes; apaga a ficha, o log, a sessão e o rascunho de subida daquele id; excluir a ativa troca para a mais recente; sem fichas, a página oferece Criar e Importar).
- **Export/Import:** Exportar = a ficha ativa (`<nome>.khalkaria.json`); **Exportar todas** = `khalkaria-fichas.json` `{schema:'fichas/1', fichas:[…]}`. Importar aceita os dois formatos e cada ficha entra como ficha **nova** no índice; se o id já existe no navegador, pergunta: atualizar aquela ficha (com export automático dela antes) ou importar como cópia com id novo.
- **Quota:** o seletor mostra o uso (soma das chaves `khalkaria_*` contra os ~5 MB da origem). Em QuotaExceeded, apaga nesta ordem os logs de desfazer das fichas inativas, o da ativa e `khalkaria_ficha_v1_backup`, nunca ficha nem índice; se ainda não couber, o toast de export (`ficha.js:596-605`) oferece "Exportar todas".
- **Entre abas:** o evento `storage` em `khalkaria_ficha_v3:<id>` só re-hidrata as abas cuja ativa é aquele id; mudança no índice só atualiza o seletor; se outra aba excluir a ficha ativa desta, esta fica só-leitura com "Baixar ficha" e "Trocar".

**Log de desfazer:** uma chave por ficha, `khalkaria_ficha_v3_log:<id>`; cada passo é patch inverso por parte `{revPorParte, partes, antes, rotulo}`; teto de 20 passos **e** 256 KB por ficha (a quota de 5 MB é por origem, compartilhada em `vitralxx.github.io`); desfaz só o **topo** da pilha e só se o `rev` de cada parte do passo não mudou desde ele (`revPorParte`), senão avisa "outra aba mudou a ficha"; não vai no export; em QuotaExceeded segue a ordem de limpeza do armazenamento (acima).

O **log visível da Mesa** (M1) é outra coisa: histórico de sessão com rolagens e ações, guardado **fora da ficha**, uma chave por ficha em `khalkaria_ficha_v3_sessao:<id>` (vai no `estadoSessao` do export nativo daquela ficha). Rolagem e entrada de log não sobem `rev` de parte nenhuma, então rolar não invalida o desfazer. Na lista, o botão Desfazer aparece só na ação mais recente ainda desfazível; nas antigas, "desfazer até aqui" desempilha em ordem, com confirmação; ação cujo passo saiu do teto de 20 mostra "não desfazível".

### 3.2 Dados e normalização

**Nos cards** (`gerar_magias`, `_condicoes`, `_limiar`, `_classes`, `_racas`, `_origens`; o Bazar já tem `data-id`): `data-kf-tipo`, `data-kf-id` (= id do JSON), `data-prever="tipo:id"`; `<button class="ent-add" aria-keyshortcuts="A" aria-label="Levar para a ficha">`, `hidden` até a F4; alça `.ent-alca`.

**Tipos:** `magia | tecnica | marca | ultimate | traco | variante | subespecie | tecnologia | corrupcao | origem | raca | classe | carta | dor | beneficio | condicao | item`. Chave única: `tipo:id`.

**Convenção de id** (publicada ao balanceamento): `magia-*`, `<classe>-*`, `classe-<c>`, `raca-<r>`, `<raca>-*`, `origem-*`, `limiar-*`, `abismo-*`, condição sem prefixo, `item-<slug>`. Os ids do contrato fora dela (`abismo:lenda-viva`, `anao-variante`, `dryad-variante`, `gruto-rokhan`, `inseto-besouro`, `batedor-sexto-sentido`, `skalri`, `suspensoes-lubrificadas`, `passo-tremulo`, `escudo`, `acao-acelerar`) se resolvem pela tabela `tools/alias_ids.json`, validada por conjunto; id desconhecido derruba o build.

**Namespace de alvo** (`tools/alias_alvos.json`, mesma tabela nos dois geradores):

| Do balanceamento | No site |
|---|---|
| `saude.max`, `recurso.saude.max` | `recurso.saude.max` |
| `eter.max`, `recurso.eter` | `recurso.eter.max` |
| `stamina.atual`, `saude.atual`, `eter.atual` | `recurso.<r>.atual` |
| `saude.temporaria` | `recurso.saude.temporaria` (regra D15) |
| `evasao` (condições), `evasao.passiva` (itens) | `evasao.passiva` (a Ativa deriva dela) |
| recargas `longo`, `curto`, `combate`, `cena` | eventos `descansoLongo`, `descansoCurto`, `fimCombate`, `fimCombate\|fimCena` |
| `resistencia`/`imunidade`/`atributo` sem sufixo com `escolha` | alvo com sufixo resolvido pela escolha guardada na entrada |

Alvo fora da tabela, op fora do vocabulário ou status fora do mapa **derrubam o build**.

**Destino de cada alvo** (`tools/alvos_destino.json`, F1d): cada uma das 26 famílias de `alvos` leva a `{campo}`, `{lembrete}` ou `{adiado:fase}`; alvo sem entrada é FALHA. Os valores de `condicao` (`reacaoDefender`, `emCombate`, `foraDeCombate`, `descansoAoArLivre`) entram em vocabulário fechado. `testes.<ATTR>` soma em toda perícia daquele atributo; `classe.V/G/R` (Coroa de Kha) entra como termo do coeficiente; `permiteSemTreino.<pericia>` libera grau 0 com a `penalidade`; `tamanho`, `dano.corpoACorpo` e `descanso.comodidade` ficam como lembrete; `recipiente.bugigangas` adiado.

**Mapa de status → selo:**

| Status | Na conta |
|---|---|
| `canonico`, `canonicoParcial`, `decidido: D80\|D81\|D82 · gravado…`, `JA REGISTRADA no Notion…` | sem selo |
| `aprovado`; `decidido: D83–D86`; `decisao` (os 27, aprovados em lote na D20) | entra com selo "decisão do Pedro, falta Notion" (cai quando a rodada 3 gravar e o contrato subir de revisão) |
| `pedroDecide`, `pendente`, `decisaoDoSite` | selo **PENDENTE PEDRO** |
| regra perguntada ao balanceamento e sem resposta (lista em `tools/pendentes_balanceamento.json`, cada uma com o nº da rodada) | selo **PENDENTE (balanceamento)** |
| `canonico-mas-em-rework`, `canonico-com-bug-conhecido` | aviso de classe |
| `emDesenho` | nunca publicado |
| string `parcial: …` | `canonicoParcial` + nota "lista incompleta" |
| qualquer outro | FALHA de build |

Resposta do Pedro que ainda não chegou ao contrato (0.1) entra no `tools/decisoes_pedro.json` com id e data, e o termo sai com selo "decisão do Pedro, falta Notion" até a revisão seguinte do contrato; o `validar.py` avisa quando o contrato passa a cobrir o id (a entrada local sai).

**Catálogo** `data/catalogo/<tipo>.json`: `{id, tipo, nome (sem emoji), icone, resumo, <campos do tipo>, efeitos:[Mod], status}`. O emoji do dado vai para `icone` sem tocar no JSON de conteúdo (D29); teste: nenhum `nome` com emoji.

**`data/efeitos.json`** (F1d): `{schemaVersion:'efeitos/1', fonte:{shaBalanceamento, shaBazar}, porId:{'item-x':{quando, slot, acumulaCopia, usos, sintoniaDescansos, duracao, mods[], arma?, consumo?, lembretes[], texto, status}}}`, só para os 612 ids com algo. `texto` é o `bazar.efeito` (o que o jogador lê). Com a D26a, os 7 itens da Vhelor/Sonhador **recebem** Mods, que vêm da atualização do arquivo de efeitos da rodada 3; até ela, só lembrete.

**Checagens novas no `validar.py`:** `[ids]`, `[fragmentos]`, `[glifos]`, `[artefato-js]`, `[artefato-json]` (regenera `data/catalogo/*`, `data/efeitos.json` e `js/ficha/00-regras-dados.js` numa cópia e compara byte a byte), `[conteudo×contrato]` (V/G/R, `basePorRaca`, perícias iniciais contra `data/`; divergência = AVISO ao Pedro), `[raras]` (M6: não depende do arquivo privado para a regra principal), `[vhelor]` (M5), `checa_efeitos` (F1d).

### 3.3 CSS

`@layer reset, base, layout, componentes, paginas, estados` no topo de `style.css`. Os `<style>` inline dos templates ficam fora de camada durante a migração, medido (F1c). Do `reduced-motion`, só o bloco `*{…!important}` vai para `reset`; as sobreposições por componente ficam na camada do componente ou em `estados`.

| Arquivo | Conteúdo | Fase |
|---|---|---|
| `css/tokens.css` | Promove de `bazar.css:10-63` (`--mono`, `--painel`, `--sombra-*`, `--mola`, `--cantos`, `--tem/--leve/--extremo`, `--rar-*`); escalas `--esp-*`, `--raio-*`, `--dur-*`, `--z-*` (sticky 30, lista 40, rightbar 50, nav 100, dica 105, painel-esq 110, ficha 120, popover 400, toast 500, overlay 800, splash 900); `--recurso-saude/stamina/eter` já com a paleta da D28 corrigida (Saúde vermelho, Stamina amarelo, Éter verde e roxo); `--classe-<c>` e `--ramo-<c>-<r>` (M7); `--esq-w`, `--dir-w` | F1c |
| `css/componentes.css` | F2: conta (com estado "ajustado"), selo, régua, botão, stepper, alvo de soltura, toast, popover, `.ent`/`.ent-add`, dado/rolagem. Depois: chip, tabela v3, caixa de regra, trilha de filtros | F2, cresce na F7 |
| `css/ficha.css` | Drawer, trilho, página da ficha (moldura gótica), Mesa, assistente, overlay da Vhelor | F2 → F6 |
| `css/paginas/*.css` | Destino dos `<style>` dos templates, uma família por entrega | F7 |

O shell injeta tokens, componentes, ficha, `kh-ui.js` e o sprite `partials/glifos.html` em todas as páginas, com `?v=`. Duas lacunas a fechar: hash recursivo de `js/**` e `css/**` (`shell.py:157-167` só lê o primeiro nível) e `window.KH_V` no head-boot para o JSON buscado em runtime.

---

## 4. Contrato "entidade → ficha"

**Ref de transporte:** `{"v":1,"tipo":"magia","id":"magia-dardo-arcano"}`, MIME `application/x-khalkaria-ref`; `text/plain` leva só o nome. Continuam aceitos `{_bazar:true,item}` e `application/x-kf-uid`.

**Entrada guardada:** `{uid, tipo, id, estado:{…por tipo}, cache:{nome, versaoCatalogo, resumo?}, mods:[…snapshot], adicionadoEm, nivelAquisicao?}`. Entrada cujo id sumiu vira órfã e nunca é apagada. **O export nativo nunca depende de rede**; só o export Bestiário faz `await KhCatalogo.garantir(tipos)` e, se falhar, aborta com toast.

**`Mod` do site:**

```json
{"alvo":"capacidade.bugigangas","op":"soma","valor":3,"quando":"carregado","acumula":true,
 "duracao":null,"fonte":{"tipo":"item","id":"item-mochila-reforcada"},"status":"canonico"}
```

- `op`: `soma|multiplica|fixa|minimo|maximo|vantagem|desvantagem|falhaAuto|semAcao|semReacao|lembrete` (`regras.json:2549-2561`) mais `escolha`.
- `quando` de item: `carregado | equipado | sintonizado | municaoAtiva | ativado`; `consumido` é o bloco `consumo` disparado por `KF.usar`. `quando` de entidade: `permanente | escolhido | ativo`.
- `acumula` (no Mod, entre fontes): `true | false | 'maior'`. `acumulaCopia` (na entrada do item). Fontes diferentes somam: Ar sem teto (D85), camadas de Ae, Mochila Reforçada + do Contrabandista.
- O `acumula:false` do arquivo tem 2 sentidos (`efeitos-gerador.py:427-428`): "outra cópia" → `acumulaCopia:false` (Bolsa de Couro, Mochila Reforçada, do Contrabandista, Bolsa Dimensional); "outras fontes" → Mod `acumula:false` (Anel das Brasas); sem frase (Saco de Dormir) → AVISO até o balanceamento dizer.
- Opcionais suportados (16): `condicao`, `duracao` (8 formatos), `tipo`, `escolha`, `ataques`, `excecao`, `momento`, `ativacao`, `enquanto`, `permanente`, `leitura`, `penalidade`, `contaPeso`, `requerTeste`, `rolar`, `todos`. Desconhecido: FALHA.
- Valor em texto (dados, `+mod.INT`, `-(2d6+2)`) vai para o rolador (M1) ou para "rolei __"; nunca `eval`.
- Mod com status ≠ canônico aparece na conta com selo.

| Tipo | Estado por entrada | Campos que a ficha usa | Mods vêm de |
|---|---|---|---|
| `magia` | `{intensidade?, sustentando?}` | nível 1-5, escola, custoBase, ações, alcance, duração, sustentada, intensidades (Nv1 sem Contida), `stats[].porIntensidade`, custo por turno da sustentada (D16: o da descrição, senão o da canalização) | `regras.magia` |
| `tecnica` / `marca` / `ultimate` | `{usos?:{n, recarga, gastos}, ramo?, tier?}` | classe, grupo, ramo, tier, custoTexto (F1e) | bloco C (P44), não entregue; até lá usos e custo são campo manual |
| `carta` | `{nivelAquisicao, posicaoNaMao, especial?, efeitoAnotado?}` | categoria, `req:[{attr,min}]`, efeito (raras só depois de reveladas, M6) | `derivados.*.modificadores`; a especial dá 2 pontos livres (D13c) |
| `dor` / `beneficio` | `{nivelAquisicao}` | `custo:{dor,sentido}` | — (D12: Abismo aberto a todos) |
| `corrupcao` | `{nivelAquisicao}` | tabela própria do Corrompido (F1b, 15+15) | — (D12) |
| `condicao` | `{x, duracaoTurnosSeus, fonte?}` | grupo, tags, `x{tipo,inicial,decrementa}`, `empilhamento` do contrato (lote D20) | `regras.condicoes[].efeitos`, filtrado pelas 29 de `data/condicoes.json` + Agarrado (D17e); Marcado não vira condição |
| `raca` / `variante` / `subespecie` | `identidade.*`, `{escolhas}` | atributos com "ou", movimento, idiomas, perícias, Ar natural, expectativa de vida, altura, peso, técnica de raça | bloco `raca` (F1b); bloco C |
| `origem` | `identidade.origem`, `{escolhas, itensImportados}` | sins, treinamento, `itensIniciais[]`, técnica de origem | bloco `origem` (F1b) |
| `classe` | `identidade.classe` + `ramos` por tier | V/G/R, CD, atributos-chave, treinamento (fixo + 1+Mod.INT), característica de classe com **medidores** `{id, nome, min, max(fórmula), recarga}` | bloco `classe` (F1b) |
| `item` | entrada `KhInv` + `{equipado, sintonizado, ativo, escolhas, usosGastos, temporarios[]}` | `bazar.json` + `data/efeitos.json` | `data/efeitos.json` |

Soltar raça, origem ou classe fora do assistente preenche a identidade e abre o checklist de escolhas. A ficha **avisa, não bloqueia**.

---

## 5. Módulos

Cada módulo: UX, dados, fase e testes. As fases estão no §7.

### M1 · Página da ficha e Modo Mesa

**UX — página (`pages/ficha.html`).** Espelha a ficha física A4 (`03 §4`) em 5 abas: replicar a estrutura, não a arte. Moldura gótica com raízes (SVG de borda no `partials/glifos.html`, sem imagem raster), títulos em `--font-gothic`, corpo em Crimson Text, rótulos em Cinzel (as três já carregadas pelo Google Fonts).

| Aba | Conteúdo (ficha física → digital) |
|---|---|
| **1. Núcleo** | Nível, XP · Nome, Jogador, Raça, Classe, Origem (por id) · 5 atributos "Atributo / Mod." com a conta (base + nível + cartas + fontes) e o contador "pontos por distribuir" · **24 perícias** em duas colunas, cada uma com 4 círculos +2/+4/+6/+8 (grau 0-4) e caixa de total com a conta; nas 4 duplas `maior` (D7: Movimento, Convencimento, Intimidação, Enganação) um seletor pequeno mostra o atributo usado (padrão `maior`, troca à mão, selo "decisão do Pedro, falta Notion"); Atacar segue a arma (`porArma`) · Recurso de Classe (medidores da classe, Atual/Máx.) · Saúde, Stamina, Éter (Atual/Máx.; Saúde temporária D15; Stamina "comprometida" D19) · Movimento, Sins, Evasão (Passiva e Ativa = Passiva + dado de Defender, D8), CD · Capacidade de Equipamentos (2 + Mod.FOR) e Bugigangas (10 + Mod.FOR) com régua e Sobrepeso · Armadura e Resistências: **14 tipos** (Ordinário expansível em Cortante/Contundente/Perfurante) + Elemental, Biológico, Místico e Todos, cada um com R/I/V/Ae, rótulo na cor do tipo · Imunidade a condição · Idiomas · Marcas da Vhelor (só aparece com ≥ 1, M5) |
| **2. Técnicas & Marcas** | Gerais (a física tem 9 molduras: Nome/Ação/Recurso + texto) · de Ramo: Tier 1 (3), Tier 2 (2), Tier 3 (1), com a cor do ramo · Marcas (3); moldura de tier ou de Marca acima do nível mostra o nível que destrava (D34) · Ultimates · Diversas (9: traços, variante, tecnologias do Autômato, corrupções do Corrompido, técnica de origem). As molduras vazias aparecem como alvo de soltura; o número de molduras não é limite (a contagem "3 + nível" só avisa) |
| **3. Cartas, Lore & Outros** | 11 molduras de carta (4 + 4 + 3) com req ok/aviso, nível e posição na mão; saldo do Limiar = 4×(nível−1) − Σ custo; cartas queimadas por nível (D35, `limiar.queimadas`); Abismo e saldo de Dor (todos); Corrupção (só Corrompido, D12); História; Outros |
| **4. O Bazar** | Componente único do inventário organizado como a página 4 da física: Bugigangas (Nome/Raridade, depois Nome/Ação/Recurso) · Equipamentos: Pesados (2), Leves (3), Armas e Outros (3) · Materiais por raridade com Qtd (vale o catálogo do Bazar, não a lista antiga da física). Sintonizado (máx. 3), Sins editável, Usar/Ativar, munição em uso |
| **5. Grimório** | **5 níveis** (a física tem 4 × 8 fichas): Nome, Ação, Alvo, Resist., Alcance, Duração e texto; intensidade escolhida, custo com a conta (D82; ordem × antes de − com selo), Nv1 sem Contida, Nv5 exige Foco Primordial; aviso de Treinado em Místico + Foco da escola |

A barra do topo tem o **seletor de ficha** (D36, §3.1), **Ficha | Mesa**, Exportar (esta ficha ou todas), Importar, Ajustes (lista de M2), Criar/Subir de nível (M3). O drawer em todas as páginas (D1): docked à direita, 380px (460px a partir de 1800px), empurra o conteúdo, esconde a right-bar; fechado vira trilho de 48px com minirréguas de Saúde/Stamina/Éter; acende em `dragstart`, abre em `dragenter`; mostra o seletor de ficha, resumo, faixa da Mesa e alvo de soltura.

**UX — Modo Mesa.** Visão de jogo, montada a partir do que o personagem tem (Pedro: "modular conforme os itens no seu inventário"). Layout em três faixas:

1. **Topo fixo:** recursos com ± e régua; ações do turno (3 base, com a conta: Atordoado −2, Lento −1, Confuso −1, Lenda Viva +1, alvo `acoes` de itens); reação (1); "magia do turno" (D18: 1 por turno, acende ao conjurar); ações livres sem contador; condições ativas como chips com X e duração em turnos seus; botões de evento: Início do combate, Início do turno, Fim do turno, Fim do combate, **Fim da cena** (executa `eventos.fimCena`, `regras.json:3240-3244`: reseta usos 'cena', zera Instinto, limpa a munição da cena), Descanso curto, Descanso longo, Novo dia.
2. **Ações possíveis** (cartões gerados, agrupados e filtráveis; o cartão some quando a entrada sai da ficha):
   - **Arma equipada:** Atacar com a progressão da PMA ("Atacar (Adaga) +7 = +3 DES +4 prof → 1º +7 · 2º +2 · 3º −3"; linha = total + (i−1)×pma; n = floor(ações / `armas[].acoes`), n com selo); cada ataque é um botão que rola; Dano rola os dados da arma + atributo (crítico: `margemAmeaca` e `multiplicadorCritico`, só no dado usado); munição em uso como contador manual na F5 (a ligação por `compativel`/`municaoAtiva` é da F6). Focos místicos sem linha de ataque.
   - **Consumível:** Usar (custo D18: 1 ação em si, 1 em outro, arremesso segue o item). **Na F5:** baixa 1, rola a cura com dados e mostra o `texto` e os lembretes do `consumo`, com o selo "efeito automático na F6". **Na F6:** o mesmo botão passa a aplicar Mods e condição do bloco `consumo` e abre o pop-up de cura em Autômato (D23).
   - **Magia do grimório:** Conjurar com seletor de intensidade (só as permitidas), custo com a conta, desconta Éter, marca a magia do turno; rola dano/efeito da intensidade; sustentada: 1 ativa (D16), custo por turno cobrado no `inicioTurno`.
   - **Técnica:** Usar com custo e usos (manual até o bloco C, depois automático na F5b).
   - **Perícias:** grade das 24 com botão de rolar cada uma.
   - **Defesa:** "Fui atacado" → Passiva (sem rolagem) ou Ativa (gasta a reação, rola o dado de Defender; vale só contra aquele agressor no turno dele, D8c); "Fui acertado" (Sangramento, Exposto sai, D17a).
   - **Condições:** "Aplicar" com busca nas 29 + Agarrado; o `empilhamento` do contrato vale inteiro (lote D20; selo "decisão do Pedro, falta Notion"): entre condições diferentes as penalidades somam, a mesma condição renova a duração, a mesma condição com X soma X (Sangramento empilha, confirmado pelo Pedro).
3. **Log da sessão** (lateral, em `khalkaria_ficha_v3_sessao:<id>`, um por ficha, §3.1): cada rolagem com expressão, dados individuais e total; cada ação com o que mudou; Desfazer só na ação mais recente ainda desfazível, "desfazer até aqui" (em ordem, com confirmação) nas anteriores, "não desfazível" quando o passo saiu do teto; rolagens são registro, não se desfazem e não invalidam o desfazer. Linha de mesa copiável (`regras.json:3278-3283`).

**Rolador ligado, expressão sempre visível.** Antes de rolar, o botão mostra a expressão ("1d20 + 3 DES + 4 prof · desvantagem (Cego)"); depois, o log mostra "[14, 6] → 6 + 7 = 13" com o dado descartado riscado e "crítico" só se o dado usado cair na margem. Todo botão de rolar tem ao lado "rolei __" para dado físico. Vantagem/desvantagem vem das fontes (condições, itens) com trilha e pode ser forçada à mão. A forma canônica da expressão de teste é a dúvida 6 da rodada 3: até a resposta, a expressão exibida é a do `regras.json` (teste), com selo PENDENTE (balanceamento) só no que ela não cobrir. `KhDados` usa `crypto.getRandomValues`.

**Eventos:**
- `inicioTurno`: tique de Morrendo = floor(0,1 × Saúde máx efetiva), biológico, ignorando Ar, Ae e Resistência (D86); Em Chamas e Envenenamento também no início do turno **do afetado** (D31c; selo "falta Notion" até a rodada 3); `regeneracao.saude`; custo da sustentada; duração das condições em turnos seus.
- "Fui acertado": Sangramento X mostra "+Xd4 biológico" e faz X−1, removendo em 0; num acerto que também aplica Sangramento, **consome antes** (D14a); Exposto é removido (D17a).
- `inicioCombate`: desconta 1 da munição em uso de cada arma de distância equipada.
- `descansoCurto`/`descansoLongo`: recupera primeiro e libera estresse depois, sem opção de pular (D84); curto −1 por 1d6 Stamina + 1d6 Éter; longo tudo; Saúde temporária some no longo (D15); a troca de técnicas reatribuíveis aparece no descanso da dúvida 1 (curto × longo) com selo até a resposta; no longo, oferece o consumo de **1 item de comida** do inventário (`KF.usar`, índice `alimento`) e pergunta pela luz (índice `fonteDeLuz`); sem comida consumida ou sem luz, aplica **+1 em Desnutrido X** (`porNoite`, `regras.json:2828`; acumula por dia, D17). Como o Desnutrido **diminui** não tem regra (`decrementa: null`, pendência n=10 em `:3349`): só lembrete, sem decremento automático, até a resposta (§8).
- `fimCena`: executa a lista do contrato (usos 'cena', Instinto a 0, munição da cena).
- Exaurido/Oco saem ao deixar os negativos (D17c); se Stamina pode ficar negativa é rodada 4.

**Automático × lembrete:** automático com trilha: modificadores, máximos, Evasão, CD, Ar/Ae, capacidade, Movimento, **condições nos números** (D9, exceto as de julgamento do mestre, `regras.json:3190`), custo de magia, efeitos de item pelo `quando`, `pma −2` da `artilheiro-maos-velozes`, progressão como display. Botão: recurso de classe, aplicar/remover condição, as outras 11 fontes de pma, consumível. Nunca automático: estados finais (morte, Sucumbência da Vhelor): só alerta.

**Dados:** `sessao:{modo, turno, acoesGastas, reacaoGasta, magiaDoTurno, sustentando, agressorAtual, log:[{t, tipo:'rolagem'|'acao', texto, expressao?, dados?, total?, passo?}] (teto 200)}` na chave `khalkaria_ficha_v3_sessao:<id>` da ficha, fora dela e fora do `rev` (§3.1); vai no `estadoSessao` do export nativo, nunca no Bestiário (D5b).

**Fase:** página e abas na F4; Mesa na F5; rolador puro na F2.

**Testes:** snapshot de estrutura das 5 abas (campos da física presentes por conjunto); `KhDados` com semente (4d6dl1, kh1/kl1, crítico só no dado usado, V+D = normal); cartões da Mesa gerados de um inventário fixture (arma, consumível, magia, técnica) e sumindo ao remover a entrada; a 2ª conjuração no mesmo turno mostra aviso (D18) e registra no log, **sem bloquear**; Ativa só contra o agressor atual; Sangramento com consumo antes da aplicação; empilhamento (mesma com X soma X, sem X renova duração); Morrendo ignorando Ar/Ae/R; descanso sem pular estresse; descanso longo sem comida → Desnutrido +1, com comida consumida → baixa 1 do item e nada; `fimCena` zera o Instinto; log/desfazer multi-parte; rolar e depois desfazer a ação anterior funciona; desfazer fora de ordem é recusado; a sessão sobrevive a reload e troca de página, e é separada por ficha (trocar de ficha troca o log e o turno); rodada simulada completa **só com arma e magia** até a F6 (atacar com progressão, conjurar, ser acertado com Sangramento, Morrendo no início do turno, fim da cena, fim do combate, descanso curto).

### M2 · Edição manual de todo campo

**Tooltip de fórmula (pedido do Pedro, 2026-09-26: "quero tudo que tenha cálculos com tooltip mostrando a fórmula").** Todo número calculado, na ficha **e no resto do site**, tem um tooltip com a fórmula em duas linhas: a simbólica e a mesma com os números, terminando no resultado (ex.: "Saúde máx. = 10 + Vitalidade × Nível + Mod.CON × Nível" / "= 10 + 6 × 3 + 2 × 3 = 34"). Termo com ajuste manual, condição ou item aparece com a fonte ("+2 Mochila Reforçada", "−2 Desorientado") e o selo de status quando não é canônico. Abre no hover e no foco de teclado (`aria-describedby`), no mesmo componente "conta" da F2 (`componentes.css` + `KhPrever`). Vale para: atributos e modificadores, perícias, máximos, Evasão, CD, Movimento, Ar/Ae, carga e capacidade (inclusive o inventário do Bazar), custo de magia por intensidade, linha de ataque e progressão da PMA, dano, pontos do Limiar; nas páginas de regra, os `.formula-card` das classes e as tabelas de Status ganham o mesmo tooltip quando mostram conta. Teste: todo nó derivado do `KhRegras` produz texto de fórmula não vazio.

**UX.** Todo número da ficha é editável, em dois regimes:
- **(a) Campos derivados** (atributo total, total de perícia, recursos **máximos**, Evasão Passiva e Ativa, CD, Movimento, Ar/Ae/R/I/V, capacidade, custo de magia, ações do turno, linha de ataque, dano) recebem **ajuste**, descrito abaixo.
- **(b) Campos de estado** (recursos **atuais**, Saúde temporária, base de atributo, grau de perícia, Sins, Marcas da Vhelor, usos gastos, X de condição) são **edição direta** via `commit`, com passo de desfazer e **sem** `ajustes`: dano, cura e descanso da Mesa continuam agindo sobre eles.

Nos derivados, o pop-over da conta mostra os termos e um campo "Ajustar": digitar um valor cria o ajuste. O campo passa a mostrar "**16** · calculado 14 · ajustado" com um fio de cor e o selo "ajuste"; o pop-over mostra a conta inteira e o termo final "ajuste manual: +2 (motivo)". Opções no ajuste: **Valor fixo** (padrão: vira o número digitado) ou **Diferença** (+2 sobre o calculado, que continua acompanhando o nível); **Motivo** (opcional); **Temporário** com fim em `fimTurno | fimCombate | descansoCurto | descansoLongo | manual`; **Remover** (×). Se o calculado mudar depois de um ajuste fixo, o chip avisa "o calculado mudou de 14 para 15". A tela **Ajustes** lista todos, com calculado × ajustado, motivo, data e fim, e remove em lote. Campos de texto (nome, história) já são livres e não entram aqui.

**Dados.** `ajustes: {"<caminho>": {modo:'fixa'|'soma', valor, motivo?, temporario:false|{fim}, criadoEm, rev, calculadoEm}}`, com caminhos **derivados** do namespace do site (`recurso.saude.max`, `pericia.atacar.total`, `evasao.ativa`, `magia.<id>.custo`…); `recurso.*.atual` e os demais caminhos de estado ficam fora do namespace de ajuste e o validador do schema v3 recusa ajuste neles. **Aplicação por nó:** o `KhRegras` avalia o grafo em ordem topológica e, ao fechar cada caminho, chama `KhAjustes.aplicar(caminho, valorCalculado)` antes que os dependentes o leiam; o ajuste é o último termo daquele nó e se propaga (ajustar Mod.DES muda Evasão e perícias de DES; ajustar Saúde máx. muda o tique de Morrendo e a régua; ajustar Atacar muda a linha da PMA). Cada nó devolve `{valor, calculado, ajuste, termos}`. Ajuste é Mod com `fonte:{tipo:'ajuste'}`: entra no desfazer, vai no export nativo e o export Bestiário usa o valor ajustado. A migração v2→v3 transforma `derivadosManuais` em ajustes fixos só onde o valor difere do default de `novaFicha` **e** do calculado.

**Fase:** modelo e aplicação na F3, coberto só por teste (`KhAjustes` puro, sem UI: o modo sombra é só-leitura); UI na F4; ajustes temporários expiram pelos eventos da F5.

**Testes:** fixo e diferença em cada família de campo derivado; ajuste em atributo muda a Evasão e as perícias do atributo; ajuste em Saúde máx. muda o tique de Morrendo; ajuste em Atacar muda a progressão da PMA; ajuste em `recurso.saude.atual` é recusado pelo validador; editar Saúde atual e tomar dano reduz normalmente; conta mostra calculado e ajustado; temporário some no evento certo e volta com desfazer; aviso quando o calculado muda; export nativo com ajustes → import idêntico; Bestiário usa o ajustado; migração de `derivadosManuais` (só os que diferem).

### M3 · Assistente de criação e subida de nível

**UX — criação** (`pages/ficha.html#criar`; a página Criação vira a porta). Stepper no topo com os 6 passos sempre clicáveis; voltar a qualquer passo a qualquer momento. Rascunho salvo a cada mudança, com **"Baixar rascunho" / "Importar rascunho"** (`.khalkaria-rascunho.json`; o localStorage não é o único meio, CLAUDE.md §10); nada toca as fichas até "Criar". "Criar" sempre cria uma ficha **nova** no índice e a torna a ativa (D36); as fichas que já existem ficam intactas.

1. **Atributos.** Rolador: "Rolar 4d6" ×5, mostrando os 4 dados e o menor riscado; soma < 8 **rola de novo sozinha** (a rolagem descartada fica visível, D30). Ou entrada manual dos 5 valores ("rolei na mesa"), com aviso fora de 8–18. **Rolagens imutáveis no rascunho:** voltar ao passo 1 permite redistribuir e mover o ponto, não rolar de novo. "Recomeçar rolagens" existe (não bloqueia), fica em `rolagens[].descartadaEm` e vai para `historicoNivel[0]` da ficha criada, para o mestre ver. Distribuir os 5 valores nos 5 atributos (arrastar ou selecionar). Depois, "mover 1 ponto" de um atributo para outro (uma vez, desfazível). Modificadores ao vivo. Se o ponto movido passar de 18 ou cair abaixo de 8: aviso (faixa depois de mover: dúvida 5, a única parte dela ainda aberta).
2. **Raça.** 7 cartões com o stat-box; ao escolher: variante/subespécie, atributos com "ou", movimento, perícias (com escolha quando houver), expectativa de vida, altura, peso, características e 1 técnica de raça. Corrompido: tabela de corrupção própria (D12).
3. **Classe** ("bem RPG, building style"). Visão das 7 com **V/G/R** como três barras comparáveis e o recurso de classe. Na classe escolhida, subpassos: Treinamento (armas, perícias fixas + escolhas 1 + Mod.INT) · CD · **Característica de classe** com os medidores (FLUXO, Instinto, Brutalidade…) mostrados como medidor · Técnicas gerais: **4 no nível 1** (`regras.progressao.porNivel`, teto com aviso, sem bloquear) · **Tela por ramo**: os 3 ramos lado a lado, cada coluna com a estética do ramo (cor, glifo, textura do M7); os 3 tiers e as Marcas aparecem **à vista e travados** já no nível 1 (D34), cada cartão com o nível que destrava (T1 nv2, Marca nv3, T2 e 2ª Marca nv4, T3 e 3ª Marca nv5), para o jogador ler e planejar o personagem. Na criação nada deles se escolhe: vale o contrato (nv1 sem tier e sem Marca) e as escolhas acontecem na subida de nível, onde a mesma tela destrava o que o nível libera e vira seletora, com a contagem "escolhidas n de m". Fora do assistente, levar à ficha uma técnica de tier ou uma Marca acima do nível só avisa (`validacoes.tiers`/`marcas` = avisar, sem bloquear) · **Escolas e Magias** (Teurgo e Alquimista): Teurgo escolhe **2 escolas** e "1 + MOD. INT ou SAB magias de nível 1" (`teurgo.template.html:681-683`); Alquimista "1 + Mod.Int (mín. 1) do seu nível-1 ou menor" (`data/classes/alquimista.json`). Contagens lidas do bloco `classe` (F1b); o que o dado não fechar sai com selo PENDENTE (balanceamento, rodada 4).
4. **Origem.** 19 cartões; itens iniciais (importados para o inventário com um clique, listados antes), técnica de origem, treinamento, Sins.
5. **Detalhes.** Nome, jogador, história, idiomas.
6. **Revisão.** A ficha pronta em modo leitura com todas as contas e a lista de avisos; "Criar ficha".

Sem Limiar no nível 1 (o Pedro reforçou; a 1ª mão abre no nível 2). A nota dele sobre o Limiar "só a partir do nível 2" falava das cartas (D35): "era cuidado com as draw de cartas do limiar, isso só acontece a partir do nível 2, toda mão você tem 1 carta grátis e pode gastar pontos do limiar ou queimar 1 carta, conforme as regras no notion." O assistente de criação não tem passo de carta; a mão, a compra e a queima entram na subida de nível (abaixo). As 4 técnicas gerais do nv1 continuam as do contrato.

Mudar um passo anterior não apaga os seguintes: escolhas que ficaram inválidas (técnica de outra classe, perícia que a nova raça já dá) viram lista "rever" com botão de descartar.

**UX — subida de nível** (botão "Subir de nível", níveis 2–5): (1) **+2 pontos de atributo**, repartidos entre até dois atributos; (2) **mão do Limiar**: o jogador registra as 5 cartas que tirou na mesa (busca ou arrastar da página do Limiar; **sem sorteio**) e a carta especial +2 Atributo; toda mão tem **1 carta grátis** e o resto se compra com pontos do Limiar (D35), na ordem que quiser, com os custos da mão (grátis, 2, 3, 4, 5; a especial **sempre** 2 e só 1 por mão, D13), saldo com os +4 pontos e os acumulados; **queimar 1 carta por mão** (D35; `templates/limiar.template.html:717`: a queimada "nunca mais volta"): o jogador marca a queimada, a ficha a guarda em `limiar.queimadas` e **avisa** se ela for registrada de novo numa mão seguinte ou se houver 2 queimadas na mesma mão (aviso, sem trava); Abismo disponível; (3) **técnicas**: +1 pela conta "3 + nível"; a tela por ramo destrava o tier e as Marcas que a tabela `porNivel` libera (T1 nv2, Marca nv3, T2 e 2ª Marca nv4, T3 e 3ª Marca nv5, D34) e é nela que se escolhe, com aviso e sem bloqueio; troca de reatribuíveis (dúvida 1); **magias**: Alquimista +1 por nível (`alquimista.json`); Teurgo com as escolas 2/3/5 (+1 escola no nv3, +2 no nv5) e as magias por nível que o dado trouxer (lacuna: PENDENTE (balanceamento), rodada 4); (4) revisão com os máximos novos (V/G/R × nível) e as contas.

A subida tem **rascunho próprio**, como a criação, um por ficha: `khalkaria_nivel_rascunho:<id>` com `{deNivel, paraNivel, atributos, mao:[…], compras:[…], queimada?, tecnicas, marcas, magias}`; nada toca a ficha até "Confirmar". Aí um único `lote` (um passo de desfazer, rótulo "Subida 1→2") grava tudo e acrescenta uma entrada em `historicoNivel`. Sair da página no meio retoma o rascunho.

**Dados.** `rascunhoCriacao` na chave `khalkaria_criacao_rascunho` (exportável e importável; a ficha criada é que vai no export da ficha) com `{passo, rolagens:[{dados, descartado, soma, rerolada, descartadaEm?}], atributosBase, pontoMovido, raca:{id, escolhas}, classe:{id, treinamento, tecnicas:{geral:[]}, escolas:[], magias:[]}, origem:{id, itens}, detalhes}` (sem tier nem Marca: D34). "Criar" grava a ficha numa chave própria e acrescenta a linha dela no índice (D36). Na ficha: `atributos.base`, `atributos.porNivel {n:{attr:pts}}`, `cartas[].{nivelAquisicao, posicaoNaMao, especial}`, `limiar.queimadas:[{id, nivel}]` (D35), `historicoNivel[]` (a entrada 0 leva as rolagens, inclusive as recomeçadas). Contagens lidas de `regras.progressao` (`porNivel`, `tecnicasFormula`, `validacoes`, `checklistDeNivel`) pelo `00-regras-dados.js`, sem arquivo à parte; o que o contrato não cobre (faixa depois de mover 1 ponto, magias do Teurgo por nível) sai com selo PENDENTE (balanceamento).

**Fase:** F4c.

**Testes:** rolador 4d6dl1 com semente, rerola < 8; voltar ao passo 1 não rerola; "recomeçar rolagens" fica no `historicoNivel[0]` exportado; rascunho exportado e reimportado dá o mesmo estado; manual fora de 8–18 avisa; mover 1 ponto e desfazer; voltar do passo 4 ao 1 preserva raça/classe/origem; nível 1 com 5 técnicas gerais avisa e não bloqueia; no passo de classe os 3 tiers e as Marcas aparecem travados, cada um com o nível que destrava, e não entram no rascunho (D34); Tier 1 levado por fora do assistente a uma ficha nível 1 avisa e não bloqueia; Teurgo com 1 + Mod de magias e 2 escolas; trocar classe gera a lista "rever"; itens de origem importados por id; nenhuma carta no nível 1; criar com fichas já existentes acrescenta uma ficha ao índice, a torna ativa e não toca as outras (D36); subida de nível: +2 em até dois atributos, 1 carta grátis por mão, especial custa 2 mesmo sendo a 1ª e a 2ª especial na mesma mão avisa, saldo do Limiar por mão; queimar 1 carta vai para `limiar.queimadas`, e registrar de novo uma queimada ou queimar 2 na mesma mão avisa e não bloqueia (D35); subida 2 destrava Tier 1 na tela do ramo, subida 3 destrava 1 Marca; navegar no meio da subida e voltar retoma o rascunho daquela ficha; trocar de ficha no meio da subida não mistura os rascunhos; confirmar e desfazer volta ao nível anterior inteiro; ficha criada exporta e reimporta igual.

### M4 · Bazar com a ficha aberta

**UX.** Com a ficha aberta em `bazar.html`, a página entra em `html[data-modo=ficha]`: o painel de inventário da direita sai (o mesmo inventário passa para o drawer, D2) e o registro ganha a largura (cerca de 785px em 1366). O drawer abre direto na aba **O Bazar**, organizada como a página 4 da física (Bugigangas; Pesados 2, Leves 3, Armas e Outros 3; Materiais por raridade), com as réguas de carga no topo. Cada cartão do registro mostra "na ficha ×n" e, para equipamento, a **comparação com o equipado** (Ar, Ae, dano, peso: "+1 Ar · +1 peso"). Filtros extras só nesse modo: "cabe na minha carga", "posso usar" (requisito/treino, aviso), "do meu Ofício" (Ferraria, Engenharia, Alquimia). Arrastar o cartão para uma moldura do drawer já equipa naquele slot. Preço só informativo; Sins não trava.

**Dados.** Nada novo: `KF.inventario()`, `KF.carga()`, `KF.derivados()` e `data/efeitos.json`; o modo é `html[data-modo]` aplicado pelo head-boot, sem salto de layout.

**Fase:** F4b (a comparação de Ar/Ae completa depende da F6; antes, só peso e slot).

**Testes:** o painel da direita não renderiza no modo ficha e volta ao fechar; os filtros novos por fixture; arrastar para "Leves" com 3 ocupados avisa (não bloqueia); par `antes/depois` de estilo do Bazar nos dois modos (portão manual da F1c); `bazar-*.test.js` verdes.

### M5 · Marcas da Vhelor (D26a)

**UX.** Contador "Marcas da Vhelor n/7" no Núcleo, visível a partir de 1, editável à mão (M2). Ao **consumir** um item que dá Marca (`KF.usar`), abre por cima de tudo a **tela corrompida**: fundo quase preto, raízes saturadas em alto contraste invadindo das bordas (SVG, cor saturada da Vhelor, sem imagem raster), a marca nova em destaque com número e texto e as anteriores esmaecidas abaixo. Fecha com Esc, Enter ou clique; foco preso no diálogo; com `prefers-reduced-motion` as raízes aparecem sem crescer. A tela também abre pelo contador ("ver marcas"). A marca 7 (Sucumbência) mostra alerta de estado final e nada automático.

**Dados.** `data/vhelor.json` (fonte única; mudar o texto não mexe em código):

```json
{"schemaVersion":"vhelor/1","fonte":{"notion":"Substâncias da Grande Árvore (UUID)","buscadoEm":"…","conferidoCom":"03 §3.1"},
 "regra":"Cada folha, seiva ou casca consumida adiciona 1 Marca da Vhelor. As Marcas se acumulam e não regridem facilmente.",
 "marcas":[{"n":1,"texto":"…verbatim…","mods":[],"lembretes":["detectável por cultistas"]},
           {"n":2,"texto":"…","mods":[{"alvo":"recurso.eter.max","op":"soma","valor":-10,"quando":"permanente"}]}, "…"]}
```

**Fonte: o Notion**, página "Substâncias da Grande Árvore" (o CSV aponta para ela: Folha Amarela "ver Substâncias da Grande Árvore"), por `notion-fetch` com UUID; texto verbatim dela, conferido contra o `03 §3.1`. Divergência entre os dois é sinalizada ao Pedro **antes** de escrever o JSON. Mods só onde o texto é número de campo: marca 2 (−10 Éter máx.); marca 3 (abstinência: −2 em todas as rolagens + Desorientado) como condição que o jogador liga e desliga; marca 4 (−5 em interações sociais) com as perícias "sociais" **PENDENTE (balanceamento)**; as demais são lembrete. O CSV canônico já diz quais itens mexem no contador: os que "Adiciona[m] 1 Marca da Vhelor" (Folha Amarela e demais) e o **Elixir da Expurgação**, "Remove 1 Marca da Vhelor. Não funciona acima da Marca 4." (−1, só até a Marca 4; canônico). Da rodada 3 fica esperando só a **ligação item → Mod** (`consumo.efeito` com alvo `vhelor.marcas`); até lá o contador é manual. Na ficha: `vhelor:{marcas:n, abstinente:bool}`; cada Marca entra como fonte `{tipo:'vhelor', n}` no `KhEfeitos`.

**Fase:** contador manual e tela na F6; ligação automática ao consumo quando a rodada 3 entregar os Mods.

**Testes:** `[vhelor]` no `validar.py` (7 marcas, n 1–7 sem buraco, texto não vazio, Mods no vocabulário); consumir item fixture → n+1, tela abre com a marca n, desfazer volta n e fecha; Elixir da Expurgação com n ≤ 4 → n−1, com n ≥ 5 → aviso e nada muda; marca 2 aparece na conta do Éter máx. com a fonte "Marca da Vhelor 2"; trocar o texto no JSON muda a tela sem mudar JS; reduced-motion sem animação.

### M6 · Cartas raras ocultas no site (D11, D33)

**Escopo: oculto só no site** (D33). Os efeitos das raras já estão em branches públicas do `origin` (§9: `obsidian/Khalkaria/Sistema/O Limiar (cartas).md` em `3d6a01d` e `docs/memoria/digests/D_limiar.md` em `8d3b613`, ambos em `origin/claude/khalkaria-rpg-setup-mbg6ws`; o contrato rev. 2 em `4cf6af2`, `origin/claude/khalkaria-bazar-balance-lsdfic`), e o Pedro decidiu deixar as branches como estão: ninguém apaga branch nem reescreve histórico. O GitHub Pages só serve a `main`, então o que o M6 garante é que as páginas e o JSON do site ficam sem efeito de rara até o `tools/revelar_carta.py` revelar a carta.

**Dados e fluxo.**
- `privado/limiar-raras.json`, **gitignored** (`privado/` no `.gitignore`), preenchido do Notion por `tools/extrair_raras.py` a partir do snapshot da página do Limiar (`3a66e3a4-01d9-806d-b1f8-d6975255f676`) em `notion_cache/` (já gitignored): `{fonte:{pagina, buscadoEm}, cartas:{"limiar-carne-e-aco":{nome, req, efeito:"verbatim"}}}`, as 59 por conjunto contra `data/limiar.json`. Carta sem efeito no Notion fica listada como lacuna, nunca preenchida.
- `tools/revelar_carta.py <id> [--jogador NOME]`: confere que o id é rara, existe no privado e não foi revelada; copia **só aquele** `efeito` verbatim para a carta em `data/limiar.json` com `revelada:{em:"AAAA-MM-DD", jogador?}`; roda `python tools/build.py`. **Não commita sozinho**, mas o Pedro disse "rodar e comitar": o commit é passo explícito da saída do script, que termina imprimindo o `git add data/limiar.json pages/limiar.html …` e o `git commit -m "Revela a carta rara X"` prontos para colar (o Pedro ou o agente roda).
- O `tools/sync_notion.py` nunca escreve efeito de rara em `data/`.
- **Contrato e efeitos do balanceamento** (F1d): o `gerar_regras_ficha.py` e o `gerar_efeitos.py` descartam toda entrada `rara:true` (hoje Rajada Perfeita, Carnificina e Lâminas Dançantes, `regras.json:1020-1035`) e toda nota cuja fonte seja rara não revelada (a da Sangria Precisa em `:1616`). O que vai para `data/balanceamento/` é **projeção filtrada**; o verbatim fica em `privado/balanceamento/` (gitignored). Com a revelação, a entrada daquela carta passa a entrar.

**UX.** Na ficha e na página do Limiar, rara não revelada mostra ícone + requisito + nome; na ficha, com o campo livre "efeito anotado" (local, vai no export nativo). **Revelada mostra o efeito, com o selo "revelada", nas duas** (D11: "oculto até o script rodar e comitar").

**Checagem `[raras]`** no `validar.py`:
1. Sem depender do privado (vale para o agente do balanceamento e os da nuvem): FALHA para qualquer `rara:true` ou fonte `limiar-<rara>` sem `revelada.em` em arquivo rastreado; carta rara com `efeito` exige `revelada.em`; `git ls-files privado/` vazio.
2. Com o privado local: nenhum `efeito` de rara não revelada em arquivo rastreado (`data/`, `pages/`, `js/`, `docs/`).
3. Branches: `git grep -F <efeito> $(git for-each-ref --format='%(refname)' refs/heads refs/remotes)` dá **AVISO** com a ref, nunca FALHA (D33: as branches ficam como estão; o aviso só registra onde o texto está).

**Fase:** F1f (independente; só precisa do snapshot do Notion).

**Testes:** revelar um id fixture altera só aquela carta (diff de conjunto do JSON = 1 chave); revelar de novo falha; id não raro falha; `[raras]` falha com efeito sem `revelada`, com `rara:true` num JSON rastreado, com arquivo em `privado/` rastreado e com texto do privado em `pages/`; avisa, sem falhar, com texto do privado numa branch remota; a projeção de `data/balanceamento/regras.json` não tem `rara:true`; revelar uma carta faz a página do Limiar mostrar o efeito dela e só dela.

### M7 · Páginas de classe (D27) e lei de cor (D28)

**UX — página de classe** (template único dirigido pelo dado, `templates/classe.template.html`, texto do Pedro no `03 §3.2`):
1. **Header:** imagem da classe (`images/<classe>.webp`) e a descrição estética, título em fonte display "bem punk".
2. **Informações básicas:** V/G/R (as barras do M3), CD, treinamento, recurso, Evasão (D8), perícias iniciais, tudo do bloco `classe` (F1b).
3. **Transição de cor** (a página transiciona para `--classe-<c>`): técnicas gerais e característica de classe (medidores).
4. **Marcas.**
5. **Os 3 ramos em 3 colunas**, cada uma com `--ramo-<c>-<r>`, glifo e textura do ramo; cards repaginados (nome, tier, ação, recurso, texto), cada um com `.ent-add`/alça e o estado "na ficha". Abaixo de 1100px as colunas empilham.

A mesma estética de ramo serve à tela por ramo do M3 (travada na criação, seletora na subida, D34).

**Dados.** `data/classes/<c>.json` ganha `estetica:{cor, imagem, descricao}` e `ramos:[{id, nome, estetica:{cor, glifo, textura}}]`. A descrição estética e a identidade visual de cada ramo são **adição criativa**: proposta numa página de prova com as 7 classes e os 21 ramos, aprovada pelo Pedro antes de entrar no dado. A fonte do título também vai na prova: 2–3 candidatas do Google Fonts (ex.: Metal Mania, New Rocker, Pirata One) contra a `--font-gothic` atual.

**Lei de cor (D28), nos quatro pontos:** paleta única de recursos por token (`--recurso-saude/stamina/eter`: Saúde vermelho, Stamina amarelo, Éter verde e roxo: resposta do Pedro, que vale sobre a ficha física e sobre o rótulo original da D28); `--text-muted` #8a8580 (AA); cores de tipo de dano e de raridade por token em todo o site; **a animação do Limiar fica** (pode melhorar, respeitando `prefers-reduced-motion`), o resto do site se alinha a ela. Hoje há 3 verdes/âmbares diferentes para Stamina (`style.css:565` #22c55e, `:1471` #fbbf24): tudo passa a ler o token.

**Fase:** tokens na F1c; página de classe na F7 (família Classes); prova de estética antes.

**Testes:** round-trip byte a byte do conteúdo das 7 classes; set-diff de técnicas por página = ∅; `[conteudo×contrato]` sem erro novo; par `antes/depois` de estilo por classe (portão manual da F1c); nenhum hex de recurso fora de `tokens.css` (grep no build); Limiar com animação e sem ela em reduced-motion.

---

## 6. Refino das páginas (por família)

| Família | Muda |
|---|---|
| **Bazar (referência)** | F0: `ESPERADO['empilhavel']` 85 com AVISO nominal (sobe para 87 quando o Pedro editar o CSV, D26b). F2: extrai `KhFiltros`, `KhBusca`, `KhPainel`; consome `kh-ui.js`, `componentes.css`, tokens; somem as duplicatas; para de ler `window.KhInv`. F4b: modo ficha (M4). F6: pop-up e receita exibem Mods e lembretes de `data/efeitos.json` |
| **Magias** | `data-kf-*` + `id`; `<button>` nos disclosures; filtros em trilha (nível, escola, ação, sustentada, trade-off), glifo de escola, hover de condição, estado "no grimório". CSS inline → `paginas/magias.css`. Texto de custo pelo bloco "Custo mínimo" (F0) |
| **Condições** | Botão "Aplicar"; índice gerado; efeitos, X e tags do contrato por id; Agarrado promovido quando a rodada 3 gravar (D17e); `KhPrever` de condição no site todo. Sangramento segue o Notion até a gravação da D83 |
| **Limiar** | `data-kf-*` (`carta-*`/`dor-*` → `limiar-*`/`abismo-*`); `req`/`custo` estruturados (F1e); glifo por categoria (D29); contagens e regras de pontos geradas; texto "4–12" (D13b, após o Notion); filtro "elegível com meus atributos" (avisa); desambiguar "Devorador de Almas"; **animação mantida** (D28); raras reveladas (M6); estado "queimada" nas cartas que a ficha ativa queimou (D35), ao lado da regra de queimar que a página já tem (`limiar.template.html:717`) |
| **Sistema** | F0: sync (D80–D82, Evasão Ativa, custo mínimo). **Sync próprio logo depois da F0** (sem pisar no agente da F0): a manobra **Investida** do Notion (D21, já gravada pelo Pedro) em `data/sistema.json`, junto de Empurrar, Desarmar e Agarrar, verbatim; o lembrete das Grevas Trovejantes passa a apontar para ela. F7: busca no índice, hover de condição, só o acionável é levável. HTML cru no JSON: por último |
| **Classes (7)** | M7 |
| **Raças (7 + índice)** | Bloco `raca` (F1b); card do índice gerado do stat-box; ids raciais na convenção; Corrompido com a tabela de corrupção levável |
| **Origens** | Bloco `origem` (F1b); colisão `academico-2`; 19 `onclick` e 97 emoji; `bazar.html?item=Nome` (25 mortos) → `#item/<id>` resolvido no build |
| **criacao / index / classes.html** | Gerados. Correções factuais na F0 (19 origens, 100 magias em 5 níveis, método 4d6 com rerolagem < 8 e faixa 8–18, +2 por nível, técnicas 3+nível, +4 Pontos do Limiar por nível, recursos, ramos do Alquimista). A Criação vira porta do assistente (M3) |

---

## 7. Fases de entrega

Regra geral: cada fase é publicável sozinha, com `python tools/build.py` verde, todos os testes verdes (95 hoje, mais os novos), push e conferência no GitHub Pages. Commits atômicos; gerador e conteúdo em commits separados. **Reverter o deploy de qualquer fase não pode perder edição nem deixar ficha em só-leitura; a reversão é testada antes do push.** Na F4 isso exige **escrita dupla** (ver F4). Termo que depende da rodada 3 ou 4 sai com selo e não trava a fase.

| Fase | Resumo | Depende de fase | Depende de resposta |
|---|---|---|---|
| F0 | **Em andamento.** Guarda v2.1, sync do Sistema, correções | — | — |
| F1a | Marcação e catálogo, sem CSS | F0 | — |
| F1b | Conteúdo estruturado de classe/raça/origem | F0 | — |
| F1c | Tokens + `@layer` + reduced-motion/foco | F0 | — |
| F1d | Efeitos compilados (só dado), projeção sem raras | F0 | — (Mods da Vhelor quando a rodada 3 entregar) |
| F1e | Normalização de dado | F0 | — |
| F1f | Raras ocultas no site (M6) | F0 | — |
| F2 | Modularização, `componentes.css`, `kh-ui.js`, `KhDados` | F1a, F1c | — |
| F3 | Estado v3, motor e ajustes (M2), armazenamento por ficha (D36), em modo sombra | F1b, F1e, F2 | — |
| F4 | Página da ficha (M1, abas), drawer, seletor de fichas (D36), protocolo, UI de ajuste, migração real | F1a, F3 | — |
| F4b | Bazar com a ficha aberta (M4) | F4 | — |
| F4c | Assistente de criação e subida de nível (M3) | F4 | rodada 3, dúvidas 1 e 5 (faixa); rodada 4 (magias do Teurgo); tudo sai com selo |
| F5 | Modo Mesa (M1): Usar consumível só baixa, rola e mostra o texto | F4, F1d | rodada 3 (tique D31, D17); D17(b) com selo |
| F5b | Usos de técnica automáticos | F5 | bloco C |
| F6 | Efeitos de itens + Marcas da Vhelor (M5); estende o botão Usar da F5, se ele existir | F4, F1d | rodada 3 (D26a) para ligar a Marca ao consumo |
| F7 | Refino por família, páginas de classe (M7), lei de cor | F1a, F1b, F1c, F1e, F2; interativos depois da F4/F5 | aprovação da prova de estética (M7) |

F1a–F1f correm em paralelo. F4b, F4c, F5 e F6 correm em paralelo depois da F4. F7 corre em paralelo a F3–F6.

### F0 · Correções, guarda e sync (v2.1) — em andamento

**Entrega** (outro agente): guarda contra aba velha (marcador `khalkaria_ficha_dono`, só-leitura com "Baixar ficha v3" e "Voltar a usar a v2"; `importJSON` recusa `>= 3`); sync do Sistema (3 blocos D80–D82, Evasão Ativa "Passiva + dado de Defender", custo mínimo); Religião → SAB; hotfix do `MAPA`; schema v2 mínimo; export Bestiário com `prof_*` em grau (D5a) e `atributo:''` sem fonte; `KhInv` por `inv.empilhavel`; índices de Condições e Sistema gerados; ids do Espadachim e do Monge; fatos das páginas manuais (inclui `index.html:158` 8–20 → 8–18, D30); Evasão nas 7 classes (D8b). **Sem `_config.yml`** (D32). Em commit próprio, junto: CLAUDE.md nos três pontos da D6.
**Pronto quando:** nada visual muda além das correções; a v2.1 está no ar antes de qualquer v3.
**Testes:** carga/ficha-estado/export verdes; recusa de import `3.0`; só-leitura com o marcador (load e evento) e volta ao apagá-lo; empilháveis 85 por conjunto + 2 pendentes contra o índice do balanceamento (87); build falha se `sistema.json` não tiver os 3 blocos; export com `prof_*` em grau (0-4).

### F1a · Marcação e catálogo (sem CSS)

**Entrega:** `data-kf-tipo/-id`, `data-prever`, `<button class="ent-add" hidden>` em todos os geradores; `.ent-alca`; `textoLimpo` ignora `.ent-add`; sprite `partials/glifos.html` (inclui moldura de raízes e glifos de ramo, inertes); `gerar_catalogo.py` (nome sem emoji, `icone`, D29); `tools/alias_ids.json`; checagens `[ids]`, `[fragmentos]`, `[glifos]`.
**Pronto quando:** diff de CSS = 0; `data-kf-id` 100% contra o JSON; nenhum `nome` com emoji; o nome levado pela v2 a partir de um card novo é igual ao de antes.
**Testes:** `[ids]`/`[fragmentos]`/`[glifos]`; `textoLimpo` com `.ent-add`; emoji no catálogo.

### F1b · Conteúdo estruturado (sem visual)

**Entrega:** extração por script, verbatim, para `data/`: bloco `classe` (V/G/R, CD, treinamento, recurso, **medidores** da característica de classe, features, os 94 Itens Alquímicos, ramos com id); bloco `raca` (atributos com "ou", movimento, idiomas, perícias, variantes, Ar natural, expectativa de vida, altura, peso, técnica de raça, limite do Autômato, os 15+15 do Corrompido com id); bloco `origem` (sins, treinamento, `itensIniciais`, técnica). Os templates leem esses blocos. `[conteudo×contrato]`.
**Pronto quando:** round-trip byte a byte das 20 páginas; set-diff de entidades = ∅; divergências contra o contrato como AVISO, nunca corrigidas.
**Testes:** round-trip; set-diff; `Counter` de duplicatas.

### F1c · Cascata (tokens + `@layer`)

**Entrega:** tokens promovidos (`--recurso-*` já com a paleta da D28; `--classe-*` e `--ramo-*` com os valores de hoje), `@layer`, reduced-motion e foco globais, escala de z-index. As páginas continuam lendo o hex de hoje; passam a ler `--recurso-*` família a família na F7, por isso o diff da F1c continua 0.
**Pronto quando:** diff do `getComputedStyle` nas 24 páginas = 0 fora de `tools/estilo/revisado.json`; os 16 `!important` do `bazar.css` e os 2 do `style.css` revistos.
**Portão manual com artefato** (o build não tem motor de CSS e não gera o estado atual): `tools/estilo/captura.js` roda no painel do navegador **antes e depois** da mudança e grava `tools/testes/estilo/<pagina>.<estado>.{antes,depois}.json` (1366 e 1920 px; drawer fechado/trilho/aberto; hover e foco forçados; disclosures; reduced-motion). `tools/estilo/diff.py`, no build, compara o par e FALHA se houver diff fora de `revisado.json`. A fase só fecha com o par `depois` commitado no mesmo commit do CSS; commit que mexe em `css/**` sem par novo FALHA.
**Testes:** `diff.py` sobre os pares.

### F1d · Efeitos compilados (só dado)

**Entrega:** `ficha-efeitos-itens.json`, `ficha-efeitos-overrides.json` e `regras.json` em `data/balanceamento/` (publicada, D3; só muda por entrega do balanceamento) como **projeção sem raras não reveladas** (M6); o verbatim vai para `privado/balanceamento/` (gitignored) e a projeção é regenerada dele e conferida no `[artefato-json]`; `tools/gerar_efeitos.py` na lista `ALVOS` do `build.py` depois de `bazar`; `data/efeitos.json`; `tools/alvos_destino.json`; `checa_efeitos`:
1. conjunto: ids == 727; partição itens∪armas∪consumo∪sem = 727; `sem ∩ outros = ∅`; `armas ∩ itens` só nos 26 focos; `naoParseado` vazio (AVISO se não);
2. catálogo: nome/categoria/raridade iguais; `verbatim` == coluna `Efeito` do CSV da main (FALHA); sha diferente = AVISO;
3. vocabulário fechado (alvo com destino, op, `quando`, status, recarga, tipo, `condicao`, perícia ∈ 24 slugs, condição ∈ `condicoes.json`, `conjura` ∈ `magias.json`, `municao`/`gera` com id existente, `vhelor.marcas`);
4. cruzada de inventário: `capacidade.*` == `inv.capacidade`, `acumulaCopia` == `inv.acumula`, `empilhaveis` == `{inv.empilhavel}` ∪ os 2 pendentes da D26b, slot de armadura (50/50);
5. armas: dados, atributo e ações re-extraídos do texto (151/151); "+ NdX Tipo <qualificador>" exige condição ou lembrete;
6. lembrete com número de campo: AVISO listado;
7. contagens como AVISO (214/181/243/115/0);
8. integridade de Mod.
(A antiga checagem de spoiler sai: D32.) Os 4 defeitos de parse conhecidos (Bastão de Karmath, Machado da Fúria, Adaga Dimensional, Foco do Vidente) viram lembrete numa lista de exceção que volta a FALHA quando a errata chegar. `municao` vira id; `requisito` vira `{attr,min} | {treino} | {pericia,grau}` (com a D25 "Armas Leves." como requisito do Anel do Esgrimista quando o arquivo vier atualizado).
**Pronto quando:** build verde com as 8 checagens; `data/efeitos.json` publicado; nenhuma página muda.
**Testes:** fixtures (Mochila, Gambeson `ae.cortante`, Escudo `reacaoDefender`, Mutagênico Maior `escolha`, Flechas Elétricas `municaoAtiva`, os 2 sentidos de `acumula:false`, Saco de Dormir → AVISO).

### F1e · Normalização de dado (sem visual)

**Entrega:** (a) magias: `acoes`, `intensidadesPermitidas`, `sustentada`, custo por turno da sustentada (texto da magia, D16), `stats[].porIntensidade`; (b) Limiar: `req:[{attr,min}]`, `custo:{dor,sentido}`; (c) classes: `grupo/ramo/tier/custoTexto` por card, com round-trip; (d) `data/pericias.json` (24 slugs + atributo, com os "X ou Y" como lista).
**Pronto quando:** relatórios por conjunto sem sobra; round-trip byte a byte; nenhuma página muda.
**Testes:** set-diff; `Counter`; um fixture por formato de `acoes`.

### F1f · Raras ocultas

**Entrega:** M6 inteiro: `privado/` no `.gitignore`, `tools/extrair_raras.py`, `tools/revelar_carta.py`, `[raras]`.
**Pronto quando:** as 59 extraídas localmente (ou lacunas listadas); `[raras]` verde; nenhuma rara revelada ainda (a primeira só quando um jogador pegar).
**Testes:** os do M6.

### F2 · Modularização e componentes

**Entrega:** `js/ficha/*.js` + `ORDEM` + concat + `[artefato-js]`; hash recursivo e `KH_V` no shell; `KhInv` extraído; `css/ficha.css` no lugar do CSS injetado (mesmo visual); `componentes.css` mínimo (com a conta no estado "ajustado" e o componente de dado); z-index na escala; `kh-ui.js` com `KhPrever`/`KhTeclas`/`KhToast`/`KhFiltros`/`KhBusca`/`KhPainel`/`KhDados`; CLAUDE.md e ARQUITETURA.md marcando os artefatos e `data/balanceamento/` como "não editar".
**Pronto quando:** Bazar e drawer idênticos pelo par `antes/depois` do portão manual da F1c (`diff.py` verde); nenhum `injectCSS`.
**Testes:** todos + `KhPrever`, `KhDados` (semente), `[artefato-js]`, `kf-contrato.test.js`.

### F3 · Estado v3, motor e ajustes

**Entrega:**
- **Modo sombra:** a v3 lê `khalkaria_ficha`, migra e calcula em memória e mostra as contas, sem criar o índice `khalkaria_fichas_v3`, nenhuma `khalkaria_ficha_v3:<id>` nem o marcador; as edições continuam na v2. O modo sombra é **só-leitura para campos v3** (ajuste, `sessao`, `vhelor`): nada disso tem onde persistir antes da F4.
- **Armazenamento por ficha** (D36, §3.1) no `kh-estado.js`: índice, chave por ficha, ativa por aba e `ultimaAtiva`, criar/trocar/duplicar/excluir, export por ficha e de todas, uso da quota, ordem de limpeza em QuotaExceeded, log e sessão por id. Na F3 é coberto só por teste (sombra não grava); a UI do seletor é da F4.
- A partir da F4 (ou por "Migrar"): índice `khalkaria_fichas_v3` + `khalkaria_ficha_v3:<id>` + marcador; a v2 entra por import único **como uma ficha** do índice (id novo, vira a ativa), guardando nela `{revV2, salvoEmV2}`; marcador só depois de o `setItem` da ficha e do índice darem certo; "reimportar alterações da v2" vai sempre para a ficha ligada à v2 (a da migração ou, na F4, a de `projecaoV2.fichaId`), sem merge silencioso, com download automático antes; botão persistente "Baixar ficha v2".
- Migração: `derivadosManuais` → ajustes (M2) só onde difere do default e do calculado; atributo como `base` com `migradoTotal:true` e `nivelMigrado`; `ordinario` vira os 3 tipos; ids antigos re-associados por nome+tipo+classe, ambíguo vira órfão.
- `data/ficha.schema.json` v3 (`id`, 24 perícias grau 0-4, 14 tipos, entradas ref + cache, magia 1-5, `ajustes`, `sessao`, `vhelor`, `limiar.queimadas`, `'3.0'`) e o schema do índice e do "exportar todas" (`fichas/1`), com validador mínimo no harness.
- `gerar_regras_ficha.py` → `js/ficha/00-regras-dados.js`; `tools/decisoes_pedro.json` e `tools/pendentes_balanceamento.json` (§3.2). `KhRegras`: selos, resolvedor de teste (D81), custo de magia (D82), atributos (D87 + especial D13c), Limiar por mão (D13a), Ar (D85), Evasão (D8), `escolhaAttr` (D7), Saúde temporária (D15), reserva comprometida (D19), sustentada 1 ativa (D16). `KhEfeitos` com as fontes do `data/`; condições automáticas com trilha (D9). `KhAjustes`.
- UI nova no drawer atual, só com glifos, só-leitura (conta visível, sem campo de ajuste).
**Pronto quando:** uma ficha v2 real migra sem perda (em memória); o armazenamento por ficha passa nos testes; cada derivado mostra a conta; o ajuste é coberto só por teste (`KhAjustes` puro, por nó), sem UI; nenhum termo não canônico sem selo; reverter a F3 deixa a v2.1 normal.
**Testes:** `KhRegras` por fórmula (C12, P18, `ordemMaximo`; Dryad com Sobrepeso Leve = 4,5; Caído + Enraizado = 0); custo: Nv2 Contida = 1, Truque Forçado + Canalização Eficiente = 1, Truque Normal + Escola Visceral = 0, Nv2 Contida com −1 = 1; V+D = normal, 2 V = 1 V, crítico no dado mantido; Evasão Ativa sem atributo no dado; Saúde temporária maior-fica; `escolhaAttr` trocado à mão; ajustes (M2); migração 2→3 com fixtures reais, que vira **uma** ficha do índice; aba v2 gravando depois do import; armazenamento (D36): criar, trocar (derivados, log e sessão passam a ser os da outra ficha), duplicar (id novo, sem log nem sessão), excluir (export antes; apaga ficha, log, sessão e rascunho de subida daquele id; a ativa troca para a mais recente; excluir a última deixa o índice vazio), import de arquivo com id existente (atualizar × cópia), "exportar todas" → importar num navegador vazio recria as fichas; QuotaExceeded na migração, no commit e com várias fichas (limpa os logs das inativas, depois o da ativa, nunca ficha nem índice; toast de export); duas abas em fichas diferentes gravando sem se sobrepor (o `storage` de uma não re-hidrata a outra), duas abas na mesma ficha desfazendo, excluir numa aba a ficha ativa da outra (a outra fica só-leitura com "Baixar ficha"); derivados com catálogo indisponível == snapshot; FALHA com status desconhecido.

### F4 · Página da ficha, hub e protocolo

**Entrega:** `templates/ficha.template.html` + `tools/gerar_ficha.py` (no `build.py` e no round-trip) + item "Ficha" em `partials/sidebar.html`; as 5 abas do M1 com moldura gótica; UI de ajuste (M2) e tela Ajustes; `KhLevar` (alça, botão, atalho, MIME); `.ent-add` visível; levar raça/classe/origem/condição; drawer docked, `--dir-w`, trilho de 48px, `head-boot` com o estado; hover de entidade; estado "na ficha"; migração real; export Bestiário com `garantir`; **seletor de fichas** no drawer e na página (D36, §3.1: criar, trocar, duplicar, excluir com confirmação e export antes, uso da quota); Exportar esta ficha ou todas; Importar como ficha nova. **Escrita dupla:** enquanto a F4 não se firma, cada gravação de uma ficha v3 grava também a projeção v2 dela em `khalkaria_ficha` (a v2 só conhece uma ficha), e o marcador, que é um só para o navegador, fica no valor `v3-dupla`, que a guarda do bundle da F3 trata como editável; desliga na F5 (marcador passa a `v3`). A projeção é sempre a da última ficha gravada, e o índice guarda qual é (`projecaoV2:{fichaId, revV2, salvoEmV2}`); com duas abas em fichas diferentes, vence a última gravação. Assim, reverter para o bundle da F3 abre **editável** a ficha projetada, com a edição; as outras fichas e o que só existe na v3 (ajustes, sessão, Vhelor) ficam intocados nas chaves v3, e ao subir a F4 de novo a v3 vê `revV2` maior e oferece "reimportar alterações da v2" (F3) **para a ficha de `projecaoV2.fichaId`**, com download antes.
**Pronto quando:** toda entidade das 7 famílias é levável com o id certo; os campos da ficha física existem por conjunto nas 5 abas; qualquer número aceita ajuste e mostra calculado × ajustado; o seletor cria, troca, duplica e exclui fichas sem perda; sem salto de layout; export nativo completo sem rede; Bestiário com fetch falho aborta com aviso.
**Testes:** roteamento por tipo, compat `{_bazar}`, dedup `tipo:id`, exports com fetch falho, import com órfão, estrutura das abas, ajustes pela UI; seletor (D36): trocar de ficha re-renderiza drawer, página e Bazar (`kf:mudou{partes:['ficha']}`) e o estado "na ficha" dos cards; excluir pede confirmação e baixa o export antes; exportar todas e importar num navegador vazio recria o índice; o uso da quota aparece e sobe ao duplicar; QuotaExceeded pela UI mostra o toast com "Exportar todas"; duas abas em fichas diferentes, editando ao mesmo tempo, sem se sobrepor; reverter a F4: editar na v3, voltar ao bundle da F3, a ficha projetada abre editável com a edição e as outras seguem intactas na v3; subir a F4 de novo recupera os ajustes e reimporta a edição da v2 na ficha certa.

### F4b · Bazar com a ficha aberta

**Entrega e testes:** M4.
**Pronto quando:** com a ficha aberta, o Bazar não mostra dois inventários; filtros "cabe", "posso usar" e "do meu Ofício" funcionam; soltar numa moldura equipa.

### F4c · Assistente de criação e subida de nível

**Entrega e testes:** M3.
**Pronto quando:** um personagem nível 1 sai do zero à ficha pronta só pelo assistente, indo e voltando entre passos sem perda, como ficha **nova** no índice e sem tocar as outras (D36); a tela por ramo mostra tiers e Marcas travados com o nível que destrava (D34); uma subida 1→2 fecha com +2 atributos, mão do Limiar registrada (carta grátis, compras e a queimada, D35), técnica nova e Tier 1 destravado, num passo só de desfazer; contagens do contrato como teto com aviso; o que o contrato não cobre sai com selo PENDENTE (balanceamento).

### F5 · Modo Mesa

**Entrega:** M1 (Mesa): cartões de ação gerados do inventário, grimório, técnicas e perícias; rolador ligado com expressão; ações do turno, reação, magia do turno; condições com X, duração e empilhamento (lote D20); eventos, inclusive `fimCena`; progressão de ataques; usos por recarga como contador genérico; munição em uso como contador manual; consumível: Usar baixa 1, rola a cura e mostra o texto (efeito automático na F6); descansos com estresse e consumo de comida; Desnutrido/Exposto/Exaurido/Oco pelas regras do D17 (decremento do Desnutrido só lembrete, D17(b)); log da sessão com desfazer, um por ficha (D36); linha de mesa; `estadoSessao` no nativo.
**Pronto quando:** a rodada simulada do M1 (só arma e magia) fecha só com a ficha.
**Testes:** os do M1.

### F5b · Usos de técnica automáticos

**Entrega:** usos, recarga e custo de técnica a partir do bloco C (P44).
**Pronto quando:** toda técnica com recarga no dado chega com o contador preenchido; nenhum valor inventado.

### F6 · Efeitos de itens e Marcas da Vhelor

**Entrega:** liga Mods, condições, `municaoAtiva` e a D23 ao botão Usar da F5 (ou cria o botão, se a F6 sair antes); `quando` no `KhEfeitos` (equipado com limites de slot, sintonizado máx. 3 com troca no descanso longo e `sintoniaDescansos` 2 na Coroa de Kha e no Amuleto de Malkhor, `municaoAtiva` por `compativel`, ativado); `KF.usar`/`ativar` pelo rolador ou "rolei __"; temporários com as 8 durações e fim manual; permanentes com trilha; aplicar/remover condição; `conjura` abre a magia; `gera` cria entrada; aviso de `soParaRaca` e pop-up de cura em Autômato (D23); `armaComBeneficio`; capacidade pelos Mods (FALHA se divergir de `inv.capacidade` até a migração); export `weapons[]` completo; M5.
**Pronto quando:** Mochila, armaduras (Ar/Ae), escudos, consumíveis e armas refletem nos campos com trilha; nenhum número entra duas vezes; a tela da Vhelor abre pelo contador e, com a rodada 3 entregue, pelo consumo.
**Testes:** um fixture por op, `quando`, opcional e família de alvo; Reforçada + Contrabandista = +8 bugigangas e +1 equipamento; 2 Reforçadas com aviso de cópia; usar + desfazer; `weapons[]`; os do M5.

### F7 · Refino de páginas

**Entrega:** uma família por entrega: Condições → Magias → Classes (M7, depois da prova de estética aprovada) → Raças → Limiar (animação mantida) → Origens → Sistema → index/criacao/classes.html (§6). Lei de cor aplicada família a família.
**Pronto quando:** zero `<style>` no template da família, zero emoji como ícone, zero hex de recurso fora dos tokens, filtros/busca/hover conforme o Bazar.
**Testes:** round-trip byte a byte do conteúdo; set-diff de entidades; pares `antes/depois` de estilo das outras famílias sem diff (portão manual da F1c).

---

## 8. O que ainda está aberto

**Com o balanceamento — rodada 3 (enviada, dono: balanceamento)**

| Item | Trava | Enquanto isso |
|---|---|---|
| Gravar no Notion D14b (D83–D86), D20 (27 `decisao` em lote), D30, D31, D17, D15, D16, D18, D13, D8, D12. D21: **já no Notion**, só conferir (o site sincroniza, §6) | selo "decisão do Pedro, falta Notion" | termos entram com selo |
| Arquivo de efeitos: D21 (Investida nas Grevas Trovejantes), D22, D23, D24, D25, D26a (Marcas da Vhelor: ligação item → Mod; quais itens dão e tiram já está no CSV), D26b, D5a | F1d (Mods), M5 (consumo) | lembrete; contador manual |
| Dúvida 1: técnicas reatribuíveis no descanso curto (Pedro) × longo (`regras.json:3054`) | M1 (descanso), M3 (subida) | botão nos dois descansos, com selo |
| Dúvida 2: para que serve o "Des/Con" do Defender na ficha física | M1 (Defender) | Defender como dado, sem atributo (D8a) |
| ~~Dúvidas 3 e 4~~ | — | **caíram localmente** (§0.3); avisar o balanceamento |
| Dúvida 5: só a faixa depois de "mover 1 ponto" (as contagens o contrato já fecha, §0.2) | M3 passo 1 | aviso fora de 8–18, com selo |
| Dúvida 6: expressão canônica do rolador | M1 | expressão do `regras.json` (teste) |
| D17(b): como o Desnutrido **diminui** (`decrementa: null`, `:1549`; pendência n=10, `:3349`). A nota do Pedro só diz como se ganha. Foi na rodada 4 | M1 (descanso) | lembrete, sem decremento automático |
| D17(d): lista das condições mentais (a nota do Pedro não trouxe; seguiu com a gravação do D17). Se não houver fonte, volta ao Pedro | tag `mental` | lembrete |

**Com o balanceamento — rodada 4 (enviada, §10):** Stamina negativa × `gastoSemSaldo: proibido`; leitura de "Exaurido e Oco saem ao deixar os negativos nos 2 status" (cada um pelo seu recurso, ou os dois juntos?); D17(b) como o Desnutrido diminui; magias do Teurgo por nível depois do 1º (o dado só traz o nv1 e as escolas 2/3/5); perícias que contam como "interações sociais" na Marca 4; fonte da sustentação "a cada 30 min" fora de combate (D16 não cobriu); Saco de Dormir: qual sentido do `acumula:false`.

**Com o Pedro**
- **Editar o CSV** (D26b: acrescentar "Empilhável: pesa 1 bugiganga a cada 10 unidades." ao `Efeito_Jogador` de Casca de Raiz e Seiva da Vhelor; D25: "Saude" → "Saúde" na Erva Medicinal e "Armas Leves." como requisito do Anel do Esgrimista). Aprovado, mas a permissão da sessão bloqueou: **fica com ele**. Depois, `ESPERADO['empilhavel']` sobe para 87 e o AVISO some.
- **Ilustrações da ficha física:** recebidas (§9); faltam as molduras de carta e a divisória grossa.
- **Prova de estética das classes (M7):** descrição estética, cor/glifo/textura dos 21 ramos e a fonte do título. Adição criativa: nada entra no dado sem o ok.

---

## 9. Riscos e divergências

**Sinalizar ao Pedro**
- Cores de recurso decididas pelo Pedro: Saúde vermelho, Stamina amarelo, Éter verde e roxo. As ilustrações de Stamina (raio azul) e Éter (espiral dourada) da ficha física destoam: recolorir por script ou o Pedro manda versões novas (perguntado).
- **Ilustrações da ficha física: recebidas** (`pag1.zip`, camadas da página 1). Atributos em traço preto sobre transparente (vão num medalhão de pergaminho no site escuro); Saúde = Camada 3, Stamina = Camada 11, Éter = Camada 12, Movimento = Camada 5, Sins = Camada 6, Evasão = Camada 13, CD = a mão (Gemini_…31jez), Armadura e Resistência = Camada 14, Equipamentos e Bugigangas = Backpack, logo, divisória de ramos, moldura A4 e papel. Entram em `images/ficha/` com nomes limpos (PNG → WebP pelo build) na F4. Pedidos ao Pedro: molduras de carta da página 3 e a divisória grossa de raízes das páginas 2–5.
- A ficha física tem 12 tipos de resistência e Grimório em 4 níveis; a digital segue 14 tipos (D6) e 5 níveis.
- Duplas da ficha física × contrato: Movimento, Convencer, Intimidar e Enganar batem com as 4 `maior`. Divergem só **Defender** ("Des/Con" na física × dado sem atributo, dúvida 2) e **Atacar** ("For" na física × "For ou Des" por arma na tabela).

**Riscos técnicos**
- **Aba velha gravando depois do import:** mitigado pela guarda da v2.1 (F0) e `{revV2, salvoEmV2}` (F3).
- **Quebra do Bazar:** contrato fechado dos 23 membros e `kf-contrato.test.js`.
- **Números mudando em silêncio:** conta sempre visível, ajuste manual migrado e marcado (M2).
- **Ajuste manual escondendo mudança real** (ajuste fixo congela um número que o nível mudaria): aviso "o calculado mudou" e tela Ajustes.
- **Fórmula não canônica publicada:** mapa fechado de selo, FALHA com status desconhecido, selo PENDENTE (balanceamento) para o que está em pergunta.
- **Rara vazando pelo git** (M6): já aconteceu nas branches públicas do `origin`: `obsidian/Khalkaria/Sistema/O Limiar (cartas).md` (`3d6a01d`) e `docs/memoria/digests/D_limiar.md` + `docs/memoria/notion_raw/limiar.md` (`8d3b613`), em `origin/claude/khalkaria-rpg-setup-mbg6ws` (a linha da Sangria Precisa traz o efeito inteiro); `ficha-digital-regras.json` e `09-decisoes-pedro.md` em `origin/claude/khalkaria-bazar-balance-lsdfic` (`4cf6af2`, contrato rev. 2). O Pedro decidiu deixar as branches como estão e manter o oculto **só no site** (D33): o GitHub Pages só serve a `main`. Na `main`: arquivo privado gitignored, projeção sem raras em `data/balanceamento/`, `[raras]` que FALHA sem precisar do privado e varredura de branches só com AVISO.
- **Rolador sem confiança na mesa:** expressão e dados individuais sempre visíveis; "rolei __" em todo botão.
- **Contagem dupla** de capacidade na transição: fonte única por fase e checagem cruzada até a F6.
- **Perdas silenciosas de parse:** lembrete + regra de qualificador no `checa_efeitos`.
- **Quota do localStorage** (5 MB por origem, compartilhada): log por patch com teto; rascunhos da criação e da subida apagados ao confirmar; log da sessão com teto de 200. Várias fichas (D36) multiplicam o uso: o seletor mostra quanto está ocupado, a limpeza em QuotaExceeded apaga logs antes de tudo e nunca ficha nem índice, e o toast oferece "Exportar todas".
- **Duas abas em fichas diferentes** (D36): ficha ativa por aba em `sessionStorage`, evento `storage` filtrado pelo id, exclusão em outra aba deixa esta só-leitura com "Baixar ficha"; na escrita dupla da F4, a projeção v2 é a da última ficha gravada e o índice registra qual.
- **Ids:** corrigir agora é barato; depois da F3 toda renomeação exige migração. Homônimos: Oportunista (Batedor/Espadachim), Passo do Vento (Artilheiro/Monge).
- **`@layer`:** CSS sem camada vence; `!important` em camada inverte. F1c isolada e medida.
- **Reverter uma fase no ar:** marcador, modo sombra na F3, escrita dupla na F4 (marcador `v3-dupla`; a v2 só vê a ficha projetada), "Voltar a usar a v2".
- **Asset e JSON sem versão:** hash recursivo e `KH_V`.
- **Migrar conteúdo preso em template** pode alterar texto canônico: só por script, round-trip byte a byte (F1b).
- **CSV defasado no branch do balanceamento:** sha em AVISO e errata (§10).
- **Escopo:** 7 módulos. As fases publicáveis e os selos evitam que o que depende do balanceamento trave o resto.

**Para o Pedro saber**
- O balanceamento trocou 6 ícones de callout por emoji na página Sistema do Notion; o site não importa esses emoji como ícone.
- D83–D86 continuam com selo "falta Notion" até a rodada 3 gravar.

**Divergências Notion × site × contrato (sinalizar, não escolher)**
- Sangramento: card "+1d4" × D83 "+Xd4" (gravação na rodada 3).
- Tique de dano: Em Chamas × Envenenamento/Morrendo (D31c decidido; gravação na rodada 3).
- Ofício(Ferraria) com o texto da Engenharia; Pele de Pedra com Ae(Ordinário); resíduo da D68 (D31, gravação na rodada 3).
- Técnicas reatribuíveis: descanso curto (Pedro) × longo (contrato) (dúvida 1).
- Stamina negativa: D17 do Pedro × `gastoSemSaldo: proibido` (rodada 4).
- Monge: perícias iniciais "Movimento, Atacar" × `[movimento, vontade]` no contrato.
- Anão: "−1 Des" (`racas.json`) × "−1 Inteligência" (`anao.template.html:47`). Corrompido: "Graus: Tocado, Alterado, Consumido" só no índice.
- Transbordante: "falha no cast e perde o dobro" (`sistema.json:439`) × "perde o dobro" (`magias.template.html:159`).
- Sustentada: "a cada turno" (Armadura de Espinhos) × "a cada rodada" (Refúgio dos Perdidos); fora de combate "a cada 30 min" sem regra geral.
- Santuário Menor, Invocar Tempestade e Contramedida com 3 valores (regra das 3 barras vale; conferir no Notion). Éter Residual e Magias Pactuadas em `orfasDeContida`.
- CD sem "Mod." em Brutalista, Espadachim e Artilheiro (P16). Vidente "Interação Social (Intuição)" × a tag `social` sem Intuição.
- Ofício(Alquimia) falta na tabela de Perícias do Notion e do site, mas é canônica.
- Itens Alquímicos: 93/94 no Bazar, CDs batem, redação diverge em 76; "Lágrima do Tempo" não está no CSV.
- Modulações nos níveis 2-5 sem lista escrita.
- Exemplo da progressão no contrato (`regras.json:925`) com bônus fora da escala.
- Schema defasado (resolve na F3).

---

## 10. Pedido ao balanceamento

**Rodada 3:** enviada (§0.3). Ao chegar, cada resposta: tira o selo pela revisão do contrato, atualiza `data/balanceamento/` e fecha a linha do §8.

**Rodada 4 (enviada):** saiu sem o pedido "raras fora do git público", que caiu com a D33 (o oculto vale só no site; o site filtra as raras de qualquer jeito, M6).
1. Stamina pode ficar negativa? O D17 do Pedro fala em "sair dos negativos" de Stamina e Éter; o contrato proíbe gasto sem saldo (`regras.json:114, 127`) e só descreve Éter negativo involuntário.
2. "Exaurido e Oco são removidos quando você sai dos negativos nos 2 status": cada condição pelo seu recurso, ou as duas só quando os dois saem? E substitui o "sai: stamina > 0" do P32 (`regras.json:1450`)?
3. Confirmar que o `empilhamento` (`regras.json:2204-2210`) está no lote da D20 e vai para o Notion inteiro (entre condições soma, mesma renova duração, com X soma X). O site já aplica assim.
4. Marca da Vhelor 4: quais perícias são "interações sociais"? Marca 2: o "−10 de Éter máximo" é por Marca 2 atingida (uma vez) ou cumulativo?
5. Sustentação fora de combate "a cada 30 min" (`foraCombatePendente`, `:2443-2444`): fonte geral ou só a Sinapsia?
6. Saco de Dormir: qual dos dois sentidos de `acumula:false`.
7. D17(b): como o Desnutrido **diminui** (`decrementa: null`, `:1549`; pendência n=10, `:3349`)? Se não houver fonte, volta ao Pedro.
8. Magias do Teurgo por nível depois do 1º: o site só tem "1 + MOD. INT ou SAB magias de nível 1 no primeiro nível" e as escolas 2/3/5; o Alquimista tem "+1 magia/nível". Qual é a do Teurgo?
9. Aviso: das dúvidas da rodada 3, a 3 (Intimidação) e a 4 (X/Y trocáveis) caíram localmente, e da 5 só importa a faixa depois de "mover 1 ponto" (o contrato já fecha as contagens). A D21 já está no Notion: só conferir.

**Continuam valendo (enviar em paralelo, sem depender do Pedro):**
1. **Bloco C** (raças, origens, Limiar, passivas de classe). Trava a F5b e os Mods de raça/origem/carta/técnica.
2. **Metadado de técnica (P44):** `{grupo, ramo, tier, custo:{recurso, valor}, recarga, usos}` com os ids do site; 274 cards no site × "~259" (`regras.json:2587`).
3. **Convenção de id** e alias dos ids fora dela (§3.2).
4. **Forma única de Mod e namespace único** nos dois arquivos; `escolha` no vocabulário; recargas com os nomes dos eventos.
5. **Eventos:** `inicioTurno` no bloco `eventos` (`:3217-3257`); `aoSerAcertado` como "fui acertado"; Em Chamas e Envenenamento em `inicioTurno` (D31c). O rolador agora é ligado (Pedro), em linha com o "automatico, com desfazer" do descanso (`:3195`).
6. **Erratas do arquivo de efeitos:** as 4 perdas de parse; `municao` como id; `requisito` estruturado; `propriedades` morto; `geradoEm` fixo; um campo para cada sentido de `acumula:false`; rebasear `references/bazar-v26.csv` no CSV da main (109 receitas de `a36ef3e`). (O pedido de marcar a mecânica dos 7 itens como "de mestre" cai: D26a aplica e D32 publica.)
7. **Erratas do contrato:** legenda `aprovado` "sem uso" com 4 usos; 6 status fora da legenda; textos velhos (`:824`, `:3429`, `:3302`); exemplo da progressão fora da escala (`:925`); 5ª carta como "…" (agora 5, D13a); marcar no 14.md só os trechos substituídos pela Revisão 2; `recupera.status` numérico com outro nome.
8. **Não pedir de novo:** PMA como display, +2 por nível, D80–D82, Limiar por mão, alvos `capacidade.*`/`ar`/`ae.*`, dado e família de arma.
