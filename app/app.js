// dotenv for securing important keys.
require('dotenv').config()


// Requiring dependencies and Strategies.
const createError   = require('http-errors'),
      express       = require('express'),
      path          = require('path'),
      fs            = require('fs'),
      cookieParser  = require('cookie-parser'),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),
      session       = require('express-session'),
      passport      = require('passport'),
      logger        = require('morgan'),
      upload        = require('./multer'),
      cloudinary    = require('./strategies/cloudinary'),
      Post          = require('./models/postSchema'),
      LocalStrategy = require('passport-local').Strategy;

//Requiring Routes.
const indexRouter = require('./routes/index'),
      homeRouter = require('./routes/home'),
      usersRouter = require('./routes/users'),
      localAuthRouter = require('./routes/local-auth'),
      googleAuthRouter = require('./routes/google-auth'),
      facebookAuthRouter = require('./routes/facebook-auth'),
      otherRoutes = require('./routes/others');

// Initializing app
const app = express();



// const upload = multer({
//   storage: storage,
//   limits: {
//     fieldSize: 300*1024*1024
//   },
//   fileFilter: function(req,file,cb){
//     checkFileTypes(file,cb);
//   }
// }).fields([
//   {name: 'file',maxCount: 2}
// ]);

// const upload = multer({
//   storage: storage,
//   limits: {
//     fieldSize: 300*1024*1024
//   },
//   fileFilter: function(req,file,cb){
//     checkFileTypes(file,cb);
//   }
// }).fields([
//   {name: 'thumbnail', maxCount: 1},
//   {name:'video', maxCount: 1}
// ]);






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
app.use('/', indexRouter);
app.use('/',homeRouter);
app.use('/',localAuthRouter);
app.use('/',googleAuthRouter);
app.use('/',facebookAuthRouter);
app.use('/', usersRouter);
app.use('/',otherRoutes);

app.get('/posts/new',isLoggedIn,function(req,res){
  res.render('new.ejs');
});

app.post('/posts',upload.array('file'),async (req,res) => {
  console.log(req.files);
  console.log("--------------------------");
  const uploader = async (path) => await cloudinary.uploads(path,'Posts');
  try{
    const urls = [];
    const files = req.files;
    for(const file of files){
      const {path} = file;
      const newPath = await uploader(path);
      console.log(newPath)
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    console.log(urls);
    var post = new Post({
      videoURL: urls[0].url,
      thumbnail: urls[1].url,
      caption: req.body.caption,
      createdBy:{
        id: req.user._id,
        email: req.user.email
      } 
    });
    User.findById(req.user._id,(er,currentUser) => {
      if(er){
        console.log(er);
        return res.redirect('/register');
      }
      Post.create(post, function(err, post) {
        console.log("PoSt");
        console.log(post);
        if (err) {
          console.log(err);
          return res.send("Error Occured");
        }
        console.log(currentUser);
          currentUser.posts.unshift(post);
          currentUser.save();
          res.redirect('/users/' + currentUser._id);
      });
    })
  }catch(e){
    console.log(e);
    res.status(405).json({
      err: "not uploaded",
    })
  }
  // cloudinary.uploader.upload(req.files, function(error, result) {
    
    
    
  // });
});

app.get('/posts/:id',(req,res) =>{
  Post.findById(req.params.id,function(err,post){
    console.log(post);
    if(err){
      console.log(err);
      return res.status(404).json({
        message: "Something went wrong"
      });
    }
    res.render('onepostShow.ejs',{post:post});
  })
});

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
