define('controllers/issue.js', [], function () {
  return function controller(cp) {
    cp.register('issueController', ['$scope', '$rootScope', '$firebaseArray',function($scope,$rootScope,$firebaseArray) {


      $scope.message = 'Issue !';
      console.log("scope message is " + $scope.message);
      var baseRef = new Firebase( firebaseURL );
      console.log('RootScope Status:', $rootScope.user);
      var ref = baseRef.child('/houses/' + $rootScope.user.house + '/issues' );
      //ar ref = new Firebase( firebaseURL + "/houses/houses1/issues" );
      var authData = ref.getAuth();

      $scope.issues = $firebaseArray(ref);

      $scope.choosenroommate = {"$value":" choose some one"};
      var roomMateRef = baseRef.child('/houses/' + $rootScope.user.house +'/users');
      $scope.roommatelist = $firebaseArray(roomMateRef);
      $scope.Repeat = false;


      var currentUserUid = {};
      if (authData) {
        console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
        currentUserUid = authData.uid;
      } else {
        console.log("user is logged out");
      }
      // user is logged out
      console.log(currentUserUid);


      //add Issue
      $scope.addIssue = function() {
            console.log("AssignedToName" , $scope.choosenroommate);
            $scope.issues.$add({
                Name: $scope.newIssueText ,
                Done: false ,
                AssignedBy: $rootScope.user.username,
                AssignedTo : $scope.choosenroommate ,
                Repeat: $scope.Repeat
            });

      };


      //issue filter
      $scope.issueFilter = function(issue,toggleFlag) {
        if (toggleFlag)
          return true;
        if (issue.AssignedTo.name==$rootScope.user.username)
        {
            //console.log(issue);
            return true;
        }
         else return false;
      };


      $scope.DisplayMode =  "Only Show my issues";

      $scope.filterToggle = function() {
            $scope.toggleFlag = $scope.toggleFlag === false ? true: false;
            if ($scope.toggleFlag)
            {
               $scope.DisplayMode =  "Show all";
            } else {
               $scope.DisplayMode =  "Only Show my issues";
            }
        };


        $scope.showDone = function(data) {
          //console.log("in showDOne: username is ", $rootScope.user.username, "assign to",data.AssignedTo.name, "data", data);
          if ($rootScope.user.username == data.AssignedTo.name && data.Done==false) {
              return true;
          }
              return false;
        };


        $scope.markDone = function (issue) {
          $scope.issues.$remove(issue);
          issue.Done = true;
          $scope.issues.$add(issue);
        };


    }]);
  }
});
