# 08 · Fases

Cada fase tem um critério de pronto. Não comece a próxima com a anterior vermelha.

| Fase | Entrega | Pronto quando | Depende de |
|---|---|---|---|
| **F0 Fundação** | Repositório, `pyproject.toml`, `referencia/` promovida a `hexcrawl/nucleo/` (por `git mv`), pytest e vetores, schemas, validador na linha de comando, CI, `.gitignore`. Referências reduzidas (`ferramentas/reduz_referencia.py`) | Os 45 testes e os 248 vetores passam no CI. `dados/exemplo` valida com 0 falhas e 0 avisos. Os schemas validam todos os dados | nada |
| **F1 Visualizador** | FastAPI e pywebview com as janelas Mestre e Jogadores. Mapa Pixi do `dados/exemplo` com todas as camadas: tiles do atlas com tinta assada, variantes e espelho, profundidade, água rasa e funda, orla, **rios e vias por código**, ponte, penhasco, rótulos. Zoom inteiro, arrastar, tooltip do mestre | O exemplo aparece completo. Uma captura (Playwright) vai ao Pedro, e **ele aprova o visual dos rios e vias**. A trilha pode ir simples, como faixa escurecida; o sulco fica para a F7 | — |
| **F2 Editor** | Todos os pincéis (`05-interface.md` §2), camadas de região e alternativas, painel de configuração do mundo, inspetor, conferência ao vivo, desfazer e refazer, gravação atômica, controle de tinta | O Pedro edita uma região do exemplo sem tocar no JSON | F1 |
| **F3 Geografia** | Teste de tamanhos, calibração, pipeline (`07-geografia.md`), revisão | O tamanho está escolhido pelo Pedro. `dados/kharavel/mundo/` valida com 0 falhas, as regiões estão pintadas, a camada da ilusão existe e o rascunho de rios e vias foi revisado pelo Pedro | decisão de tamanho; P17; F2 |
| **F4 Sessão (motor)** | Ações da sessão (`04-motor-de-regras.md` §2.3), plano de viagem com A\*, paradas e lembretes, Jornada por parada, travessia, embarcações, descanso, extração, camadas, diário, desfazer | Uma viagem roteirizada de 3 dias no exemplo (a pé e de barco, com a miragem ligada e desligada) dá exatamente as saídas esperadas (teste), incluindo dívida, explorar e encerrar o dia | P16 (constantes) |
| **F5 Janela dos jogadores** | Projeção no servidor, névoa de 3 estados, transições, token, câmera, tooltip dos jogadores | O **teste de vazamento** passa, inclusive com a ilusão ligada. O Pedro roda uma sessão de teste com as 2 janelas em 2 monitores | F4 |
| **F6 Conteúdo e integrações** | Tabelas de eventos das 9 regiões (rascunho, depois aprovação do Pedro), textos das consequências, leitura do CSV do Bazar (comerciante e materiais) | Nenhum aviso de "hex sem evento possível"; 9 × 7 textos de consequência com `status: aprovado` | conteúdo do Pedro; a Bacia no CSV (provisório: pool do CR 2) |
| **F7 Polimento** | Sulco da trilha e tijolos da estrada no capricho, fonte bitmap com os glifos que faltam, atlas manual do kit de UI com 9-slice, molduras por região, animações, ganchos de som, empacotamento PyInstaller | Aprovação visual do Pedro e um `.exe` que abre as 2 janelas | F5 |

## Ordem de grandeza do conteúdo (F6)
- **Por região:**
  - 7 textos de consequência;
  - cerca de 12 comuns, 15 notáveis e 5 raros na tabela global;
  - as vilas e masmorras pré-feitas.
- **No total:** cerca de 300 eventos e 63 textos de consequência.
- Um agente pode **rascunhar**, sempre com `status: "rascunho"`. Só o Pedro aprova (`CLAUDE.md` §1).

## Riscos
| Risco | Contenção |
|---|---|
| O escopo do editor cresce sem fim | As fases e os critérios de pronto |
| Arte inconsistente | Paleta tirada dos próprios tiles; tinta assada; rios e vias com a paleta da folha |
| Regra no código sem fonte | Todo número sai de `01-regras.md`; o que faltar vai a `10-pendencias.md` |
| Segredo na tela dos jogadores | Projeção montada no servidor e teste de vazamento |
| Tabela esgotada (notáveis e raros acabam) | O aviso nº 11 da conferência e a contagem por região no editor |
| Mudar o tamanho da grade depois de traçar vias | Teste de tamanhos antes (`07-geografia.md` §2) |
