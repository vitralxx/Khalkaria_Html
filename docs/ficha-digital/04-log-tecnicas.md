# Log de técnicas — o que funciona na ficha (2026-09-27)

Pedido do Pedro na L19 (`03-respostas-pedro.md` §6): *"preciso de um log de todas as técnicas do sistema e se elas estão
funcionando na ficha interativa ou não"*. O exemplo dele é a **Muralha Viva** do Brutalista, que ainda diz que o treino de
Defender "aumenta de 3 em 3", embora Defender tenha virado dado.

## O que é

São quatro arquivos. Os JSON são a fonte; este documento é a leitura deles no dia de hoje, depois do sync do lote L com o
Notion e do CSV do Bazar com o L38.

| Arquivo | O que tem | Quem mantém |
|---|---|---|
| `docs/ficha-digital/log-tecnicas.json` | Uma entrada por técnica (382), com as checagens mecânicas, os achados de regra, a resposta do balanceamento a cada achado e o status | Gerado por `python tools/log_tecnicas.py` (determinístico, sem rede, ~2 s) |
| `docs/ficha-digital/log-tecnicas-achados.json` | 160 achados de regra conferidos (trecho verbatim, regra atual com fonte, gravidade, destino) e os 2 descartados, com o motivo | Leitura humana; o script só lê |
| `docs/ficha-digital/log-tecnicas-respostas.json` | A resposta do balanceamento a cada achado, os princípios de leitura G1–G15 e as perguntas T1–T19 ao Pedro, com recomendação | Cópia verbatim da branch `claude/khalkaria-bazar-balance-lsdfic`, commit `2a47578` (só a chave `origem` foi acrescentada); o script só lê |
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
| Regra atual | `obsoletas` (padrão de regra antiga, pela tabela) e `achados` (conflito lido à mão e conferido) | `obsoleto`, `revisar`; achado aberto (não resolvido) de gravidade alta ou média |

`automacao` é informativo: hoje tudo é manual (a ficha não automatiza técnica de classe, `03-respostas-pedro.md` §1), e o
campo `numeros` lista os valores que a técnica mexe, para o jogador lançar à mão.

Cada achado leva ainda:

- `resposta`: a do balanceamento, com `status` **resolvido** (regra escrita ou corrigida, ou texto corrigido na fonte),
  **leitura** (leitura do balanceamento; a ficha implementa, o Pedro pode revisar), **esperandoPedro** (a ficha usa o
  provisório) ou **doSite** (conserto do agente de HTML). `statusBalanceamento` guarda o status original; `perguntaPedro`
  traz a pergunta T com a recomendação, e `principio`, a leitura G.
- `trechoAtual`: o trecho citado ainda está no texto? O script procura cada pedaço do trecho em toda string de
  `data/**/*.json` e em `js/*.js`. Se nenhum pedaço está mais lá, a fonte foi corrigida depois do achado: a resposta vira
  **resolvido** (`resolvidoPor: textoCorrigido`), com a evidência e o bloco atual mais parecido da técnica.

Em resumo, uma técnica "funciona na ficha" quando vai com nome e texto completos, o custo é legível e o texto não contradiz a
regra atual.

## Resultado

**241 de 382 técnicas sem alerta** (eram 96 no primeiro log).

- **A descrição deixou de ser problema.** Desde a ficha v2.1 corrigida, a técnica vai com o texto inteiro da mecânica:
  descrição completa em 371 de 382; as 11 restantes são os blocos de classe, que
  não têm botão. O achado `ficha-v21-descricao` saiu como resolvido pelo texto (o seletor antigo não está mais em `js/ficha.js`).
- **11 blocos de classe sem botão** (4 características e 7 recursos): a v2.1 não tem seletor para eles.
  A Marca do Duelo, citada em 17 cards do Espadachim, está entre eles.
- **Habilidades de origem e Corrupção vão, mas não como entidade própria** (49 com levável
  parcial). A habilidade vai junto com o card da origem; as 30 linhas da Corrupção vão pela tabela, sem `data-kf-id` nem
  catálogo, com o custo no nome.
- **160 achados de regra** (12 de gravidade alta,
  81 média e 67 baixa), todos com resposta do balanceamento:
  **14 resolvidos, 84 com leitura, 54 esperando o Pedro e
  8 do site.** 82 técnicas têm pelo menos um achado aberto alto ou
  médio; 60 estão em alerta só por achado de regra.
- **3 achados sumiram do texto** depois do sync do lote L: o Notion (ou a ficha) corrigiu o trecho. Estão na
  seção Resolvidos, com a evidência.

### Por classe, raça e origem

Levável: ok / parcial / não. Obsoletas: obsoleto / revisar. Achados: técnicas cujo achado aberto mais grave é alto / médio /
baixo (resolvido não conta).

| Fonte | Total | Ok | Alerta | Levável | Custo parcial | Recarga | Referências | Obsoletas | Achados |
|---|---|---|---|---|---|---|---|---|---|
| Espadachim | 42 | 26 | 16 | 39 / 0 / 3 | 2 | 3 | 1 | 3 / 0 | 2 / 11 / 7 |
| Batedor | 41 | 30 | 11 | 40 / 0 / 1 | 4 | 0 | 1 | 0 / 0 | 1 / 6 / 8 |
| Brutalista | 40 | 30 | 10 | 39 / 0 / 1 | 0 | 0 | 0 | 1 / 1 | 1 / 8 / 8 |
| Teurgo | 41 | 28 | 13 | 39 / 0 / 2 | 4 | 0 | 0 | 0 / 1 | 1 / 8 / 6 |
| Monge | 41 | 27 | 14 | 39 / 0 / 2 | 0 | 0 | 1 | 0 / 0 | 1 / 11 / 9 |
| Alquimista | 40 | 31 | 9 | 39 / 0 / 1 | 2 | 0 | 0 | 0 / 0 | 0 / 6 / 10 |
| Artilheiro | 40 | 25 | 15 | 39 / 0 / 1 | 0 | 0 | 1 | 0 / 0 | 0 / 15 / 3 |
| Humano | 5 | 5 | 0 | 5 / 0 / 0 | 0 | 0 | 0 | 0 / 0 | 0 / 0 / 0 |
| Anão | 5 | 5 | 0 | 5 / 0 / 0 | 0 | 0 | 0 | 0 / 0 | 0 / 0 / 0 |
| Dryad | 5 | 4 | 1 | 5 / 0 / 0 | 0 | 0 | 0 | 0 / 1 | 0 / 0 / 0 |
| Autômato | 18 | 16 | 2 | 18 / 0 / 0 | 0 | 0 | 0 | 0 / 0 | 0 / 2 / 2 |
| Gruto | 5 | 5 | 0 | 5 / 0 / 0 | 0 | 0 | 0 | 0 / 0 | 0 / 0 / 1 |
| Inseto | 6 | 6 | 0 | 6 / 0 / 0 | 0 | 0 | 0 | 0 / 0 | 0 / 0 / 0 |
| Corrompido | 34 | 3 | 31 | 4 / 30 / 0 | 0 | 0 | 0 | 0 / 2 | 1 / 4 / 0 |
| Origens | 19 | 0 | 19 | 0 / 19 / 0 | 0 | 0 | 0 | 0 / 1 | 0 / 4 / 0 |
| **Total** | **382** | **241** | **141** | 322 / 49 / 11 | 12 | 3 | 4 | 4 / 6 | 7 / 75 / 54 |

Os 15 achados que não são de uma técnica (item alquímico, itens iniciais de origem, contrato, referências do
balanceamento, ficha) estão em `achadosGerais` no log e entram nas contagens e listas abaixo.

### Respostas do balanceamento

Resposta do commit `2a47578` (`16-log-tecnicas.md` e `log-tecnicas-respostas.json` da branch do balanceamento),
uma por achado. Os achados do Pedro viraram perguntas T com recomendação. "Resolvido" inclui os 3 que o texto
corrigido fechou (o do site é a ficha v2.1).

| Destino | Achados | Resolvido | Leitura | Esperando o Pedro | Do site |
|---|---|---|---|---|---|
| Balanceamento | 110 | 11 | 84 | 15 | 0 |
| Pedro | 41 | 2 | 0 | 39 | 0 |
| Site | 9 | 1 | 0 | 0 | 8 |
| **Total** | **160** | **14** | **84** | **54** | **8** |

## Esperando o Pedro

54 achados esperam resposta do Pedro, agrupados pela pergunta do balanceamento. Enquanto não houver resposta, a
ficha usa o provisório de cada um. Cada pergunta diz também quantas leituras do balanceamento dependem dela.

### T1. Princípios G1–G3

Aprova as três leituras: retaliação livre (G1), ação livre que não acumula consigo e só vale fora do turno com gatilho (G2), PMA também nos ataques de técnica (G3)?

*Recomendação do balanceamento:* Aprovar. Dão efeito ao texto que você já escreveu, sem reescrever técnica.

Mais 5 achados com leitura do balanceamento que dependem desta resposta (a ficha já implementa a leitura).

### T2. N ataques "como 1 ação" com arma pesada

Lâmina Rápida, Massacre e Rajada de Tiros com arma de Atacar(2)/(3): (a) literal, 1 ação sempre; (b) os ataques custam juntos o Atacar(n) da arma; (c) só armas de Atacar(1).

*Recomendação do balanceamento:* (b). Toda arma de fogo do Bazar é Atacar(2): no literal, a Rajada dá 4 vezes a taxa normal de tiros e 3 Rajadas por turno somam 6 tiros.

Esperando o Pedro (3):

1. **Lâmina Rápida** · Espadachim · Geral · média · id `espadachim-lamina-rapida`

   PMA: o 2º ataque leva −5 (G3; o texto não diz "sem penalidade de multi-ataque"). Custo com arma de Atacar(2)/(3): pergunta T2. Minha recomendação é que os 2 ataques custem juntos o Atacar(n) da arma, o que mantém a técnica valendo "2 ataques pelo preço de 1" em qualquer arma. No literal, uma Pesada Brutal faria 2 ataques por 1 ação, economizando 5 ações. *Provisório:* ficha: mostra "1 Ação" do texto + aviso até a T2.

2. **Massacre** · Espadachim · Ramo do Oprimido · Tier 2 · média · id `espadachim-massacre`

   Custo com arma pesada: mesma T2. O 2º ataque leva −5 (G3). Os +2d6 e o Sangramento 1 valem uma vez, no 2º acerto, só se os dois acertarem. Os +2d6 não dobram no crítico (D97). *Provisório:* ficha: como Lâmina Rápida.

3. **Rajada de Tiros** · Artilheiro / Pólvora T1 · média · id `artilheiro-rajada-de-tiros`

   Pergunta T2 (a mesma da Lâmina Rápida). Toda arma de fogo do Bazar é Atacar(2). No literal, a Rajada dá 2 tiros de Distância Pesada por 1 ação, 4 vezes a taxa normal, e 3 Rajadas por turno somariam 6 tiros. Recomendação: os 2 tiros custam juntos o Atacar(n) da arma, 2 ações com arma de fogo. A PMA não entra, porque o texto isenta. A L13 é da manobra Investida e não se estende aqui. *Provisório:* ficha: mostra "1 Ação" + aviso até a T2.

### T3. "Espada"

Proficiência com Espadas e Pedra de Amolar citam "espada", que o Bazar não tem. Qual regra?

*Recomendação do balanceamento:* Arma corpo a corpo que causa dano Cortante. Casa com o "ignora resistência a Cortante" e não pede mudança no CSV; custo: machados e foices de chassi Cortante contam. Alternativa: tag "Espada" no CSV.

Esperando o Pedro (2):

1. **Proficiência com Espadas (característica de classe)** · Espadachim · Característica de classe · média · id `espadachim-proficiencia-com-espadas`

   "Espada" não existe no Bazar. Pergunta T3. Recomendo "arma corpo a corpo que causa dano Cortante": Leve Cortante, Marcial Precisa, Pesada Cortante, e Leve Ágil, Marcial Versátil e Pesada Brutal quando o jogador escolhe Cortante. É automatizável, casa com o "ignora resistência a Cortante" do nível 3 e não exige mexer no CSV. Custo: machados e foices de chassi Cortante contam como espada. *Provisório:* ficha: provisório = corpo a corpo + Cortante.

2. **Pedra de Amolar** · Espadachim · Geral · baixa · id `espadachim-pedra-de-amolar`

   "Espada": mesma T3, com o mesmo provisório (corpo a corpo + Cortante). O jogador escolhe a arma ao amolar. +1d4 Cortante até o fim do próximo combate; não dobra no crítico (D97). *Provisório:* ficha: bônus preso à arma escolhida, some no fim do próximo combate.

### T4. Intensidade subida por técnica

Tese Arcana, Patrono Primordial e Natureza Caótica sobem a intensidade. Paga a declarada ou a resultante? Chegar a Transbordante assim pede o teste de Vontade?

*Recomendação do balanceamento:* Paga a declarada; sem teste, porque o teste é o risco de quem escolhe forçar; teto Transbordante (Transbordante+ só onde o texto diz).

Esperando o Pedro (2):

1. **Tese Arcana** · Teurgo — Ramo do Acadêmico, Tier 1 · média · id `teurgo-tese-arcana`

   Pergunta T4 (intensidade subida por técnica). Recomendo: paga os 2 Stamina e o Éter da intensidade conjurada; a intensidade sobe 1 sem custo extra e sem o teste de Vontade, porque o teste é o risco de quem escolhe forçar. A modulação grátis dispensa o Éter de uma modulação. Declarada Transbordante, o teste declarado vale e o +1 não passa do teto. *Provisório:* ficha: provisório = recomendação.

2. **Patrono Primordial** · Teurgo — Ramo do Arauto, Tier 1 (A Grande Árvore) · média · id `teurgo-patrono-primordial`

   Mesma T4 e mesma recomendação da Tese Arcana: paga a intensidade conjurada, sobe 1, sem teste. Numa Alteração já Transbordante, não há efeito extra; Transbordante+ só existe onde o texto diz (Receptáculo Perfeito). *Provisório:* ficha: provisório = recomendação.

Mais 1 achado com leitura do balanceamento que depende desta resposta (a ficha já implementa a leitura).

### T5. Normalização de termos (só texto)

"1x/Dia" → "1x/Descanso Longo" nas ultimates e no cabeçalho do Tier 3 das 7 classes; "Margem de Crítico" → "Margem de Ameaça" (Sorte do Bêbado, Golpe Instinto, Tiro Carregado); "surpreendido" → "Desprevenido" (Sensor de Proximidade); "Adagas de lançamento" → "Conjunto de Arremesso" e "Flecha" → "Virotes/Flechas" (Artesão de Munição); "Derrubado" → "Caído" (Postura Defensiva); "Caidos" → "Caído" (Investida); e definir no Sistema > Sua Rodada: "Penalidade de Multi-Ataque (PMA): −5 cumulativo a cada ataque depois do primeiro contra o mesmo alvo, no mesmo turno" (D29).

*Recomendação do balanceamento:* Sim. Eu gravo e confiro o diff de cada página.

Esperando o Pedro (6):

1. **Oportunista** · Espadachim · Geral · baixa · id `espadachim-oportunista`

   "PMA" definido no Sistema pela D29. "Nesta rodada" = neste turno, porque a PMA é por turno. Com isso a técnica funciona como está. *Provisório:* aguarda Pedro.

2. **Ultimates: recarga escrita "1x/Dia"** · As 7 classes · cabeçalho do Tier 3 (classe.tiers) e custoTexto das 3 ultimates do Espadachim · baixa · id `notacao-1x-dia` Vale para 22 técnicas.

   Trocar "1x/Dia" por "1x/Descanso Longo" nas ultimates e no cabeçalho do Tier 3 das 7 classes. É só texto: a ficha já recarrega no descanso longo (L29). *Provisório:* aguarda Pedro.

3. **Transcendência** · Monge — Técnica Geral · baixa · id `monge-transcendencia`

   Resolvido pela definição de PMA no Sistema (T5). "Durante essa rodada" = neste turno. *Provisório:* aguarda Pedro.

4. **Tiro Carregado — termo** · Artilheiro / Predador T1 · baixa · id `artilheiro-tiro-carregado-2`

   "Margem de Crítico" → "Margem de Ameaça" (normalização de termo). *Provisório:* aguarda Pedro.

5. **Artesão de Munição** · Artilheiro / Geral · baixa · id `artilheiro-artesao-de-municao`

   "Flecha" → "Virotes/Flechas" e "Adagas de lançamento" → "Conjunto de Arremesso" (nomes do Bazar). *Provisório:* aguarda Pedro.

6. **Sensor de Proximidade** · Autômato (tecnologia Tier 2) · baixa · id `automato-sensor-de-proximidade`

   "Não pode ser surpreendido" → "Não pode ser Desprevenido". *Provisório:* aguarda Pedro.

### T6. Recurso de classe do Espadachim e do Teurgo

Você disse "todas têm", mas o Notion não traz nome nem regra desses dois. Quais são (nome, máximo, como ganha, como perde)? Ou o do Teurgo é o próprio Éter?

*Recomendação do balanceamento:* Até você escrever, a ficha mostra um contador livre (nome e atual/máx editáveis).

Esperando o Pedro (2):

1. **Recurso de Classe do Espadachim** · Espadachim · bloco classe · média · id `espadachim-recurso`

   Preciso do texto (nome, máximo, ganho, perda). Até lá a ficha mostra um contador livre, com nome e atual/máx editáveis. *Provisório:* aguarda Pedro.

2. **Recurso de Classe do Teurgo** · Teurgo — bloco classe · média · id `teurgo-recurso`

   Mesma pergunta do Espadachim: nome e regra, ou "o recurso é o Éter" (o que o contrato dizia). *Provisório:* aguarda Pedro.

### T7. Coragem Líquida

"+1 permanentemente em Movimento": na perícia ou em metros?

*Recomendação do balanceamento:* Na perícia: as outras 5 marcas do Espadachim dão perícia.

Esperando o Pedro (1):

1. **Coragem Líquida** · Espadachim · Marca (Ramo do Exilado Bêbado) · baixa · id `espadachim-coragem-liquida`

   +1 na perícia Movimento: as outras 5 marcas do Espadachim dão perícia. *Provisório:* aguarda Pedro.

### T8. Batedor

(a) Ocultar-se diz "com 1 ação ao invés de 2", mas Esconder custa 3 hoje. (b) Homem de Negócios está cortado no próprio Notion: "Você possui um disturbio de mat…". (c) Desenhar Mapa de Exploração tem um bullet vazio "-" no Notion: faltou um benefício? (d) Artista Apaixonado: "mercadoria Incomum" muda o quê, se o mapa já é Incomum? (e) Senhor das Linhas: não há regra de flanqueio no Sistema, e a armadilha não tem tipo de dano.

*Recomendação do balanceamento:* (a) Custo final 1 ação e corrigir o "2" para "3". (b) e (c) Preciso do texto. (d) Vender pelo preço de Incomum do Bazar. (e) Tirar "Não pode ser flanqueado"; armadilha Perfurante.

Esperando o Pedro (5):

1. **Ocultar-se** · Batedor (técnica geral) · alta · id `batedor-ocultar-se`

   Custo final 1 ação. Corrigir "ao invés de 2" para "ao invés de 3", o custo atual de Esconder. *Provisório:* aguarda Pedro.

2. **Homem de Negócios** · Batedor > Marca do Trambiqueiro · média · id `batedor-homem-de-negocios`

   A frase está cortada no próprio Notion ("Você possui um disturbio de mat"). Preciso do resto. *Provisório:* aguarda Pedro.

3. **Senhor das Linhas** · Batedor > Cartógrafo Tier 3 (Ultimate) · baixa · id `batedor-senhor-das-linhas`

   Flanqueio não existe no Sistema: tirar "Não pode ser flanqueado" ou criar a regra. A armadilha causa Perfurante. *Provisório:* aguarda Pedro.

4. **Desenhar Mapa de Exploração** · Batedor > Cartógrafo Tier 1 · baixa · id `batedor-desenhar-mapa-de-exploracao`

   O "-" vazio está no Notion: faltou um 3º benefício? O mapa não é item do Bazar; a ficha o adiciona como item manual Incomum. *Provisório:* aguarda Pedro.

5. **Artista Apaixonado** · Batedor > Cartógrafo Tier 1 · baixa · id `batedor-artista-apaixonado`

   "Mercadoria Incomum" muda o quê, se o mapa já é Incomum? Sugestão: vende pelo preço de Incomum do Bazar. Se não mudar nada, a técnica sai ou ganha outro efeito. *Provisório:* aguarda Pedro.

### T9. Brutalista

(a) Muralha Viva (L19). (b) Frenesi: "no nível 1" e "descontrolado". (c) Contador de Corpos: o asterisco de "brutalmente" não tem nota no Notion. (d) Imortal: "pode escolher não morrer" é do modelo antigo.

*Recomendação do balanceamento:* (a) "Some +1 à rolagem de Defender para cada grau de treinamento (Treinado +1, Experiente +2, Mestre +3, Lendário +4)", a tradução exata do "3 em 3". (b) "No nível 2"; "descontrolado" é adjetivo, não a condição; para travar algo preciso da lista, no mínimo "não conjura nem sustenta magia". (c) Matar com acerto crítico ou pelo Finalizar. (d) "Ao cair a 0 ou menos de Saúde, pode, como ação livre, ficar com 1 de Saúde em vez de entrar em Morrendo. Ao fazer isso, ganha +1 de Exaustão."

Esperando o Pedro (5):

1. **Muralha Viva** · Brutalista > Ramo do Colosso > Tier 1 · alta · id `brutalista-muralha-viva`

   Texto proposto (L19): "Some +1 à rolagem de Defender para cada grau de treinamento (Treinado +1, Experiente +2, Mestre +3, Lendário +4)." É a tradução exata do "3 em 3" antigo, que dava +1 por grau acima do normal. *Provisório:* aguarda Pedro.

2. **Frenesi** · Brutalista > Ramo do Berserker > Tier 1 · média · id `brutalista-frenesi`

   "No nível 1" → "no nível 2": o Tier 1 só abre no 2. Os 2 usos no nível 3 ficam. *Provisório:* aguarda Pedro.

3. **Frenesi** · Brutalista > Ramo do Berserker > Tier 1 · média · id `brutalista-frenesi-2`

   "Descontrolado" como adjetivo, não a condição, que faria o Brutalista atacar aliados. Para a ficha travar algo, preciso da lista "paciência ou concentração"; o mínimo seria "não conjura nem sustenta magias". *Provisório:* aguarda Pedro.

4. **Contador de Corpos** · Brutalista > Marca do Berserker · baixa · id `brutalista-contador-de-corpos`

   A nota do asterisco não existe no Notion. Sugestão: "brutalmente" = matar com acerto crítico ou pelo Finalizar. *Provisório:* aguarda Pedro.

5. **Imortal** · Brutalista > Marca do Colosso · baixa · id `brutalista-imortal`

   Reescrever: "Ao cair a 0 ou menos de Saúde, pode, como ação livre, ficar com 1 de Saúde em vez de entrar em Morrendo. Ao fazer isso, ganha +1 de Exaustão." *Provisório:* aguarda Pedro.

### T10. Investida (L20)

Nomes para as duas regras antigas, e a do Brutalista conta como o Mover do turno?

*Recomendação do balanceamento:* Técnica do Brutalista → "Atropelar"; ação do Titã → "Avalanche". Conta como Mover. "Investida" fica só para a manobra, que é a que as Grevas citam.

Esperando o Pedro (2):

1. **Investida** · Brutalista > Técnicas Gerais · média · id `brutalista-investida`

   L20: renomear para "Atropelar". Conta como o Mover do turno. "Caidos" → Caído (corrijo junto). *Provisório:* aguarda Pedro.

2. **Titã** · Alquimista, Ramo do Artificer, Ultimate · média · id `alquimista-tita`

   L20: renomear a ação do Titã para "Avalanche". *Provisório:* aguarda Pedro.

### T11. Teurgo

(a) Encadeamento é exceção ao "1 magia por turno"? (b) Manifestação do Patrono: CDs sem número, "Banido" e os 6 Efeitos Caóticos. (c) Receptáculo Perfeito: "chegar em 50%" e a Casca Rachada. (d) Devoto: requisito é Patrono Primordial ou Barganha Primordial? (e) Grande Árvore: a Seiva do patrono soma Marca da Vhelor?

*Recomendação do balanceamento:* (a) Sim, escrever a exceção; 3 Stamina por uso. (b) "Contra sua CD" (D57); Banido fica efeito da ultimate; sorteio 1d6. (c) "Ultrapassar", e a Casca Rachada dobra esse limite também. (d) Preciso da resposta. (e) Não: somar tiraria 10 de Éter máximo do próprio devoto na Marca 2.

Esperando o Pedro (7):

1. **Encadeamento** · Teurgo — Técnica Geral · média · id `teurgo-encadeamento`

   É exceção ao "1 magia por turno": escrever isso, como o Receptáculo Perfeito escreve. 3 Stamina por uso. *Provisório:* aguarda Pedro.

2. **Manifestação do Patrono** · Teurgo — Ramo do Arauto, Ultimate (Tier 3) · média · id `teurgo-manifestacao-do-patrono`

   As CDs sem número viram "contra sua CD" (D57). *Provisório:* aguarda Pedro.

3. **Manifestação do Patrono** · Teurgo — Ramo do Arauto, Ultimate (Tier 3), patrono O Limiar · baixa · id `teurgo-manifestacao-do-patrono-2`

   "Banido" fica efeito da ultimate (como Marcado e Endividado), não condição nova. *Provisório:* aguarda Pedro.

4. **Manifestação do Patrono** · Teurgo — Ramo do Arauto, Ultimate (Tier 3), Genérico · baixa · id `teurgo-manifestacao-do-patrono-3`

   Sorteio com 1d6 na ordem da lista. *Provisório:* aguarda Pedro.

5. **Patrono Primordial** · Teurgo — Ramo do Arauto, Tier 1 (A Grande Árvore) · média · id `teurgo-patrono-primordial-2`

   Não soma Marca da Vhelor. A Seiva do patrono não é o item do Bazar, e somar tiraria 10 de Éter máximo do próprio devoto na Marca 2. *Provisório:* aguarda Pedro.

6. **Receptáculo Perfeito** · Teurgo — Ramo do Receptáculo, Ultimate (Tier 3) · baixa · id `teurgo-receptaculo-perfeito`

   "Ao chegar em 50%" → "ao ultrapassar 50%" (PD17). A Casca Rachada dobra esse limite também. Morrer em vez de passar o personagem ao mestre é regra da ultimate e fica. *Provisório:* aguarda Pedro.

7. **Devoto** · Teurgo — Marca, Ramo do Arauto · baixa · id `teurgo-devoto`

   O requisito é Patrono Primordial ou Barganha Primordial? O "Preço do Pacto" é do Patrono Primordial. *Provisório:* aguarda Pedro.

### T12. Monge

(a) Fluxo Invertido contra o "dano zera o Fluxo". (b) "Não pode perder fluxo de nenhuma outra forma" contra as ultimates que tiram Fluxo. (c) Forma do Vazio: "1d10 <5 acerta" dá 40%, não 50%; e o que são "ataques físicos"? (d) Queda Suave: o que é o "1 minuto" e quando vale o "5 × Nível"? (e) O ataque desarmado base (1d4) não tem tipo, atributo nem Atacar(n).

*Recomendação do balanceamento:* (a) Com Fluxo Invertido, o dano dá +1 no lugar de zerar. (b) Acrescentar "exceto quando o texto de uma técnica diz que você perde Fluxo". (c) "≤5 acerta"; ataques de arma e desarmados, de qualquer tipo de dano. (d) Por 1 minuto, quedas até 30 m sem dano; acima de 30 m, o dano cai 5 × Nível. (e) "1d4 Contundente (Destreza), Atacar(1), corpo a corpo", o perfil do chassi Leve.

Esperando o Pedro (5):

1. **Arma Humana** · Monge — Característica de Classe · média · id `monge-arma-humana`

   O ataque desarmado base não existe no Sistema. Pergunta T12. Recomendo: "Ataque desarmado: 1d4 Contundente (Destreza), Atacar(1), corpo a corpo", o mesmo perfil do chassi Leve (Sistema: corpo a corpo leve usa Destreza). A Arma Humana troca o 1d4 por 1d8, e Punho Perfeito e Toque da Dor passam a ter onde se apoiar. *Provisório:* ficha: provisório = recomendação.

2. **Fluxo Invertido** · Monge — Ramo do Vazio, Tier 1 · média · id `monge-fluxo-invertido`

   Pergunta T12. Recomendo que, com Fluxo Invertido, o dano dê +1 no lugar de zerar. Na ordem "zera e ganha 1", o Fluxo do ramo do Vazio nunca passa de 1 sob ataque, e a aura dos 5 de Fluxo fica inalcançável justo para quem ganha Fluxo apanhando. A Concentração do Mestre (Punho) já mostra que técnica pode anular o zeramento. *Provisório:* ficha: provisório = recomendação.

3. **Forma do Vazio** · Monge — Ramo do Vazio, Tier 1 · média · id `monge-forma-do-vazio`

   "1d10 <5 acerta" dá 40%, não 50%: trocar para "≤5 acerta". "Ataques físicos" = ataques de arma e desarmados, de qualquer tipo de dano. *Provisório:* aguarda Pedro.

4. **Insurgência / Fusão Primal (perda de Fluxo)** · Monge — Ultimates do Vazio e do Naturalista · baixa · id `monge-perda-de-fluxo-ultimates` Vale para: 🌑 Insurgência, 🌿 Fusão Primal, Fluxo.

   Acrescentar "exceto quando o texto de uma técnica diz que você perde Fluxo" a "Você não pode perder fluxo de nenhuma outra forma" (Insurgência, Fusão Primal). A frase seguinte, que diz que o custo em Fluxo é só requisito, fica como está. *Provisório:* aguarda Pedro.

5. **Queda Suave** · Monge — Técnica Geral · baixa · id `monge-queda-suave`

   Por 1 minuto, quedas de até 30 m não causam dano a você e a até 5 criaturas tocadas; acima de 30 m, o dano cai 5 × Nível. Dano de queda é do mestre (o Sistema não define). *Provisório:* aguarda Pedro.

### T13. Alquimista

(a) Cartucho Arcano depois da D68: custo e CD subiram 2 sozinhos. (b) Elixir Especial: "3 Reagentes" no cabeçalho, "1 por alvo" no corpo. (c) Curandeiro Incansável: "que estava com 0 de Saúde". (d) Tabela da classe × CSV: Soro da Guerra (o CSV dura 1 min e não tem "Vantagem em Fortitude") e Veneno Hemorrágico (o CSV não tem "Medicina estanca"). (e) Essência Etérea: "Incorpóreo" não é condição.

*Recomendação do balanceamento:* (a) Reagentes = custo base de Éter da magia; CD = 10 + custo base; Nível 5 pede Foco Primordial para criar. (b) 1 por alvo. (c) "Que estava Morrendo". (d) Vale o CSV; se quiser os extras, eles entram no CSV. (e) Fica efeito do item.

Esperando o Pedro (4):

1. **Cartucho Arcano** · Alquimista, Ramo do Artificer, Tier 1 · média · id `alquimista-cartucho-arcano-2`

   Pergunta T13. A D68 subiu as magias 1 nível e manteve o Éter (a antiga Nível 4 e a nova Nível 5 custam 8). Por isso "(Nível × 2) Reagentes" e "CD 10 + 2 × Nível" subiram 2 sem ninguém editar. Recomendo amarrar ao custo base de Éter: Reagentes = custo base de Éter da magia; CD = 10 + custo base. Isso devolve os números de antes da D68. Cartucho de Nível 5: quem cria precisa dos mesmos requisitos de conjurar (Foco Primordial e Experiente em Místico). *Provisório:* ficha: provisório = fórmula atual do texto + aviso.

2. **Elixir Especial** · Alquimista, Ramo do Boticário, Tier 1 · média · id `alquimista-elixir-especial`

   Pergunta T13. Recomendo que valha o corpo: 1 Reagente por alvo. O "3 Reagentes" do cabeçalho é o caso de 3 alvos e deveria virar "1 Reagente/alvo". Somar os dois (3 + 1 por alvo) encarece um Tier 1 que já custa ação e Stamina. *Provisório:* ficha: provisório = 1 Reagente por alvo.

3. **Curandeiro Incansável** · Alquimista, Marca do Boticário · baixa · id `alquimista-curandeiro-incansavel`

   "Que estava com 0 de Saúde e remover a condição morrendo" → "que estava Morrendo e remover a condição". *Provisório:* aguarda Pedro.

4. **Essência Etérea (item alquímico da característica de classe)** · Alquimista, característica de classe (itensAlquimicos, Nível 4) · baixa · id `alquimista-essencia-eterea`

   "Incorpóreo" fica efeito do item, descrito no CSV, não condição nova. *Provisório:* aguarda Pedro.

Mais 1 achado com leitura do balanceamento que depende desta resposta (a ficha já implementa a leitura).

Também ligado a esta pergunta: **Soro da Guerra (item alquímico da característica de classe)** (`alquimista-soro-da-guerra`, resolvido).

### T14. Artilheiro

(a) Munição Especial: "3 = 1 bugiganga" contra a regra "10 = 1". (b) Projétil Envenenado vale o combate inteiro pela regra da munição (D2/D41).

*Recomendação do balanceamento:* (a) Alinhar a 10, salvo peso maior proposital. (b) É o que a regra diz; se for forte demais, basta "uso único".

Esperando o Pedro (1):

1. **Munição Especial — peso** · Artilheiro / Pólvora T2 · média · id `artilheiro-municao-especial`

   Alinhar a "10 = 1 bugiganga", como toda munição, a menos que o peso maior seja proposital. *Provisório:* aguarda Pedro.

Mais 1 achado com leitura do balanceamento que depende desta resposta (a ficha já implementa a leitura).

### T15. Raças

(a) Autômato, Achar Tecnologias em Lojas: o d12 não fecha com a lista. (b) Gruto: "Criaturas Predáveis" não está definido. (c) Corrompido: pela tabela, "negativas são permanentes" aponta para os poderes. (d) As Vozes: "1 natural em qualquer dado". (e) Receptáculo Natural e Cultista conjuram sem Treinado em Místico?

*Recomendação do balanceamento:* (a) 1d10 sobre as 9 compráveis, rerolando o 10 e os repetidos. (b) Sugestão: Dryads e criaturas menores que você. (c) "Adversidades (custo +) são permanentes; poderes (custo −) podem ser reorganizados no descanso longo." (d) Só o d20: num 4d6 de dano, 52% das rolagens têm um 1. (e) Sim: o traço dá a conjuração das 2 magias.

Esperando o Pedro (4):

1. **As Vozes** · Corrompido (adversidade +3) · média · id `corrompido-as-vozes`

   Pergunta T15. Recomendo que o gatilho seja só o d20. "Falha crítica" é conceito do d20, e em "qualquer dado" um 4d6 de dano tem 52% de ter um 1: o Éter do Corrompido some em um combate, a 2d4 + nível por gatilho. Se a intenção é ser brutal, a Pele Morta mostra que adversidade pode ser; aí vale o literal. *Provisório:* ficha: provisório = só d20.

2. **Achar Tecnologias em Lojas** · Autômato (regra de aquisição) · baixa · id `automato-achar-tecnologias-em-lojas`

   O d12 não fecha com a lista (6 não compráveis no Tier 1 + 9 compráveis). Sugestão: 1d10 sobre as 9 compráveis na ordem da lista, rerolando o 10 e os repetidos. *Provisório:* aguarda Pedro.

3. **Língua Bifurcada** · Gruto (característica) · baixa · id `gruto-lingua-bifurcada`

   Preciso da definição de "Criaturas Predáveis". Sugestão: Dryads e criaturas menores que você. *Provisório:* aguarda Pedro.

4. **A Corrupção (convenção de sinal)** · Corrompido (bloco de corrupção) · baixa · id `raca-corrompido`

   Reescrever pelo sinal da tabela: "Adversidades (custo +) são permanentes; poderes (custo −) podem ser reorganizados no descanso longo." *Provisório:* aguarda Pedro.

Mais 2 achados com leitura do balanceamento que dependem desta resposta (a ficha já implementa a leitura).

### T16. Origens e condições mentais

(a) A Forja: +1 grau por item inédito ou por raridade inédita? (b) Caçador: "1 Arma Simples" não existe. (c) Mineiro: itens iguais aos do Lenhador. (d) "Condições mentais" = Enfeitiçado, Amedrontado, Confuso, Atordoado, a única lista escrita (no Limiar). Descontrolado e Bêbado ficam de fora?

*Recomendação do balanceamento:* (a) Por raridade (Incomum, Exótico, Luxária: até +3); por item, 4 fabricações levam a Lendário. (b) "Arma Distância Simples". (c) "Cobre" no lugar de "Madeira Comum". (d) Sim.

Esperando o Pedro (3):

1. **A Forja (Ferreiro e Artesão)** · Origens Ferreiro e Artesão · média · id `origem-a-forja` Vale para: A Forja, A Forja.

   Pergunta T16. O texto conta por item inédito acima de Ordinário, e o teto natural é o Lendário. Com isso, 4 itens diferentes levam de Leigo a Lendário. Recomendo contar por raridade inédita (Incomum, Exótico, Luxária: no máximo +3 graus), como o meu 03-origens lia. No Artesão, a imunidade à falha crítica e o ganho valem só para o que se fabrica com o Ofício nomeado (Engenharia); consumível feito com Alquimia fica de fora. *Provisório:* ficha: provisório = literal (por item) com teto Lendário.

2. **Itens iniciais do Caçador** · Origem Caçador · baixa · id `origem-cacador-itens`

   "1 Arma Simples" → "1 Arma Distância Simples" (arco do caçador). *Provisório:* aguarda Pedro.

3. **Itens iniciais do Mineiro** · Origem Mineiro · baixa · id `origem-mineiro-itens`

   Parece cópia do Lenhador. Trocar "Madeira Comum" por "Cobre" (Material Ordinário mineral do Bazar). *Provisório:* aguarda Pedro.

Também ligado a esta pergunta: **Referência de origens do balanceamento desatualizada** (`balanceamento-ref-origens`, resolvido).

Também ligado a esta pergunta: **Veterano: pendência com texto corrompido no contrato** (`origem-soldado`, resolvido).

### T17. Produção em Massa

O texto termina com "← betovenon.": crédito intencional ou sai?

*Recomendação do balanceamento:* —

Também ligado a esta pergunta: **Produção em Massa** (`alquimista-producao-em-massa`, do site).

### T18. Confirmações rápidas (a ficha já usa)

Epifania: cada d20 do conjunto vale uma rolagem e sai. Cobra: a dose dura até o 1º acerto. Primordial é o Nível 5 das escolas, não uma 5ª lista (o Foco Primordial diz "todas as magias de nível 5"). O Próximo: teto +3 no total.

*Recomendação do balanceamento:* Confirmar.

Mais 3 achados com leitura do balanceamento que dependem desta resposta (a ficha já implementa a leitura).

### L14

Pergunta L14 do lote anterior, ainda aberta (`16-log-tecnicas.md` do balanceamento, §2).

Esperando o Pedro (1):

1. **Grimório Arcano** · Teurgo — Ramo do Acadêmico, Tier 1 (mesmo problema em Canalizador Inato e Magias Pactuadas) · média · id `teurgo-grimorio-arcano`

   Depende da L14, ainda com o Pedro: pegar uma técnica de grimório no nível 2 é obrigatório? Leitura para o texto atual: "substitui a fórmula nível 1" vale retroativo. No nível N o Teurgo conhece 3 + Mod.INT + (N − 1) magias. Quem não pega técnica de grimório fica na fórmula base da classe até a L14 fechar. *Provisório:* ficha: provisório = leitura acima.

### L18

Pergunta L18 do lote anterior, ainda aberta (`16-log-tecnicas.md` do balanceamento, §2).

Também ligado a esta pergunta: **Cartucho Arcano** (`alquimista-cartucho-arcano`, resolvido).

### rework do Batedor (P1–P6)

Perguntas P1–P6 do rework do Batedor (D79), ainda abertas.

Esperando o Pedro (1):

1. **Instinto (ganho/perda por perícia)** · Batedor > Característica de classe · média · id `batedor-recurso-instinto`

   O ganho e a perda do Instinto estão no rework do Batedor (D79, perguntas P1–P6 em aberto). Para o texto atual: Defender não é "perícia com sucesso/falha", porque não tem CD e o resultado é a Evasão. A esquiva conta pelo gatilho próprio ("Ao esquivar"), sem contar duas vezes. *Provisório:* ficha: Instinto manual (sem automação) até o rework.

Sem achado ligado no log: T19 (ver `16-log-tecnicas.md` §2 do balanceamento).

## Resolvidos (14)

### Pelo texto corrigido (3)

O trecho do achado não está mais em `data/` nem em `js/`.

1. **Fluxo (Característica/Recurso de Classe)** · id `monge-recurso-fluxo` · alta

   > Ao fim do combate, se passar 1 rodada sem ganhar Fluxo ou receber dano, você perde todo seu Fluxo.

   O trecho citado não está mais em data/ nem em js/ (texto atual em data/classes/monge.json > classe.recurso: "Você perde todo o seu Fluxo ao receber dano, ao passar 1 rodada sem ganhar Fluxo e ao fim do combate.").

2. **Cartucho Arcano** · id `alquimista-cartucho-arcano` · alta

   > Magias Disponíveis: Você conhece 1 magia + Mod. Inteligência(min. 1) do seu (nível-1) ou menor, após isso você ganha +1 magia por nível.

   O trecho citado não está mais em data/ nem em js/ (texto atual em data/classes/alquimista.json: "Magias Disponíveis: Você conhece 1 magia + Mod. Inteligência(min. 1) do seu nível ou menor, após isso você ganha +1 magia por nível.").

3. **Ficha v2.1 leva a técnica sem a mecânica** · id `ficha-v21-descricao` · alta

   > `var descNode = q1(card, '.spell-desc,.dor-card-desc,.catalog-card-effect,.habilidade-box,p:not(.meta):not(.flavor):not(.quote)');`

   O trecho citado não está mais em data/ nem em js/.

### Pelo balanceamento (11)

Regra escrita ou contrato corrigido; o trecho continua no texto, mas deixou de ser conflito.

- **Ponto Fraco** (`espadachim-ponto-fraco`): "Passiva" com custo no corpo = custo por uso (G12): 5 Stamina a cada vez que você mantém o Exposto. O contrato estava errado ao usar Ponto Fraco como exemplo de Stamina reservada; corrigido.
- **Treinamento fixo (contrato)** (`monge-treinamento-contrato`): O contrato estava errado. Corrigido: periciasIniciais = [movimento, atacar] + Armas Marciais; Vontade fica na lista de escolha.
- **Concentração do Mestre** (`monge-concentracao-do-mestre`): Com a G10 os dois itens têm alvo. O 1º muda o gatilho de inatividade de 1 para 2 rodadas. O 2º anula o zeramento por dano Mod.SAB vezes por descanso longo; quando a Saúde cai, a ficha pergunta se quer gastar um uso.
- **Soro da Guerra (item alquímico da característica de classe)** (`alquimista-soro-da-guerra`): O CSV, fonte dos itens, diz "Dura 1 min." A ficha usa o CSV. A tabela da classe não traz a duração e acrescenta "Vantagem em Fortitude", que o CSV não tem; divergência para o Pedro (T13).
- **Concentração (Característica de Classe) — gasta ou só exige** (`artilheiro-concentracao-gasta-ou-exige`): Gasta. O texto da classe diz "Você gasta concentração para utilizar técnicas" e "diminua sua concentração conforme o requisitado". O contrato estava errado; corrigido: custoEmTecnicasPadrao = "gasta". Como a Concentração soma no ataque, gastar baixa o acerto, e esse é o preço da técnica.
- **Receptáculo Menor** (`corrompido-receptaculo-menor`): A modulação "grátis" zera o custo dela, mas a magia continua modulada. A exceção do piso da D96 exige "sem modulação", então um truque Normal com a modulação grátis custa 1. Contrato: a ordemCusto ganhou a etapa "modulação zerada conta como modulação".
- **Pele Morta** (`corrompido-pele-morta`): Vale o Sistema: Místico = Radiante, Trovejante, Necrótico; Força e Primordial são "Outros". A Ae(Místico, 5) cobre os 3. A vulnerabilidade cobre os tipos não místicos das categorias: Ordinário, Elemental e Biológico. Força e Primordial ficam neutros, que é o que o "exceto" queria dizer quando os dois eram Místico. D67 corrigida na memória; contrato dano.categorias alinhado ao Sistema.
- **Mente Fraca** (`corrompido-mente-fraca`): Sem ação no texto: a ficha casa por id, não por nome, e a colisão com a Dor do Abismo some. Renomear é opcional.
- **Referência de raças do balanceamento desatualizada** (`balanceamento-ref-racas`): Procede. O 04-racas.md é anterior à última sincronização e está desatualizado; vale o data/racas (Notion). O contrato não tira números de raça dessa referência. Marquei o arquivo como superado e a reauditoria entra na fila (bloco C).
- **Referência de origens do balanceamento desatualizada** (`balanceamento-ref-origens`): Procede, com o mesmo tratamento: 03-origens.md marcado como superado; vale o data/origens.json. A leitura do A Forja por raridade virou recomendação (T16), não regra.
- **Veterano: pendência com texto corrompido no contrato** (`origem-soldado`): A página Condições do Notion não tem seção "Condições Mentais"; o grupo "mentais" do site é agrupamento de interface. A única lista escrita no Notion está no Limiar e é a do contrato: Enfeitiçado, Amedrontado, Confuso, Atordoado. O n11 foi reescrito sem citar efeito de carta rara, e a censura não precisa mais cortar. Para o site: o grupo "Condições Mentais" da página de Condições não bate com essa lista (tem Descontrolado e Bêbado, não tem Atordoado); alinhar ou renomear o grupo. Confirmação com o Pedro em T16.

## Leituras do balanceamento (84)

A ficha implementa a leitura; o Pedro pode revisar (as de G1–G3 dependem da T1). Por princípio:
G1 8, G2 6, G3 3, G5 2, G7 8, G8 4, G9 1, G12 4, G13 3, G14 1, — 44 ("—" = leitura sem princípio). As de gravidade alta e média (51), com o
que a ficha faz:

- **Inimigo Mortal** (`espadachim-inimigo-mortal`, alta, G1, T1): ficha: contador "retaliação livre" = 2 (alvo: Marca), zera no início do seu turno
- **Quebrar Postura** (`espadachim-quebrar-postura`, alta, G1, T1): ficha: estado "sem reação" na Marca até o turno dela (mesa marca)
- **Guardar a Lâmina** (`espadachim-guardar-a-lamina`, média, G1, T1): ficha: +2 no dado de Defender; contador "retaliação livre" = 1
- **Sentença Final** (`espadachim-sentenca-final`, média, G1, T1): ficha: retaliação livre ilimitada enquanto no plano
- **Parry Perfeito** (`espadachim-parry-perfeito`, média, G1, T1): ficha: botão de uso por ataque defendido (3 Stamina cada)
- **Corte Diagonal** (`espadachim-corte-diagonal`, média, G2): ficha: flag "próximo ataque" booleana, não contador
- **Dobrar a Aposta** (`espadachim-dobrar-a-aposta`, média, G2): ficha: flag booleana por ataque
- **Beber até Cair** (`espadachim-beber-ate-cair`, média, G7): ficha: filtro Tags∋Bebida e Efeito menciona "Bêbado" sem "Remove"
- **Fantasma** (`batedor-fantasma`, média, G5): ficha: +bônus de treino de Furtividade no Defender
- **Sexto Sentido (habilidade de Instinto)** (`batedor-sexto-sentido`, média, G2): contrato/ficha: duração = turno em curso (qualquer criatura)
- **Silêncio** (`batedor-silencio`, média): ficha: estado de classe com X; Exposto reaplicado a cada marcação
- **Cicatrizes da Jornada** (`batedor-cicatrizes-da-jornada`, média, G9): ficha: valida saldo ≥ resultado antes de converter
- **Mapa Mental** (`batedor-mapa-mental`, média): ficha: ao ativar, mostra as 3 sub-habilidades do Desenhar Mapa de Combate
- **Guardião** (`brutalista-guardiao`, média, G1): ficha: 1 reação; Defender liberado contra o ataque interceptado
- **Resistência Adaptável** (`brutalista-resistencia-adaptavel`, média): ficha: seletor com os 9 atípicos; troca aplica no golpe atual
- **Formação de Combate** (`brutalista-formacao-de-combate`, média): ficha: soma cumulativa por degrau
- **A Última Parede** (`brutalista-a-ultima-parede`, média): ficha: R em 10 tipos (Ordinário + 9 atípicos); Exaustão +1 ao fim
- **Despertar A Besta** (`brutalista-despertar-a-besta`, média): ficha: eter.max −2 permanente por uso; Morrendo sem Inconsciente enquanto ativa
- **Campo de Batalha** (`brutalista-campo-de-batalha`, média, G2): ficha: nada a automatizar
- **Êxtase Destrutivo** (`teurgo-extase-destrutivo`, alta, G13): ficha: degraus calculados pelo Éter atual; nota "≤0 exige Reserva Oculta ou Receptáculo Perfeito"
- **Êxtase Destrutivo** (`teurgo-extase-destrutivo-2`, média): ficha: botão "Êxtase" (−50% Éter máx.) + botão "Restaurar" (1 vez, 10 min)
- **Natureza Caótica** (`teurgo-natureza-caotica`, média, G13, T4): ficha: custo = intensidade declarada
- **Escolas do Primórdio** (`teurgo-escolas-do-primordio`, média, T18): ficha: "Primordial" = chave do Nível 5, sem lista própria
- **Quebrar Guarda** (`monge-quebrar-guarda`, alta, G1): ficha: nada a automatizar (mesa)
- **Totem Eterno** (`monge-totem-eterno`, média): ficha: nada a automatizar
- **Transcendência Suprema** (`monge-transcendencia-suprema`, média): ficha: ao fim, stamina = 0; exaustao +1; eter −1d6
- **Companheiro Primal II** (`monge-companheiro-primal-ii`, média): ficha: custo do CP I; acerto = treino Atacar + Mod. + 2
- **Golpe Sequencial** (`monge-golpe-sequencial`, média, G3): contrato corrigido; ficha: 1 extra por ação Atacar
- **Fusão Primal (Falcão)** (`monge-fusao-primal`, média, G2): ficha: nada a automatizar
- **O Terror** (`monge-o-terror`, média, G8): ficha: estado "O Terror" até o próximo turno
- **Sussurros Constantes** (`monge-sussurros-constantes`, média): ficha: prompt ao cruzar 0; eter += floor(max/2)
- **Insurgência** (`monge-insurgencia`, média): ficha: nota; custo calculado
- **Cartucho Arcano** (`alquimista-cartucho-arcano-3`, média): ficha: cartucho = conjuração sem Éter, intensidade Normal
- **Enxurrada de Alquímicos** (`alquimista-enxurrada-de-alquimicos`, média, G3): ficha: 3 rolagens de Atacar com progressão PMA
- **Preciosismo** (`alquimista-preciosismo`, média): ficha: flag "feito por mim" no item → +2 na CD de resistência
- **Apocalipse Alquímico** (`alquimista-apocalipse-alquimico`, média, G8): ficha: 2 rolagens de 4d6 com tipos separados
- **Veneno Hemorrágico (item alquímico da característica de classe)** (`alquimista-veneno-hemorragico`, média, T13): ficha: efeito de tique próprio, não condição
- **Teto de Concentração abaixo dos custos das técnicas** (`artilheiro-teto-de-concentracao`, média): contrato: status "canonico" + nota de build
- **Dança da Morte** (`artilheiro-danca-da-morte`, média, G1): ficha: estado "Dança" consome a reação
- **Projétil Envenenado** (`artilheiro-projetil-envenenado`, média, T14): ficha: munição com efeito de cena
- **Munição Especial — custo sem uso definido** (`artilheiro-municao-especial-2`, média, G12): ficha: botão "carregar especial" (1 ação, 2 Stamina)
- **Tiro Carregado — ações** (`artilheiro-tiro-carregado`, média): ficha: seletor 1–3 ações com mínimo = Atacar(n)
- **Sentidos Aguçados** (`artilheiro-sentidos-agucados`, média, G8): ficha: estado até o próximo turno
- **Tiro Imobilizador** (`artilheiro-tiro-imobilizador`, média, G8): contrato: lento.duracao "daFonte" → padrão 1 rodada quando a fonte não diz
- **Premonição Etérica** (`corrompido-premonicao-eterica`, alta, G5): contrato + ficha: dado = melhor(2d6, dado do grau)
- **Lâmina Retrátil** (`automato-lamina-retratil`, média, G7): ficha: montar como Marcial Precisa +1 com +1d10
- **Escola Visceral** (`corrompido-escola-visceral`, média, G14): contrato corrigido (magia.ordemCusto etapa 5)
- **Receptáculo Natural** (`corrompido-receptaculo-natural`, média, T15): ficha: 2 magias liberadas sem foco e sem exigir treino
- **Segredos Proibidos** (`origem-cultista`, média, T15): ficha: 2 magias liberadas com foco
- **Corpo Mecânico** (`automato-corpo-mecanico-imunidade`, média): ficha: imunidade a 2 condições + doenças; grade inalterada
- **Palavra de Fé** (`origem-acolito`, média, G7): ficha: nada a automatizar

As 33 de gravidade baixa estão no JSON.

## Para o site (8)

Conserto do agente de HTML (ficha e marcação das páginas): o achado e a nota do balanceamento.

1. **Marca do Duelo / Proficiência com Espadas (características sem data-kf)** · Espadachim · Característica de classe · média · id `espadachim-marca-do-duelo` Vale para: Marca do Duelo, Proficiência com Espadas.

   pages/classes/espadachim.html: os 2 blocos .proficiency-box (h3 #proficiencia-com-espadas e #marca-do-duelo) não têm data-kf-*. São 39 data-kf-id na página, só técnicas, marcas e ultimates. js/ficha.js não menciona Marca do Duelo. O contrato classes.espadachim.estados marca a Marca do Duelo como "rastrear": "essencial" e escala +1/+2/+3, e 17 cards da classe (técnicas, marcas e ultimates) a citam. Hoje a característica não entra na ficha.

   *Balanceamento:* Concordo: a Marca do Duelo entra na ficha como estado (contrato classes.espadachim.estados, rastrear: essencial, +1/+2/+3 por nível).

2. **Agiota** · Batedor > Trambiqueiro Tier 1 · baixa · id `batedor-agiota`

   "Endividado" é escrito como condição ("fica X"), mas não existe em data/condicoes.json nem nos aliases do contrato. O efeito está definido na própria técnica (+5 em Convencimento, mais suscetível a ordens). É o mesmo caso de "Marcado" na PD17: fica como texto da fonte, e a ficha não aplica.

   *Balanceamento:* Concordo: "Endividado" é efeito da técnica (como Marcado, PD17), não condição.

3. **Teorema Absoluto** · Teurgo — Ramo do Acadêmico, Ultimate (Tier 3) · baixa · id `teurgo-teorema-absoluto`

   O custo de ação não tem número. O corpo define dois modos, "Conjuração Impecável (1 Ação)" e "Anulação Suprema (Reação)". A ficha precisa representar a técnica como 1 Ação ou Reação, e não como X.

   *Balanceamento:* Concordo: dois modos, Conjuração Impecável (1 Ação) e Anulação Suprema (Reação).

4. **Irmão da Floresta** · Monge — Marca do Naturalista · baixa · id `monge-irmao-da-floresta`

   "Luto Selvagem" vem em itálico, como condição, mas não está entre as 30 de data/condicoes.json. O efeito está escrito na própria marca, então funciona; na ficha precisa entrar como estado temporário da técnica, não pelo seletor de condições.

   *Balanceamento:* Concordo: "Luto Selvagem" é estado temporário da marca, não condição.

5. **Produção em Massa** · Alquimista, técnica geral · baixa · id `alquimista-producao-em-massa`

   "← betovenon." é uma anotação editorial (span em --text-muted) vinda do Notion, e não regra. Aparece em pages/classes/alquimista.html e entra no texto que a ficha copia (textoLimpo). Confirmar com o Pedro se é crédito intencional ou se sai do dado.

   *Balanceamento:* Perguntei ao Pedro (T17).

6. **Itens iniciais: vínculos com o Bazar** · Origens (todas) · baixa · id `origens-itens-bazar`

   O link aponta para um item que não existe no CSV v26. Em 18 das 19 origens, '1 Comida' tem itemId null, embora o Bazar tenha 'Comida (1 porção)', e isso afeta o consumo no descanso (Desnutrido). O '1 Kit de Ferramentas' do Lenhador e do Mineiro não liga a 'Kit de Ferramentas Básico'. O inventário inicial entra na ficha sem item do Bazar.

   *Balanceamento:* Sem nota do balanceamento.

7. **Corrupções sem data-kf-id** · Corrompido (30 linhas de corrupção e adversidade) · média · id `corrompido-corrupcoes-sem-kf`

   Em pages/racas/corrompido.html, as linhas de .corr-table não têm data-kf-tipo nem data-kf-id, embora data/racas/corrompido.json tenha id em cada uma (corrompido-sangue-morto…). Só a v2.1 as pega, por decorarCorrupcao, com id vindo do slug do nome. No protocolo novo, as 30 corrupções não viram entidade.

   *Balanceamento:* Sem nota do balanceamento.

8. **Ficha sem camada de Vulnerabilidade** · Autômato (Corpo Mecânico) e Corrompido (Pele Morta) · média · id `ficha-sem-vulnerabilidade` Vale para: Corpo Mecânico, Pele Morta.

   Sistema > Dano e Defesa: 'Vulnerabilidade a um dano específico sempre o dobra'. O contrato (ordemMitigacao etapa 2) diz 'Vulnerabilidade *2 / Resistencia /2', mas data/ficha.schema.json só tem R, I e ae por tipo, e js/ficha.js não menciona vulnerabilidade. As duas técnicas não cabem na grade de 12 tipos.

   *Balanceamento:* O contrato já mitiga vulnerabilidade (dano.ordemMitigacao etapa 2). Falta o schema da ficha ter V por tipo: Autômato (Elétrico) e Pele Morta (Ordinário, Elemental e Biológico; ver o achado corrompido-pele-morta).

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
4. As respostas casam 1:1 com os achados (o script recusa id sobrando ou faltando). O `trechoAtual` é recalculado a cada
   execução: o trecho é quebrado nas elipses e tags, e cada pedaço vale se ele inteiro, os subpedaços (" · ", " / ", " — ",
   " • ") ou as citações entre aspas dele estão no texto atual. No estado em que os achados foram escritos (main `da5e73d`)
   os 160 trechos saem presentes; hoje saem 157 presentes e 3 ausentes.

Para regenerar: `python tools/log_tecnicas.py` (com `--resumo` imprime os totais). Sem o arquivo de achados o log sai sem
eles, sem o de respostas sai sem `resposta` e `trechoAtual`, e a checagem mecânica continua igual.
