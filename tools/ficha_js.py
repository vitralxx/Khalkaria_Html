#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""js/ficha.js é ARTEFATO: a concatenação das fontes js/ficha/*.js na ordem do
manifesto js/ficha/ORDEM (plano §3.1, F2a).

Cada fonte é uma IIFE que registra window.KhX e, no node, exporta por
module.exports (os testes de tools/testes carregam as fontes ou o artefato).
O carregamento no site continua um arquivo só: o main.js injeta js/ficha.js e
o Bazar o carrega direto.

  python tools/ficha_js.py            # regrava js/ficha.js
  python tools/ficha_js.py --checar   # só confere (código 1 se divergir)

O build.py grava antes dos geradores (o gerar_bazar.py e o shell leem o
js/ficha.js para a versão dos assets); o validar.py [artefato-js] confere.
A comparação ignora CRLF x LF (checkout antigo com core.autocrlf).
"""
import os, sys

TOOLS = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(TOOLS)

CABECALHO = (
    '/* js/ficha.js — ARTEFATO gerado — não editar.\n'
    ' * Fonte: js/ficha/*.js, concatenadas na ordem de js/ficha/ORDEM por\n'
    ' * tools/ficha_js.py (o build grava; o validar [artefato-js] confere).\n'
    ' */\n'
)


def ordem(raiz=RAIZ):
    """Nomes do manifesto, na ordem. Levanta ValueError se o manifesto estiver
    inválido (arquivo ausente, repetido, fonte fora do manifesto)."""
    pasta = os.path.join(raiz, 'js', 'ficha')
    man = os.path.join(pasta, 'ORDEM')
    if not os.path.isfile(man):
        raise ValueError('js/ficha/ORDEM não existe')
    nomes = []
    for l in open(man, encoding='utf-8').read().splitlines():
        l = l.strip()
        if not l or l.startswith('#'):
            continue
        if '/' in l or '\\' in l or not l.endswith('.js'):
            raise ValueError(f'js/ficha/ORDEM: linha inválida "{l}" (um arquivo .js de js/ficha/ por linha)')
        if l in nomes:
            raise ValueError(f'js/ficha/ORDEM: "{l}" repetido')
        if not os.path.isfile(os.path.join(pasta, l)):
            raise ValueError(f'js/ficha/ORDEM: "{l}" não existe em js/ficha/')
        nomes.append(l)
    if not nomes:
        raise ValueError('js/ficha/ORDEM vazio')
    fora = sorted(set(n for n in os.listdir(pasta) if n.endswith('.js')) - set(nomes))
    if fora:
        raise ValueError(f'fonte(s) em js/ficha/ fora do ORDEM: {", ".join(fora)}')
    return nomes


def concatena(raiz=RAIZ):
    partes = [CABECALHO]
    for n in ordem(raiz):
        txt = open(os.path.join(raiz, 'js', 'ficha', n), encoding='utf-8', newline='').read()
        txt = txt.replace('\r\n', '\n')
        if not txt.endswith('\n'):
            txt += '\n'
        partes.append(f'\n// ==== js/ficha/{n} ====\n')
        partes.append(txt)
    return ''.join(partes)


def artefato(raiz=RAIZ):
    return os.path.join(raiz, 'js', 'ficha.js')


def grava(raiz=RAIZ):
    novo = concatena(raiz)
    p = artefato(raiz)
    atual = open(p, encoding='utf-8', newline='').read() if os.path.isfile(p) else None
    if atual is not None and atual.replace('\r\n', '\n') == novo:
        return False
    open(p, 'w', encoding='utf-8', newline='\n').write(novo)
    return True


def confere(raiz=RAIZ):
    """Lista de problemas (vazia = js/ficha.js é exatamente a concatenação)."""
    try:
        novo = concatena(raiz)
    except ValueError as e:
        return [str(e)]
    p = artefato(raiz)
    if not os.path.isfile(p):
        return ['js/ficha.js não existe (rode python tools/build.py)']
    atual = open(p, encoding='utf-8', newline='').read().replace('\r\n', '\n')
    if atual == novo:
        return []
    a, b = atual.split('\n'), novo.split('\n')
    i = next((k for k in range(min(len(a), len(b))) if a[k] != b[k]), min(len(a), len(b)))
    return [f'js/ficha.js difere da concatenação de js/ficha/ORDEM (1ª diferença na linha {i + 1}): '
            f'editar js/ficha/*.js e rodar python tools/build.py, nunca o artefato']


if __name__ == '__main__':
    if '--checar' in sys.argv[1:]:
        probs = confere()
        for x in probs:
            print('FALHA ', x)
        sys.exit(1 if probs else 0)
    try:
        mudou = grava()
    except ValueError as e:
        raise SystemExit(f'FALHA  {e}')
    print('js/ficha.js ' + ('regravado' if mudou else 'já confere'))
