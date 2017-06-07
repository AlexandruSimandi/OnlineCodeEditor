/**
 * Created by rober on 12/03/2016.
 */

var router = require('express').Router(),
    home = require('../controllers/home'),
    api_editorData = require('../controllers/api/editorData'),
    download = require('../controllers/download');

module.exports = function(app) {
    
    router.get('/:room', home.index);
    router.get('/', home.startRoom);
    router.get('/api/editorData/:room', api_editorData.index);
    router.get('/download/:roomName', download.index);
    app.use(router);

};
