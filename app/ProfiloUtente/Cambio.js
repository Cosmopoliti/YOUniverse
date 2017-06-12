/**
 * Created by Mattia on 31/05/2017.
 */


angular.module("myApp.Profilo", ['ngRoute'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/ProfiloUtente', {
        templateUrl: 'ProfiloUtente/indexProfilo.html',
        controller: 'ProfiloCtrl',
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentAuth": ["Auth", function(Auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $routeChangeError (see above)
                return Auth.$requireSignIn();
            }]

        }
    })
        .when('#!/ProfiloUtente/Informazioni', {
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
        .otherwise({redirectTo: '/Informazioni'});
}]);