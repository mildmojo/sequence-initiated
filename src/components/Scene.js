Crafty.c( 'Scene', {
  init: function() {
    return this;
  }

  ,callbacks: function(init_func, resize_func, destroy_func){
    this.initialize = init_func;
    this.resize     = resize_func;
    this.kill       = destroy_func;

    // Init & draw
    this.initialize();
    this.resize();

    // Need to save 'this' so it exists in resize_func when Crafty triggers it.
    var self    = this;
    var resizer = function(args){ self.resize(args) };

    // Redraw on window resize events
    Crafty.bind( 'WindowResize', resizer );
    this.bind( 'Remove', function(){
      Crafty.unbind( 'WindowResize', resizer );
      this.kill();
    });

    return this;
  }
});
