# -*- coding: utf-8 -*-
"""Marcação entidade -> ficha (F1a), compartilhada pelos geradores.

Todo card de entidade sai com:
  data-kf-tipo="<tipo>" data-kf-id="<id do JSON, verbatim>" data-prever="<tipo>:<id>"
e, como PRIMEIROS filhos do card, o botão `.ent-add` e a alça `.ent-alca`,
ambos `hidden` até a F4 (nenhuma mudança visual: [hidden] é display:none e
nenhuma regra do site sobrepõe; como primeiros filhos não mexem nos
`p:last-child` do style.css).

O nome do card no JSON segue verbatim (D29: o emoji vem do Notion); aqui só
se separa o emoji para o aria-label e para o catálogo (`icone`).
"""
import html
import re

# Tipos da convenção (plano §3.2). Chave única da entidade: tipo:id.
TIPOS = ('magia', 'tecnica', 'marca', 'ultimate', 'traco', 'variante', 'subespecie',
         'tecnologia', 'corrupcao', 'origem', 'raca', 'classe', 'carta', 'dor',
         'beneficio', 'condicao', 'item')

# classe CSS do card -> tipo (classes e raças; os demais geradores já sabem o tipo)
TIPO_POR_CLASSE_CSS = {
    'technique-card': 'tecnica',
    'tier-technique': 'tecnica',
    'tech-card': 'tecnica',          # nas classes; no Autômato vira tecnologia (abaixo)
    'marca-card': 'marca',
    'ultimate-card': 'ultimate',
    'trait-card': 'traco',
    'variant-card': 'variante',
    'subspecie-card': 'subespecie',
    'raca-card': 'raca',
    'origem-card': 'origem',
}
TIPO_POR_CLASSE_CSS_RACA = dict(TIPO_POR_CLASSE_CSS, **{'tech-card': 'tecnologia'})

# Emoji e símbolos pictográficos (mesmas faixas do textoLimpo do js/ficha.js,
# mais ZWJ, keycap e o bloco 2300-23FF).
EMOJI = re.compile('[\U0001F000-\U0001FAFF☀-➿⬀-⯿⌀-⏿'
                   '←-⇿︀-️‍⃣\U000E0020-\U000E007F]')


def texto(h):
    """HTML -> texto de uma linha (normalizador do CLAUDE.md §6)."""
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()


def separa_icone(nome):
    """'📚 Acadêmico' -> ('📚', 'Acadêmico'). Sem emoji: (None, nome)."""
    limpo = texto(nome)
    achados = ''.join(EMOJI.findall(limpo))
    if not achados:
        return None, limpo
    return achados, re.sub(r'\s+', ' ', EMOJI.sub('', limpo)).strip()


def atributos(tipo, id_):
    if tipo not in TIPOS:
        raise SystemExit(f'kf_marca: tipo fora da convenção: {tipo!r}')
    if not id_ or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', id_):
        raise SystemExit(f'kf_marca: id inválido para {tipo}: {id_!r}')
    return f' data-kf-tipo="{tipo}" data-kf-id="{id_}" data-prever="{tipo}:{id_}"'


def controles(nome):
    """Botão de levar + alça, inertes (hidden) até a F4."""
    _, limpo = separa_icone(nome)
    rot = html.escape(f'Levar para a ficha: {limpo}', quote=True)
    return (f'<button type="button" class="ent-add" hidden aria-keyshortcuts="A" '
            f'aria-label="{rot}"></button><span class="ent-alca" hidden aria-hidden="true"></span>')


def abre(opentag, tipo, id_):
    """Injeta os data-kf-* no fim de uma tag de abertura verbatim do JSON."""
    if not (opentag.startswith('<') and opentag.endswith('>')) or 'data-kf-' in opentag:
        raise SystemExit(f'kf_marca: opentag inesperada: {opentag!r}')
    return opentag[:-1] + atributos(tipo, id_) + '>'


def tipo_do_opentag(opentag, tabela):
    m = re.search(r'class="([^"]+)"', opentag)
    for c in (m.group(1).split() if m else []):
        if c in tabela:
            return tabela[c]
    return None
