# Revisão 1 do 16-log-tecnicas (2026-09-28): respostas do Pedro às T1–T19 (D98–D117).
# Fonte: references/17-respostas-T-e-sync.md §1. Tudo o que diz "gravado" foi conferido por fetch no Notion.
# Camada por cima das respostas originais (resp_a/b/c/p): o build16 guarda o status antigo em statusRev0.

DATA = '2026-09-28'

# T -> (resposta do Pedro, verbatim; decisões; estado)
RESP_T = {
 'T1': ('Sim, retaliar sem gastar reação preserva sua reação sendo possível utiliza-la de novo como uma reação. Quase toda técnica de ação livre só pode ser utilizada 1x/turno. Pma sempre vale exceto quando a técnica diz o contrário. Concordo.', 'D98, D99, D100', 'respondida'),
 'T2': ('Faz sentido, pode ser.', 'D101', 'respondida'),
 'T3': ('Perfeito, armas corpo a corpo que causam dano cortante.', 'D102', 'respondida'),
 'T4': ('Ok.', 'D103', 'respondida'),
 'T5': ('Sim, todos ok.', 'D104', 'respondida'),
 'T6': ('Estão sim no notion, o do espadachim é proficiência com espadas e marca do duelo, o teurgo são as escolas do primórdio.', 'D105', 'respondida'),
 'T7': ('Sim, é +1 permanente em movimento a cada combate bêbado vitorioso.', 'D106', 'parcial: o Notion diz "a cada 5 combates"'),
 'T8': ('O batedor inteiro receberá o rework no próximo prompt, após isso já faça um log do novo batedor ao agente html.', '—', 'rework do Batedor'),
 'T9': ('Você recebe+1 na perícia Defender a cada treinamento dessa perícia. já botei lá. Tirei que fica descontrolado no frenesi, ajeitei "Você pode usar Frenesi 1 vez por descanso longo no nível 2 e 2 vezes no nível 4." e *Brutalmente: Com crítico ou efeito de arma: Executar. Pode deixar o imortal.', 'D107', 'respondida (o Pedro editou o Notion)'),
 'T10': ('Perfeito.', 'D108', 'respondida'),
 'T11': ('Patrono primordial e barganha primordial se recebem no mesmo nível de tier, então é a mesma coisa. resto ok.', 'D109', 'respondida'),
 'T12': ('Ok.', 'D110', 'respondida'),
 'T13': ('Só tem o vantagem em fortitude a mais no notion, adiciona no csv; veneno hemorrágico: 3 ataques. +1d6 Biológico. Alvo recebe Sangramento 3 no terceiro ataque. muda no csv, resto ok;', 'D111', 'respondida (aberto: "mínimo 1" do Cartucho)'),
 'T14': ('adicionei 1x/Alvo. no projétil envenenado. Resto ok.', 'D112', 'respondida (o Pedro editou o Notion)'),
 'T15': ('As de tier 5 não podem ser obtidas por lojas, então não entram na rolagem. Gruto: Animais selvagens. Corrompido está certo, corrupções te deixam no negativo e adversidade te jogam de volta pro zero, ter adversidades em excendentes condiz que você tem pontos positivos para gastar em corrupções.', 'D113', 'parcial: (d) e (e) sem resposta'),
 'T16': ('Na forja, deixa como está, essa origem é especialista na perícia ferraria. Caçador sim. Mineiro Sim. Condições mentais, onde?', 'D114', 'parcial: (d) virou pergunta do Pedro'),
 'T17': ('É credito.', 'D115', 'respondida'),
 'T18': ('Ok;', 'D116', 'respondida'),
 'T19': ('Sempre usa a int de quem fabricou a poção, ela fica gravada com aquele modificador. Poção comprada soma media da raridade.', 'D117', 'respondida (falta a tabela da média)'),
}

# G -> (estado, nota da revisão)
G_REV1 = {
 'G1': ('aprovado (D98)', 'Canônico no Sistema > Sua Rodada: a retaliação que não gasta reação preserva a reação, que pode ser usada de novo como reação.'),
 'G2': ('substituído (D99)', 'Vale agora: técnica usada como ação livre, 1 vez por turno, salvo texto em contrário (Sistema > Sua Rodada). "Por turno" é cada turno, inclusive o de outra criatura. Continuam leituras minhas: a técnica não acumula consigo enquanto ativa, e trocar o custo de uma ação para ação livre não tira o limite da ação (Mover 1 vez por turno). Caiu a reativação a cada ataque.'),
 'G3': ('aprovado (D100)', 'Canônico no Sistema > Atacar.'),
 'G4': ('resolvido (D101)', 'Os N ataques "como 1 ação" pagam juntos o Atacar(n) da arma (Sistema > Atacar).'),
 'G6': ('resolvido (D104)', 'Gravado "1 vez por descanso longo" no cabeçalho do Tier 3 de 6 classes; o Batedor entra no rework.'),
 'G7': ('espada canônica (D102)', 'Espada = arma corpo a corpo que causa dano Cortante (Espadachim > Proficiência com Espadas). Os demais termos foram normalizados no Notion (D104).'),
 'G10': ('resolvido (D110)', 'Fluxo Invertido dá +1 no lugar de zerar; a perda de Fluxo por texto de técnica é exceção escrita.'),
 'G13': ('resolvido (D103)', 'Intensidade subida por técnica: paga a declarada, sem teste de Vontade, teto Transbordante (Sistema e Magias > Transbordante).'),
 'G15': ('resolvido (D111)', 'CSV e tabela da classe iguais nos 2 itens (Soro da Guerra, Veneno Hemorrágico).'),
}

GRAV = 'Gravado no Notion (2026-09-28): '
BATEDOR = 'O Batedor vai ser refeito inteiro (T8); esta leitura vale até o log do novo Batedor.'

# id do achado -> (status novo, texto da revisão)
REV1 = {
 # T1 / G1 / G2
 'espadachim-guardar-a-lamina': ('resolvido', 'D98: a primeira retaliação até o início do seu próximo turno não gasta reação, e a reação continua disponível.'),
 'espadachim-inimigo-mortal': ('resolvido', 'D98: as até 2 retaliações contra a Marca não gastam reação, e a reação continua disponível para Defender ou retaliar de novo.'),
 'espadachim-parry-perfeito': ('resolvido', 'D98 + D99: retaliação como ação livre, fora da reação, 1 vez por turno (uma em cada turno da Marca).'),
 'espadachim-sentenca-final': ('resolvido', 'D98: no plano, as retaliações não gastam reação e a reação continua disponível: você pode Defender (reação) e retaliar cada ataque da Marca.'),
 'espadachim-quebrar-postura': ('decisao', 'D99: 1 vez por turno. O resto da leitura fica.'),
 'espadachim-corte-diagonal': ('decisao', 'D99 substitui a G2: 1 vez por turno. A ativação dá +2 no próximo ataque e, se ele acertar a Marca, Sangramento 1. A reativação a cada ataque caiu.'),
 'espadachim-dobrar-a-aposta': ('decisao', 'D99: uma declaração por turno, não mais uma por ataque. Os +4d6 não dobram no crítico (D97).'),
 'monge-golpe-sequencial': ('decisao', 'D99: 1 ataque extra por turno, não mais 1 por ação Atacar. O extra entra na PMA (D100).'),
 'brutalista-resistencia-adaptavel': ('decisao', 'D99: a troca de tipo como ação livre vale 1 vez por turno.'),
 'batedor-sexto-sentido': ('decisao', 'D99: 1 vez por turno, em qualquer turno. ' + BATEDOR),
 'batedor-fantasma': ('decisao', 'D99: 1 vez por turno. ' + BATEDOR),
 # T2
 'espadachim-lamina-rapida': ('resolvido', 'D101: os 2 ataques pagam juntos o Atacar(n) da arma; o 2º leva −5 (D100).'),
 'espadachim-massacre': ('resolvido', 'D101: os 2 ataques pagam juntos o Atacar(n) da arma; o 2º leva −5 (D100). O resto da leitura fica.'),
 'artilheiro-rajada-de-tiros': ('resolvido', 'D101: os 2 tiros pagam juntos o Atacar(n) da arma de fogo, 2 ações com as do Bazar. A técnica isenta a PMA.'),
 # T3
 'espadachim-pedra-de-amolar': ('resolvido', 'D102: espada = arma corpo a corpo que causa dano Cortante (gravado na Proficiência com Espadas).'),
 'espadachim-proficiencia-com-espadas': ('resolvido', GRAV + '"espada (arma corpo a corpo que causa dano Cortante)" (D102).'),
 # T4
 'teurgo-natureza-caotica': ('resolvido', 'D103: paga a intensidade declarada e não rola Vontade; teto Transbordante.'),
 'teurgo-patrono-primordial': ('resolvido', 'D103: paga a intensidade conjurada, sobe 1, sem teste; teto Transbordante.'),
 'teurgo-tese-arcana': ('resolvido', 'D103: paga os 2 Stamina e o Éter da intensidade conjurada; sobe 1 sem teste de Vontade.'),
 # T5
 'artilheiro-artesao-de-municao': ('resolvido', GRAV + '"Virotes/Flechas, Munição de Armas de Fogo ou Conjunto de Arremesso".'),
 'artilheiro-tiro-carregado-2': ('resolvido', GRAV + '"Margem de Ameaça +1".'),
 'automato-sensor-de-proximidade': ('resolvido', GRAV + '"Não pode ser *Desprevenido*".'),
 'espadachim-oportunista': ('resolvido', 'PMA definida no Sistema > Atacar (gravado, D29 + D100). "Nesta rodada" = neste turno. D99: 1 vez por turno.'),
 'monge-transcendencia': ('resolvido', 'PMA definida no Sistema > Atacar (gravado, D29 + D100). "Durante essa rodada" = neste turno. D99: 1 vez por turno.'),
 'notacao-1x-dia': ('resolvido', GRAV + '"1 vez por descanso longo" no cabeçalho do Tier 3 de Espadachim, Brutalista, Teurgo, Monge, Alquimista e Artilheiro. O Batedor entra no rework.'),
 # T6, T7
 'espadachim-recurso': ('resolvido', 'D105: Proficiência com Espadas e Marca do Duelo. Não é contador: a ficha não mostra contador livre (contrato rev. 8).'),
 'teurgo-recurso': ('resolvido', 'D105: Escolas do Primórdio. O contador é o Éter (contrato rev. 8).'),
 'espadachim-coragem-liquida': ('pedroDecide', 'D106: +1 na perícia Movimento. Aberto: o Notion diz "a cada 5 combates" e o Pedro escreveu "a cada combate". A ficha usa o Notion até ele confirmar.'),
 # T8 (Batedor)
 'batedor-artista-apaixonado': ('pedroDecide', BATEDOR),
 'batedor-desenhar-mapa-de-exploracao': ('pedroDecide', BATEDOR),
 'batedor-homem-de-negocios': ('pedroDecide', BATEDOR),
 'batedor-ocultar-se': ('pedroDecide', BATEDOR),
 'batedor-senhor-das-linhas': ('pedroDecide', BATEDOR),
 # T9 (o Pedro editou)
 'brutalista-contador-de-corpos': ('resolvido', 'O Pedro gravou a nota: "*Brutalmente: Com crítico ou efeito de arma: Executar." A Stamina passou de +1 para 1d6.'),
 'brutalista-frenesi': ('resolvido', 'O Pedro gravou: "1 vez por descanso longo no nível 2 e 2 vezes no nível 4".'),
 'brutalista-frenesi-2': ('resolvido', 'O Pedro tirou "Fica descontrolado"; ficou "Não pode usar habilidades que exijam paciência ou concentração." A lista dessas habilidades não existe: a ficha avisa, não trava.'),
 'brutalista-imortal': ('resolvido', 'O Pedro reescreveu: "Ao ser reduzido a 0 de Saúde ou menos, pode escolher não morrer como ação livre voltando a 1 de Saúde. Ao fazer isso, você ganha +1 de Exaustão." O "+2 Ar abaixo da metade da vida" virou "Incansável: +1 em todas as perícias por nível de exaustão".'),
 'brutalista-muralha-viva': ('resolvido', 'O Pedro gravou: "Você recebe +1 na perícia Defender a cada treinamento dessa perícia." Igual à proposta: Treinado +1 até Lendário +4.'),
 # T10
 'alquimista-tita': ('resolvido', GRAV + 'ação do Titã "Avalanche" (D108).'),
 'brutalista-investida': ('resolvido', GRAV + 'técnica "Atropelar", "ficam *Caídos*. Conta como o Mover do turno." (D108).'),
 # T11
 'teurgo-devoto': ('resolvido', 'D109: "Requer Arauto Tier 1" basta, porque Patrono e Barganha Primordial vêm no mesmo tier.'),
 'teurgo-encadeamento': ('resolvido', GRAV + '"É uma exceção ao limite de 1 magia por turno. Os 3 de Stamina são pagos a cada uso."'),
 'teurgo-manifestacao-do-patrono': ('resolvido', GRAV + '"Fortitude contra sua CD", "Reflexo contra sua CD", "Vontade contra sua CD".'),
 'teurgo-manifestacao-do-patrono-2': ('resolvido', 'Aprovado: Banido fica efeito da ultimate, não condição nova.'),
 'teurgo-manifestacao-do-patrono-3': ('resolvido', GRAV + '"Efeito Caótico (role 1d6)".'),
 'teurgo-patrono-primordial-2': ('resolvido', 'Aprovado: a Seiva do patrono não soma Marca da Vhelor.'),
 'teurgo-receptaculo-perfeito': ('resolvido', GRAV + '"Ao ultrapassar 50% do éter máximo nos negativos (a *Casca Rachada* dobra esse limite)".'),
 # T12
 'monge-arma-humana': ('resolvido', 'Gravado no Sistema: "Desarmado: 1d4 de dano Contundente. O acerto usa a perícia atacar com Mod. de Destreza, dano dá +Mod. de Destreza. Custa 1 ação." A Arma Humana troca o dado para 1d8 (contrato dano.desarmado).'),
 'monge-forma-do-vazio': ('resolvido', 'No Notion: "Ataques físicos (de arma e desarmados)" e "≤5 = Acerta".'),
 'monge-perda-de-fluxo-ultimates': ('resolvido', GRAV + '"exceto quando o texto de uma técnica diz que você perde Fluxo."'),
 'monge-queda-suave': ('resolvido', GRAV + '"Por 1 minuto, você e até 5 criaturas à distância de toque não tomam dano de queda de até 30 m; em quedas maiores, o dano é reduzido em 5 × Nível."'),
 'monge-fluxo-invertido': ('resolvido', GRAV + '"+1 Fluxo ao receber dano (em vez de perder todo o Fluxo)".'),
 # T13
 'alquimista-veneno-hemorragico': ('resolvido', 'D111: CSV e tabela da classe dizem "3 ataques. +1d6 Biológico. Alvo recebe Sangramento 3 no terceiro ataque." Efeitos rev. 6: dano extra 1d6 biológico por 3 ataques, e o Sangramento 3 como lembrete.'),
 'alquimista-cartucho-arcano-2': ('pedroDecide', GRAV + 'Reagentes iguais ao custo base de Éter da magia; CD 10 + o custo base; Nível 5 exige Foco Primordial. Aberto: assim o cartucho de truque (Nível 1, 0 Éter) custa 0 Reagente; o "mínimo 1" é proposta minha. A ficha usa o texto gravado.'),
 'alquimista-elixir-especial': ('resolvido', GRAV + '"(1 Ação, 3 Stamina, 1 Reagente por alvo)".'),
 'alquimista-soro-da-guerra': ('resolvido', 'D111: o CSV ganhou "Vantagem em Fortitude" e a tabela da classe ganhou "Duração 1 min.". Efeitos rev. 6: a vantagem entra como lembrete.'),
 'alquimista-curandeiro-incansavel': ('resolvido', GRAV + '"Ao curar uma criatura que estava *Morrendo* e remover a condição".'),
 'alquimista-essencia-eterea': ('resolvido', 'Aprovado: Incorpóreo fica efeito do item.'),
 # T14
 'artilheiro-projetil-envenenado': ('resolvido', 'O Pedro acrescentou "1x/Alvo.": o veneno pega uma vez por alvo, não em cada acerto do combate.'),
 'artilheiro-municao-especial': ('resolvido', GRAV + '"10 munições especiais contam como 1 bugiganga".'),
 # T15
 'automato-achar-tecnologias-em-lojas': ('resolvido', 'D113, gravado: "As tecnologias de Tier 5 não podem ser obtidas em lojas e não entram na rolagem." Com isso o d12 fecha com as 12 tecnologias dos Tiers 1–4, na ordem da lista; a minha proposta de 1d10 caiu.'),
 'gruto-lingua-bifurcada': ('resolvido', 'O Pedro gravou: "contra Dryads e Animais selvagens".'),
 'raca-corrompido': ('resolvido', 'D113: o texto está certo. Corrupção leva o saldo ao negativo, adversidade devolve ao zero, e sobra de adversidade vira ponto para gastar em corrupção. Nada a mudar.'),
 'corrompido-as-vozes': ('pedroDecide', 'T15(d) ficou sem resposta; segue o provisório (só o d20).'),
 'corrompido-receptaculo-natural': ('decisao', 'T15(e) ficou sem resposta; a leitura fica.'),
 'origem-cultista': ('decisao', 'T15(e) ficou sem resposta; a leitura fica.'),
 # T16
 'origem-a-forja': ('resolvido', 'D114: fica literal, por item inédito, teto Lendário: a origem é especialista em Ferraria. A minha proposta por raridade caiu.'),
 'origem-cacador-itens': ('pedroDecide', GRAV + '"1 Arma Distância Simples". Aviso: o Caçador já tinha "1 Arma à Distância" e agora tem duas. Se a "Arma Simples" era a faca de esfolar, o certo é "1 Arma Leve". Pergunta ao Pedro; a ficha usa o Notion.'),
 'origem-mineiro-itens': ('resolvido', GRAV + '"1 Cobre (1 Bugiganga)".'),
 'origem-soldado': ('resolvido', 'T16(d): o Pedro perguntou onde está a lista. A resposta está no 17-respostas-T-e-sync.md, e a escolha da lista continua com ele.'),
 # T17, T18
 'alquimista-producao-em-massa': ('doAgenteDeHtml', 'D115: "← betovenon." é crédito intencional e fica.'),
 'espadachim-epifania': ('resolvido', 'D116: confirmado.'),
 'batedor-cobra': ('resolvido', 'D116: confirmado. ' + BATEDOR),
 'teurgo-escolas-do-primordio': ('resolvido', 'D116: confirmado.'),
 'brutalista-o-proximo': ('resolvido', 'D116: confirmado (teto +3 no total).'),
}

# Perguntas que continuam ou nasceram nesta revisão
ABERTAS = [
 ('Coragem Líquida', '"a cada combate" (chat) ou "a cada 5 combates" (Notion)?'),
 ('Média da raridade', 'tabela do +Int de item comprado. Proposta: Ordinário +1, Incomum +2, Exótico +3, Luxária +4.'),
 ('Condições mentais', 'qual lista vale: a única escrita (numa carta rara do Limiar: Enfeitiçado, Amedrontado, Confuso, Atordoado) ou a do grupo do site (Confuso, Amedrontado, Descontrolado, Enfeitiçado, Bêbado)?'),
 ('T15 (d) e (e)', 'As Vozes: só o d20? Receptáculo Natural e Cultista conjuram sem Treinado em Místico?'),
 ('Cartucho Arcano', '"mínimo 1 Reagente" para o cartucho de truque?'),
 ('Caçador', 'ficou com duas armas à distância. Era "1 Arma Leve"?'),
 ('D99 "quase toda"', 'ao pé da letra, passam a 1 vez por turno: Destruir, Barreira Instintiva, Sangue por Aço, Passo Afiado, Trêbado, Golpe Sequencial e as passivas com efeito de ação livre (Passo do Vento do Artilheiro, Ponto Fraco). Alguma é exceção?'),
 ('Lote anterior', 'L14, L35, L39.'),
]
