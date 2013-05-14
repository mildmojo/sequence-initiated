Crafty.scene("level4", function() {
  Crafty.background('#CCC');

  SCREEN.cutToBlack();
  var scene = Crafty.e( 'Scene' ).callbacks( level4CreateUI, level4ResizeUI );
  scene._show_victory = level4ShowVictory;
});

// Create UI elements, add behaviors
function level4CreateUI() {
  var self = this;
  _(this).extend({
    left_label:         null
    ,right_label:       null
    ,left_toggles:      []
    ,right_toggles:     []
    ,lamp:              null
    ,toggle_count:      4
    ,toggle_width:      75
    ,lamp_width:        20
    ,button_width:      100
    ,readout_width:     60
    ,gauge_width:       75
    ,label_height:      20
    ,_system_energy:    0
    ,_system_entropy:   0
    ,_current_entropy:  0
    ,_gauge_factor:     3
  });

  // Create UI elements
  this.status = Crafty.e( 'DotMatrix' )
    .setup({ fontSize: 20 });

  this.left_label = Crafty.e( '2D, DOM, Text, Offscreen' )
    .textFont({ family: 'Russo One', size: this.label_height+'px' })
    .text('BASE');
  this.left_label.draw();

  this.right_label = Crafty.e( '2D, DOM, Text, Offscreen' )
    .textFont({ family: 'Russo One', size: this.label_height+'px' })
    .text('ENTROPY');
  this.right_label.draw();

  this.gauge = Crafty.e( 'RoundGauge' )
    .setup({ vals: { min: 0, max: 100 }, angles: { min: 0, max: -180 } });

  this.lamp = Crafty.e( '2D, Canvas, lamp_red' );

  this.launch_button = Crafty.e( 'PushButton' )
    .setup({ label: 'LAUNCH', fontSize: 16, sprite: 'large', latch: true })
    .bind( 'ButtonDown', function() { self._show_victory() } );

  for ( var i = 0; i < this.toggle_count / 2; i++ ) {
    // Base power
    this.left_toggles.push(
      Crafty.e( 'ToggleSwitch' )
        .switchType( 'small_toggle' )
        .bind( 'Toggle', function(is_on) {
          self._system_energy += is_on ? 40 : -40;
          if ( self._system_energy > 40 ) {
            self.status.write('INSUFFICIENT POWER. INCREASE ENTROPY.');
          }
        })
    );

    // Entropy
    this.right_toggles.push(
      Crafty.e( 'ToggleSwitch' )
        .switchType( 'small_toggle' )
        .bind( 'Toggle', function(is_on) {
          self._system_entropy += is_on ? 10 : -10;
        })
    );
  }

  // Gauge jitter
  this.bind( 'EnterFrame', _.throttle(function() {
    var entropy = Crafty.math.randomInt(1, self._system_entropy);
    entropy = Crafty.math.randomInt(0, 1) == 0 ? -entropy : entropy;
    self._current_entropy = entropy;
  }, 800) );

  // Simulation and gauge animation loop
  this.bind( 'EnterFrame', function() {
    var energy = self._system_energy;
    var entropy = self._current_entropy;
    var ready_for_launch = energy + entropy > 85;

    // Update UI with system state
    if ( !self.launch_button.is_frozen ) {
      self.launch_button.setLock( !ready_for_launch );
      self.lamp.sprite( ready_for_launch ? 1 : 0, 0 );

      // Animate gauge
      energy = Crafty.math.lerp( self.gauge.val(), energy + entropy, Timer.dt * self._gauge_factor )
      self.gauge.val( energy );
    }
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

  var width   = Math.round( toggle_width * 1.5 * (toggle_count / 2) + button_width + gauge_width * 1.5 );
  var height  = status_height * 1.5 + label_height + Math.round( toggle_width * 2.25 );
  var left    = SCREEN.center_in_x(width);
  var top     = SCREEN.center_in_y(height);

  // Arrange UI elements
  this.status.width(SCREEN.w_pct(0.88));
  this.status.attr({ x: SCREEN.center_in_x(this.status.w), y: top });
  top += status_height * 1.5;
  height -= status_height * 1.5;

  for ( var i = 0; i < toggle_count / 2; i++ ) {
    var toggle_y = top + label_height * 1.5 + i * toggle_width * 1.1;

    this.left_toggles[i].attr({ x: left, y: toggle_y,
                      w: toggle_width, h: toggle_width });
    this.right_toggles[i].attr({ x: left + toggle_width * 1.5, y: toggle_y,
                      w: toggle_width, h: toggle_width });
  }

  // TODO FIXME HACKS bad number here, make it calculated
  this.left_label.attr({ x: SCREEN.center_in_x(SCREEN.css_width(this.left_label), this.left_toggles[0].x + this.left_toggles[0].w / 2),
                         y: top, z: Layer.HUD_FG });
  this.right_label.attr({ x: SCREEN.center_in_x(SCREEN.css_width(this.right_label), this.right_toggles[0].x + this.right_toggles[0].w / 2),
                          y: top, z: Layer.HUD_FG });

  top += label_height * 1.5;

  this.launch_button
    .attr({ x: left + width - button_width, y: SCREEN.center_in_y(button_width, top + height / 2), z: Layer.SPRITES,
            w: button_width, h: button_width });

  this.gauge.attr({ x: left + toggle_width * 2.8, y: top + height / 2 - gauge_width * 0.8, w: gauge_width, h: gauge_width });

  this.lamp.attr({ x: SCREEN.center_in_x(lamp_width, left + toggle_width * 2.8 + gauge_width / 2),
                   y: top + height - gauge_width * 0.8,
                   w: lamp_width, h: lamp_width });

  SCREEN.fadeFromBlack(500);
  this.status.write('SEQUENCE INITIATED');
}

function level4ShowVictory() {
  this.launch_button.freeze();

  this.status
    .write( 'Sequence Complete.' )
    .bind( 'MidFinish', function(){
      SCREEN.fadeToBlack(1000, function() {
        _.delay( function() { Crafty.scene( 'level7' ) }, 500);
      });
    });
}
