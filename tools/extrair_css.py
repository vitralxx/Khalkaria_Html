#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extrai o CSS duplicado dos <style> inline para folhas compartilhadas.

Uso pontual (refatoração), não faz parte do build. Depois de rodar, o CSS
compartilhado vive em css/ e os <style> inline guardam só o que é próprio da
página — nas classes, os tokens :root de cor do ramo.

Regra de segurança do cascade: uma regra só é extraída se, em TODAS as páginas
do grupo, ela for idêntica (seletor+corpo), aparecer na mesma ordem relativa
às outras extraídas, e não houver outra regra com o MESMO seletor ficando
inline antes dela (o que inverteria a precedência). O que não passa nesses
testes continua inline.

  python tools/extrair_css.py classes   -> css/classes.css
  python tools/extrair_css.py racas     -> css/racas.css
"""
import os, re, sys, glob

TOOLS = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(TOOLS)

GRUPOS = {
    'classes': ('templates/classes/*.template.html', 'css/classes.css',
                'Estilos compartilhados das 7 páginas de classe'),
    'racas':   ('templates/racas/*.template.html', 'css/racas.css',
                'Estilos compartilhados das 7 páginas de raça'),
}
RE_STYLE = re.compile(r'(<style[^>]*>)(.*?)(</style>)', re.S)
RE_REGRA = re.compile(r'([^{}]+)\{([^{}]*)\}', re.S)


def parse(css):
    """[(selector_normalizado, corpo_normalizado, texto_original)] — ignora @media."""
    out = []
    for m in RE_REGRA.finditer(css):
        sel = re.sub(r'\s+', ' ', m.group(1)).strip()
        if sel.startswith('@') or '@media' in sel or '@keyframes' in sel:
            return None                      # bloco aninhado: não mexe neste arquivo
        out.append((sel, re.sub(r'\s+', ' ', m.group(2)).strip().rstrip(';'), m.group(0)))
    return out


def extrair(grupo):
    padrao, saida, titulo = GRUPOS[grupo]
    arquivos = sorted(glob.glob(os.path.join(RAIZ, padrao)))
    estilos, regras = {}, {}
    for f in arquivos:
        html = open(f, encoding='utf-8', newline='').read()
        m = RE_STYLE.search(html)
        css = m.group(2)
        # separa @media/@keyframes: ficam sempre inline (aninhados)
        blocos_at = re.findall(r'@[a-z-]+[^{]*\{(?:[^{}]|\{[^{}]*\})*\}', css, re.S)
        plano = css
        for b in blocos_at:
            plano = plano.replace(b, '')
        estilos[f] = (html, m, css, blocos_at, plano)
        regras[f] = parse(re.sub(r'/\*.*?\*/', '', plano, flags=re.S))

    ref = arquivos[0]
    # candidatas: (sel, corpo) idênticas em 2+ arquivos.
    # Um arquivo que NÃO tem a regra só é aceito se redefinir o mesmo seletor
    # inline declarando TODAS as propriedades da regra extraída — aí o override
    # é total e a extração é comprovadamente neutra para ele. Se o arquivo não
    # tem o seletor (ou cobre só parte das propriedades), a regra fica inline.
    def props(corpo):
        return {d.split(':', 1)[0].strip() for d in corpo.split(';') if ':' in d}

    contagem = {}
    for f in arquivos:
        for s, c, _ in regras[f]:
            contagem.setdefault((s, c), set()).add(f)
    comuns = set()
    for (s, c), donos in contagem.items():
        if len(donos) < 2:
            continue
        if all(any(s2 == s and props(c) <= props(c2) for s2, c2, _ in regras[f])
               for f in arquivos if f not in donos):
            comuns.add((s, c))
    # o texto-modelo vem de um arquivo que realmente tem a regra
    dono = {k: sorted(v)[0] for k, v in contagem.items()}

    # ordem canônica: mescla as sequências dos arquivos preservando a ordem
    # relativa de cada um. Se dois arquivos discordam da ordem de um par, a
    # regra conflitante sai (fica inline) — extrair inverteria o cascade.
    ordem_ref = []
    for f in arquivos:
        seq = [x[:2] for x in regras[f] if x[:2] in comuns]
        pos = 0
        for r in seq:
            if r in ordem_ref:
                i = ordem_ref.index(r)
                if i < pos:                       # discorda da ordem já fixada
                    comuns.discard(r)
                    ordem_ref.remove(r)
                    continue
                pos = i + 1
            else:
                ordem_ref.insert(pos, r)
                pos += 1

    # nenhuma regra inline com o mesmo seletor pode ficar ANTES de uma extraída
    inseguras = set()
    for f in arquivos:
        vistos_inline = set()
        for sel, corpo, _ in regras[f]:
            if (sel, corpo) in comuns:
                if sel in vistos_inline:
                    inseguras.add((sel, corpo))
            else:
                vistos_inline.add(sel)
    comuns -= inseguras
    ordem_ref = [x for x in ordem_ref if x in comuns]

    # escreve a folha compartilhada
    corpo_css = [f'/* {titulo}. Gerado por tools/extrair_css.py — carregado',
                 '   depois de style.css; o <style> de cada página guarda só o que é dela. */', '']
    texto = {}
    for f in arquivos:
        for x in regras[f]:
            texto.setdefault(x[:2], x[2])
    for k in ordem_ref:
        corpo_css.append(texto[k].strip())
        corpo_css.append('')
    open(os.path.join(RAIZ, saida), 'w', encoding='utf-8', newline='').write(
        ('\r\n'.join(corpo_css)).replace('\r\r', '\r'))

    # remove as extraídas de cada <style> e adiciona o <link>
    href = os.path.basename(saida)
    for f in arquivos:
        html, m, css, blocos_at, plano = estilos[f]
        novo = css
        for sel, corpo, orig in regras[f]:
            if (sel, corpo) in comuns:
                novo = novo.replace(orig, '', 1)
        novo = re.sub(r'(?:[ \t]*\r?\n){3,}', '\r\n\r\n', novo)
        html = html[:m.start(2)] + novo + html[m.end(2):]
        link = f'<link rel="stylesheet" href="../../css/{href}">'
        if link not in html:
            html = html.replace('<link rel="stylesheet" href="../../css/style.css">',
                                f'<link rel="stylesheet" href="../../css/style.css">\r\n    {link}', 1)
        open(f, 'w', encoding='utf-8', newline='').write(html)

    print(f'{grupo}: {len(ordem_ref)} regras -> {saida} '
          f'({len(inseguras)} mantidas inline por ordem de cascade)')
    return len(ordem_ref)


if __name__ == '__main__':
    for g in (sys.argv[1:] or list(GRUPOS)):
        extrair(g)
