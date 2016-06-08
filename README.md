## Setting up an AngularJS project with webpack


# Steps

Setting up the project with npm and typings

```sh
npm init
typings init
```

Press enter on everything, then you have a package.json file and typings.json

Lets start by installing angular, angular-ui-router and webpack:

```sh
npm install angular angular-ui-router -S
npm install webpack -D
typings install dt~angular dt~angular-ui-router -SG
```

I install angular and ui-router as dependencies since the project needs it to run. I install webpack as dev dependency because we only use webpack to develop.

Now there are a lot of files that git wants to add to the repo, most of them from node modules, which we never want to have inside our repo, lets create a gitignore to fix that. Add these two lines to your .gitignore file

```sh
node_modules/
typings/
```

Now we need to set up the folder structure for angular.

