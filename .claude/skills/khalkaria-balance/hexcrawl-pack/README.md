# Khalkaria Hexcrawl

App do mestre para preparar e rodar a exploração de **Kharavel**, o continente do RPG Khalkaria, em grade
hexagonal. Ele tem:
- um editor de mapa em pixel art;
- tabelas de eventos por região e por hex;
- o cálculo da viagem;
- uma segunda janela para os jogadores, com névoa.

- **Para começar:** `INICIO.md`.
- **Para o agente programador:** `CLAUDE.md` e `docs/`.
- **Regras:** `docs/01-regras.md`.

## Estado
O pack de inicialização está pronto. O app começa na fase F0 (`docs/08-fases.md`).

O núcleo de referência já roda e é testado:
```
cd referencia
python -m pytest -q tests                                  # 40 testes
python -m hexcrawl_ref.validador ../dados/exemplo/mundo    # 0 falhas, 0 avisos
python gera_vetores.py ..                                  # regenera testes/vetores-regras.json
python gera_exemplo.py ..                                  # regenera dados/exemplo
python gera_atlas.py ..                                    # regenera assets/tiles/atlas.json (requer Pillow)
```
