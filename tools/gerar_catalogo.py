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
- Campos do tipo: só o que o JSON já tem estruturado. Normalizar custo, ações,
  requisito etc. é da F1e; efeitos (Mods) e status, da F1d.
- Cartas RARAS do Limiar: só id, tipo, nome, categoria e requisito (D11/D33:
  o efeito só entra pelo script de revelação).
- `item` não tem arquivo aqui: o catálogo do item é o data/bazar.json.

Uso: python tools/gerar_catalogo.py [repo_root]
"""
import glob, json, os, re, sys
from kf_marca import (TIPO_POR_CLASSE_CSS, TIPO_POR_CLASSE_CSS_RACA, EMOJI,
                      separa_icone, tipo_do_opentag)
from kf_marca import texto as _texto_s6


def texto(h):
    """Normalizador do §6 + sem espaço antes de pontuação.

    Trocar tag por espaço deixa "Médio , 15 HP" (chip + .sep) e "<em>Oco</em>."
    vira "Oco ." — espaço que é da marcação, não do texto.
    """
    return re.sub(r'\s+([,.;:)])', r'\1', _texto_s6(h))

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = sys.argv[1] if len(sys.argv) > 1 else RAIZ
OUT = os.path.join(REPO, 'data', 'catalogo')

CLASSES = ['espadachim', 'monge', 'batedor', 'alquimista', 'teurgo', 'artilheiro', 'brutalista']
RACAS = ['humano', 'anao', 'dryad', 'gruto', 'corrompido', 'automato', 'inseto']
ESCOLAS = ('destruicao', 'abjuracao', 'alteracao', 'conhecimento')


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


def magias(cat):
    d = ler('data/magias.json')
    for n in range(1, 6):
        for esc in ESCOLAS:
            for s in d[f'nivel{n}'][esc]:
                e = base('magia', s['id'], s['nome'])
                e['resumo'] = texto(s['descricao'])
                e.update({'nivel': s['nivel'], 'escola': s['escola'], 'custoBase': s['custoBase'],
                          'tradeoff': bool(s.get('tradeoff')),
                          'stats': [{'caracteristica': st['caracteristica'], 'valor': st['valor'],
                                     'mod': st['mod']} for st in s['stats']],
                          'modulacoes': texto(s['modulacoes']) if s.get('modulacoes') else None})
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
                                     'categoria': 'rara', 'req': card.get('req')})
                continue
            e = base('carta', card['id'], card['nome'], icone=card.get('icon'))
            e['resumo'] = texto(card.get('effect', ''))
            e['categoria'] = c['id']
            e['req'] = card.get('req')
            cat['carta'].append(e)
    for chave, tipo in (('dores', 'dor'), ('beneficios', 'beneficio')):
        for card in d['abismo'][chave]:
            e = base(tipo, card['id'], card['nome'])
            e['resumo'] = texto(card['desc'])
            e.update({'custo': texto(card['custo']), 'custoTipo': card['tipo']})
            cat[tipo].append(e)


def classes(cat):
    for classe in CLASSES:
        for c in ler(f'data/classes/{classe}.json')['cards']:
            tipo = TIPO_POR_CLASSE_CSS[c['tipo']]
            e = base(tipo, c['id'], c['nome'])
            e['resumo'] = texto(sem_titulo(c['corpo']))
            e.update({'classe': classe, 'card': c['tipo']})
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
        e['resumo'] = texto(sem_titulo(c['corpo'], ('h3',)))
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


def gerar():
    cat = {t: [] for t in FONTES}
    for f in (magias, condicoes, limiar, classes, racas, origens):
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
        doc = {'schema': 'catalogo/1', 'tipo': tipo, 'fontes': FONTES[tipo],
               'total': len(ents), 'entradas': ents}
        with open(os.path.join(OUT, f'{tipo}.json'), 'w', encoding='utf-8', newline='\n') as fh:
            json.dump(doc, fh, ensure_ascii=False, indent=1)
            fh.write('\n')
    return cat


def main():
    cat = gerar()
    print('catálogo gerado: ' + ' · '.join(f'{t} {len(v)}' for t, v in cat.items())
          + f' -> {os.path.relpath(OUT, REPO)}')


if __name__ == '__main__':
    main()
