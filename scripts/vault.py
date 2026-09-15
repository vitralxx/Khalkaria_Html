#!/usr/bin/env python3
"""
Protocolo do vault Khalkaria.

    python3 scripts/vault.py check    valida o vault; sai com 1 se houver erro
    python3 scripts/vault.py index    regenera _meta/Índice.md a partir das notas
    python3 scripts/vault.py report   grava auditoria datada em docs/memoria/auditorias/

Rodar `check` antes de todo commit que toque o vault. O contrato que ele
verifica está em obsidian/Khalkaria/_meta/CONVENCOES.md.
"""
from __future__ import annotations

import json
import re
import sys
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
VAULT = RAIZ / "obsidian" / "Khalkaria"
INDICE = VAULT / "_meta" / "Índice.md"
PERGUNTAS = VAULT / "_meta" / "Perguntas Abertas.md"
AUDITORIAS = RAIZ / "docs" / "memoria" / "auditorias"

# Notas de processo: seguem outras regras de voz e de seção.
META = {"CONVENCOES", "Perguntas Abertas", "Log de Sincronização", "Índice"}

CAMPOS = ["tipo", "status", "spoiler", "era", "aliases", "fonte_notion", "ultima_sync", "tags"]
TIPOS = {"deus", "plano", "entidade", "conceito", "substancia", "fenomeno", "era", "continente",
         "regiao", "cidade", "local", "faccao", "npc", "pc", "raca", "classe", "origem",
         "escola", "regra", "condicao", "evento", "item", "moc"}
STATUS = {"canon-pedro", "canon-notion", "rascunho", "proposto", "conflito"}
SPOILER = {"gm", "publico"}
ERAS = {"atemporal", "plenitude", "pre-sessao0", "sessao0", "intervalo", "campanha"}

# Vocabulário de processo, proibido no corpo (permitido no frontmatter e em Procedência).
VOZ = re.compile(
    r"\*\*[AB]\d{1,2}\b|\([AB]\d{1,2}\)|\b[AB]\d{1,2}:|\bdigest\b|\bnotion_raw\b|\bverbatim\b"
    r"|Cânone \(Notion\)|Segundo o Pedro|\bPJ\b|\bo Pedro\b|\buuid\b", re.I)

# Frases que denunciam link nascido de coincidência, não de relação no mundo.
RUIDO = re.compile(
    r"apóstrofo|a grafia|o feitio do nome|segue o padrão dos nomes|soa parecid"
    r"|coincidência de nome|mesma inicial|rima com", re.I)

# Uma dúvida no corpo deve citar o número do registro central.
NUM_E = re.compile(r"\bE\d{1,3}\b")


def carregar() -> dict[str, dict]:
    """Lê o vault: frontmatter, corpo, seções e links de cada nota."""
    notas = {}
    for p in sorted(VAULT.rglob("*.md")):
        texto = p.read_text(encoding="utf-8")
        nome = p.stem
        fm, corpo = {}, texto
        m = re.match(r"^---\n(.*?)\n---\n?(.*)$", texto, re.S)
        if m:
            corpo = m.group(2)
            for linha in m.group(1).split("\n"):
                if ":" in linha and not linha.startswith((" ", "-", "#")):
                    k, v = linha.split(":", 1)
                    fm[k.strip()] = v.strip()
        secoes = re.findall(r"^## (.+)$", corpo, re.M)
        # o corpo "de leitura" exclui a Procedência, onde o vocabulário de processo é legítimo
        leitura = corpo.split("## Procedência")[0]
        # o que está em crase é exemplo de sintaxe, não link nem prosa
        sem_codigo = re.sub(r"```.*?```", " ", corpo, flags=re.S)
        sem_codigo = re.sub(r"`[^`]*`", " ", sem_codigo)
        notas[nome] = {
            "caminho": p, "rel": str(p.relative_to(VAULT)), "texto": texto, "fm": fm,
            "corpo": corpo, "leitura": leitura, "secoes": secoes,
            "links": [l.strip() for l in re.findall(r"\[\[([^\]|#]+)", sem_codigo)],
            "aliases": [a.strip().strip("\"'") for a in
                        re.findall(r"[^,\[\]]+", fm.get("aliases", "").strip("[]")) if a.strip()],
            "tabelas": sum(1 for l in corpo.split("\n") if l.strip().startswith("|")),
            "meta": nome in META,
        }
    return notas


def numeros_registrados() -> set[str]:
    if not PERGUNTAS.exists():
        return set()
    return set(re.findall(r"^- \*\*(E\d{1,3})\*\*", PERGUNTAS.read_text(encoding="utf-8"), re.M))


def check(notas: dict[str, dict]) -> dict[str, list]:
    """Valida o vault contra o contrato. Devolve problemas agrupados por tipo."""
    alvos = set(notas) | {a for n in notas.values() for a in n["aliases"]}
    registradas = numeros_registrados()
    p = defaultdict(list)

    entrantes = Counter()
    for nome, n in notas.items():
        for l in n["links"]:
            if l in notas:
                entrantes[l] += 1

    for nome, n in sorted(notas.items()):
        rel = n["rel"]

        for l in n["links"]:
            if l not in alvos:
                p["link_quebrado"].append(f"{rel}: [[{l}]]")

        if n["meta"]:
            continue

        faltam = [c for c in CAMPOS if c not in n["fm"]]
        if faltam:
            p["frontmatter"].append(f"{rel}: faltam {', '.join(faltam)}")
        for campo, validos in (("tipo", TIPOS), ("status", STATUS), ("spoiler", SPOILER), ("era", ERAS)):
            v = n["fm"].get(campo)
            if v and v not in validos:
                p["frontmatter"].append(f"{rel}: {campo}={v} fora do contrato")

        if "Relações" not in n["secoes"]:
            p["secao"].append(f"{rel}: sem '## Relações'")
        if "Procedência" not in n["secoes"]:
            p["secao"].append(f"{rel}: sem '## Procedência'")
        if n["secoes"] and n["secoes"][-1] != "Procedência":
            p["secao"].append(f"{rel}: '## Procedência' não é a última seção")
        if "Pontas soltas" in n["secoes"]:
            p["secao"].append(f"{rel}: usa 'Pontas soltas'; o contrato pede '## Em aberto'")

        for hit in set(VOZ.findall(n["leitura"])):
            p["voz"].append(f"{rel}: {hit.strip()}")

        for linha in n["leitura"].split("\n"):
            if "[[" in linha and RUIDO.search(linha):
                p["link_ruidoso"].append(f"{rel}: {linha.strip()[:110]}")

        m = re.search(r"## Em aberto\n(.*?)(?=\n## |\Z)", n["corpo"], re.S)
        if m:
            citados = set(NUM_E.findall(m.group(1)))
            if not citados:
                p["duvida_sem_numero"].append(f"{rel}: '## Em aberto' sem número de registro")
            for e in sorted(citados - registradas):
                p["duvida_sem_numero"].append(f"{rel}: {e} não existe em Perguntas Abertas")

        if not n["meta"] and entrantes[nome] == 0 and n["fm"].get("tipo") != "moc":
            p["orfa"].append(rel)

    dup = [k for k, v in Counter(n["caminho"].name for n in notas.values()).items() if v > 1]
    p["duplicado"].extend(dup)
    return p


def linha_identidade(n: dict) -> str:
    """Primeira frase útil da nota, para servir de legenda no índice."""
    corpo = re.sub(r"^#\s+.+$", "", n["corpo"], count=1, flags=re.M)
    m = re.search(r"\*\*Resumo\.\*\*\s*(.+?)(?=\n\n|\Z)", corpo, re.S)
    if m:
        txt = m.group(1)
    else:
        # primeiro parágrafo de prosa antes de qualquer subtítulo
        antes = corpo.split("\n## ")[0]
        txt = next((l for l in antes.split("\n")
                    if l.strip() and not l.startswith(("#", ">", "-", "|", "* ", "!", "1."))), "")
    txt = re.sub(r"\[\[([^\]|]+)\|([^\]]+)\]\]", r"\2", txt)
    txt = re.sub(r"\[\[([^\]]+)\]\]", r"\1", txt)
    txt = re.sub(r"[*_`]", "", txt).replace("\n", " ").strip()
    corte = txt.find(". ")
    if 40 < corte < 240:
        txt = txt[:corte + 1]
    return txt[:240].rstrip()


def index(notas: dict[str, dict]) -> str:
    """Gera o mapa do território: o que existe, onde, e o que ainda não existe."""
    por_pasta = defaultdict(list)
    for nome, n in notas.items():
        if n["meta"]:
            continue
        por_pasta[str(n["caminho"].parent.relative_to(VAULT))].append(nome)

    alvos = set(notas) | {a for n in notas.values() for a in n["aliases"]}
    entrantes, ausentes = Counter(), Counter()
    for n in notas.values():
        for l in n["links"]:
            (entrantes if l in notas else ausentes)[l] += 1

    hoje = date.today().isoformat()
    L = [
        "---", "tipo: moc", "status: canon-pedro", "spoiler: gm", "era: atemporal",
        'aliases: ["Índice", "Índice de Entidades", "Mapa do vault"]',
        "fonte_notion: gerado", f"ultima_sync: {hoje}", "tags: [khalkaria/meta]", "---",
        "# Índice de Entidades", "",
        f"Mapa do território: **{sum(len(v) for v in por_pasta.values())} entidades** com nota própria, "
        "o que cada uma é e onde mora. Gerado por `scripts/vault.py index` — não editar à mão.", "",
        "Formato: `Nome · tipo · pasta · [aliases]` e uma linha de identificação.", "",
    ]

    for pasta in sorted(por_pasta):
        L.append(f"## {pasta}")
        L.append("")
        for nome in sorted(por_pasta[pasta]):
            n = notas[nome]
            al = f" · [{', '.join(n['aliases'])}]" if n["aliases"] else ""
            L.append(f"**{nome}** · {n['fm'].get('tipo','?')}{al}")
            L.append(f": {linha_identidade(n)}")
            L.append("")

    faltantes = [(a, q) for a, q in ausentes.most_common() if a not in alvos]
    if faltantes:
        L += ["## Citadas sem nota própria", "",
              "Entidades que o vault menciona mas ainda não descreve. Cada uma é uma nota a escrever "
              "ou um link a remover.", ""]
        for alvo, q in faltantes:
            L.append(f"- **{alvo}** — citada {q}×")
        L.append("")

    L += ["## Mais conectadas", "",
          "Os centros do grafo, por número de notas que apontam para elas.", ""]
    for alvo, q in entrantes.most_common(25):
        L.append(f"- [[{alvo}]] — {q}")
    L.append("")
    return "\n".join(L)


def imprimir(p: dict[str, list]) -> int:
    rotulos = {
        "link_quebrado": "Links sem destino",
        "frontmatter": "Frontmatter fora do contrato",
        "secao": "Seções fora do contrato",
        "voz": "Vocabulário de processo no corpo",
        "link_ruidoso": "Links por coincidência, não por relação",
        "duvida_sem_numero": "Dúvidas sem número de registro",
        "orfa": "Notas que ninguém linka",
        "duplicado": "Nomes de arquivo repetidos",
    }
    total = 0
    for chave, rotulo in rotulos.items():
        itens = p.get(chave, [])
        if not itens:
            continue
        total += len(itens)
        print(f"\n{rotulo} ({len(itens)})")
        for i in itens[:12]:
            print(f"  · {i}")
        if len(itens) > 12:
            print(f"  … e mais {len(itens) - 12}")
    print(f"\n{'tudo em ordem' if not total else f'{total} problemas'}")
    return total


def main() -> int:
    cmd = sys.argv[1] if len(sys.argv) > 1 else "check"
    notas = carregar()

    if cmd == "check":
        return 1 if imprimir(check(notas)) else 0

    if cmd == "index":
        INDICE.write_text(index(notas), encoding="utf-8")
        print(f"{INDICE.relative_to(RAIZ)} · {len(notas)} notas")
        return 0

    if cmd == "report":
        p = check(notas)
        AUDITORIAS.mkdir(parents=True, exist_ok=True)
        hoje = date.today().isoformat()
        dados = {"data": hoje, "notas": len(notas),
                 "tabelas": sum(n["tabelas"] for n in notas.values()),
                 "problemas": {k: len(v) for k, v in p.items() if v}, "detalhe": dict(p)}
        (AUDITORIAS / f"{hoje}.json").write_text(
            json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"docs/memoria/auditorias/{hoje}.json · {len(notas)} notas · "
              f"{sum(len(v) for v in p.values())} problemas")
        return 0

    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main())
