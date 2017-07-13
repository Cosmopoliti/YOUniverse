/**
 * Created by edoardovr on 01/07/17.
 */
'use strict';

angular.module("myApp.Home", ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'Home/home.html',
            controller: 'HomeCtrl',
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

    .controller("HomeCtrl", ['$scope', 'Users','UserList', 'currentAuth', '$firebaseAuth', '$rootScope', 'UniversesList', 'UsersChatService','$firebaseStorage', 'PostList', '$firebaseObject', function($scope, Users,UserList, currentAuth, $firebaseAuth, $rootScope, UniversesList, UsersChatService,$firebaseStorage, PostList) {

        $rootScope.utenteFisso=UsersChatService.getUserInfo(currentAuth.uid).$id;
        $scope.tuttiIpost=PostList.getPosts();
        aCaso($scope.tuttiIpost);

        $scope.UserFollowings = UserList.getFollowings($rootScope.utenteFisso);
        $scope.isFollowing = false;

        function aCaso(array) {
                array.$loaded().then(function(){
                    for(var i=0;i<array.length;i++){
                        array[i].giorno=array[i].momento.substr(0,2);
                        array[i].rank= 0.5 - Math.random();
                    }
                });
            }





        //funzione che passa il valore i ricerca
        $rootScope.ricerca= function(value){
            $rootScope.valoreRicerca=value;

            location.href = '#!/risultati';

        };


        //recupero storia più votata
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
            }).then(function(){
                //$scope.storiaMostVotata.voti=0;
                for(var i=1; i<$rootScope.availableStories.length; i++) {
                    if (i > 1) {
                        if ($rootScope.availableStories[i].voti > $scope.storiaMostVotata.voti) {
                            $scope.storiaMostVotata = $rootScope.availableStories[i];
                        }
                    }
                    else {
                        $scope.storiaMostVotata = $rootScope.availableStories[i];
                    }

                }
            });

        }

        //la più nuova
        $scope.tuttiIpost.$loaded().then(function() {
            for(var i=0; i<$scope.tuttiIpost.length; i++){
                if(i>1){
                    if ($scope.tuttiIpost[i].momento > $scope.storiaMostNuova.momento) {
                        $scope.storiaMostNuova = $scope.tuttiIpost[i];
                    }
                }
                else{$scope.storiaMostNuova=$scope.tuttiIpost[i]}
                }
        });



      $scope.getUser=function (userId, postId) {
          var userName=UsersChatService.getUserInfo(userId);
          userName.$loaded().then(function(){
              PostList.setImage(postId,userName.profilo);
              PostList.setName(postId,userName.name);
          });
      };

        $scope.altri= function(value){
            $rootScope.other=value;
            $rootScope.ricercaEffettuata=true;
            $rootScope.currentPosition= 1;
        };

        $scope.storiaDaLeggere = function(c,b) {
            $rootScope.S=b;
            $rootScope.T=c;
        };

        $scope.matchUser = function (user) {
            $scope.isFollowing = false;
            var list = $scope.UserFollowings;
            list.$loaded(function () {
                for(var i=0; i<list.length; i++) {
                    if(user === list[i].$id) {
                        $scope.isFollowing = true;
                    }
                }
            });
        };

        var Today = new Date();
        var giorno = Today.getDate()-7;
        var mese;
        if (giorno<=0) {
            mese = Today.getMonth();
            switch (mese) {
                case 2:
                    giorno += 28;
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    giorno += 30;
                    break;
                default:
                    giorno += 31;
            }
        } else {
            mese = Today.getMonth()+1;
            console.log(mese);
        }
        var ora = '00';
        var minuti = '00';

        if (giorno <10){
            giorno='0'+giorno;
        }

        if (mese <10){
            mese='0'+mese;
        }


        $rootScope.inizioSettimana = (giorno+'/'+ mese+'  '+ora+':'+minuti);


    }]);
