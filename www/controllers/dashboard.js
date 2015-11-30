define('controllers/dashboard.js', [], function () {
  return function controller(cp) {
    cp.register('dashboardController', function($scope,$firebaseArray) {
      $scope.message = 'Dashboard !';

      //load the issue list
      var issues = new Firebase( firebaseURL + "/issues" );
      $scope.issues = $firebaseArray(issues);

    });
  }
});

