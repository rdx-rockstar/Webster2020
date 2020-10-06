const router = require('express').Router();
const passport = require('passport');
const User = require('../models/userSchema');

//Authentication Routes

//Registration route
router.get('/register',function(req,res){
    res.render('signup');
});

router.post('/register',(req,res) => {

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
router.get('/login',(req,res) => {
  res.render('login');
});

router.post('/login',passport.authenticate('local',{
    successRedirect: "/home",
    failureRedirect: "/login"
}));

router.get('/logout',function(req,res){
    req.logout();
    res.redirect('/register');
})


module.exports = router;