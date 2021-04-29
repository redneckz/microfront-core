# @redneckz/microfront-core-react

Microfrontend Core Library for React

[![NPM Version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Bundle size][bundlephobia-image]][bundlephobia-url]

# Installation

```bash
$ npm install --save @redneckz/microfront-core-react
```

or:

```bash
$ yarn add @redneckz/microfront-core-react
```

# Usage

## How to define micro frontend module

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

## How to isolate global API relative to micro frontend instance

```tsx
import React, { useCallback } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { useContainer } from '@redneckz/microfront-core-react';

export const Header: React.FC = () => {
    // Outside of micro frontend context returns identity function
    const container = useContainer();

    const onSignUp = useCallback(
        container(() => {
            // isolation is here
        }),
        []
    );

    return (
        <Toolbar>
            <Button onClick={onSignUp}>Sign up</Button>
        </Toolbar>
    );
};
```

## How to retrieve micro frontend params

```tsx
import React from 'react';
import { useMicroFrontParams } from '@redneckz/microfront-core-react';

export const Page: React.FC = () => {
    const params = useMicroFrontParams();
    return params ? (
        <article>This page is rendered as a micro frontend on the route `{params.route}`</article>
    ) : (
        <article>This page is rendered as a regular page</article>
    );
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
