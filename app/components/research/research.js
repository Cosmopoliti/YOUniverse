/**
 * Created by Mattia on 23/06/2017.
 */
'use strict';

//declare the module that will act as parent of all the services dedicated to retrieve/save information about the users
angular.module('myApp.research', [
    'myApp.research.researchService'
])

    .value('version', '0.1');