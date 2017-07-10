/**
 * Created by marco on 10/07/2017.
 */

angular.module('myApp.achievements.achievementsService', [])

    .factory('Achievements', ['$firebaseArray', function ($firebaseArray) {
        return {

            /*checkPrize1: function(userId) {
                var userRef = this.checkForPrizes(userId);
                var voted = $firebaseArray(firebase.database().ref().child("users").child(userId).child("votedStories"));
                if(voted.length>=3) {
                    userRef.update({
                        prize1: true
                    });
                }
            },

            checkPrize2: function (userId) {
                var userRef = this.checkForPrizes(userId);
                var ref = firebase.database().ref().child("users").child(userId).child("universes");
                if(ref!==undefined) {
                    userRef.update({
                        prize2: true
                    })
                }
            },

            checkPrize3: function (userId) {
                var userRef = this.checkForPrizes(userId);
                var votes = this.getGlobalVotes(userId);
                if(votes>=3) {
                    userRef.update({
                        prize3: true
                    });
                }
            },*/

            checkPrize: function (userId, prizeNumber) {
                var userRef = this.checkForPrizes(userId);
                var votes = this.getGlobalVotes(userId);
                var ref;
                switch (prizeNumber) {
                    case 1:
                        ref = firebase.database().ref().child("users").child(userId).child("votedStories");
                        var voted = $firebaseArray(ref);
                        voted.$loaded(function () {
                            if(voted.length>=3) {
                                userRef.update({
                                    prize1: true
                                });
                            }
                        });
                        break;

                    case 2:
                        ref = firebase.database().ref().child("users").child(userId).child("universes");
                        if(ref!==undefined) {
                            userRef.update({
                                prize2: true
                            })
                        }
                        break;

                    case 3:
                        if(votes>=3) {
                            userRef.update({
                                prize3: true
                            });
                        }
                        break;

                    case 4:
                        ref = firebase.database().ref().child("users").child(userId).child("universes");
                        var univList = $firebaseArray(ref);
                        univList.$loaded(function () {
                            if(univList.length>=3) {
                                userRef.update({
                                    prize4: true
                                });
                            }
                        });
                        break;

                    case 5:
                        ref = firebase.database().ref().child("users").child(userId).child("universes");
                        var list = $firebaseArray(ref);
                        list.$loaded(function () {
                            for(var i = 0; i<list.length; i++) {
                                var ref = firebase.database().ref().child("users").child(userId).child("universes").child(list[i].$id);
                                var sublist = $firebaseArray(ref);
                                sublist.$loaded(function () {
                                    if(sublist.length>=3) {
                                        userRef.update({
                                            prize5: true
                                        });
                                        return;
                                    }
                                });
                            }
                        });
                        break;

                    default:
                        console.log("Invalid prizeNumber");
                }
            },

            getGlobalVotes: function (userId) {
                var tot = 0;
                var userRef = firebase.database().ref().child("users").child(userId).child("universes");
                var list = $firebaseArray(userRef);
                list.$loaded(function () {
                    for(var i = 0; i<list.length; i++) {
                        var ref = firebase.database().ref().child("users").child(userId).child("universes").child(list[i].$id);
                        var sublist = $firebaseArray(ref);
                        sublist.$loaded(function () {
                            for(var j = 0; j<sublist.length; j++) {
                                if(sublist[j].voti!==undefined) {
                                    tot += sublist[j].voti;
                                }
                            }
                        });
                    }
                });
                return tot;
            },

            checkForPrizes: function (userId) {
                var userRef = firebase.database().ref().child("users").child(userId).child("achievements");
                if(userRef===undefined) {
                    this.createPrizes(userId);
                }
                return userRef;
            },

            createPrizes: function (userId) {
                var userRef = firebase.database().ref().child("users").child(userId).child("achievements");
                userRef.set({
                    prize1: false,
                    prize2: false,
                    prize3: false,
                    prize4: false,
                    prize5: false,
                    prize6: false
                });
            }
        }
    }]);