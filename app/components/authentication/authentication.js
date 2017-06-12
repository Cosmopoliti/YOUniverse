'use strict';

//declare the module that will act as parent of all the services dedicated to user Authentication
angular.module('myApp.authentication', [
    'myApp.authentication.authenticationService',
])

.value('version', '0.1');
