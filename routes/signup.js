var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/user');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

//GET 注册页
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('signup');
});

router.post('/', checkNotLogin, function(req, res, next) {
    var name = req.fields.name;
    var gender = req.fields.gender;
    var avatar = req.files.avatar.path === undefined ? req.files.avatar.path.split(path.sep).pop() : 'default.png';
    var password = req.fields.password;
    var repassword = req.fields.repassword;

    console.log(name, gender, avatar);
    //参数检验
    try {
        if (!(name.length) >= 1 && name.length <= 10) {
            throw new Error('名字请限制在1-10个字符');
        }
        if (['m', 'f', 'x'].indexOf(gender) === -1) {
            throw new Error('性别只能是 m、f 或 x');
        }
        if (password.length < 6) {
            throw new Error('密码至少6个字符');
        }
        if (password !== repassword) {
            throw new Error('两次输入密码不一致');
        }


    } catch (e) {
        fs.unlink(req.files.avatar.path);
        req.flash('error', e.message);
        return res.redirect('/signup');
    }
    //密码加密
    password = sha1(password);
    //待写入数据库的用户信息
    var user = {
        name: name,
        password: password,
        gender: gender,
        avatar: avatar
    };
    UserModel.create(user)
        .then(function(result) {
            user = result.ops[0];
            delete user.password;
            req.session.user = user;

            req.flash('success', '注册成功');

            res.redirect('/index');
        })
        .catch(function(e) {
            fs.unlink(req.files.avatar.path);
            if (e.message.match('E11000 duplicate key')) {
                req.flash('error', '用户名已经存在');
                return res.redirect('/signup');
            }
            next(e);
        });


});

module.exports = router;