#!/usr/bin/env python3
# Gerador do Bazar Khalkaria -> pages/bazar.html
# Uso: python3 gerar_bazar.py [caminho_csv] [caminho_saida_html]
import csv, json, sys, os, re, unicodedata

CSV = sys.argv[1] if len(sys.argv) > 1 else 'Bazar_Khalkaria_v25.csv'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'site_v24/Khalkaria_Html-main/pages/bazar.html'

rows = list(csv.DictReader(open(CSV, encoding='utf-8')))

CATEGORIAS = ['Arma','Armadura','Escudo','Consumível','Munição','Bugiganga','Item Mágico','Material','Lixo']
# Raridades reordenadas: Lixo PRIMEIRO
RARIDADES = ['Lixo','Ordinário','Incomum','Exótico','Luxária']
CRAFTS = ['Ferraria','Engenharia','Alquimia','Não-craftável']

items = []
for r in rows:
    efeito = (r.get('Efeito_Jogador','') or '').strip() or (r.get('Efeito','') or '').strip()
    tags = (r.get('Tags','') or '').strip()
    busca = ' '.join([r['Nome'], r['Categoria'], r['Raridade'], r.get('Tipo de Craft',''), tags, efeito]).lower()
    items.append({
        'nome': r['Nome'], 'categoria': r['Categoria'], 'raridade': r['Raridade'],
        'efeito': efeito, 'valor': (r.get('Valor (Sins)','') or '').strip(),
        'obtencao': (r.get('Obtenção','') or '').strip(), 'craft': (r.get('Tipo de Craft','') or '').strip(),
        'ingredientes': (r.get('Ingredientes','') or '').strip(), 'busca': busca,
    })

data_json = json.dumps(items, ensure_ascii=False)

SIDEBAR = '''        <nav class="sidebar">
            <div class="sidebar-header">
                <a href="../index.html" class="sidebar-logo">Khalkaria</a>
                <div class="sidebar-subtitle">Sistema de Regras</div>
                <div class="sidebar-ornament"><span>◆</span></div>
            </div>
            <div class="nav-section">
                <div class="nav-section-title">Fundamentos</div>
                <a href="../index.html" class="nav-link">🏠 Início</a>
                <a href="sistema.html" class="nav-link">📜 Sistema Base</a>
                <a href="condicoes.html" class="nav-link">⚡ Condições</a>
                <a href="magias.html" class="nav-link">✨ Magias</a>
                <a href="bazar.html" class="nav-link active">💰 O Bazar</a>
            </div>
            <div class="nav-section">
                <div class="nav-section-title">Criação de Personagem</div>
                <a href="criacao.html" class="nav-link">🎭 Criação</a>
                <a href="racas.html" class="nav-link">👤 Raças</a>
                <a href="classes.html" class="nav-link">⚔️ Classes</a>
                <a href="origens.html" class="nav-link">📜 Origens</a>
                <a href="limiar.html" class="nav-link">🌟 O Limiar</a>
            </div>
            <div class="nav-section">
                <div class="nav-section-title">Classes</div>
                <a href="classes/espadachim.html" class="nav-link nav-link-sub">⚔️ Espadachim</a>
                <a href="classes/monge.html" class="nav-link nav-link-sub">👊 Monge</a>
                <a href="classes/batedor.html" class="nav-link nav-link-sub">🏹 Batedor</a>
                <a href="classes/alquimista.html" class="nav-link nav-link-sub">⚗️ Alquimista</a>
                <a href="classes/teurgo.html" class="nav-link nav-link-sub">✨ Teurgo</a>
                <a href="classes/artilheiro.html" class="nav-link nav-link-sub">💥 Artilheiro</a>
                <a href="classes/brutalista.html" class="nav-link nav-link-sub">🪓 Brutalista</a>
            </div>
        </nav>'''

CSS = '''
    <style>
    body[data-no-rightbar] .main-content { margin-right: 0; max-width: none; }
    .bazar-topbar { display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; margin-bottom:0.5rem; }
    .bazar-controls { position: sticky; top: 0; z-index: 20; background: var(--bg-primary); padding: 1rem 0 0.75rem; border-bottom: 1px solid var(--border-color); margin-bottom: 1.25rem; }
    .bazar-search { width: 100%; padding: 0.7rem 1rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-family: var(--font-body); font-size: 1.05rem; }
    .bazar-search:focus { outline: none; border-color: var(--gold-dark); }
    .filter-row { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.75rem; align-items: center; }
    .filter-label { color: var(--text-muted); font-size: 0.8rem; font-family: var(--font-heading); text-transform: uppercase; letter-spacing: 0.05em; margin-right: 0.25rem; }
    .chip { padding: 0.3rem 0.7rem; background: var(--bg-tertiary,#1a1a24); border: 1px solid var(--border-color); border-radius: 999px; color: var(--text-secondary); cursor: pointer; font-size: 0.82rem; transition: var(--transition); user-select: none; }
    .chip:hover { border-color: var(--gold-dark); color: var(--text-primary); }
    .chip.active { background: var(--gold-dark); color: #15151f; border-color: var(--gold); font-weight: 600; }
    .view-toggle { display:flex; gap:0.3rem; }
    .view-btn { padding:0.4rem 0.7rem; background:var(--bg-card); border:1px solid var(--border-color); border-radius:6px; color:var(--text-secondary); cursor:pointer; font-size:0.85rem; }
    .view-btn.active { background:var(--gold-dark); color:#15151f; border-color:var(--gold); }
    .bazar-count { color: var(--text-muted); font-size: 0.85rem; margin: 0.5rem 0 1rem; }
    /* GRID (cards) */
    .bazar-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }
    .item-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.1rem 1.2rem; border-left: 4px solid var(--gold-dark); display: flex; flex-direction: column; gap: 0.5rem; }
    .item-head { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem; }
    .item-name { color: var(--gold); font-family: var(--font-heading); font-size: 1.1rem; font-weight: 600; }
    .item-cat { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; }
    .item-rar { display: inline-block; font-size: 0.72rem; padding: 0.12rem 0.5rem; border-radius: 4px; font-family: var(--font-heading); align-self: flex-start; }
    .rar-Ordinário { background: #2a2a35; color: #b8b5ad; } .rar-Incomum { background: #1e3a2a; color: #6ee7a0; }
    .rar-Exótico { background: #2a1e4a; color: #c084fc; } .rar-Luxária { background: #4a3a1e; color: #f4d03f; }
    .rar-Lixo { background: #2a1a1a; color: #8b6b6b; }
    .rb-Ordinário { border-left-color:#6b6560; } .rb-Incomum { border-left-color:#2d5a3d; }
    .rb-Exótico { border-left-color:#6d4aa0; } .rb-Luxária { border-left-color:var(--gold); } .rb-Lixo { border-left-color:#5a3535; }
    .item-efeito { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.45; }
    .item-meta { display: flex; flex-wrap: wrap; gap: 0.3rem 1rem; margin-top: 0.25rem; font-size: 0.82rem; color: var(--text-muted); }
    .item-meta b { color: var(--text-secondary); }
    .item-craft { font-size: 0.82rem; color: var(--text-muted); }
    .item-craft .ing { color: var(--gold-light); font-family: monospace; }
    .craft-Ferraria { color:#d99; } .craft-Engenharia { color:#9bd; } .craft-Alquimia { color:#9d9; }
    .item-card.hl { box-shadow: 0 0 0 2px var(--gold); }
    /* LISTA */
    .bazar-list { display:flex; flex-direction:column; gap:0.3rem; }
    .list-row { display:grid; grid-template-columns: 1.6fr 0.7fr 0.7fr 2.4fr 0.7fr; gap:0.75rem; align-items:center; padding:0.6rem 0.9rem; background:var(--bg-card); border:1px solid var(--border-color); border-left:3px solid var(--gold-dark); border-radius:6px; font-size:0.88rem; }
    .list-row .ln { color:var(--gold); font-family:var(--font-heading); font-weight:600; }
    .list-row .le { color:var(--text-secondary); }
    .list-row .lc, .list-row .lv { color:var(--text-muted); font-size:0.8rem; }
    .list-head { font-family:var(--font-heading); color:var(--text-muted); text-transform:uppercase; font-size:0.72rem; letter-spacing:0.05em; background:transparent; border:none; border-bottom:1px solid var(--border-color); border-radius:0; }
    .list-row.hl { box-shadow:0 0 0 2px var(--gold); }
    /* TELA CHEIA */
    body.bazar-full .sidebar { display:none; }
    body.bazar-full .main-content { margin-left:0; padding:2rem 3rem; }
    .no-results { text-align:center; color:var(--text-muted); padding:3rem; font-style:italic; }
    @media (max-width:700px){ .bazar-grid{ grid-template-columns:1fr; } .list-row{ grid-template-columns:1fr 1fr; } .list-row .le,.list-row .lv{ display:none; } }
    </style>'''

JS = '''
    <script>
    const ITEMS = __DATA__;
    const CATEGORIAS = __CATS__;
    const RARIDADES = __RARS__;
    const CRAFTS = __CRAFTS__;
    const state = { search:'', cat:null, rar:null, craft:null, view:'grid' };

    function esc(s){ const d=document.createElement('div'); d.textContent=s==null?'':s; return d.innerHTML; }
    function qs(name){ return new URLSearchParams(location.search).get(name); }

    function makeChips(containerId, values, key){
      const c=document.getElementById(containerId);
      values.forEach(function(v){
        const chip=document.createElement('span'); chip.className='chip'; chip.textContent=v;
        chip.onclick=function(){
          if(state[key]===v){ state[key]=null; chip.classList.remove('active'); }
          else { state[key]=v; [].forEach.call(c.querySelectorAll('.chip'),x=>x.classList.remove('active')); chip.classList.add('active'); }
          render();
        };
        c.appendChild(chip);
      });
    }

    function matches(it){
      if(state.cat && it.categoria!==state.cat) return false;
      if(state.rar && it.raridade!==state.rar) return false;
      if(state.craft && it.craft!==state.craft) return false;
      const terms=state.search.trim().toLowerCase().split(/\\s+/).filter(Boolean);
      if(terms.length && !terms.every(t=>it.busca.includes(t))) return false;
      return true;
    }

    function cardHTML(it, hl){
      let craft='';
      if(it.craft && it.craft!=='Não-craftável') craft='<div class="item-craft">🔨 <span class="craft-'+it.craft+'">'+esc(it.craft)+'</span>'+(it.ingredientes?' — <span class="ing">'+esc(it.ingredientes)+'</span>':'')+'</div>';
      else if(it.craft==='Não-craftável') craft='<div class="item-craft">✖ Não-craftável</div>';
      return '<div class="item-card rb-'+it.raridade+(hl?' hl':'')+'" data-n="'+esc(it.nome)+'">'+
        '<div class="item-head"><span class="item-name">'+esc(it.nome)+'</span><span class="item-cat">'+esc(it.categoria)+'</span></div>'+
        '<span class="item-rar rar-'+it.raridade+'">'+esc(it.raridade)+'</span>'+
        '<div class="item-efeito">'+esc(it.efeito)+'</div>'+
        '<div class="item-meta">'+(it.valor?'<span><b>Valor:</b> '+esc(it.valor)+' Sins</span>':'')+(it.obtencao?'<span><b>Obtenção:</b> '+esc(it.obtencao)+'</span>':'')+'</div>'+
        craft+'</div>';
    }
    function rowHTML(it, hl){
      return '<div class="list-row rb-'+it.raridade+(hl?' hl':'')+'" data-n="'+esc(it.nome)+'">'+
        '<span class="ln">'+esc(it.nome)+'</span>'+
        '<span class="item-rar rar-'+it.raridade+'">'+esc(it.raridade)+'</span>'+
        '<span class="lc">'+esc(it.categoria)+'</span>'+
        '<span class="le">'+esc(it.efeito)+'</span>'+
        '<span class="lv">'+esc(it.valor)+'</span></div>';
    }

    function render(){
      const hq=(qs('item')||'').toLowerCase();
      const filtered=ITEMS.filter(matches);
      document.getElementById('count').textContent=filtered.length+' de '+ITEMS.length+' itens';
      const grid=document.getElementById('grid');
      document.getElementById('noresults').style.display=filtered.length?'none':'block';
      if(state.view==='list'){
        grid.className='bazar-list';
        let h='<div class="list-row list-head"><span>Nome</span><span>Raridade</span><span>Categoria</span><span>Efeito</span><span>Valor</span></div>';
        h+=filtered.map(it=>rowHTML(it, hq && it.nome.toLowerCase()===hq)).join('');
        grid.innerHTML=h;
      } else {
        grid.className='bazar-grid';
        grid.innerHTML=filtered.map(it=>cardHTML(it, hq && it.nome.toLowerCase()===hq)).join('');
      }
      // rola até item destacado (cross-link)
      if(hq){ const el=grid.querySelector('.hl'); if(el) el.scrollIntoView({behavior:'smooth',block:'center'}); }
    }

    makeChips('cat-filters',CATEGORIAS,'cat');
    makeChips('rar-filters',RARIDADES,'rar');
    makeChips('craft-filters',CRAFTS,'craft');
    document.getElementById('search').addEventListener('input',e=>{state.search=e.target.value;render();});

    // Modos de visualização
    document.querySelectorAll('.view-btn').forEach(function(b){
      b.addEventListener('click',function(){
        document.querySelectorAll('.view-btn').forEach(x=>x.classList.remove('active'));
        this.classList.add('active');
        const v=this.dataset.view;
        if(v==='full'){ document.body.classList.toggle('bazar-full'); this.classList.toggle('active', document.body.classList.contains('bazar-full')); }
        else { state.view=v; render(); }
      });
    });

    // Parâmetros de URL: ?item=Nome (cross-link) e ?q=busca (mini-bazar)
    (function(){
      const item=qs('item'), q=qs('q');
      if(item){ state.search=item; document.getElementById('search').value=item; }
      else if(q){ state.search=q; document.getElementById('search').value=q; }
      render();
    })();
    </script>'''

JS = (JS.replace('__DATA__', data_json)
        .replace('__CATS__', json.dumps(CATEGORIAS, ensure_ascii=False))
        .replace('__RARS__', json.dumps(RARIDADES, ensure_ascii=False))
        .replace('__CRAFTS__', json.dumps(CRAFTS, ensure_ascii=False)))

HTML = '''<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>O Bazar - Khalkaria RPG</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=UnifrakturMaguntia&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">''' + CSS + '''
</head>
<body data-no-rightbar>
    <div class="app-container">
''' + SIDEBAR + '''
        <main class="main-content">
            <div class="bazar-topbar">
                <h1 style="margin:0;border:none;">💰 O Bazar</h1>
                <div class="view-toggle">
                    <button class="view-btn active" data-view="grid">▦ Cards</button>
                    <button class="view-btn" data-view="list">☰ Lista</button>
                    <button class="view-btn" data-view="full">⛶ Tela cheia</button>
                </div>
            </div>
            <p style="color:var(--text-secondary);margin-bottom:1rem;">581 itens de Kharavel. Busque por nome, efeito ou tipo; filtre por categoria, raridade e fabricação.</p>
            <div class="bazar-controls">
                <input type="text" id="search" class="bazar-search" placeholder="🔍 Buscar item, efeito, tipo... (ex: munição, fogo, cura)">
                <div class="filter-row" id="cat-filters"><span class="filter-label">Categoria</span></div>
                <div class="filter-row" id="rar-filters"><span class="filter-label">Raridade</span></div>
                <div class="filter-row" id="craft-filters"><span class="filter-label">Fabricação</span></div>
            </div>
            <div class="bazar-count" id="count"></div>
            <div class="bazar-grid" id="grid"></div>
            <div class="no-results" id="noresults" style="display:none;">Nenhum item encontrado com esses filtros.</div>
        </main>
    </div>''' + JS + '''
    <script src="../js/ficha.js"></script>
</body>
</html>'''

os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT,'w',encoding='utf-8').write(HTML)
print('bazar.html gerado:', len(items), 'itens ->', OUT)

# --- data/bazar.json para a Ficha Interativa (mesma fonte: o CSV) ---
# Projeção alinhada ao $defs/item de data/ficha.schema.json + id slug determinístico.
# NÃO altera o data_json embutido no bazar.html.
def _slug(nome):
    s = unicodedata.normalize('NFKD', nome).encode('ascii', 'ignore').decode()
    return 'item-' + re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

FICHA_KEYS = ('nome', 'categoria', 'raridade', 'efeito', 'valor', 'obtencao', 'craft', 'ingredientes')
_seen = {}
bazar_json = []
for it in items:
    sid = _slug(it['nome'])
    _seen[sid] = _seen.get(sid, 0) + 1
    if _seen[sid] > 1:
        sid = f'{sid}-{_seen[sid]}'   # desambigua nomes repetidos no catálogo
    bazar_json.append({'id': sid, **{k: it[k] for k in FICHA_KEYS}})

BJSON = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(OUT))), 'data', 'bazar.json')
os.makedirs(os.path.dirname(BJSON), exist_ok=True)
json.dump(bazar_json, open(BJSON, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('bazar.json gerado:', len(bazar_json), 'itens ->', BJSON)
