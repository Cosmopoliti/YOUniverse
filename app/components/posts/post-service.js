'use strict';

//The service implemented in this module simply gets the list of registered users
angular.module('myApp.post.postService', [])

    .factory('PostList', function($firebaseArray) {
        var ref = firebase.database().ref().child("posts");
        return {
            createPost: function(giorno,mese, ora, minuti, titolo, storia,userId, immagine){
                var newPost = {};
                newPost['user'] = userId;
                newPost['title'] = titolo;
                newPost['storia'] = storia;
                newPost['immagine']=immagine;

                var data=(giorno+"/"+mese+"  "+ora+":"+minuti);
                newPost['momento'] = data;

                return $firebaseArray(ref).$add(newPost);
            },

            getPosts: function() {
                return $firebaseArray(ref);
            }
        };


    });
