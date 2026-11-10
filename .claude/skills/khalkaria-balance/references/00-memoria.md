# 00 · Memória do agente de balanceamento

O que uma sessão nova precisa saber para continuar sem refazer o caminho. **Atualize ao fim de cada entrega.**

O padrão é o mesmo do agente do hexcrawl (`docs/11-memoria.md` lá). Cada coisa tem uma casa:

| O quê | Onde |
|---|---|
| Regra do jogo | o **Notion** (fonte da verdade) e os destilados `01`–`08` |
| O que o Pedro decidiu | `09-decisoes-pedro.md`, numerado `D#`, em ordem de data. **É a lei** |
| Perguntas abertas | `00-pendencias.md`, numeradas `Q#`, com a recomendação primeiro |
| O que falta fazer | `00-lista.md`, com IDs estáveis (`L-BAT1`) e `[x]`/`[ ]`/`[~]` |
| Estado, plano, lições | este arquivo |
| Detalhe de cada frente | o arquivo da frente (`batedor-classe.md`, `18`, `19`, `20`, `23`, `24`…), apontado abaixo |

Regras da casa:
- Número de `D#`, `Q#` e `L-` **nunca muda nem é reaproveitado**. O Pedro responde "Q4" e a referência continua
  valendo.
- Pergunta respondida sai da tabela aberta de `00-pendencias.md` e vai para "Respondidas", com o `D#` que a fechou.
- Item novo da lista que nasce de observação minha só entra depois do sim do Pedro.

## 1. Estado (2026-11-10)

### Bazar
- Fonte: o CSV do Pedro. Hoje é `data/Bazar_Khalkaria_v26.csv` no `main` do site, com 727 itens e o
  **cabeçalho na linha 1**. A cópia de trabalho é `references/bazar-v26.csv`.
- Régua: `auditor.py`. O resumo da régua está no `SKILL.md`.
- A **Bacia Acidentada** não existe no CSV (Q9). O hexcrawl usa, por ora, o pool do CR 2.

### Ficha digital e site
- Contratos que o agente do site consome (pelo `tools/sync_balanceamento.py` dele):
  - `ficha-digital-regras.json` (`regras-ficha/1.1`, rev. 12);
  - `ficha-efeitos-itens.json` (`efeitos-itens/1.2`, rev. 11);
  - `tabela-efeitos-itens.csv`.
- A ficha v3 do site abre com `pages/ficha.html?ficha=v3`. O navegador guarda a liberação em `khalkaria_ficha_previa`.
- A classe Batedor **não** está no contrato. Ela entra na revisão que fechar a classe (L-BAT4).

### Batedor (rework)
- Detalhe em `batedor-classe.md` (a cópia de auditoria, que o Pedro lê), `18-batedor-rework.md` (o porquê) e
  `19-gabarito-de-classe.md` (a estrutura de classe e as lições 1–38).
- **Fechado e no Notion:** cabeçalho, características e as 15 técnicas gerais.
- **Ramos:** as marcas e o Tier 1 têm os textos do Pedro.
- **Tier 2:**
  - Pecador: fechado;
  - Ladrão: falta a Marca da Morte (Q4);
  - Cartógrafo: em escolha (Q3).
- **Tier 3:** por último.
- **Formato:** cada rodada imprime a classe inteira (D148).

### Hexcrawl
- O app vive em `vitralxx/khalkaria_hexcrawl`. O canal com o agente programador é a **issue #2** de lá. Cada
  mensagem começa com `[balanceamento]` ou `[programador]`, e o Pedro avisa cada um.
- **Meu papel:**
  - manter o `docs/01-regras.md` deles: commit só de documentação, no `main`;
  - responder as perguntas de regra.
- **Não mexo no núcleo** (`hexcrawl/nucleo/`): mando os casos de entrada → saída e o programador porta.
- Para clonar: `git clone`, depois `git fetch origin '+refs/heads/*:refs/remotes/origin/*'`. O fetch simples não
  atualiza o `origin/main` do clone raso.
- `hexcrawl-pack/` neste branch é o pack inicial **congelado**. Só o `docs/01-regras.md` é espelhado aqui. A fonte é o
  repo.
- **Decisões:** D156–D161 no `09`. A P16 e a P18 foram respondidas pelo Pedro direto ao programador ("sim").
- O programador tem 77+ perguntas abertas na lista dele. As de regra chegam a mim pela issue.
- **Última resposta minha na issue:** 2026-11-10 (comentário `6780514997`), com P17, P64–P82, P120, P121 e
  P127–P136. Perguntei a ele sobre o método de memória (L-MEM2).

### Bestiário
- O contrato de import do v10 está em `23-bestiario-v10.md`: igual ao pack v8, mais CR fracionário, `region` e CR em
  NPC. Não há campo de chefe.
- **Clones de seiva** (D162): o modelo está em `24-clones-de-seiva.md`. O Vorn está pronto em
  `bestiario/vorn-clone-de-seiva.json`, como rascunho, com as pendências Q12–Q20. Faltam os outros 4 clones (L-BES1).

### Notion
- **Lore das 9 regiões:** a dificuldade e o CR foram alinhados à D158 (D160).
- **Pendentes:** as frases narrativas que contradizem a escala nova (Q10) e as cores (Q11).

## 2. Plano (a ordem)
1. Canal do hexcrawl: responder sempre que houver mensagem. Tem prioridade, porque o programador trabalha com
   constantes provisórias até a resposta.
2. Batedor: o Tier 2 do Cartógrafo (Q3) e a Marca da Morte (Q4); depois o Tier 3; depois o contrato (L-BAT4) e o
   Notion (L-BAT5).
3. A Bacia no Bazar (Q9): proposta de itens e Materiais para o Pedro.
4. Os outros clones de seiva, quando o Pedro pedir.

## 3. Como o Pedro trabalha
- Responde em **lista numerada**. Uma correção num ponto vale para tudo.
- Quer a **recomendação primeiro** e decide por número.
- **Economia de tokens:** respostas enxutas, sem preâmbulo.
- Conteúdo criativo (lore, nomes, textos) só com o aceite dele. Edição no texto dele é cirúrgica.
- Gosta de **configurável**. Ferramenta da mesa nunca trava o jogo: lembra, não bloqueia.
- Usa vários agentes (site, hexcrawl, Bestiário) e faz a ponte. Às vezes pede coisa urgente no meio da sessão de
  jogo, como o link de uma página: responda curto e direto.
- Quer a memória organizada como a do hexcrawl (pedido de 2026-11-10).

## 4. Lições (para não repetir)
- **Notion:**
  - o formato do fetch muda (veio a virar tags HTML), então o `old_str` deve casar o formato atual;
  - confira cada edição por fetch e diff;
  - a busca do Notion tem índice atrasado: confira o conteúdo por **fetch**, nunca pela busca.
- **Frase relayada por outro agente:** confirme antes de gravar. A D154 foi lida errado e virou D155.
- **Contrato com o site:** mudar a CD de uma classe no contrato quebra o `gerar_regras_ficha` do site enquanto o site
  ainda tem a classe antiga. Mude o contrato junto com a classe.
- **`CLAUDE.md` aninhado vira instrução de quem lê a pasta.** Protocolo de outro agente fica com outro nome
  (`CLAUDE.agente.md`).
- **Mensagem entre sessões na nuvem não funciona.** O canal é git ou issue.
- **O container some:** clone de outro repo precisa ser refeito na sessão seguinte.
- **Tarefa pesada e isolada vai a um fork** (o Vorn foi assim). Dê o prompt completo, porque ele não fala com o
  Pedro, e revise e faça o commit depois.
- **Toda conta sai de script** (o `auditor.py`, a distribuição exata dos dados), nunca de olho. Toda lista sai
  comparada por conjunto (`set`, `Counter`).
- As lições de desenho de classe estão no `19-gabarito-de-classe.md` (1–38).

## 5. Abertos
Veja `00-pendencias.md` (as perguntas) e `00-lista.md` (as tarefas).
