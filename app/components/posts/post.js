'use strict';

//declare the module that will act as parent of all the services dedicated to retrieve/save information about the users
angular.module('myApp.post', [
    'myApp.post.postService'
])

    .value('version', '0.1');