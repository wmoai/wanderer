$(function() {
  $.ajax({
    url: "/chara/create",
    type: "POST"
  }).done(function(chara) {
    $('#x').html(chara.loc[0]);
    $('#y').html(chara.loc[1]);
    $.ajax({
      url: "/chara/vision",
      data: {
        id : chara.id
      }
    }).done(function(vision) {
      var canvas = $('#field');
      var cc = canvas[0].getContext('2d')
      var cellSize = 10;
      cc.clearRect(0,0,canvas.width(),canvas.height());

      vision.map(function(cell) {
        switch (cell.height) {
          case 1:
          cc.fillStyle = 'green';
          break;
          case 2:
          cc.fillStyle = 'darkslategray';
          break;
        }
        cc.fillRect(
        cell.loc[0] * cellSize,
        cell.loc[1] * cellSize,
        cellSize,
        cellSize);
      });
    });
  });

  $('html').on('keyup', function(e) {
    switch(e.keyCode) {
      case 37:
        // socket.emit('move w');
      break;
      case 38:
        // socket.emit('move n');
      break;
      case 39:
        // socket.emit('move e');
      break;
      case 40:
        // socket.emit('move s');
      break;
    }
  });

});
