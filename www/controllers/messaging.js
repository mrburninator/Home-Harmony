define('controllers/messaging.js', [], function () {
  return function controller(cp) {
    cp.register('messagingController', ['$scope', '$rootScope', 'MessageAPI', '$firebaseArray', function($scope, $rootScope, MessageAPI, $firebaseArray) {
      $scope.user = $rootScope.user;
      $scope.isEmpty = {};
      $scope.isEmpty.messages = false;
      $rootScope.pageName = 'Messaging'
      //start with empty messages
      $scope.messages = {};
      $scope.messages.everyone = [];
      //get all the users in the house
      $rootScope.fireDB.child('houses').child($rootScope.user.house).child('users').once("value", function (users){
        console.log('loading users : ', users.val());
        $scope.users = users.val() ? users.val() : {};

        //populate the general house chat
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
        //TODO : future work - other, private message, chats
      });
      //on message submit call
      $scope.addMessageSubmit = function() {
        if(this.msg) {
          MessageAPI.sendMessage("everyone", this.msg);
          $('#msg').val('');
        }
      }
    }]);
  }
});