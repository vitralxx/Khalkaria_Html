---
tipo: classe
status: canon-pedro
spoiler: publico
era: atemporal
aliases: [Artilheiro, Atirador]
fonte_notion: [d896e3a401d983f38cc78196ad7491b4, 3a66e3a401d9809b8eceec1f30be9fd2, pedro-2026-09-05]
ultima_sync: 2026-09-05
tags: [khalkaria/sistema, khalkaria/sistema/classes]
---

# Artilheiro

**Resumo.** Classe de combate à distância, dano pesado e controle de terreno (🏹, Notion 🟢 Pronto, ed. 2026-08-05). Recurso de classe = **Concentração** (máx. `3 + Mod. Sabedoria`), ganha ao mirar, acertar e ficar parado, e perdida ao receber dano, se mover, falhar em resistência ou ver um aliado cair. **A Concentração soma direto na rolagem de ataque** — é o único recurso do sistema que funciona como bônus de acerto contínuo. Empata com o [[Batedor]] na maior progressão de Stamina (`+7/nível`). Perfil do índice: Combate ★★★★☆ · Controle ★★☆☆☆ · Exploração ★★☆☆☆ · Místico ★☆☆☆☆ · Tecnologia ★★★☆☆.

## Cânone (Notion)

### Prosa de abertura
> Enquanto outros guerreiros precisam sentir o hálito do inimigo para derrotá-lo, você aprendeu que a verdadeira maestria está na distância. Seja com a precisão silenciosa de uma flecha, o trovão de pólvora negra, ou o brilho fugaz de uma lâmina arremessada — seu alvo cai antes de perceber que estava em perigo.
> Artilheiros não são covardes que fogem do combate. São predadores pacientes que escolhem o momento perfeito para atacar. Cada tiro é calculado, cada posição é estratégica, cada munição é preciosa. Você não desperdiça nenhum disparo.

### Progressão
| Level | Conteúdo |
|---|---|
| 1 | 4 Técnicas |
| 2 | 5 Técnicas, Técnica de Ramo(Tier 1) |
| 3 | 6 Técnicas, 1 Marca |
| 4 | 7 Técnicas, Técnica de Ramo(Tier 1, 2), 2 Marcas |
| 5 | 8 Técnicas, Técnica de Ramo(Tier 1, 2 e 3), 3 Marcas |

### Status iniciais
- **Saúde:** `10 + (4 × Nível) + (Mod.CON × Nível)`
- **Stamina:** `8 + (7 × Nível) + ([Mod.FOR OU Mod.DES] × Nível)`
- **Éter:** `6 + (4 × Nível) + ([Mod.INT OU Mod.SAB] × Nível)`
- **Evasão Ativa (Reação):** 10 + Mod. Destreza + Treinamento em *Defender*
- **Evasão Passiva (Sem reação):** 10 + Mod. Destreza

### Treinamento
Você começa treinado em: **Armas à Distância, Atacar, Percepção**
Além disso, você pode escolher **(1 + Mod. Inteligência)** Perícias para ser treinado dentre as seguintes: Furtividade, Iniciativa, Ofício(Engenharia), Investigação, Movimento

- **Atributos Recomendados:** Destreza, Sabedoria e (Inteligência ou Constituição)
- **Play Style:** Combate a Distância, Dano pesado e Controle de Terreno.
- **CD do Artilheiro:** 10 + Mod. Destreza + Mod. Sabedoria

### Concentração (recurso de classe)
> Seus disparos ficam precisos à medida que você consegue se concentrar nos pontos fracos dos seus inimigos. Por ser um atirador, algumas atitudes aumentam sua concentração, enquanto outras diminuem.

**Concentração máxima: `3 + Mod. Sabedoria`**

Você começa todo combate com 0 de concentração e **ganha** concentração com as seguintes ações:
- **Atacar:** Ao acertar um ataque → **+1 Concentração**; Crítico → **+2**
- **Mirar:** Gaste 1 ação, mirando no seu alvo → **+2 Concentração**
- **Ficar Parado:** Não se mover no turno → **+1 Concentração**

Você gasta concentração para utilizar técnicas, porém pode **perder** de outras formas:
- **Ser atacado:** Ao receber dano → **−1 Concentração**
- **Se mover:** Utilizar 1 ação para se movimentar → **−1 Concentração**
- **Condição:** Ao falhar em um teste de resistência → **−2 Concentração**
- **Morte:** Ao ver um aliado cair *Morrendo* → **−3 Concentração**

> Ao estar concentrado, seu acerto aumenta proporcionalmente. **Sempre adicione sua concentração à sua rolagem de ataque.**
> Algumas técnicas e habilidades podem exigir concentração; ao utilizá-las, diminua sua concentração conforme o requisitado.

### Técnicas gerais
> Você possui **3 Técnicas + Nível**, reatribuíveis em descanso longo.

| Técnica | Descrição | Custo | Ação |
|---|---|---|---|
| Respiração Controlada | Você não perde Concentração ao receber dano à distância (apenas corpo a corpo). | — | Passiva |
| Frieza | Enquanto tiver 3+ concentração, você tem vantagem em testes de resistência. | — | Passiva |
| Balas de Ferro | Seus ataques críticos reduzem 3 de Armadura(Ar) ou Armadura Específica(Ae) do alvo no acerto. Você só pode remover Armadura do tipo de dano que sua arma causa. | — | Passiva |
| Artesão de Munição | Durante descanso curto ou longo, você pode criar 1 munição (Flecha, Munição de Armas de Fogo ou Adagas de lançamento) sem rolar testes. | — | Passiva |
| Olho do Atirador | Você pode atirar em criaturas que você não enxerga com -2 (ao invés de desvantagem). | — | Passiva |
| Sentidos Aguçados | Você pode rolar Percepção com 1 treinamento a mais. Adicionalmente, não pode ser *Desprevenido* por criaturas que você vê. | 2 Stamina | 1 Ação |
| Batida Tática | Você pode se mover neste turno sem perder concentração e sem provocar ataques de oportunidade. | 2 Stamina | 1 Ação |
| Tiro Camuflado | Deve estar escondido para ativar. Seu próximo ataque é crítico ao acertar. | 3 Stamina | 1 Ação |
| Tiro Imobilizador | Seu próximo ataque à distância neste turno causa a condição *Lento 1* caso o alvo falhe em um teste de Fortitude. | 2 Stamina, 1 Concentração | 1 Ação |
| Tiro Duplo | Seu próximo ataque não tem penalidade de multi-ataque. | 3 Stamina, 2 Concentração | 1 Ação |
| Tiro Preciso | Seu próximo ataque à distância neste turno tem +2 Atacar e causa +1d6 de dano. | 2 Stamina, 2 Concentração | 1 Ação |
| Foco Absoluto | Seu próximo ataque tem Vantagem e Margem de Ameaça +1. | 3 Stamina, 5 Concentração | 1 Ação |
| Tiro na Cabeça | Seu próximo ataque causa +1d6 de dano por ponto de Concentração gasto. | 3 Stamina, x Concentração | 2 Ações |
| Ponto Vital | Ao acertar um ataque crítico, adiciona +2d6 de Dano. | 3 Stamina, 3 Concentração | Reação |
| Tiro de Reflexo | Quando um inimigo se mover dentro do seu alcance, você pode atacar ele como uma reação. | 3 Stamina, 5 Concentração | Reação |

### Ramos
> Ao longo da criação do seu personagem você escolherá: 3 Marcas; **6 Técnicas de Ramo, 3 no Tier [1], 2 no Tier 2 e 1 no Tier 3**.

- **Ramo do Vendaval** (azul — Adagas de Arremesso e Agilidade) — *Uma lâmina é lenta. Duas são rápidas. Dez são uma tempestade. Você não arremessa facas — você desencadeia um vendaval de aço que corta, perfura e silencia antes que o grito escape. Outros atiradores precisam mirar. Você já está arremessando a terceira faca enquanto a primeira ainda voa.*
- **Ramo da Pólvora** (vermelho — Armas de fogo e Dano) — *O primeiro disparo que você ouviu mudou tudo. O poder absoluto de transformar vida em silêncio com um aperto de dedo. Alguns temem o barulho — você aprendeu a amá-lo. É o último aviso que seus inimigos recebem, e a maioria não vive para ouvir o segundo.*
- **Ramo do Predador** (verde — Flechas e Furtividade) — *Você aprendeu que a caça não é sobre força — é sobre espera. Nas florestas silenciosas, nas montanhas geladas, nos pântanos esquecidos, você observou e aprendeu a ter paciência. A presa nunca sabe que está sendo caçada até que a flecha já tenha deixado o arco.*

### Marcas de Ramo
**Marcas do Vendaval**
- **Inquieto** — *"Você sempre está andando, correndo, fugindo. Isso te deixa inquieto."* Você não consegue ficar parado. Seus dedos sempre se movem, seus olhos sempre varrem o ambiente, seus pés sempre prontos para o próximo passo. Outros te acham nervoso, ansioso. Você sabe que está apenas preparado.
  - Para cada combate que você é o primeiro a jogar (maior iniciativa), ganha +1 permanente em Iniciativa. Ao chegar em +5, essa habilidade fica supérflua.
  - Ao rolar Iniciativa, se você tirar o maior valor do combate, você ganha +2 Concentração no início do primeiro turno.
- **Colecionador de Lâminas** — *"Cada faca tem uma história. Cada história tem um corpo."* Você coleciona armas de arremesso obsessivamente. Cada lâmina tem um nome, uma origem, um propósito.
  - Suas lâminas são naturalmente resistentes; você pode gastar 5 minutos após um combate recuperando 1 **Conjunto de Arremesso**.
  - Você pode batizar uma **Arma de Arremesso** em um descanso longo. Você ganha +1 ao atacar com ela.

**Marcas da Pólvora**
- **Vício de Poder** — *"O cheiro de pólvora queimada. O zumbido nos ouvidos. O silêncio depois. Nada se compara."* Você se acomodou com a presença de sua arma; ela te engrandece e te faz sentir poderoso.
  - Para cada 5 criaturas que você matou com armas à distância, ganha +1 permanente em Atacar. Ao chegar em +5, essa habilidade fica supérflua.
  - Se acertar um crítico com uma arma à distância você recupera 1 de Stamina.
  - Ao passar **24 horas** sem disparar uma arma à distância, você fica *irritado*: −1 em testes sociais até disparar novamente.
- **Conhecedor de Armas de Fogo** — *"Armas de fogo acabaram de emergir como tecnologia de ponta. Você está por dentro."* Você conhece armas de fogo e o poder de destruição que elas são capazes de causar.
  - Você tem +2 em testes de Vontade.
  - Você conhece contatos que vendem armas de fogo e munições especiais em cada lugar do mundo.

**Marcas do Predador**
- **Paciência Inabalável** — *"Você esperou dias por um único tiro. Esperaria semanas se necessário."* O tempo não te afeta como afeta os outros. Você pode ficar imóvel por horas, respirando lentamente, observando.
  - Para cada **5 combates** onde você acumulou 6+ **Concentração**, ganha +1 permanente em *Percepção*. Ao chegar em +5, essa habilidade fica supérflua.
  - Ao ficar imóvel por 1 turno inteiro, você ganha Vantagem no próximo ataque à distância.
  - Você tem +2 em testes de Sobrevivência.
- **Marca no Alvo** — *"Você não esquece um rosto. Especialmente os que você ainda não acertou."* Cada alvo que escapa vive na sua mente. Você estuda seus movimentos, imagina o tiro perfeito, planeja o reencontro. Isso te torna um caçador implacável — e um pouco obcecado.
  - Ao **errar** um ataque contra uma criatura, você pode "marcá-la mentalmente". Você tem **+1 Atacar cumulativo** contra ela (máx +3) até acertá-la ou ela morrer.
  - Se uma criatura marcada **fugir** do combate, você sabe a **direção geral** que ela foi (até 1 km).
  - Você tem **+2 em Investigação** para encontrar informações sobre criaturas que você marcou.

### Técnicas de Ramo — Tier 1 (nível 2)
**Vendaval**
- **Mãos Velozes** (Passiva) — Você se torna **Treinado** em *Atacar*. Se já for **Treinado**, se torna **Experiente** e assim por diante. Ao usar **Armas de Arremesso**: Você pode sacar esse tipo de arma como ação livre. A penalidade de multi-ataque reduz para -2 em -2 (ao invés de -5). Ao acertar 2+ ataques no mesmo turno e no mesmo alvo, você causa +1d6 de dano Perfurante. Você pode fabricar **Conjuntos de Arremesso** em descansos curtos e longos: *Descanso Curto:* como a ação do seu descanso curto, você pode fabricar 1 Conjunto de Arremesso. *Descanso Longo:* você pode fabricar 2 Conjuntos de Arremesso.
- **Passo do Vento** (Passiva) — Ao utilizar 1 ação para se movimentar, você não perde mais **Concentração**. Ao **acertar um ataque**, você pode se mover 1,5 m como **ação livre**. Você adiciona sua **Concentração** à sua **Evasão**.
- **Vendaval de Aço** (2 Ações, 5 Stamina) — Faça 3 Ataques com Armas de Arremesso sem penalidade de multi-ataque. Se 2 ou mais ataques acertarem o mesmo alvo, ele ganha *Sangramento 1*.

**Pólvora**
- **Mão de Ferro** (Passiva) — Você se torna **Treinado** em Atacar. Se já for **Treinado**, se torna **Experiente** e assim por diante. Ao usar **Armas de Fogo**: Seus ataques causam +2 de dano Perfurante. Seus ataques ignoram 2 de Armadura(Ar). Você pode fabricar **munições de fogo** em descansos curtos e longos: *Descanso Curto:* 1 Munição de Fogo. *Descanso Longo:* 2 Munições de Fogo.
- **Presença da Pólvora** (Passiva) — Você se torna **Treinado** em *Intimidação*. Se já for treinado se torna **Experiente** e assim por diante. Ao acertar um ataque com arma de fogo, criaturas em até 3 m do alvo (exceto o alvo) devem passar em um teste de Vontade ou ficam *Amedrontadas* de você por 1 rodada. Ao suceder, a criatura fica imune a esse efeito. Com 5 ou mais **Concentração** o efeito também afeta o alvo.
- **Rajada de Tiros** (1 Ação, 3 Stamina) — Faça 2 Ataques com uma Arma de Fogo sem penalidade de multi-ataque em até 2 alvos com até 3 m entre si. Se 2 ataques acertarem o mesmo alvo, ele deve passar em *Fortitude* ou fica *Atordoado* até o fim do próximo turno dele.

**Predador**
- **Olho do Arqueiro** (Passiva) — Você se torna **Treinado** em *Atacar*. Se já for treinado se torna **Experiente** e assim por diante. Ao usar **Arcos** ou **Bestas**: O alcance da arma aumenta em +6 m. Ao mirar, seu próximo ataque com arcos ou bestas ganha +2 atacar. Você pode fabricar **flechas e virotes** em descansos curtos e longos: *Descanso Curto:* 1 munição de Flecha ou Virote. *Descanso Longo:* 2 munições de Flecha ou Virote.
- **Flechas do Predador** (Passiva) — Ao atacar com **arco ou besta**, você pode escolher o tipo de **Flecha** ou **Virote**. Cada tipo tem um efeito adicional ao acertar: **Perfurante** → Ignora 3 de Armadura(Ar) adicional. **Farpada** → Alvo recebe *Sangramento 1*. **Explosão** → Alvo é empurrado 1,5 m. **Incendiária** → Alvo recebe 1d4 de dano de **Fogo** adicional.
- **Tiro Carregado** (1-3 Ações, 2 Stamina) — Você prepara um tiro que escala com a quantidade de ações que você utiliza: **1 Ação** → +1d6 Dano Perfurante; **2 Ações** → +2d6 Dano Perfurante; **3 Ações** → +3d6 Dano Perfurante, Margem de Crítico +1. Você ganha +1 Concentração por ação gasta.

### Técnicas de Ramo — Tier 2 (nível 4)
**Vendaval**
- **Projétil Envenenado** (Passiva) — Durante um descanso curto, você pode aplicar **veneno** em até **5 munições** (flechas, virotes, munições de fogo ou armas de arremesso). Ao acertar com munição envenenada, o alvo deve passar em **Fortitude** ou fica *Envenenado* por **2 rodadas**. Com **5+ Concentração**, o alvo tem **Desvantagem** no teste.
- **Dança da Morte** (1 Ação, 4 Stamina, 3 Concentração) — Até o início do seu próximo turno: Você gasta sua reação para fazer 1 Ataque à Distância como ação livre sempre que uma criatura se mover no seu alcance. Se acertar 3 ou mais **ataques** durante a **dança**, recupera 2 **Concentração** adicional.

**Pólvora**
- **Munição Especial** (1 Ação, 2 Stamina) — Você aprendeu a fabricar munições especiais para **qualquer arma à distância**. As munições são de uso único (ao invés de uso por cena): **Explosiva** → Criaturas em 1,5 m do alvo sofrem o dano original da flecha. **Perfurante** → Ignora toda a armadura do alvo. **Atordoante** → Alvo faz Fortitude ou fica *Atordoado* por 1 rodada (não causa dano). **Incendiária** → Alvo fica *Em Chamas*. Durante um descanso curto, você pode criar 1 Munição Especial como ação de descanso curto e durante um descanso longo, 2 munições especiais. **3 munições especiais contam como 1 bugiganga.**
- **Execução** (1 Ação, 4 Stamina, 5 Concentração) — Seu próximo ataque à distância: Recebe +4 Atacar. **[O alvo] recebe 2d6 de dano perfurante se estiver com menos de 50% de Saúde** (correção do Pedro, B9 — o Notion escreve "Você recebe"). Adicionalmente, o ataque é crítico se o alvo estiver com menos de 25% de Saúde. Se esse ataque matar o alvo, você ganha +3 Concentração.

**Predador**
- **Olhar Revelador** (Passiva) — Ao acertar a mesma criatura duas vezes você revela: Saúde aproximada da criatura; Resistências e Vulnerabilidades; Evasão. Ataques contra alvos revelados causam +1d6 de dano Perfurante.
- **Dois Cordeiros** (2 Ações, 4 Stamina, 4 Concentração) — Você dispara com uma arma à distância em uma linha reta de até 12 m. O ataque atinge todas as criaturas na linha; faça um teste de atacar contra cada alvo separadamente. A cada alvo atingido, o próximo toma dano reduzido em -2.

### Técnicas de Ramo — Tier 3 · Ultimates (nível 5)
> O Tier 3 provê Ultimates, que só podem ser utilizadas 1 vez por dia.

**Vendaval** — *"Vendaval de lâminas."*
- **Tempestade de Aço** (3 Ações, 6 Stamina, 5 Concentração, Ultimate)
  - **Ativação:** Você desencadeia uma rajada implacável de projéteis em um raio de 6 m em até 12 m de distância. Faça **1 ataque à distância** contra cada criatura na área. Criaturas atingidas devem passar em *Fortitude* ou ficam *Sangrando 2* e *Lento 1* por 2 rodadas. Para cada **2 criaturas atingidas**, você pode fazer **1 ataque adicional** contra qualquer alvo na área.
  - **O Custo:** Você gasta toda sua **Concentração**. Você gasta 1 munição da arma utilizada. Você perde 1d6 de Éter.

**Pólvora** — *"Quando tudo falha, puxe o gatilho mais forte."*
- **Canhão** (2 Ações, 5 Stamina, 5 Concentração, Ultimate)
  - **Ativação:** Você carrega seu disparo mais devastador, que você armazenava, canalizando tudo que resta em um único momento de aniquilação: Faça um ataque à distância com **+6 Atacar**. O ataque causa dano base da arma + 5d6 + sua Concentração atual (após gastar com a ultimate) em d6s adicionais de dano Perfurante. O alvo e todas as criaturas em até **3 m dele** devem passar em Fortitude ou ficam *Atordoados* e *Surdos* por 1 rodada. Se o alvo for morto por este ataque, criaturas em até 9 m que presenciaram devem passar em *Vontade* ou ficam *Amedrontadas* de você até passar no teste no início de cada rodada. Independente de acerto ou erro, o barulho pode ser ouvido a até **1 km** de distância.
  - **O Custo:** Você perde toda sua concentração. Sua arma fica inutilizável até o próximo descanso longo. Você perde 1d6 de Éter.

**Predador** — *"Você pode fugir, mas não pode se esconder."*
- **Tiro Predador** (3 Ações, 5 Stamina, 5 Concentração, Ultimate)
  - **Ativação:** Você canaliza toda sua concentração, paciência e habilidade em um único disparo que transcende a precisão mortal. O ataque tem alcance ilimitado, desde que você saiba onde está o alvo. O ataque ignora qualquer cobertura, Armadura(Ar), Armadura Específica(Ae) e Resistência. O ataque é automaticamente crítico se acertar. O alvo deve passar em um teste de *Fortitude*, ou sofre um dos seguintes efeitos à sua escolha: **Execução:** Se o alvo estiver com menos de 30% da vida, ele instantaneamente morre. **Incapacitar:** O alvo fica *Paralisado* por 2 rodadas. **Marcar:** O alvo fica permanentemente *Marcado*; você sempre sabe sua localização e tem +4 Atacar contra ele até morrer.
  - **O Custo:** Você perde toda sua concentração. Você fica *Exausto 1*. Você perde 1d6 de Éter.

## Segundo o Pedro (2026-09-05)
- **B9 (as duas respostas que definem a classe):** *"Intencional, execução é o inimigo."*
  1. **Concentração máxima `3 + Mod. SAB` é intencional**, mesmo com técnicas de custo 5 (Foco Absoluto, Tiro de Reflexo, Execução, as 3 ultimates) e a Marca *Paciência Inabalável* pedindo "6+ Concentração". Na prática isso **exige Sabedoria alta** para destravar o topo da classe — é o custo de entrada do Artilheiro, não um bug.
  2. **Execução:** quem recebe os 2d6 de dano perfurante é **o alvo**, não o atirador. A redação do Notion ("Você recebe 2d6") está errada e deve ser corrigida.
- **B2 (munição):** *"Munições são gastas por combate, 1 unidade por combate inteiro, daí você pode seguir atirando até o fim do combate. Sem munição você não pode usar armas à distância durante todo o combate."* → regra central para o Artilheiro; o "gasta 1 munição" de Tempestade de Aço é uma munição do combate inteiro.
- **B11:** ramos = **3 Tier 1 · 2 Tier 2 · 1 ultimate Tier 3**, nos níveis 2/4/5.
- **B12:** *Marcado* (Marca no Alvo, Tiro Predador), *irritado* (Vício de Poder) e *Escondido* (Tiro Camuflado) — condições criadas para uso unitário; revisão adiada.
- **B1:** *Perfurante* é subtipo de **Ordinário**; *Fogo* é **Elemental**.
- **B16:** "Reflexo" → [[Atributos e Perícias|Reflexos]]; "Intimidar" → [[Atributos e Perícias|Intimidação]].

## Relações
- **Pertence a** → [[Sistema]]
- **Recurso de classe** → Concentração (máx. `3 + Mod.SAB`; soma direto na rolagem de ataque)
- **Recursos gerais** → Saúde · Stamina (+7/nível, empatado com o [[Batedor]]) · [[Éter]] (todas as 3 ultimates cobram 1d6 de Éter)
- **Ramos** → Vendaval (adagas de arremesso/agilidade) · Pólvora (armas de fogo/dano) · Predador (flechas/furtividade)
- **Perícias iniciais** → Armas à Distância, [[Atributos e Perícias|Atacar]], [[Atributos e Perícias|Percepção]]; escolhe entre [[Atributos e Perícias|Furtividade]], [[Atributos e Perícias|Iniciativa]], Ofício(Engenharia), [[Atributos e Perícias|Investigação]], [[Atributos e Perícias|Movimento]]
- **Regra de munição** → 1 unidade por combate inteiro (B2); munições ocupam bugigangas — ver [[Inventário e Peso]] e [[Armas e Munição]]
- **Itens de classe** → Conjunto de Arremesso · Munição de Fogo · Munição Especial · Flechas/Virotes (Perfurante, Farpada, Explosão, Incendiária)
- **Tecnologia no mundo** → *"Armas de fogo acabaram de emergir como tecnologia de ponta"* — liga a classe à engenharia dos anões **Caxon** ([[Anão]], A11) e ao [[Império de Ferro]]
- **Condições que usa** → [[Condições|Lento]], [[Condições|Atordoado]], [[Condições|Amedrontado]], [[Condições|Surdo]], [[Condições|Sangramento]], [[Condições|Envenenamento]], [[Condições|Em Chamas]], [[Condições|Paralisado]], [[Condições|Desprevenido]], [[Condições|Exaustão]], [[Condições|Morrendo]]
- **Colisões de nome** → *Passo do Vento* (também no [[Monge]], efeito diferente) · *Ponto Vital* (também opção de *O Experiente*, [[Brutalista]])
- **PJ que a usa** → nenhum dos 5 da [[Equipe desfloreio]]

## Conflitos e pendências
1. **Concentração máx. `3 + Mod.SAB` × custos de 5 e Marca "6+"** — **resolvido por B9: intencional.** Consequência de design a registrar: com SAB 8–13 (mod −1 a +1) o teto é 2–4 e **nenhuma** das técnicas de custo 5 nem as ultimates são utilizáveis; a classe só destrava com SAB 14+. (Digest B §4)
2. **Execução — "Você recebe 2d6"** — **resolvido por B9: é o alvo.** Falta corrigir a frase no Notion. (Digest B §5)
3. **Munição especial "3 = 1 bugiganga"** × regra geral de inventário. B2 redefine a munição como **1 unidade por combate**, o que torna a contagem por bugiganga secundária, mas o número "3 por bugiganga" continua sem par na regra geral. **Pendência aberta.** (Digest B §23)
4. **Grafias legadas** — *"Sangrando 2"* → **Sangramento 2** (Tempestade de Aço); *"Exausto 1"* → **Exaustão 1** (Tiro Predador); *"Vicio"* → **Vício** (Marca da Pólvora). (lista C / D1)
5. **Condições sem definição canônica** — *Marcado*, *irritado*, *Escondido*. B12 adia a revisão.
6. **Evasão com bônus condicional** — *Passo do Vento* soma a Concentração à Evasão; como no [[Monge]] (Evasivo), a ficha interativa precisa tratar isso como bônus variável. (Digest B, pergunta 11)
7. **"3 no Tier"** — falta o "1" na frase de Ramos; corrigir (B11).
8. **Marcas com "+1 permanente"** até +5 × escala canônica de perícia +2/+4/+6/+8; *Colecionador de Lâminas*, *Conhecedor de Armas de Fogo* e *Marca no Alvo* não têm contador permanente. (Digest B §21)
9. **Tiro Camuflado** exige "estar escondido", mas *Escondido* não é condição e o Sistema define esconder-se como teste de Furtividade com 3 ações — mesma ambiguidade do *Ocultar-se* do [[Batedor]]. **Pendência aberta.**

## Fonte
- Notion: Artilheiro `d896e3a401d983f38cc78196ad7491b4` (ed. 2026-08-05, 🟢 Pronto) · Classes `3a66e3a401d9809b8eceec1f30be9fd2`
- Raw: `docs/memoria/notion_raw/classe_artilheiro.md`, `classe_index.md`
- Digest: `docs/memoria/digests/B_classes.md` §7, INCONSISTÊNCIAS 1, 4, 5, 18, 21, 23 · Respostas: A11, B1, B2, B9, B11, B12, B16
