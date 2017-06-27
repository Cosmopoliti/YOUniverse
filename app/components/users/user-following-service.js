'use strict';

//The service implemented in this module simply gets the list of registered users
angular.module('myApp.users.usersFollowingService', [])

    .factory('FollowingList', function($firebaseArray) {
        var FollowingList = {
            getFollowings: function (userId) {
                var ref = firebase.database().ref().child("users").child(userId).child("seguiti");
                // download the data into a local object
                return $firebaseArray(ref);
            }
        };
        return FollowingList;

    });
