/**
 * Created by Mattia on 06/06/2017.
 */


angular.module("myUniversi", ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/Info', {
                templateUrl: 'sub-views/Info.html'
            })
            .when('/Storie', {
                templateUrl: 'sub-views/Storie.html'
            })
            .when('/Mappa', {
                templateUrl: 'sub-views/Mappa.html'
            })
            .otherwise({redirectTo: '/Info'});
    }]);