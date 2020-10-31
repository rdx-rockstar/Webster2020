// dotenv for securing important keys.
require('dotenv').config()


// Requiring dependencies and Strategies.
const createError    = require('http-errors'),
      express        = require('express'),
      path           = require('path'),
      cookieParser   = require('cookie-parser'),
      bodyParser     = require('body-parser'),
      mongoose       = require('mongoose'),
      session        = require('express-session'),
      passport       = require('passport'),
      logger         = require('morgan'), 
      LocalStrategy  = require('passport-local').Strategy,
      methodOverride = require("method-override");

//Requiring Routes.
const indexRouter = require('./routes/index'),
      homeRouter = require('./routes/home'),
      usersRouter = require('./routes/users'),
      localAuthRouter = require('./routes/local-auth'),
      googleAuthRouter = require('./routes/google-auth'),
      facebookAuthRouter = require('./routes/facebook-auth'),
      otherRoutes = require('./routes/others'),
      postRouter = require('./routes/posts');

// Initializing app
const app = express();

// Setting up our view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


//Connecting to MongoDB.
mongoose.connect('mongodb://localhost:27017/flick', {useNewUrlParser: true, useUnifiedTopology: true});

const connect = mongoose.connection;
connect.on('open',() => {
  console.log('Connected..');
});

//Requiring models.
const User = require('./models/userSchema');

passport.use(new LocalStrategy(User.authenticate()));

const Strategies= require('./strategies/passport-setup');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Telling express to use Routes
app.use('/',indexRouter);
app.use('/',homeRouter);
app.use('/',localAuthRouter);
app.use('/',googleAuthRouter);
app.use('/',facebookAuthRouter);
app.use('/',usersRouter);
app.use('/',otherRoutes);
app.use('/',postRouter);

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  return res.redirect('/home');
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("eroor 404");
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
///////////////////////////////////////Socket io


module.exports = app;
