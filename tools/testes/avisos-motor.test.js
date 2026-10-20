'use strict';
// Auditoria das mensagens do motor (docs/ficha-digital/09-auditoria-motor-2026-10-20.md,
// "Lista priorizada de correções do site"): o que o motor diz ao jogador.
//   1. a intensidade padrão da magia é a única que ela tem (as 14 só com Transbordante);
//   2. o atual dos recursos nasce no máximo e o acompanha (Sistema > Regras dos
//      status: sobe a diferença; o grampo corta quando desce), no armazém do Ensaio;
//   3. os avisos que o contrato manda dar (progressao.validacoes, magia.requisitos):
//      só avisos, nada trava;
//   4. efeitos com número no texto que o motor não lê: lembrete e aviso agregado;
//   5. textos sem token cru nem jargão interno.
const test = require('node:test');
const assert = require('node:assert/strict');

const A = require('./estado-apoio.js');
const R = require('../../js/ficha/kh-regras.js');
const KE = require('../../js/ficha/kh-estado.js');
const P = require('../../js/ficha/kh-previa.js');
const EN = require('../../js/ficha/kh-ensaio.js');
const ED = require('../../js/ficha/kh-edicao.js');
const FA = require('../../js/ficha/kh-ficha-abas.js');
const D = require('../../js/ficha/00-regras-dados.js');

const EFEITOS = A.lerJSON('data', 'efeitos.json').porId;
const DADOS = Object.assign(A.dadosCatalogo(), { efeitos: A.lerJSON('data', 'efeitos.json'), glifos: '', erros: [] });
const CTX = FA.contexto(DADOS, R.dados(), '../');
const det = (s) => ({ agora: A.relogio(), aleatorio: A.semente(s || 7) });

let nUid = 0;
function ficha(o) {
  o = o || {};
  const f = KE.novaFicha({ nome: 'Teste', nivel: o.nivel || 1 }, { agora: () => '2026-10-20T12:00:00.000Z' });
  if (o.classe) f.identidade.classe = { id: 'classe-' + o.classe, nome: o.classe };
  if (o.raca) f.identidade.raca = { id: 'raca-' + o.raca, nome: o.raca };
  if (o.variante) f.identidade.variante = { id: o.variante, nome: o.variante };
  if (o.attrs) Object.assign(f.atributos.base, o.attrs);
  if (o.escolhas) f.identidade.escolhas = o.escolhas;
  if (o.pericias) Object.assign(f.pericias, o.pericias);
  return f;
}
const entrada = (tipo, id, nome, estado) => ({ uid: 'u' + (++nUid), tipo, id, estado: estado || {}, cache: { nome: nome || id, versaoCatalogo: '' }, mods: [] });
const item = (id, nome, x) => Object.assign({ uid: 'i' + (++nUid), id, nome, qtd: 1 }, x || {});
const avalia = (f) => R.avaliar(f, { efeitos: EFEITOS });
const avisos = (r, tipo) => r.avisos.filter((a) => a.tipo === tipo);
// a lista que o jogador lê (a mesma da página e do drawer)
const lista = (f) => P.listaAvisos({ estado: 'ok', ficha: f, av: avalia(f), avisosMigracao: [], semCatalogo: false, semEfeitos: false });

// ---------------------------------------------------------------- 1. magia
test('magia sem intensidade escolhida: a Normal, ou a única que ela tem (Vislumbre 4, Fissura da Alma 12), sem aviso falso', () => {
  const f = ficha({ classe: 'teurgo', nivel: 5, pericias: { mistico: 2 } });
  f.entradas.push(entrada('magia', 'magia-vislumbre', 'Vislumbre', { intensidade: null }),
    entrada('magia', 'magia-fissura-da-alma', 'Fissura da Alma', { intensidade: null }),
    entrada('magia', 'magia-fagulha', 'Fagulha', { intensidade: null }));
  const r = avalia(f);
  const vis = r.nos['magia.magia-vislumbre.custo'], fis = r.nos['magia.magia-fissura-da-alma.custo'];
  assert.equal(vis.valor, 4);
  assert.equal(vis.magia.intensidade, 'transbordante');
  assert.equal(fis.valor, 12);
  assert.deepEqual(vis.avisos, []);
  assert.deepEqual(fis.avisos, []);
  assert.equal(r.nos['magia.magia-fagulha.custo'].valor, 0, 'Nível 1 Normal sem modulação: 0');
  assert.ok(vis.porIntensidade.find((x) => x.intensidade === 'transbordante').escolhida);
  // escolhida à mão uma que a magia não tem: o aviso fala em nomes, não em ids
  f.entradas[0].estado.intensidade = 'normal';
  const av = avalia(f).nos['magia.magia-vislumbre.custo'].avisos;
  assert.equal(av.length, 1);
  assert.equal(av[0].msg, 'a intensidade Normal não existe nesta magia (ela tem Transbordante)');
  // o lembrete do nível 5 com acento
  assert.ok(fis.lembretes.some((l) => l.msg === 'Nível 5 exige Foco Primordial (Experiente em Místico)'));
});

// ---------------------------------------------------------------- 2. recursos
test('acompanharMaximos: sobe a diferença quando o máximo sobe; o grampo corta quando desce; o atual digitado à mão fica', () => {
  const a = ficha({ raca: 'humano' });
  const b = JSON.parse(JSON.stringify(a));
  b.identidade.classe = { id: 'classe-brutalista', nome: 'Brutalista' };
  const max = R.maximos(b, { efeitos: EFEITOS });
  assert.ok(max.saude > 0 && max.stamina > 0 && max.eter > 0);
  const m = R.acompanharMaximos(a, b, { efeitos: EFEITOS }, ['identidade.classe']);
  assert.deepEqual(m, [{ caminho: 'recursos.saude.atual', valor: max.saude }, { caminho: 'recursos.stamina.atual', valor: max.stamina },
    { caminho: 'recursos.eter.atual', valor: max.eter }], 'Brutalidade começa em 0 no combate: não sobe');
  // o máximo desce (nível 3 -> 1) e o atual estava acima: o grampo; abaixo: fica
  const c = JSON.parse(JSON.stringify(b)); c.meta.nivel = 3;
  const mc = R.maximos(c, { efeitos: EFEITOS });
  c.recursos.saude.atual = mc.saude; c.recursos.stamina.atual = 2; c.recursos.eter.atual = -3;
  const d = JSON.parse(JSON.stringify(c)); d.meta.nivel = 1;
  const md = R.maximos(d, { efeitos: EFEITOS });
  const out = R.acompanharMaximos(c, d, { efeitos: EFEITOS }, ['meta.nivel']);
  assert.deepEqual(out, [{ caminho: 'recursos.saude.atual', valor: md.saude }], 'Stamina 2 e Éter −3 ficam (já abaixo do novo máximo)');
  // o atual que a edição já escreve não é mexido
  assert.deepEqual(R.acompanharMaximos(a, b, { efeitos: EFEITOS }, ['identidade.classe', 'recursos.saude.atual']).map((x) => x.caminho),
    ['recursos.stamina.atual', 'recursos.eter.atual']);
  // Reagentes nasce no máximo (início "max" na criação); Fluxo não
  const alq = JSON.parse(JSON.stringify(a)); alq.identidade.classe = { id: 'classe-alquimista', nome: 'Alquimista' };
  assert.ok(R.acompanharMaximos(a, alq, { efeitos: EFEITOS }, []).some((x) => x.caminho === 'recursos.classe.atual' && x.valor === R.maximos(alq).classe));
  const mon = JSON.parse(JSON.stringify(a)); mon.identidade.classe = { id: 'classe-monge', nome: 'Monge' };
  assert.ok(!R.acompanharMaximos(a, mon, { efeitos: EFEITOS }, []).some((x) => x.caminho === 'recursos.classe.atual'));
});

test('ficha nova no Ensaio: escolher a classe enche Saúde, Stamina e Éter (sem Morrendo/Exaurido/Oco falsos), num passo só com o desfazer', () => {
  const ss = A.armazenamento();
  assert.ok(EN.entrar(ss, A.soLeitura({}), Object.assign({ dados: DADOS }, det())).ok);
  const arm = EN.armazem(ss, det(3)), id = arm.ativa();
  const res = () => EN.calcular(ss, DADOS, '');
  // sem classe: máximo indefinido, atual 0, nenhum alerta de condição
  assert.deepEqual(res().av.alertas.filter((a) => a.tipo === 'condicao-automatica'), []);
  const r = ED.mudancas(arm.ler(id), 'identidade.classe', 'classe-espadachim', { contexto: CTX });
  assert.ok(r.ok, r.erro);
  const g = arm.editar(id, r.mudancas, r.rotulo);
  assert.ok(g.ok && g.mudou);
  assert.ok(['recursos.saude.atual', 'recursos.stamina.atual', 'recursos.eter.atual'].every((c) => g.partes.includes(c)), JSON.stringify(g.partes));
  const nos = res().av.nos, f = arm.ler(id);
  ['saude', 'stamina', 'eter'].forEach((k) => assert.equal(f.recursos[k].atual, nos['recurso.' + k + '.max'].valor, k));
  assert.deepEqual(res().av.alertas.filter((a) => a.tipo === 'condicao-automatica'), []);
  // subir de nível sobe o atual a diferença
  const antes = f.recursos.saude.atual;
  const r2 = ED.mudancas(f, 'meta.nivel', '3', { contexto: CTX });
  assert.ok(arm.editar(id, r2.mudancas, r2.rotulo).ok);
  assert.equal(arm.ler(id).recursos.saude.atual, antes + (res().av.nos['recurso.saude.max'].valor - nos['recurso.saude.max'].valor));
  // o desfazer volta o nível e o atual juntos
  assert.ok(arm.desfazer(id).ok);
  assert.equal(arm.ler(id).meta.nivel, 1);
  assert.equal(arm.ler(id).recursos.saude.atual, antes);
});

test('acima do máximo: diz o que fazer, sem prometer corte; Stamina negativa e recurso de classe fora da faixa avisam', () => {
  const f = ficha({ classe: 'monge', nivel: 2 });
  f.recursos.saude.atual = 999; f.recursos.stamina.atual = -5; f.recursos.classe.atual = 99;
  let r = avalia(f);
  const sa = r.alertas.find((a) => a.tipo === 'acima-do-maximo' && a.recurso === 'saude');
  assert.match(sa.msg, /^Saúde atual 999 acima do máximo \(\d+\): corrija o valor atual$/);
  assert.equal(r.alertas.find((a) => a.tipo === 'abaixo-do-minimo' && a.recurso === 'stamina').msg,
    'Stamina atual −5: a Stamina não fica negativa (mínimo 0); corrija o valor atual');
  assert.equal(r.alertas.find((a) => a.tipo === 'acima-do-maximo' && a.recurso === 'classe').msg, 'Fluxo atual 99 acima do máximo (5): corrija o valor atual');
  // a reserva comprometida só avisa quando existe
  assert.deepEqual(r.nos['recurso.stamina.disponivel'].avisos, []);
  f.recursos.classe.atual = -1;
  r = avalia(f);
  const neg = r.alertas.find((a) => a.tipo === 'abaixo-do-minimo' && a.recurso === 'classe');
  assert.equal(neg.msg, 'Fluxo atual −1, abaixo de 0: corrija o valor atual');
  assert.equal(neg.selo, 'pendenteBalanceamento', 'o mínimo do medidor está com o balanceamento');
});

// ---------------------------------------------------------------- 3. validações
test('técnicas acima de 3 + nível, Tier acima do nível e do limite, Marcas acima do nível', () => {
  const f = ficha({ classe: 'espadachim', nivel: 1 });
  ['espadachim-leitura-de-batalha', 'espadachim-peso-do-fracasso', 'espadachim-limiar-da-morte', 'espadachim-pedra-de-amolar',
    'espadachim-respiro-do-espadachim'].forEach((id) => f.entradas.push(entrada('tecnica', id)));
  f.entradas.push(entrada('tecnica', 'espadachim-contra-guarda', 'Contra-Guarda'), entrada('ultimate', 'espadachim-sentenca-final', 'Sentença Final'),
    entrada('marca', 'espadachim-disciplina', 'Disciplina'));
  let r = avalia(f);
  assert.equal(avisos(r, 'tecnicas-acima')[0].msg, '5 técnicas gerais; no nível 1 o limite é 4 (3 + nível)');
  assert.deepEqual(avisos(r, 'tier-acima-do-nivel').map((a) => a.msg), [
    'Tier 2 abre no nível 4; a ficha é nível 1: Contra-Guarda', 'Tier 3 (Ultimate) abre no nível 5; a ficha é nível 1: Sentença Final']);
  assert.match(avisos(r, 'marcas-acima')[0].msg, /^1 Marca no nível 1; o limite é 0 \(1 no nível 3, 2 no nível 4, 3 no nível 5\)$/);
  // nível 5: tudo dentro (8 gerais cabem; Tier 2 e 3 abertos, 1 marca)
  f.meta.nivel = 5;
  r = avalia(f);
  assert.deepEqual(['tecnicas-acima', 'tier-acima-do-nivel', 'tier-acima-do-limite', 'marcas-acima'].flatMap((t) => avisos(r, t)), []);
  // 2 Ultimates: o limite do Tier 3 é 1
  f.entradas.push(entrada('ultimate', 'espadachim-outra', 'Outra'));
  assert.equal(avisos(avalia(f), 'tier-acima-do-limite')[0].msg, 'Tier 3 (Ultimate): 2 técnicas; o limite é 1: Sentença Final, Outra');
});

test('magia: acima do nível do personagem, sem Treinado em Místico, sem o Foco da escola, mais de 1 Foco, escolas do Teurgo', () => {
  const f = ficha({ classe: 'teurgo', nivel: 1, attrs: { INT: 14 } });
  f.entradas.push(entrada('magia', 'magia-fagulha', 'Fagulha'), entrada('magia', 'magia-anteparo-eterico', 'Anteparo Etérico'),
    entrada('magia', 'magia-dedo-mistico', 'Dedo Místico'), entrada('magia', 'magia-fissura-da-alma', 'Fissura da Alma'));
  let r = avalia(f);
  assert.equal(avisos(r, 'magia-acima-do-nivel')[0].msg, 'magias acima do nível do personagem (1): Fissura da Alma (nível 5)');
  assert.equal(avisos(r, 'magia-sem-mistico')[0].msg, '4 magias pedem Treinado em Místico; a ficha está Leiga em Místico');
  assert.match(avisos(r, 'magia-sem-foco')[0].msg, /: Fagulha \(Destruição\), Anteparo Etérico \(Abjuração\), Dedo Místico \(Alteração\), Fissura da Alma \(Primordial\)$/);
  assert.equal(avisos(r, 'teurgo-escolas')[0].msg,
    'magias de 3 escolas (Destruição, Abjuração, Alteração); no nível 1 o Teurgo domina 2 (2 no nível 1, 3 no 3, 5 no 5)');
  // treinado e com o Foco de Destruição equipado: a Fagulha sai da lista; 2 Focos avisam
  f.pericias.mistico = 1;
  f.inventario.equipamentos.push(item('item-foco-de-destruicao', 'Foco de Destruição', { equipado: true }),
    item('item-foco-de-abjuracao', 'Foco de Abjuração', { equipado: true }));
  r = avalia(f);
  assert.deepEqual(avisos(r, 'magia-sem-mistico'), []);
  assert.doesNotMatch(avisos(r, 'magia-sem-foco')[0].msg, /Fagulha|Anteparo/);
  assert.equal(avisos(r, 'focos-demais')[0].msg, '2 Focos equipados (Foco de Destruição, Foco de Abjuração): só se empunha 1 Foco por vez');
  // o Receptáculo Natural do Corrompido dispensa o Foco (D123)
  const c = ficha({ classe: 'espadachim', raca: 'corrompido', pericias: { mistico: 1 } });
  c.entradas.push(entrada('magia', 'magia-fagulha', 'Fagulha'), entrada('corrupcao', 'corrompido-receptaculo-natural', 'Receptáculo Natural'));
  assert.deepEqual(avisos(avalia(c), 'magia-sem-foco'), []);
});

test('carta sem o requisito de atributo, carta no nível 1, item em uso sem o requisito', () => {
  const f = ficha({ attrs: { FOR: 8, DES: 8 } });
  f.entradas.push(entrada('carta', 'limiar-musculos-de-ogro', 'Músculos de Ogro', { posicaoNaMao: 1 }));
  f.inventario.equipamentos.push(item('item-adaga-de-kali', 'Adaga de Kali', { equipado: true }));
  let r = avalia(f);
  assert.equal(avisos(r, 'carta-requisito')[0].msg, 'Músculos de Ogro pede FOR 16+; a ficha tem FOR 8');
  assert.equal(avisos(r, 'carta-no-nivel-1')[0].msg, '1 carta do Limiar no nível 1: o Limiar só dá cartas a partir do nível 2');
  assert.equal(avisos(r, 'item-requisito')[0].msg, 'Adaga de Kali: requisito não atendido (Destreza ≥ 12)');
  // guardada (não equipada): sem aviso
  f.inventario.equipamentos[0].equipado = false;
  f.meta.nivel = 2;
  r = avalia(f);
  assert.deepEqual(avisos(r, 'item-requisito'), []);
  assert.deepEqual(avisos(r, 'carta-no-nivel-1'), []);
});

test('os avisos do inventário (armaduras, sintonia) chegam à lista de Avisos', () => {
  const f = ficha({ attrs: { FOR: 16 } });
  f.inventario.equipamentos.push(item('x-p1', 'Peitoral A', { equipado: true, inv: { armadura: 'Pesada' } }),
    item('x-p2', 'Peitoral B', { equipado: true, inv: { armadura: 'Pesada' } }));
  for (let i = 0; i < 4; i++) f.inventario.bugigangas.push(item('x-anel-' + i, 'Anel ' + i, { sintonizado: true }));
  const l = lista(f);
  assert.ok(l.includes('Inventário: 2 Armaduras Pesadas equipadas; o limite é 1'), JSON.stringify(l));
  assert.ok(l.includes('Inventário: 4 Itens Mágicos sintonizados; o limite é 3'));
});

test('escolha de atributo da raça pendente, nível fora de 1 a 5, cartas com posição inválida, repetida e sem posição', () => {
  const f = ficha({ raca: 'humano' });
  f.meta.nivel = 7;
  f.entradas.push(entrada('carta', 'limiar-alma-resiliente', 'A', { posicaoNaMao: 2, nivelAquisicao: 2 }),
    entrada('carta', 'limiar-alma-resiliente', 'B', { posicaoNaMao: 2, nivelAquisicao: 2 }),
    entrada('carta', 'limiar-alma-resiliente', 'C', { posicaoNaMao: 9 }),
    entrada('carta', 'limiar-alma-resiliente', 'D', { posicaoNaMao: null }),
    entrada('carta', 'limiar-alma-resiliente', 'E', { posicaoNaMao: 2, nivelAquisicao: 3 }));
  const r = avalia(f);
  assert.match(avisos(r, 'escolha-pendente')[0].msg, /^Humano: falta escolher o atributo do bônus \+\d/);
  assert.equal(avisos(r, 'nivel-fora')[0].msg, 'Nível 7 fora de 1 a 5: a ficha conta como nível 5');
  const lim = r.nos['limiar.saldo'].avisos;
  assert.equal(lim.find((a) => a.tipo === 'carta-posicao-invalida').msg, 'posição na mão inválida (vale de 1 a 5): C (9); o saldo não a desconta');
  assert.equal(lim.find((a) => a.tipo === 'carta-posicao-repetida').msg, 'duas cartas na mesma posição da mesma mão: B e A (2ª)');
  assert.equal(lim.find((a) => a.tipo === 'carta-sem-posicao').msg, '1 carta sem posição na mão: o saldo não a desconta');
});

test('corrupção: o motor não avisa o teto (a regra de comparação está com o balanceamento)', () => {
  const f = ficha({ raca: 'corrompido', nivel: 1 });
  ['corrompido-sangue-morto', 'corrompido-vigor-mistico', 'corrompido-sangue-de-eter'].forEach((id) => f.entradas.push(entrada('corrupcao', id)));
  assert.ok(!avalia(f).avisos.some((a) => /corrup|teto/i.test(a.tipo)));
});

// ---------------------------------------------------------------- 4. fora das contas
test('efeito com número no texto que o motor não lê: aviso agregado e lembrete na entrada, sem número inventado', () => {
  const f = ficha({ raca: 'gruto', classe: 'brutalista', variante: 'gruto-rokhan' });
  f.entradas.push(entrada('corrupcao', 'corrompido-sangue-morto', 'Sangue Morto'), entrada('tecnica', 'espadachim-leitura-de-batalha'));
  const sem = ficha({ raca: 'gruto', classe: 'brutalista' });
  const r = avalia(f);
  assert.equal(r.nos['recurso.saude.max'].valor, avalia(sem).nos['recurso.saude.max'].valor, 'o +10 do Rokhan não entra');
  assert.deepEqual(r.foraDasContas.map((x) => [x.id, x.trechos]), [['gruto-rokhan', ['+10 Saúde máxima']],
    ['corrompido-sangue-morto', ['+5 Éter Máximo', '+5 Stamina Máxima']]]);
  assert.equal(avisos(r, 'efeitos-fora-das-contas')[0].msg, '2 efeitos ainda não entram nas contas (aguardando o balanceamento): ' +
    'gruto-rokhan (+10 Saúde máxima); Sangue Morto (+5 Éter Máximo, +5 Stamina Máxima)');
  assert.equal(R.lembreteForaDasContas('gruto-skal-ri'), 'Ainda não entra nas contas: +5 Éter máximo (aguardando o balanceamento)',
    'o Movimento do Skal\'ri já entra (fonte do contrato); o Éter não');
  assert.equal(R.lembreteForaDasContas('limiar-alma-resiliente'), null);
  // a carta rara nunca: o efeito dela é oculto
  const raras = A.lerJSON('data', 'catalogo', 'carta.json').entradas.filter((x) => x.categoria === 'rara').map((x) => x.id);
  assert.ok(raras.length && raras.every((id) => !D.catalogo.foraDasContas[id]));
});

// ---------------------------------------------------------------- 5. textos
test('lembretes com texto (falha automática, não pode rolar, passa sem rolar, pode fabricar sem treino); Exaurido numa linha só', () => {
  const f = ficha({ classe: 'monge' });
  f.condicoes.push({ uid: 'c1', id: 'exaurido', x: null }, { uid: 'c2', id: 'paralisado', x: null }, { uid: 'c3', id: 'invisivel', x: null });
  f.inventario.bugigangas.push(item('item-bigorna-portatil', 'Bigorna Portátil'));
  const r = avalia(f);
  const lb = (c) => r.nos[c].lembretes.map((l) => l.msg);
  assert.ok(lb('pericia.fortitude.total').includes('Paralisado: falha automática'));
  assert.ok(lb('pericia.atacar.total').includes('Exaurido: não pode rolar perícias'));
  assert.ok(lb('pericia.furtividade.total').includes('Invisível: passa sem rolar'));
  assert.ok(lb('pericia.oficio-ferraria.total').some((m) => /^Bigorna Portátil: pode fabricar sem treino/.test(m)));
  assert.ok(!lb('pericia.oficio-ferraria.total').some((m) => /sem treino, não fabrica/.test(m)), 'com a Bigorna, o Ofício(Ferraria) não pede treino');
  assert.ok(lb('pericia.oficio-engenharia.total').includes('sem treino, não fabrica com esta perícia'));
  Object.values(r.nos).forEach((no) => no.lembretes.forEach((l) => assert.ok(l.msg, no.caminho + ': lembrete sem texto ' + l.op)));
  const l = lista(f);
  assert.equal(l.filter((x) => x === 'Exaurido: não pode rolar perícias').length, 1);
  assert.ok(!l.some((x) => /Ofício|fabrica/.test(x)), 'o lembrete do Ofício fica só no tooltip dele');
});

test('avisos de condição com texto; nada de "Motor:", códigos de decisão, "contrato" ou "estado final" no que o jogador lê', () => {
  const f = ficha({ classe: 'espadachim', raca: 'inseto', nivel: 2, attrs: { CON: 12 } });
  f.condicoes.push({ uid: 'c1', id: 'exaustao', x: 6 }, { uid: 'c2', id: 'inexistente', x: null });
  f.recursos.saude.atual = -100; f.recursos.eter.atual = -50; f.recursos.classe = { id: null, nome: 'Fúria', atual: 3 };
  f.resistencias.aeCategoria.ordinario = 1;
  f.ajustes['magia.sumiu.custo'] = { modo: 'fixa', valor: 1, desde: 'x' };
  f.entradas.push(entrada('magia', 'magia-fagulha', 'A', { sustentando: true }), entrada('magia', 'magia-centelha', 'B', { sustentando: true }));
  const r = avalia(f);
  assert.equal(r.avisos.find((a) => a.tipo === 'x-acima-do-maximo').msg, 'Exaustão 6 passa do máximo (5); contado como 5');
  assert.equal(r.avisos.find((a) => a.tipo === 'condicao-desconhecida').msg, 'condição "inexistente" fora das regras: não entra nas contas');
  assert.equal(r.avisos.find((a) => a.tipo === 'raca-sem-subespecie').msg,
    'Inseto: os atributos variam por subespécie, e a ficha não tem uma: escolha Besouro, Louva-a-Deus ou Barata');
  const l = lista(f);
  assert.ok(l.length > 8);
  l.forEach((x) => assert.doesNotMatch(x, /^Motor: |\b[DLP]\d{1,3}\b|contrato|estado final|nada é aplicado|entra sozinha|grampo|Mistico|Reacao|Maxima|Concentracao/, x));
  assert.ok(l.some((x) => /Saúde atual −100 abaixo de −\d+ \(−⌊Saúde máx\. \/ 2⌋\): o personagem morre \(o mestre decide\)/.test(x)), JSON.stringify(l));
  // o termo de Força/Primordial sem a menção ao CLAUDE.md
  const t = r.nos['defesa.forca'].termos.find((x) => x.rotulo === 'Ae de categoria');
  assert.equal(t.motivo, 'Força fica em "Outros", sem Ae de categoria');
});

test('efeitos de item indisponíveis: uma linha só; o selo do Batedor diz o que pode mudar', () => {
  const f = ficha({ classe: 'batedor' });
  f.inventario.bugigangas.push(item('item-bigorna-portatil', 'Bigorna'));
  const l = P.listaAvisos({ estado: 'ok', ficha: f, av: R.avaliar(f, { efeitos: null }), avisosMigracao: [], semEfeitos: true });
  assert.equal(l.filter((x) => /Efeitos de item indisponíveis/.test(x)).length, 1);
  const no = R.avaliar(f).nos['recurso.classe.max'];
  assert.ok(no.selos.includes('avisoClasse'));
  assert.equal(no.notaSelo.avisoClasse, 'o Instinto está em revisão: o máximo (5) e o zeramento podem mudar');
  const C = require('../../js/ficha/kh-conta.js').criar({ D, nos: { 'recurso.classe.max': no }, prefixo: 'kf3' });
  const h = C.conta('recurso.classe.max');
  assert.match(h, /title="classe em rework: o Instinto está em revisão: o máximo \(5\) e o zeramento podem mudar"/);
});
