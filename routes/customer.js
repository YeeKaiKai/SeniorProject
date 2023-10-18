var express = require('express');
var router = express.Router();

const cart = require('../controller/cart.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/cart', cart.getCart);
router.post('/cart', cart.postCart);
router.delete('/cart', cart.deleteCart);
router.patch('/cart', cart.patchCart);


module.exports = router;
