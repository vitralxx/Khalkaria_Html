"""Gera a página "Log de Técnicas" a partir de docs/ficha-digital/log-tecnicas.json."""
import json, pathlib, re

# Página "Log de Técnicas" (artifact claude.ai/artifact/L4ftxMddmAPHWwG8U1VukL).
# Uso: python tools/artefatos/monta_log.py  ->  tools/artefatos/saida/log-tecnicas.html
# e publicar esse arquivo pelo Artifact no mesmo link.
AQUI = pathlib.Path(__file__).parent
REPO = AQUI.parents[1]
SAIDA = AQUI / 'saida'
SAIDA.mkdir(exist_ok=True)
d = json.loads((REPO / 'docs/ficha-digital/log-tecnicas.json').read_text(encoding='utf-8'))

NOMES = {'espadachim': 'Espadachim', 'batedor': 'Batedor', 'brutalista': 'Brutalista', 'teurgo': 'Teurgo',
         'monge': 'Monge', 'alquimista': 'Alquimista', 'artilheiro': 'Artilheiro', 'humano': 'Humano', 'anao': 'Anão',
         'dryad': 'Dryad', 'automato': 'Autômato', 'gruto': 'Gruto', 'inseto': 'Inseto', 'corrompido': 'Corrompido'}
TIPOS = {'marca': 'Marca', 'ultimate': 'Ultimate', 'caracteristica-de-classe': 'Característica de classe',
         'recurso-de-classe': 'Recurso de classe', 'caracteristica-de-raca': 'Característica de raça', 'variante': 'Variante',
         'subespecie': 'Subespécie', 'tecnologia': 'Tecnologia', 'poder': 'Poder da Corrupção',
         'adversidade': 'Adversidade da Corrupção', 'corrupcao': 'Corrupção', 'habilidade-de-origem': 'Habilidade de origem'}


def fonte(t):
    p = t.get('pagina') or ''
    m = re.search(r'pages/(classes|racas)/([a-z]+)\.html', p)
    if m:
        nome = NOMES.get(m.group(2), m.group(2).title())
        return nome if m.group(1) == 'classes' else 'Raça · ' + nome
    if 'origens' in p:
        return 'Origens'
    return NOMES.get(t.get('dono') or '', t.get('dono') or '—')


def tipo(t):
    tp = t.get('tipo') or ''
    if tp == 'tecnica':
        return 'Técnica geral' if t.get('grupo') == 'geral' else 'Técnica de ramo'
    return TIPOS.get(tp, tp.replace('-', ' ').capitalize())


def txt(x):
    if isinstance(x, str):
        return x
    if isinstance(x, dict):
        for k in ('nota', 'texto', 'trecho', 'regraAtual', 'nome', 'padrao', 'valor'):
            if x.get(k):
                return str(x[k])
        return '; '.join(f'{k}: {v}' for k, v in x.items() if isinstance(v, (str, int, float)))
    return str(x)


def achado(a):
    r = a.get('resposta') or {}
    q = r.get('perguntaPedro') or None
    return {'nome': a.get('nome'), 'gr': a['gravidade'], 'pq': a['paraQuem'], 'tp': a['tipo'].replace('-', ' '),
            'tr': a['trecho'], 'ra': a['regraAtual'],
            'rs': r.get('status') or 'semResposta', 'rt': r.get('texto') or '', 'rac': r.get('acao') or '',
            'q': ({'id': q.get('id'), 'tema': q.get('tema'), 'p': q.get('pergunta'), 'rec': q.get('recomendacao')} if q else None),
            'sumiu': (a.get('trechoAtual') or {}).get('status') == 'ausente'}


tecnicas = []
for t in d['tecnicas']:
    ref, obs, auto = t.get('referencias', {}), t.get('obsoletas', {}), t.get('automacao', {})
    tecnicas.append({
        'id': t['id'], 'n': t['nome'], 'f': fonte(t), 'tipoRot': tipo(t), 'ramo': t.get('ramo'), 'tier': t.get('tier'),
        'c': t.get('custoTexto') or '', 'lv': t['levavel']['status'], 'lvn': '; '.join(map(txt, t['levavel'].get('notas', []))),
        'ds': (t['levavel'].get('descricaoV21') or {}).get('status'), 'cu': t.get('custo', {}).get('status'),
        'rc': t.get('recarga', {}).get('status'), 'rf': ref.get('status'), 'rfa': [txt(x) for x in ref.get('alertas', [])],
        'ob': obs.get('status'), 'oba': [txt(x) for x in obs.get('achados', [])],
        'num': [f"{x.get('valor')} {x.get('campo')}" for x in auto.get('numeros', [])],
        'st': t['status'], 'ac': [achado(a) for a in t.get('achados', [])]})

gerais = [achado(a) for a in d.get('achadosGerais', [])]
pp = d.get('perguntasPedro') or {}
itens_pp = pp.items() if isinstance(pp, dict) else [(x.get('id'), x) for x in pp]
perguntas = [{'id': k, 'tema': v.get('tema'), 'p': v.get('pergunta'), 'rec': v.get('recomendacao')} for k, v in itens_pp]
perguntas.sort(key=lambda x: int(re.sub(r'\D', '', x['id'] or '0') or 0))
# data da página = dia em que as respostas do balanceamento foram copiadas (origem.copiadoEm)
_resp = json.loads((REPO / 'docs/ficha-digital/log-tecnicas-respostas.json').read_text(encoding='utf-8'))
_ano, _mes, _dia = (_resp.get('origem', {}).get('copiadoEm') or '2026-09-27').split('-')
dados = {'data': f'{_dia}/{_mes}/{_ano}', 'tecnicas': tecnicas, 'gerais': gerais, 'perguntas': perguntas}
js = json.dumps(dados, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
html = (AQUI / 'log.template.html').read_text(encoding='utf-8').replace('__DADOS__', js)
(SAIDA / 'log-tecnicas.html').write_text(html, encoding='utf-8')
print(len(tecnicas), 'técnicas;', len(gerais), 'gerais;', round(len(html) / 1024), 'KB')
