define('controllers/issue.js', [], function () {
  return function controller(cp) {
    cp.register('issueController', ['$scope', '$rootScope', '$firebaseArray' function($scope,$rootScope,$firebaseArray) {
      //remove
      console.log('issueController says:', $rootScope.test);

      $scope.message = 'Issue !';
      var ref = new Firebase( firebaseURL + "/issues" );
      var authData = ref.getAuth();

      $scope.issues = $firebaseArray(ref);

      var currentUser = {};
      if (authData) {
        console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
        currentUser = authData.uid;
      } else {
        console.log("user is logged out");
      }
      // user is logged out
      console.log(currentUser);
      $scope.addIssue = function() {
        $scope.issues.$add({
          text: $scope.newIssueText ,
          creater: currentUser
        });
      };
    }]);
  }
});