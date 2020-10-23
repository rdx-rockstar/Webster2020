const router = require('express').Router();

router.get('/about_us',(req,res) => {
    res.render('about.ejs');
});
  
router.get('/contacts',(req,res) => {
    res.render('contact.ejs');
});

module.exports = router;
