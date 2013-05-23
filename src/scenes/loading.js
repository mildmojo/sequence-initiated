//the loading screen - that will be display while assets loaded
Crafty.scene("loading", function() {
  version = gameContainer.version();

  var assets = [
    'web/images/switches.png?v='+version+''
    ,'web/images/lights.png?v='+version+''
    ,'web/images/pushbutton_large.png?v='+version+''
    ,'web/images/dial_medium.png?v='+version+''
  ];

  // Touch events are not allowed to trigger the fullscreen API in Firefox Mobile.
  Crafty.touch.disable();

  var loadingText = Crafty.e("2D, DOM, Text")
      .attr({w: 500, h: 36, x: SCREEN.center_in_x(500), y: SCREEN.h_pct(0.25), z: Layer.HUD_FG})
      .text('Loading...')
      .textColor('#000')
      .textFont({ size: '36px', family: 'Russo One, Arial', weight: 'bold'})
      .textAlign('center')
      .bind('Click', function(){
        if ( BigScreen.enabled && isMobile.any ) {
          BigScreen.request( Crafty.stage.elem );
        }
        // Done with fullscreen API, reenable touch events.
        Crafty.touch.enable();
        SCREEN.fadeToBlack( 500, function(){
          _.delay( function(){ Crafty.scene( gameContainer.sceneName ) }, 500 );
        });
      });

  // load takes an array of assets and a callback when complete
  Crafty.load(assets,
    function() {
      initSprites();
      if ( BigScreen.enabled && isMobile.any ) {
        loadingText.text('Click!')
          .addComponent( 'Mouse, MouseHover' );
      } else {
        loadingText.trigger('Click');
      }
    },
    function(e) {
      loadingText.text('Loading ('+(e.percent.toFixed(0))+'%)');
    }
  );
});

function initSprites() {
  var version = gameContainer.version();
  Crafty.sprite(75, 'web/images/switches.png?v='+version+'', {
    switch_small_toggle: [0, 0]
  });
  Crafty.sprite(20, 'web/images/lights.png?v='+version+'', {
    lamp_red: [0, 0]
    ,lamp_green: [1, 0]
  });
  Crafty.sprite(100, 'web/images/pushbutton_large.png?v='+version+'', {
    pushbutton_large: [0, 0]
  });
  Crafty.sprite(100, 'web/images/pushbutton_medium_wide.png?v='+version+'', {
    pushbutton_medium_wide: [0, 0]
  });
  Crafty.sprite(75, 'web/images/dial_medium.png?v='+version+'', {
    dial_medium: [0, 0]
  });
}
