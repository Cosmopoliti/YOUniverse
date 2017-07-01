/**
 * Created by Mattia on 06/06/2017.
 */


angular.module("myApp.Universi", ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/universi', {
            templateUrl: 'Universi/IndexUniversi.html',
            controller: 'UniversiCtrl',
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
            /*.when('/Storie', {
                templateUrl: 'sub-views/Storie.html'
            })
            .when('/Mappa', {
                templateUrl: 'sub-views/Mappa.html'
            })
            .otherwise({redirectTo: '/Info'});*/
    }])


.controller("UniversiCtrl", ['$scope', '$rootScope', "$location", function($scope, $rootScope, $location) {

$rootScope.currentPosition = 9;
$rootScope.changeView = function (id)
{
    $rootScope.currentPosition = id;
    $location.path("/ProfiloUtente");
};

}]);