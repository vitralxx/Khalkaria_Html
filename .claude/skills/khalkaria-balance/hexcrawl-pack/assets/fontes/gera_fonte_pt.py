"""Acrescenta ã õ Ã Õ à DungeonFont (CC0): base + til do ñ/Ñ, centrado como o circunflexo, na grade de 60 unidades."""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.transformPen import TransformPen

src, dst = sys.argv[1], sys.argv[2]
f = TTFont(src)
glyf, hmtx, cm = f['glyf'], f['hmtx'], f.getBestCmap()
GRADE, ORIG = 60, 20

def contornos(nome):
    rp = RecordingPen(); f.getGlyphSet()[nome].draw(rp)
    out, cur = [], []
    for op, args in rp.value:
        cur.append((op, args))
        if op in ('closePath', 'endPath'):
            out.append(cur); cur = []
    return out

def xs(conts):
    v = [p[0] for c in conts for op, a in c for p in a]
    return min(v), max(v)

def acento(com, sem):
    """contornos que existem no glifo acentuado e não no base (por ordem: os últimos)"""
    a, b = contornos(com), contornos(sem)
    return a[len(b):]

novos = {'atilde': ('a', 'ntilde', 'n', 'acircumflex', 0x00E3),
         'otilde': ('o', 'ntilde', 'n', 'ocircumflex', 0x00F5),
         'Atilde': ('A', 'Ntilde', 'N', 'Acircumflex', 0x00C3),
         'Otilde': ('O', 'Ntilde', 'N', 'Ocircumflex', 0x00D5)}
ordem = f.getGlyphOrder()
for nome, (base, comtil, semtil, circ, cp) in novos.items():
    til = acento(comtil, semtil)
    circunflexo = acento(circ, base)
    cx_til = sum(xs(til)) / 2
    cx_circ = sum(xs(circunflexo)) / 2
    dx = round((cx_circ - cx_til) / GRADE) * GRADE        # preso à grade
    pen = TTGlyphPen(f.getGlyphSet())
    for c in contornos(base):
        for op, a in c: getattr(pen, op)(*a)
    tp = TransformPen(pen, (1, 0, 0, 1, dx, 0))
    for c in til:
        for op, a in c: getattr(tp, op)(*a)
    glyf[nome] = pen.glyph()
    hmtx[nome] = hmtx[base]
    for t in f['cmap'].tables:
        if t.isUnicode(): t.cmap[cp] = nome
ordem = list(dict.fromkeys(glyf.glyphOrder))  # o glyf já acrescentou os nomes novos
glyf.glyphOrder = ordem
f.setGlyphOrder(ordem)
for r in f['name'].names:
    if r.nameID == 5:
        r.string = 'Version 1.1-pt (ã õ Ã Õ acrescentados; CC0)'
f.save(dst)
print('ok', dst)
