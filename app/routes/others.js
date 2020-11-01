const router = require('express').Router();
const { post } = require('jquery');
const User = require('../models/userSchema');
const uploadImage = require('../multer').uploadImage;
const Post = require('../models/postSchema');
const cloudinary = require('../strategies/cloudinary');
const fs = require('fs');

router.get('/about_us',(req,res) => {
    res.render('about.ejs',{user:req.user});
});
  
router.get('/contacts',(req,res) => {
    res.render('contact.ejs',{user:req.user});
});

router.get('/following',isLoggedIn,(req,res) => {
    User.findById(req.user._id).populate("subscriptions").exec(function(err,user){
        if(err){
            console.log(err);
        }else{
            res.render('following.ejs',{user:user});
        }
    })
})
router.get('/followers',isLoggedIn,(req,res) => {
    User.findById(req.user._id).populate("followers").exec(function(err,user){
        if(err){
            console.log(err);
        }else{
            res.render('followers.ejs',{user:user});
        }
    })
})

router.get('/search',isLoggedIn,(req,res) => {
    console.log(req.user);
    if(req.query.search && req.user){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        User.find({username: regex},function(err,foundUsers){
            if(err){
            console.log(err);
            return res.redirect("/home");
            }
            Post.find({tags: regex},function(error1,foundPosts){
                if(error1){
                    console.log(error1);
                }else{
                    res.render('search',{currentUser: req.user,foundUsers: foundUsers,foundPosts: foundPosts});
                }
            })
        })
    }
    else{
        res.redirect('/home');
    }
})

router.get("/update-pic",isLoggedIn,(req,res) => {
    res.render('updateProfilePic.ejs',{user: req.user});
})

router.post("/update-pic",uploadImage.single('dp'),async (req,res) => {
    const uploader = async (path) => await cloudinary.uploads(path,'Posts');
    try{
        const file = req.file;
        const {path} = file;
        const newPath = await uploader(path);
        fs.unlinkSync(path);
        User.findById(req.user._id).populate("posts").exec(function(err,foundUser){
            if(err){
                console.log(err);
            }else{
                foundUser.profilePicture = newPath.url;
                foundUser.save();
                foundUser.posts.forEach(function(post){
                    post.createdBy.dp = newPath.url;
                    post.save();
                })
                return res.redirect('/home');
            }
        })
    } catch(e){
        console.log(e);
    }
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    return res.redirect('/home');
  }

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
