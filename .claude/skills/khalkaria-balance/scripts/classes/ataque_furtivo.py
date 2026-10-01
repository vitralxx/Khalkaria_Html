"""Ataque Furtivo do Ladrão (18 §5.2): dano esperado por turno contra um alvo.

Uso: python3 .claude/skills/khalkaria-balance/scripts/classes/ataque_furtivo.py

Modelo (09 §1): Atacar +5 contra Evasão 14 dá 60/35/10% no 1º, 2º e 3º ataque do turno; +2 em Atacar soma
10 p.p. a cada ataque. Crítico natural: 5%. Atacar escondido conta o alvo como Desprevenido (não reage e fica
Exposto), então o 1º ataque, se acertar, é crítico. O crítico dobra os dados da arma; o dado de técnica não
dobra (19 §9). O Ataque Furtivo soma +1d6 por acerto no turno e tira a reação do alvo até o fim do turno.
"""

BASE = [0.60, 0.35, 0.10]


def p_acerto(i, bonus_atacar):
    return max(0.05, min(0.95, BASE[i] + 0.05 * bonus_atacar))


def turno(dado, mod, ataques, escondido=False, furtivo=0.0, varredura=0.0, bonus_atacar=0):
    """dado = média dos dados da arma; furtivo = média do dado do Ataque Furtivo (3,5 para 1d6)."""
    esperado, sem_acerto_ainda = 0.0, 1.0
    for i in range(ataques):
        p = p_acerto(i, bonus_atacar)
        normal, critico = dado + mod, 2 * dado + mod
        if escondido and i == 0:
            por_acerto = critico                                  # Exposto: o acerto é crítico
        else:
            por_acerto = (0.05 / p) * critico + (1 - 0.05 / p) * normal
        por_acerto += (furtivo if escondido else 0.0) + sem_acerto_ainda * varredura
        esperado += p * por_acerto
        sem_acerto_ainda *= (1 - p)                               # Varredura: só o 1º acerto do turno
    return esperado


CASOS = [
    ('Sem esconder, sem mapa', dict()),
    ('Escondido, só a regra do Sistema', dict(escondido=True)),
    ('+ Ataque Furtivo (1d6)', dict(escondido=True, furtivo=3.5)),
    ('+ Varredura (mapa)', dict(escondido=True, furtivo=3.5, varredura=3.5)),
    ('+ Estudo de Campo (+2 Atacar)', dict(escondido=True, furtivo=3.5, varredura=3.5, bonus_atacar=2)),
]

if __name__ == '__main__':
    print('Nível 2, mod +3. Dano esperado por turno.')
    print('%-36s %8s %8s' % ('', 'Leve', 'Pesada'))
    for nome, kw in CASOS:
        print('%-36s %8.1f %8.1f' % (nome, turno(3.5, 3, 3, **kw), turno(6.5, 3, 1, **kw)))
    loop = turno(3.5, 3, 2, escondido=True, furtivo=3.5, varredura=3.5, bonus_atacar=2)
    print('%-36s %8.1f %8s' % ('Loop: 2 ataques + se esconder', loop, '(=acima)'))
    print()
    print('Nível 4 (leve +1 = 2d6, pesada 2d12, mod +4), pacote completo:')
    for nome, furtivo in [('Ataque Furtivo 1d6', 3.5), ('Ataque Furtivo 2d6', 7.0), ('sem Ataque Furtivo', 0.0)]:
        kw = dict(escondido=True, furtivo=furtivo, varredura=3.5, bonus_atacar=2)
        print('  %-20s leve %5.1f   pesada %5.1f' % (nome, turno(7.0, 4, 3, **kw), turno(13.0, 4, 1, **kw)))
