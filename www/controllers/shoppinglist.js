define('controllers/shoppinglist.js', [], function () {
  return function controller(cp) {
    cp.register('shoppinglistController', ['$scope', '$rootScope', function($scope, $rootScope) {
      $scope.itemName = '';
      $scope.quantity = 1;
      $scope.addItem = function() {
        console.log('Item Added! Name:', $scope.itemName, ' Quantity:', $scope.quantity);
      };


    }]);
  }
});