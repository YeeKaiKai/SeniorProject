var express = require('express');
var router = express.Router();

const chatgpt = require('../controller/customer/chatgpt.js');
const cart = require('../controller/customer/cart.js')
const custom = require('../controller/customer/custom.js')
const order = require('../controller/customer/order.js')
const menu = require('../controller/customer/menu.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/:restaurantName/chat', chatgpt.postDiagolue);
router.post('/:restaurantName/order', order.postCartToOrder);
router.post('/:restaurantName/cart', cart.postCart);

router.delete('/:restaurantName/cart', cart.deleteCart);

router.get('/:restaurantName/chat', chatgpt.getDialogue);
router.get('/:restaurantName/order', order.getOrder);
router.get('/:restaurantName/cart', cart.getCart);
router.get('/:restaurantName/menu', menu.getMenu);
router.get('/:restaurantName/category', menu.getCategory);
router.get('/:restaurantName/:food/customize', custom.getCustomizeOption);

router.patch('/:restaurantName/cart', cart.patchCart);


module.exports = router;
