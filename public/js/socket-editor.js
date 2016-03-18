$(document).ready(function(){
	var socket = io();
	var roomName = window.location.pathname.substring(1, window.location.pathname.length);
	socket.emit('subscribe', roomName);
	setTimeout(function(){

		var editor = ace.edit("editor");
		$('.ace_text-input').on('keyup', function(){
			socket.emit('text change', {
				roomName: roomName,
				roomText: editor.getValue()
			});
		})

		//replace result with msg to get back to old version
		socket.on('text change', function(msg){
			var oldText = editor.getValue();
			var newText = msg.roomText;
			var result =  diffString(oldText, newText).replace(/(<del[\s\S]*?<\/del>)|<ins>|<\/ins>/gm,'');
			var cursor = editor.getCursorPosition();
			editor.setValue(result);
			editor.gotoLine(cursor.row+1,cursor.column,false);
		});
	}, 200);

});
