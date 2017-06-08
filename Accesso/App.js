/**
 * Created by Mattia on 08/06/2017.
 */
var config = {
    apiKey: "AIzaSyBlnyRiiZc_qkLCBaisVzCRM_dy7IUSwI4",
    authDomain: "youniverse-41b12.firebaseapp.com",
    databaseURL: "https://youniverse-41b12.firebaseio.com",
    projectId: "youniverse-41b12",
    storageBucket: "youniverse-41b12.appspot.com",
    messagingSenderId: "898353654323"
};
firebase.initializeApp(config);

angular.module('myApp', [
    "firebase",
    'ngRoute',
    'myProfilo',
    'myUniversi'
])
