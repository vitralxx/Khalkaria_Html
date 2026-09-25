# Instinto proposto. Ganhos (cada um no max 1x/rodada):
#   leitura +1 no inicio do turno SE o campo estiver mapeado
#   acerto  +1 se acertar ao menos 1 ataque no turno (60/35/10 com 3 ataques; 60 com 1)
#   esquiva +1 se ao menos 1 ataque contra voce errar na rodada
#   pericia +1 se suceder numa pericia (fora Atacar/Defender) -> raro em combate
# Perdas: Desprevenido zera (ignorado: com o campo mapeado nao acontece);
#         dano > metade da Saude max de uma vez: perde metade (ceil) -> evento raro
import random
N=200_000
def rodadas(mapeado, n_ataques, p_esq, p_per, p_golpe, inicio, R=5):
    alc=[0]*(R+1)
    for _ in range(N):
        i=inicio
        for r in range(1,R+1):
            if mapeado: i+=1
            if n_ataques==3: hit = random.random()<0.6 or random.random()<0.35 or random.random()<0.10
            else:            hit = random.random()<0.6
            i+= hit
            i+= random.random()<p_esq
            i+= random.random()<p_per
            if random.random()<p_golpe: i-= (i+1)//2
            i=min(i,5)
            if i>=5:
                for k in range(r,R+1): alc[k]+=1
                break
    return [round(100*a/N,1) for a in alc[1:]]
cen={"esquiva":0.20,"pericia":0.05,"golpe":0.03}
print("P(Instinto chega a 5 ate a rodada 1..5), sem gastar nada no caminho")
for arma,na in (("Atacar(1), 3 ataques",3),("Atacar(2), 1 ataque",1)):
    for mp in (True,False):
        for ini in (0,2):
            r=rodadas(mp,na,cen["esquiva"],cen["pericia"],cen["golpe"],ini)
            print(f"  {arma:22s} mapeado={str(mp):5s} inicio={ini}: {r}")
