(function () {
    'use strict';
    angular.module('mainCommonApp')
        .directive('mainNav', function() {
         return {
            restrict: 'EA',
            templateUrl: function (ele, attr) {
                return attr.templateName ? attr.templateName : 'common/mainnav.html';
            },
            // templateUrl: 'mainnav.html',
            scope: {},
            replace: true,
            controller: 'mainNavCtrl',
            controllerAs: 'ctrl'
         };
    });
})();