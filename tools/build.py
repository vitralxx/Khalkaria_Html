#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Orquestrador de build do site Khalkaria (Rota 1: data/*.json -> pages/*.html).

Roda todos os geradores na ordem correta e, por padrão, valida o resultado.
O HTML de conteúdo é ARTEFATO — nunca editar à mão (ver CLAUDE.md §4 e §10).

Uso:
  python build.py              # gera tudo (menos o Bazar) + valida
  python build.py --bazar      # inclui gerar_bazar.py (escopo do Pedro)
  python build.py --no-check   # só gera, sem validar
  python build.py magias racas # gera apenas os alvos indicados
"""
import subprocess, sys, os
import shell

TOOLS = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(TOOLS)

# ordem: páginas independentes primeiro; nome -> script
ALVOS = [
    ('sistema',   None),                  # ainda sem pipeline JSON (HTML manual)
    ('magias',    'gerar_magias.py'),
    ('condicoes', 'gerar_condicoes.py'),
    ('limiar',    'gerar_limiar.py'),
    ('classes',   'gerar_classes.py'),
    ('racas',     'gerar_racas.py'),
    ('origens',   'gerar_origens.py'),
]
BAZAR = ('bazar', 'gerar_bazar.py')


def roda(script):
    # gerar_bazar.py tem outro contrato de CLI (csv, saida) e resolve a raiz
    # sozinho; os demais recebem repo_root em argv[1].
    argv = [] if script == 'gerar_bazar.py' else [ROOT]
    r = subprocess.run([sys.executable, os.path.join(TOOLS, script)] + argv,
                       capture_output=True, text=True, encoding='utf-8')
    saida = (r.stdout or '') + (r.stderr or '')
    for l in saida.strip().splitlines():
        print('   ', l)
    return r.returncode == 0


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    flags = {a for a in sys.argv[1:] if a.startswith('--')}

    alvos = list(ALVOS)
    if '--bazar' in flags:
        alvos.append(BAZAR)
    if args:
        alvos = [a for a in alvos + [BAZAR] if a[0] in args]
        desconhecidos = set(args) - {a[0] for a in alvos}
        if desconhecidos:
            raise SystemExit(f'alvo desconhecido: {sorted(desconhecidos)}')

    falhas = []
    for nome, script in alvos:
        if script is None:
            print(f'[--] {nome}: sem gerador (HTML manual — migração pendente)')
            continue
        print(f'[>>] {nome}')
        if not roda(script):
            falhas.append(nome)

    print('[>>] shell (navegação única + âncoras estáveis)')
    shell.aplicar(ROOT)

    if falhas:
        raise SystemExit(f'\nFALHA na geração: {", ".join(falhas)}')
    print('\nBuild OK.')

    if '--no-check' not in flags:
        print()
        sys.stdout.flush()   # garante ordem com a saída do subprocesso
        r = subprocess.run([sys.executable, os.path.join(TOOLS, 'validar.py'), ROOT])
        raise SystemExit(r.returncode)


if __name__ == '__main__':
    main()
