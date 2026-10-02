'use strict';
// Apoio dos testes de cor (não é *.test.js): os tokens hex do site, a regra de
// um seletor num CSS, a cor resolvida (hex, var() com reserva, color-mix em
// srgb) e o contraste WCAG. Usado pelo ficha-pagina.test.js (css/ficha-pagina.css)
// e pelo kh-ficha-abas.test.js (css/ficha-drawer.css).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..', '..');
const ler = (...p) => fs.readFileSync(path.join(RAIZ, ...p), 'utf8');

// --nome: #rrggbb do style.css e do tokens.css (o primeiro vence)
const TOKENS = (() => {
  const t = {};
  [ler('css', 'style.css'), ler('css', 'tokens.css')].forEach((css) => {
    for (const m of css.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\b/g)) if (!(m[1] in t)) t[m[1]] = m[2].toLowerCase();
  });
  return t;
})();
// o corpo da regra cujo seletor é exatamente sel
function regra(css, sel) {
  const m = new RegExp('(?:^|[}\\n])\\s*' + sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\{([^}]*)\\}').exec(css);
  assert.ok(m, 'regra "' + sel + '"');
  return m[1];
}
function hexRgb(h) { return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); }
function resolveCor(v, vars) {
  v = v.trim();
  let m;
  if (/^#[0-9a-f]{6}$/i.test(v)) return v.toLowerCase();
  if ((m = /^var\(--([a-z0-9-]+)(?:,\s*(.+))?\)$/.exec(v))) {
    const k = m[1];
    if (vars && k in vars) return resolveCor(vars[k], vars);
    if (k in TOKENS) return TOKENS[k];
    assert.ok(m[2], 'token sem valor: --' + k);
    return resolveCor(m[2], vars);
  }
  if ((m = /^color-mix\(in srgb,\s*(.+?)\s+(\d+)%,\s*(.+)\)$/.exec(v))) {
    const a = hexRgb(resolveCor(m[1], vars)), b = hexRgb(resolveCor(m[3], vars)), p = Number(m[2]) / 100;
    return '#' + a.map((x, i) => Math.round(x * p + b[i] * (1 - p)).toString(16).padStart(2, '0')).join('');
  }
  throw new Error('cor não resolvida: ' + v);
}
function contraste(a, b) {
  const L = (h) => {
    const [r, g, bl] = hexRgb(h).map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const x = L(a), y = L(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

module.exports = { TOKENS, regra, hexRgb, resolveCor, contraste };
