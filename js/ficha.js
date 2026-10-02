/* js/ficha.js — ARTEFATO gerado — não editar.
 * Fonte: js/ficha/*.js, concatenadas na ordem de js/ficha/ORDEM por
 * tools/ficha_js.py (o build grava; o validar [artefato-js] confere).
 */

// ==== js/ficha/00-regras-dados.js ====
/* js/ficha/00-regras-dados.js — ARTEFATO gerado por tools/gerar_regras_ficha.py — não editar.
 * Regras compiladas da ficha (F3b): contrato regras-ficha + blocos do site, como
 * DADO. Fórmulas em AST (sem eval), cada nó com status (st) e fonte (fo). O
 * KhRegras (kh-regras.js) avalia. No navegador vira window.KhRegrasDados; no
 * node, carregado sozinho, exporta por module.exports (no artefato js/ficha.js
 * o kh-inv.js sobrescreve o export, como antes).
 */
(function (raiz) {
  'use strict';
  var DADOS = {
    "atributos": {"faixaAbsoluta":[1,30],"lista":["FOR","DES","CON","INT","SAB"],"mod":{"ast":{"args":[{"a":{"a":{"fo":"contrato:atributos.modificador.formula","ref":"attr","st":"canonico","t":"ref"},"b":{"fo":"contrato:atributos.modificador.formula","st":"canonico","t":"num","v":10},"fo":"contrato:atributos.modificador.formula","op":"-","st":"canonico","t":"op"},"b":{"fo":"contrato:atributos.modificador.formula","st":"canonico","t":"num","v":2},"fo":"contrato:atributos.modificador.formula","op":"/","st":"canonico","t":"op"}],"fn":"floor","fo":"contrato:atributos.modificador.formula","st":"canonico","t":"fn"},"fo":"contrato:atributos.modificador","st":"canonico"},"nomes":{"CON":"Constituição","DES":"Destreza","FOR":"Força","INT":"Inteligência","SAB":"Sabedoria"},"porNivel":{"fo":"contrato:atributos.ganhoPorNivel","niveis":[2,3,4,5],"pontos":2,"st":"canonico"}},
    "classes": {"alquimista":{"G":6,"R":5,"V":4,"cd":{"ast":{"a":{"a":{"fo":"contrato:classes.alquimista.cd.formula","st":"canonico","t":"num","v":10},"b":{"fo":"contrato:classes.alquimista.cd.formula","ref":"mod.INT","st":"canonico","t":"ref"},"fo":"contrato:classes.alquimista.cd.formula","op":"+","st":"canonico","t":"op"},"b":{"fo":"contrato:classes.alquimista.cd.formula","ref":"mod.DES","st":"canonico","t":"ref"},"fo":"contrato:classes.alquimista.cd.formula","op":"+","st":"canonico","t":"op"},"fo":"contrato:classes.alquimista.cd","st":"canonico","texto":"10 + Mod. Inteligência + Mod. Destreza"},"fo":"data/classes/alquimista.json","id":"classe-alquimista","medidores":[{"fo":"contrato:classes.alquimista.recursos.0","id":"reagentes","max":{"a":{"a":{"fo":"contrato:classes.alquimista.recursos.0.max","ref":"nivel","st":"canonico","t":"ref"},"b":{"fo":"contrato:classes.alquimista.recursos.0.max","st":"canonico","t":"num","v":3},"fo":"contrato:classes.alquimista.recursos.0.max","op":"*","st":"canonico","t":"op"},"b":{"fo":"contrato:classes.alquimista.recursos.0.max","ref":"mod.INT","st":"canonico","t":"ref"},"fo":"contrato:classes.alquimista.recursos.0.max","op":"+","st":"canonico","t":"op"},"nome":"Reagentes","st":"canonico"}],"nome":"Alquimista","recursoDeClasse":null,"st":"canonico"},"artilheiro":{"G":7,"R":4,"V":4,"cd":{"ast":{"a":{"a":{"fo":"contrato:classes.artilheiro.cd.formula","st":"canonico","t":"num","v":10},"b":{"fo":"contrato:classes.artilheiro.cd.formula","ref":"mod.DES","st":"canonico","t":"ref"},"fo":"contrato:classes.artilheiro.cd.formula","op":"+","st":"canonico","t":"op"},"b":{"fo":"contrato:classes.artilheiro.cd.formula","ref":"mod.SAB","st":"canonico","t":"ref"},"fo":"contrato:classes.artilheiro.cd.formula","op":"+","st":"canonico","t":"op"},"fo":"contrato:classes.artilheiro.cd","st":"canonico","texto":"10 + Des + Sab"},"fo":"data/classes/artilheiro.json","id":"classe-artilheiro","medidores":[{"fo":"contrato:classes.artilheiro.recursos.0","id":"concentracao","max":{"a":{"fo":"contrato:classes.artilheiro.recursos.0.max","st":"canonico","t":"num","v":3},"b":{"fo":"contrato:classes.artilheiro.recursos.0.max","ref":"mod.SAB","st":"canonico","t":"ref"},"fo":"contrato:classes.artilheiro.recursos.0.max","op":"+","st":"canonico","t":"op"},"nome":"Concentracao","st":"canonico"}],"nome":"Artilheiro","recursoDeClasse":null,"st":"canonico"},"batedor":{"G":7,"R":4,"V":4,"cd":{"ast":{"a":{"a":{"fo":"contrato:classes.batedor.cd.formula","st":"canonico","t":"num","v":10},"b":{"fo":"contrato:classes.batedor.cd.formula","ref":"mod.DES","st":"canonico","t":"ref"},"fo":"contrato:classes.batedor.cd.formula","op":"+","st":"canonico","t":"op"},"b":{"fo":"contrato:classes.batedor.cd.formula","ref":"mod.SAB","st":"canonico","t":"ref"},"fo":"contrato:classes.batedor.cd.formula","op":"+","st":"canonico","t":"op"},"fo":"contrato:classes.batedor.cd","st":"canonico","texto":"10 + Mod. Destreza + Mod. Sabedoria"},"fo":"data/classes/batedor.json","id":"classe-batedor","medidores":[{"fo":"contrato:classes.batedor.recursos.0","id":"instinto","max":{"fo":"contrato:classes.batedor.recursos.0.max","st":"canonico-mas-em-rework","t":"num","v":5},"nome":"Instinto","st":"canonico-mas-em-rework"}],"nome":"Batedor","recursoDeClasse":null,"st":"canonico"},"brutalista":{"G":4,"R":3,"V":8,"cd":{"ast":{"a":{"a":{"fo":"contrato:classes.brutalista.cd.formula","st":"canonico","t":"num","v":10},"b":{"fo":"contrato:classes.brutalista.cd.formula","ref":"mod.FOR","st":"canonico","t":"ref"},"fo":"contrato:classes.brutalista.cd.formula","op":"+","st":"canonico","t":"op"},"b":{"fo":"contrato:classes.brutalista.cd.formula","ref":"mod.CON","st":"canonico","t":"ref"},"fo":"contrato:classes.brutalista.cd.formula","op":"+","st":"canonico","t":"op"},"fo":"contrato:classes.brutalista.cd","st":"canonico","texto":"10 + Força + Constituição"},"fo":"data/classes/brutalista.json","id":"classe-brutalista","medidores":[{"fo":"contrato:classes.brutalista.recursos.0","id":"brutalidade","max":{"fo":"contrato:classes.brutalista.recursos.0.max","st":"canonico","t":"num","v":5},"nome":"Brutalidade","st":"canonico"}],"nome":"Brutalista","recursoDeClasse":null,"st":"canonico"},"espadachim":{"G":6,"R":3,"V":6,"cd":{"ast":{"a":{"a":{"fo":"contrato:classes.espadachim.cd.formula","st":"canonico","t":"num","v":10},"b":{"args":[{"fo":"contrato:classes.espadachim.cd.formula","ref":"mod.DES","st":"canonico","t":"ref"},{"fo":"contrato:classes.espadachim.cd.formula","ref":"mod.FOR","st":"canonico","t":"ref"}],"fo":"contrato:classes.espadachim.cd.modoEscolha","modo":"maior","st":"aprovado","t":"esc"},"fo":"contrato:classes.espadachim.cd.formula","op":"+","st":"canonico","t":"op"},"b":{"fo":"contrato:classes.espadachim.cd.formula","ref":"mod.CON","st":"canonico","t":"ref"},"fo":"contrato:classes.espadachim.cd.formula","op":"+","st":"canonico","t":"op"},"fo":"contrato:classes.espadachim.cd","st":"canonico","texto":"10 + (Destreza ou Força) + Constituição"},"fo":"data/classes/espadachim.json","id":"classe-espadachim","medidores":[],"nome":"Espadachim","recursoDeClasse":{"contador":false,"fo":"contrato:classes.espadachim.recursoDeClasse","itens":["Proficiência com Espadas","Marca do Duelo"],"nota":"Não é contador: a ficha não mostra contador livre. A Marca do Duelo já está em estados.","pergunta":null,"st":"canonico","tipo":"caracteristicas"},"st":"canonico"},"monge":{"G":5,"R":5,"V":5,"cd":{"ast":{"a":{"a":{"fo":"contrato:classes.monge.cd.formula","st":"canonico","t":"num","v":10},"b":{"fo":"contrato:classes.monge.cd.formula","ref":"mod.DES","st":"canonico","t":"ref"},"fo":"contrato:classes.monge.cd.formula","op":"+","st":"canonico","t":"op"},"b":{"fo":"contrato:classes.monge.cd.formula","ref":"mod.SAB","st":"canonico","t":"ref"},"fo":"contrato:classes.monge.cd.formula","op":"+","st":"canonico","t":"op"},"fo":"contrato:classes.monge.cd","st":"canonico","texto":"10 + Mod. Destreza + Mod. Sabedoria"},"fo":"data/classes/monge.json","id":"classe-monge","medidores":[{"fo":"contrato:classes.monge.recursos.0","id":"fluxo","max":{"fo":"contrato:classes.monge.recursos.0.max","st":"canonico","t":"num","v":5},"nome":"Fluxo","st":"canonico"}],"nome":"Monge","recursoDeClasse":null,"st":"canonico"},"teurgo":{"G":3,"R":9,"V":3,"cd":{"ast":{"a":{"a":{"fo":"contrato:classes.teurgo.cd.formula","st":"canonico","t":"num","v":10},"b":{"fo":"contrato:classes.teurgo.cd.formula","ref":"mod.INT","st":"canonico","t":"ref"},"fo":"contrato:classes.teurgo.cd.formula","op":"+","st":"canonico","t":"op"},"b":{"fo":"contrato:classes.teurgo.cd.formula","ref":"mod.SAB","st":"canonico","t":"ref"},"fo":"contrato:classes.teurgo.cd.formula","op":"+","st":"canonico","t":"op"},"fo":"contrato:classes.teurgo.cd","st":"canonico","texto":"10 + Mod. Inteligência + Mod. Sabedoria"},"fo":"data/classes/teurgo.json","id":"classe-teurgo","medidores":[],"nome":"Teurgo","recursoDeClasse":{"contador":false,"fo":"contrato:classes.teurgo.recursoDeClasse","itens":["Escolas do Primórdio"],"nota":"2 escolas no nível 1, +1 no 3, +2 no 5 (Primordial exige nível 5); cada escola pede o Foco dela. O contador é o Éter.","pergunta":null,"st":"canonico","tipo":"caracteristicas"},"st":"canonico"}},
    "condicoes": {"adormecido":{"efeitos":[],"fo":"contrato:condicoes.adormecido","id":"adormecido","implica":[{"id":"exposto","modo":"separada"},{"id":"inconsciente","modo":"derivada"}],"nome":"Adormecido","st":"semStatus","tags":["mental"]},"agarrado":{"efeitos":[{"alvo":"atacarContraOAlvo","fo":"contrato:condicoes.agarrado.efeitos.0","op":"soma","st":"canonico","valor":2},{"alvo":"pericia.atacar","fo":"contrato:condicoes.agarrado.efeitos.1","op":"soma","st":"canonico","valor":-2}],"fo":"contrato:condicoes.agarrado","id":"agarrado","implica":[{"id":"enraizado","modo":"derivada"}],"nome":"Agarrado","st":"canonico","tags":["fisica"]},"amedrontado":{"efeitos":[{"alvo":"turno","fo":"contrato:condicoes.amedrontado.efeitos.0","op":"lembrete","st":"semStatus","valor":"gasta o turno fugindo da fonte"}],"fo":"contrato:condicoes.amedrontado","id":"amedrontado","nome":"Amedrontado","st":"semStatus","tags":["mental"]},"atordoado":{"efeitos":[{"alvo":"acoes","fo":"contrato:condicoes.atordoado.efeitos.0","op":"soma","st":"canonico","valor":-2},{"alvo":"evasao.passiva","fo":"contrato:condicoes.atordoado.efeitos.1","op":"soma","st":"canonico","valor":-2}],"fo":"contrato:condicoes.atordoado","id":"atordoado","nome":"Atordoado","st":"canonico","tags":["fisica","mental"]},"bebado":{"efeitos":[{"alvo":"faixaDeFalhaCritica","fo":"contrato:condicoes.bebado.efeitos.0","op":"fixa","st":"canonico","valor":"2 natural conta como falha critica"},{"alvo":"pericia.atacar","fo":"contrato:condicoes.bebado.efeitos.1","op":"soma","st":"canonico","valor":-2},{"alvo":"pericia.defender","fo":"contrato:condicoes.bebado.efeitos.2","op":"soma","st":"canonico","valor":-2},{"alvo":"pericia.movimento","fo":"contrato:condicoes.bebado.efeitos.3","op":"soma","st":"canonico","valor":-2},{"alvo":"pericia.reflexos","fo":"contrato:condicoes.bebado.efeitos.4","op":"soma","st":"canonico","valor":-2},{"alvo":"pericia.fortitude","fo":"contrato:condicoes.bebado.efeitos.5","op":"soma","st":"canonico","valor":-2},{"alvo":"pericia.vontade","fo":"contrato:condicoes.bebado.efeitos.6","op":"soma","st":"canonico","valor":-2}],"fo":"contrato:condicoes.bebado","id":"bebado","nome":"Bêbado","st":"canonico","tags":["fisica"]},"caido":{"efeitos":[{"alvo":"movimento","fo":"contrato:condicoes.caido.efeitos.0","op":"fixa","st":"semStatus","valor":1.5},{"alvo":"retaliar","fo":"contrato:condicoes.caido.efeitos.1","op":"semReacao","st":"semStatus"},{"alvo":"pericia.defender","fo":"contrato:condicoes.caido.efeitos.2","op":"soma","st":"semStatus","valor":-2}],"fo":"contrato:condicoes.caido","id":"caido","nome":"Caído","st":"semStatus","tags":["fisica"]},"cego":{"efeitos":[{"alvo":"pericia.percepcao","fo":"contrato:condicoes.cego.efeitos.0","op":"soma","st":"semStatus","valor":-5},{"alvo":"pericia.atacar","fo":"contrato:condicoes.cego.efeitos.1","op":"desvantagem","st":"semStatus"},{"alvo":"testesVisuais","fo":"contrato:condicoes.cego.efeitos.2","op":"falhaAuto","st":"semStatus"}],"fo":"contrato:condicoes.cego","id":"cego","nome":"Cego","st":"semStatus","tags":[]},"confuso":{"efeitos":[{"alvo":"acoes","fo":"contrato:condicoes.confuso.efeitos.0","op":"soma","st":"canonico","valor":-1}],"fo":"contrato:condicoes.confuso","id":"confuso","nome":"Confuso","st":"canonico","tags":["mental"]},"descontrolado":{"efeitos":[{"alvo":"turno","fo":"contrato:condicoes.descontrolado.efeitos.0","op":"lembrete","st":"semStatus","valor":"gasta o turno atacando a criatura mais proxima"}],"fo":"contrato:condicoes.descontrolado","id":"descontrolado","nome":"Descontrolado X","st":"semStatus","tags":["mental"],"x":{"inicial":"daFonte","tipo":"duracao"}},"desnutrido":{"efeitos":[{"alvo":"tag.fisica","fo":"contrato:condicoes.desnutrido.efeitos.0","op":"desvantagem","st":"canonico"},{"alvo":"custo.stamina","fo":"contrato:condicoes.desnutrido.efeitos.1","op":"multiplica","st":"canonico","valor":2},{"alvo":"recurso.saude.max","fo":"contrato:condicoes.desnutrido.efeitos.2","op":"soma","st":"canonico","valor":{"a":{"a":{"fo":"contrato:condicoes.desnutrido.efeitos.2","st":"canonico","t":"num","v":10},"fo":"contrato:condicoes.desnutrido.efeitos.2","st":"canonico","t":"neg"},"b":{"fo":"contrato:condicoes.desnutrido.efeitos.2","ref":"X","st":"canonico","t":"ref"},"fo":"contrato:condicoes.desnutrido.efeitos.2","op":"*","st":"canonico","t":"op"}}],"fo":"contrato:condicoes.desnutrido","id":"desnutrido","nome":"Desnutrido X","st":"canonico","tags":["fisica"],"x":{"inicial":1,"tipo":"intensidade"}},"desorientado":{"efeitos":[{"alvo":"pericia.atacar","fo":"contrato:condicoes.desorientado.efeitos.0","op":"soma","st":"canonico","valor":-2},{"alvo":"pericia.defender","fo":"contrato:condicoes.desorientado.efeitos.1","op":"soma","st":"canonico","valor":-2}],"fo":"contrato:condicoes.desorientado","id":"desorientado","nome":"Desorientado","st":"canonico","tags":["fisica"]},"desprevenido":{"efeitos":[{"alvo":"reagirAAtaques","fo":"contrato:condicoes.desprevenido.efeitos.0","op":"semReacao","st":"canonico"}],"fo":"contrato:condicoes.desprevenido","id":"desprevenido","implica":[{"id":"exposto","modo":"separada"}],"nome":"Desprevenido","st":"canonico","tags":[]},"em-chamas":{"efeitos":[{"alvo":"danoPorRodada","fo":"contrato:condicoes.em-chamas.efeitos.0","momento":"inicioTurnoAfetado","op":"soma","st":"canonico","tipoDano":"fogo","valor":{"faces":6,"fo":"contrato:condicoes.em-chamas.efeitos.0","n":1,"st":"canonico","t":"rolagem"}}],"fo":"contrato:condicoes.em-chamas","id":"em-chamas","nome":"Em Chamas","st":"canonico","tags":[]},"enfeiticado":{"efeitos":[{"alvo":"atacarQuemEnfeiticou","fo":"contrato:condicoes.enfeiticado.efeitos.0","op":"semAcao","st":"semStatus"},{"alvo":"tag.social","escopo":"contra quem enfeiticou","fo":"contrato:condicoes.enfeiticado.efeitos.1","op":"soma","st":"semStatus","valor":-5}],"fo":"contrato:condicoes.enfeiticado","id":"enfeiticado","nome":"Enfeitiçado","st":"semStatus","tags":["mental"]},"enjoado":{"efeitos":[{"alvo":"pericia.fortitude","fo":"contrato:condicoes.enjoado.efeitos.0","op":"soma","st":"semStatus","valor":-5},{"alvo":"evasao.passiva","fo":"contrato:condicoes.enjoado.efeitos.1","op":"soma","st":"semStatus","valor":-2}],"fo":"contrato:condicoes.enjoado","id":"enjoado","nome":"Enjoado","st":"semStatus","tags":["fisica"]},"enraizado":{"efeitos":[{"alvo":"movimento","fo":"contrato:condicoes.enraizado.efeitos.0","op":"fixa","st":"semStatus","valor":0}],"fo":"contrato:condicoes.enraizado","id":"enraizado","nome":"Enraizado","st":"semStatus","tags":["fisica"]},"envenenamento":{"efeitos":[{"alvo":"tag.fisica","fo":"contrato:condicoes.envenenamento.efeitos.0","op":"soma","st":"canonico","valor":-2},{"alvo":"danoPorRodada","fo":"contrato:condicoes.envenenamento.efeitos.1","momento":"inicioTurnoAfetado","op":"soma","st":"canonico","tipoDano":"biologico","valor":{"faces":6,"fo":"contrato:condicoes.envenenamento.efeitos.1","n":1,"st":"canonico","t":"rolagem"}}],"fo":"contrato:condicoes.envenenamento","id":"envenenamento","nome":"Envenenamento","st":"canonico","tags":["fisica"]},"exaurido":{"efeitos":[{"alvo":"todasAsPericias","fo":"contrato:condicoes.exaurido.efeitos.0","nota":"nao pode rolar pericias","op":"semAcao","st":"canonico"}],"entra":"recurso.stamina.atual <= 0","fo":"contrato:condicoes.exaurido","id":"exaurido","nome":"Exaurido","st":"canonico","tags":[]},"exaustao":{"cumulativa":true,"efeitos":[],"fo":"contrato:condicoes.exaustao","id":"exaustao","niveis":{"1":[{"alvo":"tag.fisica","fo":"contrato:condicoes.exaustao.niveis.1.0","op":"desvantagem","st":"canonico"}],"2":[{"alvo":"danoCausado","fo":"contrato:condicoes.exaustao.niveis.2.0","nota":"no dano FINAL, depois de dados e modificadores, com floor","op":"multiplica","st":"canonico","valor":0.5}],"3":[{"alvo":"todosOsTestes","fo":"contrato:condicoes.exaustao.niveis.3.0","op":"desvantagem","st":"canonico"},{"alvo":"movimento","fo":"contrato:condicoes.exaustao.niveis.3.1","op":"multiplica","st":"canonico","valor":0.5}],"4":[{"alvo":"atributos","fo":"contrato:condicoes.exaustao.niveis.4.0","op":"multiplica","st":"canonico","valor":0.5},{"alvo":"movimento","fo":"contrato:condicoes.exaustao.niveis.4.1","op":"fixa","st":"canonico","valor":0}],"5":[{"alvo":"estado","fo":"contrato:condicoes.exaustao.niveis.5.0","op":"fixa","st":"canonico","valor":"morte"}]},"nome":"Exaustão 1-5","st":"canonico","tags":[],"x":{"inicial":1,"max":5,"tipo":"nivel"}},"exposto":{"efeitos":[{"alvo":"proximoAtaqueQueAcertar","fo":"contrato:condicoes.exposto.efeitos.0","op":"fixa","st":"aprovado","valor":"critico"}],"fo":"contrato:condicoes.exposto","id":"exposto","nome":"Exposto","st":"aprovado","tags":[]},"inconsciente":{"efeitos":[{"alvo":"controle","fo":"contrato:condicoes.inconsciente.efeitos.0","op":"semAcao","st":"semStatus"},{"alvo":"tag.resistencia","fo":"contrato:condicoes.inconsciente.efeitos.1","op":"falhaAuto","st":"semStatus"}],"fo":"contrato:condicoes.inconsciente","id":"inconsciente","nome":"Inconsciente","st":"semStatus","tags":["mental"]},"invisivel":{"efeitos":[{"alvo":"pericia.furtividade","fo":"contrato:condicoes.invisivel.efeitos.0","op":"fixa","st":"semStatus","valor":"sucessoAutomatico"},{"alvo":"pericia.defender","fo":"contrato:condicoes.invisivel.efeitos.1","op":"soma","st":"semStatus","valor":5},{"alvo":"pericia.atacar","fo":"contrato:condicoes.invisivel.efeitos.2","op":"soma","st":"semStatus","valor":5}],"fo":"contrato:condicoes.invisivel","id":"invisivel","nome":"Invisível","st":"semStatus","tags":[]},"lento":{"efeitos":[{"alvo":"movimento","fo":"contrato:condicoes.lento.efeitos.0","op":"soma","st":"canonico","valor":{"a":{"a":{"fo":"contrato:condicoes.lento.efeitos.0","st":"canonico","t":"num","v":3},"fo":"contrato:condicoes.lento.efeitos.0","st":"canonico","t":"neg"},"b":{"fo":"contrato:condicoes.lento.efeitos.0","ref":"X","st":"canonico","t":"ref"},"fo":"contrato:condicoes.lento.efeitos.0","op":"*","st":"canonico","t":"op"}},{"alvo":"acoes","fo":"contrato:condicoes.lento.efeitos.1","op":"soma","st":"canonico","valor":{"a":{"a":{"fo":"contrato:condicoes.lento.efeitos.1","st":"canonico","t":"num","v":1},"fo":"contrato:condicoes.lento.efeitos.1","st":"canonico","t":"neg"},"b":{"fo":"contrato:condicoes.lento.efeitos.1","ref":"X","st":"canonico","t":"ref"},"fo":"contrato:condicoes.lento.efeitos.1","op":"*","st":"canonico","t":"op"}}],"fo":"contrato:condicoes.lento","id":"lento","nome":"Lento X","st":"canonico","tags":["fisica"],"x":{"inicial":"daFonte","inicialPadrao":1,"stPadrao":"decisao","tipo":"intensidade"}},"morrendo":{"efeitos":[{"alvo":"danoPorRodada","fo":"contrato:condicoes.morrendo.efeitos.0","mitigavel":false,"momento":"inicioTurnoAfetado","op":"soma","st":"canonico","tipoDano":"biologico","valor":{"args":[{"a":{"fo":"contrato:condicoes.morrendo.efeitos.0","ref":"recurso.saude.max","st":"canonico","t":"ref"},"b":{"fo":"contrato:condicoes.morrendo.efeitos.0","st":"canonico","t":"num","v":0.1},"fo":"contrato:condicoes.morrendo.efeitos.0","op":"*","st":"canonico","t":"op"}],"fn":"floor","fo":"contrato:condicoes.morrendo.efeitos.0","st":"canonico","t":"fn"}}],"entra":"recurso.saude.atual <= 0","fo":"contrato:condicoes.morrendo","id":"morrendo","implica":[{"id":"inconsciente","modo":"derivada"}],"nome":"Morrendo","st":"canonico","tags":[]},"oco":{"efeitos":[{"alvo":"recurso.eter","fo":"contrato:condicoes.oco.efeitos.0","gatilho":"aoFalharPericia","op":"soma","st":"canonico","valor":-5},{"alvo":"conjurar","fo":"contrato:condicoes.oco.efeitos.1","op":"semAcao","st":"canonico"}],"entra":"recurso.eter.atual <= 0","fo":"contrato:condicoes.oco","id":"oco","nome":"Oco","st":"canonico","tags":[]},"paralisado":{"efeitos":[{"alvo":"acoes","fo":"contrato:condicoes.paralisado.efeitos.0","op":"semAcao","st":"semStatus"},{"alvo":"reacoes","fo":"contrato:condicoes.paralisado.efeitos.1","op":"semReacao","st":"semStatus"},{"alvo":"tag.resistencia","fo":"contrato:condicoes.paralisado.efeitos.2","op":"falhaAuto","st":"semStatus"}],"fo":"contrato:condicoes.paralisado","id":"paralisado","implica":[{"id":"exposto","modo":"separada"}],"nome":"Paralisado","st":"semStatus","tags":["fisica"]},"sangramento":{"efeitos":[{"alvo":"danoRecebidoPorAcerto","escalaComX":true,"fo":"contrato:condicoes.sangramento.efeitos.0","op":"soma","st":"canonico","tipoDano":"biologico","valor":{"faces":4,"fo":"contrato:condicoes.sangramento.efeitos.0","n":"X","st":"canonico","t":"rolagem"}}],"fo":"contrato:condicoes.sangramento","id":"sangramento","nome":"Sangramento X","st":"canonico","tags":["fisica"],"x":{"inicial":1,"tipo":"pilha"}},"sobrepeso-extremo":{"efeitos":[{"alvo":"movimento","fo":"contrato:condicoes.sobrepeso-extremo.efeitos.0","op":"fixa","st":"canonico","valor":1.5},{"alvo":"tag.fisica","fo":"contrato:condicoes.sobrepeso-extremo.efeitos.1","op":"desvantagem","st":"canonico"}],"entra":"uso >= 2*capacidade","fo":"contrato:condicoes.sobrepeso-extremo","id":"sobrepeso-extremo","nome":"Sobrepeso Extremo","st":"canonico","tags":["fisica"]},"sobrepeso-leve":{"efeitos":[{"alvo":"movimento","fo":"contrato:condicoes.sobrepeso-leve.efeitos.0","op":"multiplica","st":"canonico","valor":0.5},{"alvo":"tag.fisica","fo":"contrato:condicoes.sobrepeso-leve.efeitos.1","op":"soma","st":"canonico","valor":-2}],"entra":"uso > capacidade && uso < 2*capacidade","fo":"contrato:condicoes.sobrepeso-leve","id":"sobrepeso-leve","nome":"Sobrepeso Leve","st":"canonico","tags":["fisica"]},"surdo":{"efeitos":[{"alvo":"pericia.percepcao","fo":"contrato:condicoes.surdo.efeitos.0","op":"soma","st":"semStatus","valor":-2},{"alvo":"testesAuditivos","fo":"contrato:condicoes.surdo.efeitos.1","op":"falhaAuto","st":"semStatus"}],"fo":"contrato:condicoes.surdo","id":"surdo","nome":"Surdo","st":"semStatus","tags":[]}},
    "contrato": {"rev":"2026-09-28 (rev. 10","schemaVersion":"regras-ficha/1.1"},
    "defesa": {"aeCategoria":{"fo":"contrato:derivados.armadura.aeCategoria","st":"canonico"},"aeMesmoTipo":{"fo":"contrato:derivados.armadura.aeMesmoTipo","modo":"soma","st":"canonico"},"aeTodos":{"cobre":["fogo","frio","eletrico","veneno","acido","psiquico","radiante","trovejante","necrotico"],"fo":"contrato:derivados.armadura.aeTodos","st":"canonico"},"arNatural":{"acumula":"soma","fo":"contrato:derivados.armadura.acumulaNatural","st":"canonico"},"categorias":{"biologico":["veneno","acido","psiquico"],"elemental":["fogo","frio","eletrico"],"mistico":["radiante","trovejante","necrotico"],"ordinario":["cortante","contundente","perfurante"],"outros":["forca","primordial"]},"categoriasFo":"contrato:dano.categorias","totalDeTipos":14},
    "derivados": {"cd":{"fo":"contrato:derivados.cd","st":"canonico"},"evasao":{"ativa":{"ast":{"a":{"fo":"contrato:derivados.evasao.ativa","ref":"evasao.passiva","st":"canonico","t":"ref"},"b":{"fo":"contrato:derivados.evasao.ativa","pericia":"defender","st":"canonico","t":"dado"},"fo":"contrato:derivados.evasao.ativa","op":"+","st":"canonico","t":"op"},"dadoSomaAtributo":false,"fo":"contrato:derivados.evasao.ativa","st":"canonico"},"passiva":{"ast":{"a":{"fo":"contrato:derivados.evasao.passiva","st":"canonico","t":"num","v":10},"b":{"fo":"contrato:derivados.evasao.passiva","ref":"mod.DES","st":"canonico","t":"ref"},"fo":"contrato:derivados.evasao.passiva","op":"+","st":"canonico","t":"op"},"fo":"contrato:derivados.evasao.passiva","st":"canonico"},"porArmadura":0},"inventario":{"bugigangas":{"args":[{"fo":"contrato:derivados.inventario.bugigangas","st":"canonico","t":"num","v":1},{"a":{"fo":"contrato:derivados.inventario.bugigangas","st":"canonico","t":"num","v":10},"b":{"fo":"contrato:derivados.inventario.bugigangas","ref":"mod.FOR","st":"canonico","t":"ref"},"fo":"contrato:derivados.inventario.bugigangas","op":"+","st":"canonico","t":"op"}],"fn":"max","fo":"contrato:derivados.inventario.bugigangas","st":"canonico","t":"fn"},"equipamentos":{"args":[{"fo":"contrato:derivados.inventario.equipamentos","st":"canonico","t":"num","v":1},{"a":{"fo":"contrato:derivados.inventario.equipamentos","st":"canonico","t":"num","v":2},"b":{"fo":"contrato:derivados.inventario.equipamentos","ref":"mod.FOR","st":"canonico","t":"ref"},"fo":"contrato:derivados.inventario.equipamentos","op":"+","st":"canonico","t":"op"}],"fn":"max","fo":"contrato:derivados.inventario.equipamentos","st":"canonico","t":"fn"},"fo":"contrato:derivados.inventario","sobrepeso":{"extremo":"u >= 2m","leve":"m < u < 2m","ok":"u <= m","valeAPiorColuna":true},"st":"canonico"},"movimento":{"basePorRaca":{"anao":7.5,"automato":9,"corrompido":9,"dryad":10.5,"gruto":9,"humano":9,"inseto":{"barata":10.5,"besouro":7.5,"louva-a-deus":9}},"entreFixosVence":"menor","fo":"contrato:derivados.movimento","ordem":["base","somas","multiplicacoes","fixos","piso","arredonda"],"passo":1.5,"piso":0,"st":"canonico"},"progressao":{"fo":"contrato:derivados.progressaoDeAtaques","modsSt":"canonicoParcial","st":"aprovado"}},
    "duplicadosDeCondicao": ["contrato:derivados.evasao.modificadores.7","contrato:derivados.evasao.modificadores.8","contrato:derivados.movimento.fixos.0","contrato:derivados.movimento.fixos.1","contrato:derivados.movimento.fixos.2","contrato:derivados.movimento.fixos.3","contrato:derivados.movimento.multiplicacoes.0","contrato:derivados.movimento.multiplicacoes.1","contrato:derivados.movimento.somas.6"],
    "empilhamento": {"entreCondicoes":"soma","fo":"contrato:empilhamento","mesmaCondicao":"renovaDuracao","mesmaCondicaoComX":"somaX","st":"canonico"},
    "fontes": {"abismo-esquiva-lendaria":[{"alvo":"evasao.passiva","extra":"+1 Reacao Maxima","fo":"contrato:derivados.evasao.modificadores.3","fonte":"abismo-esquiva-lendaria","op":"soma","st":"semStatus","valor":5}],"abismo-lenda-viva":[{"alvo":"acoes","fo":"contrato:derivados.progressaoDeAtaques.nRecalculaCom.3","fonte":"abismo-lenda-viva","op":"soma","st":"aprovado","valor":1}],"abismo-obvio":[{"alvo":"evasao.passiva","fo":"contrato:derivados.evasao.modificadores.4","fonte":"abismo-obvio","op":"soma","st":"semStatus","valor":-5}],"abismo-sem-membro":[{"alvo":"movimento","fo":"contrato:derivados.movimento.multiplicacoes.2","fonte":"abismo-sem-membro","op":"multiplica","st":"canonico","valor":0.5}],"artilheiro-maos-velozes":[{"alvo":"pma","condicao":"armas de arremesso","custo":"passiva (Vendaval T1)","fo":"contrato:derivados.progressaoDeAtaques.modificadoresConhecidos.2","fonte":"artilheiro-maos-velozes","op":"fixa","st":"aprovado","valor":-2}],"artilheiro-rajada-de-tiros":[{"alvo":"pma","custo":"Atacar(n) da arma de fogo (D101; 2 ações com as armas de fogo do Bazar), 3 Stamina","escopo":"2 ataques da tecnica","fo":"contrato:derivados.progressaoDeAtaques.modificadoresConhecidos.4","fonte":"artilheiro-rajada-de-tiros","op":"fixa","st":"aprovado","valor":0}],"artilheiro-tiro-duplo":[{"alvo":"pma","custo":"1 Acao, 3 Stamina, 2 Concentracao","escopo":"proximo ataque","fo":"contrato:derivados.progressaoDeAtaques.modificadoresConhecidos.3","fonte":"artilheiro-tiro-duplo","op":"fixa","st":"aprovado","valor":0}],"artilheiro-vendaval-de-aco":[{"alvo":"pma","custo":"2 Acoes, 5 Stamina","escopo":"3 ataques da tecnica","fo":"contrato:derivados.progressaoDeAtaques.modificadoresConhecidos.5","fonte":"artilheiro-vendaval-de-aco","op":"fixa","st":"aprovado","valor":0}],"automato-fibra-de-carbono":[{"alvo":"evasao.passiva","fo":"contrato:derivados.evasao.modificadores.1","fonte":"automato-fibra-de-carbono","op":"soma","st":"semStatus","valor":1}],"automato-suspensoes-lubrificadas":[{"alvo":"movimento","fo":"contrato:derivados.movimento.somas.1","fonte":"automato-suspensoes-lubrificadas","op":"soma","st":"canonico","valor":3}],"batedor-maos-rapidas":[{"alvo":"pma","custo":"2 Stamina, Reacao","escopo":"turno","fo":"contrato:derivados.progressaoDeAtaques.modificadoresConhecidos.0","fonte":"batedor-maos-rapidas","op":"soma","st":"aprovado","valor":2}],"corrompido-premonicao-eterica":[{"alvo":"evasao.passiva","dadoDefenderMinimo":"2d6","extra":"dado de Defender = 2d6 quando o dado do seu grau for menor (Leigo a Mestre); o Lendário mantém 2d8","fo":"contrato:derivados.evasao.modificadores.9","fonte":"corrompido-premonicao-eterica","op":"soma","st":"decisao","valor":1}],"dryad-cascaferro":[{"alvo":"evasao.passiva","fo":"contrato:derivados.evasao.modificadores.0","fonte":"dryad-cascaferro","op":"soma","st":"semStatus","valor":1}],"espadachim-oportunista":[{"alvo":"pma","custo":"5 Stamina, acao livre","escopo":"rodada","fo":"contrato:derivados.progressaoDeAtaques.modificadoresConhecidos.1","fonte":"espadachim-oportunista","op":"fixa","st":"aprovado","valor":-3}],"gruto-skal-ri":[{"alvo":"movimento","fo":"contrato:derivados.movimento.somas.0","fonte":"gruto-skal-ri","op":"soma","st":"canonico","valor":1.5}],"inseto-louva-a-deus":[{"alvo":"pma","escopo":"1 ataque 1d6, 1x/combate","fo":"contrato:derivados.progressaoDeAtaques.modificadoresConhecidos.7","fonte":"inseto-louva-a-deus","op":"fixa","st":"aprovado","valor":0}],"limiar-contra-magica-instintiva":[{"alvo":"cd","fo":"contrato:derivados.cd.modificadores.0","fonte":"limiar-contra-magica-instintiva","op":"soma","st":"canonico","valor":1}],"limiar-estudo-intenso":[{"alvo":"cd","fo":"contrato:derivados.cd.modificadores.1","fonte":"limiar-estudo-intenso","op":"soma","st":"canonico","valor":2}],"limiar-passos-do-vento":[{"alvo":"movimento","fo":"contrato:derivados.movimento.somas.4","fonte":"limiar-passos-do-vento","op":"soma","st":"canonico","valor":3}],"limiar-pernas-incansaveis":[{"alvo":"movimento","fo":"contrato:derivados.movimento.somas.3","fonte":"limiar-pernas-incansaveis","op":"soma","st":"canonico","valor":3}],"limiar-sombra-dancante":[{"alvo":"evasao.passiva","fo":"contrato:derivados.evasao.modificadores.2","fonte":"limiar-sombra-dancante","op":"soma","st":"semStatus","valor":1}],"magia-pressagio":[{"alvo":"pma","custo":"acao livre; se acertar, perde Eter = n de dados da arma (D70)","escopo":"proxima rolagem de Atacar no turno","fo":"contrato:derivados.progressaoDeAtaques.modificadoresConhecidos.6","fonte":"magia-pressagio","op":"fixa","st":"aprovado","valor":0}],"monge-evasivo":[{"alvo":"evasao.passiva","fo":"contrato:derivados.evasao.modificadores.5","fonte":"monge-evasivo","op":"soma","st":"semStatus","valor":"fluxo"}],"monge-explosao":[{"alvo":"movimento","fo":"contrato:derivados.movimento.multiplicacoes.3","fonte":"monge-explosao","op":"multiplica","st":"canonico","valor":2}]},
    "graus": {"bonus":[0,2,4,6,8],"fo":"contrato:proficiencia","rotulos":["Leigo","Treinado","Experiente","Mestre","Lendario"],"st":"canonico"},
    "limiar": {"custoPorPosicao":[0,2,3,4,5],"especial":2,"fo":"contrato:progressao.limiar","niveis":[2,3,4,5],"pontosPorNivel":4,"st":"canonico"},
    "magia": {"custoBase":[0,2,4,6,8],"custoMinimo":{"excecoes":["nivel1-normal-sem-modulacao","magias-pactuadas-contida"],"fo":"contrato:magia.custoMinimo","st":"canonico","valor":1},"fo":"contrato:magia","focoPrimordial":{"nivel":5,"requisito":"Experiente em Mistico"},"intensidade":{"contida":-2,"forcada":2,"normal":0,"transbordante":4},"modulacaoEmTruquePrecoCheio":true,"modulacoes":{"abjuracao":{"acelerar":5,"ancorar":2,"refletir":3,"socializar":4},"alteracao":{"alcancar":3,"contagiar":3,"insistir":5,"inversao":2},"conhecimento":{"compartilhar":1,"exigir":2,"gravar":3,"projetar":2},"destruicao":{"alterar":3,"carregar":3,"fragmentar":3,"marcar":5}},"multiplicadores":[{"alvo":"stamina","fator":2,"fo":"contrato:multiplicadoresGlobaisDeCusto.fontes.0","fonte":"condicao:desnutrido","st":"canonico"},{"alvo":"eter","fator":2,"fo":"contrato:multiplicadoresGlobaisDeCusto.fontes.1","fonte":"abismo-mente-fraca","st":"canonico"}],"nivel1SemContida":true,"ordem":["contida","normal","forcada","transbordante"],"ordemCusto":["base por nivel","+ intensidade","+ soma das modulacoes","* multiplicadores","- descontos fixos","PISO = 1"],"porId":{"magia-absorver-contusao":{"escola":"alteracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":4},"magia-acme":{"escola":"alteracao","intensidades":["transbordante"],"nivel":5},"magia-alarme":{"escola":"conhecimento","intensidades":["contida","normal","forcada","transbordante"],"nivel":2},"magia-anteparo-eterico":{"escola":"abjuracao","intensidades":["normal","forcada","transbordante"],"nivel":1},"magia-apoteose-genetica":{"escola":"alteracao","intensidades":["transbordante"],"nivel":5},"magia-aprendiz-caotico":{"escola":"alteracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":5},"magia-armadura-de-espinhos":{"escola":"abjuracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":4},"magia-armadura-de-kha":{"escola":"abjuracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":5},"magia-armadura-do-oblivio":{"escola":"abjuracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":2},"magia-aumentar-diminuir-criatura":{"escola":"abjuracao","intensidades":["normal"],"nivel":3},"magia-barreira-de-energia":{"escola":"abjuracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":3},"magia-caco-esquecido":{"escola":"conhecimento","intensidades":["contida","normal","forcada","transbordante"],"nivel":4},"magia-caveiras-explosivas":{"escola":"destruicao","intensidades":["contida","normal","forcada","transbordante"],"nivel":3},"magia-centelha":{"escola":"destruicao","intensidades":["normal","forcada","transbordante"],"nivel":1},"magia-cometa-do-martir":{"escola":"destruicao","intensidades":["transbordante"],"nivel":5},"magia-confissao-do-eter":{"escola":"conhecimento","intensidades":["transbordante"],"nivel":4},"magia-confundir-sentidos":{"escola":"alteracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":3},"magia-contramedida":{"escola":"abjuracao","intensidades":["normal","forcada","transbordante"],"nivel":4},"magia-dadiva-de-kha":{"escola":"conhecimento","intensidades":["transbordante"],"nivel":5},"magia-dardo-arcano":{"escola":"destruicao","intensidades":["contida","normal","forcada","transbordante"],"nivel":2},"magia-dedo-mistico":{"escola":"alteracao","intensidades":["normal","forcada","transbordante"],"nivel":1},"magia-detectar-magia":{"escola":"conhecimento","intensidades":["contida","normal","forcada","transbordante"],"nivel":2},"magia-disfarce-ilusorio":{"escola":"alteracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":2},"magia-disparo-veloz":{"escola":"destruicao","intensidades":["normal"],"nivel":4},"magia-dissipar-magia":{"escola":"abjuracao","intensidades":["normal"],"nivel":3},"magia-eco-do-apocalipse":{"escola":"destruicao","intensidades":["contida","normal","forcada","transbordante"],"nivel":5},"magia-emprestimo-natural":{"escola":"conhecimento","intensidades":["contida","normal","forcada","transbordante"],"nivel":3},"magia-enraizar":{"escola":"alteracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":3},"magia-entender-ser":{"escola":"conhecimento","intensidades":["normal"],"nivel":2},"magia-escudo-telecinetico":{"escola":"abjuracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":2},"magia-estimulante-mistico":{"escola":"alteracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":2},"magia-exilio-existencial":{"escola":"abjuracao","intensidades":["transbordante"],"nivel":5},"magia-fagulha":{"escola":"destruicao","intensidades":["normal","forcada","transbordante"],"nivel":1},"magia-farejar-elemento":{"escola":"conhecimento","intensidades":["normal","forcada","transbordante"],"nivel":1},"magia-fissura-da-alma":{"escola":"destruicao","intensidades":["transbordante"],"nivel":5},"magia-fragmento-estelar":{"escola":"destruicao","intensidades":["contida","normal","forcada","transbordante"],"nivel":4},"magia-fusao-de-corpos":{"escola":"alteracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":5},"magia-historia-do-eter":{"escola":"conhecimento","intensidades":["contida","normal","forcada","transbordante"],"nivel":3},"magia-impulso-instintivo":{"escola":"conhecimento","intensidades":["normal"],"nivel":3},"magia-incinerar-area":{"escola":"destruicao","intensidades":["contida","normal","forcada","transbordante"],"nivel":2},"magia-invocar-tempestade":{"escola":"destruicao","intensidades":["contida","normal","forcada","transbordante"],"nivel":3},"magia-julgamento-de-kha":{"escola":"alteracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":5},"magia-labia":{"escola":"alteracao","intensidades":["normal","forcada","transbordante"],"nivel":1},"magia-laco-da-uniao":{"escola":"abjuracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":4},"magia-lanca-de-gelo":{"escola":"destruicao","intensidades":["contida","normal","forcada","transbordante"],"nivel":3},"magia-lastro":{"escola":"alteracao","intensidades":["normal","forcada","transbordante"],"nivel":1},"magia-limiar-perfurante":{"escola":"destruicao","intensidades":["contida","normal","forcada","transbordante"],"nivel":4},"magia-lingua-mistica":{"escola":"conhecimento","intensidades":["normal"],"nivel":2},"magia-maldicao-do-peso":{"escola":"alteracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":2},"magia-mao-magica":{"escola":"alteracao","intensidades":["normal"],"nivel":2},"magia-mensagem":{"escola":"conhecimento","intensidades":["contida","normal","forcada","transbordante"],"nivel":2},"magia-necropsia-primordial":{"escola":"conhecimento","intensidades":["transbordante"],"nivel":5},"magia-olhos-de-malkhor":{"escola":"conhecimento","intensidades":["transbordante"],"nivel":5},"magia-onda-gravitacional":{"escola":"destruicao","intensidades":["contida","normal","forcada","transbordante"],"nivel":2},"magia-panico":{"escola":"conhecimento","intensidades":["contida","normal","forcada","transbordante"],"nivel":3},"magia-pele-de-camaleao":{"escola":"alteracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":4},"magia-pele-de-pedra":{"escola":"alteracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":3},"magia-personificar-elemento":{"escola":"abjuracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":3},"magia-pestilencia":{"escola":"destruicao","intensidades":["contida","normal","forcada","transbordante"],"nivel":4},"magia-pestilencia-primordial":{"escola":"destruicao","intensidades":["contida","normal","forcada","transbordante"],"nivel":5},"magia-plasmar-terreno":{"escola":"alteracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":4},"magia-ponto-cego":{"escola":"conhecimento","intensidades":["normal","forcada","transbordante"],"nivel":1},"magia-possessao-carnal":{"escola":"conhecimento","intensidades":["transbordante"],"nivel":5},"magia-presas-de-gelo":{"escola":"destruicao","intensidades":["normal","forcada","transbordante"],"nivel":1},"magia-presciencia":{"escola":"conhecimento","intensidades":["normal"],"nivel":1},"magia-pressagio":{"escola":"abjuracao","intensidades":["normal"],"nivel":1},"magia-projecao-astral":{"escola":"conhecimento","intensidades":["contida","normal","forcada","transbordante"],"nivel":4},"magia-purgatorio":{"escola":"conhecimento","intensidades":["contida","normal","forcada","transbordante"],"nivel":4},"magia-purificacao-mistica":{"escola":"abjuracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":2},"magia-queda-suave":{"escola":"alteracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":2},"magia-raio-eletrico":{"escola":"destruicao","intensidades":["contida","normal","forcada","transbordante"],"nivel":2},"magia-rajada-prismatica":{"escola":"destruicao","intensidades":["normal","forcada","transbordante"],"nivel":1},"magia-refugio-dos-perdidos":{"escola":"abjuracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":4},"magia-rescaldo":{"escola":"abjuracao","intensidades":["normal","forcada","transbordante"],"nivel":1},"magia-reversao-primordial":{"escola":"abjuracao","intensidades":["transbordante"],"nivel":5},"magia-reversao-umbral":{"escola":"destruicao","intensidades":["transbordante"],"nivel":4},"magia-rosto-emprestado":{"escola":"alteracao","intensidades":["normal","forcada","transbordante"],"nivel":1},"magia-ruido-anti-magia":{"escola":"abjuracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":4},"magia-santuario-menor":{"escola":"abjuracao","intensidades":["normal","forcada","transbordante"],"nivel":2},"magia-selo-do-oblivio":{"escola":"abjuracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":5},"magia-sina":{"escola":"conhecimento","intensidades":["normal","forcada","transbordante"],"nivel":1},"magia-sinapsia-coletiva":{"escola":"conhecimento","intensidades":["contida","normal","forcada","transbordante"],"nivel":4},"magia-solo-sagrado":{"escola":"abjuracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":2},"magia-sussurro-do-ambiente":{"escola":"conhecimento","intensidades":["contida","normal","forcada","transbordante"],"nivel":3},"magia-tecido-de-vytalia":{"escola":"conhecimento","intensidades":["transbordante"],"nivel":5},"magia-telepatia":{"escola":"abjuracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":3},"magia-tempera":{"escola":"alteracao","intensidades":["normal","forcada","transbordante"],"nivel":1},"magia-tempestade-primordial":{"escola":"destruicao","intensidades":["contida","normal","forcada","transbordante"],"nivel":5},"magia-toque-caustico":{"escola":"destruicao","intensidades":["normal","forcada","transbordante"],"nivel":1},"magia-toque-gelido":{"escola":"destruicao","intensidades":["contida","normal","forcada","transbordante"],"nivel":2},"magia-transferir-condicao":{"escola":"alteracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":4},"magia-transfigurar-arma":{"escola":"alteracao","intensidades":["contida","normal","forcada","transbordante"],"nivel":3},"magia-translocacao-arcana":{"escola":"alteracao","intensidades":["normal"],"nivel":3},"magia-ventania-bizarra":{"escola":"destruicao","intensidades":["contida","normal","forcada","transbordante"],"nivel":3},"magia-verdades-dolorosas":{"escola":"destruicao","intensidades":["contida","normal","forcada","transbordante"],"nivel":3},"magia-verniz-do-eter":{"escola":"abjuracao","intensidades":["normal","forcada","transbordante"],"nivel":1},"magia-vinculo-cosmico":{"escola":"abjuracao","intensidades":["normal","forcada","transbordante"],"nivel":1},"magia-vislumbre":{"escola":"conhecimento","intensidades":["transbordante"],"nivel":1},"magia-vytalia":{"escola":"abjuracao","intensidades":["normal","forcada","transbordante"],"nivel":5},"magia-xadrez":{"escola":"alteracao","intensidades":["normal"],"nivel":4}},"requisitos":{"regra":"Treinado em Místico + Foco da escola equipado","st":"aprovado","validar":"avisar"},"st":"canonico","subidaPorTecnica":{"pergunta":null,"st":"canonico"},"sustentada":{"maxAtivas":1,"st":"canonico"}},
    "morte": {"estadosFinais":[{"acao":"alertar","id":"exaustao-5","nota":null},{"acao":"alertar","id":"desnutrido-max-zero","nota":null},{"acao":"alertar","id":"saude-abaixo-metade-negativa","nota":null},{"acao":"alertar","id":"eter-metade-negativa","nota":"personagem vai para o mestre"}],"estadosFinaisFo":"contrato:morte.estadosFinais","estadosFinaisSt":"semStatus","fo":"contrato:morte.morrendo","limites":{"eter":{"fo":"contrato:recursos.eter.perdePersonagemEm","min":{"a":{"args":[{"a":{"fo":"contrato:recursos.eter.min","ref":"recurso.eter.max","st":"semStatus","t":"ref"},"b":{"fo":"contrato:recursos.eter.min","st":"semStatus","t":"num","v":2},"fo":"contrato:recursos.eter.min","op":"/","st":"semStatus","t":"op"}],"fn":"floor","fo":"contrato:recursos.eter.min","st":"semStatus","t":"fn"},"fo":"contrato:recursos.eter.min","st":"semStatus","t":"neg"},"st":"semStatus"},"saude":{"fo":"contrato:recursos.saude.morteEm","min":{"a":{"args":[{"a":{"fo":"contrato:recursos.saude.min","ref":"recurso.saude.max","st":"canonico","t":"ref"},"b":{"fo":"contrato:recursos.saude.min","st":"canonico","t":"num","v":2},"fo":"contrato:recursos.saude.min","op":"/","st":"canonico","t":"op"}],"fn":"floor","fo":"contrato:recursos.saude.min","st":"canonico","t":"fn"},"fo":"contrato:recursos.saude.min","st":"canonico","t":"neg"},"st":"canonico"}},"mitigavel":false,"st":"decisao","tique":{"args":[{"a":{"fo":"contrato:morte.morrendo.tick","ref":"recurso.saude.max","st":"decisao","t":"ref"},"b":{"fo":"contrato:morte.morrendo.tick","st":"decisao","t":"num","v":0.1},"fo":"contrato:morte.morrendo.tick","op":"*","st":"decisao","t":"op"}],"fn":"floor","fo":"contrato:morte.morrendo.tick","st":"decisao","t":"fn"}},
    "naoResolvidos": [{"id":"batedor-sexto-sentido","motivo":"F1b: habilidade do Instinto em data/classes/batedor.json (classe.recurso.habilidades, id batedor-sexto-sentido); fora do catálogo até virar card levável (F4)","onde":"derivados.evasao.modificadores"},{"id":"acao-acelerar","motivo":"ação do Sistema (Sua Rodada); a convenção não tem tipo 'acao': decisão na F1d","onde":"derivados.movimento.somas"},{"id":"escudo","motivo":"categoria de item (D62: 'todo escudo, sem exceção'), não uma entidade: resolve-se pela categoria do Bazar na F1d","onde":"derivados.movimento.somas"},{"id":"passo-tremulo","motivo":"F1b: é a adversidade Passo Trêmulo do Corrompido (-3 m de movimento), em data/racas/corrompido.json (raca.corrupcao.adversidades, id corrompido-passo-tremulo); vira alias quando a tabela de corrupção for entidade (tipo corrupcao, F4)","onde":"derivados.movimento.somas"}],
    "ordemStatus": ["canonico","canonicoParcial","aprovado","decisao","canonico-mas-em-rework","decisaoDoSite","pedroDecide","pendente","pendenteBalanceamento","semStatus"],
    "pendentesBalanceamento": ["tecnica-de-raca","medidor-minimo","medidor-inicio-recarga"],
    "pericias": [{"atributos":["FOR","DES"],"fo":"contrato:pericias.0","id":"atacar","modo":"porArma","nome":"Atacar","st":"canonico","tags":["fisica"]},{"atributos":[],"dadoPorGrau":["1d6","1d8","1d10","1d12","2d8"],"fo":"contrato:pericias.1","id":"defender","modo":"dado","nome":"Defender","st":"canonico","tags":["fisica"]},{"atributos":["FOR","DES"],"fo":"data/pericias.json","foEscolha":"contrato:pericias.movimento.trocavelFonte (PD7)","id":"movimento","modo":"maior","nome":"Movimento","st":"canonico","stEscolha":"aprovado","tags":["fisica"]},{"atributos":["CON"],"fo":"data/pericias.json","id":"fortitude","modo":"fixo","nome":"Fortitude","st":"canonico","tags":["fisica","resistencia"]},{"atributos":["SAB"],"fo":"data/pericias.json","id":"vontade","modo":"fixo","nome":"Vontade","st":"canonico","tags":["resistencia"]},{"atributos":["DES"],"fo":"data/pericias.json","id":"reflexos","modo":"fixo","nome":"Reflexos","st":"canonico","tags":["fisica","resistencia"]},{"atributos":["SAB"],"fo":"data/pericias.json","id":"percepcao","modo":"fixo","nome":"Percepção","st":"canonico","tags":[]},{"atributos":["SAB"],"fo":"data/pericias.json","id":"sobrevivencia","modo":"fixo","nome":"Sobrevivência","st":"canonico","tags":[]},{"atributos":["DES"],"fo":"data/pericias.json","id":"furtividade","modo":"fixo","nome":"Furtividade","st":"canonico","tags":["fisica"]},{"atributos":["DES"],"fo":"data/pericias.json","id":"crime","modo":"fixo","nome":"Crime","st":"canonico","tags":["fisica"]},{"atributos":["DES"],"fo":"data/pericias.json","id":"iniciativa","modo":"fixo","nome":"Iniciativa","st":"canonico","tags":["fisica"]},{"atributos":["INT"],"fo":"data/pericias.json","id":"conhecimento","modo":"fixo","nome":"Conhecimento","st":"canonico","tags":[]},{"atributos":["INT"],"fo":"data/pericias.json","id":"medicina","modo":"fixo","nome":"Medicina","st":"canonico","tags":[]},{"atributos":["INT"],"fo":"data/pericias.json","id":"investigacao","modo":"fixo","nome":"Investigação","st":"canonico","tags":[]},{"atributos":["SAB"],"fo":"contrato:pericias.14","id":"religiao","modo":"fixo","nome":"Religião","st":"canonico","tags":[]},{"atributos":["INT"],"fo":"data/pericias.json","id":"mistico","modo":"fixo","nome":"Místico","st":"canonico","tags":[]},{"atributos":["DES","INT"],"fo":"data/pericias.json","foEscolha":"contrato:pericias.convencimento.trocavelFonte (PD7)","id":"convencimento","modo":"maior","nome":"Convencimento","st":"canonico","stEscolha":"aprovado","tags":["social"]},{"atributos":["CON","FOR"],"fo":"contrato:pericias.17","foEscolha":"contrato:pericias.intimidacao.trocavelFonte (PD7)","id":"intimidacao","modo":"maior","nome":"Intimidação","st":"canonico","stEscolha":"aprovado","tags":["fisica","social"]},{"atributos":["SAB"],"fo":"data/pericias.json","id":"intuicao","modo":"fixo","nome":"Intuição","st":"canonico","tags":[]},{"atributos":["DES","INT"],"fo":"data/pericias.json","foEscolha":"contrato:pericias.enganacao.trocavelFonte (PD7)","id":"enganacao","modo":"maior","nome":"Enganação","st":"canonico","stEscolha":"aprovado","tags":["social"]},{"atributos":["SAB"],"fo":"data/pericias.json","id":"motivar","modo":"fixo","nome":"Motivar","st":"canonico","tags":["social"]},{"atributos":["INT"],"exigeTreino":true,"fo":"contrato:pericias.21","id":"oficio-ferraria","modo":"fixo","nome":"Ofício(Ferraria)","st":"canonico","tags":[]},{"atributos":["INT"],"exigeTreino":true,"fo":"data/pericias.json","id":"oficio-engenharia","modo":"fixo","nome":"Ofício(Engenharia)","st":"canonico","tags":[]},{"atributos":["INT"],"exigeTreino":true,"fo":"data/pericias.json","id":"oficio-alquimia","modo":"fixo","nome":"Ofício(Alquimia)","st":"canonico","tags":[]}],
    "racas": {"anao":{"alternativo":[{"opcoes":["INT"],"valor":1},{"opcoes":["DES"],"valor":1},{"opcoes":["FOR"],"valor":-1}],"arNatural":[{"fonte":"anao-caxon","nome":"Caxon","soma":false,"valor":3}],"atributos":[{"opcoes":["CON"],"valor":2},{"opcoes":["INT"],"valor":-1}],"fo":"data/racas/anao.json","id":"raca-anao","movimento":7.5,"nome":"Anão","nomes":{"anao-caxon":"Caxon","anao-krichama":"Krichama"},"st":"canonico","subespecies":{},"variantes":["anao-krichama","anao-caxon"]},"automato":{"alternativo":[{"opcoes":["CON"],"valor":2},{"opcoes":["INT"],"valor":-1}],"arNatural":[],"atributos":[{"opcoes":["INT"],"valor":2},{"opcoes":["SAB"],"valor":-1}],"fo":"data/racas/automato.json","id":"raca-automato","movimento":9,"nome":"Autômato","nomes":{},"st":"canonico","subespecies":{},"variantes":[]},"corrompido":{"alternativo":[{"opcoes":["DES"],"valor":2},{"opcoes":["CON","FOR"],"valor":-1}],"arNatural":[],"atributos":[{"opcoes":["INT","SAB"],"valor":2},{"opcoes":["CON","FOR"],"valor":-1}],"fo":"data/racas/corrompido.json","id":"raca-corrompido","movimento":9,"nome":"Corrompido","nomes":{},"st":"canonico","subespecies":{},"variantes":[]},"dryad":{"alternativo":[{"opcoes":["SAB","INT"],"valor":2},{"opcoes":["FOR","CON"],"valor":-1}],"arNatural":[{"fonte":"dryad-pele-de-casca","nome":"Pele de Casca","soma":false,"valor":2},{"fonte":"dryad-cascaferro","nome":"Cascaferro","soma":true,"valor":1}],"atributos":[{"opcoes":["DES","CON"],"valor":2},{"opcoes":["SAB","INT"],"valor":-1}],"fo":"data/racas/dryad.json","id":"raca-dryad","movimento":10.5,"nome":"Dryad","nomes":{"dryad-cascaferro":"Cascaferro","dryad-florescura":"Florescura"},"st":"canonico","subespecies":{},"variantes":["dryad-florescura","dryad-cascaferro"]},"gruto":{"alternativo":[{"opcoes":["DES","INT"],"valor":2},{"opcoes":["CON"],"valor":-1}],"arNatural":[{"fonte":"gruto-rokhan","nome":"Rokhan","soma":false,"valor":1}],"atributos":[{"opcoes":["FOR","CON"],"valor":2},{"opcoes":["INT"],"valor":-1}],"fo":"data/racas/gruto.json","id":"raca-gruto","movimento":9,"nome":"Gruto","nomes":{"gruto-rokhan":"Rokhan","gruto-skal-ri":"Skal'ri"},"st":"canonico","subespecies":{},"variantes":["gruto-rokhan","gruto-skal-ri"]},"humano":{"alternativo":[{"opcoes":["SAB"],"valor":2}],"arNatural":[],"atributos":[{"opcoes":"qualquer","quantidade":2,"valor":1}],"fo":"data/racas/humano.json","id":"raca-humano","movimento":9,"nome":"Humano","nomes":{"humano-estudioso":"Estudioso","humano-popular":"Popular","humano-rebelde":"Rebelde","humano-simples":"Simples"},"st":"canonico","subespecies":{},"variantes":["humano-simples","humano-estudioso","humano-rebelde","humano-popular"]},"inseto":{"alternativo":null,"arNatural":[{"fonte":"inseto-besouro","nome":"Besouro","soma":false,"valor":2}],"atributos":null,"fo":"data/racas/inseto.json","id":"raca-inseto","movimento":null,"nome":"Inseto","nomes":{"inseto-barata":"Barata","inseto-besouro":"Besouro","inseto-louva-a-deus":"Louva-a-Deus"},"st":"canonico","subespecies":{"inseto-barata":{"atributos":[{"opcoes":["DES"],"valor":2},{"opcoes":["SAB"],"valor":-1}],"movimento":10.5},"inseto-besouro":{"atributos":[{"opcoes":["CON"],"valor":2},{"opcoes":["INT"],"valor":-1}],"movimento":7.5},"inseto-louva-a-deus":{"atributos":[{"opcoes":["SAB"],"valor":2},{"opcoes":["CON"],"valor":-1}],"movimento":9}},"variantes":["inseto-besouro","inseto-louva-a-deus","inseto-barata"]}},
    "recursos": {"base":{"eter":6,"saude":10,"stamina":8},"bonusRolados":{"cometa-do-martir":{"dado":"-1d6","modo":"rolaPorUso","recurso":"eter"},"dom-da-ressurreicao":{"modo":"valorFixo","recurso":"saude|stamina","valor":-10},"exigente":{"modo":"acumuladorPorEvento","recurso":"stamina,eter","valor":-1},"poco-arcano":{"dado":"2d6+8","modo":"rolaUmaVez","recurso":"eter"},"pulmoes-titanicos":{"dado":"3d12+8","modo":"rolaUmaVez","recurso":"saude"},"reservas-profundas":{"dado":"2d6+8","modo":"rolaUmaVez","recurso":"stamina"},"sangue-espesso":{"dado":"2d10+5","modo":"rolaUmaVez","recurso":"saude"}},"eter":{"fo":"contrato:recursos.eter.max","max":{"a":{"a":{"fo":"contrato:recursos.eter.max","st":"canonico","t":"num","v":6},"b":{"a":{"fo":"contrato:recursos.eter.max","ref":"classe.R","st":"canonico","t":"ref"},"b":{"fo":"contrato:recursos.eter.max","ref":"nivel","st":"canonico","t":"ref"},"fo":"contrato:recursos.eter.max","op":"*","st":"canonico","t":"op"},"fo":"contrato:recursos.eter.max","op":"+","st":"canonico","t":"op"},"b":{"a":{"args":[{"fo":"contrato:recursos.eter.max","ref":"mod.INT","st":"canonico","t":"ref"},{"fo":"contrato:recursos.eter.max","ref":"mod.SAB","st":"canonico","t":"ref"}],"fo":"contrato:recursos.eter.modoEscolha","modo":"maior","st":"aprovado","t":"esc"},"b":{"fo":"contrato:recursos.eter.max","ref":"nivel","st":"canonico","t":"ref"},"fo":"contrato:recursos.eter.max","op":"*","st":"canonico","t":"op"},"fo":"contrato:recursos.eter.max","op":"+","st":"canonico","t":"op"},"st":"canonico","trocavel":true},"ordemFo":"contrato:recursos.ordemMaximo","ordemMaximo":["base","coeficiente","modificador","bonusFixo","bonusRolado","percentual","reducaoPermanente","condicao","piso"],"ordemSt":"aprovado","saude":{"fo":"contrato:recursos.saude.max","max":{"a":{"a":{"fo":"contrato:recursos.saude.max","st":"canonico","t":"num","v":10},"b":{"a":{"fo":"contrato:recursos.saude.max","ref":"classe.V","st":"canonico","t":"ref"},"b":{"fo":"contrato:recursos.saude.max","ref":"nivel","st":"canonico","t":"ref"},"fo":"contrato:recursos.saude.max","op":"*","st":"canonico","t":"op"},"fo":"contrato:recursos.saude.max","op":"+","st":"canonico","t":"op"},"b":{"a":{"fo":"contrato:recursos.saude.max","ref":"mod.CON","st":"canonico","t":"ref"},"b":{"fo":"contrato:recursos.saude.max","ref":"nivel","st":"canonico","t":"ref"},"fo":"contrato:recursos.saude.max","op":"*","st":"canonico","t":"op"},"fo":"contrato:recursos.saude.max","op":"+","st":"canonico","t":"op"},"st":"canonico","trocavel":false},"stamina":{"fo":"contrato:recursos.stamina.max","max":{"a":{"a":{"fo":"contrato:recursos.stamina.max","st":"canonico","t":"num","v":8},"b":{"a":{"fo":"contrato:recursos.stamina.max","ref":"classe.G","st":"canonico","t":"ref"},"b":{"fo":"contrato:recursos.stamina.max","ref":"nivel","st":"canonico","t":"ref"},"fo":"contrato:recursos.stamina.max","op":"*","st":"canonico","t":"op"},"fo":"contrato:recursos.stamina.max","op":"+","st":"canonico","t":"op"},"b":{"a":{"args":[{"fo":"contrato:recursos.stamina.max","ref":"mod.FOR","st":"canonico","t":"ref"},{"fo":"contrato:recursos.stamina.max","ref":"mod.DES","st":"canonico","t":"ref"}],"fo":"contrato:recursos.stamina.modoEscolha","modo":"maior","st":"aprovado","t":"esc"},"b":{"fo":"contrato:recursos.stamina.max","ref":"nivel","st":"canonico","t":"ref"},"fo":"contrato:recursos.stamina.max","op":"*","st":"canonico","t":"op"},"fo":"contrato:recursos.stamina.max","op":"+","st":"canonico","t":"op"},"st":"canonico","trocavel":true},"temporario":{"acumula":"maior","fo":"contrato:recursos.temporario","recursos":["saude","stamina"],"st":"canonico"}},
    "rotulosSelo": {"ajuste":"ajuste manual","avisoClasse":"classe em rework","decisaoPedro":"decisão do Pedro, falta Notion","pendenteBalanceamento":"PENDENTE (balanceamento)","pendentePedro":"PENDENTE PEDRO"},
    "schema": "regras-dados/1",
    "selos": {"ajuste":"ajuste","aprovado":"decisaoPedro","canonico":null,"canonico-mas-em-rework":"avisoClasse","canonicoParcial":null,"decisao":"decisaoPedro","decisaoDoSite":"pendentePedro","pedroDecide":"pendentePedro","pendente":"pendentePedro","pendenteBalanceamento":"pendenteBalanceamento","semStatus":"pendenteBalanceamento"},
    "testes": {"acumulam":false,"aplicaDefender":true,"cancelam":true,"criticoNoDadoUsado":true,"fo":"contrato:testes","st":"canonico"},
    "turno": {"acoes":3,"conjuracoes":1,"fo":"contrato:turno","pma":-5,"pmaSt":"canonico","reacoes":1,"st":"canonico"},
    "versao": "regras-ficha/1.1+cd591d8ef0e1"
  };
  if (typeof module === 'object' && module && module.exports) {
    if (!Object.keys(module.exports).length) module.exports = DADOS;
    return;
  }
  raiz.KhRegrasDados = DADOS;
})(typeof window !== 'undefined' ? window : this);

// ==== js/ficha/kh-inv.js ====
/* Khalkaria — Ficha · KhInv: motor PURO de carga e inventário.
 * Sem DOM, sem localStorage. No node (tools/testes) exporta o KhInv por
 * module.exports; no navegador vira window.KhInv, que o ficha-v2.js lê.
 * Fonte: js/ficha/kh-inv.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  // ================= KhInv: motor de carga e inventário (PURO) =================
  // Regras do texto do Sistema (validar.py confere as frases). Pendências do
  // Pedro marcadas: limites Pesada/Leve independentes; bônus de mochilas
  // diferentes somam. Empilhável 10:1 (munição incluída) confirmado em 2026-09-25.
  var KhInv = (function () {
    var REGRAS = Object.freeze({
      BASE_BUG: 10, BASE_EQ: 2, MIN: 1, PILHA: 10,
      LIM_PESADA: 1, LIM_LEVE: 2, LIM_SINTONIA: 3, QTD_MAX: 9999,
      FRASE_EMPILHA: 'Empilhável: pesa 1 bugiganga a cada 10 unidades'
    });
    var COLUNAS = ['bugigangas', 'equipamentos'];
    var EQUIP_TOKENS = ['Arma', 'Armadura', 'Escudo'];
    // Empilhável é dado do build: inv.empilhavel, que o tools/gerar_bazar.py tira
    // do Efeito com o RE_EMPILHA dele (a Bolsa de Couro diz "Não é empilhável").
    // A regex daqui é só LEGADO, para o snapshot sem inv (v1 migrada, card sem
    // catálogo) até a reconciliação trazer o inv do registro.
    var RE_EMPILHA = /(?<!Não é )[Ee]mpilh[aá]vel:\s*pesa 1 bugiganga a cada 10 unidades/;
    var CAMPOS_SNAPSHOT = ['nome', 'categoria', 'raridade', 'arquetipo', 'arte', 'efeito', 'valor'];

    function clone(x) { return x === undefined ? undefined : JSON.parse(JSON.stringify(x)); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function tokens(cat) {
      return str(cat).split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    }
    function empilhavelPorTexto(efeito) { return RE_EMPILHA.test(str(efeito)); }
    function temInv(x) { return !!(x && x.inv && typeof x.inv === 'object' && !Array.isArray(x.inv)); }
    // o que o registro diz: com inv, só inv.empilhavel (o texto não é lido); sem inv, o legado
    function empilhavelDe(x) {
      x = x || {};
      return temInv(x) ? x.inv.empilhavel === true : empilhavelPorTexto(x.efeito);
    }
    function colunaCanonica(x) {
      x = x || {};
      if (temInv(x)) return x.inv.slot === 'equipamento' ? 'equipamentos' : 'bugigangas';
      var equip = tokens(x.categoria).some(function (t) { return EQUIP_TOKENS.indexOf(t) >= 0; });
      return (equip && !empilhavelDe(x)) ? 'equipamentos' : 'bugigangas';
    }
    // FOR vazia, nula ou inválida conta como 0 (FOR 0 ou vazia: 5 e 1)
    function modFor(F) { var n = parseInt(F, 10); if (!isFinite(n)) n = 0; return Math.floor((n - 10) / 2); }
    function qtdDe(e) {
      var n = parseInt(e && e.qtd, 10);
      if (!(n >= 1)) n = 1;
      return Math.min(REGRAS.QTD_MAX, n);
    }
    function estado(u, m) { return u <= m ? 'ok' : (u < 2 * m ? 'leve' : 'extremo'); }
    var ORDEM_ESTADO = { ok: 0, leve: 1, extremo: 2 };
    function semAcento(s) { return str(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim(); }
    // chave de fusão: (coluna, id || nome); avulso só funde com avulso de mesmo nome
    function chave(e) {
      if (e.avulso) return 'a:' + semAcento(e.nome);
      return e.id ? 'i:' + e.id : 'n:' + str(e.nome);
    }
    function novoUid(usados) {
      var u;
      do { u = 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
      while (usados && usados[u]);
      if (usados) usados[u] = true;
      return u;
    }
    function uidsDe(inv) {
      var u = {};
      COLUNAS.forEach(function (c) { lista(inv && inv[c]).forEach(function (e) { if (e && e.uid) u[e.uid] = true; }); });
      return u;
    }
    function acha(inv, uid) {
      for (var i = 0; i < COLUNAS.length; i++) {
        var l = lista(inv && inv[COLUNAS[i]]);
        for (var j = 0; j < l.length; j++) if (l[j] && l[j].uid === uid) return { coluna: COLUNAS[i], lista: l, indice: j, entrada: l[j] };
      }
      return null;
    }
    function pega(mapa, k) {
      if (!mapa || !k) return undefined;
      if (typeof mapa.get === 'function') return mapa.get(k);
      return Object.prototype.hasOwnProperty.call(mapa, k) ? mapa[k] : undefined;
    }

    // Entrada v2 (§5.2). Preserva chaves desconhecidas; apaga slotPeso/tipo da v1.
    function normalizaEntrada(e, usados) {
      var o = Object.assign({}, e || {});
      delete o.slotPeso; delete o.tipo;
      if (typeof o.uid !== 'string' || !o.uid || (usados && usados[o.uid])) o.uid = novoUid(usados);
      else if (usados) usados[o.uid] = true;
      o.avulso = o.avulso === true;
      o.id = o.avulso ? '' : str(o.id);
      CAMPOS_SNAPSHOT.forEach(function (k) { o[k] = str(o[k]); });
      o.inv = (o.inv && typeof o.inv === 'object' && !Array.isArray(o.inv)) ? clone(o.inv) : null;
      o.qtd = qtdDe(o);
      if (typeof o.empilhavelRegistro !== 'boolean') {
        o.empilhavelRegistro = o.avulso ? null : empilhavelDe(o);
      }
      if (typeof o.empilhavel !== 'boolean') o.empilhavel = !!o.empilhavelRegistro;
      o.equipado = o.equipado === true;
      o.equipadoEm = (o.equipado && typeof o.equipadoEm === 'string') ? o.equipadoEm : null;
      o.sintonizado = o.sintonizado === true;
      o.secaoManual = o.secaoManual === true;
      o.orfao = o.orfao === true;
      return o;
    }
    // snapshot de um item do bazar.json (ou {avulso:true, nome})
    function entradaDeItem(item) {
      item = item || {};
      if (item.avulso) return { avulso: true, nome: str(item.nome).trim() };
      var o = { id: str(item.id), inv: (item.inv && typeof item.inv === 'object') ? clone(item.inv) : null };
      CAMPOS_SNAPSHOT.forEach(function (k) { o[k] = str(item[k]); });
      return o;
    }
    // Equipado e Sintonizado valem por UNIDADE: a entrada marcada tem sempre qtd 1
    // e nunca entra em fusão. "Livre" é a entrada que pode receber/fundir cópias.
    function livre(x) { return !!x && !x.equipado && !x.sintonizado; }
    // entrada marcada com qtd > 1 (import, estado antigo): 1 unidade fica marcada,
    // o resto vira uma entrada livre logo depois
    function separaMarcada(e, usados) {
      if (livre(e) || qtdDe(e) <= 1) return [e];
      var resto = clone(e);
      resto.uid = novoUid(usados); resto.qtd = qtdDe(e) - 1;
      resto.equipado = false; resto.equipadoEm = null; resto.sintonizado = false;
      e.qtd = 1;
      return [e, resto];
    }
    // funde entradas livres de mesma chave, somando qtd (a 1ª fica)
    function fundir(l) {
      var vistos = {}, out = [];
      lista(l).forEach(function (e) {
        if (!livre(e)) { out.push(e); return; }
        var k = chave(e);
        if (vistos[k]) { vistos[k].qtd = Math.min(REGRAS.QTD_MAX, qtdDe(vistos[k]) + qtdDe(e)); return; }
        vistos[k] = e; out.push(e);
      });
      return out;
    }

    // ---- Carga (§6) ----
    function calcular(inv, forca) {
      inv = inv || {};
      var m = modFor(forca);
      var cols = { bugigangas: lista(inv.bugigangas), equipamentos: lista(inv.equipamentos) };
      var carga = {
        forca: (function () { var n = parseInt(forca, 10); return isFinite(n) ? n : 0; })(),
        modFor: m, pesoTotal: 0, condicao: 'nenhuma',
        bugigangas: { usado: 0, max: 0, base: Math.max(REGRAS.MIN, REGRAS.BASE_BUG + m), bonus: [], estado: 'ok' },
        equipamentos: { usado: 0, max: 0, base: Math.max(REGRAS.MIN, REGRAS.BASE_EQ + m), bonus: [], estado: 'ok' },
        pesoPorUid: {}, motivoPorUid: {}, avisos: []
      };
      // bônus de capacidade: por id distinto, em qualquer coluna (o mínimo 1 vale só para a base)
      var caps = {}, ordem = [];
      COLUNAS.forEach(function (c) {
        cols[c].forEach(function (e) {
          if (!e || !e.inv || !e.inv.capacidade) return;
          var k = e.id || e.uid;
          if (!caps[k]) { caps[k] = { id: e.id || '', nome: e.nome, inv: e.inv, total: 0, uids: [] }; ordem.push(k); }
          caps[k].total += qtdDe(e); caps[k].uids.push(e.uid);
        });
      });
      ordem.forEach(function (k) {
        var cp = caps[k], cap = cp.inv.capacidade;
        var mult = cp.inv.acumula === false ? 1 : cp.total, ign = cp.total - mult;
        if (cap.bug) carga.bugigangas.bonus.push({ id: cp.id, nome: cp.nome, n: cap.bug * mult, ignoradas: ign });
        if (cap.equip) carga.equipamentos.bonus.push({ id: cp.id, nome: cp.nome, n: cap.equip * mult, ignoradas: ign });
        if (ign > 0) carga.avisos.push({ tipo: 'copia', uids: cp.uids.slice(),
          msg: (cp.total > 2 ? 'Da 2ª à ' + cp.total + 'ª ' : '2ª ') + cp.nome + ' não acumula' });
      });
      // peso por entrada
      COLUNAS.forEach(function (c) {
        var grupos = {}, ordemG = [], col = carga[c];
        cols[c].forEach(function (e, i) {
          if (!e) return;
          var uid = e.uid || (c + '#' + i);
          if (e.inv && e.inv.ocupa === false) { carga.pesoPorUid[uid] = 0; carga.motivoPorUid[uid] = 'nao-ocupa'; }
          else if (c === 'equipamentos' && e.equipado) { carga.pesoPorUid[uid] = 0; carga.motivoPorUid[uid] = 'equipado'; }
          else if (e.empilhavel) {
            var k = e.id || uid;
            if (!grupos[k]) { grupos[k] = { uid: uid, soma: 0 }; ordemG.push(k); }
            grupos[k].soma += qtdDe(e);
            carga.pesoPorUid[uid] = 0; carga.motivoPorUid[uid] = 'pilha';
          } else { carga.pesoPorUid[uid] = qtdDe(e); carga.motivoPorUid[uid] = 'unidade'; }
        });
        ordemG.forEach(function (k) { carga.pesoPorUid[grupos[k].uid] = Math.ceil(grupos[k].soma / REGRAS.PILHA); });
        cols[c].forEach(function (e, i) { if (e) col.usado += carga.pesoPorUid[e.uid || (c + '#' + i)]; });
        col.max = col.base + col.bonus.reduce(function (s, b) { return s + b.n; }, 0);
        col.estado = estado(col.usado, col.max);
      });
      carga.pesoTotal = carga.bugigangas.usado + carga.equipamentos.usado;
      var pior = ORDEM_ESTADO[carga.bugigangas.estado] >= ORDEM_ESTADO[carga.equipamentos.estado]
        ? carga.bugigangas.estado : carga.equipamentos.estado;
      carga.condicao = pior === 'ok' ? 'nenhuma' : pior;
      // limites de equipamento (estado importado acima do limite vira aviso, não bloqueio)
      [['Pesada', 'pesada', REGRAS.LIM_PESADA], ['Leve', 'leve', REGRAS.LIM_LEVE]].forEach(function (a) {
        var eq = cols.equipamentos.filter(function (e) { return e && e.equipado && e.inv && e.inv.armadura === a[0]; });
        var n = eq.reduce(function (s, e) { return s + qtdDe(e); }, 0);
        if (n > a[2]) carga.avisos.push({ tipo: a[1], uids: eq.map(function (e) { return e.uid; }),
          msg: n + ' Armaduras ' + a[0] + 's equipadas; o limite é ' + a[2] });
      });
      var sint = cols.bugigangas.concat(cols.equipamentos).filter(function (e) { return e && e.sintonizado; });
      var ns = sint.reduce(function (s, e) { return s + qtdDe(e); }, 0);
      if (ns > REGRAS.LIM_SINTONIA) carga.avisos.push({ tipo: 'sintonia', uids: sint.map(function (e) { return e.uid; }),
        msg: ns + ' Itens Mágicos sintonizados; o limite é ' + REGRAS.LIM_SINTONIA });
      COLUNAS.forEach(function (c) {
        cols[c].forEach(function (e) {
          if (!e) return;
          var canon = colunaCanonica(e);
          if (!e.avulso && canon !== c) carga.avisos.push({ tipo: 'fora-da-regra', uids: [e.uid],
            msg: e.nome + ' está em ' + (c === 'bugigangas' ? 'Bugigangas' : 'Equipamentos') +
              '; o registro manda para ' + (canon === 'bugigangas' ? 'Bugigangas' : 'Equipamentos') });
          if (e.orfao && !e.avulso) carga.avisos.push({ tipo: 'orfao', uids: [e.uid],
            msg: e.nome + ' não está mais no registro do Bazar' });
        });
      });
      return carga;
    }

    // ---- mutadores puros (mexem no inv recebido; quem chama tira o snapshot) ----
    // adiciona com fusão na entrada livre de mesma chave na coluna-alvo
    function mesclar(inv, item, opts) {
      opts = opts || {};
      var n = qtdDe({ qtd: opts.qtd == null ? 1 : opts.qtd });
      var base = entradaDeItem(item);
      var canon = colunaCanonica(base);
      var coluna = COLUNAS.indexOf(opts.coluna) >= 0 ? opts.coluna : canon;
      if (!Array.isArray(inv[coluna])) inv[coluna] = [];
      var k = chave(base);
      var alvo = inv[coluna].filter(function (x) { return livre(x) && chave(x) === k; })[0];
      if (alvo) { alvo.qtd = Math.min(REGRAS.QTD_MAX, qtdDe(alvo) + n); return { uid: alvo.uid, coluna: coluna, fundiu: true }; }
      base.qtd = n;
      base.secaoManual = !base.avulso && coluna !== canon;
      var e = normalizaEntrada(base, uidsDe(inv));
      inv[coluna].push(e);
      return { uid: e.uid, coluna: coluna, fundiu: false };
    }
    function remover(inv, uid) {
      var a = acha(inv, uid);
      if (!a) return null;
      a.lista.splice(a.indice, 1);
      return a.entrada;
    }
    // n < 1 remove; teto 9999. Entrada equipada/sintonizada fica em 1 (nada muda).
    function quantidade(inv, uid, n) {
      var a = acha(inv, uid);
      if (!a) return { ok: false };
      n = parseInt(n, 10);
      if (!(n >= 1)) { a.lista.splice(a.indice, 1); return { ok: true, removido: true }; }
      if (n > 1 && !livre(a.entrada)) return { ok: false, erro: a.entrada.equipado ? 'equipado' : 'sintonizado' };
      a.entrada.qtd = Math.min(REGRAS.QTD_MAX, n);
      return { ok: true, removido: false };
    }
    // sair de Equipamentos limpa o Equipado; coluna fora da canônica marca secaoManual
    function mover(inv, uid, coluna) {
      var a = acha(inv, uid);
      if (!a || COLUNAS.indexOf(coluna) < 0) return { ok: false };
      if (a.coluna === coluna) return { ok: true, uid: uid };
      var e = a.entrada;
      a.lista.splice(a.indice, 1);
      if (a.coluna === 'equipamentos') { e.equipado = false; e.equipadoEm = null; }
      e.secaoManual = !e.avulso && coluna !== colunaCanonica(e);
      if (!Array.isArray(inv[coluna])) inv[coluna] = [];
      var k = chave(e);
      var alvo = livre(e) && inv[coluna].filter(function (x) { return livre(x) && chave(x) === k; })[0];
      if (alvo) { alvo.qtd = Math.min(REGRAS.QTD_MAX, qtdDe(alvo) + qtdDe(e)); return { ok: true, uid: alvo.uid }; }
      inv[coluna].push(e);
      return { ok: true, uid: e.uid };
    }
    // limites: null se pode ligar `campo` em `uid`; senão {tipo, uids das que ocupam o limite}
    function conflito(inv, uid, campo) {
      var a = acha(inv, uid);
      if (!a) return null;
      var e = a.entrada;
      if (campo === 'equipado') {
        var arm = e.inv && e.inv.armadura;
        if (arm !== 'Pesada' && arm !== 'Leve') return null;   // armas e escudos não têm limite
        var lim = arm === 'Pesada' ? REGRAS.LIM_PESADA : REGRAS.LIM_LEVE;
        var outros = lista(inv.equipamentos).filter(function (x) { return x !== e && x.equipado && x.inv && x.inv.armadura === arm; });
        var n = outros.reduce(function (s, x) { return s + qtdDe(x); }, 0);
        return n + 1 > lim ? { tipo: arm === 'Pesada' ? 'pesada' : 'leve', uids: outros.map(function (x) { return x.uid; }) } : null;
      }
      if (campo === 'sintonizado') {   // sintonizar liga 1 unidade (uma pilha separa 1)
        var sint = lista(inv.bugigangas).concat(lista(inv.equipamentos)).filter(function (x) { return x !== e && x.sintonizado; });
        var ns = sint.reduce(function (s, x) { return s + qtdDe(x); }, 0);
        return ns + 1 > REGRAS.LIM_SINTONIA ? { tipo: 'sintonia', uids: sint.map(function (x) { return x.uid; }) } : null;
      }
      return null;
    }
    // desmarcar: a entrada que ficou livre volta para a livre de mesma chave na mesma lista
    function devolve(a, e) {
      if (!livre(e)) return e.uid;
      var k = chave(e);
      var alvo = a.lista.filter(function (x) { return x !== e && livre(x) && chave(x) === k; })[0];
      if (!alvo) return e.uid;
      alvo.qtd = Math.min(REGRAS.QTD_MAX, qtdDe(alvo) + qtdDe(e));
      a.lista.splice(a.lista.indexOf(e), 1);
      return alvo.uid;
    }
    // separa 1 unidade de uma pilha livre numa entrada própria, posta logo antes
    function separaUma(inv, a, marca) {
      var e = a.entrada;
      e.qtd = qtdDe(e) - 1;
      var nova = clone(e);
      nova.uid = novoUid(uidsDe(inv)); nova.qtd = 1;
      Object.keys(marca).forEach(function (k) { nova[k] = marca[k]; });
      a.lista.splice(a.indice, 0, nova);
      return nova.uid;
    }
    // {ok:true, uid} | {ok:false, conflito:{tipo, uids}} | {ok:false, erro}. Com conflito nada muda.
    function alternar(inv, uid, campo, agora) {
      var a = acha(inv, uid);
      if (!a) return { ok: false, erro: 'uid' };
      var e = a.entrada;
      if (campo === 'empilhavel') { e.empilhavel = !e.empilhavel; return { ok: true, uid: uid }; }
      if (campo === 'sintonizado') {
        if (e.sintonizado) { e.sintonizado = false; return { ok: true, uid: devolve(a, e) }; }
        var cs = conflito(inv, uid, campo);
        if (cs) return { ok: false, conflito: cs };
        if (qtdDe(e) > 1) return { ok: true, uid: separaUma(inv, a, { sintonizado: true }) };
        e.sintonizado = true;
        return { ok: true, uid: uid };
      }
      if (campo !== 'equipado') return { ok: false, erro: 'campo' };
      if (e.equipado) {   // desequipar: funde de volta na livre de mesmo id na mesma coluna
        e.equipado = false; e.equipadoEm = null;
        return { ok: true, uid: devolve(a, e) };
      }
      if (a.coluna !== 'equipamentos') return { ok: false, erro: 'coluna' };
      var cf = conflito(inv, uid, campo);
      if (cf) return { ok: false, conflito: cf };
      agora = agora || new Date().toISOString();
      if (qtdDe(e) > 1) return { ok: true, uid: separaUma(inv, a, { equipado: true, equipadoEm: agora }) };
      e.equipado = true; e.equipadoEm = agora;
      return { ok: true, uid: uid };
    }
    // "Trocar por esta": solta as que ocupam o limite e liga `campo` em uid
    function trocar(inv, uid, campo, uidsASoltar, agora) {
      lista(uidsASoltar).forEach(function (u) {
        var a = acha(inv, u);
        if (a && a.entrada[campo]) alternar(inv, u, campo, agora);
      });
      var a2 = acha(inv, uid);
      if (a2 && a2.entrada[campo]) return { ok: true, uid: uid };
      return alternar(inv, uid, campo, agora);
    }
    function projetar(inv, forca, item, opts) {
      var antes = calcular(inv, forca);
      var copia = clone(inv || {});
      COLUNAS.forEach(function (c) { if (!Array.isArray(copia[c])) copia[c] = []; });
      var r = mesclar(copia, item, opts);
      var depois = calcular(copia, forca);
      function foto(cg) {
        var col = cg[r.coluna];
        return { usado: col.usado, max: col.max, estado: col.estado, condicao: cg.condicao };
      }
      return { coluna: r.coluna, antes: foto(antes), depois: foto(depois) };
    }
    function quantidadePorId(inv) {
      var q = {};
      COLUNAS.forEach(function (c) {
        lista(inv && inv[c]).forEach(function (e) { if (e && e.id && !e.avulso) q[e.id] = (q[e.id] || 0) + qtdDe(e); });
      });
      return q;
    }

    // ---- Migração v1 → v2 (§5.6), idempotente; devolve cópia ----
    function migrarV1(f, agora) {
      agora = agora || new Date().toISOString();
      var out = clone(f && typeof f === 'object' ? f : {});
      var inv = (out.inventario && typeof out.inventario === 'object' && !Array.isArray(out.inventario)) ? out.inventario : {};
      var eraV1 = out.schemaVersion !== '2.0';
      var usados = {}, novo = { bugigangas: [], equipamentos: [] }, rerota = [];
      // v2 (tem uid, em coluna v2) fica onde está; o resto é re-roteado pela canônica.
      // Numa 2.0 isso pega as listas velhas que um ficha.js antigo em cache recria.
      ['armas', 'equipamentos', 'bugigangas', 'materiais'].forEach(function (k) {
        lista(inv[k]).forEach(function (e) {
          if (!e || typeof e !== 'object') return;
          if (!eraV1 && COLUNAS.indexOf(k) >= 0 && typeof e.uid === 'string' && e.uid) guarda(k, normalizaEntrada(e, usados));
          else rerota.push(e);
        });
      });
      rerota.forEach(function (e) {
        var n = normalizaEntrada(Object.assign({}, e, { secaoManual: false }), usados);
        guarda(colunaCanonica(n), n);
      });
      // Equipado só vale em Equipamentos; entrada marcada com qtd > 1 separa 1 unidade
      function guarda(c, n) {
        if (c !== 'equipamentos') { n.equipado = false; n.equipadoEm = null; }
        separaMarcada(n, usados).forEach(function (x) { novo[c].push(x); });
      }
      delete inv.armas; delete inv.materiais;
      var sins = Math.floor(Number(inv.sins));
      inv.sins = sins > 0 ? sins : 0;
      inv.bugigangas = fundir(novo.bugigangas);
      inv.equipamentos = fundir(novo.equipamentos);
      out.inventario = inv;
      if (eraV1) { out.schemaVersion = '2.0'; out.migradoEm = agora; }
      return out;
    }

    // ---- Reconciliação com o catálogo (§5.7); muda inv no lugar, devolve se mudou ----
    function indexar(catalogo) {
      var porId = {}, porNome = {};
      var cat = lista(catalogo);
      cat.forEach(function (it) {
        if (!it) return;
        if (it.id && !porId[it.id]) porId[it.id] = it;
        if (it.nome && !porNome[it.nome]) porNome[it.nome] = it;
      });
      // nome corrigido no CSV muda o id (data/bazar-renomeados.json): o id e o
      // nome antigos resolvem para o item atual, depois dos atuais (o atual vence)
      cat.forEach(function (it) {
        if (!it) return;
        lista(it.idsAntigos).forEach(function (a) { if (a && !porId[a]) porId[a] = it; });
        lista(it.nomesAntigos).forEach(function (a) { if (a && !porNome[a]) porNome[a] = it; });
      });
      return { porId: porId, porNome: porNome };
    }
    function reconciliar(inv, porId, porNome) {
      var mudou = false;
      COLUNAS.forEach(function (c) {
        var renomeou = false;
        lista(inv && inv[c]).forEach(function (e) {
          if (!e || e.avulso) return;
          var antes = JSON.stringify(e);
          var it = pega(porId, e.id) || pega(porNome, e.nome);
          if (!it) e.orfao = true;   // nunca apagado: pesa pelo snapshot
          else {
            var regAntigo = e.empilhavelRegistro;
            if (it.id && e.id && e.id !== String(it.id)) renomeou = true;
            CAMPOS_SNAPSHOT.forEach(function (k) { e[k] = str(it[k]); });
            if (it.id) e.id = String(it.id);
            e.inv = (it.inv && typeof it.inv === 'object') ? clone(it.inv) : null;
            var regNovo = empilhavelDe(e);
            if (e.empilhavel === regAntigo) e.empilhavel = regNovo;   // se o jogador divergiu, fica a escolha dele
            e.empilhavelRegistro = regNovo;
            e.orfao = false;
          }
          if (JSON.stringify(e) !== antes) mudou = true;
        });
        // o id antigo, já trocado pelo atual, pode ter caído junto de uma entrada
        // livre do mesmo item: soma as duas (equipada/sintonizada fica separada)
        if (renomeou) inv[c] = fundir(inv[c]);
      });
      return mudou;
    }

    // ---- Export Bestiário (§5.8): token exato 'Arma', equipadas primeiro ----
    // atributo: '' enquanto a arma não tem fonte de dado (o arquivo de efeitos,
    // F1b). Nada de 'Força' fixo nem de tabela manual por arma.
    function armasBestiario(inv) {
      var todas = lista(inv && inv.equipamentos).concat(lista(inv && inv.bugigangas)).filter(function (e) {
        return e && tokens(e.categoria).indexOf('Arma') >= 0;
      });
      return todas.filter(function (e) { return e.equipado; }).concat(todas.filter(function (e) { return !e.equipado; }))
        .map(function (e) {
          var arq = str(e.arquetipo);
          var w = { name: str(e.nome), category: arq, level: (/ \+([1-3])$/.exec(str(e.nome)) || [])[1] || '0',
            dado: '', atributo: '', dano: '', efeito: str(e.efeito) };
          if (arq.indexOf('Foco Místico') === 0) w.mystic = true;
          return w;
        });
    }

    // prof_* do Bestiário é o GRAU 0-4 (D5a, 2026-09-26), não o bônus 0/2/4/6/8
    // que a ficha guarda: grau = bônus / 2, arredondado para baixo, entre 0 e 4
    // (Leigo 0, Treinado 1, Experiente 2, Mestre 3, Lendário 4).
    function grauPericia(bonus) {
      var n = Math.floor(Number(bonus) / 2);
      return n > 0 ? Math.min(4, n) : 0;
    }

    return {
      REGRAS: REGRAS, COLUNAS: COLUNAS.slice(), grauPericia: grauPericia,
      tokens: tokens, empilhavelPorTexto: empilhavelPorTexto, empilhavelDe: empilhavelDe, colunaCanonica: colunaCanonica,
      modFor: modFor, estado: estado, calcular: calcular, projetar: projetar,
      conflito: conflito, alternar: alternar, trocar: trocar,
      novoUid: novoUid, chave: chave, acha: acha,
      normalizaEntrada: normalizaEntrada, entradaDeItem: entradaDeItem,
      mesclar: mesclar, fundir: fundir, remover: remover, quantidade: quantidade, mover: mover,
      quantidadePorId: quantidadePorId,
      migrarV1: migrarV1, indexar: indexar, reconciliar: reconciliar, armasBestiario: armasBestiario
    };
  })();
  // node:test carrega o motor por aqui (o artefato também: o ficha-v2.js para no node)
  if (typeof module === 'object' && module && module.exports) { module.exports = KhInv; return; }
  raiz.KhInv = KhInv;
})(typeof window !== 'undefined' ? window : this);

// ==== js/ficha/kh-estado.js ====
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

// ==== js/ficha/kh-efeitos.js ====
/* Khalkaria — Ficha · KhEfeitos: coleta dos Mods que mexem nos números (PURO, F3b).
 * De onde vem cada Mod (a "trilha"):
 *   raça / variante / subespécie  bônus de atributo (com "ou" e o alternativo), Ar natural
 *   identidade e entradas         Mods por fonte do contrato (Evasão, CD, Movimento, PMA, ações)
 *                                 + o snapshot entrada.mods (KhEstado.modsAplicaveis)
 *   nível                         +2 pontos por nível (atributos.porNivel)
 *   carta especial                +2 atributo (estado.pontos)
 *   condições ativas              efeitos do contrato (X, níveis, implicações, imunidade)
 *   itens                         data/efeitos.json pelo "quando" (carregado, equipado,
 *                                 sintonizado, munição em uso, ativado) e acumulaCopia
 *   ajustes                       ficha.ajustes (M2), só na trilha: quem aplica é o KhAjustes
 * Cada Mod: {alvo, op, valor, fonte:{tipo,id,nome}, status, ativo, motivo, ...}. Mod
 * inativo continua na trilha, com o motivo (nada some calado). O acúmulo entre
 * fontes (acumula:false / 'maior') é resolvido aqui; quem soma é o KhRegras.
 *
 * No node exporta por module.exports (carregado sozinho); no artefato js/ficha.js
 * o export já é o KhInv e este módulo só registra window.KhEfeitos no navegador.
 * Fonte: js/ficha/kh-efeitos.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhEstado = emNode ? require('./kh-estado.js') : raiz.KhEstado;

  var KhEfeitos = (function () {
    var ATRIBUTOS = ['FOR', 'DES', 'CON', 'INT', 'SAB'];
    var TIPOS_TECNICA = { tecnica: 1, ultimate: 1, marca: 1 };
    var QUANDO_ITEM = {
      carregado: function () { return true; },
      equipado: function (e) { return !!e.equipado; },
      sintonizado: function (e) { return !!e.sintonizado; },
      municaoAtiva: function (e) { return e.municaoAtiva === true; },
      ativado: function (e) { return e.ativo === true; }
    };
    var MOTIVO_QUANDO = {
      equipado: 'só quando equipado', sintonizado: 'só quando sintonizado',
      municaoAtiva: 'só com a munição em uso (ligação automática na F6)',
      ativado: 'só quando ativado (F6)'
    };

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function inteiro(x, p) { var n = parseInt(x, 10); return isFinite(n) ? n : p; }
    function chaveDe(id, pre) { return id && id.indexOf(pre) === 0 ? id.slice(pre.length) : null; }

    function mod(base, extra) { return Object.assign({ ativo: true, motivo: '' }, base, extra || {}); }
    function desliga(m, motivo) { m.ativo = false; if (!m.motivo) m.motivo = motivo; return m; }

    // ---------------- condições ----------------
    // Mods de UMA condição (com X): efeitos + níveis cumulativos até X
    function modsDeCondicao(dados, cond) {
      var def = dados.condicoes[cond.id];
      if (!def) return [];
      var nome = cond.x != null && def.x ? def.nome.replace(/\s+(X|\d+-\d+)$/, '') + ' ' + cond.x : def.nome;
      var fonte = { tipo: 'condicao', id: cond.id, nome: nome };
      var efs = lista(def.efeitos).slice();
      if (def.niveis) {
        var x = cond.x == null ? 1 : cond.x;
        Object.keys(def.niveis).map(Number).sort(function (a, b) { return a - b; }).forEach(function (n) {
          if (def.cumulativa ? n <= x : n === x) lista(def.niveis[String(n)]).forEach(function (e) { efs.push(Object.assign({ nivel: n }, e)); });
        });
      }
      return efs.map(function (e) {
        var m = mod({ alvo: e.alvo, op: e.op, valor: e.valor, fonte: fonte, status: e.st, fo: e.fo,
          x: cond.x, origemCondicao: cond.origem || 'ficha' });
        if (cond.stX && (dados.ordemStatus.indexOf(cond.stX) > dados.ordemStatus.indexOf(m.status))) m.status = cond.stX;
        ['tipoDano', 'momento', 'gatilho', 'escopo', 'nota', 'nivel'].forEach(function (k) { if (e[k] != null) m[k] = e[k]; });
        if (e.gatilho || e.momento) desliga(m, 'evento da Mesa (F5), não um número fixo');
        if (e.escopo) desliga(m, 'situacional: ' + e.escopo);
        if (cond.imune) desliga(m, 'imune a ' + def.nome + ' (' + cond.imune + ')');
        return m;
      });
    }

    // X inicial de uma condição sem X anotado: 'inicial' do contrato ou o padrão (G8, decisão)
    function xInicial(def) {
      if (!def.x) return { x: null };
      if (typeof def.x.inicial === 'number') return { x: def.x.inicial };
      if (typeof def.x.inicialPadrao === 'number') return { x: def.x.inicialPadrao, st: def.x.stPadrao || null };
      return { x: 1, st: 'semStatus' };
    }

    // condições ativas da ficha: empilhamento (mesma com X soma X; sem X renova),
    // implicações 'derivada' e imunidade a condição
    function condicoesAtivas(ficha, dados, imunes) {
      var porId = {}, ordem = [], avisos = [];
      lista(ficha.condicoes).forEach(function (c) {
        if (!obj(c) || !c.id) return;
        var def = dados.condicoes[c.id];
        if (!def) { avisos.push({ tipo: 'condicao-desconhecida', id: c.id }); return; }
        var xi = typeof c.x === 'number' ? { x: c.x } : xInicial(def);
        if (!porId[c.id]) { porId[c.id] = { id: c.id, nome: def.nome, x: xi.x, stX: xi.st || null, origem: 'ficha', uids: [] }; ordem.push(c.id); }
        else if (def.x && xi.x != null) {
          porId[c.id].x = (porId[c.id].x || 0) + xi.x;                 // empilhamento: mesmaCondicaoComX = somaX
          if (xi.st) porId[c.id].stX = xi.st;
        }
        porId[c.id].uids.push(c.uid);
      });
      ordem.forEach(function (id) {
        var def = dados.condicoes[id], c = porId[id];
        if (def.x && typeof def.x.max === 'number' && c.x > def.x.max) { avisos.push({ tipo: 'x-acima-do-maximo', id: id, x: c.x, max: def.x.max }); c.x = def.x.max; }
      });
      // implicações: só as 'derivada' (a 'separada', como o Exposto, é instância da Mesa)
      for (var passo = 0; passo < 3; passo++) {
        ordem.slice().forEach(function (id) {
          lista(dados.condicoes[id].implica).forEach(function (imp) {
            if (imp.modo !== 'derivada' || porId[imp.id] || !dados.condicoes[imp.id]) return;
            var d = dados.condicoes[imp.id], xi = xInicial(d);
            porId[imp.id] = { id: imp.id, nome: d.nome, x: xi.x, stX: xi.st || null, origem: 'implicada', de: id, uids: [] };
            ordem.push(imp.id);
          });
        });
      }
      ordem.forEach(function (id) { if (imunes[id]) porId[id].imune = imunes[id]; });
      return { lista: ordem.map(function (id) { return porId[id]; }), avisos: avisos };
    }

    // ---------------- raça ----------------
    function blocoRaca(ficha, dados) {
      var id = ficha.identidade && ficha.identidade.raca && ficha.identidade.raca.id;
      var chave = chaveDe(id, 'raca-');
      return chave && dados.racas[chave] ? { chave: chave, r: dados.racas[chave] } : null;
    }
    function idsIdentidade(ficha) {
      var i = ficha.identidade || {};
      return ['raca', 'variante', 'subespecie', 'classe', 'ramo', 'origem'].map(function (k) {
        return { campo: k, id: i[k] && i[k].id, nome: i[k] && i[k].nome };
      }).filter(function (x) { return !!x.id; });
    }
    function modsDeRaca(ficha, dados, out) {
      var br = blocoRaca(ficha, dados);
      if (!br) return;
      var r = br.r, ident = ficha.identidade, esc = obj(ident.escolhas) ? ident.escolhas : {};
      var sub = ident.subespecie && ident.subespecie.id && r.subespecies[ident.subespecie.id];
      var alt = esc['raca.atributos'] === 'alternativo';
      var bonus = sub ? sub.atributos : (alt ? r.alternativo : r.atributos);
      var fonte = sub ? { tipo: 'subespecie', id: ident.subespecie.id, nome: str(ident.subespecie.nome) || r.nome }
        : { tipo: 'raca', id: r.id, nome: r.nome + (alt ? ' (alternativo)' : '') };
      var migrado = ficha.atributos && ficha.atributos.migradoTotal === true;
      if (!bonus && r.atributos === null && !sub) {
        out.avisos.push({ tipo: 'raca-sem-subespecie', raca: r.id, msg: r.nome + ': os atributos variam por subespécie, e a ficha não tem uma' });
      }
      lista(bonus).forEach(function (b, i) {
        var chave = 'raca.atributos.' + i, n = b.quantidade || 1, escolhidos = [];
        if (Array.isArray(b.opcoes) && b.opcoes.length === 1) escolhidos = [b.opcoes[0]];
        else {
          var e = esc[chave];
          escolhidos = (Array.isArray(e) ? e : (e ? [e] : [])).filter(function (a) {
            return ATRIBUTOS.indexOf(a) >= 0 && (b.opcoes === 'qualquer' || lista(b.opcoes).indexOf(a) >= 0);
          });
        }
        if (escolhidos.length < n) {
          out.mods.push(desliga(mod({ alvo: 'atributo.?', op: 'soma', valor: b.valor, fonte: fonte, status: r.st, fo: r.fo,
            etapa: 'raca', escolha: chave }), (migrado ? 'já no total digitado na v2 (migração); ' : '') + 'escolha pendente: ' + (b.opcoes === 'qualquer' ? n + ' atributo(s) à escolha' : lista(b.opcoes).join(' ou ')) +
            ' (identidade.escolhas["' + chave + '"])'));
          return;
        }
        escolhidos.slice(0, n).forEach(function (a) {
          var m = mod({ alvo: 'atributo.' + a, op: 'soma', valor: b.valor, fonte: fonte, status: r.st, fo: r.fo, etapa: 'raca' });
          if (migrado) desliga(m, 'já no total digitado na v2 (migração)');
          out.mods.push(m);
        });
      });
      // Ar natural: o do traço da raça sempre; o da variante/subespécie só se for a da ficha
      lista(r.arNatural).forEach(function (a) {
        var daVariante = r.variantes.indexOf(a.fonte) >= 0;
        var tem = !daVariante || [ident.variante && ident.variante.id, ident.subespecie && ident.subespecie.id].indexOf(a.fonte) >= 0;
        var m = mod({ alvo: 'ar.natural', op: a.soma ? 'soma' : 'fixa', valor: a.valor, status: r.st, fo: r.fo,
          fonte: { tipo: daVariante ? 'variante' : 'raca', id: a.fonte, nome: a.nome || a.fonte } });
        if (!tem) return;
        out.mods.push(m);
      });
    }

    // ---------------- fontes do contrato (Evasão, CD, Movimento, PMA, ações) ----------------
    function modsDoContrato(id, fonte, dados, permanente, estado) {
      return lista(dados.fontes[id]).map(function (c) {
        var m = mod({ alvo: c.alvo, op: c.op, valor: c.valor, fonte: fonte, status: c.st, fo: c.fo });
        ['duracao', 'extra', 'dadoDefenderMinimo', 'condicao', 'escopo', 'nivel', 'custo'].forEach(function (k) { if (c[k] != null) m[k] = c[k]; });
        var passiva = /passiva/i.test(str(c.custo));
        if (c.duracao) desliga(m, 'situacional: dura ' + c.duracao);
        else if (c.escopo) desliga(m, 'situacional: ' + c.escopo);
        else if (!permanente && !passiva && !(estado && estado.ativo === true)) desliga(m, 'técnica: vale enquanto ativa (Mesa, F5)');
        return m;
      });
    }

    // ---------------- entradas ----------------
    function modsDeEntradas(ficha, dados, out) {
      var snapshot = KhEstado && KhEstado.modsAplicaveis ? KhEstado.modsAplicaveis(ficha) : [];
      var porUid = {};
      snapshot.forEach(function (s) { (porUid[s.uid] = porUid[s.uid] || []).push(s.mod); });
      lista(ficha.entradas).forEach(function (e) {
        if (!obj(e)) return;
        var nome = str(e.cache && e.cache.nome) || str(e.id);
        var fonte = { tipo: e.tipo, id: e.id, nome: nome };
        var permanente = !TIPOS_TECNICA[e.tipo];
        var estado = obj(e.estado) ? e.estado : {};
        lista(porUid[e.uid]).forEach(function (sm) {
          var m = mod(Object.assign({}, sm, { fonte: fonte, status: sm.status || 'semStatus' }));
          var q = sm.quando;
          if (q === 'ativo' || (!q && !permanente)) { if (estado.ativo !== true) desliga(m, 'vale enquanto ativa (Mesa, F5)'); }
          else if (q === 'escolhido' && !estado.escolhas) desliga(m, 'escolha pendente');
          if (e.orfao) m.motivo = m.motivo || 'entrada órfã: o snapshot dos Mods continua valendo';
          out.mods.push(m);
        });
        if (e.id) modsDoContrato(e.id, fonte, dados, permanente, estado).forEach(function (m) { out.mods.push(m); });
        // carta especial (+2 atributo, D13c): os pontos distribuídos ficam em estado.pontos
        if (e.tipo === 'carta' && estado.especial === true) {
          var p = obj(estado.pontos) ? estado.pontos : null;
          var st = dados.limiar.st;
          if (!p) out.mods.push(desliga(mod({ alvo: 'atributo.?', op: 'soma', valor: 2, fonte: fonte, status: st, fo: dados.limiar.fo,
            etapa: 'carta' }), 'pontos da carta especial não distribuídos (estado.pontos)'));
          else ATRIBUTOS.forEach(function (a) {
            var n = inteiro(p[a], 0);
            if (n) out.mods.push(mod({ alvo: 'atributo.' + a, op: 'soma', valor: n, fonte: fonte, status: st, fo: dados.limiar.fo, etapa: 'carta' }));
          });
        }
      });
    }

    // ---------------- nível (+2 por nível, D87) ----------------
    function modsDeNivel(ficha, dados, out) {
      var at = ficha.atributos || {}, nivel = inteiro(ficha.meta && ficha.meta.nivel, 1);
      var pn = obj(at.porNivel) ? at.porNivel : {};
      Object.keys(pn).sort().forEach(function (n) {
        var g = pn[n] || {}, nn = inteiro(n, 0);
        ATRIBUTOS.forEach(function (a) {
          var v = inteiro(g[a], 0);
          if (!v) return;
          var m = mod({ alvo: 'atributo.' + a, op: 'soma', valor: v, fonte: { tipo: 'nivel', id: 'nivel-' + n, nome: 'Nível ' + n },
            status: dados.atributos.porNivel.st, fo: dados.atributos.porNivel.fo, etapa: 'nivel' });
          if (nn > nivel) desliga(m, 'acima do nível atual (' + nivel + ')');
          else if (at.migradoTotal === true && at.nivelMigrado != null && nn <= at.nivelMigrado) desliga(m, 'já no total digitado na v2 (migração)');
          out.mods.push(m);
        });
      });
    }

    // ---------------- itens (data/efeitos.json) ----------------
    function modsDeItens(ficha, efeitos, out) {
      var inv = ficha.inventario || {};
      if (!efeitos) {
        var tem = ['bugigangas', 'equipamentos'].some(function (c) { return lista(inv[c]).length; });
        if (tem) out.avisos.push({ tipo: 'efeitos-indisponiveis', msg: 'Efeitos de item (data/efeitos.json) não carregados: itens não entram nos números' });
        out.efeitosDisponiveis = false;
        return;
      }
      var vistos = {};
      ['equipamentos', 'bugigangas'].forEach(function (col) {
        lista(inv[col]).forEach(function (e) {
          if (!obj(e) || !e.id) return;
          var ef = efeitos[e.id];
          if (!ef) return;
          var qtd = Math.max(1, inteiro(e.qtd, 1));
          var fonte = { tipo: 'item', id: e.id, nome: str(e.nome) || e.id, uid: e.uid };
          var noTotal = [];
          lista(ef.mods).forEach(function (m0) {
            var quando = m0.quando || ef.quando || 'carregado';
            var m = mod(Object.assign({}, m0, { fonte: fonte, status: m0.status || ef.status, quando: quando,
              copias: ef.acumulaCopia === false ? 1 : qtd, uid: e.uid }));
            var teste = QUANDO_ITEM[quando];
            if (!teste) desliga(m, 'quando "' + quando + '" fora do vocabulário');
            else if (!teste(e)) desliga(m, MOTIVO_QUANDO[quando] || 'inativo');
            if (/^capacidade\./.test(m.alvo)) desliga(m, 'capacidade vem do KhInv (inv.capacidade do registro) até a F6');
            if (m.op === 'escolha' || m.escolha) desliga(m, 'escolha do jogador (F6)');
            if (m.duracao) desliga(m, 'temporário (' + m.duracao + '): ativação na F6');
            var k = e.id + '|' + m0.alvo + '|' + m0.op;
            if (m.ativo && ef.acumulaCopia === false && vistos[k]) desliga(m, 'não acumula com outra cópia deste item');
            if (m.ativo) vistos[k] = true;
            // total migrado da v2: o contrato não diz se o jogador digitou o
            // atributo com o item ou sem ele. O Mod segue valendo (como na v2 o
            // item existia), marcado e com aviso, até o Pedro decidir.
            if (m.ativo && /^atributo\./.test(m.alvo) && obj(ficha.atributos) && ficha.atributos.migradoTotal === true) {
              m.motivo = 'pode já estar no total digitado na v2 (migração; pendente Pedro)';
              noTotal.push(m.alvo.replace(/^atributo\./, ''));
            }
            out.mods.push(m);
          });
          if (noTotal.length) out.avisos.push({ tipo: 'migracao-item-atributo', item: fonte.nome, uid: e.uid, atributos: noTotal,
            msg: fonte.nome + ' soma em ' + noTotal.join(', ') + ' por cima do total digitado na v2, que pode já contar o item ' +
              '(migração; pendente Pedro)' });
        });
      });
    }

    // ---------------- ajustes (só trilha; o KhAjustes aplica) ----------------
    function modsDeAjustes(ficha, out) {
      var aj = obj(ficha.ajustes) ? ficha.ajustes : {};
      Object.keys(aj).forEach(function (c) {
        var a = aj[c] || {};
        out.mods.push(mod({ alvo: c, op: a.modo, valor: a.valor, status: 'ajuste', etapa: 'ajuste', noFechamento: true,
          fonte: { tipo: 'ajuste', id: c, nome: str(a.motivo) || 'ajuste manual' },
          motivo: a.temporario && a.temporario.fim ? 'temporário até ' + a.temporario.fim : '' }));
      });
    }

    // ---------------- acúmulo entre fontes ----------------
    // Mod com acumula:false (ou 'maior') não soma com outras fontes no mesmo alvo:
    // vale o maior entre ele e a soma das outras (o perdedor fica inativo, com motivo).
    function valorNum(m) { return typeof m.valor === 'number' ? m.valor * (m.copias || 1) : null; }
    function resolverAcumulo(mods) {
      var grupos = {};
      mods.forEach(function (m) { if (m.ativo && m.op === 'soma' && valorNum(m) != null) (grupos[m.alvo] = grupos[m.alvo] || []).push(m); });
      Object.keys(grupos).forEach(function (alvo) {
        var g = grupos[alvo];
        g.filter(function (m) { return m.acumula === false || m.acumula === 'maior'; }).forEach(function (m) {
          if (!m.ativo) return;
          var outros = g.filter(function (o) { return o !== m && o.ativo && !(o.fonte && m.fonte && o.fonte.id === m.fonte.id && o.fonte.uid === m.fonte.uid); });
          if (!outros.length) return;
          var soma = outros.reduce(function (s, o) { return s + valorNum(o); }, 0);
          if (Math.abs(valorNum(m)) >= Math.abs(soma)) outros.forEach(function (o) { desliga(o, 'não acumula com ' + m.fonte.nome + ' (vale o maior)'); });
          else desliga(m, 'não acumula com outras fontes (vale o maior)');
        });
      });
      return mods;
    }

    // ---------------- coleta ----------------
    // opcoes: {dados (KhRegrasDados), efeitos (porId de data/efeitos.json) | null}
    function coletar(ficha, opcoes) {
      opcoes = opcoes || {};
      var dados = opcoes.dados || (raiz && raiz.KhRegrasDados) || (emNode ? require('./00-regras-dados.js') : null);
      var efeitos = opcoes.efeitos === undefined ? null : opcoes.efeitos;
      if (efeitos && efeitos.porId) efeitos = efeitos.porId;
      var out = { mods: [], condicoes: [], avisos: [], lembretes: [], efeitosDisponiveis: !!efeitos };
      ficha = ficha || {};
      modsDeRaca(ficha, dados, out);
      // identidade: Mods por fonte do contrato (variante/subespécie/raça/classe/ramo/origem)
      idsIdentidade(ficha).forEach(function (x) {
        modsDoContrato(x.id, { tipo: x.campo, id: x.id, nome: str(x.nome) || x.id }, dados, true).forEach(function (m) { out.mods.push(m); });
      });
      modsDeNivel(ficha, dados, out);
      modsDeEntradas(ficha, dados, out);
      modsDeItens(ficha, efeitos, out);
      // imunidade a condição: a marcada na ficha e a dos itens ativos
      var imunes = {};
      lista(ficha.imunidadesCondicao).forEach(function (c) { var id = obj(c) ? c.id : c; if (id) imunes[id] = 'ficha'; });
      out.mods.forEach(function (m) {
        var mm = /^imunidade\.condicao\.(.+)$/.exec(m.alvo || '');
        if (mm && m.ativo) imunes[mm[1]] = m.fonte.nome;
      });
      var ca = condicoesAtivas(ficha, dados, imunes);
      out.condicoes = ca.lista;
      ca.avisos.forEach(function (a) { out.avisos.push(a); });
      ca.lista.forEach(function (c) {
        modsDeCondicao(dados, c).forEach(function (m) { out.mods.push(m); });
        lista(dados.condicoes[c.id].implica).forEach(function (imp) {
          if (imp.modo !== 'derivada') out.lembretes.push({ tipo: 'implica', de: c.id, id: imp.id, modo: imp.modo });
        });
      });
      modsDeAjustes(ficha, out);
      resolverAcumulo(out.mods);
      return out;
    }

    // trilha: todos os Mods (ativos e inativos) de um alvo, ou agrupados por alvo
    function trilha(res, alvo) { return lista(res && res.mods).filter(function (m) { return m.alvo === alvo; }); }
    function porAlvo(res) {
      var o = {};
      lista(res && res.mods).forEach(function (m) { (o[m.alvo] = o[m.alvo] || []).push(m); });
      return o;
    }
    function porFonte(res) {
      var o = {};
      lista(res && res.mods).forEach(function (m) {
        var k = m.fonte ? m.fonte.tipo + ':' + m.fonte.id : '?';
        (o[k] = o[k] || []).push(m);
      });
      return o;
    }

    return {
      coletar: coletar, modsDeCondicao: modsDeCondicao, resolverAcumulo: resolverAcumulo,
      trilha: trilha, porAlvo: porAlvo, porFonte: porFonte
    };
  })();

  if (emNode) { module.exports = KhEfeitos; return; }
  raiz.KhEfeitos = KhEfeitos;
})(typeof window !== 'undefined' ? window : this);

// ==== js/ficha/kh-ajustes.js ====
/* Khalkaria — Ficha · KhAjustes: ajuste manual de campo derivado, por nó (PURO, F3b, M2).
 * O KhRegras avalia o grafo em ordem topológica e, ao FECHAR cada nó, chama
 * KhAjustes.aplicar(no, ajustes) antes que os dependentes o leiam: o ajuste é o
 * último termo daquele nó e se propaga (ajustar Mod.DES muda a Evasão e as
 * perícias de DES; ajustar a Evasão Passiva muda a Ativa).
 *   fixa  -> o campo vira o valor digitado
 *   soma  -> diferença sobre o calculado (acompanha o nível)
 * Caminho de estado (recurso.*.atual, base de atributo, grau…) é recusado: a
 * validação é a do KhEstado (PADRAO_AJUSTE, o mesmo do schema v3).
 * A conta continua visível: "calculado X · ajustado Y", e o chip avisa quando o
 * calculado mudou desde o ajuste (calculadoEm).
 *
 * No node exporta por module.exports (carregado sozinho); no artefato js/ficha.js
 * o export já é o KhInv e este módulo só registra window.KhAjustes no navegador.
 * Fonte: js/ficha/kh-ajustes.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhEstado = emNode ? require('./kh-estado.js') : raiz.KhEstado;

  var KhAjustes = (function () {
    var RE_DADO = /^\s*(?:(-?\d+)\s*\+\s*)?(\d+d\d+)(?:\s*([+-])\s*(\d+))?\s*$/;

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function str(x) { return x == null ? '' : String(x); }
    // número em pt-BR, com o sinal de menos tipográfico
    function fmt(n) {
      if (n === null || n === undefined) return '?';
      if (typeof n === 'boolean') return n ? 'sim' : 'não';
      if (typeof n === 'object' && n.dados) return textoDado(n);
      if (typeof n !== 'number') return str(n);
      var s = String(Math.round(n * 1000) / 1000).replace('.', ',');
      return s.charAt(0) === '-' ? '−' + s.slice(1) : s;
    }
    // {fixo, dados:['1d8']} <-> "13 + 1d8"
    // (dadosPrimeiro: "3d6 + 3", como o dano; senão "13 + 1d8", como a Evasão Ativa)
    function textoDado(d) {
      var partes = [];
      if (d.fixo && !d.dadosPrimeiro) partes.push(fmt(d.fixo));
      (d.dados || []).forEach(function (x) { partes.push(x); });
      if (d.fixo && d.dadosPrimeiro) partes.push(fmt(d.fixo));
      if (!partes.length) return '0';
      var s = partes.join(' + ');
      return s.replace(/\+ −/g, '− ');
    }
    function lerDado(txt) {
      var m = RE_DADO.exec(str(txt));
      if (!m) return null;
      var fixo = (m[1] ? parseInt(m[1], 10) : 0) + (m[4] ? (m[3] === '-' ? -1 : 1) * parseInt(m[4], 10) : 0);
      return { fixo: fixo, dados: [m[2]] };
    }

    function ehAjustavel(caminho) { return !!(KhEstado && KhEstado.ehCaminhoDeAjuste(caminho)); }

    // Aplica o ajuste do nó (se houver). Muda o nó no lugar e o devolve.
    // no: {caminho, valor, dado?, termos, formula:{simbolica, numerica}}
    function aplicar(no, ajustes) {
      var aj = obj(ajustes) ? ajustes[no.caminho] : null;
      no.calculado = no.dado ? textoDado(no.dado) : no.valor;
      no.ajuste = null;
      if (!aj) return no;
      no.avisos = no.avisos || [];
      var erro = KhEstado ? KhEstado.validarAjuste(no.caminho, aj) : 'sem-validador';
      if (erro) {
        no.avisos.push({ tipo: 'ajuste-recusado', erro: erro, msg: 'Ajuste em ' + no.caminho + ' recusado (' + erro + ')' });
        return no;
      }
      var antes = no.valor, novo, novoDado = null;
      if (no.dado) {
        if (aj.modo === 'fixa') {
          // expressão de dado ('1d12', '13 + 1d8'); número (dano fixo) vira só o fixo
          novoDado = typeof aj.valor === 'number' ? { fixo: aj.valor, dados: [] } : lerDado(aj.valor);
          if (!novoDado) { no.avisos.push({ tipo: 'ajuste-recusado', erro: 'valor-invalido', msg: 'Ajuste em ' + no.caminho + ' não é expressão de dado' }); return no; }
          novoDado.dadosPrimeiro = no.dado.dadosPrimeiro;
        }
        else { novoDado = { fixo: (no.dado.fixo || 0) + aj.valor, dados: (no.dado.dados || []).slice(), dadosPrimeiro: no.dado.dadosPrimeiro }; }
        novo = textoDado(novoDado);
      } else if (typeof aj.valor === 'boolean') {
        novo = aj.valor;
      } else if (aj.modo === 'fixa') {
        novo = aj.valor;
      } else if (typeof antes === 'number') {
        novo = antes + aj.valor;
      } else {
        no.avisos.push({ tipo: 'ajuste-sem-calculado', msg: 'Ajuste de diferença sem valor calculado em ' + no.caminho + ': vale só o fixo' });
        return no;
      }
      var calculadoNum = typeof no.calculado === 'number' ? no.calculado : null;
      no.valor = novo;
      if (novoDado) no.dado = novoDado;
      no.ajuste = {
        modo: aj.modo, valor: aj.valor, motivo: str(aj.motivo), temporario: aj.temporario || false,
        desde: aj.desde, origem: aj.origem || 'manual', calculadoEm: aj.calculadoEm == null ? null : aj.calculadoEm,
        mudou: aj.calculadoEm != null && calculadoNum != null && aj.calculadoEm !== calculadoNum
      };
      if (no.ajuste.mudou) no.avisos.push({ tipo: 'calculado-mudou', de: aj.calculadoEm, para: calculadoNum,
        msg: 'o calculado mudou de ' + fmt(aj.calculadoEm) + ' para ' + fmt(calculadoNum) });
      no.termos.push({
        rotulo: 'ajuste manual' + (aj.motivo ? ' (' + aj.motivo + ')' : ''),
        fonte: { tipo: 'ajuste', id: no.caminho, nome: str(aj.motivo) || 'ajuste manual' },
        op: aj.modo, valor: aj.valor, ativo: true,
        motivo: aj.temporario && aj.temporario.fim ? 'temporário até ' + aj.temporario.fim : '',
        status: 'ajuste'
      });
      no.formula.simbolica += aj.modo === 'fixa' ? ' → ajuste manual (valor fixo)' : ' + ajuste manual';
      no.formula.numerica += ' · calculado ' + fmt(no.calculado) + ' · ajustado ' + fmt(novo);
      return no;
    }

    // Tela "Ajustes" (M2): calculado × ajustado de cada ajuste, com o nó avaliado
    function listar(ficha, nos) {
      var aj = obj(ficha && ficha.ajustes) ? ficha.ajustes : {};
      return Object.keys(aj).sort().map(function (c) {
        var n = nos && nos[c];
        return { caminho: c, modo: aj[c].modo, valor: aj[c].valor, motivo: str(aj[c].motivo),
          desde: aj[c].desde, temporario: aj[c].temporario || false, origem: aj[c].origem || 'manual',
          calculado: n ? n.calculado : null, ajustado: n ? n.valor : null,
          mudou: !!(n && n.ajuste && n.ajuste.mudou), semNo: !n };
      });
    }

    return { aplicar: aplicar, listar: listar, ehAjustavel: ehAjustavel, fmt: fmt, textoDado: textoDado, lerDado: lerDado };
  })();

  if (emNode) { module.exports = KhAjustes; return; }
  raiz.KhAjustes = KhAjustes;
})(typeof window !== 'undefined' ? window : this);

// ==== js/ficha/kh-regras.js ====
/* Khalkaria — Ficha · KhRegras: motor de regras da ficha (PURO, F3b).
 * (ficha v3, KhRegrasDados, Mods do KhEfeitos, ajustes) -> um NÓ por número derivado:
 *   {caminho, rotulo, valor, calculado, ajuste, termos:[{rotulo, fonte:{tipo,id,nome},
 *    op, valor, ativo, motivo, status}], formula:{simbolica, numerica}, status, selos,
 *    avisos, lembretes}
 * A fórmula é o texto do tooltip que o Pedro pediu ("quero tudo que tenha cálculos
 * com tooltip mostrando a fórmula"): simbólica "10 + Vitalidade × Nível + Mod.CON ×
 * Nível" e numérica "= 10 + 6 × 3 + 2 × 3 = 34".
 *
 * O grafo é avaliado em ORDEM TOPOLÓGICA (Kahn sobre as dependências declaradas);
 * ao fechar cada nó o KhAjustes aplica o ajuste manual daquele caminho, antes que
 * os dependentes o leiam (M2). Termo não canônico nunca entra calado: leva o status
 * do contrato, e o nó junta os selos (plano §3.2).
 *
 * Fórmulas vêm como AST do js/ficha/00-regras-dados.js (tools/gerar_regras_ficha.py):
 * nada aqui faz eval. MODO SOMBRA (F3): só calcula em memória; nada grava.
 *
 * No node exporta por module.exports (carregado sozinho); no artefato js/ficha.js
 * o export já é o KhInv e este módulo só registra window.KhRegras no navegador.
 * Fonte: js/ficha/kh-regras.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhInv = emNode ? require('./kh-inv.js') : raiz.KhInv;
  var KhEfeitos = emNode ? require('./kh-efeitos.js') : raiz.KhEfeitos;
  var KhAjustes = emNode ? require('./kh-ajustes.js') : raiz.KhAjustes;
  function dadosPadrao() { return (raiz && raiz.KhRegrasDados) || (emNode ? require('./00-regras-dados.js') : null); }

  var KhRegras = (function () {
    var ATRIBUTOS = ['FOR', 'DES', 'CON', 'INT', 'SAB'];
    var TIPOS_DANO = ['cortante', 'contundente', 'perfurante', 'fogo', 'frio', 'eletrico',
      'veneno', 'acido', 'psiquico', 'radiante', 'trovejante', 'necrotico', 'forca', 'primordial'];
    var CATEGORIAS_AE = ['ordinario', 'elemental', 'biologico', 'mistico'];
    var NOME_TIPO = { cortante: 'Cortante', contundente: 'Contundente', perfurante: 'Perfurante', fogo: 'Fogo',
      frio: 'Frio', eletrico: 'Elétrico', veneno: 'Veneno', acido: 'Ácido', psiquico: 'Psíquico', radiante: 'Radiante',
      trovejante: 'Trovejante', necrotico: 'Necrótico', forca: 'Força', primordial: 'Primordial',
      ordinario: 'Ordinário', elemental: 'Elemental', biologico: 'Biológico', mistico: 'Místico', todos: 'Todos' };
    var NOME_INT = { contida: 'Contida', normal: 'Normal', forcada: 'Forçada', transbordante: 'Transbordante' };
    var COEF = { saude: 'V', stamina: 'G', eter: 'R' };
    var NOME_COEF = { V: 'Vitalidade', G: 'Vigor', R: 'Ressonância' };
    var NOME_REC = { saude: 'Saúde máx.', stamina: 'Stamina máx.', eter: 'Éter máx.', classe: 'Recurso de classe máx.' };
    var fmt = KhAjustes.fmt, textoDado = KhAjustes.textoDado;

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function inteiro(x, p) { var n = parseInt(x, 10); return isFinite(n) ? n : p; }
    function numero(x, p) { var n = parseFloat(x); return isFinite(n) ? n : p; }
    function chaveDe(id, pre) { return id && id.indexOf(pre) === 0 ? id.slice(pre.length) : null; }

    // ---------------- status ----------------
    function idxStatus(D, s) { var i = D.ordemStatus.indexOf(s); return i < 0 ? D.ordemStatus.length : i; }
    function pior(D, a, b) {
      if (!a || a === 'ajuste') return b || 'canonico';
      if (!b || b === 'ajuste') return a;
      return idxStatus(D, a) >= idxStatus(D, b) ? a : b;
    }

    // ---------------- AST ----------------
    // amb.ref(nome) -> {v, rot, fonte, st}; amb.escolha(noEsc, candidatos) -> índice ou null
    function aval(no, amb, D) {
      var r;
      switch (no.t) {
        case 'num':
          return { v: no.v, sim: fmt(no.v), num: numTxt(no.v), p: 3, st: no.st, fontes: [] };
        case 'ref':
          r = amb.ref(no.ref);
          return { v: r.v, sim: r.rot, num: numTxt(r.v), p: 3, st: pior(D, no.st, r.st), fontes: r.fonte ? [r.fonte] : [] };
        case 'neg':
          r = aval(no.a, amb, D);
          return { v: r.v == null ? null : -r.v, sim: '−' + par(r.sim, r.p, 2.5), num: '−' + par(r.num, r.p, 2.5),
            p: 2.5, st: pior(D, no.st, r.st), fontes: r.fontes };
        case 'op': {
          var a = aval(no.a, amb, D), b = aval(no.b, amb, D);
          var p = no.op === '+' || no.op === '-' ? 1 : 2;
          var v = a.v == null || b.v == null ? null
            : no.op === '+' ? a.v + b.v : no.op === '-' ? a.v - b.v : no.op === '*' ? a.v * b.v : a.v / b.v;
          var simb = { '+': ' + ', '-': ' − ', '*': ' × ', '/': ' / ' }[no.op];
          var dir = no.op === '-' || no.op === '/';
          var numB = par(b.num, b.p, p, dir);
          var numOp = simb;
          // "a + (−2)" e "a + (−2) × 3" viram "a − 2" e "a − 2 × 3": só quando o
          // primeiro fator de b é um número negativo inteiro entre parênteses
          var negB = no.op === '+' ? /^\(−([\d.,]+)\)/.exec(numB) : null;
          if (negB) { numOp = ' − '; numB = negB[1] + numB.slice(negB[0].length); }
          return { v: v, sim: par(a.sim, a.p, p) + simb + par(b.sim, b.p, p, dir),
            num: par(a.num, a.p, p) + numOp + numB, p: p, st: pior(D, no.st, pior(D, a.st, b.st)),
            fontes: a.fontes.concat(b.fontes) };
        }
        case 'fn': {
          var args = no.args.map(function (x) { return aval(x, amb, D); });
          var vs = args.map(function (x) { return x.v; });
          var nulo = vs.some(function (x) { return x == null; });
          var st = args.reduce(function (s, x) { return pior(D, s, x.st); }, no.st);
          var fo = args.reduce(function (l, x) { return l.concat(x.fontes); }, []);
          if (no.fn === 'floor') return { v: nulo ? null : Math.floor(vs[0] + 1e-9), sim: '⌊' + args[0].sim + '⌋',
            num: '⌊' + args[0].num + '⌋', p: 3, st: st, fontes: fo };
          var nome = no.fn === 'max' ? 'máx' : 'mín';
          return { v: nulo ? null : (no.fn === 'max' ? Math.max.apply(null, vs) : Math.min.apply(null, vs)),
            sim: nome + '(' + args.map(function (x) { return x.sim; }).join(', ') + ')',
            num: nome + '(' + args.map(function (x) { return x.num; }).join(', ') + ')', p: 3, st: st, fontes: fo };
        }
        case 'esc': {
          var cs = no.args.map(function (x) { return aval(x, amb, D); });
          var i = amb.escolha ? amb.escolha(no, cs) : null, trocado = i != null && cs[i];
          if (!trocado) {
            i = 0;
            cs.forEach(function (c, j) { if (c.v != null && (cs[i].v == null || c.v > cs[i].v)) i = j; });
          }
          var c = cs[i];
          return { v: c.v, sim: trocado ? c.sim + ' (escolhido)' : 'maior(' + cs.map(function (x) { return x.sim; }).join(', ') + ')',
            num: c.num, p: 3, st: pior(D, no.st, c.st), fontes: c.fontes, escolha: { i: i, trocado: !!trocado } };
        }
        default:
          throw new Error('KhRegras: nó de fórmula "' + no.t + '" sem avaliação aqui');
      }
    }
    // "= <conta> = <valor>", sem repetir quando a conta já é o valor
    function conta(num, v) { var fv = fmt(v); return num === fv || num === numTxt(v) ? '= ' + fv : '= ' + num + ' = ' + fv; }
    function numTxt(v) { return typeof v === 'number' && v < 0 ? '(' + fmt(v) + ')' : fmt(v); }
    // status de outro nó (o termo que o lê herda o selo dele: nada entra calado)
    function stNo(ctx, c) { var n = ctx.nos[c]; return n ? n.status : 'canonico'; }
    // média de um dado "NdF" (para "o dado do grau for menor")
    function mediaDado(t) { var m = /^(\d+)d(\d+)$/.exec(str(t).trim()); return m ? m[1] * (+m[2] + 1) / 2 : null; }
    function par(s, p, pai, direita) { return p < pai || (direita && p === pai) ? '(' + s + ')' : s; }
    // a soma do topo da AST vira termos (um por parcela)
    function parcelas(no, sinal, out) {
      if (no.t === 'op' && (no.op === '+' || no.op === '-')) {
        parcelas(no.a, sinal, out);
        parcelas(no.b, no.op === '-' ? -sinal : sinal, out);
      } else out.push({ no: no, sinal: sinal });
      return out;
    }
    function termosDaFormula(ast, amb, D) {
      return parcelas(ast, 1, []).map(function (x) {
        var r = aval(x.no, amb, D);
        return { rotulo: r.sim, fonte: r.fontes[0] || { tipo: 'regra', id: x.no.fo, nome: 'contrato' },
          op: x.no.t === 'op' || x.no.t === 'fn' || x.no.t === 'esc' || x.no.t === 'ref' || x.no.t === 'num' ? 'soma' : 'formula',
          valor: r.v == null ? null : x.sinal * r.v, ativo: true, motivo: r.escolha && r.escolha.trocado ? 'atributo trocado à mão (D7)' : '',
          status: r.st };
      });
    }

    // ---------------- nó ----------------
    function novoNo(caminho, rotulo) {
      return { caminho: caminho, rotulo: rotulo, valor: null, calculado: null, ajuste: null, termos: [],
        formula: { simbolica: '', numerica: '' }, status: 'canonico', selos: [], avisos: [], lembretes: [] };
    }
    function fechaStatus(no, D) {
      var st = 'canonico', selos = {};
      no.termos.forEach(function (t) {
        if (!t.ativo || t.status === 'ajuste') return;
        st = pior(D, st, t.status);
        var s = D.selos[t.status];
        if (s === undefined) s = D.selos.semStatus;
        if (s) selos[s] = true;
      });
      if (no.ajuste) selos.ajuste = true;
      no.status = st;
      no.selos = Object.keys(selos).sort();
      if (!no.formula.simbolica) no.formula.simbolica = no.rotulo;
      if (!no.formula.numerica) no.formula.numerica = '= ' + fmt(no.dado ? textoDado(no.dado) : no.valor);
      return no;
    }

    // ---------------- contexto ----------------
    function contexto(ficha, opcoes) {
      var D = opcoes.dados || dadosPadrao();
      if (!D) throw new Error('KhRegras: sem KhRegrasDados (js/ficha/00-regras-dados.js)');
      var efeitos = opcoes.efeitos === undefined ? null : opcoes.efeitos;
      if (efeitos && efeitos.porId) efeitos = efeitos.porId;
      var ef = KhEfeitos.coletar(ficha, { dados: D, efeitos: efeitos });
      var classeCh = chaveDe(ficha.identidade && ficha.identidade.classe && ficha.identidade.classe.id, 'classe-');
      var racaCh = chaveDe(ficha.identidade && ficha.identidade.raca && ficha.identidade.raca.id, 'raca-');
      var ctx = {
        ficha: ficha, D: D, ef: ef, efeitos: efeitos, nos: {}, avisos: ef.avisos.slice(),
        nivel: Math.max(1, Math.min(5, inteiro(ficha.meta && ficha.meta.nivel, 1))),
        classe: classeCh && D.classes[classeCh] ? D.classes[classeCh] : null,
        raca: racaCh && D.racas[racaCh] ? D.racas[racaCh] : null,
        escolhas: obj(ficha.identidade && ficha.identidade.escolhas) ? ficha.identidade.escolhas : {},
        sobrepeso: [], condicoes: ef.condicoes.slice()
      };
      ctx.v = function (c) { var n = ctx.nos[c]; return n ? n.valor : null; };
      // Mods do alvo (fora os ajustes, que o KhAjustes aplica no fechamento), já com os do Sobrepeso
      ctx.mods = function (alvos) {
        alvos = [].concat(alvos);
        return ef.mods.concat(ctx.sobrepeso).filter(function (m) { return !m.noFechamento && alvos.indexOf(m.alvo) >= 0; });
      };
      return ctx;
    }
    // valor numérico de um Mod: número × cópias, ou a AST com o X da condição
    function valorMod(m, ctx) {
      var v = m.valor;
      if (typeof v === 'number') return v * (m.copias || 1);
      if (obj(v) && v.t && v.t !== 'rolagem') {
        try {
          return aval(v, { ref: function (n) {
            if (n === 'X') return { v: m.x == null ? 1 : m.x, rot: 'X', st: 'canonico' };
            if (/^recurso\./.test(n)) return { v: ctx.v(n), rot: n, st: 'canonico' };
            return { v: null, rot: n, st: 'semStatus' };
          } }, ctx.D).v;
        } catch (e) { return null; }
      }
      return null;
    }
    function nomeFonte(m) { return m.fonte ? str(m.fonte.nome) || str(m.fonte.id) : 'fonte'; }
    // aceita: valores de 'condicao' (situacional) que valem neste nó
    function ativoPara(m, aceita) {
      if (!m.ativo) return { ativo: false, motivo: m.motivo };
      if (m.condicao && lista(aceita).indexOf(m.condicao) < 0) return { ativo: false, motivo: 'situacional: ' + m.condicao };
      return { ativo: true, motivo: m.motivo || '' };
    }
    // Soma os Mods 'soma' ao nó (termo + texto), devolve o total somado. Os
    // demais ops ficam para quem chama (vantagem, multiplica, fixa, lembretes).
    function somaMods(no, mods, ctx, aceita, txt) {
      var total = 0;
      mods.forEach(function (m) {
        if (m.op !== 'soma') return;
        var a = ativoPara(m, aceita), v = valorMod(m, ctx);
        if (v == null && a.ativo) { a = { ativo: false, motivo: 'valor não numérico (vai para o rolador na Mesa)' }; }
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: 'soma', valor: v == null ? m.valor : v,
          ativo: a.ativo, motivo: a.motivo, status: m.status || 'semStatus' });
        extraDoMod(no, m, a);
        if (!a.ativo) return;
        total += v;
        if (txt) { txt.sim.push({ op: v < 0 ? ' − ' : ' + ', t: nomeFonte(m) }); txt.num.push({ op: v < 0 ? ' − ' : ' + ', t: fmt(Math.abs(v)) }); }
      });
      return total;
    }
    // a parte do efeito que não é número (o 'extra' da fonte do contrato) nunca
    // some: termo inativo com o status da fonte + lembrete no nó
    function extraDoMod(no, m, a) {
      if (!m.extra) return;
      no.termos.push({ rotulo: nomeFonte(m) + ' (além do número)', fonte: m.fonte, op: 'lembrete', valor: m.extra, ativo: false,
        motivo: a.ativo ? 'lembrete: ' + m.extra + (m.dadoDefenderMinimo ? ' (aplicado no dado de Defender)' : '') : a.motivo,
        status: m.status || 'semStatus' });
      if (a.ativo) no.lembretes.push({ op: 'extra', msg: m.extra, fonte: m.fonte, status: m.status || 'semStatus' });
    }
    function junta(base, partes) { return partes.reduce(function (s, x) { return s + x.op + x.t; }, base); }
    function lembretes(no, mods, aceita) {
      mods.forEach(function (m) {
        if (['falhaAuto', 'semAcao', 'semReacao', 'lembrete'].indexOf(m.op) < 0 && !(m.op === 'fixa' && typeof m.valor !== 'number')) return;
        var a = ativoPara(m, aceita);
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: m.op, valor: m.valor, ativo: false,
          motivo: a.ativo ? 'lembrete: ' + m.op + (m.valor != null && typeof m.valor !== 'object' ? ' (' + m.valor + ')' : '') : a.motivo,
          status: m.status || 'semStatus' });
        if (a.ativo) no.lembretes.push({ op: m.op, alvo: m.alvo, valor: m.valor, fonte: m.fonte });
      });
    }

    // ---------------- testes (D81) ----------------
    // fontes: [{op:'vantagem'|'desvantagem', fonte}]; forcado: modo escolhido à mão
    function resolverTeste(fontes, forcado, dado) {
      var v = lista(fontes).filter(function (f) { return f.op === 'vantagem'; });
      var d = lista(fontes).filter(function (f) { return f.op === 'desvantagem'; });
      var auto = v.length && d.length ? 'normal' : v.length ? 'vantagem' : d.length ? 'desvantagem' : 'normal';
      var modo = forcado === 'vantagem' || forcado === 'desvantagem' || forcado === 'normal' ? forcado : auto;
      var die = dado || '1d20';
      var expr = modo === 'normal' ? die : (dado ? '2×' + die + (modo === 'vantagem' ? ', o maior' : ', o menor')
        : (modo === 'vantagem' ? '2d20kh1' : '2d20kl1'));
      var texto = forcado ? 'forçado à mão' : v.length && d.length ? 'vantagem e desvantagem se anulam (D81)'
        : (v.length > 1 || d.length > 1) ? 'não acumulam: vale uma só (D81)' : '';
      return { modo: modo, automatico: auto, expressao: expr, fontes: v.concat(d), anuladas: !!(v.length && d.length),
        texto: texto, criticoNoDadoUsado: true };
    }

    // ---------------- nós ----------------
    function noAtributoTotal(ctx, A) {
      var D = ctx.D, f = ctx.ficha, no = novoNo('atributo.' + A + '.total', D.atributos.nomes[A]);
      var at = f.atributos || {}, base = inteiro(at.base && at.base[A], 10);
      no.termos.push({ rotulo: at.migradoTotal ? 'Total digitado na v2 (migrado)' : 'Base', op: 'soma', valor: base, ativo: true,
        fonte: { tipo: 'ficha', id: 'atributos.base.' + A, nome: at.migradoTotal ? 'v2' : 'base' }, motivo: '', status: 'canonico' });
      var txt = { sim: [], num: [] };
      var mods = ctx.mods(['atributo.' + A, 'atributos']);
      var soma = somaMods(no, mods, ctx, [], txt);
      var total = base + soma;
      var sim = junta(at.migradoTotal ? 'Total migrado' : 'Base', txt.sim), num = junta(fmt(base), txt.num);
      mods.forEach(function (m) {
        if (m.op !== 'multiplica') return;
        var a = ativoPara(m, []), fator = valorMod(m, ctx);
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: 'multiplica', valor: fator, ativo: a.ativo, motivo: a.motivo, status: m.status });
        if (!a.ativo || fator == null) return;
        total = Math.floor(total * fator + 1e-9);
        sim = '⌊(' + sim + ') × ' + nomeFonte(m) + '⌋'; num = '⌊(' + num + ') × ' + fmt(fator) + '⌋';
      });
      // escolhas pendentes da raça/carta (atributo.?) ficam na trilha deste e de todos
      ctx.ef.mods.filter(function (m) { return m.alvo === 'atributo.?'; }).forEach(function (m) {
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: 'soma', valor: m.valor, ativo: false, motivo: m.motivo, status: m.status });
      });
      var fx = D.atributos.faixaAbsoluta;
      if (total < fx[0] || total > fx[1]) no.avisos.push({ tipo: 'fora-da-faixa', msg: A + ' ' + total + ' fora de ' + fx[0] + '–' + fx[1] });
      no.valor = total;
      no.formula = { simbolica: sim, numerica: conta(num, total) };
      return no;
    }
    function noAtributoMod(ctx, A) {
      var D = ctx.D, no = novoNo('atributo.' + A + '.mod', 'Mod.' + A);
      var amb = { ref: function (n) {
        return { v: ctx.v('atributo.' + A + '.total'), rot: A, st: stNo(ctx, 'atributo.' + A + '.total'),
          fonte: { tipo: 'no', id: 'atributo.' + A + '.total', nome: D.atributos.nomes[A] } };
      } };
      var r = aval(D.atributos.mod.ast, amb, D);
      no.termos.push({ rotulo: r.sim, fonte: { tipo: 'no', id: 'atributo.' + A + '.total', nome: D.atributos.nomes[A] },
        op: 'formula', valor: r.v, ativo: true, motivo: '', status: r.st });
      no.valor = r.v;
      no.formula = { simbolica: r.sim, numerica: conta(r.num, r.v) };
      return no;
    }
    function ambBase(ctx, extra) {
      return function (n) {
        var m = /^mod\.(\w+)$/.exec(n);
        if (m) return { v: ctx.v('atributo.' + m[1] + '.mod'), rot: 'Mod.' + m[1], st: stNo(ctx, 'atributo.' + m[1] + '.mod'),
          fonte: { tipo: 'no', id: 'atributo.' + m[1] + '.mod', nome: 'Mod.' + m[1] } };
        if (n === 'nivel') return { v: ctx.nivel, rot: 'Nível', st: 'canonico', fonte: { tipo: 'ficha', id: 'meta.nivel', nome: 'Nível ' + ctx.nivel } };
        if (extra && extra[n]) return extra[n];
        if (ctx.nos[n]) return { v: ctx.v(n), rot: ctx.nos[n].rotulo, st: ctx.nos[n].status, fonte: { tipo: 'no', id: n, nome: ctx.nos[n].rotulo } };
        return { v: null, rot: n, st: 'semStatus' };
      };
    }
    function escolhaAttr(ctx, chave) {
      var e = ctx.escolhas[chave];
      return function (no, cs) {
        if (!e) return null;
        var i = -1;
        no.args.forEach(function (a, j) { if (a.t === 'ref' && a.ref === 'mod.' + e) i = j; });
        return i >= 0 ? i : null;
      };
    }

    function noPericia(ctx, p) {
      var D = ctx.D, f = ctx.ficha, no = novoNo('pericia.' + p.id + '.total', p.nome);
      var grau = Math.max(0, Math.min(4, inteiro(f.pericias && f.pericias[p.id], 0)));
      var sim = [], num = [], total = 0, attr = null;
      if (p.modo === 'fixo') attr = p.atributos[0];
      else if (p.modo === 'maior') {
        var esc = f.periciasAttr && f.periciasAttr[p.id];
        if (p.atributos.indexOf(esc) >= 0) attr = esc;
        else p.atributos.forEach(function (a) { if (attr === null || ctx.v('atributo.' + a + '.mod') > ctx.v('atributo.' + attr + '.mod')) attr = a; });
        no.escolha = { atributos: p.atributos.slice(), usado: attr, trocado: attr === esc };
      }
      if (attr) {
        var m = ctx.v('atributo.' + attr + '.mod');
        no.termos.push({ rotulo: 'Mod.' + attr, fonte: { tipo: 'no', id: 'atributo.' + attr + '.mod', nome: 'Mod.' + attr },
          op: 'soma', valor: m, ativo: true, motivo: p.modo === 'maior' ? (no.escolha.trocado ? 'atributo trocado à mão (D7)' : 'o maior de ' + p.atributos.join('/') + ' (D7)') : '',
          status: pior(D, p.modo === 'maior' ? p.stEscolha : p.st, stNo(ctx, 'atributo.' + attr + '.mod')) });
        total += m;
        sim.push({ op: '', t: p.modo === 'maior' && !no.escolha.trocado ? 'maior(' + p.atributos.map(function (a) { return 'Mod.' + a; }).join(', ') + ')' : 'Mod.' + attr });
        num.push({ op: '', t: fmt(m) });
      } else if (p.modo === 'porArma') {
        no.termos.push({ rotulo: 'Atributo da arma', fonte: { tipo: 'regra', id: p.fo, nome: 'porArma' }, op: 'soma', valor: null,
          ativo: false, motivo: 'entra na linha de cada arma (porArma: Pesada FOR, Leve e Distância DES)', status: p.st });
        no.semAtributo = true;
      }
      var rot = D.graus.rotulos[grau], dadoUsado = p.modo === 'dado' ? p.dadoPorGrau[grau] : null;
      if (p.modo === 'dado') {
        var tGrau = { rotulo: 'Dado de Defender (' + rot + ')', fonte: { tipo: 'ficha', id: 'pericias.' + p.id, nome: rot },
          op: 'dado', valor: dadoUsado, ativo: true, motivo: 'sem atributo (D8a)', status: p.st };
        no.termos.push(tGrau);
        var simDado = 'Dado de Defender (' + rot + ')';
        // fonte do contrato que troca o dado quando o do grau é menor (Premonição Etérica)
        ctx.ef.mods.forEach(function (m) {
          if (!m.dadoDefenderMinimo) return;
          var a = ativoPara(m, []), menor = mediaDado(dadoUsado) < mediaDado(m.dadoDefenderMinimo);
          no.termos.push({ rotulo: nomeFonte(m) + ' (dado ' + m.dadoDefenderMinimo + ')', fonte: m.fonte, op: 'dado', valor: m.dadoDefenderMinimo,
            ativo: a.ativo && menor, motivo: !a.ativo ? a.motivo : menor ? m.extra : 'o dado do grau (' + dadoUsado + ') não é menor: fica o do grau',
            status: m.status || 'semStatus' });
          if (!a.ativo || !menor) return;
          tGrau.ativo = false; tGrau.motivo = 'trocado por ' + m.dadoDefenderMinimo + ' (' + nomeFonte(m) + ')';
          dadoUsado = m.dadoDefenderMinimo; simDado = 'Dado de Defender (' + nomeFonte(m) + ')';
        });
        no.dado = { fixo: 0, dados: [dadoUsado], dadosPrimeiro: true };
        sim.push({ op: '', t: simDado });
        num.push({ op: '', t: dadoUsado });
      } else {
        var bonus = D.graus.bonus[grau];
        no.termos.push({ rotulo: 'Treino (' + rot + ')', fonte: { tipo: 'ficha', id: 'pericias.' + p.id, nome: rot },
          op: 'soma', valor: bonus, ativo: true, motivo: '', status: D.graus.st });
        total += bonus;
        sim.push({ op: sim.length ? ' + ' : '', t: 'Treino' });
        num.push({ op: num.length ? ' + ' : '', t: fmt(bonus) });
      }
      var alvos = ['pericia.' + p.id, 'todosOsTestes', 'todasAsPericias'].concat(attr ? ['testes.' + attr] : [], p.tags.map(function (t) { return 'tag.' + t; }));
      var mods = ctx.mods(alvos);
      var aceita = p.id === 'defender' ? ['reacaoDefender'] : [];
      var txt = { sim: [], num: [] };
      var s = somaMods(no, mods, ctx, aceita, txt);
      total += s;
      var rol = [];
      mods.forEach(function (m) {
        if (m.op !== 'vantagem' && m.op !== 'desvantagem') return;
        var a = ativoPara(m, aceita);
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: m.op, valor: null, ativo: a.ativo, motivo: a.motivo, status: m.status });
        if (a.ativo) rol.push({ op: m.op, fonte: m.fonte });
      });
      lembretes(no, mods, aceita);
      ctx.mods(['permiteSemTreino.' + p.id]).forEach(function (m) {
        if (m.ativo) no.lembretes.push({ op: 'permiteSemTreino', fonte: m.fonte, valor: m.penalidade || null });
      });
      if (p.exigeTreino && grau === 0) no.lembretes.push({ op: 'exigeTreino', msg: p.nome + ' exige treino para fabricar' });
      var simTxt = junta(sim.map(function (x) { return x.op + x.t; }).join(''), txt.sim);
      if (p.modo === 'dado') {
        no.dado.fixo = s;
        no.valor = textoDado(no.dado);
        var nd = junta(dadoUsado, txt.num);
        no.formula = { simbolica: simTxt, numerica: '= ' + nd + (nd !== no.valor ? ' = ' + no.valor : '') };
      } else {
        no.valor = total;
        var numTxt0 = junta(num.map(function (x) { return x.op + x.t; }).join(''), txt.num);
        no.formula = { simbolica: simTxt || 'Treino', numerica: conta(numTxt0, total) };
      }
      no.rolagem = resolverTeste(rol, null, dadoUsado);
      return no;
    }

    function noRecursoMax(ctx, r) {
      var D = ctx.D, no = novoNo('recurso.' + r + '.max', NOME_REC[r]), cl = ctx.classe, rec = D.recursos[r];
      var k = COEF[r], coefMods = ctx.mods(['classe.' + k]);
      var coefBonus = 0;
      coefMods.forEach(function (m) {
        var a = ativoPara(m, []), v = valorMod(m, ctx);
        no.termos.push({ rotulo: nomeFonte(m) + ' (' + NOME_COEF[k] + ')', fonte: m.fonte, op: 'soma', valor: v, ativo: a.ativo, motivo: a.motivo, status: m.status });
        if (a.ativo && v != null) coefBonus += v;
      });
      var amb = { ref: ambBase(ctx, cl ? (function () {
        var x = {};
        x['classe.' + k] = { v: cl[k] + coefBonus, rot: NOME_COEF[k], st: cl.st,
          fonte: { tipo: 'classe', id: cl.id, nome: cl.nome + ' (' + NOME_COEF[k] + ' ' + cl[k] + (coefBonus ? (coefBonus > 0 ? ' + ' : ' − ') + fmt(Math.abs(coefBonus)) : '') + ')' } };
        return x;
      })() : null), escolha: escolhaAttr(ctx, 'attr.recurso.' + r) };
      var a = aval(rec.max, amb, D);
      if (!cl) {
        no.termos.push({ rotulo: NOME_COEF[k] + ' × Nível', fonte: { tipo: 'regra', id: rec.fo, nome: 'classe' }, op: 'soma', valor: null,
          ativo: false, motivo: 'classe não definida na ficha', status: rec.st });
        no.valor = null;
        no.formula = { simbolica: a.sim, numerica: '= ? (classe não definida)' };
        return no;
      }
      termosDaFormula(rec.max, amb, D).forEach(function (t) { no.termos.push(t); });
      var v = a.v, num = a.num;
      var mods = ctx.mods(['recurso.' + r + '.max']);
      var cond = mods.filter(function (m) { return m.fonte && m.fonte.tipo === 'condicao'; });
      var outros = mods.filter(function (m) { return !(m.fonte && m.fonte.tipo === 'condicao'); });
      var txt = { sim: [], num: [] };
      // bônus fixo
      v += somaMods(no, outros.filter(function (m) { return m.etapa !== 'reducaoPermanente'; }), ctx, [], txt);
      // bônus rolado (valor guardado por fonte, L09). A dívida que cresce
      // (Exigente acumulado, Cometa do Mártir: modo acumuladorPorEvento/rolaPorUso)
      // é redução permanente: entra DEPOIS do percentual (ordemMaximo, P03)
      var rolados = [], dividas = [];
      lista(ctx.ficha.entradas).forEach(function (e) {
        if (!e || !e.id) return;
        Object.keys(D.recursos.bonusRolados).forEach(function (chave) {
          var b = D.recursos.bonusRolados[chave];
          if (!(e.id === chave || e.id.slice(-chave.length - 1) === '-' + chave)) return;
          if (String(b.recurso).split(/[|,]/).indexOf(r) < 0) return;
          (b.modo === 'acumuladorPorEvento' || b.modo === 'rolaPorUso' ? dividas : rolados).push({ e: e, b: b });
        });
      });
      function somaRolados(xs, t) {
        xs.forEach(function (x) {
          var e = x.e, b = x.b, est = obj(e.estado) ? e.estado : {};
          var val = b.modo === 'valorFixo' ? b.valor : (b.modo === 'rolaUmaVez' ? est.valorRolado : est.acumulado);
          var nome = str(e.cache && e.cache.nome) || e.id;
          var ok = typeof val === 'number';
          var divida = b.modo === 'acumuladorPorEvento' || b.modo === 'rolaPorUso';
          no.termos.push({ rotulo: nome + (b.dado ? ' (' + b.dado + ')' : ''), fonte: { tipo: e.tipo, id: e.id, nome: nome }, op: 'soma',
            valor: ok ? val : null, ativo: ok,
            motivo: !ok ? (divida ? 'valor acumulado não anotado (estado.acumulado)' : 'valor rolado não anotado (estado.valorRolado)')
              : divida ? 'redução permanente acumulada, depois do percentual (P03)' : 'bônus rolado, valor anotado (L09)',
            status: D.recursos.ordemSt });
          if (ok) { v += val; t.sim.push({ op: val < 0 ? ' − ' : ' + ', t: nome }); t.num.push({ op: val < 0 ? ' − ' : ' + ', t: fmt(Math.abs(val)) }); }
        });
      }
      somaRolados(rolados, txt);
      var sim = junta(a.sim, txt.sim);
      num = junta(num, txt.num);
      // percentual
      outros.forEach(function (m) {
        if (m.op !== 'multiplica') return;
        var aa = ativoPara(m, []), f = valorMod(m, ctx);
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: 'multiplica', valor: f, ativo: aa.ativo && f != null, motivo: aa.motivo, status: pior(D, m.status, D.recursos.ordemSt) });
        if (!aa.ativo || f == null) return;
        v = v * f; sim = '(' + sim + ') × ' + nomeFonte(m); num = '(' + num + ') × ' + fmt(f);
      });
      // redução permanente
      var t2 = { sim: [], num: [] };
      v += somaMods(no, outros.filter(function (m) { return m.etapa === 'reducaoPermanente'; }), ctx, [], t2);
      somaRolados(dividas, t2);
      // condição (Desnutrido −10 × X)
      v += somaMods(no, cond.filter(function (m) { return m.op === 'soma'; }), ctx, [], t2);
      cond.forEach(function (m) {
        if (m.op !== 'multiplica') return;
        var aa = ativoPara(m, []), f = valorMod(m, ctx);
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: 'multiplica', valor: f, ativo: aa.ativo, motivo: aa.motivo, status: m.status });
        if (aa.ativo && f != null) { v = v * f; t2.sim.push({ op: ' × ', t: nomeFonte(m) }); t2.num.push({ op: ' × ', t: fmt(f) }); }
      });
      sim = junta(sim, t2.sim); num = junta(num, t2.num);
      // piso e arredondamento (floor, uma vez, no fim)
      var bruto = v;
      v = Math.floor(Math.max(0, v) + 1e-9);
      if (bruto < 0) { num = 'máx(0, ' + num + ')'; }
      no.valor = v;
      no.formula = { simbolica: sim, numerica: '= ' + num + (bruto !== v && bruto >= 0 ? ' = ' + fmt(bruto) + ' → ' + fmt(v) : ' = ' + fmt(v)) };
      return no;
    }

    function noRecursoClasse(ctx) {
      var D = ctx.D, no = novoNo('recurso.classe.max', NOME_REC.classe), cl = ctx.classe;
      if (!cl) { no.formula = { simbolica: 'Recurso de classe', numerica: '= ? (classe não definida)' }; return no; }
      if (!cl.medidores.length) {
        var rdc = cl.recursoDeClasse || { st: 'semStatus' };
        // D105: o recurso é um conjunto de características, não um contador (Espadachim, Teurgo)
        if (rdc.contador === false && rdc.itens && rdc.itens.length) {
          var itens = rdc.itens.join(' e ');
          no.rotulo = 'Recurso de classe';
          no.semContador = true;
          no.itens = rdc.itens.slice();
          no.termos.push({ rotulo: itens, fonte: { tipo: 'regra', id: rdc.fo || cl.fo, nome: 'contrato' },
            op: 'formula', valor: null, ativo: true, motivo: str(rdc.nota) || 'não é contador', status: rdc.st });
          no.formula = { simbolica: 'Recurso de classe de ' + cl.nome + ' = ' + itens + ' (' + (rdc.tipo || 'características') + ')',
            numerica: '= sem contador (não é contador: ' + (str(rdc.nota) || 'características da classe') + ')' };
          // contador digitado (ex.: migrado da v2): nunca descartado calado, vira aviso
          var rcf = ctx.ficha && ctx.ficha.recursos && ctx.ficha.recursos.classe;
          if (rcf && (str(rcf.nome) || inteiro(rcf.atual, 0))) {
            no.avisos.push({ tipo: 'recurso-sem-contador', msg: 'a ficha tem o contador "' + (str(rcf.nome) || 'recurso de classe') +
              '" (atual ' + inteiro(rcf.atual, 0) + '); pelo contrato (D105) o recurso de classe de ' + cl.nome +
              ' não é contador, então o número fica só como anotação' });
          }
          return no;
        }
        no.termos.push({ rotulo: 'Recurso de classe de ' + cl.nome, fonte: { tipo: 'regra', id: rdc.fo || cl.fo, nome: rdc.pergunta || 'contrato' },
          op: 'formula', valor: null, ativo: true, motivo: str(rdc.nota) || 'sem regra no contrato', status: rdc.st });
        no.formula = { simbolica: 'Recurso de classe de ' + cl.nome + ' (sem nome nem regra no contrato)',
          numerica: '= ? (' + (D.rotulosSelo[D.selos[rdc.st]] || 'pendente') + (rdc.pergunta ? ', ' + rdc.pergunta : '') + ')' };
        return no;
      }
      var med = cl.medidores[0], amb = { ref: ambBase(ctx) };
      var a = aval(med.max, amb, D);
      termosDaFormula(med.max, amb, D).forEach(function (t) { no.termos.push(t); });
      no.rotulo = med.nome + ' máx.';
      no.medidor = med.id;
      no.valor = a.v;
      no.formula = { simbolica: a.sim, numerica: conta(a.num, a.v) };
      return no;
    }

    function noEvasaoPassiva(ctx) {
      var D = ctx.D, no = novoNo('evasao.passiva', 'Evasão Passiva'), ev = D.derivados.evasao.passiva;
      var amb = { ref: ambBase(ctx) }, a = aval(ev.ast, amb, D);
      termosDaFormula(ev.ast, amb, D).forEach(function (t) { no.termos.push(t); });
      var txt = { sim: [], num: [] };
      var mods = ctx.mods(['evasao.passiva']);
      // valor 'fluxo' (Monge Evasivo): o Fluxo atual
      mods.forEach(function (m) { if (m.valor === 'fluxo') { m.valor = inteiro(ctx.ficha.recursos && ctx.ficha.recursos.classe && ctx.ficha.recursos.classe.atual, 0); } });
      var v = a.v + somaMods(no, mods, ctx, [], txt);
      lembretes(no, mods, []);
      no.valor = v;
      no.formula = { simbolica: junta(a.sim, txt.sim), numerica: conta(junta(a.num, txt.num), v) };
      return no;
    }
    function noEvasaoAtiva(ctx) {
      var D = ctx.D, no = novoNo('evasao.ativa', 'Evasão Ativa'), at = D.derivados.evasao.ativa;
      var pas = ctx.nos['evasao.passiva'], def = ctx.nos['pericia.defender.total'];
      var dd = def.dado || { fixo: 0, dados: [] };
      no.termos.push({ rotulo: 'Evasão Passiva', fonte: { tipo: 'no', id: 'evasao.passiva', nome: 'Evasão Passiva' }, op: 'soma',
        valor: pas.valor, ativo: true, motivo: '', status: pior(D, at.st, pas.status) });
      no.termos.push({ rotulo: 'Dado de Defender', fonte: { tipo: 'no', id: 'pericia.defender.total', nome: 'Defender' }, op: 'dado',
        valor: textoDado(dd), ativo: true, motivo: 'o dado não soma atributo (D8a); vale só contra quem te atacou, no turno dele (D8c)', status: pior(D, at.st, def.status) });
      no.dado = { fixo: (pas.valor == null ? 0 : pas.valor) + (dd.fixo || 0), dados: (dd.dados || []).slice() };
      no.valor = pas.valor == null ? null : textoDado(no.dado);
      var numA = fmt(pas.valor) + ' + ' + textoDado(dd);
      no.formula = { simbolica: 'Evasão Passiva + Dado de Defender',
        numerica: '= ' + numA + (no.valor == null ? ' = ?' : no.valor !== numA ? ' = ' + no.valor : '') };
      no.lembretes.push({ op: 'reacao', msg: 'gasta a reação; vale contra todos os ataques daquele agressor no turno dele' });
      // a parte não numérica das fontes da Passiva (ex.: "+1 Reação Máxima") vale aqui também
      pas.lembretes.filter(function (l) { return l.op === 'extra'; }).forEach(function (l) {
        no.termos.push({ rotulo: str(l.fonte && l.fonte.nome) + ' (além do número)', fonte: l.fonte, op: 'lembrete', valor: l.msg, ativo: false,
          motivo: 'lembrete (vem da Evasão Passiva): ' + l.msg, status: l.status });
        no.lembretes.push(l);
      });
      no.rolagem = def.rolagem;
      return no;
    }
    function noCD(ctx) {
      var D = ctx.D, no = novoNo('cd', 'CD'), cl = ctx.classe;
      if (!cl) { no.formula = { simbolica: 'CD da classe', numerica: '= ? (classe não definida)' }; return no; }
      var amb = { ref: ambBase(ctx), escolha: escolhaAttr(ctx, 'attr.cd') }, a = aval(cl.cd.ast, amb, D);
      termosDaFormula(cl.cd.ast, amb, D).forEach(function (t) { no.termos.push(t); });
      var txt = { sim: [], num: [] }, mods = ctx.mods(['cd']);
      var v = a.v + somaMods(no, mods, ctx, [], txt);
      no.valor = v;
      no.formula = { simbolica: junta(a.sim, txt.sim), numerica: conta(junta(a.num, txt.num), v) };
      return no;
    }

    function noCapacidade(ctx, col) {
      var D = ctx.D, nome = col === 'bugigangas' ? 'Bugigangas' : 'Equipamentos';
      var no = novoNo('capacidade.' + col, 'Capacidade de ' + nome), ast = D.derivados.inventario[col];
      var amb = { ref: ambBase(ctx) }, a = aval(ast, amb, D);
      no.termos.push({ rotulo: a.sim, fonte: { tipo: 'no', id: 'atributo.FOR.mod', nome: 'Mod.FOR' }, op: 'formula', valor: a.v, ativo: true, motivo: '', status: a.st });
      var carga = ctx.cargaInv, sim = a.sim, num = a.num, v = a.v;
      lista(carga && carga[col] && carga[col].bonus).forEach(function (b) {
        no.termos.push({ rotulo: b.nome, fonte: { tipo: 'item', id: b.id, nome: b.nome }, op: 'soma', valor: b.n, ativo: true,
          motivo: b.ignoradas ? b.ignoradas + ' cópia(s) não acumulam' : 'capacidade do item (KhInv)', status: 'canonico' });
        v += b.n; sim += ' + ' + b.nome; num += ' + ' + fmt(b.n);
      });
      ctx.mods(['capacidade.' + col]).forEach(function (m) {
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: m.op, valor: m.valor, ativo: false, motivo: m.motivo, status: m.status });
      });
      no.valor = v;
      no.formula = { simbolica: sim, numerica: conta(num, v) };
      return no;
    }
    function noCarga(ctx) {
      var D = ctx.D, no = novoNo('carga', 'Carga'), c = ctx.cargaInv;
      var cols = {};
      ['bugigangas', 'equipamentos'].forEach(function (col) {
        var max = ctx.v('capacidade.' + col), usado = c ? c[col].usado : 0;
        cols[col] = { usado: usado, max: max, estado: max == null ? 'ok' : KhInv.estado(usado, max) };
        no.termos.push({ rotulo: col === 'bugigangas' ? 'Bugigangas' : 'Equipamentos', fonte: { tipo: 'no', id: 'capacidade.' + col, nome: 'capacidade' },
          op: 'formula', valor: usado + '/' + fmt(max), ativo: true, motivo: cols[col].estado, status: pior(D, D.derivados.inventario.st, stNo(ctx, 'capacidade.' + col)) });
      });
      var ordem = { ok: 0, leve: 1, extremo: 2 };
      var pior0 = ordem[cols.bugigangas.estado] >= ordem[cols.equipamentos.estado] ? cols.bugigangas.estado : cols.equipamentos.estado;
      no.valor = pior0 === 'ok' ? 'nenhuma' : pior0;
      no.extra = { bugigangas: cols.bugigangas, equipamentos: cols.equipamentos, avisos: c ? c.avisos : [] };
      var id = pior0 === 'leve' ? 'sobrepeso-leve' : pior0 === 'extremo' ? 'sobrepeso-extremo' : null;
      ctx.sobrepeso = [];
      if (id) {
        ctx.sobrepeso = KhEfeitos.modsDeCondicao(D, { id: id, x: null, origem: 'carga' });
        ctx.condicoes.push({ id: id, nome: D.condicoes[id].nome, x: null, origem: 'carga' });
      }
      no.formula = { simbolica: 'Bugigangas usado/máx. · Equipamentos usado/máx. (vale a pior coluna)',
        numerica: '= ' + cols.bugigangas.usado + '/' + fmt(cols.bugigangas.max) + ' · ' + cols.equipamentos.usado + '/' +
          fmt(cols.equipamentos.max) + ' → ' + (id ? D.condicoes[id].nome : 'sem Sobrepeso') };
      return no;
    }

    function noMovimento(ctx) {
      var D = ctx.D, mv = D.derivados.movimento, no = novoNo('movimento', 'Movimento'), r = ctx.raca, f = ctx.ficha;
      var sub = r && f.identidade.subespecie && f.identidade.subespecie.id && r.subespecies[f.identidade.subespecie.id];
      var base = sub ? sub.movimento : (r ? r.movimento : null);
      var nomeBase = sub ? r.nomes[f.identidade.subespecie.id] || str(f.identidade.subespecie.nome) : (r ? r.nome : '');
      if (base == null) {
        no.termos.push({ rotulo: 'Base da raça', fonte: { tipo: 'regra', id: mv.fo, nome: 'basePorRaca' }, op: 'soma', valor: null,
          ativo: false, motivo: r ? r.nome + ' sem subespécie na ficha' : 'raça não definida na ficha', status: mv.st });
        no.formula = { simbolica: 'Base da raça + somas × multiplicações; fixo vence; múltiplo de 1,5 abaixo', numerica: '= ? (' + (r ? 'subespécie' : 'raça') + ' não definida)' };
        return no;
      }
      no.termos.push({ rotulo: 'Base (' + nomeBase + ')', fonte: { tipo: sub ? 'subespecie' : 'raca', id: sub ? f.identidade.subespecie.id : r.id, nome: nomeBase },
        op: 'soma', valor: base, ativo: true, motivo: '', status: mv.st });
      var mods = ctx.mods(['movimento']), txt = { sim: [], num: [] };
      var v = base + somaMods(no, mods, ctx, [], txt);
      var sim = junta('Base (' + nomeBase + ')', txt.sim), num = junta(fmt(base), txt.num);
      var temMult = false;
      mods.forEach(function (m) {
        if (m.op !== 'multiplica') return;
        var a = ativoPara(m, []), fator = valorMod(m, ctx);
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: 'multiplica', valor: fator, ativo: a.ativo, motivo: a.motivo, status: pior(D, m.status, mv.st) });
        if (!a.ativo || fator == null) return;
        if (!temMult) { sim = '(' + sim + ')'; num = '(' + num + ')'; temMult = true; }
        v = v * fator; sim += ' × ' + nomeFonte(m); num += ' × ' + fmt(fator);
      });
      var fixos = [];
      mods.forEach(function (m) {
        if (m.op !== 'fixa' || typeof valorMod(m, ctx) !== 'number') return;
        var a = ativoPara(m, []);
        var t = { rotulo: nomeFonte(m), fonte: m.fonte, op: 'fixa', valor: valorMod(m, ctx), ativo: a.ativo, motivo: a.motivo, status: pior(D, m.status, mv.st) };
        no.termos.push(t);
        if (a.ativo) fixos.push(t);
      });
      var bruto = v;
      if (fixos.length) {
        // fixo vence tudo; entre fixos, o menor (L25)
        var menor = fixos.reduce(function (x, t) { return t.valor < x.valor ? t : x; });
        fixos.forEach(function (t) { if (t !== menor) { t.ativo = false; t.motivo = 'entre fixos vale o menor (' + menor.rotulo + ')'; } });
        no.termos.forEach(function (t) { if (t.ativo && (t.op === 'soma' || t.op === 'multiplica')) t.motivo = (t.motivo ? t.motivo + '; ' : '') + 'vencido pelo fixo (' + menor.rotulo + ')'; });
        v = menor.valor;
        sim = 'fixo: ' + menor.rotulo + ' (vence somas e multiplicações)';
        num = fmt(menor.valor) + ' (fixo)';
      }
      v = Math.max(mv.piso, v);
      var arred = Math.floor(v / mv.passo + 1e-9) * mv.passo;
      no.valor = Math.round(arred * 100) / 100;
      no.formula = { simbolica: sim + '; piso ' + fmt(mv.piso) + '; múltiplo de ' + fmt(mv.passo) + ' abaixo',
        numerica: '= ' + num + (fixos.length || num === fmt(Math.round(bruto * 100) / 100) ? '' : ' = ' + fmt(Math.round(bruto * 100) / 100)) +
          (no.valor !== bruto ? ' → ' + fmt(no.valor) : '') };
      return no;
    }

    function noAcoes(ctx) {
      var D = ctx.D, no = novoNo('acoes', 'Ações por turno');
      no.termos.push({ rotulo: 'Base', fonte: { tipo: 'regra', id: D.turno.fo, nome: 'Sua Rodada' }, op: 'soma', valor: D.turno.acoes, ativo: true, motivo: '', status: D.turno.st });
      var mods = ctx.mods(['acoes']), txt = { sim: [], num: [] };
      var v = D.turno.acoes + somaMods(no, mods, ctx, [], txt);
      var sim = junta('3 ações', txt.sim), num = junta(fmt(D.turno.acoes), txt.num);
      var trava = null;
      mods.forEach(function (m) {
        if (m.op !== 'semAcao') return;
        var a = ativoPara(m, []);
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: 'semAcao', valor: 0, ativo: a.ativo, motivo: a.motivo, status: m.status });
        if (a.ativo) trava = m;
      });
      if (trava) { v = 0; sim += '; ' + nomeFonte(trava) + ': sem ações'; num = '0 (' + nomeFonte(trava) + ')'; }
      var bruto = v;
      v = Math.max(0, v);
      no.valor = v;
      no.formula = { simbolica: sim, numerica: '= ' + num + (bruto < 0 ? ' = ' + fmt(bruto) + ' → 0' : (trava || num === fmt(v) ? '' : ' = ' + fmt(v))) };
      return no;
    }

    function noAr(ctx) {
      var D = ctx.D, no = novoNo('ar', 'Armadura (Ar)'), nat = ctx.mods(['ar.natural']);
      var fixos = nat.filter(function (m) { return m.op === 'fixa' && m.ativo; });
      var base = 0, nomeBase = 'sem Ar natural';
      fixos.forEach(function (m) { if (m.valor > base) { base = m.valor; nomeBase = 'Ar natural (' + nomeFonte(m) + ')'; } });
      nat.forEach(function (m) {
        no.termos.push({ rotulo: 'Ar natural (' + nomeFonte(m) + ')', fonte: m.fonte, op: m.op, valor: m.valor,
          ativo: m.ativo && (m.op === 'soma' || m.valor === base), motivo: m.op === 'fixa' && m.valor !== base ? 'vale o maior Ar natural' : m.motivo, status: pior(D, m.status, D.defesa.arNatural.st) });
      });
      var txt = { sim: [], num: [] };
      var v = base + somaMods({ termos: [], lembretes: [] }, nat.filter(function (m) { return m.op === 'soma'; }), ctx, [], txt);
      var sim = junta(nomeBase, txt.sim), num = junta(fmt(base), txt.num);
      var t2 = { sim: [], num: [] };
      v += somaMods(no, ctx.mods(['ar']), ctx, [], t2);
      no.valor = v;
      no.formula = { simbolica: junta(sim, t2.sim) + ' (sem teto, D85)', numerica: conta(junta(num, t2.num), v) };
      return no;
    }
    function noAe(ctx, k) {
      var D = ctx.D, no = novoNo('ae.' + k, 'Ae(' + NOME_TIPO[k] + ')'), rs = ctx.ficha.resistencias || {};
      var base = k === 'todos' ? inteiro(rs.aeTodos, 0)
        : CATEGORIAS_AE.indexOf(k) >= 0 ? inteiro(rs.aeCategoria && rs.aeCategoria[k], 0)
          : inteiro(rs.tipos && rs.tipos[k] && rs.tipos[k].ae, 0);
      no.termos.push({ rotulo: 'Marcado na ficha', fonte: { tipo: 'ficha', id: 'resistencias', nome: 'ficha' }, op: 'soma', valor: base, ativo: true, motivo: '', status: 'canonico' });
      var txt = { sim: [], num: [] }, v = base + somaMods(no, ctx.mods(['ae.' + k]), ctx, [], txt);
      if (k === 'ordinario' && v) no.avisos.push({ tipo: 'ae-ordinario', msg: 'Ae(Ordinário) não existe (D67): é Ar. Não entra na mitigação dos 3 tipos ordinários.' });
      no.valor = v;
      no.formula = { simbolica: junta('ficha', txt.sim) + (D.defesa.aeMesmoTipo.modo === 'soma' ? ' (mesmo tipo soma, L26)' : ''), numerica: conta(junta(fmt(base), txt.num), v) };
      return no;
    }
    function noFlag(ctx, tipoFlag, t) {
      var D = ctx.D, letra = { resistencia: 'R', imunidade: 'I', vulnerabilidade: 'V' }[tipoFlag];
      var no = novoNo(tipoFlag + '.' + t, letra + '(' + NOME_TIPO[t] + ')'), rs = ctx.ficha.resistencias || {};
      var marcado = !!(rs.tipos && rs.tipos[t] && rs.tipos[t][letra]);
      no.termos.push({ rotulo: 'Marcado na ficha', fonte: { tipo: 'ficha', id: 'resistencias.tipos.' + t, nome: 'ficha' }, op: 'fixa', valor: marcado, ativo: marcado, motivo: '', status: 'canonico' });
      var v = marcado, quem = marcado ? ['ficha'] : [];
      ctx.mods([tipoFlag + '.' + t]).forEach(function (m) {
        var a = ativoPara(m, []);
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: m.op, valor: m.valor, ativo: a.ativo, motivo: a.motivo, status: m.status });
        if (a.ativo && m.valor === true) { v = true; quem.push(nomeFonte(m)); }
      });
      ctx.mods([tipoFlag]).forEach(function (m) {
        no.termos.push({ rotulo: nomeFonte(m), fonte: m.fonte, op: m.op, valor: m.valor, ativo: false, motivo: 'tipo à escolha do jogador (F6)', status: m.status });
      });
      no.valor = v;
      no.formula = { simbolica: letra + '(' + NOME_TIPO[t] + ') = ficha ou fonte', numerica: '= ' + (quem.length ? quem.join(', ') : 'nenhuma fonte') + ' = ' + fmt(v) };
      return no;
    }
    function categoriaDe(D, t) {
      var c = null;
      Object.keys(D.defesa.categorias).forEach(function (k) { if (D.defesa.categorias[k].indexOf(t) >= 0) c = k; });
      return c;
    }
    function noDefesa(ctx, t) {
      var D = ctx.D, no = novoNo('defesa.' + t, 'Redução fixa contra ' + NOME_TIPO[t]), cat = categoriaDe(D, t);
      var partes = [], v = 0;
      function termo(rot, cam, ativo, motivo, st) {
        var x = ctx.v(cam);
        no.termos.push({ rotulo: rot, fonte: { tipo: 'no', id: cam, nome: rot }, op: 'soma', valor: x, ativo: ativo, motivo: motivo || '', status: pior(D, st, stNo(ctx, cam)) });
        if (ativo && x) { v += x; partes.push([rot, x]); }
      }
      if (cat === 'ordinario') termo('Ar', 'ar', true, 'Ar só reduz dano Ordinário', D.defesa.arNatural.st);
      termo('Ae(' + NOME_TIPO[t] + ')', 'ae.' + t, true, '', D.defesa.aeMesmoTipo.st);
      if (cat && CATEGORIAS_AE.indexOf(cat) >= 0) {
        if (cat === 'ordinario') termo('Ae(Ordinário)', 'ae.ordinario', false, 'Ae(Ordinário) não existe (D67): é Ar', 'canonico');
        else termo('Ae(' + NOME_TIPO[cat] + ')', 'ae.' + cat, true, 'Ae da categoria cobre todos os tipos dela (L34)', D.defesa.aeCategoria.st);
      } else {
        no.termos.push({ rotulo: 'Ae de categoria', fonte: { tipo: 'regra', id: D.defesa.categoriasFo, nome: 'categorias' }, op: 'soma', valor: null,
          ativo: false, motivo: 'contrato rev. 7: ' + NOME_TIPO[t] + ' fica em "Outros", sem Ae de categoria (o CLAUDE.md §2 põe em Místico)', status: 'canonico' });
      }
      var cobre = D.defesa.aeTodos.cobre.indexOf(t) >= 0;
      termo('Ae(Todos)', 'ae.todos', cobre, cobre ? 'Ae(Todos) cobre os 9 atípicos (L26)' : 'Ae(Todos) não cobre ' + NOME_TIPO[t] + ' (L26)', D.defesa.aeTodos.st);
      var R = !!ctx.v('resistencia.' + t), I = !!ctx.v('imunidade.' + t), V = !!ctx.v('vulnerabilidade.' + t);
      no.extra = { R: R, I: I, V: V, categoria: cat, multiplicador: I ? 0 : (R && V ? 1 : R ? 0.5 : V ? 2 : 1) };
      no.valor = v;
      no.formula = { simbolica: (partes.length ? partes.map(function (p) { return p[0]; }).join(' + ') : 'sem redução fixa') +
          (I ? ' · Imune' : R && V ? ' · R e V se cancelam' : R ? ' · Resistente (÷2 antes)' : V ? ' · Vulnerável (×2 antes)' : ''),
        numerica: '= ' + (partes.length ? partes.map(function (p) { return fmt(p[1]); }).join(' + ') : '0') + ' = ' + fmt(v) };
      return no;
    }

    // ---------------- magia (D82, D96) ----------------
    // p: {id?, nome?, nivel, intensidade, intensidades?, escola?, modulacoes:[{id?, nome?, custo}],
    //     multiplicadores:[{fator, fonte}], descontos:[{valor, fonte, porModulacao?, pisoModulacao?}], pactuada}
    function custoMagia(p, D, caminho) {
      D = D || dadosPadrao();
      var M = D.magia, no = novoNo(caminho || ('magia.' + (p.id || 'x') + '.custo'), 'Custo em Éter' + (p.nome ? ' — ' + p.nome : ''));
      var nivel = inteiro(p.nivel, 0), it = p.intensidade || 'normal';
      if (!(nivel >= 1 && nivel <= 5)) {
        no.formula = { simbolica: 'Base do nível + intensidade + modulações', numerica: '= ? (nível da magia desconhecido)' };
        no.avisos.push({ tipo: 'magia-sem-nivel', msg: 'magia sem nível conhecido' });
        return no;
      }
      if (nivel === 1 && it === 'contida' && M.nivel1SemContida) {
        no.termos.push({ rotulo: 'Contida', fonte: { tipo: 'regra', id: M.custoMinimo.fo, nome: 'Magias de Nível 1' }, op: 'soma', valor: null,
          ativo: false, motivo: 'Magias de Nível 1 não possuem a intensidade Contida', status: M.custoMinimo.st });
        no.avisos.push({ tipo: 'intensidade-invalida', msg: 'Magias de Nível 1 não possuem a intensidade Contida' });
        no.formula = { simbolica: 'Base Nível 1 + Contida', numerica: '= ? (Nível 1 não tem Contida)' };
        return no;
      }
      if (p.intensidades && p.intensidades.indexOf(it) < 0) no.avisos.push({ tipo: 'intensidade-fora', msg: NOME_INT[it] + ' fora das intensidades da magia (' + p.intensidades.join('/') + ')' });
      var base = M.custoBase[nivel - 1], di = M.intensidade[it];
      no.termos.push({ rotulo: 'Base (Nível ' + nivel + ')', fonte: { tipo: 'regra', id: M.fo, nome: 'custo por nível' }, op: 'soma', valor: base, ativo: true, motivo: '', status: M.st });
      no.termos.push({ rotulo: NOME_INT[it], fonte: { tipo: 'regra', id: M.fo, nome: 'intensidade' }, op: 'soma', valor: di, ativo: true, motivo: '', status: M.st });
      var mods = lista(p.modulacoes), somaMod = 0;
      mods.forEach(function (m) {
        no.termos.push({ rotulo: 'Modulação ' + str(m.nome || m.id), fonte: { tipo: 'regra', id: M.fo, nome: 'modulação' }, op: 'soma', valor: m.custo, ativo: true,
          motivo: nivel === 1 && M.modulacaoEmTruquePrecoCheio ? 'em truque, preço cheio (D69)' : '', status: M.st });
        somaMod += m.custo;
      });
      var v = base + di + somaMod;
      var sim = 'Base Nv' + nivel + ' + ' + NOME_INT[it] + (mods.length ? ' + modulações' : '');
      var num = fmt(base) + (di < 0 ? ' − ' + fmt(-di) : ' + ' + fmt(di)) + (mods.length ? ' + ' + fmt(somaMod) : '');
      var excecao = null;
      if (nivel === 1 && it === 'normal' && !mods.length) excecao = 'Nível 1 Normal sem modulação';
      else if (p.pactuada && it === 'contida') excecao = 'Magia Pactuada em Contida (D96)';
      lista(p.multiplicadores).forEach(function (x) {
        var ativo = !excecao;
        no.termos.push({ rotulo: str(x.fonte && x.fonte.nome) || 'multiplicador', fonte: x.fonte || { tipo: 'regra', id: M.fo, nome: 'multiplicador' },
          op: 'multiplica', valor: x.fator, ativo: ativo, motivo: ativo ? 'multiplicador antes do desconto (P39)' : 'exceção do custo 0', status: x.st || M.st });
        if (!ativo) return;
        v = v * x.fator; sim = '(' + sim + ') × ' + str(x.fonte && x.fonte.nome); num = '(' + num + ') × ' + fmt(x.fator);
      });
      lista(p.descontos).forEach(function (d) {
        var ativo = !excecao, total = d.valor || 0;
        if (d.porModulacao) mods.forEach(function (m) { total += Math.max(0, Math.min(d.porModulacao, m.custo - (d.pisoModulacao || 0))); });
        no.termos.push({ rotulo: str(d.fonte && d.fonte.nome) || 'desconto', fonte: d.fonte || { tipo: 'regra', id: M.fo, nome: 'desconto' },
          op: 'soma', valor: -total, ativo: ativo, motivo: ativo ? (d.porModulacao ? '−' + d.valor + ' na magia e −' + d.porModulacao + ' em cada modulação (piso ' + (d.pisoModulacao || 0) + ' por modulação)' : 'desconto depois do multiplicador (P39)')
            : 'descontos não se aplicam à exceção do custo 0', status: d.st || M.st });
        if (!ativo) return;
        v -= total; sim += ' − ' + str(d.fonte && d.fonte.nome); num += ' − ' + fmt(total);
      });
      var bruto = v, piso = M.custoMinimo.valor;
      if (excecao) {
        v = 0;
        no.termos.push({ rotulo: 'Exceção: ' + excecao, fonte: { tipo: 'regra', id: M.custoMinimo.fo, nome: 'custo mínimo' }, op: 'fixa', valor: 0, ativo: true, motivo: 'custa 0 Éter', status: M.custoMinimo.st });
        no.formula = { simbolica: sim + ' (exceção: ' + excecao + ')', numerica: '= ' + num + ' → 0 (exceção)' };
      } else {
        v = Math.max(piso, Math.floor(v + 1e-9));
        no.termos.push({ rotulo: 'Custo mínimo', fonte: { tipo: 'regra', id: M.custoMinimo.fo, nome: 'custo mínimo' }, op: 'minimo', valor: piso,
          ativo: bruto < piso, motivo: 'toda conjuração custa no mínimo ' + piso + ' Éter, depois das reduções (D82)', status: M.custoMinimo.st });
        no.formula = { simbolica: 'máx(' + piso + ', ' + sim + ')', numerica: '= máx(' + piso + ', ' + num + ') = ' + fmt(v) };
      }
      if (nivel === 5) no.lembretes.push({ op: 'requisito', msg: 'Nível 5 exige Foco Primordial (' + M.focoPrimordial.requisito + ')' });
      no.valor = v;
      return fechaStatus(no, D);
    }
    function noMagia(ctx, e) {
      var D = ctx.D, info = D.magia.porId[e.id], est = obj(e.estado) ? e.estado : {};
      var caminho = 'magia.' + e.id + '.custo';
      if (!info) {
        var no0 = novoNo(caminho, 'Custo em Éter — ' + str(e.cache && e.cache.nome));
        no0.formula = { simbolica: 'Base do nível + intensidade + modulações', numerica: '= ? (magia fora das regras compiladas)' };
        return no0;
      }
      var mult = [];
      D.magia.multiplicadores.forEach(function (m) {
        if (m.alvo !== 'eter') return;
        var tem = lista(ctx.ficha.entradas).some(function (x) { return x && x.id === m.fonte; }) ||
          ctx.condicoes.some(function (c) { return 'condicao:' + c.id === m.fonte; });
        if (tem) mult.push({ fator: m.fator, fonte: { tipo: 'regra', id: m.fonte, nome: m.fonte }, st: m.st });
      });
      var escola = D.magia.modulacoes[info.escola] || {};
      var mods = lista(est.modulacoes).map(function (id) { return { id: id, nome: id, custo: escola[id] }; })
        .filter(function (m) { return typeof m.custo === 'number'; });
      var p = { id: e.id, nome: str(e.cache && e.cache.nome), nivel: info.nivel, intensidade: est.intensidade || 'normal',
        intensidades: info.intensidades, modulacoes: mods, multiplicadores: mult, descontos: [], pactuada: est.pactuada === true };
      var no = custoMagia(p, D, caminho);
      no.magia = { id: e.id, nivel: info.nivel, escola: info.escola, intensidade: p.intensidade };
      // o custo nas 4 intensidades (tabela do grimório e prévia): a mesma conta,
      // com as mesmas modulações e multiplicadores; o ajuste manual do nó vale só
      // para a intensidade escolhida (estado.intensidade)
      no.porIntensidade = Object.keys(NOME_INT).map(function (it) {
        var sub = custoMagia(Object.assign({}, p, { intensidade: it }), D, caminho + '.' + it);
        return { intensidade: it, nome: NOME_INT[it], escolhida: it === p.intensidade,
          permitida: lista(info.intensidades).indexOf(it) >= 0, no: sub };
      });
      return no;
    }

    // ---------------- ataques (PMA como display) ----------------
    function armasEquipadas(ctx) {
      if (!ctx.efeitos) return [];
      return lista(ctx.ficha.inventario && ctx.ficha.inventario.equipamentos).filter(function (e) {
        var ef = e && e.equipado && e.id && ctx.efeitos[e.id];
        return ef && ef.arma && ef.arma.dados && ef.arma.atributo;
      }).map(function (e) { return { e: e, arma: ctx.efeitos[e.id].arma, st: ctx.efeitos[e.id].status }; });
    }
    // Mod de ataque vale para a própria arma e para o que não é arma (munição, anel);
    // o de OUTRA arma não entra nesta linha
    function daArma(ctx, x, uid) {
      if (!x.uid || x.uid === uid) return true;
      var ef = ctx.efeitos && x.fonte && ctx.efeitos[x.fonte.id];
      return !(ef && ef.arma);
    }
    function noAtaque(ctx, w) {
      var D = ctx.D, e = w.e, arma = w.arma, no = novoNo('ataque.' + e.uid + '.atacar', 'Atacar — ' + str(e.nome));
      var at = ctx.nos['pericia.atacar.total'], A = arma.atributo, m = ctx.v('atributo.' + A + '.mod');
      no.termos.push({ rotulo: 'Atacar (treino e fontes)', fonte: { tipo: 'no', id: 'pericia.atacar.total', nome: 'Atacar' }, op: 'soma', valor: at.valor, ativo: true, motivo: '', status: at.status });
      no.termos.push({ rotulo: 'Mod.' + A + ' (' + arma.arquetipo + ')', fonte: { tipo: 'no', id: 'atributo.' + A + '.mod', nome: 'Mod.' + A }, op: 'soma', valor: m, ativo: true, motivo: 'atributo da arma (porArma)', status: pior(D, w.st, stNo(ctx, 'atributo.' + A + '.mod')) });
      var v = (at.valor || 0) + m, sim = 'Atacar + Mod.' + A, num = fmt(at.valor) + (m < 0 ? ' − ' + fmt(-m) : ' + ' + fmt(m));
      if (arma.bonusAtacar) {
        no.termos.push({ rotulo: 'Bônus da arma', fonte: { tipo: 'item', id: e.id, nome: str(e.nome) }, op: 'soma', valor: arma.bonusAtacar, ativo: true, motivo: '', status: w.st });
        v += arma.bonusAtacar; sim += ' + bônus da arma'; num += ' + ' + fmt(arma.bonusAtacar);
      }
      var txt = { sim: [], num: [] };
      v += somaMods(no, ctx.mods(['ataque.bonusAtacar']).filter(function (x) { return daArma(ctx, x, e.uid); }), ctx, [], txt);
      sim = junta(sim, txt.sim); num = junta(num, txt.num);
      // progressão: 1º, 2º, 3º… = total + (i−1)·pma; n = ⌊ações / custo de Atacar⌋
      // PMA: 'fixa' troca a base (−5); 'soma' soma sobre a PMA em vigor ("de −5 para −3")
      var pma = D.turno.pma, pmaTxt = [], somasPma = [], fixaPma = null;
      ctx.mods(['pma']).forEach(function (x) {
        var okCond = !x.condicao || (x.condicao === 'armas de arremesso' && arma.arremessar != null);
        var okOp = (x.op === 'fixa' || x.op === 'soma') && typeof x.valor === 'number';
        var ativo = x.ativo && okCond && okOp;
        var t = { rotulo: 'PMA: ' + nomeFonte(x), fonte: x.fonte, op: x.op, valor: x.valor, ativo: ativo,
          motivo: !x.ativo ? x.motivo : !okCond ? 'só com ' + x.condicao : !okOp ? 'op "' + x.op + '" na PMA fora do motor' : '', status: x.status };
        no.termos.push(t);
        if (!ativo) return;
        if (x.op === 'fixa') { fixaPma = t; pma = x.valor; } else somasPma.push(t);
        pmaTxt.push(nomeFonte(x));
      });
      somasPma.forEach(function (t) {
        pma += t.valor;
        // fixa + soma ao mesmo tempo: a ordem não está no contrato
        if (fixaPma) { t.status = pior(D, t.status, 'semStatus'); t.motivo = 'somado depois do fixo (' + fixaPma.rotulo + '): ordem fixa/soma na PMA não fechada no contrato'; }
      });
      var acoes = ctx.v('acoes'), custo = arma.acoes || 1, n = acoes == null ? 0 : Math.floor(acoes / custo);
      no.valor = v;
      no.formula = { simbolica: sim, numerica: conta(num, v) };
      no.progressao = { pma: pma, n: n, custoAtacar: custo, acoes: acoes, fontesPma: pmaTxt, st: D.derivados.progressao.st };
      return no;
    }
    function fechaProgressao(no, D) {
      var p = no.progressao, linhas = [];
      for (var i = 1; i <= p.n; i++) linhas.push(no.valor + (i - 1) * p.pma);
      p.linhas = linhas;
      p.texto = linhas.map(function (x, i) { return (i + 1) + 'º ' + (x < 0 ? '−' + (-x) : '+' + x); }).join(' · ');
      no.termos.push({ rotulo: 'Progressão (PMA ' + p.pma + ')', fonte: { tipo: 'regra', id: D.derivados.progressao.fo, nome: 'progressão de ataques' }, op: 'formula',
        valor: p.texto, ativo: false, motivo: 'display: ' + p.n + ' ataque(s) = ⌊' + p.acoes + ' ações / ' + p.custoAtacar + '⌋', status: p.st });
      no.formula.numerica += ' → ' + (p.texto || 'sem ações para atacar');
      no.selosProgressao = D.selos[p.st] ? [D.selos[p.st]] : [];
    }
    function noDano(ctx, w) {
      var D = ctx.D, e = w.e, arma = w.arma, no = novoNo('ataque.' + e.uid + '.dano', 'Dano — ' + str(e.nome));
      var A = arma.atributo, m = ctx.v('atributo.' + A + '.mod');
      no.termos.push({ rotulo: 'Dados da arma (' + arma.tipo + ')', fonte: { tipo: 'item', id: e.id, nome: str(e.nome) }, op: 'dado', valor: arma.dados, ativo: true, motivo: '', status: w.st });
      no.termos.push({ rotulo: 'Mod.' + A, fonte: { tipo: 'no', id: 'atributo.' + A + '.mod', nome: 'Mod.' + A }, op: 'soma', valor: m, ativo: true, motivo: '', status: pior(D, w.st, stNo(ctx, 'atributo.' + A + '.mod')) });
      no.dado = { fixo: m, dados: [arma.dados], dadosPrimeiro: true };
      var extras = [];
      lista(arma.danoExtra).forEach(function (x) {
        extras.push(x.dados + ' ' + x.tipo);
        no.termos.push({ rotulo: 'Extra ' + x.tipo, fonte: { tipo: 'item', id: e.id, nome: str(e.nome) }, op: 'dado', valor: x.dados + ' ' + x.tipo, ativo: true, motivo: '', status: w.st });
      });
      ctx.mods(['ataque.danoExtra']).filter(function (x) { return daArma(ctx, x, e.uid); }).forEach(function (x) {
        no.termos.push({ rotulo: nomeFonte(x), fonte: x.fonte, op: 'dado', valor: x.valor, ativo: false, motivo: 'dano extra: lembrete na linha de ataque (Mesa)', status: x.status });
      });
      ctx.mods(['danoCausado']).forEach(function (x) {
        no.termos.push({ rotulo: nomeFonte(x), fonte: x.fonte, op: x.op, valor: valorMod(x, ctx), ativo: false, motivo: 'no dano FINAL rolado (Mesa)', status: x.status });
        if (x.ativo) no.lembretes.push({ op: x.op, valor: valorMod(x, ctx), fonte: x.fonte, msg: 'dano final × ' + fmt(valorMod(x, ctx)) });
      });
      no.valor = textoDado(no.dado);
      no.extra = { extras: extras, margemAmeaca: arma.margemAmeaca, multiplicadorCritico: arma.multiplicadorCritico, tipo: arma.tipo };
      no.formula = { simbolica: 'Dados da arma + Mod.' + A + (extras.length ? ' + extras' : ''),
        numerica: '= ' + arma.dados + (m < 0 ? ' − ' + fmt(-m) : ' + ' + fmt(m)) + (extras.length ? ' + ' + extras.join(' + ') : '') };
      return no;
    }

    // ---------------- Stamina comprometida (D19) ----------------
    // Reserva visível: disponível = atual − comprometida. O campo é da ficha
    // (removível: zerar a reserva); o contrato ainda não tem fonte que reserve.
    function noStaminaDisponivel(ctx) {
      var D = ctx.D, no = novoNo('recurso.stamina.disponivel', 'Stamina disponível');
      var st = ctx.ficha.recursos && ctx.ficha.recursos.stamina || {};
      var atual = numero(st.atual, 0), res = Math.max(0, numero(st.comprometida, 0));
      no.termos.push({ rotulo: 'Stamina atual', fonte: { tipo: 'ficha', id: 'recursos.stamina.atual', nome: 'atual' }, op: 'soma', valor: atual,
        ativo: true, motivo: '', status: 'canonico' });
      no.termos.push({ rotulo: 'Comprometida (D19)', fonte: { tipo: 'ficha', id: 'recursos.stamina.comprometida', nome: 'reserva' }, op: 'soma',
        valor: -res, ativo: res > 0, motivo: res > 0 ? 'reserva comprometida: removível zerando o campo (D19)' : 'sem reserva', status: 'decisao' });
      no.valor = Math.max(0, atual - res);
      no.formula = { simbolica: 'Stamina atual − comprometida (D19)', numerica: conta(fmt(atual) + ' − ' + fmt(res), no.valor) };
      if (atual - res < 0) no.avisos.push({ tipo: 'reserva-maior-que-atual', msg: 'reserva comprometida (' + fmt(res) + ') maior que a Stamina atual (' + fmt(atual) + ')' });
      return no;
    }

    // ---------------- Limiar (D13) ----------------
    function noLimiar(ctx) {
      var D = ctx.D, L = D.limiar, no = novoNo('limiar.saldo', 'Pontos do Limiar');
      var niveis = L.niveis.filter(function (n) { return n <= ctx.nivel; });
      var pontos = niveis.length * L.pontosPorNivel;
      no.termos.push({ rotulo: L.pontosPorNivel + ' por nível (' + (niveis.join(', ') || 'nenhum ainda') + ')', fonte: { tipo: 'regra', id: L.fo, nome: 'Limiar' },
        op: 'soma', valor: pontos, ativo: true, motivo: '', status: L.st });
      var gasto = 0, partes = [], semPosicao = 0;
      lista(ctx.ficha.entradas).forEach(function (e) {
        if (!e || e.tipo !== 'carta') return;
        var est = obj(e.estado) ? e.estado : {}, nome = str(e.cache && e.cache.nome) || str(e.id);
        var custo = null, motivo = '';
        if (est.especial === true) { custo = L.especial; motivo = 'carta especial: sempre ' + L.especial + ' (D13c)'; }
        else if (inteiro(est.posicaoNaMao, 0) >= 1 && inteiro(est.posicaoNaMao, 0) <= L.custoPorPosicao.length) {
          custo = L.custoPorPosicao[inteiro(est.posicaoNaMao, 0) - 1];
          motivo = est.posicaoNaMao + 'ª da mão' + (custo === 0 ? ' (grátis)' : '');
        } else { motivo = 'posição na mão não anotada (estado.posicaoNaMao)'; semPosicao++; }
        no.termos.push({ rotulo: nome, fonte: { tipo: 'carta', id: e.id, nome: nome }, op: 'soma', valor: custo == null ? null : -custo,
          ativo: custo != null, motivo: motivo, status: L.st });
        if (custo) { gasto += custo; partes.push(custo); }
      });
      no.valor = pontos - gasto;
      if (semPosicao) no.avisos.push({ tipo: 'carta-sem-posicao', cartas: semPosicao,
        msg: semPosicao + (semPosicao === 1 ? ' carta sem posição na mão: o saldo não a desconta' : ' cartas sem posição na mão: o saldo não as desconta') });
      if (no.valor < 0) no.avisos.push({ tipo: 'saldo-negativo', msg: 'saldo do Limiar negativo (aviso, sem trava)' });
      var custoTxt = 'custo das cartas (' + L.custoPorPosicao.map(function (c) { return c === 0 ? 'grátis' : fmt(c); }).join('/') + '; especial ' + fmt(L.especial) + ')';
      no.formula = { simbolica: (niveis.length ? L.pontosPorNivel + ' × níveis de ' + L.niveis[0] + ' a ' + ctx.nivel
          : 'nenhum nível com pontos ainda (o Limiar dá pontos a partir do nível ' + L.niveis[0] + ')') + ' − ' + custoTxt,
        numerica: conta(fmt(pontos) + (partes.length ? ' − ' + partes.map(fmt).join(' − ') : ''), no.valor) };
      return no;
    }
    function noMorrendo(ctx) {
      var D = ctx.D, no = novoNo('morrendo.tique', 'Tique de Morrendo');
      var amb = { ref: function (n) { return { v: ctx.v(n), rot: 'Saúde máx.', st: stNo(ctx, n), fonte: { tipo: 'no', id: n, nome: 'Saúde máx.' } }; } };
      var a = aval(D.morte.tique, amb, D);
      no.termos.push({ rotulo: a.sim, fonte: { tipo: 'no', id: 'recurso.saude.max', nome: 'Saúde máx.' }, op: 'formula', valor: a.v, ativo: true,
        motivo: 'dano biológico no início do turno do afetado; ignora Ar, Ae e Resistência (D86)', status: a.st });
      no.valor = a.v;
      no.formula = { simbolica: a.sim, numerica: conta(a.num, a.v) };
      return no;
    }

    // ---------------- grafo ----------------
    function grafo(ctx) {
      var D = ctx.D, g = [];
      function add(c, deps, f) { g.push({ c: c, d: deps, f: f }); }
      var MODS = ATRIBUTOS.map(function (A) { return 'atributo.' + A + '.mod'; });
      ATRIBUTOS.forEach(function (A) {
        add('atributo.' + A + '.total', [], function () { return noAtributoTotal(ctx, A); });
        add('atributo.' + A + '.mod', ['atributo.' + A + '.total'], function () { return noAtributoMod(ctx, A); });
      });
      add('capacidade.bugigangas', ['atributo.FOR.mod'], function () { return noCapacidade(ctx, 'bugigangas'); });
      add('capacidade.equipamentos', ['atributo.FOR.mod'], function () { return noCapacidade(ctx, 'equipamentos'); });
      add('carga', ['capacidade.bugigangas', 'capacidade.equipamentos'], function () { return noCarga(ctx); });
      D.pericias.forEach(function (p) {
        add('pericia.' + p.id + '.total', MODS.concat(['carga']), function () { return noPericia(ctx, p); });
      });
      ['saude', 'stamina', 'eter'].forEach(function (r) {
        add('recurso.' + r + '.max', MODS, function () { return noRecursoMax(ctx, r); });
      });
      add('recurso.classe.max', MODS, function () { return noRecursoClasse(ctx); });
      add('recurso.stamina.disponivel', [], function () { return noStaminaDisponivel(ctx); });
      add('evasao.passiva', MODS, function () { return noEvasaoPassiva(ctx); });
      add('evasao.ativa', ['evasao.passiva', 'pericia.defender.total'], function () { return noEvasaoAtiva(ctx); });
      add('cd', MODS, function () { return noCD(ctx); });
      add('movimento', ['carga'], function () { return noMovimento(ctx); });
      add('acoes', [], function () { return noAcoes(ctx); });
      add('ar', [], function () { return noAr(ctx); });
      TIPOS_DANO.concat(CATEGORIAS_AE, ['todos']).forEach(function (k) { add('ae.' + k, [], function () { return noAe(ctx, k); }); });
      TIPOS_DANO.forEach(function (t) {
        ['resistencia', 'imunidade', 'vulnerabilidade'].forEach(function (f) { add(f + '.' + t, [], function () { return noFlag(ctx, f, t); }); });
        var cat = categoriaDe(D, t);
        add('defesa.' + t, ['ar', 'ae.' + t, 'ae.todos', 'resistencia.' + t, 'imunidade.' + t, 'vulnerabilidade.' + t]
          .concat(cat && CATEGORIAS_AE.indexOf(cat) >= 0 ? ['ae.' + cat] : []), function () { return noDefesa(ctx, t); });
      });
      lista(ctx.ficha.entradas).forEach(function (e) {
        if (e && e.tipo === 'magia' && e.id && !g.some(function (x) { return x.c === 'magia.' + e.id + '.custo'; })) {
          add('magia.' + e.id + '.custo', [], function () { return noMagia(ctx, e); });
        }
      });
      armasEquipadas(ctx).forEach(function (w) {
        add('ataque.' + w.e.uid + '.atacar', ['pericia.atacar.total', 'atributo.' + w.arma.atributo + '.mod', 'acoes'], function () { return noAtaque(ctx, w); });
        add('ataque.' + w.e.uid + '.dano', ['atributo.' + w.arma.atributo + '.mod'], function () { return noDano(ctx, w); });
      });
      add('limiar.saldo', [], function () { return noLimiar(ctx); });
      add('morrendo.tique', ['recurso.saude.max'], function () { return noMorrendo(ctx); });
      return g;
    }
    // Kahn estável (na ordem de declaração); ciclo ou dependência sem nó = erro
    function ordemTopologica(g) {
      var porC = {}, grau = {}, filhos = {};
      g.forEach(function (x) { porC[x.c] = x; grau[x.c] = 0; filhos[x.c] = []; });
      g.forEach(function (x) {
        x.d.forEach(function (d) {
          if (!porC[d]) throw new Error('KhRegras: ' + x.c + ' depende de ' + d + ', que não existe');
          grau[x.c]++; filhos[d].push(x.c);
        });
      });
      var fila = g.filter(function (x) { return !grau[x.c]; }).map(function (x) { return x.c; }), out = [];
      while (fila.length) {
        var c = fila.shift();
        out.push(c);
        filhos[c].forEach(function (f) { if (--grau[f] === 0) fila.push(f); });
      }
      if (out.length !== g.length) throw new Error('KhRegras: ciclo no grafo de regras');
      return out.map(function (c) { return porC[c]; });
    }

    // ---------------- estados finais (morte.estadosFinais: só alerta) ----------------
    // Nunca automático (plano §5, P53): o motor não aplica nada, só avisa; tudo
    // segue editável. Cada alerta leva o status da regra que o dispara.
    function estadosFinais(ctx, rc, alertas) {
      var D = ctx.D, M = D.morte, vistos = {};
      function selo(st) { var s = D.selos[st]; return s === undefined ? D.selos.semStatus : s; }
      function alerta(id, msg, st, extra) {
        vistos[id] = true;
        alertas.push(Object.assign({ tipo: 'estado-final', id: id, msg: msg + ' (estado final: só alerta, nada é aplicado)',
          status: st, selo: selo(st), automatico: false }, extra || {}));
      }
      // Mod ativo com alvo 'estado' (Exaustão 5: morte)
      ctx.ef.mods.forEach(function (m) {
        if (m.alvo !== 'estado' || !m.ativo) return;
        alerta(str(m.fonte && m.fonte.id) + (m.nivel != null ? '-' + m.nivel : ''), nomeFonte(m) + ': ' + str(m.valor), m.status || 'semStatus',
          { fonte: m.fonte, valor: m.valor });
      });
      // Saúde máx. zerada pelo Desnutrido
      var sMax = ctx.v('recurso.saude.max');
      if (sMax === 0 && ctx.condicoes.some(function (c) { return c.id === 'desnutrido'; })) {
        alerta('desnutrido-max-zero', 'Desnutrido zerou a Saúde máx.', M.estadosFinaisSt);
      }
      // abaixo do mínimo: Saúde (morte) e Éter (o personagem vai para o mestre)
      [['saude', 'saude-abaixo-metade-negativa', 'Saúde'], ['eter', 'eter-metade-negativa', 'Éter']].forEach(function (x) {
        var lim = M.limites && M.limites[x[0]], atual = rc[x[0]] && rc[x[0]].atual, max = ctx.v('recurso.' + x[0] + '.max');
        if (!lim || typeof atual !== 'number' || typeof max !== 'number') return;
        var r = aval(lim.min, { ref: function () { return { v: max, rot: NOME_REC[x[0]], st: stNo(ctx, 'recurso.' + x[0] + '.max') }; } }, D);
        if (!(atual < r.v)) return;
        var fin = lista(M.estadosFinais).filter(function (e) { return e.id === x[1]; })[0];
        alerta(x[1], x[2] + ' atual ' + fmt(atual) + ' abaixo de ' + r.sim + ' = ' + fmt(r.v) + (fin && fin.nota ? ': ' + fin.nota : ''),
          pior(D, lim.st, r.st), { formula: { simbolica: x[2] + ' atual < ' + r.sim, numerica: '= ' + fmt(atual) + ' < ' + r.num + ' = ' + fmt(r.v) } });
      });
      lista(M.estadosFinais).forEach(function (e) {
        if (DETECTORES_FINAIS.indexOf(e.id) < 0) ctx.avisos.push({ tipo: 'estado-final-sem-detector', id: e.id, msg: 'estado final "' + e.id + '" do contrato sem detector no KhRegras' });
      });
      return vistos;
    }
    var DETECTORES_FINAIS = ['exaustao-5', 'desnutrido-max-zero', 'saude-abaixo-metade-negativa', 'eter-metade-negativa'];

    // ---------------- API ----------------
    // opcoes: {dados?, efeitos? (data/efeitos.json ou o porId), catalogo? (não usado no cálculo)}
    function avaliar(ficha, opcoes) {
      opcoes = opcoes || {};
      ficha = ficha || {};
      var ctx = contexto(ficha, opcoes), D = ctx.D;
      var forTotal = null;
      var ajustes = obj(ficha.ajustes) ? ficha.ajustes : {};
      var ordem = ordemTopologica(grafo(ctx));
      ordem.forEach(function (x) {
        if (x.c === 'capacidade.bugigangas' && !ctx.cargaInv) {
          forTotal = ctx.v('atributo.FOR.total');
          ctx.cargaInv = KhInv.calcular(ficha.inventario || {}, forTotal);
        }
        var no = x.f();
        KhAjustes.aplicar(no, ajustes);
        if (no.progressao) fechaProgressao(no, D);
        fechaStatus(no, D);
        ctx.nos[x.c] = no;
      });
      // ajuste de caminho sem nó (magia ou arma que saiu da ficha): fica listado
      Object.keys(ajustes).forEach(function (c) {
        if (!ctx.nos[c]) ctx.avisos.push({ tipo: 'ajuste-sem-no', caminho: c, msg: 'ajuste em ' + c + ' sem campo calculado na ficha' });
      });
      var alertas = [];
      var rc = ficha.recursos || {};
      [['saude', 'morrendo'], ['stamina', 'exaurido'], ['eter', 'oco']].forEach(function (x) {
        var atual = rc[x[0]] && rc[x[0]].atual, max = ctx.v('recurso.' + x[0] + '.max');
        if (typeof atual === 'number' && atual <= 0 && max) alertas.push({ tipo: 'condicao-automatica', id: x[1], nome: D.condicoes[x[1]].nome, recurso: x[0],
          msg: D.condicoes[x[1]].nome + ': ' + NOME_REC[x[0]].replace(' máx.', '') + ' atual ≤ 0 (entra sozinha)' });
        if (typeof atual === 'number' && max != null && atual > max) alertas.push({ tipo: 'acima-do-maximo', recurso: x[0],
          msg: NOME_REC[x[0]].replace(' máx.', '') + ' atual ' + atual + ' acima do máximo ' + max + ' (o grampo corta, L06)' });
      });
      estadosFinais(ctx, rc, alertas);
      var sust = lista(ficha.entradas).filter(function (e) { return e && e.tipo === 'magia' && e.estado && e.estado.sustentando; });
      if (sust.length > D.magia.sustentada.maxAtivas) alertas.push({ tipo: 'sustentadas', msg: sust.length + ' magias sustentadas; o máximo é ' + D.magia.sustentada.maxAtivas + ' (D16)' });
      return { versao: D.versao, nos: ctx.nos, ordem: ordem.map(function (x) { return x.c; }), efeitos: ctx.ef,
        condicoes: ctx.condicoes, avisos: ctx.avisos, alertas: alertas };
    }
    // {caminho ajustável: calculado} — para KhEstado.podarAjustesMigrados e a migração
    function calculados(ficha, opcoes) {
      var r = avaliar(ficha, opcoes), out = {};
      Object.keys(r.nos).forEach(function (c) {
        if (KhAjustes.ehAjustavel(c) && typeof r.nos[c].calculado === 'number') out[c] = r.nos[c].calculado;
      });
      return out;
    }
    // D15: Saúde (ou Stamina) temporária não soma: fica a maior
    function temporaria(atual, nova) { return Math.max(numero(atual, 0), numero(nova, 0)); }

    return {
      avaliar: avaliar, calculados: calculados, custoMagia: custoMagia, resolverTeste: resolverTeste,
      temporaria: temporaria, aval: function (ast, amb, D) { return aval(ast, amb, D || dadosPadrao()); },
      fmt: fmt, dados: dadosPadrao
    };
  })();

  if (emNode) { module.exports = KhRegras; return; }
  raiz.KhRegras = KhRegras;
})(typeof window !== 'undefined' ? window : this);

// ==== js/ficha/kh-abas.js ====
/* Khalkaria — Ficha · KhAbas: lista de abas reordenável (F4.5).
 * Especificação: docs/ficha-digital/05-f4-pagina.md, seção F4.5; 03 §9 (ordem
 * por navegador, no drawer e na página).
 *
 * Mora no bundle (js/ficha.js), e não no js/ficha-pagina.js, porque tem dois
 * donos: a página da ficha (só pages/ficha.html carrega o ficha-pagina.js) e o
 * drawer da F4.4, que roda em todas as páginas pelo js/ficha.js. Carregar este
 * arquivo não muda nada: nada escuta nem lê storage até alguém chamar criar().
 *
 *   var abas = KhAbas.criar(tablist, {
 *     ids: ['nucleo', 'tecnicas', …],   // a ordem padrão (a do A4)
 *     rotulos: { nucleo: 'Núcleo', … }, // para os avisos ao leitor de tela
 *     aberta: 'nucleo',                 // a aba aberta ao criar (senão: a da sessão, ou a 1ª)
 *     restaurar: botão "Ordem do A4" (escondido na ordem padrão), anuncio: região aria-live,
 *     aoSelecionar(id), aoMudarOrdem(ordem)
 *   });
 *
 * Marcação esperada: tablist[role=tablist] com os botões [role=tab][data-aba]
 * como filhos diretos, cada um com aria-controls apontando o seu tabpanel.
 * O KhAbas cuida de aria-selected, do tabindex móvel e do hidden dos painéis.
 *
 * Teclado (padrão ARIA de abas, ativação automática): setas trocam de aba (com
 * volta), Home e End vão às pontas; isso é a navegação do próprio widget, num
 * keydown da lista, como as linhas de filtro do Bazar. Alt+← e Alt+→ MOVEM a
 * aba focada: atalho do site, registrado no KhTeclas (js/kh-ui.js), um só para
 * todas as listas (vale a que tem a aba focada). Só com o foco de TECLADO na
 * aba (:focus-visible): o clique também foca o botão (Chrome, Edge e Firefox no
 * Windows), e aí o Alt+← tem de seguir sendo o Voltar do navegador, mesmo com
 * a aba fora da tela. O Chrome não liga o :focus-visible por tecla com Alt, então
 * depois de um clique só uma tecla comum (seta, Tab) o liga. Com o foco de
 * teclado, na ponta o Alt+seta é consumido e só avisa: quem apertou estava
 * movendo a aba e não quer sair da página. Para o :focus-visible sobreviver de
 * um Alt+seta ao seguinte, a aba focada nunca sai do DOM ao reordenar (as
 * outras se arrumam em volta dela; ver aplicaDom).
 * Esc durante o arrasto desfaz o arrasto (camada do Esc do KhTeclas).
 *
 * Arrasto (pointer events): só vira arrasto depois de LIMIAR px; abaixo disso
 * é clique. A aba segue o ponteiro na horizontal e as outras abrem espaço; ao
 * soltar, grava. pointercancel, Esc ou perder a janela desfazem.
 *
 * Ordem: localStorage khalkaria_ficha_abas, lista de ids. É do navegador: vale
 * para todas as fichas, não vai no export, e o drawer e a página leem a mesma
 * (mudou numa, a outra acompanha: mesma janela pelo registro daqui, outra janela
 * pelo evento storage). Lista inválida volta à ordem padrão; incompleta mantém
 * o que é conhecido e acrescenta as abas novas no fim; id desconhecido ou
 * repetido sai. A ordem padrão apaga a chave (sem preferência, vale o padrão).
 * Aba aberta: sessionStorage khalkaria_ficha_aba (só lida ao criar; gravada
 * quando o jogador troca). São as ÚNICAS escritas deste módulo.
 *
 * Movimento reduzido (html[data-movimento=reduzido], a opção da nav): sem a
 * animação das abas que trocam de lugar.
 *
 * No node exporta por module.exports (carregado sozinho); no artefato js/ficha.js
 * o export já é o KhInv e este módulo só registra window.KhAbas no navegador.
 * Fonte: js/ficha/kh-abas.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv

  var KhAbas = (function () {
    var CHAVE_ORDEM = 'khalkaria_ficha_abas';
    var CHAVE_ABERTA = 'khalkaria_ficha_aba';
    var LIMIAR = 6;        // px até o aperto virar arrasto (menos que isso é clique)
    var DURACAO = 160;     // ms da animação das abas que trocam de lugar
    var instancias = [];   // as listas vivas (drawer e página): Alt+seta, Esc e a sincronia
    var teclasLigadas = [];

    function lista(x) { return Array.isArray(x) ? x : []; }
    function arr(x) { return Array.prototype.slice.call(x || []); }
    function igual(a, b) {
      return a.length === b.length && a.every(function (x, i) { return x === b[i]; });
    }

    // ---------------- puras ----------------
    // ordem guardada -> ordem válida: os ids conhecidos, sem repetir, na ordem
    // guardada; os que faltam (aba nova; ou tudo, se a lista não presta) no fim,
    // na ordem padrão
    function normaliza(salva, ids) {
      ids = lista(ids);
      var out = [];
      lista(salva).forEach(function (x) {
        if (typeof x === 'string' && ids.indexOf(x) >= 0 && out.indexOf(x) < 0) out.push(x);
      });
      ids.forEach(function (x) { if (out.indexOf(x) < 0) out.push(x); });
      return out;
    }
    function lerOrdem(ls, ids, chave) {
      var v = null, salva = null;
      try { v = ls ? ls.getItem(chave || CHAVE_ORDEM) : null; } catch (e) { v = null; }
      if (typeof v === 'string') { try { salva = JSON.parse(v); } catch (e) { salva = null; } }
      return normaliza(Array.isArray(salva) ? salva : [], ids);
    }
    // a ordem padrão apaga a chave; storage cheio ou bloqueado: a ordem vale só
    // nesta página (false)
    function gravarOrdem(ls, ordem, ids, chave) {
      var o = normaliza(ordem, ids);
      try {
        if (!ls) return false;
        if (igual(o, lista(ids))) ls.removeItem(chave || CHAVE_ORDEM);
        else ls.setItem(chave || CHAVE_ORDEM, JSON.stringify(o));
        return true;
      } catch (e) { return false; }
    }
    function lerAberta(ss, ids, chave) {
      var v = null;
      try { v = ss ? ss.getItem(chave || CHAVE_ABERTA) : null; } catch (e) { v = null; }
      return typeof v === 'string' && lista(ids).indexOf(v) >= 0 ? v : null;
    }
    function gravarAberta(ss, id, chave) {
      try { if (ss) { ss.setItem(chave || CHAVE_ABERTA, id); return true; } } catch (e) { /* bloqueado */ }
      return false;
    }
    // o id na posição i (limitada às pontas)
    function moverPara(ordem, id, i) {
      var o = lista(ordem).slice(), de = o.indexOf(id);
      if (de < 0) return o;
      i = Math.max(0, Math.min(o.length - 1, i));
      o.splice(de, 1);
      o.splice(i, 0, id);
      return o;
    }
    function mover(ordem, id, delta) {
      var de = lista(ordem).indexOf(id);
      return de < 0 ? lista(ordem).slice() : moverPara(ordem, id, de + delta);
    }
    // onde a aba arrastada entra, entre as OUTRAS (rects na ordem). A lista
    // pode quebrar em linhas: a primeira aba que está numa linha abaixo do
    // ponteiro, ou na mesma linha com o centro à direita dele, recebe a
    // arrastada antes de si. O y fica preso à faixa das abas (arrastar um pouco
    // para cima ou para baixo da lista não joga a aba para uma ponta).
    function alvoArrasto(rects, x, y) {
      rects = lista(rects);
      if (!rects.length) return 0;
      var topo = Infinity, base = -Infinity;
      rects.forEach(function (r) { topo = Math.min(topo, r.top); base = Math.max(base, r.bottom); });
      y = Math.max(topo, Math.min(base, y));
      for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        if (y < r.top) return i;
        if (y <= r.bottom && x < r.left + r.width / 2) return i;
      }
      return rects.length;
    }

    // ---------------- teclado do site (KhTeclas): um registro para todas as listas ----------------
    function instanciaDo(alvo) {
      for (var i = 0; i < instancias.length; i++) if (instancias[i].abaDo(alvo)) return instancias[i];
      return null;
    }
    // o foco veio do teclado? Sem suporte a :focus-visible, não: na dúvida, o
    // Alt+← é do navegador (Voltar)
    function focoDeTeclado(el) {
      try { return !!(el && typeof el.matches === 'function' && el.matches(':focus-visible')); } catch (e) { return false; }
    }
    // a lista cuja aba tem o foco de teclado (alvo do keydown = o elemento focado)
    function instanciaDoTeclado(alvo) {
      var inst = instanciaDo(alvo);
      return inst && focoDeTeclado(alvo) ? inst : null;
    }
    function ligaTeclas(T) {
      if (!T || typeof T.atalho !== 'function' || teclasLigadas.indexOf(T) >= 0) return;
      teclasLigadas.push(T);
      [['Alt+ArrowLeft', -1, 'esquerda'], ['Alt+ArrowRight', 1, 'direita']].forEach(function (t) {
        T.atalho(t[0], function (e) {
          var inst = instanciaDoTeclado(e.target);
          if (!inst) return false;
          inst.mover(inst.abaDo(e.target), t[1]);   // na ponta não move, mas consome (o foco de teclado estava movendo a aba)
        }, { descricao: 'Mover a aba da ficha para a ' + t[2] + ' (com a aba focada pelo teclado)',
          quando: function (e) { return !!instanciaDoTeclado(e.target); } });
      });
      if (typeof T.camadaEsc === 'function') {
        T.camadaEsc(5, function () {
          for (var i = 0; i < instancias.length; i++) if (instancias[i].cancelarArrasto()) return true;
          return false;
        }, { fase: 'captura' });
      }
    }

    function storage(win, nome) {
      try { return win ? win[nome] : null; } catch (e) { return null; }
    }

    // ---------------- a lista viva ----------------
    function criar(tablist, op) {
      op = op || {};
      if (!tablist || typeof tablist.querySelectorAll !== 'function') return null;
      var win = op.win || raiz, doc = op.doc || (win && win.document) || null;
      var chaveOrdem = op.chaveOrdem || CHAVE_ORDEM, chaveAberta = op.chaveAberta || CHAVE_ABERTA;
      var ls = 'ls' in op ? op.ls : storage(win, 'localStorage');
      var ss = 'ss' in op ? op.ss : storage(win, 'sessionStorage');
      var T = 'teclas' in op ? op.teclas : win && win.KhTeclas;
      var rotulos = op.rotulos || {};

      var abas = {};
      function domIds() {
        return arr(tablist.querySelectorAll('[role="tab"]')).map(function (t) { return t.getAttribute('data-aba'); })
          .filter(function (id) { return !!id; });
      }
      arr(tablist.querySelectorAll('[role="tab"]')).forEach(function (t) {
        var id = t.getAttribute('data-aba');
        if (id && !abas[id]) abas[id] = t;
      });
      // a ordem padrão: a dada (só as que existem), mais as da marcação que faltarem
      var ids = normaliza(lista(op.ids).filter(function (id) { return !!abas[id]; }), domIds());
      if (!ids.length) return null;
      var ordem = lerOrdem(ls, ids, chaveOrdem);
      var aberta = abas[op.aberta] ? op.aberta : lerAberta(ss, ids, chaveAberta) || ordem[0];
      var arrasto = null, engolir = false, morta = false;

      function rotulo(id) {
        if (rotulos[id]) return rotulos[id];
        var t = abas[id] && abas[id].textContent;
        return t ? String(t).replace(/\s+/g, ' ').trim() : id;
      }
      function anuncia(msg) { if (op.anuncio) op.anuncio.textContent = msg; }
      function painelDe(id) {
        var c = abas[id] && abas[id].getAttribute('aria-controls');
        return c && doc && doc.getElementById ? doc.getElementById(c) : null;
      }
      function foca(el) {
        if (!el || typeof el.focus !== 'function') return;
        try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
      }
      // o id da aba do alvo (o próprio botão ou algo dentro dele), se for desta lista
      function abaDo(alvo) {
        var t = alvo && alvo.closest ? alvo.closest('[role="tab"]') : null;
        var id = t && t.getAttribute('data-aba');
        return id && abas[id] === t ? id : null;
      }
      function calmo() {
        var h = doc && doc.documentElement;
        return !!h && !!h.getAttribute && h.getAttribute('data-movimento') === 'reduzido';
      }

      // ---- seleção: aria-selected, tabindex móvel, painel
      function marca() {
        ids.forEach(function (id) {
          var on = id === aberta, t = abas[id], p = painelDe(id);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.setAttribute('tabindex', on ? '0' : '-1');
          if (p) p.hidden = !on;
        });
      }
      function seleciona(id, foco) {
        if (!abas[id]) return false;
        var mudou = id !== aberta;
        aberta = id;
        marca();
        if (mudou) gravarAberta(ss, id, chaveAberta);
        if (foco) foca(abas[id]);
        if (mudou && op.aoSelecionar) op.aoSelecionar(id);
        return true;
      }

      // ---- ordem no DOM: poucos insertBefore (a aba que não sai do lugar não é
      // tocada), e a aba FOCADA nunca é movida: tirar o botão do DOM tira o foco
      // dele, e o foco devolvido por script pode voltar sem o :focus-visible (aí
      // o Alt+seta seguinte viraria o Voltar). Quando a vez é dela, as abas entre
      // a posição e ela passam para logo depois dela, na mesma ordem.
      function aplicaDom() {
        var dom = domIds();
        var ativo = doc ? doc.activeElement : null;
        var fixa = ativo ? abaDo(ativo) : null;
        for (var i = 0; i < ordem.length; i++) {
          if (dom[i] === ordem[i]) continue;
          if (ordem[i] === fixa) {
            var p = dom.indexOf(fixa), depois = abas[dom[p + 1]] || null, saem = dom.slice(i, p);
            saem.forEach(function (id) { tablist.insertBefore(abas[id], depois); });
            dom.splice(i, p - i);
            Array.prototype.splice.apply(dom, [i + 1, 0].concat(saem));
            continue;
          }
          tablist.insertBefore(abas[ordem[i]], abas[dom[i]] || null);
          dom.splice(dom.indexOf(ordem[i]), 1);
          dom.splice(i, 0, ordem[i]);
        }
      }
      // Retângulo de LAYOUT da aba, na janela: sem transform (nem a animação
      // abaixo, nem o deslocamento do arrasto). É o que o arrasto compara: o
      // getBoundingClientRect de uma aba no meio da animação mente a posição.
      // Pelo offset* relativo à lista (mesmo offsetParent, ou a própria lista);
      // fora disso (ou num DOM sem offset*), o getBoundingClientRect.
      function caixa(t) {
        var L = tablist.getBoundingClientRect ? tablist.getBoundingClientRect() : null;
        if (!L || typeof t.offsetLeft !== 'number' || typeof t.offsetWidth !== 'number') return t.getBoundingClientRect();
        var x, y;
        if (t.offsetParent && t.offsetParent === tablist) {
          x = L.left + (tablist.clientLeft || 0) + t.offsetLeft;
          y = L.top + (tablist.clientTop || 0) + t.offsetTop;
        } else if (t.offsetParent && t.offsetParent === tablist.offsetParent) {
          x = L.left + t.offsetLeft - tablist.offsetLeft;
          y = L.top + t.offsetTop - tablist.offsetTop;
        } else return t.getBoundingClientRect();
        return { left: x, top: y, right: x + t.offsetWidth, bottom: y + t.offsetHeight, width: t.offsetWidth, height: t.offsetHeight };
      }
      // FLIP: as abas que trocaram de lugar deslizam de onde estavam (na tela,
      // com a animação anterior no meio) até o lugar novo (sem isso no
      // movimento reduzido ou sem Element.animate)
      function mede() {
        if (calmo()) return null;
        var m = {};
        ids.forEach(function (id) {
          var t = abas[id];
          if (t.getBoundingClientRect && typeof t.animate === 'function') m[id] = t.getBoundingClientRect();
        });
        return m;
      }
      function para(t) {
        if (t._khAbasAnim) { try { t._khAbasAnim.cancel(); } catch (e) { /* já acabou */ } t._khAbasAnim = null; }
      }
      function anima(antes, exceto) {
        if (!antes) return;
        ids.forEach(function (id) {
          var t = abas[id], a = antes[id];
          if (!a || id === exceto) return;
          var d = caixa(t), dx = Math.round(a.left - d.left), dy = Math.round(a.top - d.top);
          para(t);
          if (!dx && !dy) return;
          try {
            t._khAbasAnim = t.animate([{ transform: 'translate(' + dx + 'px, ' + dy + 'px)' }, { transform: 'none' }],
              { duration: DURACAO, easing: 'ease-out' }) || null;
          } catch (e) { /* sem animação */ }
        });
      }
      // o botão de restaurar só aparece com a ordem fora da padrão (na padrão
      // não há o que restaurar, e ele não toma largura da lista). Durante o
      // arrasto não muda: aparecer no meio dele reflui a lista sob o ponteiro.
      function atualizaRestaurar() {
        if (op.restaurar && !(arrasto && arrasto.ativo)) op.restaurar.hidden = igual(ordem, ids);
      }
      // troca a ordem na tela (sem gravar). O aplicaDom não move a aba focada;
      // se o foco ainda assim saiu dela, volta
      function poeOrdem(nova, exceto) {
        nova = normaliza(nova, ids);
        if (igual(nova, ordem)) return false;
        var ativo = doc ? doc.activeElement : null;
        var focada = ativo ? abaDo(ativo) : null;
        var antes = mede();
        ordem = nova;
        aplicaDom();
        if (focada && doc.activeElement !== abas[focada]) foca(abas[focada]);
        anima(antes, exceto);
        atualizaRestaurar();
        return true;
      }
      // grava e avisa: as outras listas desta janela (a outra janela vem pelo storage)
      function confirma() {
        gravarOrdem(ls, ordem, ids, chaveOrdem);
        instancias.forEach(function (o) { if (o !== api && o.chaveOrdem === chaveOrdem) o.sincronizar(); });
        if (op.aoMudarOrdem) op.aoMudarOrdem(ordem.slice());
      }
      function posicao(id) { return rotulo(id) + ': posição ' + (ordem.indexOf(id) + 1) + ' de ' + ordem.length + '.'; }
      function moverAba(id, delta) {
        if (!abas[id] || !delta || (arrasto && arrasto.ativo)) return false;
        var j = ordem.indexOf(id) + delta;
        if (j < 0 || j >= ordem.length) {
          anuncia(rotulo(id) + (j < 0 ? ' já é a primeira aba.' : ' já é a última aba.'));
          return false;
        }
        poeOrdem(mover(ordem, id, delta));
        confirma();
        anuncia(posicao(id));
        return true;
      }
      function moverAbaPara(id, i) {
        if (!abas[id] || !poeOrdem(moverPara(ordem, id, i))) return false;
        confirma();
        anuncia(posicao(id));
        return true;
      }
      function restaurar() {
        if (!poeOrdem(ids.slice())) return false;
        confirma();
        anuncia(op.textoRestaurada || 'Ordem padrão das abas restaurada.');
        return true;
      }
      // a ordem guardada mudou fora daqui (a outra lista, outra janela)
      function sincronizar() {
        if (arrasto && arrasto.ativo) cancelarArrasto();
        return poeOrdem(lerOrdem(ls, ids, chaveOrdem));
      }

      // ---- teclado do widget: setas, Home, End (o Alt+seta é do KhTeclas)
      function aoTecla(e) {
        if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
        var k = e.key;
        if (k !== 'ArrowLeft' && k !== 'ArrowRight' && k !== 'Home' && k !== 'End') return;
        var id = abaDo(e.target);
        if (!id) return;
        var i = ordem.indexOf(id), n = ordem.length;
        var j = k === 'Home' ? 0 : k === 'End' ? n - 1 : (i + (k === 'ArrowRight' ? 1 : -1) + n) % n;
        e.preventDefault();
        seleciona(ordem[j], true);
      }
      function aoClique(e) {
        if (engolir) {   // o clique que fecha um arrasto não troca de aba
          engolir = false;
          if (e.preventDefault) e.preventDefault();
          if (e.stopPropagation) e.stopPropagation();
          return;
        }
        var id = abaDo(e.target);
        if (id) seleciona(id, false);
      }

      // ---- arrasto (pointer events, com limiar)
      function segue(x) {
        var t = abas[arrasto.id];
        if (!t.style) return;
        t.style.transform = '';
        var r = caixa(t);
        t.style.transform = 'translateX(' + Math.round(x - arrasto.pega - r.left) + 'px)';
      }
      function aoApertar(e) {
        if (morta) return;
        engolir = false;
        if (arrasto) {
          if (arrasto.ativo) return;   // outro dedo/botão no meio do arrasto
          termina();                   // aperto antigo que nunca soltou aqui
        }
        if ((e.button != null && e.button !== 0) || e.isPrimary === false) return;
        var id = abaDo(e.target);
        if (!id || !doc) return;
        arrasto = { id: id, pid: e.pointerId, x0: e.clientX, y0: e.clientY, ativo: false, ordem0: ordem.slice(), pega: 0 };
        doc.addEventListener('pointermove', aoMover, true);
        doc.addEventListener('pointerup', aoSoltar, true);
        doc.addEventListener('pointercancel', aoCancelar, true);
      }
      function comeca() {
        var t = abas[arrasto.id];
        para(t);   // a aba pega pelo ponteiro sai de qualquer animação
        var r = caixa(t);
        arrasto.ativo = true;
        arrasto.pega = arrasto.x0 - r.left;
        tablist.setAttribute('data-arrastando', '');
        t.setAttribute('data-arrastada', '');
        // a captura vai na LISTA, que nunca sai do DOM (a aba sai e volta a cada troca)
        try { if (tablist.setPointerCapture && arrasto.pid != null) tablist.setPointerCapture(arrasto.pid); } catch (e) { /* sem captura */ }
      }
      function aoMover(e) {
        if (!arrasto || e.pointerId !== arrasto.pid) return;
        // botão solto fora da janela: o pointerup não chegou
        if (arrasto.ativo && typeof e.buttons === 'number' && e.buttons === 0 && e.pointerType === 'mouse') { aoSoltar(e); return; }
        if (!arrasto.ativo) {
          var dx = e.clientX - arrasto.x0, dy = e.clientY - arrasto.y0;
          if (Math.sqrt(dx * dx + dy * dy) < LIMIAR) return;
          comeca();
        }
        if (e.preventDefault) e.preventDefault();
        var id = arrasto.id;
        var outras = ordem.filter(function (x) { return x !== id; });
        var i = alvoArrasto(outras.map(function (x) { return caixa(abas[x]); }), e.clientX, e.clientY);
        outras.splice(i, 0, id);
        poeOrdem(outras, id);
        segue(e.clientX);
      }
      function termina() {
        var a = arrasto;
        arrasto = null;
        if (doc) {
          doc.removeEventListener('pointermove', aoMover, true);
          doc.removeEventListener('pointerup', aoSoltar, true);
          doc.removeEventListener('pointercancel', aoCancelar, true);
        }
        if (!a || !a.ativo) return a;
        var t = abas[a.id];
        tablist.removeAttribute('data-arrastando');
        t.removeAttribute('data-arrastada');
        try { if (tablist.releasePointerCapture && a.pid != null) tablist.releasePointerCapture(a.pid); } catch (e) { /* já solta */ }
        // a aba sai do deslocamento do ponteiro para o seu lugar
        var antes = t.style && t.style.transform && !calmo() && typeof t.animate === 'function' ? t.getBoundingClientRect() : null;
        if (t.style) t.style.transform = '';
        if (antes) anima(objeto(a.id, antes));
        return a;
      }
      function objeto(k, v) { var o = {}; o[k] = v; return o; }
      function aoSoltar(e) {
        if (!arrasto || (e && e.pointerId !== arrasto.pid)) return;
        var a = termina();
        if (!a || !a.ativo) return;   // não passou do limiar: é clique, o click segue
        atualizaRestaurar();
        engolir = true;
        if (win && win.setTimeout) win.setTimeout(function () { engolir = false; }, 0);
        if (!igual(ordem, a.ordem0)) { confirma(); anuncia(posicao(a.id)); }
      }
      function aoCancelar(e) {
        if (!arrasto || (e && e.pointerId !== arrasto.pid)) return;
        cancelarArrasto();
      }
      // desfaz o arrasto em curso (Esc, pointercancel, janela perdida); true se havia um
      function cancelarArrasto() {
        if (!arrasto) return false;
        var a = termina();
        if (!a.ativo) return false;
        poeOrdem(a.ordem0);
        atualizaRestaurar();
        anuncia('Arrasto desfeito.');
        return true;
      }
      function aoSairDaJanela() { cancelarArrasto(); }
      function aoStorage(e) { if (e && e.key === chaveOrdem) sincronizar(); }

      tablist.addEventListener('keydown', aoTecla);
      tablist.addEventListener('click', aoClique, true);
      tablist.addEventListener('pointerdown', aoApertar);
      if (op.restaurar) op.restaurar.addEventListener('click', aoRestaurar);
      function aoRestaurar() {
        if (!restaurar()) return;
        foca(abas[aberta]);   // o botão some: o foco volta à aba aberta
      }
      if (win && win.addEventListener) {
        win.addEventListener('storage', aoStorage);
        win.addEventListener('blur', aoSairDaJanela);
      }

      function destruir() {
        if (morta) return;
        cancelarArrasto();
        morta = true;
        tablist.removeEventListener('keydown', aoTecla);
        tablist.removeEventListener('click', aoClique, true);
        tablist.removeEventListener('pointerdown', aoApertar);
        if (op.restaurar) op.restaurar.removeEventListener('click', aoRestaurar);
        if (win && win.removeEventListener) {
          win.removeEventListener('storage', aoStorage);
          win.removeEventListener('blur', aoSairDaJanela);
        }
        var i = instancias.indexOf(api);
        if (i >= 0) instancias.splice(i, 1);
      }

      var api = {
        chaveOrdem: chaveOrdem,
        ids: ids.slice(),
        ordem: function () { return ordem.slice(); },
        aberta: function () { return aberta; },
        seleciona: seleciona,
        mover: moverAba,
        moverPara: moverAbaPara,
        restaurar: restaurar,
        sincronizar: sincronizar,
        arrastando: function () { return !!(arrasto && arrasto.ativo); },
        cancelarArrasto: cancelarArrasto,
        abaDo: abaDo,
        destruir: destruir
      };

      // estado inicial: a ordem guardada na tela (a marcação pode ter vindo na
      // padrão), a aba aberta, o botão de restaurar. Nada é gravado aqui.
      aplicaDom();
      marca();
      atualizaRestaurar();
      instancias.push(api);
      ligaTeclas(T);
      return api;
    }

    return { CHAVE_ORDEM: CHAVE_ORDEM, CHAVE_ABERTA: CHAVE_ABERTA, LIMIAR: LIMIAR, DURACAO: DURACAO,
      normaliza: normaliza, lerOrdem: lerOrdem, gravarOrdem: gravarOrdem, lerAberta: lerAberta, gravarAberta: gravarAberta,
      mover: mover, moverPara: moverPara, alvoArrasto: alvoArrasto, criar: criar };
  })();

  if (emNode) { module.exports = KhAbas; return; }
  raiz.KhAbas = KhAbas;
})(typeof window !== 'undefined' ? window : this);

// ==== js/ficha/ficha-v2.js ====
/* Khalkaria — Ficha Interativa v2 (MVP)
 * Drawer persistente (localStorage) + DnD/"+ Adicionar" das páginas de regras +
 * derivados calculados + Export/Import JSON + projeção para o Bestiário (type:npc).
 * Não é SPA: re-hidrata no DOMContentLoaded. Schema: data/ficha-v2.schema.json (o v3 é o data/ficha.schema.json).
 *
 * Usa o window.KhInv (js/ficha/kh-inv.js, antes deste no ORDEM). No node
 * (tools/testes) não roda: nada daqui toca em window/document/localStorage lá.
 * Fonte: js/ficha/ficha-v2.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  // node:test carrega só os módulos puros: este para aqui
  if (typeof module === 'object' && module && module.exports) return;
  var KhInv = raiz.KhInv;

  var LS_KEY = 'khalkaria_ficha';
  var OPEN_KEY = 'khalkaria_ficha_open';
  var BACKUP_KEY = 'khalkaria_ficha_v1_backup';
  // Guarda contra aba velha (F0). A v3 grava nas próprias chaves (índice
  // khalkaria_fichas_v3 + khalkaria_ficha_v3:<id>, KhEstado.CHAVES) e põe o
  // marcador DONO_KEY = 'v3'; esta v2.1, ao ver o marcador (no load ou pelo
  // evento storage), fica só-leitura e não escreve mais NADA no storage. A mera
  // existência das chaves v3 não trava nada. "Voltar a usar a v2" apaga só o marcador.
  var KhEstado = raiz.KhEstado;
  var DONO_KEY = KhEstado.CHAVES.dono;
  var MSG_RO = 'Ficha migrada para a v3. Recarregue a página.';
  var SCHEMA_VERSION = '2.0';   // a string gravada nunca muda: a v3 usa outra chave
  var DESFAZER_MAX = 20;

  // base do site relativo ao próprio ficha.js (…/js/ficha.js -> raiz).
  // currentScript é nulo em script inserido dinamicamente -> fallback por querySelector / global.
  var selfScript = document.currentScript || document.querySelector('script[src*="js/ficha.js"]');
  var selfSrc = selfScript ? selfScript.src : '';
  var ROOT = selfSrc ? new URL('../', selfSrc).href : (window.KF_ROOT || '');

  // ---- 22 perícias: [slug, rótulo, prof_bestiário, atributo p/ teste] ----
  var PERICIAS = [
    ['atacar','Atacar','prof_attack',''], ['defender','Defender','prof_defend',''],
    ['movimento','Movimento','prof_movement',''], ['fortitude','Fortitude','prof_fortitude','con'],
    ['vontade','Vontade','prof_will','sab'], ['reflexos','Reflexos','prof_reflexes','des'],
    ['percepcao','Percepção','prof_perception','sab'], ['sobrevivencia','Sobrevivência','prof_survival','sab'],
    ['furtividade','Furtividade','prof_stealth','des'], ['crime','Crime','prof_crime','des'],
    ['iniciativa','Iniciativa','prof_initiative','des'], ['conhecimento','Conhecimento','prof_knowledge','int'],
    ['medicina','Medicina','prof_medicine','int'], ['investigacao','Investigação','prof_investigation','int'],
    ['religiao','Religião','prof_religion','sab'], ['mistico','Místico','prof_mystic','int'],
    ['convencimento','Convencimento','prof_persuasion','?'], ['intimidacao','Intimidação','prof_intimidation','?'],
    ['intuicao','Intuição','prof_insight','sab'], ['enganacao','Enganação','prof_deception','?'],
    ['motivar','Motivar','prof_motivate','sab'], ['oficio','Ofício(X)','prof_craft','oficio']
  ];
  var PROF_LEVELS = [0, 2, 4, 6, 8];
  var PROF_LABEL = {0:'Leigo',2:'Treinado',4:'Experiente',6:'Mestre',8:'Lendário'};
  var ATTRS = [['for','FOR'],['des','DES'],['con','CON'],['int','INT'],['sab','SAB']];
  var ATTR_BEST = {for:'strength',des:'dexterity',con:'constitution',int:'intelligence',sab:'wisdom'};
  var RESIST = [['ordinario','Ordinário'],['fogo','Fogo'],['frio','Frio'],['eletrico','Elétrico'],
    ['veneno','Veneno'],['acido','Ácido'],['psiquico','Psíquico'],['forca','Força'],
    ['radiante','Radiante'],['trovejante','Trovejante'],['necrotico','Necrótico'],['primordial','Primordial']];

  // Estado de página. Declarado ANTES do load(): a KF existe antes do init(), e
  // tudo que o load() e os mutadores tocam precisa estar inicializado.
  var drawer = null, body = null;      // body só existe depois do init(): mutadores testam if (body)
  var ultimoGravado = null;            // último JSON que ESTA página gravou (sincroniza ignora o eco)
  var saveT = null;                    // debounce dos campos digitados do drawer
  var toastT;
  var desfazerPilha = [];              // snapshots (JSON) de ficha.inventario, em memória, por página
  var loteN = 0;
  var bazarCache = null, idxCatalogo = null, catalogoPromessa = null;
  var renderPendente = false, abrirPendente = null, obsT;
  var conflitoDrawer = null;           // {uid, campo, conflito}: "Trocar por esta" até a próxima mudança
  var migrouAgora = false;             // load() converteu uma v1: o init() mostra o toast de migração
  var somenteLeitura = false;          // marcador DONO_KEY = 'v3': nada é gravado (confereDono)

  function agoraISO() { return new Date().toISOString(); }
  function clone(x) {
    if (typeof structuredClone === 'function') return structuredClone(x);
    return x === undefined ? undefined : JSON.parse(JSON.stringify(x));
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function donoV3() { return lsGet(DONO_KEY) === 'v3'; }
  function temPropria(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }

  // ---------------- estado (ficha v2, spec §5.2) ----------------
  function novaFicha() {
    var f = {
      schemaVersion: SCHEMA_VERSION, rev: 0, salvoEm: '', exportadoEm: '', migradoEm: '',
      meta: { nome:'', jogador:'', nivel:1, xp:0, raca:'', variante:'', classe:'', ramo:'', origem:'' },
      atributos: { for:10, des:10, con:10, int:10, sab:10 },
      pericias: {}, oficioAttr:'int',
      recursos: { saude:{atual:0,max:0}, stamina:{atual:0,max:0}, eter:{atual:0,max:0},
                  recursoClasse:{nome:'',atual:0,max:0} },
      derivadosManuais: { evasao:0, cd:0, movimento:9, armadura:0 },
      resistencias: {},
      inventario: { sins:0, bugigangas:[], equipamentos:[] },
      tecnicas: [], grimorio: [], cartasLimiar: [], lore:{ historia:'', outros:'' }
    };
    PERICIAS.forEach(function (p) { f.pericias[p[0]] = 0; });
    RESIST.forEach(function (r) { f.resistencias[r[0]] = { R:false, I:false, ae:0 }; });
    return f;
  }

  // listas da v1 (ou recriadas vazias por um ficha.js antigo em cache noutra página)
  function temListasVelhas(f) {
    var inv = f && f.inventario;
    return !!(inv && typeof inv === 'object' && (temPropria(inv, 'armas') || temPropria(inv, 'materiais')));
  }
  function temItens(f) {
    var inv = f && f.inventario;
    return KhInv.COLUNAS.some(function (c) { return !!(inv && Array.isArray(inv[c]) && inv[c].length); });
  }
  // invariante da ficha v2: entrada equipada ou sintonizada tem qtd 1 (KhInv.quantidade recusa)
  var MSG_QTD_1 = {
    equipado: 'Item equipado conta 1 unidade; desequipe para mudar a quantidade',
    sintonizado: 'Item sintonizado conta 1 unidade; dessintonize para mudar a quantidade'
  };
  var MSG_MIGRACAO ='Inventário convertido: 4 listas → 2 colunas. Armaduras e materiais agora pesam; marque o que está Equipado.';
  function guardaBackup(raw) {
    if (somenteLeitura || lsGet(BACKUP_KEY) != null) return;   // nunca sobrescreve o backup
    try { localStorage.setItem(BACKUP_KEY, raw); } catch (e) {}
  }

  somenteLeitura = donoV3();
  var ficha = load();
  // Só aqui grava o backup (spec §5.6.1). A ficha migrada vai para o storage na
  // hora, com rev++, para que as outras abas adotem a v2. Em só-leitura, só lê.
  function load() {
    var raw = lsGet(LS_KEY);
    if (!raw) return novaFicha();
    var f;
    try { f = JSON.parse(raw); } catch (e) { f = null; }
    if (!f || typeof f !== 'object' || Array.isArray(f)) { guardaBackup(raw); return novaFicha(); }
    if (f.schemaVersion !== SCHEMA_VERSION) guardaBackup(raw);
    var m = migra(f);
    if (somenteLeitura) { ultimoGravado = raw; return m; }
    if (f.schemaVersion !== SCHEMA_VERSION) migrouAgora = temItens(m);
    if (f.schemaVersion !== SCHEMA_VERSION || temListasVelhas(f)) {
      m.rev++; m.salvoEm = agoraISO(); grava(m);
    } else ultimoGravado = raw;
    return m;
  }
  // Roda em load, import, storage e pageshow. migrarV1 é idempotente; o delete é
  // repetido depois do deepMerge porque ele preserva chaves fora da base.
  function migra(f) {
    var m = deepMerge(novaFicha(), KhInv.migrarV1(f));
    if (!m.inventario || typeof m.inventario !== 'object' || Array.isArray(m.inventario)) m.inventario = novaFicha().inventario;
    delete m.inventario.armas; delete m.inventario.materiais;
    KhInv.COLUNAS.forEach(function (c) { if (!Array.isArray(m.inventario[c])) m.inventario[c] = []; });
    m.schemaVersion = SCHEMA_VERSION;
    var r = parseInt(m.rev, 10); m.rev = r > 0 ? r : 0;
    ['salvoEm', 'exportadoEm', 'migradoEm'].forEach(function (k) { if (typeof m[k] !== 'string') m[k] = ''; });
    return m;
  }
  function deepMerge(base, over) {
    if (typeof base !== 'object' || base === null || Array.isArray(base)) return over === undefined ? base : over;
    var out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    Object.keys(over || {}).forEach(function (k) {
      out[k] = (k in base) ? deepMerge(base[k], over[k]) : over[k];
    });
    return out;
  }

  // ---------------- gravação e sincronia (spec §5.5) ----------------
  function grava(f) {
    if (confereDono()) return false;   // a v3 é dona: esta aba não grava mais
    var s = JSON.stringify(f);
    try { localStorage.setItem(LS_KEY, s); ultimoGravado = s; return true; }
    catch (e) {
      if (e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22)) {
        toast('Não foi possível salvar — exporte a ficha');
      }
      return false;
    }
  }
  // campos digitados do drawer: debounce de 200ms, com rev++ no flush
  function save() { if (somenteLeitura) return; clearTimeout(saveT); saveT = setTimeout(flush, 200); }
  function flush() {
    if (saveT == null) return;
    clearTimeout(saveT); saveT = null;
    if (confereDono()) return;
    ficha.rev++; ficha.salvoEm = agoraISO(); grava(ficha);
  }
  function emite(partes, origem, op, uid) {
    try {
      document.dispatchEvent(new CustomEvent('kf:mudou', { detail: {
        partes: partes.slice(), origem: origem, op: op || '', uid: uid || '' } }));
    } catch (e) {}
  }
  // grava NA HORA (leva junto o que estava no debounce), redesenha e avisa
  function commit(partes, origem, op, uid) {
    clearTimeout(saveT); saveT = null;
    ficha.rev++; ficha.salvoEm = agoraISO(); grava(ficha);
    conflitoDrawer = null;
    if (body) {
      if (partes.indexOf('tudo') >= 0) renderAllQuandoLivre();
      else { renderListas(); refreshDerivados(); atualizaSins(); }
    }
    emite(partes, origem, op, uid);
    if (origem !== 'reconciliacao') verificaPendentes();
  }
  // Relê o storage; adota se o rev de lá for maior (ou igual, mas com as listas
  // velhas que um ficha.js antigo recria). Digitar a mesma ficha em duas abas
  // dentro dos mesmos 200ms: vale a última escrita (aceito).
  function sincroniza() {
    confereDono();
    var raw = lsGet(LS_KEY);
    if (!raw || raw === ultimoGravado) return false;
    var f;
    try { f = JSON.parse(raw); } catch (e) { return false; }
    if (!f || typeof f !== 'object' || Array.isArray(f)) return false;
    var r = parseInt(f.rev, 10) || 0;
    var velhas = temListasVelhas(f);
    if (!(r > ficha.rev || (r === ficha.rev && velhas))) return false;
    clearTimeout(saveT); saveT = null;
    ficha = migra(f);
    ultimoGravado = raw;
    desfazerPilha = [];
    if (velhas) { ficha.rev++; ficha.salvoEm = agoraISO(); grava(ficha); }
    if (body) renderAllQuandoLivre();
    emite(['tudo'], 'outra-aba', 'sincroniza');
    // Adotar NUNCA reconcilia: quem gravou já reconciliou com o catálogo dele.
    // Duas abas com bazar.json diferentes (deploy no meio) reconciliando cada
    // adoção gravavam uma por cima da outra para sempre. A reconciliação roda
    // uma vez por página, quando o catálogo chega (catalogo()) e no import.
    verificaPendentes();
    return true;
  }

  // ---------------- guarda contra aba velha (F0) ----------------
  // Relê o marcador; se mudou, troca de modo. Devolve se está só-leitura.
  function confereDono() {
    var v3 = donoV3();
    if (v3 !== somenteLeitura) mudaModo(v3);
    return somenteLeitura;
  }
  function mudaModo(v3) {
    somenteLeitura = v3;
    clearTimeout(saveT); saveT = null;   // o que estava no debounce não vai mais para a v2
    desfazerPilha = [];
    conflitoDrawer = null;
    // voltou para a v2: relê a chave v2 (nada foi gravado enquanto só-leitura)
    if (!v3) ficha = load();
    if (body) renderAll();
    emite(['tudo'], 'dono', v3 ? 'somente-leitura' : 'leitura-escrita');
  }
  function baixarTexto(nome, texto) {
    var blob = new Blob([texto], { type:'application/json' });
    var a = el('a', { href: URL.createObjectURL(blob), download: nome });
    document.body.appendChild(a); a.click(); a.remove();
  }
  // "Baixar ficha v3 (.json)": o pacote fichas/1 com TODAS as fichas do índice
  // v3 (KhEstado.armazem só LÊ aqui); a que não vira v3 neste bundle (ilegível
  // ou de versão futura) vai crua em 'ilegiveis', para não se perder.
  function baixarV3() {
    var p = null;
    try { p = KhEstado.armazem(localStorage, null).exportarTodas(); } catch (e) { p = null; }
    if (!p || (!p.dados.fichas.length && !(p.dados.ilegiveis || []).length)) {
      toast('Não há ficha v3 salva neste navegador');
      return false;
    }
    baixarTexto(p.nomeArquivo, JSON.stringify(p.dados, null, 2));
    return true;
  }
  // "Voltar a usar a v2": apaga só o marcador (a chave v3 fica intacta)
  function voltarV2() {
    try { localStorage.removeItem(DONO_KEY); } catch (e) {}
    confereDono();
    if (!somenteLeitura) toast('Ficha v2 em uso de novo');
  }
  function faixaSomenteLeitura() {
    return el('div', { id:'kf-ro', role:'alert' }, [
      el('p', {}, [MSG_RO]),
      el('div', { class:'kf-row' }, [
        el('button', { type:'button', class:'kf-btn sm', 'data-kf-ro':'', title:'Baixar ficha v3 (.json)', onclick: baixarV3 }, ['Baixar ficha v3 (.json)']),
        el('button', { type:'button', class:'kf-btn sm', 'data-kf-ro':'', title:'Voltar a usar a v2', onclick: voltarV2 }, ['Voltar a usar a v2'])
      ])
    ]);
  }
  // só-leitura: tudo que edita no drawer fica desabilitado (a faixa não)
  function travaDrawer() {
    if (!drawer) return;
    drawer.classList.toggle('kf-ro', somenteLeitura);
    if (!somenteLeitura) return;
    body.querySelectorAll('input,select,textarea,button').forEach(function (x) {
      if (!x.hasAttribute('data-kf-ro')) x.disabled = true;
    });
  }

  // ---------------- mutadores (spec §5.3) ----------------
  // sincroniza, snapshot para desfazer, aplica, commit. Sem mudança, nada é
  // gravado nem emitido (ex.: alternar com conflito). Dentro de lote só aplica.
  function empilhaDesfazer(json) {
    desfazerPilha.push(json);
    if (desfazerPilha.length > DESFAZER_MAX) desfazerPilha.shift();
  }
  function partesDoDiff(antes) {
    var a = JSON.parse(antes), d = ficha.inventario, p = [];
    if (JSON.stringify(a.bugigangas) !== JSON.stringify(d.bugigangas) ||
        JSON.stringify(a.equipamentos) !== JSON.stringify(d.equipamentos)) p.push('inventario');
    if (a.sins !== d.sins) p.push('sins');
    return p.length ? p : ['inventario'];
  }
  // Só-leitura (F0): nenhum mutador aplica nada, nem na memória; o Bazar recebe
  // {ok:false, erro:'somente-leitura'} (ou null/false, conforme o mutador).
  var RES_RO = { ok: false, erro: 'somente-leitura' };
  function bloqueado() {
    sincroniza();
    if (!somenteLeitura) return false;
    toast(MSG_RO, 4000);
    return true;
  }
  function muta(op, origem, fn) {
    if (loteN) return somenteLeitura ? Object.assign({}, RES_RO) : fn();
    if (bloqueado()) return Object.assign({}, RES_RO);   // bloqueado() já sincronizou
    var antes = JSON.stringify(ficha.inventario);
    var r = fn();
    if (JSON.stringify(ficha.inventario) === antes) return r;
    empilhaDesfazer(antes);
    commit(partesDoDiff(antes), origem || 'local', op, r && r.uid);
    return r;
  }
  function doCatalogo(item) {   // o registro atual vence o payload (card sem catálogo, drag antigo)
    if (!item || item.avulso || !idxCatalogo) return item;
    return (item.id && temPropria(idxCatalogo.porId, item.id) && idxCatalogo.porId[item.id]) ||
      (item.nome && temPropria(idxCatalogo.porNome, item.nome) && idxCatalogo.porNome[item.nome]) || item;
  }
  function adicionar(item, opts, origem) {
    if (!item || typeof item !== 'object') return null;
    if (item.avulso ? !String(item.nome || '').trim() : !(item.id || item.nome)) return null;
    var it = doCatalogo(item);
    var r = muta('adicionar', origem, function () { return KhInv.mesclar(ficha.inventario, it, opts || {}); });
    return r && r.uid ? r.uid : null;
  }
  function quantidade(uid, n, origem) {
    return muta('quantidade', origem, function () { return Object.assign({ uid: uid }, KhInv.quantidade(ficha.inventario, uid, n)); });
  }
  function alternar(uid, campo, origem) {
    return muta('alternar', origem, function () { return KhInv.alternar(ficha.inventario, uid, campo); });
  }
  function trocar(uid, campo, uidsASoltar, origem) {   // "Trocar por esta": um passo só de desfazer
    return muta('trocar', origem, function () { return KhInv.trocar(ficha.inventario, uid, campo, uidsASoltar); });
  }
  function mover(uid, coluna, origem) {
    return muta('mover', origem, function () { return KhInv.mover(ficha.inventario, uid, coluna); });
  }
  function remover(uid, origem) {
    var r = muta('remover', origem, function () { return { uid: uid, entrada: KhInv.remover(ficha.inventario, uid) }; });
    return !!(r && r.entrada);
  }
  function definirSins(n, origem) {
    n = Math.floor(Number(n));
    if (!(n >= 0)) n = 0;
    muta('sins', origem, function () { ficha.inventario.sins = n; return null; });
    return ficha.inventario.sins;
  }
  function lote(fn) {
    if (loteN) return fn();
    if (bloqueado()) return Object.assign({}, RES_RO);   // fn nem roda
    var antes = JSON.stringify(ficha.inventario), r;
    loteN++;
    try { r = fn(); }
    catch (e) { ficha.inventario = JSON.parse(antes); throw e; }
    finally { loteN--; }
    if (JSON.stringify(ficha.inventario) === antes) return r;
    empilhaDesfazer(antes);
    commit(partesDoDiff(antes), 'local', 'lote', r && r.uid);
    return r;
  }
  function desfazer() {
    if (bloqueado() || !desfazerPilha.length) return false;
    ficha.inventario = JSON.parse(desfazerPilha.pop());
    commit(['inventario', 'sins'], 'desfazer', 'desfazer');
    return true;
  }

  // ---------------- catálogo e reconciliação (spec §5.6/§5.7) ----------------
  function naBazar() { return !!(document.body && document.body.hasAttribute('data-bazar')); }
  function reconciliaCatalogo() {
    if (!idxCatalogo || somenteLeitura) return;   // em só-leitura nem a memória muda
    if (KhInv.reconciliar(ficha.inventario, idxCatalogo.porId, idxCatalogo.porNome)) {
      commit(['inventario'], 'reconciliacao', 'reconciliar');
    }
  }
  // o Bazar entrega o bazar.json já baixado; fora dele, é o fetch preguiçoso
  function catalogo(arr) {
    if (!Array.isArray(arr)) return;
    bazarCache = arr;
    idxCatalogo = KhInv.indexar(arr);
    sincroniza();
    reconciliaCatalogo();
    if (body) decorarBazar();
  }
  function pedeCatalogo() {
    if (bazarCache) return Promise.resolve(bazarCache);
    if (!catalogoPromessa) {
      catalogoPromessa = fetch(ROOT + 'data/bazar.json')
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (d) { if (!bazarCache) catalogo(d); return bazarCache; });
    }
    return catalogoPromessa;
  }
  // entrada sem inv (migrada ou vinda de card sem catálogo) e fora do registro ainda não conferida
  function temPendentes() {
    return KhInv.COLUNAS.some(function (c) {
      return (ficha.inventario[c] || []).some(function (e) { return e && e.inv === null && !e.avulso && !e.orfao; });
    });
  }
  function verificaPendentes() {
    if (bazarCache || catalogoPromessa || !document.body || naBazar() || !temPendentes()) return;
    pedeCatalogo().catch(function () {});
  }

  // ---------------- derivados ----------------
  function mod(attr) { return Math.floor((ficha.atributos[attr] - 10) / 2); }
  function modStr(attr) { var m = mod(attr); return (m >= 0 ? '+' : '') + m; }

  // ---------------- util DOM ----------------
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k.slice(0,2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (k) { if (k != null) e.appendChild(typeof k === 'string' ? document.createTextNode(k) : k); });
    return e;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]; }); }
  // referência ao objeto da ficha resolvida na hora do evento: depois de adotar
  // outra aba (ficha nova), o input focado grava na ficha certa
  function R(caminho) {
    return function () { return caminho.split('.').reduce(function (o, k) { return o[k]; }, ficha); };
  }
  function alvoDe(obj) { return typeof obj === 'function' ? obj() : obj; }

  // ---------------- entidades (payload de card) ----------------
  function slug(nome, pre) {
    var s = (nome || '').normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return (pre || '') + s;
  }
  function addEntidade(campo, ent) {
    if (bloqueado()) return;
    var lista = ficha[campo];
    // evita duplicar mesmo id
    if (ent.id && lista.some(function (x) { return x.id === ent.id; })) { toast(ent.nome + ' já está na ficha'); return; }
    lista.push(ent); save(); if (body) renderListas(); toast('+ ' + ent.nome);
  }

  // ---------------- toast ----------------
  function toast(msg, ms) {
    if (!document.body) return;
    var t = document.getElementById('kf-toast');
    if (!t) { t = el('div', { id:'kf-toast', 'data-kf-ignorar':'', role:'status' }); document.body.appendChild(t); }
    t.textContent = msg; t.className = 'kf-show';
    clearTimeout(toastT); toastT = setTimeout(function () { t.className = ''; }, ms || 1600);
  }

  // ---------------- CSS ----------------
  // Em css/ficha.css (F2a), que o shell põe em todas as páginas: o ficha.js não
  // injeta mais <style>.

  // ---------------- drawer ----------------
  function setOpen(b) {
    drawer.classList.toggle('kf-open', b);
    if (somenteLeitura) return;
    try { localStorage.setItem(OPEN_KEY, b ? '1' : '0'); } catch (e) {}
  }
  function buildDrawer() {
    var toggle = el('button', { id:'kf-toggle', title:'Ficha de Personagem',
      onclick: function () { setOpen(!drawer.classList.contains('kf-open')); } }, ['📋 FICHA']);
    document.body.appendChild(toggle);

    drawer = el('div', { id:'kf-drawer', class:'kf-drawer', 'data-kf-ignorar':'' });
    var head = el('div', { id:'kf-head' }, [
      el('h2', {}, ['Ficha']),
      el('button', { class:'kf-btn sm', title:'Exportar JSON', onclick: exportJSON }, ['⬇ JSON']),
      el('button', { class:'kf-btn sm', title:'Importar JSON', onclick: importJSON }, ['⬆']),
      el('button', { class:'kf-btn sm', title:'Exportar p/ Bestiário', onclick: exportBestiario }, ['🐲']),
      el('button', { class:'kf-btn sm', title:'Nova ficha', onclick: resetFicha }, ['✦']),
      el('button', { class:'kf-btn sm', title:'Fechar', onclick: function () { setOpen(false); } }, ['✕'])
    ]);
    body = el('div', { id:'kf-body' });
    drawer.appendChild(head); drawer.appendChild(body);
    document.body.appendChild(drawer);
    renderAll();
    // re-hidrata estado aberto/fechado entre páginas (sem animar na carga)
    if (lsGet(OPEN_KEY) === '1') {
      var prev = drawer.style.transition; drawer.style.transition = 'none';
      drawer.classList.add('kf-open');
      // reflow síncrono em vez de rAF: com a aba oculta o rAF não roda e o
      // drawer ficaria sem transição até ela aparecer
      void drawer.offsetWidth;
      drawer.style.transition = prev;
    }
  }

  function sec(chave, titulo, conteudo, collapsed) {
    var b = el('div', { class:'kf-secbody' }, conteudo);
    var s = el('div', { class:'kf-sec' + (collapsed ? ' kf-collapsed' : ''), 'data-sec': chave }, [
      el('h3', { onclick: function () { s.classList.toggle('kf-collapsed'); } }, [titulo, el('span', {}, ['▾'])]),
      b
    ]);
    return s;
  }

  function txt(label, obj, key, type) {
    var inp = el('input', { type: type || 'text', value: alvoDe(obj)[key] });
    inp.addEventListener('input', function () {
      alvoDe(obj)[key] = (type === 'number') ? (parseFloat(inp.value) || 0) : inp.value;
      save(); refreshDerivados();
    });
    return el('div', { class:'kf-row' }, [label ? el('label', {}, [label]) : null, inp]);
  }

  // Com um input do drawer focado, espera o focusout (não arranca o campo do jogador)
  function focoNoDrawer() {
    var a = document.activeElement;
    return !!(a && drawer && drawer.contains(a) && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
  }
  function renderAllQuandoLivre() {
    if (!body) return;
    if (!focoNoDrawer()) { renderPendente = false; renderAll(); return; }
    if (renderPendente) return;
    renderPendente = true;
    drawer.addEventListener('focusout', function () {
      setTimeout(function () { renderPendente = false; renderAllQuandoLivre(); }, 0);
    }, { once: true });
  }

  function renderAll() {
    // preserva seções abertas/recolhidas e a rolagem (renderAll agora roda em import/outra aba)
    var estadoSec = {}, rolagem = body.scrollTop;
    body.querySelectorAll('.kf-sec[data-sec]').forEach(function (s) {
      estadoSec[s.getAttribute('data-sec')] = s.classList.contains('kf-collapsed');
    });
    function rec(chave, padrao) { return temPropria(estadoSec, chave) ? estadoSec[chave] : padrao; }
    body.innerHTML = '';
    derdispEl = null; cargaEl = null;
    if (somenteLeitura) body.appendChild(faixaSomenteLeitura());
    // no Bazar o inventário completo está na página: a seção nasce recolhida, com a nota
    var noBazar = naBazar();
    var tituloInv = noBazar
      ? el('span', {}, ['▐ Inventário ', el('span', { class:'kf-sec-nota' }, ['· o inventário completo está nesta página'])])
      : '▐ Inventário';
    // NÚCLEO
    body.appendChild(sec('identidade', '▐ Identidade', [
      txt('Nome', R('meta'), 'nome'), txt('Jogador', R('meta'), 'jogador'),
      el('div', { class:'kf-row' }, [
        el('label', {}, ['Nível']), numInput(R('meta'), 'nivel'),
        el('label', {}, ['XP']), numInput(R('meta'), 'xp')
      ]),
      txt('Raça', R('meta'), 'raca'), txt('Variante', R('meta'), 'variante'),
      txt('Classe', R('meta'), 'classe'), txt('Ramo', R('meta'), 'ramo'),
      txt('Origem', R('meta'), 'origem')
    ], rec('identidade', false)));
    body.appendChild(sec('atributos', '▐ Atributos', [renderAtributos()], rec('atributos', false)));
    body.appendChild(sec('pericias', '▐ Perícias', [renderPericias()], rec('pericias', true)));
    body.appendChild(sec('recursos', '▐ Recursos', renderRecursos(), rec('recursos', false)));
    body.appendChild(sec('derivados', '▐ Derivados', [renderDerivados()], rec('derivados', false)));
    body.appendChild(sec('resistencias', '▐ Resistências', [renderResist()], rec('resistencias', true)));
    body.appendChild(sec('inventario', tituloInv, renderInventario(), rec('inventario', noBazar)));
    // listas por DnD/+add
    body.appendChild(sec('tecnicas', '▐ Técnicas & Marcas', [dropZone('tecnicas','Arraste técnicas/marcas aqui'), listaEl('tecnicas')], rec('tecnicas', false)));
    body.appendChild(sec('grimorio', '▐ Grimório (Magias)', [dropZone('grimorio','Arraste magias aqui'), listaEl('grimorio')], rec('grimorio', false)));
    body.appendChild(sec('cartas', '▐ Cartas do Limiar', [dropZone('cartasLimiar','Arraste cartas do Limiar aqui'), listaEl('cartasLimiar')], rec('cartas', false)));
    body.appendChild(sec('lore', '▐ Lore', [
      el('div',{class:'kf-row'},[el('label',{},['História'])]),
      areaInput(R('lore'),'historia'),
      el('div',{class:'kf-row'},[el('label',{},['Outros'])]),
      areaInput(R('lore'),'outros')
    ], rec('lore', true)));
    body.scrollTop = rolagem;
    travaDrawer();
  }

  function numInput(obj, key) {
    var inp = el('input', { type:'number', value: alvoDe(obj)[key] });
    inp.addEventListener('input', function () { alvoDe(obj)[key] = parseFloat(inp.value) || 0; save(); refreshDerivados(); });
    return inp;
  }
  function areaInput(obj, key) {
    var ta = el('textarea', { rows:3, style:'width:100%' }); ta.value = alvoDe(obj)[key] || '';
    ta.addEventListener('input', function () { alvoDe(obj)[key] = ta.value; save(); });
    return ta;
  }

  function renderAtributos() {
    var grid = el('div', { class:'kf-attrs' });
    ATTRS.forEach(function (a) {
      var inp = el('input', { type:'number', min:1, max:30, value: ficha.atributos[a[0]] });
      var modEl = el('div', { class:'kf-mod' }, [modStr(a[0])]);
      inp.addEventListener('input', function () {
        ficha.atributos[a[0]] = parseInt(inp.value, 10) || 0; save();
        modEl.textContent = modStr(a[0]); refreshDerivados();
        emite(['atributos'], 'drawer', 'atributo');
      });
      grid.appendChild(el('div', { class:'kf-a' }, [el('label', {}, [a[1]]), inp, modEl]));
    });
    return grid;
  }

  function renderPericias() {
    var wrap = el('div', {});
    PERICIAS.forEach(function (p) {
      var selv = ficha.pericias[p[0]];
      var opts = PROF_LEVELS.map(function (lv) {
        return el('option', { value: lv, selected: lv === selv ? '' : null }, ['+' + lv + ' ' + PROF_LABEL[lv]]);
      });
      var sel = el('select', {}, opts);
      sel.addEventListener('change', function () { ficha.pericias[p[0]] = parseInt(sel.value, 10); save(); });
      var linha = el('div', { class:'kf-per' }, [el('span', {}, [p[1]]), sel]);
      if (p[0] === 'oficio') {
        var oa = el('select', { style:'width:56px' }, ATTRS.map(function (a) {
          return el('option', { value:a[0], selected: a[0]===ficha.oficioAttr?'':null }, [a[1]]); }));
        oa.addEventListener('change', function () { ficha.oficioAttr = oa.value; save(); });
        linha.appendChild(oa);
      }
      wrap.appendChild(linha);
    });
    return wrap;
  }

  function recRow(label, r) {
    var a = numInput(r, 'atual'), m = numInput(r, 'max');
    return el('div', { class:'kf-row' }, [el('label', {}, [label]), a, el('span',{style:'color:#666'},['/']), m]);
  }
  function renderRecursos() {
    return [
      recRow('Saúde', R('recursos.saude')),
      recRow('Stamina', R('recursos.stamina')),
      recRow('Éter', R('recursos.eter')),
      el('div', { class:'kf-row' }, [
        el('label', {}, ['Rec. Classe']),
        (function(){ var i=el('input',{type:'text',value:ficha.recursos.recursoClasse.nome,placeholder:'ex: FLUXO'});
          i.addEventListener('input',function(){ficha.recursos.recursoClasse.nome=i.value;save();});return i;})()
      ]),
      recRow('  ↳ valor', R('recursos.recursoClasse'))
    ];
  }

  var derdispEl;
  function renderDerivados() {
    var wrap = el('div', {});
    // manuais (vêm da classe/regras)
    wrap.appendChild(el('div', { class:'kf-row' }, [
      el('label', {}, ['Evasão']), numInput(R('derivadosManuais'), 'evasao'),
      el('label', {}, ['CD']), numInput(R('derivadosManuais'), 'cd')
    ]));
    wrap.appendChild(el('div', { class:'kf-row' }, [
      el('label', {}, ['Movim.(m)']), numInput(R('derivadosManuais'), 'movimento'),
      el('label', {}, ['Armadura']), numInput(R('derivadosManuais'), 'armadura')
    ]));
    wrap.appendChild(el('div', { class:'kf-row', style:'font-size:10px;color:#666' },
      ['Evasão/CD/Movim. vêm da sua classe — preencha manualmente.']));
    derdispEl = el('div', { class:'kf-derdisp' });
    wrap.appendChild(derdispEl);
    refreshDerivados();
    return wrap;
  }
  // Equip./Bugigangas pela mesma carga do KF.carga(), com Leve e Extremo; o
  // bloco de carga do Inventário (Peso total, condição, réguas) vai junto
  function refreshDerivados() {
    var cg = (derdispEl || cargaEl) ? cargaAtual() : null;
    refreshCarga(cg);
    if (!derdispEl) return;
    function linha(rotulo, c) {
      var sp = c.estado === 'leve' ? ' · Sobrepeso Leve' : (c.estado === 'extremo' ? ' · Sobrepeso Extremo' : '');
      return '<div>' + rotulo + '</div><div class="' + (c.estado === 'ok' ? 'kf-ok' : 'kf-warn') + '">' +
        c.usado + ' / ' + c.max + sp + '</div>';
    }
    derdispEl.innerHTML =
      '<div>Mods</div><div><b>' + ATTRS.map(function(a){return a[1]+' '+modStr(a[0]);}).join(' · ') + '</b></div>' +
      linha('Equip.', cg.equipamentos) + linha('Bugigangas', cg.bugigangas);
  }

  function renderResist() {
    var grid = el('div', { class:'kf-res' });
    grid.appendChild(el('div', {}));
    grid.appendChild(el('div', { class:'kf-rh', title:'Resistência' }, ['R']));
    grid.appendChild(el('div', { class:'kf-rh', title:'Imunidade' }, ['I']));
    grid.appendChild(el('div', { class:'kf-rh', title:'Armadura Específica' }, ['Ae']));
    RESIST.forEach(function (r) {
      grid.appendChild(el('div', {}, [r[1]]));
      ['R','I'].forEach(function (k) {
        var cb = el('input', { type:'checkbox' }); cb.checked = ficha.resistencias[r[0]][k];
        cb.addEventListener('change', function () { ficha.resistencias[r[0]][k] = cb.checked; save(); });
        grid.appendChild(cb);
      });
      var ae = el('input', { type:'number', value: ficha.resistencias[r[0]].ae || 0, title:'Ae ' + r[1] });
      ae.addEventListener('input', function () { ficha.resistencias[r[0]].ae = parseInt(ae.value, 10) || 0; save(); });
      grid.appendChild(ae);
    });
    return grid;
  }

  // ---------------- inventário no drawer (spec §4.11) ----------------
  // Duas colunas por uid: [nome] [= peso] [×] / [− n +] [☐ Item Empilhável]
  // [☐ Equipado]. Peso total, condição e as duas réguas vêm de cargaAtual()
  // (o mesmo KF.carga()) e são redesenhados em refreshDerivados(), então a FOR
  // digitada mexe na régua na hora. Tudo escreve pelos mutadores (commit).
  var NOME_COL = { bugigangas: 'Bugigangas', equipamentos: 'Equipamentos' };
  var cargaEl = null;
  function cargaAtual() { return KhInv.calcular(ficha.inventario, ficha.atributos.for); }
  function atual(uid) { var a = KhInv.acha(ficha.inventario, uid); return a ? a.entrada : null; }

  // texto verbatim da condição quando o Bazar injetou BZ_VOCAB; fora dele, só o link
  function condicaoInfo(c) {
    var v = raiz.BZ_VOCAB && raiz.BZ_VOCAB.condicoes && raiz.BZ_VOCAB.condicoes[c];
    return { id: (v && v.id) || 'sobrepeso-' + c,
      nome: (v && v.nome) || (c === 'leve' ? 'Sobrepeso Leve' : 'Sobrepeso Extremo'),
      texto: (v && v.texto) || '' };
  }
  function seloCondicao(condicao) {
    if (condicao !== 'leve' && condicao !== 'extremo') {
      return el('span', { class:'kf-cond kf-cond-nenhuma' }, ['Sem sobrepeso']);
    }
    var ci = condicaoInfo(condicao);
    return el('a', { class:'kf-cond kf-cond-' + condicao, href: ROOT + 'pages/condicoes.html#' + ci.id,
      title: ci.texto || ('Ver ' + ci.nome + ' em Condições') }, [ci.nome]);
  }
  // "10 base + 2 FOR 14 + 3 Mochila Reforçada = 15" (o mínimo 1 vale só para a base)
  function contaCapacidade(c, cg) {
    var base = c === 'bugigangas' ? KhInv.REGRAS.BASE_BUG : KhInv.REGRAS.BASE_EQ;
    var col = cg[c], m = cg.modFor;
    var s = base + ' base ' + (m < 0 ? '− ' + (-m) : '+ ' + m) + ' FOR ' + cg.forca;
    if (base + m < KhInv.REGRAS.MIN) s += ' (mín. ' + KhInv.REGRAS.MIN + ')';
    col.bonus.forEach(function (b) {
      s += ' + ' + b.n + ' ' + b.nome;
      if (b.ignoradas === 1) s += ' (2ª ' + b.nome + ' não acumula)';
      else if (b.ignoradas > 1) s += ' (' + b.ignoradas + ' cópias de ' + b.nome + ' não acumulam)';
    });
    return s + ' = ' + col.max;
  }
  function textoEstado(col) {
    if (col.estado === 'ok') return 'livre ' + (col.max - col.usado);
    if (col.estado === 'leve') return 'Sobrepeso Leve — Extremo em ' + (2 * col.max);
    return 'Sobrepeso Extremo';
  }
  // régua de 0 a 2×max: dourado até o max, âmbar hachurado até 2×max; marco no max
  function regua(c, cg) {
    var col = cg[c], total = 2 * col.max;
    var ok = total > 0 ? Math.min(col.usado, col.max) / total * 100 : 0;
    var exc = total > 0 ? Math.max(0, Math.min(col.usado, total) - col.max) / total * 100 : 0;
    var cond = col.estado === 'leve' ? ', Sobrepeso Leve' : (col.estado === 'extremo' ? ', Sobrepeso Extremo' : '');
    return el('div', { class:'kf-regua', role:'meter', 'aria-label': NOME_COL[c],
      'aria-valuemin': 0, 'aria-valuemax': col.max, 'aria-valuenow': col.usado,
      'aria-valuetext': col.usado + ' de ' + col.max + ' ' + NOME_COL[c].toLowerCase() + cond }, [
      el('span', { class:'kf-regua-ok', style:'width:' + ok + '%' }),
      exc > 0 ? el('span', { class:'kf-regua-exc', style:'width:' + exc + '%' }) : null,
      el('span', { class:'kf-regua-marco' }),
      col.usado > total ? el('span', { class:'kf-regua-mais' }, ['+' + (col.usado - total)]) : null
    ]);
  }
  function blocoColuna(c, cg) {
    var col = cg[c];
    return el('div', { class:'kf-carga-col kf-est-' + col.estado, 'data-carga': c }, [
      el('div', { class:'kf-carga-lin' }, [
        el('span', { class:'kf-carga-nome' }, [NOME_COL[c]]),
        el('span', { class:'kf-carga-num', title: contaCapacidade(c, cg) }, [
          el('b', {}, [String(col.usado)]), ' / ' + col.max]),
        el('span', { class:'kf-carga-est' }, [textoEstado(col)])
      ]),
      regua(c, cg)
    ]);
  }
  function refreshCarga(cg) {
    if (!cargaEl) return;
    cg = cg || cargaAtual();
    cargaEl.innerHTML = '';
    cargaEl.appendChild(el('div', { class:'kf-carga-topo' }, [
      el('div', { class:'kf-peso' }, [
        'Peso total', el('b', {}, [String(cg.pesoTotal)]),
        el('small', {}, [cg.bugigangas.usado + ' bugigangas + ' + cg.equipamentos.usado + ' equipamentos'])
      ]),
      seloCondicao(cg.condicao)
    ]));
    KhInv.COLUNAS.forEach(function (c) { cargaEl.appendChild(blocoColuna(c, cg)); });
  }

  function renderInventario() {
    var sins = el('input', { type:'number', min:0, step:1, id:'kf-sins', value: ficha.inventario.sins, title:'não pesa' });
    sins.addEventListener('change', function () { sins.value = definirSins(sins.value, 'drawer'); });
    var busca = el('input', { type:'text', placeholder:'Buscar item do Bazar…' });
    var res = el('div', {});
    busca.addEventListener('input', function () { buscaBazar(busca.value, res); });
    cargaEl = el('div', { class:'kf-carga' });
    var cg = cargaAtual();
    refreshCarga(cg);
    return [
      el('div', { class:'kf-row' }, [el('label', {}, ['Sins']), sins]),
      cargaEl,
      el('div', { class:'kf-row' }, [busca]),
      res,
      dropZone('inventario', 'Arraste itens do Bazar aqui'),
      el('div', { class:'kf-inv-cab' }, [NOME_COL.bugigangas]), listaInvEl('bugigangas', cg),
      el('div', { class:'kf-inv-cab' }, [NOME_COL.equipamentos]), listaInvEl('equipamentos', cg)
    ];
  }
  function atualizaSins() {
    var i = body && body.querySelector('#kf-sins');
    if (i && document.activeElement !== i) i.value = ficha.inventario.sins;
  }
  function listaInvEl(coluna, cg) {
    cg = cg || cargaAtual();
    var wrap = el('div', { class:'kf-inv-lista', 'data-lista': 'inventario.' + coluna, 'data-col': coluna });
    var l = (ficha.inventario[coluna] || []).filter(function (e) { return e && e.uid; });
    if (!l.length) wrap.appendChild(el('div', { class:'kf-inv-vazio' }, ['Nada carregado.']));
    var avisos = {};
    cg.avisos.forEach(function (a) {
      (a.uids || []).forEach(function (u) { (avisos[u] = avisos[u] || []).push(a); });
    });
    l.forEach(function (e) { wrap.appendChild(linhaInv(e, coluna, cg, avisos[e.uid] || [])); });
    return wrap;
  }
  function motivoPeso(e, coluna, cg) {
    var m = cg.motivoPorUid[e.uid], p = cg.pesoPorUid[e.uid] || 0;
    if (m === 'equipado') return 'equipado não conta';
    if (m === 'nao-ocupa') return 'não ocupa espaço';
    if (m === 'unidade') return 'cada item pesa 1';
    if (m === 'pilha') {
      if (!p) return 'soma na pilha da outra linha deste item';
      var k = e.id || e.uid, soma = 0;
      (ficha.inventario[coluna] || []).forEach(function (x) {
        if (x && cg.motivoPorUid[x.uid] === 'pilha' && (x.id || x.uid) === k) soma += x.qtd;
      });
      return soma + ' un. ÷ ' + KhInv.REGRAS.PILHA + ', arredonda para cima = ' + p;
    }
    return '';
  }
  function textoConflito(cf) {
    var nomes = (cf.uids || []).map(function (u) { var x = atual(u); return x ? x.nome : ''; }).filter(Boolean);
    var n = nomes.length, lista = nomes.length ? ' (' + nomes.join(', ') + ')' : '';
    if (cf.tipo === 'pesada') return 'Já há ' + n + (n === 1 ? ' Armadura Pesada equipada' : ' Armaduras Pesadas equipadas') + lista + '.';
    if (cf.tipo === 'leve') return 'Já há ' + n + (n === 1 ? ' Armadura Leve equipada' : ' Armaduras Leves equipadas') + lista + '.';
    return 'Já há ' + n + (n === 1 ? ' Item Mágico sintonizado' : ' Itens Mágicos sintonizados') + lista + '.';
  }
  function tagEl(t, title) { return el('span', { class:'kf-tag', title: title || null }, [t]); }
  function caixa(ctl, rotulo, marcado, aoMudar, extra) {
    var cb = el('input', { type:'checkbox', 'data-ctl': ctl });
    cb.checked = !!marcado;
    cb.addEventListener('change', function () { aoMudar(cb); });
    return el('label', { class:'kf-inv-cx' }, [cb, ' ' + rotulo, extra || null]);
  }
  function linhaInv(e, coluna, cg, avisos) {
    var uid = e.uid, peso = cg.pesoPorUid[uid] || 0;
    var qtd = e.qtd;
    function mudaQtd(n) {
      var ent = atual(uid);
      if (!ent) return;
      var r = quantidade(uid, n, 'drawer');
      if (r && r.removido) toast('Removido: ' + ent.nome);
      // só-leitura: bloqueado() já avisou e redesenhou tudo travado
      else if (r && r.erro === RES_RO.erro) return;
      else if (r && r.erro) { toast(MSG_QTD_1[r.erro] || ''); renderListas(); }
    }
    var trava = e.equipado ? MSG_QTD_1.equipado : (e.sintonizado ? MSG_QTD_1.sintonizado : '');
    function passo(ev, d) {
      var ent = atual(uid);
      if (ent) mudaQtd(ent.qtd + (ev && ev.shiftKey ? 10 * d : d));
    }
    // L1: nome, peso com o motivo no title, ×
    var tags = [];
    if (e.equipado) tags.push(tagEl('equipado'));
    if (e.sintonizado) tags.push(tagEl('sintonizado'));
    if (e.avulso) tags.push(tagEl('sem registro'));
    if (e.inv && e.inv.capacidade) {
      var cp = [];
      if (e.inv.capacidade.bug) cp.push('+' + e.inv.capacidade.bug + ' bugigangas');
      if (e.inv.capacidade.equip) cp.push('+' + e.inv.capacidade.equip + ' equipamentos');
      if (cp.length) tags.push(tagEl(cp.join(' · '), 'aumenta a capacidade'));
    }
    if (e.inv && e.inv.recipiente) tags.push(tagEl('recipiente ainda não modelado',
      'Armazena até ' + e.inv.recipiente + ' Bugigangas: a ficha ainda não desconta isso'));
    var textos = [];
    avisos.forEach(function (a) {
      if (a.tipo === 'copia') tags.push(tagEl('cópia não acumula', a.msg));
      else if (a.tipo === 'orfao') tags.push(tagEl('fora do registro', a.msg));
      else if (a.tipo === 'fora-da-regra') {
        tags.push(el('button', { type:'button', class:'kf-tag', 'data-ctl':'corrigir', title: a.msg + ' (clique para mover)',
          onclick: function () { var x = atual(uid); if (x) mover(uid, KhInv.colunaCanonica(x), 'drawer'); } },
          ['fora da regra · corrigir']));
      } else textos.push(a.msg);   // pesada | leve | sintonia: estado acima do limite, só aviso
    });
    var linha = el('div', { class:'kf-inv-item' + (e.equipado ? ' kf-equipado' : ''), 'data-uid': uid, role:'group',
      'aria-label': e.nome + ', ' + qtd + ', peso ' + peso + (e.empilhavel ? ', empilhável' : '') + (e.equipado ? ', equipado' : '') }, [
      el('div', { class:'kf-inv-l1' }, [
        el('span', { class:'kf-inv-nome' + (e.orfao ? ' kf-orfao' : ''), title: [e.categoria, e.raridade].filter(Boolean).join(' · ') || null }, [e.nome]),
        el('span', { class:'kf-inv-peso', title: motivoPeso(e, coluna, cg) }, ['= ' + peso]),
        el('button', { type:'button', class:'kf-inv-x', 'data-ctl':'x', title:'Remover', 'aria-label':'Remover ' + e.nome,
          onclick: function () { var x = atual(uid); if (x && remover(uid, 'drawer')) toast('Removido: ' + x.nome); } }, ['×'])
      ])
    ]);
    // L2: stepper, Item Empilhável, Equipado
    var num = el('input', { type:'text', inputmode:'numeric', 'data-ctl':'qtd', value: qtd,
      'aria-label':'Quantidade de ' + e.nome, title: trava || 'Quantidade (Enter aplica; 0 remove)',
      readonly: trava ? 'readonly' : null });
    function aplicaNum() {
      var n = parseInt(String(num.value).trim(), 10);
      if (!isFinite(n)) { num.value = qtd; return; }
      if (n !== qtd) mudaQtd(n);
    }
    num.addEventListener('change', aplicaNum);
    num.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') { ev.preventDefault(); aplicaNum(); }
      else if (ev.key === 'Escape') { num.value = qtd; }
    });
    var dif = null;
    if (typeof e.empilhavelRegistro === 'boolean' && e.empilhavel !== e.empilhavelRegistro) {
      dif = el('span', { class:'kf-dif', title:'o registro diz: ' + (e.empilhavelRegistro ? 'empilhável' : 'não empilhável') });
    }
    var l2 = el('div', { class:'kf-inv-l2' }, [
      el('span', { class:'kf-step' }, [
        el('button', { type:'button', 'data-ctl':'menos', title:'Menos 1 (Shift: 10)', 'aria-label':'Diminuir ' + e.nome,
          onclick: function (ev) { passo(ev, -1); } }, ['−']),
        num,
        el('button', { type:'button', 'data-ctl':'mais', title: trava || 'Mais 1 (Shift: 10)', 'aria-label':'Aumentar ' + e.nome,
          disabled: trava ? 'disabled' : null, onclick: function (ev) { passo(ev, 1); } }, ['+'])
      ]),
      caixa('emp', 'Item Empilhável', e.empilhavel, function () { alternar(uid, 'empilhavel', 'drawer'); }, dif)
    ]);
    if (coluna === 'equipamentos') {
      l2.appendChild(caixa('equip', 'Equipado', e.equipado, function (cb) {
        var r = alternar(uid, 'equipado', 'drawer');
        if (r && r.ok) return;
        cb.checked = !cb.checked;   // conflito ou erro: nada muda
        if (r && r.conflito) { conflitoDrawer = { uid: uid, campo: 'equipado', conflito: r.conflito }; renderListas(); }
      }));
    }
    linha.appendChild(l2);
    if (tags.length) linha.appendChild(el('div', { class:'kf-inv-tags' }, tags));
    textos.forEach(function (t) { linha.appendChild(el('p', { class:'kf-inv-aviso' }, [t])); });
    // Passar do limite não muda nada: a linha oferece "Trocar por esta" (um passo só de desfazer)
    if (conflitoDrawer && conflitoDrawer.uid === uid) {
      var cf = conflitoDrawer;
      linha.appendChild(el('p', { class:'kf-inv-aviso', role:'status' }, [
        textoConflito(cf.conflito),
        el('button', { type:'button', class:'kf-btn sm', 'data-ctl':'trocar', onclick: function () {
          var x = atual(uid);
          var r = trocar(uid, cf.campo, cf.conflito.uids, 'drawer');
          if (r && r.ok && x) toast('Trocado: ' + x.nome + ' equipado');
        } }, ['Trocar por esta'])
      ]));
    }
    return linha;
  }

  // ---- listas (suporta caminho aninhado inventario.x) ----
  function getLista(campo) {
    if (campo.indexOf('.') > 0) { var p = campo.split('.'); return ficha[p[0]][p[1]]; }
    return ficha[campo];
  }
  function listaEl(campo) {
    var wrap = el('div', { 'data-lista': campo });
    getLista(campo).forEach(function (item, i) {
      wrap.appendChild(el('div', { class:'kf-list-item' }, [
        el('span', { class:'kf-x', title:'Remover', onclick: function () {
          if (bloqueado()) return;
          getLista(campo).splice(i, 1); save(); renderListas(); refreshDerivados(); } }, ['✕']),
        el('span', { class:'kf-nm', html: (item.tipo ? '<span class="kf-tag">'+esc(item.tipo)+'</span>' : '') + esc(item.nome) })
      ]));
    });
    return wrap;
  }
  function renderListas() {
    if (!body) return;
    // o stepper e as caixas são redesenhados a cada commit: devolve o foco ao
    // mesmo controle da mesma linha (teclado não se perde no +/−)
    var a = document.activeElement, fUid = null, fCtl = null;
    if (a && a.getAttribute && body.contains(a)) {
      var li = a.closest ? a.closest('[data-uid]') : null;
      fCtl = a.getAttribute('data-ctl');
      if (li && fCtl) fUid = li.getAttribute('data-uid');
    }
    var cg = cargaAtual();
    ['tecnicas','grimorio','cartasLimiar','inventario.bugigangas','inventario.equipamentos'].forEach(function (campo) {
      var holder = body.querySelector('[data-lista="' + campo + '"]');
      if (!holder) return;
      var novo = campo.indexOf('inventario.') === 0 ? listaInvEl(campo.slice(11), cg) : listaEl(campo);
      holder.parentNode.replaceChild(novo, holder);
    });
    if (fUid) {
      try {
        var n = body.querySelector('[data-uid="' + fUid + '"] [data-ctl="' + fCtl + '"]');
        if (n && n.focus) n.focus();
      } catch (e) {}
    }
    if (somenteLeitura) travaDrawer();   // linhas recriadas nascem habilitadas
  }

  function dropZone(campo, texto) {
    var dz = el('div', { class:'kf-drop', 'data-drop': campo }, [texto]);
    dz.addEventListener('dragover', function (e) { e.preventDefault(); dz.classList.add('kf-over'); });
    dz.addEventListener('dragleave', function () { dz.classList.remove('kf-over'); });
    dz.addEventListener('drop', function (e) {
      e.preventDefault(); dz.classList.remove('kf-over');
      try {
        var p = JSON.parse(e.dataTransfer.getData('text/plain'));
        // item do Bazar vai para a coluna canônica, solte onde soltar no drawer
        if (p._bazar) { if (adicionar(p.item, {}, 'drawer')) toast('+ ' + p.item.nome); return; }
        var campoAlvo = p._campo || campo;      // roteia pelo tipo, não pela zona
        if (campoAlvo.indexOf('inventario') === 0) return;
        var ent = Object.assign({}, p); delete ent._campo; delete ent._bazar;
        addEntidade(campoAlvo, ent);
      } catch (x) {}
    });
    return dz;
  }

  // ---------------- Bazar (data/bazar.json) ----------------
  function buscaBazar(q, res) {
    q = (q || '').trim().toLowerCase();
    res.innerHTML = '';
    if (q.length < 2) return;
    function achar() {
      var hits = bazarCache.filter(function (it) {
        return (it.nome + ' ' + it.categoria + ' ' + it.raridade + ' ' + it.efeito).toLowerCase().indexOf(q) >= 0;
      }).slice(0, 12);
      hits.forEach(function (it) {
        res.appendChild(el('div', { class:'kf-list-item' }, [
          el('span', { class:'kf-btn sm', title:'Guardar (Shift+clique: 10)',
            onclick: function (ev) { addItemBazar(it, ev && ev.shiftKey ? 10 : 1); } }, ['+']),
          el('span', { class:'kf-nm', html: esc(it.nome) + ' <span style="color:#777">· ' + esc(it.raridade) + ' · ' + esc(it.valor) + ' Sins</span>' })
        ]));
      });
      if (!hits.length) res.appendChild(el('div', { style:'font-size:11px;color:#666' }, ['Nada encontrado']));
    }
    if (bazarCache) return achar();
    pedeCatalogo().then(achar)
      .catch(function () { res.appendChild(el('div', { style:'font-size:11px;color:#c0392b' }, ['Bazar indisponível (rode via servidor)'])); });
  }
  // coluna pela regra do registro (KhInv.colunaCanonica): acabou o roteamento por substring
  function addItemBazar(it, qtd) {
    if (adicionar(it, { qtd: qtd || 1 }, 'drawer')) toast('+ ' + (qtd > 1 ? qtd + '× ' : '') + it.nome);
  }

  // ---------------- decorar cards das páginas ----------------
  function textoLimpo(node) {
    if (!node) return '';
    var c = node.cloneNode(true);
    // .ent-add/.ent-alca (F1a): botão e alça da marcação nova nunca entram no nome
    c.querySelectorAll('.icon,.cat-icon,.category-icon,.toggle-icon,.kf-addbtn,.ent-add,.ent-alca,.spell-dot,.spell-toggle,svg').forEach(function (x) { x.remove(); });
    return c.textContent
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{FE00}-\u{FE0F}\u{DC00}-\u{DFFF}]/gu, '')
      .replace(/\+\s*ficha/g, '').replace(/\s+/g, ' ').trim();
  }
  function q1(card, sels) {
    var arr = sels.split(',');
    for (var i = 0; i < arr.length; i++) { var n = card.querySelector(arr[i].trim()); if (n) return n; }
    return null;
  }
  // Descrição levada para a ficha: o nó próprio quando o card tem (magia, carta,
  // dor); senão o card inteiro menos o que não é mecânica (títulos, custo,
  // citação, ambientação, botões). Antes era o 1º <p> do card, e 205 técnicas com
  // a mecânica em lista chegavam vazias (log de técnicas, 2026-09-26). O
  // tools/log_tecnicas.py lê estas duas listas daqui para conferir.
  // O h5 do corpo fica (subtítulos como "Lobo", "O Custo"); só sai o nó do nome.
  var DESC_PROPRIA = '.spell-desc,.dor-card-desc,.catalog-card-effect';
  var FORA_DA_MECANICA = 'h3,h4,svg,button,[class*="header"],[class*="quote"],[class*="flavor"],.cost,.tech-meta,.technique-cost,.price,.meta,.action,.stamina,.ultimate-badge,.kf-addbtn,.ent-add,.ent-alca';
  function descricaoCard(card, seletorNome) {
    var propria = q1(card, DESC_PROPRIA);
    if (propria) return textoLimpo(propria);
    var c = card.cloneNode(true);
    var nome = q1(c, seletorNome);
    if (nome) nome.remove();
    c.querySelectorAll(FORA_DA_MECANICA).forEach(function (x) { x.remove(); });
    // blocos colavam ("diante.O treinamento", "invocar:Médio"): espaço antes e depois de cada um
    c.querySelectorAll('li,p,div,tr,td,h5,h6,span').forEach(function (x) {
      x.insertBefore(document.createTextNode(' '), x.firstChild);
      x.appendChild(document.createTextNode(' '));
    });
    return textoLimpo(c).replace(/\s+([,.;:)])/g, '$1').replace(/\(\s+/g, '(');
  }
  // [seletor, campoFicha, tipo, seletorNome]. seletorNome é uma lista em ordem
  // de preferência (q1). Marca e ultimate: o nome é o h4 do header nas 6 classes
  // com .marca-header/.ultimate-header e o h5 no Espadachim; 'h5' puro pegava o
  // subtítulo do corpo ("O Custo", "Ativação") ou nada (marcas sem botão).
  var MAPA = [
    ['.spell-card', 'grimorio', 'magia', 'h4'],
    ['.technique-card', 'tecnicas', 'tecnica', 'h4,h5'],
    ['.tier-technique', 'tecnicas', 'tecnica', 'h5'],
    ['.tech-card', 'tecnicas', 'tecnica', 'h4,h5'],
    ['.ultimate-card', 'tecnicas', 'ultimate', '.ultimate-header h4,h5'],
    ['.marca-card', 'tecnicas', 'marca', '.marca-header h4,h5'],
    ['.trait-card', 'tecnicas', 'traço', 'h4,h5'],
    ['.variant-card', 'tecnicas', 'variante', 'h4,h5'],
    ['.variant-physical', 'tecnicas', 'variante', 'h4,h5'],
    ['.subspecie-card', 'tecnicas', 'subespécie', 'h4,h5'],
    ['.origem-card', 'tecnicas', 'origem', 'h3'],
    ['.catalog-card', 'cartasLimiar', 'carta', '.catalog-card-name'],
    ['.dor-card', 'cartasLimiar', 'dor', '.dor-card-title'],
    ['.beneficio-abismo-card', 'cartasLimiar', 'abismo', '.dor-card-title']
  ];
  function decorar() {
    MAPA.forEach(function (m) {
      document.querySelectorAll(m[0]).forEach(function (card) {
        if (card.getAttribute('data-kf')) return;
        var nomeNode = q1(card, m[3]);
        var nome = textoLimpo(nomeNode);
        if (!nome) return;
        card.setAttribute('data-kf', '1');
        var ent = { id: slug(nome, m[2] + '-'), tipo: m[2], nome: nome,
          descricao: descricaoCard(card, m[3]) };
        var btn = el('span', { class:'kf-addbtn', title:'Adicionar à ficha',
          onclick: function (e) { e.stopPropagation(); e.preventDefault(); addEntidade(m[1], ent); } }, ['+ ficha']);
        (nomeNode || card).appendChild(btn);
        card.setAttribute('draggable', 'true'); card.classList.add('kf-draggable');
        card.addEventListener('dragstart', function (e) {
          e.dataTransfer.setData('text/plain', JSON.stringify(Object.assign({ _campo: m[1] }, ent))); });
      });
    });
    decorarBazar();
    decorarCorrupcao();
  }

  // linhas das tabelas de Corrupção/Adversidade (raça Corrompido) -> arrastáveis
  function decorarCorrupcao() {
    document.querySelectorAll('.corr-table tr').forEach(function (tr) {
      if (tr.getAttribute('data-kf')) return;
      var tds = tr.querySelectorAll('td');
      if (tds.length < 2) return; // pula o cabeçalho (th)
      var nome = textoLimpo(tds[0]);
      if (!nome) return;
      tr.setAttribute('data-kf', '1');
      var bloco = tr.closest('.corr-block');
      var tipo = (bloco && bloco.classList.contains('adv')) ? 'adversidade' : 'corrupção';
      var custo = tds[2] ? textoLimpo(tds[2]) : '';
      var ent = { id: slug(nome, tipo + '-'), tipo: tipo,
        nome: nome + (custo ? ' (' + custo + ')' : ''), descricao: textoLimpo(tds[1]) };
      tds[0].appendChild(el('span', { class: 'kf-addbtn', title: 'Adicionar à ficha',
        onclick: function (e) { e.stopPropagation(); e.preventDefault(); addEntidade('tecnicas', ent); } }, ['+ ficha']));
      tr.setAttribute('draggable', 'true'); tr.classList.add('kf-draggable');
      tr.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', JSON.stringify(Object.assign({ _campo: 'tecnicas' }, ent))); });
    });
  }

  // itens do Bazar (bazar.html) — renderizados dinamicamente: .item-card[data-n].
  // Em body[data-bazar] o catálogo chega por KF.catalogo() (sem 2º fetch) e o
  // rótulo vira "+ inventário"; Shift+clique guarda 10.
  function decorarBazar() {
    var itens = document.querySelectorAll('.item-card[data-n]:not([data-kf])');
    if (!itens.length) return;
    if (!bazarCache) {
      if (naBazar()) return;                       // decora quando o bazar.js chamar KF.catalogo
      pedeCatalogo().catch(function () { aplicaBazar(itens); });   // sucesso: catalogo() redecora
      return;
    }
    aplicaBazar(itens);
  }
  function aplicaBazar(itens) {
    var noBazar = naBazar();
    itens.forEach(function (card) {
      if (card.getAttribute('data-kf') || card.closest('[data-kf-ignorar]')) return;
      var nome = card.getAttribute('data-n');
      var it = (idxCatalogo && temPropria(idxCatalogo.porNome, nome) && idxCatalogo.porNome[nome]) ||
        { id: slug(nome, 'item-'), nome: nome, categoria:'', raridade:'', efeito:'', valor:'' };
      card.setAttribute('data-kf', '1');
      var alvo = card.querySelector('.item-name,.item-head') || card;
      alvo.appendChild(el('span', { class:'kf-addbtn',
        title: (noBazar ? 'Guardar no inventário' : 'Adicionar à ficha') + ' (Shift+clique: 10)',
        onclick: function (e) { e.stopPropagation(); e.preventDefault(); addItemBazar(it, e.shiftKey ? 10 : 1); } },
        [noBazar ? '+ inventário' : '+ ficha']));
      card.setAttribute('draggable', 'true'); card.classList.add('kf-draggable');
      card.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', JSON.stringify({ _bazar: true, item: it })); });
    });
  }

  // ---------------- Export / Import ----------------
  function baixar(nome, obj) {
    var blob = new Blob([JSON.stringify(obj, null, 2)], { type:'application/json' });
    var a = el('a', { href: URL.createObjectURL(blob), download: nome });
    document.body.appendChild(a); a.click(); a.remove();
  }
  // KF.exportar(): grava exportadoEm (o rodapé do inventário lê) e baixa
  function exportJSON() {
    sincroniza();
    // só-leitura: baixa a v2 como está, sem carimbar exportadoEm (nada é gravado)
    if (somenteLeitura) { baixar((ficha.meta.nome || 'ficha').replace(/\s+/g,'_') + '.khalkaria.json', ficha); return; }
    ficha.exportadoEm = agoraISO();
    commit(['tudo'], 'local', 'exportar');
    baixar((ficha.meta.nome || 'ficha').replace(/\s+/g,'_') + '.khalkaria.json', ficha);
  }
  // troca a ficha inteira: rev acima do atual (as outras abas adotam) e zera o desfazer
  function substitui(nova, origem) {
    sincroniza();
    var rev = ficha.rev;
    ficha = nova;
    ficha.rev = Math.max(rev, ficha.rev);
    desfazerPilha = [];
    commit(['tudo'], origem, origem);
    reconciliaCatalogo();
    // ficha importada fora do Bazar pode trazer entradas sem inv (v1 migrada):
    // sem isto o catálogo só seria pedido no próximo carregamento de página
    verificaPendentes();
  }
  // Por que um JSON (objeto) não entra aqui; null = é ficha v1/v2. Sem isto,
  // o que não tinha schemaVersion (pacote fichas/1 da v3, export do Bestiário,
  // JSON solto) caía no migra() e SUBSTITUÍA a ficha do jogador sem pedir.
  var MSG_NAO_FICHA = 'Este arquivo não é uma ficha do Khalkaria.';
  function ehObjeto(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
  function recusaImport(f) {
    var sv = f.schemaVersion;
    var semVersao = sv == null || sv === '';
    var v1v2 = semVersao || /^[12](?![0-9])/.test(String(sv).trim());
    // Forma de ficha v1/v2 (meta ou atributos objeto) entra ANTES das marcas de
    // arquivo estranho: o import antigo passava o pacote fichas/1 e o export do
    // Bestiário pelo migra(), cujo deepMerge preserva chave desconhecida. Então
    // a ficha do jogador pode carregar type 'npc', schema e fichas para sempre,
    // e o backup que ela exporta tem de continuar entrando.
    if (v1v2 && (ehObjeto(f.meta) || ehObjeto(f.atributos))) return null;
    if (f.schema === KhEstado.SCHEMA_INDICE || Array.isArray(f.fichas)) {
      return 'Este arquivo é um pacote de várias fichas da ficha nova e não entra aqui.';
    }
    if (f.type === 'npc' || f.type === 'monster') return 'Este arquivo é um export para o Bestiário, não uma ficha.';
    // ficha v3 (schemaVersion >= 3) não é rebaixada
    if (parseFloat(String(sv)) >= 3) {
      return 'Esta ficha é da v3 (schemaVersion ' + sv + ') e não pode ser importada aqui. Recarregue a página.';
    }
    // sem schemaVersion e sem meta/atributos não é a v1 antiga
    if (semVersao) return MSG_NAO_FICHA;
    return v1v2 ? null : MSG_NAO_FICHA;
  }
  function importJSON() {
    if (bloqueado()) return;
    var inp = el('input', { type:'file', accept:'.json,application/json' });
    inp.addEventListener('change', function () {
      var fr = new FileReader();
      fr.onload = function () {
        var f;
        try { f = JSON.parse(fr.result); } catch (e) { f = null; }
        if (!f || typeof f !== 'object' || Array.isArray(f)) { toast('JSON inválido'); return; }
        // o que não é ficha v1/v2 é recusado sem tocar em nada
        var recusa = recusaImport(f);
        if (recusa) { toast(recusa, 6000); return; }
        if (bloqueado()) return;
        var nova = migra(f);
        substitui(nova, 'import');
        if (f.schemaVersion !== SCHEMA_VERSION && temItens(nova)) toast('Ficha importada. ' + MSG_MIGRACAO, 8000);
        else toast('Ficha importada');
      };
      fr.readAsText(inp.files[0]);
    });
    inp.click();
  }
  function resetFicha() {
    if (bloqueado()) return;
    if (!confirm('Nova ficha? A atual será substituída (exporte antes se quiser guardar).')) return;
    substitui(novaFicha(), 'reset'); toast('Nova ficha');
  }

  // projeção Bestiário (type:npc) — ver data/ficha-v2.schema.json x-bestiary
  function exportBestiario() {
    var b = { type:'npc', name: ficha.meta.nome || 'Personagem', race: ficha.meta.raca,
      npc_class: ficha.meta.classe, level: ficha.meta.nivel };
    ATTRS.forEach(function (a) { b[ATTR_BEST[a[0]]] = ficha.atributos[a[0]]; });
    b.health_max = ficha.recursos.saude.max; b.stamina_max = ficha.recursos.stamina.max;
    b.ether_max = ficha.recursos.eter.max;
    b.evasion = ficha.derivadosManuais.evasao; b.movement = ficha.derivadosManuais.movimento;
    b.armor = ficha.derivadosManuais.armadura;
    // prof_* sai como GRAU 0-4 (D5a): KhInv.grauPericia(bônus 0/2/4/6/8)
    PERICIAS.forEach(function (p) { b[p[2]] = KhInv.grauPericia(ficha.pericias[p[0]]); });
    b.craft_attr = ATTR_BEST[ficha.oficioAttr] || 'intelligence';
    var rs = [], im = [], ae = [];
    RESIST.forEach(function (r) {
      var v = ficha.resistencias[r[0]];
      if (v.R) rs.push(r[1]); if (v.I) im.push(r[1]);
      if (v.ae > 0) ae.push(r[1] + ' ' + v.ae);
    });
    b.resistances = rs.join(', '); b.immunities = im.join(', '); b.armor_specific = ae.join(', ');
    b.abilities = ficha.tecnicas.concat(ficha.grimorio).map(function (t) {
      return { name: t.nome, description: t.descricao || '' }; });
    // token exato 'Arma' nas duas colunas, equipadas primeiro (armaduras não saem mais aqui)
    b.weapons = KhInv.armasBestiario(ficha.inventario);
    baixar((ficha.meta.nome || 'personagem').replace(/\s+/g,'_') + '.bestiario.json', b);
    toast('Export Bestiário (type:npc)');
  }

  // abre o drawer e expande a seção (antes do init, fica para o init)
  function abrir(secao) {
    if (!body) { abrirPendente = secao || ''; return; }
    setOpen(true);
    var s = secao ? body.querySelector('.kf-sec[data-sec="' + secao + '"]') : null;
    if (s) {
      s.classList.remove('kf-collapsed');
      if (s.scrollIntoView) s.scrollIntoView({ block: 'start' });
    }
  }

  // ---------------- init ----------------
  function init() {
    buildDrawer(); decorar();
    if (migrouAgora) { migrouAgora = false; toast(MSG_MIGRACAO, 8000); }
    if (somenteLeitura) toast(MSG_RO, 6000);
    // conteúdo dinâmico (ex.: Bazar re-renderiza o grid ao filtrar) -> re-decora.
    // Mudança dentro de [data-kf-ignorar] (drawer, toast, inventário do Bazar) não conta.
    try {
      var obs = new MutationObserver(function (regs) {
        var conta = regs.some(function (r) {
          var t = r.target;
          if (t && t.nodeType !== 1) t = t.parentElement;
          return !(t && t.closest && t.closest('[data-kf-ignorar]'));
        });
        if (!conta) return;
        clearTimeout(obsT); obsT = setTimeout(decorar, 150);
      });
      obs.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
    verificaPendentes();
    if (abrirPendente !== null) { var s = abrirPendente; abrirPendente = null; abrir(s); }
  }

  // sincronia entre abas e páginas: storage não basta (bfcache precisa de pageshow)
  // storage: o marcador DONO_KEY (ou clear(), key null) troca o modo; LS_KEY adota
  window.addEventListener('storage', function (e) {
    if (e.key === DONO_KEY || e.key == null) confereDono();
    if (e.key === LS_KEY) sincroniza();
  });
  window.addEventListener('pageshow', function () { sincroniza(); });
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') flush();
    else if (document.visibilityState === 'visible') sincroniza();
  });

  // ---------------- API (spec §5.3). Leituras devolvem cópia. ----------------
  function invDe() {
    var i = ficha.inventario;
    return { sins: i.sins, bugigangas: i.bugigangas, equipamentos: i.equipamentos };
  }
  raiz.KF = Object.freeze({
    versao: '2',
    inventario: function () { return clone(invDe()); },
    carga: function () { return cargaAtual(); },
    projetar: function (item, opts) { return KhInv.projetar(invDe(), ficha.atributos.for, doCatalogo(item), opts); },
    quantidadePorId: function () { return KhInv.quantidadePorId(ficha.inventario); },
    tenho: function (id) { return KhInv.quantidadePorId(ficha.inventario)[id] || 0; },
    atributo: function (k) { var n = parseInt(ficha.atributos[String(k || '').toLowerCase()], 10); return isFinite(n) ? n : 0; },
    migradoEm: function () { return ficha.migradoEm || ''; },
    exportadoEm: function () { return ficha.exportadoEm || ''; },
    nome: function () { return String((ficha.meta && ficha.meta.nome) || '').trim(); },
    adicionar: function (item, opts) { return adicionar(item, opts, 'local'); },
    quantidade: function (uid, n) { return quantidade(uid, n, 'local'); },
    alternar: function (uid, campo) { return alternar(uid, campo, 'local'); },
    trocar: function (uid, campo, uidsASoltar) { return trocar(uid, campo, uidsASoltar, 'local'); },
    mover: function (uid, coluna) { return mover(uid, coluna, 'local'); },
    remover: function (uid) { return remover(uid, 'local'); },
    definirSins: function (n) { return definirSins(n, 'local'); },
    lote: lote,
    desfazer: desfazer,
    podeDesfazer: function () { return !somenteLeitura && desfazerPilha.length > 0; },
    somenteLeitura: function () { return confereDono(); },
    catalogo: catalogo,
    abrir: abrir,
    exportar: exportJSON
  });
  try { document.dispatchEvent(new CustomEvent('kf:pronta', { detail: { versao: '2' } })); } catch (e) {}

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(typeof window !== 'undefined' ? window : this);

// ==== js/ficha/kh-conta.js ====
/* Khalkaria — Ficha · KhConta: o componente "conta" (F4.1), PURO (devolve string).
 * O número calculado com o tooltip da fórmula (css/componentes.css: .kh-conta e
 * .kh-conta-dica): span.kh-conta[tabindex=0][aria-describedby][data-caminho] com
 * b.<p>-v (o valor mostrado) e span.kh-conta-dica[role=tooltip] com a fórmula
 * simbólica e a numérica, os termos (valor, rótulo, fonte, selo, motivo), os
 * selos, o ajuste manual ou migrado, os avisos e os lembretes do nó. Fora da
 * dica: "calc. X" quando há ajuste, a marca de aviso e os selos curtos.
 *
 *   var C = KhConta.criar({ D: KhRegras.dados(), nos: av.nos, prefixo: 'kf3',
 *                           esc: ..., fmt: KhRegras.fmt, semEmoji: ... });
 *   C.conta('evasao.ativa')                     // o número com a conta
 *   C.conta('x', { no, un, texto, semSelos })   // nó fora do grafo, unidade, texto no lugar do valor
 *   C.caminhos                                  // os caminhos mostrados, na ordem
 *
 * Cada instância numera os ids da dica a partir de 1 (<p>-d-1, <p>-d-2…) e
 * guarda a lista de caminhos que mostrou: uma instância por render. O prefixo
 * (padrão 'kf3', o da prévia) vai nas classes e nos ids, para outra página (a
 * ficha) usar o seu sem colidir. esc, fmt e semEmoji são opcionais (padrão: os
 * deste módulo e o KhAjustes.fmt, o mesmo que o KhRegras.fmt).
 *
 * No node exporta por module.exports (carregado sozinho); no artefato js/ficha.js
 * o export já é o KhInv e este módulo só registra window.KhConta no navegador.
 * Fonte: js/ficha/kh-conta.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhAjustes = emNode ? require('./kh-ajustes.js') : raiz.KhAjustes;

  var KhConta = (function () {
    var PREFIXO = 'kf3';
    var RE_PREFIXO = /^[a-z][a-z0-9-]*$/i;
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

    // op: {D, nos, prefixo, esc, fmt, semEmoji}
    function criar(op) {
      op = op || {};
      var D = op.D || {};
      var nos = op.nos || null;
      var p = op.prefixo == null ? PREFIXO : str(op.prefixo);
      if (!RE_PREFIXO.test(p)) throw new Error('KhConta: prefixo inválido "' + p + '" (letras, dígitos e hífen)');
      var es = op.esc || esc, se = op.semEmoji || semEmoji;
      var fmt = op.fmt || (KhAjustes && KhAjustes.fmt) || str;
      var n = 0, caminhos = [];

      function rotuloSelo(k) { return str(D.rotulosSelo && D.rotulosSelo[k]) || k; }
      function seloDoStatus(st) {
        if (!st || st === 'ajuste') return null;
        var selos = D.selos || {};
        var s = selos[st];
        if (s === undefined) s = selos.semStatus;
        return s || null;
      }
      function fonteTxt(f) {
        if (!obj(f)) return '';
        var t = TIPO_FONTE[f.tipo] || str(f.tipo), nome = se(f.nome), id = str(f.id);
        if (f.tipo === 'regra') return t + ': ' + (id ? id.replace(/^contrato:/, 'contrato · ') : nome);
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
        return '<span class="' + p + '-t' + (t.ativo ? '' : ' ' + p + '-t-off') + '">' +
          '<span class="' + p + '-t-v">' + es(valorTermo(t)) + '</span> ' +
          '<span class="' + p + '-t-r">' + es(se(t.rotulo)) + '</span>' +
          (obj(t.fonte) && t.fonte.tipo !== 'ajuste' ? ' <span class="' + p + '-t-f">· ' + es(fonteTxt(t.fonte)) + '</span>' : '') +
          (selo ? ' <span class="' + p + '-t-s">[' + es(rotuloSelo(selo)) + ']</span>' : '') +
          (!t.ativo && !/^display/.test(mot) ? ' <span class="' + p + '-t-m">(não entra' + (mot ? ': ' + es(mot) : '') + ')</span>'
            : (mot ? ' <span class="' + p + '-t-m">(' + es(mot) + ')</span>' : '')) +
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
          return '<span class="' + p + '-selo ' + p + '-selo-' + es(s) + '" title="' + es(rotuloSelo(s)) + '">' +
            '<svg aria-hidden="true"><use href="#g-selo"/></svg>' + es(SELO_CURTO[s] || s) + '</span>';
        }).join('');
      }
      // o número com a conta. o: {un, texto (troca o valor mostrado), semSelos, no (nó fora do grafo)}
      function conta(caminho, o) {
        o = o || {};
        var no = o.no || (nos && nos[caminho]);
        if (!no) return '<span class="' + p + '-nulo">—</span>';
        caminhos.push(caminho);
        var id = p + '-d-' + (++n);
        var sim = str(no.formula && no.formula.simbolica), num = str(no.formula && no.formula.numerica);
        var rot = se(no.rotulo);
        var linhas = '<span class="' + p + '-d-sim">' + es(sim.indexOf(rot) === 0 ? sim : rot + ' = ' + sim) + '</span>' +
          '<span class="' + p + '-d-num">' + es(num) + '</span>';
        if (lista(no.termos).length) linhas += '<span class="' + p + '-d-ts">' + no.termos.map(termoHTML).join('') + '</span>';
        var sl = lista(no.selos).concat(lista(no.selosProgressao).filter(function (s) { return lista(no.selos).indexOf(s) < 0; }));
        if (sl.length) linhas += '<span class="' + p + '-d-selos">Selo: ' + sl.map(function (s) { return es(rotuloSelo(s)); }).join(' · ') + '</span>';
        if (no.ajuste) {
          linhas += '<span class="' + p + '-d-aj">Ajuste ' + (no.ajuste.origem === 'migracao' ? 'migrado da v2' : 'manual') +
            ': calculado ' + es(fmt(no.calculado)) + ' · ajustado ' + es(fmt(no.valor)) +
            (no.ajuste.motivo ? ' (' + es(no.ajuste.motivo) + ')' : '') +
            (no.ajuste.mudou ? ' · o calculado mudou desde o ajuste' : '') + '</span>';
        }
        lista(no.avisos).forEach(function (a) { linhas += '<span class="' + p + '-d-av">Aviso: ' + es(a.msg || a.tipo) + '</span>'; });
        lista(no.lembretes).forEach(function (a) { linhas += '<span class="' + p + '-d-lb">Lembrete: ' + es(a.msg || a.op) + '</span>'; });
        var mostrado = o.texto != null ? o.texto : valorNo(no, o.un);
        return '<span class="kh-conta ' + p + '-conta" tabindex="0" aria-describedby="' + id + '"' +
          (no.ajuste ? ' data-ajustado' : '') + ' data-caminho="' + es(caminho) + '">' +
          '<b class="' + p + '-v">' + es(mostrado) + '</b>' +
          '<span class="kh-conta-dica ' + p + '-dica" id="' + id + '" role="tooltip">' + linhas + '</span></span>' +
          (no.ajuste ? '<span class="' + p + '-calc">calc. ' + es(valorNo({ valor: no.calculado }, o.un)) + '</span>' : '') +
          // número com aviso do motor (dado faltando, valor fora da conta): marca à vista, o texto vai em Avisos
          (lista(no.avisos).length ? ' <span class="' + p + '-aviso ' + p + '-marca-aviso" title="' +
            es(lista(no.avisos).map(function (a) { return a.msg || a.tipo; }).join(' · ')) + '">aviso</span>' : '') +
          (o.semSelos ? '' : selosHTML(no.selos));
      }

      return { prefixo: p, caminhos: caminhos, conta: conta, termoHTML: termoHTML, selosHTML: selosHTML,
        fonteTxt: fonteTxt, valorTermo: valorTermo, valorNo: valorNo, rotuloSelo: rotuloSelo, seloDoStatus: seloDoStatus };
    }

    return { PREFIXO: PREFIXO, TIPO_FONTE: TIPO_FONTE, SELO_CURTO: SELO_CURTO,
      criar: criar, esc: esc, semEmoji: semEmoji };
  })();

  if (emNode) { module.exports = KhConta; return; }
  raiz.KhConta = KhConta;
})(typeof window !== 'undefined' ? window : this);

// ==== js/ficha/kh-redesenho.js ====
/* Khalkaria — Ficha · KhRedesenho: redesenhar sem perder o lugar, e a dica da conta dentro da caixa (F4.4b).
 * Saiu do js/ficha-pagina.js (F4.3) para o bundle porque tem dois donos: a
 * página da ficha (pages/ficha.html, prefixo 'fp') e o drawer da ficha nova
 * (js/ficha/kh-ficha-drawer.js, todas as páginas, prefixo 'fd'). Os dois
 * redesenham o mesmo HTML do KhFichaAbas a cada mudança da ficha e prendem a
 * dica da conta à própria caixa. Carregar este arquivo não muda nada: não toca
 * DOM, storage nem rede; só age quando alguém chama.
 *
 *   var R = KhRedesenho.criar({ prefixo: 'fp' });
 *   R.trocaHTML(doc, cont, html, reserva, caixa, win)  // troca o HTML de cont sem perder foco, <details> e dica
 *   R.encaixa(conta, caixa, win)                      // empurra a dica aberta para dentro da caixa
 *   R.encaixeDica(retangulo, {min, max})              // o deslocamento (puro)
 *
 * O prefixo dá os nomes das marcas: a variável do deslocamento da dica
 * (--<p>-dx), as marcas do elemento novo depois da troca (data-<p>-foco: o
 * contorno do foco de teclado; data-<p>-dica: a dica sob o mouse, aberta até o
 * mouse mexer), a memória do HTML no contêiner (_<p>Html) e o aviso para quem
 * montou soltar a dica no próximo movimento (caixa._<p>Dica). Com 'fp', são os
 * nomes de antes da extração (os testes da página não mudam).
 *
 * No node exporta por module.exports (carregado sozinho); no artefato js/ficha.js
 * o export já é o KhInv e este módulo só registra window.KhRedesenho no navegador.
 * Fonte: js/ficha/kh-redesenho.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv

  var KhRedesenho = (function () {
    var RE_PREFIXO = /^[a-z][a-z0-9-]*$/i;   // o mesmo do KhConta
    var MARGEM_DICA = 8;
    var FOCAVEIS = 'a[href], button, summary, select, input, textarea, [tabindex]';

    function str(x) { return x == null ? '' : String(x); }
    function arr(x) { return Array.prototype.slice.call(x || []); }
    function qsa(cont, sel) { return cont && cont.querySelectorAll ? arr(cont.querySelectorAll(sel)) : []; }
    function casa(el, sel) { try { return !!el.matches(sel); } catch (e) { return false; } }
    function foca(el) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }

    // ---------------- a dica da conta dentro da caixa ----------------
    // A dica nasce centrada sob o número (css: translateX(-50%) mais --<p>-dx).
    // Ao abrir (hover ou foco), quem montou a mede e a empurra para dentro da
    // caixa (a página, à direita da nav fixa; o drawer, na largura dele): nunca
    // passa da janela (sem rolagem horizontal) nem sai da caixa. Sem espaço
    // embaixo e com espaço em cima, abre para cima.
    // Puro: r = retângulo da dica sem deslocamento; lim = {min, max} em x.
    function encaixeDica(r, lim) {
      var dx = 0;
      if (r.right > lim.max) dx = lim.max - r.right;
      if (r.left + dx < lim.min) dx = lim.min - r.left;
      return Math.round(dx);
    }

    // a fábrica: as marcas com o prefixo de quem desenha
    function criar(op) {
      op = op || {};
      var P = str(op.prefixo);
      if (!RE_PREFIXO.test(P)) throw new Error('KhRedesenho: prefixo inválido "' + P + '" (letras, dígitos e hífen)');
      var VAR_DX = '--' + P + '-dx';
      var MARCA_FOCO = 'data-' + P + '-foco', MARCA_DICA = 'data-' + P + '-dica';
      var MEMO_HTML = '_' + P + 'Html', MEMO_DICA = '_' + P + 'Dica';

      // a dica de uma conta (.kh-conta) aberta agora; false se ainda está fechada
      function encaixa(conta, caixa, win) {
        var d = conta && conta.querySelector ? conta.querySelector('.kh-conta-dica') : null;
        if (!d || !d.getBoundingClientRect || !caixa) return false;
        d.style.removeProperty(VAR_DX);
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
        if (dx) d.style.setProperty(VAR_DX, dx + 'px');
        var alto = win && win.innerHeight, rc = conta.getBoundingClientRect();
        if (alto && r.bottom > alto - MARGEM_DICA && rc.top - 6 - r.height >= MARGEM_DICA) conta.setAttribute('data-dica-acima', '');
        return true;
      }

      // ---------------- redesenho sem perder o lugar ----------------
      // Antes de trocar o HTML de um contêiner, guarda o que o jogador tinha nele:
      // o elemento com o foco (pela chave: o data-caminho da conta, ou o
      // data-campo, ou a tag e a classe, mais a ordem entre os de mesma chave),
      // os <details> abertos e a conta sob o mouse. Depois de trocar, devolve o
      // foco ao equivalente (sem rolar; se ele sumiu, à reserva), reabre os
      // <details> e deixa a dica aberta até o mouse se mexer. Contêiner cujo
      // HTML não mudou não é tocado.
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
      // troca o HTML de cont preservando foco, <details> abertos e a dica sob o
      // mouse; reserva = quem recebe o foco se o elemento focado sumiu. true se trocou.
      function trocaHTML(doc, cont, html, reserva, caixa, win) {
        if (!cont || cont[MEMO_HTML] === html) return false;
        var ativo = doc.activeElement;
        var dentro = !!ativo && ativo !== cont && !!cont.contains && cont.contains(ativo);
        var foco = dentro ? marcaUI(qsa(cont, FOCAVEIS), ativo) : null;
        var visivel = dentro && (casa(ativo, ':focus-visible') || ativo.hasAttribute(MARCA_FOCO));
        var dets = qsa(cont, 'details');
        var abertos = dets.filter(function (d) { return d.open; }).map(function (d) { return marcaUI(dets, d); });
        var contas = qsa(cont, '.kh-conta');
        var sob = null;
        contas.some(function (c) { if (casa(c, ':hover') || c.hasAttribute(MARCA_DICA)) { sob = marcaUI(contas, c); } return !!sob; });

        cont.innerHTML = html;
        cont[MEMO_HTML] = html;

        dets = qsa(cont, 'details');
        abertos.forEach(function (m) { var d = achaUI(dets, m); if (d) d.open = true; });
        if (sob) {
          var s = achaUI(qsa(cont, '.kh-conta'), sob);
          if (s) {
            s.setAttribute(MARCA_DICA, '');
            if (caixa) caixa[MEMO_DICA] = true;   // o próximo movimento do mouse a solta (quem montou)
            encaixa(s, caixa, win);
          }
        }
        if (dentro) {
          var el = foco ? achaUI(qsa(cont, FOCAVEIS), foco) : null;
          if (!el) el = reserva || (cont.hasAttribute('tabindex') ? cont : null);
          if (el && el.focus) {
            foca(el);
            // o foco por teclado segue visível (contorno e dica) no elemento novo
            if (visivel && !casa(el, ':focus-visible')) el.setAttribute(MARCA_FOCO, '');
            if (el.getAttribute('data-caminho') != null) encaixa(el, caixa, win);
          }
        }
        return true;
      }

      // as marcas do redesenho valem até o jogador agir: o foco sai (focusout
      // tira a do foco), o mouse mexe (solta as dicas presas). Quem montou chama.
      function soltaFoco(el) { if (el && el.removeAttribute) el.removeAttribute(MARCA_FOCO); }
      function soltaDicas(caixa) {
        if (!caixa || !caixa[MEMO_DICA]) return false;
        caixa[MEMO_DICA] = false;
        qsa(caixa, '[' + MARCA_DICA + ']').forEach(function (x) { x.removeAttribute(MARCA_DICA); });
        return true;
      }

      return { prefixo: P, VAR_DX: VAR_DX, MARCA_FOCO: MARCA_FOCO, MARCA_DICA: MARCA_DICA,
        encaixa: encaixa, trocaHTML: trocaHTML, soltaFoco: soltaFoco, soltaDicas: soltaDicas };
    }

    return { MARGEM_DICA: MARGEM_DICA, FOCAVEIS: FOCAVEIS, encaixeDica: encaixeDica, criar: criar };
  })();

  if (emNode) { module.exports = KhRedesenho; return; }
  raiz.KhRedesenho = KhRedesenho;
})(typeof window !== 'undefined' ? window : this);

// ==== js/ficha/kh-previa.js ====
/* Khalkaria — Ficha · KhPrevia: PRÉVIA ESCONDIDA da ficha v3 (F3c, modo sombra).
 * O motor da ficha nova visto de fora, SOMENTE LEITURA: a ficha v2
 * (khalkaria_ficha) migrada EM MEMÓRIA pelo KhEstado.sombra e calculada pelo
 * KhRegras, cada número com o componente "conta" (KhConta, js/ficha/kh-conta.js;
 * css/componentes.css) e o tooltip da fórmula (simbólica + numérica, a fonte de
 * cada termo e o selo do que não é canônico), no hover e no foco de teclado
 * (aria-describedby).
 *
 * Só liga com ?ficha=v3 na URL (que lembra a escolha em localStorage
 * khalkaria_ficha_previa=1, para seguir pela navegação) ou com essa chave já
 * gravada. Sem isso, nada acontece. A v2.1 continua sendo a ficha ativa: a
 * prévia NUNCA grava ficha, índice, chave v3 nem o marcador khalkaria_ficha_dono
 * (F4); a única escrita daqui é a da própria chave da prévia (iniciar).
 *
 * F4.4b: o painel flutuante (#kf3-previa, css/ficha-previa.css) SAIU. Com a
 * prévia ligada, quem mostra a ficha nova fora da página da ficha é o drawer
 * docked (js/ficha/kh-ficha-drawer.js, KhFichaDrawer), que chama o iniciar daqui
 * (ativação e "lembrar") e usa o carregar e o calcular. O render fica: é o
 * snapshot de ouro do motor (tools/testes/fixtures/previa-render.golden.html),
 * e a lista de avisos (listaAvisos) é a da página e do drawer.
 *
 * Partes puras (testadas no node, tools/testes/previa.test.js): ativacao,
 * calcular (catálogo -> sombra -> avaliar), render (HTML + caminhos mostrados) e
 * listaAvisos (os avisos do motor e da migração, que a página da ficha também usa).
 * No node exporta por module.exports (carregado sozinho); no artefato js/ficha.js
 * o export já é o KhInv e este módulo só registra window.KhPrevia no navegador.
 * Fonte: js/ficha/kh-previa.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhEstado = emNode ? require('./kh-estado.js') : raiz.KhEstado;
  var KhRegras = emNode ? require('./kh-regras.js') : raiz.KhRegras;
  var KhConta = emNode ? require('./kh-conta.js') : raiz.KhConta;

  var KhPrevia = (function () {
    var CHAVE = 'khalkaria_ficha_previa';
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
    // 'outros' (Força, Primordial): a 5ª categoria do contrato rev. 7 e do Sistema no Notion, sem Ae de categoria
    var NOME_CATEGORIA = { ordinario: 'Ordinário', elemental: 'Elemental', biologico: 'Biológico', mistico: 'Místico', outros: 'Outros' };
    var CATEGORIAS = [['ordinario', 'Ordinário'], ['elemental', 'Elemental'], ['biologico', 'Biológico'],
      ['mistico', 'Místico'], ['todos', 'Todos']];
    // escape e limpeza de emoji: os mesmos do componente conta (js/ficha/kh-conta.js)
    var esc = KhConta.esc, semEmoji = KhConta.semEmoji;

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
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
      var fmt = KhRegras.fmt;
      // o componente conta (js/ficha/kh-conta.js): numera os ids da dica e guarda os caminhos mostrados
      var C = KhConta.criar({ D: D, nos: res.av ? res.av.nos : null, prefixo: 'kf3', esc: esc, fmt: fmt, semEmoji: semEmoji });
      var caminhos = C.caminhos, conta = C.conta, selosHTML = C.selosHTML, valorNo = C.valorNo, rotuloSelo = C.rotuloSelo;

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
        f.atributos && f.atributos.migradoTotal ? 'Total migrado da v2: a raça, o nível e os efeitos das técnicas e cartas já estão dentro do número digitado. ' +
          'Item com bônus de atributo ainda soma por cima e fica marcado em Avisos (pendente Pedro: a v2 pode já contá-lo).' : '');

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
        (noCl && noCl.semContador
          // D105: recurso que não é contador (Espadachim, Teurgo): as características, sem número
          ? linha('Recurso de classe <span class="kf3-sub">(sem contador)</span>',
              // o ajuste migrado da v2 (contador antigo) fica no tooltip e em Avisos, não vira número aqui
              conta('recurso.classe.max', { texto: noCl.itens.join(' · ') }))
          : linha(rotuloClasse(), atual('classe') + conta('recurso.classe.max'))));
      // classe sem recurso nomeado no contrato: mostra o nome que o jogador digitou na v2
      function rotuloClasse() {
        var nome = obj(rc.classe) ? semEmoji(rc.classe.nome) : '';
        if (noCl && !noCl.medidor && nome) return esc(nome) + ' <span class="kf3-sub">(nome digitado na v2; recurso sem nome no contrato)</span>';
        return esc(semEmoji(noCl ? noCl.rotulo : 'Recurso de classe máx.'));
      }

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

      // ---- avisos (a mesma lista que a página da ficha mostra: listaAvisos)
      var av = listaAvisos(res, rotuloSelo);
      h += secao('avisos', 'Avisos (' + av.length + ')', av.length ? '<ul class="kf3-lista">' + av.map(function (x) {
        return '<li>' + esc(semEmoji(x)) + '</li>'; }).join('') + '</ul>' : '<p class="kf3-nota">Nenhum.</p>') + errosHTML(res.erros);

      return { html: h, caminhos: caminhos };

      function modTxt(no) {
        if (!no || typeof no.valor !== 'number') return null;
        return no.valor < 0 ? '−' + fmt(-no.valor) : '+' + fmt(no.valor);
      }
    }
    // Os avisos do motor e da migração, um texto por linha (sem HTML; quem mostra
    // escapa). Fonte ÚNICA da lista: a prévia (render, acima) e a página da ficha
    // (js/ficha-pagina.js) mostram as mesmas linhas. res = calcular(), estado 'ok';
    // rotuloSelo = o do KhConta da passada (o nome completo do selo do alerta).
    function listaAvisos(res, rotuloSelo) {
      if (!res || res.estado !== 'ok') return [];
      if (typeof rotuloSelo !== 'function') rotuloSelo = KhConta.criar({ D: KhRegras.dados() }).rotuloSelo;
      var f = res.ficha || {}, nos = (res.av && res.av.nos) || {}, av = [];
      lista(res.avisosMigracao).forEach(function (a) {
        av.push('Migração: ' + (a.tipo === 'orfa' ? 'entrada sem par (' + a.ref + ', ' + a.motivo + ')'
          : a.tipo === 'identidade' ? a.campo + ' "' + a.nome + '" sem par (' + a.motivo + ')'
            : a.tipo === 'duplicada' ? 'entrada repetida ' + a.ref + ' (' + a.nome + ')'
              : a.tipo + (a.chave ? ' ' + a.chave : '') + (a.motivo ? ' (' + a.motivo + ')' : '')));
      });
      var pend = lista(f.migracao && f.migracao.pendencias);
      pend.forEach(function (p) { av.push('Pendência: ' + str(p.motivo) + (p.grau != null ? ' (grau ' + p.grau + ')' : '')); });
      lista(res.av && res.av.alertas).forEach(function (a) {
        // condição que só aparece porque a v2 tinha o recurso 0/0 (pendência de migração acima)
        var daMigracao = a.recurso && pend.some(function (p) { return p.campo === 'recursos.' + a.recurso; });
        av.push('Alerta: ' + str(a.msg) + (a.selo ? ' [' + rotuloSelo(a.selo) + ']' : '') +
          (daMigracao ? ' (pode ser efeito da migração: a v2 tinha 0/0)' : ''));
      });
      lista(res.av && res.av.avisos).forEach(function (a) { av.push('Motor: ' + str(a.msg || a.tipo)); });
      // o aviso de cada número (no.avisos), que sem isto só se via no tooltip
      lista(res.av && res.av.ordem).forEach(function (c) {
        var no = nos[c];
        lista(no && no.avisos).forEach(function (a) { av.push(semEmoji(no.rotulo) + ': ' + str(a.msg || a.tipo)); });
      });
      if (res.semCatalogo) av.push('Catálogo indisponível: identidade e entradas ficam só pelo nome.');
      if (res.semEfeitos) av.push('Efeitos de item indisponíveis: itens e armas fora das contas.');
      return av;
    }

    function errosHTML(erros) {
      erros = lista(erros);
      return erros.length ? '<p class="kf3-nota kf3-aviso">Não carregou: ' + erros.map(esc).join(', ') + '</p>' : '';
    }

    // ---------------- ligar (navegador) ----------------
    // A prévia está ligada nesta página? Com ?ficha=v3, lembra a escolha (grava
    // a chave da prévia, a única escrita deste módulo). Não monta nada: o
    // drawer da ficha nova (KhFichaDrawer) chama este iniciar e monta a si mesmo.
    function iniciar(win) {
      if (!win || !win.document || !win.location) return false;
      var ls = null;
      try { ls = win.localStorage; } catch (e) { ls = null; }
      var at = ativacao(win.location.search, ls);
      if (!at.ativa) return false;
      if (at.lembrar) { try { ls.setItem(CHAVE, '1'); } catch (e) { /* segue só nesta página */ } }
      return true;
    }

    return { CHAVE: CHAVE, CATALOGOS: CATALOGOS.slice(), CLASSES: CLASSES.slice(), RACAS: RACAS.slice(),
      ativacao: ativacao, arquivos: arquivos, carregar: carregar, calcular: calcular, render: render,
      listaAvisos: listaAvisos, iniciar: iniciar };
  })();

  if (emNode) { module.exports = KhPrevia; return; }
  raiz.KhPrevia = KhPrevia;
})(typeof window !== 'undefined' ? window : this);

// ==== js/ficha/kh-ficha-abas.js ====
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

// ==== js/ficha/kh-ficha-drawer.js ====
/* Khalkaria — Ficha · KhFichaDrawer: o drawer docked da ficha nova à direita (F4.4b), SÓ COM A PRÉVIA.
 * Especificação: docs/ficha-digital/06-f4-drawer.md (base: 03 §9, plano 02 §F4).
 *
 * Com a prévia ligada (localStorage khalkaria_ficha_previa === '1' ou ?ficha=v3,
 * a regra do KhPrevia.ativacao e do partials/head-boot.html), mostra a ficha
 * nova, SÓ LEITURA, em todas as páginas menos a da ficha (pages/ficha.html, #fp,
 * que já é a ficha nova inteira: um drawer por cima repetiria o mesmo conteúdo
 * e carregaria e calcularia tudo duas vezes). Substitui o painel flutuante da
 * prévia (#kf3-previa, que saiu do KhPrevia). Sem a prévia, NADA acontece:
 * nenhum nó, nenhum CSS, nenhum fetch, nenhum ouvinte, nenhuma escrita.
 *
 * Dois estados, no <html>: data-ficha3="trilho" (48 px, as mini barras de
 * Saúde, Stamina e Éter) ou "aberto" (380 px; 460 px a partir de 1800 px). O
 * head-boot marca o estado guardado (localStorage khalkaria_ficha3_dock) antes
 * do primeiro desenho, e o css/style.css (@layer layout) empurra o conteúdo e
 * desenha um fundo de reserva até este script montar: nada salta. No Bazar o
 * drawer aberto fica por cima (não empurra até a F4b), e abaixo de 1100 px
 * também. O CSS do drawer (css/ficha-drawer.css: a casca e o conteúdo) só é
 * pedido aqui.
 *
 * Conteúdo: o MESMO da página (KhFichaAbas, prefixo 'fd', densidade
 * 'compacta'), calculado pelo mesmo caminho (KhPrevia.carregar e calcular), nas
 * mesmas 5 abas e na mesma ordem guardada (KhAbas, khalkaria_ficha_abas). Cada
 * número com a conta (KhConta); as mini barras do trilho têm a sua (prefixo
 * 'fd-tr', ids próprios). Redesenha em kf:mudou, ao digitar no #kf-drawer e no
 * storage da khalkaria_ficha (debounce de 350 ms), pelo KhRedesenho (foco,
 * <details>, dica e rolagem ficam).
 *
 * Arrastar: o dragstart de um card (.kf-draggable, [data-kf-tipo], item do
 * Bazar) acende o trilho; o dragenter abre o drawer (sem gravar a preferência);
 * soltar um item do Bazar ({_bazar:true,item}) guarda na ficha atual por
 * KF.adicionar (o inventário é o mesmo); qualquer outra entidade não é aceita
 * e o drawer avisa, sem perder o arrasto (dá para seguir até a ficha atual).
 * Teclado: Esc recolhe (KhTeclas.camadaEsc, depois das camadas do Bazar; não
 * com o foco num campo de texto fora do drawer, cujo Esc é dele); abrir
 * pelo botão leva o foco à aba aberta, recolher o devolve ao botão do trilho.
 * "Sair da prévia" apaga a chave e recarrega sem o ?ficha (saidaPrevia).
 * O drawer leva [data-kf-ignorar] (o MutationObserver da v2.1 não o decora).
 *
 * Escritas: localStorage khalkaria_ficha3_dock (só quando o jogador abre ou
 * recolhe pelo botão ou pelo Esc), as preferências de aba do KhAbas (ordem e
 * aba aberta, as mesmas da página), o "lembrar" da prévia (KhPrevia.iniciar,
 * com ?ficha=v3) e, ao soltar um item do Bazar, o KF.adicionar da ficha atual.
 * Nenhuma chave de ficha v3.
 *
 * Partes puras (testadas no node, tools/testes/ficha-drawer.test.js): estado,
 * lerDock, leArrasto, fracao, saidaPrevia, htmlCasca, htmlId e htmlMinis. No node exporta
 * por module.exports (carregado sozinho); no artefato js/ficha.js o export já é
 * o KhInv e este módulo só registra window.KhFichaDrawer e o liga no navegador.
 * Vem no ORDEM depois do kh-ficha-abas.js (usa o KhFichaAbas, o KhAbas, o
 * KhRedesenho, o KhConta e o KhPrevia).
 * Fonte: js/ficha/kh-ficha-drawer.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhPrevia = emNode ? require('./kh-previa.js') : raiz.KhPrevia;
  var KhRegras = emNode ? require('./kh-regras.js') : raiz.KhRegras;
  var KhConta = emNode ? require('./kh-conta.js') : raiz.KhConta;
  var KhAbas = emNode ? require('./kh-abas.js') : raiz.KhAbas;
  var KhFichaAbas = emNode ? require('./kh-ficha-abas.js') : raiz.KhFichaAbas;
  var KhRedesenho = emNode ? require('./kh-redesenho.js') : raiz.KhRedesenho;

  var KhFichaDrawer = (function () {
    var CHAVE_DOCK = 'khalkaria_ficha3_dock';
    var CHAVE_PREVIA = 'khalkaria_ficha_previa';
    var CHAVE_V2 = 'khalkaria_ficha';
    var ESTADOS = ['trilho', 'aberto'];
    var PADRAO = 'trilho';
    var ATRIBUTO = 'data-ficha3';    // no <html>: o head-boot marca, o drawer troca; o css/style.css lê
    var PREFIXO = 'fd';              // o do conteúdo (KhFichaAbas e o KhConta das abas: fd-d-N)
    var PREFIXO_TRILHO = 'fd-tr';    // o KhConta das mini barras (fd-tr-d-N: sem colidir com as abas)
    var ID = 'fd-gaveta';
    var ESPERA = 350;                // ms: depois do debounce de 200 ms com que o drawer v2 grava
    var MOSTRA_AVISO = 6000;         // ms do aviso depois que o arrasto acaba
    // o texto da especificação (06 §Arrastar)
    var AVISO_SO_LEITURA = 'A ficha nova ainda é só leitura: solte na ficha atual (botão FICHA) para levar técnicas e magias';
    var RO = 'Prévia só leitura. Para editar, use a ficha atual (FICHA).';
    var DICA_ORDEM = 'Arraste para mudar a ordem das abas. Pelo teclado: Tab até a aba e Alt+← ou Alt+→';
    var TITULO_A4 = 'Ordem do A4: volta as abas à ordem da ficha física';
    var RESTAURADA = 'Ordem do A4 restaurada.';
    var CARREGANDO = KhFichaAbas ? KhFichaAbas.CARREGANDO : 'Carregando a ficha…';
    // as abas são as da página (KhFichaAbas.ABAS: id, página do A4 e rótulo); em
    // 380 px, numa linha só, o rótulo à vista é a primeira palavra dele, e o
    // nome inteiro fica no aria-label (que começa pelo que se vê)
    function rotuloCurto(a) { return str(a.rotulo).replace(/^O\s+/, '').split(/[\s,&]+/)[0] || str(a.rotulo); }
    // as mini barras do trilho (03 §9): Saúde, Stamina e Éter, nas cores de recurso (D28)
    var RECURSOS = [['saude', 'Saúde'], ['stamina', 'Stamina'], ['eter', 'Éter']];
    // o que acende o trilho ao começar a arrastar: os cards das páginas de regras
    // (decorados pela v2.1: .kf-draggable; marcados no build: [data-kf-tipo]) e
    // os itens do Bazar (o registro tem [data-kf-tipo="item"]; o painel de receita, [data-ir])
    var ORIGENS_ARRASTO = '.kf-draggable, [data-kf-tipo], #bz-receita [data-ir]';

    // ícones (traço em currentColor, sem emoji)
    function svg(d) {
      return '<svg class="fd-gaveta-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + d +
        '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    var SVG_ABRIR = svg('M11.5 6 5.5 12l6 6M18.5 6l-6 6 6 6');
    var SVG_RECOLHER = svg('M5.5 6l6 6-6 6M12.5 6l6 6-6 6');
    var SVG_PAGINA = svg('M14 4h6v6M20 4l-8.5 8.5M18 14v4.6a1.4 1.4 0 0 1-1.4 1.4H5.4A1.4 1.4 0 0 1 4 18.6V7.4A1.4 1.4 0 0 1 5.4 6H10');
    var SVG_EDITAR = svg('M4.5 19.5h3.6L18.6 9a2.5 2.5 0 0 0-3.6-3.6L4.5 15.9Zm9-12.6 3.6 3.6');
    var SVG_A4 = svg('M5.6 9.2A7.4 7.4 0 1 1 4.6 13.6M4.4 4.6v4.8h4.8');

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function esc(s) { return KhConta ? KhConta.esc(s) : str(s); }
    function semEmoji(s) { return KhConta ? KhConta.semEmoji(s) : str(s); }
    function fmt(n) { return KhRegras && KhRegras.fmt ? KhRegras.fmt(n) : str(n); }
    function storage(win, nome) { try { return win ? win[nome] : null; } catch (e) { return null; } }
    function arr(x) { return Array.prototype.slice.call(x || []); }

    // ---------------- puras ----------------
    function estado(v) { return v === 'aberto' ? 'aberto' : PADRAO; }
    function lerDock(ls) {
      var v = null;
      try { v = ls ? ls.getItem(CHAVE_DOCK) : null; } catch (e) { v = null; }
      return estado(v);
    }
    function gravarDock(ls, e) {
      try { if (ls) { ls.setItem(CHAVE_DOCK, estado(e)); return true; } } catch (x) { /* bloqueado: vale nesta página */ }
      return false;
    }
    // o text/plain de um arrasto (o formato da v2.1 e do Bazar):
    // {tipo:'bazar', item} | {tipo:'outro'} | null (não é entidade)
    function leArrasto(txt) {
      var p = null;
      try { p = JSON.parse(str(txt)); } catch (e) { return null; }
      if (!obj(p)) return null;
      if (p._bazar && obj(p.item) && (p.item.id || p.item.nome)) return { tipo: 'bazar', item: p.item };
      return { tipo: 'outro' };
    }
    // atual sobre máximo, de 0 a 1 (máximo 0 ou ausente: vazia)
    function fracao(atual, max) {
      var a = Number(atual), m = Number(max);
      if (!isFinite(a) || !isFinite(m) || m <= 0) return 0;
      return Math.max(0, Math.min(1, a / m));
    }
    // "Sair da prévia": a URL sem o parâmetro ficha (o ?ficha=v3 religaria a
    // prévia), com os outros parâmetros e o #fragmento. Sem ficha na query, a URL
    // nova seria a atual, e um replace para ela com # só rola até o fragmento,
    // sem recarregar: aí {recarregar:true}. loc: {pathname, search, hash}
    function saidaPrevia(loc) {
      loc = loc || {};
      var search = str(loc.search);
      var resto = search.replace(/^\?/, '').split('&').filter(function (p) { return p && !/^ficha(=|$)/.test(p); });
      var q = resto.length ? '?' + resto.join('&') : '';
      if (q === search) return { recarregar: true, url: '' };
      return { recarregar: false, url: str(loc.pathname) + q + str(loc.hash) };
    }
    function refNome(r) { return KhFichaAbas ? KhFichaAbas.refNome(r) : ''; }
    function idsAbas() { return KhFichaAbas ? KhFichaAbas.ABAS.map(function (a) { return a.id; }) : []; }
    function abaPorId(id) { return KhFichaAbas ? KhFichaAbas.ABAS.filter(function (a) { return a.id === id; })[0] : null; }

    // nome, nível, raça e classe; res null = carregando
    function htmlId(res) {
      var ok = !!res && res.estado === 'ok';
      var f = ok ? res.ficha : null;
      var meta = f && obj(f.meta) ? f.meta : {}, idt = f && obj(f.identidade) ? f.identidade : {};
      var nome = ok ? (semEmoji(meta.nome) || '(sem nome)') : !res ? CARREGANDO : res.estado === 'sem-ficha' ? '(sem ficha)' : 'Ficha';
      var sub = ok ? [meta.nivel == null ? '' : 'Nível ' + str(meta.nivel), refNome(idt.raca), refNome(idt.classe)].filter(Boolean).join(' · ')
        : (KhFichaAbas && res ? KhFichaAbas.mensagemEstado(res) : '');
      return '<p class="fd-gaveta-nome">' + esc(nome) + '</p>' + (sub ? '<p class="fd-gaveta-sub">' + esc(sub) + '</p>' : '');
    }

    // as mini barras: atual sobre máximo, com a conta do máximo no foco e no
    // hover. res fora de 'ok' (carregando, sem ficha): vazias, sem conta.
    // C = KhConta com o PREFIXO_TRILHO (criado aqui se não vier)
    function htmlMinis(res, C) {
      var ok = !!res && res.estado === 'ok' && !!res.av;
      if (ok && !C && KhConta) C = KhConta.criar({ D: KhRegras ? KhRegras.dados() : {}, nos: res.av.nos, prefixo: PREFIXO_TRILHO, fmt: fmt });
      var rc = ok && res.ficha && obj(res.ficha.recursos) ? res.ficha.recursos : {};
      return RECURSOS.map(function (r) {
        var id = r[0], nome = r[1], caminho = 'recurso.' + id + '.max';
        var no = ok ? res.av.nos[caminho] : null;
        var max = no && typeof no.valor === 'number' ? no.valor : null;
        var x = rc[id], atual = obj(x) && typeof x.atual === 'number' ? x.atual : null;
        var pc = max == null || atual == null ? 0 : Math.round(fracao(atual, max) * 1000) / 10;
        var txt = nome + ' ' + (max == null ? (ok ? 'sem máximo' : '(carregando)') : (atual == null ? '?' : fmt(atual)) + ' / ' + fmt(max));
        var conta = no && C ? C.conta(caminho, { texto: txt, semSelos: true })
          // a linha de cima da dica (só para quem vê: o leitor de tela já leu o valor no <b>)
          .replace('role="tooltip">', 'role="tooltip"><span class="fd-gaveta-mini-cab" aria-hidden="true">' + esc(txt) + '</span>')
          : '<span class="fd-gaveta-sr">' + esc(txt) + '</span>';
        return '<div class="fd-gaveta-mini fd-gaveta-mini-' + id + '" data-recurso="' + id + '"' + (max == null ? ' data-vazia' : '') + '>' +
          '<span class="fd-gaveta-mini-barra" aria-hidden="true"><span class="fd-gaveta-mini-fill" style="height: ' + pc + '%"></span></span>' +
          '<svg class="fd-gaveta-mini-g" aria-hidden="true" focusable="false"><use href="#g-' + id + '"/></svg>' +
          conta + '</div>';
      }).join('');
    }

    // a casca inteira (o miolo do <aside>): trilho, e a folha com cabeçalho,
    // abas na ordem dada (ids; sem ela, a do A4), aviso, painéis e o sprite.
    // op: {ordem, aberta, base (raiz do site, para o link da página da ficha)}
    function htmlCasca(op) {
      op = obj(op) ? op : {};
      var ids = idsAbas();
      var ordem = KhAbas ? KhAbas.normaliza(op.ordem, ids) : ids;
      var aberta = ordem.indexOf(op.aberta) >= 0 ? op.aberta : ordem[0];
      var padrao = ordem.join(' ') === ids.join(' ');
      var base = op.base == null ? '../' : str(op.base);
      return '<div class="fd-gaveta-trilho">' +
          '<button type="button" class="fd-gaveta-abrir" aria-expanded="false" aria-controls="fd-gaveta-folha" title="Abrir a ficha nova">' +
            SVG_ABRIR + '<span class="fd-gaveta-trilho-rot">Ficha nova</span></button>' +
          '<div class="fd-gaveta-minis" id="fd-gaveta-minis" role="group" aria-label="Saúde, Stamina e Éter">' + htmlMinis(null) + '</div>' +
        '</div>' +
        '<div class="fd-gaveta-folha" id="fd-gaveta-folha" role="region" aria-label="Ficha nova" tabindex="-1">' +
          '<header class="fd-gaveta-cab">' +
            '<div class="fd-gaveta-id" id="fd-gaveta-id">' + htmlId(null) + '</div>' +
            '<div class="fd-gaveta-acoes">' +
              '<a class="kh-btn fd-gaveta-btn fd-gaveta-pagina" href="' + esc(base + 'pages/ficha.html') + '" aria-label="Abrir a página da ficha" title="Abrir a página da ficha">' + SVG_PAGINA + '</a>' +
              '<button type="button" class="kh-btn fd-gaveta-btn fd-gaveta-editar" aria-label="Editar na ficha atual" title="Editar na ficha atual (FICHA)">' + SVG_EDITAR + '</button>' +
              '<button type="button" class="kh-btn fd-gaveta-btn fd-gaveta-recolher" aria-expanded="true" aria-controls="fd-gaveta-folha" aria-keyshortcuts="Escape"' +
                ' aria-label="Recolher ao trilho" title="Recolher ao trilho (Esc)">' + SVG_RECOLHER + '</button>' +
            '</div>' +
            '<p class="fd-gaveta-ro" role="note">' + esc(RO) + ' <button type="button" class="fd-gaveta-sair">Sair da prévia</button></p>' +
          '</header>' +
          '<div class="fd-gaveta-abas-barra">' +
            '<div class="fd-gaveta-abas" id="fd-gaveta-abas" role="tablist" aria-label="Partes da ficha">' +
            ordem.map(function (id) {
              var a = abaPorId(id), on = id === aberta;
              return '<button type="button" class="fd-gaveta-aba" role="tab" id="fd-gaveta-a-' + id + '" data-aba="' + id + '"' +
                ' aria-controls="fd-gaveta-p-' + id + '" aria-selected="' + on + '" tabindex="' + (on ? '0' : '-1') + '"' +
                ' aria-keyshortcuts="Alt+ArrowLeft Alt+ArrowRight" aria-label="' + esc(a.rotulo) + '" title="' + esc(a.rotulo + '. ' + DICA_ORDEM) + '">' +
                '<span class="fd-gaveta-aba-pag" aria-hidden="true">' + a.pag + '</span>' +
                '<span class="fd-gaveta-aba-rot">' + esc(rotuloCurto(a)) + '</span></button>';
            }).join('') + '</div>' +
            '<button type="button" class="kh-btn fd-gaveta-a4" id="fd-gaveta-a4"' + (padrao ? ' hidden' : '') +
              ' aria-label="Ordem do A4" title="' + esc(TITULO_A4) + '">' + SVG_A4 + '</button>' +
            '<span class="fd-gaveta-sr" id="fd-gaveta-anuncio" role="status" aria-live="polite"></span>' +
          '</div>' +
          '<p class="fd-gaveta-aviso" id="fd-gaveta-aviso" role="status" aria-live="polite" hidden></p>' +
          '<div class="fd-gaveta-rolagem" id="fd-gaveta-rolagem">' +
            ordem.map(function (id) {
              return '<section class="fd-gaveta-painel" role="tabpanel" id="fd-gaveta-p-' + id + '" data-aba="' + id + '"' +
                ' aria-labelledby="fd-gaveta-a-' + id + '" tabindex="0" aria-busy="true"' + (id === aberta ? '' : ' hidden') + '>' +
                '<p class="fd-nota">' + esc(CARREGANDO) + '</p></section>';
            }).join('') +
          '</div>' +
          // o sprite partials/glifos.html (moldura de raízes, ramos, selo, recursos), posto ao carregar
          '<div class="fd-gaveta-sprite" id="fd-gaveta-sprite" aria-hidden="true"></div>' +
        '</div>';
    }

    // ---------------- navegador ----------------
    var atual = null;   // o drawer montado nesta página (ou null)

    // a borda esquerda do drawer na janela (px), para quem posiciona pop-ups
    // (KhPrever no Bazar: xPreferido); null sem drawer (sem a prévia, na página
    // da ficha, antes de montar)
    function borda() { return atual ? atual.borda() : null; }

    function iniciar(win) {
      if (!win || !win.document || !win.location) return false;
      // ativação e "lembrar" (?ficha=v3 grava a chave da prévia): os do KhPrevia
      if (!KhPrevia || !KhPrevia.iniciar(win)) return false;
      var doc = win.document;
      var vai = function () {
        try { atual = montar(win) || atual; } catch (e) { /* o drawer nunca derruba a página */ }
      };
      if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', vai);
      else vai();
      return true;
    }

    function montar(win) {
      var doc = win.document, html = doc.documentElement;
      if (!doc.body || !html || doc.getElementById(ID)) return null;
      // a página da ficha já é a ficha nova inteira: nada por cima dela
      if (doc.getElementById('fp') || (doc.body.hasAttribute && doc.body.hasAttribute('data-ficha-pagina'))) return null;
      if (!KhFichaAbas || !KhAbas || !KhRedesenho || !KhConta || !KhRegras || !KhPrevia) return null;
      var ls = storage(win, 'localStorage'), ss = storage(win, 'sessionStorage');
      var s = doc.querySelector('script[src*="js/ficha.js"]');
      var src = s ? s.src : '';
      var base = '', versao = '';
      try { base = src ? new URL('../', src).href : ''; versao = src ? new URL(src).search : ''; } catch (e) { /* relativo à página */ }
      var ids = idsAbas();
      var ordem = KhAbas.lerOrdem(ls, ids);
      var aberta = KhAbas.lerAberta(ss, ids) || ordem[0];
      var est = lerDock(ls);
      // o head-boot já marcou (página gerada antes da F4.4b não: marca agora)
      if (html.getAttribute(ATRIBUTO) !== est) html.setAttribute(ATRIBUTO, est);

      var link = doc.createElement('link');
      link.rel = 'stylesheet';
      link.href = base + 'css/ficha-drawer.css' + versao;
      link.setAttribute('data-fd-gaveta', '');
      var gav = doc.createElement('aside');
      gav.id = ID;
      gav.className = 'fd-gaveta';
      gav.hidden = true;   // até o CSS chegar (a reserva do style.css segura o lugar)
      gav.setAttribute('aria-label', 'Ficha nova (prévia, só leitura)');
      // o MutationObserver da v2.1 (decoração dos cards) ignora o que redesenha aqui
      gav.setAttribute('data-kf-ignorar', '');
      gav.innerHTML = htmlCasca({ ordem: ordem, aberta: aberta, base: base || '../' });
      var mostrar = function () { gav.hidden = false; };
      link.addEventListener('load', mostrar);
      link.addEventListener('error', mostrar);
      doc.head.appendChild(link);
      doc.body.appendChild(gav);

      function el(id) { return doc.getElementById(id); }
      function q(sel) { return gav.querySelector(sel); }
      var btAbrir = q('.fd-gaveta-abrir'), btRecolher = q('.fd-gaveta-recolher');
      var minis = el('fd-gaveta-minis'), idEl = el('fd-gaveta-id'), rolagem = el('fd-gaveta-rolagem');
      var aviso = el('fd-gaveta-aviso');
      var vivo = true;

      // ---- estado: trilho | aberto
      function foca(x) { if (!x || !x.focus) return; try { x.focus({ preventScroll: true }); } catch (e) { x.focus(); } }
      function poeEstado(novo, o) {
        o = o || {};
        est = estado(novo);
        html.setAttribute(ATRIBUTO, est);
        btAbrir.setAttribute('aria-expanded', est === 'aberto' ? 'true' : 'false');
        btRecolher.setAttribute('aria-expanded', est === 'aberto' ? 'true' : 'false');
        if (o.gravar) gravarDock(ls, est);
        if (o.foco) foca(est === 'aberto' ? (el('fd-gaveta-a-' + aberta) || el('fd-gaveta-folha')) : btAbrir);
      }
      function abrir(o) { o = o || {}; poeEstado('aberto', { gravar: o.gravar !== false, foco: !!o.foco }); }
      function recolher(o) { o = o || {}; poeEstado('trilho', { gravar: o.gravar !== false, foco: !!o.foco }); }
      poeEstado(est);

      // ---- abas: as da página (KhAbas, khalkaria_ficha_abas), Alt+setas, arrasto, "Ordem do A4"
      var rotulos = {};
      KhFichaAbas.ABAS.forEach(function (a) { rotulos[a.id] = a.rotulo; });
      var abas = KhAbas.criar(el('fd-gaveta-abas'), { win: win, doc: doc, ids: ids, ls: ls, ss: ss, aberta: aberta, rotulos: rotulos,
        restaurar: el('fd-gaveta-a4'), anuncio: el('fd-gaveta-anuncio'), textoRestaurada: RESTAURADA,
        aoSelecionar: function (id) { aberta = id; } });

      // ---- aviso (arrastar e soltar)
      var avisoT = null;
      function mostraAviso(msg, ms) {
        clearTimeout(avisoT);
        if (aviso.textContent !== msg) aviso.textContent = msg;
        aviso.hidden = false;
        if (ms) avisoT = setTimeout(function () { aviso.hidden = true; aviso.textContent = ''; }, ms);
      }

      // ---- cliques (delegados: o redesenho não perde ouvinte)
      gav.addEventListener('click', function (e) {
        var t = e.target && e.target.closest ? e.target : null;
        if (!t) return;
        if (t.closest('.fd-gaveta-abrir')) abrir({ foco: true });
        else if (t.closest('.fd-gaveta-recolher')) recolher({ foco: true });
        else if (t.closest('.fd-gaveta-editar')) { if (win.KF && typeof win.KF.abrir === 'function') win.KF.abrir(); }
        else if (t.closest('.fd-gaveta-sair')) {
          // apaga a chave e recarrega DE FATO, sem ?ficha=v3 (saidaPrevia)
          try { if (ls) ls.removeItem(CHAVE_PREVIA); } catch (x) { /* storage bloqueado */ }
          var L = win.location, s = saidaPrevia(L);
          if (!L) return;
          if (s.recarregar) { if (typeof L.reload === 'function') L.reload(); }
          else if (typeof L.replace === 'function') L.replace(s.url);
        }
      });

      // ---- a dica da conta dentro do drawer (as das abas; as do trilho abrem à esquerda pelo CSS)
      var R = KhRedesenho.criar({ prefixo: PREFIXO }), RT = KhRedesenho.criar({ prefixo: PREFIXO_TRILHO });
      function aoAbrirDica(e) {
        var c = e.target && e.target.closest ? e.target.closest('.kh-conta') : null;
        if (!c || !rolagem.contains(c)) return;
        if (e.type === 'mouseover' && e.relatedTarget && c.contains && c.contains(e.relatedTarget)) return;
        if (!R.encaixa(c, rolagem, win) && win.requestAnimationFrame) win.requestAnimationFrame(function () { R.encaixa(c, rolagem, win); });
      }
      gav.addEventListener('mouseover', aoAbrirDica);
      gav.addEventListener('focusin', aoAbrirDica);
      gav.addEventListener('focusout', function (e) { R.soltaFoco(e.target); RT.soltaFoco(e.target); });
      // a dica de uma mini barra que o redesenho deixou aberta (sem caixa: ela abre à esquerda do trilho)
      var dicaTrilho = false;
      function aoMexer() {
        R.soltaDicas(rolagem);
        if (!dicaTrilho) return;
        dicaTrilho = false;
        arr(minis.querySelectorAll('[' + RT.MARCA_DICA + ']')).forEach(function (x) { x.removeAttribute(RT.MARCA_DICA); });
      }
      doc.addEventListener('mousemove', aoMexer, { passive: true });

      // ---- desenho: o mesmo da página (KhFichaAbas), compacto
      var DESENHO = KhFichaAbas.criar({ prefixo: PREFIXO, densidade: 'compacta' });
      var dados = null, t = null, res = null;
      function pinta(r0) {
        res = r0;
        var r = DESENHO.paineis(r0, { dados: dados, base: base || '../' });
        var topo = rolagem.scrollTop;
        R.trocaHTML(doc, idEl, htmlId(r0), null, null, win);
        if (RT.trocaHTML(doc, minis, htmlMinis(r0), btAbrir, null, win)) dicaTrilho = !!minis.querySelector('[' + RT.MARCA_DICA + ']');
        ids.forEach(function (id) {
          var p = el('fd-gaveta-p-' + id);
          if (!p) return;
          R.trocaHTML(doc, p, r.paineis[id], p, rolagem, win);
          p.removeAttribute('aria-busy');
        });
        rolagem.scrollTop = topo;
      }
      function desenha() { if (dados && vivo) pinta(KhPrevia.calcular(ls, dados, versao)); }
      function agenda() { clearTimeout(t); t = setTimeout(desenha, ESPERA); }
      function aoStorage(e) { if (e && e.key === CHAVE_V2) agenda(); }
      // campos digitados do drawer v2: vários só gravam (save), sem kf:mudou
      function aoCampo(e) { if (e && e.target && e.target.closest && e.target.closest('#kf-drawer')) agenda(); }
      doc.addEventListener('kf:mudou', agenda);
      doc.addEventListener('input', aoCampo, true);
      doc.addEventListener('change', aoCampo, true);
      win.addEventListener('storage', aoStorage);

      // ---- arrastar: acende, abre, guarda o item do Bazar, avisa o resto
      var arrasto = null;
      function limpaAlvo() { gav.removeAttribute('data-alvo'); gav.removeAttribute('data-recusa'); }
      function aoComecar(e) {
        var x = e.target && e.target.closest ? e.target : null;
        if (!x || x.closest('#' + ID) || !x.closest(ORIGENS_ARRASTO)) return;
        var lido = null;
        // no dragstart o dataTransfer ainda se lê (o card já pôs o text/plain: ouvinte dele, antes deste)
        try { lido = leArrasto(e.dataTransfer ? e.dataTransfer.getData('text/plain') : ''); } catch (y) { lido = null; }
        arrasto = { tipo: lido ? lido.tipo : 'outro', item: lido ? lido.item : null };
        gav.setAttribute('data-acende', '');
      }
      function aoEntrar() {
        if (!arrasto) return;
        // abre sem gravar: é um passeio do arrasto, não a escolha do jogador
        if (est !== 'aberto') poeEstado('aberto');
      }
      function nomeItem(it) { return semEmoji(it && it.nome) || 'o item'; }
      function aoSobre(e) {
        if (!arrasto) return;
        if (arrasto.tipo === 'bazar') {
          e.preventDefault();
          if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
          gav.setAttribute('data-alvo', '');
          mostraAviso('Solte para guardar ' + nomeItem(arrasto.item) + ' no inventário da ficha atual.');
        } else {
          // não aceita (sem preventDefault): o arrasto segue, e dá para soltar na ficha atual
          gav.setAttribute('data-recusa', '');
          mostraAviso(AVISO_SO_LEITURA);
        }
      }
      function aoSairArrasto(e) {
        if (e.relatedTarget && gav.contains(e.relatedTarget)) return;
        limpaAlvo();
      }
      function fimArrasto() {
        if (!arrasto) return;
        arrasto = null;
        gav.removeAttribute('data-acende');
        limpaAlvo();
        if (!aviso.hidden) mostraAviso(aviso.textContent, MOSTRA_AVISO);
      }
      function aoSoltar(e) {
        if (!arrasto || arrasto.tipo !== 'bazar') return;
        e.preventDefault();
        var lido = null;
        try { lido = leArrasto(e.dataTransfer ? e.dataTransfer.getData('text/plain') : ''); } catch (y) { lido = null; }
        var it = lido && lido.tipo === 'bazar' ? lido.item : arrasto.item;
        var KF = win.KF;
        var uid = KF && typeof KF.adicionar === 'function' ? KF.adicionar(it) : null;
        arrasto = null;
        gav.removeAttribute('data-acende');
        limpaAlvo();
        if (uid) {
          // mostra onde foi parar: a aba O Bazar (o redesenho vem pelo kf:mudou)
          if (abas) abas.seleciona('bazar');
          mostraAviso('+ ' + nomeItem(it) + ' no inventário da ficha atual.', MOSTRA_AVISO);
        } else mostraAviso('Não deu para guardar ' + nomeItem(it) + ' na ficha atual.', MOSTRA_AVISO);
      }
      doc.addEventListener('dragstart', aoComecar);
      doc.addEventListener('dragend', fimArrasto, true);
      gav.addEventListener('dragenter', aoEntrar);
      gav.addEventListener('dragover', aoSobre);
      gav.addEventListener('dragleave', aoSairArrasto);
      gav.addEventListener('drop', aoSoltar);

      // ---- teclado: Esc recolhe (depois das camadas do Bazar: pop-up 10, lista 20, painel 30)
      var T = win.KhTeclas;
      // foco num campo de texto da página, fora do drawer: o Esc é do campo (a
      // busca do Bazar, type=search, limpa o texto; o escLivre do bazar.js já
      // solta as camadas dele ali). Consumir cancelaria isso e gravaria o dock.
      function campoFora(e) {
        if (!T || typeof T.emCampo !== 'function') return false;
        return [e && e.target, doc.activeElement].some(function (x) { return !!x && T.emCampo(x) && !gav.contains(x); });
      }
      if (T && typeof T.camadaEsc === 'function') {
        T.camadaEsc(40, function (e) {
          if (!vivo || est !== 'aberto') return false;
          // a ficha atual (v2.1) aberta fica por cima: o Esc não mexe no que está embaixo dela
          var v2 = el('kf-drawer');
          if (v2 && v2.classList && v2.classList.contains('kf-open')) return false;
          if (campoFora(e)) return false;
          var dentro = gav.contains(doc.activeElement);
          recolher({ foco: dentro });
          return true;
        });
      }

      // ---- dados: os do motor (os da página), uma vez
      KhPrevia.carregar(win.fetch.bind(win), base, versao).then(function (d) {
        dados = d;
        var sp = el('fd-gaveta-sprite');
        if (sp && d && d.glifos) sp.innerHTML = d.glifos;
        desenha();
      }, function (e) {
        pinta({ estado: 'falha', erro: str(e && e.message), erros: [] });
      });

      return {
        gaveta: gav, abas: abas,
        estado: function () { return est; },
        abrir: abrir, recolher: recolher,
        alternar: function (o) { if (est === 'aberto') recolher(o); else abrir(o); },
        borda: function () {
          if (!vivo || gav.hidden || !gav.getBoundingClientRect) return null;
          var r = gav.getBoundingClientRect();
          return r && r.width ? r.left : null;
        },
        desenha: desenha, pinta: pinta, resultado: function () { return res; }
      };
    }

    return { CHAVE_DOCK: CHAVE_DOCK, ESTADOS: ESTADOS.slice(), PADRAO: PADRAO, ATRIBUTO: ATRIBUTO, ID: ID,
      PREFIXO: PREFIXO, PREFIXO_TRILHO: PREFIXO_TRILHO, AVISO_SO_LEITURA: AVISO_SO_LEITURA, ORIGENS_ARRASTO: ORIGENS_ARRASTO,
      estado: estado, lerDock: lerDock, leArrasto: leArrasto, fracao: fracao, saidaPrevia: saidaPrevia,
      htmlId: htmlId, htmlMinis: htmlMinis, htmlCasca: htmlCasca,
      iniciar: iniciar, borda: borda, atual: function () { return atual; } };
  })();

  if (emNode) { module.exports = KhFichaDrawer; return; }
  raiz.KhFichaDrawer = KhFichaDrawer;
  try { KhFichaDrawer.iniciar(raiz); } catch (e) { /* o drawer nunca derruba a página */ }
})(typeof window !== 'undefined' ? window : this);
