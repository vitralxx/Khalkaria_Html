"""Gera assets/tiles/atlas.json: o que é cada célula das folhas de arte do Pedro e qual tile cada tipo de hex usa.

As medidas (caixa opaca, altura acima da face, ligações das peças de via) saem das imagens; o significado de cada
célula está em TILES e VIAS abaixo (proposta do agente de balanceamento, a confirmar com o Pedro: docs/10).
Requer Pillow. Uso: python referencia/gera_atlas.py <pasta-do-pack>
"""
import json
import os
import sys
from collections import Counter

from PIL import Image

PACK = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..')
CEL_L, CEL_A, FACE_Y = 32, 48, 18          # célula 32x48; a face do hex começa em y=18 dentro da célula
MEIO_DA_ARESTA = {'N': (16, 0), 'NE': (28, 7), 'SE': (28, 21), 'S': (16, 28), 'SO': (4, 21), 'NO': (4, 7)}

# (linha, coluna) -> (id, uso, tipo, bioma, nota). uso: terreno | variante | assentamento | especial | prop
TILES = {
    (0, 0): ('campos-verde', 'terreno', 'campos', 'verde', ''),
    (0, 1): ('floresta-verde', 'terreno', 'floresta', 'verde', ''),
    (0, 2): ('floresta-densa-verde', 'terreno', 'floresta-densa', 'verde', ''),
    (0, 3): ('colinas-verde', 'terreno', 'colinas', 'verde', ''),
    (0, 4): ('serra-pinheiros-verde', 'variante', 'montanha', 'verde', 'rochas altas com pinheiros'),
    (0, 5): ('montanha-pico', 'terreno', 'montanha', 'verde', 'pico nevado; serve para verde e neve'),
    (0, 6): ('agua-rasa', 'terreno', 'agua', None, 'água que encosta em terra'),
    (0, 7): ('agua-funda', 'terreno', 'agua', None, 'água sem terra vizinha'),
    (1, 0): ('vila-verde', 'assentamento', None, 'verde', ''),
    (1, 1): ('vila-terra', 'assentamento', None, 'verde', 'vila em chão de terra'),
    (1, 2): ('castelo', 'assentamento', None, 'verde', 'castelo de pedra cinza'),
    (1, 3): ('campo-laranja', 'variante', 'campos', 'verde', 'listrado: plantação? candidato a Ermo (P8)'),
    (1, 4): ('floresta-clareira', 'variante', 'floresta', 'verde', 'floresta mista com clareira'),
    (1, 5): ('pantano', 'terreno', 'pantano', 'verde', ''),
    (1, 6): ('campos-claro', 'variante', 'campos', 'verde', 'estepe pálida'),
    (1, 7): ('campos-floridos', 'variante', 'campos', 'verde', ''),
    (2, 0): ('campos-neve', 'terreno', 'campos', 'neve', ''),
    (2, 1): ('floresta-neve', 'terreno', 'floresta', 'neve', ''),
    (2, 2): ('floresta-densa-neve', 'terreno', 'floresta-densa', 'neve', ''),
    (2, 3): ('colinas-neve', 'terreno', 'colinas', 'neve', ''),
    (2, 4): ('serra-pinheiros-neve', 'terreno', 'montanha', 'neve', ''),
    (2, 5): ('agua-gelo', 'terreno', 'agua', 'neve', 'água com placas de gelo'),
    (2, 6): ('vila-neve', 'assentamento', None, 'neve', ''),
    (2, 7): ('fortaleza-neve', 'assentamento', None, 'neve', 'telhados vermelhos'),
    (3, 0): ('areia', 'terreno', 'deserto', 'deserto', ''),
    (3, 1): ('areia-rochas', 'terreno', 'colinas', 'deserto', ''),
    (3, 2): ('dunas', 'variante', 'deserto', 'deserto', ''),
    (3, 3): ('meseta', 'terreno', 'montanha', 'deserto', ''),
    (3, 4): ('oasis', 'especial', None, 'deserto', ''),
    (3, 5): ('acampamento-deserto', 'especial', None, 'deserto', 'tendas e fardos'),
    (3, 6): ('vila-deserto', 'assentamento', None, 'deserto', ''),
    (3, 7): ('palacio-deserto', 'assentamento', None, 'deserto', ''),
    (4, 0): ('arvore-gigante', 'especial', None, 'verde', 'o tile mais alto da folha'),
    (4, 1): ('prop-rocha-musgo', 'prop', None, None, 'sem hex: decoração ou marcador'),
    (4, 2): ('prop-cristal', 'prop', None, None, 'sem hex: decoração ou marcador'),
    (4, 3): ('prop-minerio', 'prop', None, None, 'sem hex: decoração ou marcador'),
    (4, 4): ('porto-a', 'assentamento', None, None, 'cais sobre água'),
    (4, 5): ('porto-b', 'assentamento', None, None, 'cais sobre água; não é espelho do porto-a'),
    (4, 6): ('farol', 'especial', None, None, 'farol sobre água'),
    (4, 7): ('torre-sombria', 'especial', None, 'verde', ''),
    (5, 0): ('ruinas', 'especial', None, None, ''),
}

# tipo -> bioma -> [(tile, peso)]. "*" vale para qualquer bioma. Pesos são o sorteio estável por hex (docs/06 §3).
VARIANTES = {
    'campos': {'verde': [('campos-verde', 6), ('campos-claro', 2), ('campos-floridos', 2)],
               'neve': [('campos-neve', 1)], 'deserto': [('areia', 1)]},
    'floresta': {'verde': [('floresta-verde', 3), ('floresta-clareira', 1)], 'neve': [('floresta-neve', 1)],
                 'deserto': [('floresta-verde', 1)]},
    'floresta-densa': {'verde': [('floresta-densa-verde', 1)], 'neve': [('floresta-densa-neve', 1)],
                       'deserto': [('floresta-densa-verde', 1)]},
    'colinas': {'verde': [('colinas-verde', 1)], 'neve': [('colinas-neve', 1)], 'deserto': [('areia-rochas', 1)]},
    'montanha': {'verde': [('montanha-pico', 3), ('serra-pinheiros-verde', 1)],
                 'neve': [('serra-pinheiros-neve', 2), ('montanha-pico', 1)], 'deserto': [('meseta', 1)]},
    'pantano': {'*': [('pantano', 1)]},
    'deserto': {'*': [('areia', 3), ('dunas', 2)]},
    'ermo': {'*': [('areia', 2), ('areia-rochas', 1)]},
    'agua': {'*': [('agua-funda', 1)]},
    'litoral': {'verde': [('campos-verde', 1)], 'neve': [('campos-neve', 1)], 'deserto': [('areia', 1)]},
}

VIAS_COR = {0: 'cinza', 1: 'cinza', 2: 'verde', 3: 'verde'}   # linha da folha de vias -> cor


def celula(im, lin, col):
    return im.crop((col * CEL_L, lin * CEL_A, col * CEL_L + CEL_L, lin * CEL_A + CEL_A))


def caixa(im):
    b = im.getbbox()
    return list(b) if b else None


def paleta(im, n):
    c = Counter(p[:3] for p in im.convert('RGBA').get_flattened_data() if p[3] > 0) \
        if hasattr(im, 'get_flattened_data') else Counter(p[:3] for p in im.convert('RGBA').getdata() if p[3] > 0)
    return ['#%02x%02x%02x' % k for k, _ in c.most_common(n)]


def main():
    ter = Image.open(os.path.join(PACK, 'assets', 'tiles', 'terreno.png')).convert('RGBA')
    via = Image.open(os.path.join(PACK, 'assets', 'tiles', 'vias.png')).convert('RGBA')
    tiles = []
    for (lin, col), (tid, uso, tipo, bioma, nota) in sorted(TILES.items()):
        cel = celula(ter, lin, col)
        b = caixa(cel)
        if b is None:
            raise SystemExit(f'célula vazia em terreno.png ({lin},{col}) — atualize TILES')
        tiles.append({'id': tid, 'folha': 'terreno', 'lin': lin, 'col': col, 'uso': uso, 'tipo': tipo,
                      'bioma': bioma, 'caixa': b, 'acimaDaFace': max(0, FACE_Y - b[1]),
                      'espelhavel': uso in ('terreno', 'variante'), 'nota': nota})
    usados = {(t['lin'], t['col']) for t in tiles}
    sobra = [(l, c) for l in range(ter.height // CEL_A) for c in range(ter.width // CEL_L)
             if (l, c) not in usados and caixa(celula(ter, l, c))]
    if sobra:
        raise SystemExit(f'células com arte e sem significado em TILES: {sobra}')
    ids = {t['id'] for t in tiles}
    for tipo, por_bioma in VARIANTES.items():
        for lista in por_bioma.values():
            for tid, _ in lista:
                assert tid in ids, (tipo, tid)
    pecas = []
    px = via.load()
    for lin in range(via.height // CEL_A):
        for col in range(via.width // CEL_L):
            cel = celula(via, lin, col)
            if not caixa(cel):
                continue
            liga = []
            for d, (mx, my) in MEIO_DA_ARESTA.items():
                x0, y0 = col * CEL_L + mx, lin * CEL_A + FACE_Y + my
                n = sum(1 for dy in range(-3, 4) for dx in range(-3, 4)
                        if 0 <= x0 + dx < via.width and 0 <= y0 + dy < via.height and px[x0 + dx, y0 + dy][3] > 0)
                if n:
                    liga.append(d)
            pecas.append({'lin': lin, 'col': col, 'cor': VIAS_COR.get(lin, '?'), 'liga': liga, 'caixa': caixa(cel)})
    atlas = {
        'schemaVersion': 'hexcrawl-atlas/1',
        '_doc': 'Gerado por referencia/gera_atlas.py. Significados = proposta (docs/06-arte.md, docs/10-pendencias.md).',
        'folhas': {
            'terreno': {'arquivo': 'assets/tiles/terreno.png', 'celula': [CEL_L, CEL_A],
                        'colunas': ter.width // CEL_L, 'linhas': ter.height // CEL_A},
            'vias': {'arquivo': 'assets/tiles/vias.png', 'celula': [CEL_L, CEL_A],
                     'colunas': via.width // CEL_L, 'linhas': via.height // CEL_A},
        },
        'face': {'x': 0, 'y': FACE_Y, 'largura': 32, 'altura': 28, 'espessura': 2,
                 'vertices': [[8, 0], [24, 0], [32, 14], [24, 28], [8, 28], [0, 14]]},
        'tiles': tiles,
        'variantes': {t: {b: [{'tile': tid, 'peso': p} for tid, p in l] for b, l in pb.items()}
                      for t, pb in VARIANTES.items()},
        'agua': {'rasa': 'agua-rasa', 'funda': 'agua-funda', 'gelo': 'agua-gelo',
                 'regra': 'água com vizinho de terra usa "rasa" (bioma neve: "gelo"); as demais, "funda"'},
        'litoral': {'regra': 'tile de campos do bioma + orla desenhada por código nas arestas que encostam em água'},
        'vias': {'pecas': pecas,
                 'observacao': 'as peças só ligam as diagonais (NE, SE, SO, NO): não há N/S nem pontas. '
                               'Vias são desenhadas por código; a folha é referência de estilo e paleta.',
                 'paletas': {'cinza': paleta(via.crop((0, 0, via.width, 96)), 6),
                             'verde': paleta(via.crop((0, 96, via.width, 192)), 8)}},
        'paletaAgua': {'rasa': paleta(celula(ter, 0, 6), 3), 'funda': paleta(celula(ter, 0, 7), 3),
                       'gelo': paleta(celula(ter, 2, 5), 6)},
        'paletaBorda': paleta(celula(ter, 0, 0).crop((0, 44, 32, 48)), 3),
    }
    saida = os.path.join(PACK, 'assets', 'tiles', 'atlas.json')
    with open(saida, 'w', encoding='utf-8', newline='\n') as fh:
        json.dump(atlas, fh, ensure_ascii=False, indent=1)
        fh.write('\n')
    print('ok', saida, len(tiles), 'tiles,', len(pecas), 'peças de via')


if __name__ == '__main__':
    main()
