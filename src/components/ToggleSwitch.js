// Toggle switch.
Crafty.c( 'ToggleSwitch', {
  init: function() {
    this.requires( '2D, Canvas, Mouse, MouseHover' );
    this.value = false;
    this._allow_click = false;
    self = this;
    this.bind( 'MouseDown', this._click );
    this.bind( 'MouseMove', this._drag );
    this.bind( 'MouseOut', this._reset_drag );
    this.bind( 'MouseUp', this._reset_drag )
    this._reset_drag();
    return this;
  }

  // Expects sprites defined as 'switch_type_name'. Accepts 'type_name' to
  // select the switch type.
  ,switchType: function(sw_type) {
    this.requires( 'switch_'+sw_type );
    this.origin('center');
    return this;
  }

  ,allowClick: function(is_allowed) {
    this._allow_click = is_allowed;
    return this;
  }

  ,toggle: function() {
    this.setValue(!this.value);
    return this.value;
  }

  ,setValue: function(new_val) {
    this.value = new_val;
    this.rotation = this.value ? 180 : 0;
    return this;
  }

  ,_click: function(e) {
    if ( this._allow_click ) {
      this.toggle();
    }
  }

  ,_drag: function(e) {
    // console.log(e);
    // console.log( SCREEN.mouseDown );
    if ( SCREEN.mouseDown ) {
      e.preventDefault();
      var nextY = e.clientY;
      var lastY = this._last_drag ? this._last_drag.clientY : nextY;
      var midpoint = this._origin.y + this.y;
      this._total_drag += nextY - lastY;
console.log(this._total_drag);
      // console.log([e.clientY, midpoint])
      // console.log(e.buttons);

      // Last drag was above the middle
      // This drag is at or below middle
      if ( Math.abs(this._total_drag) > 15 ) {
        this.setValue( this._total_drag < 0 );
      }
      // if ( lastY <= midpoint && nextY > midpoint ) {
      //   // Crossing midpoint going down
      //   this.setValue(false);
      // } else if ( lastY > midpoint && nextY <= midpoint ) {
      //   // Crossing midpoint going up
      //   this.setValue(true);
      // }
      // this._total_drag += nextY - lastY;
      this._last_drag = e;
      this._reset_drag();
    }
  }

  ,_reset_drag: _.debounce(function() {
    this._last_drag = null;
    this._total_drag = 0;
    console.log('reset!');
  }, 200)
});
