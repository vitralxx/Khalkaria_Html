/* Khalkaria — Ficha · KhEfeitos: coleta dos Mods que mexem nos números (PURO, F3b).
 * De onde vem cada Mod (a "trilha"):
 *   raça / variante / subespécie  bônus de atributo (com "ou" e o alternativo), Ar natural
 *   identidade e entradas         Mods por fonte do contrato (Evasão, CD, Movimento, PMA, ações)
 *                                 + o snapshot entrada.mods (KhEstado.modsAplicaveis)
 *   nível                         +2 pontos por nível (atributos.porNivel)
 *   carta especial                +2 atributo (estado.pontos)
 *   condições ativas              efeitos do contrato (X, níveis, implicações, imunidade)
 *   itens                         data/efeitos.json pelo "quando" (carregado, equipado,
 *                                 sintonizado, munição em uso, ativado) e acumulaCopia
 *   ajustes                       ficha.ajustes (M2), só na trilha: quem aplica é o KhAjustes
 * Cada Mod: {alvo, op, valor, fonte:{tipo,id,nome}, status, ativo, motivo, ...}. Mod
 * inativo continua na trilha, com o motivo (nada some calado). O acúmulo entre
 * fontes (acumula:false / 'maior') é resolvido aqui; quem soma é o KhRegras.
 *
 * No node exporta por module.exports (carregado sozinho); no artefato js/ficha.js
 * o export já é o KhInv e este módulo só registra window.KhEfeitos no navegador.
 * Fonte: js/ficha/kh-efeitos.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhEstado = emNode ? require('./kh-estado.js') : raiz.KhEstado;

  var KhEfeitos = (function () {
    var ATRIBUTOS = ['FOR', 'DES', 'CON', 'INT', 'SAB'];
    var TIPOS_TECNICA = { tecnica: 1, ultimate: 1, marca: 1 };
    var QUANDO_ITEM = {
      carregado: function () { return true; },
      equipado: function (e) { return !!e.equipado; },
      sintonizado: function (e) { return !!e.sintonizado; },
      municaoAtiva: function (e) { return e.municaoAtiva === true; },
      ativado: function (e) { return e.ativo === true; }
    };
    var MOTIVO_QUANDO = {
      equipado: 'só quando equipado', sintonizado: 'só quando sintonizado',
      municaoAtiva: 'só com a munição em uso (ligação automática na F6)',
      ativado: 'só quando ativado (F6)'
    };

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function inteiro(x, p) { var n = parseInt(x, 10); return isFinite(n) ? n : p; }
    function chaveDe(id, pre) { return id && id.indexOf(pre) === 0 ? id.slice(pre.length) : null; }

    function mod(base, extra) { return Object.assign({ ativo: true, motivo: '' }, base, extra || {}); }
    function desliga(m, motivo) { m.ativo = false; if (!m.motivo) m.motivo = motivo; return m; }

    // ---------------- condições ----------------
    // Mods de UMA condição (com X): efeitos + níveis cumulativos até X
    function modsDeCondicao(dados, cond) {
      var def = dados.condicoes[cond.id];
      if (!def) return [];
      var nome = cond.x != null && def.x ? def.nome.replace(/\s+(X|\d+-\d+)$/, '') + ' ' + cond.x : def.nome;
      var fonte = { tipo: 'condicao', id: cond.id, nome: nome };
      var efs = lista(def.efeitos).slice();
      if (def.niveis) {
        var x = cond.x == null ? 1 : cond.x;
        Object.keys(def.niveis).map(Number).sort(function (a, b) { return a - b; }).forEach(function (n) {
          if (def.cumulativa ? n <= x : n === x) lista(def.niveis[String(n)]).forEach(function (e) { efs.push(Object.assign({ nivel: n }, e)); });
        });
      }
      return efs.map(function (e) {
        var m = mod({ alvo: e.alvo, op: e.op, valor: e.valor, fonte: fonte, status: e.st, fo: e.fo,
          x: cond.x, origemCondicao: cond.origem || 'ficha' });
        if (cond.stX && (dados.ordemStatus.indexOf(cond.stX) > dados.ordemStatus.indexOf(m.status))) m.status = cond.stX;
        ['tipoDano', 'momento', 'gatilho', 'escopo', 'nota', 'nivel'].forEach(function (k) { if (e[k] != null) m[k] = e[k]; });
        if (e.gatilho || e.momento) desliga(m, 'evento da Mesa (F5), não um número fixo');
        if (e.escopo) desliga(m, 'situacional: ' + e.escopo);
        if (cond.imune) desliga(m, 'imune a ' + def.nome + ' (' + cond.imune + ')');
        return m;
      });
    }

    // X inicial de uma condição sem X anotado: 'inicial' do contrato ou o padrão (G8, decisão)
    function xInicial(def) {
      if (!def.x) return { x: null };
      if (typeof def.x.inicial === 'number') return { x: def.x.inicial };
      if (typeof def.x.inicialPadrao === 'number') return { x: def.x.inicialPadrao, st: def.x.stPadrao || null };
      return { x: 1, st: 'semStatus' };
    }

    // condições ativas da ficha: empilhamento (mesma com X soma X; sem X renova),
    // implicações 'derivada' e imunidade a condição
    function condicoesAtivas(ficha, dados, imunes) {
      var porId = {}, ordem = [], avisos = [];
      lista(ficha.condicoes).forEach(function (c) {
        if (!obj(c) || !c.id) return;
        var def = dados.condicoes[c.id];
        if (!def) { avisos.push({ tipo: 'condicao-desconhecida', id: c.id }); return; }
        var xi = typeof c.x === 'number' ? { x: c.x } : xInicial(def);
        if (!porId[c.id]) { porId[c.id] = { id: c.id, nome: def.nome, x: xi.x, stX: xi.st || null, origem: 'ficha', uids: [] }; ordem.push(c.id); }
        else if (def.x && xi.x != null) {
          porId[c.id].x = (porId[c.id].x || 0) + xi.x;                 // empilhamento: mesmaCondicaoComX = somaX
          if (xi.st) porId[c.id].stX = xi.st;
        }
        porId[c.id].uids.push(c.uid);
      });
      ordem.forEach(function (id) {
        var def = dados.condicoes[id], c = porId[id];
        if (def.x && typeof def.x.max === 'number' && c.x > def.x.max) { avisos.push({ tipo: 'x-acima-do-maximo', id: id, x: c.x, max: def.x.max }); c.x = def.x.max; }
      });
      // implicações: só as 'derivada' (a 'separada', como o Exposto, é instância da Mesa)
      for (var passo = 0; passo < 3; passo++) {
        ordem.slice().forEach(function (id) {
          lista(dados.condicoes[id].implica).forEach(function (imp) {
            if (imp.modo !== 'derivada' || porId[imp.id] || !dados.condicoes[imp.id]) return;
            var d = dados.condicoes[imp.id], xi = xInicial(d);
            porId[imp.id] = { id: imp.id, nome: d.nome, x: xi.x, stX: xi.st || null, origem: 'implicada', de: id, uids: [] };
            ordem.push(imp.id);
          });
        });
      }
      ordem.forEach(function (id) { if (imunes[id]) porId[id].imune = imunes[id]; });
      return { lista: ordem.map(function (id) { return porId[id]; }), avisos: avisos };
    }

    // ---------------- raça ----------------
    function blocoRaca(ficha, dados) {
      var id = ficha.identidade && ficha.identidade.raca && ficha.identidade.raca.id;
      var chave = chaveDe(id, 'raca-');
      return chave && dados.racas[chave] ? { chave: chave, r: dados.racas[chave] } : null;
    }
    function idsIdentidade(ficha) {
      var i = ficha.identidade || {};
      return ['raca', 'variante', 'subespecie', 'classe', 'ramo', 'origem'].map(function (k) {
        return { campo: k, id: i[k] && i[k].id, nome: i[k] && i[k].nome };
      }).filter(function (x) { return !!x.id; });
    }
    function modsDeRaca(ficha, dados, out) {
      var br = blocoRaca(ficha, dados);
      if (!br) return;
      var r = br.r, ident = ficha.identidade, esc = obj(ident.escolhas) ? ident.escolhas : {};
      var sub = ident.subespecie && ident.subespecie.id && r.subespecies[ident.subespecie.id];
      var alt = esc['raca.atributos'] === 'alternativo';
      var bonus = sub ? sub.atributos : (alt ? r.alternativo : r.atributos);
      var fonte = sub ? { tipo: 'subespecie', id: ident.subespecie.id, nome: str(ident.subespecie.nome) || r.nome }
        : { tipo: 'raca', id: r.id, nome: r.nome + (alt ? ' (alternativo)' : '') };
      var migrado = ficha.atributos && ficha.atributos.migradoTotal === true;
      if (!bonus && r.atributos === null && !sub) {
        out.avisos.push({ tipo: 'raca-sem-subespecie', raca: r.id, msg: r.nome + ': os atributos variam por subespécie, e a ficha não tem uma' });
      }
      lista(bonus).forEach(function (b, i) {
        var chave = 'raca.atributos.' + i, n = b.quantidade || 1, escolhidos = [];
        if (Array.isArray(b.opcoes) && b.opcoes.length === 1) escolhidos = [b.opcoes[0]];
        else {
          var e = esc[chave];
          escolhidos = (Array.isArray(e) ? e : (e ? [e] : [])).filter(function (a) {
            return ATRIBUTOS.indexOf(a) >= 0 && (b.opcoes === 'qualquer' || lista(b.opcoes).indexOf(a) >= 0);
          });
        }
        if (escolhidos.length < n) {
          out.mods.push(desliga(mod({ alvo: 'atributo.?', op: 'soma', valor: b.valor, fonte: fonte, status: r.st, fo: r.fo,
            etapa: 'raca', escolha: chave }), 'escolha pendente: ' + (b.opcoes === 'qualquer' ? n + ' atributo(s) à escolha' : lista(b.opcoes).join(' ou ')) +
            ' (identidade.escolhas["' + chave + '"])'));
          return;
        }
        escolhidos.slice(0, n).forEach(function (a) {
          var m = mod({ alvo: 'atributo.' + a, op: 'soma', valor: b.valor, fonte: fonte, status: r.st, fo: r.fo, etapa: 'raca' });
          if (migrado) desliga(m, 'já no total digitado na v2 (migração)');
          out.mods.push(m);
        });
      });
      // Ar natural: o do traço da raça sempre; o da variante/subespécie só se for a da ficha
      lista(r.arNatural).forEach(function (a) {
        var daVariante = r.variantes.indexOf(a.fonte) >= 0;
        var tem = !daVariante || [ident.variante && ident.variante.id, ident.subespecie && ident.subespecie.id].indexOf(a.fonte) >= 0;
        var m = mod({ alvo: 'ar.natural', op: a.soma ? 'soma' : 'fixa', valor: a.valor, status: r.st, fo: r.fo,
          fonte: { tipo: daVariante ? 'variante' : 'raca', id: a.fonte, nome: a.nome || a.fonte } });
        if (!tem) return;
        out.mods.push(m);
      });
    }

    // ---------------- fontes do contrato (Evasão, CD, Movimento, PMA, ações) ----------------
    function modsDoContrato(id, fonte, dados, permanente, estado) {
      return lista(dados.fontes[id]).map(function (c) {
        var m = mod({ alvo: c.alvo, op: c.op, valor: c.valor, fonte: fonte, status: c.st, fo: c.fo });
        ['duracao', 'extra', 'condicao', 'escopo', 'nivel', 'custo'].forEach(function (k) { if (c[k] != null) m[k] = c[k]; });
        var passiva = /passiva/i.test(str(c.custo));
        if (c.duracao) desliga(m, 'situacional: dura ' + c.duracao);
        else if (c.escopo) desliga(m, 'situacional: ' + c.escopo);
        else if (!permanente && !passiva && !(estado && estado.ativo === true)) desliga(m, 'técnica: vale enquanto ativa (Mesa, F5)');
        return m;
      });
    }

    // ---------------- entradas ----------------
    function modsDeEntradas(ficha, dados, out) {
      var snapshot = KhEstado && KhEstado.modsAplicaveis ? KhEstado.modsAplicaveis(ficha) : [];
      var porUid = {};
      snapshot.forEach(function (s) { (porUid[s.uid] = porUid[s.uid] || []).push(s.mod); });
      lista(ficha.entradas).forEach(function (e) {
        if (!obj(e)) return;
        var nome = str(e.cache && e.cache.nome) || str(e.id);
        var fonte = { tipo: e.tipo, id: e.id, nome: nome };
        var permanente = !TIPOS_TECNICA[e.tipo];
        var estado = obj(e.estado) ? e.estado : {};
        lista(porUid[e.uid]).forEach(function (sm) {
          var m = mod(Object.assign({}, sm, { fonte: fonte, status: sm.status || 'semStatus' }));
          var q = sm.quando;
          if (q === 'ativo' || (!q && !permanente)) { if (estado.ativo !== true) desliga(m, 'vale enquanto ativa (Mesa, F5)'); }
          else if (q === 'escolhido' && !estado.escolhas) desliga(m, 'escolha pendente');
          if (e.orfao) m.motivo = m.motivo || 'entrada órfã: o snapshot dos Mods continua valendo';
          out.mods.push(m);
        });
        if (e.id) modsDoContrato(e.id, fonte, dados, permanente, estado).forEach(function (m) { out.mods.push(m); });
        // carta especial (+2 atributo, D13c): os pontos distribuídos ficam em estado.pontos
        if (e.tipo === 'carta' && estado.especial === true) {
          var p = obj(estado.pontos) ? estado.pontos : null;
          var st = dados.limiar.st;
          if (!p) out.mods.push(desliga(mod({ alvo: 'atributo.?', op: 'soma', valor: 2, fonte: fonte, status: st, fo: dados.limiar.fo,
            etapa: 'carta' }), 'pontos da carta especial não distribuídos (estado.pontos)'));
          else ATRIBUTOS.forEach(function (a) {
            var n = inteiro(p[a], 0);
            if (n) out.mods.push(mod({ alvo: 'atributo.' + a, op: 'soma', valor: n, fonte: fonte, status: st, fo: dados.limiar.fo, etapa: 'carta' }));
          });
        }
      });
    }

    // ---------------- nível (+2 por nível, D87) ----------------
    function modsDeNivel(ficha, dados, out) {
      var at = ficha.atributos || {}, nivel = inteiro(ficha.meta && ficha.meta.nivel, 1);
      var pn = obj(at.porNivel) ? at.porNivel : {};
      Object.keys(pn).sort().forEach(function (n) {
        var g = pn[n] || {}, nn = inteiro(n, 0);
        ATRIBUTOS.forEach(function (a) {
          var v = inteiro(g[a], 0);
          if (!v) return;
          var m = mod({ alvo: 'atributo.' + a, op: 'soma', valor: v, fonte: { tipo: 'nivel', id: 'nivel-' + n, nome: 'Nível ' + n },
            status: dados.atributos.porNivel.st, fo: dados.atributos.porNivel.fo, etapa: 'nivel' });
          if (nn > nivel) desliga(m, 'acima do nível atual (' + nivel + ')');
          else if (at.migradoTotal === true && at.nivelMigrado != null && nn <= at.nivelMigrado) desliga(m, 'já no total digitado na v2 (migração)');
          out.mods.push(m);
        });
      });
    }

    // ---------------- itens (data/efeitos.json) ----------------
    function modsDeItens(ficha, efeitos, out) {
      var inv = ficha.inventario || {};
      if (!efeitos) {
        var tem = ['bugigangas', 'equipamentos'].some(function (c) { return lista(inv[c]).length; });
        if (tem) out.avisos.push({ tipo: 'efeitos-indisponiveis', msg: 'Efeitos de item (data/efeitos.json) não carregados: itens não entram nos números' });
        out.efeitosDisponiveis = false;
        return;
      }
      var vistos = {};
      ['equipamentos', 'bugigangas'].forEach(function (col) {
        lista(inv[col]).forEach(function (e) {
          if (!obj(e) || !e.id) return;
          var ef = efeitos[e.id];
          if (!ef) return;
          var qtd = Math.max(1, inteiro(e.qtd, 1));
          var fonte = { tipo: 'item', id: e.id, nome: str(e.nome) || e.id, uid: e.uid };
          lista(ef.mods).forEach(function (m0) {
            var quando = m0.quando || ef.quando || 'carregado';
            var m = mod(Object.assign({}, m0, { fonte: fonte, status: m0.status || ef.status, quando: quando,
              copias: ef.acumulaCopia === false ? 1 : qtd, uid: e.uid }));
            var teste = QUANDO_ITEM[quando];
            if (!teste) desliga(m, 'quando "' + quando + '" fora do vocabulário');
            else if (!teste(e)) desliga(m, MOTIVO_QUANDO[quando] || 'inativo');
            if (/^capacidade\./.test(m.alvo)) desliga(m, 'capacidade vem do KhInv (inv.capacidade do registro) até a F6');
            if (m.op === 'escolha' || m.escolha) desliga(m, 'escolha do jogador (F6)');
            if (m.duracao) desliga(m, 'temporário (' + m.duracao + '): ativação na F6');
            var k = e.id + '|' + m0.alvo + '|' + m0.op;
            if (m.ativo && ef.acumulaCopia === false && vistos[k]) desliga(m, 'não acumula com outra cópia deste item');
            if (m.ativo) vistos[k] = true;
            out.mods.push(m);
          });
        });
      });
    }

    // ---------------- ajustes (só trilha; o KhAjustes aplica) ----------------
    function modsDeAjustes(ficha, out) {
      var aj = obj(ficha.ajustes) ? ficha.ajustes : {};
      Object.keys(aj).forEach(function (c) {
        var a = aj[c] || {};
        out.mods.push(mod({ alvo: c, op: a.modo, valor: a.valor, status: 'ajuste', etapa: 'ajuste', noFechamento: true,
          fonte: { tipo: 'ajuste', id: c, nome: str(a.motivo) || 'ajuste manual' },
          motivo: a.temporario && a.temporario.fim ? 'temporário até ' + a.temporario.fim : '' }));
      });
    }

    // ---------------- acúmulo entre fontes ----------------
    // Mod com acumula:false (ou 'maior') não soma com outras fontes no mesmo alvo:
    // vale o maior entre ele e a soma das outras (o perdedor fica inativo, com motivo).
    function valorNum(m) { return typeof m.valor === 'number' ? m.valor * (m.copias || 1) : null; }
    function resolverAcumulo(mods) {
      var grupos = {};
      mods.forEach(function (m) { if (m.ativo && m.op === 'soma' && valorNum(m) != null) (grupos[m.alvo] = grupos[m.alvo] || []).push(m); });
      Object.keys(grupos).forEach(function (alvo) {
        var g = grupos[alvo];
        g.filter(function (m) { return m.acumula === false || m.acumula === 'maior'; }).forEach(function (m) {
          if (!m.ativo) return;
          var outros = g.filter(function (o) { return o !== m && o.ativo && !(o.fonte && m.fonte && o.fonte.id === m.fonte.id && o.fonte.uid === m.fonte.uid); });
          if (!outros.length) return;
          var soma = outros.reduce(function (s, o) { return s + valorNum(o); }, 0);
          if (Math.abs(valorNum(m)) >= Math.abs(soma)) outros.forEach(function (o) { desliga(o, 'não acumula com ' + m.fonte.nome + ' (vale o maior)'); });
          else desliga(m, 'não acumula com outras fontes (vale o maior)');
        });
      });
      return mods;
    }

    // ---------------- coleta ----------------
    // opcoes: {dados (KhRegrasDados), efeitos (porId de data/efeitos.json) | null}
    function coletar(ficha, opcoes) {
      opcoes = opcoes || {};
      var dados = opcoes.dados || (raiz && raiz.KhRegrasDados) || (emNode ? require('./00-regras-dados.js') : null);
      var efeitos = opcoes.efeitos === undefined ? null : opcoes.efeitos;
      if (efeitos && efeitos.porId) efeitos = efeitos.porId;
      var out = { mods: [], condicoes: [], avisos: [], lembretes: [], efeitosDisponiveis: !!efeitos };
      ficha = ficha || {};
      modsDeRaca(ficha, dados, out);
      // identidade: Mods por fonte do contrato (variante/subespécie/raça/classe/ramo/origem)
      idsIdentidade(ficha).forEach(function (x) {
        modsDoContrato(x.id, { tipo: x.campo, id: x.id, nome: str(x.nome) || x.id }, dados, true).forEach(function (m) { out.mods.push(m); });
      });
      modsDeNivel(ficha, dados, out);
      modsDeEntradas(ficha, dados, out);
      modsDeItens(ficha, efeitos, out);
      // imunidade a condição: a marcada na ficha e a dos itens ativos
      var imunes = {};
      lista(ficha.imunidadesCondicao).forEach(function (c) { var id = obj(c) ? c.id : c; if (id) imunes[id] = 'ficha'; });
      out.mods.forEach(function (m) {
        var mm = /^imunidade\.condicao\.(.+)$/.exec(m.alvo || '');
        if (mm && m.ativo) imunes[mm[1]] = m.fonte.nome;
      });
      var ca = condicoesAtivas(ficha, dados, imunes);
      out.condicoes = ca.lista;
      ca.avisos.forEach(function (a) { out.avisos.push(a); });
      ca.lista.forEach(function (c) {
        modsDeCondicao(dados, c).forEach(function (m) { out.mods.push(m); });
        lista(dados.condicoes[c.id].implica).forEach(function (imp) {
          if (imp.modo !== 'derivada') out.lembretes.push({ tipo: 'implica', de: c.id, id: imp.id, modo: imp.modo });
        });
      });
      modsDeAjustes(ficha, out);
      resolverAcumulo(out.mods);
      return out;
    }

    // trilha: todos os Mods (ativos e inativos) de um alvo, ou agrupados por alvo
    function trilha(res, alvo) { return lista(res && res.mods).filter(function (m) { return m.alvo === alvo; }); }
    function porAlvo(res) {
      var o = {};
      lista(res && res.mods).forEach(function (m) { (o[m.alvo] = o[m.alvo] || []).push(m); });
      return o;
    }
    function porFonte(res) {
      var o = {};
      lista(res && res.mods).forEach(function (m) {
        var k = m.fonte ? m.fonte.tipo + ':' + m.fonte.id : '?';
        (o[k] = o[k] || []).push(m);
      });
      return o;
    }

    return {
      coletar: coletar, modsDeCondicao: modsDeCondicao, resolverAcumulo: resolverAcumulo,
      trilha: trilha, porAlvo: porAlvo, porFonte: porFonte
    };
  })();

  if (emNode) { module.exports = KhEfeitos; return; }
  raiz.KhEfeitos = KhEfeitos;
})(typeof window !== 'undefined' ? window : this);
