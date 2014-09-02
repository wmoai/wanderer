$(function() {

  player.create(function() {
    player.fieldView();
  });

  $('html').on('keyup', function(e) {
    player.move(e, function() {
    });
  });

});

