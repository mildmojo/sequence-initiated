Crafty.scene("main", function() {
  var sw_toggle = Crafty.e( 'ToggleSwitch' )
    .attr({ x: SCREEN.center_in_x(52), y: SCREEN.center_in_y(52), z: Layer.SPRITES,
            w: 52, h: 52 })
    .switchType('small_toggle');
});
