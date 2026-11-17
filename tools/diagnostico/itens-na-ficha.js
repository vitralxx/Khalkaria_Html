'use strict';
// Diagnóstico (2026-11-16): cada item do Bazar numa ficha de teste, conferido pelo motor.
// Lê a tabela do balanceamento (data/balanceamento/ficha-efeitos-itens.json, por gatilho)
// e a projeção do site (data/efeitos.json); põe o item no inventário (equipado, sintonizado
// ou só carregado, pelo gatilho), avalia o KhRegras e confere se cada Mod "sempre, no
// portador" chegou ativo a algum número (termo com fonte.id do item). Imprime JSON.
//   node tools/diagnostico/itens-na-ficha.js > saida.json
const path = require('node:path');
const fs = require('node:fs');
const RAIZ = path.join(__dirname, '..', '..');
const R = require(path.join(RAIZ, 'js/ficha/kh-regras.js'));
const E = require(path.join(RAIZ, 'js/ficha/kh-estado.js'));
const ler = (...p) => JSON.parse(fs.readFileSync(path.join(RAIZ, ...p), 'utf8'));
const TAB = ler('data', 'balanceamento', 'ficha-efeitos-itens.json');
const EF = ler('data', 'efeitos.json');
const LEMBRETE = new Set(Object.keys(EF.alvos).filter((k) => EF.alvos[k].lembrete));

function ficha() {
  const f = E.novaFicha({ nome: 'Teste', nivel: 3 }, { agora: () => '2026-11-16T12:00:00.000Z' });
  f.identidade.classe = { id: 'classe-monge', nome: 'monge' };
  f.identidade.raca = { id: 'raca-humano', nome: 'humano' };
  Object.assign(f.atributos.base, { FOR: 12, DES: 12, CON: 12, INT: 12, SAB: 12 });
  return f;
}
const ehLembrete = (alvo) => LEMBRETE.has(alvo) || [...LEMBRETE].some((k) => k.includes('<') && new RegExp('^' + k.replace(/\./g, '\\.').replace(/<[^>]+>/g, '[^.]+') + '$').test(alvo));

// alvos que não viram termo de número: a imunidade a condição bloqueia a condição (KhEfeitos),
// a capacidade vem do KhInv, o resto é texto ou espera a Mesa (tools/diagnostico/relatorio.py)
const FORA_DO_NUMERO = /^(imunidade\.condicao\.|capacidade\.|regeneracao\.|permiteSemTreino\.|recipiente\.|acao\.)/;

function diagnosticar() {
const saida = [];
for (const [id, t] of Object.entries(TAB.tabela)) {
  const g = t.gatilhos || {};
  const linha = { id, nome: t.nome, categoria: t.categoria, raridade: t.raridade, gatilhos: Object.keys(g) };
  if (t.semEfeito) { linha.grupo = 'sem-efeito'; linha.motivo = t.semEfeito.motivo; saida.push(linha); continue; }
  const passivos = [], situacionais = [], evento = [], critico = [], outros = [], lembretes = [];
  ['carregar', 'equipar', 'sintonizar'].forEach((k) => {
    const b = g[k]; if (!b) return;
    (b.mods || []).forEach((m) => {
      const x = Object.assign({ gatilho: k }, m);
      if (m.para && m.para !== 'portador') outros.push(x);
      else if (m.aplica === 'sempre') (ehLembrete(m.alvo) ? lembretes : passivos).push(x);
      else if (m.aplica === 'situacional') situacionais.push(x);
      else if (m.aplica === 'evento') evento.push(x);
      else if (m.aplica === 'critico') critico.push(x);
      else outros.push(x);
    });
    (b.lembretes || []).forEach((l) => lembretes.push({ gatilho: k, texto: l }));
  });
  linha.temArma = !!(g.equipar && g.equipar.arma);
  linha.consumir = !!g.consumir;
  linha.usar = Array.isArray(g.usar) ? g.usar.length : 0;
  linha.n = { passivos: passivos.length, situacionais: situacionais.length, evento: evento.length, critico: critico.length, outros: outros.length, lembretes: lembretes.length };

  // conferência no motor: o item no inventário pelo gatilho
  if (passivos.length || linha.temArma || situacionais.length) {
    const f = ficha();
    const e = { uid: 'x1', id, nome: t.nome, qtd: 1, empilhavel: false, equipado: !!g.equipar, sintonizado: !!g.sintonizar, avulso: false };
    (g.equipar ? f.inventario.equipamentos : f.inventario.bugigangas).push(e);
    let r;
    try { r = R.avaliar(f, { efeitos: EF }); } catch (err) { linha.erro = String(err && err.message || err); saida.push(linha); continue; }
    const termos = [];
    Object.entries(r.nos).forEach(([c, no]) => (no.termos || []).forEach((tm) => { if (tm.fonte && tm.fonte.id === id) termos.push({ no: c, ativo: tm.ativo, motivo: tm.motivo }); }));
    const ativos = termos.filter((x) => x.ativo);
    // os alvos passivos que têm de virar número: sem 'enquanto' (condicional) e sem escolha do jogador
    const esperados = new Set(passivos.filter((m) => !FORA_DO_NUMERO.test(m.alvo) && !m.enquanto && !m.escolha && m.op !== 'escolha').map((m) => m.alvo));
    linha.esperados = [...esperados];
    // cada alvo esperado vira ao menos um número com termo ativo do item (o nome do nó difere do alvo: saude.max -> recurso.saude.max)
    linha.faltam = Math.max(0, esperados.size - new Set(ativos.map((x) => x.no)).size);
    linha.verificado = {
      passivosAtivos: Math.min(passivos.length, new Set(ativos.map((x) => x.no)).size),
      termosAtivos: ativos.length,
      inativos: termos.filter((x) => !x.ativo).map((x) => x.no + ': ' + (x.motivo || '')).slice(0, 4),
      arma: linha.temArma ? Object.keys(r.nos).some((c) => /^ataque\.x1\./.test(c)) : null
    };
  }
  saida.push(linha);
}
return saida;
}

module.exports = { diagnosticar };
if (require.main === module) process.stdout.write(JSON.stringify(diagnosticar()));
