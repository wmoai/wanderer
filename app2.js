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
app.use(bodyParser.urlencoded({ extended: false }))
app.listen(3000)

var charas = [];

var test = require('./generateMap');
app.get('/test', function(req, res) {
  res.send(test());
});


app.get('/', function(req, res) {
  res.render('index');
});

// create character
app.post('/chara/create', function(req, res) {
  var sha1sum = crypto.createHash('sha1')
  sha1sum.update(String(Math.random()));
  var session = sha1sum.digest('hex');
  var chara = {
    id : charas.length,
    loc : [51,51],
    session : session,
    range : 5
  };
  charas.push(chara);
  res.send({
    id : chara.id,
    session : chara.session,
    range : chara.range
  });
});

var authChara = function(id, session) {
  var chara = charas[id];
  if (!chara) {
    throw new Error('404');
  }
  if (chara.session != session) {
    throw new Error('403');
  }
  return chara;
}

var vision = function(req, res) {
  var chara = authChara(req.body.id, req.body.session);
  Map.find({
    'loc': {
      '$near' : chara.loc,
      '$maxDistance': chara.range
    }
  })
  .exec(function(err, docs) {
    var vision = [];
    for (var i=0; i<chara.range*2+1; i++) {
      vision[i] = [];
    }
    docs.map(function(doc) {
      vision[doc.loc[0] - chara.loc[0] + chara.range][doc.loc[1] - chara.loc[1] + chara.range]= doc.geo;
    });
    res.send({
      vision : vision,
      point : [chara.range, chara.range]
    });
  });
}
app.post('/chara/vision', vision);

app.post('/chara/move/:dir', function(req, res) {
  var chara = authChara(req.body.id, req.body.session);
  switch (req.params.dir) {
  case 'w':
    chara.loc[0]--;
    break;
  case 'n':
    chara.loc[1]--;
    break;
  case 'e':
    chara.loc[0]++;
    break;
  case 's':
    chara.loc[1]++;
    break;
  }
  vision(req, res);
});

