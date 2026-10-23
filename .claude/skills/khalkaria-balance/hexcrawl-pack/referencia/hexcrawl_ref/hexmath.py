"""Matemática de hex do hexcrawl de Kharavel.

Convenções (docs/03-dados.md):
- Hex de TOPO CHATO (a arte do Pedro é de topo chato: face 32 x 28 px, lado 16 px).
- Layout offset "odd-q": as colunas de índice ímpar (0-based), isto é, as colunas PARES no rótulo 1-based,
  descem meio hex.
- Id do hex = "CCLL", coluna e linha 1-based com 2 dígitos ("0712" = coluna 7, linha 12).
- Direções: N, NE, SE, S, SO, NO. Cada hex é dono das arestas N, NE e SE (aresta canônica);
  S, SO e NO pertencem ao vizinho.
- Por dentro, as contas usam coordenada axial (q, r) e cúbica (q, r, s), como em
  Red Blob Games, "Hexagonal Grids".
- Geometria em pixel da arte em escala 1x: passo de 24 px por coluna, 28 px por linha, 14 px de descida nas
  colunas de índice ímpar. Os vértices caem sempre em coordenada inteira e servem de id de vértice (rios).
"""
from __future__ import annotations

DIRECOES = ('N', 'NE', 'SE', 'S', 'SO', 'NO')
VETOR_AXIAL = {'N': (0, -1), 'NE': (1, -1), 'SE': (1, 0), 'S': (0, 1), 'SO': (-1, 1), 'NO': (-1, 0)}
OPOSTA = {'N': 'S', 'NE': 'SO', 'SE': 'NO', 'S': 'N', 'SO': 'NE', 'NO': 'SE'}
CANONICAS = ('N', 'NE', 'SE')

# geometria da arte em 1x
PASSO_X, PASSO_Y, DESCIDA = 24, 28, 14
FACE_L, FACE_A = 32, 28            # largura e altura da face do hex
CELULA_L, CELULA_A = 32, 48        # célula da folha de tiles (a face fica embaixo, com 18 px de folga em cima)
FACE_Y_NA_CELULA = 18              # y do topo da face dentro da célula


# ---------------------------------------------------------------- ids e coordenadas
def id_de(col: int, lin: int) -> str:
    if not (1 <= col <= 99 and 1 <= lin <= 99):
        raise ValueError(f'coluna/linha fora de 1..99: {col}, {lin}')
    return f'{col:02d}{lin:02d}'


def col_lin(hid: str) -> tuple[int, int]:
    if len(hid) != 4 or not hid.isdigit():
        raise ValueError(f'id de hex inválido: {hid!r}')
    return int(hid[:2]), int(hid[2:])


def offset_para_axial(col: int, lin: int) -> tuple[int, int]:
    c, l = col - 1, lin - 1
    return c, l - (c - (c & 1)) // 2


def axial_para_offset(q: int, r: int) -> tuple[int, int]:
    return q + 1, r + (q - (q & 1)) // 2 + 1


def axial(hid: str) -> tuple[int, int]:
    return offset_para_axial(*col_lin(hid))


def de_axial(q: int, r: int) -> str | None:
    col, lin = axial_para_offset(q, r)
    if col < 1 or lin < 1 or col > 99 or lin > 99:
        return None
    return id_de(col, lin)


def cubo(hid: str) -> tuple[int, int, int]:
    q, r = axial(hid)
    return q, r, -q - r


# ---------------------------------------------------------------- vizinhança
def vizinho(hid: str, d: str) -> str | None:
    """Vizinho na direção d, ou None fora de 01..99 (o limite da grade é checado por dentro_da_grade)."""
    q, r = axial(hid)
    dq, dr = VETOR_AXIAL[d]
    return de_axial(q + dq, r + dr)


def dentro_da_grade(hid: str | None, colunas: int, linhas: int) -> bool:
    if hid is None:
        return False
    c, l = col_lin(hid)
    return 1 <= c <= colunas and 1 <= l <= linhas


def vizinhos(hid: str, colunas: int, linhas: int) -> dict[str, str]:
    out = {}
    for d in DIRECOES:
        v = vizinho(hid, d)
        if dentro_da_grade(v, colunas, linhas):
            out[d] = v
    return out


def direcao_entre(a: str, b: str) -> str | None:
    qa, ra = axial(a)
    qb, rb = axial(b)
    for d, (dq, dr) in VETOR_AXIAL.items():
        if (qa + dq, ra + dr) == (qb, rb):
            return d
    return None


def distancia(a: str, b: str) -> int:
    xa, ya, za = cubo(a)
    xb, yb, zb = cubo(b)
    return max(abs(xa - xb), abs(ya - yb), abs(za - zb))


def alcance(hid: str, raio: int, colunas: int, linhas: int) -> list[str]:
    """Hexes a até `raio` de distância (inclui o próprio), dentro da grade."""
    q0, r0 = axial(hid)
    out = []
    for dq in range(-raio, raio + 1):
        for dr in range(max(-raio, -dq - raio), min(raio, -dq + raio) + 1):
            h = de_axial(q0 + dq, r0 + dr)
            if dentro_da_grade(h, colunas, linhas):
                out.append(h)
    return out


# ---------------------------------------------------------------- linha (visão)
def _arredonda_cubo(x: float, y: float, z: float) -> tuple[int, int, int]:
    rx, ry, rz = round(x), round(y), round(z)
    dx, dy, dz = abs(rx - x), abs(ry - y), abs(rz - z)
    if dx > dy and dx > dz:
        rx = -ry - rz
    elif dy > dz:
        ry = -rx - rz
    else:
        rz = -rx - ry
    return rx, ry, rz


def linha(a: str, b: str) -> list[str]:
    """Hexes da linha reta de a até b, inclusive (interpolação cúbica com o empurrão de epsilon)."""
    n = distancia(a, b)
    if n == 0:
        return [a]
    xa, ya, za = cubo(a)
    xb, yb, zb = cubo(b)
    eps = (1e-6, 2e-6, -3e-6)
    out = []
    for i in range(n + 1):
        t = i / n
        x = xa + (xb - xa) * t + eps[0]
        y = ya + (yb - ya) * t + eps[1]
        z = za + (zb - za) * t + eps[2]
        q, r, _ = _arredonda_cubo(x, y, z)
        h = de_axial(q, r)
        if h is not None and (not out or out[-1] != h):
            out.append(h)
    return out


# ---------------------------------------------------------------- arestas
def aresta_canonica(hid: str, d: str) -> tuple[str, str] | None:
    """(dono, direção canônica) da aresta d do hex. None se o dono cair fora de 01..99."""
    if d in CANONICAS:
        return hid, d
    v = vizinho(hid, d)
    return (v, OPOSTA[d]) if v is not None else None


def chave_aresta(hid: str, d: str) -> str:
    dono = aresta_canonica(hid, d)
    if dono is None:
        raise ValueError(f'aresta {d} de {hid} sem dono representável')
    return f'{dono[0]}:{dono[1]}'


def hexes_da_aresta(chave: str) -> tuple[str, str | None]:
    hid, d = chave.split(':')
    if d not in CANONICAS:
        raise ValueError(f'aresta não canônica: {chave}')
    return hid, vizinho(hid, d)


# ---------------------------------------------------------------- geometria em pixel (arte 1x)
def origem_face(hid: str) -> tuple[int, int]:
    """Canto superior esquerdo do retângulo da face (32 x 28) em pixel 1x."""
    col, lin = col_lin(hid)
    c, l = col - 1, lin - 1
    return PASSO_X * c, PASSO_Y * l + (DESCIDA if c % 2 == 1 else 0)


def centro_px(hid: str) -> tuple[int, int]:
    ox, oy = origem_face(hid)
    return ox + FACE_L // 2, oy + FACE_A // 2


def origem_celula(hid: str) -> tuple[int, int]:
    """Onde desenhar a célula 32 x 48 da folha de tiles para este hex."""
    ox, oy = origem_face(hid)
    return ox, oy - FACE_Y_NA_CELULA


# vértices da face na ordem: superior-esq, superior-dir, direita, inferior-dir, inferior-esq, esquerda
def vertices_px(hid: str) -> list[tuple[int, int]]:
    ox, oy = origem_face(hid)
    return [(ox + 8, oy), (ox + 24, oy), (ox + 32, oy + 14), (ox + 24, oy + 28), (ox + 8, oy + 28), (ox, oy + 14)]


_EXTREMOS = {'N': (0, 1), 'NE': (1, 2), 'SE': (2, 3), 'S': (3, 4), 'SO': (4, 5), 'NO': (5, 0)}


def extremos_aresta_px(hid: str, d: str) -> tuple[tuple[int, int], tuple[int, int]]:
    """Os dois vértices da aresta d, em pixel 1x. Servem de id de vértice (inteiros, iguais nos dois hexes)."""
    v = vertices_px(hid)
    i, j = _EXTREMOS[d]
    return v[i], v[j]


def ponto_medio_aresta_px(hid: str, d: str) -> tuple[float, float]:
    (x1, y1), (x2, y2) = extremos_aresta_px(hid, d)
    return (x1 + x2) / 2, (y1 + y2) / 2


def profundidade(hid: str) -> int:
    """Ordem de desenho: quem tem o centro mais abaixo é desenhado depois (fica na frente)."""
    return centro_px(hid)[1]
