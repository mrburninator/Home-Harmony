define('controllers/shoppinglist.js', [], function () {
  return function controller(cp) {
    cp.register('shoppinglistController', ['$scope', '$rootScope', function($scope, $rootScope) {
      $rootScope.pageName = 'Shopping List'
      $scope.itemName = '';
      $scope.quantity = 1;
      $scope.list = [];
      $scope.isEmpty = {};
      $scope.isEmpty.shoppinglist = false;

      //Populate the List
      $rootScope.fireDB.child('houses').child($rootScope.user.house).child('shoppinglist').on("value", function (items){
        $scope.list = [];
        var itm = items.val();
        //TODO : preprocessing of items can be done here (add user image, ect)
        for (var key in itm) {
          $scope.list.push(itm[key]);
        }
        $scope.list.reverse();
        console.log('list:',$scope.list);
        $scope.isEmpty.shoppinglist = $scope.list.length > 0 ? false : true;
        //safely apply changes to scope
        if(!$scope.$$phase) { $scope.$apply(); }
      });

      $scope.addItem = function() {
        var item = {}
        item.name = $scope.itemName;
        item.quantity = $scope.quantity;
        item.isPurchased = false;
        item.addedBy = $rootScope.user.username;
        item.purchasedBy = '';
        //TODO : check for blank name or quantity
        $rootScope.fireDB.child('houses').child($rootScope.user.house).child('shoppinglist').child(item.addedBy + item.name).set(item);
        $scope.itemName = '';
        $scope.quantity = 1;
      };

      $scope.mark = function(item) {
        item.isPurchased = true;
        item.purchasedBy = $rootScope.user.username;
        delete item['$$hashKey'];
        $rootScope.fireDB.child('houses').child($rootScope.user.house).child('shoppinglist').child(item.addedBy + item.name).set(item);
        console.log("item purchased by:", item.purchasedBy);
        BootstrapDialog.alert(item.quantity + ' X ' + item.name + ' purchased!');
      };

    }]);
  }
});

