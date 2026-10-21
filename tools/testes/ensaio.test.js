'use strict';
// Modo Ensaio e seletor de fichas (F4.6a; docs/ficha-digital/07-f4-6-ensaio.md
// §1 e §2): js/ficha/kh-ensaio.js (KhEnsaio, a lógica) e js/ficha/kh-seletor.js
// (KhSeletor, o seletor e a faixa), e o que a página da ficha
// (js/ficha-pagina.js) e o drawer da ficha nova (js/ficha/kh-ficha-drawer.js)
// fazem com eles. Cobre:
//   - o adaptador (o prefixo em toda chave; key, length e clear só do ensaio);
//   - ligado = a marca do sessionStorage E a prévia;
//   - entrar (a ficha atual migrada em memória: a mesma conta e o mesmo desenho
//     da sombra; em branco sem ela) e sair (só o prefixo e a marca);
//   - o ciclo pelo armazém do ensaio (criar, trocar, duplicar, excluir com
//     export, importar ficha e pacote com conflito, exportar), o uso e o
//     QuotaExceeded;
//   - as puras do seletor e da faixa, e o topo da página (sem o Ensaio, o do ouro);
//   - no navegador (vm com o kh-ui.js, as fontes do ORDEM e a página, sobre o
//     DOM mínimo do dom-mini.js): sem a prévia nada aparece; o ciclo inteiro
//     pela interface, na página e no drawer, com um armazenamento ESPIÃO sobre
//     o localStorage e o sessionStorage que prova que nada é escrito fora do
//     prefixo em nenhum fluxo; "Sair da prévia" apaga o ensaio; QuotaExceeded
//     pela interface oferece "Exportar todas";
//   - a edição (F4.6b, §3) pela interface: os campos da página, os círculos de
//     grau, o stepper, o pop-over "Ajustar", a tela "Ajustes" com remoção em
//     lote, Desfazer/Refazer pelos botões e por Ctrl+Z / Ctrl+Y (KhTeclas: não
//     num campo de texto, não na ficha atual, não roubando o do Bazar), o
//     drawer só com recursos atuais e Sins, e o espião em tudo. As partes puras
//     da edição (KhEdicao, o log do armazém, o HTML do KhEditor) estão no
//     edicao.test.js.
// O ouro da página (ficha-pagina-ouro.test.js) e o do KhPrevia.render
// (previa.test.js) seguem nos testes deles: o modo sombra não muda.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const A = require('./estado-apoio.js');
const DOM = require('./dom-mini.js');
const E = require('../../js/ficha/kh-ensaio.js');
const S = require('../../js/ficha/kh-seletor.js');
const KE = require('../../js/ficha/kh-estado.js');
const P = require('../../js/ficha/kh-previa.js');
const FP = require('../../js/ficha-pagina.js');
const FD = require('../../js/ficha/kh-ficha-drawer.js');
const FA = require('../../js/ficha/kh-ficha-abas.js');

const ler = (...p) => fs.readFileSync(path.join(A.RAIZ, ...p), 'utf8');
const V2 = A.lerJSON('tools', 'testes', 'fixtures', 'ficha-v2-sintetica.json');
const EFEITOS = A.lerJSON('data', 'efeitos.json');
const DADOS = Object.assign(A.dadosCatalogo(), { efeitos: EFEITOS, glifos: '', erros: [] });
const PRE = 'khalkaria_ensaio:';
const MARCA = 'khalkaria_ensaio_ligado';
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;
const copia = (x) => JSON.parse(JSON.stringify(x));
const det = (s) => ({ agora: A.relogio(), aleatorio: A.semente(s || 11) });
// a escrita é do ensaio? (o prefixo ou a marca)
const doEnsaio = (k) => typeof k === 'string' && (k.startsWith(PRE) || k === MARCA);
// o ESPIÃO: toda escrita (set, remove, clear) registrada no storage falso é do ensaio
function soEnsaio(st, onde) {
  st.escritas.forEach((w) => assert.ok(w[0] !== 'clear' && doEnsaio(w[1]), (onde || '') + ': escrita fora do prefixo ' + JSON.stringify(w)));
}
const v2ls = (extra) => A.soLeitura(Object.assign({ khalkaria_ficha: JSON.stringify(V2) }, extra));

// ---------------------------------------------------------------- KhEnsaio
test('adaptador: o prefixo em toda chave; key, length e clear só veem o ensaio; o erro do storage passa reto', () => {
  const base = A.armazenamento({ khalkaria_ficha_aba: 'cartas', khalkaria_ficha_ativa: 'freal', [PRE + 'x']: '1' });
  const a = E.prefixado(base);
  assert.equal(a.prefixo, PRE);
  assert.equal(a.getItem('x'), '1');
  assert.equal(a.getItem('khalkaria_ficha_aba'), null, 'a chave de fora do prefixo não se vê');
  a.setItem('khalkaria_fichas_v3', '{}');
  assert.equal(base.getItem(PRE + 'khalkaria_fichas_v3'), '{}');
  assert.equal(base.getItem('khalkaria_fichas_v3'), null, 'a chave real não é tocada');
  assert.equal(a.length, 2);
  assert.deepEqual([a.key(0), a.key(1), a.key(2), a.key(-1)], ['x', 'khalkaria_fichas_v3', null, null]);
  a.removeItem('x');
  assert.equal(base.getItem(PRE + 'x'), null);
  a.setItem('y', 2);
  assert.equal(base.getItem(PRE + 'y'), '2', 'valor em texto, como o Storage');
  a.clear();
  assert.equal(a.length, 0);
  assert.deepEqual([...base.m.keys()], ['khalkaria_ficha_aba', 'khalkaria_ficha_ativa'], 'o clear só apaga o prefixo');
  soEnsaio(base, 'adaptador');
  // quota e storage bloqueado passam reto (o armazém trata)
  const b = E.prefixado(A.armazenamento({}, 10));
  assert.throws(() => b.setItem('k', 'x'.repeat(50)), (e) => e.name === 'QuotaExceededError');
  assert.throws(() => E.prefixado(null).setItem('k', 'v'), (e) => e.name === 'SecurityError');
  assert.equal(E.prefixado(null).getItem('k'), null);
  assert.equal(E.prefixado(null).length, 0);
  assert.equal(E.prefixado({ get length() { throw new Error('bloqueado'); } }).length, 0);
});

test('ligado: a marca do sessionStorage E a prévia; sem uma delas, storage bloqueado ou sem janela, desligado', () => {
  const win = (ls, ss, search) => ({ location: { search: search || '' }, localStorage: A.armazenamento(ls), sessionStorage: A.armazenamento(ss) });
  assert.equal(E.ligado(win({ khalkaria_ficha_previa: '1' }, { [MARCA]: '1' })), true);
  assert.equal(E.ligado(win({}, { [MARCA]: '1' }, '?ficha=v3')), true, 'a prévia pela URL');
  assert.equal(E.ligado(win({}, { [MARCA]: '1' })), false, 'sem a prévia, nada do ensaio');
  assert.equal(E.ligado(win({ khalkaria_ficha_previa: '1' }, {})), false, 'sem a marca');
  assert.equal(E.ligado(win({ khalkaria_ficha_previa: '1' }, { [MARCA]: 'sim' })), false, 'só "1"');
  const bloq = { location: { search: '?ficha=v3' } };
  Object.defineProperty(bloq, 'sessionStorage', { get() { throw new Error('SecurityError'); } });
  assert.equal(E.ligado(bloq), false);
  assert.equal(E.ligado(), false, 'no node, sem janela');
  assert.equal(E.CHAVE_LIGADO, MARCA);
  assert.equal(E.PREFIXO, PRE);
  assert.equal(E.EVENTO, 'kh:ensaio');
});

test('entrar: a 1ª vez põe a ficha atual migrada EM MEMÓRIA (a mesma conta e o mesmo desenho da sombra); de novo, só liga', () => {
  const ls = v2ls();   // só-leitura: qualquer escrita lança
  const ss = A.armazenamento({ khalkaria_ficha_aba: 'cartas', khalkaria_ficha_ativa: 'freal00000000' });
  const r = E.entrar(ss, ls, Object.assign({ dados: DADOS, versao: '' }, det()));
  assert.equal(r.ok, true);
  assert.equal(r.criada, 'migrada');
  assert.match(r.id, /^f[a-z0-9]{12}$/);
  assert.deepEqual(r.avisos.map((a) => a.tipo), ['orfa', 'orfa'], 'os avisos da migração voltam');
  assert.equal(ss.getItem(MARCA), '1');
  soEnsaio(ss, 'entrar');
  assert.equal(ss.getItem('khalkaria_ficha_ativa'), 'freal00000000', 'a ativa REAL da aba não muda');
  const arm = E.armazem(ss);
  assert.equal(arm.listar().length, 1);
  assert.equal(arm.ativa(), r.id);
  // a página desenha a ficha do ensaio igual à sombra da ficha atual: contas, topo e as 5 abas
  const ens = E.calcular(ss, DADOS, ''), som = P.calcular(ls, DADOS, '');
  assert.equal(ens.estado, 'ok');
  assert.equal(ens.ensaio, true);
  assert.equal(ens.fichaId, r.id);
  assert.equal(ens.ficha.meta.nome, 'Lira Vento-Sul');
  assert.deepEqual(ens.av.ordem, som.av.ordem);
  som.av.ordem.forEach((c) => assert.deepEqual(ens.av.nos[c].valor, som.av.nos[c].valor, c));
  const re = FP.render(ens, { dados: DADOS }), rs = FP.render(som, { dados: DADOS });
  assert.equal(re.topo, rs.topo);
  FA.ABAS.forEach((a) => assert.equal(re.paineis[a.id], rs.paineis[a.id], a.id));
  // de novo (outra página da aba): não cria outra, só liga
  const n = ss.escritas.length;
  const r2 = E.entrar(ss, ls, { dados: DADOS });
  assert.equal(r2.ok, true);
  assert.equal(r2.criada, null);
  assert.equal(r2.id, r.id);
  assert.equal(arm.listar().length, 1);
  assert.deepEqual(ss.escritas.slice(n), [['set', MARCA]]);
});

test('entrar: sem ficha atual nasce uma em branco; ilegível também (com o erro); sem sessionStorage ou sem espaço, recusa sem deixar nada', () => {
  const ss = A.armazenamento();
  const r = E.entrar(ss, A.soLeitura({}), { dados: DADOS });
  assert.equal(r.criada, 'branco');
  assert.equal(r.erroV2, null);
  const f = E.armazem(ss).ler(r.id);
  assert.equal(f.meta.nome, '');
  assert.equal(f.meta.nivel, 1);
  assert.equal(f.entradas.length, 0);
  const s2 = A.armazenamento();
  const r2 = E.entrar(s2, A.soLeitura({ khalkaria_ficha: '{x' }), { dados: DADOS });
  assert.equal(r2.criada, 'branco');
  assert.equal(r2.erroV2, 'json');
  assert.deepEqual(E.entrar(null, null, {}), { ok: false, erro: 'storage' });
  // sem espaço: recusa, e o que escreveu, apaga
  const s3 = A.armazenamento({ khalkaria_ficha_aba: 'nucleo' }, 3000);
  const r3 = E.entrar(s3, v2ls(), { dados: DADOS });
  assert.equal(r3.ok, false);
  assert.equal(r3.erro, 'quota');
  assert.deepEqual([...s3.m.keys()], ['khalkaria_ficha_aba']);
  [ss, s2, s3].forEach((s) => soEnsaio(s, 'entrar'));
});

test('sair: apaga só as chaves com o prefixo e a marca (as outras da aba ficam)', () => {
  const outras = { khalkaria_ficha_aba: 'cartas', khalkaria_ficha_ativa: 'freal', khalkaria_ensaio_outra: 'x', khalkaria_ficha_previa_recolhida: '1' };
  const ss = A.armazenamento(outras);
  E.entrar(ss, v2ls(), { dados: DADOS });
  E.armazem(ss).criar({ nome: 'Bran' });
  E.armazem(ss).gravarLog(E.armazem(ss).ativa(), { passos: [] });
  const r = E.sair(ss);
  assert.equal(r.ok, true);
  assert.ok(r.apagadas.length >= 5);
  assert.ok(r.apagadas.every(doEnsaio), JSON.stringify(r.apagadas));
  assert.ok(r.apagadas.includes(MARCA));
  assert.deepEqual(Object.fromEntries(ss.m), outras, 'só o ensaio saiu');
  soEnsaio(ss, 'sair');
  // sem nada do ensaio: nenhuma escrita
  const n = ss.escritas.length;
  assert.deepEqual(E.sair(ss), { ok: true, apagadas: [] });
  assert.equal(ss.escritas.length, n);
  assert.deepEqual(E.sair(null), { ok: true, apagadas: [] });
});

test('ciclo pelo armazém do ensaio: criar, trocar, duplicar, excluir (com export), importar (ficha, pacote, conflito) e exportar, tudo sob o prefixo', () => {
  const ss = A.armazenamento({ khalkaria_ficha_ativa: 'freal' });
  const ls = A.armazenamento({ khalkaria_ficha: JSON.stringify(V2), khalkaria_fichas_v3: '{"schema":"fichas/1","fichas":[]}' });
  const foto = ls.foto();
  E.entrar(ss, ls, Object.assign({ dados: DADOS }, det(3)));
  const arm = E.armazem(ss, det(5));
  const lira = arm.ativa();
  const c = arm.criar({ nome: 'Nova' });
  assert.equal(c.ok, true);
  assert.equal(arm.ativa(), c.id, 'a criada vira a ativa');
  assert.equal(arm.trocar(lira).ok, true);
  assert.equal(arm.ativa(), lira);
  const d = arm.duplicar(lira);
  assert.equal(arm.ler(d.id).meta.nome, 'Lira Vento-Sul (cópia)');
  assert.equal(arm.ativa(), d.id);
  // excluir: só com o export confirmado
  assert.equal(arm.excluir(d.id, { exportar: () => false }).erro, 'export-falhou');
  assert.ok(arm.ler(d.id), 'nada apagado');
  const exp = [];
  const x = arm.excluir(d.id, { exportar: (e) => { exp.push(e.nomeArquivo); return true; } });
  assert.equal(x.ok, true);
  assert.deepEqual(exp, ['Lira_Vento-Sul_(cópia).khalkaria.json']);
  assert.equal(arm.ler(d.id), null);
  assert.deepEqual(arm.listar().map((l) => l.id).sort(), [lira, c.id].sort());
  // exportar esta e todas
  const um = arm.exportar(lira);
  assert.equal(um.nomeArquivo, 'Lira_Vento-Sul.khalkaria.json');
  const todas = arm.exportarTodas();
  assert.equal(todas.nomeArquivo, 'khalkaria-fichas.json');
  assert.equal(todas.dados.schema, 'fichas/1');
  assert.equal(todas.dados.fichas.length, 2);
  const ens = E.exportarEnsaio(ss);
  assert.equal(ens.nomeArquivo, 'khalkaria-ensaio.json');
  assert.equal(ens.dados.schema, 'fichas/1');
  assert.equal(ens.dados.fichas.length, 2);
  // importar a mesma ficha: conflito; cópia (id novo); atualizar (com o export antes)
  assert.equal(arm.importar(um.dados).erro, 'conflito');
  const cp = arm.importar(um.dados, { conflito: 'copia' });
  assert.equal(cp.ok, true);
  assert.notEqual(cp.ids[0], lira);
  const mud = copia(um.dados);
  mud.meta.nome = 'Lira Renomeada';
  assert.equal(arm.importar(mud, { conflito: 'atualizar', exportar: () => false }).erro, 'export-falhou');
  const at = arm.importar(mud, { conflito: 'atualizar', exportar: () => true });
  assert.equal(at.ok, true);
  assert.equal(arm.ler(lira).meta.nome, 'Lira Renomeada');
  // o pacote num ensaio vazio (outra aba): recria o índice; e a ficha v2 do jogador entra migrada
  const ss2 = A.armazenamento();
  const arm2 = E.armazem(ss2);
  const imp = arm2.importar(JSON.stringify(arm.exportarTodas().dados), E.opcoesMotor(DADOS, ''));
  assert.equal(imp.ok, true);
  assert.deepEqual(imp.ids.slice().sort(), arm.listar().map((l) => l.id).sort());
  const v2 = arm2.importar(JSON.stringify(V2), E.opcoesMotor(DADOS, ''));
  assert.equal(v2.ok, true);
  assert.equal(arm2.ler(v2.ids[0]).meta.nome, 'Lira Vento-Sul');
  assert.equal(arm2.listar().length, 4);
  // o ESPIÃO: tudo sob o prefixo; o localStorage (a ficha atual e o índice real) intacto
  soEnsaio(ss, 'ciclo');
  soEnsaio(ss2, 'ciclo (outra aba)');
  assert.deepEqual(ls.escritas, []);
  assert.equal(ls.foto(), foto);
  assert.equal(ss.getItem('khalkaria_ficha_ativa'), 'freal');
});

test('uso: os bytes do ensaio (chave + valor, 2 por caractere) e os da aba toda; sobe ao duplicar', () => {
  const ss = A.armazenamento({ khalkaria_ficha_aba: 'cartas' });
  const u0 = E.uso(ss);
  assert.equal(u0.bytes, 0);
  assert.equal(u0.total, ('khalkaria_ficha_aba'.length + 'cartas'.length) * 2);
  assert.equal(u0.limite, KE.LIMITE_QUOTA);
  E.entrar(ss, A.soLeitura({}), { dados: DADOS });
  const u1 = E.uso(ss);
  let esp = 0;
  ss.m.forEach((v, k) => { if (doEnsaio(k)) esp += (k.length + v.length) * 2; });
  assert.equal(u1.bytes, esp);
  assert.equal(u1.total, u0.total + esp);
  assert.equal(u1.fracao, u1.total / KE.LIMITE_QUOTA);
  const arm = E.armazem(ss);
  arm.duplicar(arm.ativa());
  assert.ok(E.uso(ss).bytes > u1.bytes);
  assert.deepEqual(E.uso(null), { bytes: 0, total: 0, limite: KE.LIMITE_QUOTA, fracao: 0 });
});

test('QuotaExceeded no ensaio: a gravação recusa com a sugestão "exportarTodas", e a limpeza só mexe no prefixo', () => {
  // uma chave com cara de log REAL no sessionStorage: a limpeza de quota do armazém não a vê
  const ss = A.armazenamento({ 'khalkaria_ficha_v3_log:freal00000000': 'x' });
  E.entrar(ss, v2ls(), { dados: DADOS });
  const arm = E.armazem(ss);
  const id = arm.ativa();
  arm.gravarLog(id, { passos: [{ rotulo: 'a' }] });
  let tot = 0;
  ss.m.forEach((v, k) => { tot += k.length + v.length; });
  ss.limite = tot + 50;
  const r = arm.duplicar(id);
  assert.equal(r.ok, false);
  assert.equal(r.erro, 'quota');
  assert.equal(r.sugestao, 'exportarTodas');
  assert.equal(ss.getItem('khalkaria_ficha_v3_log:freal00000000'), 'x', 'fora do prefixo, nada é limpo');
  assert.equal(ss.getItem(PRE + 'khalkaria_ficha_v3_log:' + id), null, 'o log do ensaio foi limpo antes de recusar');
  assert.equal(arm.listar().length, 1);
  soEnsaio(ss, 'quota');
});

test('calcular: sem ficha, ficha ilegível e ok (ensaio:true); a mensagem do ensaio nas abas', () => {
  const ss = A.armazenamento();
  const r = E.calcular(ss, DADOS, '');
  assert.equal(r.estado, 'sem-ficha');
  assert.equal(r.ensaio, true);
  assert.equal(FA.mensagemEstado(r), 'O ensaio está sem fichas. Crie uma em branco ou importe um arquivo no seletor de fichas.');
  assert.match(FA.mensagemEstado({ estado: 'sem-ficha' }), /na ficha atual \(FICHA\)/, 'fora do ensaio, a de antes');
  E.entrar(ss, A.soLeitura({}), { dados: DADOS });
  const id = E.armazem(ss).ativa();
  assert.equal(E.calcular(ss, DADOS, '').estado, 'ok');
  ss.setItem(PRE + 'khalkaria_ficha_v3:' + id, '{x');
  const r2 = E.calcular(ss, DADOS, '');
  assert.equal(r2.estado, 'erro');
  assert.match(FA.mensagemEstado(r2), /^A ficha do ensaio não pôde ser lida \(ilegivel\)/);
  assert.equal(E.calcular(ss, {}, '').semCatalogo, undefined, 'ilegível não chega ao motor');
  // sem catálogo nem efeitos: calcula e avisa (como a sombra)
  const s2 = A.armazenamento();
  E.entrar(s2, A.soLeitura({}), {});
  const r3 = E.calcular(s2, {}, '');
  assert.equal(r3.estado, 'ok');
  assert.equal(r3.semCatalogo, true);
  assert.equal(r3.semEfeitos, true);
});

// ---------------------------------------------------------------- KhSeletor: puras
test('puras do seletor: bytes, data, a linha da ficha e o texto das recusas', () => {
  assert.equal(S.fmtBytes(0), '0 B');
  assert.equal(S.fmtBytes(1023), '1023 B');
  assert.equal(S.fmtBytes(1536), '1,5 KB');
  assert.equal(S.fmtBytes(5 * 1024 * 1024), '5,0 MB');
  assert.equal(S.fmtData(''), '');
  assert.equal(S.fmtData('lixo'), '');
  const d = new Date(2026, 9, 10, 14, 3);
  assert.equal(S.fmtData(d.toISOString()), '10/10 14:03');
  assert.equal(S.rotuloFicha({ nome: 'Lira', classe: 'Batedor', nivel: 2, atualizadoEm: d.toISOString() }), 'Lira — Batedor · Nível 2 · 10/10 14:03');
  assert.equal(S.rotuloFicha({ nome: '', classe: '', nivel: 1 }), '(sem nome) — sem classe · Nível 1');
  assert.equal(S.rotuloFicha({ nome: 'Ana \u{1F525}', classe: 'Monge', nivel: 3 }), 'Ana — Monge · Nível 3', 'sem emoji');
  assert.equal(S.textoErro({ erro: 'quota' }), S.QUOTA);
  assert.match(S.QUOTA, /QuotaExceeded/);
  assert.match(S.QUOTA, /Exporte todas/);
  assert.equal(S.textoErro({ erro: 'versao-futura', versao: '4.0' }), 'O arquivo é de uma versão mais nova do site (4.0): nada foi gravado.');
  assert.equal(S.textoErro({ erro: 'xyz' }), 'Não deu certo (xyz): nada foi gravado.');
  ['json', 'invalida', 'vazio', 'export-falhou', 'storage', 'inexistente'].forEach((e) => assert.ok(S.textoErro({ erro: e }).length > 10, e));
});

const fichasEx = [
  { id: 'fa000000000a', nome: 'Lira', classe: 'Batedor', nivel: 2, atualizadoEm: '2026-10-10T12:00:00.000Z' },
  { id: 'fb000000000b', nome: 'Bran', classe: '', nivel: 1, atualizadoEm: '' }
];
const USO = { bytes: 2048, total: 4096, limite: 5 * 1024 * 1024, fracao: 4096 / (5 * 1024 * 1024) };
const acoesDe = (c) => c.querySelectorAll('.ke-acoes [data-ke]').map((b) => [b.getAttribute('data-ke'), b.hasAttribute('disabled')]);

test('htmlSeletor: a lista (nome, classe, nível e data), a ativa selecionada, as 6 ações e o uso; sem ficha, as ações da ficha desligadas', () => {
  const doc = DOM.documento();
  const c = doc.createElement('div');
  c.innerHTML = S.htmlSeletor({ fichas: fichasEx, ativa: 'fb000000000b', uso: USO }, { prefixo: 'fp' });
  const sel = c.querySelector('select');
  assert.equal(sel.id, 'fp-ke-lista');
  assert.equal(c.querySelector('label.ke-rot').getAttribute('for'), 'fp-ke-lista');
  assert.equal(sel.getAttribute('data-ke-campo'), 'trocar');
  const ops = sel.querySelectorAll('option');
  assert.deepEqual(ops.map((o) => o.getAttribute('value')), ['fa000000000a', 'fb000000000b']);
  assert.deepEqual(ops.map((o) => o.hasAttribute('selected')), [false, true]);
  assert.deepEqual(ops.map((o) => o.textContent), fichasEx.map(S.rotuloFicha));
  assert.deepEqual(acoesDe(c), [['criar', false], ['duplicar', false], ['excluir', false], ['exportar', false], ['exportar-todas', false], ['importar', false]]);
  const arq = c.querySelector('input[type="file"]');
  assert.ok(arq.hidden);
  assert.equal(arq.getAttribute('data-ke-campo'), 'arquivo');
  assert.equal(c.querySelector('.ke-titulo').textContent, 'Fichas do ensaio (2)');
  assert.equal(c.querySelector('.ke-uso').textContent, 'Espaço do ensaio: 2,0 KB · a aba usa 4,0 KB de ~5,0 MB (menos de 0,1%)');
  assert.equal(c.querySelector('.ke-uso').getAttribute('data-ke-uso'), '2048');
  assert.equal(c.querySelector('.ke-msg').textContent, '');
  assert.equal(c.querySelector('.ke-msg').getAttribute('role'), 'status');
  assert.equal(c.querySelector('.ke-seletor').getAttribute('data-ke-densidade'), 'pagina');
  // vazio, no drawer
  c.innerHTML = S.htmlSeletor({ fichas: [], ativa: null }, { prefixo: 'fd', densidade: 'compacta' });
  assert.ok(c.querySelector('#fd-ke-lista').hasAttribute('disabled'));
  assert.equal(c.querySelector('option').textContent, 'Nenhuma ficha no ensaio');
  assert.deepEqual(acoesDe(c), [['criar', false], ['duplicar', true], ['excluir', true], ['exportar', true], ['exportar-todas', true], ['importar', false]]);
  assert.equal(c.querySelector('.ke-seletor').getAttribute('data-ke-densidade'), 'compacta');
  assert.equal(c.querySelector('.ke-uso'), null, 'sem o uso, nada');
  // ativa fora da lista (outra aba excluiu): nenhuma selecionada, as ações da ficha desligadas
  c.innerHTML = S.htmlSeletor({ fichas: fichasEx, ativa: 'fz', msg: { tipo: 'aviso', texto: 'x' } });
  assert.deepEqual(c.querySelectorAll('option').map((o) => o.hasAttribute('selected')), [false, false]);
  assert.equal(c.querySelector('[data-ke="duplicar"]').hasAttribute('disabled'), true);
  assert.ok(c.querySelector('.ke-msg').classList.contains('ke-msg-aviso'));
  assert.ok(c.querySelector('#ke-ke-lista'), 'prefixo padrão');
  assert.doesNotMatch(S.htmlSeletor({ fichas: [{ id: 'f1', nome: 'Ana \u{1F525}' }], ativa: 'f1', uso: USO }), EMOJI);
});

test('htmlSeletor: os diálogos (criar; excluir em dois passos; conflito do import; atualizar; quota)', () => {
  const doc = DOM.documento();
  const c = doc.createElement('div');
  const com = (dialogo, extra) => { c.innerHTML = S.htmlSeletor(Object.assign({ fichas: fichasEx, ativa: 'fa000000000a', dialogo }, extra)); return c.querySelector('.ke-dialogo'); };
  // criar: um form (Enter cria), o nome com o que já foi digitado
  let d = com({ tipo: 'criar' }, { nome: 'Ki"ra' });
  assert.equal(d.tagName, 'FORM');
  assert.equal(d.getAttribute('data-ke-form'), 'criar');
  assert.equal(d.querySelector('.ke-nome').getAttribute('value'), 'Ki"ra');
  assert.equal(d.querySelector('button[type="submit"]').textContent, 'Criar');
  assert.ok(d.querySelector('[data-ke="cancelar"]'));
  // excluir: passo 1 (baixar o export) e passo 2 (confirmar que salvou)
  const arq = [{ nomeArquivo: 'Lira.khalkaria.json' }];
  d = com({ tipo: 'antes', acao: 'excluir', nome: 'Lira', arquivos: arq, passo: 'baixar' });
  assert.equal(d.querySelector('.ke-dialogo-tit').textContent, 'Excluir "Lira" do ensaio');
  assert.match(d.textContent, /Passo 1 de 2: baixe o export desta ficha \(Lira\.khalkaria\.json\)/);
  assert.ok(d.querySelector('[data-ke="baixar-antes"]'));
  assert.equal(d.querySelector('[data-ke="confirmar"]'), null, 'nada a confirmar antes do export');
  d = com({ tipo: 'antes', acao: 'excluir', nome: 'Lira', arquivos: arq, passo: 'confirmar', salvou: false });
  assert.match(d.textContent, /Passo 2 de 2/);
  assert.ok(d.querySelector('[data-ke="confirmar"]').hasAttribute('disabled'), 'desligado até marcar que salvou');
  assert.equal(d.querySelector('.ke-salvei').hasAttribute('checked'), false);
  assert.equal(d.querySelector('[data-ke="confirmar"]').textContent, 'Excluir de vez');
  d = com({ tipo: 'antes', acao: 'excluir', nome: 'Lira', arquivos: arq, passo: 'confirmar', salvou: true });
  assert.equal(d.querySelector('[data-ke="confirmar"]').hasAttribute('disabled'), false);
  assert.ok(d.querySelector('.ke-salvei').hasAttribute('checked'));
  // conflito do import, e o atualizar
  d = com({ tipo: 'conflito', conflitos: ['fa000000000a'], nome: '"Lira"' });
  assert.match(d.textContent, /Ficha repetida no arquivo/);
  assert.deepEqual(d.querySelectorAll('[data-ke]').map((b) => b.getAttribute('data-ke')), ['atualizar', 'copia', 'cancelar']);
  d = com({ tipo: 'antes', acao: 'atualizar', nome: '"Lira"', arquivos: arq, passo: 'confirmar', salvou: true });
  assert.equal(d.querySelector('[data-ke="confirmar"]').textContent, 'Atualizar de vez');
  // quota: o aviso com "Exportar todas"
  d = com({ tipo: 'quota' });
  assert.equal(d.getAttribute('role'), 'alert');
  assert.match(d.textContent, /QuotaExceeded/);
  assert.equal(d.querySelector('[data-ke="exportar-todas"]').textContent, 'Exportar todas');
  assert.equal(com(null), null);
});

test('htmlFaixa: o texto da especificação, "Exportar ensaio" e "Sair do ensaio"; ao sair, a confirmação', () => {
  const doc = DOM.documento();
  const f = doc.createElement('div');
  f.innerHTML = S.htmlFaixa({ n: 2 });
  assert.equal(f.querySelector('.ke-faixa-txt').textContent, 'Ensaio: nada aqui é salvo na sua ficha. Tudo some ao fechar a aba.');
  assert.deepEqual(f.querySelectorAll('[data-ke]').map((b) => [b.getAttribute('data-ke'), b.textContent]),
    [['exportar-ensaio', 'Exportar ensaio'], ['sair', 'Sair do ensaio']]);
  assert.equal(f.querySelector('.ke-faixa-msg').getAttribute('role'), 'status');
  f.innerHTML = S.htmlFaixa({ n: 2, sair: true });
  assert.equal(f.querySelector('.ke-faixa-conf').textContent, 'Sair apaga as 2 fichas do ensaio desta aba. A sua ficha não muda.');
  assert.deepEqual(f.querySelectorAll('[data-ke]').map((b) => b.getAttribute('data-ke')), ['exportar-ensaio', 'sair-ok', 'sair-nao']);
  f.innerHTML = S.htmlFaixa({ n: 1, sair: true });
  assert.match(f.textContent, /Sair apaga a ficha do ensaio desta aba/);
  f.innerHTML = S.htmlFaixa({ n: 0, sair: true, msg: { tipo: 'aviso', texto: 'x' } });
  assert.match(f.textContent, /Sair apaga o ensaio desta aba/);
  assert.ok(f.querySelector('.ke-faixa-msg').classList.contains('ke-msg-aviso'));
  assert.doesNotMatch(S.htmlFaixa({ sair: true }) + S.htmlFaixa({}), EMOJI);
});

test('topo da página: sem o.ensaio, o de antes (o ouro); com a prévia e o Ensaio desligado, + "Ensaiar edição"; ligado, sem o seletor desabilitado', () => {
  const res = P.calcular(v2ls(), DADOS, '');
  const antes = FP.htmlTopo(res);
  assert.equal(FP.htmlTopo(res, undefined), antes);
  assert.equal(FP.render(res, { dados: DADOS }).topo, antes, 'o render sem o.ensaio é o do ouro');
  assert.match(antes, /<select disabled/);
  assert.doesNotMatch(antes, /fp-ensaiar|data-ke/);
  const off = FP.htmlTopo(res, { ensaio: false });
  const BOTAO = /<button type="button" class="kh-btn fp-ensaiar" data-ke="entrar" title="[^"]+">Ensaiar edição<\/button>/;
  assert.match(off, BOTAO);
  assert.equal(off.replace(new RegExp(' ' + BOTAO.source), ''), antes, 'o de antes mais o botão');
  assert.equal(FP.render(res, { dados: DADOS, ensaio: false }).topo, off);
  const on = FP.htmlTopo(res, { ensaio: true });
  assert.equal(on, antes.slice(antes.indexOf('<h1 class="fp-nome">')), 'ligado: sem o seletor desabilitado nem o aviso de só-leitura');
  // a casca: o lugar do seletor, escondido, antes do topo
  assert.match(FP.htmlCasca('nucleo'), /^<div class="fp-ke" id="fp-ke" hidden><\/div><header class="fp-topo" id="fp-topo">/);
  assert.doesNotMatch(FP.htmlCasca('nucleo', null, { ensaio: true }), /fp-topo-linha/);
  // o drawer: o botão no aviso de só-leitura e o lugar do seletor, escondido
  const doc = DOM.documento();
  const g = doc.createElement('aside');
  g.innerHTML = FD.htmlCasca({});
  const b = g.querySelector('.fd-gaveta-ensaiar');
  assert.equal(b.getAttribute('data-ke'), 'entrar');
  assert.equal(b.textContent, 'Ensaiar edição');
  assert.ok(g.querySelector('#fd-gaveta-ro').contains(b));
  assert.equal(g.querySelector('#fd-gaveta-ke').hidden, true);
  assert.ok(g.querySelector('.fd-gaveta-cab').contains(g.querySelector('#fd-gaveta-ke')));
});

// ---------------------------------------------------------------- navegador
const ORDEM = ler('js', 'ficha', 'ORDEM').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
const FONTES = ORDEM.filter((n) => n !== 'ficha-v2.js').map((n) => [n, ler('js', 'ficha', n)]);
const SRC_UI = ler('js', 'kh-ui.js');
const SRC_PAGINA = ler('js', 'ficha-pagina.js');
const BASE = 'http://site.test/';

test('ORDEM: o kh-ensaio.js e o kh-seletor.js depois do kh-previa.js e antes do drawer; no artefato', () => {
  const i = (n) => ORDEM.indexOf(n);
  assert.ok(i('kh-previa.js') < i('kh-ensaio.js') && i('kh-ensaio.js') < i('kh-seletor.js') && i('kh-seletor.js') < i('kh-ficha-drawer.js'));
  const art = ler('js', 'ficha.js');
  assert.ok(art.includes('// ==== js/ficha/kh-ensaio.js ====') && art.includes('// ==== js/ficha/kh-seletor.js ===='));
});

// opc: {ls, ss (objeto inicial ou um armazenamento falso já criado: o espião),
//       search, pagina (a página da ficha; sem ela, uma página de conteúdo com o drawer)}
function janela(opc) {
  opc = opc || {};
  const doc = DOM.documento({ body: opc.pagina ? { 'data-ficha-pagina': '' } : {} });
  const script = doc.createElement('script');
  script.setAttribute('src', BASE + 'js/ficha.js?v=abc123');
  doc.head.appendChild(script);
  const mc = doc.createElement('main');
  mc.className = opc.pagina ? 'main-content fp-pagina' : 'main-content';
  mc.innerHTML = opc.pagina ? '<div class="fp" id="fp" data-kf-ignorar><h1 class="fp-titulo">Ficha</h1><p class="fp-aviso" data-sem-previa>' + FP.AVISO + '</p></div>'
    : '<h1>Sistema</h1><p>texto</p>';
  doc.body.appendChild(mc);
  doc.criados.length = 0;
  const ls = opc.ls && opc.ls.escritas ? opc.ls : A.armazenamento(opc.ls || {});
  const ss = opc.ss && opc.ss.escritas ? opc.ss : A.armazenamento(opc.ss || {});
  const blobs = [], baixados = [], timers = [], ouvWin = {}, kf = [];
  class Blob { constructor(partes, o) { this.texto = partes.join(''); this.type = o && o.type; } }
  class URLx extends URL {
    static createObjectURL(b) { blobs.push(b); return 'blob:' + (blobs.length - 1); }
    static revokeObjectURL() {}
  }
  class CustomEvent { constructor(t, o) { Object.assign(this, DOM.evento(t, { detail: o && o.detail })); } }
  const sb = {
    document: doc, URL: URLx, Blob, CustomEvent, console,
    location: { search: opc.search || '', pathname: opc.pagina ? '/pages/ficha.html' : '/pages/sistema.html', hash: '',
      replace(u) { sb.foi = u; }, reload() { sb.recarregou = (sb.recarregou || 0) + 1; } },
    localStorage: ls, sessionStorage: ss,
    setTimeout: (f) => { timers.push(f); return timers.length; }, clearTimeout() {},
    requestAnimationFrame: (f) => f(),
    fetch: (u) => {
      const rel = u.replace(BASE, '').replace(/\?.*$/, '');
      const p = path.join(A.RAIZ, rel);
      if (!u.startsWith(BASE) || !fs.existsSync(p)) return Promise.resolve({ ok: false, status: 404 });
      const txt = fs.readFileSync(p, 'utf8');
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(JSON.parse(txt)), text: () => Promise.resolve(txt) });
    },
    // os ouvintes da janela (pageshow, storage…): j.win(tipo, ev) os dispara
    addEventListener: (t, f) => { (ouvWin[t] = ouvWin[t] || []).push(f); }, removeEventListener() {},
    // a ficha atual (v2.1) falsa, ESPIÃ também: o Ensaio não a chama (kf: as chamadas)
    KF: Object.freeze({ versao: '2', adicionar: (it) => { kf.push(['adicionar', it]); return 'u1'; }, abrir: (...a) => { kf.push(['abrir', a]); } })
  };
  sb.window = sb;
  vm.createContext(sb);
  vm.runInContext(SRC_UI, sb, { filename: 'kh-ui.js' });
  FONTES.forEach(([n, src]) => vm.runInContext(src, sb, { filename: n }));
  if (opc.pagina) vm.runInContext(SRC_PAGINA, sb, { filename: 'ficha-pagina.js' });
  // os downloads: o <a download> clicado e o texto do Blob dele
  doc.addEventListener('click', (e) => {
    const a = e.target;
    if (a && a.tagName === 'A' && a.hasAttribute('download')) {
      baixados.push({ nome: a.getAttribute('download'), texto: blobs[Number(a.getAttribute('href').slice(5))].texto });
    }
  }, true);
  const el = (id) => doc.getElementById(id);
  const clica = (x) => { assert.ok(x, 'o que clicar existe'); return DOM.despacha(doc, x, DOM.evento('click')); };
  const muda = (x, props) => { assert.ok(x, 'o campo existe'); Object.assign(x, props || {}); return DOM.despacha(doc, x, DOM.evento('change')); };
  const envia = (form) => { assert.ok(form, 'o form existe'); return DOM.despacha(doc, form, DOM.evento('submit')); };
  const tecla = (key) => DOM.despacha(doc, doc.activeElement || doc.body, DOM.evento('keydown', { key }));
  const ke = (cont, acao) => cont.querySelector('[data-ke="' + acao + '"]');
  const win = (tipo, ev) => (ouvWin[tipo] || []).forEach((f) => f(Object.assign({ type: tipo }, ev)));
  // arrastar (o text/plain do card: payload)
  const arrasta = (alvo, tipo, payload) => DOM.despacha(doc, alvo, DOM.evento(tipo, { dataTransfer: {
    dropEffect: '', getData: (t) => (t === 'text/plain' && payload != null ? JSON.stringify(payload) : ''), setData() {} } }));
  return { sb, doc, html: doc.documentElement, ls, ss, baixados, timers, ouvWin, kf, el, clica, muda, envia, tecla, ke, win, arrasta,
    faixa: () => el('ke-faixa'), drawer: () => sb.KhFichaDrawer.atual() };
}
const espera = () => new Promise((r) => setImmediate(r));
async function carrega(j) {
  for (let i = 0; i < 40; i++) await espera();
  const link = j.doc.querySelector('link[data-fd-gaveta]');
  if (link && !link._carregou) { link._carregou = true; DOM.despacha(j.doc, link, DOM.evento('load')); }
  return j;
}
const comPrevia = (extra) => Object.assign({ khalkaria_ficha_previa: '1', khalkaria_ficha: JSON.stringify(V2) }, extra);
const nomes = (cont) => cont.querySelectorAll('.ke-lista option').map((o) => o.textContent.split(' — ')[0]);

test('navegador sem a prévia: nada do Ensaio aparece, nem com a marca e fichas no sessionStorage (nenhum nó, CSS, ouvinte nem escrita)', async () => {
  // um ensaio deixado na aba (a marca e uma ficha) e a prévia desligada: invisível
  const ss0 = A.armazenamento();
  E.entrar(ss0, A.soLeitura({}), { dados: DADOS });
  for (const pagina of [false, true]) {
    const ss = A.armazenamento(Object.fromEntries(ss0.m));
    const foto = ss.foto();
    const j = await carrega(janela({ pagina, ls: { khalkaria_ficha: JSON.stringify(V2) }, ss }));
    assert.equal(j.sb.KhEnsaio.ligado(j.sb), false);
    assert.equal(j.faixa(), null);
    assert.equal(j.sb.KhSeletor.faixa(), null);
    assert.equal(j.doc.querySelector('link'), null, 'nenhum CSS');
    assert.equal(j.html.hasAttribute('data-ensaio'), false);
    assert.equal(j.doc.querySelector('[data-ke]'), null, 'nenhum botão do Ensaio');
    assert.equal(j.doc.getElementById('fd-gaveta'), null);
    assert.equal(j.doc.ouv['kh:ensaio'], undefined, 'nenhum ouvinte do Ensaio');
    assert.equal(j.ouvWin.pageshow, undefined, 'nem o do bfcache');
    assert.deepEqual(j.ls.escritas, []);
    assert.deepEqual(j.ss.escritas, []);
    assert.equal(j.ss.foto(), foto);
    if (pagina) assert.equal(j.el('fp').getAttribute('data-fp'), 'aviso');
  }
});

test('página da ficha, o ciclo inteiro pela interface (espião): entrar, criar, trocar, duplicar, excluir em dois passos, exportar, importar (cópia, atualizar, pacote), Esc e sair', async () => {
  const ls = A.armazenamento(comPrevia());
  const ss = A.armazenamento({ khalkaria_ficha_aba: 'nucleo', khalkaria_ficha_ativa: 'freal000000ab' });
  const fotoLs = ls.foto();
  const j = await carrega(janela({ pagina: true, ls, ss }));
  const topo = () => j.el('fp-topo'), nomeTopo = () => topo().querySelector('.fp-nome').textContent;
  const ke = j.el('fp-ke');
  // ---- desligado: a sombra da ficha atual, o botão no topo, o seletor escondido, sem faixa
  assert.equal(j.el('fp').getAttribute('data-fp'), 'casca');
  assert.equal(ke.hidden, true);
  assert.match(topo().innerHTML, /<select disabled/);
  const entrar = topo().querySelector('[data-ke="entrar"]');
  assert.equal(entrar.textContent, 'Ensaiar edição');
  assert.equal(j.faixa(), null);
  assert.deepEqual(j.ss.escritas, [], 'abrir a página não grava nada');
  // ---- entrar: a ficha atual migrada em memória
  j.clica(entrar);
  await carrega(j);
  assert.equal(j.ss.getItem(MARCA), '1');
  const faixa = j.faixa();
  assert.ok(faixa, 'a faixa fixa');
  assert.equal(faixa.parentNode, j.doc.body);
  assert.ok(faixa.hasAttribute('data-kf-ignorar'));
  assert.equal(faixa.getAttribute('role'), 'region');
  assert.equal(faixa.querySelector('.ke-faixa-txt').textContent, 'Ensaio: nada aqui é salvo na sua ficha. Tudo some ao fechar a aba.');
  assert.ok(j.html.hasAttribute('data-ensaio'));
  assert.equal(j.doc.querySelector('link[data-ke-css]').getAttribute('href'), BASE + 'css/ficha-ensaio.css?v=abc123');
  assert.equal(ke.hidden, false);
  assert.doesNotMatch(topo().innerHTML, /<select disabled|fp-ensaiar/);
  assert.equal(nomeTopo(), 'Lira Vento-Sul');
  assert.deepEqual(nomes(ke), ['Lira Vento-Sul']);
  assert.match(ke.querySelector('.ke-lista option').textContent, /^Lira Vento-Sul — Batedor · Nível 2 · \d\d\/\d\d \d\d:\d\d$/);
  assert.match(ke.querySelector('.ke-msg').textContent, /cópia da sua ficha atual, migrada em memória/);
  assert.equal(j.doc.activeElement, ke.querySelector('.ke-lista'), 'o foco no seletor');
  const arm = j.sb.KhEnsaio.armazem(j.ss);
  const lira = arm.ativa();
  // ---- criar: pede o nome (o foco vai a ele) e a nova vira a ativa
  j.clica(j.ke(ke, 'criar'));
  const nome = ke.querySelector('.ke-nome');
  assert.equal(j.doc.activeElement, nome);
  nome.value = 'Teste do Ensaio';
  j.envia(ke.querySelector('form[data-ke-form="criar"]'));
  assert.deepEqual(nomes(ke), ['Lira Vento-Sul', 'Teste do Ensaio']);
  assert.equal(nomeTopo(), 'Teste do Ensaio', 'a página redesenha com a criada');
  const teste = arm.ativa();
  assert.notEqual(teste, lira);
  // ---- trocar
  j.muda(ke.querySelector('.ke-lista'), { value: lira });
  assert.equal(arm.ativa(), lira);
  assert.equal(nomeTopo(), 'Lira Vento-Sul');
  // ---- duplicar: o uso do espaço sobe
  const uso = () => Number(ke.querySelector('.ke-uso').getAttribute('data-ke-uso'));
  const u0 = uso();
  j.clica(j.ke(ke, 'duplicar'));
  assert.equal(nomeTopo(), 'Lira Vento-Sul (cópia)');
  assert.ok(uso() > u0, 'o uso sobe ao duplicar');
  const dup = arm.ativa();
  // ---- excluir em dois passos: o export antes e a confirmação de que salvou
  j.clica(j.ke(ke, 'excluir'));
  assert.match(ke.querySelector('.ke-dialogo').textContent, /Passo 1 de 2/);
  assert.equal(j.ke(ke, 'confirmar'), null);
  assert.equal(j.doc.activeElement, j.ke(ke, 'baixar-antes'));
  j.clica(j.ke(ke, 'baixar-antes'));
  assert.deepEqual(j.baixados.map((b) => b.nome), ['Lira_Vento-Sul_(cópia).khalkaria.json']);
  assert.equal(JSON.parse(j.baixados[0].texto).id, dup, 'o export é o da ficha a excluir');
  assert.ok(j.ke(ke, 'confirmar').hasAttribute('disabled'), 'desligado até marcar que salvou');
  j.clica(j.ke(ke, 'confirmar'));
  assert.ok(arm.ler(dup), 'sem a confirmação, nada é apagado');
  j.muda(ke.querySelector('.ke-salvei'), { checked: true });
  assert.equal(j.ke(ke, 'confirmar').hasAttribute('disabled'), false);
  j.clica(j.ke(ke, 'confirmar'));
  assert.equal(arm.ler(dup), null);
  assert.equal(nomes(ke).length, 2);
  assert.match(ke.querySelector('.ke-msg').textContent, /excluída do ensaio/);
  // ---- exportar esta e todas
  const ativa = arm.ativa();
  j.clica(j.ke(ke, 'exportar'));
  const esta = j.baixados[j.baixados.length - 1];
  assert.equal(esta.nome, arm.exportar(ativa).nomeArquivo);
  assert.equal(JSON.parse(esta.texto).id, ativa);
  j.clica(j.ke(ke, 'exportar-todas'));
  const todas = j.baixados[j.baixados.length - 1];
  assert.equal(todas.nome, 'khalkaria-fichas.json');
  assert.equal(JSON.parse(todas.texto).schema, 'fichas/1');
  assert.equal(JSON.parse(todas.texto).fichas.length, 2);
  // ---- importar a mesma ficha: conflito; "Importar como cópia"
  const arquivo = (txt) => ({ files: [{ name: 'x.khalkaria.json', text: () => Promise.resolve(txt) }] });
  j.muda(ke.querySelector('.ke-arquivo'), arquivo(esta.texto));
  await carrega(j);
  assert.match(ke.querySelector('.ke-dialogo').textContent, /Ficha repetida no arquivo/);
  assert.equal(j.doc.activeElement, j.ke(ke, 'atualizar'));
  j.clica(j.ke(ke, 'copia'));
  await carrega(j);
  assert.equal(nomes(ke).length, 3);
  assert.notEqual(arm.ativa(), ativa, 'a cópia, com id novo, vira a ativa');
  // ---- importar de novo, com o nome mudado: "Atualizar", com o export antes e a confirmação
  const mudada = JSON.parse(esta.texto);
  mudada.meta.nome = 'Renomeada no Arquivo';
  j.muda(ke.querySelector('.ke-arquivo'), arquivo(JSON.stringify(mudada)));
  await carrega(j);
  j.clica(j.ke(ke, 'atualizar'));
  assert.match(ke.querySelector('.ke-dialogo').textContent, /Atualizar com o arquivo importado/);
  const nb = j.baixados.length;
  j.clica(j.ke(ke, 'baixar-antes'));
  assert.equal(j.baixados.length, nb + 1);
  assert.equal(JSON.parse(j.baixados[nb].texto).meta.nome, arm.ler(ativa).meta.nome, 'o export da que vai ser substituída');
  j.clica(j.ke(ke, 'confirmar'));
  await carrega(j);
  assert.notEqual(arm.ler(ativa).meta.nome, 'Renomeada no Arquivo', 'sem a confirmação, nada muda');
  j.muda(ke.querySelector('.ke-salvei'), { checked: true });
  j.clica(j.ke(ke, 'confirmar'));
  await carrega(j);
  assert.equal(arm.ler(ativa).meta.nome, 'Renomeada no Arquivo');
  assert.equal(arm.ativa(), ativa);
  assert.equal(nomeTopo(), 'Renomeada no Arquivo');
  assert.equal(nomes(ke).length, 3);
  // ---- arquivo que não é ficha: o aviso, nada gravado
  const ne = j.ss.escritas.length;
  j.muda(ke.querySelector('.ke-arquivo'), arquivo('não é json'));
  await carrega(j);
  assert.equal(ke.querySelector('.ke-msg').textContent, 'O arquivo não é um JSON válido.');
  assert.equal(j.ss.escritas.length, ne);
  // ---- Esc fecha o diálogo aberto e devolve o foco ao botão
  j.clica(j.ke(ke, 'criar'));
  assert.ok(ke.querySelector('.ke-dialogo'));
  j.tecla('Escape');
  assert.equal(ke.querySelector('.ke-dialogo'), null);
  assert.equal(j.doc.activeElement, ke.querySelector('.ke-criar'));
  // ---- a faixa: "Exportar ensaio" baixa o pacote fichas/1
  j.clica(j.ke(j.faixa(), 'exportar-ensaio'));
  const pac = j.baixados[j.baixados.length - 1];
  assert.equal(pac.nome, 'khalkaria-ensaio.json');
  assert.equal(JSON.parse(pac.texto).schema, 'fichas/1');
  assert.equal(JSON.parse(pac.texto).fichas.length, 3);
  // ---- "Sair do ensaio": confirma; "Continuar" volta; "Sair e apagar" apaga só o prefixo
  j.clica(j.ke(j.faixa(), 'sair'));
  assert.match(j.faixa().textContent, /Sair apaga as 3 fichas do ensaio desta aba\. A sua ficha não muda\./);
  j.clica(j.ke(j.faixa(), 'sair-nao'));
  assert.ok(j.ke(j.faixa(), 'sair'));
  j.clica(j.ke(j.faixa(), 'sair'));
  j.clica(j.ke(j.faixa(), 'sair-ok'));
  assert.equal(j.faixa(), null);
  assert.equal(j.html.hasAttribute('data-ensaio'), false);
  assert.deepEqual(Object.fromEntries(j.ss.m), { khalkaria_ficha_aba: 'nucleo', khalkaria_ficha_ativa: 'freal000000ab' }, 'só o prefixo e a marca saíram');
  assert.equal(ke.hidden, true);
  assert.match(topo().innerHTML, /<select disabled/);
  assert.equal(nomeTopo(), 'Lira Vento-Sul', 'de volta à sombra da ficha atual');
  // ---- entrar de novo (a ficha atual, com id novo) e importar o pacote do ensaio
  j.clica(topo().querySelector('[data-ke="entrar"]'));
  await carrega(j);
  assert.equal(nomes(ke).length, 1);
  j.muda(ke.querySelector('.ke-arquivo'), arquivo(pac.texto));
  await carrega(j);
  assert.equal(nomes(ke).length, 4, 'o pacote: 3 fichas novas');
  assert.match(ke.querySelector('.ke-msg').textContent, /^3 fichas importadas/);
  j.clica(j.ke(j.faixa(), 'sair'));
  j.clica(j.ke(j.faixa(), 'sair-ok'));
  assert.equal(ke.hidden, true);
  assert.equal(ke.querySelector('.ke-msg'), null, 'a mensagem do import sai junto com o ensaio');
  // ---- o ESPIÃO: nenhuma escrita no localStorage; no sessionStorage, só o prefixo e a marca
  assert.deepEqual(j.ls.escritas, []);
  assert.equal(j.ls.foto(), fotoLs);
  assert.ok(j.ss.escritas.length > 20, 'os fluxos gravaram (no ensaio)');
  soEnsaio(j.ss, 'página');
  assert.deepEqual(Object.fromEntries(j.ss.m), { khalkaria_ficha_aba: 'nucleo', khalkaria_ficha_ativa: 'freal000000ab' });
});

test('drawer: "Ensaiar edição" no cabeçalho; o seletor compacto no lugar do aviso; criar e trocar redesenham o drawer; outra página da aba já abre no ensaio (espião)', async () => {
  const ls = A.armazenamento(comPrevia({ khalkaria_ficha3_dock: 'aberto' }));
  const ss = A.armazenamento();
  const j = await carrega(janela({ ls, ss }));
  const g = j.el('fd-gaveta'), ro = j.el('fd-gaveta-ro'), ke = j.el('fd-gaveta-ke');
  assert.equal(ro.hidden, false);
  assert.equal(ke.hidden, true);
  assert.equal(j.drawer().resultado().ensaio, undefined, 'a sombra');
  assert.equal(j.faixa(), null);
  j.clica(g.querySelector('.fd-gaveta-ensaiar'));
  await carrega(j);
  assert.equal(ro.hidden, true, 'o aviso de só-leitura dá lugar ao seletor');
  assert.equal(ke.hidden, false);
  assert.equal(ke.querySelector('.ke-seletor').getAttribute('data-ke-densidade'), 'compacta');
  assert.ok(ke.querySelector('#fd-ke-lista'));
  let res = j.drawer().resultado();
  assert.equal(res.ensaio, true);
  assert.equal(res.ficha.meta.nome, 'Lira Vento-Sul');
  assert.ok(j.faixa());
  assert.equal(j.doc.querySelectorAll('link[data-ke-css]').length, 1);
  // criar: o drawer redesenha (o nome no cabeçalho)
  j.clica(j.ke(ke, 'criar'));
  ke.querySelector('.ke-nome').value = 'Bran';
  j.envia(ke.querySelector('form'));
  res = j.drawer().resultado();
  assert.equal(res.ficha.meta.nome, 'Bran');
  assert.match(j.el('fd-gaveta-id').textContent, /^Bran/);
  // trocar
  const lira = j.sb.KhEnsaio.armazem(ss).listar()[0].id;
  j.muda(ke.querySelector('.ke-lista'), { value: lira });
  assert.equal(j.drawer().resultado().fichaId, lira);
  assert.match(j.el('fd-gaveta-id').textContent, /^Lira Vento-Sul/);
  // Esc: o diálogo fecha antes de o drawer recolher (camada 35 < 40)
  j.clica(j.ke(ke, 'duplicar'));
  j.clica(j.ke(ke, 'criar'));
  j.tecla('Escape');
  assert.equal(ke.querySelector('.ke-dialogo'), null);
  assert.equal(j.html.getAttribute('data-ficha3'), 'aberto');
  // outra página da mesma aba (o mesmo sessionStorage): já abre no ensaio
  const k = await carrega(janela({ ls: A.armazenamento(Object.fromEntries(ls.m)), ss }));
  assert.equal(k.el('fd-gaveta-ro').hidden, true);
  assert.equal(k.el('fd-gaveta-ke').hidden, false);
  assert.equal(k.drawer().resultado().ensaio, true);
  assert.equal(k.drawer().resultado().fichaId, j.sb.KhEnsaio.armazem(ss).ativa());
  assert.deepEqual(nomes(k.el('fd-gaveta-ke')), ['Lira Vento-Sul', 'Bran', 'Lira Vento-Sul (cópia)']);
  assert.ok(k.faixa());
  // sair pela faixa da outra página: o drawer volta à sombra
  k.clica(k.ke(k.faixa(), 'sair'));
  k.clica(k.ke(k.faixa(), 'sair-ok'));
  assert.equal(k.el('fd-gaveta-ro').hidden, false);
  assert.equal(k.el('fd-gaveta-ke').hidden, true);
  assert.equal(k.drawer().resultado().ensaio, undefined);
  // o ESPIÃO
  assert.deepEqual(j.ls.escritas, []);
  assert.deepEqual(k.ls.escritas, []);
  soEnsaio(ss, 'drawer');
  assert.deepEqual([...ss.m.keys()], []);
});

test('"Sair da prévia": com o Ensaio ligado não aparece (sai-se dele antes, com confirmação); sem ele, apaga o que sobrou do ensaio, e só isso', async () => {
  for (const pagina of [false, true]) {
    const sair = pagina ? '.fp-sair-previa' : '.fd-gaveta-sair';
    const j = await carrega(janela({ pagina, ls: comPrevia(), ss: { khalkaria_ficha_aba: 'cartas' } }));
    j.clica(j.doc.querySelector('[data-ke="entrar"]'));
    await carrega(j);
    assert.equal(j.ss.getItem(MARCA), '1');
    const b = j.doc.querySelector(sair);
    assert.ok(!b || (!pagina && j.el('fd-gaveta-ro').hidden), 'escondido no ensaio');
    // um resto do ensaio sem a marca (a aba fechou no meio, outra versão): "Sair da prévia" o apaga
    const resto = { khalkaria_ficha_aba: 'cartas', [PRE + 'khalkaria_fichas_v3']: '{}', [PRE + 'khalkaria_ficha_v3:fx00000000000']: '{}' };
    const k = await carrega(janela({ pagina, ls: comPrevia(), ss: resto }));
    k.clica(k.doc.querySelector(sair));
    assert.deepEqual(Object.fromEntries(k.ss.m), { khalkaria_ficha_aba: 'cartas' });
    assert.ok(pagina ? k.sb.foi === '/pages/ficha.html' : k.sb.recarregou === 1, 'recarrega');
    assert.deepEqual(k.ls.escritas, [['remove', 'khalkaria_ficha_previa']]);
    // a página já tirava a marca do painel antigo da prévia (khalkaria_ficha_previa_recolhida): o resto é do ensaio
    k.ss.escritas = k.ss.escritas.filter((w) => w[1] !== 'khalkaria_ficha_previa_recolhida');
    soEnsaio(k.ss, pagina ? 'página' : 'drawer');
  }
});

test('bfcache (revisão da F4.6a): na página velha, "Sair da prévia" não apaga o ensaio (abre a confirmação da faixa), "Ensaiar edição" só a acerta e o pageshow (persisted) a acerta (espião)', async () => {
  for (const pagina of [false, true]) {
    const onde = pagina ? 'página' : 'drawer';
    const SAIR = pagina ? '.fp-sair-previa' : '.fd-gaveta-sair';
    const keDe = (x) => x.el(pagina ? 'fp-ke' : 'fd-gaveta-ke');
    const ls = A.armazenamento(comPrevia());
    const ss = A.armazenamento({ khalkaria_ficha_aba: 'cartas' });
    const fotoLs = ls.foto();
    // 1) as páginas velhas (Condições, ou a da ficha), abertas sem o Ensaio, na mesma aba (o mesmo sessionStorage)
    const velha = await carrega(janela({ pagina, ls, ss }));
    const velha2 = await carrega(janela({ pagina, ls, ss }));
    const velha3 = await carrega(janela({ pagina, ls, ss }));
    // 2) a página da ficha: "Ensaiar edição" e cria "Teste importante"
    const f = await carrega(janela({ pagina: true, ls, ss }));
    f.clica(f.doc.querySelector('[data-ke="entrar"]'));
    await carrega(f);
    f.clica(f.ke(f.el('fp-ke'), 'criar'));
    f.el('fp-ke').querySelector('.ke-nome').value = 'Teste importante';
    f.envia(f.el('fp-ke').querySelector('form'));
    const arm = E.armazem(ss);
    assert.equal(arm.listar().length, 2);
    const foto = ss.foto();
    // 3) Voltar: a velha como estava (o clique antes de qualquer sincronia), com "Sair da prévia" à vista
    const b = velha.doc.querySelector(SAIR);
    assert.ok(b, onde + ': o botão da página velha');
    if (!pagina) assert.equal(velha.el('fd-gaveta-ro').hidden, false);
    assert.equal(velha.faixa(), null);
    // 4) o clique NÃO apaga: a página se acerta e a faixa pede a confirmação, com o porquê
    velha.clica(b);
    assert.equal(ss.foto(), foto, onde + ': nada apagado');
    assert.equal(ss.getItem(MARCA), '1');
    assert.equal(velha.sb.foi, undefined, 'não troca de página');
    assert.equal(velha.sb.recarregou, undefined, 'nem recarrega');
    assert.ok(velha.faixa(), onde + ': a faixa');
    assert.match(velha.faixa().querySelector('.ke-faixa-conf').textContent, /^Sair apaga as 2 fichas do ensaio desta aba\./);
    assert.equal(velha.faixa().querySelector('.ke-faixa-msg').textContent, S.ANTES_DA_PREVIA);
    assert.equal(velha.doc.activeElement, velha.faixa().querySelector('.ke-sair-nao'), 'o foco em "Continuar no ensaio"');
    assert.equal(keDe(velha).hidden, false, 'o seletor do ensaio');
    assert.deepEqual(nomes(keDe(velha)), ['Lira Vento-Sul', 'Teste importante']);
    if (pagina) assert.equal(velha.doc.querySelector(SAIR), null, 'o topo sem o "Sair da prévia"');
    else assert.equal(velha.el('fd-gaveta-ro').hidden, true, 'o aviso com "Sair da prévia" some');
    velha.clica(velha.ke(velha.faixa(), 'sair-nao'));
    assert.equal(arm.listar().length, 2, '"Continuar no ensaio": tudo fica');
    // 5) "Ensaiar edição" na página velha: não cria outra ficha, só a acerta
    velha2.clica(velha2.doc.querySelector('[data-ke="entrar"]'));
    await carrega(velha2);
    assert.equal(ss.foto(), foto, 'nenhuma ficha nova');
    assert.ok(velha2.faixa());
    assert.deepEqual(nomes(keDe(velha2)), ['Lira Vento-Sul', 'Teste importante']);
    if (!pagina) assert.equal(velha2.el('fd-gaveta-ro').hidden, true);
    else assert.equal(velha2.doc.querySelector(SAIR), null);
    // 6) o pageshow do bfcache (persisted) acerta antes de qualquer clique; a carga normal, não mexe
    velha3.win('pageshow', { persisted: false });
    assert.equal(velha3.faixa(), null, 'carga normal: nada');
    velha3.win('pageshow', { persisted: true });
    assert.ok(velha3.faixa());
    assert.equal(keDe(velha3).hidden, false);
    if (pagina) assert.equal(velha3.doc.querySelector(SAIR), null);
    else {
      assert.equal(velha3.el('fd-gaveta-ro').hidden, true);
      assert.equal(velha3.drawer().resultado().ensaio, true);
    }
    // 7) o contrário: sair do ensaio na página da ficha e voltar à velha (que mostrava o ensaio)
    f.clica(f.ke(f.faixa(), 'sair'));
    f.clica(f.ke(f.faixa(), 'sair-ok'));
    const n = ss.escritas.length;
    // sem o pageshow: a ação do seletor velho não grava nada, e o seletor some
    velha3.clica(velha3.ke(keDe(velha3), 'duplicar'));
    assert.equal(ss.escritas.length, n, 'nada gravado');
    assert.equal(keDe(velha3).hidden, true);
    velha3.win('pageshow', { persisted: true });
    assert.equal(velha3.faixa(), null);
    if (pagina) assert.ok(velha3.doc.querySelector(SAIR));
    else assert.equal(velha3.el('fd-gaveta-ro').hidden, false);
    // o ESPIÃO: nada no localStorage, nada na ficha atual, o sessionStorage só com o prefixo
    [velha, velha2, velha3, f].forEach((x) => assert.deepEqual(x.kf, [], 'a ficha atual não é chamada'));
    assert.deepEqual(ls.escritas, []);
    assert.equal(ls.foto(), fotoLs);
    soEnsaio(ss, 'bfcache ' + onde);
    assert.deepEqual(Object.fromEntries(ss.m), { khalkaria_ficha_aba: 'cartas' });
  }
});

test('sair do ensaio limpa a mensagem do seletor (revisão da F4.6a): a volta à sombra é exata, na página e no drawer', async () => {
  for (const pagina of [false, true]) {
    const ls = A.armazenamento(comPrevia({ khalkaria_ficha3_dock: 'aberto' }));
    const ss = A.armazenamento();
    const j = await carrega(janela({ pagina, ls, ss }));
    const ke = j.el(pagina ? 'fp-ke' : 'fd-gaveta-ke');
    const cab = () => (pagina ? j.el('fp-topo') : j.el('fd-gaveta-id')).innerHTML;
    const antes = { ke: ke.innerHTML, cab: cab() };
    assert.equal(ke.hidden, true);
    j.clica(j.doc.querySelector('[data-ke="entrar"]'));
    await carrega(j);
    j.clica(j.ke(ke, 'criar'));
    ke.querySelector('.ke-nome').value = 'Teste A';
    j.envia(ke.querySelector('form'));
    assert.equal(ke.querySelector('.ke-msg').textContent, 'Ficha "Teste A" criada e aberta.');
    // sem o Esc (que limparia a mensagem): direto pela faixa
    j.clica(j.ke(j.faixa(), 'sair'));
    j.clica(j.ke(j.faixa(), 'sair-ok'));
    assert.equal(ke.hidden, true, 'o seletor some');
    assert.equal(ke.querySelector('.ke-msg'), null, 'sem a mensagem de uma ficha que não existe mais');
    assert.equal(ke.innerHTML, antes.ke);
    assert.equal(cab(), antes.cab, 'o topo (ou o cabeçalho) volta byte a byte');
    // entrar de novo: a mensagem é a da entrada, não a velha
    j.clica(j.doc.querySelector('[data-ke="entrar"]'));
    await carrega(j);
    assert.match(ke.querySelector('.ke-msg').textContent, /^Ensaio ligado/);
    j.clica(j.ke(j.faixa(), 'sair'));
    j.clica(j.ke(j.faixa(), 'sair-ok'));
    assert.equal(ke.querySelector('.ke-msg'), null);
    assert.deepEqual(j.ls.escritas, []);
    assert.deepEqual(j.kf, []);
    soEnsaio(ss, pagina ? 'página' : 'drawer');
    assert.deepEqual([...ss.m.keys()], []);
  }
});

test('drawer com o Ensaio (F4.6c): soltar item do Bazar, técnica (v2.1) ou magia leva para a ficha do ensaio; nada vai à ficha atual (espiã)', async () => {
  const ls = A.armazenamento(comPrevia({ khalkaria_ficha3_dock: 'aberto' }));
  const ss = A.armazenamento();
  const j = await carrega(janela({ ls, ss }));
  j.clica(j.doc.querySelector('.fd-gaveta-ensaiar'));
  await carrega(j);
  const arm = j.sb.KhEnsaio.armazem(ss), id = arm.ativa();
  const casos = [
    ['item-card', { 'data-kf-tipo': 'item' }, { _bazar: true, item: { id: 'item-corda-5m', nome: 'Corda (5m)' } },
      'Solte para levar Corda (5m) à ficha do ensaio (a sua ficha não muda).', /^Corda \(5m\) foi para o inventário da ficha do ensaio/],
    ['tier-technique kf-draggable', {}, { _campo: 'tecnicas', tipo: 'tecnica', nome: 'Alquimia Rápida', id: 'tecnica-alquimia-rapida' },
      'Solte para levar a técnica à ficha do ensaio (a sua ficha não muda).', /^Alquimia Rápida foi para as Técnicas da ficha do ensaio\.$/],
    ['spell-card kf-draggable', { 'data-kf-tipo': 'magia', 'data-kf-id': 'magia-centelha' }, { _campo: 'grimorio', tipo: 'magia', nome: 'Centelha' },
      'Solte para levar a magia à ficha do ensaio (a sua ficha não muda).', /^Centelha foi para o Grimório da ficha do ensaio\.$/]
  ];
  for (const [classe, attrs, payload, texto, depois] of casos) {
    const card = j.doc.createElement('div');
    card.className = classe;
    Object.entries(attrs).forEach(([k, v]) => card.setAttribute(k, v));
    j.doc.body.appendChild(card);
    j.arrasta(card, 'dragstart', payload);
    j.arrasta(j.el('fd-gaveta'), 'dragenter', null);
    assert.equal(j.arrasta(j.el('fd-gaveta-rolagem'), 'dragover', null).defaultPrevented, true, classe + ': aceita');
    assert.ok(j.el('fd-gaveta').hasAttribute('data-alvo'));
    assert.equal(j.el('fd-gaveta-aviso').textContent, texto);
    j.arrasta(j.el('fd-gaveta-rolagem'), 'drop', payload);
    DOM.despacha(j.doc, j.doc.body, DOM.evento('dragend'));
    await carrega(j);
    assert.match(j.el('fd-gaveta-aviso').textContent, depois);
    assert.equal(j.el('fd-gaveta-nota').hidden, true, 'sem a nota de "a ficha atual abriu"');
  }
  const f = arm.ler(id);
  assert.deepEqual(copia(f.entradas.map((e) => e.tipo + ':' + e.id).slice(-2)), ['tecnica:alquimista-alquimia-rapida', 'magia:magia-centelha']);
  assert.ok(f.inventario.bugigangas.some((e) => e.id === 'item-corda-5m'));
  assert.equal(arm.estadoLog(id).desfazer.rotulo, 'Levar: Centelha (Grimório)', 'cada levar é um passo do Desfazer');
  assert.deepEqual(j.kf, [], 'nem KF.adicionar nem KF.abrir');
  assert.deepEqual(j.ls.escritas, []);
  assert.match(j.faixa().textContent, /nada aqui é salvo na sua ficha/);
  soEnsaio(ss, 'soltar no ensaio');
});

test('QuotaExceeded pela interface: o aviso com "Exportar todas", que baixa o pacote; nada fora do prefixo', async () => {
  const ls = A.armazenamento(comPrevia());
  const ss = A.armazenamento();
  const j = await carrega(janela({ pagina: true, ls, ss }));
  j.clica(j.doc.querySelector('[data-ke="entrar"]'));
  await carrega(j);
  const ke = j.el('fp-ke');
  let tot = 0;
  ss.m.forEach((v, k) => { tot += k.length + v.length; });
  ss.limite = tot + 200;
  j.clica(j.ke(ke, 'duplicar'));
  const d = ke.querySelector('.ke-dialogo');
  assert.ok(d, 'o aviso');
  assert.equal(d.getAttribute('role'), 'alert');
  assert.match(d.textContent, /O espaço da aba acabou/);
  assert.match(ke.querySelector('.ke-msg').textContent, /QuotaExceeded/);
  assert.equal(j.doc.activeElement, d.querySelector('[data-ke="exportar-todas"]'), 'o foco em "Exportar todas"');
  j.clica(d.querySelector('[data-ke="exportar-todas"]'));
  const b = j.baixados[j.baixados.length - 1];
  assert.equal(b.nome, 'khalkaria-fichas.json');
  assert.equal(JSON.parse(b.texto).fichas.length, 1);
  assert.equal(ke.querySelector('.ke-dialogo'), null, 'o aviso sai depois do export');
  assert.equal(j.sb.KhEnsaio.armazem(ss).listar().length, 1, 'nada foi gravado');
  // criar também esbarra na quota
  j.clica(j.ke(ke, 'criar'));
  j.envia(ke.querySelector('form'));
  assert.match(ke.querySelector('.ke-dialogo').textContent, /O espaço da aba acabou/);
  assert.deepEqual(j.ls.escritas, []);
  soEnsaio(ss, 'quota');
});

test('sem sessionStorage (bloqueado): "Ensaiar edição" avisa, e nada liga nem é gravado', async () => {
  const j = await carrega(janela({ ls: comPrevia() }));
  Object.defineProperty(j.sb, 'sessionStorage', { get() { throw new Error('SecurityError'); } });
  const cont = j.doc.createElement('div');
  j.doc.body.appendChild(cont);
  const sel = j.sb.KhSeletor.criar({ win: j.sb, doc: j.doc, cont, prefixo: 'tt', dados: () => Promise.resolve({ dados: DADOS }) });
  assert.equal(cont.hidden, true, 'fora do ensaio, escondido');
  const r = await sel.entrar();
  assert.deepEqual(JSON.parse(JSON.stringify(r)), { ok: false, erro: 'storage' });
  assert.equal(cont.hidden, false, 'o aviso aparece');
  assert.equal(cont.querySelector('.ke-msg').textContent, S.SEM_STORAGE);
  assert.equal(j.sb.KhEnsaio.ligado(j.sb), false);
  assert.deepEqual(j.ls.escritas, []);
});

test('CSS do Ensaio: só injetado com ele; sem camada e tudo sob .ke- (mais o lugar da página); faixa no token e abaixo dos drawers; texto em AA', () => {
  const css = ler('css', 'ficha-ensaio.css').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(css, /@layer/);
  // nenhuma página o carrega: só o KhSeletor (o shell não o injeta)
  fs.readdirSync(path.join(A.RAIZ, 'pages')).filter((n) => n.endsWith('.html')).forEach((n) => {
    assert.doesNotMatch(ler('pages', n), /ficha-ensaio\.css/, n);
  });
  assert.doesNotMatch(ler('index.html'), /ficha-ensaio\.css/);
  // seletores: .ke-*, .fp-ke e o html[data-ensaio] (a marca da faixa)
  const seletores = [...css.matchAll(/([^{}]+)\{[^{}]*\}/g)].map((m) => m[1].trim()).filter((s) => !s.startsWith('@'));
  seletores.forEach((s) => s.split(',').forEach((x) => {
    x = x.trim();
    assert.ok(/(^|\s)\.ke-|\.fp-ke\b|^html\[data-ensaio\]/.test(x), 'fora do escopo: ' + x);
  }));
  const { regra, resolveCor, contraste, TOKENS } = require('./cor-apoio.js');
  assert.match(regra(css, '.ke-faixa'), /z-index: calc\(var\(--z-ficha3\) - 1\);/);
  assert.match(regra(css, '.ke-faixa'), /position: fixed;/);
  const fundoFaixa = resolveCor(/background:\s*([^;]+);/.exec(regra(css, '.ke-faixa'))[1]);
  const fundoSel = resolveCor(/background:\s*([^;]+);/.exec(regra(css, '.ke-seletor'))[1]);
  const cor = (sel) => resolveCor(/(?:^|;)\s*color:\s*([^;]+?)\s*(?:;|$)/.exec(regra(css, sel).trim())[1]);
  [['.ke-faixa', fundoFaixa], ['.ke-faixa-msg', fundoFaixa], ['.ke-seletor', fundoSel], ['.ke-titulo', fundoSel], ['.ke-uso', fundoSel],
    ['.ke-msg', fundoSel], ['.ke-msg-aviso', fundoSel], ['.ke-rot', fundoSel], ['.ke-nota', TOKENS['bg-secondary']],
    ['.ke-dialogo-tit', TOKENS['bg-secondary']]].forEach(([sel, fundo]) => {
    const c = contraste(cor(sel), fundo);
    assert.ok(c >= 4.5, sel + ': ' + c.toFixed(2) + ':1');
  });
  assert.match(css, /\.ke-seletor :focus-visible, \.ke-faixa :focus-visible \{ outline: 2px solid var\(--amber\)/);
  // o botão desligado (revisão da F4.6a): fundo próprio, que vence o âmbar do .kh-btn.forte (este CSS é sem
  // camada; o componente, @layer componentes): o texto apagado sobre o âmbar dava 1,37:1
  assert.match(ler('css', 'componentes.css'), /@layer componentes \{/);
  assert.match(regra(ler('css', 'componentes.css'), '.kh-btn.forte, .bz-faixa-btn.forte'), /background: var\(--amber\);/);
  const des = regra(css, '.ke-btn:disabled');
  const fundoDes = resolveCor(/background:\s*([^;]+);/.exec(des)[1]);
  const cDes = contraste(cor('.ke-btn:disabled'), fundoDes);
  assert.ok(cDes >= 4.5, '.ke-btn:disabled: ' + cDes.toFixed(2) + ':1');
  assert.notEqual(fundoDes, TOKENS.amber);
  assert.doesNotMatch(regra(css, '.ke-btn.forte:disabled'), /background|(?:^|;)\s*color:/, 'o .forte desligado fica com o fundo e o texto do desligado');
  // no drawer: o lugar do seletor ocupa a linha do cabeçalho (css/ficha-drawer.css)
  const dr = ler('css', 'ficha-drawer.css');
  assert.match(regra(dr, '.fd-gaveta-ke'), /grid-column: 1 \/ -1;/);
  assert.match(regra(dr, '.fd-gaveta-ensaiar'), /color: var\(--gold\);/);
});

// ---------------------------------------------------------------- F4.6b: a edição pela interface
// Ctrl+<tecla> no alvo (o foco vai junto, como no navegador)
const ctrl = (j, alvo, key) => { j.doc.activeElement = alvo; return DOM.despacha(j.doc, alvo, DOM.evento('keydown', { key, ctrlKey: true })); };
const rodaTimers = (j) => { for (let i = 0; i < 5 && j.timers.length; i++) j.timers.splice(0).forEach((f) => f()); };

test('ORDEM: o kh-edicao.js antes do kh-ficha-abas.js e o kh-editor.js antes do drawer; no artefato', () => {
  const i = (n) => ORDEM.indexOf(n);
  assert.ok(i('kh-ensaio.js') < i('kh-edicao.js') && i('kh-edicao.js') < i('kh-ficha-abas.js'));
  assert.ok(i('kh-ficha-abas.js') < i('kh-editor.js') && i('kh-editor.js') < i('kh-ficha-drawer.js'));
  const art = ler('js', 'ficha.js');
  assert.ok(art.includes('// ==== js/ficha/kh-edicao.js ====') && art.includes('// ==== js/ficha/kh-editor.js ===='));
});

test('página, a edição (espião): sem o Ensaio só leitura; com ele, nome, grau, stepper, raça, Ajustar, Ajustes em lote, Desfazer e Refazer (botão e Ctrl+Z/Ctrl+Y)', async () => {
  const ls = A.armazenamento(comPrevia());
  const ss = A.armazenamento({ khalkaria_ficha_aba: 'nucleo' });
  const fotoLs = ls.foto();
  const j = await carrega(janela({ pagina: true, ls, ss }));
  const fp = j.el('fp'), nomeTopo = () => j.el('fp-topo').querySelector('.fp-nome').textContent;
  // ---- sem o Ensaio: nenhum controle, nenhuma barra; Ctrl+Z não é tomado
  assert.equal(fp.querySelector('[data-ed], [data-ed-grau], [data-ed-delta], [data-ed-lista], [data-ajustavel], .ke-ajustavel'), null);
  assert.equal(j.el('fp-ked'), null);
  assert.equal(ctrl(j, j.doc.body, 'z').defaultPrevented, false, 'sem o Ensaio, o Ctrl+Z segue (é do navegador)');
  assert.deepEqual(j.ss.escritas, []);
  // ---- entra: a barra acima do topo, os controles nas abas
  j.clica(j.doc.querySelector('[data-ke="entrar"]'));
  await carrega(j);
  const barra = j.el('fp-ked');
  assert.ok(barra, 'a barra');
  assert.equal(barra.parentNode, fp);
  assert.equal(fp.filhos.indexOf(barra) + 1, fp.filhos.indexOf(j.el('fp-topo')), 'logo acima do topo');
  assert.equal(barra.hidden, false);
  const bt = (a) => barra.querySelector('[data-ked="' + a + '"]');
  assert.equal(bt('desfazer').getAttribute('aria-disabled'), 'true');
  assert.equal(bt('ajustes').textContent, 'Ajustes (2)', 'os 2 ajustes migrados da ficha atual');
  const arm = j.sb.KhEnsaio.armazem(j.ss), id = arm.ativa();
  const ficha = () => copia(arm.ler(id));
  const ed = (c) => fp.querySelector('[data-ed="' + c + '"]');
  ['meta.nome', 'meta.jogador', 'meta.nivel', 'meta.xp', 'identidade.raca', 'identidade.variante', 'identidade.classe', 'identidade.ramo',
    'identidade.origem', 'atributos.base.FOR', 'atributos.base.SAB', 'recursos.saude.atual', 'recursos.classe.atual', 'inventario.sins',
    'idiomas', 'lore.historia', 'lore.outros'].forEach((c) => assert.ok(ed(c), 'o campo ' + c));
  // Marcas da Vhelor: ocultas também no Ensaio enquanto não há marca (03 §10)
  assert.equal(ed('vhelor.marcas'), null);
  assert.equal(fp.querySelectorAll('[data-ed-grau]').length, 24 * 4, 'os 4 círculos das 24 perícias');
  assert.ok(fp.querySelector('[data-ed-lista="imunidadesCondicao"]'));
  // ---- o nome: grava ao sair do campo (change); a página e o seletor redesenham no tempo seguinte
  j.muda(ed('meta.nome'), { value: '  Lira   Editada ' });
  assert.equal(ficha().meta.nome, 'Lira Editada');
  rodaTimers(j);
  assert.equal(nomeTopo(), 'Lira Editada');
  assert.deepEqual(nomes(j.el('fp-ke')), ['Lira Editada'], 'o seletor também');
  assert.equal(bt('desfazer').getAttribute('aria-disabled'), null);
  assert.equal(bt('desfazer').getAttribute('title'), 'Desfazer: Nome do Personagem: "Lira Editada" (Ctrl+Z)');
  // um valor fora da faixa: o campo volta, a mensagem diz o porquê, nada grava
  const n0 = j.ss.escritas.length;
  const niv = ed('meta.nivel');
  j.muda(niv, { value: '9' });
  assert.equal(niv.value, '2');
  assert.equal(barra.querySelector('.ke-ed-msg').textContent, 'Nível: de 1 a 5.');
  assert.equal(j.ss.escritas.length, n0);
  // ---- o círculo de grau (o clique cai no círculo de dentro do botão)
  const grau = (p, i) => fp.querySelector('[data-ed-grau="' + p + '"][data-grau="' + i + '"]');
  assert.equal(ficha().pericias.reflexos, 0);
  j.clica(grau('reflexos', 2).querySelector('.fp-grau'));
  assert.equal(ficha().pericias.reflexos, 2);
  assert.equal(grau('reflexos', 2).getAttribute('aria-pressed'), 'true');
  assert.equal(grau('reflexos', 3).getAttribute('aria-pressed'), 'false');
  j.clica(grau('reflexos', 2));
  assert.equal(ficha().pericias.reflexos, 1, 'o último aceso apaga a si mesmo');
  // ---- o stepper (− e +) da Saúde atual
  const passo = (c, d) => fp.querySelector('[data-ed-alvo="' + c + '"][data-ed-delta="' + d + '"]');
  j.clica(passo('recursos.saude.atual', 1));
  j.clica(passo('recursos.saude.atual', 1));
  j.clica(passo('recursos.saude.atual', -1));
  assert.equal(ficha().recursos.saude.atual, 19);
  // ---- a raça por seletor: a variante de outra raça sai, com o aviso
  j.muda(ed('identidade.raca'), { value: 'raca-anao' });
  assert.deepEqual(ficha().identidade.raca, { id: 'raca-anao', nome: 'Anão' });
  assert.deepEqual(ficha().identidade.variante, { id: null, nome: '' });
  rodaTimers(j);
  assert.equal(barra.querySelector('.ke-ed-msg').textContent, 'A variante Simples saiu: é de outra raça. Ficou da raça anterior (Humano): Persistência Humana (traço).');
  // nunca remove calado (auditoria B): o traço fica, e a mensagem oferece remover num passo
  assert.ok(ficha().entradas.some((e) => e.id === 'humano-persistencia-humana'));
  const rem = barra.querySelector('[data-ked="remover-restos"]');
  assert.equal(rem.textContent, 'Remover o que era de Humano');
  j.clica(rem);
  assert.equal(ficha().entradas.some((e) => e.id === 'humano-persistencia-humana'), false);
  assert.equal(barra.querySelector('.ke-ed-msg').textContent, 'Removido: o que era de Humano (1). Desfazer volta.');
  assert.equal(barra.querySelector('[data-ked="remover-restos"]'), null);
  assert.equal(bt('desfazer').getAttribute('title'), 'Desfazer: Remover o que era de Humano (1) (Ctrl+Z)');
  assert.ok(ed('identidade.variante').querySelectorAll('option').length > 1, 'as variantes do Anão');
  assert.ok(ed('identidade.variante').querySelectorAll('option').slice(1).every((o) => /^anao-/.test(o.getAttribute('value'))), 'só as do Anão');
  // ---- Ajustar: clicar no Mod.DES abre o pop-over; Valor fixo 5 propaga à Evasão
  const conta = (c) => fp.querySelector('.kh-conta[data-ajustavel][data-caminho="' + c + '"]');
  const evasao0 = Number(fp.querySelector('[data-caminho="evasao.passiva"] .fp-v').textContent);
  j.clica(conta('atributo.DES.mod'));
  let pop = fp.querySelector('.ke-pop');
  assert.ok(pop, 'o pop-over');
  assert.ok(pop.parentNode.hasAttribute('data-kf-ignorar'));
  assert.equal(pop.querySelector('.ke-pop-tit').textContent, 'Ajustar: Mod.DES');
  assert.equal(j.doc.activeElement, pop.querySelector('.ke-pop-valor'), 'o foco no valor');
  assert.ok(pop.querySelector('.ke-pop-temp input').hasAttribute('disabled'));
  assert.equal(pop.querySelector('#ke-pop-temp-nota').textContent, 'expira na Mesa (F5)');
  pop.querySelector('.ke-pop-valor').value = 'abc';
  j.envia(pop);
  pop = fp.querySelector('.ke-pop');
  assert.equal(pop.querySelector('.ke-pop-erro').textContent, 'Digite um número.', 'a recusa fica no pop-over');
  pop.querySelector('.ke-pop-valor').value = '5';
  pop.querySelector('.ke-pop-motivo').value = 'Bênção';
  j.envia(pop);
  assert.equal(fp.querySelector('.ke-pop'), null, 'aplicado, fecha');
  assert.equal(j.doc.activeElement, conta('atributo.DES.mod'), 'o foco volta ao número');
  assert.deepEqual([ficha().ajustes['atributo.DES.mod'].valor, ficha().ajustes['atributo.DES.mod'].motivo], [5, 'Bênção']);
  assert.ok(conta('atributo.DES.mod').hasAttribute('data-ajustado'));
  assert.equal(Number(fp.querySelector('[data-caminho="evasao.passiva"] .fp-v').textContent), evasao0 + 2, 'a Evasão acompanha');
  assert.equal(bt('ajustes').textContent, 'Ajustes (3)');
  // Diferença: o modo troca no pop-over (o texto digitado fica), Esc fecha sem gravar
  j.clica(conta('cd'));
  pop = fp.querySelector('.ke-pop');
  pop.querySelector('.ke-pop-valor').value = '+2';
  j.muda(pop.querySelector('input[value="soma"]'), { value: 'soma', checked: true });
  pop = fp.querySelector('.ke-pop');
  assert.ok(pop.querySelector('input[value="soma"]').hasAttribute('checked'));
  assert.equal(pop.querySelector('.ke-pop-valor').getAttribute('value'), '+2', 'o digitado não se perde');
  const n1 = j.ss.escritas.length;
  j.tecla('Escape');
  assert.equal(fp.querySelector('.ke-pop'), null);
  assert.equal(j.ss.escritas.length, n1, 'Esc: nada gravado');
  j.clica(conta('cd'));
  pop = fp.querySelector('.ke-pop');
  j.muda(pop.querySelector('input[value="soma"]'), { value: 'soma', checked: true });
  pop = fp.querySelector('.ke-pop');
  pop.querySelector('.ke-pop-valor').value = '+2';
  j.envia(pop);
  assert.deepEqual([ficha().ajustes.cd.modo, ficha().ajustes.cd.valor], ['soma', 2]);
  // um número que não aceita ajuste: sem botão, com o motivo na dica
  const naoAj = fp.querySelectorAll('.kh-conta:not([data-ajustavel])');
  assert.ok(naoAj.length > 0);
  naoAj.forEach((x) => {
    assert.equal(x.getAttribute('role'), null);
    assert.match(x.querySelector('.ke-d-ed').textContent, /^Não aceita ajuste: ./, x.getAttribute('data-caminho'));
  });
  const caminhosNao = naoAj.map((x) => x.getAttribute('data-caminho'));
  ['carga', 'recurso.stamina.disponivel'].forEach((c) => assert.ok(caminhosNao.some((y) => y === c || y.startsWith(c)), c + ' à vista, sem ajuste'));
  // ---- a tela Ajustes: a lista, "selecionar todos" e remover em lote (um passo)
  j.clica(bt('ajustes'));
  const aj = barra.querySelector('.ke-aj');
  assert.ok(aj);
  assert.equal(bt('ajustes').getAttribute('aria-expanded'), 'true');
  assert.deepEqual(aj.querySelectorAll('tbody tr').map((t) => t.getAttribute('data-caminho')),
    ['atributo.DES.mod', 'cd', 'recurso.saude.max', 'recurso.stamina.max']);
  j.muda(aj.querySelector('[data-ked-todos]'), { checked: true });
  assert.equal(barra.querySelector('[data-ked="remover-sel"]').textContent, 'Remover 4 selecionados');
  j.muda(barra.querySelector('[data-ked-sel][value="recurso.stamina.max"]'), { checked: false, value: 'recurso.stamina.max' });
  j.clica(barra.querySelector('[data-ked="remover-sel"]'));
  assert.deepEqual(Object.keys(ficha().ajustes), ['recurso.stamina.max']);
  assert.equal(bt('ajustes').textContent, 'Ajustes (1)');
  assert.equal(bt('desfazer').getAttribute('title'), 'Desfazer: Remover 3 ajustes (Ctrl+Z)');
  // ---- Desfazer pelo botão; Ctrl+Z fora de campo; Ctrl+Y refaz
  j.clica(bt('desfazer'));
  assert.equal(Object.keys(ficha().ajustes).length, 4, 'o lote volta num passo');
  assert.equal(barra.querySelector('.ke-ed-msg').textContent, 'Desfeito: Remover 3 ajustes.');
  const ev = ctrl(j, fp.querySelector('.fp-titulo') || j.doc.body, 'z');
  assert.equal(ev.defaultPrevented, true, 'o Ctrl+Z do ensaio consome');
  assert.equal(ficha().ajustes.cd, undefined, 'Ctrl+Z desfez o ajuste da CD');
  assert.equal(ctrl(j, j.doc.body, 'y').defaultPrevented, true);
  assert.equal(ficha().ajustes.cd.valor, 2, 'Ctrl+Y refez');
  // num campo de texto, o Ctrl+Z é do campo (o desfazer do navegador): o ensaio não anda
  const foto = j.ss.foto();
  ['meta.nome', 'lore.historia', 'identidade.raca', 'meta.xp'].forEach((c) => {
    assert.equal(ctrl(j, ed(c), 'z').defaultPrevented, false, c);
    assert.equal(ctrl(j, ed(c), 'y').defaultPrevented, false, c);
  });
  assert.equal(j.ss.foto(), foto);
  // na ficha atual (v2.1) aberta por cima, o Ctrl+Z é dela
  const kf = j.doc.createElement('div');
  kf.id = 'kf-drawer';
  kf.innerHTML = '<button type="button" class="kf-x">x</button>';
  j.doc.body.appendChild(kf);
  assert.equal(ctrl(j, kf.querySelector('.kf-x'), 'z').defaultPrevented, false);
  assert.equal(j.ss.foto(), foto);
  // até o começo: o nome volta; "Nada a desfazer" com o botão desligado
  for (let i = 0; i < 30 && arm.estadoLog(id).desfazer; i++) ctrl(j, j.doc.body, 'z');
  assert.equal(ficha().meta.nome, 'Lira Vento-Sul');
  assert.equal(ficha().recursos.saude.atual, 18);
  assert.equal(nomeTopo(), 'Lira Vento-Sul');
  assert.equal(bt('desfazer').getAttribute('aria-disabled'), 'true');
  j.clica(bt('desfazer'));
  assert.equal(barra.querySelector('.ke-ed-msg').textContent, 'Nada a desfazer.');
  // ---- sair do ensaio: a barra some e os controles também (a volta à sombra)
  j.clica(j.ke(j.faixa(), 'sair'));
  j.clica(j.ke(j.faixa(), 'sair-ok'));
  assert.equal(barra.hidden, true);
  assert.equal(barra.innerHTML, '');
  assert.equal(fp.querySelector('[data-ed], [data-ed-grau], [data-ed-delta], [data-ajustavel], .ke-pop'), null);
  assert.equal(ctrl(j, j.doc.body, 'z').defaultPrevented, false);
  // ---- o ESPIÃO
  assert.deepEqual(j.ls.escritas, []);
  assert.equal(j.ls.foto(), fotoLs);
  assert.deepEqual(j.kf, []);
  assert.ok(j.ss.escritas.length > 30);
  soEnsaio(j.ss, 'edição na página');
  assert.deepEqual(Object.fromEntries(j.ss.m), { khalkaria_ficha_aba: 'nucleo' });
});

test('drawer, a edição (espião): só recursos atuais e Sins (− e +); Ctrl+Z/Ctrl+Y só com o foco nele, sem roubar o do Bazar', async () => {
  const ls = A.armazenamento(comPrevia({ khalkaria_ficha3_dock: 'aberto' }));
  const ss = A.armazenamento();
  const j = await carrega(janela({ ls, ss }));
  // o Bazar registra o Ctrl+Z dele na fase de bolha (js/bazar-inventario.js): um igual aqui
  const bazar = [];
  j.sb.KhTeclas.atalho('Ctrl+z', () => { bazar.push('z'); }, { quando: (e) => !(e.target && e.target.closest && e.target.closest('#kf-drawer')) });
  const g = j.el('fd-gaveta');
  assert.equal(g.querySelector('[data-ed], [data-ed-delta]'), null, 'sem o Ensaio, só leitura');
  ctrl(j, j.doc.body, 'z');
  assert.deepEqual(bazar, ['z'], 'sem o Ensaio, o Ctrl+Z é do Bazar');
  j.clica(g.querySelector('.fd-gaveta-ensaiar'));
  await carrega(j);
  const barra = j.el('fd-gaveta-ked');
  assert.ok(barra && barra.parentNode === g.querySelector('.fd-gaveta-cab'), 'a barra no cabeçalho');
  assert.equal(barra.querySelector('[data-ked="ajustes"]'), null, 'sem a tela Ajustes no drawer');
  assert.match(barra.querySelector('.ke-ed-dica').textContent, /só os recursos atuais e os Sins/);
  // só os recursos atuais e os Sins, nenhum outro controle; nenhum número ajustável
  const alvos = new Set(g.querySelectorAll('[data-ed]').map((x) => x.getAttribute('data-ed')));
  assert.deepEqual([...alvos].sort(), ['inventario.sins', 'recursos.classe.atual', 'recursos.eter.atual', 'recursos.saude.atual', 'recursos.stamina.atual']);
  assert.equal(g.querySelector('[data-ed-grau], [data-ed-lista], [data-ajustavel], .ke-ajustavel, textarea, select.ke-ed'), null);
  const arm = j.sb.KhEnsaio.armazem(ss), id = arm.ativa();
  const ficha = () => copia(arm.ler(id));
  const passo = (c, d) => g.querySelector('[data-ed-alvo="' + c + '"][data-ed-delta="' + d + '"]');
  j.clica(passo('recursos.stamina.atual', -1));
  j.clica(passo('inventario.sins', 1));
  assert.deepEqual([ficha().recursos.stamina.atual, ficha().inventario.sins], [9, 38]);
  // o número digitado no stepper também grava
  j.muda(g.querySelector('[data-ed="recursos.eter.atual"]'), { value: '3' });
  assert.equal(ficha().recursos.eter.atual, 3);
  rodaTimers(j);
  // Ctrl+Z com o foco FORA do drawer: é do Bazar, o ensaio não anda
  const foto = ss.foto();
  ctrl(j, j.doc.body, 'z');
  assert.deepEqual(bazar, ['z', 'z']);
  assert.equal(ss.foto(), foto);
  // com o foco no drawer (num botão): é do ensaio, e o Bazar não recebe
  const ev = ctrl(j, passo('inventario.sins', 1), 'z');
  assert.equal(ev.defaultPrevented, true);
  assert.equal(ficha().recursos.eter.atual, 0, 'desfez o Éter');
  assert.deepEqual(bazar, ['z', 'z'], 'o Bazar não viu');
  ctrl(j, passo('inventario.sins', 1), 'z');
  ctrl(j, passo('inventario.sins', 1), 'y');
  assert.equal(ficha().inventario.sins, 38, 'Ctrl+Y refez os Sins');
  // no campo de número do stepper: o Ctrl+Z é do campo
  assert.equal(ctrl(j, g.querySelector('[data-ed="inventario.sins"]'), 'z').defaultPrevented, false);
  assert.equal(ficha().inventario.sins, 38);
  // o botão Desfazer
  j.clica(barra.querySelector('[data-ked="desfazer"]'));
  assert.equal(ficha().inventario.sins, 37);
  // outra página da aba (com o mesmo sessionStorage) vê a mudança e anda o mesmo log
  const k = await carrega(janela({ ls: A.armazenamento(Object.fromEntries(ls.m)), ss }));
  assert.match(k.el('fd-gaveta-ked').querySelector('[data-ked="desfazer"]').getAttribute('title'), /^Desfazer: Stamina atual: 9/);
  // sai do ensaio por ela: a página velha (esta) não grava mais
  k.clica(k.ke(k.faixa(), 'sair'));
  k.clica(k.ke(k.faixa(), 'sair-ok'));
  const n = ss.escritas.length;
  j.clica(passo('inventario.sins', 1));
  assert.equal(ss.escritas.length, n, 'a página velha não grava');
  assert.equal(j.el('fd-gaveta-ked').hidden, true, 'e se acerta (a barra some)');
  assert.equal(g.querySelector('[data-ed-delta]'), null);
  // o ESPIÃO
  assert.deepEqual(j.ls.escritas, []);
  assert.deepEqual(k.ls.escritas, []);
  assert.deepEqual(j.kf, []);
  soEnsaio(ss, 'edição no drawer');
  assert.deepEqual([...ss.m.keys()], []);
});

test('CSS da edição (F4.6b): no css/ficha-ensaio.css (só com o Ensaio), sob .ke-; pop-over fora do fluxo; alvo do grau; texto em AA', () => {
  const css = ler('css', 'ficha-ensaio.css').replace(/\/\*[\s\S]*?\*\//g, '');
  const { regra, resolveCor, contraste, TOKENS } = require('./cor-apoio.js');
  ['.ke-ed-barra', '.ke-pop', '.ke-aj-tab', '.ke-ed', '.ke-ed-grau', '.ke-mudou', '.ke-d-ed', '.ke-btn[aria-disabled="true"]']
    .forEach((s) => assert.ok(regra(css, s), s));
  assert.match(regra(css, '.ke-pop'), /position: fixed;/);
  assert.match(regra(css, '.ke-pop'), /z-index: var\(--z-popover\);/);
  assert.match(regra(css, '.ke-ed-grau'), /width: 20px; height: 24px;/);
  assert.match(regra(css, '.ke-ed-grau + .ke-ed-grau'), /margin-left: 1px;/);
  // as cores que o texto usa, sobre o fundo de cada lugar
  const cor = (sel) => resolveCor(/(?:^|;)\s*color:\s*([^;]+?)\s*(?:;|$)/.exec(regra(css, sel).trim())[1]);
  const fundo = (sel) => resolveCor(/background:\s*([^;]+);/.exec(regra(css, sel))[1]);
  const fBarra = fundo('.ke-ed-barra'), fPop = fundo('.ke-pop'), fAj = fundo('.ke-aj');
  [['.ke-ed-barra', fBarra], ['.ke-ed-dica', fBarra], ['.ke-ed-msg', fBarra], ['.ke-ed-msg-aviso', fBarra],
    ['.ke-pop', fPop], ['.ke-pop-tit', fPop], ['.ke-pop-calc', fPop], ['.ke-pop-erro', fPop], ['.ke-pop-temp-rot', fPop], ['.ke-mudou', fPop],
    ['.ke-aj-tit', fAj], ['.ke-aj-tab', fAj], ['.ke-aj-caminho', fAj], ['.ke-aj-vazio, .ke-aj-origem', fAj], ['.ke-mudou', fAj],
    ['.ke-ed', fundo('.ke-ed')], ['.ke-d-ed', '#0c0b10'], ['.ke-btn[aria-disabled="true"]', fundo('.ke-btn[aria-disabled="true"]')],
    ['.ke-mudou', TOKENS['bg-card']]].forEach(([sel, f]) => {
    const c = contraste(cor(sel), f);
    assert.ok(c >= 4.5, sel + ': ' + c.toFixed(2) + ':1');
  });
  // o .forte desligado fica com o fundo e o texto do desligado
  assert.doesNotMatch(regra(css, '.ke-btn.forte[aria-disabled="true"]'), /background|(?:^|;)\s*color:/);
});

test('auditoria B e 03 §10 pela interface: o 1º clique em Desfazer depois de digitar desfaz (a barra espera o botão soltar); atributo e Ofício pelos seletores (espião)', async () => {
  const ls = A.armazenamento(comPrevia());
  const ss = A.armazenamento({ khalkaria_ficha_aba: 'nucleo' });
  const fotoLs = ls.foto();
  const j = await carrega(janela({ pagina: true, ls, ss }));
  j.clica(j.doc.querySelector('[data-ke="entrar"]'));
  await carrega(j);
  const fp = j.el('fp'), barra = j.el('fp-ked');
  const arm = j.sb.KhEnsaio.armazem(j.ss), id = arm.ativa();
  const ficha = () => copia(arm.ler(id));
  const ed = (c) => fp.querySelector('[data-ed="' + c + '"]');
  const bt = (a) => barra.querySelector('[data-ked="' + a + '"]');
  const ponteiro = (alvo, tipo) => DOM.despacha(j.doc, alvo, DOM.evento(tipo));
  assert.equal(bt('desfazer').getAttribute('aria-disabled'), 'true', 'nada a desfazer ainda');
  // digitou o nome e foi direto ao Desfazer: o apertar tira o foco do campo (o 'change')
  const antigo = bt('desfazer');
  ponteiro(antigo, 'pointerdown');
  j.muda(ed('meta.nome'), { value: 'Lira Digitada' });
  assert.equal(ficha().meta.nome, 'Lira Digitada', 'o change gravou');
  rodaTimers(j);   // o tempo seguinte (a página redesenha) com o botão ainda apertado
  assert.equal(bt('desfazer'), antigo, 'a barra não foi trocada com o botão apertado');
  assert.equal(antigo.getAttribute('aria-disabled'), 'true', 'a barra de antes do change');
  ponteiro(antigo, 'pointerup');
  j.clica(antigo);
  assert.equal(ficha().meta.nome, 'Lira Vento-Sul', 'o 1º clique desfez (pelo log de agora, não pelo aria-disabled de antes)');
  assert.equal(barra.querySelector('.ke-ed-msg').textContent, 'Desfeito: Nome do Personagem: "Lira Digitada".');
  rodaTimers(j);
  assert.equal(bt('refazer').getAttribute('aria-disabled'), null);
  // sem o mouse (Tab): a barra redesenha na hora, como antes
  j.muda(ed('meta.nome'), { value: 'Lira Tab' });
  assert.notEqual(bt('desfazer'), antigo);
  assert.equal(bt('desfazer').getAttribute('title'), 'Desfazer: Nome do Personagem: "Lira Tab" (Ctrl+Z)');
  rodaTimers(j);
  // ---- o atributo das perícias de dois atributos e do Éter (03 §10)
  const at = (p) => fp.querySelector('[data-campo="pericia-' + p + '"] .fp-per-at');
  assert.equal(at('movimento').getAttribute('title'), 'usa o maior entre Mod.FOR e Mod.DES');
  j.muda(ed('troca.pericia.movimento'), { value: 'FOR' });
  assert.equal(ficha().periciasAttr.movimento, 'FOR');
  rodaTimers(j);
  assert.equal(at('movimento').getAttribute('title'), 'usa Mod.FOR (escolhido)');
  assert.equal(barra.querySelector('.ke-ed-msg').textContent, '');
  assert.equal(bt('desfazer').getAttribute('title'), 'Desfazer: Atributo de Movimento: FOR (escolhido) (Ctrl+Z)');
  j.muda(ed('troca.recurso.eter'), { value: 'INT' });
  assert.deepEqual(ficha().identidade.escolhas, { 'attr.recurso.eter': 'INT' });
  rodaTimers(j);
  j.clica(bt('desfazer'));
  assert.deepEqual(ficha().identidade.escolhas, {});
  j.clica(bt('desfazer'));
  assert.equal(ficha().periciasAttr.movimento, undefined, 'de volta ao padrão: o maior');
  // ---- a pendência do Ofício(X): o seletor aplica o grau e fecha a pendência
  j.muda(ed('migracao.oficio'), { value: 'oficio-engenharia' });
  assert.equal(ficha().pericias['oficio-engenharia'], 1);
  rodaTimers(j);
  assert.equal(ed('migracao.oficio'), null, 'a pendência fechou');
  assert.equal(bt('desfazer').getAttribute('title'), 'Desfazer: O grau vai para Ofício(Engenharia): Treinado (Ctrl+Z)');
  j.clica(bt('desfazer'));
  assert.ok(ed('migracao.oficio'), 'desfeito: a pendência volta');
  assert.equal(ficha().pericias['oficio-engenharia'], 0);
  // ---- o ESPIÃO
  assert.deepEqual(j.ls.escritas, []);
  assert.equal(j.ls.foto(), fotoLs);
  soEnsaio(j.ss, 'revisão pela interface');
});
