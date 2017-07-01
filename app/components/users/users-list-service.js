'use strict';

//The service implemented in this module simply gets the list of registered users
angular.module('myApp.users.usersListService', [])

    .factory('UserList', function($firebaseArray) {
        var userListService = {
            getListOfUsers: function () {
                //get the list of users
                var ref = firebase.database().ref().child("users");
                // download the data into a local object
                return $firebaseArray(ref);
            },
            getFollowings: function (userId) {
                var ref = firebase.database().ref().child("users").child(userId).child("seguiti");
                // download the data into a local object
                return $firebaseArray(ref);
            },
            getFollowers: function (userId) {
                var ref = firebase.database().ref().child("users").child(userId).child("seguitori");
                // download the data into a local object
                return $firebaseArray(ref);
            }
        };
        return userListService;


    });