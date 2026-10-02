"""Copia os ícones da ficha física A4 (página 1) para images/ficha/, com nome limpo
e em tamanho de uso (lado maior até 256 px). O WebP sai do build (tools/gerar_webp.py).

Uso: python tools/artefatos/icones_ficha.py [pasta com as camadas do pag1.zip]
Padrão: tools/artefatos/saida/pag1 (as camadas que o Pedro mandou, extraídas) e
tools/artefatos/saida/icones (Stamina e Éter recoloridos por recolorir_icones.py).

Os nomes do zip são 'Camada N' e vêm com o acento estragado (cp437), por isso
cada fonte é uma expressão regular sobre o nome inteiro. O mapeamento foi
conferido olhando cada imagem em 2026-10-02 (ver docs/ficha-digital/05-f4-pagina.md).
"""
import pathlib, re, sys
from PIL import Image

AQUI = pathlib.Path(__file__).parent
RAIZ = AQUI.parent.parent
PAG1 = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else AQUI / 'saida' / 'pag1'
ICONES = AQUI / 'saida' / 'icones'
SAIDA = RAIZ / 'images' / 'ficha'
LADO = 256

# destino -> (pasta, nome da fonte por regex)
MAPA = [
    ('saude.png',        PAG1,   r'Camada 3\.png'),                    # coração vermelho
    ('stamina.png',      ICONES, r'recurso-stamina\.png'),             # raio (Camada 11) recolorido em amarelo
    ('eter.png',         ICONES, r'recurso-eter\.png'),                # espiral (Camada 12) em verde e roxo
    ('movimento.png',    PAG1,   r'Camada 5\.png'),                    # pé com raízes
    ('sins.png',         PAG1,   r'Camada 6\.png'),                    # moeda
    ('evasao.png',       PAG1,   r'Camada 13\.png'),                   # escudo
    ('armadura.png',     PAG1,   r'Camada 14\.png'),                   # peitoral (Armadura e Resistência)
    ('cd.png',           PAG1,   r'Gemini_Generated_Image_31jez\S*\.png'),   # mão com garras
    ('forca.png',        PAG1,   r'For\S{1,6}a\.png'),                 # punho de raízes
    ('destreza.png',     PAG1,   r'Destreza\.png'),                    # flecha com ramos
    ('constituicao.png', PAG1,   r'Constitui\S+o\.png'),               # coração anatômico
    ('inteligencia.png', PAG1,   r'Intelig\S+ncia\.png'),              # livro com raízes
    ('sabedoria.png',    PAG1,   r'Sabedoria\.png'),                   # árvore
    ('mochila.png',      PAG1,   r'Khalkaria RPG Backpack Icon Colored\.png'),  # Equipamentos e Bugigangas
]


def fonte(pasta, padrao):
    achados = [p for p in pasta.iterdir() if re.fullmatch(padrao, p.name)]
    if len(achados) != 1:
        raise SystemExit(f'{padrao!r} em {pasta}: {len(achados)} arquivo(s) {[p.name for p in achados]}')
    return achados[0]


def main():
    SAIDA.mkdir(parents=True, exist_ok=True)
    for destino, pasta, padrao in MAPA:
        src = fonte(pasta, padrao)
        im = Image.open(src).convert('RGBA')
        antes = im.size
        if max(im.size) > LADO:
            im.thumbnail((LADO, LADO), Image.LANCZOS)
        im.save(SAIDA / destino, 'PNG', optimize=True)
        print(f'{destino:18} <- {src.name} {antes} -> {im.size}')


if __name__ == '__main__':
    main()
