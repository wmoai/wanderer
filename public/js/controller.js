
$(function() {

  $('html').on('keyup', function(e) {
    var path = null;
    switch(e.keyCode) {
    case 37:
      path = 'w';
      break;
    case 38:
      path = 'n';
      break;
    case 39:
      path = 'e';
      break;
    case 40:
      path = 's';
      break;
    }
    if (path) {
      $.ajax({
        url: "/player/move/" + path,
        type: "POST",
        data: {
          id : _player.id,
          session : _player.session
        }
      }).done(renderMap);
    }
  });

});
