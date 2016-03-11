var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(__dirname + "/index.html")
});

http.listen(8000, function(){
	console.log('Server running');
});
