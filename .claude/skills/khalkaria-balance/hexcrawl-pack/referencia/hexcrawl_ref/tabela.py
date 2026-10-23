"""Tabelas de eventos dos hexes (docs/01 §5).

- Cada região tem a sua tabela global (eventos/<regiao>.json).
- Cada hex neutro monta a sua tabela a partir dela: filtra pelo tipo do hex, sorteia 8–12 entradas
  respeitando a mistura de polaridade da região (com variação por hex) e dá a cada uma o peso da raridade.
- A tabela guarda PESOS. As faixas do d100 saem deles na hora (maior resto), então tirar uma entrada só
  recalcula as faixas.
- Notável e raro: ao sair, marcam o hex e somem de TODAS as tabelas da região.
- Comum: continua; só marca o hex se o evento tiver "marca": true (o Abrigo).
- Extração: o peso efetivo é multiplicado por 0,5^k (k = sítios desde o último descanso).
"""
from __future__ import annotations

import random

PESOS_PADRAO = {'comum': 5, 'notavel': 3, 'raro': 1}
POLARIDADES = ('favoravel', 'neutro', 'adverso')


def _maior_resto(total: int, pesos: list[float]) -> list[int]:
    """Reparte `total` inteiro na proporção dos pesos (método do maior resto)."""
    s = sum(pesos)
    if s <= 0:
        return [0] * len(pesos)
    brutos = [total * p / s for p in pesos]
    base = [int(b) for b in brutos]
    sobra = total - sum(base)
    ordem = sorted(range(len(pesos)), key=lambda i: (brutos[i] - base[i], -i), reverse=True)
    for i in ordem[:sobra]:
        base[i] += 1
    return base


def montar_tabela(eventos: list[dict], tipo_hex: str, montagem: dict, rng: random.Random,
                  consumidos: set[str] = frozenset()) -> list[dict]:
    """Monta a tabela de um hex. Devolve [{'evento': id, 'peso': n}], em ordem estável."""
    cand = [e for e in eventos if tipo_hex in e['tipos'] and e['id'] not in consumidos]
    if not cand:
        return []
    lo, hi = montagem.get('entradas', [8, 12])
    n = min(rng.randint(lo, hi), len(cand))
    var = montagem.get('variacao', 0.10)
    mistura = montagem['mistura']
    fr = [max(0.0, mistura[p] + rng.uniform(-var, var)) for p in POLARIDADES]
    alvo = _maior_resto(n, fr)
    por_pol = {p: [e for e in cand if e['polaridade'] == p] for p in POLARIDADES}
    # falta candidato numa polaridade: a sobra vai para as outras, na ordem da mistura
    quant = {p: min(a, len(por_pol[p])) for p, a in zip(POLARIDADES, alvo)}
    falta = n - sum(quant.values())
    while falta > 0:
        livres = [p for p in POLARIDADES if len(por_pol[p]) > quant[p]]
        if not livres:
            break
        p = max(livres, key=lambda x: (mistura[x], -POLARIDADES.index(x)))
        quant[p] += 1
        falta -= 1
    pesos = montagem.get('pesos', PESOS_PADRAO)
    escolhidos = []
    for p in POLARIDADES:
        escolhidos += rng.sample(por_pol[p], quant[p])
    escolhidos.sort(key=lambda e: e['id'])
    return [{'evento': e['id'], 'peso': pesos[e['raridade']]} for e in escolhidos]


def pesos_efetivos(tabela: list[dict], eventos_por_id: dict, sitios_extracao: int) -> list[float]:
    out = []
    for t in tabela:
        w = float(t['peso'])
        if eventos_por_id[t['evento']]['categoria'] == 'extracao':
            w *= 0.5 ** sitios_extracao
        out.append(w)
    return out


def faixas_d100(tabela: list[dict], eventos_por_id: dict, sitios_extracao: int = 0) -> list[dict]:
    """[{'evento', 'de', 'ate'}] cobrindo 1..100. Toda entrada com peso > 0 ganha ao menos 1 número."""
    if not tabela:
        return []
    w = pesos_efetivos(tabela, eventos_por_id, sitios_extracao)
    if len(tabela) > 100:
        raise ValueError('mais de 100 entradas não cabem num d100')
    tam = _maior_resto(100 - len(tabela), w)
    tam = [t + 1 for t in tam]          # piso de 1 por entrada
    out, ini = [], 1
    for t, k in zip(tabela, tam):
        out.append({'evento': t['evento'], 'de': ini, 'ate': ini + k - 1})
        ini += k
    return out


def rolar(tabela: list[dict], eventos_por_id: dict, d100: int, sitios_extracao: int = 0) -> str | None:
    for f in faixas_d100(tabela, eventos_por_id, sitios_extracao):
        if f['de'] <= d100 <= f['ate']:
            return f['evento']
    return None


def aplicar_resultado(evento_id: str, hid: str, eventos_por_id: dict, estado: dict) -> dict:
    """Aplica a saída da rolagem ao estado da campanha (estrutura de campanha/estado.json).

    - registra em 'revelados' do hex (o que os jogadores já viram ali);
    - notável/raro: marca o hex ('definidos'), entra em 'consumidos' e sai de todas as tabelas da região;
    - comum com marca (Abrigo): marca o hex, mas fica nas tabelas;
    - extração: soma 1 ao contador do dia.
    """
    e = eventos_por_id[evento_id]
    estado.setdefault('revelados', {}).setdefault(hid, [])
    if evento_id not in estado['revelados'][hid]:
        estado['revelados'][hid].append(evento_id)
    if e['raridade'] in ('notavel', 'raro'):
        estado.setdefault('definidos', {})[hid] = evento_id
        consumidos = estado.setdefault('consumidos', [])
        if evento_id not in consumidos:
            consumidos.append(evento_id)
        for t in estado.get('tabelas', {}).values():
            t['entradas'] = [x for x in t['entradas'] if x['evento'] != evento_id]
    elif e.get('marca'):
        estado.setdefault('definidos', {})[hid] = evento_id
    if e['categoria'] == 'extracao':
        estado['extracoesNoDia'] = estado.get('extracoesNoDia', 0) + 1
    return estado


def pode_rolar(hid: str, estado: dict, hex_info: dict) -> bool:
    """O hex rola a tabela quando é explorado, se não for especial e não tiver nada marcado."""
    if hex_info.get('especial'):
        return False
    return hid not in estado.get('definidos', {})
