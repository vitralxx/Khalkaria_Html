# -*- coding: utf-8 -*-
import json

M = [
# ─────────────── DESTRUIÇÃO ───────────────
("Destruição","Fagulha",
 [("Ação","1 Ação","❎"),("Alcance","4,5 / 6 / 9 m","✅"),("Alvo","1 Criatura","❎"),
  ("Dano","1d4 / 2d4 / 3d4 Fogo","✅")],
 "Você estala os dedos e arremessa uma fagulha. Faça um teste de Místico contra a Evasão do alvo. "
 "A fagulha acende objetos inflamáveis desatendidos (tocha, estopa, óleo derramado) sem precisar de teste.",
 ["Fragmentar","Alterar","Carregar","Marcar"]),

("Destruição","Centelha",
 [("Ação","1 Ação","❎"),("Alcance","1,5 m","❎"),("Alvo","1 Criatura","❎"),
  ("Dano","1d4 / 2d4 / 3d4 Elétrico","✅")],
 "Um arco elétrico salta da sua mão para a criatura mais próxima. Acerta automaticamente e não pode "
 "ser bloqueado por cobertura. O alcance não aumenta por intensidade: o arco precisa de ar curto para saltar.",
 ["Fragmentar","Alterar"]),

("Destruição","Rajada Prismática",
 [("Ação","2 Ações","❎"),("Alcance","Pessoal","❎"),("Área","Cone de 3 / 4,5 / 6 m","✅"),
  ("Dano","1d4 / 2d4 / 3d4 Ordinário (perfurante)","✅"),("Resistência","Reflexos para metade · CD +0 / +2 / +4","✅")],
 "Você materializa um punhado de cacos místicos e os cospe em cone.",
 ["Alterar","Carregar"]),

("Destruição","Toque Cáustico",
 [("Ação","1 Ação","❎"),("Alcance","Toque","❎"),("Alvo","1 Criatura","❎"),
  ("Dano","1d6 / 2d6 / 3d6 Ácido","✅")],
 "A ponta do seu dedo expele um ácido místico que se dissipa ao contato. Faça um teste de Místico contra "
 "a Evasão do alvo. Na intensidade transbordante, quando aplicado a um material não-mágico (corda, "
 "fechadura, grade fina), corrói em 1 rodada.",
 ["Fragmentar","Alterar","Carregar","Marcar"]),

("Destruição","Presas de Gelo",
 [("Ação","2 Ações","❎"),("Alcance","3 / 4,5 / 6 m","✅"),("Presas","2 / 3 / 4","✅"),
  ("Alvo","1 criatura por presa, à sua escolha","❎"),("Dano","1d4 Frio por presa","❎")],
 "Presas de gelo se formam no ar e disparam contra os inimigos. Cada presa dispara um ataque independente, "
 "teste de Místico contra a Evasão do alvo. A intensidade adiciona mais presas. PMA é aplicada nessa magia.",
 ["Fragmentar","Alterar","Carregar","Marcar"]),

# ─────────────── ABJURAÇÃO ───────────────
("Abjuração","Verniz do Éter",
 [("Ação","1 Ação","❎"),("Alcance","Pessoal","❎"),
  ("Efeito","Ae 1 / 2 / 3 contra um tipo de dano à escolha","✅"),
  ("Duração","Até o fim do seu próximo turno","❎")],
 "Você enverniza sua pele com uma camada fina de abjuração afinada a um elemento seguinte: Fogo, Frio, "
 "Elétrico, Veneno, Ácido, Psíquico, Radiante, Trovejante ou Necrótico. Escolha o tipo ao conjurar. "
 "Não funciona contra dano Ordinário.",
 ["Ancorar","Refletir","Socializar","Acelerar"]),

("Abjuração","Presságio",
 [("Ação","Ação Livre","❎"),("Alcance","Pessoal (apenas em você)","❎"),
  ("Intensidade","Apenas Normal","❎"),
  ("Efeito","A sua próxima rolagem de Atacar neste turno ignora a PMA","❎"),
  ("Custo","Se acertar, você perde Éter igual ao número de dados de dano da arma usada","❎")],
 "Você antecipa o golpe um instante antes de desferi-lo. A modulação Socializar não funciona nesta magia.",
 ["Ancorar"]),

("Abjuração","Anteparo Etérico",
 [("Ação","1 Ação","❎"),("Alcance","3 / 4,5 / 6 m","✅"),("Área","Painel de 1,5 m × 1,5 m","❎"),
  ("Saúde do Painel","5 / 10 / 15","✅"),("Duração","Até o início do seu próximo turno","❎")],
 "Você fixa um painel de energia etérica translúcida em um ponto que possa ver. Ele fornece cobertura "
 "total a quem estiver atrás dele e some ao ser reduzido a 0 de Saúde.",
 ["Ancorar","Refletir","Socializar","Acelerar"]),

("Abjuração","Rescaldo",
 [("Ação","1 Ação","❎"),("Alcance","Toque / 1,5 / 3 m","✅"),("Alvo","1 Criatura","❎"),
  ("Efeito","Remove Em Chamas · Forçada: também Enjoado ou Desorientado · Transbordante: também Amedrontado","✅")],
 "Você passa a mão sobre a criatura e a energia abjurante sufoca o que arde nela. Cada conjuração remove "
 "uma única condição — a intensidade amplia a lista de escolhas, não a quantidade removida.",
 ["Socializar","Acelerar"]),

("Abjuração","Vínculo Cósmico",
 [("Ação","1 Ação","❎"),("Alcance","Toque","❎"),("Alvo","1 / 2 / 3 Criatura(s) voluntária(s)","✅"),
  ("Duração","Até o fim do seu próximo turno","❎"),
  ("Efeito","O próximo dano recebido é repartido igualmente entre os conectados","❎")],
 "Você amarra um fio breve entre você e outra criatura que reparte os ferimentos igualmente entre as "
 "criaturas conectadas.",
 ["Ancorar","Refletir","Socializar","Acelerar"]),

# ─────────────── ALTERAÇÃO ───────────────
("Alteração","Dedo Místico",
 [("Ação","1 Ação","❎"),("Alcance","4,5 / 9 / 13,5 m","✅"),
  ("Efeito","Manipula 1 objeto de até 0,5 kg que você possa ver","❎")],
 "Você move um objeto leve à distância: puxa uma alavanca, vira uma página, apaga uma vela, empurra uma "
 "moeda por baixo de uma porta. Uma manipulação por conjuração. Não pode atacar, desarmar nem tirar item "
 "de criatura.",
 ["Alcançar","Contagiar"]),

("Alteração","Lábia",
 [("Ação","1 Ação","❎"),("Alcance","Pessoal","❎"),
  ("Efeito","+1 / +2 / +3 na próxima rolagem de Convencimento, Intimidação, Enganação, Motivar ou Crime","✅"),
  ("Duração","A próxima rolagem desta cena","❎")],
 "Escolha a perícia ao conjurar. Quem estiver te observando pode fazer Percepção contra a sua CD para "
 "perceber a conjuração; contra quem perceber, o bônus não se aplica.",
 ["Inversão","Contagiar","Insistir"]),

("Alteração","Lastro",
 [("Ação","1 Ação","❎"),("Alcance","4,5 / 9 / 13,5 m","✅"),("Alvo","1 Criatura","❎"),
  ("Duração","1 Rodada","❎"),("Resistência","Vontade ou Lento 1 · CD +0 / +2 / +4","✅")],
 "Você adiciona peso ilusório aos membros de uma criatura. Em caso de falha no teste de Vontade, ela fica "
 "Lento 1 até o fim do próximo turno dela.",
 ["Inversão","Alcançar","Contagiar","Insistir"]),

("Alteração","Têmpera",
 [("Ação","1 Ação","❎"),("Alcance","Toque","❎"),("Alvo","1 Arma","❎"),
  ("Duração","1 / 2 / 3 ataque(s)","✅"),
  ("Efeito","O dano da arma muda para um tipo Atípico à escolha","❎")],
 "Fogo, Frio, Elétrico, Veneno, Ácido, Psíquico, Radiante, Trovejante ou Necrótico. A arma mantém o dado "
 "base e o atributo.",
 ["Inversão","Contagiar","Insistir"]),

("Alteração","Rosto Emprestado",
 [("Ação","2 Ações","❎"),("Alcance","Toque","❎"),("Duração","10 / 30 / 60 minutos","✅"),
  ("Efeito","Altera um único detalhe da sua aparência","❎")],
 "Cor dos olhos, uma cicatriz, o timbre da voz, a cor do cabelo, a insígnia da roupa. Não muda altura, "
 "rosto inteiro nem porte. Quem interagir pode fazer Percepção contra a sua CD para notar.",
 ["Inversão","Contagiar","Insistir"]),

# ─────────────── CONHECIMENTO ───────────────
("Conhecimento","Farejar Elemento",
 [("Ação","1 Ação","❎"),("Alcance","Pessoal · raio 4,5 / 9 / 13,5 m","✅"),
  ("Duração","1 / 5 / 10 minutos","✅"),
  ("Efeito","Normal: há Éter no raio · Forçada: qual elemento · Transbordante: a direção","✅")],
 "Seu faro fica extremamente sensível ao éter, rapidamente você sabe dizer se ele está presente no raio.",
 ["Compartilhar","Exigir","Projetar"]),

("Conhecimento","Ponto Cego",
 [("Ação","1 Ação","❎"),("Alcance","4,5 / 9 / 13,5 m","✅"),("Alvo","1 Criatura","❎"),
  ("Efeito","Revela se o alvo tem Ae, resistência ou imunidade na categoria escolhida — sem os valores","❎")],
 "Você estuda a criatura e misticamente descobre suas principais resistências e imunidades. Escolha "
 "Ordinário, Elemental, Biológico ou Místico; o mestre revela se o alvo tem Armadura Específica, "
 "resistência e imunidades, mas não o valor exato.",
 ["Compartilhar","Exigir","Projetar","Gravar"]),

("Conhecimento","Sina",
 [("Ação","1 Ação","❎"),("Alcance","9 / 18 / 27 m para marcar","✅"),
  ("Alvo","1 Criatura que você possa ver","❎"),("Duração","10 minutos / 1 hora / 8 horas","✅"),
  ("Efeito","Você sempre sabe a direção e a distância aproximada do alvo, sem limite de alcance","❎")],
 "Você amarra um fio de atenção à criatura. Ele não se rompe com parede, escuridão nem invisibilidade — "
 "mas também não diz o que ela está fazendo, nem permite atacá-la sem vê-la. Você só pode ter uma Sina "
 "ativa por vez.",
 ["Compartilhar","Exigir","Projetar","Gravar"]),

("Conhecimento","Vislumbre",
 [("Ação","Reação","❎"),("Gatilho","Você tira 1 na rolagem de um teste de perícia","❎"),
  ("Alcance","Pessoal","❎"),("Intensidade","Apenas Transbordante","❎"),
  ("Efeito","Re-role o teste com desvantagem","❎")],
 "Por um instante o Éter te mostra o erro no momento exato em que ele acontece — tarde demais para "
 "evitá-lo, cedo o bastante para tentar de novo. O que chega é confuso e incompleto, e a segunda "
 "tentativa vem torta.",
 ["Compartilhar","Exigir","Gravar"]),

("Conhecimento","Presciência",
 [("Ação","Ação Livre","❎"),("Gatilho","Você vai rolar Iniciativa","❎"),("Alcance","Pessoal","❎"),
  ("Efeito","Role a Iniciativa duas vezes e fique com o melhor resultado","❎")],
 "Você sente o combate um instante antes de ele começar. Iniciativa se rola uma vez por combate, então a "
 "magia se limita sozinha: não há uso repetido nem nada para anotar.",
 ["Compartilhar","Exigir"]),
]

MODS = {
 "Destruição":  {"Fragmentar":3,"Alterar":3,"Carregar":3,"Marcar":5},
 "Abjuração":   {"Ancorar":2,"Refletir":3,"Socializar":4,"Acelerar":5},
 "Alteração":   {"Inversão":2,"Alcançar":3,"Contagiar":3,"Insistir":5},
 "Conhecimento":{"Compartilhar":1,"Exigir":2,"Projetar":2,"Gravar":3},
}

# ── VALIDAÇÃO ──
erros=[]
from collections import Counter
c=Counter(e for e,_,_,_,_ in M)
for esc in MODS:
    if c[esc]!=5: erros.append(f"{esc} tem {c[esc]} magias, esperado 5")
nomes=[n for _,n,_,_,_ in M]
dup=[n for n,k in Counter(nomes).items() if k>1]
if dup: erros.append(f"nome duplicado: {dup}")
for esc,nome,stats,desc,mods in M:
    for m in mods:
        if m not in MODS[esc]: erros.append(f"{nome}: modulação '{m}' não é da escola {esc}")
    if not mods: erros.append(f"{nome}: sem nenhuma modulação aplicável")
    for campo,val,mod in stats:
        if mod=="✅":
            n=len([p for p in val.split("/") if p.strip()])
            # barras de 3 valores; campos textuais com ' · ' são escalas nomeadas
            if "·" not in val and n!=3:
                erros.append(f"{nome} · campo '{campo}': {n} barras, esperado 3 → {val}")
    if "Contida" in json.dumps(stats,ensure_ascii=False)+desc:
        erros.append(f"{nome}: menciona Intensidade Contida (Nível 1 não tem)")

print(f"{len(M)} magias · {len(set(nomes))} nomes únicos")
print("VALIDAÇÃO:", "TUDO OK" if not erros else "")
for e in erros: print("  ❌", e)

# ── EMISSÃO ──
if not erros:
    out=[]
    out.append("# Magias de Nível 1 — Khalkaria\n")
    out.append("**20 truques · 5 por escola.** Custo base **0 Éter**. "
               "Nível 1 **não tem Intensidade Contida**.\n")
    out.append("| Intensidade | Custo |\n|---|---|\n"
               "| Normal | 0 Éter |\n| Forçada | +2 Éter |\n"
               "| Transbordante | +4 Éter (Vontade CD 15 ou perde o dobro) |\n")
    out.append("> As barras nas descrições indicam valores em ordem: "
               "**Normal / Forçada / Transbordante** — três valores, não quatro.\n")
    out.append("> Modulações mantêm o preço cheio em Nível 1 (D69).\n\n---\n")
    ICON={"Destruição":"⚔️","Abjuração":"🛡️","Alteração":"🌀","Conhecimento":"🔮"}
    for esc in ["Destruição","Abjuração","Alteração","Conhecimento"]:
        out.append(f"\n## {ICON[esc]} {esc}\n")
        for e,nome,stats,desc,mods in M:
            if e!=esc: continue
            out.append(f"\n### 🔹 {nome}\n")
            out.append("| Característica | Valor | Mod |\n|---|---|---|")
            for campo,val,mod in stats:
                out.append(f"| {campo} | {val} | {mod} |")
            out.append(f"\n{desc}\n")
            mm=" · ".join(f"{m} (+{MODS[esc][m]})" for m in mods)
            out.append(f"`Modulações aplicáveis: {mm}`\n")
    open("magias-nivel1.md","w",encoding="utf-8").write("\n".join(out))
    json.dump([{"escola":e,"nome":n,"stats":[{"campo":c,"valor":v,"mod":m} for c,v,m in s],
                "descricao":d,"modulacoes":mo} for e,n,s,d,mo in M],
              open("magias-nivel1.json","w",encoding="utf-8"),ensure_ascii=False,indent=2)
    print("→ magias-nivel1.md e .json gerados")
