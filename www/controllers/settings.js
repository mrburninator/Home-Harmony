define('controllers/settings.js', [], function () {
  return function controller(cp) {
    cp.register('settingsController',['$scope', '$rootScope' function($scope, $rootScope) {
      //remove
      console.log('settingsController says:', $rootScope.test);

      $scope.message = 'Home !';
    }]);
  }
});