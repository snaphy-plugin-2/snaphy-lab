'use strict';

angular.module($snaphy.getModuleName())
//Controller for dashboardControl ..
.controller('dashboardControl', ['$scope', '$stateParams','Database',
    function($scope, $stateParams, Database) {
    	$scope.homeState = $snaphy.loadSettings('dashboard', "homeState");
        //Set snaphy default template value to true..
        $snaphy.setDefaultTemplate(true);
    }//controller function..
]);
