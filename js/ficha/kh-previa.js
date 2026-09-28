/* Khalkaria — Ficha · KhPrevia: PRÉVIA ESCONDIDA da ficha v3 (F3c, modo sombra).
 * Painel à direita, SOMENTE LEITURA, para o Pedro conferir o motor: a ficha v2
 * (khalkaria_ficha) migrada EM MEMÓRIA pelo KhEstado.sombra e calculada pelo
 * KhRegras, cada número com o componente "conta" (css/componentes.css) e o
 * tooltip da fórmula (simbólica + numérica, a fonte de cada termo e o selo do
 * que não é canônico), no hover e no foco de teclado (aria-describedby).
 *
 * Só liga com ?ficha=v3 na URL (que lembra a escolha em localStorage
 * khalkaria_ficha_previa=1, para seguir pela navegação) ou com essa chave já
 * gravada; o botão "Sair da prévia" apaga a chave. Sem isso, nada acontece:
 * nenhum nó no DOM, nenhum CSS (o css/ficha-previa.css só é pedido aqui),
 * nenhum fetch, nenhum ouvinte. A v2.1 continua sendo a ficha ativa: a prévia
 * NUNCA grava ficha, índice, chave v3 nem o marcador khalkaria_ficha_dono (F4);
 * as únicas escritas são a da própria chave da prévia e, em sessionStorage,
 * khalkaria_ficha_previa_recolhida (o painel recolhido nesta aba).
 *
 * Partes puras (testadas no node, tools/testes/previa.test.js): ativacao,
 * calcular (catálogo -> sombra -> avaliar) e render (HTML + caminhos mostrados).
 * No node exporta por module.exports (carregado sozinho); no artefato js/ficha.js
 * o export já é o KhInv e este módulo só roda no navegador.
 * Fonte: js/ficha/kh-previa.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhEstado = emNode ? require('./kh-estado.js') : raiz.KhEstado;
  var KhRegras = emNode ? require('./kh-regras.js') : raiz.KhRegras;

  var KhPrevia = (function () {
    var CHAVE = 'khalkaria_ficha_previa';
    var CHAVE_V2 = 'khalkaria_ficha';
    var CHAVE_RECOLHIDA = 'khalkaria_ficha_previa_recolhida';   // sessionStorage: a aba lembra o painel recolhido
    // o que o motor precisa em runtime (só na prévia): os mesmos arquivos que o
    // tools/testes/estado-apoio.js lê do disco (o teste confere as listas)
    var CATALOGOS = ['beneficio', 'carta', 'condicao', 'dor', 'magia', 'marca', 'origem', 'raca',
      'subespecie', 'tecnica', 'tecnologia', 'traco', 'ultimate', 'variante'];
    var CLASSES = ['alquimista', 'artilheiro', 'batedor', 'brutalista', 'espadachim', 'monge', 'teurgo'];
    var RACAS = ['anao', 'automato', 'corrompido', 'dryad', 'gruto', 'humano', 'inseto'];
    var ATRIBUTOS = [['FOR', 'Força'], ['DES', 'Destreza'], ['CON', 'Constituição'], ['INT', 'Inteligência'], ['SAB', 'Sabedoria']];
    var TIPOS = [['cortante', 'Cortante'], ['contundente', 'Contundente'], ['perfurante', 'Perfurante'],
      ['fogo', 'Fogo'], ['frio', 'Frio'], ['eletrico', 'Elétrico'], ['veneno', 'Veneno'], ['acido', 'Ácido'],
      ['psiquico', 'Psíquico'], ['radiante', 'Radiante'], ['trovejante', 'Trovejante'], ['necrotico', 'Necrótico'],
      ['forca', 'Força'], ['primordial', 'Primordial']];
    var NOME_CATEGORIA = { ordinario: 'Ordinário', elemental: 'Elemental', biologico: 'Biológico', mistico: 'Místico' };
    var CATEGORIAS = [['ordinario', 'Ordinário'], ['elemental', 'Elemental'], ['biologico', 'Biológico'],
      ['mistico', 'Místico'], ['todos', 'Todos']];
    var TIPO_FONTE = { regra: 'regra', classe: 'classe', raca: 'raça', origem: 'origem', item: 'item', no: 'campo',
      ficha: 'ficha', ajuste: 'ajuste manual', carta: 'carta', condicao: 'condição', tecnica: 'técnica', marca: 'marca',
      ultimate: 'ultimate', traco: 'traço', variante: 'variante', subespecie: 'subespécie', tecnologia: 'tecnologia',
      corrupcao: 'corrupção', magia: 'magia', dor: 'dor', beneficio: 'benefício', nivel: 'nível', vhelor: 'Vhelor' };
    // texto curto do selo ao lado do número (o completo, D.rotulosSelo, vai no tooltip)
    var SELO_CURTO = { decisaoPedro: 'decisão', pendentePedro: 'pendente Pedro',
      pendenteBalanceamento: 'pendente bal.', avisoClasse: 'rework', ajuste: 'ajuste' };
    var EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu;

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function esc(s) {
      return str(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
    function semEmoji(s) { return str(s).replace(EMOJI, '').replace(/\s{2,}/g, ' ').trim(); }
    function ler(ls, k) { try { return ls ? ls.getItem(k) : null; } catch (e) { return null; } }

    // ---------------- ativação ----------------
    // search: location.search. {ativa, lembrar}: lembrar = gravar a chave da prévia
    function ativacao(search, ls) {
      var m = /[?&]ficha=([^&#]*)/.exec(str(search));
      var pedida = !!m && decodeURIComponent(m[1]) === 'v3';
      if (pedida) return { ativa: true, lembrar: ler(ls, CHAVE) !== '1' };
      return { ativa: ler(ls, CHAVE) === '1', lembrar: false };
    }

    // ---------------- dados (só na prévia) ----------------
    function arquivos() {
      var out = [];
      CATALOGOS.forEach(function (t) { out.push({ grupo: 'catalogos', caminho: 'data/catalogo/' + t + '.json' }); });
      CLASSES.forEach(function (c) { out.push({ grupo: 'classes', caminho: 'data/classes/' + c + '.json' }); });
      RACAS.forEach(function (r) { out.push({ grupo: 'racas', caminho: 'data/racas/' + r + '.json' }); });
      out.push({ grupo: 'efeitos', caminho: 'data/efeitos.json' });
      out.push({ grupo: 'glifos', caminho: 'partials/glifos.html', texto: true });
      return out;
    }
    // baixa tudo em paralelo; o que falha fica em erros (a prévia segue sem)
    function carregar(fetchFn, base, versao) {
      var dados = { catalogos: [], classes: [], racas: [], efeitos: null, glifos: '', erros: [] };
      return Promise.all(arquivos().map(function (a) {
        return fetchFn(base + a.caminho + (versao || '')).then(function (r) {
          if (!r || !r.ok) throw new Error('HTTP ' + (r && r.status));
          return a.texto ? r.text() : r.json();
        }).then(function (x) {
          if (a.grupo === 'efeitos') dados.efeitos = x;
          else if (a.grupo === 'glifos') dados.glifos = str(x);
          else dados[a.grupo].push(x);
        }, function () { dados.erros.push(a.caminho); });
      })).then(function () { return dados; });
    }

    // ---------------- cálculo (puro sobre o storage injetado; só LÊ) ----------------
    function calcular(ls, dados, versao) {
      dados = dados || {};
      try {
        var idx = null;
        if (lista(dados.catalogos).length || lista(dados.classes).length || lista(dados.racas).length) {
          idx = KhEstado.indiceCatalogo(KhEstado.entradasDeCatalogo(dados), str(versao));
        }
        var ef = dados.efeitos ? (dados.efeitos.porId || dados.efeitos) : null;
        var r = KhEstado.sombra(ls, { catalogo: idx,
          calculado: function (f) { return KhRegras.calculados(f, { efeitos: ef }); } });
        if (!r) return { estado: 'sem-ficha', erros: lista(dados.erros) };
        if (r.erro) return { estado: 'erro', erro: r.erro, versao: r.versao, erros: lista(dados.erros) };
        var av = KhRegras.avaliar(r.ficha, { efeitos: ef });
        return { estado: 'ok', ficha: r.ficha, de: r.de, avisosMigracao: lista(r.avisos), av: av,
          semCatalogo: !idx, semEfeitos: !ef, erros: lista(dados.erros) };
      } catch (e) {
        return { estado: 'falha', erro: str(e && e.message), erros: lista(dados.erros) };
      }
    }

    // ---------------- render (puro: string) ----------------
    function render(res, D) {
      D = D || KhRegras.dados();
      var n = 0, caminhos = [];
      var fmt = KhRegras.fmt;

      function rotuloSelo(k) { return str(D.rotulosSelo && D.rotulosSelo[k]) || k; }
      function seloDoStatus(st) {
        if (!st || st === 'ajuste') return null;
        var s = D.selos[st];
        if (s === undefined) s = D.selos.semStatus;
        return s || null;
      }
      function fonteTxt(f) {
        if (!obj(f)) return '';
        var t = TIPO_FONTE[f.tipo] || str(f.tipo), nome = semEmoji(f.nome), id = str(f.id);
        if (f.tipo === 'regra') return t + ': ' + (id ? id.replace(/^contrato:/, 'contrato · ') : nome);
        if (f.tipo === 'no') return t + ': ' + (nome || id);
        return t + ': ' + (nome || id);
      }
      function valorTermo(t) {
        var v = t.valor;
        if (v === null || v === undefined) return '?';
        if (typeof v === 'boolean') return v ? 'sim' : 'não';
        switch (t.op) {
          case 'fixa': return '= ' + fmt(v);
          case 'multiplica': return '× ' + fmt(v);
          case 'minimo': return 'mín. ' + fmt(v);
          case 'dado': return '+ ' + fmt(v);
          case 'formula': return fmt(v);
          default:
            if (typeof v === 'number') return v < 0 ? '− ' + fmt(-v) : '+ ' + fmt(v);
            return fmt(v);
        }
      }
      function termoHTML(t) {
        var selo = seloDoStatus(t.status);
        var mot = str(t.motivo);
        return '<span class="kf3-t' + (t.ativo ? '' : ' kf3-t-off') + '">' +
          '<span class="kf3-t-v">' + esc(valorTermo(t)) + '</span> ' +
          '<span class="kf3-t-r">' + esc(semEmoji(t.rotulo)) + '</span>' +
          (obj(t.fonte) && t.fonte.tipo !== 'ajuste' ? ' <span class="kf3-t-f">· ' + esc(fonteTxt(t.fonte)) + '</span>' : '') +
          (selo ? ' <span class="kf3-t-s">[' + esc(rotuloSelo(selo)) + ']</span>' : '') +
          (!t.ativo && !/^display/.test(mot) ? ' <span class="kf3-t-m">(não entra' + (mot ? ': ' + esc(mot) : '') + ')</span>'
            : (mot ? ' <span class="kf3-t-m">(' + esc(mot) + ')</span>' : '')) +
          '</span>';
      }
      function valorNo(no, un) {
        var v = no ? no.valor : null;
        if (v === null || v === undefined) return '—';
        if (typeof v === 'boolean') return v ? 'sim' : 'não';
        if (typeof v === 'number') return fmt(v) + (un || '');
        return str(v);
      }
      function selosHTML(selos) {
        return lista(selos).map(function (s) {
          return '<span class="kf3-selo kf3-selo-' + esc(s) + '" title="' + esc(rotuloSelo(s)) + '">' +
            '<svg aria-hidden="true"><use href="#g-selo"/></svg>' + esc(SELO_CURTO[s] || s) + '</span>';
        }).join('');
      }
      // o número com a conta. o: {un, texto (troca o valor mostrado), semSelos, no (nó fora do grafo)}
      function conta(caminho, o) {
        o = o || {};
        var no = o.no || (res.av && res.av.nos[caminho]);
        if (!no) return '<span class="kf3-nulo">—</span>';
        caminhos.push(caminho);
        var id = 'kf3-d-' + (++n);
        var sim = str(no.formula && no.formula.simbolica), num = str(no.formula && no.formula.numerica);
        var rot = semEmoji(no.rotulo);
        var linhas = '<span class="kf3-d-sim">' + esc(sim.indexOf(rot) === 0 ? sim : rot + ' = ' + sim) + '</span>' +
          '<span class="kf3-d-num">' + esc(num) + '</span>';
        if (no.termos.length) linhas += '<span class="kf3-d-ts">' + no.termos.map(termoHTML).join('') + '</span>';
        var sl = lista(no.selos).concat(lista(no.selosProgressao).filter(function (s) { return lista(no.selos).indexOf(s) < 0; }));
        if (sl.length) linhas += '<span class="kf3-d-selos">Selo: ' + sl.map(function (s) { return esc(rotuloSelo(s)); }).join(' · ') + '</span>';
        if (no.ajuste) {
          linhas += '<span class="kf3-d-aj">Ajuste ' + (no.ajuste.origem === 'migracao' ? 'migrado da v2' : 'manual') +
            ': calculado ' + esc(fmt(no.calculado)) + ' · ajustado ' + esc(fmt(no.valor)) +
            (no.ajuste.motivo ? ' (' + esc(no.ajuste.motivo) + ')' : '') +
            (no.ajuste.mudou ? ' · o calculado mudou desde o ajuste' : '') + '</span>';
        }
        lista(no.avisos).forEach(function (a) { linhas += '<span class="kf3-d-av">Aviso: ' + esc(a.msg || a.tipo) + '</span>'; });
        lista(no.lembretes).forEach(function (a) { linhas += '<span class="kf3-d-lb">Lembrete: ' + esc(a.msg || a.op) + '</span>'; });
        var mostrado = o.texto != null ? o.texto : valorNo(no, o.un);
        return '<span class="kh-conta kf3-conta" tabindex="0" aria-describedby="' + id + '"' +
          (no.ajuste ? ' data-ajustado' : '') + ' data-caminho="' + esc(caminho) + '">' +
          '<b class="kf3-v">' + esc(mostrado) + '</b>' +
          '<span class="kh-conta-dica kf3-dica" id="' + id + '" role="tooltip">' + linhas + '</span></span>' +
          (no.ajuste ? '<span class="kf3-calc">calc. ' + esc(valorNo({ valor: no.calculado }, o.un)) + '</span>' : '') +
          (o.semSelos ? '' : selosHTML(no.selos));
      }
      function linha(rotulo, direita, extra) {
        return '<div class="kf3-lin' + (extra ? ' ' + extra : '') + '"><span class="kf3-rot">' + rotulo + '</span>' +
          '<span class="kf3-val">' + direita + '</span></div>';
      }
      function secao(id, titulo, corpo, nota) {
        return '<section class="kf3-sec" aria-labelledby="kf3-h-' + id + '"><h3 class="kf3-h" id="kf3-h-' + id + '">' +
          esc(titulo) + '</h3>' + (nota ? '<p class="kf3-nota">' + nota + '</p>' : '') + corpo + '</section>';
      }
      function glifo(g, cls) { return '<svg class="kf3-g ' + cls + '" aria-hidden="true"><use href="#' + g + '"/></svg>'; }

      if (res.estado !== 'ok') {
        var msg = res.estado === 'sem-ficha' ? 'Não há ficha v2 neste navegador (chave khalkaria_ficha). Crie ou importe uma na ficha atual e esta prévia a calcula.'
          : res.estado === 'erro' ? 'A ficha v2 deste navegador não pôde ser lida (' + esc(res.erro) + (res.versao ? ' ' + esc(res.versao) : '') + ').'
            : 'O motor falhou ao calcular: ' + esc(res.erro);
        return { html: '<p class="kf3-vazio">' + msg + '</p>' + errosHTML(res.erros), caminhos: caminhos };
      }
      var f = res.ficha, nos = res.av.nos, h = '';

      // ---- identidade (texto, não é conta)
      function ident(rot, r) {
        if (!obj(r) || !(r.id || r.nome)) return '';
        var aviso = !r.id ? ' <span class="kf3-aviso">sem par no catálogo</span>' : '';
        return linha(esc(rot), '<span class="kf3-txt">' + esc(semEmoji(r.nome) || r.id) + '</span>' + aviso);
      }
      var idt = f.identidade || {};
      h += secao('identidade', 'Identidade',
        linha('Nome', '<span class="kf3-txt">' + esc(f.meta.nome || '(sem nome)') + '</span>') +
        (f.meta.jogador ? linha('Jogador', '<span class="kf3-txt">' + esc(f.meta.jogador) + '</span>') : '') +
        linha('Nível', '<span class="kf3-txt kf3-num">' + esc(f.meta.nivel) + '</span>') +
        ident('Raça', idt.raca) + ident('Variante', idt.variante) + ident('Subespécie', idt.subespecie) +
        ident('Classe', idt.classe) + ident('Ramo', idt.ramo) + ident('Origem', idt.origem));

      // ---- atributos
      h += secao('atributos', 'Atributos', '<div class="kf3-grade kf3-grade-at">' +
        '<span class="kf3-cab"></span><span class="kf3-cab">Total</span><span class="kf3-cab">Mod.</span>' +
        ATRIBUTOS.map(function (a) {
          return '<div class="kf3-lin kf3-lin-at"><span class="kf3-rot"><abbr title="' + a[1] + '">' + a[0] + '</abbr></span>' +
            '<span class="kf3-val">' + conta('atributo.' + a[0] + '.total') + '</span>' +
            '<span class="kf3-val">' + conta('atributo.' + a[0] + '.mod', { texto: modTxt(nos['atributo.' + a[0] + '.mod']) }) + '</span></div>';
        }).join('') + '</div>',
        f.atributos && f.atributos.migradoTotal ? 'Total migrado da v2 (a raça e o nível já estão dentro do número digitado).' : '');

      // ---- perícias (24)
      h += secao('pericias', 'Perícias', D.pericias.map(function (p) {
        var no = nos['pericia.' + p.id + '.total'];
        var grau = f.pericias ? f.pericias[p.id] : 0;
        var rot = lista(D.graus && D.graus.rotulos)[grau] || '';
        var at = no && no.escolha ? no.escolha.usado : (p.modo === 'fixo' ? p.atributos[0] : p.modo === 'porArma' ? 'arma' : p.modo === 'dado' ? 'dado' : '');
        return linha(esc(p.nome) + ' <span class="kf3-sub">' + esc(at) + (rot ? ' · ' + esc(rot) : '') + '</span>',
          conta('pericia.' + p.id + '.total', { texto: no && typeof no.valor === 'number' ? modTxt(no) : null }));
      }).join(''));

      // ---- recursos máximos
      var rc = f.recursos || {};
      function atual(r) { var x = rc[r]; return x && typeof x.atual === 'number' ? '<span class="kf3-sub">atual ' + esc(fmt(x.atual)) + '</span>' : ''; }
      var noCl = nos['recurso.classe.max'];
      h += secao('recursos', 'Recursos máximos',
        linha(glifo('g-saude', 'kf3-g-saude') + 'Saúde máx.', atual('saude') + conta('recurso.saude.max')) +
        linha(glifo('g-stamina', 'kf3-g-stamina') + 'Stamina máx.', atual('stamina') + conta('recurso.stamina.max')) +
        linha(glifo('g-eter', 'kf3-g-eter') + 'Éter máx.', atual('eter') + conta('recurso.eter.max')) +
        linha(esc(semEmoji(noCl ? noCl.rotulo : 'Recurso de classe máx.')), atual('classe') + conta('recurso.classe.max')));

      // ---- defesa e movimento
      h += secao('derivados', 'Evasão, CD e Movimento',
        linha('Evasão Passiva', conta('evasao.passiva')) +
        linha('Evasão Ativa', conta('evasao.ativa')) +
        linha('CD', conta('cd')) +
        linha('Movimento', conta('movimento', { un: ' m' })) +
        linha('Ações por turno', conta('acoes')));

      // ---- carga
      var cg = nos.carga && nos.carga.extra;
      function colTxt(k) { var c = cg && cg[k]; return c ? fmt(c.usado) + ' / ' + fmt(c.max) : null; }
      var ESTADO_CARGA = { nenhuma: 'sem Sobrepeso', leve: 'Sobrepeso Leve', extremo: 'Sobrepeso Extremo' };
      h += secao('carga', 'Carga',
        linha('Equipamentos <span class="kf3-sub">usado / máx.</span>', (colTxt('equipamentos') ? '<span class="kf3-sub">' + esc(colTxt('equipamentos')) + '</span>' : '') + conta('capacidade.equipamentos')) +
        linha('Bugigangas <span class="kf3-sub">usado / máx.</span>', (colTxt('bugigangas') ? '<span class="kf3-sub">' + esc(colTxt('bugigangas')) + '</span>' : '') + conta('capacidade.bugigangas')) +
        linha('Estado', conta('carga', { texto: ESTADO_CARGA[nos.carga && nos.carga.valor] || valorNo(nos.carga) })) +
        linha('Sins <span class="kf3-sub">(contador, não é conta)</span>', '<span class="kf3-txt kf3-num">' + esc(fmt(f.inventario && f.inventario.sins || 0)) + '</span>'));

      // ---- armadura e resistências
      var ae = '<div class="kf3-grade kf3-grade-ae">' + CATEGORIAS.map(function (c) {
        return '<div class="kf3-lin kf3-lin-mini"><span class="kf3-rot">Ae(' + c[1] + ')</span><span class="kf3-val">' + conta('ae.' + c[0]) + '</span></div>';
      }).join('') + '</div>';
      function flag(fam, t, letra) {
        var no = nos[fam + '.' + t];
        return conta(fam + '.' + t, { texto: no && no.valor ? letra : '·', semSelos: true }) + selosHTML(no ? no.selos : []);
      }
      var tab = '<div class="kf3-res"><span class="kf3-cab">Tipo</span><span class="kf3-cab">R</span><span class="kf3-cab">I</span>' +
        '<span class="kf3-cab">V</span><span class="kf3-cab">Ae</span><span class="kf3-cab">Redução</span>' +
        TIPOS.map(function (t) {
          var cat = nos['defesa.' + t[0]] && nos['defesa.' + t[0]].extra && nos['defesa.' + t[0]].extra.categoria;
          return '<div class="kf3-lin kf3-lin-res"><span class="kf3-rot">' + t[1] + (cat ? ' <span class="kf3-sub">' + esc(NOME_CATEGORIA[cat] || cat) + '</span>' : '') + '</span>' +
            '<span class="kf3-val">' + flag('resistencia', t[0], 'R') + '</span>' +
            '<span class="kf3-val">' + flag('imunidade', t[0], 'I') + '</span>' +
            '<span class="kf3-val">' + flag('vulnerabilidade', t[0], 'V') + '</span>' +
            '<span class="kf3-val">' + conta('ae.' + t[0]) + '</span>' +
            '<span class="kf3-val">' + conta('defesa.' + t[0]) + '</span></div>';
        }).join('') + '</div>';
      h += secao('resistencias', 'Armadura e resistências', linha('Armadura (Ar)', conta('ar')) + ae + tab,
        'R = resistência, I = imunidade, V = vulnerabilidade, Ae = armadura específica; a redução junta Ar, Ae do tipo, da categoria e de Todos.');

      // ---- magia: custo por intensidade
      var magias = res.av.ordem.filter(function (c) { return /^magia\..+\.custo$/.test(c); });
      var corpoMg = magias.length ? '<div class="kf3-mg"><span class="kf3-cab">Magia</span><span class="kf3-cab"><abbr title="Contida">Cont.</abbr></span>' +
        '<span class="kf3-cab"><abbr title="Normal">Norm.</abbr></span><span class="kf3-cab"><abbr title="Forçada">Forç.</abbr></span>' +
        '<span class="kf3-cab"><abbr title="Transbordante">Transb.</abbr></span>' +
        magias.map(function (c) {
          var no = nos[c], mg = no.magia || {};
          var nome = semEmoji(str(no.rotulo).replace(/^Custo em Éter — /, ''));
          var cels = lista(no.porIntensidade).map(function (pi) {
            // o sub-nó (não é nó do grafo) vai direto para a conta
            var cel = !pi.permitida ? '<span class="kf3-nulo" title="' + esc(pi.nome + ' fora das intensidades da magia') + '">—</span>'
              : conta(c + '.' + pi.intensidade, { no: pi.no, semSelos: true });
            return '<span class="kf3-val' + (pi.escolhida ? ' kf3-escolhida' : '') + '">' + cel + '</span>';
          }).join('');
          return '<div class="kf3-lin kf3-lin-mg"><span class="kf3-rot">' + esc(nome) +
            (mg.nivel ? ' <span class="kf3-sub">Nv' + esc(mg.nivel) + '</span>' : '') + '</span>' + cels + '</div>' +
            (no.ajuste || lista(no.selos).length ? linha('<span class="kf3-sub">intensidade escolhida (' + esc(mg.intensidade || 'normal') + ')</span>', conta(c)) : '');
        }).join('') + '</div>' : '<p class="kf3-nota">Nenhuma magia no grimório.</p>';
      h += secao('magias', 'Custo de magia (Éter)', corpoMg,
        magias.length ? 'Custo nas 4 intensidades; a coluna marcada é a escolhida na ficha. O Nível 1 não tem Contida.' : '');

      // ---- ataques: Atacar, progressão da PMA, dano
      var ataques = res.av.ordem.filter(function (c) { return /^ataque\..+\.atacar$/.test(c); });
      var corpoAt = ataques.length ? ataques.map(function (c) {
        var no = nos[c], dano = c.replace(/\.atacar$/, '.dano');
        var nome = semEmoji(str(no.rotulo).replace(/^Atacar — /, ''));
        var prog = no.progressao && no.progressao.texto ? no.progressao.texto : 'sem ações para atacar';
        return '<div class="kf3-atq"><p class="kf3-atq-nome">' + esc(nome) + '</p>' +
          linha('Atacar', conta(c, { texto: modTxt(no) })) +
          linha('Progressão', '<span class="kf3-txt kf3-num">' + esc(prog) + '</span>' + selosHTML(no.selosProgressao)) +
          linha('Dano', conta(dano)) + '</div>';
      }).join('') : '<p class="kf3-nota">Nenhuma arma equipada' + (res.semEfeitos ? ' (efeitos de item indisponíveis)' : '') + '.</p>';
      h += secao('ataques', 'Ataques', corpoAt);

      // ---- Limiar
      h += secao('limiar', 'Limiar', linha('Pontos do Limiar', conta('limiar.saldo')));

      // ---- ajustes (M2)
      var aj = obj(f.ajustes) ? Object.keys(f.ajustes) : [];
      h += secao('ajustes', 'Ajustes manuais', aj.length ? '<ul class="kf3-lista">' + aj.map(function (k) {
        var a = f.ajustes[k], no = nos[k];
        return '<li><b>' + esc(no ? semEmoji(no.rotulo) : k) + '</b>: ' + (a.modo === 'soma' ? 'diferença ' + esc(fmt(a.valor)) : 'valor fixo ' + esc(fmt(a.valor))) +
          ' · calculado ' + esc(no ? fmt(no.calculado) : '?') + (a.origem === 'migracao' ? ' · <span class="kf3-selo kf3-selo-ajuste">migrado da v2</span>' : '') +
          (a.motivo ? ' <span class="kf3-sub">(' + esc(a.motivo) + ')</span>' : '') + '</li>';
      }).join('') + '</ul>' : '<p class="kf3-nota">Nenhum: todo número digitado na v2 bate com o calculado.</p>',
      'Aqui só se vê: ajustar e remover chegam com a F4.');

      // ---- avisos
      var av = [];
      lista(res.avisosMigracao).forEach(function (a) {
        av.push('Migração: ' + (a.tipo === 'orfa' ? 'entrada sem par (' + a.ref + ', ' + a.motivo + ')'
          : a.tipo === 'identidade' ? a.campo + ' "' + a.nome + '" sem par (' + a.motivo + ')'
            : a.tipo === 'duplicada' ? 'entrada repetida ' + a.ref + ' (' + a.nome + ')'
              : a.tipo + (a.chave ? ' ' + a.chave : '') + (a.motivo ? ' (' + a.motivo + ')' : '')));
      });
      lista(f.migracao && f.migracao.pendencias).forEach(function (p) { av.push('Pendência: ' + str(p.motivo) + (p.grau != null ? ' (grau ' + p.grau + ')' : '')); });
      lista(res.av.alertas).forEach(function (a) { av.push('Alerta: ' + str(a.msg) + (a.selo ? ' [' + rotuloSelo(a.selo) + ']' : '')); });
      lista(res.av.avisos).forEach(function (a) { av.push('Motor: ' + str(a.msg || a.tipo)); });
      if (res.semCatalogo) av.push('Catálogo indisponível: identidade e entradas ficam só pelo nome.');
      if (res.semEfeitos) av.push('Efeitos de item indisponíveis: itens e armas fora das contas.');
      h += secao('avisos', 'Avisos (' + av.length + ')', av.length ? '<ul class="kf3-lista">' + av.map(function (x) {
        return '<li>' + esc(semEmoji(x)) + '</li>'; }).join('') + '</ul>' : '<p class="kf3-nota">Nenhum.</p>') + errosHTML(res.erros);

      return { html: h, caminhos: caminhos };

      function modTxt(no) {
        if (!no || typeof no.valor !== 'number') return null;
        return no.valor < 0 ? '−' + fmt(-no.valor) : '+' + fmt(no.valor);
      }
    }
    function errosHTML(erros) {
      erros = lista(erros);
      return erros.length ? '<p class="kf3-nota kf3-aviso">Não carregou: ' + erros.map(esc).join(', ') + '</p>' : '';
    }

    // ---------------- painel (navegador) ----------------
    function iniciar(win) {
      if (!win || !win.document || !win.location) return false;
      var ls = null;
      try { ls = win.localStorage; } catch (e) { ls = null; }
      var at = ativacao(win.location.search, ls);
      if (!at.ativa) return false;
      if (at.lembrar) { try { ls.setItem(CHAVE, '1'); } catch (e) { /* segue só nesta página */ } }
      var doc = win.document;
      var vai = function () { montar(win, ls); };
      if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', vai);
      else vai();
      return true;
    }
    function montar(win, ls) {
      var doc = win.document;
      if (doc.getElementById('kf3-previa')) return;
      var s = doc.querySelector('script[src*="js/ficha.js"]');
      var src = s ? s.src : '';
      var base = src ? new URL('../', src).href : '';
      var versao = src ? new URL(src).search : '';
      var link = doc.createElement('link');
      link.rel = 'stylesheet';
      link.href = base + 'css/ficha-previa.css' + versao;
      link.setAttribute('data-kf3', '');
      var painel = doc.createElement('aside');
      painel.id = 'kf3-previa';
      painel.className = 'kf3';
      painel.hidden = true;
      painel.setAttribute('aria-label', 'Prévia da ficha v3');
      // o MutationObserver da v2 (decoração dos cards) ignora o que redesenha aqui
      painel.setAttribute('data-kf-ignorar', '');
      painel.innerHTML =
        '<div class="kf3-topo"><div class="kf3-tit"><span class="kf3-tit-nome">Prévia da ficha v3</span>' +
        '<span class="kf3-tit-sub">modo sombra · somente leitura · a ficha ativa continua sendo a v2</span></div>' +
        '<button type="button" class="kh-btn kf3-recolher" aria-expanded="true" aria-controls="kf3-corpo">Recolher</button>' +
        '<button type="button" class="kh-btn kf3-sair">Sair da prévia</button></div>' +
        '<div class="kf3-corpo" id="kf3-corpo"><p class="kf3-vazio">Carregando o catálogo e as regras…</p></div>' +
        '<div class="kf3-sprite" aria-hidden="true"></div>';
      var mostrar = function () { painel.hidden = false; };
      link.addEventListener('load', mostrar);
      link.addEventListener('error', mostrar);
      doc.head.appendChild(link);
      doc.body.appendChild(painel);

      var corpo = painel.querySelector('.kf3-corpo'), dados = null, t = null;
      function desenha() {
        if (!dados) return;
        var res = calcular(ls, dados, versao);
        var topo = corpo.scrollTop;
        corpo.innerHTML = render(res).html;
        corpo.scrollTop = topo;
      }
      // 350 ms: depois do debounce de 200 ms com que o drawer v2 grava o que se digita
      function agenda() { clearTimeout(t); t = setTimeout(desenha, 350); }
      function aoStorage(e) { if (e && e.key === CHAVE_V2) agenda(); }
      // campos digitados do drawer v2: vários só gravam (save), sem kf:mudou
      function aoCampo(e) { if (e && e.target && e.target.closest && e.target.closest('#kf-drawer')) agenda(); }
      doc.addEventListener('kf:mudou', agenda);
      doc.addEventListener('input', aoCampo, true);
      doc.addEventListener('change', aoCampo, true);
      win.addEventListener('storage', aoStorage);

      var btR = painel.querySelector('.kf3-recolher'), ss = null;
      try { ss = win.sessionStorage; } catch (e) { ss = null; }
      function recolhe(rec) {
        painel.classList.toggle('kf3-recolhida', rec);
        btR.setAttribute('aria-expanded', rec ? 'false' : 'true');
        btR.textContent = rec ? 'Prévia v3' : 'Recolher';
      }
      if (ler(ss, CHAVE_RECOLHIDA) === '1') recolhe(true);
      btR.addEventListener('click', function () {
        var rec = !painel.classList.contains('kf3-recolhida');
        recolhe(rec);
        try { if (rec) ss.setItem(CHAVE_RECOLHIDA, '1'); else ss.removeItem(CHAVE_RECOLHIDA); } catch (e) { /* só nesta página */ }
      });
      painel.querySelector('.kf3-sair').addEventListener('click', function () {
        try { ls.removeItem(CHAVE); } catch (e) { /* nada */ }
        try { ss.removeItem(CHAVE_RECOLHIDA); } catch (e) { /* nada */ }
        clearTimeout(t);
        doc.removeEventListener('kf:mudou', agenda);
        doc.removeEventListener('input', aoCampo, true);
        doc.removeEventListener('change', aoCampo, true);
        win.removeEventListener('storage', aoStorage);
        painel.remove();
        link.remove();
      });

      carregar(win.fetch.bind(win), base, versao).then(function (d) {
        dados = d;
        if (d.glifos) painel.querySelector('.kf3-sprite').innerHTML = d.glifos;
        desenha();
      });
    }

    return { CHAVE: CHAVE, CATALOGOS: CATALOGOS.slice(), CLASSES: CLASSES.slice(), RACAS: RACAS.slice(),
      ativacao: ativacao, arquivos: arquivos, carregar: carregar, calcular: calcular, render: render, iniciar: iniciar };
  })();

  if (emNode) { module.exports = KhPrevia; return; }
  raiz.KhPrevia = KhPrevia;
  try { KhPrevia.iniciar(raiz); } catch (e) { /* a prévia nunca derruba a página */ }
})(typeof window !== 'undefined' ? window : this);
