$(function() {
  var _chara = {};
  var renderMap = function(data) {
    $('#console').html(data.vision[data.point[0]][data.point[1]]);
    var canvas = $('#field');
    var cc = canvas[0].getContext('2d')
    var cellSize = 10;
    cc.clearRect(0,0,canvas.width(),canvas.height());

    var vision = data.vision;
    for (var x=0; x<vision.length; x++) {
      for (var y=0; y<vision[x].length; y++) {
        if (vision[x][y] == undefined) {
          continue;
        }
        switch (vision[x][y]) {
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
  var vision = function() {
    $.ajax({
      url: "/chara/vision",
      type: "POST",
      data: {
        id : _chara.id,
        session : _chara.session
      }
    }).done(renderMap);
  };
  $.ajax({
    url: "/chara/create",
    type: "POST"
  }).done(function(chara) {
    _chara.id = chara.id;
    _chara.session = chara.session;
    vision();
  });

  $('html').on('keyup', function(e) {
    var path = null;
    switch(e.keyCode) {
    case 37:
      path = 'w';
      break;
    case 38:
      path = 'n';
      break;
    case 39:
      path = 'e';
      break;
    case 40:
      path = 's';
      break;
    }
    if (path) {
      $.ajax({
        url: "/chara/move/" + path,
        type: "POST",
        data: {
          id : _chara.id,
          session : _chara.session
        }
      }).done(renderMap);
    }
  });

  $.ajax({
    url: "/test"
  }).done(function(data) {
    for (var x=0; x<data.length; x++) {
      for (var y=0; y<data[x].length; y++) {
        $('#test').append(
          $('<div>', { "class" : "cell" })
          .css({
            top: y*2,
            left: x*2,
            opacity: 1 * data[x][y] / 100
          })
        );
      }
    }
  });

});
