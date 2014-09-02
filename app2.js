var express = require('express')
  , app = express()
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , bodyParser = require('body-parser')
  , crypto = require('crypto')
;

mongoose.connect('mongodb://localhost/wanderer');
var MapSchema = new Schema({
  loc : [Number],
  geo : Number,
  eventId : Number
});
var Map = mongoose.model('Map', MapSchema);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(3000);

var players = [];

// var test = require('./generateMap');
// app.get('/test', function(req, res) {
  // res.send(test());
// });


app.get('/', function(req, res) {
  res.render('index');
});

// create playercter
app.post('/player/create', function(req, res) {
  var sha1sum = crypto.createHash('sha1')
  sha1sum.update(String(Math.random()));
  var session = sha1sum.digest('hex');
  var player = {
    id : players.length,
    loc : [51,51],
    session : session,
    range : 6
  };
  players.push(player);
  res.send({
    id : player.id,
    session : player.session,
    range : player.range
  });
});

var authPlayer = function(id, session) {
  var player = players[id];
  if (!player) {
    throw new Error('404 : id notfound '+id);
  }
  if (player.session != session) {
    throw new Error('403');
  }
  return player;
}

var view = function(req, res) {
  var player = authPlayer(req.body.id, req.body.session);
  Map.find({
    'loc': {
      '$within': {
        '$center': [player.loc, player.range]
      }
    }
  })
  .exec(function(err, docs) {
    var result = [];
    docs.map(function(doc) {
      var x = doc.loc[0] - player.loc[0] + player.range;
      var y = doc.loc[1] - player.loc[1] + player.range;
      if (result[x] == undefined) {
        result[x] = [];
      }
      result[x][y] = doc.geo;
    });
    res.send({
      view : result,
      point : [player.range, player.range]
    });
  });
}
app.post('/player/view', view);

app.post('/player/move/:dir', function(req, res) {
  var player = authPlayer(req.body.id, req.body.session);
  switch (req.params.dir) {
  case 'w':
    player.loc[0]--;
    break;
  case 'n':
    player.loc[1]--;
    break;
  case 'e':
    player.loc[0]++;
    break;
  case 's':
    player.loc[1]++;
    break;
  }
  view(req, res);
});


