define('controllers/shoppinglist.js', [], function () {
  return function controller(cp) {
    cp.register('shoppinglistController', ['$scope', '$rootScope', function($scope, $rootScope) {
      $rootScope.pageName = 'Shopping List'
      $scope.itemName = '';
      $scope.quantity = 1;
      $scope.list = [];
      $scope.isEmpty = {};
      $scope.isEmpty.shoppinglist = false;

      //Populate the shopping list
      $rootScope.fireDB.child('houses').child($rootScope.user.house).child('shoppinglist').on("value", function (items){
        $scope.list = [];
        var itm = items.val();
        for (var key in itm) {
          $scope.list.push(itm[key]);
        }
        $scope.list.reverse();
        $scope.isEmpty.shoppinglist = $scope.list.length > 0 ? false : true;
        //safely apply changes to scope
        if(!$scope.$$phase) { $scope.$apply(); }
      });

      //TODO : put this in an api
      $scope.addItem = function() {
        var item = {}
        item.name = $scope.itemName;
        item.quantity = $scope.quantity;
        item.isPurchased = false;
        item.addedBy = $rootScope.user.username;
        item.purchasedBy = '';
        //check for blank name or quantity
        if(item.name && item.quantity) {
          try {
            $rootScope.fireDB.child('houses').child($rootScope.user.house).child('shoppinglist').child(item.addedBy + item.name).set(item);
            $scope.itemName = '';
            $scope.quantity = 1;
            BootstrapDialog.alert(item.quantity + ' X ' + item.name + ' added to shopping list');
          } catch (err) {
            BootstrapDialog.alert('Invalid item name - special characters not supported');
          }
        } else {
          BootstrapDialog.alert('Sorry, you cannot add an item with a blank name or quantity');
        }
      };

      //TODO : put this in an api
      $scope.mark = function(item) {
        item.isPurchased = true;
        item.purchasedBy = $rootScope.user.username;
        delete item['$$hashKey'];
        $rootScope.fireDB.child('houses').child($rootScope.user.house).child('shoppinglist').child(item.addedBy + item.name).set(item);
        BootstrapDialog.alert(item.quantity + ' X ' + item.name + ' purchased!');
      };

    }]);
  }
});

