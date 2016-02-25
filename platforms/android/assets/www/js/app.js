'use strict';
angular
  .module('app', ['ionic', 'ngTouch'])

  .config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: 'views/ionic-swipe.html',
        controller: 'ListCtrl',
        controllerAs: 'vm'
    });
  $urlRouterProvider.otherwise('home');

  })
  .controller('ListCtrl', ListCtrl);

  ListCtrl.$inject = ['$scope'];

  function ListCtrl($scope) {
    var vm = this;

    vm.items = [];
    for (var i = 0; i < 8; i++) {
      vm.items.push(
        {
          title: 'Item title '+i,
          detail: 'Details of item ' + i + ' described in this section.',
          img: './img/Icon.png',
          response: ''
        });
    }
    // _________ View-Model methods
    vm.respondItem = function(item) {
      console.log(item.title + ' ' + item.response);
    };
    vm.removeItem = function(index) {
     vm.items.splice(index, 1);
    };
  }
