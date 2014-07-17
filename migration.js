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


var savemap = function(x,y) {
  var size = 255;
  var map = new Map;
  map.loc = [x,y];
  map.height = 1;
  map.save(function(err) {
    if (err) {
      console.log(err);
      return;
    }
    if (x == size-1) {
      if (y == size-1) {
        console.log('end');
        return;
      }
      x = 0;
      y++;
    } else {
      x++;
    }
    savemap(x,y);
  });
}

Map.findOne({loc: [50,50]})
.exec(function(err, doc) {
  doc.height = 2;
  doc.save(function(err) {
  });
});
