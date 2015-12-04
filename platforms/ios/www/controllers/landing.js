define('controllers/landing.js', [], function () {
  return function controller(cp) {
    cp.register('landingController', ['$scope','$rootScope','localStorageService', '$location', 'userAPI', function($scope, $rootScope, localStorageService, $location, userAPI) {

      //TODO : get rid of redundancy here
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
        var username = this.name;
        var password = this.pwd;
        if(username && password) {
          userAPI.login(username, this.pwd, $scope.fireDB, function(auth){
            $scope.user.isLoggedIn = true;

            $rootScope.user = {};
            $rootScope.user.isLoggedIn = true;
            $rootScope.user.username = username.toLowerCase();
            $rootScope.user.password = password;


            $rootScope.fireDB.child('users').child($rootScope.user.username).child('houses').once('value',function(data){
              var houses = data.val();
              $rootScope.hasHouse = houses ? true : false;
              $scope.hasHouse = $rootScope.hasHouse;

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
        } else {
          BootstrapDialog.alert('Username/Password cannot be blank');
        }
      };

      //TODO : implement register submit logic
      $scope.registerSubmit = function() {
        //TODO : requires register service
        if(this.usr_reg && this.pwd_reg) {
          $scope.loading = true;
          username = this.usr_name.toLowerCase();
          email = this.usr_reg;
          password = this.pwd_reg;
          //TODO : see if register already exists in /users - fail if it does.
          //otherwise, do user register

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
          BootstrapDialog.alert('Username or Password cannot be blank');
        }
      };
      //toggle between login and register views on click
      $('.toggle_view').on('click',function(){
        $('view').toggleClass('hidden');
      });
    }]);
  }
});