/* Khalkaria — Ficha · KhRegras: motor de regras da ficha (PURO, F3b).
 * (ficha v3, KhRegrasDados, Mods do KhEfeitos, ajustes) -> um NÓ por número derivado:
 *   {caminho, rotulo, valor, calculado, ajuste, termos:[{rotulo, fonte:{tipo,id,nome},
 *    op, valor, ativo, motivo, status}], formula:{simbolica, numerica}, status, selos,
 *    avisos, lembretes}
 * A fórmula é o texto do tooltip que o Pedro pediu ("quero tudo que tenha cálculos
 * com tooltip mostrando a fórmula"): simbólica "10 + Vitalidade × Nível + Mod.CON ×
 * Nível" e numérica "= 10 + 6 × 3 + 2 × 3 = 34".
 *
 * O grafo é avaliado em ORDEM TOPOLÓGICA (Kahn sobre as dependências declaradas);
 * ao fechar cada nó o KhAjustes aplica o ajuste manual daquele caminho, antes que
 * os dependentes o leiam (M2). Termo não canônico nunca entra calado: leva o status
 * do contrato, e o nó junta os selos (plano §3.2).
 *
 * Fórmulas vêm como AST do js/ficha/00-regras-dados.js (tools/gerar_regras_ficha.py):
 * nada aqui faz eval. MODO SOMBRA (F3): só calcula em memória; nada grava.
 *
 * No node exporta por module.exports (carregado sozinho); no artefato js/ficha.js
 * o export já é o KhInv e este módulo só registra window.KhRegras no navegador.
 * Fonte: js/ficha/kh-regras.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhInv = emNode ? require('./kh-inv.js') : raiz.KhInv;
  var KhEfeitos = emNode ? require('./kh-efeitos.js') : raiz.KhEfeitos;
  var KhAjustes = emNode ? require('./kh-ajustes.js') : raiz.KhAjustes;
  function dadosPadrao() { return (raiz && raiz.KhRegrasDados) || (emNode ? require('./00-regras-dados.js') : null); }

  var KhRegras = (function () {
    var ATRIBUTOS = ['FOR', 'DES', 'CON', 'INT', 'SAB'];
    var TIPOS_DANO = ['cortante', 'contundente', 'perfurante', 'fogo', 'frio', 'eletrico',
      'veneno', 'acido', 'psiquico', 'radiante', 'trovejante', 'necrotico', 'forca', 'primordial'];
    var CATEGORIAS_AE = ['ordinario', 'elemental', 'biologico', 'mistico'];
    var NOME_TIPO = { cortante: 'Cortante', contundente: 'Contundente', perfurante: 'Perfurante', fogo: 'Fogo',
      frio: 'Frio', eletrico: 'Elétrico', veneno: 'Veneno', acido: 'Ácido', psiquico: 'Psíquico', radiante: 'Radiante',
      trovejante: 'Trovejante', necrotico: 'Necrótico', forca: 'Força', primordial: 'Primordial',
      ordinario: 'Ordinário', elemental: 'Elemental', biologico: 'Biológico', mistico: 'Místico', todos: 'Todos' };
    var NOME_INT = { contida: 'Contida', normal: 'Normal', forcada: 'Forçada', transbordante: 'Transbordante' };
    var COEF = { saude: 'V', stamina: 'G', eter: 'R' };
    var NOME_COEF = { V: 'Vitalidade', G: 'Vigor', R: 'Ressonância' };
    var NOME_REC = { saude: 'Saúde máx.', stamina: 'Stamina máx.', eter: 'Éter máx.', classe: 'Recurso de classe máx.' };
    var fmt = KhAjustes.fmt, textoDado = KhAjustes.textoDado;

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function inteiro(x, p) { var n = parseInt(x, 10); return isFinite(n) ? n : p; }
    function numero(x, p) { var n = parseFloat(x); return isFinite(n) ? n : p; }
    function chaveDe(id, pre) { return id && id.indexOf(pre) === 0 ? id.slice(pre.length) : null; }

    // ---------------- status ----------------
    function idxStatus(D, s) { var i = D.ordemStatus.indexOf(s); return i < 0 ? D.ordemStatus.length : i; }
    function pior(D, a, b) {
      if (!a || a === 'ajuste') return b || 'canonico';
      if (!b || b === 'ajuste') return a;
      return idxStatus(D, a) >= idxStatus(D, b) ? a : b;
    }

    // ---------------- AST ----------------
    // amb.ref(nome) -> {v, rot, fonte, st}; amb.escolha(noEsc, candidatos) -> índice ou null
    function aval(no, amb, D) {
      var r;
      switch (no.t) {
        case 'num':
          return { v: no.v, sim: fmt(no.v), num: numTxt(no.v), p: 3, st: no.st, fontes: [] };
        case 'ref':
          r = amb.ref(no.ref);
          return { v: r.v, sim: r.rot, num: numTxt(r.v), p: 3, st: pior(D, no.st, r.st), fontes: r.fonte ? [r.fonte] : [] };
        case 'neg':
          r = aval(no.a, amb, D);
          return { v: r.v == null ? null : -r.v, sim: '−' + par(r.sim, r.p, 2.5), num: '−' + par(r.num, r.p, 2.5),
            p: 2.5, st: pior(D, no.st, r.st), fontes: r.fontes };
        case 'op': {
          var a = aval(no.a, amb, D), b = aval(no.b, amb, D);
          var p = no.op === '+' || no.op === '-' ? 1 : 2;
          var v = a.v == null || b.v == null ? null
            : no.op === '+' ? a.v + b.v : no.op === '-' ? a.v - b.v : no.op === '*' ? a.v * b.v : a.v / b.v;
          var simb = { '+': ' + ', '-': ' − ', '*': ' × ', '/': ' / ' }[no.op];
          var dir = no.op === '-' || no.op === '/';
          var numB = par(b.num, b.p, p, dir);
          var numOp = simb;
          if (no.op === '+' && /^\(−/.test(numB)) { numOp = ' − '; numB = numB.slice(2, -1); }
          return { v: v, sim: par(a.sim, a.p, p) + simb + par(b.sim, b.p, p, dir),
            num: par(a.num, a.p, p) + numOp + numB, p: p, st: pior(D, no.st, pior(D, a.st, b.st)),
            fontes: a.fontes.concat(b.fontes) };
        }
        case 'fn': {
          var args = no.args.map(function (x) { return aval(x, amb, D); });
          var vs = args.map(function (x) { return x.v; });
          var nulo = vs.some(function (x) { return x == null; });
          var st = args.reduce(function (s, x) { return pior(D, s, x.st); }, no.st);
          var fo = args.reduce(function (l, x) { return l.concat(x.fontes); }, []);
          if (no.fn === 'floor') return { v: nulo ? null : Math.floor(vs[0] + 1e-9), sim: '⌊' + args[0].sim + '⌋',
            num: '⌊' + args[0].num + '⌋', p: 3, st: st, fontes: fo };
          var nome = no.fn === 'max' ? 'máx' : 'mín';
          return { v: nulo ? null : (no.fn === 'max' ? Math.max.apply(null, vs) : Math.min.apply(null, vs)),
            sim: nome + '(' + args.map(function (x) { return x.sim; }).join(', ') + ')',
            num: nome + '(' + args.map(function (x) { return x.num; }).join(', ') + ')', p: 3, st: st, fontes: fo };
        }
        case 'esc': {
          var cs = no.args.map(function (x) { return aval(x, amb, D); });
          var i = amb.escolha ? amb.escolha(no, cs) : null, trocado = i != null && cs[i];
          if (!trocado) {
            i = 0;
            cs.forEach(function (c, j) { if (c.v != null && (cs[i].v == null || c.v > cs[i].v)) i = j; });
          }
          var c = cs[i];
          return { v: c.v, sim: trocado ? c.sim + ' (escolhido)' : 'maior(' + cs.map(function (x) { return x.sim; }).join(', ') + ')',
            num: c.num, p: 3, st: pior(D, no.st, c.st), fontes: c.fontes, escolha: { i: i, trocado: !!trocado } };
        }
        default:
          throw new Error('KhRegras: nó de fórmula "' + no.t + '" sem avaliação aqui');
      }
    }
    // "= <conta> = <valor>", sem repetir quando a conta já é o valor
    function conta(num, v) { var fv = fmt(v); return num === fv || num === numTxt(v) ? '= ' + fv : '= ' + num + ' = ' + fv; }
    function numTxt(v) { return typeof v === 'number' && v < 0 ? '(' + fmt(v) + ')' : fmt(v); }
    function par(s, p, pai, direita) { return p < pai || (direita && p === pai) ? '(' + s + ')' : s; }
    // a soma do topo da AST vira termos (um por parcela)
    function parcelas(no, sinal, out) {
      if (no.t === 'op' && (no.op === '+' || no.op === '-')) {
        parcelas(no.a, sinal, out);
        parcelas(no.b, no.op === '-' ? -sinal : sinal, out);
      } else out.push({ no: no, sinal: sinal });
      return out;
    }
    function termosDaFormula(ast, amb, D) {
      return parcelas(ast, 1, []).map(function (x) {
        var r = aval(x.no, amb, D);
        return { rotulo: r.sim, fonte: r.fontes[0] || { tipo: 'regra', id: x.no.fo, nome: 'contrato' },
          op: x.no.t === 'op' || x.no.t === 'fn' || x.no.t === 'esc' || x.no.t === 'ref' || x.no.t === 'num' ? 'soma' : 'formula',
          valor: r.v == null ? null : x.sinal * r.v, ativo: true, motivo: r.escolha && r.escolha.trocado ? 'atributo trocado à mão (D7)' : '',
          status: r.st };
      });
    }

    // ---------------- nó ----------------
    function novoNo(caminho, rotulo) {
      return { caminho: caminho, rotulo: rotulo, valor: null, calculado: null, ajuste: null, termos: [],
        formula: { simbolica: '', numerica: '' }, status: 'canonico', selos: [], avisos: [], lembretes: [] };
    }
    function fechaStatus(no, D) {
      var st = 'canonico', selos = {};
      no.termos.forEach(function (t) {
        if (!t.ativo || t.status === 'ajuste') return;
        st = pior(D, st, t.status);
        var s = D.selos[t.status];
        if (s === undefined) s = D.selos.semStatus;
        if (s) selos[s] = true;
      });
      if (no.ajuste) selos.ajuste = true;
      no.status = st;
      no.selos = Object.keys(selos).sort();
      if (!no.formula.simbolica) no.formula.simbolica = no.rotulo;
      if (!no.formula.numerica) no.formula.numerica = '= ' + fmt(no.dado ? textoDado(no.dado) : no.valor);
      return no;
    }

    // ---------------- contexto ----------------
    function contexto(ficha, opcoes) {
      var D = opcoes.dados || dadosPadrao();
      if (!D) throw new Error('KhRegras: sem KhRegrasDados (js/ficha/00-regras-dados.js)');
      var efeitos = opcoes.efeitos === undefined ? null : opcoes.efeitos;
      if (efeitos && efeitos.porId) efeitos = efeitos.porId;
      var ef = KhEfeitos.coletar(ficha, { dados: D, efeitos: efeitos });
      var classeCh = chaveDe(ficha.identidade && ficha.identidade.classe && ficha.identidade.classe.id, 'classe-');
      var racaCh = chaveDe(ficha.identidade && ficha.identidade.raca && ficha.identidade.raca.id, 'raca-');
      var ctx = {
        ficha: ficha, D: D, ef: ef, efeitos: efeitos, nos: {}, avisos: ef.avisos.slice(),
        nivel: Math.max(1, Math.min(5, inteiro(ficha.meta && ficha.meta.nivel, 1))),
        classe: classeCh && D.classes[classeCh] ? D.classes[classeCh] : null,
        raca: racaCh && D.racas[racaCh] ? D.racas[racaCh] : null,
        escolhas: obj(ficha.identidade && ficha.identidade.escolhas) ? ficha.identidade.escolhas : {},
        sobrepeso: [], condicoes: ef.condicoes.slice()
      };
      ctx.v = function (c) { var n = ctx.nos[c]; return n ? n.valor : null; };
      // Mods do alvo (fora os ajustes, que o KhAjustes aplica no fechamento), já com os do Sobrepeso
      ctx.mods = function (alvos) {
        alvos = [].concat(alvos);
        return ef.mods.concat(ctx.sobrepeso).filter(function (m) { return !m.noFechamento && alvos.indexOf(m.alvo) >= 0; });
      };
      return ctx;
    }
    // valor numérico de um Mod: número × cópias, ou a AST com o X da condição
    function valorMod(m, ctx) {
      var v = m.valor;
      if (typeof v === 'number') return v * (m.copias || 1);
      if (obj(v) && v.t && v.t !== 'rolagem') {
        try {
          return aval(v, { ref: function (n) {
            if (n === 'X') return { v: m.x == null ? 1 : m.x, rot: 'X', st: 'canonico' };
            if (/^recurso\./.test(n)) return { v: ctx.v(n), rot: n, st: 'canonico' };
            return { v: null, rot: n, st: 'semStatus' };
          } }, ctx.D).v;
        } catch (e) { return null; }
      }
      return null;
    }
    function nomeFonte(m) { return m.fonte ? str(m.fonte.nome) || str(m.fonte.id) : 'fonte'; }
    // aceita: valores de 'condicao' (situacional) que valem neste nó
    function ativoPara(m, aceita) {
      if (!m.ativo) return { ativo: false, motivo: m.motivo };
      if (m.condicao && lista(aceita).indexOf(m.condicao) < 0) return { ativo: false, motivo: 'situacional: ' + m.condicao };
      return { ativo: true, motivo: m.motivo || '' };
    }
    // Soma os Mods 'soma' ao nó (termo + texto), devolve o total somado. Os
    // demais ops ficam para quem chama (vantagem, multiplica, fixa, lembretes).
    function somaMods(no, mods, ctx, aceita, txt) {
      var total = 0;
      mods.forEach(function (m) {
        if (m.op !== 'soma') return;
        var a = ativoPara(m, aceita), v = valorMod(m, ctx);
        if (v == null && a.ativo) { a = { ativo: false, motivo: 'valor não numérico (vai para o rolador na Mesa)' }; }
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: 'soma', valor: v == null ? m.valor : v,
          ativo: a.ativo, motivo: a.motivo, status: m.status || 'semStatus' });
        if (!a.ativo) return;
        total += v;
        if (txt) { txt.sim.push({ op: v < 0 ? ' − ' : ' + ', t: nomeFonte(m) }); txt.num.push({ op: v < 0 ? ' − ' : ' + ', t: fmt(Math.abs(v)) }); }
      });
      return total;
    }
    function junta(base, partes) { return partes.reduce(function (s, x) { return s + x.op + x.t; }, base); }
    function lembretes(no, mods, aceita) {
      mods.forEach(function (m) {
        if (['falhaAuto', 'semAcao', 'semReacao', 'lembrete'].indexOf(m.op) < 0 && !(m.op === 'fixa' && typeof m.valor !== 'number')) return;
        var a = ativoPara(m, aceita);
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: m.op, valor: m.valor, ativo: false,
          motivo: a.ativo ? 'lembrete: ' + m.op + (m.valor != null && typeof m.valor !== 'object' ? ' (' + m.valor + ')' : '') : a.motivo,
          status: m.status || 'semStatus' });
        if (a.ativo) no.lembretes.push({ op: m.op, alvo: m.alvo, valor: m.valor, fonte: m.fonte });
      });
    }

    // ---------------- testes (D81) ----------------
    // fontes: [{op:'vantagem'|'desvantagem', fonte}]; forcado: modo escolhido à mão
    function resolverTeste(fontes, forcado, dado) {
      var v = lista(fontes).filter(function (f) { return f.op === 'vantagem'; });
      var d = lista(fontes).filter(function (f) { return f.op === 'desvantagem'; });
      var auto = v.length && d.length ? 'normal' : v.length ? 'vantagem' : d.length ? 'desvantagem' : 'normal';
      var modo = forcado === 'vantagem' || forcado === 'desvantagem' || forcado === 'normal' ? forcado : auto;
      var die = dado || '1d20';
      var expr = modo === 'normal' ? die : (dado ? '2×' + die + (modo === 'vantagem' ? ', o maior' : ', o menor')
        : (modo === 'vantagem' ? '2d20kh1' : '2d20kl1'));
      var texto = forcado ? 'forçado à mão' : v.length && d.length ? 'vantagem e desvantagem se anulam (D81)'
        : (v.length > 1 || d.length > 1) ? 'não acumulam: vale uma só (D81)' : '';
      return { modo: modo, automatico: auto, expressao: expr, fontes: v.concat(d), anuladas: !!(v.length && d.length),
        texto: texto, criticoNoDadoUsado: true };
    }

    // ---------------- nós ----------------
    function noAtributoTotal(ctx, A) {
      var D = ctx.D, f = ctx.ficha, no = novoNo('atributo.' + A + '.total', D.atributos.nomes[A]);
      var at = f.atributos || {}, base = inteiro(at.base && at.base[A], 10);
      no.termos.push({ rotulo: at.migradoTotal ? 'Total digitado na v2 (migrado)' : 'Base', op: 'soma', valor: base, ativo: true,
        fonte: { tipo: 'ficha', id: 'atributos.base.' + A, nome: at.migradoTotal ? 'v2' : 'base' }, motivo: '', status: 'canonico' });
      var txt = { sim: [], num: [] };
      var mods = ctx.mods(['atributo.' + A, 'atributos']);
      var soma = somaMods(no, mods, ctx, [], txt);
      var total = base + soma;
      var sim = junta(at.migradoTotal ? 'Total migrado' : 'Base', txt.sim), num = junta(fmt(base), txt.num);
      mods.forEach(function (m) {
        if (m.op !== 'multiplica') return;
        var a = ativoPara(m, []), fator = valorMod(m, ctx);
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: 'multiplica', valor: fator, ativo: a.ativo, motivo: a.motivo, status: m.status });
        if (!a.ativo || fator == null) return;
        total = Math.floor(total * fator + 1e-9);
        sim = '⌊(' + sim + ') × ' + nomeFonte(m) + '⌋'; num = '⌊(' + num + ') × ' + fmt(fator) + '⌋';
      });
      // escolhas pendentes da raça/carta (atributo.?) ficam na trilha deste e de todos
      ctx.ef.mods.filter(function (m) { return m.alvo === 'atributo.?'; }).forEach(function (m) {
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: 'soma', valor: m.valor, ativo: false, motivo: m.motivo, status: m.status });
      });
      var fx = D.atributos.faixaAbsoluta;
      if (total < fx[0] || total > fx[1]) no.avisos.push({ tipo: 'fora-da-faixa', msg: A + ' ' + total + ' fora de ' + fx[0] + '–' + fx[1] });
      no.valor = total;
      no.formula = { simbolica: sim, numerica: conta(num, total) };
      return no;
    }
    function noAtributoMod(ctx, A) {
      var D = ctx.D, no = novoNo('atributo.' + A + '.mod', 'Mod.' + A);
      var amb = { ref: function (n) {
        return { v: ctx.v('atributo.' + A + '.total'), rot: A, st: 'canonico',
          fonte: { tipo: 'no', id: 'atributo.' + A + '.total', nome: D.atributos.nomes[A] } };
      } };
      var r = aval(D.atributos.mod.ast, amb, D);
      no.termos.push({ rotulo: r.sim, fonte: { tipo: 'no', id: 'atributo.' + A + '.total', nome: D.atributos.nomes[A] },
        op: 'formula', valor: r.v, ativo: true, motivo: '', status: r.st });
      no.valor = r.v;
      no.formula = { simbolica: r.sim, numerica: conta(r.num, r.v) };
      return no;
    }
    function ambBase(ctx, extra) {
      return function (n) {
        var m = /^mod\.(\w+)$/.exec(n);
        if (m) return { v: ctx.v('atributo.' + m[1] + '.mod'), rot: 'Mod.' + m[1], st: 'canonico',
          fonte: { tipo: 'no', id: 'atributo.' + m[1] + '.mod', nome: 'Mod.' + m[1] } };
        if (n === 'nivel') return { v: ctx.nivel, rot: 'Nível', st: 'canonico', fonte: { tipo: 'ficha', id: 'meta.nivel', nome: 'Nível ' + ctx.nivel } };
        if (extra && extra[n]) return extra[n];
        if (ctx.nos[n]) return { v: ctx.v(n), rot: ctx.nos[n].rotulo, st: ctx.nos[n].status, fonte: { tipo: 'no', id: n, nome: ctx.nos[n].rotulo } };
        return { v: null, rot: n, st: 'semStatus' };
      };
    }
    function escolhaAttr(ctx, chave) {
      var e = ctx.escolhas[chave];
      return function (no, cs) {
        if (!e) return null;
        var i = -1;
        no.args.forEach(function (a, j) { if (a.t === 'ref' && a.ref === 'mod.' + e) i = j; });
        return i >= 0 ? i : null;
      };
    }

    function noPericia(ctx, p) {
      var D = ctx.D, f = ctx.ficha, no = novoNo('pericia.' + p.id + '.total', p.nome);
      var grau = Math.max(0, Math.min(4, inteiro(f.pericias && f.pericias[p.id], 0)));
      var sim = [], num = [], total = 0, attr = null;
      if (p.modo === 'fixo') attr = p.atributos[0];
      else if (p.modo === 'maior') {
        var esc = f.periciasAttr && f.periciasAttr[p.id];
        if (p.atributos.indexOf(esc) >= 0) attr = esc;
        else p.atributos.forEach(function (a) { if (attr === null || ctx.v('atributo.' + a + '.mod') > ctx.v('atributo.' + attr + '.mod')) attr = a; });
        no.escolha = { atributos: p.atributos.slice(), usado: attr, trocado: attr === esc };
      }
      if (attr) {
        var m = ctx.v('atributo.' + attr + '.mod');
        no.termos.push({ rotulo: 'Mod.' + attr, fonte: { tipo: 'no', id: 'atributo.' + attr + '.mod', nome: 'Mod.' + attr },
          op: 'soma', valor: m, ativo: true, motivo: p.modo === 'maior' ? (no.escolha.trocado ? 'atributo trocado à mão (D7)' : 'o maior de ' + p.atributos.join('/') + ' (D7)') : '',
          status: p.modo === 'maior' ? p.stEscolha : p.st });
        total += m;
        sim.push({ op: '', t: p.modo === 'maior' && !no.escolha.trocado ? 'maior(' + p.atributos.map(function (a) { return 'Mod.' + a; }).join(', ') + ')' : 'Mod.' + attr });
        num.push({ op: '', t: numTxt(m) });
      } else if (p.modo === 'porArma') {
        no.termos.push({ rotulo: 'Atributo da arma', fonte: { tipo: 'regra', id: p.fo, nome: 'porArma' }, op: 'soma', valor: null,
          ativo: false, motivo: 'entra na linha de cada arma (porArma: Pesada FOR, Leve e Distância DES)', status: p.st });
        no.semAtributo = true;
      }
      var rot = D.graus.rotulos[grau];
      if (p.modo === 'dado') {
        no.dado = { fixo: 0, dados: [p.dadoPorGrau[grau]], dadosPrimeiro: true };
        no.termos.push({ rotulo: 'Dado de Defender (' + rot + ')', fonte: { tipo: 'ficha', id: 'pericias.' + p.id, nome: rot },
          op: 'dado', valor: p.dadoPorGrau[grau], ativo: true, motivo: 'sem atributo (D8a)', status: p.st });
        sim.push({ op: '', t: 'Dado de Defender (' + rot + ')' });
        num.push({ op: '', t: p.dadoPorGrau[grau] });
      } else {
        var bonus = D.graus.bonus[grau];
        no.termos.push({ rotulo: 'Treino (' + rot + ')', fonte: { tipo: 'ficha', id: 'pericias.' + p.id, nome: rot },
          op: 'soma', valor: bonus, ativo: true, motivo: '', status: D.graus.st });
        total += bonus;
        sim.push({ op: sim.length ? ' + ' : '', t: 'Treino' });
        num.push({ op: num.length ? ' + ' : '', t: fmt(bonus) });
      }
      var alvos = ['pericia.' + p.id, 'todosOsTestes'].concat(attr ? ['testes.' + attr] : [], p.tags.map(function (t) { return 'tag.' + t; }));
      var mods = ctx.mods(alvos);
      var aceita = p.id === 'defender' ? ['reacaoDefender'] : [];
      var txt = { sim: [], num: [] };
      var s = somaMods(no, mods, ctx, aceita, txt);
      total += s;
      var rol = [];
      mods.forEach(function (m) {
        if (m.op !== 'vantagem' && m.op !== 'desvantagem') return;
        var a = ativoPara(m, aceita);
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: m.op, valor: null, ativo: a.ativo, motivo: a.motivo, status: m.status });
        if (a.ativo) rol.push({ op: m.op, fonte: m.fonte });
      });
      lembretes(no, mods, aceita);
      ctx.mods(['permiteSemTreino.' + p.id]).forEach(function (m) {
        if (m.ativo) no.lembretes.push({ op: 'permiteSemTreino', fonte: m.fonte, valor: m.penalidade || null });
      });
      if (p.exigeTreino && grau === 0) no.lembretes.push({ op: 'exigeTreino', msg: p.nome + ' exige treino para fabricar' });
      var simTxt = junta(sim.map(function (x) { return x.op + x.t; }).join(''), txt.sim);
      if (p.modo === 'dado') {
        no.dado.fixo = s;
        no.valor = textoDado(no.dado);
        var nd = junta(p.dadoPorGrau[grau], txt.num);
        no.formula = { simbolica: simTxt, numerica: '= ' + nd + (nd !== no.valor ? ' = ' + no.valor : '') };
      } else {
        no.valor = total;
        var numTxt0 = junta(num.map(function (x) { return x.op + x.t; }).join(''), txt.num);
        no.formula = { simbolica: simTxt || 'Treino', numerica: conta(numTxt0, total) };
      }
      no.rolagem = resolverTeste(rol, null, p.modo === 'dado' ? p.dadoPorGrau[grau] : null);
      return no;
    }

    function noRecursoMax(ctx, r) {
      var D = ctx.D, no = novoNo('recurso.' + r + '.max', NOME_REC[r]), cl = ctx.classe, rec = D.recursos[r];
      var k = COEF[r], coefMods = ctx.mods(['classe.' + k]);
      var coefBonus = 0;
      coefMods.forEach(function (m) {
        var a = ativoPara(m, []), v = valorMod(m, ctx);
        no.termos.push({ rotulo: nomeFonte(m) + ' (' + NOME_COEF[k] + ')', fonte: m.fonte, op: 'soma', valor: v, ativo: a.ativo, motivo: a.motivo, status: m.status });
        if (a.ativo && v != null) coefBonus += v;
      });
      var amb = { ref: ambBase(ctx, cl ? (function () {
        var x = {};
        x['classe.' + k] = { v: cl[k] + coefBonus, rot: NOME_COEF[k], st: cl.st,
          fonte: { tipo: 'classe', id: cl.id, nome: cl.nome + ' (' + NOME_COEF[k] + ' ' + cl[k] + (coefBonus ? (coefBonus > 0 ? ' + ' : ' − ') + fmt(Math.abs(coefBonus)) : '') + ')' } };
        return x;
      })() : null), escolha: escolhaAttr(ctx, 'attr.recurso.' + r) };
      var a = aval(rec.max, amb, D);
      if (!cl) {
        no.termos.push({ rotulo: NOME_COEF[k] + ' × Nível', fonte: { tipo: 'regra', id: rec.fo, nome: 'classe' }, op: 'soma', valor: null,
          ativo: false, motivo: 'classe não definida na ficha', status: rec.st });
        no.valor = null;
        no.formula = { simbolica: a.sim, numerica: '= ? (classe não definida)' };
        return no;
      }
      termosDaFormula(rec.max, amb, D).forEach(function (t) { no.termos.push(t); });
      var v = a.v, num = a.num;
      var mods = ctx.mods(['recurso.' + r + '.max']);
      var cond = mods.filter(function (m) { return m.fonte && m.fonte.tipo === 'condicao'; });
      var outros = mods.filter(function (m) { return !(m.fonte && m.fonte.tipo === 'condicao'); });
      var txt = { sim: [], num: [] };
      // bônus fixo
      v += somaMods(no, outros.filter(function (m) { return m.etapa !== 'reducaoPermanente'; }), ctx, [], txt);
      // bônus rolado (valor guardado por fonte, L09)
      lista(ctx.ficha.entradas).forEach(function (e) {
        if (!e || !e.id) return;
        Object.keys(D.recursos.bonusRolados).forEach(function (chave) {
          var b = D.recursos.bonusRolados[chave];
          if (!(e.id === chave || e.id.slice(-chave.length - 1) === '-' + chave)) return;
          if (String(b.recurso).split(/[|,]/).indexOf(r) < 0) return;
          var est = obj(e.estado) ? e.estado : {};
          var val = b.modo === 'valorFixo' ? b.valor : (b.modo === 'rolaUmaVez' ? est.valorRolado : est.acumulado);
          var nome = str(e.cache && e.cache.nome) || e.id;
          var ok = typeof val === 'number';
          no.termos.push({ rotulo: nome + (b.dado ? ' (' + b.dado + ')' : ''), fonte: { tipo: e.tipo, id: e.id, nome: nome }, op: 'soma',
            valor: ok ? val : null, ativo: ok, motivo: ok ? 'bônus rolado, valor anotado (L09)' : 'valor rolado não anotado (estado.valorRolado)', status: D.recursos.ordemSt });
          if (ok) { v += val; txt.sim.push({ op: val < 0 ? ' − ' : ' + ', t: nome }); txt.num.push({ op: val < 0 ? ' − ' : ' + ', t: fmt(Math.abs(val)) }); }
        });
      });
      var sim = junta(a.sim, txt.sim);
      num = junta(num, txt.num);
      // percentual
      outros.forEach(function (m) {
        if (m.op !== 'multiplica') return;
        var aa = ativoPara(m, []), f = valorMod(m, ctx);
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: 'multiplica', valor: f, ativo: aa.ativo && f != null, motivo: aa.motivo, status: pior(D, m.status, D.recursos.ordemSt) });
        if (!aa.ativo || f == null) return;
        v = v * f; sim = '(' + sim + ') × ' + nomeFonte(m); num = '(' + num + ') × ' + fmt(f);
      });
      // redução permanente
      var t2 = { sim: [], num: [] };
      v += somaMods(no, outros.filter(function (m) { return m.etapa === 'reducaoPermanente'; }), ctx, [], t2);
      // condição (Desnutrido −10 × X)
      v += somaMods(no, cond.filter(function (m) { return m.op === 'soma'; }), ctx, [], t2);
      cond.forEach(function (m) {
        if (m.op !== 'multiplica') return;
        var aa = ativoPara(m, []), f = valorMod(m, ctx);
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: 'multiplica', valor: f, ativo: aa.ativo, motivo: aa.motivo, status: m.status });
        if (aa.ativo && f != null) { v = v * f; t2.sim.push({ op: ' × ', t: nomeFonte(m) }); t2.num.push({ op: ' × ', t: fmt(f) }); }
      });
      sim = junta(sim, t2.sim); num = junta(num, t2.num);
      // piso e arredondamento (floor, uma vez, no fim)
      var bruto = v;
      v = Math.floor(Math.max(0, v) + 1e-9);
      if (bruto < 0) { num = 'máx(0, ' + num + ')'; }
      no.valor = v;
      no.formula = { simbolica: sim, numerica: '= ' + num + (bruto !== v && bruto >= 0 ? ' = ' + fmt(bruto) + ' → ' + fmt(v) : ' = ' + fmt(v)) };
      return no;
    }

    function noRecursoClasse(ctx) {
      var D = ctx.D, no = novoNo('recurso.classe.max', NOME_REC.classe), cl = ctx.classe;
      if (!cl) { no.formula = { simbolica: 'Recurso de classe', numerica: '= ? (classe não definida)' }; return no; }
      if (!cl.medidores.length) {
        var rdc = cl.recursoDeClasse || { st: 'semStatus' };
        no.termos.push({ rotulo: 'Recurso de classe de ' + cl.nome, fonte: { tipo: 'regra', id: rdc.fo || cl.fo, nome: rdc.pergunta || 'contrato' },
          op: 'formula', valor: null, ativo: true, motivo: str(rdc.nota) || 'sem regra no contrato', status: rdc.st });
        no.formula = { simbolica: 'Recurso de classe de ' + cl.nome + ' (sem nome nem regra no contrato)',
          numerica: '= ? (' + (D.rotulosSelo[D.selos[rdc.st]] || 'pendente') + (rdc.pergunta ? ', ' + rdc.pergunta : '') + ')' };
        return no;
      }
      var med = cl.medidores[0], amb = { ref: ambBase(ctx) };
      var a = aval(med.max, amb, D);
      termosDaFormula(med.max, amb, D).forEach(function (t) { no.termos.push(t); });
      no.rotulo = med.nome + ' máx.';
      no.medidor = med.id;
      no.valor = a.v;
      no.formula = { simbolica: a.sim, numerica: conta(a.num, a.v) };
      return no;
    }

    function noEvasaoPassiva(ctx) {
      var D = ctx.D, no = novoNo('evasao.passiva', 'Evasão Passiva'), ev = D.derivados.evasao.passiva;
      var amb = { ref: ambBase(ctx) }, a = aval(ev.ast, amb, D);
      termosDaFormula(ev.ast, amb, D).forEach(function (t) { no.termos.push(t); });
      var txt = { sim: [], num: [] };
      var mods = ctx.mods(['evasao.passiva']);
      // valor 'fluxo' (Monge Evasivo): o Fluxo atual
      mods.forEach(function (m) { if (m.valor === 'fluxo') { m.valor = inteiro(ctx.ficha.recursos && ctx.ficha.recursos.classe && ctx.ficha.recursos.classe.atual, 0); } });
      var v = a.v + somaMods(no, mods, ctx, [], txt);
      lembretes(no, mods, []);
      no.valor = v;
      no.formula = { simbolica: junta(a.sim, txt.sim), numerica: conta(junta(a.num, txt.num), v) };
      return no;
    }
    function noEvasaoAtiva(ctx) {
      var D = ctx.D, no = novoNo('evasao.ativa', 'Evasão Ativa'), at = D.derivados.evasao.ativa;
      var pas = ctx.nos['evasao.passiva'], def = ctx.nos['pericia.defender.total'];
      var dd = def.dado || { fixo: 0, dados: [] };
      no.termos.push({ rotulo: 'Evasão Passiva', fonte: { tipo: 'no', id: 'evasao.passiva', nome: 'Evasão Passiva' }, op: 'soma',
        valor: pas.valor, ativo: true, motivo: '', status: at.st });
      no.termos.push({ rotulo: 'Dado de Defender', fonte: { tipo: 'no', id: 'pericia.defender.total', nome: 'Defender' }, op: 'dado',
        valor: textoDado(dd), ativo: true, motivo: 'o dado não soma atributo (D8a); vale só contra quem te atacou, no turno dele (D8c)', status: at.st });
      no.dado = { fixo: (pas.valor == null ? 0 : pas.valor) + (dd.fixo || 0), dados: (dd.dados || []).slice() };
      no.valor = pas.valor == null ? null : textoDado(no.dado);
      no.formula = { simbolica: 'Evasão Passiva + Dado de Defender',
        numerica: '= ' + fmt(pas.valor) + ' + ' + textoDado(dd) + ' = ' + (no.valor == null ? '?' : no.valor) };
      no.lembretes.push({ op: 'reacao', msg: 'gasta a reação; vale contra todos os ataques daquele agressor no turno dele' });
      no.rolagem = def.rolagem;
      return no;
    }
    function noCD(ctx) {
      var D = ctx.D, no = novoNo('cd', 'CD'), cl = ctx.classe;
      if (!cl) { no.formula = { simbolica: 'CD da classe', numerica: '= ? (classe não definida)' }; return no; }
      var amb = { ref: ambBase(ctx), escolha: escolhaAttr(ctx, 'attr.cd') }, a = aval(cl.cd.ast, amb, D);
      termosDaFormula(cl.cd.ast, amb, D).forEach(function (t) { no.termos.push(t); });
      var txt = { sim: [], num: [] }, mods = ctx.mods(['cd']);
      var v = a.v + somaMods(no, mods, ctx, [], txt);
      no.valor = v;
      no.formula = { simbolica: junta(a.sim, txt.sim), numerica: conta(junta(a.num, txt.num), v) };
      return no;
    }

    function noCapacidade(ctx, col) {
      var D = ctx.D, nome = col === 'bugigangas' ? 'Bugigangas' : 'Equipamentos';
      var no = novoNo('capacidade.' + col, 'Capacidade de ' + nome), ast = D.derivados.inventario[col];
      var amb = { ref: ambBase(ctx) }, a = aval(ast, amb, D);
      no.termos.push({ rotulo: a.sim, fonte: { tipo: 'no', id: 'atributo.FOR.mod', nome: 'Mod.FOR' }, op: 'formula', valor: a.v, ativo: true, motivo: '', status: a.st });
      var carga = ctx.cargaInv, sim = a.sim, num = a.num, v = a.v;
      lista(carga && carga[col] && carga[col].bonus).forEach(function (b) {
        no.termos.push({ rotulo: b.nome, fonte: { tipo: 'item', id: b.id, nome: b.nome }, op: 'soma', valor: b.n, ativo: true,
          motivo: b.ignoradas ? b.ignoradas + ' cópia(s) não acumulam' : 'capacidade do item (KhInv)', status: 'canonico' });
        v += b.n; sim += ' + ' + b.nome; num += ' + ' + fmt(b.n);
      });
      ctx.mods(['capacidade.' + col]).forEach(function (m) {
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: m.op, valor: m.valor, ativo: false, motivo: m.motivo, status: m.status });
      });
      no.valor = v;
      no.formula = { simbolica: sim, numerica: conta(num, v) };
      return no;
    }
    function noCarga(ctx) {
      var D = ctx.D, no = novoNo('carga', 'Carga'), c = ctx.cargaInv;
      var cols = {};
      ['bugigangas', 'equipamentos'].forEach(function (col) {
        var max = ctx.v('capacidade.' + col), usado = c ? c[col].usado : 0;
        cols[col] = { usado: usado, max: max, estado: max == null ? 'ok' : KhInv.estado(usado, max) };
        no.termos.push({ rotulo: col === 'bugigangas' ? 'Bugigangas' : 'Equipamentos', fonte: { tipo: 'no', id: 'capacidade.' + col, nome: 'capacidade' },
          op: 'formula', valor: usado + '/' + fmt(max), ativo: true, motivo: cols[col].estado, status: D.derivados.inventario.st });
      });
      var ordem = { ok: 0, leve: 1, extremo: 2 };
      var pior0 = ordem[cols.bugigangas.estado] >= ordem[cols.equipamentos.estado] ? cols.bugigangas.estado : cols.equipamentos.estado;
      no.valor = pior0 === 'ok' ? 'nenhuma' : pior0;
      no.extra = { bugigangas: cols.bugigangas, equipamentos: cols.equipamentos, avisos: c ? c.avisos : [] };
      var id = pior0 === 'leve' ? 'sobrepeso-leve' : pior0 === 'extremo' ? 'sobrepeso-extremo' : null;
      ctx.sobrepeso = [];
      if (id) {
        ctx.sobrepeso = KhEfeitos.modsDeCondicao(D, { id: id, x: null, origem: 'carga' });
        ctx.condicoes.push({ id: id, nome: D.condicoes[id].nome, x: null, origem: 'carga' });
      }
      no.formula = { simbolica: 'Bugigangas usado/máx. · Equipamentos usado/máx. (vale a pior coluna)',
        numerica: '= ' + cols.bugigangas.usado + '/' + fmt(cols.bugigangas.max) + ' · ' + cols.equipamentos.usado + '/' +
          fmt(cols.equipamentos.max) + ' → ' + (id ? D.condicoes[id].nome : 'sem Sobrepeso') };
      return no;
    }

    function noMovimento(ctx) {
      var D = ctx.D, mv = D.derivados.movimento, no = novoNo('movimento', 'Movimento'), r = ctx.raca, f = ctx.ficha;
      var sub = r && f.identidade.subespecie && f.identidade.subespecie.id && r.subespecies[f.identidade.subespecie.id];
      var base = sub ? sub.movimento : (r ? r.movimento : null);
      var nomeBase = sub ? r.nomes[f.identidade.subespecie.id] || str(f.identidade.subespecie.nome) : (r ? r.nome : '');
      if (base == null) {
        no.termos.push({ rotulo: 'Base da raça', fonte: { tipo: 'regra', id: mv.fo, nome: 'basePorRaca' }, op: 'soma', valor: null,
          ativo: false, motivo: r ? r.nome + ' sem subespécie na ficha' : 'raça não definida na ficha', status: mv.st });
        no.formula = { simbolica: 'Base da raça + somas × multiplicações; fixo vence; múltiplo de 1,5 abaixo', numerica: '= ? (' + (r ? 'subespécie' : 'raça') + ' não definida)' };
        return no;
      }
      no.termos.push({ rotulo: 'Base (' + nomeBase + ')', fonte: { tipo: sub ? 'subespecie' : 'raca', id: sub ? f.identidade.subespecie.id : r.id, nome: nomeBase },
        op: 'soma', valor: base, ativo: true, motivo: '', status: mv.st });
      var mods = ctx.mods(['movimento']), txt = { sim: [], num: [] };
      var v = base + somaMods(no, mods, ctx, [], txt);
      var sim = junta('Base (' + nomeBase + ')', txt.sim), num = junta(fmt(base), txt.num);
      var temMult = false;
      mods.forEach(function (m) {
        if (m.op !== 'multiplica') return;
        var a = ativoPara(m, []), fator = valorMod(m, ctx);
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: 'multiplica', valor: fator, ativo: a.ativo, motivo: a.motivo, status: pior(D, m.status, mv.st) });
        if (!a.ativo || fator == null) return;
        if (!temMult) { sim = '(' + sim + ')'; num = '(' + num + ')'; temMult = true; }
        v = v * fator; sim += ' × ' + nomeFonte(m); num += ' × ' + fmt(fator);
      });
      var fixos = [];
      mods.forEach(function (m) {
        if (m.op !== 'fixa' || typeof valorMod(m, ctx) !== 'number') return;
        var a = ativoPara(m, []);
        var t = { rotulo: nomeFonte(m), fonte: m.fonte, op: 'fixa', valor: valorMod(m, ctx), ativo: a.ativo, motivo: a.motivo, status: pior(D, m.status, mv.st) };
        no.termos.push(t);
        if (a.ativo) fixos.push(t);
      });
      var bruto = v;
      if (fixos.length) {
        // fixo vence tudo; entre fixos, o menor (L25)
        var menor = fixos.reduce(function (x, t) { return t.valor < x.valor ? t : x; });
        fixos.forEach(function (t) { if (t !== menor) { t.ativo = false; t.motivo = 'entre fixos vale o menor (' + menor.rotulo + ')'; } });
        no.termos.forEach(function (t) { if (t.ativo && (t.op === 'soma' || t.op === 'multiplica')) t.motivo = (t.motivo ? t.motivo + '; ' : '') + 'vencido pelo fixo (' + menor.rotulo + ')'; });
        v = menor.valor;
        sim = 'fixo: ' + menor.rotulo + ' (vence somas e multiplicações)';
        num = fmt(menor.valor) + ' (fixo)';
      }
      v = Math.max(mv.piso, v);
      var arred = Math.floor(v / mv.passo + 1e-9) * mv.passo;
      no.valor = Math.round(arred * 100) / 100;
      no.formula = { simbolica: sim + '; piso ' + fmt(mv.piso) + '; múltiplo de ' + fmt(mv.passo) + ' abaixo',
        numerica: '= ' + num + (fixos.length ? '' : ' = ' + fmt(Math.round(bruto * 100) / 100)) + (no.valor !== bruto ? ' → ' + fmt(no.valor) : '') };
      return no;
    }

    function noAcoes(ctx) {
      var D = ctx.D, no = novoNo('acoes', 'Ações por turno');
      no.termos.push({ rotulo: 'Base', fonte: { tipo: 'regra', id: D.turno.fo, nome: 'Sua Rodada' }, op: 'soma', valor: D.turno.acoes, ativo: true, motivo: '', status: D.turno.st });
      var mods = ctx.mods(['acoes']), txt = { sim: [], num: [] };
      var v = D.turno.acoes + somaMods(no, mods, ctx, [], txt);
      var sim = junta('3 ações', txt.sim), num = junta(fmt(D.turno.acoes), txt.num);
      var trava = null;
      mods.forEach(function (m) {
        if (m.op !== 'semAcao') return;
        var a = ativoPara(m, []);
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: 'semAcao', valor: 0, ativo: a.ativo, motivo: a.motivo, status: m.status });
        if (a.ativo) trava = m;
      });
      if (trava) { v = 0; sim += '; ' + nomeFonte(trava) + ': sem ações'; num = '0 (' + nomeFonte(trava) + ')'; }
      var bruto = v;
      v = Math.max(0, v);
      no.valor = v;
      no.formula = { simbolica: sim, numerica: '= ' + num + (bruto < 0 ? ' = ' + fmt(bruto) + ' → 0' : (trava ? '' : ' = ' + fmt(v))) };
      return no;
    }

    function noAr(ctx) {
      var D = ctx.D, no = novoNo('ar', 'Armadura (Ar)'), nat = ctx.mods(['ar.natural']);
      var fixos = nat.filter(function (m) { return m.op === 'fixa' && m.ativo; });
      var base = 0, nomeBase = 'sem Ar natural';
      fixos.forEach(function (m) { if (m.valor > base) { base = m.valor; nomeBase = 'Ar natural (' + nomeFonte(m) + ')'; } });
      nat.forEach(function (m) {
        no.termos.push({ rotulo: 'Ar natural (' + nomeFonte(m) + ')', fonte: m.fonte, op: m.op, valor: m.valor,
          ativo: m.ativo && (m.op === 'soma' || m.valor === base), motivo: m.op === 'fixa' && m.valor !== base ? 'vale o maior Ar natural' : m.motivo, status: pior(D, m.status, D.defesa.arNatural.st) });
      });
      var txt = { sim: [], num: [] };
      var v = base + somaMods({ termos: [] }, nat.filter(function (m) { return m.op === 'soma'; }), ctx, [], txt);
      var sim = junta(nomeBase, txt.sim), num = junta(fmt(base), txt.num);
      var t2 = { sim: [], num: [] };
      v += somaMods(no, ctx.mods(['ar']), ctx, [], t2);
      no.valor = v;
      no.formula = { simbolica: junta(sim, t2.sim) + ' (sem teto, D85)', numerica: conta(junta(num, t2.num), v) };
      return no;
    }
    function noAe(ctx, k) {
      var D = ctx.D, no = novoNo('ae.' + k, 'Ae(' + NOME_TIPO[k] + ')'), rs = ctx.ficha.resistencias || {};
      var base = k === 'todos' ? inteiro(rs.aeTodos, 0)
        : CATEGORIAS_AE.indexOf(k) >= 0 ? inteiro(rs.aeCategoria && rs.aeCategoria[k], 0)
          : inteiro(rs.tipos && rs.tipos[k] && rs.tipos[k].ae, 0);
      no.termos.push({ rotulo: 'Marcado na ficha', fonte: { tipo: 'ficha', id: 'resistencias', nome: 'ficha' }, op: 'soma', valor: base, ativo: true, motivo: '', status: 'canonico' });
      var txt = { sim: [], num: [] }, v = base + somaMods(no, ctx.mods(['ae.' + k]), ctx, [], txt);
      if (k === 'ordinario' && v) no.avisos.push({ tipo: 'ae-ordinario', msg: 'Ae(Ordinário) não existe (D67): é Ar. Não entra na mitigação dos 3 tipos ordinários.' });
      no.valor = v;
      no.formula = { simbolica: junta('ficha', txt.sim) + (D.defesa.aeMesmoTipo.modo === 'soma' ? ' (mesmo tipo soma, L26)' : ''), numerica: conta(junta(fmt(base), txt.num), v) };
      return no;
    }
    function noFlag(ctx, tipoFlag, t) {
      var D = ctx.D, letra = { resistencia: 'R', imunidade: 'I', vulnerabilidade: 'V' }[tipoFlag];
      var no = novoNo(tipoFlag + '.' + t, letra + '(' + NOME_TIPO[t] + ')'), rs = ctx.ficha.resistencias || {};
      var marcado = !!(rs.tipos && rs.tipos[t] && rs.tipos[t][letra]);
      no.termos.push({ rotulo: 'Marcado na ficha', fonte: { tipo: 'ficha', id: 'resistencias.tipos.' + t, nome: 'ficha' }, op: 'fixa', valor: marcado, ativo: marcado, motivo: '', status: 'canonico' });
      var v = marcado, quem = marcado ? ['ficha'] : [];
      ctx.mods([tipoFlag + '.' + t]).forEach(function (m) {
        var a = ativoPara(m, []);
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: m.op, valor: m.valor, ativo: a.ativo, motivo: a.motivo, status: m.status });
        if (a.ativo && m.valor === true) { v = true; quem.push(nomeFonte(m)); }
      });
      ctx.mods([tipoFlag]).forEach(function (m) {
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: m.op, valor: m.valor, ativo: false, motivo: 'tipo à escolha do jogador (F6)', status: m.status });
      });
      no.valor = v;
      no.formula = { simbolica: letra + '(' + NOME_TIPO[t] + ') = ficha ou fonte', numerica: '= ' + (quem.length ? quem.join(', ') : 'nenhuma fonte') + ' = ' + fmt(v) };
      return no;
    }
    function categoriaDe(D, t) {
      var c = null;
      Object.keys(D.defesa.categorias).forEach(function (k) { if (D.defesa.categorias[k].indexOf(t) >= 0) c = k; });
      return c;
    }
    function noDefesa(ctx, t) {
      var D = ctx.D, no = novoNo('defesa.' + t, 'Redução fixa contra ' + NOME_TIPO[t]), cat = categoriaDe(D, t);
      var partes = [], v = 0;
      function termo(rot, cam, ativo, motivo, st) {
        var x = ctx.v(cam);
        no.termos.push({ rotulo: rot, fonte: { tipo: 'no', id: cam, nome: rot }, op: 'soma', valor: x, ativo: ativo, motivo: motivo || '', status: st });
        if (ativo && x) { v += x; partes.push([rot, x]); }
      }
      if (cat === 'ordinario') termo('Ar', 'ar', true, 'Ar só reduz dano Ordinário', D.defesa.arNatural.st);
      termo('Ae(' + NOME_TIPO[t] + ')', 'ae.' + t, true, '', D.defesa.aeMesmoTipo.st);
      if (cat && CATEGORIAS_AE.indexOf(cat) >= 0) {
        if (cat === 'ordinario') termo('Ae(Ordinário)', 'ae.ordinario', false, 'Ae(Ordinário) não existe (D67): é Ar', 'canonico');
        else termo('Ae(' + NOME_TIPO[cat] + ')', 'ae.' + cat, true, 'Ae da categoria cobre todos os tipos dela (L34)', D.defesa.aeCategoria.st);
      } else {
        no.termos.push({ rotulo: 'Ae de categoria', fonte: { tipo: 'regra', id: D.defesa.categoriasFo, nome: 'categorias' }, op: 'soma', valor: null,
          ativo: false, motivo: 'contrato rev. 7: ' + NOME_TIPO[t] + ' fica em "Outros", sem Ae de categoria (o CLAUDE.md §2 põe em Místico)', status: 'canonico' });
      }
      var cobre = D.defesa.aeTodos.cobre.indexOf(t) >= 0;
      termo('Ae(Todos)', 'ae.todos', cobre, cobre ? 'Ae(Todos) cobre os 9 atípicos (L26)' : 'Ae(Todos) não cobre ' + NOME_TIPO[t] + ' (L26)', D.defesa.aeTodos.st);
      var R = !!ctx.v('resistencia.' + t), I = !!ctx.v('imunidade.' + t), V = !!ctx.v('vulnerabilidade.' + t);
      no.extra = { R: R, I: I, V: V, categoria: cat, multiplicador: I ? 0 : (R && V ? 1 : R ? 0.5 : V ? 2 : 1) };
      no.valor = v;
      no.formula = { simbolica: (partes.length ? partes.map(function (p) { return p[0]; }).join(' + ') : 'sem redução fixa') +
          (I ? ' · Imune' : R && V ? ' · R e V se cancelam' : R ? ' · Resistente (÷2 antes)' : V ? ' · Vulnerável (×2 antes)' : ''),
        numerica: '= ' + (partes.length ? partes.map(function (p) { return fmt(p[1]); }).join(' + ') : '0') + ' = ' + fmt(v) };
      return no;
    }

    // ---------------- magia (D82, D96) ----------------
    // p: {id?, nome?, nivel, intensidade, intensidades?, escola?, modulacoes:[{id?, nome?, custo}],
    //     multiplicadores:[{fator, fonte}], descontos:[{valor, fonte, porModulacao?, pisoModulacao?}], pactuada}
    function custoMagia(p, D, caminho) {
      D = D || dadosPadrao();
      var M = D.magia, no = novoNo(caminho || ('magia.' + (p.id || 'x') + '.custo'), 'Custo em Éter' + (p.nome ? ' — ' + p.nome : ''));
      var nivel = inteiro(p.nivel, 0), it = p.intensidade || 'normal';
      if (!(nivel >= 1 && nivel <= 5)) {
        no.formula = { simbolica: 'Base do nível + intensidade + modulações', numerica: '= ? (nível da magia desconhecido)' };
        no.avisos.push({ tipo: 'magia-sem-nivel', msg: 'magia sem nível conhecido' });
        return no;
      }
      if (nivel === 1 && it === 'contida' && M.nivel1SemContida) {
        no.termos.push({ rotulo: 'Contida', fonte: { tipo: 'regra', id: M.custoMinimo.fo, nome: 'Magias de Nível 1' }, op: 'soma', valor: null,
          ativo: false, motivo: 'Magias de Nível 1 não possuem a intensidade Contida', status: M.custoMinimo.st });
        no.avisos.push({ tipo: 'intensidade-invalida', msg: 'Magias de Nível 1 não possuem a intensidade Contida' });
        no.formula = { simbolica: 'Base Nível 1 + Contida', numerica: '= ? (Nível 1 não tem Contida)' };
        return no;
      }
      if (p.intensidades && p.intensidades.indexOf(it) < 0) no.avisos.push({ tipo: 'intensidade-fora', msg: NOME_INT[it] + ' fora das intensidades da magia (' + p.intensidades.join('/') + ')' });
      var base = M.custoBase[nivel - 1], di = M.intensidade[it];
      no.termos.push({ rotulo: 'Base (Nível ' + nivel + ')', fonte: { tipo: 'regra', id: M.fo, nome: 'custo por nível' }, op: 'soma', valor: base, ativo: true, motivo: '', status: M.st });
      no.termos.push({ rotulo: NOME_INT[it], fonte: { tipo: 'regra', id: M.fo, nome: 'intensidade' }, op: 'soma', valor: di, ativo: true, motivo: '', status: M.st });
      var mods = lista(p.modulacoes), somaMod = 0;
      mods.forEach(function (m) {
        no.termos.push({ rotulo: 'Modulação ' + str(m.nome || m.id), fonte: { tipo: 'regra', id: M.fo, nome: 'modulação' }, op: 'soma', valor: m.custo, ativo: true,
          motivo: nivel === 1 && M.modulacaoEmTruquePrecoCheio ? 'em truque, preço cheio (D69)' : '', status: M.st });
        somaMod += m.custo;
      });
      var v = base + di + somaMod;
      var sim = 'Base Nv' + nivel + ' + ' + NOME_INT[it] + (mods.length ? ' + modulações' : '');
      var num = fmt(base) + (di < 0 ? ' − ' + fmt(-di) : ' + ' + fmt(di)) + (mods.length ? ' + ' + fmt(somaMod) : '');
      var excecao = null;
      if (nivel === 1 && it === 'normal' && !mods.length) excecao = 'Nível 1 Normal sem modulação';
      else if (p.pactuada && it === 'contida') excecao = 'Magia Pactuada em Contida (D96)';
      lista(p.multiplicadores).forEach(function (x) {
        var ativo = !excecao;
        no.termos.push({ rotulo: str(x.fonte && x.fonte.nome) || 'multiplicador', fonte: x.fonte || { tipo: 'regra', id: M.fo, nome: 'multiplicador' },
          op: 'multiplica', valor: x.fator, ativo: ativo, motivo: ativo ? 'multiplicador antes do desconto (P39)' : 'exceção do custo 0', status: x.st || M.st });
        if (!ativo) return;
        v = v * x.fator; sim = '(' + sim + ') × ' + str(x.fonte && x.fonte.nome); num = '(' + num + ') × ' + fmt(x.fator);
      });
      lista(p.descontos).forEach(function (d) {
        var ativo = !excecao, total = d.valor || 0;
        if (d.porModulacao) mods.forEach(function (m) { total += Math.max(0, Math.min(d.porModulacao, m.custo - (d.pisoModulacao || 0))); });
        no.termos.push({ rotulo: str(d.fonte && d.fonte.nome) || 'desconto', fonte: d.fonte || { tipo: 'regra', id: M.fo, nome: 'desconto' },
          op: 'soma', valor: -total, ativo: ativo, motivo: ativo ? (d.porModulacao ? '−' + d.valor + ' na magia e −' + d.porModulacao + ' em cada modulação (piso ' + (d.pisoModulacao || 0) + ' por modulação)' : 'desconto depois do multiplicador (P39)')
            : 'descontos não se aplicam à exceção do custo 0', status: d.st || M.st });
        if (!ativo) return;
        v -= total; sim += ' − ' + str(d.fonte && d.fonte.nome); num += ' − ' + fmt(total);
      });
      var bruto = v, piso = M.custoMinimo.valor;
      if (excecao) {
        v = 0;
        no.termos.push({ rotulo: 'Exceção: ' + excecao, fonte: { tipo: 'regra', id: M.custoMinimo.fo, nome: 'custo mínimo' }, op: 'fixa', valor: 0, ativo: true, motivo: 'custa 0 Éter', status: M.custoMinimo.st });
        no.formula = { simbolica: sim + ' (exceção: ' + excecao + ')', numerica: '= ' + num + ' → 0 (exceção)' };
      } else {
        v = Math.max(piso, Math.floor(v + 1e-9));
        no.termos.push({ rotulo: 'Custo mínimo', fonte: { tipo: 'regra', id: M.custoMinimo.fo, nome: 'custo mínimo' }, op: 'minimo', valor: piso,
          ativo: bruto < piso, motivo: 'toda conjuração custa no mínimo ' + piso + ' Éter, depois das reduções (D82)', status: M.custoMinimo.st });
        no.formula = { simbolica: 'máx(' + piso + ', ' + sim + ')', numerica: '= máx(' + piso + ', ' + num + ') = ' + fmt(v) };
      }
      if (nivel === 5) no.lembretes.push({ op: 'requisito', msg: 'Nível 5 exige Foco Primordial (' + M.focoPrimordial.requisito + ')' });
      no.valor = v;
      return fechaStatus(no, D);
    }
    function noMagia(ctx, e) {
      var D = ctx.D, info = D.magia.porId[e.id], est = obj(e.estado) ? e.estado : {};
      var caminho = 'magia.' + e.id + '.custo';
      if (!info) {
        var no0 = novoNo(caminho, 'Custo em Éter — ' + str(e.cache && e.cache.nome));
        no0.formula = { simbolica: 'Base do nível + intensidade + modulações', numerica: '= ? (magia fora das regras compiladas)' };
        return no0;
      }
      var mult = [];
      D.magia.multiplicadores.forEach(function (m) {
        if (m.alvo !== 'eter') return;
        var tem = lista(ctx.ficha.entradas).some(function (x) { return x && x.id === m.fonte; }) ||
          ctx.condicoes.some(function (c) { return 'condicao:' + c.id === m.fonte; });
        if (tem) mult.push({ fator: m.fator, fonte: { tipo: 'regra', id: m.fonte, nome: m.fonte }, st: m.st });
      });
      var escola = D.magia.modulacoes[info.escola] || {};
      var mods = lista(est.modulacoes).map(function (id) { return { id: id, nome: id, custo: escola[id] }; })
        .filter(function (m) { return typeof m.custo === 'number'; });
      var no = custoMagia({ id: e.id, nome: str(e.cache && e.cache.nome), nivel: info.nivel, intensidade: est.intensidade || 'normal',
        intensidades: info.intensidades, modulacoes: mods, multiplicadores: mult, descontos: [], pactuada: est.pactuada === true }, D, caminho);
      no.magia = { id: e.id, nivel: info.nivel, escola: info.escola };
      return no;
    }

    // ---------------- ataques (PMA como display) ----------------
    function armasEquipadas(ctx) {
      if (!ctx.efeitos) return [];
      return lista(ctx.ficha.inventario && ctx.ficha.inventario.equipamentos).filter(function (e) {
        var ef = e && e.equipado && e.id && ctx.efeitos[e.id];
        return ef && ef.arma && ef.arma.dados && ef.arma.atributo;
      }).map(function (e) { return { e: e, arma: ctx.efeitos[e.id].arma, st: ctx.efeitos[e.id].status }; });
    }
    // Mod de ataque vale para a própria arma e para o que não é arma (munição, anel);
    // o de OUTRA arma não entra nesta linha
    function daArma(ctx, x, uid) {
      if (!x.uid || x.uid === uid) return true;
      var ef = ctx.efeitos && x.fonte && ctx.efeitos[x.fonte.id];
      return !(ef && ef.arma);
    }
    function noAtaque(ctx, w) {
      var D = ctx.D, e = w.e, arma = w.arma, no = novoNo('ataque.' + e.uid + '.atacar', 'Atacar — ' + str(e.nome));
      var at = ctx.nos['pericia.atacar.total'], A = arma.atributo, m = ctx.v('atributo.' + A + '.mod');
      no.termos.push({ rotulo: 'Atacar (treino e fontes)', fonte: { tipo: 'no', id: 'pericia.atacar.total', nome: 'Atacar' }, op: 'soma', valor: at.valor, ativo: true, motivo: '', status: at.status });
      no.termos.push({ rotulo: 'Mod.' + A + ' (' + arma.arquetipo + ')', fonte: { tipo: 'no', id: 'atributo.' + A + '.mod', nome: 'Mod.' + A }, op: 'soma', valor: m, ativo: true, motivo: 'atributo da arma (porArma)', status: w.st });
      var v = (at.valor || 0) + m, sim = 'Atacar + Mod.' + A, num = fmt(at.valor) + (m < 0 ? ' − ' + fmt(-m) : ' + ' + fmt(m));
      if (arma.bonusAtacar) {
        no.termos.push({ rotulo: 'Bônus da arma', fonte: { tipo: 'item', id: e.id, nome: str(e.nome) }, op: 'soma', valor: arma.bonusAtacar, ativo: true, motivo: '', status: w.st });
        v += arma.bonusAtacar; sim += ' + bônus da arma'; num += ' + ' + fmt(arma.bonusAtacar);
      }
      var txt = { sim: [], num: [] };
      v += somaMods(no, ctx.mods(['ataque.bonusAtacar']).filter(function (x) { return daArma(ctx, x, e.uid); }), ctx, [], txt);
      sim = junta(sim, txt.sim); num = junta(num, txt.num);
      // progressão: 1º, 2º, 3º… = total + (i−1)·pma; n = ⌊ações / custo de Atacar⌋
      var pma = D.turno.pma, pmaTxt = [];
      ctx.mods(['pma']).forEach(function (x) {
        var okCond = !x.condicao || (x.condicao === 'armas de arremesso' && arma.arremessar != null);
        var ativo = x.ativo && okCond && x.op === 'fixa';
        no.termos.push({ rotulo: 'PMA: ' + nomeFonte(x), fonte: x.fonte, op: x.op, valor: x.valor, ativo: ativo,
          motivo: !x.ativo ? x.motivo : (!okCond ? 'só com ' + x.condicao : ''), status: x.status });
        if (ativo) { pma = x.valor; pmaTxt.push(nomeFonte(x)); }
      });
      var acoes = ctx.v('acoes'), custo = arma.acoes || 1, n = acoes == null ? 0 : Math.floor(acoes / custo);
      no.valor = v;
      no.formula = { simbolica: sim, numerica: conta(num, v) };
      no.progressao = { pma: pma, n: n, custoAtacar: custo, acoes: acoes, fontesPma: pmaTxt, st: D.derivados.progressao.st };
      return no;
    }
    function fechaProgressao(no, D) {
      var p = no.progressao, linhas = [];
      for (var i = 1; i <= p.n; i++) linhas.push(no.valor + (i - 1) * p.pma);
      p.linhas = linhas;
      p.texto = linhas.map(function (x, i) { return (i + 1) + 'º ' + (x < 0 ? '−' + (-x) : '+' + x); }).join(' · ');
      no.termos.push({ rotulo: 'Progressão (PMA ' + p.pma + ')', fonte: { tipo: 'regra', id: D.derivados.progressao.fo, nome: 'progressão de ataques' }, op: 'formula',
        valor: p.texto, ativo: false, motivo: 'display: ' + p.n + ' ataque(s) = ⌊' + p.acoes + ' ações / ' + p.custoAtacar + '⌋', status: p.st });
      no.formula.numerica += ' → ' + (p.texto || 'sem ações para atacar');
      no.selosProgressao = D.selos[p.st] ? [D.selos[p.st]] : [];
    }
    function noDano(ctx, w) {
      var D = ctx.D, e = w.e, arma = w.arma, no = novoNo('ataque.' + e.uid + '.dano', 'Dano — ' + str(e.nome));
      var A = arma.atributo, m = ctx.v('atributo.' + A + '.mod');
      no.termos.push({ rotulo: 'Dados da arma (' + arma.tipo + ')', fonte: { tipo: 'item', id: e.id, nome: str(e.nome) }, op: 'dado', valor: arma.dados, ativo: true, motivo: '', status: w.st });
      no.termos.push({ rotulo: 'Mod.' + A, fonte: { tipo: 'no', id: 'atributo.' + A + '.mod', nome: 'Mod.' + A }, op: 'soma', valor: m, ativo: true, motivo: '', status: w.st });
      no.dado = { fixo: m, dados: [arma.dados], dadosPrimeiro: true };
      var extras = [];
      lista(arma.danoExtra).forEach(function (x) {
        extras.push(x.dados + ' ' + x.tipo);
        no.termos.push({ rotulo: 'Extra ' + x.tipo, fonte: { tipo: 'item', id: e.id, nome: str(e.nome) }, op: 'dado', valor: x.dados + ' ' + x.tipo, ativo: true, motivo: '', status: w.st });
      });
      ctx.mods(['ataque.danoExtra']).filter(function (x) { return daArma(ctx, x, e.uid); }).forEach(function (x) {
        no.termos.push({ rotulo: nomeFonte(x), fonte: x.fonte, op: 'dado', valor: x.valor, ativo: false, motivo: 'dano extra: lembrete na linha de ataque (Mesa)', status: x.status });
      });
      ctx.mods(['danoCausado']).forEach(function (x) {
        no.termos.push({ rotulo: nomeFonte(x), fonte: x.fonte, op: x.op, valor: valorMod(x, ctx), ativo: false, motivo: 'no dano FINAL rolado (Mesa)', status: x.status });
        if (x.ativo) no.lembretes.push({ op: x.op, valor: valorMod(x, ctx), fonte: x.fonte, msg: 'dano final × ' + fmt(valorMod(x, ctx)) });
      });
      no.valor = textoDado(no.dado);
      no.extra = { extras: extras, margemAmeaca: arma.margemAmeaca, multiplicadorCritico: arma.multiplicadorCritico, tipo: arma.tipo };
      no.formula = { simbolica: 'Dados da arma + Mod.' + A + (extras.length ? ' + extras' : ''),
        numerica: '= ' + arma.dados + (m < 0 ? ' − ' + fmt(-m) : ' + ' + fmt(m)) + (extras.length ? ' + ' + extras.join(' + ') : '') };
      return no;
    }

    // ---------------- Limiar (D13) ----------------
    function noLimiar(ctx) {
      var D = ctx.D, L = D.limiar, no = novoNo('limiar.saldo', 'Pontos do Limiar');
      var niveis = L.niveis.filter(function (n) { return n <= ctx.nivel; });
      var pontos = niveis.length * L.pontosPorNivel;
      no.termos.push({ rotulo: L.pontosPorNivel + ' por nível (' + (niveis.join(', ') || 'nenhum ainda') + ')', fonte: { tipo: 'regra', id: L.fo, nome: 'Limiar' },
        op: 'soma', valor: pontos, ativo: true, motivo: '', status: L.st });
      var gasto = 0, partes = [];
      lista(ctx.ficha.entradas).forEach(function (e) {
        if (!e || e.tipo !== 'carta') return;
        var est = obj(e.estado) ? e.estado : {}, nome = str(e.cache && e.cache.nome) || str(e.id);
        var custo = null, motivo = '';
        if (est.especial === true) { custo = L.especial; motivo = 'carta especial: sempre ' + L.especial + ' (D13c)'; }
        else if (inteiro(est.posicaoNaMao, 0) >= 1 && inteiro(est.posicaoNaMao, 0) <= L.custoPorPosicao.length) {
          custo = L.custoPorPosicao[inteiro(est.posicaoNaMao, 0) - 1];
          motivo = est.posicaoNaMao + 'ª da mão' + (custo === 0 ? ' (grátis)' : '');
        } else motivo = 'posição na mão não anotada (estado.posicaoNaMao)';
        no.termos.push({ rotulo: nome, fonte: { tipo: 'carta', id: e.id, nome: nome }, op: 'soma', valor: custo == null ? null : -custo,
          ativo: custo != null, motivo: motivo, status: L.st });
        if (custo) { gasto += custo; partes.push(custo); }
      });
      no.valor = pontos - gasto;
      if (no.valor < 0) no.avisos.push({ tipo: 'saldo-negativo', msg: 'saldo do Limiar negativo (aviso, sem trava)' });
      no.formula = { simbolica: L.pontosPorNivel + ' × níveis de 2 a ' + ctx.nivel + ' − custo das cartas (grátis/2/3/4/5; especial 2)',
        numerica: '= ' + fmt(pontos) + (partes.length ? ' − ' + partes.map(fmt).join(' − ') : '') + ' = ' + fmt(no.valor) };
      return no;
    }
    function noMorrendo(ctx) {
      var D = ctx.D, no = novoNo('morrendo.tique', 'Tique de Morrendo');
      var amb = { ref: function (n) { return { v: ctx.v(n), rot: 'Saúde máx.', st: 'canonico', fonte: { tipo: 'no', id: n, nome: 'Saúde máx.' } }; } };
      var a = aval(D.morte.tique, amb, D);
      no.termos.push({ rotulo: a.sim, fonte: { tipo: 'no', id: 'recurso.saude.max', nome: 'Saúde máx.' }, op: 'formula', valor: a.v, ativo: true,
        motivo: 'dano biológico no início do turno do afetado; ignora Ar, Ae e Resistência (D86)', status: a.st });
      no.valor = a.v;
      no.formula = { simbolica: a.sim, numerica: conta(a.num, a.v) };
      return no;
    }

    // ---------------- grafo ----------------
    function grafo(ctx) {
      var D = ctx.D, g = [];
      function add(c, deps, f) { g.push({ c: c, d: deps, f: f }); }
      var MODS = ATRIBUTOS.map(function (A) { return 'atributo.' + A + '.mod'; });
      ATRIBUTOS.forEach(function (A) {
        add('atributo.' + A + '.total', [], function () { return noAtributoTotal(ctx, A); });
        add('atributo.' + A + '.mod', ['atributo.' + A + '.total'], function () { return noAtributoMod(ctx, A); });
      });
      add('capacidade.bugigangas', ['atributo.FOR.mod'], function () { return noCapacidade(ctx, 'bugigangas'); });
      add('capacidade.equipamentos', ['atributo.FOR.mod'], function () { return noCapacidade(ctx, 'equipamentos'); });
      add('carga', ['capacidade.bugigangas', 'capacidade.equipamentos'], function () { return noCarga(ctx); });
      D.pericias.forEach(function (p) {
        add('pericia.' + p.id + '.total', MODS.concat(['carga']), function () { return noPericia(ctx, p); });
      });
      ['saude', 'stamina', 'eter'].forEach(function (r) {
        add('recurso.' + r + '.max', MODS, function () { return noRecursoMax(ctx, r); });
      });
      add('recurso.classe.max', MODS, function () { return noRecursoClasse(ctx); });
      add('evasao.passiva', MODS, function () { return noEvasaoPassiva(ctx); });
      add('evasao.ativa', ['evasao.passiva', 'pericia.defender.total'], function () { return noEvasaoAtiva(ctx); });
      add('cd', MODS, function () { return noCD(ctx); });
      add('movimento', ['carga'], function () { return noMovimento(ctx); });
      add('acoes', [], function () { return noAcoes(ctx); });
      add('ar', [], function () { return noAr(ctx); });
      TIPOS_DANO.concat(CATEGORIAS_AE, ['todos']).forEach(function (k) { add('ae.' + k, [], function () { return noAe(ctx, k); }); });
      TIPOS_DANO.forEach(function (t) {
        ['resistencia', 'imunidade', 'vulnerabilidade'].forEach(function (f) { add(f + '.' + t, [], function () { return noFlag(ctx, f, t); }); });
        var cat = categoriaDe(D, t);
        add('defesa.' + t, ['ar', 'ae.' + t, 'ae.todos', 'resistencia.' + t, 'imunidade.' + t, 'vulnerabilidade.' + t]
          .concat(cat && CATEGORIAS_AE.indexOf(cat) >= 0 ? ['ae.' + cat] : []), function () { return noDefesa(ctx, t); });
      });
      lista(ctx.ficha.entradas).forEach(function (e) {
        if (e && e.tipo === 'magia' && e.id && !g.some(function (x) { return x.c === 'magia.' + e.id + '.custo'; })) {
          add('magia.' + e.id + '.custo', [], function () { return noMagia(ctx, e); });
        }
      });
      armasEquipadas(ctx).forEach(function (w) {
        add('ataque.' + w.e.uid + '.atacar', ['pericia.atacar.total', 'atributo.' + w.arma.atributo + '.mod', 'acoes'], function () { return noAtaque(ctx, w); });
        add('ataque.' + w.e.uid + '.dano', ['atributo.' + w.arma.atributo + '.mod'], function () { return noDano(ctx, w); });
      });
      add('limiar.saldo', [], function () { return noLimiar(ctx); });
      add('morrendo.tique', ['recurso.saude.max'], function () { return noMorrendo(ctx); });
      return g;
    }
    // Kahn estável (na ordem de declaração); ciclo ou dependência sem nó = erro
    function ordemTopologica(g) {
      var porC = {}, grau = {}, filhos = {};
      g.forEach(function (x) { porC[x.c] = x; grau[x.c] = 0; filhos[x.c] = []; });
      g.forEach(function (x) {
        x.d.forEach(function (d) {
          if (!porC[d]) throw new Error('KhRegras: ' + x.c + ' depende de ' + d + ', que não existe');
          grau[x.c]++; filhos[d].push(x.c);
        });
      });
      var fila = g.filter(function (x) { return !grau[x.c]; }).map(function (x) { return x.c; }), out = [];
      while (fila.length) {
        var c = fila.shift();
        out.push(c);
        filhos[c].forEach(function (f) { if (--grau[f] === 0) fila.push(f); });
      }
      if (out.length !== g.length) throw new Error('KhRegras: ciclo no grafo de regras');
      return out.map(function (c) { return porC[c]; });
    }

    // ---------------- API ----------------
    // opcoes: {dados?, efeitos? (data/efeitos.json ou o porId), catalogo? (não usado no cálculo)}
    function avaliar(ficha, opcoes) {
      opcoes = opcoes || {};
      ficha = ficha || {};
      var ctx = contexto(ficha, opcoes), D = ctx.D;
      var forTotal = null;
      var ajustes = obj(ficha.ajustes) ? ficha.ajustes : {};
      var ordem = ordemTopologica(grafo(ctx));
      ordem.forEach(function (x) {
        if (x.c === 'capacidade.bugigangas' && !ctx.cargaInv) {
          forTotal = ctx.v('atributo.FOR.total');
          ctx.cargaInv = KhInv.calcular(ficha.inventario || {}, forTotal);
        }
        var no = x.f();
        KhAjustes.aplicar(no, ajustes);
        if (no.progressao) fechaProgressao(no, D);
        fechaStatus(no, D);
        ctx.nos[x.c] = no;
      });
      // ajuste de caminho sem nó (magia ou arma que saiu da ficha): fica listado
      Object.keys(ajustes).forEach(function (c) {
        if (!ctx.nos[c]) ctx.avisos.push({ tipo: 'ajuste-sem-no', caminho: c, msg: 'ajuste em ' + c + ' sem campo calculado na ficha' });
      });
      var alertas = [];
      var rc = ficha.recursos || {};
      [['saude', 'morrendo'], ['stamina', 'exaurido'], ['eter', 'oco']].forEach(function (x) {
        var atual = rc[x[0]] && rc[x[0]].atual, max = ctx.v('recurso.' + x[0] + '.max');
        if (typeof atual === 'number' && atual <= 0 && max) alertas.push({ tipo: 'condicao-automatica', id: x[1], nome: D.condicoes[x[1]].nome,
          msg: D.condicoes[x[1]].nome + ': ' + NOME_REC[x[0]].replace(' máx.', '') + ' atual ≤ 0 (entra sozinha)' });
        if (typeof atual === 'number' && max != null && atual > max) alertas.push({ tipo: 'acima-do-maximo', recurso: x[0],
          msg: NOME_REC[x[0]].replace(' máx.', '') + ' atual ' + atual + ' acima do máximo ' + max + ' (o grampo corta, L06)' });
      });
      var sust = lista(ficha.entradas).filter(function (e) { return e && e.tipo === 'magia' && e.estado && e.estado.sustentando; });
      if (sust.length > D.magia.sustentada.maxAtivas) alertas.push({ tipo: 'sustentadas', msg: sust.length + ' magias sustentadas; o máximo é ' + D.magia.sustentada.maxAtivas + ' (D16)' });
      return { versao: D.versao, nos: ctx.nos, ordem: ordem.map(function (x) { return x.c; }), efeitos: ctx.ef,
        condicoes: ctx.condicoes, avisos: ctx.avisos, alertas: alertas };
    }
    // {caminho ajustável: calculado} — para KhEstado.podarAjustesMigrados e a migração
    function calculados(ficha, opcoes) {
      var r = avaliar(ficha, opcoes), out = {};
      Object.keys(r.nos).forEach(function (c) {
        if (KhAjustes.ehAjustavel(c) && typeof r.nos[c].calculado === 'number') out[c] = r.nos[c].calculado;
      });
      return out;
    }
    // D15: Saúde (ou Stamina) temporária não soma: fica a maior
    function temporaria(atual, nova) { return Math.max(numero(atual, 0), numero(nova, 0)); }

    return {
      avaliar: avaliar, calculados: calculados, custoMagia: custoMagia, resolverTeste: resolverTeste,
      temporaria: temporaria, aval: function (ast, amb, D) { return aval(ast, amb, D || dadosPadrao()); },
      fmt: fmt, dados: dadosPadrao
    };
  })();

  if (emNode) { module.exports = KhRegras; return; }
  raiz.KhRegras = KhRegras;
})(typeof window !== 'undefined' ? window : this);
