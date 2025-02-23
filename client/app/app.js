'use strict';

angular.module('serveMeApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'react',
  'ui.select',
  'ui.sortable',
  'frapontillo.bootstrap-switch',
  'ezfb',
  'ngTouch'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider,ezfbProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

    ezfbProvider.setInitParams({
      // This is my FB app id for plunker demo app
      appId: '1580418822200809',
       version: 'v2.0'
    }); 
  })
  .filter('capitalize', function() {
    return function(input, all) {
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  })
  .filter('splitArr', function() {
        return function(input, splitChar) {
          var strToArr = input.split(splitChar);
          // console.log(strToArr.length)
            // do some bounds checking here to ensure it has that index
            return strToArr.length;
        }
    })
  .filter('range', function() {
    return function(input, total) {
      total = parseInt(total);
      for (var i=0; i<total; i++)
        input.push(i);
      return input;
    };
  })
  .filter('split', function() {
        return function(input, splitChar, splitIndex) {
          var strToArr = input.split(splitChar);
          // console.log(strToArr.length)
            // do some bounds checking here to ensure it has that index
            return input.split(splitChar)[splitIndex];
        }
    })
  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })
  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });

  });