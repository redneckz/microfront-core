# [React] Demo of Omni-Container

Omni-container provides and consumes remote modules. Such a container may consist of "local" micro frontends.

## How-to

```shell
$ yarn # install deps
$ yarn start # http://localhost:8080
```

## Description

Please take a look at the following major parts:

-   `webpack.config.js` - module federation setup
-   `src/components/Home/Home.bootstrap.tsx` - micro frontend wrapper of `Home.tsx`
-   `src/components/FeaturedPostsList/FeaturedPostsList.bootstrap.tsx` - micro frontend wrapper of `FeaturedPostsList.tsx`
-   `src/components/App.tsx` - host container definition (see bootstrap functions)
-   And, finally `src/typings.d.ts` - some placeholders to make TypeScript happy

### Styles isolation

-   `src/components/Home/Home.css` - micro frontend style
-   `webpack.config.js`

```js
{
    test: /\.css$/i,
    use: [{ loader: 'style-loader', options: { insert: insertStyle } }, 'css-loader']
}
```

At runtime inspect Home section for styles under the shadow root.

## Requirements

-   `React 17` to support rendering to Shadow DOM
-   `Webpack 5` (all plugins should be updated to the latest versions)
-   Do not forget to define `publicPath: '...'` and use `@redneckz/module-federation-utils`

# License

[MIT](http://vjpr.mit-license.org)
