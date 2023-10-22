var express = require('express');
var router = express.Router();

const order = require('../controller/order.js')
const custom = require('../controller/custom.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/order', order.getOrder);
router.delete('/order', order.deleteOrder);

router.post('/custom', custom.postCustom);
router.post('/custom/option', custom.postOption);

router.delete('/custom', custom.deleteCustom);
router.delete('/custom/option', custom.deleteOption);

router.get('/custom', custom.getCustom);
router.get('/custom/option', custom.getOption);

router.put('/custom', custom.putCustom);
router.put('/custom/option', custom.putOption);

module.exports = router;
