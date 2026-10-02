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
  // Ofício(X); Éter 0/0 da v2 (o padrão: o alerta de Oco pode ser da migração);
  // Ae(Ordinário) 1 (não existe, D67); cartas sem posição na mão (a v2 não a gravava)
  assert.deepEqual(f.migracao.pendencias.map((p) => p.campo),
    ['pericias.oficio', 'recursos.eter', 'resistencias.aeCategoria.ordinario', 'limiar.posicaoNaMao']);
  assert.equal(f.migracao.pendencias[0].grau, 1);
  assert.equal(f.migracao.pendencias[2].valor, 1);
  assert.equal(f.migracao.pendencias[3].cartas, f.entradas.filter((e) => e.tipo === 'carta').length);
  assert.ok(f.migracao.pendencias[3].cartas > 0);
  ['cortante', 'contundente', 'perfurante'].forEach((t) => assert.deepEqual(f.resistencias.tipos[t], { R: true, I: false, V: false, ae: 0 }, t));
  assert.equal(f.resistencias.aeCategoria.ordinario, 1);
  assert.deepEqual(f.resistencias.tipos.fogo, { R: false, I: true, V: false, ae: 0 });
  assert.deepEqual([f.vinculoV2.revV2, f.vinculoV2.salvoEmV2], [17, '2026-09-27T21:14:03.512Z']);
  // a memória do que a v3 não guarda sem perda: os números da v2, como estavam
  assert.deepEqual([f.vinculoV2.comPerda['atributos.des'], f.vinculoV2.comPerda['pericias.oficio'],
    f.vinculoV2.comPerda['derivadosManuais.evasao'], f.vinculoV2.comPerda['resistencias.ordinario']],
  [V2.atributos.des, V2.pericias.oficio, V2.derivadosManuais.evasao, V2.resistencias.ordinario]);
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

test('v2 com schema/fichas de pacote no topo (deepMerge do import antigo): entra a ficha, não as fichas velhas', () => {
  const velha = E.novaFicha({ nome: 'Velha do pacote' }, { aleatorio: A.semente(5) });
  const contaminada = Object.assign(JSON.parse(JSON.stringify(V2)), E.pacoteTodas([velha]).dados);
  assert.equal(contaminada.schemaVersion, '2.0');
  const lido = E.lerImport(contaminada, op({ calculado: calcTeste }));
  assert.deepEqual(lido.erros, []);
  assert.deepEqual(lido.fichas.map((x) => [x.de, x.ficha.meta.nome]), [['2.0', 'Lira Vento-Sul']]);
  // o mesmo com a v1 (schemaVersion '1.0') e sem lista válida
  const v1 = Object.assign(JSON.parse(JSON.stringify(V1)), { schema: 'fichas/1', fichas: [{ id: 'fx', nome: 'x' }] });
  assert.deepEqual(E.lerImport(v1, op()).fichas.map((x) => x.de), ['1.0']);
  // pacote de verdade (sem meta no topo) segue sendo pacote
  assert.deepEqual(E.lerImport(E.pacoteTodas([velha]).dados, op()).fichas.map((x) => x.ficha.meta.nome), ['Velha do pacote']);
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

// ---------------- escrita dupla e migração real (F4.2) ----------------
// Primitivas PURAS e NÃO LIGADAS (nada do navegador as chama até a F4.7):
// projetarV2, conflitoV2, gravarComProjecao, migrarReal, reimportarV2. A v2.1
// que lê a projeção é a REAL (o artefato js/ficha.js num vm, pagina-v2-apoio.js).
const { pagina } = require('./pagina-v2-apoio.js');
const CAT_MINI = ler('catalogo-mini.json');
const itemMini = (nome) => JSON.parse(JSON.stringify(CAT_MINI.find((x) => x.nome === nome)));
const LS2 = 'khalkaria_ficha', DONO = 'khalkaria_ficha_dono', INDICE = 'khalkaria_fichas_v3', FICHA = 'khalkaria_ficha_v3:';
const BACKUP = 'khalkaria_ficha_v1_backup';
const opDupla = (extra) => Object.assign({ agora: A.relogio('2026-10-02T12:00:00.000Z'), aleatorio: A.semente(23),
  catalogo: IDX, calculado: calcTeste }, extra || {});
const caminho = (o, c) => c.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
const so = (o, ...ks) => Object.fromEntries(ks.map((k) => [k, o[k]]));
const copia = (x) => JSON.parse(JSON.stringify(x));
const TIPOS_DANO_3 = ['cortante', 'contundente', 'perfurante'];

test('projetarV2: v2 -> v3 -> v2 devolve a mesma v2; o que tem perda sai em "perdas" com o valor da v2', () => {
  // sem catálogo a identidade fica com o texto da v2: a volta é a v2 byte a byte
  const f = E.migrar(V2, op({ catalogo: null })).ficha;
  const r = E.projetarV2(f, V2);
  assert.deepEqual(r.v2, V2);
  // com catálogo, só o nome da identidade muda (vai o do catálogo; o id fica na v3)
  const fc = E.migrar(V2, op()).ficha;
  const rc = E.projetarV2(fc, V2);
  assert.equal(rc.v2.meta.ramo, fc.identidade.ramo.nome);
  assert.deepEqual(Object.assign({}, rc.v2, { meta: Object.assign({}, rc.v2.meta, { ramo: V2.meta.ramo }) }), V2);
  const campos = rc.perdas.map((p) => p.campo);
  ['atributos.for', 'atributos.sab', 'pericias.atacar', 'pericias.oficio', 'oficioAttr', 'derivadosManuais.evasao',
    'derivadosManuais.armadura', 'recursos.saude.max', 'recursos.recursoClasse.max'].forEach((c) => assert.ok(campos.includes(c), c));
  // nunca inventa: cada perda carrega o valor que ficou, que é o da v2
  rc.perdas.forEach((p) => {
    assert.ok(p.motivo, p.campo);
    if ('v2' in p) assert.deepEqual(p.v2, caminho(V2, p.campo), p.campo);
  });
  assert.deepEqual(rc.perdas.find((p) => p.campo === 'pericias.oficio').v3,
    { 'oficio-engenharia': 0, 'oficio-ferraria': 0, 'oficio-alquimia': 0 });
});

test('projetarV2: a edição da v3 vai para a v2 no que não tem perda; com perda fica o da v2 (ou o padrão da v2)', () => {
  const f = E.migrar(V2, op({ calculado: CALC_LIRA })).ficha;
  f.meta.nome = 'Lira do Sul'; f.meta.xp = 400;
  f.recursos.saude.atual = 7; f.recursos.classe.atual = 4; f.recursos.saude.temporaria = 3;
  f.inventario.sins = 99; f.lore.historia = 'Nova história.';
  f.atributos.base.FOR = 18; f.pericias.atacar = 3; f.pericias['oficio-ferraria'] = 2;
  E.ajustar(f, 'cd', { modo: 'fixa', valor: 17 }, op());
  f.resistencias.tipos.fogo.I = false;
  f.resistencias.tipos.frio.R = true; f.resistencias.tipos.frio.ae = 2;
  f.resistencias.tipos.cortante.R = false;                 // os 3 do Ordinário deixam de estar iguais
  f.resistencias.tipos.veneno.V = true; f.resistencias.aeTodos = 1;
  const atento = porNome(f, 'Atento');
  f.entradas = f.entradas.filter((e) => e !== atento);
  f.entradas.push({ uid: 'umagianova1', tipo: 'magia', id: null, estado: E.estadoPadrao('magia'),
    cache: { nome: 'Dardo Arcano', resumo: 'Dardo.', versaoCatalogo: '' }, mods: [] });
  f.entradas.push({ uid: 'uracanova01', tipo: 'raca', id: 'raca-humano', estado: {},
    cache: { nome: 'Humano', resumo: '', versaoCatalogo: '' }, mods: [] });
  const { v2, perdas } = E.projetarV2(f, V2);
  assert.equal(v2.schemaVersion, '2.0');
  assert.deepEqual([v2.rev, v2.salvoEm], [V2.rev, V2.salvoEm], 'quem grava sobe o rev');
  assert.deepEqual([v2.meta.nome, v2.meta.xp, v2.recursos.saude.atual, v2.recursos.recursoClasse.atual, v2.inventario.sins, v2.lore.historia],
    ['Lira do Sul', 400, 7, 4, 99, 'Nova história.']);
  // com perda: o valor da v2
  assert.deepEqual(v2.atributos, V2.atributos);
  assert.deepEqual(v2.pericias, V2.pericias);
  assert.deepEqual(v2.derivadosManuais, V2.derivadosManuais);
  assert.deepEqual(v2.recursos.saude.max, V2.recursos.saude.max);
  assert.deepEqual(v2.resistencias.ordinario, V2.resistencias.ordinario);
  // sem perda: os 11 tipos de nome igual
  assert.deepEqual(v2.resistencias.fogo, { R: false, I: false, ae: 0 });
  assert.deepEqual(v2.resistencias.frio, { R: true, I: false, ae: 2 });
  // entradas: a removida sai, a magia nova vira card do grimório, a de raça não tem card
  assert.ok(!v2.tecnicas.some((t) => t.id === atento.migradoDe.id));
  assert.deepEqual(v2.grimorio.map((g) => g.id), ['magia-fagulha', 'magia-dardo-arcano']);
  assert.deepEqual(v2.grimorio[1], { id: 'magia-dardo-arcano', tipo: 'magia', nome: 'Dardo Arcano', descricao: 'Dardo.' });
  assert.ok(!['tecnicas', 'grimorio', 'cartasLimiar'].some((l) => v2[l].some((e) => e.nome === 'Humano')));
  const por = Object.fromEntries(perdas.map((p) => [p.campo, p]));
  assert.deepEqual(so(por['atributos.for'], 'v2', 'v3'), { v2: 10, v3: 18 });
  assert.deepEqual(so(por['pericias.atacar'], 'v2', 'v3'), { v2: 2, v3: 3 });
  assert.equal(por['derivadosManuais.cd'].v3.valor, 17);
  assert.equal(por['derivadosManuais.cd'].v2, 0);
  ['resistencias.ordinario', 'resistencias.veneno.V', 'resistencias.aeTodos', 'recursos.saude.temporaria',
    'entradas.uracanova01', 'tecnicas.' + atento.migradoDe.id].forEach((c) => assert.ok(por[c], c));
  assert.equal(por['resistencias.ordinario'].v3.cortante.R, false);
  // sem v2 atual: a memória da ficha (os números da v2 que ela absorveu), nunca o número da v3
  const sem = E.projetarV2(f, null).v2;
  assert.deepEqual(sem.atributos, V2.atributos);
  assert.deepEqual(sem.derivadosManuais, V2.derivadosManuais);
  assert.deepEqual([sem.recursos.saude.max, sem.pericias.atacar, sem.rev, sem.meta.nome], [V2.recursos.saude.max, V2.pericias.atacar, 0, 'Lira do Sul']);
  assert.ok(!('armas' in sem.inventario) && !('materiais' in sem.inventario));
  // ficha sem vínculo (criada na v3, cópia): o padrão da novaFicha da v2
  const solta = E.projetarV2(Object.assign(copia(f), { vinculoV2: null }), null).v2;
  assert.deepEqual(solta.atributos, { for: 10, des: 10, con: 10, int: 10, sab: 10 });
  assert.deepEqual(solta.derivadosManuais, { evasao: 0, cd: 0, movimento: 9, armadura: 0 });
  assert.deepEqual([solta.recursos.saude.max, solta.pericias.atacar, solta.oficioAttr], [0, 0, 'int']);
  assert.deepEqual(f.entradas.filter((e) => e.uid === 'umagianova1').length, 1, 'a ficha de entrada não muda');
});

test('projeção lida pela v2.1 REAL (js/ficha.js): abre editável, sem rev++, sem backup, sem reescrever', () => {
  const f = E.migrar(V2, op({ calculado: CALC_LIRA })).ficha;
  f.meta.nome = 'Lira (v3)'; f.inventario.sins = 41;
  const proj = E.projetarV2(f, V2).v2;
  const st = A.armazenamento({ [LS2]: JSON.stringify(proj), [DONO]: 'v3-dupla' });
  const antes = st.foto();
  const p = pagina(st, { catalogo: null });     // sem bazar.json: só o que a página faz sozinha
  assert.equal(p.KF.somenteLeitura(), false);
  assert.equal(p.faixas().length, 0);
  assert.equal(p.KF.nome(), 'Lira (v3)');
  assert.equal(p.KF.inventario().sins, 41);
  assert.deepEqual(copia(p.KF.inventario().equipamentos.map((x) => x.uid)), proj.inventario.equipamentos.map((x) => x.uid));
  assert.equal(p.KF.atributo('des'), V2.atributos.des);
  p.win('pageshow'); p.win('pagehide'); p.rodaTimers();
  assert.deepEqual(st.escritas, [], 'nada gravado: nem rev++ nem backup');
  assert.equal(st.foto(), antes);
  assert.equal(st.getItem(BACKUP), null);
});

test('conflitoV2: só quando khalkaria_ficha não é mais a última projeção', () => {
  const ind = { schema: 'fichas/1', ultimaAtiva: null, projecaoV2: { fichaId: 'fabc1234', revV2: 5, salvoEmV2: 'T5' }, fichas: [] };
  assert.equal(E.conflitoV2(ind, { rev: 5, salvoEm: 'T5' }), false);
  assert.equal(E.conflitoV2(ind, JSON.stringify({ rev: 5, salvoEm: 'T5' })), false, 'aceita o texto cru');
  assert.equal(E.conflitoV2(ind, { rev: 6, salvoEm: 'T6' }), true, 'uma aba v2.1 gravou por cima');
  assert.equal(E.conflitoV2(ind, { rev: 5, salvoEm: 'outro' }), true, 'trocada sem subir o rev');
  assert.equal(E.conflitoV2(ind, { rev: 2, salvoEm: 'T2' }), true, 'trocada por outra');
  assert.equal(E.conflitoV2(ind, '{lixo'), true);
  assert.equal(E.conflitoV2(ind, null), false, 'sem v2, nada a perder');
  assert.equal(E.conflitoV2(Object.assign({}, ind, { projecaoV2: null }), { rev: 9 }), false, 'sem projeção ainda');
});

test('gravarComProjecao: ficha, índice (projecaoV2), projeção (rev acima da v2) e por ÚLTIMO o marcador; nunca "v3"', () => {
  const st = A.armazenamento({ [LS2]: JSON.stringify(V2) });
  const o = opDupla();
  const m = E.migrarReal(st, o);
  assert.deepEqual(so(m, 'ok', 'criada'), { ok: true, criada: true });
  assert.deepEqual(st.escritas.map((e) => e[1]), [FICHA + m.id, INDICE, LS2, DONO], 'o marcador por último');
  const ind = st.json(INDICE);
  assert.deepEqual(validar(S, ind, '#/$defs/indiceFichas'), []);
  const v2 = st.json(LS2);
  assert.deepEqual(ind.projecaoV2, { fichaId: m.id, revV2: V2.rev + 1, salvoEmV2: v2.salvoEm });
  assert.equal(ind.ultimaAtiva, m.id);
  assert.deepEqual([v2.schemaVersion, v2.rev, m.revV2], ['2.0', V2.rev + 1, V2.rev + 1]);
  assert.ok(!('armas' in v2.inventario) && !('materiais' in v2.inventario));
  assert.equal(st.getItem(DONO), 'v3-dupla');
  const arm = E.armazem(st, null, o);
  const f = arm.ler(m.id);
  assert.deepEqual(validar(S, f), []);
  assert.deepEqual(so(f.vinculoV2, 'revV2', 'salvoEmV2'), { revV2: V2.rev, salvoEmV2: V2.salvoEm }, 'o vínculo é a v2 que ela absorveu');
  assert.deepEqual(v2.origemV3, { fichaId: m.id, revV2: V2.rev + 1 }, 'o carimbo da projeção');
  assert.ok(m.perdas.some((p) => p.campo === 'atributos.for'));
  // a segunda gravação: o marcador já está lá (não regrava) e o rev da v2 sobe de novo
  st.escritas.length = 0;
  f.meta.xp = 500;
  const g = E.gravarComProjecao(st, m.id, f, o);
  assert.equal(g.ok, true);
  assert.equal(f.rev, g.rev, 'como o gravar: o objeto ganha o rev novo');
  assert.deepEqual(st.escritas.map((e) => e[1]), [FICHA + m.id, INDICE, LS2]);
  assert.deepEqual([st.json(LS2).rev, st.json(LS2).meta.xp, st.json(INDICE).projecaoV2.revV2], [V2.rev + 2, 500, V2.rev + 2]);
  // com o marcador da F5 ('v3'), a escrita dupla não o rebaixa
  st.setItem(DONO, 'v3');
  st.escritas.length = 0;
  assert.equal(E.gravarComProjecao(st, m.id, f, o).ok, true);
  assert.ok(!st.escritas.some((e) => e[1] === DONO));
  assert.equal(st.getItem(DONO), 'v3');
  // id que não bate com a ficha
  assert.deepEqual(E.gravarComProjecao(st, 'foutra123', f, o), { ok: false, erro: 'invalida' });
  // há v2 sem projeção e a ficha não veio dela: recusa (migrar antes), nada gravado
  const st2 = A.armazenamento({ [LS2]: JSON.stringify(V2) });
  const nova = E.novaFicha({ nome: 'Nova' }, o);
  const r2 = E.gravarComProjecao(st2, nova.id, nova, o);
  assert.deepEqual(so(r2, 'ok', 'erro'), { ok: false, erro: 'v2-nao-migrada' });
  assert.deepEqual(st2.escritas, []);
  assert.equal(nova.rev, 0);
  // sem v2 nenhuma, a primeira ficha liga a escrita dupla direto
  const st3 = A.armazenamento();
  const n3 = E.novaFicha({ nome: 'Primeira' }, o);
  assert.equal(E.gravarComProjecao(st3, n3.id, n3, o).ok, true);
  assert.deepEqual([st3.json(LS2).meta.nome, st3.json(LS2).rev, st3.getItem(DONO)], ['Primeira', 1, 'v3-dupla']);
});

test('aba v2.1 aberta editando durante a escrita dupla: conflito, nada é sobrescrito (nem por outra ficha)', () => {
  const st = A.armazenamento();
  const aba = pagina(st);
  aba.KF.adicionar(itemMini('Kali'), { qtd: 2 });
  const o = opDupla();
  const m = E.migrarReal(st, o);
  assert.equal(m.ok, true);
  const arm = E.armazem(st, null, o);
  const outra = arm.criar({ nome: 'Outra' }).id;
  // a aba adota a projeção (rev maior) e, com 'v3-dupla', continua editável
  aba.win('storage', { key: LS2 });
  assert.equal(aba.KF.somenteLeitura(), false);
  assert.ok(aba.KF.adicionar(itemMini('Kali')));
  assert.equal(aba.KF.inventario().bugigangas[0].qtd, 3);
  assert.ok(st.json(LS2).rev > st.json(INDICE).projecaoV2.revV2);
  assert.equal(E.conflitoV2(st.json(INDICE), st.getItem(LS2)), true);
  // a v3 tenta gravar a ficha projetada, e depois outra ficha: nada muda
  const foto = st.foto();
  st.escritas.length = 0;
  const f = arm.ler(m.id), revAntes = f.rev;
  f.lore.historia = 'Escrito na v3';
  const r = E.gravarComProjecao(st, m.id, f, o);
  assert.deepEqual(so(r, 'ok', 'erro', 'fichaId'), { ok: false, erro: 'conflito-v2', fichaId: m.id });
  assert.equal(f.rev, revAntes);
  const g = arm.ler(outra);
  g.lore.historia = 'Outra';
  assert.equal(E.gravarComProjecao(st, outra, g, o).erro, 'conflito-v2');
  assert.deepEqual(st.escritas, []);
  assert.equal(st.foto(), foto);
  assert.equal(JSON.parse(st.getItem(LS2)).inventario.bugigangas[0].qtd, 3, 'a edição da aba fica');
  // o migrarReal também não cria outra ficha: aponta o conflito para a ficha certa
  const m2 = E.migrarReal(st, o);
  assert.deepEqual(so(m2, 'ok', 'erro', 'fichaId'), { ok: false, erro: 'conflito-v2', fichaId: m.id });
  assert.equal(arm.listar().length, 2);
  assert.equal(st.foto(), foto);
});

test('migrarReal é idempotente: duas vezes dão UMA ficha; a segunda não grava nada', () => {
  const st = A.armazenamento({ [LS2]: JSON.stringify(V2) });
  const o = opDupla();
  const r1 = E.migrarReal(st, o);
  assert.deepEqual(so(r1, 'ok', 'criada'), { ok: true, criada: true });
  assert.ok(r1.pendencias.some((p) => p.campo === 'pericias.oficio'), 'as pendências da migração voltam para a UI');
  const foto = st.foto();
  st.escritas.length = 0;
  const r2 = E.migrarReal(st, o);
  assert.deepEqual(so(r2, 'ok', 'id', 'criada'), { ok: true, id: r1.id, criada: false });
  assert.deepEqual(st.escritas, []);
  assert.equal(st.foto(), foto);
  assert.equal(E.armazem(st, null, o).listar().length, 1);
  // a ficha que entrou pelo import da F3 (vinculoV2 = esta v2) não é duplicada: só liga a escrita dupla
  const st3 = A.armazenamento({ [LS2]: JSON.stringify(V2) });
  const a3 = E.armazem(st3, null, o);
  const imp = a3.importar(st3.getItem(LS2));
  assert.equal(imp.ok, true);
  const r3 = E.migrarReal(st3, o);
  assert.deepEqual(so(r3, 'ok', 'id', 'criada'), { ok: true, id: imp.ids[0], criada: false });
  assert.deepEqual([a3.listar().length, st3.json(INDICE).projecaoV2.fichaId, st3.getItem(DONO)], [1, imp.ids[0], 'v3-dupla']);
  const r4 = E.migrarReal(st3, o);
  assert.deepEqual(so(r4, 'id', 'criada'), { id: imp.ids[0], criada: false });
  assert.equal(a3.listar().length, 1);
  // sem v2: nada a migrar, nada gravado
  const vazio = A.armazenamento();
  assert.deepEqual(so(E.migrarReal(vazio, o), 'ok', 'id', 'criada', 'motivo'), { ok: true, id: null, criada: false, motivo: 'sem-v2' });
  assert.deepEqual(vazio.escritas, []);
  // sem o calculado a poda dos ajustes fica pendente: recusa sem gravar
  const st5 = A.armazenamento({ [LS2]: JSON.stringify(V2) });
  assert.equal(E.migrarReal(st5, { agora: A.relogio(), aleatorio: A.semente(3) }).erro, 'poda-pendente');
  assert.deepEqual(st5.escritas, []);
});

test('quota ou falha no meio de gravarComProjecao: o estado anterior fica intacto', () => {
  const ehFicha = (k) => k.indexOf(FICHA) === 0;
  const passos = [['ficha', ehFicha], ['índice', (k) => k === INDICE], ['v2', (k) => k === LS2], ['marcador', (k) => k === DONO]];
  passos.forEach(([rotulo, casa]) => {
    [['quota', () => new A.Quota()], ['storage', () => new Error('disco')]].forEach(([erro, faz]) => {
      const st = A.armazenamento({ [LS2]: JSON.stringify(V2) });
      const foto = st.foto();
      st.falha = (k) => (casa(k) ? faz() : null);
      const r = E.migrarReal(st, opDupla());
      assert.deepEqual(so(r, 'ok', 'erro'), { ok: false, erro: erro }, rotulo + '/' + erro);
      assert.equal(st.foto(), foto, rotulo + '/' + erro + ': nada fica pela metade');
    });
  });
  // numa gravação seguinte: a v2 falha, a ficha e o índice voltam; o objeto da ficha não muda
  const st = A.armazenamento({ [LS2]: JSON.stringify(V2) });
  const o = opDupla();
  const id = E.migrarReal(st, o).id;
  const arm = E.armazem(st, null, o);
  const f = arm.ler(id), revAntes = f.rev;
  f.lore.historia = 'nova';
  const foto = st.foto();
  st.falha = (k) => (k === LS2 ? new A.Quota() : null);
  assert.equal(E.gravarComProjecao(st, id, f, o).erro, 'quota');
  assert.equal(st.foto(), foto);
  assert.equal(f.rev, revAntes);
  // quota de verdade: a limpeza tira o log de desfazer para a ficha caber, a v2
  // falha depois, e o log volta junto com o resto
  st.falha = null;
  arm.gravarLog(id, { passos: [], lixo: 'x'.repeat(3000) });
  const foto2 = st.foto();
  st.limite = [...st.m.entries()].reduce((s, [k, v]) => s + k.length + v.length, 0) + 2200;
  st.falha = (k) => (k === LS2 ? new A.Quota() : null);
  const g = arm.ler(id);
  g.lore.historia = 'y'.repeat(2500);
  st.escritas.length = 0;
  const r = E.gravarComProjecao(st, id, g, o);
  assert.deepEqual(so(r, 'ok', 'erro', 'limpou'), { ok: false, erro: 'quota', limpou: [] });
  assert.ok(st.escritas.some((e) => e[0] === 'remove' && e[1] === 'khalkaria_ficha_v3_log:' + id), 'a limpeza rodou');
  assert.equal(st.foto(), foto2, 'ficha, índice, v2, marcador e log como antes');
  // e, sem a falha, a mesma gravação cabe limpando o log
  st.falha = null;
  const ok = E.gravarComProjecao(st, id, g, o);
  assert.deepEqual(so(ok, 'ok', 'limpou'), { ok: true, limpou: ['khalkaria_ficha_v3_log:' + id] });
});

test('reimportarV2: merge por campo; o que só existe na v3 fica (uid, estado, porNivel, ajustes, Vhelor, 14 tipos)', () => {
  const st = A.armazenamento({ [LS2]: JSON.stringify(V2) });
  const o = opDupla();
  const id = E.migrarReal(st, o).id;
  const arm = E.armazem(st, null, o);
  const f = arm.ler(id);
  f.vhelor.marcas = 3;
  f.atributos.porNivel = { 2: { FOR: 1, DES: 1 } };
  E.ajustar(f, 'evasao.passiva', { modo: 'soma', valor: 1, motivo: 'Capa' }, o);
  f.resistencias.tipos.perfurante.R = false;                // Ordinário passa a ter perda
  f.resistencias.tipos.fogo.V = true;
  const mag = f.entradas.find((e) => e.tipo === 'magia');
  mag.estado = { intensidade: 'forcada', sustentando: true };
  assert.equal(E.gravarComProjecao(st, id, f, o).ok, true);
  const projetada = arm.ler(id);
  // a aba v2.1 (revertida) mexe em campos com e sem perda
  const v2 = st.json(LS2);
  v2.rev += 1; v2.salvoEm = '2026-10-02T13:00:00.000Z';
  v2.meta.nome = 'Lira Revertida'; v2.recursos.saude.atual = 5; v2.inventario.sins = 50;
  v2.resistencias.fogo.R = true;                            // sem perda: entra
  v2.resistencias.ordinario.I = true;                       // com perda: não entra
  v2.atributos.for = 17; v2.derivadosManuais.cd = 20; v2.pericias.atacar = 6;   // com perda: não entram
  const atento = porNome(projetada, 'Atento');
  v2.tecnicas = v2.tecnicas.filter((t) => t.id !== atento.migradoDe.id);
  v2.cartasLimiar.push({ id: 'carta-pernas-incansaveis', tipo: 'carta', nome: 'Pernas Incansáveis', descricao: 'Nova.' });
  st.setItem(LS2, JSON.stringify(v2));
  const r = E.reimportarV2(projetada, v2, o);
  const nova = r.ficha.entradas.find((e) => e.id === 'limiar-pernas-incansaveis');
  assert.ok(nova, 'a carta nova entrou pelo catálogo');
  assert.deepEqual(r.mudou.slice().sort(), ['entradas.' + atento.uid, 'entradas.' + nova.uid, 'inventario.sins',
    'meta.nome', 'recursos.saude.atual', 'resistencias.fogo.R'].sort());
  const x = r.ficha;
  assert.deepEqual([x.meta.nome, x.recursos.saude.atual, x.inventario.sins, x.resistencias.tipos.fogo.R], ['Lira Revertida', 5, 50, true]);
  // o que só existe na v3 (ou tem perda) ficou
  assert.deepEqual([x.id, x.criadoEm, x.rev], [projetada.id, projetada.criadoEm, projetada.rev]);
  assert.deepEqual(x.migracao, projetada.migracao, 'não passou pelo migrarV2paraV3');
  assert.equal(x.vhelor.marcas, 3);
  assert.deepEqual(x.atributos, projetada.atributos);
  assert.deepEqual(x.pericias, projetada.pericias);
  assert.deepEqual(x.ajustes, projetada.ajustes);
  TIPOS_DANO_3.forEach((t) => assert.deepEqual(x.resistencias.tipos[t], projetada.resistencias.tipos[t], t));
  assert.deepEqual(x.resistencias.aeCategoria, projetada.resistencias.aeCategoria);
  assert.equal(x.resistencias.tipos.fogo.V, true);
  assert.deepEqual(x.entradas.find((e) => e.uid === mag.uid).estado, { intensidade: 'forcada', sustentando: true });
  assert.deepEqual(x.entradas.filter((e) => e !== nova).map((e) => e.uid),
    projetada.entradas.filter((e) => e.uid !== atento.uid).map((e) => e.uid), 'uids e ordem das que ficaram');
  assert.deepEqual([nova.tipo, nova.estado.posicaoNaMao, nova.migradoDe.efeitoNoTotal], ['carta', null, false]);
  assert.deepEqual(so(x.vinculoV2, 'revV2', 'salvoEmV2'), { revV2: v2.rev, salvoEmV2: v2.salvoEm });
  // o que tem perda e a v2 mudou não entra, mas sai em 'perdas' com o antes e o depois
  assert.equal(r.ancestral, 'projecao');
  assert.deepEqual(r.conflitos, []);
  assert.deepEqual(r.perdas.map((p) => [p.campo, p.antes, p.v2]).sort(), [
    ['atributos.for', V2.atributos.for, 17], ['derivadosManuais.cd', V2.derivadosManuais.cd, 20],
    ['pericias.atacar', V2.pericias.atacar, 6],
    ['resistencias.ordinario', V2.resistencias.ordinario, Object.assign({}, V2.resistencias.ordinario, { I: true })]].sort());
  r.perdas.forEach((p) => assert.ok(p.motivo && !p.semReferencia, p.campo));
  assert.equal(r.perdas.find((p) => p.campo === 'atributos.for').v3, projetada.atributos.base.FOR);
  assert.deepEqual([x.vinculoV2.comPerda['atributos.for'], x.vinculoV2.comPerda['derivadosManuais.cd']], [17, 20], 'a memória passa a ser a da v2 reimportada');
  assert.deepEqual(validar(S, x), []);
  assert.deepEqual(arm.ler(id), projetada, 'a entrada não é mexida');
  // gravar depois resolve o conflito; a perda mantém o que a v2 tinha (FOR 17 digitado lá)
  assert.equal(E.conflitoV2(st.json(INDICE), st.getItem(LS2)), true);
  assert.equal(E.gravarComProjecao(st, id, x, o).ok, true);
  assert.equal(E.conflitoV2(st.json(INDICE), st.getItem(LS2)), false);
  assert.deepEqual([st.json(LS2).atributos.for, st.json(LS2).derivadosManuais.cd, st.json(LS2).resistencias.ordinario.I], [17, 20, true]);
  // reimportar a projeção que acabou de ser gravada não muda nada (nem avisa perda)
  const de_novo = E.reimportarV2(arm.ler(id), st.getItem(LS2), Object.assign({}, o, { projecao: st.json(INDICE).projecaoV2 }));
  assert.deepEqual([de_novo.mudou, de_novo.perdas, de_novo.conflitos, de_novo.ancestral], [[], [], [], 'projecao']);
});

test('reimportarV2 com a base (3 vias): a edição feita só na v3 não é desfeita pela v2', () => {
  const st = A.armazenamento({ [LS2]: JSON.stringify(V2) });
  const o = opDupla();
  const id = E.migrarReal(st, o).id;
  const projetada = E.armazem(st, null, o).ler(id);
  const v2 = st.json(LS2);
  v2.rev += 1; v2.lore.historia = 'Da v2';
  const naV3 = copia(projetada);
  naV3.meta.nome = 'Só na v3';
  const duas = E.reimportarV2(naV3, v2, o);
  assert.equal(duas.ficha.meta.nome, V2.meta.nome, 'sem base, a v2 vence no que difere');
  const tres = E.reimportarV2(naV3, v2, Object.assign({}, o, { base: projetada }));
  assert.deepEqual(tres.mudou, ['lore.historia']);
  assert.deepEqual([tres.ficha.meta.nome, tres.ficha.lore.historia], ['Só na v3', 'Da v2']);
});

test('reverter a F4: edição na v3 -> a v2.1 abre editável com ela; voltar à F4 reimporta na ficha certa', () => {
  const st = A.armazenamento();
  const aba = pagina(st);                                    // a v2.1 de antes da F4
  aba.KF.adicionar(itemMini('Kali'), { qtd: 2 });
  aba.KF.adicionar(itemMini('Adaga de Kali'));
  const o = opDupla();
  const m = E.migrarReal(st, o);
  assert.equal(m.ok, true);
  const arm = E.armazem(st, null, o);
  const outra = arm.criar({ nome: 'Outra' }).id;
  // editar na v3 (com o que só existe nela)
  const f = arm.ler(m.id);
  f.inventario.sins = 12; f.lore.historia = 'Editado na v3'; f.vhelor.marcas = 2;
  E.ajustar(f, 'cd', { modo: 'fixa', valor: 14 }, o);
  assert.equal(E.gravarComProjecao(st, m.id, f, o).ok, true);
  const v3antes = [st.getItem(INDICE), st.getItem(FICHA + m.id), st.getItem(FICHA + outra)];
  st.escritas.length = 0;
  // reverte para o bundle da F3 (este js/ficha.js): a ficha projetada abre editável, com a edição
  const rev = pagina(st);
  assert.equal(rev.KF.somenteLeitura(), false);
  assert.deepEqual([rev.KF.inventario().sins, rev.KF.inventario().bugigangas[0].qtd], [12, 2]);
  assert.deepEqual(st.escritas, [], 'abrir não grava: sem rev++, sem backup');
  assert.equal(st.getItem(BACKUP), null);
  assert.ok(rev.KF.adicionar(itemMini('Kali')), 'editável');
  assert.deepEqual([...new Set(st.escritas.map((e) => e[1]))], [LS2], 'só a chave v2');
  assert.deepEqual([st.getItem(INDICE), st.getItem(FICHA + m.id), st.getItem(FICHA + outra)], v3antes, 'as chaves v3 intactas');
  // sobe a F4 de novo: a v2 andou -> reimportar na ficha de projecaoV2.fichaId
  const ind = st.json(INDICE);
  assert.equal(E.conflitoV2(ind, st.getItem(LS2)), true);
  assert.equal(ind.projecaoV2.fichaId, m.id);
  // a v2.1 gravou por cima e o carimbo da projeção que ela adotou ficou (o deepMerge dela o preserva)
  assert.deepEqual(st.json(LS2).origemV3, { fichaId: m.id, revV2: ind.projecaoV2.revV2 });
  const r = E.reimportarV2(arm.ler(ind.projecaoV2.fichaId), st.getItem(LS2), Object.assign({}, o, { projecao: ind.projecaoV2 }));
  assert.equal(r.ancestral, 'projecao');
  assert.deepEqual([r.mudou, r.conflitos, r.perdas], [['inventario.bugigangas'], [], []]);
  assert.deepEqual([r.ficha.vhelor.marcas, r.ficha.ajustes.cd.valor, r.ficha.lore.historia], [2, 14, 'Editado na v3']);
  assert.equal(r.ficha.inventario.bugigangas[0].qtd, 3);
  assert.equal(E.gravarComProjecao(st, m.id, r.ficha, o).ok, true);
  assert.equal(E.conflitoV2(st.json(INDICE), st.getItem(LS2)), false);
  // a aba revertida adota a projeção nova (rev maior) pelo evento storage
  rev.win('storage', { key: LS2 });
  assert.equal(rev.KF.inventario().bugigangas[0].qtd, 3);
  assert.equal(arm.ler(outra).meta.nome, 'Outra');
});

// ---------------- correções da revisão da F4.2 ----------------
test('reimportarV2: o que a v2.1 mudou COM perda (atributo, perícia, máximo, derivado, Ofício) sai em "perdas", não some calado', () => {
  const st = A.armazenamento({ [LS2]: JSON.stringify(V2) });
  const o = opDupla();
  const id = E.migrarReal(st, o).id;
  const arm = E.armazem(st, null, o);
  // F4 revertida: o jogador sobe de nível na v2.1
  const v2 = st.json(LS2);
  v2.rev += 1; v2.salvoEm = '2026-10-02T14:00:00.000Z';
  v2.meta.nivel = 3; v2.atributos.des = 18; v2.pericias.percepcao = 6;
  v2.recursos.saude.max = 30; v2.derivadosManuais.evasao = 14; v2.oficioAttr = 'sab';
  st.setItem(LS2, JSON.stringify(v2));
  const proj = st.json(INDICE).projecaoV2;
  const antes = arm.ler(id);
  const r = E.reimportarV2(antes, st.getItem(LS2), Object.assign({}, o, { projecao: proj }));
  assert.deepEqual([r.ancestral, r.mudou, r.conflitos], ['projecao', ['meta.nivel'], []]);
  assert.deepEqual(r.perdas.map((p) => [p.campo, p.antes, p.v2]), [
    ['atributos.des', V2.atributos.des, 18], ['pericias.percepcao', V2.pericias.percepcao, 6], ['oficioAttr', V2.oficioAttr, 'sab'],
    ['derivadosManuais.evasao', V2.derivadosManuais.evasao, 14], ['recursos.saude.max', V2.recursos.saude.max, 30]]);
  r.perdas.forEach((p) => assert.ok(p.motivo, p.campo));
  assert.deepEqual(so(r.perdas[0], 'v3'), { v3: antes.atributos.base.DES });
  // nada disso é inventado na v3 (a UI mostra as perdas para o jogador corrigir)
  assert.deepEqual([r.ficha.atributos, r.ficha.pericias, r.ficha.ajustes], [antes.atributos, antes.pericias, antes.ajustes]);
  // gravar: a v2 segue com os números que o jogador digitou nela, e o próximo reimportar não avisa de novo
  assert.equal(E.gravarComProjecao(st, id, r.ficha, o).ok, true);
  const depois = st.json(LS2);
  assert.deepEqual([depois.meta.nivel, depois.atributos.des, depois.pericias.percepcao, depois.recursos.saude.max,
    depois.derivadosManuais.evasao, depois.oficioAttr], [3, 18, 6, 30, 14, 'sab']);
  const de_novo = E.reimportarV2(arm.ler(id), depois, Object.assign({}, o, { projecao: st.json(INDICE).projecaoV2 }));
  assert.deepEqual([de_novo.mudou, de_novo.perdas], [[], []]);
  // vínculo antigo, sem a memória: compara com o padrão da v2 e marca semReferencia
  const semMemoria = copia(antes);
  delete semMemoria.vinculoV2.comPerda;
  const rs = E.reimportarV2(semMemoria, v2, Object.assign({}, o, { projecao: proj }));
  assert.ok(rs.perdas.length && rs.perdas.every((p) => p.semReferencia));
  assert.deepEqual(so(rs.perdas.find((p) => p.campo === 'atributos.des'), 'antes', 'v2'), { antes: 10, v2: 18 });
});

test('vínculo vazio (v1) não identifica a v2: outra ficha v1 não toma a khalkaria_ficha, e a v1 de lá é migrada', () => {
  const st = A.armazenamento({ [LS2]: JSON.stringify(V1) });
  const o = opDupla();
  const arm = E.armazem(st, null, o);
  // a ficha C veio de OUTRO arquivo v1 (import da F3): vínculo {0, ''}, como toda v1
  const imp = arm.importar(JSON.stringify(Object.assign(copia(V1), { meta: Object.assign({}, V1.meta, { nome: 'Personagem C' }) })));
  assert.equal(imp.ok, true);
  const C = arm.ler(imp.ids[0]);
  assert.deepEqual([C.vinculoV2.revV2, C.vinculoV2.salvoEmV2], [0, '']);
  const foto = st.foto();
  st.escritas.length = 0;
  assert.deepEqual(so(E.gravarComProjecao(st, C.id, C, o), 'ok', 'erro'), { ok: false, erro: 'v2-nao-migrada' });
  assert.deepEqual(st.escritas, []);
  assert.equal(st.foto(), foto);
  // o migrarReal não toma a C pela ficha desta v1: cria a do Borin (e guarda a v1 crua)
  const m = E.migrarReal(st, o);
  assert.deepEqual(so(m, 'ok', 'criada'), { ok: true, criada: true });
  assert.notEqual(m.id, C.id);
  assert.equal(arm.listar().length, 2);
  assert.deepEqual([st.json(LS2).meta.nome, st.json(INDICE).projecaoV2.fichaId], [V1.meta.nome, m.id]);
  assert.equal(st.getItem(BACKUP), JSON.stringify(V1));
  assert.equal(arm.ler(C.id).meta.nome, 'Personagem C');
});

test('migrarReal de uma v1 (ou 2.0 com as listas velhas): o texto cru vai para o khalkaria_ficha_v1_backup, como na v2.1', () => {
  const st = A.armazenamento({ [LS2]: JSON.stringify(V1) });
  const r = E.migrarReal(st, opDupla());
  assert.deepEqual(so(r, 'ok', 'criada'), { ok: true, criada: true });
  assert.deepEqual(st.escritas.map((e) => e[1]), [FICHA + r.id, INDICE, BACKUP, LS2, DONO], 'o backup antes de reescrever');
  assert.equal(st.getItem(BACKUP), JSON.stringify(V1));
  assert.deepEqual([st.json(LS2).schemaVersion, 'materiais' in st.json(LS2).inventario], ['2.0', false]);
  // o backup que já existe nunca é sobrescrito (guardaBackup)
  const st2 = A.armazenamento({ [LS2]: JSON.stringify(V1), [BACKUP]: 'backup antigo' });
  assert.equal(E.migrarReal(st2, opDupla()).ok, true);
  assert.equal(st2.getItem(BACKUP), 'backup antigo');
  // 2.0 com armas/materiais (um ficha.js antigo em cache recriou as listas)
  const velhas = copia(V2);
  velhas.inventario.armas = [{ nome: 'Adaga velha', qtd: 1 }]; velhas.inventario.materiais = [];
  const st3 = A.armazenamento({ [LS2]: JSON.stringify(velhas) });
  assert.equal(E.migrarReal(st3, opDupla()).ok, true);
  assert.equal(st3.getItem(BACKUP), JSON.stringify(velhas));
  // quota: a limpeza não tira o backup que a própria transação gravou; recusa e desfaz tudo
  const tam = (s) => [...s.m.entries()].reduce((t, [k, v]) => t + k.length + v.length, 0);
  const st4 = A.armazenamento({ [LS2]: JSON.stringify(V1) }, tam(st) - 1);
  const foto4 = st4.foto();
  assert.deepEqual(so(E.migrarReal(st4, opDupla()), 'ok', 'erro'), { ok: false, erro: 'quota' });
  assert.equal(st4.foto(), foto4, 'a v1 crua continua na khalkaria_ficha');
});

test('migrarReal em duas abas ao mesmo tempo: a que termina depois acha a ficha da outra e não cria outra', () => {
  const st = A.armazenamento({ [LS2]: JSON.stringify(V2) });
  const o = opDupla();
  const calc = o.calculado;
  let outraAba = null;
  // a outra aba (restauração de sessão) migra enquanto esta ainda calcula a poda
  o.calculado = (f) => {
    if (!outraAba) outraAba = E.migrarReal(st, Object.assign({}, o, { calculado: calc }));
    return calc(f);
  };
  const r = E.migrarReal(st, o);
  assert.deepEqual(so(outraAba, 'ok', 'criada'), { ok: true, criada: true });
  assert.deepEqual(so(r, 'ok', 'id', 'criada'), { ok: true, id: outraAba.id, criada: false });
  const arm = E.armazem(st, null, o);
  assert.equal(arm.listar().length, 1, 'uma Lira só');
  assert.equal(st.json(INDICE).projecaoV2.fichaId, outraAba.id);
  assert.equal(E.conflitoV2(st.json(INDICE), st.getItem(LS2)), false);
});

test('segunda ficha gravada com a projeção: o que tem perda é DELA (memória ou padrão), nunca o do personagem que estava lá', () => {
  const st = A.armazenamento({ [LS2]: JSON.stringify(V2) });
  const o = opDupla();
  const lira = E.migrarReal(st, o).id;
  const arm = E.armazem(st, null, o);
  const bruna = arm.criar({ nome: 'Bruna' }).id;
  const fb = arm.ler(bruna);
  fb.atributos.base.FOR = 18;
  const g = E.gravarComProjecao(st, bruna, fb, o);
  assert.equal(g.ok, true);
  const v2 = st.json(LS2);
  assert.deepEqual([v2.meta.nome, v2.meta.classe], ['Bruna', '']);
  assert.deepEqual(v2.atributos, { for: 10, des: 10, con: 10, int: 10, sab: 10 });
  assert.deepEqual([v2.recursos.saude.max, v2.pericias.atacar, v2.pericias.percepcao, v2.oficioAttr], [0, 0, 0, 'int']);
  assert.deepEqual(v2.derivadosManuais, { evasao: 0, cd: 0, movimento: 9, armadura: 0 });
  assert.deepEqual([v2.tecnicas, v2.grimorio, v2.cartasLimiar], [[], [], []], 'nem os cards da Lira');
  assert.deepEqual(v2.origemV3, { fichaId: bruna, revV2: v2.rev });
  // 'perdas' diz o valor que ficou para ESTA ficha, e não "remove" da Bruna os cards da Lira
  const por = Object.fromEntries(g.perdas.map((p) => [p.campo, p]));
  assert.deepEqual(so(por['atributos.for'], 'v2', 'v3'), { v2: 10, v3: 18 });
  assert.equal(por['recursos.saude.max'].v2, 0);
  assert.ok(!Object.keys(por).some((k) => /^(tecnicas|grimorio|cartasLimiar)\./.test(k)));
  // reverter: a v2.1 abre a Bruna com os números dela
  const p = pagina(st, { catalogo: null });
  assert.deepEqual([p.KF.nome(), p.KF.atributo('des'), p.KF.atributo('for')], ['Bruna', 10, 10]);
  // voltar à Lira devolve os números dela (a memória do vínculo), não os da Bruna
  assert.equal(E.gravarComProjecao(st, lira, arm.ler(lira), o).ok, true);
  const v2l = st.json(LS2);
  assert.deepEqual([v2l.meta.nome, v2l.atributos, v2l.pericias, v2l.oficioAttr], [V2.meta.nome, V2.atributos, V2.pericias, V2.oficioAttr]);
  assert.deepEqual([v2l.recursos.saude.max, v2l.derivadosManuais], [V2.recursos.saude.max, V2.derivadosManuais]);
});

test('reimportarV2 3 vias: o que as duas mudaram, diferente, é conflito (fica o da v3); o que só a v2 mudou entra', () => {
  const st = A.armazenamento({ [LS2]: JSON.stringify(V2) });
  const o = opDupla();
  const id = E.migrarReal(st, o).id;
  const projetada = E.armazem(st, null, o).ler(id);
  const v2 = st.json(LS2);
  v2.rev += 1; v2.salvoEm = '2026-10-02T15:00:00.000Z';
  v2.lore.historia = 'Da v2'; v2.inventario.sins = 1; v2.meta.xp = 999; v2.lore.outros = 'Igual nas duas';
  // na v3, não gravada por causa do conflito
  const naV3 = copia(projetada);
  naV3.lore.historia = 'Escrito na v3'; naV3.inventario.sins = 500; naV3.lore.outros = 'Igual nas duas';
  const r = E.reimportarV2(naV3, v2, Object.assign({}, o, { base: projetada, projecao: st.json(INDICE).projecaoV2 }));
  assert.equal(r.ancestral, 'projecao');
  assert.deepEqual([r.ficha.lore.historia, r.ficha.inventario.sins, r.ficha.lore.outros], ['Escrito na v3', 500, 'Igual nas duas']);
  assert.deepEqual([r.mudou, r.ficha.meta.xp], [['meta.xp'], 999]);
  assert.deepEqual(r.conflitos, [
    { campo: 'inventario.sins', v2: 1, v3: 500, base: V2.inventario.sins },
    { campo: 'lore.historia', v2: 'Da v2', v3: 'Escrito na v3', base: V2.lore.historia }]);
});

test('aba v2.1 que gravou sem adotar a última projeção (carimbo velho): nada entra sozinho, a edição da v3 não é desfeita', () => {
  const st = A.armazenamento({ [LS2]: JSON.stringify(V2) });
  const o = opDupla();
  const id = E.migrarReal(st, o).id;
  const arm = E.armazem(st, null, o);
  const aba = pagina(st, { catalogo: null });          // a v2.1 abre a primeira projeção
  // a v3 grava de novo e a aba não recebe o evento storage
  const f = arm.ler(id);
  f.lore.historia = 'Escrito na v3';
  assert.equal(E.gravarComProjecao(st, id, f, o).ok, true);
  const proj = st.json(INDICE).projecaoV2;
  // a aba digita e o debounce grava por cima, com o que ela tinha na memória
  const campo = aba.dom.criados.find((e) => e.tagName === 'INPUT' && e.getAttribute('type') === 'text');
  campo.value = 'Digitado na aba velha';
  campo.dispatchEvent({ type: 'input', target: campo });
  aba.rodaTimers();
  const v2 = st.json(LS2);
  assert.equal(v2.rev, proj.revV2, 'o mesmo rev da projeção: a aba não a adotou');
  assert.deepEqual([v2.lore.historia, v2.meta.nome], [V2.lore.historia, 'Digitado na aba velha']);
  assert.deepEqual(v2.origemV3, { fichaId: id, revV2: proj.revV2 - 1 }, 'o carimbo da projeção que a aba leu');
  assert.equal(E.conflitoV2(st.json(INDICE), v2), true);
  const atual = arm.ler(id);
  const r = E.reimportarV2(atual, v2, Object.assign({}, o, { base: atual, projecao: proj }));
  assert.deepEqual([r.ancestral, r.mudou], ['antiga', []]);
  assert.deepEqual([r.ficha.lore.historia, r.ficha.meta.nome], ['Escrito na v3', atual.meta.nome]);
  assert.deepEqual(r.conflitos, [
    { campo: 'meta.nome', v2: 'Digitado na aba velha', v3: atual.meta.nome },
    { campo: 'lore.historia', v2: V2.lore.historia, v3: 'Escrito na v3' }]);
});

test('reimportarV2: a v2 de OUTRO personagem não é mesclada (erro outra-ficha); o mesmo personagem sem carimbo vira conflito', () => {
  const st = A.armazenamento({ [LS2]: JSON.stringify(V2) });
  const o = opDupla();
  const id = E.migrarReal(st, o).id;
  const lira = E.armazem(st, null, o).ler(id);
  const proj = st.json(INDICE).projecaoV2;
  // a v2.1 revertida importou outra ficha: sem carimbo, nome e classe diferentes, sem cards
  const outro = Object.assign(copia(V2), { rev: 40, salvoEm: '2026-10-02T16:00:00.000Z', tecnicas: [], grimorio: [], cartasLimiar: [],
    meta: Object.assign({}, V2.meta, { nome: 'Outro Personagem', classe: 'Brutalista', ramo: '' }) });
  outro.atributos.for = 18;
  [proj, null].forEach((pj) => {
    const r = E.reimportarV2(lira, outro, Object.assign({}, o, { projecao: pj }));
    assert.deepEqual(so(r, 'erro', 'fichaIdV2', 'mudou', 'conflitos', 'perdas'),
      { erro: 'outra-ficha', fichaIdV2: null, mudou: [], conflitos: [], perdas: [] });
    assert.deepEqual(r.ficha, E.migrar(lira, o).ficha, 'a ficha volta como estava');
  });
  // carimbo de outra ficha: diz qual é
  const daOutra = Object.assign(st.json(LS2), { origemV3: { fichaId: 'foutraficha1', revV2: 3 } });
  assert.deepEqual(so(E.reimportarV2(lira, daOutra, o), 'erro', 'fichaIdV2'), { erro: 'outra-ficha', fichaIdV2: 'foutraficha1' });
  // o mesmo personagem sem carimbo (aba aberta antes da F4 gravando por cima): sem ancestral, só conflito
  const velha = Object.assign(copia(V2), { rev: V2.rev + 1, salvoEm: '2026-10-02T17:00:00.000Z' });
  velha.inventario.sins = 3;
  const r3 = E.reimportarV2(lira, velha, Object.assign({}, o, { projecao: proj }));
  assert.deepEqual([r3.ancestral, r3.mudou, r3.ficha.inventario.sins], ['trocada', [], lira.inventario.sins]);
  assert.deepEqual(r3.conflitos, [{ campo: 'inventario.sins', v2: 3, v3: lira.inventario.sins }]);
});
