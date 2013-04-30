// Should render rotary dial, then cover.
Crafty.c( 'RoundGauge', {
  init: function(){
    _(this).extend({
      _value:         0
      ,_start_angle:  180
      ,_sprites:      { dial: null, cover: null }
      ,_min_val:      0
      ,_min_angle:    0
      ,_max_val:      0
      ,_max_angle:    0
    })

    this._sprites.dial = Crafty.e( '2D, Canvas, dial_medium' ).attr({ z: Layer.SPRITES })
      .sprite(1, 0);
    this._sprites.cover = Crafty.e( '2D, Canvas, dial_medium' )
      .attr({ z: Layer.SPRITES + 1 });
  }

  ,setup: function(attrs) {
    this._min_val   = attrs.vals.min   || 0;
    this._max_val   = attrs.vals.max   || 0;
    this._min_angle = attrs.angles.min || 0;
    this._max_angle = attrs.angles.max || 0;
    return this;
  }

  ,attr: function(attrs) {
    // Attrs are passed in without underscores, store as underscored properties
    // like the 2D component would.
    for (var prop in attrs) {
      this['_'+prop] = attrs[prop];
    }

    // Redraw label & sprite
    this._redraw_sprites();

    return this;
  }

  // 0.0 - 1.0
  ,val: function(new_val){
    if ( typeof new_val !== 'undefined' ) {
      this._value = new_val;
      this._redraw_sprites();
    }
    return this._value;
  }

  ,_redraw_sprites: function() {
    var self = this;
    _([ this._sprites.dial, this._sprites.cover ]).each(function(sprite){
      sprite.attr({ x: self._x, y: self._y, w: self._w, h: self._h });
      sprite.origin('center');
    })
    this._sprites.dial.rotation = this._start_angle +
      this._value / (this._max_val - this._min_val) * (this._max_angle - this._min_angle);
  }

});
