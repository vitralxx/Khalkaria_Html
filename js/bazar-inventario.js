/* ============================================================
   O BAZAR — inventário (aside#bz-inventario)
   Spec §4 e §7. Ainda é casca: o template traz o cabeçalho e as duas colunas
   vazias (section.bz-col[data-col="bugigangas|equipamentos"]). Quando existir,
   este módulo lê KF.inventario()/KF.carga(), escreve só pelos mutadores da KF
   e registra:
     BZ.inventario = { mostrar(id), piscar(uid), ... }
     BZ.camadaEsc(20, fecharCombobox)   // Esc: pop-up > combobox > painel
     BZ.atalho('i', ...), BZ.atalho('I', ...)   // combobox e trilho/painel
     BZ.defineInv('painel'|'trilho'|'amplo')
   A migração da Mochila antiga lê BZ.sacoAntigo() e fecha com BZ.descartaSaco().
   ============================================================ */
(function (BZ) {
  'use strict';
  if (!BZ) return;
})(window.BZ);
