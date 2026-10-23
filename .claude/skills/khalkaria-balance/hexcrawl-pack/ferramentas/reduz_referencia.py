"""Gera as versões reduzidas dos mapas do Pedro para o repositório (docs/07-geografia.md §1).

Os originais (~50 MB cada) ficam fora do git. Uso:
    python ferramentas/reduz_referencia.py "<original oficial>.png" "<original ilusão>.png"
Saída: arte/referencia/kharavel-oficial.webp e kharavel-ilusao.webp, com 4096 px de largura.
"""
import os
import sys

from PIL import Image

Image.MAX_IMAGE_PIXELS = None          # os originais passam do limite padrão do Pillow
LARGURA = 4096
RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')


def reduz(origem: str, destino: str) -> None:
    im = Image.open(origem)
    im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')
    altura = round(im.height * LARGURA / im.width)
    print(f'{os.path.basename(origem)}: {im.width} x {im.height} -> {LARGURA} x {altura}')
    im.resize((LARGURA, altura), Image.LANCZOS).save(destino, 'WEBP', quality=90, method=6)
    print('  ', destino, f'{os.path.getsize(destino) / 1e6:.1f} MB')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    saida = os.path.join(RAIZ, 'arte', 'referencia')
    os.makedirs(saida, exist_ok=True)
    reduz(sys.argv[1], os.path.join(saida, 'kharavel-oficial.webp'))
    reduz(sys.argv[2], os.path.join(saida, 'kharavel-ilusao.webp'))
