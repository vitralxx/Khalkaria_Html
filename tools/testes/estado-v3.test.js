'use strict';
// Estado v3 (F3a, modo sombra): KhEstado (js/ficha/kh-estado.js), puro.
// Migração em cadeia 1.0 -> 2.0 -> 3.0 com fixtures da v2 (a ficha-v2-sintetica
// é montada à mão para os casos de borda; falta um export real, ver F3a); ajuste manual
// só onde o valor digitado difere do default E do calculado (M2); ids antigos
// re-associados por nome+tipo+classe (ambíguo ou sem par vira órfão com cache);
// várias fichas (D36) sobre storage injetado: criar, trocar, duplicar, excluir
// com export antes, quota; export/import por ficha e "exportar todas" sem rede;
// guarda contra versão futura; a sombra só lê a v2.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const E = require('../../js/ficha/kh-estado.js');
const K = require('../../js/ficha/kh-inv.js');
const { validar } = require('./esquema-min.js');
const A = require('./estado-apoio.js');

const S = A.lerJSON('data', 'ficha.schema.json');
const FIX = path.join(__dirname, 'fixtures');
const ler = (n) => JSON.parse(fs.readFileSync(path.join(FIX, n), 'utf8'));
const V1 = ler('ficha-v1.json');
const V2_ESPERADA = ler('ficha-v2-esperada.json');
const V2 = ler('ficha-v2-sintetica.json');
const AGORA = '2026-09-28T12:00:00.000Z';
const IDX = E.indiceCatalogo(A.entradasCatalogo(), 'teste-1');
const semUid = (x) => JSON.parse(JSON.stringify(x, (k, v) => (k === 'uid' ? undefined : v)));
const op = (extra) => Object.assign({ agora: () => AGORA, aleatorio: A.semente(7), catalogo: IDX }, extra || {});
const porNome = (f, nome) => f.entradas.find((e) => e.migradoDe && e.migradoDe.nome === nome);
// Calculado da Lira (Batedor nv2, V4 G7; DES 16 +3, CON 12 +1, SAB 15 +2),
// conta feita à mão pelo contrato regras-ficha/1.1 no lugar do KhRegras (F3b):
// Evasão Passiva 10+3 = 13; Instinto máx. 5; Saúde 10+4·2+1·2 = 20;
// Stamina 8+7·2+3·2 = 28; CD 10+3+2 = 15.
const CALC_LIRA = { 'evasao.passiva': 13, 'recurso.classe.max': 5, 'recurso.saude.max': 20, 'recurso.stamina.max': 28, cd: 15 };
const calcTeste = (f) => (f.meta.nome === 'Lira Vento-Sul' ? CALC_LIRA : {});

// ---------------- carga ----------------
test('carregar a fonte no node não toca em window/localStorage; o artefato segue devolvendo o KhInv', () => {
  assert.equal(typeof globalThis.window, 'undefined');
  assert.equal(typeof globalThis.localStorage, 'undefined');
  assert.equal(typeof E.migrar, 'function');
  const art = require('../../js/ficha.js');
  assert.equal(typeof art.calcular, 'function', 'require(js/ficha.js) continua sendo o KhInv');
  assert.equal(art.migrar, undefined);
});

test('navegador (vm): kh-inv + kh-estado registram window.KhEstado sem tocar no storage', () => {
  const toque = [];
  const proibido = new Proxy({}, { get: (_, k) => { toque.push(String(k)); throw new Error('storage tocado'); } });
  const win = { localStorage: proibido, sessionStorage: proibido };
  const sb = vm.createContext({ window: win });
  ['kh-inv.js', 'kh-estado.js'].forEach((n) => vm.runInContext(
    fs.readFileSync(path.join(A.RAIZ, 'js', 'ficha', n), 'utf8'), sb, { filename: n }));
  assert.ok(win.KhEstado && win.KhInv);
  assert.deepEqual(Object.keys(win.KhEstado).sort(), Object.keys(E).sort());
  assert.deepEqual(toque, []);
  const art = fs.readFileSync(path.join(A.RAIZ, 'js', 'ficha.js'), 'utf8');
  assert.ok(art.indexOf('// ==== js/ficha/kh-estado.js ====') > art.indexOf('// ==== js/ficha/kh-inv.js ===='));
  assert.ok(art.indexOf('// ==== js/ficha/kh-estado.js ====') < art.indexOf('// ==== js/ficha/ficha-v2.js ===='));
});

// ---------------- migração ----------------
test('v1 -> v2: o passo do KhEstado dá o mesmo inventário e campos que o fixture esperado', () => {
  const v2 = E.migrarV1paraV2(V1, '2026-09-25T12:00:00.000Z');
  const esp = V2_ESPERADA;
  assert.deepEqual(semUid(v2.inventario), esp.inventario);
  ['meta', 'atributos', 'recursos', 'derivadosManuais', 'lore', 'migradoEm', 'schemaVersion'].forEach((k) =>
    assert.deepEqual(v2[k], esp[k], k));
  assert.deepEqual(K.migrarV1(V1, '2026-09-25T12:00:00.000Z').inventario.bugigangas.length, v2.inventario.bugigangas.length);
});

test('v1 -> v3 em cadeia: valida, atributo vira base com migradoTotal, perícias em grau', () => {
  const r = E.migrar(V1, op());
  assert.equal(r.de, '1.0');
  const f = r.ficha;
  assert.deepEqual(validar(S, f), []);
  assert.equal(f.migracao.de, '1.0');
  assert.deepEqual(f.atributos.base, { FOR: 14, DES: 12, CON: 14, INT: 10, SAB: 10 });
  assert.equal(f.atributos.migradoTotal, true);
  assert.equal(f.atributos.nivelMigrado, 2);
  assert.equal(f.atributos.fonte, 'migrado');
  assert.equal(f.pericias.atacar, 1);
  assert.equal(f.pericias.defender, 1);
  assert.equal(f.identidade.raca.id, 'raca-anao');
  assert.equal(f.identidade.classe.id, 'classe-brutalista');
  assert.equal(f.identidade.origem.id, 'origem-mineiro');
  assert.equal(f.inventario.sins, 37);
  assert.deepEqual(semUid(f.inventario), V2_ESPERADA.inventario);
});

test('v2 -> v3: identidade por id, entradas por referência, órfãs com cache', () => {
  const { ficha: f, avisos } = E.migrar(V2, op());
  assert.deepEqual(validar(S, f), []);
  assert.deepEqual(f.identidade.raca, { id: 'raca-humano', nome: 'Humano' });
  assert.deepEqual(f.identidade.variante, { id: 'humano-simples', nome: 'Simples' });
  assert.equal(f.identidade.classe.id, 'classe-batedor');
  assert.equal(f.identidade.ramo.id, 'batedor-ramo-do-cartografo', 'ramo pelo apelido "Cartógrafo"');
  assert.equal(f.identidade.origem.id, 'origem-cacador', '"Caçador" é origem aqui, não a técnica');
  const ids = (nome) => { const e = porNome(f, nome); return e && [e.tipo, e.id]; };
  assert.deepEqual(ids('Oportunista'), ['tecnica', 'batedor-oportunista'], 'desempata pela classe');
  assert.deepEqual(ids('Atento'), ['tecnica', 'batedor-atento']);
  assert.deepEqual(ids('Visão Térmica'), ['tecnologia', 'automato-visao-termica']);
  assert.deepEqual(ids('Cicatrizes da Jornada'), ['marca', 'batedor-cicatrizes-da-jornada']);
  assert.deepEqual(ids('Silêncio'), ['ultimate', 'batedor-silencio']);
  assert.deepEqual(ids('Persistência Humana'), ['traco', 'humano-persistencia-humana']);
  assert.deepEqual(ids('Sangue Morto (-1)'), ['corrupcao', 'corrompido-sangue-morto']);
  assert.deepEqual(ids('Fagulha'), ['magia', 'magia-fagulha']);
  assert.deepEqual(ids('Alma Resiliente'), ['carta', 'limiar-alma-resiliente']);
  assert.deepEqual(ids('Estabanado'), ['dor', 'abismo-estabanado']);
  assert.deepEqual(ids('Olhos da Noite'), ['beneficio', 'abismo-olhos-da-noite']);
  const amb = porNome(f, 'Passo do Vento');
  assert.equal(amb.id, null);
  assert.equal(amb.orfao.motivo, 'ambiguo');
  assert.deepEqual(amb.orfao.candidatos.sort(), ['tecnica:artilheiro-passo-do-vento', 'tecnica:monge-passo-do-vento']);
  assert.equal(amb.cache.nome, 'Passo do Vento');
  assert.equal(amb.cache.resumo, 'Duas classes têm uma técnica com este nome.');
  const sem = porNome(f, 'Golpe Esquecido');
  assert.deepEqual([sem.id, sem.orfao.motivo, sem.cache.nome], [null, 'sem-par', 'Golpe Esquecido']);
  assert.deepEqual(sem.migradoDe, { id: 'tecnica-golpe-esquecido', tipo: 'tecnica', nome: 'Golpe Esquecido', efeitoNoTotal: true });
  assert.equal(f.entradas.length, 13, 'nada da v2 se perde');
  assert.equal(avisos.filter((a) => a.tipo === 'orfa').length, 2);
  assert.equal(porNome(f, 'Fagulha').cache.versaoCatalogo, 'teste-1');
  assert.deepEqual(porNome(f, 'Fagulha').estado, { intensidade: null, sustentando: false });
  assert.equal(new Set(f.entradas.map((e) => e.uid)).size, f.entradas.length);
});

test('v2 -> v3: estado, resistências (ordinário vira os 3 tipos), Ofício(X) vira pendência', () => {
  const f = E.migrar(V2, op()).ficha;
  assert.deepEqual(f.meta, { nome: 'Lira Vento-Sul', jogador: 'Jogador 2', nivel: 2, xp: 350 });
  assert.deepEqual([f.recursos.saude.atual, f.recursos.stamina.atual, f.recursos.eter.atual], [18, 10, 0]);
  assert.deepEqual(f.recursos.classe, { id: null, nome: 'Instinto', atual: 2 });
  assert.deepEqual([f.pericias.atacar, f.pericias.percepcao, f.pericias.furtividade], [1, 2, 1]);
  ['oficio-engenharia', 'oficio-ferraria', 'oficio-alquimia'].forEach((p) => assert.equal(f.pericias[p], 0, p));
  assert.deepEqual(f.migracao.pendencias.map((p) => [p.campo, p.grau]), [['pericias.oficio', 1]]);
  ['cortante', 'contundente', 'perfurante'].forEach((t) => assert.deepEqual(f.resistencias.tipos[t], { R: true, I: false, V: false, ae: 0 }, t));
  assert.equal(f.resistencias.aeCategoria.ordinario, 1);
  assert.deepEqual(f.resistencias.tipos.fogo, { R: false, I: true, V: false, ae: 0 });
  assert.deepEqual(f.vinculoV2, { revV2: 17, salvoEmV2: '2026-09-27T21:14:03.512Z' });
  assert.equal(f.inventario.equipamentos[1].equipado, true);
  assert.deepEqual(f.inventario, V2.inventario, 'inventário do KhInv intacto');
  assert.equal(f.lore.historia, 'Cresceu nas trilhas do sul.');
});

test('ajuste só onde o valor da v2 difere do default E do calculado', () => {
  // calculado de mentira, no lugar do KhRegras (F3b)
  const calculado = () => ({ 'evasao.passiva': 13, 'recurso.saude.max': 20, 'recurso.stamina.max': 14, cd: 12, 'ar': 0 });
  const f = E.migrar(V2, op({ calculado })).ficha;
  assert.deepEqual(Object.keys(f.ajustes).sort(), ['recurso.classe.max', 'recurso.saude.max']);
  assert.deepEqual(f.ajustes['recurso.saude.max'], { modo: 'fixa', valor: 22, motivo: 'Valor digitado na ficha v2',
    temporario: false, desde: AGORA, calculadoEm: 20, origem: 'migracao' });
  assert.equal(f.ajustes['recurso.classe.max'].calculadoEm, null, 'sem calculado: fica, para conferir');
  // cd 0 e movimento 9 são o default da v2: nunca viram ajuste, nem com calculado diferente
  assert.ok(!('cd' in f.ajustes) && !('movimento' in f.ajustes) && !('recurso.eter.max' in f.ajustes));
  assert.deepEqual(validar(S, f), []);
});

test('sem calculado, o ajuste fica com calculadoEm null e a poda tira o que bate', () => {
  const f = E.migrar(V2, op()).ficha;
  assert.deepEqual(Object.keys(f.ajustes).sort(), ['evasao.passiva', 'recurso.classe.max', 'recurso.saude.max', 'recurso.stamina.max']);
  Object.values(f.ajustes).forEach((a) => assert.equal(a.calculadoEm, null));
  assert.equal(f.migracao.ajustesPendentesDePoda, true, 'sem o motor: marcada como provisória');
  assert.deepEqual(validar(S, f), []);
  f.ajustes.cd = { modo: 'fixa', valor: 99, desde: AGORA, origem: 'manual' };
  const podados = E.podarAjustesMigrados(f, { 'evasao.passiva': 13, 'recurso.saude.max': 20, cd: 99 });
  assert.deepEqual(podados, ['evasao.passiva']);
  assert.equal(f.ajustes['recurso.saude.max'].calculadoEm, 20);
  assert.ok('cd' in f.ajustes, 'ajuste manual nunca é podado');
  assert.ok(!('ajustesPendentesDePoda' in f.migracao), 'a poda tira a marca');
});

test('migração sem catálogo: identidade só com nome, entradas órfãs "sem-catalogo"; reassociar resolve depois', () => {
  const f = E.migrar(V2, op({ catalogo: null })).ficha;
  assert.deepEqual(validar(S, f), []);
  assert.deepEqual(f.identidade.classe, { id: null, nome: 'Batedor' });
  assert.ok(f.entradas.every((e) => e.id === null && e.orfao.motivo === 'sem-catalogo'));
  f.identidade.classe = { id: 'classe-batedor', nome: 'Batedor' };   // o que a UI faria ao escolher
  assert.equal(E.reassociar(f, IDX), 11);
  assert.equal(porNome(f, 'Oportunista').id, 'batedor-oportunista');
  assert.equal(porNome(f, 'Passo do Vento').orfao.motivo, 'ambiguo');
  assert.equal(porNome(f, 'Golpe Esquecido').orfao.motivo, 'sem-par');
  assert.deepEqual(validar(S, f), []);
});

test('guarda: versão futura recusada; v3 idempotente; lixo recusado', () => {
  assert.deepEqual(E.migrar({ schemaVersion: '4.0', meta: {} }), { erro: 'versao-futura', versao: '4.0' });
  assert.deepEqual(E.migrar(null), { erro: 'invalida' });
  assert.deepEqual(E.migrar({ foo: 1 }), { erro: 'invalida' });
  const f = E.migrar(V2, op()).ficha;
  const deNovo = E.migrar(JSON.parse(JSON.stringify(f)), op());
  assert.equal(deNovo.de, '3.0');
  assert.deepEqual(deNovo.ficha, f);
  const sem = JSON.parse(JSON.stringify(f)); delete sem.id;
  assert.match(E.migrar(sem, op()).ficha.id, /^f[a-z0-9]{12}$/);
});

// ---------------- sombra ----------------
test('sombra: lê khalkaria_ficha e devolve a v3 em memória sem escrever nada', () => {
  const st = A.soLeitura({ khalkaria_ficha: JSON.stringify(V2) });
  const r = E.sombra(st, op());
  assert.equal(r.de, '2.0');
  assert.equal(r.ficha.meta.nome, 'Lira Vento-Sul');
  assert.deepEqual(validar(S, r.ficha), []);
  assert.deepEqual(st.escritas, []);
  assert.deepEqual([...st.m.keys()], ['khalkaria_ficha']);
  assert.equal(E.sombra(A.soLeitura({}), op()), null);
  assert.deepEqual(E.sombra(A.soLeitura({ khalkaria_ficha: '{' }), op()), { erro: 'json' });
});

// ---------------- várias fichas (D36) ----------------
function novoArmazem(inicial, limite, ss) {
  const ls = A.armazenamento(inicial, limite);
  const sessao = ss === undefined ? A.armazenamento() : ss;
  return { ls, ss: sessao, a: E.armazem(ls, sessao, { agora: A.relogio(), aleatorio: A.semente(11), catalogo: IDX, calculado: calcTeste }) };
}

test('criar: índice + chave por ficha, a nova vira a ativa, as outras intactas', () => {
  const { ls, ss, a } = novoArmazem();
  const r1 = a.criar({ nome: 'Ana', nivel: 2 });
  assert.equal(r1.ok, true);
  assert.equal(a.ativa(), r1.id);
  const f1 = ls.getItem('khalkaria_ficha_v3:' + r1.id);
  const r2 = a.criar({ nome: 'Bia' });
  assert.equal(a.ativa(), r2.id);
  assert.equal(ls.getItem('khalkaria_ficha_v3:' + r1.id), f1, 'a primeira não foi tocada');
  const ind = ls.json('khalkaria_fichas_v3');
  assert.deepEqual(validar(S, ind, '#/$defs/indiceFichas'), []);
  assert.deepEqual(ind.fichas.map((x) => [x.nome, x.nivel]), [['Ana', 2], ['Bia', 1]]);
  assert.equal(ind.ultimaAtiva, r2.id);
  assert.equal(ss.getItem('khalkaria_ficha_ativa'), r2.id);
  assert.deepEqual(validar(S, a.ler(r1.id)), []);
  assert.ok(!ls.m.has('khalkaria_ficha') && !ls.m.has('khalkaria_ficha_dono'), 'nunca a v2 nem o marcador');
});

test('trocar: ativa por aba (sessionStorage); a última escolhida abre numa aba nova', () => {
  const { ls, a } = novoArmazem();
  const id1 = a.criar({ nome: 'Ana' }).id, id2 = a.criar({ nome: 'Bia' }).id;
  const abaB = E.armazem(ls, A.armazenamento(), { agora: A.relogio() });
  assert.equal(abaB.ativa(), id2, 'aba nova abre a última ativa');
  assert.equal(abaB.trocar(id1).ok, true);
  assert.equal(abaB.ativa(), id1);
  assert.equal(a.ativa(), id2, 'trocar numa aba não arrasta a outra');
  const abaC = E.armazem(ls, null, {});
  assert.equal(abaC.ativa(), id1, 'aba sem sessionStorage: ultimaAtiva');
  assert.deepEqual(a.trocar('fnaoexiste'), { ok: false, erro: 'inexistente' });
});

test('gravar: rev++ e salvoEm; recusa por cima de rev maior ou de versão futura', () => {
  const { ls, a } = novoArmazem();
  const id = a.criar({ nome: 'Ana' }).id;
  const f = a.ler(id);
  f.meta.nome = 'Ana Clara';
  const r = a.gravar(f);
  assert.equal(r.ok, true);
  assert.equal(f.rev, 1);
  assert.equal(a.listar()[0].nome, 'Ana Clara', 'a linha do índice muda na mesma gravação');
  const velha = a.ler(id); velha.rev = 0;
  assert.deepEqual(a.gravar(velha), { ok: false, erro: 'desatualizada', rev: 1 });
  const fut = ls.json('khalkaria_ficha_v3:' + id); fut.schemaVersion = '4.0';
  ls.m.set('khalkaria_ficha_v3:' + id, JSON.stringify(fut));
  assert.equal(a.gravar(f).erro, 'versao-futura');
  assert.equal(a.ler(id), null, 'versão futura não é lida como v3');
});

test('índice de versão futura: armazém só-leitura, nada é escrito', () => {
  const { ls, a } = novoArmazem({ khalkaria_fichas_v3: JSON.stringify({ schema: 'fichas/2', fichas: [] }) });
  assert.equal(a.somenteLeitura(), true);
  assert.deepEqual(a.criar({ nome: 'X' }), { ok: false, erro: 'somente-leitura' });
  assert.equal(a.importar(JSON.stringify(V2)).erro, 'somente-leitura');
  assert.deepEqual(ls.escritas, []);
});

test('duplicar: id novo, "(cópia)", sem log, sem sessão e sem vínculo com a v2', () => {
  const { ls, a } = novoArmazem();
  const imp = a.importar(JSON.stringify(V2));
  const id = imp.ids[0];
  a.gravarLog(id, { passos: [] });
  a.gravarSessao(id, { modo: 'mesa', turno: 3, log: [] });
  const usoAntes = a.uso().bytes;
  const d = a.duplicar(id);
  assert.equal(d.ok, true);
  assert.notEqual(d.id, id);
  const c = a.ler(d.id);
  assert.equal(c.meta.nome, 'Lira Vento-Sul (cópia)');
  assert.equal(c.vinculoV2, null);
  assert.equal(a.ler(id).vinculoV2.revV2, 17);
  assert.equal(ls.getItem('khalkaria_ficha_v3_log:' + d.id), null);
  assert.equal(ls.getItem('khalkaria_ficha_v3_sessao:' + d.id), null);
  assert.deepEqual(c.entradas, a.ler(id).entradas);
  assert.equal(a.ativa(), d.id);
  assert.ok(a.uso().bytes > usoAntes, 'o uso da quota sobe ao duplicar');
});

test('excluir: exige o export antes; apaga ficha, log, sessão e rascunho; a ativa vai para a mais recente', () => {
  const { ls, a } = novoArmazem();
  const id1 = a.criar({ nome: 'Ana' }).id, id2 = a.criar({ nome: 'Bia' }).id, id3 = a.criar({ nome: 'Cid' }).id;
  a.trocar(id2);
  a.gravarLog(id2, { passos: [] });
  a.gravarSessao(id2, { modo: 'mesa', log: [] });
  ls.setItem('khalkaria_nivel_rascunho:' + id2, '{}');
  assert.deepEqual(a.excluir(id2), { ok: false, erro: 'sem-export' });
  assert.equal(a.excluir(id2, { exportar: () => false }).erro, 'export-falhou');
  assert.ok(a.ler(id2), 'export que falha não apaga');
  const baixados = [];
  const r = a.excluir(id2, { exportar: (x) => { baixados.push(x); } });
  assert.equal(r.ok, true);
  assert.equal(baixados.length, 1);
  assert.equal(baixados[0].nomeArquivo, 'Bia.khalkaria.json');
  assert.equal(baixados[0].dados.id, id2);
  assert.deepEqual(baixados[0].dados.estadoSessao, { modo: 'mesa', log: [] });
  ['khalkaria_ficha_v3:', 'khalkaria_ficha_v3_log:', 'khalkaria_ficha_v3_sessao:', 'khalkaria_nivel_rascunho:']
    .forEach((p) => assert.equal(ls.getItem(p + id2), null, p));
  assert.equal(r.ativa, id3, 'a mais recente');
  assert.equal(a.ativa(), id3);
  assert.deepEqual(a.listar().map((x) => x.id), [id1, id3]);
  a.excluir(id1, { exportar: () => true });
  a.excluir(id3, { exportar: () => true });
  assert.deepEqual(a.listar(), []);
  assert.equal(a.ativa(), null);
  assert.deepEqual(validar(S, ls.json('khalkaria_fichas_v3'), '#/$defs/indiceFichas'), []);
});

test('quota: limpa logs das inativas, depois o da ativa, depois o backup v1; nunca ficha nem índice', () => {
  const { ls, a } = novoArmazem();
  const id1 = a.criar({ nome: 'Ana' }).id, id2 = a.criar({ nome: 'Bia' }).id;   // id2 ativa
  const bloco = 'x'.repeat(4000);
  a.gravarLog(id1, { passos: [], lixo: bloco });
  a.gravarLog(id2, { passos: [], lixo: bloco });
  ls.setItem('khalkaria_ficha_v1_backup', bloco);
  const tot = () => [...ls.m.entries()].reduce((s, [k, v]) => s + k.length + v.length, 0);
  // cabe só depois de apagar os dois logs
  ls.limite = tot() + 1000;
  const f = a.ler(id2); f.lore.historia = 'y'.repeat(8000);
  const r = a.gravar(f);
  assert.equal(r.ok, true);
  assert.deepEqual(r.limpou, ['khalkaria_ficha_v3_log:' + id1, 'khalkaria_ficha_v3_log:' + id2]);
  assert.ok(ls.m.has('khalkaria_ficha_v1_backup'));
  // agora nem apagando o backup cabe: erro tratável, a ficha no storage fica como estava
  const antes = ls.getItem('khalkaria_ficha_v3:' + id2);
  const g = a.ler(id2); g.lore.historia = 'z'.repeat(40000);
  const r2 = a.gravar(g);
  assert.deepEqual([r2.ok, r2.erro, r2.sugestao], [false, 'quota', 'exportarTodas']);
  assert.deepEqual(r2.limpou, ['khalkaria_ficha_v1_backup']);
  assert.equal(ls.getItem('khalkaria_ficha_v3:' + id2), antes);
  assert.ok(ls.m.has('khalkaria_ficha_v3:' + id1) && ls.m.has('khalkaria_fichas_v3'));
});

test('quota no índice: a ficha nova é desfeita (nada fica pela metade)', () => {
  const { ls, a } = novoArmazem();
  a.criar({ nome: 'Ana' });
  const chavesAntes = [...ls.m.keys()].sort();
  const ficha = JSON.stringify(E.novaFicha({ nome: 'Bia' }));
  ls.limite = [...ls.m.entries()].reduce((s, [k, v]) => s + k.length + v.length, 0) + ficha.length + 40;
  const r = a.criar({ nome: 'Bia' });
  assert.equal(r.erro, 'quota');
  assert.deepEqual([...ls.m.keys()].sort(), chavesAntes);
});

// ---------------- export / import ----------------
test('export nativo sem rede: a ficha inteira com cache e a sessão; valida no schema', () => {
  const chamadas = [];
  global.fetch = () => { chamadas.push(1); throw new Error('sem rede'); };
  try {
    const { a } = novoArmazem();
    const id = a.importar(JSON.stringify(V2)).ids[0];
    a.gravarSessao(id, { modo: 'mesa', turno: 2, acoesGastas: 1, log: [{ t: AGORA, tipo: 'rolagem', texto: '1d20+3 = 15' }] });
    a.gravarLog(id, { passos: [{ revPorParte: {}, partes: ['recursos'], antes: {}, rotulo: 'dano' }] });
    const ex = a.exportar(id);
    assert.equal(ex.nomeArquivo, 'Lira_Vento-Sul.khalkaria.json');
    assert.deepEqual(validar(S, ex.dados), []);
    assert.equal(ex.dados.estadoSessao.turno, 2);
    assert.ok(!('log' in ex.dados), 'o log de desfazer não vai no export');
    assert.ok(ex.dados.exportadoEm);
    assert.equal(porNome(ex.dados, 'Golpe Esquecido').cache.nome, 'Golpe Esquecido');
    const todas = a.exportarTodas();
    assert.equal(todas.nomeArquivo, 'khalkaria-fichas.json');
    assert.deepEqual(validar(S, todas.dados, '#/$defs/pacoteFichas'), []);
    assert.deepEqual(chamadas, []);
  } finally { delete global.fetch; }
});

test('"exportar todas" -> importar num navegador vazio recria as fichas e as sessões', () => {
  const orig = novoArmazem();
  const id1 = orig.a.importar(JSON.stringify(V2)).ids[0];
  const id2 = orig.a.criar({ nome: 'Bia', nivel: 3 }).id;
  orig.a.gravarSessao(id1, { modo: 'mesa', turno: 4, log: [] });
  const pacote = JSON.stringify(orig.a.exportarTodas().dados);
  const novo = novoArmazem();
  const r = novo.a.importar(pacote);
  assert.equal(r.ok, true);
  assert.deepEqual(r.ids, [id1, id2], 'navegador vazio: os ids se mantêm');
  assert.deepEqual(novo.a.listar().map((x) => x.nome), ['Lira Vento-Sul', 'Bia']);
  const a1 = orig.a.ler(id1), b1 = novo.a.ler(id1);
  ['meta', 'identidade', 'atributos', 'pericias', 'entradas', 'inventario', 'ajustes', 'resistencias', 'vinculoV2']
    .forEach((k) => assert.deepEqual(b1[k], a1[k], k));
  assert.deepEqual(novo.a.lerSessao(id1), { modo: 'mesa', turno: 4, log: [] });
  assert.equal(novo.a.ler(id2).meta.nivel, 3);
});

test('import com id que já existe: pergunta; "copia" dá id novo; "atualizar" exporta a de lá antes', () => {
  const { a } = novoArmazem();
  const id = a.criar({ nome: 'Ana' }).id;
  const ex = JSON.stringify(Object.assign(a.exportar(id).dados, { meta: { nome: 'Ana 2', jogador: '', nivel: 4, xp: 0 } }));
  const r0 = a.importar(ex);
  assert.deepEqual([r0.ok, r0.erro, r0.conflitos], [false, 'conflito', [id]]);
  assert.equal(a.listar().length, 1, 'sem resposta, nada é gravado');
  const rc = a.importar(ex, { conflito: 'copia' });
  assert.equal(rc.ok, true);
  assert.notEqual(rc.ids[0], id);
  assert.equal(a.ler(id).meta.nome, 'Ana');
  const baixados = [];
  assert.equal(a.importar(ex, { conflito: 'atualizar', exportar: () => false }).erro, 'export-falhou');
  const ra = a.importar(ex, { conflito: 'atualizar', exportar: (x) => baixados.push(x.dados.meta.nome) });
  assert.equal(ra.ok, true);
  assert.deepEqual(baixados, ['Ana']);
  assert.equal(a.ler(id).meta.nome, 'Ana 2');
  assert.equal(a.ler(id).meta.nivel, 4);
  assert.equal(a.listar().length, 2);
});

test('import com órfão: id que sumiu do catálogo fica, com o cache; os outros atualizam o cache', () => {
  const { a } = novoArmazem();
  const f = E.novaFicha({ nome: 'Órfã' }, { aleatorio: A.semente(3) });
  f.entradas.push(
    { uid: 'u1', tipo: 'tecnica', id: 'batedor-tecnica-que-saiu', estado: { usos: null },
      cache: { nome: 'Técnica Que Saiu', resumo: 'Texto de quando foi levada.', versaoCatalogo: 'antigo' }, mods: [] },
    { uid: 'u2', tipo: 'magia', id: 'magia-fagulha', estado: {},
      cache: { nome: 'Fagulha (nome velho)', versaoCatalogo: 'antigo' }, mods: [] });
  const r = a.importar(JSON.stringify(f));
  assert.equal(r.ok, true);
  const g = a.ler(r.ids[0]);
  const orfa = g.entradas.find((e) => e.uid === 'u1');
  assert.deepEqual(orfa.orfao, { motivo: 'sumiu' });
  assert.equal(orfa.id, 'batedor-tecnica-que-saiu', 'o id fica: a entrada nunca é apagada');
  assert.deepEqual(orfa.cache, { nome: 'Técnica Que Saiu', resumo: 'Texto de quando foi levada.', versaoCatalogo: 'antigo' });
  const ok = g.entradas.find((e) => e.uid === 'u2');
  assert.equal(ok.cache.nome, 'Fagulha');
  assert.equal(ok.cache.versaoCatalogo, 'teste-1');
  assert.ok(!ok.orfao);
  assert.deepEqual(validar(S, g), []);
});

test('import de v1/v2: entra como ficha nova migrada; arquivo inválido ou futuro é recusado', () => {
  const { a } = novoArmazem();
  const r = a.importar(JSON.stringify(V2));
  assert.equal(r.ok, true);
  const f = a.ler(r.ids[0]);
  assert.equal(f.migracao.de, '2.0');
  assert.equal(f.identidade.classe.id, 'classe-batedor');
  assert.equal(a.importar(JSON.stringify(V1)).ok, true);
  assert.equal(a.listar().length, 2);
  assert.equal(a.importar('{nao é json').erro, 'json');
  assert.equal(a.importar(JSON.stringify({ schemaVersion: '4.0', meta: {} })).erro, 'versao-futura');
  assert.equal(a.importar(JSON.stringify({ schema: 'fichas/9', fichas: [] })).erro, 'versao-futura');
  assert.equal(a.importar(JSON.stringify({ schema: 'fichas/1', ultimaAtiva: null, fichas: [{ id: 'fx', nome: 'x' }] })).erro, 'invalida');
  assert.equal(a.listar().length, 2);
});

test('uso da quota: soma só as chaves khalkaria_*, 2 bytes por caractere', () => {
  const { ls, a } = novoArmazem({ outra_coisa: 'x'.repeat(500) });
  a.criar({ nome: 'Ana' });
  const u = a.uso();
  const esperado = [...ls.m.entries()].filter(([k]) => k.startsWith('khalkaria_'))
    .reduce((s, [k, v]) => s + (k.length + v.length) * 2, 0);
  assert.equal(u.bytes, esperado);
  assert.equal(u.limite, 5 * 1024 * 1024);
  assert.ok(!('outra_coisa' in u.porChave));
});

// ---------------- correções da revisão (F3a) ----------------
// Catálogo com Mods de teste nas cartas (o data/catalogo ainda não traz Mods):
// "+1 ponto de força", "+1 Evasão ... +1 nível de treinamento em Defender".
const MODS_TESTE = {
  'limiar-coluna-de-tita': [{ alvo: 'atributo.FOR', op: 'soma', valor: 1 }],
  'limiar-sombra-dancante': [{ alvo: 'evasao.passiva', op: 'soma', valor: 1 }, { alvo: 'pericia.defender', op: 'soma', valor: 1 }],
  'limiar-barbaro': [{ alvo: 'atributo.FOR', op: 'soma', valor: 1 }, { alvo: 'atributo.CON', op: 'soma', valor: 1 },
    { alvo: 'atributo.INT', op: 'soma', valor: -1 }, { alvo: 'atributo.SAB', op: 'soma', valor: -1 }]
};
const IDX_MODS = E.indiceCatalogo(A.entradasCatalogo().map((e) => (MODS_TESTE[e.id] ? Object.assign({}, e, { mods: MODS_TESTE[e.id] }) : e)), 'teste-mods');
const soma = (f, alvo) => E.modsAplicaveis(f).filter((x) => x.mod.alvo === alvo).reduce((t, x) => t + x.mod.valor, 0);

test('migração não conta duas vezes: carta que já estava no total digitado da v2 não soma de novo', () => {
  const v2 = JSON.parse(JSON.stringify(V2));
  v2.atributos.for = 13;
  v2.cartasLimiar = [{ id: 'carta-coluna', tipo: 'carta', nome: 'Coluna de Titã', descricao: '' },
    { id: 'carta-sombra', tipo: 'carta', nome: 'Sombra Dançante', descricao: '' }];
  const f = E.migrar(v2, op({ catalogo: IDX_MODS, calculado: CALC_LIRA })).ficha;
  assert.deepEqual(validar(S, f), []);
  assert.equal(f.meta.nivel, 2);
  const col = porNome(f, 'Coluna de Titã');
  assert.deepEqual(col.mods, MODS_TESTE['limiar-coluna-de-tita'], 'a migração copia o snapshot dos Mods do catálogo');
  assert.equal(col.migradoDe.efeitoNoTotal, true);
  assert.deepEqual(f.periciasMigracao, { migradoTotal: true, nivelMigrado: 2 });
  assert.equal(f.atributos.base.FOR + soma(f, 'atributo.FOR'), 13, 'FOR 13 com Coluna de Titã e nível 2 fica 13, não 14');
  assert.equal(soma(f, 'pericia.defender'), 0, 'o treinamento da Sombra Dançante já está no grau da v2');
  assert.equal(soma(f, 'evasao.passiva'), 1, 'o +1 Evasão conta: a Evasão é calculada na v3');
  // carta levada DEPOIS da migração soma normalmente
  f.entradas.push({ uid: 'unova', tipo: 'carta', id: 'limiar-barbaro', estado: E.estadoPadrao('carta'),
    cache: { nome: 'Bárbaro', versaoCatalogo: 'teste-mods' }, mods: MODS_TESTE['limiar-barbaro'] });
  assert.equal(f.atributos.base.FOR + soma(f, 'atributo.FOR'), 14);
  assert.equal(soma(f, 'atributo.SAB'), -1);
  assert.deepEqual(validar(S, f), []);
  // ficha nova (não migrada): nada é tirado
  const n = E.novaFicha();
  const semMarca = JSON.parse(JSON.stringify(col)); delete semMarca.migradoDe;
  n.entradas.push(semMarca);
  assert.equal(soma(n, 'atributo.FOR'), 1);
});

test('mods das migradas: sem catálogo nascem [] e o reassociar/reconciliar preenchem do catálogo', () => {
  const v2 = JSON.parse(JSON.stringify(V2));
  v2.cartasLimiar = [{ id: 'c1', tipo: 'carta', nome: 'Sombra Dançante', descricao: '' }];
  const f = E.migrar(v2, op({ catalogo: null })).ficha;
  const e = porNome(f, 'Sombra Dançante');
  assert.deepEqual([e.id, e.mods], [null, []]);
  f.identidade.classe = { id: 'classe-batedor', nome: 'Batedor' };
  E.reassociar(f, IDX_MODS);
  assert.deepEqual(e.mods, MODS_TESTE['limiar-sombra-dancante']);
  e.mods = [];
  E.reconciliar(f, IDX_MODS);
  assert.deepEqual(e.mods, MODS_TESTE['limiar-sombra-dancante'], 'reconciliar renova o snapshot');
  E.reconciliar(f, IDX);
  assert.deepEqual(e.mods, MODS_TESTE['limiar-sombra-dancante'], 'catálogo sem Mods não apaga o snapshot');
});

test('poda: com o calculado do contrato, a fixture migra só com saude.max e stamina.max', () => {
  const f = E.migrar(V2, op({ calculado: CALC_LIRA })).ficha;
  assert.deepEqual(Object.keys(f.ajustes).sort(), ['recurso.saude.max', 'recurso.stamina.max']);
  assert.ok(!('ajustesPendentesDePoda' in f.migracao));
  const sombra = E.sombra(A.soLeitura({ khalkaria_ficha: JSON.stringify(V2) }), op());
  assert.equal(sombra.ficha.migracao.ajustesPendentesDePoda, true, 'a sombra sem motor sai provisória');
  E.podarAjustesMigrados(sombra.ficha, CALC_LIRA);
  assert.deepEqual(Object.keys(sombra.ficha.ajustes).sort(), ['recurso.saude.max', 'recurso.stamina.max']);
});

test('armazém não grava ficha com poda pendente (import sem calculado, gravar)', () => {
  const ls = A.armazenamento();
  const a = E.armazem(ls, A.armazenamento(), { agora: A.relogio(), aleatorio: A.semente(5), catalogo: IDX });
  assert.equal(a.importar(JSON.stringify(V2)).erro, 'poda-pendente');
  assert.equal(ls.getItem('khalkaria_fichas_v3'), null, 'nada foi gravado');
  const r = a.importar(JSON.stringify(V2), { calculado: CALC_LIRA });
  assert.equal(r.ok, true);
  const f = a.ler(r.ids[0]);
  assert.deepEqual(Object.keys(f.ajustes).sort(), ['recurso.saude.max', 'recurso.stamina.max']);
  f.migracao.ajustesPendentesDePoda = true;
  assert.equal(a.gravar(f).erro, 'poda-pendente');
});

test('duas abas: excluir numa não deixa a outra ressuscitar a ficha; a outra vê ativaExcluida', () => {
  const ls = A.armazenamento();
  const abaA = E.armazem(ls, A.armazenamento(), { agora: A.relogio(), aleatorio: A.semente(1) });
  const abaB = E.armazem(ls, A.armazenamento(), { agora: A.relogio('2026-09-28T13:00:00.000Z'), aleatorio: A.semente(2) });
  const um = abaA.criar({ nome: 'Um' }).id, dois = abaA.criar({ nome: 'Dois' }).id;
  abaB.trocar(um);
  const emB = abaB.ler(um);
  assert.equal(abaA.excluir(um, { exportar: () => true }).ok, true);
  emB.meta.nome = 'Um editado na B';
  assert.deepEqual(abaB.gravar(emB), { ok: false, erro: 'excluida' });
  assert.deepEqual(abaA.listar().map((x) => x.nome), ['Dois']);
  assert.equal(ls.getItem('khalkaria_ficha_v3:' + um), null);
  assert.equal(abaB.ativa(), null, 'não troca em silêncio');
  assert.equal(abaB.ativaExcluida(), um);
  assert.equal(abaB.trocar(dois).ok, true, '"Trocar" sai do estado');
  assert.equal(abaB.ativaExcluida(), null);
  assert.equal(abaB.ativa(), dois);
});

test('excluir ficha ilegível ou de versão futura: só com o export cru; "exportar todas" leva as cruas', () => {
  const { ls, a } = novoArmazem();
  const boa = a.criar({ nome: 'Boa' }).id, ruim = a.criar({ nome: 'Ruim' }).id, fut = a.criar({ nome: 'Futura' }).id;
  ls.m.set('khalkaria_ficha_v3:' + ruim, '{corrompido');
  const futura = JSON.stringify({ schemaVersion: '4.0', id: fut, meta: { nome: 'Futura' }, novidade: 1 });
  ls.m.set('khalkaria_ficha_v3:' + fut, futura);
  const chamadas = [];
  const r = a.excluir(ruim, { exportar: (x) => { chamadas.push(x); return true; } });
  assert.deepEqual([r.ok, r.erro, r.motivo, r.cru.texto], [false, 'ilegivel', 'ilegivel', '{corrompido']);
  assert.deepEqual(chamadas, [], 'o export nulo nunca vale como export');
  assert.equal(ls.getItem('khalkaria_ficha_v3:' + ruim), '{corrompido', 'nada foi apagado');
  assert.equal(a.excluir(fut, { exportar: () => true }).motivo, 'versao-futura');
  // exportar todas: as cruas vão no pacote e voltam em erros
  const todas = a.exportarTodas();
  assert.deepEqual(todas.dados.fichas.map((x) => x.id), [boa]);
  assert.deepEqual(todas.dados.ilegiveis.map((x) => [x.id, x.motivo, x.texto]),
    [[ruim, 'ilegivel', '{corrompido'], [fut, 'versao-futura', futura]]);
  assert.deepEqual(todas.erros, [{ id: ruim, motivo: 'ilegivel' }, { id: fut, motivo: 'versao-futura' }]);
  assert.deepEqual(validar(S, todas.dados, '#/$defs/pacoteFichas'), []);
  const novo = novoArmazem();
  const imp = novo.a.importar(JSON.stringify(todas.dados));
  assert.equal(imp.ok, true);
  assert.deepEqual(imp.erros.map((x) => [x.erro, x.id]), [['ilegivel-no-pacote', ruim], ['ilegivel-no-pacote', fut]]);
  // import "atualizar" por cima da futura é recusado (anti-downgrade)
  const porCima = JSON.stringify(Object.assign(E.novaFicha({ nome: 'Por cima' }), { id: fut }));
  assert.equal(a.importar(porCima, { conflito: 'atualizar', exportar: () => true }).erro, 'versao-futura');
  assert.equal(ls.getItem('khalkaria_ficha_v3:' + fut), futura);
  // com o export cru, sai
  const crus = [];
  assert.equal(a.excluir(ruim, { exportar: () => true, exportarCru: (x) => { crus.push(x); } }).ok, true);
  assert.deepEqual(crus, [{ nomeArquivo: 'ficha-' + ruim + '.cru.khalkaria.json', texto: '{corrompido' }]);
  assert.equal(ls.getItem('khalkaria_ficha_v3:' + ruim), null);
});

test('ajuste: lista fechada de chaves e tipos (como $defs/ajuste); dado nos campos que são dado', () => {
  const d = '2026-09-28T00:00:00.000Z';
  const f = E.novaFicha();
  assert.equal(E.ajustar(f, 'cd', { modo: 'fixa', valor: 1, motivo: 123 }), 'motivo-invalido');
  assert.equal(E.ajustar(f, 'cd', { modo: 'fixa', valor: 1, rev: 2 }), 'campo-desconhecido');
  assert.equal(E.validarAjuste('cd', { modo: 'fixa', valor: 1, desde: 5 }), 'desde-invalido');
  assert.equal(E.validarAjuste('cd', { modo: 'fixa', valor: 1, origem: 'outra' }), 'origem-invalida');
  assert.equal(E.validarAjuste('cd', { modo: 'fixa', valor: 1, calculadoEm: '3' }), 'calculado-invalido');
  assert.equal(E.validarAjuste('cd', { modo: 'fixa', valor: 1, temporario: { fim: 'fimTurno', x: 1 } }), 'temporario-invalido');
  assert.deepEqual(f.ajustes, {}, 'nada inválido foi gravado');
  assert.deepEqual(E.CAMINHOS_DADO, ['evasao.ativa', 'pericia.defender.total']);
  assert.equal(E.ajustar(f, 'pericia.defender.total', { modo: 'fixa', valor: '1d8', motivo: 'Mestre em Defender' }, { agora: () => d }), null);
  assert.equal(E.ajustar(f, 'evasao.ativa', { modo: 'fixa', valor: '13 + 1d8' }, { agora: () => d }), null);
  assert.equal(E.validarAjuste('evasao.ativa', { modo: 'soma', valor: 1 }), null, 'soma: bônus fixo sobre o dado');
  assert.equal(E.validarAjuste('evasao.ativa', { modo: 'fixa', valor: 14 }), 'valor-invalido', 'fixa sem dado perderia o dado');
  assert.equal(E.validarAjuste('evasao.ativa', { modo: 'soma', valor: '1d4' }), 'valor-invalido');
  assert.equal(E.validarAjuste('cd', { modo: 'fixa', valor: '1d8' }), 'valor-invalido');
  assert.deepEqual(validar(S, f), []);
  f.ajustes.cd = { modo: 'fixa', valor: 'abc', desde: d };
  assert.equal(validar(S, f).length, 1, 'o schema recusa texto que não é dado');
});

test('import 3.x: id fora do padrão é trocado; cópia sem vínculo v2; "atualizar" limpa log, rascunho e sessão velhos', () => {
  const g = E.novaFicha({ nome: 'Id ruim' });
  g.id = '../x';
  const m = E.migrar(JSON.parse(JSON.stringify(g)), op());
  assert.match(m.ficha.id, /^f[a-z0-9]{12}$/);
  const { ls, a } = novoArmazem();
  const id = a.importar(JSON.stringify(V2)).ids[0];
  a.gravarLog(id, { passos: [] });
  a.gravarSessao(id, { modo: 'mesa', turno: 2, log: [] });
  ls.setItem('khalkaria_nivel_rascunho:' + id, '{}');
  const arquivo = JSON.stringify(a.exportar(id).dados);   // traz estadoSessao
  const semSessao = JSON.parse(arquivo); delete semSessao.estadoSessao; semSessao.meta.nome = 'Lira 2';
  const c = a.importar(arquivo, { conflito: 'copia' });
  const copia = a.ler(c.ids[0]);
  assert.deepEqual([copia.vinculoV2, copia.exportadoEm], [null, '']);
  assert.equal(a.ler(id).vinculoV2.revV2, 17);
  const r = a.importar(JSON.stringify(semSessao), { conflito: 'atualizar', exportar: () => true });
  assert.equal(r.ok, true);
  assert.equal(a.ler(id).meta.nome, 'Lira 2');
  ['khalkaria_ficha_v3_log:', 'khalkaria_nivel_rascunho:', 'khalkaria_ficha_v3_sessao:']
    .forEach((p) => assert.equal(ls.getItem(p + id), null, p));
});

test('entradasDeCatalogo (produção): ramo pelo texto livre da v2 e corrupções do Corrompido', () => {
  const ent = E.entradasDeCatalogo(A.dadosCatalogo());
  const ramo = ent.find((e) => e.id === 'batedor-ramo-do-cartografo');
  assert.deepEqual([ramo.tipo, ramo.classe, ramo.apelidos], ['ramo', 'batedor', ['cartografo', 'Cartógrafo']]);
  const idx = E.indiceCatalogo(ent, 'prod');
  const f = E.migrar(V2, op({ catalogo: idx, calculado: CALC_LIRA })).ficha;
  assert.equal(f.identidade.ramo.id, 'batedor-ramo-do-cartografo');
  assert.equal(porNome(f, 'Sangue Morto (-1)').id, 'corrompido-sangue-morto');
  assert.equal(ent.filter((e) => e.tipo === 'classe').length, 7);
  assert.ok(ent.filter((e) => e.tipo === 'corrupcao').length > 0);
  assert.ok(ent.filter((e) => e.tipo === 'corrupcao').every((e) => e.raca === 'corrompido'));
});
