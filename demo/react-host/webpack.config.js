const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { moduleFederationOptions, shareScope } = require('@redneckz/module-federation-utils');

module.exports = {
    entry: './src/index.ts',
    output: {
        uniqueName: 'reactHost',
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        publicPath: 'http://localhost:8080/',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Micro Frontend Host Container'
        }),
        new webpack.container.ModuleFederationPlugin({
            ...moduleFederationOptions({
                name: 'reactHost',
                exposes: {
                    './home': './src/components/Home.bootstrap.tsx'
                },
                shared: shareScope(require('./package.json'), 'react')
            }),
            remotes: ['reactHost']
        })
    ]
};
