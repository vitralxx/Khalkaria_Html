# parte B: Teurgo, Monge
from resp_a import r, R

# ---------------- Teurgo ----------------
r('teurgo-extase-destrutivo', 'decisao',
  'Não é contradição: é sinergia do ramo. Com Éter ≤ 0 o Teurgo está Oco e não canaliza, e o degrau "0 ou abaixo" só dispara com algo que libere a conjuração no Oco: Reserva Oculta, que paga em Saúde, ou Receptáculo Perfeito, a ultimate do mesmo ramo. Ativar gastando 50% do Éter máximo pode deixá-lo Oco na hora, e esse é o risco que o ramo vende. A trava do Oco continua.',
  'ficha: degraus calculados pelo Éter atual; nota "≤0 exige Reserva Oculta ou Receptáculo Perfeito"', 'G13')
r('teurgo-extase-destrutivo-2', 'decisao',
  'Os bônus são passivos e dependem do nível de Éter ("Ao ter 50%... / 0 ou abaixo"); por isso o cabeçalho diz "Passiva". A "forma do Êxtase" é o jeito ativo de chegar ao degrau: 3 ações e o gasto imediato de 50% do Éter máximo. A restauração é o reembolso: uma vez por ativação, em até 10 minutos, com 3 ações, recupera 50% do Éter máximo, sem passar do máximo. Não há estado ligado/desligado para a ficha guardar, só o reembolso pendente.',
  'ficha: botão "Êxtase" (−50% Éter máx.) + botão "Restaurar" (1 vez, 10 min)')
r('teurgo-natureza-caotica', 'decisao',
  'G13. Você paga o Éter da intensidade que declarou; a rolagem mexe no efeito, não no custo. No 1-2, cair abaixo da menor intensidade que a magia tem faz a magia falhar. Numa magia de Nível 1, que não tem Contida (D68), cair de Normal falha. No 5-6, subir para Transbordante segue a resposta da T4.',
  'ficha: custo = intensidade declarada', 'G13', 'T4')
r('teurgo-tese-arcana', 'pedroDecide',
  'Pergunta T4 (intensidade subida por técnica). Recomendo: paga os 2 Stamina e o Éter da intensidade conjurada; a intensidade sobe 1 sem custo extra e sem o teste de Vontade, porque o teste é o risco de quem escolhe forçar. A modulação grátis dispensa o Éter de uma modulação. Declarada Transbordante, o teste declarado vale e o +1 não passa do teto.',
  'ficha: provisório = recomendação', 'G13', 'T4')
r('teurgo-patrono-primordial', 'pedroDecide',
  'Mesma T4 e mesma recomendação da Tese Arcana: paga a intensidade conjurada, sobe 1, sem teste. Numa Alteração já Transbordante, não há efeito extra; Transbordante+ só existe onde o texto diz (Receptáculo Perfeito).',
  'ficha: provisório = recomendação', 'G13', 'T4')
r('teurgo-cicatrizes-do-fluxo', 'decisao',
  '"Versão contida" = a menor intensidade que a magia tem (G13): Contida, ou Normal numa magia de Nível 1. A perda de Éter segue a falha do Transbordante e a L28: o dobro do custo total pago, com modulações.',
  'ficha: intensidade mínima por nível', 'G13')
r('teurgo-grimorio-arcano', 'pedroDecide',
  'Depende da L14, ainda com o Pedro: pegar uma técnica de grimório no nível 2 é obrigatório? Leitura para o texto atual: "substitui a fórmula nível 1" vale retroativo. No nível N o Teurgo conhece 3 + Mod.INT + (N − 1) magias. Quem não pega técnica de grimório fica na fórmula base da classe até a L14 fechar.',
  'ficha: provisório = leitura acima', None, 'L14')
r('teurgo-escolas-do-primordio', 'decisao',
  'Primordial não é uma 5ª lista de magias: é o Nível 5 das escolas (Sistema: "Magias Nível 5 — 8 Éter — requer Foco Primordial"). Dominar Primordial libera o Nível 5 das escolas dominadas, com Foco Primordial e Experiente em Místico. No nível 5 o Teurgo chega a 5 domínios (2 + 1 + 2), que são as 4 escolas mais Primordial, então não há escolha a errar. É por isso que o contrato conta 5 escolas.',
  'ficha: "Primordial" = chave do Nível 5, sem lista própria', None, 'T18')
r('teurgo-ritual', 'decisao',
  'A magia ritualizada não ocupa a vaga da sustentada (L42/PD16), porque tem vaga própria ("1 Ritual por vez"). Também não cobra Éter por turno: o custo "pago normalmente" é o da conjuração, uma vez, ao fim dos 10 minutos. A duração vira 6 horas fixas e acaba antes se você ficar Oco ou Morrendo.',
  'ficha: slot "Ritual" separado do slot "Sustentada"')
r('teurgo-marca-do-primordio', 'decisao',
  'A 1 Ação é gasta logo depois do acerto, no mesmo turno, para marcar. A Vontade é contra a sua CD (D57). O +1 dado vale só para as suas magias de dano, porque a marca é sua. No início de cada turno do alvo ele rola de novo, e um sucesso encerra a marca. Marcado é estado de classe (PD17), não condição.',
  'ficha: estado no alvo; +1 dado nas suas magias de dano')

# ---------------- Monge ----------------
r('monge-recurso-fluxo', 'resolvido',
  'L23 respondida ("Porém ainda tem, se receber dano que zera seu fluxo"). O Fluxo zera em 3 casos: ao receber dano, ao passar 1 rodada sem ganhar Fluxo e ao fim do combate. Mantive o gatilho da rodada sem ganhar porque a Concentração do Mestre depende dele ("só reseta após 2 rodadas sem ganhar fluxo"). Texto do Notion reescrito; contrato corrigido: zeraEm = [aoReceberDano, rodadaSemGanhar, fimCombate], sem _clausulaMorta.',
  'contrato + Notion (Monge)', 'G10')
r('monge-quebrar-guarda', 'decisao',
  'No modelo atual: o alvo só reage (Defender ou retaliar) ao seu 1º ataque do turno. Do 2º em diante, seus ataques vão contra a Evasão Passiva dele e não podem ser retaliados. A reação dele fica gasta até o turno dele, então outros agressores também enfrentam a Passiva. Isso preserva o "ele só pode defender ao seu primeiro golpe".',
  'ficha: nada a automatizar (mesa)', 'G1')
r('monge-treinamento-contrato', 'resolvido',
  'O contrato estava errado. Corrigido: periciasIniciais = [movimento, atacar] + Armas Marciais; Vontade fica na lista de escolha.',
  'contrato corrigido', 'G11')
r('monge-arma-humana', 'pedroDecide',
  'O ataque desarmado base não existe no Sistema. Pergunta T12. Recomendo: "Ataque desarmado: 1d4 Contundente (Destreza), Atacar(1), corpo a corpo", o mesmo perfil do chassi Leve (Sistema: corpo a corpo leve usa Destreza). A Arma Humana troca o 1d4 por 1d8, e Punho Perfeito e Toque da Dor passam a ter onde se apoiar.',
  'ficha: provisório = recomendação', None, 'T12')
r('monge-concentracao-do-mestre', 'resolvido',
  'Com a G10 os dois itens têm alvo. O 1º muda o gatilho de inatividade de 1 para 2 rodadas. O 2º anula o zeramento por dano Mod.SAB vezes por descanso longo; quando a Saúde cai, a ficha pergunta se quer gastar um uso.',
  'ficha: contador Mod.SAB/descanso longo; inatividade = 2 rodadas', 'G10')
r('monge-fluxo-invertido', 'pedroDecide',
  'Pergunta T12. Recomendo que, com Fluxo Invertido, o dano dê +1 no lugar de zerar. Na ordem "zera e ganha 1", o Fluxo do ramo do Vazio nunca passa de 1 sob ataque, e a aura dos 5 de Fluxo fica inalcançável justo para quem ganha Fluxo apanhando. A Concentração do Mestre (Punho) já mostra que técnica pode anular o zeramento.',
  'ficha: provisório = recomendação', 'G10', 'T12')
r('monge-totem-eterno', 'decisao',
  'O texto específico vence o geral: o Totem dá o próprio teste no fim de cada turno do alvo, e o "teste de resistência fracassa" do Paralisado vale contra os outros efeitos. Sucesso encerra a paralisia do totem; enquanto paralisado, o alvo fica Exposto (condição).',
  'ficha: nada a automatizar')
r('monge-transcendencia-suprema', 'decisao',
  '"Fica Exaurido" como custo = a Stamina vai a 0, porque Exaurido é o estado de Stamina 0 e a condição vem junto. Somam-se Exaustão +1 e −1d6 de Éter.',
  'ficha: ao fim, stamina = 0; exaustao +1; eter −1d6')
r('monge-companheiro-primal-ii', 'decisao',
  '"Passiva" = é o upgrade do Companheiro Primal. Invoca pelo custo do CP I (2 Ações, 5 Stamina) e escolhe a forma maior. O acerto é "usa seu bônus de Atacar" + 2: d20 + seu treino de Atacar + o seu Mod. do atributo da forma (DES ou FOR) + 2. O "Mod. Des + 2" do bloco é essa conta abreviada.',
  'ficha: custo do CP I; acerto = treino Atacar + Mod. + 2')
r('monge-golpe-sequencial', 'decisao',
  'O ataque extra não dispara a técnica de novo: o gatilho é "ao usar a ação atacar e acertar", e o extra vem da técnica, não da ação. É no máximo 1 extra por ação Atacar. O extra conta na PMA (G3): contra o mesmo alvo leva o −5 seguinte. O "pma 0" do contrato foi removido.',
  'contrato corrigido; ficha: 1 extra por ação Atacar', 'G3')
r('monge-fusao-primal', 'decisao',
  'O Mover como ação livre continua 1 vez por turno (G2). Contra alvo Lento X: +X no Atacar e +X no dano. O "Cortante" fica como escrito; Cortante e Perfurante são Ordinário e o Ar reduz igual, então o tipo só muda contra resistência de tipo específico.',
  'ficha: nada a automatizar', 'G2')
r('monge-o-terror', 'decisao',
  'A ativação (1 Ação, 2 Stamina) abre o modo até o início do seu próximo turno (G8). Nesse intervalo, seus acertos podem exigir Vontade contra a sua CD (D57) ou Amedrontado. O Fluxo permanente por criatura amedrontada e o +1d8 Necrótico contra Amedrontada são passivos. A Insurgência ("ativa permanentemente") mantém o modo ligado pelas 3 rodadas dela.',
  'ficha: estado "O Terror" até o próximo turno', 'G8')
r('monge-sussurros-constantes', 'decisao',
  'Gatilho: quando o Éter chega a 0 ou menos, que é o momento em que você ficaria Oco. "Recupere metade" soma metade do Éter máximo ao valor atual: de −3, com máximo 20, vai a 7. Não há limite de usos escrito; o limitador é a consequência que o Mestre escolhe a cada pacto. Pacto Sombrio é narrativo, não condição.',
  'ficha: prompt ao cruzar 0; eter += floor(max/2)')
r('monge-insurgencia', 'decisao',
  '"Ignoram Armadura/Resistência" = ignoram Ar, Ae e Resistência, os três redutores; só a Imunidade continua valendo. Vale para o dano inteiro dos ataques, não só os +2d8. Custo: perde floor(Éter atual / 2) se o Éter for positivo; com Éter ≤ 0 não há metade a perder.',
  'ficha: nota; custo calculado')
r('monge-fluxo-marcial', 'decisao',
  '"Adicional" pendura no mesmo gatilho, então herda o teto: cada um dos 2 acertos que contam na rodada dá +2 (máx. +4 por rodada). O Fluxo da Natureza é gatilho próprio (acerto do Companheiro) e fica fora desse teto.',
  'ficha: ganho por acerto = 2, teto de 2 gatilhos/rodada')
r('monge-cadeia-de-golpes', 'decisao',
  'Custo por uso (G12): 3 Stamina a cada encadeamento, até 2 por turno. Os 3 m são movimento da técnica, não a ação Mover, e não contam no limite de 1 Mover por turno. Ataque de oportunidade segue a regra normal.',
  'ficha: custo 3 Stamina por uso', 'G12')
r('monge-danca-do-monge', 'decisao',
  'Os 3 ataques levam PMA por alvo (G3). Três no mesmo alvo ficam 0/−5/−10; espalhados, cada alvo começa do 0. A Transcendência, técnica geral do próprio Monge, existe para suspender a PMA na rodada, o que só faz sentido se os ataques de técnica a sofrem. O contrato dizia "só vale na ação Atacar"; corrigido.',
  'contrato corrigido (turno.pmaNota)', 'G3')
r('monge-purificar', 'decisao',
  '"Mágica ou não-mágica" = qualquer condição. Ficam de fora as que dependem de um valor ou têm saída própria: Morrendo (Saúde ≤ 0), Oco (Éter ≤ 0), Exaurido (Stamina 0), Desnutrido, Sobrepeso e Exaustão (sai no descanso longo). Removê-las não muda o valor, e elas voltariam na hora.',
  'ficha: lista de condições menos as 6 exclusões', 'G7')
r('monge-companheiro-primal', 'decisao',
  'O companheiro usa os seus modificadores: "+Des" e "+For" são os do Monge. "Evasão passiva permanente" = ele fica sempre na Evasão fixa do bloco (13/11/15) e nunca ganha Evasão Ativa. Acerto: seu treino de Atacar + o seu Mod. do atributo da forma.',
  'ficha: dano = dado + seu Mod.; Evasão fixa')
