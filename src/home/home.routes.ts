'use strict';

import { IStateProvider } from 'angular-ui-router';

routes.$inject = ['$stateProvider'];

export function routes($stateProvider: IStateProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            template: require('./home.html'),
            controller: 'HomeCtrl as vm'
        });
}