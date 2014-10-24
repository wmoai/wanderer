$(function() {
  var socket = io();

  $('html').on('keyup', function(e) {
    var dir = null;
    switch(e.keyCode) {
    case 37:
      dir = 'w';
      break;
    case 38:
      dir = 'n';
      break;
    case 39:
      dir = 'e';
      break;
    case 40:
      dir = 's';
      break;
    }
    if (dir) {
      socket.emit('move', {dir: dir});
    }
  });

  socket.on('map', function(data){
    var map = data.map;
    var mapstr = '';
    for (var x =0; x < map.length; x++) {
      var row = map[x];
      for (var y=0; y < row.length; y++) {
        if (data.pos[x][y]) {
          mapstr += "@";
        } else {
          switch (row[y]) {
            case "0":
              mapstr += "…";
            break;
            case "1":
              mapstr += "M";
            break;
            defalut:
              mapstr += row[y];
            break;
          }
        }
      }
      mapstr += '\n';
    }
    $('#field').html(mapstr);
  });


  socket.emit('init');
});
