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
  var size = 100;
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
// savemap(0,0);

var saveHeight = function(x,y) {
  Map.findOne({loc: [x,y]})
  .exec(function(err, doc) {
    doc.height = 2;
    doc.save(function(err) {
    });
  });
}
saveHeight(50,50);


