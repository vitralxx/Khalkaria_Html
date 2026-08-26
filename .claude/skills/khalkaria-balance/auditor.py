#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Auditor do Bazar de Khalkaria — régua de balanceamento executável.

Uso:
  python3 auditor.py dump <categoria> [--familia X] [--raridade Y]
        Imprime Nome | Raridade | Descrição EXATA (verbatim do CSV). É o fluxo
        de revisão: o Pedro opina sobre esses 3 campos e o resultado volta pro CSV.
  python3 auditor.py armas          Audita chassis de arma contra o cânone do Notion
  python3 auditor.py dpr <dado> <acoes> [mod]   DPR pelo modelo canônico
  python3 auditor.py familias [cat]  Mapeia famílias dentro de cada categoria
  python3 auditor.py precos          Confere Valor(Sins) contra a faixa da raridade
  python3 auditor.py travas          Varre violações de travas duras do sistema
  python3 auditor.py economia        Simula o loop de Sins (comerciantes, margens)
  python3 auditor.py cobertura       Quais itens não beneficiam nenhum arquétipo

CSV: references/bazar-v26.csv (cabeçalho na ÚLTIMA linha).
"""
import csv, sys, re, os, collections

BASE = os.path.dirname(os.path.abspath(__file__))
CSV = os.path.join(BASE, 'references', 'bazar-v26.csv')

COLS = ['Nome','Categoria','Raridade','Efeito','Efeito_Jogador','Valor (Sins)',
        'Obtenção','Tipo de Craft','Ingredientes','Tags','Lore/Notas']

# ---- Cânone do Notion (Sistema Khalkaria) ----------------------------------
ARMAS_CANON = {
 'Leve Cortante':      ('1d6','DES','Cortante','Dilacerar',1,'DES >= 12'),
 'Leve Perfurante':    ('1d6','DES','Perfurante','Alcançar',1,'DES >= 12'),
 'Leve Contundente':   ('1d6','DES','Contundente','Desorientar',1,'DES >= 12'),
 'Leve Ágil':          ('1d8','DES','Contextual','Executar',1,'DES >= 14'),
 'Pesada Cortante':    ('1d12','FOR','Cortante','Dilacerar',2,'FOR >= 12'),
 'Pesada Perfurante':  ('1d12','FOR','Perfurante','Alcançar',2,'FOR >= 12'),
 'Pesada Contundente': ('1d12','FOR','Contundente','Desorientar',2,'FOR >= 12'),
 'Pesada Brutal':      ('2d12','FOR','Contextual','Executar',3,'FOR >= 14'),
 'Marcial Pesada':     ('2d10','FOR','Contundente','Desorientar',2,'Treinado em Armas Marciais'),
 'Marcial Longa':      ('2d10','FOR','Perfurante','Alcançar',2,'Treinado em Armas Marciais'),
 'Marcial Precisa':    ('1d8','DES','Cortante','Executar',1,'Treinado em Armas Marciais'),
 'Marcial Versátil':   ('1d8','DES','Contextual','Dilacerar',1,'Treinado em Armas Marciais'),
 'Distância Simples':  ('1d6','DES','Perfurante','Dilacerar',1,'Treinamento À Distância'),
 'Distância Pesada':   ('1d12','DES','Perfurante','Executar',2,'Treinamento À Distância'),
 'Arremesso':          ('1d8','DES','Perfurante','Dilacerar',1,'DES >= 14'),
}
MARCIAIS = {'Marcial Pesada','Marcial Longa','Marcial Precisa','Marcial Versátil'}
EFEITOS = {
 'Dilacerar':  ('2 Stamina','seu próximo ataque aplica Sangramento 1 no acerto'),
 'Alcançar':   ('2 Stamina','seu próximo ataque tem +1,5 m de Alcance e não pode ser retaliado'),
 'Desorientar':('2 Stamina','seu próximo ataque aplica Desorientado no acerto'),
 'Executar':   ('3 Stamina','seu próximo ataque tem +1 dado de dano'),
}
# faixa de Sins por raridade: (expressão, mínimo, máximo, média)
RARIDADE = {
 'Lixo':      ('1d8+2',   3,  10,   6.5),
 'Ordinário': ('2d10+10',12,  30,  21.0),
 'Incomum':   ('4d10+45',49,  85,  67.0),
 'Exótico':   ('5d12+180',185,240,212.5),
 'Luxária':   ('6d20+620',626,740,683.0),
}
# quem tem acesso nativo a cada categoria de arma
ACESSO = {
 'Marciais':    ['Espadachim','Monge','origem Acólito','Anão','Dryad Cascaferro'],
 'À Distância': ['Batedor','Artilheiro','origem Andarilho','Anão'],
 'Místicas':    ['Teurgo'],
 'Leves/Pesadas':['qualquer um (só exige atributo)'],
}

def load():
    rows = list(csv.reader(open(CSV, encoding='utf-8')))
    hdr = [i for i,r in enumerate(rows) if r[1] == 'Categoria']
    data = [r for i,r in enumerate(rows) if i not in hdr]
    return [dict(zip(COLS, r[:len(COLS)])) for r in data]

def media_dado(d):
    m = re.fullmatch(r'(\d+)d(\d+)', d.strip())
    if not m: return None
    n, f = int(m.group(1)), int(m.group(2))
    return n * (f + 1) / 2

def dpr(dado, acoes, mod=3):
    """Modelo canônico: 1 ação -> 1,20D+3,15 ; 2-3 ações -> 0,65D+1,80 (mod=+3)."""
    D = media_dado(dado)
    if D is None: return None
    # 1 ação: 3 ataques a 60/35/10% = 1,05 acertos; +0,05 de dados extras por
    # ataque pelo crítico (20 natural dobra os dados) => 1,05+0,15 = 1,20.
    if acoes == 1:
        return 1.20 * D + 1.05 * mod          # = 1,20D + 3,15 com mod +3
    # 2-3 ações: 1 ataque a 60% = 0,60 acertos; +0,05 de crítico => 0,65.
    return 0.65 * D + 0.60 * mod              # = 0,65D + 1,80 com mod +3

def familia_arma(nome):
    return 'genérica' if nome.startswith('Arma ') else 'única'

def chassi(efeito):
    for t in sorted(ARMAS_CANON, key=len, reverse=True):
        if re.match(re.escape(t) + r'[.\s]', efeito or ''): return t
    return None

def nivel_arma(nome):
    m = re.search(r'\+(\d)\s*$', nome)
    return int(m.group(1)) if m else 0


# ---- Gerador de descrição canônica -----------------------------------------
ALCANCE = {'Distância Simples':'18 m','Distância Pesada':'18 m','Arremesso':'9 m'}
# nomes exatos dos 3 itens-base da categoria Munição no CSV (1 por arma)
MUNICAO = {'Distância Simples':'Virotes/Flechas','Distância Pesada':'Munição de Fogo',
           'Arremesso':'Conjunto de Arremesso'}
ARREMESSAVEL = {'Leve Cortante','Leve Perfurante','Leve Contundente'}
DANO_CTX = 'Cortante, Perfurante ou Contundente'
ATTR_EXT = {'DES':'Destreza','FOR':'Força'}

def descricao_canonica(ch, nivel=0, payload=''):
    """Monta a descrição canônica de uma arma a partir do chassi do Notion.
    payload = texto exclusivo da arma única (ex.: '+ 1d4 Fogo. Crítico: ...')."""
    dado, attr, dano, ef, ac, req = ARMAS_CANON[ch]
    n, f = re.fullmatch(r'(\d+)d(\d+)', dado).groups()
    dado_n = f"{int(n)+nivel}d{f}"
    dano_txt = DANO_CTX if dano == 'Contextual' else dano
    nome = f"{ch} +{nivel}" if nivel else ch
    partes = [f"{nome}. {dado_n} {dano_txt} ({ATTR_EXT[attr]})."]
    if nivel: partes.append(f"+{nivel} em Atacar.")
    acoes = f"Atacar({ac})" + (", Arremessar(1)" if ch in ARREMESSAVEL else "")
    partes.append(acoes + ".")
    if ch in ALCANCE: partes.append(f"Alcance {ALCANCE[ch]}.")
    req_txt = req.replace('>=', '≥').replace('DES','Destreza').replace('FOR','Força')
    partes.append(f"Requisito: {req_txt}.")
    if ch in MUNICAO:
        partes.append(f"Consome 1 munição ({MUNICAO[ch]}) por cena de combate.")
    if payload: partes.append(payload.strip())
    custo, txt = EFEITOS[ef]
    partes.append(f"Efeito: {ef} ({custo}): {txt}.")
    if ch in MARCIAIS: partes.append("1x/turno não custa Stamina.")
    return ' '.join(partes)

def cmd_lote1():
    rows = {r['Nome']: r for r in load()}
    print("LOTE 1 — 15 ARMAS GENÉRICAS BASE\n" + "="*78)
    for ch,(dado,attr,dano,ef,ac,req) in ARMAS_CANON.items():
        nome = f"Arma {ch}"
        r = rows.get(nome)
        atual = r['Efeito'] if r else '(item ausente do CSV)'
        rar = r['Raridade'] if r else '—'
        val = r['Valor (Sins)'] if r else '—'
        novo = descricao_canonica(ch)
        igual = (atual == novo)
        print(f"\n### {nome}  |  {rar}  |  {val} Sins   {'✅ já correto' if igual else '🔴 desatualizado'}")
        print(f"  ATUAL : {atual}")
        if not igual:
            print(f"  CANON : {novo}")
            dc = dpr(dado, ac)
            md = re.search(r'(\d+d\d+)', atual); ma = re.search(r'Atacar\((\d)\)', atual)
            if md and ma:
                da = dpr(md.group(1), int(ma.group(1)))
                if abs(da-dc) > 0.01:
                    print(f"  DPR   : {da:.2f} → {dc:.2f}  ({(dc/da-1)*100:+.0f}%)")


def partes_arma(efeito):
    """Extrai (chassi, nivel, payload_unico) da descrição atual de uma arma."""
    ch = chassi(efeito)
    if ch is None: return None, 0, ''
    m = re.match(re.escape(ch) + r'\s*(?:\+(\d))?\.', efeito)
    nivel = int(m.group(1)) if (m and m.group(1)) else 0
    # payload = o que estiver entre o fim da frase "Requisito: ..." e "Efeito:"
    mr = re.search(r'Requisito:[^.]*\.', efeito)
    me = re.search(r'Efeito:', efeito)
    payload = ''
    if mr and me and me.start() > mr.end():
        payload = efeito[mr.end():me.start()].strip()
        # descarta o que o gerador reinsere sozinho
        payload = re.sub(r'Alcance \d+[,\d]* m\.', '', payload)
        payload = re.sub(r'Consome 1 munição \([^)]*\) por cena de combate\.', '', payload)
        payload = re.sub(r'1x/turno não custa Stamina\.', '', payload)
        payload = re.sub(r'\s+', ' ', payload).strip()
    return ch, nivel, payload

def cmd_aplicar(dry=True):
    """Reescreve a coluna Efeito de todas as armas com chassi, a partir do cânone."""
    rows = list(csv.reader(open(CSV, encoding='utf-8')))
    hdr = {i for i,r in enumerate(rows) if r[1] == 'Categoria'}
    mud, mantidos, pulados = [], 0, 0
    for i,r in enumerate(rows):
        if i in hdr or r[1] != 'Arma': continue
        ch, nivel, payload = partes_arma(r[3])
        if ch is None: pulados += 1; continue
        novo = descricao_canonica(ch, nivel, payload)
        if novo != r[3]: mud.append((i, r[0], r[3], novo))
        else: mantidos += 1
    print(f"{'[DRY-RUN] ' if dry else ''}armas a alterar: {len(mud)} | já corretas: {mantidos} | "
          f"sem chassi (focos): {pulados}")
    for i,n,a,b in mud[:6]:
        print(f"\n  {n}\n   - {a}\n   + {b}")
    if len(mud) > 6: print(f"\n  ... +{len(mud)-6} outras")
    if not dry:
        for i,n,a,b in mud: rows[i][3] = b
        with open(CSV, 'w', encoding='utf-8', newline='') as f:
            csv.writer(f).writerows(rows)
        print(f"\n✅ CSV reescrito: {len(mud)} armas atualizadas.")


# ---- Focos Místicos --------------------------------------------------------
# Requisito da família Místicas (Notion): INT >= 12. Foco Primordial: Experiente
# em Místico (é o gate das magias de nível 4). Escala: +N Místico, +5N Éter máx.
FOCO_EFEITOS = {   # efeitos únicos aprovados pelo Pedro (lote 2)
 'Foco da Égide':      'Ao conjurar uma magia de Abjuração, remova 1 condição do alvo como ação livre.',
 'Foco do Estilhaço':  'Suas magias de Destruição de alvo único causam +1d6 de dano de Força a alvos adjacentes.',
 'Foco da Premonição': 'Como reação, 1x por combate: força uma criatura a repetir um teste de ataque ou '
                       'resistência contra você, ficando com o pior resultado.',
 'Foco do Baluarte':   'Com 3 ações, você pode canalizar uma barreira mística em formato de domo impenetrável '
                       'com 3 m de raio. A barreira não pode ser destruída por meios materiais, apenas sob seu '
                       'comando ao gastar 1 ação para dissipá-la. A barreira dura 3 rodadas, porém você deve '
                       'sustentá-la em cada uma dessas rodadas gastando 3 ações, ou ao final do seu turno em que '
                       'você negligenciou esse custo, ela se dissipa imediatamente.',
 'Foco do Demiurgo':   'Como 1 ação, você pode manipular terreno como se estivesse canalizando a magia Plasmar '
                       'Terreno. Esse efeito não gasta Éter, porém você pode utilizá-lo apenas 3x/Descanso Longo.',
 'Foco do Inquebrável':'Como reação, você recupera 2d10+Mod. Constituição de Saúde, 2d8+Mod. Destreza de Stamina '
                       'e 2d6+Mod. Inteligência ou Sabedoria de Éter e, se quiser, imediatamente se teletransporta '
                       'a até 9 m. 1x/Descanso Longo.',
}

def foco_canonico(nome, efeito):
    """Normaliza a descrição de um foco: escola, escala, requisito, efeito único."""
    esc = re.search(r'Foco Místico \(([^)]+)\)', efeito)
    if not esc: return efeito
    escola = esc.group(1)
    prim = (escola == 'Primordial')
    mis = re.search(r'\+(\d) Místico', efeito)
    nivel = int(mis.group(1)) if mis else 0
    if prim: nivel = 3                      # focos Primordiais são lategame nv5 = +3 (D-lote2 #5)
    abre = (f"Foco Místico (Primordial). Permite canalizar magias Primordiais "
            f"(todas as magias de nível 4)." if prim else
            f"Foco Místico ({escola}). Permite canalizar magias da escola de {escola}.")
    escala = (f"+{nivel} Místico, +{5*nivel} Éter máximo." if nivel else "Sem bônus.")
    prof = 'Experiente' if prim else 'Treinado'
    req = f"Requisito: Inteligência ≥ 12 e {prof} em Místico."
    partes = [abre, escala, req]
    # efeito único: o aprovado, senão preserva o que já existe
    if nome in FOCO_EFEITOS:
        partes.append(FOCO_EFEITOS[nome])
    else:
        resto = efeito
        for pat in [r'Foco Místico \([^)]+\)\.', r'Permite canalizar magias[^.]*\.',
                    r'\+\d Místico, \+\d+ Éter máximo\.', r'Sem bônus\.',
                    r'Requer Treinado em Místico\.', r'Requisito:[^.]*\.']:
            resto = re.sub(pat, '', resto)
        resto = re.sub(r'\s+', ' ', resto).strip()
        if resto: partes.append(resto)
    return ' '.join(partes)

def cmd_focos(dry=True):
    rows = list(csv.reader(open(CSV, encoding='utf-8')))
    hdr = {i for i,r in enumerate(rows) if r[1] == 'Categoria'}
    mud = []
    for i,r in enumerate(rows):
        if i in hdr or r[1] != 'Arma' or 'Foco Místico' not in r[3]: continue
        novo = foco_canonico(r[0], r[3])
        if novo != r[3]: mud.append((i, r[0], r[3], novo))
    print(f"{'[DRY-RUN] ' if dry else ''}focos a alterar: {len(mud)}")
    for i,n,a,b in mud:
        print(f"\n  {n}\n   - {a}\n   + {b}")
    if not dry:
        for i,n,a,b in mud: rows[i][3] = b
        with open(CSV, 'w', encoding='utf-8', newline='') as f:
            csv.writer(f).writerows(rows)
        print(f"\n✅ {len(mud)} focos atualizados.")

# ---------------------------------------------------------------- comandos --
def cmd_dump(cat=None, familia=None, raridade=None):
    rows = load()
    if cat: rows = [r for r in rows if r['Categoria'].lower() == cat.lower()]
    if raridade: rows = [r for r in rows if r['Raridade'].lower() == raridade.lower()]
    if familia and cat and cat.lower() == 'arma':
        rows = [r for r in rows if familia_arma(r['Nome']) == familia]
    ordem = ['Lixo','Ordinário','Incomum','Exótico','Luxária']
    rows.sort(key=lambda r: (ordem.index(r['Raridade']) if r['Raridade'] in ordem else 9, r['Nome']))
    for r in rows:
        print(f"\n### {r['Nome']}  |  {r['Raridade']}  |  {r['Valor (Sins)']} Sins")
        print(f"    {r['Efeito']}")
        extra = [f"{k}: {r[k]}" for k in ('Efeito_Jogador','Obtenção','Tipo de Craft','Ingredientes','Tags')
                 if r.get(k, '').strip()]
        if extra: print(f"    [{' · '.join(extra)}]")
    print(f"\n--- {len(rows)} itens ---")

def cmd_armas():
    rows = [r for r in load() if r['Categoria'] == 'Arma']
    print("AUDITORIA DE ARMAS — CSV v26 x cânone do Notion\n")
    print(f"{'CHASSI':22} {'NOTION':11} {'CSV base':11} STATUS")
    problemas, sem_efeito, sem_marcial = [], [], []
    porchassi = collections.defaultdict(list)
    for r in rows:
        c = chassi(r['Efeito']); porchassi[c].append(r)
    for t,(cd,attr,dano,ef,ca,req) in ARMAS_CANON.items():
        base = [r for r in porchassi[t] if nivel_arma(r['Nome']) == 0 and r['Nome'].startswith('Arma ')]
        if not base:
            print(f"{t:22} {cd+'/A'+str(ca):11} {'AUSENTE':11} 🔴 sem genérica base"); continue
        r = base[0]
        md = re.search(r'(\d+d\d+)', r['Efeito']); ma = re.search(r'Atacar\((\d)\)', r['Efeito'])
        cvd, cva = (md.group(1) if md else '?'), (int(ma.group(1)) if ma else 0)
        ok = (cvd == cd and cva == ca)
        print(f"{t:22} {cd+'/A'+str(ca):11} {cvd+'/A'+str(cva):11} {'OK' if ok else '🔴 DIVERGE'}")
        if not ok:
            dc, dv = dpr(cd, ca), dpr(cvd, cva)
            problemas.append((t, cd, ca, cvd, cva, dc, dv, len(porchassi[t])))
    # efeito declarado?
    for r in rows:
        c = chassi(r['Efeito'])
        if not c: continue
        ef = ARMAS_CANON[c][3]
        if ef.lower() not in (r['Efeito'] or '').lower(): sem_efeito.append((r['Nome'], c, ef))
        if c in MARCIAIS and '1x/turno' not in r['Efeito'].lower().replace('1×','1x') \
           and 'sem gastar stamina' not in r['Efeito'].lower() and 'não custa stamina' not in r['Efeito'].lower():
            sem_marcial.append((r['Nome'], c))
    if problemas:
        print("\n=== IMPACTO NO DPR (nv1, mod +3, alvo Ev 14) ===")
        for t,cd,ca,vd,va,dc,dv,n in problemas:
            print(f"  {t:22} Notion {cd}/A{ca} DPR {dc:5.2f} | CSV {vd}/A{va} DPR {dv:5.2f} "
                  f"| Δ {dv-dc:+6.2f} ({(dv/dc-1)*100:+5.0f}%) | {n} itens no chassi")
    print(f"\n🔴 Armas sem o efeito canônico no texto: {len(sem_efeito)}")
    for n,c,e in sem_efeito[:10]: print(f"     {n}  (chassi {c} exige '{e}')")
    if len(sem_efeito) > 10: print(f"     ... +{len(sem_efeito)-10}")
    print(f"\n🔴 Marciais sem a cláusula '1x/turno sem gastar Stamina': {len(sem_marcial)}")
    for n,c in sem_marcial[:10]: print(f"     {n}  ({c})")
    if len(sem_marcial) > 10: print(f"     ... +{len(sem_marcial)-10}")
    g = sum(1 for r in rows if familia_arma(r['Nome']) == 'genérica')
    print(f"\nFamílias: {g} genéricas · {len(rows)-g} únicas · {len(rows)} total")
    print(f"Sem chassi declarado no texto: {sum(1 for r in rows if not chassi(r['Efeito']))}")

def cmd_familias(cat=None):
    rows = load()
    cats = [cat] if cat else sorted({r['Categoria'] for r in rows})
    for c in cats:
        sub = [r for r in rows if r['Categoria'] == c]
        print(f"\n=== {c}  ({len(sub)} itens) ===")
        rr = collections.Counter(r['Raridade'] for r in sub)
        print("   raridade:", dict(rr))
        tags = collections.Counter()
        for r in sub:
            for t in re.split(r'[,;/]', r.get('Tags','')):
                if t.strip(): tags[t.strip()] += 1
        if tags: print("   tags:", dict(tags.most_common(12)))
        craft = collections.Counter(r['Tipo de Craft'] for r in sub)
        print("   craft:", dict(craft))

def cmd_precos():
    rows = load(); bad = []
    for r in rows:
        exp = RARIDADE.get(r['Raridade'], (None,))[0]
        v = (r['Valor (Sins)'] or '').strip()
        if exp and v != exp: bad.append((r['Nome'], r['Categoria'], r['Raridade'], v, exp))
    print(f"Itens cujo Valor(Sins) não bate com a faixa da raridade: {len(bad)} de {len(rows)}")
    for n,c,rar,v,e in bad[:25]: print(f"  {n[:42]:42} [{c}/{rar}] {v!r} != {e}")
    if len(bad) > 25: print(f"  ... +{len(bad)-25}")

def cmd_travas():
    rows = load()
    padroes = {
      '⚠️ AÇÃO EXTRA':      r'\+1 [Aa]ção|ação extra|ganha 1 ação|ação adicional',
      '⚠️ ANULA PMA':       r'sem penalidade|penalidade de m[úu]lti|ignora.{0,15}penalidade',
      '⚠️ MARGEM CRÍTICO':  r'cr[íi]tico em 19|margem de cr[íi]tico|crita em 19',
      '⚠️ EXPOSTO':         r'\bExposto\b',
      '⚠️ DADO DE ARMA':    r'\+\d+ dados? de dano|aumenta o dado',
      '⚠️ AÇÃO LIVRE':      r'[Aa]ção [Ll]ivre',
      '⚠️ REAÇÃO EXTRA':    r'recupera.{0,12}reação|reação adicional|sem gastar reação',
      '⚠️ CURA FIXA':       r'recupera \d+d\d+ de Sa[úu]de|cura \d+d\d+',
      '⚠️ Ar/Ae ALTO':      r'A[re]\s*\(?\s*([5-9]|\d\d)',
      '⚠️ IMUNIDADE':       r'[Ii]mune a|[Ii]munidade',
    }
    achados = collections.defaultdict(list)
    for r in rows:
        txt = ' '.join([r['Efeito'], r.get('Efeito_Jogador','')])
        for k,p in padroes.items():
            if re.search(p, txt): achados[k].append(r)
    for k in padroes:
        lst = achados[k]
        print(f"\n{k}  ({len(lst)})")
        for r in lst[:8]:
            print(f"   [{r['Categoria']}/{r['Raridade']}] {r['Nome']}: {r['Efeito'][:120]}")
        if len(lst) > 8: print(f"   ... +{len(lst)-8}")

def cmd_economia():
    print("LOOP DE SINS — simulação\n")
    print("Comerciantes (Notion):  nv1 estoque 100, repõe diário,  vende a 50%")
    print("                        nv2 estoque 250, repõe 2 dias,  vende a 66%  (custo 250)")
    print("                        nv3 estoque 500, repõe 3 dias,  vende a 75%  (custo 500)\n")
    for nv,(est,rep,pct,custo) in {1:(100,1,.50,0),2:(250,2,.66,250),3:(500,3,.75,500)}.items():
        print(f"  nv{nv}: estoque {est:3}  repõe/{rep}d  margem {pct:.0%}  investido acumulado {[0,0,250,750][nv]}")
    print("\n1) PAYBACK DA MARGEM — quanto precisa vender para o upgrade se pagar")
    for de,para,custo,d1,d2 in [(1,2,250,.50,.66),(2,3,500,.66,.75)]:
        ganho = d2-d1
        print(f"   nv{de}→nv{para}: custa {custo} Sins, ganho de margem {ganho:+.0%}"
              f"  →  precisa vender {custo/ganho:,.0f} Sins de loot para empatar"
              f"  (~{custo/ganho/RARIDADE['Incomum'][3]:.0f} itens Incomuns)".replace(',','.'))
    print("\n2) TETO DE ESTOQUE x VALOR DE LOOT — o comerciante consegue comprar?")
    for rar,(exp,mn,mx,med) in RARIDADE.items():
        linha = f"   {rar:10} média {med:6.1f} Sins  |"
        for nv,est in ((1,100),(2,250),(3,500)):
            linha += f"  nv{nv}: {'OK ' if med<=est else 'NÃO'}"
        print(linha)
    print("\n3) O QUE O JOGADOR RECEBE ao vender (média por raridade x nível do comerciante)")
    print(f"   {'raridade':10} {'nv1 50%':>9} {'nv2 66%':>9} {'nv3 75%':>9}")
    for rar,(exp,mn,mx,med) in RARIDADE.items():
        print(f"   {rar:10} {med*.50:9.1f} {med*.66:9.1f} {med*.75:9.1f}")
    print("\n4) RENDA PASSIVA CONCORRENTE")
    print(f"   Origem Caçador: 1 item Incomum vendável por descanso longo = {RARIDADE['Incomum'][3]:.0f} Sins/dia brutos")
    print(f"   → vendido a nv3: {RARIDADE['Incomum'][3]*.75:.1f} Sins/dia. Em 10 dias: {RARIDADE['Incomum'][3]*.75*10:.0f} Sins")
    print(f"   Sins iniciais por origem: mediana 12, faixa 2,5–29")
    print(f"   → um Ordinário médio ({RARIDADE['Ordinário'][3]:.0f}) já é mais que a mediana inicial")

def cmd_cobertura():
    rows = load()
    chaves = {
     'Espadachim':r'[Mm]arcia|retalia|Marca do Duelo|Defender',
     'Brutalista':r'Fortitude|Ar\b|Armadura|corpo a corpo|[Pp]esada|Frenesi|Sa[úu]de',
     'Monge':r'desarmad|Fluxo|Movimento|[Mm]arcia|Vontade',
     'Batedor':r'[Ff]urtiv|Sobreviv|Percep|[Àà] [Dd]ist[âa]nc|Crime',
     'Artilheiro':r'[Àà] [Dd]ist[âa]nc|[Mm]uniç|Concentraç|disparo|arco|besta',
     'Alquimista':r'[Aa]lquim|poção|elixir|reagent|Medicina|granada|bomba',
     'Teurgo':r'[Mm][íi]stic|[ÉEé]ter|magia|[Ff]oco|conjur|pergaminho',
    }
    print("COBERTURA POR ARQUÉTIPO — itens que não citam nada de nenhuma classe\n")
    orfaos = []
    for r in rows:
        if r['Categoria'] in ('Material','Lixo'): continue
        txt = ' '.join([r['Nome'], r['Efeito'], r.get('Tags','')])
        hits = [c for c,p in chaves.items() if re.search(p, txt)]
        if not hits: orfaos.append(r)
    print(f"Itens sem gancho óbvio de classe: {len(orfaos)}")
    porcat = collections.Counter(r['Categoria'] for r in orfaos)
    print("por categoria:", dict(porcat))
    for r in orfaos[:20]:
        print(f"   [{r['Categoria']}/{r['Raridade']}] {r['Nome']}: {r['Efeito'][:100]}")
    if len(orfaos) > 20: print(f"   ... +{len(orfaos)-20}")

if __name__ == '__main__':
    a = sys.argv[1:] or ['armas']
    cmd = a[0]
    def opt(f):
        return a[a.index(f)+1] if f in a else None
    if cmd == 'dump':
        pos = [x for x in a[1:] if not x.startswith('--')]
        pos = [x for i,x in enumerate(pos) if i == 0 or pos[i-1] not in ('--familia','--raridade')]
        cmd_dump(a[1] if len(a) > 1 and not a[1].startswith('--') else None,
                 opt('--familia'), opt('--raridade'))
    elif cmd == 'armas':     cmd_armas()
    elif cmd == 'familias':  cmd_familias(a[1] if len(a) > 1 else None)
    elif cmd == 'precos':    cmd_precos()
    elif cmd == 'travas':    cmd_travas()
    elif cmd == 'economia':  cmd_economia()
    elif cmd == 'cobertura': cmd_cobertura()
    elif cmd == 'lote1':     cmd_lote1()
    elif cmd == 'aplicar':   cmd_aplicar(dry='--go' not in a)
    elif cmd == 'focos':     cmd_focos(dry='--go' not in a)
    elif cmd == 'dpr':
        d, ac = a[1], int(a[2]); mod = int(a[3]) if len(a) > 3 else 3
        print(f"{d} / Atacar({ac}) / mod +{mod}  →  D={media_dado(d):.1f}  DPR={dpr(d,ac,mod):.2f}")
    else: print(__doc__)
