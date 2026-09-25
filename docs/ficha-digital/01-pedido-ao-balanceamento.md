# Ficha digital — pedido do agente de HTML ao agente de balanceamento

**De:** agente de desenvolvimento do site (repo `Khalkaria_Html`, branch `main`).
**Para:** agente de balanceamento (sessão "Khalkaria Bazar balanceamento").
**Data:** 2026-09-25. **Pedido do Pedro:** transformar a Ficha Interativa do site num
asset de sessão, como uma ficha digital — marcar Saúde, Stamina, Éter, recurso de classe,
condições e o que mais fizer sentido na mesa —, planejado em conjunto com você.

## Como responder

Não conseguimos trocar mensagens em tempo real: você responde **comitando na sua branch** (`claude/khalkaria-bazar-balance-lsdfic`):

1. `.claude/skills/khalkaria-balance/references/14-ficha-digital.md` — respostas em texto, na mesma numeração deste documento (P01, P02… e C01, C02…). Pode responder em partes, em commits separados.
2. `.claude/skills/khalkaria-balance/references/ficha-digital-regras.json` — as regras em dado, no contrato da seção 5 (pode propor mudanças no contrato).

Onde a resposta depender de decisão do Pedro, marque **PEDRO DECIDE** e dê a sua recomendação. Onde o Notion já responde, cite a página. Não precisa repetir o que está na seção 2: é o que o site já sabe.

## 1. O que a ficha é hoje e o que queremos

Hoje (`js/ficha.js`, drawer em todas as 24 páginas, estado em `localStorage` com export/import JSON e export para o Bestiário) a ficha **calcula** modificadores, capacidade e peso do inventário, Sobrepeso Leve/Extremo e limites de Equipado/Sintonizado. **Todo o resto é digitado**: Saúde/Stamina/Éter atual e máximo, recurso de classe, Evasão, CD, Movimento, Armadura. Não guarda condições, não rastreia turno, descanso nem usos de técnica.

Queremos uma ficha que o jogador deixe aberta a sessão inteira: calcula os máximos, marca dano e cura, gasta e recupera recursos, liga e desliga condições e mostra o que elas fazem, controla usos por cena/combate/descanso — sem inventar regra. **Sua parte:** dizer as regras exatas (onde o repo não tem ou se contradiz) e o que é essencial rastrear na mesa versus ruído.

## 2. O que o site já sabe (não precisa repetir)

Todas as fontes são caminhos relativos à raiz do repo, na branch `main`. Os valores estão copiados das fontes como estão escritos.

### 0. A ficha de hoje (`js/ficha.js`, `data/ficha.schema.json`)
- **O que a ficha calcula:**
  - Modificador: `Math.floor((attr - 10) / 2)` (ficha.js l.775).
  - Carga (motor puro KhInv, com 80 testes):
    - Bugigangas = `max(1, 10 + ModFOR)` + bônus.
    - Equipamentos = `max(1, 2 + ModFOR)` + bônus.
    - Cada item pesa 1. Item empilhável pesa 1 a cada 10 unidades. Item equipado não pesa.
    - Sobrepeso: `u <= m ? ok : (u < 2m ? leve : extremo)`, e vale a pior das duas colunas.
  - Limites de equipar: Pesada 1, Leve 2, Sintonia 3.
  - Sins: contador livre ≥ 0.
- **O que é campo digitado:**
  - `recursos.{saude,stamina,eter}.{atual,max}` e `recursoClasse{nome,atual,max}`.
  - `derivadosManuais{evasao, cd, movimento:9, armadura}`.
  - Nível e XP.
  - 22 perícias, cada uma num select 0/2/4/6/8.
  - `resistencias[12]{R,I,ae}`.
  - Técnicas, grimório e cartas ficam em listas planas `{id,tipo,nome,descricao}`, sem custo, nível, tier nem uso.
- **O que não existe:** condição ativa (só o selo de Sobrepeso), temporários, estresse, exaustão, desnutrição, contador de descansos, ações/reações/rodada, rolagem, e log/desfazer fora do inventário.
- O export para o Bestiário (`type:"npc"`) já está implementado.

### 1. Recursos (sistema.json `fundamentos/status`; templates/classes = notion_cache/classes)
- **Gatilhos:**
  - Saúde: "Ao reduzir a 0 ou menos, você recebe a condição Morrendo".
  - Stamina: "Ao reduzir a 0, fica Exaurido".
  - Éter: "Ao reduzir a 0 ou menos fica Oco".
- **Máximos, iguais nas 7 classes:**
  - Saúde `10 + (V × Nível) + (Mod.CON × Nível)`.
  - Stamina `8 + (G × Nível) + (Mod.FOR OU Mod.DES × Nível)`.
  - Éter `6 + (R × Nível) + (Mod.INT OU Mod.SAB × Nível)`.
- **V/G/R por classe:** Espadachim 6/6/3 · Batedor 4/7/4 · Brutalista 8/4/3 · Teurgo 3/3/9 · Monge 5/5/5 · Alquimista 4/6/5 · Artilheiro 4/7/4.
- **Bônus fixos no máximo:**
  - Gruto Rokhan "+10 Saúde máxima"; Skal'ri "+5 Éter máximo".
  - Corrupção: Difusão de Éter −10 Éter máx; Sangue Morto +5 Éter/+5 Stamina máx; Vigor Místico +5 Saúde por nível (templates/racas/corrompido).
  - Origem Andarilho "+10 Stamina Máxima"; Escravo "+1 Vitalidade" (data/origens.json).
- **Bônus rolados ou percentuais (data/limiar.json):**
  - Reservas Profundas +2d6+8 Stamina máx.
  - Poço Arcano +2d6+8 Éter máx.
  - Sangue Espesso +2d10+5 Saúde máx.
  - Pulmões Titânicos +3d12+8 Saúde máx.
  - Sacrifício Vivo "50% menos de Saúde e Éter máximos".
  - Exigente −1 Stamina e Éter máx ao falhar criticamente.
  - Dom da Ressurreição −10 Saúde ou Stamina máx.
- **Reduções permanentes vindas de magia (magias.json nível 5, Trade-off):**
  - Armadura de Kha −8 Éter máx.
  - Cometa do Mártir: Exausto 3 e −1d6 Éter máx.
  - Vytália −1/−2/−3.
  - Selo do Oblívio −2 no atributo principal.
  - Aprendiz Caótico: Éter máx partido ao meio.
- **Temporários:** aparecem só como efeito, sem regra geral (Elixir de Resistência +5 Saúde temporária por 10 min; Monge/Alquimista +20 Saúde/+10 Stamina temporária; companheiros com 20/25/35 de Saúde temporária).

### 2. Recursos de classe (templates/classes/*.template.html)
- **Monge, Fluxo.** Máx 5.
  - Começa todo combate com 0.
  - Ganha +1 em: acerto corpo a corpo (máx 2x/rodada), esquivar ou bloquear (1x/rodada), aplicar condição, mover-se (1x/rodada).
  - "o custo em técnicas é apenas requisito, não é gasto".
  - Perda: "Ao fim do combate, se passar 1 rodada sem ganhar Fluxo ou receber dano, você perde todo seu Fluxo".
- **Batedor, Instinto.** Máx 5.
  - Começa a cena com 0.
  - Ganha +1 em: sucesso em perícia (máx 2x/rodada e 1x por perícia por cena), acerto (1x/rodada), esquiva (1x/rodada).
  - Zera com: dano maior que metade da vida máx; Atordoado, Desorientado ou Desprevenido; falhar perícia; 10 min sem ganhar.
  - Gastos: Pressentimento X, Sexto Sentido 2, Segundo Fôlego 3, Golpe Instinto 4, Instinto Reativo 5.
- **Brutalista, Brutalidade.** Máx 5.
  - +1 ao receber 5+ de dano de uma fonte.
  - +1 de dano por ponto.
  - Gastar tudo recupera xd4 Stamina.
  - Perde tudo no fim do combate.
- **Artilheiro, Concentração.** Máx `3 + Mod. Sabedoria`.
  - Começa o combate com 0 e soma sempre ao ataque.
  - Ganha: acertar +1, crítico +2, mirar +2, ficar parado +1.
  - Perde: receber dano −1, mover −1, falhar resistência −2, aliado cair Morrendo −3.
- **Alquimista, Reagentes.** Máx `(Nível × 3) + Mod.Inteligência`.
  - Descanso longo recupera todos.
  - Descanso curto: "Buscar Reagentes: 1d4+Nível".
- **Espadachim:** Marca do Duelo, um estado com 1 alvo (+1/+1, no nível 3 +2/+2, no nível 5 +3/+3).
- **Teurgo:** sem contador (só Éter e Escolas).

### 3. Derivados
- **Evasão Passiva:** "10 + Mod. Destreza", igual nas 7 classes. A Ativa tem três redações (ver contradições).
- **Modificadores de Evasão:**
  - Dryad variante +1 e Autômato Fibra de Carbono +1.
  - Limiar: Sombra Dançante +1 Evasão e +1 nível em Defender.
  - Abismo: Esquiva Lendária +5 e +1 Reação Máx; Óbvio −5.
  - Monge Evasivo +Fluxo; Batedor Sexto Sentido +2 no turno.
  - Condições: Atordoado e Enjoado −2.
- **CD por classe (templates):**
  - Espadachim "10 + (Destreza ou Força) + Constituição".
  - Batedor e Monge "10 + Mod. Destreza + Mod. Sabedoria".
  - Brutalista "10 + Força + Constituição".
  - Teurgo "10 + Mod. Inteligência + Mod. Sabedoria".
  - Alquimista "10 + Mod. Inteligência + Mod. Destreza".
  - Artilheiro "10 + Des + Sab".
  - Limiar: Contra-Mágica Instintiva +1; Estudo Intenso +2.
- **Movimento base por raça:** Anão 7,5 m; Humano, Autômato, Corrompido e Gruto 9 m; Dryad 10,5 m; Inseto: Besouro 7,5, Louva-a-Deus 9, Barata 10,5.
- **Modificadores de Movimento:**
  - Raça: Skal'ri +1,5 m; Suspensões Lubrificadas +3 m; Passo Trêmulo −3 m.
  - Limiar: Pernas Incansáveis +3 m (Acelerar +1,5 m); Passos do Vento +3 m.
  - Abismo: Sem Membro −50%.
  - Monge Explosão: dobra.
- **Ar e Ae:**
  - Ar: "Reduz dano ordinário em uma constante fixa".
  - Ae: "Ae(Tipo de dano, Quant. de resist.)".
  - Ar natural: Anão (variante) 3; Dryad 2 (+1 na variante); Rokhan 1; Besouro 2 e Ae(3) num tipo.
- **Iniciativa:** é perícia, `1d20+Destreza` + proficiência.

### 4. Perícias e testes (sistema.json `pericias`, `proficiencia`, `criticos`)
- **Proficiência:** "+0 Leigo → +2 Treinado → +4 Experiente → +6 Mestre → +8 Lendário". Duas fontes de "Treinado" fazem Experiente.
- **Defender escala o dado:** 1d6/1d8/1d10/1d12/2d8.
- **Atributo por perícia:**
  - Atacar e Movimento "(Força ou Destreza)".
  - Fortitude CON.
  - Vontade, Percepção, Sobrevivência, Religião e Intuição: SAB.
  - Reflexos, Furtividade, Crime e Iniciativa: DES.
  - Conhecimento, Medicina, Investigação, Místico, Ofício(Engenharia) e Ofício(Ferraria): INT.
  - Convencimento e Enganação "Des ou Int"; Intimidação "Con ou For"; Motivar SAB.
- **Crítico e falha:** crítico no 20 (a Margem de Ameaça pode ampliar); falha crítica no 1. Fabricação usa margem de ±10 sobre a CD.
- **Vantagem:** a única definição é uma carta do Limiar ("2d20 simultaneamente e você escolhe").

### 5. Turno (sistema.json `sua-rodada`, `atacando`, `armas`)
- "3 ações e 1 reação por turno". Mover (1 ação) máx 1x/turno. Acelerar +3 m. Ataques consecutivos −5 cada.
- Defender (1 ação): "+2 Defender até seu próximo turno".
- A reação fica gasta até o início do próximo turno. O ataque de oportunidade gasta a reação.
- **Custo de ataque por arma:** Leve Atacar(1), Pesada (2), Pesada Brutal (3).
- **Efeitos de arma com Stamina:** Dilacerar 2, Alcançar 2, Desorientar 2, Executar 3. Nas Marciais, "1x/Turno não custa Stamina".
- **Munição:** "1 munição … pelo combate inteiro", "descontada por cena".

### 6. Magia (sistema.json `custo-base`, `intensidade`, `modulacoes`; magias.json)
- **Custo base:** 0/2/4/6/8 Éter. O Nível 5 exige Foco Primordial.
- **Intensidade:**
  - Contida "-2 Éter (mín. 1)", Forçada +2, Transbordante +4.
  - Transbordante: "Vontade CD 15 ou falha no cast e perde o dobro de éter utilizado".
  - CD por intensidade: −2/base/+2/+4. Dano e cura por intensidade: −1/base/+1/+2 dados.
- **Modulações por escola:**
  - Destruição: +3/+3/+3/+5.
  - Abjuração: +2/+4/+3/+5; Acelerar reduz o custo de ação.
  - Alteração: +2/+3/+3/+5.
  - Conhecimento: +1/+2/+2/+3.
  - O campo existe só nas 20 magias de nível 1.
- **Ação de cada magia:** fica em `stats[Ação]`. Contagem: 1 Ação 34, 2 Ações 26, 3 Ações 22, Reação 6.
- **Sustentada:** "pague o mesmo éter do custo da conjuração da magia todo turno" (Sinapsia Coletiva).

### 7. Técnicas e usos
- O custo é texto em 5 marcações HTML diferentes nos `data/classes/*.json` (ex.: "Reação • 3 Stamina, 3 Conc.", "3 Ações, 3 Éter + 4 Reagentes", "Passiva, 3 Ações, 50% Éter").
- Ultimates: "1x/Dia". As técnicas gerais somam "3 + Nível" e podem ser reatribuídas no descanso longo.
- **Recargas que aparecem no conteúdo:** turno, rodada, combate, cena, descanso curto, descanso longo, dia, sessão, semana, campanha e "por localização".

### 8. Descanso e sobrevivência (sistema.json `descanso`, `necessidades`, `estresse`, `fe-sanidade`)
- **Descanso Longo** (máx 1 por dia, 8 h): "recupera Xd8 de 2 Status a escolha", com X de 1 (Precário) a 5 (Luxuoso).
  - Ao ar livre, a comodidade vem da Sobrevivência: <15, 15-19, 20-24, 25-29, 30≥.
  - Exige luz e alimento: "Quem não se alimenta, não se recupera".
- **Descanso Curto** (máx 2 por dia, 30 min): "2d6 de 2 Status".
  - Ações: Tratar Ferimentos (Medicina CD 15) +1d6 Saúde; Meditar (Vontade CD 15) +1d6 Éter; Relaxar +1d6 Stamina; Comer Refeição +2d6 de qualquer status.
- **Estresse:** atacar aliado dá +1 aos dois. O curto libera 1, o longo libera tudo. Cada ponto removido custa "1d6 de Stamina e Éter".
- **Necessidades:** Desnutrido +1 por noite sem comer (−10 Saúde máx por nível). O segundo dia sem descansar dá Exaustão 1.
- **Fé e Sanidade:** ver um aliado morrer pede Vontade CD 20, senão perde 2d6+3 Éter.

### 9. Dano (sistema.json `dano-defesa`, `tipos-dano`)
- "Dano = Dano da arma + Mod. Atributo"; o crítico rola o dobro de dados.
- Atributo do dano: Pesado usa FOR; Leve e Distância usam DES; Místicas usam INT/SAB.
- Resistência reduz à metade; Vulnerabilidade dobra.
- Tipos de dano em 4 grupos: Ordinário, Elemental, Biológico, Místico. A ficha tem 12 tipos.

### 10. Condições (data/condicoes.json = notion_cache/condicoes.new.md)
- **29 cards:**
  - Críticas: Morrendo, Inconsciente, Exaurido, Oco, Exaustão 1-5, Desnutrido X.
  - Combate: Exposto, Sangramento X, Atordoado, Desorientado, Caído, Desprevenido.
  - Movimento: Sobrepeso Leve, Sobrepeso Extremo, Lento X, Enraizado.
  - Mentais: Confuso, Amedrontado, Descontrolado X, Enfeitiçado, Bêbado.
  - Físicas: Envenenamento, Em Chamas, Enjoado, Paralisado, Adormecido.
  - Sensoriais: Cego, Surdo, Invisível.
- **Efeitos numéricos que já estão escritos:**
  - Movimento: Sobrepeso Leve ×½; Sobrepeso Extremo =1,5 m; Lento −3 m; Caído =1,5 m; Enraizado 0; Exaustão 3 ×½; Exaustão 4 = 0.
  - Ações: Atordoado −2; Lento −1; Confuso −1; Paralisado sem ação nem reação.
  - Perícias: Bêbado −2 em Atacar, Defender, Movimento, Reflexos, Fortitude e Vontade; Desorientado −2 Atacar e −2 Defender; Enjoado −5 Fortitude e −2 Evasão; Cego −5 Percepção; Surdo −2 Percepção; Envenenamento e Sobrepeso Leve −2 nas perícias de FOR/DES/CON.
  - Morrendo: "Dano/Rodada = Vida Máxima × 0.1"; morte ao passar de −½ da Saúde máx; estabilizar com 2 ações, Medicina CD 20.
  - Oco: −5 Éter a cada perícia falha; perde o personagem ao chegar a −½ do Éter máx.
- **Imunidades fixas:** Anão, Gruto e Inseto a Envenenamento; Autômato a Sangramento, Envenenamento e doenças; Batedor Atento a Desprevenido; Monge a Enfeitiçado e Amedrontado.

### 11. Progressão (sistema.json `xp-dc`, `progressao-jogador`; notion_cache/limiar.new.md)
- **XP para subir:** 2→150, 3→400, 4→1000, 5→2000.
- **Por nível:**
  - Técnicas "3 + Nível".
  - Tier 1 no nível 2, Tier 2 no 4, Tier 3 no 5.
  - Marcas: 1, 2 e 3 nos níveis 3, 4 e 5.
  - +4 Pontos do Limiar por nível (2–5).
- **Custo das cartas do Limiar:** a 1ª é grátis e as seguintes custam 2, 3, 4…; a 6ª (+2 Atributo) custa sempre 2.
- **Corrupção máxima por nível:** 1:2, 2:5, 3:9, 4:14, 5:20.

## 3. Contradições entre fontes — arbitrar

- **C01.** EVASÃO ATIVA / REAÇÃO DEFENDER: há 3 redações. (1) templates/classes/*.template.html: 'Evasão Ativa 10 + Mod.Des + Prof.Defender'; notion_cache/classes: '10 + Mod. Destreza + Treinamento em Defender'. (2) notion_cache/sistema.new.md ## Defesa / Sua Rodada (2026-09-22 21:55): 'Soma o dado da perícia Defender à sua evasão contra todos os ataques do agressor nesta rodada'. (3) data/sistema.json combate/sua-rodada: 'Soma 1d10+mod. Destreza a sua evasão'. O sistema.json é mais antigo (commit 19:14) e parece ser sync pendente.
- **C02.** 'Prof.Defender' como número × Defender como escala de DADO (sistema.json proficiencia: Leigo 1d6 … Lendário 2d8). Na ficha física do Notion (criacao/ficha.new.md), Defender aparece '(Des/Con)' com caixas +2/+4/+6/+8.
- **C03.** Atributo de perícia na ficha física do Notion × sistema.json: Atacar '(For)' × 'Força ou Destreza'; Intimidação '(For/Sab)' × 'Con ou For'.
- **C04.** Religião: SAB em data/sistema.json pericias × INT em js/ficha.js (PERICIAS) e data/ficha.schema.json (x-attr 'int').
- **C05.** Níveis de magia: 5 níveis, custo 0/2/4/6/8 (sistema.json custo-base, magias.json, CLAUDE.md §2) × 4 níveis, custo '2/4/6/8' (data/ficha.schema.json $defs.magia e grimorio nivel1..4) e 'nível 1–4' no layout físico do CLAUDE.md §5.
- **C06.** Intensidade Contida: sistema.json '-2 Éter (mín. 1)' × Notion '-2 Éter', sem mínimo. Com a base 0 no Nível 1, o 'mín. 1' deixa a Contida mais cara que a Normal.
- **C07.** Custo de ação para conjurar: sistema.json 'Conjurar magia simples (1 ação) / complexa (2-3 ações)' × Notion 'Conjurar magia (1-3 ações)'.
- **C08.** Trechos do Notion Sistema que faltam em data/sistema.json: 'Pular (2 Ações) → Pula 1/3 do seu Movimento', 'Você não pode retaliar à distância', definição de Evasão Passiva/Ativa, e ataque de magia pela perícia Místico.
- **C09.** Tabela de falha da Jornada: sistema.json 2d6/1d8/1d6/1d4/1d3 × Notion 4d6/2d8/2d6/1d6/1d4 (sistema.base.md = sistema.new.md).
- **C10.** Munição: '20 unidades = 1 slot' (CLAUDE.md §2) × 10:1 (CSV do Bazar; js/ficha.js marca REGRAS.PILHA=10 como 'pendente: munição'). Também: '1 munição … pelo combate inteiro' × 'descontada por cena' (sistema.json municao).
- **C11.** Perícias: 24 no CLAUDE.md §2 × 22 no schema e na ficha (Ofício(X) genérico). Ofício(Alquimia) não está na tabela de perícias do sistema.json, e Ofício(Ferraria) é descrito como 'fabricar uma Bugiganga', igual ao de Engenharia.
- **C12.** CD de classe, 'Mod.' × atributo cheio: Brutalista '10 + Força + Constituição' e Espadachim '10 + (Destreza ou Força) + Constituição' (sem 'Mod.'); Artilheiro no template '10 + Des + Sab' × Notion '10 + Mod. Destreza + Mod. Sabedoria'.
- **C13.** Modificador de atributo: a única fonte é o CLAUDE.md ('(Atributo − 10) / 2'), sem regra de arredondamento. Não está em sistema.json nem no Notion Sistema. A ficha usa floor.
- **C14.** Limite de morte: Morrendo 'ao ULTRAPASSAR metade da sua vida máxima em negativos' × Oco 'Ao ALCANÇAR metade do seu éter máximo nos negativos'.
- **C15.** Concentração do Artilheiro: máximo '3 + Mod. Sabedoria' × técnicas que pedem 5 Conc. (Foco Absoluto, Tiro de Reflexo) e 6+ (Paciência Inabalável). O custo aparece como requisito em uma e como 'ponto de Concentração gasto' em Tiro na Cabeça.
- **C16.** Nomes de condição: 'Embriagado' (Limiar) × 'Bêbado' (catálogo); 'Exausto 1/3' (cartas e magias) × 'Exaustão'; 'Envenenado' × 'Envenenamento'. 'Marcada à Morte X', 'Agarrado' e 'Marcado' são usadas no conteúdo e não existem em data/condicoes.json.
- **C17.** Categorias de condição: o site agrupa em críticas/combate/movimento/mentais/físicas/sensoriais; o Notion não categoriza; o Limiar define 'condições físicas' = Embriagado, Sangramento, Lento, Atordoado, Paralisado, Desorientado, Enjoado, Envenenamento (lista diferente da do site).
- **C18.** Tipos de dano: condições e magias causam dano por categoria ('dano Biológico', '1d12 Místico', 'Ae(Místico, 2)') × grade de 12 tipos da ficha, sem 'Biológico' nem 'Místico'. A ficha física do Notion usa 'Gelo' onde o sistema usa 'Frio'.
- **C19.** Sintaxe de Ae: sistema 'Ae(Tipo de dano, Quant. de resist.)' × Carne de Pedra 'Ae(5, todos)' (ordem invertida).
- **C20.** Fluxo do Monge: 'Ao fim do combate, se passar 1 rodada sem ganhar Fluxo ou receber dano, você perde todo seu Fluxo' admite duas leituras (um reset ou dois gatilhos).
- **C21.** Estrutura do schema × código (decisão do site, sem regra): tecnicas/grimorio são objetos no schema e arrays no código; 'derivados' × 'derivadosManuais'; resistencias com additionalProperties:false sem 'ae', embora o código grave ae. Fica só para ciência: a arbitragem é do agente de HTML.

## 4. Perguntas

### Recursos

**P01.** Confirme a leitura dos multiplicadores V/G/R (Espadachim 6/6/3, Batedor 4/7/4, Brutalista 8/4/3, Teurgo 3/3/9, Monge 5/5/5, Alquimista 4/6/5, Artilheiro 4/7/4). As bases 10/8/6 valem para todas as classes, sem exceção?

- *Para quê:* A ficha passa a calcular Saúde, Stamina e Éter máximos a partir da classe e do nível, em vez do jogador digitar.
- *Formato da resposta:* Tabela classe × {V, G, R} e as bases {saude:10, stamina:8, eter:6}; 'ok' se estiver certo.

**P02.** Em 'Mod.FOR OU Mod.DES' (Stamina) e 'Mod.INT OU Mod.SAB' (Éter), vale sempre o maior, uma escolha que o jogador faz na criação e mantém, ou outra regra?

- *Para quê:* Define se a ficha escolhe sozinha ou mostra um seletor fixo por personagem.
- *Formato da resposta:* enum: 'maior' | 'escolhaFixa' | 'outra (descrever)'

**P03.** Qual é a ordem de aplicação no MÁXIMO quando há várias fontes: base da classe, bônus fixo de raça ou origem (+10 Saúde, +5 Éter, Andarilho +10 Stamina), bônus rolado do Limiar (+2d6+8…), percentual (Sacrifício Vivo −50%), redução permanente (Armadura de Kha −8, Vytália, Exigente −1), condição (Desnutrido −10×X; Exaustão 4 com atributos pela metade)? Como arredonda?

- *Para quê:* A ficha precisa de um pipeline determinístico para recalcular o máximo sempre que algo muda.
- *Formato da resposta:* Lista ordenada de etapas + regra de arredondamento (floor/ceil/round) por etapa.

**P04.** Bônus rolados de máximo (Reservas Profundas, Poço Arcano, Sangue Espesso, Pulmões Titânicos, Cometa −1d6): rolam uma vez e o valor fica fixo, ou rolam de novo ao subir de nível?

- *Para quê:* A ficha precisa guardar o valor rolado de cada fonte, e não só a fórmula.
- *Formato da resposta:* enum por fonte: 'rolaUmaVez' | 'rolaPorNivel' | 'valorFixo(n)'

**P05.** Origem Escravo '+1 Vitalidade': soma 1 ao multiplicador V (+1 Saúde por nível) ou é +1 fixo? Corrupção Vigor Místico '+5 Saúde por nível' entra como +5×Nível no máximo?

- *Para quê:* Muda a fórmula do máximo de Saúde para quem tem essas fontes.
- *Formato da resposta:* Fórmula na linguagem do contrato (ex.: 'V+1' ou '+1').

**P06.** Quando o MÁXIMO cai (Desnutrido, Exaustão 4, trade-off), o valor ATUAL é cortado até o novo máximo? Quando o máximo sobe (subir de nível, carta nova), o atual sobe junto pela diferença, vai ao máximo ou fica como está?

- *Para quê:* Define o comportamento automático da barra ao recalcular.
- *Formato da resposta:* { aoReduzirMax: 'corta'|'mantem', aoAumentarMax: 'somaDiferenca'|'enche'|'mantem' }

**P07.** Limite inferior por recurso: a Saúde vai até −½ do máximo (morte) e o Éter até −½ do máximo (perde o personagem). A Stamina pode ficar negativa? Gastar Stamina ou Éter sem saldo é proibido, permitido até o negativo, ou só permitido para o Éter?

- *Para quê:* A ficha vai travar ou permitir os botões de gasto e decidir quando dispara Oco e Exaurido.
- *Formato da resposta:* Tabela recurso × {min (fórmula ou 0), gastoSemSaldo: 'proibido'|'permitido'}

**P08.** Saúde e Stamina TEMPORÁRIAS (Elixir de Resistência, Monge e Alquimista, companheiros): são consumidas antes do valor normal? Várias fontes somam ou vale a maior? Expiram no fim da duração, no fim do combate ou no descanso? Existe Éter temporário?

- *Para quê:* A ficha teria um campo 'temporário' por recurso, com regra de consumo e expiração.
- *Formato da resposta:* { recursos:[...], consumidoAntes:bool, acumula:'soma'|'maior', expira:[eventos] }

**P09.** Cura e recuperação (descanso, poção, magia) podem passar do máximo? Nos itens de cura com '+Int' (Poção de Cura Menor 2d4+Int, Kit de Trauma 2d6+Int), o Int é de quem usa ou de quem recebe?

- *Para quê:* Define o teto no botão de curar e qual modificador a ficha soma ao usar o consumível.
- *Formato da resposta:* { curaPassaMax: bool, atributoCuraItem: 'usuario'|'alvo' }

### Recurso de classe

**P10.** Confirme a tabela: Monge Fluxo máx 5; Batedor Instinto máx 5; Brutalista Brutalidade máx 5; Artilheiro Concentração máx 3+Mod.SAB; Alquimista Reagentes máx (Nível×3)+Mod.INT; Espadachim só o estado Marca do Duelo (1 alvo); Teurgo sem contador. Existe outro contador por classe que a ficha deva rastrear (venenos do Cobra, 2 por curto e 5 por longo; companheiros com Saúde própria; estoque oculto do Alquimista '(Nível * 3) + (2 * Mod. Inteligência)')?

- *Para quê:* Substitui o slot genérico recursoClasse{nome,atual,max} por contadores tipados por classe.
- *Formato da resposta:* Objeto por classe no bloco 'classes.<id>.recursos[]' do contrato.

**P11.** Para cada contador: o custo que aparece nas técnicas é GASTO ou só REQUISITO? (O Monge diz que é requisito. A Concentração do Artilheiro tem 'ponto de Concentração gasto' em Tiro na Cabeça, e Foco Absoluto e Tiro de Reflexo pedem 5 Conc., acima do máximo 3+Mod.SAB de quem tem SAB baixa.)

- *Para quê:* O botão 'usar técnica' desconta o recurso ou só confere se o valor atual basta.
- *Formato da resposta:* enum por recurso: 'gasto' | 'requisito'; + nota sobre técnicas acima do máximo.

**P12.** Fluxo: 'Ao fim do combate, se passar 1 rodada sem ganhar Fluxo ou receber dano, você perde todo seu Fluxo' é uma regra (zera no fim do combate) ou são duas (zera no fim do combate E zera após 1 rodada sem ganhar ou sem receber dano)?

- *Para quê:* Define o reset automático do Fluxo por evento 'nova rodada' ou 'fim de combate'.
- *Formato da resposta:* Lista de eventos de reset: ['fimCombate'] ou ['fimCombate','rodadaSemGanho'].

**P13.** Os ganhos com limite (Fluxo acerto 2x/rodada; Instinto perícia 2x/rodada e 1x/perícia/cena) devem ser contados pela ficha, ou basta um botão +1/−1 livre?

- *Para quê:* Contar limites exige rastrear rodada e cena; um botão livre é mais simples na mesa.
- *Formato da resposta:* enum: 'contarLimites' | 'botaoLivre'

### Derivados

**P14.** Evasão Ativa: é um número fixo ('10 + Mod.Des + Prof.Defender', como na página da classe) ou é a Passiva + a ROLAGEM do dado de Defender (1d6–2d8) gasta como reação (Notion Sistema)? Se for fixa, que número 'Prof.Defender' soma, já que Defender escala dado e não bônus?

- *Para quê:* A ficha mostra a Evasão Ativa como número ou como 'Passiva + dado', e se o dado soma Mod.DES.
- *Formato da resposta:* Fórmula única na linguagem do contrato + id do bloco do Notion que a registra.

**P15.** Ação Defender (1 ação) '+2 Defender até seu próximo turno': o +2 soma ao resultado do dado de Defender, sobe um passo do dado ou soma direto na Evasão? Acumula se usada 2x no mesmo turno?

- *Para quê:* Vira um modificador temporário com duração 'até o próximo turno'.
- *Formato da resposta:* { alvo:'evasao'|'dadoDefender'|'passoDado', valor, acumula:bool }

**P16.** CD de classe: quando a fórmula não diz 'Mod.' (Brutalista '10 + Força + Constituição', Espadachim '10 + (Destreza ou Força) + Constituição', Artilheiro '10 + Des + Sab'), é sempre o modificador? No Espadachim, 'Destreza ou Força' é o maior ou uma escolha fixa? A CD de classe é a mesma usada em magias ('contra sua CD') e técnicas?

- *Para quê:* A ficha passa a calcular a CD sozinha e aplicar Contra-Mágica Instintiva +1 e Estudo Intenso +2.
- *Formato da resposta:* Tabela classe → fórmula; enum de escolha; bool 'cdUnica'.

**P17.** O modificador de atributo é floor((Atributo − 10)/2) também para valores abaixo de 10 (9 → −1)? Hoje a única fonte disso é o CLAUDE.md, que não é canônico.

- *Para quê:* Tudo o que é derivado depende disso; precisamos de uma fonte no Notion.
- *Formato da resposta:* Fórmula + referência do bloco no Notion.

**P18.** Movimento: com vários modificadores ao mesmo tempo (+3 m fixos, −3 m do Lento, ×½ de Sobrepeso Leve, Exaustão 3 e Sem Membro, ×2 da Explosão do Monge, '=1,5 m' de Caído e Sobrepeso Extremo, '=0' de Enraizado e Exaustão 4), qual é a ordem? Valor fixo vence tudo? Arredonda para múltiplo de 1,5 m? Tem piso 0?

- *Para quê:* A ficha calcula o Movimento efetivo com as condições ativas.
- *Formato da resposta:* Ordem de operações: ['somas','multiplicacoes','fixos','piso'] + regra de arredondamento.

**P19.** Armadura: de onde vem o valor de Ar de cada armadura (o CSV do Bazar não tem coluna de Ar)? O Ar natural de raça (Anão 3, Dryad 2(+1), Rokhan 1, Besouro 2) acumula com o Ar da armadura equipada? Tem teto? Ae do mesmo tipo vinda de fontes diferentes soma? Alguma armadura ou escudo mexe na Evasão?

- *Para quê:* A ficha calcularia Ar e Ae a partir do equipado e da raça, em vez de campo livre.
- *Formato da resposta:* { fonteArItem: 'coluna X do CSV'|..., acumula:'soma'|'maior', teto:n|null, aeMesmoTipo:'soma'|'maior', evasaoPorItem:[...] }

### Perícias e testes

**P20.** Para Atacar e Movimento '(Força ou Destreza)', Convencimento e Enganação 'Des ou Int' e Intimidação 'Con ou For': o jogador escolhe a cada teste, usa sempre o maior, ou depende da arma (Atacar)? E Religião é SAB (sistema.json) ou INT (ficha e schema)?

- *Para quê:* A ficha vai mostrar o total pronto de cada perícia (d20 + mod + prof).
- *Formato da resposta:* Tabela perícia → {atributos:[...], modo:'maior'|'porTeste'|'porArma'}

**P21.** Ofício(Alquimia) é '1d20+Inteligência' como Engenharia e Ferraria? (Ela não está na tabela de perícias do sistema.json, e Ferraria aparece descrita como 'fabricar uma Bugiganga', igual à Engenharia.)

- *Para quê:* A ficha passa a ter 24 perícias.
- *Formato da resposta:* Linha da tabela de perícias para as 3 de Ofício (nome, dado+atributo, descrição curta).

**P22.** Tags canônicas por perícia: quais contam como 'física' (atributo base FOR/DES/CON: Sobrepeso, Envenenamento, Exaustão 1, Desnutrido), quais como 'interação social' (Enfeitiçado −5) e quais como 'teste de resistência' (Reflexos, Fortitude e Vontade? Inconsciente e Paralisado 'fracassam instantaneamente')?

- *Para quê:* As penalidades de condição passam a ser aplicadas por tag, e não perícia a perícia.
- *Formato da resposta:* Tabela perícia → tags ['fisica','social','resistencia']

**P23.** A proficiência deve ser calculada pela ficha a partir das fontes (classe, raça, origem, cartas, com 2x Treinado = Experiente), ou continua um select manual? Se for calculada, vocês conseguem entregar a lista de concessões por fonte?

- *Para quê:* Automatizar exige dado estruturado de 'quem concede o quê'.
- *Formato da resposta:* enum 'manual'|'calculada'; se calculada: lista {fonteId, pericia, passos:+1}

**P24.** Vantagem e desvantagem, regra geral: desvantagem = 2d20 e fica com o menor? As duas se cancelam? Duas fontes de desvantagem acumulam? Com vantagem, basta um 20 para o crítico? Vale para o dado de Defender?

- *Para quê:* Seis condições aplicam desvantagem e um rolador precisa da regra.
- *Formato da resposta:* { vantagem:'2d20 maior', desvantagem:'2d20 menor', cancelam:bool, acumulam:bool, criticoComUm20:bool, aplicaDefender:bool }

**P25.** Em testes que não são ataque, o 20 natural é sucesso automático e o 1 natural é falha automática? A Margem de Ameaça e o multiplicador de crítico ficam por arma (padrão 20 e x2)? O crítico dobra só os dados da arma ou também os extras (Sangramento +1d4, dados de técnica)?

- *Para quê:* Define o que o rolador e a linha de ataque da ficha exibem.
- *Formato da resposta:* { natural20Pericia:'sucesso'|'nada', natural1Pericia:'falha'|'nada', margemPorArma:bool, criticoDobra:'dadosArma'|'todosDados' }

### Condições

**P26.** Empilhamento: penalidades de condições diferentes no mesmo alvo somam (Bêbado −2 Atacar + Desorientado −2 Atacar = −4)? A mesma condição reaplicada renova, soma X ou é ignorada?

- *Para quê:* É o ponto que mais trava o rastreador automático.
- *Formato da resposta:* { entreCondicoes:'soma'|'maior', mesmaCondicao:'renova'|'somaX'|'ignora' }

**P27.** O que é o X em cada condição X: em Lento X, o X não aparece no efeito ('-3 m Movimento -1 Ação'): é duração, intensidade (X × −3 m) ou pilha? Sangramento X: o +1d4 escala com X, e aplicado sem número começa em quanto? Desnutrido X: começa em 1, como diminui, e 'Ao chegar a 0 você morre' é a Saúde máxima chegando a 0? Descontrolado X = rodadas.

- *Para quê:* Cada condição com X vira um contador com semântica própria.
- *Formato da resposta:* Tabela condição → {x:'duracao'|'intensidade'|'pilha', inicial, decrementa:evento, efeitoPorX}

**P28.** Exaustão 1–5: os níveis são cumulativos (Exaustão 3 inclui os efeitos de 1 e 2)? Exaustão 4 'Atributos reduzidos pela metade' divide o atributo (e recalcula mods, máximos, CD e Evasão) ou divide o modificador? Arredonda como? E a 'metade do dano total' da Exaustão 2?

- *Para quê:* A Exaustão 4 mexe em todos os derivados de uma vez.
- *Formato da resposta:* { cumulativa:bool, metadeAtributo:'atributo'|'mod', arred:'floor'|'ceil', recalculaMax:bool }

**P29.** Atordoado '-2 Ações e Evasão': é −2 Ações e −2 Evasão, ou −2 Ações e perde a Evasão? 'Até a próxima rodada' e 'até o fim do seu turno' terminam em relação a quem (o afetado ou a rodada)?

- *Para quê:* Define o valor e o ponto de expiração no contador de rodadas.
- *Formato da resposta:* Efeitos estruturados [{alvo, op, valor}] + duracao {ate:'inicioProxTurnoAfetado'|...}

**P30.** Duração padrão das condições que não trazem fim no texto (Inconsciente, Enraizado, Enjoado, Lento, Amedrontado, Enfeitiçado, Bêbado, Paralisado, Cego, Surdo): vem sempre da fonte (magia ou técnica), ou existe um padrão?

- *Para quê:* Define se a ficha pede a duração ao aplicar ou usa um valor padrão.
- *Formato da resposta:* Tabela condição → duracaoPadrao | 'daFonte'

**P31.** Implicações (Morrendo ⇒ Inconsciente; Desprevenido e Paralisado ⇒ Exposto; Adormecido ⇒ Exposto + Inconsciente): a ficha liga as implícitas como condições separadas (Exposto some ao ser acertado mesmo com Paralisado ativo?) ou só como efeito enquanto a principal durar?

- *Para quê:* Muda o modelo de dados do rastreador.
- *Formato da resposta:* enum 'separadas' | 'derivadas', com exceções listadas.

**P32.** Fim de Exaurido e de Oco: Exaurido 'encerra ao realizar qualquer tipo de descanso' mesmo que o jogador não escolha recuperar Stamina e ela continue 0? Oco termina quando o Éter fica > 0? Morrendo 'ultrapassar metade' (<) e Oco 'alcançar metade' (≤): a diferença é intencional?

- *Para quê:* Gatilhos automáticos de entrada e saída das condições críticas.
- *Formato da resposta:* Tabela condição → {entra: expressão, sai: expressão|evento}

**P33.** Lista fechada de condições do rastreador: entram Agarrado, Marcado ('+2 Atacar contra ele'), 'Marcada à Morte X', Terreno Difícil, Vulnerável e Dissipado, que aparecem no conteúdo mas não no catálogo? 'Embriagado' = Bêbado, 'Exausto N' = Exaustão N, 'Envenenado' = Envenenamento?

- *Para quê:* A ficha liga efeitos a condições por id; nome divergente quebra o vínculo.
- *Formato da resposta:* Lista {id, nome, aliases[]} + as condições novas, que precisam ir para o Notion antes.

**P34.** Categorias canônicas de condição para imunidades: o site agrupa em críticas, combate, movimento, mentais, físicas e sensoriais; o Limiar define 'condições físicas' = Embriagado, Sangramento, Lento, Atordoado, Paralisado, Desorientado, Enjoado, Envenenamento; o Teurgo e o Veterano citam 'condições mentais' sem lista. Qual taxonomia vale?

- *Para quê:* Imunidades por categoria (cartas, técnicas) bloqueiam a aplicação automaticamente.
- *Formato da resposta:* Tabela condição → tags ['fisica','mental','emocional',...]

**P35.** Desnutrido 'Você gasta o dobro de Stamina para tudo': a ficha deve dobrar automaticamente o custo das técnicas e ações com Stamina enquanto a condição estiver ativa?

- *Para quê:* É um multiplicador global de custo, igual ao da Mente Fraca (+100% Éter).
- *Formato da resposta:* bool + lista de outros multiplicadores globais de custo e sua ordem.

### Ações e turno

**P36.** Ação Livre tem limite por turno? A regra de '1 cast por turno' (que a magia Projétil 'ignora') é oficial? É por turno ou por rodada, e vale para Reação e Ação Livre? O '+1 Reação Máxima' (Esquiva Lendária) permite 2 reações no mesmo turno?

- *Para quê:* Define o contador de ações, reações e conjurações por turno.
- *Formato da resposta:* { acoes:3, reacoes:1, acaoLivreMax:n|null, conjuracoesPorTurno:n, escopo:'turno'|'rodada' }

**P37.** Munição: '1 munição … pelo combate inteiro' e 'descontada por cena'. A ficha desconta 1 ao iniciar cada combate? E a proporção de peso é 20 unidades = 1 slot (CLAUDE.md) ou 10:1 (CSV do Bazar)?

- *Para quê:* Botão 'Iniciar combate' e peso da munição no inventário.
- *Formato da resposta:* { descontoPor:'combate'|'cena', unidadesPorSlot:n }

### Magia

**P38.** Contida no Nível 1 (base 0) com '-2 Éter (mín. 1)' daria 1 Éter, mais caro que a Normal (0). Qual é o custo? E a Contida de Nível 2 custa 0 ou 1?

- *Para quê:* O botão 'conjurar' calcula o custo por nível e intensidade.
- *Formato da resposta:* Tabela nível × intensidade → custo.

**P39.** Ordem do custo final de Éter: base + intensidade + modulações, e depois Escola Visceral (−2, mín. 1), Patrono 'O Limiar' (−1 em abjuração), Mente Fraca (+100%), Desnutrido? O 'mín. 1' vale para o total ou para cada parcela? As magias de nível 2–5 aceitam todas as modulações da escola?

- *Para quê:* Cálculo automático do Éter gasto por conjuração.
- *Formato da resposta:* Lista ordenada de etapas + {minimoAplicaEm:'total'|'parcela'} + {modulacoesNiveis:[1..5]}

**P40.** Falha no Transbordante ('perde o dobro de éter utilizado'): o dobro inclui as modulações? Pode levar o Éter a negativo (e disparar Oco)?

- *Para quê:* Automatiza o desconto na falha do teste de Vontade CD 15.
- *Formato da resposta:* { base:'custoTotal'|'custoBase', podeNegativar:bool }

**P41.** Magia sustentada: o Éter por turno é o custo total pago (com intensidade e modulações) ou só o base? Só pode haver 1 sustentada ativa por personagem (Sinapsia: 'Conjurar outra magia sustentada … dissipa')? A regra vale para todas?

- *Para quê:* A ficha teria um 'efeito sustentado ativo' que cobra Éter a cada 'nova rodada'.
- *Formato da resposta:* { custoPorTurno:'total'|'base', maxAtivas:n, foraCombate:'a cada 30 min' }

**P42.** Confirme que o grimório tem 5 níveis (0/2/4/6/8, com Foco Primordial no 5), contra '1–4' e '2/4/6/8' do schema da ficha e do layout físico. A ficha deve conferir o requisito 'Treinado em Místico + Foco da escola' ao adicionar uma magia?

- *Para quê:* Estrutura do grimório e validação ao adicionar magia.
- *Formato da resposta:* { niveis:5, custos:[0,2,4,6,8], validarRequisito:'bloquear'|'avisar'|'nao' }

### Técnicas, cartas e usos

**P43.** Vocabulário de recarga: '1x/Dia' volta no descanso longo ou na virada do dia de jogo? 'Cena' e 'combate' são a mesma coisa? 'Rodada' e 'turno' são o mesmo para limites de uso? Como tratar 'sessão', 'semana', 'campanha' e 'por localização' (reset manual)?

- *Para quê:* Cada botão de evento (fim de combate, descanso, novo dia) zera os usos pelo enum.
- *Formato da resposta:* Enum de recargas + tabela recarga → evento que a zera.

**P44.** Vocês podem entregar, por id do site (ex.: 'monge-explosao', 'batedor-atento', 'limiar-estudo-intenso'), o custo e os usos estruturados de cada técnica, marca, ultimate, carta do Limiar (inclusive as raras, cujo efeito o data/limiar.json não guarda) e traço de raça ou origem com uso limitado?

- *Para quê:* Hoje o custo é texto em 5 marcações HTML; um parser seria frágil. Com isso, a ficha pode 'usar' e descontar.
- *Formato da resposta:* Bloco 'itens' do contrato: {id: {acoes, custo:{stamina,eter,saude,recurso}, custoTipo, usos:{n|formula, recarga}, modificadores:[...]}}

**P45.** Passivas com custo ('Ponto Fraco: 5 Stamina Passiva', 'Encadeamento: Passiva • 3 Stamina', 'Tese Arcana: Passiva, 2 Stamina'): quando a Stamina é descontada? Custos variáveis ('2+ Stamina', 'X Stamina', '1-5 Éter', '50% Éter', '5 Stamina/Item'): a ficha pede o valor na hora ou existe fórmula fechada?

- *Para quê:* UX do botão 'usar': desconto direto ou campo de valor.
- *Formato da resposta:* Por id: custoTipo 'fixo'|'variavel(min,max)'|'percentual'|'porUnidade' + momento do desconto.

**P46.** Validações de construção: a ficha deve conferir o orçamento de Pontos do Limiar (+4 por nível, custo crescente das cartas, a 6ª sempre 2), o saldo de Dor do Abismo ('Respeite os custos': gasto ≤ ganho?) e a Corrupção máxima por nível (2/5/9/14/20)? E a contagem de técnicas, tiers e marcas por nível?

- *Para quê:* Diferença entre a ficha só guardar e a ficha avisar quando a build está inválida.
- *Formato da resposta:* Tabela validação → 'bloquear'|'avisar'|'nao' + regra exata de cada orçamento.

### Descanso

**P47.** 'Xd8 de 2 Status' (longo) e '2d6 de 2 Status' (curto): uma rolagem vale inteira para os 2 status, rola uma para cada, ou uma rolagem dividida? 'Status' inclui o recurso de classe? A ação do curto (Tratar, Meditar, Relaxar, Comer) soma aos 2d6? 'Comer Refeição +2d6 de qualquer status' vai para 1 status só? Falhar Medicina ou Vontade CD 15 anula só a ação?

- *Para quê:* O assistente de descanso rola e aplica direto nas barras.
- *Formato da resposta:* { modo:'umaRolagemAmbos'|'umaPorStatus'|'dividir', statusElegiveis:[...], acaoSoma:bool, comerStatus:1 }

**P48.** O que cada descanso zera ou restaura, além dos 2 status: Exaurido, Exaustão (−1 no longo), estresse (1 no curto, todo no longo, com 1d6 de Stamina e Éter por ponto: uma rolagem para os dois ou uma para cada, antes ou depois da recuperação?), usos por recarga, recurso de classe, Reagentes, reação, temporários? 'Quem não se alimenta, não se recupera' corta só o Xd8 ou tudo?

- *Para quê:* Os botões 'Descanso curto' e 'Descanso longo' fazem tudo numa ação só.
- *Formato da resposta:* Tabela tipoDescanso → lista de efeitos [{alvo, op, valor|formula}] + ordem.

**P49.** Contador diário: quando o dia vira (no descanso longo ou por evento do mestre)? O descanso longo zera o contador de curtos? O descanso curto exige comida ou luz? Estresse tem teto? A perda de Éter de Fé/Sanidade 'proporcional à intensidade' tem tabela ou é valor do mestre?

- *Para quê:* Limites de 2 curtos e 1 longo por dia, contador de estresse e campo de perda manual.
- *Formato da resposta:* { viraDia:'descansoLongo'|'manual', estresseMax:n|null, sanidade:'tabela(...)'|'manual' }

### Dano e mitigação

**P50.** Ordem da mitigação num acerto: Ar e Ae (constante) antes ou depois de Resistência (½) e Vulnerabilidade (×2)? Arredondamento da metade? O dano pode chegar a 0? Imunidade = 0 de dano (não está definida)? O Ar vale a cada acerto?

- *Para quê:* O botão 'receber dano' (valor + tipo) calcula o dano final.
- *Formato da resposta:* Pipeline ordenado + {arred:'floor', minimo:0|1, imunidade:'zera'}

**P51.** Dano por CATEGORIA ('Biológico' no Morrendo, Sangramento e Envenenamento; 'Místico'; 'elemental (fogo)') contra a grade de 12 tipos da ficha: qual Resistência se aplica ao dano Biológico ou Místico genérico? A resistência pode ser por subtipo do Ordinário (Cortante, Contundente, Perfurante)? A ficha deve ganhar Vulnerabilidade por tipo e Ae por tipo como camadas separadas?

- *Para quê:* O modelo da grade de resistências (R, I, V, Ae) e o mapeamento categoria → tipo.
- *Formato da resposta:* Tabela categoria → tipos[] + camadas da grade ['R','I','V','Ae'].

### Morte e limites

**P52.** Morrendo: 'Vida Máxima × 0.1' arredonda como? Entra no início ou no fim do turno do personagem? O dano de Morrendo (biológico) sofre Resistência e Ae? A Saúde atual continua negativa e a cura soma a partir do negativo (−8 + 10 = 2)? 'Ser atacado novamente' desfaz a estabilização mesmo se o ataque errar? Com Desnutrido, qual 'Vida Máxima' vale?

- *Para quê:* Automação do tick de Morrendo e do limite de morte.
- *Formato da resposta:* { arred, momento:'inicioTurno'|'fimTurno', mitigavel:bool, curaDoNegativo:bool, desestabilizaSeErrar:bool, vidaMaxRef:'reduzida'|'base' }

**P53.** Estados finais (Exaustão 5, Desnutrido até 0, Saúde abaixo de −½ do máx, Éter em −½ do máx → personagem vai para o mestre): a ficha trava a edição e marca o estado, ou só mostra um alerta?

- *Para quê:* Comportamento da ficha nos desfechos definitivos.
- *Formato da resposta:* enum por estado: 'travar' | 'alertar'

### Progressão

**P54.** A ficha sobe de nível sozinha ao atingir o XP (150/400/1000/2000) ou só avisa? Ao subir de nível, que ajustes são automáticos (máximos, Reagentes, Marca do Duelo +2/+3, Escolas do Teurgo 2/3/5, +2 pontos de atributo, +4 do Limiar)?

- *Para quê:* Um fluxo de 'subir de nível' guiado na ficha.
- *Formato da resposta:* { autoNivel:bool, checklist:[{item, automatico:bool}] }

### UX de mesa

**P55.** Classifique o que vale rastrear na ficha digital. Candidatos: Saúde, Stamina e Éter atuais; temporários; recurso de classe; condições ativas com X e duração; ações, reação e Mover do turno; penalidade de ataques consecutivos; rodada atual; usos por recarga; efeitos sustentados; munição; descansos do dia; estresse; Exaustão; Desnutrido; Marca do Duelo; iniciativa da cena. O que é essencial, o que é opcional e o que é ruído?

- *Para quê:* Define o escopo do MVP da ficha de sessão; o que for ruído não entra.
- *Formato da resposta:* { essencial:[ids], opcional:[ids], ruido:[ids] } usando os ids da lista.

**P56.** Os efeitos devem ser aplicados automaticamente nos números (condições mexendo em Movimento, Evasão e perícias; custo descontado ao usar), ou mostrados como lembrete, com o jogador ajustando à mão? Vale por categoria?

- *Para quê:* Automação total pode brigar com a decisão do mestre na mesa.
- *Formato da resposta:* Tabela categoria → 'automatico'|'lembrete'

**P57.** Os jogadores rolam dados físicos ou a ficha deve ter rolador (d20 + mod + prof, dano da arma, recuperação de descanso) com histórico? Se tiver, o resultado deve ser visível ao mestre de alguma forma (por exemplo, texto para copiar)?

- *Para quê:* O rolador é um bloco grande de trabalho; só entra se agregar na mesa.
- *Formato da resposta:* enum 'semRolador'|'roladorOpcional'|'roladorPadrao' + requisito de histórico.

**P58.** Quais eventos de mesa a ficha deve ter como botão, e o que cada um dispara: Iniciar combate, Nova rodada, Fim do meu turno, Fim de combate, Fim de cena, Descanso curto, Descanso longo, Novo dia? Precisa de log de eventos com desfazer (dano, gasto, descanso)?

- *Para quê:* Os resets automáticos (Fluxo, Brutalidade, Concentração, usos, durações) saem desses eventos.
- *Formato da resposta:* Tabela evento → efeitos[] + bool 'logComDesfazer'.

**P59.** O export para o Bestiário (type npc) deve levar também o estado de sessão (Saúde, Stamina e Éter atuais, condições ativas), ou só a build? O mestre precisa de algum resumo da ficha do jogador durante o combate?

- *Para quê:* Define se o estado de sessão entra na projeção para o app do mestre.
- *Formato da resposta:* { exportarEstado:bool, campos:[...] }

## 5. Contrato de dados proposto

Arquivo proposto: `data/regras_ficha.json`. O balanceamento devolve esse arquivo e o site lê direto: o gerador valida o arquivo e o motor KhSessao usa. Três regras:
- **Fonte em toda regra.** Cada regra traz `fonte` (página Notion + bloco).
- **Status em toda regra.** `status` é `"canonico"` (já está no Notion) ou `"decisao"` (arbitrado agora). Uma decisão precisa ser escrita no Notion pelo Pedro antes de entrar no site.
- **Lacuna fica explícita.** O que não tiver resposta vem como `null` com `"pendente": "motivo"`, nunca com um valor chutado.

**Linguagem de fórmula** (string):
- Operadores: `+ - * /`, `floor()`, `ceil()`, `max()`, `min()`.
- Variáveis:
  - `nivel`
  - `FOR` `DES` `CON` `INT` `SAB` e `mod.FOR` … `mod.SAB`
  - `prof.<periciaId>`
  - `classe.V` `classe.G` `classe.R`
  - `recurso.<id>.max`
- Dados como string: `"2d6+8"`.
- Quando o atributo depende de escolha: `escolha(mod.FOR,mod.DES)`, e o modo de escolha fica num campo à parte.

**Operações de efeito:** `soma | multiplica | fixa | minimo | maximo | vantagem | desvantagem | falhaAuto | semAcao | semReacao | lembrete`.

**Eventos (enum):** `inicioCombate | novaRodada | inicioTurno | fimTurno | fimCombate | fimCena | descansoCurto | descansoLongo | novoDia | sessao | manual`.

**Exemplo.** Os valores abaixo já existem no repo; o que ainda não se sabe está em `null`.

```json
{
  "schemaVersion": "regras-ficha/1.0",
  "geradoEm": "2026-09-XX",
  "fontes": [{"id": "notion-sistema", "uuid": "<uuid>", "editadoEm": "<data>"}],

  "atributos": {
    "modificador": {"formula": "floor((attr-10)/2)", "status": "decisao", "fonte": "<bloco Notion>"}
  },

  "recursos": {
    "saude":   {"max": "10 + classe.V*nivel + mod.CON*nivel", "min": "-floor(recurso.saude.max/2)", "gatilhos": [{"quando": "atual<=0", "condicao": "morrendo"}], "fonte": "templates/classes; sistema/status"},
    "stamina": {"max": "8 + classe.G*nivel + escolha(mod.FOR,mod.DES)*nivel", "modoEscolha": null, "min": null, "gastoSemSaldo": null, "gatilhos": [{"quando": "atual==0", "condicao": "exaurido"}]},
    "eter":    {"max": "6 + classe.R*nivel + escolha(mod.INT,mod.SAB)*nivel", "modoEscolha": null, "min": "-floor(recurso.eter.max/2)", "gatilhos": [{"quando": "atual<=0", "condicao": "oco"}]},
    "ordemMaximo": ["base", "bonusFixo", "bonusRolado", "percentual", "reducaoPermanente", "condicao"],
    "arredondamento": null,
    "aoReduzirMax": null,
    "aoAumentarMax": null,
    "curaPassaMax": null,
    "temporario": {"recursos": null, "consumidoAntes": null, "acumula": null, "expira": null}
  },

  "classes": {
    "monge": {
      "V": 5, "G": 5, "R": 5,
      "cd": {"formula": "10 + mod.DES + mod.SAB"},
      "recursos": [{
        "id": "fluxo", "nome": "Fluxo", "max": "5",
        "inicio": {"evento": "inicioCombate", "valor": 0},
        "ganhos": [
          {"gatilho": "acertoCorpoACorpo", "valor": 1, "limite": {"n": 2, "por": "novaRodada"}},
          {"gatilho": "esquivarOuBloquear", "valor": 1, "limite": {"n": 1, "por": "novaRodada"}}
        ],
        "perdas": [],
        "zeraEm": ["fimCombate"],
        "custoEmTecnicas": "requisito",
        "pendente": "rodadaSemGanho?"
      }]
    },
    "espadachim": {
      "V": 6, "G": 6, "R": 3,
      "cd": {"formula": "10 + escolha(mod.DES,mod.FOR) + mod.CON", "modoEscolha": null},
      "estados": [{"id": "marca-do-duelo", "max": 1, "bonus": {"1": "+1/+1", "3": "+2/+2", "5": "+3/+3"}}]
    }
  },

  "derivados": {
    "evasao": {
      "passiva": "10 + mod.DES",
      "ativa": null,
      "acaoDefender": {"alvo": null, "valor": 2, "duracao": "inicioTurno", "acumula": null}
    },
    "movimento": {
      "basePorRaca": {"anao": 7.5, "humano": 9, "automato": 9, "corrompido": 9, "gruto": 9, "dryad": 10.5, "inseto": {"besouro": 7.5, "louva-a-deus": 9, "barata": 10.5}},
      "ordem": null, "passo": 1.5, "piso": 0
    },
    "armadura": {"fonteItem": null, "acumulaNatural": null, "teto": null, "aeMesmoTipo": null},
    "iniciativa": {"pericia": "iniciativa"}
  },

  "pericias": [
    {"id": "atacar", "nome": "Atacar", "atributos": ["FOR", "DES"], "modo": null, "tags": ["fisica"], "bestiario": "prof_attack"},
    {"id": "defender", "nome": "Defender", "dadoPorGrau": ["1d6", "1d8", "1d10", "1d12", "2d8"], "tags": ["fisica"], "bestiario": "prof_defend"},
    {"id": "religiao", "nome": "Religião", "atributos": null, "pendente": "SAB x INT"}
  ],
  "proficiencia": {"graus": [0, 2, 4, 6, 8], "rotulos": ["Leigo", "Treinado", "Experiente", "Mestre", "Lendário"], "modo": null},

  "testes": {"vantagem": null, "desvantagem": null, "cancelam": null, "acumulam": null, "natural20Pericia": null, "natural1Pericia": null},

  "condicoes": [
    {"id": "enjoado", "nome": "Enjoado", "aliases": [], "tags": null, "x": null,
     "efeitos": [{"alvo": "pericia.fortitude", "op": "soma", "valor": -5}, {"alvo": "evasao", "op": "soma", "valor": -2}],
     "duracao": null, "fim": null, "implica": [], "fonte": "condicoes/Enjoado"},
    {"id": "sangramento", "nome": "Sangramento X", "x": {"tipo": "pilha", "inicial": null, "decrementa": "aoSerAcertado"},
     "efeitos": [{"alvo": "danoRecebidoPorAtaque", "op": "soma", "valor": "1d4", "tipoDano": "biologico", "escalaComX": null}]}
  ],
  "empilhamento": {"entreCondicoes": null, "mesmaCondicao": null},

  "turno": {"acoes": 3, "reacoes": 1, "moverMaxPorTurno": 1, "penalidadeAtaqueConsecutivo": -5, "acaoLivreMax": null, "conjuracoesPorTurno": null},

  "magia": {
    "custoBase": [0, 2, 4, 6, 8],
    "intensidade": {"contida": -2, "normal": 0, "forcada": 2, "transbordante": 4},
    "minimoContida": null,
    "ordemCusto": null,
    "cdPorIntensidade": [-2, 0, 2, 4],
    "sustentada": {"custoPorTurno": null, "maxAtivas": null}
  },

  "recargas": {"turno": "fimTurno", "rodada": "novaRodada", "combate": "fimCombate", "cena": null, "curto": "descansoCurto", "longo": "descansoLongo", "dia": null, "sessao": "sessao"},

  "itens": {
    "monge-explosao": {"acoes": null, "custo": {"fluxo": 4}, "custoTipo": "requisito", "usos": null, "modificadores": [{"alvo": "movimento", "op": "multiplica", "valor": 2}]},
    "limiar-estudo-intenso": {"modificadores": [{"alvo": "cd", "op": "soma", "valor": 2}], "permanente": true}
  },

  "descanso": {
    "curto": {"maxPorDia": 2, "recupera": {"dado": "2d6", "status": 2, "modo": null}, "efeitos": null},
    "longo": {"maxPorDia": 1, "recupera": {"dado": "Xd8", "X": "comodidade", "status": 2, "modo": null}, "efeitos": [{"alvo": "condicao.exaustao", "op": "soma", "valor": -1}]},
    "statusElegiveis": null
  },

  "dano": {"ordemMitigacao": null, "arredondamento": null, "minimo": null, "imunidade": null, "categoriaParaTipos": null},
  "morte": {"morrendo": {"tick": "floor(recurso.saude.max*0.1)", "arred": null, "momento": null}, "estadosFinais": null},
  "progressao": {"xp": {"2": 150, "3": 400, "4": 1000, "5": 2000}, "autoNivel": null},

  "rastrear": {"essencial": [], "opcional": [], "ruido": []},
  "automacao": {"condicoes": null, "custos": null, "rolador": null, "eventos": null, "log": null}
}
```

**Convenções:**
- **ids.** Todo id usa o slug que o site já gera: `data/condicoes.json` cards[].id, `data/classes/*.json` e `data/limiar.json`.
- **Lista de perícias.** `pericias[]` lista as 24.
- **Bloco `itens`.** Cobre técnicas, marcas, ultimates, cartas (inclusive as raras), traços de raça e origens com custo ou uso.
- **Implementação no site.** Com esse arquivo, o site gera o schema 3.0 da ficha, com migração 2→3, e o motor puro KhSessao, testável como o KhInv.

## 6. Depois da sua resposta

O agente de HTML lê a sua branch, transforma o JSON em `data/regras-ficha.json` (gerado, com a sua fonte citada), desenha a ficha digital com o Pedro e implementa. Mudanças de regra que surgirem aqui voltam para você antes de ir ao ar.
