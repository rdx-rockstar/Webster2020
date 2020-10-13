require('dotenv').config() //for .env file(package) (starting)(secrets,API) //nmp i dotenv

const createError   = require('http-errors'),
      express       = require('express'),  //frameWork (for node.js)
      path          = require('path'),
      cookieParser  = require('cookie-parser'), //cookie-session
      bodyParser    = require('body-parser'), //
      mongoose      = require('mongoose'),
      session       = require('express-session'),
      passport      = require('passport'),
      logger        = require('morgan'),
      LocalStrategy = require('passport-local').Strategy;

//Requiring Routes
const indexRouter = require('./routes/index'),
      usersRouter = require('./routes/users'),
      localAuthRouter = require('./routes/local-auth'),
      googleAuthRouter = require('./routes/google-auth'),
      facebookAuthRouter = require('./routes/facebook-auth');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/flick', {useNewUrlParser: true, useUnifiedTopology: true});

const connect = mongoose.connection;
connect.on('open',() => {
  console.log('Connected..');
});

//Requiring models
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

//Root Route
app.use('/', indexRouter);
app.use('/',localAuthRouter);
app.use('/',googleAuthRouter);
app.use('/',facebookAuthRouter);
app.use('/users', usersRouter);

app.get('/home',(req,res) => {
  if(req.isAuthenticated())
  {
    return res.render('home',{ username: 'xxx' });
  }
  return res.redirect('/register');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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

module.exports = app;
