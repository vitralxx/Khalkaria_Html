# Log de técnicas — o que funciona na ficha (2026-09-26)

Pedido do Pedro na L19 (`03-respostas-pedro.md` §6): *"preciso de um log de todas as técnicas do sistema e se elas estão
funcionando na ficha interativa ou não"*. O exemplo dele é a **Muralha Viva** do Brutalista, que ainda diz que o treino de
Defender "aumenta de 3 em 3", embora Defender tenha virado dado.

## O que é

São três arquivos. Os JSON são a fonte; este documento é a leitura deles no dia de hoje.

| Arquivo | O que tem | Quem mantém |
|---|---|---|
| `docs/ficha-digital/log-tecnicas.json` | Uma entrada por técnica (382), com as checagens mecânicas, os achados de regra e o status | Gerado por `python tools/log_tecnicas.py` (determinístico, sem rede, ~2 s) |
| `docs/ficha-digital/log-tecnicas-achados.json` | 160 achados de regra conferidos (trecho verbatim, regra atual com fonte, gravidade, destino) e os 2 descartados, com o motivo | Leitura humana; o script só lê |
| `tools/regras_obsoletas.json` | Tabela versionada de padrões de regra antiga (ex.: Defender "+2/+4/+6") | Mão; o script aplica |

"Técnica" aqui é tudo que o jogador leva para o campo Técnicas da ficha: 210 técnicas de classe,
42 marcas, 22 ultimates, 4 características e
7 recursos de classe, 19 características de raça,
10 variantes, 3 subespécies, 16 tecnologias do Autômato,
15 poderes e 15 adversidades da Corrupção e
19 habilidades de origem.

O log não corrige texto canônico. Cada problema aponta o trecho verbatim, a regra atual e a fonte; a correção é do Pedro
(Notion) ou do balanceamento.

## Como ler "funciona na ficha"

Cada técnica passa por seis checagens. O `status` da técnica é `ok` quando nenhuma acusa; senão é `alerta`, e o campo
`motivos` diz quais.

| Checagem | Pergunta | Valores que viram alerta |
|---|---|---|
| `levavel` | A ficha v2.1 põe o botão "+ ficha" no card, com o mesmo nome do catálogo e com `data-kf-id`? | `parcial`, `nao` |
| `levavel.descricaoV21` | O texto que a v2.1 grava no campo descrição traz a mecânica? (compara, por palavras, a descrição levada com o card sem nome, custo, citação e ambientação; completa a partir de 90%) | `parcial`, `vazia` rebaixam `levavel` para `parcial` |
| `custo` | O custo do cabeçalho cabe no vocabulário do contrato (ações, recurso, valor)? | `parcial`, `nao` |
| `recarga` | A notação de uso por período segue a L29 ("1x/Descanso Longo", não "1x/Dia")? | `alerta` |
| `referencias` | As condições, itens, magias, perícias e tipos de dano citados existem? | `alerta` |
| Regra atual | `obsoletas` (padrão de regra antiga, pela tabela) e `achados` (conflito lido à mão e conferido) | `obsoleto`, `revisar`; achado de gravidade alta ou média |

`automacao` é informativo: hoje tudo é manual (a ficha não automatiza técnica de classe, `03-respostas-pedro.md` §1), e o
campo `numeros` lista os valores que a técnica mexe, para o jogador lançar à mão.

Em resumo, uma técnica "funciona na ficha" quando vai com nome e texto completos, o custo é legível e o texto não contradiz a
regra atual.

## Resultado

**96 de 382 técnicas sem alerta.** Os motivos se concentram em poucos consertos:

- **A descrição é o problema maior, e o conserto é um só.** A v2.1 grava como descrição o primeiro `<p>` do card. Nos cards
  cuja mecânica está em lista (`<ul>`) ou em `div.effect`, ela não chega à ficha: 123 técnicas vão com a descrição
  vazia e 82 só com parte do texto (em geral a ambientação). Nas 7 classes, as 15 técnicas gerais chegam
  completas; os ramos, as marcas e as ultimates, não. A Muralha Viva vai vazia. Corrigir o seletor em `js/ficha.js` (ou
  levar o card inteiro) tira 143 técnicas do alerta de uma vez. Achado `ficha-v21-descricao`, para o site.
- **11 blocos de classe sem botão** (4 características e 7 recursos): a v2.1 não tem seletor para eles.
  A Marca do Duelo, citada em 17 cards do Espadachim, está entre eles.
- **Habilidades de origem e Corrupção vão, mas não como entidade própria.** A habilidade vai junto com o card da origem;
  as 30 linhas da Corrupção vão pela tabela, sem `data-kf-id` nem catálogo, com o custo no nome.
- **160 achados de regra** (12 de gravidade alta,
  81 média e 67 baixa):
  41 para o Pedro, 110 para o balanceamento e
  9 para o site. 86 técnicas
  têm pelo menos um achado alto ou médio. As listas estão abaixo.

### Por classe, raça e origem

Levável: ok / parcial / não. Descrição: completa / parcial / vazia. Obsoletas: obsoleto / revisar. Achados: técnicas cujo
achado mais grave é alto / médio / baixo.

| Fonte | Total | Ok | Alerta | Levável | Descrição | Custo parcial | Recarga | Referências | Obsoletas | Achados |
|---|---|---|---|---|---|---|---|---|---|---|
| Espadachim | 42 | 10 | 32 | 15 / 24 / 3 | 15 / 9 / 15 | 2 | 3 | 1 | 3 / 0 | 2 / 12 / 7 |
| Batedor | 41 | 12 | 29 | 15 / 25 / 1 | 15 / 9 / 16 | 4 | 0 | 1 | 0 / 0 | 1 / 6 / 8 |
| Brutalista | 40 | 14 | 26 | 15 / 24 / 1 | 15 / 7 / 17 | 0 | 0 | 0 | 1 / 1 | 1 / 8 / 8 |
| Teurgo | 41 | 11 | 30 | 15 / 24 / 2 | 15 / 11 / 13 | 4 | 0 | 0 | 0 / 1 | 1 / 8 / 6 |
| Monge | 41 | 13 | 28 | 15 / 24 / 2 | 15 / 10 / 14 | 0 | 0 | 1 | 0 / 1 | 2 / 12 / 8 |
| Alquimista | 40 | 13 | 27 | 15 / 24 / 1 | 15 / 8 / 16 | 2 | 0 | 0 | 1 / 0 | 1 / 5 / 10 |
| Artilheiro | 40 | 11 | 29 | 15 / 24 / 1 | 15 / 6 / 18 | 0 | 0 | 1 | 0 / 0 | 1 / 14 / 3 |
| Humano | 5 | 1 | 4 | 1 / 4 / 0 | 1 / 0 / 4 | 0 | 0 | 0 | 0 / 0 | 0 / 0 / 0 |
| Anão | 5 | 2 | 3 | 2 / 3 / 0 | 2 / 2 / 1 | 0 | 0 | 0 | 0 / 0 | 0 / 0 / 0 |
| Dryad | 5 | 2 | 3 | 2 / 3 / 0 | 2 / 2 / 1 | 0 | 0 | 0 | 0 / 1 | 0 / 0 / 0 |
| Autômato | 18 | 1 | 17 | 1 / 17 / 0 | 1 / 16 / 1 | 0 | 0 | 0 | 0 / 0 | 0 / 2 / 2 |
| Gruto | 5 | 2 | 3 | 2 / 3 / 0 | 2 / 2 / 1 | 0 | 0 | 0 | 0 / 0 | 0 / 0 / 1 |
| Inseto | 6 | 3 | 3 | 3 / 3 / 0 | 3 / 0 / 3 | 0 | 0 | 0 | 0 / 0 | 0 / 0 / 0 |
| Corrompido | 34 | 1 | 33 | 1 / 33 / 0 | 31 / 0 / 3 | 0 | 0 | 0 | 0 / 2 | 1 / 5 / 1 |
| Origens | 19 | 0 | 19 | 0 / 19 / 0 | 19 / 0 / 0 | 0 | 0 | 0 | 0 / 1 | 0 / 4 / 1 |
| **Total** | **382** | **96** | **286** | 117 / 254 / 11 | 166 / 82 / 123 | 12 | 3 | 4 | 5 / 7 | 10 / 76 / 55 |

Os 11 itens sem botão (blocos de classe) contam em Levável "não" e ficam fora da coluna Descrição. Os 15
achados que não são de uma técnica (item alquímico, itens iniciais de origem, contrato, referências do balanceamento) estão
em `achadosGerais` no log e entram nas listas abaixo.

## Para o Pedro

Texto do Notion que precisa de decisão ou reescrita dele. Só gravidade alta e média; as de gravidade baixa
(26) estão no JSON.

### Gravidade alta (3)

1. **Ocultar-se** · Batedor (técnica geral) · alta · `contradiz-regra-atual` · id `batedor-ocultar-se`

   > Ao estar fora da linha de visão de todas as criaturas da cena, pode se esconder com 1 ação ao em vez de 2.

   data/sistema.json > Furtividade: "Você pode tentar se esconder da percepção de outras criaturas [...] rolando a perícia de Furtividade com 3 ações." Contrato regras-ficha/1.1 turno.custoDeAcao.esconder = 3 (canônico). A técnica parte de um custo base de 2 ações que não existe mais: o desconto dela é 3→1 ou 2→1?

2. **Muralha Viva** · Brutalista > Ramo do Colosso > Tier 1 · alta · `regra-desatualizada` · id `brutalista-muralha-viva`

   > O treinamento da sua pericia Defender aumenta de 3 em 3. (Ao invés de 2 em 2)

   data/sistema.json, Defender — regra especial: "seus treinamentos aumentam o tipo de dado da rolagem em vez de adicionarem modificadores" (Leigo 1d6 / Treinado 1d8 / Experiente 1d10 / Mestre 1d12 / Lendário 2d8). Defender não tem degrau de +2, então não existe "3 em 3". L19 respondida em 03-respostas-pedro.md §6: "Vale o primeiro" (o Sistema vence), com a nota do Pedro: "Essa técnica do brutalista está desatualizada". O 1º item ("Você se torna Treinado em Defender...") continua válido: sobe o dado.

3. **Cartucho Arcano** · Alquimista, Ramo do Artificer, Tier 1 · alta · `regra-desatualizada` · id `alquimista-cartucho-arcano`

   > Magias Disponíveis: Você conhece 1 magia + Mod. Inteligência(min. 1) do seu (nível-1) ou menor, após isso você ganha +1 magia por nível.

   D68: o novo Nível 1 são os truques e a regra de acesso passa de "(nível − 1)" para "do mesmo nível que o seu". L18 (03-respostas-pedro.md §6, "Vale o primeiro"): vale a forma corrigida do Teurgo, "iguais ou abaixo do seu nível". O Cartucho é o resíduo da D68 que o próprio lote L18 apontou.

### Gravidade média (12)

1. **Recurso de Classe do Espadachim** · Espadachim · bloco classe · media · `ambigua-para-ficha` · id `espadachim-recurso`

   > "recurso": {"id": null, "nome": null, "status": "pedroDecide"} — nota: Pedro, 2026-09-26: "Tem sim, teurgo também. Todas têm."

   03-respostas-pedro.md §5: "Espadachim e Teurgo têm recurso de classe? — Tem sim, teurgo também. Todas têm." O contrato (classes.espadachim.recursos) está vazio e o Notion não traz nome nem mecânica. A ficha física tem o campo "Recurso de Classe (Atual/Máx.)" e a ficha digital não tem o que pôr ali. A Marca do Duelo é o único medidor da classe e o contrato a trata como estado, não como recurso.

2. **Homem de Negócios** · Batedor > Marca do Trambiqueiro · media · `outro` · id `batedor-homem-de-negocios`

   > Você possui um disturbio de mat

   Frase truncada no dado (data/classes/batedor.json) e no pages/classes/batedor.html gerado. Não há regra a comparar: é texto incompleto, provavelmente cortado no próprio Notion. Precisa do texto completo do Pedro.

3. **Frenesi** · Brutalista > Ramo do Berserker > Tier 1 · media · `regra-desatualizada` · id `brutalista-frenesi`

   > Você pode usar Frenesi 1 vez por descanso longo no nível 1 e 2 vezes no nível 3.

   data/classes/brutalista.json, classe.ramosRegra.porTier: {"tier": 1, "quantidade": 3, "nivel": 2}. O Tier 1 só abre no nível 2, então "no nível 1" não acontece: é resíduo da progressão antiga. A ficha não sabe quantos usos dar do nível 2 ao 4.

4. **Frenesi** · Brutalista > Ramo do Berserker > Tier 1 · media · `ambigua-para-ficha` · id `brutalista-frenesi-2`

   > Fica descontrolado e não pode usar habilidades que exijam paciência ou concentração.

   data/condicoes.json: Descontrolado X agora é condição ("ataca o aliado mais próximo por X rodadas. Você deve gastar o seu turno atacando a criatura mais próxima"). O texto não diz X nem se é a condição (que faria o Brutalista atacar aliados) ou só um adjetivo. "Habilidades que exijam paciência ou concentração" não tem lista nem marcador, e Concentração é recurso de outra classe (contrato vocabulario.recurso). A ficha não consegue travar nada com isso.

5. **Investida** · Brutalista > Técnicas Gerais · media · `ambigua-para-ficha` · id `brutalista-investida`

   > Pode investir em uma linha reta de no mínimo 4,5 m até 9 m. Alvos no caminho, devem suceder em um teste de Fortitude ou recebem (Nível)d6+Mod. Força e ficam Caidos.

   data/sistema.json > Manobras > Investida (D88): "2 ações · Movimento", conta como Mover, teste de Movimento e 1 ação:Atacar por alvo. São duas regras com o mesmo nome, e as Grevas Trovejantes ("A manobra Investida concede +1d6 de dano") ficam ambíguas. L20 está com o Pedro ("Bom revisar"), e o balanceamento propôs renomear a técnica. A técnica também não diz se conta como a ação de Mover (Mover: máx. 1 por turno). Grafia: "Caidos" → condição Caído.

6. **Encadeamento** · Teurgo — Técnica Geral · media · `contradiz-regra-atual` · id `teurgo-encadeamento`

   > Ao conjurar uma magia, pode conjurar outra magia se puder pagar pelas ações. A segunda magia custa Éter adicional igual ao número de ações dela.

   data/sistema.json > Sua Rodada: "Conjurar magia (1-3 ações), no máximo 1 magia conjurada por turno." (PD18, Pedro: "Apenas 1 magia conjurada por turno"). O Receptáculo Perfeito, quando abre essa exceção, escreve "Você pode conjurar mais de uma magia por rodada". O Encadeamento não escreve, então não está claro se é exceção à regra ou se ficou texto morto. Outro problema: o custo "Passiva • 3 Stamina" não diz quando os 3 de Stamina são pagos (por uso?).

7. **Manifestação do Patrono** · Teurgo — Ramo do Arauto, Ultimate (Tier 3) · media · `ambigua-para-ficha` · id `teurgo-manifestacao-do-patrono`

   > Todos os inimigos na área devem passar em Fortitude CD ou ficam Enraizados e Envenenados

   Falta o número da CD (Grande Árvore). O mesmo acontece em "deve passar em Reflexo ou fica Enraizada pelas correntes do abismo" (Trancafiado) e em "Cada uma deve passar em Vontade" (Limiar), ambos sem CD. Nos outros testes a própria ultimate dá número ("Vontade CD 18", "Fortitude CD 15"). Pela D57 a CD seria a do portador, mas o texto escreve "CD" sem valor e sem "sua". ("Envenenados" casa com Envenenamento pelo alias do contrato, condicoesAliases.)

8. **Patrono Primordial** · Teurgo — Ramo do Arauto, Tier 1 (A Grande Árvore) · media · `ambigua-para-ficha` · id `teurgo-patrono-primordial-2`

   > Uma vez por descanso longo, pode beber Seiva, recupera 1d6 de éter e remove alguma condição mental, exceto Oco.

   PD26a (docs/ficha-digital/03-respostas-pedro.md §3.1, data/balanceamento/marcas-vhelor.json): "Cada folha, seiva ou casca consumida adiciona 1 Marca da Vhelor." O pacto manda "Propague a todo momento os benefícios do uso de Seiva". A Seiva do patrono soma Marca da Vhelor ou não? Os dados não ligam a Grande Árvore à Vhelor, e a ficha precisa saber se incrementa o contador.

9. **Recurso de Classe do Teurgo** · Teurgo — bloco classe · media · `ambigua-para-ficha` · id `teurgo-recurso`

   > "recurso": {"id": null, "nome": null, "status": "pedroDecide"}

   docs/ficha-digital/03-respostas-pedro.md §5, Pedro: "Tem sim, teurgo também. Todas têm." O contrato data/balanceamento/ficha-digital-regras.json > classes.teurgo diz "recursos": [] e "Sem contador proprio: o recurso e o Eter". As duas fontes se contradizem, e o nome e a mecânica não estão no Notion. A ficha não tem o que exibir no campo Recurso de Classe.

10. **Forma do Vazio** · Monge — Ramo do Vazio, Tier 1 · media · `outro` · id `monge-forma-do-vazio`

   > Você fica Parcialmente Intangível: Ataques físicos tem 50% de chance de falhar contra você. (Role 1d10 → <5 = Acerta)

   Contradição interna: em 1d10, "<5" são os resultados 1–4, ou seja, 40% de acerto e 60% de falha, não 50%. Além disso, "ataques físicos" não é categoria do Sistema: data/sistema.json divide o dano em Ordinário (Cortante/Contundente/Perfurante) e atípicos. Não fica claro se um ataque desarmado Necrótico ou uma arma com dano elemental conta.

11. **Titã** · Alquimista, Ramo do Artificer, Ultimate · media · `ambigua-para-ficha` · id `alquimista-tita`

   > Investida: 3 Ações, avança 12 m em linha reta. Criaturas no caminho que falharem em um teste de Fortitude sofrem 3d10 Contundente, ficam Caídas e podem ser empurradas até 3 m.

   D88 / Sistema > Manobras: a manobra canônica Investida custa 2 ações, conta como Mover e resolve por teste de Movimento com 1 ação:Atacar. L20 (09-decisoes-pedro.md, "Respondidos, mas ainda ambíguos"): três regras diferentes com o nome "Investida" (manobra, técnica do Brutalista, ação do Titã). O Pedro respondeu "Bom revisar", a proposta é renomear as duas antigas, e ainda faltam os nomes. Na ficha e na Mesa o nome colide com a manobra.

12. **Munição Especial — peso** · Artilheiro / Pólvora T2 · media · `contradiz-regra-atual` · id `artilheiro-municao-especial`

   > 3 munições especiais contam como 1 bugiganga.

   CLAUDE.md §2 (confirmado pelo Pedro em 2026-09-25): itens Empilháveis, munição incluída, pesam 10 unidades = 1. O CSV do Bazar diz o mesmo para toda munição ("Empilhável: pesa 1 bugiganga a cada 10 unidades"), e o contrato tem municao.unidadesPorSlot = 10. Se for exceção proposital da munição especial, precisa estar dito; senão está desatualizado.

## Para o balanceamento

Regra que ficou ambígua ou contraditória com o sistema atual, ou contrato que diverge do texto. Só gravidade alta e média;
as de gravidade baixa (36) estão no JSON.

### Gravidade alta (8)

1. **Inimigo Mortal** · Espadachim · Ramo do Guarda-Lâmina · Tier 2 · alta · `regra-desatualizada` · id `espadachim-inimigo-mortal`

   > Até o início do seu próximo turno, você pode retaliar a Marca do Duelo até 2 vezes sem gastar reação.

   data/sistema.json > Atacando & Retaliação: "Enquanto estiver sendo alvo dos seus ataques durante o seu turno, a criatura pode escolher reagir (Atacar ou Defender) a cada um deles. Ao final do seu turno, ela considera a reação gasta". Contrato turno.reacaoNota: "UMA reacao ja cobre TODOS os ataques de UM agressor". A técnica foi escrita no modelo antigo (1 reação por ataque). Hoje retaliar a Marca várias vezes no turno dela já custa 1 reação só, então o "até 2 vezes" não tem efeito. Sobra, talvez, não gastar a reação contra outro agressor, mas o texto não diz isso.

2. **Quebrar Postura** · Espadachim · Geral · alta · `contradiz-regra-atual` · id `espadachim-quebrar-postura`

   > Ao acertar um alvo com a Marca do Duelo, ele perde sua reação até o fim da rodada. O alvo ainda pode bloquear ou retaliar, mas perde a reação logo em seguida se for acertado.

   data/sistema.json > Atacando & Retaliação: o alvo reage "a cada um deles" (todos os seus ataques no seu turno) e "Ao final do seu turno, ela considera a reação gasta". Pelo modelo atual, o alvo que reagiu ao seu primeiro ataque já está com a reação comprometida até o fim do seu turno. As duas frases da técnica também se contradizem: primeiro ele perde a reação, depois ainda pode bloquear/retaliar. Além disso, o texto fala em "até o fim da rodada" e a regra conta "até o início do próximo" turno dele. A ficha não consegue dizer o que a técnica faz.

3. **Êxtase Destrutivo** · Teurgo — Ramo do Receptáculo, Tier 2 · alta · `contradiz-regra-atual` · id `teurgo-extase-destrutivo`

   > Ao ter 0 de Éter ou abaixo: Suas magias de Destruição: Causam +2d6 de dano. Suas magias de Abjuração: Têm +100% de Efeito ou Duração e não podem ser dissipadas.

   data/sistema.json > Status: "Éter: ... Ao reduzir a 0 ou menos fica Oco." data/condicoes.json > Oco: "Você não consegue canalizar magias." Com Éter ≤ 0 o Teurgo está Oco e não conjura, então o bloco inteiro "0 de Éter ou abaixo" nunca dispara sozinho. Só funciona combinado com Receptáculo Perfeito ("Você pode conjurar magias mesmo estando Oco") ou pagando com Saúde via Reserva Oculta, e o texto não diz isso. Além disso, "imediatamente você gasta 50% do seu éter máximo" pode levar o Éter a ≤ 0 ao ativar, deixando o Teurgo Oco na hora.

4. **Fluxo (Característica/Recurso de Classe)** · Monge (classe) · alta · `ambigua-para-ficha` · id `monge-recurso-fluxo`

   > Ao fim do combate, se passar 1 rodada sem ganhar Fluxo ou receber dano, você perde todo seu Fluxo.

   docs/ficha-digital/03-respostas-pedro.md §6, L23: a proposta era trocar por "Ao fim do combate, você perde todo o seu Fluxo." O Pedro respondeu "Outra": "Porém ainda tem, se receber dano que zera seu fluxo." Ou seja, receber dano zera o Fluxo. O contrato (ficha-digital-regras.json, classes.monge.recursos[fluxo]) tem zeraEm: ["fimCombate"] e trata a frase como _clausulaMorta (status "decisao"). data/classes/monge.json, medidores.recarga, também só tem fimCombate. A ficha nunca zera o Fluxo ao receber dano, e o texto do Notion continua o antigo.

5. **Quebrar Guarda** · Monge — Técnica Geral · alta · `regra-desatualizada` · id `monge-quebrar-guarda`

   > Seu primeiro ataque gasta a reação do seu alvo. Ou seja, ele só pode defender ao seu primeiro golpe.

   data/sistema.json > Defesa: "Evasão Ativa — ... somar o dado da perícia Defender ... à sua evasão contra todos os ataques do agressor neste turno." Sistema > Atacando: "a criatura pode escolher reagir (Atacar ou Defender) a cada um deles. Ao final do seu turno, ela considera a reação gasta". O contrato, turno.reacaoNota, diz: "UMA reacao ja cobre TODOS os ataques de UM agressor" (D8c). Com a regra atual, a reação gasta no 1º golpe já cobre os seguintes, então a técnica ficou sem efeito. Não está escrito se os golpes 2+ passam a ir contra a Evasão Passiva, nem se ela proíbe retaliar.

6. **Treinamento fixo (contrato)** · Monge (classe) — contrato regras-ficha · alta · `outro` · id `monge-treinamento-contrato`

   > Armas Marciais, Movimento, Atacar

   data/classes/monge.json (sincronizado com o Notion), treinamento.fixo: Movimento e Atacar; Vontade aparece só na lista de escolha ("Vontade, Defender, Iniciativa, Religião, Percepção"). O contrato ficha-digital-regras.json, classes.monge.periciasIniciais, diz ["movimento","vontade"]. Uma ficha que siga o contrato dá Vontade em vez de Atacar.

7. **Concentração (Característica de Classe) — gasta ou só exige** · Artilheiro / Característica de Classe · alta · `outro` · id `artilheiro-concentracao-gasta-ou-exige`

   > Você gasta concentração para utilizar técnicas porém pode perder de outras formas: [...] Algumas técnicas e habilidades podem exigir concentração, ao utiliza-las, diminua sua concentração conforme o requisitado.

   O contrato data/balanceamento/ficha-digital-regras.json (classes.artilheiro.recursos[0]) diz "custoEmTecnicasPadrao": "requisito" e o _alertaDeDesenho afirma que "o texto nao diz se cada tecnica GASTA ou so EXIGE". O texto canônico da classe (data/classes/artilheiro.json, recurso.perdasIntro/regras) diz que GASTA ("diminua sua concentração conforme o requisitado"). O contrato contradiz o texto da classe; se a ficha seguir o contrato, não desconta Concentração ao usar Tiro Preciso, Foco Absoluto etc.

8. **Premonição Etérica** · Corrompido (corrupção −2) · alta · `regra-desatualizada` · id `corrompido-premonicao-eterica`

   > +1 Evasão. Seu dado da perícia Defender se torna um 2d6, ao invés de 1d10.

   data/sistema.json > Proficiência > 'Defender — regra especial': o dado sobe com o treinamento, 'Leigo Treinado Experiente Mestre Lendário: 1d6 1d8 1d10 1d12 2d8'. Evasão Ativa = passiva + dado de Defender 'conforme seu treinamento' (Sistema > Defesa; PD8/D8b). O '1d10' fixo é o modelo antigo, que o contrato lista em derivados.evasao.ativa._obsoletas. Lida hoje, a técnica melhora o dado de Leigo a Experiente, quase não muda nada no Mestre e piora o Lendário (2d8 → 2d6). O +1 Evasão também não aparece em derivados.evasao.modificadores do contrato.

### Gravidade média (66)

1. **Guardar a Lâmina** · Espadachim · Ramo do Guarda-Lâmina · Tier 1 · media · `regra-desatualizada` · id `espadachim-guardar-a-lamina`

   > Até o início do seu próximo turno você ganha as seguintes vantagens: +2 Defender · Sua primeira retaliação não gasta reação

   data/sistema.json > Atacando & Retaliação: a reação cobre todos os ataques de um agressor no turno dele e só "Ao final do seu turno, ela considera a reação gasta" (contrato turno.reacaoNota). No modelo atual, "primeira retaliação" não separa nada: a reação gasta é uma por agressor. O texto não diz se o efeito passa a ser "a reação contra o primeiro agressor não é gasta".

2. **Sentença Final** · Espadachim · Ramo do Guarda-Lâmina · Ultimate (Tier 3) · media · `regra-desatualizada` · id `espadachim-sentenca-final`

   > Enquanto neste plano, as suas retaliações não gastam reação.

   data/sistema.json > Atacando & Retaliação + contrato turno.reacaoNota ("UMA reacao ja cobre TODOS os ataques de UM agressor"). No plano só existe um agressor, a Marca, e 1 reação já cobre todas as retaliações contra ela em cada turno dela. O benefício escrito fica nulo no modelo atual.

3. **Parry Perfeito** · Espadachim · Ramo do Guarda-Lâmina · Tier 1 · media · `ambigua-para-ficha` · id `espadachim-parry-perfeito`

   > Ao defender um ataque da Marca do Duelo com sucesso, Retalie como Ação Livre.

   data/sistema.json > Atacando & Retaliação: Retaliar e Defender são as 2 opções da mesma reação, e Retaliar é uma disputa ("Caso o alvo ultrapasse seu valor, ele te ataca"). Evasão Ativa: o dado vale "contra todos os ataques do agressor neste turno". Sistema > Sua Rodada: "Ações livres não têm limite por turno" (PD18). Fica em aberto se a retaliação livre exige a rolagem de Atacar contra o ataque da Marca e se dispara em cada ataque defendido (3 Stamina cada, sem teto).

4. **Corte Diagonal** · Espadachim · Geral · media · `ambigua-para-ficha` · id `espadachim-corte-diagonal`

   > 3 Stamina · Ação Livre — Seu próximo ataque tem +2 no acerto. Adicionalmente, se seu próximo ataque acertar um inimigo com a Marca do Duelo adiciona Sangramento 1.

   data/sistema.json > Sua Rodada: "Ações livres não têm limite por turno." (PD18: "ações livres infinitas"). Condições > Sangramento X: "Se o acerto também aplicar Sangramento, o dano e a redução acontecem antes da nova aplicação". Sem limite de uso, a técnica pode ser ativada várias vezes para o mesmo "próximo ataque" (+2/+4/+6 e Sangramento 1/2/3?). O texto não diz se acumula.

5. **Dobrar a Aposta** · Espadachim · Ramo do Exilado Bêbado · Tier 2 · media · `ambigua-para-ficha` · id `espadachim-dobrar-a-aposta`

   > Ação Livre · 3 Stamina — Declare antes de atacar a Marca do Duelo. Se acertar: +4d6 de dano Cortante. Se errar: receba 2d6 de dano Primordial e fique Exposto.

   data/sistema.json > Sua Rodada: "Ações livres não têm limite por turno." (PD18). Nada impede declarar 2 ou mais vezes no mesmo ataque (+8d6 / 4d6 Primordial), nem declarar em todos os ataques do turno. Falta um limite (1x por ataque? por turno?).

6. **Lâmina Rápida** · Espadachim · Geral · media · `ambigua-para-ficha` · id `espadachim-lamina-rapida`

   > Ataque duas vezes como 1 ação. Esses ataques não podem receber retaliação.

   data/sistema.json > Sua Rodada: "Atacar (Depende da arma) — Ataques consecutivos somam −5 a cada ataque no mesmo turno". As armas do Bazar têm custo próprio (Marcial Pesada/Longa "Atacar(2)", Pesada Brutal "Atacar(3)"), e o Espadachim treina Armas Marciais. O texto não diz se funciona com arma de Atacar(2)/(3) nem se o 2º ataque leva o −5 (D29, por alvo).

7. **Massacre** · Espadachim · Ramo do Oprimido · Tier 2 · media · `ambigua-para-ficha` · id `espadachim-massacre`

   > 1 Ação · 5 Stamina — Faça 2 ataques corpo a corpo contra a Marca do Duelo. Se ambos acertarem: Você causa +2d6 de dano Cortante · O alvo recebe Sangramento 1.

   Mesmo caso da Lâmina Rápida: Sistema > Sua Rodada "Atacar (Depende da arma) — Ataques consecutivos somam −5" (D29: por alvo, e aqui o alvo é o mesmo). Armas Marciais com Atacar(2) no Bazar. Não está escrito se o 2º ataque leva −5 nem se armas de Atacar(2)/(3) podem ser usadas. O "+2d6" também não diz se vale uma vez ou por ataque.

8. **Proficiência com Espadas (característica de classe)** · Espadachim · Característica de classe · media · `referencia-inexistente` · id `espadachim-proficiencia-com-espadas`

   > Você ignora Ar (Armadura) em ataques com espada igual ao seu nível, adicionalmente você ignora resistência a dano Cortante a partir do nível 3.

   data/Bazar_Khalkaria_v26.csv: nenhum item tem "espada" no nome, e as armas são chassis (Leve Cortante, Marcial Precisa, Marcial Versátil, Pesada Brutal…), sem tag de espada (Tags das armas: só Foco/*, Arremesso, Munição). O treinamento da classe é "Armas Marciais". A ficha não consegue saber quais armas contam como espada: arma que causa Cortante? Marciais? Lista de nomes (Lâmina, Sabre, Rapieira)?

9. **Beber até Cair** · Espadachim · Ramo do Exilado Bêbado · Tier 1 · media · `referencia-inexistente` · id `espadachim-beber-ate-cair`

   > 1 Ação · 1 Item:Álcool — Fique Bêbado. Adicionalmente, você ignora as adversidades da condição Bêbado descritas na tabela de Condições.

   data/Bazar_Khalkaria_v26.csv: não existe tag nem categoria "Álcool". As bebidas são Consumível com Tags "Bebida, Uso Único", e isso inclui o Café Preto, que "Remove Bêbado". A condição Bêbado (data/condicoes.json) não tem duração, e as bebidas dizem "até o fim da cena". A ficha não sabe que item consumir, se o efeito próprio da bebida também vale, nem quanto dura o Bêbado.

10. **Ponto Fraco** · Espadachim · Geral · media · `custo-ou-recarga-fora-do-padrao` · id `espadachim-ponto-fraco`

   > 5 Stamina · Passiva — Ao atacar um inimigo Exposto, você pode como uma ação livre gastar 5 de Stamina para manter a condição no inimigo, mesmo após atacar.

   O cabeçalho diz "Passiva" e o texto diz "como uma ação livre gastar 5 de Stamina" (custo por uso). O contrato vocabulario.custoTipoDetalhe.reserva cita "Ponto Fraco: 5 Stamina Passiva" como Stamina COMPROMETIDA enquanto a passiva está ligada (pedroDecide), e essa leitura contradiz o próprio texto. Condições > Exposto: "Remove ao acertar". A técnica é compatível com essa regra, mas a ficha vai descontar errado se seguir o contrato.

11. **Fantasma** · Batedor (técnica geral) · media · `regra-desatualizada` · id `batedor-fantasma`

   > Ao ser atacado e optar por se defender, pode somar seu treinamento de Furtividade na perícia.

   Mesmo problema da Muralha Viva (L19). Defender virou dado: Sistema > Sua Rodada "Defender fora do seu turno (Reação) → Soma o dado da perícia Defender à sua evasão"; PD8 (03-respostas-pedro.md) "é ativa 10 + mod. des + Dado Defender". O texto é do tempo em que o treino de Defender era +2/+4/+6/+8. Hoje "treinamento" em Defender é um dado e em Furtividade é um bônus fixo, então a soma fica sem forma definida: +2×grau fixo no dado de Defender, ou um dado extra? Também não diz se a Ação Livre pode ser usada fora do próprio turno. O Sistema só diz "Ações livres não têm limite por turno".

12. **Sexto Sentido (habilidade de Instinto)** · Batedor > Característica de classe (Instinto) · media · `ambigua-para-ficha` · id `batedor-sexto-sentido`

   > Adicione +2 à sua evasão durante esse turno.

   data/classes/batedor.json, recurso.habilidades[sexto-sentido]: acao "Ação Livre", custo "2" (Instinto). A Evasão agora tem duas partes: Passiva (10 + Mod.DES) e Ativa (Passiva + dado de Defender, 1 reação, só contra o agressor daquele turno). Fontes: PD8 e Sistema > Defesa. O texto não diz em qual das duas entra o +2. "Durante esse turno" só serve se a Ação Livre puder ser usada no turno do inimigo, e o Sistema não diz isso: só "Ações livres não têm limite por turno" (PD18). O contrato registra "batedor-sexto-sentido" com valor 2 e duração "turno", sem resolver de quem é o turno.

13. **Instinto (ganho/perda por perícia)** · Batedor > Característica de classe · media · `ambigua-para-ficha` · id `batedor-recurso-instinto`

   > Perícia: Ao suceder em qualquer perícia → +1 Instinto : Máx. 2x por rodada, Máx. 1x/perícia a cada cena / Perícia: Ao falhar qualquer perícia → =0 Instinto

   Atacar e Defender são perícias. Defender agora é um dado somado à Evasão (PD8), sem CD, e não tem "sucesso" nem "falha" próprios. Assim, a esquiva conta duas vezes ("Esquiva: Ao esquivar" e "suceder em perícia") ou nenhuma? O contrato (classes.batedor.recursos._alertaDeDesenho) já marca como BUG CONHECIDO que errar um Atacar zera o Instinto em ~98% dos turnos, com status "canonico-mas-em-rework" (D79). A ficha não consegue automatizar ganho nem perda enquanto isso não fechar.

14. **Silêncio** · Batedor > Sem-Nome Tier 3 (Ultimate) · media · `ambigua-para-ficha` · id `batedor-silencio`

   > Escolha uma criatura em sua visão por rodada, ela recebe Marcada à Morte 1, essa condição soma ao ser aplicada novamente [...] Alvos marcados ficam Expostos, porém ainda remove a condição ao atacar. [...] Você perde 1d6 de éter.

   (1) Não diz quanto dura, nem quando ou se a ultimate termina. As irmãs dizem: Senhor das Linhas "Ao fim do combate, sua ultimate cessa", Suborno "até o fim do combate/cena". (2) Não diz quando se perde o 1d6 de Éter (ao ativar ou ao encerrar). (3) Exposto hoje é "O primeiro ataque que acertar essa criatura é crítico. Remove ao acertar" (condicoes.json; PD17: "Exposto é removido após ser acertado por um ataque"). O texto diz "remove a condição ao atacar", e não diz se remarcar reaplica o Exposto. (4) Chama Marcada à Morte de "condição", mas o contrato (condicoes, id marcada-a-morte) e a PD17 dizem que ela não é condição genérica: é estado de classe.

15. **Cicatrizes da Jornada** · Batedor > Marca do Cartógrafo · media · `ambigua-para-ficha` · id `batedor-cicatrizes-da-jornada`

   > Ao falhar em um teste de Sobrevivência, pode escolher perder 2d6 de Stamina para transformar em sucesso

   D93 (09-decisoes-pedro.md): "A Stamina NÃO fica negativa. Perdas que tiram Stamina param em 0." O custo é aleatório e não tem requisito de saldo. Com Stamina 0 (ou abaixo do 2d6 rolado), a conversão em sucesso sai de graça ou sai mais barata. A ficha não sabe se exige Stamina mínima antes de rolar.

16. **Mapa Mental** · Batedor > Cartógrafo Tier 2 · media · `ambigua-para-ficha` · id `batedor-mapa-mental`

   > Você mentaliza o esboço de um mapa tático, ganhando seus benefícios nesta rodada.

   "Seus benefícios" aponta sem nome para os do Desenhar Mapa de Combate (também Cartógrafo Tier 2: não Desprevenido, Coordenação, Ponto Cego, Reposicionar). Não diz se exige ter essa técnica. O Tier 2 dá só 2 escolhas, e quem pega Mapa Mental sem Desenhar Mapa de Combate fica sem saber quais benefícios recebe. A ficha não consegue listar as ações liberadas.

17. **Guardião** · Brutalista > Ramo do Colosso > Tier 1 · media · `contradiz-regra-atual` · id `brutalista-guardiao`

   > Quando um aliado adjacente (até 1,5m) for atacado, você pode usar sua reação para se tornar o alvo do ataque. / Você pode usar Defender normalmente contra esse ataque.

   data/sistema.json, Evasão Ativa: "você pode gastar sua reação para somar o dado da perícia Defender"; Sua Rodada: "1 reação por turno" (contrato turno.reacoes = 1). Guardião já gastou a única reação, então "usar Defender normalmente" é impossível sem uma 2ª reação. Falta dizer se esse Defender sai grátis ou se a frase cai. Detalhe extra: o custoTexto é "Passiva", mas a técnica consome a reação.

18. **Resistência Adaptável** · Brutalista > Ramo do Colosso > Tier 2 · media · `ambigua-para-ficha` · id `brutalista-resistencia-adaptavel`

   > Você possui 5 Armadura Específica(Ae) de um tipo de dano escolhido por você. / Ao receber dano específico diferente do protegido pela sua Ae, pode gastar 3 de Stamina como uma ação livre para trocar o tipo de dano da Ae para o tipo de dano que foi atacado instantaneamente.

   data/sistema.json, Defesa: "Armadura Específica (Ae) reduz dano atípico". D63 (09-decisoes-pedro.md): "Ae é SEMPRE um tipo de dano" e "Força e Primordial são reservados para Luxária"; D89/L26: Ae(Todos) exclui Força e Primordial. Não está dito se a escolha aceita um tipo Ordinário (Cortante etc.), Força ou Primordial. Também não está dito se a troca "instantaneamente" já reduz o golpe que a disparou. A ficha precisa da lista de tipos válidos.

19. **Formação de Combate** · Brutalista > Ramo do General > Tier 2 · media · `ambigua-para-ficha` · id `brutalista-formacao-de-combate`

   > 2+ Aliados: +2 Atacar / 3+ Aliados: +1 Atacar / 4+ Aliados: +1,5 Movimento / ... 5+ Aliados: Quando um aliado dentro do alcance executa uma criatura, ele ganha 1 ação grátis.

   Não há regra que diga se os degraus se somam (3 aliados = +3 ou só +1?). "Movimento" é ao mesmo tempo perícia (data/pericias.json) e derivado em metros, e "+1,5" não diz qual dos dois. "Executa" pode ser matar ou a propriedade de arma Executar (data/sistema.json, Marcial Precisa: "Executar — 1x/Turno não custa Stamina"). A ficha não consegue calcular o bônus.

20. **A Última Parede** · Brutalista > Ramo do Colosso > Tier 3 (Ultimate) · media · `ambigua-para-ficha` · id `brutalista-a-ultima-parede`

   > Você tem resistência a todos os tipos de dano. ... Ao acabar o efeito, você ganha Exaustão 1.

   Para Ae(Todos), D89 e a nota do Pedro na L26 dizem que "sempre exclui dano de força e primordial". Para "Resistência a todos os tipos" não há regra: fica em aberto se inclui Força e Primordial. "Ganha Exaustão 1" pode fixar em 1 ou somar 1. A marca Imortal escreve "+1 de Exaustão", e data/condicoes.json trata Exaustão como escala 1–5.

21. **Despertar A Besta** · Brutalista > Ramo do Berserker > Tier 3 (Ultimate) · media · `ambigua-para-ficha` · id `brutalista-despertar-a-besta`

   > Você perde permanentemente 2 de Éter. / Você é imune a Amedrontado, Enfeitiçado, Atordoado e Inconsciente. / Enquanto sob o efeito, ao cair para 0 de Saúde pela primeira vez, fica com 1 de saúde ao em vez disso.

   "Perde permanentemente 2 de Éter" pode ser −2 no Éter máximo, acumulando a cada uso, ou só no atual. A ficha precisa saber se grava uma redução permanente de máximo (L02: "reduções permanentes" entram no cálculo dos máximos). Na segunda queda a 0, data/condicoes.json manda o personagem para Morrendo, que inclui Inconsciente, mas ele está imune a Inconsciente. O texto não resolve.

22. **Campo de Batalha** · Brutalista > Ramo do General > Tier 3 (Ultimate) · media · `contradiz-regra-atual` · id `brutalista-campo-de-batalha`

   > Pode se mover como uma ação livre e não causa ataques de oportunidade.

   data/sistema.json, Sua Rodada: "Mover (1 ação) — Max. 1 vez por turno" e "Ações livres não têm limite por turno" (D18: "ações livres infinitas"). Lido ao pé da letra, os aliados se movem sem limite por 1 minuto. Falta dizer se o limite de 1 Mover por turno continua valendo.

23. **Êxtase Destrutivo** · Teurgo — Ramo do Receptáculo, Tier 2 · media · `ambigua-para-ficha` · id `teurgo-extase-destrutivo-2`

   > Como 3 ações, você pode assumir a forma do Êxtase, imediatamente você gasta 50% do seu éter máximo. Ao longo de 10 minutos, com 3 ações, você pode restaurar 50% éter máximo.

   Sem regra que feche. Não diz quanto dura a forma, como se sai dela, nem se "restaurar 50%" é recuperar Éter (e quantas vezes) ou devolver o que foi gasto ao sair. O custo aparece como "Passiva, 3 Ações, 50% Éter", uma passiva com custo de ação. A ficha não tem como registrar estado ativo/inativo nem a recarga.

24. **Natureza Caótica** · Teurgo — Ramo do Receptáculo, Tier 1 · media · `ambigua-para-ficha` · id `teurgo-natureza-caotica`

   > Você perde +1d4 de Éter e a magia perde 1 de intensidade, se a intensidade for contida, a magia falha. ... A magia ganha +1 de intensidade, se a intensidade já for transbordante, ganha +1 dado de efeito(Cura, Dano) ou +50% de duração/área.

   data/sistema.json > Intensidade: "Magias de Nível 1 não possuem a intensidade Contida." (D68). Numa magia de Nível 1 em Normal, perder 1 intensidade leva a uma Contida que não existe: falha ou não? O texto também não diz se o custo de Éter muda junto com a intensidade (−2/+2), nem se o +1 que chega a Transbordante exige o teste do Sistema: "Transbordante: Vontade CD 15 ou falha no cast e perde o dobro de éter utilizado."

25. **Tese Arcana** · Teurgo — Ramo do Acadêmico, Tier 1 · media · `ambigua-para-ficha` · id `teurgo-tese-arcana`

   > Sua Tese Arcana possui uma modulação grátis e sua intensidade é de 1 nível acima ao conjurado.

   data/sistema.json > Intensidade (Contida −2 / Normal / Forçada +2 / Transbordante +4, e "Transbordante: Vontade CD 15 ou falha no cast..."). Não se sabe se paga o custo da intensidade conjurada ou da resultante, se a intensidade que sobe para Transbordante exige o teste de Vontade, nem o que acontece se a magia já foi conjurada em Transbordante. A ficha não consegue calcular o custo.

26. **Patrono Primordial** · Teurgo — Ramo do Arauto, Tier 1 (A Grande Árvore) · media · `ambigua-para-ficha` · id `teurgo-patrono-primordial`

   > Suas magias de alteração sempre tem intensidade +1.

   Tem a mesma lacuna da Tese Arcana diante de data/sistema.json > Intensidade: não diz qual custo se paga, se a Transbordante resultante rola "Vontade CD 15", nem o que acontece numa Alteração já Transbordante.

27. **Grimório Arcano** · Teurgo — Ramo do Acadêmico, Tier 1 (mesmo problema em Canalizador Inato e Magias Pactuadas) · media · `ambigua-para-ficha` · id `teurgo-grimorio-arcano`

   > Essa técnica substitui a fórmula nível 1 de magias disponíveis. Escolha 3+Mod. Inteligência magias em escolas que você é especializado e +1 para cada nível subsequente.

   L14 continua aberta (09-decisoes-pedro, "Respondidos, mas ainda ambíguos"; contrato teurgo.lacuna). Pedro: "Todo tier 1 do teurgo tem uma maneira de obter magias diferente." Não está decidido se pegar uma das três técnicas de grimório no nível 2 é obrigatório, nem quantas magias tem, do nível 2 em diante, o Teurgo que não pega nenhuma. Também não fica claro se "+1 para cada nível subsequente" conta a partir do nível 1 ou do 2, já que o Tier 1 só abre no nível 2.

28. **Escolas do Primórdio** · Teurgo — Característica de Classe · media · `referencia-inexistente` · id `teurgo-escolas-do-primordio`

   > 🌟 Primordial — Magia selvagem e bruta, intenção incompreendida. (Requer nível 5)

   data/magias.json não tem a escola "primordial". As magias de Nível 5 estão divididas entre destruicao/abjuracao/alteracao/conhecimento. data/sistema.json: "Magias Nível 5 — 8 Éter — Requer Foco Primordial" e "Foco Primordial ... permite castar magias Primordiais — Experiente em Místico". O contrato conta Primordial como 5ª escola (escolas nv5 = 5). A ficha não sabe se "dominar a escola Primordial" libera o Nível 5 das escolas já dominadas ou se é uma escola à parte sem magias.

29. **Arma Humana** · Monge — Característica de Classe · media · `referencia-inexistente` · id `monge-arma-humana`

   > Seus ataques desarmados causam 1d8 de dano (ao invés de 1d4).

   data/sistema.json não tem nenhuma ocorrência de "desarmado". A tabela de armas não define o ataque desarmado base (1d4): falta atributo, tipo de dano e Atacar(n). O contrato também não o modela. Punho Perfeito ("+1d6 de dano Contundente") e Toque da Dor ("Necrótico ao invés de Contundente") supõem Contundente, mas não há fonte. Sem isso a ficha não monta a arma principal do Monge.

30. **Concentração do Mestre** · Monge — Ramo do Punho, Tier 2 · media · `ambigua-para-ficha` · id `monge-concentracao-do-mestre`

   > Seu fluxo, só reseta após 2 rodadas sem ganhar fluxo. / Ao receber dano, pode negar a perda de fluxo uma quantidade de vezes igual ao seu Mod. de Sabedoria/Descanso Longo.

   O 1º item depende da cláusula "1 rodada sem ganhar Fluxo", que o contrato chama de _clausulaMorta ("NUNCA dispara em combate") e não modela. A L23 foi respondida com "Outra" (03-respostas-pedro.md §6), sem dizer se o reset por inatividade continua. O 2º item bate com a resposta do Pedro (dano zera o Fluxo), mas o contrato não tem o evento "receber dano zera Fluxo" que ele anula. Como está, a ficha não tem o que alterar em nenhum dos dois itens.

31. **Fluxo Invertido** · Monge — Ramo do Vazio, Tier 1 · media · `ambigua-para-ficha` · id `monge-fluxo-invertido`

   > +1 Fluxo ao receber dano

   L23 (03-respostas-pedro.md §6), Pedro: "Porém ainda tem, se receber dano que zera seu fluxo." A mesma ocorrência de dano zera o Fluxo e dá +1. Falta a ordem: zera e depois ganha 1, ou a técnica substitui a perda? O resultado muda de 0/1 para o valor anterior +1.

32. **Totem Eterno** · Monge — Ramo do Naturalista, Tier 2 · media · `contradiz-regra-atual` · id `monge-totem-eterno`

   > Inimigos nesta área devem suceder em um teste de Fortitude ou ficam Paralisados até sucederem no final de cada um de seus turnos ou o totem acabar.

   data/condicoes.json, Paralisado: "Qualquer teste de resistência é instantaneamente fracassado." e "Você fica Exposto e não pode realizar nenhuma ação nem reação." O novo teste no fim do turno falha sempre, então a paralisia dura até o totem acabar (3 rodadas), e cada alvo fica Exposto (o 1º acerto é crítico).

33. **Transcendência Suprema** · Monge — Ramo do Punho, Ultimate · media · `contradiz-regra-atual` · id `monge-transcendencia-suprema`

   > Após 5 Turnos, recebe Exaustão 1, fica Exaurido e perde 1d6 de éter.

   data/condicoes.json, Exaurido: "Você está com 0 de Stamina ... Encerra quando sua Stamina volta a ficar acima de 0." Sistema > Status: "Ao reduzir a 0, fica Exaurido. A Stamina não fica negativa." (D93). Com a Stamina acima de 0 a condição se encerra no mesmo instante. Não está escrito se o custo zera a Stamina ou só marca a condição.

34. **Companheiro Primal II** · Monge — Ramo do Naturalista, Tier 2 · media · `ambigua-para-ficha` · id `monge-companheiro-primal-ii`

   > Passiva ... Você invoca um espírito animal maior ... Ataque: Mod. Des + 2, Dano: 2d6+Des(Cortante) ... O Companheiro age no seu turno, tem 2 Ações, evasão passiva permanente e usa seu bônus de Atacar.

   O custo diz "Passiva", mas a técnica é uma invocação e não traz ação nem Stamina (o Companheiro Primal I custa "2 Ações, 5 Stamina"). No mesmo card, o ataque aparece como "Mod. Des + 2" e como "usa seu bônus de Atacar". A ficha não tem como calcular o acerto nem debitar a invocação.

35. **Golpe Sequencial** · Monge — Técnica Geral · media · `ambigua-para-ficha` · id `monge-golpe-sequencial`

   > Ação Livre • 5 Stamina, 1 Fluxo — Ao usar a ação atacar e acertar um ataque desarmado, pode fazer outro ataque imediatamente contra o mesmo alvo.

   Sistema > Sua Rodada: "Ações livres não têm limite por turno." (D18). O ataque extra também é um acerto desarmado, então pode disparar a técnica de novo, sem limite além da Stamina. O texto não diz se o extra leva a PMA. O contrato (pma fixa 0, escopo "1 ataque desarmado extra") arbitra uma leitura que não está no texto.

36. **Fusão Primal (Falcão)** · Monge — Ramo do Naturalista, Ultimate · media · `ambigua-para-ficha` · id `monge-fusao-primal`

   > 18m Voo, pode se mover como ação livre. ... Ao atacar um alvo Lento X, você tem +X Atacar e Dano Cortante.

   Sistema > Sua Rodada: "Mover (1 ação) — Max. 1 vez por turno" e "Ações livres não têm limite por turno." Mover como ação livre fica sem limite, ou continua 1x por turno? Na mesma forma, o ataque do Falcão é Perfurante, mas o bônus contra Lento sai em "Dano Cortante".

37. **O Terror** · Monge — Ramo do Vazio, Tier 2 · media · `ambigua-para-ficha` · id `monge-o-terror`

   > 1 Ação, 2 Stamina ... Ao acertar um ataque, pode exigir um teste de Vontade ou o alvo fica Amedrontado.

   O custo é de ação ativa, mas o efeito é um gatilho de acerto, sem duração. Não se sabe se a ação vale para o próximo ataque, para o turno ou para um modo. A Insurgência diz que "O Terror" fica "ativa permanentemente", o que sugere um estado com duração, e essa duração não está escrita. A ficha não sabe quando ligar nem quando desligar.

38. **Sussurros Constantes** · Monge — Marca do Vazio · media · `ambigua-para-ficha` · id `monge-sussurros-constantes`

   > Ao ficar com 0 de Éter, ao invés de ficar Oco, você pode aceitar um Pacto Sombrio: recupere metade do seu Éter máximo, mas o Mestre escolhe uma consequência.

   Sistema > Status: Éter "Ao reduzir a 0 ou menos fica Oco". O Éter atravessa o 0 (D93; L28: "A perda pode deixar seu Éter negativo"). O gatilho "0 de Éter" vale para ≤0? "Recupere metade" soma ao valor negativo ou fixa o Éter em metade do máximo? O texto não limita usos, e "Pacto Sombrio" não é condição (não consta de data/condicoes.json).

39. **Insurgência** · Monge — Ramo do Vazio, Ultimate · media · `ambigua-para-ficha` · id `monge-insurgencia`

   > Todos seus ataques causam +2d8 de dano Necrótico e Ignoram Armadura/Resistência. ... Você perde todo seu fluxo e metade do seu Éter atual.

   data/sistema.json > Defesa: o Ar reduz só dano ordinário; o dano atípico (Necrótico) é reduzido por Ae ("Armadura Específica (Ae) reduz dano atípico"), e a Resistência é outra camada. "Ignoram Armadura" deixa de fora a Ae? Sobre o custo, "metade do seu Éter atual" com Éter negativo (D93) não tem leitura definida.

40. **Cartucho Arcano** · Alquimista, Ramo do Artificer, Tier 1 · media · `custo-ou-recarga-fora-do-padrao` · id `alquimista-cartucho-arcano-2`

   > Custo de Criação: (Nível da Magia * 2) Reagentes [...] CD da criação: Você rola Místico ao criar Cartuchos Arcanos, o CD da criação é 10 + (2 * Nível da Magia).

   D68: todas as magias subiram 1 nível (as antigas 1–4 viraram 2–5). A varredura do balanceamento (09-decisoes-pedro.md, "Fórmulas que mudam sozinhas") marca "(Nível da Magia × 2) Reagentes" como custo que sobe sozinho, mas só lista a ficha Runa Skorn, não a técnica. Hoje cada magia antiga custa +2 Reagentes e tem +2 de CD no Cartucho sem que ninguém tenha editado o texto. Quando corrigirem o "(nível-1)" (L18), o Alquimista nível 5 passa a poder encartuchar magia de Nível 5, que exige Foco Primordial (CLAUDE.md §2 e magia.custoBase no contrato). O texto não diz se o cartucho dispensa esse requisito.

41. **Cartucho Arcano** · Alquimista, Ramo do Artificer, Tier 1 · media · `ambigua-para-ficha` · id `alquimista-cartucho-arcano-3`

   > Usar Cartucho: Qualquer criatura pode conjurar a magia infundida no cartucho, porém usa seus atributos como base dos CDs e ataques da magia respeitando, também, o custo de ações da magia.

   Sistema > Sua Rodada (PD18): "Conjurar magia (1-3 ações), no máximo 1 magia conjurada por turno." O texto não diz se usar o cartucho conta como a conjuração do turno, nem qual intensidade ele tem (a Sobrecarga, "A magia tem intensidade Forçada automaticamente", sugere que o padrão é Normal, mas isso não está escrito). Também não diz se custa Éter a quem usa.

42. **Elixir Especial** · Alquimista, Ramo do Boticário, Tier 1 · media · `ambigua-para-ficha` · id `alquimista-elixir-especial`

   > 1 Ação, 3 Stamina, 3 Reagentes Você prepara e administra um elixir especial entre você e seus aliados à distância de toque, pagando 1 reagente por alvo.

   O custo do cabeçalho (3 Reagentes fixos) contradiz o corpo (1 Reagente por alvo). A ficha não sabe o que descontar: 3 fixos, 1×alvos, ou 3 + 1×alvos. Vocabulário do contrato (regras-ficha, vocabulario.custoTipo): "fixo" e "porUnidade" são tipos distintos, e a técnica declara os dois.

43. **Enxurrada de Alquímicos** · Alquimista, Ramo do Bombardeiro, Tier 1 · media · `ambigua-para-ficha` · id `alquimista-enxurrada-de-alquimicos`

   > Você arremessa até 3 itens alquímicos ofensivos simultaneamente, cada item pode atingir um alvo diferente ou o mesmo alvo respeitando seu alcance máximo e rolando Atacar para cada arremesso.

   D29 / contrato turno.pmaNota: "-5 cumulativo por ataque no mesmo turno, contado POR ALVO [...]; so vale na acao Atacar." Três rolagens de Atacar no mesmo alvo dentro de uma técnica: não está dito se a PMA se aplica. Além disso, os itens da tabela (ex.: Fogo Alquímico, "Arremesso 9m. 2d6 Fogo em área 1,5m. Reflexo para metade") não pedem rolagem de Atacar, e PD18 diz "Se o item for arremessado, siga o que ele diz". Não fica claro se a Enxurrada acrescenta uma rolagem de acerto que o item sozinho não tem.

44. **Preciosismo** · Alquimista, Marca do Bombardeiro · media · `referencia-inexistente` · id `alquimista-preciosismo`

   > Itens alquímicos que você cria têm +2 CD nos testes de resistência.

   Nenhuma fonte define a CD de resistência dos itens alquímicos. A coluna "CD" da tabela ("CD 8-10"…) é a CD de criação (Regras de Criação: "ao suceder o CD do item escolhido você o fabrica"), e os itens só dizem "Reflexo ou Cego", sem número. A CD da classe é 10 + Mod.INT + Mod.DES, mas nada liga a CD do item a ela. Por analogia, a L08 decidiu só o "+Int" das poções ("É a inteligência de quem craftou o item"). A ficha não tem base para aplicar o +2.

45. **Apocalipse Alquímico** · Alquimista, Ramo do Bombardeiro, Ultimate · media · `ambigua-para-ficha` · id `alquimista-apocalipse-alquimico`

   > Frio: Sofrem 2d6 Frio e se falharem em Movimento ficam Lento . [...] Ácido: Sofrem 2d6 Ácido e se falharem em Fortitude ficam Cegos . [...] Todas as criaturas na área sofrem 8d6 de dano divididos entre (Escolha 2 tipos: Fogo, Frio, Elétrico, Ácido ou Veneno).

   Condições > Lento X e L10 (aceito): "−3 m de Movimento e −1 Ação para cada ponto de X". Lento exige X, e a técnica não dá o X. "Cegos" (e "Atordoados" no Elétrico) vêm sem duração, enquanto a explosão principal diz "por 1 rodada". Também não diz como os 8d6 se dividem entre os dois tipos (4d6+4d6?), e isso muda a mitigação, que é por tipo (contrato dano.ordemMitigacao).

46. **Veneno Hemorrágico (item alquímico da característica de classe)** · Alquimista, característica de classe (itensAlquimicos, Nível 3) · media · `contradiz-regra-atual` · id `alquimista-veneno-hemorragico`

   > 3 ataques. +2d6 Biológico. Alvo sangra 1d6/turno por 3 rodadas (Medicina estanca).

   D83 / Condições > Sangramento X: "qualquer ataque contra ele causa +Xd4 de dano Biológico [...] Ao acertar um ataque em um alvo com essa condição, ela reduz em 1." O item descreve um sangramento por tique (1d6/turno, 3 rodadas, Medicina estanca), que não é a condição Sangramento X. A ficha não sabe se aplica Sangramento (qual X?) ou um dano por turno à parte.

47. **Teto de Concentração abaixo dos custos das técnicas** · Artilheiro / Característica de Classe + Foco Absoluto, Tiro de Reflexo, Execução, 3 Ultimates, Paciência Inabalável · media · `custo-ou-recarga-fora-do-padrao` · id `artilheiro-teto-de-concentracao` Vale para: Concentração, Foco Absoluto, Tiro de Reflexo, Execução, 🌀 Tempestade de Aço, 🔥 Canhão, 🏹 Tiro Predador, Paciência Inabalável.

   > max: "3 + Mod. Sabedoria" | Foco Absoluto: "1 Ação • 3 Stamina, 5 Conc." | Tiro de Reflexo: "Reação • 3 Stamina, 5 Conc." | Execução: "1 Ação, 4 Stamina, 5 Conc." | Tempestade de Aço: "3 Ações, 6 Stamina, 5 Conc." | Canhão: "2 Ações, 5 Stamina, 5 Conc." | Tiro Predador: "3 Ações, 5 Stamina, 5 Conc." | Paciência Inabalável: "Para cada 5 combates onde você acumulou 6+ Concentração"

   Contrato classes.artilheiro.recursos[0], status "canonico-com-bug-conhecido": com SAB 12 o máximo é 4, e as técnicas de 5 Conc. ficam inalcançáveis; 6+ exige SAB 16. A regra da ficha é mostrar desabilitada com motivo, mas o custo em si continua fora do alcance da própria classe (régua de recurso de classe, D79, em aberto).

48. **Dança da Morte** · Artilheiro / Vendaval T2 · media · `contradiz-regra-atual` · id `artilheiro-danca-da-morte`

   > Até o inicio do seu próximo turno: Você gasta sua reação, para fazer 1 Ataque à Distância como ação livre sempre que uma criatura se mover no seu alcance. Se acertar 3 ou mais ataques durante a dança , recupera 2 Concentração adicional.

   data/sistema.json, Combate > Sua Rodada: "Você possui 3 ações e 1 reação por turno". Gastar a reação a cada ataque dá no máximo 1 ataque, mas o texto prevê 3+ acertos. Não dá para saber se a técnica libera reações extras ou se o "gasta sua reação" é só o gatilho de entrada.

49. **Projétil Envenenado** · Artilheiro / Vendaval T2 · media · `ambigua-para-ficha` · id `artilheiro-projetil-envenenado`

   > Durante um descanso curto, você pode aplicar veneno em até 5 munições (flechas, virotes, munições de fogo, ou armas de arremesso). Ao acertar com munição envenenada, o alvo deve passar em Fortitude ou recebe Envenenamento por 2 rodadas .

   data/sistema.json > Munição de Armas: "Armas à distância requerem 1 munição para serem usadas pelo combate inteiro. A munição é descontada por combate." O contrato (municao.efeitoEspecialDura) diz que o efeito da munição dura "o combate inteiro, em cada ataque" (D2, D41). Assim, cada munição envenenada envenena todo acerto de um combate inteiro, 5 combates por descanso curto. A técnica não diz "uso único" como a Munição Especial diz.

50. **Munição Especial — custo sem uso definido** · Artilheiro / Pólvora T2 · media · `ambigua-para-ficha` · id `artilheiro-municao-especial-2`

   > 1 Ação, 2 Stamina Você aprendeu a fabricar munições especiais para qualquer arma à distância . As munições são de uso único (Ao invés de uso por cena) [...] Durante um descanso curto, você pode criar 1 Munição Especial como ação de descanso curto e durante um descanso longo, você pode criar 2 munições Especiais.

   O corpo descreve só a fabricação no descanso, mas o cabeçalho cobra 1 Ação e 2 Stamina sem dizer o que essa ação faz (carregar? disparar?). O contrato (municao.nota, D41) diz que munição especial "nunca pode custar acao nem conceder ataque extra". A ficha não tem como saber quando cobrar os 2 Stamina.

51. **Rajada de Tiros** · Artilheiro / Pólvora T1 · media · `ambigua-para-ficha` · id `artilheiro-rajada-de-tiros`

   > 1 Ação, 3 Stamina Faça 2 Ataques com uma Arma de Fogo sem penalidade de multi-ataque em até 2 alvos com até 3 m entre sí.

   No Bazar, a Arma Distância Pesada (arma de fogo) é "Atacar(2)", e o Sistema diz "Atacar (Depende da arma)". Não fica claro se a 1 Ação já inclui os 2 ataques (4 ações de ataque por 1) ou se soma ao custo de cada ataque. A L13 foi respondida ("Como o balanceamento recomenda", 03-respostas-pedro.md §6: manter "1 ação:Atacar" por alvo na manobra Investida), mas isso vale para a manobra; a técnica não diz se segue a mesma leitura.

52. **Tiro Carregado — ações** · Artilheiro / Predador T1 · media · `ambigua-para-ficha` · id `artilheiro-tiro-carregado`

   > 1-3 Ações, 2 Stamina Você prepara um tiro que escala com a quantidade de ações que você utiliza: 1 Ação → +1d6 Dano Perfurante 2 Ações → +2d6 Dano Perfurante 3 Ações → +3d6 Dano Perfurante, Margem de Crítico +1

   O turno tem 3 ações (Sistema > Sua Rodada). Não está dito se as ações de preparo incluem o disparo; com 3 ações de preparo não sobra ação para Atacar no mesmo turno, e o texto não diz se o tiro preparado fica para o próximo turno.

53. **Sentidos Aguçados** · Artilheiro / Geral · media · `ambigua-para-ficha` · id `artilheiro-sentidos-agucados`

   > 1 Ação • 2 Stamina Você pode rolar Percepção com 1 treinamento a mais. Adicionalmente, não pode ser Desprevenido por criaturas que você vê.

   Técnica ativa sem duração: não diz se o treinamento extra vale para uma rolagem, para o turno ou para a cena, nem até quando dura a imunidade a Desprevenido. A ficha não consegue marcar o fim do efeito.

54. **Tiro Imobilizador** · Artilheiro / Geral · media · `ambigua-para-ficha` · id `artilheiro-tiro-imobilizador`

   > Seu próximo ataque a distância neste turno causa a condição Lento 1 caso o alvo falhe em um teste de Fortitude.

   data/condicoes.json, Lento X: não tem duração própria. O contrato (condicoes.lento.x.duracao = "daFonte") manda tirar a duração da fonte, e esta fonte não dá nenhuma. Compare com a Tempestade de Aço: "Lento 1 por 2 rodadas".

55. **Lâmina Retrátil** · Autômato (tecnologia Tier 4, Luxária) · media · `referencia-inexistente` · id `automato-lamina-retratil`

   > Arma marcial leve +1 integrada no antebraço. Pega com ação livre. Causa +1d10 de dano Cortante.

   data/sistema.json > Armas: as Marciais são Pesada/Longa/Precisa/Versátil e as Leves são Leve Cortante/Perfurante/Contundente/Ágil. Não existe 'marcial leve', então a ficha fica sem dado base, atributo, Atacar(n), efeito e requisito (Treinado em Armas Marciais? DES ≥ 12?) para montar a arma.

56. **Receptáculo Menor** · Corrompido (corrupção −2) · media · `contradiz-regra-atual` · id `corrompido-receptaculo-menor`

   > Pode conjurar magias com 1 modulação grátis da respectiva escola da magia. Usos (1+Mod. Sabedoria)/Descanso Longo.

   D82 + Sistema > Intensidade: 'toda conjuração custa no mínimo 1 Éter, mesmo após reduções de técnicas, cartas ou itens. As exceções são a magia de Nível 1 conjurada em intensidade Normal e sem modulação e as Magias Pactuadas…'. Um truque Normal com a modulação 'grátis' continua com modulação, então custa 1 e não 0, e 'grátis' leva o jogador a ler 0. O contrato (magia.ordemCusto) também não tem etapa para modulação zerada.

57. **Escola Visceral** · Corrompido (corrupção −3) · media · `ambigua-para-ficha` · id `corrompido-escola-visceral`

   > Escolha uma escola de magia: magias dessa escola custam -2 éter e modulações custam -2 de éter (mín. 1).

   Contrato magia.ordemCusto: a etapa 5 aplica só 'Escola Visceral -2' (um desconto) e a etapa 6 aplica o piso global 1 (D82). O texto dá dois descontos: −2 na magia e −2 nas modulações, talvez por modulação, com um '(mín. 1)' que dá para ler como piso de cada modulação. Exemplo, Nível 3 Normal + Ancorar(+2): pelo contrato 4+2−2 = 4; pelo texto 2 + max(1, 0) = 3.

58. **Receptáculo Natural** · Corrompido (característica) · media · `ambigua-para-ficha` · id `corrompido-receptaculo-natural`

   > Você pode conjurar duas magias de nível 1, de qualquer escola, sem um foco designado.

   Sistema > Introdução à Magia: para conjurar é preciso 'conhecimento básico do místico, sendo ao menos treinado'; CLAUDE.md §2: 'Exige Treinado em Místico + Foco da escola'. A raça dá 'Vontade ou Místico'. O texto dispensa só o foco: não diz se um Corrompido que escolheu Vontade consegue conjurar.

59. **Segredos Proibidos** · Origem Cultista · media · `ambigua-para-ficha` · id `origem-cultista`

   > Você conhece e consegue canalizar 2 magias de nível 1 de qualquer escola, porém deve canalizá-las através de um foco.

   Sistema > Introdução à Magia exige ao menos Treinado em Místico. O treinamento da origem é 'Religião ou Místico'. Não diz se o Cultista que escolheu Religião conjura. O balanceamento (09-decisoes) trata a origem como 'destrava conjuração'.

60. **Corpo Mecânico** · Autômato (característica) · media · `ambigua-para-ficha` · id `automato-corpo-mecanico-imunidade`

   > Você é imune a efeitos biológicos: Sangramento, Envenenamento, doenças.

   Sistema > Tipos de Dano: Biológico = Veneno, Ácido, Psíquico. Sangramento e Envenenamento causam 'dano Biológico', e Morrendo também ('10% da sua vida máxima de dano biológico… não pode ser reduzido por Armadura, Armadura Específica ou Resistência', D86). Fica aberto se o Autômato marca I em Veneno/Ácido/Psíquico na grade e se o tique de Morrendo o atinge: a D86 fala de mitigação, não de imunidade.

61. **Pele Morta** · Corrompido (adversidade +5) · media · `ambigua-para-ficha` · id `corrompido-pele-morta`

   > Você é vulnerável a todos os tipos de dano não místicos, mas tem Armadura Específica (Místico, 5), exceto Força e Primordial.

   Sistema > Tipos de Dano: Místico = Radiante, Trovejante, Necrótico; Força e Primordial ficam em 'Outros', não em Místico. L34: Ae(x, categoria) abrange todos os tipos da categoria. O 'exceto Força e Primordial' não tem sobre o que agir dentro de Místico, e não fica claro se a vulnerabilidade cobre Força, Primordial e o Ordinário. Causa provável: a D67 (09-decisoes-pedro.md) define Místico = Radiante, Trovejante, Necrótico, Força, Primordial, e o Sistema atual põe Força e Primordial em "Outros". As duas fontes divergem; vale o Sistema, mas a D67 precisa ser corrigida para não gerar leituras como esta.

62. **As Vozes** · Corrompido (adversidade +3) · media · `ambigua-para-ficha` · id `corrompido-as-vozes`

   > Ao rolar 1 natural em qualquer dado, perde 2d4+nível de éter.

   Sistema > Críticos e Falhas: a falha crítica é o 1 no d20. 'Qualquer dado' inclui dados de dano e de cura (d4, d6, 2d8…), onde o 1 sai quase sempre. O gatilho é d20 só ou todo dado? A ficha não consegue automatizar sem essa resposta.

63. **A Forja (Ferreiro e Artesão)** · Origens Ferreiro e Artesão · media · `ambigua-para-ficha` · id `origem-a-forja` Vale para: A Forja, A Forja.

   > A cada vez que você fabricar um item de raridade acima de ordinário que nunca havia fabricado antes, ganhe 1 nível de treinamento na perícia Ofício(Ferraria).

   Sistema > Proficiência: a escala tem 4 níveis e termina em +8 Lendário, mas o texto não tem teto e conta por item inédito (o balanceamento, em 03-origens, lê 'cada raridade inédita', no máximo 3). No Artesão, a versão com Ofício(Engenharia) cobre 'Bugigangas, Consumíveis e Munições', mas o Sistema > O Bazar diz que os consumíveis 'a maioria pode ser fabricado pelo Ofício(Alquimia)'. Não diz se a imunidade à falha crítica e o ganho de treinamento valem para o que se fabrica com Alquimia.

64. **Palavra de Fé** · Origem Acólito · media · `ambigua-para-ficha` · id `origem-acolito`

   > Se uma ou mais criaturas estiverem afetadas por alguma condição/maldição, você exige um teste de resistência para se livrar do efeito.

   Não diz a perícia (Fortitude/Vontade/Reflexos) nem a CD (a do portador, D57, ou a da fonte da condição). 'Maldição' não existe em data/condicoes.json. A Mesa não consegue rolar isso.

65. **Referência de raças do balanceamento desatualizada** · Anão, Corrompido (balanceamento 04-racas.md) · media · `outro` · id `balanceamento-ref-racas`

   > Durante um descanso longo, você pode fabricar 2 Equipamentos, ao invés de 1.

   data/racas/*.json (vindo do Notion) diverge da referência 04-racas.md da branch do balanceamento. Nela, a Krichama 'sobe arma nv1→nv2 por descanso longo'; a Caxon 'não pode ser movido…, +1 em todas as perícias' (o site diz 'fabricar 2 Bugigangas'); o Anão tem '−1 DES' (o site diz −1 Inteligência); e o Corrompido tem subdivisões 'Tocado, Alterado, Consumido' (o site usa o sistema de pontos de corrupção). As réguas e o contrato que saíram dessa referência podem estar errados.

66. **Referência de origens do balanceamento desatualizada** · Origens (balanceamento 03-origens.md) · media · `outro` · id `balanceamento-ref-origens`

   > Você saqueia 5 Sins a cada criatura morta por você como ação livre.

   data/origens.json diverge da referência 03-origens.md. Nela, o Criminoso tem 'crítico aplica Sangramento 1'; o Refugiado, '1×/descanso longo, 3 Stamina → Reflexos +1 treinamento' (o site diz: ignora o dano ao passar no teste de resistência); o Marinheiro, '+2 em embarcações' (o site: 50% de desconto em passagens); o Nobre, '+1 nível de treinamento' (o site: comerciantes cobram 5% a mais, um debuff); o Ferreiro, '−1 ingrediente, Pedra de Amolar'; o Caçador, '1d4 Comida + 1d4 Couro' (o site: faixas 10+ a 30+). A frase 'Único modificador econômico do sistema: Mercador' também caiu (o Nobre e A Criatura também mexem em preço).

## Para o site

Conserto do agente de HTML (ficha v2.1 e marcação das páginas). Só gravidade alta e média; as de gravidade baixa
(5) estão no JSON.

### Gravidade alta (1)

1. **Ficha v2.1 leva a técnica sem a mecânica** · js/ficha.js decorar() · classes e raças · alta · `outro` · id `ficha-v21-descricao`

   > `var descNode = q1(card, '.spell-desc,.dor-card-desc,.catalog-card-effect,.habilidade-box,p:not(.meta):not(.flavor):not(.quote)');`

   A descrição que a v2.1 grava é o primeiro `<p>` do card (fora .meta/.flavor/.quote). Nos cards em que a mecânica está em `<ul>` ou div.effect, ela não chega à ficha. Conferido pelo log (levavel.descricaoV21, emulação do mesmo seletor sobre as páginas geradas): 169 dos 274 cards de classe e 36 dos 48 cards de raça chegam com descrição vazia ou só com a ambientação. Exemplo: Muralha Viva, o caso citado pelo Pedro, tem o corpo inteiro em `<ul>` e vai para a ficha com descrição vazia; as tecnologias do Autômato levam só o p.desc ("Você consegue ver em um mapa de calor naturalmente.") e perdem o efeito ("Treinado em Percepção e pode ver no escuro parcialmente."). As habilidades de origem (.habilidade-box) e as linhas da Corrupção passam inteiras.

### Gravidade média (3)

1. **Marca do Duelo / Proficiência com Espadas (características sem data-kf)** · Espadachim · Característica de classe · media · `outro` · id `espadachim-marca-do-duelo` Vale para: Marca do Duelo, Proficiência com Espadas.

   > Contra o alvo marcado você tem +1 Atacar e +1 Defender. No nível 3, +2 Atacar e +2 Defender. No nível 5, +3 Atacar e +3 Defender.

   pages/classes/espadachim.html: os 2 blocos .proficiency-box (h3 #proficiencia-com-espadas e #marca-do-duelo) não têm data-kf-*. São 39 data-kf-id na página, só técnicas, marcas e ultimates. js/ficha.js não menciona Marca do Duelo. O contrato classes.espadachim.estados marca a Marca do Duelo como "rastrear": "essencial" e escala +1/+2/+3, e 17 cards da classe (técnicas, marcas e ultimates) a citam. Hoje a característica não entra na ficha.

2. **Corrupções sem data-kf-id** · Corrompido (30 linhas de corrupção e adversidade) · media · `outro` · id `corrompido-corrupcoes-sem-kf`

   > +5 Éter Máximo. +5 Stamina Máxima.

   Em pages/racas/corrompido.html, as linhas de .corr-table não têm data-kf-tipo nem data-kf-id, embora data/racas/corrompido.json tenha id em cada uma (corrompido-sangue-morto…). Só a v2.1 as pega, por decorarCorrupcao, com id vindo do slug do nome. No protocolo novo, as 30 corrupções não viram entidade.

3. **Ficha sem camada de Vulnerabilidade** · Autômato (Corpo Mecânico) e Corrompido (Pele Morta) · media · `outro` · id `ficha-sem-vulnerabilidade` Vale para: Corpo Mecânico, Pele Morta.

   > É vulnerável (2x dano) a dano elemental.

   Sistema > Dano e Defesa: 'Vulnerabilidade a um dano específico sempre o dobra'. O contrato (ordemMitigacao etapa 2) diz 'Vulnerabilidade *2 / Resistencia /2', mas data/ficha.schema.json só tem R, I e ae por tipo, e js/ficha.js não menciona vulnerabilidade. As duas técnicas não cabem na grade de 12 tipos.

## Descartados e fundidos

Dos 170 achados que os 8 leitores trouxeram, 160 ficaram. Os 9 sobre a notação
"1x/Dia" das ultimates (um por classe, mais as 3 ultimates do Espadachim) viraram o achado `notacao-1x-dia`. Descartados:

- **Runas de Proteção** (`alquimista-runas-de-protecao`): Premissa errada. O achado usa a D67 (categoria Místico = Radiante, Trovejante, Necrótico, Força, Primordial), mas o data/sistema.json (sincronizado com o Notion hoje) põe Força e Primordial em "Outros" e deixa Místico com Radiante, Trovejante e Necrótico. Pela L34, "dano Místico" vira um desses 3 à escolha do jogador; não há como cair em Força ou Primordial. A divergência D67 × Sistema ficou registrada no achado de Pele Morta.
- **custoTexto com separadores inconsistentes** (`classe-artilheiro`): Não é defeito de regra nem de ficha. O formato misto ("•" nas gerais, "," nos ramos) aparece nas 7 classes, não só no Artilheiro, e o parser do próprio log (checa_custo em tools/log_tecnicas.py) já separa ação e recurso nos dois formatos.

Corrigidos na conferência (o achado ficou, com a regra ajustada):

- *Manifestação do Patrono* e *Receptáculo Perfeito*: "Envenenados" e "Exausto 1" casam com Envenenamento e Exaustão pelos
  aliases do contrato (`condicoesAliases`); só o resto do achado ficou.
- *Rajada de Tiros*: a L13 já foi respondida ("Como o balanceamento recomenda"), e a resposta vale para a manobra Investida,
  não para a técnica.
- *Achar Tecnologias em Lojas*: o Tier 1 do Autômato tem 6 tecnologias não compráveis, não 3.
- *Sorte do Bêbado*: baixou para gravidade baixa, porque o contrato já limita o crítico ao d20.
- *Frenesi*: a regra citada deixou de estar entre aspas; `ramosRegra.porTier` diz só `"nivel": 2`.
- *Itens iniciais das origens*: "1 Comida" sem item do Bazar está em 18 das 19 origens, não nas 19.
- *Ficha v2.1 perde a mecânica*: o leitor viu nos cards de raça (36 de 48); a checagem mecânica mostrou que vale também para
  169 dos 274 cards de classe, e virou a checagem `levavel.descricaoV21`.

## Como foi conferido

1. Cada trecho foi procurado, por programa, no texto normalizado de `data/classes`, `data/racas`, `data/origens.json` e
   `pages/` (tags tiradas, espaço colapsado). Os que não casaram de primeira eram diferença de espaço em volta de tag ou
   trecho composto de campos (custo + corpo); foram lidos um a um.
2. Cada regra citada foi conferida na fonte: `data/sistema.json`, `data/condicoes.json` (30 condições), `data/magias.json`,
   o contrato `data/balanceamento/ficha-digital-regras.json` (regras-ficha/1.1), `03-respostas-pedro.md` e o
   `09-decisoes-pedro.md` da branch do balanceamento. Onde duas fontes divergem, vale a ordem: resposta do Pedro, D80–D97,
   dados sincronizados com o Notion, contrato.
3. Duplicatas foram juntadas por técnica e tema; cada achado aponta as técnicas do log (`tecnicas`), e o script recusa id que
   não exista no inventário.

Para regenerar: `python tools/log_tecnicas.py` (com `--resumo` imprime os totais). Sem o arquivo de achados o log sai sem
eles, e a checagem mecânica continua igual.
