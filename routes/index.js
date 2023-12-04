var express = require('express');
var router = express.Router();

const index = require('../controller/index.js')

router.post('/regist', index.postRegistRestaurant);
router.post('/login', index.postLoginRestaurant);

router.get('/', index.getCustomerID)
router.get('/restaurant', index.getRestaurant)

module.exports = router;
