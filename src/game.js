gameContainer = {
    env : 'prod',
    // env : 'dev',
    gameVersion : '0-0-1',
    sceneName : 'level2',
    scene : {},
    version: function() {
      var today = new Date();
      var version = gameContainer.gameVersion;
      // Fix for cache
      if(gameContainer.env == 'dev') {
        gameContainer._devVersion = gameContainer._devVersion || today.getDay()+"_"+ today.getHours() +"_"+today.getSeconds();
        version = gameContainer._devVersion;
      }
      return version;
    }
};

if ( gameContainer.env == 'dev' ) {
  Crafty.modules({ 'crafty-debug-bar': 'DEV' }, function () {
    Crafty.debugBar.show();
  });
}

// Based on http://craftycomponents.com/boilerplate
window.onload = function() {

  var version = gameContainer.version();

  var externals = {
    scripts: [
      'src/helpers.js?v='+version+''
      ,'src/components/Offscreen.js?v='+version+''
      ,'src/components/Scene.js?v='+version+''
      ,'src/components/MouseHover.js?v='+version+''
      ,'src/components/Text.js?v='+version+''
      ,'src/components/ToggleSwitch.js?v='+version+''
      ,'src/components/RotarySwitch.js?v='+version+''
      ,'src/components/PushButton.js?v='+version+''
      ,'src/components/SevenSegment.js?v='+version+''
      ,'src/components/DotMatrix.js?v='+version+''
    ]
    ,scenes: [
      'src/scenes/loading.js?v='+version+'',
      'src/scenes/main.js?v='+version+'',
    ]
  }

  //start Crafty
  Crafty.init();
  Crafty.canvas.init();
  Crafty.background('#FFFFFF');

  // This refuses to work.
  //Crafty.viewport.scale(2.0);

  Crafty.removeEvent( this, "keydown", Crafty.keyboardDispatch );
  Crafty.removeEvent( this, "keyup", Crafty.keyboardDispatch );

  // Disable Crafty's keyboard handler while input boxes are focused.
  // $(Crafty.stage.elem).on( 'focus', 'input', function(){
  //   Crafty.removeEvent( this, "keydown", Crafty.keyboardDispatch );
  //   Crafty.removeEvent( this, "keyup", Crafty.keyboardDispatch );
  // });
  // $(Crafty.stage.elem).on( 'blur', 'input', function(){
  //   Crafty.addEvent( this, "keydown", Crafty.keyboardDispatch );
  //   Crafty.addEvent( this, "keyup", Crafty.keyboardDispatch );
  // });

  require(externals.scripts, function() {
    require(externals.scenes, function() {
      Crafty.scene('loading');
    });
  });
};
