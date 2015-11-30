define('controllers/home.js', [], function () {
  return function controller(cp) {
    cp.register('homeController', function($scope) {
      $scope.message = 'Home !';
    });
  }
});