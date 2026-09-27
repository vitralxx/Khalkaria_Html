"""Análise ESTÁTICA de camadas: pares de regras cuja vencedora muda com @layer.

Modelo antigo = a mesma folha sem camada (mesma ordem de regras; vale enquanto a
migração só embrulha trechos no lugar). Considera todas as @media juntas e trata
:hover/:focus como verdadeiros. Só lista pares que podem casar o MESMO elemento de
uma captura da página: sujeito (tag, id, classes) e ancestrais (compostos antes de
' ' e '>') conferidos contra os caminhos de tools/testes/estilo/<cascata>/. Classe
nunca vista na página conta como estado posto por JS (curinga, com o mesmo prefixo
"xx-" de alguma classe do elemento) só se o js/*.js a escreve; senão é impossível.
Falso positivo conhecido: dois ids diferentes (um deles nunca visto) no mesmo par.

Uso:  python tools/estilo/pares.py tools/testes/estilo/regras-depois                                     tools/testes/estilo/cascata-depois  [--estrito]
(regras-* sai de tools/estilo/regras.html?rotulo=regras-depois;
 cascata-* de tools/estilo/cascata.html?rotulo=cascata-depois)
--estrito: classe nunca vista = impossível (só o que as capturas provam)."""
import collections
import glob
import gzip
import json
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
args = [a for a in sys.argv[1:] if not a.startswith('--')]
REG, CAPS = args[0], args[1]
MODO = 'estrito' if '--estrito' in sys.argv else ''
JSW = set()
for f in glob.glob(os.path.join(RAIZ, 'js', '*.js')):
    txt = open(f, encoding='utf-8').read()
    for m in re.finditer(r"class(?:Name)?\s*[=:]\s*['\"]([^'\"]*)['\"]|class=\?['\"]([^'\"]*)|classList\.(?:add|toggle|remove|replace)\(([^)]*)\)|setAttribute\(\s*['\"]class['\"]\s*,\s*([^)]*)\)", txt):
        JSW |= set(re.findall(r'[A-Za-z][\w-]*', ' '.join(g for g in m.groups() if g)))

def impossiveis(cls):
    pref = [w for w in JSW if w.endswith('-')]
    return {c for c in cls if c not in JSW and not any(c.startswith(p) for p in pref)}

def split_comb(sel):
    out, d, cur, comb = [], 0, '', ' '
    for ch in sel:
        if ch in '([': d += 1
        if ch in ')]': d -= 1
        if d == 0 and ch in ' >+~':
            if cur.strip(): out.append((comb, cur.strip())); comb = ' '
            if ch in '>+~': comb = ch
            cur = ''
        else:
            cur += ch
    if cur.strip(): out.append((comb, cur.strip()))
    return out

def composto(c):
    base = re.sub(r':(not|is|where|has|nth-child|nth-of-type|nth-last-child)\([^()]*(\([^()]*\))?[^()]*\)', '', c)
    base = re.sub(r'::?[\w-]+(\([^)]*\))?', '', base)
    base = re.sub(r'\[[^\]]*\]', '', base)
    tag = re.match(r'[a-zA-Z][\w-]*', base)
    idm = re.search(r'#([\w-]+)', base)
    return (tag.group(0).lower() if tag else None, idm.group(1) if idm else None, frozenset(re.findall(r'\.([\w-]+)', base)))

PE = re.compile(r'::?(before|after|marker|placeholder|selection|-webkit-[\w-]+|first-line|first-letter)\b')
def analisa(sel):
    partes = split_comb(sel)
    if not partes: partes = [(' ', '*')]
    ult = partes[-1][1]
    m = PE.search(ult)
    pe = m.group(1) if m else ''
    suj = composto(ult)
    anc = []   # compostos ancestrais (antes de ' ' ou '>' — só os que ligam por descendência)
    for i in range(len(partes) - 1):
        # a parte i é ancestral se o combinador de TODAS as ligações depois dela até o sujeito
        # não for só irmão; simplificação: ignora os que vêm antes de '+'/'~'
        prox = partes[i + 1][0]
        if prox in (' ', '>'):
            anc.append(composto(partes[i][1]))
    return pe, suj, anc

# elementos por página: (tag, id, classes, classes_anc, ids_anc)
paginas = collections.defaultdict(set)
for n in (n for n in os.listdir(CAPS) if n.endswith('.json.gz')):
    pg = n.split('.')[0]
    d = json.loads(gzip.open(os.path.join(CAPS, n)).read())['normal']
    for cam in d['els']:
        segs = cam.split('|')[0].split('>')
        info = []
        for seg in segs:
            seg = re.sub(r':\d+$', '', seg)
            tag = re.match(r'[\w-]+', seg).group(0)
            idm = re.search(r'#([\w-]+)', seg)
            info.append((tag, idm.group(1) if idm else None, frozenset(re.findall(r'\.([\w-]+)', seg))))
        ac = frozenset(c for x in info[:-1] for c in x[2]); ai = frozenset(x[1] for x in info[:-1] if x[1])
        at = frozenset(x[0] for x in info[:-1])
        t, i, c = info[-1]
        paginas[pg].add((t, i, c, ac, ai, at))

def casa_fn(els):
    vc = set(); vi = set()
    for (t, i, c, ac, ai, at) in els:
        vc |= c | ac
        if i: vi.add(i)
        vi |= ai
    cache = {}
    def conj(sel):
        if sel in cache: return cache[sel]
        pe, (st, si, sc), anc = analisa(sel)
        inv = sc - vc
        sc = sc & vc
        if (MODO == 'estrito' and inv) or impossiveis(inv): cache[sel] = frozenset(); return cache[sel]
        pref = {x.split('-')[0] for x in inv if '-' in x}
        if si and si not in vi: si = None
        res = set()
        for k, (t, i, c, ac, ai, at) in enumerate(els):
            if st and st != t: continue
            if si and si != i: continue
            if not sc <= c: continue
            if pref and not all(any(y == p or y.startswith(p + '-') for y in c) for p in pref): continue
            ok = True
            for (a_t, a_i, a_c) in anc:
                if not (a_c & vc) <= ac: ok = False; break
                ainv = a_c - vc
                if ainv and (MODO == 'estrito' or impossiveis(ainv)): ok = False; break
                ap = {x.split('-')[0] for x in ainv if '-' in x}
                if ap and not all(any(y == p or y.startswith(p + '-') for y in ac | c) for p in ap): ok = False; break
                if a_i and a_i in vi and a_i not in ai: ok = False; break
                if a_t and a_t not in at: ok = False; break
            if ok: res.add(k)
        cache[sel] = frozenset(res)
        return cache[sel]
    return conj

acum = collections.Counter(); ex = {}
for n in sorted(n for n in os.listdir(REG) if n.endswith('.json.gz')):
    pg = n.split('.')[0]
    els = list(paginas.get(pg, ()))
    if not els:
        print('sem capturas para', pg); continue
    conj = casa_fn(els)
    d = json.loads(gzip.open(os.path.join(REG, n)).read())
    rank = {c: i for i, c in enumerate(d['camadas'])}
    UNL = len(rank)
    grupos = collections.defaultdict(list)
    for r in d['regras']:
        lr = UNL if r['cam'] == '' else rank[r['cam']]
        for s, sp in r['sels']:
            pe = analisa(s)[0]
            for p, v, imp in r['props']:
                if p.startswith('--'): continue
                grupos[(pe, p)].append((lr, tuple(sp), r['ordem'], imp, v, s, r['origem'], tuple(r['media'])))
    for (pe, p), L in grupos.items():
        for i in range(len(L)):
            a = L[i]
            for j in range(i + 1, len(L)):
                b = L[j]
                if a[0] == b[0] or (a[4], a[3]) == (b[4], b[3]): continue
                velho_a = (a[3], a[1], a[2]) > (b[3], b[1], b[2])
                if a[3] != b[3]: novo_a = a[3] > b[3]
                elif a[0] != b[0]: novo_a = (a[0] < b[0]) if a[3] else (a[0] > b[0])
                else: novo_a = (a[1], a[2]) > (b[1], b[2])
                if velho_a == novo_a: continue
                if not (conj(a[5]) & conj(b[5])): continue
                w_old, w_new = (a, b) if velho_a else (b, a)
                k = (w_old[6] + ' ' + w_old[5], w_new[6] + ' ' + w_new[5])
                acum[k] += 1
                ex.setdefault(k, (pg, p, w_old[4], w_new[4], w_old[7], w_new[7]))
print('pares', len(acum))
for k, c in sorted(acum.items()):
    e = ex[k]
    print('ANTES %s  | DEPOIS %s | %s %s: %r -> %r | media %s / %s' % (k[0][:90], k[1][:90], e[0], e[1], e[2][:50], e[3][:50], e[4], e[5]))
