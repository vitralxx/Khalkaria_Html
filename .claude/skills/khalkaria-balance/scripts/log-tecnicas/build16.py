import json, sys, collections, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import resp_a, resp_b, resp_c, resp_p
R = resp_a.R; P = resp_p.P
REF = os.path.join(HERE, '..', '..', 'references') + os.sep
ach = json.load(open(os.path.join(HERE, 'log_achados.json'), encoding='utf-8'))
A = {a['id']: a for a in ach['achados']}

G = collections.OrderedDict([
 ('G1', ('Retaliação livre', '"Retaliar sem gastar reação" e "retalie como ação livre" são retaliações feitas fora da reação: rolagem de Atacar contra aquele ataque, só corpo a corpo. Podem acontecer sem reação disponível e acompanhar o Defender no mesmo ataque. É a leitura que dá efeito às técnicas escritas no modelo antigo (1 reação por ataque) sem mudar o texto.', 'T1')),
 ('G2', ('Ação livre', 'Uma técnica não acumula consigo no mesmo gatilho. Efeito de "próximo ataque" vale uma vez por ataque; para o ataque seguinte, reativa e paga de novo. Ação livre só vale fora do seu turno quando tem gatilho de fora ("ao ser atacado") ou efeito que só serve fora dele. Técnica que troca o custo de uma ação para ação livre não tira o limite da ação: Mover continua 1 vez por turno.', 'T1')),
 ('G3', ('PMA em técnica', 'Ataques de técnica contra o mesmo alvo levam o −5 cumulativo (D29), salvo quando o texto diz "sem penalidade de multi-ataque". A Transcendência do Monge existe para suspender a PMA, o que só faz sentido se os ataques de técnica a sofrem. Ataque extra dado por técnica entra na sequência do turno.', 'T1')),
 ('G4', ('Custo de ataque de técnica × arma', 'Técnica que dá N ataques "como 1 ação" com arma de Atacar(2)/(3): pergunta T2. Até lá a ficha mostra o custo do texto com aviso.', 'T2')),
 ('G5', ('Defender é dado', '"+N Defender" soma N à rolagem do dado de Defender. "Somar o treino de outra perícia no Defender" soma o bônus fixo daquela perícia (+2/+4/+6/+8 pelo grau). "Seu dado de Defender vira X" só vale quando X é melhor que o dado do seu grau.', None)),
 ('G6', ('1x/dia', '"1x/dia" = "1x/Descanso Longo" (L29, gravado no Sistema). Normalizar o texto nas 7 classes é a pergunta T5.', 'T5')),
 ('G7', ('Termos', 'Margem de Crítico = Margem de Ameaça. Surpreendido = Desprevenido. Derrubado = Caído. Adagas de lançamento = Conjunto de Arremesso. "Marcial leve" = chassi Marcial Precisa. "+1 Treinamento" = +1 grau. "Condição mágica ou não-mágica" = qualquer condição. Álcool = Bebida que deixa Bêbado. Sucata = item da categoria Lixo. Espada, provisório: arma corpo a corpo que causa Cortante (T3).', None)),
 ('G8', ('Durações ausentes', 'Técnica sem duração vale até o início do seu próximo turno. Condição sem duração dura 1 rodada, até o fim do próximo turno do alvo. Condição sem X é X = 1.', None)),
 ('G9', ('Custo exige saldo', 'Não se paga com o que não se tem (L01, gravado; D93). Custo aleatório (2d6) rola ao declarar; se o saldo não cobre, o efeito não acontece e nada é gasto.', None)),
 ('G10', ('Fluxo', 'Zera ao receber dano, após 1 rodada sem ganhar Fluxo e no fim do combate (L23, gravado no Monge). Custo em Fluxo nas técnicas é requisito, não gasto (texto da classe). Fluxo Invertido e as ultimates que tiram Fluxo: T12.', 'T12')),
 ('G11', ('Contrato corrigido (rev. 7)', 'Artilheiro gasta Concentração (não só exige). Monge começa com Movimento e Atacar (e Armas Marciais). Categorias de dano pelo Sistema: Místico = Radiante, Trovejante, Necrótico; Força e Primordial em "Outros" (a D67 estava errada). Texto de carta rara tirado dos campos de nota (n11, mentalFonte). Referências 03-origens e 04-racas marcadas como superadas.', None)),
 ('G12', ('"Passiva" com custo no corpo', 'O custo é pago por uso: Ponto Fraco, Brecha, Cadeia de Golpes, Encadeamento, Tese Arcana, Língua Prateada, Munição Especial. A leitura de Stamina "reservada" (P45) caiu.', None)),
 ('G13', ('Intensidade', 'Paga-se a intensidade declarada. Cair abaixo da menor intensidade que a magia tem = a magia falha. "Versão contida" = a menor intensidade disponível (Normal numa magia de Nível 1, que não tem Contida). Intensidade subida por técnica: T4.', 'T4')),
 ('G14', ('Custo de magia', 'Modulação grátis zera o custo dela, mas a magia continua modulada: o piso de 1 Éter vale. Escola Visceral: −2 na magia e −2 em cada modulação, cada modulação com piso 1, depois o piso global. A ficha casa técnica e Dor por id, nunca por nome (Mente Fraca).', None)),
 ('G15', ('Itens alquímicos', 'O CSV do Bazar é a fonte do item; a tabela da classe diverge em 2 itens (T13). "Queima" e "sangra por turno" de item são tiques do item, não as condições Em Chamas e Sangramento. Descontos de Reagente somam, com piso 1 por item. Sintonia Arcana: 2 Éter = 1 Reagente.', 'T13')),
])

T = collections.OrderedDict([
 ('T1', ('Princípios G1–G3', 'Aprova as três leituras: retaliação livre (G1), ação livre que não acumula consigo e só vale fora do turno com gatilho (G2), PMA também nos ataques de técnica (G3)?', 'Aprovar. Dão efeito ao texto que você já escreveu, sem reescrever técnica.')),
 ('T2', ('N ataques "como 1 ação" com arma pesada', 'Lâmina Rápida, Massacre e Rajada de Tiros com arma de Atacar(2)/(3): (a) literal, 1 ação sempre; (b) os ataques custam juntos o Atacar(n) da arma; (c) só armas de Atacar(1).', '(b). Toda arma de fogo do Bazar é Atacar(2): no literal, a Rajada dá 4 vezes a taxa normal de tiros e 3 Rajadas por turno somam 6 tiros.')),
 ('T3', ('"Espada"', 'Proficiência com Espadas e Pedra de Amolar citam "espada", que o Bazar não tem. Qual regra?', 'Arma corpo a corpo que causa dano Cortante. Casa com o "ignora resistência a Cortante" e não pede mudança no CSV; custo: machados e foices de chassi Cortante contam. Alternativa: tag "Espada" no CSV.')),
 ('T4', ('Intensidade subida por técnica', 'Tese Arcana, Patrono Primordial e Natureza Caótica sobem a intensidade. Paga a declarada ou a resultante? Chegar a Transbordante assim pede o teste de Vontade?', 'Paga a declarada; sem teste, porque o teste é o risco de quem escolhe forçar; teto Transbordante (Transbordante+ só onde o texto diz).')),
 ('T5', ('Normalização de termos (só texto)', '"1x/Dia" → "1x/Descanso Longo" nas ultimates e no cabeçalho do Tier 3 das 7 classes; "Margem de Crítico" → "Margem de Ameaça" (Sorte do Bêbado, Golpe Instinto, Tiro Carregado); "surpreendido" → "Desprevenido" (Sensor de Proximidade); "Adagas de lançamento" → "Conjunto de Arremesso" e "Flecha" → "Virotes/Flechas" (Artesão de Munição); "Derrubado" → "Caído" (Postura Defensiva); "Caidos" → "Caído" (Investida); e definir no Sistema > Sua Rodada: "Penalidade de Multi-Ataque (PMA): −5 cumulativo a cada ataque depois do primeiro contra o mesmo alvo, no mesmo turno" (D29).', 'Sim. Eu gravo e confiro o diff de cada página.')),
 ('T6', ('Recurso de classe do Espadachim e do Teurgo', 'Você disse "todas têm", mas o Notion não traz nome nem regra desses dois. Quais são (nome, máximo, como ganha, como perde)? Ou o do Teurgo é o próprio Éter?', 'Até você escrever, a ficha mostra um contador livre (nome e atual/máx editáveis).')),
 ('T7', ('Coragem Líquida', '"+1 permanentemente em Movimento": na perícia ou em metros?', 'Na perícia: as outras 5 marcas do Espadachim dão perícia.')),
 ('T8', ('Batedor', '(a) Ocultar-se diz "com 1 ação ao invés de 2", mas Esconder custa 3 hoje. (b) Homem de Negócios está cortado no próprio Notion: "Você possui um disturbio de mat…". (c) Desenhar Mapa de Exploração tem um bullet vazio "-" no Notion: faltou um benefício? (d) Artista Apaixonado: "mercadoria Incomum" muda o quê, se o mapa já é Incomum? (e) Senhor das Linhas: não há regra de flanqueio no Sistema, e a armadilha não tem tipo de dano.', '(a) Custo final 1 ação e corrigir o "2" para "3". (b) e (c) Preciso do texto. (d) Vender pelo preço de Incomum do Bazar. (e) Tirar "Não pode ser flanqueado"; armadilha Perfurante.')),
 ('T9', ('Brutalista', '(a) Muralha Viva (L19). (b) Frenesi: "no nível 1" e "descontrolado". (c) Contador de Corpos: o asterisco de "brutalmente" não tem nota no Notion. (d) Imortal: "pode escolher não morrer" é do modelo antigo.', '(a) "Some +1 à rolagem de Defender para cada grau de treinamento (Treinado +1, Experiente +2, Mestre +3, Lendário +4)", a tradução exata do "3 em 3". (b) "No nível 2"; "descontrolado" é adjetivo, não a condição; para travar algo preciso da lista, no mínimo "não conjura nem sustenta magia". (c) Matar com acerto crítico ou pelo Finalizar. (d) "Ao cair a 0 ou menos de Saúde, pode, como ação livre, ficar com 1 de Saúde em vez de entrar em Morrendo. Ao fazer isso, ganha +1 de Exaustão."')),
 ('T10', ('Investida (L20)', 'Nomes para as duas regras antigas, e a do Brutalista conta como o Mover do turno?', 'Técnica do Brutalista → "Atropelar"; ação do Titã → "Avalanche". Conta como Mover. "Investida" fica só para a manobra, que é a que as Grevas citam.')),
 ('T11', ('Teurgo', '(a) Encadeamento é exceção ao "1 magia por turno"? (b) Manifestação do Patrono: CDs sem número, "Banido" e os 6 Efeitos Caóticos. (c) Receptáculo Perfeito: "chegar em 50%" e a Casca Rachada. (d) Devoto: requisito é Patrono Primordial ou Barganha Primordial? (e) Grande Árvore: a Seiva do patrono soma Marca da Vhelor?', '(a) Sim, escrever a exceção; 3 Stamina por uso. (b) "Contra sua CD" (D57); Banido fica efeito da ultimate; sorteio 1d6. (c) "Ultrapassar", e a Casca Rachada dobra esse limite também. (d) Preciso da resposta. (e) Não: somar tiraria 10 de Éter máximo do próprio devoto na Marca 2.')),
 ('T12', ('Monge', '(a) Fluxo Invertido contra o "dano zera o Fluxo". (b) "Não pode perder fluxo de nenhuma outra forma" contra as ultimates que tiram Fluxo. (c) Forma do Vazio: "1d10 <5 acerta" dá 40%, não 50%; e o que são "ataques físicos"? (d) Queda Suave: o que é o "1 minuto" e quando vale o "5 × Nível"? (e) O ataque desarmado base (1d4) não tem tipo, atributo nem Atacar(n).', '(a) Com Fluxo Invertido, o dano dá +1 no lugar de zerar. (b) Acrescentar "exceto quando o texto de uma técnica diz que você perde Fluxo". (c) "≤5 acerta"; ataques de arma e desarmados, de qualquer tipo de dano. (d) Por 1 minuto, quedas até 30 m sem dano; acima de 30 m, o dano cai 5 × Nível. (e) "1d4 Contundente (Destreza), Atacar(1), corpo a corpo", o perfil do chassi Leve.')),
 ('T13', ('Alquimista', '(a) Cartucho Arcano depois da D68: custo e CD subiram 2 sozinhos. (b) Elixir Especial: "3 Reagentes" no cabeçalho, "1 por alvo" no corpo. (c) Curandeiro Incansável: "que estava com 0 de Saúde". (d) Tabela da classe × CSV: Soro da Guerra (o CSV dura 1 min e não tem "Vantagem em Fortitude") e Veneno Hemorrágico (o CSV não tem "Medicina estanca"). (e) Essência Etérea: "Incorpóreo" não é condição.', '(a) Reagentes = custo base de Éter da magia; CD = 10 + custo base; Nível 5 pede Foco Primordial para criar. (b) 1 por alvo. (c) "Que estava Morrendo". (d) Vale o CSV; se quiser os extras, eles entram no CSV. (e) Fica efeito do item.')),
 ('T14', ('Artilheiro', '(a) Munição Especial: "3 = 1 bugiganga" contra a regra "10 = 1". (b) Projétil Envenenado vale o combate inteiro pela regra da munição (D2/D41).', '(a) Alinhar a 10, salvo peso maior proposital. (b) É o que a regra diz; se for forte demais, basta "uso único".')),
 ('T15', ('Raças', '(a) Autômato, Achar Tecnologias em Lojas: o d12 não fecha com a lista. (b) Gruto: "Criaturas Predáveis" não está definido. (c) Corrompido: pela tabela, "negativas são permanentes" aponta para os poderes. (d) As Vozes: "1 natural em qualquer dado". (e) Receptáculo Natural e Cultista conjuram sem Treinado em Místico?', '(a) 1d10 sobre as 9 compráveis, rerolando o 10 e os repetidos. (b) Sugestão: Dryads e criaturas menores que você. (c) "Adversidades (custo +) são permanentes; poderes (custo −) podem ser reorganizados no descanso longo." (d) Só o d20: num 4d6 de dano, 52% das rolagens têm um 1. (e) Sim: o traço dá a conjuração das 2 magias.')),
 ('T16', ('Origens e condições mentais', '(a) A Forja: +1 grau por item inédito ou por raridade inédita? (b) Caçador: "1 Arma Simples" não existe. (c) Mineiro: itens iguais aos do Lenhador. (d) "Condições mentais" = Enfeitiçado, Amedrontado, Confuso, Atordoado, a única lista escrita (no Limiar). Descontrolado e Bêbado ficam de fora?', '(a) Por raridade (Incomum, Exótico, Luxária: até +3); por item, 4 fabricações levam a Lendário. (b) "Arma Distância Simples". (c) "Cobre" no lugar de "Madeira Comum". (d) Sim.')),
 ('T17', ('Produção em Massa', 'O texto termina com "← betovenon.": crédito intencional ou sai?', '—')),
 ('T18', ('Confirmações rápidas (a ficha já usa)', 'Epifania: cada d20 do conjunto vale uma rolagem e sai. Cobra: a dose dura até o 1º acerto. Primordial é o Nível 5 das escolas, não uma 5ª lista (o Foco Primordial diz "todas as magias de nível 5"). O Próximo: teto +3 no total.', 'Confirmar.')),
 ('T19', ('"+Int" de cura (L08)', 'Gravei no Sistema o que você disse para poções: Int de quem fabricou. E os elixires, os kits de Manutenção e Trauma, e a poção comprada sem fabricante conhecido?', 'Elixir igual à poção; kit com a Int de quem usa, porque é aplicado na hora; poção comprada soma +0, salvo o mestre dizer outro valor.')),
])

def classe(i):
    for c in ('espadachim','batedor','brutalista','teurgo','monge','alquimista','artilheiro'):
        if i.startswith(c): return c
    if i.startswith(('automato','corrompido','gruto','raca-')): return 'racas'
    if i.startswith('origem'): return 'origens'
    return 'outros'

SITE = {
 'espadachim-marca-do-duelo': 'Concordo: a Marca do Duelo entra na ficha como estado (contrato classes.espadachim.estados, rastrear: essencial, +1/+2/+3 por nível).',
 'batedor-agiota': 'Concordo: "Endividado" é efeito da técnica (como Marcado, PD17), não condição.',
 'teurgo-teorema-absoluto': 'Concordo: dois modos, Conjuração Impecável (1 Ação) e Anulação Suprema (Reação).',
 'monge-irmao-da-floresta': 'Concordo: "Luto Selvagem" é estado temporário da marca, não condição.',
 'alquimista-producao-em-massa': 'Perguntei ao Pedro (T17).',
 'ficha-sem-vulnerabilidade': 'O contrato já mitiga vulnerabilidade (dano.ordemMitigacao etapa 2). Falta o schema da ficha ter V por tipo: Autômato (Elétrico) e Pele Morta (Ordinário, Elemental e Biológico; ver o achado corrompido-pele-morta).',
}

out = {'schemaVersion': 'log-tecnicas-respostas/1', 'geradoEm': '2026-09-27',
       '_doc': 'Resposta do agente de balanceamento ao Log de Técnicas (artefato https://claude.ai/artifact/L4ftxMddmAPHWwG8U1VukL; main da5e73d, docs/ficha-digital/log-tecnicas-achados.json). Uma entrada por achado, pelo id. status: resolvido (regra escrita ou corrigida agora) | decisao (leitura do balanceamento; a ficha implementa, o Pedro pode revisar) | pedroDecide (espera o Pedro; a ficha usa o provisório indicado). principio = Gn de principios; perguntaPedro = Tn de perguntasPedro. Texto com a justificativa: 16-log-tecnicas.md.',
       'fonte': {'artefato': 'https://claude.ai/artifact/L4ftxMddmAPHWwG8U1VukL', 'achados': 'main da5e73d docs/ficha-digital/log-tecnicas-achados.json (160: balanceamento 110, pedro 41, site 9)'},
       'principios': {k: {'nome': v[0], 'regra': v[1], 'pergunta': v[2]} for k, v in G.items()},
       'perguntasPedro': {k: {'tema': v[0], 'pergunta': v[1], 'recomendacao': v[2]} for k, v in T.items()},
       'respostas': {}}
for a in ach['achados']:
    i = a['id']
    if a['paraQuem'] == 'balanceamento':
        e = dict(R[i]); e['paraQuem'] = 'balanceamento'
    elif a['paraQuem'] == 'pedro':
        p = P[i]; e = {'paraQuem': 'pedro', 'status': p['status'], 'resposta': p['recomendacao'], 'acao': p['acao'], 'principio': None, 'perguntaPedro': p['perguntaPedro']}
    else:
        e = {'paraQuem': 'site', 'status': 'doAgenteDeHtml', 'resposta': SITE.get(i, 'Sem nota do balanceamento.'), 'acao': 'site', 'principio': None, 'perguntaPedro': 'T17' if i == 'alquimista-producao-em-massa' else None}
    e['nome'] = a['nome']
    out['respostas'][i] = e
cnt = collections.Counter((v['paraQuem'], v['status']) for v in out['respostas'].values())
out['contagem'] = {f'{a}.{b}': n for (a, b), n in sorted(cnt.items())}
# consistencia: toda T citada existe
for i, v in out['respostas'].items():
    t = v.get('perguntaPedro')
    if t and t.startswith('T') and t not in T: sys.exit('T inexistente ' + t + ' em ' + i)
    g = v.get('principio')
    if g and g not in G: sys.exit('G inexistente ' + g)
json.dump(out, open(REF + 'log-tecnicas-respostas.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(out['contagem'])

# ---------------- Markdown
L = []
w = L.append
w('# 16 — Log de Técnicas: resposta do balanceamento')
w('')
w('Data: 2026-09-27. Responde ao artefato **Log de Técnicas** do agente de HTML (https://claude.ai/artifact/L4ftxMddmAPHWwG8U1VukL), que parte de `docs/ficha-digital/log-tecnicas-achados.json` (main `da5e73d`): 160 achados, 110 para o balanceamento, 41 para o Pedro e 9 para o site.')
w('')
w('**Numeração:** `Dn` = memória do balanceamento (`09-decisoes-pedro.md`); `PDn` = plano da ficha; `Ln` = lote de revisão do `15-ficha-rodada3.md`; `Gn` = princípio de leitura deste arquivo; `Tn` = pergunta aberta ao Pedro, com recomendação. A versão para máquina, com uma entrada por id de achado, é `log-tecnicas-respostas.json`.')
w('')
c = collections.Counter(v['status'] for v in out['respostas'].values() if v['paraQuem'] == 'balanceamento')
w('## 0. Resumo')
w('')
w(f'- **110 achados do balanceamento:** {c["resolvido"]} resolvidos, {c["decisao"]} com leitura minha (a ficha implementa) e {c["pedroDecide"]} esperando o Pedro, com provisório. A maior parte cai em 15 princípios (§1).')
w('- **41 achados do Pedro:** viraram as perguntas T5–T16, cada uma com recomendação (§2). Dois já estão resolvidos: o Cartucho Arcano (L18, gravado) e a colisão de nome da Mente Fraca (a ficha casa por id). T1–T4, T18 e T19 saíram das minhas respostas; T17 é de um achado do site.')
w('- **9 achados do site:** são do agente de HTML. Notas minhas em §4.')
w('- **Fora deste arquivo, no mesmo commit:** o lote L respondido pelo Pedro gravado no Notion (8 páginas, diff conferido em todas), contrato `regras-ficha/1.1` rev. 7, efeitos rev. 5, CSV com o L38, `marcas-vhelor/1.1` e a D67 corrigida na memória (§3).')
w('')
w('## 1. Princípios de leitura')
w('')
for k, (nome, regra, t) in G.items():
    w(f'- **{k}. {nome}.** {regra}' + (f' *(Pergunta {t}.)*' if t and t not in regra else ''))
w('')
w('## 2. Perguntas ao Pedro')
w('')
w('Cada uma com a minha recomendação. Enquanto não houver resposta, a ficha usa o provisório de cada achado.')
w('')
for k, (tema, perg, rec) in T.items():
    w(f'**{k}. {tema}.** {perg}')
    w(f'*Recomendação:* {rec}')
    w('')
w('Continuam abertas do lote anterior: **L14** (Teurgo sem técnica de grimório), **L35** (Morrendo estabilizado e acertado), **L39** (Semente da Vhelor, "1> marca") e o rework do Batedor (P1–P6).')
w('')
w('## 3. O lote L aplicado (respostas do Pedro em `03-respostas-pedro.md` §6)')
w('')
w('Todas as edições conferidas por fetch e diff; nada mais mudou nas páginas.')
w('')
w('| Página | Itens | O que entrou |')
w('|---|---|---|')
w('| Sistema | L01, L04, L06, L08, L41 | Novo bloco "Regras dos status": gasto sem saldo, máximo que muda, cura (Int de quem fabricou a poção), temporários |')
w('| Sistema | L17, L24, L25 | Tempo da ação (2 s), Defender não acumula, ordem do Movimento (sob Mover) |')
w('| Sistema | L26, L34, L32, L33 | Ae do mesmo tipo soma; Ae de categoria cobre a categoria; dano por categoria = tipo à escolha; Ae(Todos) sem Força, Primordial e Ordinários; imunidade zera; sem dano mínimo |')
w('| Sistema | L29, L30, L31 | Usos por descanso (notação oficial "1x/Descanso Longo"); sem comida ou luz, condições de descanso longo ficam; Xd8 por status |')
w('| Sistema e Magias | L28, L42 | Transbordante (Éter utilizado = custo total; pode negativar) e magia sustentada. Na Magias entraram também o custo mínimo e "Nível 1 não tem Contida", que só estavam no Sistema (a D68 avisava do texto duplicado) |')
w('| Condições | L27, L10, L11, L12 | Empilhamento no topo; Lento por ponto de X; Atordoado −2/−2 até o seu próximo turno; Exaustão 4 no atributo |')
w('| O Limiar | L09, L16 | Bônus de máximo rolado uma vez; Resumo com 16+ nos 5 atributos |')
w('| Monge | L23 | "Você perde todo o seu Fluxo ao receber dano, ao passar 1 rodada sem ganhar Fluxo e ao fim do combate." Mantive o gatilho da rodada sem ganhar porque a Concentração do Mestre depende dele. |')
w('| Alquimista | L18 | Cartucho Arcano: "do seu nível ou menor" |')
w('| Template - Ficha | L21 | Intimidação (Con/For) |')
w('| Cultista | L43 | "1 Pergaminho de Conhecimento nvl 2" (era o nível antigo da D68) |')
w('')
w('**CSV do Bazar.** Minha cópia agora é igual à da main (`751abae`) mais uma célula: **L38**, "Elixir da Expurgão" → "Elixir da Expurgação" (id `item-elixir-da-expurgacao`). Os 100 pergaminhos já estavam nos níveis novos desde a D71; o que faltava da L43 era o item inicial do Cultista, corrigido no Notion. As duas cópias (`references/bazar-v26.csv` e a da raiz) são iguais.')
w('')
w('**Efeitos (rev. 5).** L37: Anel do Esgrimista ganhou `consumirSangramento` (Xd4 uma vez e zera). L38: id e `marcas-vhelor` renomeados. Saída reproduzível: sha256 `d67d5f4dc5085814`.')
w('')
w('**Contrato (rev. 7).** 23 campos saíram de `decisao` para `canonico` com a fonte no Notion; cura por tipo de item (`atributoCuraItemPorTipo`, campo novo; `atributoCuraItem` agora vale `fabricante`); `dano.categorias` com "outros"; `danoGenericoDeCategoria` virou "tipo à escolha de quem causa" (L34 substitui a P51); Fluxo com `zeraEm` de 3 gatilhos e exceções; Artilheiro `gasta`; Monge `[movimento, atacar]`; PMA em técnica; `reserva` sem uso (G12); Escola Visceral e modulação grátis na `ordemCusto`; `intensidadeSubidaPorTecnica` (T4, provisório); `condicoesDuracaoPadrao` (G8); Premonição Etérica na Evasão; texto de carta rara fora dos campos de nota. Continuam abertos: `morrendo.desestabiliza` (L35) e as perguntas T.')
w('')
w('## 4. Achados do site (notas)')
w('')
for a in ach['achados']:
    if a['paraQuem'] == 'site':
        w(f'- `{a["id"]}` — {SITE.get(a["id"], "Sem nota do balanceamento.")}')
w('')
w('## 5. Respostas por achado (balanceamento, 110)')
w('')
w('Formato: **nome** (`id`) · status · princípio/pergunta — resposta. *Ficha:* o que fazer.')
NOMES = {'espadachim': 'Espadachim', 'batedor': 'Batedor', 'brutalista': 'Brutalista', 'teurgo': 'Teurgo', 'monge': 'Monge', 'alquimista': 'Alquimista', 'artilheiro': 'Artilheiro', 'racas': 'Raças', 'origens': 'Origens', 'outros': 'Referências do balanceamento'}
grupos = collections.OrderedDict((k, []) for k in NOMES)
for a in ach['achados']:
    if a['paraQuem'] == 'balanceamento': grupos[classe(a['id'])].append(a)
for g, lst in grupos.items():
    if not lst: continue
    w('')
    w(f'### {NOMES[g]}')
    w('')
    for a in lst:
        e = out['respostas'][a['id']]
        tags = ' · '.join(x for x in (e.get('principio'), e.get('perguntaPedro')) if x)
        w(f'- **{a["nome"]}** (`{a["id"]}`) · {e["status"]}' + (f' · {tags}' if tags else '') + f' — {e["resposta"]} *Ficha:* {e["acao"]}.')
w('')
w('## 6. Achados do Pedro (41) → pergunta')
w('')
w('| Achado | Pergunta | Recomendação |')
w('|---|---|---|')
for a in ach['achados']:
    if a['paraQuem'] == 'pedro':
        p = P[a['id']]
        w(f'| {a["nome"]} (`{a["id"]}`) | {p["perguntaPedro"]} | {p["recomendacao"]} |')
w('')
open(REF + '16-log-tecnicas.md', 'w', encoding='utf-8').write('\n'.join(L))
print('md', len('\n'.join(L)))
