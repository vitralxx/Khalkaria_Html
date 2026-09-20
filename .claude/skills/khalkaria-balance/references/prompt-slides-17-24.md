# PROMPT — Slides 17 a 24 · Patch Pré-Campanha Khalkaria

## Papel

Você é designer de apresentação. Vai produzir **8 slides (17 a 24)** de um deck de patch
notes de um RPG de mesa autoral dark fantasy chamado **Khalkaria**, em **português do
Brasil**. O público são os **jogadores da campanha**, lendo antes da Sessão 1. O tom é de
patch notes de jogo: direto, confiante, com números na cara. Não é marketing.

Esses 8 slides formam **uma seção inteira e contínua: O BAZAR** (o catálogo de itens do
sistema) e o novo sistema de fabricação que veio junto.

## Formato

- **16:9**, 1920×1080 px. O deck original é Google Slides a 720×405 pt.
- Entregue como **artifact HTML**, um `<section>` por slide, navegável por setas do teclado,
  cada slide ocupando a viewport inteira. Precisa ficar legível projetado e em tela de PC.
- Sem scroll interno em nenhum slide. Se o conteúdo não couber, **reduza o conteúdo**, não a
  fonte abaixo de 18 px.

## Sistema de design (canônico — puxado do site oficial do sistema, use exatamente)

```css
--bg-primary:    #0a0a0c    /* fundo padrão dos slides */
--bg-secondary:  #12121a
--bg-tertiary:   #1a1a24
--bg-card:       #15151f    /* cards, caixas de item */
--gold:          #d4af37    /* acento primário: títulos, réguas, números */
--gold-light:    #f4d03f    /* destaque dentro do dourado */
--gold-dark:     #a68a2a
--text-primary:  #e8e6e3    /* corpo */
--text-secondary:#a09c94    /* apoio */
--text-muted:    #6b6560    /* legendas, rodapé */
--accent-red:    #8b2635    /* "antes" / nerf / problema */
--accent-green:  #2d5a3d    /* "depois" / correção */
--accent-purple: #4a2c6a
--border-color:  #2a2a35
```

Tipografia (Google Fonts):
- Títulos: **Cinzel** (serifada, versalete). Subtítulos e rótulos também.
- Corpo: **Crimson Text** (serifada). Para tabelas densas e números, uma mono de sistema
  (`ui-monospace, Menlo, monospace`) é permitida e preferível.

**Cores de raridade — convenção fixa do sistema, nunca invente outra:**

| Raridade | Texto | Fundo do chip | Borda |
|---|---|---|---|
| Lixo | `#8b6b6b` | `#2a1a1a` | `#5a3535` |
| Ordinário | `#b8b5ad` | `#2a2a35` | `#6b6560` |
| Incomum | `#6ee7a0` | `#1e3a2a` | `#2d5a3d` |
| Exótico | `#c084fc` | `#2a1e4a` | `#6d4aa0` |
| Luxária | `#f4d03f` | `#4a3a1e` | `#d4af37` |

Toda vez que um nome de item aparecer, ele carrega um **chip de raridade** nessas cores.
A ordem de raridade é sempre: Lixo → Ordinário → Incomum → Exótico → Luxária.

Padrão de slide: título em Cinzel dourado no topo à esquerda, régua dourada de 2 px abaixo
dele, conteúdo em grid. Numeração discreta no canto inferior direito em `--text-muted`.
Nada de sombra, gradiente chamativo ou ícone genérico de banco de imagem.

## Regras de conteúdo (rígidas)

1. **Não invente absolutamente nada.** Todo número, nome de item, receita e regra abaixo é
   canônico e já está na planilha do sistema. Se algo parecer faltando, deixe o espaço
   vazio e sinalize — não preencha com estimativa.
2. Português do Brasil, com os termos do sistema exatamente como escritos: Sins, Éter,
   Stamina, Saúde, Ar, Ae, Evasão, Ofício(Ferraria), Ofício(Engenharia), Ofício(Alquimia),
   margem de ameaça, Exposto, bugiganga, Luxária.
3. **Ar** = redução de dano **ordinário** (cortante/perfurante/contundente).
   **Ae** = redução de **um tipo específico** de dano atípico. `Ae(Ordinário, N)` não existe.
4. Onde houver "antes → depois", use `--accent-red` para o antes e `--accent-green` para o
   depois, com seta `→`.
5. Nenhum slide pode ter mais de ~60 palavras de texto corrido. É um deck, não um documento.

---

# CONTEÚDO SLIDE A SLIDE

## SLIDE 17 — "O Bazar"

Abertura da seção. Hoje é um placeholder com uma anotação minha; **substitua inteiramente.**

Título: **O Bazar**
Subtítulo: *O catálogo inteiro passou por revisão categoria por categoria.*

Mostre como um painel de números (KPIs grandes em dourado, rótulo em text-secondary):

- **702 itens** no catálogo
- **9 categorias**
- **446 receitas** de fabricação escritas (antes: só armas genéricas e algumas bugigangas)

Distribuição por categoria, como barra ou tabela compacta:

| Categoria | Itens |
|---|---|
| Consumível | 215 |
| Arma | 181 |
| Bugiganga | 64 |
| Item Mágico | 61 |
| Armadura | 50 |
| Lixo | 48 |
| Material | 37 |
| Munição | 36 |
| Escudo | 10 |

E as 4 mudanças estruturais, em cards curtos:

1. **Categoria Arma inteira reescrita** — 181 itens, todos no mesmo formato de descrição.
2. **Materiais valem uma faixa abaixo** do item da raridade deles. Isso é o que abre margem
   para fabricar sair mais barato que comprar.
3. **Fabricar exige treinamento na perícia.** Sem treinamento, você não fabrica.
4. **Armadura separada em dois slots:** `[Pesada]` ocupa 1 slot e dá **Ar**; `[Leve]` ocupa
   2 slots e dá **Ae**. "Pesada" é o nome do slot, não do peso.

## SLIDE 18 — "Itens novos: a escada de Kali"

Hoje é um placeholder. O conteúdo é: **a linha completa de 15 armas de Kali.**

Título: **A Escada de Kali**
Linha de apoio: *15 armas Exóticas, uma para cada chassi do sistema.*

Faça um **grid de 15 cards** agrupados em 4 famílias (rótulo da família em Cinzel dourado,
versalete, acima de cada grupo):

**LEVES** — Adaga de Kali · Agulhão de Kali · Maça de Kali · Lasca de Kali
**PESADAS** — Alabarda de Kali · Picareta de Kali · Malho de Kali · Decepador de Kali
**MARCIAIS** — Mangual de Kali · Bordão de Kali · Rapieira de Kali · Sabre de Kali
**À DISTÂNCIA** — Arco de Kali · Balestra de Kali · Dardos de Kali

Todas as 15 são raridade **Exótico** (chip roxo `#c084fc`).

Destaque em faixa separada, porque é o que une a linha inteira — **a assinatura de Kali**:

> **+1 margem de ameaça · Crítico: o alvo fica Exposto**
> Presente nas 15, sem exceção.

E a receita, idêntica em forma para todas:

```
1x Arma <Chassi> +2   +   2x Kali
```

Nota de balanceamento, em caixa discreta no rodapé (`--text-muted`, menor):
*Kali não bate mais forte: a linha fica +0,6% de dano médio acima da arma padrão do mesmo
tier. O que ela compra é frequência de crítico, não potência.*

**Kali** é também um material, raridade Exótico, e só aparece em receita — nunca solto.

## SLIDE 19 — "Novo Crafting"

**Este slide já tem o texto certo. Mantenha as 4 frases, só redesenhe** no sistema visual.
Texto atual, palavra por palavra:

> Antigamente, apenas armas genéricas e algumas bugigangas podiam ser fabricadas, usando a
> perícia Ofício(Ferraria) e Ofício(Engenharia) respectivamente.
>
> Agora, basicamente TODOS os itens podem ser fabricados utilizando os novos Materiais.
>
> Todas as receitas são únicas e utilizam materiais relacionados ao item.
>
> Fabricar um item agora é bem mais barato do que comprá-lo. Extrair os materiais necessários
> para a fabricação, em vez de comprá-los de comerciantes, reduz ainda mais o preço de fabricação.

**Acrescente**, porque hoje falta e é a regra que o jogador mais vai usar na mesa:

**Os 3 ofícios**
```
Ofício(Ferraria)    →  Arma · Armadura · Escudo
Ofício(Engenharia)  →  Bugiganga · Munição · Item Mágico
Ofício(Alquimia)    →  Consumíveis alquímicos   (exclusivo do Alquimista)
```

**O que acontece quando você rola** (Ferraria e Engenharia):
- Passar por **10 ou mais** acima da CD → **recupera 1 dos materiais**
- Falha normal → **não cria o item, mas mantém os materiais**, pode tentar de novo
- Ficar **10 ou mais** abaixo da CD → **perde todos os materiais**
- **Alquimia é exceção:** perde os reagentes em qualquer falha, porque reagente volta de
  graça no descanso longo.

## SLIDE 20 — "Novos Materiais"

**Este slide já está pronto e é o melhor do deck.** Ele tem a grade de 32 materiais com arte.
**Não refaça a arte e não reordene a grade.** Só faça duas coisas:

1. Padronize o título no sistema visual (Cinzel dourado + régua), como nos outros.
2. Acrescente, em faixa fina no rodapé, a leitura que falta na grade:

> **8 famílias × 4 raridades.** Coluna 1: as ordinárias (Metal · Madeira · Couro · Tecido).
> Coluna 2: as atípicas (Mecânica · Gema · Energia · Mineral).
> Cada material vale **uma faixa abaixo** do item que ele constrói.

## SLIDE 21 — "Itens Evolutivos"

Hoje é um placeholder. O conteúdo são **3 cadeias reais**, lado a lado, como trilhos
horizontais com seta entre os degraus. Chip de raridade em cada degrau.

**Cadeia 1 — Arma**
```
Arma Leve Cortante      [Ordinário]   ←  1x Lingote de Ferro + 1x Couro de Caça + 1x Cobre
Arma Leve Cortante +1   [Incomum]     ←  1x Arma Leve Cortante + 1x Aço Temperado + 1x Couro Refinado
Arma Leve Cortante +2   [Exótico]     ←  1x Arma Leve Cortante +1 + 1x Liga Rúnica + 1x Couro Bestial
Adaga de Kali           [Exótico]     ←  1x Arma Leve Cortante +2 + 2x Kali
```

**Cadeia 2 — Foco místico**
```
Foco de Destruição      [Ordinário]   ←  1x Gema Bruta + 1x Fogo + 1x Madeira Comum
Foco de Destruição +1   [Incomum]     ←  1x Foco de Destruição + 1x Gema Refinada + 1x Eletricidade
Foco de Destruição +2   [Exótico]     ←  1x Foco de Destruição +1 + 1x Gema Mística + 1x Éter
Foco da Conflagração    [Exótico]     ←  1x Foco de Destruição +2 + 1x Gema Mística + 1x Kali
```

**Cadeia 3 — Armadura**
```
Grevas de Couro         [Ordinário]   ←  2x Couro de Caça + 1x Cobre
Grevas de Aço           [Incomum]     ←  1x Grevas de Couro + 1x Aço Temperado + 1x Ferro
Grevas do Corredor      [Exótico]     ←  1x Grevas de Aço + 1x Trama Etérea + 1x Kali
```

A regra que amarra as três, em destaque dourado no topo ou rodapé:

> **Nenhum item evolutivo pula degrau.**
> `1x item da raridade anterior + 1x matéria estrutural + 1x matéria temática`
> Você não chega no Foco +2 sem ter o +1 na mão.

E a consequência prática, uma linha:
> *A arma genérica que você lootar não é lixo — é o degrau de baixo da arma única.*

## SLIDE 22 — "Isso cria um novo loop de gameplay"

Hoje tem só 3 rótulos soltos. Transforme em um **ciclo fechado de verdade** — 3 nós em
círculo (ou triângulo) com setas curvas douradas ligando e voltando ao início.

```
EXTRAIR / COMPRAR   →   FABRICAR   →   EQUIPAR / VENDER
        ↑                                      │
        └──────────────────────────────────────┘
```

Uma linha de apoio por nó:

- **Extrair / Comprar** — materiais vêm de comerciantes ou do campo.
- **Fabricar** — teste de Ofício contra a CD da raridade. Precisa de treinamento.
- **Equipar / Vender** — o item entra em uso, ou vira Sins que voltam pro ciclo.

E o mecanismo que fecha o loop sem gastar Sins, em card destacado — **é a novidade
principal deste slide**:

> **Extração no descanso longo** (teste de Sobrevivência, custa a ação de descanso):
> `10+ → 1 Couro de Caça + 1 Comida` · `15+ → 2 Couros` · `20+ → 1 Couro Refinado + 2 Comidas`
> `25+ → 2 Couros Refinados` · `30+ → 1 Couro Bestial + 3 Comidas`
>
> O resultado entra direto na cadeia de fabricação, em vez de virar Sins.

## SLIDE 23 — "O Alquimista quebrava a economia"

Hoje este slide é **um print de conversa de WhatsApp e um print de terminal.** Jogue os dois
fora e reconstrua. É um slide de "achado e correção".

Título: **O Alquimista quebrava a economia**

O problema, como bloco `--accent-red`:

> A técnica **Produção em Massa** transformava reagentes — que voltam de graça em todo
> descanso longo — em itens vendáveis. Renda de **4.098 Sins por descanso longo**, renovável,
> sem limite prático.
>
> O valor do item multiplica por **32** do Nível 1 ao Nível 4. O custo em reagentes multiplica
> só por **4**. A ladeira é inescapável por preço.

A correção, como bloco `--accent-green`:

> **Itens criados por Produção em Massa não podem ser vendidos.**
>
> `4.098 → 683 Sins por descanso longo` · **−83%**
>
> Escolhida entre 4 opções simuladas. Não tira nada do uso pretendido da técnica: armar o
> grupo com 12 itens continua funcionando igual.

Rodapé, uma linha em `--text-muted`:
*Ofício(Alquimia) continua exclusivo do Alquimista — reagente só vem da classe. Mas os 95
itens alquímicos seguem compráveis por qualquer um.*

## SLIDE 24 — "Onde o Bazar está agora"

Hoje este slide é **um print de tabela de terminal mostrando buracos de cobertura** (pontos
vermelhos, coluna "Faltam"). Aquilo era o diagnóstico **antes** do trabalho. Jogue fora e
mostre o estado **atual**, honestamente, incluindo o que ainda falta.

Título: **Onde o Bazar está agora**

Tabela de cobertura de receita. Barras de progresso; verde `#2d5a3d` no cheio, `#2a2a35`
no vazio. Ordene como está aqui:

| Categoria | Receitas | % |
|---|---|---|
| Arma | 181/181 | 100% |
| Bugiganga | 64/64 | 100% |
| Armadura | 50/50 | 100% |
| Munição | 36/36 | 100% |
| Escudo | 9/10 | 90% |
| Consumível | 106/215 | 49% |
| Item Mágico | 0/61 | 0% |

Separe visualmente as duas últimas linhas — elas são o trabalho em aberto, não fracasso.
Legenda curta:

- **Consumível** — categoria ainda em revisão, é a próxima da fila.
- **Item Mágico** — proposital. Item mágico não é Ferraria nem Engenharia; provavelmente vai
  usar a perícia Místico, mas a decisão ficou para depois.

Rodapé:
> **Lixo (48) e Material (37) não entram na conta** — lixo não se fabrica e material se
> extrai, não se cria. Sobre o que é fabricável: **446 de 617 itens, 72%**.

---

# CHECKLIST ANTES DE ENTREGAR

- [ ] 8 slides, na ordem 17 → 24, sem slide extra e sem slide faltando.
- [ ] Nenhum print de WhatsApp, nenhum print de terminal, nenhum screenshot.
- [ ] Todo nome de item aparece com chip de raridade na cor certa da tabela.
- [ ] Nenhum número diferente dos que estão neste prompt.
- [ ] Todo texto em PT-BR, com os termos do sistema preservados.
- [ ] Legível a 1920×1080 projetado; nada abaixo de 18 px.
- [ ] Slides 19 e 20 mantiveram o conteúdo que já tinham.
