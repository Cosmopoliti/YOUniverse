/**
 * Created by Mattia on 06/06/2017.
 */


angular.module("myApp.Universi", ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/universi', {
            templateUrl: 'Universi/IndexUniversi.html',
            controller: 'UniversiCtrl',
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


.controller("UniversiCtrl", ['$scope', '$rootScope','Users', 'Universes', 'currentAuth','$firebaseAuth', '$location', function($scope, $rootScope, Users, Universes, currentAuth, $firebaseAuth, $location ) {


    $rootScope.dati={};


    $rootScope.dati.universe=Universes.getUniverseInfo("Prova");
    console.log($rootScope.dati.universe);


    //Funzione log out
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



    //gestione sottoviste
    $rootScope.currentPosition = 9;
    $scope.changeView = function (id)
   {
    $rootScope.currentPosition = id;
    };

    $scope.setView = function(id){
        $rootScope.currentPosition = id;
    };

}]);