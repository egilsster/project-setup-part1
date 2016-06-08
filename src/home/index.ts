'use strict';

import * as angular from 'angular';

import { routes } from './home.routes';
import { HomeCtrl } from './home.controller';

export const homeModule = angular.module('home', [])
    .config(routes)
    .controller('HomeCtrl', HomeCtrl)
    .name;