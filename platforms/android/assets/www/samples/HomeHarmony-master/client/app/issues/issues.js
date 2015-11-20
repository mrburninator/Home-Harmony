/**
 * Home Harmony Issues
 * Controller for Issues page
 */
angular.module('homeHarmony.issues', ['firebase'])

.controller('issuesCtrl', function ($scope, $q) {
  // database reference
  var db = new Firebase(DB.url);
  var allIssues;
  var issuesDb = {};
  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");

  $scope.addIssue = function() {
    $('#issueField').val('');
    var now = new Date();
    // Issue object to be added to database
    newIssue = {
      date: (now.getMonth() + 1) + '/' + now.getDate() + '/' +  now.getFullYear(),
      text: $scope.issueText
    };
    // Add to database
    db.child('houses').child(currentHouseId).child('issues').push(newIssue);
  };

  $scope.getIssues = function() {
    // Query database for issues
    db.on('value', function(snapshot) {
      var dbValues = snapshot.val();
      var thisHouse = dbValues.houses[currentHouseId];
      issuesDb = thisHouse.issues;
      allIssues = [];
      // Fill array with issue data
      for (var issue in issuesDb) {
        allIssues.push(issuesDb[issue]);
      }
      // Execute when allIssues is ready
      $q.all(allIssues).then(function() {
        // Add to scope to be displayed
        $scope.allIssues = allIssues;
      });
    });
  };

  $scope.removeIssue = function(issueText) {
    // query database
    db.on('value', function(snapshot) {
      issuesDb = snapshot.val().houses[currentHouseId].issues;
      // search for issue using its textual content
      for (var issue in issuesDb) {
        if (issuesDb[issue].text === issueText) {
          // remove selected issue
          db.child('houses').child(currentHouseId).child('issues').child(issue).remove();
        }
      }
    });
  };
  // show issues on page load
  $scope.getIssues();
});
