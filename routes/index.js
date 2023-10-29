var express = require('express');
var router = express.Router();

const index = require('../controller/index.js')
const menu = require('../controller/menu.js');

/* GET home page. */
router.get('/', index.getCustomerID)

router.get('/:restaurantName/menu', menu.getMenu);
router.get('/:restaurantName/category', menu.getCategory);

module.exports = router;
