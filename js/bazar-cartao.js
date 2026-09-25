/* ============================================================
   O BAZAR — pop-up do card (#bz-preview, .bz-cartao)
   Spec §3. Ainda vazio: o pop-up entra numa etapa própria. O nó já está no
   template, e as superfícies (painel de receita, Lista) já trazem
   [data-prever="<id>"]. Quando existir, este módulo registra:
     BZ.cartao = { abrir, fechar, cartaoHTML }
     BZ.camadaEsc(10, fecharPopup)      // o Esc fecha o pop-up antes do painel
   NUNCA usar .item-card nem data-n no pop-up (o observer da ficha decoraria).
   ============================================================ */
(function (BZ) {
  'use strict';
  if (!BZ) return;
})(window.BZ);
