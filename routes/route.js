module.exports = function(app) {
    app.get('/', function(req, res, next) {
        res.redirect('/signin');
    });

    app.use('/signin', require('./signin'));
    app.use('/index', require('./index'));
    app.use('/signup', require('./signup'));
    app.use('/signout', require('./signout'));
    app.use('/chat', require('./chat'));
};