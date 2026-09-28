# Respostas do consultor aos achados 'balanceamento' do Log de Tecnicas (parte A: Espadachim, Batedor, Brutalista)
# status: resolvido (regra ja escrita) | decisao (leitura minha; a ficha implementa; Pedro pode revisar) | pedroDecide (depende do Pedro; segue o provisorio)
R = {}
def r(i, status, resp, acao='ficha', g=None, t=None):
    R[i] = {'status': status, 'resposta': resp, 'acao': acao, 'principio': g, 'perguntaPedro': t}

# ---------------- Espadachim ----------------
r('espadachim-inimigo-mortal', 'decisao',
  'Leitura G1: "retaliar sem gastar reação" é retaliação livre, feita fora da reação. Até o início do seu próximo turno, até 2 retaliações livres contra a Marca. Você pode retaliar mesmo sem reação e pode Defender (reação) e retaliar o mesmo ataque. A reação fica intacta para outro agressor se você não a usou.',
  'ficha: contador "retaliação livre" = 2 (alvo: Marca), zera no início do seu turno', 'G1', 'T1')
r('espadachim-quebrar-postura', 'decisao',
  'O alvo reage normalmente ao ataque que o acertou. Depois desse acerto, fica sem reação até o início do próximo turno dele, que é o ponto em que a reação volta; "fim da rodada" é termo do modelo antigo. Seus ataques seguintes neste turno perdem o dado de Defender dele e não podem ser retaliados, e os de outros agressores vão contra a Evasão Passiva.',
  'ficha: estado "sem reação" na Marca até o turno dela (mesa marca)', 'G1', 'T1')
r('espadachim-guardar-a-lamina', 'decisao',
  '"+2 Defender" soma 2 à rolagem do dado de Defender (G5). "Sua primeira retaliação não gasta reação" = a primeira retaliação até o início do seu próximo turno é livre (G1).',
  'ficha: +2 no dado de Defender; contador "retaliação livre" = 1', 'G1', 'T1')
r('espadachim-sentenca-final', 'decisao',
  'Com a G1, a técnica tem efeito: no plano, toda retaliação é livre, então você pode Defender (reação) e retaliar cada ataque da Marca. Se o Pedro recusar a G1, ela fica nula no modelo atual e precisa ser reescrita.',
  'ficha: retaliação livre ilimitada enquanto no plano', 'G1', 'T1')
r('espadachim-parry-perfeito', 'decisao',
  'Gatilho: um ataque da Marca erra contra sua Evasão Ativa. Efeito: retaliação livre. Role Atacar contra a rolagem do ataque defendido; se passar, você a acerta com a arma empunhada, só corpo a corpo. O ataque dela já errou, então você não sofre dano. Dispara uma vez por ataque defendido, pagando 3 Stamina a cada uso. O teto natural é o número de ataques da Marca e a sua Stamina. Não usa reação.',
  'ficha: botão de uso por ataque defendido (3 Stamina cada)', 'G1', 'T1')
r('espadachim-corte-diagonal', 'decisao',
  'Não acumula consigo (G2). Cada ataque recebe uma ativação só: no máximo +2 e Sangramento 1 por ataque. Pode ativar de novo para o ataque seguinte, pagando de novo. O Sangramento de ataques diferentes soma pela regra da condição.',
  'ficha: flag "próximo ataque" booleana, não contador', 'G2')
r('espadachim-dobrar-a-aposta', 'decisao',
  'Uma declaração por ataque (G2). Pode declarar em cada ataque contra a Marca no turno, pagando 3 Stamina a cada vez. Os +4d6 não dobram no crítico (D97: só dados da arma).',
  'ficha: flag booleana por ataque', 'G2')
r('espadachim-lamina-rapida', 'pedroDecide',
  'PMA: o 2º ataque leva −5 (G3; o texto não diz "sem penalidade de multi-ataque"). Custo com arma de Atacar(2)/(3): pergunta T2. Minha recomendação é que os 2 ataques custem juntos o Atacar(n) da arma, o que mantém a técnica valendo "2 ataques pelo preço de 1" em qualquer arma. No literal, uma Pesada Brutal faria 2 ataques por 1 ação, economizando 5 ações.',
  'ficha: mostra "1 Ação" do texto + aviso até a T2', 'G3', 'T2')
r('espadachim-massacre', 'pedroDecide',
  'Custo com arma pesada: mesma T2. O 2º ataque leva −5 (G3). Os +2d6 e o Sangramento 1 valem uma vez, no 2º acerto, só se os dois acertarem. Os +2d6 não dobram no crítico (D97).',
  'ficha: como Lâmina Rápida', 'G3', 'T2')
r('espadachim-proficiencia-com-espadas', 'pedroDecide',
  '"Espada" não existe no Bazar. Pergunta T3. Recomendo "arma corpo a corpo que causa dano Cortante": Leve Cortante, Marcial Precisa, Pesada Cortante, e Leve Ágil, Marcial Versátil e Pesada Brutal quando o jogador escolhe Cortante. É automatizável, casa com o "ignora resistência a Cortante" do nível 3 e não exige mexer no CSV. Custo: machados e foices de chassi Cortante contam como espada.',
  'ficha: provisório = corpo a corpo + Cortante', 'G7', 'T3')
r('espadachim-sorte-do-bebado', 'decisao',
  'Margem de crítico = Margem de Ameaça (G7). O +1 vale em toda rolagem de d20 (contrato testes.critico.escopo), inclusive fabricação pela regra geral do 20 natural; o crítico por margem de ±10 da D49 não muda. Não mexe no dado de Defender nem no dano, que não são d20. "+2 Evasão" entra na Evasão base (Passiva), e a Ativa sobe junto porque soma o dado à Passiva.',
  'ficha: margemDeAmeaca −1 em todo d20; evasao.base +2', 'G7')
r('espadachim-beber-ate-cair', 'decisao',
  '"Item:Álcool" = consumível de tag Bebida que deixa Bêbado: Cerveja de Taverna, Vinho Aguado, Aguardente de Raiz, Licor de Ferro, Fermentado do Abismo e Última Rodada. Café Preto não conta. O efeito próprio da bebida também vale. O Bêbado dura o que a bebida diz (quase todas até o fim da cena; Última Rodada até o descanso longo). A 1 Ação da técnica já inclui beber.',
  'ficha: filtro Tags∋Bebida e Efeito menciona "Bêbado" sem "Remove"', 'G7')
r('espadachim-ponto-fraco', 'resolvido',
  '"Passiva" com custo no corpo = custo por uso (G12): 5 Stamina a cada vez que você mantém o Exposto. O contrato estava errado ao usar Ponto Fraco como exemplo de Stamina reservada; corrigido.',
  'contrato: exemplo removido de vocabulario.custoTipoDetalhe.reserva', 'G12')
r('espadachim-brecha', 'decisao',
  'Os dois modos custam 5 Stamina, e o limite é 1 uso por turno somando os dois. O Sangramento confere o Exposto no momento do acerto, antes de o Exposto sair. Esse acerto é crítico, aplica Sangramento 1 e remove o Exposto.',
  'ficha: 1 uso/turno, 5 Stamina em qualquer modo', 'G12')
r('espadachim-pedra-de-amolar', 'pedroDecide',
  '"Espada": mesma T3, com o mesmo provisório (corpo a corpo + Cortante). O jogador escolhe a arma ao amolar. +1d4 Cortante até o fim do próximo combate; não dobra no crítico (D97).',
  'ficha: bônus preso à arma escolhida, some no fim do próximo combate', 'G7', 'T3')
r('espadachim-epifania', 'decisao',
  'Só rolagens de d20: Defender e dano não são d20. Cada dado substitui uma rolagem e sai do conjunto; acabados os 6, você volta a rolar, como em outras vidências. Se os dados pudessem ser reusados, seriam 10 minutos de 18+ garantido. 10 min = 100 rodadas (D90).',
  'ficha: pool de 6 valores, cada um consumido ao usar', None, 'T18')

# ---------------- Batedor ----------------
r('batedor-fantasma', 'decisao',
  'Defender é dado (G5): "somar o treinamento de Furtividade" soma o bônus fixo de Furtividade (+2/+4/+6/+8 pelo grau) à rolagem do dado de Defender. O gatilho "ao ser atacado" já é fora do seu turno, então a ação livre vale no turno do agressor (G2). Um pagamento de 2 Stamina por reação de Defender, e ele vale para todos os ataques daquele agressor no turno. O Batedor está em rework (D79); a leitura vale para o texto atual.',
  'ficha: +bônus de treino de Furtividade no Defender', 'G5')
r('batedor-sexto-sentido', 'decisao',
  'O +2 entra na Evasão base (Passiva), e a Ativa sobe junto. Ação livre defensiva usável no turno de qualquer criatura (G2): "durante esse turno" é o turno em curso, de quem for. No próprio turno o efeito não serve para nada.',
  'contrato/ficha: duração = turno em curso (qualquer criatura)', 'G2')
r('batedor-recurso-instinto', 'pedroDecide',
  'O ganho e a perda do Instinto estão no rework do Batedor (D79, perguntas P1–P6 em aberto). Para o texto atual: Defender não é "perícia com sucesso/falha", porque não tem CD e o resultado é a Evasão. A esquiva conta pelo gatilho próprio ("Ao esquivar"), sem contar duas vezes.',
  'ficha: Instinto manual (sem automação) até o rework', None, 'rework do Batedor (P1–P6)')
r('batedor-silencio', 'decisao',
  '(1) A ultimate dura até o fim do combate, como as irmãs (Senhor das Linhas, Suborno). A obsessão do custo segue o texto: dura até matar ou passar na Vontade. (2) O 1d6 de Éter é pago ao ativar, como todo "O Custo" de ultimate. (3) Cada marcação aplica Exposto, e remarcar na rodada seguinte reaplica. O Exposto sai no primeiro acerto, pela regra da condição. (4) Marcada à Morte é estado de classe (PD17): a palavra "condição" do texto é solta e não muda a regra.',
  'ficha: estado de classe com X; Exposto reaplicado a cada marcação')
r('batedor-cicatrizes-da-jornada', 'decisao',
  'Gasto sem saldo é proibido (contrato stamina.gastoSemSaldo, D93). Custo aleatório (G9): rola o 2d6 ao declarar. Se a Stamina atual não cobre o resultado, a conversão não acontece e nada é gasto. Com 0 de Stamina não dá para declarar.',
  'ficha: valida saldo ≥ resultado antes de converter', 'G9')
r('batedor-mapa-mental', 'decisao',
  '"Seus benefícios" = os do mapa tático do Desenhar Mapa de Combate: aliados não ficam Desprevenidos e Coordenação, Ponto Cego e Reposicionar ficam liberados, cada um com o próprio custo. Mapa Mental não exige ter o Desenhar: o esboço mental faz as vezes do mapa desenhado. A ficha lista os benefícios a partir do texto do Desenhar.',
  'ficha: ao ativar, mostra as 3 sub-habilidades do Desenhar Mapa de Combate')
r('batedor-golpe-instinto', 'decisao',
  'Vale o número: a margem cai 3 a partir da margem da arma. O "(17-20)" é o exemplo com margem 20; com margem 19, fica 16-20. Margem de crítico = Margem de Ameaça (G7).',
  'ficha: margemDeAmeaca −3 no próximo ataque', 'G7')
r('batedor-lingua-prateada', 'decisao',
  'O treino em Convencimento é passivo e sem custo. A 1 Ação e os 2 Stamina pagam o uso ativo, o teste de Convencimento com o comerciante; se passar, 25% de desconto em um item (G12).',
  'ficha: treino fixo; botão de uso com custo', 'G12')
r('batedor-cobra', 'decisao',
  'Dois usos. Criar venenos no descanso (até 2 no curto, 5 no longo, 5 Sins cada) não custa Stamina. Aplicar na arma ou munição custa 1 Ação e 2 Stamina. A Fortitude é contra a sua CD (D57: a CD é sempre a do portador; Batedor 10 + DES + SAB). "Envenenada" = Envenenamento. O texto não diz quanto dura a dose; provisório: vale até o primeiro acerto.',
  'ficha: custo só no "aplicar"; CD da classe', None, 'T18')

# ---------------- Brutalista ----------------
r('brutalista-guardiao', 'decisao',
  'A mesma reação cobre interceptar e defender. Ao interceptar, você vira o alvo daquele agressor, e no modelo atual uma reação cobre todos os ataques dele no turno, então o Defender sai dessa reação sem precisar de uma 2ª. O "Passiva" do cabeçalho só diz que não há custo de ativação; a técnica usa a reação pelo texto.',
  'ficha: 1 reação; Defender liberado contra o ataque interceptado', 'G1')
r('brutalista-resistencia-adaptavel', 'decisao',
  'Tipos válidos: os 9 atípicos (Fogo, Frio, Elétrico, Veneno, Ácido, Psíquico, Radiante, Trovejante, Necrótico). Ordinário fica de fora, porque Ae só reduz dano atípico (Sistema) e o Ordinário já tem o Ar. Força e Primordial ficam de fora (D63; mesma linha da L26/D89). A troca "instantaneamente" já reduz o golpe que a disparou: é o que dá sentido à palavra.',
  'ficha: seletor com os 9 atípicos; troca aplica no golpe atual')
r('brutalista-formacao-de-combate', 'decisao',
  'Os degraus somam: 3 aliados dão +2 +1 = +3 Atacar, e em Degolar 4 aliados dão +1 +1d6 +1d6. "+1,5 Movimento" são +1,5 m no Movimento derivado. "Executa uma criatura" = a reduz a 0 de Saúde, não a propriedade de arma Executar. "1 ação grátis" = 1 ação extra na hora, e isso é de mesa. Você conta na contagem de aliados.',
  'ficha: soma cumulativa por degrau')
r('brutalista-a-ultima-parede', 'decisao',
  '"Resistência a todos os tipos" = metade do dano em cada tipo (Sistema: "Resistência... o reduz sempre a metade"). Força e Primordial ficam de fora, na mesma linha da L26/D89 ("todos" nunca inclui os dois). "Ganha Exaustão 1" = +1 nível (contrato empilhamento.mesmaCondicaoComX = somaX; igual ao "+1 de Exaustão" da Imortal).',
  'ficha: R em 10 tipos (Ordinário + 9 atípicos); Exaustão +1 ao fim')
r('brutalista-despertar-a-besta', 'decisao',
  '"Perde permanentemente 2 de Éter" = −2 no Éter máximo, cumulativo a cada uso, gravado como redução permanente (L02). Na 2ª queda a 0 durante o efeito, ele entra em Morrendo (tique e cura do negativo valem), mas a imunidade a Inconsciente o deixa agindo. Ao fim das 3 rodadas, o custo o derruba Inconsciente, porque a imunidade acabou junto com o efeito.',
  'ficha: eter.max −2 permanente por uso; Morrendo sem Inconsciente enquanto ativa')
r('brutalista-campo-de-batalha', 'decisao',
  'A técnica troca só o custo do Mover para ação livre. O limite "Mover 1 vez por turno" continua (G2): cada aliado ganha 1 Mover livre por turno, sem ataque de oportunidade.',
  'ficha: nada a automatizar', 'G2')
r('brutalista-postura-defensiva', 'decisao',
  'Derrubado = Caído (G7). Enquanto a postura durar: imune a Caído e a ser empurrado (manobra Empurrar e efeitos que deslocam). O "quase nada" é a exceção da mesa para forças extremas.',
  'ficha: imunidade a Caído + nota "não pode ser empurrado"', 'G7')
r('brutalista-veterano-de-guerra', 'decisao',
  '+2 na rolagem de Iniciativa do início do combate, para você e os aliados em até 9 m que te ouvem.',
  'ficha: +2 Iniciativa (bônus de início de combate)')
r('brutalista-plano-do-general', 'decisao',
  '"+4 Iniciativa" soma 4 ao valor de Iniciativa já rolado e reordena a fila a partir da próxima rodada; vale até o fim do combate. Elaborar o plano não tem custo escrito, então fica com a mesa (D90: ação não definida é do mestre).',
  'ficha: +4 no valor de Iniciativa (mesa reordena)')
r('brutalista-o-proximo', 'decisao',
  'Teto de +3 no total: +2 da ativação e no máximo +1 por erro. Se o teto fosse só do acúmulo, o total chegaria a +5 por 1 ação e 3 Stamina, acima de qualquer bônus de Atacar de técnica geral. Na troca de alvo, o bônus volta a +2.',
  'ficha: contador 2..3')
r('brutalista-agarrao', 'decisao',
  'Só no acerto e de qualquer atacante, porque o alvo preso fica exposto a todos. O dano é do agarrador: Contundente, usa o Mod.FOR dele e o Ar reduz. Não dobra no crítico (D97). Dura enquanto o Agarrado durar.',
  'ficha: nota no alvo; rolagem manual')
r('brutalista-epifania-sanguinea', 'decisao',
  '"Os bônus dobram" = dobra dados e modificador: 2d6 + 2×Mod.CON de cura e +2d10 de dano. É dobrar o bônus inteiro. A D97 fala do crítico de arma, que é outra regra.',
  'ficha: fórmula alternativa quando em frenesi')
