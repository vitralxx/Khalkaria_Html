#!/usr/bin/env python3
"""Compara duas capturas de estilo computado (tools/estilo/captura.js).

    python tools/estilo/diff.py antes depois [--revisado tools/estilo/revisado.json]
                                [--max 30] [--so bazar] [--resumo]

`antes`/`depois` = rótulo (pasta em tools/testes/estilo/) ou caminho de pasta.
Compara captura a captura (<página>.<estado>), elemento por caminho estável
(html>body>…, cada segmento tag#id.classes:n) e propriedade por propriedade,
inclusive ::before/::after. Lista as diferenças por página/estado.

--revisado: lista de diferenças intencionais, cada uma
    {"pagina": glob do nome da captura, "caminho": glob do caminho,
     "prop": glob da propriedade, "antes": valor exato (opcional),
     "depois": valor exato (opcional), "motivo": "por que é intencional"}
  O que casar sai como "revisada" e não conta. `motivo` é obrigatório.

Sai com 0 se não sobrou diferença não revisada (nem captura faltando de um
lado), 1 se sobrou, 2 em erro de uso.
"""
import argparse
import fnmatch
import gzip
import json
import os
import sys
from collections import Counter

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BASE = os.path.join(RAIZ, 'tools', 'testes', 'estilo')
SUFIXOS = ('.json.gz', '.json')
AUSENTE = '(ausente)'


def pasta(arg):
    if os.path.isdir(arg):
        return arg
    p = os.path.join(BASE, arg)
    if os.path.isdir(p):
        return p
    sys.exit('diff.py: pasta de captura não encontrada: %s' % arg)


def lista(d):
    out = {}
    for n in os.listdir(d):
        for suf in SUFIXOS:
            if n.endswith(suf):
                out[n[:-len(suf)]] = os.path.join(d, n)
                break
    return out


def carrega(caminho):
    abre = gzip.open if caminho.endswith('.gz') else open
    with abre(caminho, 'rt', encoding='utf-8') as f:
        return json.load(f)


def expande(c):
    """captura comprimida -> {caminho: {prop: valor}} + metadados."""
    if c.get('formato') != 'kh-estilo/1':
        raise ValueError('formato desconhecido: %r' % c.get('formato'))
    V = c['valores']
    props, geo, pprops = c['props'], c['geo'], c['pprops']
    linhas, plinhas = c['linhas'], c['plinhas']
    caminhos = []
    out = {}
    for pai, seg, li, w, h, bi, ai in c['els']:
        cam = seg if pai < 0 else caminhos[pai] + '>' + seg
        caminhos.append(cam)
        d = {p: V[i] for p, i in zip(props, linhas[li])}
        d[geo[0]] = V[w]
        d[geo[1]] = V[h]
        for qual, pi in (('::before', bi), ('::after', ai)):
            if pi >= 0:
                for p, i in zip(pprops, plinhas[pi]):
                    d[qual + ' ' + p] = V[i]
        if cam in out:
            raise ValueError('caminho repetido: %s' % cam)
        out[cam] = d
    return out


def compara(a, b):
    """lista de (caminho, prop, antes, depois)."""
    difs = []
    for cam in sorted(set(a) | set(b)):
        if cam not in b:
            difs.append((cam, '(elemento)', 'existe', AUSENTE))
            continue
        if cam not in a:
            difs.append((cam, '(elemento)', AUSENTE, 'existe'))
            continue
        da, db = a[cam], b[cam]
        for p in sorted(set(da) | set(db)):
            va, vb = da.get(p, AUSENTE), db.get(p, AUSENTE)
            if va != vb:
                difs.append((cam, p, va, vb))
    return difs


def carrega_revisado(caminho):
    if not caminho:
        return []
    with open(caminho, encoding='utf-8') as f:
        r = json.load(f)
    regras = r.get('revisadas', []) if isinstance(r, dict) else r
    for i, x in enumerate(regras):
        if not x.get('motivo'):
            sys.exit('diff.py: revisado #%d sem "motivo"' % i)
    return regras


def revisada(regras, nome, cam, prop, va, vb):
    for x in regras:
        if not fnmatch.fnmatchcase(nome, x.get('pagina', '*')):
            continue
        if not fnmatch.fnmatchcase(cam, x.get('caminho', '*')):
            continue
        if not fnmatch.fnmatchcase(prop, x.get('prop', '*')):
            continue
        if 'antes' in x and x['antes'] != va:
            continue
        if 'depois' in x and x['depois'] != vb:
            continue
        return x
    return None


def main():
    ap = argparse.ArgumentParser(description='Diff de estilo computado entre duas capturas.')
    ap.add_argument('antes')
    ap.add_argument('depois')
    ap.add_argument('--revisado', help='JSON com as diferenças intencionais')
    ap.add_argument('--max', type=int, default=30, help='linhas por captura (0 = todas)')
    ap.add_argument('--so', default='', help='só capturas cujo nome contém isto')
    ap.add_argument('--resumo', action='store_true', help='só contagens por captura e por propriedade')
    a = ap.parse_args()
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')

    da, db = pasta(a.antes), pasta(a.depois)
    la, lb = lista(da), lista(db)
    regras = carrega_revisado(a.revisado)
    usadas = Counter()

    nomes = sorted(n for n in set(la) | set(lb) if a.so in n)
    if not nomes:
        print('nenhuma captura para comparar')
        return 2
    total = total_rev = faltando = 0
    por_prop = Counter()
    for nome in nomes:
        if nome not in la or nome not in lb:
            faltando += 1
            print('[FALTA] %s: só em %s' % (nome, a.antes if nome in la else a.depois))
            continue
        ca, cb = carrega(la[nome]), carrega(lb[nome])
        cab = []
        if ca.get('viewport') != cb.get('viewport'):
            cab.append('viewport %s -> %s' % (ca.get('viewport'), cb.get('viewport')))
        if ca.get('html') != cb.get('html'):
            cab.append('<html>/<body> %s -> %s' % (ca.get('html'), cb.get('html')))
        difs = compara(expande(ca), expande(cb))
        abertas, rev = [], 0
        for d in difs:
            x = revisada(regras, nome, *d)
            if x is not None:
                rev += 1
                usadas[id(x)] += 1
            else:
                abertas.append(d)
                por_prop[d[1]] += 1
        n_abertas = len(abertas) + len(cab)
        total += n_abertas
        total_rev += rev
        if not n_abertas:
            if rev and not a.resumo:
                print('[ok] %s (%d revisada(s))' % (nome, rev))
            continue
        print('[DIF] %s: %d diferença(s)%s' % (nome, n_abertas, ' + %d revisada(s)' % rev if rev else ''))
        if a.resumo:
            continue
        for s in cab:
            print('    ' + s)
        mostra = abertas if not a.max else abertas[:a.max]
        for cam, p, va, vb in mostra:
            print('    %s\n        %s: %s  ->  %s' % (cam, p, va, vb))
        if len(mostra) < len(abertas):
            print('    … mais %d (use --max 0)' % (len(abertas) - len(mostra)))

    for i, x in enumerate(regras):
        if not usadas[id(x)]:
            print('[aviso] revisado #%d não casou com nada: %s' % (i, x.get('motivo')))
    if por_prop:
        print('por propriedade: ' + ', '.join('%s %d' % kv for kv in por_prop.most_common(15)))
    print('RESUMO: %d captura(s), %d diferença(s) não revisada(s), %d revisada(s), %d faltando'
          % (len(nomes), total, total_rev, faltando))
    return 1 if (total or faltando) else 0


if __name__ == '__main__':
    sys.exit(main())
