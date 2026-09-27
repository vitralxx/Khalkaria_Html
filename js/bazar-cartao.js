/* ============================================================
   O BAZAR — pop-up do card (#bz-preview, .bz-cartao)
   Spec §3. Um nó só, reaproveitado. NUNCA .item-card nem data-n: o
   MutationObserver da ficha.js penduraria "+ ficha" e draggable nele.

   Gatilho: qualquer [data-prever="<id do catálogo>"] ou [data-prever="e:<uid>"]
   (entrada do inventário, inclusive avulsa). Superfícies: ingredientes,
   degraus, mini-ingredientes, usos e migalhas do painel de receita; td.c-nome
   da Lista; linhas do inventário; opções do combobox (aria-activedescendant).
   [data-pede="n"] no gatilho acrescenta "Receita pede n · você tem x".

   O motor (atrasos, modo quente, foco, combobox, posição e seta) é o
   KhPrever do js/kh-ui.js; aqui ficam o conteúdo (resolvedores 'item' e 'e'),
   as regras de lado da mesa e o rodapé que acompanha o inventário.

   Registra:
     BZ.cartao = { abrir(el, opts), agendar(el, opts), fechar(), aberto(),
                   gatilho(), cartaoHTML(id) }
     BZ.camadaEsc(10, …)   o Esc fecha o pop-up antes do combobox e do painel
   ============================================================ */
(function (BZ) {
  'use strict';
  if (!BZ) return;

  var U = BZ.util, D = BZ.dados;
  var esc = U.esc;
  var no = U.$('#bz-preview');
  if (!no) return;

  var ROTULO = { bugigangas: 'Bugigangas', equipamentos: 'Equipamentos' };
  var COLUNAS = ['bugigangas', 'equipamentos'];

  var cache = new Map();     // id -> HTML estático (cabeçalho, efeito, valor, peso)

  // ------------------------------------------------------------ dados
  function acharEntrada(uid) {
    var k = U.kf();
    if (!k || !uid) return null;
    var inv;
    try { inv = k.inventario(); } catch (e) { return null; }
    for (var c = 0; c < COLUNAS.length; c++) {
      var l = inv[COLUNAS[c]] || [];
      for (var i = 0; i < l.length; i++) {
        if (l[i] && l[i].uid === uid) return { entrada: l[i], coluna: COLUNAS[c] };
      }
    }
    return null;
  }
  // chave do data-prever -> { it } (catálogo) ou { entrada, coluna } (avulso/órfão)
  function resolve(chave) {
    if (!chave) return null;
    if (chave.indexOf('e:') === 0) {
      var a = acharEntrada(chave.slice(2));
      if (!a) return null;
      var e = a.entrada;
      if (!e.avulso && e.id && D.porId[e.id]) return { it: D.porId[e.id], entrada: e, coluna: a.coluna };
      return { entrada: e, coluna: a.coluna };
    }
    var it = D.porId[chave];
    return it ? { it: it } : null;
  }

  // ------------------------------------------------------------ conteúdo
  function metaTexto(it) {
    var p = [];
    if (it.valor) p.push('Valor ' + it.valor + ' Sins');      // fórmula como está, nunca convertida
    if (it.cr) p.push('CR ' + it.cr);
    if (it.cd != null && it.craft && it.craft !== 'Não-craftável') p.push(it.craft + ' CD ' + it.cd);
    return p.join(' · ');
  }
  function medalhao(it) {
    if (it.arte) return U.arte(it, 'bz-ct-ico');
    return '<span class="bz-ct-med">' + U.svg(U.icoCat(it)) + '</span>';
  }
  // parte estática, em cache por id
  function cartaoHTML(id) {
    if (cache.has(id)) return cache.get(id);
    var it = D.porId[id];
    if (!it) return '';
    var meta = metaTexto(it);
    var h = '<header class="bz-ct-cab">' + medalhao(it) +
        '<div class="bz-ct-titulo">' +
          '<p class="bz-ct-nome">' + esc(it.nome) + '</p>' +
          '<div class="item-chips">' +
            '<span class="tag-rar">' + U.icoRar(it.raridade) + esc(it.raridade) + '</span>' +
            '<span class="tag-cat">' + U.svg(U.icoCat(it)) + esc(it.categoria) + '</span>' +
            (it.arquetipo ? '<span class="tag-arq">' + esc(it.arquetipo) + '</span>' : '') +
          '</div>' +
        '</div>' +
      '</header>' +
      '<p class="bz-ct-efeito">' + esc(it.efeito) + '</p>' +
      (meta ? '<p class="bz-ct-meta">' + esc(meta) + '</p>' : '') +
      '<p class="bz-ct-peso">' + esc(U.pesoTexto(it)) + '</p>';
    cache.set(id, h);
    return h;
  }
  function avulsoHTML(e, coluna) {
    return '<header class="bz-ct-cab">' +
        '<span class="bz-ct-med avulso">' + U.svg('ico-bugiganga') + '</span>' +
        '<div class="bz-ct-titulo">' +
          '<p class="bz-ct-nome">' + esc(e.nome || '—') + '</p>' +
          '<p class="bz-ct-sem">item sem registro</p>' +
        '</div>' +
      '</header>' +
      '<p class="bz-ct-peso">' + esc(ROTULO[coluna] || '') + '</p>';
  }
  // rodapé dinâmico: recalculado a cada abertura e a cada mudança da ficha
  function rodapeHTML(it, alvo) {
    var k = U.kf();
    if (!k || !it) return '';
    var total = 0, cols = [];
    try {
      total = +k.tenho(it.id) || 0;
      var inv = k.inventario();
      COLUNAS.forEach(function (c) {
        (inv[c] || []).forEach(function (e) {
          if (e && !e.avulso && e.id === it.id && cols.indexOf(c) < 0) cols.push(c);
        });
      });
    } catch (err) { return ''; }
    var h = '<p class="bz-ct-tem">No inventário: <b>' + total + '</b>' +
      (cols.length ? ' (' + cols.map(function (c) { return ROTULO[c]; }).join(' + ') + ')' : '') + '</p>';
    var pede = alvo ? parseInt(alvo.getAttribute('data-pede'), 10) : NaN;
    if (pede > 0) {
      var cls = total >= pede ? 'ok' : total > 0 ? 'parcial' : 'zero';
      h += '<p class="bz-ct-pede ' + cls + '">Receita pede <b>' + pede + '</b> · você tem <b class="bz-ct-x">' + total + '</b></p>';
    }
    return h;
  }
  function atualizaRodape() {
    var alvo = P.gatilho();
    if (!P.aberto() || !alvo) return;
    var r = resolve(P.chave());
    if (!r) return P.fechar(true);
    if (!r.it) return;
    var pe = rodapeHTML(r.it, alvo);
    var f = no.querySelector('.bz-ct-pe');
    if (f && pe) f.innerHTML = pe;
    else if (f) f.remove();
    else if (pe) no.insertAdjacentHTML('beforeend', '<footer class="bz-ct-pe">' + pe + '</footer>');
  }

  // ------------------------------------------------------------ motor (js/kh-ui.js)
  // Atrasos, modo quente, aria-describedby, posição e seta: KhPrever. Aqui só
  // o conteúdo (resolvedores 'item' e 'e') e as regras de lado da mesa.
  var P = window.KhPrever;
  if (!P) return;
  function resolvedor(chave, alvo) {
    var r = resolve(chave);
    if (!r) return null;
    if (r.it) {
      var pe = rodapeHTML(r.it, alvo);
      return {
        classe: 'bz-cartao ' + U.classeRar(r.it.raridade),
        html: '<div class="bz-ct-corpo">' + cartaoHTML(r.it.id) + '</div>' +
          (pe ? '<footer class="bz-ct-pe">' + pe + '</footer>' : '')
      };
    }
    return {
      classe: 'bz-cartao rar-ordinario bz-ct-avulso',
      html: '<div class="bz-ct-corpo">' + avulsoHTML(r.entrada, r.coluna) + '</div>'
    };
  }
  // data-prever com o id puro = item do catálogo; "e:<uid>" = entrada do inventário
  P.resolvedor('item', function (id, alvo) { return resolvedor(id, alvo); });
  P.resolvedor('e', function (id, alvo, chave) { return resolvedor(chave, alvo); });
  P.montar(no, {
    tipoPadrao: 'item',
    largura: 340,
    // painel de receita à esquerda: o pop-up sai à direita dele; inventário à
    // direita: sai à esquerda dele
    xPreferido: function (alvo, W, VAO) {
      var rc = alvo.closest('#bz-receita'), inv = alvo.closest('#bz-inventario');
      if (rc) return rc.getBoundingClientRect().right + VAO;
      if (inv) return inv.getBoundingClientRect().left - VAO - W;
      return null;
    },
    // na Lista o foco fica na linha (tr): o gatilho é a célula Nome dela
    gatilhoFoco: function (t) {
      return t.matches && t.matches('#bz-resultados tr.item-card') ? t.querySelector('td.c-nome[data-prever]') : null;
    },
    aoPosicionar: function (n) {
      var corpo = n.querySelector('.bz-ct-corpo');
      if (corpo) corpo.classList.toggle('corta', corpo.scrollHeight > corpo.clientHeight + 1);
    }
  });

  // Esc em camadas: o pop-up primeiro (10), depois o combobox (20) e o painel (30)
  BZ.camadaEsc(10, function () {
    if (P.aberto()) { P.fechar(true); return true; }
    if (P.esperando()) P.cancelarEspera();   // espera pendente não consome o Esc
    return false;
  });

  // re-render tirou o gatilho do DOM, ou o inventário mudou: fecha ou refaz o rodapé
  function confere() {
    if (!P.aberto()) return;
    var alvo = P.gatilho();
    if (!alvo || !document.contains(alvo)) { P.fechar(true); return; }
    atualizaRodape();
  }
  BZ.aoRender.push(confere);
  BZ.aoMudar.push(confere);

  BZ.cartao = {
    // abre já (opts: {modo:'mouse'|'teclado'|'ad', desc, foco})
    abrir: P.abrir,
    // abre com a espera do modo (opts.atraso sobrepõe), respeitando o modo quente
    agendar: P.agendar,
    fechar: function () { return P.fechar(true); },
    aberto: P.aberto,
    gatilho: P.gatilho,
    cartaoHTML: cartaoHTML
  };
})(window.BZ);
