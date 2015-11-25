var firebaseURL = "https://blazing-heat-3750.firebaseio.com"; // Qingyu's FB
//var firebaseURL = "https://dazzling-torch-6918.firebaseio.com"; // Robert's FB

angular.module('main', ['ngRoute', 'ngAnimate', 'LocalStorageModule','firebase'])
.config(function($routeProvider, localStorageServiceProvider) {
  $routeProvider
  .when('/landing', {
    templateUrl : 'pages/landing.html',
    controller  : 'landingController'
  })
  .when('/dashboard', {
    templateUrl : 'pages/dashboard.html',
    controller  : 'dashboardController'
  })
  .when('/home', {
    templateUrl : 'pages/home.html',
    controller  : 'homeController'
  })
  .when('/issue', {
    templateUrl : 'pages/issue.html',
    controller  : 'issueController'
  })
  .when('/messaging', {
    templateUrl : 'pages/messaging.html',
    controller  : 'messagingController'
  })
  .when('/shoppinglist', {
    templateUrl : 'pages/shoppinglist.html',
    controller  : 'shoppinglistController'
  })
  .when('/settings', {
    templateUrl : 'pages/settings.html',
    controller  : 'settingsController'
  })
  .otherwise({
    redirectTo: '/landing'
  });

  localStorageServiceProvider
  .setPrefix('HH')
  .setStorageType('sessionStorage')
  .setNotify(true, true);
})

//define the services to be used by controllers
.factory('userAPI', function() {
  var user = {
    login: function(name, password, fireDB, callback) {
      fireDB.authWithPassword({
        email    : name,
        password : password
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          // console.log("Authenticated successfully with payload:", authData);
          callback();
        }
      });
    },
    register: function(name, password, fireDB, callback) {
      fireDB.createUser({
        email    : name,
        password : password
      }, function(error, userData) {
        if (error) {
          console.log("Register Failed!", error);
        } else {
          callback();
        }
      });
    }
  };
  return user;
})
.factory('shoppingListAPI', function() {
  var shoppingList = {
  };
  return shoppingList;
})
.factory('IssueAPI', function() {
  var issue = {
  };
  return issue;
})
.factory('MessageAPI', function() {
  var message = {
    chat: null,
    //given the user authData, setup the firechat app, enter the house chatroom, and get the messages to display
    chatInit: function(username, authData, chat, cb) {
      console.log('setting up firechat...');
      this.chat = chat;
      
      chat.setUser(authData.uid, username, function(user) {
        chat.resumeSession();
        cb();
      });
      console.log("LOGGING IN:");
      console.log(username);
    },
    //sends a message to the user
    sendMessage: function(roomID, message, cb) {
      this.chat.sendMessage(roomID, message, messageType='default', function(){
        cb();
      })
    },
    //TODO : seems to be a bug when entering the room after creation
    //when a new house is created we have to create a new chatroom
    createMessageRoom: function(roomName) {
      chat = this.chat;
      chat.createRoom(roomName, "public", function(roomId){
        console.log("room created!");
        console.log(roomId);
        chat.enterRoom(roomId);
      });
    },
    //when a user leaves a house we have to make them leave that room
    leaveMessageRoom: function() {
      
    },
    //for testing
    listRooms: function() {
      chat = this.chat;
      chat.getRoomList(function(rooms){
        console.log(rooms);
      });
    }
  };
  return message;
})

//load the main controller
.controller('mainController', ['$scope','localStorageService', function($scope, localStorageService) {
  //check if the user is logged in via cache:
  $scope.user = localStorageService.get('user') == null ? {isLoggedIn:false} : localStorageService.get('user');
  localStorageService.set('user',$scope.user)

  //watch the user login value so we can make sure we update the cached value
  $scope.$watch("user.isLoggedIn",
  function loginChange( newValue, oldValue ) {
    localStorageService.set('user', $scope.user);
  }
);

//handle logging out
$scope.logoutSubmit = function() {
  $scope.user.isLoggedIn = false;
};
}])

//load the controllers for each view
.controller('landingController', ['$scope','localStorageService', '$location', 'userAPI', function($scope, localStorageService, $location, userAPI) {
  $scope.fireDB = new Firebase(firebaseURL);
  $scope.loading = false;
  //TODO : we should be storing the username in the db
  $scope.userName = "mrburninator"; //for chat testing
  //check if the user is logged in
  //& redirect them to the dashboard if they are
  if($scope.user.isLoggedIn) {
    //TODO : pull any necessary info from cache
    $location.path('dashboard');
  }

  $scope.login = function(name,password,callback) {
    $scope.fireDB.authWithPassword({
      email    : name,
      password : password
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        callback()
        $scope.$apply()
      }
    });
  }

  //TODO : implement login submit logic
  $scope.loginSubmit = function() {
    $scope.loading = true;
    //TODO : requires login service
    userAPI.login(this.usr, this.pwd, $scope.fireDB, function(){
      $scope.user.isLoggedIn = true;
      //go to dashboard
      $location.path('dashboard');
      $scope.$apply();
    });
  };

  //TODO : implement register submit logic
  $scope.registerSubmit = function() {
    //TODO : requires register service
    if(this.usr_reg && this.pwd_reg) {
      $scope.loading = true;
      username = this.usr_reg;
      password = this.pwd_reg;
      userAPI.register(username, password, $scope.fireDB, function(){
        userAPI.login(username, password, $scope.fireDB, function(){
          $scope.user.isLoggedIn = true;
          //go to dashboard
          $location.path('dashboard');
          $scope.$apply();
        });
      });
    } else {
      console.log('it didnt pass!!!');
    }
  };
  //toggle between login and register views on click
  $('.toggle_view').on('click',function(){
    $('view').toggleClass('hidden');
  });
  
}])
.controller('dashboardController', function($scope,$firebaseArray) {
  $scope.message = 'Dashboard !';

  //load the issue list
  var issues = new Firebase( firebaseURL + "/issues" );
  $scope.issues = $firebaseArray(issues);

})
.controller('homeController', function($scope) {
  $scope.message = 'Home !';
})
.controller('issueController', function($scope,$firebaseArray) {
  $scope.message = 'Issue !';
  var ref = new Firebase( firebaseURL + "/issues" );
  var authData = ref.getAuth();

  $scope.issues = $firebaseArray(ref);

  var currentUser = {};
  if (authData) {
    console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
    currentUser = authData.uid;
  } else {
    console.log("user is logged out");
  }
  // user is logged out
  console.log(currentUser);
  $scope.addIssue = function() {
    $scope.issues.$add({
      text: $scope.newIssueText ,
      creater: currentUser
    });
  };


})
.controller('messagingController', ['$scope', 'MessageAPI', '$firebaseArray', function($scope, MessageAPI, $firebaseArray) {
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
}])
.controller('shoppinglistController', function($scope) {
  $scope.message = 'Shopping List !';
})
.controller('settingsController', function($scope) {
  $scope.message = 'Settings !';
}).run(function ($rootScope, $location, localStorageService) {
    //when a route changes, we check that the user is logged in.  If they aren't, we redirect them to the landing page
    $rootScope.$on('$routeChangeStart', function (ev, next, curr) {
        if (next.$$route) {
            var user = localStorageService.get('user');
            var isLoginPath = next.$$route.originalPath == "/" || next.$$route.originalPath == "/landing"
            if(!isLoginPath && !user.isLoggedIn){ $location.path('/') }
        }
    })
    //close the nav bar for mobile after selecting a view
    $("#navbar").on('click',function(e) {
      if( $(e.target).is('a')) {
        $(this).collapse('hide');
      }
    });
});

window.addEventListener('load', function () {
  FastClick.attach(document.body);
});
