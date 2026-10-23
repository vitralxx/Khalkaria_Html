# Início (para o Pedro)

O repositório é **`vitralxx/khalkaria_hexcrawl`**, e o pack de inicialização já está nele. O agente programador
precisa de três coisas para começar:
- os mapas reduzidos (passo 1);
- uma sessão do Claude Code no repositório (passo 2);
- o prompt de abertura (abaixo).

> No branch de balanceamento (`Khalkaria_Html`), o protocolo do agente se chama `CLAUDE.agente.md`, para não virar
> instrução dos agentes do site. No repositório do hexcrawl, ele é o `CLAUDE.md`.

## Passo a passo
1. **Mapas grandes.** Baixe do seu Drive os dois PNG originais:
   - `Kharavel Versão 2 abismo OFICIAL.png`;
   - `Kharavel Versão 2.png`.

   Depois rode, na raiz do repositório:
   ```
   python ferramentas/reduz_referencia.py "Kharavel Versão 2 abismo OFICIAL.png" "Kharavel Versão 2.png"
   ```
   - Isso gera `arte/referencia/kharavel-oficial.webp` e `kharavel-ilusao.webp`, com 4096 px de largura. Elas
     entram no git.
   - Os originais **não** entram: o `.gitignore` já barra os PNG dessa pasta.
   - O script precisa de Python com Pillow (`pip install pillow`).
   - **Sem Python local?** Anexe os dois PNG na primeira conversa com o agente, se o tamanho passar. Ou exporte você
     mesmo os dois mapas em WebP ou JPG com 4096 px de largura, com esses nomes.
   - Os mapas só são necessários a partir da fase F3 (geografia). O agente pode começar sem eles.
2. **Abra o Claude Code no repositório** `vitralxx/khalkaria_hexcrawl` e cole o prompt de abertura.
3. **Responda as perguntas abertas** de `docs/10-pendencias.md` (P16–P18) quando puder. As fases F0 a F2 não
   dependem delas.

## Prompt de abertura (copie e cole)
```
Você é o agente programador do app de hexcrawl de Kharavel (RPG Khalkaria). Antes de qualquer código, leia o
CLAUDE.md e todos os arquivos de docs/, nesta ordem: 00, 01, 02, 03, 04, 08, depois os demais.

Comece pela fase F0 de docs/08-fases.md:
- promova referencia/hexcrawl_ref a hexcrawl/nucleo/ (git mv, sem duplicar);
- monte o pyproject.toml, o pytest (os 45 testes e os 248 vetores de testes/vetores-regras.json), o validador na
  linha de comando, a validação dos dados pelos schemas e o CI no GitHub Actions;
- gere as referências reduzidas com ferramentas/reduz_referencia.py, se os mapas originais estiverem em
  arte/referencia/.

Não invente regra nem número: o que faltar vira pergunta numerada, com a sua recomendação primeiro. Commits
atômicos, com mensagem em PT-BR. Ao terminar a F0, me mande um resumo curto, o que ficou pendente e as perguntas.
```

## O que tem no repositório
| Pasta | Conteúdo |
|---|---|
| `CLAUDE.md` | protocolo do agente programador |
| `docs/` | 00 visão · 01 regras · 02 arquitetura · 03 dados · 04 motor · 05 interface · 06 arte · 07 geografia · 08 fases · 09 trechos do Sistema · 10 pendências |
| `schemas/` | JSON Schema de mundo, hexes (e camadas), arestas, rios, vias, territórios, eventos, consequências, campanha e atlas |
| `dados/kharavel/mundo/` | `mundo.json` (grade, 10 tipos, 3 embarcações, 9 regiões, cidades, materiais aprovados) e as 9 tabelas de consequência, com os textos por escrever |
| `dados/exemplo/` | um mundo pequeno e válido, com cada recurso do formato, inclusive uma camada alternativa (miragem). É a fixture dos testes |
| `referencia/` | o núcleo de regras em Python puro: geometria, regras, tabelas, visão, camadas, validador. Tem 45 testes e os geradores do exemplo, dos vetores e do atlas |
| `testes/vetores-regras.json` | 248 casos de entrada → saída, que valem para qualquer linguagem |
| `assets/tiles/` | sua folha de terreno e a de vias, mais `atlas.json` (o que é cada tile) |
| `assets/ui/` | o kit de UI extraído do `.rar`: 18 paletas e o molde branco |
| `assets/fontes/` | DungeonFont original e a **DungeonFont-PT** (com ã, õ, Ã e Õ), mais o script que a gera |
| `arte/referencia/` | o continente com a legenda e as 2 imagens de expectativa |
| `ferramentas/` | `reduz_referencia.py` |

## Como as regras mudam daqui para a frente
- Regra nova ou mudança de regra passa por você.
- O agente de balanceamento atualiza `docs/01-regras.md` (e o núcleo, quando for o caso), e o agente programador
  implementa.
- Os dois não se falam direto: você leva as perguntas numeradas de um para o outro.
