var express = require('express');
var router = express.Router();

const chatgpt = require('../controller/chatgpt.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/chat/', chatgpt.postDiagolue);
router.get('/chat/:customerID', chatgpt.getDialogue);

module.exports = router;
