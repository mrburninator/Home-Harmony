define('controllers/dashboard.js', [], function () {
  return function controller(cp) {
    cp.register('dashboardController', ['$scope', '$rootScope', '$firebaseArray', function($scope, $rootScope, $firebaseArray) {
      //remove
      $rootScope.pageName = 'Dashboard'
      console.log('RootScope Status:', $rootScope);

      $scope.isEmpty = {};
      $scope.isEmpty.messages = false;
      $scope.isEmpty.issues = false;
      $scope.isEmpty.shoppinglist = false;

      //start with empty messages
      $scope.messages = {};
      $scope.messages.everyone = [];
      //get all the users in the house
      $rootScope.fireDB.child('houses').child($rootScope.user.house).child('users').once("value", function (users){
        console.log('loading users : ', users.val());
        $scope.users = users.val() ? users.val() : {};
        //Load the messages
        $rootScope.fireDB.child('houses').child($rootScope.user.house).child('messages').child('everyone').on("value", function (messages){
          $scope.messages.everyone = [];
          var msgs = messages.val();
          //preprocessing messages : add user image.
          for (var key in msgs) {
            if(msgs[key].name == $rootScope.user.username) {
              msgs[key].mine = true;
            }
            //grab the image for the user that sent the message
            var from = msgs[key].name;
            var image = ($scope.users[from] && $scope.users[from].image) ? $scope.users[from].image : "assets/default_user.png";
            msgs[key].image = image;
            //add the message to the array
            $scope.messages.everyone.push(msgs[key]);
          }
          $scope.isEmpty.messages = $scope.messages.everyone.length > 0 ? false : true;
          //safely apply changes to scope
          if(!$scope.$$phase) { $scope.$apply(); }
        });
      });

      //start issue list
      $rootScope.fireDB.child('houses').child($rootScope.user.house).child('issues').on("value", function (issues){
        $scope.issues = [];
        var iss = issues.val();
        //TODO : preprocessing of messages can be done here (add user image, ect)
        for (var key in iss) {
          //only show unresolved issues on dashboard
          if(iss[key].Done) {
            $scope.issues.push(iss[key]);
          }
        }
        $scope.isEmpty.issues = $scope.issues.length > 0 ? false : true;
        //safely apply changes to scope
        if(!$scope.$$phase) { $scope.$apply(); }
      });
      $scope.hasHouse = $rootScope.hasHouse;
      $scope.user = $rootScope.user;

      //populate the shopping list
      $scope.list = [];

      //Populate the List
      $rootScope.fireDB.child('houses').child($rootScope.user.house).child('shoppinglist').on("value", function (items){
        $scope.list = [];
        var itm = items.val();
        for (var key in itm) {
          //only show items on dashboard that havn't been bought
          if(!itm[key].purchasedBy) {
            $scope.list.push(itm[key]);
          }
        }
        $scope.isEmpty.shoppinglist = $scope.list.length > 0 ? false : true;
        //safely apply changes to scope
        if(!$scope.$$phase) { $scope.$apply(); }
      });
    }]);
  }
});

