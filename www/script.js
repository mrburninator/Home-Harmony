/*
    TODO :
        -put services into separate files
*/

angular.module('main', ['ngRoute', 'ngAnimate', 'LocalStorageModule'])
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
    .otherwise({
        redirectTo: '/landing'
    });

    localStorageServiceProvider
    .setPrefix('HH')
    .setStorageType('sessionStorage')
    .setNotify(true, true);
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
//load the controllers
.controller('landingController', ['$scope','localStorageService', '$location', function($scope, localStorageService, $location) {
    $scope.fireDB = new Firebase("https://blazing-heat-3750.firebaseio.com/");
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
        $scope.login(this.usr, this.pwd, function(){
            $scope.user.isLoggedIn = true;
            //go to dashboard
            $location.path('dashboard');
            // $scope.loading = false;
        });
    };

    //TODO : implement register submit logic
    $scope.registerSubmit = function() {
        //TODO : requires register service
        if(this.usr_reg && this.pwd_reg) {
            $scope.loading = true;
            $scope.fireDB.createUser({
              email    : this.usr_reg,
              password : this.pwd_reg
            }, function(error, userData) {
              if (error) {
                console.log("Error creating user:", error);
              } else {
                console.log("Successfully created user account with uid:", userData.uid);
                $scope.login(this.usr_reg,this.pwd_reg,function(loc){
                    //On Success Case:
                    $scope.user.isLoggedIn = true;
                    //go to dashboard
                    loc.path('dashboard');
                    $scope.loading = false;
                }, $location)
              }
            });
        } else {
            console.log('it didnt pass!!!');
        }
        console.log('got to here!');
    };
    //toggle between login and register views on click
        //TODO : check if this can be done with angular
    $('.toggle_view').on('click',function(){
        $('ui-view').toggleClass('hidden');
    });
}])
.controller('dashboardController', function($scope) {
    $scope.message = 'Dashboard !';
})
.controller('homeController', function($scope) {
    $scope.message = 'Home !';
})
.controller('issueController', function($scope) {
    $scope.message = 'Issue !';
})
.controller('messagingController', function($scope) {
    $scope.message = 'Messaging !';
})
.controller('shoppinglistController', function($scope) {
    $scope.message = 'Shopping List !';
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
