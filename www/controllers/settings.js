define('controllers/settings.js', [], function () {
  return function controller(cp) {
    cp.register('settingsController',['$scope', '$rootScope', 'homeAPI', function($scope, $rootScope, homeAPI) {
      $rootScope.pageName = 'Settings'

      $scope.isEmpty = {};
      $scope.isEmpty.roommates = false;

      $scope.hasHouse = $rootScope.hasHouse;
    	//create a watch for rootscope hasHouse
  		$rootScope.$watch("hasHouse",
  			function loginChange( newValue, oldValue ) {
  				$scope.hasHouse = $rootScope.hasHouse;
  			}
  		);

      //TODO : put this in an api
      //option to change a password
      $scope.setPasswordSubmit = function() {
        var userEmail = $rootScope.user.email;
        var userPassword = $rootScope.user.password;
        var newPassword = this.new_password;
        $rootScope.fireDB.changePassword({
          email: userEmail,
          oldPassword: userPassword,
          newPassword: newPassword
        }, function(error) {
          if (error) {
            BootstrapDialog.alert('Could not change password.  Please try logging out and back in.');
          } else {
            BootstrapDialog.alert('Password change successfully completed!');
          }
        });
        //reset the value regardless
        this.new_password = '';
      }

      //option to leave a house
  		$scope.leaveHomeSubmit = function() {
      	homeAPI.leaveHome();
      }

      //load roommates here:
      $rootScope.fireDB.child('houses').child($rootScope.user.house).child('users').once("value", function (users){
        $scope.roommates = [];
        var roommies = users.val() ? users.val() : {};
        //preprocessing messages : add user image.
        for (var key in roommies) {
          roommies[key].image = roommies[key].image ? roommies[key].image : "assets/default_user.png";
          //add the user to the list if not the logged in user
          if(roommies[key].name != $rootScope.user.username) {
            $scope.roommates.push(roommies[key]);
          }
        }
        $scope.isEmpty.roommates = $scope.roommates.length > 0 ? false : true;
        if(!$scope.$$phase) { $scope.$apply(); }
      });

      //TODO : put this in an api
      //TODO : need to handle case where user is logged in and in the house, but has been removed
      $scope.removeRoommate = function(name) {
        BootstrapDialog.confirm('Are you sure you want to remove ' + name + ' from ' + $rootScope.user.house + '?', function(result) {
          if(result){
            $rootScope.fireDB.child('users').child(name).child('houses').remove();
            $rootScope.fireDB.child('houses').child($rootScope.user.house).child('users').child(name).remove();
            if(!$scope.$$phase) { $scope.$apply(); }
          }
        });
      }

    }]);
  }
});