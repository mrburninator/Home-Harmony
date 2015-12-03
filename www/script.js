/*
Rootscope variables: ($rootScope)
  fireDB
  hasHouse

  user = {
    username:
    email: (FU)
    password:
    house:

    isLoggedIn:
    currentUserEmail:
    currentUserID: -- GET RID OF THIS
    currentPass:
    currentHouseID:
    currentHouseName:
  }


*/
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
.factory('userAPI', ['$rootScope', function($rootScope) {
  var user = {
    login: function(name, password, fireDB, callback) {

        //Check whether user already exists & username/password match
        $rootScope.fireDB.child('users').child(name).once("value", function (user){
          var userObj = user.val();
          if (user.exists() &&  userObj.username == name &&  userObj.password == password){
            console.log('Login for username:', userObj.username, ' success!');
            //TODO : check if the user has a house
            callback();
          } else {
            console.log('Login for username:', name, ' failed.');
          }
        });

    },

    register: function(username ,email, password, fireDB, callback) {
      //TODO : check if email exists in /users
      $rootScope.fireDB.child('users').child(username).once("value", function(snapshot){
          if(snapshot.exists()){
            //FAIL
            console.log('Registration for user:', username, 'failed.\n');
          } else {
            var user = {}
            user.email = email;
            user.username = username;
            user.password = password;
            user.houses = [];

            //Create a new child and store the reference
            var userID = fireDB.child('users').child(user.username).set(user);

            //remove
            console.log('Registration for user:', username, 'succesful.\n');
            //Finish registration and callback
            callback();
              // }
            // });
          }
      });
    }

  };
  return user;
}])


.factory('homeAPI', ['$rootScope', 'userAPI', '$location', function($rootScope, userAPI, $location) {
  var home = {
    createHome : function(homeName){
      var house = {
        "name": homeName
      };
      $rootScope.currentHomeID = $rootScope.fireDB.child('houses').child(homeName).set(house);

    },
    joinHome : function(homeID){
      //TODO : given a home id, add a user to the users child

      //remove
      console.log('RootScope contents:', $rootScope.user);

      var tempUser = {};
      tempUser.name = $rootScope.user.username;

      //Check whether a house exists
      $rootScope.fireDB.child('houses').child(homeID).once("value", function(snapshot){
          //make sure the house exists before trying to join it
          if(snapshot.exists()){
            console.log('The house', homeID, 'exists!!!');

            //Update rootScope
            $rootScope.hasHouse = true;
            $rootScope.user.house = homeID;

            //Add the user to the house
            $rootScope.currentHomeID = $rootScope.fireDB.child('houses').child(homeID).child('users').child(tempUser.name).set(tempUser);

            //Add the house to the user's database
            $rootScope.fireDB.child('users').child($rootScope.user.username).child('houses').set(homeID);

            //TODO: Add multiple houses later.
            $location.path('dashboard');
            $rootScope.$apply();
          } else {
            //TODO : dialog window that alerts the user the house does not exist
            console.log('The house', homeID, 'does not exist!!!');
          }
        }, function(){ console.log("error!"); }
      );
    },
    leaveHome : function(){
      console.log('leaving home...');
      console.log('user: ',$rootScope.user);
      $rootScope.fireDB.child('users').child($rootScope.user.username).child('houses').remove();
      $rootScope.fireDB.child('houses').child($rootScope.user.house).child('users').child($rootScope.user.username).remove();
      $rootScope.hasHouse = false;
      $rootScope.user.house = false;
    }
  };
  return home;
}])

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
.factory('MessageAPI', ['$rootScope', function($rootScope) {
  //TODO : redo this chat - 
  /*
    different channel types:
      -everyone
      -username1-username2-...-usernameN
      *alphabetize the usernames
    
  */
  var message = {
    //sends a message to the user
    sendMessage: function(group, message) {
      var to_send = {};
      to_send.message = message;
      to_send.name = $rootScope.user.username;
      //just append to the group the text
      $rootScope.fireDB.child('houses').child($rootScope.user.house).child('messages').child(group).push(to_send);
    }
  };
  return message;
}])


//load the main controller
.controller('mainController', ['$scope','localStorageService', '$rootScope', function($scope, localStorageService, $rootScope) {
  //create the fireDB instance
  $rootScope.fireDB = new Firebase(firebaseURL);
  //for long-latency calls, you can set this to true
  $scope.loading = false;

  //check if the user is logged in via cache:
  $rootScope.user = localStorageService.get('user') == null ? {isLoggedIn:false} : localStorageService.get('user');

  //watch the user login value so we can make sure we update the cached value
  $rootScope.$watch("user.isLoggedIn",
    function loginChange( newValue, oldValue ) {
      $scope.user = $rootScope.user;
      localStorageService.set('user', $scope.user);
      //TODO : how does this log the user out??? // navigation change???
    }
  );
  $rootScope.$watch("user.house",
    function loginChange( newValue, oldValue ) {
      localStorageService.set('user', $scope.user);
    }
  );
  //watch for if the user joins or leaves a house - navigation changes accordingly.
  $rootScope.$watch("hasHouse",
    function loginChange( newValue, oldValue ) {
      $scope.hasHouse = $rootScope.hasHouse;
      localStorageService.set('hasHouse', $scope.hasHouse);
    }
  );

  //if the user is logged in, then check if they have a house they are assigned to
  if($rootScope.user.isLoggedIn) {
    $rootScope.hasHouse = localStorageService.get('hasHouse') == null ? false : localStorageService.get('hasHouse');
  } else {
    $rootScope.hasHouse = false;
  }

  localStorageService.set('user',$rootScope.user)
  $rootScope.hasHouse = localStorageService.get('hasHouse') == null ? false : localStorageService.get('hasHouse');

  //handle logging out - triggers a watch event
  $scope.logoutSubmit = function() {
    $rootScope.user.isLoggedIn = false;
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