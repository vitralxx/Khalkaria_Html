#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Efeitos compilados dos itens (F1d): data/balanceamento/ -> data/efeitos.json

Lê a projeção publicada do arquivo de efeitos do balanceamento
(data/balanceamento/ficha-efeitos-itens.json, gravada pelo
tools/sync_balanceamento.py) e compila o que a ficha usa, no formato do plano
(§3.2 "data/efeitos.json" e §4 "Mod do site"):

  {schemaVersion:'efeitos/1', fonte:{…}, alvos:{alvo do site: destino},
   porId:{'item-x':{quando, slot, acumulaCopia, usos, sintoniaDescansos,
                    duracao, mods[], arma?, consumo?, requisito, lembretes[],
                    texto, status}}}

só para os ids com algo (itens ∪ armas ∪ consumo; os "sem efeito na ficha"
não entram). SÓ DADO: nenhuma página lê este arquivo ainda.

- Alvo, op, quando, status, recarga, condicao, duração e opcional do Mod saem
  do vocabulário fechado de tools/alvos_destino.json; o que não casar derruba
  o gerador. O alvo vai para o namespace do site (saude.max ->
  recurso.saude.max...); recarga vira evento pelo bloco `recargas` do contrato.
- `acumula:false` do arquivo tem 2 sentidos (plano §4): "não acumula com outra
  cópia" -> acumulaCopia:false; "não acumula com outras fontes" -> Mod
  acumula:false; sem frase (Saco de Dormir) -> null nos dois (o validar avisa).
- `texto` é o `efeito` do data/bazar.json (o que o jogador lê); o verbatim do
  arquivo do balanceamento é conferido contra o CSV no validar.py, não copiado.
- `municao` da arma vira id de item; `conjura` ganha o id da magia; `requisito`
  vira lista de {attr,min} | {treino} | {pericia,grau} (+ os objetos que o
  arquivo já traz estruturados), com o texto em `requisitoTexto`.
- Defeitos de parse conhecidos (tools/efeitos_excecoes.json) viram lembrete com
  a frase verbatim do CSV; o dano extra que perdeu o qualificador sai do
  automático.
- Marcas da Vhelor: aqui só o gatilho (`consumo.marcaVhelor`) e o requisito; o
  texto das marcas mora só em data/balanceamento/marcas-vhelor.json.

ARTEFATO: o round-trip do validar.py regenera e compara byte a byte.
Uso: python tools/gerar_efeitos.py [repo_root]
"""
import hashlib, json, os, re, sys

TOOLS = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(TOOLS)
sys.path.insert(0, TOOLS)
from shell import slugify  # noqa: E402

REPO = next((a for a in sys.argv[1:] if not a.startswith('--')), RAIZ) if __name__ == '__main__' else RAIZ
DESTINO = os.path.join(TOOLS, 'alvos_destino.json')
EXCECOES = os.path.join(TOOLS, 'efeitos_excecoes.json')
BAL = os.path.join('data', 'balanceamento')
CSV = os.path.join('data', 'Bazar_Khalkaria_v26.csv')

ORDEM_STATUS = ['canonico', 'aprovado', 'decisao', 'pendente']      # do mais firme ao menos
GRAUS = ['Leigo', 'Treinado', 'Experiente', 'Mestre', 'Lendário']   # data/pericias.json (graus)
ATTR_NOME = {'Força': 'FOR', 'Destreza': 'DES', 'Constituição': 'CON', 'Inteligência': 'INT', 'Sabedoria': 'SAB'}
RE_DANO_FRASE = re.compile(r'\+ (\d+d\d+) (\S+)')


class Falha(Exception):
    pass


def ler(root, *rel):
    return json.load(open(os.path.join(root, *rel), encoding='utf-8'))


# ---------------------------------------------------------------- vocabulário
def _rx_padrao(padrao, ph):
    """'pericia.<pericia>' -> (regex, [placeholders na ordem])."""
    partes, nomes = [], []
    for tok in re.split(r'(<[^>]+>)', padrao):
        if tok.startswith('<'):
            v = ph[tok]
            partes.append('(' + ('|'.join(map(re.escape, v)) if isinstance(v, list) else '[a-z0-9-]+') + ')')
            nomes.append(tok)
        else:
            partes.append(re.escape(tok))
    return re.compile('^' + ''.join(partes) + '$'), nomes


class Vocab:
    def __init__(self, dest):
        self.d = dest
        ph = dest['placeholders']
        self.padroes = []          # (familia, regex, nomes, site, destino)
        for grupo in ('familias', 'foraDoArquivoDeEfeitos'):
            for fam, f in dest[grupo].items():
                for pad, site in f['padroes'].items():
                    rx, nomes = _rx_padrao(pad, ph)
                    self.padroes.append((fam, rx, nomes, site, f['destino']))
        self.sem_sufixo = {f['semSufixo']: fam for fam, f in dest['familias'].items() if 'semSufixo' in f}
        self.rx_duracao = re.compile(dest['duracao'])

    def alvo(self, a, mod=None):
        """alvo do arquivo -> (familia, alvo do site, destino). Falha se não casar."""
        if a in self.sem_sufixo:
            if mod is not None and (mod.get('op') == 'escolha' or mod.get('todos') is True):
                fam = self.sem_sufixo[a]
                return fam, a, self.d['familias'][fam]['destino']
            raise Falha(f'alvo sem sufixo {a!r} sem escolha nem todos')
        for fam, rx, nomes, site, dest in self.padroes:
            m = rx.match(a)
            if m:
                for nome, val in zip(nomes, m.groups()):
                    site = site.replace(nome, val)
                return fam, site, dest
        raise Falha(f'alvo {a!r} fora de tools/alvos_destino.json')

    def destinos_site(self):
        """{padrão do site: destino} (o que a ficha consulta em runtime)."""
        out = {}
        for grupo in ('familias', 'foraDoArquivoDeEfeitos'):
            for f in self.d[grupo].values():
                for site in f['padroes'].values():
                    out[site] = f['destino']
        return dict(sorted(out.items()))


# ---------------------------------------------------------------- partes
def sentido_acumula(item):
    """'nenhum' | 'copia' | 'fontes' | 'indefinido' (os 2 sentidos de acumula:false)."""
    if item.get('acumula') is not False:
        return 'nenhum'
    t = item.get('verbatim') or ''
    if re.search(r'não acumula com outra cópia', t, re.I):
        return 'copia'
    if re.search(r'não acumula com outras fontes', t, re.I):
        return 'fontes'
    return 'indefinido'


def evento(rec, recargas):
    if rec is None:
        return None
    if rec not in recargas:
        raise Falha(f'recarga {rec!r} fora do bloco recargas do contrato')
    return recargas[rec]


def usos(u, recargas):
    if u is None:
        return None
    return {'n': u['n'], 'recarga': evento(u['recarga'], recargas)}


def compila_mod(m, id_, quando, acumula, status, voc, recargas):
    extra = set(m) - {'alvo', 'op', 'valor'} - set(voc.d['opcionais'])
    if extra:
        raise Falha(f'{id_}: opcional fora do vocabulário {sorted(extra)}')
    _, alvo, _ = voc.alvo(m['alvo'], m)
    if m['op'] not in voc.d['ops']:
        raise Falha(f'{id_}: op {m["op"]!r} fora do vocabulário')
    if m.get('condicao') is not None and m['condicao'] not in voc.d['condicao']:
        raise Falha(f'{id_}: condicao {m["condicao"]!r} fora do vocabulário')
    if m.get('duracao') is not None and not voc.rx_duracao.match(m['duracao']):
        raise Falha(f'{id_}: duração {m["duracao"]!r} fora dos formatos')
    out = {'alvo': alvo, 'op': m['op']}
    if 'valor' in m:
        out['valor'] = m['valor']
    out.update({'quando': quando, 'acumula': acumula, 'duracao': m.get('duracao'),
                'fonte': {'tipo': 'item', 'id': id_}, 'status': status})
    for k in voc.d['opcionais']:
        if k in m and k != 'duracao':
            v = m[k]
            if k == 'ativacao':
                v = dict(v, recarga=evento(v.get('recarga'), recargas))
            out[k] = v
    return out


def requisito_texto(txt, voc):
    """'Inteligência ≥ 12 e Treinado em Místico' -> [{attr,min}, {pericia,grau}]."""
    if txt in voc.d['treino']:
        return [{'treino': voc.d['treino'][txt]}]
    out = []
    for parte in txt.split(' e '):
        m = re.fullmatch(r'(\w+) ≥ (\d+)', parte)
        if m and m.group(1) in ATTR_NOME:
            out.append({'attr': ATTR_NOME[m.group(1)], 'min': int(m.group(2))})
            continue
        m = re.fullmatch(r'(\w+) em (.+)', parte)
        if m and m.group(1) in GRAUS:
            out.append({'pericia': slugify(m.group(2)), 'grau': GRAUS.index(m.group(1))})
            continue
        raise Falha(f'requisito {txt!r}: parte {parte!r} sem leitura')
    return out


def frase_lembrete(frase):
    return frase.strip().rstrip('.')


def aplica_excecao(id_, exc, arma, lembretes, texto):
    if exc['frase'] not in texto:
        raise Falha(f'{id_}: frase da exceção não está no texto do Bazar: {exc["frase"]!r}')
    if exc['defeito'] == 'qualificador' and arma is not None:
        m = RE_DANO_FRASE.match(exc['frase'])
        tipo = slugify(m.group(2)) if m else None
        arma['danoExtra'] = [d for d in arma.get('danoExtra', [])
                             if d.get('condicao') or not (m and d.get('dados') == m.group(1) and d.get('tipo') == tipo)]
    lem = frase_lembrete(exc['frase'])
    if lem not in lembretes:
        lembretes.append(lem)


def pior_status(ss):
    for s in ss:
        if s not in ORDEM_STATUS:
            raise Falha(f'status {s!r} fora do vocabulário {ORDEM_STATUS}')
    return max(ss, key=ORDEM_STATUS.index)


def sha_csv(root):
    """sha256[:16] do CSV com fim de linha normalizado (o autocrlf não muda o hash)."""
    b = open(os.path.join(root, CSV), 'rb').read().replace(b'\r\n', b'\n')
    return hashlib.sha256(b).hexdigest()[:16]


# ---------------------------------------------------------------- gerar
def gerar(root=None):
    root = root or REPO
    ef = ler(root, BAL, 'ficha-efeitos-itens.json')
    regras = ler(root, BAL, 'ficha-digital-regras.json')
    fonte = ler(root, BAL, 'fonte.json')
    bazar = ler(root, 'data', 'bazar.json')
    magias = ler(root, 'data', 'magias.json')
    voc = Vocab(json.load(open(DESTINO, encoding='utf-8')))
    exc = json.load(open(EXCECOES, encoding='utf-8'))['itens']
    recargas = {k: v for k, v in regras['recargas'].items() if isinstance(v, str) and k != 'status'}

    texto = {x['id']: x['efeito'] for x in bazar}
    id_por_nome = {x['nome']: x['id'] for x in bazar}
    magia_id = {x['nome']: x['id'] for k, nivel in magias.items() if k.startswith('nivel')
                for esc in nivel.values() for x in esc}
    for q in ef['itens'].values():
        if q['quando'] not in voc.d['quando']:
            raise Falha(f'{q["nome"]}: quando {q["quando"]!r} fora do vocabulário')

    ids = sorted(set(ef['itens']) | set(ef['armas']) | set(ef['consumo']))
    por_id = {}
    for id_ in ids:
        if id_ not in texto:
            raise Falha(f'{id_}: id do arquivo de efeitos fora do data/bazar.json')
        it, ar, co = ef['itens'].get(id_), ef['armas'].get(id_), ef['consumo'].get(id_)
        status = pior_status([b['status'] for b in (it, ar, co) if b])
        sentido = sentido_acumula(it) if it else 'nenhum'
        acumula_mod = {'fontes': False, 'indefinido': None}.get(sentido, True)
        e = {'quando': it['quando'] if it else None,
             'slot': it['slot'] if it else None,
             'acumulaCopia': {'copia': False, 'indefinido': None}.get(sentido, True),
             'usos': usos((it or co or {}).get('usos'), recargas),
             'sintoniaDescansos': (it or {}).get('sintoniaDescansos'),
             'duracao': (it or co or {}).get('duracao'),
             'mods': [compila_mod(m, id_, it['quando'], acumula_mod, it['status'], voc, recargas)
                      for m in (it['modificadores'] if it else [])]}
        if e['duracao'] is not None and not voc.rx_duracao.match(e['duracao']):
            raise Falha(f'{id_}: duração {e["duracao"]!r} fora dos formatos')
        if it and it.get('compativel'):
            e['compativel'] = it['compativel']
        lembretes = list((it or {}).get('lembretes', []))
        req, req_txt = [], None
        if ar:
            a = {k: v for k, v in ar.items() if k not in ('nome', 'propriedades', 'status', 'lembretes', 'requisito')}
            if a.get('municao') is not None:
                if a['municao'] not in id_por_nome:
                    raise Falha(f'{id_}: munição {a["municao"]!r} não é item do Bazar')
                a['municao'] = id_por_nome[a['municao']]
            e['arma'] = a
            lembretes += [x for x in ar.get('lembretes', []) if x not in lembretes]
            if ar.get('requisito'):
                req_txt = ar['requisito']
                req += requisito_texto(req_txt, voc)
        if it and it.get('requisito'):
            req.append(it['requisito'])
        if co:
            c = {'mods': [compila_mod(m, id_, 'consumido', True, co['status'], voc, recargas) for m in co['efeito']],
                 'aplicaCondicao': co['aplicaCondicao'], 'removeCondicao': co['removeCondicao'],
                 'conjura': None, 'alimento': co['alimento'], 'acoes': co['acoes']}
            if co['conjura']:
                if co['conjura']['magia'] not in magia_id:
                    raise Falha(f'{id_}: conjura {co["conjura"]["magia"]!r} fora do data/magias.json')
                c['conjura'] = dict(co['conjura'], id=magia_id[co['conjura']['magia']])
            for k in ('avisoRaca', 'soParaRaca', 'gera', 'marcaVhelor'):
                if k in co:
                    c[k] = co[k]
            e['consumo'] = c
            lembretes += [x for x in co.get('lembretes', []) if x not in lembretes]
        if id_ in exc:
            aplica_excecao(id_, exc[id_], e.get('arma'), lembretes, texto[id_])
        e['requisito'] = req or None
        e['requisitoTexto'] = req_txt
        e['lembretes'] = lembretes
        e['texto'] = texto[id_]
        e['status'] = status
        por_id[id_] = e

    return {
        'schemaVersion': 'efeitos/1',
        '_doc': 'ARTEFATO de tools/gerar_efeitos.py (F1d): não editar à mão. Fonte: data/balanceamento/'
                'ficha-efeitos-itens.json (projeção publicada da entrega do balanceamento) + data/bazar.json. '
                'Vocabulário e destino dos alvos: tools/alvos_destino.json. Texto das Marcas da Vhelor: '
                'data/balanceamento/marcas-vhelor.json.',
        'fonte': {'shaBalanceamento': fonte['commit'], 'efeitosItens': ef['schemaVersion'],
                  'shaBazar': sha_csv(root), 'shaBazarDoBalanceamento': ef['fonte']['sha256_16']},
        'contagem': {'porId': len(por_id), 'itens': len(ef['itens']), 'armas': len(ef['armas']),
                     'consumo': len(ef['consumo']), 'semEfeitoNaFicha': len(ef['semEfeitoNaFicha'])},
        'alvos': voc.destinos_site(),
        'porId': por_id,
    }


def grava(doc, root=None):
    caminho = os.path.join(root or REPO, 'data', 'efeitos.json')
    with open(caminho, 'w', encoding='utf-8', newline='\n') as fh:
        json.dump(doc, fh, ensure_ascii=False, indent=1)
        fh.write('\n')
    return caminho


def main():
    try:
        sys.stdout.reconfigure(errors='replace')
    except (AttributeError, ValueError):
        pass
    try:
        doc = gerar()
    except Falha as e:
        raise SystemExit(f'FALHA gerar_efeitos: {e}')
    grava(doc)
    n = doc['contagem']
    ind = sum(1 for e in doc['porId'].values() if e['acumulaCopia'] is None)
    print(f'efeitos: {n["porId"]} ids com efeito (itens {n["itens"]} · armas {n["armas"]} · consumo '
          f'{n["consumo"]}; sem efeito {n["semEfeitoNaFicha"]}) · '
          f'{sum(len(e["mods"]) + len((e.get("consumo") or {}).get("mods", [])) for e in doc["porId"].values())} Mods'
          f' · balanceamento {doc["fonte"]["shaBalanceamento"][:7]} -> data/efeitos.json'
          + (f' · {ind} com acumula:false sem sentido (AVISO no validar)' if ind else ''))


if __name__ == '__main__':
    main()
