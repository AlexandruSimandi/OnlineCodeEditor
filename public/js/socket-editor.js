var editor
$(document).ready(function(){
	var textarea = document.getElementById('codemirror');
	editor = CodeMirror.fromTextArea(textarea, {
		lineNumbers: true,
		mode: 'javascript'
	});

	var socket = io();
	var roomName = window.location.pathname.substring(1, window.location.pathname.length);
	socket.emit('subscribe', roomName);

	editor.on('change', function(editor, event){
		socket.emit('text change', {
			roomName: roomName,
			roomEvent: event
		});
	});

	socket.on('text change', function(obj){
		console.log(obj.roomEvent.from);
		console.log(obj.roomEvent.to);
		console.log(obj.roomEvent.text);
		console.log(obj.roomEvent.removed);
		console.log(obj.roomEvent.origin);
		switch(obj.roomEvent.origin){
			case('+input'):
				var newlineFlag = '';
				if(obj.roomEvent.text.length > 1){
					newlineFlag = '\n';
				}
				editor.getDoc().replaceRange(obj.roomEvent.text[0] + newlineFlag,{
					line: obj.roomEvent.from.line, ch: obj.roomEvent.from.ch
				},{
					line: obj.roomEvent.to.line, ch: obj.roomEvent.to.ch
				});
				break;
			case('+delete'):
				editor.getDoc().replaceRange('',{
					line: obj.roomEvent.from.line, ch: obj.roomEvent.from.ch
				},{
					line: obj.roomEvent.to.line, ch: obj.roomEvent.to.ch
				});
				break;
			case('cut'):
				editor.getDoc().replaceRange('',{
					line: obj.roomEvent.from.line, ch: obj.roomEvent.from.ch
				},{
					line: obj.roomEvent.to.line, ch: obj.roomEvent.to.ch
				});
				break;
			case('paste'):
				var str = '';
				for(var i = 0; i < obj.roomEvent.text.length; i++){
					str += obj.roomEvent.text[i];
//					console.log(obj.roomEvent.text[i]);
					if(i < obj.roomEvent.text.length - 1){
						str += '\n';
					}
				}
				console.log(str);
				editor.getDoc().replaceRange(str, {
					line: obj.roomEvent.from.line, ch: obj.roomEvent.from.ch
				},{
					line: obj.roomEvent.to.line, ch: obj.roomEvent.to.ch
				});
				break;
//			editor.getDoc().replaceRange('c',{line: 0, ch: 0},{line: 0, ch: 5})
		};
	})
//	var oldCursorRow = 1;
//	var Range = require('ace/range').Range;

//	setTimeout(function(){
//
//		var editor = ace.edit("editor");
//		//updates old cursor position on click
//		$(editor).on('click', function(){
//			oldCursorRow = editor.getCursorPosition().row;
//		});
//
//		//key pressed
//		$('.ace_text-input').on('keyup', function(e){
//			var cursor = editor.getCursorPosition();
//
//			//row deleted
//			if(cursor.row < oldCursorRow && e.keyCode == 8){
//				socket.emit('delete row', {
//					roomName: roomName,
//					roomText: oldCursorRow
//				});
//			}
//			var msg = editor.session.getLine(cursor.row);
//			msg = cursor.row +  '~~~~~' + msg + ' ';
//			if(e.keyCode == 13){
//				msg += '\n';
//			}
//			console.log(msg);
//			socket.emit('text change', {
//				roomName: roomName,
//				roomText: msg
////				roomText: editor.getValue()
//			});
//			socket.emit('update room in database', {
//				roomName: roomName,
//				roomText: editor.getValue()
//			})
//			oldCursorRow = cursor.row;
//		})
//
//		//replace result with msg to get back to old version
//		socket.on('text change', function(obj){
//			var cursor = editor.getCursorPosition();
//			var tokens = obj.roomText.split('~~~~~');
//			console.log(tokens);
//			var row = tokens[0];
//			var rng = new Range(row, 0, row, Number.MAX_VALUE);
//			try{
//				editor.getSession().replace(rng, tokens[1]);
//			} catch(e){}
////			var result =  diffString(oldText, newText).replace(/(<del[\s\S]*?<\/del>)|<ins>|<\/ins>/gm,'');
//			editor.gotoLine(cursor.row+1,cursor.column,false);
//		});
//
//		socket.on('delete row', function(msg){
//			var rng = new Range(msg.roomText, 0, msg.roomText, Number.MAX_VALUE);
//			editor.getSession().remove(msg.roomText, msg.roomText);
//			console.log('he deleted a row!');
//		});
//
//	}, 200);

});

