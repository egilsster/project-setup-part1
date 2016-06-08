'use strict';

import { IStateService, IUrlRouterProvider } from 'angular-ui-router';

routing.$inject = ['$urlRouterProvider'];

export function routing($urlRouterProvider: IUrlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
}