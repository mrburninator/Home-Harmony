/**
 * Home Harmony Default
 * Controller for dashboard
 */

angular.module('homeHarmony.default', ['firebase'])

.controller('defaultCtrl', function($rootScope, $scope, $firebaseObject, $q, DrawPie, DButil) {
  // database reference
  var db = new Firebase(DB.url);
  // updates global variables
  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");
  // Capitalizes users first name which is displayed on dash
  $scope.currentUserName = localStorage.getItem("currentUserName").charAt(0).toUpperCase() +
  localStorage.getItem("currentUserName").slice(1);
  $scope.currentDate = new Date();

  $rootScope.closeDrawer = function() {
    $('.mdl-layout__drawer').removeClass('is-visible');
  };

  // Initialize variables
  var expensesDb, expensesArr, dataObj, issuesDb, issuesArr, shoppingDb;
  var usersDb, usersArr, usersEmailArr, tasksDb, usersKeysArr, tasksArr, tasksNotCompletedCount, itemsNotBoughtCount, shoppingArr;

  // query database
  db.once("value", function(snapshot) {
    tasksNotCompletedCount = 0;
    itemsNotBoughtCount = 0;
    expensesArr = [];
    issuesArr = [];
    usersArr = [];
    tasksArr = [];
    usersEmailArr = [];
    shoppingArr = [];
    usersKeysArr = [];

    var currentDate = new Date();
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = String(currentDate.getFullYear());
    var month = months[currentDate.getMonth()];

    // Retrieve data from the database for the current house
    expensesDb = snapshot.val().houses[currentHouseId].expenses[year][month]; //new schema
    issuesDb = snapshot.val().houses[currentHouseId].issues;
    usersInHouse = snapshot.val().houses[currentHouseId].houseMembers;  //memberid: {dues:, email:}
    tasksDb = snapshot.val().houses[currentHouseId].tasks;
    usersDb = snapshot.val().users;
    shoppingDb = snapshot.val().houses[currentHouseId].shoppingList;

    // Build expensesArr so we can graph the expenses
    for (var expense in expensesDb) {           //ensure that dataObj is contructed properly with the new schema
      dataObj = {};
      dataObj.name = expensesDb[expense].expenseName;
      dataObj.y = expensesDb[expense].cost;
      dataObj.memberPaid = usersDb[expensesDb[expense].memberPaid].firstname + ' ' + usersDb[expensesDb[expense].memberPaid].lastname;
      expensesArr.push(dataObj);
    }
    // Execute only after expensesArr is ready
    $q.all(expensesArr).then(function() {
      // Place on scope to be displayed
      $scope.expensesArr = expensesArr;
      // If we have expenses, show the pie chart on dash.expenses subview
      if (expensesArr.length > 0) {
        // "" no title, false: show legend under the graph
        // DrawPie factory is in expensesController
        DrawPie.drawPie($scope, "", false);
      }
    });

    for (var issue in issuesDb) {
      issuesArr.push(issuesDb[issue]);
    }

    // Execute only after issuesArr is ready
    $q.all(issuesArr).then(function() {
      // Place on scope to be displayed
      $scope.issuesArr = issuesArr;
    });
    for (var user in usersInHouse) {

      usersEmailArr.push(usersInHouse[user].email);
      usersKeysArr.push(user);
    }

    for (var i=0; i<usersEmailArr.length; i++) {
      DButil.getUserInfoFromEmail(usersEmailArr[i], function(userObj, userId) {

        userFirst = userObj.firstname[0].toUpperCase() + userObj.firstname.slice(1);
        userLastInit = userObj.lastname[0].toUpperCase();
        //usersArr.push(userFirst+' '+userLastInit);
      }, usersDb);
    }

    for (var i=0; i < usersKeysArr.length; i++) {
      usersArr.push({
        name: usersDb[usersKeysArr[i]].firstname + ' ' + usersDb[usersKeysArr[i]].lastname,
        email: usersDb[usersKeysArr[i]].email
      });
    };

    // Execute only after usersArr is ready
    $q.all(usersArr).then(function() {
      // Place on scope to be displayed
      $rootScope.usersArr = usersArr;
      localStorage.setItem("currentUsersArr", JSON.stringify(usersArr));
    });
    // See how many tasks are not yet completed
    for (var task in tasksDb) {
      if (!tasksDb[task].completed) {
        tasksArr.push(tasksDb[task]);
        tasksNotCompletedCount++;
      }
    }
    // Execute only after tasksArr is ready
    $q.all(tasksArr).then(function() {
      // Place on scope to be displayed
      $scope.tasksArr = tasksArr;
      $scope.tasksNotCompletedCount = tasksNotCompletedCount;
    });

    //

    for (var item in shoppingDb) {
      if (!shoppingDb[item].completed) {
        shoppingArr.push(shoppingDb[item]);
        itemsNotBoughtCount++;
      }
    }
    // Execute only after tasksArr is ready
    $q.all(shoppingArr).then(function() {
      // Place on scope to be displayed
      $scope.shoppingArr = shoppingArr;
      $scope.itemsNotBoughtCount = itemsNotBoughtCount;
    });

  },
  function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});
