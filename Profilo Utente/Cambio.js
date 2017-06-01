/**
 * Created by Mattia on 31/05/2017.
 */


angular.module("myProfilo", ['ngRoute'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/Informazioni', {
            templateUrl: 'sub-views/informazioni.html'
        })
        .when('/Interessi', {
            templateUrl: 'sub-views/interessi.html',
            controller: 'Ctrl'
        })
        .when('/Diario', {
            templateUrl: 'sub-views/diario.html',
            controller: 'Ctrl'
        })
        .when('/Libreria', {
            templateUrl: 'libreria.html',
            controller: 'Ctrl'
        })
        .when('/Storie', {
            templateUrl: 'storie.html',
            controller: 'Ctrl'
        })
        .when('/Palmares', {
            templateUrl: 'palmares.html',
            controller: 'Ctrl'
        })
        .otherwise({redirectTo: '/Informazioni'});
}]);