# Início: como montar o repositório do hexcrawl (para o Pedro)

Este pack tem tudo o que o agente programador precisa para começar:
- regras;
- arquitetura;
- dados iniciais e schemas;
- um núcleo de regras testado;
- arte;
- o protocolo do agente.

## Passo a passo
1. **Crie o repositório privado** no GitHub. Sugestão: `khalkaria-hexcrawl`.
   - Se quiser, me passe o nome (`dono/repo`) e libere o acesso desta sessão: eu subo o pack direto lá.
2. **Copie o conteúdo do pack para a raiz do repositório.** O zip `hexcrawl-pack.zip` tem tudo. Faça o primeiro
   commit.
   - Copiou da pasta do branch de balanceamento, e não do zip? Renomeie `CLAUDE.agente.md` para `CLAUDE.md`.
   - Lá ele tem outro nome para não virar instrução dos agentes do site.
3. **Mapas grandes.** Baixe do seu Drive os dois PNG originais:
   - `Kharavel Versão 2 abismo OFICIAL.png`;
   - `Kharavel Versão 2.png`.

   Depois rode:
   ```
   python ferramentas/reduz_referencia.py "Kharavel Versão 2 abismo OFICIAL.png" "Kharavel Versão 2.png"
   ```
   - Isso gera `arte/referencia/kharavel-oficial.webp` e `kharavel-ilusao.webp`, com 4096 px de largura. Elas
     entram no git.
   - Os originais **não** entram: o `.gitignore` já barra os PNG dessa pasta.
   - O script precisa de Python com Pillow (`pip install pillow`).
   - **Sem Python local?** Anexe os dois PNG na primeira conversa com o agente, se o tamanho passar. Ou exporte você
     mesmo os dois mapas em WebP ou JPG com 4096 px de largura, com esses nomes.
4. **Abra o Claude Code no repositório novo** e cole o prompt de abertura (abaixo).
5. **Responda as perguntas** de `docs/10-pendencias.md` quando puder. As fases F0 a F2 só dependem da P1 (topo
   chato).

## Prompt de abertura (copie e cole)
```
Você é o agente programador do app de hexcrawl de Kharavel (RPG Khalkaria). Antes de qualquer código, leia o
CLAUDE.md e todos os arquivos de docs/. Comece pela fase F0 de docs/08-fases.md:
- promova referencia/ a hexcrawl/nucleo/;
- monte o pyproject, os testes, o validador e o CI;
- gere as referências reduzidas, se os mapas originais estiverem em arte/referencia/.
Ao terminar a F0, me mande um resumo curto, o que ficou pendente e as perguntas numeradas.
```

## O que tem no pack
| Pasta | Conteúdo |
|---|---|
| `CLAUDE.md` | protocolo do agente programador |
| `docs/` | 00 visão · 01 regras · 02 arquitetura · 03 dados · 04 motor · 05 interface · 06 arte · 07 geografia · 08 fases · 09 trechos do Sistema · 10 pendências |
| `schemas/` | JSON Schema de mundo, hexes, arestas, rios, vias, territórios, eventos, consequências, campanha e atlas |
| `dados/kharavel/mundo/` | `mundo.json` (grade, 10 tipos, 9 regiões, cidades, materiais propostos) e as 9 tabelas de consequência, com os textos por escrever |
| `dados/exemplo/` | um mundo pequeno e válido, com cada recurso do formato. É a fixture dos testes |
| `referencia/` | o núcleo de regras em Python puro: geometria, regras, tabelas, visão, validador. Tem 40 testes e os geradores do exemplo, dos vetores e do atlas |
| `testes/vetores-regras.json` | 216 casos de entrada → saída, que valem para qualquer linguagem |
| `assets/tiles/` | sua folha de terreno e a de vias, mais `atlas.json` (o que é cada tile) |
| `assets/ui/` | o kit de UI extraído do `.rar`: 18 paletas e o molde branco |
| `assets/fontes/` | DungeonFont original e a **DungeonFont-PT** (com ã, õ, Ã e Õ), mais o script que a gera |
| `arte/referencia/` | o continente com a legenda e as 2 imagens de expectativa |
| `ferramentas/` | `reduz_referencia.py` |

## Como as regras mudam daqui para a frente
- Regra nova ou mudança de regra passa por você.
- O agente de balanceamento atualiza a proposta, e o agente programador aplica `docs/01-regras.md`.
- Os dois não se falam direto: você leva as perguntas numeradas de um para o outro.
