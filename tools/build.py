#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Orquestrador de build do site Khalkaria (Rota 1: data/*.json -> pages/*.html).

Roda todos os geradores na ordem correta e, por padrão, valida o resultado.
O HTML de conteúdo é ARTEFATO — nunca editar à mão (ver CLAUDE.md §4 e §10).

Uso:
  python build.py              # gera tudo (Bazar incluso) + testes do motor + valida
  python build.py --bazar      # aceito por compatibilidade; não muda nada
  python build.py --no-check   # gera (e roda os testes do motor), sem validar
  python build.py magias racas # gera apenas os alvos indicados

Testes do motor: se existir tools/testes/ e houver `node` no PATH, roda
`node --test` nos tools/testes/**/*.test.js depois dos geradores; falha lá é
falha do build. Sem node, avisa que pulou.
"""
import subprocess, sys, os, re, glob, shutil
import shell, gerar_webp

TOOLS = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(TOOLS)

# ordem: páginas independentes primeiro; nome -> script
ALVOS = [
    ('sistema',   'gerar_sistema.py'),
    ('magias',    'gerar_magias.py'),
    ('condicoes', 'gerar_condicoes.py'),
    ('limiar',    'gerar_limiar.py'),
    ('classes',   'gerar_classes.py'),
    ('racas',     'gerar_racas.py'),
    ('origens',   'gerar_origens.py'),
    # o Bazar lê data/condicoes.json (selo de Sobrepeso), por isso vem depois
    ('bazar',     'gerar_bazar.py'),
]
TESTES = os.path.join(TOOLS, 'testes')

# Os geradores imprimem acento; sem isto o Python do Windows escreve cp1252 no
# pipe e a leitura em utf-8 abaixo quebra. KH_BUILD cala o aviso de fase 2 do
# gerador do Bazar, que só faz sentido quando ele roda solto.
ENV = dict(os.environ, PYTHONIOENCODING='utf-8', KH_BUILD='1')


def roda(script):
    # gerar_bazar.py tem outro contrato de CLI (csv, saida) e resolve a raiz
    # sozinho; os demais recebem repo_root em argv[1].
    argv = [] if script == 'gerar_bazar.py' else [ROOT]
    r = subprocess.run([sys.executable, os.path.join(TOOLS, script)] + argv,
                       capture_output=True, text=True, encoding='utf-8', env=ENV)
    saida = (r.stdout or '') + (r.stderr or '')
    for l in saida.strip().splitlines():
        print('   ', l)
    return r.returncode == 0


def roda_testes():
    """node --test nos *.test.js de tools/testes. Devolve False se algum falhar.

    Os arquivos vão listados um a um: o Node 24 trata `node --test <pasta>`
    como módulo a importar (MODULE_NOT_FOUND) e o Node 18/20 não expande glob.
    """
    node = shutil.which('node')
    if not node:
        print('[--] testes do motor pulados (node não encontrado no PATH)')
        return True
    arquivos = sorted(glob.glob(os.path.join(TESTES, '**', '*.test.js'), recursive=True)
                      + glob.glob(os.path.join(TESTES, '**', '*.test.mjs'), recursive=True))
    if not arquivos:
        print('[--] testes do motor: tools/testes/ sem *.test.js')
        return True
    print(f'[>>] testes do motor (node --test, {len(arquivos)} arquivo(s))')
    sys.stdout.flush()
    # reporter tap: ASCII no resumo (o console do Windows pode ser cp1252)
    r = subprocess.run([node, '--test', '--test-reporter=tap'] + arquivos, cwd=ROOT,
                       capture_output=True, text=True, encoding='utf-8', errors='replace')
    saida = ((r.stdout or '') + (r.stderr or '')).strip().splitlines()
    # verde: só o resumo final; vermelho: tudo, para achar o caso que caiu
    resumo = re.compile(r'^# (tests|pass|fail|cancelled|skipped|todo) \d+')
    for l in (saida if r.returncode else [x for x in saida if resumo.match(x)]):
        print('   ', l)
    return r.returncode == 0


def main():
    # saída redirecionada no Windows é cp1252: caractere fora dela vira '?'
    # em vez de derrubar o build no meio (UnicodeEncodeError)
    try:
        sys.stdout.reconfigure(errors='replace')
    except (AttributeError, ValueError):
        pass
    args =[a for a in sys.argv[1:] if not a.startswith('--')]
    flags = {a for a in sys.argv[1:] if a.startswith('--')}

    # --bazar era o opt-in do Bazar quando ele ficava fora do build; hoje é
    # no-op, aceito para não quebrar quem ainda digita o comando antigo.
    alvos = list(ALVOS)
    if args:
        alvos = [a for a in alvos if a[0] in args]
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

    print('[>>] webp')
    gerar_webp.gerar()

    print('[>>] shell (navegação única + âncoras estáveis + webp)')
    shell.aplicar(ROOT)

    if os.path.isdir(TESTES):
        if not roda_testes():
            falhas.append('testes do motor')

    if falhas:
        raise SystemExit(f'\nFALHA na geração: {", ".join(falhas)}')
    print('\nBuild OK.')

    if '--no-check' not in flags:
        print()
        sys.stdout.flush()   # garante ordem com a saída do subprocesso
        r = subprocess.run([sys.executable, os.path.join(TOOLS, 'validar.py'), ROOT], env=ENV)
        raise SystemExit(r.returncode)


if __name__ == '__main__':
    main()
