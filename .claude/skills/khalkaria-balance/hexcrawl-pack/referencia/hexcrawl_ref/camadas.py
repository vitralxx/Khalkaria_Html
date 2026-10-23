"""Camadas de região (docs/01 §1.3, docs/03 §3).

- O mapa em jogo é a soma das camadas: cada região é uma camada que liga e desliga.
- Uma região ALTERNATIVA (mundo.json > regioes[].alternativaDe) tem um arquivo camadas/<id>.json com hexes que
  ocupam as células de outra região enquanto ela está ligada. Exemplo: a ilusão do Oásis sobre o Deserto do Abismo.
- Hexes sem região (mar e cidades) ficam sempre no mapa.
- O estado por hex (tabelas, definidos, revelados) usa a chave do hex em jogo: 'CCLL' na base e 'CCLL@<camada>'
  num hex de camada alternativa. A névoa ('vistos') é por lugar e usa só 'CCLL'.
"""
from __future__ import annotations


def chave_estado(hid: str, camada: str | None = None) -> str:
    return hid if camada is None else f'{hid}@{camada}'


def ligada(regiao_id: str, regioes: dict, estado_camadas: dict) -> bool:
    """O estado da campanha manda; sem ele, vale o `ativaPorPadrao` da região (padrão: ligada)."""
    if regiao_id in estado_camadas:
        return bool(estado_camadas[regiao_id])
    return bool(regioes[regiao_id].get('ativaPorPadrao', True))


def compor(hexes_base: list[dict], camadas: dict[str, list[dict]], regioes: dict,
           estado_camadas: dict) -> dict[str, dict]:
    """Mapa em jogo: {CCLL: registro}. Cada registro ganha '_camada' (None na base) e '_chave' (chave de estado).

    - região da base desligada: os hexes dela saem do mapa;
    - camada alternativa ligada: os hexes dela entram por cima, célula a célula.
    """
    mapa = {}
    for h in hexes_base:
        r = h.get('regiao')
        if r is not None and not ligada(r, regioes, estado_camadas):
            continue
        mapa[h['id']] = dict(h, _camada=None, _chave=h['id'])
    for cid in sorted(camadas):
        if not ligada(cid, regioes, estado_camadas):
            continue
        for h in camadas[cid]:
            mapa[h['id']] = dict(h, _camada=cid, _chave=chave_estado(h['id'], cid))
    return mapa
