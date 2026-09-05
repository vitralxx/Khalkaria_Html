# 🏹 Artilheiro (d896e3a401d983f38cc78196ad7491b4) — last_edited 2026-08-05
Parent: Classes (3a66e3a401d9809b8eceec1f30be9fd2) / Sistema Khalkaria
**Status:** 🟢 Pronto
[imagem: x9JkCIiYDVyc7mSf.png]

Enquanto outros guerreiros precisam sentir o hálito do inimigo para derrotá-lo, você aprendeu que a verdadeira maestria está na distância. Seja com a precisão silenciosa de uma flecha, o trovão de pólvora negra, ou o brilho fugaz de uma lâmina arremessada — seu alvo cai antes de perceber que estava em perigo.
Artilheiros não são covardes que fogem do combate. São predadores pacientes que escolhem o momento perfeito para atacar. Cada tiro é calculado, cada posição é estratégica, cada munição é preciosa. Você não desperdiça nenhum disparo.

# Progressão:
| Level | Conteúdo |
|---|---|
| 1 | 4 Técnicas |
| 2 | 5 Técnicas, Técnica de Ramo(Tier 1) |
| 3 | 6 Técnicas, 1 Marca |
| 4 | 7 Técnicas, Técnica de Ramo(Tier 1, 2), 2 Marcas |
| 5 | 8 Técnicas, Técnica de Ramo(Tier 1, 2 e 3), 3 Marcas |

# Status iniciais:
- Saúde: `10 + (4 × Nível) + (Mod.CON × Nível)`
- Stamina: `8 + (7 × Nível) + ([Mod.FOR OU Mod.DES] × Nível)`
- Éter: `6 + (4 × Nível) + ([Mod.INT OU Mod.SAB] × Nível)`
- Evasão Ativa (Reação): 10 + Mod. Destreza + Treinamento em *Defender*
- Evasão Passiva (Sem reação): 10 + Mod. Destreza

# Treinamento:
Você começa treinado em: Armas à Distância, Atacar, Percepção
Além disso, você pode escolher (1 + Mod. Inteligência) Pericias para ser treinado dentre as seguintes: Furtividade, Iniciativa, Ofício(Engenharia), Investigação, Movimento

Atributos Recomendados: Destreza, Sabedoria e (Inteligência ou Constituição)
Play Style: Combate a Distância, Dano pesado e Controle de Terreno.
CD do Artilheiro: 10 + Mod. Destreza + Mod. Sabedoria

# Técnicas:
Toda classe possui técnicas, você pode reatribuí-las livremente ao realizar um descanso longo, respeitando o limite de pontos.
Você possui 3 Técnicas + Nível

| Técnica | Descrição | Custo | Ação |
|---|---|---|---|
| Respiração Controlada | Você não perde Concentração ao receber dano à distância (apenas corpo a corpo). | — | Passiva |
| Frieza | Enquanto tiver 3+ concentração, você tem vantagem em testes de resistência. | — | Passiva |
| Balas de Ferro | Seus ataques críticos reduzem 3 de Armadura(Ar) ou Armadura Específica(Ae) do alvo no acerto. Você só pode remover Armadura do tipo de dano que sua arma causa. | — | Passiva |
| Artesão de Munição | Durante descanso curto ou longo, você pode criar 1 munição(Flecha, Munição de Armas de Fogo ou Adagas de lançamento) sem rolar testes. | — | Passiva |
| Olho do Atirador | Você pode atirar em criaturas que você não enxerga com -2 (Ao invés de desvantagem) | — | Passiva |
| Sentidos Aguçados | Você pode rolar Percepção com 1 treinamento a mais. Adicionalmente, não pode ser *Desprevenido* por criaturas que você vê. | 2 Stamina | 1 Ação |
| Batida Tática | Você pode se mover neste turno sem perder concentração e sem provocar ataques de oportunidade. | 2 Stamina | 1 Ação |
| Tiro Camuflado | Deve estar escondido para ativar. Seu próximo ataque é crítico ao acertar. | 3 Stamina | 1 Ação |
| Tiro Imobilizador | Seu próximo ataque a distância neste turno causa a condição *Lento 1* caso o alvo falhe em um teste de Fortitude. | 2 Stamina, 1 Concentração | 1 Ação |
| Tiro Duplo | Seu próximo ataque não tem penalidade de multi-ataque. | 3 Stamina, 2 Concentração | 1 Ação |
| Tiro Preciso | Seu próximo ataque a distância neste turno tem +2 Atacar e Causa +1d6 de dano. | 2 Stamina, 2 Concentração | 1 Ação |
| Foco Absoluto | Seu próximo ataque tem Vantagem e Margem de Ameaça +1. | 3 Stamina, 5 Concentração | 1 Ação |
| Tiro na Cabeça | Seu próximo ataque causa +1d6 de dano por ponto de Concentração gasto. | 3 Stamina, x Concentração | 2 Ações |
| Ponto Vital | Ao acertar um ataque critico, adiciona +2d6 de Dano. | 3 Stamina, 3 Concentração | Reação |
| Tiro de Reflexo | Quando um inimigo se mover dentro do seu alcance, você pode atacar ele como uma reação. | 3 Stamina, 5 Concentração | Reação |

# Concentração:
Seus disparos ficam precisos a medida que você consegue se concentrar nos pontos fracos dos seus inimigos. Por ser um atirador, algumas atitudes aumentam sua concentração, enquanto outras diminuem.
### Concentração máxima: 3 + Mod. Sabedoria
Você começa todo combate com 0 de concentração e ganha concentração com as seguintes ações:
- **Atacar:** Ao acertar um ataque → **+1 Concentração, Crítico → +2**
- **Mirar:** Gaste 1 ação, mirando no seu alvo → **+2 Concentração**
- **Ficar Parado:** Não se mover no turno → **+1 Concentração**
Você gasta concentração para utilizar técnicas porém pode perder de outras formas:
- **Ser atacado:** Ao receber dano → **-1 Concentração**
- Se mover: Utilizar 1 ação para se movimentar → **-1 Concentração**
- **Condição:** Ao falhar em um teste de resistência → **-2 Concentração**
- **Morte:** Ao ver um aliado cair *Morrendo* → **-3 Concentração**
Ao estar concentrado, seu acerto aumenta proporcionalmente. !!Sempre adicione sua concentração a sua rolagem de ataque.
Algumas técnicas e habilidades podem exigir concentração, ao utiliza-las, diminua sua concentração conforme o requisitado.

# Ramos:
(texto padrão) Ao longo da criação do seu personagem você escolhera: 3 Marcas; 6 Técnicas de Ramo, 3 no Tier, 2 no Tier 2 e 1 no Tier 3
Ramos do Artilheiro:
- [azul] Ramo do Vendaval (Adagas de Arremesso e Agilidade) — Uma lâmina é lenta. Duas são rápidas. Dez são uma tempestade. Você não arremessa facas - você desencadeia um vendaval de aço que corta, perfura e silencia antes que o grito escape. Outros atiradores precisam mirar. Você já está arremessando a terceira faca enquanto a primeira ainda voa.
- [vermelho] Ramo da Pólvora (Armas de fogo e Dano) — O primeiro disparo que você ouviu mudou tudo. O poder absoluto de transformar vida em silêncio com um aperto de dedo. Alguns temem o barulho - você aprendeu a amá-lo. É o último aviso que seus inimigos recebem, e a maioria não vive para ouvir o segundo.
- [verde] Ramo do Predador (Flechas e Furtividade) — Você aprendeu que a caça não é sobre força - é sobre espera. Nas florestas silenciosas, nas montanhas geladas, nos pântanos esquecidos, você observou e aprendeu a ter paciência. A presa nunca sabe que está sendo caçada até que a flecha já tenha deixado o arco.

# Marcas de Ramo
## Marcas do Vendaval
- Inquieto — *"Você sempre está andando, correndo, fugindo. Isso te deixa inquieto"* Você não consegue ficar parado. Seus dedos sempre se movem, seus olhos sempre varrem o ambiente, seus pés sempre prontos para o próximo passo. Outros te acham nervoso, ansioso. Você sabe que está apenas preparado.
  - Para cada combate que você é o primeiro a jogar(Maior iniciativa), ganha +1 permanente em Iniciativa. Ao chegar em +5, essa habilidade fica supérflua.
  - Ao rolar Iniciativa, se você tirar o maior valor do combate, você ganha +2 Concentração no início do primeiro turno.
- Colecionador de Lâminas — *"Cada faca tem uma história. Cada história tem um corpo."* Você coleciona armas de arremesso obsessivamente. Cada lâmina tem um nome, uma origem, um propósito.
  - Suas lâminas são naturalmente resistentes, você pode gastar 5 minutos após um combate recuperando 1 **Conjunto de Arremesso**.
  - Você pode batizar uma **Arma de Arremesso** em um descanso longo. Você ganha +1 ao atacar com ela.
## Marcas do Pólvora
- Vicio de Poder — *"O cheiro de pólvora queimada. O zumbido nos ouvidos. O silêncio depois. Nada se compara."* Você se acomodou com a presença de sua arma, ela te engrandece e te faz sentir poderoso.
  - Para cada 5 criaturas que você matou com armas à distância, ganha +1 permanente em Atacar. Ao chegar em +5, essa habilidade fica supérflua.
  - Se acertar um crítico com uma arma a distância você recupera 1 de Stamina.
  - Ao passar **24 horas** sem disparar uma arma a distância, você fica *irritado*: -1 em testes sociais até disparar novamente.
- Conhecedor de Armas de Fogo — *"Armas de fogo acabaram de emergir como tecnologia de ponta. Você está por dentro."* Você conhece armas de fogo e o poder de destruição que elas são capazes de causar.
  - Você tem +2 em testes de Vontade.
  - Você conhece contatos que vendem armas de fogo e munições especiais em cada lugar do mundo.
## Marcas do Predador
- Paciência Inabalável — *"Você esperou dias por um único tiro. Esperaria semanas se necessário."* O tempo não te afeta como afeta os outros. Você pode ficar imóvel por horas, respirando lentamente, observando.
  - Para cada **5 combates** onde você acumulou 6+ **Concentração**, ganha +1 permanente em *Percepção*. Ao chegar em +5, essa habilidade fica supérflua.
  - Ao ficar imóvel por 1 turno inteiro, você ganha Vantagem no próximo ataque à distância.
  - Você tem +2 em testes de Sobrevivência.
- Marca no Alvo — *"Você não esquece um rosto. Especialmente os que você ainda não acertou."* Cada alvo que escapa vive na sua mente. Você estuda seus movimentos, imagina o tiro perfeito, planeja o reencontro. Isso te torna um caçador implacável — e um pouco obcecado.
  - Ao **errar** um ataque contra uma criatura, você pode "marcá-la mentalmente". Você tem **+1 Atacar cumulativo** contra ela (máx +3) até acertá-la ou ela morrer.
  - Se uma criatura marcada **fugir** do combate, você sabe a **direção geral** que ela foi (até 1km).
  - Você tem **+2 em Investigação** para encontrar informações sobre criaturas que você marcou.

# Técnicas de Ramo
### Tier 1
Vendaval
- Mãos Velozes (Passiva) — Você se torna **Treinado** em *Atacar*. Se já for **Treinado**, se torna **Experiente** e assim por diante. Ao usar **Armas de Arremesso**: Você pode sacar esse tipo de arma como ação livre. A penalidade de multi-ataque reduz para -2 em -2. (Ao invés de -5). Ao acertar 2+ ataques no mesmo turno e no mesmo alvo, você causa +1d6 de dano Perfurante. Você pode fabricar **Conjuntos de Arremesso** em descansos curtos e longos. Descanso Curto: Como a ação do seu descanso curto, você pode fabricar 1 **Conjunto de Arremesso**. Descanso Longo: Ao realizar um descanso longo, você pode fabricar 2 **Conjunto de Arremesso**.
- Passo do Vento (Passiva) — Ao utilizar 1 ação para se movimentar, você não perde mais **Concentração**. Ao **acertar um ataque**, você pode se mover 1,5 m como **ação livre**. Você adiciona sua **Concentração** a sua **Evasão**.
- Vendaval de Aço (2 Ações, 5 Stamina) — Faça 3 Ataques com Armas de Arremesso sem penalidade de multi-ataque. Se 2 ou mais ataques acertarem o mesmo alvo, ele ganha *Sangramento 1*.
Pólvora
- Mão de Ferro (Passiva) — Você se torna **Treinado** em Atacar. Se já for **Treinado**, se torna **Experiente** e assim por diante. Ao usar **Armas de Fogo**: Seus ataques causa +2 de dano Perfurante. Seus ataques ignoram 2 de Armadura(Ar). Você pode fabricar **munições de fogo** em descansos curtos e longos. Descanso Curto: Como a ação do seu descanso curto, você pode fabricar 1 **Munição de Fogo**. Descanso Longo: Ao realizar um descanso longo, você pode fabricar 2 **Munições de Fogo**.
- Presença da Pólvora (Passiva) — Você se torna **Treinado** em *Intimidação*. Se já for treinado se torna **Experiente** e assim por diante. Ao acertar um ataque com arma de fogo, criaturas em até 3 m do alvo (Exceto o alvo) devem passar em um teste de Vontade ou ficam *Amedrontadas* de você por 1 rodada. Ao suceder a criatura fica imune a esse efeito. Com 5 ou mais **Concentração** o efeito também afeta o alvo.
- Rajada de Tiros (1 ação, 3 Stamina) — Faça 2 Ataques com uma Arma de Fogo sem penalidade de multi-ataque em até 2 alvos com até 3 m entre sí. Se 2 ataques acertarem o mesmo alvo, ele deve passar em *Fortitude* ou fica *Atordoado* até o fim do próximo turno dele.
Predador
- Olho do Arqueiro (Passiva) — Você se torna **Treinado** em *Atacar*. Se já for treinado se torna **Experiente** e assim por diante. Ao usar **Arcos** ou **Bestas**: O Alcance da arma aumenta em +6 m. Ao mirar, seu próximo ataque com arcos ou bestas ganham +2 atacar. Você pode fabricar **flechas e virotes** em descansos curtos e longos. Descanso Curto: Como a ação do seu descanso curto, você pode fabricar 1 munição de **Flecha ou Virote**. Descanso Longo: Ao realizar um descanso longo, você pode fabricar 2 munições de **Flecha ou Virote**.
- Flechas do Predador (Passiva) — Ao atacar com **arco ou besta**, você pode escolher o tipo de **Flecha** ou **Virote**. Cada tipo tem um efeito adicional ao acertar: Perfurante → Ignora 3 de Armadura(Ar) Adicional. Farpada → Alvo recebe *Sangramento 1.* Explosão → Alvo é empurrado 1,5 m. Incendiária → Alvo recebe 1d4 de dano de **Fogo** Adicional.
- Tiro Carregado (1-3 Ações, 2 Stamina) — Você prepara um tiro que escala com a quantidade de ações que você utiliza: 1 Ação → +1d6 Dano Perfurante; 2 Ações → +2d6 Dano Perfurante; 3 Ações → +3d6 Dano Perfurante, Margem de Crítico +1. Você ganha +1 Concentração por ação gasta.

### Tier 2
Vendaval
- Projétil Envenenado (Passiva) — Durante um descanso curto, você pode aplicar **veneno** em até **5 munições** (flechas, virotes, munições de fogo, ou armas de arremesso). Ao acertar com munição envenenada, o alvo deve passar em **Fortitude** ou fica *Envenenado* por **2 rodadas**. Com 5**+ Concentração**, o alvo tem **Desvantagem** no teste.
- Dança da Morte (1 Ação, 4 Stamina, 3 Concentração) — Até o inicio do seu próximo turno: Você gasta sua reação, para fazer 1 Ataque à Distância como ação livre sempre que uma criatura se mover no seu alcance. Se acertar 3 ou mais **ataques** durante a **dança**, recupera 2 **Concentração** adicional.
Pólvora
- Munição Especial (1 Ação, 2 Stamina) — Você aprendeu a fabricar munições especiais para **qualquer arma à distância**. As munições são de uso único (Ao invés de uso por cena): Explosiva → Criaturas em 1,5 m do alvo sofrem o dano original da flecha. Perfurante → Ignora toda a armadura do alvo. Atordoante → Alvo faz Fortitude ou fica Atordoado por 1 Rodada (Não causa dano). Incendiária → Alvo fica *Em Chamas*. Durante um descanso curto, você pode criar 1 Munição Especial como ação de descanso curto e durante um descanso longo, você pode criar 2 munições Especiais. 3 munições especiais contam como 1 bugiganga.
- Execução (1 Ação, 4 Stamina, 5 Concentração) — Seu próximo ataque a distância: Recebe +4 Atacar. Você recebe 2d6 de dano perfurante se o alvo estiver com menos de 50% de Saúde Adicionalmente, o ataque é crítico se o alvo estiver com menos de 25% de Saúde. Se esse ataque matar o alvo, você ganha +3 Concentração.
Predador
- Olhar Revelador (Passiva) — Ao acertar a mesma criatura duas vezes você revela: Saúde aproximada da criatura. Resistências e Vulnerabilidades. Evasão. Ataques contra alvos revelados causam +1d6 de dano Perfurante.
- Dois Cordeiros (2 Ações, 4 Stamina, 4 Concentração) — Você dispara com uma arma a distância em uma linha reta de até 12 m. O Ataque atinge todas as criaturas na linha, faça um teste de atacar contra cada alvo separadamente. A cada alvo atingido, o próximo toma dano reduzido em -2.

### Tier 3
O Tier 3 provê Ultimates, que só podem ser utilizadas 1 vez por dia.
Vendaval — *"Vendaval de lâminas."*
- Tempestade de Aço (3 Ações, 6 Stamina, 5 Concentração, Ultimate) — Ativação: Você desencadeia uma rajada implacável de projéteis em um raio de 6 m em até 12 m de distância. Faça **1 ataque à distância** contra cada criatura na área. Criaturas atingidas devem passar em *Fortitude* ou ficam *Sangrando 2* e *Lento 1* por 2 rodadas. Para cada **2 criaturas atingidas**, você pode fazer **1 ataque adicional** contra qualquer alvo na área.
  - O Custo: Você gasta toda sua **Concentração**. Você gasta 1 munição da arma utilizada. Você perde 1d6 de éter.
Pólvora — *"Quando tudo falha, puxe o gatilho mais forte."*
- Canhão (2 Ações, 5 Stamina, 5 Concentração, Ultimate) — Ativação: Você carrega seu disparo mais devastador que você armazenava, canalizando tudo que resta em um único momento de aniquilação: Faça um ataque à distância com **+6 Atacar**. O ataque causa dano base da arma + 5d6 + sua Concentração atual(Após gastar com a ultimate) em d6s adicionais de dano Perfurante. O alvo e todas as criaturas em até **3m dele** devem passar em Fortitude ou ficam *Atordoados* e *Surdos* por 1 rodada. Se o alvo for morto por este ataque, criaturas em até 9m que presenciaram devem passar em *Vontade* ou ficam *Amedrontadas* de você até passar no teste no inicio de cada rodada. Independente de acerto ou erro, o barulho pode ser ouvido a até **1km** de distância.
  - O Custo: Você perde toda sua concentração. Sua arma fica inutilizável até o próximo descanso longo. Você perde 1d6 de Éter.
Predador — *"Você pode fugir, mas não pode se esconder."*
- Tiro Predador (3 Ações, 5 Stamina, 5 Concentração, Ultimate) — Ativação: Você canaliza toda sua concentração, paciência e habilidade em um único disparo que transcende a precisão mortal. O ataque tem alcance ilimitado, desde que você saiba onde está o alvo. O ataque ignora qualquer cobertura, Armadura(Ar), Armadura Específica(Ae) e Resistência. O ataque é automaticamente crítico se acertar. O alvo deve passar em um teste de *Fortitude*, ou sofre um dos seguintes efeitos a sua escolha: Execução: Se o alvo estiver com menos de 30% da vida, ele instantaneamente morre. Incapacitar: O alvo fica *Paralisado* por 2 Rodadas. Marcar: O alvo fica permanentemente Marcado, você sempre sabe sua localização e tem +4 Atacar contra ele até morrer.
  - O Custo: Você perde toda sua concentração. Você fica *Exausto 1.* Você perde 1d6 de éter.
