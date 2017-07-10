/**
 * Created by edoardovr on 10/07/17.
 */

angular.module("myApp.News", ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/news', {
            templateUrl: 'News/news.html',
            controller: 'NewsCtrl',
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

    .controller("NewsCtrl", ['$scope', 'Users','UserList', 'currentAuth', '$firebaseAuth', '$rootScope', 'UniversesList', 'UsersChatService','$firebaseStorage', 'PostList', '$firebaseObject', function($scope, Users,UserList, currentAuth, $firebaseAuth, $rootScope, UniversesList, UsersChatService,$firebaseStorage, PostList) {

        $scope.tuttiIpost=PostList.getPosts();




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
