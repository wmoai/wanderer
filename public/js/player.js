var player = {};

$(function() {

  player.create = function(callback) {
    $.ajax({
      url: "/player/create",
      type: "POST"
    }).done(function(data) {
      player.id = data.id;
      player.session = data.session;
      if (callback) callback();
    });
  };

  player.fieldView = function()  {
    $.ajax({
      url: "/player/view",
      type: "POST",
      data: {
        id : player.id,
        session : player.session
      }
    }).done(map.render);
  };

  player.move = function(e, callback) {
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
    $.ajax({
      url: "/player/move/" + path,
      type: "POST",
      data: {
        id : player.id,
        session : player.session
      }
    }).done(function(data) {
      if (callback) callback();
      map.render(data);
    });
  };

});

