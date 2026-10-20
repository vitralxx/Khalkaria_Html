# Auditoria das mensagens do motor da ficha (commit 194c865)

## Método e limites

- Rodei o motor em node (`KhRegras.avaliar` sobre `00-regras-dados.js` e `data/efeitos.json`). Para ver o que o jogador lê, passei o resultado por `KhPrevia.listaAvisos`.
- A árvore principal de `Khalkaria_Html` tem alterações não commitadas de outra sessão (`kh-estado.js`, `kh-ficha-abas.js`, `kh-previa.js`, `tecnologia.json`, `pages/racas/*`, `validar.py` e outros). Por isso extraí o 194c865 com `git archive` numa pasta temporária. Os números de linha abaixo valem para esse commit.
- Não editei nem commitei nada no repositório. Os scripts ficaram no scratchpad (`harness.js`, `matriz.js`, `bordas.js`, `checks.js`, `selos.js`, `condicoes.js`).
- Cobertura: 4.116 fichas válidas (7 raças × variantes/subespécies e sem, × 7 classes × ramos e sem, × níveis 1, 3 e 5, com e sem escolhas de raça), mais ~690 casos de borda.
- Casos de borda: ficha vazia; atributos de 0 a 31; recursos atuais negativos e acima do máximo; todas as 30 condições; 727 itens do Bazar com efeito; 100 magias × 4 intensidades; 127 cartas; 30 corrupções; 16 tecnologias.
- O resumo vem logo abaixo e as tabelas por categoria seguem. O que a classe de tabela não cobre (atributos extremos, condições, ajustes) está no fim da seção "Mensagens".

**Resumo.** O motor emite poucas mensagens e as contas conferem com o contrato. Os 20 pares custo × intensidade de magia batem com a `tabelaCusto` do contrato. Os efeitos de condição que testei batem com `data/condicoes.json`.

O problema é o silêncio:
- Quase todas as validações que o contrato manda "avisar" não existem.
- Há efeitos numéricos ignorados sem nenhum aviso.
- Há quatro falsos positivos e vários textos com token cru ou jargão interno.

## Mensagens que o motor produz

Contagem: nas 4.116 fichas válidas, ou nos casos de borda quando indicado. A coluna "evidência" aponta o arquivo e a linha da regra no motor.

| Mensagem (verbatim) | Classificação | Quando dispara (contagem, ficha-exemplo) | Evidência | Correção sugerida |
|---|---|---|---|---|
| `Inseto: os atributos variam por subespécie, e a ficha não tem uma` | CORRETA (o Pedro confirmou) | 392/4.116, Inseto sem `subespecie`, inclusive só com `variante: inseto-besouro`. O Movimento fica `?`. | kh-efeitos.js:144 | Acrescentar o que fazer: "escolha Besouro, Louva-a-Deus ou Barata". Com só `variante` o motor aplica o Ar natural do Besouro mas não os atributos; unificar. |
| Lembrete `Ofício(Ferraria\|Engenharia\|Alquimia) exige treino para fabricar` | CORRETA e ruído | 4.116/4.116, em toda ficha com grau 0 (3 linhas por ficha). O Sistema diz "Você não pode utilizar essa perícia sem tê-la treinada". | kh-regras.js:419 | Mostrar só ao tentar fabricar ou sair do tooltip. O Alquimia vale só para o Alquimista (contrato `pericias`, `exclusivaDaClasse`) e isso não é checado. |
| Lembrete `Evasão Ativa: gasta a reação; vale contra todos os ataques daquele agressor no turno dele` | CORRETA | 4.116/4.116 | kh-regras.js:596 | Nenhuma (confere com o CLAUDE.md §2). |
| `Alerta: Morrendo\|Exaurido\|Oco: <Saúde\|Stamina\|Éter> atual ≤ 0 (entra sozinha)` | CORRETA com ficha preenchida; FALSO POSITIVO em ficha nova | Dispara em ficha com atual 0 e máximo > 0, como a ficha recém-criada: `novaFicha` grava atual = 0 e ninguém ajusta o atual quando o máximo sobe. Exemplo: caso "ultimate nível 1" (sem recursos preenchidos). | kh-regras.js:1196-1197; criação em kh-estado.js:183 | Inicializar atual = máx. e seguir o máximo ("aoAumentarMax: somaDiferenca", contrato `recursos`). Hoje nenhum código faz isso (grep em kh-edicao/kh-editor/kh-ensaio). "entra sozinha" é jargão. |
| `<Recurso> atual 999 acima do máximo 34 (o grampo corta, L06)` | TEXTO RUIM (promete corte que não existe) | 16 casos de borda. A edição aceita −9999 a 9999 (kh-edicao.js:65, 171) e nada corta. "L06" é código interno. | kh-regras.js:1199 | Trocar por "acima do máximo (34); corrija o valor atual". Ou implementar o grampo `atual = min(atual, max(0, novoMax))` do contrato (`recursos.grampoObrigatorio`). |
| `Saúde atual −100 abaixo de −⌊Saúde máx. / 2⌋ = −17 (estado final: só alerta, nada é aplicado)` | CORRETA (a regra confere com `recursos.saude.morteEm`) / TEXTO RUIM | `atual < −⌊máx/2⌋`; −17 ainda não dispara (estritamente "ultrapassar"). Mesma família: `Exaustão 5: morte (estado final…)`. | kh-regras.js:1137, 1152-1161 | Texto de jogador: "Saúde abaixo de −17: o personagem morre (o mestre decide)". Tirar "estado final" e o "nada é aplicado". |
| `Éter atual −50 abaixo de −⌊Éter máx. / 2⌋ = −9: personagem vai para o mestre (…) [PENDENTE (balanceamento)]` | CORRETA com selo FALSO | O selo vem de `estadosFinaisSt = semStatus`. A regra é canônica no Oco ("ao ultrapassar metade do seu éter máximo nos negativos, você perde seu personagem") e o contrato registra a fonte em `recursos.eter.perdePersonagemFonte`. | kh-regras.js:1152-1161; dados `morte.limites.eter.st` | Pergunta ao balanceamento: carimbar `canonico` em `estadosFinais` e em `recursos.eter`. |
| `Desnutrido zerou a Saúde máx. (estado final…) [PENDENTE (balanceamento)]` | CORRETA (o selo é legítimo: `estadosFinais` de desnutrido não tem status) | Desnutrido 10 com Saúde máx. 34. | kh-regras.js:1149 | O mesmo ajuste de texto e a mesma pergunta acima. |
| `6 magias sustentadas; o máximo é 1 (D16)` | CORRETA (`magia.sustentada.maxAtivas = 1`) / jargão | Mais de 1 magia com `sustentando`. | kh-regras.js:1203 | Tirar "D16". |
| `Força: FOR 31 fora de 1–30` | CORRETA | Total fora de 1–30 (contrato `atributos.faixa.absoluta`). O 8–18 da criação não é checado, o que está certo: o contrato diz que 7 e 19 são possíveis. | kh-regras.js:309 | Nenhuma. |
| `Custo em Éter — X: Magias de Nível 1 não possuem a intensidade Contida` | CORRETA | `estado.intensidade = contida` em magia de nível 1 (D68). | kh-regras.js:832 | Nenhuma. |
| `Custo em Éter — Vislumbre: Normal fora das intensidades da magia (transbordante)` | FALSO POSITIVO (e custo errado) | Magia adicionada com `intensidade: null` (o padrão de `estadoPadrao`). 14 magias só têm Transbordante: Vislumbre, Reversão Umbral, Confissão do Éter e 11 de nível 5. O motor assume `normal`: Vislumbre fica com custo 0 (deveria ser 4); Fissura da Alma fica com 8 (deveria ser 12). | kh-regras.js:901, 836 | Intensidade padrão = a única permitida (ou a primeira de `info.intensidades`). A lista de intensidades vem em ids sem acento ("normal/forcada/transbordante"): usar `NOME_INT`. |
| Lembrete `Nível 5 exige Foco Primordial (Experiente em Mistico)` | CORRETA e incompleta / texto | 82 vezes, em toda magia de nível 5. "Mistico" está sem acento (vem do contrato). O motor não confronta isso com o nível do personagem nem com o grau de Místico. Teurgo nível 1 com magia nível 5 não gera aviso. | kh-regras.js:879 | Virar aviso quando nível do personagem < 5 ou Místico < Experiente (contrato `magia.focoPrimordial`). Acento. |
| `Pontos do Limiar: N cartas sem posição na mão: o saldo não as desconta` | CORRETA para posição vazia / TEXTO RUIM para posição 6+ | Também dispara com `posicaoNaMao = 6` ou mais, que existe mas é inválida (só 1 a 5 contam). A mensagem diz "sem posição". | kh-regras.js:1034-1043 | Diferenciar "posição inválida (1 a 5)" de "sem posição". Posição duplicada (duas cartas na 2ª) também não avisa. |
| `Pontos do Limiar: saldo do Limiar negativo (aviso, sem trava)` | CORRETA | Saldo < 0. Nível 1 com carta posição 2 também dispara (saldo 0 − 2). | kh-regras.js:1045 | Tirar o parêntese. |
| `Stamina disponível: reserva comprometida (0) maior que a Stamina atual (−5)` | TEXTO RUIM / FALTA | É o único sinal de Stamina negativa (D93: a Stamina não fica negativa). A mensagem fala de reserva, e a reserva é 0. | kh-regras.js:1017 | Aviso próprio: "Stamina atual negativa: o mínimo é 0". |
| `Recurso de classe: a ficha tem o contador "Fúria" (atual 3); pelo contrato (D105) … não é contador, então o número fica só como anotação` | CORRETA / jargão | Espadachim ou Teurgo com contador digitado. | kh-regras.js:547 | Tirar "contrato" e "D105". |
| `Pontos de ajuste`: `Ajuste em recurso.saude.max recusado (valor-invalido)`; `ajuste em magia.xxx.custo sem campo calculado na ficha`; `Saúde máx.: o calculado mudou de 10 para 34` | CORRETA / TEXTO RUIM (caminho e código crus) | Só com ajuste manual ou migrado. | kh-ajustes.js:68, 76, 88, 99; kh-regras.js:1190 | Usar o rótulo do campo em vez do caminho. |
| `Motor: x-acima-do-maximo` e `Motor: condicao-desconhecida` | TEXTO RUIM (token cru) | Exaustão 6 vira 5 em silêncio; o aviso não diz qual condição nem o máximo. `Motor:` também não diz nada ao jogador. | kh-efeitos.js:93, 104; kh-previa.js:321 | Preencher `msg`: "Exaustão 6 passa do máximo (5); contado como 5". |
| `Motor: Efeitos de item (data/efeitos.json) não carregados…` junto de `Efeitos de item indisponíveis: itens e armas fora das contas.` | TEXTO RUIM (duplicada) | Efeitos não carregados e inventário não vazio. As duas linhas dizem a mesma coisa. | kh-efeitos.js:248; kh-previa.js:328 | Manter uma só, sem o nome do arquivo. |
| `<Item> soma em FOR… por cima do total digitado na v2… (migração; pendente Pedro)` | CORRETA (só ficha migrada) | `migradoTotal` com item que dá atributo. | kh-efeitos.js:283 | Nenhuma. |
| Lembretes crus no tooltip: `Lembrete: falhaAuto`, `semAcao` (24 perícias com Exaurido), `fixa`, `permiteSemTreino` | TEXTO RUIM | Adormecido, Inconsciente, Morrendo e Paralisado (falha automática em Fortitude, Vontade e Reflexos); Exaurido ("não pode rolar perícias"); Invisível (Furtividade); Bigorna Portátil. O `lembretes()` não grava `msg`, e o KhConta mostra `a.msg \|\| a.op`. | kh-regras.js:258-266; kh-conta.js:150 | Dar `msg` por op: "falha automática", "não pode rolar", "passa em Furtividade sem rolar", "pode fabricar sem treino". Um Exaurido gera 24 linhas iguais: agrupar. |
| Lembrete `+1 Reacao Maxima` (Evasão Passiva e Ativa) | TEXTO RUIM (acento) | Abismo "Esquiva Lendária". O texto vem do contrato. | kh-regras.js:285-288 | Corrigir acento (contrato) e deixar só na Ativa. |
| Lembrete `dado de Defender = 2d6 quando o dado do seu grau for menor (Leigo a Mestre)…` | CORRETA, mal posicionada | Corrompido com Premonição Etérica, aparece também na Evasão Passiva, que não tem dado. | kh-regras.js:285-288 | Mostrar só na Ativa. |
| Termo `Força/Primordial fica em "Outros", sem Ae de categoria (o CLAUDE.md §2 põe em Místico)` | TEXTO RUIM (obsoleto) | O CLAUDE.md §2 já diz "Outros: Força, Primordial". Aparece no tooltip de `defesa.forca` e `defesa.primordial`. | kh-regras.js:804 | Remover o parêntese. |
| `Ae(Ordinário): Ae(Ordinário) não existe (D67): é Ar…` | CORRETA / jargão | Valor em `aeCategoria.ordinario`. | kh-regras.js:761 | Tirar "D67". |

**Selos (por nó), com fonte:**

| Selo | Quando aparece | Observação |
|---|---|---|
| `classe em rework` (avisoClasse) | 588/4.116, só no nó `recurso.classe.max` do Batedor | Sem texto que explique. Ver o Batedor abaixo. |
| `PENDENTE (balanceamento)` | Evasão (e a Ativa, que herda) com Dryad Cascaferro, Autômato Fibra de Carbono, Monge Evasivo, carta Sombra Dançante, Dores Obvio e Esquiva Lendária. Condições Enjoado, Caído, Cego, Surdo, Agarrado/Enraizado, Invisível, Paralisado. | Vem de `semStatus`, ou seja, o contrato não carimbou. As fontes são claras no Notion: Dryad Cascaferro diz "+1 Armadura (Ar) Natural e +1 Evasão", Enjoado diz "-5 em Fortitude. -2 Evasão" e Caído diz "movimento se torna 1,5 m… defende com -2". Pergunta ao balanceamento. |
| `PENDENTE PEDRO` e `decisão do Pedro, falta Notion` | Nunca dispara hoje | O código está pronto, sem fonte com esse status. |

## FALTA (situação irregular que o motor não acusa)

Confirmado rodando o caso, salvo onde está indicado "(só por leitura do código)". O contrato `progressao.validacoes` manda "avisar" em pontosDoLimiar, dorDoAbismo, corrupcaoMaxima, contagemDeTecnicas, tiers e marcas, e `magia.requisitos.validar: avisar`. Só os Pontos do Limiar existem.

| # | O que falta | Caso rodado | Fonte da regra |
|---|---|---|---|
| 1 | Técnicas acima de 3+nível | 30 técnicas de Espadachim no nível 1 (limite 4): lista vazia | contrato `progressao.tecnicasFormula` e `validacoes.contagemDeTecnicas` |
| 2 | Tier acima do nível (1→nv 2, 2→nv 4, 3→nv 5) | ultimate no nível 1: nada | `progressao.ramos.porNivel`, `validacoes.tiers` |
| 3 | Marcas acima do nível (1 no nv 3, 2 no nv 4, 3 no nv 5) | 3 marcas no nível 1: nada | `validacoes.marcas` |
| 4 | Magia sem Treinado em Místico ou sem Foco da escola (D123) e mais de 1 Foco (`avisoPorFoco`) | Espadachim com 2 magias, Místico 0, sem foco: nada | contrato `magia.requisitos` (linha 2738, `validar: avisar`, `aprovado`) |
| 5 | Magia de nível maior que o do personagem; Teurgo com escolas acima de 2/3/5; magias de nível 1 acima de 1+Mod | Teurgo nv 1 com magia de nível 5 e 4 escolas: só o lembrete do Foco Primordial | `progressao.teurgo.acesso`, `escolas`, `magiasNivel1` |
| 6 | Armaduras acima do limite (1 pesada, 2 leves) | 3 pesadas / 5 leves equipadas | Sistema: "equipar até 1 armadura pesada… até 2 leves". O KhInv calcula (kh-inv.js:197-202) e vai em `nos.carga.extra.avisos`, que nem `listaAvisos` nem a ficha nova leem. Só o drawer v2 mostra (ficha-v2.js:882-888). |
| 7 | Mais de 3 itens sintonizados nos Avisos | 5 sintonizados: a lista Avisos fica vazia | Existe só no tooltip do tile "Sintonizados" (kh-ficha-abas.js:912), fora de `listaAvisos`. A cópia que não acumula, o item fora do registro e o "fora da regra" têm o mesmo destino (só leitura do código). |
| 8 | Requisito de item (183 itens com `requisito`, ex.: adagas pedem Destreza ≥ 12) | Adaga de Kali com atributos 8: nada | `efeitos.json`: `requisito`/`requisitoTexto` ignorados em kh-efeitos.js e kh-regras.js |
| 9 | Carta sem o requisito de atributo (`req`, ex.: Músculos de Ogro = FOR 16+) | FOR 8 com a carta: nada | `catalogo/carta.json`: `req` |
| 10 | Carta no nível 1; carta especial sem pontos distribuídos | só aparece como termo inativo no tooltip | `progressao.criacao.semLimiarNaCriacao`; `limiar.porMao.sextaCarta` |
| 11 | Corrompido: teto de corrupção (2/5/9/14/20), soma de pontos ≥ 0 | nv 3 com as 30 corrupções (teto 9): nada | contrato `progressao.corrupcaoMax`, `checklistDeNivel` ("Teto de Corrupcao: automatico"); `racas/corrompido.json` (intro e `custo` por corrupção) |
| 12 | Recurso de classe acima do máximo ou negativo (Fluxo, Instinto, Brutalidade, Reagentes, Concentração) | Fluxo 99 (máx. 5): nada | O alerta `acima-do-maximo` só cobre Saúde, Stamina e Éter (kh-regras.js:1194-1199). |
| 13 | Stamina negativa | Stamina −5: só Exaurido e o aviso de reserva | contrato `recursos.stamina.min = 0` |
| 14 | Escolha de atributo da raça pendente (Humano, Dryad, Gruto, Corrompido) | Humano sem escolhas: lista vazia; o bônus de raça some das contas | Só aparece como motivo do termo inativo (kh-efeitos.js:~150). |
| 15 | Efeitos numéricos que o motor ignora, sem aviso | Rokhan (+10 Saúde) e Skal'ri (+5 Éter) não mudam o máximo; Sangue Morto (+5 Éter, +5 Stamina), Vigor Místico, Difusão de Éter e Passo Trêmulo (−3 m) idem. As 127 cartas, 210 técnicas, 42 marcas, 19 origens e 16 tecnologias têm `mods` vazios, e `fontes` cobre só 24 ids. | O contrato lista esses casos em `recursos.ordemMaximo.bonusFixo`; o texto está nos cards (`variante.json`: "+10 Saúde máxima"). Os máximos aparecem como certos. |
| 16 | Efeito de condição que nenhum nó mostra | Oco ("Você não consegue canalizar magias", −5 Éter por perícia falha) e Desnutrido ("gasta o dobro de Stamina para tudo"): zero lembrete | `condicoes.json`; hoje só o Exaurido gera lembrete. |
| 17 | Nível fora de 1 a 5 | `meta.nivel = 7` vira 5 em silêncio | kh-regras.js:~190 |
| 18 | Habilidade acima do recurso (Artilheiro) | nada | contrato `classes.artilheiro.recursos[0].regraDaFicha`: mostrar a técnica desabilitada com o motivo. |
| 19 | Perícias iniciais fixas da classe e Ofício(Alquimia) fora do Alquimista | nada | contrato `classes.*.periciasIniciais`, `pericias` |

## Pontos pedidos

**Batedor (rework).**
- O motor mostra Instinto máx. 5 com o selo "classe em rework" e mais nada.
- O contrato marca o bloco como `canonico-mas-em-rework` e traz o `_alertaDeDesenho`: o "BUG CONHECIDO" do zero ao falhar qualquer perícia.
- O motor não avisa disso.
- Não modela os gastos (Pressentimento X, Sexto Sentido 2, Segundo Fôlego 3, Golpe Instinto 4, Instinto Reativo 5).
- Não alerta Instinto acima de 5.
- O +2 de Evasão do Sexto Sentido está em `naoResolvidos` (fora do catálogo).
- Recomendo um texto no selo: "o Instinto está em revisão: o máximo (5) e o zeramento podem mudar".

**Corrompido.** Nenhuma corrupção entra nas contas, só a Premonição Etérica (Evasão +1 e o lembrete do dado de Defender). Não há conceito de teto nem de balanço (FALTA 11 e 15). O Receptáculo Natural (conjura 2 magias de nível 1 sem foco, com Vontade CD 12) não é verificado.

**Autômato.** Nenhuma mensagem. As 16 tecnologias não têm `mods`. Fibra de Carbono (+1 Evasão) entra com selo pendente. A regra D23 (aviso ao curar Autômato, "Poções e Elixires não funcionam em você") está planejada para a F6 e nada avisa hoje.

**Teurgo.**
- O recurso aparece como "Escolas do Primórdio", sem contador. Isso confere com D105.
- Escolas (2/3/5), magias por nível, Foco e Místico não são checados (FALTA 4 e 5).

**Monge (Fluxo).** Máx. 5 confere com o contrato. Fluxo acima do máximo ou negativo não alerta. O Evasivo usa o Fluxo atual como valor, mas o selo pendente na Evasão não explica por quê.

**Alquimista (Reagentes).** `3 × nível + Mod.INT` confere (nível 3, INT 16: 12). Reagentes acima do máximo não alerta.

**Espadachim e Teurgo (D105).** O motor segue o contrato. Mas `data/classes/espadachim.json:133` e `teurgo.json:120` ainda dizem `status: pedroDecide`, `id: null`, "O nome e a mecânica ainda não estão no Notion nem no contrato". O CLAUDE.md §2 (linha 23) repete isso. O contrato D105 já responde: Espadachim = Proficiência com Espadas e Marca do Duelo; Teurgo = Escolas do Primórdio.

## REGRA DUVIDOSA

| Regra aplicada pelo motor | Fonte A | Fonte B |
|---|---|---|
| Defender é `fisica`: Sobrepeso, Envenenamento, Exaustão 1 e Desnutrido dão −2 ou desvantagem em Defender, e isso desce para a Evasão Ativa (caso rodado: `evasao.ativa 12 + 1d6 → 10 + 1d6`). | Contrato `pericias` (linha 1179): `defender.tags = ["fisica"]`, mas "não soma atributo nenhum". | Sistema/condições: "testes que possuem Força, Destreza ou Constituição como atributo base". Defender não tem atributo (CLAUDE.md §2). |
| Convencimento e Enganação (DES/INT) só como `social`, mesmo com DES escolhido; Intimidação é `fisica` e `social`. | Contrato `pericias` | Mesma frase do Sistema: pelo atributo base, DES escolhido seria físico. |
| Selo `PENDENTE (balanceamento)` em regras que o Notion escreve com número (ver Selos). | Contrato `derivados.evasao.modificadores` sem `status` | Cards de Dryad Cascaferro, Enjoado e Caído |

## Lista priorizada de correções do site

1. Intensidade padrão da magia = a única permitida (14 magias). Evita o falso aviso e o custo errado (kh-regras.js:901).
2. Ficha nova: inicializar atual = máx. e seguir o máximo (contrato `aoAumentarMax` e `grampoObrigatorio`). Isso elimina os três alertas falsos de Morrendo, Exaurido e Oco. Corrigir ou implementar o "grampo" do aviso de "acima do máximo".
3. Avisar sobre efeitos que o motor ignora. No mínimo, um aviso ou lembrete por entrada ("+10 Saúde máx. ainda não entra nas contas") para Rokhan, Skal'ri e as corrupções. Opcional: ligar esses casos a `fontes`.
4. Avisar "escolha de atributo da raça pendente".
5. Levar para `listaAvisos` os avisos do KhInv (pesada/leve/sintonia/cópia/órfão/fora-da-regra).
6. Implementar os avisos que o contrato manda: técnicas 3+nível, tier, marcas, Corrompido (teto e balanço), D123 (Místico e Foco, um Foco por vez), escolas do Teurgo, magia acima do nível, cartas sem `req`, itens sem `requisito`, Stamina negativa, classe acima do máximo.
7. Textos:
   - Preencher `msg` dos lembretes e avisos que hoje saem com token cru: `falhaAuto`, `semAcao`, `fixa`, `permiteSemTreino`, `x-acima-do-maximo`, `condicao-desconhecida`.
   - Tirar jargão (D16, L06, D67, D105, "contrato", "estado final: só alerta, nada é aplicado", "entra sozinha").
   - Acentos: Mistico, Reacao Maxima, Concentracao.
   - Remover a menção obsoleta ao CLAUDE.md.
   - Deduplicar "Efeitos de item indisponíveis".
   - Separar "posição inválida" de "sem posição" nas cartas.
   - Lembrete do Ofício só ao fabricar.
   - Premonição Etérica só na Evasão Ativa.
   - Texto no selo do Batedor.
8. Sincronizar `data/classes/espadachim.json`, `data/classes/teurgo.json` e CLAUDE.md §2 com o D105 do contrato.
9. Aviso de nível fora de 1 a 5, de posição duplicada de carta e de carta no nível 1 (ver FALTA 10 e 17).

## Perguntas ao balanceamento

1. Defender conta como teste "físico" (atributo base FOR/DES/CON) para Sobrepeso, Envenenamento, Exaustão 1 e Desnutrido, já que não tem atributo? E Convencimento/Enganação com DES escolhido?
2. Carimbar `status: canonico` nos modificadores de Evasão e nas condições que o Notion escreve com número: `dryad-variante`, `automato-fibra-de-carbono`, `limiar-sombra-dancante`, `abismo-obvio`, `abismo-esquiva-lendaria`, `monge-evasivo`, Enjoado, Caído, Cego, Surdo, Agarrado/Enraizado, Invisível, Paralisado.
3. Carimbar `canonico` em `morte.estadosFinais` e `recursos.eter.perdePersonagemEm`. A regra vem do Oco, mas o alerta sai com selo pendente.
4. Os efeitos numéricos de variantes e corrupções (Rokhan +10 Saúde; Skal'ri +5 Éter e +1,5 m; Sangue Morto, Vigor Místico, Difusão de Éter −10, Passo Trêmulo −3 m etc.) podem entrar em `fontes` com `quando`/`status`? Hoje só 24 ids estão lá.
5. Corrompido: confirmar a regra de corrupção como contagem. Os `custo` dos 30 itens (−1 a −5 poderes, +1 a +5 adversidades) somados devem ser ≥ 0 e o gasto ≤ teto 2/5/9/14/20? Corrupção positiva é reorganizável no descanso longo e a negativa é permanente. Isso precisa ir para o contrato como regra.
6. Magia de nível 5 exige "Foco Primordial (Experiente em Místico)": o gate é nível 5 do personagem, grau Experiente em Místico, ou os dois? Hoje o contrato diz "Primordial requer nível 5" e "destravaNivel 5".
7. Magias que só têm Transbordante (14): confirmar que a intensidade padrão é a única existente. Para Vislumbre (nível 1, Transbordante) o custo é 4?
8. Oco e Desnutrido: o jogador-ficha deve ver lembretes de "não canaliza magias" e "dobro de Stamina"? Em que nó (conjuração, custo de Stamina)?
9. Instinto do Batedor (rework): o que a ficha deve exibir até o rework? Máx. 5 com o aviso de bug, ou ocultar o recurso?

Observação à parte: a lista `Migração: …` e `Pendência: … (grau N)` de `listaAvisos` (kh-previa.js:305-314) vem da migração v2 e não entrou nesta auditoria. O fallback dessas linhas também imprime `a.tipo` cru.
---

## Como ficou (2026-10-20)

Tudo atrás da prévia (`?ficha=v3`); a ficha v2.1 dos jogadores não mudou. 486 testes node + validar OK.

1. **Intensidade padrão** = a única que a magia tem (`intensidadePadrao`): as 14 só-Transbordante abrem nela, com o custo certo e sem aviso falso. Ids viram nome legível (Forçada etc.).
2. **Atual acompanha o máximo** (`KhRegras.acompanharMaximos`, `D.recursos.acompanha`): sobe a diferença; quando o máximo desce, grampo `min(atual, max(0, novoMax))`. Ficha nova nasce no máximo: some o Morrendo/Exaurido/Oco falso. O recurso de classe só acompanha se o medidor nasce no máximo (Reagentes). Mesmo passo do desfazer.
3. **Avisos novos** (nunca travam): técnicas > 3 + nível; Tier/Marca acima do nível; magia acima do nível, sem Treinado em Místico ou sem o Foco da escola (D123), mais de 1 Foco; escolas do Teurgo; carta sem o requisito ou no nível 1; item sem o requisito; sintonia e armaduras (avisos do KhInv); escolha de atributo pendente; nível fora de 1–5. Alertas: Stamina negativa (D93), recurso de classe acima do máximo ou negativo. Corrupção: soma e teto lado a lado, sem aviso.
4. **Fora das contas**: efeito com número no texto e sem Mod vira selo no card + aviso agregado "N efeitos ainda não entram nas contas (aguardando o balanceamento)". Nenhum número inventado.
5. **Textos**: sem token cru, sem jargão interno (D16, L06, contrato…), acentos na exibição, Ofício e Premonição Etérica só no nó deles, selo do Batedor com o texto do rework, Inseto pede "Besouro, Louva-a-Deus ou Barata".
6. **D105**: `data/classes/espadachim.json` e `teurgo.json` com `recursoDeClasse` canônico sem contador (características); o validar confere contra o contrato. Texto visível das páginas inalterado.

**Ficou para o balanceamento** (perguntas 1–9 acima): Defender como teste físico, selos semStatus de Evasão/condições, gate do nível 5, Oco/Desnutrido como lembrete, Instinto do Batedor, comparação teto × soma de corrupção. As linhas `Migração:`/`Pendência:` da `listaAvisos` (migração v2) ficam para a revisão da F4.7.
