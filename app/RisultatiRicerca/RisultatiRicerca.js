/**
 * Created by Mattia on 23/06/2017.
 */
'use strict';

angular.module('myApp.risultatiRicerca', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/risultati', {
            templateUrl: 'RisultatiRicerca/RisultatiRicerca.html',
            controller: 'risultatiRicercaCtrl',
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
    .controller('risultatiRicercaCtrl', ['$scope', '$rootScope', 'Research','UserList', 'UniversesList',
        function($scope, $rootScope, Research, UserList, UniversesList) {
            $scope.dati = {};
            $scope.dati.availableUsers = UserList.getListOfUsers();
           // $rootScope.availableStories={};
            $scope.Universes = UniversesList.getListOfUniverses();



            $scope.Universes.$loaded().then(function()
            {

                for (var i=0; i<$scope.Universes.length; i++)
                {
                    $scope.storie=UniversesList.getStories($scope.Universes[i].$id);

                    richiamo($scope.storie);

                }

            });


            function richiamo(lista)
            {
                   lista.$loaded().then(function()
               {
                   for (var i=0; i<lista.length; i++)
                   {
                       $rootScope.availableStories = [].concat($rootScope.availableStories ,lista[i]);
                   }
                   console.log( $rootScope.availableStories );
               });
            }



            $scope.altri= function(value){
                $rootScope.other=value;
                $rootScope.ricercaEffettuata=true;
                $rootScope.currentPosition= 1;
            }

        }]);