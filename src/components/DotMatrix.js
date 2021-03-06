Crafty.c( 'DotMatrix', {
  init: function() {
    var self = this;
    this.requires( '2D, DOM, Text' );

    _(this).extend({
      _is_animating:            false
      ,_font:                   'BPdotsSquaresRegular'
      ,_z:                      Layer.HUD_FG
      ,_ms_per_char:            30
      ,_ms_whole_message_pause: 2000
      ,_centered_space_count:   -1
    });

    // Initialize offscreen.
    this.text('&nbsp;');
    this.addComponent( 'Offscreen' );

    this.textFont({ family: this._font+', Courier, Serif' });
    this.css( 'text-transform', 'uppercase' );
    this.css( 'white-space', 'pre' );
    this.css( 'overflow', 'hidden' );
    this.css( 'padding', '5px' );
    // this.css( 'background', '#333333' );
    // this.css( 'color', '#EEB955' );
    //this.css( 'background', '#FFF' );
    this.css( 'color', '#000' );
    this.css( 'border', '3px solid black' );

    this.bind( 'EnterFrame', function(f){ self._animate(f) } );

    return this;
  }

  ,setup: function(attrs) {
    typeof attrs.width    !== 'undefined' && this.width( attrs.width );
    typeof attrs.fontSize !== 'undefined' && this.fontSize( attrs.fontSize );
    return this;
  }

  ,width: function(new_width) {
    if ( typeof new_width !== 'undefined' ) {
      // this.css( 'width', new_width+'px' );
      this._w = new_width + new_width % this._measure_text(' ');
    }
    // return SCREEN.css_width(this);
    return this._w;
  }

  ,fontSize: function(size) {
    this.textFont({ size: size+'px' });
    this._h = Math.round(size * 0.9);
  }

  ,write: function(new_text) {
    var self = this;
    var space_width = this._measure_text(' ');
    var space_count = Math.ceil( this._w / space_width );
    var text = '';

    this._text_body = new_text;

    // Add enough leading space to push the message out of the frame.
    while ( this._measure_text(text) < this._w ) {
      text += ' ';
    }
    text += new_text;
    this.text(text);

    // Box width minus message width divided by two spaces (one on each side)
    // gives leading space count when message is centered.
    this._centered_space_count =
      Math.floor( (this._w - this._measure_text(this._text_body)) / this._measure_text('  ') );

    // Start subtracting characters from the front of the string.
    this._start_animating();

    return this;
  }

  ,_start_animating: function() {
    this._reset_timer();
    this._is_animating = true;
  }

  ,_finish_animating: function() {
    // FinalFinish triggers after message clears the display (long messages).
    this.trigger( 'FinalFinish' );
    this._is_animating = false;
  }

  ,_animate: function(frame) {
    // Noop if we're not animating.
    if ( !this._is_animating ) return;

    if ( this._animation_pause() ) {
      // Just wait.
    } else {
      if ( this._whole_message_pause() ) {
        // Just wait.
      } else if ( this._buffer_empty() ) {
        this.text(' ');
        this._finish_animating();
      } else {
        this._scroll(1);
        this._reset_timer();
      }
    }
  }

  // Should pause before next character is scrolled away?
  ,_animation_pause: function() {
    return this._elapsed() < this._ms_per_char;
  }

  // Is the whole, unclipped message onscreen right now?
  ,_whole_message_onscreen: function() {
    var target_space_count = this._centered_space_count;
    var current_spaces = this._leading_space_count();

    // Fire the MidFinish event after the message pauses.
    if ( target_space_count >= 0 && current_spaces == target_space_count - 1 ) {
      this.trigger( 'MidFinish' );
    }

    return target_space_count >= 0 && current_spaces == target_space_count;
  }

  // Should pause while entire message is displayed?
  ,_whole_message_pause: function() {
    return this._whole_message_onscreen() && this._elapsed() < this._ms_whole_message_pause;
  }

  // Return the number of leading spaces left in the current display string.
  ,_leading_space_count: function() {
    return this.text().length - this._text_body.length;
  }

  ,_buffer_empty: function() {
    return _(this.text()).isEmpty();
  }

  ,_elapsed: function() {
    return Timer.now - this._timer_start;
  }

  // Scroll left by shaving a char off the front of the string.
  ,_scroll: function(char_count) {
    this.text( this.text().substr(char_count) );
  }

  ,_reset_timer: function() {
    this._timer_start = Timer.now;
  }

  ,_measure_text: function(text) {
    var ctx = Crafty.canvas.context;
    ctx.font = this._h+'px ' + this._font;
    return ctx.measureText(text).width;
  }
});
