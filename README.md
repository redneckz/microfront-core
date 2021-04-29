# microfront-toolset

Microfrontend toolset

[![pipeline status](https://devrshb.tech:18443/public-core-solutions/micro-frontend/micro-frontend-core/badges/main/pipeline.svg?ignore_skipped=true)](https://devrshb.tech:18443/public-core-solutions/micro-frontend/micro-frontend-core/-/commits/main)
[![coverage report](https://devrshb.tech:18443/public-core-solutions/micro-frontend/micro-frontend-core/badges/main/coverage.svg)](https://devrshb.tech:18443/public-core-solutions/micro-frontend/micro-frontend-core/-/commits/main)

# How-to

```shell
$ yarn # Prepare
$ yarn build # Build all packages
$ yarn test # Test all packages
$ yarn workspace @redneckz/microfront-core build # Build specific package
$ yarn workspace @redneckz/microfront-core test # Test specific package
```

# Release Flow

https://yarnpkg.com/features/release-workflow

```shell
$ yarn version check --interactive
```

# Packages

[Micro Frontend Core Library](./packages/microfront-core/README.md)

[Micro Frontend Core Library for React](./packages/microfront-core-react/README.md)

[Webpack Module Federation Utils](./packages/module-federation-utils/README.md)

# Containers Isolation

Remote modules should be isolated from each other in terms of `DOM/CSS/JS/API`.

`Shadow DOM` can be used to isolate `DOM/CSS`. `API` isolation could be achieved by means of `iframe` (sandbox). But `iframe` approach comes with a bunch of drawbacks.

Support of different isolation levels is the major feature of this lightweight framework ;)

Currently, only `Shadow DOM` isolation level is supported.

# Get Started

## Step #1 Install

Webpack 5 utils:

`$ npm install --save-dev @redneckz/module-federation-utils`

Micro frontend core:

`$ npm install --save @redneckz/microfront-core`

## Step #2 Migrate to Webpack 5

https://webpack.js.org/migrate/5/

## Step #3 Configure Module Federation Plugin

To share micro frontends across containers, Webpack Module Federation Plugin should be configured.

More info here https://webpack.js.org/concepts/module-federation/

### Host Container Configuration

Host container is a kind of orchestrator. It loads remote modules by means of Module Federation and places every module into a dedicated slot of the layout.

```js
const webpack = require('webpack');
const { moduleFederationOptions } = require('@redneckz/module-federation-utils');

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
        ]
      })
    ),
  ],
};
```

### Micro Frontend Container Configuration

```js
const webpack = require('webpack');
const { moduleFederationOptions } = require('@redneckz/module-federation-utils');
const { insertStyle } = require('@redneckz/microfront-core');

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
      insert: insertStyle
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
      })
    ),
  ],
};
```

## Step #4 [React] Host Container

```tsx
import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';

import { register } from '@redneckz/microfront-core';
import { MicroFrontInShadow } from '@redneckz/microfront-core-react';

const bootstrapFoo = register(
    'foo', // remote module name according to Module Federation config
    () => import('foo/foo-page') //  remote module
);

export const App: React.FC = () => (
    <Switch>
        <Route path="path/to/foo">
            <MicroFrontInShadow route="path/to/foo" bootstrap={bootstrapFoo}>
                {mountingRootRef => <div ref={mountingRootRef}>Loading...</div>}
            </MicroFrontInShadow>
        </Route>
        ...
    </Switch>
);
```

## Step #4 [Angular] Host Container

TODO Implement @redneckz/microfront-core-angular

```ts
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { register } from '@redneckz/microfront-core';
import { MicroFrontCoreModule } from '@redneckz/microfront-core-angular';

const bootstrapFoo = register(
    'foo', // remote module name according to Module Federation config
    () => import('foo/foo-page') //  remote module
);

@Component({
    // "microfront-in-shadow" is a part of "MicroFrontCoreModule"
    template: '<microfront-in-shadow route="path/to/foo" [bootstrap]="bootstrap"></microfront-in-shadow>'
})
export class FooInShadowComponent {
    bootstrap = bootstrapFoo;
}

const routes: Routes = [
    ...,
    {
        path: 'path/to/foo', // remote module root route
        children: [{
            path: '**',
            component: FooInShadowComponent
        }]
    }
];

@NgModule({
    declarations: [FooInShadowComponent],
    imports: [RouterModule.forRoot(routes), MicroFrontCoreModule],
    exports: [RouterModule]
})
export class AppRoutingModule {}
```

## Step #5 [React] Micro Frontend

```tsx
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Router } from 'react-router-dom';

import { container, MicroFrontModuleBootstrap } from '@redneckz/microfront-core';
import { Container } from '@redneckz/microfront-core-react';

// Each and every micro frontend should implement async "bootstrap" function
export const bootstrap: MicroFrontModuleBootstrap = async ({ route: rootRoute }) => {
    // Global stuff can be lazily loaded here
    const { App } = await import('./App');
    const { createBrowserHistory } = await import('history');

    // Relative to MF root route
    const history = createBrowserHistory({ basename: rootRoute });

    return {
        mount: async mountingRoot => {
            render(
                <Container instance={container()}>
                    <Router history={history}>
                        <App />
                    </Router>
                </Container>,
                mountingRoot
            );
        },
        unmount: async mountingRoot => {
            unmountComponentAtNode(mountingRoot);
        }
    };
};
```

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
