/**
 * Created by marco on 12/07/2017.
 */

angular.module("myApp.CreaUniverso", ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/creazioneUniverso', {
            templateUrl: 'CreaUniverso/CreaUniverso.html',
            controller: 'CUCtrl',
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

    .controller("CUCtrl", ['$scope', '$rootScope', 'Achievements', '$location', function ($scope, $rootScope, Achievements, $location) {

        $scope.submitUniverse = function () {
            if($scope.name!==undefined && $scope.name!=="" && $scope.setting!==undefined && $scope.setting!=="" && $scope.characters!==undefined && $scope.characters!=="" && $scope.rules!==undefined && $scope.rules!=="") {
                firebase.database().ref().child("universes").child($scope.name).child("info").set({
                    Ambientazione: $scope.setting,
                    Personaggi: $scope.characters,
                    Regolamento: $scope.rules
                });
                $rootScope.insert_error = "";
                Achievements.checkPrize($rootScope.utenteFisso, 6);
                $rootScope.otherUniverse=$scope.name;
                $location.path('/universi');
            }
            else {
                $rootScope.insert_error = "Non hai inserito uno dei campi richiesti!";
            }
        }
    }]);
