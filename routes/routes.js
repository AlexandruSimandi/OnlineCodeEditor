/**
 * Created by rober on 12/03/2016.
 */
var express = require('express'),
    router = express.Router(),
    home = require('../controllers/home'),
    api_editorData = require('../controllers/api/editorData');
module.exports = function(app) {
    router.get('/:room', home.index);
    router.get('/', home.startRoom);
    router.get('/api/editorData/:room', api_editorData.index);
    app.use(router);
};
