Crafty.scene("level4", function() {
  Crafty.background('#CCC');

  SCREEN.fadeFromBlack(500, function() {
    var scene = Crafty.e( 'Scene' ).callbacks( level4CreateUI, level4ResizeUI );
    scene._show_victory = level4ShowVictory;
  })
});

// Create UI elements, add behaviors
function level4CreateUI() {
  var self = this;
  _(this).extend({
    left_label: null
    ,right_label: null
    ,left_toggles: []
    ,right_toggles: []
    ,lamp: null
    ,toggle_count: 4
    ,toggle_width: 100
    ,lamp_width: 30
    ,button_width: 150
    ,readout_width: 60
    ,gauge_width: 105
    ,label_height: 20
    ,_system_energy: 0
    ,_system_entropy: 0
    ,_current_entropy: 0
    ,_gauge_factor: 3
  });

  // Create UI elements
  this.status = Crafty.e( 'DotMatrix' )
    .setup({ fontSize: 20 });

  this.left_label = Crafty.e( '2D, DOM, Text' )
    .textFont({ family: 'Russo One', size: this.label_height+'px' })
    .text('BASE');

  this.right_label = Crafty.e( '2D, DOM, Text' )
    .textFont({ family: 'Russo One', size: this.label_height+'px' })
    .text('ENTROPY');

  this.gauge = Crafty.e( 'RoundGauge' )
    .setup({ vals: { min: 0, max: 100 }, angles: { min: 0, max: -180 } });

  this.lamp = Crafty.e( '2D, Canvas, lamp_red' );

  this.launch_button = Crafty.e( 'PushButton' )
    .setup({ label: 'LAUNCH', fontSize: 24, sprite: 'large' })
    .bind( 'ButtonDown', function() { self._show_victory() } );

  for ( var i = 0; i < this.toggle_count / 2; i++ ) {
    this.left_toggles.push(
      Crafty.e( 'ToggleSwitch' )
        .switchType( 'small_toggle' )
        .bind( 'Toggle', function(is_on) {
          self._system_energy += is_on ? 40 : -40;
          if ( self._system_energy > 40 ) {
            self.status.write('Insufficient power. Increase entropy.');
          }
        })
    );

    this.right_toggles.push(
      Crafty.e( 'ToggleSwitch' )
        .switchType( 'small_toggle' )
        .bind( 'Toggle', function(is_on) {
          self._system_entropy += is_on ? 5 : -5;
        })
    );
  }

  this.bind( 'EnterFrame', _.throttle(function() {
    var entropy = Crafty.math.randomInt(1, self._system_entropy);
    entropy = Crafty.math.randomInt(0, 1) == 0 ? -entropy : entropy;
    self._current_entropy = entropy;
  }, 1000) );

  this.bind( 'EnterFrame', function() {
    var energy = self._system_energy;
    var entropy = self._current_entropy;
    var ready_for_launch = energy + entropy > 85;
    self.launch_button.setLock( !ready_for_launch );
    self.lamp.sprite( ready_for_launch ? 1 : 0, 0 );
    energy = Crafty.math.lerp( self.gauge.val(), energy + entropy, Timer.dt * self._gauge_factor )
    self.gauge.val( energy );
//console.log(energy);
  });
}

// Draw UI elements; called when window is resized.
function level4ResizeUI() {
  var toggle_width  = this.toggle_width;
  var toggle_count  = this.toggle_count;
  var lamp_width    = this.lamp_width;
  var button_width  = this.button_width;
  var status_height = this.status._h * 2;
  var gauge_width   = this.gauge_width;
  var label_height  = this.label_height;

  var width   = Math.round( toggle_width * (toggle_count / 2) + button_width + gauge_width * 1.5 );
  var height  = status_height + label_height + Math.round( toggle_width * 2.25 );
  var left    = SCREEN.center_in_x(width);
  var top     = SCREEN.center_in_y(height);

  // Arrange UI elements
  this.status.attr({ x: left, y: top });
  this.status.width(width);
  top += status_height;
  height -= status_height;

  // TODO FIXME HACKS bad number here, make it calculated
  this.left_label.attr({ x: left + 22,
                         y: top, z: Layer.HUD_FG });
  this.right_label.attr({ x: left + toggle_width, y: top, z: Layer.HUD_FG });

  top += label_height * 1.5;

  for ( var i = 0; i < toggle_count / 2; i++ ) {
    var toggle_y = top + i * toggle_width * 1.1;

    this.left_toggles[i].attr({ x: left, y: toggle_y,
                      w: toggle_width, h: toggle_width });
    this.right_toggles[i].attr({ x: left + toggle_width, y: toggle_y,
                      w: toggle_width, h: toggle_width });
  }

  this.launch_button
    .attr({ x: left + width - button_width, y: SCREEN.center_in_y(button_width, top + height / 2), z: Layer.SPRITES,
            w: button_width, h: button_width });

  this.gauge.attr({ x: left + toggle_width * 2.25, y: top + height / 2 - gauge_width * 0.8, w: gauge_width, h: gauge_width });

  this.lamp.attr({ x: SCREEN.center_in_x(lamp_width, left + toggle_width * 2.25 + gauge_width / 2),
                   y: top + height - gauge_width * 0.8,
                   w: lamp_width, h: lamp_width });

  this.status.write('SEQUENCE INITIATED');
}

function level4ShowVictory() {
  this.launch_button.setLock(true);

  this.status
    .write( 'Sequence Complete.' )
    .bind( 'MidFinish', function(){
      SCREEN.fadeToBlack(1000, function() { Crafty.scene( 'level1' ) });
    });
}
