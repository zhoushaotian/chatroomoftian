var User = require('./lib/mongo');
module.exports = {
    create: function create(user) {
        return User.create(user);
    },
    getUserByName: function getUserByName(name) {
        var key;
        User.findOne({ username: name }, function(result) {
            key = result;
        })
        return key;
    }
}