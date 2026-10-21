# A Mesa (especificação, rev. 2, 2026-10-21)

Base:
- plano `02` (M1, §3.1, F5, F5b, F6);
- contrato do balanceamento (`data/balanceamento/ficha-digital-regras.json`): `turno`, `eventos`, `recargas`, `descanso`, `dano.ordemMitigacao`, `morte`, `rastrear` (P55), `automacao` (P56), `condicoesDuracaoPadrao`;
- Sistema (`data/sistema.json`): Sua Rodada, Atacando & Retaliação, Dano e Defesa, Manobras, Críticos e Falhas, Exploração (Jornada), Sobrevivência (Descanso), Equipamento (Armaduras, Escudo, Item Mágico, Focos);
- pedidos do Pedro em 2026-10-21: o primeiro (`03 §12`) e as críticas à prova (`03 §13`).

Esta especificação **substitui** o "UX — Modo Mesa" do M1 e as fases F5, F5b e o resto da F6 (partes 3 e 4) do plano `02`. A rev. 2 refaz o layout a partir das críticas do Pedro à 1ª prova.

Prova de estética: `tools/artefatos/prova-mesa.html`, publicada (2ª versão) em https://claude.ai/artifact/HFNhbUq79qQ84ki4cLNN3H.

## 0. O pedido

**Primeiro pedido (03 §12):**
- alguns itens só fazem sentido em combate, e por isso a Mesa também simula o combate, sem ser a única função dela;
- a Mesa é onde o jogador usa técnicas (de raça, classe, origem e outras), perícias, itens, cartas do Limiar, manobras e tudo o que está no sistema;
- tudo ordenado, sem flood, com um estilo próprio;
- a Mesa **não** rastreia inimigos nem aliados. O alvo é escolhido no tabuleiro real. A Mesa esclarece a regra, rola os dados e calcula atributos, status, perícias e os itens do inventário.

**Críticas à 1ª prova (03 §13):**
- a Mesa **rastreia turnos**: atacar duas vezes sem passar o turno dá a PMA −5 no segundo ataque. Isso pede um modo **Combate** e um modo **Exploração**;
- o registro deixa de ser uma lista e vira o **centro da tela**, uma mesa de RPG onde os dados aparecem, sem perder utilidade;
- painel do personagem com um **boneco** e os espaços de equipamento: mão esquerda, mão direita, 1 armadura pesada, 2 leves e 3 itens mágicos sintonizados; o resto no inventário;
- recursos do turno: ações em losango (gasta = amarelo-escuro), reação em losango oco, ação livre compacta, magia (pode ou não conjurar: Foco na mão e Treinado em Místico) e movimento;
- condições numa barra abaixo do boneco, com "+ condição";
- "Encerrar meu turno" na mesa; o combate vira um interruptor Combate | Exploração no canto de cima; ao começar o combate, a ficha fica a uma aba de distância (não no drawer), mas a versão do drawer também existe e funciona;
- o botão "Tempo" sai; as rodadas viram um **trilho** acima da mesa, com o resumo do que aconteceu com o personagem em cada rodada;
- a Mão continua (favoritar qualquer coisa), mas o que não cumpre o requisito fica **obscurecido e não clicável, sempre com o motivo**. Consumir item não exige pô-lo na mão;
- **Habilidades** é a seção mais trabalhada: abas Combate, Técnicas, Magias, Itens, Perícias e Cartas, com favoritar, usar, arremessar, aplicar, ativar, quantas ações custa, toda a informação e o link para a regra. Os filtros Ação, Reação e Livre ficam;
- cuidado com os textos do site: nada de comentário interno. As frases-resumo das técnicas da 1ª prova foram escritas à mão, e isso não escala sem risco de erro.

## 1. O que a Mesa é, e o que não é

**É** a sexta aba da página da ficha, com o mesmo componente em uma coluna no drawer. Nela o jogador:
- vê o que pode fazer agora, com o custo, a regra e o motivo quando não pode;
- rola com a conta à vista, e o dado cai na mesa;
- paga o custo (ações, reação, Stamina, Éter, recurso de classe, usos, quantidade) e vê o que mudou;
- passa o tempo do **próprio** personagem: rodadas e turnos em combate; cena, descansos e dia em exploração.

**Não é** rastreador do grupo:
- não guarda alvo, agressor nem a vez dos outros;
- efeito que cai em outra criatura aparece como **texto com os números calculados** ("Fortitude contra CD 15"), e só o que é do personagem muda a ficha;
- o que depende do alvo (acertou? esquivou?) o jogador informa com um clique ("Acertou", "Errou", "Esquivei", "Fui atingido"), e a Mesa aplica o resto (Fluxo, Colar da Sanguessuga, Sangramento).

**PMA sem alvo.** O Sistema diz "Ataques consecutivos contra o mesmo alvo somam −5 a cada ataque no mesmo turno". A Mesa conta os ataques seguidos do turno e aplica −5 por ataque anterior (a leitura do Pedro). O botão **Novo alvo** recomeça a sequência sem guardar quem é o alvo. A mesma sequência dá o "terceiro ataque com Vantagem" do Fluxo Marcial (dois acertos na sequência). Pergunta 9.D ao balanceamento.

**Trava com motivo** (muda o "nunca trava" da rev. 1, por ordem do Pedro): o que não cumpre o requisito fica obscurecido, não clicável e com o motivo escrito. O motivo nunca prende o jogador, porque todo número da ficha é editável à mão (o losango de ação, a reação, os recursos), como já é a regra da ficha.

## 2. O que muda no plano (otimizações)

| # | Antes | Agora | Por quê |
|---|---|---|---|
| 1 | `sessao.agressorAtual`; Evasão Ativa "só contra o agressor atual" | Sai. Defender (reação) rola e mostra a Ativa; "Esquivei" e "Fui atingido" seguem dali | Pedido do Pedro e P55 |
| 2 | Estado do turno na sessão, com "desfazer multi-parte" | O estado do turno fica dentro da ficha (`ficha.mesa`, no `rev`): **um desfazer só**. As rolagens ficam no registro (sessão) e não são desfeitas | Corta a peça mais frágil do M1 |
| 3 | Cartão, executor e teste por fonte | **Um modelo de ação** (`KhAcao`), **um executor** (`KhMesa.executar`), **um cartão** | Uma superfície de código e de teste em vez de seis |
| 4 | Temporários sem lugar definido | `ficha.temporarios[]`: Mods com duração, coletados pelo `KhEfeitos` | O mesmo caminho dos Mods de item |
| 5 | F5, F5b e F6 partes 3–4 separadas | Fases **Mesa 0–4** (§8) | O efeito com duração precisa do relógio da Mesa |
| 6 | Custo de técnica lido do `custoTexto` por regex | **Tabela do balanceamento** (pedido 9.B): custo, requisito, usos, rolagem, teste do alvo, dano, duração e modo de cada técnica, manobra e ação básica. Sem regex | Decisão do Pedro: nenhum custo errado. O Fluxo é requisito; a Concentração do Artilheiro é gasta; vírgula soma, "ou" é alternativa |
| 7 | Duração em turnos ou num evento | `{ate:'inicioTurno'\|'fimTurno'\|'fimRodada'\|'proximoAtaque', n}` ou `{ate:<evento>}` | "nesta rodada" (Acelerar, Transcendência) e "no próximo ataque" (Golpe das Mazelas) existem no texto |
| 8 | Registro como lista à direita | **A mesa no centro**: o dado cai no pano, a placa mostra total, conta, o que mudou e os próximos passos; a pilha "Antes" guarda as últimas 8; "Registro completo" abre a lista por rodada | Pedido do Pedro, sem perder a lista |
| 9 | Tempo num menu | **Trilho de rodadas** acima da mesa, com o resumo de cada rodada tirado do registro (ações e saldo de recursos); "Nova rodada ▸" no fim; em exploração, os eventos viram botões na borda da mesa | O menu "Tempo" não abria nada útil |
| 10 | "Mão" (atalhos) | **Favoritos** (até 8) | "Mão" agora é o espaço de equipamento (mão esquerda e direita) |
| 11 | Equipado sem lugar | **Boneco** com 8 espaços: 2 mãos, 1 pesada, 2 leves, 3 sintonias. A mão alimenta o ataque (arma), a magia (Foco) e o Defender (escudo) | Pedido do Pedro; a regra já existe no Sistema |
| 12 | Resumo de técnica escrito à mão | A linha curta é **montada só de campos** (custo, rolagem, CD, dano, duração, usos). O texto integral vem ao abrir. Ver §3.7 | Sem risco de paráfrase errada |
| 13 | F4.6d (campos que faltam) separada | Condições ativas, Saúde temporária e quantidade de itens entram na Mesa 1–2, que precisa delas | Evita fazer duas vezes |

## 3. Organização da aba

Três colunas no PC; uma coluna no drawer e em tela estreita (container query no próprio componente, o mesmo código).

```
┌ [COMBATE | Exploração]                                   [Desfazer: X]   ┐
├─ PERSONAGEM ────────┬─ TRILHO: Rodada 1 · Rodada 2 · Rodada 3 (agora) ▸ ┬─ HABILIDADES ──────┐
│ boneco + 8 espaços  │ ┌─ MESA (madeira e feltro) ───────────┬─ Antes ─┐ │ Combate Técnicas … │
│ Saúde/Stamina/Éter  │ │        [d20: 14]                    │ entrada │ │ busca              │
│ recurso de classe   │ │  DANÇA DO MONGE · ATAQUE 1 DE 3      │ entrada │ │ Ação Reação Livre  │
│ Recebi dano · Curar │ │            21                        │ …       │ │ ◆ Atacar … [ROLAR]★│
│ Evasão · Ativa · Ar │ │  1d20 [14] + 7                       │         │ │ ◇ Defender (reação)│
│ ◆◆◆  ◇  ∞  magia  m │ │  [Acertou][Errou][Dano][Ataque 2 +2] │         │ │ …                  │
│ condições  + cond.  │ └──────────────────────────────────────┴─────────┘ │                    │
│                     │  Combate · rodada 3 · seu turno  [Registro] [ENCERRAR MEU TURNO]          │
│                     │ FAVORITOS (8)                                       │                    │
└─────────────────────┴─────────────────────────────────────────────────────┴────────────────────┘
```

### 3.1 Topo

- **Interruptor Combate | Exploração**, no canto de cima à esquerda. Entrar em combate dispara `inicioCombate` (rodada 1, recurso de classe ao valor inicial, Iniciativa à mão na placa). Sair dispara `fimCombate`.
- **Desfazer**, com o nome do que volta ("Desfazer: Dança do Monge").
- Ao entrar em combate, a página da ficha mostra a Mesa; as outras abas da ficha continuam como abas, a um clique. O drawer tem a mesma Mesa em uma coluna.

### 3.2 Personagem (coluna da esquerda)

- **Boneco** com os 8 espaços. Clicar num espaço abre o item (texto do Bazar), o alerta de requisito ("Requisito: Treinado em Místico") e as trocas possíveis vindas da mochila. Sintonia troca só no descanso longo (texto do Sistema no popover).
- **Recursos** ao lado do boneco: Saúde (com a temporária), Stamina, Éter e o recurso de classe (o Fluxo em losangos; o Espadachim e o Teurgo não têm contador, D105). Cada um com ±.
- **Recebi dano** e **Curar** (a cura nunca passa do máximo, em nenhum status: Pedro).
- **Defesa:** Evasão, Ativa (com o dado do grau), Ar, CD e Ae.
- **Recursos do turno** (só em combate):
  - Ações: losangos amarelos; gasto = amarelo-escuro; perdido por condição (Lento) = pontilhado. Clicáveis para corrigir;
  - Reação: losango oco, um por reação máxima;
  - Livre: ∞, com a regra no título (técnica livre 1x por turno);
  - Magia: "pode" ou "não pode", com o motivo (Treinado em Místico, Foco da escola na mão, uma magia por turno);
  - Mover: o Movimento efetivo e se já moveu.
  - Em exploração essa linha vira "Fora de combate as ações não são contadas" (pendente da divisão dos modos, 9.C).
- **Condições:** chips com X; os temporários (tracejados, com a duração: "nesta rodada", "até o seu próximo turno"); "+ condição". O chip abre o texto integral, X ±, Remover e, no Caído, "Levantar (1 ação)".

### 3.3 Mesa (centro)

- **Trilho:** um cartão por rodada do combate atual, com as ações daquela rodada e o saldo de recursos ("Saúde −7 · Fluxo +2"). Clicar filtra a pilha por rodada. **Nova rodada ▸** para quando o mestre vira a rodada antes do seu turno.
- **Pano:** os dados caem (forma por tipo, d4 a d20; cor pelo papel: teste, dano, cura, redução). Vantagem mostra os dois d20, com o descartado apagado. Embaixo, a **placa**: rótulo, total, crítico ou falha, a conta, as notas (PMA, Golpe das Mazelas, Cego), o texto citado, o que mudou na ficha e os **próximos passos** (Acertou / Errou, Dano, Ataque 2 de 3, Esquivei / Fui atingido, Em mim / Em outra criatura).
- **Pilha "Antes":** as últimas 8 entradas; clicar traz de volta para a placa.
- **Borda:** estado ("Combate · rodada 3 · seu turno"), **Registro completo** (lista por rodada) e o botão de latão **Encerrar meu turno / Começar meu turno**. Em exploração: Fim da cena, Descanso curto (máx. 2 por dia) e Descanso longo (comodidade 1–5), cada um com a escolha dos 2 status.

### 3.4 Favoritos

Até 8, sob a mesa. Qualquer coisa com ★: técnica, manobra, item, perícia, carta. O que não pode agora fica obscurecido com o motivo ("Já usada nesta rodada", "Reação gasta · volta na próxima rodada", "Exige Treinado em Místico"). O que é só de um modo mostra "Só em combate". Consumível não depende das mãos.

### 3.5 Habilidades (coluna da direita)

- **Abas:** Combate (Exploração no outro modo), Técnicas, Magias, Itens, Perícias, Cartas, com a contagem.
- **Busca** em tudo; filtros **Ação · Reação · Livre**; **Só o que posso usar**.
- **Cartão fechado:** gemas de custo (◆ por ação, ◇ reação, ○ livre, — sem custo, ? quando o Sistema não dá o custo) · nome (×quantidade) · linha mecânica · motivo, se houver · o verbo (Rolar, Usar, Conjurar, Consumir, Aplicar, Arremessar, Ativar, Equipar) · ★.
- **Cartão aberto:** a fonte e **Abrir no site ↗** (a âncora da regra), o texto integral, controles (Normal / Vantagem / Desvantagem; intensidade da magia com o Éter), a **conta** de cada número, e ações extras (Dano, Dano crítico, Novo alvo). No Atacar, a sequência da PMA ("1º +7 · 2º +2 · 3º −3") com o próximo em destaque.
- **Combate:** Ataque (cada arma na mão e o Desarmado), Ações (Defender, Mover, Acelerar, Pular), Reações (Defender, Retaliar, Ataque de oportunidade), Manobras (Empurrar, Desarmar, Agarrar, Investida).
- **Exploração:** Jornada (Guiar, Motivar, Vigiar, Outros, CD 15, com os pontos para o grupo) e ações do Descanso curto (Tratar Ferimentos, Meditar, Relaxar, Comer Refeição).
- **Técnicas:** por origem (classe, ramo, raça, origem, outras) e **Sempre valendo** recolhido com as passivas (texto integral).
- **Itens:** Consumíveis; Equipado; Sintonizados (com o interruptor do situacional, ex.: Capa em penumbra); Mochila (Equipar).
- **Perícias:** grade das 24 com total, grau e atributo; bônus situacional ligado aparece no ladrilho.
- **Cartas:** as de uso ativo; as passivas entram em Sempre valendo.

### 3.6 No drawer

O mesmo componente em uma coluna: personagem (boneco recolhível), mesa com a pilha embaixo, favoritos e habilidades. A prova mostra isso com "Ver como no drawer".

### 3.7 Textos (regra do Pedro)

O que aparece na Mesa é só:
1. **texto canônico verbatim** (técnica, item, carta, condição, regra do Sistema), ao abrir o cartão, no popover ou citado na placa;
2. **linha mecânica** montada de campos (custo, rolagem, CD, dano, alcance, duração, usos) e **contas** com a origem de cada parcela ("1d8 (Arma Humana) + 1d6 (Punho Perfeito) + 3 (DES)");
3. **microtexto fixo** desta lista, revisado aqui: Acertou, Errou, Esquivei, Fui atingido, Novo alvo, Em mim, Em outra criatura, Nova rodada, Começar meu turno, Encerrar meu turno, Registro completo, Só o que posso usar, Abrir no site, Antes, Sempre valendo, "pode / não pode", os motivos ("Já usada nesta rodada", "Reação gasta · volta na próxima rodada", "Fora do seu turno", "Sem ações neste turno", "Faltam ações (1 de 2)", "Já moveu neste turno", "Stamina 9 de 10", "Requer 3 Fluxo (tem 2)", "Usada · volta no descanso curto", "Acabou", "Exige Treinado em Místico", "Sem Foco de X na mão", "Já conjurou uma magia neste turno", "Desprevenido: não pode reagir", "Só em combate").

Nada de comentário sobre como a ficha foi pensada. A 1ª prova tinha frases-resumo de técnica escritas à mão; na 2ª elas saíram, e na Mesa real a linha curta vem dos campos da tabela do balanceamento (9.B).

## 4. Estilo da aba

Ideia: **mesa de taverna** dentro da moldura gótica da ficha.
- **Mesa:** borda de madeira escura com veio e um fio de luz; feltro verde-escuro com vinheta e anéis rúnicos dourados bem apagados no centro.
- **Dados:** SVG por tipo (d4 triângulo, d6 quadrado, d8 losango, d10 pipa, d12 pentágono, d20 hexágono com face). Cor pelo papel: teste em osso, dano em rubro, cura em verde, redução em âmbar. Caem em 0,7 s com giro e o número sorteando; com `prefers-reduced-motion`, aparecem parados. 20 natural ganha brilho dourado; 1 natural, rubro.
- **Placa:** rótulo em Cinzel versalete, total grande em Cinzel, conta em Crimson.
- **Botão do turno:** latão, na borda da mesa.
- **Losangos:** ação disponível amarela, gasta amarelo-escuro; reação em contorno.
- **Tokens:** os de `css/tokens.css` mais um grupo novo da mesa (madeira, feltro, osso, dano, cura, redução), declarado lá. CSS em `css/ficha-mesa.css`, injetado só com a prévia.

## 5. Modelo de dados

Schema 3.0, mudanças aditivas. Até a virada (F4.7) só o Ensaio grava.

- **`ficha.mesa`** (no `rev`, no desfazer):
  - `modo` (`combate` | `exploracao`), `combate` (contador, para agrupar o registro), `rodada`, `turnoNaRodada`, `noTurno`;
  - `acoesGastas`, `reacaoGasta`, `magiaNoTurno`, `moveu`, `livresNoTurno` (ids), `naRodada` (ids com "1x/Rodada");
  - `sequencia`: `{ataques, acertos, critico}` (PMA, Fluxo Marcial, dano crítico) e `{fonte, restam}` para técnica de vários ataques (Dança do Monge);
  - `ganhos`: contadores por rodada com teto, lidos do recurso de classe (Fluxo: Acerto 2x, Defender-se 1x, Mover-se 1x por rodada) e `ganhouNaRodada`;
  - `vantagem` (a escolha do cartão Atacar), `descansosCurtosHoje`;
  - `favoritos` (até 8 referências), `grupo` (a última aba).
- **Mãos:** `entrada.estado.mao = 'esq' | 'dir' | null` nas armas, Focos e escudos. As armaduras e a sintonia já existem (`equipado`, `sintonizado`). Arma de duas mãos e duas armas: pendente (9.E); até lá, nada trava, e mais de 1 Foco avisa (só o Foco Duplo do Teurgo permite 2).
- **`ficha.temporarios[]`:** `{uid, fonte, mods, duracao, desde}`.
- **Duração:** `{ate:'inicioTurno'|'fimTurno'|'fimRodada'|'proximoAtaque', n}`, `{ate:'fimCombate'|'fimCena'|'descansoCurto'|'descansoLongo'|'novoDia'}` ou `{ate:'manual'}`.
- **Usos:** `entrada.estado.usos = {gastos, max, recarga}`.
- **Registro** (`khalkaria_ficha_v3_sessao:<id>`, fora do `rev`): cada entrada com `combate`, `rodada`, rótulo, curto (para o trilho), rolagem, conta, mudanças e o saldo por recurso (`delta`). O trilho é derivado dele.

## 6. Motor (puro, testado antes da tela)

- **`KhDados`:** NdX+K, vantagem e desvantagem (no Defender, o dado duas vezes), `crypto.getRandomValues`, semente nos testes. Crítico e falha só no dado usado, pela margem de ameaça.
- **`KhAcao.de(fonte, ctx)`:** `{id, grupo, secao, nome, fonte, link, custo:{acoes, reacao, livre, recursos, requisitos, usos, quantidade}, rolagens, linha, conta, texto, verbo, modo}`.
  - Fontes: arma na mão, Desarmado, ação básica, manobra, ação de exploração, perícia, magia, item, técnica, carta.
  - Técnicas, manobras e ações básicas: da tabela do balanceamento (9.B). Números do `KhRegras`, nunca conta nova.
- **`KhMesa.motivo(ficha, acao)`:** a ordem do §3.7 (requisito próprio, usos, quantidade, 1x/rodada, livre 1x/turno, Desprevenido, reação, fora do turno, ações, Mover, recursos, requisito de recurso de classe). Em exploração, sem as checagens de turno (9.C).
- **`KhMesa.executar(ficha, acao, escolhas)`:** paga e aplica num passo de desfazer; devolve a **placa** `{rotulo, rolagem, conta, notas, citacoes, mudancas, seguintes[]}`. `seguintes` são os próximos passos (Acertou, Dano, próximo ataque), também executados por ele.
- **`KhMesa.evento(ficha, nome)`:** a lista do contrato, em ordem fixa:
  - **inicioCombate:** rodada 1; recurso de classe ao valor inicial (`medidores[].inicio`); usos de combate de volta;
  - **novaRodada:** reação de volta (Pedro: "no início da próxima rodada você sempre ganha +1 reação"); "1x/Rodada" de volta; temporários `fimRodada` acabam; recurso de classe com "rodada sem ganhar" zera;
  - **começarTurno:** se o turno anterior foi nesta rodada, dispara `novaRodada` antes; ações, magia, Mover, livres e sequência de ataque de volta; tiques de Morrendo, Em Chamas e Envenenamento (D31, D86); temporários `inicioTurno` acabam; Atordoado acaba;
  - **encerrarTurno:** temporários `fimTurno` acabam. **Não gasta a reação** (Pedro);
  - **fimCombate:** Fluxo, Brutalidade e Concentração zeram; temporários e condições de combate acabam;
  - **fimCena**, **descansoCurto** (2d6 em 2 status; volta o "1x/curto"; máx. 2 por dia), **descansoLongo** (Xd8 em 2 status pela comodidade; volta tudo de descanso; comida e luz, D17), **novoDia**.
- **`KhMesa.receberDano(ficha, {valor, tipo, ataque})`:** a `ordemMitigacao`; a temporária primeiro; o recurso de classe com `aoReceberDano` (Fluxo a 0); se foi ataque, Sangramento X (lembra +Xd4 Biológico, desce 1, botão para rolar) e Exposto sai.
- **Acertou / Esquivei:** o ganho do recurso de classe pelos tetos por rodada (`ganhos`); itens com gatilho no dano (Colar da Sanguessuga +1 Saúde, até o máximo).

## 7. Testes

Os do M1 que continuam valendo, menos os de agressor, e mais:
- uma ação de cada fonte, de um inventário fixture: o cartão aparece e some quando a entrada sai;
- `motivo`: um caso por motivo da lista, nos dois modos;
- executar → desfazer devolve a ficha byte a byte, com o turno junto;
- PMA: 1º, 2º, 3º; Novo alvo recomeça; Transcendência desliga na rodada; Fluxo Marcial dá Vantagem no 3º com 2 acertos;
- tetos de ganho do recurso de classe por rodada; "rodada sem ganhar" zera; receber dano zera;
- eventos: começar o turno duas vezes na mesma rodada vira a rodada; encerrar não gasta a reação; Nova rodada devolve a reação;
- durações nas fronteiras (`inicioTurno`, `fimTurno`, `fimRodada`, `proximoAtaque`), aplicadas dentro e fora do próprio turno;
- Recebi dano: um caso por etapa da `ordemMitigacao`, mais temporária, Sangramento, Exposto e Fluxo;
- mãos: Foco na mão libera a escola; escudo soma no Defender (reação) e tira 1,5 m;
- rodada simulada completa só pela Mesa, e uma exploração (Jornada, descanso curto e longo).

## 8. Fases

Cada fase: build verde, `[estilo]` recapturado quando o CSS muda, conferida no navegador, publicada atrás da prévia `?ficha=v3`.

| Fase | Entrega | Depende de |
|---|---|---|
| **Mesa 0** | Prova de estética. 1ª versão (layout em faixas) recusada em partes pelo Pedro; **2ª versão publicada** (personagem com boneco, mesa no centro, trilho, favoritos, habilidades, modos, drawer) | aprovação do Pedro |
| **Mesa 1** | Motor puro: `KhDados`, `KhAcao` (arma, Desarmado, básicas, manobras, exploração, perícias, magias, itens), `KhMesa` (`motivo`, executar, eventos, temporários, condições, Recebi dano, ganhos), schema (`ficha.mesa`, mãos, temporários, condições ativas, Saúde temporária, quantidade). Só testes | — |
| **Mesa 2** | A aba: personagem, mesa, trilho, favoritos, Combate/Exploração e Perícias, no Ensaio. A rodada simulada fecha | Mesa 0 e 1 |
| **Mesa 3** | Itens (consumir, aplicar, arremessar, usar, cargas, eventos com duração; D23, `soParaRaca`, Vhelor), equipamento no boneco e Magias (conjurar, intensidade, sustentada) | Mesa 2 |
| **Mesa 4** | Técnicas e Cartas pela tabela do balanceamento (custo, usos, Ativar), busca e filtros completos; o drawer | Mesa 3 e a tabela (9.B) |

A virada (F4.7) continua só com o ok do Pedro. Até a virada, tudo roda no Ensaio.

## 9. Balanceamento

**Respondido pelo Pedro (2026-10-21, `03 §13`):**
- nenhum status passa do máximo ao ser curado (Saúde, Stamina, Éter, recurso de classe);
- encerrar o próprio turno não gasta a reação; Retaliar, Defender (reação) e certas técnicas gastam; a reação volta no início da próxima rodada, 1 por padrão, e técnicas podem aumentar;
- custo de técnica numa tabela do balanceamento; Fluxo é requisito; a Concentração do Artilheiro é gasta a cada uso; vírgula no custo é complementar.

**Pedido ao balanceamento (SendMessage de 2026-10-21; a resposta vem por commit na branch dele):**
- **A.** Gravar as três respostas acima no contrato. Conferir o "até o início do próximo" da retaliação (Sistema) com o "início da próxima rodada" (Pedro).
- **B.** Tabela de técnicas, manobras e ações básicas: ação, custos (gasta ou requisito), alternativas, usos e recarga, requisitos, rolagem, teste do alvo, dano, duração, PMA e modo. A linha curta da Mesa sai dela.
- **C.** Divisão das mecânicas por modo (Combate × Exploração), com a proposta do §3.2 e quatro perguntas: magia 1 por turno e técnica livre 1x/turno fora de combate; durações em rodada ao sair do combate; Fluxo e Concentração fora de combate (o Monge tem "Fora de combate, você pode utilizar técnicas que exigem fluxo livremente com 1 minuto de preparo"); lista final.
- **D.** PMA por sequência com "Novo alvo".
- **E.** Mãos: arma de duas mãos existe? duas armas? Foco e arma juntos? consumível sem mão (o Pedro já disse que sim).
- **F.** D154 refeito com a troca manual (03 §11) e as 9 perguntas da auditoria 09.

Enquanto não chega: a Mesa usa a leitura escrita aqui. A Mesa 4 (técnicas) espera o B.
