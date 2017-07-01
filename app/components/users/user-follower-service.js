'use strict';

//The service implemented in this module simply gets the list of registered users
angular.module('myApp.users.usersFollowerService', [])

    .factory('FollowerList', function($firebaseArray) {
        var FollowerList = {
            getFollowers: function (userId) {
                var ref = firebase.database().ref().child("users").child(userId).child("seguitori");
                // download the data into a local object
                return $firebaseArray(ref);
            }
        };
        return FollowerList;

    });