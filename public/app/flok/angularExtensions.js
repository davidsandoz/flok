/**
 * Adds the ngFocus and ngFocusLost attributes.
 * See http://stackoverflow.com/questions/14859266/input-autofocus-attribute
 */
angular.module('ng').directive('ngFocus', function($timeout) {
    'use strict';

    return {
        link: function(scope, element, attrs) {
            scope.$watch(attrs.ngFocus, function(val) {
                if (angular.isDefined(val) && val) {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            }, true);

            element.bind('blur', function() {
                if (angular.isDefined(attrs.ngFocusLost)) {
                    scope.$apply(attrs.ngFocusLost);

                }
            });
        }
    };
});