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
    .controller("LetturaCtrl", ['$scope', '$rootScope','Universes',function($scope, $rootScope,UsersChatService,UniversesUserList,currentAuth ) {

     $scope.StoriaUtente=$rootScope.S;
     $scope.Titolo=$rootScope.T;

        /* $rootScope.dropDownChangeView =function(id){
             $scope.dati.user = UsersChatService.getUserInfo(currentAuth.uid);
             $rootScope.ListUniversesOfUser=UniversesUserList.getUniversesOfUser(currentAuth.uid);
             $rootScope.ricercaEffettuata=false;
             $rootScope.currentPosition = id;
             bott.style = "margin-top: 37px; display:none";
             bott2.style = "height: 50px; margin-top: 37px; display:none";
             find=false;
             console.log($rootScope.currentPosition);
             lollo();
             console.log($rootScope.currentPosition);
         };*/

    }]);