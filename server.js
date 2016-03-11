var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
	res.sendFile(__dirname + "/index.html")
});

http.listen(8000, function(){
	console.log('Server running');
});
