'use strict';
// Apoio dos testes do estado v3 (não é *.test.js): catálogo real montado a
// partir de data/ e um storage falso com quota, contagem de escritas e
// enumeração (length/key), como o localStorage.
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..', '..');
const lerJSON = (...p) => JSON.parse(fs.readFileSync(path.join(RAIZ, ...p), 'utf8'));

// Os arquivos de data/ que o KhCatalogo (F3b) vai carregar, lidos do disco:
// data/catalogo/*.json, data/classes/*.json e data/racas/*.json.
function dadosCatalogo() {
  const pasta = (d) => fs.readdirSync(path.join(RAIZ, 'data', d)).filter((n) => n.endsWith('.json')).sort()
    .map((n) => lerJSON('data', d, n));
  return { catalogos: pasta('catalogo'), classes: pasta('classes'), racas: pasta('racas') };
}
// As entradas vêm do código de PRODUÇÃO (KhEstado.entradasDeCatalogo): os
// ramos com os apelidos que a v2 gravava e as corrupções do Corrompido.
function entradasCatalogo() {
  return require('../../js/ficha/kh-estado.js').entradasDeCatalogo(dadosCatalogo());
}

class Quota extends Error { constructor() { super('quota'); this.name = 'QuotaExceededError'; this.code = 22; } }

// limite em caracteres (chave + valor) somados; null = sem limite.
// Falha simulada: st.falha = (chave, valor) => Error | null; o erro devolvido
// é lançado no setItem antes de gravar (st.Quota é o QuotaExceededError).
function armazenamento(inicial, limite) {
  const m = new Map(Object.entries(inicial || {}));
  const st = {
    m, escritas: [], limite: limite == null ? null : limite, falha: null, Quota,
    get length() { return m.size; },
    key: (i) => [...m.keys()][i] ?? null,
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => {
      v = String(v);
      const erro = st.falha ? st.falha(k, v) : null;
      if (erro) throw erro;
      if (st.limite != null) {
        let tot = 0;
        m.forEach((val, key) => { if (key !== k) tot += key.length + val.length; });
        if (tot + k.length + v.length > st.limite) throw new Quota();
      }
      st.escritas.push(['set', k]); m.set(k, v);
    },
    removeItem: (k) => { st.escritas.push(['remove', k]); m.delete(k); },
    clear: () => { st.escritas.push(['clear']); m.clear(); },
    json: (k) => (m.has(k) ? JSON.parse(m.get(k)) : null),
    foto: () => JSON.stringify([...m.entries()].sort())
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

module.exports = { RAIZ, lerJSON, dadosCatalogo, entradasCatalogo, armazenamento, soLeitura, relogio, semente, Quota };
