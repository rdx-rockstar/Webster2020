const router = require('express').Router();
const User = require('../models/userSchema');

router.get('/about_us',(req,res) => {
    res.render('about.ejs',{user:req.user});
});
  
router.get('/contacts',(req,res) => {
    res.render('contact.ejs',{user:req.user});
});

router.get('/following',(req,res) => {
    User.findById(req.user._id).populate("subscriptions").exec(function(err,user){
        if(err){
            console.log(err);
        }else{
            res.render('following.ejs',{user:user});
        }
    })
})
router.get('/followers',(req,res) => {
    User.findById(req.user._id).populate("followers").exec(function(err,user){
        if(err){
            console.log(err);
        }else{
            res.render('followers.ejs',{user:user});
        }
    })
})

router.get('/search',(req,res) => {
    console.log(req.user);
    if(req.query.search && req.user){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        User.find({username: regex},function(err,foundUsers){
            if(err){
            console.log(err);
            return res.redirect("/home");
            }
            res.render('search',{currentUser: req.user,foundUsers: foundUsers});
        })
    }
    else{
        res.redirect('/home');
    }
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
