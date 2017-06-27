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
    .controller('risultatiRicercaCtrl', ['$scope', '$rootScope', 'Research','UserList',
        function($scope, $rootScope, Research, UserList) {
            $scope.dati = {};
            $scope.dati.availableUsers = UserList.getListOfUsers();


            $scope.altri= function(value){
                $rootScope.other=value;
                $rootScope.ricercaEffettuata=true;
            }

        }]);