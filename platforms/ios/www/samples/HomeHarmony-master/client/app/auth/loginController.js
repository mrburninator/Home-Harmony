/**
 * Home Harmony Login
 * Controller for login page
 */

angular.module('homeHarmony.login',['firebase', 'ui.router'])

.controller('LoginCtrl', function ($rootScope, $scope, $location, UserAuth, $firebaseObject, $state, DButil) {
  // database reference
  var db = new Firebase(DB.url);

  $scope.showlogin = false;

  $scope.logInUser = function() {
    // clear input fields

    //loading animation here

    //$('#loginEmailField').val('');
    //$('#loginPasswordField').val('');
    $scope.showlogin = true;
    
    UserAuth.login($scope.email, $scope.password, function (userEmail, success) {
      
      if(success !== false) {
        // Query database for user info
        db.once("value", function(snapshot) {
          var userDb = snapshot.val().users;
          for (var uid in userDb) {
            if (userDb[uid].email === userEmail) {
              // Save id from database into local storage
              currentUserId = uid;
              localStorage.setItem("currentUserEmail", userEmail);
              localStorage.setItem("currentUserFirstName", userDb[uid].firstname);
              localStorage.setItem("currentUserLastName", userDb[uid].lastname);
              localStorage.setItem("currentUserId", currentUserId);
              localStorage.setItem("currentUserName", userDb[uid].firstname + ' ' + userDb[uid].lastname);


              $rootScope.currentUser = localStorage.getItem('currentUserName');

              if (userDb[uid].house) {
                // Save house info and redirect to dashboard if user has a house
                currentHouseId = userDb[uid].house;
                localStorage.setItem("currentHouseId", currentHouseId);

                $state.go('dash.default');
              } else {
                // redirect to newHouse if user doesnt have a house yet
                $state.go('newHouse');
              }
            }
          }
        },
        function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
        //end of querying database for user info
      } //end if
      else {
        $scope.showlogin = false;
      }

    }); //end of callback function(userEmail, success)
  };
});
