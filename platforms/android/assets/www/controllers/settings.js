define('controllers/settings.js', [], function () {
  return function controller(cp) {
    cp.register('settingsController',['$scope', '$rootScope', 'homeAPI', function($scope, $rootScope, homeAPI) {
		$rootScope.pageName = 'Settings'
    $scope.hasHouse = $rootScope.hasHouse;
    	//create a watch for rootscope hasHouse
		$rootScope.$watch("hasHouse",
			function loginChange( newValue, oldValue ) {
				$scope.hasHouse = $rootScope.hasHouse;
			}
		);

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

    }]);
  }
});