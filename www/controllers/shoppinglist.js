define('controllers/shoppinglist.js', [], function () {
  return function controller(cp) {
    cp.register('shoppinglistController', ['$scope', '$rootScope', function($scope, $rootScope) {
      $scope.itemName = '';
      $scope.quantity = 1;
      $scope.list = [];

      //Populate the List
        $rootScope.fireDB.child('houses').child($rootScope.user.house).child('shoppinglist').on("value", function (items){
          $scope.list = [];
          var itm = items.val();
          //TODO : preprocessing of items can be done here (add user image, ect)
          for (var key in itm) {
            $scope.list.push(itm[key]);
          }
        });


      $scope.addItem = function() {
        var item = {}
        item.name = $scope.itemName;
        item.quantity = $scope.quantity;

        $rootScope.fireDB.child('houses').child($rootScope.user.house).child('shoppinglist').push(item);
        //console.log('Item Added! Name:', $scope.itemName, ' Quantity:', $scope.quantity);
        $scope.itemName = '';
        $scope.quantity = 1;
      };

    }]);
  }
});