/* Khalkaria — Ficha · KhFichaAbas: o desenho das 5 abas da ficha nova (F4.4a), PURO (devolve string).
 * Especificação: docs/ficha-digital/06-f4-drawer.md ("Render das abas: o MESMO
 * da página, sem cópia") e 05-f4-pagina.md (as 5 abas, F4.3b).
 *
 * Mora no bundle (js/ficha.js), e não no js/ficha-pagina.js, porque tem dois
 * donos: a página da ficha (pages/ficha.html, prefixo 'fp', densidade
 * 'pagina') e o drawer da F4.4 (todas as páginas, prefixo 'fd', densidade
 * 'compacta'). Carregar este arquivo não muda nada: não toca DOM, storage nem
 * rede; só desenha quando alguém chama.
 *
 *   var A = KhFichaAbas.criar({ prefixo: 'fp', densidade: 'pagina' });
 *   var r = A.paineis(res, { dados, D, base });   // res = KhPrevia.calcular(...)
 *   r.paineis.nucleo, r.paineis.tecnicas, …       // um html por aba (KhFichaAbas.ABAS)
 *   r.caminhos                                    // os caminhos mostrados com conta, na ordem
 *   A.RENDER[id](res, C, ctx)                     // o desenhista de uma aba
 *
 * Prefixo: vai em toda classe que o desenho cria (<p>-bloco, <p>-at, <p>-tec…),
 * na variável de cor do ramo (--<p>-ramo) e no KhConta da passada (ids
 * <p>-d-1, <p>-d-2…: uma instância do KhConta por chamada a paineis, ids únicos
 * no HTML todo). Dois prefixos convivem na mesma página sem colidir (a página
 * 'fp', o drawer 'fd', a prévia 'kf3'). As classes dos componentes do site
 * (.kh-conta, .kh-regua…) não levam prefixo.
 *
 * Densidade: 'pagina' (a página, 1240 px) ou 'compacta' (o drawer, 380 px). O
 * CONTEÚDO é o mesmo nas duas: os mesmos campos, data-campo, molduras e contas.
 * A compacta só marca o corpo de cada aba (data-densidade="compacta"), e o CSS
 * dela (css/ficha-drawer.css, injetado pelo drawer só com a prévia) arruma em
 * uma coluna. A 'pagina' não marca nada: o HTML da página é o de antes da
 * extração, byte a byte (tools/testes/ficha-pagina-ouro.test.js).
 *
 * Cada desenhista recebe res (KhPrevia.calcular, estado 'ok'), C (o KhConta da
 * passada) e ctx (contexto(): catálogo indexado, classes, ramos, dados das
 * regras e a base dos ícones). Número calculado sai com a conta; número que é
 * ESTADO da ficha (atual de recurso, Sins, XP, quantidade…) vai num
 * span.<p>-n[data-ficha="<caminho na ficha v3>"]. Cada campo da ficha física
 * leva data-campo (o teste da página confere por conjunto contra o 03 §4).
 *   1 Núcleo · 2 Técnicas & Marcas · 3 Cartas, Lore & Outros · 4 O Bazar · 5 Grimório
 * Uma aba que lança não derruba as outras ("falhou ao desenhar"); aba sem
 * desenhista fica "em construção".
 *
 * Cartas raras: só ícone, requisito e nome, NUNCA o efeito (D11, D33; nem o
 * texto que a v2 tenha guardado). Técnica sem par no catálogo: o texto salvo e
 * a marca "órfã". Recurso de classe que não é contador (D105): as características.
 *
 * No node exporta por module.exports (carregado sozinho); no artefato js/ficha.js
 * o export já é o KhInv e este módulo só registra window.KhFichaAbas no navegador.
 * Vem no ORDEM depois do kh-previa.js (os avisos são os da prévia,
 * KhPrevia.listaAvisos, fonte única).
 * Fonte: js/ficha/kh-ficha-abas.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhPrevia = emNode ? require('./kh-previa.js') : raiz.KhPrevia;
  var KhRegras = emNode ? require('./kh-regras.js') : raiz.KhRegras;
  var KhConta = emNode ? require('./kh-conta.js') : raiz.KhConta;
  var KhEstado = emNode ? require('./kh-estado.js') : raiz.KhEstado;
  var KhInv = emNode ? require('./kh-inv.js') : raiz.KhInv;

  var KhFichaAbas = (function () {
    var PREFIXO = 'fp';
    var RE_PREFIXO = /^[a-z][a-z0-9-]*$/i;   // o mesmo do KhConta
    var DENSIDADES = ['pagina', 'compacta'];
    var CARREGANDO = 'Carregando a ficha…';
    var EM_CONSTRUCAO = 'Esta aba ainda está em construção.';
    // As 5 abas, na ordem da ficha física (pág. 1 a 5 do A4). O id é estável:
    // a F4.5 guarda a ordem por id (khalkaria_ficha_abas), a mesma na página e no drawer.
    var ABAS = [
      { id: 'nucleo', pag: 1, rotulo: 'Núcleo' },
      { id: 'tecnicas', pag: 2, rotulo: 'Técnicas & Marcas' },
      { id: 'cartas', pag: 3, rotulo: 'Cartas, Lore & Outros' },
      { id: 'bazar', pag: 4, rotulo: 'O Bazar' },
      { id: 'grimorio', pag: 5, rotulo: 'Grimório' }
    ];

    // ---------------- vocabulário da ficha ----------------
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

    // ---------------- puras ----------------
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
    function fmtPc(n) { return String(Math.round(n * 10) / 10); }
    function tokens(cat) { return str(cat).split(',').map(function (t) { return t.trim(); }).filter(Boolean); }
    function rarDe(r) { var n = norm(r); return RARIDADES.filter(function (p) { return norm(p[0]) === n; })[0] || null; }

    function mensagemEstado(res) {
      if (!res) return '';
      if (res.estado === 'sem-ficha') return 'Não há ficha neste navegador. Crie ou importe uma na ficha atual (FICHA) e ela aparece aqui.';
      if (res.estado === 'erro') return 'A ficha deste navegador não pôde ser lida (' + str(res.erro) + (res.versao ? ' ' + str(res.versao) : '') + ').';
      if (res.estado === 'falha') return 'O motor falhou ao calcular: ' + str(res.erro);
      if (res.estado === 'sem-motor') return 'O motor da ficha (js/ficha.js) não carregou. Recarregue a página.';
      return '';
    }

    function refNome(r) { return obj(r) && (r.id || r.nome) ? semEmoji(r.nome) || str(r.id) : ''; }

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

    // ---------------- técnicas, inventário e magias (puras) ----------------
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
    var STATS_MAGIA = [['acao', 'Ação'], ['alvo', 'Alvo'], ['resistencia', 'Resist.'], ['alcance', 'Alcance'], ['duracao', 'Duração']];

    // ======================================================================
    // Uma instância: o desenho com um prefixo e uma densidade.
    // op: {prefixo ('fp' por padrão; letras, dígitos e hífen), densidade ('pagina' | 'compacta')}
    // ======================================================================
    function criar(op) {
      op = obj(op) ? op : {};
      var P = op.prefixo == null ? PREFIXO : str(op.prefixo);
      if (!RE_PREFIXO.test(P)) throw new Error('KhFichaAbas: prefixo inválido "' + P + '" (letras, dígitos e hífen)');
      var densidade = op.densidade == null ? DENSIDADES[0] : str(op.densidade);
      if (DENSIDADES.indexOf(densidade) < 0) throw new Error('KhFichaAbas: densidade inválida "' + densidade + '" (' + DENSIDADES.join(' | ') + ')');
      // a marca no corpo de cada aba: só a compacta (a página fica como era)
      var MARCA = densidade === DENSIDADES[0] ? '' : ' data-densidade="' + densidade + '"';
      // um desenhista por aba
      var RENDER = {};

      // ícones que não são do A4: traço em currentColor, sem emoji
      var SVG_RARA = '<svg class="' + P + '-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.2l2.5 5.6 6.1.6-4.6 4.1 1.3 6-5.3-3.1-5.3 3.1 1.3-6-4.6-4.1 6.1-.6Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="12" cy="12.6" r="1.4" fill="currentColor"/></svg>';
      var SVG_UNIVERSAL = '<svg class="' + P + '-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3.8 12h16.4M12 3.8c2.4 2.4 3.4 5.2 3.4 8.2s-1 5.8-3.4 8.2M12 3.8C9.6 6.2 8.6 9 8.6 12s1 5.8 3.4 8.2" fill="none" stroke="currentColor" stroke-width="1" opacity=".7"/></svg>';
      var SVG_ACOES = '<svg class="' + P + '-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.4v3.2M12 17.4v3.2M3.4 12h3.2M17.4 12h3.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="12" cy="12" r="5.2" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>';
      // moldura gótica: o canto de raízes do sprite partials/glifos.html, girado pelo CSS
      var CANTOS = ['te', 'td', 'be', 'bd'].map(function (p) {
        return '<svg class="' + P + '-canto ' + P + '-canto-' + p + '" aria-hidden="true" focusable="false"><use href="#g-moldura-raizes-canto"/></svg>';
      }).join('');
      // número de ESTADO (não calculado): o caminho na ficha v3 vai no data-ficha
      function nEstado(caminho, v, un) {
        return '<span class="' + P + '-n" data-ficha="' + esc(caminho) + '">' + esc(v == null || v === '' ? '—' : fmt(v)) + esc(un || '') + '</span>';
      }
      function vazio() { return '<span class="' + P + '-vazio">—</span>'; }
      function img(ctx, nome, cls) {
        return '<img class="' + cls + '" src="' + esc(ctx.base + 'images/ficha/' + nome + '.webp') + '" alt="" decoding="async">';
      }
      // bloco com a moldura de raízes; campo = data-campo (a peça da ficha física)
      function moldura(campo, titulo, corpo, op) {
        op = op || {};
        return '<section class="' + P + '-bloco' + (op.cls ? ' ' + op.cls : '') + '" data-campo="' + esc(campo) + '"' + (op.attrs || '') + '>' + CANTOS +
          (titulo ? '<h3 class="' + P + '-bloco-tit">' + (op.ico || '') + '<span class="' + P + '-bloco-nome">' + esc(titulo) + '</span>' +
            (op.extra ? '<span class="' + P + '-bloco-extra">' + op.extra + '</span>' : '') + '</h3>' : '') +
          (op.nota ? '<p class="' + P + '-nota">' + op.nota + '</p>' : '') + corpo + '</section>';
      }
      function selo(cls, texto, titulo) {
        return '<span class="' + P + '-selo ' + P + '-selo-' + cls + '"' + (titulo ? ' title="' + esc(titulo) + '"' : '') + '>' + esc(texto) + '</span>';
      }
      function raridade(r) {
        var x = rarDe(r);
        return x ? '<span class="' + P + '-rar ' + P + '-rar-' + x[1] + '">' + esc(x[0]) + '</span>' : (r ? '<span class="' + P + '-rar">' + esc(r) + '</span>' : '');
      }

      // ======================================================================
      // 1. Núcleo (A4 pág. 1)
      // ======================================================================
      RENDER.nucleo = function (res, C, ctx) {
        var f = res.ficha, nos = res.av.nos, D = ctx.D, conta = C.conta, h = '';
        var meta = f.meta || {}, idt = f.identidade || {};

        // ---- identidade
        function idCampo(campo, rot, val, cls) {
          return '<div class="' + P + '-id' + (cls ? ' ' + cls : '') + '" data-campo="' + campo + '"><dt>' + esc(rot) + '</dt><dd>' + (val || vazio()) + '</dd></div>';
        }
        function idRef(campo, rot, r) {
          if (!obj(r) || !(r.id || r.nome)) return campo === 'raca' || campo === 'classe' || campo === 'origem' ? idCampo(campo, rot, '') : '';
          return idCampo(campo, rot, esc(refNome(r)) + (!r.id ? ' ' + selo('orfa', 'sem par', 'Sem par no catálogo: só o nome digitado') : ''));
        }
        h += moldura('identidade', 'Identidade', '<dl class="' + P + '-ident-grade">' +
          idCampo('nome', 'Nome do Personagem', esc(semEmoji(meta.nome)), P + '-id-largo') +
          idCampo('jogador', 'Jogador', esc(semEmoji(meta.jogador))) +
          idCampo('nivel', 'Nível', nEstado('meta.nivel', meta.nivel)) +
          idCampo('xp', 'XP', nEstado('meta.xp', meta.xp)) +
          idRef('raca', 'Raça', idt.raca) + idRef('variante', 'Variante', idt.variante) + idRef('subespecie', 'Subespécie', idt.subespecie) +
          idRef('classe', 'Classe', idt.classe) + idRef('ramo', 'Ramo', idt.ramo) + idRef('origem', 'Origem', idt.origem) +
          '</dl>', { cls: P + '-bloco-ident' });

        // ---- atributos: ilustração de traço, Total e Mod.
        h += moldura('atributos', 'Atributos', '<div class="' + P + '-ats">' + ATRIBUTOS.map(function (a) {
          return '<div class="' + P + '-at" data-campo="atributo-' + a[0] + '">' + img(ctx, a[2], P + '-at-img') +
            '<span class="' + P + '-at-nome">' + esc(a[1]) + '</span>' +
            '<span class="' + P + '-at-total"><span class="' + P + '-rot">Atributo</span>' + conta('atributo.' + a[0] + '.total') + '</span>' +
            '<span class="' + P + '-at-mod"><span class="' + P + '-rot">Mod.</span>' + conta('atributo.' + a[0] + '.mod', { texto: modTxt(nos['atributo.' + a[0] + '.mod']) }) + '</span>' +
            '</div>';
        }).join('') + '</div>',
        { nota: f.atributos && f.atributos.migradoTotal ? 'Total migrado da ficha atual: a raça, o nível e os efeitos de técnicas e cartas já estão dentro do número digitado.' : '' });

        // ---- perícias: 4 círculos de grau, o atributo usado e o total
        var graus = lista(D.graus && D.graus.rotulos), bonus = lista(D.graus && D.graus.bonus);
        // o Ofício(X) genérico da v2: a migração não escolhe qual dos três Ofícios
        // recebe o grau (pendência, escolha do jogador). Sem isto o grau sumia do
        // desenho: os três ficam com 0 círculos. Fica à vista junto deles.
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
            circ += '<span class="' + P + '-grau' + (i <= g ? ' on' : '') + '" title="' + esc((bonus[i] != null ? '+' + bonus[i] + ' ' : '') + (graus[i] || '')) + '"></span>';
          }
          return '<div class="' + P + '-per" data-campo="pericia-' + p.id + '">' +
            '<span class="' + P + '-per-graus" role="img" aria-label="' + esc('Grau ' + g + ' de 4' + (graus[g] ? ': ' + graus[g] : '')) + '">' + circ + '</span>' +
            // o selo (decisão, pendente…) vai junto do nome; a caixa de total fica só com o número
            '<span class="' + P + '-per-nome">' + esc(p.nome) + (no ? C.selosHTML(no.selos) : '') + (/^oficio-/.test(p.id) ? seloOf : '') + '</span>' +
            '<span class="' + P + '-per-at" title="' + esc(atTit) + '">' + esc(at) + '</span>' +
            '<span class="' + P + '-per-total">' + conta('pericia.' + p.id + '.total', { texto: no && typeof no.valor === 'number' ? modTxt(no) : null, semSelos: true }) + '</span></div>';
        }
        var pers = lista(D.pericias);
        // duas colunas como no A4: Atacar a Iniciativa | Conhecimento ao Ofício
        var corte = pers.map(function (p) { return p.id; }).indexOf('conhecimento');
        if (corte < 0) corte = Math.ceil(pers.length / 2);
        h += '<div class="' + P + '-duas"><div class="' + P + '-col">';
        h += moldura('pericias', 'Perícias', '<div class="' + P + '-pers"><div class="' + P + '-pers-col">' + pers.slice(0, corte).map(pericia).join('') +
          '</div><div class="' + P + '-pers-col">' + pers.slice(corte).map(pericia).join('') + '</div></div>',
        { extra: '<span class="' + P + '-legenda">' + bonus.slice(1).map(function (b, i) { return esc('+' + b + ' ' + (graus[i + 1] || '')); }).join(' · ') + '</span>',
          nota: gOf > 0 ? 'Pendência da migração: a ficha atual tinha um Ofício(X) genérico com grau ' +
            nEstado('migracao.pendencias.' + iOf + '.grau', gOf) + (graus[gOf] ? ' (' + esc(graus[gOf]) + ')' : '') +
            '. Escolha qual Ofício (Engenharia, Ferraria ou Alquimia) recebe o grau.' : '' });
        h += '</div><div class="' + P + '-col">';

        // ---- recursos: atual / máx., com as cores de recurso (D28)
        var rc = f.recursos || {};
        function barra(atual, max, cls) {
          var pc = typeof max === 'number' && max > 0 && typeof atual === 'number' ? Math.max(0, Math.min(1, atual / max)) * 100 : 0;
          return '<span class="' + P + '-barra ' + cls + '" aria-hidden="true"><span class="' + P + '-barra-fill" style="width:' + fmtPc(pc) + '%"></span></span>';
        }
        function recurso(id, nome, icone, extra) {
          var x = rc[id] || {}, no = nos['recurso.' + id + '.max'];
          return '<div class="' + P + '-rec ' + P + '-rec-' + id + '" data-campo="' + id + '">' + img(ctx, icone, P + '-rec-img') +
            '<span class="' + P + '-rec-nome">' + esc(nome) + '</span>' +
            '<span class="' + P + '-rec-num"><span class="' + P + '-rot">Atual</span>' + nEstado('recursos.' + id + '.atual', x.atual) +
            '<span class="' + P + '-barra-sep">/</span><span class="' + P + '-rot">Máx.</span>' + conta('recurso.' + id + '.max') + '</span>' +
            barra(x.atual, no && no.valor, P + '-barra-' + id) + (extra || '') + '</div>';
        }
        var noCl = nos['recurso.classe.max'];
        var recClasse;
        if (noCl && noCl.semContador) {
          // D105: o recurso da classe não é contador (Espadachim, Teurgo): as características, sem número
          recClasse = '<div class="' + P + '-rec ' + P + '-rec-classe ' + P + '-rec-sem" data-campo="recurso-classe"><span class="' + P + '-rec-ico">' + SVG_ACOES + '</span>' +
            '<span class="' + P + '-rec-nome">Recurso de Classe <span class="' + P + '-sub">sem contador (D105)</span></span>' +
            '<span class="' + P + '-rec-txt">' + conta('recurso.classe.max', { texto: lista(noCl.itens).map(semEmoji).join(' · ') }) + '</span></div>';
        } else {
          var nomeCl = noCl ? semEmoji(str(noCl.rotulo).replace(/\s*máx\.?$/i, '')) : '';
          var digitado = obj(rc.classe) ? semEmoji(rc.classe.nome) : '';
          if (noCl && !noCl.medidor && digitado) nomeCl = digitado;
          recClasse = '<div class="' + P + '-rec ' + P + '-rec-classe" data-campo="recurso-classe"><span class="' + P + '-rec-ico">' + SVG_ACOES + '</span>' +
            '<span class="' + P + '-rec-nome">Recurso de Classe' + (nomeCl ? ' <span class="' + P + '-sub">' + esc(nomeCl) + '</span>' : '') +
            (noCl && !noCl.medidor && digitado ? ' <span class="' + P + '-sub">(nome digitado na ficha atual; sem nome no contrato)</span>' : '') + '</span>' +
            '<span class="' + P + '-rec-num"><span class="' + P + '-rot">Atual</span>' + nEstado('recursos.classe.atual', obj(rc.classe) ? rc.classe.atual : null) +
            '<span class="' + P + '-barra-sep">/</span><span class="' + P + '-rot">Máx.</span>' + conta('recurso.classe.max') + '</span>' +
            barra(obj(rc.classe) ? rc.classe.atual : null, noCl && noCl.valor, P + '-barra-classe') + '</div>';
        }
        var sau = rc.saude || {}, sta = rc.stamina || {};
        h += moldura('recursos', 'Recursos',
          recurso('saude', 'Saúde', 'saude', sau.temporaria ? '<span class="' + P + '-rec-extra"><span class="' + P + '-rot">Temporária</span>' + nEstado('recursos.saude.temporaria', sau.temporaria) + '</span>' : '') +
          recurso('stamina', 'Stamina', 'stamina', '<span class="' + P + '-rec-extra">' +
            (sta.comprometida ? '<span class="' + P + '-rot">Comprometida</span>' + nEstado('recursos.stamina.comprometida', sta.comprometida) + ' ' : '') +
            '<span class="' + P + '-rot">Disponível</span>' + conta('recurso.stamina.disponivel') + '</span>') +
          recurso('eter', 'Éter', 'eter') + recClasse +
          alertasRecurso(res));

        // ---- derivados: Evasão, CD, Movimento, Ações, Sins
        function tile(campo, rot, icone, corpo) {
          return '<div class="' + P + '-der" data-campo="' + campo + '">' + icone + '<span class="' + P + '-der-rot">' + esc(rot) + '</span><span class="' + P + '-der-val">' + corpo + '</span></div>';
        }
        h += moldura('derivados', 'Evasão, CD e Movimento', '<div class="' + P + '-ders">' +
          tile('evasao', 'Evasão', img(ctx, 'evasao', P + '-der-img'),
            '<span class="' + P + '-par"><span class="' + P + '-rot">Passiva</span>' + conta('evasao.passiva') + '</span>' +
            '<span class="' + P + '-par"><span class="' + P + '-rot">Ativa</span>' + conta('evasao.ativa') + '</span>') +
          tile('cd', 'CD', img(ctx, 'cd', P + '-der-img'), conta('cd')) +
          tile('movimento', 'Movimento', img(ctx, 'movimento', P + '-der-img'), conta('movimento', { un: ' m' })) +
          tile('acoes', 'Ações', '<span class="' + P + '-der-ico">' + SVG_ACOES + '</span>', conta('acoes')) +
          tile('sins', 'Sins', img(ctx, 'sins', P + '-der-img'), nEstado('inventario.sins', f.inventario ? f.inventario.sins || 0 : 0)) +
          '</div>');

        // ---- capacidade: Equipamentos e Bugigangas com régua e Sobrepeso
        h += moldura('capacidade', 'Capacidade', capacidade(res, C, ctx), { ico: img(ctx, 'mochila', P + '-tit-img') });
        h += '</div></div>';

        // ---- Armadura e resistências
        h += moldura('armadura', 'Armadura e Resistência', resistencias(res, C, D),
          { ico: img(ctx, 'armadura', P + '-tit-img'), nota: 'R = resistência, I = imunidade, V = vulnerabilidade, Ae = armadura específica; a redução junta Ar, Ae do tipo, da categoria e de Todos.' });

        // ---- Marcas da Vhelor: só com 1 ou mais (M5)
        var vh = f.vhelor && Number(f.vhelor.marcas) || 0;
        if (vh >= 1) {
          h += moldura('vhelor', 'Marcas da Vhelor', '<p class="' + P + '-vhelor">' + nEstado('vhelor.marcas', vh) + '<span class="' + P + '-sub"> de 7</span>' +
            (f.vhelor.abstinente ? ' ' + selo('aviso', 'em abstinência') : '') + '</p>', { cls: P + '-bloco-vhelor' });
        }
        // ---- imunidade a condição e idiomas: só quando há
        var imc = lista(f.imunidadesCondicao), idi = lista(f.idiomas);
        if (imc.length || idi.length) {
          h += moldura('outros-nucleo', 'Imunidades e idiomas', '<dl class="' + P + '-ident-grade">' +
            (imc.length ? idCampo('imunidades', 'Imunidade a condição', esc(imc.map(function (x) { return semEmoji(obj(x) ? x.nome || x.id : x); }).join(', '))) : '') +
            (idi.length ? idCampo('idiomas', 'Idiomas', esc(idi.map(function (x) { return semEmoji(obj(x) ? x.nome || x.id : x); }).join(', '))) : '') + '</dl>');
        }
        h += avisos(res, C);
        return h;
      };
      // condições que o motor liga sozinho pelos recursos (Oco, Exaurido…)
      function alertasRecurso(res) {
        var al = lista(res.av.alertas).filter(function (a) { return a.recurso; });
        if (!al.length) return '';
        var pend = lista(res.ficha.migracao && res.ficha.migracao.pendencias);
        return '<ul class="' + P + '-alertas">' + al.map(function (a) {
          var daMigracao = pend.some(function (p) { return p.campo === 'recursos.' + a.recurso; });
          return '<li>' + esc(semEmoji(a.msg)) + (daMigracao ? ' <span class="' + P + '-sub">(pode ser efeito da migração: a ficha atual tinha 0/0)</span>' : '') + '</li>';
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
          return '<div class="' + P + '-cap ' + P + '-cap-' + (col ? col.estado : 'ok') + '" data-campo="' + pre + k + '">' +
            '<span class="' + P + '-cap-nome">' + esc(rot) + '</span>' +
            '<span class="' + P + '-cap-num"><span class="' + P + '-rot">Qtd</span>' + (col ? C.conta('carga', { texto: fmt(col.usado) }) : vazio()) +
            '<span class="' + P + '-barra-sep">/</span><span class="' + P + '-rot">Peso Máximo</span>' + C.conta('capacidade.' + k) + '</span>' + reg + '</div>';
        }
        return linha('equipamentos', 'Equipamentos') + linha('bugigangas', 'Bugigangas') +
          '<p class="' + P + '-cap-estado" data-campo="carga"><span class="' + P + '-rot">Estado</span>' +
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
          return '<span class="' + P + '-flag' + (no && no.valor ? ' on' : '') + '">' + conta(fam + '.' + t, { texto: no && no.valor ? letra : '·', semSelos: true }) + '</span>';
        }
        var topo = '<div class="' + P + '-arm-topo">' +
          '<span class="' + P + '-par" data-campo="ar"><span class="' + P + '-rot">Armadura (Ar)</span>' + conta('ar') + '</span>' +
          '<span class="' + P + '-par" data-campo="ae-todos"><span class="' + P + '-rot">Ae(Todos)</span>' + conta('ae.todos') + '</span></div>';
        return topo + '<div class="' + P + '-res-cats">' + grupos.map(function (g) {
          if (!g[1].length) return '';
          return '<div class="' + P + '-res-cat" data-categoria="' + g[0] + '">' +
            '<div class="' + P + '-res-cab"><span class="' + P + '-res-cat-nome">' + esc(NOME_CATEGORIA[g[0]]) + '</span>' +
            (g[0] !== 'outros' ? '<span class="' + P + '-par" data-campo="ae-' + g[0] + '"><span class="' + P + '-rot">Ae</span>' + conta('ae.' + g[0]) + '</span>'
              : '<span class="' + P + '-sub">sem Ae de categoria</span>') + '</div>' +
            '<div class="' + P + '-res-tab"><span class="' + P + '-res-h">Tipo</span><span class="' + P + '-res-h">R</span><span class="' + P + '-res-h">I</span>' +
            '<span class="' + P + '-res-h">V</span><span class="' + P + '-res-h">Ae</span><span class="' + P + '-res-h">Red.</span>' +
            g[1].map(function (t) {
              return '<div class="' + P + '-res-lin" data-campo="resistencia-' + t + '"><span class="' + P + '-tipo ' + P + '-tipo-' + t + '">' + esc(nomeTipo[t] || t) + '</span>' +
                flag('resistencia', t, 'R') + flag('imunidade', t, 'I') + flag('vulnerabilidade', t, 'V') +
                '<span class="' + P + '-res-n">' + conta('ae.' + t) + '</span><span class="' + P + '-res-n">' + conta('defesa.' + t) + '</span></div>';
            }).join('') + '</div></div>';
        }).join('') + '</div>';
      }

      // avisos do motor e da migração, recolhidos: a MESMA lista da prévia
      // (KhPrevia.listaAvisos, fonte única), com o grau da pendência e o selo do alerta
      function avisos(res, C) {
        var av = KhPrevia && KhPrevia.listaAvisos ? KhPrevia.listaAvisos(res, C.rotuloSelo) : [];
        if (!av.length) return '';
        return '<details class="' + P + '-avisos" data-campo="avisos"><summary>Avisos do motor e da migração (' + av.length + ')</summary><ul>' +
          av.map(function (x) { return '<li>' + esc(semEmoji(x)) + '</li>'; }).join('') + '</ul></details>';
      }

      // ======================================================================
      // 2. Técnicas & Marcas (A4 pág. 2)
      // ======================================================================
      function rotuloRamo(ramo, comCor) {
        return '<span class="' + P + '-tec-ramo"' + (comCor ? ' style="--' + P + '-ramo: var(--ramo-' + esc(ramo.classe) + '-' + esc(ramo.chave) + ')"' : '') + '>' +
          '<svg class="' + P + '-svg" aria-hidden="true" focusable="false"><use href="' + PREFIXO_GLIFO_RAMO + esc(ramo.chave) + '"/></svg>' +
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
        if (op.tipo) meta += '<span class="' + P + '-tec-tipo">' + esc(op.tipo) + '</span>';
        if (ramo && ramo.chave) meta += rotuloRamo(ramo, false);
        if (!c) {
          var o = e.orfao || {};
          meta += selo('orfa', 'órfã', 'Sem par no catálogo' + (o.motivo ? ' (' + o.motivo + (lista(o.candidatos).length ? ': ' + o.candidatos.join(', ') : '') + ')' : '') + '. Mostra o texto salvo na ficha.');
        }
        if (op.destrava && op.destrava > op.nivel) meta += selo('trava', 'destrava no nível ' + op.destrava, 'Acima do nível do personagem (D34)');
        var estilo = ramo && ramo.chave ? ' style="--' + P + '-ramo: var(--ramo-' + esc(ramo.classe) + '-' + esc(ramo.chave) + ')"' : '';
        return '<article class="' + P + '-tec' + (ramo ? ' ' + P + '-tec-de-ramo' : '') + (!c ? ' ' + P + '-orfa' : '') + (op.destrava && op.destrava > op.nivel ? ' ' + P + '-acima' : '') + '"' +
          ' data-moldura data-tipo="' + esc(e.tipo) + '"' + (e.id ? ' data-id="' + esc(e.id) + '"' : '') + (!c ? ' data-orfa' : '') + estilo + '>' +
          '<header class="' + P + '-tec-cab"><h4 class="' + P + '-tec-nome">' + esc(nome) + '</h4>' +
          (custo ? '<span class="' + P + '-tec-custo" data-campo="custo">' + esc(custo) + '</span>' : '') + '</header>' +
          (meta ? '<div class="' + P + '-tec-meta">' + meta + '</div>' : '') +
          '<p class="' + P + '-tec-txt">' + (texto ? textoRico(texto) : vazio()) + '</p></article>';
      }
      function molduraVazia(nivelDestrava, nivel, cls) {
        var trava = nivelDestrava && nivelDestrava > nivel;
        return '<div class="' + P + '-tec ' + P + '-tec-vazia' + (cls ? ' ' + cls : '') + (trava ? ' ' + P + '-travada' : '') + '" data-moldura data-vazia' + (trava ? ' data-destrava="' + nivelDestrava + '"' : '') + '>' +
          (trava ? '<span class="' + P + '-trava-txt">destrava no nível ' + esc(nivelDestrava) + '</span>' : '<span class="' + P + '-vazia-txt">vazia</span>') + '</div>';
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
          return '<div class="' + P + '-tecs' + (op.cls ? ' ' + op.cls : '') + '">' + h + '</div>';
        }
        var h = '';
        h += moldura('tecnicas-gerais', 'Técnicas Gerais', grade(g.gerais, MOLDURAS.gerais));
        var tiers = [1, 2, 3].map(function (t) {
          var info = dv.tiers[t] || {}, itens = g['t' + t];
          var tit = t === 3 ? 'Tier 3 · Ultimates' : 'Tier ' + t;
          return '<div class="' + P + '-tier" data-campo="tier-' + t + '"><h4 class="' + P + '-tier-tit">' + esc(tit) +
            (info.nivel ? ' <span class="' + P + '-sub">nível ' + esc(info.nivel) + '+</span>' : '') + '</h4>' +
            grade(itens, info.n || MOLDURAS.tiers[t], { destravaDe: function () { return info.nivel || null; }, cls: P + '-tecs-tier' }) + '</div>';
        }).join('');
        var ramo = idt.ramo && idt.ramo.id ? ctx.ramos[idt.ramo.id] : null;
        h += moldura('tecnicas-ramo', 'Técnicas de Ramo', '<div class="' + P + '-tiers">' + tiers + '</div>',
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
        var ico = rara ? '<span class="' + P + '-carta-ico">' + SVG_RARA + '</span>'
          : CARTA_ICONE[cat] ? '<span class="' + P + '-carta-ico">' + img(ctx, CARTA_ICONE[cat], P + '-carta-img') + '</span>'
            : '<span class="' + P + '-carta-ico">' + SVG_UNIVERSAL + '</span>';
        // requisito: ok ou aviso, contra o Total do atributo (com a conta)
        var req = c ? lista(c.req) : [];
        var falta = req.filter(function (r) {
          var no = nos['atributo.' + r.attr + '.total'];
          return !no || typeof no.valor !== 'number' || no.valor < r.min;
        });
        var reqHTML = '';
        if (req.length) {
          reqHTML = '<p class="' + P + '-carta-req ' + P + '-req-' + (falta.length ? 'aviso' : 'ok') + '" data-campo="requisito">' +
            '<span class="' + P + '-req-txt">' + esc(c.reqTexto || req.map(function (r) { return r.attr + ' ' + r.min + '+'; }).join(', ')) + '</span>' +
            (falta.length ? ' <span class="' + P + '-req-marca">aviso:</span> ' + falta.map(function (r) {
              return '<span class="' + P + '-req-at">' + esc(r.attr) + ' ' + C.conta('atributo.' + r.attr + '.total') + '</span>';
            }).join(' ') : ' <span class="' + P + '-req-marca">ok</span>') + '</p>';
        } else if (c) {
          reqHTML = '<p class="' + P + '-carta-req ' + P + '-req-ok" data-campo="requisito"><span class="' + P + '-req-txt">sem requisito</span></p>';
        }
        var est = e.estado || {}, metaE = [];
        if (est.nivelAquisicao != null) metaE.push('nível ' + nEstado('entradas.' + e.uid + '.estado.nivelAquisicao', est.nivelAquisicao));
        if (est.posicaoNaMao != null) metaE.push(nEstado('entradas.' + e.uid + '.estado.posicaoNaMao', est.posicaoNaMao) + 'ª da mão');
        if (est.especial) metaE.push('carta especial');
        // RARA: nunca o efeito (D11, D33), nem o texto que a ficha atual guardou
        var corpo = rara ? '<p class="' + P + '-carta-oculta">Efeito oculto até a carta ser revelada.</p>'
          : '<p class="' + P + '-carta-txt">' + (c && c.resumo ? textoRico(c.resumo) : e.cache && e.cache.resumo ? textoRico(e.cache.resumo) : vazio()) + '</p>';
        return '<article class="' + P + '-carta ' + P + '-carta-' + esc(cat || 'orfa') + (rara ? ' ' + P + '-carta-rara' : '') + (!c ? ' ' + P + '-orfa' : '') + '" data-moldura' +
          (e.id ? ' data-id="' + esc(e.id) + '"' : '') + (rara ? ' data-rara' : '') + (!c ? ' data-orfa' : '') + '>' +
          '<div class="' + P + '-carta-cab">' + ico + '<span class="' + P + '-carta-cat">' + esc(CARTA_CATEGORIA[cat] || 'Carta') + '</span>' +
          (!c ? selo('orfa', 'órfã', 'Sem par no catálogo. Mostra o texto salvo na ficha.') : '') + '</div>' +
          reqHTML + '<h4 class="' + P + '-carta-nome">' + esc(nome) + '</h4>' + corpo +
          (metaE.length ? '<p class="' + P + '-carta-meta">' + metaE.join(' · ') + '</p>' : '') + '</article>';
      }
      RENDER.cartas = function (res, C, ctx) {
        var f = res.ficha, nos = res.av.nos, h = '';
        var cartas = lista(f.entradas).filter(function (e) { return obj(e) && e.tipo === 'carta'; });
        var n = Math.max(MOLDURAS.cartas, cartas.length), grade = '';
        for (var i = 0; i < n; i++) {
          grade += i < cartas.length ? cardCarta(cartas[i], ctx, C, nos)
            : '<div class="' + P + '-carta ' + P + '-carta-vazia" data-moldura data-vazia><span class="' + P + '-vazia-txt">moldura de carta</span></div>';
        }
        h += moldura('cartas', 'Cartas do Limiar', '<div class="' + P + '-cartas">' + grade + '</div>',
          { extra: '<span class="' + P + '-par" data-campo="limiar-saldo"><span class="' + P + '-rot">Pontos do Limiar</span>' + C.conta('limiar.saldo') + '</span>' });
        var queim = lista(f.limiar && f.limiar.queimadas);
        if (queim.length) {
          h += moldura('queimadas', 'Cartas queimadas', '<ul class="' + P + '-lista">' + queim.map(function (q, i) {
            var c = ctx.porId['carta:' + (obj(q) ? q.id : q)];
            return '<li>' + esc(c ? semEmoji(c.nome) : str(obj(q) ? q.id : q)) + (obj(q) && q.nivel != null ? ' <span class="' + P + '-sub">nível ' + nEstado('limiar.queimadas.' + i + '.nivel', q.nivel) + '</span>' : '') + '</li>';
          }).join('') + '</ul>');
        }
        // Abismo: dores e benefícios (qualquer jogador)
        var abismo = lista(f.entradas).filter(function (e) { return obj(e) && (e.tipo === 'dor' || e.tipo === 'beneficio'); });
        if (abismo.length) {
          h += moldura('abismo', 'Abismo', '<div class="' + P + '-tecs">' + abismo.map(function (e) {
            return cardTecnica({ e: e, c: resolver(ctx, e) }, ctx, { tipo: e.tipo === 'dor' ? 'Dor' : 'Benefício' });
          }).join('') + '</div>');
        }
        var lore = f.lore || {};
        function texto(campo, tit, v) {
          return moldura(campo, tit, v && str(v).trim() ? '<p class="' + P + '-lore">' + esc(semEmoji(v)) + '</p>' : '<p class="' + P + '-nota">Em branco.</p>', { cls: P + '-bloco-lore' });
        }
        h += '<div class="' + P + '-lores">' + texto('historia', 'História', lore.historia) + texto('outros', 'Outros', lore.outros) + '</div>';
        return h;
      };

      // ======================================================================
      // 4. O Bazar (A4 pág. 4): o inventário da ficha, só leitura
      // ======================================================================
      function itemHTML(x, C, nos, ctx) {
        var qtd = qtdDe(x);
        var marcas = (x.equipado ? selo('equipado', 'Equipado') : '') + (x.sintonizado ? selo('sintonizado', 'Sintonizado') : '') +
          (x.orfao ? selo('orfa', 'órfão', 'Item sem par no catálogo do Bazar') : '');
        var atq = '';
        var noA = nos['ataque.' + x.uid + '.atacar'];
        if (noA) {
          atq = '<div class="' + P + '-item-atq" data-campo="ataque">' +
            '<span class="' + P + '-par"><span class="' + P + '-rot">Atacar</span>' + C.conta('ataque.' + x.uid + '.atacar', { texto: modTxt(noA) }) + '</span>' +
            // a progressão da PMA é display do mesmo nó (a fórmula numérica a mostra)
            '<span class="' + P + '-par"><span class="' + P + '-rot">Progressão</span>' + C.conta('ataque.' + x.uid + '.atacar', { semSelos: true,
              texto: noA.progressao && noA.progressao.texto ? noA.progressao.texto : 'sem ações para atacar' }) + C.selosHTML(noA.selosProgressao) + '</span>' +
            '<span class="' + P + '-par"><span class="' + P + '-rot">Dano</span>' + C.conta('ataque.' + x.uid + '.dano') + '</span></div>';
        }
        var rar = rarDe(x.raridade);
        return '<li class="' + P + '-item' + (rar ? ' ' + P + '-item-' + rar[1] : '') + '" data-moldura data-uid="' + esc(x.uid) + '">' +
          '<div class="' + P + '-item-cab"><span class="' + P + '-item-nome" data-campo="nome">' + esc(semEmoji(x.nome) || '(sem nome)') + '</span>' +
          '<span data-campo="raridade">' + raridade(x.raridade) + '</span>' +
          '<span class="' + P + '-item-qtd" data-campo="qtd"><span class="' + P + '-rot">Qtd</span>' + nEstado('inventario.' + x.uid + '.qtd', qtd) + '</span>' + marcas + '</div>' +
          (x.categoria ? '<span class="' + P + '-item-cat">' + esc(x.categoria) + '</span>' : '') +
          (x.efeito ? '<p class="' + P + '-item-ef">' + textoRico(x.efeito) + '</p>' : '') + atq + '</li>';
      }
      function itens(lst, minimo, C, nos, ctx) {
        var h = lst.map(function (x) { return itemHTML(x, C, nos, ctx); }).join('');
        for (var i = lst.length; i < (minimo || 0); i++) h += '<li class="' + P + '-item ' + P + '-item-vazio" data-moldura data-vazia><span class="' + P + '-vazia-txt">vazio</span></li>';
        return h ? '<ul class="' + P + '-itens">' + h + '</ul>' : '<p class="' + P + '-nota">Nada aqui.</p>';
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
        h += moldura('resumo-bazar', 'Bolsa', '<div class="' + P + '-ders">' +
          '<div class="' + P + '-der" data-campo="sins">' + img(ctx, 'sins', P + '-der-img') + '<span class="' + P + '-der-rot">Sins</span><span class="' + P + '-der-val">' + nEstado('inventario.sins', inv.sins || 0) + '</span></div>' +
          '<div class="' + P + '-der" data-campo="sintonizados"><span class="' + P + '-der-ico">' + SVG_RARA + '</span><span class="' + P + '-der-rot">Sintonizados</span><span class="' + P + '-der-val">' +
            C.conta('inventario.sintonizados', { no: noSint, texto: fmt(ns) + ' / ' + fmt(lim) }) + '</span></div>' +
          '</div>' + capacidade(res, C, ctx, 'carga-'), { ico: img(ctx, 'mochila', P + '-tit-img') });

        h += moldura('bugigangas', 'Bugigangas', itens(bugs, 0, C, nos, ctx));
        h += moldura('equipamentos', 'Equipamentos', '<div class="' + P + '-eqs">' +
          '<div class="' + P + '-eq" data-campo="equip-pesados"><h4 class="' + P + '-tier-tit">Pesados</h4>' + itens(pes, MOLDURAS.pesados, C, nos, ctx) + '</div>' +
          '<div class="' + P + '-eq" data-campo="equip-leves"><h4 class="' + P + '-tier-tit">Leves</h4>' + itens(lev, MOLDURAS.leves, C, nos, ctx) + '</div>' +
          '<div class="' + P + '-eq" data-campo="equip-armas"><h4 class="' + P + '-tier-tit">Armas e Outros</h4>' + itens(out, MOLDURAS.armas, C, nos, ctx) + '</div>' +
          '</div>', { nota: 'Pesados e Leves são as armaduras [Pesada] e [Leve] do Bazar; a arma equipada mostra Atacar e Dano com a conta.' });
        // Materiais por raridade (vale o catálogo do Bazar, não a lista antiga da física)
        var porRar = RARIDADES.map(function (r) {
          return [r, mats.filter(function (x) { return norm(x.raridade) === norm(r[0]); })];
        });
        var semRar = mats.filter(function (x) { return !RARIDADES.some(function (r) { return norm(r[0]) === norm(x.raridade); }); });
        h += moldura('materiais', 'Materiais', '<div class="' + P + '-mats">' + porRar.map(function (p) {
          return '<div class="' + P + '-mat ' + P + '-mat-' + p[0][1] + '" data-raridade="' + p[0][1] + '"><h4 class="' + P + '-tier-tit">' + raridade(p[0][0]) + '</h4>' +
            (p[1].length ? '<ul class="' + P + '-mat-lista">' + p[1].map(function (x) {
              return '<li><span class="' + P + '-mat-nome">' + esc(semEmoji(x.nome)) + '</span><span class="' + P + '-item-qtd"><span class="' + P + '-rot">Qtd</span>' +
                nEstado('inventario.' + x.uid + '.qtd', qtdDe(x)) + '</span></li>';
            }).join('') + '</ul>' : '<p class="' + P + '-nota">—</p>') + '</div>';
        }).join('') + (semRar.length ? '<div class="' + P + '-mat"><h4 class="' + P + '-tier-tit">Sem raridade</h4><ul class="' + P + '-mat-lista">' + semRar.map(function (x) {
          return '<li><span class="' + P + '-mat-nome">' + esc(semEmoji(x.nome)) + '</span></li>';
        }).join('') + '</ul></div>' : '') + '</div>');
        return h;
      };

      // ======================================================================
      // 5. Grimório (A4 pág. 5): magias por nível 1–5
      // ======================================================================
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
        var custo = noC ? '<div class="' + P + '-mg-custo" data-campo="custo">' + lista(noC.porIntensidade).map(function (pi) {
          var cel = !pi.permitida ? '<span class="' + P + '-nulo" title="' + esc(pi.nome + ' fora das intensidades desta magia') + '">—</span>'
            : C.conta(caminho + '.' + pi.intensidade, { no: pi.no, semSelos: true });
          return '<span class="' + P + '-mg-int' + (pi.escolhida ? ' ' + P + '-escolhida' : '') + (!pi.permitida ? ' ' + P + '-mg-int-off' : '') + '">' +
            '<span class="' + P + '-rot">' + esc(pi.nome) + '</span>' + cel + '</span>';
        }).join('') + '</div>' : '<p class="' + P + '-nota">Custo indisponível (magia sem par no catálogo).</p>';
        var nv = c ? c.nivel : noC && noC.magia ? noC.magia.nivel : null;
        return '<article class="' + P + '-mg' + (!c ? ' ' + P + '-orfa' : '') + '" data-moldura' + (e.id ? ' data-id="' + esc(e.id) + '"' : '') + (!c ? ' data-orfa' : '') + '>' +
          '<header class="' + P + '-tec-cab"><h4 class="' + P + '-tec-nome" data-campo="nome">' + esc(nome) + '</h4>' +
          (c && c.escola ? '<span class="' + P + '-mg-escola">' + esc(ESCOLAS[c.escola] || c.escola) + '</span>' : '') +
          (!c ? selo('orfa', 'órfã', 'Sem par no catálogo. Mostra o texto salvo na ficha.') : '') +
          (nv === 5 ? selo('trava', 'Foco Primordial', 'O Nível 5 exige Foco Primordial') : '') + '</header>' +
          '<dl class="' + P + '-mg-stats">' + STATS_MAGIA.map(function (s) {
            return '<div data-campo="' + s[0] + '"><dt>' + esc(s[1]) + '</dt><dd>' + (stats[s[0]] != null && str(stats[s[0]]) ? textoRico(stats[s[0]]) : vazio()) + '</dd></div>';
          }).join('') + '</dl>' + custo +
          '<p class="' + P + '-tec-txt" data-campo="texto">' + (c && c.resumo ? textoRico(c.resumo) : e.cache && e.cache.resumo ? textoRico(e.cache.resumo) : vazio()) + '</p></article>';
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
          h += '<p class="' + P + '-mg-req ' + (mist >= 1 ? P + '-req-ok' : P + '-req-aviso') + '">' +
            (mist >= 1 ? 'Místico: ' + esc(rot[mist] || 'Treinado') + ' (ok).' : 'Aviso: não Treinado em Místico.') + '</p>';
        }
        for (var nv = 1; nv <= 5; nv++) {
          var doNivel = mg.filter(function (m) { return m.nivel === nv; });
          h += moldura('magias-nivel-' + nv, 'Nível ' + nv, doNivel.length
            ? '<div class="' + P + '-mgs">' + doNivel.map(function (m) { return cardMagia(m.e, m.c, res, C); }).join('') + '</div>'
            : '<p class="' + P + '-nota">Nenhuma magia de nível ' + nv + '.</p>', { cls: P + '-bloco-nivel' });
        }
        var sem = mg.filter(function (m) { return !(m.nivel >= 1 && m.nivel <= 5); });
        if (sem.length) {
          h += moldura('magias-orfas', 'Sem nível (órfãs)', '<div class="' + P + '-mgs">' + sem.map(function (m) { return cardMagia(m.e, m.c, res, C); }).join('') + '</div>');
        }
        return '<p class="' + P + '-nota ' + P + '-nota-topo">' + esc(nota) + '</p>' + h;
      };

      // a passada inteira: um html por aba, com UMA instância do KhConta (ids
      // <p>-d-1, <p>-d-2… únicos no HTML todo); res fora de 'ok' vira a mensagem
      // do estado em todas as abas.
      // o: {dados (o do KhPrevia.carregar), D (KhRegras.dados()), base (raiz do site, para images/)}
      function paineis(res, o) {
        o = obj(o) ? o : {};
        var ok = !!res && res.estado === 'ok';
        var D = o.D || (KhRegras ? KhRegras.dados() : {});
        var C = ok && KhConta ? KhConta.criar({ D: D, nos: res.av ? res.av.nos : null,
          prefixo: P, esc: esc, fmt: KhRegras ? KhRegras.fmt : undefined, semEmoji: semEmoji }) : null;
        var ctx = ok ? contexto(o.dados, D, o.base) : null;
        var out = {};
        ABAS.forEach(function (a) {
          var corpo;
          if (!ok) corpo = '<p class="' + P + '-nota">' + esc(mensagemEstado(res) || CARREGANDO) + '</p>';
          else if (typeof RENDER[a.id] === 'function') {
            // uma aba que falha não derruba as outras
            try { corpo = '<div class="' + P + '-corpo ' + P + '-corpo-' + a.id + '"' + MARCA + '>' + RENDER[a.id](res, C, ctx) + '</div>'; } catch (e) {
              corpo = '<p class="' + P + '-estado ' + P + '-estado-aviso">Esta aba falhou ao desenhar: ' + esc(e && e.message) + '</p>';
            }
          } else corpo = '<p class="' + P + '-nota">' + esc(EM_CONSTRUCAO) + '</p>';
          out[a.id] = corpo;
        });
        return { paineis: out, caminhos: C ? C.caminhos : [] };
      }

      return { prefixo: P, densidade: densidade, RENDER: RENDER, paineis: paineis, contexto: contexto };
    }

    return { PREFIXO: PREFIXO, DENSIDADES: DENSIDADES.slice(), CARREGANDO: CARREGANDO, EM_CONSTRUCAO: EM_CONSTRUCAO,
      ABAS: ABAS.map(function (a) { return { id: a.id, pag: a.pag, rotulo: a.rotulo }; }), MOLDURAS: MOLDURAS,
      criar: criar, contexto: contexto, resolver: resolver, textoRico: textoRico, semEmoji: semEmoji, esc: esc,
      mensagemEstado: mensagemEstado, refNome: refNome };
  })();

  if (emNode) { module.exports = KhFichaAbas; return; }
  raiz.KhFichaAbas = KhFichaAbas;
})(typeof window !== 'undefined' ? window : this);
