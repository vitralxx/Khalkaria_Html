# 05 · Interface

## 1. Janelas
| Janela | Quem vê | Modos |
|---|---|---|
| **Mestre** | o Pedro | **Editor** (preparação) e **Sessão** (mesa) |
| **Jogadores** | a mesa, no 2º monitor ou na TV | só a sessão; tela cheia, sem controles |

As duas janelas abrem juntas no modo Sessão. A dos jogadores vai para o segundo monitor, se houver.

## 2. Editor (mestre)
| Ferramenta | Comportamento |
|---|---|
| **Referência** | Mostra o mapa do Pedro sob a grade, com opacidade ajustável. Alterna entre a versão oficial e a da ilusão |
| **Calibração** | Fixa a origem e a escala da grade sobre a referência (`07-geografia.md`) |
| **Tamanho da grade** | Gera rascunhos com vários números de colunas para comparar (`07-geografia.md` §2) |
| **Pincel de terreno** | Pinta o tipo. Pincel de 1 hex ou de raio N |
| **Pincel de região** | Pinta a região, com balde de preenchimento por área |
| **Carimbo de especial** | Põe ou edita um especial: nome, ícone, categoria, conflito, textos |
| **Pincel de via** | Ancorado no **centro** do hex. Arrasta-se de hex em hex; um salto é preenchido pela linha de hexes. Estrada ou trilha. Shift continua a via existente; Alt apaga |
| **Pincel de rio** | Ancorado nos **vértices**. O cursor gruda no vértice mais próximo, e cada par de vértices seguidos vira uma aresta. A ordem é **nascente → foz**, e um botão inverte. Riacho, rio ou rio grande |
| **Pincel de aresta** | Ponte (só sobre rio) e penhasco. No penhasco, um clique escolhe o lado alto |
| **Pincel de borda** | Território de cidade, pelas bordas dos hexes |
| **Inspetor** | Tudo do hex. Edita custo, H, variante, notas. Mostra a tabela do hex: montar, remontar, travar |
| **Conferência ao vivo** | O validador roda a cada mudança. A lista de falhas e avisos leva ao hex com um clique |
| **Camadas** | **Cada região é uma camada** que liga e desliga, inclusive as alternativas, como a ilusão do Oásis (`01-regras.md` §1.3). Também ligam e desligam: referência, coordenadas, vias, rios, territórios, especiais, névoa (prévia). No editor, é só visualização |
| **Camada alternativa** | Pinta os hexes de uma região alternativa por cima da base, sobre a referência da ilusão |
| **Vista por região** | Recorta uma região com o anel vizinho e o rótulo "→ Para [região]" |
| Básico | Desfazer e refazer, zoom inteiro, arrastar, atalhos, salvar com conferência |

**Configuração do mundo** `[Pedro: "o ideal é ser configurável no app"]`
- Todo número de regra que vive em `mundo.json` se edita num painel, com a conferência rodando:
  - tipos: custo e raio de visão;
  - regiões: H, rank, CR e parâmetros de montagem;
  - embarcações: custo por aresta e por hex de Água.
- O painel grava no JSON. Não há número de regra fixo no código.

**Conteúdo (abas do mestre)**
- **Regiões:** cadastro e **controle da tinta ao vivo** (cor, força, dessaturação), para o Pedro aprovar o visual.
- **Eventos:** a tabela global de cada região.
  - Filtros por categoria, raridade, polaridade e tipo.
  - A contagem por tipo de hex avisa onde falta evento.
  - O `status` (`rascunho` ou `aprovado`) aparece em cada evento.
- **Consequências:** os 7 textos de cada região, com os números do Sistema ao lado, só para leitura.
- **Tabelas dos hexes:** montar em lote por região, revisar e travar.

## 3. Sessão (mestre)
**HUD**
- Dia e período (manhã, tarde, noite).
- Barra do orçamento em metros, com marcas em 2/3 e 1/3 e a dívida, se houver.
- O grupo: membros e Movimento, com o menor destacado.
- A embarcação, se houver, com o custo por aresta e por hex de Água.
- O H do hex atual e o H do trecho desde a última parada.
- As camadas ligadas, com destaque quando uma alternativa (a ilusão) está ativa.

**Ações**
| Ação | Atalho | O que acontece |
|---|---|---|
| Andar | clique no destino | Mostra o plano com as paradas (`04-motor-de-regras.md` §2.2). Confirmado, o token anda **passo a passo** e para em cada parada |
| Explorar | E | Parada: lembrete da Jornada; rola a tabela, se o hex rolar; mostra o evento (com `textoMestre`) e pula o período |
| Encerrar o dia | A | O grupo explora o hex, se ainda não explorou, e descansa |
| Jornada | J | Abre sozinha em cada parada: lembrete *"rolem os dados"*, ações e resultados, meta, pontos; na falha, pede o d100 do grupo e mostra a consequência |
| Descanso | D | Pede a Sobrevivência; mostra comodidade, Abrigo, lembrete de emboscada e vigia |
| Embarcar / desembarcar | B | Escolhe Galeão, Fragata ou Canoa; o movimento passa às arestas do rio e aos hexes de Água |
| Camadas | L | Liga e desliga regiões e alternativas no mapa em jogo, nas duas janelas |
| Extração | — | Abre ao sair um sítio: materiais possíveis, resultado de cada um, unidades |
| Comerciante | — | Abre ao sair um comerciante: estoque com preços rolados |
| Mover grupo | M | Ajuste manual, sem custo |
| Desfazer | Ctrl+Z | Restaura o instantâneo anterior |
| Revelar ou ocultar | — | Decide se o último evento já aparece na tela dos jogadores. O padrão é revelar |

**Quem rola** (`01-regras.md` §8)
- **Dados dos jogadores** (Jornada, d100 da consequência, travessia, Sobrevivência): o app mostra o **lembrete** e um
  campo para o resultado. **Nunca rola por eles.**
- **Dados do mestre** (tabela do hex, dano, arrasto, comerciante): um botão "rolar" e um campo "digitar". O mestre
  escolhe o padrão nas configurações.
- Todo lembrete tem "dispensar".

**Diário:** tudo o que foi rolado ou digitado, com dia, período e parada. Tem filtros e exporta para Markdown.

## 4. Tooltip do hex
Aparece ao **parar o mouse sobre o hex por ~400 ms**, numa moldura do kit de UI.

| Campo | Mestre | Jogadores |
|---|---|---|
| Coordenada | ✓ | ✓ |
| Tipo e custo do passo | ✓ | ✓ |
| Região | ✓ | ✓ |
| Via e rio nas arestas | ✓ | ✓ |
| O que já foi revelado ali (nome e `textoJogadores`) | ✓ | ✓ |
| H do hex e da região | ✓ | — |
| Especial (com `textoMestre`) | ✓ | só o que foi revelado |
| Marca, evento definido | ✓ | só o que foi revelado |
| **Tabela do hex** (faixas do d100, pesos efetivos, travada) | ✓ | — |
| Notas | ✓ | — |

Hex oculto não tem tooltip na janela dos jogadores.

## 5. Janela dos jogadores
- **Fundo preto.** Só o **token do grupo** e o mapa.
- Por hex (`01-regras.md` §6):

  | Estado | Aparência |
  |---|---|
  | oculto | não é desenhado: preto, **sem grade** |
  | visto | tile **cinza**: dessaturado e escurecido, com vias, rios e marcas como foram vistos |
  | visível | tile vívido |

- **Transições:** um hex que entra no campo de visão sai do preto ou do cinza com um *dither* curto (150–250 ms). Na
  borda entre hex visto e oculto, uma franja pontilhada de 2–3 px tira o serrilhado reto.
- **Mapa em jogo:** só as camadas ligadas. Com a ilusão ligada, os jogadores veem a ilusão como se fosse a verdade.
- **Embarcado num rio:** só os 2 hexes da aresta ficam visíveis (`01-regras.md` §6.1).
- **Câmera:** segue o grupo com pan suave e zoom inteiro, que cabe na tela.
- **Marcas:** ícones dos eventos revelados (ruína, assentamento, covil, achado, abrigo).
- **HUD:** desligado por padrão. Uma opção mostra dia e período num canto.
- **Nada de segredo:** a janela recebe só a projeção dos jogadores (`02-arquitetura.md` §3).

## 6. Teste de vazamento (obrigatório)
`tests/test_projecao.py`:
1. Monta um mundo com eventos secretos.
2. Executa andar, explorar, Jornada e descanso.
3. Confere que a projeção dos jogadores **nunca** contém:
   - id ou nome de evento não revelado;
   - `tabelas`, `hostilidade`, `textoMestre`, `notas`;
   - hex nunca visto;
   - nada de camada desligada (com a ilusão ligada, nenhum dado do Abismo).

## 7. Sensação de roguelike
- **Pixel art nítida:** zoom inteiro, sem suavização.
- **Fonte:** DungeonFont-PT, que tem ã, õ, Ã e Õ (`06-arte.md` §7).
- **Molduras do kit de UI** com a paleta da região: a cor da moldura muda com a região onde o grupo está
  (`paletaUI`).
- **Animações curtas e secas:**
  - o token anda ~120 ms por hex;
  - o número do dado pisca ~300 ms antes de assentar;
  - a névoa se dissolve em pontilhado.
- **Teclado primeiro:** atalhos para todas as ações da sessão.
- **Som:** ganchos prontos, desligados por padrão. Ainda não há assets de som.
