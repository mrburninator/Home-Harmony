define('controllers/issue.js', [], function () {
  return function controller(cp) {
    cp.register('issueController', ['$scope', '$rootScope', '$firebaseArray',function($scope,$rootScope,$firebaseArray) {
      $rootScope.pageName = 'Issues'

      $scope.isEmpty = {};
      $scope.isEmpty.issues = false;

      $scope.toggle = {};
      $scope.toggle.onlyDoneFlag = false;
      $scope.toggle.onlyMineFlag = false;
      $scope.toggle.onlyGivenFlag = false; //assigner flag

      $scope.repeat = false;

      //load roommates here that can be assigned a task:
      $rootScope.fireDB.child('houses').child($rootScope.user.house).child('users').on("value", function (users){
        $scope.roommates = [];
        var roommies = users.val() ? users.val() : {};
        //preprocessing messages : add user image.
        for (var key in roommies) {
          roommies[key].image = roommies[key].image ? roommies[key].image : "assets/default_user.png";
          $scope.roommates.push(roommies[key]);
        }
        $scope.isEmpty.roommates = $scope.roommates.length > 0 ? false : true;
        if(!$scope.$$phase) { $scope.$apply(); }
        //autoselect the first value
        $('.dropdown select').val($scope.roommates[0].$$hashKey);
      });
      
      //load the issues
      $rootScope.fireDB.child('houses').child($rootScope.user.house).child('issues').on("value", function (issues){
        $scope.issues = [];
        var iss = issues.val();
        for (var key in iss) {
          //mark as assigned to current user or not
          iss[key].mine = iss[key].assignedTo.name == $rootScope.user.username;
          //save id for later use
          iss[key].uid = key;
          //add the issue to the array
          $scope.issues.push(iss[key]);
        }
        $scope.isEmpty.issues = $scope.issues.length > 0 ? false : true;
        //safely apply changes to scope
        if(!$scope.$$phase) { $scope.$apply(); }
      });

      //TODO : put this in an api
      //add Issue
      $scope.addIssue = function() {
        //check for invalid input
        if($scope.newIssueText){
          var assigner = {
            'name' : $rootScope.user.username,
            'image' : $rootScope.user.image
          }
          var user_id = $('.dropdown select').val();
          var tmp_user = null;
          for (var key in $scope.roommates) {
            if($scope.roommates[key].$$hashKey == user_id) {
              tmp_user = $scope.roommates[key];
            }
          }
          if(tmp_user) {
            var assignee = {
              'name' : tmp_user.name,
              'image' : tmp_user.image
            }
            var temp_issue = {
                name: $scope.newIssueText,
                done: false,
                assignedBy: assigner,
                assignedTo : assignee,
                repeat: $scope.repeat
            }
            $rootScope.fireDB.child('houses').child($rootScope.user.house).child('issues').push(temp_issue);
            $('textarea').val('');
            BootstrapDialog.alert('Issue successfully assigned to ' + assignee.name);
            if(!$scope.$$phase) { $scope.$apply(); }
          } else {
            BootstrapDialog.alert('Please select a roommate to assign the issue to');
          }
        } else {
          BootstrapDialog.alert('Issue description cannot be blank');
        }
      };

      //issue filter
      $scope.issueFilter = function(issue) {
        //if filtering to only mine and it doesnt match, return false
        if($scope.toggle.onlyMineFlag && issue.assignedTo.name != $rootScope.user.username) {
          return false;
        }
        //if filtering to only done and it doesnt match, return false
        if($scope.toggle.onlyDoneFlag && issue.done == true) {
          return false;
        }
        //if filtering to only done and it doesnt match, return false
        if($scope.toggle.onlyGivenFlag && issue.assignedBy.name != $rootScope.user.username) {
          return false;
        }
        //return true if it passes all these filters
        return true;
      };

      $scope.filterToggle = function(flagName) {
        $scope.toggle[flagName] = !$scope.toggle[flagName];
      };

      //TODO : put this in an api
      //mark an issue as done function
      $scope.markDone = function (issue) {
        var issue_id = issue.uid;
        //mark issue as done
        issue.done = true;
        //remove the meta data we appended to it
        delete(issue.uid);
        delete(issue.$$hashKey);
        delete(issue.mine);
        $rootScope.fireDB.child('houses').child($rootScope.user.house).child('issues').child(issue_id).set(issue);
      };

      //add listener for button click
      $(".buttons").off("click").on("click", "button", function(){
        $(this).toggleClass('grey');
      });
    }]);
  }
});
