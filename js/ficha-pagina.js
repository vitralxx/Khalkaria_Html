/* Khalkaria — página da ficha nova (F4.3, pages/ficha.html), SOMENTE LEITURA.
 *
 * Espelha a ficha física A4 em 5 abas (docs/ficha-digital/05-f4-pagina.md,
 * 03 §4). Lê a ficha v2 (khalkaria_ficha) pelo KhEstado.sombra e calcula pelo
 * motor v3, pelo mesmo caminho da prévia: KhPrevia.carregar (catálogo, classes,
 * raças, efeitos, glifos) e KhPrevia.calcular (sombra -> avaliar). Cada número
 * calculado sai com a conta (KhConta, prefixo 'fp', para não colidir com os ids
 * kf3- da prévia, que pode estar aberta na mesma página). Número que é ESTADO
 * da ficha (atual de recurso, Sins, XP, quantidade…) não é conta: vai num
 * span.fp-n[data-ficha="<caminho na ficha v3>"].
 *
 * Escondida até a virada (03 §9): sem a prévia (localStorage
 * khalkaria_ficha_previa === '1' ou ?ficha=v3, a mesma regra do
 * partials/head-boot.html), mostra só o AVISO e não pede catálogo nenhum.
 * Não grava NENHUMA chave de ficha: as únicas escritas desta página são as
 * preferências de aba da F4.5, pelo KhAbas: a ordem (localStorage
 * khalkaria_ficha_abas, só quando o jogador move uma aba) e a aba aberta
 * (sessionStorage khalkaria_ficha_aba, só quando ele troca de aba).
 *
 * F4.3a: topo (seletor de ficha desabilitado, nome, raça, classe, nível,
 * origem e o aviso de só-leitura com o botão que abre a ficha atual pela
 * KF.abrir()), a lista das 5 abas (role=tablist) e os 5 painéis.
 * F4.5: a lista é do KhAbas (js/ficha/kh-abas.js, no bundle, porque o drawer
 * da F4.4 usa o mesmo): clique, setas, Home e End trocam de aba (tabindex
 * móvel); Alt+← e Alt+→ (KhTeclas, só com a aba focada pelo teclado) e o
 * arrasto movem a aba; o botão "Ordem do
 * A4" restaura. A casca já sai na ordem guardada e com a aba da sessão aberta.
 * F4.3b: RENDER[id da aba](res, C, ctx) desenha o painel (res =
 * KhPrevia.calcular, estado 'ok'; C = KhConta desta passada; ctx = catálogo
 * indexado, classes, ramos, dados das regras e a base dos ícones). Cada campo
 * da ficha física leva data-campo (o teste confere por conjunto contra o 03 §4).
 *   1 Núcleo · 2 Técnicas & Marcas · 3 Cartas, Lore & Outros · 4 O Bazar · 5 Grimório
 * Redesenho (kf:mudou, drawer, storage) por trocaHTML: só troca o contêiner que
 * mudou e devolve foco, <details> aberto e dica sob o mouse ao equivalente novo.
 * A dica da conta é presa à caixa da página por encaixa() ao abrir (hover/foco).
 * Os avisos são os da prévia (KhPrevia.listaAvisos, fonte única).
 *
 * Cartas raras: só ícone, requisito e nome, NUNCA o efeito (D11, D33; nem o
 * texto que a v2 tenha guardado). Técnica sem par no catálogo: o texto salvo e
 * a marca "órfã". Recurso de classe que não é contador (D105): as características.
 *
 * No node (tools/testes/ficha-pagina.test.js) exporta por module.exports e
 * carrega os módulos de js/ficha/ direto; no navegador usa os do js/ficha.js,
 * carregado antes, síncrono (templates/ficha.template.html).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  var KhPrevia = emNode ? require('./ficha/kh-previa.js') : raiz.KhPrevia;
  var KhRegras = emNode ? require('./ficha/kh-regras.js') : raiz.KhRegras;
  var KhConta = emNode ? require('./ficha/kh-conta.js') : raiz.KhConta;
  var KhEstado = emNode ? require('./ficha/kh-estado.js') : raiz.KhEstado;
  var KhInv = emNode ? require('./ficha/kh-inv.js') : raiz.KhInv;
  var KhAbas = emNode ? require('./ficha/kh-abas.js') : raiz.KhAbas;

  var FichaPagina = (function () {
    var CHAVE_PREVIA = 'khalkaria_ficha_previa';
    var CHAVE_V2 = 'khalkaria_ficha';
    var PREFIXO = 'fp';
    // o mesmo texto do templates/ficha.template.html (o teste confere)
    var AVISO = 'A ficha nova está em preparação. Por enquanto, use a ficha atual, no botão FICHA da lateral.';
    var AVISO_RO = 'Ficha nova em prévia: só leitura. Para editar, use a ficha atual (FICHA).';
    var CARREGANDO = 'Carregando a ficha…';
    var EM_CONSTRUCAO = 'Esta aba ainda está em construção.';
    var RESTAURADA = 'Ordem do A4 restaurada.';
    // como mudar a ordem: dica no botão de cada aba (title vira a descrição acessível)
    // o Alt+seta só move com a aba focada pelo teclado (depois de um clique, o
    // Alt+← é o Voltar do navegador): a dica diz como chegar lá
    var DICA_ORDEM = 'Arraste para mudar a ordem das abas. Pelo teclado: Tab até a aba e Alt+← ou Alt+→';
    var TITULO_A4 = 'Ordem do A4: volta as abas à ordem da ficha física';
    // seta de voltar (traço em currentColor, sem emoji)
    var SVG_A4 = '<svg class="fp-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M5.6 9.2A7.4 7.4 0 1 1 4.6 13.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
      '<path d="M4.4 4.6v4.8h4.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    // As 5 abas, na ordem da ficha física (pág. 1 a 5 do A4). O id é estável:
    // a F4.5 guarda a ordem por id (khalkaria_ficha_abas), e o drawer da F4.4 usa os mesmos.
    var ABAS = [
      { id: 'nucleo', pag: 1, rotulo: 'Núcleo' },
      { id: 'tecnicas', pag: 2, rotulo: 'Técnicas & Marcas' },
      { id: 'cartas', pag: 3, rotulo: 'Cartas, Lore & Outros' },
      { id: 'bazar', pag: 4, rotulo: 'O Bazar' },
      { id: 'grimorio', pag: 5, rotulo: 'Grimório' }
    ];
    // um desenhista por aba (F4.3b, abaixo)
    var RENDER = {};

    // ---------------- vocabulário da página ----------------
    // [sigla, nome, ícone em images/ficha/]
    var ATRIBUTOS = [['FOR', 'Força', 'forca'], ['DES', 'Destreza', 'destreza'], ['CON', 'Constituição', 'constituicao'],
      ['INT', 'Inteligência', 'inteligencia'], ['SAB', 'Sabedoria', 'sabedoria']];
    var NOME_ATRIBUTO = { FOR: 'Força', DES: 'Destreza', CON: 'Constituição', INT: 'Inteligência', SAB: 'Sabedoria' };
    // os 14 tipos de dano (D63/D67), na ordem da tabela do Sistema
    var TIPOS = [['cortante', 'Cortante'], ['contundente', 'Contundente'], ['perfurante', 'Perfurante'],
      ['fogo', 'Fogo'], ['frio', 'Frio'], ['eletrico', 'Elétrico'], ['veneno', 'Veneno'], ['acido', 'Ácido'],
      ['psiquico', 'Psíquico'], ['radiante', 'Radiante'], ['trovejante', 'Trovejante'], ['necrotico', 'Necrótico'],
      ['forca', 'Força'], ['primordial', 'Primordial']];
    var NOME_CATEGORIA = { ordinario: 'Ordinário', elemental: 'Elemental', biologico: 'Biológico', mistico: 'Místico', outros: 'Outros' };
    var ESCOLAS = { destruicao: 'Destruição', abjuracao: 'Abjuração', alteracao: 'Alteração', conhecimento: 'Conhecimento', primordial: 'Primordial' };
    var RARIDADES = [['Lixo', 'lixo'], ['Ordinário', 'ordinario'], ['Incomum', 'incomum'], ['Exótico', 'exotico'], ['Luxária', 'luxaria']];
    // categoria da carta do Limiar (data/catalogo/carta.json) -> ícone de atributo e nome
    var CARTA_ICONE = { forca: 'forca', destreza: 'destreza', con: 'constituicao', int: 'inteligencia', sab: 'sabedoria' };
    var CARTA_CATEGORIA = { universal: 'Universal', forca: 'Força', destreza: 'Destreza', con: 'Constituição',
      int: 'Inteligência', sab: 'Sabedoria', rara: 'Rara' };
    // molduras da ficha física (03 §4): o mínimo desenhado, nunca um limite
    var MOLDURAS = { gerais: 9, diversas: 9, cartas: 11, pesados: 2, leves: 3, armas: 3, tiers: { 1: 3, 2: 2, 3: 1 }, marcas: 3 };
    var NOME_DIVERSA = { traco: 'Traço', variante: 'Variante', subespecie: 'Subespécie', tecnologia: 'Tecnologia',
      corrupcao: 'Corrupção', origem: 'Origem' };
    var ESTADO_CARGA = { nenhuma: 'sem Sobrepeso', leve: 'Sobrepeso Leve', extremo: 'Sobrepeso Extremo' };
    // ícones que não são do A4: traço em currentColor, sem emoji
    var SVG_RARA = '<svg class="fp-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.2l2.5 5.6 6.1.6-4.6 4.1 1.3 6-5.3-3.1-5.3 3.1 1.3-6-4.6-4.1 6.1-.6Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="12" cy="12.6" r="1.4" fill="currentColor"/></svg>';
    var SVG_UNIVERSAL = '<svg class="fp-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3.8 12h16.4M12 3.8c2.4 2.4 3.4 5.2 3.4 8.2s-1 5.8-3.4 8.2M12 3.8C9.6 6.2 8.6 9 8.6 12s1 5.8 3.4 8.2" fill="none" stroke="currentColor" stroke-width="1" opacity=".7"/></svg>';
    var SVG_ACOES = '<svg class="fp-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.4v3.2M12 17.4v3.2M3.4 12h3.2M17.4 12h3.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="12" cy="12" r="5.2" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>';
    // moldura gótica: o canto de raízes do sprite partials/glifos.html, girado pelo CSS
    var CANTOS = ['te', 'td', 'be', 'bd'].map(function (p) {
      return '<svg class="fp-canto fp-canto-' + p + '" aria-hidden="true" focusable="false"><use href="#g-moldura-raizes-canto"/></svg>';
    }).join('');

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function esc(s) {
      return str(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
    function semEmoji(s) { return KhConta ? KhConta.semEmoji(s) : str(s); }
    function norm(s) {
      return KhEstado && KhEstado.normaliza ? KhEstado.normaliza(semEmoji(s))
        : semEmoji(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    }
    function fmt(n) { return KhRegras && KhRegras.fmt ? KhRegras.fmt(n) : str(n); }
    // texto do catálogo: sem emoji, escapado; só <em>/<strong>/<b>/<i> sobrevivem (os dados os usam)
    function textoRico(s) {
      var t = semEmoji(s).replace(/<\/?[a-z][a-z0-9]*\b[^>]*>/gi, function (tag) {
        return /^<\/?(em|strong|b|i)>$/i.test(tag) ? tag : ' ';
      });
      return esc(t).replace(/&lt;(\/?)(em|strong|b|i)&gt;/gi, '<$1$2>').replace(/\s{2,}/g, ' ').trim();
    }
    // tira do texto o custo que o catálogo repete no começo ("Passiva Você…")
    function semPrefixo(texto, prefixo) {
      texto = str(texto); prefixo = semEmoji(prefixo);
      if (!prefixo) return texto;
      var partes = prefixo.split(/[\s·•]+/).filter(Boolean).map(function (p) { return p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); });
      if (!partes.length) return texto;
      return texto.replace(new RegExp('^\\s*' + partes.join('[\\s·•]+') + '[\\s·•:—-]*'), '');
    }
    function modTxt(no) {
      if (!no || typeof no.valor !== 'number') return null;
      return no.valor < 0 ? '−' + fmt(-no.valor) : '+' + fmt(no.valor);
    }
    // número de ESTADO (não calculado): o caminho na ficha v3 vai no data-ficha
    function nEstado(caminho, v, un) {
      return '<span class="fp-n" data-ficha="' + esc(caminho) + '">' + esc(v == null || v === '' ? '—' : fmt(v)) + esc(un || '') + '</span>';
    }
    function vazio() { return '<span class="fp-vazio">—</span>'; }

    // ---------------- ativação (a mesma regra do partials/head-boot.html) ----------------
    function ativa(search, ls) {
      try { if (ls && ls.getItem(CHAVE_PREVIA) === '1') return true; } catch (e) { /* storage bloqueado: vale a URL */ }
      try {
        var m = /[?&]ficha=([^&#]*)/.exec(str(search));
        return !!m && decodeURIComponent(m[1]) === 'v3';
      } catch (e) { return false; }
    }

    // ---------------- ordem das abas (F4.5): a do navegador, pelo KhAbas ----------------
    function idsAbas() { return ABAS.map(function (a) { return a.id; }); }
    function abaPorId(id) { return ABAS.filter(function (a) { return a.id === id; })[0]; }
    // as ABAS na ordem guardada neste navegador (ls = localStorage); sem storage
    // ou sem preferência, a do A4
    function ordemAbas(ls) {
      var ids = idsAbas();
      return (KhAbas && ls ? KhAbas.lerOrdem(ls, ids) : ids).map(abaPorId);
    }

    // ---------------- html (puro: string) ----------------
    function htmlAviso() {
      return '<h1 class="fp-titulo">Ficha</h1><p class="fp-aviso" data-sem-previa>' + esc(AVISO) + '</p>';
    }

    // a casca: topo (preenchido por htmlTopo), lista de abas (na ordem dada, uma
    // lista de ids; sem ela, a do A4) com o "Ordem do A4", painéis e o sprite g-*
    function htmlCasca(aberta, ordem) {
      var ids = idsAbas();
      var o = KhAbas ? KhAbas.normaliza(ordem, ids) : ids;
      var abas = o.map(abaPorId);
      var padrao = o.join(' ') === ids.join(' ');
      aberta = abas.some(function (a) { return a.id === aberta; }) ? aberta : abas[0].id;
      return '<header class="fp-topo" id="fp-topo">' + htmlTopo(null) + '</header>' +
        '<div class="fp-abas-barra">' +
        '<div class="fp-abas" id="fp-abas" role="tablist" aria-label="Partes da ficha">' +
        abas.map(function (a) {
          var on = a.id === aberta;
          return '<button type="button" class="fp-aba" role="tab" id="fp-aba-' + a.id + '" data-aba="' + a.id + '"' +
            ' aria-controls="fp-painel-' + a.id + '" aria-selected="' + on + '" tabindex="' + (on ? '0' : '-1') + '"' +
            ' aria-keyshortcuts="Alt+ArrowLeft Alt+ArrowRight" title="' + esc(DICA_ORDEM) + '">' +
            '<span class="fp-aba-pag" aria-hidden="true">' + a.pag + '</span>' + esc(a.rotulo) + '</button>';
        }).join('') + '</div>' +
        // "Ordem do A4": só com a ordem fora da do A4 (o KhAbas mostra e esconde).
        // Botão de ícone, com o nome no aria-label e no title: com texto, ele
        // tomava a largura da lista e, a 1280px, a última aba descia de linha.
        '<button type="button" class="kh-btn fp-abas-a4" id="fp-abas-a4"' + (padrao ? ' hidden' : '') +
        ' aria-label="Ordem do A4" title="' + esc(TITULO_A4) + '">' + SVG_A4 + '</button>' +
        // o que mudou de lugar, para o leitor de tela
        '<span class="fp-sr" id="fp-abas-anuncio" role="status" aria-live="polite"></span>' +
        '</div>' +
        abas.map(function (a) {
          return '<section class="fp-painel" role="tabpanel" id="fp-painel-' + a.id + '" data-aba="' + a.id + '"' +
            ' aria-labelledby="fp-aba-' + a.id + '" tabindex="0" aria-busy="true"' + (a.id === aberta ? '' : ' hidden') + '>' +
            '<p class="fp-nota">' + esc(CARREGANDO) + '</p></section>';
        }).join('') +
        // o sprite partials/glifos.html (moldura de raízes, ramos, selo), posto ao carregar
        '<div class="fp-sprite" id="fp-sprite" aria-hidden="true"></div>';
    }

    function mensagemEstado(res) {
      if (!res) return '';
      if (res.estado === 'sem-ficha') return 'Não há ficha neste navegador. Crie ou importe uma na ficha atual (FICHA) e ela aparece aqui.';
      if (res.estado === 'erro') return 'A ficha deste navegador não pôde ser lida (' + str(res.erro) + (res.versao ? ' ' + str(res.versao) : '') + ').';
      if (res.estado === 'falha') return 'O motor falhou ao calcular: ' + str(res.erro);
      if (res.estado === 'sem-motor') return 'O motor da ficha (js/ficha.js) não carregou. Recarregue a página.';
      return '';
    }

    function refNome(r) { return obj(r) && (r.id || r.nome) ? semEmoji(r.nome) || str(r.id) : ''; }

    // topo; res null = carregando
    function htmlTopo(res) {
      var ok = !!res && res.estado === 'ok';
      var f = ok ? res.ficha : null;
      var meta = f && obj(f.meta) ? f.meta : {};
      var idt = f && obj(f.identidade) ? f.identidade : {};
      var nome = ok ? (semEmoji(meta.nome) || '(sem nome)') : !res ? CARREGANDO : res.estado === 'sem-ficha' ? '(sem ficha)' : 'Ficha';
      function campo(rot, val) {
        return '<div class="fp-campo"><dt>' + esc(rot) + '</dt><dd>' + (val ? esc(val) : '<span class="fp-vazio">—</span>') + '</dd></div>';
      }
      var h = '<div class="fp-topo-linha">' +
        // seletor de ficha (D36): desabilitado até a virada, só com a ficha atual
        '<label class="fp-seletor"><span class="fp-rot">Ficha</span>' +
        '<select disabled title="Trocar de ficha chega com a virada da ficha nova">' +
        '<option selected>' + esc(ok ? nome + ' (ficha atual)' : 'Ficha atual') + '</option></select></label>' +
        '<p class="fp-ro" role="note"><span>' + esc(AVISO_RO) + '</span> ' +
        '<button type="button" class="kh-btn fp-abrir-v2">Abrir a ficha atual</button> ' +
        '<button type="button" class="kh-btn fp-sair-previa">Sair da prévia</button></p></div>' +
        '<h1 class="fp-nome">' + esc(nome) + '</h1>';
      if (ok) {
        h += '<dl class="fp-ident">' +
          campo('Raça', refNome(idt.raca)) + campo('Classe', refNome(idt.classe)) +
          campo('Nível', meta.nivel == null ? '' : str(meta.nivel)) + campo('Origem', refNome(idt.origem)) + '</dl>';
      }
      var msg = mensagemEstado(res);
      if (msg) h += '<p class="fp-estado" role="status">' + esc(msg) + '</p>';
      var erros = res ? lista(res.erros) : [];
      if (erros.length) h += '<p class="fp-estado fp-estado-aviso">Não carregou: ' + erros.map(esc).join(', ') + '</p>';
      return h;
    }

    // ---------------- contexto da passada: catálogo indexado e classes ----------------
    // dados = o que o KhPrevia.carregar devolveu (catalogos, classes, racas…).
    // Índice próprio (o do KhEstado guarda só id/nome/resumo): a entrada crua do
    // data/catalogo/*.json, com custoTexto, grupo, ramo, tier, req, stats…
    function contexto(dados, D, base) {
      dados = obj(dados) ? dados : {};
      var porId = {}, porNome = {}, classes = {}, ramos = {};
      function poe(e) {
        if (!obj(e) || !e.id || !e.tipo) return;
        porId[e.tipo + ':' + e.id] = e;
        var k = e.tipo + '|' + norm(e.nome);
        (porNome[k] = porNome[k] || []).push(e);
      }
      lista(dados.catalogos).forEach(function (cat) { lista(cat && cat.entradas).forEach(poe); });
      // as corrupções do Corrompido moram no bloco da raça (não em data/catalogo)
      lista(dados.racas).forEach(function (b) {
        var r = obj(b) && obj(b.raca) ? b.raca : b;
        var corr = obj(r) && obj(r.corrupcao) ? r.corrupcao : null;
        if (!corr) return;
        ['poderes', 'adversidades'].forEach(function (k) {
          lista(corr[k] && corr[k].itens).forEach(function (x) {
            if (obj(x)) poe({ id: x.id, tipo: 'corrupcao', nome: x.nome, resumo: x.efeito, custoTexto: x.custo ? 'Custo ' + x.custo : null });
          });
        });
      });
      lista(dados.classes).forEach(function (b) {
        var c = obj(b) && obj(b.classe) ? b.classe : b;
        if (!obj(c) || !c.id) return;
        classes[c.id] = c;
        var chave = str(c.id).replace(/^classe-/, '');
        lista(c.ramos).forEach(function (r) {
          if (obj(r) && r.id) ramos[r.id] = { classe: chave, chave: str(r.chave), nome: semEmoji(r.nome) };
        });
      });
      return { porId: porId, porNome: porNome, classes: classes, ramos: ramos,
        D: D || (KhRegras ? KhRegras.dados() : {}), base: base == null ? '../' : str(base) };
    }
    // a entrada do catálogo de uma entrada da ficha: pelo id; sem id, pelo nome
    // (só se o nome for único naquele tipo; ambíguo segue órfã)
    function resolver(ctx, e) {
      if (!obj(e)) return null;
      if (e.id) return ctx.porId[e.tipo + ':' + e.id] || null;
      var l = ctx.porNome[e.tipo + '|' + norm(e.cache && e.cache.nome)];
      return l && l.length === 1 ? l[0] : null;
    }
    function img(ctx, nome, cls) {
      return '<img class="' + cls + '" src="' + esc(ctx.base + 'images/ficha/' + nome + '.webp') + '" alt="" decoding="async">';
    }
    // bloco com a moldura de raízes; campo = data-campo (a peça da ficha física)
    function moldura(campo, titulo, corpo, op) {
      op = op || {};
      return '<section class="fp-bloco' + (op.cls ? ' ' + op.cls : '') + '" data-campo="' + esc(campo) + '"' + (op.attrs || '') + '>' + CANTOS +
        (titulo ? '<h3 class="fp-bloco-tit">' + (op.ico || '') + '<span class="fp-bloco-nome">' + esc(titulo) + '</span>' +
          (op.extra ? '<span class="fp-bloco-extra">' + op.extra + '</span>' : '') + '</h3>' : '') +
        (op.nota ? '<p class="fp-nota">' + op.nota + '</p>' : '') + corpo + '</section>';
    }
    function selo(cls, texto, titulo) {
      return '<span class="fp-selo fp-selo-' + cls + '"' + (titulo ? ' title="' + esc(titulo) + '"' : '') + '>' + esc(texto) + '</span>';
    }
    function rarDe(r) { var n = norm(r); return RARIDADES.filter(function (p) { return norm(p[0]) === n; })[0] || null; }
    function raridade(r) {
      var x = rarDe(r);
      return x ? '<span class="fp-rar fp-rar-' + x[1] + '">' + esc(x[0]) + '</span>' : (r ? '<span class="fp-rar">' + esc(r) + '</span>' : '');
    }
    function tokens(cat) { return str(cat).split(',').map(function (t) { return t.trim(); }).filter(Boolean); }

    // ======================================================================
    // 1. Núcleo (A4 pág. 1)
    // ======================================================================
    RENDER.nucleo = function (res, C, ctx) {
      var f = res.ficha, nos = res.av.nos, D = ctx.D, conta = C.conta, h = '';
      var meta = f.meta || {}, idt = f.identidade || {};

      // ---- identidade
      function idCampo(campo, rot, val, cls) {
        return '<div class="fp-id' + (cls ? ' ' + cls : '') + '" data-campo="' + campo + '"><dt>' + esc(rot) + '</dt><dd>' + (val || vazio()) + '</dd></div>';
      }
      function idRef(campo, rot, r) {
        if (!obj(r) || !(r.id || r.nome)) return campo === 'raca' || campo === 'classe' || campo === 'origem' ? idCampo(campo, rot, '') : '';
        return idCampo(campo, rot, esc(refNome(r)) + (!r.id ? ' ' + selo('orfa', 'sem par', 'Sem par no catálogo: só o nome digitado') : ''));
      }
      h += moldura('identidade', 'Identidade', '<dl class="fp-ident-grade">' +
        idCampo('nome', 'Nome do Personagem', esc(semEmoji(meta.nome)), 'fp-id-largo') +
        idCampo('jogador', 'Jogador', esc(semEmoji(meta.jogador))) +
        idCampo('nivel', 'Nível', nEstado('meta.nivel', meta.nivel)) +
        idCampo('xp', 'XP', nEstado('meta.xp', meta.xp)) +
        idRef('raca', 'Raça', idt.raca) + idRef('variante', 'Variante', idt.variante) + idRef('subespecie', 'Subespécie', idt.subespecie) +
        idRef('classe', 'Classe', idt.classe) + idRef('ramo', 'Ramo', idt.ramo) + idRef('origem', 'Origem', idt.origem) +
        '</dl>', { cls: 'fp-bloco-ident' });

      // ---- atributos: ilustração de traço, Total e Mod.
      h += moldura('atributos', 'Atributos', '<div class="fp-ats">' + ATRIBUTOS.map(function (a) {
        return '<div class="fp-at" data-campo="atributo-' + a[0] + '">' + img(ctx, a[2], 'fp-at-img') +
          '<span class="fp-at-nome">' + esc(a[1]) + '</span>' +
          '<span class="fp-at-total"><span class="fp-rot">Atributo</span>' + conta('atributo.' + a[0] + '.total') + '</span>' +
          '<span class="fp-at-mod"><span class="fp-rot">Mod.</span>' + conta('atributo.' + a[0] + '.mod', { texto: modTxt(nos['atributo.' + a[0] + '.mod']) }) + '</span>' +
          '</div>';
      }).join('') + '</div>',
      { nota: f.atributos && f.atributos.migradoTotal ? 'Total migrado da ficha atual: a raça, o nível e os efeitos de técnicas e cartas já estão dentro do número digitado.' : '' });

      // ---- perícias: 4 círculos de grau, o atributo usado e o total
      var graus = lista(D.graus && D.graus.rotulos), bonus = lista(D.graus && D.graus.bonus);
      // o Ofício(X) genérico da v2: a migração não escolhe qual dos três Ofícios
      // recebe o grau (pendência, escolha do jogador). Sem isto o grau sumia da
      // página: os três ficam com 0 círculos. Fica à vista junto deles.
      var iOf = -1;
      lista(f.migracao && f.migracao.pendencias).forEach(function (p, i) { if (iOf < 0 && obj(p) && p.campo === 'pericias.oficio') iOf = i; });
      var gOf = iOf >= 0 ? Number(f.migracao.pendencias[iOf].grau) || 0 : 0;
      var seloOf = gOf > 0 ? selo('aviso', 'grau a escolher', 'A ficha atual tinha um Ofício(X) genérico com grau ' + gOf +
        (graus[gOf] ? ' (' + graus[gOf] + ')' : '') + '; escolha qual Ofício recebe o grau.') : '';
      function pericia(p) {
        var no = nos['pericia.' + p.id + '.total'];
        var g = f.pericias ? Number(f.pericias[p.id]) || 0 : 0;
        var at = no && no.escolha ? no.escolha.usado : p.modo === 'fixo' ? p.atributos[0] : p.modo === 'porArma' ? 'arma' : p.modo === 'dado' ? 'dado' : '';
        var atTit = p.modo === 'maior' ? 'o maior de ' + p.atributos.join('/') + ' (D7)' : p.modo === 'porArma' ? 'o atributo da arma' :
          p.modo === 'dado' ? 'só o dado, sem atributo (D8a)' : NOME_ATRIBUTO[at] || '';
        var circ = '';
        for (var i = 1; i <= 4; i++) {
          circ += '<span class="fp-grau' + (i <= g ? ' on' : '') + '" title="' + esc((bonus[i] != null ? '+' + bonus[i] + ' ' : '') + (graus[i] || '')) + '"></span>';
        }
        return '<div class="fp-per" data-campo="pericia-' + p.id + '">' +
          '<span class="fp-per-graus" role="img" aria-label="' + esc('Grau ' + g + ' de 4' + (graus[g] ? ': ' + graus[g] : '')) + '">' + circ + '</span>' +
          // o selo (decisão, pendente…) vai junto do nome; a caixa de total fica só com o número
          '<span class="fp-per-nome">' + esc(p.nome) + (no ? C.selosHTML(no.selos) : '') + (/^oficio-/.test(p.id) ? seloOf : '') + '</span>' +
          '<span class="fp-per-at" title="' + esc(atTit) + '">' + esc(at) + '</span>' +
          '<span class="fp-per-total">' + conta('pericia.' + p.id + '.total', { texto: no && typeof no.valor === 'number' ? modTxt(no) : null, semSelos: true }) + '</span></div>';
      }
      var pers = lista(D.pericias);
      // duas colunas como no A4: Atacar a Iniciativa | Conhecimento ao Ofício
      var corte = pers.map(function (p) { return p.id; }).indexOf('conhecimento');
      if (corte < 0) corte = Math.ceil(pers.length / 2);
      h += '<div class="fp-duas"><div class="fp-col">';
      h += moldura('pericias', 'Perícias', '<div class="fp-pers"><div class="fp-pers-col">' + pers.slice(0, corte).map(pericia).join('') +
        '</div><div class="fp-pers-col">' + pers.slice(corte).map(pericia).join('') + '</div></div>',
      { extra: '<span class="fp-legenda">' + bonus.slice(1).map(function (b, i) { return esc('+' + b + ' ' + (graus[i + 1] || '')); }).join(' · ') + '</span>',
        nota: gOf > 0 ? 'Pendência da migração: a ficha atual tinha um Ofício(X) genérico com grau ' +
          nEstado('migracao.pendencias.' + iOf + '.grau', gOf) + (graus[gOf] ? ' (' + esc(graus[gOf]) + ')' : '') +
          '. Escolha qual Ofício (Engenharia, Ferraria ou Alquimia) recebe o grau.' : '' });
      h += '</div><div class="fp-col">';

      // ---- recursos: atual / máx., com as cores de recurso (D28)
      var rc = f.recursos || {};
      function barra(atual, max, cls) {
        var pc = typeof max === 'number' && max > 0 && typeof atual === 'number' ? Math.max(0, Math.min(1, atual / max)) * 100 : 0;
        return '<span class="fp-barra ' + cls + '" aria-hidden="true"><span class="fp-barra-fill" style="width:' + fmtPc(pc) + '%"></span></span>';
      }
      function recurso(id, nome, icone, extra) {
        var x = rc[id] || {}, no = nos['recurso.' + id + '.max'];
        return '<div class="fp-rec fp-rec-' + id + '" data-campo="' + id + '">' + img(ctx, icone, 'fp-rec-img') +
          '<span class="fp-rec-nome">' + esc(nome) + '</span>' +
          '<span class="fp-rec-num"><span class="fp-rot">Atual</span>' + nEstado('recursos.' + id + '.atual', x.atual) +
          '<span class="fp-barra-sep">/</span><span class="fp-rot">Máx.</span>' + conta('recurso.' + id + '.max') + '</span>' +
          barra(x.atual, no && no.valor, 'fp-barra-' + id) + (extra || '') + '</div>';
      }
      var noCl = nos['recurso.classe.max'];
      var recClasse;
      if (noCl && noCl.semContador) {
        // D105: o recurso da classe não é contador (Espadachim, Teurgo): as características, sem número
        recClasse = '<div class="fp-rec fp-rec-classe fp-rec-sem" data-campo="recurso-classe"><span class="fp-rec-ico">' + SVG_ACOES + '</span>' +
          '<span class="fp-rec-nome">Recurso de Classe <span class="fp-sub">sem contador (D105)</span></span>' +
          '<span class="fp-rec-txt">' + conta('recurso.classe.max', { texto: lista(noCl.itens).map(semEmoji).join(' · ') }) + '</span></div>';
      } else {
        var nomeCl = noCl ? semEmoji(str(noCl.rotulo).replace(/\s*máx\.?$/i, '')) : '';
        var digitado = obj(rc.classe) ? semEmoji(rc.classe.nome) : '';
        if (noCl && !noCl.medidor && digitado) nomeCl = digitado;
        recClasse = '<div class="fp-rec fp-rec-classe" data-campo="recurso-classe"><span class="fp-rec-ico">' + SVG_ACOES + '</span>' +
          '<span class="fp-rec-nome">Recurso de Classe' + (nomeCl ? ' <span class="fp-sub">' + esc(nomeCl) + '</span>' : '') +
          (noCl && !noCl.medidor && digitado ? ' <span class="fp-sub">(nome digitado na ficha atual; sem nome no contrato)</span>' : '') + '</span>' +
          '<span class="fp-rec-num"><span class="fp-rot">Atual</span>' + nEstado('recursos.classe.atual', obj(rc.classe) ? rc.classe.atual : null) +
          '<span class="fp-barra-sep">/</span><span class="fp-rot">Máx.</span>' + conta('recurso.classe.max') + '</span>' +
          barra(obj(rc.classe) ? rc.classe.atual : null, noCl && noCl.valor, 'fp-barra-classe') + '</div>';
      }
      var sau = rc.saude || {}, sta = rc.stamina || {};
      h += moldura('recursos', 'Recursos',
        recurso('saude', 'Saúde', 'saude', sau.temporaria ? '<span class="fp-rec-extra"><span class="fp-rot">Temporária</span>' + nEstado('recursos.saude.temporaria', sau.temporaria) + '</span>' : '') +
        recurso('stamina', 'Stamina', 'stamina', '<span class="fp-rec-extra">' +
          (sta.comprometida ? '<span class="fp-rot">Comprometida</span>' + nEstado('recursos.stamina.comprometida', sta.comprometida) + ' ' : '') +
          '<span class="fp-rot">Disponível</span>' + conta('recurso.stamina.disponivel') + '</span>') +
        recurso('eter', 'Éter', 'eter') + recClasse +
        alertasRecurso(res));

      // ---- derivados: Evasão, CD, Movimento, Ações, Sins
      function tile(campo, rot, icone, corpo) {
        return '<div class="fp-der" data-campo="' + campo + '">' + icone + '<span class="fp-der-rot">' + esc(rot) + '</span><span class="fp-der-val">' + corpo + '</span></div>';
      }
      h += moldura('derivados', 'Evasão, CD e Movimento', '<div class="fp-ders">' +
        tile('evasao', 'Evasão', img(ctx, 'evasao', 'fp-der-img'),
          '<span class="fp-par"><span class="fp-rot">Passiva</span>' + conta('evasao.passiva') + '</span>' +
          '<span class="fp-par"><span class="fp-rot">Ativa</span>' + conta('evasao.ativa') + '</span>') +
        tile('cd', 'CD', img(ctx, 'cd', 'fp-der-img'), conta('cd')) +
        tile('movimento', 'Movimento', img(ctx, 'movimento', 'fp-der-img'), conta('movimento', { un: ' m' })) +
        tile('acoes', 'Ações', '<span class="fp-der-ico">' + SVG_ACOES + '</span>', conta('acoes')) +
        tile('sins', 'Sins', img(ctx, 'sins', 'fp-der-img'), nEstado('inventario.sins', f.inventario ? f.inventario.sins || 0 : 0)) +
        '</div>');

      // ---- capacidade: Equipamentos e Bugigangas com régua e Sobrepeso
      h += moldura('capacidade', 'Capacidade', capacidade(res, C, ctx), { ico: img(ctx, 'mochila', 'fp-tit-img') });
      h += '</div></div>';

      // ---- Armadura e resistências
      h += moldura('armadura', 'Armadura e Resistência', resistencias(res, C, D),
        { ico: img(ctx, 'armadura', 'fp-tit-img'), nota: 'R = resistência, I = imunidade, V = vulnerabilidade, Ae = armadura específica; a redução junta Ar, Ae do tipo, da categoria e de Todos.' });

      // ---- Marcas da Vhelor: só com 1 ou mais (M5)
      var vh = f.vhelor && Number(f.vhelor.marcas) || 0;
      if (vh >= 1) {
        h += moldura('vhelor', 'Marcas da Vhelor', '<p class="fp-vhelor">' + nEstado('vhelor.marcas', vh) + '<span class="fp-sub"> de 7</span>' +
          (f.vhelor.abstinente ? ' ' + selo('aviso', 'em abstinência') : '') + '</p>', { cls: 'fp-bloco-vhelor' });
      }
      // ---- imunidade a condição e idiomas: só quando há
      var imc = lista(f.imunidadesCondicao), idi = lista(f.idiomas);
      if (imc.length || idi.length) {
        h += moldura('outros-nucleo', 'Imunidades e idiomas', '<dl class="fp-ident-grade">' +
          (imc.length ? idCampo('imunidades', 'Imunidade a condição', esc(imc.map(function (x) { return semEmoji(obj(x) ? x.nome || x.id : x); }).join(', '))) : '') +
          (idi.length ? idCampo('idiomas', 'Idiomas', esc(idi.map(function (x) { return semEmoji(obj(x) ? x.nome || x.id : x); }).join(', '))) : '') + '</dl>');
      }
      h += avisos(res, C);
      return h;
    };
    function fmtPc(n) { return String(Math.round(n * 10) / 10); }

    // condições que o motor liga sozinho pelos recursos (Oco, Exaurido…)
    function alertasRecurso(res) {
      var al = lista(res.av.alertas).filter(function (a) { return a.recurso; });
      if (!al.length) return '';
      var pend = lista(res.ficha.migracao && res.ficha.migracao.pendencias);
      return '<ul class="fp-alertas">' + al.map(function (a) {
        var daMigracao = pend.some(function (p) { return p.campo === 'recursos.' + a.recurso; });
        return '<li>' + esc(semEmoji(a.msg)) + (daMigracao ? ' <span class="fp-sub">(pode ser efeito da migração: a ficha atual tinha 0/0)</span>' : '') + '</li>';
      }).join('') + '</ul>';
    }

    // pre: prefixo do data-campo das linhas (no Bazar, 'carga-', porque lá
    // "bugigangas" e "equipamentos" são as seções de itens da pág. 4)
    function capacidade(res, C, ctx, pre) {
      pre = pre || '';
      var nos = res.av.nos, cg = nos.carga && nos.carga.extra;
      function linha(k, rot) {
        var col = cg && cg[k];
        var reg = '';
        if (col) {
          var total = 2 * col.max;
          var ok = total > 0 ? Math.min(col.usado, col.max) / total * 100 : 0;
          var exc = total > 0 ? Math.max(0, Math.min(col.usado, total) - col.max) / total * 100 : 0;
          var est = col.estado === 'leve' ? 'Sobrepeso Leve' : col.estado === 'extremo' ? 'Sobrepeso Extremo' : '';
          reg = '<span class="kh-regua-linha"><span class="kh-regua" role="meter" aria-label="' + esc(rot) + '" aria-valuemin="0"' +
            ' aria-valuemax="' + col.max + '" aria-valuenow="' + col.usado + '" aria-valuetext="' + esc(col.usado + ' de ' + col.max + ' ' + rot.toLowerCase() + (est ? ', ' + est : '')) + '"' +
            (col.estado === 'extremo' ? ' data-estado="extremo"' : '') + '>' +
            '<span class="kh-regua-ok" style="width:' + fmtPc(ok) + '%"></span>' +
            (exc > 0 ? '<span class="kh-regua-exc" style="width:' + fmtPc(exc) + '%;left:50%"></span>' : '') +
            '<span class="kh-regua-marco" aria-hidden="true"></span>' +
            (col.usado > total ? '<span class="kh-regua-mais">+' + (col.usado - total) + '</span>' : '') + '</span></span>';
        }
        return '<div class="fp-cap fp-cap-' + (col ? col.estado : 'ok') + '" data-campo="' + pre + k + '">' +
          '<span class="fp-cap-nome">' + esc(rot) + '</span>' +
          '<span class="fp-cap-num"><span class="fp-rot">Qtd</span>' + (col ? C.conta('carga', { texto: fmt(col.usado) }) : vazio()) +
          '<span class="fp-barra-sep">/</span><span class="fp-rot">Peso Máximo</span>' + C.conta('capacidade.' + k) + '</span>' + reg + '</div>';
      }
      return linha('equipamentos', 'Equipamentos') + linha('bugigangas', 'Bugigangas') +
        '<p class="fp-cap-estado" data-campo="carga"><span class="fp-rot">Estado</span>' +
        C.conta('carga', { texto: ESTADO_CARGA[nos.carga && nos.carga.valor] || C.valorNo(nos.carga) }) + '</p>';
    }

    function resistencias(res, C, D) {
      var nos = res.av.nos, conta = C.conta;
      var cats = obj(D.defesa) && obj(D.defesa.categorias) ? D.defesa.categorias : {};
      var usados = {};
      var grupos = ['ordinario', 'elemental', 'biologico', 'mistico'].map(function (c) {
        var tipos = lista(cats[c]);
        tipos.forEach(function (t) { usados[t] = 1; });
        return [c, tipos];
      });
      // Outros (Força, Primordial): a 5ª categoria do contrato rev. 7, sem Ae de categoria
      grupos.push(['outros', TIPOS.map(function (t) { return t[0]; }).filter(function (t) { return !usados[t]; })]);
      var nomeTipo = {};
      TIPOS.forEach(function (t) { nomeTipo[t[0]] = t[1]; });
      function flag(fam, t, letra) {
        var no = nos[fam + '.' + t];
        return '<span class="fp-flag' + (no && no.valor ? ' on' : '') + '">' + conta(fam + '.' + t, { texto: no && no.valor ? letra : '·', semSelos: true }) + '</span>';
      }
      var topo = '<div class="fp-arm-topo">' +
        '<span class="fp-par" data-campo="ar"><span class="fp-rot">Armadura (Ar)</span>' + conta('ar') + '</span>' +
        '<span class="fp-par" data-campo="ae-todos"><span class="fp-rot">Ae(Todos)</span>' + conta('ae.todos') + '</span></div>';
      return topo + '<div class="fp-res-cats">' + grupos.map(function (g) {
        if (!g[1].length) return '';
        return '<div class="fp-res-cat" data-categoria="' + g[0] + '">' +
          '<div class="fp-res-cab"><span class="fp-res-cat-nome">' + esc(NOME_CATEGORIA[g[0]]) + '</span>' +
          (g[0] !== 'outros' ? '<span class="fp-par" data-campo="ae-' + g[0] + '"><span class="fp-rot">Ae</span>' + conta('ae.' + g[0]) + '</span>'
            : '<span class="fp-sub">sem Ae de categoria</span>') + '</div>' +
          '<div class="fp-res-tab"><span class="fp-res-h">Tipo</span><span class="fp-res-h">R</span><span class="fp-res-h">I</span>' +
          '<span class="fp-res-h">V</span><span class="fp-res-h">Ae</span><span class="fp-res-h">Red.</span>' +
          g[1].map(function (t) {
            return '<div class="fp-res-lin" data-campo="resistencia-' + t + '"><span class="fp-tipo fp-tipo-' + t + '">' + esc(nomeTipo[t] || t) + '</span>' +
              flag('resistencia', t, 'R') + flag('imunidade', t, 'I') + flag('vulnerabilidade', t, 'V') +
              '<span class="fp-res-n">' + conta('ae.' + t) + '</span><span class="fp-res-n">' + conta('defesa.' + t) + '</span></div>';
          }).join('') + '</div></div>';
      }).join('') + '</div>';
    }

    // avisos do motor e da migração, recolhidos: a MESMA lista da prévia
    // (KhPrevia.listaAvisos, fonte única), com o grau da pendência e o selo do alerta
    function avisos(res, C) {
      var av = KhPrevia && KhPrevia.listaAvisos ? KhPrevia.listaAvisos(res, C.rotuloSelo) : [];
      if (!av.length) return '';
      return '<details class="fp-avisos" data-campo="avisos"><summary>Avisos do motor e da migração (' + av.length + ')</summary><ul>' +
        av.map(function (x) { return '<li>' + esc(semEmoji(x)) + '</li>'; }).join('') + '</ul></details>';
    }

    // ======================================================================
    // 2. Técnicas & Marcas (A4 pág. 2)
    // ======================================================================
    var TIPOS_TECNICA = ['tecnica', 'marca', 'ultimate', 'traco', 'variante', 'subespecie', 'tecnologia', 'corrupcao', 'origem'];
    function grupoTecnica(e, c) {
      if (e.tipo === 'marca') return 'marcas';
      if (e.tipo === 'ultimate') return 't3';
      if (e.tipo === 'tecnica') {
        if (c && c.grupo === 'ramo') return c.tier === 2 ? 't2' : c.tier === 3 ? 't3' : 't1';
        return 'gerais';
      }
      return 'diversas';
    }
    // nível que destrava cada tier e cada Marca, lido da classe (D34):
    // tiers de ramosRegra.porTier; a k-ésima Marca da tabela de progressão
    function destravas(ctx, classeId) {
      var c = ctx.classes[classeId], tiers = {}, marcas = [];
      if (c && obj(c.ramosRegra)) {
        lista(c.ramosRegra.porTier).forEach(function (t) { if (obj(t)) tiers[t.tier] = { n: t.quantidade, nivel: t.nivel }; });
      }
      if (c && obj(c.progressao)) {
        lista(c.progressao.linhas).forEach(function (l) {
          var nv = parseInt(lista(l)[0], 10), m = /(\d+)\s+Marcas?\b/i.exec(lista(l).slice(1).join(' '));
          if (isFinite(nv) && m) while (marcas.length < Number(m[1])) marcas.push(nv);
        });
      }
      return { tiers: tiers, marcas: marcas, nMarcas: c && c.ramosRegra && c.ramosRegra.marcas };
    }
    // glifo e nome do ramo, na cor do ramo (--ramo-<classe>-<ramo>). O id do glifo
    // é montado (g-ramo-<chave>): o [glifos] do validar.py garante um símbolo por
    // ramo das páginas de classe, e a chave vem de data/classes (os mesmos ramos)
    var PREFIXO_GLIFO_RAMO = '#g-ramo-';
    function rotuloRamo(ramo, comCor) {
      return '<span class="fp-tec-ramo"' + (comCor ? ' style="--fp-ramo: var(--ramo-' + esc(ramo.classe) + '-' + esc(ramo.chave) + ')"' : '') + '>' +
        '<svg class="fp-svg" aria-hidden="true" focusable="false"><use href="' + PREFIXO_GLIFO_RAMO + esc(ramo.chave) + '"/></svg>' +
        esc(ramo.nome) + '</span>';
    }
    function cardTecnica(it, ctx, op) {
      op = op || {};
      var e = it.e, c = it.c;
      var nome = c ? semEmoji(c.nome) : semEmoji(e.cache && e.cache.nome) || '(sem nome)';
      var custo = c && c.custoTexto ? semEmoji(c.custoTexto) : '';
      // o resumo das Ultimates começa por "ULTIMATE" e repete o custo: os dois saem
      var texto = c ? semPrefixo(semEmoji(c.resumo).replace(/^\s*ULTIMATE\b\s*/, ''), c.custoTexto) : (e.cache && e.cache.resumo) || '';
      var ramo = c && c.ramo ? ctx.ramos[c.ramo] : null;
      var meta = '';
      if (op.tipo) meta += '<span class="fp-tec-tipo">' + esc(op.tipo) + '</span>';
      if (ramo && ramo.chave) meta += rotuloRamo(ramo, false);
      if (!c) {
        var o = e.orfao || {};
        meta += selo('orfa', 'órfã', 'Sem par no catálogo' + (o.motivo ? ' (' + o.motivo + (lista(o.candidatos).length ? ': ' + o.candidatos.join(', ') : '') + ')' : '') + '. Mostra o texto salvo na ficha.');
      }
      if (op.destrava && op.destrava > op.nivel) meta += selo('trava', 'destrava no nível ' + op.destrava, 'Acima do nível do personagem (D34)');
      var estilo = ramo && ramo.chave ? ' style="--fp-ramo: var(--ramo-' + esc(ramo.classe) + '-' + esc(ramo.chave) + ')"' : '';
      return '<article class="fp-tec' + (ramo ? ' fp-tec-de-ramo' : '') + (!c ? ' fp-orfa' : '') + (op.destrava && op.destrava > op.nivel ? ' fp-acima' : '') + '"' +
        ' data-moldura data-tipo="' + esc(e.tipo) + '"' + (e.id ? ' data-id="' + esc(e.id) + '"' : '') + (!c ? ' data-orfa' : '') + estilo + '>' +
        '<header class="fp-tec-cab"><h4 class="fp-tec-nome">' + esc(nome) + '</h4>' +
        (custo ? '<span class="fp-tec-custo" data-campo="custo">' + esc(custo) + '</span>' : '') + '</header>' +
        (meta ? '<div class="fp-tec-meta">' + meta + '</div>' : '') +
        '<p class="fp-tec-txt">' + (texto ? textoRico(texto) : vazio()) + '</p></article>';
    }
    function molduraVazia(nivelDestrava, nivel, cls) {
      var trava = nivelDestrava && nivelDestrava > nivel;
      return '<div class="fp-tec fp-tec-vazia' + (cls ? ' ' + cls : '') + (trava ? ' fp-travada' : '') + '" data-moldura data-vazia' + (trava ? ' data-destrava="' + nivelDestrava + '"' : '') + '>' +
        (trava ? '<span class="fp-trava-txt">destrava no nível ' + esc(nivelDestrava) + '</span>' : '<span class="fp-vazia-txt">vazia</span>') + '</div>';
    }
    RENDER.tecnicas = function (res, C, ctx) {
      var f = res.ficha, nivel = Number(f.meta && f.meta.nivel) || 1, idt = f.identidade || {};
      var g = { gerais: [], t1: [], t2: [], t3: [], marcas: [], diversas: [] };
      var vistos = {};
      // variante e subespécie da identidade entram em Diversas (o card da raça)
      ['variante', 'subespecie'].forEach(function (k) {
        var r = idt[k];
        if (!obj(r) || !r.id) return;
        var c = ctx.porId[k + ':' + r.id];
        vistos[k + ':' + r.id] = 1;
        g.diversas.push({ e: { tipo: k, id: r.id, cache: { nome: r.nome } }, c: c || null });
      });
      lista(f.entradas).forEach(function (e) {
        if (!obj(e) || TIPOS_TECNICA.indexOf(e.tipo) < 0) return;
        if (e.id && vistos[e.tipo + ':' + e.id]) return;
        var c = resolver(ctx, e);
        g[grupoTecnica(e, c)].push({ e: e, c: c });
      });
      var dv = destravas(ctx, idt.classe && idt.classe.id);
      function grade(itens, minimo, op) {
        op = op || {};
        var n = Math.max(minimo, itens.length), h = '';
        for (var i = 0; i < n; i++) {
          var destrava = op.destravaDe ? op.destravaDe(i) : null;
          h += i < itens.length
            ? cardTecnica(itens[i], ctx, { nivel: nivel, destrava: destrava, tipo: op.tipo ? op.tipo(itens[i]) : '' })
            : molduraVazia(destrava, nivel);
        }
        return '<div class="fp-tecs' + (op.cls ? ' ' + op.cls : '') + '">' + h + '</div>';
      }
      var h = '';
      h += moldura('tecnicas-gerais', 'Técnicas Gerais', grade(g.gerais, MOLDURAS.gerais));
      var tiers = [1, 2, 3].map(function (t) {
        var info = dv.tiers[t] || {}, itens = g['t' + t];
        var tit = t === 3 ? 'Tier 3 · Ultimates' : 'Tier ' + t;
        return '<div class="fp-tier" data-campo="tier-' + t + '"><h4 class="fp-tier-tit">' + esc(tit) +
          (info.nivel ? ' <span class="fp-sub">nível ' + esc(info.nivel) + '+</span>' : '') + '</h4>' +
          grade(itens, info.n || MOLDURAS.tiers[t], { destravaDe: function () { return info.nivel || null; }, cls: 'fp-tecs-tier' }) + '</div>';
      }).join('');
      var ramo = idt.ramo && idt.ramo.id ? ctx.ramos[idt.ramo.id] : null;
      h += moldura('tecnicas-ramo', 'Técnicas de Ramo', '<div class="fp-tiers">' + tiers + '</div>',
        { extra: ramo && ramo.chave ? rotuloRamo(ramo, true) : '' });
      h += moldura('marcas', 'Marcas', grade(g.marcas, dv.nMarcas || MOLDURAS.marcas, { destravaDe: function (i) { return dv.marcas[i] || null; } }));
      h += moldura('tecnicas-diversas', 'Técnicas Diversas', grade(g.diversas, MOLDURAS.diversas, { tipo: function (it) { return NOME_DIVERSA[it.e.tipo] || ''; } }),
        { nota: 'Traços, variante, tecnologias, corrupções e técnica de origem.' });
      return h;
    };

    // ======================================================================
    // 3. Cartas, Lore & Outros (A4 pág. 3)
    // ======================================================================
    function cardCarta(e, ctx, C, nos) {
      var c = resolver(ctx, e);
      var rara = !!c && c.categoria === 'rara';
      var nome = c ? semEmoji(c.nome) : semEmoji(e.cache && e.cache.nome) || '(sem nome)';
      var cat = c ? str(c.categoria) : '';
      var ico = rara ? '<span class="fp-carta-ico">' + SVG_RARA + '</span>'
        : CARTA_ICONE[cat] ? '<span class="fp-carta-ico">' + img(ctx, CARTA_ICONE[cat], 'fp-carta-img') + '</span>'
          : '<span class="fp-carta-ico">' + SVG_UNIVERSAL + '</span>';
      // requisito: ok ou aviso, contra o Total do atributo (com a conta)
      var req = c ? lista(c.req) : [];
      var falta = req.filter(function (r) {
        var no = nos['atributo.' + r.attr + '.total'];
        return !no || typeof no.valor !== 'number' || no.valor < r.min;
      });
      var reqHTML = '';
      if (req.length) {
        reqHTML = '<p class="fp-carta-req fp-req-' + (falta.length ? 'aviso' : 'ok') + '" data-campo="requisito">' +
          '<span class="fp-req-txt">' + esc(c.reqTexto || req.map(function (r) { return r.attr + ' ' + r.min + '+'; }).join(', ')) + '</span>' +
          (falta.length ? ' <span class="fp-req-marca">aviso:</span> ' + falta.map(function (r) {
            return '<span class="fp-req-at">' + esc(r.attr) + ' ' + C.conta('atributo.' + r.attr + '.total') + '</span>';
          }).join(' ') : ' <span class="fp-req-marca">ok</span>') + '</p>';
      } else if (c) {
        reqHTML = '<p class="fp-carta-req fp-req-ok" data-campo="requisito"><span class="fp-req-txt">sem requisito</span></p>';
      }
      var est = e.estado || {}, metaE = [];
      if (est.nivelAquisicao != null) metaE.push('nível ' + nEstado('entradas.' + e.uid + '.estado.nivelAquisicao', est.nivelAquisicao));
      if (est.posicaoNaMao != null) metaE.push(nEstado('entradas.' + e.uid + '.estado.posicaoNaMao', est.posicaoNaMao) + 'ª da mão');
      if (est.especial) metaE.push('carta especial');
      // RARA: nunca o efeito (D11, D33), nem o texto que a ficha atual guardou
      var corpo = rara ? '<p class="fp-carta-oculta">Efeito oculto até a carta ser revelada.</p>'
        : '<p class="fp-carta-txt">' + (c && c.resumo ? textoRico(c.resumo) : e.cache && e.cache.resumo ? textoRico(e.cache.resumo) : vazio()) + '</p>';
      return '<article class="fp-carta fp-carta-' + esc(cat || 'orfa') + (rara ? ' fp-carta-rara' : '') + (!c ? ' fp-orfa' : '') + '" data-moldura' +
        (e.id ? ' data-id="' + esc(e.id) + '"' : '') + (rara ? ' data-rara' : '') + (!c ? ' data-orfa' : '') + '>' +
        '<div class="fp-carta-cab">' + ico + '<span class="fp-carta-cat">' + esc(CARTA_CATEGORIA[cat] || 'Carta') + '</span>' +
        (!c ? selo('orfa', 'órfã', 'Sem par no catálogo. Mostra o texto salvo na ficha.') : '') + '</div>' +
        reqHTML + '<h4 class="fp-carta-nome">' + esc(nome) + '</h4>' + corpo +
        (metaE.length ? '<p class="fp-carta-meta">' + metaE.join(' · ') + '</p>' : '') + '</article>';
    }
    RENDER.cartas = function (res, C, ctx) {
      var f = res.ficha, nos = res.av.nos, h = '';
      var cartas = lista(f.entradas).filter(function (e) { return obj(e) && e.tipo === 'carta'; });
      var n = Math.max(MOLDURAS.cartas, cartas.length), grade = '';
      for (var i = 0; i < n; i++) {
        grade += i < cartas.length ? cardCarta(cartas[i], ctx, C, nos)
          : '<div class="fp-carta fp-carta-vazia" data-moldura data-vazia><span class="fp-vazia-txt">moldura de carta</span></div>';
      }
      h += moldura('cartas', 'Cartas do Limiar', '<div class="fp-cartas">' + grade + '</div>',
        { extra: '<span class="fp-par" data-campo="limiar-saldo"><span class="fp-rot">Pontos do Limiar</span>' + C.conta('limiar.saldo') + '</span>' });
      var queim = lista(f.limiar && f.limiar.queimadas);
      if (queim.length) {
        h += moldura('queimadas', 'Cartas queimadas', '<ul class="fp-lista">' + queim.map(function (q, i) {
          var c = ctx.porId['carta:' + (obj(q) ? q.id : q)];
          return '<li>' + esc(c ? semEmoji(c.nome) : str(obj(q) ? q.id : q)) + (obj(q) && q.nivel != null ? ' <span class="fp-sub">nível ' + nEstado('limiar.queimadas.' + i + '.nivel', q.nivel) + '</span>' : '') + '</li>';
        }).join('') + '</ul>');
      }
      // Abismo: dores e benefícios (qualquer jogador)
      var abismo = lista(f.entradas).filter(function (e) { return obj(e) && (e.tipo === 'dor' || e.tipo === 'beneficio'); });
      if (abismo.length) {
        h += moldura('abismo', 'Abismo', '<div class="fp-tecs">' + abismo.map(function (e) {
          return cardTecnica({ e: e, c: resolver(ctx, e) }, ctx, { tipo: e.tipo === 'dor' ? 'Dor' : 'Benefício' });
        }).join('') + '</div>');
      }
      var lore = f.lore || {};
      function texto(campo, tit, v) {
        return moldura(campo, tit, v && str(v).trim() ? '<p class="fp-lore">' + esc(semEmoji(v)) + '</p>' : '<p class="fp-nota">Em branco.</p>', { cls: 'fp-bloco-lore' });
      }
      h += '<div class="fp-lores">' + texto('historia', 'História', lore.historia) + texto('outros', 'Outros', lore.outros) + '</div>';
      return h;
    };

    // ======================================================================
    // 4. O Bazar (A4 pág. 4): o inventário da ficha, só leitura
    // ======================================================================
    function armaduraDe(x) {
      if (x && obj(x.inv) && (x.inv.armadura === 'Pesada' || x.inv.armadura === 'Leve')) return x.inv.armadura;
      var m = /^\s*\[(Pesada|Leve)\]/.exec(str(x && x.efeito));
      return m ? m[1] : '';
    }
    // a quantidade como o KhInv conta (inteiro >= 1, teto QTD_MAX)
    function qtdDe(x) {
      var n = parseInt(x && x.qtd, 10), teto = KhInv && KhInv.REGRAS ? KhInv.REGRAS.QTD_MAX : 9999;
      return Math.min(teto, n >= 1 ? n : 1);
    }
    function ehMaterial(x) { return tokens(x && x.categoria).indexOf('Material') >= 0; }
    function itemHTML(x, C, nos, ctx) {
      var qtd = qtdDe(x);
      var marcas = (x.equipado ? selo('equipado', 'Equipado') : '') + (x.sintonizado ? selo('sintonizado', 'Sintonizado') : '') +
        (x.orfao ? selo('orfa', 'órfão', 'Item sem par no catálogo do Bazar') : '');
      var atq = '';
      var noA = nos['ataque.' + x.uid + '.atacar'];
      if (noA) {
        atq = '<div class="fp-item-atq" data-campo="ataque">' +
          '<span class="fp-par"><span class="fp-rot">Atacar</span>' + C.conta('ataque.' + x.uid + '.atacar', { texto: modTxt(noA) }) + '</span>' +
          // a progressão da PMA é display do mesmo nó (a fórmula numérica a mostra)
          '<span class="fp-par"><span class="fp-rot">Progressão</span>' + C.conta('ataque.' + x.uid + '.atacar', { semSelos: true,
            texto: noA.progressao && noA.progressao.texto ? noA.progressao.texto : 'sem ações para atacar' }) + C.selosHTML(noA.selosProgressao) + '</span>' +
          '<span class="fp-par"><span class="fp-rot">Dano</span>' + C.conta('ataque.' + x.uid + '.dano') + '</span></div>';
      }
      var rar = rarDe(x.raridade);
      return '<li class="fp-item' + (rar ? ' fp-item-' + rar[1] : '') + '" data-moldura data-uid="' + esc(x.uid) + '">' +
        '<div class="fp-item-cab"><span class="fp-item-nome" data-campo="nome">' + esc(semEmoji(x.nome) || '(sem nome)') + '</span>' +
        '<span data-campo="raridade">' + raridade(x.raridade) + '</span>' +
        '<span class="fp-item-qtd" data-campo="qtd"><span class="fp-rot">Qtd</span>' + nEstado('inventario.' + x.uid + '.qtd', qtd) + '</span>' + marcas + '</div>' +
        (x.categoria ? '<span class="fp-item-cat">' + esc(x.categoria) + '</span>' : '') +
        (x.efeito ? '<p class="fp-item-ef">' + textoRico(x.efeito) + '</p>' : '') + atq + '</li>';
    }
    function itens(lst, minimo, C, nos, ctx) {
      var h = lst.map(function (x) { return itemHTML(x, C, nos, ctx); }).join('');
      for (var i = lst.length; i < (minimo || 0); i++) h += '<li class="fp-item fp-item-vazio" data-moldura data-vazia><span class="fp-vazia-txt">vazio</span></li>';
      return h ? '<ul class="fp-itens">' + h + '</ul>' : '<p class="fp-nota">Nada aqui.</p>';
    }
    RENDER.bazar = function (res, C, ctx) {
      var f = res.ficha, nos = res.av.nos, inv = f.inventario || {}, h = '';
      var bug = lista(inv.bugigangas).filter(obj), eq = lista(inv.equipamentos).filter(obj);
      var mats = bug.concat(eq).filter(ehMaterial);
      var bugs = bug.filter(function (x) { return !ehMaterial(x); });
      var eqs = eq.filter(function (x) { return !ehMaterial(x); });
      var pes = eqs.filter(function (x) { return armaduraDe(x) === 'Pesada'; });
      var lev = eqs.filter(function (x) { return armaduraDe(x) === 'Leve'; });
      var out = eqs.filter(function (x) { return !armaduraDe(x); });

      // Sins, carga e sintonizados (máx. 3, KhInv)
      var lim = KhInv && KhInv.REGRAS ? KhInv.REGRAS.LIM_SINTONIA : 3;
      var sint = bug.concat(eq).filter(function (x) { return x.sintonizado; });
      var ns = sint.reduce(function (s, x) { return s + qtdDe(x); }, 0);
      var noSint = { caminho: 'inventario.sintonizados', rotulo: 'Itens sintonizados',
        valor: ns, calculado: ns, ajuste: null, selos: [], lembretes: [],
        termos: sint.map(function (x) { return { rotulo: semEmoji(x.nome), valor: qtdDe(x), op: 'soma', ativo: true, fonte: { tipo: 'item', id: x.id, nome: semEmoji(x.nome) } }; }),
        formula: { simbolica: 'Σ Itens Mágicos sintonizados (máx. ' + lim + ')',
          numerica: '= ' + (sint.length ? sint.map(function (x) { return fmt(qtdDe(x)); }).join(' + ') + (sint.length > 1 ? ' = ' + fmt(ns) : '') : '0') },
        avisos: ns > lim ? [{ tipo: 'sintonia', msg: ns + ' Itens Mágicos sintonizados; o limite é ' + lim }] : [] };
      h += moldura('resumo-bazar', 'Bolsa', '<div class="fp-ders">' +
        '<div class="fp-der" data-campo="sins">' + img(ctx, 'sins', 'fp-der-img') + '<span class="fp-der-rot">Sins</span><span class="fp-der-val">' + nEstado('inventario.sins', inv.sins || 0) + '</span></div>' +
        '<div class="fp-der" data-campo="sintonizados"><span class="fp-der-ico">' + SVG_RARA + '</span><span class="fp-der-rot">Sintonizados</span><span class="fp-der-val">' +
          C.conta('inventario.sintonizados', { no: noSint, texto: fmt(ns) + ' / ' + fmt(lim) }) + '</span></div>' +
        '</div>' + capacidade(res, C, ctx, 'carga-'), { ico: img(ctx, 'mochila', 'fp-tit-img') });

      h += moldura('bugigangas', 'Bugigangas', itens(bugs, 0, C, nos, ctx));
      h += moldura('equipamentos', 'Equipamentos', '<div class="fp-eqs">' +
        '<div class="fp-eq" data-campo="equip-pesados"><h4 class="fp-tier-tit">Pesados</h4>' + itens(pes, MOLDURAS.pesados, C, nos, ctx) + '</div>' +
        '<div class="fp-eq" data-campo="equip-leves"><h4 class="fp-tier-tit">Leves</h4>' + itens(lev, MOLDURAS.leves, C, nos, ctx) + '</div>' +
        '<div class="fp-eq" data-campo="equip-armas"><h4 class="fp-tier-tit">Armas e Outros</h4>' + itens(out, MOLDURAS.armas, C, nos, ctx) + '</div>' +
        '</div>', { nota: 'Pesados e Leves são as armaduras [Pesada] e [Leve] do Bazar; a arma equipada mostra Atacar e Dano com a conta.' });
      // Materiais por raridade (vale o catálogo do Bazar, não a lista antiga da física)
      var porRar = RARIDADES.map(function (r) {
        return [r, mats.filter(function (x) { return norm(x.raridade) === norm(r[0]); })];
      });
      var semRar = mats.filter(function (x) { return !RARIDADES.some(function (r) { return norm(r[0]) === norm(x.raridade); }); });
      h += moldura('materiais', 'Materiais', '<div class="fp-mats">' + porRar.map(function (p) {
        return '<div class="fp-mat fp-mat-' + p[0][1] + '" data-raridade="' + p[0][1] + '"><h4 class="fp-tier-tit">' + raridade(p[0][0]) + '</h4>' +
          (p[1].length ? '<ul class="fp-mat-lista">' + p[1].map(function (x) {
            return '<li><span class="fp-mat-nome">' + esc(semEmoji(x.nome)) + '</span><span class="fp-item-qtd"><span class="fp-rot">Qtd</span>' +
              nEstado('inventario.' + x.uid + '.qtd', qtdDe(x)) + '</span></li>';
          }).join('') + '</ul>' : '<p class="fp-nota">—</p>') + '</div>';
      }).join('') + (semRar.length ? '<div class="fp-mat"><h4 class="fp-tier-tit">Sem raridade</h4><ul class="fp-mat-lista">' + semRar.map(function (x) {
        return '<li><span class="fp-mat-nome">' + esc(semEmoji(x.nome)) + '</span></li>';
      }).join('') + '</ul></div>' : '') + '</div>');
      return h;
    };

    // ======================================================================
    // 5. Grimório (A4 pág. 5): magias por nível 1–5
    // ======================================================================
    var STATS_MAGIA = [['acao', 'Ação'], ['alvo', 'Alvo'], ['resistencia', 'Resist.'], ['alcance', 'Alcance'], ['duracao', 'Duração']];
    function cardMagia(e, c, res, C) {
      var nos = res.av.nos;
      var nome = c ? semEmoji(c.nome) : semEmoji(e.cache && e.cache.nome) || '(sem nome)';
      var stats = {};
      lista(c && c.stats).forEach(function (s) { if (obj(s) && s.chave && stats[s.chave] == null) stats[s.chave] = s.valor; });
      if (stats.acao == null && c && c.acoes) stats.acao = c.acoes.texto;
      // o nó do custo: o da entrada (o motor nomeia magia.<id>.custo)
      var caminho = null;
      lista(res.av.ordem).forEach(function (k) {
        var no = nos[k];
        if (!caminho && /^magia\..+\.custo$/.test(k) && no && no.magia && e.id && no.magia.id === e.id) caminho = k;
      });
      var noC = caminho ? nos[caminho] : null;
      var custo = noC ? '<div class="fp-mg-custo" data-campo="custo">' + lista(noC.porIntensidade).map(function (pi) {
        var cel = !pi.permitida ? '<span class="fp-nulo" title="' + esc(pi.nome + ' fora das intensidades desta magia') + '">—</span>'
          : C.conta(caminho + '.' + pi.intensidade, { no: pi.no, semSelos: true });
        return '<span class="fp-mg-int' + (pi.escolhida ? ' fp-escolhida' : '') + (!pi.permitida ? ' fp-mg-int-off' : '') + '">' +
          '<span class="fp-rot">' + esc(pi.nome) + '</span>' + cel + '</span>';
      }).join('') + '</div>' : '<p class="fp-nota">Custo indisponível (magia sem par no catálogo).</p>';
      var nv = c ? c.nivel : noC && noC.magia ? noC.magia.nivel : null;
      return '<article class="fp-mg' + (!c ? ' fp-orfa' : '') + '" data-moldura' + (e.id ? ' data-id="' + esc(e.id) + '"' : '') + (!c ? ' data-orfa' : '') + '>' +
        '<header class="fp-tec-cab"><h4 class="fp-tec-nome" data-campo="nome">' + esc(nome) + '</h4>' +
        (c && c.escola ? '<span class="fp-mg-escola">' + esc(ESCOLAS[c.escola] || c.escola) + '</span>' : '') +
        (!c ? selo('orfa', 'órfã', 'Sem par no catálogo. Mostra o texto salvo na ficha.') : '') +
        (nv === 5 ? selo('trava', 'Foco Primordial', 'O Nível 5 exige Foco Primordial') : '') + '</header>' +
        '<dl class="fp-mg-stats">' + STATS_MAGIA.map(function (s) {
          return '<div data-campo="' + s[0] + '"><dt>' + esc(s[1]) + '</dt><dd>' + (stats[s[0]] != null && str(stats[s[0]]) ? textoRico(stats[s[0]]) : vazio()) + '</dd></div>';
        }).join('') + '</dl>' + custo +
        '<p class="fp-tec-txt" data-campo="texto">' + (c && c.resumo ? textoRico(c.resumo) : e.cache && e.cache.resumo ? textoRico(e.cache.resumo) : vazio()) + '</p></article>';
    }
    RENDER.grimorio = function (res, C, ctx) {
      var f = res.ficha, h = '';
      var mg = lista(f.entradas).filter(function (e) { return obj(e) && e.tipo === 'magia'; }).map(function (e) {
        var c = resolver(ctx, e);
        var por = ctx.D.magia && ctx.D.magia.porId && e.id ? ctx.D.magia.porId[e.id] : null;
        return { e: e, c: c, nivel: c ? c.nivel : por ? por.nivel : null };
      });
      var mist = f.pericias ? Number(f.pericias.mistico) || 0 : 0;
      var rot = lista(ctx.D.graus && ctx.D.graus.rotulos);
      var nota = 'Conjurar exige Treinado em Místico e o Foco da escola. O Nível 1 não tem Contida; o Nível 5 exige Foco Primordial. ' +
        'Custo nas 4 intensidades, com a conta; a marcada é a escolhida na ficha.';
      if (mg.length) {
        h += '<p class="fp-mg-req ' + (mist >= 1 ? 'fp-req-ok' : 'fp-req-aviso') + '">' +
          (mist >= 1 ? 'Místico: ' + esc(rot[mist] || 'Treinado') + ' (ok).' : 'Aviso: não Treinado em Místico.') + '</p>';
      }
      for (var nv = 1; nv <= 5; nv++) {
        var doNivel = mg.filter(function (m) { return m.nivel === nv; });
        h += moldura('magias-nivel-' + nv, 'Nível ' + nv, doNivel.length
          ? '<div class="fp-mgs">' + doNivel.map(function (m) { return cardMagia(m.e, m.c, res, C); }).join('') + '</div>'
          : '<p class="fp-nota">Nenhuma magia de nível ' + nv + '.</p>', { cls: 'fp-bloco-nivel' });
      }
      var sem = mg.filter(function (m) { return !(m.nivel >= 1 && m.nivel <= 5); });
      if (sem.length) {
        h += moldura('magias-orfas', 'Sem nível (órfãs)', '<div class="fp-mgs">' + sem.map(function (m) { return cardMagia(m.e, m.c, res, C); }).join('') + '</div>');
      }
      return '<p class="fp-nota fp-nota-topo">' + esc(nota) + '</p>' + h;
    };

    // a passada inteira: topo + um html por painel, com UMA instância do KhConta
    // (ids fp-d-1, fp-d-2… únicos na página toda).
    // op: {dados (o do KhPrevia.carregar), D (KhRegras.dados()), base (raiz do site, para images/)}
    function render(res, op) {
      op = obj(op) ? op : {};
      var ok = !!res && res.estado === 'ok';
      var D = op.D || (KhRegras ? KhRegras.dados() : {});
      var C = ok && KhConta ? KhConta.criar({ D: D, nos: res.av ? res.av.nos : null,
        prefixo: PREFIXO, esc: esc, fmt: KhRegras ? KhRegras.fmt : undefined, semEmoji: semEmoji }) : null;
      var ctx = ok ? contexto(op.dados, D, op.base) : null;
      var paineis = {};
      ABAS.forEach(function (a) {
        var corpo;
        if (!ok) corpo = '<p class="fp-nota">' + esc(mensagemEstado(res) || CARREGANDO) + '</p>';
        else if (typeof RENDER[a.id] === 'function') {
          // uma aba que falha não derruba as outras
          try { corpo = '<div class="fp-corpo fp-corpo-' + a.id + '">' + RENDER[a.id](res, C, ctx) + '</div>'; } catch (e) {
            corpo = '<p class="fp-estado fp-estado-aviso">Esta aba falhou ao desenhar: ' + esc(e && e.message) + '</p>';
          }
        } else corpo = '<p class="fp-nota">' + esc(EM_CONSTRUCAO) + '</p>';
        paineis[a.id] = corpo;
      });
      return { topo: htmlTopo(res), paineis: paineis, caminhos: C ? C.caminhos : [] };
    }

    // ---------------- a dica da conta dentro da página ----------------
    // A dica nasce centrada sob o número (css: translateX(-50%) mais --fp-dx).
    // Ao abrir (hover ou foco), o JS a mede e a empurra para dentro da caixa da
    // página (#fp, que fica à direita da nav fixa e à esquerda da calha da aba
    // FICHA): nunca passa da janela (sem rolagem horizontal) nem fica embaixo da
    // nav. Sem espaço embaixo e com espaço em cima, abre para cima.
    // Puro: r = retângulo da dica sem deslocamento; lim = {min, max} em x.
    var MARGEM_DICA = 8;
    function encaixeDica(r, lim) {
      var dx = 0;
      if (r.right > lim.max) dx = lim.max - r.right;
      if (r.left + dx < lim.min) dx = lim.min - r.left;
      return Math.round(dx);
    }
    // a dica de uma conta (.kh-conta) aberta agora; false se ainda está fechada
    function encaixa(conta, caixa, win) {
      var d = conta && conta.querySelector ? conta.querySelector('.kh-conta-dica') : null;
      if (!d || !d.getBoundingClientRect || !caixa) return false;
      d.style.removeProperty('--fp-dx');
      d.style.removeProperty('max-width');
      conta.removeAttribute('data-dica-acima');
      var r = d.getBoundingClientRect();
      if (!r.width) return false;
      var c = caixa.getBoundingClientRect();
      var lim = { min: c.left + MARGEM_DICA, max: c.right - MARGEM_DICA };
      if (r.width > lim.max - lim.min) {
        d.style.maxWidth = Math.max(0, Math.floor(lim.max - lim.min)) + 'px';
        r = d.getBoundingClientRect();
      }
      var dx = encaixeDica(r, lim);
      if (dx) d.style.setProperty('--fp-dx', dx + 'px');
      var alto = win && win.innerHeight, rc = conta.getBoundingClientRect();
      if (alto && r.bottom > alto - MARGEM_DICA && rc.top - 6 - r.height >= MARGEM_DICA) conta.setAttribute('data-dica-acima', '');
      return true;
    }

    // ---------------- redesenho sem perder o lugar ----------------
    // A página redesenha o topo e os painéis a cada mudança da ficha (kf:mudou,
    // campo do drawer, storage de outra aba). Antes de trocar o HTML de um
    // contêiner, guarda o que o jogador tinha nele: o elemento com o foco (pela
    // chave: o data-caminho da conta, ou o data-campo, ou a tag e a classe, mais
    // a ordem entre os de mesma chave), os <details> abertos e a conta sob o
    // mouse. Depois de trocar, devolve o foco ao equivalente (sem rolar; se ele
    // sumiu, à reserva), reabre os <details> e deixa a dica aberta até o mouse
    // se mexer. Contêiner cujo HTML não mudou não é tocado.
    var FOCAVEIS = 'a[href], button, summary, select, input, textarea, [tabindex]';
    function arr(x) { return Array.prototype.slice.call(x || []); }
    function qsa(cont, sel) { return cont && cont.querySelectorAll ? arr(cont.querySelectorAll(sel)) : []; }
    function chaveUI(el) {
      var c = el.getAttribute('data-caminho');
      if (c != null) return 'c:' + c;
      c = el.getAttribute('data-campo');
      if (c != null) return el.tagName + ':' + c;
      return el.tagName + '.' + str(el.getAttribute('class'));
    }
    // {chave, ordem} de el entre os elementos de mesma chave da lista
    function marcaUI(l, el) {
      if (!el) return null;
      var k = chaveUI(el), n = 0;
      for (var i = 0; i < l.length; i++) {
        if (l[i] === el) return { chave: k, ordem: n };
        if (chaveUI(l[i]) === k) n++;
      }
      return null;
    }
    // o equivalente na lista nova (se agora há menos dessa chave, o último)
    function achaUI(l, m) {
      if (!m) return null;
      var ult = null, n = 0;
      for (var i = 0; i < l.length; i++) {
        if (chaveUI(l[i]) !== m.chave) continue;
        if (n++ === m.ordem) return l[i];
        ult = l[i];
      }
      return ult;
    }
    function casa(el, sel) { try { return !!el.matches(sel); } catch (e) { return false; } }
    function foca(el) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }
    // troca o HTML de cont preservando foco, <details> abertos e a dica sob o
    // mouse; reserva = quem recebe o foco se o elemento focado sumiu. true se trocou.
    function trocaHTML(doc, cont, html, reserva, caixa, win) {
      if (!cont || cont._fpHtml === html) return false;
      var ativo = doc.activeElement;
      var dentro = !!ativo && ativo !== cont && !!cont.contains && cont.contains(ativo);
      var foco = dentro ? marcaUI(qsa(cont, FOCAVEIS), ativo) : null;
      var visivel = dentro && (casa(ativo, ':focus-visible') || ativo.hasAttribute('data-fp-foco'));
      var dets = qsa(cont, 'details');
      var abertos = dets.filter(function (d) { return d.open; }).map(function (d) { return marcaUI(dets, d); });
      var contas = qsa(cont, '.kh-conta');
      var sob = null;
      contas.some(function (c) { if (casa(c, ':hover') || c.hasAttribute('data-fp-dica')) { sob = marcaUI(contas, c); } return !!sob; });

      cont.innerHTML = html;
      cont._fpHtml = html;

      dets = qsa(cont, 'details');
      abertos.forEach(function (m) { var d = achaUI(dets, m); if (d) d.open = true; });
      if (sob) {
        var s = achaUI(qsa(cont, '.kh-conta'), sob);
        if (s) {
          s.setAttribute('data-fp-dica', '');
          if (caixa) caixa._fpDica = true;   // o próximo movimento do mouse a solta (montar)
          encaixa(s, caixa, win);
        }
      }
      if (dentro) {
        var el = foco ? achaUI(qsa(cont, FOCAVEIS), foco) : null;
        if (!el) el = reserva || (cont.hasAttribute('tabindex') ? cont : null);
        if (el && el.focus) {
          foca(el);
          // o foco por teclado segue visível (contorno e dica) no elemento novo
          if (visivel && !casa(el, ':focus-visible')) el.setAttribute('data-fp-foco', '');
          if (el.getAttribute('data-caminho') != null) encaixa(el, caixa, win);
        }
      }
      return true;
    }

    // ---------------- página (navegador) ----------------
    function iniciar(win) {
      if (!win || !win.document) return false;
      var doc = win.document;
      // o script vem no fim do <body>: o #fp já existe e a casca entra antes do
      // primeiro desenho; sem ele (carregado fora de ordem), espera o DOM
      if (doc.getElementById('fp')) return montar(win);
      if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', function () { montar(win); });
        return true;
      }
      return false;
    }

    function montar(win) {
      var doc = win.document;
      var raizEl = doc.getElementById('fp');
      if (!raizEl || raizEl.getAttribute('data-fp') != null) return false;
      var ls = null, search = '';
      try { ls = win.localStorage; } catch (e) { ls = null; }
      try { search = win.location ? win.location.search : ''; } catch (e) { search = ''; }
      if (!ativa(search, ls)) {
        raizEl.setAttribute('data-fp', 'aviso');
        raizEl.innerHTML = htmlAviso();
        return false;
      }
      raizEl.setAttribute('data-fp', 'casca');
      var ss = null;
      try { ss = win.sessionStorage; } catch (e) { ss = null; }
      // a ordem do navegador e a aba aberta nesta sessão (a 1ª da ordem, sem ela)
      var ids = idsAbas();
      var ordem = KhAbas ? KhAbas.lerOrdem(ls, ids) : ids;
      var aberta = (KhAbas && KhAbas.lerAberta(ss, ids)) || ordem[0];
      raizEl.innerHTML = htmlCasca(aberta, ordem);

      function el(id) { return doc.getElementById(id); }

      raizEl.addEventListener('click', function (e) {
        var t = e.target;
        if (t && t.closest && t.closest('.fp-abrir-v2')) {
          if (win.KF && typeof win.KF.abrir === 'function') win.KF.abrir();
        }
        // o painel da prévia não abre aqui, então a saída fica na própria página:
        // apaga a chave da prévia e recarrega sem ?ficha=v3 (volta ao aviso)
        if (t && t.closest && t.closest('.fp-sair-previa')) {
          try { if (ls) ls.removeItem('khalkaria_ficha_previa'); } catch (err) { /* storage bloqueado */ }
          try { if (ss) ss.removeItem('khalkaria_ficha_previa_recolhida'); } catch (err) { /* idem */ }
          if (win.location && typeof win.location.replace === 'function') win.location.replace(win.location.pathname);
        }
      });
      // a lista de abas é do KhAbas (F4.5): clique, setas, Home, End, Alt+setas
      // (KhTeclas), arrasto, "Ordem do A4", e as duas preferências no storage
      var rotulos = {};
      ABAS.forEach(function (a) { rotulos[a.id] = a.rotulo; });
      if (KhAbas) {
        KhAbas.criar(el('fp-abas'), { win: win, doc: doc, ids: ids, ls: ls, ss: ss, aberta: aberta, rotulos: rotulos,
          restaurar: el('fp-abas-a4'), anuncio: el('fp-abas-anuncio'), textoRestaurada: RESTAURADA,
          aoSelecionar: function (id) { aberta = id; } });
      }

      // a dica da conta, ao abrir (hover ou foco), fica dentro da caixa da página
      function aoAbrirDica(e) {
        var c = e.target && e.target.closest ? e.target.closest('.kh-conta') : null;
        if (!c) return;
        if (e.type === 'mouseover' && e.relatedTarget && c.contains && c.contains(e.relatedTarget)) return;
        // fechada ainda (o :hover/:focus-visible entra no quadro seguinte): mede de novo
        if (!encaixa(c, raizEl, win) && win.requestAnimationFrame) win.requestAnimationFrame(function () { encaixa(c, raizEl, win); });
      }
      raizEl.addEventListener('mouseover', aoAbrirDica);
      raizEl.addEventListener('focusin', aoAbrirDica);
      // as marcas do redesenho (trocaHTML) valem até o jogador agir: o foco sai, o mouse mexe
      raizEl.addEventListener('focusout', function (e) {
        if (e.target && e.target.removeAttribute) e.target.removeAttribute('data-fp-foco');
      });
      doc.addEventListener('mousemove', function () {
        if (!raizEl._fpDica) return;
        raizEl._fpDica = false;
        qsa(raizEl, '[data-fp-dica]').forEach(function (x) { x.removeAttribute('data-fp-dica'); });
      }, { passive: true });

      if (!KhPrevia || !KhRegras || !KhConta || typeof win.fetch !== 'function') {
        pinta({ estado: 'sem-motor', erros: [] });
        return true;
      }
      var s = doc.querySelector('script[src*="js/ficha.js"]');
      var src = s ? s.src : '';
      var base = '', versao = '';
      try { base = src ? new URL('../', src).href : ''; versao = src ? new URL(src).search : ''; } catch (e) { /* relativo à página */ }

      var dados = null, t = null;
      // redesenha sem perder o lugar do jogador (trocaHTML): foco, <details>, dica
      function pinta(r0) {
        var r = render(r0, { dados: dados, base: base || '../' });
        trocaHTML(doc, el('fp-topo'), r.topo, el('fp-aba-' + aberta), raizEl, win);
        ABAS.forEach(function (a) {
          var p = el('fp-painel-' + a.id);
          if (!p) return;
          trocaHTML(doc, p, r.paineis[a.id], p, raizEl, win);
          p.removeAttribute('aria-busy');
        });
      }
      function desenha() { if (dados) pinta(KhPrevia.calcular(ls, dados, versao)); }
      // a ficha atual (v2) é editada no drawer desta mesma página ou em outra aba:
      // redesenha 350 ms depois (o drawer grava com debounce de 200 ms)
      function agenda() { clearTimeout(t); t = setTimeout(desenha, 350); }
      doc.addEventListener('kf:mudou', agenda);
      doc.addEventListener('input', function (e) { if (e.target && e.target.closest && e.target.closest('#kf-drawer')) agenda(); }, true);
      doc.addEventListener('change', function (e) { if (e.target && e.target.closest && e.target.closest('#kf-drawer')) agenda(); }, true);
      win.addEventListener('storage', function (e) { if (e && e.key === CHAVE_V2) agenda(); });

      KhPrevia.carregar(win.fetch.bind(win), base, versao).then(function (d) {
        dados = d;
        // o sprite g-* (moldura de raízes, ramos, selo) entra uma vez, antes do desenho
        var sp = el('fp-sprite');
        if (sp && d && d.glifos) sp.innerHTML = d.glifos;
        desenha();
      }, function (e) {
        pinta({ estado: 'falha', erro: str(e && e.message), erros: [] });
      });
      return true;
    }

    return { CHAVE_PREVIA: CHAVE_PREVIA, AVISO: AVISO, AVISO_RO: AVISO_RO, PREFIXO: PREFIXO,
      ABAS: ABAS.map(function (a) { return { id: a.id, pag: a.pag, rotulo: a.rotulo }; }), RENDER: RENDER,
      MOLDURAS: MOLDURAS, ativa: ativa, ordemAbas: ordemAbas, htmlAviso: htmlAviso, htmlCasca: htmlCasca, htmlTopo: htmlTopo,
      contexto: contexto, resolver: resolver, textoRico: textoRico, render: render,
      encaixeDica: encaixeDica, encaixa: encaixa, trocaHTML: trocaHTML, FOCAVEIS: FOCAVEIS, iniciar: iniciar };
  })();

  if (emNode) { module.exports = FichaPagina; return; }
  raiz.KhFichaPagina = FichaPagina;
  try { FichaPagina.iniciar(raiz); } catch (e) { /* a página nunca derruba o resto (nav, ficha atual) */ }
})(typeof window !== 'undefined' ? window : this);
