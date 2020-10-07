const createError   = require('http-errors'),
      express       = require('express'),
      path          = require('path'),
      cookieParser  = require('cookie-parser'),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),
      passport      = require('passport'),
      logger        = require('morgan'),
      LocalStrategy = require('passport-local'),
      GoogleStrategy= require('./strategies/passport-setup');
//Requiring Routes
const indexRouter = require('./routes/index'),
      usersRouter = require('./routes/users'),
      localAuthRouter = require('./routes/local-auth'),
      googleAuthRouter = require('./routes/google-auth');

//Requiring models
const User = require('./models/userSchema');

const app = express();

//Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/flick', {useNewUrlParser: true, useUnifiedTopology: true});

const connect = mongoose.connection;
connect.on('open',() => {
  console.log('Connected..');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
	secret: "hello kitty",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// app.use(LocalStrategy);

//Root Route
app.use('/', indexRouter);
app.use('/',localAuthRouter);
app.use('/',googleAuthRouter);
app.use('/users', usersRouter);

app.get('/home',(req,res) => {
  res.render('home_page');
});

// function isLoggedIn(req,res,next){
//   if(req.isAuthenticated())
//   {
//       return next();
//   }
//   res.redirect('/register');
// }


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
