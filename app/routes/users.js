var express = require('express');
var router = express.Router();
const User = require('../models/userSchema');
const liveUser = require('../models/liveUserSchema');


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
router.get('/users/stream/:streamer/:id',(req,res) => {
  User.findById(req.params.id,function(err,foundUser){
    if(err){
      console.log(err);
      return res.render('error');
    }
    else{
      var name = foundUser.username.split(" ");
      return res.render('stream',{name:name,streamer:streamer,user:foundUser});
    }
  })
});
router.get('/users/stream/:streamer/:id',(req,res) => {
  User.findById(req.params.id,function(err,foundUser){
    var name = req.params.streamer;
    liveUser.findOne({username: new RegExp('^'+name+'$', "i")}, function(err, foundstreamer) {
      if(err){
        console.log(err);
        return res.render('error');
      }
      else{
        var name = foundUser.username.split(" ");
        return res.render('stream',{name:name,streamer:foundstreamer,user:foundUser});
      }
    });
  })
});

router.get('/users/livestreams/:id',function(req,res){
User.findById(req.params.id,function(err,foundUser){
  if(err){
    console.log(err);
    console.log("at live stream error");
    return res.render('error');
  } else {
    
    var name = foundUser.username.split(" ");
    console.log("at live stream2");
    return res.render('liveStreams',{name:name,user:foundUser});
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
