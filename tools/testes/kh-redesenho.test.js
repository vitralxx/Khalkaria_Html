'use strict';
// A dica da conta dentro da caixa (js/ficha/kh-redesenho.js; correção 2 da
// docs/ficha-digital/07-f4-6-ensaio.md §0): o lado escolhido pelos limites da
// CAIXA (a parte dela à vista), a altura máxima quando nenhum lado cabe, e a
// dica fora do fluxo (position: fixed) quando a caixa recorta pelo overflow,
// como a rolagem do drawer. A prova no navegador (todas as contas das 5 abas,
// no drawer e na página, a 1366x768 e 1920x1080) é a
// tools/testes/navegador/dicas-conta.js.
const test = require('node:test');
const assert = require('node:assert/strict');
const DOM = require('./dom-mini.js');
const R = require('../../js/ficha/kh-redesenho.js');

const M = R.MARGEM_DICA;

test('planoDica: embaixo se cabe; senão em cima se cabe; senão o lado com mais espaço, com altura máxima', () => {
  const lim = { min: 994, max: 1347, topo: 152, base: 760 };
  const conta = (top) => ({ left: 1100, right: 1120, top, bottom: top + 18, width: 20, height: 18 });
  const dica = (h, left) => ({ left: left == null ? 960 : left, right: (left == null ? 960 : left) + 300, width: 300, height: h });
  // cabe embaixo
  let p = R.planoDica(conta(200), dica(200), lim, 5);
  assert.equal(p.acima, false);
  assert.equal(p.maxAltura, null);
  assert.equal(p.y, 223);
  // não cabe embaixo, cabe em cima
  p = R.planoDica(conta(700), dica(200), lim, 5);
  assert.equal(p.acima, true);
  assert.equal(p.y, 700 - 5 - 200);
  // o caso do drawer: a janela deixava abrir para cima (139 px), mas a rolagem começa em 144
  p = R.planoDica(conta(445), dica(300), lim, 5);
  const abaixo = 760 - (463 + 5), acima = (445 - 5) - 152;
  assert.ok(300 > abaixo && 300 > acima, 'não cabe em nenhum lado');
  assert.equal(p.acima, abaixo < acima);
  assert.equal(p.maxAltura, Math.floor(Math.max(abaixo, acima)));
  assert.ok(p.y >= lim.topo && p.y + p.maxAltura <= lim.base, 'dentro da caixa: ' + JSON.stringify(p));
  // em cima tem mais espaço
  p = R.planoDica(conta(520), dica(400), lim, 5);
  assert.equal(p.acima, true);
  assert.equal(p.maxAltura, 520 - 5 - 152);
  assert.equal(p.y, 152);
  // horizontal: empurrada para dentro (x já com o deslocamento)
  p = R.planoDica(conta(200), dica(100, 1200), lim, 5);
  assert.equal(p.dx, 1347 - 1500);
  assert.equal(p.x, 1347 - 300);
  // a conta rolou para fora da área à vista: a dica fica dentro dela
  p = R.planoDica(conta(60), dica(100), lim, 5);
  assert.ok(p.y >= lim.topo);
  p = R.planoDica(conta(900), dica(100), lim, 5);
  assert.ok(p.y + 100 <= lim.base);
  // vão inválido: o padrão
  assert.equal(R.planoDica(conta(200), dica(100), lim, NaN).y, 218 + 6);
  // fora do fluxo, com a janela: só quando a caixa não tem lugar; aí, inteira se a janela tiver
  const jan = { topo: M, base: 768 - M };
  p = R.planoDica(conta(200), dica(200), lim, 5, jan);
  assert.equal(p.janela, false, 'cabe na caixa: a caixa');
  assert.equal(p.y, 223);
  p = R.planoDica(conta(445), dica(300), lim, 5, jan);
  assert.equal(p.janela, true);
  assert.equal(p.maxAltura, null, 'inteira');
  assert.equal(p.acima, true);
  assert.equal(p.y, 445 - 5 - 300);
  p = R.planoDica(conta(445), dica(900), lim, 5, jan);
  assert.equal(p.maxAltura, 445 - 5 - M, 'nem a janela: altura máxima, no lado maior');
});

test('limites: a caixa de padding (sem a barra de rolagem), cortada pela janela (sem a barra da página), com a margem', () => {
  const win = { document: { documentElement: { clientWidth: 1351, clientHeight: 768 } }, innerWidth: 1366, innerHeight: 768 };
  const rolagem = { getBoundingClientRect: () => ({ left: 986, right: 1366, top: 144, bottom: 900 }), clientLeft: 0, clientTop: 0, clientWidth: 369, clientHeight: 756 };
  assert.deepEqual(R.limites(rolagem, win), { min: 986 + M, max: 1351 - M, topo: 144 + M, base: 768 - M });
  const estreita = { getBoundingClientRect: () => ({ left: 986, right: 1366, top: 144, bottom: 700 }), clientLeft: 1, clientTop: 0, clientWidth: 360, clientHeight: 556 };
  assert.deepEqual(R.limites(estreita, win), { min: 987 + M, max: 1347 - M, topo: 144 + M, base: 700 - M });
  // sem as medidas de cliente: o retângulo; sem janela: só a caixa
  const nua = { getBoundingClientRect: () => ({ left: 280, right: 1316, top: -500, bottom: 4000 }) };
  assert.deepEqual(R.limites(nua, { innerHeight: 768 }), { min: 280 + M, max: 1316 - M, topo: M, base: 768 - M });
  assert.deepEqual(R.limites(nua, null), { min: 280 + M, max: 1316 - M, topo: M, base: 4000 - M });
});

// ---------------------------------------------------------------- o drawer e a página, com geometria falsa
// win com getComputedStyle pelo .ov de cada elemento ('auto' = rola)
function janela(W, H) {
  return { document: { documentElement: { clientWidth: W, clientHeight: H } }, innerWidth: W, innerHeight: H,
    getComputedStyle: (el) => ({ overflowX: el.ov || 'visible', overflowY: el.ov || 'visible' }) };
}
// a dica mede pelo estilo inline (como o navegador): fora do fluxo, pelo left/top;
// no fluxo, centrada sob a conta com o --<p>-dx, embaixo ou (data-dica-acima) em cima
function geometria(conta, dica, larg, alto, prefixo, vao) {
  vao = vao == null ? 5 : vao;
  dica.aberta = true;
  dica.getBoundingClientRect = () => {
    if (!dica.aberta) return { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
    const st = (k) => dica.style.getPropertyValue(k);
    const mw = parseFloat(st('max-width')) || Infinity, mh = parseFloat(st('max-height')) || Infinity;
    const w = st('width') ? parseFloat(st('width')) : Math.min(larg, mw);
    const h = Math.min(alto, mh);
    const rc = conta.getBoundingClientRect();
    if (st('position') === 'fixed') {
      const l = parseFloat(st('left')), t = parseFloat(st('top'));
      return { left: l, top: t, right: l + w, bottom: t + h, width: w, height: h };
    }
    const l = rc.left + rc.width / 2 - w / 2 + (parseFloat(st('--' + prefixo + '-dx')) || 0);
    const t = conta.hasAttribute('data-dica-acima') ? rc.top - vao - h : rc.bottom + vao;
    return { left: l, right: l + w, top: t, bottom: t + h, width: w, height: h };
  };
}
// o drawer a 1366x768: a rolagem (overflow auto) de 986 a 1366 (barra de 11 px), de 144 ao pé
function cenaDrawer() {
  const doc = DOM.documento();
  const rol = doc.createElement('div');
  rol.id = 'fd-gaveta-rolagem';
  rol.ov = 'auto';
  rol.rect = { left: 986, right: 1366, top: 144, bottom: 768, width: 380, height: 624 };
  Object.assign(rol, { clientLeft: 0, clientTop: 0, clientWidth: 369, clientHeight: 624 });
  rol.innerHTML = '<section class="fd-gaveta-painel"><span class="kh-conta fd-conta" tabindex="0" data-caminho="a">' +
    '<b class="fd-v">1</b><span class="kh-conta-dica fd-dica" role="tooltip">x</span></span>' +
    '<span class="kh-conta fd-conta" tabindex="0" data-caminho="b"><b class="fd-v">2</b><span class="kh-conta-dica fd-dica" role="tooltip">y</span></span></section>';
  doc.body.appendChild(rol);
  const [c1, c2] = rol.querySelectorAll('.kh-conta');
  const poe = (c, cx, top) => { c.rect = { left: cx - 10, right: cx + 10, top, bottom: top + 18, width: 20, height: 18 }; };
  return { doc, rol, c1, c2, d1: c1.querySelector('.kh-conta-dica'), d2: c2.querySelector('.kh-conta-dica'), poe, win: janela(1366, 768) };
}
function dentro(r, lim) {
  return r.left >= lim.min - 0.5 && r.right <= lim.max + 0.5 && r.top >= lim.topo - 0.5 && r.bottom <= lim.base + 0.5;
}

test('recorta: a rolagem do drawer recorta; a página (#fp, overflow visível) não; o que está acima da caixa não conta', () => {
  const s = cenaDrawer();
  assert.equal(R.recorta(s.c1, s.rol, s.win), true);
  s.rol.ov = 'visible';
  assert.equal(R.recorta(s.c1, s.rol, s.win), false);
  s.doc.body.ov = 'hidden';   // acima da caixa
  assert.equal(R.recorta(s.c1, s.rol, s.win), false);
  s.c1.querySelector('.fd-v').pai.ov = 'hidden';   // a própria conta
  assert.equal(R.recorta(s.c1, s.rol, s.win), true);
  assert.equal(R.recorta(s.c1, s.rol, { innerHeight: 768 }), false, 'sem getComputedStyle (node): no fluxo');
});

test('encaixa no drawer: fora do fluxo (position fixed), dentro da rolagem e da janela, sem a barra de rolagem', () => {
  const s = cenaDrawer();
  const E = R.criar({ prefixo: 'fd' });
  const lim = R.limites(s.rol, s.win);
  // o caso relatado: conta no meio, dica alta, que não cabe na rolagem em nenhum
  // lado. Antes, a janela a abria para cima e a rolagem cortava o topo; agora ela
  // sai do fluxo e usa a altura da janela: inteira, por cima do cabeçalho
  s.poe(s.c1, 1150, 445);
  geometria(s.c1, s.d1, 300, 300, 'fd');
  assert.equal(E.encaixa(s.c1, s.rol, s.win), true);
  assert.ok(s.c1.hasAttribute(E.MARCA_FIXA), 'data-dica-fixa');
  assert.equal(s.d1.style.getPropertyValue('position'), 'fixed');
  assert.equal(s.d1.style.getPropertyValue('transform'), 'none');
  assert.equal(s.d1.style.getPropertyValue('right'), 'auto');
  let r = s.d1.getBoundingClientRect();
  assert.equal(s.d1.style.getPropertyValue('max-height'), '', 'inteira');
  assert.equal(r.height, 300);
  assert.ok(r.top >= M && r.bottom <= 768 - M && r.left >= lim.min && r.right <= lim.max, 'dentro da janela e na largura da caixa: ' + JSON.stringify(r));
  // nem a janela tem lugar (janela baixa): o lado com mais espaço, com altura máxima
  const baixa = janela(1366, 520);
  s.rol.rect = { left: 986, right: 1366, top: 144, bottom: 520, width: 380, height: 376 };
  s.rol.clientHeight = 376;
  s.poe(s.c1, 1150, 300);
  geometria(s.c1, s.d1, 300, 400, 'fd');
  E.encaixa(s.c1, s.rol, baixa);
  r = s.d1.getBoundingClientRect();
  assert.ok(s.d1.style.getPropertyValue('max-height'), 'altura máxima');
  assert.ok(r.top >= M - 0.5 && r.bottom <= 520 - M + 0.5, JSON.stringify(r));
  s.rol.rect = { left: 986, right: 1366, top: 144, bottom: 768, width: 380, height: 624 };
  s.rol.clientHeight = 624;
  // perto do pé: em cima, inteira
  s.poe(s.c1, 1150, 700);
  geometria(s.c1, s.d1, 300, 200, 'fd');
  E.encaixa(s.c1, s.rol, s.win);
  r = s.d1.getBoundingClientRect();
  assert.ok(s.c1.hasAttribute('data-dica-acima'));
  assert.equal(s.d1.style.getPropertyValue('max-height'), '', 'reabrir limpa a altura máxima');
  assert.equal(r.height, 200);
  assert.ok(dentro(r, lim) && r.bottom <= 700, JSON.stringify(r));
  // no topo da rolagem: embaixo
  s.poe(s.c1, 1150, 150);
  E.encaixa(s.c1, s.rol, s.win);
  r = s.d1.getBoundingClientRect();
  assert.equal(s.c1.hasAttribute('data-dica-acima'), false);
  assert.ok(dentro(r, lim) && r.top >= 168, JSON.stringify(r));
  // na borda direita: a dica não entra na barra de rolagem (antes passava 2,5 px)
  s.poe(s.c1, 1352, 300);
  geometria(s.c1, s.d1, 336, 120, 'fd');
  E.encaixa(s.c1, s.rol, s.win);
  r = s.d1.getBoundingClientRect();
  assert.ok(r.right <= 986 + 369 - M + 0.5, 'antes da barra: ' + r.right);
  assert.ok(r.left >= 986 + M - 0.5);
  // mais larga que a caixa: a largura máxima é a dela
  geometria(s.c1, s.d1, 500, 120, 'fd');
  E.encaixa(s.c1, s.rol, s.win);
  assert.equal(s.d1.style.getPropertyValue('max-width'), Math.floor(lim.max - lim.min) + 'px');
  assert.ok(dentro(s.d1.getBoundingClientRect(), lim));
  // fechada: não mede nem grava
  geometria(s.c2, s.d2, 300, 100, 'fd');
  s.d2.aberta = false;
  s.poe(s.c2, 1100, 300);
  assert.equal(E.encaixa(s.c2, s.rol, s.win), false);
  ['position', 'left', 'top', 'max-height', '--fd-dx'].forEach((k) => assert.equal(s.d2.style.getPropertyValue(k), '', k));
  assert.equal(s.c2.hasAttribute(E.MARCA_FIXA), false);
});

test('reencaixa: depois de a rolagem andar, a dica aberta fora do fluxo segue a conta; a fechada volta ao CSS', () => {
  const s = cenaDrawer();
  const E = R.criar({ prefixo: 'fd' });
  s.poe(s.c1, 1150, 300);
  geometria(s.c1, s.d1, 300, 120, 'fd');
  s.poe(s.c2, 1100, 400);
  geometria(s.c2, s.d2, 300, 120, 'fd');
  E.encaixa(s.c1, s.rol, s.win);
  E.encaixa(s.c2, s.rol, s.win);
  const antes = s.d1.getBoundingClientRect().top;
  // a rolagem anda 100 px; a 2ª dica fechou (o mouse saiu)
  s.poe(s.c1, 1150, 200);
  s.d2.aberta = false;
  assert.equal(E.reencaixa(s.rol, s.win), 1);
  assert.equal(s.d1.getBoundingClientRect().top, antes - 100);
  assert.equal(s.c2.hasAttribute(E.MARCA_FIXA), false);
  assert.equal(s.d2.style.getPropertyValue('position'), '');
  assert.equal(E.reencaixa(null, s.win), 0);
});

test('encaixa na página (#fp, sem recorte): no fluxo (--fp-dx e data-dica-acima), e o lado pelos limites da caixa à vista', () => {
  const doc = DOM.documento();
  const fp = doc.createElement('div');
  fp.id = 'fp';
  fp.rect = { left: 280, right: 1316, top: -300, bottom: 500, width: 1036, height: 800 };   // a página acaba antes do pé da janela
  fp.innerHTML = '<span class="kh-conta fp-conta" tabindex="0"><b class="fp-v">1</b><span class="kh-conta-dica fp-dica" role="tooltip">x</span></span>';
  doc.body.appendChild(fp);
  const c = fp.querySelector('.kh-conta'), d = c.querySelector('.kh-conta-dica');
  const win = janela(1366, 768);
  const E = R.criar({ prefixo: 'fp' });
  c.rect = { left: 1290, right: 1310, top: 380, bottom: 398, width: 20, height: 18 };
  geometria(c, d, 416, 150, 'fp', 6);
  assert.equal(E.encaixa(c, fp, win), true);
  assert.equal(d.style.getPropertyValue('position'), '', 'no fluxo: nada a recorta');
  assert.equal(c.hasAttribute(E.MARCA_FIXA), false);
  // embaixo passaria do fim da caixa (500), mesmo cabendo na janela (768): em cima
  assert.equal(c.hasAttribute('data-dica-acima'), true);
  const r = d.getBoundingClientRect();
  assert.ok(dentro(r, R.limites(fp, win)), JSON.stringify(r));
  assert.equal(d.style.getPropertyValue('--fp-dx'), String(Math.round(1316 - M - (1300 + 208))) + 'px');
});
