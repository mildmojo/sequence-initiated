Crafty.c( 'SevenSegment', {
  init: function(){
    this.requires( '2D, DOM, Text' );
    this._z = Layer.SPRITES;
    this._good_color = '#00EE00';
    this._bad_color  = '#EE0000';
    this.textColor(this._bad_color);
    this.textFont({ family: 'DigitaldreamFatNarrowRegular, Impact, Helvetica, Arial' });
    this.css( 'background', '#111' );

    return this;
  }

  ,setup: function(attrs) {
    typeof attrs.digits   !== 'undefined' && this.digits( attrs.digits );
    typeof attrs.val      !== 'undefined' && this.val( attrs.val );
    typeof attrs.fontSize !== 'undefined' && this.fontSize( attrs.fontSize );
    return this;
  }

  ,fontSize: function(new_fontsize) {
    this.textFont({ size: new_fontsize + 'px' });
    this.css( 'padding', Math.round( new_fontsize / 6 ) );
  }

  ,digits: function(new_digitsize){
    if ( typeof new_digitsize !== 'undefined' ) {
      this._digitsize = new_digitsize;
      this.val(this._value);
    }
    return this._digitsize;
  }

  ,setGoodValue: function(is_good) {
    this.textColor( is_good ? this._good_color : this._bad_color );
    return this;
  }

  ,val: function(new_val){
    if ( typeof new_val !== 'undefined' ) {
      this._value = this._pad( new_val, this._digitsize );
      this.text(this._value);
    }
    return this._value;
  }

  ,_pad: function(val, length) {
    var s = val+'';
    length = typeof length === 'undefined' ? 1 : length;
    s = s.slice( -length );
    while (s.length < length) s = "0" + s;
    return s;
  }

});
