var compression = require('compression');
var express = require('express');
var app = express();
var path = require('path');
var editorRoom = require('./models/editorRoom');
var mongoose = require('mongoose');
var config = require('./config');
var favicon = require('serve-favicon');
var sio = require('socket.io');
var morgan = require('morgan');
var mongoMorgan = require('mongo-morgan');

app.use(compression());

app.use(favicon(path.join(__dirname,'public','images','favicon.ico'), {maxAge: 86400000 * 30}));

app.use(express.static(path.join(__dirname, 'public'), {
	maxAge: 86400000,
	redirect: true,
	hidden: false
}));

mongoose.connection.on('error', console.error.bind(console, 'connection error: '));

mongoose.connection.once('open', function() {

});

mongoose.connect(config.mongoDBServerAddress + config.dbName);

app.use(morgan('combined'));

var logger = function(req, res, next) {
    console.log("GOT REQUEST !");
    console.log(req.url);
    next(); // Passing the request to the next handler in the stack.
};

app.use(logger); // Here you add your logger to the stack.

var routes = require('./routes/routes.js');
routes(app);

app.set('port', config.port || process.env.PORT || 3300);

var server = app.listen(app.get('port'), "0.0.0.0", function () {

	global.projectDir = __dirname;
	console.log('Code editor inc app listening on port ' + app.get('port') + '!');
    
});

var http = require('http').createServer(app).listen(3000);
var io = sio.listen(http);

io.on('connection', function(socket){

	socket.on('subscribe', function(roomName){

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

		var newRoom = mongoose.model('EditorRoom', editorRoom);
		newRoom.update({ _id: msg.roomName }, { $set: { text: msg.roomText }},function(err, rm){});
	});

});

module.exports = {
    server: server,
    app: app,
	mongoose: mongoose
};
