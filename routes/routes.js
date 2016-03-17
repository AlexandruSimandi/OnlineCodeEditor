/**
 * Created by rober on 12/03/2016.
 */
var express = require('express'),
    router = express.Router(),
    home = require('../controllers/home'),
    testeGenerareRandom = require('../controllers/testeGenerareRandom');
module.exports = function(app) {
    router.get('/:room', home.index);
    router.get('/', home.startRoom);
    router.get('/testeGenerareRandom', testeGenerareRandom.index);
    app.use(router);
};
