const router = require('express').Router();
const passport = require('passport');

router.get('/auth/facebook',passport.authenticate('facebook'));

router.get('/auth/facebook/redirect',passport.authenticate('facebook',{
    failureRedirect:'/posts'
}),function(req,res){
    // console.log(req);
    res.redirect('/posts');
})

module.exports = router;