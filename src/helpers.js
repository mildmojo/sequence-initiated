// helpers.js

var DEG_TO_RAD = ( 2.0 * Math.PI ) / 360;
var RAD_TO_DEG = 360 / ( 2.0 * Math.PI );

var GameConfig = {};

var Layer = {
  LINKS:    25
  ,INPUT:   20
  ,HUD_FX:  12
  ,HUD_FG:  10
  ,HUD_BG:  9
  ,EFFECTS: 7
  ,SPRITES: 5
  ,BG:      0
};

// Based on:
// http://www.colourlovers.com/palette/926559/blip_on_the_radar
var Colors = {
  BG:         '#002526'
  ,LIGHTER1:  '#2A5E44'
  ,LIGHTER2:  '#477A43'
  ,FG_DARK:   '#688C42'
  ,FG:        '#B8CC60'
}

function clampVal( val, min, max ) {
  val < min && (val = min);
  val > max && (val = max);
  return val;
}

var SCREEN = {
  WIDTH:   0
  ,HEIGHT: 0
  ,_mask:  null

  ,init: function() {
    $(window).on( 'resize', SCREEN.resize_callback );
    SCREEN._setupProportionalCanvas();
  }

  ,resize_callback: function(){
    SCREEN._setupProportionalCanvas();
    if ( SCREEN.is_portrait() ) {
      SCREEN.fadeToBlack(500, function(){
        Crafty.pause(true);
      });
    } else {
      Crafty.pause(false);
      SCREEN.fadeFromBlack(250);
    }
    Crafty.trigger( 'WindowResize' );
  }

  // Based on http://buildnewgames.com/mobile-game-primer/
  ,_setupProportionalCanvas: function() {
    var $container = $("#cr-stage");
    var $canvas    = $(Crafty.stage.elem);
    SCREEN.HEIGHT  = window.innerHeight;
    SCREEN.WIDTH   = window.innerWidth;

    $container.css('height',SCREEN.HEIGHT*2);
    window.scrollTo(0,1);

    $canvas.attr({width: SCREEN.WIDTH, height: SCREEN.HEIGHT});
    SCREEN.HEIGHT = window.innerHeight + 2
    $container.css({ height: SCREEN.HEIGHT, width: SCREEN.WIDTH, padding: 0, margin: 0});

    var canvasH = $canvas.attr('height'),
        canvasW = $canvas.attr('width'),
        maxHeightMult = SCREEN.HEIGHT / canvasH,
        maxWidthMult = SCREEN.WIDTH / canvasW,
        multiplier = Math.min(maxHeightMult, maxWidthMult),
        destH = canvasH * multiplier,
        destW = canvasW * multiplier;

    $canvas.css({
      position: 'absolute',
      height: destH,
      width: destW,
      left: SCREEN.WIDTH / 2 - destW / 2,
      top: 0
    });
  }

  // Expects a screen height percentage as a decimal. Returns percent of screen height.
  ,h_pct: function(pct) {
    return SCREEN.HEIGHT * pct;
  }

  // Expects a screen width percentage as a decimal. Returns percent of screen width.
  ,w_pct: function(pct) {
    return SCREEN.WIDTH * pct;
  }

  ,center_in_x: function(val) {
    return SCREEN.origin().x - val / 2;
  }

  ,center_in_y: function(val) {
    return SCREEN.origin().y - val / 2;
  }

  ,css_width: function(elem) {
    // console.log($(elem._element).css('width'));
    return $(elem._element).width();
  }

  ,css_height: function(elem) {
    // console.log($(elem._element).css('height'));
    return $(elem._element).height();
  }

  ,origin: function() {
    return { x: SCREEN.WIDTH / 2, y: SCREEN.HEIGHT / 2 };
  }

  ,is_portrait: function() {
    return SCREEN.WIDTH < SCREEN.HEIGHT;
  }

  ,is_landscape: function(){
    return SCREEN.WIDTH > SCREEN.HEIGHT;
  }

  // Fade to black over duration millisecs
  ,fadeToBlack: function( duration, callback ) {
    SCREEN._doFadeBlack( 0.0, 1.0, duration, callback );
  }

  // Fade from black to clear over duration millisecs
  ,fadeFromBlack: function( duration, callback ) {
    SCREEN._doFadeBlack( 1.0, 0.0, duration, callback );
  }

  // Fade a black layer from startAlpha to endAlpha over duration millisecs
  ,_doFadeBlack: function( startAlpha, endAlpha, duration, callback ) {
    var frame_count = parseInt( ( duration / 1000 ) * Crafty.timer.getFPS() );
    console.log(frame_count);
    SCREEN._mask = SCREEN._mask || Crafty.e( '2D, DOM, Tween, Color, Persist' );
    SCREEN._mask.attr({
        x: 0,
        y: 0,
        w: SCREEN.WIDTH,
        h: SCREEN.HEIGHT,
        z: Layer.HUD_FX,
        alpha: startAlpha
      })
      .color( 'black' )
      .tween({ alpha: endAlpha }, frame_count );

    if ( typeof callback == 'function' )
      _.delay( callback, duration );
  }

};

// Gets called by Crafty's EnterFrame event, so needs to refer to
//   'Timer' instead of 'this'
var Timer = {
  _lastTick:  null
  ,dt:        0

  ,init: function() {
    Crafty.bind( 'EnterFrame', Timer.tick );
  }

  ,tick: function() {
    now = new Date;

    if ( Timer._lastTick == null ) Timer._lastTick = now;

    Timer.dt = (now - Timer._lastTick) / 1000;
    Timer._lastTick = now;
  }

  ,now: function() { return new Date; }
};
