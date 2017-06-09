/**
 * Created by Mattia on 08/06/2017.
 */
angular.module("myApp.appSignIn", ['ngRoute', 'firebase'])

// Declared route
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/SignIn', {
            templateUrl: 'Accesso/SignIn.html',
            controller: 'SignCtrl'
        });
    }])

    // Home controller
    .controller('SignCtrl', [function() {

    }]);