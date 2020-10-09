const router = require('express').Router();
const passport = require('passport');

router.get('/auth/google',passport.authenticate('google',{
    scope: ['profile']
}));

router.get('/auth/google/redirect',passport.authenticate('google',{
    failureRedirect:'/register'
}),function(req,res){
    // console.log(req);
    res.redirect('/home');
})

module.exports = router;