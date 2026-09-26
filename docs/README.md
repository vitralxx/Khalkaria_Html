# Documentação do Khalkaria_Html

| Arquivo | O que é |
|---|---|
| `ARQUITETURA.md` | Mapa técnico do repo: pipeline de build, geradores, validação, comandos |
| `ficha-digital/01-pedido-ao-balanceamento.md` | Pedido ao agente de balanceamento: 59 perguntas e 21 contradições para a ficha digital |
| `ficha-digital/02-plano.md` | Plano da ficha como hub: arquitetura, contrato entidade→ficha, fases F0–F7 |
| `ficha-digital/03-respostas-pedro.md` | Respostas do Pedro às decisões do plano, assistente de criação e campos da ficha física A4 |

Fora daqui: `CLAUDE.md` (protocolo do agente) e `CHANGELOG.md` (versões) ficam na raiz. O
contrato de regras e os efeitos de itens vêm do agente de balanceamento (branch
`claude/khalkaria-bazar-balance-lsdfic`, pasta `.claude/skills/khalkaria-balance/references/`) e,
a partir da fase F1d, são copiados verbatim para `data/balanceamento/`.
