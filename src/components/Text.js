/*
 * Adds `textAlign` to Crafty's Text component, but only for DOM.
 *
 * The canvas text drawing pipeline is set up inside Text.init() and can't be
 * altered from outside. ARGH.
 */
Crafty.components().Text.textAlign = function(align) {
  if ( this.has( 'DOM' ) ) {
    this.css( 'text-align', align );
  }
  return this;
};

