'use strict';
// Ponto de entrada da pasta para `node --test tools/testes`.
//
// No Node 22+ o argumento de `node --test` é glob: a pasta casa consigo
// mesma e o runner executa `node tools/testes`, que o CommonJS resolve para
// este index.js. Aqui carregamos cada *.test.js da pasta, e os test() deles
// se registram neste processo. No Node 18/20 a pasta é varrida pelos padrões
// de teste (*.test.js), que não incluem index.js, então nada roda em dobro.
// O build.py continua listando os *.test.js um a um e não passa por aqui.
const fs = require('fs');
const path = require('path');

fs.readdirSync(__dirname)
  .filter((f) => /\.test\.c?js$/.test(f))
  .sort()
  .forEach((f) => require(path.join(__dirname, f)));
