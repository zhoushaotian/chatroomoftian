var Express = require('express');
var router = Express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin, function(req, res, next) {
    req.session.user = null;
    req.flash('success', '注销成功');
    res.redirect('/signin');
})
module.exports = router;