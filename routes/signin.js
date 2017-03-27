    var Express = require('express');
    var router = Express.Router();
    var sha1 = require('sha1');

    var UserModel = require('../models/user');
    var checkNotLogin = require('../middlewares/check').checkNotLogin;

    router.get('/', checkNotLogin, function(req, res, next) {
        res.render('signin');
    });

    router.post('/', checkNotLogin, function(req, res, next) {
        var name = req.fields.name;
        var password = req.fields.password;

        UserModel.getUserByName(name)
            .then(function(user) {
                if (!user) {
                    req.flash('error', '用户不存在');
                    return res.redirect('back');
                }
                if (sha1(password) !== user.password) {
                    req.flash('error', '用户名或密码错误');
                    return res.redirect('back');
                }
                req.flash('success', '登陆成功');
                //用户信息写入session
                delete user.password;
                req.session.user = user;


                res.redirect('/index');

            })
            .catch(next);
    });
    module.exports = router;