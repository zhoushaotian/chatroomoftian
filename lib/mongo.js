var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chat');
exports.User = mongoose.model('User', {
    username: String,
    password: String,
    gender: String,
    avtor: String
}); //创建一个model