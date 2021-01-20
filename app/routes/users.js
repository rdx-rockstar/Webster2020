const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const liveUser = require('../models/liveUserSchema');


router.get('/users/:id',isLoggedIn,(req,res) => {
  console.log(req.user);
  User.findById(req.params.id).populate("posts").exec(function(err,foundUser){
    if(err){
      console.log(err);
      return res.render('error');
    }
    else{
      var name = req.user.username.split(" ");
      return res.render('selfPosts',{name:name,currentUser: req.user,user:foundUser});
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
        var liveU=[];
        liveUser.find({},function(err,users){
          var i;
          console.log("live users :"+users.length);
          for (i = 0; i < users.length; i++) {
            console.log(users[i].name);
            liveU.push([users[i].username,users[i].lable,users[i].name,users[i].thumbnail,users[i].hashtags]);
          }
          console.log("in list  "+liveU.length);
          return res.render('stream',{name:name,streamer:foundstreamer,user:foundUser,live:liveU});        
  });
        
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
    var liveF=[];
    var fllwers=[];
    fllwers=foundUser.followers;
    liveUser.find({},function(err,users){
    var i;
    console.log("live users :"+users.length);
    for (i = 0; i < users.length; i++) {
      console.log(users[i].name);
      var flag=0;
      for(var j=0;j<fllwers.length;j++){
        if(users[i].uid==fllwers[j]){
          flag=1;
        }
      }
      if(flag){
      liveF.push([users[i].username,users[i].lable,users[i].name,users[i].thumbnail,users[i].hashtags]);
      }
      else{
        liveU.push([users[i].username,users[i].lable,users[i].name,users[i].thumbnail,users[i].hashtags]);
      }
    }
    console.log("in list  "+liveU.length);
    return res.render('liveStreams',{name:name,user:foundUser,live:liveU,livef:liveF});
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

router.post("/users/:id/subscribe",(req,res) => {
  User.findById(req.params.id,(err,user) => {
    if(err){
      console.log(err);
    }else{
      User.findById(req.body.id,(error,subscribedUser) => {
        if(error){
          console.log(error);
        }else{
          user.subscriptions.push(subscribedUser);
          subscribedUser.followers.push(user);
          user.save();
          subscribedUser.save();
          res.send({
            msg: "done"
          })
        }
      })
    }

  })
})
router.post("/users/:id/unsubscribe",(req,res) => {
  User.findById(req.params.id,(err,user) => {
    if(err){
      console.log(err);
    }else{
      User.findById(req.body.id,(error,unsubscribedUser) => {
        if(error){
          console.log(error);
        }else{
          var index1 = user.subscriptions.indexOf(unsubscribedUser._id);
          if(index1 > -1){
            user.subscriptions.splice(index1,1);
          }
          var index2 = unsubscribedUser.followers.indexOf(user._id);
          if(index2 > -1){
            unsubscribedUser.followers.splice(index2,1);
          }
          user.save();
          unsubscribedUser.save();
          res.send({
            msg: "done"
          })
        }
      })
    }

  })
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  return res.redirect('/home');
}

module.exports = router;
