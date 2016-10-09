import * as angular from 'angular';
import 'angular-ui-router';

import { routing } from './index.config';

import { homeModule } from './Home';

const requires: string[] = [
    'ui.router',
    homeModule
];

angular.module('app', requires).config(routing);

angular.bootstrap(document, ['app'], {
    strictDi: true
});