/* Allow Crafty's touchDispatch to be enabled/disabled.
 *
 * Crafty intercepts touch events and simulates mouse events instead. This is
 * great, except Firefox Mobile doesn't trust fullscreen requests that come from
 * simulated events. It requires requests to come from real mouse event handlers.
 * Not even touch events are supported; you have to wait until the browser
 * converts touch events to mouse clicks on its own. See bug:
 *   https://bugzilla.mozilla.org/show_bug.cgi?id=779324
 */
Crafty.touch = {
  enable: function() {
    Crafty.touch.disable();
    Crafty.addEvent(Crafty, Crafty.stage.elem, "touchstart", Crafty.touchDispatch);
    Crafty.addEvent(Crafty, Crafty.stage.elem, "touchmove", Crafty.touchDispatch);
    Crafty.addEvent(Crafty, Crafty.stage.elem, "touchend", Crafty.touchDispatch);
    Crafty.addEvent(Crafty, Crafty.stage.elem, "touchcancel", Crafty.touchDispatch);
    Crafty.addEvent(Crafty, Crafty.stage.elem, "touchleave", Crafty.touchDispatch);
  }

  ,disable: function() {
    Crafty.removeEvent(Crafty, Crafty.stage.elem, "touchstart", Crafty.touchDispatch);
    Crafty.removeEvent(Crafty, Crafty.stage.elem, "touchmove", Crafty.touchDispatch);
    Crafty.removeEvent(Crafty, Crafty.stage.elem, "touchend", Crafty.touchDispatch);
    Crafty.removeEvent(Crafty, Crafty.stage.elem, "touchcancel", Crafty.touchDispatch);
    Crafty.removeEvent(Crafty, Crafty.stage.elem, "touchleave", Crafty.touchDispatch);
  }
};


/**@
 * #Crafty.viewport.absoluteScale
 * @comp Crafty.viewport
 * @sign public void Crafty.viewport.absoluteScale(Number scaleFactor)
 * @param Number scaleFactor - scale factor relative to original pixels (eg. 2, 4, 0.5)
 *
 * Scales the entire canvas by the given factor.
 *   1.0 = entities render 1:1 between screen pixels and canvas coordinates
 *   0.5 = entities render at half scale
 *   2.0 = entities render at 2x scale
 *
 * Absolute scale is not cumulative. New scaleFactor will *replace* any previous scaling.
 *
 * @example
 * ~~~
 * Crafty.init();
 * Crafty.canvas.init();
 *
 * var original = { w: Crafty.viewport.width, h: Crafty.viewport.height };
 * var scaler = function() {
 *   var current = { w: Crafty.viewport.width, h: Crafty.viewport.height };
 *
 *   // This will reset the scale when it adjusts the canvas element
 *   // dimensions, so do it right before setting the scale we want.
 *   Crafty.viewport.reload();
 *
 *   if ( current.w > current.h ) {
 *     // Landscape, scale to fit height
 *     Crafty.viewport.absoluteScale( current.h / original.h );
 *   } else {
 *     // Portrait, scale to fit width
 *     Crafty.viewport.absoluteScale( current.w / original.w )
 *   }
 * };
 *
 * // Avoid drawing entities before we're ready to scale.
 * Crafty.removeEvent( Crafty, window, 'resize', Crafty.viewport.reload );
 *
 * // Adjust scale to fit inside resized window.
 * Crafty.addEvent( Crafty, window, 'resize', scaler );
 *
 * // Run the scaler after scene changes, since they reset the scale.
 * Crafty.bind( 'SceneChange', scaler );
 * ~~~
 */
Crafty.viewport.absoluteScale = function (scaleFactor) {
    var ctx = Crafty.canvas.context;

    // Clear entire canvas; scaling invalidates dirty rects and leaves artifacts behind.
    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();

    // Trick Crafty.viewport.scale into operating in absolute mode.
    Crafty.stage.inner.style['transform'] =
        Crafty.stage.inner.style[Crafty.support.prefix + "Transform"] = 'scale(1, 1)';
    Crafty.viewport._zoom = 1;
    Crafty.viewport.scale(scaleFactor);
};
