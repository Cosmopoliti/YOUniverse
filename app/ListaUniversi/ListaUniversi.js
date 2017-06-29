'use strict';

angular.module("myApp.ListaUniversi", ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/ListaUniversi', {
            templateUrl: 'ListaUniversi/ListaUniversi.html',
            controller: 'ListaUniversiCtrl',
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
    .controller("ListaUniversiCtrl", ['$scope', '$rootScope', '$location', 'UniversesList', function($scope, $rootScope, $location, UniversesList){
         $scope.dati={};
         $scope.dati.listUniverses=UniversesList.getListOfUniverses();

        $scope.sceltaUniverso= function(value){
            $rootScope.otherUniverse=value;
        }

    }]);

