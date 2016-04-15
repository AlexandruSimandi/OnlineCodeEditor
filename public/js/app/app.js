/**
 * Created by rober on 12/03/2016.
 */

angular.module('codeEditorApp',[
                                'ui.router'
]);

angular
    .module('codeEditorApp')
    .config(function($stateProvider, $urlRouterProvider, $locationProvider){

        //in cazul in care intra pe un url gresit il redirecteaza catre index.html
        $urlRouterProvider
            .otherwise('/');

        //configurez starile aplicatiei
        $stateProvider
            .state('home',{
                url: '/:roomName',
                templateUrl: "views/partial-home.html"
            })
            .state('settings',{
                url: '/settings',
                templateUrl: "views/partial-settings.html"
            })
            .state('about',{
                url: '/about',
                templateUrl: "views/partial-about.html"
            });

        $locationProvider.html5Mode(true);
    });
