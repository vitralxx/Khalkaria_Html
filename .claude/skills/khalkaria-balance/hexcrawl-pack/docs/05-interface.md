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
| **Camadas** | Liga e desliga: referência, coordenadas, regiões, vias, rios, territórios, especiais, névoa (prévia) |
| **Vista por região** | Recorta uma região com o anel vizinho e o rótulo "→ Para [região]" |
| Básico | Desfazer e refazer, zoom inteiro, arrastar, atalhos, salvar com conferência |

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
- A embarcação, se houver. O H do hex atual e o maior H do dia.

**Ações**
| Ação | Atalho | O que acontece |
|---|---|---|
| Andar | clique no destino | Mostra o plano (`04-motor-de-regras.md` §2.2). Confirmado, o token anda **passo a passo** e para no fim do dia |
| Explorar | E | Rola a tabela, se o hex rolar. Mostra o evento (com `textoMestre`) e pula o período |
| Acampar | A | Fecha o dia ali |
| Jornada | J | Formulário de ações e resultados, meta, pontos e consequência |
| Descanso | D | Sobrevivência, comodidade, Abrigo, lembrete de emboscada e vigia |
| Extração | — | Abre ao sair um sítio: materiais possíveis, resultado de cada um, unidades |
| Comerciante | — | Abre ao sair um comerciante: estoque com preços rolados |
| Mover grupo | M | Ajuste manual, sem custo |
| Desfazer | Ctrl+Z | Restaura o instantâneo anterior |
| Revelar ou ocultar | — | Decide se o último evento já aparece na tela dos jogadores. O padrão é revelar |

**Diário:** tudo o que foi rolado, com dia e período. Tem filtros e exporta para Markdown.

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
   - hex nunca visto.

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
