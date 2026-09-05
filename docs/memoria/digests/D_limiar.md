# D_limiar — Digest: 🃏 O Limiar
Fonte: Notion `3a66e3a4-01d9-806d-b1f8-d6975255f676` (parent "Sistema Khalkaria"), last_edited **2026-08-05T21:03Z**, Status 🟢 Pronto. **Sem subpáginas** (fetch completo, não truncado). Raw: `raw/limiar.md`.

## 1. O que o Limiar É — prosa verbatim
> *Entre a mortalidade e o divino, existe uma porta. Você presencia o Limiar.*
>
> Há algo além da técnica marcial, além do estudo arcano, além da força bruta. Existe um **limiar** — um momento onde o universo reconhece sua existência e oferece dádivas. Alguns chamam de destino. Outros, de sorte. Você sabe a verdade: **você está sendo observado**.
>
> A cada nível conquistado, o Limiar se abre. Você sente a presença de algo maior. Escolhas aparecem diante de você — cartas flutuando em sua mente, cada uma sussurrando promessas de poder. Algumas são óbvias. Outras, impossíveis de prever. Mas todas são **suas** para tomar.
>
> O Limiar não julga. Apenas oferece.
>
> E você escolhe quem se tornará.

Catálogo (intro): "A cada nível, o Limiar revela cartas baseadas nos seus atributos. Abaixo, o catálogo completo de todas as cartas disponíveis."
Universais: "*Estas cartas aparecem para todos os personagens, independente dos atributos.*"
Raras: "*Requisitos: Múltiplos atributos altos* — Estas cartas são extremamente poderosas e exigem builds específicas para serem acessadas."

**O Abismo (prosa verbatim):**
> Você pode entregar pedaços de si mesmo em troca de poder.
> Você machuca sua alma em troco de poder?
> Respeite os custos. Pegue o que quiser.

## 2. Como funciona — regras verbatim
**🎴 A Cada Nível (2, 3, 4, 5)** — "Quando você avança de nível, duas coisas acontecem:"
1. **Bênção Imediata dos Atributos** — "Você recebe **+2 pontos de atributo** instantaneamente. Distribua esses 2 pontos como quiser entre seus atributos (FOR, DES, CON, INT, SAB). **Lembre-se:** Modificadores de atributo aumentam a cada 2 pontos."
2. **Revelação das Cartas do Limiar** — "O Limiar se abre. 5 **cartas** aparecem diante de você, sorteadas com base nos seus atributos atuais. Adicionalmente, uma 6**ª carta especial** também aparece: **+2 Atributo Adicional**."

**Escolhendo Suas Cartas** — "Você recebe **4 Pontos do Limiar** neste nível. **Você escolhe 1 carta GRATUITAMENTE** dentre as 5 reveladas. Cartas adicionais custam Pontos do Limiar: 1ª carta: Grátis! · 2ª carta: **2 Pontos do Limiar** · 3ª carta: **3 Pontos do Limiar** · 4ª carta: **4 Pontos do Limiar** · … A 6ª carta (+2 Atributo): Sempre custa **2 Pontos do Limiar**. **Pontos não gastos são guardados** para os próximos níveis. **Cartas não escolhidas podem retornar** — o Limiar as oferece novamente caso você não as escolha. Você pode QUEIMAR uma carta de cada mão oferecida, ela nunca retornará."

**Progressão Total** — "Ao alcançar o **Nível 5**, você terá: **+8 pontos de atributo** garantidos (2 por nível × 4 níveis) · **16 Pontos do Limiar** totais (4 por nível × 4 níveis) · **8-11 Cartas do Limiar** escolhidas (dependendo de como gastou os pontos)"

**🎲 Como as Cartas São Sorteadas** — "As cartas que aparecem para você **dependem dos seus atributos atuais**."
- **Atributo "Alto"**: "Geralmente, um atributo é considerado alto quando está em **14 ou mais**. Porém, é importante lembrar que cada carta possui requisitos DIFERENTES uma das outras."
- **Sorteio das 4 Cartas:** "O Mestre identifica quais atributos você tem altos e sorteia: **1-2 cartas** do pool universal (sem requisito) · **1-3 cartas** dos pools de atributos altos · 1 carta rara"
- **6ª Carta Especial:** "A carta **+2 Atributo** sempre aparece, mas custa **2 Pontos do Limiar** porque você já recebeu +2 atributos gratuitamente neste nível."

Abismo: tabela esquerda cabeçalho `Ganho de Dor | Nome | Penalidade` (Dores: você GANHA Dor ao pegar); tabela direita `Gasto de Dor | Nome | Penalidade` (Benefícios: você GASTA Dor). Não há regra textual além dos cabeçalhos e das 3 frases acima — mecânica de Dor (acúmulo, limite, quando pegar) **não está escrita**.

## 3. Contagem programática (tabelas inline, `Counter`)
| Categoria | Esperado (CLAUDE.md) | Bloco-resumo Notion | **Real (tabelas)** |
|---|---|---|---|
| Universais | 10 | 10 | **8** |
| FOR | 12 | 12 | 12 |
| DES | 12 | 12 | 12 |
| CON | 12 | 12 | 12 |
| INT | 12 | 12 | 12 |
| SAB | 12 | 12 | 12 |
| Raras | 59 | 60 | 59 |
| Abismo Dores | 18 | — | 18 |
| Abismo Benefícios | 23 | — | 23 |
| **Total** | **170** | 130 (catálogo) | **168** (catálogo 127 + Abismo 41) |

Duplicatas (Counter): **`Devorador de Almas`** ×2 — uma Rara (INT 16+, SAB 16+: absorve habilidade especial permanente) e um Benefício do Abismo (Gasto 3: treinamento temporário 24h). Mesmo nome, efeitos distintos. Soma de Dor: Dores = 63 pontos disponíveis; Benefícios = 86 pontos de custo total.

**Divergência site ↔ Notion (data/limiar.json, set-diff):**
- `só_site` universais: **Marca do Guerreiro**, **Postura de Ferro** (não existem no Notion → site tem 10, Notion 8).
- Renomes: Notion **Garras de Éter** ↔ site "Garras de Aço" · Notion **Comunhão** ↔ site "Comunhão Primordial" · Notion **Onisciencia de Mundarak** (INT 20+, SAB 20+, DES 16+) ↔ site "Onisciência de Kha" (**INT 18+, SAB 18+**, DES 16+) — nome E requisito numérico divergem.
- Typos Notion corrigidos no site (OK): Sussurador→Sussurrador, Ressureição→Ressurreição, Etérico→Éterico (site também errado: correto é "Etérico").

## 4. Lista completa de cartas (parse programático das tabelas inline)

### Universais (8)
| Carta | Requisito | Efeito |
|---|---|---|
| Alma Resiliente | — | Aumente 1 nível de treinamento em Fortitude, Vontade e Reflexos |
| Pernas Incansáveis | — | +3m de movimento permanente. Adicionalmente, Acelerar ganha +1,5 m. |
| Reservas Profundas | — | +2d6+8 Stamina máxima permanente |
| Poço Arcano | — | +2d6+8 Éter máximo permanente |
| Sangue Espesso | — | +2d10+5 Saúde máxima permanente |
| Olhos de Águia | — | Aumente 2 níveis de treinamento em Percepção |
| Reflexos Aguçados | — | Aumente 2 níveis de treinamento em Iniciativa |
| Treinamento Focado | — | Escolha 2 perícias. Aumente 1 nível de treinamento nelas. (Essa carta sempre está no pool universal) |

### FOR (12)
| Carta | Requisito | Efeito |
|---|---|---|
| Músculos de Ogro | FOR 16+ (cabeçalho da coluna) | Seus ataques corpo a corpo causam +5 de dano permanente |
| Ossos Densos | FOR 16+ (cabeçalho da coluna) | Seus ataques corpo a corpo críticos reduzem 1 de Armadura do inimigo |
| Pontos Vitais | FOR 16+ (cabeçalho da coluna) | Ao acertar crítico corpo a corpo, cause +2d6 de dano adicional |
| Garras de Éter | FOR 16+ (cabeçalho da coluna) | Seus ataques desarmados causam 1d10 + SAB de dano Cortante (ao invés de 1d4) |
| Coluna de Titã | FOR 16+ (cabeçalho da coluna) | Aumente +1 ponto de força. Adicionalmente, Você ignora sobrepeso leve |
| Sangue Fervente | FOR 16+ (cabeçalho da coluna) | Ao reduzir criatura a 0 Saúde corpo a corpo, seu próximo ataque neste turno causa +1d10 de dano de Força |
| Arremesso Brutal | FOR 16+ (cabeçalho da coluna) | Você pode arremessar armas corpo a corpo até 18m causando dano normal + 1d8 Contundente |
| Lutador de Rua | FOR 16+ (cabeçalho da coluna) | +5 em manobras de Agarrar. Criaturas agarradas recebem 2d6 de dano por turno e pode agarrar criaturas de um tamanho acima que o seu. |
| Impacto Sísmico | FOR 16+ (cabeçalho da coluna) | Ao empurrar com sucesso, empurre +4,5m adicionais e cause 3d6 de dano de Força caso o alvo colida com qualquer obstáculo |
| Limiar da Morte | FOR 16+ (cabeçalho da coluna) | Como ação livre, nesta rodada você fica vulnerável a dano ordinário, porém causa +2d8 de dano de Força em todos os ataques. |
| Presença Aterradora | FOR 16+ (cabeçalho da coluna) | Aumente 2 níveis de treinamento em Intimidação. Criaturas menores que você têm desvantagem em Vontade contra sua intimidação |
| Quebra-Escudos | FOR 16+ (cabeçalho da coluna) | Ao acertar crítico em criaturas de nível igual ou menor que o seu, destrua 1 item que estejam segurando ou vestindo (escudo, arma, armadura) |

### DES (12)
| Carta | Requisito | Efeito |
|---|---|---|
| Lâmina Fantasma | DES 16+ | Você acerta críticos em 19-20 no d20 (ao invés de apenas 20). Se já possui margem de ameaça aumentada, aumente em +1. |
| Sombra Dançante | DES 16+ | Você entende a dança da batalha. +1 Evasão permanente, +1 nível de treinamento em defender |
| Reflexos de Serpente | DES 16+ | 1x/Curto: Force um ataque que te acertaria a causar metade do dano(pode ser declarado após a rolagem) |
| Passos do Vento | DES 16+ | Seu movimento aumenta em +3 m. Você não provoca ataques de oportunidade. Adicionalmente, saltar custa 1 ação. |
| Paciência | DES 16+ | Os primeiros golpes são apenas para distrair. Ao errar um golpe contra um alvo pode gastar 5 Stamina como ação livre para adicionar *Exposto* ao alvo. |
| Artilharia | DES 16+ | +2 em Atacar com armas à distância. Críticos de armas à distância, removem 1 de armadura do alvo até o fim do combate. Adicionalmente, Ignore desvantagem por cobertura parcial ou leve. |
| Dedos de Ladrão | DES 16+ | Aumente 2 níveis de treinamento em Crime. Você pode tentar furtar objetos de alvos em combate como 1 ação, desde que não estejam os utilizando. Adicionalmente, ao estar em combate, você sempre tem vantagem em Crime. |
| Rapino | DES 16+ | Aumente 2 níveis de treinamento em Enganação. Você não sofre dano de queda de altura inferior a 100 metros e Sempre cai de pé nessas circunstâncias. |
| Corpo Escorregadio | DES 16+ | Aumente 2 níveis de treinamento em Reflexos. +3 em testes para escapar de Agarrões, amarras ou restrições físicas não místicas. Adicionalmente, você pode usar sua reação para somar sua pericia Defender em qualquer teste de Reflexos. |
| Sombras | DES 16+ | Aumente 2 níveis de treinamento em Furtividade. Você pode se esconder mesmo sendo observado se houver sombras ou cobertura leve. Adicionalmente, você gasta -1 ação para se esconder (min. 1) |
| Terceiro Olho | DES 16+ | Ao acertar dois ataques a distância na mesma criatura, você pode gastar 5 de stamina para realizar outro como ação livre na mesma criatura. |
| Esquiva Abissal | DES 16+ | +1 Nível de Treinamento em Defender. Você pode gastar 10 de Stamina como ação livre para recuperar sua reação. 1x/Curto |

### CON (12)
| Carta | Requisito | Efeito |
|---|---|---|
| Carne de Pedra | CON 16+ | Reduza todo dano recebido em 5 (mínimo 1) ; Ae(5, todos) Exceto: Força e Primordial |
| Coração Imortal | CON 16+ | 1x/Semana: Ao ser reduzido a 0 Saúde, volte com 50% da Saúde máxima automaticamente |
| Sangue Regenerador | CON 16+ | Recupere Mod. Con Saúde por rodada durante combate (no início do seu turno) |
| Pulmões Titânicos | CON 16+ | +3d12+8 Saúde máxima permanente |
| Coração da Dor | CON 16+ | Aumente 2 níveis de treinamento em Fortitude. Você pode reagir a ataques eminentes com uma nova reação, Aceitar a Dor: role um teste de Fortitude, caso o dano (Antes de quaisquer resistências) seja inferior ao seu teste, ignore o dano. |
| Resistência Arcana | CON 16+ | Escolha 1 tipo de dano atípico(Fogo, Gelo, Ácido, Elétrico, Trovejante, Veneno, Necrótico, Psíquico, Radiante). Você tem Resistência a ele. Adicionalmente, ganhe 2 de armadura específica em todos os outros tipos de dano. Exceto: Força e Primordial |
| Cicatrização Acelerada | CON 16+ | Descansos curtos curam 2x mais Saúde. Descansos longos sempre curam saúde completamente. Adicionalmente, recebe +1d4 de cura de todas outras fontes, a não ser descansos. |
| Pacto Sanguinário | CON 16+ | 1x/dia: Recupere metade de sua Stamina como ação livre, mas sacrifique saúde atual equivalente a metade da sua Saúde máxima. |
| Guardião Teimoso | CON 16+ | Ao estar em 0 Saúde, você perde apenas 5% da Saúde máxima por rodada (ao invés de 10%). Adicionalmente, testes de medicina para lhe salvar da morte tem CD 10. (Ao invés de 20) |
| Bárbaro | CON 16+ | Aumente +1 pontos de atributo em Força e Constituição, porém, reduza -1 pontos de atributo em Inteligência e Sabedoria |
| Escamas Reativas | CON 16+ | Você ganha escamas reativas que se adaptam rapidamente ao serem atacadas. Provendo 10 de Ae ao último tipo de dano atípico que você recebeu APÓS o ataque. |
| Corpo Duro | CON 16+ | Qualquer ataque contra você causa 1 de dano de força instantaneamente ao atacante. Adicionalmente, ganhe +1 de comodidade em todos os descansos longos permanentemente. |

### INT (12)
| Carta | Requisito | Efeito |
|---|---|---|
| Mente Tática | INT 16+ | Ao rolar qualquer perícia, você pode pagar 5 de Stamina para aumentar 1 nível de treinamento nela. (Acumulativo) |
| Olhos Analíticos | INT 16+ | 1x/combate (1 ação): Descubra Evasão exata, Saúde atual, resistências, vulnerabilidades e 1 habilidade especial de 1 criatura visível |
| Cérebro Enciclopédico | INT 16+ | Aumente 2 níveis de treinamento em Conhecimento. Adicionalmente, Você pode fazer testes de Conhecimento sobre qualquer tópico. |
| Comandante de Guerra | INT 16+ | Aumente 2 níveis de treinamento em Motivar. Você pode usar a perícia motivar no lugar de Convencer. Adicionalmente, 1x/rodada (1 ação): Um aliado em 9m ataca imediatamente como reação com +2 em Atacar. |
| Contra-Mágica Instintiva | INT 16+ | Ao ver magia sendo castada, role Conhecimento CD 15. Sucesso: você sabe exatamente o que faz E pode gastar sua reação para dar +5 em Resistência ao alvo dela. Adicionalmente, aumente sua CD de classe em +1 |
| Decifrador Universal | INT 16+ | Aumente 2 níveis de treinamento em Investigação. Você pode ler QUALQUER idioma escrito após 1 minuto de estudo. Adicionalmente, Você pode fazer testes de Investigação sobre qualquer tópico. |
| Memória Absoluta | INT 16+ | Você lembra perfeitamente de tudo. Aumente +1 ponto de atributo em inteligência. Você nunca esquece rostos, nomes ou informações, podendo perguntar ao mestre qualquer coisa que vivenciou a partir de agora. |
| Felizardo | INT 16+ | Você recebe +10% de Sins de todas as fontes. Adicionalmente, ao rolar d100’s quando saquear uma criatura morta POR VOCÊ, sempre some +10 ao dado |
| Bestiário | INT 16+ | Ao combater uma criatura já conhecida, os ataques contra ela ignoram 3 de Armadura, causam +1d6 de dano e possuem +2 Atacar a todos os aliados em até 18 m de você. |
| Equilíbrio Etérico | INT 16+ | Ao estar com 100% de 2 Status você tem +2 em todas as perícias. |
| Estudo Intenso | INT 16+ | Adicione +2 ao seu CD de classe. Adicionalmente, escolha uma perícia, aumente 1 nível de treinamento nela. |
| Campeão de Vidro | INT 16+ | Você acumula dano a cada combate em que você não perde saúde. +1 de dano de Força por combate sem perder saúde. Ao perder qualquer saúde, você perde 5 pontos de dano acumulados nessa carta instantaneamente e recebe +5 de dano Primordial. |

### SAB (12)
| Carta | Requisito | Efeito |
|---|---|---|
| Olhos do Oráculo | SAB 16+ | Você não pode ser Desprevenido. Aumente 2 níveis de treinamento em Percepção. Você pode ver criaturas invisíveis como silhuetas borradas |
| Premonição de Batalha | SAB 16+ | 1x/sessão: Você pode escolher substituir sua Iniciativa por 30 E dar +2 em Iniciativa para todos os aliados em 12m |
| Empatia Transcendental | SAB 16+ | Aumente 2 níveis de treinamento em Intuição. Você pode sentir emoções ocultas e detectar se alguém esta mentindo automaticamente. Adicionalmente, você pode realizar testes de Intuição para qualquer interação. |
| Rastreador Sobrenatural | SAB 16+ | Aumente 2 níveis de treinamento em Sobrevivência. Você pode rastrear qualquer criatura por até 7 dias. Você sabe direção e distância aproximada de alvos que você já rastreou |
| Mãos Abençoadas | SAB 16+ | Como uma ação, você pode tocar aliados e realizar teste de Medicina CD 12. Sucesso: cure 3d6+SAB de Saúde. Você pode fazer isso em até 3 aliados por descanso longo |
| Comunhão | SAB 16+ | Você fala a Língua Natural. Você pode pedir 1 favor pequeno a criaturas naturais 1x/dia (elas cooperam se não for perigoso) |
| Sexto Sentido | SAB 16+ | 1x/Descanso Longo): Ao você ou aliado em 9m ser alvo de ataque, como ação livre pode fazer o atacante rerolar com desvantagem |
| Guardião da Natureza | SAB 16+ | Escolha 2 tipos de terreno (Floresta, Montanha, Deserto, Urbano, Subterrâneo, Naval). Neles, você e aliados em 9m têm +3 em Percepção, Sobrevivência, Furtividade e Movimento |
| Instinto do Predador | SAB 16+ | Ao rolar Iniciativa, você pode declarar 1 criatura como "Presa". Você tem +3 em Atacar, +2 em Defender e +1d6 de dano contra ela. Você pode trocar de presa como ação livre |
| Meditação Transcendental | SAB 16+ | Você ganha novo tipo de ação: Meditação Transcendental (30min). Recupere 2d6 Stamina e 2d6 Éter |
| Vidente | SAB 16+ | 1x/sessão: Faça 1 pergunta "sim/não" ao Mestre sobre algo que acontecerá nos próximos 10 minutos. Ele responde honestamente. Você pode usar a resposta para se preparar |
| Santuário Espiritual | SAB 16+ | Aliados em 9m de você têm +3 em todos os testes de Resistência (Fortitude, Vontade, Reflexos) e são imunes a Amedrontado e Enfeitiçado enquanto você estiver consciente |

### Raras (59)
| Carta | Requisito | Efeito |
|---|---|---|
| Carne e Aço | FOR 18+, CON 18+ | Você tem Resistência a Dano Ordinário (Contundente, Perfurante, Cortante). Seus ataques corpo a corpo causam +1d6 de dano de Força adicional. |
| Berserker Imortal | FOR 16+, CON 16+ | Ative como 1 ação livre, durante 1 rodada você tem Resistência a todo dano(Exceto: Força e Primordial) E causa o dobro de dano em ataques corpo a corpo. 1x/Descanso Longo |
| Punhos do Abismo | DES 20+, SAB 14+ | Seus ataques desarmados causam 2d8 + DES + SAB de dano Necrótico. Você cura metade do dano causado por ataques desarmados. |
| Carnificina | FOR 18+, DES 16+ | Ao matar uma criatura com ataque corpo a corpo, você pode imediatamente andar 1,5 m e atacar outra criatura adjacente a ela (sem PMA). Acumulativo 3x. Críticos corpo a corpo curam você em 1d6 Saúde. Adicionalmente, você pode comer carne de qualquer criatura, conta como Item:Comida |
| Carrasco | FOR 18+, INT 16+ | Seus críticos corpo a corpo matam instantaneamente criaturas, com CR iguais ou menor que seu nível, com menos de 25% de Saúde caso elas falhem em um teste de Fortitude (CD = seu CD de classe) |
| Colossus Primordial | FOR 22+ | Você aumenta 1 categoria de tamanho. Seus ataques corpo a corpo causam +1d6 de dano de Força, você tem +5 Ar natural. Adicionalmente, você pode destruir estruturas/objetos menores que você automaticamente (sem teste). |
| Devastador de Enxames | FOR 20+, CON 16+ | Seus ataques corpo a corpo causam dano em área de 1,5m de raio (todos as criaturas adjacentes), podendo acertar aliados. Ao acertar crítico, cause uma onda de choque de 3m de raio a partir do alvo que derruba todos, incluindo aliados (Fortitude CD = seu CD nega). |
| Lenda Monge | DES 22+, SAB 16+ | Seus ataques desarmados causam 1d12 + DES + SAB de dano um dano atípico(Sem ser de Força ou Primordial) a sua escolha(Escolha ao pegar essa carta). Seus ataques desarmados ignoram resistência, mas não imunidade, a esse tipo de dano. 1x/dia: Você pode desferir um ataque desarmado que causa 6d12 de dano do tipo escolhido, porém o ataque ainda está suscetível a erro. |
| Assassino Fantasma | DES 22+, INT 16+ | Críticos em ataques furtivos podem matar instantaneamente criaturas de CR igual ou inferior ao seu nível que estejam com menos de 50% de Saúde (Reflexos CD = seu CD nega). Contra criaturas de nível superior, cause +2d6 de dano de Força adicional quando elas estiverem abaixo de 50% de Saúde. |
| Lâminas Dançantes | DES 22+, INT 16+ | Ao empunhar duas armas de uma mão, você pode atacar com ambas usando apenas o custo de ação de uma das armas(a de maior custo de ações). Ambos os ataques usam a mesma penalidade de multi-ataque. |
| Velocista Umbral | DES 24+ | Ao matar uma criatura, você ganha +1 Ação nessa rodada (1x/Turno). Adicionalmente, ao realizar a ação de Acelerar, você ganha +6 m de movimento (ao invés de ganhar apenas +3m) |
| Mestre dos Mil Cortes | DES 20+, INT 14+ | Ao atacar uma criatura adjacente a você, você também ataca todas as outras criaturas adjacentes a você simultaneamente com a mesma rolagem de ataque |
| Predador Supremo | DES 18+, SAB 18+ | Você acerta críticos em 18-19-20 no d20(Caso já possua margem de ameaça aumentada, aumente em +2). Aumente 1 nível de treinamento em Iniciativa. Adicionalmente, Você causa +2d6 de dano de Força contra alvos que ainda não agiram nesta rodada. |
| Fênix Imortal | CON 18+, SAB 16+ | 3x/campanha: Ao morrer, você revive com 50% de Saúde máxima após 1 rodada. Ao reviver, você explode em chamas sagradas causando 4d12 de dano Radiante em 6m (você é imune). Criaturas aliadas na área curam 3d6 de Saúde. |
| Pele Mística Adaptativa | CON 20+, INT 16+ | Toda vez que você terminar um combate no qual recebeu dano, você ganha permanentemente +2 Armadura Específica (Ae) contra cada tipo de dano recebido. Máximo: Ae(10) por tipo de dano |
| Escamas de Dragão | CON 20+, FOR 16+ | Sua pele se torna coberta por escamas dracônicas. Você ganha +3 Armadura permanente. Toda vez que você é atingido por um ataque corpo a corpo, o atacante recebe 2d8 de dano (escolha: Fogo, Gelo, Ácido, Elétrico ou Veneno ao pegar esta carta) |
| Organismo Mutagênico | CON 22+ | Você regenera mod. Constituição Saúde por turno (incluindo fora de combate). Membros perdidos regeneram completamente em 1 dia. Você é imune a Maioria das Doenças, Resistente a dano de Veneno e Ácido. |
| Duas Mangas | INT 22+, DES 16+ | Escolha uma escola do Primórdio. Você pode reduzir o custo de ação de qualquer magia dessa escola em 1 (mínimo 1 ação) como ação livre, pagando 5 Éter e 5 Stamina ao canalizá-la. |
| O Mestre | INT 20+, SAB 20+ | Escolha 3 perícias que você tenha proficiência, ao menos, Treinado. Essas perícias melhoram automaticamente para proficiência Lendário. Adicionalmente, você pode gastar 5 de Stamina para rolar perícias não treinadas com vantagem. |
| Modo Análise | INT 20+, DES 16+ | Como 1 ação, você observa as armaduras, resistências e imunidades de uma criatura. Logo em seguida, como ação livre, você pode gastar 10 de Stamina, para remover uma armadura, resistência ou imunidade da criatura até o fim do combate. |
| Senhor do Tempo | INT 18+, DES 18+ | 1x/Combate: Você pode repetir seu turno inteiro imediatamente após terminá-lo. Você não recupera recursos já gastos no turno original, mas pode fazer ações diferentes |
| Arquiteto do Destino | 22 SAB+ | Você pode anular completamente a rolagem de dado de qualquer um na mesa 2x/dia, imediatamente após ter sido revelado o resultado, fazendo-a rolar novamente. Adicionalmente, 1x/campanha: Rejogue qualquer evento que aconteceu nos últimos 10 minutos. Você e seus aliados lembram das duas versões da realidade. O Mestre narra a nova linha temporal |
| Contra-Teurgo Supremo | INT 20+, CON 16+ | Você pode dissipar magias canalizadas e que estão sendo canalizadas instantaneamente como reação com +10 no teste de Místico 3x/dia. Você absorve metade do Éter que foi gasto na magia dissipada caso suceda. Adicionalmente, ao causar dano em um teurgo, absorva metade do dano como éter. |
| Cérebro Transcendente | INT 22+ | Você ganha +1 nível de treinamento em todas as perícias. Ao gastar 5 Stamina, como ação livre, você pode somar seu Mod. Inteligência em qualquer teste de perícia. |
| Grande Éter | INT 22+, SAB 18+ | Seu Éter máximo é dobrado. Ao castar magias de dano, como ação livre, você pode gastar Éter adicional para adicionar +1 de dano de Força a cada 1 pontos de Éter adicionais gastos. |
| Olhar Dimensional | SAB 20+ | Você consegue conversar telepaticamente com qualquer criatura em até 9m de você, além disso, por meio do místico ela consegue te responder. Você pode 1x/rodada, por via de um único olhar como 1 ação, aplicar um dos efeitos a seguir em qualquer criatura em até 9m: Olhar do Abismo (2d6 dano Primordial), Olhar do Místico (Vontade CD = seu CD ou fica Paralisada), Olhar da Matéria (Empurre 1,5m livremente para qualquer lado). Utilizar qualquer efeito custa 5 Stamina |
| Súdito da Loucura | SAB 18+ | Para você, a loucura é apenas um instrumento. Você pode gastar 10 de Éter como ação livre para ter *vantagem* na próxima perícia rolada. |
| Devorador de Almas | INT 16+, SAB 16+ | Ao matar uma criatura inteligente, você pode absorver 1 habilidade especial dela permanentemente (máximo 3 habilidades acumuladas simultaneamente). Você pode descartar habilidades antigas para absorver novas. |
| Olhos de Velúria | SAB 18+, INT 16+ | Ao observar uma magia sendo canalizada, você pode gastar sua reação, para que no seu próximo turno com suas 3 ações você consiga canalizar a magia observada perfeitamente. Você gasta a mesma quantidade de éter e não aprende a magia. Adicionalmente, Você pode ver através de paredes e objetos sólidos em até 18m. Você vê criaturas invisíveis, escondidas e etéreas perfeitamente. Você detecta automaticamente ilusões, disfarces e magias. |
| Guardião Eterno da Vida | SAB 20+, CON 16+ | Aliados em 18m de você não podem morrer através da condição Morrendo (ainda podem ser mortos por dano direto). Quando um aliado está caído, você pode matar o inimigo que o derrubou para instantaneamente revivê-lo com 50% de Saúde (1x/Combate). |
| Santuário Intocável | SAB 18+, CON 14+ | Você emana uma aura de 9m. Aliados dentro dela têm +5 em todas Resistências, Armadura Específica(5) contra todo Dano Átipico(Exceto:Força e Primordial) e são imunes a condições mentais (Enfeitiçado, Amedrontado, Confuso, Atordoado). Adicionalmente, inimigos dentro da aura têm desvantagem em atacar você. |
| Mestre Teurgo Supremo | INT 22+, 18 SAB, 16 DES+ | Você pode castar 2 magias por turno. Escolha 2 Escolas do Primórdio: Você pode gastar 5 de Stamina como ação livre para canalizar magias dessas escolas com -1 ação (min. 1). Adicionalmente, aumente seu CD de classe em +2 |
| Tanque Absoluto | FOR 16+, CON 16+, SAB 16+ | Você recebe Ae(10, Todos; Exceto: Força e Primordial). Você fica imune às seguintes condições: Atordoado, Caído, Lento, Enraizado, Confuso, Amedrontado, Enfeitiçado. |
| Deus da Guerra | FOR 18+, DES 18+, CON 18+ | Você recebe vantagem nas perícias Atacar e Defender. Você tem Resistência a dano ordinário. Você acerta críticos em 19-20 no d20(Caso já tenha margem de ameaça aumentada, aumente em +1) |
| Onisciencia de Mundarak | INT 20+, SAB 20+, DES 16+ | Você sabe instantaneamente tudo sobre todas as criaturas em 9m (Saúde atual/máxima, habilidades especiais, intenções imediatas, fraquezas). Você sempre age primeiro em combate (como se tivesse tirado 35 em Iniciativa). Adicionalmente, você pode sentir a energia de qualquer local do planeta, dentre elas: Plenitude, Sangria, Brutal. |
| Artista Marcial Supremo | CON 14+, DES 20+, SAB 20+ | Ao ser atacado você sempre pode retaliar como ação livre. Adicionalmente, aumente 1 dado de dano em seu ataque desarmado. |
| Destruidor de Mundos | FOR 22+, INT 14+, CON 16+ | 1x/Semana: Seu próximo ataque causa 12d20 de dano Primordial em área de 18m. Todos os alvos na área exceto você são afetados. Você fica com a condição Exausto após usar. Adicionalmente, todos os seus ataques causam +1d10 de dano de Força. |
| Imortal Relutante | CON 18+, SAB 18+, INT 18+ | Você não pode morrer permanentemente. Ao morrer, você revive após 1d4 dias em um local seguro determinado pelo Mestre e perde 1 nível. Ao chegar a nível 0, você morre definitivamente |
| Avatar do Caos | FOR 16+, DES 16+, INT 16+ | Todos os seus testes de d20 usam 2d20 simultaneamente e você escolhe qual resultado usar(Vantagem). Se tirar 1 em ambos os dados: Falha Crítica e você perde esta carta permanentemente. Se tirar 20 em ambos os dados: Sucesso Primordial (êxito perfeito e inacreditável, narrativamente épico). Adicionalmente, seus críticos causam dano Tríplo (Caso já causem crítico maior que o dobro, aumente o multiplicador em +1) |
| Fúria Titânica | FOR 20+, CON 18+ | Cada ataque corpo a corpo que você acertar após o primeiro no mesmo turno causa +1d8 de dano de Força cumulativo (2º acerto: +1d8; 3º: +2d8; e assim por diante). O acúmulo zera no fim do seu turno. |
| Investida Cataclísmica | FOR 22+, CON 16+ | Ao usar a ação Acelerar e atacar corpo a corpo no mesmo turno, cause +1d6 de dano de Força para cada 3m percorridos em linha reta até o alvo (máx. +6d6). Se o alvo for de tamanho igual ou menor, ele fica Caído (Fortitude CD = seu CD de classe nega). |
| Pele de Basalto | FOR 16+, CON 20+ | Reduza todo dano recebido em 6 (mínimo 1; exceto Primordial). Metade do dano reduzido por esta carta é refletido como dano de Força ao atacante, caso ele esteja adjacente a você. |
| Esmagador de Linhas | FOR 18+, CON 16+ | 1 Ação, (5 Stamina): desfira um único ataque corpo a corpo contra todas as criaturas em uma linha reta de 9m à sua frente, usando a mesma rolagem de ataque. Alvos acertados são empurrados 1,5m para trás. |
| Estocada Perfeita | DES 20+, INT 14+ | Como ação livre, gaste 10 de Stamina como parte de um ataque: esse ataque ignora a Evasão e a Armadura do alvo e causa +3d6 de dano. 1x por rodada. |
| Sangria Precisa | DES 18+, INT 16+ | Seus críticos corpo a corpo aplicam Sangramento 1. O dano do seu sangramento aumenta de 1d4 → 1d6. |
| Muralha de Aço | DES 18+, CON 16+ | 1x/rodada, quando um aliado adjacente a você for atacado, você pode usar sua reação para Defender some sua perícia Defender à Evasão do aliado contra aquele ataque; ou Retaliar: Caso suceda o aliado desfere 1 ataque como ação livre com você. |
| Duelista Fantasma | DES 22+, INT 16+ | 3x/Longo, como ação livre gaste 10 de Stamina e teletransporte-se para um espaço adjacente a uma criatura visível em até 9m e ataque-a imediatamente com vantagem. Se acertar, cause +2d6 de dano de Força. |
| Contra-Golpe Encadeado | DES 20+, CON 14+ | Quando uma criatura adjacente erra um ataque corpo a corpo contra você e você usa sua reação para contra-atacá-la, Se o contra-ataque reduzir a criatura a 0 de Saúde, você recupera essa reação (encadeável, máx. 3x por rodada). |
| Chuva de Flechas | DES 20+, SAB 14+ | 1x/Turno (custa 5 de Stamina): Com 1 ação, seu próximo ataque dispara uma saraivada em uma área de 6m de raio dentro do seu alcance normal. Criaturas na área sofrem seu dano de arma à distância; Reflexos (CD = seu CD de classe) reduz à metade. |
| Tiro Executor | DES 18+, SAB 16+ | Ataques à distância contra criaturas com 25% ou menos de Saúde forçam Reflexos (CD = seu CD de classe). Falha: a criatura é reduzida a 0 de Saúde. Sucesso: sofre +2d6 de dano de Força. 1x por rodada contra o mesmo alvo. |
| Marca de Caça Etérica | DES 16+, SAB 16+ | Como ação livre 1x/rodada, marque uma criatura visível (apenas 1 marca por vez). Você e seus aliados causam +1d6 de dano de Força a ela. Você sempre sabe a direção e a distância aproximada da criatura marcada enquanto ela viver. Adicionalmente, a criatura marcada tem -5 em qualquer rolagens contra você. |
| Predador das Sombras | DES 18+, SAB 18+ | Ao atacar a partir de Furtividade ou de cobertura, o ataque ignora a Armadura do alvo e causa +2d6 de dano de Força. Após o ataque (acertando ou não), mova-se até 3m sem provocar ataques de oportunidade. |
| Rajada Perfeita | DES 20+, SAB 18+ | Gaste 10 de Stamina como 2 ações: desfira 4 ataques distribuídos entre criaturas ao seu alcance, cada um com sua rolagem de ataque normal. A penalidade de multi-ataque não se aplica a esta rajada. |
| Corrente Elemental | SAB 20+, CON 16+ | Seus ataques desarmados causam +1d8 de dano elemental à sua escolha (Fogo, Gelo, Elétrico ou Ácido; escolha ao pegar esta carta). Ao acertar, recupere 1d4 de Saúde. |
| Ritmo Incansável | SAB 18+, DES 16+ | Ao acertar 2 ou mais ataques na mesma rodada, recupere 5 de Stamina (1x/rodada). Enquanto sua Stamina estiver acima de 50%, seu movimento aumenta em +3m. |
| Bombardeio Arcano | INT 20+, SAB 14+ | Ao castar uma magia de dano de alvo único, você pode pagar 10 de Éter + 2x o Éter gasto na magia para castar novamente a mesma magia no mesmo alvo como 1 ação. 1x por rodada. |
| Lâmina Etérea | INT 18+, DES 16+ | Ao atacar com uma arma, como uma ação livre canalize até 10 de Éter para causar +2 de dano por Éter gasto, do tipo de dano de uma magia que você conheça. 1x por ataque. |
| Aniquilação Teúrgica | INT 22+, SAB 18+ | 1x/dia custa metade do seu éter máximo: libere uma explosão em até 18 m com raio de 12m de raio causando 6d20 de dano do tipo de uma magia que você conheça. Reflexos (CD = seu CD de classe) reduz à metade. Você fica Exausto 1 após o uso. |
| Fenda Dimensional | INT 18+, SAB 16+ | 1x/combate: abra uma fenda em um ponto visível em até 18m que dura 3 rodadas. Criaturas em 4,5m são puxadas 3m em direção ao centro (Fortitude CD = seu CD de classe nega) e a área vira terreno difícil por 1 rodada. Criaturas dentro do raio de 3 m recebem 3d6 de dano de Força ao início do turno. |

### Abismo — Dores (18) [coluna "Ganho de Dor"]
| Dor | Nome | Penalidade |
|---|---|---|
| 1 | Estabanado | Você é naturalmente desligado, sempre possui a condição *Desorientado*. |
| 1 | Gulão | Você é gordo. Precisa do dobro de comida para sobreviver. Gasta 2 Comidas para descansar. |
| 1 | Bagunceiro | Você é uma zona. Você pode carregar 50% menos bugigangas e equipamentos. |
| 2 | Orgulhoso | Você é corajoso ou apenas orgulhoso. Você não pode fugir de combates. |
| 2 | Tímido | Você é introvertido e tem dificuldade em se enturmar. -5 em todas as interações sociais. |
| 2 | Perdedor | Você tem azar, nasceu pra perder. Você falha criticamente em 1-2 na rolagem natural. |
| 3 | Mente Fraca | Você é perturbado, inseguro. +100% gasto de Éter global. |
| 3 | Murcho | Você é frágil, magrelo, sem constituição. -4 nos atributos Força e Constituição |
| 3 | Óbvio | Você é muito fácil de acertar, não faz esforço algum para se defender. -5 Evasão. |
| 4 | Memória Ruim | Você esquece de tudo. Escolha 2 perícias que você é treinado, você perde o treinamento nelas. |
| 4 | Sangue Caro | Você é mesquinho e mimado. Você recupera 50% menos de Saúde de todas as fontes. |
| 4 | Perdido | Você não consegue se orientar direito. Não pode ajudar em jornadas e aumenta os pontos de sucesso necessários em +1. |
| 5 | Sem Membro | Você nasceu sem ou perdeu um membro do seu corpo... Isso dificulta sua vida bastante. Braço: -4 Destreza e Força, não pode usar armas de duas mãos nem à distância. Perna: -6 Destreza, -50% Movimento, não pode usar a ação Acelerar. |
| 5 | Cego | Você nasceu ou se tornou cego. Você tem permanentemente a condição *Cego*. |
| 5 | Gringo | Você não nasceu para negociações. +100% Sins gastos ao comprar itens ou equipamentos. OBS: Você deve comprar seus próprios itens, não pode pedir para um companheiro comprar por você. |
| 6 | Burro | Você não raciocina nem aprende direito. -50% Xp de todas as fontes. |
| 6 | Sacrifício Vivo | Você escapou de um ritual de sacrifício, onde você era a oferenda. 50% menos de Saúde e Éter máximos. |
| 6 | Exigente | Você não suporta falhar. Ao falhar qualquer teste, -1 Stamina e Éter. Falhar criticamente, -1 Stamina e Éter Máximos. |

### Abismo — Benefícios (23) [coluna "Gasto de Dor"; cabeçalho da 3ª coluna diz "Penalidade" (erro: é benefício)]
| Custo | Nome | Efeito |
|---|---|---|
| 1 | Olhos da Noite | Você enxerga perfeitamente no escuro até 18m. |
| 1 | Olhar do Vazio | Força uma criatura que te veja a contemplar o vazio, Vontade contra seu CD ou fica *Paralisada* por 1 rodada. (1x/Descanso Longo) |
| 2 | Pele Morta | Você não sangra e é incombustível. Imune a *Sangramento* e *Em Chamas*. |
| 2 | Benção de Poder | Você ganha uma benção física ou mental. +1 Ponto de Atributo. |
| 2 | Mestre das Masmorras | Você pode sentir a presença de criaturas vivas em 30m através de paredes e obstáculos. Adicionalmente, você sempre sabe se um local explorável está completamente saqueado ou se ainda existem camaras não exploradas. |
| 2 | Assustador | Ao ser atacado, o inimigo deve suceder um teste de Vontade contra seu CD ou fica *Amedrontado* por 1 rodada. A criatura fica imune ao suceder ou após o efeito. |
| 3 | Saciado | Você não precisa comer ou beber. (Mas ainda consegue, relutantemente) |
| 3 | Sussurador | Você pode se comunicar telepaticamente com qualquer criatura que veja em até 9m. |
| 3 | Devorador de Almas | Ao tocar uma criatura morta, você pode absorver um fragmento de conhecimento: ganhe 1 nível de Treinamento temporário em 1 perícia que ela tinha por 24h. |
| 3 | Guardião da Morte | Quando um aliado em 9m seria reduzido a 0 Saúde, você pode usar sua reação para transferir o dano para você. 1x/descanso longo. |
| 3 | Translocação | Você pode se teletransportar em até 9 m como 1 ação. 1x/Descanso Longo |
| 3 | Frio | Seus ataques causam +1d6 de dano de Frio. Criaturas acertadas têm -1,5m de movimento até o fim do próximo turno delas. |
| 3 | Canibal | Você recupera 2d6 Saúde ao comer carne de criaturas que acabou de matar e consegue ver memórias da vida desta criatura. |
| 4 | Devorador de Magos | Ao matar uma criatura mágica ou conjuradora, você pode absorver sua essência (1 ação). Ganhe acesso a 1 magia que ela conhecia por 1 dia ou até ser utilizada pela primeira vez. Você pode conjurar essa magia sem um foco designado. |
| 4 | Dom da Ressureição | Ao morrer, você revive uma vez e perde 10 de Saúde ou Stamina máxima. Você revive após 1d4 horas, com memórias fragmentadas e desorientado. |
| 4 | Senhor das Sombras | Você fica invisível em penumbra ou escuridão. Pode se esconder como ação livre nessas condições. |
| 4 | Pacto Macabro | Você pode gastar Saúde no lugar de Stamina ou Éter para qualquer técnica ou magia. (1 Saúde = 1 Stamina ou Éter) |
| 6 | Lenda Viva | Você é extremamente ágil e perspicaz. Nasceu para se aventurar. Possui +1 Ação por rodada. |
| 6 | Mente Fragmentada | Você tem duas consciências. Você ocasionalmente ouve a "outra voz" disputando com você. Ao conjurar 1 magia, pode conjurar outra como ação livre. |
| 6 | Avatar do Vazio | Sua alma é parcialmente vazia e não é inteiramente viva como a de outros. Ganhe resistência a todos os tipos de dano (exceto Radiante e Primordial), imunidade a condições físicas (Embriagado, Sangramento, Lento, Atordoado, Paralisado, Desorientado, Enjoado, Envenenamento). |
| 6 | Esquiva Lendária | Você é extremamente habilidoso em evadir ataques, seja desviando deles ou resistindo da melhor maneira possível. Você ganha +5 Evasão e +1 Reação Máxima. |
| 7 | Clone Odioso | Você tem um clone quase exatamente igual a você que compartilha pensamentos, sensações, personalidade, tecnicas e conhecimento. Você pode teletransportar como 3 ações para ele a qualquer momento. E pode controlá-lo livremente. Ele é extremamente igual a você, porem possui faíscas de independência e individualidade. |
| 8 | Desejo Sombrio | Você pode conjurar qualquer magia de nível 1-5 (mesmo que não saiba) ou alterar um evento recente (até 1 minuto atrás) retroativamente. O Mestre decide as consequências. Usar isso pode atrair atenção indesejada. 1x/Campanha. |

## 5. Raras que usam recurso travado por classe
Busca regex (FLUXO|Fluxo|Munição|Ki|Fúria|Reagente|Pólvora) nos efeitos das 59 raras: **nenhuma ocorrência**. Todas usam Stamina, Éter, Saúde, Ações, Reações ou "CD de classe". Regra de design respeitada. Nota: "Lenda Monge" e "Artista Marcial Supremo" são temáticas de Monge mas mecânica usa só ataque desarmado/ação livre — OK.

## 6. Nomes próprios / ENTIDADES em cartas
- **Velúria** — Rara "**Olhos de Velúria**" (SAB 18+, INT 16+): "Ao observar uma magia sendo canalizada, você pode gastar sua reação, para que no seu próximo turno com suas 3 ações você consiga canalizar a magia observada perfeitamente…"
- **Mundarak** — Rara "Onisciencia de Mundarak" (INT 20+, SAB 20+, DES 16+): "…você pode sentir a energia de qualquer local do planeta, dentre elas: **Plenitude, Sangria, Brutal**." (site chama "Onisciência de Kha" — conflito de entidade.)
- **Primórdio** (escolas de magia) — "Duas Mangas": "Escolha uma escola do Primórdio"; "Mestre Teurgo Supremo": "Escolha 2 Escolas do Primórdio".
- **Língua Natural** — Universal-SAB "Comunhão": "Você fala a Língua Natural."
- **Plenitude / Sangria / Brutal** — tipos de "energia de local" (Onisciencia de Mundarak). Conceito de lore não definido nesta página.
- Termos de sistema citados: PMA (penalidade de multi-ataque), Ae / Armadura Específica, "Ar natural", condições *Exposto*, *Desorientado*, *Morrendo*, *Sangramento 1*, *Exausto 1*, Item:Comida, "comodidade" de descanso, "pontos de sucesso" de jornada.

## 7. INCONSISTÊNCIAS (citação literal)
1. **Bloco-resumo vs tabelas**: "**Total de Cartas:** 130 … Universais: 10 cartas … **Raras: 60 cartas**" — tabelas têm Universais **8**, Raras **59**, total 127.
2. **Requisito do resumo vs cabeçalho das colunas**: resumo diz "Força: 12 cartas (FOR 14+)" etc.; cabeçalhos das colunas dizem "*Requisito: FOR 16+*", "DES 16+", "CON 16+", "INT 16+", "SAB 16+". Texto de sorteio: "um atributo é considerado alto quando está em **14 ou mais**". Três valores em conflito (14 vs 16).
3. **"5 cartas" vs "Sorteio das 4 Cartas"**: "5** cartas** aparecem diante de você" / "**Você escolhe 1 carta GRATUITAMENTE** dentre as 5 reveladas" vs título "### **Sorteio das 4 Cartas:**". Os ranges "1-2 universal, 1-3 atributo, 1 rara" somam 3–6.
4. **Progressão**: "**8-11 Cartas do Limiar** escolhidas" — com 16 pontos e custo 2/3/4 por carta extra, o máximo real é 4 grátis + (16 pts → ~6–8 extras) ≈ 10–12; e o mínimo é 4 (só grátis). Faixa não bate com a mecânica.
5. **Duplicata de nome**: "Devorador de Almas" (Rara) e "Devorador de Almas" (Abismo, Gasto 3).
6. **Formato de requisito**: "Arquiteto do Destino" → `22 SAB+`; "Mestre Teurgo Supremo" → `INT 22+, 18 SAB, 16 DES+` (padrão é `ATR NN+`).
7. **Raras com requisito 14+** apesar do cabeçalho "Múltiplos atributos altos" e pools individuais exigirem 16+: Punhos do Abismo (SAB 14+), Mestre dos Mil Cortes (INT 14+), Santuário Intocável (CON 14+), Artista Marcial Supremo (CON 14+), Destruidor de Mundos (INT 14+), Estocada Perfeita (INT 14+), Contra-Golpe Encadeado (CON 14+), Chuva de Flechas (SAB 14+), Bombardeio Arcano (SAB 14+).
8. **Cabeçalho da tabela de Benefícios do Abismo** diz "Penalidade" — conteúdo é benefício.
9. **Tipos de dano fora da lista canônica (§2 CLAUDE.md: 12 tipos, "Frio" não "Gelo")**: "Resistência Arcana" lista "Fogo, **Gelo**, Ácido…"; "Escamas de Dragão": "Fogo, **Gelo**…"; "Corrente Elemental": "Fogo, **Gelo**…" — vs Abismo "Frio": "+1d6 de dano de Frio". "Garras de Éter": "dano **Cortante**"; "Arremesso Brutal": "1d8 **Contundente**"; "Carne e Aço": "Dano Ordinário (Contundente, Perfurante, Cortante)" — subtipos de Ordinário não listados nos 12.
10. **Garras de Éter**: nome diz Éter, efeito é físico ("1d10 + SAB de dano Cortante") e escala com SAB numa carta de FOR.
11. **Sexto Sentido**: "1x/Descanso Longo):" — parêntese desbalanceado (typo).
12. **Bárbaro**: "Aumente +1 pontos de atributo em Força e Constituição, porém, reduza -1 pontos" — carta de CON altera 4 atributos; interação com Coluna de Titã/Memória Absoluta (+1 atributo) não definida.
13. **Desejo Sombrio**: "conjurar qualquer magia de nível **1-5**" — sistema tem só 4 níveis de magia (§2).
14. **Muralha de Aço**: frase truncada — "você pode usar sua reação para Defender some sua perícia Defender à Evasão do aliado".
15. **Abismo — nenhuma regra de Dor escrita** (limite, quando se adquire, se Dor sobra). Dores somam 63, Benefícios custam 86 — impossível pegar tudo.
16. Ênfase inconsistente: 20 cartas sem **negrito** no nome (Lutador de Rua, Limiar da Morte, Paciência, Artilharia, Sombras, Terceiro Olho, Coração da Dor, Bárbaro, Corpo Duro, Felizardo, Bestiário, Equilíbrio Etérico, Estudo Intenso, Lenda Monge, Onisciencia de Mundarak + todo o Abismo exceto Estabanado) — sugere adições posteriores.
17. **Site vs Notion**: site tem "Marca do Guerreiro" e "Postura de Ferro" (universais) que **não existem** no Notion; "Onisciência de Kha" INT 18+/SAB 18+ vs Notion "Onisciencia de Mundarak" INT 20+/SAB 20+.

## 8. PERGUNTAS PARA O PEDRO
1. Universais: Notion tem 8; site tem 10 (Marca do Guerreiro, Postura de Ferro). Removidas do Notion de propósito ou nunca foram adicionadas lá? Qual lado é canônico?
2. "Onisciencia de Mundarak" (INT 20+/SAB 20+) vs "Onisciência de Kha" (INT 18+/SAB 18+): qual nome e qual requisito? Quem/o que é Mundarak?
3. "Garras de Éter" vs "Garras de Aço" — qual nome? O dano é Cortante ou de Éter/Força? Por que escala com SAB numa carta FOR?
4. "Comunhão" vs "Comunhão Primordial"?
5. Requisito dos pools: 14+ (resumo e texto de sorteio) ou 16+ (cabeçalho das colunas)?
6. Reveladas 5 cartas ou 4? E qual é o mix exato (universal/atributo/rara)?
7. Faixa "8-11 cartas" ao nível 5 — manter ou recalcular?
8. Duplicata "Devorador de Almas" (Rara e Abismo): renomear uma?
9. Padronizar "Gelo" → "Frio" e tratar Cortante/Contundente/Perfurante como subtipos de Ordinário?
10. Regras do Abismo: como Dor é acumulada/gasta? Há limite? Pode-se pegar Dores em qualquer nível? Digno de uma seção de regras no site.
11. Desejo Sombrio "nível 1-5": erro (só existem 4 níveis)?
12. Bloco-resumo "130 / Raras 60 / Universais 10": atualizar no Notion para 127 / 59 / 8 (ou 129/10 se as 2 universais do site forem canônicas)?
13. Raras com componente 14+ (9 cartas): intencional?
14. Devo corrigir no site o typo "Éterico" → "Etérico" (Notion escreve "Etérico")?
