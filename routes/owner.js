var express = require('express');
var router = express.Router();

const order = require('../controller/owner/order.js')
const custom = require('../controller/owner/custom.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:restaurantName/order', order.getOrder);
router.delete('/:restaurantName/order', order.deleteOrder);

router.post('/:restaurantName/custom', custom.postCustom);
router.post('/:restaurantName/custom/option', custom.postOption);

router.delete('/:restaurantName/custom', custom.deleteCustom);
router.delete('/:restaurantName/custom/option', custom.deleteOption);

router.get('/:restaurantName/custom', custom.getCustom);
router.get('/:restaurantName/custom/option', custom.getOption);

router.put('/:restaurantName/custom', custom.putCustom);
router.put('/:restaurantName/custom/option', custom.putOption);

module.exports = router;
