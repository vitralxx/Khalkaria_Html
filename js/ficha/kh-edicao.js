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

  var KhEdicao = (function () {
    var NOME_AT = { FOR: 'Força', DES: 'Destreza', CON: 'Constituição', INT: 'Inteligência', SAB: 'Sabedoria' };
    var RECURSOS = { saude: 'Saúde', stamina: 'Stamina', eter: 'Éter', classe: 'Recurso de Classe' };
    var REFS = { raca: 'Raça', variante: 'Variante', classe: 'Classe', ramo: 'Ramo', origem: 'Origem' };
    // o tipo do catálogo de cada referência da identidade (classe e ramo vêm dos blocos de data/classes)
    var TIPO_REF = { raca: 'raca', variante: 'variante', origem: 'origem' };
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
    function D() { return KhRegras && KhRegras.dados ? KhRegras.dados() : {}; }
    function nomePericia(id) {
      var p = lista(D().pericias).filter(function (x) { return x.id === id; })[0];
      return p ? str(p.nome) : id;
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
      if ((m = /^identidade\.(raca|variante|classe|ramo|origem)$/.exec(c))) return d({ tipo: 'ref', ref: m[1], rotulo: REFS[m[1]] });
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
        if (ref === 'variante') {
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

    // a mudança de uma referência; trocar a raça tira a variante (e a
    // subespécie) de outra raça, trocar a classe tira o ramo de outra classe
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
          if (!atual.id) return;
          var e = obj(ctx) && obj(ctx.porId) ? ctx.porId[k + ':' + atual.id] : null;
          if (e && str(e.raca) === r) return;
          out.push({ caminho: 'identidade.' + k, valor: { id: null, nome: '' } });
          avisos.push((k === 'variante' ? 'A variante ' : 'A subespécie ') + semEmoji(atual.nome || atual.id) + ' saiu: é de outra raça.');
        });
      }
      if (cp.ref === 'classe') {
        var ramo = refDe(ficha, 'ramo'), c = chaveDe(valor.id, 'classe-');
        var info = ramo.id && obj(ctx) && obj(ctx.ramos) ? ctx.ramos[ramo.id] : null;
        if (ramo.id && !(info && info.classe === c)) {
          out.push({ caminho: 'identidade.ramo', valor: { id: null, nome: '' } });
          avisos.push('O ramo ' + semEmoji(ramo.nome || ramo.id) + ' saiu: é de outra classe.');
        }
      }
      return { ok: true, mudancas: out, rotulo: rotuloPasso(cp, valor), aviso: avisos.join(' ') };
    }

    // ---------------- a mudança de um campo ----------------
    // bruto: o texto digitado (texto, número, lista), o id escolhido (ref) ou,
    // no conjunto, {valor: id, marcado: bool}. op: {contexto (ref e conjunto)}
    function mudancas(ficha, caminho, bruto, op) {
      op = obj(op) ? op : {};
      var cp = campo(caminho);
      if (!cp) return { ok: false, erro: 'Este campo não se edita aqui.' };
      if (cp.tipo === 'ref') return mudancasRef(ficha, cp, bruto, op.contexto);
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
      MAX_TEXTO: MAX_TEXTO, MAX_LISTA: MAX_LISTA, MAX_LORE: MAX_LORE,
      lerNumero: lerNumero, lerInteiro: lerInteiro, campo: campo, ler: ler, mudancas: mudancas, passo: passo,
      grauClicado: grauClicado, rotuloGrau: rotuloGrau, opcoesRef: opcoesRef, opcoesCondicao: opcoesCondicao, chaveItem: chaveItem,
      ajustavel: ajustavel, motivoNaoAjuste: motivoNaoAjuste, tipoAjuste: tipoAjuste, textoAjuste: textoAjuste,
      montaAjuste: montaAjuste, mudancaAjuste: mudancaAjuste, mudancaRemover: mudancaRemover };
  })();

  if (emNode) { module.exports = KhEdicao; return; }
  raiz.KhEdicao = KhEdicao;
})(typeof window !== 'undefined' ? window : this);
