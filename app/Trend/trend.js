/**
 * Created by edoardovr on 09/07/17.
 */


angular.module("myApp.Trend", ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/trend', {
            templateUrl: 'Trend/trend.html',
            controller: 'TrendCtrl',
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

    .controller("TrendCtrl", ['$scope', 'Users','UserList', 'currentAuth', '$firebaseAuth', '$rootScope', 'UniversesList', 'UsersChatService','UniversesUserList','$firebaseStorage', 'PostList', '$firebaseObject', function($scope, Users,UserList, currentAuth, $firebaseAuth, $rootScope, UniversesList, UsersChatService,UniversesUserList,$firebaseStorage, PostList) {

        $scope.tuttiIpost=PostList.getPosts();

        $scope.Universes = UniversesList.getListOfUniverses();


        //inserisci voti ai post
        $scope.Universes.$loaded().then(function()
        {
            for (var i=0; i<$scope.Universes.length; i++)
            {
                $scope.storie=UniversesList.getStories($scope.Universes[i].$id);
                passaStorie($scope.storie);
            }
        });

        function passaStorie(lista) {
            lista.$loaded().then(function () {
                for (var i = 0; i < lista.length; i++) {
                   confronta(lista[i]);
                }
            });
        }

        function  confronta(storia) {

            $scope.tuttiIpost.$loaded().then(function () {
                for (var i = 0; i < $scope.tuttiIpost.length; i++) {
                    if($scope.tuttiIpost[i].StoryId===storia.$id){
                    $scope.tuttiIpost[i].voto = storia.voti;
                    }
                }
            });
        }


        //recupero storia più votata tua
        $scope.Universes2 = UniversesUserList.getUniversesOfUser($rootScope.utenteFisso);

        $scope.Universes2.$loaded().then(function()
        {
            for (var i=0; i<$scope.Universes2.length; i++)
            {
                $scope.storie2=UniversesUserList.getStoriesOfUser($rootScope.utenteFisso,$scope.Universes2[i].$id);

                richiamo2($scope.storie2);
            }

        });

        function richiamo2(lista)
        {
            lista.$loaded().then(function()
            {
                for (var i=0; i<lista.length; i++)
                {
                    $rootScope.availableStories2 = [].concat($rootScope.availableStories2 ,lista[i]);
                }
            }).then(function(){
                //$scope.storiaMostVotata.voti=0;
                for(var i=1; i<$rootScope.availableStories2.length; i++) {

                    if (i > 1) {
                        if ($rootScope.availableStories2[i].voti > $scope.storiaMostVotataTua.voti) {
                            $scope.storiaMostVotataTua = $rootScope.availableStories2[i];
                        }
                    }
                    else {
                        $scope.storiaMostVotataTua = $rootScope.availableStories2[i];
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


    }]);

