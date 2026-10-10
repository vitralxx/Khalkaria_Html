/* Khalkaria — Ficha · KhEnsaio: o modo Ensaio da ficha nova (F4.6a), SÓ COM A PRÉVIA.
 * Especificação: docs/ficha-digital/07-f4-6-ensaio.md §1 (base: plano 02 §3.1, D36).
 *
 * O problema: as telas de escrita da ficha nova (seletor, edição, ajuste,
 * levar) precisam ser vistas e testadas antes da virada (F4.7), e até lá nada
 * pode gravar nas chaves da ficha dos jogadores (khalkaria_ficha,
 * khalkaria_fichas_v3, khalkaria_ficha_v3:*, khalkaria_ficha_v3_log:*,
 * khalkaria_ficha_v3_sessao:*, khalkaria_ficha_dono).
 *
 * A solução: o armazém v3 de verdade (KhEstado.armazem, o mesmo que a virada
 * liga sobre o localStorage) roda sobre um ADAPTADOR de armazenamento que grava
 * no sessionStorage da aba, com o prefixo 'khalkaria_ensaio:' em toda chave
 * (prefixado). O armazém não sabe: lê e escreve 'khalkaria_fichas_v3', e a
 * chave de verdade é 'khalkaria_ensaio:khalkaria_fichas_v3'. A ativa da aba
 * (khalkaria_ficha_ativa) vai pelo mesmo adaptador. As chaves reais nunca são
 * tocadas: a ficha atual só é LIDA (fichaInicial, por um invólucro só-leitura).
 *
 *   ligado(win)          o ensaio está ligado nesta aba? (a marca
 *                        sessionStorage.khalkaria_ensaio_ligado === '1' E a prévia)
 *   armazem(ss, op)      o KhEstado.armazem sobre o adaptador
 *   entrar(ss, ls, op)   liga; na 1ª vez, a ficha atual migrada EM MEMÓRIA
 *                        (migrarV2paraV3, pelo KhEstado.sombra) ou, sem ela, uma
 *                        ficha em branco
 *   sair(ss)             apaga SÓ as chaves com o prefixo e a marca
 *   calcular(ss, dados)  a ficha ativa do ensaio calculada pelo motor (o
 *                        resultado tem a forma do KhPrevia.calcular)
 *   uso(ss)              quanto o ensaio ocupa (o sessionStorage tem ~5 MB por aba)
 *   exportarEnsaio(ss)   o pacote fichas/1 com todas as fichas do ensaio
 *   emitir(win, partes)  o evento 'kh:ensaio' no document, {detail:{partes}}:
 *                        'ligado' (entrou ou saiu), 'indice' (a lista de fichas
 *                        mudou), 'ficha' (a ativa mudou ou foi regravada)
 *
 * A ficha do ensaio vale enquanto a aba estiver aberta, em todas as páginas
 * dessa aba (sessionStorage); fechar a aba ou "Sair do ensaio" apaga tudo. Na
 * virada, a mesma interface passa a usar o armazém real: muda só o storage
 * por baixo.
 *
 * Puro sobre os storages injetados (testado no node: tools/testes/ensaio.test.js);
 * a interface (seletor, faixa) é do KhSeletor (js/ficha/kh-seletor.js). No node
 * exporta por module.exports (carregado sozinho); no artefato js/ficha.js o
 * export já é o KhInv e este módulo só registra window.KhEnsaio no navegador.
 * Vem no ORDEM depois do kh-previa.js (usa o KhEstado, o KhRegras e o KhPrevia).
 * Fonte: js/ficha/kh-ensaio.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhEstado = emNode ? require('./kh-estado.js') : raiz.KhEstado;
  var KhRegras = emNode ? require('./kh-regras.js') : raiz.KhRegras;
  var KhPrevia = emNode ? require('./kh-previa.js') : raiz.KhPrevia;

  var KhEnsaio = (function () {
    var PREFIXO = 'khalkaria_ensaio:';
    var CHAVE_LIGADO = 'khalkaria_ensaio_ligado';
    var EVENTO = 'kh:ensaio';
    var NOME_PACOTE = 'khalkaria-ensaio.json';
    // o sessionStorage tem a mesma ordem de grandeza do localStorage (~5 MB por origem)
    var LIMITE = KhEstado ? KhEstado.LIMITE_QUOTA : 5 * 1024 * 1024;

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function storage(win, nome) { try { return win ? win[nome] || null : null; } catch (e) { return null; } }
    function janela() { return typeof window !== 'undefined' ? window : null; }
    function ehQuota(e) {
      return !!e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22 || e.code === 1014);
    }

    // ---------------- o adaptador ----------------
    // Um Storage (getItem, setItem, removeItem, key, length, clear) sobre base,
    // em que toda chave ganha o prefixo. key/length enumeram SÓ as chaves com o
    // prefixo (sem ele): o armazém, a limpeza de quota e o uso do KhEstado veem
    // só o ensaio. O erro do base (QuotaExceeded, storage bloqueado) passa reto.
    function prefixado(base, prefixo) {
      var P = typeof prefixo === 'string' && prefixo ? prefixo : PREFIXO;
      function nossas() {
        var out = [], n = 0;
        if (!base) return out;
        try { n = base.length; } catch (e) { n = 0; }
        for (var i = 0; i < n; i++) {
          var k = null;
          try { k = base.key(i); } catch (e) { k = null; }
          if (k != null && k.indexOf(P) === 0) out.push(k.slice(P.length));
        }
        return out;
      }
      var a = {
        prefixo: P,
        getItem: function (k) { return base ? base.getItem(P + k) : null; },
        setItem: function (k, v) {
          if (!base) { var e = new Error('sem sessionStorage'); e.name = 'SecurityError'; throw e; }
          base.setItem(P + k, String(v));
        },
        removeItem: function (k) { if (base) base.removeItem(P + k); },
        key: function (i) { var l = nossas(); return i >= 0 && i < l.length ? l[i] : null; },
        clear: function () { nossas().forEach(function (k) { base.removeItem(P + k); }); },
        chaves: nossas
      };
      Object.defineProperty(a, 'length', { get: function () { return nossas().length; }, enumerable: true });
      return a;
    }
    // só getItem (e erro engolido): a ficha atual é LIDA, nunca escrita
    function soLeitura(ls) {
      return { getItem: function (k) { try { return ls ? ls.getItem(k) : null; } catch (e) { return null; } } };
    }

    // ---------------- ligado ----------------
    function marcado(ss) { try { return !!ss && ss.getItem(CHAVE_LIGADO) === '1'; } catch (e) { return false; } }
    // a prévia ligada (a regra do KhPrevia.ativacao e do head-boot), sem gravar nada
    function previaAtiva(win) {
      if (!win || !KhPrevia) return false;
      var search = '';
      try { search = win.location ? str(win.location.search) : ''; } catch (e) { search = ''; }
      try { return !!KhPrevia.ativacao(search, storage(win, 'localStorage')).ativa; } catch (e) { return false; }
    }
    // o ensaio está ligado nesta aba: a marca E a prévia (sem a prévia, nada do ensaio aparece)
    function ligado(win) {
      win = win || janela();
      if (!win) return false;
      return marcado(storage(win, 'sessionStorage')) && previaAtiva(win);
    }

    // ---------------- o armazém do ensaio ----------------
    // o KhEstado.armazem de verdade sobre o adaptador (a ativa da aba também)
    function armazem(ss, opcoes) {
      var a = prefixado(ss);
      return KhEstado.armazem(a, a, opcoes || {});
    }

    // o motor: o índice do catálogo (os arquivos do KhPrevia.carregar) e o
    // calculado que poda os ajustes migrados (os mesmos do KhPrevia.calcular)
    function temCatalogo(dados) {
      return !!dados && (lista(dados.catalogos).length > 0 || lista(dados.classes).length > 0 || lista(dados.racas).length > 0);
    }
    function indice(dados, versao) {
      return temCatalogo(dados) ? KhEstado.indiceCatalogo(KhEstado.entradasDeCatalogo(dados), str(versao)) : null;
    }
    function efeitosDe(dados) { return dados && dados.efeitos ? (dados.efeitos.porId || dados.efeitos) : null; }
    function opcoesMotor(dados, versao) {
      var ef = efeitosDe(dados);
      return { catalogo: indice(dados, versao),
        calculado: function (f) { return KhRegras.calculados(f, { efeitos: ef }); } };
    }

    // A ficha com que o ensaio nasce: a ficha atual (khalkaria_ficha) migrada
    // EM MEMÓRIA, ou null (sem ficha atual, ou ilegível: a em branco).
    // -> {ficha|null, origem:'migrada'|'branco', avisos, erro?}
    function fichaInicial(ls, dados, versao, opcoes) {
      var o = Object.assign({}, opcoes || {}, opcoesMotor(dados, versao));
      var r = null;
      try { r = KhEstado.sombra(soLeitura(ls), o); } catch (e) { r = { erro: 'falha' }; }
      if (!r) return { ficha: null, origem: 'branco', avisos: [] };
      if (r.erro) return { ficha: null, origem: 'branco', avisos: [], erro: str(r.erro) };
      return { ficha: r.ficha, origem: 'migrada', avisos: lista(r.avisos) };
    }

    // ---------------- entrar e sair ----------------
    // Liga o ensaio nesta aba. Na 1ª vez (o ensaio sem ficha), põe nele a
    // ficha inicial; se já tem fichas (outra página da aba), só liga.
    // op: {dados, versao (os do KhPrevia.carregar), agora, aleatorio (testes)}
    // -> {ok, criada:'migrada'|'branco'|null, id, avisos, erroV2} | {ok:false, erro, sugestao?}
    // Escreve SÓ chaves com o prefixo e a marca; se falhar no meio, apaga o que escreveu.
    function entrar(ss, ls, op) {
      op = op || {};
      if (!ss) return { ok: false, erro: 'storage' };
      var arm = armazem(ss, op);
      var tinha = arm.listar().length > 0;
      var out = { ok: true, criada: null, id: null, avisos: [], erroV2: null };
      if (!tinha) {
        var ini = fichaInicial(ls, op.dados, op.versao, op);
        var r = ini.ficha ? arm.importar(ini.ficha, opcoesMotor(op.dados, op.versao)) : arm.criar({});
        if (!r.ok) { limpa(ss); return { ok: false, erro: r.erro, sugestao: r.sugestao }; }
        out.criada = ini.ficha ? 'migrada' : 'branco';
        out.avisos = ini.avisos;
        out.erroV2 = ini.erro || null;
        out.id = r.id || (r.ids && r.ids[0]) || null;
      } else out.id = arm.ativa();
      try { ss.setItem(CHAVE_LIGADO, '1'); } catch (e) {
        if (!tinha) limpa(ss);
        return { ok: false, erro: ehQuota(e) ? 'quota' : 'storage' };
      }
      return out;
    }
    // apaga as chaves com o prefixo (a lista antes: apagar muda os índices)
    function limpa(ss) {
      var fora = [];
      prefixado(ss).chaves().forEach(function (k) {
        try { ss.removeItem(PREFIXO + k); fora.push(PREFIXO + k); } catch (e) { /* storage bloqueado */ }
      });
      return fora;
    }
    // "Sair do ensaio": SÓ as chaves com o prefixo e a marca (as que existem)
    function sair(ss) {
      if (!ss) return { ok: true, apagadas: [] };
      var apagadas = limpa(ss);
      try {
        if (ss.getItem(CHAVE_LIGADO) != null) { ss.removeItem(CHAVE_LIGADO); apagadas.push(CHAVE_LIGADO); }
      } catch (e) { /* idem */ }
      return { ok: true, apagadas: apagadas };
    }

    // ---------------- leitura ----------------
    // Os avisos de entrada órfã que a migração deu (o mesmo texto do
    // migrarV2paraV3), tirados da própria ficha: a entrada guarda o orfao e o
    // migradoDe. Assim a ficha do ensaio, logo ao entrar, mostra os mesmos
    // avisos que a sombra da ficha atual.
    function avisosDaFicha(f) {
      var out = [];
      lista(f && f.entradas).forEach(function (e) {
        if (!obj(e) || !obj(e.orfao) || !obj(e.migradoDe)) return;
        out.push({ tipo: 'orfa', ref: str(e.migradoDe.tipo) + ':' + str(e.migradoDe.id), motivo: e.orfao.motivo });
      });
      return out;
    }
    // A ficha ativa do ensaio calculada pelo motor. O resultado tem a forma do
    // KhPrevia.calcular (a página e o drawer desenham igual), com ensaio:true e
    // o id da ficha. Só LÊ.
    function calcular(ss, dados, versao) {
      dados = dados || {};
      var erros = lista(dados.erros);
      try {
        var arm = armazem(ss);
        var id = arm.ativa();
        if (!id) return { estado: 'sem-ficha', ensaio: true, erros: erros };
        var f = arm.ler(id);
        if (!f) return { estado: 'erro', erro: 'ilegivel', ensaio: true, erros: erros };
        var ef = efeitosDe(dados);
        var av = KhRegras.avaliar(f, { efeitos: ef });
        return { estado: 'ok', ficha: f, de: str(f.schemaVersion), avisosMigracao: avisosDaFicha(f), av: av,
          semCatalogo: !temCatalogo(dados), semEfeitos: !ef, erros: erros, ensaio: true, fichaId: id };
      } catch (e) {
        return { estado: 'falha', erro: str(e && e.message), ensaio: true, erros: erros };
      }
    }

    // Quanto o ensaio ocupa (bytes: chave + valor, 2 por caractere, como o
    // KhEstado.uso) e quanto a aba toda ocupa do sessionStorage (a quota é dele).
    function uso(ss) {
      var bytes = 0, total = 0, n = 0;
      try { n = ss ? ss.length : 0; } catch (e) { n = 0; }
      for (var i = 0; i < n; i++) {
        var k = null, v = '';
        try { k = ss.key(i); v = str(ss.getItem(k)); } catch (e) { k = null; }
        if (k == null) continue;
        var b = (k.length + v.length) * 2;
        total += b;
        if (k.indexOf(PREFIXO) === 0 || k === CHAVE_LIGADO) bytes += b;
      }
      return { bytes: bytes, total: total, limite: LIMITE, fracao: total / LIMITE };
    }

    // "Exportar ensaio": o pacote fichas/1 com todas as fichas do ensaio
    function exportarEnsaio(ss) {
      var p = armazem(ss).exportarTodas();
      p.nomeArquivo = NOME_PACOTE;
      return p;
    }

    // o evento 'kh:ensaio' no document; false sem DOM
    function emitir(win, partes) {
      win = win || janela();
      var doc = win && win.document;
      if (!doc || typeof doc.dispatchEvent !== 'function') return false;
      var detail = { partes: lista(partes).slice() }, ev = null;
      try { if (typeof win.CustomEvent === 'function') ev = new win.CustomEvent(EVENTO, { detail: detail }); } catch (e) { ev = null; }
      if (!ev) {
        try { ev = doc.createEvent('CustomEvent'); ev.initCustomEvent(EVENTO, false, false, detail); } catch (e) { ev = null; }
      }
      if (!ev) return false;
      try { doc.dispatchEvent(ev); } catch (e) { return false; }
      return true;
    }

    return { PREFIXO: PREFIXO, CHAVE_LIGADO: CHAVE_LIGADO, EVENTO: EVENTO, NOME_PACOTE: NOME_PACOTE, LIMITE: LIMITE,
      prefixado: prefixado, soLeitura: soLeitura, marcado: marcado, previaAtiva: previaAtiva, ligado: ligado,
      armazem: armazem, indice: indice, opcoesMotor: opcoesMotor, fichaInicial: fichaInicial, avisosDaFicha: avisosDaFicha,
      entrar: entrar, sair: sair, calcular: calcular, uso: uso, exportarEnsaio: exportarEnsaio, emitir: emitir,
      ehQuota: ehQuota };
  })();

  if (emNode) { module.exports = KhEnsaio; return; }
  raiz.KhEnsaio = KhEnsaio;
})(typeof window !== 'undefined' ? window : this);
