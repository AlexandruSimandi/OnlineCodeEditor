$(document).ready(function(){
	var socket = io.connect();
	setTimeout(function(){

		var editor = ace.edit("editor");
		editor.getSession().on('change', function(){
			socket.emit('text change', editor.getValue());
		})

		socket.on('text change', function(msg){
			editor.setValue(msg);
		});
	}, 200);

});
