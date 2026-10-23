# 00 · Visão

## O que é
Um app de **hexcrawl** para o continente de **Kharavel**, do RPG **Khalkaria** (d20 autoral em PT-BR). O Pedro é o
autor do sistema e o mestre da mesa.

O app faz quatro coisas:
1. **Edita** o mapa: um tilemap de pixel art com pincéis de terreno, região, via, rio, aresta e borda.
2. **Guarda** os hexes e as tabelas de eventos de cada região e de cada hex, em JSON.
3. **Calcula** a viagem sozinho: custo de cada passo, períodos do dia, travessias, Jornada, extração e descanso.
4. **Mostra** aos jogadores, numa segunda janela, o mapa sob névoa, com o token do grupo.

## Quem usa
- **O mestre (Pedro)** prepara o mundo no **Editor** e conduz a mesa no modo **Sessão**.
- **Os jogadores** só olham a **janela dos jogadores**, num segundo monitor ou na TV. Eles não mexem no app.

## Princípios do Pedro
- *"Visual, organização e interface elegante é prioridade."* A UI é refinada, com **sensação de roguelike**: pixel
  art nítida, a fonte DungeonFont, molduras do kit de UI e animações curtas e secas.
- *"Hex iguais ficam mais previsíveis assim"*: os jogadores só sabem o que viram e o que rolaram.
- Os dados ficam numa estrutura que **um agente consegue preencher e conferir**. Por isso é JSON com schema.
- **O app não inventa regra.** Todo número sai de `01-regras.md`. O que faltar volta ao Pedro.
- **Conteúdo criativo precisa de aceite do Pedro:** textos de evento, consequências, nomes. O agente pode rascunhar,
  marcando como rascunho.

## Glossário
| Termo | Sentido |
|---|---|
| hex | uma célula da grade, com id `CCLL` (coluna e linha 1-based, 2 dígitos cada) |
| tipo | um dos 10 tipos de terreno; dá o ícone, o custo e o raio de visão |
| região | uma das 9 regiões de Kharavel; dá a cor do solo, a Hostilidade e as tabelas |
| cidade | Khaskavel ou Revavena; hexes fora das regiões, com mapa próprio fora do app |
| especial | hex sem tabela, com propósito narrativo fixo (marco, vila pré-feita, portão) |
| aresta | o lado entre dois hexes; pode ter rio, ponte ou penhasco |
| via | estrada ou trilha; passa pelos centros dos hexes e manda no custo do passo |
| território | contorno de cidade desenhado pelas bordas dos hexes |
| H | Hostilidade (0/5/10/15/20), da região ou do hex |
| orçamento | metros de viagem do dia, igual ao menor Movimento do grupo |
| parada | fim de período andando, explorar ou fim do movimento; cada parada lembra a Jornada |
| camada | uma região como camada do mapa, que liga e desliga; a alternativa (a ilusão) ocupa as células de outra |
| período | manhã, tarde e noite, contados pelo orçamento restante |
| explorar | parar no hex atual para explorá-lo: Jornada, tabela do hex e um período pulado |
| Jornada | o teste de grupo do Sistema, a cada parada, uma vez por período; os jogadores rolam |
| consequência | o d100 da região quando a Jornada falha |
| tabela do hex | os eventos possíveis daquele hex, montados da tabela global da região, com pesos |
| marcado | hex que ganhou um notável, um raro ou um Abrigo; não rola mais |
| névoa | estado de cada hex na tela dos jogadores: oculto, visto ou visível |

## O que **não** é
- Não é a ficha de personagem: a mesa aplica dano e recursos na ficha do site.
- Não é o Bestiário: combates descrevem as criaturas no próprio evento.
- Não é o mapa das cidades.
- Não é um gerador de mundo aleatório. A geografia sai da arte do Pedro (`07-geografia.md`).
