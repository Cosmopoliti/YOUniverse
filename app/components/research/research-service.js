/**
 * Created by Mattia on 23/06/2017.
 */
'use strict';

//The service implemented in this module simply gets the list of registered users
angular.module('myApp.research.researchService', [])

    .factory('Research', function($firebaseArray) {
        var researchList = {
            getListOfValue: function () {
                //get the list of users
                var ref = firebase.database().ref().child("users");
                // download the data into a local object
                return $firebaseArray(ref);
            }
        };
        return researchList;


    });