/**
 * Created by Mattia on 08/06/2017.
 */
'use strict';

angular.module("myApp.appSignIn", ['ngRoute', 'firebase'])

// Declared route
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/SignIn', {
            templateUrl: 'Accesso/SignIn.html',
            controller: 'SignCtrl'
        })
    }])

    // Home controller
    .controller('SignCtrl', ['$scope', '$rootScope', 'Auth', '$location', '$log', 'Users', function($scope, $rootScope, Auth, $location, $log, Users) {
        $scope.user={};
        $scope.auth = Auth; //acquires authentication from app.js (if it was done)

        //this function will be called when the "Login" button will be pressed
        $scope.signIn = function() {
            $scope.firebaseUser = null;
            $scope.error = null;
            $scope.auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser) {
                var userId = firebaseUser.uid;
                Users.registerLogin(userId, $scope.user.email);
                $location.path("/home");
            }).catch(function(error) {
                $scope.error = error;
                $log.error(error.message);
            });
        };

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





        // Get the modal
        var modal2 = document.getElementById("modalLog");

// Get the button that opens the modal
        var btn3 = document.getElementById("Log");

// Get the <span> element that closes the modal
        var btn4 = document.getElementById("close2");


// When the user clicks on the button, open the modal
        btn3.onclick = function () {
            modal2.style.display = "block";
        };

// When the user clicks on cancel, close the modal
        btn4.onclick = function () {
            modal2.style.display = "none";
        };
    }]);