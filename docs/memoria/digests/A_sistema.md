# Digest A — Sistema Khalkaria (raiz), Criação de Personagem, Magias, Condições

Fontes (raw em `$SCRATCH/raw/`): `sistema_root.md` (raiz 2b76e3a4…, fetch 2026-08-27, status 🟡), `criacao_de_personagem.md` (3a66…b11, status 🟡 — só link p/ Template), `template_ficha_de_personagem.md` (4e66…f2c2, status 🟢), `magias.md` (3a66…9fcb, fetch 2026-07-23, status 🟢, 86 KB), `condicoes.md` (3a66…0b25, editado 2026-08-24, status 🟢).

---
## 1. RESUMO ESTRUTURADO (regras verbatim)

### 1.1 Atributos Iniciais (raiz)
- Força / Destreza / Constituição / Inteligência / Sabedoria — todos **8-18**.
- "1. Role 4d6, retire o pior, some e anote o valor. Faça isso 5 vezes, e distribua os valores dentre seus atributos. Você pode retirar 1 ponto de um atributo e adicionar a outro. 2. Escolha sua raça, classe e origem, nesta ordem."
- **Fórmula do modificador NÃO aparece na raiz** (nem em nenhuma das páginas lidas).

### 1.2 Status (raiz)
"Sua classe determina os valores dentre estes 3 status universais":
- Saúde — "Ao reduzir a 0 ou menos, você recebe a condição *Morrendo*."
- Stamina — "Pericias e habilidades utilizam Stamina. Ao reduzir a 0, fica *Exaurido*."
- Éter — "Energia primordial que todo ser tem. Define sua sanidade e energia espiritual. Ao reduzir a 0 ou menos fica *Oco*."

### 1.3 Perícias (raiz)
- "quase todas as rolagens utilizam o d20." Crítico: 20 natural. Falha Crítica: 1 natural.
- Proficiência: **+0 Leigo → +2 Treinado → +4 Experiente → +6 Mestre → +8 Lendário**. "Proficiência é ganha progressivamente por sua classe, raça, cartas do Limiar ou Npcs." "Você nunca recebera uma habilidade que diga 'Experiente em Atacar'. Mas ao possuir duas habilidades que te fornecem 'Treinado em Atacar' você se torna experiente nesta."
- Tabela (22): Atacar 1d20+Força ou Destreza · Defender* 1d6/1d8/1d10/1d12/2d8 · Movimento 1d20+(Força ou Destreza) · Fortitude CON · Vontade SAB · Reflexos DES · Percepção SAB · Sobrevivência SAB · Furtividade DES · Crime DES · Iniciativa DES · Conhecimento INT · Medicina INT · Investigação INT · Religião SAB · Místico INT · Convencimento (Destreza ou Inteligência) · Intimidação (Constituição ou Força) · Intuição SAB · Enganação (Destreza ou Inteligência) · Motivar SAB · Ofício(X) 1d20+X ("Você não pode usar esse teste sem tê-lo treinado").
- **Defender**: "treinamentos aumentam o dado da perícia em vez de adicionarem modificadores": Leigo 1d6 · Treinado 1d8 · Experiente 1d10 · Mestre 1d12 · Lendário 2d8.

### 1.4 Progressão do Jogador (raiz)
5 eixos: Classe, Raça, Origem, O Limiar, O Bazar.
| Nv | Benefícios |
|1| 4 Técnicas de Classe, Características de Raça e 1 Habilidade de Origem |
|2| 5 Técnicas de Classe, Técnicas Tier 1 de Classe, +4 Pontos do Limiar |
|3| 6 Técnicas de Classe, 1 Marca de Classe, +4 Pontos do Limiar |
|4| 7 Técnicas de Classe, Técnicas Tier 2 de Classe, 2 Marcas de Classe, +4 Pontos do Limiar |
|5| 8 Técnicas de Classe, Técnicas Tier 3 de Classe, 3 Marcas de Classe, +4 Pontos do Limiar |

### 1.5 Xp e Dc (raiz)
"A dificuldade da criatura(Dc) define o xp ganho ao mata-la." Dc→XP: 1/4→2 · 1/2→5 · 1→10 · 2→25 · 3→50 · 4→100 · 5→200. Nível→XP necessário: 1 — · 2 150 · 3 400 · 4 1000 · 5 2000.

### 1.6 Combate (raiz)
- Iniciativa ordena. "Você possui 3 ações e uma reação por turno": Mover (1 ação)(Max. 1 vez por turno) · Pular (2 Ações) → 1/3 do Movimento · Acelerar (1 ação) → +3 m · Atacar (depende da arma), "ataques consecutivos somam −5 a cada ataque no mesmo turno" · Defender (1 ação) → +2 Defender até próximo turno · Defender fora do turno (Reação) → soma dado de Defender à evasão contra todos ataques do agressor nesta rodada · Conjurar magia (1-3 ações) · Técnica (1–3) · Outro (1-3).
- **Atacando / Retaliação**: alvo com reação escolhe Atacar (retaliar: "Caso o alvo ultrapasse seu valor, ele te ataca com a arma que estiver empunhando, também recebendo seu dano"; crítico dele nega seu dano e retalia; falha crítica dele → seu ataque é crítico; "Você não pode retaliar à distância") ou Defender (soma rolagem de Defender à evasão; atacante abaixo da evasão → esquiva). "a criatura pode escolher reagir (Atacar ou Defender) a cada um deles. Ao final do seu turno, ela considera a reação gasta". "Em caso de empate, o atacante sempre ganha."
- Ataque de oportunidade: afastar-se de criatura a 1,5 m → ela pode gastar reação.

### 1.7 Dano, Ataque e Defesa (raiz)
- Dano ao Atacar = Dano da arma + Mod. Atributo da arma. Crítico = dobro de dados + Mod. Margem de Ameaça padrão = 20. Multiplicador de Crítico padrão = dobro.
- Corpo a Corpo Pesado: atacar c/ Mod. FOR, dano +FOR · Leve: DES/DES · À Distância: DES/DES · Armas Místicas: perícia místico, dano +Mod. INT/SAB.
- Evasão "Determinada pela sua classe". Passiva: evasão > rolagem de ataque → desvia. Ativa: reação → soma dado de Defender.
- Armadura(Ar) reduz dano ordinário em constante fixa. Armadura Específica Ae(Tipo, Quant.) reduz dano atípico; "Ex.: Ae(Místico, 2), ao receber 10 de dano místico, recebe apenas 8."
- Resistência = metade; Vulnerabilidade = dobro.
- Armadura Pesada: 1 equipada. Armadura Leve: até 2.
- **Tipos de Dano**: Ordinário = Cortante, Contundente, Perfurante · Atípico = Elemental (Fogo ; Frio ; Gelo), Biológico (Veneno ; Ácido ; Psíquico), Místico (Radiante ; Trovejante ; Necrótico) · Outros = Força, Primordial.

### 1.8 Manobras (raiz)
Empurrar: Movimento×Fortitude, empurra 3 m + 1,5 m por 5 pontos sobrepujantes, alvo fica caído. Desarmar: Movimento×Movimento. Agarrar: Movimento×Movimento; "Atacar contra o alvo possui +2 e o alvo recebe -2 ao Atacar e o alvo fica *enraizado*".

### 1.9 Tamanho (raiz)
Miúdo→Pequeno→Médio→Grande→Gigantesco (SM/P/M/G/GG). Matriz: cada degrau de diferença = ±2 (Miúdo vs GG = −8). Soco: Miúdo Mod.FOR · Pequeno 1d3 · Médio 1d4 · Grande 1d6 · Gigantesco 1d8 (+Mod. Força).

### 1.10 Armas (raiz)
"altamente interpretativas". 6 características: Dado Base, Atributo, Tipo de dano, Efeito, Ações, Requisito ("Utilizar uma arma sem os requisitos apropriados, nega seu efeito e provê desvantagem ao atacar").
- **Leves** (Destreza ≥ 12): Leve Cortante 1d6 DES Cortante Dilacerar Atacar(1),Arremessar(1) · Leve Perfurante 1d6 Alcançar · Leve Contundente 1d6 Desorientar · Leve Ágil 1d8 DES C/P/C Executar Atacar(1) req DES ≥ 14.
- **Pesadas** (Força ≥ 12): Pesada Cortante 1d12 FOR Dilacerar Atacar(2) · Pesada Perfurante 1d12 Alcançar · Pesada Contundente 1d12 Desorientar · Pesada Brutal 2d12 FOR Executar Atacar(3) req FOR ≥ 14.
- **Marciais** (Treinado em Armas Marciais): Marcial Pesada 2d10 FOR Contundente "Desorientar, 1x/Turno não custa Stamina" Atacar(2) · Marcial Longa 2d10 FOR Perfurante Alcançar Atacar(2) · Marcial Precisa 1d8 DES Cortante Executar Atacar(1) · Marcial Versátil 1d8 DES C/P/C Dilacerar Atacar(1).
- **À Distância** (Treinamento À Distância): Distância Simples 1d6 DES Perfurante Dilacerar Atacar(1) · Distância Pesada 1d12 DES Perfurante Executar Atacar(2) · Arremesso 1d8 DES Perfurante Dilacerar Atacar(1) req DES ≥ 14.
- **Místicas** (Inteligência ≥ 12): Foco de Abjuração / Destruição / Conhecimento / Alteração ("Ao ser empunhado, permite castar magias de X") · Foco Primordial: "permite castar magias Primordiais", req "*Experiente*> em Místico".
- **Efeitos** (Stamina): Dilacerar 2 → próximo ataque aplica Sangramento 1 · Alcançar 2 → +1,5 m alcance e não pode ser retaliado · Desorientar 2 → aplica Desorientado · Executar 3 → +1 dado de dano.
- **Nível de Armas**: +1/+2/+3 → +N dados de dano e +N ao atacar. Focos +1/+2/+3 → +N místico e +5/+10/+15 éter máximo. "Você só pode se beneficiar das melhorias de 1 arma equipada."
- **Munição**: "Armas à distância requerem 1 munição para serem usadas pelo combate inteiro. A munição é descontada por combate." Simples → Flecha e Virote · Pesada → Munição de Fogo · Arremesso → Conjunto de Arremesso.

### 1.11 Inventário e Peso (raiz)
- "Você pode carregar um total de 2+Mod. Força(Min. 1) Equipamentos, itens equipados não contam."
- "Você pode carregar um total de 10+Mod. Força(Min. 1) Bugigangas, munições(Flechas e etc) contam como 1 bugiganga."
- "Itens leves contam como 1 bugiganga a cada 10 unidades." "Moedas(Sins) não pesam." "Mochilas podem aumentar seu limite de peso."
- Sobrepeso: acima do máximo porém menos que o dobro → *Sobrepeso Leve*; igual ou mais que o dobro → *Sobrepeso Extremo*.

### 1.12 O Bazar (raiz — seção É escopo)
9 categorias: Arma, Armadura (1 pesada / 2 leves), Escudo (off-hand, aumenta Defender na reação), Consumível (Ofício Engenharia/Alquimia), Munição ("gastos a cada cena de combate"; munição especial concede efeito o combate inteiro), Bugiganga, Item Mágico ("equipar e se beneficiar de até 3 itens mágicos, alteráveis a cada descanso longo. Itens mágicos não podem ser fabricados"), Material ("Sucatear qualquer item fabricável, concede metade dos seus ingredientes"), Lixo.
| Raridade | Sins | CD Fabricação | Nvl |
| Lixo | 1d8+2 | — | — |
| Ordinário | 2d10+10 | 10 | 1 |
| Incomum | 4d10+45 | 13 | 2 |
| Exótico | 5d12+180 | 16 | 3 |
| Luxária | 6d20+620 | 20 | 4 |
Crafting: "ao menos 1 nível de treinamento nas perícias: Ofício(Ferraria) ou Ofício(Engenharia) … ao fazer um descanso longo, pode optar por tentar construir UM Item do Bazar que seja igual ou inferior ao seu nível em relação a Raridade … Caso suceda, o jogador constrói o item e descarta os ingredientes, caso contrário, perde os ingredientes." Nível 1 Ordinário · 2 Incomum · 3 Exótico · 4 Luxaria.

### 1.13 Equipamentos / Dinheiro / Comerciantes (raiz)
- Equipamentos Pesados: 1 item. Leves: máx 2.
- Dinheiro: "a moeda mais comum são os ***Sins***." Tabela venda = mesma tabela de raridade (Lixo 1d8+2 … Luxaria 6d20+620; Luxaria "muitas vezes criado por um deus ou utilizado por uma lenda viva").
- Comerciantes: Sucateiro (nenhum, compra/recicla tudo, Comum) · Fornecedor (Materiais, Comum) · Artesão (Bugigangas, Comum) · Ferreiro (Equipamentos, Médio) · Boticário (Consumíveis, Médio) · Artificer (Itens Mágicos, Raro). Nível 1: 250 Sins, reposição diária, venda 50%, subir 125 Sins · Nv 2: 500 / 66% / 250 · Nv 3: 1000 / 75% / —. "Um comerciante sem Sins, não pode comprar itens dos jogadores."

### 1.14 Descanso (raiz)
- Até 2 curtos + 1 longo por dia.
- **Longo (Max. 1/dia)**: ≥ 8 h, "recupera Xd8 de 2 Status a escolha de cada jogador, sendo X o nível de comodidade" (1 Precário · 2 Ruim · 3 Normal · 4 Bom · 5 Luxuoso). "É necessário uma fonte de luz e alimento para cada Jogador. Quem não se alimenta, não se recupera." Perigo: emboscada → combate *desprevenidos*; vigia remove penalidade. Ao ar livre: maior Sobrevivência do grupo: <15 Precário · 15-19 Ruim · 20-24 Normal · 25-29 Bom · 30≥ Luxuoso.
- **Curto (Max. 2/dia)**: ≥ 30 min, recupera 2d6 de 2 Status. Ações: Tratar Ferimentos (Medicina CD 15) +1d6 Saúde · Meditar (Vontade CD 15) +1d6 Éter · Relaxar +1d6 Stamina · Comer Refeição (item Comida) +2d6 de qualquer status.

### 1.15 Necessidades / Fé e Sanidade / Estresse (raiz)
- Comer e beber 1×/dia senão *Desnutridos 1*; "A cada noite sem comer, a desnutrição aumenta em 1 reduzindo sua saúde máxima em 10. Ao chegar a 0 você morre." Passar o dia sem descansar pela 2ª vez → *Exaustos 1*.
- Fé e Sanidade: cenas Tristes/Aterrorizantes/Sobrenaturais → teste de Vontade, falha reduz Éter. "Observar um aliado morrer, instantaneamente, exige um teste de Vontade (CD 20) ou perca 2d6+3 de Éter."
- Estresse: atacar aliado → +1 estresse para ambos. Curto libera 1; longo libera tudo. "Cada ponto de estresse ao ser removido, te faz perder 1d6 de Stamina e Éter."

### 1.16 Jornada (raiz)
Hostilidade 0/5/10/15/20. Ações: Guiar (Max 1) Sobrevivência CD 15 → +2 (+1 por 5 sobrepujantes); Motivar CD 15 → +1; Vigiar Percepção CD 15 → +1; Outros CD 15 → +1. Meta: `3+(hostilidade/5)` pontos. Falha → d100: 1 → perde 4d6+Host. Saúde e Stamina · 2-19 2d8+Host · 20-39 2d6+Host · 40-59 1d6+Host Stamina · 60-79 1d4+Host Stamina · 80-99 Host Stamina · 100 evita tudo.

### 1.17 Superfícies / Furtividade / Fuga / Perseguição (raiz)
- Terreno Difícil dobro de movimento · Escorregadia: a cada 3 m Reflexo CD 15 ou *Caído* · Em Chamas: a cada 3 m Fortitude CD 15 ou *Em Chamas* · Grama Alta: vantagem Furtividade · Molhado: vulnerável a Elemental(Eletricidade).
- Furtividade: 3 ações; disputa Furtividade × Percepção; ataque escondido conta alvo *Desprevenido*; atacar revela.
- Perseguição: Movimento (CD 15) até 3 sucessos/3 fracassos. Ações: Ganhar Tempo (falha de propósito, remove 1 falha dos aliados) · Esconder-se (Furtividade vs Percepção; falha = fracasso imediato) · Esforçar-se (vantagem no próximo, −1d4+1 Saúde e Stamina).

### 1.18 Idioma (raiz)
"apenas 5 idiomas existem": Comum (padrão internacional) · Skalia ("Idioma dos Répteis, protegido pela raça") · Khazadun ("Idioma dos Anões, impossível de falar sem cordas vocais anãs") · Natural ("Animais, Bestas e Dryads") · Abissal ("raro entendido por poucos, geralmente teurgos pesquisadores") · Esquecido ("Idioma Extinto de Criaturas Antigas"). → 6 listados.

### 1.19 Khan Sins (raiz)
Jogo de apostas. 1d20 + Proficiência na perícia da mesa; mesa fixa (CD) ou dinâmica (d20 da mesa); sucesso multiplica Buy-In; perda perde tudo; roubo = Crime vs Percepção (mesa rouba → percepção passiva do player).
| Tier | CD | Perícias (+Mult.) | Mult | Crime | Percepção | Teto |
| Rua | 12 ou 1d20+2 | Reflexos +0.5, Percepção +0, Movimento +0, Furtividade +1 | x1.5 | +2 | +5 | 25 |
| Taverna | 15 ou 1d20+5 | Sobrevivência +0.5, Investigação +0.5, Conhecimento +0.5, Fortitude +1, Iniciativa +1 | x2 | +5 | +10 | 50 |
| Khan | 20 ou 1d20+10 | Vontade +1, Místico +1, Crime +1, Religião +2, Ofício +2, Medicina +2 | x3 | +10 | +15 | Sem Teto |

### 1.20 Regras de Magia (raiz + página Magias — idênticas em valores)
- Requisitos: Treinado em Místico; ter aprendido a magia ("fornecida por classe, raça ou origem"); Foco da escola. "Você só pode manipular 1 Foco por vez." Acerto usa Místico.
- Custo Base: N1 2 Éter · N2 4 · N3 6 · N4 8 (requer Foco Primordial).
- Intensidade: Contida −2 Éter (Efeito Reduzido) · Normal (Base) · Forçada +2 (Ampliado) · Transbordante +4 ("Efeito Máximo + Risco (Vontade CD 15 ou falha no cast e perde o dobro de éter utilizado)").
- Efeito por intensidade (Contida/Normal/Forçada/Transb.): Dano −1 dado/Base/+1/+2 · Cura idem · Buff/Debuff metade dur./Base/dobro/"Dobro de duração + 2x Intensidade" · Área metade/Base/+50% raio/dobro · Alcance metade/Base/+50%/dobro · Conhecimento Vaga/Base/Detalhada/Completa · Invocação Fraca/Base/Forte/Forte+Duração · Teste de Resistência −2 CD/Base/+2/+4.
- Modulações — Destruição: Fragmentar +3 (+1 alvo, dano metade) · Alterar +3 (tipo de dano) · Carregar +3 (ignora 2 Evasão / +2 CD) · Marcar +5 (*Exposto*). Abjuração: Ancorar +2 (não Dissipável) · Refletir +3 (metade ao agressor) · Socializar +4 (+1 alvo) · Acelerar +5 (custo de ação −1: 3→2→1→Reação→Ação Livre). Alteração: Inversão +2 · Alcançar +3 (dobra alcance) · Contagiar +3 (+1 alvo) · Insistir +5 (dura o dobro). Conhecimento: Compartilhar +1 · Exigir +2 · Projetar +2 · Gravar +3.
- Legenda página Magias: "✅ = Modificável por intensidade | ❎ = Valor fixo"; barras = Contida / Normal / Forçada / Transbordante.
- N4: "Requer Foco Primordial. Magias proibidas, formuladas no Primórdio. Contudo, podem custar caro."

### 1.21 Lista de Magias — **80 magias** (20 por nível, 5 por escola por nível; sem duplicatas — verificado por parse)
**N1 Destruição**: Dardo Arcano (2 Ações; 4,5/9/13,5/18 m; 1d4/2d4/3d4/4d4 Radiante/Trovejante/Necrótico; acerta automaticamente) · Onda Gravitacional (3 Ações; Pessoal; retângulo 6 m; 1d6/2d6/3d6/4d6 Trovejante; Fortitude ou empurrado 0/1,5/3/4,5 m) · Incinerar Área (3 Ações; 6 m; raio 1,5/3/4,5/6; 1d6…4d6 Fogo; Reflexos metade ou *Em Chamas* + dano completo) · Toque Gélido (2 Ações; Toque/Toque/3/4,5 m; 1d8…4d8 Frio; Místico vs Evasão; *Lento 1*) · Raio Elétrico (2 Ações; 4,5…18 m; 1/2/3/4 alvos em até 0/1,5/3/4,5 m; 1d6…4d6 Elétrico).
**N1 Abjuração**: Escudo Telecinético (Reação; +2/+5/+7/+10 Evasão até próximo turno) · Solo Sagrado (1 Ação; raio 1,5/3/4,5/6; 3/3/4/5 rodadas; aliados +1/+2/+3/+4 Evasão) · Armadura do Oblívio (1 Ação; Toque/Toque/3/4,5; Ae dano atípico escolhido 2/5/7/10 até fim da cena) · Santuário Menor (2 Ações; Toque/3/6 m; 1/2/3 criaturas; imune a dano 3 rodadas; agressores Vontade ou erram; dissipa se alvo atacar; 1×/descanso longo por alvo; só Normal ou acima) · Purificação Mística (1 Ação; 1,5/1,5/3/6 m; 1/2/3/4 criaturas; remove Enfeitiçado, Enjoado, Amedrontado, Atordoado, Adormecido, Paralisado, Desorientado, Confuso e Em Chamas).
**N1 Alteração**: Mão Mágica (1 Ação; 9 m; mão 1 Saúde 0 Evasão 10 min; até 1 kg; mover/interagir 1 ação; só Normal) · Estimulante Místico (2 Ações; Toque/3/4,5/6; próximos 1/2/3/3 ataques; +0/+1/+1/+2 dado de dano; +2/+2/+3/+4 em ataques) · Disfarce Ilusório (3 Ações; Toque; 1/2/3/4 criaturas; 15/30/45/60 min; ±30 cm; Percepção vs CD) · Queda Suave (2 Ações; Toque/3/4,5/6; 2/3/4/5 criaturas; imune queda até 15/30/45/60 m) · Maldição do Peso (2 Ações; 4,5…18 m; 1/1/2/2 alvos; *Confuso*/*Lento 1*/*Lento 2*/*Lento 3* por 1d4 rodadas; Vontade).
**N1 Conhecimento**: Detectar Magia (1 Ação; Pessoal; 15/30/45/60 m; 5/10/15/20 min) · Alarme (3 Ações; Toque; raio 1,5/3/4,5/6; 12 h/1/2/3 dias; desarmar Místico vs CD) · Mensagem (1 Ação; 18/36/54/72 m; 1/1/2/3 alvos) · Língua Mística (1 Ação; Toque; objeto ou 1 criatura; só Normal) · Entender Ser (1 Ação; Toque; Vontade ou revela Ar, Ae, Resistências, Vulnerabilidades, Tipo, CD e Saúde Máxima; só Normal).
**N2 Destruição**: Lança de Gelo (3 Ações; 9/18/27/36 m; 2d8/3d8/4d8/5d8 Frio; Místico vs Evasão, bloqueável; Reflexos ou *Lento 1* 1 rodada) · Verdades Dolorosas (2 Ações; 4,5…18; 1d6…4d6 Psíquico; Vontade ou dano e *Atordoado*) · Caveiras Explosivas (3 Ações; 4,5…18; raio 1,5 m por caveira; 1d4/1d6/2d6/3d6 Fogo — 2 ataques independentes; Reflexos metade ou *Em Chamas*) · Invocar Tempestade (3 Ações; 4,5…18 m; área 36/54/72 m; 3d6/4d6/5d6/6d6 Elétrico; raios/rodada 1/2/3/4; 1/2/3 rodadas; Fortitude ou *Atordoado*; "todas as criaturas dentro dessa área devem rolar um d20, as 3 criaturas que rolarem mais baixo são acertadas") · Ventania Bizarra (2 Ações; 4,5…18; área 1,5/3/4,5/6; 1d10…4d10 Força; Fortitude ou dano + *Sangramento 1*, sucesso metade).
**N2 Abjuração**: Barreira de Energia (3 Ações; Pessoal; raio 1,5/3/4,5/6; Saúde 25/50/75/100; "dano Primordial causa o dobro de dano à barreira") · Telepatia (2 Ações; Toque; distância 18/36/54/72; 1/2/4/6 criaturas; 15/30/45 min/1 h) · Dissipar Magia (2 Ações; 9 m; encerra N≤2 automaticamente; superiores Místico CD 20 + nível; só Normal) · Aumentar/Diminuir Criatura (2 Ações; 9 m; ±1 categoria de tamanho; 3 rodadas; Vontade se não voluntário; só Normal) · Personificar Elemento (2 Ações; Toque/Toque/3/6; Resistência a 1 tipo; atacantes CaC recebem 1d4/1d6/2d6/3d6).
**N2 Alteração**: Pele de Pedra (1 Ação; Toque/Toque/3/4,5; 3/3/4/5 rodadas; Ae Ordinário 2/5/7/10) · Confundir Sentidos (1 Ação; 4,5…18; Vontade ao fim de cada turno; Percepção e Iniciativa rola 2× pior; −1/−2/−3/−4 ataques à distância) · Translocação Arcana (1 Ação; teleporte ponto visível até 9 m; sai de Agarrão; só Normal) · Transfigurar Arma (1 Ação; Toque; 1/1/2/3 ataques; tipo Atípico escolhido + 1d4/1d6/1d8/1d10) · Enraizar (2 Ações; 4,5…18; 1/1/2/2 alvos; Fortitude ou *Enraizado*; 2 ações p/ refazer; voadores imunes).
**N2 Conhecimento**: Sussurro do Ambiente (3 Ações; Pessoal; raio 4,5/9/13,5/18; mapa mental; 5/10/15/20 min) · Pânico (1 Ação; 4,5…18; Vontade ou Amedrontado 1/1/2/3 rodadas; não removível por Purificação Mística; construtos/mortos-vivos sem Éter imunes) · História do Éter (1 Minuto; Toque; revela nome, propriedades, escola, maldições; Forçada/Transb. histórico 24h/7 dias; fora de combate) · Empréstimo Natural (1 Ação; Pessoal; 5/10/15/30 min; Córnea dos Grutos / Orelha dos Anões / Antenas Sensoriais Insectoides; efeitos colaterais Cego/Atordoado/Enjoado 1 rodada) · Impulso Instintivo (2 Ações; 9 m; comando 1 frase; Vontade; só Normal).
**N3 Destruição**: Pestilência (2 Ações; 3/6/9/13,5 m; 1d8…4d8 Necrótico; Vontade; transmite à criatura mais próxima em até 9 m) · Limiar Perfurante (2 Ações; 4,5…18; 2d10…5d10 Místico; ignora Ar e Ae; Fortitude ou *Exposto*) · Fragmento Estelar (3 Ações; 1,5/3/6/9 m alcance e raio; 1d6/2d6/6d6/10d6 Radiante dividido entre todos na área; Transb.: transfere dano sobrepujante ao executar) · Disparo Veloz (1 Ação; 9 m; 1d12 Místico; acerto recupera metade do éter; "ignora a regra de 1 cast por turno"; só Normal) · Reversão Umbral (3 Ações; Pessoal; reflete TODO dano recebido como Místico 1 rodada; requer Transbordante; 1×/combate).
**N3 Abjuração**: Contramedida (Reação; 9/13,5/18 m; Místico vs Místico; vencer → magia falha e conjurador perde Éter; perder por 10+ → você perde 2 Éter; Normal ou acima) · Ruído Anti-Magia (2 Ações; 4,5…18; raio 1,5/3/4,5/6; 3 rodadas; conjurar na área Vontade vs CD ou falha e perde Éter; afeta o conjurador) · Armadura de Espinhos (1 Ação; Toque/Toque/3/6; 1d6…4d6 Perfurante ao atacante CaC; Sustentada) · Refúgio dos Perdidos (3 Ações; Pessoal; raio 3/4,5/6/9; Ae Todos 3/5/7/10; +1/+2/+3/+4 Resistências; Sustentada; move com você) · Laço da União (2 Ações; Toque/3/4,5/6; 2/2/3/4 criaturas; dano dividido igualmente, mín. 1, arredonda p/ cima; Vontade p/ não voluntários; rompe se Inconsciente/fora do alcance).
**N3 Alteração**: Transferir Condição (1 Ação; Toque origem; 4,5…18 destino; move 1/1/2/3 condições; Vontade por condição) · Absorver Contusão (Reação; Pessoal/3/4,5/6; reduz 1d10…4d10; carga mística → dano Contundente toque como ação livre no próximo turno) · Pele de Camaleão (2 Ações; Toque/Toque/3/4,5; 1/1/1/2 alvos; até fim do combate; +7/+15/+22/+30 Evasão, +2/+5/+7/+10 Furtividade; perde 3/5/8/10 Evasão por ataque esquivado; dissipa ao receber dano) · Xadrez (2 Ações; 9 m; 2 criaturas trocam de posição; Vontade; Agarradas/Enraizadas imunes; só Normal) · Plasmar Terreno (3 Ações; 4,5…18; raio 1,5/3/4,5/6; paredes até 1,5 m; permanente).
**N3 Conhecimento**: Purgatório (1 minuto; Toque; cadáver ≤1h/6h/24h/7 dias; 2/3/4/5 perguntas; Ocos falham; Contida só sim/não) · Projeção Astral (5 min; raio 18/36/54/72; 5/10/15/30 min; corpo Evasão 0) · Sinapsia Coletiva (3 Ações; Toque; 2/3/4/5 voluntárias; Sustentada: "Em combate: pague o mesmo éter do custo da conjuração da magia todo turno; Fora de combate: … a cada 30 minutos"; dano Psíquico compartilhado) · Caco Esquecido (3 Ações; Toque/Toque/3/6; memória falsa permanente; Vontade) · Confissão do Éter (5 min; Pessoal; Transbordante; verdade absoluta; "1-em-6 de chance (role 1d6) da resposta ser falsa", +1 por uso consecutivo no dia).
**N4 Destruição**: Fissura da Alma (6 Ações/2 Rodadas; 18 m; Apenas Transbordante; Primordial = 66,6% Saúde Máx. do alvo; conjurador sofre 33,3% da Saúde Máx. DO ALVO, irredutível; dano recebido cancela e perde Éter) · Pestilência Primordial (3 Ações; 18 m; sem resistência inicial; 1d8 Primordial +1 dado/turno sem limite; contágio 9 m; Vontade no início do turno cura; conjurador não cancela; +Desnutrido 1 por rodada cumulativo) · Eco do Apocalipse (2 Ações; aura 6 m; Sustentada; 4d10 Primordial automático a quem inicia turno na aura; conjurador perde 1d10 Éter/turno extra; Éter 0 → Oco e explosão 8d10 raio 6 m incl. conjurador) · Cometa do Mártir (3 Ações; Pessoal; raio 12 m; Apenas Transbordante; 12d12 Primordial a todos incl. conjurador; Reflexos metade só inimigos; sobrevivendo: Exausto 3 e Éter Máx. −1d6 permanente) · Tempestade Primordial (3 Ações; 30 m; área 72 m; 6d10 Primordial por raio, 1 raio/rodada, alvo escolhido; Sustentada; Fortitude ou *Atordoado*; Surdo 1 rodada por rodada; ao encerrar Surdo 1d4 dias).
**N4 Abjuração**: Armadura de Kha (2 Ações; Pessoal; Duração tabela "1 Rodada"; Imunidade Ordinário, Elementar e Místico; magias N≤3 falham; perde 8 Éter Máximo; 2× sem descanso longo → Kha "retira o privilégio da escola inteira por 7 dias") · Exílio Existencial (sem linha Ação; 9 m; 3 rodadas; Vontade ou Banido; Apenas Transbordante; sucesso → 4d8 Primordial; conjurador 3 dias "partido": −1 ação/turno, Vontade com desvantagem) · Selo do Oblívio (1 Ação; Toque; Vontade ou Selado; perde 2 pontos do atributo principal INT/SAB até dissipar; portas/recipientes CD+20; "não há Palavra de Retorno") · Reversão Primordial (3 ações; Pessoal; Apenas Transbordante; próxima rodada reverte todo dano como Primordial; próximo turno recebe todo dano negado duplicado) · Vytália (1 Ação; 1/2/3 alvos; 6/9/13,5 m; cura 33,3%/50%/66,6% Saúde Máx.; Normal ou Acima; perde 1/2/3 Éter Máximo permanente).
**N4 Alteração**: Aprendiz Caótico (3 Ações; Sustentada; Réplica 50% stats; Éter Máx. dividido; Réplica a 0 → 3d10 Primordial + Atordoado; encerrar: Vontade vs próprio CD ou Réplica independente) · Fusão de Corpos (3 Ações; 2 voluntárias; Toque; até 1 h; status/ações somados, perícias maiores; separar 2d10 Primordial cada, discordância 4d10; não dissipável externamente) · Acme (Reação; Transbordante; rebobina 6 s ao início do turno; fica *Exposto*; se já Exposto 4d10 Primordial; sem modulação) · Apoteose Genética (1 Descanso Longo; Toque; permanente; Transbordante; +20 HP Máximo, +4 testes Físicos, +1d6 dano CaC, imune Amedrontado; debuffs do Abismo **Mente Fraca** e **Orgulhoso**) · Julgamento de Kha (1 Ação; 9 m; Vontade; 1 rodada; alma materializada c/ 50% Saúde Máx. a 1,5 m; se abatida, dano acumulado → alvo como Primordial + Atordoado 1 rodada; alma retorna → conjurador 2d10 Primordial; sem outras magias de Alteração enquanto ativa).
**N4 Conhecimento**: Dádiva de Kha (3 Ações; Apenas Transbordante; personagem passa a saber info do jogador; falha na Vontade → perde grande parte da memória, recupera em 1 semana) · Necropsia Primordial (10 min; Toque; 1 cadáver; Transbordante; história/segredos/assassino; fragmentos emocionais do morto) · Olhos de Malkhor (3 Ações; 3 rodadas; Transbordante; dano máximo dos dados; depois *Cego* 3 rodadas) · Tecido de Vytália (5 Min; Transbordante; vivo/morto, onde, quando/como; 24 h pedido de Vytália; recusa → perde a magia e 4d10 Primordial) · Possessão Carnal (3 Ações; Toque; Apenas Transbordante; Vontade ou Possuído; controla 3 rodadas; não encerrável; corpo possuído morre → conjurador "sem vida", ressurreição normal não funciona).

### 1.22 Condições (página Condições — 28 títulos / 29 condições contando Sobrepeso Leve+Extremo)
Sobrepeso Leve (Movimento metade; −2 perícias FOR/DES/CON) · Sobrepeso Extremo (Movimento 1,5 m; desvantagem FOR/DES/CON) · Exposto (primeiro ataque que acertar é crítico; remove ao acertar) · Sangramento X (+1d4 Biológico por ataque se puder sangrar; −1 por acerto) · Lento X (−3 m Movimento; −1 Ação) · Bêbado (2 natural = falha crítica; −2 Atacar, Defender, Movimento, Reflexos, Fortitude, Vontade) · Atordoado (−2 Ações e Evasão até próxima rodada) · Adormecido (Exposto + Inconsciente) · Paralisado (Exposto; sem ação/reação; resistências falham) · Desorientado (−2 Atacar, −2 Defender) · Confuso (−1 Ação) · Enjoado (−5 Fortitude; −2 Evasão) · Envenenamento (−2 testes FOR/CON/DES; 1d6 Biológico/rodada; Fortitude CD 20 ou Antídoto) · Em Chamas (1d6 fogo início do turno; 1 ação apaga) · Caído (movimento 1,5 m; não retalia; defende −2; 1 ação levanta) · Enraizado (Movimento 0) · Desprevenido (não reage; exposto) · Amedrontado (gasta turno fugindo) · Descontrolado X (ataca criatura mais próxima X rodadas) · Enfeitiçado (não ataca quem enfeitiçou; −5 interação social contra) · Exaustão 1–5 (1 desvantagem físicos · 2 metade do dano · 3 desvantagem em tudo + movimento metade · 4 atributos metade + movimento 0 · 5 Morte; descanso longo −1) · Cego (−5 percepção; desvantagem ataques) · Surdo (−2 percepção) · Invisível (passa Furtividade; +5 Defender e Atacar vs quem não vê; atacar/receber dano remove) · Desnutrido X (desvantagem físicos; dobro de Stamina; −10·X Saúde máx.) · Inconsciente (resistências falham) · Morrendo (inconsciente; 10% vida máx. dano biológico/rodada; morre ao ultrapassar metade da vida máx. em negativos; Medicina CD 20 com 2 ações estabiliza; remove ao ficar positivo) · Exaurido (0 Stamina; não rola perícias; encerra em qualquer descanso) · Oco (−5 Éter por perícia falha; metade do éter máx. em negativos → perde o personagem para o mestre; não canaliza magias).

### 1.23 Criação de Personagem + Template Ficha
Página "Criação de Personagem" = status 🟡 + link. Template (🟢): Info básicas (Nome, Jogador, Raça, Classe, Origem, Nível, XP, Sins); Atributos; Perícias em 4 grupos com colunas +2/+4/+6/+8/Total; Recursos Saúde/Stamina/Éter; Armadura (12 tipos: Ordinário, Ácido, Fogo, Gelo, Elétrico, Trovejante, Veneno, Necrótico, Radiante, Psíquico, Força, Primordial); Equipamentos (8 linhas); Bugigangas (6); Técnicas Gerais / Ramo Tier 1-3 / Diversas / Marcas; Cartas do Limiar 1–11; Grimório (Para Teurgos) N1–N4 com Nome/Ação/Alvo/Resist/Alcance/Duração; História.

---
## 2. ENTIDADES (nomes próprios)
- **Khalkaria** — "O Bazar é o grande compêndio de itens de Khalkaria"; "As criaturas de Khalkaria oferecem serviços…"; "Em Khalkaria existem diversos idiomas".
- **Kharavel** — "Khan Sins é um jogo de apostas muito popular entre os locais e povos antigos de Kharavel"; "cada mesa através de Kharavel pode modificar…".
- **Kha** (deus primordial) — "súplica profana ao deus primordial Kha. Aquele que teceu o universo com as próprias mãos e cujos olhos enxergam além do véu do tempo" (Dádiva de Kha); "Kha nunca protege de graça … é uma ofensa ao deus, ele retira o privilégio da escola inteira por 7 dias" (Armadura de Kha); Julgamento de Kha.
- **Vytália** (deusa da vida) — "O nome de Vytália, deusa da vida, é pronunciado não como uma oração, mas como uma dívida"; "Vytália ouve. Vytália cobre. E Vytália cobra."; Tecido de Vytália: "A deusa da vida não aceita ser usada sem reciprocidade."
- **Malkhor** (deus do Pecado) — "Você empresta um mísero fragmento do poder de Malkhor, o deus do Pecado."
- **Primórdio** — "Magias proibidas, formuladas no Primórdio"; "escolas do primórdio".
- **O Abismo** — "debuffs do Abismo: **Mente Fraca** e **Orgulhoso**" (Apoteose Genética).
- **O Limiar** — "Proficiência é ganha … cartas do Limiar"; "+4 Pontos do Limiar".
- **O Bazar** — eixo de progressão e compêndio.
- **Teurgos** — "Apenas Teurgos e pessoas expostas a esses fenômenos"; "Grimório (Para Teurgos)"; Abissal "geralmente teurgos pesquisadores".
- Povos/raças citados: **Anões** (Khazadun; "Orelha dos Anões"), **Dryads** (Natural), **Grutos** ("Córnea dos Grutos"), **Insectoides** ("Antenas Sensoriais Insectoides"), **Répteis** ("Idioma dos Répteis, protegido pela raça").
- Idiomas: **Comum, Skalia, Khazadun, Natural, Abissal, Esquecido**.
- Jogo: **Khan Sins** (tiers Rua / Taverna / Khan). Moeda: **Sins**.
- Comerciantes: Sucateiro, Fornecedor, Artesão, Ferreiro, Boticário, **Artificer** (termo em inglês).
- Magias/efeitos referenciados mas inexistentes na lista: **"Voz na Mente"** (Caco Esquecido), **"Palavra de Retorno"** (Selo do Oblívio).
- Escolas: Destruição, Abjuração, Alteração, Conhecimento (+ "magias Primordiais" via Foco Primordial).

---
## 3. INCONSISTÊNCIAS (Notion vs Notion)
1. **Idiomas: "apenas 5 idiomas existem"** (raiz §Idioma) mas a lista tem **6** (Comum, Skalia, Khazadun, Natural, Abissal, Esquecido).
2. **Tipos de dano**: raiz §Tipos de Dano: "Elemental (Fogo ; Frio ; Gelo)" — Frio e Gelo duplicados e **Elétrico ausente**, embora Raio Elétrico/Invocar Tempestade causem "Elétrico" e Superfícies fale "Elemental(Eletricidade)". Template Ficha lista "Gelo" e "Elétrico" e **não lista Frio**. Magias usam "Frio" (Toque Gélido, Lança de Gelo).
3. **Nomes de perícias**: raiz "Convencimento / Intimidação / Enganação / Ofício(X)" vs Template "Conhecer (Des/Int) / Intimidar (For/Sab) / Enganar (Des/Int) / Ofícios". "Conhecer" colide com "Conhecimento".
4. **Atributos de perícia**: raiz Intimidação "(Constituição ou Força)" vs Template "Intimidar (For/Sab)". Raiz Atacar "Força ou Destreza" vs Template "Atacar (For)". Raiz Defender = dado (1d6→2d8) vs Template "Defender (Des/Con)" com colunas +2/+4/+6/+8.
5. **Template agrupa** Iniciativa, Conhecimento, Medicina, Investigação, Religião, Místico sob "Perícias Sociais".
6. **Munição**: raiz §Munição "1 munição … pelo combate inteiro. A munição é descontada por combate" vs §Inventário "munições(Flechas e etc) contam como 1 bugiganga" e "Itens leves contam como 1 bugiganga a cada 10 unidades" — unidade de munição indefinida (1 = combate? 10 = 1 slot?).
7. **Invocar Tempestade**: tabela "Raios p/Rodada 1/2/3/4" (Normal = 2) vs descrição "as 3 criaturas que rolarem mais baixo são acertadas"; tabela Área/Duração com 3 valores.
8. **Ventania Bizarra**: tabela Dano "1d10/2d10/3d10/4d10 Força" vs descrição "2d8 de dano de Força"; tabela Área "1,5/3/4,5/6 m" vs descrição "área de 4,5 m em até 9 m".
9. **Caveiras Explosivas**: Dano "1d4 / 1d6 / 2d6 / 3d6" (Normal = 1d6) vs descrição "causando 2d6 de dano de Fogo".
10. **Estimulante Místico**: Duração "1/2/3/3 ataques" (Normal = 2) vs "O estimulante cessa ao alvo ter atacado 3 vezes".
11. **Sussurro do Ambiente**: descrição é cópia de Detectar Magia ("sentir a presença de energia mística em uma área de até 30 m através de seus olhos") — não corresponde ao Efeito (mapa mental) nem à Área (4,5/9/13,5/18).
12. **Armadura de Kha**: tabela Duração "1 Rodada" vs descrição "Por 3 rodadas"; Efeito "Imunidade a dano Ordinário, Elementar e Místico" vs descrição "imune a qualquer dano que não seja Primordial" (Biológico e Força ficam ambíguos).
13. **Vytália (N4)**: 3 barras com "Intensidade: Normal ou Acima" → mapeiam Normal/Forçada/Transbordante, **não** Contida/Normal/Forçada. Quebra a "regra das 3 barras" do CLAUDE.md (repetir o primeiro). Idem Santuário Menor ("Normal ou acima", Alcance Toque/3/6, Alvo 1/2/3) e Contramedida ("Normal ou acima", 9/13,5/18).
14. **Pânico** diz que Amedrontado "tem desvantagem em testes realizados enquanto puder te ver" — Condições/Amedrontado não tem desvantagem, só "gaste seu turno correndo".
15. **Condições inexistentes referenciadas**: "Petrificado" (Transferir Condição, Caco Esquecido), "Exausto 3" (Cometa; condição chama-se Exaustão), "Banido/Selado/Laçado/Possuído" (só em tabelas), "sem vida" (Possessão Carnal).
16. **Disparo Veloz**: "ignora a regra de 1 cast por turno" — regra não existe em Regras de Magia nem na raiz (§Combate lista "Conjurar magia (1-3 ações)" sem limite).
17. **"Magia Sustentada"**: usada em 8 magias; regra geral não definida nas Regras de Magia; definida inline só em Sinapsia Coletiva/Eco/Tempestade/Aprendiz ("pague os éter no seu turno"); Armadura de Espinhos "pague Éter a cada turno" vs Refúgio "a cada rodada"; quantidade nunca especificada fora de Sinapsia ("mesmo éter do custo da conjuração").
18. **Legenda ✅/❎ inconsistente**: linhas com 4 valores marcadas ❎ — Maldição do Peso Alvo "1/1/2/2 ❎", Ruído Anti-Magia Alcance "4,5/9/13,5/18 ❎", Armadura de Espinhos Dano "1d6…4d6 ❎", Refúgio dos Perdidos Área e Efeito ❎, Pele de Camaleão Alcance ❎; Xadrez Alcance "9 m ✅" (fixo).
19. **Onda Gravitacional**: descrição "são empurradas m para longe de vocês" — número ausente.
20. **Aumentar/Diminuir Criatura**: Efeito "categoria de tamanho" vs descrição "1 categoria de peso".
21. **Exílio Existencial**: sem linha "Ação"; "Em caso de sucesso no teste, a energia do exílio se reflete parcialmente como 4d8 de dano Primordial maciço" — sucesso de quem, dano em quem?
22. **Raiz §Magias** "Efeito reduzido/normal/ampliado/máximo" usa coluna "Ampliado" onde a página Magias usa "Forçada" (só nomenclatura; valores iguais). Ordem das modulações de Abjuração difere (Socializar/Refletir) — valores iguais.
23. **Grafia**: "Luxária" (tabela raridade) vs "Luxaria" (tabela venda, crafting).
24. **Dano "Biológico"** usado como tipo em Sangramento, Envenenamento e Morrendo, mas na raiz Biológico é **categoria** (Veneno/Ácido/Psíquico), não tipo — Ae(Biológico) indefinido.
25. **Fragmento Estelar**: progressão 1d6/2d6/6d6/10d6 viola tabela de intensidade (−1/+1/+2 dados).
26. **Apoteose Genética** "+20 HP Máximo" — nomenclatura "HP" vs "Saúde".
27. **Terminologia Dc** (raiz "Xp e Dc") vs "CR" no CLAUDE.md/Bestiário.

---
## 4. PERGUNTAS PARA O PEDRO
1. Fórmula do modificador de atributo e da Evasão não constam em nenhuma das páginas lidas — estão em Classes? Confirmar (Atr−10)/2 e Evasão = 10+Mod.DES ou "determinada pela classe" (raiz).
2. "Gelo" na tabela de dano é typo de "Elétrico"? Lista canônica de 12 tipos = Ordinário + Fogo/Frio/Elétrico + Veneno/Ácido/Psíquico + Radiante/Trovejante/Necrótico + Força + Primordial? (Template usa Gelo+Elétrico sem Frio.)
3. Idiomas: 5 ou 6? Skalia "dos Répteis" — raça réptil não existe nas 7 raças; herança de versão antiga?
4. Munição: qual a unidade de slot? (1 munição = 1 combate; 10 itens leves = 1 bugiganga; CLAUDE.md diz 20 = 1 slot — nenhum lado bate.)
5. Convencimento/Enganação com **Destreza** ou Inteligência — intencional (sem Carisma) ou resquício?
6. Existe "regra de 1 cast por turno"? Se sim, onde fica; se não, remover de Disparo Veloz.
7. Definir "Magia Sustentada" oficialmente (custo por rodada = custo de conjuração? intensidade repaga?).
8. Regra das 3 barras: em magias "Normal ou acima" (Vytália, Santuário Menor, Contramedida) as 3 barras são Normal/Forçada/Transbordante? Site hoje repete o primeiro valor = errado nesses casos.
9. Nível 4 é "Apenas Transbordante" em 9/20 magias — Transbordante exige Vontade CD 15 "ou falha e perde o dobro"; confirmar que isso se aplica também (custo 12 Éter, falha = −24).
10. Magias N2/N3 de Conhecimento/Alteração têm prosa longa em estilo diferente do resto (Confundir Sentidos, Translocação, Pânico, Caco Esquecido, Sinapsia…) e referenciam entidade inexistente "Voz na Mente" e condição "Petrificado" — parecem geradas por IA e não revisadas. Revisar? "Palavra de Retorno" (Selo do Oblívio) existe?
11. "Mente Fraca" e "Orgulhoso" existem como Dores do Abismo no Limiar? (checar com agente do Limiar).
12. Lento X: X representa o quê? Texto dá −3 m / −1 Ação fixos. Empilha por nível?
13. Condições faltantes que as regras citam: "Vulnerável" (Superfície Molhado), "Escondido", "Prostrado". Formalizar?
14. Template Ficha: renomear Conhecer→Convencimento, Intimidar→Intimidação, Enganar→Enganação e corrigir atributos para bater com a raiz? Agrupamento "Sociais" errado.
15. Sins iniciais (CLAUDE.md "mediana inicial 12") — não achado nas páginas A; vem de Origens?
16. Cartas do Limiar no Template = 11 slots — é o máximo canônico (4 pontos × 4 níveis = 16 pontos)?
17. Foco Primordial requisito "*Experiente*> em Místico" — é "Experiente ou superior"? Sintaxe quebrada.
18. Progressão nível 1 "4 Técnicas de Classe" vs classes — checar com agente de Classes.

---
## 5. COMPARAÇÃO COM CLAUDE.md
| Fato CLAUDE.md | Status | Evidência |
|---|---|---|
| 5 atributos FOR DES CON INT SAB 8–18 | **Confirmado** | raiz §Atributos Iniciais |
| mod = (atr−10)/2 | **Não encontrado** nas páginas A (nem raiz, nem Template) | — |
| 22 perícias listadas | **Confirmado** (raiz, 22 linhas, nomes idênticos ao CLAUDE.md) | Template diverge em 3 nomes (Conhecer/Intimidar/Enganar) |
| Proficiência +2/+4/+6/+8 | **Confirmado** (+0 Leigo → +8 Lendário); **exceção**: Defender usa dado 1d6/1d8/1d10/1d12/2d8 | raiz §Perícias |
| Recursos Saúde/Stamina/Éter | **Confirmado** ("3 status universais"; recurso de classe não citado na raiz) | raiz §Status |
| Inventário 2+ModFOR equipamentos | **Confirmado** + detalhe "(Min. 1)", equipados não contam | raiz §Inventário |
| 10+ModFOR bugigangas | **Confirmado** + "(Min. 1)" | idem |
| Munição 20 unidades = 1 slot | **Divergente**: Notion diz "munições contam como 1 bugiganga" e "Itens leves … 1 bugiganga a cada 10 unidades"; munição gasta por combate | raiz §Inventário, §Munição |
| Magia custo 2/4/6/8 | **Confirmado** (N4 requer Foco Primordial) | raiz + Magias |
| Contida −2 / Normal / Forçada +2 / Transbordante +4 | **Confirmado** (+ risco Vontade CD 15) | idem |
| Escolas Destruição/Abjuração/Alteração/Conhecimento | **Confirmado** | idem |
| 12 tipos de dano | **Divergente/ambíguo**: raiz lista Cortante, Contundente, Perfurante, Fogo, Frio, Gelo, Veneno, Ácido, Psíquico, Radiante, Trovejante, Necrótico, Força, Primordial (sem Elétrico; Frio+Gelo). Template: 12 tipos com Gelo E Elétrico, sem Frio. Nenhum bate 1:1 com o CLAUDE.md | raiz §Tipos de Dano; Template §Armadura |
| Sins mediana inicial 12 | **Não encontrado** | — |
| Item ordinário 21 | **Confirmado** (Ordinário 2d10+10 → mediana 21) | raiz §Bazar/§Dinheiro |
| Evasão = 10+Mod.DES | **Não confirmado**: raiz diz "Determinada pela sua classe" | raiz §Defesa |
| Éter mede sanidade | **Confirmado** ("Define sua sanidade e energia espiritual") | raiz §Status |
| Condição Oco | **Confirmado** (Éter ≤ 0 → Oco; −5 Éter por perícia falha; metade do máx. em negativos → perde personagem; não canaliza) | raiz + Condições |
