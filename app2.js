var express = require('express')
  , app = express()
  , mongoose = require('mongoose')
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

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
// app.use(express.bodyParser());

app.listen(3000)

var charas = [];

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/chara/create', function(req, res) {
  var chara = {
    id : charas.length,
    loc : [51,51],
    range : 5
  };
  charas.push(chara);
  res.send(chara);
});
app.get('/chara/vision', function(req, res) {
  var chara = charas[req.query.id];
  if (!chara) {
    res.status(404);
    res.send(404);
    return;
  }
  Map.find({
    'loc': {
      '$near' : chara.loc,
      '$maxDistance': chara.range
    }
  })
  .select('loc height -_id')
  .exec(function(err, docs) {
    var vision = new Array;
    docs.map(function(doc) {
      vision.push({
        height: doc.height,
        loc: [
          doc.loc[0] - chara.loc[0] + chara.range,
          doc.loc[1] - chara.loc[1] + chara.range
        ]
      });
    });
    res.send(vision);
  });
});


