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

Cada item ganha também `inv` (como se comporta no inventário, lido do Efeito:
slot, empilhavel, armadura, capacidade/acumula, ocupa, recipiente). Frase de
inventário que não casa com o esperado é FALHA (sai com código 1, nada gravado).

Placeholders do template: {{VOCAB}} (inclui as condições de Sobrepeso de
data/condicoes.json), {{TOTAL}} e {{VER}} (hash dos assets do Bazar, cache-bust).

Uso: python tools/gerar_bazar.py [csv] [saida_html]
Para publicar, use `python tools/build.py`: só ele aplica a navegação (fase 2).
"""
import csv, json, sys, os, re, unicodedata, hashlib, glob

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
RE_REAGENTES = re.compile(r'(?<![\w])(\d+) Reagentes(?![\w])')


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
    # O CSV do agente de balanceamento escreve "2 Reagentes" (sem x, no plural)
    # nas receitas de Alquimia; o item do catálogo é "Reagente Alquímico (x1)".
    # Normalizar aqui mantém o link mesmo quando a planilha volta na forma antiga.
    txt = RE_REAGENTES.sub(r'\1x Reagente Alquímico (x1)', txt)
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


RE_EMPILHA = re.compile(r'(?<!Não é )[Ee]mpilh[aá]vel:\s*pesa 1 bugiganga a cada 10 unidades')
RE_CAPAC = re.compile(r'\+(\d+)\s*(?:de capacidade de\s*)?(bugigangas?|equipamentos?)', re.I)
RE_RECIPIENTE = re.compile(r'Armazena até (\d+) Bugigangas')
EQUIPAMENTO = {'Arma', 'Armadura', 'Escudo'}

# Onde mora o que é empilhável. O Sistema diz que "itens leves contam como 1
# bugiganga a cada 10 unidades", então a pilha pesa em Bugigangas mesmo quando
# a categoria é Arma (Estilhaços do Abismo). PENDENTE PEDRO: se ele decidir que
# arma empilhável continua em Equipamentos, é só trocar esta constante.
SLOT_EMPILHAVEL = 'bugiganga'

# Contagem registrada em 2026-09-25 (CSV v26). Item novo no CSV muda a contagem
# legitimamente, então divergir aqui é só AVISO; frase reescrita no Efeito é
# pega pelas FALHAs estruturais de validar_inventario().
ESPERADO = {'empilhavel': 85, 'capacidade': 3, 'naoOcupa': 1,
            'armaduras': (27, 23), 'slot': (240, 487)}

# D26b: o Pedro aprovou os dois como Empilháveis, mas a frase ainda não está no
# Efeito_Jogador do CSV (a edição é dele). Até lá o gerador segue lendo o texto
# exibido, a contagem fica 85 e cada build avisa pelo nome. Quando o CSV mudar,
# os dois passam a sair empilháveis: tirar daqui e subir ESPERADO para 87.
PENDENTE_D26B = ('Casca de Raiz', 'Seiva da Vhelor')


def parse_inventario(efeito, cats, arq, fam):
    """Como o item se comporta no inventário — tudo lido do Efeito, nada inventado.

    Regra canônica (Sistema > Inventário e Peso): Equipamentos são armas,
    armaduras e escudos; Bugigangas são todo o resto. "Itens leves contam como
    1 bugiganga a cada 10 unidades" — 85 itens do CSV declaram isso no Efeito.
    Bolsas e mochilas declaram capacidade extra e se acumulam com cópia ou não.
    Nada de peso pré-calculado: o motor da Ficha (KhInv) faz a conta.
    """
    ef = efeito or ''
    empilha = bool(RE_EMPILHA.search(ef))
    if empilha:
        slot = SLOT_EMPILHAVEL
    else:
        slot = 'equipamento' if set(cats or []) & EQUIPAMENTO else 'bugiganga'
    inv = {'slot': slot}
    if empilha:
        inv['empilhavel'] = True
    if fam == 'Slot' and arq in ('Pesada', 'Leve'):
        inv['armadura'] = arq                     # Pesada: 1 equipada · Leve: até 2
    if re.search(r'capacidade', ef, re.I):
        extra = {}
        for n, tipo in RE_CAPAC.findall(ef):
            extra['equip' if tipo.lower().startswith('equip') else 'bug'] = int(n)
        if extra:
            inv['capacidade'] = extra
            inv['acumula'] = not re.search(r'não acumula com outra cópia', ef, re.I)
    if re.search(r'não ocupa espaço', ef, re.I):
        inv['ocupa'] = False
    m = RE_RECIPIENTE.search(ef)
    if m:
        inv['recipiente'] = int(m.group(1))       # Bolsa Dimensional: só o selo da linha
    return inv


def validar_inventario(itens, nomes):
    """FALHAs estruturais: o que, se passar, faz o inventário pesar errado em silêncio."""
    falhas = []
    for it in itens:
        ef, inv, nome = it['efeito'], it['inv'], it['nome']
        if (re.search(r'empilh', ef, re.I) and not RE_EMPILHA.search(ef)
                and 'Não é empilhável' not in ef):
            falhas.append(f'{nome}: o Efeito fala em empilhar mas não casa a frase '
                          f'"Empilhável: pesa 1 bugiganga a cada 10 unidades" nem "Não é empilhável"')
        tem_palavra = bool(re.search(r'capacidade', ef, re.I))
        if tem_palavra != ('capacidade' in inv):
            falhas.append(f'{nome}: o Efeito ' + ('fala em capacidade mas nenhum "+N bugigangas/equipamentos" foi lido'
                                                  if tem_palavra else 'não fala em capacidade mas inv.capacidade existe'))
        if 'Armadura' in it['cats'] and inv.get('armadura') not in ('Pesada', 'Leve'):
            falhas.append(f'{nome}: Armadura sem [Pesada]/[Leve] no começo do Efeito')
        for g in it['ing']:
            if g['item'] not in nomes:
                falhas.append(f'{nome}: ingrediente "{g["item"]}" não existe no catálogo')
    return falhas


def contagem_inventario(itens):
    inv = [i['inv'] for i in itens]
    return {
        'empilhavel': sum(1 for x in inv if x.get('empilhavel')),
        'capacidade': sum(1 for x in inv if 'capacidade' in x),
        'naoOcupa': sum(1 for x in inv if x.get('ocupa') is False),
        'armaduras': (sum(1 for x in inv if x.get('armadura') == 'Pesada'),
                      sum(1 for x in inv if x.get('armadura') == 'Leve')),
        'slot': (sum(1 for x in inv if x['slot'] == 'equipamento'),
                 sum(1 for x in inv if x['slot'] == 'bugiganga')),
        'recipiente': sum(1 for x in inv if 'recipiente' in x),
    }


CONDICOES = os.path.join(RAIZ, 'data', 'condicoes.json')
SOBREPESO = {'leve': 'sobrepeso-leve', 'extremo': 'sobrepeso-extremo'}


def texto_plano(html):
    """Normalizador do §6 do CLAUDE.md: tira tags e colapsa espaços."""
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', html or '')).strip()


def carrega_condicoes():
    """Sobrepeso Leve/Extremo verbatim de data/condicoes.json (fonte: Notion).

    Devolve (vocab, falhas). O selo de condição do inventário cita este texto;
    se o card sumir ou mudar de id, é FALHA — nunca texto digitado à mão aqui.
    """
    cards = {}
    if os.path.exists(CONDICOES):
        dados = json.load(open(CONDICOES, encoding='utf-8'))
        for cat in dados.get('categorias', []):
            for c in cat.get('cards', []):
                cards[c.get('id')] = c
    out, falhas = {}, []
    for chave, cid in SOBREPESO.items():
        c = cards.get(cid)
        if not c:
            falhas.append(f'data/condicoes.json sem o card "{cid}"')
            continue
        out[chave] = {'id': cid, 'nome': c.get('nome', ''), 'texto': texto_plano(c.get('corpo', ''))}
    return out, falhas


# arquivos cujo conteúdo muda o comportamento da página: o ?v= só muda quando eles mudam
VER_ARQUIVOS = ['js/ficha.js', 'js/bazar*.js', 'css/bazar.css']


def versao_assets():
    """8 primeiros hex do sha1 de js/ficha.js + js/bazar*.js + css/bazar.css.

    CRLF vira LF antes do hash: o repo tem finais de linha misturados e o git
    normaliza, então o mesmo commit tem de dar o mesmo ?v= em qualquer checkout.
    """
    h = hashlib.sha1()
    for padrao in VER_ARQUIVOS:
        for f in sorted(glob.glob(os.path.join(RAIZ, *padrao.split('/')))):
            h.update(open(f, 'rb').read().replace(b'\r\n', b'\n'))
    return h.hexdigest()[:8]


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

    itens, dono_slug, falhas = [], {}, []
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

        # O id é a âncora #item/<id> e a chave do inventário da Ficha. Sufixo -N
        # por ordem de aparição mudaria de dono quando o CSV fosse reordenado,
        # então colisão é FALHA: o Pedro renomeia um dos itens.
        sid = slug(nome)
        if sid in dono_slug:
            falhas.append(f'colisão de id "{sid}": "{dono_slug[sid]}" e "{nome}"')
        dono_slug.setdefault(sid, nome)

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
            'inv': parse_inventario(efeito, cats, arq, fam),
            'busca': ' '.join([nome, categoria, r.get('Raridade', ''), r.get('Tipo de Craft', ''),
                               regiao, arq, ' '.join(tags), efeito]).lower(),
        })

    falhas += validar_inventario(itens, nomes)
    condicoes, falhas_cond = carrega_condicoes()
    falhas += falhas_cond
    if falhas:
        for f in falhas:
            print(f'FALHA: {f}')
        print(f'{len(falhas)} falha(s) estrutural(is): bazar.json e bazar.html NÃO foram gravados.')
        sys.exit(1)

    n = contagem_inventario(itens)
    print(f"inv: {n['empilhavel']} empilháveis · {n['capacidade']} com capacidade · "
          f"{n['naoOcupa']} não ocupa · {sum(n['armaduras'])} armaduras "
          f"({n['armaduras'][0]} P / {n['armaduras'][1]} L) · "
          f"{n['slot'][0]} equipamentos / {n['slot'][1]} bugigangas · "
          f"{n['recipiente']} recipiente")
    for chave, esperado in ESPERADO.items():
        if n[chave] != esperado:
            print(f'AVISO: inv.{chave} = {n[chave]}, esperado {esperado}. Item novo no CSV '
                  f'explica; se não, confira o Efeito e atualize ESPERADO.')
    inv_por_nome = {i['nome']: i['inv'] for i in itens}
    pendentes = [p for p in PENDENTE_D26B if not inv_por_nome.get(p, {}).get('empilhavel')]
    if pendentes:
        print(f'AVISO: {" e ".join(pendentes)}: Empilhável aprovado pelo Pedro (D26b), '
              f'edição do CSV pendente')
    resolvidos = [p for p in PENDENTE_D26B if p not in pendentes]
    if resolvidos:
        print(f'AVISO: {" e ".join(resolvidos)} já saem empilháveis do CSV (D26b feita): '
              f'tire de PENDENTE_D26B e suba ESPERADO["empilhavel"].')

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
        'condicoes': condicoes,
        # versão do catálogo para o fetch do bazar.json: sem ela, depois de um
        # CSV novo a página nova buscava o catálogo velho do cache (10 min no Pages)
        'dados': hashlib.sha1(open(BJSON, 'rb').read()).hexdigest()[:8],
    }

    ver = versao_assets()
    page = open(TPL, encoding='utf-8', newline='').read()
    page = page.replace('{{VOCAB}}', json.dumps(vocab, ensure_ascii=False))
    page = page.replace('{{TOTAL}}', str(len(itens)))
    page = page.replace('{{VER}}', ver)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, 'w', encoding='utf-8', newline='').write(page)
    print(f'bazar.html gerado: {len(itens)} itens -> {OUT} | assets v={ver}')
    if '<!--SIDEBAR-->' in page and not os.environ.get('KH_BUILD'):   # build.py define KH_BUILD
        print('    aviso: a navegação ainda é o marcador <!--SIDEBAR-->.'
              ' Publique pelo `python tools/build.py`, que aplica a fase 2.')


if __name__ == '__main__':
    main()
