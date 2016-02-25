# Ionic Swipe Starter

An Ionic starter project, with a swipeable item list, featuring `on-respond` and `on-remove` listeners, along with an `undo` option.

- Roberto von Schoettler
- v 1.0.0 Feb 2016
- Licensed: MIT license

# Installation

```shell
ionic start [your-app-name] https://github.com/schoettler/ionic-swipe
```
Click **[here](http://codepen.io/schoettler/pen/qbzGvG)** for the live **Codepen**.

To run on **Android**:
```shell
cordova platform add android
cordova run android
```
# Requirements
- Angular
- Angular Touch
- Ionic

# Example
### In your index...
Include the requirements, the CSS and the directive file:
```html
<link rel="stylesheet" href="css/main.css">
<script src="js/directives/item-swipe.js"></script>
```
### The HTML
Add the directive `<item-swipe>`:
```html
<item-swipe ng-repeat="item in vm.items"
            item="item"
            on-respond="vm.respondItem(item)"
            on-remove="vm.removeItem($index)">

  <div class="item-content">
    <img ng-src="{{ ::item.img }}">
    <h3 class="text-title">{{ ::item.title }}</h3>
    <p class="text-detail"> {{ ::item.detail }}</p>
  </div>
</item-swipe>
```
### Create `vm.items` in a controller:

```javascript
angular
  .module('app')
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

    vm.respondItem = function(item) {
      console.log(item.title + ' ' + item.response);
    };
    vm.removeItem = function(index) {
     vm.items.splice(index, 1);
    };
  }
```

### Don't forget to create the module:

```javascript
angular
  .module('app', ['ionic', 'ngTouch'])
  .config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: 'views/ionic-swipe.html',
        controller: 'ListCtrl as vm'
    });
  $urlRouterProvider.otherwise('home');

  })
```
