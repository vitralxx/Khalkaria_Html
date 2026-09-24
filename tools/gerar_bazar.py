#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gerador do Bazar: data/Bazar_Khalkaria_v26.csv -> data/bazar.json + pages/bazar.html

O CSV é a fonte. Este script NÃO desenha a página: ele indexa o catálogo e escreve
um JSON; a interface vive em arquivos de verdade —

    templates/bazar.template.html   scaffold (head, sidebar, containers)
    css/bazar.css                   estilo
    js/bazar.js                     comportamento

Antes, os 727 itens iam embutidos como array literal dentro do <script> da página
(400 KB rebaixados a cada visita, duplicando o data/bazar.json que já existia).
Agora a página é enxuta e busca o mesmo JSON que a Ficha Interativa usa.

data/bazar.json é um ARRAY (contrato do js/ficha.js, que faz bazarCache.find).
Cada item carrega os campos do CSV mais os derivados que a página precisa:
região, CR, arquétipo, ingredientes parseados e degrau anterior da cadeia.

Uso: python tools/gerar_bazar.py [csv] [saida_html]
"""
import csv, json, sys, os, re, unicodedata

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, 'data', 'Bazar_Khalkaria_v26.csv')
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(RAIZ, 'pages', 'bazar.html')
TPL = os.path.join(RAIZ, 'templates', 'bazar.template.html')
BJSON = os.path.join(RAIZ, 'data', 'bazar.json')

# ---------------------------------------------------------------- vocabulário
CATEGORIAS = ['Arma', 'Armadura', 'Escudo', 'Consumível', 'Munição',
              'Bugiganga', 'Item Mágico', 'Material', 'Lixo']
RARIDADES = ['Lixo', 'Ordinário', 'Incomum', 'Exótico', 'Luxária']
OFICIOS = ['Ferraria', 'Engenharia', 'Alquimia', 'Sobrevivência', 'Não-craftável']
# ordem crescente de perigo e de recompensa
REGIOES = ['Cinturão Silencioso', 'Bosque Corrompido', 'Emaranhado de Raízes',
           'Costas Rochosas', 'Terras Livres', 'Cordilheira Cristalina',
           'Ermo das Cinzas', 'Deserto do Abismo']
# 15 chassis de arma, do mais longo para o mais curto (evita prefixo comer prefixo)
CHASSIS = ['Leve Cortante', 'Leve Perfurante', 'Leve Contundente', 'Leve Ágil',
           'Pesada Cortante', 'Pesada Perfurante', 'Pesada Contundente', 'Pesada Brutal',
           'Marcial Pesada', 'Marcial Longa', 'Marcial Precisa', 'Marcial Versátil',
           'Distância Simples', 'Distância Pesada', 'Arremesso']
FAMILIA = {'Leve': 'Leve', 'Pesada': 'Pesada', 'Marcial': 'Marcial',
           'Distância': 'Distância', 'Arremesso': 'Arremesso'}

# O separador de ingrediente é " + " — mas o NOME do item também pode conter " +2".
# Só é separador quando vem seguido de "Nx ". Sem isso, "Arma Leve Cortante +2"
# quebra em dois e a cadeia evolutiva inteira se perde.
SEP_ING = re.compile(r'\s\+\s(?=\d+x\s)')
UM_ING = re.compile(r'^(\d+)x\s+(.+?)\s*$')
RE_SLOT = re.compile(r'^\[([^\]]+)\]')
RE_FOCO = re.compile(r'^Foco Místico\s*\(([^)]+)\)')
RE_CR = re.compile(r'^Drop CR\s*(.+)$')


def slug(nome, pre='item-'):
    s = unicodedata.normalize('NFKD', nome).encode('ascii', 'ignore').decode()
    return pre + re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def parse_obtencao(txt):
    """'Drop CR 3 · Terras Livres · Loja' -> (regiao, cr, [fontes], unico)"""
    partes = [p.strip() for p in (txt or '').split('·') if p.strip()]
    regiao = next((p for p in partes if p in REGIOES), '')
    cr, fontes, unico = '', [], False
    for p in partes:
        if p == regiao:
            continue
        m = RE_CR.match(p)
        if m:
            cr = m.group(1).strip()
        if p == 'Único/Quest':
            unico = True
        fontes.append(p)
    return regiao, cr, fontes, unico


def parse_ingredientes(txt):
    """'1x Arma Leve Cortante +2 + 2x Kali' -> [{'n':1,'item':'...'}, ...]"""
    txt = (txt or '').strip()
    if not txt:
        return []
    out = []
    for parte in SEP_ING.split(txt):
        m = UM_ING.match(parte.strip())
        if m:
            out.append({'n': int(m.group(1)), 'item': m.group(2)})
    return out


def parse_arquetipo(efeito, categoria):
    """Arquétipo declarado no começo do Efeito. 284 itens têm um."""
    ef = (efeito or '').strip()
    m = RE_SLOT.match(ef)
    if m:                                    # [Pesada] / [Distância Simples] …
        v = m.group(1).strip()
        return (v, 'Slot') if categoria == 'Armadura' else (v, 'Munição')
    m = RE_FOCO.match(ef)
    if m:
        return (f'Foco Místico ({m.group(1).strip()})', 'Foco')
    for ch in sorted(CHASSIS, key=len, reverse=True):
        if ef.startswith(ch):
            return (ch, FAMILIA.get(ch.split(' ')[0], ch))
    return ('', '')


ARTE = os.path.join(RAIZ, 'data', 'icones-materiais.json')


def carrega_arte():
    """Material -> images/materiais/<slug>.webp, quando a arte existe."""
    if not os.path.exists(ARTE):
        return {}
    mapa = json.load(open(ARTE, encoding='utf-8')).get('icones', {})
    out = {}
    for material in mapa:
        rel = 'materiais/' + slug(material, '') + '.webp'
        if os.path.exists(os.path.join(RAIZ, 'images', rel)):
            out[material] = rel
    return out


def main():
    rows = list(csv.DictReader(open(CSV, encoding='utf-8')))
    arte = carrega_arte()
    nomes = {r['Nome'] for r in rows}
    cat_de = {r['Nome']: r['Categoria'] for r in rows}

    itens, vistos = [], {}
    for r in rows:
        nome = r['Nome']
        categoria = (r.get('Categoria') or '').strip()
        cats = [c.strip() for c in categoria.split(',') if c.strip()]
        efeito = (r.get('Efeito_Jogador') or '').strip() or (r.get('Efeito') or '').strip()
        regiao, cr, fontes, unico = parse_obtencao(r.get('Obtenção'))
        ing = parse_ingredientes(r.get('Ingredientes'))
        arq, fam = parse_arquetipo(efeito, cats[0] if cats else '')
        cd = (r.get('CD de Craft') or '').strip()
        tags = [t.strip() for t in (r.get('Tags') or '').split(',') if t.strip()]

        # degrau anterior da cadeia: ingrediente que também é item da mesma
        # categoria (e não material). É o que liga Adaga de Kali -> …+2 -> …+1 -> base.
        pai = next((g['item'] for g in ing
                    if g['item'] in nomes and g['item'] != nome
                    and cat_de[g['item']] == categoria and categoria != 'Material'), '')

        sid = slug(nome)
        vistos[sid] = vistos.get(sid, 0) + 1
        if vistos[sid] > 1:
            sid = f'{sid}-{vistos[sid]}'

        itens.append({
            'id': sid, 'nome': nome,
            'categoria': categoria, 'cats': cats,
            'raridade': (r.get('Raridade') or '').strip(),
            'efeito': efeito,
            'valor': (r.get('Valor (Sins)') or '').strip(),
            'obtencao': (r.get('Obtenção') or '').strip(),
            'regiao': regiao, 'cr': cr, 'fontes': fontes, 'unico': unico,
            'craft': (r.get('Tipo de Craft') or '').strip(),
            'cd': int(cd) if cd.isdigit() else None,
            'ingredientes': (r.get('Ingredientes') or '').strip(), 'ing': ing,
            'arquetipo': arq, 'familia': fam,
            'tags': tags, 'lore': (r.get('Lore/Notas') or '').strip(),
            'pai': pai,
            'arte': arte.get(nome, ''),
            'busca': ' '.join([nome, categoria, r.get('Raridade', ''), r.get('Tipo de Craft', ''),
                               regiao, arq, ' '.join(tags), efeito]).lower(),
        })

    # compacto: é artefato, a fonte legível é o CSV
    json.dump(itens, open(BJSON, 'w', encoding='utf-8', newline=''),
              ensure_ascii=False, separators=(',', ':'))
    comArte = sum(1 for i in itens if i['arte'])
    print(f'bazar.json gerado: {len(itens)} itens -> {BJSON} | {comArte} com arte')

    # vocabulário presente no catálogo, na ordem canônica (a página lê daqui)
    presentes = lambda ordem, chave: [v for v in ordem if any(
        (v in it[chave] if isinstance(it[chave], list) else it[chave] == v) for it in itens)]
    vocab = {
        'categorias': presentes(CATEGORIAS, 'cats'),
        'raridades': presentes(RARIDADES, 'raridade'),
        'oficios': presentes(OFICIOS, 'craft'),
        'regioes': presentes(REGIOES, 'regiao'),
        'chassis': [c for c in CHASSIS if any(it['arquetipo'] == c for it in itens)],
        'focos': sorted({it['arquetipo'] for it in itens if it['familia'] == 'Foco'}),
        'slots': sorted({it['arquetipo'] for it in itens if it['familia'] == 'Slot'}),
        'municoes': sorted({it['arquetipo'] for it in itens if it['familia'] == 'Munição'}),
        'total': len(itens),
    }

    page = open(TPL, encoding='utf-8', newline='').read()
    page = page.replace('{{VOCAB}}', json.dumps(vocab, ensure_ascii=False))
    page = page.replace('{{TOTAL}}', str(len(itens)))
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, 'w', encoding='utf-8', newline='').write(page)
    print(f'bazar.html gerado: {len(itens)} itens -> {OUT}')
    if '<!--SIDEBAR-->' in page:
        print('    aviso: a navegação ainda é o marcador <!--SIDEBAR-->.'
              ' Rode `python tools/build.py --bazar` para aplicar a fase 2.')


if __name__ == '__main__':
    main()
