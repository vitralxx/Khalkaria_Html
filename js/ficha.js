/* Khalkaria — Ficha Interativa (MVP)
 * Drawer persistente (localStorage) + DnD/"+ Adicionar" das páginas de regras +
 * derivados calculados + Export/Import JSON + projeção para o Bestiário (type:npc).
 * Não é SPA: re-hidrata no DOMContentLoaded. Schema: data/ficha.schema.json.
 *
 * O topo do arquivo é o KhInv, motor PURO do inventário (sem DOM, sem
 * localStorage). No node (tools/testes) o arquivo exporta só o KhInv e para
 * ali; no navegador vira window.KhInv e o resto da ficha segue.
 */
(function (raiz) {
  'use strict';

  // ================= KhInv: motor de carga e inventário (PURO) =================
  // Regras do texto do Sistema (validar.py confere as frases). Pendências do
  // Pedro marcadas: munição 20:1 (CLAUDE.md) × 10:1 (CSV); limites Pesada/Leve
  // independentes; bônus de mochilas diferentes somam.
  var KhInv = (function () {
    var REGRAS = Object.freeze({
      BASE_BUG: 10, BASE_EQ: 2, MIN: 1, PILHA: 10 /* pendente: munição */,
      LIM_PESADA: 1, LIM_LEVE: 2, LIM_SINTONIA: 3, QTD_MAX: 9999,
      FRASE_EMPILHA: 'Empilhável: pesa 1 bugiganga a cada 10 unidades'
    });
    var COLUNAS = ['bugigangas', 'equipamentos'];
    var EQUIP_TOKENS = ['Arma', 'Armadura', 'Escudo'];
    // mesma regra do RE_EMPILHA de tools/gerar_bazar.py (a Bolsa de Couro diz "Não é empilhável")
    var RE_EMPILHA = /(?<!Não é )[Ee]mpilh[aá]vel:\s*pesa 1 bugiganga a cada 10 unidades/;
    var CAMPOS_SNAPSHOT = ['nome', 'categoria', 'raridade', 'arquetipo', 'arte', 'efeito', 'valor'];

    function clone(x) { return x === undefined ? undefined : JSON.parse(JSON.stringify(x)); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function tokens(cat) {
      return str(cat).split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    }
    function empilhavelPorTexto(efeito) { return RE_EMPILHA.test(str(efeito)); }
    function colunaCanonica(x) {
      x = x || {};
      if (x.inv && typeof x.inv === 'object') return x.inv.slot === 'equipamento' ? 'equipamentos' : 'bugigangas';
      var equip = tokens(x.categoria).some(function (t) { return EQUIP_TOKENS.indexOf(t) >= 0; });
      return (equip && !empilhavelPorTexto(x.efeito)) ? 'equipamentos' : 'bugigangas';
    }
    // FOR vazia, nula ou inválida conta como 0 (FOR 0 ou vazia: 5 e 1)
    function modFor(F) { var n = parseInt(F, 10); if (!isFinite(n)) n = 0; return Math.floor((n - 10) / 2); }
    function qtdDe(e) {
      var n = parseInt(e && e.qtd, 10);
      if (!(n >= 1)) n = 1;
      return Math.min(REGRAS.QTD_MAX, n);
    }
    function estado(u, m) { return u <= m ? 'ok' : (u < 2 * m ? 'leve' : 'extremo'); }
    var ORDEM_ESTADO = { ok: 0, leve: 1, extremo: 2 };
    function semAcento(s) { return str(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim(); }
    // chave de fusão: (coluna, id || nome); avulso só funde com avulso de mesmo nome
    function chave(e) {
      if (e.avulso) return 'a:' + semAcento(e.nome);
      return e.id ? 'i:' + e.id : 'n:' + str(e.nome);
    }
    function novoUid(usados) {
      var u;
      do { u = 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
      while (usados && usados[u]);
      if (usados) usados[u] = true;
      return u;
    }
    function uidsDe(inv) {
      var u = {};
      COLUNAS.forEach(function (c) { lista(inv && inv[c]).forEach(function (e) { if (e && e.uid) u[e.uid] = true; }); });
      return u;
    }
    function acha(inv, uid) {
      for (var i = 0; i < COLUNAS.length; i++) {
        var l = lista(inv && inv[COLUNAS[i]]);
        for (var j = 0; j < l.length; j++) if (l[j] && l[j].uid === uid) return { coluna: COLUNAS[i], lista: l, indice: j, entrada: l[j] };
      }
      return null;
    }
    function pega(mapa, k) {
      if (!mapa || !k) return undefined;
      if (typeof mapa.get === 'function') return mapa.get(k);
      return Object.prototype.hasOwnProperty.call(mapa, k) ? mapa[k] : undefined;
    }

    // Entrada v2 (§5.2). Preserva chaves desconhecidas; apaga slotPeso/tipo da v1.
    function normalizaEntrada(e, usados) {
      var o = Object.assign({}, e || {});
      delete o.slotPeso; delete o.tipo;
      if (typeof o.uid !== 'string' || !o.uid || (usados && usados[o.uid])) o.uid = novoUid(usados);
      else if (usados) usados[o.uid] = true;
      o.avulso = o.avulso === true;
      o.id = o.avulso ? '' : str(o.id);
      CAMPOS_SNAPSHOT.forEach(function (k) { o[k] = str(o[k]); });
      o.inv = (o.inv && typeof o.inv === 'object' && !Array.isArray(o.inv)) ? clone(o.inv) : null;
      o.qtd = qtdDe(o);
      if (typeof o.empilhavelRegistro !== 'boolean') {
        o.empilhavelRegistro = o.avulso ? null : (o.inv ? !!o.inv.empilhavel : empilhavelPorTexto(o.efeito));
      }
      if (typeof o.empilhavel !== 'boolean') o.empilhavel = !!o.empilhavelRegistro;
      o.equipado = o.equipado === true;
      o.equipadoEm = (o.equipado && typeof o.equipadoEm === 'string') ? o.equipadoEm : null;
      o.sintonizado = o.sintonizado === true;
      o.secaoManual = o.secaoManual === true;
      o.orfao = o.orfao === true;
      return o;
    }
    // snapshot de um item do bazar.json (ou {avulso:true, nome})
    function entradaDeItem(item) {
      item = item || {};
      if (item.avulso) return { avulso: true, nome: str(item.nome).trim() };
      var o = { id: str(item.id), inv: (item.inv && typeof item.inv === 'object') ? clone(item.inv) : null };
      CAMPOS_SNAPSHOT.forEach(function (k) { o[k] = str(item[k]); });
      return o;
    }
    // funde entradas NÃO equipadas de mesma chave, somando qtd (a 1ª fica)
    function fundir(l) {
      var vistos = {}, out = [];
      lista(l).forEach(function (e) {
        if (e.equipado) { out.push(e); return; }
        var k = chave(e);
        if (vistos[k]) { vistos[k].qtd = Math.min(REGRAS.QTD_MAX, qtdDe(vistos[k]) + qtdDe(e)); return; }
        vistos[k] = e; out.push(e);
      });
      return out;
    }

    // ---- Carga (§6) ----
    function calcular(inv, forca) {
      inv = inv || {};
      var m = modFor(forca);
      var cols = { bugigangas: lista(inv.bugigangas), equipamentos: lista(inv.equipamentos) };
      var carga = {
        forca: (function () { var n = parseInt(forca, 10); return isFinite(n) ? n : 0; })(),
        modFor: m, pesoTotal: 0, condicao: 'nenhuma',
        bugigangas: { usado: 0, max: 0, base: Math.max(REGRAS.MIN, REGRAS.BASE_BUG + m), bonus: [], estado: 'ok' },
        equipamentos: { usado: 0, max: 0, base: Math.max(REGRAS.MIN, REGRAS.BASE_EQ + m), bonus: [], estado: 'ok' },
        pesoPorUid: {}, motivoPorUid: {}, avisos: []
      };
      // bônus de capacidade: por id distinto, em qualquer coluna (o mínimo 1 vale só para a base)
      var caps = {}, ordem = [];
      COLUNAS.forEach(function (c) {
        cols[c].forEach(function (e) {
          if (!e || !e.inv || !e.inv.capacidade) return;
          var k = e.id || e.uid;
          if (!caps[k]) { caps[k] = { id: e.id || '', nome: e.nome, inv: e.inv, total: 0, uids: [] }; ordem.push(k); }
          caps[k].total += qtdDe(e); caps[k].uids.push(e.uid);
        });
      });
      ordem.forEach(function (k) {
        var cp = caps[k], cap = cp.inv.capacidade;
        var mult = cp.inv.acumula === false ? 1 : cp.total, ign = cp.total - mult;
        if (cap.bug) carga.bugigangas.bonus.push({ id: cp.id, nome: cp.nome, n: cap.bug * mult, ignoradas: ign });
        if (cap.equip) carga.equipamentos.bonus.push({ id: cp.id, nome: cp.nome, n: cap.equip * mult, ignoradas: ign });
        if (ign > 0) carga.avisos.push({ tipo: 'copia', uids: cp.uids.slice(),
          msg: (cp.total > 2 ? 'Da 2ª à ' + cp.total + 'ª ' : '2ª ') + cp.nome + ' não acumula' });
      });
      // peso por entrada
      COLUNAS.forEach(function (c) {
        var grupos = {}, ordemG = [], col = carga[c];
        cols[c].forEach(function (e, i) {
          if (!e) return;
          var uid = e.uid || (c + '#' + i);
          if (e.inv && e.inv.ocupa === false) { carga.pesoPorUid[uid] = 0; carga.motivoPorUid[uid] = 'nao-ocupa'; }
          else if (c === 'equipamentos' && e.equipado) { carga.pesoPorUid[uid] = 0; carga.motivoPorUid[uid] = 'equipado'; }
          else if (e.empilhavel) {
            var k = e.id || uid;
            if (!grupos[k]) { grupos[k] = { uid: uid, soma: 0 }; ordemG.push(k); }
            grupos[k].soma += qtdDe(e);
            carga.pesoPorUid[uid] = 0; carga.motivoPorUid[uid] = 'pilha';
          } else { carga.pesoPorUid[uid] = qtdDe(e); carga.motivoPorUid[uid] = 'unidade'; }
        });
        ordemG.forEach(function (k) { carga.pesoPorUid[grupos[k].uid] = Math.ceil(grupos[k].soma / REGRAS.PILHA); });
        cols[c].forEach(function (e, i) { if (e) col.usado += carga.pesoPorUid[e.uid || (c + '#' + i)]; });
        col.max = col.base + col.bonus.reduce(function (s, b) { return s + b.n; }, 0);
        col.estado = estado(col.usado, col.max);
      });
      carga.pesoTotal = carga.bugigangas.usado + carga.equipamentos.usado;
      var pior = ORDEM_ESTADO[carga.bugigangas.estado] >= ORDEM_ESTADO[carga.equipamentos.estado]
        ? carga.bugigangas.estado : carga.equipamentos.estado;
      carga.condicao = pior === 'ok' ? 'nenhuma' : pior;
      // limites de equipamento (estado importado acima do limite vira aviso, não bloqueio)
      [['Pesada', 'pesada', REGRAS.LIM_PESADA], ['Leve', 'leve', REGRAS.LIM_LEVE]].forEach(function (a) {
        var eq = cols.equipamentos.filter(function (e) { return e && e.equipado && e.inv && e.inv.armadura === a[0]; });
        var n = eq.reduce(function (s, e) { return s + qtdDe(e); }, 0);
        if (n > a[2]) carga.avisos.push({ tipo: a[1], uids: eq.map(function (e) { return e.uid; }),
          msg: n + ' Armaduras ' + a[0] + 's equipadas; o limite é ' + a[2] });
      });
      var sint = cols.bugigangas.concat(cols.equipamentos).filter(function (e) { return e && e.sintonizado; });
      var ns = sint.reduce(function (s, e) { return s + qtdDe(e); }, 0);
      if (ns > REGRAS.LIM_SINTONIA) carga.avisos.push({ tipo: 'sintonia', uids: sint.map(function (e) { return e.uid; }),
        msg: ns + ' Itens Mágicos sintonizados; o limite é ' + REGRAS.LIM_SINTONIA });
      COLUNAS.forEach(function (c) {
        cols[c].forEach(function (e) {
          if (!e) return;
          var canon = colunaCanonica(e);
          if (!e.avulso && canon !== c) carga.avisos.push({ tipo: 'fora-da-regra', uids: [e.uid],
            msg: e.nome + ' está em ' + (c === 'bugigangas' ? 'Bugigangas' : 'Equipamentos') +
              '; o registro manda para ' + (canon === 'bugigangas' ? 'Bugigangas' : 'Equipamentos') });
          if (e.orfao && !e.avulso) carga.avisos.push({ tipo: 'orfao', uids: [e.uid],
            msg: e.nome + ' não está mais no registro do Bazar' });
        });
      });
      return carga;
    }

    // ---- mutadores puros (mexem no inv recebido; quem chama tira o snapshot) ----
    // adiciona com fusão na entrada não equipada de mesma chave na coluna-alvo
    function mesclar(inv, item, opts) {
      opts = opts || {};
      var n = qtdDe({ qtd: opts.qtd == null ? 1 : opts.qtd });
      var base = entradaDeItem(item);
      var canon = colunaCanonica(base);
      var coluna = COLUNAS.indexOf(opts.coluna) >= 0 ? opts.coluna : canon;
      if (!Array.isArray(inv[coluna])) inv[coluna] = [];
      var k = chave(base);
      var alvo = inv[coluna].filter(function (x) { return x && !x.equipado && chave(x) === k; })[0];
      if (alvo) { alvo.qtd = Math.min(REGRAS.QTD_MAX, qtdDe(alvo) + n); return { uid: alvo.uid, coluna: coluna, fundiu: true }; }
      base.qtd = n;
      base.secaoManual = !base.avulso && coluna !== canon;
      var e = normalizaEntrada(base, uidsDe(inv));
      inv[coluna].push(e);
      return { uid: e.uid, coluna: coluna, fundiu: false };
    }
    function remover(inv, uid) {
      var a = acha(inv, uid);
      if (!a) return null;
      a.lista.splice(a.indice, 1);
      return a.entrada;
    }
    // n < 1 remove; teto 9999
    function quantidade(inv, uid, n) {
      var a = acha(inv, uid);
      if (!a) return { ok: false };
      n = parseInt(n, 10);
      if (!(n >= 1)) { a.lista.splice(a.indice, 1); return { ok: true, removido: true }; }
      a.entrada.qtd = Math.min(REGRAS.QTD_MAX, n);
      return { ok: true, removido: false };
    }
    // sair de Equipamentos limpa o Equipado; coluna fora da canônica marca secaoManual
    function mover(inv, uid, coluna) {
      var a = acha(inv, uid);
      if (!a || COLUNAS.indexOf(coluna) < 0) return { ok: false };
      if (a.coluna === coluna) return { ok: true, uid: uid };
      var e = a.entrada;
      a.lista.splice(a.indice, 1);
      if (a.coluna === 'equipamentos') { e.equipado = false; e.equipadoEm = null; }
      e.secaoManual = !e.avulso && coluna !== colunaCanonica(e);
      if (!Array.isArray(inv[coluna])) inv[coluna] = [];
      var k = chave(e);
      var alvo = inv[coluna].filter(function (x) { return x && !x.equipado && chave(x) === k; })[0];
      if (alvo) { alvo.qtd = Math.min(REGRAS.QTD_MAX, qtdDe(alvo) + qtdDe(e)); return { ok: true, uid: alvo.uid }; }
      inv[coluna].push(e);
      return { ok: true, uid: e.uid };
    }
    // limites: null se pode ligar `campo` em `uid`; senão {tipo, uids das que ocupam o limite}
    function conflito(inv, uid, campo) {
      var a = acha(inv, uid);
      if (!a) return null;
      var e = a.entrada;
      if (campo === 'equipado') {
        var arm = e.inv && e.inv.armadura;
        if (arm !== 'Pesada' && arm !== 'Leve') return null;   // armas e escudos não têm limite
        var lim = arm === 'Pesada' ? REGRAS.LIM_PESADA : REGRAS.LIM_LEVE;
        var outros = lista(inv.equipamentos).filter(function (x) { return x !== e && x.equipado && x.inv && x.inv.armadura === arm; });
        var n = outros.reduce(function (s, x) { return s + qtdDe(x); }, 0);
        return n + 1 > lim ? { tipo: arm === 'Pesada' ? 'pesada' : 'leve', uids: outros.map(function (x) { return x.uid; }) } : null;
      }
      if (campo === 'sintonizado') {
        var sint = lista(inv.bugigangas).concat(lista(inv.equipamentos)).filter(function (x) { return x !== e && x.sintonizado; });
        var ns = sint.reduce(function (s, x) { return s + qtdDe(x); }, 0);
        return ns + qtdDe(e) > REGRAS.LIM_SINTONIA ? { tipo: 'sintonia', uids: sint.map(function (x) { return x.uid; }) } : null;
      }
      return null;
    }
    // {ok:true, uid} | {ok:false, conflito:{tipo, uids}} | {ok:false, erro}. Com conflito nada muda.
    function alternar(inv, uid, campo, agora) {
      var a = acha(inv, uid);
      if (!a) return { ok: false, erro: 'uid' };
      var e = a.entrada;
      if (campo === 'empilhavel') { e.empilhavel = !e.empilhavel; return { ok: true, uid: uid }; }
      if (campo === 'sintonizado') {
        if (!e.sintonizado) { var cs = conflito(inv, uid, campo); if (cs) return { ok: false, conflito: cs }; }
        e.sintonizado = !e.sintonizado;
        return { ok: true, uid: uid };
      }
      if (campo !== 'equipado') return { ok: false, erro: 'campo' };
      if (e.equipado) {   // desequipar: funde de volta na não equipada de mesmo id na mesma coluna
        e.equipado = false; e.equipadoEm = null;
        var k = chave(e);
        var alvo = a.lista.filter(function (x) { return x !== e && !x.equipado && chave(x) === k; })[0];
        if (alvo) {
          alvo.qtd = Math.min(REGRAS.QTD_MAX, qtdDe(alvo) + qtdDe(e));
          a.lista.splice(a.lista.indexOf(e), 1);
          return { ok: true, uid: alvo.uid };
        }
        return { ok: true, uid: uid };
      }
      if (a.coluna !== 'equipamentos') return { ok: false, erro: 'coluna' };
      var cf = conflito(inv, uid, campo);
      if (cf) return { ok: false, conflito: cf };
      agora = agora || new Date().toISOString();
      if (qtdDe(e) > 1) {   // separa 1 unidade numa entrada própria, posta logo antes
        e.qtd = qtdDe(e) - 1;
        var nova = clone(e);
        nova.uid = novoUid(uidsDe(inv)); nova.qtd = 1; nova.equipado = true; nova.equipadoEm = agora;
        a.lista.splice(a.indice, 0, nova);
        return { ok: true, uid: nova.uid };
      }
      e.equipado = true; e.equipadoEm = agora;
      return { ok: true, uid: uid };
    }
    // "Trocar por esta": solta as que ocupam o limite e liga `campo` em uid
    function trocar(inv, uid, campo, uidsASoltar, agora) {
      lista(uidsASoltar).forEach(function (u) {
        var a = acha(inv, u);
        if (a && a.entrada[campo]) alternar(inv, u, campo, agora);
      });
      var a2 = acha(inv, uid);
      if (a2 && a2.entrada[campo]) return { ok: true, uid: uid };
      return alternar(inv, uid, campo, agora);
    }
    function projetar(inv, forca, item, opts) {
      var antes = calcular(inv, forca);
      var copia = clone(inv || {});
      COLUNAS.forEach(function (c) { if (!Array.isArray(copia[c])) copia[c] = []; });
      var r = mesclar(copia, item, opts);
      var depois = calcular(copia, forca);
      function foto(cg) {
        var col = cg[r.coluna];
        return { usado: col.usado, max: col.max, estado: col.estado, condicao: cg.condicao };
      }
      return { coluna: r.coluna, antes: foto(antes), depois: foto(depois) };
    }
    function quantidadePorId(inv) {
      var q = {};
      COLUNAS.forEach(function (c) {
        lista(inv && inv[c]).forEach(function (e) { if (e && e.id && !e.avulso) q[e.id] = (q[e.id] || 0) + qtdDe(e); });
      });
      return q;
    }

    // ---- Migração v1 → v2 (§5.6), idempotente; devolve cópia ----
    function migrarV1(f, agora) {
      agora = agora || new Date().toISOString();
      var out = clone(f && typeof f === 'object' ? f : {});
      var inv = (out.inventario && typeof out.inventario === 'object' && !Array.isArray(out.inventario)) ? out.inventario : {};
      var eraV1 = out.schemaVersion !== '2.0';
      var usados = {}, novo = { bugigangas: [], equipamentos: [] }, rerota = [];
      // v2 (tem uid, em coluna v2) fica onde está; o resto é re-roteado pela canônica.
      // Numa 2.0 isso pega as listas velhas que um ficha.js antigo em cache recria.
      ['armas', 'equipamentos', 'bugigangas', 'materiais'].forEach(function (k) {
        lista(inv[k]).forEach(function (e) {
          if (!e || typeof e !== 'object') return;
          if (!eraV1 && COLUNAS.indexOf(k) >= 0 && typeof e.uid === 'string' && e.uid) novo[k].push(normalizaEntrada(e, usados));
          else rerota.push(e);
        });
      });
      rerota.forEach(function (e) {
        var n = normalizaEntrada(Object.assign({}, e, { secaoManual: false }), usados);
        var c = colunaCanonica(n);
        if (c !== 'equipamentos') { n.equipado = false; n.equipadoEm = null; }
        novo[c].push(n);
      });
      delete inv.armas; delete inv.materiais;
      var sins = Math.floor(Number(inv.sins));
      inv.sins = sins > 0 ? sins : 0;
      inv.bugigangas = fundir(novo.bugigangas);
      inv.equipamentos = fundir(novo.equipamentos);
      out.inventario = inv;
      if (eraV1) { out.schemaVersion = '2.0'; out.migradoEm = agora; }
      return out;
    }

    // ---- Reconciliação com o catálogo (§5.7); muda inv no lugar, devolve se mudou ----
    function indexar(catalogo) {
      var porId = {}, porNome = {};
      lista(catalogo).forEach(function (it) {
        if (!it) return;
        if (it.id && !porId[it.id]) porId[it.id] = it;
        if (it.nome && !porNome[it.nome]) porNome[it.nome] = it;
      });
      return { porId: porId, porNome: porNome };
    }
    function reconciliar(inv, porId, porNome) {
      var mudou = false;
      COLUNAS.forEach(function (c) {
        lista(inv && inv[c]).forEach(function (e) {
          if (!e || e.avulso) return;
          var antes = JSON.stringify(e);
          var it = pega(porId, e.id) || pega(porNome, e.nome);
          if (!it) e.orfao = true;   // nunca apagado: pesa pelo snapshot
          else {
            var regAntigo = e.empilhavelRegistro;
            CAMPOS_SNAPSHOT.forEach(function (k) { e[k] = str(it[k]); });
            if (it.id) e.id = String(it.id);
            e.inv = (it.inv && typeof it.inv === 'object') ? clone(it.inv) : null;
            var regNovo = e.inv ? !!e.inv.empilhavel : empilhavelPorTexto(e.efeito);
            if (e.empilhavel === regAntigo) e.empilhavel = regNovo;   // se o jogador divergiu, fica a escolha dele
            e.empilhavelRegistro = regNovo;
            e.orfao = false;
          }
          if (JSON.stringify(e) !== antes) mudou = true;
        });
      });
      return mudou;
    }

    // ---- Export Bestiário (§5.8): token exato 'Arma', equipadas primeiro ----
    function armasBestiario(inv) {
      var todas = lista(inv && inv.equipamentos).concat(lista(inv && inv.bugigangas)).filter(function (e) {
        return e && tokens(e.categoria).indexOf('Arma') >= 0;
      });
      return todas.filter(function (e) { return e.equipado; }).concat(todas.filter(function (e) { return !e.equipado; }))
        .map(function (e) {
          var arq = str(e.arquetipo);
          var w = { name: str(e.nome), category: arq, level: (/ \+([1-3])$/.exec(str(e.nome)) || [])[1] || '0',
            dado: '', atributo: 'Força', dano: '', efeito: str(e.efeito) };
          if (arq.indexOf('Foco Místico') === 0) w.mystic = true;
          return w;
        });
    }

    return {
      REGRAS: REGRAS, COLUNAS: COLUNAS.slice(),
      tokens: tokens, empilhavelPorTexto: empilhavelPorTexto, colunaCanonica: colunaCanonica,
      modFor: modFor, estado: estado, calcular: calcular, projetar: projetar,
      conflito: conflito, alternar: alternar, trocar: trocar,
      novoUid: novoUid, chave: chave, acha: acha,
      normalizaEntrada: normalizaEntrada, entradaDeItem: entradaDeItem,
      mesclar: mesclar, fundir: fundir, remover: remover, quantidade: quantidade, mover: mover,
      quantidadePorId: quantidadePorId,
      migrarV1: migrarV1, indexar: indexar, reconciliar: reconciliar, armasBestiario: armasBestiario
    };
  })();
  // node:test carrega só o motor e para aqui: nada abaixo toca em window/document/localStorage
  if (typeof module === 'object' && module && module.exports) { module.exports = KhInv; return; }
  raiz.KhInv = KhInv;

  var LS_KEY = 'khalkaria_ficha';
  var OPEN_KEY = 'khalkaria_ficha_open';
  var BACKUP_KEY = 'khalkaria_ficha_v1_backup';
  var SCHEMA_VERSION = '2.0';
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

  function agoraISO() { return new Date().toISOString(); }
  function clone(x) {
    if (typeof structuredClone === 'function') return structuredClone(x);
    return x === undefined ? undefined : JSON.parse(JSON.stringify(x));
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
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
  var MSG_MIGRACAO = 'Inventário convertido: 4 listas → 2 colunas. Armaduras e materiais agora pesam; marque o que está Equipado.';
  function guardaBackup(raw) {
    if (lsGet(BACKUP_KEY) != null) return;   // nunca sobrescreve o backup
    try { localStorage.setItem(BACKUP_KEY, raw); } catch (e) {}
  }

  var ficha = load();
  // Só aqui grava o backup (spec §5.6.1). A ficha migrada vai para o storage na
  // hora, com rev++, para que as outras abas adotem a v2.
  function load() {
    var raw = lsGet(LS_KEY);
    if (!raw) return novaFicha();
    var f;
    try { f = JSON.parse(raw); } catch (e) { f = null; }
    if (!f || typeof f !== 'object' || Array.isArray(f)) { guardaBackup(raw); return novaFicha(); }
    if (f.schemaVersion !== SCHEMA_VERSION) guardaBackup(raw);
    var m = migra(f);
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
  function save() { clearTimeout(saveT); saveT = setTimeout(flush, 200); }
  function flush() {
    if (saveT == null) return;
    clearTimeout(saveT); saveT = null;
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
    if (idxCatalogo) reconciliaCatalogo(); else verificaPendentes();
    return true;
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
  function muta(op, origem, fn) {
    if (loteN) return fn();
    sincroniza();
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
    return r ? r.uid : null;
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
    sincroniza();
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
    sincroniza();
    if (!desfazerPilha.length) return false;
    ficha.inventario = JSON.parse(desfazerPilha.pop());
    commit(['inventario', 'sins'], 'desfazer', 'desfazer');
    return true;
  }

  // ---------------- catálogo e reconciliação (spec §5.6/§5.7) ----------------
  function naBazar() { return !!(document.body && document.body.hasAttribute('data-bazar')); }
  function reconciliaCatalogo() {
    if (!idxCatalogo) return;
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
    sincroniza();
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
  // Inventário do drawer (§4.11). Bloco próprio, fora do injectCSS (que é dívida
  // registrada e não muda nesta entrega). Cores do §10 em hex, como o drawer.
  function injectCSSInventario() {
    if (document.getElementById('kf-css-inv')) return;
    var mono = 'ui-monospace,"Cascadia Mono",Consolas,monospace';
    var css = document.createElement('style'); css.id = 'kf-css-inv';
    css.textContent = [
      '.kf-sec-nota{font-family:"Crimson Text",Georgia,serif;font-size:12px;font-style:italic;letter-spacing:0;color:#8a857c}',
      '.kf-carga{margin:2px 0 10px}',
      '.kf-carga-topo{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:4px}',
      '.kf-peso{font-size:12px;color:#9a968e;line-height:1.2}',
      '.kf-peso b{font-family:' + mono + ';font-variant-numeric:tabular-nums;font-size:1.25rem;color:#e6e2da;margin-left:6px;font-weight:600}',
      '.kf-peso small{display:block;font-size:11px;color:#7a766e}',
      '.kf-cond{margin-left:auto;font-family:Cinzel,serif;font-size:10px;letter-spacing:.1em;text-transform:uppercase;padding:3px 8px;border-radius:3px;text-decoration:none;white-space:nowrap}',
      '.kf-cond-nenhuma{color:#8a857c;border:1px solid #2a2a35}',
      '.kf-cond-leve{color:#120d06;background:#e08b2c}',
      '.kf-cond-extremo{color:#ffe9e4;background:#8b2635}',
      'a.kf-cond:hover,a.kf-cond:focus-visible{text-decoration:underline}',
      '.kf-carga-col{margin-top:8px}',
      '.kf-carga-lin{display:flex;align-items:baseline;gap:8px;font-size:12px}',
      '.kf-carga-nome{font-family:Cinzel,serif;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#c9a94a}',
      '.kf-carga-num{font-family:' + mono + ';font-variant-numeric:tabular-nums;color:#9a968e;cursor:help}',
      '.kf-carga-num b{font-size:14px;color:#f0d77a}',
      '.kf-est-leve .kf-carga-num b{color:#e08b2c}.kf-est-extremo .kf-carga-num b{color:#ff6b5a}',
      '.kf-carga-est{margin-left:auto;font-style:italic;font-size:12px;color:#9a968e}',
      '.kf-est-leve .kf-carga-est{color:#e08b2c}.kf-est-extremo .kf-carga-est{color:#ff6b5a}',
      '.kf-regua{position:relative;height:8px;border-radius:2px;background:#0a0a10;box-shadow:inset 0 0 0 1px #2a2a35;margin:4px 14px 0 0}',
      '.kf-regua-ok{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,#9c7c1f,#d4af37);border-radius:2px 0 0 2px;transition:width .2s ease-out}',
      '.kf-regua-exc{position:absolute;left:50%;top:0;bottom:0;background:repeating-linear-gradient(45deg,#e08b2c 0 3px,#a8661d 3px 6px);transition:width .2s ease-out}',
      '.kf-est-extremo .kf-regua-exc{background:repeating-linear-gradient(45deg,#b3261e 0 3px,#6e1712 3px 6px)}',
      '.kf-regua-marco{position:absolute;left:50%;top:-2px;bottom:-2px;width:2px;margin-left:-1px;background:#f0d77a}',
      '.kf-regua-mais{position:absolute;left:100%;top:-4px;margin-left:3px;font-family:' + mono + ';font-size:10px;color:#ff6b5a}',
      '.kf-inv-cab{font-family:Cinzel,serif;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#c9a94a;margin:10px 0 4px;padding-bottom:2px;border-bottom:1px solid #2a2a35}',
      '.kf-inv-vazio{font-size:12px;font-style:italic;color:#6a665e;padding:2px 0 6px}',
      '.kf-inv-item{background:#101017;border:1px solid #23232d;border-left:3px solid #3a3a45;border-radius:4px;padding:5px 7px;margin-bottom:4px;font-size:12px}',
      '.kf-inv-item.kf-equipado{border-left-color:#d4af37;background:#15140f}',
      '.kf-inv-l1{display:flex;align-items:flex-start;gap:6px}',
      '.kf-inv-nome{flex:1;min-width:0;font-family:Cinzel,serif;font-size:12.5px;line-height:1.25;color:#e6e2da}',
      '.kf-inv-nome.kf-orfao{font-style:italic}',
      '.kf-inv-peso{font-family:' + mono + ';font-variant-numeric:tabular-nums;color:#9a968e;white-space:nowrap;cursor:help}',
      '.kf-inv-x{background:none;border:none;color:#e06b5a;opacity:.45;cursor:pointer;font-size:16px;line-height:1;padding:0 2px}',
      '.kf-inv-x:hover,.kf-inv-x:focus-visible{opacity:1}',
      '.kf-inv-l2{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:4px}',
      '.kf-step{display:inline-flex;align-items:center;border:1px solid #2a2a35;border-radius:4px;overflow:hidden}',
      '.kf-step button{background:#1a1a22;color:#d4af37;border:none;width:22px;height:22px;padding:0;cursor:pointer;font-size:14px;line-height:1}',
      '.kf-step button:hover{background:#24242e}',
      '#kf-drawer .kf-step input[type=text]{flex:none;min-width:0;width:4.4ch;text-align:center;border:none;border-radius:0;padding:2px 0;font-family:' + mono + ';font-variant-numeric:tabular-nums}',
      '.kf-inv-cx{display:inline-flex;align-items:center;gap:4px;font-size:12.5px;color:#c8c4bc;cursor:pointer}',
      '#kf-drawer .kf-inv-cx input{margin:0;padding:0;accent-color:#e08b2c}',
      '.kf-dif{display:inline-block;width:5px;height:5px;border-radius:50%;background:#e08b2c;margin-left:2px}',
      '.kf-inv-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}',
      '.kf-inv-tags .kf-tag{margin:0}',
      'button.kf-tag{background:none;color:#e08b2c;border-color:#e08b2c66;cursor:pointer;font-family:inherit}',
      '.kf-inv-aviso{margin:5px 0 0;font-size:12px;color:#e08b2c}',
      '.kf-inv-aviso .kf-btn{margin-left:6px}',
      '#kf-drawer .kf-inv-item button:focus-visible,#kf-drawer .kf-inv-item input:focus-visible{outline:2px solid #e08b2c;outline-offset:1px}',
      '#kf-toast{max-width:min(560px,90vw);text-align:center;line-height:1.35}'
    ].join('\n');
    document.head.appendChild(css);
  }

  // ---------------- drawer ----------------
  function setOpen(b) {
    drawer.classList.toggle('kf-open', b);
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
      requestAnimationFrame(function () { drawer.style.transition = prev; });
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
    }
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
      'aria-label':'Quantidade de ' + e.nome, title:'Quantidade (Enter aplica; 0 remove)' });
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
        el('button', { type:'button', 'data-ctl':'mais', title:'Mais 1 (Shift: 10)', 'aria-label':'Aumentar ' + e.nome,
          onclick: function (ev) { passo(ev, 1); } }, ['+'])
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
  }
  function importJSON() {
    var inp = el('input', { type:'file', accept:'.json,application/json' });
    inp.addEventListener('change', function () {
      var fr = new FileReader();
      fr.onload = function () {
        var f;
        try { f = JSON.parse(fr.result); } catch (e) { f = null; }
        if (!f || typeof f !== 'object' || Array.isArray(f)) { toast('JSON inválido'); return; }
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
    if (!confirm('Nova ficha? A atual será substituída (exporte antes se quiser guardar).')) return;
    substitui(novaFicha(), 'reset'); toast('Nova ficha');
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
    injectCSS(); injectCSSInventario(); buildDrawer(); decorar();
    if (migrouAgora) { migrouAgora = false; toast(MSG_MIGRACAO, 8000); }
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
  window.addEventListener('storage', function (e) { if (e.key === LS_KEY) sincroniza(); });
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
    adicionar: function (item, opts) { return adicionar(item, opts, 'local'); },
    quantidade: function (uid, n) { return quantidade(uid, n, 'local'); },
    alternar: function (uid, campo) { return alternar(uid, campo, 'local'); },
    trocar: function (uid, campo, uidsASoltar) { return trocar(uid, campo, uidsASoltar, 'local'); },
    mover: function (uid, coluna) { return mover(uid, coluna, 'local'); },
    remover: function (uid) { return remover(uid, 'local'); },
    definirSins: function (n) { return definirSins(n, 'local'); },
    lote: lote,
    desfazer: desfazer,
    podeDesfazer: function () { return desfazerPilha.length > 0; },
    catalogo: catalogo,
    abrir: abrir,
    exportar: exportJSON
  });
  try { document.dispatchEvent(new CustomEvent('kf:pronta', { detail: { versao: '2' } })); } catch (e) {}

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(typeof window !== 'undefined' ? window : this);
