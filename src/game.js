gameContainer = {
    env : 'dev',
    gameVersion : '0.0.1',
    scene : 'main',
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

Crafty.modules({ 'crafty-debug-bar': 'DEV' }, function () {
  Crafty.debugBar.show();
});

var elem = document.getElementById("cr-stage");
if (elem.requestFullscreen) {
  elem.requestFullscreen();
} else if (elem.mozRequestFullScreen) {
  elem.mozRequestFullScreen();
} else if (elem.webkitRequestFullscreen) {
  elem.webkitRequestFullscreen();
}

// Based on http://craftycomponents.com/boilerplate
window.onload = function() {

  var version = gameContainer.version();

  var externals = {
    scripts: [
      'src/helpers.js?v='+version+''
      ,'src/components/MouseHover.js?v='+version+''
      ,'src/components/Text.js?v='+version+''
      ,'src/components/ToggleSwitch.js?v='+version+''
    ]
    ,scenes: [
      'src/scenes/loading.js?v='+version+'',
      'src/scenes/main.js?v='+version+'',
    ]
  }

  //start Crafty
  Crafty.init();
  Crafty.canvas.init();
  //Crafty.viewport.zoom(2);

  // Disable Crafty's keyboard handler while input boxes are focused.
  $(Crafty.stage.elem).on( 'focus', 'input', function(){
    Crafty.removeEvent( this, "keydown", Crafty.keyboardDispatch );
    Crafty.removeEvent( this, "keyup", Crafty.keyboardDispatch );
  });
  $(Crafty.stage.elem).on( 'blur', 'input', function(){
    Crafty.addEvent( this, "keydown", Crafty.keyboardDispatch );
    Crafty.addEvent( this, "keyup", Crafty.keyboardDispatch );
  });

  require(externals.scripts, function() {
    require(externals.scenes, function() {
      Crafty.scene('loading');
    });
  });
};
