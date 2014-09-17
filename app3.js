var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , sessionStore = new session.MemoryStore
  , server = require('http').createServer(app).listen(3000)
  , User = require('./model/user');
;

var COOKIE_SECRET = "test";
var COOKIE_KEY = "sid";

// Midleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  name: COOKIE_KEY ,
  secret: COOKIE_SECRET,
  store: sessionStore
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
      var cookie = require('cookie').parse(handshake.headers.cookie);
      cookie = require('cookie-parser/lib/parse').signedCookies(cookie, COOKIE_SECRET);
      var sid = cookie[COOKIE_KEY];
      sessionStore.get(sid, function(err, session) {
        if (!err && session) {
          handshake.session = session;
          next();
        } else {
          return next('not authenticated.', false);
        }
      });
    } else {
      return next('not authenticated.', false);
    }
});

io.on('connection', function(socket) {
  console.log('connect');
  socket.on('test', function () {
    console.log(socket.handshake.session);
  });
});



