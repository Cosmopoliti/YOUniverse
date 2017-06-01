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
            templateUrl: 'sub-views/interessi.html'
        })
        .when('/Diario', {
            templateUrl: 'sub-views/diario.html'
        })
        .when('/Libreria', {
            templateUrl: 'sub-views/libreria.html'
        })
        .when('/Storie', {
            templateUrl: 'sub-views/storie.html'
        })
        .when('/Palmares', {
            templateUrl: 'palmares.html'
        })
        .otherwise({redirectTo: '/Informazioni'});
}]);