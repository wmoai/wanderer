$(function() {
  var socket = io();
  $('#test').on('click',function() {
    socket.emit('test');
  });
});
