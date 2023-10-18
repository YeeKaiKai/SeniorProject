var express = require('express');
var router = express.Router();

const order = require('../controller/order.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/order', order.getOrder);
router.delete('/order', order.deleteOrder);

module.exports = router;
