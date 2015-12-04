/**
 * Home Harmony
 * Central module for application
 */
var totalDb = {};
var userDb = {};
var currentUser = localStorage.getItem('currentUserName') || 'DEFAULT_USER';
var currentUserId = localStorage.getItem('currentUserId') || 'DEFAULT_USER_ID';
var currentHouseId = localStorage.getItem('currentHouseId') || 'DEFAULT_HOUSE_ID';

// This is an array of routes not allowed if the user doesn't have a house
var needsHouseFor = [
  'dash',
  'dash.default',
  'dash.issues',
  'dash.expenses',
  'dash.tasks',
  'dash.shopping'
];

// Module and dependency injections
angular.module('homeHarmony', [
  'ui.router',
  'ui.gravatar',
  'ngMessages',
  'homeHarmony.nav',
  'homeHarmony.util',
  'homeHarmony.auth',
  'homeHarmony.newUser',
  'homeHarmony.login',
  'homeHarmony.default',
  'homeHarmony.newHouse',
  'homeHarmony.dash',
  'homeHarmony.expenses',
  'homeHarmony.tasks',
  'homeHarmony.issues',
  'homeHarmony.shopping',
  'homeHarmony.roomies'
])
.config(function($stateProvider, $urlRouterProvider) {
  // Set up the states
  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "./app/auth/login.html",
      controller: 'LoginCtrl',
      controllerAs: 'login'
    })
    .state('landing', {
      url: "/landing",
      templateUrl: "./app/landing/landing.html",
    })
    .state('newUser', {
      url: "/newUser",
      templateUrl: "./app/auth/newUser.html",
      controller: 'NewUserCtrl',
      controllerAs: 'newUser'
    })
    .state('newHouse', {
      url: "/newHouse",
      templateUrl: "./app/dash/partials/newHouse.html",
      controller: "newHouseCtrl",
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        "currentAuth": ["Auth", function(Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          return Auth.$requireAuth();
        }]
      }
    })
    .state('dash', {
      url: "/dash",
      templateUrl: "./app/dash/dash.html",
      controller: "dashCtrl",
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        "currentAuth": ["Auth", function(Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          return Auth.$requireAuth();
        }]
      }
    })
    // Nested views for dash
    .state('dash.default', {
      url: "/default",
      templateUrl: "./app/dash/partials/default.html",
      controller: "defaultCtrl",
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        "currentAuth": ["Auth", function(Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          return Auth.$requireAuth();
        }]
      }
    })
    .state('dash.tasks', {
      url: "/tasks",
      templateUrl: "./app/tasks/tasks.html",
      controller: "tasksCtrl"
    })
    .state('dash.issues', {
      url: "/issues",
      templateUrl: "./app/issues/issues.html",
      controller: "issuesCtrl"
    })
    .state('dash.expenses', {
      url: "/expenses",
      templateUrl: "./app/expenses/expenses.html",
      controller: "expensesCtrl"
    })
    .state('dash.shopping', {
      url: "/shopping",
      templateUrl: "./app/shopping/shopping.html",
      controller: "shoppingCtrl"
    });

  // For any unmatched url, redirect to /landing
  $urlRouterProvider.otherwise("/landing");
})
.run(["$rootScope", "$state", function($rootScope, $state) {

  // If the user is logged in and doesn't have a house, not allowed to visit the routes in
  // the array needsHouseFor
  $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams) {
    if ( currentHouseId === 'DEFAULT_HOUSE_ID' && needsHouseFor.indexOf(toState.name) >= 0 ) {
      $state.go('newHouse');
    }
  });


  // if any of the resolve properties above throw an error
  // due to authentication, reroute to login screen
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    event.preventDefault();
    if (error === "AUTH_REQUIRED") {
      $state.go("login");
    }
  });

  $rootScope.currentUser = localStorage.getItem('currentUserName');

}]);
