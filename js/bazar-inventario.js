/* ============================================================
   O BAZAR — inventário (aside#bz-inventario)
   Spec §4 e §7. É a projeção de ficha.inventario: lê KF.inventario() e
   KF.carga() e escreve SÓ pelos mutadores da KF (adicionar, quantidade,
   alternar, trocar, mover, remover, definirSins, lote, desfazer). Nunca toca
   no localStorage da ficha. As linhas são li.bz-slot, NUNCA .item-card: o
   MutationObserver da ficha.js penduraria "+ ficha" e draggable nelas.

   Adicionar por cinco caminhos, todos via KF.adicionar:
     1. .kf-addbtn do card (ficha.js; "+ inventário", Shift = 10)
     2. arrastar card/linha/ingrediente para uma coluna (a coluna VALE;
        cabeçalho do inventário e trilho usam a canônica)
     3. ação Guardar do painel de receita (bazar-receita.js)
     4. combobox "Guardar item… (i)" deste módulo
     5. drawer da Ficha (ficha.js)
   Mover entre colunas: arrasto com MIME application/x-kf-uid (sem text/plain,
   para o drawer ignorar) ou M na linha.

   Registra:
     BZ.inventario = { mostrar(id), piscar(uid), render(), estado(e) }
     BZ.camadaEsc(20, …)  lista do combobox (depois do pop-up, antes do painel)
     BZ.atalho('i' | 'I')  combobox · trilho/painel
   E a migração única e explícita da Mochila antiga (§7): BZ.sacoAntigo() e
   BZ.descartaSaco(), nunca em silêncio.
   ============================================================ */
(function (BZ) {
  'use strict';

  // ============================================================ parte pura
  // Sem DOM: testada em tools/testes/inventario-bazar.test.js.
  var QTD_MAX = 9999;
  var ORDEM_GRUPOS = ['Consumível', 'Munição', 'Material', 'Bugiganga', 'Item Mágico', 'Lixo', 'Arma'];
  var SEM_REGISTRO = 'Sem registro';

  function semAcentoMin(s) {
    return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }
  function tokensCat(cat) {
    return String(cat == null ? '' : cat).split(',').map(function (t) { return t.trim(); }).filter(Boolean);
  }
  // "11 flecha", "11x flecha", "11× flecha", "flecha x11" -> {n, termo}
  function interpretaBusca(txt) {
    var s = String(txt == null ? '' : txt).replace(/\s+/g, ' ').trim();
    var m, n = null, termo = s;
    if ((m = /^(\d{1,4})\s*[x×]?\s+(.+)$/i.exec(s)) || (m = /^(\d{1,4})\s*[x×]\s*(.+)$/i.exec(s))) {
      n = +m[1]; termo = m[2];
    } else if ((m = /^(.+?)\s+[x×]\s*(\d{1,4})$/i.exec(s))) {
      termo = m[1]; n = +m[2];
    }
    return { n: n >= 1 ? Math.min(n, QTD_MAX) : null, termo: termo.trim() };
  }
  // Casa sem acento: primeiro quem começa com o termo, depois quem contém,
  // depois quem contém todas as palavras. Dentro de cada faixa, por nome.
  var chaveBusca = typeof Map === 'function' ? new Map() : null;
  function nomeBusca(it) {
    if (!chaveBusca) return semAcentoMin(it.nome);
    var k = chaveBusca.get(it);
    if (k === undefined) { k = semAcentoMin(it.nome); chaveBusca.set(it, k); }
    return k;
  }
  function busca(itens, termo, max) {
    var q = semAcentoMin(termo);
    if (q.length < 2) return [];
    var palavras = q.split(' ').filter(Boolean);
    var ini = [], meio = [], todas = [];
    (itens || []).forEach(function (it) {
      if (!it || !it.nome) return;
      var n = nomeBusca(it), i = n.indexOf(q);
      if (i === 0) ini.push(it);
      else if (i > 0) meio.push(it);
      else if (palavras.length > 1 && palavras.every(function (p) { return n.indexOf(p) >= 0; })) todas.push(it);
    });
    function ord(a, b) { return a.nome.localeCompare(b.nome, 'pt'); }
    return ini.sort(ord).concat(meio.sort(ord), todas.sort(ord)).slice(0, max || 8);
  }
  function grupoDe(e, coluna) {
    if (coluna === 'equipamentos') return e.equipado ? 'Equipado' : 'Carregado';
    if (e.avulso) return SEM_REGISTRO;
    return tokensCat(e.categoria)[0] || SEM_REGISTRO;
  }
  // [{nome, itens}] na ordem do pedido; dentro do grupo, por nome (estável)
  function agrupa(entradas, coluna) {
    var g = {}, nomes = [];
    (entradas || []).forEach(function (e, i) {
      if (!e) return;
      var k = grupoDe(e, coluna);
      if (!g[k]) { g[k] = []; nomes.push(k); }
      g[k].push({ e: e, i: i });
    });
    var ordem = coluna === 'equipamentos' ? ['Equipado', 'Carregado'] : ORDEM_GRUPOS;
    nomes.sort(function (a, b) {
      var ia = ordem.indexOf(a), ib = ordem.indexOf(b);
      if (a === SEM_REGISTRO) ia = 1e6; if (b === SEM_REGISTRO) ib = 1e6;
      if (ia < 0) ia = 1e5; if (ib < 0) ib = 1e5;
      return ia - ib || a.localeCompare(b, 'pt');
    });
    return nomes.map(function (k) {
      return {
        nome: k,
        itens: g[k].sort(function (a, b) {
          return String(a.e.nome).localeCompare(String(b.e.nome), 'pt') || a.i - b.i;
        }).map(function (x) { return x.e; })
      };
    });
  }
  function diasDesde(iso, agora) {
    var t = Date.parse(iso || '');
    if (!isFinite(t)) return null;
    return Math.max(0, Math.floor(((agora == null ? Date.now() : agora) - t) / 864e5));
  }
  function textoExport(iso, agora) {
    var d = diasDesde(iso, agora);
    if (d == null) return { txt: 'Ficha nunca exportada', velha: true };
    return { txt: d === 0 ? 'Ficha exportada hoje' : 'Ficha exportada há ' + d + (d === 1 ? ' dia' : ' dias'), velha: d > 7 };
  }

  var P = {
    interpretaBusca: interpretaBusca, busca: busca, agrupa: agrupa, grupoDe: grupoDe,
    diasDesde: diasDesde, textoExport: textoExport, semAcentoMin: semAcentoMin,
    ORDEM_GRUPOS: ORDEM_GRUPOS.slice(), SEM_REGISTRO: SEM_REGISTRO
  };
  if (typeof module === 'object' && module && module.exports) { module.exports = P; return; }
  if (!BZ) return;

  // ============================================================ página
  var U = BZ.util, D = BZ.dados, E = BZ.E;
  var esc = U.esc, $ = U.$;
  var aside = $('#bz-inventario');
  if (!aside) return;

  var COLUNAS = ['bugigangas', 'equipamentos'];
  var ROTULO = { bugigangas: 'Bugigangas', equipamentos: 'Equipamentos' };
  var OUTRA = { bugigangas: 'equipamentos', equipamentos: 'bugigangas' };
  var ORD_ESTADO = { ok: 0, leve: 1, extremo: 2 };
  var TOAST_MS = 6000, MOLA_MS = 500, PISCA_MS = 1500, PIORA_MS = 700, REMOVE_MS = 160;
  var ATALHOS_LINHA = 'ArrowUp ArrowDown Home End Enter Plus - Q Delete E T S M';
  var MSG_EQUIPADO_1 = 'Item equipado conta 1 unidade; desequipe para mudar a quantidade';
  var MSG_MIGRACAO ='Inventário convertido: 4 listas → 2 colunas. Armaduras e materiais agora pesam; marque o que está Equipado.';

  var el = {
    trilho: $('#bz-trilho'), cab: $('#bz-inv-cab'), dono: $('#bz-inv-dono'),
    amplo: $('#bz-inv-amplo'), recolher: $('#bz-inv-recolher'), ficha: $('#bz-inv-ficha'),
    forca: $('#bz-inv-for'), sins: $('#bz-inv-sins'), peso: $('#bz-inv-peso'), cond: $('#bz-inv-cond'),
    cbBox: $('#bz-cb'), cb: $('#bz-cb-input'), cbLista: $('#bz-cb-lista'),
    faixas: $('#bz-inv-faixas'), exp: $('#bz-inv-export'), toast: $('#bz-toast'),
    cols: {}
  };
  COLUNAS.forEach(function (c) {
    var s = aside.querySelector('section.bz-col[data-col="' + c + '"]');
    el.cols[c] = {
      sec: s, lista: s.querySelector('ul.bz-col-lista'), num: s.querySelector('[data-num]'),
      est: s.querySelector('[data-est]'), regua: s.querySelector('[data-regua]'),
      recolher: s.querySelector('[data-col-recolher]'), mais: s.querySelector('[data-col-mais]'),
      solte: s.querySelector('[data-solte]')
    };
  });

  var ativo = { bugigangas: '', equipamentos: '' };   // roving tabindex: a linha com tabindex 0
  var conflito = null;        // {uid, campo, cf}: "Trocar por esta" pendente na linha
  var piscaPend = '', focoPend = null, renderT = null;
  var ultimoEstado = { bugigangas: null, equipamentos: null }, ultimaCond = null, condT = null;
  var naoReconhecidos = null; // nomes da Mochila antiga que o "Levar" não achou
  var toastT = null, toastUid = '';
  var reduzMov = false;
  try { reduzMov = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  // ------------------------------------------------------------ utilidades
  function kf() { return U.kf(); }
  function colunaCanonica(x) {
    if (window.KhInv && typeof window.KhInv.colunaCanonica === 'function') return window.KhInv.colunaCanonica(x);
    return x && x.inv && x.inv.slot === 'equipamento' ? 'equipamentos' : 'bugigangas';
  }
  function pilha() { return (window.KhInv && window.KhInv.REGRAS && window.KhInv.REGRAS.PILHA) || 10; }
  function sinal(n) { return (n >= 0 ? '+' : '−') + Math.abs(n); }
  function lerInv() { var k = kf(); try { return k ? k.inventario() : null; } catch (e) { return null; } }
  function lerCarga() { var k = kf(); try { return k ? k.carga() : null; } catch (e) { return null; } }
  function acha(inv, uid) {
    for (var i = 0; i < COLUNAS.length; i++) {
      var l = (inv && inv[COLUNAS[i]]) || [];
      for (var j = 0; j < l.length; j++) if (l[j] && l[j].uid === uid) return { coluna: COLUNAS[i], e: l[j], i: j };
    }
    return null;
  }
  function entrada(uid) { var a = acha(lerInv(), uid); return a ? a.e : null; }
  function itemDe(e) { return e && !e.avulso && e.id && D.porId[e.id] ? D.porId[e.id] : null; }
  function ehMagico(e) { return tokensCat(e && e.categoria).indexOf('Item Mágico') >= 0; }
  function condInfo(c) {
    var v = window.BZ_VOCAB && window.BZ_VOCAB.condicoes && window.BZ_VOCAB.condicoes[c];
    return {
      id: (v && v.id) || 'sobrepeso-' + c,
      nome: (v && v.nome) || (c === 'leve' ? 'Sobrepeso Leve' : 'Sobrepeso Extremo'),
      texto: (v && v.texto) || ''
    };
  }
  // reescreve só se o HTML mudou (compara com o que foi escrito, não com a reserialização)
  function trocaHTML(no, html) { if (no && no._bzHtml !== html) { no.innerHTML = html; no._bzHtml = html; } }
  function agendaRender() {
    if (renderT) return;
    renderT = U.raf(function () { renderT = null; render(); });
  }

  // ------------------------------------------------------------ textos da carga
  function contaCapacidade(c, cg) {
    var R = (window.KhInv && window.KhInv.REGRAS) || { BASE_BUG: 10, BASE_EQ: 2, MIN: 1 };
    var base = c === 'bugigangas' ? R.BASE_BUG : R.BASE_EQ;
    var col = cg[c], m = cg.modFor;
    var s = base + ' base ' + (m < 0 ? '− ' + (-m) : '+ ' + m) + ' FOR ' + cg.forca;
    if (base + m < R.MIN) s += ' (mín. ' + R.MIN + ')';
    (col.bonus || []).forEach(function (b) {
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
  function nomeEstado(est) {
    return est === 'leve' ? 'Sobrepeso Leve' : est === 'extremo' ? 'Sobrepeso Extremo' : '';
  }
  function seloCondHTML(cond) {
    if (cond !== 'leve' && cond !== 'extremo') return '<span class="bz-cond bz-cond-nenhuma">Sem sobrepeso</span>';
    var ci = condInfo(cond);
    return '<a class="bz-cond bz-cond-' + cond + '" href="condicoes.html#' + esc(ci.id) + '" title="' +
      esc(ci.texto || ('Ver ' + ci.nome + ' em Condições')) + '">' + esc(ci.nome) + '</a>';
  }
  function motivoPeso(e, coluna, cg, inv) {
    var m = cg.motivoPorUid[e.uid], p = cg.pesoPorUid[e.uid] || 0;
    if (m === 'equipado') return 'equipado não conta';
    if (m === 'nao-ocupa') return 'não ocupa espaço';
    if (m === 'unidade') return 'cada item pesa 1';
    if (m === 'pilha') {
      if (!p) return 'soma na pilha da outra linha deste item';
      var k = e.id || e.uid, soma = 0;
      (inv[coluna] || []).forEach(function (x) {
        if (x && cg.motivoPorUid[x.uid] === 'pilha' && (x.id || x.uid) === k) soma += +x.qtd || 0;
      });
      return soma + ' un. ÷ ' + pilha() + ', arredonda para cima = ' + p;
    }
    return '';
  }
  function textoConflito(cf) {
    var inv = lerInv();
    var nomes = (cf.uids || []).map(function (u) { var a = acha(inv, u); return a ? a.e.nome : ''; }).filter(Boolean);
    var n = nomes.length, lista = n ? ' (' + nomes.join(', ') + ')' : '';
    if (cf.tipo === 'pesada') return 'Já há ' + n + (n === 1 ? ' Armadura Pesada equipada' : ' Armaduras Pesadas equipadas') + lista + '.';
    if (cf.tipo === 'leve') return 'Já há ' + n + (n === 1 ? ' Armadura Leve equipada' : ' Armaduras Leves equipadas') + lista + '.';
    return 'Já há ' + n + (n === 1 ? ' Item Mágico sintonizado' : ' Itens Mágicos sintonizados') + lista + '.';
  }

  // ------------------------------------------------------------ régua (role=meter)
  function reguaHTML(col) {
    var total = 2 * col.max;
    var ok = total > 0 ? Math.min(col.usado, col.max) / total * 100 : 0;
    var exc = total > 0 ? Math.max(0, Math.min(col.usado, total) - col.max) / total * 100 : 0;
    // entalhes por cima do preenchimento: um por unidade até 40, senão tique a cada 5
    return '<span class="bz-regua-ok" style="width:' + ok + '%"></span>' +
      (exc > 0 ? '<span class="bz-regua-exc" style="width:' + exc + '%;left:50%"></span>' : '') +
      '<span class="bz-regua-entalhes" aria-hidden="true"></span>' +
      '<span class="bz-regua-marco" aria-hidden="true"></span>' +
      (col.usado > total ? '<span class="bz-regua-mais">+' + (col.usado - total) + '</span>' : '');
  }
  function pintaRegua(no, c, col) {
    var cond = nomeEstado(col.estado);
    no.setAttribute('aria-valuemin', '0');
    no.setAttribute('aria-valuemax', String(col.max));
    no.setAttribute('aria-valuenow', String(col.usado));
    no.setAttribute('aria-valuetext', col.usado + ' de ' + col.max + ' ' + ROTULO[c].toLowerCase() + (cond ? ', ' + cond : ''));
    no.setAttribute('data-estado', col.estado);
    var total = Math.max(1, 2 * col.max);
    no.classList.toggle('segmentada', total <= 40);
    no.classList.toggle('ticada', total > 40);
    no.style.setProperty('--bz-n', String(total));
    no.style.setProperty('--bz-t', String(total / 5));
    trocaHTML(no, reguaHTML(col));
  }

  // ------------------------------------------------------------ linhas
  function medalhaoHTML(e) {
    var it = itemDe(e) || { arte: e.arte, cats: tokensCat(e.categoria) };
    return '<span class="bz-slot-med">' + (e.avulso ? U.svg('ico-bugiganga', 'bz-slot-ico') : U.arte(it, 'bz-slot-ico')) +
      (e.equipado ? U.svg('ico-equipado', 'bz-slot-fivela') : '') + '</span>';
  }
  function selosHTML(e, avisos) {
    var h = [];
    if (e.sintonizado) h.push('<span class="bz-selo bz-selo-sint" title="Sintonizado">' + U.svg('ico-sintonia') + 'sintonizado</span>');
    if (e.avulso) h.push('<span class="bz-selo" title="Item criado à mão, sem efeito do registro">sem registro</span>');
    var cap = e.inv && e.inv.capacidade;
    if (cap && (cap.bug || cap.equip)) {
      var p = [];
      if (cap.bug) p.push('+' + cap.bug + ' ' + (cap.bug === 1 ? 'bugiganga' : 'bugigangas'));
      if (cap.equip) p.push('+' + cap.equip + ' ' + (cap.equip === 1 ? 'equipamento' : 'equipamentos'));
      h.push('<span class="bz-selo bz-selo-cap" title="aumenta a capacidade: ' + esc(p.join(' e ')) + '">' +
        esc(p.join(' · ')) + ' capacidade</span>');
    }
    avisos.forEach(function (a) {
      if (a.tipo === 'copia') h.push('<span class="bz-selo bz-selo-aviso" title="' + esc(a.msg) + '">cópia não acumula</span>');
      else if (a.tipo === 'orfao') h.push('<span class="bz-selo bz-selo-aviso" title="' + esc(a.msg) + '">fora do registro</span>');
      else if (a.tipo === 'fora-da-regra') {
        h.push('<button type="button" class="bz-selo bz-selo-aviso bz-selo-btn" data-acao="corrigir" tabindex="-1" title="' +
          esc(a.msg + ' (clique para mover)') + '">fora da regra · corrigir</button>');
      }
    });
    if (e.inv && e.inv.recipiente) {
      h.push('<span class="bz-selo" title="Armazena até ' + e.inv.recipiente +
        ' Bugigangas: a ficha ainda não desconta isso">recipiente ainda não modelado</span>');
    }
    return h.length ? '<span class="bz-slot-selos">' + h.join('') + '</span>' : '';
  }
  function caixaHTML(acao, rotulo, marcado, extra, atalho) {
    return '<label class="bz-slot-cx"' + (atalho ? ' title="' + rotulo + ' (' + atalho + ')"' : '') + '><input type="checkbox" data-acao="' + acao + '" tabindex="-1"' +
      (marcado ? ' checked' : '') + (atalho ? ' aria-keyshortcuts="' + atalho + '"' : '') + '> ' +
      rotulo + (extra || '') + '</label>';
  }
  function linhaHTML(e, coluna, cg, inv, avisos, tab) {
    var uid = e.uid, peso = cg.pesoPorUid[uid] || 0;
    var it = itemDe(e);
    var rar = e.raridade || (it && it.raridade) || '';
    var nomeAttrs = ' data-prever="' + esc(it && !e.orfao ? it.id : 'e:' + uid) + '"' + (it && !e.orfao ? ' data-ir="' + esc(it.id) + '"' : '');
    var rotulo = e.nome + ', ' + e.qtd + ', peso ' + peso + (e.empilhavel ? ', empilhável' : '') +
      (e.equipado ? ', equipado' : '') + (e.sintonizado ? ', sintonizado' : '') + (e.avulso ? ', sem registro' : '');
    var dif = typeof e.empilhavelRegistro === 'boolean' && e.empilhavel !== e.empilhavelRegistro
      ? '<span class="bz-dif" title="o registro diz: ' + (e.empilhavelRegistro ? 'empilhável' : 'não empilhável') + '"></span>' : '';
    var h = '<li class="bz-slot ' + (rar ? U.classeRar(rar) : 'rar-ordinario') +
      (e.equipado ? ' is-equipado' : '') + (e.avulso ? ' is-avulso' : '') + (e.orfao ? ' is-orfao' : '') +
      '" data-uid="' + esc(uid) + '" tabindex="' + (tab ? '0' : '-1') + '" draggable="true" aria-label="' + esc(rotulo) +
      '" aria-keyshortcuts="' + ATALHOS_LINHA + '">' +
      '<div class="bz-slot-l1">' + medalhaoHTML(e) +
        '<button type="button" class="bz-slot-nome" tabindex="-1"' + nomeAttrs + '>' + esc(e.nome) + '</button>' +
        '<span class="bz-slot-peso" title="' + esc(motivoPeso(e, coluna, cg, inv)) + '">' +
          (e.empilhavel ? U.svg('ico-empilhavel', 'bz-slot-pilha') : '') + '= ' + peso + '</span>' +
        '<button type="button" class="bz-slot-x" data-acao="x" tabindex="-1" aria-label="Remover ' + esc(e.nome) +
          '" title="Remover (Delete)">×</button>' +
      '</div>' +
      '<div class="bz-slot-l2">' +
        '<span class="bz-stepper bz-slot-step">' +
          '<button type="button" data-acao="menos" tabindex="-1" aria-label="Diminuir ' + esc(e.nome) + '" title="Menos 1 (−; Shift: 10)" aria-keyshortcuts="-">−</button>' +
          '<input type="text" inputmode="numeric" data-acao="qtd" tabindex="-1" value="' + e.qtd + '" aria-label="Quantidade de ' +
            esc(e.nome) + '" title="' + (e.equipado ? esc(MSG_EQUIPADO_1) : 'Quantidade (Enter aplica; abaixo de 1 remove)') +
            '" aria-keyshortcuts="Q" autocomplete="off"' + (e.equipado ? ' readonly' : '') + '>' +
          '<button type="button" data-acao="mais" tabindex="-1" aria-label="Aumentar ' + esc(e.nome) + '" title="' +
            (e.equipado ? esc(MSG_EQUIPADO_1) : 'Mais 1 (+; Shift: 10)') + '" aria-keyshortcuts="Plus"' + (e.equipado ? ' disabled' : '') + '>+</button>' +
        '</span>' +
        caixaHTML('emp', 'Item Empilhável', e.empilhavel, dif, 'S') +
        (coluna === 'equipamentos' ? caixaHTML('equip', 'Equipado', e.equipado, '', 'E') : '') +
        (ehMagico(e) ? caixaHTML('sint', 'Sintonizado', e.sintonizado, '', 'T') : '') +
        selosHTML(e, avisos) +
      '</div>';
    // estado importado acima do limite vira aviso, sem bloquear
    avisos.forEach(function (a) {
      if (a.tipo === 'pesada' || a.tipo === 'leve' || a.tipo === 'sintonia') {
        h += '<p class="bz-slot-aviso">' + U.svg('ico-aviso', 'bz-ico-aviso') + esc(a.msg) + '</p>';
      }
    });
    if (conflito && conflito.uid === uid) {
      h += '<p class="bz-slot-aviso" role="status">' + U.svg('ico-aviso', 'bz-ico-aviso') + esc(textoConflito(conflito.cf)) +
        ' <button type="button" class="bz-slot-trocar" data-acao="trocar">Trocar por esta</button></p>';
    }
    return h + '</li>';
  }
  function grupoCabHTML(g, coluna, cg, raiz) {
    var peso = g.itens.reduce(function (s, e) { return s + (cg.pesoPorUid[e.uid] || 0); }, 0);
    var nome = g.nome === 'Equipado' ? 'Equipado (não pesa)' : g.nome;
    return '<li class="bz-inv-grupo' + (raiz ? ' com-raiz' : '') + '" data-grupo="' + esc(g.nome) + '">' +
      (raiz ? '<svg class="bz-inv-grupo-raiz" aria-hidden="true"><use href="#raizes"/></svg>' : '') +
      '<span class="bz-inv-grupo-nome">' + esc(nome) + '</span> · ' + g.itens.length +
      (g.nome === 'Equipado' ? '' : ' · peso ' + peso) + '</li>';
  }
  function listaHTML(coluna, inv, cg, avisosPorUid) {
    var l = (inv[coluna] || []).filter(function (e) { return e && e.uid; });
    if (!l.length) {
      return '<li class="bz-col-vazio"><svg class="bz-vazio-ico" aria-hidden="true"><use href="#saco-vazio"/></svg>' +
        '<p>Nada carregado. Arraste um item do registro ou use o campo acima.</p></li>';
    }
    var grupos = agrupa(l, coluna);
    var uids = [];
    grupos.forEach(function (g) { g.itens.forEach(function (e) { uids.push(e.uid); }); });
    if (uids.indexOf(ativo[coluna]) < 0) ativo[coluna] = uids[0];
    var temEquipado = false;
    return grupos.map(function (g) {
      var raiz = coluna === 'equipamentos' && g.nome === 'Carregado' && temEquipado;
      if (g.nome === 'Equipado') temEquipado = true;
      return grupoCabHTML(g, coluna, cg, raiz) + g.itens.map(function (e) {
        return linhaHTML(e, coluna, cg, inv, avisosPorUid[e.uid] || [], e.uid === ativo[coluna]);
      }).join('');
    }).join('');
  }

  // ------------------------------------------------------------ foco preservado
  function lembraFoco() {
    if (focoPend) return;
    var a = document.activeElement;
    if (!a || !aside.contains(a)) return;
    var li = a.closest('li.bz-slot');
    if (!li) return;
    focoPend = { uid: li.getAttribute('data-uid'), acao: a === li ? '' : (a.getAttribute('data-acao') || '') };
  }
  function linhaDe(uid) {
    return uid ? aside.querySelector('li.bz-slot[data-uid="' + CSS.escape(uid) + '"]') : null;
  }
  function devolveFoco() {
    var f = focoPend;
    focoPend = null;
    if (!f) return;
    var li = linhaDe(f.uid);
    if (!li) {
      if (f.col && el.cols[f.col]) el.cols[f.col].mais.focus({ preventScroll: true });
      return;
    }
    setAtivo(li);
    var alvo = f.acao ? li.querySelector('[data-acao="' + f.acao + '"]') : null;
    (alvo || li).focus({ preventScroll: true });
    li.scrollIntoView({ block: 'nearest' });
  }
  function setAtivo(li) {
    var sec = li.closest('section.bz-col');
    if (!sec) return;
    var c = sec.getAttribute('data-col');
    ativo[c] = li.getAttribute('data-uid');
    sec.querySelectorAll('li.bz-slot[tabindex="0"]').forEach(function (x) { if (x !== li) x.setAttribute('tabindex', '-1'); });
    li.setAttribute('tabindex', '0');
  }
  // linha vizinha (a próxima, senão a anterior) para o foco depois de remover
  function vizinha(uid) {
    var li = linhaDe(uid);
    if (!li) return null;
    var sec = li.closest('section.bz-col');
    var todas = Array.prototype.slice.call(sec.querySelectorAll('li.bz-slot'));
    var i = todas.indexOf(li);
    var v = todas[i + 1] || todas[i - 1];
    return { uid: v ? v.getAttribute('data-uid') : '', col: sec.getAttribute('data-col') };
  }

  // ------------------------------------------------------------ render
  function renderSemKF() {
    COLUNAS.forEach(function (c) {
      trocaHTML(el.cols[c].lista, '<li class="bz-col-vazio"><p>' + U.svg('ico-aviso', 'bz-ico-aviso') +
        'Recarregue a página (Ctrl+F5) para atualizar a ficha.</p></li>');
    });
    el.cb.disabled = true;
    el.sins.disabled = true;
  }
  function render() {
    var k = kf();
    if (!k) { renderSemKF(); return; }
    el.cb.disabled = false;
    el.sins.disabled = false;
    var inv = lerInv(), cg = lerCarga();
    if (!inv || !cg) return;
    lembraFoco();
    cabecalho(k, inv, cg);
    trilho(cg);
    var avisosPorUid = {};
    (cg.avisos || []).forEach(function (a) {
      (a.uids || []).forEach(function (u) { (avisosPorUid[u] = avisosPorUid[u] || []).push(a); });
    });
    COLUNAS.forEach(function (c) { coluna(c, inv, cg, avisosPorUid); });
    if (BZ.pronto) faixas(k);
    rodape(k);
    devolveFoco();
    aplicaPisca();
    condicao(cg);
  }
  function cabecalho(k, inv, cg) {
    var nome = typeof k.nome === 'function' ? k.nome() : '';
    el.dono.textContent = nome ? 'de ' + nome : 'personagem sem nome';
    var F = cg.forca, m = cg.modFor;
    el.forca.textContent = 'FOR ' + F + ' (' + sinal(m) + ')';
    el.forca.setAttribute('aria-label', 'Força ' + F + ', modificador ' + sinal(m) + '. Editar na Ficha');
    if (document.activeElement !== el.sins) el.sins.value = inv.sins || 0;
    trocaHTML(el.peso, 'Peso total <b>' + cg.pesoTotal + '</b><small>' + cg.bugigangas.usado + ' bugigangas + ' +
      cg.equipamentos.usado + ' equipamentos</small>');
    trocaHTML(el.cond, seloCondHTML(cg.condicao));
    var amplo = E.inv === 'amplo';
    el.amplo.setAttribute('aria-pressed', String(amplo));
    el.amplo.title = amplo ? 'Voltar ao painel' : 'Amplo: o inventário ocupa a mesa';
  }
  function trilho(cg) {
    COLUNAS.forEach(function (c) {
      var col = cg[c], r = el.trilho.querySelector('.bz-trilho-regua[data-carga="' + c + '"]');
      if (!r) return;
      var total = 2 * col.max;
      r.style.setProperty('--bz-pct', (total > 0 ? Math.min(100, col.usado / total * 100) : 0) + '%');
      r.setAttribute('data-estado', col.estado);
    });
    el.trilho.querySelector('#bz-trilho-peso').textContent = cg.pesoTotal;
    var ponto = el.trilho.querySelector('#bz-trilho-cond');
    ponto.className = 'bz-trilho-cond bz-cond-' + cg.condicao;
    var cond = cg.condicao === 'nenhuma' ? 'Sem sobrepeso' : condInfo(cg.condicao).nome;
    el.trilho.setAttribute('aria-label', 'Abrir o inventário. Peso total ' + cg.pesoTotal + ', ' + cond +
      '. Bugigangas ' + cg.bugigangas.usado + ' de ' + cg.bugigangas.max +
      ', Equipamentos ' + cg.equipamentos.usado + ' de ' + cg.equipamentos.max);
  }
  function coluna(c, inv, cg, avisosPorUid) {
    var x = el.cols[c], col = cg[c];
    trocaHTML(x.num, '<b>' + col.usado + '</b> / ' + col.max);
    x.num.title = contaCapacidade(c, cg);
    x.num.setAttribute('tabindex', '0');
    x.num.setAttribute('aria-label', col.usado + ' de ' + col.max + '. ' + contaCapacidade(c, cg));
    x.est.textContent = textoEstado(col);
    x.sec.setAttribute('data-estado', col.estado);
    pintaRegua(x.regua, c, col);
    var antes = ultimoEstado[c];
    if (antes && ORD_ESTADO[col.estado] > ORD_ESTADO[antes] && !reduzMov) {
      x.regua.classList.remove('bz-piora');
      void x.regua.offsetWidth;
      x.regua.classList.add('bz-piora');
      setTimeout(function () { x.regua.classList.remove('bz-piora'); }, PIORA_MS);
    }
    ultimoEstado[c] = col.estado;
    var rec = !!E.colRecolhida[c];
    x.sec.classList.toggle('recolhida', rec);
    x.recolher.setAttribute('aria-expanded', String(!rec));
    x.recolher.setAttribute('aria-label', (rec ? 'Expandir ' : 'Recolher ') + ROTULO[c]);
    x.recolher.title = (rec ? 'Expandir ' : 'Recolher ') + ROTULO[c];
    var topo = x.lista.scrollTop;
    x.lista.innerHTML = listaHTML(c, inv, cg, avisosPorUid);
    x.lista._bzHtml = null;
    x.lista.scrollTop = topo;
  }
  function condicao(cg) {
    var c = cg.condicao;
    if (ultimaCond !== null && c !== ultimaCond) {
      var txt = c === 'nenhuma' ? 'Sem sobrepeso' : condInfo(c).nome;
      // depois do "Guardado:" / "Removido:" que a ação acabou de anunciar
      clearTimeout(condT);
      condT = setTimeout(function () { BZ.anunciar('Condição: ' + txt); }, 1200);
    }
    ultimaCond = c;
  }

  // ------------------------------------------------------------ faixas
  function faixaHTML(tipo, texto, botoes) {
    return '<div class="bz-faixa bz-faixa-' + tipo + '" data-faixa="' + tipo + '">' +
      '<p>' + texto + '</p><span class="bz-faixa-acoes">' + botoes.map(function (b) {
        return '<button type="button" class="bz-faixa-btn' + (b[2] ? ' ' + b[2] : '') + '" data-faixa-acao="' + b[0] + '">' + b[1] + '</button>';
      }).join('') + '</span></div>';
  }
  function resumoSaco(saco) {
    var nomes = Object.keys(saco).filter(function (n) { return Math.floor(+saco[n]) >= 1; });
    var un = nomes.reduce(function (s, n) { return s + Math.floor(+saco[n]); }, 0);
    var lista = nomes.slice(0, 4).map(function (n) { return esc(n) + ' ×' + Math.floor(+saco[n]); }).join(', ') +
      (nomes.length > 4 ? '…' : '');
    return { n: nomes.length, un: un, lista: lista };
  }
  function faixas(k) {
    var h = '';
    if (k.migradoEm() && !E.avisoMigracaoVisto) {
      h += faixaHTML('migracao', esc(MSG_MIGRACAO), [['migracao-ok', 'Entendi']]);
    }
    var saco = !E.sacoMigrado && BZ.sacoAntigo ? BZ.sacoAntigo() : null;
    if (saco) {
      var r = resumoSaco(saco);
      if (!r.n) BZ.descartaSaco();
      else {
        h += faixaHTML('saco', 'A Mochila antiga do Bazar guardava ' + r.n + (r.n === 1 ? ' material' : ' materiais') +
          ' (' + r.un + (r.un === 1 ? ' unidade' : ' unidades') + '): ' + r.lista,
          [['saco-levar', 'Levar para Bugigangas', 'forte'], ['saco-descartar', 'Descartar']]);
      }
    }
    if (naoReconhecidos && naoReconhecidos.length) {
      h += faixaHTML('nr', 'Não reconhecidos no registro, ficaram de fora: ' + naoReconhecidos.map(esc).join(', ') + '.',
        [['nr-ok', 'Fechar']]);
    }
    trocaHTML(el.faixas, h);
  }
  function porSemAcento(nome) {
    var alvo = semAcentoMin(nome);
    for (var i = 0; i < D.ITENS.length; i++) if (semAcentoMin(D.ITENS[i].nome) === alvo) return D.ITENS[i];
    return null;
  }
  // "Levar": casa por nome exato, depois sem acento; adiciona com o empilhável do registro
  function levarSaco() {
    var k = kf(), saco = BZ.sacoAntigo ? BZ.sacoAntigo() : null;
    if (!k || !saco) return;
    var nr = [], levados = 0, un = 0;
    k.lote(function () {
      Object.keys(saco).forEach(function (nome) {
        var n = Math.floor(+saco[nome]);
        if (!(n >= 1)) return;
        var it = D.porNome[nome] || porSemAcento(nome);
        if (!it) { nr.push(nome + ' ×' + n); return; }
        if (k.adicionar(it, { qtd: Math.min(n, QTD_MAX) })) { levados++; un += n; }
      });
    });
    BZ.descartaSaco();
    naoReconhecidos = nr.length ? nr : null;
    BZ.anunciar('Mochila antiga levada: ' + levados + (levados === 1 ? ' item' : ' itens') + ' (' + un + ' unidades)' +
      (nr.length ? '; ' + nr.length + ' não reconhecido' + (nr.length > 1 ? 's' : '') : ''));
    render();
  }
  function descartarSaco() {
    BZ.descartaSaco();
    BZ.anunciar('Mochila antiga descartada');
    render();
  }

  // ------------------------------------------------------------ rodapé e toast
  function rodape(k) {
    var t = textoExport(k.exportadoEm());
    el.exp.classList.toggle('velha', t.velha);
    trocaHTML(el.exp, '<span>' + esc(t.txt) + '</span> · <button type="button" class="bz-inv-exportar" id="bz-inv-exportar">Exportar ficha</button>');
  }
  function toast(msg, desfazer, uid) {
    clearTimeout(toastT);
    toastUid = uid || '';
    el.toast.innerHTML = '<span>' + esc(msg) + '</span>' +
      (desfazer ? ' · <button type="button" class="bz-toast-btn" data-toast-desfazer title="Desfazer (Ctrl+Z)" aria-keyshortcuts="Control+Z">Desfazer</button>' : '');
    el.toast.classList.add('on');
    toastT = setTimeout(fechaToast, TOAST_MS);
  }
  function fechaToast() {
    clearTimeout(toastT);
    el.toast.classList.remove('on');
    if (el.toast.contains(document.activeElement)) {
      var li = linhaDe(ativo.bugigangas) || linhaDe(ativo.equipamentos);
      if (li) li.focus({ preventScroll: true }); else el.cb.focus({ preventScroll: true });
    }
    el.toast.innerHTML = '';
  }
  function desfazer(daTecla) {
    var k = kf();
    if (!k || !k.desfazer()) { if (daTecla) BZ.anunciar('Nada a desfazer'); return false; }
    if (toastUid && aside.contains(document.activeElement)) focoPend = { uid: toastUid, acao: '' };
    conflito = null;
    clearTimeout(toastT);
    el.toast.innerHTML = '<span>Desfeito</span>';
    el.toast.classList.add('on');
    toastT = setTimeout(fechaToast, 2000);
    return true;
  }

  // ------------------------------------------------------------ ações
  function guardar(item, coluna, n) {
    var k = kf();
    if (!k || !item) return null;
    var col = coluna || (item.avulso ? 'bugigangas' : colunaCanonica(item));
    var uid = k.adicionar(item, { qtd: n, coluna: col });
    if (!uid) return null;
    var cg = lerCarga(), c = cg && cg[col];
    BZ.anunciar('Guardado: ' + n + '× ' + item.nome + ' em ' + ROTULO[col] + (c ? ' (' + c.usado + '/' + c.max + ')' : ''));
    piscar(uid);
    return uid;
  }
  // A linha removida fecha a altura até 0 em 160ms (§10) e só então sai da
  // ficha; com movimento reduzido, sai na hora.
  var saindo = {};
  function remover(uid) {
    var k = kf(), e = entrada(uid);
    if (!k || !e || saindo[uid]) return;
    var v = vizinha(uid);
    var comFoco = aside.contains(document.activeElement);
    var li = linhaDe(uid);
    function fim() {
      delete saindo[uid];
      var e2 = entrada(uid);
      if (!e2) return;
      if (comFoco) focoPend = v ? { uid: v.uid, acao: '', col: v.col } : null;
      if (k.remover(uid)) toast('Removido: ' + e2.nome, true, uid);
    }
    if (!li || reduzMov) { fim(); return; }
    saindo[uid] = true;
    li.style.height = li.offsetHeight + 'px';
    void li.offsetHeight;
    li.classList.add('bz-sai');
    setTimeout(fim, REMOVE_MS);
  }
  function quantidade(uid, n) {
    var k = kf(), e = entrada(uid);
    if (!k || !e) return;
    n = parseInt(n, 10);
    if (!isFinite(n)) return;
    if (n < 1) { remover(uid); return; }
    // invariante da ficha v2: toda entrada equipada tem qtd 1
    if (e.equipado && n > 1) { BZ.anunciar(MSG_EQUIPADO_1); render(); return; }
    k.quantidade(uid, Math.min(n, QTD_MAX));
  }
  function passo(uid, d) {
    var e = entrada(uid);
    if (e) quantidade(uid, (+e.qtd || 1) + d);
  }
  function alternar(uid, campo) {
    var k = kf(), e = entrada(uid);
    if (!k || !e) return;
    var r = k.alternar(uid, campo);
    if (r && r.ok) {
      conflito = null;
      if (aside.contains(document.activeElement)) {
        var a = document.activeElement;
        focoPend = { uid: r.uid || uid, acao: a.getAttribute('data-acao') || '' };
      }
      if (campo === 'equipado') BZ.anunciar(e.nome + (e.equipado ? ' desequipado' : ' equipado'));
      else if (campo === 'sintonizado') BZ.anunciar(e.nome + (e.sintonizado ? ' dessintonizado' : ' sintonizado'));
      else BZ.anunciar(e.nome + (e.empilhavel ? ': não empilhável' : ': Item Empilhável'));
      return;
    }
    if (r && r.conflito) {
      conflito = { uid: uid, campo: campo, cf: r.conflito };
      BZ.anunciar(textoConflito(r.conflito) + ' Use Trocar por esta.');
    } else if (r && r.erro === 'coluna') {
      BZ.anunciar('Equipado só vale na coluna Equipamentos');
    }
    render();   // devolve a caixa ao estado real (nada mudou)
  }
  function trocarConflito() {
    var k = kf(), c = conflito;
    if (!k || !c) return;
    conflito = null;
    var e = entrada(c.uid);
    var r = k.lote(function () { return k.trocar(c.uid, c.campo, c.cf.uids); });
    if (r && r.ok) {
      focoPend = { uid: r.uid || c.uid, acao: '' };
      toast('Trocado: ' + (e ? e.nome : '') + (c.campo === 'sintonizado' ? ' sintonizado' : ' equipado'), true, r.uid || c.uid);
    } else render();
  }
  function mover(uid, coluna) {
    var k = kf(), a = acha(lerInv(), uid);
    if (!k || !a || a.coluna === coluna) return;
    var r = k.mover(uid, coluna);
    if (r && r.ok) {
      if (aside.contains(document.activeElement)) focoPend = { uid: r.uid || uid, acao: '' };
      toast('Movido: ' + a.e.nome + ' → ' + ROTULO[coluna], true, r.uid || uid);
    }
  }
  // Sins: inteiro >= 0; texto que não é número volta ao valor atual (nunca zera por engano)
  function aplicaSins() {
    var k = kf();
    if (!k) return;
    var bruto = String(el.sins.value).replace(/[\s.]/g, '');
    var n = parseInt(bruto, 10);
    if (!isFinite(n)) { el.sins.value = k.inventario().sins || 0; return; }
    el.sins.value = k.definirSins(Math.max(0, n));
  }
  function abreReceita(li, teclado) {
    var nome = li && li.querySelector('.bz-slot-nome[data-ir]');
    if (!nome || !BZ.receita) return false;
    if (BZ.cartao) BZ.cartao.fechar();
    BZ.receita.abrir(nome.getAttribute('data-ir'), { via: 'inv', teclado: !!teclado, el: li });
    return true;
  }

  // ------------------------------------------------------------ estados: painel | trilho | amplo
  function estado(novo) {
    if (['painel', 'trilho', 'amplo'].indexOf(novo) < 0 || E.inv === novo) return;
    if (BZ.cartao) BZ.cartao.fechar();
    fechaCb();
    BZ.defineInv(novo);
    render();
  }
  function alternaTrilho() {
    if (E.inv === 'trilho') { estado('painel'); el.recolher.focus({ preventScroll: true }); }
    else { estado('trilho'); el.trilho.focus({ preventScroll: true }); }
  }

  // ------------------------------------------------------------ pisca / mostrar
  function piscar(uid) {
    if (!uid) return;
    piscaPend = uid;
    agendaRender();
  }
  function aplicaPisca() {
    var uid = piscaPend;
    piscaPend = '';
    var li = linhaDe(uid);
    if (!li) return;
    li.scrollIntoView({ block: 'nearest' });
    li.classList.remove('bz-pisca');
    void li.offsetWidth;
    li.classList.add('bz-pisca');
    setTimeout(function () { li.classList.remove('bz-pisca'); }, PISCA_MS);
  }
  function mostrar(id) {
    var inv = lerInv();
    if (!inv) { var k = kf(); if (k) k.abrir('inventario'); return; }
    var alvo = null;
    COLUNAS.forEach(function (c) {
      (inv[c] || []).forEach(function (e) { if (!alvo && e && !e.avulso && e.id === id) alvo = { c: c, e: e }; });
    });
    if (!alvo) return;
    if (E.inv === 'trilho') { BZ.defineInv('painel'); }
    if (E.colRecolhida[alvo.c]) { E.colRecolhida[alvo.c] = false; BZ.salvar(); }
    piscaPend = alvo.e.uid;
    render();
  }

  // ------------------------------------------------------------ combobox "Guardar item…"
  var cb = { alvo: '', q: { n: null, termo: '' }, ops: [], i: -1 };
  function placeholder() {
    el.cb.placeholder = cb.alvo ? 'Guardar em ' + ROTULO[cb.alvo] + '…' : 'Guardar item… (i)';
  }
  function pesoCurto(it) {
    var inv = it && it.inv;
    if (!inv) return '';
    if (inv.ocupa === false) return 'não ocupa';
    if (inv.empilhavel) return pilha() + ':1';
    return '1 cada';
  }
  function opcaoHTML(op, i) {
    var id = 'bz-cb-op-' + i;
    if (op.tipo === 'avulso') {
      var dest = cb.alvo || 'bugigangas';
      return '<li role="option" id="' + id + '" class="bz-cb-op is-avulso" data-i="' + i + '" aria-selected="false">' +
        'Guardar “' + esc(op.nome) + '” como item sem registro <span class="bz-cb-dest">→ ' + ROTULO[dest] + '</span></li>';
    }
    var it = op.it, d = cb.alvo || colunaCanonica(it), p = pesoCurto(it);
    return '<li role="option" id="' + id + '" class="bz-cb-op ' + U.classeRar(it.raridade) + '" data-i="' + i +
      '" data-prever="' + esc(it.id) + '" aria-selected="false">' +
      '<span class="bz-cb-med">' + U.arte(it, 'bz-cb-ico') + '</span>' +
      '<span class="bz-cb-nome">' + esc(it.nome) + '</span>' +
      '<span class="bz-cb-rar" title="' + esc(it.raridade) + '">' + U.icoRar(it.raridade) + '</span>' +
      '<span class="bz-cb-dest">→ ' + ROTULO[d] + (p ? ' · ' + p : '') + '</span></li>';
  }
  function atualizaCb() {
    cb.q = interpretaBusca(el.cb.value);
    if (semAcentoMin(cb.q.termo).length < 2) { fechaCb(); return; }
    var res = busca(D.ITENS, cb.q.termo, 8);
    cb.ops = res.length ? res.map(function (it) { return { tipo: 'item', it: it }; })
      : [{ tipo: 'avulso', nome: cb.q.termo }];
    cb.i = -1;
    el.cbLista.innerHTML = cb.ops.map(opcaoHTML).join('');
    el.cbLista.hidden = false;
    el.cb.setAttribute('aria-expanded', 'true');
    el.cb.removeAttribute('aria-activedescendant');
  }
  function fechaCb() {
    var aberto = !el.cbLista.hidden;
    el.cbLista.hidden = true;
    el.cb.setAttribute('aria-expanded', 'false');
    el.cb.removeAttribute('aria-activedescendant');
    cb.i = -1;
    return aberto;
  }
  function destaca(i) {
    if (!cb.ops.length) return;
    cb.i = Math.max(0, Math.min(cb.ops.length - 1, i));
    el.cbLista.querySelectorAll('[role="option"]').forEach(function (o, j) {
      o.setAttribute('aria-selected', String(j === cb.i));
      o.classList.toggle('ativa', j === cb.i);
    });
    var op = el.cbLista.querySelector('#bz-cb-op-' + cb.i);
    if (op) { el.cb.setAttribute('aria-activedescendant', op.id); op.scrollIntoView({ block: 'nearest' }); }
  }
  function escolhe(i, o) {
    var op = cb.ops[i];
    if (!op) return;
    var n = cb.q.n || (o.shift ? 10 : 1);
    var item = op.tipo === 'avulso' ? { avulso: true, nome: op.nome } : op.it;
    var col = cb.alvo || (op.tipo === 'avulso' ? 'bugigangas' : colunaCanonica(item));
    if (o.alt) col = OUTRA[col];
    if (BZ.cartao) BZ.cartao.fechar();
    guardar(item, col, n);
    el.cb.value = '';
    fechaCb();
    el.cb.focus({ preventScroll: true });
  }
  function focaCb(alvo) {
    if (E.inv === 'trilho') estado('painel');
    cb.alvo = alvo || '';
    placeholder();
    el.cb.focus();
    el.cb.select();
  }
  el.cb.addEventListener('input', atualizaCb);
  el.cb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (el.cbLista.hidden) { atualizaCb(); if (el.cbLista.hidden) return; }
      destaca(cb.i < 0 ? (e.key === 'ArrowDown' ? 0 : cb.ops.length - 1) : cb.i + (e.key === 'ArrowDown' ? 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (el.cbLista.hidden) atualizaCb();
      if (!el.cbLista.hidden) escolhe(cb.i >= 0 ? cb.i : 0, { shift: e.shiftKey, alt: e.altKey });
    } else if (e.key === 'Tab') {
      fechaCb();
    }
  });
  el.cbLista.addEventListener('pointerdown', function (e) { e.preventDefault(); });   // o foco fica no campo
  el.cbLista.addEventListener('click', function (e) {
    var o = e.target.closest('[role="option"]');
    if (o) escolhe(+o.getAttribute('data-i'), { shift: e.shiftKey, alt: e.altKey });
  });
  el.cbBox.addEventListener('focusout', function (e) {
    if (e.relatedTarget && el.cbBox.contains(e.relatedTarget)) return;
    fechaCb();
    if (!el.cb.value) { cb.alvo = ''; placeholder(); }
  });

  // ------------------------------------------------------------ cliques
  aside.addEventListener('click', function (e) {
    var t = e.target, b;
    var k = kf();
    if (t.closest('#bz-trilho')) { estado('painel'); el.recolher.focus({ preventScroll: true }); return; }
    if (t.closest('#bz-inv-amplo')) { estado(E.inv === 'amplo' ? 'painel' : 'amplo'); return; }
    if (t.closest('#bz-inv-recolher')) { alternaTrilho(); return; }
    if (t.closest('#bz-inv-ficha')) { if (k) k.abrir('inventario'); return; }
    if (t.closest('#bz-inv-for')) { if (k) k.abrir('atributos'); return; }
    if (t.closest('#bz-inv-exportar')) { if (k) k.exportar(); return; }
    if (t.closest('[data-toast-desfazer]')) { desfazer(false); return; }
    if ((b = t.closest('[data-faixa-acao]'))) {
      var a = b.getAttribute('data-faixa-acao');
      if (a === 'migracao-ok') { E.avisoMigracaoVisto = true; BZ.salvar(); render(); el.cb.focus({ preventScroll: true }); }
      else if (a === 'saco-levar') levarSaco();
      else if (a === 'saco-descartar') descartarSaco();
      else if (a === 'nr-ok') { naoReconhecidos = null; render(); }
      return;
    }
    if ((b = t.closest('[data-col-mais]'))) { focaCb(b.closest('section.bz-col').getAttribute('data-col')); return; }
    if ((b = t.closest('[data-col-recolher]'))) {
      var c = b.closest('section.bz-col').getAttribute('data-col');
      E.colRecolhida[c] = !E.colRecolhida[c];
      BZ.salvar();
      render();
      return;
    }
    var li = t.closest('li.bz-slot');
    if (!li) return;
    var uid = li.getAttribute('data-uid');
    setAtivo(li);
    if ((b = t.closest('[data-acao]'))) {
      var ac = b.getAttribute('data-acao');
      if (ac === 'x') remover(uid);
      else if (ac === 'menos') passo(uid, e.shiftKey ? -10 : -1);
      else if (ac === 'mais') passo(uid, e.shiftKey ? 10 : 1);
      else if (ac === 'corrigir') { var en = entrada(uid); if (en) mover(uid, colunaCanonica(en)); }
      else if (ac === 'trocar') trocarConflito();
      return;
    }
    if (t.closest('.bz-slot-nome')) abreReceita(li, e.detail === 0);
  });
  aside.addEventListener('change', function (e) {
    var t = e.target;
    if (t === el.sins) { aplicaSins(); return; }
    var ac = t.getAttribute && t.getAttribute('data-acao');
    var li = t.closest && t.closest('li.bz-slot');
    if (!ac || !li) return;
    var uid = li.getAttribute('data-uid');
    if (ac === 'qtd') {
      var n = parseInt(String(t.value).trim(), 10);
      if (!isFinite(n)) { t.value = t.defaultValue; return; }
      if (String(n) !== t.defaultValue) quantidade(uid, n);
      return;
    }
    if (ac === 'emp') alternar(uid, 'empilhavel');
    else if (ac === 'equip') alternar(uid, 'equipado');
    else if (ac === 'sint') alternar(uid, 'sintonizado');
  });

  // ------------------------------------------------------------ teclado (§4.9)
  function linhasDaColuna(li) {
    var sec = li.closest('section.bz-col');
    return sec ? Array.prototype.slice.call(sec.querySelectorAll('li.bz-slot')) : [li];
  }
  function vaiPara(li) {
    if (!li) return;
    setAtivo(li);
    li.focus();
    li.scrollIntoView({ block: 'nearest' });
  }
  aside.addEventListener('keydown', function (e) {
    var t = e.target;
    if (e.defaultPrevented || !t || !t.closest) return;
    if (t === el.sins) {
      if (e.key === 'Enter') { e.preventDefault(); aplicaSins(); }
      else if (e.key === 'Escape') { var k0 = kf(); if (k0) { e.preventDefault(); el.sins.value = k0.inventario().sins || 0; } }
      return;
    }
    var li = t.closest('li.bz-slot');
    if (!li) return;
    var uid = li.getAttribute('data-uid');
    // número da quantidade: Enter aplica, Esc volta à linha, ↑/↓ passo
    if (t.getAttribute('data-acao') === 'qtd') {
      if (e.key === 'Enter') {
        e.preventDefault();
        var n = parseInt(String(t.value).trim(), 10);
        if (!isFinite(n)) t.value = t.defaultValue;
        else if (String(n) !== t.defaultValue) { focoPend = { uid: uid, acao: 'qtd' }; quantidade(uid, n); }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        t.value = t.defaultValue;
        li.focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        focoPend = { uid: uid, acao: 'qtd' };
        passo(uid, (e.key === 'ArrowUp' ? 1 : -1) * (e.shiftKey ? 10 : 1));
      }
      return;
    }
    if (t !== li || e.ctrlKey || e.metaKey || e.altKey) return;
    var todas, i, col = li.closest('section.bz-col').getAttribute('data-col');
    var tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    // Shift só multiplica no + e − (no teclado principal o + já vem com Shift)
    var dez = e.shiftKey && (e.code === 'NumpadAdd' || e.code === 'NumpadSubtract' || e.key === '_');
    switch (tecla) {
      case 'ArrowDown': case 'ArrowUp':
        todas = linhasDaColuna(li); i = todas.indexOf(li);
        vaiPara(todas[i + (tecla === 'ArrowDown' ? 1 : -1)]);
        break;
      case 'Home': todas = linhasDaColuna(li); vaiPara(todas[0]); break;
      case 'End': todas = linhasDaColuna(li); vaiPara(todas[todas.length - 1]); break;
      case 'Enter': if (!abreReceita(li, true)) BZ.anunciar('Item sem registro: não há receita'); break;
      case '+': case '=': focoPend = { uid: uid, acao: '' }; passo(uid, dez ? 10 : 1); break;
      case '-': case '_': focoPend = { uid: uid, acao: '' }; passo(uid, dez ? -10 : -1); break;
      case 'q': var q = li.querySelector('[data-acao="qtd"]'); if (q) { q.focus(); q.select(); } break;
      case 'Delete': remover(uid); break;
      case 'e':
        if (col === 'equipamentos') alternar(uid, 'equipado');
        else BZ.anunciar('Equipado só vale na coluna Equipamentos');
        break;
      case 't':
        if (li.querySelector('[data-acao="sint"]')) alternar(uid, 'sintonizado');
        else BZ.anunciar('Só Item Mágico se sintoniza');
        break;
      case 's': alternar(uid, 'empilhavel'); break;
      case 'm': mover(uid, OUTRA[col]); break;
      default: return;
    }
    e.preventDefault();
  });
  aside.addEventListener('focusin', function (e) {
    var t = e.target;
    if (!t || !t.matches || !t.matches('li.bz-slot')) return;
    setAtivo(t);
    var vis = false;
    try { vis = t.matches(':focus-visible'); } catch (x) { vis = true; }
    var nome = t.querySelector('.bz-slot-nome[data-prever]');
    if (vis && nome && BZ.cartao) BZ.cartao.agendar(nome, { modo: 'teclado', desc: t, foco: t });
  });

  // Ctrl+Z desfaz (foco fora de campo de texto)
  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || !(e.ctrlKey || e.metaKey) || e.shiftKey || e.altKey) return;
    if ((e.key || '').toLowerCase() !== 'z' || U.emCampo(e.target)) return;
    if (e.target && e.target.closest && e.target.closest('#kf-drawer')) return;
    e.preventDefault();
    desfazer(true);
  });

  // Esc em camadas: pop-up (10) > combobox (20) > painel de receita (30)
  BZ.camadaEsc(20, function () {
    if (fechaCb()) return true;
    if (document.activeElement === el.cb && (el.cb.value || cb.alvo)) {
      el.cb.value = '';
      cb.alvo = '';
      placeholder();
      return true;
    }
    return false;
  });
  BZ.atalho('i', function () { if (!kf()) return false; focaCb(''); });
  BZ.atalho('I', function () { alternaTrilho(); });

  // ------------------------------------------------------------ arrastar e soltar
  var arrasto = { uid: '', col: '' };
  var molaT = null;
  function tipoArrasto(dt) {
    var ts = dt && dt.types ? Array.prototype.slice.call(dt.types) : [];
    if (ts.indexOf('application/x-kf-uid') >= 0) return 'uid';
    if (ts.indexOf('text/plain') >= 0) return 'item';
    return '';
  }
  function limpaAlvos() {
    COLUNAS.forEach(function (c) {
      el.cols[c].sec.classList.remove('bz-alvo');
      el.cols[c].solte.textContent = '';
    });
    el.cab.classList.remove('bz-alvo');
    el.trilho.classList.remove('bz-alvo');
  }
  function paraMola() { clearTimeout(molaT); molaT = null; }
  aside.addEventListener('dragstart', function (e) {
    var li = e.target && e.target.closest && e.target.closest('li.bz-slot');
    if (!li || !e.dataTransfer) return;
    var sec = li.closest('section.bz-col');
    arrasto.uid = li.getAttribute('data-uid');
    arrasto.col = sec ? sec.getAttribute('data-col') : '';
    e.dataTransfer.setData('application/x-kf-uid', arrasto.uid);
    e.dataTransfer.effectAllowed = 'move';
    li.classList.add('is-arrastando');
  });
  aside.addEventListener('dragover', function (e) {
    var tipo = tipoArrasto(e.dataTransfer);
    if (!tipo) return;
    var noTrilho = !!e.target.closest('#bz-trilho');
    var sec = e.target.closest('section.bz-col');
    var col = sec ? sec.getAttribute('data-col') : '';
    if (noTrilho && !molaT) {
      molaT = setTimeout(function () { molaT = null; if (E.inv === 'trilho') estado('painel'); }, MOLA_MS);
    } else if (!noTrilho) paraMola();
    if (tipo === 'uid' && (!col || col === arrasto.col)) { limpaAlvos(); return; }
    e.preventDefault();
    e.dataTransfer.dropEffect = tipo === 'uid' ? 'move' : 'copy';
    limpaAlvos();
    if (col) {
      el.cols[col].sec.classList.add('bz-alvo');
      el.cols[col].solte.textContent = (tipo === 'uid' ? 'Solte para mover para ' : 'Solte para guardar em ') + ROTULO[col];
    } else if (noTrilho) el.trilho.classList.add('bz-alvo');
    else el.cab.classList.add('bz-alvo');
  });
  aside.addEventListener('dragleave', function (e) {
    if (e.relatedTarget && aside.contains(e.relatedTarget)) return;
    limpaAlvos();
    paraMola();
  });
  aside.addEventListener('drop', function (e) {
    var tipo = tipoArrasto(e.dataTransfer);
    limpaAlvos();
    paraMola();
    if (!tipo) return;
    var sec = e.target.closest('section.bz-col');
    var col = sec ? sec.getAttribute('data-col') : '';
    if (tipo === 'uid') {
      var uid = e.dataTransfer.getData('application/x-kf-uid');
      if (!uid || !col) return;
      e.preventDefault();
      mover(uid, col);
      return;
    }
    var p;
    try { p = JSON.parse(e.dataTransfer.getData('text/plain')); } catch (x) { return; }
    if (!p || !p._bazar || !p.item) return;
    e.preventDefault();
    var it = (p.item.id && D.porId[p.item.id]) || D.porNome[p.item.nome] || p.item;
    guardar(it, col || null, 1);   // a coluna em que se solta VALE; cabeçalho e trilho: a canônica
  });
  var origemArrasto = null;
  // origem do arrasto vinda do registro ou do painel: opacidade .45 (§10).
  // Num rAF, para a imagem do arrasto sair com a opacidade cheia.
  document.addEventListener('dragstart', function (e) {
    var t = e.target && e.target.closest ? e.target : null;
    var o = t && (t.closest('#bz-registro .item-card') || t.closest('#bz-receita [data-ir]'));
    if (!o) return;
    origemArrasto = o;
    U.raf(function () { if (origemArrasto === o) o.classList.add('bz-arrastando'); });
  });
  document.addEventListener('dragend', function () {
    origemArrasto = null;
    limpaAlvos();
    paraMola();
    arrasto.uid = ''; arrasto.col = '';
    aside.querySelectorAll('li.is-arrastando').forEach(function (li) { li.classList.remove('is-arrastando'); });
    document.querySelectorAll('.bz-arrastando').forEach(function (x) { x.classList.remove('bz-arrastando'); });
  }, true);

  // ------------------------------------------------------------ nome digitado no drawer
  var nomeT = null;
  document.addEventListener('input', function (e) {
    if (!e.target || !e.target.closest || !e.target.closest('#kf-drawer')) return;
    clearTimeout(nomeT);
    nomeT = setTimeout(function () {
      var k = kf();
      if (k && typeof k.nome === 'function') el.dono.textContent = k.nome() ? 'de ' + k.nome() : 'personagem sem nome';
    }, 300);
  });

  // ------------------------------------------------------------ início
  BZ.aoMudar.push(function (m) {
    conflito = null;
    (m && m.eventos || []).forEach(function (d) { if (d && d.op === 'adicionar' && d.uid) piscaPend = d.uid; });
    render();
  });
  BZ.inventario = {
    mostrar: mostrar,
    piscar: piscar,
    render: render,
    estado: estado
  };
  placeholder();
  if (kf()) render();
  else {
    renderSemKF();
    document.addEventListener('kf:pronta', function () { render(); }, { once: true });
  }
  BZ.quandoIniciar(function () { render(); });
})(typeof window !== 'undefined' ? window.BZ : null);
