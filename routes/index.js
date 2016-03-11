/**
 * Created by rober on 11/03/2016.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.sendFile(global.projectDir + "/index.html")
});

/* EXPORT the index route */
module.exports = router;