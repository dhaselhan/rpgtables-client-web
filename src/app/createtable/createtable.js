/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'ngBoilerplate.createtable', [
  'ui.router'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'createtable', {
    url: '/create',
    views: {
      "main": {
        controller: 'CreateTable',
        templateUrl: 'createtable/createtable.tpl.html'
      }
    },
    data:{ pageTitle: 'Create New Table' }
  }).state( 'edittable', {
    url: '/table/:tableId',
    views: {
      "main": {
        controller: 'CreateTable',
        templateUrl: 'createtable/createtable.tpl.html'
      }
    },
    data:{ pageTitle: 'Edit A Table' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'CreateTable', function CreateTableController( $scope, $http, $stateParams, TableService ) {
  if ($stateParams.tableId == null) {
    TableService.getTable('empty',
      function(data, status, headers, config) {
        $scope.newTable = data;
      },
      function(data, status, headers, config) {
        alert('Server is Down :(');
      }
    );
  } else {
    TableService.getTable($stateParams.tableId,
      function(data, status, headers, config) {
        $scope.newTable = data;
      },
      function(data, status, headers, config) {
        alert('Server is Down :(');
      }
    );
  }

 

  $scope.addColumn = function() {
    $scope.newTable = TableService.addColumn($scope.newTable);
  };

  $scope.addRow = function(columnIndex) {
    $scope.newTable = TableService.addRow(columnIndex, $scope.newTable);
  };

  $scope.rollTable = function() {
    var tableData = $scope.newTable;
    $scope.rollResult = TableService.rollTable(tableData);
  };

  $scope.isEdit = true;
  $scope.enableEdit = function() {
    $scope.isEdit = true;
  };

  $scope.saveEdit = function() {
    $scope.isEdit = false;

    TableService.saveTable($scope.newTable.id, $scope.newTable,
      function(data, status, headers, config) {
        $scope.newTable = data;
      },
      function(data, status, headers, config) {
        alert('save failed');
      }
    );
  };
})

;

