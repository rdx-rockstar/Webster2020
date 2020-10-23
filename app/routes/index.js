var express = require('express');
var router = express.Router();

/* GET index route. */
router.get('/', function(req, res) {
  res.redirect('/home');
});

module.exports = router;