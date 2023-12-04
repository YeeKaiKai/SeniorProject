var express = require('express');
var router = express.Router();

const order = require('../controller/owner/order.js');
const custom = require('../controller/owner/custom.js');
const category = require('../controller/owner/category.js');
const menu = require('../controller/owner/menu.js');
const restaurant = require('../controller/owner/restaurant.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/:restaurantName/category', category.postCategory);
router.post('/:restaurantName/custom', custom.postCustom);
router.post('/:restaurantName/menu', menu.postMenu);

router.delete('/:restaurantName/category', category.deleteCategory);
router.delete('/:restaurantName/custom', custom.deleteCustom);
router.delete('/:restaurantName/order', order.deleteOrder);
router.delete('/:restaurantName/menu', menu.deleteMenu);

router.get('/:restaurantName/category', category.getCategory);
router.get('/:restaurantName/category', category.getCategory);
router.get('/:restaurantName/custom', custom.getCustom);
router.get('/:restaurantName/order', order.getOrder);
router.get('/:restaurantName', restaurant.getRestaurantInfo);

router.patch('/:restaurantName/category', category.patchCategory);
router.patch('/:restaurantName/custom', custom.patchCustom);
router.patch('/:restaurantName/menu', menu.patchMenu);
router.patch('/:restaurantName/order/paid', order.patchPaid);
router.patch('/:restaurantName/order/ownerNote', order.patchOwnerNote);


module.exports = router;
