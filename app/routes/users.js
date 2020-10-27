const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const liveUser = require('../models/liveUserSchema');


router.get('/users/:id',isLoggedIn,(req,res) => {
  User.findById(req.params.id).populate("posts").exec(function(err,foundUser){
    if(err){
      console.log(err);
      return res.render('error');
    }
    else{
      var name = foundUser.username.split(" ");
      return res.render('selfPosts',{name:name,user:foundUser});
    }
  })
});
router.get('/games/:id',isLoggedIn,(req,res) => {
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
router.get('/users/hoststream/:id',(req,res) => {
  //liveUser.remove({},function(err,currentUser){});
  User.findById(req.params.id,function(err,foundUser){
    if(err){
      console.log(err);
      return res.render('error');
    } else {
          var name = foundUser.username.split(" ");
          var pic=foundUser.googleProfilePicture;
          var email = foundUser.email;
          var l=email.length;
      liveUser.findOne({"username":email.substring(0,l-10)},function(err,currentUser){
        if(err){
            console.log(err);
        }
        if(!currentUser)
        {
          currentUser = new liveUser({
            username : email.substring(0,l-10),
            lable:"testing",
            pic:pic,
            thumbnail:"lol",
            uid:foundUser._id,
            name:name[0],
          });
          currentUser.save(function(err){
            if (err) return console.error(err);
          });
          console.log("dn dnana dn");
        }
        else{
          console.log("already there");
        }
        console.log(currentUser);
        var room=email.substring(0,l-10);
        return res.render('hostStream',{name:name,room:room,user:foundUser});
    })
      /*window.onbeforeunload = function(){
      liveUser.findById(currentUser._id,function(err,foundUser){
        foundUser.remove();
        console.log("live user succussfully removed!");
      }
      );
      };*/
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
  }
  })
});

router.get('/users/livestreams/:id',function(req,res){
User.findById(req.params.id,function(err,foundUser){
  if(err){
    return res.render('error');
  } else {
    var name = foundUser.username.split(" ");
    var liveU=[];
    liveUser.find({},function(err,users){
    var i;
    console.log("live users :"+users.length);
    for (i = 0; i < users.length; i++) {
      console.log(users[i].name);
      liveU.push([users[i].username,users[i].lable,users[i].name,users[i].thumbnail]);
    }
    console.log("in list  "+liveU.length);
    return res.render('liveStreams',{name:name,user:foundUser,live:liveU});
    });
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
