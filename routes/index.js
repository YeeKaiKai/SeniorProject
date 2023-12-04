var express = require('express');
var router = express.Router();

const index = require('../controller/index.js')
const menu = require('../controller/customer/menu.js');

router.post('/regist', index.postRegistRestaurant);
router.post('/login', index.postLoginRestaurant);

router.get('/', index.getCustomerID)
router.get('/restaurant', index.getRestaurant)
router.get('/:restaurantName/menu', menu.getMenu);
router.get('/:restaurantName/category', menu.getCategory);

module.exports = router;
