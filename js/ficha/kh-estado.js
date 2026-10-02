/* Khalkaria — Ficha · KhEstado: estado v3 da ficha (PURO, F3a).
 * novaFicha, migração em cadeia 1.0 → 2.0 → 3.0, reassociação de ids antigos
 * pelo catálogo, ajustes manuais (M2, só o modelo), várias fichas por navegador
 * (D36: índice + uma chave por ficha, ativa por aba) como funções sobre um
 * storage INJETADO, export/import por ficha e "exportar todas", guarda contra
 * versão futura. Schema: data/ficha.schema.json (3.0).
 *
 * MODO SOMBRA (F3): nada daqui roda sozinho no navegador nem grava no
 * localStorage real. A v2.1 (ficha-v2.js, chave khalkaria_ficha) continua
 * sendo a ficha ativa; KhEstado.sombra() só LÊ a v2 e devolve a v3 em memória.
 * O armazém (KhEstado.armazem) só é instanciado nos testes até a F4, que cria
 * o índice, as chaves v3 e o marcador khalkaria_ficha_dono.
 *
 * ESCRITA DUPLA E MIGRAÇÃO REAL (F4.2): projetarV2, conflitoV2, reimportarV2,
 * gravarComProjecao e migrarReal (e os mesmos nomes no armazém) são primitivas
 * PURAS sobre o storage injetado e NÃO LIGADAS: nenhum código do navegador as
 * chama (nem o ficha-v2.js, nem o kh-previa.js). Só serão ligadas na virada
 * (F4.7), com aprovação do Pedro; até lá só os testes as usam. Regra
 * conservadora: o que a v2 representa sem perda é projetado; o resto leva a
 * memória da própria ficha (vinculoV2.comPerda: os números da v2 que ela
 * absorveu; sem vínculo, o padrão da v2) e sai em 'perdas'. A v2 gravada leva
 * o carimbo origemV3 {fichaId, revV2} (a v2.1 o preserva), que diz ao
 * reimportarV2 de qual projeção ela descende. Nunca grava o marcador 'v3'.
 *
 * No node (tools/testes) exporta o KhEstado por module.exports; no navegador
 * vira window.KhEstado. Depende do KhInv (js/ficha/kh-inv.js, antes no ORDEM).
 * Fonte: js/ficha/kh-estado.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  // No artefato carregado pelo require, o module.exports já é o KhInv (o
  // kh-inv.js exporta e para); carregando esta fonte sozinha, pede o módulo.
  var KhInv = (raiz && raiz.KhInv) ||
    (emNode && typeof module.exports.migrarV1 === 'function' ? module.exports : null) ||
    (emNode ? require('./kh-inv.js') : null);

  var KhEstado = (function () {
    var SCHEMA_VERSION = '3.0';
    var SCHEMA_INDICE = 'fichas/1';
    var CHAVES = Object.freeze({
      v2: 'khalkaria_ficha',                       // a ficha v2.1 (ativa até a F4)
      backupV1: 'khalkaria_ficha_v1_backup',
      dono: 'khalkaria_ficha_dono',                // marcador: só a F4 escreve
      indice: 'khalkaria_fichas_v3',
      ficha: 'khalkaria_ficha_v3:',                // + id
      log: 'khalkaria_ficha_v3_log:',              // + id (desfazer; fora do export)
      sessao: 'khalkaria_ficha_v3_sessao:',        // + id (Mesa; vai no export)
      nivelRascunho: 'khalkaria_nivel_rascunho:',  // + id (subida de nível, M3)
      ativa: 'khalkaria_ficha_ativa'               // sessionStorage: ativa desta aba
    });
    var LIMITE_QUOTA = 5 * 1024 * 1024;            // ~5 MB por origem (UTF-16: 2 bytes/char)

    var ATRIBUTOS = ['FOR', 'DES', 'CON', 'INT', 'SAB'];
    // as 24 perícias de data/pericias.json (o teste confere por conjunto e ordem)
    var PERICIAS = ['atacar', 'defender', 'movimento', 'fortitude', 'vontade', 'reflexos',
      'percepcao', 'sobrevivencia', 'furtividade', 'crime', 'iniciativa', 'conhecimento',
      'medicina', 'investigacao', 'religiao', 'mistico', 'convencimento', 'intimidacao',
      'intuicao', 'enganacao', 'motivar', 'oficio-engenharia', 'oficio-ferraria', 'oficio-alquimia'];
    // modo 'maior' (D7): o jogador pode trocar o atributo usado
    var PERICIAS_MAIOR = { movimento: ['FOR', 'DES'], convencimento: ['DES', 'INT'],
      intimidacao: ['CON', 'FOR'], enganacao: ['DES', 'INT'] };
    // 14 tipos de dano (D63/D67) e as 4 categorias com Ae de categoria
    var TIPOS_DANO = ['cortante', 'contundente', 'perfurante', 'fogo', 'frio', 'eletrico',
      'veneno', 'acido', 'psiquico', 'radiante', 'trovejante', 'necrotico', 'forca', 'primordial'];
    var CATEGORIAS_AE = ['ordinario', 'elemental', 'biologico', 'mistico'];
    var TIPOS_ENTRADA = ['magia', 'tecnica', 'marca', 'ultimate', 'traco', 'variante', 'subespecie',
      'tecnologia', 'corrupcao', 'origem', 'raca', 'classe', 'carta', 'dor', 'beneficio'];
    var FINS_TEMPORARIO = ['fimTurno', 'fimCombate', 'descansoCurto', 'descansoLongo', 'manual'];
    var EVENTOS_DURACAO = ['fimTurno', 'fimCombate', 'fimCena', 'descansoCurto', 'descansoLongo', 'novoDia', 'manual'];

    // Caminhos DERIVADOS que aceitam ajuste manual (M2). Caminho de estado
    // (recurso.*.atual, base de atributo, grau de perícia, Sins…) não casa e é
    // recusado. O schema v3 repete este padrão literal (o teste compara).
    function alt(l) { return '(?:' + l.join('|') + ')'; }
    var PADRAO_AJUSTE = new RegExp('^(?:' + [
      'atributo\\.' + alt(ATRIBUTOS) + '\\.(?:total|mod)',
      'pericia\\.' + alt(PERICIAS) + '\\.total',
      'recurso\\.(?:saude|stamina|eter|classe)\\.max',
      'evasao\\.(?:passiva|ativa)', 'cd', 'movimento', 'ar', 'acoes',
      'capacidade\\.(?:bugigangas|equipamentos)',
      'ae\\.' + alt(TIPOS_DANO.concat(CATEGORIAS_AE, ['todos'])),
      '(?:resistencia|imunidade|vulnerabilidade)\\.' + alt(TIPOS_DANO),
      'magia\\.[a-z0-9-]+\\.custo',
      'ataque\\.[A-Za-z0-9_-]+\\.(?:atacar|dano)',
      'limiar\\.saldo'
    ].join('|') + ')$');
    function ehCaminhoDeAjuste(c) { return typeof c === 'string' && PADRAO_AJUSTE.test(c); }
    var PADRAO_BOOLEANO = /^(?:resistencia|imunidade|vulnerabilidade)\./;
    // campos que são DADO (Defender 1d6…2d8; Ativa = Passiva + esse dado): o
    // 'fixa' leva a expressão ('1d8', '13 + 1d8'); o 'soma' é bônus fixo (número)
    var CAMINHOS_DADO = ['evasao.ativa', 'pericia.defender.total'];
    var PADRAO_DADO = /^ *(?:[0-9]+ *[+] *)?[0-9]+d[0-9]+(?: *[+-] *[0-9]+)? *$/;
    // as chaves de $defs/ajuste (lista fechada, como o additionalProperties:false)
    var CHAVES_AJUSTE = ['modo', 'valor', 'motivo', 'temporario', 'desde', 'calculadoEm', 'origem'];
    var PADRAO_ID = /^f[a-z0-9]{6,}$/;
    // alvos de Mod cujo valor a v2 guardava como TOTAL digitado (atributos, grau de perícia)
    var ALVOS_NO_TOTAL = { 'atributo.': 'atributos', 'pericia.': 'periciasMigracao' };

    // ---------------- utilitários ----------------
    function clone(x) { return x === undefined ? undefined : JSON.parse(JSON.stringify(x)); }
    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function temPropria(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
    function inteiro(x, padrao) { var n = parseInt(x, 10); return isFinite(n) ? n : padrao; }
    function numero(x, padrao) { var n = parseFloat(x); return isFinite(n) ? n : padrao; }
    function limita(n, a, b) { return Math.max(a, Math.min(b, n)); }
    function agoraPadrao() { return new Date().toISOString(); }
    function aleatorioPadrao() {
      try {
        var c = (typeof crypto !== 'undefined' && crypto) || (raiz && raiz.crypto);
        if (c && c.getRandomValues) { var a = new Uint32Array(1); c.getRandomValues(a); return a[0] / 4294967296; }
      } catch (e) {}
      return Math.random();
    }
    function ctx(opcoes) {
      opcoes = opcoes || {};
      return {
        agora: typeof opcoes.agora === 'function' ? opcoes.agora : agoraPadrao,
        aleatorio: typeof opcoes.aleatorio === 'function' ? opcoes.aleatorio : aleatorioPadrao
      };
    }
    function sufixo(c, n) {
      var s = '';
      while (s.length < n) s += Math.floor(c.aleatorio() * 36).toString(36);
      return s;
    }
    // id da ficha: 'f' + 12 base36, aleatório, único entre os usados
    function novoId(usados, opcoes) {
      var c = ctx(opcoes), id;
      do { id = 'f' + sufixo(c, 12); } while (usados && usados[id]);
      if (usados) usados[id] = true;
      return id;
    }
    function novoUid(usados, c) {
      var u;
      do { u = 'u' + sufixo(c, 10); } while (usados && usados[u]);
      if (usados) usados[u] = true;
      return u;
    }
    // "2.0" -> 2; "3.1" -> 3; ausente/lixo -> NaN
    function versaoMaior(v) { var n = parseInt(String(v == null ? '' : v).split('.')[0], 10); return isFinite(n) ? n : NaN; }
    // nome comparável: sem acento, sem emoji/pontuação, minúsculo
    function normaliza(s) {
      return str(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ').trim();
    }

    // ---------------- ficha v3 ----------------
    function estadoPadrao(tipo) {
      if (tipo === 'magia') return { intensidade: null, sustentando: false };
      if (tipo === 'tecnica' || tipo === 'marca' || tipo === 'ultimate') return { usos: null };
      if (tipo === 'carta') return { nivelAquisicao: null, posicaoNaMao: null, especial: false };
      if (tipo === 'dor' || tipo === 'beneficio' || tipo === 'corrupcao') return { nivelAquisicao: null };
      return {};
    }
    function ref(id, nome) { return { id: id || null, nome: str(nome) }; }
    function novaFicha(dados, opcoes) {
      var c = ctx(opcoes);
      dados = obj(dados) ? dados : {};
      var agora = c.agora();
      var f = {
        schemaVersion: SCHEMA_VERSION,
        id: typeof dados.id === 'string' && dados.id ? dados.id : novoId(null, opcoes),
        rev: 0, criadoEm: agora, salvoEm: '', exportadoEm: '',
        meta: { nome: str(dados.nome), jogador: str(dados.jogador),
          nivel: limita(inteiro(dados.nivel, 1), 1, 5), xp: Math.max(0, inteiro(dados.xp, 0)) },
        identidade: { raca: ref(), variante: ref(), subespecie: ref(), classe: ref(), ramo: ref(),
          origem: ref(), escolhas: {} },
        atributos: { base: {}, fonte: null, porNivel: {}, pontoMovido: null,
          migradoTotal: false, nivelMigrado: null },
        pericias: {}, periciasMigracao: { migradoTotal: false, nivelMigrado: null }, periciasAttr: {},
        recursos: { saude: { atual: 0, temporaria: 0 }, stamina: { atual: 0, comprometida: 0 },
          eter: { atual: 0 }, classe: { id: null, nome: '', atual: 0 } },
        condicoes: [],
        entradas: [],
        inventario: { sins: 0, bugigangas: [], equipamentos: [] },
        ajustes: {},
        resistencias: { tipos: {}, aeCategoria: {}, aeTodos: 0 },
        imunidadesCondicao: [],
        idiomas: [],
        limiar: { queimadas: [] },
        historicoNivel: [],
        vhelor: { marcas: 0 },
        lore: { historia: '', outros: '' },
        migracao: null,
        vinculoV2: null
      };
      ATRIBUTOS.forEach(function (a) { f.atributos.base[a] = 10; });
      PERICIAS.forEach(function (p) { f.pericias[p] = 0; });
      TIPOS_DANO.forEach(function (t) { f.resistencias.tipos[t] = { R: false, I: false, V: false, ae: 0 }; });
      CATEGORIAS_AE.forEach(function (k) { f.resistencias.aeCategoria[k] = 0; });
      return f;
    }

    // completa uma v3 lida (import, storage) com o que faltar, sem apagar nada
    function completaV3(f) {
      var base = novaFicha({ id: f.id || 'x' }, { agora: function () { return str(f.criadoEm); } });
      var out = mescla(base, f);
      out.schemaVersion = SCHEMA_VERSION;
      out.rev = Math.max(0, inteiro(out.rev, 0));
      ['entradas', 'condicoes', 'imunidadesCondicao', 'idiomas', 'historicoNivel'].forEach(function (k) {
        if (!Array.isArray(out[k])) out[k] = [];
      });
      if (!obj(out.ajustes)) out.ajustes = {};
      if (!obj(out.inventario)) out.inventario = base.inventario;
      KhInv.COLUNAS.forEach(function (col) { if (!Array.isArray(out.inventario[col])) out.inventario[col] = []; });
      return out;
    }
    function mescla(base, over) {
      if (!obj(base)) return over === undefined ? base : over;
      if (!obj(over)) return over === undefined ? base : over;
      var out = Object.assign({}, base);
      Object.keys(over).forEach(function (k) { out[k] = temPropria(base, k) ? mescla(base[k], over[k]) : over[k]; });
      return out;
    }

    // ---------------- ajustes (M2, só o modelo) ----------------
    // {modo:'fixa'|'soma', valor, motivo?, temporario:false|{fim}, desde, calculadoEm?, origem?}
    // Espelha $defs/ajuste: lista fechada de chaves e o tipo de cada uma.
    function validarAjuste(caminho, aj) {
      if (!ehCaminhoDeAjuste(caminho)) return 'caminho-de-estado';
      if (!obj(aj)) return 'ajuste-invalido';
      if (Object.keys(aj).some(function (k) { return CHAVES_AJUSTE.indexOf(k) < 0; })) return 'campo-desconhecido';
      if (aj.modo !== 'fixa' && aj.modo !== 'soma') return 'modo-invalido';
      var bool = PADRAO_BOOLEANO.test(caminho);
      var num = typeof aj.valor === 'number' && isFinite(aj.valor);
      if (bool) {
        if (typeof aj.valor !== 'boolean') return 'valor-invalido';
        if (aj.modo !== 'fixa') return 'modo-invalido';
      } else if (CAMINHOS_DADO.indexOf(caminho) >= 0) {
        if (aj.modo === 'fixa' ? !(typeof aj.valor === 'string' && PADRAO_DADO.test(aj.valor)) : !num) return 'valor-invalido';
      } else if (!num) return 'valor-invalido';
      if (aj.temporario !== undefined && aj.temporario !== false &&
          !(obj(aj.temporario) && FINS_TEMPORARIO.indexOf(aj.temporario.fim) >= 0 &&
            Object.keys(aj.temporario).length === 1)) return 'temporario-invalido';
      if (aj.motivo !== undefined && typeof aj.motivo !== 'string') return 'motivo-invalido';
      if (aj.desde !== undefined && typeof aj.desde !== 'string') return 'desde-invalido';
      if (aj.calculadoEm !== undefined && aj.calculadoEm !== null &&
          !(typeof aj.calculadoEm === 'number' && isFinite(aj.calculadoEm))) return 'calculado-invalido';
      if (aj.origem !== undefined && aj.origem !== 'manual' && aj.origem !== 'migracao') return 'origem-invalida';
      return null;
    }
    // grava o ajuste (cópia) na ficha; devolve null ou o erro, sem mudar nada
    function ajustar(ficha, caminho, aj, opcoes) {
      var novo = Object.assign({ temporario: false }, aj);
      if (!novo.desde) novo.desde = ctx(opcoes).agora();
      var erro = validarAjuste(caminho, novo);
      if (erro) return erro;
      ficha.ajustes[caminho] = clone(novo);
      return null;
    }
    function desajustar(ficha, caminho) {
      if (!temPropria(ficha.ajustes, caminho)) return false;
      delete ficha.ajustes[caminho];
      return true;
    }
    // Os ajustes que a migração criou sem saber o calculado (calculadoEm null)
    // saem quando o calculado bate com o valor; os outros ganham o calculadoEm.
    // Tira a marca migracao.ajustesPendentesDePoda (o armazém recusa gravar
    // enquanto ela existir): a F3b/F4 chama isto com o calculado do KhRegras.
    function podarAjustesMigrados(ficha, calculado) {
      var calc = typeof calculado === 'function' ? calculado(ficha) : calculado;
      if (!obj(calc)) return [];
      var podados = [];
      Object.keys(ficha.ajustes).forEach(function (k) {
        var aj = ficha.ajustes[k];
        if (!aj || aj.origem !== 'migracao' || !temPropria(calc, k) || typeof calc[k] !== 'number') return;
        if (aj.valor === calc[k]) { delete ficha.ajustes[k]; podados.push(k); }
        else aj.calculadoEm = calc[k];
      });
      if (obj(ficha.migracao)) delete ficha.migracao.ajustesPendentesDePoda;
      return podados;
    }
    function podaPendente(ficha) { return !!(ficha && obj(ficha.migracao) && ficha.migracao.ajustesPendentesDePoda); }

    // Os Mods das entradas que o motor soma: tira os que já estão num total
    // migrado da v2 (entrada com migradoDe.efeitoNoTotal, alvo atributo.* com
    // atributos.migradoTotal ou pericia.* com periciasMigracao.migradoTotal).
    // [{uid, tipo, id, mod}]; o KhRegras (F3b) lê daqui, nunca de entrada.mods direto.
    function jaNoTotal(ficha, entrada, mod) {
      if (!entrada.migradoDe || !entrada.migradoDe.efeitoNoTotal || !mod || typeof mod.alvo !== 'string') return false;
      return Object.keys(ALVOS_NO_TOTAL).some(function (pre) {
        var bloco = ficha[ALVOS_NO_TOTAL[pre]];
        return mod.alvo.indexOf(pre) === 0 && obj(bloco) && bloco.migradoTotal === true;
      });
    }
    function modsAplicaveis(ficha) {
      var out = [];
      lista(ficha && ficha.entradas).forEach(function (e) {
        lista(e.mods).forEach(function (m) {
          if (!jaNoTotal(ficha, e, m)) out.push({ uid: e.uid, tipo: e.tipo, id: e.id, mod: m });
        });
      });
      return out;
    }

    // ---------------- catálogo (injetado) ----------------
    // Monta as entradas {id, tipo, nome, classe?, raca?, resumo?, apelidos?, mods?}
    // a partir do que o KhCatalogo (F3b) ou o teste carregar:
    //   catalogos: [data/catalogo/*.json]  (cada um {entradas:[…]})
    //   classes:   [data/classes/*.json]   (bloco 'classe': a classe e os ramos;
    //              o ramo ganha os apelidos que a v2 gravava em texto livre:
    //              a chave e o nome sem "Ramo do", ex.: "Cartógrafo")
    //   racas:     [data/racas/*.json]     (bloco 'raca': poderes e adversidades
    //              da corrupção viram tipo 'corrupcao' daquela raça)
    function entradasDeCatalogo(dados) {
      dados = obj(dados) ? dados : {};
      var out = [];
      function poe(e) { if (obj(e) && e.id && e.tipo) out.push(e); }
      lista(dados.catalogos).forEach(function (cat) {
        lista(cat && cat.entradas).forEach(function (e) {
          if (!obj(e)) return;
          var x = { id: e.id, tipo: e.tipo, nome: str(e.nome), classe: e.classe || null, raca: e.raca || null, resumo: str(e.resumo) };
          if (Array.isArray(e.mods)) x.mods = clone(e.mods);
          poe(x);
        });
      });
      lista(dados.classes).forEach(function (b) {
        var c = obj(b) && obj(b.classe) ? b.classe : b;
        if (!obj(c) || !c.id) return;
        var chave = chaveDe(c.id, 'classe-');
        poe({ id: c.id, tipo: 'classe', nome: str(c.nome) });
        lista(c.ramos).forEach(function (r) {
          if (!obj(r)) return;
          var semPrefixo = str(r.nome).replace(/^[^A-Za-zÀ-ÿ]*Ramo d[oa]s?\s+/, '');
          poe({ id: r.id, tipo: 'ramo', nome: str(r.nome), classe: chave,
            apelidos: [r.chave, semPrefixo].filter(function (a) { return !!str(a); }) });
        });
      });
      lista(dados.racas).forEach(function (b) {
        var r = obj(b) && obj(b.raca) ? b.raca : b;
        var corr = obj(r) && obj(r.corrupcao) ? r.corrupcao : null;
        if (!corr) return;
        var chave = chaveDe(r.id, 'raca-');
        ['poderes', 'adversidades'].forEach(function (k) {
          lista(corr[k] && corr[k].itens).forEach(function (x) {
            if (obj(x)) poe({ id: x.id, tipo: 'corrupcao', nome: str(x.nome), raca: chave });
          });
        });
      });
      return out;
    }
    // entradas: as de entradasDeCatalogo (ou equivalentes)
    function indiceCatalogo(entradas, versao) {
      var porId = {}, porNome = {};
      lista(entradas).forEach(function (e) {
        if (!e || !e.id || !e.tipo) return;
        porId[e.tipo + ':' + e.id] = e;
        [e.nome].concat(lista(e.apelidos)).forEach(function (n) {
          var k = e.tipo + '|' + normaliza(n);
          if (!normaliza(n)) return;
          var l = porNome[k] = porNome[k] || [];
          if (l.indexOf(e) < 0) l.push(e);
        });
      });
      return { porId: porId, porNome: porNome, versao: str(versao) };
    }
    // {entrada} | {ambiguo:[ids]} | null. Desempata por classe/raça quando dá.
    function achar(idx, tipos, nome, filtro) {
      if (!idx) return null;
      var cands = [];
      tipos.forEach(function (t) { lista(idx.porNome[t + '|' + normaliza(nome)]).forEach(function (e) { cands.push(e); }); });
      if (!cands.length) return null;
      if (cands.length === 1) return { entrada: cands[0] };
      filtro = filtro || {};
      var f = cands.filter(function (e) {
        return (!filtro.classe || !e.classe || e.classe === filtro.classe) &&
          (!filtro.raca || !e.raca || e.raca === filtro.raca);
      });
      if (f.length === 1) return { entrada: f[0] };
      return { ambiguo: cands.map(function (e) { return e.tipo + ':' + e.id; }) };
    }
    // 'classe-brutalista' -> 'brutalista'; 'raca-anao' -> 'anao'
    function chaveDe(id, pre) { return id && id.indexOf(pre) === 0 ? id.slice(pre.length) : null; }

    // ---------------- migração 1.0 -> 2.0 (o mesmo que o ficha-v2.js faz) ----------------
    var PERICIAS_V2 = ['atacar', 'defender', 'movimento', 'fortitude', 'vontade', 'reflexos', 'percepcao',
      'sobrevivencia', 'furtividade', 'crime', 'iniciativa', 'conhecimento', 'medicina', 'investigacao',
      'religiao', 'mistico', 'convencimento', 'intimidacao', 'intuicao', 'enganacao', 'motivar', 'oficio'];
    var RESIST_V2 = ['ordinario', 'fogo', 'frio', 'eletrico', 'veneno', 'acido', 'psiquico', 'forca',
      'radiante', 'trovejante', 'necrotico', 'primordial'];
    var DERIVADOS_V2 = { evasao: 0, cd: 0, movimento: 9, armadura: 0 };   // novaFicha da v2
    function baseV2() {
      var f = { schemaVersion: '2.0', rev: 0, salvoEm: '', exportadoEm: '', migradoEm: '',
        meta: { nome: '', jogador: '', nivel: 1, xp: 0, raca: '', variante: '', classe: '', ramo: '', origem: '' },
        atributos: { for: 10, des: 10, con: 10, int: 10, sab: 10 },
        pericias: {}, oficioAttr: 'int',
        recursos: { saude: { atual: 0, max: 0 }, stamina: { atual: 0, max: 0 }, eter: { atual: 0, max: 0 },
          recursoClasse: { nome: '', atual: 0, max: 0 } },
        derivadosManuais: clone(DERIVADOS_V2),
        resistencias: {}, inventario: { sins: 0, bugigangas: [], equipamentos: [] },
        tecnicas: [], grimorio: [], cartasLimiar: [], lore: { historia: '', outros: '' } };
      PERICIAS_V2.forEach(function (p) { f.pericias[p] = 0; });
      RESIST_V2.forEach(function (r) { f.resistencias[r] = { R: false, I: false, ae: 0 }; });
      return f;
    }
    function migrarV1paraV2(f, agora) {
      var m = mescla(baseV2(), KhInv.migrarV1(f, agora));
      if (!obj(m.inventario)) m.inventario = baseV2().inventario;
      delete m.inventario.armas; delete m.inventario.materiais;
      KhInv.COLUNAS.forEach(function (c) { if (!Array.isArray(m.inventario[c])) m.inventario[c] = []; });
      m.schemaVersion = '2.0';
      m.rev = Math.max(0, inteiro(m.rev, 0));
      ['salvoEm', 'exportadoEm', 'migradoEm'].forEach(function (k) { if (typeof m[k] !== 'string') m[k] = ''; });
      return m;
    }

    // ---------------- migração 2.0 -> 3.0 ----------------
    // tipo gravado pela v2 (MAPA do ficha-v2.js) -> tipo v3 e os tipos do catálogo
    // onde procurar. O .tech-card do Autômato entrava como 'tecnica' na v2.
    var TIPOS_V2 = {
      magia: ['magia', ['magia']], tecnica: ['tecnica', ['tecnica', 'tecnologia']],
      ultimate: ['ultimate', ['ultimate']], marca: ['marca', ['marca']],
      'traço': ['traco', ['traco']], traco: ['traco', ['traco']],
      variante: ['variante', ['variante']], 'subespécie': ['subespecie', ['subespecie']],
      subespecie: ['subespecie', ['subespecie']], origem: ['origem', ['origem']],
      carta: ['carta', ['carta']], dor: ['dor', ['dor']], abismo: ['beneficio', ['beneficio']],
      'corrupção': ['corrupcao', ['corrupcao']], corrupcao: ['corrupcao', ['corrupcao']],
      adversidade: ['corrupcao', ['corrupcao']]
    };
    var LISTAS_V2 = ['tecnicas', 'grimorio', 'cartasLimiar'];
    // o que a v2 digitava à mão e vira ajuste (M2) quando difere do default e do calculado
    var AJUSTES_V2 = [
      ['derivadosManuais', 'evasao', 'evasao.passiva', DERIVADOS_V2.evasao],
      ['derivadosManuais', 'cd', 'cd', DERIVADOS_V2.cd],
      ['derivadosManuais', 'movimento', 'movimento', DERIVADOS_V2.movimento],
      ['derivadosManuais', 'armadura', 'ar', DERIVADOS_V2.armadura],
      ['recursos.saude', 'max', 'recurso.saude.max', 0],
      ['recursos.stamina', 'max', 'recurso.stamina.max', 0],
      ['recursos.eter', 'max', 'recurso.eter.max', 0],
      ['recursos.recursoClasse', 'max', 'recurso.classe.max', 0]
    ];
    function em(o, caminho) {
      return caminho.split('.').reduce(function (a, k) { return obj(a) ? a[k] : undefined; }, o);
    }
    // a v2 grava o nome da corrupção com o custo: "Sangue Morto (-1)"
    function nomeSemCusto(nome) { return str(nome).replace(/\s*\([+\-−]?\d+\)\s*$/, ''); }

    function associa(e, idx, filtro, c) {
      var def = TIPOS_V2[e.tipo] || TIPOS_V2[normaliza(e.tipo)];
      var tipo = def ? def[0] : null;
      var nome = tipo === 'corrupcao' ? nomeSemCusto(e.nome) : str(e.nome);
      var r = { tipo: tipo, id: null, orfao: null };
      if (!def) { r.orfao = { motivo: 'tipo-desconhecido' }; return r; }
      if (!idx) { r.orfao = { motivo: 'sem-catalogo' }; return r; }
      var a = achar(idx, def[1], nome, filtro);
      if (a && a.entrada) { r.tipo = a.entrada.tipo; r.id = a.entrada.id; r.entradaCat = a.entrada; }
      else if (a && a.ambiguo) r.orfao = { motivo: 'ambiguo', candidatos: a.ambiguo };
      else r.orfao = { motivo: 'sem-par' };
      return r;
    }

    function migrarV2paraV3(v2, opcoes) {
      opcoes = opcoes || {};
      var c = ctx(opcoes), agora = c.agora(), idx = opcoes.catalogo || null;
      var avisos = [];
      var f = novaFicha({ id: opcoes.id || novoId(null, opcoes) }, opcoes);
      var m = v2.meta || {};
      f.meta = { nome: str(m.nome), jogador: str(m.jogador),
        nivel: limita(inteiro(m.nivel, 1), 1, 5), xp: Math.max(0, inteiro(m.xp, 0)) };

      // identidade por id (nome como cache; sem par, fica só o nome)
      function ident(campo, tipos, filtro) {
        var nome = str(m[campo]).trim();
        if (!nome) return ref();
        var a = achar(idx, tipos, nome, filtro);
        if (a && a.entrada) return ref(a.entrada.id, a.entrada.nome);
        avisos.push({ tipo: 'identidade', campo: campo, nome: nome,
          motivo: !idx ? 'sem-catalogo' : (a && a.ambiguo ? 'ambiguo' : 'sem-par') });
        return ref(null, nome);
      }
      f.identidade.raca = ident('raca', ['raca']);
      f.identidade.classe = ident('classe', ['classe']);
      f.identidade.origem = ident('origem', ['origem']);
      var raca = chaveDe(f.identidade.raca.id, 'raca-');
      var classe = chaveDe(f.identidade.classe.id, 'classe-');
      f.identidade.ramo = ident('ramo', ['ramo'], { classe: classe });
      var vari = str(m.variante).trim(), va = vari && achar(idx, ['variante', 'subespecie'], vari, { raca: raca });
      if (va && va.entrada) f.identidade[va.entrada.tipo] = ref(va.entrada.id, va.entrada.nome);
      else if (vari) {
        f.identidade.variante = ref(null, vari);
        avisos.push({ tipo: 'identidade', campo: 'variante', nome: vari,
          motivo: !idx ? 'sem-catalogo' : (va && va.ambiguo ? 'ambiguo' : 'sem-par') });
      }

      // atributo: o total digitado na v2 vira a base, marcado (raça e nível já dentro)
      var at = v2.atributos || {};
      ATRIBUTOS.forEach(function (A) { f.atributos.base[A] = limita(inteiro(at[A.toLowerCase()], 10), 1, 30); });
      f.atributos.fonte = 'migrado';
      f.atributos.migradoTotal = true;
      f.atributos.nivelMigrado = f.meta.nivel;

      // perícias: bônus 0/2/4/6/8 -> grau 0-4; como o atributo, é o TOTAL
      // digitado (treinamento de classe, origem e cartas já dentro)
      var pe = v2.pericias || {}, pendencias = [];
      f.periciasMigracao = { migradoTotal: true, nivelMigrado: f.meta.nivel };
      PERICIAS.forEach(function (p) { if (temPropria(pe, p)) f.pericias[p] = KhInv.grauPericia(pe[p]); });
      var gOf = KhInv.grauPericia(pe.oficio);
      if (gOf > 0 || (v2.oficioAttr && v2.oficioAttr !== 'int')) {
        // Ofício(X) genérico: qual dos três é escolha do jogador, não da migração
        pendencias.push({ campo: 'pericias.oficio', grau: gOf, oficioAttr: str(v2.oficioAttr || 'int'),
          motivo: 'A v2 tinha um Ofício(X) genérico; escolha qual Ofício (Engenharia, Ferraria ou Alquimia) recebe o grau.' });
      }

      // recursos atuais (estado); máximos digitados viram ajuste abaixo
      var rc = v2.recursos || {};
      f.recursos.saude.atual = numero(em(rc, 'saude.atual'), 0);
      f.recursos.stamina.atual = numero(em(rc, 'stamina.atual'), 0);
      f.recursos.eter.atual = numero(em(rc, 'eter.atual'), 0);
      f.recursos.classe = { id: null, nome: str(em(rc, 'recursoClasse.nome')), atual: numero(em(rc, 'recursoClasse.atual'), 0) };
      // 0/0 é o padrão da v2 (campo nunca preenchido): o atual migra como 0, o
      // máximo sai da fórmula do contrato, e o alerta da condição (Morrendo,
      // Exaurido, Oco) pode ser só efeito disso. Quem decide é o jogador.
      [['saude', 'Saúde', 'Morrendo'], ['stamina', 'Stamina', 'Exaurido'], ['eter', 'Éter', 'Oco']].forEach(function (x) {
        var r = obj(rc[x[0]]) ? rc[x[0]] : null;
        if (!r || numero(r.atual, NaN) !== 0 || numero(r.max, NaN) !== 0) return;
        pendencias.push({ campo: 'recursos.' + x[0], recurso: x[0],
          motivo: 'A v2 tinha ' + x[1] + ' 0/0 (o padrão, nunca preenchido): o atual migrou como 0 e o máximo sai da fórmula; ' +
            'o alerta de ' + x[2] + ' pode ser efeito da migração. Confira o ' + x[1] + ' atual.' });
      });

      // resistências: 'ordinario' da v2 vira os 3 tipos (R/I) e a Ae de categoria
      var rs = obj(v2.resistencias) ? v2.resistencias : {};
      Object.keys(rs).forEach(function (k) {
        var v = rs[k] || {}, ae = Math.max(0, inteiro(v.ae, 0));
        var alvo = k === 'ordinario' ? ['cortante', 'contundente', 'perfurante'] : (TIPOS_DANO.indexOf(k) >= 0 ? [k] : []);
        if (!alvo.length) { avisos.push({ tipo: 'resistencia', chave: k, motivo: 'tipo desconhecido' }); return; }
        alvo.forEach(function (t) { f.resistencias.tipos[t].R = !!v.R; f.resistencias.tipos[t].I = !!v.I; });
        if (k === 'ordinario') f.resistencias.aeCategoria.ordinario = ae;
        else f.resistencias.tipos[k].ae = ae;
        // Ae(Ordinário) não existe no contrato (D67: é Ar): o número fica
        // guardado, fora da mitigação, até o Pedro dizer para onde vai
        if (k === 'ordinario' && ae > 0) {
          pendencias.push({ campo: 'resistencias.aeCategoria.ordinario', valor: ae,
            motivo: 'A v2 tinha Ae(Ordinário) ' + ae + ', que não existe no contrato (D67: é Ar). O número ficou guardado e ' +
              'não entra na redução de Cortante, Contundente e Perfurante até o Pedro decidir para onde vai.' });
        }
      });

      // inventário: o do KhInv, como está
      f.inventario = clone(v2.inventario || f.inventario);
      KhInv.COLUNAS.forEach(function (col) { if (!Array.isArray(f.inventario[col])) f.inventario[col] = []; });
      f.inventario.sins = Math.max(0, inteiro(f.inventario.sins, 0));

      f.lore = { historia: str(em(v2, 'lore.historia')), outros: str(em(v2, 'lore.outros')) };

      // entidades: por referência, com cache; sem par ou ambíguo vira órfã
      var usados = {}, vistos = {};
      LISTAS_V2.forEach(function (l) {
        lista(v2[l]).forEach(function (e) {
          if (!obj(e) || !str(e.nome).trim()) return;
          var r = associa(e, idx, { classe: classe, raca: raca }, c);
          var tipoV3 = r.tipo || 'tecnica';
          if (r.id && vistos[tipoV3 + ':' + r.id]) {
            avisos.push({ tipo: 'duplicada', ref: tipoV3 + ':' + r.id, nome: str(e.nome) });
            return;
          }
          if (r.id) vistos[tipoV3 + ':' + r.id] = true;
          var ent = { uid: novoUid(usados, c), tipo: tipoV3, id: r.id, estado: estadoPadrao(tipoV3),
            cache: { nome: r.entradaCat ? str(r.entradaCat.nome) : str(e.nome),
              resumo: str(e.descricao), versaoCatalogo: idx ? idx.versao : '' },
            mods: r.entradaCat && Array.isArray(r.entradaCat.mods) ? clone(r.entradaCat.mods) : [],
            adicionadoEm: agora,
            // efeitoNoTotal: os Mods de atributo/perícia desta entrada já estão
            // nos totais digitados na v2 (modsAplicaveis não os soma de novo)
            migradoDe: { id: str(e.id), tipo: str(e.tipo), nome: str(e.nome), efeitoNoTotal: true } };
          if (r.orfao) { ent.orfao = r.orfao; avisos.push({ tipo: 'orfa', ref: str(e.tipo) + ':' + str(e.id), motivo: r.orfao.motivo }); }
          f.entradas.push(ent);
        });
      });
      // a v2 não gravava a posição da carta na mão: o saldo do Limiar não as desconta
      var semPosicao = f.entradas.filter(function (e) { return e.tipo === 'carta'; }).length;
      if (semPosicao) {
        pendencias.push({ campo: 'limiar.posicaoNaMao', cartas: semPosicao,
          motivo: semPosicao + (semPosicao === 1 ? ' carta migrada sem posição' : ' cartas migradas sem posição') +
            ' na mão (a v2 não a gravava): o saldo do Limiar não ' + (semPosicao === 1 ? 'a desconta' : 'as desconta') + ' até anotar.' });
      }

      // ajustes: só o que difere do default da v2 E do calculado (M2)
      var calc = typeof opcoes.calculado === 'function' ? opcoes.calculado(f) : (obj(opcoes.calculado) ? opcoes.calculado : null);
      AJUSTES_V2.forEach(function (a) {
        var bloco = em(v2, a[0]);
        if (!obj(bloco) || !temPropria(bloco, a[1])) return;
        var v = numero(bloco[a[1]], NaN);
        if (!isFinite(v) || v === a[3]) return;
        var cv = calc && typeof calc[a[2]] === 'number' ? calc[a[2]] : null;
        if (cv !== null && cv === v) return;
        f.ajustes[a[2]] = { modo: 'fixa', valor: v, motivo: 'Valor digitado na ficha v2', temporario: false,
          desde: agora, calculadoEm: cv, origem: 'migracao' };
      });

      f.migracao = { de: '2.0', em: agora, pendencias: pendencias };
      // sem o calculado, os ajustes ainda não foram comparados com o motor:
      // a ficha fica marcada e o armazém não a grava até podarAjustesMigrados
      if (!calc) f.migracao.ajustesPendentesDePoda = true;
      // comPerda: os números da v2 que a v3 não guarda sem perda (a projeção os devolve)
      f.vinculoV2 = { revV2: Math.max(0, inteiro(v2.rev, 0)), salvoEmV2: str(v2.salvoEm), comPerda: comPerdaDe(v2) };
      f.criadoEm = agora;
      return { ficha: f, avisos: avisos };
    }

    // Cadeia: 1.0 -> 2.0 -> 3.0; 3.x é completada; maior que 3 é recusada.
    // {ficha, de, avisos} | {erro:'versao-futura'|'invalida', versao}
    function migrar(f, opcoes) {
      if (!obj(f)) return { erro: 'invalida' };
      var v = f.schemaVersion, maior = versaoMaior(v);
      if (maior > 3) return { erro: 'versao-futura', versao: str(v) };
      if (v == null && !obj(f.meta)) return { erro: 'invalida' };
      if (maior === 3) {
        var f3 = completaV3(clone(f));
        // id fora do padrão vira sufixo de chave do storage: gera um novo
        if (typeof f.id !== 'string' || !PADRAO_ID.test(f.id)) f3.id = novoId(null, opcoes);
        return { ficha: f3, de: str(v), avisos: [] };
      }
      var agora = ctx(opcoes).agora();
      var de = maior === 2 ? '2.0' : '1.0';
      var v2 = migrarV1paraV2(f, agora);
      var r = migrarV2paraV3(v2, opcoes);
      if (de === '1.0') r.ficha.migracao.de = '1.0';
      r.de = de;
      return r;
    }

    // Tenta de novo as órfãs migradas (sem catálogo na hora, ou catálogo que mudou)
    function reassociar(ficha, idx) {
      if (!idx) return 0;
      var n = 0;
      var classe = chaveDe(ficha.identidade && ficha.identidade.classe && ficha.identidade.classe.id, 'classe-');
      var raca = chaveDe(ficha.identidade && ficha.identidade.raca && ficha.identidade.raca.id, 'raca-');
      var vistos = {};
      ficha.entradas.forEach(function (e) { if (e.id) vistos[e.tipo + ':' + e.id] = true; });
      ficha.entradas.forEach(function (e) {
        if (e.id || !e.orfao || !e.migradoDe) return;
        var r = associa(e.migradoDe, idx, { classe: classe, raca: raca });
        if (!r.id || vistos[r.tipo + ':' + r.id]) { if (r.orfao) e.orfao = r.orfao; return; }
        vistos[r.tipo + ':' + r.id] = true;
        e.tipo = r.tipo; e.id = r.id; delete e.orfao;
        e.cache.nome = str(r.entradaCat.nome); e.cache.versaoCatalogo = idx.versao;
        if (Array.isArray(r.entradaCat.mods)) e.mods = clone(r.entradaCat.mods);
        n++;
      });
      return n;
    }
    // Entrada com id que sumiu do catálogo vira órfã (nunca é apagada, o cache
    // mostra); a que existe atualiza o nome/versão do cache. Devolve as órfãs.
    function reconciliar(ficha, idx) {
      var orfas = [];
      if (!idx) return orfas;
      ficha.entradas.forEach(function (e) {
        if (!e.id) { if (e.orfao) orfas.push(e.uid); return; }
        var cat = idx.porId[e.tipo + ':' + e.id];
        if (!cat) { e.orfao = { motivo: 'sumiu' }; orfas.push(e.uid); return; }
        if (e.orfao) delete e.orfao;
        e.cache.nome = str(cat.nome);
        if (cat.resumo != null) e.cache.resumo = str(cat.resumo);
        e.cache.versaoCatalogo = idx.versao;
        // o snapshot dos Mods acompanha o catálogo quando ele os tem
        if (Array.isArray(cat.mods)) e.mods = clone(cat.mods);
      });
      return orfas;
    }

    // ---------------- export / import (sem rede) ----------------
    function nomeArquivo(ficha) { return (str(ficha && ficha.meta && ficha.meta.nome).trim() || 'ficha').replace(/\s+/g, '_') + '.khalkaria.json'; }
    // Export nativo de UMA ficha: a ficha inteira (cache incluso: não depende do
    // catálogo nem de rede) + a sessão da Mesa. O log de desfazer não vai.
    function exportarFicha(ficha, sessao, opcoes) {
      var d = clone(ficha);
      d.exportadoEm = ctx(opcoes).agora();
      if (sessao != null) d.estadoSessao = clone(sessao);
      return { nomeArquivo: nomeArquivo(ficha), dados: d };
    }
    // ilegiveis: [{id, nome?, motivo, texto}] das fichas que não viram v3 aqui
    // (vão cruas no pacote, para não se perderem)
    function pacoteTodas(exportadas, opcoes, ilegiveis) {
      var d = { schema: SCHEMA_INDICE, exportadoEm: ctx(opcoes).agora(), fichas: exportadas.map(clone) };
      if (ilegiveis && ilegiveis.length) d.ilegiveis = clone(ilegiveis);
      return { nomeArquivo: 'khalkaria-fichas.json', dados: d };
    }
    // Ficha 1.x/2.x (ou sem schemaVersion) com meta é ficha, mesmo com schema
    // 'fichas/1' e lista 'fichas' no topo: o import da v2.1 antiga passava o
    // pacote pelo deepMerge, que preserva chave desconhecida, e a khalkaria_ficha
    // ficou com elas. Sem isto, a ficha do jogador viraria as fichas velhas do pacote.
    function pareceFichaV12(o) {
      var m = versaoMaior(o.schemaVersion);
      return obj(o.meta) && (o.schemaVersion == null || m === 1 || m === 2);
    }
    function ehPacote(o) {
      return obj(o) && !pareceFichaV12(o) && o.schema === SCHEMA_INDICE && Array.isArray(o.fichas) &&
        o.fichas.every(function (x) { return obj(x) && (x.schemaVersion != null || obj(x.meta)); });
    }
    // Lê um arquivo de import (texto ou objeto): ficha 1.0/2.0/3.x ou pacote
    // fichas/1. {fichas:[{ficha, sessao, de, avisos}], erros:[]}; nada é gravado.
    function lerImport(entrada, opcoes) {
      var o = entrada, erros = [], out = [];
      if (typeof o === 'string') { try { o = JSON.parse(o); } catch (e) { return { fichas: [], erros: [{ erro: 'json' }] }; } }
      if (!obj(o)) return { fichas: [], erros: [{ erro: 'invalida' }] };
      if (obj(o) && typeof o.schema === 'string' && /^fichas\//.test(o.schema) && o.schema !== SCHEMA_INDICE) {
        return { fichas: [], erros: [{ erro: 'versao-futura', versao: o.schema }] };
      }
      if (o.schema === SCHEMA_INDICE && !ehPacote(o) && !pareceFichaV12(o)) return { fichas: [], erros: [{ erro: 'invalida' }] };
      var itens = ehPacote(o) ? o.fichas : [o];
      if (ehPacote(o)) lista(o.ilegiveis).forEach(function (x) {
        erros.push({ erro: 'ilegivel-no-pacote', id: obj(x) ? str(x.id) : '', motivo: obj(x) ? str(x.motivo) : '' });
      });
      itens.forEach(function (x, i) {
        var sessao = obj(x) && temPropria(x, 'estadoSessao') ? x.estadoSessao : null;
        var limpo = obj(x) ? Object.assign({}, x) : x;
        if (obj(limpo)) delete limpo.estadoSessao;
        var r = migrar(limpo, opcoes);
        if (r.erro) { erros.push({ indice: i, erro: r.erro, versao: r.versao }); return; }
        if (opcoes && opcoes.catalogo) { reassociar(r.ficha, opcoes.catalogo); reconciliar(r.ficha, opcoes.catalogo); }
        if (podaPendente(r.ficha) && opcoes && opcoes.calculado) podarAjustesMigrados(r.ficha, opcoes.calculado);
        out.push({ ficha: r.ficha, sessao: sessao, de: r.de, avisos: r.avisos || [] });
      });
      return { fichas: out, erros: erros };
    }

    // ---------------- sombra (F3): só lê a v2, nada é gravado ----------------
    function sombra(storage, opcoes) {
      var raw = null;
      try { raw = storage && storage.getItem(CHAVES.v2); } catch (e) { raw = null; }
      if (!raw) return null;
      var f;
      try { f = JSON.parse(raw); } catch (e) { return { erro: 'json' }; }
      return migrar(f, opcoes);
    }

    // ---------------- escrita dupla (F4.2, puro; ligado só na F4.7) ----------------
    // Projeção v3 -> v2: a v2.1 só conhece UMA ficha (khalkaria_ficha). O que a
    // v2 representa sem perda é projetado; o que tem perda (COM_PERDA) leva a
    // MEMÓRIA da própria ficha, vinculoV2.comPerda (os números da v2 que ela
    // absorveu na migração ou no reimportar), e vai para 'perdas'. Ficha sem
    // vínculo (criada na v3, cópia) leva o padrão da novaFicha da v2: nunca o
    // número de OUTRO personagem que esteja na khalkaria_ficha.
    var MOTIVO_PERDA = {
      atributo: 'A v3 guarda a base do atributo (o total sai do motor de regras); a v2 guarda o total. Fica o valor da v2 desta ficha (ou o padrão da v2).',
      pericia: 'A v3 guarda o grau (0-4) e o motor soma o resto; a v2 guarda o bônus total. Fica o valor da v2 desta ficha (ou o padrão da v2).',
      oficio: 'A v3 tem três Ofícios (Engenharia, Ferraria, Alquimia); a v2 tem um Ofício(X) só. Fica o valor da v2 desta ficha (ou o padrão da v2).',
      ajuste: 'Na v3 este número é calculado (o digitado vira ajuste); a v2 guarda o número digitado. Fica o valor da v2 desta ficha (ou o padrão da v2).',
      ordinario: 'A v3 separa Cortante, Contundente e Perfurante, e eles não estão iguais (ou têm Ae própria); a v2 tem só Ordinário. Fica o valor da v2 desta ficha (ou o padrão da v2).',
      variante: 'A v3 tem variante e subespécie ao mesmo tempo; a v2 tem um campo só. Fica o valor da v2 desta ficha (ou o padrão da v2).',
      soV3: 'Só existe na v3: a v2 não tem onde guardar.',
      semLista: 'Entrada de um tipo que a ficha v2 não guarda.',
      duplicada: 'Outra entrada da v3 vira o mesmo card na v2: vai só a primeira.',
      entradaV2: 'Card da v2 sem par na ficha v3 (removido na v3, ou duplicado na migração): sai da v2.'
    };
    // tipo v3 -> o tipo que a v2 grava (MAPA do ficha-v2.js); raça e classe não têm card na v2
    var TIPO_PARA_V2 = { magia: 'magia', tecnica: 'tecnica', tecnologia: 'tecnica', ultimate: 'ultimate',
      marca: 'marca', traco: 'traço', variante: 'variante', subespecie: 'subespécie', origem: 'origem',
      carta: 'carta', dor: 'dor', beneficio: 'abismo', corrupcao: 'corrupção' };
    var TIPOS_3 = ['cortante', 'contundente', 'perfurante'];
    // os caminhos da v2 que a v3 não representa sem perda: sempre, e só às vezes
    // (Ordinário com os 3 tipos diferentes; variante e subespécie ao mesmo tempo)
    var COM_PERDA = ATRIBUTOS.map(function (A) { return 'atributos.' + A.toLowerCase(); })
      .concat(PERICIAS_V2.map(function (k) { return 'pericias.' + k; }), ['oficioAttr'],
        AJUSTES_V2.map(function (a) { return a[0] + '.' + a[1]; }));
    var COM_PERDA_AS_VEZES = ['resistencias.ordinario', 'meta.variante'];
    function poe(o, caminho, v) {
      var ks = caminho.split('.'), x = o;
      for (var i = 0; i < ks.length - 1; i++) { if (!obj(x[ks[i]])) x[ks[i]] = {}; x = x[ks[i]]; }
      x[ks[ks.length - 1]] = v;
    }
    // a memória do que tem perda, {caminho: valor}, de uma v2 já normalizada
    // (lerV2 ou o migrarV1paraV2); o caminho que faltar leva o padrão da v2
    function comPerdaDe(v2) {
      var out = {}, padrao = baseV2();
      COM_PERDA.concat(COM_PERDA_AS_VEZES).forEach(function (c) {
        var v = em(v2, c);
        out[c] = clone(v === undefined ? em(padrao, c) : v);
      });
      return out;
    }
    // a v2 é desta ficha: carimbada por uma projeção dela (origemV3) ou já absorvida (vinculoV2)
    function v2DaFicha(ficha, v2) {
      if (!obj(v2)) return false;
      var mk = obj(v2.origemV3) ? v2.origemV3 : null;
      return (!!mk && !!str(mk.fichaId) && str(mk.fichaId) === str(ficha.id)) || absorvida(ficha, v2);
    }
    function listaV2(tipo) { return tipo === 'magia' ? 'grimorio' : (tipo === 'carta' || tipo === 'dor' || tipo === 'beneficio' ? 'cartasLimiar' : 'tecnicas'); }
    // o slug do ficha-v2.js (id do card = tipo + '-' + slug do nome)
    function slugV2(nome) {
      return str(nome).normalize('NFKD').replace(/[̀-ͯ]/g, '')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    // o id do card na v2: o da migração (migradoDe) ou o que a v2 daria pelo nome
    function chaveV2(e) {
      if (!obj(e)) return null;
      if (obj(e.migradoDe) && str(e.migradoDe.id)) return str(e.migradoDe.id);
      var t = TIPO_PARA_V2[e.tipo];
      return t ? t + '-' + slugV2(e.cache && e.cache.nome) : null;
    }
    // igualdade sem depender da ordem das chaves (a v2.1 reserializa o que lê)
    function canon(x) {
      if (Array.isArray(x)) return '[' + x.map(canon).join(',') + ']';
      if (obj(x)) return '{' + Object.keys(x).sort().map(function (k) { return JSON.stringify(k) + ':' + canon(x[k]); }).join(',') + '}';
      return JSON.stringify(x === undefined ? null : x);
    }
    function igual(a, b) { return canon(a) === canon(b); }
    function temListasVelhas(f) {
      var inv = obj(f) ? f.inventario : null;
      return obj(inv) && (temPropria(inv, 'armas') || temPropria(inv, 'materiais'));
    }
    // A v2 (objeto ou texto) como a v2.1 a leria: a 2.0 sem listas velhas fica
    // como está, com os padrões da novaFicha da v2; 1.x e listas velhas passam
    // pelo migrarV1paraV2 (o mesmo migra() do ficha-v2.js). Lixo -> null.
    // agora: função (só chamada se precisar migrar) ou texto
    function lerV2(v2, agora) {
      if (typeof v2 === 'string') { try { v2 = JSON.parse(v2); } catch (e) { return null; } }
      if (!obj(v2)) return null;
      var base = baseV2(), m;
      if (v2.schemaVersion !== '2.0' || temListasVelhas(v2)) m = migrarV1paraV2(v2, typeof agora === 'function' ? agora() : agora);
      else m = mescla(base, clone(v2));
      // bloco que não é objeto (ou lista que não é lista) volta ao padrão da v2
      (function conserta(b, x) {
        Object.keys(b).forEach(function (k) {
          if (Array.isArray(b[k])) { if (!Array.isArray(x[k])) x[k] = clone(b[k]); }
          else if (obj(b[k])) { if (!obj(x[k])) x[k] = clone(b[k]); else conserta(b[k], x[k]); }
        });
      })(base, m);
      m.rev = Math.max(0, inteiro(m.rev, 0));
      ['salvoEm', 'exportadoEm', 'migradoEm'].forEach(function (k) { if (typeof m[k] !== 'string') m[k] = ''; });
      KhInv.COLUNAS.forEach(function (c) { if (!Array.isArray(m.inventario[c])) m.inventario[c] = []; });
      return m;
    }

    // projetarV2(fichaV3, v2Atual, {daFicha?}) -> {v2, perdas:[{campo, motivo, v2?, v3?}]}.
    // v2: 'schemaVersion 2.0' sem inventario.armas/materiais (a v2.1 lê sem
    // reescrever). A v2Atual só serve de base (rev, salvoEm, chaves que a v3 não
    // conhece, cards como estavam) quando é DESTA ficha (v2DaFicha, ou
    // op.daFicha); a de outro personagem não entra em nada. O que tem perda vem
    // de vinculoV2.comPerda; vínculo antigo, sem a memória, fica com o da v2
    // desta ficha; sem nenhum dos dois, o padrão da v2. Sem carimbo: quem grava
    // sobe o rev e põe o origemV3.
    function projetarV2(fichaV3, v2Atual, opcoes) {
      if (!obj(fichaV3)) return { v2: null, perdas: [], erro: 'invalida' };
      opcoes = opcoes || {};
      var f = completaV3(clone(fichaV3));
      var atual = v2Atual == null ? null : lerV2(v2Atual, opcoes.agora);
      var daFicha = !!atual && (typeof opcoes.daFicha === 'boolean' ? opcoes.daFicha : v2DaFicha(f, atual));
      var p = daFicha ? clone(atual) : baseV2();
      delete p.origemV3;
      var vk = obj(f.vinculoV2) ? f.vinculoV2 : null, memo = vk && obj(vk.comPerda) ? vk.comPerda : null;
      if (memo) COM_PERDA.concat(COM_PERDA_AS_VEZES).forEach(function (c) { if (temPropria(memo, c)) poe(p, c, clone(memo[c])); });
      var perdas = [];
      function perde(campo, motivo, v2, v3) {
        var x = { campo: campo, motivo: motivo };
        if (v2 !== undefined) x.v2 = clone(v2);
        if (v3 !== undefined) x.v3 = clone(v3);
        perdas.push(x);
      }
      p.schemaVersion = '2.0';
      if (str(f.exportadoEm)) p.exportadoEm = str(f.exportadoEm);

      // meta e identidade (a v2 guarda o nome; o id fica na v3)
      p.meta.nome = str(f.meta.nome); p.meta.jogador = str(f.meta.jogador);
      p.meta.nivel = limita(inteiro(f.meta.nivel, 1), 1, 5); p.meta.xp = Math.max(0, inteiro(f.meta.xp, 0));
      var idt = f.identidade;
      ['raca', 'classe', 'ramo', 'origem'].forEach(function (k) { p.meta[k] = str(idt[k] && idt[k].nome); });
      var vn = str(idt.variante && idt.variante.nome), sn = str(idt.subespecie && idt.subespecie.nome);
      if (vn && sn) perde('meta.variante', MOTIVO_PERDA.variante, p.meta.variante, { variante: vn, subespecie: sn });
      else p.meta.variante = vn || sn;

      // com perda: atributos (base x total), perícias (grau x bônus), Ofício
      ATRIBUTOS.forEach(function (A) {
        var k = A.toLowerCase();
        perde('atributos.' + k, MOTIVO_PERDA.atributo, p.atributos[k], f.atributos.base[A]);
      });
      PERICIAS_V2.forEach(function (k) {
        if (k !== 'oficio') { perde('pericias.' + k, MOTIVO_PERDA.pericia, p.pericias[k], f.pericias[k]); return; }
        perde('pericias.oficio', MOTIVO_PERDA.oficio, p.pericias.oficio, { 'oficio-engenharia': f.pericias['oficio-engenharia'],
          'oficio-ferraria': f.pericias['oficio-ferraria'], 'oficio-alquimia': f.pericias['oficio-alquimia'] });
      });
      perde('oficioAttr', MOTIVO_PERDA.oficio, p.oficioAttr);

      // recursos: o atual é estado (vai); o máximo e os derivados digitados viram ajuste na v3 (ficam)
      var rc = f.recursos;
      p.recursos.saude.atual = numero(rc.saude.atual, 0);
      p.recursos.stamina.atual = numero(rc.stamina.atual, 0);
      p.recursos.eter.atual = numero(rc.eter.atual, 0);
      p.recursos.recursoClasse.nome = str(rc.classe.nome);
      p.recursos.recursoClasse.atual = numero(rc.classe.atual, 0);
      if (numero(rc.saude.temporaria, 0)) perde('recursos.saude.temporaria', MOTIVO_PERDA.soV3, undefined, rc.saude.temporaria);
      if (numero(rc.stamina.comprometida, 0)) perde('recursos.stamina.comprometida', MOTIVO_PERDA.soV3, undefined, rc.stamina.comprometida);
      AJUSTES_V2.forEach(function (a) {
        var bloco = em(p, a[0]);
        perde(a[0] + '.' + a[1], MOTIVO_PERDA.ajuste, obj(bloco) ? bloco[a[1]] : undefined,
          temPropria(f.ajustes, a[2]) ? f.ajustes[a[2]] : null);
      });

      // resistências: os 11 tipos de nome igual vão 1:1; 'ordinario' só se os 3 estiverem iguais
      var rt = f.resistencias.tipos;
      RESIST_V2.forEach(function (k) {
        if (!obj(p.resistencias[k])) p.resistencias[k] = { R: false, I: false, ae: 0 };
        var alvo = p.resistencias[k];
        if (k === 'ordinario') {
          var tr = TIPOS_3.map(function (t) { return obj(rt[t]) ? rt[t] : {}; });
          var iguais = tr.every(function (x) { return !!x.R === !!tr[0].R && !!x.I === !!tr[0].I && !inteiro(x.ae, 0); });
          if (!iguais) {
            var v3 = {};
            TIPOS_3.forEach(function (t, i) { v3[t] = { R: !!tr[i].R, I: !!tr[i].I, ae: Math.max(0, inteiro(tr[i].ae, 0)) }; });
            v3.aeCategoria = Math.max(0, inteiro(f.resistencias.aeCategoria.ordinario, 0));
            perde('resistencias.ordinario', MOTIVO_PERDA.ordinario, alvo, v3);
            return;
          }
          alvo.R = !!tr[0].R; alvo.I = !!tr[0].I; alvo.ae = Math.max(0, inteiro(f.resistencias.aeCategoria.ordinario, 0));
          return;
        }
        var t = obj(rt[k]) ? rt[k] : {};
        alvo.R = !!t.R; alvo.I = !!t.I; alvo.ae = Math.max(0, inteiro(t.ae, 0));
      });
      TIPOS_DANO.forEach(function (t) { if (obj(rt[t]) && rt[t].V) perde('resistencias.' + t + '.V', MOTIVO_PERDA.soV3, undefined, true); });
      CATEGORIAS_AE.forEach(function (k) {
        var n = inteiro(f.resistencias.aeCategoria[k], 0);
        if (k !== 'ordinario' && n) perde('resistencias.aeCategoria.' + k, MOTIVO_PERDA.soV3, undefined, n);
      });
      if (inteiro(f.resistencias.aeTodos, 0)) perde('resistencias.aeTodos', MOTIVO_PERDA.soV3, undefined, inteiro(f.resistencias.aeTodos, 0));

      // inventário: o mesmo formato (KhInv), como está
      p.inventario = clone(f.inventario);
      delete p.inventario.armas; delete p.inventario.materiais;
      KhInv.COLUNAS.forEach(function (col) { if (!Array.isArray(p.inventario[col])) p.inventario[col] = []; });
      p.inventario.sins = Math.max(0, inteiro(p.inventario.sins, 0));

      // entradas -> cards da v2; o card que a v2 já tinha com o mesmo id vai como estava
      var antigas = {};
      LISTAS_V2.forEach(function (l) {
        lista(p[l]).forEach(function (e) { if (obj(e) && str(e.id) && !antigas[e.id]) antigas[e.id] = [l, e]; });
      });
      var novas = { tecnicas: [], grimorio: [], cartasLimiar: [] }, usadas = {};
      f.entradas.forEach(function (e) {
        var k = chaveV2(e), resumo = { tipo: e.tipo, id: e.id, nome: str(e.cache && e.cache.nome) };
        if (!k) { perde('entradas.' + str(e.uid), MOTIVO_PERDA.semLista, undefined, resumo); return; }
        if (usadas[k]) { perde('entradas.' + str(e.uid), MOTIVO_PERDA.duplicada, undefined, resumo); return; }
        usadas[k] = true;
        if (antigas[k]) { novas[antigas[k][0]].push(clone(antigas[k][1])); return; }
        var md = obj(e.migradoDe) ? e.migradoDe : {};
        novas[listaV2(e.tipo)].push({ id: k, tipo: str(md.tipo) || TIPO_PARA_V2[e.tipo] || str(e.tipo),
          nome: str(md.nome) || str(e.cache && e.cache.nome), descricao: str(e.cache && e.cache.resumo) });
      });
      Object.keys(antigas).forEach(function (k) {
        if (!usadas[k]) perde(antigas[k][0] + '.' + k, MOTIVO_PERDA.entradaV2, antigas[k][1]);
      });
      LISTAS_V2.forEach(function (l) { p[l] = novas[l]; });

      p.lore = Object.assign(obj(p.lore) ? p.lore : {}, { historia: str(f.lore.historia), outros: str(f.lore.outros) });
      return { v2: p, perdas: perdas };
    }

    // true quando khalkaria_ficha não é mais a última projeção gravada: uma
    // aba v2.1 gravou por cima (rev maior) ou ela foi trocada (rev/salvoEm
    // diferentes). Sem projeção no índice, ou sem v2, não há conflito.
    function conflitoV2(indice, v2Atual) {
      var p = obj(indice) && obj(indice.projecaoV2) ? indice.projecaoV2 : null;
      if (!p || v2Atual == null) return false;
      var v2 = v2Atual;
      if (typeof v2 === 'string') { try { v2 = JSON.parse(v2); } catch (e) { return true; } }
      if (!obj(v2)) return true;
      return inteiro(v2.rev, 0) !== inteiro(p.revV2, 0) || str(v2.salvoEm) !== str(p.salvoEmV2);
    }
    // A ficha já tem esta versão da v2 (migrou dela ou a reimportou): vinculoV2
    // igual. Vínculo vazio (rev 0 e sem salvoEm: veio de uma v1, ou de uma v2
    // que a v2.1 nunca gravou) não identifica versão nenhuma e nunca casa: toda
    // v1 intocada tem o mesmo {0, ''}.
    function absorvida(ficha, v2) {
      var vk = obj(ficha) && obj(ficha.vinculoV2) ? ficha.vinculoV2 : null;
      if (!vk || !obj(v2) || (inteiro(vk.revV2, 0) <= 0 && !str(vk.salvoEmV2))) return false;
      return inteiro(vk.revV2, -1) === inteiro(v2.rev, 0) && str(vk.salvoEmV2) === str(v2.salvoEm);
    }
    // sem carimbo, a v2 parece OUTRO personagem: nome diferente e classe ou raça
    // diferente (a v2.1 importou outra ficha ou começou uma nova)
    function outraIdentidade(v2, pf) {
      function difere(k) { return normaliza(v2.meta[k]) !== normaliza(pf.meta[k]); }
      return difere('nome') && (difere('classe') || difere('raca'));
    }

    // reimportarV2(fichaV3, v2, {catalogo?, base?, projecao?}) ->
    //   {ficha, mudou:[caminhos], avisos, perdas, conflitos, ancestral} | {…, erro}.
    // projecao: o projecaoV2 do índice. De qual versão a v2 descende diz o
    // carimbo origemV3 {fichaId, revV2} que a gravação põe e a v2.1 preserva (o
    // deepMerge dela guarda chave desconhecida). O 'ancestral':
    //  - 'projecao' (carimbo desta ficha, o da última projeção) e 'vinculo' (sem
    //    carimbo nem projeção desta ficha: veio do import da v2, F3): MERGE por
    //    campo contra a projeção de 'base' (a ficha que foi projetada; sem base,
    //    a própria fichaV3). Mudou só na v2: entra. Mudou nas duas, diferente:
    //    fica o da v3 e sai em 'conflitos' {campo, v2, v3, base}.
    //  - 'antiga' (carimbo de uma projeção mais velha desta ficha: uma aba v2.1
    //    gravou sem adotar a última) e 'trocada' (sem carimbo, mas o índice diz
    //    que a v2 era a projeção desta ficha): sem ancestral confiável, NADA entra
    //    sozinho; toda diferença sai em 'conflitos' {campo, v2, v3}.
    //  - erro 'outra-ficha' (nada muda): carimbo de outra ficha (fichaIdV2), ou,
    //    sem carimbo, nome e classe/raça diferentes (a v2.1 importou ou começou
    //    outra ficha). A UI oferece importar a v2 como ficha nova.
    // O que tem perda (COM_PERDA) nunca entra: se a v2 difere do que foi
    // projetado (a memória vinculoV2.comPerda da base, ou o padrão da v2), sai
    // em 'perdas' {campo, motivo, v2, antes, v3?} (semReferencia: vínculo antigo
    // sem a memória, comparado com o padrão). O que só existe na v3 (uid e estado
    // das entradas, porNivel, ajustes, Vhelor, os 14 tipos…) fica. Nunca passa a
    // ficha pelo migrarV2paraV3 (recriaria a ficha). vinculoV2 passa a ser a v2
    // reimportada, com a memória dela: gravar depois resolve o conflito.
    function reimportarV2(fichaV3, v2Entrada, opcoes) {
      opcoes = opcoes || {};
      var c = ctx(opcoes), agora = c.agora(), idx = opcoes.catalogo || null;
      var f = completaV3(clone(fichaV3));
      var mudou = [], avisos = [], perdas = [], conflitos = [];
      function fim(extra) { return Object.assign({ ficha: f, mudou: mudou, avisos: avisos, perdas: perdas, conflitos: conflitos }, extra); }
      var v2 = lerV2(v2Entrada, agora);
      if (!v2) return fim({ erro: 'v2-ilegivel' });
      var proj = obj(opcoes.projecao) ? opcoes.projecao : null;
      var mk = obj(v2.origemV3) && str(v2.origemV3.fichaId) ? v2.origemV3 : null;
      if (mk && str(mk.fichaId) !== str(f.id)) return fim({ erro: 'outra-ficha', fichaIdV2: str(mk.fichaId) });
      var ancestral = mk
        ? (!proj || (str(proj.fichaId) === str(f.id) && inteiro(mk.revV2, -1) === inteiro(proj.revV2, -2)) ? 'projecao' : 'antiga')
        : (proj && str(proj.fichaId) === str(f.id) ? 'trocada' : 'vinculo');
      var confiavel = ancestral === 'projecao' || ancestral === 'vinculo';
      var b = confiavel && obj(opcoes.base) ? completaV3(clone(opcoes.base)) : f;
      // a v3 e a base em termos de v2, sem a v2 recebida: o que tem perda vem da memória
      var opP = { agora: function () { return agora; } };
      var rf = projetarV2(f, null, opP), rb = b === f ? rf : projetarV2(b, null, opP), pf = rf.v2, pb = rb.v2;
      if (!mk && outraIdentidade(v2, pf)) return fim({ erro: 'outra-ficha', fichaIdV2: null });

      // com perda: só o aviso (a v3 não tem onde pôr sem inventar)
      function porCampo(l) { var m = {}; l.forEach(function (x) { if (!m[x.campo]) m[x.campo] = x; }); return m; }
      var perF = porCampo(rf.perdas), perB = porCampo(rb.perdas);
      var semRef = obj(b.vinculoV2) && !obj(b.vinculoV2.comPerda), temPerda = {};
      COM_PERDA.concat(COM_PERDA_AS_VEZES.filter(function (k) { return perF[k] || perB[k]; })).forEach(function (k) {
        temPerda[k] = true;
        var a = em(v2, k), antes = em(pb, k);
        if (igual(a, antes)) return;
        var x = { campo: k, motivo: (perF[k] || perB[k]).motivo, v2: clone(a), antes: clone(antes) };
        if (perF[k] && perF[k].v3 !== undefined) x.v3 = clone(perF[k].v3);
        if (semRef) x.semReferencia = true;
        perdas.push(x);
      });

      // sem perda: entra o que só a v2 mudou; o que as duas mudaram é conflito
      function decide(campo, vV2, vB, vF, eq) {
        eq = eq || igual;
        if (eq(vV2, confiavel ? vB : vF) || eq(vV2, vF)) return false;
        if (!confiavel || !eq(vF, vB)) {
          var x = { campo: campo, v2: clone(vV2), v3: clone(vF) };
          if (confiavel) x.base = clone(vB);
          conflitos.push(x);
          return false;
        }
        return true;
      }
      function troca(caminho, vV2, vB, vF, aplica) {
        if (!decide(caminho, vV2, vB, vF)) return;
        aplica(vV2);
        mudou.push(caminho);
      }
      var m2 = v2.meta, mb = pb.meta, mf = pf.meta;
      troca('meta.nome', str(m2.nome), str(mb.nome), str(mf.nome), function (v) { f.meta.nome = v; });
      troca('meta.jogador', str(m2.jogador), str(mb.jogador), str(mf.jogador), function (v) { f.meta.jogador = v; });
      troca('meta.nivel', limita(inteiro(m2.nivel, 1), 1, 5), mb.nivel, mf.nivel, function (v) { f.meta.nivel = v; });
      troca('meta.xp', Math.max(0, inteiro(m2.xp, 0)), mb.xp, mf.xp, function (v) { f.meta.xp = v; });

      // identidade: nome igual (sem acento/caixa) ou o mesmo id pelo catálogo = sem mudança
      // (a v2 guarda o texto que o jogador digitou; a v3, o nome do catálogo)
      function mesmaIdent(tipos, filtro) {
        return function (a, b2) {
          if (normaliza(a) === normaliza(b2)) return true;
          if (!idx || !normaliza(a) || !normaliza(b2)) return false;
          var x = achar(idx, tipos, a, filtro), y = achar(idx, tipos, b2, filtro);
          return !!(x && x.entrada && y && y.entrada && x.entrada.id === y.entrada.id);
        };
      }
      function resolve(nome, tipos, filtro, campo) {
        var a = nome && idx ? achar(idx, tipos, nome, filtro) : null;
        if (nome && !(a && a.entrada)) {
          avisos.push({ tipo: 'identidade', campo: campo, nome: nome, motivo: !idx ? 'sem-catalogo' : (a && a.ambiguo ? 'ambiguo' : 'sem-par') });
        }
        return a && a.entrada ? a.entrada : null;
      }
      function ident(campo, tipos, filtro) {
        var n2 = str(m2[campo]).trim();
        if (!decide('identidade.' + campo, n2, str(mb[campo]), str(mf[campo]), mesmaIdent(tipos, filtro))) return;
        var atual = obj(f.identidade[campo]) ? f.identidade[campo] : ref();
        var e = resolve(n2, tipos, filtro, campo);
        if (e && atual.id && e.id === atual.id) return;
        f.identidade[campo] = !n2 ? ref() : (e ? ref(e.id, e.nome) : ref(null, n2));
        mudou.push('identidade.' + campo);
      }
      ident('raca', ['raca']); ident('classe', ['classe']); ident('origem', ['origem']);
      var raca = chaveDe(f.identidade.raca.id, 'raca-'), classe = chaveDe(f.identidade.classe.id, 'classe-');
      ident('ramo', ['ramo'], { classe: classe });
      var v2v = str(m2.variante).trim();
      if (!temPerda['meta.variante'] &&
          decide('identidade.variante', v2v, str(mb.variante), str(mf.variante), mesmaIdent(['variante', 'subespecie'], { raca: raca }))) {
        var cv = f.identidade.variante || ref(), cs = f.identidade.subespecie || ref();
        var ev = resolve(v2v, ['variante', 'subespecie'], { raca: raca }, 'variante');
        if (!(ev && (ev.id === cv.id || ev.id === cs.id))) {
          var campoV = ev ? ev.tipo : (str(cs.nome) && !str(cv.nome) ? 'subespecie' : 'variante');
          f.identidade.variante = ref(); f.identidade.subespecie = ref();
          if (v2v) f.identidade[campoV] = ev ? ref(ev.id, ev.nome) : ref(null, v2v);
          mudou.push('identidade.' + campoV);
        }
      }

      // recursos: só o atual (estado) e o nome do recurso de classe
      [['saude', 'saude'], ['stamina', 'stamina'], ['eter', 'eter'], ['recursoClasse', 'classe']].forEach(function (x) {
        var k = 'recursos.' + x[0] + '.atual';
        troca('recursos.' + x[1] + '.atual', numero(em(v2, k), 0), numero(em(pb, k), 0), numero(em(pf, k), 0),
          function (v) { f.recursos[x[1]].atual = v; });
      });
      troca('recursos.classe.nome', str(em(v2, 'recursos.recursoClasse.nome')), str(em(pb, 'recursos.recursoClasse.nome')),
        str(em(pf, 'recursos.recursoClasse.nome')), function (v) { f.recursos.classe.nome = v; });

      // resistências: R/I/ae dos 11 tipos; 'ordinario' só quando não tem perda (senão saiu em 'perdas')
      RESIST_V2.forEach(function (k) {
        if (k === 'ordinario' && temPerda['resistencias.ordinario']) return;
        function de(p) { return obj(p.resistencias[k]) ? p.resistencias[k] : {}; }
        var r2 = de(v2), rb = de(pb), rf = de(pf);
        var alvos = k === 'ordinario' ? TIPOS_3 : [k];
        ['R', 'I'].forEach(function (q) {
          troca('resistencias.' + k + '.' + q, !!r2[q], !!rb[q], !!rf[q], function (v) {
            alvos.forEach(function (t) { f.resistencias.tipos[t][q] = v; });
          });
        });
        var ae = function (r) { return Math.max(0, inteiro(r.ae, 0)); };
        troca('resistencias.' + k + '.ae', ae(r2), ae(rb), ae(rf), function (v) {
          if (k === 'ordinario') f.resistencias.aeCategoria.ordinario = v; else f.resistencias.tipos[k].ae = v;
        });
      });

      // inventário: por coluna (o uid de cada item é o mesmo nas duas)
      var sins = function (p) { return Math.max(0, inteiro(p.inventario.sins, 0)); };
      troca('inventario.sins', sins(v2), sins(pb), sins(pf), function (v) { f.inventario.sins = v; });
      KhInv.COLUNAS.forEach(function (col) {
        troca('inventario.' + col, lista(v2.inventario[col]), lista(pb.inventario[col]), lista(pf.inventario[col]),
          function (v) { f.inventario[col] = clone(v); });
      });

      troca('lore.historia', str(em(v2, 'lore.historia')), str(em(pb, 'lore.historia')), str(em(pf, 'lore.historia')),
        function (v) { f.lore.historia = v; });
      troca('lore.outros', str(em(v2, 'lore.outros')), str(em(pb, 'lore.outros')), str(em(pf, 'lore.outros')),
        function (v) { f.lore.outros = v; });
      // a v2 vira a absorvida (com a memória do que tem perda): gravar depois resolve o conflito
      function terminaReimport() {
        f.vinculoV2 = { revV2: Math.max(0, inteiro(v2.rev, 0)), salvoEmV2: str(v2.salvoEm), comPerda: comPerdaDe(v2) };
        return fim({ ancestral: ancestral });
      }

      // entradas (pelo id do card da v2)
      function cards(p, soComNome) {
        var m = {};
        LISTAS_V2.forEach(function (l) {
          lista(p[l]).forEach(function (e) {
            if (!obj(e) || !str(e.id) || m[e.id] || (soComNome && !str(e.nome).trim())) return;
            m[e.id] = { lista: l, card: e };
          });
        });
        return m;
      }
      var cB = cards(pb), cF = cards(pf), c2 = cards(v2, true);
      if (!confiavel) {
        Object.keys(c2).forEach(function (k) { if (!cF[k]) conflitos.push({ campo: c2[k].lista + '.' + k, v2: clone(c2[k].card), v3: null }); });
        Object.keys(cF).forEach(function (k) { if (!c2[k]) conflitos.push({ campo: cF[k].lista + '.' + k, v2: null, v3: clone(cF[k].card) }); });
        return terminaReimport();
      }
      // card que saiu da v2 sai da v3; card novo na v2 entra como entrada nova (se a v3 já não o tiver)
      var novosV2 = Object.keys(c2).filter(function (k) { return !cB[k] && !cF[k]; }).map(function (k) { return c2[k].card; });
      var sai = {};
      f.entradas.forEach(function (e) { var k = chaveV2(e); if (k && cB[k] && !c2[k]) sai[e.uid] = true; });
      var filtro = { classe: classe, raca: raca }, usados = {}, vistos = {};
      f.entradas.forEach(function (e) { usados[e.uid] = true; if (e.id && !sai[e.uid]) vistos[e.tipo + ':' + e.id] = true; });
      var novas = [];
      novosV2.forEach(function (e2) {
        var r = associa(e2, idx, filtro, c), tipoV3 = r.tipo || 'tecnica';
        if (r.id) {
          // o mesmo card com outro nome (o catálogo renomeou): fica a entrada da v3
          var mesma = f.entradas.filter(function (e) { return sai[e.uid] && e.tipo === tipoV3 && e.id === r.id; })[0];
          if (mesma) { delete sai[mesma.uid]; vistos[tipoV3 + ':' + r.id] = true; return; }
          if (vistos[tipoV3 + ':' + r.id]) { avisos.push({ tipo: 'duplicada', ref: tipoV3 + ':' + r.id, nome: str(e2.nome) }); return; }
          vistos[tipoV3 + ':' + r.id] = true;
        }
        var ent = { uid: novoUid(usados, c), tipo: tipoV3, id: r.id, estado: estadoPadrao(tipoV3),
          cache: { nome: r.entradaCat ? str(r.entradaCat.nome) : str(e2.nome), resumo: str(e2.descricao), versaoCatalogo: idx ? idx.versao : '' },
          mods: r.entradaCat && Array.isArray(r.entradaCat.mods) ? clone(r.entradaCat.mods) : [],
          adicionadoEm: agora,
          // entrou na v2 depois dos totais: os Mods dela contam (não estão na base)
          migradoDe: { id: str(e2.id), tipo: str(e2.tipo), nome: str(e2.nome), efeitoNoTotal: false } };
        if (r.orfao) { ent.orfao = r.orfao; avisos.push({ tipo: 'orfa', ref: str(e2.tipo) + ':' + str(e2.id), motivo: r.orfao.motivo }); }
        novas.push(ent);
      });
      f.entradas = f.entradas.filter(function (e) {
        if (!sai[e.uid]) return true;
        mudou.push('entradas.' + e.uid);
        return false;
      });
      novas.forEach(function (e) { f.entradas.push(e); mudou.push('entradas.' + e.uid); });
      return terminaReimport();
    }

    // ---------------- armazém: várias fichas (D36) ----------------
    // storage = localStorage (ou falso nos testes); sessao = sessionStorage (ativa
    // por aba) ou null. Funções puras sobre o que foi injetado.
    function ehQuota(e) {
      return !!e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22 || e.code === 1014);
    }
    function armazem(ls, ss, opcoes) {
      opcoes = opcoes || {};
      var c = ctx(opcoes);
      var ativaMem = null;
      function ler(k) { try { return ls.getItem(k); } catch (e) { return null; } }
      function lerJSON(k) { var r = ler(k); if (r == null) return null; try { return JSON.parse(r); } catch (e) { return null; } }
      function remove(k) { try { ls.removeItem(k); return true; } catch (e) { return false; } }
      function chaves() {
        var out = [];
        try { for (var i = 0; i < ls.length; i++) { var k = ls.key(i); if (k != null) out.push(k); } } catch (e) {}
        return out;
      }
      function indiceVazio() { return { schema: SCHEMA_INDICE, ultimaAtiva: null, projecaoV2: null, fichas: [] }; }
      function lerIndice() {
        var i = lerJSON(CHAVES.indice);
        if (!obj(i)) return indiceVazio();
        if (!Array.isArray(i.fichas)) i.fichas = [];
        return i;
      }
      // índice de versão futura (outra versão do site gravou): nada é escrito
      function somenteLeitura() { var i = lerJSON(CHAVES.indice); return obj(i) && i.schema !== SCHEMA_INDICE; }
      function ativaDaAba() {
        if (ss) { try { return ss.getItem(CHAVES.ativa); } catch (e) {} }
        return ativaMem;
      }
      function marcaAtiva(id) {
        ativaMem = id;
        if (ss) { try { if (id) ss.setItem(CHAVES.ativa, id); else ss.removeItem(CHAVES.ativa); } catch (e) {} }
      }
      function maisRecente(ind) {
        var l = ind.fichas.slice().sort(function (a, b) { return str(b.atualizadoEm) < str(a.atualizadoEm) ? -1 : (str(b.atualizadoEm) > str(a.atualizadoEm) ? 1 : 0); });
        return l.length ? l[0].id : null;
      }
      function existe(ind, id) { return ind.fichas.some(function (x) { return x.id === id; }); }
      // A ativa desta aba. Se outra aba excluiu a ficha que esta aba marcou,
      // devolve null (não troca em silêncio): a UI lê ativaExcluida() e fica
      // só-leitura com "Baixar ficha" e "Trocar" (plano §3.1).
      function ativa() {
        var ind = lerIndice(), a = ativaDaAba();
        if (a) return existe(ind, a) ? a : null;
        if (ind.ultimaAtiva && existe(ind, ind.ultimaAtiva)) return ind.ultimaAtiva;
        return maisRecente(ind);
      }
      function ativaExcluida() {
        var a = ativaDaAba();
        return a && !existe(lerIndice(), a) ? a : null;
      }
      // Em QuotaExceeded limpa, nesta ordem, os logs de desfazer das fichas
      // inativas, o da ativa e o backup da v1; nunca ficha nem índice.
      function candidatosLimpeza() {
        var a = ativa(), ks = chaves(), out = [];
        ks.forEach(function (k) { if (k.indexOf(CHAVES.log) === 0 && k !== CHAVES.log + a) out.push(k); });
        if (a && ks.indexOf(CHAVES.log + a) >= 0) out.push(CHAVES.log + a);
        if (ks.indexOf(CHAVES.backupV1) >= 0) out.push(CHAVES.backupV1);
        return out;
      }
      // guardados (opcional): o valor de cada chave limpa, para a transação devolver;
      // protegidas (opcional): chaves que a transação acabou de gravar (a limpeza
      // não desfaz o próprio passo, como o backup da v1 que ela guardou)
      function escreve(k, v, limpou, guardados, protegidas) {
        var fila = null;
        for (;;) {
          try { ls.setItem(k, v); return { ok: true }; }
          catch (e) {
            if (!ehQuota(e)) return { ok: false, erro: 'storage' };
            if (fila === null) fila = candidatosLimpeza().filter(function (x) { return !(protegidas && protegidas[x]); });
            if (!fila.length) return { ok: false, erro: 'quota', sugestao: 'exportarTodas' };
            var r = fila.shift();
            if (guardados && !temPropria(guardados, r)) { var g = ler(r); if (g != null) guardados[r] = g; }
            if (remove(r)) limpou.push(r);
          }
        }
      }
      // a linha da ficha no índice (vitrine do seletor)
      function poeLinha(ind, ficha) {
        var linha = { id: ficha.id, nome: ficha.meta.nome, classe: str(ficha.identidade.classe.nome),
          nivel: ficha.meta.nivel, atualizadoEm: ficha.salvoEm || ficha.criadoEm };
        var i = -1;
        ind.fichas.forEach(function (x, j) { if (x.id === ficha.id) i = j; });
        if (i >= 0) ind.fichas[i] = linha; else ind.fichas.push(linha);
      }
      // grava a ficha e a linha dela no índice; se o índice falhar, desfaz a ficha
      function gravaPar(ficha, ind, limpou) {
        var kf = CHAVES.ficha + ficha.id, antes = ler(kf);
        var r1 = escreve(kf, JSON.stringify(ficha), limpou);
        if (!r1.ok) return r1;
        poeLinha(ind, ficha);
        var r2 = escreve(CHAVES.indice, JSON.stringify(ind), limpou);
        if (!r2.ok) {
          if (antes == null) remove(kf); else { try { ls.setItem(kf, antes); } catch (e) {} }
          return r2;
        }
        return { ok: true };
      }
      function recusa(erro, extra) { return Object.assign({ ok: false, erro: erro }, extra || {}); }
      function resultado(r, limpou, extra) { return Object.assign(r, { limpou: limpou }, extra || {}); }

      function lerFicha(id) {
        var f = lerJSON(CHAVES.ficha + id);
        if (!obj(f)) return null;
        return versaoMaior(f.schemaVersion) > 3 ? null : completaV3(f);
      }
      // grava uma ficha (rev++, salvoEm). Recusa por cima de versão futura ou de
      // um rev maior (outra aba gravou depois: relê antes de gravar).
      // Recusa também a ficha que outra aba excluiu (já gravada e fora do
      // índice: nada de ressuscitar) e a migrada ainda sem poda dos ajustes.
      function gravar(ficha) {
        if (somenteLeitura()) return recusa('somente-leitura');
        if (!obj(ficha) || !ficha.id) return recusa('invalida');
        if (podaPendente(ficha)) return recusa('poda-pendente');
        if (!existe(lerIndice(), ficha.id) && (inteiro(ficha.rev, 0) > 0 || str(ficha.salvoEm))) return recusa('excluida');
        var atual = lerJSON(CHAVES.ficha + ficha.id);
        if (obj(atual)) {
          if (versaoMaior(atual.schemaVersion) > 3) return recusa('versao-futura', { versao: str(atual.schemaVersion) });
          if (inteiro(atual.rev, 0) > inteiro(ficha.rev, 0)) return recusa('desatualizada', { rev: inteiro(atual.rev, 0) });
        }
        var nova = clone(ficha);
        nova.rev = inteiro(nova.rev, 0) + 1;
        nova.salvoEm = c.agora();
        var limpou = [], r = gravaPar(nova, lerIndice(), limpou);
        if (r.ok) { ficha.rev = nova.rev; ficha.salvoEm = nova.salvoEm; }
        return resultado(r, limpou, r.ok ? { rev: nova.rev } : null);
      }
      function usados() {
        var u = {};
        lerIndice().fichas.forEach(function (x) { u[x.id] = true; });
        return u;
      }
      function tornaAtiva(id) {
        marcaAtiva(id);
        var ind = lerIndice();
        ind.ultimaAtiva = id;
        var limpou = [];
        return resultado(escreve(CHAVES.indice, JSON.stringify(ind), limpou), limpou);
      }
      // nova ficha no índice, e ela vira a ativa (D36); as outras ficam intactas
      function adiciona(f, sessao) {
        if (podaPendente(f)) return recusa('poda-pendente');
        f.rev = 0; f.salvoEm = c.agora();
        var limpou = [], r = gravaPar(f, lerIndice(), limpou);
        if (!r.ok) return resultado(r, limpou);
        if (sessao != null) escreve(CHAVES.sessao + f.id, JSON.stringify(sessao), limpou);
        tornaAtiva(f.id);
        return resultado({ ok: true, id: f.id }, limpou);
      }
      function criar(dados) {
        if (somenteLeitura()) return recusa('somente-leitura');
        var f = novaFicha(Object.assign({}, dados || {}, { id: novoId(usados(), opcoes) }), opcoes);
        return adiciona(f);
      }
      function trocar(id) {
        if (!existe(lerIndice(), id)) return recusa('inexistente');
        if (somenteLeitura()) { marcaAtiva(id); return { ok: true, limpou: [] }; }
        return tornaAtiva(id);
      }
      // cópia com id novo, "(cópia)" no nome, sem log, sem sessão e sem vínculo com a v2
      function duplicar(id) {
        if (somenteLeitura()) return recusa('somente-leitura');
        var f = lerFicha(id);
        if (!f) return recusa('inexistente');
        f.id = novoId(usados(), opcoes);
        f.meta.nome = (f.meta.nome ? f.meta.nome + ' ' : '') + '(cópia)';
        f.criadoEm = c.agora(); f.exportadoEm = ''; f.vinculoV2 = null;
        return adiciona(f);
      }
      function lerSessao(id) { return lerJSON(CHAVES.sessao + id); }
      function lerLog(id) { return lerJSON(CHAVES.log + id); }
      function gravarSessao(id, s) {
        if (somenteLeitura()) return recusa('somente-leitura');
        var limpou = []; return resultado(escreve(CHAVES.sessao + id, JSON.stringify(s), limpou), limpou);
      }
      function gravarLog(id, l) {
        if (somenteLeitura()) return recusa('somente-leitura');
        var limpou = []; return resultado(escreve(CHAVES.log + id, JSON.stringify(l), limpou), limpou);
      }
      function exportar(id) {
        var f = lerFicha(id);
        return f ? exportarFicha(f, lerSessao(id), opcoes) : null;
      }
      // o texto cru da chave (ficha ilegível ou de versão futura): é o que dá
      // para salvar dela antes de excluir ou de gravar por cima
      function exportarCru(id) {
        var raw = ler(CHAVES.ficha + id);
        return raw == null ? null : { nomeArquivo: 'ficha-' + id + '.cru.khalkaria.json', texto: raw };
      }
      function motivoIlegivel(id) {
        var raw = ler(CHAVES.ficha + id), f = null;
        if (raw == null) return 'ausente';
        try { f = JSON.parse(raw); } catch (e) {}
        return obj(f) && versaoMaior(f.schemaVersion) > 3 ? 'versao-futura' : 'ilegivel';
      }
      // Todas as do índice; as que não viram v3 aqui vão cruas em dados.ilegiveis
      // e voltam em erros:[{id, motivo}] para a UI avisar.
      function exportarTodas() {
        var fichas = [], ileg = [];
        lerIndice().fichas.forEach(function (x) {
          var e = exportar(x.id);
          if (e) { fichas.push(e.dados); return; }
          ileg.push({ id: x.id, nome: str(x.nome), motivo: motivoIlegivel(x.id), texto: ler(CHAVES.ficha + x.id) });
        });
        var p = pacoteTodas(fichas, opcoes, ileg);
        p.erros = ileg.map(function (x) { return { id: x.id, motivo: x.motivo }; });
        return p;
      }
      // Excluir exige o export antes: opcoes.exportar(export) tem de devolver
      // algo diferente de false. Apaga a ficha, o log, a sessão e o rascunho de
      // subida daquele id; a ativa passa à mais recente (ou a nenhuma).
      function excluir(id, op) {
        if (somenteLeitura()) return recusa('somente-leitura');
        var ind = lerIndice();
        if (!existe(ind, id)) return recusa('inexistente');
        if (!op || typeof op.exportar !== 'function') return recusa('sem-export');
        var ex = exportar(id), cru = ex ? null : exportarCru(id), okEx = true;
        // ilegível ou de versão futura: só sai com o export CRU (op.exportarCru);
        // sem a chave (só a linha do índice), não há o que perder
        if (ex) { try { okEx = op.exportar(ex); } catch (e) { okEx = false; } }
        else if (cru) {
          if (typeof op.exportarCru !== 'function') return recusa('ilegivel', { motivo: motivoIlegivel(id), cru: cru });
          try { okEx = op.exportarCru(cru); } catch (e) { okEx = false; }
        }
        if (okEx === false) return recusa('export-falhou');
        ind.fichas = ind.fichas.filter(function (x) { return x.id !== id; });
        var eraAtiva = ativa() === id;
        if (ind.ultimaAtiva === id) ind.ultimaAtiva = maisRecente(ind);
        var nova = eraAtiva ? maisRecente(ind) : ativa();
        if (eraAtiva) ind.ultimaAtiva = nova;
        var limpou = [], r = escreve(CHAVES.indice, JSON.stringify(ind), limpou);
        if (!r.ok) return resultado(r, limpou);
        [CHAVES.ficha, CHAVES.log, CHAVES.sessao, CHAVES.nivelRascunho].forEach(function (p) { remove(p + id); });
        if (eraAtiva) marcaAtiva(nova);
        return resultado({ ok: true, ativa: nova }, limpou);
      }
      // Import: cada ficha entra como NOVA no índice. Id que já existe:
      // op.conflito 'atualizar' (com export dela antes, por op.exportar) ou
      // 'copia' (id novo); sem op.conflito, nada é gravado e os ids voltam.
      function importar(entrada, op) {
        op = op || {};
        if (somenteLeitura()) return recusa('somente-leitura');
        var lido = lerImport(entrada, Object.assign({}, opcoes, { catalogo: op.catalogo || opcoes.catalogo,
          calculado: op.calculado || opcoes.calculado }));
        if (!lido.fichas.length) return recusa((lido.erros[0] && lido.erros[0].erro) || 'vazio', { erros: lido.erros });
        var ind = lerIndice();
        var conflitos = lido.fichas.filter(function (x) { return existe(ind, x.ficha.id); }).map(function (x) { return x.ficha.id; });
        if (conflitos.length && op.conflito !== 'atualizar' && op.conflito !== 'copia') {
          return recusa('conflito', { conflitos: conflitos, erros: lido.erros });
        }
        var ids = [], limpou = [];
        for (var i = 0; i < lido.fichas.length; i++) {
          var x = lido.fichas[i], f = x.ficha, r;
          if (existe(lerIndice(), f.id) && op.conflito === 'atualizar') {
            if (podaPendente(f)) return recusa('poda-pendente', { ids: ids });
            var velha = lerJSON(CHAVES.ficha + f.id);
            // por cima de versão futura, nunca (guarda anti-downgrade)
            if (obj(velha) && versaoMaior(velha.schemaVersion) > 3) return recusa('versao-futura', { ids: ids, versao: str(velha.schemaVersion) });
            var ex = exportar(f.id), okEx;
            if (!ex) return recusa('ilegivel', { ids: ids, cru: exportarCru(f.id) });
            try { okEx = typeof op.exportar === 'function' ? op.exportar(ex) : false; } catch (e) { okEx = false; }
            if (okEx === false) return recusa('export-falhou', { ids: ids });
            f.rev = Math.max(inteiro(f.rev, 0), inteiro(velha && velha.rev, 0)) + 1;
            f.salvoEm = c.agora();
            r = gravaPar(f, lerIndice(), limpou);
            if (r.ok) {
              // o log de desfazer e o rascunho de subida eram da versão substituída;
              // a sessão dela também, se o arquivo não trouxer outra (foi no export)
              remove(CHAVES.log + f.id); remove(CHAVES.nivelRascunho + f.id);
              if (x.sessao != null) escreve(CHAVES.sessao + f.id, JSON.stringify(x.sessao), limpou);
              else remove(CHAVES.sessao + f.id);
              tornaAtiva(f.id);
            }
          } else {
            if (existe(lerIndice(), f.id)) {
              // cópia: id novo e, como no duplicar, sem vínculo com a v2
              f.id = novoId(usados(), opcoes);
              f.vinculoV2 = null; f.exportadoEm = '';
            }
            r = adiciona(f, x.sessao);
          }
          if (!r.ok) return resultado(recusa(r.erro, { ids: ids, sugestao: r.sugestao }), limpou.concat(r.limpou || []));
          ids.push(f.id);
        }
        return resultado({ ok: true, ids: ids, erros: lido.erros, avisos: lido.fichas.map(function (x) { return x.avisos; }) }, limpou);
      }
      // uso da quota: soma das chaves khalkaria_* (chave + valor, 2 bytes por char)
      function uso() {
        var porChave = {}, bytes = 0;
        chaves().forEach(function (k) {
          if (k.indexOf('khalkaria_') !== 0) return;
          var n = (k.length + str(ler(k)).length) * 2;
          porChave[k] = n; bytes += n;
        });
        return { bytes: bytes, limite: LIMITE_QUOTA, fracao: bytes / LIMITE_QUOTA, porChave: porChave };
      }

      // ---- escrita dupla (F4.2; ligada só na F4.7) ----
      // Grava os passos [[chave, valor]] em ordem. Se um falhar (quota,
      // exceção), devolve cada chave já escrita ao valor de antes, e os logs
      // que a limpeza de quota tirou, e responde {ok:false, erro}. A limpeza de
      // quota nunca tira uma chave que esta transação já gravou.
      function transacao(passos) {
        var antes = [], limpou = [], guardados = {}, gravadas = {};
        for (var i = 0; i < passos.length; i++) {
          var k = passos[i][0], velho;
          try { velho = ls.getItem(k); } catch (e) { return { ok: false, erro: 'storage', limpou: desfaz(antes, guardados) }; }
          var r = escreve(k, passos[i][1], limpou, guardados, gravadas);
          // o setItem que falhou não mudou a chave: volta só o que foi escrito
          if (!r.ok) return Object.assign(r, { limpou: desfaz(antes, guardados) });
          antes.push([k, velho]);
          gravadas[k] = true;
        }
        return { ok: true, limpou: limpou };
      }
      // devolve as chaves que NÃO voltaram (o storage recusou de novo)
      function desfaz(antes, guardados) {
        var falhou = [];
        antes.slice().reverse().forEach(function (x) {
          try { if (x[1] == null) ls.removeItem(x[0]); else ls.setItem(x[0], x[1]); } catch (e) { falhou.push(x[0]); }
        });
        Object.keys(guardados).forEach(function (k) { try { ls.setItem(k, guardados[k]); } catch (e) { falhou.push(k); } });
        return falhou;
      }
      function lerV2Cru() {
        var cru;
        try { cru = ls.getItem(CHAVES.v2); } catch (e) { return { erro: 'storage' }; }
        if (cru == null) return { v2: null, cru: null };
        var v2 = null;
        try { v2 = JSON.parse(cru); } catch (e) { v2 = null; }
        return obj(v2) ? { v2: v2, cru: cru } : { erro: 'v2-ilegivel' };
      }
      // khalkaria_ficha que a projeção reescreve mudando a forma (v1, ou 2.0 com
      // as listas velhas): como a v2.1 (guardaBackup, spec §5.6.1), o texto cru
      // vai antes para o backup, que nunca é sobrescrito
      function precisaBackup(v2) {
        return obj(v2) && (v2.schemaVersion !== '2.0' || temListasVelhas(v2)) && ler(CHAVES.backupV1) == null;
      }
      // Grava a ficha (rev++, salvoEm), o índice (linha + projecaoV2), o backup
      // da v1 (se a v2 for uma v1), a projeção em khalkaria_ficha (rev =
      // max(rev da v2, projecaoV2.revV2) + 1, para a aba v2.1 aberta adotar, com
      // o carimbo origemV3) e por ÚLTIMO o marcador 'v3-dupla' ('v3' fica como
      // está: a F5 desligou a escrita dupla). Recusa sem gravar nada:
      // 'conflito-v2' (uma aba v2.1 gravou depois da última projeção e a ficha
      // não absorveu essa versão: a UI oferece reimportar na ficha de
      // projecaoV2.fichaId) e 'v2-nao-migrada' (há v2 e nenhuma projeção: migrar
      // antes). esperado (só o migrarReal): {cru, projecao} que ele leu; se a v2
      // ou a projecaoV2 mudaram no meio (outra aba migrou), 'mudou-durante'.
      function gravarComProjecao(ficha, op) { return gravaProjetando(ficha, op, null); }
      function gravaProjetando(ficha, op, esperado) {
        op = op || {};
        if (somenteLeitura()) return recusa('somente-leitura');
        if (!obj(ficha) || !ficha.id) return recusa('invalida');
        if (podaPendente(ficha)) return recusa('poda-pendente');
        var ind = lerIndice();
        if (!existe(ind, ficha.id) && (inteiro(ficha.rev, 0) > 0 || str(ficha.salvoEm))) return recusa('excluida');
        var atual = lerJSON(CHAVES.ficha + ficha.id);
        if (obj(atual)) {
          if (versaoMaior(atual.schemaVersion) > 3) return recusa('versao-futura', { versao: str(atual.schemaVersion) });
          if (inteiro(atual.rev, 0) > inteiro(ficha.rev, 0)) return recusa('desatualizada', { rev: inteiro(atual.rev, 0) });
        }
        var lido = lerV2Cru();
        if (lido.erro) return recusa(lido.erro);
        var v2 = lido.v2, proj = obj(ind.projecaoV2) ? ind.projecaoV2 : null;
        if (esperado && (lido.cru !== esperado.cru || canon(proj) !== esperado.projecao)) return recusa('mudou-durante');
        // a ficha que o migrarReal acabou de tirar desta v2 é dela (mesmo com o vínculo vazio da v1)
        if (v2 && !esperado && !absorvida(ficha, v2)) {
          if (proj && conflitoV2(ind, v2)) return recusa('conflito-v2', { fichaId: str(proj.fichaId), revV2: inteiro(v2.rev, 0) });
          if (!proj) return recusa('v2-nao-migrada');
        }
        var agora = c.agora();
        var nova = clone(ficha);
        nova.rev = inteiro(nova.rev, 0) + 1;
        nova.salvoEm = agora;
        var pr = projetarV2(nova, v2, { agora: function () { return agora; }, daFicha: esperado ? true : undefined });
        var p2 = pr.v2;
        p2.rev = Math.max(v2 ? inteiro(v2.rev, 0) : 0, proj ? inteiro(proj.revV2, 0) : 0) + 1;
        p2.salvoEm = agora;
        // carimbo: de qual projeção esta v2 descende (a v2.1 o preserva ao gravar por cima)
        p2.origemV3 = { fichaId: nova.id, revV2: p2.rev };
        ind.projecaoV2 = { fichaId: nova.id, revV2: p2.rev, salvoEmV2: p2.salvoEm };
        poeLinha(ind, nova);
        if (op.ativar) ind.ultimaAtiva = nova.id;
        var passos = [[CHAVES.ficha + nova.id, JSON.stringify(nova)], [CHAVES.indice, JSON.stringify(ind)]];
        if (precisaBackup(v2)) passos.push([CHAVES.backupV1, lido.cru]);
        passos.push([CHAVES.v2, JSON.stringify(p2)]);
        var dono = ler(CHAVES.dono);
        if (dono !== 'v3-dupla' && dono !== 'v3') passos.push([CHAVES.dono, 'v3-dupla']);
        var r = transacao(passos);
        if (!r.ok) return r;
        if (op.ativar) marcaAtiva(nova.id);
        ficha.rev = nova.rev; ficha.salvoEm = nova.salvoEm;
        return { ok: true, id: nova.id, rev: nova.rev, revV2: p2.rev, perdas: pr.perdas, limpou: r.limpou };
      }
      // a ficha do índice que já tem esta versão da v2 (vinculoV2 igual)
      function fichaDaV2(ind, v2) {
        var achada = null;
        ind.fichas.some(function (x) { var f = lerFicha(x.id); if (f && absorvida(f, v2)) achada = f; return !!achada; });
        return achada;
      }
      // Migração real, IDEMPOTENTE: a v2 vira UMA ficha nova do índice (id novo,
      // ativa, com vinculoV2) gravada com a projeção. Se o índice já tem a ficha
      // dela (projecaoV2 igual à v2, ou vinculoV2 igual), não cria outra. Duas
      // abas ao mesmo tempo: a gravação confere se a v2 e a projecaoV2 ainda
      // são as que esta leu; se outra aba migrou no meio, relê e decide de novo
      // (e acha a ficha que a outra criou). A v1 crua vai para o backup.
      // op: catalogo, calculado (sem ele a poda fica pendente e nada é gravado).
      function migrarReal(op) {
        var o = Object.assign({}, opcoes, op || {});
        if (somenteLeitura()) return recusa('somente-leitura');
        for (var i = 0; i < 3; i++) {
          var r = migrarUmaVez(o);
          if (r.erro !== 'mudou-durante') return r;
        }
        return recusa('mudou-durante');
      }
      function migrarUmaVez(o) {
        var lido = lerV2Cru();
        if (lido.erro) return recusa(lido.erro);
        var v2 = lido.v2;
        if (!v2) return { ok: true, id: null, criada: false, motivo: 'sem-v2', limpou: [] };
        if (versaoMaior(v2.schemaVersion) >= 3) return recusa('v2-ilegivel');
        var ind = lerIndice(), proj = obj(ind.projecaoV2) ? ind.projecaoV2 : null;
        var esperado = { cru: lido.cru, projecao: canon(proj) };
        var dela = proj && existe(ind, proj.fichaId);
        if (dela && !conflitoV2(ind, v2)) return { ok: true, id: proj.fichaId, criada: false, limpou: [] };
        var ja = fichaDaV2(ind, v2);
        if (ja) {
          // já migrada (ou reimportada), sem a projeção desta versão: só liga a escrita dupla
          var rj = gravaProjetando(ja, {}, esperado);
          return rj.ok ? Object.assign(rj, { criada: false }) : rj;
        }
        if (dela) return recusa('conflito-v2', { fichaId: proj.fichaId, revV2: inteiro(v2.rev, 0) });
        // a projeção de uma ficha que foi excluída (com export antes): nada novo nela
        if (proj && !conflitoV2(ind, v2)) return { ok: true, id: null, criada: false, motivo: 'projecao-de-ficha-excluida', limpou: [] };
        var mig = migrar(v2, Object.assign({}, o, { id: novoId(usados(), o) }));
        if (mig.erro) return recusa(mig.erro === 'versao-futura' ? 'v2-ilegivel' : mig.erro);
        var f = mig.ficha;
        if (o.catalogo) { reassociar(f, o.catalogo); reconciliar(f, o.catalogo); }
        if (podaPendente(f) && o.calculado) podarAjustesMigrados(f, o.calculado);
        if (podaPendente(f)) return recusa('poda-pendente');
        var r = gravaProjetando(f, { ativar: true }, esperado);
        return r.ok ? Object.assign(r, { criada: true, avisos: mig.avisos || [], pendencias: f.migracao ? f.migracao.pendencias : [] }) : r;
      }
      return {
        listar: function () { return clone(lerIndice().fichas); },
        indice: function () { return clone(lerIndice()); },
        ativa: ativa, ativaExcluida: ativaExcluida, ler: lerFicha, gravar: gravar, criar: criar, trocar: trocar,
        duplicar: duplicar, excluir: excluir, exportar: exportar, exportarCru: exportarCru, exportarTodas: exportarTodas,
        importar: importar, uso: uso, lerSessao: lerSessao, gravarSessao: gravarSessao,
        lerLog: lerLog, gravarLog: gravarLog, somenteLeitura: somenteLeitura,
        gravarComProjecao: gravarComProjecao, migrarReal: migrarReal
      };
    }
    // As mesmas do armazém, sobre o storage (ou um armazém já criado). F4.2:
    // nada do navegador as chama até a virada (F4.7).
    function gravarComProjecao(alvo, fichaId, fichaV3, op) {
      op = op || {};
      if (!obj(fichaV3) || !fichaId || fichaV3.id !== fichaId) return { ok: false, erro: 'invalida' };
      var arm = alvo && typeof alvo.gravarComProjecao === 'function' ? alvo : armazem(alvo, op.sessao || null, op);
      return arm.gravarComProjecao(fichaV3, op);
    }
    function migrarReal(ls, op) {
      op = op || {};
      return armazem(ls, op.sessao || null, op).migrarReal(op);
    }

    return {
      SCHEMA_VERSION: SCHEMA_VERSION, SCHEMA_INDICE: SCHEMA_INDICE, CHAVES: CHAVES, LIMITE_QUOTA: LIMITE_QUOTA,
      ATRIBUTOS: ATRIBUTOS.slice(), PERICIAS: PERICIAS.slice(), PERICIAS_MAIOR: clone(PERICIAS_MAIOR),
      TIPOS_DANO: TIPOS_DANO.slice(), CATEGORIAS_AE: CATEGORIAS_AE.slice(), TIPOS_ENTRADA: TIPOS_ENTRADA.slice(),
      FINS_TEMPORARIO: FINS_TEMPORARIO.slice(), EVENTOS_DURACAO: EVENTOS_DURACAO.slice(),
      PADRAO_AJUSTE: PADRAO_AJUSTE, ehCaminhoDeAjuste: ehCaminhoDeAjuste, validarAjuste: validarAjuste,
      ajustar: ajustar, desajustar: desajustar, podarAjustesMigrados: podarAjustesMigrados,
      CAMINHOS_DADO: CAMINHOS_DADO.slice(), modsAplicaveis: modsAplicaveis, entradasDeCatalogo: entradasDeCatalogo,
      novaFicha: novaFicha, novoId: novoId, versaoMaior: versaoMaior, normaliza: normaliza,
      estadoPadrao: estadoPadrao,
      migrarV1paraV2: migrarV1paraV2, migrarV2paraV3: migrarV2paraV3, migrar: migrar,
      indiceCatalogo: indiceCatalogo, reassociar: reassociar, reconciliar: reconciliar,
      exportarFicha: exportarFicha, pacoteTodas: pacoteTodas, lerImport: lerImport,
      sombra: sombra, armazem: armazem,
      // F4.2 (escrita dupla e migração real): puras, ligadas só na F4.7
      projetarV2: projetarV2, conflitoV2: conflitoV2, reimportarV2: reimportarV2,
      gravarComProjecao: gravarComProjecao, migrarReal: migrarReal
    };
  })();

  // No artefato carregado pelo require, o module.exports é o KhInv: não sobrescreve.
  if (emNode) {
    if (typeof module.exports.migrarV1 !== 'function') module.exports = KhEstado;
    return;
  }
  raiz.KhEstado = KhEstado;
})(typeof window !== 'undefined' ? window : this);
