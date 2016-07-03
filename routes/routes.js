/**
 * Created by rober on 12/03/2016.
 */

var express = require('express'),
    router = express.Router(),
    home = require('../controllers/home'),
    api_editorData = require('../controllers/api/editorData'),
    download = require('../controllers/download');

module.exports = function(app) {

    router.get('/codeeditor/:room', home.index);
    router.get('/codeeditor/', home.startRoom);
    router.get('/codeeditor/api/editorData/:room', api_editorData.index);
    router.get('/codeeditor/download/:roomName', download.index);
    app.use(router);

};
