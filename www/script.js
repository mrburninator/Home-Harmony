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
.factory('MesssageAPI', function() {
  var message = {
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
  $scope.fireDB = new Firebase("https://blazing-heat-3750.firebaseio.com/");
  //qingyu's firebase https://blazing-heat-3750.firebaseio.com/
  //robert's firebase https://dazzling-torch-6918.firebaseio.com
  $scope.loading = false;
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
  var issues = new Firebase("https://blazing-heat-3750.firebaseio.com/issues");
  $scope.issues = $firebaseArray(issues);

})
.controller('homeController', function($scope) {
  $scope.message = 'Home !';
})
.controller('issueController', function($scope,$firebaseArray) {
  $scope.message = 'Issue !';
  var ref = new Firebase("https://blazing-heat-3750.firebaseio.com/issues");
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
.controller('messagingController', function($scope) {
  $scope.message = 'Messaging !';
})
.controller('shoppinglistController', function($scope) {
  $scope.message = 'Shopping List !';
})
.controller('settingsController', function($scope) {
  $scope.message = 'Settings !';
});

//close the nav bar for mobile after selecting a view
$("#navbar").on('click',function(e) {
  if( $(e.target).is('a')) {
    $(this).collapse('hide');
  }
});

window.addEventListener('load', function () {
  FastClick.attach(document.body);
});
