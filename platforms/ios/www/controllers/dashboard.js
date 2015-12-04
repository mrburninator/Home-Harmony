define('controllers/dashboard.js', [], function () {
  return function controller(cp) {
    cp.register('dashboardController', ['$scope', '$rootScope', '$firebaseArray', function($scope, $rootScope, $firebaseArray) {
      //remove
      console.log('RootScope Status:', $rootScope);

      //start with empty messages
      $scope.messages = {};
      $scope.messages.everyone = [];
      //Load the messages
      $rootScope.fireDB.child('houses').child($rootScope.user.house).child('messages').child('everyone').on("value", function (messages){
        $scope.messages.everyone = [];
        var msgs = messages.val();
        for (var key in msgs) {
          if(msgs[key].name == $rootScope.user.username) {
            msgs[key].mine = true;
          }
          $scope.messages.everyone.push(msgs[key]);
        }
        // $scope.$apply();
      });

      //start issue list
      $rootScope.fireDB.child('houses').child($rootScope.user.house).child('issues').on("value", function (issues){
        $scope.issues = [];
        var iss = issues.val();
        //TODO : preprocessing of messages can be done here (add user image, ect)
        for (var key in iss) {
          $scope.issues.push(iss[key]);
        }
        // $scope.$apply();
      });
      $scope.hasHouse = $rootScope.hasHouse;
      $scope.user = $rootScope.user;

      //populate the shopping list
      $scope.list = [];

      //Populate the List
      $rootScope.fireDB.child('houses').child($rootScope.user.house).child('shoppinglist').on("value", function (items){
        $scope.list = [];
        var itm = items.val();
        //TODO : preprocessing of items can be done here (add user image, ect)
        for (var key in itm) {
          $scope.list.push(itm[key]);
        }
        // $scope.$apply();
      });
    }]);
  }
});

