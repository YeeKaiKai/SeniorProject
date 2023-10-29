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

router.get('/:restaurantName/cart', cart.getCart);
router.post('/:restaurantName/cart', cart.postCart);
router.delete('/:restaurantName/cart', cart.deleteCart);
router.patch('/:restaurantName/cart', cart.patchCart);

router.get('/:restaurantName/:food/customize', custom.getCustomizeOption);



module.exports = router;
