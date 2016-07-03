$(document).ready(function(){

    if(localStorage.getItem('codeEditorIncSettings')){

        var codeEditorIncSettings = JSON.parse(localStorage.getItem('codeEditorIncSettings'));

        if(codeEditorIncSettings.hasOwnProperty('selectedLanguage')){

            var selectedLanguage = codeEditorIncSettings.selectedLanguage;
            var selectedLanguageScript = document.createElement('script');
            selectedLanguageScript.src = '/js/codemirror/mode/' + selectedLanguage + '/' + selectedLanguage + '.js';
            selectedLanguageScript.onload = function () {

                editor.setOption("mode", selectedLanguage);
                $("#languageSelect").val(selectedLanguage).change();

            };

            document.head.appendChild(selectedLanguageScript);

        }

        if(codeEditorIncSettings.hasOwnProperty('selectedKeymap')){

            var selectedKeymap = codeEditorIncSettings.selectedKeymap;
            var selectedKeymapScript = document.createElement('script');
            selectedKeymapScript.src = '/js/codemirror/keymap/' + selectedKeymap + '.js';
            selectedKeymapScript.onload = function () {

                editor.setOption("keyMap", selectedKeymap);
                $("#keymapSelect").val(selectedKeymap).change();

            };

            document.head.appendChild(selectedKeymapScript);

        }

        if(codeEditorIncSettings.hasOwnProperty('selectedTheme')){

            var selectedTheme = codeEditorIncSettings.selectedTheme;
            var css = document.createElement('link');
            css.rel = "stylesheet";
            css.href = '/js/codemirror/theme/' +  selectedTheme + '.css';
            css.onload = function () {

                editor.setOption("theme", selectedTheme);
                $("#themeSelect").val(selectedTheme).change();
            };

            document.head.appendChild(css);

        }

    }

    var portviewHeight = $(window).height();

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


    var socket = io.connect('https://robertsandu.me');
    var roomName = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
    $('#download').attr('href', '/codeeditor/download/' + roomName);

    socket.emit('subscribe', roomName);
    console.log('socket');
    console.log(socket);

    setInterval(function(){

        console.log('update room in database: ' + editor.getDoc().getValue());

        socket.emit('update room in database', {
            roomName: roomName,
            roomText: editor.getDoc().getValue()
        });
    },3000);

    socket.on('request text', function(obj){

        console.log('request text: ' + editor.getDoc().getValue());

        socket.emit('granted text' , {id: obj.id, text: editor.getDoc().getValue()});

    });

    socket.on('current text', function(text){

        console.log('current text: ' + text);

        if(text != undefined){
            editor.getDoc().setValue(text);
        }
    });

    editor.on('change', function(editor, event){

        console.log('change: ' + event);

        socket.emit('text change', {
            roomName: roomName,
            roomEvent: event
        });
    });

    socket.on('text change', function(obj){

        console.log('text change: ' + obj.roomEvent.origin);

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
        script.src = '/proiectNodeJs/public/js/codemirror/mode/' + selectedLanguage + '/' + selectedLanguage + '.js';
        script.onload = function () {

            editor.setOption("mode", selectedLanguage);

            if(typeof localStorage !== 'undefined'){

                var codeEditorIncSettings;

                if(localStorage.getItem('codeEditorIncSettings')){

                    codeEditorIncSettings = JSON.parse(localStorage.getItem('codeEditorIncSettings'));

                }else{

                    codeEditorIncSettings = {};

                }

                codeEditorIncSettings.selectedLanguage = selectedLanguage;
                localStorage.setItem('codeEditorIncSettings', JSON.stringify(codeEditorIncSettings));

            }

        };

        document.head.appendChild(script);

    });


    $('#themeSelect').on('change', function(){


        var selectedTheme = $('#themeSelect').val();
        var css = document.createElement('link');
        css.rel = "stylesheet";
        css.href = '/proiectNodeJs/public/js/codemirror/theme/' +  selectedTheme + '.css';
        css.onload = function () {

            editor.setOption("theme", selectedTheme);

            if(typeof localStorage !== 'undefined'){

                var codeEditorIncSettings;

                if(localStorage.getItem('codeEditorIncSettings')){

                    codeEditorIncSettings = JSON.parse(localStorage.getItem('codeEditorIncSettings'));

                }else{

                    codeEditorIncSettings = {};

                }

                codeEditorIncSettings.selectedTheme = selectedTheme;
                localStorage.setItem('codeEditorIncSettings', JSON.stringify(codeEditorIncSettings));

            }

        };

        document.head.appendChild(css);

    });

    $('#keymapSelect').on('change', function(){


        var selectedKeymap = $('#keymapSelect').val();
        var script = document.createElement('script');
        script.src = '/proiectNodeJs/public/js/codemirror/keymap/' + selectedKeymap + '.js';
        script.onload = function () {

            editor.setOption("keyMap", selectedKeymap);

            if(typeof localStorage !== 'undefined'){

                var codeEditorIncSettings;

                if(localStorage.getItem('codeEditorIncSettings')){

                    codeEditorIncSettings = JSON.parse(localStorage.getItem('codeEditorIncSettings'));

                }else{

                    codeEditorIncSettings = {};

                }

                codeEditorIncSettings.selectedKeymap = selectedKeymap;
                localStorage.setItem('codeEditorIncSettings', JSON.stringify(codeEditorIncSettings));

            }

        };

        document.head.appendChild(script);

    });

});