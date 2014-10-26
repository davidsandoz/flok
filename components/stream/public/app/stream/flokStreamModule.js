/**
 * Stream Module
 *
 * @copyright  Nothing Interactive 2014
 */
(function() {
    'use strict';

    /**
     * TODO
     * @type {module}
     */
    var flokStreamModule = angular.module('flokStreamModule', [
        'ngRoute',
        'ui.bootstrap', 'ui.utils', 'pascalprecht.translate', 'onRootScope',
        'flokFilters', 'flokDirectives', 'flokMenuModule', 'ngSanitize'
    ]);
    // TODO remove unnecessary dependencies

    flokStreamModule.config(['$routeProvider', 'menuServiceProvider', function($routeProvider, menuServiceProvider) {
        $routeProvider
            .when('/events', {
                templateUrl: 'app/stream/stream.tpl.html',
                controller: 'StreamCtrl',
                controllerAs: 'stream'
            })
        ;

        menuServiceProvider.addMenuItem(
            {
                url: '/events',
                name: 'Events',
                icon: 'tasks' // TODO what is this ?
            }
        );
    }]);
})();

