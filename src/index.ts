'use strict';

import * as angular from 'angular';
import 'angular-ui-router';


const requires: string[] = [
    'ui.router',
];

angular.module('app', requires);

angular.bootstrap(document, ['app'], {
    strictDi: true
});