define('controllers/settings.js', [], function () {
  return function controller(cp) {
    cp.register('settingsController', function($scope) {
      $scope.message = 'Home !';
    });
  }
});