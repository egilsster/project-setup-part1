## Setting up an AngularJS project with webpack

# Requirements

Download and install Node.js from https://nodejs.org/en/download/

```sh
npm install webpack -g
npm install -g typescript
npm install typings --global
```

# Steps

Setting up the project with npm and typings

```sh
npm init
typings init
```

Press enter on everything, then you have a package.json file and typings.json

Lets start by installing angular, angular-ui-router, typescript and webpack:

```sh
npm install angular angular-ui-router -S
npm install webpack typings -D
typings install dt~angular dt~angular-ui-router -SG
```

I install angular and ui-router as dependencies since the project needs it to run. I install webpack and typescript as dev dependency because we only use webpack to develop.

Now there are a lot of files that git wants to add to the repo, most of them from node modules, which we never want to have inside our repo, lets create a gitignore to fix that. Add these two lines to your .gitignore file

```sh
node_modules/
typings/
```

Now we need to set up the folder structure for angular. Lets create a src folder for our TypeScript code, lets add index.ts and index.html inside that. Lets also create a home module, create a folder called home and create index.ts inside that.


To start coding TypeScript, lets add tsconfig.json so we can import all the typings and what not. Create tsconfig.json in the root and put this in:

```sh
{
  "compilerOptions": {
    "target": "es5",
    "noImplicitAny": false,
    "removeComments": true,
    "sourceMap": true,
    "module": "commonjs",
    "experimentalDecorators": true,
    "outDir": "out"
  },
  "exclude": [
    "out",
    "node_modules",
    "dist"
  ]
}
```

Now add this code to index.ts in src/

```sh
'use strict';

import * as angular from 'angular';
import 'angular-ui-router';

import { routing } from './index.config';

const requires: string[] = [
    'ui.router',
];

angular.module('app', requires).config(routing);

angular.bootstrap(document, ['app'], {
    strictDi: true
});
```

Add this to index.html

```sh
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>App</title>
</head>

<body>
    <div ui-view>
        <!-- Views get injected here -->
    </div>
</body>

</html>
});
```

Create index.config.ts in src folder and add this code:

```sh
'use strict';

import { IStateService, IUrlRouterProvider } from 'angular-ui-router';

routing.$inject = ['$urlRouterProvider'];

export function routing($urlRouterProvider: IUrlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
}
```

Now lets create a simple module, the home module. Add this to index.ts:

```sh
'use strict';

import * as angular from 'angular';

import { routes } from './home.routes';
import { HomeCtrl } from './home.controller';

export const homeModule = angular.module('home', [])
    .config(routes)
    .controller('HomeCtrl', HomeCtrl)
    .name;
```

Lets create the routing for this module, put this in home.routes.ts:

```sh
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
```

require is a commonjs syntax, it basically takes everything inside the required file and puts it where you require it. We need to add a definition for it because its not a typescript syntax. Create typings.d.ts inside src:

```sh
declare function require(string: string): string;
```

Lets add the home controller, create home.controller.ts:

```sh
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
```

Lets create the html for this module, which I am requiring as the template, create home.html with this:

```sh
<p>Hello from Home module</p>
```

Lets set up webpack now to bundle all this code into JS. Create a webpack directory in the root, create loaders.js and webpack.dev.js, first we need to install the webpack loaders and browser sync for webpack:

```sh
 npm i -D browser-sync browser-sync-webpack-plugin css-loader ts-loader raw-loader style-loader html-webpack-plugin
```

loaders.js

```sh
module.exports = [
    {
        test: /\.ts(x?)$/,
        loader: 'ts-loader'
    },
    {
        test: /\.scss$/,
        loader: 'style!css!sass'
    },
    {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'raw'
    }
];
```

webpack.dev.js

```sh
var loaders = require('./loaders');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    entry: ['./src/index.ts'],
    output: {
        filename: 'build.js',
        path: 'dist'
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js', '.json']
    },
    resolveLoader: {
        modulesDirectories: ['node_modules']
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
            hash: true
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 8080,
            server: {
                baseDir: 'dist'
            },
            ui: false,
            online: false,
            notify: false
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.jquery': 'jquery'
        })
    ],
    module: {
        loaders: loaders
    }
};
```

That should be it, lets add a script to run webpack with our config:

```sh
"start": "webpack --config webpack/webpack.dev.js --watch"
```

Lets run npm start. Oh boy, it complains JQuery isnt found, angular uses jquery lite so lets add the jquery library and typings for that.

```sh
npm i -S jquery
typings i -SG jquery
```

Now lets run npm start. This should run without warnings and fire up a browser. But I dont see anything and no errors are in the console. That is because we havent added the home module to our main module. Lets do that:

We are exporting the name of the module in index, so we can import the module into index.ts in the root of src and the variable we import has a string which is the name of the module. Our index.ts should look like this now:

```sh
'use strict';

import * as angular from 'angular';
import 'angular-ui-router';

import { routing } from './index.config';

import { homeModule } from './Home'; // import the module

const requires: string[] = [
    'ui.router',
    homeModule // add it to the app module
];

angular.module('app', requires).config(routing);

angular.bootstrap(document, ['app'], {
    strictDi: true
});
```

If you have the npm start command running, then the app should have updated and should display the text inside home/home.html

Now git wants to add our comiled things to the repo, which we dont want, so lets add dist/ to gitignore.