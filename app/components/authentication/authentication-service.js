'use strict';

//This module implement the service that handle the $firebaseAuth
angular.module('myApp.authentication.authenticationService', [])

    .factory('Auth', ["$firebaseAuth", function($firebaseAuth) {
            return $firebaseAuth();
    }]);
