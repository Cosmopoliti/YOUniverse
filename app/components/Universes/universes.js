'use strict';

//declare the module that will act as parent of all the services dedicated to retrieve/save information about the users
angular.module('myApp.universes', [
    'myApp.universes.universeService',
    'myApp.universes.universesListService',
    'myApp.universes.universesUserListService'
])

    .value('version', '0.1');
/**
 * Created by Mattia on 28/06/2017.
 */
