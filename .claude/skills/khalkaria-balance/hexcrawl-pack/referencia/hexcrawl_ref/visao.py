"""Visão e névoa (docs/01 §6).

- O raio sai do tipo do hex onde o grupo está (mundo.json > tipos[].visao, configurável no app): padrão 1,
  Colinas 2, Litoral 2, Montanha 3, Floresta Densa 0, Água 2 (embarcado num hex de Água).
- Embarcado num RIO, o barco está numa aresta: o grupo vê só os 2 hexes dessa aresta (`visiveis_na_aresta`).
- Um hex no raio é visível se a linha reta até ele não atravessa um penhasco do lado BAIXO para o lado ALTO.
  Do alto, a visão desce; de baixo, o penhasco tapa.
- Névoa, por hex, na tela dos jogadores:
    'oculto'  nunca esteve no campo de visão: preto, sem grade;
    'visto'   já esteve, mas não está agora: cinza (textura, ícone, vias e marcas, sem cor);
    'visivel' está no campo de visão agora: vívido.
  O estado salvo guarda só quem já foi visto; 'visivel' é recalculado a cada passo.
"""
from __future__ import annotations

from . import hexmath as hm


def raio_de_visao(tipo_hex: str, tipos: dict) -> int:
    return int(tipos[tipo_hex].get('visao', 1))


def visiveis(origem: str, raio: int, colunas: int, linhas: int, penhascos: dict[str, str]) -> set[str]:
    """`penhascos`: chave canônica da aresta -> id do hex do lado ALTO."""
    out = {origem}
    for alvo in hm.alcance(origem, raio, colunas, linhas):
        if alvo == origem:
            continue
        caminho = hm.linha(origem, alvo)
        bloqueado = False
        for a, b in zip(caminho, caminho[1:]):
            d = hm.direcao_entre(a, b)
            if d is None:   # não deveria acontecer numa linha válida
                bloqueado = True
                break
            alto = penhascos.get(hm.chave_aresta(a, d))
            if alto is not None and alto == b:   # sobe do lado baixo para o alto
                bloqueado = True
                break
        if not bloqueado:
            out.add(alvo)
    return out


def visiveis_na_aresta(chave_aresta: str, colunas: int, linhas: int) -> set[str]:
    """Embarcado num rio: só os 2 hexes da aresta onde o barco está."""
    a, b = hm.hexes_da_aresta(chave_aresta)
    return {h for h in (a, b) if hm.dentro_da_grade(h, colunas, linhas)}


def estado_nevoa(hid: str, vistos: set[str], visiveis_agora: set[str]) -> str:
    if hid in visiveis_agora:
        return 'visivel'
    if hid in vistos:
        return 'visto'
    return 'oculto'
