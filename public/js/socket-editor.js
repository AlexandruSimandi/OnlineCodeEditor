$(document).ready(function(){
	var socket = io();
	setTimeout(function(){

		var editor = ace.edit("editor");
		$('.ace_text-input').on('keyup', function(){
			socket.emit('text change', editor.getValue());
		})

		//replace result with msg to get back to old version
		socket.on('text change', function(msg){
			var oldText = editor.getValue();
			var newText = msg;
			var result =  diffString(oldText, newText).replace(/(<del[\s\S]*?<\/del>)|<ins>|<\/ins>/gm,'');
			var cursor = editor.getCursorPosition();
			editor.setValue(result);
			editor.gotoLine(cursor.row+1,cursor.column,false);
		});
	}, 200);

});
