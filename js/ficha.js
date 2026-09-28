/* js/ficha.js — ARTEFATO gerado — não editar.
 * Fonte: js/ficha/*.js, concatenadas na ordem de js/ficha/ORDEM por
 * tools/ficha_js.py (o build grava; o validar [artefato-js] confere).
 */

// ==== js/ficha/kh-inv.js ====
/* Khalkaria — Ficha · KhInv: motor PURO de carga e inventário.
 * Sem DOM, sem localStorage. No node (tools/testes) exporta o KhInv por
 * module.exports; no navegador vira window.KhInv, que o ficha-v2.js lê.
 * Fonte: js/ficha/kh-inv.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  // ================= KhInv: motor de carga e inventário (PURO) =================
  // Regras do texto do Sistema (validar.py confere as frases). Pendências do
  // Pedro marcadas: limites Pesada/Leve independentes; bônus de mochilas
  // diferentes somam. Empilhável 10:1 (munição incluída) confirmado em 2026-09-25.
  var KhInv = (function () {
    var REGRAS = Object.freeze({
      BASE_BUG: 10, BASE_EQ: 2, MIN: 1, PILHA: 10,
      LIM_PESADA: 1, LIM_LEVE: 2, LIM_SINTONIA: 3, QTD_MAX: 9999,
      FRASE_EMPILHA: 'Empilhável: pesa 1 bugiganga a cada 10 unidades'
    });
    var COLUNAS = ['bugigangas', 'equipamentos'];
    var EQUIP_TOKENS = ['Arma', 'Armadura', 'Escudo'];
    // Empilhável é dado do build: inv.empilhavel, que o tools/gerar_bazar.py tira
    // do Efeito com o RE_EMPILHA dele (a Bolsa de Couro diz "Não é empilhável").
    // A regex daqui é só LEGADO, para o snapshot sem inv (v1 migrada, card sem
    // catálogo) até a reconciliação trazer o inv do registro.
    var RE_EMPILHA = /(?<!Não é )[Ee]mpilh[aá]vel:\s*pesa 1 bugiganga a cada 10 unidades/;
    var CAMPOS_SNAPSHOT = ['nome', 'categoria', 'raridade', 'arquetipo', 'arte', 'efeito', 'valor'];

    function clone(x) { return x === undefined ? undefined : JSON.parse(JSON.stringify(x)); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function tokens(cat) {
      return str(cat).split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    }
    function empilhavelPorTexto(efeito) { return RE_EMPILHA.test(str(efeito)); }
    function temInv(x) { return !!(x && x.inv && typeof x.inv === 'object' && !Array.isArray(x.inv)); }
    // o que o registro diz: com inv, só inv.empilhavel (o texto não é lido); sem inv, o legado
    function empilhavelDe(x) {
      x = x || {};
      return temInv(x) ? x.inv.empilhavel === true : empilhavelPorTexto(x.efeito);
    }
    function colunaCanonica(x) {
      x = x || {};
      if (temInv(x)) return x.inv.slot === 'equipamento' ? 'equipamentos' : 'bugigangas';
      var equip = tokens(x.categoria).some(function (t) { return EQUIP_TOKENS.indexOf(t) >= 0; });
      return (equip && !empilhavelDe(x)) ? 'equipamentos' : 'bugigangas';
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
        o.empilhavelRegistro = o.avulso ? null : empilhavelDe(o);
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
    // Equipado e Sintonizado valem por UNIDADE: a entrada marcada tem sempre qtd 1
    // e nunca entra em fusão. "Livre" é a entrada que pode receber/fundir cópias.
    function livre(x) { return !!x && !x.equipado && !x.sintonizado; }
    // entrada marcada com qtd > 1 (import, estado antigo): 1 unidade fica marcada,
    // o resto vira uma entrada livre logo depois
    function separaMarcada(e, usados) {
      if (livre(e) || qtdDe(e) <= 1) return [e];
      var resto = clone(e);
      resto.uid = novoUid(usados); resto.qtd = qtdDe(e) - 1;
      resto.equipado = false; resto.equipadoEm = null; resto.sintonizado = false;
      e.qtd = 1;
      return [e, resto];
    }
    // funde entradas livres de mesma chave, somando qtd (a 1ª fica)
    function fundir(l) {
      var vistos = {}, out = [];
      lista(l).forEach(function (e) {
        if (!livre(e)) { out.push(e); return; }
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
    // adiciona com fusão na entrada livre de mesma chave na coluna-alvo
    function mesclar(inv, item, opts) {
      opts = opts || {};
      var n = qtdDe({ qtd: opts.qtd == null ? 1 : opts.qtd });
      var base = entradaDeItem(item);
      var canon = colunaCanonica(base);
      var coluna = COLUNAS.indexOf(opts.coluna) >= 0 ? opts.coluna : canon;
      if (!Array.isArray(inv[coluna])) inv[coluna] = [];
      var k = chave(base);
      var alvo = inv[coluna].filter(function (x) { return livre(x) && chave(x) === k; })[0];
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
    // n < 1 remove; teto 9999. Entrada equipada/sintonizada fica em 1 (nada muda).
    function quantidade(inv, uid, n) {
      var a = acha(inv, uid);
      if (!a) return { ok: false };
      n = parseInt(n, 10);
      if (!(n >= 1)) { a.lista.splice(a.indice, 1); return { ok: true, removido: true }; }
      if (n > 1 && !livre(a.entrada)) return { ok: false, erro: a.entrada.equipado ? 'equipado' : 'sintonizado' };
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
      var alvo = livre(e) && inv[coluna].filter(function (x) { return livre(x) && chave(x) === k; })[0];
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
      if (campo === 'sintonizado') {   // sintonizar liga 1 unidade (uma pilha separa 1)
        var sint = lista(inv.bugigangas).concat(lista(inv.equipamentos)).filter(function (x) { return x !== e && x.sintonizado; });
        var ns = sint.reduce(function (s, x) { return s + qtdDe(x); }, 0);
        return ns + 1 > REGRAS.LIM_SINTONIA ? { tipo: 'sintonia', uids: sint.map(function (x) { return x.uid; }) } : null;
      }
      return null;
    }
    // desmarcar: a entrada que ficou livre volta para a livre de mesma chave na mesma lista
    function devolve(a, e) {
      if (!livre(e)) return e.uid;
      var k = chave(e);
      var alvo = a.lista.filter(function (x) { return x !== e && livre(x) && chave(x) === k; })[0];
      if (!alvo) return e.uid;
      alvo.qtd = Math.min(REGRAS.QTD_MAX, qtdDe(alvo) + qtdDe(e));
      a.lista.splice(a.lista.indexOf(e), 1);
      return alvo.uid;
    }
    // separa 1 unidade de uma pilha livre numa entrada própria, posta logo antes
    function separaUma(inv, a, marca) {
      var e = a.entrada;
      e.qtd = qtdDe(e) - 1;
      var nova = clone(e);
      nova.uid = novoUid(uidsDe(inv)); nova.qtd = 1;
      Object.keys(marca).forEach(function (k) { nova[k] = marca[k]; });
      a.lista.splice(a.indice, 0, nova);
      return nova.uid;
    }
    // {ok:true, uid} | {ok:false, conflito:{tipo, uids}} | {ok:false, erro}. Com conflito nada muda.
    function alternar(inv, uid, campo, agora) {
      var a = acha(inv, uid);
      if (!a) return { ok: false, erro: 'uid' };
      var e = a.entrada;
      if (campo === 'empilhavel') { e.empilhavel = !e.empilhavel; return { ok: true, uid: uid }; }
      if (campo === 'sintonizado') {
        if (e.sintonizado) { e.sintonizado = false; return { ok: true, uid: devolve(a, e) }; }
        var cs = conflito(inv, uid, campo);
        if (cs) return { ok: false, conflito: cs };
        if (qtdDe(e) > 1) return { ok: true, uid: separaUma(inv, a, { sintonizado: true }) };
        e.sintonizado = true;
        return { ok: true, uid: uid };
      }
      if (campo !== 'equipado') return { ok: false, erro: 'campo' };
      if (e.equipado) {   // desequipar: funde de volta na livre de mesmo id na mesma coluna
        e.equipado = false; e.equipadoEm = null;
        return { ok: true, uid: devolve(a, e) };
      }
      if (a.coluna !== 'equipamentos') return { ok: false, erro: 'coluna' };
      var cf = conflito(inv, uid, campo);
      if (cf) return { ok: false, conflito: cf };
      agora = agora || new Date().toISOString();
      if (qtdDe(e) > 1) return { ok: true, uid: separaUma(inv, a, { equipado: true, equipadoEm: agora }) };
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
          if (!eraV1 && COLUNAS.indexOf(k) >= 0 && typeof e.uid === 'string' && e.uid) guarda(k, normalizaEntrada(e, usados));
          else rerota.push(e);
        });
      });
      rerota.forEach(function (e) {
        var n = normalizaEntrada(Object.assign({}, e, { secaoManual: false }), usados);
        guarda(colunaCanonica(n), n);
      });
      // Equipado só vale em Equipamentos; entrada marcada com qtd > 1 separa 1 unidade
      function guarda(c, n) {
        if (c !== 'equipamentos') { n.equipado = false; n.equipadoEm = null; }
        separaMarcada(n, usados).forEach(function (x) { novo[c].push(x); });
      }
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
      var cat = lista(catalogo);
      cat.forEach(function (it) {
        if (!it) return;
        if (it.id && !porId[it.id]) porId[it.id] = it;
        if (it.nome && !porNome[it.nome]) porNome[it.nome] = it;
      });
      // nome corrigido no CSV muda o id (data/bazar-renomeados.json): o id e o
      // nome antigos resolvem para o item atual, depois dos atuais (o atual vence)
      cat.forEach(function (it) {
        if (!it) return;
        lista(it.idsAntigos).forEach(function (a) { if (a && !porId[a]) porId[a] = it; });
        lista(it.nomesAntigos).forEach(function (a) { if (a && !porNome[a]) porNome[a] = it; });
      });
      return { porId: porId, porNome: porNome };
    }
    function reconciliar(inv, porId, porNome) {
      var mudou = false;
      COLUNAS.forEach(function (c) {
        var renomeou = false;
        lista(inv && inv[c]).forEach(function (e) {
          if (!e || e.avulso) return;
          var antes = JSON.stringify(e);
          var it = pega(porId, e.id) || pega(porNome, e.nome);
          if (!it) e.orfao = true;   // nunca apagado: pesa pelo snapshot
          else {
            var regAntigo = e.empilhavelRegistro;
            if (it.id && e.id && e.id !== String(it.id)) renomeou = true;
            CAMPOS_SNAPSHOT.forEach(function (k) { e[k] = str(it[k]); });
            if (it.id) e.id = String(it.id);
            e.inv = (it.inv && typeof it.inv === 'object') ? clone(it.inv) : null;
            var regNovo = empilhavelDe(e);
            if (e.empilhavel === regAntigo) e.empilhavel = regNovo;   // se o jogador divergiu, fica a escolha dele
            e.empilhavelRegistro = regNovo;
            e.orfao = false;
          }
          if (JSON.stringify(e) !== antes) mudou = true;
        });
        // o id antigo, já trocado pelo atual, pode ter caído junto de uma entrada
        // livre do mesmo item: soma as duas (equipada/sintonizada fica separada)
        if (renomeou) inv[c] = fundir(inv[c]);
      });
      return mudou;
    }

    // ---- Export Bestiário (§5.8): token exato 'Arma', equipadas primeiro ----
    // atributo: '' enquanto a arma não tem fonte de dado (o arquivo de efeitos,
    // F1b). Nada de 'Força' fixo nem de tabela manual por arma.
    function armasBestiario(inv) {
      var todas = lista(inv && inv.equipamentos).concat(lista(inv && inv.bugigangas)).filter(function (e) {
        return e && tokens(e.categoria).indexOf('Arma') >= 0;
      });
      return todas.filter(function (e) { return e.equipado; }).concat(todas.filter(function (e) { return !e.equipado; }))
        .map(function (e) {
          var arq = str(e.arquetipo);
          var w = { name: str(e.nome), category: arq, level: (/ \+([1-3])$/.exec(str(e.nome)) || [])[1] || '0',
            dado: '', atributo: '', dano: '', efeito: str(e.efeito) };
          if (arq.indexOf('Foco Místico') === 0) w.mystic = true;
          return w;
        });
    }

    // prof_* do Bestiário é o GRAU 0-4 (D5a, 2026-09-26), não o bônus 0/2/4/6/8
    // que a ficha guarda: grau = bônus / 2, arredondado para baixo, entre 0 e 4
    // (Leigo 0, Treinado 1, Experiente 2, Mestre 3, Lendário 4).
    function grauPericia(bonus) {
      var n = Math.floor(Number(bonus) / 2);
      return n > 0 ? Math.min(4, n) : 0;
    }

    return {
      REGRAS: REGRAS, COLUNAS: COLUNAS.slice(), grauPericia: grauPericia,
      tokens: tokens, empilhavelPorTexto: empilhavelPorTexto, empilhavelDe: empilhavelDe, colunaCanonica: colunaCanonica,
      modFor: modFor, estado: estado, calcular: calcular, projetar: projetar,
      conflito: conflito, alternar: alternar, trocar: trocar,
      novoUid: novoUid, chave: chave, acha: acha,
      normalizaEntrada: normalizaEntrada, entradaDeItem: entradaDeItem,
      mesclar: mesclar, fundir: fundir, remover: remover, quantidade: quantidade, mover: mover,
      quantidadePorId: quantidadePorId,
      migrarV1: migrarV1, indexar: indexar, reconciliar: reconciliar, armasBestiario: armasBestiario
    };
  })();
  // node:test carrega o motor por aqui (o artefato também: o ficha-v2.js para no node)
  if (typeof module === 'object' && module && module.exports) { module.exports = KhInv; return; }
  raiz.KhInv = KhInv;
})(typeof window !== 'undefined' ? window : this);

// ==== js/ficha/kh-estado.js ====
/* Khalkaria — Ficha · KhEstado: estado v3 da ficha (PURO, F3a).
 * novaFicha, migração em cadeia 1.0 → 2.0 → 3.0, reassociação de ids antigos
 * pelo catálogo, ajustes manuais (M2, só o modelo), várias fichas por navegador
 * (D36: índice + uma chave por ficha, ativa por aba) como funções sobre um
 * storage INJETADO, export/import por ficha e "exportar todas", guarda contra
 * versão futura. Schema: data/ficha.schema.json (3.0).
 *
 * MODO SOMBRA (F3): nada daqui roda sozinho no navegador nem grava no
 * localStorage real. A v2.1 (ficha-v2.js, chave khalkaria_ficha) continua
 * sendo a ficha ativa; KhEstado.sombra() só LÊ a v2 e devolve a v3 em memória.
 * O armazém (KhEstado.armazem) só é instanciado nos testes até a F4, que cria
 * o índice, as chaves v3 e o marcador khalkaria_ficha_dono.
 *
 * No node (tools/testes) exporta o KhEstado por module.exports; no navegador
 * vira window.KhEstado. Depende do KhInv (js/ficha/kh-inv.js, antes no ORDEM).
 * Fonte: js/ficha/kh-estado.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  // No artefato carregado pelo require, o module.exports já é o KhInv (o
  // kh-inv.js exporta e para); carregando esta fonte sozinha, pede o módulo.
  var KhInv = (raiz && raiz.KhInv) ||
    (emNode && typeof module.exports.migrarV1 === 'function' ? module.exports : null) ||
    (emNode ? require('./kh-inv.js') : null);

  var KhEstado = (function () {
    var SCHEMA_VERSION = '3.0';
    var SCHEMA_INDICE = 'fichas/1';
    var CHAVES = Object.freeze({
      v2: 'khalkaria_ficha',                       // a ficha v2.1 (ativa até a F4)
      backupV1: 'khalkaria_ficha_v1_backup',
      dono: 'khalkaria_ficha_dono',                // marcador: só a F4 escreve
      indice: 'khalkaria_fichas_v3',
      ficha: 'khalkaria_ficha_v3:',                // + id
      log: 'khalkaria_ficha_v3_log:',              // + id (desfazer; fora do export)
      sessao: 'khalkaria_ficha_v3_sessao:',        // + id (Mesa; vai no export)
      nivelRascunho: 'khalkaria_nivel_rascunho:',  // + id (subida de nível, M3)
      ativa: 'khalkaria_ficha_ativa'               // sessionStorage: ativa desta aba
    });
    var LIMITE_QUOTA = 5 * 1024 * 1024;            // ~5 MB por origem (UTF-16: 2 bytes/char)

    var ATRIBUTOS = ['FOR', 'DES', 'CON', 'INT', 'SAB'];
    // as 24 perícias de data/pericias.json (o teste confere por conjunto e ordem)
    var PERICIAS = ['atacar', 'defender', 'movimento', 'fortitude', 'vontade', 'reflexos',
      'percepcao', 'sobrevivencia', 'furtividade', 'crime', 'iniciativa', 'conhecimento',
      'medicina', 'investigacao', 'religiao', 'mistico', 'convencimento', 'intimidacao',
      'intuicao', 'enganacao', 'motivar', 'oficio-engenharia', 'oficio-ferraria', 'oficio-alquimia'];
    // modo 'maior' (D7): o jogador pode trocar o atributo usado
    var PERICIAS_MAIOR = { movimento: ['FOR', 'DES'], convencimento: ['DES', 'INT'],
      intimidacao: ['CON', 'FOR'], enganacao: ['DES', 'INT'] };
    // 14 tipos de dano (D63/D67) e as 4 categorias com Ae de categoria
    var TIPOS_DANO = ['cortante', 'contundente', 'perfurante', 'fogo', 'frio', 'eletrico',
      'veneno', 'acido', 'psiquico', 'radiante', 'trovejante', 'necrotico', 'forca', 'primordial'];
    var CATEGORIAS_AE = ['ordinario', 'elemental', 'biologico', 'mistico'];
    var TIPOS_ENTRADA = ['magia', 'tecnica', 'marca', 'ultimate', 'traco', 'variante', 'subespecie',
      'tecnologia', 'corrupcao', 'origem', 'raca', 'classe', 'carta', 'dor', 'beneficio'];
    var FINS_TEMPORARIO = ['fimTurno', 'fimCombate', 'descansoCurto', 'descansoLongo', 'manual'];
    var EVENTOS_DURACAO = ['fimTurno', 'fimCombate', 'fimCena', 'descansoCurto', 'descansoLongo', 'novoDia', 'manual'];

    // Caminhos DERIVADOS que aceitam ajuste manual (M2). Caminho de estado
    // (recurso.*.atual, base de atributo, grau de perícia, Sins…) não casa e é
    // recusado. O schema v3 repete este padrão literal (o teste compara).
    function alt(l) { return '(?:' + l.join('|') + ')'; }
    var PADRAO_AJUSTE = new RegExp('^(?:' + [
      'atributo\\.' + alt(ATRIBUTOS) + '\\.(?:total|mod)',
      'pericia\\.' + alt(PERICIAS) + '\\.total',
      'recurso\\.(?:saude|stamina|eter|classe)\\.max',
      'evasao\\.(?:passiva|ativa)', 'cd', 'movimento', 'ar', 'acoes',
      'capacidade\\.(?:bugigangas|equipamentos)',
      'ae\\.' + alt(TIPOS_DANO.concat(CATEGORIAS_AE, ['todos'])),
      '(?:resistencia|imunidade|vulnerabilidade)\\.' + alt(TIPOS_DANO),
      'magia\\.[a-z0-9-]+\\.custo',
      'ataque\\.[A-Za-z0-9_-]+\\.(?:atacar|dano)',
      'limiar\\.saldo'
    ].join('|') + ')$');
    function ehCaminhoDeAjuste(c) { return typeof c === 'string' && PADRAO_AJUSTE.test(c); }
    var PADRAO_BOOLEANO = /^(?:resistencia|imunidade|vulnerabilidade)\./;
    // campos que são DADO (Defender 1d6…2d8; Ativa = Passiva + esse dado): o
    // 'fixa' leva a expressão ('1d8', '13 + 1d8'); o 'soma' é bônus fixo (número)
    var CAMINHOS_DADO = ['evasao.ativa', 'pericia.defender.total'];
    var PADRAO_DADO = /^ *(?:[0-9]+ *[+] *)?[0-9]+d[0-9]+(?: *[+-] *[0-9]+)? *$/;
    // as chaves de $defs/ajuste (lista fechada, como o additionalProperties:false)
    var CHAVES_AJUSTE = ['modo', 'valor', 'motivo', 'temporario', 'desde', 'calculadoEm', 'origem'];
    var PADRAO_ID = /^f[a-z0-9]{6,}$/;
    // alvos de Mod cujo valor a v2 guardava como TOTAL digitado (atributos, grau de perícia)
    var ALVOS_NO_TOTAL = { 'atributo.': 'atributos', 'pericia.': 'periciasMigracao' };

    // ---------------- utilitários ----------------
    function clone(x) { return x === undefined ? undefined : JSON.parse(JSON.stringify(x)); }
    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function temPropria(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
    function inteiro(x, padrao) { var n = parseInt(x, 10); return isFinite(n) ? n : padrao; }
    function numero(x, padrao) { var n = parseFloat(x); return isFinite(n) ? n : padrao; }
    function limita(n, a, b) { return Math.max(a, Math.min(b, n)); }
    function agoraPadrao() { return new Date().toISOString(); }
    function aleatorioPadrao() {
      try {
        var c = (typeof crypto !== 'undefined' && crypto) || (raiz && raiz.crypto);
        if (c && c.getRandomValues) { var a = new Uint32Array(1); c.getRandomValues(a); return a[0] / 4294967296; }
      } catch (e) {}
      return Math.random();
    }
    function ctx(opcoes) {
      opcoes = opcoes || {};
      return {
        agora: typeof opcoes.agora === 'function' ? opcoes.agora : agoraPadrao,
        aleatorio: typeof opcoes.aleatorio === 'function' ? opcoes.aleatorio : aleatorioPadrao
      };
    }
    function sufixo(c, n) {
      var s = '';
      while (s.length < n) s += Math.floor(c.aleatorio() * 36).toString(36);
      return s;
    }
    // id da ficha: 'f' + 12 base36, aleatório, único entre os usados
    function novoId(usados, opcoes) {
      var c = ctx(opcoes), id;
      do { id = 'f' + sufixo(c, 12); } while (usados && usados[id]);
      if (usados) usados[id] = true;
      return id;
    }
    function novoUid(usados, c) {
      var u;
      do { u = 'u' + sufixo(c, 10); } while (usados && usados[u]);
      if (usados) usados[u] = true;
      return u;
    }
    // "2.0" -> 2; "3.1" -> 3; ausente/lixo -> NaN
    function versaoMaior(v) { var n = parseInt(String(v == null ? '' : v).split('.')[0], 10); return isFinite(n) ? n : NaN; }
    // nome comparável: sem acento, sem emoji/pontuação, minúsculo
    function normaliza(s) {
      return str(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ').trim();
    }

    // ---------------- ficha v3 ----------------
    function estadoPadrao(tipo) {
      if (tipo === 'magia') return { intensidade: null, sustentando: false };
      if (tipo === 'tecnica' || tipo === 'marca' || tipo === 'ultimate') return { usos: null };
      if (tipo === 'carta') return { nivelAquisicao: null, posicaoNaMao: null, especial: false };
      if (tipo === 'dor' || tipo === 'beneficio' || tipo === 'corrupcao') return { nivelAquisicao: null };
      return {};
    }
    function ref(id, nome) { return { id: id || null, nome: str(nome) }; }
    function novaFicha(dados, opcoes) {
      var c = ctx(opcoes);
      dados = obj(dados) ? dados : {};
      var agora = c.agora();
      var f = {
        schemaVersion: SCHEMA_VERSION,
        id: typeof dados.id === 'string' && dados.id ? dados.id : novoId(null, opcoes),
        rev: 0, criadoEm: agora, salvoEm: '', exportadoEm: '',
        meta: { nome: str(dados.nome), jogador: str(dados.jogador),
          nivel: limita(inteiro(dados.nivel, 1), 1, 5), xp: Math.max(0, inteiro(dados.xp, 0)) },
        identidade: { raca: ref(), variante: ref(), subespecie: ref(), classe: ref(), ramo: ref(),
          origem: ref(), escolhas: {} },
        atributos: { base: {}, fonte: null, porNivel: {}, pontoMovido: null,
          migradoTotal: false, nivelMigrado: null },
        pericias: {}, periciasMigracao: { migradoTotal: false, nivelMigrado: null }, periciasAttr: {},
        recursos: { saude: { atual: 0, temporaria: 0 }, stamina: { atual: 0, comprometida: 0 },
          eter: { atual: 0 }, classe: { id: null, nome: '', atual: 0 } },
        condicoes: [],
        entradas: [],
        inventario: { sins: 0, bugigangas: [], equipamentos: [] },
        ajustes: {},
        resistencias: { tipos: {}, aeCategoria: {}, aeTodos: 0 },
        imunidadesCondicao: [],
        idiomas: [],
        limiar: { queimadas: [] },
        historicoNivel: [],
        vhelor: { marcas: 0 },
        lore: { historia: '', outros: '' },
        migracao: null,
        vinculoV2: null
      };
      ATRIBUTOS.forEach(function (a) { f.atributos.base[a] = 10; });
      PERICIAS.forEach(function (p) { f.pericias[p] = 0; });
      TIPOS_DANO.forEach(function (t) { f.resistencias.tipos[t] = { R: false, I: false, V: false, ae: 0 }; });
      CATEGORIAS_AE.forEach(function (k) { f.resistencias.aeCategoria[k] = 0; });
      return f;
    }

    // completa uma v3 lida (import, storage) com o que faltar, sem apagar nada
    function completaV3(f) {
      var base = novaFicha({ id: f.id || 'x' }, { agora: function () { return str(f.criadoEm); } });
      var out = mescla(base, f);
      out.schemaVersion = SCHEMA_VERSION;
      out.rev = Math.max(0, inteiro(out.rev, 0));
      ['entradas', 'condicoes', 'imunidadesCondicao', 'idiomas', 'historicoNivel'].forEach(function (k) {
        if (!Array.isArray(out[k])) out[k] = [];
      });
      if (!obj(out.ajustes)) out.ajustes = {};
      if (!obj(out.inventario)) out.inventario = base.inventario;
      KhInv.COLUNAS.forEach(function (col) { if (!Array.isArray(out.inventario[col])) out.inventario[col] = []; });
      return out;
    }
    function mescla(base, over) {
      if (!obj(base)) return over === undefined ? base : over;
      if (!obj(over)) return over === undefined ? base : over;
      var out = Object.assign({}, base);
      Object.keys(over).forEach(function (k) { out[k] = temPropria(base, k) ? mescla(base[k], over[k]) : over[k]; });
      return out;
    }

    // ---------------- ajustes (M2, só o modelo) ----------------
    // {modo:'fixa'|'soma', valor, motivo?, temporario:false|{fim}, desde, calculadoEm?, origem?}
    // Espelha $defs/ajuste: lista fechada de chaves e o tipo de cada uma.
    function validarAjuste(caminho, aj) {
      if (!ehCaminhoDeAjuste(caminho)) return 'caminho-de-estado';
      if (!obj(aj)) return 'ajuste-invalido';
      if (Object.keys(aj).some(function (k) { return CHAVES_AJUSTE.indexOf(k) < 0; })) return 'campo-desconhecido';
      if (aj.modo !== 'fixa' && aj.modo !== 'soma') return 'modo-invalido';
      var bool = PADRAO_BOOLEANO.test(caminho);
      var num = typeof aj.valor === 'number' && isFinite(aj.valor);
      if (bool) {
        if (typeof aj.valor !== 'boolean') return 'valor-invalido';
        if (aj.modo !== 'fixa') return 'modo-invalido';
      } else if (CAMINHOS_DADO.indexOf(caminho) >= 0) {
        if (aj.modo === 'fixa' ? !(typeof aj.valor === 'string' && PADRAO_DADO.test(aj.valor)) : !num) return 'valor-invalido';
      } else if (!num) return 'valor-invalido';
      if (aj.temporario !== undefined && aj.temporario !== false &&
          !(obj(aj.temporario) && FINS_TEMPORARIO.indexOf(aj.temporario.fim) >= 0 &&
            Object.keys(aj.temporario).length === 1)) return 'temporario-invalido';
      if (aj.motivo !== undefined && typeof aj.motivo !== 'string') return 'motivo-invalido';
      if (aj.desde !== undefined && typeof aj.desde !== 'string') return 'desde-invalido';
      if (aj.calculadoEm !== undefined && aj.calculadoEm !== null &&
          !(typeof aj.calculadoEm === 'number' && isFinite(aj.calculadoEm))) return 'calculado-invalido';
      if (aj.origem !== undefined && aj.origem !== 'manual' && aj.origem !== 'migracao') return 'origem-invalida';
      return null;
    }
    // grava o ajuste (cópia) na ficha; devolve null ou o erro, sem mudar nada
    function ajustar(ficha, caminho, aj, opcoes) {
      var novo = Object.assign({ temporario: false }, aj);
      if (!novo.desde) novo.desde = ctx(opcoes).agora();
      var erro = validarAjuste(caminho, novo);
      if (erro) return erro;
      ficha.ajustes[caminho] = clone(novo);
      return null;
    }
    function desajustar(ficha, caminho) {
      if (!temPropria(ficha.ajustes, caminho)) return false;
      delete ficha.ajustes[caminho];
      return true;
    }
    // Os ajustes que a migração criou sem saber o calculado (calculadoEm null)
    // saem quando o calculado bate com o valor; os outros ganham o calculadoEm.
    // Tira a marca migracao.ajustesPendentesDePoda (o armazém recusa gravar
    // enquanto ela existir): a F3b/F4 chama isto com o calculado do KhRegras.
    function podarAjustesMigrados(ficha, calculado) {
      var calc = typeof calculado === 'function' ? calculado(ficha) : calculado;
      if (!obj(calc)) return [];
      var podados = [];
      Object.keys(ficha.ajustes).forEach(function (k) {
        var aj = ficha.ajustes[k];
        if (!aj || aj.origem !== 'migracao' || !temPropria(calc, k) || typeof calc[k] !== 'number') return;
        if (aj.valor === calc[k]) { delete ficha.ajustes[k]; podados.push(k); }
        else aj.calculadoEm = calc[k];
      });
      if (obj(ficha.migracao)) delete ficha.migracao.ajustesPendentesDePoda;
      return podados;
    }
    function podaPendente(ficha) { return !!(ficha && obj(ficha.migracao) && ficha.migracao.ajustesPendentesDePoda); }

    // Os Mods das entradas que o motor soma: tira os que já estão num total
    // migrado da v2 (entrada com migradoDe.efeitoNoTotal, alvo atributo.* com
    // atributos.migradoTotal ou pericia.* com periciasMigracao.migradoTotal).
    // [{uid, tipo, id, mod}]; o KhRegras (F3b) lê daqui, nunca de entrada.mods direto.
    function jaNoTotal(ficha, entrada, mod) {
      if (!entrada.migradoDe || !entrada.migradoDe.efeitoNoTotal || !mod || typeof mod.alvo !== 'string') return false;
      return Object.keys(ALVOS_NO_TOTAL).some(function (pre) {
        var bloco = ficha[ALVOS_NO_TOTAL[pre]];
        return mod.alvo.indexOf(pre) === 0 && obj(bloco) && bloco.migradoTotal === true;
      });
    }
    function modsAplicaveis(ficha) {
      var out = [];
      lista(ficha && ficha.entradas).forEach(function (e) {
        lista(e.mods).forEach(function (m) {
          if (!jaNoTotal(ficha, e, m)) out.push({ uid: e.uid, tipo: e.tipo, id: e.id, mod: m });
        });
      });
      return out;
    }

    // ---------------- catálogo (injetado) ----------------
    // Monta as entradas {id, tipo, nome, classe?, raca?, resumo?, apelidos?, mods?}
    // a partir do que o KhCatalogo (F3b) ou o teste carregar:
    //   catalogos: [data/catalogo/*.json]  (cada um {entradas:[…]})
    //   classes:   [data/classes/*.json]   (bloco 'classe': a classe e os ramos;
    //              o ramo ganha os apelidos que a v2 gravava em texto livre:
    //              a chave e o nome sem "Ramo do", ex.: "Cartógrafo")
    //   racas:     [data/racas/*.json]     (bloco 'raca': poderes e adversidades
    //              da corrupção viram tipo 'corrupcao' daquela raça)
    function entradasDeCatalogo(dados) {
      dados = obj(dados) ? dados : {};
      var out = [];
      function poe(e) { if (obj(e) && e.id && e.tipo) out.push(e); }
      lista(dados.catalogos).forEach(function (cat) {
        lista(cat && cat.entradas).forEach(function (e) {
          if (!obj(e)) return;
          var x = { id: e.id, tipo: e.tipo, nome: str(e.nome), classe: e.classe || null, raca: e.raca || null, resumo: str(e.resumo) };
          if (Array.isArray(e.mods)) x.mods = clone(e.mods);
          poe(x);
        });
      });
      lista(dados.classes).forEach(function (b) {
        var c = obj(b) && obj(b.classe) ? b.classe : b;
        if (!obj(c) || !c.id) return;
        var chave = chaveDe(c.id, 'classe-');
        poe({ id: c.id, tipo: 'classe', nome: str(c.nome) });
        lista(c.ramos).forEach(function (r) {
          if (!obj(r)) return;
          var semPrefixo = str(r.nome).replace(/^[^A-Za-zÀ-ÿ]*Ramo d[oa]s?\s+/, '');
          poe({ id: r.id, tipo: 'ramo', nome: str(r.nome), classe: chave,
            apelidos: [r.chave, semPrefixo].filter(function (a) { return !!str(a); }) });
        });
      });
      lista(dados.racas).forEach(function (b) {
        var r = obj(b) && obj(b.raca) ? b.raca : b;
        var corr = obj(r) && obj(r.corrupcao) ? r.corrupcao : null;
        if (!corr) return;
        var chave = chaveDe(r.id, 'raca-');
        ['poderes', 'adversidades'].forEach(function (k) {
          lista(corr[k] && corr[k].itens).forEach(function (x) {
            if (obj(x)) poe({ id: x.id, tipo: 'corrupcao', nome: str(x.nome), raca: chave });
          });
        });
      });
      return out;
    }
    // entradas: as de entradasDeCatalogo (ou equivalentes)
    function indiceCatalogo(entradas, versao) {
      var porId = {}, porNome = {};
      lista(entradas).forEach(function (e) {
        if (!e || !e.id || !e.tipo) return;
        porId[e.tipo + ':' + e.id] = e;
        [e.nome].concat(lista(e.apelidos)).forEach(function (n) {
          var k = e.tipo + '|' + normaliza(n);
          if (!normaliza(n)) return;
          var l = porNome[k] = porNome[k] || [];
          if (l.indexOf(e) < 0) l.push(e);
        });
      });
      return { porId: porId, porNome: porNome, versao: str(versao) };
    }
    // {entrada} | {ambiguo:[ids]} | null. Desempata por classe/raça quando dá.
    function achar(idx, tipos, nome, filtro) {
      if (!idx) return null;
      var cands = [];
      tipos.forEach(function (t) { lista(idx.porNome[t + '|' + normaliza(nome)]).forEach(function (e) { cands.push(e); }); });
      if (!cands.length) return null;
      if (cands.length === 1) return { entrada: cands[0] };
      filtro = filtro || {};
      var f = cands.filter(function (e) {
        return (!filtro.classe || !e.classe || e.classe === filtro.classe) &&
          (!filtro.raca || !e.raca || e.raca === filtro.raca);
      });
      if (f.length === 1) return { entrada: f[0] };
      return { ambiguo: cands.map(function (e) { return e.tipo + ':' + e.id; }) };
    }
    // 'classe-brutalista' -> 'brutalista'; 'raca-anao' -> 'anao'
    function chaveDe(id, pre) { return id && id.indexOf(pre) === 0 ? id.slice(pre.length) : null; }

    // ---------------- migração 1.0 -> 2.0 (o mesmo que o ficha-v2.js faz) ----------------
    var PERICIAS_V2 = ['atacar', 'defender', 'movimento', 'fortitude', 'vontade', 'reflexos', 'percepcao',
      'sobrevivencia', 'furtividade', 'crime', 'iniciativa', 'conhecimento', 'medicina', 'investigacao',
      'religiao', 'mistico', 'convencimento', 'intimidacao', 'intuicao', 'enganacao', 'motivar', 'oficio'];
    var RESIST_V2 = ['ordinario', 'fogo', 'frio', 'eletrico', 'veneno', 'acido', 'psiquico', 'forca',
      'radiante', 'trovejante', 'necrotico', 'primordial'];
    var DERIVADOS_V2 = { evasao: 0, cd: 0, movimento: 9, armadura: 0 };   // novaFicha da v2
    function baseV2() {
      var f = { schemaVersion: '2.0', rev: 0, salvoEm: '', exportadoEm: '', migradoEm: '',
        meta: { nome: '', jogador: '', nivel: 1, xp: 0, raca: '', variante: '', classe: '', ramo: '', origem: '' },
        atributos: { for: 10, des: 10, con: 10, int: 10, sab: 10 },
        pericias: {}, oficioAttr: 'int',
        recursos: { saude: { atual: 0, max: 0 }, stamina: { atual: 0, max: 0 }, eter: { atual: 0, max: 0 },
          recursoClasse: { nome: '', atual: 0, max: 0 } },
        derivadosManuais: clone(DERIVADOS_V2),
        resistencias: {}, inventario: { sins: 0, bugigangas: [], equipamentos: [] },
        tecnicas: [], grimorio: [], cartasLimiar: [], lore: { historia: '', outros: '' } };
      PERICIAS_V2.forEach(function (p) { f.pericias[p] = 0; });
      RESIST_V2.forEach(function (r) { f.resistencias[r] = { R: false, I: false, ae: 0 }; });
      return f;
    }
    function migrarV1paraV2(f, agora) {
      var m = mescla(baseV2(), KhInv.migrarV1(f, agora));
      if (!obj(m.inventario)) m.inventario = baseV2().inventario;
      delete m.inventario.armas; delete m.inventario.materiais;
      KhInv.COLUNAS.forEach(function (c) { if (!Array.isArray(m.inventario[c])) m.inventario[c] = []; });
      m.schemaVersion = '2.0';
      m.rev = Math.max(0, inteiro(m.rev, 0));
      ['salvoEm', 'exportadoEm', 'migradoEm'].forEach(function (k) { if (typeof m[k] !== 'string') m[k] = ''; });
      return m;
    }

    // ---------------- migração 2.0 -> 3.0 ----------------
    // tipo gravado pela v2 (MAPA do ficha-v2.js) -> tipo v3 e os tipos do catálogo
    // onde procurar. O .tech-card do Autômato entrava como 'tecnica' na v2.
    var TIPOS_V2 = {
      magia: ['magia', ['magia']], tecnica: ['tecnica', ['tecnica', 'tecnologia']],
      ultimate: ['ultimate', ['ultimate']], marca: ['marca', ['marca']],
      'traço': ['traco', ['traco']], traco: ['traco', ['traco']],
      variante: ['variante', ['variante']], 'subespécie': ['subespecie', ['subespecie']],
      subespecie: ['subespecie', ['subespecie']], origem: ['origem', ['origem']],
      carta: ['carta', ['carta']], dor: ['dor', ['dor']], abismo: ['beneficio', ['beneficio']],
      'corrupção': ['corrupcao', ['corrupcao']], corrupcao: ['corrupcao', ['corrupcao']],
      adversidade: ['corrupcao', ['corrupcao']]
    };
    var LISTAS_V2 = ['tecnicas', 'grimorio', 'cartasLimiar'];
    // o que a v2 digitava à mão e vira ajuste (M2) quando difere do default e do calculado
    var AJUSTES_V2 = [
      ['derivadosManuais', 'evasao', 'evasao.passiva', DERIVADOS_V2.evasao],
      ['derivadosManuais', 'cd', 'cd', DERIVADOS_V2.cd],
      ['derivadosManuais', 'movimento', 'movimento', DERIVADOS_V2.movimento],
      ['derivadosManuais', 'armadura', 'ar', DERIVADOS_V2.armadura],
      ['recursos.saude', 'max', 'recurso.saude.max', 0],
      ['recursos.stamina', 'max', 'recurso.stamina.max', 0],
      ['recursos.eter', 'max', 'recurso.eter.max', 0],
      ['recursos.recursoClasse', 'max', 'recurso.classe.max', 0]
    ];
    function em(o, caminho) {
      return caminho.split('.').reduce(function (a, k) { return obj(a) ? a[k] : undefined; }, o);
    }
    // a v2 grava o nome da corrupção com o custo: "Sangue Morto (-1)"
    function nomeSemCusto(nome) { return str(nome).replace(/\s*\([+\-−]?\d+\)\s*$/, ''); }

    function associa(e, idx, filtro, c) {
      var def = TIPOS_V2[e.tipo] || TIPOS_V2[normaliza(e.tipo)];
      var tipo = def ? def[0] : null;
      var nome = tipo === 'corrupcao' ? nomeSemCusto(e.nome) : str(e.nome);
      var r = { tipo: tipo, id: null, orfao: null };
      if (!def) { r.orfao = { motivo: 'tipo-desconhecido' }; return r; }
      if (!idx) { r.orfao = { motivo: 'sem-catalogo' }; return r; }
      var a = achar(idx, def[1], nome, filtro);
      if (a && a.entrada) { r.tipo = a.entrada.tipo; r.id = a.entrada.id; r.entradaCat = a.entrada; }
      else if (a && a.ambiguo) r.orfao = { motivo: 'ambiguo', candidatos: a.ambiguo };
      else r.orfao = { motivo: 'sem-par' };
      return r;
    }

    function migrarV2paraV3(v2, opcoes) {
      opcoes = opcoes || {};
      var c = ctx(opcoes), agora = c.agora(), idx = opcoes.catalogo || null;
      var avisos = [];
      var f = novaFicha({ id: opcoes.id || novoId(null, opcoes) }, opcoes);
      var m = v2.meta || {};
      f.meta = { nome: str(m.nome), jogador: str(m.jogador),
        nivel: limita(inteiro(m.nivel, 1), 1, 5), xp: Math.max(0, inteiro(m.xp, 0)) };

      // identidade por id (nome como cache; sem par, fica só o nome)
      function ident(campo, tipos, filtro) {
        var nome = str(m[campo]).trim();
        if (!nome) return ref();
        var a = achar(idx, tipos, nome, filtro);
        if (a && a.entrada) return ref(a.entrada.id, a.entrada.nome);
        avisos.push({ tipo: 'identidade', campo: campo, nome: nome,
          motivo: !idx ? 'sem-catalogo' : (a && a.ambiguo ? 'ambiguo' : 'sem-par') });
        return ref(null, nome);
      }
      f.identidade.raca = ident('raca', ['raca']);
      f.identidade.classe = ident('classe', ['classe']);
      f.identidade.origem = ident('origem', ['origem']);
      var raca = chaveDe(f.identidade.raca.id, 'raca-');
      var classe = chaveDe(f.identidade.classe.id, 'classe-');
      f.identidade.ramo = ident('ramo', ['ramo'], { classe: classe });
      var vari = str(m.variante).trim(), va = vari && achar(idx, ['variante', 'subespecie'], vari, { raca: raca });
      if (va && va.entrada) f.identidade[va.entrada.tipo] = ref(va.entrada.id, va.entrada.nome);
      else if (vari) {
        f.identidade.variante = ref(null, vari);
        avisos.push({ tipo: 'identidade', campo: 'variante', nome: vari,
          motivo: !idx ? 'sem-catalogo' : (va && va.ambiguo ? 'ambiguo' : 'sem-par') });
      }

      // atributo: o total digitado na v2 vira a base, marcado (raça e nível já dentro)
      var at = v2.atributos || {};
      ATRIBUTOS.forEach(function (A) { f.atributos.base[A] = limita(inteiro(at[A.toLowerCase()], 10), 1, 30); });
      f.atributos.fonte = 'migrado';
      f.atributos.migradoTotal = true;
      f.atributos.nivelMigrado = f.meta.nivel;

      // perícias: bônus 0/2/4/6/8 -> grau 0-4; como o atributo, é o TOTAL
      // digitado (treinamento de classe, origem e cartas já dentro)
      var pe = v2.pericias || {}, pendencias = [];
      f.periciasMigracao = { migradoTotal: true, nivelMigrado: f.meta.nivel };
      PERICIAS.forEach(function (p) { if (temPropria(pe, p)) f.pericias[p] = KhInv.grauPericia(pe[p]); });
      var gOf = KhInv.grauPericia(pe.oficio);
      if (gOf > 0 || (v2.oficioAttr && v2.oficioAttr !== 'int')) {
        // Ofício(X) genérico: qual dos três é escolha do jogador, não da migração
        pendencias.push({ campo: 'pericias.oficio', grau: gOf, oficioAttr: str(v2.oficioAttr || 'int'),
          motivo: 'A v2 tinha um Ofício(X) genérico; escolha qual Ofício (Engenharia, Ferraria ou Alquimia) recebe o grau.' });
      }

      // recursos atuais (estado); máximos digitados viram ajuste abaixo
      var rc = v2.recursos || {};
      f.recursos.saude.atual = numero(em(rc, 'saude.atual'), 0);
      f.recursos.stamina.atual = numero(em(rc, 'stamina.atual'), 0);
      f.recursos.eter.atual = numero(em(rc, 'eter.atual'), 0);
      f.recursos.classe = { id: null, nome: str(em(rc, 'recursoClasse.nome')), atual: numero(em(rc, 'recursoClasse.atual'), 0) };

      // resistências: 'ordinario' da v2 vira os 3 tipos (R/I) e a Ae de categoria
      var rs = obj(v2.resistencias) ? v2.resistencias : {};
      Object.keys(rs).forEach(function (k) {
        var v = rs[k] || {}, ae = Math.max(0, inteiro(v.ae, 0));
        var alvo = k === 'ordinario' ? ['cortante', 'contundente', 'perfurante'] : (TIPOS_DANO.indexOf(k) >= 0 ? [k] : []);
        if (!alvo.length) { avisos.push({ tipo: 'resistencia', chave: k, motivo: 'tipo desconhecido' }); return; }
        alvo.forEach(function (t) { f.resistencias.tipos[t].R = !!v.R; f.resistencias.tipos[t].I = !!v.I; });
        if (k === 'ordinario') f.resistencias.aeCategoria.ordinario = ae;
        else f.resistencias.tipos[k].ae = ae;
      });

      // inventário: o do KhInv, como está
      f.inventario = clone(v2.inventario || f.inventario);
      KhInv.COLUNAS.forEach(function (col) { if (!Array.isArray(f.inventario[col])) f.inventario[col] = []; });
      f.inventario.sins = Math.max(0, inteiro(f.inventario.sins, 0));

      f.lore = { historia: str(em(v2, 'lore.historia')), outros: str(em(v2, 'lore.outros')) };

      // entidades: por referência, com cache; sem par ou ambíguo vira órfã
      var usados = {}, vistos = {};
      LISTAS_V2.forEach(function (l) {
        lista(v2[l]).forEach(function (e) {
          if (!obj(e) || !str(e.nome).trim()) return;
          var r = associa(e, idx, { classe: classe, raca: raca }, c);
          var tipoV3 = r.tipo || 'tecnica';
          if (r.id && vistos[tipoV3 + ':' + r.id]) {
            avisos.push({ tipo: 'duplicada', ref: tipoV3 + ':' + r.id, nome: str(e.nome) });
            return;
          }
          if (r.id) vistos[tipoV3 + ':' + r.id] = true;
          var ent = { uid: novoUid(usados, c), tipo: tipoV3, id: r.id, estado: estadoPadrao(tipoV3),
            cache: { nome: r.entradaCat ? str(r.entradaCat.nome) : str(e.nome),
              resumo: str(e.descricao), versaoCatalogo: idx ? idx.versao : '' },
            mods: r.entradaCat && Array.isArray(r.entradaCat.mods) ? clone(r.entradaCat.mods) : [],
            adicionadoEm: agora,
            // efeitoNoTotal: os Mods de atributo/perícia desta entrada já estão
            // nos totais digitados na v2 (modsAplicaveis não os soma de novo)
            migradoDe: { id: str(e.id), tipo: str(e.tipo), nome: str(e.nome), efeitoNoTotal: true } };
          if (r.orfao) { ent.orfao = r.orfao; avisos.push({ tipo: 'orfa', ref: str(e.tipo) + ':' + str(e.id), motivo: r.orfao.motivo }); }
          f.entradas.push(ent);
        });
      });

      // ajustes: só o que difere do default da v2 E do calculado (M2)
      var calc = typeof opcoes.calculado === 'function' ? opcoes.calculado(f) : (obj(opcoes.calculado) ? opcoes.calculado : null);
      AJUSTES_V2.forEach(function (a) {
        var bloco = em(v2, a[0]);
        if (!obj(bloco) || !temPropria(bloco, a[1])) return;
        var v = numero(bloco[a[1]], NaN);
        if (!isFinite(v) || v === a[3]) return;
        var cv = calc && typeof calc[a[2]] === 'number' ? calc[a[2]] : null;
        if (cv !== null && cv === v) return;
        f.ajustes[a[2]] = { modo: 'fixa', valor: v, motivo: 'Valor digitado na ficha v2', temporario: false,
          desde: agora, calculadoEm: cv, origem: 'migracao' };
      });

      f.migracao = { de: '2.0', em: agora, pendencias: pendencias };
      // sem o calculado, os ajustes ainda não foram comparados com o motor:
      // a ficha fica marcada e o armazém não a grava até podarAjustesMigrados
      if (!calc) f.migracao.ajustesPendentesDePoda = true;
      f.vinculoV2 = { revV2: Math.max(0, inteiro(v2.rev, 0)), salvoEmV2: str(v2.salvoEm) };
      f.criadoEm = agora;
      return { ficha: f, avisos: avisos };
    }

    // Cadeia: 1.0 -> 2.0 -> 3.0; 3.x é completada; maior que 3 é recusada.
    // {ficha, de, avisos} | {erro:'versao-futura'|'invalida', versao}
    function migrar(f, opcoes) {
      if (!obj(f)) return { erro: 'invalida' };
      var v = f.schemaVersion, maior = versaoMaior(v);
      if (maior > 3) return { erro: 'versao-futura', versao: str(v) };
      if (v == null && !obj(f.meta)) return { erro: 'invalida' };
      if (maior === 3) {
        var f3 = completaV3(clone(f));
        // id fora do padrão vira sufixo de chave do storage: gera um novo
        if (typeof f.id !== 'string' || !PADRAO_ID.test(f.id)) f3.id = novoId(null, opcoes);
        return { ficha: f3, de: str(v), avisos: [] };
      }
      var agora = ctx(opcoes).agora();
      var de = maior === 2 ? '2.0' : '1.0';
      var v2 = migrarV1paraV2(f, agora);
      var r = migrarV2paraV3(v2, opcoes);
      if (de === '1.0') r.ficha.migracao.de = '1.0';
      r.de = de;
      return r;
    }

    // Tenta de novo as órfãs migradas (sem catálogo na hora, ou catálogo que mudou)
    function reassociar(ficha, idx) {
      if (!idx) return 0;
      var n = 0;
      var classe = chaveDe(ficha.identidade && ficha.identidade.classe && ficha.identidade.classe.id, 'classe-');
      var raca = chaveDe(ficha.identidade && ficha.identidade.raca && ficha.identidade.raca.id, 'raca-');
      var vistos = {};
      ficha.entradas.forEach(function (e) { if (e.id) vistos[e.tipo + ':' + e.id] = true; });
      ficha.entradas.forEach(function (e) {
        if (e.id || !e.orfao || !e.migradoDe) return;
        var r = associa(e.migradoDe, idx, { classe: classe, raca: raca });
        if (!r.id || vistos[r.tipo + ':' + r.id]) { if (r.orfao) e.orfao = r.orfao; return; }
        vistos[r.tipo + ':' + r.id] = true;
        e.tipo = r.tipo; e.id = r.id; delete e.orfao;
        e.cache.nome = str(r.entradaCat.nome); e.cache.versaoCatalogo = idx.versao;
        if (Array.isArray(r.entradaCat.mods)) e.mods = clone(r.entradaCat.mods);
        n++;
      });
      return n;
    }
    // Entrada com id que sumiu do catálogo vira órfã (nunca é apagada, o cache
    // mostra); a que existe atualiza o nome/versão do cache. Devolve as órfãs.
    function reconciliar(ficha, idx) {
      var orfas = [];
      if (!idx) return orfas;
      ficha.entradas.forEach(function (e) {
        if (!e.id) { if (e.orfao) orfas.push(e.uid); return; }
        var cat = idx.porId[e.tipo + ':' + e.id];
        if (!cat) { e.orfao = { motivo: 'sumiu' }; orfas.push(e.uid); return; }
        if (e.orfao) delete e.orfao;
        e.cache.nome = str(cat.nome);
        if (cat.resumo != null) e.cache.resumo = str(cat.resumo);
        e.cache.versaoCatalogo = idx.versao;
        // o snapshot dos Mods acompanha o catálogo quando ele os tem
        if (Array.isArray(cat.mods)) e.mods = clone(cat.mods);
      });
      return orfas;
    }

    // ---------------- export / import (sem rede) ----------------
    function nomeArquivo(ficha) { return (str(ficha && ficha.meta && ficha.meta.nome).trim() || 'ficha').replace(/\s+/g, '_') + '.khalkaria.json'; }
    // Export nativo de UMA ficha: a ficha inteira (cache incluso: não depende do
    // catálogo nem de rede) + a sessão da Mesa. O log de desfazer não vai.
    function exportarFicha(ficha, sessao, opcoes) {
      var d = clone(ficha);
      d.exportadoEm = ctx(opcoes).agora();
      if (sessao != null) d.estadoSessao = clone(sessao);
      return { nomeArquivo: nomeArquivo(ficha), dados: d };
    }
    // ilegiveis: [{id, nome?, motivo, texto}] das fichas que não viram v3 aqui
    // (vão cruas no pacote, para não se perderem)
    function pacoteTodas(exportadas, opcoes, ilegiveis) {
      var d = { schema: SCHEMA_INDICE, exportadoEm: ctx(opcoes).agora(), fichas: exportadas.map(clone) };
      if (ilegiveis && ilegiveis.length) d.ilegiveis = clone(ilegiveis);
      return { nomeArquivo: 'khalkaria-fichas.json', dados: d };
    }
    function ehPacote(o) {
      return obj(o) && o.schema === SCHEMA_INDICE && Array.isArray(o.fichas) &&
        o.fichas.every(function (x) { return obj(x) && (x.schemaVersion != null || obj(x.meta)); });
    }
    // Lê um arquivo de import (texto ou objeto): ficha 1.0/2.0/3.x ou pacote
    // fichas/1. {fichas:[{ficha, sessao, de, avisos}], erros:[]}; nada é gravado.
    function lerImport(entrada, opcoes) {
      var o = entrada, erros = [], out = [];
      if (typeof o === 'string') { try { o = JSON.parse(o); } catch (e) { return { fichas: [], erros: [{ erro: 'json' }] }; } }
      if (!obj(o)) return { fichas: [], erros: [{ erro: 'invalida' }] };
      if (obj(o) && typeof o.schema === 'string' && /^fichas\//.test(o.schema) && o.schema !== SCHEMA_INDICE) {
        return { fichas: [], erros: [{ erro: 'versao-futura', versao: o.schema }] };
      }
      if (o.schema === SCHEMA_INDICE && !ehPacote(o)) return { fichas: [], erros: [{ erro: 'invalida' }] };
      var itens = ehPacote(o) ? o.fichas : [o];
      if (ehPacote(o)) lista(o.ilegiveis).forEach(function (x) {
        erros.push({ erro: 'ilegivel-no-pacote', id: obj(x) ? str(x.id) : '', motivo: obj(x) ? str(x.motivo) : '' });
      });
      itens.forEach(function (x, i) {
        var sessao = obj(x) && temPropria(x, 'estadoSessao') ? x.estadoSessao : null;
        var limpo = obj(x) ? Object.assign({}, x) : x;
        if (obj(limpo)) delete limpo.estadoSessao;
        var r = migrar(limpo, opcoes);
        if (r.erro) { erros.push({ indice: i, erro: r.erro, versao: r.versao }); return; }
        if (opcoes && opcoes.catalogo) { reassociar(r.ficha, opcoes.catalogo); reconciliar(r.ficha, opcoes.catalogo); }
        if (podaPendente(r.ficha) && opcoes && opcoes.calculado) podarAjustesMigrados(r.ficha, opcoes.calculado);
        out.push({ ficha: r.ficha, sessao: sessao, de: r.de, avisos: r.avisos || [] });
      });
      return { fichas: out, erros: erros };
    }

    // ---------------- sombra (F3): só lê a v2, nada é gravado ----------------
    function sombra(storage, opcoes) {
      var raw = null;
      try { raw = storage && storage.getItem(CHAVES.v2); } catch (e) { raw = null; }
      if (!raw) return null;
      var f;
      try { f = JSON.parse(raw); } catch (e) { return { erro: 'json' }; }
      return migrar(f, opcoes);
    }

    // ---------------- armazém: várias fichas (D36) ----------------
    // storage = localStorage (ou falso nos testes); sessao = sessionStorage (ativa
    // por aba) ou null. Funções puras sobre o que foi injetado.
    function ehQuota(e) {
      return !!e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22 || e.code === 1014);
    }
    function armazem(ls, ss, opcoes) {
      opcoes = opcoes || {};
      var c = ctx(opcoes);
      var ativaMem = null;
      function ler(k) { try { return ls.getItem(k); } catch (e) { return null; } }
      function lerJSON(k) { var r = ler(k); if (r == null) return null; try { return JSON.parse(r); } catch (e) { return null; } }
      function remove(k) { try { ls.removeItem(k); return true; } catch (e) { return false; } }
      function chaves() {
        var out = [];
        try { for (var i = 0; i < ls.length; i++) { var k = ls.key(i); if (k != null) out.push(k); } } catch (e) {}
        return out;
      }
      function indiceVazio() { return { schema: SCHEMA_INDICE, ultimaAtiva: null, projecaoV2: null, fichas: [] }; }
      function lerIndice() {
        var i = lerJSON(CHAVES.indice);
        if (!obj(i)) return indiceVazio();
        if (!Array.isArray(i.fichas)) i.fichas = [];
        return i;
      }
      // índice de versão futura (outra versão do site gravou): nada é escrito
      function somenteLeitura() { var i = lerJSON(CHAVES.indice); return obj(i) && i.schema !== SCHEMA_INDICE; }
      function ativaDaAba() {
        if (ss) { try { return ss.getItem(CHAVES.ativa); } catch (e) {} }
        return ativaMem;
      }
      function marcaAtiva(id) {
        ativaMem = id;
        if (ss) { try { if (id) ss.setItem(CHAVES.ativa, id); else ss.removeItem(CHAVES.ativa); } catch (e) {} }
      }
      function maisRecente(ind) {
        var l = ind.fichas.slice().sort(function (a, b) { return str(b.atualizadoEm) < str(a.atualizadoEm) ? -1 : (str(b.atualizadoEm) > str(a.atualizadoEm) ? 1 : 0); });
        return l.length ? l[0].id : null;
      }
      function existe(ind, id) { return ind.fichas.some(function (x) { return x.id === id; }); }
      // A ativa desta aba. Se outra aba excluiu a ficha que esta aba marcou,
      // devolve null (não troca em silêncio): a UI lê ativaExcluida() e fica
      // só-leitura com "Baixar ficha" e "Trocar" (plano §3.1).
      function ativa() {
        var ind = lerIndice(), a = ativaDaAba();
        if (a) return existe(ind, a) ? a : null;
        if (ind.ultimaAtiva && existe(ind, ind.ultimaAtiva)) return ind.ultimaAtiva;
        return maisRecente(ind);
      }
      function ativaExcluida() {
        var a = ativaDaAba();
        return a && !existe(lerIndice(), a) ? a : null;
      }
      // Em QuotaExceeded limpa, nesta ordem, os logs de desfazer das fichas
      // inativas, o da ativa e o backup da v1; nunca ficha nem índice.
      function candidatosLimpeza() {
        var a = ativa(), ks = chaves(), out = [];
        ks.forEach(function (k) { if (k.indexOf(CHAVES.log) === 0 && k !== CHAVES.log + a) out.push(k); });
        if (a && ks.indexOf(CHAVES.log + a) >= 0) out.push(CHAVES.log + a);
        if (ks.indexOf(CHAVES.backupV1) >= 0) out.push(CHAVES.backupV1);
        return out;
      }
      function escreve(k, v, limpou) {
        var fila = null;
        for (;;) {
          try { ls.setItem(k, v); return { ok: true }; }
          catch (e) {
            if (!ehQuota(e)) return { ok: false, erro: 'storage' };
            if (fila === null) fila = candidatosLimpeza();
            if (!fila.length) return { ok: false, erro: 'quota', sugestao: 'exportarTodas' };
            var r = fila.shift();
            if (remove(r)) limpou.push(r);
          }
        }
      }
      // grava a ficha e a linha dela no índice; se o índice falhar, desfaz a ficha
      function gravaPar(ficha, ind, limpou) {
        var kf = CHAVES.ficha + ficha.id, antes = ler(kf);
        var r1 = escreve(kf, JSON.stringify(ficha), limpou);
        if (!r1.ok) return r1;
        var linha = { id: ficha.id, nome: ficha.meta.nome, classe: str(ficha.identidade.classe.nome),
          nivel: ficha.meta.nivel, atualizadoEm: ficha.salvoEm || ficha.criadoEm };
        var i = -1;
        ind.fichas.forEach(function (x, j) { if (x.id === ficha.id) i = j; });
        if (i >= 0) ind.fichas[i] = linha; else ind.fichas.push(linha);
        var r2 = escreve(CHAVES.indice, JSON.stringify(ind), limpou);
        if (!r2.ok) {
          if (antes == null) remove(kf); else { try { ls.setItem(kf, antes); } catch (e) {} }
          return r2;
        }
        return { ok: true };
      }
      function recusa(erro, extra) { return Object.assign({ ok: false, erro: erro }, extra || {}); }
      function resultado(r, limpou, extra) { return Object.assign(r, { limpou: limpou }, extra || {}); }

      function lerFicha(id) {
        var f = lerJSON(CHAVES.ficha + id);
        if (!obj(f)) return null;
        return versaoMaior(f.schemaVersion) > 3 ? null : completaV3(f);
      }
      // grava uma ficha (rev++, salvoEm). Recusa por cima de versão futura ou de
      // um rev maior (outra aba gravou depois: relê antes de gravar).
      // Recusa também a ficha que outra aba excluiu (já gravada e fora do
      // índice: nada de ressuscitar) e a migrada ainda sem poda dos ajustes.
      function gravar(ficha) {
        if (somenteLeitura()) return recusa('somente-leitura');
        if (!obj(ficha) || !ficha.id) return recusa('invalida');
        if (podaPendente(ficha)) return recusa('poda-pendente');
        if (!existe(lerIndice(), ficha.id) && (inteiro(ficha.rev, 0) > 0 || str(ficha.salvoEm))) return recusa('excluida');
        var atual = lerJSON(CHAVES.ficha + ficha.id);
        if (obj(atual)) {
          if (versaoMaior(atual.schemaVersion) > 3) return recusa('versao-futura', { versao: str(atual.schemaVersion) });
          if (inteiro(atual.rev, 0) > inteiro(ficha.rev, 0)) return recusa('desatualizada', { rev: inteiro(atual.rev, 0) });
        }
        var nova = clone(ficha);
        nova.rev = inteiro(nova.rev, 0) + 1;
        nova.salvoEm = c.agora();
        var limpou = [], r = gravaPar(nova, lerIndice(), limpou);
        if (r.ok) { ficha.rev = nova.rev; ficha.salvoEm = nova.salvoEm; }
        return resultado(r, limpou, r.ok ? { rev: nova.rev } : null);
      }
      function usados() {
        var u = {};
        lerIndice().fichas.forEach(function (x) { u[x.id] = true; });
        return u;
      }
      function tornaAtiva(id) {
        marcaAtiva(id);
        var ind = lerIndice();
        ind.ultimaAtiva = id;
        var limpou = [];
        return resultado(escreve(CHAVES.indice, JSON.stringify(ind), limpou), limpou);
      }
      // nova ficha no índice, e ela vira a ativa (D36); as outras ficam intactas
      function adiciona(f, sessao) {
        if (podaPendente(f)) return recusa('poda-pendente');
        f.rev = 0; f.salvoEm = c.agora();
        var limpou = [], r = gravaPar(f, lerIndice(), limpou);
        if (!r.ok) return resultado(r, limpou);
        if (sessao != null) escreve(CHAVES.sessao + f.id, JSON.stringify(sessao), limpou);
        tornaAtiva(f.id);
        return resultado({ ok: true, id: f.id }, limpou);
      }
      function criar(dados) {
        if (somenteLeitura()) return recusa('somente-leitura');
        var f = novaFicha(Object.assign({}, dados || {}, { id: novoId(usados(), opcoes) }), opcoes);
        return adiciona(f);
      }
      function trocar(id) {
        if (!existe(lerIndice(), id)) return recusa('inexistente');
        if (somenteLeitura()) { marcaAtiva(id); return { ok: true, limpou: [] }; }
        return tornaAtiva(id);
      }
      // cópia com id novo, "(cópia)" no nome, sem log, sem sessão e sem vínculo com a v2
      function duplicar(id) {
        if (somenteLeitura()) return recusa('somente-leitura');
        var f = lerFicha(id);
        if (!f) return recusa('inexistente');
        f.id = novoId(usados(), opcoes);
        f.meta.nome = (f.meta.nome ? f.meta.nome + ' ' : '') + '(cópia)';
        f.criadoEm = c.agora(); f.exportadoEm = ''; f.vinculoV2 = null;
        return adiciona(f);
      }
      function lerSessao(id) { return lerJSON(CHAVES.sessao + id); }
      function lerLog(id) { return lerJSON(CHAVES.log + id); }
      function gravarSessao(id, s) {
        if (somenteLeitura()) return recusa('somente-leitura');
        var limpou = []; return resultado(escreve(CHAVES.sessao + id, JSON.stringify(s), limpou), limpou);
      }
      function gravarLog(id, l) {
        if (somenteLeitura()) return recusa('somente-leitura');
        var limpou = []; return resultado(escreve(CHAVES.log + id, JSON.stringify(l), limpou), limpou);
      }
      function exportar(id) {
        var f = lerFicha(id);
        return f ? exportarFicha(f, lerSessao(id), opcoes) : null;
      }
      // o texto cru da chave (ficha ilegível ou de versão futura): é o que dá
      // para salvar dela antes de excluir ou de gravar por cima
      function exportarCru(id) {
        var raw = ler(CHAVES.ficha + id);
        return raw == null ? null : { nomeArquivo: 'ficha-' + id + '.cru.khalkaria.json', texto: raw };
      }
      function motivoIlegivel(id) {
        var raw = ler(CHAVES.ficha + id), f = null;
        if (raw == null) return 'ausente';
        try { f = JSON.parse(raw); } catch (e) {}
        return obj(f) && versaoMaior(f.schemaVersion) > 3 ? 'versao-futura' : 'ilegivel';
      }
      // Todas as do índice; as que não viram v3 aqui vão cruas em dados.ilegiveis
      // e voltam em erros:[{id, motivo}] para a UI avisar.
      function exportarTodas() {
        var fichas = [], ileg = [];
        lerIndice().fichas.forEach(function (x) {
          var e = exportar(x.id);
          if (e) { fichas.push(e.dados); return; }
          ileg.push({ id: x.id, nome: str(x.nome), motivo: motivoIlegivel(x.id), texto: ler(CHAVES.ficha + x.id) });
        });
        var p = pacoteTodas(fichas, opcoes, ileg);
        p.erros = ileg.map(function (x) { return { id: x.id, motivo: x.motivo }; });
        return p;
      }
      // Excluir exige o export antes: opcoes.exportar(export) tem de devolver
      // algo diferente de false. Apaga a ficha, o log, a sessão e o rascunho de
      // subida daquele id; a ativa passa à mais recente (ou a nenhuma).
      function excluir(id, op) {
        if (somenteLeitura()) return recusa('somente-leitura');
        var ind = lerIndice();
        if (!existe(ind, id)) return recusa('inexistente');
        if (!op || typeof op.exportar !== 'function') return recusa('sem-export');
        var ex = exportar(id), cru = ex ? null : exportarCru(id), okEx = true;
        // ilegível ou de versão futura: só sai com o export CRU (op.exportarCru);
        // sem a chave (só a linha do índice), não há o que perder
        if (ex) { try { okEx = op.exportar(ex); } catch (e) { okEx = false; } }
        else if (cru) {
          if (typeof op.exportarCru !== 'function') return recusa('ilegivel', { motivo: motivoIlegivel(id), cru: cru });
          try { okEx = op.exportarCru(cru); } catch (e) { okEx = false; }
        }
        if (okEx === false) return recusa('export-falhou');
        ind.fichas = ind.fichas.filter(function (x) { return x.id !== id; });
        var eraAtiva = ativa() === id;
        if (ind.ultimaAtiva === id) ind.ultimaAtiva = maisRecente(ind);
        var nova = eraAtiva ? maisRecente(ind) : ativa();
        if (eraAtiva) ind.ultimaAtiva = nova;
        var limpou = [], r = escreve(CHAVES.indice, JSON.stringify(ind), limpou);
        if (!r.ok) return resultado(r, limpou);
        [CHAVES.ficha, CHAVES.log, CHAVES.sessao, CHAVES.nivelRascunho].forEach(function (p) { remove(p + id); });
        if (eraAtiva) marcaAtiva(nova);
        return resultado({ ok: true, ativa: nova }, limpou);
      }
      // Import: cada ficha entra como NOVA no índice. Id que já existe:
      // op.conflito 'atualizar' (com export dela antes, por op.exportar) ou
      // 'copia' (id novo); sem op.conflito, nada é gravado e os ids voltam.
      function importar(entrada, op) {
        op = op || {};
        if (somenteLeitura()) return recusa('somente-leitura');
        var lido = lerImport(entrada, Object.assign({}, opcoes, { catalogo: op.catalogo || opcoes.catalogo,
          calculado: op.calculado || opcoes.calculado }));
        if (!lido.fichas.length) return recusa((lido.erros[0] && lido.erros[0].erro) || 'vazio', { erros: lido.erros });
        var ind = lerIndice();
        var conflitos = lido.fichas.filter(function (x) { return existe(ind, x.ficha.id); }).map(function (x) { return x.ficha.id; });
        if (conflitos.length && op.conflito !== 'atualizar' && op.conflito !== 'copia') {
          return recusa('conflito', { conflitos: conflitos, erros: lido.erros });
        }
        var ids = [], limpou = [];
        for (var i = 0; i < lido.fichas.length; i++) {
          var x = lido.fichas[i], f = x.ficha, r;
          if (existe(lerIndice(), f.id) && op.conflito === 'atualizar') {
            if (podaPendente(f)) return recusa('poda-pendente', { ids: ids });
            var velha = lerJSON(CHAVES.ficha + f.id);
            // por cima de versão futura, nunca (guarda anti-downgrade)
            if (obj(velha) && versaoMaior(velha.schemaVersion) > 3) return recusa('versao-futura', { ids: ids, versao: str(velha.schemaVersion) });
            var ex = exportar(f.id), okEx;
            if (!ex) return recusa('ilegivel', { ids: ids, cru: exportarCru(f.id) });
            try { okEx = typeof op.exportar === 'function' ? op.exportar(ex) : false; } catch (e) { okEx = false; }
            if (okEx === false) return recusa('export-falhou', { ids: ids });
            f.rev = Math.max(inteiro(f.rev, 0), inteiro(velha && velha.rev, 0)) + 1;
            f.salvoEm = c.agora();
            r = gravaPar(f, lerIndice(), limpou);
            if (r.ok) {
              // o log de desfazer e o rascunho de subida eram da versão substituída;
              // a sessão dela também, se o arquivo não trouxer outra (foi no export)
              remove(CHAVES.log + f.id); remove(CHAVES.nivelRascunho + f.id);
              if (x.sessao != null) escreve(CHAVES.sessao + f.id, JSON.stringify(x.sessao), limpou);
              else remove(CHAVES.sessao + f.id);
              tornaAtiva(f.id);
            }
          } else {
            if (existe(lerIndice(), f.id)) {
              // cópia: id novo e, como no duplicar, sem vínculo com a v2
              f.id = novoId(usados(), opcoes);
              f.vinculoV2 = null; f.exportadoEm = '';
            }
            r = adiciona(f, x.sessao);
          }
          if (!r.ok) return resultado(recusa(r.erro, { ids: ids, sugestao: r.sugestao }), limpou.concat(r.limpou || []));
          ids.push(f.id);
        }
        return resultado({ ok: true, ids: ids, erros: lido.erros, avisos: lido.fichas.map(function (x) { return x.avisos; }) }, limpou);
      }
      // uso da quota: soma das chaves khalkaria_* (chave + valor, 2 bytes por char)
      function uso() {
        var porChave = {}, bytes = 0;
        chaves().forEach(function (k) {
          if (k.indexOf('khalkaria_') !== 0) return;
          var n = (k.length + str(ler(k)).length) * 2;
          porChave[k] = n; bytes += n;
        });
        return { bytes: bytes, limite: LIMITE_QUOTA, fracao: bytes / LIMITE_QUOTA, porChave: porChave };
      }
      return {
        listar: function () { return clone(lerIndice().fichas); },
        indice: function () { return clone(lerIndice()); },
        ativa: ativa, ativaExcluida: ativaExcluida, ler: lerFicha, gravar: gravar, criar: criar, trocar: trocar,
        duplicar: duplicar, excluir: excluir, exportar: exportar, exportarCru: exportarCru, exportarTodas: exportarTodas,
        importar: importar, uso: uso, lerSessao: lerSessao, gravarSessao: gravarSessao,
        lerLog: lerLog, gravarLog: gravarLog, somenteLeitura: somenteLeitura
      };
    }

    return {
      SCHEMA_VERSION: SCHEMA_VERSION, SCHEMA_INDICE: SCHEMA_INDICE, CHAVES: CHAVES, LIMITE_QUOTA: LIMITE_QUOTA,
      ATRIBUTOS: ATRIBUTOS.slice(), PERICIAS: PERICIAS.slice(), PERICIAS_MAIOR: clone(PERICIAS_MAIOR),
      TIPOS_DANO: TIPOS_DANO.slice(), CATEGORIAS_AE: CATEGORIAS_AE.slice(), TIPOS_ENTRADA: TIPOS_ENTRADA.slice(),
      FINS_TEMPORARIO: FINS_TEMPORARIO.slice(), EVENTOS_DURACAO: EVENTOS_DURACAO.slice(),
      PADRAO_AJUSTE: PADRAO_AJUSTE, ehCaminhoDeAjuste: ehCaminhoDeAjuste, validarAjuste: validarAjuste,
      ajustar: ajustar, desajustar: desajustar, podarAjustesMigrados: podarAjustesMigrados,
      CAMINHOS_DADO: CAMINHOS_DADO.slice(), modsAplicaveis: modsAplicaveis, entradasDeCatalogo: entradasDeCatalogo,
      novaFicha: novaFicha, novoId: novoId, versaoMaior: versaoMaior, normaliza: normaliza,
      estadoPadrao: estadoPadrao,
      migrarV1paraV2: migrarV1paraV2, migrarV2paraV3: migrarV2paraV3, migrar: migrar,
      indiceCatalogo: indiceCatalogo, reassociar: reassociar, reconciliar: reconciliar,
      exportarFicha: exportarFicha, pacoteTodas: pacoteTodas, lerImport: lerImport,
      sombra: sombra, armazem: armazem
    };
  })();

  // No artefato carregado pelo require, o module.exports é o KhInv: não sobrescreve.
  if (emNode) {
    if (typeof module.exports.migrarV1 !== 'function') module.exports = KhEstado;
    return;
  }
  raiz.KhEstado = KhEstado;
})(typeof window !== 'undefined' ? window : this);

// ==== js/ficha/ficha-v2.js ====
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
  function importJSON() {
    if (bloqueado()) return;
    var inp = el('input', { type:'file', accept:'.json,application/json' });
    inp.addEventListener('change', function () {
      var fr = new FileReader();
      fr.onload = function () {
        var f;
        try { f = JSON.parse(fr.result); } catch (e) { f = null; }
        if (!f || typeof f !== 'object' || Array.isArray(f)) { toast('JSON inválido'); return; }
        // ficha v3 (schemaVersion >= 3) não é rebaixada: a v2 recusa sem tocar em nada
        if (parseFloat(String(f.schemaVersion)) >= 3) {
          toast('Esta ficha é da v3 (schemaVersion ' + f.schemaVersion + ') e não pode ser importada aqui. Recarregue a página.', 6000);
          return;
        }
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
