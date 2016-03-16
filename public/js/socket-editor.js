$(document).ready(function(){
	var socket = io();
	setTimeout(function(){

		var editor = ace.edit("editor");
		$('.ace_text-input').on('keyup', function(){
			socket.emit('text change', editor.getValue());
		})

		socket.on('text change', function(msg){
			editor.setValue(msg);
		});
	}, 200);

});
