/* Khalkaria — Ficha · KhAjustes: ajuste manual de campo derivado, por nó (PURO, F3b, M2).
 * O KhRegras avalia o grafo em ordem topológica e, ao FECHAR cada nó, chama
 * KhAjustes.aplicar(no, ajustes) antes que os dependentes o leiam: o ajuste é o
 * último termo daquele nó e se propaga (ajustar Mod.DES muda a Evasão e as
 * perícias de DES; ajustar a Evasão Passiva muda a Ativa).
 *   fixa  -> o campo vira o valor digitado
 *   soma  -> diferença sobre o calculado (acompanha o nível)
 * Caminho de estado (recurso.*.atual, base de atributo, grau…) é recusado: a
 * validação é a do KhEstado (PADRAO_AJUSTE, o mesmo do schema v3).
 * A conta continua visível: "calculado X · ajustado Y", e o chip avisa quando o
 * calculado mudou desde o ajuste (calculadoEm).
 *
 * No node exporta por module.exports (carregado sozinho); no artefato js/ficha.js
 * o export já é o KhInv e este módulo só registra window.KhAjustes no navegador.
 * Fonte: js/ficha/kh-ajustes.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhEstado = emNode ? require('./kh-estado.js') : raiz.KhEstado;

  var KhAjustes = (function () {
    var RE_DADO = /^\s*(?:(-?\d+)\s*\+\s*)?(\d+d\d+)(?:\s*([+-])\s*(\d+))?\s*$/;

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function str(x) { return x == null ? '' : String(x); }
    // número em pt-BR, com o sinal de menos tipográfico
    function fmt(n) {
      if (n === null || n === undefined) return '?';
      if (typeof n === 'boolean') return n ? 'sim' : 'não';
      if (typeof n === 'object' && n.dados) return textoDado(n);
      if (typeof n !== 'number') return str(n);
      var s = String(Math.round(n * 1000) / 1000).replace('.', ',');
      return s.charAt(0) === '-' ? '−' + s.slice(1) : s;
    }
    // {fixo, dados:['1d8']} <-> "13 + 1d8"
    // (dadosPrimeiro: "3d6 + 3", como o dano; senão "13 + 1d8", como a Evasão Ativa)
    function textoDado(d) {
      var partes = [];
      if (d.fixo && !d.dadosPrimeiro) partes.push(fmt(d.fixo));
      (d.dados || []).forEach(function (x) { partes.push(x); });
      if (d.fixo && d.dadosPrimeiro) partes.push(fmt(d.fixo));
      if (!partes.length) return '0';
      var s = partes.join(' + ');
      return s.replace(/\+ −/g, '− ');
    }
    function lerDado(txt) {
      var m = RE_DADO.exec(str(txt));
      if (!m) return null;
      var fixo = (m[1] ? parseInt(m[1], 10) : 0) + (m[4] ? (m[3] === '-' ? -1 : 1) * parseInt(m[4], 10) : 0);
      return { fixo: fixo, dados: [m[2]] };
    }

    function ehAjustavel(caminho) { return !!(KhEstado && KhEstado.ehCaminhoDeAjuste(caminho)); }

    // Aplica o ajuste do nó (se houver). Muda o nó no lugar e o devolve.
    // no: {caminho, valor, dado?, termos, formula:{simbolica, numerica}}
    function aplicar(no, ajustes) {
      var aj = obj(ajustes) ? ajustes[no.caminho] : null;
      no.calculado = no.dado ? textoDado(no.dado) : no.valor;
      no.ajuste = null;
      if (!aj) return no;
      no.avisos = no.avisos || [];
      var erro = KhEstado ? KhEstado.validarAjuste(no.caminho, aj) : 'sem-validador';
      if (erro) {
        no.avisos.push({ tipo: 'ajuste-recusado', erro: erro, msg: 'Ajuste em ' + no.caminho + ' recusado (' + erro + ')' });
        return no;
      }
      var antes = no.valor, novo, novoDado = null;
      if (no.dado) {
        if (aj.modo === 'fixa') {
          // expressão de dado ('1d12', '13 + 1d8'); número (dano fixo) vira só o fixo
          novoDado = typeof aj.valor === 'number' ? { fixo: aj.valor, dados: [] } : lerDado(aj.valor);
          if (!novoDado) { no.avisos.push({ tipo: 'ajuste-recusado', erro: 'valor-invalido', msg: 'Ajuste em ' + no.caminho + ' não é expressão de dado' }); return no; }
          novoDado.dadosPrimeiro = no.dado.dadosPrimeiro;
        }
        else { novoDado = { fixo: (no.dado.fixo || 0) + aj.valor, dados: (no.dado.dados || []).slice(), dadosPrimeiro: no.dado.dadosPrimeiro }; }
        novo = textoDado(novoDado);
      } else if (typeof aj.valor === 'boolean') {
        novo = aj.valor;
      } else if (aj.modo === 'fixa') {
        novo = aj.valor;
      } else if (typeof antes === 'number') {
        novo = antes + aj.valor;
      } else {
        no.avisos.push({ tipo: 'ajuste-sem-calculado', msg: 'Ajuste de diferença sem valor calculado em ' + no.caminho + ': vale só o fixo' });
        return no;
      }
      var calculadoNum = typeof no.calculado === 'number' ? no.calculado : null;
      no.valor = novo;
      if (novoDado) no.dado = novoDado;
      no.ajuste = {
        modo: aj.modo, valor: aj.valor, motivo: str(aj.motivo), temporario: aj.temporario || false,
        desde: aj.desde, origem: aj.origem || 'manual', calculadoEm: aj.calculadoEm == null ? null : aj.calculadoEm,
        mudou: aj.calculadoEm != null && calculadoNum != null && aj.calculadoEm !== calculadoNum
      };
      if (no.ajuste.mudou) no.avisos.push({ tipo: 'calculado-mudou', de: aj.calculadoEm, para: calculadoNum,
        msg: 'o calculado mudou de ' + fmt(aj.calculadoEm) + ' para ' + fmt(calculadoNum) });
      no.termos.push({
        rotulo: 'ajuste manual' + (aj.motivo ? ' (' + aj.motivo + ')' : ''),
        fonte: { tipo: 'ajuste', id: no.caminho, nome: str(aj.motivo) || 'ajuste manual' },
        op: aj.modo, valor: aj.valor, ativo: true,
        motivo: aj.temporario && aj.temporario.fim ? 'temporário até ' + aj.temporario.fim : '',
        status: 'ajuste'
      });
      no.formula.simbolica += aj.modo === 'fixa' ? ' → ajuste manual (valor fixo)' : ' + ajuste manual';
      no.formula.numerica += ' · calculado ' + fmt(no.calculado) + ' · ajustado ' + fmt(novo);
      return no;
    }

    // Tela "Ajustes" (M2): calculado × ajustado de cada ajuste, com o nó avaliado
    function listar(ficha, nos) {
      var aj = obj(ficha && ficha.ajustes) ? ficha.ajustes : {};
      return Object.keys(aj).sort().map(function (c) {
        var n = nos && nos[c];
        return { caminho: c, modo: aj[c].modo, valor: aj[c].valor, motivo: str(aj[c].motivo),
          desde: aj[c].desde, temporario: aj[c].temporario || false, origem: aj[c].origem || 'manual',
          calculado: n ? n.calculado : null, ajustado: n ? n.valor : null,
          mudou: !!(n && n.ajuste && n.ajuste.mudou), semNo: !n };
      });
    }

    return { aplicar: aplicar, listar: listar, ehAjustavel: ehAjustavel, fmt: fmt, textoDado: textoDado, lerDado: lerDado };
  })();

  if (emNode) { module.exports = KhAjustes; return; }
  raiz.KhAjustes = KhAjustes;
})(typeof window !== 'undefined' ? window : this);
