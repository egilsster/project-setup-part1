'use strict';

import { IScope } from 'angular';

const deps: string[] = [
    '$scope'
];

export class HomeCtrl {
    constructor(
        private $scope: IScope
    ) {
    }
}

HomeCtrl.$inject = deps;