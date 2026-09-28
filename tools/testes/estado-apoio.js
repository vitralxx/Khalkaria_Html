'use strict';
// Apoio dos testes do estado v3 (não é *.test.js): catálogo real montado a
// partir de data/ e um storage falso com quota, contagem de escritas e
// enumeração (length/key), como o localStorage.
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..', '..');
const lerJSON = (...p) => JSON.parse(fs.readFileSync(path.join(RAIZ, ...p), 'utf8'));

// Entradas {id, tipo, nome, classe?, raca?, resumo?, apelidos?} de:
// data/catalogo/*.json, os blocos de classe (classe e ramos) e as tabelas de
// corrupção do Corrompido (poderes e adversidades, tipo 'corrupcao').
function entradasCatalogo() {
  const out = [];
  const pasta = path.join(RAIZ, 'data', 'catalogo');
  fs.readdirSync(pasta).filter((n) => n.endsWith('.json')).sort().forEach((n) => {
    lerJSON('data', 'catalogo', n).entradas.forEach((e) => {
      out.push({ id: e.id, tipo: e.tipo, nome: e.nome, classe: e.classe || null, raca: e.raca || null, resumo: e.resumo || '' });
    });
  });
  fs.readdirSync(path.join(RAIZ, 'data', 'classes')).filter((n) => n.endsWith('.json')).sort().forEach((n) => {
    const c = lerJSON('data', 'classes', n).classe;
    const chave = c.id.replace(/^classe-/, '');
    out.push({ id: c.id, tipo: 'classe', nome: c.nome });
    (c.ramos || []).forEach((r) => {
      const semPrefixo = String(r.nome).replace(/^[^A-Za-zÀ-ÿ]*Ramo d[oa]s?\s+/, '');
      out.push({ id: r.id, tipo: 'ramo', nome: r.nome, classe: chave, apelidos: [r.chave, semPrefixo] });
    });
  });
  const corr = lerJSON('data', 'racas', 'corrompido.json').raca.corrupcao;
  ['poderes', 'adversidades'].forEach((k) => corr[k].itens.forEach((x) => {
    out.push({ id: x.id, tipo: 'corrupcao', nome: x.nome, raca: 'corrompido' });
  }));
  return out;
}

class Quota extends Error { constructor() { super('quota'); this.name = 'QuotaExceededError'; this.code = 22; } }

// limite em caracteres (chave + valor) somados; null = sem limite
function armazenamento(inicial, limite) {
  const m = new Map(Object.entries(inicial || {}));
  const st = {
    m, escritas: [], limite: limite == null ? null : limite,
    get length() { return m.size; },
    key: (i) => [...m.keys()][i] ?? null,
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => {
      v = String(v);
      if (st.limite != null) {
        let tot = 0;
        m.forEach((val, key) => { if (key !== k) tot += key.length + val.length; });
        if (tot + k.length + v.length > st.limite) throw new Quota();
      }
      st.escritas.push(['set', k]); m.set(k, v);
    },
    removeItem: (k) => { st.escritas.push(['remove', k]); m.delete(k); },
    clear: () => { st.escritas.push(['clear']); m.clear(); },
    json: (k) => (m.has(k) ? JSON.parse(m.get(k)) : null)
  };
  return st;
}

// storage que falha em QUALQUER escrita (modo sombra)
function soLeitura(inicial) {
  const st = armazenamento(inicial);
  st.setItem = (k) => { throw new Error('escrita proibida: ' + k); };
  st.removeItem = (k) => { throw new Error('remoção proibida: ' + k); };
  st.clear = () => { throw new Error('clear proibido'); };
  return st;
}

// relógio e aleatório determinísticos
function relogio(inicio) {
  let t = Date.parse(inicio || '2026-09-28T12:00:00.000Z');
  return () => new Date(t += 1000).toISOString();
}
function semente(s) {
  let x = s || 42;
  return () => { x = (x * 1103515245 + 12345) % 2147483648; return x / 2147483648; };
}

module.exports = { RAIZ, lerJSON, entradasCatalogo, armazenamento, soLeitura, relogio, semente };
