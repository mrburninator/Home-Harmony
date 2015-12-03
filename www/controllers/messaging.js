define('controllers/messaging.js', [], function () {
  return function controller(cp) {
    cp.register('messagingController', ['$scope', '$rootScope', 'MessageAPI', '$firebaseArray', function($scope, $rootScope, MessageAPI, $firebaseArray) {
      //remove
      console.log('messagingController says:', $rootScope.test);

      $scope.messages = [];
      var ref = new Firebase( firebaseURL + "/chat" );
      var chat = new Firechat(ref);
      var my_room = false;

      chat.on("message-add", function(roomID,message){
        $scope.messages.push(message);
        $scope.$apply();
      });

      chat.on("room-enter", function(room){
        my_room = room.id
      });

      var authData = ref.getAuth();
      MessageAPI.chatInit($scope.userName, authData, chat, function(){
        //callback function on success
        // MessageAPI.createMessageRoom("dev-room");
        // MessageAPI.sendMessage("-K3xAuSJm3NMz9KCToih", "Test 5... of many", messageType='default', function(){console.log("Message create successful!");})
      });

      $scope.addMessageSubmit = function() {
        if(my_room && this.msg) {
          MessageAPI.sendMessage(my_room, this.msg, function(){
              console.log("Message create successful!");
              $('#msg').val('');
          });
        }
      }
    }]);
  }
});