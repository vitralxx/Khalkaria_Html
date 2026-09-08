---
tipo: classe
status: canon-pedro
spoiler: publico
era: atemporal
aliases: [Alquimista, Alquimistas, Artificer]
fonte_notion: [eac6e3a401d982d595b181020562ec8e, 3a66e3a401d9809b8eceec1f30be9fd2, pedro-2026-09-05]
ultima_sync: 2026-09-05
tags: [khalkaria/sistema, khalkaria/sistema/classes]
---

# Alquimista

**Resumo.** Classe de suporte, utilidade, preparação e fabricação (🧪). Recurso de classe = **Bolsa de Reagentes** (`Nível × 3 + Mod.INT`), gasta para fabricar itens do catálogo alquímico de **92 fórmulas** distribuídas em cinco níveis de dificuldade. É a única classe com um catálogo de itens próprio embutido nas regras. **Perfil:** Combate ★★★☆☆ · Controle ★★★☆☆ · Exploração ★★☆☆☆ · Místico ★★★★☆ · Tecnologia ★★★★★, o maior do sistema.

## O chamado
> O mundo é uma oficina. Cada planta esconde uma cura, cada mineral guarda uma explosão, cada substância espera ser transformada. Enquanto outros veem ingredientes, você vê possibilidades infinitas.
> Suas mãos carregam cicatrizes de experimentos. Seu avental conta histórias de explosões "controladas". Seu olhar disseca qualquer objeto, calculando o que pode extrair dele. Para você, não existe lixo — apenas matéria-prima esperando propósito.

## Progressão
| Level | Conteúdo |
|---|---|
| 1 | 4 Técnicas |
| 2 | 5 Técnicas, Técnica de Ramo(Tier 1) |
| 3 | 6 Técnicas, 1 Marca |
| 4 | 7 Técnicas, Técnica de Ramo(Tier 1, 2), 2 Marcas |
| 5 | 8 Técnicas, Técnica de Ramo(Tier 1, 2 e 3), 3 Marcas |

## Status iniciais
- **Saúde:** `10 + (4 × Nível) + (Mod.CON × Nível)`
- **Stamina:** `8 + (6 × Nível) + (Mod.FOR OU Mod.DES × Nível)`
- **Éter:** `6 + (5 × Nível) + (Mod.INT OU Mod.SAB × Nível)`
- **Evasão Ativa (Reação):** 10 + Mod. Destreza + Treinamento em *Defender*
- **Evasão Passiva (Sem reação):** 10 + Mod. Destreza

## Treinamento
Você começa treinado em: **Ofício(Alquimia), Conhecimento**
Além disso, você pode escolher **(1 + Mod. Inteligência)** Perícias para ser treinado dentre as seguintes: Ofício(Alquimia), Ofício(Engenharia), Ofício(Ferraria), Místico, Medicina

- **Atributos Recomendados:** Inteligência, Destreza e Sabedoria.
- **Play Style:** Suporte, Utilidade, Preparação e Crafting
- **CD:** 10 + Mod. Inteligência + Mod. Destreza

Ofício é a vigésima segunda perícia e leva sempre uma especialidade entre parênteses, com atributo variável ([[Atributos e Perícias]]); as regras de fabricação, raridade e preço de mercado estão em [[O Bazar]].

## Bolsa de Reagentes (recurso de classe)
> Você possui uma Bolsa de Reagentes que representa seus materiais alquímicos, componentes e suprimentos de crafting.

- **Reagentes Máximos:** `(Nível × 3) + Mod. Inteligência`
- **Recuperação:**
  - *Descanso Longo:* Você recupera todos os Reagentes, assumindo acesso a suprimentos básicos ou natureza.
  - *Descanso Curto:* Você pode *Buscar Reagentes* como sua ação de descanso curto, recuperando **1d4+Nível** de reagentes.
- **Uso:** Reagentes são utilizados pelo alquimista para criar todas suas invenções, sendo elas itens, poções, melhorias e efeitos especiais. Você conhece fórmulas fundamentais da alquimia. Estes itens podem ser criados por **qualquer Alquimista**, independente do ramo escolhido.
- **Regras de Criação:**
  - **Tempo Padrão:** 10 minutos.
  - **Criação em Lote:** Criando com 10 minutos, pode aproveitar e criar múltiplos itens de uma vez.
  - **Durabilidade:** Itens criados duram até o próximo descanso longo, depois perdem seus efeitos ou apresentam falhas.
  - **Desmanche:** Você pode reverter itens produzidos por você, ganhando seus reagentes de volta.
  - **Teste de Alquimia:** Ao criar qualquer item, role um teste de Ofício(Alquimia); ao suceder o CD do item escolhido você o fabrica com sucesso. Em caso de falha, você perde os reagentes e não cria o item.

## Técnicas gerais
> Você possui **3 Técnicas + Nível**, reatribuíveis em descanso longo.

| Técnica | Descrição | Custo | Ação |
|---|---|---|---|
| Alquimia Rápida | Crie um item alquímico em 1 minuto ao invés de 10 minutos. | 2 Stamina | 1 Min. |
| Produção em Massa | Ao criar um item alquímico, pode gastar 5 de Stamina para criar +1 desse mesmo item sem reagentes adicionais. | 5 Stamina /Item | 1 Ação |
| Alquimia de Combate | Crie um item alquímico rapidamente como 1 ação, porém com custo adicional de +2 Reagentes. | 2 Stamina | 1 Ação |
| Forçar Invenção | Ao falhar um teste de Ofício(Alquimia), pode rolar novamente; em caso de uma segunda falha sua invenção explode e causa 1d6+Mod. Inteligência de dano Elemental. | 3 Stamina | Reação |
| Arremessador | Pode rolar *Atacar* com +1 Treinamento ao arremessar objetos. Adicionalmente, pode arremessar +3 m além do normal. | 2 Stamina | 1 Ação |
| Economista | Ao criar um item alquímico, você gasta -1 Reagente (mínimo 1). | 2 Stamina | 1 Ação |
| Conserva | Ao criar um item alquímico, você pode criá-lo de forma que não estrague em descansos longos. | 5 Stamina | 1 Min. |
| Ferramentas Improvisadas | Você pode manipular fechaduras, desarmar armadilhas e outras ações mecânicas com ferramentas feitas sob necessidade; pode rolar Ofício(Alquimia) com +1 Treinamento nesses casos. | 2 Stamina | 1 Ação |
| Concentrar-se | Ao criar itens alquímicos em 10 minutos (Tempo Padrão), a CD de todos os itens reduz em -2. | — | Passiva |
| Sucateador | Ao Buscar Reagentes como sua ação de descanso curto, recupere 2d4+Nível (Ao invés de 1d4). Adicionalmente, ao finalizar um combate recupere uma quantidade de reagentes = ao seu nível. | — | Passiva |
| Estoque Oculto | Você possui um estoque oculto de reagentes. Você dobra seu Mod. Inteligência ao calcular seus reagentes máximos. Ou seja: (Nível × 3) + (2 × Mod. Inteligência) | — | Passiva |
| Resistência Química | Você tem **Vantagem** em testes de resistência contra venenos, doenças e efeitos ácidos/tóxicos. | — | Passiva |
| Link Remoto | Você pode ativar seus itens alquímicos de até 30 metros de distância deles. | — | Passiva |
| Poções Granada | Suas poções podem ser arremessadas e ao acertar agem como se o alvo tivesse consumido ela. | — | Passiva |
| Óleo Grosso | Seus óleos duram +2 ataques ao serem aplicados em uma arma. | — | Passiva |

## Catálogo alquímico
> Catálogo completo (92 itens). "Reag." = custo em Reagentes.

**Nível 1 (CD 8-10)**

| Item | Categoria | Efeito | Reag. | CD |
|---|---|---|---|---|
| Bomba de Luz | Ofensivo | Arremesso 9 m. Flash 6 m raio. Reflexo ou *Cego* 1 rodada. | 1 | 8 |
| Pó de Espirro | Ofensivo | Arremesso 3 m. Fortitude ou *Desorientado* 1 rodada. | 1 | 8 |
| Fogo Alquímico | Ofensivo | Arremesso 9 m. 2d6 Fogo em área 1,5 m. Reflexo para metade do dano. Queima +1d6 próxima rodada. | 2 | 10 |
| Ácido Corrosivo | Ofensivo | Arremesso 9 m. 2d8 Ácido, 1 alvo. Ignora 2 de Armadura Específica. | 2 | 10 |
| Frasco Congelante | Ofensivo | Arremesso 9 m. 2d6 Frio em área 1,5 m. Superfície fica *Escorregadia* 1 min. | 2 | 10 |
| Sal Revigorante | Curativo | Acorda *Inconsciente* (não com 0 de Saúde). Remove *Atordoado*, *Adormecido*. | 1 | 8 |
| Bálsamo Estabilizador | Curativo | Criatura *Morrendo* fica estável e ganha 1 HP após 1 minuto. | 2 | 8 |
| Poção de Cura Menor | Curativo | Recupera 2d4+Int de Saúde. | 2 | 10 |
| Poção de Vigor | Curativo | Recupera 1d6 de Stamina. | 2 | 10 |
| Antídoto Simples | Curativo | Remove *Envenenamento* de venenos não-mágicos. | 2 | 10 |
| Bastão de Luz | Utilidade | Luz brilhante 6 m + fraca 6 m. Dura 4 horas. | 1 | 8 |
| Tinta Invisível | Utilidade | Só aparece com calor ou reagente específico. | 1 | 8 |
| Pó Revelador | Utilidade | Revela magia remanescente utilizada a menos de 1 hora. | 1 | 8 |
| Fumaça Densa | Utilidade | Nuvem 4,5 m raio. Obscurecimento total por 1 min. | 2 | 10 |
| Catalisador Térmico | Utilidade | Mantém temperatura fixa em recipiente por 24h (0° até 100°). | 1 | 10 |
| Veneno Fraco | Veneno | Arma: próximos 3 ataques, +1d4 Biológico. Fortitude ou *Enjoado* 1 min. | 2 | 10 |

**Nível 2 (CD 12-14)**

| Item | Categoria | Efeito | Reag. | CD |
|---|---|---|---|---|
| Bomba de Concussão | Ofensivo | Arremesso 9 m. 1d6 Contundente em 3 m raio. Fortitude ou *Surdo* 1 min. | 2 | 12 |
| Granada Tóxica | Ofensivo | Arremesso 9 m. Nuvem 3 m por 2 rodadas. 1d8 Veneno/turno + Fortitude ou *Enjoado*. | 3 | 12 |
| Bola de Eletricidade | Ofensivo | Arremesso 9 m. 2d6 Elétrico. Armadura metálica: +1d6 e *Atordoado* 1 rodada (Fort. nega). | 3 | 12 |
| Pó Explosivo | Ofensivo | Espalhar em 3 m. Detona com fogo/impacto: 3d6 Fogo. Pode ser armadilha. | 3 | 14 |
| Tinta de Cegueira | Ofensivo | Arremesso 4,5 m. Reflexo ou *Cego* 2 rodadas. | 2 | 12 |
| Poção de Cura Moderada | Curativo | Recupera 3d6+Int de Saúde. | 4 | 12 |
| Emplastro de Regeneração | Curativo | Aplicar em ferimento. Recupera 1d4 Saúde/turno por 3 rodadas. | 3 | 12 |
| Antídoto Universal | Curativo | Remove *Envenenado*, *Enjoado* ou doença não-mágica. | 3 | 14 |
| Tônico Anti-Exaustão | Curativo | Remove 1 nível de *Exaustão*. 1x por descanso longo por criatura. | 3 | 14 |
| Elixir de Força | Elixir | +2 testes de Força como atributo principal, +2 dano corpo a corpo. Duração 10 min. | 3 | 12 |
| Elixir de Agilidade | Elixir | +2 testes de Destreza como atributo principal, +1,5 m Movimento. Duração 10 min. | 3 | 12 |
| Elixir de Resistência | Elixir | +2 Fortitude, +5 Saúde temporária. Duração 10 min. | 3 | 12 |
| Óleo Flamejante | Óleo | Arma: próximos 3 ataques +1d6 Fogo. Duração 1 min. | 2 | 12 |
| Óleo Congelante | Óleo | Arma: próximos 3 ataques +1d6 Frio. Crítico = *Lento 1* 1 rodada. Duração 1 min. | 2 | 12 |
| Óleo Corrosivo | Óleo | Arma: próximos 3 ataques ignoram 3 Armadura. Duração 1 min. | 2 | 12 |
| Couro Líquido | Elixir | +2 Armadura(Ar) Natural. Duração 10 min. | 3 | 14 |
| Detector de Magia | Utilidade | Frasco brilha azul a menos de 3 m de magia/éter. Dura 1 hora. | 2 | 12 |
| Cola Universal | Utilidade | Gruda superfícies (Força CD 20 separa). Pode *Enraizar* (Fort. nega). | 2 | 12 |
| Solvente Universal | Utilidade | Dissolve cola, resina, adesivo. Remove *Enraizado* por cola. | 2 | 12 |
| Marcador Rastreável | Utilidade | Líquido invisível. Você detecta a até 100 m por 24h. | 2 | 12 |
| Água-Régia | Utilidade | Dissolve metal não-mágico. Abre qualquer fechadura mundana em 3 min. | 3 | 14 |
| Corda Líquida | Utilidade | Enrijece em 6 seg. Vira corda 9 m (200 kg). Dura 1 hora. | 2 | 12 |
| Espuma Seladora | Utilidade | Sela buracos até 50 cm, cria cobertura improvisada. | 2 | 12 |
| Veneno Padrão | Veneno | 3 ataques. +1d6 Biológico. Fortitude ou *Envenenado* 1 min. Duração 1 min. | 3 | 12 |
| Sonífero | Veneno | Ingerido/inalado. Vontade ou *Adormecido* 1 hora. Dano acorda. | 3 | 14 |

**Nível 3 (CD 16-18)**

| Item | Categoria | Efeito | Reag. | CD |
|---|---|---|---|---|
| Napalm Alquímico | Ofensivo | Arremesso 9 m. 3d6 Fogo em área 3 m, Reflexo para metade. Queima **2d6/turno por 3 rodadas**. Água não apaga. | 4 | 16 |
| Bomba de Fragmentação | Ofensivo | Arremesso 9 m. 4d6 Perfurante em 4,5 m raio. Reflexo para metade. | 4 | 16 |
| Gás Necrótico | Ofensivo | Nuvem 6 m raio. 2d8 Necrótico/turno. Cura que criaturas na área receberiam é reduzida pela metade. Dura 3 rodadas. | 5 | 16 |
| Bomba de Vácuo | Ofensivo | Arremesso 9 m. 2d10 Força em 3 m. Criaturas são puxadas 3 m para o centro. Fortitude nega puxão. | 5 | 18 |
| Carga de Implosão | Ofensivo | Colocar em estrutura/objeto. Destrói até 3 m³ de material não-mágico. 6d6 em criaturas adjacentes. | 6 | 18 |
| Frasco do Raio | Ofensivo | Arremesso 9 m. 3d8 Elétrico. Salta para até 2 alvos adicionais em 3 m (2d8 cada). | 4 | 16 |
| Poção de Cura Maior | Curativo | Recupera **4d8+Int** de Saúde. | 6 | 16 |
| Elixir de Restauração | Curativo | Remove *Cego*, *Surdo*, *Paralisado* ou *Atordoado*. | 5 | 16 |
| Adrenalina de Campo | Curativo | Criatura inconsciente acorda com metade da Saúde máxima instantaneamente. Fica *Exausto 1* após 1 hora. | 4 | 16 |
| Poção de Vigor Maior | Curativo | Recupera 2d6 de Stamina. | 6 | 18 |
| Elixir do Crescimento | Elixir | +1 categoria de tamanho. +1d4 dano, +2 For, -2 Des, +1,5 m alcance. Duração 1 min. | 5 | 16 |
| Elixir do Encolhimento | Elixir | -1 categoria de tamanho. +2 Furtividade, +2 Des, -2 For. Passa em frestas. Duração 1 min. | 5 | 16 |
| Extrato de Velocidade | Elixir | +1 Ação por turno. Duração 3 turnos. *Exausto 1* após efeito. | 6 | 18 |
| Mutagênico Menor | Elixir | Escolha: +4 For/-2 Int OU +4 Des/-2 For OU +4 Con/-2 Sab. Duração 10 min. | 5 | 16 |
| Elixir da Visão Verdadeira | Elixir | Vê através de ilusões, escuridão mágica, invisibilidade em 9 m. Duração 1 min. | 5 | 18 |
| Elixir Aranha | Elixir | Escala superfícies como aranha. Mãos livres não necessárias. | 4 | 16 |
| Óleo do Caçador | Óleo | Arma: +2 Atacar e +2d6 dano contra uma criatura. Duração 1 hora. | 4 | 16 |
| Elixir das Guelras | Utilidade | Respira debaixo d'água. Duração 30 min. | 4 | 16 |
| Tintura Fantasma | Utilidade | Translúcido. +4 Furtividade. Atacar cancela. Duração 1 min. | 4 | 16 |
| Bomba de Éter | Utilidade | Arremesso 9 m. Drena 1d6 Éter em 3 m. Você recupera metade. | 5 | 18 |
| Elixir das Línguas | Utilidade | Entende e fala qualquer idioma. Duração 1 hora. | 4 | 16 |
| Sangue Falso | Utilidade | Pode se fingir de morto. Medicina CD 18 para perceber. Duração 1 hora. | 3 | 16 |
| Ácido Dimensional | Utilidade | Corrói barreiras mágicas, campos de força. Anula 1 efeito de barreira. | 6 | 18 |
| Veneno Paralisante | Veneno | 1 ataque. Fortitude ou *Paralisado* 2 rodadas. Duração 1 min. | 5 | 16 |
| Soro da Verdade | Veneno | Ingerido. Vontade ou não pode mentir por 10 min. | 5 | 16 |
| Veneno Hemorrágico | Veneno | 3 ataques. +2d6 Biológico. Alvo sangra 1d6/turno por 3 rodadas (Medicina estanca). | 5 | 16 |
| Toxina Mental | Veneno | 1 ataque. Vontade ou *Confuso* por 1 minuto. | 5 | 18 |

**Nível 4 (CD 20-22)**

| Item | Categoria | Efeito | Reag. | CD |
|---|---|---|---|---|
| Bomba de Plasma | Ofensivo | Arremesso 12 m. 6d6 Fogo + 6d6 Elétrico em 6 m raio. Reflexo para metade. Ignora Resistência a Fogo. | 8 | 20 |
| Praga Alquímica | Ofensivo | Arremesso 9 m. Fortitude ou 3d8 Biológico em 4,5 m. Criaturas afetadas **espalham** a praga (1d8/turno) ao tocar outros por 1 min. | 8 | 20 |
| Bomba Gravitacional | Ofensivo | Arremesso 9 m. Cria zona de gravidade intensa 6 m raio por 3 rodadas. Criaturas: **Movimento reduzido pela metade**, -4 Reflexo, voar impossível, 2d6 Contundente/turno. | 10 | 22 |
| Fogo Negro | Ofensivo | Arremesso 9 m. 4d10 Fogo + 4d10 Necrótico em 3 m. Reflexo para metade. Chamas negras. Cura é impossível na área por 1 min. | 10 | 22 |
| Dissolução Total | Ofensivo | Aplicar em criatura/objeto. 8d6 Biológico. Ignora toda Armadura. Desintegra matéria morta. | 8 | 20 |
| Poção de Cura Suprema | Curativo | Recupera 6d8+Int de Saúde + remove 1 condição à escolha. | 10 | 20 |
| Poção de Vigor Suprema | Curativo | Recupera 3d8 de Stamina + remove todas as condições (incluindo mágicas). | 10 | 20 |
| Elixir da Fênix | Curativo | Criatura morta há menos de 1 minuto **ressuscita** com 1 HP. | 12 | 22 |
| Regeneração Alquímica | Curativo | Regenera membro perdido há até 1 hora em 24 horas. Requer repouso. | 8 | 20 |
| Mutagênico Maior | Elixir | +6 em um Atributo, -2 em dois outros. Transformação física visível. Duração 1 hora. | 8 | 20 |
| Elixir da Perfeição | Elixir | +2 em todos os atributos. Duração 10 min. | 10 | 22 |
| Elixir da Forma Bestial | Elixir | Transforma em besta de CR igual ao seu nível. Mantém mente. Duração 3 turnos. | 8 | 20 |
| Sangue do Dragão | Elixir | Resistência a **todo dano elemental**. Sopro 1x (4d6 elemento à escolha, cone 9 m). Duração 1 hora. | 12 | 22 |
| Soro da Guerra | Elixir | +2 Atacar, +2 Defender, +2d6 dano, +3 m Movimento, Vantagem em Fortitude. | 8 | 22 |
| Essência Etérea | Utilidade | Torna-se *Incorpóreo* por 1 minuto. Atravessa paredes. Não pode interagir fisicamente. | 8 | 20 |
| Poção da Invisibilidade | Utilidade | *Invisível* por 10 min. Atacar, receber dano ou conjurar cancela. | 8 | 20 |
| Bomba Temporal | Utilidade | Área 6 m. Criaturas afetadas: *Lentidão 2* (1 Ação/turno, -6 m movimento, sem reação, -4 Reflexo) por 3 rodadas. Vontade nega. | 12 | 22 |
| Extrato de Clarividência | Utilidade | Vê e ouve local que você conhece a até 1 km por 10 min. | 6 | 20 |
| Tinta do Destino | Utilidade | Escreva um evento simples. 50% chance de acontecer nas próximas 24h. Mestre rola os dados. | 10 | 22 |
| Veneno Letal | Veneno | 1 ataque. 6d6 Biológico. Fortitude ou +6d6 e *Inconsciente*. Duração 1 min. | 8 | 20 |
| Veneno da Alma | Veneno | 1 ataque. 4d6 Necrótico. Vontade ou **Éter máximo reduzido pela metade** por 24h. Duração 1 min. | 10 | 22 |
| Paralisia Total | Veneno | 1 ataque. Fortitude ou *Paralisado* por 1 hora. Duração 1 min. | 8 | 20 |
| Amnésia Líquida | Veneno | Ingerido. Vontade ou perde memórias das últimas 24h. | 6 | 20 |

**Nível 5 (CD 24+) — Lendários**

| Item | Efeito | Reag. | CD |
|---|---|---|---|
| Elixir da Imortalidade | Não envelhece por 10 anos. Revive 1x se morrer nesse período (1 HP). Requer ***Coração da Árvore***. | 15 | 24 |
| Bomba do Vazio | 10d10 Força em 9 m raio. Reflexos ou Morte Instantânea no centro da bomba. Tudo é empurrado **para o centro** e comprimido. Requer ***Grilhões do Abismo***. | 15 | 24 |
| Soro do Homúnculo | Ao injetar transforma em servo alquímico (CR 2) leal pra sempre. Requer ***Sangue Primordial***. | 15 | 24 |
| Lágrimas do Tempo | Reverte objeto/criatura/local ao estado de até 1000 anos atrás. 1 uso. Requer ***Areia Temporal***. | 20 | 26 |

## Os três ramos
Ao longo da criação do personagem escolhem-se **3 Marcas** e **6 Técnicas de Ramo**: 3 no Tier 1, 2 no Tier 2 e 1 Ultimate no Tier 3, destravadas respectivamente nos níveis 2, 4 e 5.

- **Ramo do Artificer** (azul — Utilidade e Infusão mágica) — *Você cruzou a fronteira entre alquimia e misticidade. Onde outros veem limite, você vê oportunidade. Éter não é apenas combustível — é um ingrediente. Suas criações brilham com runas, seus itens pensam, suas invenções desafiam as leis naturais. Você não é apenas um alquimista; é um inventor que dobra a realidade.*
- **Ramo do Bombardeiro** (vermelho — Combate e Toxinas) — *Você dominou a arte da destruição química. Seus frascos brilham com cores que prometem dor. Seu sorriso aparece quando algo explode. Enquanto outros alquimistas criam para curar ou construir, você cria para um único propósito: aniquilação eficiente.*
- **Ramo do Boticário** (verde — Cura e Abjuração) — *Você é a linha entre a vida e a morte das criaturas. Suas poções fecham feridas que magia não alcança, seus elixires transformam covardes em heróis, seus tônicos enfraquecem gigantes. Você traz esperança — e ocasionalmente, a ruína silenciosa dos inimigos através de debilitações precisas.*

## Marcas de Ramo
**Marcas do Artificer**
- **Pai de Pet** — *"Meus constructos, morreriam por mim e, ao serem reconstruídos, morreriam de novo!"* Você tem um certo afeto pelos seus constructos… afeto até demais.
  - Toda vez que um constructo seu sobreviver a um combate, ganha +1 permanente em Místico. Ao chegar em +5, essa habilidade fica supérflua.
  - Efeitos e buffs aplicados em você também afetam seu constructo ativo (e vice-versa). Ao recuperar Stamina ou Éter, o constructo recupera, em vez disso, Saúde.
- **Sobrecarga** — *"O frasco aguenta… Provavelmente."* Você sente prazer em tirar o máximo de suas invenções, mesmo quando isso significa sobrecarregá-las.
  - Ao usar um Cartucho Arcano, você pode gastar +2 Reagentes para conjurar a magia com um dos seguintes efeitos: **Potência:** A magia tem intensidade *Forçada* automaticamente. **Modificar:** Você pode escolher 1 modulação grátis da escola de magia respectiva da magia.
  - Ao tirar 1 em testes de *místico* criando cartuchos, ele explode em você causando 1d6 de Dano de Força e você perde 2d4 de Éter.

**Marcas do Bombardeiro**
- **Piromaníaco** — *"Cada explosão me ensina a fazer outra maior."* Você sente prazer em explodir objetos ou criaturas e vê-los queimar.
  - Para cada 10 criaturas que você derrotou com itens alquímicos, ganha +1 permanente em Atacar. Ao chegar em +5, essa habilidade fica supérflua.
  - Ao derrotar uma criatura com um item alquímico, recupera 1 Reagente.
- **Preciosismo** — *"Minhas invenções, extremamente calibradas."* Você é extremamente metódico e organizado, seus experimentos são friamente calculados.
  - Uma vez por descanso longo, você pode causar o dano máximo de um item alquímico que você criou e arremessou.
  - Itens alquímicos que você cria têm +2 CD nos testes de resistência.

**Marcas do Boticário**
- **Curandeiro Incansável** — *"Ninguém morre no meu turno."* Você tem um senso de dever em curar criaturas.
  - Para cada 5 criaturas que você retirou a condição *Morrendo*, ganha +1 permanente em Medicina. Ao chegar em +5, essa habilidade fica supérflua.
  - Ao curar uma criatura que estava com 0 de Saúde e remover a condição *Morrendo*, ela e você também recuperam 2d6 de Stamina.
- **Mixologista** — *"Uma poção é boa. Duas poções juntas? Arte."* Você sente prazer em consumir e apreciar substâncias e combinações de substâncias novas.
  - Você pode combinar 2 poções ou elixires de buff diferentes em um único frasco (custo +2 Reagentes). O consumidor recebe ambos os efeitos. Você não pode combinar poções ou elixires iguais.
  - Aliados que consumirem suas misturas também recuperam 1d4 de Stamina.

## Técnicas de Ramo — Tier 1 (nível 2)
**Artificer**
- **Sintonia Arcana** (Passiva) — Você se torna Treinado em *Místico*. Se já for Treinado, se torna Experiente e assim por diante. Você pode usar Éter como substituto de Reagentes na proporção 2:1 ao criar itens alquímicos. Seu Éter máximo aumenta em +Mod. Inteligência.
- **Cartucho Arcano** (Passiva) — Você desenvolveu um método de aprisionar magias em recipientes alquímicos. **Novo Item Alquímico: Cartucho Arcano.** *Tempo de Criação:* 10 min, age como craft de item alquímico. *Custo de Criação:* (Nível da Magia × 2) Reagentes. *Magias Disponíveis:* Você conhece 1 magia + Mod. Inteligência (mín. 1) do seu (nível−1) ou menor; após isso você ganha +1 magia por nível. *CD da criação:* Você rola Místico ao criar Cartuchos Arcanos; o CD da criação é 10 + (2 × Nível da Magia). *Usar Cartucho:* Qualquer criatura pode conjurar a magia infundida no cartucho, porém usa seus atributos como base dos CDs e ataques da magia, respeitando também o custo de ações da magia. *Limite:* Você pode sustentar até (Nível + Mod. Inteligência) cartuchos ao mesmo tempo. Perdem seus efeitos após um descanso longo.
- **Constructo Menor** (3 Ações, 3 Éter + 4 Reagentes) — Você cria um pequeno constructo alquímico (Minúsculo) que dura até o próximo descanso longo ou até ser destruído. **Estatísticas:** 10 Saúde, Evasão 12, Movimento 9 m, 2 Ações por turno (pode voar ou escalar). O constructo pode: *Atacar:* 1 Ação, 1d20+Mod. Inteligência, Dano 1d6+Mod. Inteligência. *Carregar* até 5 Equipamentos e 20 Bugigangas. *Espionar e Reportar* telepaticamente o que ouve em até 100 m. *Entregar* itens ou poções a aliados como uma reação. *Detonar:* 2 Ações, explode causando 2d6 de dano Elemental em 3 m de raio. Você pode ter apenas 1 constructo por vez. Ao ser destruído, você pode saquear 2 reagentes do Constructo Menor.

**Bombardeiro**
- **Bombardeiro** (Passiva) — Você se torna Treinado em *Atacar*. Se já for Treinado, se torna Experiente e assim por diante. Seus itens alquímicos ofensivos (granadas, bombas e arremessáveis) são fabricados com +1d6 de dano. Os itens Ofensivos, Óleos e Venenos custam -1 reagente e têm -2 CD para serem fabricados.
- **Toxinas Potentes** (1 Ação, 3 Stamina) — Ao usar, infunda óleo em uma arma já infundida por um veneno ou vice-versa. Você aplica os 2 bônus de dano e efeitos de cada substância ao ataque.
- **Enxurrada de Alquímicos** (2 Ações, 5 Stamina) — Você arremessa até 3 itens alquímicos ofensivos simultaneamente; cada item pode atingir um alvo diferente ou o mesmo alvo, respeitando seu alcance máximo e rolando Atacar para cada arremesso. Você deve ter os itens preparados de antemão.

**Boticário**
- **Anatomista** (Passiva) — Você se torna Treinado em *Medicina*. Se já for Treinado, se torna Experiente e assim por diante. Poções de cura que você cria curam +2d4 adicional. Os itens Curativos e Elixires custam -1 Reagente e têm -2 CD para serem fabricados.
- **Elixir Especial** (1 Ação, 3 Stamina, 3 Reagentes) — Você prepara e administra um elixir especial entre você e seus aliados à distância de toque, pagando 1 reagente por alvo. Escolha um dos 3 efeitos que todos recebem por 1 minuto: **Vigor:** +2 em Atacar e +1d6 de dano em Ataques. **Proteção:** +2 em Defender e +2 Armadura(Ar) natural. **Velocidade:** +3 m Movimento e não causa ataques de oportunidade.
- **Tónico Cruel** (1 Ação, 3 Stamina) — Escolha uma criatura em até 9 m. Ela deve fazer um teste de Fortitude: Em caso de falha, escolha um efeito que dura por 1 rodada: **Letargia:** -2 em Atacar e Defender. **Fraqueza:** -3 m de Movimento e não pode usar Reações. **Vulnerabilidade:** Perde 2 de Armadura e tem Desvantagem em Fortitude. *Em caso de falha, você não pode usar esta habilidade contra a mesma criatura neste combate.* *(a segunda condição repete "falha" onde tudo indica que deveria dizer "sucesso" — ver Pontas soltas)*

## Técnicas de Ramo — Tier 2 (nível 4)
**Artificer**
- **Runas de Proteção** (1 Ação, 2 Éter) — Você inscreve runas protetoras em uma criatura ou objeto tocado. Dura 1 hora ou até ser consumido. A criatura protegida pode ativar as runas como Reação quando sofrer dano: **Absorção:** Reduz o dano em 2d8+Mod. Inteligência. **Retaliação:** O atacante sofre 1d8 de dano Místico. Você pode manter um total igual ao seu Mod. de Inteligência de Runas ativas simultaneamente.
- **Constructo de Combate** (3 Ações, 5 Éter + 6 Reagentes) — Você cria um constructo alquímico aprimorado (Pequeno) que dura até o próximo descanso longo ou até ser destruído. **Estatísticas:** 25 Saúde, Evasão 14, Armadura(Ar) 2, Movimento 9 m, 3 ações por turno (pode voar ou escalar). O Constructo pode: *Atacar:* 1 ação, 1d20+Mod. Inteligência + SEU treinamento em *Atacar*, Dano 2d6+Mod. Inteligência Elemental (escolha o tipo ao criar). *Escudo:* 1 ação, um aliado à distância de toque ganha +2 Defender até o início do próximo turno do constructo. *Carregar:* Até 10 Equipamentos e 30 Bugigangas. *Reparar:* 1 Ação, cura 1d8 Saúde a si (Máx. 2x por descanso curto). *Espionar e Reportar* telepaticamente o que vê/ouve em até 200 m. *Detonar:* 3 Ações, explode causando 4d6 de dano Elemental em 4,5 m de raio, Reflexo para metade. Você só pode ter 1 constructo ativo por vez. Ao ser destruído, você pode saquear 3 reagentes do Constructo de Combate.

**Bombardeiro**
- **Mestre dos Elementos** (Passiva) — Seus itens que causam dano Elemental ou Biológico ignoram Ae (Armadura Específica) e Resistências. Suas bombas e granadas possuem o alcance de explosão aumentado em 1,5 m.
- **Zona da Morte** (2 Ações, 4 Stamina, 3 Reagentes) — Você prepara uma área de 4,5 m de raio em até 9 m com substâncias Elementais ou Biológicas: Criaturas que entram ou começam o turno na área sofrem 2d6 de dano (Elemental ou Biológico) à sua escolha. Você pode Detonar as substâncias como 1 ação: todas as criaturas na área sofrem 4d6 de dano, Reflexo para metade; a zona da morte se dissipa. A zona dura 3 Turnos ou até ser detonada e você pode ter apenas 1 Zona da Morte ativa por vez.

**Boticário**
- **Transfusão Vital** (2 Ações, 3 Stamina) — Você aprendeu a manipular a vitalidade entre você e outras criaturas. Ao utilizar, escolha uma das ações a seguir: Cura uma criatura em alcance de toque em 2d6+Mod. Int, porém você perde 1d6 de Saúde. Ou: você ataca uma criatura com uma seringa de toxinas, causando 2d8+Mod. Int; ao acertar, injeta a seringa de volta em você recuperando Saúde igual ao dano causado.
- **Gás Especial** (2 Ações, 3 Stamina, 4 Reagentes) — Você ativa ejetores de gás que inundam um raio de 4,5 m em volta de você de um Gás Especial. Você possui uma máscara que filtra as substâncias danosas e pode prover a qualquer criatura uma cópia dessa máscara: *Criaturas sem Máscara de Filtro:* Criaturas que começam o turno ou entram na área devem fazer um teste de Fortitude ou ficam *Enjoadas* até saírem da área; se a criatura já estiver enjoada, ela recebe 2d6+Mod. Int de dano Biológico. *Criaturas com Máscara de Filtro:* Criaturas que começam o turno ou entram na área recuperam 1d6+Mod. Inteligência de Saúde por turno enquanto estiverem na área. A nuvem se move com você e você pode manter essa técnica ativa contanto que pague a Stamina novamente toda rodada enquanto o Gás estiver ativo.

## Técnicas de Ramo — Tier 3 · Ultimates (nível 5)
> O Tier 3 provê Ultimates, que só podem ser utilizadas 1 vez por dia.

**Artificer** — *"Levante-se, minha criação."*
- **Titã** (3 Ações, 8 Éter + 10 Reagentes, Ultimate) — Você invoca um constructo colossal (Grande) que dura até o fim do combate ou até ser destruído. **Estatísticas:** 50 Saúde, Evasão 14, Armadura(Ar) 5, Movimento 6 m, 4 Ações por turno. O Titã pode: *Esmagar:* 2 Ações, alcance 3 m, 4d10 + Mod. Int de dano Contundente; ao acertar, alvos médios ou menores devem suceder em um teste de Fortitude ou ficam *caídos*. *Rajada Arcana:* 1 Ação, linha de 12 m, 3d8 de dano Elemental, Reflexo para metade. *Escudo:* 1 Ação, todos os aliados em 4,5 m ganham +3 Defender até o próximo turno do Titã. *Investida:* 3 Ações, avança 12 m em linha reta; criaturas no caminho que falharem em um teste de Fortitude sofrem 3d10 Contundente, ficam *Caídas* e podem ser empurradas até 3 m.
  - **O Custo:** Você não pode usar Éter para nenhum outro propósito enquanto o Titã existir. Se o Titã for destruído por um inimigo, você sofre 2d6 de dano Psíquico e ganha Exaustão 1.

**Bombardeiro** — *"Quando uma explosão não é suficiente, use todas."*
- **Apocalipse Alquímico** (3 Ações, 6 Stamina + 8 Reagentes, Ultimate) — Você libera todo seu arsenal em uma devastação total. Escolha um ponto em até 18 m. Uma sequência de explosões atinge uma área de 9 m de raio. Todas as criaturas na área sofrem 8d6 de dano divididos entre (escolha 2 tipos: Fogo, Frio, Elétrico, Ácido ou Veneno). Reflexos para metade do dano. Criaturas que falharem ficam *Cegas*, *Surdas* e *Caídas* por 1 rodada. A área fica coberta de substâncias voláteis por 1 minuto com as substâncias utilizadas; criaturas que entram ou começam o turno: **Fogo:** Sofrem 2d6 Fogo e se falharem em Reflexos ficam *em chamas*. **Frio:** Sofrem 2d6 Frio e se falharem em Movimento ficam *Lento*. **Elétrico:** Sofrem 2d6 Elétrico e se falharem em Fortitude ficam *Atordoados*. **Ácido:** Sofrem 2d6 Ácido e se falharem em Fortitude ficam *Cegos*. **Veneno:** Sofrem 2d6 Veneno e se falharem em Fortitude ficam *Envenenados*.
  - **O Custo:** Você perde 2d8+Mod. Int de Éter. Você deve suceder em um teste de Vontade (CD 20) ou fica *paralisado* por 1 turno apreciando a explosão.

**Boticário** — *"A guerra, marca qualquer um."*
- **Metamorfose** (2 Ações, 5 Stamina + 6 Reagentes, Ultimate) — Você administra um mutagênico intenso que transforma radicalmente uma criatura. Escolha um aliado ou inimigo à distância de toque (pode ser você):
  - **Aliado** (Transformação por 1 Minuto): Tamanho aumenta em 2 Categorias. +6 Força, +4 Constituição, -2 Inteligência. +20 Saúde Temporária. +10 Stamina Temporária. +2d6 de dano em ataques corpo a corpo. Resistência a dano Ordinário.
  - **Inimigo** (Teste de Vontade CD 20+Int; Transformação por 1 Minuto): Tamanho diminui em 2 Categorias. -6 Força, -4 Constituição, +2 Inteligência. -20 Saúde Máxima. -2d6 de dano em ataques corpo a corpo. Vulnerabilidade a dano Ordinário. Sucesso no teste de Vontade nega todos os efeitos anteriores, mas sofre 4d6 de dano Biológico.
  - **O Custo:** Ao final da transformação, criaturas aliadas ficam *inconscientes* e ganham *Exaustão 2*.


## Relações
- **Pertence a** → [[Sistema]] · [[Progressão]] · [[Criação de Personagem]]
- **Recurso de classe** → Bolsa de Reagentes (`Nível×3 + Mod.INT`)
- **Recursos gerais** → Saúde · Stamina · [[Éter]], que o Artificer converte em Reagentes na proporção 2:1
- **Ramos** → Artificer (utilidade/infusão mágica) · Bombardeiro (combate/toxinas) · Boticário (cura/abjuração)
- **Perícias iniciais** → [[Atributos e Perícias|Ofício]](Alquimia), [[Atributos e Perícias|Conhecimento]]; escolhe entre Ofício(Alquimia), Ofício(Engenharia), Ofício(Ferraria), [[Atributos e Perícias|Místico]], [[Atributos e Perícias|Medicina]]
- **Cruza com a magia** → o Cartucho Arcano aprisiona magias das escolas ([[Regras de Magia]], [[Destruição]], [[Abjuração]], [[Alteração]], [[Conhecimento]]) e herda suas intensidades e modulações
- **Regras tocadas** → [[O Bazar]] (fabricação, raridade, preços) · [[Descanso]] (Buscar Reagentes, criação em lote) · [[Tipos de Dano]] · [[Manobras e Tamanho]] (categorias de tamanho dos elixires e do Titã) · [[Dano, Ataque e Defesa]]
- **Materiais lendários do nível 5** → *Coração da Árvore*, de [[A Vhelor]] · *Grilhões do Abismo*, de [[O Abismo]] · *Sangue Primordial*, do [[Primórdio]] · *Areia Temporal*, da trama do tempo de [[Velúria]]
- **Constructos** → Constructo Menor · Constructo de Combate · Titã
- **Condições que usa** → [[Condições|Cego]], [[Condições|Surdo]], [[Condições|Desorientado]], [[Condições|Atordoado]], [[Condições|Adormecido]], [[Condições|Enjoado]], [[Condições|Envenenamento]], [[Condições|Paralisado]], [[Condições|Confuso]], [[Condições|Caído]], [[Condições|Lento]], [[Condições|Em Chamas]], [[Condições|Enraizado]], [[Condições|Invisível]], [[Condições|Inconsciente]], [[Condições|Morrendo]], [[Condições|Exaustão]]
- **Economia** → [[Sins]] e [[Dinheiro e Comerciantes]]; reagentes e insumos comprados em [[O Bazar]]
- **Epígrafe compartilhada** → *Metamorfose* repete "A guerra, marca qualquer um.", de *Campo de Batalha* ([[Brutalista]])
- **PC que a usa** → nenhum dos cinco da [[Equipe desfloreio]]

## Pontas soltas
- **Tónico Cruel diz "falha" duas vezes.** A segunda ocorrência descreve o caso em que a habilidade fica travada contra a mesma criatura, o que só faz sentido se o alvo tiver **sucedido** no teste — como acontece em *Leitura de Combate*, do [[Brutalista]]. [[Perguntas Abertas]] E76.
- **Sucateador contradiz a regra base.** A técnica manda recuperar "2d4+Nível (Ao invés de 1d4)", mas a Bolsa de Reagentes já concede **1d4+Nível**; o parêntese está incompleto. [[Perguntas Abertas]] E77.
- **Ofício(Alquimia) aparece duas vezes.** É treinamento inicial garantido e reaparece na lista de escolha das (1+Mod.INT) perícias. Sai da lista, ou a escolha serve para subir de degrau? [[Perguntas Abertas]] E78.
- **Dano sem subtipo.** *Forçar Invenção*, o Detonar dos constructos, a *Rajada Arcana* do Titã e a *Zona da Morte* falam em dano "Elemental" ou "Biológico", e as *Runas de Proteção* em dano "Místico" — mas essas são categorias, e cada uma reúne três ou mais dos doze tipos nomeados ([[Tipos de Dano]]). [[Perguntas Abertas]] E79.
- **O Soro do Homúnculo entrega um servo CR 2.** No balanceamento canônico, CR 2 é o encontro equilibrado para cinco jogadores de nível 2 — ou seja, um item lendário dá um aliado com força de encontro inteiro. Intencional? [[Perguntas Abertas]] E80.
- **O catálogo convive com [[O Bazar]].** As 92 fórmulas podem repetir nomes e preços de itens já catalogados no Bazar. [[Perguntas Abertas]] E81.
- **Estados sem entrada em [[Condições]].** *Incorpóreo* (Essência Etérea) e *Lentidão 2* (Bomba Temporal) nasceram para uso único; "Lentidão 2" quer dizer *Lento 2*, mas a definição embutida na Bomba Temporal — 1 ação por turno, −6 m de movimento, sem reação, −4 Reflexos — não bate com o *Lento X* canônico, de −3 m e −1 ação.
- **Marcas que dão "+1 permanente"** até +5 convivem com a escala de treinamento de quatro degraus, +2/+4/+6/+8 ([[Atributos e Perícias]]); *Piromaníaco* ainda conta de dez em dez, e *Sobrecarga*, *Preciosismo* e *Mixologista* não têm contador nenhum. [[Perguntas Abertas]] E63.

## Procedência
- Notion `eac6e3a401d982d595b181020562ec8e` — Alquimista (ed. 2026-08-05, 🟢 Pronto); índice de Classes `3a66e3a401d9809b8eceec1f30be9fd2`.
- Respostas do mestre 2026-09-05: **B11** (ramos 3/2/1 nos níveis 2/4/5) · **B1** (as quatro categorias e os doze tipos de dano; "dano de força é gravidade geralmente e oriundo dos deuses, dano primordial é energia vazada do Primórdio") · **B12** (*Incorpóreo* criada para uso unitário; "Lentidão 2 se refere a lento 2") · **B16** (as perícias sociais foram individualizadas; Ofício(X) segue canônica, com atributo variável) · **A18** (a coluna de notas do Bazar não é canônica e nada dela entra neste catálogo).
- `docs/memoria/notion_raw/classe_alquimista.md`, `classe_index.md`; digest `B_classes.md` §6, inconsistências 1, 6, 10, 11, 17, 21, 26.
- Correções pendentes na fonte: "3 no Tier" sem o "1"; grafias legadas no catálogo — *Envenenado* → Envenenamento (Antídoto Universal, Veneno Padrão, Apocalipse Alquímico; o Antídoto Simples já usa o nome certo) e *Exausto 1* → Exaustão 1 (Adrenalina de Campo, Extrato de Velocidade), preservadas aqui como estão na fonte.
- Revisão de redação: 2026-09-07.
