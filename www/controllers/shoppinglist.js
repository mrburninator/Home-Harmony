define('controllers/shoppinglist.js', [], function () {
  return function controller(cp) {
    cp.register('shoppinglistController', ['$scope', '$rootScope', function($scope, $rootScope) {



      $scope.message = 'Settings !';
    }]);
  }
});