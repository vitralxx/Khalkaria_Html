# Khalkaria — Briefing de Lore para o Agente Criativo

> **Documento de repasse entre agentes. Leia a seção 1 antes de qualquer outra coisa.**

---

## 1. Quem escreveu isto, e por que você deve desconfiar

Eu sou o **agente de balanceamento do Khalkaria** — a skill `khalkaria-balance`, rodando em Claude
Code dentro do repositório `vitralxx/Khalkaria_Html`. Meu trabalho com o Pedro foi **matemática de
sistema**: recalibrar as 140 armas do Bazar contra a tabela canônica, fixar escadas de dano por
raridade, auditar economia de ação e retaliação, e ajudar a desenhar classes novas (Vigário,
Vampiro, Necromante, Xamã).

**Eu não fui contratado para lore.** Este documento é um subproduto: ao ler a camada mecânica a
fundo, esbarrei em nomes próprios e fragmentos narrativos. O Pedro achou útil o suficiente para
pedir que eu passasse adiante. Trate como **pistas para verificar**, nunca como cânone.

### 🔴 Os dois problemas de procedência que você precisa saber

**1. O repositório está desatualizado e não é fonte.**
`vitralxx/Khalkaria_Html` é o repo do **site HTML**. Existe um agente que copia o Notion para lá,
mas ele **dessincroniza depois de cada patch**. O Pedro foi explícito: *"não vamos usar o repo."*
Já peguei divergências reais entre repo e Notion nesta sessão.

**2. Partes do Bazar foram escritas por IAs e podem estar alucinadas.**
Isto é o mais grave para você: **a maior parte da lore abaixo saiu da coluna `Lore/Notas` do
Bazar** (`Bazar_Khalkaria_v26.csv`), que é exatamente onde mora esse conteúdo suspeito.
O Pedro disse que eu "acertei bem a lore" — mas isso é uma impressão dele lendo meu resumo, **não
uma verificação item a item contra o Notion**.

### Tabela de confiança por fonte

| Fonte | Confiança | Observação |
|---|---|---|
| **Notion** (página *Sistema Khalkaria*, buscada direto) | 🟢 **Alta** | Fonte da verdade declarada. Ainda assim contradiz a si mesma às vezes — o Pedro pede que se sinalize, nunca que se escolha em silêncio. |
| **Texto de magias** (`data/magias.json`) | 🟡 Média | Foi sincronizado do Notion, mas o repo dessincroniza. A prosa das magias de nível 4 é claramente autoral do Pedro — é a lore mais confiável fora do Notion. |
| **Coluna `Lore/Notas` do Bazar** | 🔴 **Baixa** | **Onde mora o conteúdo alucinado por IA.** É também de onde veio quase tudo sobre a Vhelor e Revavena. |
| **Páginas de classe/raça do repo** | 🔴 Baixa | Comprovadamente desatualizadas. |
| **Minha interpretação** | ⚪ Nenhuma | Marquei com *(leitura minha)* onde eu inferi em vez de ler. |

**Regra prática: pergunte ao Pedro antes de construir qualquer coisa em cima disto.** Ele preferiu
explicitamente pergunta a suposição.

---

## 2. O panteão

Cinco deuses nomeados. **A prosa das magias de nível 4 é a fonte mais forte aqui** — é texto
autoral, com voz, não descrição de item.

| Deus | Domínio | Evidência (com fonte) |
|---|---|---|
| **Kha** | Primordial, criador | 🟡 *Armadura de Kha*: "tecida com o mesmo primórdio que formou a realidade". *Dádiva de Kha*: "uma **súplica profana** ao deus primordial Kha… sua alma toca a mente de Kha". |
| **Vytália** | Vida | 🟡 *Vytália* (magia): **"Você não cura, você implora. O nome de Vytália é pronunciado não como uma oração, mas como uma dívida assumida em voz alta."** *Tecido de Vytália*: "guarda cada vida que passou por suas mãos como uma deusa cuida de seu **rebanho**… Acessar esse arquivo é uma intrusão. Você não foi convidado. **E ela sempre sabe.**" |
| **Malkhor** | **O Pecado** | 🟡 *Olhos de Malkhor*: "um mísero fragmento do poder de Malkhor, **o deus do Pecado**. Toda entidade possui uma fraqueza e seus olhos a revelam." |
| **Velúria** | Magia | 🔴 Só em item: *Véu de Velúria* e *Lágrima de Velúria* ("cristalizada **no Limiar**"). Aparece também na carta *Olhos de Velúria* do Limiar. **Sem página de lore própria.** |
| **Karmath** | Inquisição / luz | 🔴 Só em item. *Bastão de Karmath* causa Radiante extra **contra Teurgos, Corrompidos e Mortos-Vivos**; o *Elixir da Expurgão* é feito por "**clérigos de Karmath em Revavena**". |

⚠️ **Tensão de design que vale investigar:** se Karmath é uma fé que caça conjuradores, isso colide
frontalmente com **Teurgo** ser classe jogável e **Corrompido** ser raça jogável. Ou é conflito
deliberado (ótimo material), ou é alucinação de IA. **Pergunte.**

---

## 3. A Vhelor — a Grande Árvore

🔴 **Fonte fraca (coluna `Lore/Notas` do Bazar), mas é o eixo narrativo mais desenvolvido que
encontrei.** Se for real, é um arco de campanha inteiro. Se for alucinação, é uma alucinação boa
o suficiente para valer a pena aproveitar — mas isso é decisão do Pedro.

O que os itens descrevem: um **track de corrupção chamado *Marca da Vhelor***, ligado a um
subsistema referido como *"Substâncias da Grande Árvore"*.

- **Casca de Raiz** (Ordinário) — sacia como refeição. "Ao dormir após consumir, sonha fragmentos
  do **Sonhador**. Uso repetido cria **vínculo onírico permanente**."
- **Seiva da Vhelor** (Incomum) — cura e remove condições. "Uso repetido causa **dependência e
  corrupção progressiva**."
- **Talismã da Seiva** (Exótico) — **exige Marca da Vhelor 2 ou mais** para funcionar.
  *A corrupção destrava equipamento.*
- **Elixir da Expurgão** (Exótico) — remove 1 Marca. Feito por clérigos de Karmath em Revavena.
  **"Não funciona acima da Marca 4."** *Existe um ponto de não-retorno.*
- **Folha Amarela** (Luxária) — **+1 ponto de atributo permanente**, +1 Marca, e
  **"cada folha consumida nutre a Vhelor, fortalecendo-a."**
- **Cristal da Grande Árvore** (Luxária) — "cristalização de seiva pura da Vhelor."
- **Praga-Vhelor** — munição banhada nela "por cultistas **revavenos**".

→ A forma narrativa: **uma entidade-árvore que compra pedaços de você com poder real, uma igreja
que vende a cura, e uma linha que não se atravessa duas vezes.**

**Perguntas obrigatórias ao Pedro:** Quem é **o Sonhador**? A Vhelor é deusa, lugar, ou outra
coisa? Karmath e a Vhelor são inimigos declarados? **Nada disto está confirmado.**

---

## 4. Geografia, planos e idiomas

**Continente:** Kharavel. 🟢 Confirmado no Notion (o jogo de apostas *Khan Sins* é "popular entre os
locais e povos antigos de Kharavel").

**Nomes próprios em circulação** 🔴 *(todos vindos de nomes de item — podem ser só sabor)*:
Revavena · Volkrest / Volkrestiana · Mundarak · Osh'Kar · Hyven · Casca-Seiva

**Planos mencionados:** Material · Místico (o ultimate do Espadachim arranca dois duelistas para
lá) · Plano dos Mortos (base do Necromante) · **O Primórdio** — 🟢 *o Pedro confirmou diretamente:
"o plano onde os deuses vivem"* · O Abismo · O Limiar · **o Oblívio** (o *Selo do Oblívio* condena
uma alma: sem ressurreição possível, aprisionada num recipiente).

**Idiomas** 🟢 *(Notion, alta confiança)* — e cada um carrega política:
**Comum** · **Skalia** (dos répteis, "protegido pela raça") · **Khazadun** ("**impossível de falar
sem cordas vocais anãs**") · **Natural** (animais, bestas e Dryads) · **Abissal** ("idioma raro
entendido por poucos, geralmente **teurgos pesquisadores**") · **Esquecido** (criaturas antigas,
extinto).

---

## 5. O tom que as regras codificam

🟢 **Esta é a seção de maior confiança do documento** — vem inteira da página *Sistema Khalkaria*
do Notion, buscada direto. Tom provado por regra, não declarado por prosa.

**Fé e sanidade são o mesmo recurso.** Éter paga magia **e** mede a mente. Ver um aliado morrer
exige Vontade CD 20 ou custa `2d6+3` de Éter. Na condição **Oco** (0 de Éter), cada perícia falha
tira mais 5 — e a −50% do máximo **você perde o personagem para o mestre**.
→ *Enlouquecer é pior que morrer, e é mecânico.*

**Toda violência é recíproca.** A regra de **Retaliação**: cada ataque abre brecha para o alvo
revidar — inclusive os ataques que erram. Não existe golpe grátis.

**A fome mata devagar.** Cada noite sem comer aplica *Desnutrido*, e cada acúmulo tira
**10 de Saúde máxima**. Chegou a zero, morreu.

**Atrito social é mecânico.** Atacar um aliado, mesmo errando, dá +1 de **Estresse** aos dois. Cada
ponto liberado num descanso custa 1d6 de Stamina e Éter.

**Os personagens começam pobres.** Mediana de Sins inicial: **12**. Um item Ordinário custa **21**.
→ *Ninguém compra nada no começo. A economia é movida a saque.*

**O mundo produz deslocados.** Entre as 17 origens: **Escravo** (1d4 Sins — a mais pobre),
**Amaldiçoado** ("você não lembra de nada, mas sabe que precisa ir até um certo local"),
**Refugiado**, **Exilado**.

**Houve uma civilização tecnológica antes.** Autômatos são "seres antigos de **tecnologia
esquecida**", com uma **Biblioteca Autômata** pública e um módulo **Backup** que importa memórias
para um corpo novo. → *Existe imortalidade por cópia, e ela é tecnológica, não divina.*

**Preconceito é regra, não sabor.** Insetos sofrem **−2 em interação social com todas as raças
exceto insetos**. Grutos têm vantagem contra Dryads e "criaturas predáveis". Corrompidos sofrem −2
social com humanoides que desconfiem deles.

---

## 6. Como trabalhar (o que aprendi convivendo com o Pedro)

- **Pergunte em vez de assumir.** Ele disse isso literalmente e cobra na prática.
- **Nunca escolha em silêncio quando as fontes divergirem.** Sinalize e espere.
- **Ele corrige em lista numerada**, e correção apontada num ponto **vale para todos** os casos
  parecidos, não só naquele.
- **Ele responde muito bem a números.** Toda vez que eu trouxe uma conta em vez de uma opinião, a
  conversa andou. "Isso parece forte" não convence; "isso é 88% do pool de Éter no nível 1" convence.
- **A nomenclatura é dele.** Ele renomeia quase tudo que eu proponho — e melhora. Traga o
  *efeito* pronto e o *nome* como rascunho.

---

## 7. Erros que eu cometi nesta sessão

Incluo isto porque são **exatamente os erros que você vai cometer** se confiar nas mesmas fontes:

1. **Confiei nas páginas de classe do repo para a Evasão** e reportei bases diferentes por classe
   (10/12/10/10/15/12/11). O Pedro corrigiu: **é 10 + Mod.DES em todas**. O repo estava velho.
   → *Sintoma clássico: o repo parece autoritativo porque é estruturado. Não é.*
2. **Tratei "Vitalidade / Vigor / Ressonância" como se fossem os status.** São **coeficientes** das
   fórmulas de classe. Os status reais são **Saúde, Stamina e Éter**.
3. **Errei minha própria fórmula de DPR** — omiti o termo de crítico. Só peguei porque comparei com
   a fórmula que o Pedro tinha escrito.
4. **Numa edição em massa, inseri "Consome 1 munição por cena" numa arma cujo texto já dizia "Não
   consome munição"**, criando uma contradição dentro do mesmo item.
   → *Operação em lote sem checar o caso especial. Vai acontecer com você em texto narrativo também.*
5. **Meu primeiro script de auditoria confundiu nível de arma com divergência** — as armas `+1/+2/+3`
   somam dados por regra, e eu marquei todas como erro.

O padrão comum: **eu confiei em algo estruturado (repo, script, minha própria memória) em vez de
verificar contra o Notion ou contra o Pedro.** Não repita.

---

## 8. Perguntas para abrir a conversa com o Pedro

1. Quem é **o Sonhador**?
2. A **Vhelor** é canônica ou foi alucinada por IA no Bazar? Se canônica: deusa, lugar ou entidade?
3. **Karmath** persegue conjuradores? Como isso convive com Teurgo e Corrompido jogáveis?
4. **Velúria** e **Karmath** têm lore consolidada em algum lugar, ou existem só em nome de item?
5. O que é **o Limiar** narrativamente? Mecanicamente são 170 cartas de progressão, incluindo
   **Dores e Benefícios do Abismo** — crescer em poder parece ser atravessar uma fronteira e pagar
   por isso, *(leitura minha, não confirmada)*.
6. **Revavena**, **Volkrest**, **Mundarak**, **Osh'Kar**, **Hyven** são lugares reais do mapa ou
   sabor de item?
7. Qual é o **documento da sessão do escravo** que ele mencionou? É a peça narrativa mais concreta
   que ele citou e eu nunca vi.
