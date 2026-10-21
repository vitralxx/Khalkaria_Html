/* Khalkaria — Ficha · KhEdicao: o que a edição da ficha nova muda e como (F4.6b), PURO.
 * Especificação: docs/ficha-digital/07-f4-6-ensaio.md §3 (base: plano 02 M2).
 *
 * Dois regimes (M2):
 *   (b) CAMPOS DE ESTADO, edição direta: nome, jogador, nível, XP; raça,
 *       variante, classe, ramo e origem (por seletor do catálogo); atributos
 *       base; grau das 24 perícias; recursos atuais; Sins; idiomas; imunidade
 *       a condição; Marcas da Vhelor; História e Outros.
 *   (a) NÚMEROS DERIVADOS, por ajuste (KhEstado.PADRAO_AJUSTE): Valor fixo
 *       (padrão) ou Diferença, com motivo. "Temporário" não existe ainda (a
 *       expiração é da Mesa, F5). Número que não aceita ajuste (carga, Redução,
 *       tique de Morrendo, Stamina disponível…) tem o motivo (motivoNaoAjuste).
 *
 * Tudo aqui devolve MUDANÇAS ({caminho, valor}, os caminhos do
 * KhEstado.armazem.editar) e o rótulo do passo de desfazer, ou o erro em
 * PT-BR. Não toca DOM, storage nem rede: quem grava é o armazém (no modo
 * Ensaio, o KhEnsaio.armazem), e quem liga a interface é o KhEditor.
 *
 *   KhEdicao.campo('meta.nivel')                    // {tipo, rotulo, min, max…} | null
 *   KhEdicao.mudancas(ficha, caminho, bruto, {contexto})  // {ok, mudancas, rotulo, aviso} | {ok:false, erro}
 *   KhEdicao.passo(ficha, caminho, +1)              // o stepper (− e +)
 *   KhEdicao.grauClicado(ficha, 'atacar', 2)        // o círculo clicado
 *   KhEdicao.opcoesRef(ctx, ficha, 'variante')      // as opções do seletor (ctx = KhFichaAbas.contexto)
 *   KhEdicao.montaAjuste(caminho, {modo, valor, motivo}, no, agora)
 *   KhEdicao.mudancaAjuste / mudancaRemover          // o caminho 'ajustes' inteiro
 *   KhEdicao.restos(ficha, ctx, 'raca', anterior)    // o que ficou da raça/classe anterior (auditoria B)
 *   KhEdicao.mudancaRestos(ficha, ctx, 'raca', anterior)  // "Remover o que era de <anterior>", num passo
 *
 * Campos que não são um caminho só (03 §10 e auditoria B, 2026-10-19):
 *   'troca.<chave>'          a troca manual do atributo (KhTroca; chave 'pericia.<id>', 'cd',
 *                            'recurso.<r>'): padrão o maior, '' volta ao padrão; grava onde o
 *                            KhTroca diz (periciasAttr ou o 'identidade.escolhas' inteiro)
 *   'situacao.<uid>'         o interruptor do situacional de um item (F6): {valor: 'alvo#n',
 *                            marcado}; grava a coluna do inventário inteira com a
 *                            entrada.situacoes nova
 *   'migracao.oficio'        a pendência do Ofício(X) da v2: o grau vai para o Ofício escolhido
 *                            e a pendência fecha, no mesmo passo
 *
 * No node exporta por module.exports (carregado sozinho); no artefato js/ficha.js
 * o export já é o KhInv e este módulo só registra window.KhEdicao no navegador.
 * Vem no ORDEM depois do kh-ensaio.js e antes do kh-ficha-abas.js (que o usa).
 * Fonte: js/ficha/kh-edicao.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhEstado = emNode ? require('./kh-estado.js') : raiz.KhEstado;
  var KhAjustes = emNode ? require('./kh-ajustes.js') : raiz.KhAjustes;
  var KhRegras = emNode ? require('./kh-regras.js') : raiz.KhRegras;
  var KhTroca = emNode ? require('./kh-troca.js') : raiz.KhTroca;

  var KhEdicao = (function () {
    var NOME_AT = { FOR: 'Força', DES: 'Destreza', CON: 'Constituição', INT: 'Inteligência', SAB: 'Sabedoria' };
    var RECURSOS = { saude: 'Saúde', stamina: 'Stamina', eter: 'Éter', classe: 'Recurso de Classe' };
    var REFS = { raca: 'Raça', variante: 'Variante', subespecie: 'Subespécie', classe: 'Classe', ramo: 'Ramo', origem: 'Origem' };
    // o tipo do catálogo de cada referência da identidade (classe e ramo vêm dos blocos de data/classes)
    var TIPO_REF = { raca: 'raca', variante: 'variante', subespecie: 'subespecie', origem: 'origem' };
    // o que é da raça e o que é da classe nas entradas (o campo do catálogo que diz de quem é)
    var RESTO = { raca: { tipos: ['traco', 'tecnologia', 'variante', 'subespecie', 'corrupcao'], campo: 'raca', pre: 'raca-', artigo: 'da raça' },
      classe: { tipos: ['tecnica', 'marca', 'ultimate'], campo: 'classe', pre: 'classe-', artigo: 'da classe' } };
    var NOME_TIPO = { traco: 'traço', tecnologia: 'tecnologia', variante: 'variante', subespecie: 'subespécie', corrupcao: 'corrupção',
      tecnica: 'técnica', marca: 'marca', ultimate: 'ultimate' };
    var MAX_NOMES_RESTO = 6;
    var MAX_TEXTO = 80, MAX_LISTA = 400, MAX_LORE = 20000, MAX_MOTIVO = 120;
    var MAX_XP = 9999999, MAX_SINS = 999999999, MIN_REC = -9999, MAX_REC = 9999;
    // o valor do seletor da identidade que guarda o texto livre que veio da ficha atual (sem par)
    var MANTER = '__manter';
    var GRAUS = ['Leigo', 'Treinado', 'Experiente', 'Mestre', 'Lendário'];
    var MODOS = { fixa: 'Valor fixo', soma: 'Diferença' };
    // o motivo de cada número que não aceita ajuste (a primeira regra que casa)
    var MOTIVOS = [
      [/^carga$/, 'é a soma dos pesos do inventário (Equipamentos e Bugigangas): mude os itens, não o número.'],
      [/^defesa\./, 'a Redução soma Ar, Ae do tipo, Ae da categoria e Ae(Todos): ajuste uma dessas parcelas.'],
      [/^morrendo\.tique$/, 'sai da Saúde máxima (D86): ajuste a Saúde máx.'],
      [/^recurso\.stamina\.disponivel$/, 'é a Stamina atual menos a comprometida (D19): edite a Stamina atual.'],
      [/^magia\.[a-z0-9-]+\.custo\.[a-z]+$/, 'só o custo da intensidade escolhida (a marcada) aceita ajuste.'],
      [/^inventario\.sintonizados$/, 'conta os itens sintonizados do inventário: mude a sintonia dos itens.']
    ];
    var MOTIVO_PADRAO = 'este número não aceita ajuste manual.';
    // os erros do KhEstado.validarAjuste, em PT-BR
    var ERRO_AJUSTE = {
      'caminho-de-estado': 'Este é um campo de estado (como o atual de um recurso): edite o campo, não ajuste.',
      'valor-invalido': 'O valor não serve para este número.',
      'modo-invalido': 'Este número só aceita valor fixo.',
      'motivo-invalido': 'O motivo tem de ser texto.',
      'temporario-invalido': 'Ajuste temporário ainda não existe (expira na Mesa, F5).'
    };

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function clone(x) { return x === undefined ? undefined : JSON.parse(JSON.stringify(x)); }
    function semEmoji(s) {
      return str(s).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '').replace(/\s{2,}/g, ' ').trim();
    }
    function fmt(n) { return KhAjustes && KhAjustes.fmt ? KhAjustes.fmt(n) : str(n); }
    function sinal(n) { return typeof n === 'number' && n > 0 ? '+' + fmt(n) : fmt(n); }
    function pega(f, c) { return KhEstado.pegaCaminho(f, c); }
    function curto(s, n) { s = str(s); n = n || 32; return s.length > n ? s.slice(0, n - 1) + '…' : s; }
    function D() { return KhRegras && KhRegras.dados ? KhRegras.dados() || {} : {}; }
    function periciaD(id) { return lista(D().pericias).filter(function (x) { return x.id === id; })[0] || null; }
    function nomePericia(id) { var p = periciaD(id); return p ? str(p.nome) : id; }
    // os atributos de uma troca (chave do KhTroca): a perícia de dois atributos, ou
    // o nó 'esc' da fórmula da CD da classe da ficha / do máximo do recurso
    function attrsTroca(ficha, chave) {
      var d = D(), ast = null, m;
      if ((m = /^pericia\.([a-z-]+)$/.exec(str(chave)))) {
        var pa = periciaD(m[1]);
        return pa && pa.modo === 'maior' ? lista(pa.atributos).slice() : [];
      }
      if (chave === 'cd') {
        var cl = chaveDe(refDe(ficha, 'classe').id, 'classe-');
        ast = cl && obj(d.classes) && d.classes[cl] && d.classes[cl].cd ? d.classes[cl].cd.ast : null;
      } else if ((m = /^recurso\.(saude|stamina|eter)$/.exec(str(chave)))) {
        ast = obj(d.recursos) && d.recursos[m[1]] ? d.recursos[m[1]].max : null;
      }
      function acha(n) {
        if (!obj(n)) return null;
        if (n.t === 'esc') return n;
        return acha(n.a) || acha(n.b) || lista(n.args).reduce(function (x, y) { return x || acha(y); }, null);
      }
      var e = acha(ast);
      if (!e) return [];
      var ats = lista(e.args).map(function (x) { var r = x && x.t === 'ref' && /^mod\.(\w+)$/.exec(x.ref); return r ? r[1] : null; });
      return ats.every(Boolean) ? ats : [];
    }
    function rotuloGrau(g) {
      var r = lista(D().graus && D().graus.rotulos)[g];
      // o contrato escreve "Lendario" sem acento: o rótulo do site leva
      return r ? str(r).replace(/^Lendario$/, 'Lendário') : GRAUS[g] || str(g);
    }

    // ---------------- números (pt-BR) ----------------
    // '−3', '+2', ' 4,5 ' -> número; o resto -> null
    function lerNumero(bruto) {
      if (typeof bruto === 'number') return isFinite(bruto) ? bruto : null;
      var s = str(bruto).trim().replace(/−/g, '-').replace(/\s+/g, '').replace(',', '.');
      if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(s)) return null;
      var n = Number(s);
      return isFinite(n) ? n : null;
    }
    function lerInteiro(bruto) {
      // inteiro pt-BR com separador de milhar: "1.000" e "1 000" são mil (antes, "1.000" virava 1)
      if (typeof bruto === 'string') {
        var t = bruto.trim().replace(/−/g, '-');
        if (/^[+-]?\d{1,3}(?:[.\s]\d{3})+$/.test(t)) bruto = t.replace(/[.\s]/g, '');
      }
      var n = lerNumero(bruto);
      return n != null && Math.floor(n) === n ? n : null;
    }

    // ---------------- os campos de estado ----------------
    // {caminho, tipo: texto|textoLongo|inteiro|grau|ref|lista|conjunto, rotulo, min?, max?, passo? (com − e +)}
    function campo(caminho) {
      var c = str(caminho), m;
      function d(o) { return Object.assign({ caminho: c }, o); }
      if (c === 'meta.nome') return d({ tipo: 'texto', rotulo: 'Nome do Personagem', max: MAX_TEXTO });
      if (c === 'meta.jogador') return d({ tipo: 'texto', rotulo: 'Jogador', max: MAX_TEXTO });
      if (c === 'meta.nivel') return d({ tipo: 'inteiro', rotulo: 'Nível', min: 1, max: 5 });
      if (c === 'meta.xp') return d({ tipo: 'inteiro', rotulo: 'XP', min: 0, max: MAX_XP });
      if ((m = /^identidade\.(raca|variante|subespecie|classe|ramo|origem)$/.exec(c))) return d({ tipo: 'ref', ref: m[1], rotulo: REFS[m[1]] });
      if ((m = /^troca\.(.+)$/.exec(c)) && KhTroca.valida(m[1])) {
        // perícia: só a de dois atributos; CD e recurso: os atributos dependem da ficha (attrsTroca)
        var pm = /^pericia\.(.+)$/.exec(m[1]), pa = pm ? periciaD(pm[1]) : null;
        if (pm && !(pa && pa.modo === 'maior')) return null;
        return d({ tipo: 'troca', chave: m[1], rotulo: KhTroca.rotulo(m[1], pa ? str(pa.nome) : '') });
      }
      if ((m = /^situacao\.([A-Za-z0-9_-]+)$/.exec(c))) return d({ tipo: 'situacao', uid: m[1], rotulo: 'Situação do item' });
      if (c === 'migracao.oficio') return d({ tipo: 'oficio', rotulo: 'Ofício(X) da ficha atual' });
      if ((m = /^atributos\.base\.(FOR|DES|CON|INT|SAB)$/.exec(c))) {
        return d({ tipo: 'inteiro', rotulo: NOME_AT[m[1]] + ' (base)', min: 1, max: 30, atributo: m[1] });
      }
      if ((m = /^pericias\.([a-z-]+)$/.exec(c)) && KhEstado.PERICIAS.indexOf(m[1]) >= 0) {
        return d({ tipo: 'grau', rotulo: nomePericia(m[1]), min: 0, max: 4, pericia: m[1] });
      }
      if ((m = /^recursos\.(saude|stamina|eter|classe)\.atual$/.exec(c))) {
        return d({ tipo: 'inteiro', rotulo: RECURSOS[m[1]] + ' atual', min: MIN_REC, max: MAX_REC, passo: true });
      }
      if (c === 'inventario.sins') return d({ tipo: 'inteiro', rotulo: 'Sins', min: 0, max: MAX_SINS, passo: true });
      if (c === 'vhelor.marcas') return d({ tipo: 'inteiro', rotulo: 'Marcas da Vhelor', min: 0, max: 7, passo: true });
      if (c === 'idiomas') return d({ tipo: 'lista', rotulo: 'Idiomas', max: MAX_LISTA });
      if (c === 'imunidadesCondicao') return d({ tipo: 'conjunto', rotulo: 'Imunidade a condição' });
      if (c === 'lore.historia') return d({ tipo: 'textoLongo', rotulo: 'História', max: MAX_LORE });
      if (c === 'lore.outros') return d({ tipo: 'textoLongo', rotulo: 'Outros', max: MAX_LORE });
      return null;
    }
    function faixa(cp) { return fmt(cp.min) + ' a ' + fmt(cp.max); }
    // o texto digitado -> {ok, valor} | {ok:false, erro}
    function ler(cp, bruto) {
      if (cp.tipo === 'texto') {
        var t = str(bruto).replace(/\s+/g, ' ').trim();
        if (t.length > cp.max) return { ok: false, erro: cp.rotulo + ': no máximo ' + cp.max + ' caracteres.' };
        return { ok: true, valor: t };
      }
      if (cp.tipo === 'textoLongo') {
        var l = str(bruto).replace(/\r\n?/g, '\n');
        if (!l.trim()) l = '';
        if (l.length > cp.max) return { ok: false, erro: cp.rotulo + ': no máximo ' + cp.max + ' caracteres.' };
        return { ok: true, valor: l };
      }
      if (cp.tipo === 'inteiro' || cp.tipo === 'grau') {
        var n = lerInteiro(bruto);
        if (n == null) return { ok: false, erro: cp.rotulo + ': digite um número inteiro (' + faixa(cp) + ').' };
        if (n < cp.min || n > cp.max) return { ok: false, erro: cp.rotulo + ': de ' + faixa(cp) + '.' };
        return { ok: true, valor: n };
      }
      if (cp.tipo === 'lista') {
        var vistos = {}, out = [];
        str(bruto).split(/[,;\n]/).forEach(function (x) {
          x = x.replace(/\s+/g, ' ').trim();
          var k = x.toLowerCase();
          if (x && !vistos[k]) { vistos[k] = 1; out.push(x); }
        });
        if (out.join(', ').length > cp.max) return { ok: false, erro: cp.rotulo + ': no máximo ' + cp.max + ' caracteres.' };
        return { ok: true, valor: out };
      }
      return { ok: false, erro: cp.rotulo + ': este campo não se digita.' };
    }
    function rotuloPasso(cp, valor, extra) {
      if (cp.tipo === 'texto') return cp.rotulo + ': ' + (valor ? '"' + curto(valor) + '"' : 'em branco');
      if (cp.tipo === 'inteiro') return cp.rotulo + ': ' + fmt(valor);
      if (cp.tipo === 'grau') return cp.rotulo + ': ' + rotuloGrau(valor);
      if (cp.tipo === 'ref') return cp.rotulo + ': ' + (obj(valor) && valor.nome ? semEmoji(valor.nome) : 'nenhuma');
      if (cp.tipo === 'conjunto') return cp.rotulo + ': ' + str(extra);
      return cp.rotulo;
    }

    // ---------------- a identidade: as opções do catálogo ----------------
    function chaveDe(id, pre) { id = str(id); return id.indexOf(pre) === 0 ? id.slice(pre.length) : ''; }
    function refDe(ficha, k) { var i = obj(ficha) && obj(ficha.identidade) ? ficha.identidade : {}; return obj(i[k]) ? i[k] : { id: null, nome: '' }; }
    // ctx = KhFichaAbas.contexto(dados): porId ('tipo:id' -> entrada crua), classes, ramos
    function doTipo(ctx, tipo) {
      var out = [];
      if (!obj(ctx) || !obj(ctx.porId)) return out;
      Object.keys(ctx.porId).forEach(function (k) {
        if (k.indexOf(tipo + ':') === 0) { var e = ctx.porId[k]; out.push({ id: str(e.id), nome: semEmoji(e.nome), raca: str(e.raca) }); }
      });
      return out;
    }
    // as opções do seletor de uma referência ('raca', 'variante', 'classe', 'ramo', 'origem'),
    // na ordem do catálogo; variante só as da raça, ramo só os da classe
    function opcoesRef(ctx, ficha, ref) {
      if (TIPO_REF[ref]) {
        var l = doTipo(ctx, TIPO_REF[ref]);
        if (ref === 'variante' || ref === 'subespecie') {
          var r = chaveDe(refDe(ficha, 'raca').id, 'raca-');
          l = l.filter(function (x) { return !!r && x.raca === r; });
        }
        return l.map(function (x) { return { id: x.id, nome: x.nome }; });
      }
      if (ref === 'classe') {
        return Object.keys(obj(ctx) && obj(ctx.classes) ? ctx.classes : {}).map(function (id) {
          return { id: id, nome: semEmoji(ctx.classes[id].nome) || id };
        });
      }
      if (ref === 'ramo') {
        var c = chaveDe(refDe(ficha, 'classe').id, 'classe-');
        return Object.keys(obj(ctx) && obj(ctx.ramos) ? ctx.ramos : {}).filter(function (id) { return !!c && ctx.ramos[id].classe === c; })
          .map(function (id) { return { id: id, nome: semEmoji(ctx.ramos[id].nome) || id }; });
      }
      return [];
    }
    // as condições do catálogo (imunidade a condição)
    function opcoesCondicao(ctx) { return doTipo(ctx, 'condicao').map(function (x) { return { id: x.id, nome: x.nome }; }); }
    function chaveItem(x) { return obj(x) ? str(x.id || x.nome) : str(x); }

    // a entrada do catálogo de uma referência da identidade: pelo id ou, sem id (o
    // texto livre da v2), pelo nome, se ele é único no tipo (auditoria B: a de outra
    // raça sem id não saía na troca)
    function normaNome(s) { return semEmoji(s).toLowerCase(); }
    function entradaRef(ctx, k, atual) {
      if (!obj(ctx)) return null;
      if (k === 'ramo') {
        var rs = obj(ctx.ramos) ? ctx.ramos : {};
        if (atual.id) return rs[atual.id] || null;
        var pr = Object.keys(rs).filter(function (id) { return normaNome(rs[id].nome) === normaNome(atual.nome); });
        return pr.length === 1 ? rs[pr[0]] : null;
      }
      if (!obj(ctx.porId)) return null;
      if (atual.id) return ctx.porId[k + ':' + atual.id] || null;
      var l = Object.keys(ctx.porId).filter(function (x) { return x.indexOf(k + ':') === 0 && normaNome(ctx.porId[x].nome) === normaNome(atual.nome); });
      return l.length === 1 ? ctx.porId[l[0]] : null;
    }
    // a mudança de uma referência; trocar a raça tira a variante (e a
    // subespécie) de outra raça, trocar a classe tira o ramo de outra classe.
    // A variante/o ramo sem id sai se o NOME é o de uma de outra raça/classe; o
    // texto livre que não está no catálogo fica (não dá para saber de quem é).
    // Trocar raça ou classe também diz o que ficou da anterior (restos), sem tirar.
    function mudancasRef(ficha, cp, bruto, ctx) {
      var id = str(bruto);
      if (id === MANTER) return { ok: true, mudancas: [], rotulo: '' };
      var valor = { id: null, nome: '' };
      if (id) {
        var op = opcoesRef(ctx, ficha, cp.ref).filter(function (x) { return x.id === id; })[0];
        if (!op) return { ok: false, erro: cp.rotulo + ': opção fora do catálogo.' };
        valor = { id: op.id, nome: op.nome };
      }
      var out = [{ caminho: cp.caminho, valor: valor }], avisos = [];
      if (cp.ref === 'raca') {
        var r = chaveDe(valor.id, 'raca-');
        ['variante', 'subespecie'].forEach(function (k) {
          var atual = refDe(ficha, k);
          if (!atual.id && !str(atual.nome).trim()) return;
          var e = entradaRef(ctx, k, atual);
          if (!atual.id && !e) return;
          if (e && str(e.raca) === r) return;
          out.push({ caminho: 'identidade.' + k, valor: { id: null, nome: '' } });
          avisos.push((k === 'variante' ? 'A variante ' : 'A subespécie ') + semEmoji(atual.nome || atual.id) + ' saiu: é de outra raça.');
        });
      }
      if (cp.ref === 'classe') {
        var ramo = refDe(ficha, 'ramo'), c = chaveDe(valor.id, 'classe-');
        var info = ramo.id || str(ramo.nome).trim() ? entradaRef(ctx, 'ramo', ramo) : null;
        if ((ramo.id || info) && !(info && info.classe === c)) {
          out.push({ caminho: 'identidade.ramo', valor: { id: null, nome: '' } });
          avisos.push('O ramo ' + semEmoji(ramo.nome || ramo.id) + ' saiu: é de outra classe.');
        }
      }
      var res = { ok: true, mudancas: out, rotulo: rotuloPasso(cp, valor), aviso: avisos.join(' ') };
      var ant = refDe(ficha, cp.ref);
      if ((cp.ref === 'raca' || cp.ref === 'classe') && ant.id && ant.id !== valor.id) {
        var rr = restos(ficha, ctx, cp.ref, ant, valor.id);
        if (rr.total) {
          res.aviso = (res.aviso ? res.aviso + ' ' : '') + rr.texto;
          res.restos = { campo: cp.ref, anterior: { id: ant.id, nome: semEmoji(ant.nome) || ant.id } };
        }
      }
      return res;
    }

    // ---------------- o que ficou da raça ou classe anterior (auditoria B) ----------------
    // As entradas do catálogo dela (técnicas, marcas e ultimates da classe;
    // traços, tecnologias, variante e subespécie da raça), as escolhas de
    // atributo da raça e o Recurso de Classe. Só AVISA; quem remove é o
    // mudancaRestos, num passo, quando o jogador pede. A órfã (sem par no
    // catálogo) nunca entra: não dá para saber de quem era.
    // atual: o id da raça/classe de agora (padrão: o da ficha); a anterior igual a ela não tem resto.
    function restos(ficha, ctx, k, anterior, atual) {
      var R = RESTO[k], out = { itens: [], escolhas: [], recurso: false, total: 0, texto: '', nome: '' };
      if (!R || !obj(anterior) || !anterior.id) return out;
      var ch = chaveDe(anterior.id, R.pre);
      out.nome = semEmoji(anterior.nome) || ch;
      if (atual === undefined) atual = refDe(ficha, k).id;
      if (!ch || chaveDe(atual, R.pre) === ch) return out;
      lista(obj(ficha) ? ficha.entradas : null).forEach(function (e) {
        if (!obj(e) || R.tipos.indexOf(e.tipo) < 0 || !e.id) return;
        var c = obj(ctx) && obj(ctx.porId) ? ctx.porId[e.tipo + ':' + e.id] : null;
        if (!c || str(c[R.campo]) !== ch) return;
        out.itens.push({ uid: str(e.uid), tipo: e.tipo, nome: semEmoji(c.nome) || semEmoji(e.cache && e.cache.nome) || e.id });
      });
      var esc = obj(ficha) && obj(ficha.identidade) && obj(ficha.identidade.escolhas) ? ficha.identidade.escolhas : {};
      if (k === 'raca') out.escolhas = Object.keys(esc).filter(function (x) { return x.indexOf('raca.') === 0; });
      var rc = obj(ficha) && obj(ficha.recursos) && obj(ficha.recursos.classe) ? ficha.recursos.classe : null;
      if (k === 'classe' && rc && (Number(rc.atual) || rc.id || str(rc.nome).trim())) out.recurso = true;
      out.total = out.itens.length + out.escolhas.length + (out.recurso ? 1 : 0);
      if (!out.total) return out;
      var partes = out.itens.slice(0, MAX_NOMES_RESTO).map(function (x) { return x.nome + ' (' + NOME_TIPO[x.tipo] + ')'; });
      if (out.itens.length > MAX_NOMES_RESTO) partes.push('mais ' + (out.itens.length - MAX_NOMES_RESTO));
      if (out.escolhas.length) partes.push('a escolha de atributo da raça');
      if (out.recurso) partes.push('o Recurso de Classe (atual ' + fmt(Number(rc.atual) || 0) + (str(rc.nome).trim() ? ', ' + semEmoji(rc.nome) : '') + ')');
      out.texto = (out.total === 1 ? 'Ficou ' : 'Ficaram ') + R.artigo + ' anterior (' + out.nome + '): ' + partes.join(', ') + '.';
      return out;
    }
    // "Remover o que era de <anterior>": um passo só (desfazível), nunca calado
    function mudancaRestos(ficha, ctx, k, anterior) {
      var rr = restos(ficha, ctx, k, anterior);
      var nome = rr.nome || (obj(anterior) ? semEmoji(anterior.nome) || str(anterior.id) : '');
      if (!rr.total) return { ok: false, erro: 'Nada a remover: não ficou nada ' + (RESTO[k] ? RESTO[k].artigo : '') + ' anterior (' + nome + ').' };
      var fora = {}, out = [];
      rr.itens.forEach(function (x) { fora[x.uid] = true; });
      if (rr.itens.length) out.push({ caminho: 'entradas', valor: lista(ficha.entradas).filter(function (e) { return !(obj(e) && fora[str(e.uid)]); }) });
      if (rr.escolhas.length) {
        var esc = clone(ficha.identidade.escolhas);
        rr.escolhas.forEach(function (x) { delete esc[x]; });
        out.push({ caminho: 'identidade.escolhas', valor: esc });
      }
      if (rr.recurso) out.push({ caminho: 'recursos.classe', valor: { id: null, nome: '', atual: 0 } });
      return { ok: true, mudancas: out, rotulo: 'Remover o que era de ' + nome + ' (' + rr.total + ')', removidos: rr };
    }

    // ---------------- a escolha do atributo (03 §10) e a pendência do Ofício ----------------
    function mudancasTroca(ficha, cp, bruto) {
      var v = str(bruto).trim().toUpperCase();
      var ops = attrsTroca(ficha, cp.chave);
      if (!ops.length) return { ok: false, erro: cp.rotulo + ': não há escolha de atributo aqui.' };
      if (v && ops.indexOf(v) < 0) return { ok: false, erro: cp.rotulo + ': escolha ' + ops.join(' ou ') + '.' };
      return { ok: true, mudancas: KhTroca.mudancas(ficha, cp.chave, v), rotulo: cp.rotulo + ': ' + (v ? v + ' (escolhido)' : 'o maior') };
    }
    // o botão de um evento de item (F6, tabela rev. 11) que mexe num recurso atual:
    // "ao derrubar um inimigo: +1d4 Éter". bruto = o valor (já rolado, ou o número do
    // item); op 'soma' soma no atual, 'fixa' troca. Valida pelo campo do atual.
    function evento(ficha, caminho, op, bruto, rotulo) {
      if (!/^recursos\.(saude|stamina|eter)\.atual$/.test(str(caminho))) return { ok: false, erro: 'Este evento não mexe num recurso.' };
      var n = lerInteiro(bruto);
      if (n == null) return { ok: false, erro: 'Escreva o valor (o que rolou) em número inteiro.' };
      var atual = pega(ficha, caminho), rec = /^recursos\.(\w+)/.exec(caminho)[1];
      atual = typeof atual === 'number' ? atual : 0;
      var pedido = op === 'fixa' ? n : atual + n, novo = pedido;
      // "A cura não passa do máximo" (Sistema > Status): o ganho para no máximo; o que já
      // estava acima (digitado à mão) fica onde está
      var noMax = n > 0 && KhRegras && KhRegras.avaliar ? KhRegras.avaliar(ficha).nos['recurso.' + rec + '.max'] : null;
      var max = noMax ? noMax.valor : null;
      if (typeof max === 'number' && novo > max) novo = Math.max(max, op === 'fixa' ? 0 : atual);
      var r = mudancas(ficha, caminho, novo);
      if (r.ok) r.rotulo = (rotulo ? rotulo + ': ' : '') + (op === 'fixa' ? '= ' + fmt(n) : sinal(n)) + ' ' + RECURSOS[rec] +
        (novo < pedido ? ' (até o máximo, ' + fmt(novo) + ')' : '');
      return r;
    }
    // o interruptor do situacional (F6): liga/desliga a chave 'alvo#n' na entrada do
    // inventário (a coluna inteira é a mudança: o caminho do armazém não indexa lista)
    function mudancasSituacao(ficha, cp, bruto) {
      var b = obj(bruto) ? bruto : {}, k = str(b.valor);
      if (!/^[A-Za-z][A-Za-z0-9._-]*#\d+$/.test(k)) return { ok: false, erro: 'Situação inválida.' };
      var inv = obj(ficha) && obj(ficha.inventario) ? ficha.inventario : {}, col = null, i = -1;
      ['equipamentos', 'bugigangas'].some(function (cl) {
        return lista(inv[cl]).some(function (e, j) { if (obj(e) && e.uid === cp.uid) { col = cl; i = j; return true; } return false; });
      });
      if (!col) return { ok: false, erro: 'Este item não está mais no inventário.' };
      var nova = clone(inv[col]), e = nova[i];
      var l = lista(e.situacoes).filter(function (x) { return x !== k; });
      if (b.marcado) l.push(k);
      if (l.length) e.situacoes = l; else delete e.situacoes;
      return { ok: true, mudancas: [{ caminho: 'inventario.' + col, valor: nova }],
        rotulo: (semEmoji(e.nome) || 'Item') + ': situação ' + (b.marcado ? 'ligada' : 'desligada') };
    }
    // a pendência do Ofício(X) genérico da v2 (a migração não escolhe qual dos três recebe o grau)
    function pendenciaOficio(ficha) {
      var l = lista(obj(ficha) && obj(ficha.migracao) ? ficha.migracao.pendencias : null);
      for (var i = 0; i < l.length; i++) if (obj(l[i]) && l[i].campo === 'pericias.oficio') return { i: i, grau: Math.max(0, Math.min(4, Number(l[i].grau) || 0)) };
      return null;
    }
    function oficios() { return KhEstado.PERICIAS.filter(function (p) { return /^oficio-/.test(p); }); }
    function mudancasOficio(ficha, cp, bruto) {
      var pd = pendenciaOficio(ficha), id = str(bruto);
      if (!pd) return { ok: false, erro: 'Não há pendência do Ofício(X) nesta ficha.' };
      if (!id) return { ok: true, mudancas: [], rotulo: '' };
      if (oficios().indexOf(id) < 0) return { ok: false, erro: cp.rotulo + ': escolha um dos três Ofícios.' };
      var antes = Number(pega(ficha, 'pericias.' + id)) || 0;
      var pend = lista(ficha.migracao.pendencias).filter(function (x, i) { return i !== pd.i; });
      return { ok: true, mudancas: [{ caminho: 'pericias.' + id, valor: pd.grau }, { caminho: 'migracao.pendencias', valor: pend }],
        rotulo: 'O grau vai para ' + nomePericia(id) + ': ' + rotuloGrau(pd.grau),
        aviso: antes && antes !== pd.grau ? nomePericia(id) + ' tinha ' + rotuloGrau(antes) + ': agora ' + rotuloGrau(pd.grau) + '.' : '' };
    }

    // ---------------- a mudança de um campo ----------------
    // bruto: o texto digitado (texto, número, lista), o id escolhido (ref) ou,
    // no conjunto, {valor: id, marcado: bool}. op: {contexto (ref e conjunto)}
    function mudancas(ficha, caminho, bruto, op) {
      op = obj(op) ? op : {};
      var cp = campo(caminho);
      if (!cp) return { ok: false, erro: 'Este campo não se edita aqui.' };
      if (cp.tipo === 'ref') return mudancasRef(ficha, cp, bruto, op.contexto);
      if (cp.tipo === 'troca') return mudancasTroca(ficha, cp, bruto);
      if (cp.tipo === 'oficio') return mudancasOficio(ficha, cp, bruto);
      if (cp.tipo === 'situacao') return mudancasSituacao(ficha, cp, bruto);
      if (cp.tipo === 'conjunto') {
        var b = obj(bruto) ? bruto : {}, k = str(b.valor);
        if (!k) return { ok: false, erro: cp.rotulo + ': nada marcado.' };
        var atual = lista(pega(ficha, caminho)), tem = atual.some(function (x) { return chaveItem(x) === k; });
        var novo = atual.slice();
        if (b.marcado && !tem) novo.push(k);
        if (!b.marcado && tem) novo = atual.filter(function (x) { return chaveItem(x) !== k; });
        var cond = opcoesCondicao(op.contexto).filter(function (x) { return x.id === k; })[0];
        var nomeK = cond ? cond.nome : k;
        return { ok: true, mudancas: [{ caminho: caminho, valor: novo }], rotulo: rotuloPasso(cp, novo, (b.marcado ? 'marca ' : 'desmarca ') + nomeK) };
      }
      var r = ler(cp, bruto);
      if (!r.ok) return r;
      return { ok: true, mudancas: [{ caminho: caminho, valor: r.valor }], rotulo: rotuloPasso(cp, r.valor) };
    }
    // o stepper: o valor guardado (não o digitado) mais d, dentro da faixa
    function passo(ficha, caminho, d) {
      var cp = campo(caminho);
      if (!cp || cp.tipo !== 'inteiro') return { ok: false, erro: 'Este campo não tem − e +.' };
      var v = Number(pega(ficha, caminho)) || 0;
      var n = Math.max(cp.min, Math.min(cp.max, v + (Number(d) || 0)));
      return mudancas(ficha, caminho, n);
    }
    // clicar no círculo i (1 a 4): vira o grau i; clicar no último aceso apaga ele (i − 1)
    function grauClicado(ficha, pericia, i) {
      var g = Number(pega(ficha, 'pericias.' + pericia)) || 0;
      i = Math.max(1, Math.min(4, Number(i) || 1));
      return g === i ? i - 1 : i;
    }

    // ---------------- ajuste manual (M2) ----------------
    function ajustavel(caminho) { return !!KhEstado && KhEstado.ehCaminhoDeAjuste(caminho); }
    function motivoNaoAjuste(caminho) {
      var c = str(caminho);
      for (var i = 0; i < MOTIVOS.length; i++) if (MOTIVOS[i][0].test(c)) return MOTIVOS[i][1];
      return MOTIVO_PADRAO;
    }
    function tipoAjuste(caminho) {
      if (/^(?:resistencia|imunidade|vulnerabilidade)\./.test(str(caminho))) return 'booleano';
      if (KhEstado.CAMINHOS_DADO.indexOf(caminho) >= 0) return 'dado';
      return 'numero';
    }
    function textoAjuste(aj) {
      if (!obj(aj)) return '';
      if (typeof aj.valor === 'boolean') return 'valor fixo: ' + (aj.valor ? 'sim' : 'não');
      return aj.modo === 'soma' ? 'diferença ' + sinal(aj.valor) : 'valor fixo ' + fmt(aj.valor);
    }
    // o ajuste do pop-over. entrada: {modo:'fixa'|'soma', valor (texto; 'sim'/'nao' no booleano), motivo}
    // no: o nó avaliado (o calculado entra no calculadoEm do valor fixo, para o
    // aviso "o calculado mudou"); agora: a data ISO. -> {ok, ajuste} | {ok:false, erro}
    function montaAjuste(caminho, entrada, no, agora) {
      entrada = obj(entrada) ? entrada : {};
      if (!ajustavel(caminho)) return { ok: false, erro: 'Este número não aceita ajuste: ' + motivoNaoAjuste(caminho) };
      var t = tipoAjuste(caminho), modo = entrada.modo === 'soma' ? 'soma' : 'fixa', valor;
      if (t === 'booleano') {
        modo = 'fixa';
        var b = str(entrada.valor).toLowerCase();
        if (entrada.valor === true || b === 'sim') valor = true;
        else if (entrada.valor === false || b === 'nao' || b === 'não') valor = false;
        else return { ok: false, erro: 'Escolha sim ou não.' };
      } else if (t === 'dado' && modo === 'fixa') {
        valor = str(entrada.valor).trim().toLowerCase().replace(/−/g, '-').replace(/\s+/g, ' ')
          .replace(/\s*\+\s*/g, ' + ').replace(/\s*-\s*/g, ' - ');
        if (!valor) return { ok: false, erro: 'Digite o dado, como 1d8 ou 13 + 1d8.' };
      } else {
        valor = lerNumero(entrada.valor);
        if (valor == null) return { ok: false, erro: modo === 'soma' ? 'Digite a diferença, como +2 ou −1.' : 'Digite um número.' };
        if (modo === 'soma' && valor === 0) return { ok: false, erro: 'Uma diferença de 0 não muda nada: para tirar o ajuste, use Remover.' };
      }
      var aj = { modo: modo, valor: valor, temporario: false, desde: str(agora) || new Date().toISOString(), origem: 'manual' };
      var mot = str(entrada.motivo).replace(/\s+/g, ' ').trim();
      if (mot.length > MAX_MOTIVO) return { ok: false, erro: 'O motivo tem no máximo ' + MAX_MOTIVO + ' caracteres.' };
      if (mot) aj.motivo = mot;
      if (modo === 'fixa' && obj(no) && typeof no.calculado === 'number' && isFinite(no.calculado)) aj.calculadoEm = no.calculado;
      var e = KhEstado.validarAjuste(caminho, aj);
      if (e) return { ok: false, erro: e === 'valor-invalido' && t === 'dado' ? 'Digite o dado, como 1d8 ou 13 + 1d8.' : ERRO_AJUSTE[e] || 'Ajuste recusado (' + e + ').' };
      return { ok: true, ajuste: aj };
    }
    function ajustesDe(ficha) { return obj(ficha) && obj(ficha.ajustes) ? clone(ficha.ajustes) : {}; }
    // a mudança 'ajustes' com o ajuste novo (rotuloNo: o nome do número, para o passo)
    function mudancaAjuste(ficha, caminho, aj, rotuloNo) {
      var a = ajustesDe(ficha);
      a[caminho] = clone(aj);
      return { ok: true, mudancas: [{ caminho: 'ajustes', valor: a }],
        rotulo: 'Ajuste em ' + (semEmoji(rotuloNo) || caminho) + ': ' + textoAjuste(aj) };
    }
    // a mudança 'ajustes' sem os caminhos (remoção, um ou em lote)
    function mudancaRemover(ficha, caminhos, rotuloNo) {
      var a = ajustesDe(ficha), fora = lista(caminhos).filter(function (k) { return Object.prototype.hasOwnProperty.call(a, k); });
      if (!fora.length) return { ok: false, erro: 'Nenhum ajuste selecionado.' };
      fora.forEach(function (k) { delete a[k]; });
      return { ok: true, mudancas: [{ caminho: 'ajustes', valor: a }],
        rotulo: fora.length === 1 ? 'Remover o ajuste de ' + (semEmoji(rotuloNo) || fora[0]) : 'Remover ' + fora.length + ' ajustes' };
    }

    return { NOME_AT: NOME_AT, RECURSOS: RECURSOS, REFS: REFS, MANTER: MANTER, MODOS: MODOS, MAX_MOTIVO: MAX_MOTIVO,
      attrsTroca: attrsTroca, evento: evento, restos: restos, mudancaRestos: mudancaRestos, pendenciaOficio: pendenciaOficio, oficios: oficios,
      MAX_TEXTO: MAX_TEXTO, MAX_LISTA: MAX_LISTA, MAX_LORE: MAX_LORE,
      lerNumero: lerNumero, lerInteiro: lerInteiro, campo: campo, ler: ler, mudancas: mudancas, passo: passo,
      grauClicado: grauClicado, rotuloGrau: rotuloGrau, opcoesRef: opcoesRef, opcoesCondicao: opcoesCondicao, chaveItem: chaveItem,
      ajustavel: ajustavel, motivoNaoAjuste: motivoNaoAjuste, tipoAjuste: tipoAjuste, textoAjuste: textoAjuste,
      montaAjuste: montaAjuste, mudancaAjuste: mudancaAjuste, mudancaRemover: mudancaRemover };
  })();

  if (emNode) { module.exports = KhEdicao; return; }
  raiz.KhEdicao = KhEdicao;
})(typeof window !== 'undefined' ? window : this);
