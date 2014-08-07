module.exports = function() {

var size = 50;
var delta = 40;
var map = [];
for (var i=0; i<size; i++) {
  map[i] = [];
}

map[0][0] = parseInt(Math.random() * delta);
map[0][size-1] = parseInt(Math.random() * delta);
map[size-1][0] = parseInt(Math.random() * delta);
map[size-1][size-1] = parseInt(Math.random() * delta);

var mid = function(v1, v2, depth) {
  return parseInt((v1 + v2) / 2 + (Math.random() * delta / depth));
}
var test = function(start, end, depth) {
  if (end.x - start.x < 2 && end.y - start.y < 2) {
    return;
  }
  var mx = parseInt((start.x + end.x) / 2);
  var my = parseInt((start.y + end.y) / 2);

  map[mx][start.y] = mid(map[start.x][start.y], map[end.x][start.y], depth);
  map[start.x][my] = mid(map[start.x][start.y], map[start.x][end.y], depth);
  map[mx][my] = parseInt(
    (map[start.x][start.y] + map[end.x][start.y] + map[start.x][end.y] + map[end.x][end.y]) / 4
    + (Math.random() * delta / depth)
  );
  map[end.x][my] = mid(map[end.x][start.y], map[end.x][end.y], depth);
  map[mx][end.y] = mid(map[start.x][end.y], map[end.x][end.y], depth);

  test({
    x: start.x ,
    y: start.y
  }, {
    x: mx ,
    y: my
  }, depth+1);
  test({
    x: mx ,
    y: start.y
  }, {
    x: end.x ,
    y: my
  }, depth+1);
  test({
    x: start.x ,
    y: my
  }, {
    x: mx ,
    y: end.y
  }, depth+1);
  test({
    x: mx ,
    y: my
  }, {
    x: end.x ,
    y: end.y
  }, depth+1);
}
test({x:0,y:0},{x:size-1,y:size-1}, 1);

return map;
}
