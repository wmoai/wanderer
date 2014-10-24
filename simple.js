var express = require('express')
  , app = express()
  , server = require('http').createServer(app).listen(3000)
;
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

// Route
app.get('/', function(req, res, next) {
  res.render('app');
});

var map = require('./map');
var render = function(socket, room) {
  var pos = new Array;
  for (var i=0; i < map.array.length; i++) {
    pos[i] = new Array;
    for (var j=0; j < map.array[i].length; j++) {
      pos[i][j] = false;
    }
  }
  room.sockets.forEach(function(socket) {
    var p = socket.pos;
    if (p) {
      pos[p[0]][p[1]] = true;
    }
  });

  var param = {
    map: map.array,
    pos: pos
  };

  socket.emit('map', param);
  socket.broadcast.emit('map', param);
}

var move = function(socket, dir) {
  if (!socket.pos) {
    return;
  }
  var nx = socket.pos[0]
    , ny = socket.pos[1]
  ;
  switch (dir) {
    case 's':
      nx += 1;
    break;
    case 'n':
      nx -= 1;
    break;
    case 'e':
      ny += 1;
    break;
    case 'w':
      ny -= 1;
    break;
  }
  if (map.array[nx] && map.array[nx][ny] == "0") {
    socket.pos = [nx, ny];
  }
  render(socket, room);
}

var io = require('socket.io')(server);

var room = io.on('connection', function(socket) {
  console.log('connect');

  socket.on('init', function () {
    socket.pos = [0,0];
    render(socket, room);
  });

  socket.on('move', function (data) {
    move(socket, data.dir);
  });

  socket.on('disconnect', function (data) {
    render(socket, room);
  });

});


