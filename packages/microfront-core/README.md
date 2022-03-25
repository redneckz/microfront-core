# @redneckz/microfront-core

Microfrontend Core Library

[![NPM Version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Bundle size][bundlephobia-image]][bundlephobia-url]

# Installation

```bash
$ npm install --save @redneckz/microfront-core
```

or:

```bash
$ yarn add @redneckz/microfront-core
```

# Usage

## Micro Frontend Listeners

You can register state listener at any point bound to micro frontend `zone` in your code:

```ts
import { addMicroFrontListener } from '@redneckz/microfront-core';

addMicroFrontListener('fetched', ({ name }) => { ... });
addMicroFrontListener('bootstrapped', ({ name }) => { ... });
addMicroFrontListener('mounted', ({ name }) => { ... });
addMicroFrontListener('unmounted', ({ name }) => { ... });
addMicroFrontListener('style_fetched', ({ style }) => { ... });
addMicroFrontListener('style_mounted', ({ style }) => { ... });
```

# License

[MIT](http://vjpr.mit-license.org)

[npm-image]: https://badge.fury.io/js/%40redneckz%2Fmicrofront-core.svg
[npm-url]: https://www.npmjs.com/package/%40redneckz%2Fmicrofront-core
[build-image]: https://github.com/redneckz/microfront-core/actions/workflows/build-test.yml/badge.svg
[build-url]: https://github.com/redneckz/microfront-core/actions/workflows/build-test.yml
[coverage-image]: https://coveralls.io/repos/github/redneckz/microfront-core/badge.svg?branch=main
[coverage-url]: https://coveralls.io/github/redneckz/microfront-core?branch=main
[bundlephobia-image]: https://badgen.net/bundlephobia/min/@redneckz/microfront-core
[bundlephobia-url]: https://bundlephobia.com/result?p=@redneckz/microfront-core
