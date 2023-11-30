var express = require('express');
var router = express.Router();

const order = require('../controller/owner/order.js');
const custom = require('../controller/owner/custom.js');
const identify = require('../controller/owner/identify.js');
const category = require('../controller/owner/category.js');
const menu = require('../controller/owner/menu.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/:restaurantName/regist', identify.postRegist);

router.post('/:restaurantName/category', category.postCategory);
router.post('/:restaurantName/custom', custom.postCustom);
router.post('/:restaurantName/menu', menu.postMenu);

router.delete('/:restaurantName/category', category.deleteCategory);
router.delete('/:restaurantName/custom', custom.deleteCustom);
router.delete('/:restaurantName/order', order.deleteOrder);
router.delete('/:restaurantName/menu', menu.deleteMenu);

router.get('/:restaurantName/category', category.getCategory);
router.get('/:restaurantName/custom', custom.getCustom);
router.get('/:restaurantName/order', order.getOrder);
router.get('/:restaurantName/menu', menu.getMenu);

router.patch('/:restaurantName/category', category.patchCategory);
router.patch('/:restaurantName/custom', custom.patchCustom);
router.patch('/:restaurantName/menu', menu.patchMenu);

module.exports = router;
