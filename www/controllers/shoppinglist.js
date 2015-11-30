define('controllers/shoppinglist.js', [], function () {
  return function controller(cp) {
    cp.register('shoppinglistController', function($scope) {
      $scope.message = 'Settings !';
    });
  }
});