var express = require('express');
var router = express.Router();

const menu = require('../controller/menu.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/menu', menu.getMenu);
router.get('/category', menu.getCategory);

module.exports = router;
