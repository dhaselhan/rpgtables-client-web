angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ngBoilerplate.createtable',
  'ui.router'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.factory('TableService', ['$http', function(http) {

  return {
    getTable : function(id, success, failure) {
      http.get('http://localhost:8080/rpgtables/table/'+id).success(success).error(failure);
    },
    saveTable : function(id, tableData, success, failure) {
      alert(id);
      if (id == null) {
        http.post('http://localhost:8080/rpgtables/table/createtable', tableData).success(success).error(failure);
      }
      else {
        http.post('http://localhost:8080/rpgtables/table/'+id, tableData).success(success).error(failure);
      }
    },
    addColumn : function(table) {
      var newColumn = {
        header : "New Column",
        rowText : ["New Row"]
      };
      table.columns.push(newColumn);
      return table;
    },
    addRow : function(columnIndex, table) {
      table.columns[columnIndex].rowText.push("New Row");
      return table;
    },
    rollTable : function(tableData) {
      var rollResult = [];
      tableData.columns.forEach(function(column) {
        var selectedElement = Math.floor(Math.random()*column.rowText.length);
        rollResult.push(column.rowText[selectedElement]);
      });
      return rollResult;
    }
  };
}])

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | DnD Tables' ;
    }
  });
});