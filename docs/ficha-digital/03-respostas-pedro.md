# Ficha como hub — respostas do Pedro (2026-09-26)

Respostas às decisões abertas do `02-plano.md` (§8) e orientações novas. Texto do Pedro
preservado; onde ele respondeu por nota, a nota vale sobre o rótulo da opção.

---

## 1. Orientações gerais

**CSV público (D32):** "Pode deixar, meus jogadores não vão ver." O CSV e `tools/` continuam
servidos pelo Pages; sem `_config.yml`. A checagem de spoiler do plano sai.

**Organização:** documentação do projeto em `docs/`; `docs/ficha-digital/` guarda o
pedido, o plano e estas respostas. Os JSON do balanceamento que o build lê ficam em
`data/balanceamento/`, publicados (D3).

**Hub (D1):** página própria da ficha + drawer que empurra. Com um **modo de visualização
Mesa**, onde se usam itens consumíveis e armas, rolam-se perícias, simula-se ataque com arma
usando a PMA etc.

> "Aqui é gelo fino, muitas classes tem técnicas únicas que mexem diretamente com esses
> campos como pma, recupera vida e etc, mas isso é um escopo muito maior desnecessário. A
> simples opção de conseguir alterar seus campos manualmente, em todos os campos é a mais
> segura, as vezes o cálculo não levou algo em consideração ou sejam efeitos temporários."

→ **Todo campo da ficha é editável à mão**, inclusive os calculados. A conta continua visível
e o ajuste manual fica marcado e removível.

**Bazar com a ficha aberta (D2):** "deve ter um modo especial para isso mais organizado"
(inventário no trilho, conforme a opção marcada).

**Ficha física A4** (5 páginas) enviada como referência de campos, ver §4. Ela não tem as
regras novas (estresse, magias de nível 5).

## 2. Assistente de criação (D4, refinado)

Progressão oficial base dos PCs, nas palavras do Pedro:

1. **Definição de Atributos:** role 4d6 5 vezes, a cada rolagem retire o pior dado; com os 5
   valores, distribua-os entre seus 5 atributos; você pode retirar 1 ponto de um atributo e
   adicionar a outro.
2. **Raça:** define atributos base, movimento, perícias (às vezes com escolha), expectativa de
   vida, altura, peso, características de raça e 1 técnica de raça.
3. **Classe:** "isso aqui define muita coisa e molda completamente a build, quero algo bem rpg
   like building style". Atenção a: **Vitalidade, Vigor e Ressonância** (constante
   multiplicativa com o nível na fórmula da classe, única em cada classe, molda o playstyle);
   **Treinamento** (armas, perícias); **CD**; **Característica de Classe** (importante: muitas
   classes têm medidores quantitativos aqui); **técnicas gerais**; **técnicas de tier 1, 2 e
   3**, com escolha de ramo em cada uma — "uma tela multi-opção bem trabalhada com a estética
   de cada ramo deve ser bem apresentada para escolher as técnicas de tier 1, 2 e 3"; **Marcas**.
4. **Origem:** define itens iniciais, técnicas de origem e treinamento.

"Quero todo passo a passo alterável e retornável aos passos anteriores a todo momento."

Nota da D4: "Sim, com rolador adicional, trabalhe em um criador de personagem intuitivo com
passo a passo bem definido. Cuidado com as 4 técnicas do limiar, isso é só a partir do nível 2.
Citei no prompt a progressão de PC para você ter de base, claro tem as técnicas das classes que
são alteráveis em descansos curtos, magias que teurgos podem escolher e muito mais."

Nota da D30 (faixa 8–18): "Se a soma de um valor der menos de 8, role os 4 dados novamente, por
isso 8-18, não 8-20. Permita a inserção manual dos atributos caso sejam rolados na vida real."

## 3. Decisões

| Id | Resposta | Nota do Pedro |
|---|---|---|
| D32 | Aceitar público | — |
| D26a | Aplicar a mecânica | Ver §3.1 (Marcas da Vhelor) |
| D26b | Sim, explicitar no CSV | — |
| D30 | 8–18, gravar no Notion | Soma < 8: rola de novo. Permitir digitar atributos rolados na mesa |
| D31 | Corrigir tudo; tique no início do turno do afetado | — |
| D1 | Página cheia + drawer que empurra | + modo Mesa; todo campo editável (§1) |
| D2 | Inventário vai para o trilho | Modo especial, mais organizado |
| D3 | `data/balanceamento/` publicada | — |
| D4 | Outra | Criador passo a passo, com rolador (§2) |
| D5a | Grau | "Acho que é grau, mas a compatibilidade com o bestiário não é tão importante." |
| D5b | Não, só no nativo | — |
| D6 | Sim, as três | — |
| D7 | Maior em todos | "Maior mas com escolha de mudar" |
| D8a | Não soma | "No cálculo de evasão passiva já vai mod. destreza, então apenas a rolagem do dado." |
| D8b | Outra | "No site está que a evasão passiva é 10 + Mod.Des e ativa é 10 + mod.des + prof.defender, mas é ativa 10 + mod. des + Dado Defender." |
| D8c | Neste turno do agressor | "É apenas contra o alvo que te atacou durante o turno dele. Ataques de outros alvos usam sua evasão passiva." |
| D9 | Automático com detalhamento | "Bom ser auditável on the go." |
| D10 | Usos por recarga + munição em uso; Bolsa Dimensional depois | "A mesa deve ser modular conforme os itens no seu inventário, mostrando ações possíveis, aplicando condições (algumas stackam, sangramento por exemplo), rolando perícias, ataques, magias e dados de dano. Tudo com css organizado e estiloso." |
| D11 | Manter sem efeito; campo livre | "Traga e faça um script para adicionar cada carta individualmente para quando eles realmente pegarem as cartas, então oculto até o script rodar e comitar." |
| D12 | Contador de saldo com aviso, sem trava | "Existe o abismo na página do limiar, que qualquer jogador pode usufruir, contudo, a raça corrompido tem sua própria tabela de corrupção que é única." |
| D13a | 5 | — |
| D13b | Corrigir para 4–12 | — |
| D13c | 2 pontos livres | "Sempre que você sobe de nível, ganha +2 pontos de atributo; o limiar oferece 5 cartas + uma carta especial +2 atributo que SEMPRE custa 2 pontos de limiar, mesmo sendo a primeira carta escolhida, e só pode ser escolhida 1 vez por mão. Você pode distribuir os pontos dentre dois atributos conforme queira." |
| D14a | Consome antes | — |
| D14b | Sim, agora | — |
| D15 | Não soma (fica a maior), gasta primeiro, some no descanso longo | — |
| D16 | 1 ativa | "Toda magia sustentada tem em sua descrição quanto gasta de éter por turno; o padrão é o éter gasto na canalização da magia, mas só se não tiver escrito na descrição da magia." |
| D17 | Responder (a)–(d); promover Agarrado; não promover Marcado; "ultrapassar" nos dois | "Exposto é removido após ser acertado por um ataque. Você fica desnutrido para cada dia que descansou sem se alimentar (consumir 1 item do tipo comida) ou não teve luz de fogueira ou outras fontes. Exaurido e Oco são removidos quando você sai dos negativos nos 2 status Stamina e Éter." |
| D18 | 1 ação em si, 1 em outro, arremesso segue o item | "Apenas 1 magia conjurada por turno e ações livres infinitas." |
| D19 | Reserva visível como "comprometida" | "Tudo removível e auditável." |
| D20 | Sim, em lote | — |
| D21 | Criar a manobra Investida | "Passou a existir agora, está no Notion." |
| D22 | Os 11 atípicos, sem Força nem Primordial, nos três | — |
| D23 | Avisar | "Com pop-up de confirmação." |
| D24 | Ratificar as duas | — |
| D25 | Corrigir a grafia e ler como requisito | — |
| D27 | Por ramo, modelo do Espadachim | Ver §3.2 |
| D28 | Sim nos quatro | "Deixa a animação do limiar, pode melhorar mas a página já é bonita, só assemelhe todo o site para ficar coerente." |
| D29 | Vem do Notion: JSON verbatim, gerador mapeia para glifo | — |

### 3.1 Marcas da Vhelor (D26a)

"Sim aplica, privacidade não é problema. [...] O único problema é se eu quiser trocar isso no
futuro." Texto do Pedro:

> Cada folha, seiva ou casca consumida adiciona **1 Marca da Vhelor**. As Marcas se acumulam e
> não regridem facilmente.
> 1. Marca dourada angular surge na pele (cosmética, mas **detectável por cultistas**, que
>    reconhecem os seus). Sonhos ocasionais com a Vhelor.
> 2. −10 de Éter máximo permanente (Regras de Magia). Todo amanhecer: teste de Vontade
>    (Atributos e Perícias) com CD crescente ou sente compulsão de consumir mais.
> 3. **Vício estabelecido.** Sem consumir 1 folha por semana, entra em abstinência: −2 em todas
>    as rolagens e Desorientado até consumir.
> 4. Pele clareia visivelmente, perdendo cor até um branco doentio. Olhos perdem foco. −5 em
>    interações sociais (não-corrompidos sentem repulsa instintiva). Ouve sussurros constantes
>    da Vhelor.
> 5. Em situações de stress ou combate: teste de Vontade ou fica *descontrolado* e age com
>    agressividade pecaminosa involuntária por 1 rodada (ataca o aliado mais próximo, comete
>    crueldade gratuita).
> 6. **Quase-não-retorno.** O GM ganha o direito de ditar 1 ação pecaminosa do personagem por
>    sessão. O personagem sente lucidamente que está se perdendo — e não consegue parar.
> 7. **Sucumbência.** O personagem vira NPC sob controle do GM: uma criatura corrompida da
>    Vhelor, agente involuntário de Malkhor. O jogador perde o personagem — que pode reaparecer
>    como mini-boss depois.

UI pedida: "Uma tela corrompida com raízes saturadas com alto contraste mostra esses textos ao
ter consumido os itens." O texto das 7 marcas mora num único arquivo de dado, para poder mudar
depois sem mexer em código.

### 3.2 Páginas de classe (D27)

"Primeiro uma seção header com a imagem da classe e a descrição estética, com o título em fonte
personalizada bem punk; descendo, as informações básicas; mais baixo, com a página em transiente
com cor personalizada por classe, técnicas gerais e característica de classe; abaixo, as marcas;
e mais abaixo os 3 ramos em 3 colunas estéticas e personalizadas com o ramo em questão, cards
bonitos e repaginados, integração de tudo com a ficha."

## 4. Ficha física A4 — campos (referência de layout)

1. **Núcleo:** Nível, XP · Nome do Personagem, Jogador, Raça, Classe, Origem · 5 atributos com
   ilustração (Força: punho de raízes; Destreza: flecha com ramos; Constituição: coração
   anatômico; Inteligência: livro com raízes; Sabedoria: árvore), cada um "Atributo / Mod." ·
   perícias em duas colunas, cada uma com 4 círculos +2/+4/+6/+8 e caixa de total: Atacar (For),
   Defender (Des/Con), Movimento (For/Des), Fortitude (Con), Vontade (Sab), Reflexos (Des),
   Percepção (Sab), Sobrevivência (Sab), Furtividade (Des), Crime (Des), Iniciativa (Des) ·
   Conhecimento (Int), Medicina (Int), Investigação (Int), Religião (Sab), Místico (Int),
   Convencer (Des/Int), Intimidar (Con/For), Intuição (Sab), Enganar (Des/Int), Motivar (Sab),
   Ofício ( ) · Recurso de Classe (Atual/Máx.) · Saúde (coração vermelho), Stamina (raio azul),
   Éter (espiral dourada), cada um Atual/Máx. · Movimento (pé com raízes), Sins (moeda), Evasão
   (escudo), CD (mão com garras) · Equipamentos + Qtd, Peso Máximo (2 + Mod. Força) ·
   Bugigangas + Qtd, Peso Máximo (10 + Mod. Força) · Armadura e Resistência: 12 tipos com R e I
   (Ordinário, Fogo, Frio, Elétrico, Veneno, Ácido, Psíquico, Força, Radiante, Trovejante,
   Necrótico, Primordial), cada rótulo na cor do tipo.
2. **Técnicas & Marcas:** Técnicas Gerais (9 × Nome/Ação/Recurso + texto) · Técnicas de Ramo:
   Tier 1 (3), Tier 2 (2), Tier 3 (1) · Marcas (3 × Nome + texto) · Técnicas Diversas (9).
3. **Cartas, Lore & Outros:** 11 molduras de carta (4 + 4 + 3) · História · Outros.
4. **O Bazar:** Bugigangas (Nome/Raridade, depois Nome/Ação/Recurso) · Equipamentos: Pesados (2),
   Leves (3), Armas e Outros (3), com Nome/Raridade · Materiais por raridade com Qtd (lista da
   ficha anterior ao CSV v26; vale o catálogo do Bazar).
5. **Grimório:** Níveis 1–4 (8 fichas cada) com Nome, Ação, Alvo, Resist., Alcance, Duração e
   texto. Hoje são 5 níveis.

Moldura gótica com raízes, títulos em blackletter (o site já carrega `--font-gothic`).

## 5. Respostas de 2026-09-26 (depois da F0)

| Id | Pergunta | Resposta |
|---|---|---|
| D33 | Efeitos das raras já em branches públicas | Oculto só no site; as branches ficam como estão |
| D34 | Tiers e Marcas no nível 1 | Tiers à vista, travados, com o nível que destrava; escolha na subida |
| D35 | "4 técnicas do limiar" | "Era cuidado com as draw de cartas do limiar, isso só acontece a partir do nível 2, toda mão você tem 1 carta grátis e pode gastar pontos do limiar ou queimar 1 carta, conforme as regras no notion." |
| D36 | Uma ficha ou várias por navegador | Várias, com seletor |
| — | Linhas que só existem no site (Descanso Curto "Outros… Ações criativas a critério do mestre"; abertura do ataque natural em Tamanho) | Ficam |
| — | "Evasão = Determinada pela sua classe" no Sistema do Notion | "Vale, pode reescrever." Reescrito no Notion e no site: "Sua Evasão base é 10 + Mod. Destreza, igual em todas as classes, e define se você desvia/resiste o dano quando alvo de um ataque." |
| — | Faixa 8–18: antes ou depois de mover o ponto | "Apenas para o valor rolado, o ponto pode ultrapassar e reduzir superando o limite." |
| — | Espadachim e Teurgo têm recurso de classe? | "Tem sim, teurgo também. Todas têm." |

Cores de recurso (depois das fotos): Saúde vermelho, **Stamina amarelo**, **Éter verde e roxo**. Recolorir os ícones de Stamina e Éter da ficha física: autorizado.

**Tooltip de fórmula (2026-09-26):** "quero tudo que tenha cálculos com tooltip mostrando a fórmula." Todo número calculado, na ficha e no site, mostra a fórmula simbólica e a conta com os números (plano, M2).
