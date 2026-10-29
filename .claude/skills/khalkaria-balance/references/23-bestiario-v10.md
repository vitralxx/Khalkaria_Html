# Bestiário Khalkaria v10: contrato de import (2026-10-29)

Fonte: `khalkaria_bestiary_v10.rar`, anexado pelo Pedro. Contém Flask + SQLite, `app.py`, `data/bestiary.db` e
`data/pack_criacao_v8.json`. Li o código, sem executá-lo. A lista de colunas saiu do próprio banco (`PRAGMA
table_info`).

## 1. Endpoints
| Endpoint | Corpo | Aceita |
|---|---|---|
| `POST /api/creature/import` | JSON no corpo (botão "📋 Colar JSON") | uma criatura `{type, name, …}`, um lote `{monsters:[…], npcs:[…]}`, `{creatures:[…]}` ou uma lista `[…]` |
| `POST /api/import` | upload multipart, campo `file` | o mesmo, mais o backup legado (`{monsters, encounters}`) |

**Como `insert_creature()` trata o JSON**
- `type`: `"npc"` ou `"npcs"` vira NPC; qualquer outra coisa, inclusive a ausência do campo, vira `monster`.
- Antes de gravar, descarta estas chaves: `id`, `type`, `created_at`, `updated_at`, `weapons_list`, `str_mod`,
  `dex_mod`, `con_mod`, `int_mod`, `wis_mod`.
- **Chave desconhecida é ignorada em silêncio:** o import só grava as chaves que são coluna da tabela. Não há erro e
  nada do registro existente é apagado; o import sempre cria uma criatura nova.
- `weapons` é gravado como texto JSON. `challenge_rating` passa por `parse_cr`.
- `name` vazio vira "Novo Monstro" ou "Novo NPC".
- Erro de JSON responde 400. Se nenhuma criatura for reconhecida, também responde 400 ("Verifique o campo
  name/type").

## 2. Campos (lista exata, extraída do banco)
**`monsters`**
- Identidade: `name`, `icon`, `monster_type`, `size`, `challenge_rating` (REAL), `xp_reward`, `tags`, `region`
  (v10).
- Recursos e defesa: `health_max`, `stamina_max`, `ether_max`, `evasion`, `armor`, `armor_specific`, `movement`
  (REAL, em m).
- Atributos: `strength`, `dexterity`, `constitution`, `intelligence`, `wisdom`.
- Perícias (22): `prof_attack`, `prof_defend`, `prof_movement`, `prof_fortitude`, `prof_will`, `prof_reflexes`,
  `prof_perception`, `prof_survival`, `prof_stealth`, `prof_crime`, `prof_initiative`, `prof_knowledge`,
  `prof_medicine`, `prof_investigation`, `prof_religion`, `prof_mystic`, `prof_persuasion`, `prof_intimidation`,
  `prof_insight`, `prof_deception`, `prof_motivate`, `prof_craft`; mais `craft_attr`.
- Defesas em texto: `resistances`, `vulnerabilities`, `immunities`, `senses`, `languages`.
- Texto: `habitat`, `tendency`, `appearance`, `description`.
- `weapons` (JSON).

**`npcs`**
- Os mesmos campos de combate, mais `title`, `race`, `npc_class`, `level` e `challenge_rating` (v10).
- Campos de dossiê: `personality`, `motivation`, `secrets`, `relationships`, `voice_mannerisms`, `objective`,
  `faction`, `loyalty`, `location`, `inventory_shop`, `quests_offered`, `disposition`.
- **Não tem** `monster_type`, `size`, `xp_reward`, `habitat` nem `tendency`.

**`abilities[]`** (monstro e NPC)
- Campos: `name`, `description`, `action_cost`, `stamina_cost`, `ether_cost`, `damage_dice`, `damage_bonus`,
  `damage_type`, `attack_bonus` (texto, ex. `"+12"`), `range_meters`, `area`, `save_type`, `save_dc`, `effects`,
  `is_passive` (0|1), `is_reaction` (0|1), `recharge` (texto).
- Aqui não há filtro: o import usa `a.get(campo, default)`, então chave a mais é ignorada.

**`weapons[]`**
- Campos: `name`, `category`, `level` ("0"–"3"), `dado` (base), `atributo`, `dano`, `acoes`, `efeito`, `mystic`.
- `dado_total` e `acerto` são recalculados na exibição.

**Defaults** (quando o campo falta)

| Campo | Default |
|---|---|
| Saúde, Stamina | 10 |
| Éter | 5 |
| Evasão | 10 |
| Ar | 0 |
| Movimento | 9 |
| Atributos | 10 |
| `prof_*` | 0 |
| `craft_attr` | `intelligence` |
| CR | 1 |
| XP | 50 |
| tipo / tamanho | Humanoide / Médio |
| `action_cost` | 1 |
| `damage_type` | Cortante |
| `range_meters` | 1,5 |

## 3. O que mudou do pack v8 (o descrito no CLAUDE.md do site) para o v10
- **CR fracionário:** a coluna é REAL e `parse_cr` aceita `0.5`, `"0,5"` e `"1/2"`. Os inteiros continuam inteiros.
- **`region`** é coluna nova em monstros e NPCs.
- **NPC ganhou `challenge_rating`.**
- O resto do contrato é o mesmo do v8: endpoints, filtro de chave desconhecida, `prof_*` 1:1 com as 22 perícias,
  `craft_attr`.
- O export da ficha do site (`type: "npc"`, ver `14-ficha-digital.md`) segue compatível. Pode mandar `region` se
  quiser.

## 4. ⚠️ Divergências e limites
- **O nível de arma diverge do Notion.** O `scale_weapon()` do Bestiário soma **+2N ao Acerto** por nível
  (o README e o `main.js` também dizem "+2 Acerto"). O Notion (Sistema > Nível de Armas) diz **+N ao atacar**.
  - Até o Pedro corrigir o app, ficha nova que já tenha o bônus calculado usa `level: "0"`, com os dados somados no
    `dado` e o bônus no Atacar.
- **Não há mecânica de chefe no schema:** nem fases, nem ações lendárias, nem turnos extras, nem reações extras.
  - Chefe se escreve em `abilities[]` (passivas com `is_passive: 1` e reações com `is_reaction: 1`) e em
    `description`.
  - Precedente no banco: o Dragão de Raízes (fases como monstros separados) e o Bruto da Vanguarda (gatilho a 50%
    como reação `1/Combate`).
- **A escala de CR do banco é solta.** O Dragão de Raízes, Fase 1, é CR 8 com 200 de Saúde e 50 de XP; o Orc da
  Floresta é CR 3 com 75 de Saúde e 150 de XP. Não use o banco como régua de CR, só como precedente de formato.

## 5. Exemplo mínimo válido
```json
{"type": "monster", "name": "Exemplo", "challenge_rating": 1, "health_max": 20, "evasion": 12,
 "strength": 14, "prof_attack": 2,
 "weapons": [{"name": "Clava", "category": "Leve Contundente", "level": "0", "dado": "1d6",
              "atributo": "Destreza", "dano": "Contundente", "acoes": "Atacar(1)", "efeito": "Desorientar",
              "mystic": false}],
 "abilities": [{"name": "Golpe", "description": "…", "action_cost": 1, "damage_dice": "1d6", "damage_bonus": "+2"}]}
```

## 6. Validar sem rodar o app
Copie `data/bestiary.db` para uma pasta temporária e reproduza o `insert_creature()`:
- filtre pelas colunas do `PRAGMA table_info`;
- grave `weapons` como texto JSON;
- grave as habilidades nos 17 campos acima.

Assim foi validado `../bestiario/vorn-clone-de-seiva.json` (0 chaves ignoradas, 10 habilidades gravadas).
