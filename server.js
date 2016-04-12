var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var sio = require('socket.io');
var editorRoom = require('./models/editorRoom');
var mongoose = require('mongoose');
var config = require('./config');

mongoose.connection.on('error', console.error.bind(console, 'connection error: '));

mongoose.connection.once('open', function() {

});

mongoose.connect(config.mongoDBServerAddress + config.dbName);

app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/routes.js');
routes(app);

app.set('port', config.port || process.env.PORT || 3300);

var server = app.listen(app.get('port'), function () {
	global.projectDir = __dirname;
	console.log('Example app listening on port ' + app.get('port') + '!');
});


var io = sio.listen(http, {});

io.on('connection', function(socket){

	socket.on('subscribe', function(roomName){
		//console.log('join room: ' + roomName);
		socket.join(roomName);
		var clients = io.sockets.adapter.rooms[roomName];
		if(clients.length > 1){

			socket.broadcast.to(roomName).emit("request text", {id: socket.id})

		}
	});

	socket.on('granted text', function(obj){
		io.to(obj.id).emit('current text', obj.text);
	});

	socket.on('text change', function(msg){
		socket.broadcast.to(msg.roomName).emit('text change',{
			roomEvent: msg.roomEvent,
			roomName: msg.roomName
		});
	});

	socket.on('update room in database', function(msg){
//		console.log(msg.roomText);
		var newRoom = mongoose.model('EditorRoom', editorRoom);
		newRoom.update({ _id: msg.roomName }, { $set: { text: msg.roomText }},function(err, rm){});
	});

});

module.exports = server;
