var map = {};

$(function() {
  map.render = function(data) {
    $('#console').html(data.view[data.point[0]][data.point[1]]);
    var canvas = $('#field');
    var cc = canvas[0].getContext('2d')
    var cellSize = 10;
    cc.clearRect(0,0,canvas.width(),canvas.height());

    var view = data.view;
    for (var x=0; x<view.length; x++) {
      for (var y=0; y<view[x].length; y++) {
        if (view[x][y] == undefined) {
          continue;
        }
        switch (view[x][y]) {
        case 0:
          cc.fillStyle = 'green';
          break;
        case 1:
          cc.fillStyle = 'darkslategray';
          break;
        default:
          cc.fillStyle = 'black';
          break;
        }
        cc.fillRect(
          x * cellSize,
          y * cellSize,
          cellSize,
          cellSize);
      }
    }
    cc.fillStyle = 'red';
    cc.fillRect(
      data.point[0] * cellSize,
      data.point[1] * cellSize,
      cellSize,
      cellSize);
  };

});
