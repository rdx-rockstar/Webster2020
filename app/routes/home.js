var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/home',(req,res) => {
  console.log(req.user);
  if(req.user){
    var name = req.user.username.split(" ");
  }
  else{
    var name = [""];
  }
  console.log(name);
  res.render('home.ejs',{name:name,user:req.user});
});

module.exports = router;
