'use strict';
// Validador MÍNIMO de JSON Schema (draft-07, subconjunto) para os testes node,
// sem pip nem npm. Conhece só as palavras-chave abaixo; qualquer outra que não
// seja anotação derruba (lança), para o schema não depender de regra que ninguém
// confere. Usado por tools/testes/schema-v3.test.js e estado-v3.test.js.
//
//   const { validar } = require('./esquema-min.js');
//   validar(schema, dado)                 -> [] ou ['caminho: erro', ...]
//   validar(schema, dado, '#/$defs/ajuste') -> valida contra um sub-schema
//
// Não é *.test.js: o build e o index.js não o executam como teste.

const ANOTACOES = new Set(['$schema', '$id', 'title', 'description', 'default', 'examples', '$comment', '$defs', 'definitions']);
const CONHECIDAS = new Set(['type', 'const', 'enum', 'required', 'properties', 'additionalProperties',
  'patternProperties', 'propertyNames', 'items', 'minItems', 'maxItems', 'minimum', 'maximum',
  'minLength', 'pattern', '$ref', 'oneOf', 'anyOf', 'allOf']);

function tipoDe(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (typeof v === 'number') return Number.isInteger(v) ? 'integer' : 'number';
  return typeof v;
}
function casaTipo(v, t) {
  const r = tipoDe(v);
  return r === t || (t === 'number' && r === 'integer');
}
function igual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

function resolve(raiz, ref) {
  if (ref === '#') return raiz;
  if (!ref.startsWith('#/')) throw new Error(`$ref não suportado: ${ref}`);
  return ref.slice(2).split('/').reduce((o, k) => {
    k = k.replace(/~1/g, '/').replace(/~0/g, '~');
    if (!o || !(k in o)) throw new Error(`$ref não encontrado: ${ref}`);
    return o[k];
  }, raiz);
}

function valida(raiz, s, v, caminho, erros) {
  if (s === true || s === undefined) return;
  if (s === false) { erros.push(`${caminho}: não permitido`); return; }
  Object.keys(s).forEach((k) => {
    if (!CONHECIDAS.has(k) && !ANOTACOES.has(k) && !k.startsWith('x-') && !k.startsWith('_')) {
      throw new Error(`palavra-chave não suportada pelo esquema-min: "${k}" em ${caminho}`);
    }
  });
  const e0 = erros.length;
  if (s.$ref) valida(raiz, resolve(raiz, s.$ref), v, caminho, erros);
  if (s.type !== undefined) {
    const ts = Array.isArray(s.type) ? s.type : [s.type];
    if (!ts.some((t) => casaTipo(v, t))) { erros.push(`${caminho}: tipo ${tipoDe(v)}, esperado ${ts.join('|')}`); return; }
  }
  if ('const' in s && !igual(v, s.const)) erros.push(`${caminho}: diferente de ${JSON.stringify(s.const)}`);
  if (s.enum && !s.enum.some((x) => igual(x, v))) erros.push(`${caminho}: ${JSON.stringify(v)} fora de ${JSON.stringify(s.enum)}`);
  if (typeof v === 'number') {
    if (s.minimum !== undefined && v < s.minimum) erros.push(`${caminho}: ${v} < ${s.minimum}`);
    if (s.maximum !== undefined && v > s.maximum) erros.push(`${caminho}: ${v} > ${s.maximum}`);
  }
  if (typeof v === 'string') {
    if (s.minLength !== undefined && v.length < s.minLength) erros.push(`${caminho}: menor que ${s.minLength}`);
    if (s.pattern && !new RegExp(s.pattern).test(v)) erros.push(`${caminho}: "${v}" não casa ${s.pattern}`);
  }
  if (Array.isArray(v)) {
    if (s.minItems !== undefined && v.length < s.minItems) erros.push(`${caminho}: menos de ${s.minItems} itens`);
    if (s.maxItems !== undefined && v.length > s.maxItems) erros.push(`${caminho}: mais de ${s.maxItems} itens`);
    if (s.items) v.forEach((x, i) => valida(raiz, s.items, x, `${caminho}[${i}]`, erros));
  }
  if (tipoDe(v) === 'object') {
    (s.required || []).forEach((k) => { if (!(k in v)) erros.push(`${caminho}: falta "${k}"`); });
    const props = s.properties || {}, pats = s.patternProperties || {};
    Object.keys(v).forEach((k) => {
      const sub = `${caminho}.${k}`;
      if (s.propertyNames) valida(raiz, s.propertyNames, k, `${caminho}{${k}}`, erros);
      let coberta = false;
      if (k in props) { coberta = true; valida(raiz, props[k], v[k], sub, erros); }
      Object.keys(pats).forEach((p) => { if (new RegExp(p).test(k)) { coberta = true; valida(raiz, pats[p], v[k], sub, erros); } });
      if (!coberta && s.additionalProperties !== undefined) {
        if (s.additionalProperties === false) erros.push(`${sub}: propriedade não prevista`);
        else valida(raiz, s.additionalProperties, v[k], sub, erros);
      }
    });
  }
  if (s.allOf) s.allOf.forEach((x) => valida(raiz, x, v, caminho, erros));
  if (s.anyOf && !s.anyOf.some((x) => { const e = []; valida(raiz, x, v, caminho, e); return !e.length; })) {
    erros.push(`${caminho}: nenhum anyOf casa`);
  }
  if (s.oneOf) {
    const n = s.oneOf.filter((x) => { const e = []; valida(raiz, x, v, caminho, e); return !e.length; }).length;
    if (n !== 1) erros.push(`${caminho}: ${n} ramos do oneOf casam (esperado 1)`);
  }
  return erros.length === e0;
}

function validar(schema, dado, ref) {
  const erros = [];
  valida(schema, ref ? resolve(schema, ref) : schema, dado, '$', erros);
  return erros;
}

module.exports = { validar };
