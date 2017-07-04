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
    .controller("ProfiloCtrl", ['$scope', 'Users','UserList', 'currentAuth', '$firebaseAuth', '$rootScope', '$location', 'UsersChatService','UniversesUserList','$firebaseStorage', function($scope, Users,UserList, currentAuth, $firebaseAuth, $rootScope, $location, UsersChatService,UniversesUserList,$firebaseStorage) {

        $scope.dati={};
        //set the variable that is used in the main template to show the active button
        $rootScope.utenteFisso=UsersChatService.getUserInfo(currentAuth.uid).$id;



        //cambio Sottoviste
        if($rootScope.currentPosition===undefined)
        {$rootScope.currentPosition = 1;}

        $rootScope.dropDownChangeView =function(id){
            $scope.dati.user = UsersChatService.getUserInfo(currentAuth.uid);
            $rootScope.ListUniversesOfUser=UniversesUserList.getUniversesOfUser(currentAuth.uid);
            $rootScope.ricercaEffettuata=false;
            $rootScope.currentPosition = id;
            bott.style = "margin-top: 37px; display:none";
            bott2.style = "height: 50px; margin-top: 37px; display:none";
            find=false;
            console.log($rootScope.currentPosition);
            lollo();
            console.log($rootScope.currentPosition);
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


         //visualizzazione universi del singolo utente
        $rootScope.ListUniversesOfUser=UniversesUserList.getUniversesOfUser($scope.dati.user.$id);

        /*$scope.getStories = function (universo) {
            var ref = firebase.database().ref("users/" + currentAuth.uid + "/universes/" + universo);
            ref.orderByValue().on("value", function (snapshot) {
                snapshot.forEach(function (data) {
                    console.log(data.key + ":" + data.val());
                })
            });
        }*/

          //funzione che passa il valore i ricerca
        $rootScope.ricerca= function(value){
            $rootScope.valoreRicerca=value;

            location.href = '#!/risultati';

        };

        $scope.sceltaUniverso= function(value){
            $rootScope.otherUniverse=value;
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
                lollo();
                }


        function lollo(){

            $scope.dati.followers=UserList.getFollowers($scope.dati.user.$id);
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
                if($scope.dati.followers.length>=1){
                    $scope.dati.user.number=$scope.dati.followers.length;}
                else {$scope.dati.user.number=0;}

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
            });

            $scope.dati.followings=UserList.getFollowings($scope.dati.user.$id);
            $scope.dati.followings.$loaded().then(function()
            {

                if($scope.dati.followings.length>=1){
                    $scope.dati.user.number2=$scope.dati.followings.length;}
                else {$scope.dati.user.number2=0;}

            })
        }

        $scope.follower = function (){
            Users.addFollower($scope.dati.user.$id, currentAuth.uid);
            Users.addFollowing(currentAuth.uid,$scope.dati.user.$id);
            bott.style = "margin-top: 37px; display:none";
            bott2.style = "height: 50px; margin-top: 37px; display";
            lollo();
        };
         $scope.sfollower = function (){
             Users.removeFollower($scope.dati.user.$id, currentAuth.uid);
             Users.removeFollowing(currentAuth.uid,$scope.dati.user.$id);
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
                if($scope.dati.user.$id===currentAuth.uid){
                    document.getElementById("imageUpload").click();
                    isUploading = true;
                }
            };


        function uploadImage(uploader) {
            $scope.fileToUpload = uploader.files[0];
            var fileName = $scope.fileToUpload.name;
            var storageRef = firebase.storage().ref("Img/" + fileName);
            $scope.storage = $firebaseStorage(storageRef);
            var uploadTask = $scope.storage.$put($scope.fileToUpload);
            uploadTask.$complete(function (snapshot) {
                $scope.imgPath = snapshot.downloadURL;

                Users.changeImage(currentAuth.uid, $scope.imgPath);
                lollo();
            });
        }

        $scope.changeImg = function () {
            uploadImage(document.getElementById("imageUpload"));
            isUploading = false;
        };

        $scope.toUpload = function () {
            return isUploading;
        };

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
                var res = infoValue.split(",");

                    for (var i = 0; i < res.length; i++) {

                        console.log(res[i]);
                        Users.updatelistOf(currentAuth.uid, infoName, i, res[i]);

                }
        };

        $scope.IDcontrol = function () {
            return $scope.dati.user.$id === currentAuth.uid;
        };


        $scope.storiaDaLeggere = function(c,b, a) {
          $rootScope.S=c;
          $rootScope.T=b;
          console.log(a);
        };

        $rootScope.selezionabile={};

        $scope.setta= function() {
            $rootScope.selezionabile=true;
        }

    }]);