/**
 * Created by marco on 10/07/2017.
 */

angular.module('myApp.achievements.achievementsService', [])

    .factory('Achievements', ['$firebaseArray', function ($firebaseArray) {

        return {

            checkPrize: function (userId, prizeNumber) {
                checkForPrizes(userId);
                var userRef = firebase.database().ref().child("users").child(userId).child("achievements");
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
                        ref.once('value')
                            .then(function(snapshot) {
                                if (snapshot.exists()) {
                                    userRef.update({
                                        prize2: true
                                    })
                                }
                            });
                        break;

                    case 3:
                        var votes = 0;
                        ref = firebase.database().ref().child("users").child(userId).child("universes");
                        var suplist = $firebaseArray(ref);
                        suplist.$loaded(function () {
                            for(var i = 0; i<suplist.length; i++) {
                                var ref = firebase.database().ref().child("users").child(userId).child("universes").child(suplist[i].$id);
                                var sublist = $firebaseArray(ref);
                                sublist.$loaded(function () {
                                    for(var j = 0; j<sublist.length; j++) {
                                        votes += sublist[j].voti;
                                        if(votes>=3) {
                                            userRef.update({
                                                prize3: true
                                            });
                                            break;
                                        }
                                    }

                                });
                            }
                        });
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

                function checkForPrizes(userId) {
                    var userRef = firebase.database().ref().child("users").child(userId).child("achievements");
                    userRef.once('value')
                        .then(function(snapshot) {
                            if(!snapshot.exists()) {
                                userRef.set({
                                    prize1: false,
                                    prize2: false,
                                    prize3: false,
                                    prize4: false,
                                    prize5: false,
                                    prize6: false
                                });
                            }
                        });
                }
            }
        }
    }]);