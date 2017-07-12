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
            },

            addComment: function (universo,storia,commento,utente) {
                var today = new Date();
                var giorno =today.getDate();
                var ore = today.getHours();
                var min =  today.getMinutes();
                var month = today.getMonth()+1; //January is 0!

                if(giorno<10) {
                    giorno='0'+giorno;
                }

                if(month<10) {
                    month='0'+month;
                }

                if(ore<10) {
                    ore='0'+ore;
                }
                if(min<10) {
                    min='0'+min;
                }

                var data=(giorno+"/"+month+"  "+ore+":"+min);
                var storiaRef = firebase.database().ref().child("universes").child(universo).child("stories").child(storia).child("commenti");
                $firebaseArray(storiaRef).$add({
                    testo: commento,
                    scrittore: utente,
                    data: data,
                });
            }


        }
    });
/**
 * Created by Mattia on 28/06/2017.
 */
