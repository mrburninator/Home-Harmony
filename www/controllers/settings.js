define('controllers/settings.js', [], function () {
  return function controller(cp) {
    cp.register('settingsController',['$scope', '$rootScope', 'homeAPI', function($scope, $rootScope, homeAPI) {
		$scope.hasHouse = $rootScope.hasHouse;
    	//create a watch for rootscope hasHouse
		$rootScope.$watch("hasHouse",
			function loginChange( newValue, oldValue ) {
				$scope.hasHouse = $rootScope.hasHouse;
			}
		);



		$scope.leaveHomeSubmit = function() {
        	homeAPI.leaveHome();
        }
    }]);
  }
});