# A Mesa (especificação, 2026-10-21)

Base:
- plano `02` (M1, §3.1, F5, F5b, F6);
- contrato do balanceamento (`data/balanceamento/ficha-digital-regras.json`): `turno`, `eventos`, `recargas`, `descanso`, `dano.ordemMitigacao`, `morte`, `rastrear` (P55), `automacao` (P56), `condicoesDuracaoPadrao`;
- Sistema (`data/sistema.json`): Sua Rodada, Atacando & Retaliação, Dano e Defesa, Manobras, Críticos;
- pedido do Pedro em 2026-10-21 e as três respostas dele no `03 §12`.

Esta especificação **substitui** o "UX — Modo Mesa" do M1 e as fases F5, F5b e o resto da F6 (partes 3 e 4) do plano `02`.

## 0. O pedido

O Pedro, em 2026-10-21:
- alguns itens só fazem sentido em combate, e por isso a Mesa também serve de simulação de combate, sem ser a única função dela;
- a Mesa é onde o jogador usa técnicas (de raça, classe, origem e outras), perícias, itens, cartas do Limiar, manobras de combate e tudo o que está no sistema;
- tudo ordenado, sem flood de informação, com um estilo próprio pensado para essa aba;
- a Mesa **não** rastreia inimigos nem aliados. Mesmo quando a técnica mira uma criatura, o alvo é escolhido no tabuleiro real. A Mesa serve para esclarecer a regra, rolar os dados e calcular sozinha atributos, status, perícias e os itens do inventário.

## 1. O que a Mesa é, e o que não é

**É** a sexta aba da página da ficha (reordenável como as outras), com uma versão compacta no drawer. Nela o jogador:
- vê o que pode fazer agora, com o custo e a regra à mão;
- rola com a expressão à vista ("1d20 + 3 DES + 4 prof") ou digita o que rolou no dado físico ("rolei __");
- paga o custo (ações, Stamina, Éter, recurso de classe, usos) e vê o que mudou na ficha;
- passa o tempo do **próprio** personagem: entrar em combate, começar e encerrar o turno, sair do combate, fim da cena, descansos, novo dia.

**Não é** rastreador do grupo:
- sem alvo, sem agressor, sem PMA por alvo, sem rodada do grupo;
- efeito que cai em outra criatura aparece como **texto com os números já calculados** ("o alvo faz Fortitude contra CD 14", "cura 2d4+3 no aliado"), e só o que é do personagem muda a ficha;
- ações, reação e magia do turno são **mostrador**, nunca trava: o mestre manda.

Isso já é o que o contrato pede:
- **P55:** rastrear o que é privado e determinístico, e não o que é compartilhado e negociado;
- **P56:** automatizar o que deriva de um número da ficha, e não o que deriva de um julgamento na mesa;
- **"a rodada é do mestre":** a ficha conta os turnos **dela** e escreve toda duração em turnos seus.

## 2. O que muda no plano (otimizações)

| # | Antes (plano `02`) | Agora | Por quê |
|---|---|---|---|
| 1 | `sessao.agressorAtual`; Evasão Ativa "só contra o agressor atual" | Sai. Defender (reação) rola o dado e mostra a Ativa; a regra ("vale contra todos os ataques do agressor neste turno; os outros, contra a Passiva") fica escrita no cartão | Pedido do Pedro e P55 |
| 2 | Estado do turno na sessão, fora do `rev`, com "desfazer multi-parte" | O estado do turno vai para dentro da ficha (`ficha.mesa`), no `rev`: **um desfazer só** para tudo. O registro das rolagens continua fora (sessão): rolar não invalida o desfazer | Corta o desfazer em duas partes, que era a peça mais frágil do M1 |
| 3 | Cartão, executor e teste próprios por fonte (arma, consumível, magia, técnica…) | **Um modelo de ação** (`KhAcao`): toda fonte vira o mesmo descritor; **um executor** (`KhMesa.executar`); **um cartão** (`.kh-acao`) | Uma superfície de código e de teste em vez de seis |
| 4 | Temporários "com as 8 durações" sem lugar definido | `ficha.temporarios[]`: Mods com duração, coletados pelo `KhEfeitos` como as outras fontes (a dica diz a fonte e quanto falta). Não usa `ajustes`, que é um por campo e colidiria | O mesmo caminho dos Mods de item, já testado |
| 5 | F5 (Mesa), F5b (usos) e F6 partes 3–4 (consumir, usar, temporários) separadas | Viram as fases **Mesa 0–4** (§8). Consumir e usar item entram na Mesa | O efeito com duração precisa do relógio da Mesa |
| 6 | Usos e custo de técnica esperando o bloco C | Custo **lido do `custoTexto`** pela gramática do vocabulário (P44): ações, reação, livre, passiva, "N Stamina/Éter/Fluxo…", "Nx/recarga". Um teste lista as 274 técnicas, Marcas e Ultimates e diz quais não leu; essas ficam manuais. Quando o bloco C chegar, o dado dele vence | Não espera o bloco C; nada é inventado: é o texto canônico, e a leitura fica auditável |
| 7 | Duração "em turnos seus" ou num evento | Igual, com a fronteira explícita: `{ate:'inicioTurno'|'fimTurno', n}` ou `{ate:<evento>}` | O contrato tem as duas fronteiras (`condicoesDuracaoPadrao`: condição até o **fim** do próximo turno do afetado; técnica até o **início** do próximo turno próprio) |

## 3. Organização da aba (anti-flood)

Três zonas, na largura da página da ficha (só PC):

```
┌─ BARRA DO TURNO (fixa no topo da aba) ─────────────────────┬─ REGISTRO ──────┐
│ Saúde ▰▰▰▰▱ 24/30 ±   Stamina ▰▰▱ 8/15 ±   Éter ▰▱ 3/12 ±   │ ┌─────────────┐ │
│ Fluxo 2/5   Ações ◆◆◇   Reação ◇   Magia ○   Mov. 7,5 m      │ │  14 + 7 = 21│ │
│ [Sangramento 2 · 1t] [Defender +2 · até seu turno] [+]      │ │ Atacar 1º   │ │
│ [ Começar meu turno ▸ ]  Em combate · turno 3   [ Tempo ▾ ] │ └─────────────┘ │
├─ MÃO (até 8 atalhos fixados) ───────────────────────────────┤ 21  Atacar 1º    │
│ [Atacar Adaga] [Defender ◇] [Fagulha] [Poção de Cura] …     │ −3 Stamina  ↶    │
├─ AÇÕES ─────────────────────────────────────────────────────┤ 2d4+3 Dano       │
│ Combate │ Técnicas │ Magias │ Itens │ Perícias │ Cartas      │ …                │
│ [Ação] [Reação] [Livre]                       busca ______  │                  │
│ ◆   Atacar (Adaga)     +7 · +2 · −3          [1º][2º][3º]   │ [copiar linha]   │
│ ◇   Defender (reação)  Ativa 13 + 1d6        [Rolar]        │                  │
│ ▸ Sempre valendo (6)                                        │                  │
└─────────────────────────────────────────────────────────────┴──────────────────┘
```

### 3.1 Barra do turno

- **Recursos:** Saúde (com a temporária, D15), Stamina (com a comprometida, D19), Éter e o recurso de classe, cada um com régua, número grande e ±. Os do Espadachim e do Teurgo não têm contador (D105) e não aparecem aqui.
- **Mostradores do turno:** ações (3 + a conta das fontes: Atordoado −2, Lento −1…), reação, magia do turno (D18), Movimento efetivo. Gastos ficam esmaecidos. **Nunca travam.**
- **Chips:** condições ativas (X e turnos restantes), temporários (fonte e até quando) e situações ligadas (os interruptores da F6 parte 2). O clique no chip abre a regra, com Remover.
- **Relógio do personagem:** um botão só, que alterna conforme o estado:
  - fora de combate: **Entrar em combate**;
  - em combate, esperando: **Começar meu turno**;
  - no turno: **Encerrar meu turno**;
  - e **Sair do combate** ao lado, em combate.
  - O menu **Tempo** tem Fim da cena, Descanso curto, Descanso longo e Novo dia.

### 3.2 Mão

Até 8 cartões fixados pelo jogador (estrela no cartão), numa faixa sempre à vista. A Mão fica guardada na ficha (`ficha.mesa.mao`) e vai no export nativo. Cartão fixado cuja fonte saiu da ficha some da Mão sozinho.

### 3.3 Ações, em seis grupos

O grupo escolhido fica lembrado por ficha. O filtro Ação · Reação · Livre vale dentro do grupo. A busca procura em todos.

1. **Combate** (ações básicas, manobras e reações do Sistema):
   - Atacar, com cada arma equipada e o Desarmado (1d4 contundente, DES; 1d8 com a Arma Humana do Monge). A linha mostra a progressão da PMA ("+7 · +2 · −3"); cada posição é um botão que rola. Dano e Dano crítico (dobra os dados da arma e os extras escritos nela) também são botões;
   - Defender (ação): temporário "+2 Defender até seu próximo turno", que não acumula com ele mesmo;
   - Defender (reação): rola o dado de Defender (com vantagem, o dado duas vezes) e mostra a Ativa;
   - Retaliar (reação): Atacar com a arma empunhada, com a regra da retaliação no cartão;
   - Ataque de oportunidade (reação);
   - Mover (Movimento efetivo; uma vez por turno), Acelerar (+3 m até o fim do turno), Pular (1/3 do Movimento);
   - Empurrar (Movimento × Fortitude), Desarmar e Agarrar (Movimento × Movimento), Investida (2 ações, conta como Mover);
   - Esconder (3 ações, Furtividade);
   - **Recebi dano:** o jogador digita o valor e o tipo (14 tipos). A Mesa aplica a `ordemMitigacao` do contrato (imunidade, vulnerabilidade/resistência, Ar se ordinário, Ae do tipo, da categoria e de Todos, arredonda para baixo, mínimo 0), gasta a Saúde temporária primeiro (D15) e mostra a conta. No mesmo passo: Sangramento consome antes (D14a) e Exposto sai (D17a).
2. **Técnicas**, por origem: Classe (gerais, de ramo por tier, Marcas, Ultimate), Raça (traços ativos), Origem, Outras (tecnologias, corrupções, diversas). Usar paga o custo e os usos. A técnica com Mods "enquanto ativa" ganha Ativar/Desativar (o `KhEfeitos` já tem o `estado.ativo`).
3. **Magias**, por nível: intensidade escolhida no cartão (só as permitidas; Nível 1 sem Contida), custo com a conta (D82), Conjurar desconta o Éter e marca a magia do turno (a 2ª no turno avisa e registra, sem travar, D18), rola o dano da intensidade e mostra a CD. Sustentada: uma ativa (D16), custo cobrado ao começar o turno.
4. **Itens:**
   - Consumir (1 ação; em si ou em outro, D18): baixa 1 do inventário; **em si** aplica cura, Mods e condições do `consumo`, abre o aviso de cura em Autômato (D23), avisa `soParaRaca` e revela a Marca da Vhelor; **em outro** só baixa e mostra o efeito com os números, para o outro jogador;
   - Usar ou Ativar (itens com cargas e habilidades): cargas por recarga;
   - os eventos de item com duração viram temporários (a parte que a F6 parte 2 deixou só escrita).
5. **Perícias:** a grade das 24 com o total, a fonte da vantagem ou desvantagem e o botão de rolar. A perícia de dois atributos mostra a troca (`KhTroca`).
6. **Cartas:** as cartas do Limiar com uso ativo. As passivas ficam em "Sempre valendo".

**Sempre valendo**, no pé de cada grupo e recolhido: as passivas desse grupo, que já estão nos números, com a trilha de onde agem. Esclarece a regra sem ocupar a tela.

### 3.4 O cartão

- **Fechado, uma linha:** glifo na cor da fonte · nome · custo em gemas (◆ ação, ◇ reação, ○ livre) e em recursos ("3 Stamina") · usos ("2/3 · longo") · resumo do número (bônus, CD, dano) · o botão principal (Atacar, Rolar, Usar, Conjurar, Consumir).
- **Aberto:**
  - o texto da regra, verbatim do catálogo;
  - a conta de cada rolagem;
  - as escolhas (intensidade, quanto pagar no custo variável, em si ou em outro);
  - o que muda na ficha e o que é só da mesa;
  - "rolei __" ao lado de cada rolagem.
- **Sem recurso, sem uso ou fora de hora:** o cartão esmaece com o motivo ("Stamina 2 de 3"), mas continua clicável. Clicar paga mesmo assim e avisa.

### 3.5 Registro

- A última rolagem fica em destaque no topo do registro: total grande, dados (o descartado riscado), crítico ou falha.
- Abaixo, a lista: cada rolagem com expressão e dados; cada ação com o que mudou e o Desfazer (só na mais recente desfazível; "desfazer até aqui" nas anteriores, com confirmação).
- Cada linha pode ser copiada para o chat do grupo.
- Fica na chave `khalkaria_ficha_v3_sessao:<id>`, até 200 linhas. Rolar não sobe o `rev`.

### 3.6 No drawer (compacta)

A barra do turno, a Mão e o registro (as 5 últimas linhas). Dá para ler a regra na página e rolar ao lado. O resto da Mesa fica na página da ficha, a um clique.

## 4. Estilo da aba

Ideia: **"mesa de pedra"**, a continuação da moldura gótica da ficha, com uma superfície mais densa e escura, onde só o que está em jogo brilha.

- **Cartões:** placas escuras com borda fina e uma faixa de 3 px na cor da fonte: classe ou ramo, raça, raridade do item, escola da magia, atributo da carta.
- **Gemas de custo:** ◆ ação em âmbar, ◇ reação em contorno, ○ livre pequena. Gastas ficam opacas.
- **Recursos:** réguas nas cores que a ficha já usa (Saúde rubi, Stamina amarela, Éter roxo) e número em Cinzel.
- **Dado:** o resultado entra no destaque do registro. 20 natural ganha brasa âmbar; 1 natural, vermelho escuro.
- **Movimento:** só o necessário, com `prefers-reduced-motion` respeitado.
- **Tokens:** os de `css/tokens.css`, sem cor nova solta. O CSS novo fica em `css/ficha-mesa.css`, injetado só com a prévia, como o da página e o do drawer.

**Prova de estética antes de codar** (Mesa 0): uma página estática com um personagem de exemplo, para o Pedro aprovar ou corrigir o visual antes do motor.

## 5. Modelo de dados

Schema 3.0, mudanças aditivas. Até a virada (F4.7) só o Ensaio grava, então não há migração de dado salvo.

- **`ficha.mesa`** (no `rev`, no desfazer):
  - `emCombate`, `noTurno`, `turno` (quantos turnos seus neste combate);
  - `acoesGastas`, `reacaoGasta`, `magiaDoTurno` (uid), `livresNoTurno` (uids: técnica livre 1x por turno, salvo texto);
  - `sustentando` ({uid, desde});
  - `mao` (até 8 referências), `grupo` (o último aberto).
- **`ficha.temporarios[]`:** `{uid, fonte:{tipo,id,uid,nome}, mods:[Mod], duracao, desde}`.
- **Duração** (temporário e condição): `{ate:'inicioTurno'|'fimTurno', n}`, `{ate:'fimCombate'|'fimCena'|'descansoCurto'|'descansoLongo'|'novoDia'}` ou `{ate:'manual'}`. O `n` conta as fronteiras daquele tipo, e a Mesa sabe se está no turno (`noTurno`), então "até o fim do seu próximo turno" é determinístico.
- **Usos:** `entrada.estado.usos = {gastos, max, recarga}`, com `recarga` no vocabulário de `recargas` do contrato.
- **Sessão** (`khalkaria_ficha_v3_sessao:<id>`, fora do `rev`): só o `log`. Saem `agressorAtual`, `turno`, `acoesGastas`, `reacaoGasta`, `magiaDoTurno` e `sustentando`, que foram para `ficha.mesa`. O `estadoSessao` continua no export nativo, nunca no Bestiário.

## 6. Motor (puro, testado antes da tela)

- **`KhDados`:** NdX+K, kh/kl (vantagem e desvantagem; no Defender, o dado duas vezes), `crypto.getRandomValues`, semente nos testes, entrada manual. Crítico e falha só no dado usado, pela margem de ameaça.
- **`KhAcao.de(fonte, ctx)`:** a fonte vira `{id, grupo, nome, fonte, custo:{acoes, reacao, livre, recursos, variavel, usos}, rolagens:[{rotulo, tipo, expressao, termos}], efeitos:{naFicha, naMesa}, texto, avisos}`.
  - Fontes: arma, Desarmado, ação básica, manobra, perícia, magia, item, técnica, carta.
  - Os números vêm do `KhRegras` (os nós que a ficha já calcula), nunca de uma conta nova.
- **`KhMesa.executar(ficha, acao, escolhas)`:** devolve `{ok, mudancas, rotulo, rolagens}`, num passo de desfazer, gravado pelo mesmo armazém do Ensaio.
- **`KhMesa.evento(ficha, nome)`:** as listas do contrato (`eventos`), em ordem fixa. Cada linha vira mudança ou lembrete:
  - **Entrar em combate:** recurso de classe ao valor inicial; −1 munição da arma de distância equipada; usos de combate de volta; reação disponível.
  - **Começar meu turno:** tiques de Morrendo, Em Chamas e Envenenamento (D31: no início do turno do afetado; Morrendo ignora Ar, Ae e resistência, D86); reação de volta; custo da sustentada; durações em turnos seus; usos de turno; ações e magia do turno de volta.
  - **Encerrar meu turno:** expira o que dura "até o fim do seu turno".
  - **Sair do combate:** zera Fluxo, Brutalidade e Concentração; usos de combate; expira os temporários e as condições de combate.
  - **Fim da cena:** usos de cena, Instinto a 0, munição da cena.
  - **Descanso curto / longo:** o assistente do `descanso` do contrato. Recupera primeiro e cobra o estresse depois, sem pular (D84). No longo: comida e luz, e Desnutrido +1 sem elas (D17).
  - **Novo dia:** usos de dia; avisa a Exaustão no 2º dia sem descanso.
- **`KhMesa.receberDano(ficha, {valor, tipo})`:** a `ordemMitigacao`, a temporária primeiro, Sangramento e Exposto, num passo.
- **Leitor de custo de técnica:** `custoTexto` → custo estruturado, com o teste de cobertura do §2 item 6.

## 7. Testes

Os do M1 que continuam valendo, menos os de agressor, e mais:
- uma ação de cada fonte, de um inventário fixture: o cartão aparece, e some quando a entrada sai;
- executar → desfazer devolve a ficha byte a byte, com o turno junto;
- durações nas duas fronteiras: aplicada dentro e fora do próprio turno;
- Recebi dano: um caso por etapa da `ordemMitigacao`, mais a temporária, o Sangramento e o Exposto;
- consumir em si × em outro;
- rodada simulada completa só pela Mesa: entrar em combate, atacar com a progressão, conjurar, receber dano com Sangramento, Morrendo ao começar o turno, Defender (ação e reação), fim da cena, sair do combate, descanso curto.

## 8. Fases

Cada fase: build verde, `[estilo]` recapturado quando o CSS muda, conferida no navegador, publicada (atrás da prévia `?ficha=v3`).

| Fase | Entrega | Depende de |
|---|---|---|
| **Mesa 0** | Prova de estética: página estática com um personagem de exemplo (barra do turno, Mão, os 6 grupos, cartão aberto, registro) | aprovação do Pedro para seguir |
| **Mesa 1** | Motor puro: `KhDados`, `KhAcao` (arma, básicas, manobras, perícias, magias, itens; técnicas pelo leitor de custo), `KhMesa` (executar, eventos, temporários, condições, Recebi dano), schema. Só testes | — |
| **Mesa 2** | A aba: barra do turno, Mão, Combate, Perícias e Registro, no Ensaio. A rodada simulada fecha | Mesa 0 e 1 |
| **Mesa 3** | Itens (consumir, usar, cargas, eventos com duração; D23, `soParaRaca`, Vhelor) e Magias (conjurar, intensidade, sustentada) | Mesa 2 |
| **Mesa 4** | Técnicas e Cartas (custo lido, usos por recarga, Ativar), busca e filtros; a Mesa compacta no drawer | Mesa 3 |

A virada (F4.7) continua só com o ok do Pedro. A Mesa pode entrar antes ou depois dela: até a virada, tudo roda no Ensaio.

## 9. Perguntas ao balanceamento

Nada da Mesa espera essas respostas. Até lá, vale a leitura escrita aqui, com selo PENDENTE (balanceamento) no cartão.

1. **Cura de Stamina e Éter.** O Sistema diz "A cura não passa do máximo". A ficha aplica o teto também à recuperação de Stamina e de Éter (botão do evento de item, descansos). Confirma?
2. **"fimTurno: marca a reação como gasta".** A leitura da Mesa: isso é a regra da retaliação, do ponto de vista de quem foi atacado no turno de outro; a reação gasta continua gasta até o começo do próximo turno do personagem. Encerrar o **próprio** turno não gasta a reação. Confirma?
3. **Custo de técnica lido do texto** até o bloco C (§2 item 6). Algum padrão do `custoTexto` não deve ser lido assim? Por exemplo, "Passiva • 3 Fluxo" (custo por uso, G12) e as alternativas com "ou".
