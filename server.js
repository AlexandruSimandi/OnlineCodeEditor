var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var gulp = require('gulp');
var sio = require('socket.io');
var mongoose = require('mongoose');
var exphbs  = require('express-handlebars');
var editorRoom = require('./models/editorRoom');
var mongoose = require('mongoose');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var dbName = 'codeEditorDB';
var connectionString = 'mongodb://127.0.0.1:27017/' + dbName;
mongoose.connection.on('error', console.error.bind(console, 'connection error: '));
mongoose.connection.once('open', function() {
	console.log('functioneaza');
});

mongoose.connection.on('error', console.error.bind(console, 'connection error: '));
mongoose.connection.once('open', function() {
	console.log('functioneaza');
});

mongoose.connect(connectionString);

//adds link to server for all the static file in the public folder
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/routes.js');
routes(app);

app.set('port', process.env.PORT || 3300);

http.listen(app.get('port'), function () {
	global.projectDir = __dirname;
	console.log('Example app listening on port ' + app.get('port') + '!');
});


var io = sio.listen(http);

io.on('connection', function(socket){
	console.log('client connected');

	socket.on('subscribe', function(roomName){
		console.log('join room: ' + roomName);
		socket.join(roomName);
	});

	socket.on('text change', function(msg){
		console.log('roomText: ' + msg.roomText);
		console.log('roomName: ' + msg.roomName);

		var newRoom = mongoose.model('EditorRoom', editorRoom);
		newRoom.update({ _id: msg.roomName }, { $set: { text: msg.roomText }}, function(err, rm){});

		socket.broadcast.to(msg.roomName).emit('text change',{
			roomText: msg.roomText,
			roomName: msg.roomName
		});
	});

	socket.on('disconnect', function(){
		console.log('clientul se decontecteaza');
	});

});