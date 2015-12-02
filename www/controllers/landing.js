define('controllers/landing.js', [], function () {
  return function controller(cp) {
    cp.register('landingController', ['$scope','$rootScope','localStorageService', '$location', 'userAPI', function($scope, $rootScope, localStorageService, $location, userAPI) {
      //remove
      //$rootScope.test = 'test';
      //console.log('landingController says: setting rootscope.test:',$rootScope.test);

      $scope.fireDB = new Firebase(firebaseURL);
      $scope.loading = false;
      //TODO : we should be storing the username in the db
      $scope.userName = "mrburninator"; //for chat testing
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
        userAPI.login(this.usr, this.pwd, $scope.fireDB, function(auth){
          console.log(auth);
          $scope.user.isLoggedIn = true;
          // $scope.user.currentUserID = auth.id;
          // $scope.user.currentUserEmail = this.usr;
          // $scope.user.currentPass = this.pwd;
          // $scope.user.currentHomeID = auth.id;
            //TODO : check if the user has a house-
            if($scope.hasHouse) {
              //if true, go to dashboard.  else go to home page
              $location.path('dashboard');
            } else {
              $location.path('home');
            }
            $scope.$apply();
        });
      };

      //TODO : implement register submit logic
      $scope.registerSubmit = function() {
        //TODO : requires register service
        if(this.usr_reg && this.pwd_reg) {
          $scope.loading = true;
          username = this.usr_name;
          email = this.usr_reg;
          password = this.pwd_reg;
          userAPI.register(username, email, password, $scope.fireDB, function(){
            userAPI.login(email, password, $scope.fireDB, function(){
              $scope.user.isLoggedIn = true;
              //go to dashboard
              $location.path('home');
              $scope.$apply();
            });
          });
        } else {
          console.log('it didnt pass!!!');
        }
      };
      //toggle between login and register views on click
      $('.toggle_view').on('click',function(){
        $('view').toggleClass('hidden');
      });
    }]);
  }
});