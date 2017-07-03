'use strict';

//The service implemented in this module will save the status of the user (logged or not logged) ad will save user info at first registration
angular.module('myApp.universes.universeService', [])

    .factory('Universes', function($firebaseArray, $firebaseObject) {
        return {
            createNewUniverse: function(universeName,ambientazione,PGs,rule){
                var ref = firebase.database().ref().child("universes").child(universeName).child("info");
                // create a synchronized array
                ref.set({
                    Ambientazione: ambientazione,
                    Personaggi: PGs,
                    Regolamento: rule
                });
            },

            getUniverseInfo: function(universeName) {
                var universeRef = firebase.database().ref().child("universes").child(universeName);
                return $firebaseObject(universeRef);
            },

            getStoriaOfUser: function(userId,Universo,storia){
                var storiaRef = firebase.database().ref().child("users").child(userId).child("universes").child(Universo).child(storia);
                return $firebaseObject(storiaRef);
            }

        }
    });
/**
 * Created by Mattia on 28/06/2017.
 */
