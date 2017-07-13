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
    .controller("ListaUniversiCtrl", ['$scope', '$rootScope', '$location', 'UniversesList','UniversesUserList', function($scope, $rootScope, $location, UniversesList, UniversesUserList){
         $scope.dati={};
         $scope.dati.listUniverses=UniversesList.getListOfUniverses();



        $scope.sceltaUniverso= function(value){
            $rootScope.otherUniverse=value;
        };

        //lista delle storie degli utenti
        $scope.passaUniverso= function(id) {
            var listaStorie = UniversesUserList.getStoriesOfUser($rootScope.utenteFisso, id);
            listaStorie.$loaded().then(function () {
                settaLunghezza(id,listaStorie.length);
            });
        };

        function settaLunghezza(id,esp) {
            $scope.dati.listUniverses.$loaded().then(function () {
                for(var i=0;i<$scope.dati.listUniverses.length;i++){
                    if($scope.dati.listUniverses[i].$id===id) {
                        $scope.dati.listUniverses[i].espansioni=esp;
                    }
                }
            });
        }

        $scope.getLevel = function (user, universe, n) {
            var tot = 0;
            var stories = UniversesUserList.getStoriesOfUser(user, universe);
            stories.$loaded().then(function () {
                for(var i = 0; i<stories.length; i++) {
                    tot =tot+stories[i].voti;
                }
                var elem = document.getElementsByClassName("level");
                var width = 1;
                var id = setInterval(frame, 10);
                function frame() {
                    if (width >= tot*5) {
                        clearInterval(id);
                    } else {
                        width++;
                        elem[n].style.width = width + '%';
                    }
                }
            });
        };

    }]);

