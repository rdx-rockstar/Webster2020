const router = require('express').Router();
const passport = require('passport');

router.get('/auth/google',passport.authenticate('google',{
    scope: ['profile']
}));

router.get('/auth/google/redirect',(req,res) => {
    res.redirect('/home');
})

module.exports = router;