var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , server = require('http').createServer(app).listen(3000)

  , User = require('./model/user');
;

// Midleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: String(Math.random())
}))

function isAuthenticated(req, res, next) {
  var sess = req.session;
  if (sess.name) {
    next();
  } else {
    next(new Error('not authenticated.'));
  }
}

// Route
app.get('/', isAuthenticated, function(req, res, next) {
  var sess = req.session;
  console.log(sess);
  res.send('ok');
});
app.post('/signup', function(req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  User.create(name, password, function(error, user) {
    if (error) return next(error);
    res.send(user);
  });
});
app.post('/signin', function(req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  User.auth(name, password, function(error, user) {
    if (error) return next(error);
    var sess = req.session;
    sess.name = name;
    res.send(user);
  });
});


// error handler
app.use(function(err, req, res, next){
  res.status(500).send({
    'error' : {
      'message' : err.message
    }
  });
});

// var io = require('socket.io')(server);
// io.on('connection', function (socket) {
  // console.log('connect');
  // socket.emit('news', { hello: 'world' });
  // socket.on('my other event', function (data) {
    // console.log(data);
  // });
// });
