"""Compara duas rodadas do tools/estilo/cascata.html (vencedor DECLARADO da cascata por
elemento|pseudo x propriedade, com :hover/:focus ligados, 5 larguras e reduced-motion).

Uso:  python tools/estilo/cascata_diff.py tools/testes/estilo/cascata-antes                                           tools/testes/estilo/cascata-depois [filtro] [--com-var] [--detalhe]
Ignora propriedades --* (a não ser com --com-var) e declarações que só aparecem
DEPOIS vindas das regras globais novas da F1c (NOVAS: :focus-visible e o * do
movimento reduzido), que não tinham rival antes. Imprime os pares
(regra vencedora antes => depois) com a contagem; --detalhe lista valor a valor.
Para comparar árvores diferentes (antes = worktree do commit anterior), rode
servidor.py em cada uma, em portas distintas."""
import collections
import gzip
import json
import os
import sys

args = [a for a in sys.argv[1:] if not a.startswith('--')]
A, B = args[0], args[1]
so = args[2] if len(args) > 2 else ''
ign_prefix = () if '--com-var' in sys.argv else ('--',)
tot = collections.Counter()
NOVAS = {'style.css :focus-visible', 'style.css *', 'style.css ::before', 'style.css ::after'}
exemplos = collections.defaultdict(list)
for nome in sorted(os.listdir(A)):
    if so and so not in nome:
        continue
    fb = os.path.join(B, nome)
    if not os.path.exists(fb):
        print('falta em B:', nome); continue
    da = json.loads(gzip.open(os.path.join(A, nome)).read())
    db = json.loads(gzip.open(fb).read())
    for modo in ('normal', 'reduzido'):
        a, b = da[modo], db[modo]
        ta, tb = a['tab'], b['tab']
        for cam in set(a['els']) | set(b['els']):
            pa = a['els'].get(cam, {}); pb = b['els'].get(cam, {})
            for p in set(pa) | set(pb):
                if ign_prefix and p.startswith(ign_prefix):
                    continue
                va = ta[pa[p][0]] if p in pa else None
                vb = tb[pb[p][0]] if p in pb else None
                if va != vb:
                    if va is None and p in pb and tb[pb[p][1]] in NOVAS:
                        continue
                    sa = ta[pa[p][1]] if p in pa else '-'
                    sb = tb[pb[p][1]] if p in pb else '-'
                    k = (modo, p, va, vb, sa, sb)
                    tot[k] += 1
                    if len(exemplos[k]) < 2:
                        exemplos[k].append(nome + ' ' + cam[-90:])
print('grupos', len(tot), 'ocorrências', sum(tot.values()))
for k, n in (sorted(tot.items(), key=lambda x: (-x[1])) if '--detalhe' in sys.argv else []):
    modo, p, va, vb, sa, sb = k
    print('%5d %s %s: %r -> %r\n      antes: %s\n      depois: %s\n      ex: %s' % (n, modo, p, va, vb, sa[:140], sb[:140], ' | '.join(exemplos[k])))
print('\n==== por par de regras (antes -> depois) ====')
par = collections.Counter(); pex = {}
for (modo, p, va, vb, sa, sb), n in tot.items():
    par[(modo, sa, sb)] += n
    pex.setdefault((modo, sa, sb), set()).add(p.split('-')[0] if not p.startswith('--') else p)
for k, n in sorted(par.items(), key=lambda x: -x[1]):
    print('%6d %-8s %s  =>  %s   [%s]' % (n, k[0], k[1][:90], k[2][:90], ','.join(sorted(pex[k]))[:60]))
sys.exit(1 if par else 0)
