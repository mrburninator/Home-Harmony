define('controllers/home.js', [], function () {
  return function controller(cp) {
    cp.register('homeController', ['$scope','$rootScope', function($scope, $rootScope) {
      //remove
      console.log('homeController says:' + $rootScope.test);

        $scope.createHomeSubmit = function() {
        console.log("create home submit happened");
          var house = {
            "name": this.home_name
          };

          $rootScope.currentHomeID = $rootScope.fireDB.child('houses').push(house);
          //TODO : get the id of the new home and join it immediately after
        }
        $scope.joinHomeSubmit = function() {
          console.log("join home submit happened");
          var user = {
            "name" : $rootScope.user.currentUserEmail
            "id" : $rootScope.user.ID
          }
          //TODO : need to make sure the value exists before we go and add a user!
          // $rootScope.currentHomeID = $rootScope.fireDB.child('houses').child(this.home_id).child('users').push(user);
          
          //Fetch the houses list from the DB
          //Iterate over them, looking for a name match
          //when the name matches, join it and enable access to other pages
          //Also update the global flags stored on the rootScope.
        }
      }]);
  }
});