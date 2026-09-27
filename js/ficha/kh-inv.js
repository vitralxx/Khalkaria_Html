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
