const router = require('express').Router(),
      fs = require('fs'),
      upload = require('../multer'),
      cloudinary = require('../strategies/cloudinary');

const Post = require('../models/postSchema'),
      Comment = require('../models/commentSchema'),
      User = require('../models/userSchema');      

router.get('/posts/new',isLoggedIn,function(req,res){
    res.render('new.ejs',{user: req.user});
});
  
router.post('/posts',upload.array('file'),async (req,res) => {
    const uploader = async (path) => await cloudinary.uploads(path,'Posts');
    try{
        const urls = [];
        const files = req.files;
        for(const file of files){
            const {path} = file;
            const newPath = await uploader(path);
            console.log(newPath)
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        console.log(urls);
        var post = new Post({
            videoURL: urls[0].url,
            thumbnail: urls[1].url,
            caption: req.body.caption,
            createdBy:{
            id: req.user._id,
            email: req.user.email
            } 
        });
        User.findById(req.user._id,(er,currentUser) => {
            if(er){
            console.log(er);
            return res.redirect('/register');
            }
            Post.create(post, function(err, post) {
            console.log("PoSt");
            console.log(post);
            if (err) {
                console.log(err);
                return res.send("Error Occured");
            }
            console.log(currentUser);
                currentUser.posts.unshift(post);
                currentUser.save();
                res.redirect('/users/' + currentUser._id);
            });
        })
    }catch(e){
        console.log(e);
        res.status(405).json({
            err: "not uploaded",
        })
    }
});
  
router.get('/posts/:id',(req,res) =>{
    Post.findById(req.params.id).populate("comments").exec(function(err,post){
        if(err){
            console.log(err);
            return res.status(404).json({
            message: "Something went wrong"
            });
        }
        res.render('onepostShow.ejs',{user:req.user,post:post});
    })
});
  
router.post('/posts/:id/newComment',(req,res) => {
    console.log(req.body);
    Post.findById(req.params.id,(err,post) => {
        if(err){
            console.log(err);
            return res.redirect('/posts/'+post._id);
        }
        var newComment = {
            author: {
            id: req.user._id,
            email: req.user.email
            },
            message: req.body.message
        };
        Comment.create(newComment,(error,comment) => {
            if(error){
            console.log(error);
            return res.redirect('/posts/' + post._id);
            }
            post.comments.unshift(comment);
            post.save();
            return res.send({
            msg: 'hello'
            });
        })
    })
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    return res.redirect('/home');
}

module.exports = router;