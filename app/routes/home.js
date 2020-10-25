var express = require('express');
var router = express.Router();
const Post = require('../models/postSchema');

/* GET home page. */
router.get('/home',(req,res) => {
  Post.find({},function(err,posts){
    if(err){
      console.log(err);
    } else {
      if(req.user){
        var name = req.user.username.split(" ");
      }
      else{
        var name = [""];
      }
      res.render('home.ejs',{name:name,user:req.user,posts:posts.reverse()});
    }
  })
});

module.exports = router;
