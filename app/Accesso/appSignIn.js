/**
 * Created by Mattia on 08/06/2017.
 */
angular.module("myApp.appSignIn", ['ngRoute', 'firebase'])

// Declared route
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/SignIn', {
            templateUrl: 'Accesso/SignIn.html',
            controller: 'SignCtrl'
        })
    }])

    // Home controller
    .controller('SignCtrl', ['$scope', '$rootScope', 'Auth', '$location', '$log', function($scope, $rootScope, Auth, $location, $log) {
        $scope.user={};
        $scope.auth = Auth; //acquires authentication from app.js (if it was done)

        //this function will be called when the "Login" button will be pressed
        $scope.signIn = function() {
            $scope.firebaseUser = null;
            $scope.error = null;
            $scope.auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser) {
                // login successful: redirect to the pizza list
                $location.path("/ProfiloUtente");
            }).catch(function(error) {
                $scope.error = error;
                $log.error(error.message);
            });
        };
    }]);