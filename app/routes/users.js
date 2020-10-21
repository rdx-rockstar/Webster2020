var express = require('express');
var router = express.Router();
const User = require('../models/userSchema');


router.get('/users/:id',(req,res) => {
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
});

router.get('/users/:id/stream',function(req,res){
User.findById(req.params.id,function(err,foundUser){
  if(err){
    console.log(err);
    return res.render('error');
  } else {
    return res.render('stream',{user:foundUser});
  }
})
});

router.get('/users/:id/chat',function(req,res){
User.findById(req.params.id,function(err,foundUser){
  if(err){
    console.log(err);
    return res.render('error');
  } else {
    return res.render('chatbox',{user:foundUser});
  }
})
});

module.exports = router;
