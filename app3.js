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
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

function isAuthenticated(req, res, next) {
  var sess = req.session;
  if (sess.name) {
    next();
  } else {
    res.redirect('/');
  }
}

// Route
app.get('/', function(req, res, next) {
  console.log(req.sessionID);
  var sess = req.session;
  if (sess.name) {
    res.redirect('/app');
  } else {
    res.render('sign');
  }
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
    res.redirect('/app');
  });
});

app.get('/app', isAuthenticated, function(req, res, next) {
  res.render('app');
});


// error handler
app.use(function(err, req, res, next){
  res.status(500).send({
    'error' : {
      'message' : err.message
    }
  });
});

var io = require('socket.io')(server);
io.use(function(socket, next) {
  var handshake = socket.handshake;
    if(handshake.headers.cookie) {
      var cookie = handshake.headers.cookie;
      // var sessionID = Cookie.parse(cookie)['connect.sid'];
      // handshake.sessionID =  sessionID;
      console.log(cookie);
    } else {
      return next('not authenticated.', false);
    }
    next(null, true);
});

io.on('connection', function (socket) {
  console.log('connect');
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
