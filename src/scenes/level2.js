Crafty.scene("level2", function() {
  Crafty.background('#CCC');

  SCREEN.fadeFromBlack(500, function() {
    var scene = Crafty.e( 'Scene' ).callbacks( level2CreateUI, level2ResizeUI );
    scene._show_victory = level2ShowVictory;
  })
});

// Create UI elements, add behaviors
function level2CreateUI() {
  var self = this;
  _(this).extend({
    upper_toggles: []
    ,lower_toggles: []
    ,upper_lights: []
    ,lower_lights: []
    ,readout: null
    ,toggle_count: 6
    ,toggle_width: 100
    ,light_width: 30
    ,button_width: 150
    ,readout_width: 60
    ,_system_energy: 0
  });

  // Create UI elements
  this.status = Crafty.e( 'DotMatrix' )
    .setup({ fontSize: 20 });

  this.readout = Crafty.e( 'SevenSegment, Offscreen' )
    .setup({ digits: 3, val: 0, fontSize: 36 });

  this.launch_button = Crafty.e( 'PushButton' )
    .setup({ label: 'LAUNCH', fontSize: 24, sprite: 'large', latch: true })
    .bind( 'ButtonDown', function() { self._show_victory() } );

  function toggle_lamp(lamp) {
    return function(is_on){ lamp.sprite(is_on ? 1 : 0, 0) };
  }

  function track_accumulator(is_on) {
    var value = 100 / self.toggle_count;
    self._system_energy += is_on ? value : -value;
    self.readout.val( Math.round(self._system_energy) );
    var ready_for_launch = Math.round( self._system_energy ) == 100;
    self.launch_button.setLock( !ready_for_launch );
    self.readout.setGoodValue( ready_for_launch );
  }

  for ( var i = 0; i < this.toggle_count / 2; i++ ) {
    var upper_light = Crafty.e( '2D, Canvas, lamp_red' );
    var lower_light = Crafty.e( '2D, Canvas, lamp_red' );

    this.upper_lights.push( upper_light );
    this.lower_lights.push( lower_light );

    this.upper_toggles.push(
      Crafty.e( 'ToggleSwitch' )
        .switchType( 'small_toggle' )
        .bind( 'Toggle', toggle_lamp(upper_light) )
        .bind( 'Toggle', track_accumulator )
    );
    this.lower_toggles.push(
      Crafty.e( 'ToggleSwitch' )
        .switchType( 'small_toggle' )
        .bind( 'Toggle', toggle_lamp(lower_light) )
        .bind( 'Toggle', track_accumulator )
    );
  }
}

// Draw UI elements; called when window is resized.
function level2ResizeUI() {
  var toggle_width  = this.toggle_width;
  var toggle_count  = this.toggle_count;
  var light_width   = this.light_width;
  var readout_width = this.readout_width;
  var button_width  = this.button_width;
  var status_height = this.status._h * 3;

  var width   = Math.round( (toggle_width + light_width / 2) * (toggle_count / 2)  + button_width );
  var height  = Math.round( toggle_width * 2.25 ) + status_height;
  var left    = SCREEN.center_in_x(width);
  var top     = SCREEN.center_in_y(height);

  // Arrange UI elements
  // this.status.attr({x: 20, y: 0});
  this.status.attr({ x: left, y: top });
  this.status.width(width);
  top += status_height;
  height -= status_height;

  for ( var i = 0; i < toggle_count / 2; i++ ) {
    var light_x = left + i * (toggle_width + light_width * 0.2);
    var toggle_x = light_x + light_width * 0.5;

    this.upper_toggles[i].attr({ x: toggle_x, y: top,
                      w: toggle_width, h: toggle_width });
    this.lower_toggles[i].attr({ x: toggle_x, y: top + toggle_width * 1.25,
                      w: toggle_width, h: toggle_width });
    this.upper_lights[i].attr({ x: light_x, y: top,
                      w: light_width, h: light_width });
    this.lower_lights[i].attr({ x: light_x, y: top + toggle_width * 1.25,
                      w: light_width, h: light_width });
  }

  this.readout.attr({ x: left + width - button_width, y: top });

  this.launch_button
    .attr({ x: left + width - button_width, y: top + height - button_width * 0.88, z: Layer.SPRITES,
            w: button_width, h: button_width });

  this.status.write('SEQUENCE INITIATED');
}

function level2ShowVictory() {
  this.launch_button.freeze();

  this.status
    .write( 'Sequence Complete.' )
    .bind( 'MidFinish', function(){
      SCREEN.fadeToBlack(1000, function() { Crafty.scene( 'level4' ) });
    });
}
