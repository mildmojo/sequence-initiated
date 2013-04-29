Crafty.c( 'DotMatrix', {
  init: function() {
    var self = this;
    this.requires( '2D' );

    _(this).extend({
      _sprites: { bg: null, text: null }
      ,_font: 'Dited'
    });

    this._sprites.bg = Crafty.e( '2D, Canvas' ).attr({ z: Layer.SPRITES });
    this._sprites.bg.draw = function(frame) {
      Crafty.canvas.context.fillRect( self._x, self._y, self._w, self._h );
    }

    this._sprites.text = Crafty.e( '2D, Canvas, Text, Tween, Color, Offscreen' )
      .attr({ z: Layer.SPRITES + 1 })
      .textFont({ family: this._font+', Courier, Serif' })
      .color('#DDDD55');

    return this;
  }

  ,setup: function(attrs) {
    typeof attrs.fontSize !== 'undefined' && this.fontSize( attrs.fontSize );
    return this;
  }

  ,fontSize: function(size) {
    this._h = size;
    this._sprites.text.textFont({ size: size+'px' });
  }

  ,write: function(text) {
    var attrs = {
      w: this._measure_text(text).width
      ,h: this._h-2
      ,x: this._x + this._w
      ,y: this._y
    }

    this._sprites.text
      .attr(attrs)
      .text(text);

    if ( attrs.w <= this._w ) {
      this._sprites.text.tween( { x: this._x - attrs.w }, 5 * attrs.w )
    }

  }

  ,_measure_text: function(text) {
    var ctx = Crafty.canvas.context;
    ctx.font = this._h-2+'px ' + this._font;
    return ctx.measureText(text).width;
  }
});
