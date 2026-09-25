# Khalkaria — Protocolo do Agente de Desenvolvimento

Site estático do sistema de RPG dark fantasy **Khalkaria** (PT-BR), continente de Kharavel.
Publicado em GitHub Pages: `vitralxx.github.io/Khalkaria_Html/`.

---

## 1. Regras invioláveis

**Fonte da verdade: Notion, sempre.** Nunca inventar, simplificar, resumir ou omitir conteúdo canônico. Copiar verbatim. Se o Notion contradizer o Notion (acontece), **sinalizar antes de escrever**, nunca escolher em silêncio.

**Autonomia:** propor, questionar e sinalizar contradições antes de implementar. Adições criativas ao site/lore exigem aprovação prévia do Pedro. Correções factuais contra o Notion podem ser aplicadas direto.

**Comunicação:** PT-BR, direto e tecnicamente preciso. Crítica construtiva é bem-vinda e esperada. **Economia agressiva de tokens/créditos** — outputs enxutos, sem preâmbulo, sem repetir o que já foi dito.

---

## 2. Sistema — referência rápida

- **Atributos (5):** FOR, DES, CON, INT, SAB (8–18). Modificador = (Atributo − 10) / 2. **Não existe Carisma.**
- **Perícias (24, canônicas):** Atacar, Defender, Movimento, Fortitude, Vontade, Reflexos, Percepção, Sobrevivência, Furtividade, Crime, Iniciativa, Conhecimento, Medicina, Investigação, Religião, Místico, Convencimento, Intimidação, Intuição, Enganação, Motivar, **Ofício(Engenharia)**, **Ofício(Ferraria)**, **Ofício(Alquimia)**. Fonte da verdade: ficha física. O genérico `Ofício(X)` deixou de existir em 2026-09: viraram perícias concretas, todas `1d20+Inteligência`, usadas na fabricação. **Ofício(Alquimia)** também é canônica (confirmado pelo Pedro em 2026-09-24) — são 24 perícias no total. Ela **não** entra no mapeamento `prof_*` do Bestiário: inimigos e NPCs não fabricam, crafting é só de jogador.
- **Proficiência de perícia:** escala de 4 níveis — +2 / +4 / +6 / +8 (não é binária).
- **Recursos:** Saúde, Stamina (todas as classes), Éter (conjuradores), Recurso de Classe específico (ex.: FLUXO no Monge).
- **Valores de classe:** cada classe tem **Vitalidade**, **Vigor** e **Ressonância** — os multiplicadores que entram no cálculo de Saúde, Stamina e Éter máximos. Vivem nas fórmulas dos `templates/classes/*.template.html`.
- **Derivados:** Movimento, Evasão, CD.
- **Inventário:** Equipamentos = 2 + Mod.FOR slots · Bugigangas = 10 + Mod.FOR. Munição: 20 unidades = 1 slot. Moedas não pesam. Condições de excesso: *Sobrepeso Leve* / *Sobrepeso Extremo*.
- **Magia:** **5 níveis**. Custo base **0/2/4/6/8** Éter — o Nível 1 é gratuito e o Nível 5 exige Foco Primordial. Intensidades: Contida (−2) / Normal / Forçada (+2) / Transbordante (+4). Exige Treinado em Místico + Foco da escola. Escolas: Destruição, Abjuração, Alteração, Conhecimento.
- **Resistências:** 12 tipos de dano — Ordinário, Fogo, Frio, Elétrico, Veneno, Ácido, Psíquico, Força, Radiante, Trovejante, Necrótico, Primordial. Cada um com Resistência (R) e Imunidade (I).
- **Classes (7):** Espadachim, Batedor, Brutalista, Teurgo, Monge, Alquimista, Artilheiro.
- **Raças (7):** Humano, Anão, Dryad, Autômato, Gruto, Inseto, Corrompido.
- **Origens:** **19** (Lenhador e Mineiro entraram em 2026-09).
- **CR:** CR 2 = equilíbrio para 5 jogadores de nível 2. CR 4 = risco de TPK. Campanha roda níveis 1–5.
- **Sins:** moeda do universo. Contador editável na ficha — **não** é stat derivado, não deriva de atributo. Não trava aquisição de item.

---

## 3. Arquitetura atual do repo

Mapa completo e comandos: **`ARQUITETURA.md`**. Resumo:

```
index.html                  landing (HTML manual)
partials/sidebar.html       FONTE ÚNICA da navegação
css/style.css               design system  |  css/classes.css, css/racas.css
js/main.js  js/utils.js  js/ficha.js
data/*.json                 conteúdo + data/Bazar_Khalkaria_v26.csv
templates/*.template.html   scaffold com {{CAT_x}} / {{CARD_n}} / <!--SIDEBAR-->
tools/build.py              fase 1 geradores + fase 2 shell + validação
tools/validar.py            integridade estrutural (§6 automatizado)
tools/sync_notion.py        motor de diff dos snapshots do Notion
pages/*.html                ARTEFATO gerado
images/*.png (fonte) -> *.webp (servido)
```

**Um comando faz tudo:** `python tools/build.py`

**Fase 2 (`tools/shell.py`), aplicada a TODAS as páginas:** navegação a partir
de `partials/sidebar.html`, `<img>` apontando para `.webp`, e id determinístico
em cada h2/h3 (`id="custo-base-por-nivel"`, h3 com escopo do h2), e `?v=<hash>` em
todo `<script src>`/`<link href>` local (cache do GitHub Pages: sem versão na URL,
o navegador serve JS antigo depois do deploy). O id de título pertence ao build e
é sempre recalculado — não escrever id em h2/h3 à mão, nem `?v=` em asset à mão.
O shell também injeta `partials/head-boot.html` (estado da nav antes do paint) e
`js/nav.js` (trilho de 64px, atalho `\`, grupos, menu mobile); a largura da nav no
layout é só `--nav-w`.

**O Bazar entrou em escopo em 2026-09-24.** `tools/gerar_bazar.py`, `css/bazar.css`,
`js/bazar.js` e `templates/bazar.template.html` são do agente de HTML. O CSV
(`data/Bazar_Khalkaria_v26.csv`) é conteúdo do Pedro: só se mexe nele com aprovação
explícita, e a página nunca é editada à mão — é artefato.
*Exceção:* a seção "O Bazar" dentro da página **Sistema** do Notion **é** escopo
e vai em `data/sistema.json`.

## 4. Migração em curso — Rota 1 (JSON como fonte)

**Decisão aprovada pelo Pedro.** O fluxo muda de:

```
Notion → HTML (edição manual)
```

para:

```
Notion → data/*.json → gerador → pages/*.html
```

**Consequências obrigatórias:**
- **Parar de editar HTML de conteúdo à mão.** O HTML gerado é artefato de build; edições diretas são sobrescritas.
- Todo conteúdo mecânico (magias, técnicas, condições, raças, origens, cartas do Limiar) vira JSON em `data/`.
- IDs de âncora passam a ser derivados deterministicamente do dado (`id="magia-dardo-arcano"`), estáveis entre builds.
- CSS/estrutura de página continuam em templates; só o conteúdo vem do JSON.

**Estado:** 20 páginas migradas e fechando round-trip byte-a-byte (sistema,
magias, condições, limiar, origens, 7 raças + índice, 7 classes). Restam
`index.html`, `classes.html` e `criacao.html` como HTML manual — páginas de
navegação, sem conteúdo canônico.

**Por que:** buscar strings no HTML falha porque as tags ficam intercaladas no meio do texto. Em JSON a localização é exata (`magias.nivel1.destruicao[] where nome == "..."`). A migração torna a sincronização com o Notion **mais** confiável, não menos.

---

## 5. Projeto ativo: Ficha Interativa

Ficha de personagem jogável no site, com drag-and-drop de conteúdo das páginas de regras.

**Escopo aprovado:**
- Ficha em sidebar, persistente durante a navegação (localStorage + re-hidratação no `DOMContentLoaded`; **não** virar SPA).
- **Export / Import JSON — essencial, entra no MVP.**
- Drag-and-drop de magias, técnicas, itens do Bazar e cartas do Limiar para drop zones da ficha.
- Botão "+ Adicionar à ficha" em cada card (interação primária; DnD é complemento).
- Bazar: itens arrastáveis **sem trava de moedas** — preço é informativo. O personagem pode ganhar item de graça.
- Limiar: só drag-and-drop das cartas. **Sem sorteio.**
- Derivados calculados automaticamente: modificadores, Evasão, CD, Movimento, slots de inventário com alerta de Sobrepeso.
- Exportação compatível com o app **Bestiário Khalkaria** (Flask + SQLite).

**Compatibilidade Bestiário (analisado, v10):** contrato de import = pack de criação v8, endpoints `/api/creature/import` (colar JSON) e `/api/import` (upload). Schema canônico `{"type":"npc"|"monster", "name", <stats>, "prof_*", "weapons":[], "abilities":[]}`; import **tolerante** (filtra chaves desconhecidas, não-destrutivo). O PJ exporta como `type:"npc"`.
- **Perícias → `prof_*` (1:1):** Atacar→`prof_attack`, Defender→`prof_defend`, Movimento→`prof_movement`, Fortitude→`prof_fortitude`, Vontade→`prof_will`, Reflexos→`prof_reflexes`, Percepção→`prof_perception`, Sobrevivência→`prof_survival`, Furtividade→`prof_stealth`, Crime→`prof_crime`, Iniciativa→`prof_initiative`, Conhecimento→`prof_knowledge`, Medicina→`prof_medicine`, Investigação→`prof_investigation`, Religião→`prof_religion`, Místico→`prof_mystic`, Convencimento→`prof_persuasion`, Intimidação→`prof_intimidation`, Intuição→`prof_insight`, Enganação→`prof_deception`, Motivar→`prof_motivate`, Ofício→`prof_craft`+`craft_attr`. **Decidido (2026-09-24):** fabricação é só de jogador — inimigos e NPCs não craftam —, então as perícias de Ofício não precisam de linha própria no Bestiário. O export segue mandando um `prof_craft` só; a ficha guarda as três (Ferraria, Engenharia, Alquimia) para o filtro do Bazar.
- **Atributos:** FOR/DES/CON/INT/SAB → `strength/dexterity/constitution/intelligence/wisdom`. **Recursos:** `health_max/stamina_max/ether_max`. **Derivados:** `evasion/movement/armor`. **Resistências:** R→`resistances`, I→`immunities` (strings CSV). **Magias/Técnicas** → `abilities[]`; **armas do inventário** → `weapons[]`.
- **Só-ficha (descartado no export):** inventário geral, Sins, cartas do Limiar, lore. A ficha nativa é superset; o export é projeção `npc`.

**Fora de escopo (arquivado):** aba de feedback / sistema de flags. GitHub Pages é estático e o Pedro não quer exigir conta GitHub dos jogadores.

**Sem preocupação com mobile** — os jogadores usam PC.

**Layout de referência:** ficha física de 5 páginas usada na Sessão 0 —
1. Núcleo (identidade, atributos, perícias, recursos, derivados, inventário, resistências)
2. Técnicas & Marcas (Gerais, de Ramo por Tier 1–3, Diversas, Marcas)
3. Cartas, Lore & Outros (cartas do Limiar, História, Outros)
4. O Bazar (Bugigangas, Equipamentos por peso, Materiais por raridade)
5. Grimório (magias por nível 1–4, com Ação/Alvo/Resist./Alcance/Duração)

Prioridade é **funcionar**, não elegância. Replicar a estrutura, não a arte.

---

## 6. Método de verificação (crítico)

Aprendido na marra: **não confiar em listas digitadas à mão a partir do Notion.** Extrair nomes/valores programaticamente dos dois lados e comparar por conjunto (`set` difference), não por olho. Foi exatamente isso que expôs uma carta duplicada no Limiar que a conferência manual deixou passar.

Padrão por página:
1. Extrair via parse os nomes de entidade (técnicas, cartas, magias) do artefato.
2. Comparar conjuntos contra o Notion — reportar `só_notion` e `só_html`.
3. Checar duplicatas (`Counter`).
4. Só então inspecionar valores numéricos das entidades sinalizadas.
5. Validar HTML: stack de tags balanceado (`html.parser`) + âncoras `href="#x"` vs `id="x"`.

Normalizador para comparar conteúdo:
```python
re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', html))
```

**Regras de comparação:**
- Comparação é textual e integral, página por página.
- Abreviações de estilo ("Mod.Des" vs "Mod. Destreza", "2x" vs "duas vezes", "+2 Int" vs "+2 Inteligência") **não** são divergências. Só sinalizar mudança numérica/mecânica.
- Typos do Notion corrigidos no HTML são aceitáveis, não são diffs.
- **Regra das 3 barras:** stats de magia sempre exibem as 4 intensidades. Quando o Notion mostra 3 valores, o HTML expandir para 4 repetindo o primeiro está correto.

---

## 7. Ordem de escopo (sincronização Notion)

Sistema → Magias → Condições → Limiar → 7 Classes → 7 Raças → Origens (17).

---

## 8. Entrega

- Versionamento semântico. Última versão publicada: **v1.5** (tag git).
- No modelo antigo: zip completo `Khalkaria_Html-v{X.Y}.zip`, nunca patch parcial.
- Trabalhando no repo local via Claude Code: commits atômicos, mensagem descritiva em PT-BR.
- Antes de qualquer commit que toque HTML/CSS/JSON: `python tools/build.py` tem que passar.
- Excluir sempre: `.DS_Store`, `__MACOSX/`, `old_ref/`.
- Ao final de cada entrega: sumário conciso das mudanças + sinalizar divergências do Notion pendentes de decisão.

---

## 9. Notas operacionais

- **Notion:** `notion-fetch` por UUID é mais confiável que por URL. Contar linhas direto do conteúdo — blocos de resumo ficam desatualizados (ex.: "Raras: 60" quando o catálogo tem 59).
- **Imagens:** URLs S3 do Notion expiram em ~1h e o sandbox bloqueia download. **Nunca tentar baixar** — o Pedro substitui `images/*.png` manualmente.
- **O Limiar:** **168 cartas** (sincronizado com o Notion em 2026-09-22). Catálogo 127 = Universais **8** + FOR/DES/CON/INT/SAB 12 cada (60) + **Raras 59**. Abismo = 18 Dores + 23 Benefícios. Página Notion viva `3a66e3a4-01d9-806d-b1f8-d6975255f676` (sob "Sistema Khalkaria") é autoritativa — a UUID antiga `2df6e3a4-…` está **deletada** no Notion (conteúdo idêntico). Contar pelas tabelas inline, **não** pelo bloco de resumo. Nesta rodada os totais do resumo batem, mas ele ainda diz "FOR 14+" enquanto os cabeçalhos do catálogo dizem **16+** — vale o catálogo. Site exibe raras como ícone+requisito+nome (sem efeito) — decisão de design existente. Cartas raras devem usar **apenas recursos universais** (Stamina, Éter, HP, Reações, Ações, CD de classe) — nunca recursos travados por classe como FLUXO.

---

## 10. Não fazer

- Não inventar conteúdo canônico nem preencher lacunas em silêncio.
- Não editar HTML de conteúdo à mão após a migração para JSON.
- Não usar IDs de âncora gerados por índice, nem escrever id em h2/h3 à mão (é do build).
- Não editar a `<nav class="sidebar">` dentro das páginas — só `partials/sidebar.html`.
- Não travar aquisição de item do Bazar por dinheiro.
- Não implementar sorteio de cartas do Limiar.
- Não reescrever texto narrativo do Pedro em bloco — edições narrativas são cirúrgicas e preservam vocabulário e imagens originais.
- Não usar `localStorage` como único meio de persistência sem oferecer Export/Import.
