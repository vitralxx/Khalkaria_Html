# A Mesa (especificação, rev. 3, 2026-10-21)

Base:
- plano `02` (M1, §3.1, F5, F5b, F6);
- contrato do balanceamento (`data/balanceamento/ficha-digital-regras.json`): `turno`, `condicoes`, `eventos`, `recargas`, `descanso`, `dano.ordemMitigacao`, `morte`, `rastrear` (P55), `automacao` (P56), `condicoesDuracaoPadrao`;
- Sistema (`data/sistema.json` e o Notion): Sua Rodada, Atacando & Retaliação, Dano e Defesa, Manobras, Críticos e Falhas, Exploração (Jornada), Sobrevivência (Descanso), Equipamento;
- pedidos do Pedro em 2026-10-21: `03 §12` (o pedido), `03 §13` (críticas à 1ª prova) e `03 §14` (críticas à 2ª prova).

Substitui o "UX — Modo Mesa" do M1 e as fases F5, F5b e o resto da F6 do plano `02`. A rev. 3 acrescenta a **confirmação** de todo uso, os **alvos por relação**, o **catálogo de uso** por asset com conferência no build, as **contas por parcelas**, o **benefício do mestre**, o tempo contado pelo **seu turno** e uma fase só de **caça aos bugs**.

Prova de estética: `tools/artefatos/prova-mesa.html`, publicada em https://claude.ai/artifact/HFNhbUq79qQ84ki4cLNN3H.

## 0. O pedido

**Primeiro pedido (`03 §12`):** a Mesa é onde o jogador usa técnicas, perícias, itens, cartas, manobras e tudo o que está no sistema, sem flood e com estilo próprio. Ela **não** rastreia inimigos nem aliados: o alvo é escolhido no tabuleiro real, e a Mesa esclarece a regra, rola e calcula.

**Críticas à 1ª prova (`03 §13`):**
- modos Combate e Exploração;
- a mesa de rolagem no centro;
- o boneco com o equipamento;
- recursos do turno em losangos;
- o trilho de rodadas;
- os favoritos com trava e motivo;
- Habilidades como a seção mais trabalhada;
- nada de comentário interno no texto.

**Críticas à 2ª prova (`03 §14`):**
- **confirmação** antes de qualquer uso, com tudo o que vai acontecer. Num ataque, os dados, os modificadores e a PMA, com "recomeçar a PMA" ao lado (fora no 1º ataque);
- cada asset tem um modo de usar próprio, então "não há escapatória": cada interação ficha→mesa e mesa→ficha tem de ser verificada;
- a **caixa do implícito** (a conta do desarmado, "Nível+3 usos") em todo asset, sem resumo inventado;
- **fórmula em todo campo**: a origem de cada coeficiente e constante, sem texto corrido, com exceção para as regras específicas (o maior entre dois atributos, Vitalidade/Vigor/Ressonância da classe);
- **alvo:** calcular automaticamente por alvo (agarrão, PMA) sem o jogador cadastrar alvos;
- **travas:** um presente do mestre tem de entrar na ficha e destravar, e a conta mostra o valor sem ele;
- **reação volta no início do seu turno**;
- visual em **camadas**, nada esticando a página (trilho, registro), favoritos refeitos, a animação do dado só ao rolar;
- condições com efeito real (Atordoado: −2 ações e −2 Evasão);
- a **Investida** como uma sequência;
- **"tenho medo dos bugs"**: terminar as features e então caçar os bugs.

## 1. O que a Mesa é, e o que não é

**É** a sexta aba da página da ficha, com o mesmo componente em uma coluna no drawer. Nela o jogador:
- vê o que pode fazer agora, com o custo, a regra e o motivo quando não pode;
- **confirma** cada uso vendo antes tudo o que vai mudar;
- rola com a conta à vista, e o dado cai na mesa;
- passa o tempo do **próprio** personagem.

**Não é** rastreador do grupo:
- não guarda inimigos, aliados nem a vez dos outros;
- efeito em outra criatura sai como **texto com os números calculados** ("Fortitude contra CD 15");
- o que só a mesa real sabe (acertou? esquivou? o alvo se soltou?) o jogador informa com um clique, e a Mesa aplica o resto.

## 2. Sete princípios contra bugs

1. **A prévia é a execução.** A confirmação roda o executor numa **cópia** da ficha e mostra a diferença. Confirmar aplica **a mesma** diferença. Um caminho de código só: o que a Mesa promete é, por construção, o que ela faz.
2. **Nada automático sem trecho.** Todo número automático de um asset vem do **catálogo de uso** (§5), e cada campo cita o **trecho verbatim** do texto canônico que o justifica. O build recusa trecho que não está no texto e número que não está no trecho. Asset sem entrada funciona em **uso manual**: texto integral, rolar e ajustar à mão, sem nenhum número inventado.
3. **Nenhuma trava sem saída.** Todo motivo traz o botão que resolve ("Ajustar grau", "Equipar Foco", "Devolver a reação", "Benefício do mestre"). O mestre sempre consegue destravar, e a conta mostra o valor sem o benefício (§7).
4. **Toda conta por parcelas.** Cada número é uma lista curta de parcelas (valor e origem), a mesma na ficha e na Mesa (§6). Erro de conta fica visível para quem joga.
5. **Tempo do próprio personagem.** A rodada da Mesa é o ciclo do **seu turno** (P55: "a ficha conta os turnos dela"). Nada depende de saber a vez dos outros, e não há contador para dessincronizar (§9).
6. **Fronteiras testadas em matriz.** Cada leitura ficha→mesa (atributos, graus, equipamento, condições, recursos, benefícios) e cada escrita mesa→ficha (recursos, usos, quantidade, condições, temporários, turno) tem teste próprio (§11).
7. **Features primeiro, depois a caça.** A Mesa 5 (§12) é só para achar e corrigir bugs, com roteiro por classe. Cada entrada do registro tem a **linha copiável** (pedido do contrato, `automacao.roladorRequisitos`): o jogador cola no grupo e o defeito chega com tudo.

## 3. Usar um asset: a confirmação

Clicar no verbo (Rolar, Usar, Conjurar, Consumir, Aplicar, Arremessar, Ativar, Equipar) **não** age. Ele abre a **confirmação** no pano da mesa, no lugar da placa. Não é um diálogo sobre a página.

```
┌ DANÇA DO MONGE · Técnica do Monge (Tier 1)              Abrir no site ↗ ┐
│ texto integral (recolhível)                                              │
│ COMO       Normal · Vantagem · Desvantagem                               │
│ CONTRA QUEM  [o mesmo alvo · 1 ataque]  [Novo alvo ↺]                    │
│ ROLAGENS   Ataque 1  1d20 + 7   = 1d20 + 3 DES + 4 Experiente            │
│            PMA       −5 (2º ataque neste alvo)                [↺]        │
│            Dano      1d8 Arma Humana + 1d6 Punho Perfeito + 3 DES        │
│ CUSTO      ◆ 1 de 2 ações · 5 Stamina (14 → 9) · requer 3 Fluxo (tem 4)  │
│ NA FICHA   Stamina 14 → 9 · Dança: usada nesta rodada                    │
│ NA MESA    3 ataques desarmados; ao acertar: +1 Fluxo (máx. 2 por rodada)│
│ IMPLÍCITO  Usos: 1x/Rodada · Crítico: 2d8 + 1d6 + 3                      │
│                                 [Cancelar  Esc]  [Confirmar e rolar  ↵]  │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Como:** só os controles que o asset tem. Vantagem e Desvantagem em teste; intensidade da magia só com as que ela aceita; modo quando há mais de um (rolar Místico ou o alvo faz teste de resistência é campo do catálogo, nunca dedução).
- **Contra quem:** só aparece se houver mais de uma relação ativa (§4). O padrão é o alvo do ataque anterior.
- **PMA:** a linha da PMA, com **↺ recomeçar** ao lado. No 1º ataque do turno a linha e o botão não aparecem.
- **Custo** com o antes → depois. Requisito aparece como requisito ("requer 3 Fluxo (tem 4)"), nunca como gasto.
- **Na ficha:** a diferença da prévia (§2.1), linha por linha.
- **Na mesa:** o que cai em outra criatura, com os números prontos.
- **Implícito:** a caixa do implícito do catálogo (§5). Cada linha tem a origem à vista.
- **Enter** confirma e **Esc** cancela, pelo `KhTeclas`. Confirmar rola, aplica e mostra a placa com os **próximos passos**.
- **Os próximos passos não pedem nova confirmação** (Acertou, Errou, Dano, Ataque 2 de 3, Retaliou), porque a confirmação já disse o que cada um faz ("ao acertar: +1 Fluxo"). Todos entram no desfazer.
- **Sequência** (Dança do Monge, Investida): a confirmação mostra os passos. A placa avança passo a passo, e cada passo tem os seus botões (§9.3).

## 4. Alvos por relação (sem cadastrar alvo)

O jogador nunca cadastra alvo. A Mesa cria **alvos anônimos** a partir das ações do próprio personagem e os nomeia pela relação:
- **o alvo dos ataques:** nasce no 1º ataque do turno. "Novo alvo ↺" cria outro, e a PMA conta **por alvo**, como manda a D29 (`turno.pmaEscopo: porAlvo`);
- **o alvo agarrado:** nasce quando o Agarrar vence. Atacar contra ele tem +2 (texto do Agarrar). Termina com "Soltou-se", com "Soltar" ou no fim do combate;
- **o alvo marcado, o alvo do Golpe das Mazelas e outros:** cada asset que liga um efeito a "o alvo" declara a relação no catálogo (`relacao`, pedido J ao balanceamento).

Na confirmação de um ataque, **Contra quem?** mostra as relações ativas ("o mesmo alvo · 2 ataques", "o alvo agarrado · +2", "Novo alvo"). Escolher calcula sozinho:
- a PMA daquele alvo;
- os bônus contra ele;
- o "mesmo alvo" do Fluxo Marcial.

Um alvo pode ter mais de uma relação (o agarrado que já levou 2 ataques). O chip mostra as duas.

**Limite honesto:** a Mesa não sabe se o alvo morreu ou fugiu. O chip tem o ✕ ("Soltou-se", "Caiu"), e a relação termina pelo próprio texto ou no fim do combate.

## 5. Catálogo de uso (um registro por asset)

Os quatro problemas que o Pedro apontou são um problema só:
- a linha curta;
- a caixa do implícito;
- o modo de usar;
- as consequências na ficha.

Para cada asset, a Mesa precisa de um registro conferido. Arquivo: `data/mesa/uso-*.json`, um por fonte.

**Entrada (resumo do schema):**
```
{ id, fonte, usos: [ {
    verbo, acao: {acoes|reacao|livre}, limite: {n|formula, por: turno|rodada|curto|longo|dia|combate},
    custo: [{recurso, n, modo: gasta|requisito}], alternativas: [[...],[...]],
    requisitos: [{tipo: grau|foco|mao|moveu|condicao|..., ...}],
    rolagens: [{papel: ataque|teste|dano|cura|reducao, termos: [...]}],
    testeDoAlvo: {pericia, cd}, intensidades: [...], vantagem: bool,
    efeitos: {eu: [ops], outra: [texto com números]}, duracao, relacao,
    passos: [...], implicito: [{rotulo, termos}],
    trechos: {<campo>: "trecho verbatim"} } ] }
```

**De onde vem cada fonte:**

| Fonte | Quantos (aprox.) | Como nasce | Quem confere |
|---|---|---|---|
| Ações básicas e manobras | ~15 | à mão, do Sistema (texto do Notion) | o balanceamento |
| Condições | 32 | do contrato (`condicoes[].efeitos`, já com alvo, op e valor) | gate de vocabulário (§11) |
| Itens | 727 linhas do Bazar | gerado da tabela de efeitos por gatilho (rev. 11) e das colunas do CSV | o balanceamento já conferiu a tabela |
| Magias | 100 | gerado dos campos de `data/magias.json` (Ação, Alvo, Resist., Alcance, Duração, valores por intensidade) | exceções listadas pelo balanceamento (L) |
| Técnicas (classe, ramo, raça, origem) e cartas ativas | ~400 | **o balanceamento escreve** (pedido H), uma classe por entrega | gates + golden |

**Gates no build (o método do CLAUDE.md §6, automático):**
- **conjunto:** todo `id` existe no catálogo do site; ids repetidos derrubam (Counter);
- **trecho:** cada `trechos[campo]` é substring do texto canônico do asset, depois do normalizador;
- **número:** cada número do campo aparece no trecho, ou vem de um nó do `KhRegras` com nome (Mod.DES, Nível, CD);
- **vocabulário:** `recurso`, `alvo` de efeito, `por`, `papel` e `requisito.tipo` são de listas fechadas. Termo novo derruba o build até entrar na lista;
- **cobertura:** o build imprime, por fonte, quantos assets estão automatizados e quantos em uso manual, e grava `docs/ficha-digital/11-mesa-cobertura.md`. Asset sem entrada não derruba o build: fica manual.

**Uso manual** (asset sem entrada, ou entrada recusada):
- o cartão mostra o texto integral;
- os controles são "Rolar…" (fórmula livre, com as parcelas que o jogador digitar), "Gastar…" (escolhe recurso e quanto) e "Marcar uso";
- **nenhum número inventado.** A linha curta mostra só a ação, quando a fonte a traz (`acao` estruturado nas magias e nos itens).

## 6. Contas por parcelas

Um formato só, na ficha (o `KhConta`) e na Mesa (status, defesa, rolagens, confirmação, placa):

```
Evasão Ativa          13 + 1d8
  10    base
  +3    Mod.DES · DES 16
  +1d8  Defender · Treinado
  ─────
  sem ajuste: 13 + 1d8
```

- **Uma parcela por linha:** valor à esquerda, origem à direita, em palavras curtas. Nada de frase.
- **Regras específicas viram uma etiqueta** sobre as parcelas, nunca uma frase:
  - "o maior: DES ou INT · trocável";
  - "Vitalidade 4 · Monge";
  - "Ressonância 2 · Teurgo";
  - "×2 · Nível".
- **Sai do que se vê:** a fórmula simbólica duplicada da numérica, os selos de status e o "calculado X · ajustado Y" em frase.
- **Ajuste e benefício** são parcelas próprias ("+2 · Benefício: Bênção da Vhelor"). Embaixo, **sem ajuste: X**.
- **Avisos e lembretes** ficam abaixo de um fio, curtos.

É uma mudança do `KhConta` (ficha inteira). Entra na Mesa 1, com o `[estilo]` recapturado.

## 7. Benefício do mestre (travas com saída)

- **Novo tipo de entrada:** `beneficio`, com nome, texto livre, origem ("mestre") e Mods no vocabulário do `KhEfeitos`:
  - soma num derivado;
  - grau mínimo numa perícia ("conta como Treinado em Místico");
  - recurso extra;
  - "conta como ter um Foco de X".
- Fica na ficha numa seção própria (Outros) e entra nas contas como parcela.
- **Na Mesa:** todo motivo de trava tem o botão que resolve, e o último recurso é sempre "Benefício do mestre…". Ele cria a entrada já com o requisito que falta.
- **Os requisitos leem o valor efetivo** (com benefícios), não o estado cru. O grau de perícia continua sendo estado do jogador (editável na ficha), e o benefício soma por cima sem apagar o que estava.
- **Schema 3.1, aditivo.**

## 8. Layout (rev. 3: camadas, nada estica a página)

**O app ocupa a altura da tela.** No PC, a Mesa cabe em `100dvh` menos o cabeçalho. Cada coluna rola por dentro. Nada que o jogador faça aumenta a altura da página: o registro, o trilho e a pilha rolam dentro das próprias caixas.

```
┌ [COMBATE | Exploração]    Ravek · Monge 3                      [↶ Desfazer: Dança]  ┐
├─ PERSONAGEM (340) ─────┬─ TRILHO (altura fixa, rola de lado) ─────┬─ HABILIDADES (400) ┤
│ ┌ retrato ─┐ ┌recursos┐│ [R1 ▪▪] [R2 ▪▪▪] [R3 · agora]             │ abas · busca        │
│ │ boneco   │ │Saúde   ││ ┌─ MESA (madeira e feltro) ───┬ Antes ─┐ │ filtros             │
│ │ 8 slots  │ │Stamina ││ │ dado · placa OU confirmação │ (rola) │ │ cartões (rola)      │
│ └──────────┘ │Éter    ││ │                             │        │ │                     │
│ ┌ defesa ──────────────┐│ └─────────────────────────────┴────────┘ │                     │
│ │ Evasão · Ativa · Ar  ││  estado · Registro · [ENCERRAR MEU TURNO]│                     │
│ └──────────────────────┘│ ┌ CINTO: 8 favoritos em uma fileira ───┐ │                     │
│ ┌ turno ───────────────┐│ └──────────────────────────────────────┘ │                     │
│ │ ◆◆◆ ◇ ∞ magia mover  ││                                          │                     │
│ └──────────────────────┘│                                          │                     │
│ ┌ condições ───────────┐│                                          │                     │
└─────────────────────────┴──────────────────────────────────────────┴─────────────────────┘
```

- **Camadas:** três planos de cor.
  - **Fundo** (o mais escuro).
  - **Placas:** cada bloco com borda, luz no topo e sombra embaixo. São elas: retrato, recursos, defesa, turno, condições, trilho, mesa, cinto e cada cartão.
  - **Poços:** fundo rebaixado para números e barras dentro da placa.
  - Os blocos se separam pelo plano, não por linha.
- **Personagem:** o retrato (boneco e os 8 espaços) numa placa própria; ao lado, os recursos em placa própria; embaixo, defesa, turno e condições, cada um na sua placa, com título pequeno em versalete.
- **Trilho:** altura fixa. Cada rodada é um medalhão com o número e uma tira de marcas:
  - ◆ ação;
  - ◇ reação;
  - ▲ dano recebido;
  - ✚ cura;
  - ✦ recurso de classe.
  - O resumo completo aparece ao passar o mouse e ao clicar (filtra a pilha). Rola de lado e nunca quebra linha.
- **Mesa:** altura fixa. A **placa** e a **confirmação** dividem o mesmo pano. A pilha "Antes" fica na borda direita, com rolagem própria.
- **Registro completo:** abre **sobre o pano**, dentro da moldura da mesa, com rolagem própria e "Fechar". Não empurra nada.
- **Cinto de favoritos:** uma fileira de 8 encaixes do mesmo tamanho, sob a mesa, na largura da coluna do meio. Cada encaixe tem o ícone do tipo, as gemas de custo, o nome em 2 linhas e uma linha de estado. Obscurecido com o motivo na linha de estado. Encaixe vazio é um contorno pontilhado.
- **Animação do dado:** só quando nasce uma rolagem nova (chave = id da rolagem). Redesenhar a placa por outro motivo não anima.
- **Drawer:** uma coluna, na ordem retrato+recursos → mesa → cinto → habilidades. O resto recolhe.

**Habilidades (como na rev. 2):**
- abas Combate/Exploração, Técnicas, Magias, Itens, Perícias e Cartas;
- busca;
- filtros Ação · Reação · Livre e "Só o que posso usar";
- cartão fechado com gemas, nome, linha mecânica, motivo, verbo e ★;
- cartão aberto com fonte e link, texto, implícito e conta.

O verbo abre a confirmação.

## 9. Regras de turno e de ação

### 9.1 Tempo (P55)

- **Rodada = do início do seu turno ao início do próximo.** O combate começa na rodada 1, e "Começar meu turno" a partir do 2º turno abre a rodada seguinte. O botão "Nova rodada" sai.
- **No início do seu turno:**
  - a reação volta (Pedro, `03 §14`);
  - ações, magia do turno, Mover, livres e alvos da PMA recomeçam;
  - "1x/Rodada" volta;
  - os ganhos por rodada do recurso de classe zeram, e o Fluxo zera se a rodada anterior não teve ganho;
  - acabam os temporários "até seu próximo turno" e "nesta rodada" e o Atordoado;
  - tiques de Morrendo, Em Chamas e Envenenamento.
- **Encerrar meu turno:** acabam os temporários "até o fim do seu turno". **Não gasta a reação.**
- **Fim do combate:** zeram o Fluxo, a Brutalidade e a Concentração; acabam os temporários e as condições de combate e as relações de alvo.
- **Exploração:** fim da cena, descanso curto (2d6 em 2 status, máx. 2 por dia), descanso longo (Xd8 pela comodidade) e novo dia.

### 9.2 Ações e manobras

Texto do Notion. O que o Pedro disse no chat e ainda não está no Notion fica marcado (pedido G):

| Ação | Custo | Na Mesa |
|---|---|---|
| Mover | 1 ação, 1x por turno | marca "moveu" |
| Pular | 2 ações | 1/3 do Movimento |
| Acelerar | 1 ação | +3 m nesta rodada. "Só utilizável após movimentar-se" (Pedro, falta no Notion) |
| Defender | 1 ação | +2 Defender até seu próximo turno. Notion: "Não acumula com ela mesma". Pedro: "Utilizável mais de uma vez por turno". **Contradição, perguntada** |
| Defender (reação) | reação | dado de Defender na Evasão contra o agressor neste turno |
| Retaliar | reação | o texto da Retaliação (9.4) |
| Empurrar · Desarmar · Agarrar | 2 ações cada (Pedro, falta no Notion) | disputa Movimento×Fortitude ou Movimento×Movimento. O Agarrar vencido cria a relação "o alvo agarrado" (§4) e ocupa 1 mão |
| Investida | 2 ações, conta como o Mover | sequência (9.3) |

### 9.3 Sequências

**Investida** (Notion):
1. Confirmação: 2 ações e o Mover do turno. Os passos aparecem listados.
2. A placa pede o **teste de Movimento contra o 1º inimigo**.
3. **Sucesso** → ataque como ação livre contra ele (com a PMA desse alvo) → "Próximo inimigo na linha" ou "Fim da linha".
4. **Falha** → interceptado: ataque como ação livre contra ele, e a Investida acaba.
5. Cada inimigo da linha é um alvo novo (PMA própria).

A **Dança do Monge** usa o mesmo mecanismo: 3 ataques, cada um com o seu alvo.

### 9.4 Retaliação (Sistema)

**Quando você ataca**, a placa do ataque tem os desfechos:
- Acertou;
- Errou;
- Retaliou: ele te ataca e também recebe o seu dano → rola o seu dano e abre "Recebi dano";
- Retaliou com crítico: o seu dano é negado → abre "Recebi dano";
- Falha crítica dele: o seu ataque é crítico → dano crítico.

Empate: o atacante ganha.

**Quando você retalia** (reação):
1. O jogador informa o valor do ataque dele.
2. A Mesa rola o seu Atacar e compara: ultrapassou → você o ataca e também recebe o dano dele; 20 natural → nega o dano dele; 1 natural → o ataque dele é crítico; empate → ele ganha.
3. À distância não retalia. O motivo vem do alcance da arma na mão.

### 9.5 Condições (contrato)

Os efeitos vêm de `condicoes[].efeitos` (alvo, op, valor) e entram nas parcelas.
- **Exemplo, o Atordoado:** −2 ações e −2 Evasão, até o início do seu próximo turno.
- **Cada `alvo` do contrato tem um destino na Mesa:**
  - `acoes`: os losangos perdidos ficam pontilhados;
  - `evasao`: a parcela entra na Evasão;
  - `pericia.*` e `tag.*`: entram nos testes;
  - `semAcao` e `semReacao`: o motivo de trava;
  - `danoPorRodada`: o tique no início do turno;
  - `lembrete`: chip.
- **Gate:** um `alvo` sem destino derruba o build.

## 10. Modelo de dados (schema 3.1, aditivo; até a virada só o Ensaio grava)

- **`ficha.mesa`:**
  - `modo`, `combate`, `rodada`, `noTurno`, `turnosNoCombate`;
  - `acoesGastas`, `reacaoGasta`, `magiaNoTurno`, `moveu`, `livresNoTurno`, `naRodada`;
  - `ganhos` (por rodada, com teto), `ganhouNaRodada`;
  - `alvos`: `[{uid, relacoes:[{tipo, fonte, desde}], ataquesNoTurno, acertosNoTurno, critico}]`;
  - `sequencia` (`{fonte, passo, restam}`);
  - `descansosCurtosHoje`, `favoritos` (8), `grupo`.
- **Mãos:** `entrada.estado.mao`. Duas mãos e duas armas seguem pendentes (E).
- **`ficha.temporarios[]`:** `{uid, fonte, mods, duracao, desde}`. Duração: `{ate:'inicioTurno'|'fimTurno'|'proximoAtaque', n}` ou um evento (`fimCombate`, `fimCena`, `descansoCurto`, `descansoLongo`, `novoDia`, `manual`). "Nesta rodada" = `inicioTurno`.
- **`entradas[]` tipo `beneficio`** (§7).
- **Registro** (sessão, fora do `rev`): por entrada, `combate`, `rodada`, rótulo, marcas do trilho, rolagem, parcelas, diferença aplicada e a linha copiável.

## 11. Motor e testes

**Motor (puro, testado antes da tela):**
- **`KhDados`:** NdX+K, vantagem e desvantagem, crítico e falha pelo dado usado; semente nos testes.
- **`KhUso`:**
  - carrega o catálogo de uso;
  - valida (os gates do §5, também no node);
  - monta o uso de cada asset da ficha;
  - sem entrada → manual.
- **`KhMesa`:**
  - `motivo` (com o botão que resolve);
  - `previa(ficha, uso, escolhas)` = executar numa cópia → `{placa, diferenca}`;
  - `executar` = aplicar a mesma diferença;
  - `evento` (§9.1);
  - `alvos` (§4);
  - `receberDano` (`ordemMitigacao`, temporária, recurso de classe, Sangramento, Exposto);
  - `ganhos`.
- **`KhConta` rev.** (§6).

**Testes:**
- **gates do catálogo:** um caso que passa e um que derruba, para cada gate;
- **prévia = execução:** para cada uso automatizado, a diferença da prévia é igual à aplicada, e o desfazer devolve a ficha byte a byte;
- **golden por asset:** fichas de teste (uma por classe, nível 1 e 3) e a confirmação esperada de cada uso. Gerado uma vez, conferido contra o texto, congelado; qualquer mudança derruba e pede revisão;
- **matriz ficha↔mesa:**
  - cada leitura: atributo, grau, benefício, equipamento na mão, sintonia, condição, recurso, ajuste;
  - cada escrita: recurso, usos, quantidade, condição, temporário, turno, alvo;
  - pelo menos um uso que dependa de cada uma;
- **condições:** as 32, uma por vez, com o que muda (Atordoado: ações 3 → 1 e Evasão −2);
- **tempo:** fronteiras do §9.1 dentro e fora do próprio turno; reação volta no início do turno; encerrar não gasta;
- **alvos:** a PMA por alvo, o +2 do agarrado, o Fluxo Marcial no mesmo alvo, o Novo alvo, o "Soltou-se", o fim do combate;
- **sequências:** a Investida com 0, 1 e 3 sucessos; a Dança com 3 alvos;
- **retaliação:** os 5 desfechos e o empate.

## 12. Fases

Cada fase: build verde, `[estilo]` recapturado quando o CSS muda, conferida no navegador, publicada atrás da prévia `?ficha=v3`.

| Fase | Entrega | Depende de |
|---|---|---|
| **Mesa 0** | Prova de estética. 2ª versão aprovada em parte. **3ª versão publicada em 2026-10-21:** camadas, altura fixa, trilho em medalhões, cinto de favoritos, registro sobre o pano, confirmação, alvos por relação, condições pelo contrato, Investida e retaliação, contas por parcelas | aprovação do Pedro |
| **Mesa 1** | Motor puro e as bases:<br>• `KhDados`, `KhUso` (schema, gates, cobertura, manual), `KhMesa` (prévia, executar, eventos, alvos, condições pelo contrato, Recebi dano, ganhos)<br>• benefício (schema 3.1)<br>• `KhConta` por parcelas na ficha toda<br>• catálogo de ações básicas e manobras<br>Testes e gates | o balanceamento conferir as básicas (G) |
| **Mesa 2** | A aba: layout rev. 3, confirmação, combate básico (armas, Desarmado, básicas, manobras, Investida, retaliação), perícias, condições, exploração e descansos. A rodada simulada fecha | Mesa 0 e 1 |
| **Mesa 3** | Itens (catálogo gerado da tabela de efeitos) e magias (gerado dos campos, com as exceções do L), boneco e mãos | Mesa 2 |
| **Mesa 4** | Técnicas e cartas pelo catálogo do balanceamento, **uma classe por entrega**, cada uma com golden e conferida no navegador. Raças e origens no fim | Mesa 3 e o H por classe |
| **Mesa 5** | **Caça aos bugs:**<br>• roteiro de sessão por classe (7), em combate e em exploração, no PC e no drawer<br>• matriz completa<br>• o Pedro joga no Ensaio e manda as linhas copiadas<br>• correções com teste de regressão por defeito | Mesa 4 |

A virada (F4.7) vem depois da Mesa 5 e só com o ok do Pedro.

## 13. Balanceamento

**Respondido** (`02b3391`, `20-tabela-efeitos-resposta.md` §5):
- a cura não passa do máximo, nos três status;
- a reação é gasta no turno do atacante, e encerrar o próprio turno não gasta;
- "Passiva • N recurso" é custo por uso;
- "A ou B" é escolha;
- custo variável se escolhe dentro do único uso por turno (D126);
- D155 refez a D154 (o maior por padrão, com troca manual);
- C3 confirmada.

**Ainda abertos da rev. 2:** B (vira o H), C (divisão por modo), D (vira o J), E (mãos), as 9 perguntas da auditoria 09.

**Pedidos da rev. 3:**
- **G. Notion:**
  - gravar o que o Pedro disse no chat (`03 §14`): Acelerar só após mover; manobras com 2 ações; a reação volta no início do **seu** turno (conferir com "até o início do próximo");
  - perguntar ao Pedro a contradição do Defender (1 ação): "Não acumula com ela mesma" × "Utilizável mais de uma vez por turno";
  - conferir o catálogo de ações básicas e manobras que o site vai escrever.
- **H. Catálogo de uso** (substitui o B), no schema do §5, com `trechos` verbatim em todo campo:
  - técnicas de classe e de ramo, raça e origem, e cartas ativas;
  - uma classe por entrega, começando pelo Monge;
  - inclui o implícito ("Nível+3 usos" → `{rotulo:'Usos', termos:[Nível, +3], trecho}`).
- **I. Tempo:** confirmar a rodada como o ciclo do seu turno e o mapeamento das durações ("nesta rodada", "até seu próximo turno", "1x/Rodada", Fluxo "1 rodada sem ganhar", ganhos por rodada).
- **J. Relações de alvo:** listar todo asset que muda os números **do personagem** contra um alvo específico (Agarrar +2, Marca do Duelo, Golpe das Mazelas, Fluxo Marcial, Marcada a Morte…), com a relação, quando nasce e quando termina.
- **K. Condições:** conferir que `condicoes[].efeitos` cobre a Mesa (os destinos do §9.5) e fechar as durações pendentes (D16).
- **L. Magias:**
  - quais não aceitam Contida (além do Nível 1);
  - quais rolam Místico e quais pedem teste de resistência;
  - o que dos campos de `magias.json` não basta para montar o uso.

Enquanto não chega: a Mesa usa a leitura escrita aqui, e o que depende do H fica em uso manual.
