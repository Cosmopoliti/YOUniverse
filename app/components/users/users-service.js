'use strict';

//The service implemented in this module will save the status of the user (logged or not logged) ad will save user info at first registration
angular.module('myApp.users.usersService', [])

    .factory('Users', function($firebaseArray) {
        return {
            registerLogin: function (userId, email) {
                //add the user to list of users and set the logged value to true
                var ref = firebase.database().ref().child("users").child(userId);
                // create a synchronized array
                ref.update({
                    email: email,
                    logged: true
                });
            },
            registerLogout: function (userId)
            {
                var ref = firebase.database().ref().child("users").child(userId);
                // create a synchronized array
                ref.update({
                    logged: false
                });
            },
            registerNewUserInfo: function (userId, name, email) {
                //add the user to list of users and set the logged value to true
                var ref = firebase.database().ref().child("users").child(userId);
                // create a synchronized array
                ref.set({
                    name: name,
                    email: email
                });
            },
            updateUserInfo: function (userId, infoName, infoValue) {
                firebase.database().ref().child("users").child(userId).child(infoName).set(infoValue);
            },

            updatelistOf: function(userId, infoName, index, valore){

            var ref = firebase.database().ref().child("users").child(userId).child(infoName).child(index).set(valore);

            },

            changeImage: function(userId, image){
               var ref = firebase.database().ref().child("users").child(userId).child("profilo").set(image);
            },


            addFollower: function(userId,name){
                var ref = firebase.database().ref().child("users").child(userId).child("seguitori").child(name).set(name);
            },

            addFollowing: function (userId,name) {
                var ref = firebase.database().ref().child("users").child(userId).child("seguiti").child(name).set(name);
            },

            removeFollower: function (userId,name) {
                var ref = firebase.database().ref().child("users").child(userId).child("seguitori").child(name).remove();
            },

            removeFollowing: function (userId,name) {
                var ref = firebase.database().ref().child("users").child(userId).child("seguiti").child(name).remove();
            }

        };
    });
