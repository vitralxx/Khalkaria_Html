# 07 · Geografia inicial

O objetivo é preencher `dados/kharavel/mundo/` (hexes, rios, vias, territórios e especiais) a partir da arte do
Pedro, **preservando a geografia dela**, sem pintar 800 hexes à mão. Nas palavras dele: *"450 hexes não da pra fazer
na mão"*.

**O caminho é script mais revisão.** Um agente de visão sozinho erra demais numa grade desse tamanho.

## 1. As referências
| Versão | Original (Google Drive do Pedro) | No repositório |
|---|---|---|
| **Oficial**: o continente verdadeiro, com o Abismo | `Kharavel Versão 2 abismo OFICIAL.png` (49,9 MB), id `1OYiQz6ZYbkO7hHhnHML3DBmtWRW31DMA` | `arte/referencia/kharavel-oficial.webp` |
| **Ilusão**: o Oásis no lugar do Abismo | `Kharavel Versão 2.png` (49,4 MB), id `13tDdJH1wwq-jJYYQBcvtoh7HRzr5emTW` | `arte/referencia/kharavel-ilusao.webp` |

- **Os originais não entram no git** (`.gitignore`).
- O repositório guarda **versões reduzidas** (4096 px de largura, WebP de boa qualidade), geradas por
  `ferramentas/reduz_referencia.py`. Para amostrar 30 colunas, isso já dá ~130 px de arte por hex.
- Também está lá o recorte com a legenda das 9 regiões: `arte/referencia/continente-legenda.webp`.
  - Na arte, as regiões são **contornos finos coloridos**, com as cores da tabela de `01-regras.md` §1.1.
  - O Ermo das Cinzas não tem contorno visível.
- As duas versões devem ter as mesmas dimensões e usar **a mesma calibração**. Confira na F3.

## 2. Teste de tamanhos (antes de tudo) `[Pedro: "testarmos vários tamanhos"]`
**O tamanho da grade precisa ser decidido antes de traçar vias e rios**, porque eles dependem dela.
1. Gere rascunhos com **22, 26, 30 e 34 colunas**, com as linhas que cobrem a arte.
2. Para cada um, amostre água e terra (§3) e mostre lado a lado:

   | Medida | Para quê |
   |---|---|
   | hexes de terra no total e por região (estimado) | tamanho do trabalho e do conteúdo |
   | **dias para cruzar** o continente de leste a oeste e de norte a sul, com orçamento de 9 m, em Campos (2 hexes/dia) e em estrada (6 hexes/dia) | **é a alavanca de design**: quanto dura a viagem |
   | hexes por região | região pequena demais não comporta a tabela |
   | imagem do rascunho sobre a arte | se a costa, o lago e a cordilheira "leem" |

3. O Pedro escolhe. O tamanho vai para `mundo.json > grade`.

## 3. Pipeline
1. **Calibração.** Fixe a posição do hex `0101` e a escala sobre a arte:
   - `grade.referencia.calibracao = {"origemPx": [x, y], "pxPorPxDeTile": s}`;
   - um tile a 1x tem passo de 24 px por coluna; o editor deixa arrastar e escalar a grade sobre a referência.
2. **Água e terra.** Tire a cor média de um disco dentro de cada hex e classifique pela cor do mar e do lago.
   - Litoral é a terra com vizinho de água do mar.
   - A Bacia Acidentada tem o **lago central**: água com região.
3. **Tipo sugerido.**
   - Use agrupamento por cor e textura: média RGB, desvio-padrão e "brancura" para neve.
   - O Pedro marca uns 5 hexes de exemplo por tipo, e o resto vai pelo vizinho mais próximo.
   - Cada sugestão sai com um **grau de confiança**, e a lista de baixa confiança vai para revisão.
4. **Regiões.**
   - O Pedro pinta com o pincel de região, com balde, sobre a referência. São minutos.
   - O agente pode adiantar um rascunho enchendo as áreas entre os contornos coloridos. O Ermo vai por exclusão, a
     sudeste.
   - Khaskavel (noroeste) e Revavena (nordeste) viram hexes de `cidade`.
5. **Especiais.** Os nomes que estão na arte já são geografia canônica:
   - Templo da Profecia (Bosque Corrompido, *[Pedro]*);
   - Vilarejo Skarv;
   - Castelo em Ruínas;
   - O Oásis (veja a camada da ilusão, no passo 7);
   - Kurtam;
   - Minas dos Krichama;
   - a fortaleza desenhada no Ermo das Cinzas, sem nome na arte.

   O agente põe esses especiais **sem texto**, com `status` de rascunho. O Pedro confirma a posição e escreve o
   resto.
6. **Rios e vias.**
   - O agente traça um **rascunho** dos rios e estradas visíveis na arte.
   - **O desenho final das vias é do Pedro**, porque ali está o game design. Cada rio e cada estrada levam a um
     objetivo.
   - A conferência ajuda a revisar: via sem destino, via que cruza rio sem ponte, foz solta.
7. **Camada da ilusão** `[Pedro, D159]`. Sobre a referência da ilusão, pinte a região alternativa nas células do
   Deserto do Abismo onde a arte muda. O resultado vai para `camadas/<regiao-da-ilusao>.json` (`03-dados.md` §3).
   - Antes, o Pedro precisa dar os dados da região da ilusão (`[P17]`).
   - Use a diferença entre as duas referências, pixel a pixel, para achar as células que mudam.
8. **Revisão no editor.** A lista de baixa confiança, depois as conferências (`03-dados.md` §5) até zerar as falhas.
9. **Recortes por região.** Os 9 recortes com o anel vizinho devem fechar o continente sem buraco.

## 4. Se o tamanho mudar depois
Há uma ferramenta de **reamostragem**:
- tipo, região e cidade são transferidos pelo centro de cada hex novo;
- especiais vão para o hex que contém o ponto antigo;
- rios e vias são reprojetados pelo vértice e pelo centro mais próximos e **voltam à revisão**.

É caro. Por isso o §2 vem antes de tudo.
