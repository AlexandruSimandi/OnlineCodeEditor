/**
 * Created by rober on 17/03/2016.
 */
angular
    .module('codeEditorApp')
    .factory('socket', ['$rootScope', function($rootScope){
        var socket = new io.connect();

        function on(eventName, callback){
            socket.on(eventName, callback);
        }

        function emit(eventName, callback){
            socket.emit(enventName, callback);
        }

        return {
            on: on,
            emit: emit
        }

    }]);