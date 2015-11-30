//configure requirejs
requirejs.config({
  baseUrl: '/'
});

var firebaseURL = "https://blazing-heat-3750.firebaseio.com"; // Qingyu's FB
//var firebaseURL = "https://dazzling-torch-6918.firebaseio.com"; // Robert's FB

var app = angular.module('main', ['ngRoute', 'ngAnimate', 'LocalStorageModule','firebase']);

app.config(function($routeProvider, localStorageServiceProvider, $controllerProvider) {
  app.cp = $controllerProvider;
  
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
  $scope.loading = false;
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
//need to load a dummy for the landing controller
.controller('landingController', [function($scope) {}])
.run(function ($rootScope, $location, localStorageService, $route) {
    $rootScope.$on('$routeChangeStart', function (ev, next, curr) {
      if (next.$$route) {
          //when a route changes, we check that the user is logged in.  If they aren't, we redirect them to the landing page
          var user = localStorageService.get('user');
          var isLoginPath = next.$$route.originalPath == "/" || next.$$route.originalPath == "/landing"
          if(!isLoginPath && !user.isLoggedIn){ $location.path('/') }
          
          if(!requirejs.defined("controllers" + next.$$route.originalPath + ".js")) {
            requirejs(["controllers" + next.$$route.originalPath + ".js"], function(controller) {
              controller(app.cp);
              $location.path(next.$$route.originalPath);
              $route.reload(); //reload the route now that the controller is loaded
            }); 
            ev.preventDefault(); //prevent the controller from being accessed before it has been loaded
          }
      }
    })
    //close the nav bar for mobile after selecting a view
    $("#navbar").on('click',function(e) {
      if( $(e.target).is('a')) {
        $(this).collapse('hide');
      }
    });
});

//attach fastclick for better mobile responsiveness
window.addEventListener('load', function () {
  FastClick.attach(document.body);
});