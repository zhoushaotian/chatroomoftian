var Mongolass = require('mongolass');
var mongolass = new Mongolass();
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');
mongolass.connect('mongodb://localhost:27017/chat');
mongolass.plugin('addCreatedAt', {
    afterFind: function(results) {
        results.forEach(function(item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
        });
        return results;
    },
    afterFindOne: function(result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
        }
        return result;
    }
});
exports.User = mongolass.model('User', {
    name: { type: 'string' },
    password: { type: 'string' },
    gender: { type: 'string', enum: ['m', 'f', 'x'] },
    avatar: { type: 'string' }
}); //创建一个model
exports.User.index({ name: 1 }, { unique: true }).exec();