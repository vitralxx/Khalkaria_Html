/* ============================================================
   O BAZAR — painel de receita (aside#bz-receita)
   Spec §2. Não modal: catálogo e inventário continuam usáveis.
   Abre por clique/Enter num card ou linha da Lista, por [data-ir] dentro do
   painel, pelo nome de uma linha do inventário (BZ.receita.abrir) e pelo
   #item/<id> da URL. Cada abertura faz history.replaceState — nunca pushState.
   Esc em camadas (pop-up > combobox > painel) via BZ.camadaEsc.
   ============================================================ */
(function (BZ) {
  'use strict';

  // ============================================================ parte pura (testada no node)
  // Para onde o foco volta quando o painel fecha. A ordem importa:
  //   1. o próprio nó de origem, se ainda está no documento e é focável;
  //   2. a linha do inventário de mesmo uid (o kf:mudou troca as <li> por innerHTML,
  //      então o nó guardado some mesmo quando a linha continua lá);
  //   3. o card do catálogo de mesmo id;
  //   4. as reservas, na ordem dada (busca, combobox do inventário, botões da mesa).
  // Só vale candidato focável: .bz-registro fica display:none no estado "amplo",
  // e as colunas do inventário somem no "trilho".
  // `q` injeta o DOM: { vivo(el), linhaInv(uid), card(id), reservas[], focavel(el) }.
  function alvoRetorno(origem, q) {
    origem = origem || {};
    var cands = [];
    if (origem.el && q.vivo(origem.el)) cands.push(origem.el);
    if (origem.uid) cands.push(q.linhaInv(origem.uid));
    if (origem.id) cands.push(q.card(origem.id));
    cands = cands.concat(q.reservas || []);
    for (var i = 0; i < cands.length; i++) {
      if (cands[i] && q.focavel(cands[i])) return cands[i];
    }
    return null;
  }
  var P = { alvoRetorno: alvoRetorno };
  if (typeof module === 'object' && module && module.exports) { module.exports = P; return; }
  if (!BZ) return;

  var U = BZ.util, D = BZ.dados;
  var esc = U.esc, arte = U.arte, $ = U.$;
  var HIST_MAX = 30, MIGALHAS = 6, QTD_MAX = 9999;
  var ROTULO = { bugigangas: 'Bugigangas', equipamentos: 'Equipamentos' };
  var OUTRA = { bugigangas: 'equipamentos', equipamentos: 'bugigangas' };
  var ALCANCE = { ok: 'confortável', dificil: 'no limite', fora: 'fora' };

  var painel = $('#bz-receita'), corpo = $('#bz-rc-corpo');
  if (!painel || !corpo) return;

  var hist = { pilha: [], i: -1 };
  var aberto = false, atual = '';
  var origem = { id: '', el: null, uid: '' };
  var qtd = 1, fechaT = null;

  // ------------------------------------------------------------ utilidades
  function kf() { return U.kf(); }
  function colunaCanonica(it) {
    if (window.KhInv && typeof window.KhInv.colunaCanonica === 'function') return window.KhInv.colunaCanonica(it);
    return it && it.inv && it.inv.slot === 'equipamento' ? 'equipamentos' : 'bugigangas';
  }
  function clampQtd(n) {
    n = Math.floor(Number(n));
    if (!(n >= 1)) n = 1;
    return Math.min(n, QTD_MAX);
  }
  function chipsHTML(it) {
    return '<span class="tag-rar">' + U.icoRar(it.raridade) + esc(it.raridade) + '</span>' +
      '<span class="tag-cat">' + esc(it.categoria) + '</span>' +
      (it.arquetipo ? '<span class="tag-arq">' + esc(it.arquetipo) + '</span>' : '') +
      (it.tags || []).map(function (t) { return '<span class="tag-cat">' + esc(t) + '</span>'; }).join('');
  }
  function oficioTexto(it) { return (U.PERICIA && U.PERICIA[it.craft]) || it.craft || ''; }
  function temReceita(it) { return !!(it.ing && it.ing.length); }

  // ------------------------------------------------------------ blocos do conteúdo
  function cabecalhoHTML(it) {
    return '<header class="bz-rc-cab">' +
      '<span class="bz-rc-medalhao">' + arte(it, 'bz-rc-ico') + '</span>' +
      '<div class="bz-rc-titulo">' +
        '<h2 id="bz-rc-nome" class="bz-rc-nome" tabindex="-1">' + esc(it.nome) + '</h2>' +
        '<div class="item-chips">' + chipsHTML(it) + '</div>' +
        '<div class="bz-rc-selo" id="bz-rc-selo"></div>' +
      '</div></header>';
  }

  function guardarHTML(it) {
    if (!kf()) {
      return '<p class="bz-rc-aviso">' + U.svg('ico-aviso', 'bz-ico-aviso') +
        'Recarregue a página (Ctrl+F5) para atualizar a ficha.</p>';
    }
    var c = colunaCanonica(it), o = OUTRA[c];
    return '<div class="bz-rc-guardar" id="bz-rc-guardar">' +
      '<div class="bz-rc-guardar-linha">' +
        '<span class="bz-stepper">' +
          '<button type="button" data-passo="-1" aria-label="Menos um (Shift: menos dez)" title="Menos um (Shift: −10)">−</button>' +
          '<input type="text" inputmode="numeric" id="bz-rc-qtd" value="' + qtd + '" aria-label="Quantidade a guardar" autocomplete="off">' +
          '<button type="button" data-passo="1" aria-label="Mais um (Shift: mais dez)" title="Mais um (Shift: +10)">+</button>' +
        '</span>' +
        '<span class="bz-rc-guardar-grupo">' +
          '<button type="button" class="bz-rc-guardar-btn" data-guardar="' + c + '">Guardar em ' + ROTULO[c] + '</button>' +
          '<button type="button" class="bz-rc-outra" id="bz-rc-outra" aria-haspopup="menu" aria-expanded="false" aria-controls="bz-rc-menu" aria-label="Guardar em outra coluna">▾</button>' +
          '<span class="bz-rc-menu" id="bz-rc-menu" role="menu" hidden>' +
            '<button type="button" role="menuitem" data-guardar="' + o + '">Guardar em ' + ROTULO[o] +
              '<small class="bz-rc-proj-menu" id="bz-rc-proj-outra"></small></button>' +
          '</span>' +
        '</span>' +
      '</div>' +
      '<p class="bz-rc-proj" id="bz-rc-proj" aria-live="off"></p>' +
    '</div>';
  }

  function receitaHTML(it) {
    var h = '<section class="bz-rc-sec bz-rc-receita" aria-labelledby="bz-rc-h-receita">';
    if (!temReceita(it)) {
      var nc = !it.craft || it.craft === 'Não-craftável';
      return h + '<h3 class="bz-rc-h" id="bz-rc-h-receita">Receita</h3>' +
        '<p class="bz-rc-nc"><b>' + (nc ? 'Não-craftável' : 'Sem receita registrada') + '</b></p>' +
        '<p class="bz-rc-obtencao"><span class="bz-rc-rot">Obtenção</span> ' + esc(it.obtencao || '—') + '</p>' +
        '</section>';
    }
    var tit = 'Receita' + (oficioTexto(it) ? ' · ' + esc(oficioTexto(it)) : '') + (it.cd != null ? ' · CD ' + it.cd : '');
    h += '<h3 class="bz-rc-h" id="bz-rc-h-receita"><span>' + tit + '</span><span class="bz-rc-alcance" id="bz-rc-alcance"></span></h3>' +
      '<div class="bz-rc-arvore" id="bz-rc-arvore">' +
        '<svg class="bz-rc-raizes" id="bz-rc-raizes" aria-hidden="true"></svg>' +
        '<ul class="bz-rc-ings">' + it.ing.map(function (g, i) {
          var m = D.porNome[g.item];
          var onde = U.ondeAchar(g.item);
          // data-pede: o pop-up (bazar-cartao.js) mostra "Receita pede n · você tem x"
          var alvo = m ? ' data-ir="' + esc(m.id) + '" data-prever="' + esc(m.id) + '" data-pede="' + g.n + '" draggable="true"' : '';
          return '<li class="bz-rc-ing ' + (m ? U.classeRar(m.raridade) : '') + '" data-i="' + i + '"' + alvo + '>' +
            '<span class="bz-rc-ing-l1">' +
              (m ? arte(m, 'bz-rc-ing-ico') : '<span class="bz-rc-ing-ico"></span>') +
              '<b class="bz-rc-n">' + g.n + '×</b>' +
              (m ? '<button type="button" class="bz-rc-ing-nome">' + esc(g.item) + '</button>'
                 : '<span class="bz-rc-ing-nome">' + esc(g.item) + '</span>') +
              '<span class="bz-rc-tem" data-i="' + i + '"></span>' +
              (m && kf() ? '<button type="button" class="bz-rc-mais" data-guardar-ing="' + esc(m.id) +
                '" aria-label="Guardar 1 ' + esc(g.item) + ' (Shift: 10)" title="Guardar 1 (Shift: 10)">+</button>' : '') +
            '</span>' +
            (onde ? '<span class="bz-rc-ing-onde">' + esc(onde) + '</span>' : '') +
          '</li>';
        }).join('') + '</ul>' +
        '<div class="bz-rc-produto" id="bz-rc-produto">' +
          '<span class="bz-rc-produto-no">' + arte(it, 'bz-rc-produto-ico') + '</span>' +
          '<p class="bz-rc-resumo" id="bz-rc-resumo"></p>' +
        '</div>' +
      '</div></section>';
    return h;
  }

  function degrauHTML(p, atualP, ramo, i) {
    // trilho de raiz: um #raiz-elo por degrau, espelhado nos ímpares (determinístico)
    return '<li class="bz-passo ' + U.classeRar(p.raridade) + (atualP ? ' atual' : '') + (ramo ? ' ramo' : '') +
      (i % 2 ? ' impar' : '') + '" style="--i:' + i + '">' +
      '<span class="bz-passo-trilho"><svg class="bz-passo-elo" aria-hidden="true" focusable="false"><use href="#raiz-elo"/></svg>' +
        '<span class="bz-passo-no"></span></span>' +
      '<div class="bz-passo-corpo">' +
        '<div class="bz-passo-l1">' + arte(p, 'bz-passo-ico') +
          '<button type="button" class="bz-passo-nome" data-ir="' + esc(p.id) + '" data-prever="' + esc(p.id) + '" draggable="true"' +
            (atualP ? ' aria-current="true"' : '') + '>' + esc(p.nome) + '</button>' +
          '<span class="tag-rar">' + esc(p.raridade) + '</span>' +
        '</div>' +
        '<div class="bz-passo-linha">' +
          (p.cd != null ? '<span class="bz-passo-cd">' + esc(p.craft) + ' CD ' + p.cd + '</span>' : '') +
          (p.ing || []).map(function (g) {
            var m = D.porNome[g.item];
            if (!m) return '<span class="bz-mini">' + g.n + '× ' + esc(g.item) + '</span>';
            return '<button type="button" class="bz-mini ' + U.classeRar(m.raridade) + '" data-ir="' + esc(m.id) +
              '" data-prever="' + esc(m.id) + '" data-pede="' + g.n + '" draggable="true" title="' + esc(g.n + '× ' + g.item) +
              '" aria-label="' + esc(g.n + '× ' + g.item) + '">' + arte(m, 'bz-mini-ico') + '<b>' + g.n + '×</b></button>';
          }).join('') +
        '</div>' +
      '</div></li>';
  }
  function cadeiaHTML(it) {
    var c = U.cadeia(it);
    var frente = (D.filhos[it.nome] || []).map(function (n) { return D.porNome[n]; })
      .filter(function (f) { return f && c.indexOf(f) < 0; });
    if (c.length + frente.length < 2) return '';
    var n = 0;
    return '<section class="bz-rc-sec"><h3 class="bz-rc-h">Cadeia de fabricação</h3><ol class="bz-cadeia">' +
      c.map(function (p) { return degrauHTML(p, p === it, false, n++); }).join('') +
      frente.map(function (f) { return degrauHTML(f, false, true, n++); }).join('') +
      '</ol></section>';
  }

  function usosHTML(it) {
    var us = (D.usadoEm[it.nome] || []).map(function (n) { return D.porNome[n]; }).filter(Boolean);
    if (!us.length) return '';
    var grupos = {};
    us.forEach(function (u) {
      var g = (u.cats && u.cats[0]) || u.categoria || 'Outros';
      (grupos[g] = grupos[g] || []).push(u);
    });
    var nomes = Object.keys(grupos).sort(function (a, b) {
      return grupos[b].length - grupos[a].length || a.localeCompare(b, 'pt');
    });
    var h = '<section class="bz-rc-sec bz-rc-usos"><h3 class="bz-rc-h">Entra em ' + us.length +
      ' receita' + (us.length > 1 ? 's' : '') + '</h3>' +
      '<p class="bz-rc-usos-resumo">' + nomes.map(function (g) { return esc(g) + ' ' + grupos[g].length; }).join(' · ') + '</p>';
    if (us.length > 12) {
      h += '<input type="search" class="bz-rc-filtro" id="bz-rc-filtro" placeholder="filtrar usos…" aria-label="Filtrar usos" autocomplete="off" spellcheck="false">';
    }
    h += nomes.map(function (g) {
      var l = grupos[g].slice().sort(function (a, b) { return a.nome.localeCompare(b.nome, 'pt'); });
      return '<details class="bz-rc-grupo" data-total="' + l.length + '"' + (l.length > 8 ? '' : ' open') + '>' +
        '<summary><span>' + esc(g) + '</span> <span class="bz-rc-grupo-n">' + l.length + '</span></summary>' +
        '<ul class="bz-rc-usos-lista">' + l.map(function (u) {
          return '<li data-busca="' + esc(U.semAcento(u.nome).toLowerCase()) + '">' +
            '<button type="button" class="bz-rc-uso ' + U.classeRar(u.raridade) + '" data-ir="' + esc(u.id) +
              '" data-prever="' + esc(u.id) + '" draggable="true">' + arte(u, 'bz-rc-uso-ico') +
              '<span class="bz-rc-uso-nome">' + esc(u.nome) + '</span>' +
              (u.cd != null ? '<span class="bz-rc-uso-cd">CD ' + u.cd + '</span>' : '') +
            '</button></li>';
        }).join('') + '</ul></details>';
    }).join('');
    return h + '</section>';
  }

  function fichaHTML(it) {
    var reg = it.regiao || (it.unico ? 'Único/Quest' : '—');
    function campo(dt, dd, mono) {
      return '<div class="bz-rc-campo"><dt>' + dt + '</dt><dd' + (mono ? ' class="mono"' : '') + '>' + dd + '</dd></div>';
    }
    return '<section class="bz-rc-sec"><h3 class="bz-rc-h">Ficha técnica</h3><dl class="bz-rc-ficha">' +
      // Valor é fórmula de dados: exibida como está, nunca convertida
      campo('Valor', '<span class="bz-mono">' + esc(it.valor || '—') + '</span> Sins') +
      campo('Região', esc(reg)) +
      campo('Obtenção', esc(it.obtencao || '—')) +
      campo('CR', esc(it.cr || '—'), true) +
      campo('Ofício', esc(it.craft || '—')) +
      campo('CD', it.cd != null ? String(it.cd) : '—', true) +
      campo('Peso', esc(U.pesoTexto(it))) +
      '</dl></section>';
  }

  function conteudoHTML(it) {
    return cabecalhoHTML(it) +
      guardarHTML(it) +
      receitaHTML(it) +
      '<p class="bz-rc-efeito">' + esc(it.efeito) + '</p>' +
      cadeiaHTML(it) +
      usosHTML(it) +
      fichaHTML(it) +
      (it.lore ? '<p class="bz-rc-lore">' + esc(it.lore) + '</p>' : '');
  }

  // ------------------------------------------------------------ partes dinâmicas
  // Recalculadas a cada kf:mudou sem redesenhar o painel nem as raízes.
  function seloHTML(it) {
    var k = kf();
    if (!k) return '';
    var inv;
    try { inv = k.inventario(); } catch (e) { return ''; }
    var total = 0, eq = 0, cols = [];
    ['bugigangas', 'equipamentos'].forEach(function (c) {
      (inv[c] || []).forEach(function (e) {
        if (!e || e.avulso || e.id !== it.id) return;
        var n = +e.qtd || 0;
        total += n;
        if (e.equipado) eq += n;
        if (cols.indexOf(c) < 0) cols.push(c);
      });
    });
    if (!total) return '';
    return '<button type="button" class="bz-rc-selo-btn" id="bz-rc-selo-btn" title="Mostrar no inventário">' +
      'No inventário: <b>' + total + '</b>' + (eq ? ' (' + eq + ' equipado' + (eq > 1 ? 's' : '') + ')' : '') +
      ' · ' + cols.map(function (c) { return ROTULO[c]; }).join(' + ') + '</button>';
  }
  function projecaoTexto(it, coluna) {
    var k = kf();
    if (!k) return null;
    var p;
    try { p = k.projetar(it, { qtd: qtd, coluna: coluna }); } catch (e) { return null; }
    if (!p || !p.antes || !p.depois) return null;
    var a = p.antes, d = p.depois;
    var txt = ROTULO[p.coluna] + ' ' + a.usado + ' → ' + d.usado + ' / ' + d.max;
    var cls = d.estado === 'extremo' ? 'extremo' : d.estado === 'leve' ? 'leve' : '';
    if (d.estado === 'extremo' && a.estado !== 'extremo') txt += ' · vira Sobrepeso Extremo';
    else if (d.estado === 'leve' && a.estado === 'ok') txt += ' · vira Sobrepeso Leve';
    else if (d.estado === 'leve') txt += ' · segue em Sobrepeso Leve';
    else if (d.estado === 'extremo') txt += ' · segue em Sobrepeso Extremo';
    return { txt: txt, cls: cls };
  }
  function atualizaProjecao(it) {
    var el = $('#bz-rc-proj');
    if (!el) return;
    var c = colunaCanonica(it);
    var p = projecaoTexto(it, c);
    el.textContent = p ? p.txt : '';
    el.className = 'bz-rc-proj' + (p && p.cls ? ' ' + p.cls : '');
    var o = $('#bz-rc-proj-outra');
    if (o) {
      var q = projecaoTexto(it, OUTRA[c]);
      o.textContent = q ? q.txt : '';
      o.className = 'bz-rc-proj-menu' + (q && q.cls ? ' ' + q.cls : '');
    }
  }
  function atualizaAlcance(it) {
    var el = $('#bz-rc-alcance');
    if (!el) return;
    var a = BZ.alcance(it);
    if (!ALCANCE[a] || it.cd == null) { el.textContent = ''; el.className = 'bz-rc-alcance'; return; }
    el.textContent = ALCANCE[a];
    el.className = 'bz-rc-alcance ' + a;
    el.title = 'Bancada: 10+Mod confortável, 20+Mod limite';
  }
  function atualizaIngredientes(it) {
    if (!temReceita(it)) return;
    var k = kf();
    var faltam = [], fecha = true;
    it.ing.forEach(function (g, i) {
      var m = D.porNome[g.item];
      var tem = k && m ? (+k.tenho(m.id) || 0) : 0;
      var pil = corpo.querySelector('.bz-rc-tem[data-i="' + i + '"]');
      var li = corpo.querySelector('.bz-rc-ing[data-i="' + i + '"]');
      var ok = tem >= g.n;
      if (pil) {
        if (!k) { pil.textContent = ''; pil.className = 'bz-rc-tem'; }
        else {
          pil.textContent = 'tenho ' + tem + '/' + g.n;
          pil.className = 'bz-rc-tem ' + (ok ? 'ok' : tem > 0 ? 'parcial' : 'zero');
        }
      }
      if (li) li.classList.toggle('tem', !!k && ok);
      var raiz = corpo.querySelector('.bz-rc-raiz[data-i="' + i + '"]');
      if (raiz) raiz.classList.toggle('tem', !!k && ok);
      if (!ok) {
        fecha = false;
        var onde = U.ondeAchar(g.item);
        faltam.push((g.n - tem) + '× ' + g.item + (onde ? ' (' + onde + ')' : ''));
      }
    });
    var res = $('#bz-rc-resumo'), prod = $('#bz-rc-produto');
    if (prod) prod.classList.toggle('fechada', !!k && fecha);
    if (!res) return;
    if (!k) { res.textContent = ''; res.className = 'bz-rc-resumo'; return; }
    res.textContent = fecha ? 'Fecha com o que você carrega' : 'Faltam: ' + faltam.join('; ');
    res.className = 'bz-rc-resumo ' + (fecha ? 'ok' : 'falta');
  }
  function atualizaDinamico() {
    var it = D.porId[atual];
    if (!it) return;
    var s = $('#bz-rc-selo');
    if (s) s.innerHTML = seloHTML(it);
    atualizaProjecao(it);
    atualizaAlcance(it);
    atualizaIngredientes(it);
  }

  // ------------------------------------------------------------ raízes da receita
  // Um SVG no sulco de 28px: do centro de cada linha até o nó do produto,
  // medido depois do render. Desenha uma vez por abertura (sem animação infinita).
  var NS = 'http://www.w3.org/2000/svg';
  function desenhaRaizes(animar) {
    var arv = $('#bz-rc-arvore'), s = $('#bz-rc-raizes'), prod = $('#bz-rc-produto');
    if (!arv || !s || !prod || painel.hidden) return;
    var base = arv.getBoundingClientRect();
    var pr = prod.getBoundingClientRect();
    var H = Math.max(1, Math.round(base.height));
    var topoProd = Math.round(pr.top - base.top); // topo do medalhão do produto
    var px = 20;                                  // centro do medalhão (40px, à esquerda)
    // as raízes convergem num #raiz-no (12px) colado ao topo do medalhão,
    // sem invadir o preenchimento dele
    var noY = topoProd - 6;
    var py = noY - 5;
    s.setAttribute('viewBox', '0 0 28 ' + H);
    s.setAttribute('width', '28');
    s.setAttribute('height', String(H));
    s.classList.toggle('anima', !!animar);
    while (s.firstChild) s.removeChild(s.firstChild);
    var nRaizes = 0;
    arv.querySelectorAll('.bz-rc-ing').forEach(function (li, n) {
      var r = li.getBoundingClientRect();
      var y = Math.round(r.top - base.top + Math.min(r.height / 2, 22));
      var i = li.getAttribute('data-i');
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'bz-rc-raiz' + (li.classList.contains('tem') ? ' tem' : ''));
      g.setAttribute('data-i', i);
      g.style.setProperty('--d', (n * 50) + 'ms');
      var meio = y + (py - y) * 0.55;
      var tronco = document.createElementNS(NS, 'path');
      tronco.setAttribute('d', 'M28 ' + y + 'C10 ' + y + ' ' + px + ' ' + meio + ' ' + px + ' ' + py);
      tronco.setAttribute('pathLength', '1');
      tronco.setAttribute('class', 'bz-rc-raiz-tronco');
      var radicula = document.createElementNS(NS, 'path');
      radicula.setAttribute('d', 'M17 ' + (y + 3) + 'c-4 3-7 6-9 11');
      radicula.setAttribute('pathLength', '1');
      radicula.setAttribute('class', 'bz-rc-raiz-radicula');
      g.appendChild(tronco);
      g.appendChild(radicula);
      s.appendChild(g);
      nRaizes = n + 1;
    });
    if (!nRaizes) return;
    var no = document.createElementNS(NS, 'use');
    no.setAttribute('href', '#raiz-no');
    no.setAttribute('x', String(px - 6));
    no.setAttribute('y', String(noY - 6));
    no.setAttribute('width', '12');
    no.setAttribute('height', '12');
    no.setAttribute('class', 'bz-rc-raiz-no');
    no.style.setProperty('--d', (nRaizes * 50 + 300) + 'ms');
    s.appendChild(no);
  }
  var resizeT;
  window.addEventListener('resize', function () {
    if (!aberto) return;
    clearTimeout(resizeT);
    resizeT = setTimeout(function () { desenhaRaizes(false); }, 120);
  });

  // ------------------------------------------------------------ barra: ‹ › e migalhas
  function atualizaBarra() {
    $('#bz-rc-voltar').disabled = hist.i <= 0;
    $('#bz-rc-avancar').disabled = hist.i >= hist.pilha.length - 1;
    var ini = Math.max(0, hist.pilha.length - MIGALHAS);
    var h = '';
    for (var j = ini; j < hist.pilha.length; j++) {
      var it = D.porId[hist.pilha[j]];
      if (!it) continue;
      h += '<button type="button" class="bz-rc-migalha ' + U.classeRar(it.raridade) + (j === hist.i ? ' atual' : '') +
        '" data-hist="' + j + '" data-prever="' + esc(it.id) + '" title="' + esc(it.nome) + '" aria-label="' + esc(it.nome) + '"' +
        (j === hist.i ? ' aria-current="true"' : '') + '>' + arte(it, 'bz-rc-mig-ico') + '</button>';
    }
    $('#bz-rc-migalhas').innerHTML = h;
  }

  // ------------------------------------------------------------ abrir / fechar
  function trocaHash(id) {
    try {
      if (id) history.replaceState(null, '', '#item/' + encodeURIComponent(id));
      else history.replaceState(null, '', location.pathname + location.search);
    } catch (e) {}
  }
  function mostra(it, o) {
    var abrindo = !aberto;
    clearTimeout(fechaT);
    atual = it.id;
    aberto = true;
    // foco dentro do painel antes da troca: o innerHTML (corpo e migalhas) tira o nó
    // focado do DOM e o ‹ › focado pode ficar disabled — nos dois casos o foco
    // cairia no <body>
    var focoDentro = !abrindo && painel.contains(document.activeElement);
    qtd = it.inv && it.inv.empilhavel ? 10 : 1;
    painel.className = 'bz-rc ' + U.classeRar(it.raridade);
    corpo.innerHTML = conteudoHTML(it);
    if (abrindo) {
      painel.hidden = false;
      document.body.classList.add('bz-rc-aberta');
      painel.classList.add('bz-rc-entra');
    }
    painel.scrollTop = 0;
    atualizaBarra();
    BZ.marcaSelecionado(it.id);
    trocaHash(it.id);
    atualizaDinamico();
    U.raf(function () { desenhaRaizes(true); });
    BZ.anunciar('Receita: ' + it.nome);
    var a = document.activeElement;
    var perdido = focoDentro && (!a || !painel.contains(a) || a.disabled);
    if (o.teclado || perdido) {
      var h2 = $('#bz-rc-nome');
      if (h2) h2.focus({ preventScroll: true });
    }
  }
  function abrir(id, o) {
    o = o || {};
    var it = D.porId[id];
    if (!it) return false;
    // clique no card já selecionado fecha
    if (o.via === 'catalogo' && o.clique && aberto && atual === id) { fechar({ clique: true }); return true; }
    if (o.via !== 'hist' && hist.pilha[hist.i] !== id) {
      hist.pilha = hist.pilha.slice(0, hist.i + 1);
      hist.pilha.push(id);
      if (hist.pilha.length > HIST_MAX) hist.pilha.shift();
      hist.i = hist.pilha.length - 1;
    }
    if (o.via === 'catalogo' || o.via === 'inv' || o.via === 'hash' || !aberto) {
      var el = o.el || null;
      origem = { id: id, el: el, uid: (el && el.getAttribute && el.getAttribute('data-uid')) || '' };
    }
    mostra(it, o);
    return true;
  }
  function navega(d, teclado) {
    var j = hist.i + d;
    if (j < 0 || j >= hist.pilha.length) return false;
    hist.i = j;
    return abrir(hist.pilha[j], { via: 'hist', teclado: !!teclado });
  }
  function focavel(el) {
    return !!el && !el.disabled && !el.closest('[hidden]') && el.getClientRects().length > 0;
  }
  function fechaMenu() {
    var m = $('#bz-rc-menu'), b = $('#bz-rc-outra');
    if (!m || m.hidden) return false;
    m.hidden = true;
    if (b) b.setAttribute('aria-expanded', 'false');
    return true;
  }
  function fechar(o) {
    o = o || {};
    if (!aberto) return false;
    aberto = false;
    atual = '';
    document.body.classList.remove('bz-rc-aberta');
    painel.classList.remove('bz-rc-entra');
    painel.classList.add('bz-rc-sai');
    clearTimeout(fechaT);
    fechaT = setTimeout(function () {
      painel.hidden = true;
      painel.classList.remove('bz-rc-sai');
    }, 120);
    BZ.marcaSelecionado('');
    trocaHash('');
    // o foco volta à origem (nó guardado, linha do inventário de mesmo uid, card do
    // catálogo de mesmo id); senão, à primeira reserva visível
    var alvo = alvoRetorno(origem, {
      vivo: function (el) { return document.contains(el); },
      linhaInv: function (uid) { return document.querySelector('#bz-inventario li.bz-slot[data-uid="' + CSS.escape(uid) + '"]'); },
      card: function (id) { return document.querySelector('#bz-resultados .item-card[data-id="' + CSS.escape(id) + '"]'); },
      reservas: [$('#bz-search'), $('#bz-cb-input'), $('#bz-inv-amplo'), $('#bz-trilho')],
      focavel: focavel
    });
    if (alvo) alvo.focus({ preventScroll: !!o.clique });
    return true;
  }

  // ------------------------------------------------------------ guardar
  function guardar(it, coluna, n) {
    var k = kf();
    if (!k || !it) return;
    var uid = k.adicionar(it, { qtd: n, coluna: coluna });
    if (!uid) return;
    var col = coluna || colunaCanonica(it);
    var cg = null;
    try { cg = k.carga(); } catch (e) {}
    var c = cg && cg[col];
    BZ.anunciar('Guardado: ' + n + '× ' + it.nome + ' em ' + ROTULO[col] + (c ? ' (' + c.usado + '/' + c.max + ')' : ''));
    if (BZ.inventario && typeof BZ.inventario.piscar === 'function') BZ.inventario.piscar(uid);
  }
  function lerQtd() {
    var inp = $('#bz-rc-qtd');
    if (!inp) return qtd;
    qtd = clampQtd(inp.value);
    inp.value = qtd;
    return qtd;
  }
  function passo(d) {
    lerQtd();
    qtd = clampQtd(qtd + d);
    var inp = $('#bz-rc-qtd');
    if (inp) inp.value = qtd;
    var it = D.porId[atual];
    if (it) atualizaProjecao(it);
  }

  // ------------------------------------------------------------ eventos
  painel.addEventListener('click', function (e) {
    var t = e.target, b;
    var clique = e.detail > 0;
    if (t.closest('#bz-rc-fechar')) return fechar({ clique: clique });
    if (t.closest('#bz-rc-voltar')) return navega(-1, !clique);
    if (t.closest('#bz-rc-avancar')) return navega(1, !clique);
    if ((b = t.closest('[data-hist]'))) {
      var j = +b.getAttribute('data-hist');
      if (hist.pilha[j]) { hist.i = j; abrir(hist.pilha[j], { via: 'hist', teclado: !clique }); }
      return;
    }
    if ((b = t.closest('[data-passo]'))) return passo((+b.getAttribute('data-passo')) * (e.shiftKey ? 10 : 1));
    if ((b = t.closest('#bz-rc-outra'))) {
      var m = $('#bz-rc-menu');
      if (!m) return;
      var abre = m.hidden;
      m.hidden = !abre;
      b.setAttribute('aria-expanded', String(abre));
      if (abre && !clique) { var mi = m.querySelector('[role="menuitem"]'); if (mi) mi.focus(); }
      return;
    }
    if ((b = t.closest('[data-guardar]'))) {
      fechaMenu();
      return guardar(D.porId[atual], b.getAttribute('data-guardar'), lerQtd());
    }
    if ((b = t.closest('[data-guardar-ing]'))) {
      e.stopPropagation();
      return guardar(D.porId[b.getAttribute('data-guardar-ing')], null, e.shiftKey ? 10 : 1);
    }
    if (t.closest('#bz-rc-selo-btn')) {
      if (BZ.inventario && typeof BZ.inventario.mostrar === 'function') BZ.inventario.mostrar(atual);
      else { var k = kf(); if (k) k.abrir('inventario'); }
      return;
    }
    if ((b = t.closest('[data-ir]'))) {
      fechaMenu();
      abrir(b.getAttribute('data-ir'), { via: 'ir', teclado: !clique });
      return;
    }
    // clique noutro ponto do painel fecha só o menu do ▾
    if (!t.closest('#bz-rc-menu')) fechaMenu();
  });

  painel.addEventListener('keydown', function (e) {
    if (e.target && e.target.id === 'bz-rc-qtd') {
      if (e.key === 'Enter') { e.preventDefault(); lerQtd(); var it = D.porId[atual]; if (it) atualizaProjecao(it); }
      else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        passo((e.key === 'ArrowUp' ? 1 : -1) * (e.shiftKey ? 10 : 1));
      }
    }
  });
  painel.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'bz-rc-qtd') { lerQtd(); var it = D.porId[atual]; if (it) atualizaProjecao(it); }
  });
  painel.addEventListener('input', function (e) {
    if (!e.target || e.target.id !== 'bz-rc-filtro') return;
    var q = U.semAcento(e.target.value.trim()).toLowerCase();
    corpo.querySelectorAll('.bz-rc-grupo').forEach(function (d) {
      var vis = 0;
      d.querySelectorAll('li[data-busca]').forEach(function (li) {
        var ok = !q || li.getAttribute('data-busca').indexOf(q) >= 0;
        li.hidden = !ok;
        if (ok) vis++;
      });
      d.hidden = vis === 0;
      d.open = q ? vis > 0 : (+d.getAttribute('data-total') <= 8);
    });
  });
  // linhas de ingrediente, degraus e usos são arrastáveis com o payload do card
  painel.addEventListener('dragstart', function (e) {
    var b = e.target && e.target.closest && e.target.closest('[data-ir]');
    var it = b && D.porId[b.getAttribute('data-ir')];
    if (!it || !e.dataTransfer) return;
    e.dataTransfer.setData('text/plain', JSON.stringify({ _bazar: true, item: it }));
    e.dataTransfer.effectAllowed = 'copy';
  });
  painel.addEventListener('animationend', function (e) {
    if (e.target === painel) painel.classList.remove('bz-rc-entra');
  });

  // Esc: depois do pop-up (10) e do combobox (20)
  BZ.camadaEsc(30, function () {
    if (fechaMenu()) { var b = $('#bz-rc-outra'); if (b) b.focus(); return true; }
    return fechar({});
  });
  // [ e ] percorrem o histórico (painel aberto, foco fora de campo de texto)
  BZ.atalho('[', function () { if (!aberto) return false; navega(-1, true); });
  BZ.atalho(']', function () { if (!aberto) return false; navega(1, true); });

  function doHash() {
    var m = /^#item\/(.+)$/.exec(location.hash || '');
    if (!m) return false;
    var id;
    try { id = decodeURIComponent(m[1]); } catch (e) { return false; }
    if (!D.porId[id]) return false;
    if (aberto && atual === id) return true;
    return abrir(id, { via: 'hash' });
  }
  window.addEventListener('hashchange', function () { if (BZ.pronto) doHash(); });

  BZ.receita = {
    abrir: abrir,
    fechar: fechar,
    aberto: function () { return aberto; },
    atual: function () { return atual; },
    voltar: function () { return navega(-1); },
    avancar: function () { return navega(1); }
  };

  BZ.quandoIniciar(function () { doHash(); });
  BZ.aoMudar.push(function () { if (aberto) atualizaDinamico(); });
  BZ.aoRender.push(function () {
    if (!aberto) return;
    var it = D.porId[atual];
    if (it) atualizaAlcance(it);
  });
})(typeof window !== 'undefined' ? window.BZ : null);
