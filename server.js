var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

//adds link to server for all the static file in the public folder
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index');
app.use('/', routes);

http.listen(8000, function(){
	console.log('Server running');
});
