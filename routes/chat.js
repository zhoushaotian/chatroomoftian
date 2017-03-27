var Express = require('express');
var router = Express.Router();

var checkLogin = require('../middlewares/check').checkLogin;
router.get('/', checkLogin, function(req, res, next) {
    res.render('chat.ejs');
});
module.exports = router;