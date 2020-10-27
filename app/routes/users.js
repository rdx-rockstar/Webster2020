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
//  liveUser.remove({},function(err,currentUser){
//     console.log("reoved all");
//   });
  User.findById(req.params.id,function(err,foundUser){
    if(err){
      console.log(err);
      return res.render('error');
    } else {
          var name = foundUser.username.split(" ");
          var email = foundUser.email;
          var l=email.length;
          var room=email.substring(0,l-10);
          return res.render('hostStream',{name:name,room:room,user:foundUser});
      
        }
  })
});
router.post('/users/adduser',(req,res)=>{
  liveUser.findOne({"username":req.body.username},function(err,currentUser){
    if(err){
        console.log(err);
    }
    if(!currentUser)
    {
      console.log(req.body);
      currentUser = new liveUser({
        username : req.body.username,
        lable:req.body.lable,
        pic:req.body.pic,
        thumbnail:req.body.thumbnail,
        uid:req.body.uid,
        name:req.body.name,
        hashtags:req.body.hashtags,
      });
      console.log("12 "+currentUser);
      currentUser.save(function(err){
        if (err) return console.error(err);
      });
      console.log("new stream added");
    }
    else{
      console.log("stream already there");
    }
    console.log("11 "+currentUser);
    var done={};
  return res.send(done);
})
})
router.post('/users/deluser',(req,res)=>{
  liveUser.remove({"username":req.body.username},function(err,currentUser){
    if(err){
      console.log(err);
  }
    if(currentUser){
      console.log("stream removed");
    }
    else{
      console.log("no stream to remove");
    }
  });
  var done={};
  return res.send(done);
})
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
      liveU.push([users[i].username,users[i].lable,users[i].name,users[i].thumbnail,users[i].hashtags]);
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
