/**
 * Created by marco on 16/06/2017.
 */
'use strict';

angular.module('myApp.users.usersInfoService', [])

    .factory('UsersInfo', function() {
        return {
            insertNewInfo: function (infoName, infoValue) {
                firebase.database().ref().child("users").child(infoName).set(infoValue);
            }
        };
    });

