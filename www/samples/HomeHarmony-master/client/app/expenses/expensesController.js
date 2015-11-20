/**
 * Home Harmony Expenses
 * Controller for expenses page
 */
angular.module('homeHarmony.expenses', ['firebase'])

.controller('expensesCtrl', function(Roomies, $scope, $rootScope, $firebaseArray, $q, DrawPie, DButil) {
  // database reference
  var db = new Firebase(DB.url);
  var expensesDb;
  var expensesArr;
  var userExpensesArr;
  var dataObj;
  var uDataObj;

  $scope.getExpensesForSelectedYear = function() {
    return $firebaseArray(new Firebase(DB.url + '/houses/' + currentHouseId + '/expenses/' + $scope.selectedYear));
  };

  $scope.updateEnabledMonths = function(expensesForCurrentYear) {
    for(var month in $scope.enabledMonths) {
      $scope.enabledMonths[month] = false;
    }

    $scope.expensesForCurrentYear.forEach(function(expensesForMonth) {
      var month = expensesForMonth.$id;
      $scope.enabledMonths[month] = true;
    });
  }

  $scope.yearChange = function() {
    if($scope.expensesForCurrentYear) {
      $scope.expensesForCurrentYear.$destroy();
    }

    $scope.expensesForCurrentYear = $scope.getExpensesForSelectedYear();

    $scope.expensesForCurrentYear
    .$loaded()
    .then($scope.updateEnabledMonths);

    $scope.expensesForCurrentYear
    .$watch(function() {
      $scope.updateEnabledMonths();
      $scope.showExpenses();
    });
  };

  $scope.monthChange = function(month) {
    $scope.selectedMonth = month;
    $scope.showExpenses($scope.selectedMonth, $scope.selectedYear);
  };

  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");
  $scope.currentDate = new Date();

  $scope.expenseRef = $firebaseArray(new Firebase(DB.url + '/houses/' + currentHouseId + '/expenses'));
  
  $scope.selectedYear = String($scope.currentDate.getFullYear());
  
  $scope.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  $scope.enabledMonths = $scope.months.reduce(function(enabledMonths, month) {
    enabledMonths[month] = false;
    return enabledMonths;
  },{});

  $scope.selectedMonth = $scope.months[$scope.currentDate.getMonth()];

  $scope.memberPaid = null;
  $scope.roomies = Roomies;

  $scope.yearChange();

  $scope.showExpenses = function(month, year) {    //add support for month and year
    month = month || $scope.selectedMonth;
    year = year || $scope.selectedYear;

    // query database
    db.once("value", function(snapshot) {
      expensesArr = [];
      userExpensesArr = [];


      expensesDb = snapshot.val().houses[currentHouseId].expenses[year][month]; //new schema
      houseMembersDb = snapshot.val().houses[currentHouseId].houseMembers;  //new schema
      usersDb = snapshot.val().users;

      // create an array of expense data to be displayed in expense view
      for (var expense in expensesDb) {           //ensure that dataObj is contructed properly with the new schema
        dataObj = {};
        dataObj.name = expensesDb[expense].expenseName;
        dataObj.y = expensesDb[expense].cost;
        dataObj.memberPaid = usersDb[expensesDb[expense].memberPaid].firstname + ' ' + usersDb[expensesDb[expense].memberPaid].lastname;
        expensesArr.push(dataObj);
      }
      // Execute when expensesArr is ready
      $q.all(expensesArr).then(function() {
        // Add to scope to be displayed
        $scope.expensesArr = expensesArr;
        // draw pie graph
        DrawPie.drawPie($scope, "Expense Analysis", true);
      });
      // create an array of user specific expenses
      for (var roomie in houseMembersDb) {
        uDataObj = {};
        uDataObj.name = houseMembersDb[roomie].firstname + ' ' + houseMembersDb[roomie].lastname;
        
        var monthlyDuesObj = houseMembersDb[roomie].dues[year][month];
        var monthlyDue = 0;
        for(var expense in monthlyDuesObj) {
          monthlyDue += monthlyDuesObj[expense].due;
        }        
        uDataObj.y = monthlyDue;
        // uDataObj.paid = houseMembersDb[roomie].paid;
        userExpensesArr.push(uDataObj);
      }
      // Execute when userExpensesArr is ready
      $q.all(userExpensesArr).then(function() {
        // Add to scope to be displayed

        // console.log('userExpensesArr:',userExpensesArr);
        $scope.userExpensesArr = userExpensesArr;
      });
    },
    function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  };

  $scope.newExpense = function() {
    var date = $scope.expenseDate;
    var memberPaid = $scope.memberPaid;  
    var prevSelectedYear = $scope.selectedYear;
    var expenseDate = {
      month: $scope.months[date.getMonth()],
      year: date.getFullYear()
    };

    $scope.selectedMonth = expenseDate.month;

    $scope.selectedYear = String(expenseDate.year);

    if( $scope.selectedYear !== prevSelectedYear ) {
      $scope.yearChange();
    }

    $('#expenseName').val('');
    $('#expenseCost').val('');
    $('#expenseDate').val('');
    $('#memberPaid')[0].selectedIndex = 0;

    // console.log('expensesController.js says: new Expense Added! Particulars:');
    // console.log('memberPaidID:',$scope.memberPaid);
    // console.log('expenseDate:',expenseDate);
    // console.log('No. of roomies:',Roomies.length);

    //calculate the share
    var sharedDue = $scope.expenseCost / Roomies.length;
    // console.log('expenseCost = ', $scope.expenseCost);
    // console.log('sharedDue = ',sharedDue);

    //update the dues for each roomie in houseMembers
     var houseMembersRef = db.child('houses').child(currentHouseId).child('houseMembers');

    // Create expense object to be added to database
    var expenseObj = {
      expenseName: $scope.expenseName,
      // dueDate: (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear(),
      cost: $scope.expenseCost,
      // paid: false,
      memberPaid: memberPaid,
    };
    
    //new schema
    var expenseMonthRef = db.child('houses').child(currentHouseId).child('expenses').child(expenseDate.year).child(expenseDate.month);
    var expenseId = expenseMonthRef.push(expenseObj);
    //console.log('testing',expenseId.key());

    //use the expense Id to push dues for each roomie
    houseMembersRef.once('value', function (snapshot) {
      var houseMembersObj = snapshot.val();
      var year = expenseDate.year + '';
      var month = expenseDate.month + '';

      //console.log('Updating dues for each roomie. houseMembers:',houseMembersObj);
      for(var roomieId in houseMembersObj) {
        var due = (roomieId === $scope.memberPaid) ? $scope.expenseCost - sharedDue : -sharedDue;
        houseMembersRef.child(roomieId+'').child('dues').child(year).child(month).child(expenseId.key()).set({
          due : due
        });
      }
      //houseMembersRef.set(houseMembersObj);
    });


    // Split expense and add to each user in database
    $scope.splitExpense(expenseObj);
  };

  $scope.splitExpense = function(expense) {
    // query database
    db.once("value", function(snapshot) {
      var houseMembers = snapshot.val().houses[currentHouseId].houseMembers;
      $scope.houseSize = Object.keys(houseMembers).length;
      // for each member of the house
      for (var memberId in houseMembers) {
        DButil.getUserIdFromEmail(houseMembers[memberId], function(userId) {
          // Add their share of the expense
          db.child('users').child(userId).child('userExpenses').push({
            name: expense.expenseName,
            splitCost: expense.cost/$scope.houseSize,
            paid: false
          });
        });
      }
    });
  };

  $scope.payExpense = function(expenseName) {
    db.on('value', function(snapshot) {
      uExpenseDb = snapshot.val().users[currentUserId].userExpenses;
      for (var expense in uExpenseDb) {
        if (uExpenseDb[expense].name === expenseName) {
          // set paid property to true for chosen expense
          db.child('users').child(currentUserId).child('userExpenses').child(expense).update({
            paid: true
          });
        }
      }
    });
  };
  $scope.showExpenses();
})
.factory('DrawPie', function() {
  return {
    // showLabels true means each section has an arrow and description,
    // false means the key is under the graph
    drawPie : function($scope, title, showLabels) {
      
      $('#expGraph').highcharts( {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: title
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: showLabels,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          },
          showInLegend: !showLabels
        }
      },
      series: [{
        name: "Expenses",
        colorByPoint: true,
        data: $scope.expensesArr
      }]
    });
    }
  };
});
