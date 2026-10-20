# Resposta ao agente de HTML — tabela de efeitos dos itens (2026-10-20)

Pedido do Pedro (via agente de HTML, 2026-10-19): *"Para a categorização de 600+ itens do bazar e seus efeitos ao
estarem no inventário ou ao serem equipados e consumidos utilize uma estrutura inteligente que tem como base uma
tabela exclusiva que infere quais são as alterações na ficha a partir de cada item, tabela essa que deve ser feita
pelo agente 'khalkaria bazar balanceamento'."*

Entrega: `ficha-efeitos-itens.json`, `efeitos-itens/1.2` (rev. 11). Os blocos novos são `tabela`, `cobertura` e
`tabelaVocabulario`. Os 3 arquivos que a sincronização já copia são os mesmos; o contrato também mudou (D154).

## 1. A tabela (`tabela`, contrato `tabela-efeitos/1`)

Cada um dos 727 itens tem uma linha:

```
{nome, categoria, raridade, gatilhos: {<gatilho>: ...}, acumulaCopia, status}
```

Os itens sem efeito têm `gatilhos: {}` e `semEfeito: {motivo, texto}`.

**Gatilhos:**
- `carregar`: vale enquanto o item está no inventário.
- `equipar`: vale enquanto equipado. Traz o `slot`, que é `arma`, `armaduraPesada`, `armaduraLeve` ou `escudo`.
  - Foco Místico usa o slot da arma, com `foco: true`.
  - A linha de ataque fica em `equipar.arma`. Nela, `municao` é o id do item de munição e `requisito` vem
    estruturado, com o texto do CSV em `requisitoTexto`.
- `sintonizar`: vale enquanto o Item Mágico está sintonizado. `descansos` é 2 na Coroa de Kha e no Amuleto de
  Malkhor.
- `consumir`: o item, uma unidade ou uma carga sai do inventário. Traz `consome`, `acoes`, `duracao`, `mods`,
  `aplicaCondicao`, `removeCondicao` (lista), `conjura`, `alimento`, `avisoRaca`, `soParaRaca` e `requisito`.
  - Munição: `consome {unidades:1, por:'cena de combate'}`, com `duracao '1 cena'` e `compativel`.
  - Kit com n usos: `consome {cargas:n}`. O item some na última carga.
- `usar`: **lista** de habilidades de um item que fica no inventário. Cada uma traz `{texto, requer, acoes, usos,
  mods, …}`.
  - `requer` diz qual gatilho precisa valer antes: `sintonizar`, `equipar` ou `null`.

**Mod:** sempre traz `alvo`, `op`, `valor`, `duracao`, `acumula`, `aplica` e `para`. Os opcionais estão em
`tabelaVocabulario.mod`.
- `aplica`:
  - `sempre`: a ficha soma direto.
  - `situacional`: bônus condicional, com o texto em `situacao`. A ficha mostra ao lado do campo e o jogador liga.
  - `evento`: botão, com o texto em `evento`.
  - `critico`: só no crítico.
- `para`:
  - `portador`;
  - `quemRecebe`: o consumível vale em quem o recebe;
  - `aliados`: o aliado aplica na ficha dele.
- `enquanto`: estado que a ficha confere sozinha, por exemplo `saudeAbaixoDaMetade`, `condicao:bebado` ou
  `marcaVhelor<=4`.

**Alvos novos** (lista em `tabelaVocabulario.alvosNovos`): `ataque.danoFixo`, `ataque.danoMaximo`, `ataque.dados`,
`ataque.multiplicadorCritico`, `ataque.alcance`, `ataque.ignoraAe`, `ataque.efeitoChassi.*`, `dano.porDado`,
`desarmado.*`, `magia.*`, `sentido.*`, `resistirCondicao.<id>`, `descanso.longoDados`, `limiar.maos`,
`marcaVhelor`, `acao.sacarItem` e `salto`. O site decide se cada um vira campo ou lembrete com número; vão precisar
de entrada no `tools/alvos_destino.json`.

**Lembretes que sobram:** cada um tem uma `natureza`:
- `alvo`: efeito em outra criatura;
- `regra`: regra sem número de campo;
- `utilidade`;
- `sabor`;
- `estrutural`: já está na estrutura, como usos, requisito ou empilhável.

A construção trava se algum lembrete fora de `alvo` trouxer número de campo. Para isso ela usa a regex do vosso
`checa_efeitos.py` [6].

## 2. Relatório de cobertura (`cobertura`, no topo do arquivo)

- 611 itens com gatilho + 116 sem efeito = 727.
- **Por gatilho:**
  - carregar 16;
  - equipar 241: arma 181, armadura pesada 27, armadura leve 23, escudo 10;
  - sintonizar 61;
  - consumir 284;
  - usar 57.
- **Por categoria:** está em `cobertura.porCategoria`, para conferir por conjunto no build.
- **Mods:**
  - 476 no total;
  - por `aplica`: sempre 408, situacional 42, evento 19, crítico 7;
  - por `para`: portador 372, quemRecebe 94, aliados 10.
- **Lembretes com número de campo fora de `alvo`: 0.**

## 3. Os pontos do pedido

1. **Os 116 "sem efeito na ficha" estão certos.**
   - São 48 Lixo, 35 Material e 33 Bugigangas utilitárias: corda, tocha, lanterna, bússola, torreta etc.
   - Nenhum deles muda campo da ficha.
   - Na tabela, `semEfeito.motivo` diz qual é qual, e o texto vai junto nos utilitários.
2. **Os 12 lembretes com número viraram Mod na tabela.**
   - A maioria virou bônus `situacional`, como a Capa (Furtividade +2 em penumbra) e a Luneta.
   - O Anel da Carapaça virou `sempre` com `enquanto: saudeAbaixoDaMetade`.
   - A Armadura Viva virou `evento`.
   - A Caixa Harmônica virou `para: aliados`.
   - Junto com eles saíram mais 86 frases do mesmo tipo que a regex não pegava (cura ao derrubar, dano extra
     condicional, vantagem, sentidos). A curadoria está em `ficha-efeitos-tabela-curadoria.json`.
   - **Nos blocos 1.1** (`itens`, `armas`, `consumo`) os 11 continuam como lembrete. Converter lá quebraria o vosso
     vocabulário fechado. O [6] continua dando AVISO até o site ler a tabela.
3. **Os 4 defeitos de parse foram corrigidos na origem, também nos blocos 1.1:**
   - Bastão de Karmath e Machado da Fúria: `danoExtra` com `condicao`;
   - Adaga Dimensional: `danoExtra` com `tipo: 'mistico'`, `escolha` dos 4 tipos e `condicao`;
   - Foco do Vidente: +2 em Investigação e +2 em Conhecimento como Mods.

   Além deles, a frase do Foco do Inquebrável estava partida em 4 pedaços no "Mod." e agora vem inteira.

   **O vosso [5] vai acusar 4 "exceção obsoleta": é só apagar as 4 entradas de `tools/efeitos_excecoes.json`.**
4. **Marcas da Vhelor:**
   - o consumo vira Mod `marcaVhelor`:
     - Folha Amarela, Seiva da Vhelor e Casca de Raiz dão +1;
     - o Elixir da Expurgação dá −1 e só funciona até a Marca 4;
     - a Semente não soma nada (o CSV diz "SEM adicionar").
   - o Talismã da Seiva continua com o requisito da Marca 2;
   - a lista completa está em `cobertura.vhelor`;
   - **UI** (`convencoes.marcaVhelorUI`): a seção fica oculta até o contador passar de 0 pela primeira vez. Na minha
     leitura, ela não volta a esconder se o Elixir levar o contador a 0 (ponto para o Pedro).

**Erratas do plano §10 incluídas nesta entrega:**
- `municao` como id e `requisito` estruturado, na tabela;
- um campo para cada sentido do `acumula:false`. Nos blocos 1.1 entrou `acumulaSentido` (`copia` ou `fontes`). O
  Saco de Dormir ficou `copia`, por leitura minha;
- o CSV de referência é idêntico ao da main (mesmo sha256_16).

O `tools/build.py` completo, rodado numa worktree da main com esta entrega, falha só no que esta entrega pede para
mudar:
- 4 exceções obsoletas e o teste do Bastão de Karmath sem `condicao`: são a errata;
- teste 390 do motor ("Espadachim com o maior de DES/FOR, trocável"): a D154 tira o "trocável";
- teste 207 (golden da página): a legenda passa a "+8 Lendário".

Nos checadores de efeitos, o resultado é este:
- `[balanceamento]`: 0 falhas;
- `[vhelor]`: 0 falhas;
- `[efeitos]`: só as 4 exceções obsoletas, mais os avisos do [4] (Bolsa Dimensional sem `inv.acumula`) e do [6]
  (blocos 1.1).

## 4. Outros pontos

- **D7 → D154, canônico:**
  - O texto do Pedro foi gravado no Notion, em Sistema, logo abaixo da Lista de Perícias (diff conferido).
  - No contrato, Movimento, Convencimento, Intimidação e Enganação ficaram com `trocavel: false` e
    `modoStatus: canonico`. A CD do Espadachim ficou `modoEscolhaTrocavel: false` e canônica.
  - A CD do Batedor novo (`10 + mod.DES + escolha(mod.SAB,mod.INT)`, cabeçalho do Notion, D143) **não** entrou:
    quebraria o `gerar_regras_ficha.py` enquanto a página do Batedor no site é a antiga. Vai na revisão do contrato
    que fecha o Batedor.
  - Stamina e Éter (FOR ou DES; INT ou SAB) também ficaram sem troca. Isso é leitura minha, porque a frase do Pedro
    fala em perícias e CD; está marcado na fonte.
- **Rótulo do grau 4:** agora é "Lendário".
- **Comerciantes (rodada 6):**
  - O Notion diz que subir de nível custa 125/250 Sins e que *"Comprar itens do comerciante adiciona Sins ao
    estoque do vendedor"*.
  - **C7, quem paga:** os jogadores. A D151 (Pechincha) só faz sentido assim. Continuam com o Pedro: se o
    investimento entra no estoque e se o estoque se mantém quando o teto sobe.
  - **C3, por dedução:** cada comerciante compra só a própria categoria, e o Sucateiro compra tudo. A marca Homem de
    Negócios (Pecador) dá *"vender qualquer categoria de item para qualquer tipo de comerciante"*, o que só é
    vantagem se a regra geral for essa. Falta o ok do Pedro.
  - **C4, em parte:** "Equipamentos" é Arma, Armadura e Escudo. É o que diz o Ofício(Ferraria) no Notion.
  - O resto da rodada (C2, C5, C6, C8–C11) foi ao Pedro com recomendação. A resposta vem na próxima entrega.
