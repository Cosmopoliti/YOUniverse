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


.controller("UniversiCtrl", ['$scope', '$rootScope','Users','UniversesUserList', 'Universes', 'UniversesList', 'currentAuth','$firebaseAuth', '$location', function($scope, $rootScope, Users,UniversesUserList, Universes,UniversesList, currentAuth, $firebaseAuth, $location ) {


    $rootScope.dati={};


    $rootScope.dati.universe=Universes.getUniverseInfo($rootScope.otherUniverse);

    //lista delle storie degli utenti
    $rootScope.listaStorieUtente=UniversesUserList.getStoriesOfUser($rootScope.utenteFisso,$rootScope.otherUniverse);


    //lista delle storie degli altri
    $rootScope.listaStorieUniverso=UniversesList.getStories($rootScope.otherUniverse);

    $rootScope.listaStorieUniverso.$loaded().then(function(){
        for (var i=0; i<$scope.listaStorieUniverso.length; i++) {
            controllo($scope.listaStorieUniverso[i]);
        }
    });

    function controllo(storia) {

        $rootScope.listaStorieUtente.$loaded().then(function(){
            for (var i=0; i<$rootScope.listaStorieUtente.length; i++) {

                if($rootScope.listaStorieUtente[i].title===storia.title && $rootScope.listaStorieUtente[i].story===storia.story){
                   var index= $rootScope.listaStorieUniverso.indexOf(storia);
                    $rootScope.listaStorieUniverso.splice(index, 1);
                }
            }
        });

    };




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

   //recupero espansioni
    $rootScope.listaStorieUtente.$loaded().then(function () {
        $rootScope.espansioniPersonali=$rootScope.listaStorieUtente.length;

    });
    $rootScope.listaStorieUniverso.$loaded().then(function () {
        $rootScope.espansioniTotali=$rootScope.listaStorieUniverso.length;

    });



    //gestione sottoviste
    $rootScope.currentPosition = 9;
    $scope.changeView = function (id)
   {
    $rootScope.currentPosition = id;
    };

    $scope.setView = function(id){
        $rootScope.currentPosition = id;
    };


    $scope.storiaDaLeggere = function(c,b) {
        $rootScope.S=c;
        $rootScope.T=b
    };

}]);