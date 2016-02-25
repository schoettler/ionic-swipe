'use strict';

angular
  .module('app')
  .directive('itemSwipe', itemSwipe);

  itemSwipe.$inject = ['$document', '$ionicScrollDelegate', '$swipe',
                       '$timeout', '$window'];

function itemSwipe($document, $ionicScrollDelegate, $swipe, $timeout, $window) {

  return {
    transclude: true,
    templateUrl: 'views/item-swipe.html',
    restrict: 'E',
    scope: {
      item: '=',
      onRemove: '&',
      onRespond: '&'
    },
    link: {
      post:
        function postLink(scope, iElement, iAttrs, controller) {
          var startCoords,
              $swiper,
              $item;

          $swiper = angular.element(iElement[0].querySelector('.swiper'));
          $item = angular.element(iElement[0].querySelector('.item-content'));

          scope.proceed = false;
          scope.undoStyle = {
            'display': 'none'
          };

          scope.undo = function() {
            $timeout.cancel(scope.archive);
            $timeout.cancel(scope.trash);
            console.log('Action undone');
            scope.proceed = false;
          };

        function fullLeftSwipe(coords) {

          return coords.x - startCoords.x < -1*($swiper[0].scrollWidth*(1/7)) ? true : false;
        }

        function fullRightSwipe(coords) {

          return coords.x - startCoords.x > $swiper[0].scrollWidth*(1/7) ? true : false;
        }

        function trashStyle() {

          scope.wrapperStyle = {
            'background-color': '#C95F63'
          };
          scope.trashStyle = {
            'display': 'block'
          };
          scope.archiveStyle = {
            display: 'none'
          };
        }

        function archiveStyle() {

          scope.wrapperStyle = {
            'background-color': '#43A773'
          };
          scope.archiveStyle = {
            display: 'block'
          };
          scope.trashStyle = {
            display: 'none'
          };
        }

        function blankStyle() {

          scope.wrapperStyle = {
            'background-color': '#FFFFFF'
          };
          scope.trashStyle = {
            display: 'none'
          };
          scope.archiveStyle = {
            display: 'none'
          };
        }

        function cssPrefix(property, value) {
          var vendors = ['', '-o-','-moz-','-ms-','-khtml-','-webkit-'];
          var styles = {};

          for (var i = vendors.length - 1; i >= 0; i--) {
            styles[vendors[i] + property] = value;
          }
          return styles;
        }

        function updateElementPosition(pos) {

          $swiper.css('left',pos + 'px');
        }

        scope.$watch('proceed', function(proceed) {

          if (proceed) {
            scope.undoStyle = {
              'display': 'inline',
              'position': 'absolute',
              'left': '47.5%',
              'top': '18%'
            };
            scope.onRespond();
          } else {
            scope.undoStyle = {
              'display': 'none'
            };
            updateElementPosition(0);
            blankStyle();
          }
        });

        $swipe.bind($swiper, {

          'start': function(coords) {
            updateElementPosition(0);
            startCoords = coords;
            blankStyle();
            scope.swiperStyle = {
              'opacity': 0.75,
              'z-index': 2
            };
            scope.$apply();
          },

          'cancel': function() {
            updateElementPosition(0);
            scope.swiperStyle = cssPrefix('transition', 'all 0.2s ease-in-out');
            scope.swiperStyle.opacity = 1;
            scope.$apply();
          },

          'move': function(coords) {
            if (coords.x > startCoords.x)
              trashStyle();
            else if (coords.x < startCoords.x)
              archiveStyle();

            // Prevent vertical scrolling while swiping
            $ionicScrollDelegate.freezeScroll(true);
            scope.$apply();
            updateElementPosition(coords.x - startCoords.x);
          },

          'end': function(endCoords) {

            if (fullRightSwipe(endCoords)) {
              // Marked as trash.
              updateElementPosition(document.body.clientWidth);
              scope.proceed = true;
              scope.item.response = 'sent to trash';

              scope.trash = $timeout(function() {
                scope.onRemove();
              }, 3000);
            } else if (fullLeftSwipe(endCoords)) {
              // Marked as archive.
              updateElementPosition(-1* document.body.clientWidth);
              scope.proceed = true;
              scope.item.response = 'sent to archive';

              scope.archive = $timeout(function() {
                scope.onRemove();
              }, 3000);
            } else {
              scope.proceed = false;
              updateElementPosition(0);
              blankStyle();
            }
            scope.swiperStyle = cssPrefix('transition', 'all 0.4s ease-in-out');
            scope.swiperStyle.opacity = 1;
            scope.$apply();
          }
        });
      }
    }
  };
}
