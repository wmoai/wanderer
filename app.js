var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
;

mongoose.connect('mongodb://localhost/wanderer');

var MapSchema = new Schema({
  loc : [Number],
  height : Number,
  eventId : Number
});
var Map = mongoose.model('Map', MapSchema);


var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
app.listen(3000);
function handler (req, res) {
  fs.readFile(__dirname + '/index.html', function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var charas = [];

io.on('connection', function (socket) {
  var chara = {
    loc : [51,51]
  };
  charas[socket.id] = chara;
  socket.on('disconnect', function () {
    delete charas[socket.id];
  });

  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

  var getField = function(callback) {
    var range = 5;
    Map.find({'loc': {'$near' : chara.loc}})
    .select('loc height -_id')
    .limit(Math.pow(range*2+1,2))
    .exec(function(err, docs) {
      result = {
        field : docs
      , center : chara.loc
      , range : range
      }

      callback(err, result);
    });
  };

  var renderMap = function() {
    var range = 5;
    Map.find({'loc': {'$near' : chara.loc}})
    .select('loc height -_id')
    .limit(Math.pow(range*2+1,2))
    .exec(function(err, docs) {
      result = {
        field : docs
      , center : chara.loc
      , range : range
      }
      socket.emit('field', result);
      event();
    });
  }

  var event = function() {
    Map.findOne({'loc': chara.loc})
    .exec(function(err, doc) {
      if (doc.height == 2) {
        socket.emit('event', {
          msg: "forest"
        });
      }
    });
  }

  // 0 - 254
  var move = function(dx, dy) {
    var tx = chara.loc[0] + dx;
    var ty = chara.loc[1] + dy;
    if (tx >= 0 && tx < 255 && ty >= 0 && ty < 255) {
      chara.loc[0] = tx;
      chara.loc[1] = ty;
      renderMap();
    }
  }

  socket.on('field', function() {
    renderMap();
  });

  socket.on('move n', function() {
    move(0,-1);
  });
  socket.on('move w', function() {
    move(-1,0);
  });
  socket.on('move e', function() {
    move(1,0);
  });
  socket.on('move s', function() {
    move(0,1);
  });

});

