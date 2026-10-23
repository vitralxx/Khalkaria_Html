# 08 · Fases

Cada fase tem um critério de pronto. Não comece a próxima com a anterior vermelha.

| Fase | Entrega | Pronto quando | Depende de |
|---|---|---|---|
| **F0 Fundação** | Repositório, `pyproject.toml`, `referencia/` promovida a `hexcrawl/nucleo/` (por `git mv`), pytest e vetores, schemas, validador na linha de comando, CI, `.gitignore`. Referências reduzidas (`ferramentas/reduz_referencia.py`) | Os 40 testes e os 216 vetores passam no CI. `dados/exemplo` valida com 0 falhas e 0 avisos. Os schemas validam todos os dados | nada |
| **F1 Visualizador** | FastAPI e pywebview com as janelas Mestre e Jogadores. Mapa Pixi do `dados/exemplo` com todas as camadas: tiles do atlas com tinta assada, variantes e espelho, profundidade, água rasa e funda, orla, **rios e vias por código**, ponte, penhasco, rótulos. Zoom inteiro, arrastar, tooltip do mestre | O exemplo aparece completo. Uma captura (Playwright) vai ao Pedro, e **ele aprova o visual dos rios e vias** | P1 (topo chato) |
| **F2 Editor** | Todos os pincéis (`05-interface.md` §2), inspetor, conferência ao vivo, desfazer e refazer, gravação atômica, controle de tinta | O Pedro edita uma região do exemplo sem tocar no JSON | F1 |
| **F3 Geografia** | Teste de tamanhos, calibração, pipeline (`07-geografia.md`), revisão | O tamanho está escolhido pelo Pedro. `dados/kharavel/mundo/` valida com 0 falhas, as regiões estão pintadas e o rascunho de rios e vias foi revisado pelo Pedro | decisão de tamanho; F2 |
| **F4 Sessão (motor)** | Ações da sessão (`04-motor-de-regras.md` §2.3), plano de viagem com A\*, Jornada, travessia, descanso, extração, diário, desfazer | Uma viagem roteirizada de 3 dias no exemplo dá exatamente as saídas esperadas (teste), incluindo dívida, explorar e acampar | P2, P3, P9, P15 (constantes) |
| **F5 Janela dos jogadores** | Projeção no servidor, névoa de 3 estados, transições, token, câmera, tooltip dos jogadores | O **teste de vazamento** passa. O Pedro roda uma sessão de teste com as 2 janelas em 2 monitores | F4; P4, P5, P12 |
| **F6 Conteúdo e integrações** | Tabelas de eventos das 9 regiões (rascunho, depois aprovação do Pedro), textos das consequências, leitura do CSV do Bazar (comerciante e materiais), barcos | Nenhum aviso de "hex sem evento possível"; 9 × 7 textos de consequência com `status: aprovado` | P6, P10, P11, P13; conteúdo do Pedro |
| **F7 Polimento** | Fonte bitmap com os glifos que faltam, atlas manual do kit de UI com 9-slice, molduras por região, animações, ganchos de som, empacotamento PyInstaller | Aprovação visual do Pedro e um `.exe` que abre as 2 janelas | F5 |

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
