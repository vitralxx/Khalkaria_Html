/* Khalkaria — Ficha · KhSeletor: o seletor de fichas e a faixa do Ensaio (F4.6a), SÓ COM A PRÉVIA.
 * Especificação: docs/ficha-digital/07-f4-6-ensaio.md §2 (base: plano 02 §3.1, D36).
 *
 * A interface do modo Ensaio (a lógica é do KhEnsaio, js/ficha/kh-ensaio.js):
 *   - o SELETOR de fichas (criar(op)): um controlador por lugar, no topo da
 *     página da ficha (#fp-ke) e no cabeçalho do drawer da ficha nova
 *     (#fd-gaveta-ke). Só funciona no ensaio; fora dele o contêiner fica
 *     escondido (na página, o seletor desabilitado do topo segue como hoje).
 *     Lista (nome, classe, nível e data; trocar redesenha a página e o
 *     drawer), Criar em branco (pede o nome), Duplicar (id novo, "(cópia)"),
 *     Excluir (dois passos: baixa o export e pede que o jogador confirme que
 *     salvou; o export não conta como feito sem a confirmação), Exportar esta
 *     (<nome>.khalkaria.json) e todas (khalkaria-fichas.json, fichas/1),
 *     Importar (ficha ou pacote; id repetido pergunta: atualizar, com o export
 *     antes e a mesma confirmação, ou cópia), o uso do espaço e, em
 *     QuotaExceeded, o aviso com "Exportar todas";
 *   - a FAIXA fixa (ligarFaixa(win), chamada por quem monta com a prévia: o
 *     drawer, em toda página, e a página da ficha): enquanto o
 *     ensaio está ligado, "Ensaio: nada aqui é salvo na sua ficha. Tudo some
 *     ao fechar a aba.", com "Exportar ensaio" (pacote fichas/1) e "Sair do
 *     ensaio" (confirma e apaga só o prefixo).
 *
 * Tudo grava pelo armazém do ensaio (KhEnsaio.armazem: sessionStorage, chaves
 * com o prefixo khalkaria_ensaio:); nenhuma chave da ficha do jogador. Cada
 * mudança sai no evento 'kh:ensaio' (KhEnsaio.emitir), que a página, o drawer,
 * a faixa e os outros seletores escutam. O CSS (css/ficha-ensaio.css) só é
 * pedido com o ensaio ligado. Sem a prévia, NADA acontece: nenhum nó, CSS,
 * ouvinte ou escrita. Esc fecha o diálogo aberto (KhTeclas.camadaEsc 35, antes
 * da do drawer, 40).
 *
 * Partes puras (testadas no node, tools/testes/ensaio.test.js): fmtBytes,
 * fmtData, rotuloFicha, textoErro, htmlSeletor e htmlFaixa. No node exporta
 * por module.exports (carregado sozinho); no artefato js/ficha.js o export já
 * é o KhInv e este módulo só registra window.KhSeletor e liga a faixa no
 * navegador. Vem no ORDEM depois do kh-ensaio.js e antes do
 * kh-ficha-drawer.js (que o usa).
 * Fonte: js/ficha/kh-seletor.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhEnsaio = emNode ? require('./kh-ensaio.js') : raiz.KhEnsaio;
  var KhRedesenho = emNode ? require('./kh-redesenho.js') : raiz.KhRedesenho;

  var KhSeletor = (function () {
    var CAMADA_ESC = 35;               // antes da do drawer (40), depois das do Bazar (10, 20, 30)
    var ID_FAIXA = 'ke-faixa';
    var CSS = 'css/ficha-ensaio.css';
    var ATRIBUTO = 'data-ensaio';      // no <html> com a faixa à vista: o css/ficha-ensaio.css reserva o pé
    var FAIXA_TXT = 'nada aqui é salvo na sua ficha. Tudo some ao fechar a aba.';
    var NOME_VAZIO = '(sem nome)';
    var NOME_NOVA = 'Ficha nova';
    var PACOTE = 'khalkaria-fichas.json';
    var QUOTA = 'O navegador recusou a gravação (QuotaExceeded): o espaço desta aba acabou e nada foi salvo. ' +
      'Exporte todas as fichas do ensaio e exclua alguma.';
    var SEM_STORAGE = 'O ensaio precisa do armazenamento da aba (sessionStorage), que está bloqueado neste navegador.';
    var ERROS = {
      quota: QUOTA,
      storage: 'O armazenamento desta aba (sessionStorage) recusou a gravação: nada foi salvo.',
      'somente-leitura': 'O índice do ensaio é de outra versão do site: nada foi gravado.',
      inexistente: 'Essa ficha não está mais no ensaio.',
      excluida: 'Essa ficha foi excluída do ensaio.',
      desatualizada: 'A ficha mudou enquanto isto acontecia: tente de novo.',
      json: 'O arquivo não é um JSON válido.',
      invalida: 'O arquivo não traz uma ficha nem um pacote de fichas.',
      vazio: 'O arquivo não traz nenhuma ficha.',
      'versao-futura': 'O arquivo é de uma versão mais nova do site',
      'export-falhou': 'O export não foi confirmado: nada foi apagado nem substituído.',
      'sem-export': 'Sem o export antes, nada é apagado.',
      ilegivel: 'A ficha do ensaio está ilegível: baixe o texto cru antes.',
      'poda-pendente': 'A ficha precisa do motor carregado para entrar no ensaio: tente de novo em instantes.'
    };

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function esc(s) {
      return str(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
    // sem emoji como ícone (o nome digitado pode trazer)
    function semEmoji(s) {
      return str(s).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '').replace(/\s+/g, ' ').trim();
    }
    function storage(win, nome) { try { return win ? win[nome] || null : null; } catch (e) { return null; } }

    // ---------------- puras: formato ----------------
    function virgula(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ','); }
    function fmtBytes(n) {
      n = Math.max(0, Math.round(Number(n) || 0));
      if (n < 1024) return n + ' B';
      if (n < 1024 * 1024) return virgula(n / 1024) + ' KB';
      return virgula(n / (1024 * 1024)) + ' MB';
    }
    function fmtPc(f) {
      var p = Math.max(0, Number(f) || 0) * 100;
      return p > 0 && p < 0.1 ? 'menos de 0,1%' : virgula(p) + '%';
    }
    function dois(n) { return (n < 10 ? '0' : '') + n; }
    // a data da linha do índice, na hora local: dd/mm hh:mm ('' sem data)
    function fmtData(iso) {
      if (!iso) return '';
      var d = new Date(str(iso));
      if (isNaN(d.getTime())) return '';
      return dois(d.getDate()) + '/' + dois(d.getMonth() + 1) + ' ' + dois(d.getHours()) + ':' + dois(d.getMinutes());
    }
    function nomeFicha(x) { return semEmoji(obj(x) ? x.nome : '') || NOME_VAZIO; }
    // a linha do seletor: nome, classe, nível e data
    function rotuloFicha(x) {
      x = obj(x) ? x : {};
      var d = fmtData(x.atualizadoEm);
      return nomeFicha(x) + ' — ' + (semEmoji(x.classe) || 'sem classe') + ' · Nível ' + (x.nivel == null ? '?' : str(x.nivel)) +
        (d ? ' · ' + d : '');
    }
    // o texto de uma recusa do armazém (KhEstado.armazem) ou do import
    function textoErro(r) {
      r = obj(r) ? r : {};
      var e = str(r.erro);
      if (e === 'versao-futura') return ERROS[e] + (r.versao ? ' (' + str(r.versao) + ')' : '') + ': nada foi gravado.';
      if (ERROS[e]) return ERROS[e];
      return 'Não deu certo (' + (e || 'erro desconhecido') + '): nada foi gravado.';
    }
    function plural(n, um, varios) { return n === 1 ? um : varios; }

    // ---------------- puras: html ----------------
    function botao(acao, texto, extra) {
      extra = extra || {};
      return '<button type="' + (extra.submit ? 'submit' : 'button') + '" class="kh-btn ke-btn ke-' + acao + (extra.forte ? ' forte' : '') + '"' +
        (extra.submit ? '' : ' data-ke="' + acao + '"') + (extra.desligado ? ' disabled' : '') +
        (extra.titulo ? ' title="' + esc(extra.titulo) + '"' : '') + '>' + esc(texto) + '</button>';
    }
    function arquivosTxt(arqs) {
      return lista(arqs).map(function (a) { return str(a && a.nomeArquivo); }).filter(Boolean).join(', ');
    }
    // o diálogo aberto dentro do seletor (null: nenhum); P = prefixo dos ids
    function htmlDialogo(d, P, nome) {
      if (!obj(d)) return '';
      var tit = P + '-ke-d-tit';
      if (d.tipo === 'criar') {
        return '<form class="ke-dialogo ke-dialogo-criar" data-ke-form="criar" aria-labelledby="' + tit + '">' +
          '<p class="ke-dialogo-tit" id="' + tit + '">Criar uma ficha em branco</p>' +
          '<label class="ke-campo"><span class="ke-rot">Nome</span> <input type="text" class="ke-nome" data-ke-campo="nome"' +
            ' maxlength="80" autocomplete="off" placeholder="' + esc(NOME_NOVA) + '" value="' + esc(nome) + '"></label>' +
          '<p class="ke-nota">O assistente de criação chega depois (F4c): por enquanto a ficha nasce em branco.</p>' +
          '<div class="ke-dialogo-acoes">' + botao('criar-ok', 'Criar', { forte: true, submit: true }) + ' ' + botao('cancelar', 'Cancelar') + '</div></form>';
      }
      if (d.tipo === 'antes') {
        var excluir = d.acao === 'excluir';
        var arqs = arquivosTxt(d.arquivos);
        var h = '<div class="ke-dialogo ke-dialogo-perigo" role="group" aria-labelledby="' + tit + '">' +
          '<p class="ke-dialogo-tit" id="' + tit + '">' + esc(excluir ? 'Excluir "' + str(d.nome) + '" do ensaio' : 'Atualizar com o arquivo importado') + '</p>';
        if (!excluir) h += '<p>' + esc('Atualizar substitui ' + plural(lista(d.arquivos).length, 'a ficha', 'as fichas') + ' do ensaio com o mesmo id (' + str(d.nome) + ').') + '</p>';
        if (d.passo !== 'confirmar') {
          h += '<p>' + esc('Passo 1 de 2: baixe o export ' + plural(lista(d.arquivos).length, 'desta ficha', 'destas fichas') + ' (' + arqs + '). ' +
            'É o único jeito de recuperar o que ' + (excluir ? 'for apagado' : 'for substituído') + '.') + '</p>' +
            '<div class="ke-dialogo-acoes">' + botao('baixar-antes', 'Baixar o export', { forte: true }) + ' ' + botao('cancelar', 'Cancelar') + '</div>';
        } else {
          h += '<p>' + esc('Passo 2 de 2: confira se ' + plural(lista(d.arquivos).length, 'o arquivo', 'os arquivos') + ' ' + arqs + ' ' +
            plural(lista(d.arquivos).length, 'foi salvo', 'foram salvos') + ' e só então confirme.') + '</p>' +
            '<label class="ke-check"><input type="checkbox" class="ke-salvei" data-ke-campo="salvei"' + (d.salvou ? ' checked' : '') + '> ' +
              'Salvei ' + plural(lista(d.arquivos).length, 'o arquivo', 'os arquivos') + '</label>' +
            '<div class="ke-dialogo-acoes">' + botao('confirmar', excluir ? 'Excluir de vez' : 'Atualizar de vez', { forte: true, desligado: !d.salvou }) + ' ' +
              botao('baixar-antes', 'Baixar de novo') + ' ' + botao('cancelar', 'Cancelar') + '</div>';
        }
        return h + '</div>';
      }
      if (d.tipo === 'conflito') {
        var n = lista(d.conflitos).length;
        return '<div class="ke-dialogo" role="group" aria-labelledby="' + tit + '">' +
          '<p class="ke-dialogo-tit" id="' + tit + '">' + esc(plural(n, 'Ficha repetida', 'Fichas repetidas')) + ' no arquivo</p>' +
          '<p>' + esc('O arquivo traz ' + str(d.nome) + ', ' + plural(n, 'que já está', 'que já estão') + ' no ensaio (o mesmo id). ' +
            'Atualizar substitui a do ensaio (com o export dela antes); importar como cópia cria outra, com id novo.') + '</p>' +
          '<div class="ke-dialogo-acoes">' + botao('atualizar', 'Atualizar…', { forte: true }) + ' ' + botao('copia', 'Importar como cópia') + ' ' +
            botao('cancelar', 'Cancelar') + '</div></div>';
      }
      if (d.tipo === 'quota') {
        return '<div class="ke-dialogo ke-dialogo-perigo" role="alert" aria-labelledby="' + tit + '">' +
          '<p class="ke-dialogo-tit" id="' + tit + '">O espaço da aba acabou</p><p>' + esc(QUOTA) + '</p>' +
          '<div class="ke-dialogo-acoes">' + botao('exportar-todas', 'Exportar todas', { forte: true }) + ' ' + botao('cancelar', 'Fechar') + '</div></div>';
      }
      return '';
    }
    // O seletor inteiro. est: {fichas (as linhas do índice), ativa, uso
    // (KhEnsaio.uso), dialogo, msg:{tipo:'ok'|'aviso', texto}, nome (o que se
    // digita no Criar)}. o: {prefixo ('fp' | 'fd': os ids), densidade ('pagina' | 'compacta')}
    function htmlSeletor(est, o) {
      est = obj(est) ? est : {};
      o = obj(o) ? o : {};
      var P = /^[a-z][a-z0-9-]*$/i.test(str(o.prefixo)) ? str(o.prefixo) : 'ke';
      var fichas = lista(est.fichas), tem = fichas.length > 0;
      var ativa = fichas.some(function (x) { return x.id === est.ativa; }) ? est.ativa : null;
      var u = obj(est.uso) ? est.uso : null;
      var h = '<div class="ke-seletor" data-ke-densidade="' + (o.densidade === 'compacta' ? 'compacta' : 'pagina') + '" role="group" aria-labelledby="' + P + '-ke-titulo">' +
        '<p class="ke-titulo" id="' + P + '-ke-titulo">Fichas do ensaio <span class="ke-n">(' + fichas.length + ')</span></p>' +
        '<div class="ke-linha"><label class="ke-rot" for="' + P + '-ke-lista">Ficha</label>' +
        '<select class="ke-lista" id="' + P + '-ke-lista" data-ke-campo="trocar"' + (tem ? '' : ' disabled') + '>' +
        (tem ? fichas.map(function (x) {
          return '<option value="' + esc(x.id) + '"' + (x.id === ativa ? ' selected' : '') + '>' + esc(rotuloFicha(x)) + '</option>';
        }).join('') : '<option selected>Nenhuma ficha no ensaio</option>') + '</select></div>' +
        '<div class="ke-acoes" role="group" aria-label="Ações das fichas do ensaio">' +
          botao('criar', 'Criar em branco') + botao('duplicar', 'Duplicar', { desligado: !ativa }) +
          botao('excluir', 'Excluir…', { desligado: !ativa }) +
          botao('exportar', 'Exportar esta', { desligado: !ativa, titulo: 'Baixa a ficha aberta (.khalkaria.json)' }) +
          botao('exportar-todas', 'Exportar todas', { desligado: !tem, titulo: 'Baixa todas as fichas do ensaio (' + PACOTE + ')' }) +
          botao('importar', 'Importar…', { titulo: 'Uma ficha (.khalkaria.json) ou um pacote de fichas' }) +
          '<input type="file" class="ke-arquivo" data-ke-campo="arquivo" accept=".json,application/json" hidden tabindex="-1" aria-hidden="true">' +
        '</div>';
      if (u) {
        var aba = 'a aba usa ' + fmtBytes(u.total) + ' de ~' + fmtBytes(u.limite) + ' (' + fmtPc(u.fracao) + ')';
        h += '<p class="ke-uso" data-ke-uso="' + Math.round(Number(u.bytes) || 0) + '" title="' + esc('Espaço do ensaio: ' + fmtBytes(u.bytes) + '; ' + aba) + '">' +
          'Espaço do ensaio: ' + esc(fmtBytes(u.bytes)) + '<span class="ke-uso-aba"> · ' + esc(aba) + '</span></p>';
      }
      h += htmlDialogo(est.dialogo, P, est.nome);
      var m = obj(est.msg) ? est.msg : null;
      h += '<p class="ke-msg' + (m ? ' ke-msg-' + (m.tipo === 'aviso' ? 'aviso' : 'ok') : '') + '" role="status" aria-live="polite">' + (m ? esc(m.texto) : '') + '</p>';
      return h + '</div>';
    }
    // A faixa fixa. est: {sair (confirmando a saída), n (fichas no ensaio), msg}
    function htmlFaixa(est) {
      est = obj(est) ? est : {};
      var n = Math.max(0, Number(est.n) || 0);
      var h = '<p class="ke-faixa-txt"><strong>Ensaio:</strong> ' + esc(FAIXA_TXT) + '</p><div class="ke-faixa-acoes">';
      if (est.sair) {
        h += '<p class="ke-faixa-conf">' + esc('Sair apaga ' + (n ? plural(n, 'a ficha', 'as ' + n + ' fichas') + ' do ensaio' : 'o ensaio') +
          ' desta aba. A sua ficha não muda.') + '</p>' +
          botao('exportar-ensaio', 'Exportar ensaio') + botao('sair-ok', 'Sair e apagar', { forte: true }) + botao('sair-nao', 'Continuar no ensaio');
      } else h += botao('exportar-ensaio', 'Exportar ensaio') + botao('sair', 'Sair do ensaio');
      var m = obj(est.msg) ? est.msg : null;
      return h + '</div><p class="ke-faixa-msg' + (m && m.tipo === 'aviso' ? ' ke-msg-aviso' : '') + '" role="status" aria-live="polite">' +
        (m ? esc(m.texto) : '') + '</p>';
    }

    // ---------------- navegador: apoio ----------------
    // a raiz do site e o ?v= do js/ficha.js (o mesmo que o drawer usa para o CSS dele)
    function baseVersao(doc) {
      var s = doc && doc.querySelector ? doc.querySelector('script[src*="js/ficha.js"]') : null;
      var src = s ? s.src || (s.getAttribute && s.getAttribute('src')) : '';
      var out = { base: '', versao: '' };
      try { if (src) { out.base = new URL('../', src).href; out.versao = new URL(src).search; } } catch (e) { /* relativo à página */ }
      return out;
    }
    // o css/ficha-ensaio.css, uma vez por página (só com o ensaio ligado)
    function poeCss(win) {
      var doc = win.document;
      if (!doc.head || doc.querySelector('link[data-ke-css]')) return false;
      var bv = baseVersao(doc);
      var l = doc.createElement('link');
      l.rel = 'stylesheet';
      l.href = (bv.base || '../') + CSS + bv.versao;
      l.setAttribute('data-ke-css', '');
      doc.head.appendChild(l);
      return true;
    }
    function tira(el) {
      if (!el) return;
      if (typeof el.remove === 'function') el.remove();
      else if (el.parentNode) el.parentNode.removeChild(el);
    }
    // baixa um arquivo: {nomeArquivo, dados} (JSON) ou {nomeArquivo, texto} (cru)
    function baixar(win, arq) {
      if (!win || !obj(arq)) return false;
      try {
        var doc = win.document;
        var texto = arq.texto != null ? str(arq.texto) : JSON.stringify(arq.dados, null, 2);
        var U = win.URL;
        var url = U.createObjectURL(new win.Blob([texto], { type: 'application/json' }));
        var a = doc.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', str(arq.nomeArquivo) || 'ficha.khalkaria.json');
        a.hidden = true;
        doc.body.appendChild(a);
        a.click();
        tira(a);
        if (typeof win.setTimeout === 'function') win.setTimeout(function () { try { U.revokeObjectURL(url); } catch (e) { /* já foi */ } }, 1000);
        return true;
      } catch (e) { return false; }
    }
    function lerArquivo(win, f) {
      if (f && typeof f.text === 'function') { try { return Promise.resolve(f.text()); } catch (e) { return Promise.reject(e); } }
      return new Promise(function (ok, falha) {
        try {
          var r = new win.FileReader();
          r.onload = function () { ok(str(r.result)); };
          r.onerror = function () { falha(r.error); };
          r.readAsText(f);
        } catch (e) { falha(e); }
      });
    }
    // o export de uma ficha (ou o texto cru, se ela não vira v3 aqui)
    function exportDe(a, id) {
      var ex = a.exportar(id);
      if (ex) return ex;
      var cru = a.exportarCru(id);
      return cru ? { nomeArquivo: cru.nomeArquivo, texto: cru.texto } : null;
    }
    function linhaDe(a, id) { return a.listar().filter(function (x) { return x.id === id; })[0] || null; }
    function nomeDe(a, id) { return '"' + nomeFicha(linhaDe(a, id)) + '"'; }
    function aviso(t) { return { tipo: 'aviso', texto: t }; }
    function ok(t) { return { tipo: 'ok', texto: t }; }
    function visivel(el) {
      if (!el || el.hidden) return false;
      try { return typeof el.getClientRects !== 'function' || el.getClientRects().length > 0; } catch (e) { return true; }
    }

    // ---------------- o seletor (um por lugar) ----------------
    // op: {win, doc, cont (o contêiner), prefixo ('fp' | 'fd'), densidade,
    //      dados: () => Promise<{dados, versao}> (os do KhPrevia.carregar, para
    //      migrar ao entrar e resolver o import pelo catálogo)}
    function criar(op) {
      op = obj(op) ? op : {};
      var win = op.win, doc = op.doc || (win && win.document), cont = op.cont;
      if (!win || !doc || !cont || !KhEnsaio) return null;
      var P = /^[a-z][a-z0-9-]*$/i.test(str(op.prefixo)) ? str(op.prefixo) : 'ke';
      var dens = op.densidade === 'compacta' ? 'compacta' : 'pagina';
      var ss = storage(win, 'sessionStorage'), ls = storage(win, 'localStorage');
      var R = KhRedesenho ? KhRedesenho.criar({ prefixo: P + '-ke' }) : null;
      var st = { dialogo: null, msg: null, nome: '' };

      function motor() {
        var p = null;
        try { p = typeof op.dados === 'function' ? op.dados() : null; } catch (e) { p = null; }
        return p && typeof p.then === 'function' ? p.then(function (m) { return obj(m) ? m : {}; }, function () { return {}; }) : Promise.resolve(obj(p) ? p : {});
      }
      function arm() { return KhEnsaio.armazem(ss); }
      function ligado() { return KhEnsaio.ligado(win); }
      function estado() {
        var a = arm();
        return { fichas: a.listar(), ativa: a.ativa(), uso: KhEnsaio.uso(ss), dialogo: st.dialogo, msg: st.msg, nome: st.nome };
      }
      function troca(h) {
        if (R) R.trocaHTML(doc, cont, h, null, null, win);
        else if (cont._keHtml !== h) { cont.innerHTML = h; cont._keHtml = h; }
      }
      function foca(sel) {
        var x = sel && cont.querySelector ? cont.querySelector(sel) : null;
        if (x && typeof x.focus === 'function') { try { x.focus({ preventScroll: true }); } catch (e) { x.focus(); } }
      }
      // fora do ensaio, o contêiner some (fica só a mensagem de um entrar que falhou)
      function desenha(foco) {
        if (!ligado()) {
          st.dialogo = null;
          var h = st.msg ? '<p class="ke-msg ke-msg-' + (st.msg.tipo === 'aviso' ? 'aviso' : 'ok') + '" role="status" aria-live="polite">' + esc(st.msg.texto) + '</p>' : '';
          troca(h);
          cont.hidden = !h;
          return false;
        }
        troca(htmlSeletor(estado(), { prefixo: P, densidade: dens }));
        cont.hidden = false;
        if (foco) foca(foco);
        return true;
      }
      // o fim de uma ação que gravou: avisa quem escuta e redesenha
      function feito(r, texto, partes, foco) {
        if (r && r.ok) {
          st.dialogo = null;
          st.msg = texto ? ok(texto) : null;
          KhEnsaio.emitir(win, partes);
          desenha(foco);
          return true;
        }
        falhou(r);
        return false;
      }
      function falhou(r) {
        if (r && r.erro === 'quota') { st.dialogo = { tipo: 'quota', volta: '.ke-exportar-todas' }; st.msg = aviso(QUOTA); desenha('.ke-dialogo .ke-exportar-todas'); return; }
        st.msg = aviso(textoErro(r));
        desenha();
      }
      function importa(texto, extra) {
        return motor().then(function (m) {
          var a = arm();
          var r = a.importar(texto, Object.assign({}, KhEnsaio.opcoesMotor(m.dados, m.versao), extra || {}));
          if (!r.ok && r.erro === 'conflito') {
            var nomes = lista(r.conflitos).map(function (id) { return nomeDe(a, id); }).join(', ');
            st.dialogo = { tipo: 'conflito', texto: texto, conflitos: lista(r.conflitos).slice(), nome: nomes, volta: '.ke-importar' };
            st.msg = null;
            desenha('.ke-atualizar');
            return r;
          }
          if (r.ok) {
            var n = r.ids.length, ileg = lista(r.erros).length;
            feito(r, (n === 1 ? 'Importada e aberta: ' + nomeDe(a, r.ids[0]) : n + ' fichas importadas; aberta: ' + nomeDe(a, r.ids[n - 1])) + '.' +
              (ileg ? ' ' + ileg + ' ' + plural(ileg, 'ficha do arquivo não pôde ser lida', 'fichas do arquivo não puderam ser lidas') + '.' : ''),
              ['indice', 'ficha'], '.ke-lista');
            return r;
          }
          falhou(r);
          return r;
        });
      }
      var acoes = {
        criar: function () { st.dialogo = { tipo: 'criar', volta: '.ke-criar' }; st.nome = ''; st.msg = null; desenha('.ke-nome'); },
        cancelar: function () {
          var d = st.dialogo;
          st.dialogo = null; st.msg = null;
          desenha(d && d.volta ? d.volta : '.ke-lista');
        },
        duplicar: function () {
          var a = arm(), id = a.ativa();
          if (!id) return;
          var r = a.duplicar(id);
          feito(r, r.ok ? 'Cópia criada e aberta: ' + nomeDe(a, r.id) + '.' : '', ['indice', 'ficha'], '.ke-lista');
        },
        excluir: function () {
          var a = arm(), id = a.ativa();
          if (!id) return;
          var ex = exportDe(a, id);
          if (!ex) { st.msg = aviso(textoErro({ erro: 'inexistente' })); desenha(); return; }
          st.dialogo = { tipo: 'antes', acao: 'excluir', id: id, nome: nomeFicha(linhaDe(a, id)), arquivos: [ex], passo: 'baixar', salvou: false, volta: '.ke-excluir' };
          st.msg = null;
          desenha('.ke-baixar-antes');
        },
        'baixar-antes': function () {
          var d = st.dialogo;
          if (!d || d.tipo !== 'antes') return;
          var todos = lista(d.arquivos).every(function (x) { return baixar(win, x); });
          if (!todos) { st.msg = aviso('O navegador não deixou baixar: nada foi apagado nem substituído.'); desenha(); return; }
          d.passo = 'confirmar';
          d.salvou = false;
          st.msg = ok('Baixado: ' + arquivosTxt(d.arquivos) + '.');
          desenha('.ke-salvei');
        },
        confirmar: function () {
          var d = st.dialogo;
          if (!d || d.tipo !== 'antes' || d.passo !== 'confirmar') return;
          if (!d.salvou) { st.msg = aviso('Marque "Salvei" antes de confirmar.'); desenha('.ke-salvei'); return; }
          // o armazém só apaga ou substitui com o export confirmado: a resposta é a do jogador
          var sim = function () { return d.salvou === true; };
          if (d.acao === 'excluir') {
            var a = arm(), r = a.excluir(d.id, { exportar: sim, exportarCru: sim });
            feito(r, r.ok ? 'Ficha "' + d.nome + '" excluída do ensaio.' + (r.ativa ? ' Aberta: ' + nomeDe(a, r.ativa) + '.' : ' O ensaio ficou sem fichas.') : '',
              ['indice', 'ficha'], '.ke-lista');
          } else importa(d.texto, { conflito: 'atualizar', exportar: sim });
        },
        exportar: function () {
          var a = arm(), id = a.ativa();
          if (!id) return;
          var ex = exportDe(a, id);
          st.msg = ex && baixar(win, ex) ? ok('Baixado: ' + ex.nomeArquivo + '.') : aviso('Não deu para baixar a ficha.');
          desenha();
        },
        'exportar-todas': function () {
          var p = arm().exportarTodas();
          var n = p.dados.fichas.length, ileg = lista(p.dados.ilegiveis).length;
          if (!n && !ileg) { st.msg = aviso('O ensaio está sem fichas: nada a exportar.'); desenha(); return; }
          var b = baixar(win, p);
          if (b && st.dialogo && st.dialogo.tipo === 'quota') st.dialogo = null;
          st.msg = b ? ok('Baixado: ' + p.nomeArquivo + ' (' + n + ' ' + plural(n, 'ficha', 'fichas') +
            (ileg ? ', mais ' + ileg + ' ' + plural(ileg, 'ilegível, crua', 'ilegíveis, cruas') : '') + ').') : aviso('Não deu para baixar o pacote.');
          desenha();
        },
        importar: function () {
          var inp = cont.querySelector('.ke-arquivo');
          if (!inp) return;
          try { inp.value = ''; } catch (e) { /* o mesmo arquivo de novo */ }
          if (typeof inp.click === 'function') inp.click();
        },
        atualizar: function () {
          var d = st.dialogo;
          if (!d || d.tipo !== 'conflito') return;
          var a = arm();
          var arqs = d.conflitos.map(function (id) { return exportDe(a, id); }).filter(Boolean);
          st.dialogo = { tipo: 'antes', acao: 'atualizar', texto: d.texto, nome: d.nome, arquivos: arqs, passo: 'baixar', salvou: false, volta: '.ke-importar' };
          st.msg = null;
          desenha('.ke-baixar-antes');
        },
        copia: function () {
          var d = st.dialogo;
          if (!d || d.tipo !== 'conflito') return;
          importa(d.texto, { conflito: 'copia' });
        }
      };

      cont.addEventListener('click', function (e) {
        var b = e.target && e.target.closest ? e.target.closest('[data-ke]') : null;
        if (!b || !cont.contains(b) || b.hasAttribute('disabled')) return;
        var f = acoes[b.getAttribute('data-ke')];
        if (f) f();
      });
      cont.addEventListener('change', function (e) {
        var t = e.target;
        var c = t && t.getAttribute ? t.getAttribute('data-ke-campo') : null;
        if (c === 'trocar') {
          var r = arm().trocar(str(t.value));
          feito(r, '', ['ficha'], '.ke-lista');
        } else if (c === 'salvei') {
          if (st.dialogo && st.dialogo.tipo === 'antes') { st.dialogo.salvou = !!t.checked; desenha('.ke-salvei'); }
        } else if (c === 'arquivo') {
          var f = t.files && t.files[0];
          if (!f) return;
          lerArquivo(win, f).then(function (txt) { return importa(txt); }, function () { st.msg = aviso('Não deu para ler o arquivo.'); desenha(); });
        }
      });
      cont.addEventListener('input', function (e) {
        var t = e.target;
        if (t && t.getAttribute && t.getAttribute('data-ke-campo') === 'nome') st.nome = str(t.value);
      });
      cont.addEventListener('submit', function (e) {
        var f = e.target;
        if (!f || !f.getAttribute || f.getAttribute('data-ke-form') !== 'criar') return;
        if (e.preventDefault) e.preventDefault();
        var inp = cont.querySelector('.ke-nome');
        var nome = semEmoji(inp && inp.value != null ? inp.value : st.nome) || NOME_NOVA;
        var r = arm().criar({ nome: nome });
        st.nome = '';
        feito(r, r.ok ? 'Ficha "' + nome + '" criada e aberta.' : '', ['indice', 'ficha'], '.ke-lista');
      });
      // Esc fecha o diálogo aberto (antes de o drawer recolher)
      var T = win.KhTeclas;
      if (T && typeof T.camadaEsc === 'function') {
        T.camadaEsc(CAMADA_ESC, function () {
          if (!st.dialogo || !visivel(cont)) return false;
          acoes.cancelar();
          return true;
        });
      }
      doc.addEventListener(KhEnsaio.EVENTO, function () { desenha(); });

      // liga o ensaio (o botão "Ensaiar edição" da página e do drawer): espera
      // os dados do motor (migrar a ficha atual precisa do catálogo)
      function entrar() {
        if (ligado()) return Promise.resolve({ ok: true, criada: null });
        if (!ss) { st.msg = aviso(SEM_STORAGE); desenha(); return Promise.resolve({ ok: false, erro: 'storage' }); }
        st.msg = ok('Preparando o ensaio…');
        desenha();
        return motor().then(function (m) {
          var r = KhEnsaio.entrar(ss, ls, { dados: m.dados, versao: m.versao });
          if (!r.ok) { st.msg = aviso(r.erro === 'storage' ? SEM_STORAGE : textoErro(r)); desenha(); return r; }
          st.msg = ok(r.criada === 'migrada' ? 'Ensaio ligado: a ficha do ensaio é uma cópia da sua ficha atual, migrada em memória.'
            : r.criada === 'branco' ? 'Ensaio ligado com uma ficha em branco (' + (r.erroV2 ? 'a ficha atual não pôde ser lida' : 'não há ficha atual neste navegador') + ').'
              : 'Ensaio ligado.');
          KhEnsaio.emitir(win, ['ligado', 'indice', 'ficha']);
          desenha('.ke-lista');
          return r;
        });
      }

      desenha();
      return { desenha: desenha, entrar: entrar, ligado: ligado, importar: importa,
        acao: function (nome) { if (typeof acoes[nome] === 'function') acoes[nome](); },
        estado: function () { return JSON.parse(JSON.stringify(st)); } };
    }

    // ---------------- a faixa (toda página com a prévia) ----------------
    // Quem liga é quem monta com a prévia: o drawer da ficha nova (todas as
    // páginas menos a da ficha) e a página da ficha. Uma por página; chamar de
    // novo só sincroniza. null sem DOM.
    var faixa = null;
    function ligarFaixa(win) {
      if (!win || !win.document || !KhEnsaio) return null;
      if (faixa) { faixa.sincroniza(); return faixa; }
      try { faixa = montarFaixa(win); } catch (e) { faixa = null; }
      return faixa;
    }
    function montarFaixa(win) {
      var doc = win.document, html = doc.documentElement;
      if (!doc.body || !html) return null;
      var ss = storage(win, 'sessionStorage');
      var st = { sair: false, msg: null }, el = null;
      function pinta(foco) {
        if (!el) return;
        var h = htmlFaixa({ sair: st.sair, msg: st.msg, n: KhEnsaio.armazem(ss).listar().length });
        if (el._keHtml !== h) { el.innerHTML = h; el._keHtml = h; }
        var x = foco ? el.querySelector(foco) : null;
        if (x && typeof x.focus === 'function') { try { x.focus({ preventScroll: true }); } catch (e) { x.focus(); } }
      }
      function sincroniza() {
        if (!KhEnsaio.ligado(win)) {
          tira(el);
          el = null; st.sair = false; st.msg = null;
          if (html.hasAttribute(ATRIBUTO)) html.removeAttribute(ATRIBUTO);
          return false;
        }
        poeCss(win);
        if (!el) {
          el = doc.createElement('div');
          el.id = ID_FAIXA;
          el.className = 'ke-faixa';
          el.setAttribute('role', 'region');
          el.setAttribute('aria-label', 'Modo Ensaio');
          // o MutationObserver da v2.1 (decoração dos cards) ignora o que redesenha aqui
          el.setAttribute('data-kf-ignorar', '');
          el.addEventListener('click', aoClicar);
          doc.body.appendChild(el);
        }
        if (!html.hasAttribute(ATRIBUTO)) html.setAttribute(ATRIBUTO, '');
        pinta();
        return true;
      }
      function aoClicar(e) {
        var b = e.target && e.target.closest ? e.target.closest('[data-ke]') : null;
        if (!b || !el || !el.contains(b)) return;
        var a = b.getAttribute('data-ke');
        if (a === 'exportar-ensaio') {
          var p = KhEnsaio.exportarEnsaio(ss), n = p.dados.fichas.length;
          if (!n && !lista(p.dados.ilegiveis).length) st.msg = aviso('O ensaio está sem fichas: nada a exportar.');
          else st.msg = baixar(win, p) ? ok('Baixado: ' + p.nomeArquivo + ' (' + n + ' ' + plural(n, 'ficha', 'fichas') + ').') : aviso('Não deu para baixar o ensaio.');
          pinta();
        } else if (a === 'sair') { st.sair = true; st.msg = null; pinta('.ke-sair-nao'); }
        else if (a === 'sair-nao') { st.sair = false; pinta('.ke-sair'); }
        else if (a === 'sair-ok') {
          KhEnsaio.sair(ss);
          KhEnsaio.emitir(win, ['ligado', 'indice', 'ficha']);
          sincroniza();
        }
      }
      var T = win.KhTeclas;
      if (T && typeof T.camadaEsc === 'function') {
        T.camadaEsc(CAMADA_ESC, function () {
          if (!el || !st.sair) return false;
          st.sair = false;
          pinta('.ke-sair');
          return true;
        });
      }
      doc.addEventListener(KhEnsaio.EVENTO, sincroniza);
      sincroniza();
      return { sincroniza: sincroniza, el: function () { return el; } };
    }

    return { CAMADA_ESC: CAMADA_ESC, ID_FAIXA: ID_FAIXA, CSS: CSS, ATRIBUTO: ATRIBUTO, FAIXA_TXT: FAIXA_TXT,
      NOME_VAZIO: NOME_VAZIO, NOME_NOVA: NOME_NOVA, QUOTA: QUOTA, SEM_STORAGE: SEM_STORAGE,
      fmtBytes: fmtBytes, fmtData: fmtData, rotuloFicha: rotuloFicha, textoErro: textoErro,
      htmlSeletor: htmlSeletor, htmlFaixa: htmlFaixa, baseVersao: baseVersao, baixar: baixar,
      criar: criar, ligarFaixa: ligarFaixa, faixa: function () { return faixa; } };
  })();

  if (emNode) { module.exports = KhSeletor; return; }
  raiz.KhSeletor = KhSeletor;
})(typeof window !== 'undefined' ? window : this);
