#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Gerador reverso do Sistema (Rota 1): data/sistema.json -> pages/sistema.html
# Fonte da verdade = data/sistema.json. NÃO editar pages/sistema.html à mão.
# Template: templates/sistema.template.html — placeholders {{CAT_<id>}}, um por
# categoria (fundamentos, combate, equipamento, exploracao, sobrevivencia,
# progressao, magia). Cada categoria tem subseções endereçáveis por id:
#   sistema.categorias[id=combate].conteudo[id=ataques].html
# O "Índice de Navegação" sai das mesmas subseções: {{IDX_<id>}} recebe um link
# por subseção, rotulado por `indice` (rótulo curto, opcional) ou por `nome`.
# Subseção nova no JSON aparece no índice sem edição à mão.
# Uso: python tools/gerar_sistema.py [repo_root]
import json, sys, os

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = sys.argv[1] if len(sys.argv) > 1 else RAIZ
TPL = f'{REPO}/templates/sistema.template.html'
JSON_SRC = f'{REPO}/data/sistema.json'
OUT = f'{REPO}/pages/sistema.html'


def gen_categoria(cat):
    return ''.join(p['html'] for p in cat['conteudo'])


def gen_indice(cat, nl):
    return (nl + ' ' * 28).join(
        f'<a href="#{p["id"]}">{p.get("indice") or p["nome"]}</a>'
        for p in cat['conteudo'] if p['tipo'] == 'subsecao')


def main():
    page = open(TPL, encoding='utf-8', newline='').read()
    nl = '\r\n' if '\r\n' in page else '\n'   # o template vem com CRLF do checkout
    data = json.load(open(JSON_SRC, encoding='utf-8'))
    for cat in data['categorias']:
        ph = f'{{{{CAT_{cat["id"]}}}}}'
        if ph not in page:
            raise SystemExit(f'placeholder {ph} ausente no template')
        page = page.replace(ph, gen_categoria(cat))
        ph = f'{{{{IDX_{cat["id"]}}}}}'
        if ph not in page:
            raise SystemExit(f'placeholder {ph} ausente no template')
        page = page.replace(ph, gen_indice(cat, nl))
    open(OUT, 'w', encoding='utf-8', newline='').write(page)
    n = sum(sum(1 for p in c['conteudo'] if p['tipo'] == 'subsecao') for c in data['categorias'])
    print(f'sistema.html gerado: {len(data["categorias"])} categorias, {n} subseções -> {OUT}')


if __name__ == '__main__':
    main()
