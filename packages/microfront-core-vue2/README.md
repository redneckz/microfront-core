# @redneckz/microfront-core-vue2

Microfrontend Core Library for Vue 2

[![NPM Version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Bundle size][bundlephobia-image]][bundlephobia-url]

# Installation

```bash
$ npm install --save @redneckz/microfront-core @redneckz/microfront-core-vue2 @vue/composition-api
```

or:

```bash
$ yarn add @redneckz/microfront-core @redneckz/microfront-core-vue2 @vue/composition-api
```

# Usage

```ts
// Isolation setup (including Zone.js)
import '@redneckz/microfront-core/lib/configure';

import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import microfront from '@redneckz/microfront-core-vue2';

import App from './App.vue';

Vue.use(VueCompositionAPI).use(microfront);

new Vue({
    el: '#app',
    components: { App }
});
```

```vue
<template>
    <MicroFrontContainer :bootstrap="bootstrapFoo">
        <div ref="mountingRoot">Loading...</div>
    </MicroFrontContainer>
</template>

<script lang="ts">
import Vue from 'vue';
import { register } from '@redneckz/microfront-core';
import { MicroFrontContainer } from '@redneckz/microfront-core-vue2';

const bootstrapFoo = register(
    'foo', // remote module name according to Module Federation config
    () => import('foo/module') //  remote module
);

export default Vue.extend({
    name: 'App',
    components: { MicroFrontContainer },
    methods: { bootstrapFoo }
});
</script>
```

# License

[MIT](http://vjpr.mit-license.org)

[npm-image]: https://badge.fury.io/js/%40redneckz%2Fmicrofront-core-vue2.svg
[npm-url]: https://www.npmjs.com/package/%40redneckz%2Fmicrofront-core-vue2
[build-image]: https://github.com/redneckz/microfront-core/actions/workflows/build-test.yml/badge.svg
[build-url]: https://github.com/redneckz/microfront-core/actions/workflows/build-test.yml
[coverage-image]: https://coveralls.io/repos/github/redneckz/microfront-core/badge.svg?branch=main
[coverage-url]: https://coveralls.io/github/redneckz/microfront-core?branch=main
[bundlephobia-image]: https://badgen.net/bundlephobia/min/@redneckz/microfront-core-vue2
[bundlephobia-url]: https://bundlephobia.com/result?p=@redneckz/microfront-core-vue2
