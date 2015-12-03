/**
 * Home Harmony New User
 * Controller for the new user state
 */
angular.module('homeHarmony.newUser', ['firebase'])

.controller('NewUserCtrl', function ($scope, $location, $firebaseObject, UserAuth, $state) {
  // database reference
  var db = new Firebase(DB.url);

  // Adds user info to database
  $scope.addUser = function() {
    $('#newPasswordField').val('');
    $('#newFirstNameField').val('');
    $('#newLastNameField').val('');
    $('#newHouseID').val('');
    // Object that will be added to database
    localStorage.clear();
    var userObj = {
      firstname: $scope.firstname,
      lastname: $scope.lastname,
      email: $scope.email
      // Users house starts as undefined
    };
    // Add user object to auth database
    UserAuth.newUser(userObj.email, $scope.password, function(userEmail) {
      db.child('users').once('value', function(snapshot) {
        var userDb = snapshot.val();
        for (var uid in userDb) {
          if(userDb[uid].email === userEmail) {
            // save user info to local storage
            currentUserId = uid;
            localStorage.setItem("currentUserEmail", userEmail);
            localStorage.setItem("currentUserName", userDb[uid].firstname);
            localStorage.setItem("currentUserId", currentUserId);
          }
        }
      });
      currentUser = userEmail;
      // push user information to database
      db.child('users').push(userObj);
    });
    // redirect to new house page
    $state.go('newHouse');
  };
});
