Crafty.c( 'SevenSegment', {
  init: function(){
    requires( '2D, Canvas, Text, text-seven-segment' );
    return this;
  }

  ,digits: function(new_digitsize){
    if ( new_val !== undefined ) {
      this._digitsize = new_digitsize;
    }
    return this;
  }

  ,val: function(new_val){
    if ( new_val !== undefined ) {
      this._value = new_val;
    }
    return this._value;
  }

});
