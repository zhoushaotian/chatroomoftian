var Express = require('express');
var path = require('path');
var flash = require('connect-flash');
var session = require('express-session');
var routes = require('./routes/route');
var MongoStore = require('connect-mongo')(session);
var app = Express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs'); //设置模板引擎

app.use(Express.static(path.join(__dirname, '/public'))); //加载静态文件

app.use(session({ //设置session中保存的字段
    name: "chat",
    secret: "chat",
    resave: true,
    cookie: {
        maxAge: 259200000
    },
    store: new MongoStore({
        url: 'mongodb://localhost:27017/chat'
    })
}));

app.use(flash());

app.use(require('express-formideble')({
    uploadDir: path.join(__dirname, '/public/img'),
    keepExtensions: true
}));