$(document).ready(function(){
	var socket = io();
	setTimeout(function(){

		var editor = ace.edit("editor");
		$('.ace_text-input').on('keyup', function(){
			socket.emit('text change', editor.getValue());
		})

		socket.on('text change', function(msg){
			var cursor = editor.getCursorPosition();
			editor.setValue(msg);
			editor.gotoLine(cursor.row+1,cursor.column,false);
		});
	}, 200);

});
