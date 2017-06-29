'use strict';

//The service implemented in this module simply gets the list of registered users
angular.module('myApp.universes.universesListService', [])

    .factory('UniversesList', function($firebaseArray) {
        var universesListService = {
            getListOfUniverses: function () {
                //get the list of users
                var ref = firebase.database().ref().child("universes");
                // download the data into a local object
                return $firebaseArray(ref);
            }
        };
        return universesListService;


    });
