#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Catálogo por tipo (F1a): data/*.json -> data/catalogo/<tipo>.json

É o que a ficha lê de cada entidade (plano §3.2): `{id, tipo, nome, icone,
resumo, <campos do tipo>}`. ARTEFATO: nunca editar à mão; o round-trip do
validar.py regenera e compara byte a byte.

- `id` é o id do JSON de conteúdo, verbatim (é o mesmo `data-kf-id` do card).
- `nome` sai SEM emoji; o emoji vai para `icone` (D29). O JSON de conteúdo
  continua verbatim: a separação acontece só aqui.
- `resumo` é o texto integral da entidade sem tags e sem o título (nada é
  cortado nem reescrito; o nome do campo segue o plano).
- Campos do tipo (F1e, tools/normaliza.py; o JSON de conteúdo não é reescrito):
  magia com acoes, intensidadesPermitidas, sustentada/sustentacao e stats com
  rótulo canônico e porIntensidade; carta com req [{attr,min}]; dor/benefício
  com custo {dor,sentido}; técnica/marca/ultimate com grupo/ramo/tier/custoTexto
  (do data/classes, derivados pelo tools/blocos.py). Efeitos (Mods) e status: F1d.
- Cartas RARAS do Limiar: só id, tipo, nome, categoria e requisito (D11/D33:
  o efeito só entra pelo script de revelação).
- `item` não tem arquivo aqui: o catálogo do item é o data/bazar.json.
- data/pericias.json (F1e): as 24 perícias (Sistema + ficha física + decisões),
  fonte única para a F1d e o schema v3. Também ARTEFATO deste gerador.

Uso: python tools/gerar_catalogo.py [repo_root] [--relatorio]
"""
import glob, json, os, re, sys
from collections import Counter
from kf_marca import (TIPO_POR_CLASSE_CSS, TIPO_POR_CLASSE_CSS_RACA, EMOJI,
                      separa_icone, tipo_do_opentag)
from kf_marca import texto as _texto_s6
from blocos import preenche, SLUG_PERICIA
from shell import slugify
import normaliza


def texto(h):
    """Normalizador do §6 + sem espaço que é da marcação, não do texto.

    Trocar tag por espaço deixa "Médio , 15 HP" (chip + .sep), "<em>Oco</em>."
    vira "Oco ." e "(<em>3x/…</em>)" vira "( 3x/…)". O texto do .sep fica: é o
    verbatim do Notion que o CSS só esconde (css/classes.css).
    """
    return re.sub(r'([(])\s+', r'\1', re.sub(r'\s+([,.;:)])', r'\1', _texto_s6(h)))


RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = next((a for a in sys.argv[1:] if not a.startswith('--')), RAIZ)
OUT = os.path.join(REPO, 'data', 'catalogo')
OUT_PERICIAS = os.path.join(REPO, 'data', 'pericias.json')

CLASSES = ['espadachim', 'monge', 'batedor', 'alquimista', 'teurgo', 'artilheiro', 'brutalista']
RACAS = ['humano', 'anao', 'dryad', 'gruto', 'corrompido', 'automato', 'inseto']
ESCOLAS = ('destruicao', 'abjuracao', 'alteracao', 'conhecimento')
# Categoria do Limiar -> atributo do requisito (universal: nenhum; rara: variado)
ATTR_CATEGORIA = {'forca': 'FOR', 'destreza': 'DES', 'con': 'CON', 'int': 'INT', 'sab': 'SAB'}


def ler(rel):
    return json.load(open(os.path.join(REPO, rel), encoding='utf-8'))


def sem_titulo(corpo, tags=('h4', 'h5')):
    """Corpo sem o 1º título (o nome do card) e sem o ▼ de abrir/fechar."""
    corpo = re.sub(r'<span class="toggle-icon">.*?</span>', ' ', corpo, flags=re.S)
    alt = '|'.join(tags)
    return re.sub(rf'<({alt})\b[^>]*>.*?</\1>', ' ', corpo, count=1, flags=re.S)


def base(tipo, id_, nome, icone=None):
    ic, limpo = separa_icone(nome)
    return {'id': id_, 'tipo': tipo, 'nome': limpo, 'icone': icone if icone is not None else ic}


def novo_relatorio():
    return {'acoes': Counter(), 'formatoStat': Counter(), 'casamento': Counter(),
            'semLeitura': [], 'barraSemMod': [], 'regra3': [], 'rotulado': []}


def stat_magia(st, permitidas, rel):
    chave, rot = normaliza.rotulo(st['caracteristica'])
    fmt, por, leitura = normaliza.por_intensidade(st['valor'], permitidas)
    rel['formatoStat'][fmt] += 1
    rel['casamento'][leitura] += 1
    return {'caracteristica': st['caracteristica'], 'chave': chave, 'rotulo': rot,
            'valor': st['valor'], 'mod': st['mod'], 'formato': fmt, 'leitura': leitura,
            'porIntensidade': por}


def magias(cat, rel):
    d = ler('data/magias.json')
    for n in range(1, 6):
        for esc in ESCOLAS:
            for s in d[f'nivel{n}'][esc]:
                e = base('magia', s['id'], s['nome'])
                e['resumo'] = texto(s['descricao'])
                perm, restr = normaliza.intensidades_permitidas(s['nivel'], s['stats'])
                acao = [st for st in s['stats'] if normaliza.rotulo(st['caracteristica'])[0] == 'acao']
                if len(acao) > 1:
                    raise SystemExit(f'gerar_catalogo: {s["id"]} com {len(acao)} stats de ação')
                ac = normaliza.acoes(acao[0]['valor']) if acao else None
                rel['acoes'][ac['formato'] if ac else 'sem stat de ação'] += 1
                sust, sus = normaliza.sustentacao(s)
                e.update({'nivel': s['nivel'], 'escola': s['escola'], 'custoBase': s['custoBase'],
                          'tradeoff': bool(s.get('tradeoff')),
                          'acoes': ac, 'intensidadesPermitidas': perm, 'intensidadeTexto': restr,
                          'sustentada': sust, 'sustentacao': sus,
                          'stats': [stat_magia(st, perm, rel) for st in s['stats']],
                          'modulacoes': texto(s['modulacoes']) if s.get('modulacoes') else None})
                if ac is None:
                    rel['semLeitura'].append((s['id'], 'Ação', 'sem stat de ação'))
                for st in e['stats']:
                    if st['porIntensidade'] is None and (st['mod'] or st['formato'] != 'sem-barras'):
                        rel['semLeitura'].append((s['id'], st['caracteristica'], st['leitura']))
                    if st['porIntensidade'] is not None and not st['mod']:
                        rel['barraSemMod'].append((s['id'], st['caracteristica']))
                    if st['leitura'] == 'regra-3-barras':
                        rel['regra3'].append((s['id'], st['caracteristica']))
                    if st['formato'] == 'rotulado':
                        rel['rotulado'].append((s['id'], st['caracteristica'], st['leitura']))
                cat['magia'].append(e)


def condicoes(cat):
    for c in ler('data/condicoes.json')['categorias']:
        for cd in c['cards']:
            e = base('condicao', cd['id'], cd['nome'])
            e['resumo'] = texto(cd['corpo'])
            e['categoria'] = c['id']
            cat['condicao'].append(e)


def limiar(cat):
    d = ler('data/limiar.json')
    for c in d['catalogo']:
        for card in c['cards']:
            if c['id'] == 'rara':
                # D11/D33: rara sem efeito no site; nem ícone nem resumo aqui
                _, limpo = separa_icone(card['nome'])
                cat['carta'].append({'id': card['id'], 'tipo': 'carta', 'nome': limpo,
                                     'categoria': 'rara', 'req': normaliza.req_limiar(card.get('req')),
                                     'reqTexto': card.get('req')})
                continue
            e = base('carta', card['id'], card['nome'], icone=card.get('icon'))
            e['resumo'] = texto(card.get('effect', ''))
            e['categoria'] = c['id']
            e['req'] = normaliza.req_limiar(card.get('req'))
            e['reqTexto'] = card.get('req')
            attr = ATTR_CATEGORIA.get(c['id'])
            if [r['attr'] for r in e['req']] != ([attr] if attr else []):
                raise SystemExit(f'gerar_catalogo: carta {card["id"]} da categoria {c["id"]} '
                                 f'com requisito {card.get("req")!r}')
            cat['carta'].append(e)
    for chave, tipo in (('dores', 'dor'), ('beneficios', 'beneficio')):
        for card in d['abismo'][chave]:
            e = base(tipo, card['id'], card['nome'])
            e['resumo'] = texto(card['desc'])
            e.update({'custo': normaliza.custo_abismo(card['custo'], card['tipo']),
                      'custoTexto': texto(card['custo'])})
            cat[tipo].append(e)


def classes(cat):
    for classe in CLASSES:
        for c in ler(f'data/classes/{classe}.json')['cards']:
            tipo = TIPO_POR_CLASSE_CSS[c['tipo']]
            e = base(tipo, c['id'], c['nome'])
            e['resumo'] = texto(sem_titulo(c['corpo']))
            e.update({'classe': classe, 'card': c['tipo'], 'grupo': c['grupo'], 'ramo': c['ramo'],
                      'tier': c['tier'], 'custoTexto': c['custoTexto']})
            cat[tipo].append(e)


def racas(cat):
    for c in ler('data/racas.json')['cards']:
        e = base('raca', c['id'], c['nome'])
        corpo = re.sub(r'<div class="raca-image">.*?</div>', ' ', c['corpo'], flags=re.S)
        e['resumo'] = texto(sem_titulo(corpo, ('h3',)))
        e['pagina'] = re.search(r'href="([^"]+)"', c['opentag']).group(1)
        cat['raca'].append(e)
    for raca in RACAS:
        for c in ler(f'data/racas/{raca}.json')['cards']:
            tipo = tipo_do_opentag(c['opentag'], TIPO_POR_CLASSE_CSS_RACA)
            if tipo is None:          # NAO_ENTIDADE (rule-box/warning): regra da página
                continue
            e = base(tipo, c['id'], c['nome'])
            e['resumo'] = texto(sem_titulo(c['corpo']))
            e.update({'raca': raca, 'card': re.search(r'class="([^"]+)"', c['opentag']).group(1)})
            cat[tipo].append(e)


def origens(cat):
    for c in ler('data/origens.json')['cards']:
        e = base('origem', c['id'], c['nome'])
        corpo = preenche(c['corpo'], 'origem', c['origem'], c['id'])   # F1b: corpo com {{origem.…}}
        e['resumo'] = texto(sem_titulo(corpo, ('h3',)))
        cat['origem'].append(e)


FONTES = {
    'magia': ['data/magias.json'], 'condicao': ['data/condicoes.json'],
    'carta': ['data/limiar.json'], 'dor': ['data/limiar.json'], 'beneficio': ['data/limiar.json'],
    'tecnica': ['data/classes/*.json'], 'marca': ['data/classes/*.json'],
    'ultimate': ['data/classes/*.json'],
    'raca': ['data/racas.json'], 'traco': ['data/racas/*.json'], 'variante': ['data/racas/*.json'],
    'subespecie': ['data/racas/*.json'], 'tecnologia': ['data/racas/*.json'],
    'origem': ['data/origens.json'],
}


def _grava(caminho, doc):
    with open(caminho, 'w', encoding='utf-8', newline='\n') as fh:
        json.dump(doc, fh, ensure_ascii=False, indent=1)
        fh.write('\n')


def gera_pericias():
    lista, graus, diverg = normaliza.pericias(
        ler('data/sistema.json'),
        open(os.path.join(REPO, 'docs', 'ficha-digital', '03-respostas-pedro.md'), encoding='utf-8').read(),
        slugify)
    slugs = [p['slug'] for p in lista]
    if len(slugs) != 24 or len(set(slugs)) != 24 or set(slugs) != set(SLUG_PERICIA):
        raise SystemExit(f'gerar_catalogo: perícias {sorted(set(slugs) ^ set(SLUG_PERICIA))} '
                         f'fora de blocos.PERICIAS, ou repetidas ({len(slugs)})')
    _grava(OUT_PERICIAS, {
        'schema': 'pericias/1',
        'fontes': ['data/sistema.json (Perícias, Proficiência)',
                   'docs/ficha-digital/03-respostas-pedro.md §4 (ficha física)',
                   'CLAUDE.md §2 (Ofício(Alquimia)) e §5 (prof_*)', 'D7 e D8a (Pedro, 2026-09-26)'],
        'modos': {'fixo': 'um atributo', 'maior': 'o maior dos atributos listados, trocável pelo jogador (D7)',
                  'arma': 'o atributo da arma usada, entre os listados',
                  'dado': 'só o dado do grau, sem atributo (D8a)'},
        'graus': graus, 'total': len(lista), 'pericias': lista})
    return lista, diverg


def gerar():
    cat = {t: [] for t in FONTES}
    rel = novo_relatorio()
    magias(cat, rel)
    for f in (condicoes, limiar, classes, racas, origens):
        f(cat)
    erros = []
    vistos = {}
    for tipo, ents in cat.items():
        for e in ents:
            if EMOJI.search(e['nome']):
                erros.append(f'{tipo}:{e["id"]} com emoji no nome: {e["nome"]!r}')
            if not e['nome']:
                erros.append(f'{tipo}:{e["id"]} sem nome')
            if e['id'] in vistos:
                erros.append(f'id duplicado {e["id"]!r} ({vistos[e["id"]]} e {tipo})')
            vistos[e['id']] = tipo
    if erros:
        raise SystemExit('gerar_catalogo: ' + '\n  '.join(erros))
    os.makedirs(OUT, exist_ok=True)
    # arquivo de tipo que deixou de existir sai junto (o catálogo é artefato)
    for velho in glob.glob(os.path.join(OUT, '*.json')):
        if os.path.basename(velho)[:-5] not in cat:
            os.remove(velho)
    for tipo, ents in cat.items():
        _grava(os.path.join(OUT, f'{tipo}.json'), {'schema': 'catalogo/1', 'tipo': tipo, 'fontes': FONTES[tipo],
                                                   'total': len(ents), 'entradas': ents})
    rel['pericias'], rel['divergPericias'] = gera_pericias()
    return cat, rel


def _conta(c):
    return ', '.join(f'{k} {v}' for k, v in sorted(c.items(), key=lambda kv: (-kv[1], str(kv[0]))))


def relatorio(cat, rel):
    """Relatório por conjunto dos formatos encontrados (F1e). Todo stat, ação,
    carta e card cai em exatamente um formato: o que não cai derrubou o gerador."""
    def ids(xs):
        return ', '.join(':'.join(str(v) for v in x) for x in xs) or '—'
    grupos = Counter(f'{e["grupo"]}{"/T" + str(e["tier"]) if e["tier"] else ""}'
                     for t in ('tecnica', 'marca', 'ultimate') for e in cat[t])
    return [
        '[F1e] magias: ações por formato: ' + _conta(rel['acoes']),
        '[F1e] magias: stats por formato: ' + _conta(rel['formatoStat']),
        '[F1e] magias: leitura por intensidade: ' + _conta(rel['casamento']),
        '[F1e] magias: intensidades permitidas: ' + _conta(Counter(
            '/'.join(e['intensidadesPermitidas']) for e in cat['magia'])),
        '[F1e] magias: sustentadas: ' + ', '.join(e['id'] for e in cat['magia'] if e['sustentada']),
        '[F1e] magias: rotulados: ' + ids(rel['rotulado']),
        '[F1e] magias: regra das 3 barras (CLAUDE.md §6): ' + ids(rel['regra3']),
        '[F1e] magias: barras com ❎ (mod:false no Notion): ' + ids(rel['barraSemMod']),
        f'[F1e] magias: {len(rel["semLeitura"])} sem leitura (✅ sem barras, barra irregular, sem ação): '
        + ids(rel['semLeitura']),
        '[F1e] limiar: cartas por nº de atributos no requisito: ' + _conta(Counter(len(e['req']) for e in cat['carta'])),
        '[F1e] abismo: custo por sentido: ' + _conta(Counter(
            f'{t}:{e["custo"]["sentido"]}' for t in ('dor', 'beneficio') for e in cat[t])),
        '[F1e] classes: cards por grupo/tier: ' + _conta(grupos),
        '[F1e] perícias: por modo: ' + _conta(Counter(p['modo'] for p in rel['pericias']))
        + '; Sistema x ficha física: ' + ('; '.join(f'{n} "{s}" x "{f}"' for n, s, f in rel['divergPericias'])
                                           or 'sem divergência'),
    ]


def main():
    try:
        sys.stdout.reconfigure(errors='replace')
    except (AttributeError, ValueError):
        pass
    cat, rel = gerar()
    print('catálogo gerado: ' + ' · '.join(f'{t} {len(v)}' for t, v in cat.items())
          + f' -> {os.path.relpath(OUT, REPO)}; {len(rel["pericias"])} perícias -> '
          + os.path.relpath(OUT_PERICIAS, REPO).replace(os.sep, '/'))
    if '--relatorio' in sys.argv:
        print('\n'.join(relatorio(cat, rel)))


if __name__ == '__main__':
    main()
