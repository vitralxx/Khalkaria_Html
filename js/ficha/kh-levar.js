/* Khalkaria — Ficha · KhLevar: levar um card para a ficha do Ensaio e o export do Bestiário (F4.6c), SÓ COM O ENSAIO.
 * Especificação: docs/ficha-digital/07-f4-6-ensaio.md §4 (base: plano 02 §3.2 e §F4).
 *
 * Com o Ensaio ligado (KhEnsaio.ligado: a prévia E a marca da aba):
 *   - os controles que o build deixou inertes em todo card de entidade (os
 *     dois primeiros filhos: button.ent-add[hidden] e span.ent-alca[hidden],
 *     tools/kf_marca.py e o kfControles do js/bazar.js) aparecem: o JS tira o
 *     hidden e põe o ícone; o HTML gerado não muda (o portão [ids] segue igual).
 *     Ao sair do Ensaio (o evento kh:ensaio, também no pageshow do bfcache),
 *     tudo volta como o build deixou: hidden, vazio, o aria-label original;
 *   - o clique no .ent-add, a tecla A no card focado (KhTeclas, nunca num
 *     campo de texto) e o arrasto pela alça levam o card para a ficha ATIVA
 *     do ensaio. O arrasto carrega o MIME application/x-khalkaria-ref =
 *     {v:1, tipo, id} e o text/plain só com o nome; quem solta é o drawer da
 *     ficha nova (js/ficha/kh-ficha-drawer.js), que chama o levar daqui;
 *   - o card que já está na ficha ganha [data-ke-na-ficha], o botão diz
 *     "Na ficha" e o aria-label o diz também (o leitor de tela ouve).
 *
 * Destinos (levar, PURO): técnica, marca, ultimate, traço, tecnologia e
 * corrupção vão para as entradas (aba Técnicas); magia, para o Grimório;
 * carta, Dor e benefício do Abismo, para as Cartas (carta rara SEM o efeito:
 * o catálogo não o tem, e o card nunca é lido); item do Bazar, para o
 * inventário (KhInv.mesclar, o modelo da ficha v3; o id antigo de
 * data/bazar-renomeados.json resolve para o atual); raça, classe, origem,
 * variante e subespécie, para a identidade (KhEdicao.mudancas, as mesmas
 * regras da edição), com a lista do que falta escolher (avisa, não bloqueia);
 * condição, para as condições ativas. Entrada repetida (tipo:id) avisa e não
 * duplica (item: a mesma linha ganha +1, como no Bazar). Id que sumiu do
 * catálogo entra órfão (com o nome do card) e nunca é apagado.
 * Cada levar é UM passo do armazém do ensaio (armazem.editar: Desfazer).
 *
 * Export do Bestiário da ficha v3 (bestiario, PURO; exportarBestiario e o
 * botão do criarExport): antes, o catálogo inteiro (garantir: data/catalogo,
 * classes, raças, efeitos e data/bazar.json); se um arquivo falhar, aborta com
 * o aviso e NÃO baixa nada. O mapeamento é o do exportBestiario da v2.1
 * (CLAUDE.md §5): type 'npc', atributos strength…, prof_* em GRAU 0–4,
 * health_max/stamina_max/ether_max, evasion/movement/armor, resistances,
 * immunities e armor_specific em texto, abilities[] (técnicas e magias) e
 * weapons[] (KhInv.armasBestiario), com os valores do motor (ajustes dentro).
 *
 * Escritas: SÓ pelo armazém do ensaio (sessionStorage, prefixo
 * khalkaria_ensaio:). Nenhuma chave da ficha do jogador, nunca. Sem o Ensaio,
 * nada aparece e nada muda (o '+ ficha' da v2.1 segue como hoje).
 *
 * Partes puras (testadas no node, tools/testes/levar.test.js): refDoCard,
 * lerRef, payloadRef, refDoV2, levar, chaves, faltaEscolher, bestiario e
 * garantir. No node exporta por module.exports (carregado sozinho); no
 * artefato js/ficha.js o export já é o KhInv e este módulo só registra
 * window.KhLevar no navegador. Vem no ORDEM depois do kh-editor.js e antes do
 * kh-ficha-drawer.js (que o liga: ligar e criarExport; a página da ficha usa
 * o criarExport).
 * Fonte: js/ficha/kh-levar.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhInv = emNode ? require('./kh-inv.js') : raiz.KhInv;
  var KhEstado = emNode ? require('./kh-estado.js') : raiz.KhEstado;
  var KhPrevia = emNode ? require('./kh-previa.js') : raiz.KhPrevia;
  var KhEnsaio = emNode ? require('./kh-ensaio.js') : raiz.KhEnsaio;
  var KhEdicao = emNode ? require('./kh-edicao.js') : raiz.KhEdicao;
  var KhSeletor = emNode ? require('./kh-seletor.js') : raiz.KhSeletor;
  var KhFichaAbas = emNode ? require('./kh-ficha-abas.js') : raiz.KhFichaAbas;
  var KhEditor = emNode ? require('./kh-editor.js') : raiz.KhEditor;

  var KhLevar = (function () {
    var MIME = 'application/x-khalkaria-ref';
    var VERSAO_REF = 1;
    var PREFIXO_ROTULO = 'Levar para a ficha: ';
    var MARCA = 'data-ke-levar';          // no .ent-add que este módulo mostrou
    var ROTULO = 'data-ke-rotulo';        // o aria-label do build, guardado para a volta
    var NA_FICHA = 'data-ke-na-ficha';    // no card que já está na ficha do ensaio
    var ID_TOAST = 'ke-levar-toast';
    var MOSTRA = 6000;                    // ms do recado
    var ESPERA_MUTACAO = 120;             // ms: junta o redesenho do Bazar (filtros)
    var FORA = 'O ensaio não está ligado nesta aba: nada foi levado.';
    var SEM_FICHA = 'O ensaio está sem ficha aberta: crie ou importe uma no seletor de fichas.';

    // o destino de cada tipo (a convenção do plano §3.2, tools/kf_marca.py)
    var DESTINO = {
      tecnica: 'tecnicas', marca: 'tecnicas', ultimate: 'tecnicas', traco: 'tecnicas', tecnologia: 'tecnicas', corrupcao: 'tecnicas',
      magia: 'grimorio', carta: 'cartas', dor: 'cartas', beneficio: 'cartas',
      item: 'inventario',
      raca: 'identidade', classe: 'identidade', origem: 'identidade', variante: 'identidade', subespecie: 'identidade',
      condicao: 'condicoes'
    };
    // a aba da ficha onde cada destino aparece (KhFichaAbas.ABAS)
    var ABA = { tecnicas: 'tecnicas', grimorio: 'grimorio', cartas: 'cartas', inventario: 'bazar', identidade: 'nucleo', condicoes: 'nucleo' };
    var NOME_DESTINO = { tecnicas: 'as Técnicas', grimorio: 'o Grimório', cartas: 'as Cartas', inventario: 'o inventário', condicoes: 'as condições ativas' };
    var ARTIGO = { tecnica: 'a técnica', marca: 'a Marca', ultimate: 'a ultimate', traco: 'o traço', tecnologia: 'a tecnologia',
      corrupcao: 'a corrupção', magia: 'a magia', carta: 'a carta', dor: 'a Dor', beneficio: 'o benefício', item: 'o item',
      raca: 'a raça', classe: 'a classe', origem: 'a origem', variante: 'a variante', subespecie: 'a subespécie', condicao: 'a condição' };
    var NOME_IDENT = { raca: 'Raça', classe: 'Classe', origem: 'Origem', variante: 'Variante', subespecie: 'Subespécie' };
    // o tipo do arrasto da v2.1 (o text/plain do card que o build não marcou,
    // como as linhas da tabela de corrupção) -> os tipos v3 (o TIPOS_V2 do KhEstado)
    var TIPOS_V2 = { magia: ['magia'], tecnica: ['tecnica', 'tecnologia'], ultimate: ['ultimate'], marca: ['marca'],
      'traço': ['traco'], traco: ['traco'], variante: ['variante'], 'subespécie': ['subespecie'], subespecie: ['subespecie'],
      origem: ['origem'], carta: ['carta'], dor: ['dor'], abismo: ['beneficio'], 'corrupção': ['corrupcao'],
      corrupcao: ['corrupcao'], adversidade: ['corrupcao'] };
    // Bestiário (o exportBestiario da v2.1, ficha-v2.js; CLAUDE.md §5)
    var ATRIB_BEST = [['FOR', 'strength'], ['DES', 'dexterity'], ['CON', 'constitution'], ['INT', 'intelligence'], ['SAB', 'wisdom']];
    var PROF = [['atacar', 'prof_attack'], ['defender', 'prof_defend'], ['movimento', 'prof_movement'], ['fortitude', 'prof_fortitude'],
      ['vontade', 'prof_will'], ['reflexos', 'prof_reflexes'], ['percepcao', 'prof_perception'], ['sobrevivencia', 'prof_survival'],
      ['furtividade', 'prof_stealth'], ['crime', 'prof_crime'], ['iniciativa', 'prof_initiative'], ['conhecimento', 'prof_knowledge'],
      ['medicina', 'prof_medicine'], ['investigacao', 'prof_investigation'], ['religiao', 'prof_religion'], ['mistico', 'prof_mystic'],
      ['convencimento', 'prof_persuasion'], ['intimidacao', 'prof_intimidation'], ['intuicao', 'prof_insight'],
      ['enganacao', 'prof_deception'], ['motivar', 'prof_motivate']];
    // a v2.1 manda UM prof_craft (CLAUDE.md §5: NPC não fabrica); a v3 guarda três Ofícios: vai o maior
    var OFICIOS = ['oficio-engenharia', 'oficio-ferraria', 'oficio-alquimia'];
    var DANO = [['cortante', 'Cortante'], ['contundente', 'Contundente'], ['perfurante', 'Perfurante'], ['fogo', 'Fogo'],
      ['frio', 'Frio'], ['eletrico', 'Elétrico'], ['veneno', 'Veneno'], ['acido', 'Ácido'], ['psiquico', 'Psíquico'],
      ['radiante', 'Radiante'], ['trovejante', 'Trovejante'], ['necrotico', 'Necrótico'], ['forca', 'Força'], ['primordial', 'Primordial']];
    var CATEGORIAS = [['ordinario', 'Ordinário'], ['elemental', 'Elemental'], ['biologico', 'Biológico'], ['mistico', 'Místico'], ['todos', 'Todos']];
    // o que vira ability (a v2.1: técnicas + grimório; cartas, raça e classe ficam só na ficha)
    var HABILIDADES = ['tecnica', 'marca', 'ultimate', 'traco', 'variante', 'subespecie', 'tecnologia', 'corrupcao', 'origem', 'magia'];

    // ícones (traço em currentColor, sem emoji)
    function svg(cls, d) {
      return '<svg class="' + cls + '" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="' + d +
        '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    var SVG_MAIS = svg('ke-ent-ic', 'M8 3.5v9M3.5 8h9');
    var SVG_FEITO = svg('ke-ent-ic', 'M3.5 8.5l3 3 6-7');
    var SVG_ALCA = '<svg class="ke-ent-ic" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6 3.5h.01M10 3.5h.01M6 8h.01M10 8h.01M6 12.5h.01M10 12.5h.01" ' +
      'fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function clone(x) { return x === undefined ? undefined : JSON.parse(JSON.stringify(x)); }
    function arr(x) { return Array.prototype.slice.call(x || []); }
    function esc(s) {
      return str(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
    function semEmoji(s) {
      return str(s).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '').replace(/\s{2,}/g, ' ').trim();
    }
    function norm(s) { return KhEstado.normaliza(semEmoji(s)); }
    function temPropria(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
    function pega(mapa, k) { return k && temPropria(mapa, k) ? mapa[k] : null; }
    function storage(win, nome) { try { return win ? win[nome] || null : null; } catch (e) { return null; } }
    function maiuscula(s) { s = str(s); return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
    function textoErro(r) {
      if (KhEditor && KhEditor.textoErro) return KhEditor.textoErro(r);
      return KhSeletor && KhSeletor.textoErro ? KhSeletor.textoErro(r) : 'Não deu certo: nada foi gravado.';
    }

    // ---------------- a referência ----------------
    // os controles do build: os primeiros filhos do card (não os de um card
    // dentro dele); na tabela do Bazar, dentro da célula do nome (.c-nome-in)
    function controle(card, cls) {
      var fs = card && card.children ? arr(card.children) : [];
      for (var i = 0; i < fs.length && i < 3; i++) if (fs[i].classList && fs[i].classList.contains(cls)) return fs[i];
      var ds = card && card.querySelectorAll ? arr(card.querySelectorAll('.' + cls)) : [];
      for (var j = 0; j < ds.length; j++) if (ds[j].closest('[data-kf-tipo][data-kf-id]') === card) return ds[j];
      return null;
    }
    // o nome do card: o do rótulo do build ("Levar para a ficha: <nome>", sem emoji)
    function nomeDoCard(card) {
      var b = controle(card, 'ent-add');
      var r = b ? str(b.getAttribute(ROTULO) != null ? b.getAttribute(ROTULO) : b.getAttribute('aria-label')) : '';
      if (r.indexOf(PREFIXO_ROTULO) === 0) r = r.slice(PREFIXO_ROTULO.length);
      return semEmoji(r) || semEmoji(card && card.getAttribute ? card.getAttribute('data-n') : '');
    }
    // o card marcado pelo build em volta de x -> {tipo, id, nome} | null
    function refDoCard(x) {
      var c = x && x.closest ? x.closest('[data-kf-tipo][data-kf-id]') : null;
      if (!c) return null;
      var tipo = str(c.getAttribute('data-kf-tipo')), id = str(c.getAttribute('data-kf-id'));
      return tipo && id ? { tipo: tipo, id: id, nome: nomeDoCard(c) } : null;
    }
    // o MIME do arrasto
    function payloadRef(ref) { return JSON.stringify({ v: VERSAO_REF, tipo: str(ref && ref.tipo), id: str(ref && ref.id) }); }
    function lerRef(txt) {
      var p = null;
      try { p = JSON.parse(str(txt)); } catch (e) { return null; }
      if (!obj(p) || p.v !== VERSAO_REF || typeof p.tipo !== 'string' || typeof p.id !== 'string' || !p.tipo || !p.id) return null;
      return { tipo: p.tipo, id: p.id };
    }
    // o text/plain da v2.1 (o card decorado por ela, o item do Bazar) -> ref | null.
    // ctx: o KhFichaAbas.contexto (resolve pelo nome, como a migração: só se for único)
    function refDoV2(p, ctx) {
      if (typeof p === 'string') { try { p = JSON.parse(p); } catch (e) { return null; } }
      if (!obj(p)) return null;
      if (p._bazar && obj(p.item) && (p.item.id || p.item.nome)) {
        return { tipo: 'item', id: str(p.item.id), nome: semEmoji(p.item.nome), item: clone(p.item) };
      }
      var tipos = TIPOS_V2[str(p.tipo)] || TIPOS_V2[norm(p.tipo)];
      if (!tipos || !obj(ctx) || !obj(ctx.porNome)) return null;
      var nome = str(p.nome).replace(/\s*\([+\-−]?\d+\)\s*$/, '');   // a v2 grava a corrupção com o custo
      var cands = [];
      tipos.forEach(function (t) { lista(ctx.porNome[t + '|' + norm(nome)]).forEach(function (e) { cands.push(e); }); });
      if (cands.length !== 1) return null;
      return { tipo: str(cands[0].tipo), id: str(cands[0].id), nome: semEmoji(cands[0].nome) };
    }

    // ---------------- o que está na ficha ----------------
    // as chaves 'tipo:id' que a ficha já tem (entradas, identidade, condições e
    // itens; o id antigo do item também vale pelo atual, com o índice do Bazar)
    function chaves(ficha, bazar) {
      var s = {};
      if (!obj(ficha)) return s;
      lista(ficha.entradas).forEach(function (e) { if (obj(e) && e.id) s[e.tipo + ':' + e.id] = true; });
      var idt = obj(ficha.identidade) ? ficha.identidade : {};
      Object.keys(NOME_IDENT).forEach(function (k) { if (obj(idt[k]) && idt[k].id) s[k + ':' + idt[k].id] = true; });
      lista(ficha.condicoes).forEach(function (c) { if (obj(c) && c.id) s['condicao:' + c.id] = true; });
      var inv = obj(ficha.inventario) ? ficha.inventario : {};
      KhInv.COLUNAS.forEach(function (col) {
        lista(inv[col]).forEach(function (e) {
          if (!obj(e) || e.avulso || !e.id) return;
          s['item:' + e.id] = true;
          var it = bazar ? pega(bazar.porId, e.id) : null;
          if (it && it.id) s['item:' + it.id] = true;
        });
      });
      return s;
    }

    // ---------------- a identidade: o que falta escolher ----------------
    function chaveDe(id, pre) { id = str(id); return id.indexOf(pre) === 0 ? id.slice(pre.length) : ''; }
    function refIdent(ficha, k) { var i = obj(ficha) && obj(ficha.identidade) ? ficha.identidade : {}; return obj(i[k]) ? i[k] : { id: null, nome: '' }; }
    function vazio(r) { return !r.id && !str(r.nome).trim(); }
    function ou(nomes) {
      if (nomes.length < 2) return nomes.join('');
      return nomes.slice(0, -1).join(', ') + ' ou ' + nomes[nomes.length - 1];
    }
    function e2(itens) {
      if (itens.length < 2) return itens.join('');
      return itens.slice(0, -1).join(', ') + ' e ' + itens[itens.length - 1];
    }
    function doTipoDaRaca(ctx, tipo, raca) {
      var out = [];
      Object.keys(obj(ctx) && obj(ctx.porId) ? ctx.porId : {}).forEach(function (k) {
        var e = ctx.porId[k];
        if (k.indexOf(tipo + ':') === 0 && str(e.raca) === raca) out.push(semEmoji(e.nome));
      });
      return out;
    }
    // a lista do que a identidade ainda não tem (pelo catálogo: as variantes ou
    // subespécies da raça, os ramos da classe). Avisa, não bloqueia.
    function faltaEscolher(ficha, ctx) {
      var out = [];
      var raca = refIdent(ficha, 'raca'), classe = refIdent(ficha, 'classe');
      if (vazio(raca)) out.push('a raça');
      else {
        var r = chaveDe(raca.id, 'raca-');
        var vs = r ? doTipoDaRaca(ctx, 'variante', r) : [], ss = r ? doTipoDaRaca(ctx, 'subespecie', r) : [];
        if (vs.length && vazio(refIdent(ficha, 'variante'))) out.push('a variante (' + ou(vs) + ')');
        if (ss.length && vazio(refIdent(ficha, 'subespecie'))) out.push('a subespécie (' + ou(ss) + ')');
      }
      if (vazio(classe)) out.push('a classe');
      else {
        var c = chaveDe(classe.id, 'classe-');
        var ramos = obj(ctx) && obj(ctx.ramos) ? Object.keys(ctx.ramos).filter(function (id) { return !!c && ctx.ramos[id].classe === c; }) : [];
        if (ramos.length && vazio(refIdent(ficha, 'ramo'))) {
          out.push('o ramo (' + ou(ramos.map(function (id) { return semEmoji(ctx.ramos[id].nome).replace(/^Ramo d[oa]s?\s+/, ''); })) + ')');
        }
      }
      if (vazio(refIdent(ficha, 'origem'))) out.push('a origem');
      return out;
    }

    // ---------------- levar (PURO) ----------------
    function agoraDe(op) { return typeof op.agora === 'function' ? str(op.agora()) : str(op.agora) || new Date().toISOString(); }
    function uidNovo(ficha, op) {
      var usados = {};
      lista(ficha.entradas).concat(lista(ficha.condicoes)).forEach(function (x) { if (obj(x) && x.uid) usados[x.uid] = true; });
      var rnd = typeof op.aleatorio === 'function' ? op.aleatorio : Math.random, u;
      do {
        u = 'u';
        while (u.length < 11) u += Math.floor(rnd() * 36).toString(36);
      } while (usados[u]);
      return u;
    }
    // o arquivo de catálogo do tipo falhou ao carregar? (cat.erros: os do KhPrevia.carregar)
    function semCatalogoDo(cat, tipo) {
      if (!obj(cat) || !obj(cat.ctx)) return true;
      return lista(cat.erros).some(function (c) { return str(c).indexOf('/' + tipo + '.json') >= 0; });
    }
    function nomeDe(ent, ref) { return semEmoji(ent ? ent.nome : '') || semEmoji(ref.nome) || str(ref.id); }
    function resultado(ref, destino, nome, mudancas, rotulo, aviso, extra) {
      return Object.assign({ ok: true, mudou: true, tipo: ref.tipo, id: ref.id, nome: nome, destino: destino, aba: ABA[destino],
        mudancas: mudancas, rotulo: rotulo, aviso: aviso }, extra || {});
    }
    function repetida(ref, destino, nome, aviso) {
      return { ok: true, mudou: false, repetida: true, tipo: ref.tipo, id: ref.id, nome: nome, destino: destino, aba: ABA[destino],
        mudancas: [], aviso: aviso };
    }

    // ficha: a ficha ativa do ensaio (lida, não muda); ref: {tipo, id, nome?, item?}
    // cat: {ctx (KhFichaAbas.contexto), bazar (KhInv.indexar), versao, erros}
    // op: {agora, aleatorio}
    // -> {ok, mudou, mudancas:[{caminho, valor}], rotulo, aviso, destino, aba, nome, repetida?, orfa?}
    //  | {ok:false, erro (o texto)}
    function levar(ficha, ref, cat, op) {
      op = obj(op) ? op : {};
      cat = obj(cat) ? cat : {};
      if (!obj(ficha)) return { ok: false, erro: SEM_FICHA };
      if (!obj(ref) || !ref.tipo) return { ok: false, erro: 'Não deu para saber que card é este: nada foi levado.' };
      var destino = DESTINO[ref.tipo];
      if (!destino) return { ok: false, erro: 'Este card não vai para a ficha (' + str(ref.tipo) + ').' };
      if (destino === 'inventario') return levarItem(ficha, ref, cat, op);
      if (!ref.id) return { ok: false, erro: 'O card não tem id: nada foi levado.' };
      if (destino === 'identidade') return levarIdentidade(ficha, ref, cat);
      var ctx = obj(cat.ctx) ? cat.ctx : null;
      var ent = ctx ? pega(ctx.porId, ref.tipo + ':' + ref.id) : null;
      var nome = nomeDe(ent, ref);
      var agora = agoraDe(op), versao = str(cat.versao);
      if (destino === 'condicoes') {
        if (lista(ficha.condicoes).some(function (c) { return obj(c) && c.id === ref.id; })) {
          return repetida(ref, destino, nome, nome + ' já está nas condições ativas da ficha do ensaio: nada mudou.');
        }
        var cond = { uid: uidNovo(ficha, op), id: ref.id, x: null, duracao: null,
          cache: { nome: ent ? str(ent.nome) : semEmoji(ref.nome) || ref.id, versaoCatalogo: versao }, desde: agora };
        var lc = lista(ficha.condicoes).concat([cond]);
        return resultado(ref, destino, nome, [{ caminho: 'condicoes', valor: lc }], 'Levar: ' + nome + ' (condição)',
          nome + ' entrou nas condições ativas da ficha do ensaio' + (ent ? '.' : ' (fora do catálogo: fica com o nome do card).'), { orfa: !ent });
      }
      // as entradas (técnicas, Grimório, Cartas)
      if (lista(ficha.entradas).some(function (e) { return obj(e) && e.tipo === ref.tipo && e.id === ref.id; })) {
        return repetida(ref, destino, nome, nome + ' já está ' + NOME_DESTINO[destino].replace(/^(os|as|o|a) /, 'n$1 ') + ' da ficha do ensaio: nada mudou.');
      }
      var rara = !!ent && ref.tipo === 'carta' && ent.categoria === 'rara';
      var cache = { nome: ent ? str(ent.nome) : semEmoji(ref.nome) || ref.id, versaoCatalogo: versao };
      // a carta rara nunca leva o efeito (o site não o mostra; o catálogo não o tem)
      if (ent && !rara && ent.resumo != null) cache.resumo = str(ent.resumo);
      var nova = { uid: uidNovo(ficha, op), tipo: ref.tipo, id: ref.id, estado: KhEstado.estadoPadrao(ref.tipo), cache: cache,
        mods: ent && Array.isArray(ent.mods) ? clone(ent.mods) : [], adicionadoEm: agora };
      if (!ent) nova.orfao = { motivo: semCatalogoDo(cat, ref.tipo) ? 'sem-catalogo' : 'sumiu' };
      var le = lista(ficha.entradas).concat([nova]);
      var aviso = nome + ' foi para ' + NOME_DESTINO[destino] + ' da ficha do ensaio' +
        (ent ? '.' : ': o id não está no catálogo, e a entrada fica órfã (com o nome do card), sem ser apagada.');
      return resultado(ref, destino, nome, [{ caminho: 'entradas', valor: le }], 'Levar: ' + nome + ' (' + maiuscula(NOME_DESTINO[destino].replace(/^(as|os|o|a) /, '')) + ')',
        aviso, { orfa: !ent, rara: rara });
    }

    // item do Bazar: o modelo do inventário da ficha v3 (KhInv), com o índice do
    // Bazar (o id antigo resolve para o atual; a mesma linha soma +1)
    function levarItem(ficha, ref, cat, op) {
      var bz = obj(cat.bazar) ? cat.bazar : null;
      var it = bz ? (pega(bz.porId, ref.id) || pega(bz.porId, obj(ref.item) ? str(ref.item.id) : '') ||
        pega(bz.porNome, obj(ref.item) ? str(ref.item.nome) : '')) : null;
      var item = it || (obj(ref.item) ? ref.item : null);
      if (!item && !bz) return { ok: false, erro: 'O catálogo do Bazar não carregou: recarregue a página para levar o item.' };
      if (!item) item = { id: str(ref.id), nome: semEmoji(ref.nome) || str(ref.id) };
      var nome = semEmoji(item.nome) || str(ref.id);
      var inv = clone(obj(ficha.inventario) ? ficha.inventario : {});
      KhInv.COLUNAS.forEach(function (c) { if (!Array.isArray(inv[c])) inv[c] = []; });
      var antes = {};
      KhInv.COLUNAS.forEach(function (c) { antes[c] = JSON.stringify(inv[c]); });
      // a linha guardada com o id antigo deste item (data/bazar-renomeados.json)
      // passa ao id atual, e a livre do mesmo item soma (como o KhInv.reconciliar faz)
      if (it && bz) {
        KhInv.COLUNAS.forEach(function (c) {
          var trocou = false;
          inv[c].forEach(function (e) {
            if (obj(e) && !e.avulso && e.id && e.id !== str(it.id) && pega(bz.porId, e.id) === it) { e.id = str(it.id); trocou = true; }
          });
          if (trocou) inv[c] = KhInv.fundir(inv[c]);
        });
      }
      var r = KhInv.mesclar(inv, item, { qtd: 1 });
      var orfa = !it;
      if (orfa) {
        var a = KhInv.acha(inv, r.uid);
        if (a && bz) a.entrada.orfao = true;   // nunca apagado: pesa pelo snapshot
      }
      var mudancas = KhInv.COLUNAS.filter(function (c) { return JSON.stringify(inv[c]) !== antes[c]; })
        .map(function (c) { return { caminho: 'inventario.' + c, valor: inv[c] }; });
      var linha = KhInv.acha(inv, r.uid);
      var qtd = linha ? linha.entrada.qtd : 1;
      var col = r.coluna === 'equipamentos' ? 'Equipamentos' : 'Bugigangas';
      var aviso = r.fundiu ? nome + ' já estava no inventário da ficha do ensaio: agora são ' + qtd + ' (a mesma linha, em ' + col + ').'
        : nome + ' foi para o inventário da ficha do ensaio (' + col + ')' +
          (orfa && bz ? ': o id não está no catálogo do Bazar, e o item fica órfão (com o nome do card), sem ser apagado.' : '.');
      return resultado({ tipo: 'item', id: str(item.id || ref.id) }, 'inventario', nome, mudancas,
        'Levar: ' + nome + ' (inventário)', aviso, { orfa: orfa, fundiu: !!r.fundiu, qtd: qtd, coluna: r.coluna });
    }

    // raça, classe, origem, variante e subespécie: a identidade (as regras do
    // KhEdicao.mudancas: trocar a raça tira a variante de outra raça…)
    function levarIdentidade(ficha, ref, cat) {
      var ctx = obj(cat.ctx) ? cat.ctx : null, k = ref.tipo;
      var ent = ctx ? (k === 'classe' ? pega(ctx.classes, ref.id) : pega(ctx.porId, k + ':' + ref.id)) : null;
      var nome = nomeDe(ent, ref);
      var atual = refIdent(ficha, k);
      if (atual.id && atual.id === ref.id) {
        return repetida(ref, 'identidade', nome, nome + ' já é ' + ARTIGO[k] + ' da ficha do ensaio: nada mudou.');
      }
      var f = clone(ficha), mud = {}, ordem = [], avisos = [];
      function aplica(r) {
        lista(r.mudancas).forEach(function (m) {
          if (!temPropria(mud, m.caminho)) ordem.push(m.caminho);
          mud[m.caminho] = m.valor;
          KhEstado.poeCaminho(f, m.caminho, clone(m.valor));
        });
        if (r.aviso) avisos.push(r.aviso);
      }
      if (!ent) {
        // fora do catálogo: fica só o nome (como a identidade sem par da migração), nunca apagado
        aplica({ mudancas: [{ caminho: 'identidade.' + k, valor: { id: null, nome: semEmoji(ref.nome) || ref.id } }] });
        avisos.push('O id não está no catálogo: ' + ARTIGO[k] + ' fica só com o nome do card.');
      } else if (k === 'variante' || k === 'subespecie') {
        var r = str(ent.raca), raca = refIdent(f, 'raca');
        if (raca.id && chaveDe(raca.id, 'raca-') !== r) {
          return { ok: false, erro: maiuscula(ARTIGO[k]) + ' ' + nome + ' é de outra raça (' + (semEmoji(nomeRaca(ctx, r)) || r) +
            '); a da ficha do ensaio é ' + semEmoji(raca.nome || raca.id) + '. Leve a raça antes (ou troque na página da ficha): nada mudou.' };
        }
        if (!raca.id) {
          var rr = KhEdicao.mudancas(f, 'identidade.raca', 'raca-' + r, { contexto: ctx });
          if (!rr.ok) return { ok: false, erro: rr.erro };
          aplica(rr);
          avisos.push('A raça veio junto: ' + semEmoji(nomeRaca(ctx, r)) + '.');
        }
        if (k === 'variante') {
          var rv = KhEdicao.mudancas(f, 'identidade.variante', ref.id, { contexto: ctx });
          if (!rv.ok) return { ok: false, erro: rv.erro };
          aplica(rv);
        } else aplica({ mudancas: [{ caminho: 'identidade.subespecie', valor: { id: ref.id, nome: semEmoji(ent.nome) } }] });
      } else {
        var rk = KhEdicao.mudancas(f, 'identidade.' + k, ref.id, { contexto: ctx });
        if (!rk.ok) return { ok: false, erro: rk.erro };
        aplica(rk);
        if (atual.id || str(atual.nome).trim()) avisos.unshift(maiuscula(ARTIGO[k]) + ' era ' + semEmoji(atual.nome || atual.id) + '.');
      }
      var falta = faltaEscolher(f, ctx);
      var aviso = NOME_IDENT[k] + ' da ficha do ensaio: ' + nome + '.' + (avisos.length ? ' ' + avisos.join(' ') : '') +
        (falta.length ? ' Falta escolher ' + e2(falta) + '.' : ' Nada mais a escolher na identidade.');
      return resultado(ref, 'identidade', nome, ordem.map(function (c) { return { caminho: c, valor: mud[c] }; }),
        'Levar: ' + nome + ' (' + NOME_IDENT[k] + ')', aviso, { falta: falta, orfa: !ent });
    }
    function nomeRaca(ctx, chave) {
      var e = ctx ? pega(ctx.porId, 'raca:raca-' + chave) : null;
      return e ? e.nome : chave;
    }

    // ---------------- Bestiário (PURO) ----------------
    // res: o KhEnsaio.calcular (estado 'ok': ficha e av); cat: {ctx, bazar}
    function bestiario(res, cat) {
      cat = obj(cat) ? cat : {};
      var f = res.ficha, nos = obj(res.av) && obj(res.av.nos) ? res.av.nos : {};
      function v(c) { var n = nos[c]; return n && n.valor !== undefined ? n.valor : null; }
      var meta = obj(f.meta) ? f.meta : {};
      var b = { type: 'npc', name: semEmoji(meta.nome) || 'Personagem', race: semEmoji(refIdent(f, 'raca').nome),
        npc_class: semEmoji(refIdent(f, 'classe').nome), level: meta.nivel };
      ATRIB_BEST.forEach(function (a) { b[a[1]] = v('atributo.' + a[0] + '.total'); });
      b.health_max = v('recurso.saude.max');
      b.stamina_max = v('recurso.stamina.max');
      b.ether_max = v('recurso.eter.max');
      b.evasion = v('evasao.passiva');
      b.movement = v('movimento');
      b.armor = v('ar');
      var pe = obj(f.pericias) ? f.pericias : {};
      function grau(p) { var n = parseInt(pe[p], 10); return isFinite(n) ? Math.max(0, Math.min(4, n)) : 0; }
      PROF.forEach(function (p) { b[p[1]] = grau(p[0]); });
      b.prof_craft = Math.max.apply(null, OFICIOS.map(grau));
      b.craft_attr = 'intelligence';   // os três Ofícios são INT (CLAUDE.md §2)
      var rs = [], im = [], ae = [];
      DANO.forEach(function (t) {
        if (v('resistencia.' + t[0]) === true) rs.push(t[1]);
        if (v('imunidade.' + t[0]) === true) im.push(t[1]);
        var n = v('ae.' + t[0]);
        if (typeof n === 'number' && n > 0) ae.push(t[1] + ' ' + n);
      });
      CATEGORIAS.forEach(function (c) { var n = v('ae.' + c[0]); if (typeof n === 'number' && n > 0) ae.push(c[1] + ' ' + n); });
      b.resistances = rs.join(', ');
      b.immunities = im.join(', ');
      b.armor_specific = ae.join(', ');
      var ctx = obj(cat.ctx) ? cat.ctx : null;
      b.abilities = lista(f.entradas).filter(function (e) { return obj(e) && HABILIDADES.indexOf(e.tipo) >= 0; }).map(function (e) {
        var c = ctx && e.id ? pega(ctx.porId, e.tipo + ':' + e.id) : null;
        var cache = obj(e.cache) ? e.cache : {};
        return { name: semEmoji(c ? c.nome : cache.nome), description: str(c && c.resumo != null ? c.resumo : cache.resumo) };
      });
      // as armas pelo catálogo de agora (o id antigo resolve), numa cópia
      var inv = clone(obj(f.inventario) ? f.inventario : {});
      KhInv.COLUNAS.forEach(function (c) { if (!Array.isArray(inv[c])) inv[c] = []; });
      if (obj(cat.bazar)) KhInv.reconciliar(inv, cat.bazar.porId, cat.bazar.porNome);
      b.weapons = KhInv.armasBestiario(inv);
      return b;
    }
    function nomeBestiario(ficha) {
      var n = semEmoji(obj(ficha) && obj(ficha.meta) ? ficha.meta.nome : '');
      return (n || 'personagem').replace(/\s+/g, '_') + '.bestiario.json';
    }

    // ---------------- o catálogo inteiro (garantir) ----------------
    function buscaBazar(fetchFn, base, versao) {
      var p;
      try { p = fetchFn(str(base) + 'data/bazar.json' + str(versao)); } catch (e) { return Promise.reject(e); }
      return Promise.resolve(p).then(function (r) {
        if (!r || !r.ok) throw new Error('HTTP ' + (r && r.status));
        return r.json();
      }).then(function (x) {
        var l = Array.isArray(x) ? x : lista(x && x.itens);
        if (!l.length) throw new Error('vazio');
        return l;
      });
    }
    // os arquivos de dado que faltam (os do KhPrevia; o sprite de glifos não é catálogo)
    function faltam(dados) {
      if (!obj(dados)) return ['data/*'];   // o carregar inteiro falhou
      return lista(dados.erros).filter(function (c) { return str(c).indexOf('data/') === 0; });
    }
    // Tudo o que o export precisa: os dados do motor (KhPrevia.carregar) e o
    // Bazar. ja: {dados, itens} já carregados (sem falta: reaproveita).
    // -> Promise<{ok:true, dados, itens} | {ok:false, erros:[caminhos]}>
    function garantir(fetchFn, base, versao, ja) {
      ja = obj(ja) ? ja : {};
      var pd = ja.dados && !faltam(ja.dados).length ? Promise.resolve(ja.dados)
        : Promise.resolve().then(function () { return KhPrevia.carregar(fetchFn, base, versao); });
      var pb = lista(ja.itens).length ? Promise.resolve(ja.itens) : buscaBazar(fetchFn, base, versao);
      return Promise.all([pd.then(null, function () { return null; }), pb.then(null, function () { return null; })]).then(function (r) {
        var erros = faltam(r[0]);
        if (!r[1]) erros.push('data/bazar.json');
        return erros.length ? { ok: false, erros: erros } : { ok: true, dados: r[0], itens: r[1] };
      });
    }
    function avisoGarantir(erros) {
      var l = lista(erros), mostra = l.slice(0, 3).join(', ') + (l.length > 3 ? ' e mais ' + (l.length - 3) : '');
      return 'O catálogo não carregou inteiro (' + mostra + '): o export do Bestiário foi cancelado e nada foi baixado. ' +
        'Confira a conexão e tente de novo.';
    }

    // ---------------- a interface: levar (uma por página) ----------------
    var atual = null;
    // op: {dados: () => Promise<{dados, versao}> (os do KhPrevia.carregar, do drawer)}
    function ligar(win, op) {
      if (!win || !win.document || !KhEnsaio || !KhInv || !KhEstado) return null;
      if (atual && atual.win === win) { atual.sincroniza(); return atual; }
      try { atual = montar(win, op || {}); } catch (e) { atual = null; }
      return atual;
    }
    function montar(win, op) {
      var doc = win.document;
      if (!doc.body) return null;
      var ss = storage(win, 'sessionStorage');
      var bv = KhSeletor && KhSeletor.baseVersao ? KhSeletor.baseVersao(doc) : { base: '', versao: '' };
      var bazar = null, bazarP = null, ctxDe = null, ctxCache = null, mostrando = false, mo = null, moT = null;
      var toast = null, toastEl = null, ultimo = null;

      function ligado() { try { return KhEnsaio.ligado(win); } catch (e) { return false; } }
      function emitir() { KhEnsaio.emitir(win, ['ficha']); }
      // os dados do motor: os do drawer (op.dados) ou, sem eles, os próprios
      var proprio = null;
      function motor() {
        var p = null;
        try { p = typeof op.dados === 'function' ? op.dados() : null; } catch (e) { p = null; }
        if (!p) {
          if (!proprio) proprio = KhPrevia.carregar(win.fetch.bind(win), bv.base, bv.versao).then(function (d) { return { dados: d, versao: bv.versao }; });
          p = proprio;
        }
        return Promise.resolve(p).then(function (m) { return obj(m) ? m : {}; }, function () { return {}; });
      }
      function contexto(d) {
        if (!d) return null;
        if (ctxDe !== d) { ctxDe = d; ctxCache = KhFichaAbas ? KhFichaAbas.contexto(d) : null; }
        return ctxCache;
      }
      // o índice do Bazar (data/bazar.json), uma vez; se falhar, tenta de novo na próxima
      function itens() {
        if (bazar) return Promise.resolve(bazar);
        if (!bazarP) {
          bazarP = buscaBazar(win.fetch.bind(win), bv.base, bv.versao).then(function (l) { bazar = KhInv.indexar(l); bazar.lista = l; return bazar; },
            function () { bazarP = null; return null; });
        }
        return bazarP;
      }
      function arm() { return KhEnsaio.armazem(ss); }
      function fichaAtiva() { var a = arm(), id = a.ativa(); return id ? { a: a, id: id, f: a.ler(id) } : null; }

      // ---- os controles dos cards
      function cards() {
        return arr(doc.querySelectorAll('[data-kf-tipo][data-kf-id]')).filter(function (c) { return !c.closest('[data-kf-ignorar]'); });
      }
      function poeBotao(b, naFicha, nome) {
        if (!b.hasAttribute(MARCA)) {
          b.setAttribute(MARCA, '');
          b.setAttribute(ROTULO, str(b.getAttribute('aria-label')));
        }
        var rot = str(b.getAttribute(ROTULO)) || PREFIXO_ROTULO + nome;
        var novo = naFicha ? rot + ' (já está na ficha do ensaio)' : rot;
        if (b.getAttribute('aria-label') !== novo) b.setAttribute('aria-label', novo);
        var h = (naFicha ? SVG_FEITO : SVG_MAIS) + '<span class="ke-ent-txt">' + (naFicha ? 'Na ficha' : 'Levar') + '</span>';
        if (b._keHtml !== h) { b.innerHTML = h; b._keHtml = h; }
        var dica = naFicha ? 'Já está na ficha do ensaio (tecla A)' : 'Levar para a ficha do ensaio (tecla A)';
        if (b.getAttribute('title') !== dica) b.setAttribute('title', dica);
        if (b.hidden) b.hidden = false;
      }
      function mostraCard(c, naFicha) {
        var b = controle(c, 'ent-add'), a = controle(c, 'ent-alca');
        if (b) poeBotao(b, naFicha, nomeDoCard(c));
        if (a) {
          if (a.hidden) a.hidden = false;
          if (a.getAttribute('draggable') !== 'true') a.setAttribute('draggable', 'true');
          if (a._keHtml !== SVG_ALCA) { a.innerHTML = SVG_ALCA; a._keHtml = SVG_ALCA; }
          if (a.getAttribute('title') == null) a.setAttribute('title', 'Arraste para a ficha do ensaio');
        }
        if (naFicha) { if (!c.hasAttribute(NA_FICHA)) c.setAttribute(NA_FICHA, ''); }
        else if (c.hasAttribute(NA_FICHA)) c.removeAttribute(NA_FICHA);
      }
      // volta ao que o build deixou: hidden, vazio, o aria-label original
      function escondeCard(c) {
        var b = controle(c, 'ent-add'), a = controle(c, 'ent-alca');
        if (b && b.hasAttribute(MARCA)) {
          b.hidden = true;
          b.innerHTML = ''; b._keHtml = null;
          var rot = b.getAttribute(ROTULO);
          if (rot != null) b.setAttribute('aria-label', rot);
          b.removeAttribute(ROTULO); b.removeAttribute(MARCA); b.removeAttribute('title');
        }
        if (a && (a.hasAttribute('draggable') || !a.hidden)) {
          a.hidden = true;
          a.innerHTML = ''; a._keHtml = null;
          a.removeAttribute('draggable'); a.removeAttribute('title');
        }
        if (c.hasAttribute(NA_FICHA)) c.removeAttribute(NA_FICHA);
      }
      function observa(on) {
        if (on && !mo && typeof win.MutationObserver === 'function') {
          try {
            mo = new win.MutationObserver(function (regs) {
              var conta = regs.some(function (r) {
                var t = r.target;
                if (t && t.nodeType !== 1) t = t.parentElement;
                return !(t && t.closest && t.closest('[data-kf-ignorar], .ent-add, .ent-alca'));
              });
              if (!conta) return;
              clearTimeout(moT);
              moT = setTimeout(sincroniza, ESPERA_MUTACAO);
            });
            mo.observe(doc.body, { childList: true, subtree: true });
          } catch (e) { mo = null; }
        } else if (!on && mo) { try { mo.disconnect(); } catch (e) { /* já foi */ } mo = null; }
      }
      // mostra (e marca "na ficha") com o Ensaio; sem ele, devolve ao build
      function sincroniza() {
        var on = ligado();
        observa(on);
        if (!on) {
          if (mostrando) arr(doc.querySelectorAll('.ent-add[' + MARCA + '], .ent-alca[draggable]')).forEach(function (x) {
            var c = x.closest('[data-kf-tipo]');
            if (c) escondeCard(c);
          });
          mostrando = false;
          if (toast) toast.fechar();
          return false;
        }
        mostrando = true;
        var x = null;
        try { x = fichaAtiva(); } catch (e) { x = null; }
        var s = chaves(x && x.f, bazar), temItem = false;
        cards().forEach(function (c) {
          var tipo = str(c.getAttribute('data-kf-tipo'));
          if (tipo === 'item') temItem = true;
          mostraCard(c, !!s[tipo + ':' + str(c.getAttribute('data-kf-id'))]);
        });
        // no Bazar, o "na ficha" do item com id antigo precisa do índice
        if (temItem && !bazar && !bazarP) itens().then(function (bz) { if (bz) sincroniza(); });
        return true;
      }

      // ---- o recado (KhToast, com Desfazer)
      function recado(r) {
        if (!r || !r.aviso) return;
        if (!toastEl) {
          toastEl = doc.createElement('div');
          toastEl.id = ID_TOAST;
          toastEl.className = 'ke-levar-toast';
          toastEl.setAttribute('role', 'status');
          toastEl.setAttribute('aria-live', 'polite');
          toastEl.setAttribute('data-kf-ignorar', '');
          toastEl.addEventListener('click', function (e) {
            var b = e.target && e.target.closest ? e.target.closest('[data-toast-desfazer]') : null;
            if (b) desfazUltimo();
          });
          doc.body.appendChild(toastEl);
        }
        if (!toast) {
          var T = win.KhToast;
          toast = T && typeof T.criar === 'function' ? T.criar(toastEl, { ms: MOSTRA }) : {
            mostrar: function (m) { toastEl.textContent = m; toastEl.classList.add('on'); },
            fechar: function () { toastEl.classList.remove('on'); toastEl.textContent = ''; } };
        }
        var classe = r.ok === false || r.repetida ? 'ke-levar-aviso' : 'ke-levar-ok';
        toastEl.classList.remove('ke-levar-aviso', 'ke-levar-ok');
        toastEl.classList.add(classe);
        toast.mostrar(r.aviso, { desfazer: !!(r.ok && r.mudou && r.desfazivel) });
      }
      // o Desfazer do recado: só se o passo do topo ainda é o deste levar
      function desfazUltimo() {
        var u = ultimo;
        ultimo = null;
        if (!u || !ligado()) { recado({ ok: false, aviso: ligado() ? 'Nada a desfazer.' : FORA }); return; }
        var a = arm(), topo = a.estadoLog(u.fichaId).desfazer;
        if (a.ativa() !== u.fichaId || !topo || topo.rotulo !== u.rotulo) {
          recado({ ok: false, aviso: 'Não dá para desfazer "' + u.rotulo + '": a ficha mudou depois. Use o Desfazer da ficha.' });
          return;
        }
        var r = a.desfazer(u.fichaId);
        recado({ ok: r.ok, aviso: r.ok ? 'Desfeito: ' + r.rotulo + '.' : textoErro(r) });
        if (r.ok) emitir();
      }

      // ---- levar: a ref (ou o text/plain da v2.1: {v2}) -> Promise<resultado>
      function levarRef(entrada) {
        if (!ligado()) return Promise.resolve({ ok: false, erro: 'fora', aviso: FORA });
        entrada = obj(entrada) ? entrada : {};
        var precisaBazar = entrada.tipo === 'item' || (obj(entrada.v2) && entrada.v2._bazar);
        return Promise.all([motor(), precisaBazar ? itens() : null]).then(function (rs) {
          var m = rs[0], d = m.dados || null;
          if (!ligado()) return { ok: false, erro: 'fora', aviso: FORA };
          var ctx = contexto(d);
          var ref = obj(entrada.v2) ? refDoV2(entrada.v2, ctx) : entrada;
          if (!ref || !ref.tipo) return { ok: false, aviso: 'Não deu para saber que card é este: nada foi levado.' };
          var x = fichaAtiva();
          if (!x) return { ok: false, aviso: SEM_FICHA };
          if (!x.f) return { ok: false, aviso: textoErro({ erro: 'ilegivel' }) };
          var r = levar(x.f, ref, { ctx: ctx, bazar: rs[1] || bazar, versao: m.versao, erros: d ? d.erros : ['motor'] }, {});
          if (!r.ok) return { ok: false, aviso: r.erro };
          if (!r.mudou) return r;
          var g = x.a.editar(x.id, r.mudancas, r.rotulo);
          if (!g.ok) return { ok: false, aviso: textoErro(g) };
          r.fichaId = x.id;
          r.desfazivel = !!g.desfazivel;
          if (g.avisoLog) r.aviso += ' Gravado, mas sem desfazer: ' + textoErro({ erro: g.avisoLog });
          // a limpeza por falta de espaço apagou o desfazer desta ficha (auditoria B: avisar)
          if (g.logLimpo) r.aviso = (r.aviso ? r.aviso + ' ' : '') + 'Faltou espaço: para gravar, o histórico de desfazer desta ficha foi apagado.';
          ultimo = r.desfazivel ? { fichaId: x.id, rotulo: r.rotulo } : null;
          emitir();
          return r;
        }).then(null, function (e) { return { ok: false, aviso: 'Não deu para levar: ' + str(e && e.message) + '. Nada foi gravado.' }; });
      }
      function levaCard(card) {
        var ref = refDoCard(card);
        if (!ref) return Promise.resolve(null);
        return levarRef(ref).then(function (r) { recado(r); sincroniza(); return r; });
      }

      // ---- clique no .ent-add (na captura: o card embaixo não abre, não navega)
      doc.addEventListener('click', function (e) {
        var b = e.target && e.target.closest ? e.target.closest('.ent-add') : null;
        if (!b) return;
        var card = b.closest('[data-kf-tipo][data-kf-id]');
        if (!card || card.closest('[data-kf-ignorar]')) return;
        if (!b.hasAttribute(MARCA) && b.hidden) return;   // o botão do build, inerte
        e.preventDefault();
        e.stopPropagation();
        // página velha (o Ensaio saiu em outra página da aba): nada grava, e os botões somem
        if (!ligado()) { sincroniza(); recado({ ok: false, aviso: FORA }); return; }
        levaCard(card);
      }, true);
      // ---- a tecla A no card focado (o botão, ou o próprio card no Bazar)
      var T = win.KhTeclas;
      function teclaA() {
        if (!ligado()) return false;
        var x = doc.activeElement;
        var card = x && x.closest ? x.closest('[data-kf-tipo][data-kf-id]') : null;
        if (!card || card.closest('[data-kf-ignorar]')) return false;
        levaCard(card);
        return true;
      }
      if (T && typeof T.atalho === 'function') {
        ['a', 'A'].forEach(function (k) {
          T.atalho(k, teclaA, { repetir: false, descricao: 'Levar o card focado para a ficha do ensaio' });
        });
      }
      // ---- o arrasto: pela alça, a ref e o nome; do card inteiro (a v2.1), a ref junto
      doc.addEventListener('dragstart', function (e) {
        if (!e.dataTransfer || !ligado()) return;
        var t = e.target && e.target.closest ? e.target : null;
        var ref = t && !t.closest('[data-kf-ignorar]') ? refDoCard(t) : null;
        if (!ref) return;
        try { e.dataTransfer.setData(MIME, payloadRef(ref)); } catch (x) { /* navegador sem MIME próprio */ }
        if (t.closest('.ent-alca')) {
          try { e.dataTransfer.setData('text/plain', ref.nome || ref.id); } catch (x) { /* idem */ }
          try { e.dataTransfer.effectAllowed = 'copy'; } catch (x) { /* idem */ }
        }
      });

      doc.addEventListener(KhEnsaio.EVENTO, function () { sincroniza(); });
      if (typeof win.addEventListener === 'function') {
        win.addEventListener('pageshow', function (e) { if (e && e.persisted) sincroniza(); });
      }
      sincroniza();
      return { win: win, sincroniza: sincroniza, levar: levarRef, recado: recado, itens: itens, mostrando: function () { return mostrando; } };
    }

    // ---------------- a interface: o export do Bestiário ----------------
    function htmlExport(st) {
      var msg = obj(st.msg) ? st.msg : null;
      return '<div class="ke-bst"><button type="button" class="kh-btn ke-btn ke-bst-btn" data-kl="bestiario"' +
        (st.ocupado ? ' aria-disabled="true"' : '') +
        ' title="Baixa a ficha do ensaio no formato do Bestiário (type npc), com os valores calculados">' +
        (st.ocupado ? 'Carregando o catálogo…' : 'Exportar para o Bestiário') + '</button>' +
        '<p class="ke-msg' + (msg && msg.tipo === 'aviso' ? ' ke-msg-aviso' : '') + '" role="status">' + (msg ? esc(msg.texto) : '') + '</p></div>';
    }
    // -> Promise<{ok, nomeArquivo, dados} | {ok:false, aviso}>; baixar: (arquivo) -> bool
    function exportarBestiario(win, op) {
      op = obj(op) ? op : {};
      if (!KhEnsaio || !KhEnsaio.ligado(win)) return Promise.resolve({ ok: false, aviso: FORA });
      var doc = win.document, ss = storage(win, 'sessionStorage');
      var bv = KhSeletor && KhSeletor.baseVersao ? KhSeletor.baseVersao(doc) : { base: '', versao: '' };
      var ja = null;
      try { ja = typeof op.ja === 'function' ? op.ja() : null; } catch (e) { ja = null; }
      return Promise.resolve(ja).then(null, function () { return null; }).then(function (j) {
        return garantir(win.fetch.bind(win), bv.base, j && j.versao != null ? j.versao : bv.versao, j);
      }).then(function (g) {
        if (!g.ok) return { ok: false, aviso: avisoGarantir(g.erros), erros: g.erros };
        if (!KhEnsaio.ligado(win)) return { ok: false, aviso: FORA };
        var versao = bv.versao;
        var res = KhEnsaio.calcular(ss, g.dados, versao);
        if (res.estado !== 'ok') return { ok: false, aviso: res.estado === 'sem-ficha' ? SEM_FICHA : 'A ficha do ensaio não pôde ser calculada: nada foi baixado.' };
        var b = bestiario(res, { ctx: KhFichaAbas ? KhFichaAbas.contexto(g.dados) : null, bazar: KhInv.indexar(g.itens) });
        var arq = { nomeArquivo: nomeBestiario(res.ficha), dados: b };
        var baixar = typeof op.baixar === 'function' ? op.baixar : function (x) { return KhSeletor.baixar(win, x); };
        if (!baixar(arq)) return { ok: false, aviso: 'Não deu para baixar o arquivo.' };
        return { ok: true, nomeArquivo: arq.nomeArquivo, dados: b, aviso: 'Baixado: ' + arq.nomeArquivo + ' (Bestiário, type npc).' };
      }, function (e) { return { ok: false, aviso: 'O export do Bestiário falhou (' + str(e && e.message) + '): nada foi baixado.' }; });
    }
    // op: {win, doc, lugar: () => el (cria na 1ª vez), dados: () => Promise<{dados, versao}>}
    // Quem cria chama desenha() no redesenho dele (a página e o drawer redesenham
    // no kh:ensaio): o lugar entra depois da barra do KhEditor, na ordem certa.
    function criarExport(op) {
      op = obj(op) ? op : {};
      var win = op.win, doc = op.doc || (win && win.document);
      if (!win || !doc || !KhEnsaio) return null;
      var el = null, st = { msg: null, ocupado: false };
      function ligado() { try { return KhEnsaio.ligado(win); } catch (e) { return false; } }
      function desenha() {
        if (!ligado()) { if (el && !el.hidden) el.hidden = true; st.msg = null; return false; }
        if (!el) {
          try { el = typeof op.lugar === 'function' ? op.lugar() : null; } catch (e) { el = null; }
          if (!el) return false;
          el.addEventListener('click', aoClicar);
        }
        if (el.hidden) el.hidden = false;
        var h = htmlExport(st);
        if (el._kbeHtml !== h) { el.innerHTML = h; el._kbeHtml = h; }
        return true;
      }
      function aoClicar(e) {
        var b = e.target && e.target.closest ? e.target.closest('[data-kl="bestiario"]') : null;
        if (!b || st.ocupado) return;
        if (!ligado()) { desenha(); return; }
        st.ocupado = true; st.msg = null;
        desenha();
        exportarBestiario(win, { ja: op.dados }).then(function (r) {
          st.ocupado = false;
          st.msg = { tipo: r.ok ? 'ok' : 'aviso', texto: r.aviso };
          desenha();
          var x = el && el.querySelector('[data-kl="bestiario"]');
          if (x && typeof x.focus === 'function') { try { x.focus({ preventScroll: true }); } catch (y) { x.focus(); } }
        });
      }
      return { desenha: desenha, estado: function () { return JSON.parse(JSON.stringify(st)); } };
    }

    return { MIME: MIME, VERSAO_REF: VERSAO_REF, DESTINO: DESTINO, ABA: ABA, ARTIGO: ARTIGO, MARCA: MARCA, NA_FICHA: NA_FICHA,
      ROTULO: ROTULO, ID_TOAST: ID_TOAST, FORA: FORA, SEM_FICHA: SEM_FICHA, PREFIXO_ROTULO: PREFIXO_ROTULO,
      refDoCard: refDoCard, nomeDoCard: nomeDoCard, payloadRef: payloadRef, lerRef: lerRef, refDoV2: refDoV2,
      chaves: chaves, faltaEscolher: faltaEscolher, levar: levar, bestiario: bestiario, nomeBestiario: nomeBestiario,
      garantir: garantir, avisoGarantir: avisoGarantir, exportarBestiario: exportarBestiario, htmlExport: htmlExport,
      ligar: ligar, criarExport: criarExport, atual: function () { return atual; } };
  })();

  if (emNode) { module.exports = KhLevar; return; }
  raiz.KhLevar = KhLevar;
})(typeof window !== 'undefined' ? window : this);
