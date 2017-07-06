/**
 * Created by Mattia on 29/06/2017.
 */
'use strict';

//The service implemented in this module simply gets the list of registered users
angular.module('myApp.universes.universesUserListService', [])

    .factory('UniversesUserList', function($firebaseArray) {
        var universesUserList = {
            getUniversesOfUser: function(userID){
                var ref = firebase.database().ref().child("users").child(userID).child("universes");
                // download the data into a local object
                return $firebaseArray(ref);
            },
            getStoriesOfUser: function(userId,Universo){
                var ref = firebase.database().ref().child("users").child(userId).child("universes").child(Universo);
                return $firebaseArray(ref);
            },

            getTotalVotes: function (userId, Universo) {
                var ref = firebase.database().ref().child("users").child(userId).child("universes").child(Universo);
            }

        };
        return universesUserList;

    });
