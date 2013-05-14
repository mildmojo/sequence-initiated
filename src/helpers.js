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
  ,LABELS:  6
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
  WIDTH:        533
  ,HEIGHT:      320
  ,scale:       1
  ,realOffsetX: 0
  ,realOffsetY: 0
  ,mouseDown:   false
  ,_origin_obj: null
  ,_mask:       null
  ,_reminder:   null

  ,init: function() {
    // Map window resize events to Crafty WindowResize triggers
    Crafty.addEvent( Crafty, window, 'resize', _.throttle( SCREEN.resize_callback, 500 ) );
    Crafty.bind( 'SceneChange', SCREEN.resize_callback );

    $(window).on( 'mousedown', function(){ SCREEN.mouseDown = true } );
    $(window).on( 'mouseup',   function(){ SCREEN.mouseDown = false } );
    SCREEN.resize_callback();
  }

  // On window resize, reset the viewport scale
  ,resize_callback: function(){
    SCREEN._set_scale();

    if ( SCREEN.is_portrait() ) {
      SCREEN._update_reminder();
      SCREEN.fadeToBlack(500, function() {
        Crafty.pause(true)
      });
    } else if ( Crafty.isPaused() ) {
      Crafty.pause(false);

      SCREEN._destroy_reminder();
      SCREEN.fadeFromBlack(250);
    }

    // Adjust canvas to new window size and scale contents if necessary
    Crafty.viewport.reload();
    Crafty.viewport.absoluteScale( SCREEN.scale );

    Crafty.trigger( 'WindowResize' );
  }

  ,_set_scale: function() {
    switch (true) {
      case SCREEN.realHeight > SCREEN.HEIGHT:
        // Recalculate scale & offset, keep virtual window centered horizontally
        SCREEN.scale = SCREEN.realHeight / SCREEN.HEIGHT;
        SCREEN.realOffsetX = ( SCREEN.realWidth - SCREEN.scaleWidth ) / 2;
        SCREEN.realOffsetY = 0;
        break;
      case SCREEN.realWidth > SCREEN.WIDTH:
        // Recalculate scale & offset, keep virtual window centered vertically
        SCREEN.scale = SCREEN.realWidth / SCREEN.WIDTH;
        SCREEN.realOffsetX = 0;
        SCREEN.realOffsetY = ( SCREEN.realHeight - SCREEN.scaleHeight ) / 2;
        break;
      default:
        SCREEN.scale = 1
        SCREEN.realOffsetX = ( SCREEN.realWidth - SCREEN.scaleWidth ) / 2;
        SCREEN.realOffsetY = ( SCREEN.realHeight - SCREEN.scaleHeight ) / 2;
        break;
    }
  }

  ,_create_reminder: function() {
    return Crafty.e( '2D, DOM, Text, Offscreen' )
      .textFont({ family: 'Russo One, Impact, Sans', size: '36px' })
      .textColor('#FFFFFF')
      .text('Please turn your screen sideways.')
      .css( 'padding', '10px' )
      .css( 'text-align', 'center' )
      .attr({ x: 0, y: SCREEN.realHeight * 0.25, z: Layer.LINKS,
              w: SCREEN.realWidth * 0.95, h: SCREEN.realHeight / 2 });
  }

  ,_update_reminder: function() {
    SCREEN._reminder = SCREEN._reminder || SCREEN._create_reminder();

    $(SCREEN._reminder._element)
      .width(SCREEN.realWidth * 0.95)
      .height(SCREEN.realHeight / 2);
  }

  ,_destroy_reminder: function() {
    if ( SCREEN._reminder ) {
      SCREEN._reminder.destroy();
      SCREEN._reminder = null;
    }
  }

  // Expects a screen height percentage as a decimal. Returns percent of screen height.
  ,h_pct: function(pct) {
    return SCREEN.HEIGHT * pct;
  }

  // Expects a screen width percentage as a decimal. Returns percent of screen width.
  ,w_pct: function(pct) {
    return SCREEN.WIDTH * pct;
  }

  ,center_in_x: function(val, relative_to_obj) {
    var x = SCREEN.realWidth / 2 / SCREEN.scale;
    var w = 0;

    if ( typeof relative_to_obj !== 'undefined' ) {
      switch (true) {
        case relative_to_obj.hasOwnProperty( '_x' ):
          x = relative_to_obj._x;
          w = relative_to_obj._w;
          break;
        case relative_to_obj.hasOwnProperty( 'x' ):
          x = relative_to_obj.x;
          w = relative_to_obj.w;
          break;
        case typeof relative_to_obj === 'number':
          x = relative_to_obj;
          break;
      }
    }

    return (( x + w / 2 ) - val / 2);
  }

  ,center_in_y: function(val, relative_to_obj) {
    var y = SCREEN.realHeight / 2 / SCREEN.scale;
    var h = 0;

    if ( typeof relative_to_obj !== 'undefined' ) {
      switch (true) {
        case relative_to_obj.hasOwnProperty( '_y' ):
          y = relative_to_obj._y;
          h = relative_to_obj._h;
          break;
        case relative_to_obj.hasOwnProperty( 'y' ):
          y = relative_to_obj.y;
          h = relative_to_obj.h;
          break;
        case typeof relative_to_obj === 'number':
          y = relative_to_obj;
          break;
      }
    }

    return ( y + h / 2 ) - val / 2;
  }

  ,css_width: function(entity) {
    return $(entity._element).width();
  }

  ,css_height: function(entity) {
    return $(entity._element).height();
  }

  ,measure_text: function(text, font, size) {
    var ctx = Crafty.canvas.context;
    ctx.font = size+'px ' + font;
    return ctx.measureText(text).width;
  }

  ,origin: function() {
    return { x: SCREEN.WIDTH / 2, y: SCREEN.HEIGHT / 2 };
  }

  ,is_portrait: function() {
    return SCREEN.realWidth < SCREEN.realHeight;
  }

  ,is_landscape: function(){
    return SCREEN.realWidth >= SCREEN.realHeight;
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
    var frame_count = Math.floor( ( duration / 1000 ) * Crafty.timer.getFPS() );
    SCREEN._mask = SCREEN._mask || Crafty.e( '2D, DOM, Color, Persist' );
    SCREEN._mask.attr({
        x: 0,
        y: 0,
        w: SCREEN.realWidth*2,
        h: SCREEN.realHeight*2,
        z: Layer.HUD_FX,
        alpha: startAlpha
      })
      .color( 'black' );

    // Animate outside of Crafty because Crafty may be paused.
    $(SCREEN._mask._element).animate({ opacity: endAlpha }, duration);

    if ( typeof callback == 'function' )
      _.delay( callback, duration );
  }

};

// Gets called by Crafty's EnterFrame event, so needs to refer to
//   'Timer' instead of 'this'
var Timer = {
  _lastTick:  null
  ,now:       new Date()
  ,dt:        0

  ,init: function() {
    Crafty.bind( 'EnterFrame', Timer.tick );
  }

  ,tick: function() {
    Timer.now = Timer.realNow();

    if ( Timer._lastTick == null ) Timer._lastTick = Timer.now;

    Timer.dt = (Timer.now - Timer._lastTick) / 1000;
    Timer._lastTick = Timer.now;
  }

  ,realNow: function() { return new Date(); }
};
SCREEN.__defineGetter__( 'scaleWidth',  function(){ return SCREEN.WIDTH * SCREEN.scale } );
SCREEN.__defineGetter__( 'scaleHeight', function(){ return SCREEN.HEIGHT * SCREEN.scale } );
SCREEN.__defineGetter__( 'realWidth',   function(){ return window.innerWidth } );
SCREEN.__defineGetter__( 'realHeight',  function(){ return window.innerHeight } );
