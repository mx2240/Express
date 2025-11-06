var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.get('/contact', function (req, res, next) {
  res.send('respond with contact');
});


router.get('/About', function (req, res, next) {
  res.send('respond with a About');
});


module.exports = router;
