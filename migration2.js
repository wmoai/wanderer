var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
;

mongoose.connect('mongodb://localhost/wanderer');

var MapSchema = new Schema({
  loc : [Number],
  geo : Number,
  eventId : Number
});
var Map = mongoose.model('Map', MapSchema);

// geo
//
// -1:dark
//
// 0:grass
// 1:forest
// 2:waste
// 3:desert
// 4:low Mt.
// 5:high Mt.
// 6:water
//
// 10:rock
// 12:snow
// 13:ice
// 14:cliff
//
// 31:damp
//
// 40:village
// 41:town
// 42:fortress
// 43:ruins
//

var setGeo = function(x,y,geo) {
  Map.findOne({loc: [x,y]})
  .exec(function(err, doc) {
    doc.geo = geo;
    doc.save(function(err) {
    });
  });
}

var savemap = function(x,y) {
  var size = 100;
  var map = new Map;
  map.loc = [x,y];
  map.geo = 0;
  map.save(function(err) {
    if (err) {
      console.log(err);
      return;
    }
    if (x == size-1) {
      if (y == size-1) {
        console.log('end');
        setGeo(50,50,1);
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
savemap(0,0);

var setGeo = function(x,y,geo) {
  Map.findOne({loc: [x,y]})
  .exec(function(err, doc) {
    doc.geo = geo;
    doc.save(function(err) {
    });
  });
}


