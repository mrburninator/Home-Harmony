define('controllers/issue.js', [], function () {
  return function controller(cp) {
    cp.register('issueController', function($scope,$firebaseArray) {
      $scope.message = 'Issue !';
      var baseRef = new Firebase( firebaseURL ); 
      var ref = baseRef.child("/houses/houses1/issues" );
//      var ref = new Firebase( firebaseURL + "/houses/houses1/issues" );
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
       var userName = "dsfdsf";
       
      //add Issue
      $scope.addIssue = function() {
        
        var userRef = baseRef.child("/users/"+currentUser+"/name");
        userRef.once("value", function(data) {
          userName = data.val();
          console.log("userName" + userName);
        
          var userRef2 = baseRef.child("/users/"+$scope.AssignedToUID+"/name");
          userRef2.once("value", function(data) {
              userName2 = data.val();
              console.log("userName2" + userName2);
            
               
              $scope.issues.$add({
                Name: $scope.newIssueText ,
                Done: "false" ,
                AssignedBy: {userName : userName, userID: currentUser },
                AssignedTo : {userName: userName2, userID: $scope.AssignedToUID },
                Repeat: $scope.Repeat
          
            }); 
           });
        });
     
        
        
        
        
        

      };
    });
  }
});