const createError   = require('http-errors'),
      express       = require('express'),
      path          = require('path'),
      cookieParser  = require('cookie-parser'),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),
      passport      = require('passport'),
      logger        = require('morgan'),
      localStrategy = require('passport-local');
//Requiring Routes
const indexRouter = require('./routes/index'),
      usersRouter = require('./routes/users');

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
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Root Route
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/home',(req,res) => {
  res.render('home_page');
});

//Authentication Routes

//Registration route
app.get('/register',function(req,res){
    res.render('signup');
});

app.post('/register',(req,res) => {
  console.log(req.body);
  // console.log(req.body.password);

  var newUser = new User({username: req.body.username});
  User.register(newUser,req.body.password,function(err,newlyCreatedUser){
    console.log(newlyCreatedUser);
    if(err){
      console.log(err);
      return res.render('signup');
    }
    passport.authenticate('local')(req,res,()=>{
      console.log(newlyCreatedUser);
      res.redirect('/home');
    })
  })
})

//Login Route
app.get('/login',(req,res) => {
  res.render('login');
});

app.post('/login',passport.authenticate('local',{
    successRedirect: "/home",
    failureRedirect: "/login"
}));

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
