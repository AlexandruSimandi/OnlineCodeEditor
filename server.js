var compression = require('compression');
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var editorRoom = require('./models/editorRoom');
var mongoose = require('mongoose');
var config = require('./config');
var favicon = require('serve-favicon');
var fs = require('fs');
var winston = require('winston');
var expressWinston = require('express-winston');
require('winston-mongodb').MongoDB;

var http = require('http').Server(app);
var io = require('socket.io')(http);

var routes = require('./routes/routes.js');

/*app.use(expressWinston.logger({
	transports: [
		new winston.transports.Console({
			json: true,
			colorize: true
		}),
		new (winston.transports.MongoDB)({
			db : config.mongoDBServerAddress + config.dbName,
			level : 'debug'
		})

	],
	meta: true,
	msg: "HTTP {{req.method}} {{req.url}}",
	expressFormat: true,
	colorStatus: true,
	ignoreRoute: function (req, res) { return false; }
}));*/

app.use(compression());

app.use(favicon(path.join(__dirname,'public','images','favicon.ico'), {maxAge: 86400000 * 30}));

app.use(express.static(path.join(__dirname, 'public'), {
	maxAge: 86400000,
	redirect: true,
	hidden: false
}));

mongoose.connection.on('error', console.error.bind(console, 'connection error: '));

mongoose.connection.once('open', function() {
	console.log('connection opened');
});

mongoose.connect(config.mongoDBServerAddress + config.dbName);

app.set('port', config.port || process.env.PORT || 3300);

global.projectDir = __dirname;

io.on('connection', function(socket){

	socket.on('subscribe', function(roomName){

		console.log('room name:' + roomName);

        socket.join(roomName);
		var clients = io.sockets.adapter.rooms[roomName];
		if(clients.length > 1){

			socket.broadcast.to(roomName).emit("request text", {id: socket.id})

		}
		else{

			editorRoom.findOne({_id: roomName}, 'text', function(err, roomObject) {

				if(!err){

					io.to(socket.id).emit('current text', roomObject.text);

				}

			});

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

		console.log('update room in database in back end: ' + msg.roomName + ', ' +  msg.roomText);

		var newRoom = mongoose.model('EditorRoom', editorRoom);

		var options = {
			//If the object dosen't exits it will be created
			upsert: true,
			multi: true
		};

		newRoom.update({ _id: msg.roomName }, { text: msg.roomText }, options,function(err, numAffected){

			console.log('err: ' + err);
			console.log('numAffected: ' + JSON.stringify(numAffected));

		});
	});

});

routes(app);

router.stack.forEach(function(element) {
	console.log('element');
	console.log(element);
}, this);

app.listen(3300, function () {
  console.log('Example app listening on port 3000!')
})

module.exports = {
    app: app,
	mongoose: mongoose
};
