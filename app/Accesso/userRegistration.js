/**
 * Created by Mattia on 14/06/2017.
 */
'use strict';

angular.module('myApp.userRegistrationView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/SignIn', {
            templateUrl: 'Accesso/SignIn.html',
            controller: 'UserRegistrationCtrl'
        });
    }])

    .controller('UserRegistrationCtrl', ['$scope', '$rootScope', 'Auth', 'Users', '$location', function($scope, $rootScope, Auth, Users, $location) {
        $scope.user={};
        //set the variable that is used in the main template to show the active button

        $scope.signUp = function() {
            //check if the second password is equal to the first one
            if ($scope.user.password!= '' && $scope.user.password === $scope.user.password2) {
                //create a new user with specified email and password
                Auth.$createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
                    .then(function (firebaseUser) {
                        //after creating the user, we will perform a login and then the new information will be saved in the database
                        //(the reason is that we cannot write in the database if we are not logged in ... it is not the best way of doing it but it is ok for our prototype)
                        Auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(internalFirebaseUser) {
                            var userId = internalFirebaseUser.uid;
                            Users.registerNewUserInfo(userId, $scope.user.name, $scope.user.email);
                            Users.registerLogin(userId, $scope.user.email);
                            // login successful: redirect to the pizza list
                            $location.path("/ProfiloUtente");
                        }).catch(function(error) {
                            $scope.error = error;
                            console.log(error.message);
                        });
                    }).catch(function (error) {
                    $scope.error = error;
                    console.log(error.message);
                });
            }
        };
    }]);