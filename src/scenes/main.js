Crafty.scene("main", function() {
  var sw_toggle = Crafty.e( 'ToggleSwitch' )
    .switchType('small_toggle')
    .attr({ x: SCREEN.center_in_x(100), y: SCREEN.center_in_y(100), z: Layer.SPRITES,
            w: 100, h: 100 });
});
