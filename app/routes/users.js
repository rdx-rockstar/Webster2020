const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');


router.get('/users/:id',isLoggedIn,(req,res) => {
  User.findById(req.params.id).populate("posts").exec(function(err,foundUser){
    if(err){
      console.log(err);
      return res.render('error');
    }
    else{
      var name = foundUser.username.split(" ");
      return res.render('games',{name:name,user:foundUser});
    }
  })
});

router.get('/users/:id/stream',isLoggedIn,function(req,res){
  User.findById(req.params.id,function(err,foundUser){
    if(err){
      console.log(err);
      return res.render('error');
    } else {
      return res.render('stream',{user:foundUser});
    }
  })
});

router.get('/users/:id/chat',isLoggedIn,function(req,res){
  User.findById(req.params.id,function(err,foundUser){
    if(err){
      console.log(err);
      return res.render('error');
    } else {
      return res.render('chatbox',{user:foundUser});
    }
  })
});
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  return res.redirect('/home');
}

module.exports = router;
