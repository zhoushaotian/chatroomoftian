var User = require('./lib/mongo');
module.exports = {
    create: function create(user) {
        return User.create(user);
    },
    getUserByName: function getUserByName(name) {
        User.findOne({ username: name }, function(err, result) {
            if (err) {
                return false;
            } else {
                return result;
            }
        });
    }
}