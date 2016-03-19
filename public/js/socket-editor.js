$(document).ready(function(){
	var socket = io();
	var roomName = window.location.pathname.substring(1, window.location.pathname.length);
	socket.emit('subscribe', roomName);
	setTimeout(function(){

		var editor = ace.edit("editor");

		$('.ace_text-input').on('keyup', function(e){
			var cursor = editor.getCursorPosition();
			var msg = editor.session.getLine(cursor.row);
			msg = cursor.row +  '~~~~~' + msg + ' ';
			if(e.keyCode == 13){
				msg += '\n';
			}
			console.log(msg);
			socket.emit('text change', {
				roomName: roomName,
				roomText: msg
//				roomText: editor.getValue()
			});
		})

		//replace result with msg to get back to old version
		socket.on('text change', function(obj){
			var tokens = obj.roomText.split('~~~~~');
			var row = tokens[0];
//			var cursor = editor.getCursorPosition();
			editor.session.replace({
				start: {row: row, column: 0},
				end: {row: row, column: Number.MAX_VALUE}
			}, tokens[1]);
//			var oldText = editor.getValue();
//			var newText = msg.roomText;
//			var result =  diffString(oldText, newText).replace(/(<del[\s\S]*?<\/del>)|<ins>|<\/ins>/gm,'');

//			editor.setValue(result);
//			editor.gotoLine(cursor.row+1,cursor.column,false);
		});
	}, 200);

});
