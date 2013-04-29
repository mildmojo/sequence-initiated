/* Component to initialize an element far off screen.
 *
 * DOM elements' dimensions are defined by their content. However, those
 * dimensions aren't available until the element has been added to the DOM.
 *
 * Crafty draws elements once they have an X and Y. This component just assigns
 * the element a large off-screen X and Y. Probably not compatible with viewport
 * scrolling.
 */
Crafty.c( 'Offscreen', {
  init: function(){
    this.requires('2D');
    this.attr({ x: -10000, y: -10000 });
    return this;
  }
});
