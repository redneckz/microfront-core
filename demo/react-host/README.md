# [React] Demo of Omni-Container

Omni-container provides and consumes remote modules. Such a container may consist of "local" micro frontends.

## How-to

```shell
$ yarn # install deps
$ yarn start # http://localhost:8080
```

## Description

-   `React 17` to support rendering to Shadow DOM
-   `Webpack 5` (all plugins should be updated to the latest versions)
-   Do not forget to define `publicPath: '...'` and use `@redneckz/module-federation-utils`

Please take a look at the following major parts:

-   `webpack.config.js` - module federation setup
-   `src/components/Home/Home.bootstrap.tsx` - micro frontend wrapper of `Home.tsx`
-   `src/components/FeaturedPostsList/FeaturedPostsList.bootstrap.tsx` - micro frontend wrapper of `FeaturedPostsList.tsx`
-   `src/components/App.tsx` - host container definition (see bootstrap functions)
-   And, finally `src/typings.d.ts` - some placeholders to make TypeScript happy

## Styles isolation

-   `src/components/Home/Home.css` - micro frontend style
-   At runtime, inspect `Home` section for the very first style isolated by shadow root.

## Google Tag Manager

If you want to collect stats with [Google Tag Manager](https://developers.google.com/tag-manager?hl=ru) in context of micro frontend bound to parental container, take a look at the following:

-   `demo/react-host/src/index.ejs` - _GTM_ for React host container
-   `demo/react-host/src/components/Header/Header.bootstrap.tsx` - dynamic _GTM_ registration for `Header` micro frontend
-   `demo/react-host/src/components/Header/Header.tsx` - login/logout _GTM_ events
-   `demo/vue-host/public/index.html` - _GTM_ for Vue host container

In order to have several MFs bound to corresponding _GTM_ accounts at once, [data layer abstraction](https://developers.google.com/tag-manager/devguide?hl=ru#datalayer) could be used.

Declare unique data layer for each host container and MF. For example:

```ts
const webpackConfig = {
    ...,
    plugins: [
        new webpack.container.ModuleFederationPlugin(
            moduleFederationOptions({
                // Unique host container name
                name: 'reactHost',
                ...
            })
        )
    ]
};

/* Google Tag Manager */
(() => {
    const id = 'GTM-XXXXXXX';
    // Host container name with suffix "DL"
    const dataLayer = 'reactHostDL';
    // Skip insert of GTM if it was already inserted
    if ((globalThis as any)[dataLayer]) return;
    (globalThis as any)[dataLayer] = [{ 'gtm.start': new Date().getTime(), event: 'gtm.js' }];
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${id}&l=${dataLayer}`;
    document.body.appendChild(script);
})();
/* End Google Tag Manager */
```

Several _GTM_ containers (bound to different ids) can coexist according to spec https://developers.google.com/tag-manager/devguide?hl=ru#multiple-containers

# License

[MIT](http://vjpr.mit-license.org)
