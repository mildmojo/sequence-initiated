Crafty.scene("main", function() {
  var upper_toggles = [];
  var lower_toggles = [];
  var upper_lights = [];
  var lower_lights = [];
  var toggle_count = 4;
  var toggle_width = 100;
  var light_width  = 30;

  function toggle_lamp(lamp) {
    return function(is_on){ lamp.sprite(is_on ? 1 : 0, 0) };
  }

  for ( var i = 0; i < toggle_count; i++ ) {
    var upper_light = Crafty.e( '2D, Canvas, lamp_red' );
    var lower_light = Crafty.e( '2D, Canvas, lamp_red' );

    upper_lights.push( upper_light );
    lower_lights.push( lower_light );

    upper_toggles.push(
      Crafty.e( 'ToggleSwitch' )
        .switchType( 'small_toggle' )
        .bind( 'Toggle', toggle_lamp(upper_light) )
    );
    lower_toggles.push(
      Crafty.e( 'ToggleSwitch' )
        .switchType( 'small_toggle' )
        .bind( 'Toggle', toggle_lamp(lower_light) )
    );
  }

  Crafty.bind( 'WindowResize', function(){
    for ( var i = 0; i < toggle_count; i++ ) {
      var toggle_x = i * toggle_width + SCREEN.center_in_x(toggle_width * toggle_count);
      var light_x = toggle_x - toggle_width * 0.1;
      upper_toggles[i].attr({ x: toggle_x, y: SCREEN.center_in_y(toggle_width * 2), z: Layer.SPRITES,
                        w: toggle_width, h: toggle_width });
      lower_toggles[i].attr({ x: toggle_x, y: SCREEN.center_in_y(toggle_width * 2.25) + toggle_width * 1.25, z: Layer.SPRITES,
                        w: toggle_width, h: toggle_width });
      upper_lights[i].attr({ x: light_x, y: SCREEN.center_in_y(toggle_width * 2), z: Layer.SPRITES,
                        w: light_width, h: light_width });
      lower_lights[i].attr({ x: light_x, y: SCREEN.center_in_y(toggle_width * 2.25) + toggle_width * 1.25, z: Layer.SPRITES,
                        w: light_width, h: light_width });

    }
  });
  Crafty.trigger( 'WindowResize' );
});
