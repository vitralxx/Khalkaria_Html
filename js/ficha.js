/* Khalkaria — Ficha Interativa (MVP)
 * Drawer persistente (localStorage) + DnD/"+ Adicionar" das páginas de regras +
 * derivados calculados + Export/Import JSON + projeção para o Bestiário (type:npc).
 * Não é SPA: re-hidrata no DOMContentLoaded. Schema: data/ficha.schema.json.
 */
(function () {
  'use strict';
  var LS_KEY = 'khalkaria_ficha';
  var OPEN_KEY = 'khalkaria_ficha_open';
  var SCHEMA_VERSION = '1.0';

  // base do site relativo ao próprio ficha.js (…/js/ficha.js -> raiz).
  // currentScript é nulo em script inserido dinamicamente -> fallback por querySelector / global.
  var selfScript = document.currentScript || document.querySelector('script[src*="js/ficha.js"]');
  var selfSrc = selfScript ? selfScript.src : '';
  var ROOT = selfSrc ? new URL('../', selfSrc).href : (window.KF_ROOT || '');

  // ---- 22 perícias: [slug, rótulo, prof_bestiário, atributo p/ teste] ----
  var PERICIAS = [
    ['atacar','Atacar','prof_attack',''], ['defender','Defender','prof_defend',''],
    ['movimento','Movimento','prof_movement',''], ['fortitude','Fortitude','prof_fortitude','con'],
    ['vontade','Vontade','prof_will','sab'], ['reflexos','Reflexos','prof_reflexes','des'],
    ['percepcao','Percepção','prof_perception','sab'], ['sobrevivencia','Sobrevivência','prof_survival','sab'],
    ['furtividade','Furtividade','prof_stealth','des'], ['crime','Crime','prof_crime','des'],
    ['iniciativa','Iniciativa','prof_initiative','des'], ['conhecimento','Conhecimento','prof_knowledge','int'],
    ['medicina','Medicina','prof_medicine','int'], ['investigacao','Investigação','prof_investigation','int'],
    ['religiao','Religião','prof_religion','int'], ['mistico','Místico','prof_mystic','int'],
    ['convencimento','Convencimento','prof_persuasion','?'], ['intimidacao','Intimidação','prof_intimidation','?'],
    ['intuicao','Intuição','prof_insight','sab'], ['enganacao','Enganação','prof_deception','?'],
    ['motivar','Motivar','prof_motivate','sab'], ['oficio','Ofício(X)','prof_craft','oficio']
  ];
  var PROF_LEVELS = [0, 2, 4, 6, 8];
  var PROF_LABEL = {0:'Leigo',2:'Treinado',4:'Experiente',6:'Mestre',8:'Lendário'};
  var ATTRS = [['for','FOR'],['des','DES'],['con','CON'],['int','INT'],['sab','SAB']];
  var ATTR_BEST = {for:'strength',des:'dexterity',con:'constitution',int:'intelligence',sab:'wisdom'};
  var RESIST = [['ordinario','Ordinário'],['fogo','Fogo'],['frio','Frio'],['eletrico','Elétrico'],
    ['veneno','Veneno'],['acido','Ácido'],['psiquico','Psíquico'],['forca','Força'],
    ['radiante','Radiante'],['trovejante','Trovejante'],['necrotico','Necrótico'],['primordial','Primordial']];

  // ---------------- estado ----------------
  function novaFicha() {
    var f = {
      schemaVersion: SCHEMA_VERSION,
      meta: { nome:'', jogador:'', nivel:1, xp:0, raca:'', variante:'', classe:'', ramo:'', origem:'' },
      atributos: { for:10, des:10, con:10, int:10, sab:10 },
      pericias: {}, oficioAttr:'int',
      recursos: { saude:{atual:0,max:0}, stamina:{atual:0,max:0}, eter:{atual:0,max:0},
                  recursoClasse:{nome:'',atual:0,max:0} },
      derivadosManuais: { evasao:0, cd:0, movimento:9, armadura:0 },
      resistencias: {},
      inventario: { sins:0, equipamentos:[], bugigangas:[], materiais:[], armas:[] },
      tecnicas: [], grimorio: [], cartasLimiar: [], lore:{ historia:'', outros:'' }
    };
    PERICIAS.forEach(function (p) { f.pericias[p[0]] = 0; });
    RESIST.forEach(function (r) { f.resistencias[r[0]] = { R:false, I:false, ae:0 }; });
    return f;
  }

  var ficha = load();
  function load() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (raw) return migra(JSON.parse(raw));
    } catch (e) {}
    return novaFicha();
  }
  function migra(f) { var base = novaFicha(); return deepMerge(base, f); }
  function deepMerge(base, over) {
    if (typeof base !== 'object' || base === null || Array.isArray(base)) return over === undefined ? base : over;
    var out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    Object.keys(over || {}).forEach(function (k) {
      out[k] = (k in base) ? deepMerge(base[k], over[k]) : over[k];
    });
    return out;
  }
  var saveT;
  function save() { clearTimeout(saveT); saveT = setTimeout(function () {
    try { localStorage.setItem(LS_KEY, JSON.stringify(ficha)); } catch (e) {}
  }, 200); }

  // ---------------- derivados ----------------
  function mod(attr) { return Math.floor((ficha.atributos[attr] - 10) / 2); }
  function modStr(attr) { var m = mod(attr); return (m >= 0 ? '+' : '') + m; }
  function slotsEquipMax() { return 2 + mod('for'); }
  function slotsBugiMax() { return 10 + mod('for'); }
  function somaSlots(lista) {
    return lista.reduce(function (s, it) {
      var q = it.qtd || 1, peso = (it.slotPeso != null) ? it.slotPeso : 1;
      return s + q * peso;
    }, 0);
  }

  // ---------------- util DOM ----------------
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k.slice(0,2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (k) { if (k != null) e.appendChild(typeof k === 'string' ? document.createTextNode(k) : k); });
    return e;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]; }); }

  // ---------------- entidades (payload de card) ----------------
  function slug(nome, pre) {
    var s = (nome || '').normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return (pre || '') + s;
  }
  function addEntidade(campo, ent) {
    var lista = ficha[campo];
    // evita duplicar mesmo id
    if (ent.id && lista.some(function (x) { return x.id === ent.id; })) { toast(ent.nome + ' já está na ficha'); return; }
    lista.push(ent); save(); renderListas(); toast('+ ' + ent.nome);
  }

  // ---------------- toast ----------------
  var toastT;
  function toast(msg) {
    var t = document.getElementById('kf-toast');
    if (!t) { t = el('div', { id:'kf-toast' }); document.body.appendChild(t); }
    t.textContent = msg; t.className = 'kf-show';
    clearTimeout(toastT); toastT = setTimeout(function () { t.className = ''; }, 1600);
  }

  // ---------------- CSS ----------------
  function injectCSS() {
    if (document.getElementById('kf-css')) return;
    var css = document.createElement('style'); css.id = 'kf-css';
    css.textContent = [
      '#kf-toggle{position:fixed;right:0;top:40%;z-index:99998;background:#1a1a22;color:#d4af37;border:1px solid #d4af37;border-right:none;border-radius:8px 0 0 8px;padding:10px 8px;cursor:pointer;font-family:Cinzel,serif;font-size:12px;letter-spacing:1px;writing-mode:vertical-rl;text-orientation:mixed;box-shadow:-2px 2px 12px rgba(0,0,0,.4)}',
      '#kf-toggle:hover{background:#24242e}',
      '#kf-drawer{position:fixed;top:0;right:0;height:100vh;width:420px;max-width:92vw;z-index:99999;background:#12121a;border-left:1px solid #2a2a35;box-shadow:-6px 0 24px rgba(0,0,0,.5);transform:translateX(100%);transition:transform .25s ease;display:flex;flex-direction:column;font-family:"Crimson Text",Georgia,serif;color:#d8d4cc}',
      '#kf-drawer.kf-open{transform:translateX(0)}',
      '#kf-head{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid #2a2a35;background:#0d0d14}',
      '#kf-head h2{font-family:Cinzel,serif;font-size:15px;color:#d4af37;margin:0;flex:1}',
      '#kf-body{overflow-y:auto;padding:10px 14px 40px;flex:1}',
      '.kf-sec{border:1px solid #2a2a35;border-radius:8px;margin-bottom:10px;overflow:hidden}',
      '.kf-sec>h3{font-family:Cinzel,serif;font-size:12px;letter-spacing:1px;color:#c9a94a;background:#1a1a22;margin:0;padding:9px 12px;cursor:pointer;display:flex;justify-content:space-between}',
      '.kf-sec>.kf-secbody{padding:10px 12px;display:block}',
      '.kf-sec.kf-collapsed>.kf-secbody{display:none}',
      '.kf-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;align-items:center}',
      '.kf-row label{font-size:12px;color:#9a968e;min-width:64px}',
      '.kf-drawer input,.kf-drawer select,#kf-drawer input,#kf-drawer select,#kf-drawer textarea{background:#0d0d14;border:1px solid #2a2a35;color:#e6e2da;border-radius:5px;padding:4px 6px;font-size:13px;font-family:inherit}',
      '#kf-drawer input[type=number]{width:56px}',
      '#kf-drawer input[type=text]{flex:1;min-width:60px}',
      '.kf-attrs{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;text-align:center}',
      '.kf-attrs .kf-a label{display:block;font-size:11px;color:#c9a94a;min-width:0}',
      '.kf-attrs .kf-a input{width:100%;text-align:center}',
      '.kf-attrs .kf-mod{font-size:12px;color:#7dcea0;margin-top:2px}',
      '.kf-per{display:flex;align-items:center;gap:6px;font-size:12px;margin-bottom:3px}',
      '.kf-per span{flex:1}',
      '.kf-per select{width:96px}',
      '.kf-res{display:grid;grid-template-columns:1fr auto auto 46px;gap:3px 8px;font-size:12px;align-items:center}',
      '.kf-res .kf-rh{color:#9a968e;font-size:10px;text-align:center}',
      '#kf-drawer .kf-res input[type=number]{width:42px;padding:2px 4px}',
      '.kf-list-item{display:flex;gap:6px;align-items:flex-start;font-size:12px;padding:4px 6px;border:1px solid #23232d;border-radius:5px;margin-bottom:4px;background:#0d0d14}',
      '.kf-list-item .kf-x{color:#c0392b;cursor:pointer;font-weight:bold;flex-shrink:0}',
      '.kf-list-item .kf-nm{flex:1}',
      '.kf-tag{font-size:9px;color:#8a8a8a;border:1px solid #2a2a35;border-radius:3px;padding:0 4px;margin-right:4px;text-transform:uppercase}',
      '.kf-btn{background:#1a1a22;color:#d4af37;border:1px solid #d4af37;border-radius:5px;padding:5px 10px;cursor:pointer;font-size:12px;font-family:Cinzel,serif}',
      '.kf-btn:hover{background:#24242e}.kf-btn.sm{padding:2px 7px;font-size:11px}',
      '.kf-derdisp{display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;font-size:12px}',
      '.kf-derdisp b{color:#d4af37}',
      '.kf-warn{color:#e67e22}.kf-ok{color:#7dcea0}',
      '.kf-drop{border:1px dashed #3a3a45;border-radius:6px;padding:8px;text-align:center;font-size:11px;color:#7a766e;margin-bottom:6px}',
      '.kf-drop.kf-over{border-color:#d4af37;color:#d4af37;background:rgba(212,175,55,.06)}',
      '#kf-toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(20px);background:#1a1a22;color:#d4af37;border:1px solid #d4af37;border-radius:6px;padding:8px 16px;z-index:100000;opacity:0;transition:all .2s;font-family:Cinzel,serif;font-size:13px;pointer-events:none}',
      '#kf-toast.kf-show{opacity:1;transform:translateX(-50%) translateY(0)}',
      '.kf-addbtn{display:inline-block;margin-left:8px;background:rgba(212,175,55,.12);color:#d4af37;border:1px solid rgba(212,175,55,.4);border-radius:4px;padding:1px 7px;cursor:pointer;font-size:11px;font-family:Cinzel,serif;vertical-align:middle;user-select:none}',
      '.kf-addbtn:hover{background:rgba(212,175,55,.25)}',
      '.kf-draggable{cursor:grab}'
    ].join('\n');
    document.head.appendChild(css);
  }

  // ---------------- drawer ----------------
  var drawer, body;
  function setOpen(b) {
    drawer.classList.toggle('kf-open', b);
    try { localStorage.setItem(OPEN_KEY, b ? '1' : '0'); } catch (e) {}
  }
  function buildDrawer() {
    var toggle = el('button', { id:'kf-toggle', title:'Ficha de Personagem',
      onclick: function () { setOpen(!drawer.classList.contains('kf-open')); } }, ['📋 FICHA']);
    document.body.appendChild(toggle);

    drawer = el('div', { id:'kf-drawer', class:'kf-drawer' });
    var head = el('div', { id:'kf-head' }, [
      el('h2', {}, ['Ficha']),
      el('button', { class:'kf-btn sm', title:'Exportar JSON', onclick: exportJSON }, ['⬇ JSON']),
      el('button', { class:'kf-btn sm', title:'Importar JSON', onclick: importJSON }, ['⬆']),
      el('button', { class:'kf-btn sm', title:'Exportar p/ Bestiário', onclick: exportBestiario }, ['🐲']),
      el('button', { class:'kf-btn sm', title:'Nova ficha', onclick: resetFicha }, ['✦']),
      el('button', { class:'kf-btn sm', title:'Fechar', onclick: function () { setOpen(false); } }, ['✕'])
    ]);
    body = el('div', { id:'kf-body' });
    drawer.appendChild(head); drawer.appendChild(body);
    document.body.appendChild(drawer);
    renderAll();
    // re-hidrata estado aberto/fechado entre páginas (sem animar na carga)
    if (localStorage.getItem(OPEN_KEY) === '1') {
      var prev = drawer.style.transition; drawer.style.transition = 'none';
      drawer.classList.add('kf-open');
      requestAnimationFrame(function () { drawer.style.transition = prev; });
    }
  }

  function sec(titulo, conteudo, collapsed) {
    var b = el('div', { class:'kf-secbody' }, conteudo);
    var s = el('div', { class:'kf-sec' + (collapsed ? ' kf-collapsed' : '') }, [
      el('h3', { onclick: function () { s.classList.toggle('kf-collapsed'); } }, [titulo, el('span', {}, ['▾'])]),
      b
    ]);
    return s;
  }

  function txt(label, obj, key, type) {
    var inp = el('input', { type: type || 'text', value: obj[key] });
    inp.addEventListener('input', function () {
      obj[key] = (type === 'number') ? (parseFloat(inp.value) || 0) : inp.value;
      save(); refreshDerivados();
    });
    return el('div', { class:'kf-row' }, [label ? el('label', {}, [label]) : null, inp]);
  }

  function renderAll() {
    body.innerHTML = '';
    // NÚCLEO
    body.appendChild(sec('▐ Identidade', [
      txt('Nome', ficha.meta, 'nome'), txt('Jogador', ficha.meta, 'jogador'),
      el('div', { class:'kf-row' }, [
        el('label', {}, ['Nível']), numInput(ficha.meta, 'nivel'),
        el('label', {}, ['XP']), numInput(ficha.meta, 'xp')
      ]),
      txt('Raça', ficha.meta, 'raca'), txt('Variante', ficha.meta, 'variante'),
      txt('Classe', ficha.meta, 'classe'), txt('Ramo', ficha.meta, 'ramo'),
      txt('Origem', ficha.meta, 'origem')
    ]));
    body.appendChild(sec('▐ Atributos', [renderAtributos()]));
    body.appendChild(sec('▐ Perícias', [renderPericias()], true));
    body.appendChild(sec('▐ Recursos', renderRecursos()));
    body.appendChild(sec('▐ Derivados', [renderDerivados()]));
    body.appendChild(sec('▐ Resistências', [renderResist()], true));
    body.appendChild(sec('▐ Inventário', renderInventario(), true));
    // listas por DnD/+add
    body.appendChild(sec('▐ Técnicas & Marcas', [dropZone('tecnicas','Arraste técnicas/marcas aqui'), listaEl('tecnicas')]));
    body.appendChild(sec('▐ Grimório (Magias)', [dropZone('grimorio','Arraste magias aqui'), listaEl('grimorio')]));
    body.appendChild(sec('▐ Cartas do Limiar', [dropZone('cartasLimiar','Arraste cartas do Limiar aqui'), listaEl('cartasLimiar')]));
    body.appendChild(sec('▐ Lore', [
      el('div',{class:'kf-row'},[el('label',{},['História'])]),
      areaInput(ficha.lore,'historia'),
      el('div',{class:'kf-row'},[el('label',{},['Outros'])]),
      areaInput(ficha.lore,'outros')
    ], true));
  }

  function numInput(obj, key) {
    var inp = el('input', { type:'number', value: obj[key] });
    inp.addEventListener('input', function () { obj[key] = parseFloat(inp.value) || 0; save(); refreshDerivados(); });
    return inp;
  }
  function areaInput(obj, key) {
    var ta = el('textarea', { rows:3, style:'width:100%' }); ta.value = obj[key] || '';
    ta.addEventListener('input', function () { obj[key] = ta.value; save(); });
    return ta;
  }

  function renderAtributos() {
    var grid = el('div', { class:'kf-attrs' });
    ATTRS.forEach(function (a) {
      var inp = el('input', { type:'number', min:1, max:30, value: ficha.atributos[a[0]] });
      var modEl = el('div', { class:'kf-mod' }, [modStr(a[0])]);
      inp.addEventListener('input', function () {
        ficha.atributos[a[0]] = parseInt(inp.value, 10) || 0; save();
        modEl.textContent = modStr(a[0]); refreshDerivados();
      });
      grid.appendChild(el('div', { class:'kf-a' }, [el('label', {}, [a[1]]), inp, modEl]));
    });
    return grid;
  }

  function renderPericias() {
    var wrap = el('div', {});
    PERICIAS.forEach(function (p) {
      var selv = ficha.pericias[p[0]];
      var opts = PROF_LEVELS.map(function (lv) {
        return el('option', { value: lv, selected: lv === selv ? '' : null }, ['+' + lv + ' ' + PROF_LABEL[lv]]);
      });
      var sel = el('select', {}, opts);
      sel.addEventListener('change', function () { ficha.pericias[p[0]] = parseInt(sel.value, 10); save(); });
      var linha = el('div', { class:'kf-per' }, [el('span', {}, [p[1]]), sel]);
      if (p[0] === 'oficio') {
        var oa = el('select', { style:'width:56px' }, ATTRS.map(function (a) {
          return el('option', { value:a[0], selected: a[0]===ficha.oficioAttr?'':null }, [a[1]]); }));
        oa.addEventListener('change', function () { ficha.oficioAttr = oa.value; save(); });
        linha.appendChild(oa);
      }
      wrap.appendChild(linha);
    });
    return wrap;
  }

  function recRow(label, r) {
    var a = numInput(r, 'atual'), m = numInput(r, 'max');
    return el('div', { class:'kf-row' }, [el('label', {}, [label]), a, el('span',{style:'color:#666'},['/']), m]);
  }
  function renderRecursos() {
    return [
      recRow('Saúde', ficha.recursos.saude),
      recRow('Stamina', ficha.recursos.stamina),
      recRow('Éter', ficha.recursos.eter),
      el('div', { class:'kf-row' }, [
        el('label', {}, ['Rec. Classe']),
        (function(){ var i=el('input',{type:'text',value:ficha.recursos.recursoClasse.nome,placeholder:'ex: FLUXO'});
          i.addEventListener('input',function(){ficha.recursos.recursoClasse.nome=i.value;save();});return i;})()
      ]),
      recRow('  ↳ valor', ficha.recursos.recursoClasse)
    ];
  }

  var derdispEl;
  function renderDerivados() {
    var wrap = el('div', {});
    // manuais (vêm da classe/regras)
    wrap.appendChild(el('div', { class:'kf-row' }, [
      el('label', {}, ['Evasão']), numInput(ficha.derivadosManuais, 'evasao'),
      el('label', {}, ['CD']), numInput(ficha.derivadosManuais, 'cd')
    ]));
    wrap.appendChild(el('div', { class:'kf-row' }, [
      el('label', {}, ['Movim.(m)']), numInput(ficha.derivadosManuais, 'movimento'),
      el('label', {}, ['Armadura']), numInput(ficha.derivadosManuais, 'armadura')
    ]));
    wrap.appendChild(el('div', { class:'kf-row', style:'font-size:10px;color:#666' },
      ['Evasão/CD/Movim. vêm da sua classe — preencha manualmente.']));
    derdispEl = el('div', { class:'kf-derdisp' });
    wrap.appendChild(derdispEl);
    refreshDerivados();
    return wrap;
  }
  function refreshDerivados() {
    if (!derdispEl) return;
    var ue = somaSlots(ficha.inventario.equipamentos.concat(ficha.inventario.armas));
    var ub = somaSlots(ficha.inventario.bugigangas);
    var ce = slotsEquipMax(), cb = slotsBugiMax();
    var spe = ue > ce, spb = ub > cb;
    derdispEl.innerHTML =
      '<div>Mods</div><div><b>' + ATTRS.map(function(a){return a[1]+' '+modStr(a[0]);}).join(' · ') + '</b></div>' +
      '<div>Equip.</div><div class="'+(spe?'kf-warn':'kf-ok')+'">'+ue+' / '+ce+(spe?' ⚠ Sobrepeso':'')+'</div>' +
      '<div>Bugigangas</div><div class="'+(spb?'kf-warn':'kf-ok')+'">'+ub+' / '+cb+(spb?' ⚠ Sobrepeso':'')+'</div>';
  }

  function renderResist() {
    var grid = el('div', { class:'kf-res' });
    grid.appendChild(el('div', {}));
    grid.appendChild(el('div', { class:'kf-rh', title:'Resistência' }, ['R']));
    grid.appendChild(el('div', { class:'kf-rh', title:'Imunidade' }, ['I']));
    grid.appendChild(el('div', { class:'kf-rh', title:'Armadura Específica' }, ['Ae']));
    RESIST.forEach(function (r) {
      grid.appendChild(el('div', {}, [r[1]]));
      ['R','I'].forEach(function (k) {
        var cb = el('input', { type:'checkbox' }); cb.checked = ficha.resistencias[r[0]][k];
        cb.addEventListener('change', function () { ficha.resistencias[r[0]][k] = cb.checked; save(); });
        grid.appendChild(cb);
      });
      var ae = el('input', { type:'number', value: ficha.resistencias[r[0]].ae || 0, title:'Ae ' + r[1] });
      ae.addEventListener('input', function () { ficha.resistencias[r[0]].ae = parseInt(ae.value, 10) || 0; save(); });
      grid.appendChild(ae);
    });
    return grid;
  }

  function renderInventario() {
    var sinsRow = el('div', { class:'kf-row' }, [el('label', {}, ['💰 Sins']), numInput(ficha.inventario, 'sins')]);
    var busca = el('input', { type:'text', placeholder:'Buscar item do Bazar…' });
    var res = el('div', {});
    busca.addEventListener('input', function () { buscaBazar(busca.value, res); });
    return [
      sinsRow,
      el('div', { class:'kf-row' }, [busca]),
      res,
      dropZone('inventario.bugigangas', 'Arraste itens do Bazar aqui'),
      el('div', { style:'font-size:11px;color:#c9a94a;margin:6px 0 2px' }, ['Armas']), listaEl('inventario.armas'),
      el('div', { style:'font-size:11px;color:#c9a94a;margin:6px 0 2px' }, ['Equipamentos']), listaEl('inventario.equipamentos'),
      el('div', { style:'font-size:11px;color:#c9a94a;margin:6px 0 2px' }, ['Bugigangas']), listaEl('inventario.bugigangas'),
      el('div', { style:'font-size:11px;color:#c9a94a;margin:6px 0 2px' }, ['Materiais']), listaEl('inventario.materiais')
    ];
  }

  // ---- listas (suporta caminho aninhado inventario.x) ----
  function getLista(campo) {
    if (campo.indexOf('.') > 0) { var p = campo.split('.'); return ficha[p[0]][p[1]]; }
    return ficha[campo];
  }
  function listaEl(campo) {
    var wrap = el('div', { 'data-lista': campo });
    getLista(campo).forEach(function (item, i) {
      wrap.appendChild(el('div', { class:'kf-list-item' }, [
        el('span', { class:'kf-x', title:'Remover', onclick: function () {
          getLista(campo).splice(i, 1); save(); renderListas(); refreshDerivados(); } }, ['✕']),
        el('span', { class:'kf-nm', html: (item.tipo ? '<span class="kf-tag">'+esc(item.tipo)+'</span>' : '') + esc(item.nome) })
      ]));
    });
    return wrap;
  }
  function renderListas() {
    ['tecnicas','grimorio','cartasLimiar','inventario.armas','inventario.equipamentos',
     'inventario.bugigangas','inventario.materiais'].forEach(function (campo) {
      var holder = body.querySelector('[data-lista="' + campo + '"]');
      if (holder) { var novo = listaEl(campo); holder.parentNode.replaceChild(novo, holder); }
    });
  }

  function dropZone(campo, texto) {
    var dz = el('div', { class:'kf-drop', 'data-drop': campo }, [texto]);
    dz.addEventListener('dragover', function (e) { e.preventDefault(); dz.classList.add('kf-over'); });
    dz.addEventListener('dragleave', function () { dz.classList.remove('kf-over'); });
    dz.addEventListener('drop', function (e) {
      e.preventDefault(); dz.classList.remove('kf-over');
      try {
        var p = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (p._bazar) { addItemBazar(p.item); return; }
        var campoAlvo = p._campo || campo;      // roteia pelo tipo, não pela zona
        var ent = Object.assign({}, p); delete ent._campo; delete ent._bazar;
        addEntidade(campoAlvo, ent);
      } catch (x) {}
    });
    return dz;
  }

  // ---------------- Bazar (data/bazar.json) ----------------
  var bazarCache = null;
  function buscaBazar(q, res) {
    q = (q || '').trim().toLowerCase();
    res.innerHTML = '';
    if (q.length < 2) return;
    function achar() {
      var hits = bazarCache.filter(function (it) {
        return (it.nome + ' ' + it.categoria + ' ' + it.raridade + ' ' + it.efeito).toLowerCase().indexOf(q) >= 0;
      }).slice(0, 12);
      hits.forEach(function (it) {
        res.appendChild(el('div', { class:'kf-list-item' }, [
          el('span', { class:'kf-btn sm', onclick: function () { addItemBazar(it); } }, ['+']),
          el('span', { class:'kf-nm', html: esc(it.nome) + ' <span style="color:#777">· ' + esc(it.raridade) + ' · ' + esc(it.valor) + ' Sins</span>' })
        ]));
      });
      if (!hits.length) res.appendChild(el('div', { style:'font-size:11px;color:#666' }, ['Nada encontrado']));
    }
    if (bazarCache) return achar();
    fetch(ROOT + 'data/bazar.json').then(function (r) { return r.json(); })
      .then(function (d) { bazarCache = d; achar(); })
      .catch(function () { res.appendChild(el('div', { style:'font-size:11px;color:#c0392b' }, ['Bazar indisponível (rode via servidor)'])); });
  }
  function addItemBazar(it) {
    var cat = (it.categoria || '').toLowerCase();
    var campo = 'inventario.bugigangas';
    if (cat.indexOf('arma') >= 0) campo = 'inventario.armas';
    else if (cat.indexOf('material') >= 0) campo = 'inventario.materiais';
    else if (/armadura|escudo|equip/.test(cat)) campo = 'inventario.equipamentos';
    var lista = getLista(campo);
    var ent = { id: it.id, nome: it.nome, tipo: it.categoria, categoria: it.categoria,
      raridade: it.raridade, efeito: it.efeito, valor: it.valor, qtd: 1, slotPeso: 1 };
    lista.push(ent); save(); renderListas(); refreshDerivados(); toast('+ ' + it.nome);
  }

  // ---------------- decorar cards das páginas ----------------
  function textoLimpo(node) {
    if (!node) return '';
    var c = node.cloneNode(true);
    c.querySelectorAll('.icon,.cat-icon,.category-icon,.toggle-icon,.kf-addbtn,.spell-dot,.spell-toggle,svg').forEach(function (x) { x.remove(); });
    return c.textContent
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{FE00}-\u{FE0F}\u{DC00}-\u{DFFF}]/gu, '')
      .replace(/\+\s*ficha/g, '').replace(/\s+/g, ' ').trim();
  }
  function q1(card, sels) {
    var arr = sels.split(',');
    for (var i = 0; i < arr.length; i++) { var n = card.querySelector(arr[i].trim()); if (n) return n; }
    return null;
  }
  // [seletor, campoFicha, tipo, seletorNome]
  var MAPA = [
    ['.spell-card', 'grimorio', 'magia', 'h4'],
    ['.technique-card', 'tecnicas', 'tecnica', 'h4,h5'],
    ['.tier-technique', 'tecnicas', 'tecnica', 'h5'],
    ['.tech-card', 'tecnicas', 'tecnica', 'h4,h5'],
    ['.ultimate-card', 'tecnicas', 'ultimate', 'h5'],
    ['.marca-card', 'tecnicas', 'marca', 'h5'],
    ['.trait-card', 'tecnicas', 'traço', 'h4,h5'],
    ['.variant-card', 'tecnicas', 'variante', 'h4,h5'],
    ['.variant-physical', 'tecnicas', 'variante', 'h4,h5'],
    ['.subspecie-card', 'tecnicas', 'subespécie', 'h4,h5'],
    ['.origem-card', 'tecnicas', 'origem', 'h3'],
    ['.catalog-card', 'cartasLimiar', 'carta', '.catalog-card-name'],
    ['.dor-card', 'cartasLimiar', 'dor', '.dor-card-title'],
    ['.beneficio-abismo-card', 'cartasLimiar', 'abismo', '.dor-card-title']
  ];
  function decorar() {
    MAPA.forEach(function (m) {
      document.querySelectorAll(m[0]).forEach(function (card) {
        if (card.getAttribute('data-kf')) return;
        var nomeNode = q1(card, m[3]);
        var nome = textoLimpo(nomeNode);
        if (!nome) return;
        card.setAttribute('data-kf', '1');
        var descNode = q1(card, '.spell-desc,.dor-card-desc,.catalog-card-effect,.habilidade-box,p:not(.meta):not(.flavor):not(.quote)');
        var ent = { id: slug(nome, m[2] + '-'), tipo: m[2], nome: nome,
          descricao: descNode ? textoLimpo(descNode) : '' };
        var btn = el('span', { class:'kf-addbtn', title:'Adicionar à ficha',
          onclick: function (e) { e.stopPropagation(); e.preventDefault(); addEntidade(m[1], ent); } }, ['+ ficha']);
        (nomeNode || card).appendChild(btn);
        card.setAttribute('draggable', 'true'); card.classList.add('kf-draggable');
        card.addEventListener('dragstart', function (e) {
          e.dataTransfer.setData('text/plain', JSON.stringify(Object.assign({ _campo: m[1] }, ent))); });
      });
    });
    decorarBazar();
  }

  // itens do Bazar (bazar.html) — renderizados dinamicamente: .item-card[data-n]
  function decorarBazar() {
    var itens = document.querySelectorAll('.item-card[data-n]:not([data-kf])');
    if (!itens.length) return;
    function aplica() {
      itens.forEach(function (card) {
        if (card.getAttribute('data-kf')) return;
        var nome = card.getAttribute('data-n');
        var it = bazarCache ? bazarCache.find(function (x) { return x.nome === nome; }) : null;
        if (!it) it = { id: slug(nome, 'item-'), nome: nome, categoria:'', raridade:'', efeito:'', valor:'' };
        card.setAttribute('data-kf', '1');
        var alvo = card.querySelector('.item-name,.item-head') || card;
        alvo.appendChild(el('span', { class:'kf-addbtn', title:'Adicionar à ficha',
          onclick: function (e) { e.stopPropagation(); addItemBazar(it); } }, ['+ ficha']));
        card.setAttribute('draggable', 'true'); card.classList.add('kf-draggable');
        card.addEventListener('dragstart', function (e) {
          e.dataTransfer.setData('text/plain', JSON.stringify({ _bazar: true, item: it })); });
      });
    }
    if (bazarCache) return aplica();
    fetch(ROOT + 'data/bazar.json').then(function (r) { return r.json(); })
      .then(function (d) { bazarCache = d; aplica(); }).catch(aplica);
  }

  // ---------------- Export / Import ----------------
  function baixar(nome, obj) {
    var blob = new Blob([JSON.stringify(obj, null, 2)], { type:'application/json' });
    var a = el('a', { href: URL.createObjectURL(blob), download: nome });
    document.body.appendChild(a); a.click(); a.remove();
  }
  function exportJSON() { baixar((ficha.meta.nome || 'ficha').replace(/\s+/g,'_') + '.khalkaria.json', ficha); }
  function importJSON() {
    var inp = el('input', { type:'file', accept:'.json,application/json' });
    inp.addEventListener('change', function () {
      var fr = new FileReader();
      fr.onload = function () { try { ficha = migra(JSON.parse(fr.result)); save(); renderAll(); toast('Ficha importada'); }
        catch (e) { toast('JSON inválido'); } };
      fr.readAsText(inp.files[0]);
    });
    inp.click();
  }
  function resetFicha() {
    if (!confirm('Nova ficha? A atual será substituída (exporte antes se quiser guardar).')) return;
    ficha = novaFicha(); save(); renderAll(); toast('Nova ficha');
  }

  // projeção Bestiário (type:npc) — ver data/ficha.schema.json x-bestiary
  function exportBestiario() {
    var b = { type:'npc', name: ficha.meta.nome || 'Personagem', race: ficha.meta.raca,
      npc_class: ficha.meta.classe, level: ficha.meta.nivel };
    ATTRS.forEach(function (a) { b[ATTR_BEST[a[0]]] = ficha.atributos[a[0]]; });
    b.health_max = ficha.recursos.saude.max; b.stamina_max = ficha.recursos.stamina.max;
    b.ether_max = ficha.recursos.eter.max;
    b.evasion = ficha.derivadosManuais.evasao; b.movement = ficha.derivadosManuais.movimento;
    b.armor = ficha.derivadosManuais.armadura;
    PERICIAS.forEach(function (p) { b[p[2]] = ficha.pericias[p[0]] || 0; });
    b.craft_attr = ATTR_BEST[ficha.oficioAttr] || 'intelligence';
    var rs = [], im = [], ae = [];
    RESIST.forEach(function (r) {
      var v = ficha.resistencias[r[0]];
      if (v.R) rs.push(r[1]); if (v.I) im.push(r[1]);
      if (v.ae > 0) ae.push(r[1] + ' ' + v.ae);
    });
    b.resistances = rs.join(', '); b.immunities = im.join(', '); b.armor_specific = ae.join(', ');
    b.abilities = ficha.tecnicas.concat(ficha.grimorio).map(function (t) {
      return { name: t.nome, description: t.descricao || '' }; });
    b.weapons = ficha.inventario.armas.map(function (w) {
      return { name: w.nome, category: w.category || '', level: w.level || '0',
        dado: w.dado || '', atributo: w.atributo || 'Força', dano: w.dano || '', efeito: w.efeito || '' }; });
    baixar((ficha.meta.nome || 'personagem').replace(/\s+/g,'_') + '.bestiario.json', b);
    toast('Export Bestiário (type:npc)');
  }

  // ---------------- init ----------------
  var obsT;
  function init() {
    injectCSS(); buildDrawer(); decorar();
    // conteúdo dinâmico (ex.: Bazar re-renderiza o grid ao filtrar) -> re-decora
    try {
      var obs = new MutationObserver(function () {
        clearTimeout(obsT); obsT = setTimeout(decorar, 150);
      });
      obs.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
