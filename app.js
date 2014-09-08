var express = require('express'),
	app = express(),
	settings = require('./settings'),
	post = require('./routes/post'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),

	session = require('express-session'),
	RedisStore = require('connect-redis')(session),

	csrf = require('csurf'),

	db = require('./models/db');


//middleware
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// csrf対策
app.use(cookieParser());
app.use(session({resave: true,saveUninitialized: false, secret: '929nfwamicl'}));
app.use(csrf());
app.use(function(req,res,next) {
	res.locals.csrftoken = req.csrfToken();
	next();
});

app.use(logger('dev'));

//routing
app.get('/',post.index);
app.get('/posts/:id([0-9]+)',post.show);
app.get('/posts/:id([0-9]+).json',post.json);
app.get('/posts/new',post.new);
app.post('/posts/create',post.create);
app.get('/posts/:id/edit',post.edit);
app.put('/posts/:id',post.update);
app.delete('/posts/:id',post.destroy);

app.use(function(err,req,res,next) {
	res.send(err.message);
});

// module.exports = app;

app.listen(settings.port);
console.log('server starting...');
