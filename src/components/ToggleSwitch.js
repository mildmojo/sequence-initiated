// Toggle switch.
Crafty.c( 'ToggleSwitch', {
  init: function() {
    this.requires( '2D, Canvas, Mouse, MouseHover' );
    this.value = false;
    self = this;
    this.bind( 'MouseDown', function(){ self._dragging = true; } );
    this.bind( 'MouseUp', function(){ self._dragging = false; this._last_drag = null; } );
    this.bind( 'MouseMove', this._drag );
    return this;
  }

  // Expects sprites defined as 'switch_type_name'. Accepts 'type_name' to
  // select the switch type.
  ,switchType: function(sw_type) {
    this.requires( 'switch_'+sw_type );
    this.origin('center');
    return this;
  }

  ,toggle: function() {
    console.log('flip!');
    this.setValue(!this.value);
  }

  ,setValue: function(new_val) {
    this.value = new_val;
    this.rotation = this.value ? 180 : 0;
    return this;
  }

  ,_drag: function(e) {
    if ( this._dragging ) {
      var nextY = e.clientY;
      var lastY = this._last_drag ? this._last_drag.clientY : nextY;
      var midpoint = this._origin.y + this.y;

      console.log([e.clientY,midpoint]);
      // Last drag was above the middle
      // This drag is at or below middle
      if ( lastY <= midpoint && nextY > midpoint ) {
        // Crossing midpoint going down
        this.setValue(false);
      } else if ( lastY > midpoint && nextY <= midpoint ) {
        // Crossing midpoint going up
        this.setValue(true);
      }
      this._last_drag = e;
    }
  }
});
