# PROMPT — Reconstrução do Bazar · `pages/bazar.html`

## O que é isto

O **Bazar** é o catálogo de itens de Khalkaria, um RPG de mesa dark fantasy. **Os jogadores ficam
com esta página aberta a sessão inteira** — é a ferramenta de consulta deles, não uma vitrine.
Hoje ela é uma lista com busca. Precisa virar um **inventário de mundo**: algo que responda
sozinho as perguntas que o jogador hoje responde rolando a página.

A página é **gerada** por `gerar_bazar.py` a partir de `Bazar_Khalkaria_v26.csv`. Você mexe no
gerador e no CSS, não no HTML de saída.

---

## Diagnóstico do que existe hoje

Rodei as duas telas atuais (Cards e Lista). Os problemas, em ordem de gravidade:

1. **Os dados estão defasados.** A página diz "581 itens" e o contador diz "582 de 582". **O CSV
   tem 729.** Pior: todo item Exótico mostra `Valor: 6d10+40 Sins`, e o CSV atual usa `5d12+180`
   para Exótico. **Regenere a partir do CSV antes de qualquer outra coisa.**

2. **Faltam os filtros que importam.** Existem CATEGORIA, RARIDADE e FABRICAÇÃO. Não existe filtro
   por **região**, por **CR de drop**, nem por **"o que eu consigo fabricar agora"** — que é a
   pergunta número um de quem está com a ficha na mão.

3. **Não dá para ordenar nada.** Nem nos cards, nem na lista. Um jogador que quer "a cura mais
   barata que eu alcanço" não tem caminho.

4. **A receita é texto morto.** O card mostra `🔨 Alquimia — 3x Reagente Alquímico (x1)` como
   texto. Não dá para clicar no material, não diz onde se acha, não mostra a cadeia.

5. **A visão Lista perde informação** — só Nome, Raridade, Categoria, Efeito e Valor. Some
   Obtenção, some fabricação, some CD.

6. **Nada mostra que o sistema é evolutivo.** Quase todo equipamento é uma cadeia
   (`Arma Leve Cortante` → `+1` → `+2` → `Adaga de Kali`) e a página trata cada degrau como item
   solto.

7. **Sem ícones.** Só um emoji no título.

---

## A planilha: como indexar

`Bazar_Khalkaria_v26.csv` — **729 itens + 1 linha de cabeçalho, 29 colunas.**

✅ **A estrutura foi consertada.** O arquivo antes não tinha cabeçalho na linha 1 — ela era um item
(`Agulha Torta`) e o cabeçalho estava perdido na linha 606, então `csv.DictReader` usava um item
como nomes de coluna e produzia lixo. Agora o cabeçalho está na linha 1 e todas as 729 linhas têm
as 29 colunas. `csv.DictReader(open(CSV))` funciona direto, sem tratamento especial.

Colunas usadas (as 17 `Coluna N` no fim são reserva vazia, ignore):

| Coluna | Conteúdo | Cuidado |
|---|---|---|
| `Nome` | chave do item | dois itens podem repetir nome em categorias diferentes |
| `Categoria` | ver abaixo | **pode ser composta** |
| `Raridade` | Lixo · Ordinário · Incomum · Exótico · Luxária | ordem de exibição é essa |
| `Efeito` | regra do item | o arquétipo está no começo, ver abaixo |
| `Valor (Sins)` | **fórmula de dado**, não número | `1d8+2` `2d10+10` `4d10+45` `5d12+180` `6d20+620` |
| `Obtenção` | formato fixo novo, ver abaixo | parseável |
| `Tipo de Craft` | Ferraria · Engenharia · Alquimia · Sobrevivência · Não-craftável | |
| `Ingredientes` | `1x Item + 1x Item + 1x Item` | vazio quando Não-craftável |
| `CD de Craft` | número | preenchido em 100% dos craftáveis |
| `Tags` | rótulos livres separados por vírgula | |
| `Lore/Notas` | texto de ambientação | opcional |

### Categoria composta

**Dois itens têm `Categoria = "Material, Consumível"`** — a *Pétala do Sonhador* e a *Lágrima de
Velúria*. São itens que servem de reagente **e** podem ser usados. **Divida por vírgula e indexe
o item nas duas categorias.** Ele deve aparecer ao filtrar por Material e ao filtrar por
Consumível, sendo o mesmo item. Não duplique o card.

### `Obtenção` — agora é parseável

Três formatos, separados por ` · `:

```
Drop CR 3 · Terras Livres · Loja
Sobrevivência CD 10 · Cordilheira Cristalina · Loja
Alquimista · Drop CR 2 · Emaranhado de Raízes · Loja
Único/Quest
```

O CR e a região derivam da raridade e são consistentes no catálogo inteiro:

| Raridade | Drop | Regiões |
|---|---|---|
| Lixo | CR <1 | 1 |
| Ordinário | CR 1 | 1–2 |
| Incomum | CR 2 | 3–4 |
| Exótico | CR 3 | 5–6 |
| Luxária | CR 4+ | 7–8 |

As 8 regiões, em ordem crescente de perigo e de recompensa:

```
1. Cinturão Silencioso   2. Bosque Corrompido    3. Emaranhado de Raízes  4. Costas Rochosas
5. Terras Livres         6. Cordilheira Cristalina  7. Ermo das Cinzas    8. Deserto do Abismo
```

**Cada item pertence a UMA região.** Não é "dessa região para cima" — quem está no Deserto do
Abismo não quer itens ordinários. `Único/Quest` (32 itens) não tem região nem CR.

### Arquétipo: extraia do começo do `Efeito`

**284 itens declaram o arquétipo na primeira palavra do campo `Efeito`.** Isso hoje está invisível
para o jogador. Extraia por regex e vire **chip filtrável**:

- **Armas** (15 chassis): `Leve Cortante` `Leve Perfurante` `Leve Contundente` `Leve Ágil` ·
  `Pesada Cortante` `Pesada Perfurante` `Pesada Contundente` `Pesada Brutal` ·
  `Marcial Pesada` `Marcial Longa` `Marcial Precisa` `Marcial Versátil` ·
  `Distância Simples` `Distância Pesada` `Arremesso`
- **Focos místicos**: `Foco Místico (Escola)` — 30 itens
- **Armaduras**: começam com `[Pesada]` ou `[Leve]` — é **slot de equipamento**, não peso
- **Munições**: começam com `[Distância Simples]`, `[Distância Pesada]` ou `[Arremesso]` — indica
  com qual arma a munição funciona

---

## O que construir

### 1. Filtros novos

Junto dos que já existem, adicione:

- **REGIÃO** — 8 chips, na ordem de perigo acima. Cor esquentando do 1 ao 8.
- **ARQUÉTIPO** — os chassis extraídos acima, agrupados por família.
- **OFÍCIO** — já existe como FABRICAÇÃO, mas acrescente **Sobrevivência** (é o quarto ofício).
- **"O que eu consigo fabricar"** — o jogador informa o ofício e o nível de treino; a página mostra
  só o que ele passa no CD. Este é o filtro que substitui a maior parte da pesquisa manual.

### 2. Visualizador de craft — a peça central

Ao abrir um item, mostre **a cadeia inteira**, não só a receita imediata:

```
Arma Leve Cortante  →  +1  →  +2  →  Adaga de Kali
   [Ordinário]      [Incomum] [Exótico]  [Exótico]
```

Para cada degrau: os ingredientes, o CD, e **onde cada ingrediente é encontrado** (região + CR),
puxando do próprio catálogo. O jogador precisa ver, numa tela, tudo que falta para chegar no item
que ele quer.

**Torne cada ingrediente clicável** — abre o card daquele material.

### 3. Índice reverso de material

Há **88 materiais distintos** usados em receitas. Ao abrir um material, mostre **em que receitas
ele entra**. `Liga Rúnica` aparece em **63 receitas**, `Aço Temperado` em 62, `Kali` em 39. Hoje o
jogador não tem como descobrir isso a não ser lendo 729 itens.

### 4. Ordenação

Nos dois modos: por **nome**, **raridade**, **valor** e **CD de craft**. Na visão Lista, os
cabeçalhos das colunas ordenam ao clicar.

### 5. Visão Lista completa

Acrescente as colunas que faltam: **Obtenção**, **Região**, **Ofício** e **CD**. Hoje quem usa a
Lista perde metade do dado.

### 6. Ícones

Um ícone por **categoria** (9) e uma marcação visual por **raridade** (5). Use SVG inline
desenhado à mão — nada de biblioteca de ícones genérica, nada de emoji. Devem parecer gravados,
não desenhados em app.

---

## Design

A vibe é **RPG de sobrevivência**, não catálogo de loja. O jogador deve sentir que está
consultando um registro de mundo.

Paleta — **amarelo-alaranjado com raízes pretas e contraste em roxo**:

```css
--bg-primary:    #0a0a0c    /* fundo */
--bg-card:       #15151f
--bg-tertiary:   #1a1a24
--gold:          #d4af37    /* acento principal */
--gold-light:    #f4d03f
--amber:         #e08b2c    /* o alaranjado: bordas, réguas, estados ativos */
--roxo:          #6d4aa0    /* o contraste */
--roxo-claro:    #c084fc
--text-primary:  #e8e6e3
--text-secondary:#a09c94
--text-muted:    #6b6560
--border-color:  #2a2a35
```

**Raízes pretas** são o motivo visual da página: a Vhelor é uma árvore gigante que corrompe o
continente pelas raízes. Use raízes em SVG como separador de seção, como moldura do cabeçalho e
como marca d'água de fundo, sempre em preto sobre preto (quase imperceptível, textura e não
desenho). Elas nunca competem com o texto.

**Cores de raridade — convenção fixa do sistema, não invente outra:**

| Raridade | Texto | Fundo do chip | Borda |
|---|---|---|---|
| Lixo | `#8b6b6b` | `#2a1a1a` | `#5a3535` |
| Ordinário | `#b8b5ad` | `#2a2a35` | `#6b6560` |
| Incomum | `#6ee7a0` | `#1e3a2a` | `#2d5a3d` |
| Exótico | `#c084fc` | `#2a1e4a` | `#6d4aa0` |
| Luxária | `#f4d03f` | `#4a3a1e` | `#d4af37` |

Tipografia, já usada no site: **Cinzel** nos títulos e rótulos, **Crimson Text** no corpo, mono de
sistema nos números e fórmulas de dado.

**Desktop primeiro.** Os jogadores usam PC.

---

## Não fazer

1. **Não invente item, efeito, preço nem receita.** O CSV é a única fonte. Se um campo estiver
   vazio, mostre vazio.
2. **Não converta `Valor (Sins)` em número.** É uma fórmula de dado que o jogador rola na mesa.
   Mostre `5d12+180`, não `240`.
3. **Não duplique os dois itens de categoria composta.** Um card, dois filtros.
4. **Não use emoji como ícone** nem biblioteca de ícones pronta.
5. **Não quebre o botão "+ Ficha"** nem a aba lateral da Ficha — eles integram com a ficha
   interativa e precisam continuar funcionando.

---

## Conferência antes de entregar

- [ ] O contador mostra **729 itens**, não 581.
- [ ] Nenhum Exótico mostra `6d10+40`; todos mostram `5d12+180`.
- [ ] *Pétala do Sonhador* e *Lágrima de Velúria* aparecem ao filtrar **Material** e ao filtrar
      **Consumível** — e é o mesmo card nas duas.
- [ ] Filtrar pela região `Deserto do Abismo` devolve **só Luxária**; `Cinturão Silencioso` devolve
      Lixo e Ordinário, nunca Exótico.
- [ ] Abrir a `Adaga de Kali` mostra a cadeia até a `Arma Leve Cortante`, com CD em cada degrau.
- [ ] Abrir `Liga Rúnica` lista as 63 receitas que a usam.
- [ ] Os 15 chassis de arma aparecem como filtro.
- [ ] A visão Lista tem Obtenção, Região, Ofício e CD.
