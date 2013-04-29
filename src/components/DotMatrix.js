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
      ,_on_finish:              null
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
    this.css( 'border', '1px solid black' );

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
      this.css( 'width', new_width+'px' );
    }
    return SCREEN.css_width(this);
  }

  ,fontSize: function(size) {
    this.textFont({ size: size+'px' });
    this._h = Math.round(size * 0.9);
    //this.css( 'height', Math.round(size*0.5)+'px' );
    console.log([this.css('height'), this._h]);
  }

  ,write: function(new_text, callback) {
    // Prepend number of spaces equal to _w
    // enable scroll
    var self = this;
    var space_width = this._measure_text(' ');
    var space_count = Math.ceil( SCREEN.css_width(this) / space_width );
    var text = '';

    this._text_body = new_text;

    // Add enough leading space to push the message out of the frame.
    while ( this._measure_text(text) < SCREEN.css_width(this) ) {
      text += ' ';
    }
    text += new_text;
    this.text(text);

    // Box width minus message width divided by two spaces (one on each side)
    // gives leading space count when message is centered.
    this._centered_space_count =
      Math.floor( (SCREEN.css_width(this) - this._measure_text(this._text_body)) / this._measure_text('  ') );

    // Setup a callback to fire after message pause (short msgs) or after
    // message clears the display (long messages)
    this._on_finish = callback;

    this._start_animating();
  }

  ,_start_animating: function() {
    this._reset_timer();
    this._is_animating = true;
  }

  ,_finish_animating: function() {
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
    var current_spaces = this.text().length - this._text_body.length;

    return target_space_count > 0 && current_spaces == target_space_count;
  }

  // Should pause while entire message is displayed?
  ,_whole_message_pause: function() {
    return this._whole_message_onscreen() && this._elapsed() < this._ms_whole_message_pause;
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
