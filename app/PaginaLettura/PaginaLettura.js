/**
 * Created by Mattia on 03/07/2017.
 */
angular.module("myApp.Lettura", ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/lettura', {
            templateUrl: 'PaginaLettura/PaginaLettura.html',
            controller: 'LetturaCtrl',
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
    .controller("LetturaCtrl", ['$scope', '$rootScope','Universes',function($scope, $rootScope,Universes) {

     $scope.StoriaUtente=$rootScope.S;
     $scope.UniversoRef=$rootScope.T;

     $scope.StoriaDaLeggere=Universes.getStoriaOfUser($scope.UniversoRef,$scope.StoriaUtente);


     var vota=document.getElementById("Vota");
     var NoVota=document.getElementById("NoVota");

     $scope.Vota= function () {
         vota.style="display:none";
         NoVota.style="display";
     };

     $scope.NoVota= function () {
         NoVota.style="display:none";
         vota.style="display";
        };

     /*$scope.setView = function(id){
            $rootScope.currentPosition = id;
        };*/

    }]);