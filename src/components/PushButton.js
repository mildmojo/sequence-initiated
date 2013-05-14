// Should render sprite, then label, then lock image
Crafty.c( 'PushButton', {
  init: function(){
    _(this).extend({
      is_locked:          true
      ,is_frozen:         false
      ,is_latch:          false
      ,_label_text:       ''
      ,_label_font:       'Black Ops One'
      ,_label_font_size:  0
      ,_label_fudge:      { x: 4, y: 4 }
      ,_label_offset:     { x: -8, y: -8 }
      ,_sprite_name:      ''
      ,_sprites:          { main: null, label: null, lock: null }
    })

    this._sprites.main = Crafty.e( '2D, Canvas, Mouse, MouseHover' ).attr({ z: Layer.SPRITES });
    this._sprites.label = Crafty.e( '2D, Canvas, Mouse, MouseHover, Text' )
      .attr({ z: Layer.SPRITES + 1 })
      .textColor('#EEEEEE')
      .textFont({ family: this._label_font + ', Impact, Sans' });
    this._sprites.lock = Crafty.e( '2D, Canvas, Tween' ).attr({ z: Layer.SPRITES + 2 });

    var self = this;
    _([ this._sprites.label, this._sprites.main ]).each(function(sprite){
      sprite.bind( 'MouseDown', function(){ self.press() } );
      sprite.bind( 'MouseUp',   function(){ self.release() } );
      sprite.bind( 'MouseOut',  function(){ self.release() } );
    });

    this.setLatch(false);
  }

  ,setup: function(attrs) {
    typeof attrs.label    !== 'undefined' && this.label( attrs.label );
    typeof attrs.sprite   !== 'undefined' && this.setSprite( attrs.sprite );
    typeof attrs.fontSize !== 'undefined' && this.fontSize( attrs.fontSize );
    typeof attrs.latch    !== 'undefined' && this.setLatch( attrs.latch );
    return this;
  }

  ,attr: function(attrs) {
    // Attrs are passed in without underscores, store as underscored properties
    // like the 2D component would.
    for (var prop in attrs) {
      this['_'+prop] = attrs[prop];
    }

    // Redraw label & sprite
    this._redraw_label();
    this.setSprite( this._sprite_name );

    return this;
  }

  ,fontSize: function(new_fontsize) {
    this._label_font_size = new_fontsize;
    this._sprites.label.textFont({ size: new_fontsize + 'px' });
  }

  ,setLatch: function(is_latch) {
    var sprite = this._sprites.main;
    this.is_latch = is_latch;
  }

  ,label: function(new_label) {
    this._label_text = new_label;
    this._sprites.label.text(new_label);
    this._redraw_label();

    return this;
  }

  ,_redraw_label: function() {
    var label = this._sprites.label;
    var attrs = {};

    attrs.w = this._measure_text(label.text());
    attrs.h = this._label_font_size;

    label.attr( attrs );

    attrs.x = SCREEN.center_in_x(label._w, this) + this._label_offset.x;
    attrs.x += this.is_down ? this._label_fudge.x : 0;
    attrs.y = SCREEN.center_in_y(label._h, this) + this._label_offset.y;
    attrs.y += this.is_down ? this._label_fudge.y : 0;

    label.attr( attrs );
  }

  ,setSprite: function(sprite_name) {
    this._sprite_name = sprite_name;
    this._redraw_sprite();
  }

  ,_redraw_sprite: function() {
    var self = this;
    _([ this._sprites.main, this._sprites.lock ]).each(function(sprite){
      sprite.removeComponent( 'pushbutton_'+self._sprite_name )
        .addComponent( 'pushbutton_'+self._sprite_name )
        .attr({ x: self._x, y: self._y, w: self._w, h: self._h });
    })
    this._sprites.lock.sprite(2, 0);
  }

  ,setLock: function(is_locked) {
    if ( !this.is_frozen && is_locked != this.is_locked ) {
      this._sprites.lock.tween( { x: this._x + (is_locked ? 0 : this._w ) }, 15 );
    }
    this.is_locked = is_locked;
  }

  ,press: function() {
    if ( !this.is_locked && !this.is_frozen ) {
      this.is_down = true;
      this._sprites.main.sprite(1, 0);
      this._redraw_label();
      this.trigger( 'ButtonDown' );
    }
  }

  ,release: function() {
    if ( !this.is_locked && !this.is_frozen && !this.is_latch ) {
      this.is_down = false;
      this._sprites.main.sprite(0, 0);
      this._redraw_label();
      this.trigger( 'ButtonUp' );
    }
  }

  ,freeze: function(){
    this.is_frozen = true;
    return this;
  }

  ,unfreeze: function() {
    this.is_frozen = false;
    return this;
  }

  ,_measure_text: function(text) {
    var ctx = Crafty.canvas.context;
    ctx.font = this._label_font_size + 'px ' + this._label_font;
    return ctx.measureText(text).width;
  }
});
