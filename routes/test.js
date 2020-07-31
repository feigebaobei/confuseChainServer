var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/randomCode', function(req, res, next) {
  // res.render('index', { title: 'confuse chain server' });
  // res.status(200).json()
  res.send('7vnrvit56x50xjcyy6a7nna6pwknb7yo36qhe6n05g7bxwpexbz5193rzt5b1ykjfdjuh5sek5ip7hax5f9ivvk92ym2rz3urzcfo2v57ihr2mj9ioguq9lgpzcuzgw8')
});

module.exports = router;
