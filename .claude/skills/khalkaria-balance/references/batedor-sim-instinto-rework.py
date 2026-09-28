"""Instinto do Batedor, proposta do rework (18-batedor-rework.md). Monte Carlo com semente fixa: roda igual toda vez.

Regras simuladas (cada ganho no máx. 1x por rodada, teto 5):
  Leitura  +1 no início do seu turno, com o campo mapeado
  Acerto   +1 se acertar ao menos 1 ataque no turno (60/35/10 com Atacar(1); 60 com Atacar(2))
  Esquiva  +1 se ao menos 1 ataque contra você errar na rodada (p_esq)
  Perícia  +1 ao suceder numa perícia que não seja Atacar nem Defender (p_per, raro em combate)
Perdas: Desprevenido zera (não acontece com o campo mapeado; ignorado); dano > metade da Saúde máx.
  de uma vez: perde metade, arredondada para cima (p_golpe por rodada).
Mapear em combate custa 1 Ação: com Atacar(1) o turno 1 tem 2 ataques; com Atacar(2) usa a ação que sobra.
A Leitura começa no turno seguinte ao de mapear.
"""
import random
random.seed(20260928)
N = 200_000

def acerto(n_ataques):
    if n_ataques == 3: return random.random() < 0.6 or random.random() < 0.35 or random.random() < 0.10
    if n_ataques == 2: return random.random() < 0.6 or random.random() < 0.35
    return random.random() < 0.6

def combate(mapa, arma, inicio, p_esq, p_per=0.05, p_golpe=0.03, R=5, gasto=None):
    """mapa: 'preparado' (mapeado desde o início), 'combate' (mapeia no turno 1), 'nao'.
    arma: 1 (Atacar(1), 3 ataques) ou 2 (Atacar(2), 1 ataque).
    gasto: None (só acumula) ou política de gasto (retorna usos de Passo em Falso)."""
    i = inicio; alc = None; usos = 0; mapeado = (mapa == 'preparado')
    for r in range(1, R + 1):
        if mapeado: i += 1                       # Leitura
        i = min(i, 5)
        n = 3 if arma == 1 else 1
        if r == 1 and mapa == 'combate':
            if arma == 1: n = 2                  # 1 ação foi para mapear
            mapeado = True                       # Leitura só no próximo turno
        # gasto antes de atacar: Passo em Falso (4) se houver alvo que se moveu (70%)
        if gasto == 'passo' and i >= 4 and random.random() < 0.70:
            i -= 4; usos += 1
            if arma == 1: n = max(0, n - 1)      # a Passo em Falso custa 1 Ação
        i += acerto(n) if n else 0
        i += random.random() < p_esq
        i += random.random() < p_per
        if random.random() < p_golpe: i -= (i + 1) // 2
        i = min(i, 5)
        if alc is None and i >= 5: alc = r
    return alc, usos

def tabela(titulo, **kw):
    alc = [0] * 6
    for _ in range(N):
        a, _u = combate(**kw)
        if a:
            for k in range(a, 6): alc[k] += 1
    print(f'  {titulo:58s}', ' '.join(f'{100*alc[k]/N:5.1f}%' for k in range(1, 6)))

print('P(Instinto chega a 5 até a rodada 1..5), sem gastar')
for p_esq in (0.25,):
    print(f' esquiva {p_esq:.2f}, perícia 0.05, golpe 0.03')
    tabela('Atacar(1), campo preparado, começa com 0', mapa='preparado', arma=1, inicio=0, p_esq=p_esq)
    tabela('Atacar(1), campo preparado, começa com 2 (exploração)', mapa='preparado', arma=1, inicio=2, p_esq=p_esq)
    tabela('Atacar(1), mapeia no turno 1, começa com 0', mapa='combate', arma=1, inicio=0, p_esq=p_esq)
    tabela('Atacar(2), campo preparado, começa com 0', mapa='preparado', arma=2, inicio=0, p_esq=p_esq)
    tabela('Atacar(2), mapeia no turno 1, começa com 0', mapa='combate', arma=2, inicio=0, p_esq=p_esq)
    tabela('Atacar(1), sem mapa, começa com 0', mapa='nao', arma=1, inicio=0, p_esq=p_esq)
    tabela('Atacar(2), sem mapa, começa com 0', mapa='nao', arma=2, inicio=0, p_esq=p_esq)
print('\nSensibilidade à esquiva (Atacar(1), mapeia no turno 1, começa com 0)')
for p_esq in (0.10, 0.40):
    tabela(f'esquiva {p_esq:.2f}', mapa='combate', arma=1, inicio=0, p_esq=p_esq)

print('\nUsos de Passo em Falso (4 Instinto) num combate de 4 rodadas, gastando sempre que der (alvo que se moveu: 70%)')
for titulo, kw in (('Atacar(1), campo preparado, começa com 0', dict(mapa='preparado', arma=1, inicio=0)),
                   ('Atacar(1), mapeia no turno 1', dict(mapa='combate', arma=1, inicio=0)),
                   ('Atacar(2), mapeia no turno 1', dict(mapa='combate', arma=2, inicio=0)),
                   ('Atacar(1), sem mapa', dict(mapa='nao', arma=1, inicio=0))):
    tot = 0; dist = [0] * 5
    for _ in range(N):
        _a, u = combate(p_esq=0.25, R=4, gasto='passo', **kw)
        tot += u; dist[min(u, 4)] += 1
    print(f'  {titulo:40s} média {tot/N:.2f} · 0 usos {100*dist[0]/N:.0f}% · 1 uso {100*dist[1]/N:.0f}% · 2+ usos {100*sum(dist[2:])/N:.0f}%')
