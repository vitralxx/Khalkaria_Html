#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Normaliza a arte dos materiais para images/materiais/<slug>.webp

Os PNGs originais (upscale 5x, ~1100 px, 1,5 MB cada) ficam FORA do repo — 48 MB
não valem versionamento. O que entra é o tile de 256 px em WebP (~20 KB), que
cobre exibição em 64-96 px com folga de retina.

Doze das 32 imagens vieram sem recorte, com fundo quase uniforme em ~#16161d —
que é praticamente a cor do card do site. Em vez de tentar recortar (o que
comeria borda da arte), todas são compostas sobre esse mesmo fundo: o
recorte imperfeito deixa de aparecer e as 32 ficam com o mesmo tratamento.

Mapa nome-do-material -> arquivo: data/icones-materiais.json

  python tools/gerar_icones_materiais.py <pasta_com_os_png>
"""
import json, os, re, sys, unicodedata

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAPA = os.path.join(RAIZ, 'data', 'icones-materiais.json')
SAIDA = os.path.join(RAIZ, 'images', 'materiais')
FUNDO = (0x16, 0x16, 0x1d)
LADO = 256
MARGEM = 0.06          # respiro para a arte não encostar na borda do medalhão


def slug(nome):
    s = unicodedata.normalize('NFKD', nome).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def recorta(im):
    """Corta a moldura vazia: alfa, quando existe; senão, o fundo liso."""
    if im.mode == 'RGBA' and im.getchannel('A').getextrema()[0] < 250:
        cx = im.getchannel('A').getbbox()
        return im.crop(cx) if cx else im
    from PIL import Image, ImageChops
    rgb = im.convert('RGB')
    fundo = Image.new('RGB', rgb.size, rgb.getpixel((2, 2)))
    dif = ImageChops.difference(rgb, fundo).convert('L').point(lambda p: 255 if p > 18 else 0)
    cx = dif.getbbox()
    return im.crop(cx) if cx else im


def gerar(pasta):
    from PIL import Image
    mapa = json.load(open(MAPA, encoding='utf-8'))
    os.makedirs(SAIDA, exist_ok=True)
    feitos, faltando = 0, []
    for material, arquivo in sorted(mapa['icones'].items()):
        src = os.path.join(pasta, arquivo)
        if not os.path.exists(src):
            faltando.append(arquivo)
            continue
        im = recorta(Image.open(src).convert('RGBA'))
        util = int(LADO * (1 - 2 * MARGEM))
        im.thumbnail((util, util), Image.LANCZOS)
        tile = Image.new('RGBA', (LADO, LADO), FUNDO + (255,))
        tile.alpha_composite(im, ((LADO - im.width) // 2, (LADO - im.height) // 2))
        destino = os.path.join(SAIDA, slug(material) + '.webp')
        tile.convert('RGB').save(destino, 'WEBP', quality=88, method=6)
        feitos += 1
    peso = sum(os.path.getsize(os.path.join(SAIDA, f)) for f in os.listdir(SAIDA))
    print(f'{feitos} ícones -> images/materiais/ ({peso / 1024:.0f} KB no total)')
    if faltando:
        print(f'  arquivos não encontrados em {pasta}: {faltando}')
    semIcone = [m for m in mapa.get('semIcone', [])]
    if semIcone:
        print(f'  materiais ainda sem arte: {semIcone}')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    gerar(sys.argv[1])
