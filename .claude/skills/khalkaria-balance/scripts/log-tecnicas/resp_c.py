# parte C: Alquimista, Artilheiro, racas e origens
from resp_a import r, R

# ---------------- Alquimista ----------------
r('alquimista-cartucho-arcano-2', 'pedroDecide',
  'Pergunta T13. A D68 subiu as magias 1 nível e manteve o Éter (a antiga Nível 4 e a nova Nível 5 custam 8). Por isso "(Nível × 2) Reagentes" e "CD 10 + 2 × Nível" subiram 2 sem ninguém editar. Recomendo amarrar ao custo base de Éter: Reagentes = custo base de Éter da magia; CD = 10 + custo base. Isso devolve os números de antes da D68. Cartucho de Nível 5: quem cria precisa dos mesmos requisitos de conjurar (Foco Primordial e Experiente em Místico).',
  'ficha: provisório = fórmula atual do texto + aviso', None, 'T13')
r('alquimista-cartucho-arcano-3', 'decisao',
  'Usar o cartucho é conjurar: conta como a magia do turno (1 por turno) e paga as ações da magia. A intensidade é Normal; a Sobrecarga ("Forçada automaticamente") só faz sentido se o padrão for Normal. Não custa Éter a quem usa, porque o custo foi pago em Reagentes na criação.',
  'ficha: cartucho = conjuração sem Éter, intensidade Normal')
r('alquimista-elixir-especial', 'pedroDecide',
  'Pergunta T13. Recomendo que valha o corpo: 1 Reagente por alvo. O "3 Reagentes" do cabeçalho é o caso de 3 alvos e deveria virar "1 Reagente/alvo". Somar os dois (3 + 1 por alvo) encarece um Tier 1 que já custa ação e Stamina.',
  'ficha: provisório = 1 Reagente por alvo', None, 'T13')
r('alquimista-enxurrada-de-alquimicos', 'decisao',
  'A técnica acrescenta uma rolagem de Atacar a cada arremesso, e essa é a diferença para o arremesso comum ("siga o que o item diz"). Se acertar, o item faz o que diz, inclusive o teste para metade. Se errar, o item não pega no alvo, e para onde ele cai é da mesa. PMA por alvo (G3): dois itens no mesmo alvo ficam 0/−5.',
  'ficha: 3 rolagens de Atacar com progressão PMA', 'G3')
r('alquimista-preciosismo', 'decisao',
  'A CD do item é a de quem usa (D57: "A CD é sempre a do portador, sem exceção"). Preciosismo soma +2 a essa CD quando o item foi feito por você. A coluna "CD" da tabela é a de criação, outra coisa.',
  'ficha: flag "feito por mim" no item → +2 na CD de resistência')
r('alquimista-apocalipse-alquimico', 'decisao',
  'Lento sem X = Lento 1 (G8). Cego, Atordoado e Lento sem duração ficam com 1 rodada, igual à explosão principal ("por 1 rodada"). Os 8d6 se dividem igual, 4d6 de cada tipo escolhido, e cada metade passa pela mitigação do próprio tipo.',
  'ficha: 2 rolagens de 4d6 com tipos separados', 'G8')
r('alquimista-bombardeiro', 'decisao',
  'Os descontos somam, e o piso é 1 Reagente por item, o mesmo do Economista, que é o único que escreve o piso e vale para todos. As reduções de CD de fabricação também somam. Vale igual para o Anatomista.',
  'ficha: custo = max(1, base − descontos)')
r('alquimista-transfusao-vital', 'decisao',
  'O dano é Veneno (seringa de toxinas). O ataque rola Atacar com Mod.INT, o mesmo atributo do dano. "Dano causado" = o que sobra depois da mitigação: você recupera o que de fato tirou.',
  'ficha: tipo Veneno; cura = dano final')
r('alquimista-constructo-menor', 'decisao',
  'O dano é Contundente (Ordinário, e o Ar reduz). O Constructo de Combate tem tipo escrito; o Menor fica no neutro. O acerto é o do texto: 1d20 + Mod.INT, sem treino. Sugestão para a ficha: um medidor de Saúde do constructo ativo, já que "apenas 1 por vez".',
  'ficha: tipo Contundente; medidor de Saúde do constructo (sugestão)')
r('alquimista-pai-de-pet', 'decisao',
  'O +1 em Místico é seu, até +5, pelo molde das Marcas (Cicatrizes da Jornada usa a mesma frase "+1 permanente... ao chegar em +5, fica supérflua"); o gatilho é o constructo sobreviver ao combate. "Em vez disso" fala do constructo: o que você recupera em Stamina ou Éter também chega a ele como Saúde, porque ele não tem esses recursos. Você continua recuperando os seus. É o que a frase anterior monta ("efeitos em você também afetam seu constructo").',
  'ficha: contador +1..+5 em Místico')
r('alquimista-arremessador', 'decisao',
  '"+1 Treinamento" = +1 grau (Leigo → Treinado = +2, e assim por diante; teto Lendário). A 1 Ação e os 2 Stamina são o custo de um arremesso com a técnica, e a ação é o próprio arremesso. O "+1 Treinamento" da Ferramentas Improvisadas é o mesmo +1 grau.',
  'ficha: +1 grau em Atacar só no arremesso com a técnica')
r('alquimista-sintonia-arcana', 'decisao',
  '2 Éter = 1 Reagente. O primeiro número é o que você paga, como no "2 Saúde = 1 Stamina" do Espadachim e no "(2:1) 2 Saúde = 1 Éter" da Reserva Oculta. O piso de 1 Reagente por item (ver Bombardeiro) vale depois da troca.',
  'ficha: conversor 2:1')
r('alquimista-veneno-hemorragico', 'decisao',
  'O CSV do Bazar é a fonte do item e diz o mesmo: "+2d6 Bio por 3 ataques. Alvo Sangra 1d6/turno por 3 rodadas." O sangramento do item é dano por tique (1d6 no início de cada turno do alvo, 3 rodadas), separado da condição Sangramento X (D83). O tipo é Biológico por categoria (L34: o jogador escolhe Veneno, Ácido ou Psíquico). O "Medicina estanca" só existe na tabela da classe e não no CSV; vai para o Pedro como divergência (T13).',
  'ficha: efeito de tique próprio, não condição', None, 'T13')
r('alquimista-bomba-temporal', 'decisao',
  'O CSV diz "Lento 2 (1 Ação por turno, −6 m de movimento, sem reação, −4 Reflexo) por 3 rodadas. Vontade nega". Lento 2 pela L10 dá −6 m e −2 ações, o que deixa 1 ação: bate. "Sem reação" e "−4 Reflexo" são extras do item somados à condição. O card de Lento está completo.',
  'ficha: Lento 2 + 2 modificadores do item')
r('alquimista-soro-da-guerra', 'resolvido',
  'O CSV, fonte dos itens, diz "Dura 1 min." A ficha usa o CSV. A tabela da classe não traz a duração e acrescenta "Vantagem em Fortitude", que o CSV não tem; divergência para o Pedro (T13).',
  'ficha: duração 1 min (10 rodadas)', None, 'T13')
r('alquimista-fogo-alquimico', 'decisao',
  'A queima do item é um tique, não a condição Em Chamas, que dura até apagar. No Fogo Alquímico é 1d6 Fogo no início do próximo turno do alvo, uma vez. No Napalm são 2d6 por turno por 3 rodadas, e "Água não apaga".',
  'ficha: tique do item, com duração fixa')

# ---------------- Artilheiro ----------------
r('artilheiro-concentracao-gasta-ou-exige', 'resolvido',
  'Gasta. O texto da classe diz "Você gasta concentração para utilizar técnicas" e "diminua sua concentração conforme o requisitado". O contrato estava errado; corrigido: custoEmTecnicasPadrao = "gasta". Como a Concentração soma no ataque, gastar baixa o acerto, e esse é o preço da técnica.',
  'contrato corrigido', 'G11')
r('artilheiro-teto-de-concentracao', 'decisao',
  'Não é bug de ficha. SAB é atributo-chave do Artilheiro (Des, Sab, Int/Con), e com SAB 14 na criação (Mod +2) o teto chega a 5, o que alcança todos os gastadores de 5. SAB 12 fica abaixo por escolha de build. Paciência (6+) pede Mod +3. A regra da ficha (desabilitado com o motivo escrito) basta. A régua de recurso de classe (D79) segue com o Pedro; minha recomendação é não mexer no teto, porque ele também é o bônus de ataque.',
  'contrato: status "canonico" + nota de build')
r('artilheiro-danca-da-morte', 'decisao',
  'Gastar a reação é a entrada. Você compromete a reação até o início do seu próximo turno e, em troca, faz 1 ataque à distância livre toda vez que uma criatura se move no seu alcance. Por isso o texto prevê 3+ acertos. Enquanto dança, você não tem reação para Defender nem retaliar.',
  'ficha: estado "Dança" consome a reação', 'G1')
r('artilheiro-projetil-envenenado', 'decisao',
  'Segue a regra da munição (D2, D41): o efeito vale o combate inteiro, em cada acerto. A Munição Especial diz "uso único" justamente porque foge dessa regra, e esta técnica não diz. São até 5 combates envenenados por descanso curto. É forte; se o Pedro quiser menos, basta escrever "uso único".',
  'ficha: munição com efeito de cena', None, 'T14')
r('artilheiro-municao-especial-2', 'decisao',
  'A 1 Ação e os 2 Stamina pagam carregar uma munição especial para o próximo disparo; a fabricação no descanso não custa nada disso (G12). A D41 ("munição nunca custa ação") vale para a munição do Bazar, que é de cena. Esta técnica cria munição de uso único e declara o próprio custo.',
  'ficha: botão "carregar especial" (1 ação, 2 Stamina)', 'G12')
r('artilheiro-rajada-de-tiros', 'pedroDecide',
  'Pergunta T2 (a mesma da Lâmina Rápida). Toda arma de fogo do Bazar é Atacar(2). No literal, a Rajada dá 2 tiros de Distância Pesada por 1 ação, 4 vezes a taxa normal, e 3 Rajadas por turno somariam 6 tiros. Recomendação: os 2 tiros custam juntos o Atacar(n) da arma, 2 ações com arma de fogo. A PMA não entra, porque o texto isenta. A L13 é da manobra Investida e não se estende aqui.',
  'ficha: mostra "1 Ação" + aviso até a T2', 'G4', 'T2')
r('artilheiro-tiro-carregado', 'decisao',
  'As ações do Tiro Carregado incluem o disparo, e o mínimo é o Atacar(n) da arma. Com arma de Atacar(1): 1 ação dá o tiro com +1d6, 3 ações dão +3d6 e +1 de margem. Com Distância Pesada (Atacar(2)): de 2 ações (+2d6) a 3 (+3d6). O tiro não fica guardado para o turno seguinte. +1 Concentração por ação gasta.',
  'ficha: seletor 1–3 ações com mínimo = Atacar(n)')
r('artilheiro-sentidos-agucados', 'decisao',
  'Técnica ativa sem duração vale até o início do seu próximo turno (G8). "1 treinamento a mais" = +1 grau em Percepção. A imunidade a Desprevenido vale no mesmo intervalo.',
  'ficha: estado até o próximo turno', 'G8')
r('artilheiro-tiro-imobilizador', 'decisao',
  'Condição sem duração dura 1 rodada, até o fim do próximo turno do alvo (G8). A Fortitude é contra a sua CD (D57).',
  'contrato: lento.duracao "daFonte" → padrão 1 rodada quando a fonte não diz', 'G8')
r('artilheiro-tempestade-de-aco', 'decisao',
  '"Por 2 rodadas" vale só para o Lento. O Sangramento não tem duração: cai 1 a cada acerto (D83). É a leitura que o contrato já tem.',
  'ficha: nada novo')
r('artilheiro-balas-de-ferro', 'decisao',
  'A redução começa no próprio acerto crítico e fica no alvo até o fim do combate. Acumula a cada crítico, com piso 0. Só reduz a defesa do tipo que a arma causa: arma Perfurante tira Ar (Ordinário).',
  'ficha (Mesa): contador de redução no alvo até o fim do combate')
r('artilheiro-maos-velozes', 'decisao',
  'Uma vez por turno por alvo, no 2º acerto. "Ao acertar 2+ ataques" é a condição, e a condição dispara o bônus uma vez. Com o Vendaval (3 ataques) fica +1d6, não +2d6.',
  'ficha (Mesa): +1d6 no 2º acerto no mesmo alvo')

# ---------------- Racas e origens ----------------
r('corrompido-premonicao-eterica', 'decisao',
  'No modelo atual (G5): o dado de Defender vira 2d6 quando o seu dado de treino é menor. Vale de Leigo a Mestre (1d12 tem média 6,5 contra 7 do 2d6); o Lendário mantém 2d8, porque a técnica nunca piora. O +1 Evasão entra na Evasão base. Contrato: +1 incluído em derivados.evasao.modificadores.',
  'contrato + ficha: dado = melhor(2d6, dado do grau)', 'G5')
r('automato-lamina-retratil', 'decisao',
  '"Marcial leve" = chassi Marcial Precisa, a marcial de Destreza. A arma é Marcial Precisa +1: 2d8 Cortante (Destreza), +1 em Atacar, Atacar(1) e Executar, mais o +1d10 Cortante impresso, que dobra no crítico (D97: dado escrito na arma). Pede treino em Armas Marciais, como toda marcial.',
  'ficha: montar como Marcial Precisa +1 com +1d10', 'G7')
r('corrompido-receptaculo-menor', 'resolvido',
  'A modulação "grátis" zera o custo dela, mas a magia continua modulada. A exceção do piso da D96 exige "sem modulação", então um truque Normal com a modulação grátis custa 1. Contrato: a ordemCusto ganhou a etapa "modulação zerada conta como modulação".',
  'contrato corrigido (magia.ordemCusto)', 'G14')
r('corrompido-escola-visceral', 'decisao',
  'Dois descontos: −2 no custo da magia e −2 em cada modulação. O "(mín. 1)" vale para cada modulação, e depois vem o piso global de 1 (D96). O exemplo do achado fica em 2 + max(1, 0) = 3. O contrato aplicava um desconto só e foi corrigido.',
  'contrato corrigido (magia.ordemCusto etapa 5)', 'G14')
r('corrompido-receptaculo-natural', 'decisao',
  'O traço dá a conjuração dessas 2 magias, e o texto específico vence o requisito geral de Treinado em Místico, como a memória já lê o Cultista ("destrava conjuração"). O requisito do Sistema continua para qualquer outra magia. A rolagem de Místico, quando a magia pede, usa o grau que o personagem tiver.',
  'ficha: 2 magias liberadas sem foco e sem exigir treino', None, 'T15')
r('origem-cultista', 'decisao',
  'Mesma leitura do Receptáculo Natural. "Você conhece e consegue canalizar" dá a conjuração das 2 magias mesmo com Religião no lugar de Místico. O foco continua obrigatório, porque o texto pede.',
  'ficha: 2 magias liberadas com foco', None, 'T15')
r('automato-corpo-mecanico-imunidade', 'decisao',
  'A imunidade é aos efeitos citados: as condições Sangramento e Envenenamento e doenças. Não é imunidade aos tipos de dano, então a grade não marca I em Veneno, Ácido ou Psíquico. O tique do Morrendo continua valendo, porque é a regra de morrer e não um efeito biológico. Sem ele o Autômato nunca morreria sangrando.',
  'ficha: imunidade a 2 condições + doenças; grade inalterada')
r('corrompido-pele-morta', 'resolvido',
  'Vale o Sistema: Místico = Radiante, Trovejante, Necrótico; Força e Primordial são "Outros". A Ae(Místico, 5) cobre os 3. A vulnerabilidade cobre os tipos não místicos das categorias: Ordinário, Elemental e Biológico. Força e Primordial ficam neutros, que é o que o "exceto" queria dizer quando os dois eram Místico. D67 corrigida na memória; contrato dano.categorias alinhado ao Sistema.',
  'contrato + memória corrigidos', 'G11')
r('corrompido-as-vozes', 'pedroDecide',
  'Pergunta T15. Recomendo que o gatilho seja só o d20. "Falha crítica" é conceito do d20, e em "qualquer dado" um 4d6 de dano tem 52% de ter um 1: o Éter do Corrompido some em um combate, a 2d4 + nível por gatilho. Se a intenção é ser brutal, a Pele Morta mostra que adversidade pode ser; aí vale o literal.',
  'ficha: provisório = só d20', None, 'T15')
r('origem-a-forja', 'pedroDecide',
  'Pergunta T16. O texto conta por item inédito acima de Ordinário, e o teto natural é o Lendário. Com isso, 4 itens diferentes levam de Leigo a Lendário. Recomendo contar por raridade inédita (Incomum, Exótico, Luxária: no máximo +3 graus), como o meu 03-origens lia. No Artesão, a imunidade à falha crítica e o ganho valem só para o que se fabrica com o Ofício nomeado (Engenharia); consumível feito com Alquimia fica de fora.',
  'ficha: provisório = literal (por item) com teto Lendário', None, 'T16')
r('origem-acolito', 'decisao',
  'A criatura repete o teste de resistência que a condição pediu, com a mesma perícia e a mesma CD, a de quem aplicou (D57). Condição que não teve teste de entrada fica com a mesa. "Maldição" é termo narrativo, também da mesa.',
  'ficha: nada a automatizar', 'G7')
r('automato-corpo-mecanico-sucata', 'decisao',
  'Sucata = itens da categoria Lixo do Bazar (48 itens, e é ali que "sucata" aparece). Para o Autômato, 1 item Lixo conta como 1 Comida no descanso (Desnutrido).',
  'ficha: Autômato aceita Lixo como Comida', 'G7')
r('automato-capacitores-de-energia', 'decisao',
  'Sem limite de usos escrito. Não reativa enquanto está ativo (G2: não acumula consigo) e pode reativar depois que acaba. O limitador é o próprio custo: 2d4 Elétrico no fim, dobrado pela vulnerabilidade do Autômato.',
  'ficha: estado de 3 rodadas; bloqueia reativar enquanto ativo', 'G2')
r('balanceamento-ref-racas', 'resolvido',
  'Procede. O 04-racas.md é anterior à última sincronização e está desatualizado; vale o data/racas (Notion). O contrato não tira números de raça dessa referência. Marquei o arquivo como superado e a reauditoria entra na fila (bloco C).',
  'referência marcada como superada')
r('balanceamento-ref-origens', 'resolvido',
  'Procede, com o mesmo tratamento: 03-origens.md marcado como superado; vale o data/origens.json. A leitura do A Forja por raridade virou recomendação (T16), não regra.',
  'referência marcada como superada', None, 'T16')
r('origem-soldado', 'resolvido',
  'A página Condições do Notion não tem seção "Condições Mentais"; o grupo "mentais" do site é agrupamento de interface. A única lista escrita no Notion está no Limiar e é a do contrato: Enfeitiçado, Amedrontado, Confuso, Atordoado. O n11 foi reescrito sem citar efeito de carta rara, e a censura não precisa mais cortar. Para o site: o grupo "Condições Mentais" da página de Condições não bate com essa lista (tem Descontrolado e Bêbado, não tem Atordoado); alinhar ou renomear o grupo. Confirmação com o Pedro em T16.',
  'contrato corrigido (n11, taxonomiaDeCondicao.mentalFonte)', None, 'T16')
