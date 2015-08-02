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
angular.module( 'ngBoilerplate.mytables', [
  'ui.router'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'mytables', {
    url: '/mytables',
    views: {
      "main": {
        controller: 'MyTablesCtrl',
        templateUrl: 'mytables/mytables.tpl.html'
      }
    },
    data:{ pageTitle: 'My Tables' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'MyTablesCtrl', function MyTablesController( $scope, TableService ) {
  var userId = $scope.user_email;
  alert(userId);
  TableService.getTablesByUser(userId,
    function(data, status, headers, config) {
      $scope.usersTables = data;
    },
    function(data, status, headers, config) {
      alert('Server is Down :(');
    }
  );
})

;

