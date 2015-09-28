angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ngBoilerplate.createtable',
  'ngBoilerplate.mytables',
  'ui.router'
])
.constant("CONFIG", {
    "server_url": "https://localhost:8443"
})
.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run ($rootScope, $http, AuthenticationService) {
  $rootScope.onSignIn = AuthenticationService.onSignIn;
  $rootScope.isAuthenticated = false;
})

.factory('TableService', ['$http', 'CONFIG', function(http, CONFIG) {

  return {
    getTable : function(id, success, failure) {
      http.get(CONFIG.server_url + '/rpgtables/table/'+id).success(success).error(failure);
    },
    getTablesByUser : function(userId, success, failure) {
      http.get(CONFIG.server_url + '/rpgtables/table/user/'+userId).success(success).error(failure);
    },
    saveTable : function(id, tableData, success, failure) {
      if (id == null) {
        http.post(CONFIG.server_url + '/rpgtables/table/create', tableData).success(success).error(failure);
      }
      else {
        http.post(CONFIG.server_url + '/rpgtables/table/'+id, tableData).success(success).error(failure);
      }
    },
    addColumn : function(table) {
      var newColumn = {
        header : "",
        rowText : [""]
      };
      table.columns.push(newColumn);
      return table;
    },
    addRow : function(columnIndex, table) {
      table.columns[columnIndex].rowText.push("");
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
      http.get(CONFIG.server_url +'/rpgtables/table/recent').success(success).error(function () {
        alert("Unable to contact server");
      });
    }
  };
}])

.factory('AuthenticationService', ['$http', 'CONFIG', '$rootScope', '$injector', function(http, CONFIG, rootScope, injector) {
  return {
    onSignIn : function(googleUser) {
      var id_token = googleUser.getAuthResponse().id_token;
      rootScope.user_email = googleUser.getBasicProfile().getEmail();
      http.post(CONFIG.server_url + '/rpgtables/users/login', id_token)
        .success(function(token, status, headers, config) {
          //We have our token!
          rootScope.access_token = token;
          rootScope.isAuthenticated = true;
          http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
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
      $scope.pageTitle = toState.data.pageTitle + ' | RPG Tables' ;
    }
  });
});