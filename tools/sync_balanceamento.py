#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Entrega do balanceamento -> privado/balanceamento/ (verbatim) + data/balanceamento/ (projeção).

F1d (plano §3.2, §7 F1d; D3, D11, D33). O agente de balanceamento entrega na
branch dele (`origin/claude/khalkaria-bazar-balance-lsdfic`), pasta
`.claude/skills/khalkaria-balance/references/`. Este script:

1. copia VERBATIM, por `git show <commit>:<pasta>/<arquivo>` (bytes, sem
   reformatar), os 4 arquivos de ARQUIVOS para `privado/balanceamento/`
   (gitignored: é o original, com o que o site não publica);
2. grava em `data/balanceamento/` a PROJEÇÃO publicada (D3), que é o mesmo
   JSON sem nada de carta rara não revelada (D11/D33):
     - todo objeto com `"rara": true` sai;
     - todo objeto cuja `fonte`/`id`/`carta` é o id de uma rara oculta sai, e
       toda chave que é id de rara oculta também;
     - em todo texto, a frase que cita o nome de uma rara oculta vira o
       MARCADOR fixo (o nome dentro do nome de um item do Bazar, ex. "Lâmina
       Etérea", não conta); frases citadas seguidas viram um marcador só, e a
       chave fica mesmo quando o texto inteiro vira marcador;
   e com o texto das Marcas da Vhelor numa fonte só: o bloco `marcasVhelor` do
   arquivo de efeitos é cópia do `marcas-vhelor.json` (o gerador deles copia) e
   vira a referência `{"_fonte": "marcas-vhelor.json"}` (se a cópia divergir do
   original, o script para);
3. grava `data/balanceamento/fonte.json`: ref, commit de origem, sha256 de
   cada verbatim e a lista do que a projeção tirou (caminho e motivo, nunca o
   texto tirado).

Rara oculta = carta da categoria `rara` do data/limiar.json sem `revelada`
(o tools/revelar_carta.py da F1f marca a revelada; aí ela passa a entrar).

`projeta()` é pura (bytes -> bytes) e é o que o validar.py ([balanceamento])
reroda sobre o privado local para conferir a projeção byte a byte.

Uso:
  python tools/sync_balanceamento.py            # usa a ref como está (sem fetch)
  python tools/sync_balanceamento.py --fetch    # git fetch origin antes
  python tools/sync_balanceamento.py --ref <commit-ou-ref>
Depois: python tools/build.py (regenera data/efeitos.json e valida).
"""
import hashlib, json, os, re, subprocess, sys

TOOLS = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(TOOLS)

REF = 'origin/claude/khalkaria-bazar-balance-lsdfic'
PASTA = '.claude/skills/khalkaria-balance/references'
ARQUIVOS = ['ficha-digital-regras.json', 'ficha-efeitos-itens.json',
            'ficha-efeitos-overrides.json', 'marcas-vhelor.json']
PRIVADO = os.path.join('privado', 'balanceamento')
PUBLICO = os.path.join('data', 'balanceamento')
FONTE = 'fonte.json'
MARCAS = 'marcas-vhelor.json'
EFEITOS = 'ficha-efeitos-itens.json'

# a frase que cita rara oculta vira este marcador (não some): a chave e a posição ficam,
# e quem lê o dado sabe que ali havia texto (ex.: o status de uma pendência)
MARCADOR = '[trecho sobre carta rara oculta]'
_FORA = object()          # sentinela: "sai da projeção" (null do JSON continua null)
# fim de frase: . ! ? (com aspas/parêntese colados) seguido de espaço, ou fim do texto
RE_FRASE = re.compile(r'.*?(?:[.!?]+["”)\]]*(?=\s)|$)\s*', re.S)


def git(*args, root=RAIZ, binario=False):
    r = subprocess.run(['git', '-C', root] + list(args), capture_output=True,
                       env=dict(os.environ, MSYS_NO_PATHCONV='1'))
    if r.returncode:
        raise SystemExit(f'git {" ".join(args)}: {r.stderr.decode("utf-8", "replace").strip()[:300]}')
    return r.stdout if binario else r.stdout.decode('utf-8').strip()


# ---------------------------------------------------------------- raras
def raras_ocultas(root=RAIZ):
    """{id: nome} das cartas raras do Limiar ainda não reveladas (data/limiar.json)."""
    lim = json.load(open(os.path.join(root, 'data', 'limiar.json'), encoding='utf-8'))
    out = {}
    for cat in lim['catalogo']:
        if cat['id'] != 'rara':
            continue
        for c in cat['cards']:
            if not c.get('revelada'):
                out[c['id']] = c['nome']
    if not out and not any(c['id'] == 'rara' for c in lim['catalogo']):
        raise SystemExit('data/limiar.json sem a categoria "rara": a projeção não sabe o que filtrar')
    return out


def bazar_publico(root=RAIZ):
    """(nomes, efeitos) do data/bazar.json: texto que o site já publica na página do Bazar."""
    b = json.load(open(os.path.join(root, 'data', 'bazar.json'), encoding='utf-8'))
    return sorted({x['nome'] for x in b}, key=len, reverse=True), [x['efeito'] for x in b]


class Detector:
    """Acha menção a rara oculta num texto: nome inteiro, com a caixa do nome,
    fora de nome de item do Bazar e fora de texto que o Bazar já publica (o
    "O Mestre rola os dados." da Tinta do Destino é o mestre, não a carta)."""

    def __init__(self, raras, publico):
        itens, efeitos = publico
        self.raras = dict(raras)
        self.nomes = {n: re.compile(r'(?<![\w])' + re.escape(n) + r'(?![\w])') for n in raras.values()}
        self.itens = [re.compile(re.escape(n)) for n in itens]
        self.efeitos = '\n'.join(efeitos)

    def cita(self, s):
        nucleo = s.strip().rstrip('.')
        if nucleo and nucleo in self.efeitos:
            return []
        mascara = s
        for rx in self.itens:              # nome de item vira espaço (mesmo tamanho)
            mascara = rx.sub(lambda m: ' ' * len(m.group(0)), mascara)
        return sorted(n for n, rx in self.nomes.items() if rx.search(mascara))


def frases(s):
    return [f for f in RE_FRASE.findall(s) if f]


def _filtra(v, cam, det, tirados):
    if isinstance(v, dict):
        if v.get('rara') is True:
            tirados.append((cam, 'objeto rara:true'))
            return _FORA
        for k in ('fonte', 'id', 'carta'):
            if isinstance(v.get(k), str) and v[k] in det.raras:
                tirados.append((cam, f'{k} = rara oculta'))
                return _FORA
        out = {}
        for k, x in v.items():
            sub = f'{cam}.{k}' if cam else k
            if k in det.raras:
                tirados.append((sub, 'chave = rara oculta'))
                continue
            y = _filtra(x, sub, det, tirados)
            if y is not _FORA:
                out[k] = y
        return out
    if isinstance(v, list):
        out = []
        for i, x in enumerate(v):
            y = _filtra(x, f'{cam}.{i}', det, tirados)
            if y is not _FORA:
                out.append(y)
        return out
    if isinstance(v, str) and det.cita(v):
        partes, n = [], 0
        for f in frases(v):
            if not det.cita(f):
                partes.append(f)
                continue
            n += 1
            if partes and partes[-1].startswith(MARCADOR):     # frases citadas seguidas: um marcador só
                continue
            partes.append(MARCADOR + f[len(f.rstrip()):])
        fica = ''.join(partes).strip()
        if fica == MARCADOR:
            tirados.append((cam, 'texto cita rara oculta (vira marcador)'))
        else:
            tirados.append((cam, f'{n} frase(s) citam rara oculta (viram marcador)'))
        return fica
    return v


def serializa(doc):
    return (json.dumps(doc, ensure_ascii=False, indent=1) + '\n').encode('utf-8')


def projeta(verbatim, raras, publico):
    """{arquivo: bytes verbatim} -> ({arquivo: bytes da projeção}, [(arquivo, caminho, motivo)])."""
    det = Detector(raras, publico)
    docs = {a: json.loads(b.decode('utf-8')) for a, b in verbatim.items()}
    marcas = docs.get(MARCAS)
    ef = docs.get(EFEITOS)
    tirados = []
    if ef is not None and 'marcasVhelor' in ef:
        if ef['marcasVhelor'] != marcas:
            raise SystemExit(f'{EFEITOS}: bloco marcasVhelor diverge de {MARCAS} (o texto das Marcas '
                             'tem de ter uma fonte só): peça ao balanceamento para regenerar')
        ef['marcasVhelor'] = {'_fonte': MARCAS}
        tirados.append((EFEITOS, 'marcasVhelor', f'cópia de {MARCAS} (fonte única)'))
    out = {}
    for a in sorted(docs):
        t = []
        doc = _filtra(docs[a], '', det, t)
        tirados += [(a, c, m) for c, m in t]
        out[a] = serializa(doc)
    return out, tirados


# ---------------------------------------------------------------- main
def main():
    try:
        sys.stdout.reconfigure(errors='replace')
    except (AttributeError, ValueError):
        pass
    args = sys.argv[1:]
    ref = args[args.index('--ref') + 1] if '--ref' in args else REF
    if '--fetch' in args:
        git('fetch', 'origin')
    commit = git('rev-parse', '--verify', f'{ref}^{{commit}}')
    verbatim = {a: git('show', f'{commit}:{PASTA}/{a}', binario=True) for a in ARQUIVOS}

    priv = os.path.join(RAIZ, PRIVADO)
    os.makedirs(priv, exist_ok=True)
    for a, b in verbatim.items():
        with open(os.path.join(priv, a), 'wb') as fh:
            fh.write(b)

    raras = raras_ocultas()
    proj, tirados = projeta(verbatim, raras, bazar_publico())
    pub = os.path.join(RAIZ, PUBLICO)
    os.makedirs(pub, exist_ok=True)
    for a, b in proj.items():
        with open(os.path.join(pub, a), 'wb') as fh:
            fh.write(b)

    fonte = {
        'schemaVersion': 'balanceamento-fonte/1',
        '_doc': 'Gerado por tools/sync_balanceamento.py: não editar à mão. Os arquivos ao lado são a '
                'PROJEÇÃO publicada (D3) da entrega do balanceamento, sem carta rara não revelada '
                '(D11/D33); o verbatim fica em privado/balanceamento/ (gitignored).',
        'ref': ref,
        'commit': commit,
        'pasta': PASTA,
        'arquivos': {a: {'schemaVersion': json.loads(verbatim[a]).get('schemaVersion'),
                         'sha256': hashlib.sha256(verbatim[a]).hexdigest()} for a in ARQUIVOS},
        'raras': {'ocultas': len(raras), 'fonte': 'data/limiar.json (categoria rara, sem revelada)'},
        'projecao': [{'arquivo': a, 'caminho': c, 'motivo': m} for a, c, m in tirados],
    }
    with open(os.path.join(pub, FONTE), 'wb') as fh:
        fh.write(serializa(fonte))

    print(f'balanceamento {commit[:7]} ({ref}) -> {PRIVADO.replace(os.sep, "/")} (verbatim) e '
          f'{PUBLICO.replace(os.sep, "/")} (projeção)')
    for a in ARQUIVOS:
        print(f'  {a}: {fonte["arquivos"][a]["schemaVersion"]}')
    print(f'  projeção: {len(tirados)} corte(s) ({len(raras)} raras ocultas)')
    for a, c, m in tirados:
        print(f'    {a} :: {c} ({m})')


if __name__ == '__main__':
    main()
