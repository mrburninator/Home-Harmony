define('controllers/home.js', [], function () {
  return function controller(cp) {
    cp.register('homeController', ['$scope','$rootScope', 'homeAPI', function($scope, $rootScope, homeAPI) {
      //remove
      console.log('homeController says:' + $rootScope.test);

        $scope.createHomeSubmit = function() {
          console.log("create home submit happened");
          homeAPI.createHome(this.home_name);
        }
        $scope.joinHomeSubmit = function() {
          console.log("join home submit happened");
          homeAPI.joinHome(this.home_id);
        }
      }]);
  }
});