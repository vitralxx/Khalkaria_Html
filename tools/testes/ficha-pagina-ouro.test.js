'use strict';
// Snapshot de ouro da PÁGINA da ficha nova (js/ficha-pagina.js, F4.3): o HTML
// que o FP.render gera (topo, os 5 painéis e a lista de caminhos com conta)
// para a fixture ficha-v2-sintetica e variantes dela, com o catálogo e as
// regras de data/ do repo, tem de bater BYTE A BYTE com
// fixtures/ficha-pagina-render.golden.html.
//
// Por que existe: a F4.4a tira os renderizadores das 5 abas do
// js/ficha-pagina.js para o módulo do bundle js/ficha/kh-ficha-abas.js
// (KhFichaAbas, com prefixo e densidade). O ouro foi gravado com o código de
// ANTES da extração (commit próprio, anterior ao da mudança): a página tem de
// gerar exatamente o mesmo HTML depois dela.
//
// Variantes (cada uma passa por todos os ramos que a fixture alcança):
//   sintetica   a fixture como está (Batedor nível 2: Tier e Marca travados,
//               órfãs, Ofício(X) genérico)
//   espadachim  + carta rara (o texto guardado na v2 nunca aparece), carta de
//               atributo, magias de nível 3 e 5; classe sem contador (D105),
//               nível 5 (nada travado), Éter com alerta, e no resultado: Marcas
//               da Vhelor em abstinência, imunidade a condição, idiomas e
//               cartas queimadas
//   estados     sem ficha, ficha ilegível e motor ausente (topo e painéis)
//
// Mudança intencional do render (regra, dado sincronizado do Notion, desenho)?
// Regrave o ouro e revise o diff dele no git antes do commit:
//   KH_ATUALIZAR_GOLDEN=1 node --test tools/testes/ficha-pagina-ouro.test.js
// (com a variável ligada o teste REGRAVA o arquivo e passa; sem ela, só compara).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const FP = require('../../js/ficha-pagina.js');
const P = require('../../js/ficha/kh-previa.js');
const A = require('./estado-apoio.js');

const V2 = A.lerJSON('tools', 'testes', 'fixtures', 'ficha-v2-sintetica.json');
const EFEITOS = A.lerJSON('data', 'efeitos.json');
const GOLDEN = path.join(__dirname, 'fixtures', 'ficha-pagina-render.golden.html');
const copia = (x) => JSON.parse(JSON.stringify(x));
function dados() { return Object.assign(A.dadosCatalogo(), { efeitos: EFEITOS, glifos: '', erros: [] }); }
function comV2(v2) { return A.soLeitura({ khalkaria_ficha: JSON.stringify(v2) }); }

function completa() {
  const v2 = copia(V2);
  v2.cartasLimiar.push({ id: 'carta-carne-e-aco', tipo: 'carta', nome: 'Carne e Aço', descricao: 'EFEITO SECRETO DA RARA' });
  v2.cartasLimiar.push({ id: 'carta-musculos-de-ogro', tipo: 'carta', nome: 'Músculos de Ogro', descricao: 'Força.' });
  v2.grimorio.push({ id: 'magia-lanca-de-gelo', tipo: 'magia', nome: 'Lança de Gelo', descricao: '' });
  v2.grimorio.push({ id: 'magia-fissura-da-alma', tipo: 'magia', nome: 'Fissura da Alma', descricao: '' });
  return v2;
}
function espadachim() {
  const v2 = completa();
  v2.meta.classe = 'Espadachim'; v2.meta.ramo = ''; v2.meta.nivel = 5;
  v2.recursos.eter = { atual: -999, max: 10 };
  return v2;
}
// o que a migração da v2 não alcança, posto direto no resultado (o render só lê)
function enfeita(res) {
  res.ficha.vhelor = { marcas: 2, abstinente: true };
  res.ficha.imunidadesCondicao = [{ id: 'amedrontado', nome: 'Amedrontado' }, 'Enfeitiçado'];
  res.ficha.idiomas = ['Comum', { id: 'anao', nome: 'Anão' }];
  res.ficha.limiar = Object.assign({}, res.ficha.limiar, { queimadas: [{ id: 'carta-alma-resiliente', nivel: 2 }, 'carta-inexistente'] });
  return res;
}

function bloco(nome, r) {
  return '<!-- ' + nome + ' · topo -->\n' + r.topo + '\n' +
    FP.ABAS.map((a) => '<!-- ' + nome + ' · painel ' + a.id + ' -->\n' + r.paineis[a.id] + '\n').join('') +
    '<!-- ' + nome + ' · caminhos -->\n' + r.caminhos.join('\n') + '\n';
}
function calcula(v2) {
  const res = P.calcular(comV2(v2), dados(), '');
  assert.equal(res.estado, 'ok', res.erro);
  return res;
}
function gera() {
  const d = dados();
  let h = '';
  h += bloco('sintetica', FP.render(calcula(copia(V2)), { dados: d }));
  h += bloco('espadachim', FP.render(enfeita(calcula(espadachim())), { dados: d, base: 'http://site.test/' }));
  h += bloco('sem-ficha', FP.render(P.calcular(A.soLeitura({}), d, ''), { dados: d }));
  h += bloco('ilegivel', FP.render(P.calcular(A.soLeitura({ khalkaria_ficha: '{x' }), d, ''), { dados: d }));
  h += bloco('sem-motor', FP.render({ estado: 'sem-motor', erros: [] }, { dados: d }));
  h += bloco('falha', FP.render({ estado: 'falha', erro: 'rede', erros: ['data/catalogo/carta.json'] }, { dados: d }));
  return h;
}

test('ouro da página: FP.render das variantes da ficha-v2-sintetica == fixtures/ficha-pagina-render.golden.html, byte a byte', () => {
  const atual = Buffer.from(gera(), 'utf8');
  if (process.env.KH_ATUALIZAR_GOLDEN === '1') fs.writeFileSync(GOLDEN, atual);
  assert.ok(fs.existsSync(GOLDEN), 'falta o ouro: KH_ATUALIZAR_GOLDEN=1 node --test tools/testes/ficha-pagina-ouro.test.js');
  const ouro = fs.readFileSync(GOLDEN);
  if (atual.equals(ouro)) return;
  let i = 0;
  while (i < atual.length && i < ouro.length && atual[i] === ouro[i]) i++;
  const trecho = (b) => JSON.stringify(b.subarray(Math.max(0, i - 160), i + 160).toString('utf8'));
  assert.fail('a página mudou no byte ' + i + ' (atual ' + atual.length + ' B, ouro ' + ouro.length + ' B)\n' +
    '  ouro:  ' + trecho(ouro) + '\n  atual: ' + trecho(atual) + '\n' +
    'Se a mudança é intencional: KH_ATUALIZAR_GOLDEN=1 node --test tools/testes/ficha-pagina-ouro.test.js e revise o diff.');
});

test('ouro da página: cobre os ramos (cada variante desenhou o que devia)', () => {
  const h = fs.readFileSync(GOLDEN, 'utf8');
  [
    'data-rara', 'Efeito oculto até a carta ser revelada.', 'Foco Primordial', 'data-orfa', 'destrava no nível 4',
    'sem contador (D105)', 'Marcas da Vhelor', 'em abstinência', 'Imunidade a condição', 'Idiomas', 'Cartas queimadas',
    'grau a escolher', 'Avisos do motor e da migração', 'http://site.test/images/ficha/', '(sem ficha)',
    'não pôde ser lida', 'não carregou', 'O motor falhou ao calcular: rede', 'Não carregou: data/catalogo/carta.json'
  ].forEach((s) => assert.ok(h.includes(s), 'o ouro devia conter "' + s + '"'));
  assert.ok(!h.includes('EFEITO SECRETO DA RARA'), 'a rara nunca mostra o texto guardado');
});
