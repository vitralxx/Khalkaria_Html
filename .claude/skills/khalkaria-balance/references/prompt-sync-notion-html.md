# PROMPT — Sync Notion → HTML · o que mudou no sistema de magia

## Antes de tudo: uma checagem que pode cancelar este trabalho

As mudanças abaixo foram **decididas**, mas nem todas já estão escritas no Notion. O Pedro tem uma
lista de edições pendentes.

**Faça isto primeiro:** abra a página **Magias** do Notion e olhe a tabela "Custo Base por Nível".

- Se a tabela mostra **Nível 1 = 0 Éter** e vai até **Nível 5** → o Notion já está atualizado,
  siga o resto deste prompt normalmente.
- Se a tabela mostra **Nível 1 = 2 Éter** e para no **Nível 4** → **o Notion ainda está na versão
  antiga.** Pare, avise o Pedro, e **não sincronize as páginas de magia**, senão o site vai receber
  a versão velha por cima. As outras páginas podem seguir.

---

## O resumo em uma frase

**Todas as magias do sistema subiram um nível, e nasceu um nível novo embaixo com 20 magias
fracas que não custam nada.**

Antes as magias iam de 1 a 4. Agora vão de 1 a 5. O que era nível 1 virou nível 2, o que era 2
virou 3, e assim por diante até o 4 virar 5. **Nenhuma magia mudou de efeito** — só o número do
nível na frente dela. E o nível 1, que ficou vago, foi preenchido com 20 magias novas.

---

## As 6 páginas do Notion que mudaram

Sincronize estas para os arquivos correspondentes:

| Página no Notion | Arquivo HTML |
|---|---|
| **Magias** | `pages/magias.html` |
| **Sistema Khalkaria** (a página raiz) | `pages/sistema.html` |
| **Teurgo** | `pages/classes/teurgo.html` |
| **Corrompido** | `pages/racas/corrompido.html` |
| **Cultista** (origem) | `pages/origens.html` |
| **O Limiar** | `pages/limiar.html` |

---

## O que procurar em cada uma

### 1. Magias — a maior mudança

- **A lista de magias agora tem 5 seções de nível em vez de 4.** A seção "Nível 1" é inteiramente
  nova, com 20 magias. As seções seguintes são as antigas, renumeradas.
- Cada escola (Destruição, Abjuração, Alteração, Conhecimento) tem **5 magias em cada nível**.
  Se você contar 5 por escola por nível e der 100 magias no total, está certo.
- **A tabela de custo tem uma linha nova no topo:** Nível 1 custa 0 Éter.
- **As magias de Nível 1 são diferentes das outras em um ponto:** elas não têm a intensidade
  "Contida". Enquanto as outras magias mostram 4 valores separados por barra
  (`1d4 / 2d4 / 3d4 / 4d4`), as de Nível 1 mostram **só 3** (`1d4 / 2d4 / 3d4`). **Isso não é erro
  de digitação e não deve ser "consertado".** Se você vir 3 valores numa magia de Nível 1, copie
  os 3.

### 2. Sistema Khalkaria (raiz) — cuidado com a duplicata

⚠️ **Esta página tem uma SEGUNDA cópia das regras de magia**, separada da página Magias: a tabela
de custo por nível e a tabela de intensidade aparecem nas duas.

**As duas precisam bater.** Se você sincronizar só a página Magias, o `pages/sistema.html` fica
mostrando a tabela antiga e o site se contradiz sozinho. Confira as duas.

### 3. Teurgo — uma frase que aparece 3 vezes

Procure por esta frase, que aparece **três vezes** na página (nas técnicas **Grimório Arcano**,
**Canalizador Inato** e **Magias Pactuadas**):

> "Você só pode escolher magias iguais ou abaixo do seu (nível - 1)."

Ela mudou para:

> "Você só pode escolher magias do mesmo nível que o seu."

Se você achar só uma ou duas ocorrências, procure de novo — são três.

### 4, 5 e 6. Corrompido, Cultista e O Limiar — números soltos

Frases curtas que citam nível de magia e mudaram:

- **Corrompido** e **Cultista**: onde diz "magias de nível 0", agora é **"magias de nível 1"**.
- **O Limiar**, na seção do Abismo, no benefício **Desejo Sombrio**: onde diz "qualquer magia de
  nível 1-4", agora é **"nível 1-5"**.

---

## Outras correções pequenas, fora de magia

Se aparecerem no Notion, são mudanças reais e devem ir para o site:

- **Pele de Pedra** (magia): onde estava escrito `Ae (Ordinário)`, agora é `Ar`. São duas coisas
  diferentes no sistema e estava trocado.
- Em qualquer lugar que diga `Ae(alguma coisa)`: **`Ae(Ordinário)` não existe mais.** Se
  encontrar, é um resto antigo — avise o Pedro em vez de copiar.

---

## O que NÃO fazer

1. **Não toque em `pages/bazar.html`.** Ele não vem do Notion, é gerado de uma planilha pelo
   Pedro. Se você sincronizar por cima, destrói o trabalho.
2. **Não "corrija" as magias de Nível 1 que têm 3 valores em vez de 4.** É regra, não erro.
3. **Não invente conteúdo para preencher lacuna.** Se uma seção parecer incompleta no Notion,
   copie incompleta e avise. O Notion é a fonte da verdade; o site não pode ter nada que o Notion
   não tenha.
4. **Não mexa nas páginas dentro da pasta "Outros" do Notion.** São cópias antigas e arquivadas
   de Magias, Teurgo, Corrompido e Cultista. A versão boa de cada uma está em "Sistema Khalkaria".

---

## Conferência final

Antes de terminar, confira no `pages/magias.html` gerado:

- [ ] Existem **5 seções de nível** (1 a 5), não 4.
- [ ] O Nível 1 tem **20 magias**, 5 por escola.
- [ ] A tabela de custo começa em **Nível 1 = 0 Éter** e termina em **Nível 5 = 8 Éter**.
- [ ] Nenhuma magia de Nível 1 menciona a palavra "Contida".
- [ ] `pages/sistema.html` mostra a **mesma** tabela de custo que `pages/magias.html`.
- [ ] A frase "(nível - 1)" **não aparece** em `pages/classes/teurgo.html`.
