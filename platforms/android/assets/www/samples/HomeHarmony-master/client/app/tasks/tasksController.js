/**
 * Home Harmony Tasks
 * Controller for tasks page
 */
angular.module('homeHarmony.tasks', ['firebase', 'ngMessages'])

.controller('tasksCtrl', function($scope, $firebaseObject, $q) {
  // database reference
  var db = new Firebase(DB.url);
  var sortCompTaskByDateArr;
  var sortByDateArr;
  var taskDb = {};
  $scope.tasks = {};
  $scope.tasks.taskArr;
  $scope.tasks.compTaskArr;
  $scope.tasks.currentDate = new Date();

  // Populates select element on tasks form with house member names
  $scope.houseMemberArr = JSON.parse(localStorage.getItem('currentUsersArr'));
  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");

  $scope.tasks.addTask = function() {
    var now = new Date();
    var due = $scope.newTaskDueDate;
    // Task object to be added to database
    taskObj = {
      description: $scope.newTask,
      doer: $scope.newTaskDoer,
      dueDate: (due.getMonth() + 1) + '/' + due.getDate() + '/' +  due.getFullYear(),
      dateCreated: (now.getMonth() + 1) + '/' + now.getDate() + '/' +  now.getFullYear(),
      assignedBy: localStorage.getItem("currentUserName"),
      // A task is completed when the user checks its checkbox
      completed: false,
      repeating: -1
    };
    // Pushes task into database
    db.child('houses').child(currentHouseId).child('tasks').push(taskObj);

    db.child('houses').child(currentHouseId).child('tasks').once('child_added', function(snapshot) {
      var taskId = snapshot.key();

      // Updates view with new tasks
      $scope.tasks.getTasks();
    });
    $scope.tasks.clearTasksForm();
  };

  $scope.tasks.getTasks = function() {
    // Listen for a task to be added
    db.once('value', function(snapshot) {
      var temp = snapshot.val();
      var temp2 = temp.houses[currentHouseId];
      taskDb = temp2.tasks;

      // Overrides current tasks in arrays
      $scope.tasks.taskArr = [];
      $scope.tasks.compTaskArr = [];
      sortCompTaskByDateArr = [];
      sortByDateArr = [];

      for (var prop in taskDb) {
        taskDb[prop].id = prop;
        if (taskDb[prop].completed) {
          sortCompTaskByDateArr.push(taskDb[prop]);
          $q.all(sortCompTaskByDateArr).then(function() {
            // Displays the 12 most recently completed tasks in descending order
            $scope.tasks.compTaskArr = $scope.tasks.sortByDate(sortCompTaskByDateArr);
          });
        } else if (!taskDb[prop].completed) {
          sortByDateArr.push(taskDb[prop])
          $q.all(sortByDateArr).then(function() {
            // Sorts and displays date in descending order
            $scope.tasks.taskArr = $scope.tasks.sortByDate(sortByDateArr);
          });
        }
      }
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    })
  };

  // Creates readable format for dates to display in view
  $scope.tasks.parseDate = function(taskObj) {
    for (var task in taskObj) {
      taskObj[task].dueDateFormat = new Date(taskObj[task].dueDate).toLocaleDateString();
    }
    return taskObj;
  }

  $scope.tasks.sortByDate = function(arr) {
    if (arr.length > 0) {
      var sortedArr = arr.sort(function(a, b) { return Date.parse(a.dueDate) > Date.parse(b.dueDate) });
      return $scope.tasks.parseDate(sortedArr);
    } else {
      return arr[0];
    }
    return $scope.tasks.parseDate(arr);
  }

  $scope.tasks.checkTask = function(task) {
    console.log("task obj", task);
    console.log("check task was called");
    if (task.completed === false) {
      db.child('houses').child(currentHouseId).child('tasks').child(task.id).update({'completed': true});
    } else {
      db.child('houses').child(currentHouseId).child('tasks').child(task.id).update({'completed': false});
    }
    // Re-render tasks so completed task will go to the bottom of the list
    $scope.tasks.getTasks();
  };

  $scope.tasks.clearTasksForm = function() {
    $scope.newTask = '';
    $scope.newTaskDoer = '';
    $scope.newTaskDueDate = '';
    // Resets form to not trigger validation error after form has been submitted
    $scope.tasksForm.$setPristine();
  };
  $scope.tasks.getTasks();
})
