#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Leitor dos LIMITES DE USO das técnicas e habilidades: data/catalogo/*.json -> data/usos.json

Pedido do Pedro: quando o texto diz "1x/curto" ou "2x por dia", a ficha monta o
contador; quando o máximo é fórmula ("Nível+3", "1+mod. Sabedoria"), o motor
calcula com os valores do personagem. O ponto central é o CUIDADO: cada leitura
leva o trecho EXATO do texto (substring do `resumo`/`custoTexto`/`nome` do
catálogo), e o que o leitor não entende vai para `naoParseados`, nunca é
adivinhado.

Saídas (ARTEFATO: o round-trip do validar.py regenera e compara byte a byte):
  data/usos.json                          schema `usos/1`
  docs/ficha-digital/12-usos-revisao.md   tabelas para o Pedro revisar

Formas lidas (sem diferenciar maiúscula, acento ou abreviação):
  "1x/Descanso Longo", "3x/descanso longo", "(1x/Turno)"      Nx/Período
  "Uma vez por descanso longo", "2 vezes por rodada",
  "1x por rodada", "Max. 1 vez por turno"                      N vez(es) por Período
  "(Usos: 1+mod. Sabedoria/descanso longo)"                    Usos: fórmula/Período
Períodos: curto, longo, dia, turno, rodada, cena, combate.
Fórmula: soma de constante, Nível e modificador (FOR/DES/CON/INT/SAB).

Vai para `naoParseados` (inteiro, com o trecho e o motivo):
  - período fora do conjunto (sessão, semana, campanha, alvo, localização, perícia);
  - fórmula fora da gramática ("metade do nível", "(mínimo 1)", "X");
  - qualificador logo depois do uso ("no nível 2", "por alvo", "a cada");
  - texto que cita limite de uso mas não casa nenhuma forma ("uso por cena",
    "por descanso longo" sem contagem, "número de vezes");
  - entrada com mais de uma leitura DISTINTA (qual é o contador? decide o Pedro)
    ou com uma leitura e um trecho não lido: nada é escolhido em silêncio.

`foraDoCatalogo`: o mesmo leitor sobre o `recurso` de cada classe
(data/classes/*.json, classe.recurso: Instinto, Fluxo), que não é entrada do
catálogo. Lá os "Máx. 2x por rodada" são limites de GANHO do recurso, não
contador de habilidade: ficam listados para o Pedro, sem contador.

Uso: python tools/gerar_usos.py [repo_root]
"""
import glob
import json
import os
import re
import sys
import unicodedata

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCHEMA = 'usos/1'
CAMPOS = ('custoTexto', 'nome', 'resumo')       # ordem de preferência do trecho

PERIODOS = {
    'curto': 'curto', 'descanso curto': 'curto',
    'longo': 'longo', 'descanso longo': 'longo',
    'dia': 'dia', 'turno': 'turno', 'rodada': 'rodada',
    'cena': 'cena', 'combate': 'combate',
}
ATRIBUTOS = {
    'for': 'FOR', 'forca': 'FOR', 'des': 'DES', 'destreza': 'DES',
    'con': 'CON', 'constituicao': 'CON', 'int': 'INT', 'inteligencia': 'INT',
    'sab': 'SAB', 'sabedoria': 'SAB',
}
NUM_PALAVRA = {'um': 1, 'uma': 1, 'duas': 2, 'dois': 2, 'tres': 3}

_PER = r'(?P<p>descanso(?:\s+(?:curto|longo))?|[a-zà-ÿ]+)'
_FLAGS = re.I
R_USOS = re.compile(r'\busos?\s*:\s*(?P<f>[^/;|]{1,60}?)\s*/\s*' + _PER, _FLAGS)
R_BARRA = re.compile(r'(?<![\w.])(?P<n>\d+|X)\s*x\s*/\s*' + _PER, _FLAGS)
R_VEZ = re.compile(r'(?<![\w.])(?P<n>\d+|uma?|duas|dois|tr[eê]s|X)\s*(?:x|vez(?:es)?)\s+(?:por|a cada)\s+' + _PER, _FLAGS)
FORTES = (('usos', R_USOS), ('barra', R_BARRA), ('vez', R_VEZ))

# citam limite de uso mas não casam nenhuma forma forte: vão para naoParseados
FRACOS = [re.compile(p, _FLAGS) for p in (
    r'\busos?\s*:', r'\busos?\s+por\s+\w+', r'\bvez(?:es)?\s+por\b', r'\bpor\s+descanso\b',
    r'\bn[uú]mero\s+de\s+vezes\b', r'(?<![\w.])\d+\s*x\s*/',
)]
# o que vem logo depois do uso e o muda: a leitura simples seria um palpite
R_QUALIFICA_DEPOIS = re.compile(
    r'^\s*(?:no\s+n[ií]vel|por\s+(?:alvo|inimigo|criatura|aliado|localiza)|em\s+cada|a\s+cada|e\s+\d+\s+vez)', _FLAGS)


def sem_acento(s):
    return ''.join(c for c in unicodedata.normalize('NFKD', s) if not unicodedata.combining(c))


def chave(s):
    return re.sub(r'\s+', ' ', sem_acento(s).lower()).strip()


def periodo_de(token):
    return PERIODOS.get(chave(token))


def le_formula(texto):
    """'1+mod. Sabedoria' -> [{'const':1},{'mod':'SAB','fator':1}]; fora da gramática -> None."""
    s = chave(texto).replace('×', '*')
    s = re.sub(r'^\(|\)$', '', s.strip())
    termos = []
    for tok in re.split(r'\s*\+\s*', s):
        tok = tok.strip()
        if re.fullmatch(r'\d+', tok):
            termos.append({'const': int(tok)})
            continue
        m = re.fullmatch(r'(?:(\d+)\s*[x*]\s*)?nivel', tok)
        if m:
            termos.append({'nivel': int(m.group(1) or 1)})
            continue
        m = re.fullmatch(r'(?:(\d+)\s*[x*]\s*)?mod(?:ificador)?\.?\s*(?:de\s+|da\s+|do\s+)?([a-z]+)\.?', tok)
        if m and m.group(2) in ATRIBUTOS:
            termos.append({'mod': ATRIBUTOS[m.group(2)], 'fator': int(m.group(1) or 1)})
            continue
        return None
    return termos or None


def frase_de(texto, ini, fim):
    """A frase que contém [ini, fim): do ponto anterior ao seguinte (substring exata do texto)."""
    a = max((texto.rfind(p, 0, ini) for p in ('. ', '! ', '? ', ': ')), default=-1)
    a = 0 if a < 0 or ini - a > 160 else a + 2
    b = fim - 1
    while True:     # "mod. de Constituição" não fecha a frase
        cand = [i for i in (texto.find(p, b + 1) for p in ('. ', '! ', '? ')) if i >= 0]
        b = min(cand) if cand else len(texto)
        if b >= len(texto) or not re.search(r'\b(?:mod|máx|max)$', texto[:b], re.I):
            break
    b = len(texto) if b - fim > 160 else min(len(texto), b + 1)
    return texto[a:b].strip()


def acha(texto):
    """Devolve (leituras, naoLidos) de um texto.
    leitura: {periodo, max{texto,termos}, trecho}; naoLido: {trecho, motivo}."""
    fortes, vistos = [], []
    for forma, rx in FORTES:
        for m in rx.finditer(texto):
            if any(m.start() < f and s < m.end() for s, f in vistos):
                continue
            vistos.append((m.start(), m.end()))
            fortes.append((m.start(), forma, m))
    leituras, nao = [], []
    for ini, forma, m in sorted(fortes, key=lambda x: x[0]):
        trecho = m.group(0)
        per = periodo_de(m.group('p'))
        if forma == 'usos':
            termos, mtexto = le_formula(m.group('f')), m.group('f').strip()
        else:
            n = m.group('n')
            mtexto = n
            if n.upper() == 'X':
                termos = None
            elif n.isdigit():
                termos = [{'const': int(n)}]
            else:
                termos = [{'const': NUM_PALAVRA[chave(n)]}]
        if per is None:
            nao.append({'trecho': trecho, 'motivo': f'período fora do conjunto: "{m.group("p")}"'})
        elif termos is None:
            nao.append({'trecho': trecho, 'motivo': f'fórmula fora da gramática: "{mtexto}"'})
        elif R_QUALIFICA_DEPOIS.match(texto[m.end():m.end() + 40]):
            nao.append({'trecho': trecho, 'motivo': 'qualificador logo depois do uso: ' +
                        texto[m.end():m.end() + 30].strip()})
        else:
            leituras.append({'periodo': per, 'max': {'texto': mtexto, 'termos': termos}, 'trecho': trecho})
    for rx in FRACOS:
        for m in rx.finditer(texto):
            if any(m.start() < f and s < m.end() for s, f in vistos):
                continue
            vistos.append((m.start(), m.end()))
            nao.append({'trecho': frase_de(texto, m.start(), m.end()),
                        'motivo': 'cita limite de uso em forma não lida'})
    return leituras, nao


def chave_leitura(l):
    return (l['periodo'], json.dumps(l['max']['termos'], sort_keys=True))


def le_entrada(e):
    """Junta os campos de uma entrada do catálogo. Devolve (leituras únicas c/ ocorrências, naoLidos)."""
    unicas, ordem, nao = {}, [], []
    ja_curto = set()
    for campo in CAMPOS:
        texto = e.get(campo) or ''
        if not texto:
            continue
        leituras, n = acha(texto)
        for l in leituras:
            k = chave_leitura(l)
            if campo == 'resumo' and k in ja_curto:
                continue            # o custoTexto/nome já foi lido; o resumo o repete
            if campo != 'resumo':
                ja_curto.add(k)
            if k not in unicas:
                unicas[k] = dict(l, ocorrencias=0)
                ordem.append(k)
            unicas[k]['ocorrencias'] += 1
        for x in n:
            if campo == 'resumo' and any(x['trecho'] in (e.get(c) or '') for c in ('custoTexto', 'nome')):
                continue
            if x not in nao:
                nao.append(x)
    return [unicas[k] for k in ordem], nao


def carrega_catalogo(root):
    cat = []
    for f in sorted(glob.glob(os.path.join(root, 'data', 'catalogo', '*.json'))):
        with open(f, encoding='utf-8') as fh:
            cat.extend(json.load(fh)['entradas'])
    return cat


def sem_tags(s):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', s)).strip()


def textos_recurso(r):
    """Todas as strings do `classe.recurso` (sem tags), na ordem do JSON."""
    out = []

    def anda(v):
        if isinstance(v, str):
            t = sem_tags(v)
            if t:
                out.append(t)
        elif isinstance(v, list):
            for x in v:
                anda(x)
        elif isinstance(v, dict):
            for k in ('texto', 'inicio', 'ganhos', 'perdas', 'regras'):
                if k in v:
                    anda(v[k])
    anda(r)
    return out


def le_recursos_de_classe(root):
    res = []
    for f in sorted(glob.glob(os.path.join(root, 'data', 'classes', '*.json'))):
        with open(f, encoding='utf-8') as fh:
            d = json.load(fh)
        r = (d.get('classe') or {}).get('recurso')
        if not r:
            continue
        cid = os.path.splitext(os.path.basename(f))[0]
        trechos = []
        for t in textos_recurso(r):
            leituras, nao = acha(t)
            trechos += [x['trecho'] for x in leituras] + [x['trecho'] for x in nao]
        if trechos:
            res.append({'id': f'{cid}-recurso-{r["id"]}', 'tipo': 'recurso-de-classe', 'classe': cid,
                        'trecho': trechos[0], 'trechos': trechos,
                        'motivo': 'limites de GANHO do recurso (por rodada/cena), não contador de habilidade'})
    return res


def gerar(root=None):
    root = root or REPO
    por_id, nao_parseados, vistos = {}, [], set()
    nomes = {}
    for e in carrega_catalogo(root):
        if e['id'] in vistos:
            raise SystemExit(f'FALHA gerar_usos: id duplicado no catálogo: {e["id"]}')
        vistos.add(e['id'])
        nomes[e['id']] = e['nome']
        leituras, nao = le_entrada(e)
        if not leituras and not nao:
            continue
        if len(leituras) == 1 and not nao:
            l = leituras[0]
            reg = {'tipo': e['tipo'], 'periodo': l['periodo'], 'max': l['max'], 'trecho': l['trecho']}
            if l['ocorrencias'] > 1:
                reg['ocorrencias'] = l['ocorrencias']
            por_id[e['id']] = reg
            continue
        # mais de uma leitura distinta, ou leitura + trecho não lido: ninguém escolhe em silêncio
        itens = [{'trecho': l['trecho'], 'motivo': 'leitura possível, mas o texto tem mais de um limite: '
                  f'{l["periodo"]} / {l["max"]["texto"]}'} for l in leituras] + nao
        item = {'id': e['id'], 'tipo': e['tipo'], 'trecho': itens[0]['trecho'], 'motivo': itens[0]['motivo']}
        if len(itens) > 1:
            item['trechos'] = [x['trecho'] for x in itens]
            item['motivo'] = 'mais de um limite de uso no mesmo texto; decide o Pedro. ' + '; '.join(
                f'«{x["trecho"]}» ({x["motivo"]})' for x in itens)
        nao_parseados.append(item)
    nao_parseados.sort(key=lambda x: x['id'])
    fora = le_recursos_de_classe(root)

    c_periodo, c_tipo = {}, {}
    c_forma = {'constante': 0, 'comNivel': 0, 'comMod': 0}
    for r in por_id.values():
        c_periodo[r['periodo']] = c_periodo.get(r['periodo'], 0) + 1
        c_tipo[r['tipo']] = c_tipo.get(r['tipo'], 0) + 1
        ks = {k for t in r['max']['termos'] for k in t}
        c_forma['comNivel'] += 'nivel' in ks
        c_forma['comMod'] += 'mod' in ks
        c_forma['constante'] += ks == {'const'}
    doc = {
        'schema': SCHEMA,
        '_doc': 'ARTEFATO de tools/gerar_usos.py: não editar à mão',
        'porId': dict(sorted(por_id.items())),
        'naoParseados': nao_parseados,
        'foraDoCatalogo': fora,
        'contagem': {
            'lidos': len(por_id), 'naoParseados': len(nao_parseados), 'foraDoCatalogo': len(fora),
            'porPeriodo': dict(sorted(c_periodo.items())), 'porTipo': dict(sorted(c_tipo.items())),
            'porFormula': c_forma,
        },
    }
    return doc, nomes


def grava_json(doc, root):
    caminho = os.path.join(root, 'data', 'usos.json')
    with open(caminho, 'w', encoding='utf-8', newline='\n') as fh:
        json.dump(doc, fh, ensure_ascii=False, indent=1, sort_keys=True)
        fh.write('\n')
    return caminho


def formula_txt(mx):
    return ' + '.join(
        str(t['const']) if 'const' in t else
        ('Nível' if t['nivel'] == 1 else f'{t["nivel"]}×Nível') if 'nivel' in t else
        (f'Mod.{t["mod"]}' if t['fator'] == 1 else f'{t["fator"]}×Mod.{t["mod"]}')
        for t in mx['termos'])


def cel(s):
    return str(s).replace('|', '\\|').replace('\n', ' ')


def grava_md(doc, nomes, root):
    cat = {e['id']: e for e in carrega_catalogo(root)}
    L = ['# Limites de uso lidos do texto (revisão)', '',
         'ARTEFATO de `tools/gerar_usos.py` (a partir de `data/usos.json`): não editar à mão. '
         'Cada linha é a leitura de um limite de uso no texto verbatim do catálogo; o trecho é a substring exata. '
         'Revisar: período e fórmula batem com o que o texto quer dizer? O que o leitor não entendeu está no fim, '
         'sem palpite.', '']
    c = doc['contagem']
    L += [f'Lidos: **{c["lidos"]}** · não lidos: **{c["naoParseados"]}** · recursos de classe: **{c["foraDoCatalogo"]}**. '
          'Períodos: ' + ', '.join(f'{k} {v}' for k, v in c['porPeriodo'].items()) + '. '
          f'Fórmulas: constante {c["porFormula"]["constante"]}, com Nível {c["porFormula"]["comNivel"]}, '
          f'com Mod {c["porFormula"]["comMod"]}.', '']
    grupos = {}
    for i, r in doc['porId'].items():
        e = cat[i]
        dono = e.get('classe') or e.get('raca') or ('origens' if r['tipo'] == 'origem' else '-')
        grupos.setdefault((r['tipo'], dono), []).append((i, e['nome'], r))
    tipo_atual = None
    for (tipo, dono) in sorted(grupos):
        if tipo != tipo_atual:
            L += [f'## {tipo}', '']
            tipo_atual = tipo
        L += [f'### {tipo} · {dono}', '', '| Nome | Trecho | Período | Máximo |', '|---|---|---|---|']
        for i, nome, r in sorted(grupos[(tipo, dono)]):
            extra = f' ({r["ocorrencias"]}× no texto)' if r.get('ocorrencias') else ''
            L.append(f'| {cel(nome)} | {cel(r["trecho"])} | {r["periodo"]} | {cel(formula_txt(r["max"]))}{extra} |')
        L.append('')
    L += ['## Não lidos', '',
          'Citam limite de uso, mas o leitor não decide sozinho (período fora do conjunto, fórmula fora da gramática, '
          'qualificador, ou mais de um limite no mesmo texto).', '',
          '| Id | Tipo | Trecho | Motivo |', '|---|---|---|---|']
    for x in doc['naoParseados']:
        L.append(f'| {x["id"]} | {x["tipo"]} | {cel(x["trecho"])} | {cel(x["motivo"])} |')
    L += ['', '## Recursos de classe (fora do catálogo)', '',
          '| Id | Trechos | Motivo |', '|---|---|---|']
    for x in doc['foraDoCatalogo']:
        L.append(f'| {x["id"]} | {cel(" · ".join(x["trechos"]))} | {cel(x["motivo"])} |')
    L.append('')
    caminho = os.path.join(root, 'docs', 'ficha-digital', '12-usos-revisao.md')
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    with open(caminho, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write('\n'.join(L))
    return caminho


def main():
    try:
        sys.stdout.reconfigure(errors='replace')
    except (AttributeError, ValueError):
        pass
    root = sys.argv[1] if len(sys.argv) > 1 else REPO
    doc, nomes = gerar(root)
    grava_json(doc, root)
    grava_md(doc, nomes, root)
    c = doc['contagem']
    print(f'usos: {c["lidos"]} lidos · {c["naoParseados"]} não lidos · {c["foraDoCatalogo"]} recursos de classe '
          f'· períodos {c["porPeriodo"]} -> data/usos.json + docs/ficha-digital/12-usos-revisao.md')


if __name__ == '__main__':
    main()
