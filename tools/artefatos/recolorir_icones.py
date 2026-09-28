"""Recolore os ícones de Stamina (raio azul -> amarelo) e Éter (espiral dourada ->
verde e roxo) da ficha física. Troca só o matiz dos pixels com cor; traço escuro,
brilho e alfa ficam como estão."""
import colorsys, pathlib
from PIL import Image, ImageDraw

# Uso: python tools/artefatos/recolorir_icones.py <pasta com as camadas de pag1.zip>
# (o Pedro mandou Desktop\pag1.zip; extrair e passar a pasta). Saída em
# tools/artefatos/saida/icones/ (recurso-stamina.png amarelo, recurso-eter.png
# verde->roxo), aprovada pelo Pedro em 2026-09-26; entra em images/ficha/ na F4.
import sys
AQUI = pathlib.Path(__file__).parent
SRC = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else AQUI / 'pag1'
OUT = AQUI / 'saida' / 'icones'
OUT.mkdir(parents=True, exist_ok=True)


def recolore(img, matiz_de, sat_min=0.18, ganho_sat=1.0, gama_luz=1.0):
    """matiz_de(x, y, h) -> novo matiz (0..1) para pixels com saturação >= sat_min."""
    img = img.convert('RGBA')
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            hh, ll, ss = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
            if ss < sat_min or ll < 0.08:
                continue
            nh = matiz_de(x / w, y / h, hh)
            nr, ng, nb = colorsys.hls_to_rgb(nh, ll ** gama_luz, min(1.0, ss * ganho_sat))
            px[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), a)
    return img


# Stamina: todo o azul vira amarelo (~50°)
raio = recolore(Image.open(SRC / 'Camada 11.png'), lambda x, y, h: 48 / 360, ganho_sat=1.15, gama_luz=0.72)
raio.save(OUT / 'recurso-stamina.png')

# Éter: duas cores, verde (~135°) no alto e roxo (~280°) embaixo, com transição curta
# misturada em RGB (girar o matiz de 135 a 280 passaria pelo azul)
def eter_duas(img):
    verde = recolore(img, lambda x, y, h: 135 / 360, sat_min=0.12, ganho_sat=1.3, gama_luz=0.95)
    roxo = recolore(img, lambda x, y, h: 280 / 360, sat_min=0.12, ganho_sat=1.3, gama_luz=0.95)
    w, h = img.size
    pv, pr = verde.load(), roxo.load()
    out = Image.new('RGBA', (w, h))
    po = out.load()
    for y in range(h):
        for x in range(w):
            d = 0.62 * (y / h) + 0.38 * (1 - x / w)          # diagonal: alto-direita verde
            t = min(1.0, max(0.0, (d - 0.44) / 0.14))          # faixa de transição curta
            t = t * t * (3 - 2 * t)
            a, b = pv[x, y], pr[x, y]
            po[x, y] = tuple(round(a[i] * (1 - t) + b[i] * t) for i in range(3)) + (a[3],)
    return out

espiral = eter_duas(Image.open(SRC / 'Camada 12.png'))
espiral.save(OUT / 'recurso-eter.png')

# prancha antes/depois para conferir
pares = [(SRC / 'Camada 11.png', OUT / 'recurso-stamina.png'), (SRC / 'Camada 12.png', OUT / 'recurso-eter.png')]
W = 260
folha = Image.new('RGB', (W * 4, W), (18, 16, 24))
for i, (a, b) in enumerate(pares):
    for j, f in enumerate((a, b)):
        im = Image.open(f).convert('RGBA')
        im.thumbnail((W - 20, W - 20))
        x = (i * 2 + j) * W
        folha.paste(im, (x + (W - im.size[0]) // 2, (W - im.size[1]) // 2), im)
folha.save(OUT.parent / 'recolor-prancha.png')
print('ok')
