(function () {
    'use strict';
    angular.module('mainCommonApp')
        .factory('mainNavSrv', ['$http', 'commonConstants', function($http, commonConstants) {
            var services = {};

            services.getNavigationContents = function () {
                return $http.get(commonConstants.mainNavJSON)
                .then(function (results) {
                    return results.data;
                });   
            };

            services.samplemethods = function () {
                var storageKey = exCommonConstants.selectedLineStorageKey;

                // grabbing the shopsessionID that is in the browser cookie to grab current sessionID
                storageKey = storageKey + '-' + $cookies.get('SHOPSESSIONID');
                var storedUpLine = $window.sessionStorage.getItem(storageKey);

                // we don't want to refresh the upgrading device details, and we got it from storage.
                if (action !== true && (storedUpLine !== null && storedUpLine !== undefined)) {
                    // yes, let's wrap it in a promise and return it
                    return $q.when(JSON.parse(storedUpLine));
                } else {
                    return $http.get(exCommonConstants.buyflowApi, {
                        params: {actionType: 'selectedupline'},
                        cache: exCacheManager.getCache()
                    }).then(function (results) {
                        // store the upgrading line result
                        $window.sessionStorage.setItem(storageKey, JSON.stringify(results.data));
                        // and return the upgrading line result
                        return results.data;
                    });
                }
            };





            return services;
    }]);
})();