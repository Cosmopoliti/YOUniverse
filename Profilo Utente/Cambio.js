/**
 * Created by Mattia on 31/05/2017.
 */
var imgd=

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
            templateUrl: 'sub-views/palmares.html'
        })
        .otherwise({redirectTo: 'sub-views/Informazioni'});
}]);