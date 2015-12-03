define('controllers/shoppinglist.js', [], function () {
  return function controller(cp) {
    cp.register('shoppinglistController', ['$scope', '$rootScope', function($scope, $rootScope) {
      //remove
      console.log('shoppinglistController says:', $rootScope.test);
      $scope.message = 'Settings !';
    }]);
  }
});