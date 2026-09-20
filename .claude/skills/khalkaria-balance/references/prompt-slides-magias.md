# PROMPT — Slides de Magia · Patch Pré-Campanha Khalkaria

## Papel

Você é designer de apresentação. Vai produzir **8 slides** de um deck de patch notes de um RPG
de mesa autoral dark fantasy chamado **Khalkaria**, em **português do Brasil**. O público são
os **jogadores da campanha**, lendo antes da Sessão 1. Tom de patch notes de jogo: direto,
confiante, números na cara. Não é marketing.

Os 8 slides formam uma seção contínua: **a reforma do sistema de magia**, que criou um andar
novo embaixo (20 truques de custo zero) e renumerou tudo que já existia.

**Onde entram:** são slides **novos**. O deck hoje vai de revisões de sistema (slides 2–16)
para a seção do Bazar (17–24) e depois para conteúdo futuro (25+). Magia é revisão de sistema,
então a seção entra **depois do slide 16 (O Limiar) e antes do slide 17 (O Bazar)** — o que
empurra a seção do Bazar para 25–32. Numere os seus slides como **M1 a M8**; a renumeração
final é do Pedro.

## Formato

- **16:9**, 1920×1080 px. O deck original é Google Slides a 720×405 pt.
- Entregue como **artifact HTML**, um `<section>` por slide, navegável por setas do teclado,
  cada slide ocupando a viewport inteira. Legível projetado e em tela de PC.
- Sem scroll interno. Se não couber, **reduza o conteúdo**, não a fonte abaixo de 18 px.

## Sistema de design (canônico — do site oficial do sistema, use exatamente)

```css
--bg-primary:    #0a0a0c    /* fundo padrão dos slides */
--bg-secondary:  #12121a
--bg-tertiary:   #1a1a24
--bg-card:       #15151f    /* cards de magia */
--gold:          #d4af37    /* acento primário: títulos, réguas, números */
--gold-light:    #f4d03f
--gold-dark:     #a68a2a
--text-primary:  #e8e6e3    /* corpo */
--text-secondary:#a09c94    /* descrição das magias */
--text-muted:    #6b6560    /* legendas, rodapé */
--accent-red:    #8b2635    /* "antes" / problema */
--accent-green:  #2d5a3d    /* "depois" / correção */
--accent-purple: #4a2c6a
--accent-blue:   #1e3a5f
--border-color:  #2a2a35
```

Tipografia (Google Fonts): títulos e rótulos em **Cinzel** (serifada, versalete); corpo em
**Crimson Text**. Para as barras de valor (`1d4 / 2d4 / 3d4`) use mono de sistema
(`ui-monospace, Menlo, monospace`) — são números que o jogador vai ler na mesa.

**Cor por escola** — o sistema não tem cores de escola definidas, então use este mapeamento,
montado só com as variáveis que já existem na paleta:

| Escola | Cor | Ícone |
|---|---|---|
| Destruição | `--accent-red` `#8b2635` | ⚔️ |
| Abjuração | `--accent-blue` `#1e3a5f` | 🛡️ |
| Alteração | `--accent-purple` `#4a2c6a` | 🌀 |
| Conhecimento | `--accent-green` `#2d5a3d` | 🔮 |

Cada slide de escola herda a cor dela na régua do título e na borda esquerda dos cards. O
dourado continua sendo o acento global.

Padrão de slide: título em Cinzel dourado no topo à esquerda, régua de 2 px abaixo, conteúdo
em grid. Numeração discreta no canto inferior direito em `--text-muted`. Sem sombra, sem
gradiente chamativo, sem ícone de banco de imagem.

## Regras de conteúdo (rígidas)

1. **Não invente nada.** Todo nome, número e descrição abaixo é canônico e já está fechado.
2. PT-BR, com os termos do sistema exatos: Éter, Stamina, Saúde, Evasão, Ar, Ae, Místico,
   Foco, PMA, Intensidade, Modulação, Contida, Normal, Forçada, Transbordante.
3. **As barras são sempre 3 valores** nas magias de Nível 1: `Normal / Forçada / Transbordante`.
   Nunca 4. Se uma magia tem valor fixo, não invente barras para ela.
4. "Antes → depois" usa `--accent-red` no antes e `--accent-green` no depois, com seta `→`.
5. As **descrições das magias são texto literal** — copie exatamente, não reescreva, não corte.

---

# CONTEÚDO SLIDE A SLIDE

## M1 — "O Teurgo não tinha nada no nível 1"

Slide de problema. Abre a seção.

Título: **Magias: um andar novo embaixo**

O problema, em bloco `--accent-red`:

> O Teurgo tinha acesso a magias de nível igual ao **seu nível − 1**. Na prática, isso significa
> que ele só ganhava magias de verdade no **nível 2**. No nível 1 ele tinha Éter no bolso e nada
> para gastar.

A solução, em bloco `--accent-green`:

> **Todas as magias do sistema sobem um nível.** As antigas de 1 a 4 viram 2 a 5.
> O Nível 1 agora é um andar novo: **20 truques que custam 0 Éter.**
>
> E a regra do Teurgo deixa de ser "nível − 1" e passa a ser **"magias do mesmo nível que o seu"**.

Rodapé, uma linha em `--text-muted`:
*20 truques · 5 por escola · custo base 0 Éter.*

## M2 — "A renumeração não tira nada de ninguém"

Este é o slide que responde "então eu fui nerfado?". A resposta é não, exceto no nível 1 —
e lá você ganhou.

Título: **O que muda por nível**

Tabela. Destaque só a primeira linha; as outras quatro devem parecer deliberadamente idênticas.

| Nível do personagem | Antes | Agora | |
|---|---|---|---|
| **1** | nada utilizável | **Nível 1 — os truques** | ganhou |
| 2 | nível 1 antigo | Nível 2 | igual |
| 3 | nível 2 antigo | Nível 3 | igual |
| 4 | nível 3 antigo | Nível 4 | igual |
| 5 | nível 4 antigo | Nível 5 | igual |

Frase de fecho, em dourado, grande:
> **Só o nível 1 mudou. Todo o resto é o mesmo poder com outro número.**

E a tabela de custo nova, ao lado ou abaixo:

| Nível | Custo de Éter | Requisito |
|---|---|---|
| **Nível 1** | **0 Éter** | — |
| Nível 2 | 2 Éter | — |
| Nível 3 | 4 Éter | — |
| Nível 4 | 6 Éter | — |
| Nível 5 | 8 Éter | Foco Primordial |

## M3 — "Como funciona um truque"

As regras do andar novo. Slide de mecânica pura.

Título: **Intensidade no Nível 1**

Destaque central:

| Intensidade | Custo |
|---|---|
| ~~Contida~~ | **não existe no Nível 1** |
| Normal | **0 Éter** |
| Forçada | +2 Éter |
| Transbordante | +4 Éter · Vontade CD 15 ou perde o dobro |

Risque visualmente a linha da Contida (`--text-muted`, tachado) — é a exceção que define o andar.

Três regras em cards curtos:

1. **Três barras, não quatro.** Onde as outras magias mostram `Contida / Normal / Forçada /
   Transbordante`, os truques mostram `Normal / Forçada / Transbordante`.
2. **Modulação continua no preço cheio.** Modular um truque custa mais que conjurar uma magia
   de Nível 2 inteira. É de propósito: modulação não é ferramenta de começo de campanha.
3. **Continua valendo 1 conjuração por turno.** Um truque de graça ainda ocupa a sua magia do
   turno — é isso que impede o spam, não o custo.

## M4 — ⚔️ Destruição

Título: **Destruição** · régua e bordas em `--accent-red`.
Linha de apoio: *Dano baixo, alcance curto, sem condições. Uma ferramenta a mais, não uma arma.*

Cinco cards. Cada card: **nome** (Cinzel, cor da escola) · **linha de stats** (mono) ·
**descrição** (`--text-secondary`).

**Fagulha** — 1 Ação · `4,5 / 6 / 9 m` · 1 Criatura · `1d4 / 2d4 / 3d4` Fogo
> Você estala os dedos e arremessa uma fagulha. Faça um teste de Místico contra a Evasão do alvo. A fagulha acende objetos inflamáveis desatendidos (tocha, estopa, óleo derramado) sem precisar de teste.

**Centelha** — 1 Ação · `1,5 m` · 1 Criatura · `1d4 / 2d4 / 3d4` Elétrico
> Um arco elétrico salta da sua mão para a criatura mais próxima. Acerta automaticamente e não pode ser bloqueado por cobertura. O alcance não aumenta por intensidade: o arco precisa de ar curto para saltar.

**Rajada Prismática** — 2 Ações · Cone `3 / 4,5 / 6 m` · `1d4 / 2d4 / 3d4` Ordinário (perfurante) · Reflexos p/ metade, CD `+0 / +2 / +4`
> Você materializa um punhado de cacos místicos e os cospe em cone.

**Toque Cáustico** — 1 Ação · Toque · 1 Criatura · `1d6 / 2d6 / 3d6` Ácido
> A ponta do seu dedo expele um ácido místico que se dissipa ao contato. Faça um teste de Místico contra a Evasão do alvo. Na intensidade transbordante, quando aplicado a um material não-mágico (corda, fechadura, grade fina), corrói em 1 rodada.

**Presas de Gelo** — 2 Ações · `3 / 4,5 / 6 m` · `2 / 3 / 4` presas · `1d4` Frio por presa
> Presas de gelo se formam no ar e disparam contra os inimigos. Cada presa dispara um ataque independente, teste de Místico contra a Evasão do alvo. A intensidade adiciona mais presas. PMA é aplicada nessa magia.

## M5 — 🛡️ Abjuração

Título: **Abjuração** · `--accent-blue`.
Linha de apoio: *Proteção de uma rodada. Nenhum número permanente, nenhum buff de graça.*

**Verniz do Éter** — 1 Ação · Pessoal · **Ae `1 / 2 / 3`** em 1 tipo · até o fim do seu próximo turno
> Você enverniza sua pele com uma camada fina de abjuração afinada a um elemento seguinte: Fogo, Frio, Elétrico, Veneno, Ácido, Psíquico, Radiante, Trovejante ou Necrótico. Escolha o tipo ao conjurar. Não funciona contra dano Ordinário.

**Presságio** — **Ação Livre** · apenas em você · apenas Intensidade Normal
`Efeito:` a sua próxima rolagem de Atacar neste turno ignora a PMA
`Custo:` se acertar, você perde Éter igual ao **número de dados de dano da arma usada**
> Você antecipa o golpe um instante antes de desferi-lo. A modulação Socializar não funciona nesta magia.

**Anteparo Etérico** — 1 Ação · `3 / 4,5 / 6 m` · painel 1,5 × 1,5 m · `5 / 10 / 15` Saúde
> Você fixa um painel de energia etérica translúcida em um ponto que possa ver. Ele fornece cobertura total a quem estiver atrás dele e some ao ser reduzido a 0 de Saúde.

**Rescaldo** — 1 Ação · `Toque / 1,5 / 3 m` · 1 Criatura · remove *Em Chamas* · Forçada: também *Enjoado* ou *Desorientado* · Transbordante: também *Amedrontado*
> Você passa a mão sobre a criatura e a energia abjurante sufoca o que arde nela. Cada conjuração remove uma única condição — a intensidade amplia a lista de escolhas, não a quantidade removida.

**Vínculo Cósmico** — 1 Ação · Toque · `1 / 2 / 3` criatura(s) voluntária(s)
> Você amarra um fio breve entre você e outra criatura que reparte os ferimentos igualmente entre as criaturas conectadas.

## M6 — 🌀 Alteração

Título: **Alteração** · `--accent-purple`.
Linha de apoio: *A escola mais larga. Bônus pequenos, condições pequenas, e coisas que só ela faz.*

**Dedo Místico** — 1 Ação · `4,5 / 9 / 13,5 m` · 1 objeto de até 0,5 kg
> Você move um objeto leve à distância: puxa uma alavanca, vira uma página, apaga uma vela, empurra uma moeda por baixo de uma porta. Uma manipulação por conjuração. Não pode atacar, desarmar nem tirar item de criatura.

**Lábia** — 1 Ação · Pessoal · `+1 / +2 / +3` em Convencimento, Intimidação, Enganação, Motivar ou Crime
> Escolha a perícia ao conjurar. Quem estiver te observando pode fazer Percepção contra a sua CD para perceber a conjuração; contra quem perceber, o bônus não se aplica.

**Lastro** — 1 Ação · `4,5 / 9 / 13,5 m` · 1 Criatura · 1 Rodada · Vontade ou *Lento 1*, CD `+0 / +2 / +4`
> Você adiciona peso ilusório aos membros de uma criatura. Em caso de falha no teste de Vontade, ela fica Lento 1 até o fim do próximo turno dela.

**Têmpera** — 1 Ação · Toque · 1 Arma · `1 / 2 / 3` ataque(s)
> Fogo, Frio, Elétrico, Veneno, Ácido, Psíquico, Radiante, Trovejante ou Necrótico. A arma mantém o dado base e o atributo.

**Rosto Emprestado** — 2 Ações · Toque · `10 / 30 / 60` minutos
> Cor dos olhos, uma cicatriz, o timbre da voz, a cor do cabelo, a insígnia da roupa. Não muda altura, rosto inteiro nem porte. Quem interagir pode fazer Percepção contra a sua CD para notar.

## M7 — 🔮 Conhecimento

Título: **Conhecimento** · `--accent-green`.
Linha de apoio: *Saber não é poder de graça — é o que transforma um turno gasto em um turno certo.*

**Farejar Elemento** — 1 Ação · raio `4,5 / 9 / 13,5 m` · `1 / 5 / 10` minutos
`Normal:` há Éter no raio · `Forçada:` qual elemento · `Transbordante:` a direção
> Seu faro fica extremamente sensível ao éter, rapidamente você sabe dizer se ele está presente no raio.

**Ponto Cego** — 1 Ação · `4,5 / 9 / 13,5 m` · 1 Criatura
> Você estuda a criatura e misticamente descobre suas principais resistências e imunidades. Escolha Ordinário, Elemental, Biológico ou Místico; o mestre revela se o alvo tem Armadura Específica, resistência e imunidades, mas não o valor exato.

**Sina** — 1 Ação · `9 / 18 / 27 m` para marcar · `10 min / 1 h / 8 h`
> Você amarra um fio de atenção à criatura. Ele não se rompe com parede, escuridão nem invisibilidade — mas também não diz o que ela está fazendo, nem permite atacá-la sem vê-la. Você só pode ter uma Sina ativa por vez.

**Vislumbre** — **Reação** · gatilho: você tira **1** na rolagem de um teste de perícia · **apenas Transbordante** · re-role o teste com desvantagem
> Por um instante o Éter te mostra o erro no momento exato em que ele acontece — tarde demais para evitá-lo, cedo o bastante para tentar de novo. O que chega é confuso e incompleto, e a segunda tentativa vem torta.

**Presciência** — **Ação Livre** · gatilho: você vai rolar Iniciativa · role duas vezes e fique com o melhor
> Você sente o combate um instante antes de ele começar. Iniciativa se rola uma vez por combate, então a magia se limita sozinha: não há uso repetido nem nada para anotar. A modulação Compartilhar não funciona nesta magia.

## M8 — "O que muda na sua ficha"

Fecho da seção. Curto, prático, para quem já tem personagem.

Título: **O que muda na sua ficha**

Três itens, cada um como linha "antes → depois":

- **Origem Cultista** e **Raça Corrompido** — "2 magias de nível 1" agora significa **2 truques**.
- **Dissipar Magia** — dissipa automaticamente magias de ~~Nível 2~~ → **Nível 3** ou menor.
- **Técnicas do Teurgo** que já citavam "magias de nível 0" agora citam **Nível 1**.

Fecho em dourado:
> **Nenhuma magia que você já tinha mudou de efeito. Só o número na frente dela.**

> ⚠️ **Este slide depende de uma passada de renumeração que o Pedro ainda vai fazer no Notion.**
> Monte o slide, mas deixe-o fácil de editar — os três itens podem mudar.

---

# CHECKLIST ANTES DE ENTREGAR

- [ ] 8 slides, M1 a M8, nenhum a mais, nenhum a menos.
- [ ] Toda barra de magia de Nível 1 tem **exatamente 3 valores**.
- [ ] A palavra "Contida" só aparece no M3, e tachada.
- [ ] As 20 descrições estão literais, sem reescrita e sem corte.
- [ ] Cada slide de escola usa a cor dela na régua e nas bordas dos cards.
- [ ] Nenhum número diferente dos que estão neste prompt.
- [ ] Legível a 1920×1080 projetado; nada abaixo de 18 px.
