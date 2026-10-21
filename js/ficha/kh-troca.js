/*
 * KhTroca — a troca manual do atributo de um cálculo (D7; Pedro, 2026-10-20, 03 §11).
 *
 * Uma regra só para todo número que usa "o maior entre dois atributos":
 *   pericia.<id>       perícia de dois atributos (Movimento, Convencimento, Intimidação, Enganação)
 *   cd                 CD da classe com escolha (Espadachim: Destreza ou Força)
 *   recurso.<r>        máximo de Stamina (FOR ou DES) e de Éter (INT ou SAB)
 * Padrão: o maior Mod. (no empate, o primeiro da lista). O jogador pode fixar
 * um dos atributos; vazio volta ao padrão. O motor (KhRegras), a edição
 * (KhEdicao, caminho 'troca.<chave>') e o desenho (KhFichaAbas, componente
 * .kh-troca) passam todos por aqui.
 *
 * Onde a ficha guarda (schema 3.0, sem mudar): pericia.<id> -> periciasAttr[<id>];
 * cd e recurso.<r> -> identidade.escolhas['attr.cd' | 'attr.recurso.<r>'].
 *
 * No node exporta por module.exports; no artefato js/ficha.js registra window.KhTroca.
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv

  var KhTroca = (function () {
    var RE_CHAVE = /^(?:pericia\.([a-z-]+)|cd|recurso\.(saude|stamina|eter))$/;
    var ROTULO_REC = { saude: 'Atributo da Saúde', stamina: 'Atributo da Stamina', eter: 'Atributo do Éter' };

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function valida(chave) { return RE_CHAVE.test(String(chave)); }

    // onde a ficha guarda a escolha: {raiz, k}
    function lugar(chave) {
      var m = RE_CHAVE.exec(String(chave));
      if (!m) return null;
      if (m[1]) return { raiz: 'periciasAttr', k: m[1] };
      return { raiz: 'escolhas', k: 'attr.' + chave };
    }
    // o atributo fixado pelo jogador, só se for um dos atributos da conta
    function guardado(ficha, chave, atributos) {
      var l = lugar(chave);
      if (!l || !obj(ficha)) return null;
      var v = l.raiz === 'periciasAttr' ? (obj(ficha.periciasAttr) ? ficha.periciasAttr[l.k] : null)
        : (obj(ficha.identidade) && obj(ficha.identidade.escolhas) ? ficha.identidade.escolhas[l.k] : null);
      return lista(atributos).indexOf(v) >= 0 ? v : null;
    }
    function entre(l) { return l.length < 2 ? l.join('') : l.slice(0, -1).join(', ') + ' e ' + l[l.length - 1]; }
    // o texto da escolha: "usa o maior entre Mod.FOR e Mod.DES" ou "usa Mod.FOR (escolhido)"
    function motivo(e) {
      if (!e) return '';
      return e.trocado ? 'usa Mod.' + e.usado + ' (escolhido)' : 'usa o maior entre ' + entre(e.atributos.map(function (a) { return 'Mod.' + a; }));
    }
    // valores[j] = Mod. de atributos[j] (null = sem valor) -> a escolha resolvida
    function resolver(chave, atributos, g, valores) {
      var i = g ? atributos.indexOf(g) : -1, trocado = i >= 0;
      if (!trocado) {
        i = 0;
        lista(valores).forEach(function (v, j) { if (v != null && (valores[i] == null || v > valores[i])) i = j; });
      }
      var e = { chave: chave, atributos: atributos.slice(), i: i, usado: atributos[i], trocado: trocado };
      e.motivo = motivo(e);
      return e;
    }
    // o rótulo do seletor
    function rotulo(chave, nomePericia) {
      var m = RE_CHAVE.exec(String(chave));
      if (!m) return 'Atributo';
      if (m[1]) return 'Atributo de ' + (nomePericia || m[1]);
      return m[2] ? ROTULO_REC[m[2]] : 'Atributo da CD';
    }
    // as mudanças de estado para fixar (v) ou voltar ao padrão ('')
    function mudancas(ficha, chave, v) {
      var l = lugar(chave);
      if (!l) return [];
      if (l.raiz === 'periciasAttr') return [{ caminho: 'periciasAttr.' + l.k, valor: v || undefined }];
      var esc = obj(ficha) && obj(ficha.identidade) && obj(ficha.identidade.escolhas) ? JSON.parse(JSON.stringify(ficha.identidade.escolhas)) : {};
      if (v) esc[l.k] = v; else delete esc[l.k];
      return [{ caminho: 'identidade.escolhas', valor: esc }];
    }

    return { valida: valida, lugar: lugar, guardado: guardado, resolver: resolver, motivo: motivo, rotulo: rotulo, mudancas: mudancas };
  })();

  if (emNode) { module.exports = KhTroca; return; }
  raiz.KhTroca = KhTroca;
})(typeof window !== 'undefined' ? window : this);
