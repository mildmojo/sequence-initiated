// Based on http://craftycomponents.com/boilerplate
window.onload = function() {

  var version = null;
  var today = new Date();

  // Fix for cache
  if(gameContainer.env == 'dev') {
    version = today.getDay()+"_"+ today.getHours() +"_"+today.getSeconds();
  } else {
    version = gameContainer.gameVersion;
  };

  var externals = {
    scripts: [
    ]
    ,assets: [
    ]
    ,components: [
      "src/components/MouseHover.js?v="+version+"",
      "src/entities/base/BaseEntity.js?v="+version+"",
    ]
    ,scenes: [
    ]
  }

  //start Crafty
  Crafty.init(800, 600);
  Crafty.canvas.init();

  require(externals.scripts, function() {
    //the loading screen - that will be display while assets loaded
    Crafty.scene("loading", function() {
      // clear scene and interface
      sc = []; infc = [];

      var loadingText = Crafty.e("2D, Canvas, Text")
          .attr({w: 500, h: 20, x: ((Crafty.viewport.width) / 2), y: (Crafty.viewport.height / 2), z: 2})
          .text('Loading...')
          .textColor('#000')
          .textFont({'size' : '24px', 'family': 'Arial'});

      // load takes an array of assets and a callback when complete
      Crafty.load(externals.assets, function() {
        // array with local components
          //when everything is loaded, run the main scene
          require(externals.components, function() {
            loadingText.destroy();
            if (gameContainer.scene != undefined) {
              Crafty.scene(gameContainer.scene);
            }
          });
      },
      function(e) {
        loadingText.text('Loading ('+(e.percent.toFixed(0))+'%)');
      });
    });

    // declare all scenes
    var scenes = [
      // === SCENES HERE ===
      "src/scenes/main.js?v="+version+"",
    ];

    require(scenes, function(){});

    $(window).on('resize', setupProportionalCanvas);

    //automatically play the loading scene
    Crafty.scene("loading");
  });
};


// Based on http://buildnewgames.com/mobile-game-primer/
function setupProportionalCanvas() {
  var $container = $("#cr-stage");
  var $canvas = $(Crafty.stage.elem);
  var h = window.innerHeight;
  var w = window.innerWidth;

  $container.css('height',h*2);
  window.scrollTo(0,1);

  $canvas.attr({width: w, height: h});
  h = window.innerHeight + 2
  $container.css({ height: h, width: w, padding: 0, margin: 0});

  var canvasH = $canvas.attr('height'),
      canvasW = $canvas.attr('width'),
      maxHeightMult = h / canvasH,
      maxWidthMult = w / canvasW,
      multiplier = Math.min(maxHeightMult, maxWidthMult),
      destH = canvasH * multiplier,
      destW = canvasW * multiplier;

  $canvas.css({
    position: 'absolute',
    height: destH,
    width: destW,
    left: w / 2 - destW / 2,
    top: 0
  });
}
