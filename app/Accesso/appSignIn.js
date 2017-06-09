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
    .controller('SignCtrl', ['$scope', function($scope) {
        $scope.SignIn = function() {
            var username = $scope.user.email;
            var password = $scope.user.password;

            // Auth Logic will be here
        }
    }]);