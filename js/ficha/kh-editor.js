/* Khalkaria — Ficha · KhEditor: a interface da edição da ficha nova no modo Ensaio (F4.6b), SÓ COM A PRÉVIA.
 * Especificação: docs/ficha-digital/07-f4-6-ensaio.md §3 (base: plano 02 M2 e §3.1).
 *
 * Um controlador por lugar: a página da ficha (modo 'pagina', em #fp) e o
 * drawer da ficha nova (modo 'drawer', no cabeçalho dele). Só age com o
 * Ensaio ligado (KhEnsaio.ligado); fora dele, a barra fica escondida e os
 * controles nem existem (o KhFichaAbas só os desenha com {editar}).
 *
 *   - CAMPOS de estado (os controles data-ed, data-ed-delta, data-ed-grau e
 *     data-ed-lista que o KhFichaAbas desenha): o 'change' (ao sair do campo,
 *     Tab ou Enter), o clique no círculo de grau e o − / + do stepper viram
 *     MUDANÇAS (KhEdicao) e um passo do armazém do ensaio (armazem.editar:
 *     grava a ficha e o log de desfazer). No drawer, só recursos atuais e Sins.
 *   - AJUSTE manual (M2, só na página): clique ou Enter num número ajustável
 *     (.kh-conta[data-ajustavel]) abre o pop-over "Ajustar": Valor fixo
 *     (padrão) ou Diferença, Motivo, Remover; "Temporário" desabilitado, com a
 *     nota "expira na Mesa (F5)". Esc, Cancelar, clicar fora ou sair dele fecham.
 *   - A BARRA: Desfazer e Refazer (o topo de cada pilha; desligados, com o
 *     porquê, se não há passo ou se a ficha mudou depois dele), "Ajustes (N)"
 *     (só na página: a lista com calculado × ajustado, motivo, data, o aviso
 *     "o calculado mudou" e a remoção em lote) e a mensagem (role=status).
 *   - ATALHOS no KhTeclas, fase de captura, fora de campo de texto: Ctrl+Z
 *     desfaz e Ctrl+Y refaz. Na página, em qualquer lugar fora da ficha atual
 *     (#kf-drawer); no drawer, só com o foco dentro dele (o Ctrl+Z do Bazar
 *     continua sendo do Bazar).
 *
 * Cada gravação emite o 'kh:ensaio' com ['ficha']: a página, o drawer e os
 * seletores redesenham (o KhRedesenho devolve o foco ao equivalente). Depois
 * do 'change', o aviso sai no tempo seguinte (setTimeout 0): o foco já andou
 * (Tab) e o redesenho o encontra no campo novo. Com o botão do mouse (ou o
 * dedo) apertado, a BARRA só se redesenha depois de soltar (auditoria B): o
 * 'change' de um campo dispara no apertar de Desfazer, e trocar a barra ali
 * engolia o clique (o 1º só confirmava o campo). Desfazer e Refazer agem pelo
 * estado de agora do log, não pelo aria-disabled da barra ainda por redesenhar.
 * Trocar raça ou classe diz o que ficou da anterior e oferece, na mensagem,
 * "Remover o que era de <anterior>" (um passo, desfazível; KhEdicao.restos).
 * O Ensaio só escreve no
 * sessionStorage com o prefixo khalkaria_ensaio: (o armazém dele); nenhuma
 * chave da ficha do jogador.
 *
 * Partes puras (testadas no node, tools/testes/ensaio.test.js): htmlBarra,
 * htmlPop, htmlAjustes, linhasAjustes, textoErro, valorTexto. No node exporta
 * por module.exports (carregado sozinho); no artefato js/ficha.js o export já
 * é o KhInv e este módulo só registra window.KhEditor no navegador. Vem no
 * ORDEM depois do kh-ficha-abas.js e antes do kh-ficha-drawer.js (que o usa).
 * Fonte: js/ficha/kh-editor.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhEnsaio = emNode ? require('./kh-ensaio.js') : raiz.KhEnsaio;
  var KhEdicao = emNode ? require('./kh-edicao.js') : raiz.KhEdicao;
  var KhAjustes = emNode ? require('./kh-ajustes.js') : raiz.KhAjustes;
  var KhSeletor = emNode ? require('./kh-seletor.js') : raiz.KhSeletor;
  var KhRedesenho = emNode ? require('./kh-redesenho.js') : raiz.KhRedesenho;

  var KhEditor = (function () {
    var CAMADA_ESC = 33;     // o pop-over fecha antes do diálogo do seletor (35) e do drawer (40)
    var TEMP_NOTA = 'expira na Mesa (F5)';
    var DICA_PAGINA = 'Os campos gravam ao sair deles (Tab ou Enter). Clique num número para ajustar.';
    var DICA_DRAWER = 'Aqui, só os recursos atuais e os Sins (− e +). O resto, na página da ficha.';
    var SEM_FICHA = 'O ensaio está sem ficha aberta: crie ou importe uma no seletor de fichas.';
    var FORA = 'O ensaio não está ligado nesta aba: nada foi gravado.';
    var AJUDA = {
      fixa: 'O número passa a ser este, até você remover o ajuste.',
      soma: 'Soma ao calculado (+2, −1) e acompanha o calculado (o nível, os itens).',
      dado: 'Um dado, como 1d8 ou 13 + 1d8.',
      booleano: 'Marca ou desmarca, no lugar do calculado.'
    };

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function esc(s) {
      return str(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
    function semEmoji(s) {
      return str(s).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '').replace(/\s{2,}/g, ' ').trim();
    }
    function fmt(n) { return KhAjustes && KhAjustes.fmt ? KhAjustes.fmt(n) : str(n); }
    function storage(win, nome) { try { return win ? win[nome] || null : null; } catch (e) { return null; } }
    function fmtData(iso) { return KhSeletor && KhSeletor.fmtData ? KhSeletor.fmtData(iso) : str(iso); }

    // ---------------- puras ----------------
    // o valor de um ajuste (ou calculado) no campo do pop-over
    function valorTexto(v) {
      if (typeof v === 'boolean') return v ? 'sim' : 'nao';
      if (typeof v === 'number') return fmt(v);
      return str(v);
    }
    // o texto de uma recusa do armazém (editar, desfazer, refazer)
    function textoErro(r, acao) {
      r = obj(r) ? r : {};
      var e = str(r.erro);
      if (e === 'vazio') return acao === 'refazer' ? 'Nada a refazer.' : 'Nada a desfazer.';
      if (e === 'outra-aba') {
        return (acao === 'refazer' ? 'Não dá para refazer' : 'Não dá para desfazer') + ' "' + str(r.rotulo) +
          '": a ficha mudou depois (em outra aba ou em outra página desta aba).';
      }
      if (e === 'ajuste-invalido') {
        return 'Ajuste recusado em ' + str(r.caminho) + (r.motivo === 'caminho-de-estado' ? ': é um campo de estado (edite o campo, não ajuste).' : ' (' + str(r.motivo || 'inválido') + ').');
      }
      if (e === 'caminho-invalido') return 'Este campo não se edita (' + str(r.caminho) + ').';
      if (KhSeletor && KhSeletor.textoErro) return KhSeletor.textoErro(r);
      return 'Não deu certo (' + (e || 'erro desconhecido') + '): nada foi gravado.';
    }

    // a lista de ajustes da tela "Ajustes": a do KhAjustes.listar mais o nome
    // do número, o calculado e o ajustado em texto, e o aviso "o calculado mudou"
    function linhasAjustes(ficha, nos) {
      if (!KhAjustes) return [];
      nos = obj(nos) ? nos : {};
      return KhAjustes.listar(ficha, nos).map(function (l) {
        var no = nos[l.caminho] || null;
        var av = no ? lista(no.avisos).filter(function (a) { return a.tipo === 'calculado-mudou'; })[0] : null;
        return { caminho: l.caminho, rotulo: no ? semEmoji(no.rotulo) || l.caminho : l.caminho,
          calculado: l.semNo ? '—' : valorTexto(l.calculado).replace(/^nao$/, 'não'),
          ajustado: l.semNo ? '—' : valorTexto(l.ajustado).replace(/^nao$/, 'não'),
          ajuste: KhEdicao ? KhEdicao.textoAjuste({ modo: l.modo, valor: l.valor }) : '',
          motivo: l.motivo, desde: fmtData(l.desde), origem: l.origem, mudou: av ? str(av.msg) : '', semNo: l.semNo };
      });
    }

    function botao(acao, texto, o) {
      o = o || {};
      return '<button type="' + (o.submit ? 'submit' : 'button') + '" class="kh-btn ke-btn ke-ed-' + acao + (o.forte ? ' forte' : '') + '"' +
        (o.submit ? '' : ' data-ked="' + acao + '"') + (o.desligado ? ' aria-disabled="true"' : '') +
        (o.tecla ? ' aria-keyshortcuts="' + o.tecla + '"' : '') + (o.titulo ? ' title="' + esc(o.titulo) + '"' : '') +
        (o.attrs || '') + '>' + esc(texto) + '</button>';
    }
    // a tela "Ajustes" (P = o prefixo dos ids). sel: {caminho: true}
    function htmlAjustes(linhas, sel, P) {
      linhas = lista(linhas); sel = obj(sel) ? sel : {};
      var id = (P || 'ke') + '-ked-aj';
      var h = '<section class="ke-aj" id="' + id + '" aria-labelledby="' + id + '-tit">' +
        '<p class="ke-aj-tit" id="' + id + '-tit">Ajustes desta ficha (' + linhas.length + ')</p>';
      if (!linhas.length) {
        return h + '<p class="ke-nota">Nenhum ajuste. Clique num número da ficha para ajustar.</p>' +
          '<div class="ke-dialogo-acoes">' + botao('fechar-aj', 'Fechar') + '</div></section>';
      }
      var n = linhas.filter(function (l) { return sel[l.caminho]; }).length, todos = n === linhas.length;
      h += '<div class="ke-aj-rola"><table class="ke-aj-tab"><thead><tr>' +
        '<th scope="col"><input type="checkbox" class="ke-aj-todos" data-ked-todos aria-label="Selecionar todos"' + (todos ? ' checked' : '') + '></th>' +
        '<th scope="col">Número</th><th scope="col">Calculado</th><th scope="col">Ajustado</th><th scope="col">Ajuste</th>' +
        '<th scope="col">Motivo</th><th scope="col">Desde</th></tr></thead><tbody>' +
        linhas.map(function (l) {
          return '<tr data-caminho="' + esc(l.caminho) + '"' + (sel[l.caminho] ? ' data-sel' : '') + '>' +
            '<td><input type="checkbox" class="ke-aj-sel" data-ked-sel value="' + esc(l.caminho) + '" aria-label="' + esc('Selecionar ' + l.rotulo) + '"' + (sel[l.caminho] ? ' checked' : '') + '></td>' +
            '<th scope="row" class="ke-aj-nome">' + esc(l.rotulo) + ' <code class="ke-aj-caminho">' + esc(l.caminho) + '</code>' +
              (l.mudou ? ' <span class="ke-mudou" role="note">' + esc(l.mudou) + '</span>' : '') +
              (l.semNo ? ' <span class="ke-mudou" role="note">sem este número na ficha agora</span>' : '') + '</th>' +
            '<td class="ke-aj-n">' + esc(l.calculado) + '</td><td class="ke-aj-n">' + esc(l.ajustado) + '</td>' +
            '<td>' + esc(l.ajuste) + (l.origem === 'migracao' ? ' <span class="ke-aj-origem">(migrado da ficha atual)</span>' : '') + '</td>' +
            '<td>' + (l.motivo ? esc(l.motivo) : '<span class="ke-aj-vazio">—</span>') + '</td><td class="ke-aj-n">' + esc(l.desde) + '</td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<div class="ke-dialogo-acoes">' + botao('remover-sel', n ? 'Remover ' + n + ' selecionado' + (n === 1 ? '' : 's') : 'Remover selecionados',
          { forte: true, desligado: !n, titulo: n ? 'Remove os ajustes marcados (um passo de desfazer)' : 'Marque os ajustes que saem' }) + ' ' +
          botao('fechar-aj', 'Fechar') + '</div></section>';
      return h;
    }
    // a barra. est: {log (armazem.estadoLog), nAjustes, aberto (a tela Ajustes),
    // msg:{tipo, texto}, linhas, sel}. o: {modo 'pagina' | 'drawer', prefixo}
    function htmlBarra(est, o) {
      est = obj(est) ? est : {}; o = obj(o) ? o : {};
      var pag = o.modo !== 'drawer', P = str(o.prefixo) || 'ke';
      var lg = obj(est.log) ? est.log : {};
      function andar(acao, txt, p, tecla, teclaTxt) {
        var tit = !p ? (acao === 'desfazer' ? 'Nada a desfazer' : 'Nada a refazer')
          : !p.livre ? txt + ' indisponível: a ficha mudou depois de "' + p.rotulo + '"' : txt + ': ' + p.rotulo;
        return botao(acao, txt, { desligado: !p || !p.livre, tecla: tecla, titulo: tit + ' (' + teclaTxt + ')' });
      }
      var m = obj(est.msg) ? est.msg : null;
      var h = '<div class="ke-ed-barra" role="group" aria-label="Edição da ficha do ensaio">' +
        andar('desfazer', 'Desfazer', lg.desfazer, 'Control+Z', 'Ctrl+Z') + andar('refazer', 'Refazer', lg.refazer, 'Control+Y', 'Ctrl+Y') +
        (pag ? botao('ajustes', 'Ajustes (' + (Number(est.nAjustes) || 0) + ')', { titulo: 'A lista dos ajustes manuais desta ficha',
          attrs: ' aria-expanded="' + !!est.aberto + '" aria-controls="' + esc(P) + '-ked-aj"' }) : '') +
        '<p class="ke-ed-dica">' + esc(pag ? DICA_PAGINA : DICA_DRAWER) + '</p>' +
        '<p class="ke-ed-msg' + (m && m.tipo === 'aviso' ? ' ke-ed-msg-aviso' : '') + '" role="status" aria-live="polite">' + (m ? esc(m.texto) : '') + '</p>' +
        // a ação da mensagem (trocar raça/classe: "Remover o que era de <anterior>")
        (m && obj(m.acao) ? botao(m.acao.ked, m.acao.texto, { titulo: m.acao.titulo }) : '') + '</div>';
      if (pag && est.aberto) h += htmlAjustes(est.linhas, est.sel, P);
      return h;
    }
    // o pop-over "Ajustar". p: {caminho, rotulo, tipo ('numero'|'dado'|'booleano'),
    // modo, valor, motivo, erro, calculado (texto), ajustado (texto), ajuste
    // (o guardado, ou null), mudou (o aviso "o calculado mudou")}
    function htmlPop(p) {
      p = obj(p) ? p : {};
      var tipo = p.tipo === 'dado' || p.tipo === 'booleano' ? p.tipo : 'numero';
      var modo = tipo === 'booleano' ? 'fixa' : p.modo === 'soma' ? 'soma' : 'fixa';
      var aj = obj(p.ajuste) ? p.ajuste : null;
      var ajuda = tipo === 'booleano' ? AJUDA.booleano : modo === 'soma' ? AJUDA.soma : tipo === 'dado' ? AJUDA.dado : AJUDA.fixa;
      var h = '<form class="ke-pop" role="dialog" aria-modal="false" aria-labelledby="ke-pop-tit" data-ked-form="ajuste" data-caminho="' + esc(p.caminho) + '">' +
        '<p class="ke-pop-tit" id="ke-pop-tit">Ajustar: ' + esc(p.rotulo || p.caminho) + '</p>' +
        '<p class="ke-pop-calc">Calculado: <b>' + esc(p.calculado) + '</b>' +
          (aj ? ' · ajustado: <b>' + esc(p.ajustado) + '</b> (' + esc(KhEdicao ? KhEdicao.textoAjuste(aj) : '') + (aj.motivo ? ', ' + esc(aj.motivo) : '') + ')' : '') + '</p>' +
        (p.mudou ? '<p class="ke-mudou ke-pop-mudou" role="note">' + esc(p.mudou) + '. Aplicar de novo guarda o calculado de agora.</p>' : '');
      if (tipo !== 'booleano') {
        h += '<fieldset class="ke-pop-modo"><legend class="ke-rot">Modo</legend>' +
          [['fixa', 'Valor fixo'], ['soma', 'Diferença']].map(function (x) {
            return '<label class="ke-check"><input type="radio" name="ke-pop-modo" value="' + x[0] + '" data-ked-campo="modo"' + (modo === x[0] ? ' checked' : '') + '> ' + x[1] + '</label>';
          }).join(' ') + '</fieldset>';
        h += '<label class="ke-campo"><span class="ke-rot">' + (modo === 'soma' ? 'Diferença' : 'Valor') + '</span> ' +
          '<input type="text" class="ke-pop-valor" data-ked-campo="valor" value="' + esc(p.valor) + '" autocomplete="off" spellcheck="false"' +
          (tipo === 'numero' || modo === 'soma' ? ' inputmode="decimal"' : '') + ' aria-describedby="ke-pop-ajuda"></label>';
      } else {
        var sim = str(p.valor) === 'sim';
        h += '<label class="ke-campo"><span class="ke-rot">Valor</span> <select class="ke-pop-valor" data-ked-campo="valor" aria-describedby="ke-pop-ajuda">' +
          '<option value="sim"' + (sim ? ' selected' : '') + '>sim</option><option value="nao"' + (sim ? '' : ' selected') + '>não</option></select></label>';
      }
      h += '<p class="ke-nota" id="ke-pop-ajuda">' + esc(ajuda) + '</p>' +
        '<label class="ke-campo"><span class="ke-rot">Motivo</span> <input type="text" class="ke-pop-motivo" data-ked-campo="motivo" value="' + esc(p.motivo) + '"' +
          ' maxlength="' + (KhEdicao ? KhEdicao.MAX_MOTIVO : 120) + '" autocomplete="off" placeholder="opcional"></label>' +
        '<p class="ke-pop-temp"><label class="ke-check ke-pop-temp-rot"><input type="checkbox" disabled aria-describedby="ke-pop-temp-nota"> Temporário</label> ' +
          '<span class="ke-nota" id="ke-pop-temp-nota">' + esc(TEMP_NOTA) + '</span></p>' +
        (p.erro ? '<p class="ke-pop-erro" role="alert">' + esc(p.erro) + '</p>' : '') +
        '<div class="ke-dialogo-acoes">' + botao('aplicar-aj', 'Aplicar', { forte: true, submit: true }) +
          (aj ? ' ' + botao('remover-aj', 'Remover', { titulo: 'Tira o ajuste: o número volta ao calculado' }) : '') +
          ' ' + botao('cancelar-aj', 'Cancelar') + '</div></form>';
      return h;
    }

    // ---------------- o controlador (um por lugar) ----------------
    // op: {win, doc, raiz (onde ouvir: #fp ou o drawer), modo ('pagina' |
    //      'drawer'), prefixo, lugar() -> o contêiner da barra (criado na 1ª
    //      vez, só com o Ensaio), contexto() -> o KhFichaAbas.contexto (as
    //      opções da identidade e das condições), agora() (testes)}
    function criar(op) {
      op = obj(op) ? op : {};
      var win = op.win, doc = op.doc || (win && win.document), raizEl = op.raiz;
      if (!win || !doc || !raizEl || !KhEnsaio || !KhEdicao) return null;
      var modo = op.modo === 'drawer' ? 'drawer' : 'pagina';
      var P = /^[a-z][a-z0-9-]*$/i.test(str(op.prefixo)) ? str(op.prefixo) : 'ke';
      var ss = storage(win, 'sessionStorage');
      var R = KhRedesenho ? KhRedesenho.criar({ prefixo: P + '-ked' }) : null;
      var st = { msg: null, aberto: false, sel: {}, pop: null, res: null, restos: null };
      var popEl = null, barraEl = null, redesenhandoPop = false;
      // o botão do mouse apertado: a barra espera soltar para se redesenhar (auditoria B)
      var apertado = false, barraPendente = false;

      function ligado() { return KhEnsaio.ligado(win); }
      function arm() { return KhEnsaio.armazem(ss); }
      function ativa() {
        var a = arm(), id = a.ativa();
        return id ? { a: a, id: id, ficha: a.ler(id) } : null;
      }
      function ctx() { try { return typeof op.contexto === 'function' ? op.contexto() : null; } catch (e) { return null; } }
      function agora() { return typeof op.agora === 'function' ? op.agora() : new Date().toISOString(); }
      function nos() { return st.res && st.res.estado === 'ok' && st.res.av ? st.res.av.nos : {}; }
      function foca(x) { if (x && typeof x.focus === 'function') { try { x.focus({ preventScroll: true }); } catch (e) { x.focus(); } } }
      function tira(el) { if (el && typeof el.remove === 'function') el.remove(); else if (el && el.parentNode) el.parentNode.removeChild(el); }
      function aviso(t) { st.msg = { tipo: 'aviso', texto: t }; }
      function emitir(partes) { KhEnsaio.emitir(win, partes || ['ficha']); }
      function adiado(fn) { if (typeof win.setTimeout === 'function') win.setTimeout(fn, 0); else fn(); }
      // o Ensaio saiu (outra página da aba; esta veio do bfcache): nada grava, e todos se acertam
      function fora() {
        if (ligado()) return false;
        aviso(FORA);
        emitir(['ligado', 'indice', 'ficha']);
        return true;
      }

      // ---- gravar: r = {ok, mudancas, rotulo, aviso} (KhEdicao) -> um passo do armazém
      function grava(r, quando) {
        if (!r || !r.ok) { aviso(r ? r.erro : 'Não deu certo.'); desenhaBarra(); return false; }
        if (fora()) return false;
        if (!lista(r.mudancas).length) return true;
        var x = ativa();
        if (!x) { aviso(SEM_FICHA); desenhaBarra(); return false; }
        var g = x.a.editar(x.id, r.mudancas, r.rotulo);
        if (!g.ok) { aviso(textoErro(g)); desenhaBarra(); return false; }
        if (!g.mudou) return true;
        st.msg = r.aviso ? { tipo: 'aviso', texto: r.aviso }
          : g.avisoLog ? { tipo: 'aviso', texto: 'Gravado, mas sem desfazer: ' + textoErro({ erro: g.avisoLog }) } : null;
        if (g.logLimpo) avisoLogLimpo();
        // trocou raça ou classe e ficou algo da anterior: a mensagem oferece remover (num passo)
        st.restos = obj(r.restos) ? { campo: r.restos.campo, anterior: r.restos.anterior } : null;
        if (st.restos && st.msg) {
          st.msg.acao = { ked: 'remover-restos', texto: 'Remover o que era de ' + st.restos.anterior.nome,
            titulo: 'Tira da ficha, num passo só (Desfazer volta), o que ficou ' + (st.restos.campo === 'raca' ? 'da raça' : 'da classe') + ' anterior' };
        }
        if (quando === 'adiado') { desenhaBarra(); adiado(function () { emitir(); }); } else emitir();
        return true;
      }
      // faltou espaço e a limpeza apagou o desfazer desta ficha (auditoria B: avisar)
      function avisoLogLimpo() {
        var t = 'Faltou espaço: para gravar, o histórico de desfazer desta ficha foi apagado (o Desfazer recomeça daqui).';
        st.msg = { tipo: 'aviso', texto: st.msg && st.msg.texto ? st.msg.texto + ' ' + t : t };
      }
      // "Remover o que era de <anterior>" (o botão da mensagem): calcula de novo pela ficha de agora
      function removeRestos() {
        var rs = st.restos;
        if (!rs || fora()) return;
        var x = ativa();
        if (!x || !x.ficha) { aviso(SEM_FICHA); desenhaBarra(); return; }
        var r = KhEdicao.mudancaRestos(x.ficha, ctx(), rs.campo, rs.anterior);
        st.restos = null;
        if (!r.ok) { aviso(r.erro); desenhaBarra(); return; }
        if (grava(r)) { st.msg = { tipo: 'ok', texto: 'Removido: ' + r.rotulo.replace(/^Remover /, '') + '. Desfazer volta.' }; desenhaBarra(); }
      }
      // desfazer e refazer (os botões e o Ctrl+Z / Ctrl+Y)
      function anda(acao) {
        if (fora()) return;
        var x = ativa();
        if (!x) { aviso(SEM_FICHA); desenhaBarra(); return; }
        var r = acao === 'refazer' ? x.a.refazer(x.id) : x.a.desfazer(x.id);
        if (!r.ok) { aviso(textoErro(r, acao)); desenhaBarra(); return; }
        st.restos = null;
        st.msg = { tipo: 'ok', texto: (acao === 'refazer' ? 'Refeito: ' : 'Desfeito: ') + r.rotulo + '.' };
        if (r.avisoLog) st.msg = { tipo: 'aviso', texto: st.msg.texto + ' ' + textoErro({ erro: r.avisoLog }) };
        if (r.logLimpo) avisoLogLimpo();
        fechaPop(false);
        emitir();
      }

      // ---- a barra (e a tela Ajustes)
      function lugar() {
        if (barraEl) return barraEl;
        try { barraEl = typeof op.lugar === 'function' ? op.lugar() : null; } catch (e) { barraEl = null; }
        return barraEl;
      }
      function troca(c, h) {
        if (R) R.trocaHTML(doc, c, h, null, null, win);
        else if (c._kedHtml !== h) { c.innerHTML = h; c._kedHtml = h; }
      }
      function desenhaBarra(foco) {
        if (!ligado()) { esconde(); return false; }
        var c = lugar();
        if (!c) return false;
        // botão apertado (o 'change' do campo veio do apertar de Desfazer): espera soltar
        if (apertado) { barraPendente = true; return true; }
        barraPendente = false;
        var x = ativa();
        var ficha = x ? x.ficha : null;
        var nAj = ficha && obj(ficha.ajustes) ? Object.keys(ficha.ajustes).length : 0;
        var linhas = modo === 'pagina' && st.aberto && ficha ? linhasAjustes(ficha, nos()) : [];
        // a seleção só guarda o que ainda é ajuste
        Object.keys(st.sel).forEach(function (k) { if (!(ficha && obj(ficha.ajustes) && ficha.ajustes[k])) delete st.sel[k]; });
        troca(c, htmlBarra({ log: x ? x.a.estadoLog(x.id) : null, nAjustes: nAj, aberto: st.aberto, msg: st.msg, linhas: linhas, sel: st.sel },
          { modo: modo, prefixo: P }));
        c.hidden = false;
        if (foco) foca(c.querySelector(foco));
        return true;
      }
      function esconde() {
        st.msg = null; st.aberto = false; st.sel = {}; st.restos = null; barraPendente = false;
        fechaPop(false);
        if (barraEl) { troca(barraEl, ''); barraEl.hidden = true; }
      }

      // ---- o pop-over "Ajustar" (só na página)
      function contaDe(caminho) {
        var l = raizEl.querySelectorAll ? raizEl.querySelectorAll('.kh-conta[data-ajustavel]') : [];
        for (var i = 0; i < l.length; i++) if (l[i].getAttribute('data-caminho') === caminho) return l[i];
        return null;
      }
      function estadoPop() {
        var p = st.pop, no = nos()[p.caminho] || null;
        var x = ativa(), aj = x && x.ficha && obj(x.ficha.ajustes) ? x.ficha.ajustes[p.caminho] || null : null;
        var mudou = no ? lista(no.avisos).filter(function (a) { return a.tipo === 'calculado-mudou'; })[0] : null;
        return { caminho: p.caminho, rotulo: p.rotulo, tipo: p.tipo, modo: p.modo, valor: p.valor, motivo: p.motivo, erro: p.erro,
          calculado: no ? valorTexto(no.calculado).replace(/^nao$/, 'não') : '—', ajustado: no ? valorTexto(no.valor).replace(/^nao$/, 'não') : '—',
          ajuste: aj, mudou: mudou ? str(mudou.msg) : '' };
      }
      function posiciona() {
        var f = popEl && popEl.querySelector ? popEl.querySelector('.ke-pop') : null;
        var c = st.pop ? contaDe(st.pop.caminho) : null;
        if (!f || !c || !c.getBoundingClientRect || !f.style) return;
        var r = c.getBoundingClientRect(), de = doc.documentElement;
        var W = (de && de.clientWidth) || win.innerWidth || 1280, H = (de && de.clientHeight) || win.innerHeight || 800;
        var w = f.offsetWidth || 320, h = f.offsetHeight || 260, M = 8;
        var x = Math.min(Math.max(M, r.left), Math.max(M, W - w - M));
        var y = r.bottom + 6;
        if (y + h > H - M) y = r.top - 6 - h >= M ? r.top - 6 - h : Math.max(M, H - h - M);
        f.style.setProperty('left', Math.round(x) + 'px');
        f.style.setProperty('top', Math.round(y) + 'px');
      }
      function desenhaPop(foco) {
        if (!st.pop) { fechaPop(false); return; }
        if (!popEl) {
          popEl = doc.createElement('div');
          popEl.className = 'ke-pop-lugar';
          popEl.setAttribute('data-kf-ignorar', '');
          raizEl.appendChild(popEl);
        }
        redesenhandoPop = true;
        popEl.innerHTML = htmlPop(estadoPop());
        redesenhandoPop = false;
        posiciona();
        if (foco) foca(popEl.querySelector(foco));
      }
      function abrePop(conta) {
        if (modo !== 'pagina' || fora()) return;
        var caminho = conta.getAttribute('data-caminho'), no = nos()[caminho];
        if (!no || !KhEdicao.ajustavel(caminho)) return;
        var x = ativa(), aj = x && x.ficha && obj(x.ficha.ajustes) ? x.ficha.ajustes[caminho] || null : null;
        var tipo = KhEdicao.tipoAjuste(caminho);
        var modoAj = aj && aj.modo === 'soma' && tipo !== 'booleano' ? 'soma' : 'fixa';
        st.pop = { caminho: caminho, rotulo: semEmoji(no.rotulo) || caminho, tipo: tipo, modo: modoAj,
          valor: aj ? valorTexto(aj.valor) : valorTexto(tipo === 'booleano' ? !!no.valor : no.calculado),
          motivo: aj ? str(aj.motivo) : '', erro: '' };
        desenhaPop('.ke-pop-valor');
      }
      // fecha; devolver = o foco volta ao número
      function fechaPop(devolver) {
        var p = st.pop;
        st.pop = null;
        if (popEl) { redesenhandoPop = true; tira(popEl); popEl = null; redesenhandoPop = false; }
        if (devolver && p) foca(contaDe(p.caminho));
      }
      // o que está digitado no pop-over (para um redesenho dele não perder)
      function lePop() {
        if (!st.pop || !popEl) return;
        var v = popEl.querySelector('[data-ked-campo="valor"]'), m = popEl.querySelector('[data-ked-campo="motivo"]');
        if (v && v.value != null) st.pop.valor = str(v.value);
        if (m && m.value != null) st.pop.motivo = str(m.value);
      }
      function aplica() {
        var p = st.pop;
        if (!p || fora()) return;
        lePop();
        var x = ativa();
        if (!x || !x.ficha) { aviso(SEM_FICHA); fechaPop(false); desenhaBarra(); return; }
        var m = KhEdicao.montaAjuste(p.caminho, { modo: p.modo, valor: p.valor, motivo: p.motivo }, nos()[p.caminho], agora());
        if (!m.ok) { p.erro = m.erro; desenhaPop('.ke-pop-valor'); return; }
        var r = KhEdicao.mudancaAjuste(x.ficha, p.caminho, m.ajuste, p.rotulo);
        fechaPop(true);
        grava(r);
      }
      function removeAjuste() {
        var p = st.pop;
        if (!p || fora()) return;
        var x = ativa();
        if (!x || !x.ficha) return;
        var r = KhEdicao.mudancaRemover(x.ficha, [p.caminho], p.rotulo);
        fechaPop(true);
        grava(r);
      }

      // ---- os ouvintes (delegados na raiz: o redesenho não os perde)
      function perto(t, sel) { try { return t && t.closest ? t.closest(sel) : null; } catch (e) { return null; } }
      function dentro(el) { return !!el && raizEl.contains(el); }
      function acaoBarra(a, b) {
        // Desfazer e Refazer: pelo log de agora (a barra pode estar por redesenhar, com
        // o aria-disabled de antes do 'change'); sem passo, o anda diz por quê
        if (a === 'desfazer' || a === 'refazer') { anda(a); return; }
        if (a === 'remover-restos') { removeRestos(); return; }
        if (b.getAttribute('aria-disabled') === 'true') return;
        if (a === 'ajustes') { st.aberto = !st.aberto; desenhaBarra('[data-ked="ajustes"]'); return; }
        if (a === 'fechar-aj') { st.aberto = false; desenhaBarra('[data-ked="ajustes"]'); return; }
        if (a === 'remover-sel') {
          if (fora()) return;
          var x = ativa();
          if (!x || !x.ficha) return;
          var cams = Object.keys(st.sel);
          var r = KhEdicao.mudancaRemover(x.ficha, cams, cams.length === 1 && nos()[cams[0]] ? nos()[cams[0]].rotulo : '');
          if (r.ok) st.sel = {};
          if (grava(r)) desenhaBarra('[data-ked="ajustes"]');
          return;
        }
        if (a === 'remover-aj') { removeAjuste(); return; }
        if (a === 'cancelar-aj') { fechaPop(true); }
      }
      // um controle da edição (a barra, um campo, um círculo, o stepper, um número ajustável)?
      function controle(t) {
        var c = perto(t, '[data-ked], [data-ed-grau], [data-ed-delta], [data-ed-evento]') ||
          (modo === 'pagina' ? perto(t, '.kh-conta[data-ajustavel]') : null);
        return c && dentro(c) ? c : null;
      }
      raizEl.addEventListener('click', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        // página velha (o Ensaio saiu em outra página da aba): o controle não
        // grava, e a página se acerta (a barra e os controles somem)
        if (!ligado()) { if (controle(t)) fora(); return; }
        var b = perto(t, '[data-ked]');
        if (b && dentro(b)) { acaoBarra(b.getAttribute('data-ked'), b); return; }
        var g = perto(t, '[data-ed-grau]');
        if (g && dentro(g)) {
          if (fora()) return;
          var x = ativa();
          if (!x || !x.ficha) return;
          var p = g.getAttribute('data-ed-grau');
          grava(KhEdicao.mudancas(x.ficha, 'pericias.' + p, KhEdicao.grauClicado(x.ficha, p, Number(g.getAttribute('data-grau')))));
          return;
        }
        // o botão do evento de item (F6): o valor vem da caixa ao lado (o número do item ou o que rolou)
        var ev = perto(t, '[data-ed-evento]');
        if (ev && dentro(ev)) {
          if (fora()) return;
          var z = ativa();
          if (!z || !z.ficha) return;
          var caixa = perto(ev, '.kh-ev');
          var inp = caixa && caixa.querySelector ? caixa.querySelector('.kh-ev-n') : null;
          var vi = !inp ? '' : inp.value != null ? inp.value : inp.getAttribute('value');
          grava(KhEdicao.evento(z.ficha, ev.getAttribute('data-ed-evento'), ev.getAttribute('data-ed-op'), vi,
            ev.getAttribute('data-ed-rotulo')));
          return;
        }
        var d = perto(t, '[data-ed-delta]');
        if (d && dentro(d)) {
          if (fora()) return;
          var y = ativa();
          if (!y || !y.ficha) return;
          grava(KhEdicao.passo(y.ficha, d.getAttribute('data-ed-alvo'), Number(d.getAttribute('data-ed-delta'))));
          return;
        }
        var k = modo === 'pagina' ? perto(t, '.kh-conta[data-ajustavel]') : null;
        if (!k || !dentro(k)) return;
        // o mesmo número de novo: fecha (e o foco fica nele)
        if (st.pop && st.pop.caminho === k.getAttribute('data-caminho')) fechaPop(true);
        else abrePop(k);
      });
      raizEl.addEventListener('keydown', function (e) {
        if (modo !== 'pagina' || !ligado() || (e.key !== 'Enter' && e.key !== ' ')) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        var k = perto(e.target, '.kh-conta[data-ajustavel]');
        if (!k || k !== e.target) return;
        if (e.preventDefault) e.preventDefault();
        abrePop(k);
      });
      raizEl.addEventListener('change', function (e) {
        var t = e.target;
        if (!t || !t.getAttribute) return;
        var c = t.getAttribute('data-ed'), l = t.getAttribute('data-ed-lista');
        if (!ligado()) {
          if (c || l || (popEl && popEl.contains(t)) || t.hasAttribute('data-ked-todos') || t.hasAttribute('data-ked-sel')) fora();
          return;
        }
        if (popEl && popEl.contains(t)) {
          if (t.getAttribute('data-ked-campo') === 'modo' && st.pop) {
            lePop();
            st.pop.modo = str(t.value) === 'soma' ? 'soma' : 'fixa';
            st.pop.erro = '';
            desenhaPop('.ke-pop-modo input[value="' + st.pop.modo + '"]');
          }
          return;
        }
        if (t.hasAttribute && t.hasAttribute('data-ked-todos')) {
          var x0 = ativa();
          st.sel = {};
          if (t.checked && x0 && x0.ficha && obj(x0.ficha.ajustes)) Object.keys(x0.ficha.ajustes).forEach(function (k) { st.sel[k] = true; });
          desenhaBarra('[data-ked-todos]');
          return;
        }
        if (t.hasAttribute && t.hasAttribute('data-ked-sel')) {
          if (t.checked) st.sel[str(t.value)] = true; else delete st.sel[str(t.value)];
          desenhaBarra('[data-ked-sel][value="' + str(t.value) + '"]');
          return;
        }
        if (!c && !l) return;
        if (fora()) return;
        var x = ativa();
        if (!x || !x.ficha) { aviso(SEM_FICHA); desenhaBarra(); return; }
        if (l) { grava(KhEdicao.mudancas(x.ficha, l, { valor: t.value, marcado: !!t.checked }, { contexto: ctx() }), 'adiado'); return; }
        var r = KhEdicao.mudancas(x.ficha, c, t.value, { contexto: ctx() });
        if (!r.ok) {
          // o campo volta ao valor guardado (o redesenho não muda o HTML, que é o mesmo)
          var v = pegaValor(x.ficha, c);
          if (t.tagName !== 'SELECT') t.value = Array.isArray(v) ? v.join(', ') : v == null ? '' : str(v);
        }
        grava(r, 'adiado');
      });
      raizEl.addEventListener('submit', function (e) {
        var f = e.target;
        if (!f || !f.getAttribute || f.getAttribute('data-ked-form') !== 'ajuste') return;
        if (e.preventDefault) e.preventDefault();
        aplica();
      });
      raizEl.addEventListener('input', function (e) {
        if (popEl && e.target && popEl.contains(e.target)) lePop();
      });
      raizEl.addEventListener('focusout', function (e) {
        if (!popEl || redesenhandoPop || !st.pop) return;
        var para = e.relatedTarget;
        if (para && !popEl.contains(para)) fechaPop(false);
      });
      // o botão apertado e solto (em qualquer lugar): a barra que ficou para depois
      // se redesenha no tempo seguinte ao soltar, já depois do clique
      doc.addEventListener('pointerdown', function () { apertado = true; }, true);
      function solta() {
        apertado = false;
        if (barraPendente) adiado(function () { if (barraPendente && !apertado) desenhaBarra(); });
      }
      doc.addEventListener('pointerup', solta, true);
      doc.addEventListener('pointercancel', solta, true);
      // rede de segurança: o soltar que não chega (arrasto nativo, a janela perde o foco)
      doc.addEventListener('dragend', solta, true);
      if (typeof win.addEventListener === 'function') win.addEventListener('blur', function () { if (apertado) solta(); });
      // clicar fora do pop-over o fecha (sem devolver o foco: o clique o levou)
      doc.addEventListener('pointerdown', function (e) {
        if (!popEl || !st.pop) return;
        var t = e.target;
        if (t && popEl.contains(t)) return;
        var k = perto(t, '.kh-conta[data-ajustavel]');
        if (k && k.getAttribute('data-caminho') === st.pop.caminho) return;
        fechaPop(false);
      }, true);
      if (typeof win.addEventListener === 'function') {
        win.addEventListener('scroll', function () { if (popEl) posiciona(); }, { passive: true });
        win.addEventListener('resize', function () { if (popEl) posiciona(); });
      }
      function pegaValor(f, c) {
        return str(c).split('.').reduce(function (a, k) { return a !== null && typeof a === 'object' ? a[k] : undefined; }, f);
      }

      // ---- teclado: Esc fecha o pop-over; Ctrl+Z e Ctrl+Y (fora de campo de texto)
      var T = win.KhTeclas;
      if (T && typeof T.camadaEsc === 'function') {
        T.camadaEsc(CAMADA_ESC, function () {
          if (!st.pop) return false;
          fechaPop(true);
          return true;
        });
      }
      if (T && typeof T.atalho === 'function') {
        var guarda = function (e) {
          if (!ligado()) return false;
          var t = e && e.target;
          // a ficha atual (v2.1) aberta por cima: o Ctrl+Z é dela
          if (perto(t, '#kf-drawer')) return false;
          // no drawer, só com o foco nele (o Ctrl+Z do Bazar continua do Bazar)
          if (modo === 'drawer') return dentro(t) || dentro(doc.activeElement);
          return true;
        };
        T.atalho('Ctrl+z', function () { anda('desfazer'); }, { fase: 'captura', quando: guarda, descricao: 'Desfazer na ficha do ensaio' });
        T.atalho('Ctrl+y', function () { anda('refazer'); }, { fase: 'captura', quando: guarda, descricao: 'Refazer na ficha do ensaio' });
      }

      // depois de cada desenho da página (ou do drawer): a barra e o pop-over
      // acompanham a ficha de agora (res = o KhEnsaio.calcular)
      function desenha(res) {
        st.res = res || null;
        if (!ligado()) { esconde(); return false; }
        desenhaBarra();
        // o pop-over aberto fica como está (o jogador pode estar digitando nele): só
        // segue o número, ou fecha se o número saiu da ficha
        if (st.pop) {
          if (!nos()[st.pop.caminho] || !contaDe(st.pop.caminho)) fechaPop(false);
          else posiciona();
        }
        return true;
      }

      return { desenha: desenha, desenhaBarra: desenhaBarra, abrePop: abrePop, fechaPop: fechaPop, anda: anda, ligado: ligado,
        estado: function () { return { msg: st.msg, aberto: st.aberto, sel: Object.keys(st.sel), pop: st.pop ? JSON.parse(JSON.stringify(st.pop)) : null }; } };
    }

    return { CAMADA_ESC: CAMADA_ESC, TEMP_NOTA: TEMP_NOTA, DICA_PAGINA: DICA_PAGINA, DICA_DRAWER: DICA_DRAWER, SEM_FICHA: SEM_FICHA, FORA: FORA,
      valorTexto: valorTexto, textoErro: textoErro, linhasAjustes: linhasAjustes,
      htmlBarra: htmlBarra, htmlAjustes: htmlAjustes, htmlPop: htmlPop, criar: criar };
  })();

  if (emNode) { module.exports = KhEditor; return; }
  raiz.KhEditor = KhEditor;
})(typeof window !== 'undefined' ? window : this);
