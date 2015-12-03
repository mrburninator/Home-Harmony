define('controllers/landing.js', [], function () {
  return function controller(cp) {
    cp.register('landingController', ['$scope','$rootScope','localStorageService', '$location', 'userAPI', function($scope, $rootScope, localStorageService, $location, userAPI) {
      $scope.loading = false;
      //check if the user is logged in
      //& redirect them to the dashboard if they are
      if($rootScope.user.isLoggedIn) {
        $location.path('dashboard');
      }

      $scope.login = function(name,password,callback) {
        $rootScope.fireDB.authWithPassword({
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

      //implement login submit logic
      $scope.loginSubmit = function() {
        $scope.loading = true;
        var username = this.name;
        var password = this.pwd;

        userAPI.login(username, this.pwd, $scope.fireDB, function(auth){
          $rootScope.user = {};
          $rootScope.user.isLoggedIn = true;
          $rootScope.user.username = username;
          $rootScope.user.password = password;

          $rootScope.fireDB.child('users').child($rootScope.user.username).child('houses').once('value',function(data){
            //make sure the user has a house before proceeding
            if(data.exists()) {
              var houses = data.val();
              $rootScope.hasHouse = houses ? true : false;
            } else {
              $rootScope.hasHouse = false;
            }
            if($scope.hasHouse) {
              $rootScope.user.house = houses;
              //if true, go to dashboard.  else go to home page
              $location.path('dashboard');
            } else {
              $location.path('home');
            }
            $scope.$apply();
          });
        });
      };

      //implement register submit logic
      $scope.registerSubmit = function() {
        if(this.usr_reg && this.pwd_reg) {
          $scope.loading = true;
          username = this.usr_name;
          email = this.usr_reg;
          password = this.pwd_reg;
          //register the user, then log them in.
          userAPI.register(username, email, password, $scope.fireDB, function(){
            userAPI.login(username, password, $scope.fireDB, function(){
              $rootScope.user.isLoggedIn = true;
              //go to dashboard
              $location.path('home');
              $scope.$apply();
            });
          });
        } else {
          //TODO : do a dialog popup here
          console.log('WARNING - EMPTY USERNAME OR PASSWORD NOT ALLOWED');
        }
      };
      //toggle between login and register views on click
      $('.toggle_view').on('click',function(){
        $('view').toggleClass('hidden');
      });
    }]);
  }
});