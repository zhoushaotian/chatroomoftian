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
    var avatar = req.files.avatar.path.split(path.sep).pop();
    var password = req.fields.password;
    var repassword = req.fields.repassword;

    //参数检验
    try {
        if (!(name.length) >= 1 && name.length <= 10) {
            throw new Error('名字请限制在1-10个字符');
        }
        if (['m', 'f', 'x'].indexOf(gender) === -1) {
            throw new Error('性别只能是 m、f 或 x');
        }
    }
})