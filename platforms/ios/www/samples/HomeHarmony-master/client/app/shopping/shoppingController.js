/**
 * Home Harmony Issues
 * Controller for Issues page
 */
angular.module('homeHarmony.shopping', ['firebase'])

.controller('shoppingCtrl', function ($scope, $q) {
  // database reference
  var db = new Firebase(DB.url);
  var allShoppingItems;
  var shoppingDb = {};
  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserName = localStorage.getItem("currentUserName");

  $scope.addShoppingItem = function() {
    $('#shoppingItemField').val('');
    var now = new Date();
    // Issue object to be added to database
    newShoppingItem = {
      date: (now.getMonth() + 1) + '/' + now.getDate() + '/' +  now.getFullYear(),
      text: $scope.shoppingText,
      addedBy: currentUserName
    };
    // Add to database
    db.child('houses').child(currentHouseId).child('shoppingList').push(newShoppingItem);
  };

  $scope.getShoppingItems = function() {
    // Query database for issues
    db.on('value', function(snapshot) {
      var dbValues = snapshot.val();
      var thisHouse = dbValues.houses[currentHouseId];
      shoppingDb = thisHouse.shoppingList;
      allShoppingItems = [];
      // Fill array with shopping data
      for (var shoppingItem in shoppingDb) {
        allShoppingItems.push(shoppingDb[shoppingItem]);
      }
      // Execute when allShoppingItems is ready
      $q.all(allShoppingItems).then(function() {
        // Add to scope to be displayed
        $scope.allShoppingItems = allShoppingItems;
      });
    });
  };

  $scope.removeShoppingItem = function(shoppingText) {
    // query database
    db.on('value', function(snapshot) {
      shoppingDb = snapshot.val().houses[currentHouseId].shoppingList;
      // search for issue using its textual content
      for (var shoppingItem in shoppingDb) {
        if (shoppingDb[shoppingItem].text === shoppingText) {
          // remove selected issue
          db.child('houses').child(currentHouseId).child('shoppingList').child(shoppingItem).remove();
        }
      }
    });
  };
  // show issues on page load
  $scope.getShoppingItems();
});
