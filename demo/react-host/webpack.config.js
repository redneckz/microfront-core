const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { moduleFederationOptions } = require('@redneckz/module-federation-utils');
const { insertStyle } = require('@redneckz/microfront-core');

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
            },
            {
                test: /\.css$/i,
                use: [{ loader: 'style-loader', options: { insert: insertStyle } }, 'css-loader']
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
            title: 'Micro Frontend Host Container',
            excludeChunks: ['reactHost']
        }),
        new webpack.container.ModuleFederationPlugin({
            ...moduleFederationOptions({
                name: 'reactHost',
                exposes: {
                    './Header': './src/components/Header/Header.bootstrap.tsx',
                    './FeaturedPostsList': './src/components/FeaturedPostsList/FeaturedPostsList.bootstrap.tsx',
                    './Home': './src/components/Home/Home.bootstrap.tsx'
                },
                shared: {
                    react: {
                        eager: true,
                        singleton: true,
                        requiredVersion: '^17.0.0'
                    },
                    'react-dom': {
                        eager: true,
                        singleton: true,
                        requiredVersion: '^17.0.0'
                    },
                    'react-router-dom': {
                        eager: true,
                        singleton: true,
                        requiredVersion: '^5.0.0'
                    }
                }
            }),
            remotes: ['reactHost']
        })
    ]
};
