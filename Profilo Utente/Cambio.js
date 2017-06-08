/**
 * Created by Mattia on 31/05/2017.
 */
<<<<<<< Updated upstream
var imgd=
=======

>>>>>>> Stashed changes

angular.module("myProfilo", ['ngRoute'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/Informazioni', {
            templateUrl: 'sub-views/informazioni.html'
        })
        .when('/Interessi', {
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
}]);