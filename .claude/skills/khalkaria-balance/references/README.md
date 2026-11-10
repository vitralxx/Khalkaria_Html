# Ferramentas e artefatos do balanceamento

**A memória do agente de balanceamento mudou de casa em 2026-11-11.** Ela está em
[`vitralxx/khalkaria-contexto`](https://github.com/vitralxx/khalkaria-contexto), na pasta `agentes/balanceamento/`:
- `00-memoria.md`: comece por aqui;
- `00-pendencias.md`, `00-lista.md`;
- `09-decisoes-pedro.md`, a lei;
- os destilados e as frentes.

Aqui ficam só as ferramentas e os artefatos que o código usa:

| Arquivo | Uso |
|---|---|
| `bazar-v26.csv` | cópia de trabalho do CSV do Pedro, para o `auditor.py` |
| `10-novidades-bazar.md`, `novidades.json` | gerados pelo `auditor.py novidades` |
| `ficha-digital-regras.json`, `ficha-efeitos-itens.json`, `ficha-efeitos-overrides.json`, `marcas-vhelor.json` | **contratos que o site sincroniza** (`tools/sync_balanceamento.py` do site lê esta pasta) |
| `tabela-efeitos-itens.csv`, `ficha-efeitos-*.py`, `ficha-efeitos-tabela-curadoria.json` | tabela de efeitos e seus geradores |
| `magias-nivel1*.{json,py}`, `alquimista-notion.json`, `log-tecnicas-respostas.json`, `batedor-sim-*.py` | dados e scripts das rodadas |

Não mova os JSON de contrato sem combinar com o agente do site: o sync dele depende deste caminho.
