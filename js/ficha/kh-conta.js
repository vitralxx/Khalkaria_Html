/* Khalkaria — Ficha · KhConta: o componente "conta" (F4.1), PURO (devolve string).
 * O número calculado com o tooltip da fórmula (css/componentes.css: .kh-conta e
 * .kh-conta-dica): span.kh-conta[tabindex=0][aria-describedby][data-caminho] com
 * b.<p>-v (o valor mostrado) e span.kh-conta-dica[role=tooltip] com a fórmula
 * simbólica e a numérica, os termos (valor, rótulo, fonte, selo, motivo), os
 * selos, o ajuste manual ou migrado, os avisos e os lembretes do nó. Fora da
 * dica: "calc. X" quando há ajuste, a marca de aviso e os selos curtos.
 *
 *   var C = KhConta.criar({ D: KhRegras.dados(), nos: av.nos, prefixo: 'kf3',
 *                           esc: ..., fmt: KhRegras.fmt, semEmoji: ... });
 *   C.conta('evasao.ativa')                     // o número com a conta
 *   C.conta('x', { no, un, texto, semSelos })   // nó fora do grafo, unidade, texto no lugar do valor
 *   C.caminhos                                  // os caminhos mostrados, na ordem
 *
 * Cada instância numera os ids da dica a partir de 1 (<p>-d-1, <p>-d-2…) e
 * guarda a lista de caminhos que mostrou: uma instância por render. O prefixo
 * (padrão 'kf3', o da prévia) vai nas classes e nos ids, para outra página (a
 * ficha) usar o seu sem colidir. esc, fmt e semEmoji são opcionais (padrão: os
 * deste módulo e o KhAjustes.fmt, o mesmo que o KhRegras.fmt).
 *
 * No node exporta por module.exports (carregado sozinho); no artefato js/ficha.js
 * o export já é o KhInv e este módulo só registra window.KhConta no navegador.
 * Fonte: js/ficha/kh-conta.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhAjustes = emNode ? require('./kh-ajustes.js') : raiz.KhAjustes;

  var KhConta = (function () {
    var PREFIXO = 'kf3';
    var RE_PREFIXO = /^[a-z][a-z0-9-]*$/i;
    var TIPO_FONTE = { regra: 'regra', classe: 'classe', raca: 'raça', origem: 'origem', item: 'item', no: 'campo',
      ficha: 'ficha', ajuste: 'ajuste manual', carta: 'carta', condicao: 'condição', tecnica: 'técnica', marca: 'marca',
      ultimate: 'ultimate', traco: 'traço', variante: 'variante', subespecie: 'subespécie', tecnologia: 'tecnologia',
      corrupcao: 'corrupção', magia: 'magia', dor: 'dor', beneficio: 'benefício', nivel: 'nível', vhelor: 'Vhelor' };
    // texto curto do selo ao lado do número (o completo, D.rotulosSelo, vai no tooltip)
    var SELO_CURTO = { decisaoPedro: 'decisão', pendentePedro: 'pendente Pedro',
      pendenteBalanceamento: 'pendente bal.', avisoClasse: 'rework', ajuste: 'ajuste' };
    var EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu;

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function esc(s) {
      return str(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
    function semEmoji(s) { return str(s).replace(EMOJI, '').replace(/\s{2,}/g, ' ').trim(); }

    // op: {D, nos, prefixo, esc, fmt, semEmoji}
    function criar(op) {
      op = op || {};
      var D = op.D || {};
      var nos = op.nos || null;
      var p = op.prefixo == null ? PREFIXO : str(op.prefixo);
      if (!RE_PREFIXO.test(p)) throw new Error('KhConta: prefixo inválido "' + p + '" (letras, dígitos e hífen)');
      var es = op.esc || esc, se = op.semEmoji || semEmoji;
      var fmt = op.fmt || (KhAjustes && KhAjustes.fmt) || str;
      var n = 0, caminhos = [];

      function rotuloSelo(k) { return str(D.rotulosSelo && D.rotulosSelo[k]) || k; }
      function seloDoStatus(st) {
        if (!st || st === 'ajuste') return null;
        var selos = D.selos || {};
        var s = selos[st];
        if (s === undefined) s = selos.semStatus;
        return s || null;
      }
      function fonteTxt(f) {
        if (!obj(f)) return '';
        var t = TIPO_FONTE[f.tipo] || str(f.tipo), nome = se(f.nome), id = str(f.id);
        if (f.tipo === 'regra') return t + ': ' + (id ? id.replace(/^contrato:/, 'contrato · ') : nome);
        return t + ': ' + (nome || id);
      }
      function valorTermo(t) {
        var v = t.valor;
        if (v === null || v === undefined) return '?';
        if (typeof v === 'boolean') return v ? 'sim' : 'não';
        switch (t.op) {
          case 'fixa': return '= ' + fmt(v);
          case 'multiplica': return '× ' + fmt(v);
          case 'minimo': return 'mín. ' + fmt(v);
          case 'dado': return '+ ' + fmt(v);
          case 'formula': return fmt(v);
          default:
            if (typeof v === 'number') return v < 0 ? '− ' + fmt(-v) : '+ ' + fmt(v);
            return fmt(v);
        }
      }
      function termoHTML(t) {
        var selo = seloDoStatus(t.status);
        var mot = str(t.motivo);
        return '<span class="' + p + '-t' + (t.ativo ? '' : ' ' + p + '-t-off') + '">' +
          '<span class="' + p + '-t-v">' + es(valorTermo(t)) + '</span> ' +
          '<span class="' + p + '-t-r">' + es(se(t.rotulo)) + '</span>' +
          (obj(t.fonte) && t.fonte.tipo !== 'ajuste' ? ' <span class="' + p + '-t-f">· ' + es(fonteTxt(t.fonte)) + '</span>' : '') +
          (selo ? ' <span class="' + p + '-t-s">[' + es(rotuloSelo(selo)) + ']</span>' : '') +
          (!t.ativo && !/^display/.test(mot) ? ' <span class="' + p + '-t-m">(não entra' + (mot ? ': ' + es(mot) : '') + ')</span>'
            : (mot ? ' <span class="' + p + '-t-m">(' + es(mot) + ')</span>' : '')) +
          '</span>';
      }
      function valorNo(no, un) {
        var v = no ? no.valor : null;
        if (v === null || v === undefined) return '—';
        if (typeof v === 'boolean') return v ? 'sim' : 'não';
        if (typeof v === 'number') return fmt(v) + (un || '');
        return str(v);
      }
      function selosHTML(selos) {
        return lista(selos).map(function (s) {
          return '<span class="' + p + '-selo ' + p + '-selo-' + es(s) + '" title="' + es(rotuloSelo(s)) + '">' +
            '<svg aria-hidden="true"><use href="#g-selo"/></svg>' + es(SELO_CURTO[s] || s) + '</span>';
        }).join('');
      }
      // o número com a conta. o: {un, texto (troca o valor mostrado), semSelos, no (nó fora do grafo)}
      function conta(caminho, o) {
        o = o || {};
        var no = o.no || (nos && nos[caminho]);
        if (!no) return '<span class="' + p + '-nulo">—</span>';
        caminhos.push(caminho);
        var id = p + '-d-' + (++n);
        var sim = str(no.formula && no.formula.simbolica), num = str(no.formula && no.formula.numerica);
        var rot = se(no.rotulo);
        var linhas = '<span class="' + p + '-d-sim">' + es(sim.indexOf(rot) === 0 ? sim : rot + ' = ' + sim) + '</span>' +
          '<span class="' + p + '-d-num">' + es(num) + '</span>';
        if (lista(no.termos).length) linhas += '<span class="' + p + '-d-ts">' + no.termos.map(termoHTML).join('') + '</span>';
        var sl = lista(no.selos).concat(lista(no.selosProgressao).filter(function (s) { return lista(no.selos).indexOf(s) < 0; }));
        if (sl.length) linhas += '<span class="' + p + '-d-selos">Selo: ' + sl.map(function (s) { return es(rotuloSelo(s)); }).join(' · ') + '</span>';
        if (no.ajuste) {
          linhas += '<span class="' + p + '-d-aj">Ajuste ' + (no.ajuste.origem === 'migracao' ? 'migrado da v2' : 'manual') +
            ': calculado ' + es(fmt(no.calculado)) + ' · ajustado ' + es(fmt(no.valor)) +
            (no.ajuste.motivo ? ' (' + es(no.ajuste.motivo) + ')' : '') +
            (no.ajuste.mudou ? ' · o calculado mudou desde o ajuste' : '') + '</span>';
        }
        lista(no.avisos).forEach(function (a) { linhas += '<span class="' + p + '-d-av">Aviso: ' + es(a.msg || a.tipo) + '</span>'; });
        lista(no.lembretes).forEach(function (a) { linhas += '<span class="' + p + '-d-lb">Lembrete: ' + es(a.msg || a.op) + '</span>'; });
        var mostrado = o.texto != null ? o.texto : valorNo(no, o.un);
        return '<span class="kh-conta ' + p + '-conta" tabindex="0" aria-describedby="' + id + '"' +
          (no.ajuste ? ' data-ajustado' : '') + ' data-caminho="' + es(caminho) + '">' +
          '<b class="' + p + '-v">' + es(mostrado) + '</b>' +
          '<span class="kh-conta-dica ' + p + '-dica" id="' + id + '" role="tooltip">' + linhas + '</span></span>' +
          (no.ajuste ? '<span class="' + p + '-calc">calc. ' + es(valorNo({ valor: no.calculado }, o.un)) + '</span>' : '') +
          // número com aviso do motor (dado faltando, valor fora da conta): marca à vista, o texto vai em Avisos
          (lista(no.avisos).length ? ' <span class="' + p + '-aviso ' + p + '-marca-aviso" title="' +
            es(lista(no.avisos).map(function (a) { return a.msg || a.tipo; }).join(' · ')) + '">aviso</span>' : '') +
          (o.semSelos ? '' : selosHTML(no.selos));
      }

      return { prefixo: p, caminhos: caminhos, conta: conta, termoHTML: termoHTML, selosHTML: selosHTML,
        fonteTxt: fonteTxt, valorTermo: valorTermo, valorNo: valorNo, rotuloSelo: rotuloSelo, seloDoStatus: seloDoStatus };
    }

    return { PREFIXO: PREFIXO, TIPO_FONTE: TIPO_FONTE, SELO_CURTO: SELO_CURTO,
      criar: criar, esc: esc, semEmoji: semEmoji };
  })();

  if (emNode) { module.exports = KhConta; return; }
  raiz.KhConta = KhConta;
})(typeof window !== 'undefined' ? window : this);
