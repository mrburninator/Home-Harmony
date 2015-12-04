define('controllers/messaging.js', [], function () {
  return function controller(cp) {
    cp.register('messagingController', ['$scope', '$rootScope', 'MessageAPI', '$firebaseArray', function($scope, $rootScope, MessageAPI, $firebaseArray) {
      $scope.user = $rootScope.user;
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
          //TODO : preprocessing of messages can be done here (add user image, ect)
          for (var key in msgs) {
            if(msgs[key].name == $rootScope.user.username) {
              msgs[key].mine = true;
            }
            $scope.messages.everyone.push(msgs[key]);
          }
          // $scope.$apply();
        });
        //TODO : future work - other, private message, chats
      });
      //on message submit call
      $scope.addMessageSubmit = function() {
        console.log('message sent!');
        MessageAPI.sendMessage("everyone", this.msg);
        $('#msg').val('');
      }
    }]);
  }
});