var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var gulp = require('gulp');

//adds link to server for all the static file in the public folder
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/routes.js');
// app.use('/', routes);
//
// var testeGenerareRandom = require('./routes/testeGenerareRandom');
// app.use('/testeGenerareRandom', testeGenerareRandom);
//
// app.get('/testeGenerareRandom', function(req, res){
//     res.send('Hello World');
// });
routes(app);

app.set('port', process.env.PORT || 3300);

app.listen(app.get('port'), function () {
    global.projectDir = __dirname;
    console.log('Example app listening on port ' + app.get('port') + '!');
});
