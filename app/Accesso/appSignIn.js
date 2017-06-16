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





        // Get the modal
        var modal = document.getElementById("myModal");
        var modal2 = document.getElementById("modalLog");

// Get the button that opens the modal
        var btn = document.getElementById("Iscrizione");
        var btn3 = document.getElementById("Log");

// Get the <span> element that closes the modal
        var btn2 = document.getElementById("close");
        var btn4 = document.getElementById("close2");


// When the user clicks on the button, open the modal
        btn.onclick = function () {
            modal.style.display = "block";
        };
        btn3.onclick = function () {
            modal2.style.display = "block";
        };

// When the user clicks on cancel, close the modal
        btn2.onclick = function () {
            modal.style.display = "none";
        };
        btn4.onclick = function () {
            modal2.style.display = "none";
        };
    }]);