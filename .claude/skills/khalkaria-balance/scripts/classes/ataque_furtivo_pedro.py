# Ataque Furtivo do Pedro (2026-10-09): acerto contra Desprevenida soma Nd6 (2/4/6 nos níveis 1/3/5) e o alvo perde a reação.
# Modelo 60/35/10. Atacar escondido: 1º ataque contra Desprevenida (Exposto -> crítico no acerto). Dado de técnica não dobra.
P=[0.60,0.35,0.10]
def turno(D,mod,custo,af,todos_desprev=False,uma_vez=True,reesconde=False):
    acoes=3-(1 if reesconde else 0); n=acoes//custo
    E=0; usado=False
    for i in range(n):
        p=P[i]; norm=D+mod; crit=2*D+mod
        desprev = (i==0) or todos_desprev
        if i==0: d=crit                      # 1º ataque contra Desprevenida: Exposto
        else: d=(0.05/p)*crit+(1-0.05/p)*norm
        if desprev and not (uma_vez and usado):
            d+=af
        E+=p*d
        if desprev: usado = True if uma_vez else usado
    return E
for nivel,af,(Dl,Dp),mod in [(2,7.0,(3.5,6.5),3),(3,14.0,(7.0,13.0),4),(5,21.0,(10.5,19.5),5)]:
    print(f'Nível {nivel} (Ataque Furtivo {int(af/3.5)}d6; leve {Dl*2/7:.0f}d6, pesada {Dp/6.5:.0f}d12, mod +{mod})')
    print('  escondida, 1x/turno:   leve %5.1f   pesada %5.1f' % (turno(Dl,mod,1,af),turno(Dp,mod,2,af)))
    print('  loop (se esconde de novo): leve %5.1f   pesada %5.1f' % (turno(Dl,mod,1,af,reesconde=True),turno(Dp,mod,2,af,reesconde=True)))
    print('  Surpresa! (todos Desprevenidos), sem 1x/turno: leve %5.1f   com 1x/turno: %5.1f' % (turno(Dl,mod,1,af,todos_desprev=True,uma_vez=False),turno(Dl,mod,1,af,todos_desprev=True)))
    print('  sem esconder: leve %5.1f   pesada %5.1f' % (sum(P[i]*(Dl+mod) for i in range(3)), P[0]*(Dp+mod)))
