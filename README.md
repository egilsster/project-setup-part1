## Setting up an AngularJS project with webpack

# Requirements

Download and install Node.js from https://nodejs.org/en/download/

Now we use npm to install the following packages globally.

```sh
npm install -g webpack typescript
```

# Steps

Setting up the project with npm

```sh
npm init -y
```

This creates a package.json file with all the defaults.

Lets start by installing angular, angular-ui-router, typescript and webpack:

```sh
npm install angular angular-ui-router -S
npm install webpack -D
npm install @types/angular @types/angular-ui-router -D
```

I install angular and ui-router as dependencies since the project needs it to run. I install webpack and typescript as dev dependency because we only use webpack to develop, same with the types.

Now there are a lot of files that git wants to add to the repo, most of them from node modules, which we never want to have inside our repo, lets create a gitignore to fix that. Add this to your .gitignore file

```sh
node_modules/
dist/
```

Now we need to set up the folder structure for angular. Lets create a src folder for our TypeScript code, lets add index.ts and index.html inside that. Lets also create a home module, create a folder called home and create index.ts inside that.


To start coding TypeScript, lets add tsconfig.json to configure how the TypeScript compiler handles our code. Create tsconfig.json in the root and put this in:

```sh
{
  "compilerOptions": {
    "target": "es5",
    "noImplicitAny": false,
    "removeComments": true,
    "sourceMap": true,
    "module": "commonjs",
    "experimentalDecorators": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
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

```typescript
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

```html
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

```typescript
import { IUrlRouterProvider } from 'angular-ui-router';

routing.$inject = ['$urlRouterProvider'];

export function routing($urlRouterProvider: IUrlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
}
```

Now lets create a simple module, the home module. Add this to index.ts:

```typescript
import * as angular from 'angular';

import { routes } from './home.routes';
import { HomeCtrl } from './home.controller';

export const homeModule = angular.module('home', [])
    .config(routes)
    .controller('HomeCtrl', HomeCtrl)
    .name;
```

Lets create the routing for this module, put this in home.routes.ts:

```typescript
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

require is a common js syntax, it basically takes everything inside the required file and puts it where you require it. We need to add a definition for it because its not a typescript syntax. Create typings.d.ts inside src:

```typescript
declare function require(string: string): any;
```

Lets add the home controller, create home.controller.ts:

```typescript
export class HomeCtrl {
    constructor() { }
}
```

Lets create the html for this module, which I am requiring as the template, create home.html with this:

```html
<p>Hello from Home module</p>
```

Lets set up webpack now to bundle all this code into JS. Create a webpack directory in the root, create loaders.js and webpack.dev.js, first we need to install the webpack loaders and browser sync for webpack:

```sh
 npm i -D browser-sync browser-sync-webpack-plugin css-loader ts-loader raw-loader style-loader html-webpack-plugin
```

loaders.js

```javascript
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

```javascript
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

That should be it, lets add a script property to package.json so webpack runs with our config:

```json
"start": "webpack --config webpack/webpack.dev.js --watch"
```

Lets run npm start. Oh boy, it complains JQuery isnt found, angular uses jquery lite so lets add the jquery library and typings for that.

```sh
npm i -S jquery
npm i -D @types/jquery
```

And additionally to compile the project we need to add the typescript package locally

```sh
npm install -D typescript
```

Now lets run npm start. This should run without warnings and fire up a browser. But I dont see anything and no errors are in the console. That is because we havent added the home module to our main module. Lets do that:

We are exporting the name of the module in index, so we can import the module into index.ts in the root of src and the variable we import has a string which is the name of the module. Our index.ts should look like this now:

```typescript
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
