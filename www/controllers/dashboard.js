define('controllers/dashboard.js', [], function () {
  return function controller(cp) {
    cp.register('dashboardController', ['$scope', '$rootScope', '$firebaseArray', function($scope, $rootScope, $firebaseArray) {
      $rootScope.pageName = 'Dashboard'
      
      $scope.hasHouse = $rootScope.hasHouse;
      $scope.user = $rootScope.user;

      $scope.isEmpty = {};
      $scope.isEmpty.messages = false;
      $scope.isEmpty.issues = false;
      $scope.isEmpty.shoppinglist = false;

      //start with empty messages
      $scope.messages = {};
      $scope.messages.everyone = [];
      //get all the users in the house
      $rootScope.fireDB.child('houses').child($rootScope.user.house).child('users').once("value", function (users){
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

      //load the issues
      $rootScope.fireDB.child('houses').child($rootScope.user.house).child('issues').on("value", function (issues){
        $scope.issues = [];
        var iss = issues.val();
        for (var key in iss) {
          //mark as assigned to current user or not
          iss[key].mine = iss[key].assignedTo.name == $rootScope.user.username;
          //save id for later use
          iss[key].uid = key;
          //add the issue to the array
          //FILTER : only show incomplete issues for this user
          if(iss[key].assignedTo.name == $rootScope.user.username && iss[key].done != true) {
            $scope.issues.push(iss[key]);
          }
        }
        $scope.isEmpty.issues = $scope.issues.length > 0 ? false : true;
        //safely apply changes to scope
        if(!$scope.$$phase) { $scope.$apply(); }
      });

      //issue filter - only show user's incomplete issues
      $scope.issueFilter = function(issue) {
        if(issue.assignedTo.name != $rootScope.user.username) {
          return false;
        }
        if(issue.done == true) {
          return false;
        }
        //return true if it passes all these filters
        return true;
      };

      $scope.markDone = function (issue) {
        var issue_id = issue.uid;
        //mark issue as done
        issue.done = true;
        //remove the meta data we appended to it
        delete(issue.uid);
        delete(issue.$$hashKey);
        delete(issue.mine);
        $rootScope.fireDB.child('houses').child($rootScope.user.house).child('issues').child(issue_id).set(issue);
      };

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
        $scope.list.reverse();
        $scope.isEmpty.shoppinglist = $scope.list.length > 0 ? false : true;
        //safely apply changes to scope
        if(!$scope.$$phase) { $scope.$apply(); }
      });

      //TODO : put this in an api
      //allow users to buy for the shopping list from the dashboard
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