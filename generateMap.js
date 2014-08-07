module.exports = function() {

  var size = 16;
  var rate = 5;
  var delta = 100;
  var oct = [];
  for (var x=0; x<size; x++) {
    oct[x] = [];
    for (var y=0; y<size; y++) {
      oct[x][y] = parseInt(Math.random() * delta);
    }
  }
  var map = [];
  for (var x=0; x<size*rate; x++) {
    map[x] = [];
    for (var y=0; y<size*rate; y++) {
      map[x][y] = oct[parseInt(x/rate)][parseInt(y/rate)];
    }
  }

  return map;
}
