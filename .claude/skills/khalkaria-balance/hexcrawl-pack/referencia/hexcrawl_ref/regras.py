"""Regras do hexcrawl (docs/01-regras.md), em funções puras.

Unidade de movimento: metros. Todo valor do jogo é múltiplo de 1,5 m, então as contas usam Fraction e são
exatas (2/3 e 1/3 do orçamento nunca dão dízima errada).
"""
from __future__ import annotations

import random
from dataclasses import dataclass, field
from fractions import Fraction

# ---------------------------------------------------------------- custos (docs/01 §2 e §3)
CUSTO_ESTRADA = Fraction(3, 2)      # 1,5 m
CUSTO_TRILHA = Fraction(3)          # 3 m

PERIODOS = ('manha', 'tarde', 'noite')
ORDEM_DO_DIA = ('manha', 'tarde', 'noite', 'descanso')


def m(valor) -> Fraction:
    """Metros como Fraction exata ('4.5', 4.5 ou Fraction)."""
    return valor if isinstance(valor, Fraction) else Fraction(str(valor))


def custo_do_passo(custo_hex_destino, via_no_passo: str | None) -> Fraction:
    """Custo de entrar no hex de destino. A via manda no custo SÓ quando o passo segue a via
    (a mesma via passa pelos dois hexes e cruza a aresta entre eles)."""
    if via_no_passo == 'estrada':
        return CUSTO_ESTRADA
    if via_no_passo == 'trilha':
        return CUSTO_TRILHA
    return m(custo_hex_destino)


def custo_embarcado(embarcacao: dict, na_agua: bool) -> Fraction:
    """Custo de um passo embarcado (docs/01 §3.2): uma aresta de rio, ou um hex de Água.
    `embarcacao` é um item de mundo.json > embarcacoes. O orçamento continua o do grupo."""
    return m(embarcacao['custoAgua'] if na_agua else embarcacao['custoAresta'])


# ---------------------------------------------------------------- relógio do dia (docs/01 §3.3, modelo do Pedro)
def periodo(restante, orcamento) -> str:
    """manhã enquanto restante > 2/3 do orçamento; tarde enquanto > 1/3; noite enquanto > 0; 0 = descanso."""
    r, b = m(restante), m(orcamento)
    if r > 2 * b / 3:
        return 'manha'
    if r > b / 3:
        return 'tarde'
    if r > 0:
        return 'noite'
    return 'descanso'


def periodos_encerrados(antes: str, depois: str) -> list[str]:
    """Períodos que terminaram entre dois momentos do dia: 'manha' -> 'noite' encerra manhã e tarde."""
    i, j = ORDEM_DO_DIA.index(antes), ORDEM_DO_DIA.index(depois)
    return list(ORDEM_DO_DIA[i:j]) if j > i else []


@dataclass
class Dia:
    """Estado de um dia de viagem. Criado por `novo_dia`."""
    orcamento: Fraction                 # menor Movimento do grupo
    restante: Fraction
    divida: Fraction = Fraction(0)      # metros que passam para o dia seguinte (hex mais caro que o orçamento)
    andados: list = field(default_factory=list)   # hexes em que o grupo ENTROU hoje
    trecho: list = field(default_factory=list)    # hexes em que entrou desde a última parada (H da Jornada)
    explorados: list = field(default_factory=list)
    explorou_aqui: bool = False         # já explorou o hex atual desde que chegou nele

    @property
    def periodo(self) -> str:
        return periodo(self.restante, self.orcamento)

    @property
    def acabou(self) -> bool:
        return self.restante <= 0


def novo_dia(orcamento, divida=0) -> Dia:
    b, d = m(orcamento), m(divida)
    if b <= 0:
        raise ValueError('orçamento do dia tem de ser positivo')
    resto = b - d
    if resto <= 0:   # a dívida come o dia inteiro; o que sobrar vai para o próximo
        return Dia(orcamento=b, restante=Fraction(0), divida=-resto)
    return Dia(orcamento=b, restante=resto)


def pode_entrar(dia: Dia, custo) -> bool:
    """Entra se o restante paga. Um hex mais caro que o orçamento inteiro só se começa de manhã,
    com o orçamento cheio (o excesso vira dívida do dia seguinte)."""
    c = m(custo)
    if dia.restante <= 0:
        return False
    if dia.restante >= c:
        return True
    return c > dia.orcamento and dia.restante == dia.orcamento


def entrar(dia: Dia, hid: str, custo) -> Dia:
    if not pode_entrar(dia, custo):
        raise ValueError(f'não paga {custo} m com {dia.restante} m restantes')
    c = m(custo)
    dia.restante -= c
    if dia.restante < 0:
        dia.divida = -dia.restante
        dia.restante = Fraction(0)
    dia.andados.append(hid)
    dia.trecho.append(hid)
    dia.explorou_aqui = False
    return dia


def explorar(dia: Dia, hid: str) -> Dia:
    """Explorar o hex atual pula o período: manhã→tarde, tarde→noite, noite→descanso.
    O restante cai até o limite do período seguinte, para o relógio e o movimento andarem juntos."""
    p = dia.periodo
    if p == 'descanso':
        raise ValueError('o dia já acabou')
    b = dia.orcamento
    alvo = {'manha': 2 * b / 3, 'tarde': b / 3, 'noite': Fraction(0)}[p]
    dia.restante = min(dia.restante, alvo)
    dia.explorados.append(hid)
    dia.explorou_aqui = True
    return dia


def encerrar_dia(dia: Dia) -> Dia:
    """O mestre encerra o dia onde o grupo está (ex.: numa vila). Segue o protocolo da parada de fim de dia."""
    dia.restante = Fraction(0)
    return dia


def fechar_parada(dia: Dia) -> list[str]:
    """Fecha uma parada: devolve os hexes do trecho (para o H da Jornada) e zera o trecho."""
    trecho = list(dia.trecho)
    dia.trecho.clear()
    return trecho


def andar(dia: Dia, hid: str, custo) -> dict:
    """Um passo com o protocolo de paradas (docs/01 §3.3 e §4.1).

    - 'encerrados': os períodos que o passo encerrou.
    - 'parada': o passo terminou um período, e o grupo para no hex (lembrete da Jornada).
    - 'fimDoDia': acabou o movimento; o grupo explora o hex onde está e só então descansa.
    """
    antes = dia.periodo
    entrar(dia, hid, custo)
    enc = periodos_encerrados(antes, dia.periodo)
    return {'encerrados': enc, 'parada': bool(enc), 'fimDoDia': dia.periodo == 'descanso'}


# ---------------------------------------------------------------- Jornada (docs/01 §4)
def meta_jornada(hostilidade: int) -> int:
    return 3 + hostilidade // 5


def hostilidade_da_parada(hostilidades_do_trecho: list[int], hostilidade_do_hex_atual: int) -> int:
    """H da Jornada numa parada: a maior entre os hexes em que o grupo entrou desde a última parada;
    sem movimento, a do hex atual."""
    return max(hostilidades_do_trecho) if hostilidades_do_trecho else hostilidade_do_hex_atual


def pontos_da_acao(resultado: int, guiar: bool, cd: int = 15) -> int:
    """Sistema > Jornada: Guiar soma +2 no sucesso, os outros +1; +1 a cada 5 pontos acima da CD."""
    if resultado < cd:
        return 0
    return (2 if guiar else 1) + (resultado - cd) // 5


FAIXAS_CONSEQUENCIA = (
    # (de, até, dados de Saúde, dados de Stamina) — "+H" em tudo, salvo na faixa 100
    (1, 1, '4d6', '4d6'),
    (2, 19, '2d8', '2d8'),
    (20, 39, '2d6', '2d6'),
    (40, 59, None, '1d6'),
    (60, 79, None, '1d4'),
    (80, 99, None, '0'),
    (100, 100, None, None),
)


def faixa_consequencia(d100: int) -> int:
    if not 1 <= d100 <= 100:
        raise ValueError('d100 fora de 1..100')
    for i, (de, ate, *_rest) in enumerate(FAIXAS_CONSEQUENCIA):
        if de <= d100 <= ate:
            return i
    raise AssertionError


def consequencia(d100: int, hostilidade: int) -> dict:
    """Fórmulas do dano em cada integrante. {'faixa', 'saude', 'stamina'}; None = não perde."""
    i = faixa_consequencia(d100)
    _, _, s, st = FAIXAS_CONSEQUENCIA[i]
    def f(dados):
        if dados is None:
            return None
        if dados == '0':
            return str(hostilidade)
        return f'{dados}+{hostilidade}'
    return {'faixa': i, 'saude': f(s), 'stamina': f(st)}


def rolar_dados(expr: str, rng: random.Random) -> int:
    """'2d8+10', '10', '1d6'."""
    total = 0
    for parte in expr.replace('-', '+-').split('+'):
        parte = parte.strip()
        if not parte:
            continue
        if 'd' in parte:
            n, f = parte.split('d')
            total += sum(rng.randint(1, int(f)) for _ in range(int(n or 1)))
        else:
            total += int(parte)
    return total


# ---------------------------------------------------------------- rio (docs/01 §2.4)
def cd_rio(hostilidade: int) -> int:
    return 10 + hostilidade // 2


def dano_falha_rio(rng: random.Random) -> int:
    return rolar_dados('2d6+3', rng)


def arrasto_rio(rng: random.Random) -> int:
    """Hexes rio abaixo (1d6). Na grade de arestas, cada hex rio abaixo = 2 arestas."""
    return rng.randint(1, 6)


# ---------------------------------------------------------------- extração (docs/01 §5.4)
CD_POR_RARIDADE = {'Ordinário': 10, 'Incomum': 13, 'Exótico': 16, 'Luxária': 20}


def unidades_extraidas(resultado: int, raridade: str) -> int:
    cd = CD_POR_RARIDADE[raridade]
    return 0 if resultado < cd else 1 + (resultado - cd) // 5


def fator_extracao(sitios_no_dia: int) -> float:
    """Peso da categoria extração depois de k sítios desde o último descanso: x 0,5^k."""
    return 0.5 ** sitios_no_dia


# ---------------------------------------------------------------- descanso (Sistema > Descanso)
NIVEIS_COMODIDADE = ('Precário', 'Ruim', 'Normal', 'Bom', 'Luxuoso')


def comodidade_ao_ar_livre(melhor_sobrevivencia: int, bonus: int = 0) -> int:
    """Nível 1..5 pelo melhor teste de Sobrevivência do grupo (<15, 15-19, 20-24, 25-29, 30+), + bônus
    (Abrigo +1), máximo Luxuoso."""
    r = melhor_sobrevivencia
    n = 1 if r < 15 else 2 if r < 20 else 3 if r < 25 else 4 if r < 30 else 5
    return min(5, n + bonus)


# ---------------------------------------------------------------- comerciante (Sistema > Comerciantes)
PRECO_POR_RARIDADE = {'Ordinário': '2d10+10', 'Incomum': '4d10+45', 'Exótico': '5d12+180', 'Luxária': '6d20+620'}


def preco_rolado(raridade: str, rng: random.Random) -> int:
    return rolar_dados(PRECO_POR_RARIDADE[raridade], rng)
