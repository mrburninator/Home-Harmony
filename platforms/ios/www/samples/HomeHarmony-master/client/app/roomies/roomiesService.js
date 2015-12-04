angular.module('homeHarmony.roomies', ['firebase']).

factory('Roomies', ['$firebaseArray', function($firebaseArray) {

  var currentHouseId = localStorage.getItem('currentHouseId');
  
  var ref = new Firebase(DB.url + '/houses/' + currentHouseId + '/houseMembers');

  var syncArray = $firebaseArray(ref);

  return syncArray;
}]);

