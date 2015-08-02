angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ngBoilerplate.createtable',
  'ngBoilerplate.mytables',
  'ui.router'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run ($rootScope, $injector, AuthenticationService) {
  $rootScope.onSignIn = AuthenticationService.onSignIn;
  $injector.get("$http").defaults.transformRequest = function(data, headersGetter) {
    //alert("Token " + access_token);
    if ($rootScope.access_token) {
      headersGetter()['Authorization'] = "Bearer "+$rootScope.access_token;
    }
    if (data) {
      return angular.toJson(data); 
    }
  }; 
})

.factory('TableService', ['$http', function(http) {

  return {
    getTable : function(id, success, failure) {
      http.get('http://localhost:8080/rpgtables/table/'+id).success(success).error(failure);
    },
    getTablesByUser : function(userId, success, failure) {
      http.get('http://localhost:8080/rpgtables/table/user/'+userId).success(success).error(failure);
    },
    saveTable : function(id, tableData, success, failure) {
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
    },
    getRecentTables : function(success) {
      http.get('http://localhost:8080/rpgtables/table/recent').success(success).error(function () {
        alert("Unable to contact server");
      });
    }
  };
}])

.factory('AuthenticationService', ['$http', '$rootScope', function(http, rootScope) {
  return {
    onSignIn : function(googleUser) {
      var id_token = googleUser.getAuthResponse().id_token;
      rootScope.user_email = googleUser.getBasicProfile().getEmail();
      http.post('https://localhost:8443/rpgtables/users/login', id_token)
        .success(function(data, status, headers, config) {
          //We have our token!
          rootScope.access_token = data;
          //var headerToken = 'Basic ' + data;
          //alert(headerToken);
          //http.defaults.headers.common.Authorization = headerToken;
        })
        .error(function(data, status, headers, config) {
          alert('Failed to recieve response from serverS');
        });
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