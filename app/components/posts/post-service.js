'use strict';

//The service implemented in this module simply gets the list of registered users
angular.module('myApp.post.postService', [])

    .factory('PostList', function($firebaseArray) {
        var ref = firebase.database().ref().child("posts");
        return {
            createPost: function(giorno,mese, ora, minuti, titolo, storia,userId,uniId,storyId){
                var newPost = {};
                newPost['user'] = userId;
                newPost['universe'] = uniId;
                newPost['StoryId']=storyId;
                newPost['title'] = titolo;
                newPost['storia'] = storia;


                var data=(giorno+"/"+mese+"  "+ora+":"+minuti);
                newPost['momento'] = data;

                return $firebaseArray(ref).$add(newPost);
            },
            setImage:function (postId,img) {
                var ref = firebase.database().ref().child("posts").child(postId).child("image").set(img);
            },
            setName:function (postId,name) {
                var ref = firebase.database().ref().child("posts").child(postId).child("userName").set(name);
            },
            getPosts: function() {
                return $firebaseArray(ref);
            }
        };


    });
