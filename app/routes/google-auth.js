const router = require('express').Router();
const passport = require('passport');

router.get('/auth/google',passport.authenticate('google',{
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}));

router.get('/auth/google/redirect',passport.authenticate('google',{
    failureRedirect:'/home'
}),function(req,res){
    res.redirect('/home');
})

module.exports = router;