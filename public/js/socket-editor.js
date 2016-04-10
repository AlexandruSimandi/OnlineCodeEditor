$(document).ready(function(){
//	timeout for angular to load, have to fix this
	setTimeout(function(){
		var editor;
		var textarea = document.getElementById('codemirror');
		editor = CodeMirror.fromTextArea(textarea, {
			lineNumbers: true,
			mode: 'javascript'
		});

		var socket = io();
		var roomName = window.location.pathname.substring(1, window.location.pathname.length);
		$('#download').attr('href', '/download/' + roomName);
		socket.emit('subscribe', roomName);

		//database updated every 9 secs
		setInterval(function(){
			var text = editor.get;
			socket.emit('update room in database', {
				roomName: roomName,
				roomText: editor.getDoc().getValue()
			});
		},9000);

		socket.on('request text', function(obj){
			socket.emit('granted text' , {id: obj.id, text: editor.getDoc().getValue()});
		});

		socket.on('current text', function(text){
			if(text != undefined){
				editor.getDoc().setValue(text);
			}
		});

		editor.on('change', function(editor, event){
			socket.emit('text change', {
				roomName: roomName,
				roomEvent: event
			});
		});

		socket.on('text change', function(obj){
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
						if(i < obj.roomEvent.text.length - 1){
							str += '\n';
						}
					}
					editor.getDoc().replaceRange(str, {
						line: obj.roomEvent.from.line, ch: obj.roomEvent.from.ch
					},{
						line: obj.roomEvent.to.line, ch: obj.roomEvent.to.ch
					});
					break;
			}
		});
	},250);

});

