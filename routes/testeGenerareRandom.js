/**
 * Created by rober on 12/03/2016.
 */
var express = require('express');
var router = express.Router();
var moniker = require('moniker');

/* GET home page. */
router.get('/testeGenerareRandom', function (req, res) {

    var ceva = {
        generat: moniker.choose()
    };

    res.json(ceva);
});

/* EXPORT the index route */
module.exports = router;