/**
 * Created by Mattia on 31/05/2017.
 */
'use strict';

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

}])
    .controller("ProfiloCtrl", ['$scope', 'Users', 'currentAuth', '$firebaseAuth', '$rootScope', '$location', 'UsersChatService', function($scope, Users, currentAuth, $firebaseAuth, $rootScope, $location, UsersChatService) {

        $scope.dati={};
        //set the variable that is used in the main template to show the active button
        // $rootScope.dati.currentView = "ProfiloUtente";
        $scope.dati.user = UsersChatService.getUserInfo(currentAuth.uid);

        $scope.currentPosition = 1;
        $scope.changeView = function (id)
        {

            $scope.currentPosition = id;
        };

        $scope.logout = function () {
            //save the new status in the database (we do it before the actual logout because we can write in the database only if the user is logged in)
            Users.registerLogout(currentAuth.uid);
            //sign out
            $firebaseAuth().$signOut();
            $firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
                if (firebaseUser) {
                    console.log("User is yet signed in as:", firebaseUser.uid);
                } else {
                    $location.path("/SignIn");
                }
            });


        };



    }]);