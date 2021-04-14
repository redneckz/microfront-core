# microfront-toolset

Microfrontend toolset

[![NPM Version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Bundle size][bundlephobia-image]][bundlephobia-url]

# Packages

[Microfrontend Core Library](./packages/microfront-core/README.md)

[Microfrontend Core Library for React](./packages/microfront-core-react/README.md)

[Webpack Module Federation Utils](./packages/module-federation-utils/README.md)

# Get Started

## Step #1 Install

Webpack 5 utils:

`$ npm install --save-dev @redneckz/module-federation-utils`

Micro frontend core:

`$ npm install --save @redneckz/microfront-core`

## Step #2 Migrate to Webpack 5

https://webpack.js.org/migrate/5/

## Step #3 Configure Module Federation Plugin

In order to share micro frontends across containers Webpack Module Federation Plugin should be configured.

More info here https://webpack.js.org/concepts/module-federation/

### Host Container

Host container is a kind of orchestrator. It loads remote modules by means of Module Federation and places every module into a dedicated slot of layout.

```js
const webpack = require('webpack');
const { moduleFederationOptions, shareScope } = require('@redneckz/module-federation-utils');

module.exports = {
  output: {
    ...
    uniqueName: 'host',
    // "publicPath" is required and should depend on environment
    publicPath: 'https://host-domain/'
  },
  ...
  plugins: [
    ...
    new webpack.container.ModuleFederationPlugin(
      moduleFederationOptions({
        name: 'host',
        // Remote containers
        remotes: [
          ['foo', 'https://foo-domain'],
          ['bar', 'https://bar-domain']
        ],
        // Packages shared across containers
        shared: shareScope(require('./package.json'), '@angular')
      })
    ),
  ],
};
```

### Micro Frontend Container

```js
const webpack = require('webpack');
const { moduleFederationOptions, shareScope, insertStyleSafely } = require('@redneckz/module-federation-utils');

module.exports = {
  output: {
    ...
    uniqueName: 'foo',
    publicPath: 'https://foo-domain/'
  },
  ...
  plugins: [
    ...
    new MiniCssExtractPlugin({
      filename: '[name].css',
      // Custom insert is required in order to isolate micro frontends from each other
      // In context of host container styles should be inserted into mounting root
      insert: insertStyleSafely('foo')
    }),
    ...
    new webpack.container.ModuleFederationPlugin(
      moduleFederationOptions({
        name: 'foo',
        // These modules can be loaded by any host container
        exposes: {
          './foo-page': './src/pages/foo-page/foo-page.tsx',
          './other-page': './src/pages/other-page/other-page.tsx'
        }
        // Packages shared across containers
        shared: shareScope(require('./package.json'), 'react')
      })
    ),
  ],
};
```

## Step #4 [React] Host Container

TODO

## Step #4 [Angular] Host Container

```ts
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Implement angular wrapper
import { MicroIsolationModule } from '@redneckz/microfront-angular';

@Component({
    // "micro-shadow" should be provided by MicroIsolationModule
    template: '<micro-shadow name="foo" path="path/to/foo" [module]="module"></micro-shadow>'
})
export class FooShadowComponent {
    module = () => import('foo/foo-page');
}

const routes: Routes = [
    ...,
    {
        path: 'path/to/foo',
        children: [{
            path: '**',
            component: FooShadowComponent
        }]
    }
];

@NgModule({
    declarations: [FooShadowComponent],
    imports: [RouterModule.forRoot(routes), MicroIsolationModule],
    exports: [RouterModule]
})
export class AppRoutingModule {}
```

## Step #5 Containers Isolation

Remote modules should be isolated from each other in terms of `DOM/CSS/JS/API`.

`Shadow DOM` can be used to isolate `DOM/CSS`. `API` isolation could be achieved by means of `iframe` (sandbox). But `iframe` approach comes with bunch of drawbacks.

Thats why `API` isolation should be provided by this lightweight framework ;) in the near future...

# License

[MIT](http://vjpr.mit-license.org)

[npm-image]: https://badge.fury.io/js/%40redneckz%2Fmicrofront-core.svg
[npm-url]: https://www.npmjs.com/package/%40redneckz%2Fmicrofront-core
[build-image]: https://cloud.drone.io/api/badges/redneckz/microfront-core/status.svg
[build-url]: https://cloud.drone.io/redneckz/microfront-core
[coverage-image]: https://codecov.io/gh/redneckz/microfront-core/branch/main/graph/badge.svg?token=WMWRVVHT0C
[coverage-url]: https://codecov.io/gh/redneckz/microfront-core
[bundlephobia-image]: https://badgen.net/bundlephobia/min/@redneckz/microfront-core
[bundlephobia-url]: https://bundlephobia.com/result?p=@redneckz/microfront-core
