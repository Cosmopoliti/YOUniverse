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


        //cambio Sottoviste
        $scope.currentPosition = 1;

        $scope.dropDownChangeView =function(id){
            $scope.dati.user = UsersChatService.getUserInfo(currentAuth.uid);
            $rootScope.ricercaEffettuata=false;
            $scope.currentPosition = id;
            bott.style = "margin-top: 37px; display:none";
            bott2.style = "height: 50px; margin-top: 37px; display:none";
        };

        $scope.changeView = function (id)
        {
            $scope.currentPosition = id;
        };



        //Per far vedere le info dell'utente cercato
        if($rootScope.ricercaEffettuata!==false){
                  var questo=$rootScope.other;
                 $scope.dati.user = UsersChatService.getUserInfo(questo);
        } else{
                  $scope.dati.user = UsersChatService.getUserInfo(currentAuth.uid);
               }

             console.log(currentAuth.uid);
             console.log($scope.dati.user.$id);
             console.log($rootScope.ricercaEffettuata);

        $rootScope.ricerca= function(value){
            $rootScope.valoreRicerca=value;

            location.href = '#!/risultati';

        };



        // Visulizzazione tasto segui
        var bott = document.getElementById("mene");
        var bott2 = document.getElementById("tene");
        var find=false;


            if(currentAuth.uid!==$scope.dati.user.$id){
                lollo();
                 }
                 else {
                bott.style = "margin-top: 37px; display:none";
                bott2.style = "height: 50px; margin-top: 37px; display:none";
                }


        function lollo(){

            $scope.dati.followers=FollowerList.getFollowers($scope.dati.user.$id);
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

                    if($scope.dati.followers[i].$id===currentAuth.uid){
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
            Users.addFollower($scope.dati.user.$id, currentAuth.uid);
            bott.style = "margin-top: 37px; display:none";
            bott2.style = "height: 50px; margin-top: 37px; display";
            lollo();
        };
         $scope.sfollower = function (){
             Users.removeFollower($scope.dati.user.$id, currentAuth.uid);
         bott.style = "margin-top: 37px; display";
         bott2.style = "height: 50px; margin-top: 37px; display:none";
         find=false;
         };




        //Cambio immagine profilo
        var ctrl = this;
        var isUploading = false;
        $scope.fileToUpload = null;
        $scope.imgPath= "";


        $scope.clickImg = function () {
            document.getElementById("imageUpload").click();
            isUploading = true;
        }

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

        $scope.changeImg = function () {
            uploadImage(document.getElementById("imageUpload"));
            isUploading = false;
        }

        $scope.toUpload = function () {
            return isUploading;
        }

         //sotto viste



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
            //if(infoValue.endsWith(".")) {
              //  var str = infoValue.substr(0,infoValue.length-1);
                var res = infoValue.split(",");

                    for (var i = 0; i < res.length; i++) {

                        console.log(res[i]);
                        Users.updatelistOf(currentAuth.uid, infoName, i, res[i]);

                }
            //}
        };



    }]);