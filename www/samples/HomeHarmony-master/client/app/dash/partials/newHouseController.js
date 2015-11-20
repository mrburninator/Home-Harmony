/**
 * Home Harmony New House
 * Controller for new house page
 */


angular.module('homeHarmony.newHouse', ['firebase'])

.controller('newHouseCtrl', function ($rootScope, $scope, $location, $firebaseObject, DButil, $state, UserAuth) {
  // database reference
  var db = new Firebase(DB.url);
  currentUserId = localStorage.getItem("currentUserId");
  currentUserFirstName = localStorage.getItem("currentUserFirstName");
  currentUserLastName = localStorage.getItem("currentUserLastName");
  currentUserEmail = localStorage.getItem("currentUserEmail");
  currentUserName = localStorage.getItem("currentUserName");
  $scope.currentHouseId = localStorage.getItem("currentHouseId");

  $scope.joinHouse = function() {
    $('#joinHouseID').val('');
    localStorage.setItem("currentHouseId", $scope.chosenHouse);
    // add house property to user in database
    db.child('users').child(currentUserId).update({
      'house': $scope.chosenHouse
    });

    // query database to find desired house
    db.once("value", function(snapshot) {
      var housesDb = snapshot.val().houses;
      for (var houseId in housesDb) {
        if (houseId === $scope.chosenHouse) {

          //bind the houseMembers object to the rootScope roomies
          // var houseMembersRef = db.child('houses').child(houseId).child('houseMembers');
          // var houseMembersObj = $firebaseObject(houseMembersRef);
          // houseMembersObj.$bindTo($rootScope, "roomies");

          if (!housesDb[houseId].houseMembers) {
            // if there are no members, create a member list with current user
            var members = {};
            members[currentUserId] = localStorage.getItem("currentUserEmail");
            // push list to database
            db.child('houses').child(houseId).update({
              houseMembers: members
            });
          } else {
            // else add user to member list and push to database
            var memberList = housesDb[houseId].houseMembers;

            var newHouseMember = {
              firstname: currentUserFirstName,
              lastname: currentUserLastName,
              email: currentUserEmail,
              dues: 'none'
            };

            memberList[currentUserId] = newHouseMember;
            db.child('houses').child(houseId).child('houseMembers').set(memberList);
          }
        }
      // redirect to dashboard
        $state.go('dash.default');
      }
    },
    function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  };

  $scope.leaveHouse = function() {
    var currentHouseKey = localStorage.getItem("currentHouseId");

    db.once("value", function(snapshot) {
        var house = snapshot.val().houses[currentHouseKey];
        var houseMembers = snapshot.val().houses[currentHouseKey].houseMembers;

        if(Object.keys(houseMembers).length === 1) {
          db.child('houses').child(currentHouseKey).remove();
        } else {          
          db.child('houses').child(currentHouseKey).child('houseMembers').child(currentUserId).remove();
          db.child('users').child(currentUserId).update({
            'house': null
          });
        }

        localStorage.removeItem("currentHouseId");
        $rootScope.usersArr.splice($rootScope.usersArr.indexOf(currentUserName), 1);
        $state.reload();
    });
  };

  $scope.newHouseReg = function() {
    // $('#newEmail1').val('');
    // $('#newEmail2').val('');

    var houseRef = db.child('houses').push( { expenses:'none' } );

    var newHouseMember = {
      firstname: currentUserFirstName,
      lastname: currentUserLastName,
      email: currentUserEmail,
      dues: 'none'
    };

    houseRef.child('houseMembers').child(currentUserId).set(newHouseMember);

    //bind the houseMembers object toF rootScope.roomies
    // var houseMembersRef = houseRef.child('houseMembers');
    // var houseMembersObj = $firebaseObject(houseMembersRef);
    // houseMembersObj.$bindTo($rootScope, "roomies");


    db.child('houses').once('child_added', function(snapshot) {
      currentHouseId = snapshot.key();
      localStorage.setItem("currentHouseId", currentHouseId);
      //email users
      var userRef = db.child('users').child(currentUserId);
      userRef.update({
        'house': currentHouseId
      });
      $state.go('dash.default');
    });

  };

  $scope.addRoommate = function() {
    $('#newEmail3').val('');
    DButil.getUserIdFromEmail($scope.roommateEmail, function(userId) {
      db.once("value", function(snapshot) {
        var memberList = snapshot.val().houses[currentHouseId].houseMembers;
        memberList[userId] = $scope.roommateEmail;
        db.child('houses').child(currentHouseId).child('houseMembers').set(memberList);
        db.child('users').child(userId).update({
          house: currentHouseId
        });
      },
      function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    });
  };

  $scope.logOut = function() {
    console.log('Logging out.');
    UserAuth.logout();
  };

  // function for ng-disable on create house button to disable creating a
  // new house if a user is aready part of a house that is not the default house
  $scope.uniqueHouseIdExists = function() {
    return localStorage.getItem("currentHouseId") !== null;
  };

  $scope.uniqueHouseIdDoesNotExist = function() {
    return localStorage.getItem("currentHouseId") === null;
  };

});
