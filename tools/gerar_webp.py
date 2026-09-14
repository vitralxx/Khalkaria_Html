#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera o .webp de cada imagem de images/ (mesmas dimensões, só re-encode).

Os PNG continuam sendo a fonte — o Pedro substitui images/*.png à mão
(CLAUDE.md §9) e o build regenera o .webp de quem mudou. As páginas apontam
para o .webp; tools/shell.py faz essa troca no build, e cai de volta no .png
sozinho para qualquer imagem que ainda não tenha .webp.

  python tools/gerar_webp.py           # só o que está desatualizado
  python tools/gerar_webp.py --force   # reencoda tudo
"""
import os, sys

TOOLS = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(TOOLS)
IMAGENS = os.path.join(RAIZ, 'images')
FONTES = ('.png', '.jpg', '.jpeg')
QUALIDADE = 82


def caminhos():
    for dirpath, _, nomes in os.walk(IMAGENS):
        for n in sorted(nomes):
            if n.lower().endswith(FONTES):
                yield os.path.join(dirpath, n)


def gerar(force=False):
    try:
        from PIL import Image
    except ImportError:
        print('    Pillow não instalado (pip install Pillow) — webp não gerado')
        return 0
    n = antes = depois = 0
    for src in caminhos():
        dst = os.path.splitext(src)[0] + '.webp'
        if not force and os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
            antes += os.path.getsize(src)
            depois += os.path.getsize(dst)
            continue
        im = Image.open(src)
        if im.mode not in ('RGB', 'RGBA'):
            im = im.convert('RGBA' if 'A' in im.mode or im.mode == 'P' else 'RGB')
        im.save(dst, 'WEBP', quality=QUALIDADE, method=6)
        antes += os.path.getsize(src)
        depois += os.path.getsize(dst)
        n += 1
        print(f'    {os.path.relpath(src, RAIZ)}: '
              f'{os.path.getsize(src)/1048576:.1f} MB -> {os.path.getsize(dst)/1048576:.2f} MB')
    if antes:
        print(f'    webp: {n} reencodadas | acervo servido {antes/1048576:.1f} MB '
              f'-> {depois/1048576:.1f} MB ({100 - depois*100//antes}% menor)')
    return n


if __name__ == '__main__':
    gerar('--force' in sys.argv)
