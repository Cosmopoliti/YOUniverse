/**
 * Created by Mattia on 31/05/2017.
 */
'use strict';

angular.module("myApp.Profilo", ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/ProfiloUtente', {
            templateUrl: 'ProfiloUtente/indexProfilo.html',
            controller: 'ProfiloCtrl',
            resolve: {
                // controller will not be loaded until $requireSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the factory below
                "currentAuth": ["Auth", function(Auth) {
                    // $requireSignIn returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $routeChangeError (see above)
                    return Auth.$requireSignIn();
                }]

            }
        })

    }])
    .controller("ProfiloCtrl", ['$scope', 'Users', 'FollowerList', 'currentAuth', '$firebaseAuth', '$rootScope', '$location', 'UsersChatService', function($scope, Users, FollowerList, currentAuth, $firebaseAuth, $rootScope, $location, UsersChatService,$firebaseStorage) {

        $scope.dati={};
        //set the variable that is used in the main template to show the active button
        // $rootScope.dati.currentView = "ProfiloUtente";

        $scope.dati.user = UsersChatService.getUserInfo(currentAuth.uid);


        $rootScope.ricerca= function(value){
            $rootScope.valoreRicerca=value;
            console.log($rootScope.valoreRicerca);
            location.href = '#!/risultati';
        };


        var bott = document.getElementById("mene");
        var bott2 = document.getElementById("tene");
        var find=false;

        window.onload = function(e) {
                lollo();
        };

        function lollo(){
            $scope.dati.followers=FollowerList.getFollowers(currentAuth.uid);
            $scope.dati.followers.$loaded().then(function()
            {
                //per stampare qualcosa ottenuto con $firebaseObject
                /*
                 for (var key in $scope.dati.followers)
                 {
                 console.log(JSON.stringify($scope.dati.followers[key]));
                 console.log($scope.dati.followers[key].Cosmopoliti);
                 }
                 */
                $scope.dati.user.number=$scope.dati.followers.length;
                for (var i=0; i<$scope.dati.followers.length; i++)
                {
                    console.log($scope.dati.followers[i].$id);
                    if($scope.dati.followers[i].$id===$scope.dati.user.name){
                        find=true;
                    }
                    if(find===true){
                        bott.style = "margin-top: 37px; display:none";
                        bott2.style = "height: 50px; margin-top: 37px; display";
                    }
                }
            })
        }

        $scope.follower = function (){
            Users.addFollower(currentAuth.uid ,$scope.dati.user.name);
            bott.style = "margin-top: 37px; display:none";
            bott2.style = "height: 50px; margin-top: 37px; display";
            lollo();
        };
         $scope.sfollower = function (){
             Users.removeFollower(currentAuth.uid ,$scope.dati.user.name);
         bott.style = "margin-top: 37px; display";
         bott2.style = "height: 50px; margin-top: 37px; display:none";
         find=false;
         };


        //Cambio immagine profilo
        var ctrl = this;
        $scope.fileToUpload = null;
        $scope.imgPath= "";


        $("#profileImage").click(function(e) {
            $("#imageUpload").click();
        });

        function uploadImage(uploader) {
            $scope.fileToUpload = uploader.files[0];
            console.log( $scope.fileToUpload.name);
            var fileName = $scope.fileToUpload.name;
            var storageRef = firebase.storage().ref("Img/" + fileName);
            $scope.storage = $firebaseStorage(storageRef);
            var uploadTask = $scope.storage.$put($scope.fileToUpload);
            uploadTask.$complete(function (snapshot) {
                $scope.imgPath = snapshot.downloadURL;

                Users.changeImage(currentAuth.uid, $scope.imgPath);
            });
        }

        $("#imageUpload").change(function(){
            uploadImage(this);
        });


         //sotto viste
        $scope.currentPosition = 1;
        $scope.changeView = function (id)
        {

            $scope.currentPosition = id;
        };


        //Funzione log out
        $scope.logout = function () {
            //save the new status in the database (we do it before the actual logout because we can write in the database only if the user is logged in)
            Users.registerLogout(currentAuth.uid);
            //sign out
            $firebaseAuth().$signOut();
            $firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
                if (firebaseUser) {
                    console.log("User is yet signed in as:", firebaseUser.uid);
                } else {
                    $location.path("/SignIn");
                }
            });


        };


        //aggiornamento profilo
        $scope.updateInfo = function(infoName, infoValue) {
        Users.updateUserInfo(currentAuth.uid, infoName, infoValue);
        };

        $scope.listOf = function(infoName, infoValue) {

                var res = infoValue.split(",");

                    for (var i = 0; i < res.length; i++) {

                        console.log(res[i]);
                        Users.updatelistOf(currentAuth.uid, infoName, i, res[i]);

                }

        };


    }]);