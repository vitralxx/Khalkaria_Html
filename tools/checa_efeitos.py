# -*- coding: utf-8 -*-
"""Checagens da F1d para o validar.py: [balanceamento], [efeitos] e [vhelor].

Funções puras: recebem a raiz do repo e devolvem um Relatorio (falhas, avisos,
ok); o validar.py só imprime. Plano §3.2 e §7 F1d.

[balanceamento] data/balanceamento/ é a projeção publicada (D3) sem rara oculta
    (D11/D33): nada com rara:true, com fonte/id/chave de rara oculta, nem texto
    que cite uma; o marcasVhelor do arquivo de efeitos é só referência; nada em
    privado/ rastreado; com o privado local, sha256 == fonte.json e a projeção
    refeita == a publicada, byte a byte (sem o privado: AVISO).
[efeitos] (checa_efeitos do plano) 1 conjunto · 2 catálogo · 3 vocabulário
    fechado · 4 cruzada de inventário · 5 armas re-extraídas do texto e
    qualificador de dano extra · 6 lembrete com número de campo (AVISO) ·
    7 contagens (AVISO) · 8 integridade de Mod. Defeitos de parse conhecidos:
    tools/efeitos_excecoes.json (AVISO; exceção que não acha mais o defeito é
    FALHA). A checagem de spoiler do plano saiu (D32).
[vhelor] data/balanceamento/marcas-vhelor.json: 7 marcas, n 1..7, texto igual
    ao do Pedro (03-respostas-pedro.md §3.1, extraído por script), Mods e
    condições no vocabulário, gatilhos com item existente e o texto das marcas
    numa fonte só (nenhum outro arquivo de data/, js/ ou pages/ o repete).
"""
import csv, hashlib, json, os, re, subprocess
from collections import Counter

import gerar_efeitos as ge
import sync_balanceamento as sb

BAL = os.path.join('data', 'balanceamento')
ESPERADO = {'bazar': 727, 'itens': 214, 'armas': 181, 'consumo': 243, 'semEfeitoNaFicha': 115,
            'naoParseado': 0, 'focos': 26, 'armasComChassi': 151, 'empilhaveis': 87,
            'armaduraPesada': 27, 'armaduraLeve': 23}
BASE_MOD = ('alvo', 'op', 'valor', 'quando', 'acumula', 'duracao', 'fonte', 'status')
RE_ARMA = re.compile(r'^[^.]+\.\s+(\d+d\d+) [^()]+ \((Força|Destreza)\)\.\s+(?:\+\d+ em Atacar\.\s+)?Atacar\((\d)\)')
RE_DANO_EXTRA = re.compile(r'(?:^|(?<=\s))\+ (\d+d\d+) ([^.]*?)\.(?=\s|$)')
TIPO_NOME = {'Cortante': 'cortante', 'Contundente': 'contundente', 'Perfurante': 'perfurante', 'Fogo': 'fogo',
             'Frio': 'frio', 'Elétrico': 'eletrico', 'Veneno': 'veneno', 'Ácido': 'acido', 'Psíquico': 'psiquico',
             'Radiante': 'radiante', 'Trovejante': 'trovejante', 'Necrótico': 'necrotico', 'Força': 'forca',
             'Primordial': 'primordial'}
CAMPOS_LEMBRETE = (r'Ar|Ae|Éter|Saúde|Stamina|Evasão|Movimento|Força|Destreza|Constituição|Inteligência|Sabedoria|'
                   r'Atacar|Defender|Fortitude|Vontade|Reflexos|Percepção|Sobrevivência|Furtividade|Crime|'
                   r'Iniciativa|Conhecimento|Medicina|Investigação|Religião|Místico|Convencimento|Intimidação|'
                   r'Intuição|Enganação|Motivar|Ofício')
RE_LEMBRETE_CAMPO = re.compile(r'[+\-−]\s?\d+(?:[.,]\d+)?\s*(?:m\s+(?:de\s+)?)?(?:em\s+)?(?:testes\s+de\s+)?(?:'
                               + CAMPOS_LEMBRETE + r')\b')


class Relatorio:
    def __init__(self):
        self.falhas, self.avisos, self.ok = [], [], []

    def falha(self, s):
        self.falhas.append(s)

    def aviso(self, s):
        self.avisos.append(s)


def _j(root, *rel):
    return json.load(open(os.path.join(root, *rel), encoding='utf-8'))


def _lista(xs, n=8):
    xs = list(xs)
    return ', '.join(map(str, xs[:n])) + (f' … (+{len(xs) - n})' if len(xs) > n else '')


def _walk(v, cam=''):
    yield cam, v
    if isinstance(v, dict):
        for k, x in v.items():
            yield from _walk(x, f'{cam}.{k}' if cam else k)
    elif isinstance(v, list):
        for i, x in enumerate(v):
            yield from _walk(x, f'{cam}.{i}')


# ---------------------------------------------------------------- [balanceamento]
def checa_balanceamento(root):
    r = Relatorio()
    pub = os.path.join(root, BAL)
    try:
        fonte = _j(root, BAL, sb.FONTE)
    except (OSError, ValueError) as e:
        r.falha(f'{BAL}/{sb.FONTE} ilegível ({e}): rode tools/sync_balanceamento.py')
        return r
    if sorted(fonte.get('arquivos', {})) != sorted(sb.ARQUIVOS):
        r.falha(f'{sb.FONTE}: arquivos {sorted(fonte.get("arquivos", {}))} != {sb.ARQUIVOS}')
    if not re.fullmatch(r'[0-9a-f]{40}', fonte.get('commit') or ''):
        r.falha(f'{sb.FONTE}: commit de origem ausente ou inválido ({fonte.get("commit")!r})')
    docs = {}
    for a in sb.ARQUIVOS:
        try:
            docs[a] = _j(root, BAL, a)
        except (OSError, ValueError) as e:
            r.falha(f'{BAL}/{a} ilegível ({e})')
    if r.falhas:
        return r

    raras = sb.raras_ocultas(root)
    det = sb.Detector(raras, sb.bazar_publico(root))
    vaz = []
    for a, doc in docs.items():
        for cam, v in _walk(doc):
            if isinstance(v, dict):
                if v.get('rara') is True:
                    vaz.append(f'{a} :: {cam} (rara:true)')
                for k in ('fonte', 'id', 'carta'):
                    if isinstance(v.get(k), str) and v[k] in raras:
                        vaz.append(f'{a} :: {cam}.{k} = {v[k]}')
                vaz += [f'{a} :: {cam}.{k} (chave de rara oculta)' for k in v if k in raras]
            elif isinstance(v, str) and det.cita(v):
                vaz.append(f'{a} :: {cam} cita {det.cita(v)}')
    for v in vaz:
        r.falha(f'rara oculta na projeção publicada (D11/D33): {v}')
    if docs[sb.EFEITOS].get('marcasVhelor') != {'_fonte': sb.MARCAS}:
        r.falha(f'{sb.EFEITOS}: marcasVhelor tem de ser só {{"_fonte": "{sb.MARCAS}"}} (texto das Marcas numa fonte só)')

    rastreados = subprocess.run(['git', '-C', root, 'ls-files', '--', 'privado'], capture_output=True,
                                encoding='utf-8', env=dict(os.environ, MSYS_NO_PATHCONV='1')).stdout.split()
    if rastreados:
        r.falha(f'privado/ rastreado pelo git: {_lista(rastreados)}')

    priv = os.path.join(root, sb.PRIVADO)
    if all(os.path.exists(os.path.join(priv, a)) for a in sb.ARQUIVOS):
        verbatim = {a: open(os.path.join(priv, a), 'rb').read() for a in sb.ARQUIVOS}
        dif = [a for a in sb.ARQUIVOS
               if hashlib.sha256(verbatim[a]).hexdigest() != fonte['arquivos'].get(a, {}).get('sha256')]
        if dif:
            r.falha(f'privado/balanceamento difere do fonte.json ({_lista(dif)}): rode tools/sync_balanceamento.py')
        else:
            proj, tirados = sb.projeta(verbatim, raras, sb.bazar_publico(root))
            dif = [a for a in sb.ARQUIVOS if open(os.path.join(pub, a), 'rb').read() != proj[a]]
            if dif:
                r.falha(f'projeção publicada difere da refeita a partir do privado: {_lista(dif)} '
                        '(editada à mão? rode tools/sync_balanceamento.py)')
            esperada = [{'arquivo': a, 'caminho': c, 'motivo': m} for a, c, m in tirados]
            if fonte.get('projecao') != esperada:
                r.falha(f'{sb.FONTE}: lista "projecao" difere da refeita ({len(fonte.get("projecao") or [])} x '
                        f'{len(esperada)} cortes)')
            else:
                r.ok.append(f'projeção refeita do privado idêntica ({len(esperada)} cortes)')
    else:
        r.aviso('privado/balanceamento ausente: projeção não refeita (rode tools/sync_balanceamento.py '
                'para conferir byte a byte)')
    r.ok.append(f'{len(docs)} arquivos de {fonte["commit"][:7]} ('
                + ', '.join(f'{d.get("schemaVersion")}' for d in docs.values() if d.get('schemaVersion'))
                + f'), sem rara oculta ({len(raras)} ocultas)')
    return r


# ---------------------------------------------------------------- [efeitos]
def _csv_efeito(root):
    rows = list(csv.DictReader(open(os.path.join(root, ge.CSV), encoding='utf-8')))
    return {r['Nome']: r['Efeito'] for r in rows}


def _defeitos_arma(a, texto, lembretes):
    """[(tipo, frase)] do dano extra escrito no texto que o bloco arma não representa:
    'qualificador' (entrou sem o qualificador) ou 'perdido' (não entrou)."""
    out = []
    lem = ' '.join(lembretes)
    for m in RE_DANO_EXTRA.finditer(texto):
        dados, resto = m.group(1), m.group(2).strip()
        frase = m.group(0).strip()
        if ge.frase_lembrete(frase) in lem or frase in lem:
            continue
        simples = resto in TIPO_NOME
        extras = [d for d in a.get('danoExtra') or [] if d.get('dados') == dados]
        if simples and any(d.get('tipo') == TIPO_NOME[resto] for d in extras):
            continue
        if not simples and any(d.get('condicao') for d in extras):
            continue
        out.append(('qualificador' if extras else 'perdido', frase))
    return out


def checa_efeitos(root):
    r = Relatorio()
    try:
        ef = _j(root, BAL, sb.EFEITOS)
        out = _j(root, 'data', 'efeitos.json')
        regras = _j(root, BAL, 'ficha-digital-regras.json')
        fonte = _j(root, BAL, sb.FONTE)
        marcas = _j(root, BAL, sb.MARCAS)
    except (OSError, ValueError) as e:
        r.falha(f'arquivo da F1d ilegível ({e}): rode tools/sync_balanceamento.py e tools/build.py')
        return r
    bazar = {x['id']: x for x in _j(root, 'data', 'bazar.json')}
    csv_ef = _csv_efeito(root)
    pericias = _j(root, 'data', 'pericias.json')
    slugs = {p['slug'] for p in pericias['pericias']}
    conds = {c['id'] for g in _j(root, 'data', 'condicoes.json')['categorias'] for c in g['cards']}
    magias = {x['id'] for n in _j(root, 'data', 'magias.json').values() for e in n.values() for x in e}
    dest = json.load(open(ge.DESTINO, encoding='utf-8'))
    voc = ge.Vocab(dest)
    exc = json.load(open(ge.EXCECOES, encoding='utf-8'))['itens']
    tipos = set(dest['placeholders']['<tipo>'])
    cats = set(dest['placeholders']['<categoria>'])
    recargas = {k for k, v in regras['recargas'].items() if isinstance(v, str) and k != 'status'}
    eventos = {v for k, v in regras['recargas'].items() if isinstance(v, str) and k != 'status'}
    I, A, C = set(ef['itens']), set(ef['armas']), set(ef['consumo'])
    S, N = ef['semEfeitoNaFicha'], [x['id'] if isinstance(x, dict) else x for x in ef['naoParseado']]
    por = out.get('porId', {})

    # 1. conjunto
    ids = set(bazar)
    uniao = I | A | C | set(S) | set(N)
    if uniao != ids:
        r.falha(f'[1] partição != ids do bazar.json: só_bazar {_lista(sorted(ids - uniao))}; '
                f'só_efeitos {_lista(sorted(uniao - ids))}')
    if len(ids) != ESPERADO['bazar']:
        r.aviso(f'[1] bazar.json com {len(ids)} ids (esperado {ESPERADO["bazar"]})')
    for nome, xs in (('semEfeitoNaFicha', S), ('empilhaveis', ef['empilhaveis'])):
        dup = [k for k, n in Counter(xs).items() if n > 1]
        if dup:
            r.falha(f'[1] {nome} com duplicata: {_lista(dup)}')
    if set(S) & (I | A | C):
        r.falha(f'[1] sem efeito ∩ outros blocos: {_lista(sorted(set(S) & (I | A | C)))}')
    ai = A & I
    nao_foco = sorted(i for i in ai if ef['itens'][i]['slot'] != 'foco' or ef['armas'][i].get('arquetipo') != 'mistica')
    if nao_foco:
        r.falha(f'[1] armas ∩ itens fora dos focos: {_lista(nao_foco)}')
    if len(ai) != ESPERADO['focos']:
        r.aviso(f'[1] armas ∩ itens = {len(ai)} (esperado {ESPERADO["focos"]} focos)')
    if N:
        r.aviso(f'[1] naoParseado não vazio: {_lista(N)}')
    if set(por) != I | A | C:
        r.falha(f'[1] data/efeitos.json porId != itens ∪ armas ∪ consumo (só_saida '
                f'{_lista(sorted(set(por) - (I | A | C)))}; falta {_lista(sorted((I | A | C) - set(por)))}): rode build.py')

    # 2. catálogo
    ruins = []
    for bloco, campos in (('itens', ('nome', 'categoria', 'raridade')), ('consumo', ('nome', 'categoria', 'raridade')),
                          ('armas', ('nome',))):
        for i, x in ef[bloco].items():
            b = bazar.get(i)
            if b is None:
                continue
            for k in campos:
                if x.get(k) != b.get(k):
                    ruins.append(f'{i}.{k}: {x.get(k)!r} x bazar {b.get(k)!r}')
            if 'verbatim' in x and x['verbatim'] != csv_ef.get(b['nome']):
                ruins.append(f'{i}: verbatim != coluna Efeito do CSV')
    for i, e in por.items():
        if i in bazar and e.get('texto') != bazar[i]['efeito']:
            ruins.append(f'{i}: texto != bazar.efeito')
    for x in ruins:
        r.falha(f'[2] {x}')
    if out.get('fonte', {}).get('shaBazar') != ef['fonte'].get('sha256_16'):
        r.aviso(f'[2] CSV do balanceamento ({ef["fonte"].get("sha256_16")}) != CSV da main '
                f'({out.get("fonte", {}).get("shaBazar")}); a coluna Efeito bate nos {len(I | C)} com verbatim')
    if out.get('fonte', {}).get('shaBalanceamento') != fonte.get('commit'):
        r.falha('[2] data/efeitos.json de outra entrega do balanceamento: rode build.py')

    # 3. vocabulário fechado (no arquivo de origem e na saída)
    fam_dest = set(dest['familias'])
    if fam_dest != set(ef['alvos']):
        r.falha(f'[3] tools/alvos_destino.json x alvos do arquivo: só_destino {_lista(sorted(fam_dest - set(ef["alvos"])))}; '
                f'só_arquivo {_lista(sorted(set(ef["alvos"]) - fam_dest))}')
    for grupo in ('familias', 'foraDoArquivoDeEfeitos'):
        for f, d in dest[grupo].items():
            if len(set(d['destino']) & {'campo', 'lembrete', 'adiado'}) != 1:
                r.falha(f'[3] alvos_destino {f}: destino tem de ser um de campo | lembrete | adiado')
    voc_ruim = []

    def mods_de(i):
        if i in ef['itens']:
            for m in ef['itens'][i]['modificadores']:
                yield 'itens', m
        if i in ef['consumo']:
            for m in ef['consumo'][i]['efeito']:
                yield 'consumo', m

    for i in sorted(I | C):
        for bloco, m in mods_de(i):
            try:
                voc.alvo(m['alvo'], m)
            except ge.Falha as e:
                voc_ruim.append(f'{i}: {e}')
                continue
            a = m['alvo']
            if m['op'] not in dest['ops']:
                voc_ruim.append(f'{i}: op {m["op"]!r}')
            if m.get('condicao') is not None and m['condicao'] not in dest['condicao']:
                voc_ruim.append(f'{i}: condicao {m["condicao"]!r}')
            if m.get('tipo') is not None and m['tipo'] not in tipos | cats:
                voc_ruim.append(f'{i}: tipo {m["tipo"]!r}')
            suf = a.split('.', 1)[1] if '.' in a else ''
            if a.startswith(('pericia.', 'permiteSemTreino.')) and suf not in slugs:
                voc_ruim.append(f'{i}: perícia {suf!r} fora do data/pericias.json')
            if a.startswith('imunidade.condicao.') and a.rsplit('.', 1)[1] not in conds:
                voc_ruim.append(f'{i}: condição {a.rsplit(".", 1)[1]!r} fora do data/condicoes.json')
            esc = m.get('escolha') or {}
            de = esc.get('de')
            if isinstance(de, list):
                universo = set(dest['placeholders']['<ATTR>']) if a == 'atributo' else tipos
                if set(de) - universo:
                    voc_ruim.append(f'{i}: escolha.de fora do vocabulário {sorted(set(de) - universo)}')
            if (m.get('ativacao') or {}).get('recarga') not in recargas | {None}:
                voc_ruim.append(f'{i}: ativacao.recarga {m["ativacao"]["recarga"]!r}')
            for t in m.get('excecao') or []:
                if t not in tipos | cats:
                    voc_ruim.append(f'{i}: excecao {t!r}')
    for i, x in list(ef['itens'].items()) + list(ef['consumo'].items()):
        if x.get('usos') and x['usos']['recarga'] not in recargas | {None}:
            voc_ruim.append(f'{i}: usos.recarga {x["usos"]["recarga"]!r}')
        if x['status'] not in dest['status']:
            voc_ruim.append(f'{i}: status {x["status"]!r}')
    for i, x in ef['itens'].items():
        if x['quando'] not in dest['quando']:
            voc_ruim.append(f'{i}: quando {x["quando"]!r}')
    for i, x in ef['consumo'].items():
        for c in x['aplicaCondicao']:
            if c['id'] not in conds:
                voc_ruim.append(f'{i}: aplicaCondicao {c["id"]!r} fora do data/condicoes.json')
        for c in (x['removeCondicao'] or {}).get('condicoes', []):
            if c not in conds:
                voc_ruim.append(f'{i}: removeCondicao {c!r} fora do data/condicoes.json')
        for g in x.get('gera') or []:
            if g.get('item') not in bazar:
                voc_ruim.append(f'{i}: gera {g.get("item")!r} não é item do Bazar')
    for i, a in ef['armas'].items():
        ts = a['tipo'] if isinstance(a['tipo'], list) else [a['tipo']]
        for t in ts:
            if t is not None and t not in tipos:
                voc_ruim.append(f'{i}: tipo de arma {t!r}')
        for d in a.get('danoExtra') or []:
            if d.get('tipo') not in tipos | cats:
                voc_ruim.append(f'{i}: danoExtra.tipo {d.get("tipo")!r}')
    for i, e in por.items():
        c = e.get('consumo') or {}
        if c.get('conjura') and c['conjura'].get('id') not in magias:
            voc_ruim.append(f'{i}: conjura {c["conjura"].get("id")!r} fora do data/magias.json')
        mun = (e.get('arma') or {}).get('municao')
        if mun is not None and mun not in bazar:
            voc_ruim.append(f'{i}: munição {mun!r} não é id do Bazar')
        for q in e.get('requisito') or []:
            if 'pericia' in q and (q['pericia'] not in slugs or not 0 <= q['grau'] < len(pericias['graus'])):
                voc_ruim.append(f'{i}: requisito {q}')
            if 'attr' in q and q['attr'] not in dest['placeholders']['<ATTR>']:
                voc_ruim.append(f'{i}: requisito {q}')
            if 'marcaVhelorMin' in q and not marcas['min'] < q['marcaVhelorMin'] <= marcas['max']:
                voc_ruim.append(f'{i}: requisito {q} fora de 1..{marcas["max"]}')
    if [g['nome'] for g in pericias['graus']] != ge.GRAUS:
        voc_ruim.append(f'graus do data/pericias.json != gerar_efeitos.GRAUS')
    # vhelor.marcas: o gatilho do item == o do marcas-vhelor.json
    gat = {i: x['marcaVhelor'] for i, x in ef['consumo'].items() if 'marcaVhelor' in x}
    if set(gat) != set(marcas['gatilhos']):
        voc_ruim.append(f'vhelor.marcas: itens com marcaVhelor {sorted(gat)} != gatilhos {sorted(marcas["gatilhos"])}')
    for i, g in gat.items():
        mg = marcas['gatilhos'].get(i, {})
        if (g.get('soma'), g.get('funcionaAteMarca')) != (mg.get('soma'), mg.get('funcionaAteMarca')):
            voc_ruim.append(f'vhelor.marcas {i}: {g} x gatilho {mg}')
    req_v = {i: x['requisito']['marcaVhelorMin'] for i, x in ef['itens'].items()
             if 'marcaVhelorMin' in (x.get('requisito') or {})}
    if req_v != {i: q['marcaMin'] for i, q in marcas['requisitos'].items()}:
        voc_ruim.append(f'vhelor.marcas: requisitos {req_v} x {marcas["requisitos"]}')
    for x in voc_ruim:
        r.falha(f'[3] {x}')

    # 4. cruzada de inventário
    cap = {}
    for i, e in por.items():
        for m in e['mods']:
            if m['alvo'].startswith('capacidade.'):
                k = {'capacidade.bugigangas': 'bug', 'capacidade.equipamentos': 'equip'}[m['alvo']]
                cap.setdefault(i, {})[k] = cap.get(i, {}).get(k, 0) + m['valor']
    inv_cap = {i: b['inv']['capacidade'] for i, b in bazar.items() if 'capacidade' in b['inv']}
    if cap != inv_cap:
        r.falha(f'[4] capacidade.* != inv.capacidade: efeitos {cap} x bazar {inv_cap}')
    for i, b in bazar.items():
        e = por.get(i)
        if 'acumula' in b['inv'] and (e is None or e['acumulaCopia'] != b['inv']['acumula']):
            r.falha(f'[4] {i}: acumulaCopia {None if e is None else e["acumulaCopia"]} != inv.acumula {b["inv"]["acumula"]}')
    for i, e in sorted(por.items()):
        if e['acumulaCopia'] is False and 'acumula' not in bazar[i]['inv']:
            r.aviso(f'[4] {i}: acumulaCopia false sem inv.acumula no bazar.json (recipiente/outro campo do inventário)')
        if e['acumulaCopia'] is None:
            r.aviso(f'[4] {i}: acumula:false sem dizer o sentido (outra cópia x outras fontes): '
                    'PENDENTE (balanceamento), rodada 4 (plano §10, item 6)')
    emp = {i for i, b in bazar.items() if b['inv'].get('empilhavel')}
    if set(ef['empilhaveis']) != emp:
        r.falha(f'[4] empilhaveis != inv.empilhavel: só_efeitos {_lista(sorted(set(ef["empilhaveis"]) - emp))}; '
                f'só_bazar {_lista(sorted(emp - set(ef["empilhaveis"])))}')
    if len(emp) != ESPERADO['empilhaveis']:
        r.aviso(f'[4] {len(emp)} empilháveis (esperado {ESPERADO["empilhaveis"]})')
    slot_arm = {i: {'armaduraPesada': 'Pesada', 'armaduraLeve': 'Leve'}[e['slot']] for i, e in por.items()
                if e['slot'] in ('armaduraPesada', 'armaduraLeve')}
    inv_arm = {i: b['inv']['armadura'] for i, b in bazar.items() if b['inv'].get('armadura')}
    if slot_arm != inv_arm:
        dif = sorted(set(slot_arm.items()) ^ set(inv_arm.items()))
        r.falha(f'[4] slot de armadura != inv.armadura: {_lista(dif)}')
    n_arm = Counter(inv_arm.values())
    if (n_arm['Pesada'], n_arm['Leve']) != (ESPERADO['armaduraPesada'], ESPERADO['armaduraLeve']):
        r.aviso(f'[4] armaduras {dict(n_arm)} (esperado {ESPERADO["armaduraPesada"]} Pesadas / '
                f'{ESPERADO["armaduraLeve"]} Leves)')

    # 5. armas re-extraídas do texto + dano extra com qualificador
    n_chassi, defeitos = 0, {}
    for i, a in sorted(ef['armas'].items()):
        texto = csv_ef.get(a['nome'], '')
        if 'chassi' in a:
            n_chassi += 1
            m = RE_ARMA.match(texto)
            if not m:
                r.falha(f'[5] {i}: texto não re-extrai dados/atributo/ações')
                continue
            dados, attr, acoes = m.group(1), ge.ATTR_NOME[m.group(2)], int(m.group(3))
            s = por.get(i, {}).get('arma', {})
            if (s.get('dados'), s.get('atributo'), s.get('acoes')) != (dados, attr, acoes):
                r.falha(f'[5] {i}: arma {s.get("dados")}/{s.get("atributo")}/{s.get("acoes")} x texto {dados}/{attr}/{acoes}')
        for tipo, frase in _defeitos_arma(a, texto, a.get('lembretes') or []):
            defeitos[i] = (tipo, frase)
        # a saída tem de estar limpa (a exceção vira lembrete)
        s = por.get(i, {})
        for tipo, frase in _defeitos_arma(s.get('arma') or {}, texto, s.get('lembretes') or []):
            r.falha(f'[5] {i}: dano extra "{frase}" sem condição nem lembrete em data/efeitos.json')
    if n_chassi != ESPERADO['armasComChassi']:
        r.aviso(f'[5] {n_chassi} armas com chassi (esperado {ESPERADO["armasComChassi"]})')
    for i, (tipo, frase) in sorted(defeitos.items()):
        x = exc.get(i)
        if x and x['defeito'] == tipo and x['frase'] == frase:
            r.aviso(f'[5] {i}: defeito de parse conhecido ({tipo}) "{frase}" -> lembrete (tools/efeitos_excecoes.json; '
                    'errata pedida ao balanceamento)')
        else:
            r.falha(f'[5] {i}: dano extra "{frase}" {tipo} no arquivo do balanceamento, fora de tools/efeitos_excecoes.json')
    for i, x in sorted(exc.items()):
        if x['defeito'] in ('qualificador', 'perdido') and i not in defeitos:
            r.falha(f'[5] exceção obsoleta {i} ({x["defeito"]}): o arquivo não tem mais o defeito (errata chegou?): '
                    'tire de tools/efeitos_excecoes.json')
        if x['defeito'] == 'modComoLembrete':
            fonte_lem = (ef['itens'].get(i, {}).get('lembretes') or []) + (ef['armas'].get(i, {}).get('lembretes') or [])
            if ge.frase_lembrete(x['frase']) in fonte_lem:
                r.aviso(f'[5] {i}: defeito de parse conhecido (modComoLembrete) "{x["frase"]}" '
                        '(tools/efeitos_excecoes.json; errata pedida ao balanceamento)')
            else:
                r.falha(f'[5] exceção obsoleta {i} (modComoLembrete): o lembrete sumiu do arquivo: '
                        'tire de tools/efeitos_excecoes.json')

    # 6. lembrete com número de campo
    lc = sorted({i for i, e in por.items() for l in e['lembretes'] if RE_LEMBRETE_CAMPO.search(l)})
    if lc:
        r.aviso(f'[6] {len(lc)} item(ns) com lembrete que traz número de campo (pode ser Mod perdido): {_lista(lc, 12)}')

    # 7. contagens
    reais = {'itens': len(I), 'armas': len(A), 'consumo': len(C), 'semEfeitoNaFicha': len(S), 'naoParseado': len(N)}
    if ef.get('contagem') != reais:
        r.aviso(f'[7] contagem declarada {ef.get("contagem")} != contada {reais}')
    dif = {k: v for k, v in reais.items() if v != ESPERADO[k]}
    if dif:
        r.aviso(f'[7] contagens mudaram: {dif} (esperado ' + '/'.join(str(ESPERADO[k]) for k in reais) + ')')

    # 8. integridade de Mod
    opc = set(dest['opcionais'])
    quandos = set(dest['quando']) | {'consumido'}
    padroes_site = [ge._rx_padrao(p, dest['placeholders'])[0] for p in out.get('alvos', {})]
    for i, e in sorted(por.items()):
        for onde, ms, q in (('mods', e['mods'], e['quando']), ('consumo.mods', (e.get('consumo') or {}).get('mods', []), 'consumido')):
            for n, m in enumerate(ms):
                erro = []
                if set(m) - set(BASE_MOD) - opc:
                    erro.append(f'chaves {sorted(set(m) - set(BASE_MOD) - opc)}')
                falt = [k for k in BASE_MOD if k not in m and not (k == 'valor' and m.get('op') == 'escolha')]
                if falt:
                    erro.append(f'faltam {falt}')
                if m.get('fonte') != {'tipo': 'item', 'id': i}:
                    erro.append(f'fonte {m.get("fonte")}')
                if m.get('quando') not in quandos or m.get('quando') != q:
                    erro.append(f'quando {m.get("quando")!r}')
                if m.get('acumula') not in (True, False, 'maior', None):
                    erro.append(f'acumula {m.get("acumula")!r}')
                if m.get('status') not in dest['status']:
                    erro.append(f'status {m.get("status")!r}')
                if m.get('op') not in dest['ops']:
                    erro.append(f'op {m.get("op")!r}')
                a = m.get('alvo', '')
                if a not in ge.Vocab(dest).sem_sufixo and not any(rx.match(a) for rx in padroes_site):
                    erro.append(f'alvo {a!r} fora dos alvos do site')
                if (m.get('ativacao') or {}).get('recarga') not in eventos | {None}:
                    erro.append(f'ativacao.recarga {m["ativacao"]["recarga"]!r}')
                if erro:
                    r.falha(f'[8] {i}.{onde}.{n}: ' + '; '.join(erro))
        if e.get('usos') and e['usos']['recarga'] not in eventos | {None}:
            r.falha(f'[8] {i}.usos.recarga {e["usos"]["recarga"]!r} não é evento')

    n_mods = sum(len(e['mods']) + len((e.get('consumo') or {}).get('mods', [])) for e in por.values())
    r.ok.append(f'{len(ids)} ids = itens {len(I)} ∪ armas {len(A)} ∪ consumo {len(C)} ∪ sem efeito {len(S)}; '
                f'{len(por)} em data/efeitos.json com {n_mods} Mods; {len(ef["alvos"])} famílias de alvo com destino; '
                f'{n_chassi} armas re-extraídas; {len(emp)} empilháveis')
    return r


# ---------------------------------------------------------------- [vhelor]
def marcas_do_pedro(root):
    """(regra, {n: texto}) da §3.1 do 03-respostas-pedro.md (bloco citado '> ')."""
    txt = open(os.path.join(root, 'docs', 'ficha-digital', '03-respostas-pedro.md'), encoding='utf-8').read()
    m = re.search(r'^### 3\.1 Marcas da Vhelor.*?(?=^### )', txt, re.S | re.M)
    if not m:
        return None, {}
    cit = ' '.join(l[1:].strip() for l in m.group(0).splitlines() if l.startswith('>'))
    cit = re.sub(r'\s+', ' ', cit).strip()
    partes = re.split(r'(?:^|\s)([1-9])\.\s', cit)
    regra = partes[0].strip()
    return regra, {int(partes[k]): partes[k + 1].strip() for k in range(1, len(partes) - 1, 2)}


def checa_vhelor(root):
    r = Relatorio()
    try:
        mv = _j(root, BAL, sb.MARCAS)
    except (OSError, ValueError) as e:
        r.falha(f'{BAL}/{sb.MARCAS} ilegível ({e})')
        return r
    marcas = mv.get('marcas') or []
    ns = [m.get('n') for m in marcas]
    if ns != list(range(1, 8)):
        r.falha(f'marcas n = {ns} (esperado 1..7, sem buraco)')
    if (mv.get('min'), mv.get('max')) != (0, 7):
        r.falha(f'min/max = {mv.get("min")}/{mv.get("max")} (esperado 0/7)')
    regra, pedro = marcas_do_pedro(root)
    norm = lambda s: re.sub(r'\s+', ' ', s or '').strip()
    if norm(mv.get('regra')) != norm(regra):
        r.falha('regra das Marcas != texto do Pedro (03 §3.1)')
    for m in marcas:
        if not norm(m.get('texto')):
            r.falha(f'marca {m.get("n")}: texto vazio')
        elif norm(m['texto']) != norm(pedro.get(m.get('n'))):
            r.falha(f'marca {m.get("n")}: texto != 03-respostas-pedro.md §3.1 (verbatim do Pedro)')
    dest = json.load(open(ge.DESTINO, encoding='utf-8'))
    voc = ge.Vocab(dest)
    slugs = {p['slug'] for p in _j(root, 'data', 'pericias.json')['pericias']}
    conds = {c['id'] for g in _j(root, 'data', 'condicoes.json')['categorias'] for c in g['cards']}
    bazar = {x['id'] for x in _j(root, 'data', 'bazar.json')}
    for m in marcas:
        for mod in m.get('modificadores') or []:
            try:
                voc.alvo(mod['alvo'], mod)
            except ge.Falha as e:
                r.falha(f'marca {m["n"]}: {e}')
            if mod.get('op') not in dest['ops']:
                r.falha(f'marca {m["n"]}: op {mod.get("op")!r} fora do vocabulário')
        for c in m.get('aplicaCondicao') or []:
            if c.get('id') not in conds:
                r.falha(f'marca {m["n"]}: condição {c.get("id")!r} fora do data/condicoes.json')
        for t in m.get('testes') or []:
            if t.get('pericia') not in slugs:
                r.falha(f'marca {m["n"]}: teste com perícia {t.get("pericia")!r}')
            f = t.get('falha')
            if isinstance(f, dict) and f.get('aplicaCondicao') not in conds:
                r.falha(f'marca {m["n"]}: falha aplica {f.get("aplicaCondicao")!r} fora do data/condicoes.json')
    for grupo in ('gatilhos', 'requisitos'):
        fora = sorted(set(mv.get(grupo) or {}) - bazar)
        if fora:
            r.falha(f'{grupo} com id fora do Bazar: {_lista(fora)}')
    # texto numa fonte só
    textos = [m['texto'] for m in marcas if m.get('texto')]
    alvo_unico = os.path.normpath(os.path.join(root, BAL, sb.MARCAS))
    repetido = []
    for pasta in ('data', 'js', 'pages'):
        for dp, _, fs in os.walk(os.path.join(root, pasta)):
            for f in fs:
                p = os.path.join(dp, f)
                if os.path.normpath(p) == alvo_unico or not f.endswith(('.json', '.js', '.html')):
                    continue
                s = open(p, encoding='utf-8', errors='replace').read()
                for t in textos:
                    if t in s or json.dumps(t)[1:-1] in s:
                        repetido.append(os.path.relpath(p, root).replace(os.sep, '/'))
                        break
    if repetido:
        r.falha(f'texto das Marcas repetido fora de {BAL}/{sb.MARCAS} (fonte única): {_lista(sorted(set(repetido)))}')
    r.ok.append(f'{len(marcas)} marcas (n 1..7) iguais ao texto do Pedro, {len(mv.get("gatilhos") or {})} gatilhos, '
                f'texto numa fonte só ({BAL}/{sb.MARCAS})'.replace(os.sep, '/'))
    return r
