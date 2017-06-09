/**
 * Created by Mattia on 08/06/2017.
 */
'use strict';

var config = {
    apiKey: "AIzaSyBlnyRiiZc_qkLCBaisVzCRM_dy7IUSwI4",
    authDomain: "youniverse-41b12.firebaseapp.com",
    databaseURL: "https://youniverse-41b12.firebaseio.com",
    projectId: "youniverse-41b12",
    storageBucket: "youniverse-41b12.appspot.com",
    messagingSenderId: "898353654323"
};


angular.module("myApp", [
    'ngRoute',
    'myApp.appSignIn'
])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/SignIn'});
}]);

