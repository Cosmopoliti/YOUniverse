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
    .controller("LetturaCtrl", ['$scope', '$rootScope','Universes','UniversesList','UsersChatService','$firebaseArray','$firebaseObject','$firebaseStorage', 'currentAuth', function($scope, $rootScope,Universes,UniversesList,UsersChatService, $firebaseArray,$firebaseObject,$firebaseStorage, currentAuth) {

     $scope.StoriaUtente=$rootScope.S;
     $scope.UniversoRef=$rootScope.T;

     $scope.StoriaDaLeggere=Universes.getStoriaOfUser($scope.UniversoRef,$scope.StoriaUtente);
     $scope.listaCommenti=UniversesList.getCommenti($scope.UniversoRef,$scope.StoriaUtente);

     var votedRef = firebase.database().ref().child("users").child(currentAuth.uid).child("votedStories");
     var voteList = $firebaseArray(votedRef);

     $scope.Vota= function () {
         var voti = $scope.StoriaDaLeggere.voti;
         if(voti===undefined) {
             voti = 1;
         }
         else {
             voti++;
         }
         $scope.StoriaDaLeggere.voti = voti;
         $scope.StoriaDaLeggere.$save();
         firebase.database().ref().child("users").child(currentAuth.uid).child("universes").child($scope.UniversoRef)
             .child($scope.StoriaDaLeggere.$id).child("voti").set(voti);
         voteList = Universes.addVotedStory($scope.StoriaDaLeggere.$id, currentAuth.uid);
     };

     $scope.NoVota= function () {
         var voti = $scope.StoriaDaLeggere.voti;
         voti--;
         $scope.StoriaDaLeggere.voti = voti;
         $scope.StoriaDaLeggere.$save();
         firebase.database().ref().child("users").child(currentAuth.uid).child("universes").child($scope.UniversoRef)
             .child($scope.StoriaDaLeggere.$id).child("voti").set(voti);
         voteList = Universes.removeVotedStory($scope.StoriaDaLeggere.$id, currentAuth.uid);
     };

     $scope.updateButton = function () {
         if(voteList.length===0) {
             return false;
         }
         for(var i=0; i<voteList.length; i++) {
             if(voteList[i].$id===$scope.StoriaDaLeggere.$id) {
                 return true;
             }
             else {
                 continue;
             }
         }
         return false;
     };

     //recupero utente che posta commento
        $scope.utente=UsersChatService.getUserInfo($rootScope.utenteFisso);
        $scope.utente.$loaded().then(function() {
            $rootScope.scrittore = $scope.utente.name;
            console.log($rootScope.scrittore);
        });

        //postaCommento
        var testo=document.getElementById("commento");
        testo.addEventListener("keydown",function (e) {
            if (e.keyCode === 13) {

                Universes.addComment($scope.UniversoRef,$scope.StoriaUtente,testo.value,$rootScope.scrittore);
                testo.value="";
            }
        });

    }]);