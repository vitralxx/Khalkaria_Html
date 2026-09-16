# Parâmetros de decisão do Pedro

> **Este arquivo é a lei.** Tem precedência sobre qualquer inferência minha e sobre os outros
> references. Organizado por assunto, não por ordem cronológica. Os códigos `D<N>` são
> identificadores estáveis — nunca renumerar, nunca reciclar.
>
> Regra de manutenção: decisão nova entra na **seção do assunto**, não no fim do arquivo.
> Se uma decisão nova revoga outra, edite a antiga em vez de empilhar.

---

# 0. Protocolo de trabalho

**D47 — Sempre imprimir o texto exato da planilha.** Nunca descrever um item sem mostrar a linha
dele. Vale para achado, proposta e correção. *"Não gosto quando você resume o item sem de fato
printar a tabela com texto exato da planilha."*

**Fluxo de revisão.** Lotes de ~12–25 itens por categoria e raridade. Imprimo
`Nome | Raridade | Descrição EXATA | receita`; o Pedro opina em lista numerada; eu reinsiro no CSV.
**Correção apontada num item vale para a família inteira** — aplicar globalmente, não pontualmente.

**Ordem de revisão.** Arma ✅ → Munição ✅ → Bugiganga (em curso) → Escudo → Armadura →
Item Mágico → Consumível → Lixo. **Material: só por decisão explícita.**

**Fontes de verdade.** Notion manda em tudo, **exceto o Bazar**, cuja verdade é
`references/bazar-v26.csv`. Seções do Notion sobrescrevem itens do Bazar (D1: a tabela de armas).
O **repo `vitralxx/Khalkaria_Html` é o site em HTML e está desatualizado** — um agente copia o
Notion para lá e dessincroniza depois de patches. Nunca usar o repo como fonte.
⚠️ **Partes do Bazar foram alucinadas por IAs.** Desconfiar de item cuja mecânica não aparece
em nenhum outro lugar.

**Nunca inventar cânone.** Adição criativa exige aprovação prévia. Correção factual contra o
Notion pode ser aplicada direto. Ao inventar uma imagem ou termo, **declarar que é invenção minha**.

**Método de verificação.** Comparar por conjunto via script, nunca a olho. Listas digitadas à mão
a partir do Notion já falharam. `auditor.py` é a régua executável.

---

# 1. Réguas de combate

## Modelo de DPR (canônico)
```
1 ação   (3 ataques a 60/35/10%)   DPR = 1,20·D + 1,05·mod     → 1,20D + 3,15 com mod +3
2-3 ações (1 ataque a 60%)          DPR = 0,65·D + 0,60·mod     → 0,65D + 1,80 com mod +3
```
O 1,20 = 1,05 acertos + 0,15 de dados extras do crítico. O 0,65 = 0,60 + 0,05.
**Referência de DPR de PJ no nível 5: 18–25. Saúde mediana de PJ no nível 5: ~55.**

## PMA — Penalidade de Multiataque
−5 cumulativo por ataque consecutivo no mesmo turno. **Todo texto de habilidade deve declarar
se a PMA se aplica.**

**D29 — PMA é contada POR ALVO em ataques multi-alvo.** Acumula −5 por ataque adicional contra a
mesma criatura e **zera ao trocar de alvo**. Princípio que a sustenta: subir de nível de Sangramento
é genuinamente difícil porque **todo ataque que acerta remove 1 marca**, o setup pode ser
amplificado *e sabotado* por aliados, e proeza difícil merece dano absurdo.

## Retaliação
Todo ataque (inclusive erro) abre contra-ataque; o alvo pode reagir a cada ataque e só gasta a
reação no fim do seu turno. **Ataques à distância nunca são retaliados.** *Alcançar*, *Caído* e
*Desprevenido* bloqueiam.

## Orçamento de ação por família de arma (D24, D25)
```
Leves · Marcial Precisa · Marcial Versátil   3 ações atacando   → habilidade só como AÇÃO LIVRE
Pesadas · Marcial Pesada · Marcial Longa     sobra 1 ação       → habilidade pode custar 1 AÇÃO
Pesada Brutal                                turno inteiro      → só PASSIVO ou no acerto
```

## Escadas de rider por custo de ação (D14, D23, D25, D43)
O rider incide nos **acertos**, e uma arma de 1 ação acerta ~1,85× mais que uma de 2.
```
ARMA          1 ação    Incomum +1d4 · Exótico +1d6  · Luxária +1d8
              2-3 ações Incomum +1d8 · Exótico +1d12 · Luxária +2d8

MUNIÇÃO       1 ação    Incomum +1d4 · Exótico +1d6  · Luxária +2d6
              2 ações   Incomum +1d8 · Exótico +1d12 · Luxária +2d12
```
Paridade verificada: `6,0/3,25 = 1,846` · `d4→d8 = 1,80` · `d6→d12 = 1,857`.
Exceção permitida: rider um degrau acima em troca de `1x/alvo` (Machado da Fúria: +2d8 1x/alvo).

## Régua de condição por raridade (D33)
**Desorientado é piso Ordinário** — é efeito de chassi, não serve como payload Exótico.
Payload Exótico precisa de condição um degrau acima; **Confuso (−1 Ação)** é o substituto canônico.

## D42 — Escada de penetração de armadura
`Incomum ignora 3 · Exótico ignora toda Armadura(Ar) · Luxária ignora Ar e Ae`
Motivo: Ar no Bazar vai de 2 a 6 (mediana 5), então "ignora 5" no Incomum já zerava quase tudo.

## Tetos deliberados (não são bugs)
- **D11 — Martelo de Mundarak** (Pesada Brutal +3, 5d12+3, máx. 126 no crítico): ápice do dano por
  ataque individual. Permissível.
- **D18 — Fragmento Primordial** (Leve Ágil Luxária, DPR 24,75 com exposição 0 permanente): teto
  deliberado. Arma feita do plano divino não paga o imposto de retaliação do plano material.
- **D8 — Cartas do Limiar raras são absurdas de propósito.** A carta rara é o teto *legítimo* ao
  comparar item × carta. O que continua valendo: item comprável e acumulável não deve igualar carta
  travada atrás de requisito alto, porque item não tem o mesmo gate.

---

# 2. Réguas de economia

## Raridade → Sins (a única alavanca de preço, D9)
```
Lixo 1d8+2 (6,5) · Ordinário 2d10+10 (21) · Incomum 4d10+45 (67)
Exótico 5d12+180 (212,5) · Luxária 6d20+620 (683)          razão geométrica ≈ 3,2
```
**D35 — Material vale UMA FAIXA ABAIXO do item da sua raridade.** Preserva a estética de craftar
com material da mesma raridade do produto e ainda dá margem ao craft.
```
material Ordinário → 1d8+2   ·  Incomum → 2d10+10  ·  Exótico → 4d10+45  ·  Luxária → 5d12+180
```

## Sins iniciais por origem — a âncora
Mediana **≈12 Sins**, faixa 2,5 (Escravo) a 29 (Mercador). Um Ordinário custa 21.
→ **As faixas de raridade não são preços de loja para PJ de nível baixo: são valores de loot e de
venda.** Exótico é prêmio de arco narrativo; Luxária é artefato de campanha.

## D6 — Comerciantes
| Campo | Decidido |
|---|---|
| Estoque nv1 / nv2 / nv3 | **250 / 500 / 1000** |
| Reposição | **1 dia fixo** |
| Margem de venda | 50% / 66% / 75% |
**Comerciante que compra ≠ comerciante que vende**, de propósito: "faz os jogadores ponderarem em
quem investir, cria tensão e narrativa". Upgrade de comerciante é **acesso + RP**, não decisão
econômica. São **6 categorias** — investir em várias multiplica o teto de extração diária.

## D10 — 🔑 Itens não cobram Stamina
O custo de um item é o preço de aquisição (Sins/ingredientes), nunca recurso por uso.
A alavanca é **raridade + frequência** (1x/combate, 1x/descanso longo).
Exceção que não é exceção: os efeitos de arma (Dilacerar/Alcançar/Desorientar 2, Executar 3)
custam Stamina porque são regra do **sistema**, não do item.

## D45 — Produção em Massa não gera item vendável
Texto para o Notion: *"Itens criados por Produção em Massa não podem ser vendidos."*
Escolhida entre 4 opções simuladas. Corta 83% da renda (4098 → 683 Sins/descanso longo) sem tirar
nada do uso pretendido da técnica (armar o grupo com 12 itens).
**Por que preço não resolveria:** o valor do item multiplica por **32** do Nv1 ao Nv4 enquanto o
custo em reagentes só multiplica por **4**. Achatar exigiria um item Nv4 custando 64 reagentes
contra um teto de Bolsa de 19. A ladeira é inescapável por preço; só trava dura resolve.
**D40 — o teto foi aceito conscientemente** antes da trava: *"Ainda é alto… Vou apostar na sorte,
pode deixar como está."* ⚠️ **Vetor que continua aberto:** recuperação rápida de Stamina somada a
investir em vários comerciantes. O custo migrou de reagentes para Stamina.

---

# 3. Réguas de crafting

## D36 — São 3 ofícios: Ferraria, Engenharia, Alquimia
Municiador **não existe** (remanescência outdated do Artilheiro).
```
Ofício(Ferraria)    → EQUIPAMENTOS : Arma · Armadura · Escudo
Ofício(Engenharia)  → BUGIGANGAS   : Bugiganga · Munição · Item Mágico
Ofício(Alquimia)    → Consumíveis alquímicos
```
**D51 — Ofício(Alquimia) é exclusivo do Alquimista**, porque reagente só vem da classe.
`Tipo de Craft = Alquimia` no Bazar lê-se "exclusivo de classe". Os 95 itens alquímicos continuam
**compráveis por qualquer um**, só não fabricáveis. O Alquimista **não** é fabricante universal —
não tem proficiência em Ferraria nem Engenharia por padrão.

## D48 — Crafting exige treinamento na perícia
Sem treinamento você não fabrica. Por isso kits que "permitem testes sem treinamento" são
**destravas**, não bônus numéricos.

## D49 — Falha crítica por margem de CD (Ferraria e Engenharia)
> **Falha crítica:** ficar **10 ou mais abaixo** da CD → perde todos os materiais.
> **Falha normal:** não cria o item, **conserva os materiais**, pode tentar de novo.
> **Sucesso crítico:** superar a CD em **10 ou mais** → **recupera 1 dos materiais**.

**D52 — Alquimia é a exceção: perde os reagentes em QUALQUER falha**, porque reagentes voltam de
graça no descanso longo. Material de Ferraria/Engenharia custa Sins e é finito.

**Chance de falha crítica** (Mod.INT +3; CDs Ord 10 · Inc 13 · Exó 17 · Lux 21):
| situação | Ord | Inc | Exó | Lux |
|---|---|---|---|---|
| Leigo + Kit Básico (−2) | 0% | 10% | 30% | 50% |
| Treinado (+2) | 0% | 0% | 10% | 30% |
| Experiente (+4) | 0% | 0% | 0% | 20% |
| Mestre (+6) | 0% | 0% | 0% | 10% |
| **Mestre + kit Luxária (+4)** | 0% | 0% | 0% | **0%** |

**Custo efetivo por item criado** (base 0,77x, repetindo até conseguir):
| situação | Ord | Inc | Exó | Lux |
|---|---|---|---|---|
| Leigo + Kit Básico | 0,73x | 0,94x | 1,69x | 8,47x |
| Treinado (+2) | 0,67x | 0,71x | 0,94x | 1,69x |
| Experiente (+4) | 0,66x | 0,68x | 0,75x | 1,21x |
| Mestre + kit Luxária | 0,59x | 0,63x | 0,66x | 0,71x |

🔑 **A diagonal é de graça, o alcance é que se paga.** No próprio tier ~0,70x; um acima, break-even;
dois acima, aposta ruim. **Material lendário fica protegido:** só quem é Mestre com o kit Luxária
tem 0% de falha crítica no topo. A origem **Ferreiro** ignora falha crítica em Arma/Armadura/Escudo.

## Forma da receita
```
EVOLUTIVO (Arma, Armadura, Escudo)   1x item da raridade anterior + 1x material + 1x temático
NÃO-EVOLUTIVO (Bugiganga, Munição,   3x material
  Consumível)
GENÉRICA → ÚNICA do MESMO tier       1x genérica do tier + 2x material  (razão total 1,63x,
                                      marginal 0,63x — o item base já custa 100% do alvo sozinho,
                                      então a razão total é inevitável e não é bug)
```
**Alvo: ~0,75x.** Puxar 1 material de um tier **abaixo** quando o tema pede é permitido e é o que
leva a razão a ~0,72x. Puxar de tier **acima** quebra o custo e é proibido.
`auditor.py craft` reporta **total** (comprando tudo) e **marginal** (só os materiais, porque o item
base o jogador normalmente lootou). A **marginal** é a que o jogador sente.
`auditor.py craft` também aponta **receitas idênticas** na mesma categoria+raridade — receita
repetida é monótona e exploitável.

## D38 — As 8 famílias de material (fechadas)
| Família | Ordinário | Incomum | Exótico | Luxária |
|---|---|---|---|---|
| **Metal** | Lingote de Ferro | Aço Temperado | Liga Rúnica | Liga Primordial |
| **Madeira** | Madeira Comum | Madeira Nobre | Madeira Mística | Madeira da Vhelor |
| **Couro** | Couro de Caça | Couro Refinado | Couro Bestial | Pele de Dragão |
| **Tecido** | Tecido Resistente | Fibra Sintética | Trama Etérea | Fio do Destino |
| **Mecânica** | Peça Mecânica | Engrenagem | Mecanismo Arcano | Coração Mecânico |
| **Gema** | Gema Bruta | Gema Refinada | Gema Mística | Gema Primordial |
| **Energia** | Fogo | Eletricidade | Éter | Energia Primordial |
| **Mineral** | Cobre | Ferro | **Kali** | Ouro |

As 4 primeiras são **ordinárias** (o que o item É); as 4 últimas **atípicas** (o que o item FAZ).
8 famílias → 36 combinações de 2 materiais, o que cobre o pior caso (35 itens Ordinários de
Consumível). **Fogo, Eletricidade e Éter são abstratos de propósito** — um teurgo com foco gasta
2 de Éter (status) para craftar; quem não gera compra em frasco. Fogueira provê Fogo.

**D44 — removidos:** *Prata* (Kali assumiu o Exótico dos Minerais) e *Lenha Seca* (as escadas de
madeira já cobrem o papel). *Barra de Ferro* virou **Lingote de Ferro** para liberar o nome Ferro.

**Fora das escadas (5):** `Reagente Alquímico` (insumo de classe, escala por quantidade, não por
raridade) + 4 reagentes de quest Luxária: **Lágrima de Velúria** → Lágrimas do Tempo ·
**Pétala do Sonhador** → Elixir da Imortalidade · **Grilhões do Abismo** → Núcleo Abissal ·
**Sangue Primordial** → Soro do Homúnculo.

---

# 4. Réguas por categoria de item

## Arma
**D30 — Ordem canônica dos campos.** Requisito é o **último**.
```
{Chassi} +N. · {dado} {tipo} ({Attr}). · +N em Atacar. · Atacar(X), Arremessar(1). ·
[Alcance X m.] · [Consome 1 munição (...).] · <PAYLOAD ÚNICO> ·
Efeito: {chassi} ({custo}): ... · [1x/turno não custa Stamina.] · Requisito: ...
```
**D4** — toda arma declara seu efeito de chassi no texto; marciais levam "1x/turno não custa Stamina".
**D3** — alcances canônicos: Distância Simples 18 m · Distância Pesada 18 m · Arremesso 9 m.
**D13** — cobertura obrigatória de únicas, hoje em **2 Incomum / 3 Exótico / 1 Luxária** por chassi
(a linha Kali é o 3º Exótico). Marcial Precisa é exceção 2/3/2 (**D26**).
**D15** — o payload único amplifica o efeito do chassi: Dilacerar→hemorragia · Alcançar→negação de
reação · Desorientar→concussão/área · Executar→duelo/multiplicador.
**D14** — gatilho padrão do payload é **Crítico**, não "Ao acertar" (~7× mais frequente).
**D17** — nome descreve **o objeto físico**, o payload descreve o efeito.
**D12** — Focos Primordiais são +3 por natureza (lategame nv5, não existe Primordial +1/+2).
**D28** — *Bacamarte de Cano Curto* e *Facas de Lançamento* **recompensam encurtar a distância**, ao
contrário das outras oito da família. É a arma que contraria a identidade da própria família —
mantido de propósito. Dissidente deliberado não é bug.

**Linha Kali (D27 fechada):** sem rider de dano ("extremamente leve" = não acrescenta massa nem
dado), **+1 margem de ameaça** nas 15, e a frequência do Exposto é **inversamente proporcional ao
nº de ataques do chassi** (3 ataques → só o crítico; 1 ataque → crítico + 1 fonte controlável
1x/combate). Média +0,6% de DPR contra o Exótico padrão, faixa −6% a +4%.

## Munição
**D2 — Munição é gasta por CENA de combate**, não por disparo. O "20 munições = 1 slot" do
CLAUDE.md está errado.
**D41 — 🔴 Munição é PASSIVA e custa ZERO ações.** O jogador escolhe o tipo no início do combate e
todos os ataques carregam o efeito até o fim. **Nunca** pode custar ação nem conceder ataque extra.
Ao precificar, o rider incide em **todos os acertos do combate**:
**1 ação → 6,0 acertos-equivalentes · 2 ações → 3,25** (teto, com combate de no máximo 5 turnos, D46).
Cobertura fechada em **12 por tipo de arma**: 1 Ordinário / 5 Incomum / 4 Exótico / 2 Luxária.

## Bugiganga — duas famílias separadas por regra
**D54 — Bugiganga passiva:** `+N <Perícia> enquanto no inventário`, com **Incomum +1 · Exótico +2 ·
Luxária +4**. Bugiganga não é equipável, então o buff é pequeno e permanente.
**D55 — Kit:** `+4 em testes de <Perícia> por 1 cena. 3 usos.`
→ **Passiva dá pouco para sempre; kit dá muito e acaba.**

**D56 — Bolsas e mochilas:** efeito é exclusivo por item. Itens diferentes empilham; cópias do
mesmo item não. Cláusula: `O efeito não acumula com outra cópia deste mesmo item.`

**D53 — Fonte de luz precisa de loop de combustível.** Não ter combustível **custa uma raridade**.
O loop real fica no Incomum (Lanterna de Óleo consome Óleo Comum).

**D59 — Item de efeito contínuo não é Bugiganga.** Se exige estar vestido/calçado na hora, vai para
**Item Mágico** (passivo enquanto sintonizado). Equipamento sempre dá Ar ou Ae, então não serve.
Se é destruído no uso, é **Consumível** — essa é a definição. Bugiganga com limite de usos não é
destruída: quebra e pode ser consertada.

**D5 — Cláusula "empilhável"** (`pesa 1 bugiganga a cada 10 unidades`) vale para itens muito leves:
munições e lixo.

## Escadas de Ofício (paralelas, nenhuma cobra sintonia — D50)
| Raridade | Engenharia | Ferraria |
|---|---|---|
| Ordinário | **Kit de Ferramentas Básico** — sem treino com −2, 3 usos (atende as duas) | idem |
| Incomum | Ferramentas de Artesão — sem treino + **+1** | Bigorna Portátil — sem treino + **+1** |
| Exótico | Luvas do Artesão — **+2** | Bigorna Rúnica — **+2** |
| Luxária | Kit de Mestre-Artífice — **+4** + cópia extra no d20 = 20 | Forja de Bolso — **+4** + idem |

## Consumível / Alquimia
**D39 — O nível do item alquímico define a raridade no Bazar:**
`Nv1→Ordinário · Nv2→Incomum · Nv3→Exótico · Nv4→Luxária · Nv5→Luxária (travado por quest)`.
Resolve os "5 níveis para 4 raridades": o Nv5 não é uma quinta raridade.
**Banda de reagente por nível:** Nv1 1–3 · Nv2 2–4 · Nv3 4–6 · Nv4 8–12 · Nv5 15–20.
A contagem de reagentes no Bazar **vem da tabela do Notion**, não é derivada de raridade.
`references/alquimista-notion.json` guarda nível, reagentes e CD dos 95 itens.
**Escada de cura do Autômato:** a raça não se cura por meios tradicionais, então os Kits de
Manutenção correm **~30% acima** da Poção de Cura em cada raridade (7 / 14 / 22,5 / 36).

---

# 5. Cânone do sistema e terminologia

**D19 — Vitalidade/Vigor/Ressonância são COEFICIENTES, não status.** Os 3 status reais são
**Saúde, Stamina e Éter**. "6 Vitalidade" = o coeficiente 6 em `Saúde = 10 + (6×Nv) + (Mod.CON×Nv)`.

**D20 — Evasão passiva é `10 + Mod.DES` em TODAS as classes.** O repo lista valores por classe e
está desatualizado. ⚠️ Corrigir as 7 páginas numa passada de sync.

**D57 — A CD é sempre a do portador, sem exceção.** Escrever `contra sua CD`. Revoga a ressalva
de "pequenas exceções de CD fixo" que constava do D34.

**D58 — Alcance infinito não existe.** Todo efeito de detecção/comunicação declara um teto.

**D16 — Toda condição aplicada por item declara quando expira.** Padrão: `até o fim da próxima
rodada`. Ainda **sem regra de expiração no cânone**: `Lento X` · `Cego` · `Surdo` · `Enraizado` ·
`Amedrontado` · `Bêbado` · `Paralisado` · `Inconsciente` · `Oco` · `Desnutrido X` ·
`Sobrepeso Leve/Extremo`.
✅ Resolvidas: **D32 Desorientado dura 1 turno** · **Confuso** ganhou "gaste 1 ação para se livrar"
(o que lhe dá regra própria de saída — item não precisa mais declarar expiração para ela) ·
**Desprevenido** vem de Furtividade.

**D22 — "margem de ameaça"** é oficial: `+N margem de ameaça` = aumentar a margem do crítico em N.
**D31 — "Multiplicador de Crítico"** é oficial: crítico padrão dobra os dados, +1 multiplicador
triplica. ⚠️ Ambos **pendentes de registro no Notion**.

**D21 — A primeira técnica de nível 1 do ramo concede os treinamentos** (categoria de arma e perícia
de ramo entram como técnica, não como linha da classe base).

**D7 — Origem Caçador** (versão atual do Notion, substitui a que eu tinha registrada): caça em
descanso longo com teste de Sobrevivência em escada —
`10+ → 1 Couro de Caça + 1 Comida · 15+ → 2 Couros · 20+ → 1 Couro Refinado + 2 Comidas ·
25+ → 2 Couros Refinados · 30+ → 1 Couro Bestial + 3 Comidas`. Custa a **ação de descanso** e entra
na cadeia de crafting em vez de virar Sins direto.

**Origem pode destravar categoria de arma e conjuração.** Acólito → Marciais · Andarilho →
À Distância · Anão → as duas · Cultista → 2 magias de nível 1. Não assumir que só a classe abre
esses portões.

---

# 6. Classes em desenho

**D24 — Vampiro.** Status 6 Saúde / 5 Stamina / 4 Éter (=15) · CD 10 + Mod.FOR|DES + Mod.INT.
**Corrente Sanguínea:** Sangue = Saúde temporária acima do máximo, teto `5 + (3×Nível)`; sem Sangue
paga com Saúde real sem perda de conversão; pode converter Sangue em Saúde como 1 ação.
**Sede de Sangue:** 1×/turno, ao acertar criatura viva sob Sangramento absorve `1d6 + Mod.CON`;
ao reduzir criatura viva a 0 de Saúde absorve `Nível + Mod.CON`.
**Ramos:** A Sombra · O Carmesim · O Hemomante.

**Necromante e Xamã** — desenhados em conversa, ainda não consolidados aqui.
⚠️ **Xamã pendente:** nome do recurso primário (recomendei **Lapso**) e as 4 técnicas de nível 1.

---

# 7. Lotes concluídos

| # | Lote | Resultado |
|---|---|---|
| 1 | Armas genéricas | 15 chassis conformes ao Notion, 53 reescritas |
| 2 | Focos místicos | 30 normalizados; Primordiais exigem Experiente |
| 3–6 | Armas únicas | Leves, Pesadas, Marciais e À Distância — 15 chassis fechados |
| 7 | **Kali** | 15 armas Exóticas + o material Kali; **91 armas únicas** |
| 8 | **Alquimia** | Bazar tinha uma 2ª cópia mais barata da tabela do Alquimista: 70 itens em comum, 45 com reagente divergente. 70 sincronizados, 25 criados. **Cobertura 95/95** |
| 9 | **Munição** | 16 reescritas + 13 criadas → **12 por tipo de arma, 36 no total** |
| 10 | Bugiganga Ordinário | 24 receitas temáticas; razão do tier 0,44 → 0,77 |
| 11 | Ofício / Kits | 2 escadas paralelas + escada de cura do Autômato |
| 12 | Bugiganga Incomum | 22 revisadas, família de luz e famílias passiva/kit separadas |

Detalhe item a item dos novos: `references/10-novidades-bazar.md` (gerado por `auditor.py novidades`).

---

# 8. Pendências abertas

**Sistema (Notion, do Pedro)**
- Registrar **"margem de ameaça"** (D22) e **"Multiplicador de Crítico"** (D31).
- Regra de expiração para as 11 condições listadas em D16.
- Corrigir Evasão passiva nas 7 páginas de classe do repo (D20).

**Bazar (meu, quando chegar a vez)**
- **Família dos alcoólicos** (condição *Bêbado*) — várias classes dependem. Na passada de Consumível.
- **Item Mágico: 61 itens, 0 receitas** e nenhuma progressão. É a única categoria de Bugigangas que
  pede evolução (3 slots equipáveis → o jogador prioriza raridade alta) e não foi criada pensando
  nisso. Não é Ferraria nem Engenharia nem Alquimia — **talvez perícia Místico, mas não agora** (D37).
- **Bugiganga é pesada embaixo** (24 Ordinários contra 9 Luxárias); Consumível é plana (53/53/50/57).
- **7 bugigangas Exóticas compartilham `1x Mecanismo Arcano`** — próximo lote.
- Armas genéricas Ordinárias compartilham `2x Lingote de Ferro` / `2x Madeira Comum`.
- **Carta do Limiar rara** para o Alquimista que domina Ferraria e Engenharia (ideia do Pedro).
- Colisão de nome a vigiar: **Ferro** (Mineral Incomum) × **Lingote de Ferro** (Metal Ordinário).

**Desempates que eu preciso**
- **Decepador de Kali** — resolvido: "ao reduzir uma criatura a 0 de Saúde".
- **3 itens do Notion fora da banda de reagente do próprio nível** (D39): já corrigidos —
  Sangue Falso → Nv1, Extrato de Clarividência e Amnésia Líquida → 8 reagentes.
- **Munição Fragmentadora** — resolvido: ganhou rider +1d12 Cortante.
