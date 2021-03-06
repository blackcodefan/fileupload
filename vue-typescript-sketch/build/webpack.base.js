const path = require('path');
const webpack = require('webpack');
const TscofigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');
const config = require('../config');

module.exports = {
    context: path.resolve(__dirname, '../'),
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['.css', '.js', '.ts', '.vue'],
        plugins: [
            new TscofigPathsPlugin()
        ]
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader'
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(config.env),
            'process.env.API_PATH': JSON.stringify(config.apiPath),
            'process.env.WEB_KEY': process.env.WEB_KEY
        }),
        new VueLoaderPlugin(),
    ]
};
