define('controllers/issue.js', [], function () {
  return function controller(cp) {
    cp.register('issueController', function($scope,$firebaseArray) {
      $scope.message = 'Issue !';
      console.log("scope message is " + $scope.message);
      var baseRef = new Firebase( firebaseURL ); 
      var ref = baseRef.child("/houses/houses1/issues" );
      //ar ref = new Firebase( firebaseURL + "/houses/houses1/issues" );
      var authData = ref.getAuth();

      $scope.issues = $firebaseArray(ref);
      
 
      var roomMateRef = baseRef.child("/houses/houses1/users");
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
      
      
      var AssignedByName = "temp";
      var AssignedToName = "temp";
      $scope.choosenroommate = {"$value":" ","$id":"choose one","$priority":null};
      var userRef = baseRef.child("/users/"+currentUserUid+"/name");
      
      
      
      //add Issue
      $scope.addIssue = function() {
        userRef.once("value", function(data) {
        AssignedByName = data.val();
        console.log("AssignedByName" + AssignedByName);
        console.log("choose roommate " + $scope.choosenroommate.$id + "value is " + $scope.choosenroommate.$value  );
        
        var userRef2 = baseRef.child("/users/"+$scope.choosenroommate['$id']+"/name");  
          
        userRef2.once("value", function(data) {
            AssignedToName = data.val();
            console.log("AssignedToName" + AssignedToName);      
            $scope.issues.$add({
                Name: $scope.newIssueText ,
                Done: "false" ,
                AssignedBy: {userName : AssignedByName, userID: currentUserUid },
                AssignedTo : {userName: AssignedToName, userID: $scope.choosenroommate['$id'] },
                Repeat: $scope.Repeat
            });       
          });
          
        });
    
      };
    });
  }
});