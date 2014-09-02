var _player = {};
$(function() {
  $.ajax({
    url: "/player/create",
    type: "POST"
  }).done(function(player) {
    _player.id = player.id;
    _player.session = player.session;
    vision();
  });


});

