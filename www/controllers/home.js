define('controllers/home.js', [], function () {
  return function controller(cp) {
    cp.register('homeController', ['$scope','$rootScope', function($scope, $rootScope) {
      //remove
      //console.log('homeController says: rootScope.test););,$root

        $scope.createHomeSubmit = function() {
        console.log("create home submit happened");
          this.usr, this.pwd
        }
        $scope.joinHomeSubmit = function() {
        console.log("join home submit happened");
        }
      }]);
  }
});