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
- **Perícias (22, canônicas):** Atacar, Defender, Movimento, Fortitude, Vontade, Reflexos, Percepção, Sobrevivência, Furtividade, Crime, Iniciativa, Conhecimento, Medicina, Investigação, Religião, Místico, Convencimento, Intimidação, Intuição, Enganação, Motivar, Ofício(X). Fonte da verdade: ficha física. Mapeiam **1:1** com as colunas `prof_*` do Bestiário (ver §5).
- **Proficiência de perícia:** escala de 4 níveis — +2 / +4 / +6 / +8 (não é binária).
- **Recursos:** Saúde, Stamina (todas as classes), Éter (conjuradores), Recurso de Classe específico (ex.: FLUXO no Monge, Concentração no Artilheiro). Base 10/8/6 + multiplicador de classe por nível.
- **Evasão:** 10 + Mod.DES em todas as classes (passiva); ativa = + treinamento em Defender. Defender usa dado (1d6/1d8/1d10/1d12/2d8), não a escala +2..+8.
- **Derivados:** Movimento, Evasão, CD.
- **Inventário:** Equipamentos = 2 + Mod.FOR slots (mín. 1) · Bugigangas = 10 + Mod.FOR (mín. 1). **Munição: 1 unidade gasta por combate inteiro**; sem munição não usa arma à distância; munições ocupam 1 bugiganga. Moedas não pesam. Condições de excesso: *Sobrepeso Leve* / *Sobrepeso Extremo*.
- **Magia:** 4 níveis (nível 0 = ~20 truques sem custo, **a criar** pelo Pedro). Custo base 2/4/6/8 Éter. Intensidades: Contida (−2) / Normal / Forçada (+2) / Transbordante (+4). Exige Treinado em Místico + Foco da escola. **5 escolas:** Destruição, Abjuração, Alteração, Conhecimento, **Primordial** (nível 5, Foco Primordial). **1 magia por turno** (exceção: Disparo Veloz). Tabela do Notion manda sobre a descrição.
- **Resistências:** 12 tipos de dano em 4 categorias — Ordinário (subtipos Cortante/Perfurante/Contundente); Elementais: Fogo, Frio, Elétrico; Biológicos: Veneno, Ácido, Psíquico; Místicos: Radiante, Trovejante, Necrótico, Força (gravidade/deuses), Primordial (energia do Primórdio, raríssima). "Gelo" na raiz do Notion é erro. Cada um com Resistência (R) e Imunidade (I).
- **Classes (7):** Espadachim, Batedor, Brutalista, Teurgo, Monge, Alquimista, Artilheiro.
- **Raças (7 públicas + 1 secreta):** Humano, Anão, Dryad, Autômato, Gruto, Inseto, Corrompido. **Lobisomem** existe no Notion mas é raça secreta de 1 jogador — **não entra no site**. Grutos são reptilianos. Dryad = metade humano, metade qualquer animal à escolha. Anões: sobrenome Krichama (ferreiros) ou Caxon (engenheiros).
- **Origens:** 17.
- **Idiomas (6):** Comum, Skalia (grutos), Khazadun (anões), Natural, Abissal (criaturas do Abismo), Criptografado (ex-"Esquecido"; autômatos).
- **Técnicas de ramo:** 3 no Tier 1 (nível 2), 2 no Tier 2 (nível 4), 1 Ultimate no Tier 3 (nível 5). Texto "3 por Tier" em algumas classes é erro.
- **CR:** CR 2 = equilíbrio para 5 jogadores de nível 2. CR 4 = risco de TPK. Campanha roda níveis 1–5.
- **Sins:** moeda do universo. Contador editável na ficha — **não** é stat derivado, não deriva de atributo. Não trava aquisição de item.

---

## 3. Arquitetura atual do repo

```
index.html
css/style.css
js/main.js          splash, menu mobile, smooth scroll, fade-in
js/utils.js         sidebar direita: índice, recentes, busca no Bazar
pages/*.html        sistema, magias, condicoes, limiar, origens, racas, classes, criacao, bazar
pages/classes/*.html
pages/racas/*.html
images/*.png
Bazar_Khalkaria_v25.csv + gerar_bazar.py  →  pages/bazar.html
```

**Problemas conhecidos:**
- `<nav class="sidebar">` está duplicada em ~25 arquivos. Toda mudança de navegação exige editar todos.
- `js/utils.js` gera IDs de seção em runtime por índice (`sec-0`, `sec-1`…). São **instáveis** e não existem no HTML servido. Devem ser substituídos por slugs determinísticos.
- Imagens muito pesadas (`landing.png` 10,7 MB, `alquimista.png` 7,5 MB). Comprimir.

**Fora de escopo do agente:** `bazar.html`, `Bazar_Khalkaria_v25.csv`, `gerar_bazar.py` — mantidos pelo Pedro.
*Exceção:* a seção "O Bazar" dentro da página **Sistema** do Notion **é** escopo e vai em `sistema.html`.

---

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
- **Perícias → `prof_*` (1:1):** Atacar→`prof_attack`, Defender→`prof_defend`, Movimento→`prof_movement`, Fortitude→`prof_fortitude`, Vontade→`prof_will`, Reflexos→`prof_reflexes`, Percepção→`prof_perception`, Sobrevivência→`prof_survival`, Furtividade→`prof_stealth`, Crime→`prof_crime`, Iniciativa→`prof_initiative`, Conhecimento→`prof_knowledge`, Medicina→`prof_medicine`, Investigação→`prof_investigation`, Religião→`prof_religion`, Místico→`prof_mystic`, Convencimento→`prof_persuasion`, Intimidação→`prof_intimidation`, Intuição→`prof_insight`, Enganação→`prof_deception`, Motivar→`prof_motivate`, Ofício→`prof_craft`+`craft_attr`.
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

- Versionamento semântico. Última versão publicada: **v1.3**.
- No modelo antigo: zip completo `Khalkaria_Html-v{X.Y}.zip`, nunca patch parcial.
- Trabalhando no repo local via Claude Code: commits atômicos, mensagem descritiva em PT-BR.
- Excluir sempre: `.DS_Store`, `__MACOSX/`, `old_ref/`.
- Ao final de cada entrega: sumário conciso das mudanças + sinalizar divergências do Notion pendentes de decisão.

---

## 9. Notas operacionais

- **Obsidian:** o plugin Local REST API roda no PC do Pedro; este ambiente remoto **não** o alcança. O vault é a pasta `obsidian/Khalkaria/` versionada no repo.

- **Notion:** `notion-fetch` por UUID é mais confiável que por URL. Contar linhas direto do conteúdo — blocos de resumo ficam desatualizados (ex.: "Raras: 60" quando o catálogo tem 59).
- **Imagens:** URLs S3 do Notion expiram em ~1h e o sandbox bloqueia download. **Nunca tentar baixar** — o Pedro substitui `images/*.png` manualmente.
- **O Limiar:** **168 cartas** no Notion (2026-09-04). Catálogo 127 = Universais **8** + FOR/DES/CON/INT/SAB 12 cada (60) + Raras 59. Abismo = 18 Dores + 23 Benefícios (**será refeito** pelo Pedro; jogadores ainda não chegaram lá). Página viva `3a66e3a4-01d9-806d-b1f8-d6975255f676`. Bloco-resumo desatualizado ("130 / Universais 10 / Raras 60") — contar tabelas inline. A cada nível: 5 cartas + "+2 atributo"; 5–11 cartas ao nível 5. Site: raras só ícone+requisito+nome — **intencional** (jogadores não veem efeito). Site tinha 2 universais inexistentes no Notion ("Marca do Guerreiro", "Postura de Ferro") — Notion vence. Cartas raras usam apenas recursos universais — nunca FLUXO/Concentração.
- **Site é sempre complemento do Notion.** Em qualquer divergência, Notion vence; nunca "corrigir" o Notion a partir do site.
- **Bazar `Lore/Notas`:** escrito por IA, **não-canônico** até validação item a item. Já falsos: "Bastão de Karmath vs Teurgos". "Não funciona acima da Marca 4" é item de Vytália, não de Karmath.
- **Memória do agente:** `docs/memoria/` — `VARREDURA_NOTION_2026-09-04.md` (relatório), `digests/A..F` (por ramo), `notion_raw/` (páginas brutas), `respostas_pedro_2026-09-05.md` (**cânone dito pelo Pedro — tem precedência sobre o Notion**), `fidelidade_notion_vs_pedro_2026-09-05.md`, `mapas/`. Ler os digests antes de refazer qualquer varredura.
- **Vault Obsidian:** `obsidian/Khalkaria/` — pasta de `.md` com wikilinks; Pedro abre como vault local. Convenções em `obsidian/Khalkaria/_meta/CONVENCOES.md`. Toda página nova de lore nasce lá E no Notion.
- **Correções no Notion:** typos, frases truncadas, contagens e grafias (lista C) podem ser aplicadas direto, **sempre registradas em `docs/memoria/log_notion.md`** (antes → depois, página, data). Em dúvida: comentário no Notion, não edição.

---

## 9b. Lore — cânone confirmado pelo Pedro (2026-09-05)

**Toda a lore é privada (GM).** O site não publica lore.

- **Panteão (cargos, não pessoas):** Kha (deus supremo; o original foi **sequestrado**; o cargo pode ser ocupado por mortal que agrade os 5), Vytália (deusa das criaturas/seres; povoou os planos), Malkhor (Pecado; criou a Vhelor; "não é o deus do mal"), Velúria (magia; dona do plano Místico; criou o **Éter** e **o Limiar**; tece o **tempo**), Mundarak (mundo; criou o **espaço** e o plano material), **Karmath — deusa** da justiça (mortais a veem como homem implacável, erro deles), Osh'Kar (morte; preso no **Abismo** só no plano material). Deuses atuais nunca foram mortais.
- **Planos:** Primórdio/Plano Primordial (dos deuses; atemporal e binário; estar nele torna qualquer um deus), Místico (Éter), Material (de Mundarak), Plano dos Mortos. **Oblívio = proposto, não canônico.**
- **Éter/Limiar:** todo ser tem Éter; ele é a chave que abre ponte Místico→Material e puxa mais Éter do que gasta. O Limiar (cria de Velúria) media a passagem, barra aplanares e impede sucção excessiva. "Forças materializantes" = termo antigo para isso. Origem do Éter no plano Místico: **não criada**.
- **Kharavel:** continente-aposta entre Vytália e Malkhor. A **Vhelor** (Grande Árvore) tem no cerne **o Sonhador**: casulo com 1 criatura; quanto mais maligna, mais a árvore cresce e mais viciosas as substâncias. Coração puro entregue = destrói a árvore de dentro. Sonhador atual = **Sinikko original**. **Lena Skarv** (Dryad, 15) = plano secreto Vytália+Karmath, coração puro, filha adotiva de **Alvak Krichama** (anão ferreiro; filha morreu na travessia de Volkrest; executou 2 soldados Serafélia para salvá-la).
- **Sessão 0 (−27 anos):** equipe **desfloreio** (Vorn Drekar, Klaus von Aldric, Sinikko Kiriam, Runa Skorn, Azgar Sandgale — 1 por continente, intencional) contratada por Kirkushav Drekar (Império de Ferro) para destruir a Vhelor. Bilhete de Sevic é de 1 dia antes da chegada de Kirkushav. Karma (escrava, bênção de Karmath) lê o passado de Sinikko, profetiza que em 27 anos Revavena derrota Khaskavel e a Vhelor, e desaparece misticamente. Rastas fugiram e fundaram **Revavena do zero**. Sinikko vira o Sonhador; Malkhor cria um **clone** que governa Khaskavel, corta laços com o Império e quer contaminar Kharavel com seiva.
- **Sinikko** não é filho de Kirkushav (Vorn é); nasceu nos esgotos, subiu a representante gruto e imperador de Khaskavel — as 3 versões são fases. Kirkushav o treinou como sucessor e desistiu ("populista"). Kirkushav planejava matar os Sandgale; Terk (pai de Azgar) matou o Batedor.
- **Kheyos:** teurgo **mortal** (não semideus), conhece a política dos deuses, quer proteger o plano material da ingenuidade divina. Laboratório = "Casa Isolada" no SE de Khaskavel.
- **Khaskavel** nasceu diarquia (família de Sinikko + outra, descartada). **Anões:** Krichama ferreiros, Caxon engenheiros; Jairo (castelo) ≠ Alvak (cidade).
- **True ending da campanha 1:** derrotar o clone → brecha de Karma → 1 jogador entra no Primórdio e enfrenta Malkhor. Vitória = vira o novo deus do Pecado. Derrota = alma pertence a Malkhor.
- **Grafia oficial:** Vytália · Vanguarda Serafélia · Império de Ferro · Vanguarda do Ferro · Runa Skorn · Luxária · Acólito · Exaustão · Sangramento · Envenenamento · Castelo de Kirkushav · Etérico.
- **Método do Pedro:** geografia → regiões de facções → história. Ler os mapas (`docs/memoria/mapas/`) antes de escrever lore.

---

## 10. Não fazer

- Não inventar conteúdo canônico nem preencher lacunas em silêncio.
- Não editar HTML de conteúdo à mão após a migração para JSON.
- Não usar IDs de âncora gerados por índice.
- Não travar aquisição de item do Bazar por dinheiro.
- Não implementar sorteio de cartas do Limiar.
- Não reescrever texto narrativo do Pedro em bloco — edições narrativas são cirúrgicas e preservam vocabulário e imagens originais.
- Não usar `localStorage` como único meio de persistência sem oferecer Export/Import.
- Não publicar lore no site (toda a lore é privada do GM).
- Não publicar a raça Lobisomem no site.
- Não confiar na coluna `Lore/Notas` do Bazar como cânone.
