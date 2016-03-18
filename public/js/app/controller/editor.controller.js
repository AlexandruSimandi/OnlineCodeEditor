/**
 * Created by rober on 19/03/2016.
 */
angular
    .module('codeEditorApp')
    .controller('EditorController', ['$scope', '$http', function($scope, $http){
        var roomName = window.location.pathname.substring(1, window.location.pathname.length);
        console.log(window.location.origin + "/api/editorData/" + roomName);
        $http
            .get(window.location.origin + "/api/editorData/" + roomName)
            .then(function(response){
                $scope.room = response.data;
            });
    }]);