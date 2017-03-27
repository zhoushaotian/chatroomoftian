var url = require('url');
var Express = require('express');
var path = require('path');
var flash = require('connect-flash');
var session = require('express-session');
var routes = require('./routes/route');
var MongoStore = require('connect-mongo')(session);
var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var app = Express();
var user;
var useravarar;

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs'); //设置模板引擎

app.use(Express.static(path.join(__dirname, '/public'))); //加载静态文件

app.use(session({ //设置session中保存的字段
    name: "chat",
    secret: "chat",
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 259200000
    },
    store: new MongoStore({
        url: 'mongodb://localhost:27017/chat'
    })
}));

app.use(flash());

app.use(require('express-formidable')({
    uploadDir: path.join(__dirname, '/public/img'),
    keepExtensions: true
}));

app.locals.chat = {
    title: "Tian's chat",
    description: "nodejs+express+ws"
};


app.use(function(req, res, next) {

    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    user = req.session.user;
    //    useravarar = req.session.user.avatar;
    next();

});



routes(app);
var messageIndex = 0; //消息ID

function createMessage(type, user, data) { //服务器的创建消息函数
    messageIndex++;
    return JSON.stringify({
        id: messageIndex,
        type: type,
        user: user,
        data: data
    });
}

function onConnection() {
    var user = this.user;
    var msg = createMessage('join', user, `${user}加入了聊天室`);
    this.wss.broadcast(msg);
    //更新用户列表
    var users = [];
    this.wss.clients.forEach(function(client) {
        users.push(client.user);
    });
    this.send(createMessage('list', user, users));
}


var server = app.listen(3001, function() {
    console.log("Chat Home listening on port 3000");
});

var wss = new WebSocketServer({
    server: server
});

wss.on('connection', function(ws) { //ws参数表示一个websocket实例，标志这个当前一个websocket连接
    var location = url.parse(ws.upgradeReq.url, true);
    ws.user = user.name; //将session中的用户信息绑定到这个连接
    ws.wss = wss; //绑定服务器对象
    ws.on('message', function(message) { //为每个websocket绑定响应message的函数
        console.log(message);
        if (message && message.trim()) {
            var msg = createMessage('chat', this.user, message.trim());
            this.wss.broadcast(msg);
        }
    });

    ws.on('close', function() {
        var user = this.user;
        var msg = createMessage('left', user, `${user}离开了聊天室！`);
        this.wss.broadcast(msg);
    });
    onConnection.call(ws);
    if (location.pathname !== '/chat') { //判定是否在chat中发起的请求
        ws.close(4000, 'invalid URL');
    }
    console.log('websocketserver was attached');

});
wss.broadcast = function(data) { //绑定广播方法，给每一个连接发送消息
    wss.clients.forEach(function(client) {
        client.send(data);
    });
}; //wss一个websocketserver对象