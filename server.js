var compression = require('compression');
var express = require('express');
var app = express();
var path = require('path');
var editorRoom = require('./models/editorRoom');
var mongoose = require('mongoose');
var config = require('./config');
var favicon = require('serve-favicon');
//var sio = require('socket.io');
//var morgan = require('morgan');
//var mongoMorgan = require('mongo-morgan');
var fs = require('fs');
var winston = require('winston');
var expressWinston = require('express-winston');
var https = require('https');
require('winston-mongodb').MongoDB;

app.use(expressWinston.logger({
	transports: [
		new winston.transports.Console({
			json: true,
			colorize: true
		}),
		new (winston.transports.MongoDB)({
			db : config.dbName,
			level : 'debug',
			//ssl : true,
			dbUri : config.mongoDBServerAddress
		})

	],
	meta: true, // optional: control whether you want to log the meta data about the request (default to true)
	msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
	expressFormat: true, // Use the default Express/morgan request formatting, with the same colors. Enabling this will override any msg and colorStatus if true. Will only output colors on transports with colorize set to true
	colorStatus: true, // Color the status code, using the Express/morgan color palette (default green, 3XX cyan, 4XX yellow, 5XX red). Will not be recognized if expressFormat is true
	ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

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

/*app.use(morgan('combined'));

var logger = function(req, res, next) {
    console.log("GOT REQUEST !");
    console.log(req.url);
    next(); // Passing the request to the next handler in the stack.
};

app.use(logger); // Here you add your logger to the stack.
*/

var routes = require('./routes/routes.js');
routes(app);

app.set('port', config.port || process.env.PORT || 3300);

var options = {
	key: fs.readFileSync('/etc/nginx/ssl/robertsandu_me.key'),
	cert: fs.readFileSync('/etc/nginx/ssl/cert_chain.crt')
	//requestCert: false,
	//rejectUnauthorized: false
};

global.projectDir = __dirname;

var server = https.createServer(options, app).listen(3300);

// Redirect from http port to https
var http = require('http');
http.createServer(function (req, res) {
	res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
	res.end();
}).listen(8080);

/*
 , "0.0.0.0", function () {


 console.log('Code editor inc app listening on port ' + 443 + '!');

 }
 */

//var http = require('https').createServer(options, app).listen(3000);
var io = require('socket.io')(server);

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
		newRoom.update({ _id: msg.roomName }, { $set: { text: msg.roomText }},function(err, numAffected){

			console.log('err: ' + err);
			console.log('numAffected: ' + JSON.stringify(numAffected));

		});
	});

});

module.exports = {
    server: server,
    app: app,
	mongoose: mongoose
};
