// dotenv for securing important keys.
require('dotenv').config()

// Requiring dependencies and Strategies. 
const createError   = require('http-errors'),
      express       = require('express'),
      path          = require('path'),
      cookieParser  = require('cookie-parser'),
      bodyParser    = require('body-parser'), 
      mongoose      = require('mongoose'),
      session       = require('express-session'),
      passport      = require('passport'),
      logger        = require('morgan'),
      LocalStrategy = require('passport-local').Strategy;

//Requiring Routes.
const indexRouter = require('./routes/index'),
      usersRouter = require('./routes/users'),
      localAuthRouter = require('./routes/local-auth'),
      googleAuthRouter = require('./routes/google-auth'),
      facebookAuthRouter = require('./routes/facebook-auth');


const app = express();

// Setting up our view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


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

//Root Route
app.use('/', indexRouter);
app.use('/',localAuthRouter);
app.use('/',googleAuthRouter);
app.use('/',facebookAuthRouter);
app.use('/users', usersRouter);

app.get('/posts',(req,res) => {
  console.log(req.user);
  if(req.user){
    var name = req.user.username.split(" ");
  }
  else{
    var name = [""];
  }
  console.log(name);
  res.render('posts.ejs',{name:name,user:req.user});
});

app.get('/users/:id',(req,res) => {
  // if(req.isAuthenticated())
  // {
    User.findById(req.params.id,function(err,foundUser){
      if(err){
        console.log(err);
        return res.render('error');
      }
      else{
        var name = foundUser.username.split(" ");
        return res.render('games',{name:name,user:foundUser});
      }
    })
  // }else{
  //   return res.redirect('/register');
  // }
});

app.get('/users/:id/stream',function(req,res){
  User.findById(req.params.id,function(err,foundUser){
    if(err){
      console.log(err);
      return res.render('error');
    } else {
      return res.render('stream',{user:foundUser});
    }
  })
});

app.get('/users/:id/chat',function(req,res){
  User.findById(req.params.id,function(err,foundUser){
    if(err){
      console.log(err);
      return res.render('error');
    } else {
      return res.render('chatbox',{user:foundUser});
    }
  })
});

// Middleware
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  return res.redirect('/posts');
}

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
