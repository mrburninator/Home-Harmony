angular.module('homeHarmony.nav', [])
.directive('mainNav', function() {
  return {
    replace: true,
    templateUrl: 'app/nav/nav.html'
  };
});