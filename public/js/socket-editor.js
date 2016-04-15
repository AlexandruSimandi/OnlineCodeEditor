$(document).ready(function(){

	var portviewHeight = $(window).height();
	console.log(portviewHeight);

	var textarea = document.getElementById('codemirror');
	CodeMirror.commands.autocomplete = function(cm) {
		cm.showHint({hint: CodeMirror.hint.anyword});
	};
	var editor = CodeMirror.fromTextArea(textarea, {
		lineNumbers: true,
		mode: 'javascript',
		highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},
		styleActiveLine: true,
		extraKeys: {"Ctrl-Space": "autocomplete"}
	});
	$('.CodeMirror').height(portviewHeight - 64);
	$(window).resize(function(e){
		portviewHeight = $(window).height();
		$('.CodeMirror').height(portviewHeight - 64);
	});

	var socket = io.connect();
	var roomName = window.location.pathname.substring(1, window.location.pathname.length);
	$('#download').attr('href', '/download/' + roomName);

	console.log('se contecteaza la : ' + roomName);
	socket.emit('subscribe', roomName);

	setInterval(function(){

		console.log('interval 3000 -  emit update room in database');
		console.log('roomName');
		console.log(roomName);
		console.log('editor.getDoc().getValue()');
		console.log(editor.getDoc().getValue());
		console.log('-------------------------------------');

		socket.emit('update room in database', {
			roomName: roomName,
			roomText: editor.getDoc().getValue()
		});
	},3000);

	socket.on('request text', function(obj){
		socket.emit('granted text' , {id: obj.id, text: editor.getDoc().getValue()});
	});

	socket.on('current text', function(text){
		if(text != undefined){
			editor.getDoc().setValue(text);
		}
	});

	editor.on('change', function(editor, event){

		console.log('on change -  emit text change');
		console.log('roomName');
		console.log(roomName);
		console.log('-------------------------------------');

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

	$('#languageSelect').on('change', function(){


		var selectedLanguage = $('#languageSelect').val();
		var script = document.createElement('script');
		script.src = '/js/codemirror/mode/' + selectedLanguage + '/' + selectedLanguage + '.js';
		script.onload = function () {

			editor.setOption("mode", selectedLanguage);

		};

		document.head.appendChild(script);

	});


	$('#themeSelect').on('change', function(){


		var selectedTheme = $('#themeSelect').val();
		var css = document.createElement('link');
		css.rel = "stylesheet";
		css.href = '/js/codemirror/theme/' +  selectedTheme + '.css';
		css.onload = function () {

			console.log('a incarcat');
			editor.setOption("theme", selectedTheme);

		};

		document.head.appendChild(css);

	});

	$('#keymapSelect').on('change', function(){


		var selectedKeymap = $('#keymapSelect').val();
		var script = document.createElement('script');
		script.src = '/js/codemirror/keymap/' + selectedKeymap + '.js';
		script.onload = function () {

			editor.setOption("keyMap", selectedKeymap);

		};

		document.head.appendChild(script);

	});

});

