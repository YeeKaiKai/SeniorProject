var express = require('express');
var router = express.Router();

const chatgpt = require('../controller/customer/chatgpt.js');
const cart = require('../controller/customer/cart.js')
const custom = require('../controller/customer/custom.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/chat', chatgpt.postDiagolue);
router.get('/chat/:customerID', chatgpt.getDialogue);

router.get('/cart', cart.getCart);
router.post('/cart', cart.postCart);
router.delete('/cart', cart.deleteCart);
router.patch('/cart', cart.patchCart);

router.post('/custom', custom.postOrderCustomOption);


module.exports = router;
