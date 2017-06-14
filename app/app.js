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
firebase.initializeApp(config);

angular.module("myApp", [
    'ngRoute',
    'myApp.appSignIn',
    'myApp.Profilo',
    'myApp.authentication',
    'myApp.sottoviste',
    'myApp.userRegistrationView',
    'myApp.users'
])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/ProfiloUtente'});
}])
    .run(["$rootScope", "$location", function($rootScope, $location) {
        $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
            // We can catch the error thrown when the $requireSignIn promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
                $location.path("/SignIn");
            }
        });
    }])

    .controller('MainCtrl', ['$scope', '$rootScope', '$firebaseAuth', function($scope, $rootScope, $firebaseAuth) {
    //this controller only declares a function to get information about the user status (logged in / out)
    //it is used to show menu buttons only when the user is logged

    //set the variable that is used in the main template to show the active button
    $rootScope.dati = {};
    $rootScope.dati.currentView = 'home';
    $scope.isLogged = function()
    {
        if ($firebaseAuth().$getAuth())
            return true;
        else
            return false;
    }
}])

