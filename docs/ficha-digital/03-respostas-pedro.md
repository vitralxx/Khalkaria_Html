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

## 6. Lote de revisão do balanceamento (L01–L45), respostas de 2026-09-26

Itens em `15-ficha-rodada3.md` §E (branch do balanceamento). Os que o Pedro respondeu direto ao balanceamento viraram D92–D97 (L03, L05, L07, L15, L22, L36); L14, L35, L39 e L20 seguem com ele; a L45 foi feita pelo agente de HTML.

| L | Resposta | Nota do Pedro |
|---|---|---|
| L01, L04, L06, L09, L10, L11, L12, L17, L24, L25, L27, L28, L31, L32, L33, L41, L42 | Aceito | — |
| L02 | Aceito | "Achei meio confuso esse texto." |
| L08 | Outra | "É a inteligência de quem craftou o item em poções." |
| L23 | Outra | "Porém ainda tem, se receber dano que zera seu fluxo." |
| L26 | Aceito | "Sim se soma e Ae(Todos) sempre exclui dano de força e primordial, porém abrange todos os danos atípicos (não inclui cortante, contundente, perfurante)." |
| L29 | Aceito | "Geralmente a notação oficial nas técnicas é 1x/Descanso Longo e não 1x/dia; 1x/sessão de fato existe na terminologia, 1x/semana também e 1x/campanha também." |
| L30 | Aceito | "Nenhuma condição que exige descanso longo para ser removida é removida ao descansar sem comida ou uma fonte de luz." |
| L34 | Aceito | "Ae(x, categoria) sempre abrange todos os tipos de dano dentro daquela categoria. Quando um dano é dado como uma categoria é da escolha do jogador, qualquer tipo de dano da categoria." |
| L13, L37, L40 | Como o balanceamento recomenda | — |
| L38 | Como o balanceamento recomenda | O nome é "Elixir da Expurgação". |
| L43 | Como o balanceamento recomenda | "Os pergaminhos não foram ajustados à nova lógica de magia, peça pro balanceamento ajustar e te mandar o csv do bazar novo." |
| L16, L18, L21 | Vale o primeiro | — |
| L19 | Vale o primeiro | "Essa técnica do brutalista está desatualizada, preciso de um log de todas as técnicas do sistema e se elas estão funcionando na ficha interativa ou não." |

## 7. Respostas de 2026-09-26 (depois da F1c)

- **Bazar, cards:** "Preciso de uma representação visual melhor em cada card de carta no bazar, todos os chips têm a mesma paleta, e as raridades também, melhora a intuitividade e organiza a coisa, adiciona opção de diminuir e aumentar o tamanho da escala dos cards."
- **Foco e movimento:** "Sim contorno de foco e movimento reduzido, como opção o movimento reduzido, contorno âmbar pode deixar nos links, botões e campos brilhando sutilmente no teclado destaca." → foco âmbar com brilho sutil só no teclado (`:focus-visible`); movimento reduzido como **opção** do usuário.
- **Ficha × site:** "A ficha pode empurrar o site para a direita em vez de abrir por cima, um esquema de abas reordenáveis pode ser implementado." → a ficha empurra o conteúdo em vez de sobrepor; abas da ficha reordenáveis. Lado confirmado: **a ficha à direita** (onde o painel já abre hoje), apertando o conteúdo.
- **.gitattributes:** "Faz." (feito, c6dc56f).

## 8. Comerciantes e papéis, respostas de 2026-09-28

Pedido original (M8 do plano): área do mestre para criar comerciantes e organizar prateleiras de forma visual; todo comerciante começa no nível 1 e sobe pela tabela de Sins; o site controla o estoque de Sins; o comerciante compra itens por uma taxa em cada nível; o jogador rola Convencimento para baixar o preço; o site calcula quanto cada item rende em cada nível; o mestre infla ou reduz o preço do que está à venda.

- **Ordem:** a loja (FC) entra **depois da ficha nova** (F4). A sincronização das respostas do balanceamento vem antes das duas.
- **Visibilidade e papéis:** "Recomendo estruturar uma separação de privilégios para o futuro do site, pode ser dessa forma que propôs." → papel **mestre** ligado por `?mestre=1`, lembrado no navegador (como a prévia `?ficha=v3`) e desligado por `?mestre=0`. Tudo que é do mestre fica escondido para quem não ligou. O mecanismo é geral, para o site crescer em cima dele (plano §3.4).
- **Pechincha (C1):** "Não tem número fixo, depende do roleplay e rolagem do jogador." → o site rola Convencimento e mostra o resultado; o desconto é o mestre que digita, em % ou em Sins.
- **Porcentagem de venda (C2):** "A porcentagem de venda é para os itens comprados pelo comerciante dos jogadores." → 50/66/75% é o que o comerciante paga quando **compra** do jogador. Continua com o balanceamento: se incide sobre o valor rolado ou sobre a média, e o arredondamento.
- **Quem compra (C3):** "O comerciante compra itens dos jogadores, assim como os jogadores compram itens dos comerciantes." → todo comerciante compra. Continua com o balanceamento: se cada um compra só a própria categoria.
- **Sins insuficientes (C6):** "Quando o comerciante não tem sins suficientes para comprar um item do jogador, ele oferece o restante, caso o jogador rejeite não há troca." → o comerciante oferece o que tem no estoque; o jogador aceita (o estoque zera) ou recusa (nada acontece).
- **Reposição (C6):** "A reposição pode ser manual, só exibe a informação de quantos dias demora." → botão manual "Repor"; o balcão só informa o prazo da reposição (diária, pela tabela).

## 9. F4, desenho da ficha nova: respostas de 2026-10-02

Pedido do Pedro no mesmo dia: "enquanto o rework do batedor não vem, comece a implementar as funcionalidades que irão trazer a interatividade planejada anteriormente [...] tome cuidado para não assumir nem realizar nenhuma ação sem antes entender se isso é uma abordagem segura e inteligente."

Escolhidas as 4 opções recomendadas:
- **Página da Ficha (5 abas do A4) antes da migração real:** **escondida até a virada.** Só aparece para quem ligou a prévia (`?ficha=v3`); para os jogadores nada muda até a migração, que é perguntada antes de ligar.
- **Drawer à direita que empurra o conteúdo:** **só na ficha nova**, atrás da prévia até a virada. A ficha atual (v2.1) continua abrindo por cima.
- **Abas reordenáveis:** ordem **por navegador** (drawer e página da ficha). Vale para todas as fichas daquele computador; é preferência de tela e não vai no export.
- **Ficha fechada:** **trilho fino de 48 px** à direita com mini barras de Saúde, Stamina e Éter; acende ao arrastar algo e abre ao soltar em cima. O conteúdo perde 48 px.

## 10. Revisão da ficha nova pelo Pedro, 2026-10-19 (prints da página no Ensaio)

- **Selo "DECISÃO" nas perícias de dois atributos** (Movimento, Convencimento, Intimidação, Enganação) e na CD: "Não entendi os 4 selos de decisão em perícias, todas tem a mesma regra, as perícias utilizam 2 atributos base, o maior sempre prevalece no cálculo, e é só isso." / "Todos os selos que pedem decisão na ficha, já foram explicados, é sempre o maior atributo. esclareça no box de informação do cálculo em todos os lugares."
  - Correção do Pedro na mesma conversa: "inclusive, pode adicionar a opção de mudar manualmente sim o atributo que a perícia usa, porém por padrão calcule com a maior, isso que quis dizer."
  - Consequências:
    - **sai o selo** desses números;
    - o tooltip diz **"usa o maior entre Mod.X e Mod.Y"** (ou o atributo escolhido, quando o jogador trocou);
    - **troca manual do atributo:** sim, nas perícias de dois atributos (e na CD com escolha). O padrão é o maior (D7 mantida, agora sem selo; o item da auditoria A1 sobre essa escolha continua valendo).
- **Variante:** o box não tem as 3 subespécies do Inseto (Besouro, Louva-deus, Barata). Corrompido e Autômato são as únicas raças sem variante. Pergunta: a tabela de corrupção e os itens acopláveis (tecnologias) do Autômato estão sendo trabalhados na ficha?
- **Box "Ajustar":** "Gostei desse box que deixa mudar quase TODOS os cálculos, perfeito, só acompanhar o temporária quando criar a mesa."
- **Layout:** "A seção 'Capacidade' pode ir para baixo das perícias e à esquerda de Evasão, CD e Movimento."
- **Armadura e Resistência:** os nomes dos tipos clipam por cima das colunas R/I/V. A separação entre campo bool (R/I/V), campo de dado e campo numérico "é uma abordagem perfeita para o cálculo e intuitividade na ficha".
- **Marcas da Vhelor:** "vital que esteja oculta por padrão, e ao utilizar algum item que dê uma marca mostrar."
- **Efeitos dos 600+ itens do Bazar:** "utilize uma estrutura inteligente que tem como base uma tabela exclusiva que infere quais são as alterações na ficha a partir de cada item, tabela essa que deve ser feita pelo agente 'khalkaria bazar balanceamento'." Os gatilhos são estar no inventário, equipar e consumir.
- **Mensagens do motor:** o aviso "Inseto: os atributos variam por subespécie, e a ficha não tem uma" está correto. Ele pede: "Revise essas mensagens de erro para encontrar quaisquer discrepâncias do funcionamento do sistema pela ficha."

## 11. Respostas sobre a entrega rev. 11 do balanceamento, 2026-10-20

Quatro perguntas, todas respondidas com a opção recomendada.

- **D154 x troca manual:** vale a correção do Pedro. O cálculo usa por padrão o maior, e o jogador pode trocar o atributo à mão. A rev. 11 gravou "sem troca manual" no contrato e no Notion. Ela volta ao balanceamento para ser refeita nos dois. O motor do site já mantinha a troca e não lê a flag `trocavel`.
- **Stamina e Éter (FOR ou DES; INT ou SAB):** seguem a mesma regra das perícias, ou seja, o maior por padrão, com troca.
- **Marcas da Vhelor:** a seção continua visível quando o Elixir da Expurgação leva o contador de volta a 0. Ela só fica oculta até a primeira Marca.
- **Comerciantes (C3):** cada comerciante compra só a própria categoria, e o Sucateiro compra tudo. Fica coerente com a marca Homem de Negócios do Pecador.
- **Troca manual padronizada (2026-10-21):** "pode deixar a opção de troca manual no cálculo dos status, padronizando como uma classe esse tipo de troca manual em cálculo, outras partes da ficha já utilizam isso também." Feito com o `KhTroca` (`js/ficha/kh-troca.js`), que é a mesma regra, o mesmo caminho de edição (`troca.<chave>`) e o mesmo componente visual (`.kh-troca`) para as perícias de dois atributos, a CD com escolha, a Stamina e o Éter. Fora do Ensaio, Stamina, Éter e CD agora mostram o atributo usado, como as perícias.

## 12. A Mesa, 2026-10-21

- **O pedido:** "A aba da mesa é destinada para o jogador utilizar: Técnicas (de raça, classe, origem e outros...), Perícias, Itens, Cartas do Limiar, manobras de combate, e basicamente tudo que está no sistema." Sem flood, com um estilo próprio para a aba. "A aba da mesa, NÃO trackeia inimigos ou outros aliados [...] o alvo é selecionado no tabuleiro real, a mesa serve apenas para esclarecimento de regras, rolagens de dado e cálculo automático de atributos, status e perícias, além de outros itens no inventário." Alguns itens só fazem sentido em combate, e por isso a Mesa também simula o combate, sem ser a única função.
- **Três perguntas, todas na opção recomendada:**
  - **organização:** por grupo (Combate, Técnicas, Magias, Itens, Perícias, Cartas), com filtro Ação/Reação/Livre e as passivas recolhidas em "Sempre valendo";
  - **Mão:** sim, até 8 atalhos fixados pelo jogador, guardados na ficha;
  - **drawer:** sim, a Mesa compacta (barra do turno, Mão e registro).
- Especificação: `10-mesa.md`.

## 13. A Mesa, críticas à 1ª prova (2026-10-21)

- **Turnos e modos:** "ela não rastreia alvos, porém rastreia turnos, atacar duas vezes sem passar o turno conta o pma -5 no segundo ataque, isso vale um modo combate e um modo exploração para dividir essas regras". A divisão das mecânicas foi pedida ao balanceamento (`10-mesa.md` §9.C).
- **Registro:** "Sugiro que o registro deixe de ser uma lista de log e passe a ser a seção centro da tela que tem a arte estética de uma mesa de rpg, quando rola dados eles aparecem." Sem custar utilidade.
- **Equipamento:** um painel com um boneco: 1 item em cada mão, 1 armadura pesada, 2 leves, 3 itens mágicos sintonizados; o resto no inventário. Ele mesmo apontou o risco de pôr 2 itens de duas mãos, um em cada mão (pergunta 9.E ao balanceamento).
- **Painel do jogador:** Saúde, Stamina, Éter e o recurso de classe ao lado do boneco; abaixo, ações em losango (gastar deixa amarelo-escuro), reação em losango oco, ação livre compacta, magia (pode ou não conjurar: Foco numa das mãos e Treinado em Místico) e movimento; condições numa barra abaixo do boneco, com "+ condição".
- **Turno:** "Encerrar meu turno" na mesa; "sair do combate" vira um interruptor Combate | Exploração em cima, à esquerda; ao começar o combate, a ficha fica a uma aba de distância, não no drawer, mas o drawer também existe e funciona.
- **Tempo:** o botão não abria nada. As rodadas viram um trilho acima da mesa, com um resumo do que aconteceu com o personagem em cada rodada.
- **Favoritos:** favoritar qualquer coisa continua; sem o requisito, fica obscurecido, não clicável e sempre com o motivo. Consumir item não exige pô-lo na mão: a ação de consumir já inclui pegar e guardar.
- **Habilidades:** a seção mais trabalhada, com as abas Combate, Técnicas, Magias, Itens, Perícias e Cartas; favoritar, usar, arremessar, aplicar, ativar; quantas ações custa, toda a informação e link para a regra. Os filtros Ação, Reação e Livre ficam.
- **Textos:** cuidado com o que vai para o site, que pode vazar ponderação interna. Ele gostou da duração no chip ("até o fim do seu turno") e do resumo nos chips. Perguntou se as frases-resumo das técnicas da prova foram escritas pelo agente: **foram**, à mão. A 2ª prova tirou essas frases, e a Mesa real monta a linha curta só dos campos da tabela do balanceamento (`10-mesa.md` §3.7). O chip do Acelerar passou a dizer "nesta rodada", que é o texto do Sistema.
- **Respostas às 3 perguntas da rev. 1:**
  - "nenhum status passa seu valor máximo na cura";
  - "Acabar seu turno não gasta reação, certas técnicas, retalhar e defender gastam reação. Então, no inicio da próxima rodada você sempre ganha +1 reação, limite sempre 1 por padrão, tem técnicas que aumentam isso";
  - custo de técnica: "Isso vale uma tabela feita pelo agente de balanceamento para não errar nenhum custo, o fluxo é um requisito, a concentração do artilheiro já não chega a ser, é gasta sempre que usada. e quando no custo tem virgulas é complementar não opcional".
- **Ordem do trabalho:** revisar o plano e ver se algo agendado é mais importante que a Mesa. Nada é: a F4.6d (condições ativas, Saúde temporária, quantidade) entra na Mesa 1–2, que precisa dela; a F4.7 depende do ok dele; a FC e o Batedor esperam o balanceamento.
- Especificação: `10-mesa.md` rev. 2. Prova: `tools/artefatos/prova-mesa.html` (2ª versão).

## 14. A Mesa, críticas à 2ª prova (2026-10-21)

- **Comerciantes:** C3 confirmada (cada comerciante compra só a própria categoria; o Sucateiro compra tudo). C4: "equipamentos são compostos por arma armadura e escudo".
- **Linha curta e caixa da conta:** a linha montada só de campos está aprovada, mas ele teme a quantidade de técnicas; o ideal é valer para todos os assets. A caixa da conta do ataque desarmado (Ataque, Dano, Crítico, Fluxo) é "exatamente o propósito da mesa": trazer o implícito da técnica, magia ou carta ("quando a técnica fala você tem nível+3 usos, essa caixa deve mostrar coisas assim"). Ele mesmo aponta que automatizar isso por script pode ser inviável e que acertar a caixa em todo asset é um desafio.
- **Fórmulas:** nenhum campo da Mesa mostra a fórmula. As fórmulas da ficha às vezes têm informação demais. O ideal: a origem de cada coeficiente e constante, **sem texto corrido**, com exceção para regras específicas ("Escolher o maior", Vitalidade, Vigor e Ressonância referenciando a classe…).
- **Visual:** aprovou a mesa de rolagem e a pilha compacta, as cores, formatos, ícones, fonte e brilho. Falta **design por camadas**: contraste e seções (o avatar, o bloco dos atributos), e ergonomia na posição de cada recurso e campo. Hoje tudo está sobre o mesmo fundo e fica aglomerado.
- **Trilho:** cresce com o uso e estica a página toda; a caixa das rodadas está "feia e simplória".
- **Favoritos:** a lógica (requisitos, fora do turno) está boa; o visual das caixas é feio; a barra fica espremida pela coluna do avatar. Reorganizar os tamanhos.
- **Registro completo:** abre esticando a página, só na coluna do meio.
- **Defeito:** qualquer clique dispara de novo a animação dos dados.
- **Condições:** aplicou Atordoado e nem as ações nem a Evasão caíram. "Suponho que as outras condições possam ter outras interações delicadas."
- **Inteligência da Mesa:** a descrição e as consequências de cada asset "é incrível"; expandir a inteligência e atacar os bugs ao finalizar as features ("tenho medo dos bugs").
- **Confirmação:** não achou o "Novo alvo". Proposta dele: uma fase de **confirmação** no uso de qualquer asset, com todas as informações e as consequências na ficha; num ataque, os dados, os modificadores e a PMA, com um botão simples para recomeçar a PMA ao lado dela (omitido no primeiro ataque). Com desfazer e confirmação a Mesa fica "oficialmente segura" e os bugs ficam visíveis ("se não aplicou uma consequência que prometeu"). "cada asset difere no modo de usar, mesmo de categorias iguais, uma magia pode rolar místico como acerto, ou exigir teste de resistência, ter opção de intensidade contida, ou não [...] não há escapatória, se não verificar individualmente as ações possíveis e consequências de cada interação ficha->mesa e mesa->ficha."
- **Travas:** alguns campos não são alteráveis (treino de perícia), e uma trava assim prende o asset para sempre. "na sessão eu posso só decidir presentear meus jogadores com um benefício e a ficha deve poder aceitar essas adições, deixando registrado onde o cálculo sem as alterações por fora está."
- **Reação (corrige a resposta do §13):** "ela volta no seu turno. Reação sempre volta no inicio do seu turno."
- **Chip do Acelerar:** "Trabalhe com o agente de balanceamento para não alucinar."
- **Ações e manobras (texto dele):**
  - "Pular(2 Ações) -> 1/3 do seu movimento."
  - "Acelerar(1 ação) → +3 m de movimento nesta rodada. (Só utilizável após movimentar-se)"
  - "Defender (1 ação) → +2 Defender até seu próximo turno. Utilizável mais de uma vez por turno."
  - Empurrar, Desarmar e Agarrar com "(2 ações)" cada; os textos batem com o Notion.
  - Investida (2 ações): o texto do Notion ("em caso de sucesso você realiza ação livre para Atacar ele e segue para o próximo alvo na trajetória, em caso de falha você é interceptado e para antes do alvo contra qual falhou e realiza como ação livre a ação Atacar contra ele"). A prova não deixava atacar mais de uma vez: tem de ser uma sequência de testes de Movimento (sucesso = ataque e próximo teste; falha = ataque e para).
  - Retaliação: o texto do Sistema, mais "Em caso de empate, o atacante sempre ganha."
- **Conferido no Notion em 2026-10-21:** o "Só utilizável após movimentar-se" do Acelerar, o "Utilizável mais de uma vez por turno" do Defender e o "(2 ações)" das três manobras **não estão** no Notion. O Defender do Notion diz "Não acumula com ela mesma.", o que contradiz o "mais de uma vez por turno" se o bônus somar. A Investida do Notion já diz "ação livre", e o site ainda mostra "realiza 1 ação: Atacar" (sync do Sistema pendente). Tudo foi ao balanceamento.
- **Alvo:** a PMA por sequência não é robusta, porque outras técnicas também dependem do alvo ("como o motor checaria se o agarrão é pra aplicar o bonus ou não?"). Ele prefere calcular automaticamente para cada alvo, sem que os jogadores cadastrem alvos na Mesa.
- **Ordem:** "Continue com o planejamento, vamos tentar minimizar os bugs nesse aumento de escopo, garantindo um funcionamento real." Especificação: `10-mesa.md` rev. 3.
