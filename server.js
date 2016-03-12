var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var gulp = require('gulp');

//adds link to server for all the static file in the public folder
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index');
app.use('/', routes);

var testeGenerareRandom = require('./routes/testeGenerareRandom');
app.use('/testeGenerareRandom', testeGenerareRandom);

app.listen(3000, function () {
    global.projectDir = __dirname;
    console.log('Example app listening on port 3000!');
});
