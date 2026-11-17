# -*- coding: utf-8 -*-
"""Diagnóstico da ficha e da Mesa (2026-11-16): o que já funciona, o que espera, o que não se aplica.

Roda tools/diagnostico/itens-na-ficha.js (cada item do Bazar numa ficha de teste, conferido
pelo KhRegras), lê o log de técnicas, as magias, as cartas e as condições, e gera
tools/artefatos/diagnostico-ficha.html. Nenhuma lista é escrita à mão.
    python tools/diagnostico/relatorio.py
"""
import json, os, re, subprocess, sys, html, collections

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
J = lambda *p: json.load(open(os.path.join(RAIZ, *p), encoding='utf-8'))
E = lambda s: html.escape(str(s), quote=True)

itens = json.loads(subprocess.run(['node', os.path.join(RAIZ, 'tools', 'diagnostico', 'itens-na-ficha.js')],
                                  capture_output=True, check=True).stdout.decode('utf-8'))
TAB = J('data', 'balanceamento', 'ficha-efeitos-itens.json')['tabela']
EFAL = J('data', 'efeitos.json')['alvos']

# ---------------- itens ----------------
# partes passivas que não viram número, por família do alvo (o motor trata em outro canal ou espera a Mesa)
CANAL = [
    (r'^imunidade\.condicao\.', 'funciona', 'imunidade a condição (bloqueia a condição)'),
    (r'^capacidade\.', 'funciona', 'capacidade do inventário'),
    (r'^regeneracao\.', 'mesa', 'regeneração por turno'),
    (r'^permiteSemTreino\.', 'texto', 'permite usar o Ofício sem treino'),
    (r'^(recipiente|acao)\.', 'texto', 'regra de inventário'),
]
def familia(alvo, mods_inativos):
    for rx, est, rot in CANAL:
        if re.search(rx, alvo): return est, rot
    if any('escolha' in m for m in mods_inativos): return 'escolha', 'tipo à escolha do jogador'
    return 'funciona', 'soma no número'

def consumo_tipo(b):
    if not b: return None
    if b.get('conjura'): return 'conjura uma magia'
    if b.get('lembretes'): return 'parte em texto (alvo, área, arremesso)'
    if b.get('duracao') or any(m.get('duracao') for m in b.get('mods', [])): return 'efeito temporário'
    return 'efeito estruturado (cura, recurso, condição)'

linhas = []
for x in itens:
    t = TAB[x['id']]; g = t['gatilhos']
    r = {'nome': x['nome'], 'cat': x['categoria'], 'rar': x['raridade'], 'hoje': [], 'mesa': [], 'texto': []}
    if x.get('grupo') == 'sem-efeito':
        r['estado'] = 'sem-efeito'; r['motivo'] = {'lixo': 'lixo', 'material': 'material de fabricação', 'utilitario': 'utilitário de interpretação'}[x['motivo']]
        linhas.append(r); continue
    v = x.get('verificado') or {}
    if x['temArma']:
        eq = g['equipar']
        if eq.get('foco'): r['hoje'].append('Foco: libera a escola de magia')
        else: r['hoje'].append('linha de ataque calculada' if v.get('arma') else 'ARMA SEM LINHA')
    n = x['n']
    if n['passivos']:
        alvos = []
        for k in ('carregar', 'equipar', 'sintonizar'):
            for m in (g.get(k) or {}).get('mods', []):
                if m.get('aplica') == 'sempre' and m.get('para', 'portador') == 'portador' and not (EFAL.get(m['alvo']) or {}).get('lembrete'):
                    alvos.append(m['alvo'])
        fora = [a for a in alvos if not re.search(r'^(atributo|pericia|ar|ae|movimento|saude|stamina|eter|recurso|evasao|resistencia|imunidade\.(?!condicao)|vulnerabilidade|ataque|dano|desarmado|margemAmeaca|acoes|cd|limiar|magia|pma|classe|condicao|descanso|salto|sentido|marcaVhelor|resistirCondicao|eterMax|saudeMax)', a)]
        ok = v.get('passivosAtivos', 0)
        if ok: r['hoje'].append('passivo no número')
        for a in alvos:
            est, rot = familia(a, v.get('inativos', []))
            if est == 'funciona' and rot != 'soma no número' and rot not in r['hoje']: r['hoje'].append(rot)
            elif est == 'mesa' and rot not in r['mesa']: r['mesa'].append(rot)
            elif est == 'texto' and rot not in r['texto']: r['texto'].append(rot)
            elif est == 'escolha' and 'escolha de tipo (falta na ficha)' not in r['mesa']: r['mesa'].append('escolha de tipo (falta na ficha)')
    if n['situacionais']: r['hoje'].append('interruptor do situacional')
    if n['evento']: r['hoje'].append('botão do evento')
    if n['critico']: r['mesa'].append('efeito no crítico')
    if n['outros']: r['texto'].append('vale para aliados ou para quem recebe')
    if n['lembretes']: r['texto'].append('lembrete no card')
    if x['consumir']: r['mesa'].append('consumir: ' + consumo_tipo(g['consumir']))
    if x['usar']: r['mesa'].append(f"usar ({x['usar']} habilidade{'s' if x['usar'] > 1 else ''})")
    if r['hoje'] and not r['mesa']: r['estado'] = 'pronto'
    elif r['hoje']: r['estado'] = 'em-parte'
    elif r['mesa']: r['estado'] = 'espera-mesa'
    else: r['estado'] = 'so-texto'
    linhas.append(r)

EST = [('pronto', 'Já funciona na ficha', 'Todo efeito que o item tem já entra na ficha, conferido item a item no motor.'),
       ('em-parte', 'Funciona em parte', 'Uma parte já funciona; a outra espera a Mesa (consumir, usar, crítico, regeneração) ou uma escolha que a ficha ainda não pede.'),
       ('espera-mesa', 'Espera a Mesa', 'Nada automático hoje: o efeito acontece ao consumir ou usar.'),
       ('so-texto', 'Só texto', 'O efeito é de interpretação ou vale para outra criatura: a ficha mostra o texto.'),
       ('sem-efeito', 'Não se aplica', 'Lixo, material de fabricação e utilitário de interpretação (o pavio, a corda).')]
ci = collections.Counter(r['estado'] for r in linhas)
cons = collections.Counter(m for r in linhas for m in r['mesa'] if m.startswith('consumir:'))

# ---------------- técnicas ----------------
LOG = J('docs', 'ficha-digital', 'log-tecnicas.json')['tecnicas']
D = json.loads(subprocess.run(['node', '-e', "process.stdout.write(JSON.stringify(Object.keys(require('./js/ficha/00-regras-dados.js').fontes)))"],
                              cwd=RAIZ, capture_output=True, check=True).stdout.decode('utf-8'))
FONTES = set(D)
TIPO_ROT = {'tecnica': 'técnica de classe', 'marca': 'marca', 'ultimate': 'ultimate', 'caracteristica-de-raca': 'traço de raça',
            'habilidade-de-origem': 'habilidade de origem', 'tecnologia': 'tecnologia (Autômato)', 'corrupcao-poder': 'poder de corrupção',
            'corrupcao-adversidade': 'adversidade de corrupção', 'variante': 'variante de raça', 'recurso-de-classe': 'recurso de classe',
            'caracteristica-de-classe': 'característica de classe', 'subespecie': 'subespécie'}
tec = []
for t in LOG:
    custo = t.get('custo') or {}
    acoes = custo.get('acoes') or []
    passiva = 'passiva' in acoes or custo.get('status') == 'naoSeAplica'
    rec = (t.get('recarga') or {}).get('status') == 'ok'
    if t['id'] in FONTES: est = 'auto'
    elif passiva: est = 'passiva-texto'
    else: est = 'ativa-assistida'
    tec.append({'nome': t['nome'], 'tipo': TIPO_ROT.get(t['tipo'], t['tipo']), 'dono': t.get('dono') or '', 'est': est,
                'custo': custo.get('texto') or '', 'custoOk': custo.get('status'), 'recarga': rec,
                'numeros': len((t.get('automacao') or {}).get('numeros') or [])})
ct = collections.Counter(t['est'] for t in tec)
TEST = [('auto', 'Número automático hoje', 'O contrato dá o Mod, e a ficha soma sozinha.'),
        ('ativa-assistida', 'Ativa: a Mesa assiste', 'Na Mesa: texto inteiro, custo lido do log (revisado 3 vezes com o balanceamento), gastar o recurso, contar o uso. O efeito o jogador aplica.'),
        ('passiva-texto', 'Passiva só em texto', 'Fica em "Sempre valendo", com o texto. Quando o efeito for número fixo, o contrato pode virar Mod depois.')]

# ---------------- magias ----------------
sp = []
def walk(o):
    if isinstance(o, dict):
        if 'stats' in o and 'nome' in o: sp.append(o)
        for v in o.values(): walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
walk(J('data', 'magias.json'))
def st(x, *nomes): return any(s['caracteristica'] in nomes for s in x['stats'])
mg = {'total': len(sp), 'acao': sum(st(x, 'Ação') for x in sp), 'dano': sum(st(x, 'Dano') for x in sp),
      'resist': sum(st(x, 'Resistência', 'Resist.') for x in sp), 'mistico': sum('Místico' in x.get('descricao', '') for x in sp)}

# ---------------- cartas ----------------
cartas = J('data', 'catalogo', 'carta.json')['entradas']
cc = collections.Counter(c.get('categoria') for c in cartas)
dores = len(J('data', 'catalogo', 'dor.json')['entradas']); benef = len(J('data', 'catalogo', 'beneficio.json')['entradas'])
cartas_auto = sorted(f for f in FONTES if f.startswith('limiar-') or f.startswith('abismo-'))

# ---------------- condições ----------------
C = J('data', 'balanceamento', 'ficha-digital-regras.json')['condicoes']
SITE_C = [(k['id'], k['nome']) for cat in J('data', 'condicoes.json')['categorias'] for k in cat['cards']]
NUM = re.compile(r'^(acoes|evasao|pericia\.|tag\.|movimento|recurso\.|atributo|todasAsPericias|danoCausado|faixaDeFalhaCritica|testes)')
porc = {c['id']: c for c in C}
cond = []
for cid, nome in SITE_C:
    c = porc.get(cid, {})
    efs = list(c.get('efeitos') or [])
    for lv in (c.get('niveis') or {}).values(): efs += lv
    num = [e for e in efs if NUM.search(e.get('alvo', '')) and e.get('op') != 'lembrete']
    tique = [e for e in efs if e.get('alvo') == 'danoPorRodada']
    trava = [e for e in efs if e.get('op') in ('semAcao', 'semReacao', 'falhaAuto')]
    impl = c.get('implica') or []
    if num: est = 'número'
    elif tique: est = 'tique no turno'
    elif trava: est = 'trava'
    elif impl: est = 'implica outra'
    else: est = 'lembrete'
    cond.append({'nome': nome, 'est': est, 'num': len(num), 'tique': bool(tique), 'trava': bool(trava), 'impl': ', '.join(impl)})
ccn = collections.Counter(c['est'] for c in cond)

# ---------------- HTML ----------------
def lista_itens(est):
    rs = sorted([r for r in linhas if r['estado'] == est], key=lambda r: (r['cat'], r['nome']))
    if est == 'sem-efeito':
        return ''.join(f'<li><b>{E(r["nome"])}</b> <span class="m">{E(r["cat"])} · {E(r["motivo"])}</span></li>' for r in rs)
    def det(r):
        p = []
        if r['hoje']: p.append('<span class="ok">' + E(' · '.join(r['hoje'])) + '</span>')
        if r['mesa']: p.append('<span class="ms">' + E(' · '.join(r['mesa'])) + '</span>')
        if r['texto']: p.append('<span class="tx">' + E(' · '.join(r['texto'])) + '</span>')
        return ' '.join(p)
    return ''.join(f'<li><b>{E(r["nome"])}</b> <span class="m">{E(r["cat"])}</span> {det(r)}</li>' for r in rs)

def card(n, rot, txt, cls=''):
    return f'<div class="cd {cls}"><b>{n}</b><span>{E(rot)}</span><p>{E(txt)}</p></div>'

tot_itens = len(linhas)
h = []
h.append(f'''<title>Diagnóstico da Ficha</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap">
<style>
:root {{ color-scheme: dark; --fundo:#0a0a0c; --placa:#14131b; --borda:#2b2936; --texto:#e8e6e3; --t2:#aaa59c; --t3:#87827b; --ouro:#d4af37; --ok:#58c2a6; --ms:#e8a24c; --tx:#9aa7c7; --f-tit:'Cinzel',Georgia,serif; --f:'Crimson Text',Georgia,serif; }}
* {{ box-sizing: border-box; }}
body {{ margin: 0; background: var(--fundo); color: var(--texto); font: 17px/1.5 var(--f); }}
.pg {{ max-width: 1100px; margin-inline: auto; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 24px 60px; }}
h1 {{ font: 700 1.6rem/1.2 var(--f-tit); color: var(--ouro); margin: 0 0 4px; text-wrap: balance; }}
h2 {{ font: 700 1rem/1.3 var(--f-tit); letter-spacing: .12em; text-transform: uppercase; color: var(--ouro); margin: 34px 0 10px; }}
p {{ max-width: 72ch; }}
.sub {{ color: var(--t2); margin: 0 0 18px; }}
.cds {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 10px; }}
.cd {{ background: var(--placa); border: 1px solid var(--borda); border-radius: 12px; padding: 12px 14px; }}
.cd b {{ display: block; font: 700 1.9rem/1 var(--f-tit); }}
.cd span {{ display: block; font: 700 .72rem/1.3 var(--f-tit); letter-spacing: .1em; text-transform: uppercase; color: var(--t2); margin-top: 6px; }}
.cd p {{ margin: 6px 0 0; font-size: .95rem; color: var(--t3); }}
.cd.ok b {{ color: var(--ok); }} .cd.ms b {{ color: var(--ms); }} .cd.tx b {{ color: var(--tx); }} .cd.na b {{ color: var(--t3); }}
details {{ background: var(--placa); border: 1px solid var(--borda); border-radius: 10px; margin: 8px 0; }}
summary {{ cursor: pointer; padding: 10px 14px; font: 700 .8rem/1.3 var(--f-tit); letter-spacing: .08em; text-transform: uppercase; }}
details ul {{ margin: 0; padding: 4px 18px 14px 32px; columns: 2 320px; column-gap: 28px; }}
details li {{ break-inside: avoid; margin: 0 0 6px; font-size: .95rem; }}
.m {{ color: var(--t3); }} .ok {{ color: var(--ok); }} .ms {{ color: var(--ms); }} .tx {{ color: var(--tx); }}
table {{ border-collapse: collapse; width: 100%; font-size: .95rem; }}
th, td {{ text-align: left; padding: 6px 8px; border-bottom: 1px solid var(--borda); vertical-align: top; }}
th {{ font: 700 .7rem/1.3 var(--f-tit); letter-spacing: .1em; text-transform: uppercase; color: var(--t2); }}
.tb {{ overflow-x: auto; }}
.leg span {{ margin-right: 14px; font-size: .92rem; }}
</style>
<div class="pg">
<h1>Diagnóstico da ficha e da Mesa</h1>
<p class="sub">2026-11-16 · gerado por <code>tools/diagnostico/relatorio.py</code> a partir dos dados do site, do contrato do balanceamento e do motor da ficha. Cada item do Bazar foi posto numa ficha de teste e conferido no número calculado.</p>
<p class="leg"><span class="ok">■ já funciona</span><span class="ms">■ espera a Mesa ou falta</span><span class="tx">■ só texto</span></p>
<h2>Itens do Bazar · {tot_itens}</h2>
<div class="cds">''')
cls = {'pronto': 'ok', 'em-parte': 'ok', 'espera-mesa': 'ms', 'so-texto': 'tx', 'sem-efeito': 'na'}
for k, rot, txt in EST: h.append(card(ci[k], rot, txt, cls[k]))
h.append('</div>')
h.append(f'<p>Das armas, {sum(1 for r in linhas if "linha de ataque calculada" in r["hoje"])} geram a linha de ataque e {sum(1 for r in linhas if "Foco: libera a escola de magia" in r["hoje"])} são Focos (liberam a escola de magia, não atacam). Consumíveis por tipo de efeito: ' +
         '; '.join(f'{E(k.replace("consumir: ", ""))} <b>{v}</b>' for k, v in cons.most_common()) + '.</p>')
for k, rot, _ in EST:
    h.append(f'<details><summary>{E(rot)} · {ci[k]}</summary><ul>{lista_itens(k)}</ul></details>')

h.append(f'<h2>Técnicas e habilidades · {len(tec)}</h2><div class="cds">')
for k, rot, txt in TEST: h.append(card(ct[k], rot, txt, {'auto': 'ok', 'ativa-assistida': 'ms', 'passiva-texto': 'tx'}[k]))
h.append('</div>')
h.append(f'<p>Custo lido do texto: {sum(t["custoOk"] == "ok" for t in tec)} completos, {sum(t["custoOk"] == "parcial" for t in tec)} em parte. Com recarga (usos por descanso): {sum(t["recarga"] for t in tec)}. Com número no texto (candidatas a Mod): {sum(t["numeros"] > 0 for t in tec)}. Hoje toda técnica é manual por decisão sua (03 §1).</p>')
porTipo = collections.defaultdict(collections.Counter)
for t in tec: porTipo[t['tipo']][t['est']] += 1
h.append('<div class="tb"><table><tr><th>Tipo</th><th>Automático</th><th>Ativa assistida</th><th>Passiva em texto</th></tr>' +
         ''.join(f'<tr><td>{E(k)}</td><td>{v["auto"]}</td><td>{v["ativa-assistida"]}</td><td>{v["passiva-texto"]}</td></tr>' for k, v in sorted(porTipo.items(), key=lambda kv: -sum(kv[1].values()))) + '</table></div>')
for k, rot, _ in TEST:
    rs = sorted([t for t in tec if t['est'] == k], key=lambda t: (t['dono'], t['nome']))
    h.append(f'<details><summary>{E(rot)} · {len(rs)}</summary><ul>' + ''.join(
        f'<li><b>{E(t["nome"])}</b> <span class="m">{E(t["dono"] or t["tipo"])}{(" · " + E(t["custo"])) if t["custo"] else ""}{" · recarga" if t["recarga"] else ""}</span></li>' for t in rs) + '</ul></details>')

h.append(f'''<h2>Magias · {mg["total"]}</h2>
<p>O custo em Éter sai do nível e da intensidade (automático). Ação no campo: {mg["acao"]}. Dano por intensidade no campo: {mg["dano"]}. Teste de resistência no campo: {mg["resist"]}. Teste de Místico citado no texto: {mg["mistico"]}. O resto do efeito é texto: a Mesa rola o que está no campo e mostra o texto.</p>
<h2>Cartas · {len(cartas)} do Limiar e {dores + benef} do Abismo</h2>
<p>Limiar: {", ".join(f"{E(k)} {v}" for k, v in cc.most_common())}. Número automático hoje: a carta especial (+2 atributo, distribuído pelo jogador) e {len(cartas_auto)} cartas com Mod no contrato ({E(", ".join(cartas_auto))}). O resto é texto; as raras ficam ocultas no site.</p>
<h2>Condições · {len(cond)}</h2>
<p>As {len(cond)} do Notion estão no site e no contrato, inclusive o Descontrolado (a prova da Mesa mostrava só 15, como amostra). O Desprevenido mudou no Notion em 14/10 ("ainda tem sua reação", "expira em 1 turno") e falta sincronizar.</p>
<div class="tb"><table><tr><th>Condição</th><th>Como entra</th><th>Detalhe</th></tr>''')
for c in cond:
    det = []
    if c['num']: det.append(f'{c["num"]} efeito(s) no número')
    if c['tique']: det.append('dano no início do turno')
    if c['trava']: det.append('trava ação, reação ou teste')
    if c['impl']: det.append('implica ' + c['impl'])
    h.append(f'<tr><td>{E(c["nome"])}</td><td>{E(c["est"])}</td><td>{E("; ".join(det) or "lembrete na Mesa")}</td></tr>')
h.append('</table></div></div>')

saida = os.path.join(RAIZ, 'tools', 'artefatos', 'diagnostico-ficha.html')
open(saida, 'w', encoding='utf-8', newline='\n').write('\n'.join(h))
resumo = {'itens': dict(ci), 'consumir': dict(cons), 'tecnicas': dict(ct), 'magias': mg, 'cartas': dict(cc), 'condicoes': dict(ccn)}
print(json.dumps(resumo, ensure_ascii=False))
