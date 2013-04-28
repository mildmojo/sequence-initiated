//the loading screen - that will be display while assets loaded
Crafty.scene("loading", function() {
  version = gameContainer.version();

  var assets = [
    'web/images/switches.png?v='+version+''
  ];
  // Monitor browser resize events, like mobile orientation changes.
  $(window).resize( _.debounce( SCREEN.resize_callback, 500 ) );

  SCREEN.init();
  Timer.init();

  // clear scene and interface
  sc = []; infc = [];

  var loadingText = Crafty.e("2D, DOM, Text")
      .attr({w: 500, h: 20, x: SCREEN.center_in_x(500), y: SCREEN.center_in_y(20), z: Layer.HUD_FG})
      .text('Loading...')
      .textColor('#000')
      .textFont({ size: '24px', family: 'Gruppo, Arial', weight: 'bold'})
      .textAlign('center');

console.log(assets);
  // load takes an array of assets and a callback when complete
  Crafty.load(assets,
    function() {
      initSprites();
      //when everything is loaded, run the main scene
      loadingText.destroy();
      if (gameContainer.scene != undefined) {
        Crafty.scene(gameContainer.scene);
      }
    },
    function(e) {
      loadingText.text('Loading ('+(e.percent.toFixed(0))+'%)');
    }
  );
});

function initSprites() {
  var version = gameContainer.version();
  Crafty.sprite(100, 'web/images/switches.png?v='+version+'', {
    switch_small_toggle: [0, 0]
  });
}
