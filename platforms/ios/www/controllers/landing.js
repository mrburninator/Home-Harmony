define('controllers/landing.js', [], function () {
  return function controller(cp) {
    cp.register('landingController', ['$scope','$rootScope','localStorageService', '$location', 'userAPI', function($scope, $rootScope, localStorageService, $location, userAPI) {
      $rootScope.pageName = 'Landing Page'
      $scope.fireDB = new Firebase(firebaseURL);

      $scope.loading = false;
      $scope.userName = "mrburninator"; //for chat testing
      //check if the user is logged in
      //& redirect them to the dashboard if they are
      if($scope.user.isLoggedIn) {
        //TODO : pull any necessary info from cache
        $location.path('dashboard');
      }

      //implement login submit logic
      $scope.loginSubmit = function() {
        $scope.loading = true;
        var username = this.name;
        var password = this.pwd;
        if(username && password) {
          //login using firebase credentials
          userAPI.login(username, this.pwd, $scope.fireDB, function(auth){
            $scope.hasHouse = $rootScope.hasHouse;
            //if true, go to dashboard.  else go to home page
            if($scope.hasHouse) {
              $location.path('dashboard');
            } else {
              $location.path('home');
            }
            //safely apply changes to scope
            if(!$scope.$$phase) { $scope.$apply(); }
          });
        } else {
          BootstrapDialog.alert('Username/Password cannot be blank');
        }
      };

      //implement register submit logic - register with firebase, then login
      $scope.registerSubmit = function() {
        //check for blank name, email, or password
        if(this.usr_name && this.usr_reg && this.pwd_reg) {
          $scope.loading = true;
          username = this.usr_name.toLowerCase();
          email = this.usr_reg;
          password = this.pwd_reg;
          //do user register and login if successful
          userAPI.register(username, email, password, $scope.fireDB, function(){
            userAPI.login(username, password, $scope.fireDB, function(){
              $scope.user.isLoggedIn = true;
              //go to dashboard
              $location.path('home');
              //safely apply changes to scope
              if(!$scope.$$phase) { $scope.$apply(); }
            });
          });
        } else {
          BootstrapDialog.alert('Username, Email, or Password cannot be blank');
        }
      };
      
      //TODO : put this in an api
      $scope.resetPasswordSubmit = function() {
        $rootScope.fireDB.resetPassword({
          email: this.email_reset
        }, function(error) {
          if (error) {
            switch (error.code) {
              case "INVALID_USER":
                BootstrapDialog.alert('Sorry, this email is not in our database');
                break;
              default:
                BootstrapDialog.alert('Sorry, could not reset password at this time');
            }
          } else {
            BootstrapDialog.alert('Password reset email sent successfully!');
            //reset email value
            this.email_reset = '';
            //go to login view
            $('view').addClass('hidden');
            $('#loginView').removeClass('hidden');
          }
        });
      }

      //toggle between login and register views on click
      $('.toggle_view').on('click',function(){
        var viewName = $(this).attr('value');
        $('view').addClass('hidden');
        $('#' + viewName + 'View').removeClass('hidden');
      });
    }]);
  }
});