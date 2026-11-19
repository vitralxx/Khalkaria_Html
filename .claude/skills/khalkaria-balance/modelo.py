"""Modelo de acerto e DPR do Khalkaria, pelas regras reais (v2, 2026-11-19, D176).

O modelo antigo (Atacar +5 contra Evasão 14, 60/35/10%) só vale no nível 1. Este considera:
- o atributo principal sobe +2 por nível (Limiar), e +2 a mais com a 6ª carta;
- o treino (graus: 1 Treinado ... 4 Lendário, +2 cada) por perfil e nível;
- o nível da arma (+N Atacar e +N dados);
- a criatura: Evasão passiva baixa (13 no CR 3) e a Ativa = passiva + dado de Defender pelo grau;
- o PMA (-5 por ataque) e o crítico no 20 natural (dobra os dados).

Regras opcionais (o pacote proposto ao Pedro): --gate (grau máximo por nível), --a18 (acima de 18 o atributo
custa 2 pontos por +1), --d2 (Defender 1d6/1d10/2d6/2d8/2d10).

Uso:
  python3 modelo.py tabela [--gate] [--a18] [--d2] [--regua]
  python3 modelo.py dpr 1d6 1 --nivel 3 --perfil focado [--alvo passiva] [--gate --a18 --d2] [--regua]
"""
import argparse, itertools

PERFIS = {  # atributo no N1, usa a 6ª carta, grau por nível (1..5), nível da arma por nível (1..5)
    'tipico': dict(a0=18, sexta=False, grau=[1, 2, 2, 2, 2], arma=[0, 0, 1, 1, 2]),
    'focado': dict(a0=20, sexta=False, grau=[2, 3, 3, 4, 4], arma=[0, 1, 2, 3, 3]),
    'maximo': dict(a0=21, sexta=True, grau=[3, 4, 4, 4, 4], arma=[0, 1, 2, 3, 3]),
}
GATE = [2, 2, 3, 3, 4]                      # Experiente no N1, Mestre no N3, Lendário no N5
DEFENDER = {'atual': [(1, 6), (1, 8), (1, 10), (1, 12), (2, 8)],
            'd2': [(1, 6), (1, 10), (2, 6), (2, 8), (2, 10)]}
CRIATURA = {  # grau de Defender por CR (1..5)
    'bestiario': [1, 1, 2, 2, 3],           # suposição: o que o Bestiário parece usar hoje
    'regua': [1, 2, 3, 3, 4],               # proposta: o Defender sobe com o CR
}


def mod(a):
    return (int(a) - 10) // 2


def atributo(perfil, nivel, a18=False):
    p = PERFIS[perfil]
    a = float(p['a0'])
    for _ in range(2 * (nivel - 1) * (2 if p['sexta'] else 1)):
        a += 0.5 if (a18 and a >= 18) else 1
    return min(30, int(a))


def atacar(perfil, nivel, gate=False, a18=False):
    p = PERFIS[perfil]
    grau = p['grau'][nivel - 1]
    if gate:
        grau = min(grau, GATE[nivel - 1])
    return mod(atributo(perfil, nivel, a18)) + 2 * grau + p['arma'][nivel - 1]


def dados(n, f):
    return [sum(c) for c in itertools.product(range(1, f + 1), repeat=n)]


def p_acerto(A, E, dado=(0,)):
    """d20 + A >= E + dado; 20 natural acerta, 1 natural erra."""
    tot = 0
    for d in dado:
        tot += sum(1 for r in range(1, 21) if r == 20 or (r != 1 and r + A >= E + d)) / 20
    return tot / len(dado)


def defesa(cr, alvo='ativa', d2=False, regua=False, passiva=13):
    if alvo == 'passiva':
        return passiva, (0,)
    grau = CRIATURA['regua' if regua else 'bestiario'][cr - 1]
    n, f = DEFENDER['d2' if d2 else 'atual'][grau]
    return passiva, dados(n, f)


def taxas(A, E, dado, ataques=3):
    return [p_acerto(A - 5 * i, E, dado) for i in range(ataques)]


def dpr(arma, acoes, nivel, perfil, alvo='ativa', gate=False, a18=False, d2=False, regua=False):
    n, f = (int(x) for x in arma.lower().split('d'))
    nd = n + PERFIS[perfil]['arma'][nivel - 1]
    D = nd * (f + 1) / 2
    m = mod(atributo(perfil, nivel, a18))
    A = atacar(perfil, nivel, gate, a18)
    E, dado = defesa(nivel, alvo, d2, regua)
    ts = taxas(A, E, dado, 3 if acoes == 1 else 1)
    return sum(t * (D + m) + 0.05 * D for t in ts), ts, A


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('cmd', choices=['tabela', 'dpr'])
    ap.add_argument('arma', nargs='?')
    ap.add_argument('acoes', nargs='?', type=int)
    ap.add_argument('--nivel', type=int, default=1)
    ap.add_argument('--perfil', default='tipico', choices=list(PERFIS))
    ap.add_argument('--alvo', default='ativa', choices=['ativa', 'passiva'])
    for flag in ('gate', 'a18', 'd2', 'regua'):
        ap.add_argument('--' + flag, action='store_true')
    a = ap.parse_args()
    o = dict(gate=a.gate, a18=a.a18, d2=a.d2, regua=a.regua)
    if a.cmd == 'tabela':
        print('Perfil | N1 | N3 | N5   (Atacar, 1º ataque contra a Ativa, acertos/turno Ativa/Passiva)')
        for pf in PERFIS:
            cel = []
            for nv in (1, 3, 5):
                A = atacar(pf, nv, a.gate, a.a18)
                E, dado = defesa(nv, 'ativa', a.d2, a.regua)
                ta, tp = taxas(A, E, dado), taxas(A, E, (0,))
                cel.append(f'+{A} {ta[0]*100:.0f}% {sum(ta):.2f}/{sum(tp):.2f}')
            print(f'{pf:<7}| ' + ' | '.join(cel))
    else:
        v, ts, A = dpr(a.arma, a.acoes, a.nivel, a.perfil, a.alvo, **o)
        print(f'Atacar +{A}; acerto por ataque: ' + ' / '.join(f'{t*100:.0f}%' for t in ts) + f'; DPR {v:.1f}')


if __name__ == '__main__':
    main()
