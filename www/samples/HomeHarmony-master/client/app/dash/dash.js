/**
 * Home Harmony Dash
 * Controller for header on dashboard
 */
angular.module('homeHarmony.dash', [])

.controller('dashCtrl', function ($rootScope,UserAuth) {
  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");

  // Unauthorizes user
  $rootScope.logOut = function() {
    console.log('Logging out.');
    UserAuth.logout();
  };
});
