const router = require('express').Router();
const User = require('../models/userSchema');

router.get('/about_us',(req,res) => {
    res.render('about.ejs');
});
  
router.get('/contacts',(req,res) => {
    res.render('contact.ejs');
});

router.get('/search',(req,res) => {
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        User.find({username: regex},function(err,foundUsers){
            if(err){
            console.log(err);
            return res.redirect("/home");
            }
            res.render('search',{foundUsers: foundUsers});
        })
    }
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
