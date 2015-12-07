define('controllers/home.js', [], function () {
  return function controller(cp) {
    cp.register('homeController', ['$scope','$rootScope', 'homeAPI', function($scope, $rootScope, homeAPI) {
      $rootScope.pageName = 'Join a Home'
        $scope.createHomeSubmit = function() {
          homeAPI.createHome(this.home_name);
        }
        $scope.joinHomeSubmit = function() {
          homeAPI.joinHome(this.home_id);
        }
      }]);
  }
});