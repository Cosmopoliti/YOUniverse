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
            },

            getStories:function (UniverseID) {
                var ref = firebase.database().ref().child("universes").child(UniverseID).child("stories");
                return $firebaseArray(ref);
            },

            getCommenti: function (Universo, storia) {
                var ref = firebase.database().ref().child("universes").child(Universo).child("stories").child(storia).child("commenti");
                return $firebaseArray(ref);
            }
        };
        return universesListService;


    });

