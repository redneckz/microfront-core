const webpack = require('webpack');
const { moduleFederationOptions } = require('@redneckz/module-federation-utils');

module.exports = {
    publicPath: 'http://localhost:8090/',
    devServer: {
        port: 8090
    },
    configureWebpack: {
        plugins: [
            new webpack.container.ModuleFederationPlugin(
                moduleFederationOptions({
                    name: 'vueHost',
                    shared: {
                        vue: {
                            eager: true,
                            singleton: true,
                            requiredVersion: '^3.0.0'
                        }
                    },
                    remotes: [['reactHost', 'http://localhost:8080']]
                })
            )
        ]
    }
};
