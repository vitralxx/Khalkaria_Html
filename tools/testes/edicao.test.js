'use strict';
// Edição da ficha nova no modo Ensaio (F4.6b; docs/ficha-digital/07-f4-6-ensaio.md
// §3), as partes PURAS: js/ficha/kh-edicao.js (KhEdicao: o que cada campo muda,
// o stepper, o círculo de grau, o ajuste manual M2), o log de desfazer do
// armazém (KhEstado.armazem.editar/desfazer/refazer/estadoLog) e o HTML do
// js/ficha/kh-editor.js (barra, pop-over "Ajustar", tela "Ajustes"). Tudo sobre
// o armazém do ensaio (KhEnsaio.armazem: sessionStorage com o prefixo) com um
// armazenamento ESPIÃO: nada é escrito fora do prefixo. A interface (página e
// drawer no vm, Ctrl+Z / Ctrl+Y no KhTeclas) está no ensaio.test.js.
const test = require('node:test');
const assert = require('node:assert/strict');

const A = require('./estado-apoio.js');
const E = require('../../js/ficha/kh-ensaio.js');
const KE = require('../../js/ficha/kh-estado.js');
const ED = require('../../js/ficha/kh-edicao.js');
const KR = require('../../js/ficha/kh-editor.js');
const FA = require('../../js/ficha/kh-ficha-abas.js');
const RG = require('../../js/ficha/kh-regras.js');
const KC = require('../../js/ficha/kh-conta.js');

const V2 = A.lerJSON('tools', 'testes', 'fixtures', 'ficha-v2-sintetica.json');
const DADOS = Object.assign(A.dadosCatalogo(), { efeitos: A.lerJSON('data', 'efeitos.json'), glifos: '', erros: [] });
const CTX = FA.contexto(DADOS, RG.dados(), '../');
const PRE = 'khalkaria_ensaio:';
const det = (s) => ({ agora: A.relogio(), aleatorio: A.semente(s || 7) });
// o ESPIÃO: toda escrita no sessionStorage falso é do prefixo (aqui nem a marca: só o armazém escreve)
function soPrefixo(st, onde) {
  st.escritas.forEach((w) => assert.ok(w[0] !== 'clear' && w[1].startsWith(PRE), (onde || '') + ': escrita fora do prefixo ' + JSON.stringify(w)));
}
// o ensaio com a ficha atual (Lira, Batedor 2) migrada; arm = o armazém do ensaio
function ensaio() {
  const ss = A.armazenamento();
  const r = E.entrar(ss, A.soLeitura({ khalkaria_ficha: JSON.stringify(V2) }), Object.assign({ dados: DADOS }, det()));
  assert.ok(r.ok);
  ss.escritas = ss.escritas.filter((w) => w[1] !== 'khalkaria_ensaio_ligado');
  const arm = E.armazem(ss, det(3));
  const id = arm.ativa();
  return { ss, arm, id, ficha: () => arm.ler(id), nos: () => E.calcular(ss, DADOS, '').av.nos };
}
const pega = (f, c) => KE.pegaCaminho(f, c);
// muda pelo KhEdicao e grava pelo armazém (o que o KhEditor faz)
function edita(x, caminho, bruto) {
  const r = ED.mudancas(x.ficha(), caminho, bruto, { contexto: CTX });
  assert.ok(r.ok, caminho + ': ' + r.erro);
  const g = x.arm.editar(x.id, r.mudancas, r.rotulo);
  assert.ok(g.ok && g.mudou, caminho + ': gravou');
  return Object.assign(g, { aviso: r.aviso });
}

test('campo: o tipo, o rótulo e a faixa de cada campo de estado; o resto não se edita', () => {
  const t = (c) => { const x = ED.campo(c); return x && [x.tipo, x.rotulo, x.min, x.max]; };
  assert.deepEqual(t('meta.nome'), ['texto', 'Nome do Personagem', undefined, 80]);
  assert.deepEqual(t('meta.nivel'), ['inteiro', 'Nível', 1, 5]);
  assert.deepEqual(t('atributos.base.DES'), ['inteiro', 'Destreza (base)', 1, 30]);
  assert.deepEqual(t('pericias.oficio-alquimia'), ['grau', 'Ofício(Alquimia)', 0, 4]);
  assert.deepEqual(t('recursos.eter.atual'), ['inteiro', 'Éter atual', -9999, 9999]);
  assert.equal(ED.campo('recursos.eter.atual').passo, true);
  assert.equal(ED.campo('inventario.sins').passo, true);
  assert.deepEqual(t('vhelor.marcas'), ['inteiro', 'Marcas da Vhelor', 0, 7]);
  assert.deepEqual(t('identidade.ramo'), ['ref', 'Ramo', undefined, undefined]);
  assert.deepEqual(t('idiomas'), ['lista', 'Idiomas', undefined, 400]);
  assert.deepEqual(t('imunidadesCondicao'), ['conjunto', 'Imunidade a condição', undefined, undefined]);
  assert.deepEqual(t('lore.historia'), ['textoLongo', 'História', undefined, 20000]);
  ['id', 'rev', 'ajustes', 'recursos.saude.max', 'atributo.FOR.total', 'pericias.inexistente', 'atributos.base.CAR', 'identidade.subespecie']
    .forEach((c) => assert.equal(ED.campo(c), null, c));
});

test('mudancas: o texto lido de cada tipo, as recusas em PT-BR (faixa, inteiro, tamanho, catálogo) e o rótulo do passo', () => {
  const x = ensaio(), f = x.ficha();
  const m = (c, b) => ED.mudancas(f, c, b, { contexto: CTX });
  assert.deepEqual(m('meta.nome', '  Lira   do  Sul ').mudancas, [{ caminho: 'meta.nome', valor: 'Lira do Sul' }]);
  assert.equal(m('meta.nome', 'Lira').rotulo, 'Nome do Personagem: "Lira"');
  assert.equal(m('meta.nome', '').rotulo, 'Nome do Personagem: em branco');
  assert.equal(m('meta.nome', 'x'.repeat(81)).erro, 'Nome do Personagem: no máximo 80 caracteres.');
  assert.deepEqual(m('meta.nivel', ' 3 ').mudancas, [{ caminho: 'meta.nivel', valor: 3 }]);
  assert.equal(m('meta.nivel', '6').erro, 'Nível: de 1 a 5.');
  assert.equal(m('meta.nivel', '2,5').erro, 'Nível: digite um número inteiro (1 a 5).');
  assert.equal(m('meta.xp', 'abc').ok, false);
  assert.deepEqual(m('recursos.saude.atual', '−3').mudancas, [{ caminho: 'recursos.saude.atual', valor: -3 }], 'o menos tipográfico');
  assert.deepEqual(m('idiomas', 'Comum, Anão; comum\n  Élfico ').mudancas, [{ caminho: 'idiomas', valor: ['Comum', 'Anão', 'Élfico'] }], 'sem repetidos');
  assert.deepEqual(m('lore.historia', '  \n ').mudancas, [{ caminho: 'lore.historia', valor: '' }]);
  assert.deepEqual(m('lore.outros', 'a\r\nb').mudancas, [{ caminho: 'lore.outros', valor: 'a\nb' }]);
  assert.equal(m('identidade.raca', 'raca-inexistente').erro, 'Raça: opção fora do catálogo.');
  assert.equal(m('identidade.variante', 'anao-x').ok, false, 'variante de outra raça não está nas opções');
  assert.deepEqual(m('identidade.raca', ED.MANTER), { ok: true, mudancas: [], rotulo: '' }, '"manter" o texto livre não muda nada');
  assert.equal(m('pericias.atacar', '5').erro, 'Atacar: de 0 a 4.');
  assert.equal(m('recursos.saude.max', '10').erro, 'Este campo não se edita aqui.');
  // as opções do catálogo: variante só da raça, ramo só da classe
  assert.deepEqual(ED.opcoesRef(CTX, f, 'variante').map((o) => o.id), ['humano-simples', 'humano-estudioso', 'humano-rebelde', 'humano-popular']);
  assert.deepEqual(ED.opcoesRef(CTX, f, 'ramo').map((o) => o.id), ['batedor-ramo-do-cartografo', 'batedor-ramo-do-trambiqueiro', 'batedor-ramo-do-sem-nome']);
  assert.equal(ED.opcoesRef(CTX, f, 'raca').length, 7);
  assert.equal(ED.opcoesRef(CTX, f, 'classe').length, 7);
  assert.equal(ED.opcoesRef(CTX, f, 'origem').length, 19);
  ED.opcoesRef(CTX, f, 'ramo').forEach((o) => assert.doesNotMatch(o.nome, /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u, 'sem emoji'));
  // trocar a raça tira a variante de outra raça; trocar a classe tira o ramo de outra classe (com o aviso)
  const r = m('identidade.raca', 'raca-anao');
  assert.deepEqual(r.mudancas, [{ caminho: 'identidade.raca', valor: { id: 'raca-anao', nome: 'Anão' } },
    { caminho: 'identidade.variante', valor: { id: null, nome: '' } }]);
  assert.equal(r.aviso, 'A variante Simples saiu: é de outra raça.');
  const c = m('identidade.classe', 'classe-monge');
  assert.deepEqual(c.mudancas[1], { caminho: 'identidade.ramo', valor: { id: null, nome: '' } });
  assert.equal(c.aviso, 'O ramo Ramo do Cartógrafo saiu: é de outra classe.');
  assert.equal(m('identidade.classe', 'classe-batedor').mudancas.length, 1, 'a mesma classe: o ramo fica');
  // o stepper parte do guardado e fica na faixa; o círculo de grau
  assert.deepEqual(ED.passo(f, 'recursos.saude.atual', 1).mudancas, [{ caminho: 'recursos.saude.atual', valor: 19 }]);
  assert.deepEqual(ED.passo(f, 'vhelor.marcas', -1).mudancas, [{ caminho: 'vhelor.marcas', valor: 0 }]);
  assert.equal(ED.passo(f, 'meta.nome', 1).ok, false);
  assert.equal(ED.grauClicado(f, 'percepcao', 4), 4, 'percepção (grau 2): o 4º círculo vira 4');
  assert.equal(ED.grauClicado(f, 'percepcao', 2), 1, 'o último aceso apaga a si mesmo');
  assert.equal(ED.grauClicado(f, 'reflexos', 1), 1);
  assert.equal(m('pericias.percepcao', ED.grauClicado(f, 'percepcao', 3)).rotulo, 'Percepção: Mestre');
  assert.equal(m('pericias.percepcao', ED.grauClicado(f, 'percepcao', 2)).rotulo, 'Percepção: Treinado');
  assert.deepEqual([0, 1, 2, 3, 4].map(ED.rotuloGrau), ['Leigo', 'Treinado', 'Experiente', 'Mestre', 'Lendário']);
  // imunidade: marca e desmarca pelo id do catálogo
  const imc = m('imunidadesCondicao', { valor: 'amedrontado', marcado: true });
  assert.deepEqual(imc.mudancas, [{ caminho: 'imunidadesCondicao', valor: ['amedrontado'] }]);
  assert.equal(imc.rotulo, 'Imunidade a condição: marca Amedrontado');
  assert.equal(m('imunidadesCondicao', {}).ok, false);
});

test('editar, desfazer e refazer cada tipo de campo, tudo no prefixo do ensaio (espião)', () => {
  const x = ensaio();
  const casos = [
    ['meta.nome', 'Lira Nova', 'Lira Nova'], ['meta.jogador', 'Pedro', 'Pedro'], ['meta.nivel', '3', 3], ['meta.xp', '500', 500],
    ['identidade.raca', 'raca-anao', { id: 'raca-anao', nome: 'Anão' }],
    ['identidade.variante', null, null],                // depois da raça, as variantes do Anão
    ['identidade.classe', 'classe-monge', { id: 'classe-monge', nome: 'Monge' }],
    ['identidade.ramo', null, null],                    // os ramos do Monge
    ['identidade.origem', 'origem-lenhador', { id: 'origem-lenhador', nome: 'Lenhador' }],
    ['atributos.base.FOR', '13', 13], ['pericias.atacar', '3', 3], ['recursos.saude.atual', '5', 5], ['recursos.classe.atual', '0', 0],
    ['inventario.sins', '120', 120], ['vhelor.marcas', '2', 2], ['idiomas', 'Comum, Anão', ['Comum', 'Anão']],
    ['imunidadesCondicao', { valor: 'amedrontado', marcado: true }, ['amedrontado']],
    ['lore.historia', 'Linha 1\nLinha 2', 'Linha 1\nLinha 2'], ['lore.outros', 'nota', 'nota']
  ];
  for (let [c, bruto, esperado] of casos) {
    if (bruto === null) {
      const op = ED.opcoesRef(CTX, x.ficha(), c.split('.')[1])[1];
      assert.ok(op, c + ': há opção');
      bruto = op.id; esperado = { id: op.id, nome: op.nome };
    }
    const antes = x.ficha(), va = pega(antes, c);
    const g = edita(x, c, bruto);
    assert.deepEqual(pega(x.ficha(), c), esperado, c + ': gravado');
    assert.equal(x.ficha().rev, antes.rev + 1);
    assert.equal(g.desfazivel, true);
    assert.equal(x.arm.estadoLog(x.id).desfazer.rotulo, g.rotulo);
    // desfaz: volta (com as outras partes do passo: a variante que a raça tirou)
    const d = x.arm.desfazer(x.id);
    assert.ok(d.ok, c + ': desfez');
    assert.deepEqual(pega(x.ficha(), c), va, c + ': desfeito');
    g.partes.forEach((p) => assert.deepEqual(pega(x.ficha(), p), pega(antes, p), c + ' -> ' + p));
    assert.equal(x.arm.estadoLog(x.id).refazer.rotulo, g.rotulo);
    // refaz: de novo
    const r = x.arm.refazer(x.id);
    assert.ok(r.ok, c + ': refez');
    assert.deepEqual(pega(x.ficha(), c), esperado, c + ': refeito');
    assert.equal(x.arm.estadoLog(x.id).refazer, null, 'a pilha de refazer esvaziou');
  }
  // o mesmo valor de novo: nada grava
  const n = x.ss.escritas.length;
  const g = x.arm.editar(x.id, [{ caminho: 'meta.nome', valor: 'Lira Nova' }], 'x');
  assert.deepEqual([g.ok, g.mudou], [true, false]);
  assert.equal(x.ss.escritas.length, n);
  // uma edição nova esvazia o refazer
  x.arm.desfazer(x.id);
  assert.ok(x.arm.estadoLog(x.id).refazer);
  edita(x, 'meta.nome', 'Outra');
  assert.equal(x.arm.estadoLog(x.id).refazer, null);
  // nada vazio: desfazer tudo e mais um
  while (x.arm.desfazer(x.id).ok);
  assert.equal(x.arm.desfazer(x.id).erro, 'vazio');
  assert.equal(x.ficha().meta.nome, 'Lira Vento-Sul', 'tudo desfeito (até o teto): de volta ao começo');
  // o ESPIÃO: o log também é do prefixo, e nenhuma chave da ficha do jogador
  soPrefixo(x.ss, 'editar');
  assert.ok([...x.ss.m.keys()].some((k) => k === PRE + 'khalkaria_ficha_v3_log:' + x.id));
});

test('o log no teto: 20 passos por pilha e 256 KB (sai o mais velho); só o topo desfaz', () => {
  const x = ensaio();
  for (let i = 1; i <= 25; i++) edita(x, 'meta.xp', String(i));
  let lg = x.arm.estadoLog(x.id);
  assert.equal(lg.passos, KE.LOG_TETO);
  assert.equal(KE.LOG_TETO, 20);
  assert.equal(lg.desfazer.rotulo, 'XP: 25');
  // desfaz os 20 que restam: o XP para em 5 (os 5 primeiros saíram do log)
  for (let i = 0; i < 20; i++) assert.ok(x.arm.desfazer(x.id).ok);
  assert.equal(x.ficha().meta.xp, 5);
  assert.equal(x.arm.desfazer(x.id).erro, 'vazio');
  assert.equal(x.arm.estadoLog(x.id).refazerN, 20, 'o refazer também tem teto 20');
  // 256 KB: cada passo da História longa leva o antes e o depois (~40 mil caracteres)
  const y = ensaio();
  for (let i = 0; i < 6; i++) edita(y, 'lore.historia', String.fromCharCode(97 + i).repeat(ED.MAX_LORE));
  lg = y.arm.estadoLog(y.id);
  assert.equal(KE.LOG_BYTES, 256 * 1024);
  assert.ok(lg.bytes <= KE.LOG_BYTES, lg.bytes + ' bytes');
  assert.ok(lg.passos >= 1 && lg.passos < 6, lg.passos + ' passos');
  assert.ok(y.arm.desfazer(y.id).ok, 'o topo desfaz');
  assert.equal(y.ficha().lore.historia, 'e'.repeat(ED.MAX_LORE));
  // a função pura também apara
  const l = { passos: Array.from({ length: 30 }, (_, i) => ({ i })), refazer: [] };
  assert.equal(KE.aparaLog(l).passos.length, 20);
  assert.equal(l.passos[0].i, 10, 'saem os mais velhos');
  soPrefixo(x.ss, 'teto'); soPrefixo(y.ss, 'teto 256 KB');
});

test('recusa se a ficha mudou depois do passo (outra aba ou outra página desta aba): nada muda; o passo volta a valer se o caminho voltar', () => {
  const x = ensaio();
  edita(x, 'meta.nome', 'Nome A');
  edita(x, 'recursos.saude.atual', '10');
  // "outra aba": outro armazém sobre o mesmo storage muda a Saúde atual
  const outra = E.armazem(x.ss);
  assert.ok(outra.editar(x.id, [{ caminho: 'recursos.saude.atual', valor: 4 }], 'Saúde atual: 4').ok);
  const foto = x.ss.foto();
  const lg = x.arm.estadoLog(x.id);
  // o topo agora é o passo da outra; o de baixo (o meu) não anda sozinho
  assert.equal(lg.desfazer.rotulo, 'Saúde atual: 4');
  // um log que não bate: a ficha mudou por fora do log (o import "Atualizar", por exemplo)
  const f = x.ficha();
  f.recursos.saude.atual = 7;
  assert.ok(x.arm.gravar(f).ok);
  const r = x.arm.desfazer(x.id);
  assert.deepEqual([r.ok, r.erro, r.rotulo, r.partes], [false, 'outra-aba', 'Saúde atual: 4', ['recursos.saude.atual']]);
  assert.equal(x.ficha().recursos.saude.atual, 7, 'nada muda');
  assert.equal(x.arm.estadoLog(x.id).desfazer.livre, false, 'o botão fica desligado, com o porquê');
  assert.equal(x.arm.refazer(x.id).erro, 'vazio');
  assert.match(KR.textoErro(r, 'desfazer'), /^Não dá para desfazer "Saúde atual: 4": a ficha mudou depois/);
  assert.notEqual(x.ss.foto(), foto);
  // o caminho volta ao que o passo deixou: o passo vale de novo
  const g = x.ficha(); g.recursos.saude.atual = 4;
  assert.ok(x.arm.gravar(g).ok);
  assert.equal(x.arm.estadoLog(x.id).desfazer.livre, true);
  assert.ok(x.arm.desfazer(x.id).ok);
  assert.equal(x.ficha().recursos.saude.atual, 10);
  // outro caminho mudado por fora não trava o passo (ele só toca o dele)
  const h = x.ficha(); h.meta.jogador = 'Outro';
  assert.ok(x.arm.gravar(h).ok);
  assert.ok(x.arm.desfazer(x.id).ok);
  assert.equal(x.ficha().recursos.saude.atual, 18);
  assert.equal(x.ficha().meta.jogador, 'Outro');
  soPrefixo(x.ss, 'outra aba');
});

test('ajuste fixo e de diferença: propagam aos dependentes; remover volta ao calculado; desfazer e refazer o ajuste', () => {
  const x = ensaio();
  let nos = x.nos();
  const base = { mod: nos['atributo.DES.mod'].valor, passiva: nos['evasao.passiva'].valor, refl: nos['pericia.reflexos.total'].valor,
    furt: nos['pericia.furtividade.total'].valor };
  assert.deepEqual(base, { mod: 3, passiva: 13, refl: 3, furt: 5 });
  // Valor fixo no Mod.DES: a Evasão e as perícias de DES acompanham
  const m = ED.montaAjuste('atributo.DES.mod', { modo: 'fixa', valor: '5', motivo: '  bênção  da   Vhelor ' }, nos['atributo.DES.mod'], '2026-10-14T12:00:00.000Z');
  assert.deepEqual(m, { ok: true, ajuste: { modo: 'fixa', valor: 5, temporario: false, desde: '2026-10-14T12:00:00.000Z', origem: 'manual',
    motivo: 'bênção da Vhelor', calculadoEm: 3 } });
  const r = ED.mudancaAjuste(x.ficha(), 'atributo.DES.mod', m.ajuste, 'Mod. de Destreza');
  assert.equal(r.rotulo, 'Ajuste em Mod. de Destreza: valor fixo 5');
  assert.ok(x.arm.editar(x.id, r.mudancas, r.rotulo).ok);
  nos = x.nos();
  assert.equal(nos['atributo.DES.mod'].valor, 5);
  assert.equal(nos['atributo.DES.mod'].calculado, 3);
  assert.equal(nos['evasao.passiva'].valor, base.passiva + 2);
  assert.equal(nos['pericia.reflexos.total'].valor, base.refl + 2);
  assert.equal(nos['pericia.furtividade.total'].valor, base.furt + 2);
  assert.equal(x.ficha().ajustes['recurso.saude.max'].origem, 'migracao', 'os ajustes migrados ficam');
  // Diferença na Evasão Passiva: soma ao calculado, e a Ativa acompanha
  const s = ED.montaAjuste('evasao.passiva', { modo: 'soma', valor: '+1' }, nos['evasao.passiva'], '2026-10-14T12:01:00.000Z');
  assert.equal(s.ajuste.calculadoEm, undefined, 'a diferença acompanha o calculado: sem calculadoEm');
  assert.ok(x.arm.editar(x.id, ED.mudancaAjuste(x.ficha(), 'evasao.passiva', s.ajuste).mudancas, 'x').ok);
  nos = x.nos();
  assert.equal(nos['evasao.passiva'].valor, base.passiva + 3);
  assert.equal(nos['evasao.ativa'].valor, (base.passiva + 3) + ' + 1d6');
  // o dado (Evasão Ativa) e o booleano (Resistência)
  assert.equal(ED.montaAjuste('evasao.ativa', { modo: 'fixa', valor: '14 + 1d8' }, nos['evasao.ativa'], 'x').ajuste.valor, '14 + 1d8');
  assert.equal(ED.montaAjuste('evasao.ativa', { modo: 'fixa', valor: 'muito' }, nos['evasao.ativa'], 'x').erro, 'Digite o dado, como 1d8 ou 13 + 1d8.');
  assert.equal(ED.montaAjuste('resistencia.fogo', { modo: 'soma', valor: 'sim' }, null, 'x').ajuste.valor, true);
  assert.equal(ED.montaAjuste('resistencia.fogo', { valor: 'talvez' }, null, 'x').erro, 'Escolha sim ou não.');
  assert.equal(ED.montaAjuste('cd', { modo: 'soma', valor: '0' }, null, 'x').erro, 'Uma diferença de 0 não muda nada: para tirar o ajuste, use Remover.');
  assert.equal(ED.montaAjuste('cd', { modo: 'fixa', valor: '' }, null, 'x').erro, 'Digite um número.');
  assert.equal(ED.montaAjuste('cd', { valor: '3', motivo: 'x'.repeat(121) }, null, 'x').erro, 'O motivo tem no máximo 120 caracteres.');
  // desfazer o ajuste da Evasão; refazer
  assert.ok(x.arm.desfazer(x.id).ok);
  assert.equal(x.nos()['evasao.passiva'].valor, base.passiva + 2);
  assert.ok(x.arm.refazer(x.id).ok);
  assert.equal(x.nos()['evasao.passiva'].valor, base.passiva + 3);
  // remover em LOTE: os dois manuais num passo só; o migrado fica
  const rm = ED.mudancaRemover(x.ficha(), ['atributo.DES.mod', 'evasao.passiva', 'nao.existe']);
  assert.equal(rm.rotulo, 'Remover 2 ajustes');
  assert.ok(x.arm.editar(x.id, rm.mudancas, rm.rotulo).ok);
  nos = x.nos();
  assert.deepEqual([nos['atributo.DES.mod'].valor, nos['evasao.passiva'].valor, nos['pericia.reflexos.total'].valor], [base.mod, base.passiva, base.refl]);
  assert.deepEqual(Object.keys(x.ficha().ajustes).sort(), ['recurso.saude.max', 'recurso.stamina.max']);
  assert.equal(ED.mudancaRemover(x.ficha(), ['cd']).erro, 'Nenhum ajuste selecionado.');
  assert.equal(ED.mudancaRemover(x.ficha(), ['recurso.saude.max'], 'Saúde máx.').rotulo, 'Remover o ajuste de Saúde máx.');
  // um passo de desfazer devolve os dois
  assert.ok(x.arm.desfazer(x.id).ok);
  assert.deepEqual(Object.keys(x.ficha().ajustes).sort(), ['atributo.DES.mod', 'evasao.passiva', 'recurso.saude.max', 'recurso.stamina.max']);
  soPrefixo(x.ss, 'ajustes');
});

test('"o calculado mudou de X para Y": no nó, na lista de Ajustes, no pop-over e no número da página (KhConta com editar)', () => {
  const x = ensaio();
  let nos = x.nos();
  // a Saúde máx. migrada (fixa 22, calculada 20 quando migrou): sem aviso
  assert.equal(nos['recurso.saude.max'].calculado, 20);
  assert.deepEqual(nos['recurso.saude.max'].avisos.filter((a) => a.tipo === 'calculado-mudou'), []);
  // subir de nível muda o calculado: o aviso aparece, e o ajustado fica 22
  edita(x, 'meta.nivel', '3');
  nos = x.nos();
  const no = nos['recurso.saude.max'];
  assert.equal(no.valor, 22);
  assert.ok(no.calculado > 20);
  const av = no.avisos.filter((a) => a.tipo === 'calculado-mudou')[0];
  assert.ok(av, 'o aviso');
  assert.match(av.msg, new RegExp('o calculado mudou de 20 para ' + no.calculado));
  const linhas = KR.linhasAjustes(x.ficha(), nos);
  const l = linhas.filter((y) => y.caminho === 'recurso.saude.max')[0];
  assert.deepEqual([l.calculado, l.ajustado, l.ajuste, l.mudou, l.origem], [String(no.calculado), '22', 'valor fixo 22', av.msg, 'migracao']);
  assert.equal(linhas.filter((y) => y.mudou).length, 2, 'a Stamina máx. também (Batedor 3)');
  assert.match(KR.htmlAjustes(linhas, {}, 'fp'), /<span class="ke-mudou" role="note">o calculado mudou de 20 para/);
  assert.match(KR.htmlPop({ caminho: 'recurso.saude.max', rotulo: 'Saúde máx.', calculado: String(no.calculado), ajustado: '22',
    ajuste: x.ficha().ajustes['recurso.saude.max'], mudou: av.msg }), /<p class="ke-mudou ke-pop-mudou" role="note">o calculado mudou de 20 para \d+\. Aplicar de novo guarda o calculado de agora\.<\/p>/);
  // o número da página, com editar: o aviso à vista; sem editar, o HTML de sempre
  const D = RG.dados();
  const com = KC.criar({ D, nos, prefixo: 'fp', editar: { ajustavel: ED.ajustavel, motivo: ED.motivoNaoAjuste } }).conta('recurso.saude.max');
  const sem = KC.criar({ D, nos, prefixo: 'fp' }).conta('recurso.saude.max');
  assert.match(com, /<span class="ke-mudou" role="note">o calculado mudou de 20 para/);
  assert.match(com, /class="kh-conta fp-conta ke-ajustavel" tabindex="0" role="button" aria-haspopup="dialog" aria-label="Ajustar [^"]+: 22" data-ajustavel/);
  assert.match(com, /<span class="ke-d-ed">Clique ou Enter: ajustar este número\.<\/span>/);
  assert.doesNotMatch(sem, /ke-|data-ajustavel|role="button"/);
  // aplicar de novo guarda o calculado de agora: o aviso sai
  const m = ED.montaAjuste('recurso.saude.max', { modo: 'fixa', valor: '22' }, no, 'x');
  assert.equal(m.ajuste.calculadoEm, no.calculado);
  assert.ok(x.arm.editar(x.id, ED.mudancaAjuste(x.ficha(), 'recurso.saude.max', m.ajuste).mudancas, 'x').ok);
  assert.deepEqual(x.nos()['recurso.saude.max'].avisos.filter((a) => a.tipo === 'calculado-mudou'), []);
  soPrefixo(x.ss, 'calculado mudou');
});

test('o validador recusa ajuste em recurso.*.atual (e em todo campo de estado): nada grava; números que não aceitam ajuste dizem por quê', () => {
  const x = ensaio();
  const foto = x.ss.foto(), n = x.ss.escritas.length;
  ['saude', 'stamina', 'eter', 'classe'].forEach((r) => {
    const c = 'recursos.' + r + '.atual';
    const aj = { modo: 'fixa', valor: 3, temporario: false, desde: '2026-10-14T12:00:00.000Z', origem: 'manual' };
    const a = Object.assign({}, x.ficha().ajustes, { [c]: aj });
    const g = x.arm.editar(x.id, [{ caminho: 'ajustes', valor: a }], 'x');
    assert.deepEqual([g.ok, g.erro, g.caminho, g.motivo], [false, 'ajuste-invalido', c, 'caminho-de-estado'], c);
    assert.equal(KR.textoErro(g), 'Ajuste recusado em ' + c + ': é um campo de estado (edite o campo, não ajuste).');
    assert.match(ED.montaAjuste(c, { valor: '3' }, null, 'x').erro, /^Este número não aceita ajuste: /);
    assert.equal(ED.ajustavel(c), false);
  });
  // a parte de um ajuste solto (o caminho 'ajustes.x') e o ajuste malformado também
  assert.equal(x.arm.editar(x.id, [{ caminho: 'ajustes.cd', valor: {} }], 'x').erro, 'ajuste-invalido');
  assert.equal(x.arm.editar(x.id, [{ caminho: 'ajustes', valor: { cd: { modo: 'fixa', valor: 'x' } } }], 'x').motivo, 'valor-invalido');
  // a identidade da ficha e o carimbo do armazém não se editam; caminho repetido ou sobreposto, também não
  ['id', 'rev', 'schemaVersion', 'salvoEm', 'criadoEm', 'exportadoEm', 'rev.x', '', '.a', 'a..b'].forEach((c) => {
    assert.equal(x.arm.editar(x.id, [{ caminho: c, valor: 1 }], 'x').erro, 'caminho-invalido', JSON.stringify(c));
  });
  assert.equal(x.arm.editar(x.id, [{ caminho: 'meta.nome', valor: 'a' }, { caminho: 'meta.nome', valor: 'b' }], 'x').erro, 'caminho-repetido');
  assert.equal(x.arm.editar(x.id, [{ caminho: 'meta', valor: {} }, { caminho: 'meta.nome', valor: 'b' }], 'x').erro, 'caminho-sobreposto');
  assert.equal(x.arm.editar('fnaoexiste00', [{ caminho: 'meta.nome', valor: 'a' }], 'x').erro, 'inexistente');
  assert.equal(x.ss.foto(), foto, 'nada gravado');
  assert.equal(x.ss.escritas.length, n);
  // os que não aceitam ajuste: o motivo de cada um
  assert.match(ED.motivoNaoAjuste('carga'), /soma dos pesos do inventário/);
  assert.match(ED.motivoNaoAjuste('defesa.fogo'), /^a Redução soma Ar, Ae do tipo/);
  assert.match(ED.motivoNaoAjuste('morrendo.tique'), /Saúde máxima \(D86\)/);
  assert.match(ED.motivoNaoAjuste('recurso.stamina.disponivel'), /Stamina atual menos a comprometida \(D19\)/);
  assert.match(ED.motivoNaoAjuste('magia.magia-fagulha.custo.forcada'), /intensidade escolhida/);
  assert.equal(ED.motivoNaoAjuste('qualquer.coisa'), 'este número não aceita ajuste manual.');
  ['carga', 'defesa.fogo', 'morrendo.tique', 'recurso.stamina.disponivel'].forEach((c) => assert.equal(ED.ajustavel(c), false, c));
  ['cd', 'evasao.ativa', 'recurso.saude.max', 'pericia.atacar.total', 'magia.magia-fagulha.custo', 'resistencia.fogo'].forEach((c) => assert.equal(ED.ajustavel(c), true, c));
  // o HTML do número que não aceita: a conta e o motivo na dica, sem botão
  const nos = x.nos();
  const h = KC.criar({ D: RG.dados(), nos, prefixo: 'fp', editar: { ajustavel: ED.ajustavel, motivo: ED.motivoNaoAjuste } }).conta('morrendo.tique');
  assert.match(h, /<span class="ke-d-ed">Não aceita ajuste: sai da Saúde máxima \(D86\): ajuste a Saúde máx\.<\/span>/);
  assert.doesNotMatch(h, /data-ajustavel|role="button"/);
});

test('htmlBarra e htmlPop: Desfazer/Refazer com o porquê (aria-disabled e o atalho), "Ajustes (N)" só na página; o pop-over com "Temporário" desligado e a nota da F5', () => {
  const vazio = KR.htmlBarra({ log: { desfazer: null, refazer: null }, nAjustes: 2 }, { modo: 'pagina', prefixo: 'fp' });
  assert.match(vazio, /<button type="button" class="kh-btn ke-btn ke-ed-desfazer" data-ked="desfazer" aria-disabled="true" aria-keyshortcuts="Control\+Z" title="Nada a desfazer \(Ctrl\+Z\)">Desfazer<\/button>/);
  assert.match(vazio, /data-ked="refazer" aria-disabled="true" aria-keyshortcuts="Control\+Y" title="Nada a refazer \(Ctrl\+Y\)">Refazer</);
  assert.match(vazio, /data-ked="ajustes"[^>]*aria-expanded="false" aria-controls="fp-ked-aj">Ajustes \(2\)</);
  assert.match(vazio, /<p class="ke-ed-msg" role="status" aria-live="polite"><\/p>/);
  const com = KR.htmlBarra({ log: { desfazer: { rotulo: 'XP: 5', livre: true }, refazer: { rotulo: 'Nível: 3', livre: false } }, msg: { tipo: 'aviso', texto: 'Oi' } }, { modo: 'drawer', prefixo: 'fd' });
  assert.match(com, /data-ked="desfazer" aria-keyshortcuts="Control\+Z" title="Desfazer: XP: 5 \(Ctrl\+Z\)">/);
  assert.match(com, /data-ked="refazer" aria-disabled="true" aria-keyshortcuts="Control\+Y" title="Refazer indisponível: a ficha mudou depois de &quot;Nível: 3&quot; \(Ctrl\+Y\)">/);
  assert.doesNotMatch(com, /data-ked="ajustes"/, 'no drawer, sem a tela Ajustes');
  assert.match(com, /<p class="ke-ed-dica">Aqui, só os recursos atuais e os Sins \(− e \+\)\. O resto, na página da ficha\.<\/p>/);
  assert.match(com, /<p class="ke-ed-msg ke-ed-msg-aviso" role="status" aria-live="polite">Oi<\/p>/);
  const pop = KR.htmlPop({ caminho: 'cd', rotulo: 'CD', tipo: 'numero', modo: 'fixa', valor: '15', calculado: '15', ajustado: '15' });
  assert.match(pop, /<form class="ke-pop" role="dialog" aria-modal="false" aria-labelledby="ke-pop-tit" data-ked-form="ajuste" data-caminho="cd">/);
  assert.match(pop, /value="fixa" data-ked-campo="modo" checked> Valor fixo/);
  assert.match(pop, /<input type="checkbox" disabled aria-describedby="ke-pop-temp-nota"> Temporário<\/label> <span class="ke-nota" id="ke-pop-temp-nota">expira na Mesa \(F5\)<\/span>/);
  assert.doesNotMatch(pop, /data-ked="remover-aj"/, 'sem ajuste, sem Remover');
  const soma = KR.htmlPop({ caminho: 'cd', rotulo: 'CD', modo: 'soma', valor: '+2', ajuste: { modo: 'soma', valor: 2, motivo: 'Teste' }, calculado: '15', ajustado: '17' });
  assert.match(soma, /value="soma" data-ked-campo="modo" checked> Diferença/);
  assert.match(soma, /ajustado: <b>17<\/b> \(diferença \+2, Teste\)/);
  assert.match(soma, /data-ked="remover-aj"[^>]*>Remover</);
  const bool = KR.htmlPop({ caminho: 'resistencia.fogo', tipo: 'booleano', valor: 'sim' });
  assert.doesNotMatch(bool, /ke-pop-modo/);
  assert.match(bool, /<option value="sim" selected>sim<\/option><option value="nao">não<\/option>/);
  // a tela Ajustes: vazia; com seleção, "Remover N selecionados" ligado
  assert.match(KR.htmlAjustes([], {}, 'fp'), /Nenhum ajuste\. Clique num número da ficha para ajustar\./);
  const ls = [{ caminho: 'cd', rotulo: 'CD', calculado: '15', ajustado: '17', ajuste: 'diferença +2', motivo: '', desde: '14/10 12:00', origem: 'manual', mudou: '' },
    { caminho: 'ar', rotulo: 'Ar', calculado: '1', ajustado: '3', ajuste: 'valor fixo 3', motivo: 'Escudo', desde: '14/10 12:00', origem: 'migracao', mudou: '' }];
  const h0 = KR.htmlAjustes(ls, {}, 'fp');
  assert.match(h0, /data-ked="remover-sel" aria-disabled="true" title="Marque os ajustes que saem">Remover selecionados</);
  assert.match(h0, /\(migrado da ficha atual\)/);
  const h2 = KR.htmlAjustes(ls, { cd: true, ar: true }, 'fp');
  assert.match(h2, /data-ked="remover-sel" title="Remove os ajustes marcados \(um passo de desfazer\)">Remover 2 selecionados</);
  assert.match(h2, /data-ked-todos aria-label="Selecionar todos" checked>/);
});
