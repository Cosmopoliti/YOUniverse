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

            getStoriaOfUser: function(Universo,storia){
                var storiaRef = firebase.database().ref().child("universes").child(Universo).child("stories").child(storia);
                return $firebaseObject(storiaRef);
            },

            addVotedStory: function (story, user) {
                var ref = firebase.database().ref().child("users").child(user).child("votedStories");
                ref.child(story).set(story);
                return $firebaseArray(ref);
            },

            removeVotedStory: function (story, user) {
                var ref = firebase.database().ref().child("users").child(user).child("votedStories");
                ref.child(story).remove();
                return $firebaseArray(ref);
            }
        }
    });
/**
 * Created by Mattia on 28/06/2017.
 */
