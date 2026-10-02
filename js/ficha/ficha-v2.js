/* Khalkaria — Ficha Interativa v2 (MVP)
 * Drawer persistente (localStorage) + DnD/"+ Adicionar" das páginas de regras +
 * derivados calculados + Export/Import JSON + projeção para o Bestiário (type:npc).
 * Não é SPA: re-hidrata no DOMContentLoaded. Schema: data/ficha-v2.schema.json (o v3 é o data/ficha.schema.json).
 *
 * Usa o window.KhInv (js/ficha/kh-inv.js, antes deste no ORDEM). No node
 * (tools/testes) não roda: nada daqui toca em window/document/localStorage lá.
 * Fonte: js/ficha/ficha-v2.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  // node:test carrega só os módulos puros: este para aqui
  if (typeof module === 'object' && module && module.exports) return;
  var KhInv = raiz.KhInv;

  var LS_KEY = 'khalkaria_ficha';
  var OPEN_KEY = 'khalkaria_ficha_open';
  var BACKUP_KEY = 'khalkaria_ficha_v1_backup';
  // Guarda contra aba velha (F0). A v3 grava nas próprias chaves (índice
  // khalkaria_fichas_v3 + khalkaria_ficha_v3:<id>, KhEstado.CHAVES) e põe o
  // marcador DONO_KEY = 'v3'; esta v2.1, ao ver o marcador (no load ou pelo
  // evento storage), fica só-leitura e não escreve mais NADA no storage. A mera
  // existência das chaves v3 não trava nada. "Voltar a usar a v2" apaga só o marcador.
  var KhEstado = raiz.KhEstado;
  var DONO_KEY = KhEstado.CHAVES.dono;
  var MSG_RO = 'Ficha migrada para a v3. Recarregue a página.';
  var SCHEMA_VERSION = '2.0';   // a string gravada nunca muda: a v3 usa outra chave
  var DESFAZER_MAX = 20;

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
    ['religiao','Religião','prof_religion','sab'], ['mistico','Místico','prof_mystic','int'],
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

  // Estado de página. Declarado ANTES do load(): a KF existe antes do init(), e
  // tudo que o load() e os mutadores tocam precisa estar inicializado.
  var drawer = null, body = null;      // body só existe depois do init(): mutadores testam if (body)
  var ultimoGravado = null;            // último JSON que ESTA página gravou (sincroniza ignora o eco)
  var saveT = null;                    // debounce dos campos digitados do drawer
  var toastT;
  var desfazerPilha = [];              // snapshots (JSON) de ficha.inventario, em memória, por página
  var loteN = 0;
  var bazarCache = null, idxCatalogo = null, catalogoPromessa = null;
  var renderPendente = false, abrirPendente = null, obsT;
  var conflitoDrawer = null;           // {uid, campo, conflito}: "Trocar por esta" até a próxima mudança
  var migrouAgora = false;             // load() converteu uma v1: o init() mostra o toast de migração
  var somenteLeitura = false;          // marcador DONO_KEY = 'v3': nada é gravado (confereDono)

  function agoraISO() { return new Date().toISOString(); }
  function clone(x) {
    if (typeof structuredClone === 'function') return structuredClone(x);
    return x === undefined ? undefined : JSON.parse(JSON.stringify(x));
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function donoV3() { return lsGet(DONO_KEY) === 'v3'; }
  function temPropria(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }

  // ---------------- estado (ficha v2, spec §5.2) ----------------
  function novaFicha() {
    var f = {
      schemaVersion: SCHEMA_VERSION, rev: 0, salvoEm: '', exportadoEm: '', migradoEm: '',
      meta: { nome:'', jogador:'', nivel:1, xp:0, raca:'', variante:'', classe:'', ramo:'', origem:'' },
      atributos: { for:10, des:10, con:10, int:10, sab:10 },
      pericias: {}, oficioAttr:'int',
      recursos: { saude:{atual:0,max:0}, stamina:{atual:0,max:0}, eter:{atual:0,max:0},
                  recursoClasse:{nome:'',atual:0,max:0} },
      derivadosManuais: { evasao:0, cd:0, movimento:9, armadura:0 },
      resistencias: {},
      inventario: { sins:0, bugigangas:[], equipamentos:[] },
      tecnicas: [], grimorio: [], cartasLimiar: [], lore:{ historia:'', outros:'' }
    };
    PERICIAS.forEach(function (p) { f.pericias[p[0]] = 0; });
    RESIST.forEach(function (r) { f.resistencias[r[0]] = { R:false, I:false, ae:0 }; });
    return f;
  }

  // listas da v1 (ou recriadas vazias por um ficha.js antigo em cache noutra página)
  function temListasVelhas(f) {
    var inv = f && f.inventario;
    return !!(inv && typeof inv === 'object' && (temPropria(inv, 'armas') || temPropria(inv, 'materiais')));
  }
  function temItens(f) {
    var inv = f && f.inventario;
    return KhInv.COLUNAS.some(function (c) { return !!(inv && Array.isArray(inv[c]) && inv[c].length); });
  }
  // invariante da ficha v2: entrada equipada ou sintonizada tem qtd 1 (KhInv.quantidade recusa)
  var MSG_QTD_1 = {
    equipado: 'Item equipado conta 1 unidade; desequipe para mudar a quantidade',
    sintonizado: 'Item sintonizado conta 1 unidade; dessintonize para mudar a quantidade'
  };
  var MSG_MIGRACAO ='Inventário convertido: 4 listas → 2 colunas. Armaduras e materiais agora pesam; marque o que está Equipado.';
  function guardaBackup(raw) {
    if (somenteLeitura || lsGet(BACKUP_KEY) != null) return;   // nunca sobrescreve o backup
    try { localStorage.setItem(BACKUP_KEY, raw); } catch (e) {}
  }

  somenteLeitura = donoV3();
  var ficha = load();
  // Só aqui grava o backup (spec §5.6.1). A ficha migrada vai para o storage na
  // hora, com rev++, para que as outras abas adotem a v2. Em só-leitura, só lê.
  function load() {
    var raw = lsGet(LS_KEY);
    if (!raw) return novaFicha();
    var f;
    try { f = JSON.parse(raw); } catch (e) { f = null; }
    if (!f || typeof f !== 'object' || Array.isArray(f)) { guardaBackup(raw); return novaFicha(); }
    if (f.schemaVersion !== SCHEMA_VERSION) guardaBackup(raw);
    var m = migra(f);
    if (somenteLeitura) { ultimoGravado = raw; return m; }
    if (f.schemaVersion !== SCHEMA_VERSION) migrouAgora = temItens(m);
    if (f.schemaVersion !== SCHEMA_VERSION || temListasVelhas(f)) {
      m.rev++; m.salvoEm = agoraISO(); grava(m);
    } else ultimoGravado = raw;
    return m;
  }
  // Roda em load, import, storage e pageshow. migrarV1 é idempotente; o delete é
  // repetido depois do deepMerge porque ele preserva chaves fora da base.
  function migra(f) {
    var m = deepMerge(novaFicha(), KhInv.migrarV1(f));
    if (!m.inventario || typeof m.inventario !== 'object' || Array.isArray(m.inventario)) m.inventario = novaFicha().inventario;
    delete m.inventario.armas; delete m.inventario.materiais;
    KhInv.COLUNAS.forEach(function (c) { if (!Array.isArray(m.inventario[c])) m.inventario[c] = []; });
    m.schemaVersion = SCHEMA_VERSION;
    var r = parseInt(m.rev, 10); m.rev = r > 0 ? r : 0;
    ['salvoEm', 'exportadoEm', 'migradoEm'].forEach(function (k) { if (typeof m[k] !== 'string') m[k] = ''; });
    return m;
  }
  function deepMerge(base, over) {
    if (typeof base !== 'object' || base === null || Array.isArray(base)) return over === undefined ? base : over;
    var out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    Object.keys(over || {}).forEach(function (k) {
      out[k] = (k in base) ? deepMerge(base[k], over[k]) : over[k];
    });
    return out;
  }

  // ---------------- gravação e sincronia (spec §5.5) ----------------
  function grava(f) {
    if (confereDono()) return false;   // a v3 é dona: esta aba não grava mais
    var s = JSON.stringify(f);
    try { localStorage.setItem(LS_KEY, s); ultimoGravado = s; return true; }
    catch (e) {
      if (e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22)) {
        toast('Não foi possível salvar — exporte a ficha');
      }
      return false;
    }
  }
  // campos digitados do drawer: debounce de 200ms, com rev++ no flush
  function save() { if (somenteLeitura) return; clearTimeout(saveT); saveT = setTimeout(flush, 200); }
  function flush() {
    if (saveT == null) return;
    clearTimeout(saveT); saveT = null;
    if (confereDono()) return;
    ficha.rev++; ficha.salvoEm = agoraISO(); grava(ficha);
  }
  function emite(partes, origem, op, uid) {
    try {
      document.dispatchEvent(new CustomEvent('kf:mudou', { detail: {
        partes: partes.slice(), origem: origem, op: op || '', uid: uid || '' } }));
    } catch (e) {}
  }
  // grava NA HORA (leva junto o que estava no debounce), redesenha e avisa
  function commit(partes, origem, op, uid) {
    clearTimeout(saveT); saveT = null;
    ficha.rev++; ficha.salvoEm = agoraISO(); grava(ficha);
    conflitoDrawer = null;
    if (body) {
      if (partes.indexOf('tudo') >= 0) renderAllQuandoLivre();
      else { renderListas(); refreshDerivados(); atualizaSins(); }
    }
    emite(partes, origem, op, uid);
    if (origem !== 'reconciliacao') verificaPendentes();
  }
  // Relê o storage; adota se o rev de lá for maior (ou igual, mas com as listas
  // velhas que um ficha.js antigo recria). Digitar a mesma ficha em duas abas
  // dentro dos mesmos 200ms: vale a última escrita (aceito).
  function sincroniza() {
    confereDono();
    var raw = lsGet(LS_KEY);
    if (!raw || raw === ultimoGravado) return false;
    var f;
    try { f = JSON.parse(raw); } catch (e) { return false; }
    if (!f || typeof f !== 'object' || Array.isArray(f)) return false;
    var r = parseInt(f.rev, 10) || 0;
    var velhas = temListasVelhas(f);
    if (!(r > ficha.rev || (r === ficha.rev && velhas))) return false;
    clearTimeout(saveT); saveT = null;
    ficha = migra(f);
    ultimoGravado = raw;
    desfazerPilha = [];
    if (velhas) { ficha.rev++; ficha.salvoEm = agoraISO(); grava(ficha); }
    if (body) renderAllQuandoLivre();
    emite(['tudo'], 'outra-aba', 'sincroniza');
    // Adotar NUNCA reconcilia: quem gravou já reconciliou com o catálogo dele.
    // Duas abas com bazar.json diferentes (deploy no meio) reconciliando cada
    // adoção gravavam uma por cima da outra para sempre. A reconciliação roda
    // uma vez por página, quando o catálogo chega (catalogo()) e no import.
    verificaPendentes();
    return true;
  }

  // ---------------- guarda contra aba velha (F0) ----------------
  // Relê o marcador; se mudou, troca de modo. Devolve se está só-leitura.
  function confereDono() {
    var v3 = donoV3();
    if (v3 !== somenteLeitura) mudaModo(v3);
    return somenteLeitura;
  }
  function mudaModo(v3) {
    somenteLeitura = v3;
    clearTimeout(saveT); saveT = null;   // o que estava no debounce não vai mais para a v2
    desfazerPilha = [];
    conflitoDrawer = null;
    // voltou para a v2: relê a chave v2 (nada foi gravado enquanto só-leitura)
    if (!v3) ficha = load();
    if (body) renderAll();
    emite(['tudo'], 'dono', v3 ? 'somente-leitura' : 'leitura-escrita');
  }
  function baixarTexto(nome, texto) {
    var blob = new Blob([texto], { type:'application/json' });
    var a = el('a', { href: URL.createObjectURL(blob), download: nome });
    document.body.appendChild(a); a.click(); a.remove();
  }
  // "Baixar ficha v3 (.json)": o pacote fichas/1 com TODAS as fichas do índice
  // v3 (KhEstado.armazem só LÊ aqui); a que não vira v3 neste bundle (ilegível
  // ou de versão futura) vai crua em 'ilegiveis', para não se perder.
  function baixarV3() {
    var p = null;
    try { p = KhEstado.armazem(localStorage, null).exportarTodas(); } catch (e) { p = null; }
    if (!p || (!p.dados.fichas.length && !(p.dados.ilegiveis || []).length)) {
      toast('Não há ficha v3 salva neste navegador');
      return false;
    }
    baixarTexto(p.nomeArquivo, JSON.stringify(p.dados, null, 2));
    return true;
  }
  // "Voltar a usar a v2": apaga só o marcador (a chave v3 fica intacta)
  function voltarV2() {
    try { localStorage.removeItem(DONO_KEY); } catch (e) {}
    confereDono();
    if (!somenteLeitura) toast('Ficha v2 em uso de novo');
  }
  function faixaSomenteLeitura() {
    return el('div', { id:'kf-ro', role:'alert' }, [
      el('p', {}, [MSG_RO]),
      el('div', { class:'kf-row' }, [
        el('button', { type:'button', class:'kf-btn sm', 'data-kf-ro':'', title:'Baixar ficha v3 (.json)', onclick: baixarV3 }, ['Baixar ficha v3 (.json)']),
        el('button', { type:'button', class:'kf-btn sm', 'data-kf-ro':'', title:'Voltar a usar a v2', onclick: voltarV2 }, ['Voltar a usar a v2'])
      ])
    ]);
  }
  // só-leitura: tudo que edita no drawer fica desabilitado (a faixa não)
  function travaDrawer() {
    if (!drawer) return;
    drawer.classList.toggle('kf-ro', somenteLeitura);
    if (!somenteLeitura) return;
    body.querySelectorAll('input,select,textarea,button').forEach(function (x) {
      if (!x.hasAttribute('data-kf-ro')) x.disabled = true;
    });
  }

  // ---------------- mutadores (spec §5.3) ----------------
  // sincroniza, snapshot para desfazer, aplica, commit. Sem mudança, nada é
  // gravado nem emitido (ex.: alternar com conflito). Dentro de lote só aplica.
  function empilhaDesfazer(json) {
    desfazerPilha.push(json);
    if (desfazerPilha.length > DESFAZER_MAX) desfazerPilha.shift();
  }
  function partesDoDiff(antes) {
    var a = JSON.parse(antes), d = ficha.inventario, p = [];
    if (JSON.stringify(a.bugigangas) !== JSON.stringify(d.bugigangas) ||
        JSON.stringify(a.equipamentos) !== JSON.stringify(d.equipamentos)) p.push('inventario');
    if (a.sins !== d.sins) p.push('sins');
    return p.length ? p : ['inventario'];
  }
  // Só-leitura (F0): nenhum mutador aplica nada, nem na memória; o Bazar recebe
  // {ok:false, erro:'somente-leitura'} (ou null/false, conforme o mutador).
  var RES_RO = { ok: false, erro: 'somente-leitura' };
  function bloqueado() {
    sincroniza();
    if (!somenteLeitura) return false;
    toast(MSG_RO, 4000);
    return true;
  }
  function muta(op, origem, fn) {
    if (loteN) return somenteLeitura ? Object.assign({}, RES_RO) : fn();
    if (bloqueado()) return Object.assign({}, RES_RO);   // bloqueado() já sincronizou
    var antes = JSON.stringify(ficha.inventario);
    var r = fn();
    if (JSON.stringify(ficha.inventario) === antes) return r;
    empilhaDesfazer(antes);
    commit(partesDoDiff(antes), origem || 'local', op, r && r.uid);
    return r;
  }
  function doCatalogo(item) {   // o registro atual vence o payload (card sem catálogo, drag antigo)
    if (!item || item.avulso || !idxCatalogo) return item;
    return (item.id && temPropria(idxCatalogo.porId, item.id) && idxCatalogo.porId[item.id]) ||
      (item.nome && temPropria(idxCatalogo.porNome, item.nome) && idxCatalogo.porNome[item.nome]) || item;
  }
  function adicionar(item, opts, origem) {
    if (!item || typeof item !== 'object') return null;
    if (item.avulso ? !String(item.nome || '').trim() : !(item.id || item.nome)) return null;
    var it = doCatalogo(item);
    var r = muta('adicionar', origem, function () { return KhInv.mesclar(ficha.inventario, it, opts || {}); });
    return r && r.uid ? r.uid : null;
  }
  function quantidade(uid, n, origem) {
    return muta('quantidade', origem, function () { return Object.assign({ uid: uid }, KhInv.quantidade(ficha.inventario, uid, n)); });
  }
  function alternar(uid, campo, origem) {
    return muta('alternar', origem, function () { return KhInv.alternar(ficha.inventario, uid, campo); });
  }
  function trocar(uid, campo, uidsASoltar, origem) {   // "Trocar por esta": um passo só de desfazer
    return muta('trocar', origem, function () { return KhInv.trocar(ficha.inventario, uid, campo, uidsASoltar); });
  }
  function mover(uid, coluna, origem) {
    return muta('mover', origem, function () { return KhInv.mover(ficha.inventario, uid, coluna); });
  }
  function remover(uid, origem) {
    var r = muta('remover', origem, function () { return { uid: uid, entrada: KhInv.remover(ficha.inventario, uid) }; });
    return !!(r && r.entrada);
  }
  function definirSins(n, origem) {
    n = Math.floor(Number(n));
    if (!(n >= 0)) n = 0;
    muta('sins', origem, function () { ficha.inventario.sins = n; return null; });
    return ficha.inventario.sins;
  }
  function lote(fn) {
    if (loteN) return fn();
    if (bloqueado()) return Object.assign({}, RES_RO);   // fn nem roda
    var antes = JSON.stringify(ficha.inventario), r;
    loteN++;
    try { r = fn(); }
    catch (e) { ficha.inventario = JSON.parse(antes); throw e; }
    finally { loteN--; }
    if (JSON.stringify(ficha.inventario) === antes) return r;
    empilhaDesfazer(antes);
    commit(partesDoDiff(antes), 'local', 'lote', r && r.uid);
    return r;
  }
  function desfazer() {
    if (bloqueado() || !desfazerPilha.length) return false;
    ficha.inventario = JSON.parse(desfazerPilha.pop());
    commit(['inventario', 'sins'], 'desfazer', 'desfazer');
    return true;
  }

  // ---------------- catálogo e reconciliação (spec §5.6/§5.7) ----------------
  function naBazar() { return !!(document.body && document.body.hasAttribute('data-bazar')); }
  function reconciliaCatalogo() {
    if (!idxCatalogo || somenteLeitura) return;   // em só-leitura nem a memória muda
    if (KhInv.reconciliar(ficha.inventario, idxCatalogo.porId, idxCatalogo.porNome)) {
      commit(['inventario'], 'reconciliacao', 'reconciliar');
    }
  }
  // o Bazar entrega o bazar.json já baixado; fora dele, é o fetch preguiçoso
  function catalogo(arr) {
    if (!Array.isArray(arr)) return;
    bazarCache = arr;
    idxCatalogo = KhInv.indexar(arr);
    sincroniza();
    reconciliaCatalogo();
    if (body) decorarBazar();
  }
  function pedeCatalogo() {
    if (bazarCache) return Promise.resolve(bazarCache);
    if (!catalogoPromessa) {
      catalogoPromessa = fetch(ROOT + 'data/bazar.json')
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (d) { if (!bazarCache) catalogo(d); return bazarCache; });
    }
    return catalogoPromessa;
  }
  // entrada sem inv (migrada ou vinda de card sem catálogo) e fora do registro ainda não conferida
  function temPendentes() {
    return KhInv.COLUNAS.some(function (c) {
      return (ficha.inventario[c] || []).some(function (e) { return e && e.inv === null && !e.avulso && !e.orfao; });
    });
  }
  function verificaPendentes() {
    if (bazarCache || catalogoPromessa || !document.body || naBazar() || !temPendentes()) return;
    pedeCatalogo().catch(function () {});
  }

  // ---------------- derivados ----------------
  function mod(attr) { return Math.floor((ficha.atributos[attr] - 10) / 2); }
  function modStr(attr) { var m = mod(attr); return (m >= 0 ? '+' : '') + m; }

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
  // referência ao objeto da ficha resolvida na hora do evento: depois de adotar
  // outra aba (ficha nova), o input focado grava na ficha certa
  function R(caminho) {
    return function () { return caminho.split('.').reduce(function (o, k) { return o[k]; }, ficha); };
  }
  function alvoDe(obj) { return typeof obj === 'function' ? obj() : obj; }

  // ---------------- entidades (payload de card) ----------------
  function slug(nome, pre) {
    var s = (nome || '').normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return (pre || '') + s;
  }
  function addEntidade(campo, ent) {
    if (bloqueado()) return;
    var lista = ficha[campo];
    // evita duplicar mesmo id
    if (ent.id && lista.some(function (x) { return x.id === ent.id; })) { toast(ent.nome + ' já está na ficha'); return; }
    lista.push(ent); save(); if (body) renderListas(); toast('+ ' + ent.nome);
  }

  // ---------------- toast ----------------
  function toast(msg, ms) {
    if (!document.body) return;
    var t = document.getElementById('kf-toast');
    if (!t) { t = el('div', { id:'kf-toast', 'data-kf-ignorar':'', role:'status' }); document.body.appendChild(t); }
    t.textContent = msg; t.className = 'kf-show';
    clearTimeout(toastT); toastT = setTimeout(function () { t.className = ''; }, ms || 1600);
  }

  // ---------------- CSS ----------------
  // Em css/ficha.css (F2a), que o shell põe em todas as páginas: o ficha.js não
  // injeta mais <style>.

  // ---------------- drawer ----------------
  function setOpen(b) {
    drawer.classList.toggle('kf-open', b);
    if (somenteLeitura) return;
    try { localStorage.setItem(OPEN_KEY, b ? '1' : '0'); } catch (e) {}
  }
  function buildDrawer() {
    var toggle = el('button', { id:'kf-toggle', title:'Ficha de Personagem',
      onclick: function () { setOpen(!drawer.classList.contains('kf-open')); } }, ['📋 FICHA']);
    document.body.appendChild(toggle);

    drawer = el('div', { id:'kf-drawer', class:'kf-drawer', 'data-kf-ignorar':'' });
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
    if (lsGet(OPEN_KEY) === '1') {
      var prev = drawer.style.transition; drawer.style.transition = 'none';
      drawer.classList.add('kf-open');
      // reflow síncrono em vez de rAF: com a aba oculta o rAF não roda e o
      // drawer ficaria sem transição até ela aparecer
      void drawer.offsetWidth;
      drawer.style.transition = prev;
    }
  }

  function sec(chave, titulo, conteudo, collapsed) {
    var b = el('div', { class:'kf-secbody' }, conteudo);
    var s = el('div', { class:'kf-sec' + (collapsed ? ' kf-collapsed' : ''), 'data-sec': chave }, [
      el('h3', { onclick: function () { s.classList.toggle('kf-collapsed'); } }, [titulo, el('span', {}, ['▾'])]),
      b
    ]);
    return s;
  }

  function txt(label, obj, key, type) {
    var inp = el('input', { type: type || 'text', value: alvoDe(obj)[key] });
    inp.addEventListener('input', function () {
      alvoDe(obj)[key] = (type === 'number') ? (parseFloat(inp.value) || 0) : inp.value;
      save(); refreshDerivados();
    });
    return el('div', { class:'kf-row' }, [label ? el('label', {}, [label]) : null, inp]);
  }

  // Com um input do drawer focado, espera o focusout (não arranca o campo do jogador)
  function focoNoDrawer() {
    var a = document.activeElement;
    return !!(a && drawer && drawer.contains(a) && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
  }
  function renderAllQuandoLivre() {
    if (!body) return;
    if (!focoNoDrawer()) { renderPendente = false; renderAll(); return; }
    if (renderPendente) return;
    renderPendente = true;
    drawer.addEventListener('focusout', function () {
      setTimeout(function () { renderPendente = false; renderAllQuandoLivre(); }, 0);
    }, { once: true });
  }

  function renderAll() {
    // preserva seções abertas/recolhidas e a rolagem (renderAll agora roda em import/outra aba)
    var estadoSec = {}, rolagem = body.scrollTop;
    body.querySelectorAll('.kf-sec[data-sec]').forEach(function (s) {
      estadoSec[s.getAttribute('data-sec')] = s.classList.contains('kf-collapsed');
    });
    function rec(chave, padrao) { return temPropria(estadoSec, chave) ? estadoSec[chave] : padrao; }
    body.innerHTML = '';
    derdispEl = null; cargaEl = null;
    if (somenteLeitura) body.appendChild(faixaSomenteLeitura());
    // no Bazar o inventário completo está na página: a seção nasce recolhida, com a nota
    var noBazar = naBazar();
    var tituloInv = noBazar
      ? el('span', {}, ['▐ Inventário ', el('span', { class:'kf-sec-nota' }, ['· o inventário completo está nesta página'])])
      : '▐ Inventário';
    // NÚCLEO
    body.appendChild(sec('identidade', '▐ Identidade', [
      txt('Nome', R('meta'), 'nome'), txt('Jogador', R('meta'), 'jogador'),
      el('div', { class:'kf-row' }, [
        el('label', {}, ['Nível']), numInput(R('meta'), 'nivel'),
        el('label', {}, ['XP']), numInput(R('meta'), 'xp')
      ]),
      txt('Raça', R('meta'), 'raca'), txt('Variante', R('meta'), 'variante'),
      txt('Classe', R('meta'), 'classe'), txt('Ramo', R('meta'), 'ramo'),
      txt('Origem', R('meta'), 'origem')
    ], rec('identidade', false)));
    body.appendChild(sec('atributos', '▐ Atributos', [renderAtributos()], rec('atributos', false)));
    body.appendChild(sec('pericias', '▐ Perícias', [renderPericias()], rec('pericias', true)));
    body.appendChild(sec('recursos', '▐ Recursos', renderRecursos(), rec('recursos', false)));
    body.appendChild(sec('derivados', '▐ Derivados', [renderDerivados()], rec('derivados', false)));
    body.appendChild(sec('resistencias', '▐ Resistências', [renderResist()], rec('resistencias', true)));
    body.appendChild(sec('inventario', tituloInv, renderInventario(), rec('inventario', noBazar)));
    // listas por DnD/+add
    body.appendChild(sec('tecnicas', '▐ Técnicas & Marcas', [dropZone('tecnicas','Arraste técnicas/marcas aqui'), listaEl('tecnicas')], rec('tecnicas', false)));
    body.appendChild(sec('grimorio', '▐ Grimório (Magias)', [dropZone('grimorio','Arraste magias aqui'), listaEl('grimorio')], rec('grimorio', false)));
    body.appendChild(sec('cartas', '▐ Cartas do Limiar', [dropZone('cartasLimiar','Arraste cartas do Limiar aqui'), listaEl('cartasLimiar')], rec('cartas', false)));
    body.appendChild(sec('lore', '▐ Lore', [
      el('div',{class:'kf-row'},[el('label',{},['História'])]),
      areaInput(R('lore'),'historia'),
      el('div',{class:'kf-row'},[el('label',{},['Outros'])]),
      areaInput(R('lore'),'outros')
    ], rec('lore', true)));
    body.scrollTop = rolagem;
    travaDrawer();
  }

  function numInput(obj, key) {
    var inp = el('input', { type:'number', value: alvoDe(obj)[key] });
    inp.addEventListener('input', function () { alvoDe(obj)[key] = parseFloat(inp.value) || 0; save(); refreshDerivados(); });
    return inp;
  }
  function areaInput(obj, key) {
    var ta = el('textarea', { rows:3, style:'width:100%' }); ta.value = alvoDe(obj)[key] || '';
    ta.addEventListener('input', function () { alvoDe(obj)[key] = ta.value; save(); });
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
        emite(['atributos'], 'drawer', 'atributo');
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
      recRow('Saúde', R('recursos.saude')),
      recRow('Stamina', R('recursos.stamina')),
      recRow('Éter', R('recursos.eter')),
      el('div', { class:'kf-row' }, [
        el('label', {}, ['Rec. Classe']),
        (function(){ var i=el('input',{type:'text',value:ficha.recursos.recursoClasse.nome,placeholder:'ex: FLUXO'});
          i.addEventListener('input',function(){ficha.recursos.recursoClasse.nome=i.value;save();});return i;})()
      ]),
      recRow('  ↳ valor', R('recursos.recursoClasse'))
    ];
  }

  var derdispEl;
  function renderDerivados() {
    var wrap = el('div', {});
    // manuais (vêm da classe/regras)
    wrap.appendChild(el('div', { class:'kf-row' }, [
      el('label', {}, ['Evasão']), numInput(R('derivadosManuais'), 'evasao'),
      el('label', {}, ['CD']), numInput(R('derivadosManuais'), 'cd')
    ]));
    wrap.appendChild(el('div', { class:'kf-row' }, [
      el('label', {}, ['Movim.(m)']), numInput(R('derivadosManuais'), 'movimento'),
      el('label', {}, ['Armadura']), numInput(R('derivadosManuais'), 'armadura')
    ]));
    wrap.appendChild(el('div', { class:'kf-row', style:'font-size:10px;color:#666' },
      ['Evasão/CD/Movim. vêm da sua classe — preencha manualmente.']));
    derdispEl = el('div', { class:'kf-derdisp' });
    wrap.appendChild(derdispEl);
    refreshDerivados();
    return wrap;
  }
  // Equip./Bugigangas pela mesma carga do KF.carga(), com Leve e Extremo; o
  // bloco de carga do Inventário (Peso total, condição, réguas) vai junto
  function refreshDerivados() {
    var cg = (derdispEl || cargaEl) ? cargaAtual() : null;
    refreshCarga(cg);
    if (!derdispEl) return;
    function linha(rotulo, c) {
      var sp = c.estado === 'leve' ? ' · Sobrepeso Leve' : (c.estado === 'extremo' ? ' · Sobrepeso Extremo' : '');
      return '<div>' + rotulo + '</div><div class="' + (c.estado === 'ok' ? 'kf-ok' : 'kf-warn') + '">' +
        c.usado + ' / ' + c.max + sp + '</div>';
    }
    derdispEl.innerHTML =
      '<div>Mods</div><div><b>' + ATTRS.map(function(a){return a[1]+' '+modStr(a[0]);}).join(' · ') + '</b></div>' +
      linha('Equip.', cg.equipamentos) + linha('Bugigangas', cg.bugigangas);
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

  // ---------------- inventário no drawer (spec §4.11) ----------------
  // Duas colunas por uid: [nome] [= peso] [×] / [− n +] [☐ Item Empilhável]
  // [☐ Equipado]. Peso total, condição e as duas réguas vêm de cargaAtual()
  // (o mesmo KF.carga()) e são redesenhados em refreshDerivados(), então a FOR
  // digitada mexe na régua na hora. Tudo escreve pelos mutadores (commit).
  var NOME_COL = { bugigangas: 'Bugigangas', equipamentos: 'Equipamentos' };
  var cargaEl = null;
  function cargaAtual() { return KhInv.calcular(ficha.inventario, ficha.atributos.for); }
  function atual(uid) { var a = KhInv.acha(ficha.inventario, uid); return a ? a.entrada : null; }

  // texto verbatim da condição quando o Bazar injetou BZ_VOCAB; fora dele, só o link
  function condicaoInfo(c) {
    var v = raiz.BZ_VOCAB && raiz.BZ_VOCAB.condicoes && raiz.BZ_VOCAB.condicoes[c];
    return { id: (v && v.id) || 'sobrepeso-' + c,
      nome: (v && v.nome) || (c === 'leve' ? 'Sobrepeso Leve' : 'Sobrepeso Extremo'),
      texto: (v && v.texto) || '' };
  }
  function seloCondicao(condicao) {
    if (condicao !== 'leve' && condicao !== 'extremo') {
      return el('span', { class:'kf-cond kf-cond-nenhuma' }, ['Sem sobrepeso']);
    }
    var ci = condicaoInfo(condicao);
    return el('a', { class:'kf-cond kf-cond-' + condicao, href: ROOT + 'pages/condicoes.html#' + ci.id,
      title: ci.texto || ('Ver ' + ci.nome + ' em Condições') }, [ci.nome]);
  }
  // "10 base + 2 FOR 14 + 3 Mochila Reforçada = 15" (o mínimo 1 vale só para a base)
  function contaCapacidade(c, cg) {
    var base = c === 'bugigangas' ? KhInv.REGRAS.BASE_BUG : KhInv.REGRAS.BASE_EQ;
    var col = cg[c], m = cg.modFor;
    var s = base + ' base ' + (m < 0 ? '− ' + (-m) : '+ ' + m) + ' FOR ' + cg.forca;
    if (base + m < KhInv.REGRAS.MIN) s += ' (mín. ' + KhInv.REGRAS.MIN + ')';
    col.bonus.forEach(function (b) {
      s += ' + ' + b.n + ' ' + b.nome;
      if (b.ignoradas === 1) s += ' (2ª ' + b.nome + ' não acumula)';
      else if (b.ignoradas > 1) s += ' (' + b.ignoradas + ' cópias de ' + b.nome + ' não acumulam)';
    });
    return s + ' = ' + col.max;
  }
  function textoEstado(col) {
    if (col.estado === 'ok') return 'livre ' + (col.max - col.usado);
    if (col.estado === 'leve') return 'Sobrepeso Leve — Extremo em ' + (2 * col.max);
    return 'Sobrepeso Extremo';
  }
  // régua de 0 a 2×max: dourado até o max, âmbar hachurado até 2×max; marco no max
  function regua(c, cg) {
    var col = cg[c], total = 2 * col.max;
    var ok = total > 0 ? Math.min(col.usado, col.max) / total * 100 : 0;
    var exc = total > 0 ? Math.max(0, Math.min(col.usado, total) - col.max) / total * 100 : 0;
    var cond = col.estado === 'leve' ? ', Sobrepeso Leve' : (col.estado === 'extremo' ? ', Sobrepeso Extremo' : '');
    return el('div', { class:'kf-regua', role:'meter', 'aria-label': NOME_COL[c],
      'aria-valuemin': 0, 'aria-valuemax': col.max, 'aria-valuenow': col.usado,
      'aria-valuetext': col.usado + ' de ' + col.max + ' ' + NOME_COL[c].toLowerCase() + cond }, [
      el('span', { class:'kf-regua-ok', style:'width:' + ok + '%' }),
      exc > 0 ? el('span', { class:'kf-regua-exc', style:'width:' + exc + '%' }) : null,
      el('span', { class:'kf-regua-marco' }),
      col.usado > total ? el('span', { class:'kf-regua-mais' }, ['+' + (col.usado - total)]) : null
    ]);
  }
  function blocoColuna(c, cg) {
    var col = cg[c];
    return el('div', { class:'kf-carga-col kf-est-' + col.estado, 'data-carga': c }, [
      el('div', { class:'kf-carga-lin' }, [
        el('span', { class:'kf-carga-nome' }, [NOME_COL[c]]),
        el('span', { class:'kf-carga-num', title: contaCapacidade(c, cg) }, [
          el('b', {}, [String(col.usado)]), ' / ' + col.max]),
        el('span', { class:'kf-carga-est' }, [textoEstado(col)])
      ]),
      regua(c, cg)
    ]);
  }
  function refreshCarga(cg) {
    if (!cargaEl) return;
    cg = cg || cargaAtual();
    cargaEl.innerHTML = '';
    cargaEl.appendChild(el('div', { class:'kf-carga-topo' }, [
      el('div', { class:'kf-peso' }, [
        'Peso total', el('b', {}, [String(cg.pesoTotal)]),
        el('small', {}, [cg.bugigangas.usado + ' bugigangas + ' + cg.equipamentos.usado + ' equipamentos'])
      ]),
      seloCondicao(cg.condicao)
    ]));
    KhInv.COLUNAS.forEach(function (c) { cargaEl.appendChild(blocoColuna(c, cg)); });
  }

  function renderInventario() {
    var sins = el('input', { type:'number', min:0, step:1, id:'kf-sins', value: ficha.inventario.sins, title:'não pesa' });
    sins.addEventListener('change', function () { sins.value = definirSins(sins.value, 'drawer'); });
    var busca = el('input', { type:'text', placeholder:'Buscar item do Bazar…' });
    var res = el('div', {});
    busca.addEventListener('input', function () { buscaBazar(busca.value, res); });
    cargaEl = el('div', { class:'kf-carga' });
    var cg = cargaAtual();
    refreshCarga(cg);
    return [
      el('div', { class:'kf-row' }, [el('label', {}, ['Sins']), sins]),
      cargaEl,
      el('div', { class:'kf-row' }, [busca]),
      res,
      dropZone('inventario', 'Arraste itens do Bazar aqui'),
      el('div', { class:'kf-inv-cab' }, [NOME_COL.bugigangas]), listaInvEl('bugigangas', cg),
      el('div', { class:'kf-inv-cab' }, [NOME_COL.equipamentos]), listaInvEl('equipamentos', cg)
    ];
  }
  function atualizaSins() {
    var i = body && body.querySelector('#kf-sins');
    if (i && document.activeElement !== i) i.value = ficha.inventario.sins;
  }
  function listaInvEl(coluna, cg) {
    cg = cg || cargaAtual();
    var wrap = el('div', { class:'kf-inv-lista', 'data-lista': 'inventario.' + coluna, 'data-col': coluna });
    var l = (ficha.inventario[coluna] || []).filter(function (e) { return e && e.uid; });
    if (!l.length) wrap.appendChild(el('div', { class:'kf-inv-vazio' }, ['Nada carregado.']));
    var avisos = {};
    cg.avisos.forEach(function (a) {
      (a.uids || []).forEach(function (u) { (avisos[u] = avisos[u] || []).push(a); });
    });
    l.forEach(function (e) { wrap.appendChild(linhaInv(e, coluna, cg, avisos[e.uid] || [])); });
    return wrap;
  }
  function motivoPeso(e, coluna, cg) {
    var m = cg.motivoPorUid[e.uid], p = cg.pesoPorUid[e.uid] || 0;
    if (m === 'equipado') return 'equipado não conta';
    if (m === 'nao-ocupa') return 'não ocupa espaço';
    if (m === 'unidade') return 'cada item pesa 1';
    if (m === 'pilha') {
      if (!p) return 'soma na pilha da outra linha deste item';
      var k = e.id || e.uid, soma = 0;
      (ficha.inventario[coluna] || []).forEach(function (x) {
        if (x && cg.motivoPorUid[x.uid] === 'pilha' && (x.id || x.uid) === k) soma += x.qtd;
      });
      return soma + ' un. ÷ ' + KhInv.REGRAS.PILHA + ', arredonda para cima = ' + p;
    }
    return '';
  }
  function textoConflito(cf) {
    var nomes = (cf.uids || []).map(function (u) { var x = atual(u); return x ? x.nome : ''; }).filter(Boolean);
    var n = nomes.length, lista = nomes.length ? ' (' + nomes.join(', ') + ')' : '';
    if (cf.tipo === 'pesada') return 'Já há ' + n + (n === 1 ? ' Armadura Pesada equipada' : ' Armaduras Pesadas equipadas') + lista + '.';
    if (cf.tipo === 'leve') return 'Já há ' + n + (n === 1 ? ' Armadura Leve equipada' : ' Armaduras Leves equipadas') + lista + '.';
    return 'Já há ' + n + (n === 1 ? ' Item Mágico sintonizado' : ' Itens Mágicos sintonizados') + lista + '.';
  }
  function tagEl(t, title) { return el('span', { class:'kf-tag', title: title || null }, [t]); }
  function caixa(ctl, rotulo, marcado, aoMudar, extra) {
    var cb = el('input', { type:'checkbox', 'data-ctl': ctl });
    cb.checked = !!marcado;
    cb.addEventListener('change', function () { aoMudar(cb); });
    return el('label', { class:'kf-inv-cx' }, [cb, ' ' + rotulo, extra || null]);
  }
  function linhaInv(e, coluna, cg, avisos) {
    var uid = e.uid, peso = cg.pesoPorUid[uid] || 0;
    var qtd = e.qtd;
    function mudaQtd(n) {
      var ent = atual(uid);
      if (!ent) return;
      var r = quantidade(uid, n, 'drawer');
      if (r && r.removido) toast('Removido: ' + ent.nome);
      // só-leitura: bloqueado() já avisou e redesenhou tudo travado
      else if (r && r.erro === RES_RO.erro) return;
      else if (r && r.erro) { toast(MSG_QTD_1[r.erro] || ''); renderListas(); }
    }
    var trava = e.equipado ? MSG_QTD_1.equipado : (e.sintonizado ? MSG_QTD_1.sintonizado : '');
    function passo(ev, d) {
      var ent = atual(uid);
      if (ent) mudaQtd(ent.qtd + (ev && ev.shiftKey ? 10 * d : d));
    }
    // L1: nome, peso com o motivo no title, ×
    var tags = [];
    if (e.equipado) tags.push(tagEl('equipado'));
    if (e.sintonizado) tags.push(tagEl('sintonizado'));
    if (e.avulso) tags.push(tagEl('sem registro'));
    if (e.inv && e.inv.capacidade) {
      var cp = [];
      if (e.inv.capacidade.bug) cp.push('+' + e.inv.capacidade.bug + ' bugigangas');
      if (e.inv.capacidade.equip) cp.push('+' + e.inv.capacidade.equip + ' equipamentos');
      if (cp.length) tags.push(tagEl(cp.join(' · '), 'aumenta a capacidade'));
    }
    if (e.inv && e.inv.recipiente) tags.push(tagEl('recipiente ainda não modelado',
      'Armazena até ' + e.inv.recipiente + ' Bugigangas: a ficha ainda não desconta isso'));
    var textos = [];
    avisos.forEach(function (a) {
      if (a.tipo === 'copia') tags.push(tagEl('cópia não acumula', a.msg));
      else if (a.tipo === 'orfao') tags.push(tagEl('fora do registro', a.msg));
      else if (a.tipo === 'fora-da-regra') {
        tags.push(el('button', { type:'button', class:'kf-tag', 'data-ctl':'corrigir', title: a.msg + ' (clique para mover)',
          onclick: function () { var x = atual(uid); if (x) mover(uid, KhInv.colunaCanonica(x), 'drawer'); } },
          ['fora da regra · corrigir']));
      } else textos.push(a.msg);   // pesada | leve | sintonia: estado acima do limite, só aviso
    });
    var linha = el('div', { class:'kf-inv-item' + (e.equipado ? ' kf-equipado' : ''), 'data-uid': uid, role:'group',
      'aria-label': e.nome + ', ' + qtd + ', peso ' + peso + (e.empilhavel ? ', empilhável' : '') + (e.equipado ? ', equipado' : '') }, [
      el('div', { class:'kf-inv-l1' }, [
        el('span', { class:'kf-inv-nome' + (e.orfao ? ' kf-orfao' : ''), title: [e.categoria, e.raridade].filter(Boolean).join(' · ') || null }, [e.nome]),
        el('span', { class:'kf-inv-peso', title: motivoPeso(e, coluna, cg) }, ['= ' + peso]),
        el('button', { type:'button', class:'kf-inv-x', 'data-ctl':'x', title:'Remover', 'aria-label':'Remover ' + e.nome,
          onclick: function () { var x = atual(uid); if (x && remover(uid, 'drawer')) toast('Removido: ' + x.nome); } }, ['×'])
      ])
    ]);
    // L2: stepper, Item Empilhável, Equipado
    var num = el('input', { type:'text', inputmode:'numeric', 'data-ctl':'qtd', value: qtd,
      'aria-label':'Quantidade de ' + e.nome, title: trava || 'Quantidade (Enter aplica; 0 remove)',
      readonly: trava ? 'readonly' : null });
    function aplicaNum() {
      var n = parseInt(String(num.value).trim(), 10);
      if (!isFinite(n)) { num.value = qtd; return; }
      if (n !== qtd) mudaQtd(n);
    }
    num.addEventListener('change', aplicaNum);
    num.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') { ev.preventDefault(); aplicaNum(); }
      else if (ev.key === 'Escape') { num.value = qtd; }
    });
    var dif = null;
    if (typeof e.empilhavelRegistro === 'boolean' && e.empilhavel !== e.empilhavelRegistro) {
      dif = el('span', { class:'kf-dif', title:'o registro diz: ' + (e.empilhavelRegistro ? 'empilhável' : 'não empilhável') });
    }
    var l2 = el('div', { class:'kf-inv-l2' }, [
      el('span', { class:'kf-step' }, [
        el('button', { type:'button', 'data-ctl':'menos', title:'Menos 1 (Shift: 10)', 'aria-label':'Diminuir ' + e.nome,
          onclick: function (ev) { passo(ev, -1); } }, ['−']),
        num,
        el('button', { type:'button', 'data-ctl':'mais', title: trava || 'Mais 1 (Shift: 10)', 'aria-label':'Aumentar ' + e.nome,
          disabled: trava ? 'disabled' : null, onclick: function (ev) { passo(ev, 1); } }, ['+'])
      ]),
      caixa('emp', 'Item Empilhável', e.empilhavel, function () { alternar(uid, 'empilhavel', 'drawer'); }, dif)
    ]);
    if (coluna === 'equipamentos') {
      l2.appendChild(caixa('equip', 'Equipado', e.equipado, function (cb) {
        var r = alternar(uid, 'equipado', 'drawer');
        if (r && r.ok) return;
        cb.checked = !cb.checked;   // conflito ou erro: nada muda
        if (r && r.conflito) { conflitoDrawer = { uid: uid, campo: 'equipado', conflito: r.conflito }; renderListas(); }
      }));
    }
    linha.appendChild(l2);
    if (tags.length) linha.appendChild(el('div', { class:'kf-inv-tags' }, tags));
    textos.forEach(function (t) { linha.appendChild(el('p', { class:'kf-inv-aviso' }, [t])); });
    // Passar do limite não muda nada: a linha oferece "Trocar por esta" (um passo só de desfazer)
    if (conflitoDrawer && conflitoDrawer.uid === uid) {
      var cf = conflitoDrawer;
      linha.appendChild(el('p', { class:'kf-inv-aviso', role:'status' }, [
        textoConflito(cf.conflito),
        el('button', { type:'button', class:'kf-btn sm', 'data-ctl':'trocar', onclick: function () {
          var x = atual(uid);
          var r = trocar(uid, cf.campo, cf.conflito.uids, 'drawer');
          if (r && r.ok && x) toast('Trocado: ' + x.nome + ' equipado');
        } }, ['Trocar por esta'])
      ]));
    }
    return linha;
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
          if (bloqueado()) return;
          getLista(campo).splice(i, 1); save(); renderListas(); refreshDerivados(); } }, ['✕']),
        el('span', { class:'kf-nm', html: (item.tipo ? '<span class="kf-tag">'+esc(item.tipo)+'</span>' : '') + esc(item.nome) })
      ]));
    });
    return wrap;
  }
  function renderListas() {
    if (!body) return;
    // o stepper e as caixas são redesenhados a cada commit: devolve o foco ao
    // mesmo controle da mesma linha (teclado não se perde no +/−)
    var a = document.activeElement, fUid = null, fCtl = null;
    if (a && a.getAttribute && body.contains(a)) {
      var li = a.closest ? a.closest('[data-uid]') : null;
      fCtl = a.getAttribute('data-ctl');
      if (li && fCtl) fUid = li.getAttribute('data-uid');
    }
    var cg = cargaAtual();
    ['tecnicas','grimorio','cartasLimiar','inventario.bugigangas','inventario.equipamentos'].forEach(function (campo) {
      var holder = body.querySelector('[data-lista="' + campo + '"]');
      if (!holder) return;
      var novo = campo.indexOf('inventario.') === 0 ? listaInvEl(campo.slice(11), cg) : listaEl(campo);
      holder.parentNode.replaceChild(novo, holder);
    });
    if (fUid) {
      try {
        var n = body.querySelector('[data-uid="' + fUid + '"] [data-ctl="' + fCtl + '"]');
        if (n && n.focus) n.focus();
      } catch (e) {}
    }
    if (somenteLeitura) travaDrawer();   // linhas recriadas nascem habilitadas
  }

  function dropZone(campo, texto) {
    var dz = el('div', { class:'kf-drop', 'data-drop': campo }, [texto]);
    dz.addEventListener('dragover', function (e) { e.preventDefault(); dz.classList.add('kf-over'); });
    dz.addEventListener('dragleave', function () { dz.classList.remove('kf-over'); });
    dz.addEventListener('drop', function (e) {
      e.preventDefault(); dz.classList.remove('kf-over');
      try {
        var p = JSON.parse(e.dataTransfer.getData('text/plain'));
        // item do Bazar vai para a coluna canônica, solte onde soltar no drawer
        if (p._bazar) { if (adicionar(p.item, {}, 'drawer')) toast('+ ' + p.item.nome); return; }
        var campoAlvo = p._campo || campo;      // roteia pelo tipo, não pela zona
        if (campoAlvo.indexOf('inventario') === 0) return;
        var ent = Object.assign({}, p); delete ent._campo; delete ent._bazar;
        addEntidade(campoAlvo, ent);
      } catch (x) {}
    });
    return dz;
  }

  // ---------------- Bazar (data/bazar.json) ----------------
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
          el('span', { class:'kf-btn sm', title:'Guardar (Shift+clique: 10)',
            onclick: function (ev) { addItemBazar(it, ev && ev.shiftKey ? 10 : 1); } }, ['+']),
          el('span', { class:'kf-nm', html: esc(it.nome) + ' <span style="color:#777">· ' + esc(it.raridade) + ' · ' + esc(it.valor) + ' Sins</span>' })
        ]));
      });
      if (!hits.length) res.appendChild(el('div', { style:'font-size:11px;color:#666' }, ['Nada encontrado']));
    }
    if (bazarCache) return achar();
    pedeCatalogo().then(achar)
      .catch(function () { res.appendChild(el('div', { style:'font-size:11px;color:#c0392b' }, ['Bazar indisponível (rode via servidor)'])); });
  }
  // coluna pela regra do registro (KhInv.colunaCanonica): acabou o roteamento por substring
  function addItemBazar(it, qtd) {
    if (adicionar(it, { qtd: qtd || 1 }, 'drawer')) toast('+ ' + (qtd > 1 ? qtd + '× ' : '') + it.nome);
  }

  // ---------------- decorar cards das páginas ----------------
  function textoLimpo(node) {
    if (!node) return '';
    var c = node.cloneNode(true);
    // .ent-add/.ent-alca (F1a): botão e alça da marcação nova nunca entram no nome
    c.querySelectorAll('.icon,.cat-icon,.category-icon,.toggle-icon,.kf-addbtn,.ent-add,.ent-alca,.spell-dot,.spell-toggle,svg').forEach(function (x) { x.remove(); });
    return c.textContent
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{FE00}-\u{FE0F}\u{DC00}-\u{DFFF}]/gu, '')
      .replace(/\+\s*ficha/g, '').replace(/\s+/g, ' ').trim();
  }
  function q1(card, sels) {
    var arr = sels.split(',');
    for (var i = 0; i < arr.length; i++) { var n = card.querySelector(arr[i].trim()); if (n) return n; }
    return null;
  }
  // Descrição levada para a ficha: o nó próprio quando o card tem (magia, carta,
  // dor); senão o card inteiro menos o que não é mecânica (títulos, custo,
  // citação, ambientação, botões). Antes era o 1º <p> do card, e 205 técnicas com
  // a mecânica em lista chegavam vazias (log de técnicas, 2026-09-26). O
  // tools/log_tecnicas.py lê estas duas listas daqui para conferir.
  // O h5 do corpo fica (subtítulos como "Lobo", "O Custo"); só sai o nó do nome.
  var DESC_PROPRIA = '.spell-desc,.dor-card-desc,.catalog-card-effect';
  var FORA_DA_MECANICA = 'h3,h4,svg,button,[class*="header"],[class*="quote"],[class*="flavor"],.cost,.tech-meta,.technique-cost,.price,.meta,.action,.stamina,.ultimate-badge,.kf-addbtn,.ent-add,.ent-alca';
  function descricaoCard(card, seletorNome) {
    var propria = q1(card, DESC_PROPRIA);
    if (propria) return textoLimpo(propria);
    var c = card.cloneNode(true);
    var nome = q1(c, seletorNome);
    if (nome) nome.remove();
    c.querySelectorAll(FORA_DA_MECANICA).forEach(function (x) { x.remove(); });
    // blocos colavam ("diante.O treinamento", "invocar:Médio"): espaço antes e depois de cada um
    c.querySelectorAll('li,p,div,tr,td,h5,h6,span').forEach(function (x) {
      x.insertBefore(document.createTextNode(' '), x.firstChild);
      x.appendChild(document.createTextNode(' '));
    });
    return textoLimpo(c).replace(/\s+([,.;:)])/g, '$1').replace(/\(\s+/g, '(');
  }
  // [seletor, campoFicha, tipo, seletorNome]. seletorNome é uma lista em ordem
  // de preferência (q1). Marca e ultimate: o nome é o h4 do header nas 6 classes
  // com .marca-header/.ultimate-header e o h5 no Espadachim; 'h5' puro pegava o
  // subtítulo do corpo ("O Custo", "Ativação") ou nada (marcas sem botão).
  var MAPA = [
    ['.spell-card', 'grimorio', 'magia', 'h4'],
    ['.technique-card', 'tecnicas', 'tecnica', 'h4,h5'],
    ['.tier-technique', 'tecnicas', 'tecnica', 'h5'],
    ['.tech-card', 'tecnicas', 'tecnica', 'h4,h5'],
    ['.ultimate-card', 'tecnicas', 'ultimate', '.ultimate-header h4,h5'],
    ['.marca-card', 'tecnicas', 'marca', '.marca-header h4,h5'],
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
        var ent = { id: slug(nome, m[2] + '-'), tipo: m[2], nome: nome,
          descricao: descricaoCard(card, m[3]) };
        var btn = el('span', { class:'kf-addbtn', title:'Adicionar à ficha',
          onclick: function (e) { e.stopPropagation(); e.preventDefault(); addEntidade(m[1], ent); } }, ['+ ficha']);
        (nomeNode || card).appendChild(btn);
        card.setAttribute('draggable', 'true'); card.classList.add('kf-draggable');
        card.addEventListener('dragstart', function (e) {
          e.dataTransfer.setData('text/plain', JSON.stringify(Object.assign({ _campo: m[1] }, ent))); });
      });
    });
    decorarBazar();
    decorarCorrupcao();
  }

  // linhas das tabelas de Corrupção/Adversidade (raça Corrompido) -> arrastáveis
  function decorarCorrupcao() {
    document.querySelectorAll('.corr-table tr').forEach(function (tr) {
      if (tr.getAttribute('data-kf')) return;
      var tds = tr.querySelectorAll('td');
      if (tds.length < 2) return; // pula o cabeçalho (th)
      var nome = textoLimpo(tds[0]);
      if (!nome) return;
      tr.setAttribute('data-kf', '1');
      var bloco = tr.closest('.corr-block');
      var tipo = (bloco && bloco.classList.contains('adv')) ? 'adversidade' : 'corrupção';
      var custo = tds[2] ? textoLimpo(tds[2]) : '';
      var ent = { id: slug(nome, tipo + '-'), tipo: tipo,
        nome: nome + (custo ? ' (' + custo + ')' : ''), descricao: textoLimpo(tds[1]) };
      tds[0].appendChild(el('span', { class: 'kf-addbtn', title: 'Adicionar à ficha',
        onclick: function (e) { e.stopPropagation(); e.preventDefault(); addEntidade('tecnicas', ent); } }, ['+ ficha']));
      tr.setAttribute('draggable', 'true'); tr.classList.add('kf-draggable');
      tr.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', JSON.stringify(Object.assign({ _campo: 'tecnicas' }, ent))); });
    });
  }

  // itens do Bazar (bazar.html) — renderizados dinamicamente: .item-card[data-n].
  // Em body[data-bazar] o catálogo chega por KF.catalogo() (sem 2º fetch) e o
  // rótulo vira "+ inventário"; Shift+clique guarda 10.
  function decorarBazar() {
    var itens = document.querySelectorAll('.item-card[data-n]:not([data-kf])');
    if (!itens.length) return;
    if (!bazarCache) {
      if (naBazar()) return;                       // decora quando o bazar.js chamar KF.catalogo
      pedeCatalogo().catch(function () { aplicaBazar(itens); });   // sucesso: catalogo() redecora
      return;
    }
    aplicaBazar(itens);
  }
  function aplicaBazar(itens) {
    var noBazar = naBazar();
    itens.forEach(function (card) {
      if (card.getAttribute('data-kf') || card.closest('[data-kf-ignorar]')) return;
      var nome = card.getAttribute('data-n');
      var it = (idxCatalogo && temPropria(idxCatalogo.porNome, nome) && idxCatalogo.porNome[nome]) ||
        { id: slug(nome, 'item-'), nome: nome, categoria:'', raridade:'', efeito:'', valor:'' };
      card.setAttribute('data-kf', '1');
      var alvo = card.querySelector('.item-name,.item-head') || card;
      alvo.appendChild(el('span', { class:'kf-addbtn',
        title: (noBazar ? 'Guardar no inventário' : 'Adicionar à ficha') + ' (Shift+clique: 10)',
        onclick: function (e) { e.stopPropagation(); e.preventDefault(); addItemBazar(it, e.shiftKey ? 10 : 1); } },
        [noBazar ? '+ inventário' : '+ ficha']));
      card.setAttribute('draggable', 'true'); card.classList.add('kf-draggable');
      card.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', JSON.stringify({ _bazar: true, item: it })); });
    });
  }

  // ---------------- Export / Import ----------------
  function baixar(nome, obj) {
    var blob = new Blob([JSON.stringify(obj, null, 2)], { type:'application/json' });
    var a = el('a', { href: URL.createObjectURL(blob), download: nome });
    document.body.appendChild(a); a.click(); a.remove();
  }
  // KF.exportar(): grava exportadoEm (o rodapé do inventário lê) e baixa
  function exportJSON() {
    sincroniza();
    // só-leitura: baixa a v2 como está, sem carimbar exportadoEm (nada é gravado)
    if (somenteLeitura) { baixar((ficha.meta.nome || 'ficha').replace(/\s+/g,'_') + '.khalkaria.json', ficha); return; }
    ficha.exportadoEm = agoraISO();
    commit(['tudo'], 'local', 'exportar');
    baixar((ficha.meta.nome || 'ficha').replace(/\s+/g,'_') + '.khalkaria.json', ficha);
  }
  // troca a ficha inteira: rev acima do atual (as outras abas adotam) e zera o desfazer
  function substitui(nova, origem) {
    sincroniza();
    var rev = ficha.rev;
    ficha = nova;
    ficha.rev = Math.max(rev, ficha.rev);
    desfazerPilha = [];
    commit(['tudo'], origem, origem);
    reconciliaCatalogo();
    // ficha importada fora do Bazar pode trazer entradas sem inv (v1 migrada):
    // sem isto o catálogo só seria pedido no próximo carregamento de página
    verificaPendentes();
  }
  // Por que um JSON (objeto) não entra aqui; null = é ficha v1/v2. Sem isto,
  // o que não tinha schemaVersion (pacote fichas/1 da v3, export do Bestiário,
  // JSON solto) caía no migra() e SUBSTITUÍA a ficha do jogador sem pedir.
  var MSG_NAO_FICHA = 'Este arquivo não é uma ficha do Khalkaria.';
  function ehObjeto(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
  function recusaImport(f) {
    if (f.schema === KhEstado.SCHEMA_INDICE || Array.isArray(f.fichas)) {
      return 'Este arquivo é um pacote de várias fichas da ficha nova e não entra aqui.';
    }
    if (f.type === 'npc' || f.type === 'monster') return 'Este arquivo é um export para o Bestiário, não uma ficha.';
    var sv = f.schemaVersion;
    // ficha v3 (schemaVersion >= 3) não é rebaixada
    if (parseFloat(String(sv)) >= 3) {
      return 'Esta ficha é da v3 (schemaVersion ' + sv + ') e não pode ser importada aqui. Recarregue a página.';
    }
    // sem schemaVersion: só a v1 antiga, que tem meta ou atributos (novaFicha da v1)
    if (sv == null || sv === '') return ehObjeto(f.meta) || ehObjeto(f.atributos) ? null : MSG_NAO_FICHA;
    return /^[12](?![0-9])/.test(String(sv).trim()) ? null : MSG_NAO_FICHA;
  }
  function importJSON() {
    if (bloqueado()) return;
    var inp = el('input', { type:'file', accept:'.json,application/json' });
    inp.addEventListener('change', function () {
      var fr = new FileReader();
      fr.onload = function () {
        var f;
        try { f = JSON.parse(fr.result); } catch (e) { f = null; }
        if (!f || typeof f !== 'object' || Array.isArray(f)) { toast('JSON inválido'); return; }
        // o que não é ficha v1/v2 é recusado sem tocar em nada
        var recusa = recusaImport(f);
        if (recusa) { toast(recusa, 6000); return; }
        if (bloqueado()) return;
        var nova = migra(f);
        substitui(nova, 'import');
        if (f.schemaVersion !== SCHEMA_VERSION && temItens(nova)) toast('Ficha importada. ' + MSG_MIGRACAO, 8000);
        else toast('Ficha importada');
      };
      fr.readAsText(inp.files[0]);
    });
    inp.click();
  }
  function resetFicha() {
    if (bloqueado()) return;
    if (!confirm('Nova ficha? A atual será substituída (exporte antes se quiser guardar).')) return;
    substitui(novaFicha(), 'reset'); toast('Nova ficha');
  }

  // projeção Bestiário (type:npc) — ver data/ficha-v2.schema.json x-bestiary
  function exportBestiario() {
    var b = { type:'npc', name: ficha.meta.nome || 'Personagem', race: ficha.meta.raca,
      npc_class: ficha.meta.classe, level: ficha.meta.nivel };
    ATTRS.forEach(function (a) { b[ATTR_BEST[a[0]]] = ficha.atributos[a[0]]; });
    b.health_max = ficha.recursos.saude.max; b.stamina_max = ficha.recursos.stamina.max;
    b.ether_max = ficha.recursos.eter.max;
    b.evasion = ficha.derivadosManuais.evasao; b.movement = ficha.derivadosManuais.movimento;
    b.armor = ficha.derivadosManuais.armadura;
    // prof_* sai como GRAU 0-4 (D5a): KhInv.grauPericia(bônus 0/2/4/6/8)
    PERICIAS.forEach(function (p) { b[p[2]] = KhInv.grauPericia(ficha.pericias[p[0]]); });
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
    // token exato 'Arma' nas duas colunas, equipadas primeiro (armaduras não saem mais aqui)
    b.weapons = KhInv.armasBestiario(ficha.inventario);
    baixar((ficha.meta.nome || 'personagem').replace(/\s+/g,'_') + '.bestiario.json', b);
    toast('Export Bestiário (type:npc)');
  }

  // abre o drawer e expande a seção (antes do init, fica para o init)
  function abrir(secao) {
    if (!body) { abrirPendente = secao || ''; return; }
    setOpen(true);
    var s = secao ? body.querySelector('.kf-sec[data-sec="' + secao + '"]') : null;
    if (s) {
      s.classList.remove('kf-collapsed');
      if (s.scrollIntoView) s.scrollIntoView({ block: 'start' });
    }
  }

  // ---------------- init ----------------
  function init() {
    buildDrawer(); decorar();
    if (migrouAgora) { migrouAgora = false; toast(MSG_MIGRACAO, 8000); }
    if (somenteLeitura) toast(MSG_RO, 6000);
    // conteúdo dinâmico (ex.: Bazar re-renderiza o grid ao filtrar) -> re-decora.
    // Mudança dentro de [data-kf-ignorar] (drawer, toast, inventário do Bazar) não conta.
    try {
      var obs = new MutationObserver(function (regs) {
        var conta = regs.some(function (r) {
          var t = r.target;
          if (t && t.nodeType !== 1) t = t.parentElement;
          return !(t && t.closest && t.closest('[data-kf-ignorar]'));
        });
        if (!conta) return;
        clearTimeout(obsT); obsT = setTimeout(decorar, 150);
      });
      obs.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
    verificaPendentes();
    if (abrirPendente !== null) { var s = abrirPendente; abrirPendente = null; abrir(s); }
  }

  // sincronia entre abas e páginas: storage não basta (bfcache precisa de pageshow)
  // storage: o marcador DONO_KEY (ou clear(), key null) troca o modo; LS_KEY adota
  window.addEventListener('storage', function (e) {
    if (e.key === DONO_KEY || e.key == null) confereDono();
    if (e.key === LS_KEY) sincroniza();
  });
  window.addEventListener('pageshow', function () { sincroniza(); });
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') flush();
    else if (document.visibilityState === 'visible') sincroniza();
  });

  // ---------------- API (spec §5.3). Leituras devolvem cópia. ----------------
  function invDe() {
    var i = ficha.inventario;
    return { sins: i.sins, bugigangas: i.bugigangas, equipamentos: i.equipamentos };
  }
  raiz.KF = Object.freeze({
    versao: '2',
    inventario: function () { return clone(invDe()); },
    carga: function () { return cargaAtual(); },
    projetar: function (item, opts) { return KhInv.projetar(invDe(), ficha.atributos.for, doCatalogo(item), opts); },
    quantidadePorId: function () { return KhInv.quantidadePorId(ficha.inventario); },
    tenho: function (id) { return KhInv.quantidadePorId(ficha.inventario)[id] || 0; },
    atributo: function (k) { var n = parseInt(ficha.atributos[String(k || '').toLowerCase()], 10); return isFinite(n) ? n : 0; },
    migradoEm: function () { return ficha.migradoEm || ''; },
    exportadoEm: function () { return ficha.exportadoEm || ''; },
    nome: function () { return String((ficha.meta && ficha.meta.nome) || '').trim(); },
    adicionar: function (item, opts) { return adicionar(item, opts, 'local'); },
    quantidade: function (uid, n) { return quantidade(uid, n, 'local'); },
    alternar: function (uid, campo) { return alternar(uid, campo, 'local'); },
    trocar: function (uid, campo, uidsASoltar) { return trocar(uid, campo, uidsASoltar, 'local'); },
    mover: function (uid, coluna) { return mover(uid, coluna, 'local'); },
    remover: function (uid) { return remover(uid, 'local'); },
    definirSins: function (n) { return definirSins(n, 'local'); },
    lote: lote,
    desfazer: desfazer,
    podeDesfazer: function () { return !somenteLeitura && desfazerPilha.length > 0; },
    somenteLeitura: function () { return confereDono(); },
    catalogo: catalogo,
    abrir: abrir,
    exportar: exportJSON
  });
  try { document.dispatchEvent(new CustomEvent('kf:pronta', { detail: { versao: '2' } })); } catch (e) {}

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(typeof window !== 'undefined' ? window : this);
