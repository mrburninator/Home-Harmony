define('controllers/dashboard.js', [], function () {
  return function controller(cp) {
    cp.register('dashboardController', ['$scope', '$rootScope', '$firebaseArray', function($scope, $rootScope, $firebaseArray) {
      //remove
      console.log('dashboardController says:', $rootScope.test);

      $scope.message = 'Dashboard !';

      //load the issue list
      var issues = new Firebase( firebaseURL + "/issues" );
      $scope.issues = $firebaseArray(issues);

    }]);
  }
});

